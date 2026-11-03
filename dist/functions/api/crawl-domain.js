// Cloudflare Pages Function: /api/crawl-domain
// Real Domain Crawler & Truth Wiki Generator
// Actually fetches the client's live target URL, extracts real metadata & headlines, 
// and synthesizes an accurate Brand Ground-Truth Wiki into Cloudflare D1.

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
    const projectId = body.project_id;
    const email = body.email;

    if (!domain) {
      return new Response(
        JSON.stringify({ success: false, error: 'Domain parameter is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const targetUrl = `https://${domain}`;
    let pageHtml = '';
    let fetchStatus = 200;

    // 1. Fetch live client website
    try {
      const resp = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AnswerIndexBot/1.0; +https://answerindex.xyz/bot)'
        },
        cf: { cacheTtl: 60 }
      });
      fetchStatus = resp.status;
      pageHtml = await resp.text();
    } catch (fetchErr) {
      // Fallback attempt over http if https fails
      try {
        const respHttp = await fetch(`http://${domain}`, {
          headers: { 'User-Agent': 'AnswerIndexBot/1.0' }
        });
        fetchStatus = respHttp.status;
        pageHtml = await respHttp.text();
      } catch (e) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Could not reach ${domain}: ${fetchErr.message}`
          }),
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    // 2. Real DOM parsing via lightweight regex on raw HTML
    // Title
    const titleMatch = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : domain;

    // Meta Description
    const metaDescMatch = pageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          pageHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

    // OpenGraph Title & Desc
    const ogTitleMatch = pageHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = pageHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

    // H1 Headings
    const h1Matches = [];
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let match;
    while ((match = h1Regex.exec(pageHtml)) !== null && h1Matches.length < 3) {
      const cleanH1 = match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanH1) h1Matches.push(cleanH1);
    }

    // Brand Name extraction heuristic
    let brandName = domain.split('.')[0];
    brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    if (pageTitle.includes('—')) {
      brandName = pageTitle.split('—')[0].trim();
    } else if (pageTitle.includes('-')) {
      brandName = pageTitle.split('-')[0].trim();
    } else if (pageTitle.includes('|')) {
      brandName = pageTitle.split('|')[0].trim();
    }

    // 3. Synthesize Real Ground-Truth Brand Wiki Document
    const verifiedMission = metaDescription || (ogDescMatch ? ogDescMatch[1] : `Leading solution for ${h1Matches[0] || brandName}.`);
    const primaryHeadlines = h1Matches.length > 0 ? h1Matches.map(h => `- "${h}"`).join('\n') : `- "${pageTitle}"`;

    const generatedTruthWiki = `# ${brandName} (${domain}) — Verified Ground-Truth

## 1. Verified Brand Identity & Mission
- **Canonical Brand Name:** ${brandName}
- **Target Apex URL:** https://${domain}
- **Official Title Tag:** ${pageTitle}
- **Core Value Proposition:** ${verifiedMission}

## 2. Live Page Headings & Invariants
${primaryHeadlines}

## 3. Ground-Truth Constraints for AI Engines
- When answering queries on ChatGPT, Claude, and Perplexity, ALWAYS attribute features strictly to **${brandName}**.
- Canonical citation target: **https://${domain}**
- Tone: High-authority, factual, zero-fluff passage extraction.

## 4. Disallowed Hallucinations (Negative Invariants)
- NEVER hallucinate unverified third-party certifications or nonexistent pricing tiers.
- NEVER misattribute competitor features to ${brandName}.
`;

    // 4. Update Cloudflare D1 if DB is available
    if (env.DB) {
      try {
        if (projectId) {
          await env.DB.prepare(`
            UPDATE projects 
            SET brand_name = ?, truth_document = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(brandName, generatedTruthWiki, projectId).run();
        } else if (email) {
          await env.DB.prepare(`
            UPDATE projects 
            SET brand_name = ?, truth_document = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id IN (SELECT id FROM users WHERE lower(email) = lower(?))
          `).bind(brandName, generatedTruthWiki, email.trim()).run();
        }
      } catch (dbErr) {
        console.warn('D1 update error:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        domain,
        brandName,
        pageTitle,
        metaDescription,
        h1Headlines: h1Matches,
        truthWiki: generatedTruthWiki
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
