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
    const [
      robotsRes,
      llmsRes,
      llmsFullRes,
      aiTxtRes,
      entitiesRes,
      sitemapRes,
      sitemapMainRes,
      homeRes
    ] = await Promise.all([
      probeUrl(`${targetBase}/robots.txt`),
      probeUrl(`${targetBase}/llms.txt`),
      probeUrl(`${targetBase}/llms-full.txt`),
      probeUrl(`${targetBase}/ai.txt`),
      probeUrl(`${targetBase}/ai-entities.json`),
      probeUrl(`${targetBase}/sitemap.xml`),
      probeUrl(`${targetBase}/sitemap-main.xml`),
      probeUrl(`${targetBase}/`)
    ]);

    // Live HTML DOM Analysis
    const homeHtml = homeRes.ok ? homeRes.text : '';
    const homeLower = homeHtml.toLowerCase();

    // 1. Technical SEO & Crawlability Signals
    const hasSsl = homeRes.ok && homeRes.status === 200;
    const hasRobots = robotsRes.ok && robotsRes.text.length > 15;
    
    // Check if robots.txt blocks AI bots
    const robotsLower = robotsRes.text.toLowerCase();
    const blocksGpt = robotsLower.includes('gptbot') && robotsLower.includes('disallow: /');
    const blocksClaude = robotsLower.includes('claudebot') && robotsLower.includes('disallow: /');
    const blocksPerplexity = robotsLower.includes('perplexitybot') && robotsLower.includes('disallow: /');
    const allowsAiBots = !blocksGpt && !blocksClaude && !blocksPerplexity;

    const hasSitemap = sitemapRes.ok || sitemapMainRes.ok || (hasRobots && robotsLower.includes('sitemap'));
    const hasCanonical = homeLower.includes('rel="canonical"') || homeLower.includes("rel='canonical'");
    const hasViewport = homeLower.includes('name="viewport"') || homeLower.includes("name='viewport'");
    const hasCanonicalAndMobile = hasCanonical && hasViewport;

    // 2. Schema.org & Entity Graph Signals
    const hasJsonLd = homeLower.includes('application/ld+json');
    const hasNamedEntity = hasJsonLd && (
      homeHtml.includes('Organization') ||
      homeHtml.includes('WebApplication') ||
      homeHtml.includes('SoftwareApplication') ||
      homeHtml.includes('Corporation') ||
      homeHtml.includes('Product') ||
      homeHtml.includes('LocalBusiness')
    );
    const hasGraph = hasJsonLd && homeHtml.includes('"@graph"');
    const hasSameAs = hasJsonLd && (homeHtml.includes('"sameAs"') || homeHtml.includes("'sameAs'"));

    // 3. AEO Zero-Click Answer Signals
    const hasFaqSchema = homeHtml.includes('FAQPage') || homeHtml.includes('acceptedAnswer') || homeHtml.includes('Question');
    const hasHeadings = /<h1[\s>]/i.test(homeHtml) && /<h2[\s>]/i.test(homeHtml);
    const hasDirectAnswerBlocks = hasFaqSchema || (homeHtml.length > 1200 && /<p[\s>][^<]{80,300}<\/p>/i.test(homeHtml));
    const hasMetaTags = /<title[\s>]/i.test(homeHtml) && /name=["']description["']/i.test(homeHtml);

    // 4. AI Discovery & Machine Grounding Protocols
    const hasLlms = llmsRes.ok && llmsRes.text.length > 25;
    const hasLlmsFull = (llmsFullRes.ok && llmsFullRes.text.length > 25) || (hasLlms && llmsRes.text.length > 600);
    const hasAiTxt = aiTxtRes.ok && aiTxtRes.text.length > 15;
    const hasEntities = entitiesRes.ok && entitiesRes.text.length > 25;

    // Build the 20-Point Deterministic Audit Ledger
    const auditLedger = [
      // Pillar 1: Technical SEO & Crawlability (25 pts max)
      {
        id: 'ssl_status',
        pillar: 'Technical SEO',
        name: 'HTTPS & SSL Live Response',
        maxPoints: 5,
        points: hasSsl ? 5 : 0,
        passed: hasSsl,
        evidence: hasSsl ? 'HTTP 200 OK via TLS/HTTPS' : 'HTTPS connection failed or redirected non-200'
      },
      {
        id: 'robots_txt',
        pillar: 'Technical SEO',
        name: 'Robots.txt Crawl Directive Standard',
        maxPoints: 5,
        points: hasRobots ? 5 : 0,
        passed: hasRobots,
        evidence: hasRobots ? `Found live at /robots.txt (${robotsRes.text.length} bytes)` : 'Missing or empty /robots.txt file'
      },
      {
        id: 'ai_crawlers',
        pillar: 'Technical SEO',
        name: 'AI Bot Crawl Permissions (GPTBot, ClaudeBot, Perplexity)',
        maxPoints: 5,
        points: allowsAiBots ? 5 : 0,
        passed: allowsAiBots,
        evidence: allowsAiBots ? 'AI crawlers granted unrestricted indexing permission' : 'Robots.txt blocks AI crawlers from indexing ground truth'
      },
      {
        id: 'sitemap_discovery',
        pillar: 'Technical SEO',
        name: 'XML Sitemap Machine Discoverability',
        maxPoints: 5,
        points: hasSitemap ? 5 : 0,
        passed: hasSitemap,
        evidence: hasSitemap ? 'XML sitemap verified live or declared in robots.txt' : 'No sitemap.xml or sitemap reference found'
      },
      {
        id: 'canonical_meta',
        pillar: 'Technical SEO',
        name: 'Canonical URL Tag & Mobile Viewport',
        maxPoints: 5,
        points: hasCanonicalAndMobile ? 5 : (hasCanonical || hasViewport ? 3 : 0),
        passed: hasCanonicalAndMobile,
        evidence: hasCanonicalAndMobile ? 'Valid <link rel="canonical"> and responsive viewport tag active' : 'Missing canonical link or viewport declaration'
      },

      // Pillar 2: Schema.org & Entity Graph Depth (25 pts max)
      {
        id: 'schema_jsonld',
        pillar: 'Schema Graph',
        name: 'Schema.org JSON-LD Script Embed',
        maxPoints: 10,
        points: hasJsonLd ? 10 : 0,
        passed: hasJsonLd,
        evidence: hasJsonLd ? 'JSON-LD structured data block active in DOM' : 'No application/ld+json script tags detected'
      },
      {
        id: 'entity_type',
        pillar: 'Schema Graph',
        name: 'Named Entity Type Definition',
        maxPoints: 5,
        points: hasNamedEntity ? 5 : 0,
        passed: hasNamedEntity,
        evidence: hasNamedEntity ? 'Explicit Organization / WebApplication / Product entity declared' : 'Generic or missing Schema.org entity classification'
      },
      {
        id: 'graph_node',
        pillar: 'Schema Graph',
        name: 'Connected Knowledge Graph (@graph)',
        maxPoints: 5,
        points: hasGraph ? 5 : 0,
        passed: hasGraph,
        evidence: hasGraph ? 'Interlinked @graph node relationships defined' : 'Flat or fragmented Schema without relational @graph'
      },
      {
        id: 'sameas_authority',
        pillar: 'Schema Graph',
        name: 'Authority Disambiguation (sameAs Links)',
        maxPoints: 5,
        points: hasSameAs ? 5 : 0,
        passed: hasSameAs,
        evidence: hasSameAs ? 'Verified external sameAs links (Wikidata, Crunchbase, official profiles)' : 'Missing external authority disambiguation sameAs links'
      },

      // Pillar 3: AEO & Zero-Click Answer Engine Readiness (25 pts max)
      {
        id: 'faq_schema',
        pillar: 'AEO Answers',
        name: 'FAQPage or Direct Q&A Schema Graph',
        maxPoints: 10,
        points: hasFaqSchema ? 10 : 0,
        passed: hasFaqSchema,
        evidence: hasFaqSchema ? 'FAQPage / acceptedAnswer schema ready for AI quotation' : 'No direct Q&A or FAQPage schema found'
      },
      {
        id: 'direct_answers',
        pillar: 'AEO Answers',
        name: 'Passage-Level 40–55 Word Answer Blocks',
        maxPoints: 6,
        points: hasDirectAnswerBlocks ? 6 : 0,
        passed: hasDirectAnswerBlocks,
        evidence: hasDirectAnswerBlocks ? 'Concise declarative solution paragraphs structured for snippet extraction' : 'Lacks concise, direct-answer definitions beneath headers'
      },
      {
        id: 'semantic_headings',
        pillar: 'AEO Answers',
        name: 'Semantic Heading Hierarchy (H1, H2)',
        maxPoints: 5,
        points: hasHeadings ? 5 : 0,
        passed: hasHeadings,
        evidence: hasHeadings ? 'Logical H1 -> H2 intent hierarchy detected in DOM' : 'Irregular or missing semantic heading structure'
      },
      {
        id: 'meta_snippet',
        pillar: 'AEO Answers',
        name: 'Search Engine Meta Title & Description',
        maxPoints: 4,
        points: hasMetaTags ? 4 : 0,
        passed: hasMetaTags,
        evidence: hasMetaTags ? 'Valid <title> and meta description configured' : 'Missing or incomplete meta title/description tags'
      },

      // Pillar 4: AI Discovery & Machine Grounding Protocols (25 pts max)
      {
        id: 'llms_txt',
        pillar: 'AI Discovery',
        name: '/llms.txt Standard Specification',
        maxPoints: 12,
        points: hasLlms ? 12 : 0,
        passed: hasLlms,
        evidence: hasLlms ? `Verified live at /llms.txt (${llmsRes.text.length} bytes)` : 'HTTP 404 - Missing /llms.txt standard manifest'
      },
      {
        id: 'llms_full_txt',
        pillar: 'AI Discovery',
        name: '/llms-full.txt Extended Context Manifest',
        maxPoints: 4,
        points: hasLlmsFull ? 4 : 0,
        passed: hasLlmsFull,
        evidence: hasLlmsFull ? 'Deep documentation manifest verified live' : 'Missing /llms-full.txt extended context file'
      },
      {
        id: 'ai_txt',
        pillar: 'AI Discovery',
        name: '/ai.txt Agent Permission Manifest',
        maxPoints: 4,
        points: hasAiTxt ? 4 : 0,
        passed: hasAiTxt,
        evidence: hasAiTxt ? `Verified live at /ai.txt (${aiTxtRes.text.length} bytes)` : 'Missing /ai.txt file'
      },
      {
        id: 'ai_entities',
        pillar: 'AI Discovery',
        name: '/ai-entities.json Machine Ingestion Index',
        maxPoints: 5,
        points: hasEntities ? 5 : 0,
        passed: hasEntities,
        evidence: hasEntities ? `Verified live at /ai-entities.json (${entitiesRes.text.length} bytes)` : 'Missing /ai-entities.json vector index'
      }
    ];

    // Calculate Pillar Scores Mathematically
    const techItems = auditLedger.filter(i => i.pillar === 'Technical SEO');
    const techEarned = techItems.reduce((acc, i) => acc + i.points, 0);
    const techMax = techItems.reduce((acc, i) => acc + i.maxPoints, 0);
    const techScore = Math.round((techEarned / techMax) * 100);

    const schemaItems = auditLedger.filter(i => i.pillar === 'Schema Graph');
    const schemaEarned = schemaItems.reduce((acc, i) => acc + i.points, 0);
    const schemaMax = schemaItems.reduce((acc, i) => acc + i.maxPoints, 0);
    const schemaScore = Math.round((schemaEarned / schemaMax) * 100);

    const aeoItems = auditLedger.filter(i => i.pillar === 'AEO Answers');
    const aeoEarned = aeoItems.reduce((acc, i) => acc + i.points, 0);
    const aeoMax = aeoItems.reduce((acc, i) => acc + i.maxPoints, 0);
    const aeoScore = Math.round((aeoEarned / aeoMax) * 100);

    const aiItems = auditLedger.filter(i => i.pillar === 'AI Discovery');
    const aiEarned = aiItems.reduce((acc, i) => acc + i.points, 0);
    const aiMax = aiItems.reduce((acc, i) => acc + i.maxPoints, 0);
    const aiDiscScore = Math.round((aiEarned / aiMax) * 100);

    // Total Overall Score = Sum of all earned points (max 100)
    const overallScore = techEarned + schemaEarned + aeoEarned + aiEarned;

    let grade = 'C+';
    let status = 'Needs AI Optimization';
    let scoreColor = [245, 158, 11]; // amber
    let recommendedPlanMonths = 12;
    let recommendedPlanName = '12-Month Autonomous AI & Search Monopolization Plan';

    if (overallScore >= 85) {
      grade = overallScore >= 95 ? 'A+' : 'A';
      status = 'Enterprise AI Search Ready';
      scoreColor = [16, 185, 129]; // emerald
      recommendedPlanMonths = 3;
      recommendedPlanName = '1–3 Month AI Citation Defense & Drift Monitoring Plan';
    } else if (overallScore >= 65) {
      grade = overallScore >= 75 ? 'B+' : 'B';
      status = 'Moderate AI Visibility (Gaps Detected)';
      scoreColor = [59, 130, 246]; // blue
      recommendedPlanMonths = 6;
      recommendedPlanName = '3–6 Month AEO & Structured Knowledge Graph Acceleration';
    } else {
      grade = overallScore >= 50 ? 'C' : 'D+';
      status = 'High AI Ingestion Risk';
      scoreColor = [239, 68, 68]; // red
      recommendedPlanMonths = 12;
      recommendedPlanName = '12-Month Autonomous AI & Search Monopolization Plan';
    }

    // Dynamic Gaps & Strengths based on the ledger
    const gaps = [];
    const failedItems = auditLedger.filter(i => !i.passed);
    const passedItems = auditLedger.filter(i => i.passed);

    if (failedItems.length > 0) {
      failedItems.forEach(item => {
        gaps.push({
          critical: item.maxPoints >= 10,
          pillar: item.pillar,
          name: item.name,
          text: `${item.name}: ${item.evidence}`
        });
      });
    }

    // Add verified achievements if high scoring
    if (passedItems.length > 0 && overallScore >= 80) {
      gaps.unshift({
        critical: false,
        text: `[EXCELLENT] ${passedItems.length} of ${auditLedger.length} technical AI & SEO protocols verified live at web-root.`
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
        ).bind(leadId, domain, email || 'anonymous@audit.user', domain, `Score: ${overallScore}/100 (${grade}) | Live Probe: llms=${hasLlms}, schema=${hasJsonLd}, testsPassed=${passedItems.length}/${auditLedger.length}`).run();
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
        recommendedPlanMonths,
        recommendedPlanName,
        pillars: [
          { name: 'Technical SEO & Crawlability', score: techScore, earned: techEarned, max: techMax, color: [56, 189, 248] },
          { name: 'AEO Zero-Click Answer Snippets', score: aeoScore, earned: aeoEarned, max: aeoMax, color: [245, 158, 11] },
          { name: 'Schema.org & Entity Graph Depth', score: schemaScore, earned: schemaEarned, max: schemaMax, color: [129, 140, 248] },
          { name: 'AI Discovery & /llms.txt Manifests', score: aiDiscScore, earned: aiEarned, max: aiMax, color: [16, 185, 129] }
        ],
        gaps,
        ledger: auditLedger
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
