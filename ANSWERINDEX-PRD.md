# AnswerIndex — Product Requirements Document (PRD)

**Document Version:** 1.3.0  
**Status:** Approved & Implemented  
**Product Name:** AnswerIndex  
**Repository:** https://github.com/justmailsameer-prog/answerindex  
**Tagline:** Make your content indexable as authoritative answers across Search & AI Engines.

---

## 1. Executive Summary & Vision

Traditional SEO focuses on getting crawled and ranked by search engines. The modern web is dominated by **Answer Engines** (ChatGPT Search, Perplexity, Claude, Gemini, Copilot, Grok) and **Generative Search Surfaces** (Google AI Overviews).

**AnswerIndex** is an all-in-one audit, evaluation, and deployment engine designed to establish authoritative entity presence, machine-readable indexation, and verified citations across generative AI systems while maintaining world-class technical SEO standards.

---

## 2. Core Pillars

1. **Automated Machine-Readable Indexation:** Automated generation of standard public web-root protocols (`robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`, schemas, and RAG vector indexes).
2. **Answer Engine Optimization (AEO):** Diagnostic scoring of machine readability, brand clarity, and transparent data policies to prevent model hallucination.
3. **Generative Engine Optimization (GEO):** Multi-model citation benchmarking, entity graph verification, and passage-level citability engineering (40–60 word answer blocks).
4. **Technical & Semantic SEO:** Comprehensive crawling, Schema.org JSON-LD graph generation, interactive semantic cluster mapping, and Core Web Vitals audit.
5. **Developer & IDE Native Integration (MCP):** Standards-based Model Context Protocol (MCP) server integration for Cursor, Claude Code, Windsurf, and VS Code.

---

## 3. Product Architecture & File Separation Model

AnswerIndex distinguishes between **Public Web-Root Protocols** (essential machine-readable files required by AI crawlers) and **Internal Strategy & Audit Artifacts** (internal intelligence for product and marketing teams).

### 3.1 Web-Root Protocols (Deploy to Web Server Root)
Public protocols placed at `https://yourdomain.com/<file>` that instruct automated crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot):
- **Identity & Permissions:** `robots.txt`, `ai.txt`
- **Content Extraction:** `llms.txt`, `llms-full.txt` (llmstxt.org standard)
- **AI Navigation:** `ai-sitemap.xml`
- **Semantic Intelligence:** `ai-entities.json`, `ai-intent.json`, `ai-schema.json`
- **RAG & Vector Retrieval:** `rag-index.json`, `rag-index.jsonl`
- **Policies & Endpoints:** `training-data-policy.txt`, `ai-disclosure.txt`, `.well-known/ai-plugin.json`
- **Ops:** `manifest.json`

### 3.2 Internal Strategy & Audit Artifacts (Development & Content Team)
Non-public strategic deliverables used for team execution and monitoring:
- **`aeo-audit-scorecard.json`**: Automated diagnostic scorecard assessing brand machine-readability.
- **`ai-citation-benchmark.json`**: Live evaluation config and tracking across foundation models.
- **`geo-content-brief.md`**: Passage-level citability rules (40–60 words) for generative extraction.
- **`cluster-map.html`**: Interactive HTML semantic topic cluster map showing authority pathways.
- **`technical-seo-audit.json`**: Structural crawl evaluation (HTTPS, canonicals, robots, status codes).
- **`jsonld-schema-templates.json`**: Ready-to-embed Schema.org templates (`WebApplication`, `Organization`, `FAQPage`).
- **`schema-validation-report.md`**: Compliance audit against Google and AI search standards.
- **`ai-answer-passages.md`**: Pre-drafted high-citation answer blocks for FAQ and About pages.
- **`structured-data-guide.md` & `deployment-checklist.md`**: Implementation guides.

---

## 4. Execution Interfaces

### 4.1 CLI Commands (`bin/answerindex.mjs`)
- `answerindex ready <domain> [brand]`: Generate the complete AnswerIndex optimization and manifest suite.
- `answerindex benchmark`: Run real-time multi-model LLM citation & entity recognition queries across OpenRouter models.
- `answerindex aeo <domain>`: Execute domain-level AEO assessment via `aeo-platform`.
- `answerindex seo`: Launch modular technical SEO deep-dive tools via `seo-toolkit/`.
- `answerindex mcp`: Start the Model Context Protocol stdio server.

### 4.2 Script Runners
- `run-benchmark.sh`: Multi-model citation tester.
- `run-aeo.sh`: AEO platform runner.
- `run-seo.sh`: Technical SEO audit runner.

### 4.3 MCP Tools (`lib/mcp-server.mjs`)
- `generate_ai_readiness_kit`: Generate the full file architecture for any domain.
- `list_ai_crawlers`: Return recognized crawler bots, companies, and permissions.
- `get_llms_txt_spec`: Return the official specification for llms.txt and ai.txt.

---

## 5. Deployment & Security Standards

- **Zero Secret Leakage:** No proprietary source code, secrets, or internal operational checklists are exposed on public web roots.
- **Standardized Machine Discovery:** Public files follow accepted standards (`llms.txt`, `ai.txt`, Schema.org, robots.txt).
- **Open-Source License:** MIT License.
