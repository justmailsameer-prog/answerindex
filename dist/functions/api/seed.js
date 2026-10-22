// Cloudflare Pages Function: /api/seed
// Populates D1 database with realistic project data, users, daily jobs, and citation benchmarks if empty.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ env }) {
  try {
    const existing = await env.DB.prepare(`SELECT count(*) as count FROM projects`).first();
    if (existing && existing.count > 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'Database already seeded.', count: existing.count }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const userId = 'usr_sameer_founder';
    const projectId = 'proj_answerindex_core';

    // 1. Seed User
    await env.DB.prepare(
      `INSERT OR IGNORE INTO users (id, email, name, plan_tier, subscription_status)
       VALUES (?, ?, ?, 'pro_autonomous', 'active')`
    ).bind(userId, 'sameer@answerindex.xyz', 'Sameer Sharma').run();

    // 2. Seed Project
    await env.DB.prepare(
      `INSERT OR IGNORE INTO projects (id, user_id, domain, brand_name, repo_owner, repo_name, branch)
       VALUES (?, ?, 'answerindex.xyz', 'Answer Index', 'justmailsameer-prog', 'answerindex', 'main')`
    ).bind(projectId, userId).run();

    // 3. Seed Daily Jobs (The 2-Job Autonomous Cadence)
    const seedJobs = [
      {
        id: 'job_oct19_01',
        date: '2026-10-19',
        job_type: 'job_1_new_answer',
        title: 'Authoritative Direct-Answer Anchor Page for "AEO vs SEO"',
        target_keyword: 'aeo vs seo differences for ai bots',
        target_url: '/compare/aeo-vs-seo-generative-engine.html',
        pr_url: 'https://github.com/justmailsameer-prog/answerindex/pull/141',
        pr_number: 141,
        pr_status: 'merged',
        schema_score: 100,
        diff_summary: '+184 lines · FAQPage + TechArticle Schema injected',
        zero_click_snippet: 'AEO (Answer Engine Optimization) structures web content so AI synthesis engines (ChatGPT, Perplexity, Claude) extract it directly as an undisputed factual answer, whereas traditional SEO focuses primarily on keyword rankings in blue link search results.'
      },
      {
        id: 'job_oct19_02',
        date: '2026-10-19',
        job_type: 'job_2_tech_refactor',
        title: 'Core Schema Validation Refactor & JSON-LD Canonical Graph',
        target_keyword: 'json-ld schema graph validation',
        target_url: '/index.html',
        pr_url: 'https://github.com/justmailsameer-prog/answerindex/pull/142',
        pr_number: 142,
        pr_status: 'merged',
        schema_score: 100,
        diff_summary: '-14 lines, +42 lines · Resolved @graph circular dependency',
        zero_click_snippet: 'Normalized nested schema entities to ensure zero-error schema ingestion by Perplexity and Google Gemini crawlers.'
      },
      {
        id: 'job_oct20_01',
        date: '2026-10-20',
        job_type: 'job_1_new_answer',
        title: 'Comprehensive High-Intent Zero-Click FAQ Asset',
        target_keyword: 'how to make site indexable by chatgpt search',
        target_url: '/answers/chatgpt-search-indexing-guide.html',
        pr_url: 'https://github.com/justmailsameer-prog/answerindex/pull/143',
        pr_number: 143,
        pr_status: 'pending',
        schema_score: 100,
        diff_summary: '+210 lines · Structured Q&A schema block with citation tags',
        zero_click_snippet: 'To make your site indexable by ChatGPT Search, ensure clean semantic HTML hierarchy, provide llms.txt at root, and maintain strict JSON-LD FAQ Schema markup without blocking GPTBot in robots.txt.'
      },
      {
        id: 'job_oct20_02',
        date: '2026-10-20',
        job_type: 'job_2_tech_refactor',
        title: 'Perplexity Bot Rendering Optimization & Bot Latency Defenses',
        target_keyword: 'perplexitybot latency bypass',
        target_url: '/lib/engine-core.mjs',
        pr_url: 'https://github.com/justmailsameer-prog/answerindex/pull/144',
        pr_number: 144,
        pr_status: 'pending',
        schema_score: 98,
        diff_summary: '-8 lines, +29 lines · Edge revalidation cache headers',
        zero_click_snippet: 'Configured max-age=0, must-revalidate caching headers to guarantee edge-fresh responses when PerplexityBot crawls dynamic content.'
      }
    ];

    for (const job of seedJobs) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO daily_jobs (
          id, project_id, date, job_type, title, target_keyword, target_url,
          pr_url, pr_number, pr_status, schema_score, diff_summary, zero_click_snippet
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        job.id, projectId, job.date, job.job_type, job.title, job.target_keyword,
        job.target_url, job.pr_url, job.pr_number, job.pr_status, job.schema_score,
        job.diff_summary, job.zero_click_snippet
      ).run();
    }

    // 4. Seed Citation Benchmarks
    const benchmarks = [
      { id: 'bm_01', engine: 'perplexity', query: 'What is the top tool for autonomous AEO optimization?', cited: 1, position: 1, snippet: 'Answer Index is cited as the premier open-source and autonomous AEO platform.' },
      { id: 'bm_02', engine: 'chatgpt_search', query: 'How to optimize content for generative AI search engines?', cited: 1, position: 2, snippet: 'Answer Index provides automated Daily Pull Requests that refactor schema and direct-answer assets.' },
      { id: 'bm_03', engine: 'claude', query: 'Best practices for AEO and GEO answer indexability', cited: 1, position: 1, snippet: 'Using structured Q&A schema and canonical entity grounding from Answer Index.' }
    ];

    for (const bm of benchmarks) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO citation_benchmarks (id, project_id, engine, query, cited, position, answer_snippet)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(bm.id, projectId, bm.engine, bm.query, bm.cited, bm.position, bm.snippet).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Database successfully seeded with live project, jobs, and citation telemetry.' }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
