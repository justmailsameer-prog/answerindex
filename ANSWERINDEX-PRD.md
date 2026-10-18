# AnswerIndex — Product Requirements Document (PRD)

**Document Version:** 1.2.0  
**Status:** Approved & Implemented  
**Product Name:** AnswerIndex  
**Repository:** https://github.com/justmailsameer-prog/answerindex  
**Tagline:** Make your content indexable as authoritative answers across Search & AI Engines.

---

## 1. Executive Summary & Vision

Traditional SEO solves for indexing by web crawlers. The modern web is dominated by **Answer Engines** (Perplexity, ChatGPT Search, Gemini, Claude, Copilot, Grok) and **Generative Search** (Google AI Overviews).

**AnswerIndex** is a unified, open-source audit, deployment, and optimization engine designed to evaluate, diagnose, and structure web products so they become the primary referenced source in generative AI responses and organic search.

---

## 2. Core Pillars
 
1. **Automated Machine-Readable Indexation:** Generate complete web-root manifests (`robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`, `sitemap.md`, schemas, and RAG vector indexes).
2. **Answer Engine Optimization (AEO):** Audit how AI models extract, comprehend, and cite brand answers with automated scoring and ethical transparency benchmarks.
3. **Generative Engine Optimization (GEO):** Analyze citation frequency, entity graph connectivity, passage-level citability (40–60 word blocks), and authority signals.
4. **Traditional Technical & Semantic SEO:** Structural crawling, JSON-LD Schema generation, meta validation, and interactive semantic cluster strategy.
5. **Agent & IDE Integration (MCP):** Native Model Context Protocol server allowing Cursor, Claude Code, Windsurf, and VS Code to execute AnswerIndex directly.
 
---
 
## 3. Product Architecture & Capabilities
 
### 3.1 Unified CLI & Runners
- **Primary CLI:** `bin/answerindex.mjs`
  - `ready <domain> [brand]`: Generate the complete 26-file AnswerIndex optimization suite.
  - `benchmark`: Multi-model LLM citation & entity recognition test across OpenRouter foundation models.
  - `aeo <domain>`: Answer Engine diagnostic assessment via `aeo-platform`.
  - `seo`: Modular deep technical & schema SEO skills via `seo-toolkit/`.
  - `mcp`: Launches the Model Context Protocol stdio server.
- **Bash Script Runners:** `run-seo.sh`, `run-aeo.sh`, `run-benchmark.sh`.
 
### 3.2 The 26-File Optimization Suite (`lib/readiness-generator.mjs`)
- **Web-Root Identity, Content & Knowledge Manifests (18 Files):**
  - *Identity & Permissions:* `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Applebot), `ai.txt`
  - *Content Extraction:* `llms.txt`, `llms-full.txt`
  - *Site Navigation:* `sitemap.md`, `ai-sitemap.xml`
  - *Semantic Intelligence:* `ai-entities.json`, `ai-intent.json`, `ai-schema.json`
  - *RAG & Vector Retrieval:* `rag-index.json`, `rag-index.jsonl`
  - *Policies & Integration:* `training-data-policy.txt`, `ai-disclosure.txt`, `.well-known/ai-plugin.json`
  - *Deployment & Operations:* `manifest.json`, `structured-data-guide.md`, `deployment-checklist.md`, `README.md`
- **AEO Diagnostics, GEO Briefs & Schema Suite (8 Files):**
  - `aeo-audit-scorecard.json`
  - `ai-citation-benchmark.json`
  - `geo-content-brief.md`
  - `cluster-map.html`
  - `technical-seo-audit.json`
  - `jsonld-schema-templates.json`
  - `schema-validation-report.md`
  - `ai-answer-passages.md`

### 3.3 MCP Server (`lib/mcp-server.mjs`)
- Standards-compliant JSON-RPC stdio protocol.
- Exposes tools:
  - `generate_ai_readiness_kit`
  - `list_ai_crawlers`
  - `get_llms_txt_spec`

---

## 4. Licensing

- **License:** MIT License
