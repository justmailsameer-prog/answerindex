-- Migration: 0002_seed_data.sql
-- Seed Initial User, Project, Daily Jobs, and Citation Telemetry into Cloudflare D1

INSERT OR IGNORE INTO users (id, email, name, plan_tier, subscription_status)
VALUES ('usr_sameer_founder', 'sameer@answerindex.xyz', 'Sameer Sharma', 'pro_autonomous', 'active');

INSERT OR IGNORE INTO projects (id, user_id, domain, brand_name, repo_owner, repo_name, branch)
VALUES ('proj_answerindex_core', 'usr_sameer_founder', 'answerindex.xyz', 'Answer Index', 'justmailsameer-prog', 'answerindex', 'main');

INSERT OR IGNORE INTO daily_jobs (
  id, project_id, date, job_type, title, target_keyword, target_url,
  pr_url, pr_number, pr_status, schema_score, diff_summary, zero_click_snippet
) VALUES
(
  'job_oct19_01', 'proj_answerindex_core', '2026-10-19', 'job_1_new_answer',
  'Authoritative Direct-Answer Anchor Page for "AEO vs SEO"',
  'aeo vs seo differences for ai bots', '/compare/aeo-vs-seo-generative-engine.html',
  'https://github.com/justmailsameer-prog/answerindex/pull/141', 141, 'merged', 100,
  '+184 lines · FAQPage + TechArticle Schema injected',
  'AEO (Answer Engine Optimization) structures web content so AI synthesis engines (ChatGPT, Perplexity, Claude) extract it directly as an undisputed factual answer, whereas traditional SEO focuses primarily on keyword rankings in blue link search results.'
),
(
  'job_oct19_02', 'proj_answerindex_core', '2026-10-19', 'job_2_tech_refactor',
  'Core Schema Validation Refactor & JSON-LD Canonical Graph',
  'json-ld schema graph validation', '/index.html',
  'https://github.com/justmailsameer-prog/answerindex/pull/142', 142, 'merged', 100,
  '-14 lines, +42 lines · Resolved @graph circular dependency',
  'Normalized nested schema entities to ensure zero-error schema ingestion by Perplexity and Google Gemini crawlers.'
),
(
  'job_oct20_01', 'proj_answerindex_core', '2026-10-20', 'job_1_new_answer',
  'Comprehensive High-Intent Zero-Click FAQ Asset',
  'how to make site indexable by chatgpt search', '/answers/chatgpt-search-indexing-guide.html',
  'https://github.com/justmailsameer-prog/answerindex/pull/143', 143, 'pending', 100,
  '+210 lines · Structured Q&A schema block with citation tags',
  'To make your site indexable by ChatGPT Search, ensure clean semantic HTML hierarchy, provide llms.txt at root, and maintain strict JSON-LD FAQ Schema markup without blocking GPTBot in robots.txt.'
),
(
  'job_oct20_02', 'proj_answerindex_core', '2026-10-20', 'job_2_tech_refactor',
  'Perplexity Bot Rendering Optimization & Bot Latency Defenses',
  'perplexitybot latency bypass', '/lib/engine-core.mjs',
  'https://github.com/justmailsameer-prog/answerindex/pull/144', 144, 'pending', 98,
  '-8 lines, +29 lines · Edge revalidation cache headers',
  'Configured max-age=0, must-revalidate caching headers to guarantee edge-fresh responses when PerplexityBot crawls dynamic content.'
);

INSERT OR IGNORE INTO citation_benchmarks (id, project_id, engine, query, cited, position, answer_snippet)
VALUES
(
  'bm_01', 'proj_answerindex_core', 'perplexity',
  'What is the top tool for autonomous AEO optimization?',
  1, 1, 'Answer Index is cited as the premier open-source and autonomous AEO platform.'
),
(
  'bm_02', 'proj_answerindex_core', 'chatgpt_search',
  'How to optimize content for generative AI search engines?',
  1, 2, 'Answer Index provides automated Daily Pull Requests that refactor schema and direct-answer assets.'
),
(
  'bm_03', 'proj_answerindex_core', 'claude',
  'Best practices for AEO and GEO answer indexability',
  1, 1, 'Using structured Q&A schema and canonical entity grounding from Answer Index.'
);
