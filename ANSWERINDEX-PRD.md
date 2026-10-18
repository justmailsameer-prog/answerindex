# Answer Index — Product Requirements Document (PRD)

**Document Version:** 1.5.0  
**Status:** Approved & Implemented  
**Product Name:** Answer Index  
**Live Production Portal:** https://answerindex.pages.dev  
**Feedback & Ideas Channel:** https://answerindex.pages.dev/feedback.html  
**GitHub Repository:** https://github.com/justmailsameer-prog/answerindex  
**License:** MIT License — Copyright (c) 2026 Sameer Sharma  
**Tagline:** Make your content indexable as authoritative answers across Search & AI Engines.

---

## 1. Executive Summary & Vision

Traditional Search Engine Optimization (SEO) focuses exclusively on getting crawled, indexed, and ranked by legacy search engines. The modern digital landscape is increasingly dominated by **Answer Engines** (ChatGPT Search, Perplexity, Claude, Gemini, Copilot, Grok) and **Generative Search Surfaces** (Google AI Overviews).

**Answer Index** is a unified evaluation, benchmarking, deployment, and optimization engine designed to establish authoritative entity presence, machine-readable indexation, and verified citations across generative AI systems while maintaining world-class technical SEO standards.

---

## 2. Core Pillars & 5-Phase Execution Standard

Answer Index is governed by a strict 5-phase sequential deliverable pipeline for transforming raw brand content into cited, authoritative knowledge across generative systems:

1. **Phase 1: Content Extraction & Entity Modeling (Foundation):** Text segmentation, boilerplate removal, Named Entity Recognition (NER), Wikidata/Schema ontology mapping (`isA`, `solves`, `alternativeTo`), and 4-tier intent classification.
2. **Phase 2: Structural Schema & Technical SEO:** Production of connected, verified JSON-LD graphs (`TechArticle`, `FAQPage`, `SoftwareApplication`, `Organization` with `sameAs`), canonicals, OpenGraph cards, and AI bot indexing directives.
3. **Phase 3: Answer Engine Optimization (AEO Architecture):** Zero-click 40–55 word direct-answer snippets placed top-of-section, exact-match question headings (`<h2>`/`<h3>`), and scrapeable markdown comparison tables / sequential steps.
4. **Phase 4: Generative Engine Optimization (GEO & LLM Retrieval):** 250–400 token semantic chunking for vector databases (RAG), evidence-anchored claims, and complete elimination of marketing filler to minimize hallucination risk.
5. **Phase 5: Verification & Delivery Checklist:** Markdown deliverable packaging containing zero-click snippets, entity relationships, AEO answers, valid JSON-LD `<script>` blocks, and vector-ready chunks.

### 2.1 AI Hallucination Correction & Knowledge Alignment Standard
To counteract hallucinated pricing, legacy leadership, and competitor conflation in LLMs, AnswerIndex enforces a deterministic grounding protocol:
- **Discrepancy Triage:** Classification into *Temporal Lag*, *Semantic Drift / Conflation*, *Pure Fabrication*, or *Third-Party Poisoning*.
- **Direct-Answer Grounding Snippet (AEO Defense):** 45–60 word contrast statement (`"[Brand] is [Definition]. Contrary to outdated reports, [Brand] does not [Incorrect claim]; rather, it [Canonical truth]."`).
- **Machine-Readable Truth Ingestion:** Append canonical facts to `/llms.txt` and embed high-precision JSON-LD with immutable `@id`, `disambiguatingDescription`, `knowsAbout`, and `sameAs` authorities.
- **Remediation Plan:** Actionable first-party cleanup, `robots.txt` AI crawler audit, and third-party entity recalibration.

Complementing this pipeline is AnswerIndex's automated 26-file deployment model, MCP developer integration, and real-time model benchmarking.

---

## 3. Product Architecture & File Separation Model

Answer Index enforces a clean architectural separation between **Public Web-Root Protocols** (essential machine-readable files required by AI crawlers) and **Internal Strategy & Audit Artifacts** (internal intelligence for product and marketing teams).

### 3.1 Web-Root Protocols (Deploy to Public Web Server Root)
Public protocols placed at `https://yourdomain.com/<file>` that instruct automated crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot):

| File | Protocol Role | Specification & Impact |
|---|---|---|
| `robots.txt` | Identity & Access | Explicit crawler access governance for AI bots vs legacy engines. |
| `ai.txt` | Transparency Declaration | Standard AI manifest with contact info and citation permissions. |
| `llms.txt` | Content Extraction | Concise, markdown site overview formatted to [llmstxt.org](https://llmstxt.org) standard. |
| `llms-full.txt` | Context Corpus | Complete un-truncated documentation text for large LLM context windows. |
| `sitemap-main.xml` | Canonical Sitemap | Primary clean XML sitemap for Search Console indexation without queue locks. |
| `ai-sitemap.xml` | AI Navigation | Priority XML map designed specifically for AI indexing bots. |
| `ai-entities.json` | Semantic Intelligence | Machine-readable entity graph, core taxonomy, and verified brand claims. |
| `ai-intent.json` | Intent Mapping | Maps natural language user queries directly to canonical destination URLs. |
| `ai-schema.json` | Structured Graphs | Consolidated Schema.org JSON-LD graph (`WebSite`, `Organization`). |
| `rag-index.json` | Vector Search | Importance-weighted knowledge chunks for retrieval-augmented generation. |
| `rag-index.jsonl` | Line-Delimited Embeddings | JSONL format for direct batch ingestion into vector databases. |
| `training-data-policy.txt` | Policy Enforcement | Transparent fair-use guidelines for citation versus model training. |
| `ai-disclosure.txt` | Compliance | Formal AI integration and AEO compliance disclosure statement. |
| `.well-known/ai-plugin.json` | Endpoint Registration | Standard plugin manifest registering the site as an official AI resource. |
| `manifest.json` | Master Inventory | Master inventory and compliance scorecard for all deployed files. |
| `structured-data-guide.md` | Dev Guide | Practical guide for embedding JSON-LD schemas in HTML templates. |
| `deployment-checklist.md` | Deployment Ops | Pre- and post-deployment checklist for engineering teams. |
| `README.md` | Server Docs | Quick deployment instructions for web servers (Cloudflare, Vercel, Nginx). |

### 3.2 Internal Strategy & Audit Artifacts (Development & Content Team)
Non-public strategic deliverables retained internally for marketing, developer, and SEO strategy:

| Artifact | Artifact Type | Strategic Description & Role |
|---|---|---|
| `aeo-audit-scorecard.json` | Diagnostic | Automated scoring across machine readability, entity clarity, and citation readiness. |
| `ai-citation-benchmark.json` | Benchmark Config | Live evaluation metrics across top foundation models via OpenRouter. |
| `geo-content-brief.md` | Content Strategy | 40–60 word passage citability rules optimized for ChatGPT Search and Perplexity. |
| `cluster-map.html` | Visual Architecture | Interactive HTML semantic topic cluster map showing hubs and spoke authority flows. |
| `technical-seo-audit.json` | Technical Audit | Crawl evaluation covering SSL, canonicals, robots directives, and responsiveness. |
| `jsonld-schema-templates.json` | Schema Suite | Production-ready Schema.org templates (`WebApplication`, `Organization`, `FAQPage`). |
| `schema-validation-report.md` | Compliance | Rich-result compliance report evaluating structured data against search standards. |
| `ai-answer-passages.md` | Direct Answers | Pre-packaged high-citation Q&A passages designed for zero-click AI snippet extraction. |

---

## 4. Execution Interfaces & Developer Tools

### 4.1 CLI Commands (`bin/answerindex.mjs`)
- `answerindex ready <domain> [brand]`: Generate the complete 26-file Answer Index optimization suite into `./ai-readiness-dist/<domain>/`.
- `answerindex benchmark`: Run real-time multi-model LLM citation & entity recognition queries across OpenRouter models (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun).
- `answerindex aeo <domain>`: Execute domain-level AEO assessment via `aeo-platform`.
- `answerindex seo`: Launch modular technical SEO deep-dive tools via `seo-toolkit/`.
- `answerindex mcp`: Start the native Model Context Protocol stdio server.

### 4.2 Model Context Protocol (MCP) Server (`lib/mcp-server.mjs`)
Native MCP integration for AI coding assistants (Cursor, Claude Code, Windsurf, VS Code):
- **Tool 1: `generate_ai_readiness_kit`**: Programmatically generate the full 26-file suite for any domain and brand.
- **Tool 2: `list_ai_crawlers`**: Return recognized crawler bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot`), company origins, and recommended permissions.
- **Tool 3: `get_llms_txt_spec`**: Return the official specifications for `llms.txt` and `ai.txt`.
- **Tool 4: `get_execution_engine_spec`**: Expose the 5-phase sequential deliverable standard (Ingestion/NER ➔ Schema ➔ AEO Snippets ➔ GEO Chunks ➔ Verification).
- **Tool 5: `get_anti_hallucination_spec`**: Expose the deterministic hallucination triage and grounding protocol for AI engines.

### 4.3 Script Runners
- `run-benchmark.sh`: Multi-model citation tester.
- `run-aeo.sh`: AEO platform runner.
- `run-seo.sh`: Technical SEO audit runner.

### 4.4 Engine Specifications & Knowledge Architecture
- **[EXECUTION-ENGINE-SPEC.md](file:///d:/AI%20Product/answerindex/EXECUTION-ENGINE-SPEC.md)**: Defines the step-by-step deliverable pipeline for converting any brand corpus into prioritized, cited answers across AI and search surfaces.
- **[ANTI-HALLUCINATION-SPEC.md](file:///d:/AI%20Product/answerindex/ANTI-HALLUCINATION-SPEC.md)**: Defines the deterministic triage categories (*Temporal Lag*, *Semantic Drift*, *Pure Fabrication*, *Third-Party Poisoning*), 45–60 word contrast statements, machine-readable grounding payloads (`/llms.txt` + JSON-LD), and AI crawler audit workflows.

---

## 5. Web Portal & Creator Feedback Ecosystem

### 5.1 Main Portal (`index.html` — https://answerindex.pages.dev)
- **Design Philosophy:** Premium dark aesthetic (`#080d1a`), ambient animated gradient blur orbs, and glassmorphic cards.
- **Header:** Brand title (`Answer Index`), high-contrast white GitHub link button, and responsive glass dropdown menu.
- **Hero Section:** 2-column desktop split blending high-resolution asset showcase (`assets/answerindex-preview.png`) with headline, badge, and primary/secondary CTAs.
- **Interactive Technical Preview:** macOS/Linux live CLI terminal box detailing 26-file generation.
- **Core Sections:**
  - *Why Answer Index:* The zero-click search reality comparing unstructured risk vs Answer Index readiness.
  - *How It Works:* 3-phase pipeline (Benchmark ➔ AEO Audit ➔ 26-File Manifest Deployment).
  - *Features Matrix:* 6 core capabilities.
  - *26-File Architecture Viewer:* Side-by-side public web-root protocols vs internal strategy suite.
  - *GEO Passage Showcase:* Side-by-side comparison of traditional marketing copy vs optimized 48-word factual GEO block.
  - *MCP Integration:* Ready-to-copy JSON configuration for Cursor and Claude Code.
- **Footer:** 4-column resource directory, version badges (`v1.4.0 Production`, `MIT Open Source`), and an interactive **Disclaimer, Terms & License** modal dialog.

### 5.2 Direct Feedback System (`feedback.html` — https://answerindex.pages.dev/feedback.html)
- **Direct to Creator:** Enables developers and users to send feedback, feature ideas, and crawler issues directly to Sameer Sharma (`justmailsameer@gmail.com`).
- **Interactive Topic Filters:** 💡 Feature Idea, 🤖 Crawler Directive, 🔌 MCP Integration, 🐞 Bug / Issue, 💬 General Love.
- **FormSubmit Background Dispatch:** Automatic background submission with form-activation protection.
- **User Confirmation:** Dedicated interactive modal popup (*"Thank You! Your feedback has been delivered directly to Sameer..."*) with automatic form reset.

---

## 6. Legal, Security & Governance

### 6.1 Copyright & Licensing
- **License:** MIT License.
- **Copyright:** Copyright (c) 2026 Sameer Sharma. All rights reserved. Free for commercial and open-source usage.

### 6.2 Disclaimer & Terms of Use
- **Automated Platform Activity & Policies:** Third-party AI platforms (OpenAI, Anthropic, Perplexity, Google) maintain explicit policies regarding automated scraping, crawling, and API usage. Users are responsible for complying with applicable terms.
- **No Warranties or Guarantees:** Software provided "as-is", without warranties of any kind regarding accuracy or search ranking outcomes.
- **Disclaimer of Liability:** Creators and contributors are not liable for operational damages, crawler bans, or loss of data resulting from direct or indirect use.
- **Public vs Private File Boundary:** No proprietary source code, operational checklists, or sensitive API keys are ever published to public web roots.
