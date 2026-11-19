-- Migration: 0005_elmo_observability_schema.sql
-- Description: Introduces Elmo-style AI Observability & Citation Radar into Answer Index
-- Adds tracked commercial queries, judge sentiment evaluations, competitor share of voice, and citation URLs

-- 1. Tracked Commercial Prompts
CREATE TABLE IF NOT EXISTS tracked_prompts (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'realtime'
    target_intent TEXT, -- 'comparative', 'pricing', 'evaluation', 'alternative'
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'archived'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracked_prompts_project ON tracked_prompts(project_id, status);

-- 2. AI Citation & Observability Runs (Elmo Judge Telemetry)
CREATE TABLE IF NOT EXISTS ai_citation_runs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    prompt_id TEXT REFERENCES tracked_prompts(id) ON DELETE SET NULL,
    engine TEXT NOT NULL, -- 'chatgpt_search', 'perplexity', 'claude_search', 'gemini', 'google_aio'
    query TEXT NOT NULL,
    brand_mentioned INTEGER DEFAULT 0, -- 1 = true, 0 = false
    brand_position INTEGER DEFAULT 0, -- 1 = #1 recommended brand, 2 = #2, etc. (0 = not ranked)
    sentiment TEXT DEFAULT 'neutral', -- 'positive', 'neutral', 'mixed', 'negative'
    passage_quote TEXT, -- Exact text passage extracted by Judge model
    cited_urls TEXT, -- JSON array of URLs cited by the AI model in this run
    competitors_cited TEXT, -- JSON array of competitor brand names mentioned
    judge_model TEXT DEFAULT 'cf-llama-3.1-8b', -- Evaluator judge model ID
    share_of_voice_score REAL DEFAULT 0.0, -- Percentage of category mentions captured (0.0 to 100.0)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_citation_runs_project ON ai_citation_runs(project_id, created_at);
CREATE INDEX IF NOT EXISTS idx_citation_runs_engine ON ai_citation_runs(engine, created_at);
CREATE INDEX IF NOT EXISTS idx_citation_runs_prompt ON ai_citation_runs(prompt_id);
