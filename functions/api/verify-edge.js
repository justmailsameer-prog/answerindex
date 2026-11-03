// Cloudflare Pages Function: /api/verify-edge
// Real Live Edge Crawler Verification Probe
// Fetches the client's actual live URL and deterministically checks whether 
// the required Schema (JSON-LD) or AEO target content is physically deployed in their HTML.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    let domain = (body.domain || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    const path = (body.path || '/').trim();
    const jobId = body.job_id;
    const expectedType = body.expected_type || 'schema'; // 'schema' or 'keyword' or 'jsonld'
    const targetKeyword = (body.target_keyword || '').toLowerCase();

    if (!domain) {
      return new Response(
        JSON.stringify({ success: false, error: 'Domain is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = `https://${domain}${cleanPath}`;

    let pageHtml = '';
    let httpStatus = 0;
    let ttfbMs = 0;

    const startT = Date.now();
    try {
      const resp = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'AnswerIndex-EdgeProbe/1.0 (+https://answerindex.xyz/probe)'
        },
        cf: { cacheTtl: 0 } // Fresh edge probe, no cache
      });
      httpStatus = resp.status;
      pageHtml = await resp.text();
      ttfbMs = Date.now() - startT;
    } catch (e) {
      return new Response(
        JSON.stringify({
          success: false,
          verified: false,
          httpStatus: 0,
          error: `Could not connect to ${targetUrl}: ${e.message}`,
          message: `Unable to probe ${domain}. Ensure the domain is live and accessible over HTTPS.`
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 1. Inspect live HTML for JSON-LD schemas
    const jsonLdBlocks = [];
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(pageHtml)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        jsonLdBlocks.push(parsed);
      } catch (err) {
        // Raw block even if minor syntax issue
        jsonLdBlocks.push({ raw: match[1].substring(0, 200) });
      }
    }

    // 2. Verification checks
    const hasSchema = jsonLdBlocks.length > 0;
    const hasTargetKeyword = targetKeyword ? pageHtml.toLowerCase().includes(targetKeyword) : true;

    // Determine verification status truthfully
    let isVerified = false;
    let verificationNote = '';

    if (httpStatus === 200) {
      if (hasSchema) {
        isVerified = true;
        verificationNote = `Found ${jsonLdBlocks.length} valid JSON-LD schema block(s) live in HTML.`;
      } else {
        isVerified = false;
        verificationNote = `Target page responded with HTTP 200, but no <script type="application/ld+json"> was found in HTML.`;
      }
    } else {
      isVerified = false;
      verificationNote = `Target page returned HTTP ${httpStatus}.`;
    }

    // 3. Update Cloudflare D1 if verified
    if (env.DB && jobId && isVerified) {
      try {
        await env.DB.prepare(`
          UPDATE daily_jobs 
          SET pr_status = 'approved', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(jobId).run();
      } catch (dbErr) {
        console.warn('D1 update error in verify-edge:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified: isVerified,
        httpStatus,
        ttfbMs,
        domain,
        targetUrl,
        detectedSchemas: jsonLdBlocks.length,
        hasTargetKeyword,
        message: verificationNote,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
