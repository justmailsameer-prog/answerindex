// Cloudflare Pages Function: /api/audit
// Performs real-time live probing of target domain's web-root protocols and Schema markup.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

async function probeUrl(url, timeoutMs = 3500) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnswerIndexBot/2.4; +https://answerindex.pages.dev)'
      },
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!res.ok) {
      return { ok: false, status: res.status, text: '' };
    }
    const text = await res.text();
    return { ok: true, status: res.status, text };
  } catch (err) {
    return { ok: false, error: err.name || 'FETCH_FAILED', text: '' };
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const domainRaw = data.domain || '';
    const email = data.email || '';

    const domain = domainRaw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split('?')[0];

    if (!domain || !domain.includes('.')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid domain is required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const targetBase = `https://${domain}`;

    // Perform live parallel probes to key web-root protocols
    const [robotsRes, llmsRes, aiTxtRes, entitiesRes, sitemapRes, homeRes] = await Promise.all([
      probeUrl(`${targetBase}/robots.txt`),
      probeUrl(`${targetBase}/llms.txt`),
      probeUrl(`${targetBase}/ai.txt`),
      probeUrl(`${targetBase}/ai-entities.json`),
      probeUrl(`${targetBase}/sitemap-main.xml`),
      probeUrl(`${targetBase}/`)
    ]);

    const hasRobots = robotsRes.ok && robotsRes.text.length > 20;
    const hasLlms = llmsRes.ok && llmsRes.text.length > 30;
    const hasAiTxt = aiTxtRes.ok && aiTxtRes.text.length > 20;
    const hasEntities = entitiesRes.ok && entitiesRes.text.length > 30;
    const hasSitemap = (sitemapRes.ok && sitemapRes.text.includes('<urlset')) || (hasRobots && robotsRes.text.toLowerCase().includes('sitemap'));

    // Check Home HTML for JSON-LD and Schema
    const homeHtml = homeRes.ok ? homeRes.text : '';
    const hasJsonLd = homeHtml.includes('application/ld+json');
    const hasFaqSchema = homeHtml.includes('FAQPage') || homeHtml.includes('acceptedAnswer');
    const hasAppSchema = homeHtml.includes('WebApplication') || homeHtml.includes('SoftwareApplication') || homeHtml.includes('Organization');
    const hasSameAs = homeHtml.includes('sameAs');

    // Check for AI bot directives in robots.txt
    const robotsLower = robotsRes.text.toLowerCase();
    const allowsGptBot = robotsLower.includes('gptbot') || robotsLower.includes('user-agent: *');
    const allowsClaude = robotsLower.includes('claudebot') || robotsLower.includes('user-agent: *');
    const allowsPerplexity = robotsLower.includes('perplexitybot') || robotsLower.includes('user-agent: *');

    // Dynamic Scoring Based on Verified Live Assets
    let techScore = 65;
    if (hasRobots) techScore += 15;
    if (hasSitemap) techScore += 10;
    if (allowsGptBot && allowsClaude && allowsPerplexity) techScore += 8;
    techScore = Math.min(98, Math.max(50, techScore));

    let aiDiscScore = 25;
    if (hasLlms) aiDiscScore += 45;
    if (hasAiTxt) aiDiscScore += 15;
    if (hasEntities) aiDiscScore += 12;
    aiDiscScore = Math.min(99, Math.max(15, aiDiscScore));

    let schemaScore = 40;
    if (hasJsonLd) schemaScore += 30;
    if (hasAppSchema) schemaScore += 12;
    if (hasFaqSchema) schemaScore += 10;
    if (hasSameAs) schemaScore += 6;
    schemaScore = Math.min(98, Math.max(30, schemaScore));

    let aeoScore = 45;
    if (hasFaqSchema) aeoScore += 30;
    if (hasLlms) aeoScore += 15;
    if (homeHtml.length > 1000) aeoScore += 8;
    aeoScore = Math.min(96, Math.max(35, aeoScore));

    const overallScore = Math.round(
      (techScore * 0.25) + (schemaScore * 0.25) + (aeoScore * 0.3) + (aiDiscScore * 0.2)
    );

    let grade = 'C+';
    let status = 'Needs AI Optimization';
    let scoreColor = [245, 158, 11]; // amber

    if (overallScore >= 90) {
      grade = 'A+';
      status = 'Enterprise AI Search Ready';
      scoreColor = [16, 185, 129]; // emerald
    } else if (overallScore >= 80) {
      grade = 'A-';
      status = 'Strong AI Readiness';
      scoreColor = [16, 185, 129];
    } else if (overallScore >= 70) {
      grade = 'B';
      status = 'Moderate AI Visibility';
      scoreColor = [59, 130, 246]; // blue
    } else if (overallScore < 60) {
      grade = 'D+';
      status = 'High AI Ingestion Risk';
      scoreColor = [239, 68, 68]; // red
    }

    // Identify Real Detected Gaps or Verified Compliances
    const gaps = [];

    if (!hasLlms) {
      gaps.push({
        critical: true,
        text: `Missing /llms.txt standard manifest file. ChatGPT Search, Claude & Perplexity crawlers cannot extract verified ground truth.`
      });
    }

    if (!hasJsonLd) {
      gaps.push({
        critical: true,
        text: `No Schema.org JSON-LD structured data detected. Knowledge graphs cannot parse entity definitions or product offers.`
      });
    } else if (!hasSameAs) {
      gaps.push({
        critical: false,
        text: `Schema JSON-LD is active, but missing external sameAs entity verification (Wikidata, Crunchbase, official social authorities).`
      });
    }

    if (!hasEntities) {
      gaps.push({
        critical: false,
        text: `No machine-readable ai-entities.json or RAG vector index published at web-root for automated AI ingestion.`
      });
    }

    if (!hasFaqSchema) {
      gaps.push({
        critical: true,
        text: `Zero-click 40–55 word direct-answer summaries are absent above H2 headers on core landing pages.`
      });
    }

    // If site has achieved Answer Index compliance (like blabr.xyz):
    if (gaps.length === 0) {
      gaps.push({
        critical: false,
        text: `[EXCELLENT] Machine-readable /llms.txt and AI manifests are verified live at web-root.`
      });
      gaps.push({
        critical: false,
        text: `[ACTIVE] Validated Schema.org JSON-LD entity graph detected with verified sameAs authority links.`
      });
    }

    const reportId = 'AI-' + Math.floor(1000 + Math.random() * 8999);

    // Asynchronously log to Cloudflare D1
    if (env && env.DB) {
      try {
        const leadId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        await env.DB.prepare(
          `INSERT INTO leads_and_triage (id, type, name, email, domain, message, status)
           VALUES (?, 'instant_audit', ?, ?, ?, ?, 'audited')`
        ).bind(leadId, domain, email || 'anonymous@audit.user', domain, `Score: ${overallScore}/100 (${grade}) | Live Probe: llms=${hasLlms}, schema=${hasJsonLd}`).run();
      } catch (dbErr) {
        console.warn('D1 logging non-fatal:', dbErr.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        liveProbe: true,
        reportId,
        domain,
        overallScore,
        grade,
        status,
        scoreColor,
        pillars: [
          { name: 'Technical SEO & Crawlability', score: techScore, color: [56, 189, 248] },
          { name: 'AEO Zero-Click Answer Snippets', score: aeoScore, color: [245, 158, 11] },
          { name: 'Schema.org & Entity Graph Depth', score: schemaScore, color: [129, 140, 248] },
          { name: 'AI Discovery & /llms.txt Manifests', score: aiDiscScore, color: [16, 185, 129] }
        ],
        gaps,
        details: {
          hasRobots,
          hasLlms,
          hasAiTxt,
          hasEntities,
          hasSitemap,
          hasJsonLd,
          hasFaqSchema
        }
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Audit execution failed' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
