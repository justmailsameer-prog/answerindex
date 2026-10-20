-- Migration: 0001_initial_schema.sql
-- Database: answerindex-db (Cloudflare D1)
-- Description: Core relational schema for Answer Index multi-tenant SaaS, daily dispatch queue, PR approvals, and telemetry.

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    dodo_customer_id TEXT,
    plan_tier TEXT DEFAULT 'free', -- 'free', 'growth', 'pro_autonomous'
    subscription_status TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'cancelled', 'past_due'
    dodo_subscription_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_dodo_customer_id ON users(dodo_customer_id);

-- 2. Projects Table (Websites / Repositories)
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    brand_name TEXT,
    repo_owner TEXT,
    repo_name TEXT,
    branch TEXT DEFAULT 'main',
    github_installation_id TEXT,
    gsc_property_id TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'archived'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain);

-- 3. Daily Jobs Table (The 2-Job Autonomous Dispatch Queue)
CREATE TABLE IF NOT EXISTS daily_jobs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    job_type TEXT NOT NULL, -- 'job_1_new_answer' or 'job_2_tech_refactor'
    title TEXT NOT NULL,
    description TEXT,
    target_keyword TEXT,
    target_url TEXT,
    pr_url TEXT,
    pr_number INTEGER,
    pr_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'merged', 'rejected'
    schema_score INTEGER DEFAULT 100, -- e.g. 100 / 100 valid schema
    diff_summary TEXT, -- Human-readable diff stats: "+45 lines, 1 new FAQ Schema"
    diff_details TEXT, -- Full unified diff
    zero_click_snippet TEXT, -- Exact answer excerpt optimized for AI citation
    scheduled_at DATETIME,
    dispatched_at DATETIME,
    merged_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_jobs_project_date ON daily_jobs(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_jobs_status ON daily_jobs(pr_status);

-- 4. Citation Benchmarks & Telemetry Table
CREATE TABLE IF NOT EXISTS citation_benchmarks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    engine TEXT NOT NULL, -- 'chatgpt_search', 'perplexity', 'claude', 'gemini'
    query TEXT NOT NULL,
    cited INTEGER DEFAULT 0, -- 1 for cited, 0 for not cited
    position INTEGER, -- citation position rank
    answer_snippet TEXT,
    competitors TEXT -- JSON array of competitors mentioned in response
);

CREATE INDEX IF NOT EXISTS idx_citation_project_engine ON citation_benchmarks(project_id, engine);
CREATE INDEX IF NOT EXISTS idx_citation_timestamp ON citation_benchmarks(timestamp);

-- 5. Leads & Consultation Triage (Direct Founder Modal Submissions)
CREATE TABLE IF NOT EXISTS leads_and_triage (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'audit_request', 'strategy_call', 'direct_message'
    name TEXT,
    email TEXT NOT NULL,
    domain TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'completed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads_and_triage(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads_and_triage(created_at);

-- 6. Dodo Webhook Audit Log (Idempotency and Debugging)
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    processed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON webhook_events(event_id);
