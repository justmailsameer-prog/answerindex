# Growth Toolkit (AEO, GEO & SEO Suite) — Product Requirements Document (PRD)

> **Version:** 1.0 | **Date:** October 18, 2026  
> **Product Owner:** Sameer Sharma  
> **Repository / Location:** `D:\AI Product\growth-toolkit\`  
> **Status:** Operational Standalone CLI Suite  

---

## 1. Executive Summary & Vision

### One-Liner
**Growth Toolkit** is a standalone, local-first intelligence and auditing suite designed to measure, diagnose, and optimize web applications for traditional search engines (SEO) and modern generative answer engines (AEO & GEO: ChatGPT, Perplexity, Claude, Gemini, and Groq).

### Problem Statement
Most modern marketing tools:
1. Are heavily focused on legacy Google rankings while completely ignoring generative AI citation behavior (ChatGPT, Claude, Perplexity).
2. Couple diagnostic testing suites directly into client repositories, introducing gigabytes of dependency bloat (Playwright, BeautifulSoup, AEO frameworks).
3. Do not measure base LLM hallucinations versus live search-grounded retrieval (RAG).

### Solution
A completely decoupled, reusable local suite that can analyze any domain on-demand without installing scripts or modifying dependencies inside target client applications.

---

## 2. Core Pillars & Architecture

```
                       GROWTH TOOLKIT WORKSPACE
                  [ D:\AI Product\growth-toolkit\ ]
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
[ 1. SEO Toolkit ]         [ 2. AEO Platform ]         [ 3. Benchmark Suite ]
  • Technical Audit          • Brand Visibility          • Multi-Model Querying
  • Schema.org Validation    • Citation Tracking         • Hallucination Audits
  • Sitemap & Canonical      • Query Acronym Fit         • OpenRouter & Groq
  (run-seo.sh)               (run-aeo.sh)                (run-benchmark.sh)
```

---

## 3. Tool Specifications

### 3.1 SEO Toolkit Engine (`run-seo.sh` / `seo-toolkit/`)
- **Technology:** Python 3.11+, Requests, BeautifulSoup4, LXML.
- **Capabilities:**
  - Automated crawling and HTTP status inspection.
  - JSON-LD structured data extraction and validation (`WebApplication`, `FAQPage`, `HowTo`, `Article`).
  - Canonical link tag checking and title/meta-description length validation.
  - Sitemap discovery and robots.txt analysis.
- **CLI Commands:**
  ```bash
  ./run-seo.sh audit <URL>
  ./run-seo.sh doctor
  ./run-seo.sh technical <URL>
  ./run-seo.sh schema <URL>
  ```

### 3.2 AEO & AI Citation Tracker (`run-aeo.sh` / `aeo-platform`)
- **Technology:** Node.js, `aeo-platform` (MIT License).
- **Capabilities:**
  - Tests whether AI answer engines (ChatGPT, Claude, Gemini, Perplexity) mention or cite a given brand.
  - Formulates a 30-mission prioritized optimization plan based on visibility gaps.
  - Tracks trends across weekly audit runs in `.aeo-tracker.json`.
- **CLI Commands:**
  ```bash
  ./run-aeo.sh init --brand="<Brand>" --domain="<Domain>"
  ./run-aeo.sh run --force
  ./run-aeo.sh report
  ```

### 3.3 Multi-Model Benchmark Suite (`run-benchmark.sh` / `test-aeo-models.mjs`)
- **Technology:** Node.js ES Modules, Fetch API, OpenRouter & Groq endpoints.
- **Capabilities:**
  - Tests base-weight perception and entity grounding across multiple models in parallel (Llama, Gemma, Nemotron, Groq OSS).
  - Pinpoints model hallucinations (e.g., detecting if a model mistakes a breathwork app for a voice-chat tool or URL shortener).
  - Rotates across free-tier keys without exposing primary billing limits.
- **CLI Command:**
  ```bash
  ./run-benchmark.sh
  ```

---

## 4. Environment & Security Architecture

### Key Vault (`.env`)
The toolkit maintains a centralized `.env` file containing configured provider keys:
- `OPENROUTER_API_KEY`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- Free-tier model keys (`OR_NEMOTRON_3_KEY`, `OR_VENICE_KEY`, `OR_STEP_3_5_KEY`, `OR_LLAMA_3_2_KEY`, `OR_GEMMA_3_27B_KEY`).

---

## 5. Roadmap & Future Enhancements

- **v1.1 Automated Report Exporter:** Markdown/PDF summary export for client audits.
- **v1.2 Headless Playwright Screenshot Capture:** Automated visual diffing of live sites versus competitor landing pages.
- **v1.3 Auto-PR Submitter:** Command-line submission of awesome-list pull requests directly to GitHub.
