# Answer Index — Product Requirements Document (PRD)

**Document Version:** 1.8.0  
**Status:** v1.0 Foundation Milestone Frozen — Production v1.8.0  
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
- `answerindex ready <domain> [brand]`: Generate the complete 26-file Answer Index optimization suite for any brand into `./ai-readiness-dist/<domain>/`.
- `answerindex benchmark <domain> [brand]`: Run real-time LLM citation & entity recognition queries across OpenRouter foundation models for any website/brand, supporting unified `OPENROUTER_API_KEY` configuration.
- `answerindex aeo <domain>`: Execute domain-level AEO assessment via `aeo-platform`.
- `answerindex seo`: Launch modular technical SEO deep-dive tools with automated Python dependency pre-flight verification (`beautifulsoup4`, `requests`).
- `answerindex mcp`: Start the native Model Context Protocol stdio server with clear diagnostic status logging for AI coding environments.

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
- **Design Philosophy:** Premium dark aesthetic (`#080d1a`), ambient animated gradient blur orbs, and glassmorphic cards with compact, responsive section spacing (`1.5rem 0` desktop, `1.15rem 0` mobile).
- **Unified Navigation & Animated Hamburger Menu:**
  - Full-fidelity animated 3-bar hamburger icon (`.hamburger-icon` / `.hamburger-bar`) across mobile and desktop.
  - Smooth 45° rotation into a close (`✕`) state upon opening.
  - Direct links to *Overview*, *5-Phase Engine*, *Features*, *Architecture*, *GEO Showcase*, *Anti-Hallucination*, *MCP Server*, and *Feedback*.
  - Sticky glass header with brand logo, high-contrast white GitHub repository button, and quick Feedback CTA.
- **Social Sharing & Open Graph Rich Previews:**
  - Native `🔗 Share with Friends` button embedded in both the main dropdown menu and the footer.
  - Triggered via Web Share API (`navigator.share`) on supported mobile/desktop browsers with automatic clipboard fallback and custom floating toast notification.
  - Absolute Open Graph (`og:image`) and Twitter Card (`twitter:image`) metadata configured with dedicated high-resolution logo preview (`https://answerindex.pages.dev/assets/AnswerIndex_Logo.png`, 512x512).
- **Hero Section:** 2-column desktop split blending high-resolution asset showcase (`assets/answerindex-preview.png`) with headline, badge, and primary/secondary CTAs.
- **Interactive Technical Preview:** macOS/Linux live CLI terminal box detailing 26-file generation.
- **Core Sections:**
  - *Why Answer Index:* The zero-click search reality comparing unstructured risk vs Answer Index readiness.
  - *The 5-Phase Execution Pipeline:* Dedicated interactive workflow cards (Phase 1: Ingestion & Entity Modeling ➔ Phase 2: Structural Schema & Technical SEO ➔ Phase 3: AEO 40–55 Word Snippets ➔ Phase 4: GEO & RAG Chunking ➔ Phase 5: Delivery & Verification).
  - *Features Matrix:* 6 core capabilities engineered for the post-search era.
  - *26-File Architecture Viewer:* Side-by-side public web-root protocols vs internal strategy suite.
  - *GEO Passage Showcase:* Side-by-side comparison of traditional marketing copy vs optimized 48-word factual GEO block.
  - *AI Hallucination Correction Engine (`#anti-hallucination`):* Dedicated section featuring the 4-part triage protocol (Temporal Lag, Semantic Drift, Fabrication, Third-Party) and the canonical AEO Contrast Grounding Formula.
  - *MCP Integration:* Ready-to-copy JSON configuration for Cursor and Claude Code.
- **Footer & Legal Navigation:**
  - 4-column organized resource directory (*Engine & Capabilities*, *Knowledge & Specs*, *Resources & Legal*, *About*).
  - Cleaned navigation structure: single, canonical **Disclaimer, Terms & License** modal trigger link under *Resources & Legal* (duplicate removed from bottom copyright row).
  - Interactive modal dialog for Disclaimers, Terms, and MIT License with backdrop dismiss and keyboard ESC support.
  - Version badges (`v1.6.0 Production`, `MIT Open Source`).

### 5.2 Direct Feedback System (`feedback.html` — https://answerindex.pages.dev/feedback.html)
- **Direct to Creator:** Enables developers and users to send feedback, feature ideas, and crawler issues directly to Sameer Sharma (`justmailsameer@gmail.com`).
- **Interactive Topic Filters:** 💡 Feature Idea, 🤖 Crawler Directive, 🔌 MCP Integration, 🐞 Bug / Issue, 💬 General Love.
- **FormSubmit Background Dispatch:** Automatic background submission with form-activation protection.
- **User Confirmation:** Dedicated interactive modal popup (*"Thank You! Your feedback has been delivered directly to Sameer..."*) with automatic form reset.
- **Consistent UX:** Matches main portal styling, animated hamburger menu, shared styling tokens, and social sharing capabilities.

---

## 5.3 Deployment & Infrastructure Pipeline
- **Host Platform:** Cloudflare Pages direct upload project (`answerindex.pages.dev`).
- **Deployment Method:** `npx wrangler pages deploy . --project-name=answerindex --branch=main`.
- **Cache Invalidation:** Configured with zero-age revalidation (`Cache-Control: public, max-age=0, must-revalidate`) ensuring instant updates upon deployment across edge locations.

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

---

## 7. Version History & Milestones

| Version | Date | Milestone & Deliverables |
|---|---|---|
| **v1.0 – v1.5** | Q1 2026 | Initial 5-Phase AEO/GEO engine, 26-file deployment model, MCP server, and CLI tools. |
| **v1.6.0** | Oct 2026 | Mobile responsive drawer, social sharing API, live Cloudflare Pages portal. |
| **v1.7.0** | Oct 2026 | Dedicated direct feedback portal (`feedback.html`), OpenRouter single-model benchmarking refactor. |
| **v1.8.0** | Oct 2026 | **Build Freeze (v1 Foundation Finalized):** Production readiness verified, static assets synchronized to `dist/`, PRD synchronized. |
| **v2.0 (Next)** | Planned | **Autonomous Continuous Loop:** Daily AEO job scheduler (1 new answer piece + 1 page improvement/day), live telemetry / GSC integration, Git Pull Request publishing pipeline, and native AI Agent skills library. |

