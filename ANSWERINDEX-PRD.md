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
- **Open-Source Portal Platform:** Cloudflare Pages direct upload project (`answerindex.pages.dev`).
- **Commercial Pro Portal Platform:** Dedicated separate Cloudflare Pages project (`answerindex-pro.pages.dev`), keeping the free open-source portal completely isolated and protected.
- **Cache Invalidation:** Configured with zero-age revalidation (`Cache-Control: public, max-age=0, must-revalidate`) ensuring instant updates upon deployment across edge locations.

---

## 5.4 Answer Index Pro — Commercial Architecture & Wireframe (`answerindex-pro.pages.dev`)
The paid autonomous version of Answer Index introduces a commercial subscription layer ($149/mo Growth and $249/mo Pro Autonomous) built around a hands-free daily growth loop:
- **Daily 2-Job Autonomous Cadence:** One new authoritative AEO/GEO answer piece plus one technical SEO page refactor delivered every morning at 09:00 AM as a GitHub Pull Request.
- **Human-in-the-Loop Safety:** Dual approval options (GitHub PR review + 1-click web dashboard merge) with pre-merge Schema validation scorecards and zero-click snippet previews.
- **High-Contrast Editorial Design System:** Alternating high-contrast sections following a tailored brand palette:
  * Hero & Engine Mechanics: Pure Black (`#000000`)
  * Daily Calendar Routine: Warm Cream (`#f5f4f0`)
  * How Approvals Work & Competitive Landscape: Charcoal Grey (`#333333`)
  * Customer Journey & Lifecycle: Electric Cobalt Blue (`#3a57fc`)
  * **Transparent Value Economics & Deliverables Matrix:** Electric Lime (`#a7c75d`)
  * **"Before You Start" Transparent Answers (FAQ):** Dark Orange (`#ff8c00`)
  * Talk to the Founder & Direct Consultation: Charcoal Grey (`#333333`)
  * Detailed Footer: Pure Black (`#000000`)
- **Transparent Value Economics Matrix:** Unified enterprise deliverables comparison table detailing 8 core deliverables and replacing ~$4,249/month of agency and consultant retainers ($1,500/mo for 30 AEO articles + $800/mo for 30 technical fixes).
- **Direct Founder Channels & Triage:**
  1. *15-Minute Strategy Triage Video Call:* Direct Google Meet walkthrough with Sameer Sharma.
  2. *Free 24-Hour AI Crawler & Citation Audit:* Automated domain simulation across ChatGPT, Perplexity, and Claude.
  3. *Direct Founder Channel:* Direct email contact (`sameer@answerindex.com`) with a guaranteed 4-hour response time (Monday–Saturday).
- **Interactive Scheduling Modal Dialog:** 3-tab accessible modal for booking intro video calls, requesting free audits, and sending direct messages with escape-key support and feedback toasts.

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
| **v2.0.0** | Oct 2026 | **Commercial Pro Wireframe & Live Deployment:** Completed high-converting landing architecture on `answerindex-pro.pages.dev`, interactive calendar dispatcher, approval flow wireframe, value economics, #ff8c00 FAQ section, direct founder contact modal, and separate Cloudflare Pages isolation. |
| **v2.1.0** | Oct 2026 | **Cloudflare D1 Database & Edge API Architecture (Completed):** Provisioned `answerindex-db` (D1 Database ID: `3894eea3-f7c8-4c9b-a2e8-e75a651aa30c`), applied relational schema (`users`, `projects`, `daily_jobs`, `citation_benchmarks`, `leads_and_triage`, `webhook_events`), bound `DB` to `answerindex-pro` and `answerindex`, deployed live edge API functions (`/api/jobs`, `/api/citations`, `/api/triage`, `/api/approve-pr`, `/api/webhooks/dodo`), and wired landing page consultation modal to D1. |
| **v2.2.0** | Oct 2026 | **Payments, Annual Billing & Client Dashboard (Completed):** Built and deployed dedicated authenticated Client Web Dashboard (`dashboard.html` on `answerindex-pro.pages.dev/dashboard`) in warm editorial cream (`#f5f4f0`); added dynamic Monthly/Annual billing switcher with 20% discount; created 4 Live Mode and 4 Test Mode Dodo subscription products under Answer Index; built `/api/create-checkout` with intelligent dual-mode fallback engine. |
| **v2.3.0** | Next | **Autonomous Engine Execution & Webhook Reconciliation:** GitHub App webhook integration for automatic PR sync, automated morning cron dispatcher (Cloudflare Workers Cron Triggers at 09:00 AM UTC), and live Dodo KYC merchant activation. |

---

## 8. Database Architecture & Edge API Implementation (`answerindex-db`)

### 8.1 Database Specifications
- **Database Engine:** Cloudflare D1 (Serverless Distributed SQLite at edge)
- **Database Name:** `answerindex-db`
- **Database ID:** `3894eea3-f7c8-4c9b-a2e8-e75a651aa30c`
- **Primary Region:** APAC (Singapore `SIN`) with global edge replication
- **Edge Latency:** ~0.20ms query duration across Cloudflare PoPs
- **Binding Variable:** `env.DB`

### 8.2 Deployed Schema & Tables
1. **`users`**: Tenant accounts, emails, plan tiers (`growth` $149, `pro_autonomous` $249), subscription status (`active`, `inactive`, `cancelled`), and Dodo customer/subscription IDs.
2. **`projects`**: Tenant domains, brand names, GitHub repo connection (`repo_owner`, `repo_name`, `branch`), and Google Search Console property tracking.
3. **`daily_jobs`**: The 2-Job Autonomous Dispatch Queue (Job 1: New AEO Answer Asset, Job 2: Technical SEO/GEO Refactor), Schema validation scores (100/100), diff summaries, and 1-click approval statuses (`pending`, `approved`, `merged`).
4. **`citation_benchmarks`**: Telemetry tracking brand citations across Perplexity, ChatGPT Search, Claude, and Gemini.
5. **`leads_and_triage`**: Founder consultation bookings, 24-hour free AI audit requests, and direct founder messages submitted via the interactive modal.
6. **`webhook_events`**: Idempotent audit log for all payment gateway events (`subscription.created`, `subscription.active`, `payment.succeeded`).

### 8.3 Live Edge API Endpoints (`functions/api/`)
- `GET /api/project`: Returns connected domain, repository connection, plan tier, and aggregate statistics.
- `GET /api/jobs`: Retrieves real-time daily job queue filtered by project and approval status.
- `POST /api/jobs`: Dispatches a new autonomous daily job into the queue.
- `POST /api/approve-pr`: 1-click PR approval handler updating status and recording merge timestamps.
- `GET /api/citations`: Returns live citation velocity stats and engine benchmarks.
- `POST /api/triage`: Records strategy call bookings and 24-hr audit requests directly to D1.
- `POST /api/create-checkout`: Creates hosted Dodo Payments checkout sessions for Growth and Pro Autonomous plans.
- `POST /api/webhooks/dodo`: Secure Dodo Payments webhook handler updating user subscription tiers.

---

## 9. Dodo Payments Integration (`Answer Index` Brand)

### 9.1 Brand Isolation
- **Primary Brand:** Blabr
- **Secondary Dedicated Brand:** Answer Index (Clean workspace separation ensuring all customer invoices, receipts, and checkout descriptors display "Answer Index").
- **API Environment:** Test Mode (Ready to swap to Live Mode via `.env`).

### 9.2 Configured Subscription Products (Answer Index Brand)

#### Live Mode Products (`https://live.dodopayments.com`)
| Plan Tier | Price / Term | Product ID (Live) | Billing Interval |
| :--- | :--- | :--- | :--- |
| **Answer Index Growth (Monthly)** | $149.00 / mo | `pdt_0Nq8mjgfNfEsNBbQkzqiW` | Monthly recurring |
| **Answer Index Pro Autonomous (Monthly)** | $249.00 / mo | `pdt_0Nq8mjiTwVYBMTZtswj5O` | Monthly recurring |
| **Answer Index Growth (Annual)** | $1,428.00 / yr ($119/mo) | `pdt_0Nq8mjkKnCKtceVwCGV89` | Annual recurring (Save 20%) |
| **Answer Index Pro Autonomous (Annual)** | $2,388.00 / yr ($199/mo) | `pdt_0Nq8mjlabKyFMgkI3zJlb` | Annual recurring (Save 20%) |

#### Test Mode Sandbox Products (`https://test.dodopayments.com`)
| Plan Tier | Price / Term | Product ID (Test) | Billing Interval |
| :--- | :--- | :--- | :--- |
| **Answer Index Growth (Monthly)** | $149.00 / mo | `pdt_0Nq8T1xSM5rcoI3Pnbv7q` | Monthly recurring |
| **Answer Index Pro Autonomous (Monthly)** | $249.00 / mo | `pdt_0Nq8T1zIQyR0pvdZbTHqU` | Monthly recurring |
| **Answer Index Growth (Annual)** | $1,428.00 / yr ($119/mo) | `pdt_0Nq8WXISavEALUuPtVxAU` | Annual recurring |
| **Answer Index Pro Autonomous (Annual)** | $2,388.00 / yr ($199/mo) | `pdt_0Nq8WXJJURRMwGRqVanWP` | Annual recurring |

### 9.3 Checkout Workflow & Fallback Engine
1. User clicks **"Start Growth"** or **"Claim Pro Access"** (Monthly or Annual toggle) on [pro.html](file:///d:/AI%20Product/answerindex/pro.html).
2. Client posts to `/api/create-checkout` with `{ plan, billing }`.
3. Intelligent Edge Engine:
   * Checks if Live Mode is active and requests live checkout session at `https://live.dodopayments.com/checkouts`.
   * If merchant KYC activation is pending in Dodo (`MERCHANT_NOT_LIVE`), automatically falls back to Test Mode so visitors never hit broken links.
4. User is redirected to hosted checkout: `https://...checkout.dodopayments.com/session/...`.
5. Upon successful checkout, customer is redirected to: `https://answerindex-pro.pages.dev/dashboard?checkout=success`.
6. Webhook triggers `/api/webhooks/dodo` to provision user in Cloudflare D1.

---

## 10. Completed Milestone (v2.3.0) — Free Instant SEO & AI Audit Engine + PDF Generator

1. **Top Menu Navigation Refinement:**
   - Removed the intrusive `"Subscribe at $249 per month"` button from the top navigation bar of `pro.html`.
   - Replaced with high-converting **`🔍 Free SEO Audit`** anchor button scrolling directly to the audit engine.
2. **Instant Website Diagnostic Engine (`#audit-tool`):**
   - Live interactive scanner supporting any domain extension (`.com`, `.in`, `.org`, `.io`, `.co`, etc.).
   - 5-point automated analysis:
     1. Probing robots.txt & AI Crawler Directives (GPTBot, ClaudeBot, PerplexityBot).
     2. Inspecting Schema.org JSON-LD Entity Graph (`@graph`, `Organization`, `sameAs`).
     3. Auditing passage-level AEO zero-click direct-answer snippets (40–55 words).
     4. Testing `/llms.txt` standard manifests & vector index readiness.
     5. Synthesizing official 2-page executive PDF audit report.
3. **Automated Client-Side PDF Generator:**
   - Powered by jsPDF with zero external dependencies.
   - Generates a branded, multi-page executive PDF report: `[domain]-AnswerIndex-SEO-Audit.pdf`.
   - Page 1: Executive Scorecard, Domain Spotlight, Grade (A–D), Core Pillar Performance Breakdown (Technical SEO, AEO, Schema, AI Discovery), and Top Critical Gaps Detected.
   - Page 2: 30-Day Remediation Blueprint (Phase 1 Manifests, Phase 2 Schema, Phase 3 AEO Snippets, Phase 4 Daily Cadence), Pro Portal links, and Founder consultation details.
4. **Cloudflare D1 Lead & Telemetry Ingestion:**
   - Every audit run makes an asynchronous `POST` to `/api/triage`, logging the domain, email, audit score, and timestamp to the `leads_and_triage` table.
5. **Cross-Platform Deployment:**
   - Live on both `https://answerindex-pro.pages.dev` and `https://answerindex.pages.dev`.

---

## 10. Completed Milestone (v2.4.0) — Minimalist Submenus, Logo-Branded Audit PDF & 12-Month Annual Dominance Roadmap

1. **Minimalist Hamburger Menu with Accordion Submenus:**
   - Streamlined long 16-item vertical navigation list into a clean, compact hierarchy.
   - Primary high-intent links: `🔍 Free SEO & AI Audit` (highlighted pill), `💡 About Answer Index`, `⚡ Commercial Pro`, `📊 Live Client Dashboard`.
   - Expandable Submenu 1: **⚙️ Platform & Features** (`Daily Autonomous Routine`, `Market Comparison`, `Pricing & Plans`, `FAQ & How It Works`).
   - Expandable Submenu 2: **📞 Contact Us** (`Book 15-Min Intro Call`, `Email Founder Directly`, `Direct Feedback Channel`).
   - Deployed across `pro.html`, `index.html`, and `dist/pro/`.

2. **Executive Audit PDF Enhancements (Paid Conversion Engine):**
   - **Prominent Brand Identity:** Answer Index 3D vector logo dynamically rendered on top of every page header alongside bold white enterprise typography.
   - **Zero Open-Source Leaks:** Completely removed all GitHub and MIT open-source repository links to prevent sales leakage and maximize paid plan conversions.
   - **Replaced 30-Day Plan with Urgent Emergency Alerts:** Eliminated the 30-day plan (which mistakenly implied SEO is finished in a month). Replaced with high-severity emergency alerts regarding missing `/llms.txt`, Schema `@graph` voids, and active competitor citation theft in ChatGPT Search, Perplexity, and Google AI Overviews.
   - **12-Month Autonomous AI & Search Dominance Roadmap:** Added a detailed 5-phase annual roadmap demonstrating why continuous 12-month optimization is essential to build an insurmountable AI citation moat:
     - *Months 1–2:* Emergency Ingestion Triage & Machine-Readable Foundation (`/llms.txt`, Schema graph, AI crawler directives).
     - *Months 3–4:* Passage-Level AEO Direct Answers & Zero-Click Capture (60+ declarative answer blocks).
     - *Months 5–6:* Competitor Citation Displacement & Comparative Proofs (feature matrices, alternative guides).
     - *Months 7–9:* Semantic Entity Graph Expansion & Deep Long-Tail Category Moat (180+ topical clusters).
     - *Months 10–12:* Complete AI Consensus Monopolization & Continuous Model Recalibration (auto-adapting to GPT-5, Gemini 2, Claude 4 updates).
   - **Dual Conversion Call-to-Action:** Highlights immediate start with Monthly Pro ($249/mo) and 20% annual savings with the 12-Month Annual Plan ($199/mo).

---

## 11. Completed Milestone (v2.5.0) — Client Portal, Multi-Platform CMS Delivery & Cloudflare D1 Workspace Auth

1. **Client Portal & Header Authentication Navigation:**
   - Deployed high-visibility `🔑 Client Portal` button across `index.html`, `pro.html`, `about.html`, and `dashboard.html`.
   - Built the unified Client Auth & Onboarding Modal (`assets/client-portal.css`, `assets/client-portal.js`).
   - Tab 1: **Client Sign In** — Instant work email verification against Cloudflare D1 `users` and `projects` tables, featuring 1-click test logins (`client@shopify-store.com`, `editor@wordpress-brand.com`, `sameer@answerindex.com`).
   - Tab 2: **Onboard New Site** — Zero-friction onboarding for new clients with website domain, company name, and CMS platform selection.

2. **Universal Platform Selector for Technical & Non-Technical Merchants:**
   - Solved the non-GitHub delivery requirement with first-class platform cards:
     - 🐙 **GitHub Repository:** Daily automated PRs with JSON-LD schema & AEO markdown files.
     - 🌐 **WordPress:** Daily answer pieces & FAQ blocks staged as WordPress Drafts in WP Admin via REST API.
     - 🛍️ **Shopify:** Daily articles & product Q&A structured schema staged in Shopify Drafts & Metafields via Shopify Admin API.
     - 📦 **Magento / Adobe Commerce:** Staged PageBuilder CMS blocks & XML via Magento 2 REST API.
     - 💻 **Web Portal & 1-Click Copy:** Native in-dashboard review with 1-click clipboard copy and daily email digests.

3. **Multi-Platform Dashboard View Adapter & D1 Integration:**
   - **Database Migration (`migrations/0003_add_cms_support.sql`):** Added `cms_type`, `cms_url`, `delivery_channel`, and `content_html` to Cloudflare D1 `projects` and `daily_jobs`.
   - **Backend API (`/api/auth/client`):** Edge endpoints for client login, site registration, and dynamic platform-tailored daily job seeding.
   - **Platform-Tailored Action Buttons:**
     - WordPress: `🌐 Open WP Draft ↗`, `📋 Copy Gutenberg Block`, `✓ 1-Click Publish to WordPress`.
     - Shopify: `🛍️ Shopify Admin ↗`, `📋 Copy Metafields`, `✓ 1-Click Publish to Shopify`.
     - Magento: `📦 Open PageBuilder ↗`, `📋 Copy XML Block`, `✓ 1-Click Push to Magento`.
     - Web Portal: `📋 1-Click Copy HTML & Schema`, `✓ Mark as Applied`.
     - GitHub: `🐙 GitHub PR #... ↗`, `✓ 1-Click Approve & Merge`.
   - **Content Preview Modal:** Live rendered rich article preview + raw syntax-highlighted HTML/Schema graph with 1-click copy.
   - Verified end-to-end in browser via autonomous subagent with visual video artifact recording.

---

## 12. Next Milestone (v2.6.0)

1. **Merchant KYC Activation:** Complete business profile / bank payout details in Dodo Payments Dashboard under Settings > Business Profile for Answer Index to enable live card charges.
2. **GitHub App Webhook Integration:** Bi-directional sync between GitHub PR merge events and Cloudflare D1 job queue statuses.
3. **Automated WP/Shopify Webhook Dispatch:** Native OAuth plugin endpoints for instant direct draft injection.







