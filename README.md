<p align="center">
  <img src="assets/AnswerIndex_Logo.png" alt="AnswerIndex Logo" width="140" height="140" />
</p>

<h1 align="center">Answer Index</h1>

<p align="center">
  <strong>Make your Content Indexable as Authoritative Answers across Search & AI Engines.</strong>
</p>

<p align="center">
  <a href="#how-it-works">How It Works</a> •
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture--components">Architecture</a> •
  <a href="#license--attribution">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/AEO-Answer%20Engine%20Optimization-06B6D4.svg" alt="AEO" />
  <img src="https://img.shields.io/badge/GEO-Generative%20Engine%20Optimization-8B5CF6.svg" alt="GEO" />
  <img src="https://img.shields.io/badge/SEO-Schema%20%26%20Technical-10B981.svg" alt="SEO" />
</p>

---

<p align="center">
  <img src="assets/answerindex-preview.png" alt="AnswerIndex Preview" width="100%" />
</p>

---

AnswerIndex is a unified evaluation and optimization suite for **AEO (Answer Engine Optimization)**, **GEO (Generative Engine Optimization)**, and **Technical SEO**.

While traditional SEO focuses on getting crawled by search engines, **AnswerIndex** focuses on getting **cited as the definitive answer** by ChatGPT Search, Perplexity, Gemini, Claude, and Google AI Overviews.

---

## Why AnswerIndex?

When someone asks ChatGPT, Perplexity, Claude, or Gemini for a recommendation, comparison, or solution, they often receive an authoritative answer **before they ever visit a website**. If your content isn't structured for generative extraction, these models guess—and they often guess wrong or omit you entirely.

AnswerIndex bridges that gap by benchmarking how AI models actively perceive and cite your brand, auditing your site against answer-engine standards, and providing structured schemas and semantic patterns so AI assistants cite your product with complete accuracy and authority.

---

## How It Works

Start by cloning the repository, installing dependencies with `npm install`, and adding your free OpenRouter API keys to `.env`. 

1. **Benchmark AI Citations:** Run `npm run benchmark` to query top foundation models simultaneously (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun) and evaluate how AI perceives your brand, detects hallucinations, and measures citation frequency.
2. **Audit AEO & Clarity:** Run `npm run aeo` to conduct a comprehensive structural and transparency audit against Answer Engine standards, verifying your machine-readable clearings (`llms.txt`, robots directives, and ethical indexing policies).
3. **Deploy Structural SEO & GEO:** Run `npm run seo` to execute deep-dive technical audits, generate validated JSON-LD schemas (`WebApplication`, `FAQPage`, `HowTo`), and optimize semantic clusters—ensuring your product is prioritized by ChatGPT Search, Perplexity, Claude, and Google AI Overviews.

---

## Features

- 📦 **Complete 26-File AI Readiness & AEO Suite:** Generate the complete suite of 26 files (18 web-root files + 8 proprietary AnswerIndex AEO/GEO/Schema optimization artifacts) in a single command.
- 🤖 **AI Crawler & Retrieval Control:** Explicit directives and permission rules for major AI search engines (ChatGPT/GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot).
- 🧠 **Multi-Model AI Citation Benchmark:** Query top LLMs simultaneously (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun) to measure mention rate, entity accuracy, and citation authority.
- ⚡ **AEO Engine Audit & Scorecards:** Analyze your domain against Answer Engine standards with automated scoring, clarity checks, and ethical transparency benchmarks.
- 🎯 **Passage-Level GEO Content Briefs:** Formatted 40–60 word citation blocks specifically structured for Perplexity, ChatGPT Search, and Google AI Overviews.
- 🗺️ **Semantic Cluster Mapping:** Interactive visual topic cluster map (`cluster-map.html`) to establish internal authority pathways.
- 🛠️ **Deep Technical & Semantic SEO:** Comprehensive modular audit suite for JSON-LD schemas, sitemaps, semantic content clusters, and Core Web Vitals.
- 🔌 **Model Context Protocol (MCP) Server:** Native MCP support to connect AnswerIndex directly into Cursor, Claude Code, Windsurf, or VS Code.
- 💻 **Universal Automation:** Portable CLI and modular Bash runners for CI/CD pipelines or local terminal workflows.

---

## The Complete AnswerIndex Suite (26 Production Files)

When you run `npm run ready yourdomain.com "Your Brand"`, AnswerIndex generates a complete, tailored suite of **26 production files** into `./ai-readiness-dist/yourdomain.com/`:

### Part 1: The 18 AI Readiness Web-Root Files
These deploy directly to your website's public web root (`public/` or server root):

| Category | File | Purpose |
|---|---|---|
| **1. Identity & Permissions** | `robots.txt` | Controls bot access with explicit allowances for ChatGPT, Claude, Perplexity & Applebot. |
| | `ai.txt` | Standard transparency manifest, contact information, and AI citation permissions. |
| **2. Content Files** | `llms.txt` | Clean, markdown-formatted site overview and canonical links ([llmstxt.org](https://llmstxt.org) standard). |
| | `llms-full.txt` | Complete un-truncated documentation text corpus for large context window retrieval. |
| **3. Map & Navigation** | `sitemap.md` | Human- & LLM-readable markdown sitemap for clean architectural reasoning. |
| | `ai-sitemap.xml` | Priority XML sitemap built explicitly for AI indexing crawlers. |
| **4. Intelligence Files** | `ai-entities.json` | Machine-readable entity graph, core taxonomy, and verified brand claims. |
| | `ai-intent.json` | Maps natural language user queries directly to canonical destination URLs. |
| | `ai-schema.json` | Consolidated Schema.org JSON-LD graph (`WebSite`, `Organization`). |
| **5. Research Files (RAG)** | `rag-index.json` | Vector retrieval index with importance-weighted knowledge chunks. |
| | `rag-index.jsonl` | Line-delimited JSON format for batch embedding and vector database ingestion. |
| **6. Policy & Integrations** | `training-data-policy.txt` | Transparent fair-use policy for citations vs model training. |
| | `ai-disclosure.txt` | Formal AI integration and AEO compliance disclosure statement. |
| | `.well-known/ai-plugin.json` | Standard plugin manifest registering your site as an official AI endpoint. |
| **7. Operations & Guidance** | `manifest.json` | Full inventory index and compliance scorecard for all 26 generated files. |
| | `structured-data-guide.md` | Implementation guide for embedding high-citation JSON-LD schemas in your HTML. |
| | `deployment-checklist.md` | Step-by-step pre- and post-deployment checklist for engineering teams. |
| | `README.md` | Deployment instructions for your web root. |

### Part 2: AnswerIndex Proprietary AEO, GEO & Schema Artifacts (8 Files)
Optimization, benchmarking, and structured-data files for your marketing and SEO teams:

| Artifact | Type | Purpose |
|---|---|---|
| `aeo-audit-scorecard.json` | Diagnostic | Automated scoring across machine readability, entity clarity, and citation readiness. |
| `ai-citation-benchmark.json` | Benchmark Config | Configuration and metrics for multi-model LLM perception evaluation via OpenRouter. |
| `geo-content-brief.md` | Content Strategy | Passage-level citability rules (40–60 word blocks) for ChatGPT Search and Perplexity. |
| `cluster-map.html` | Visual Architecture | Interactive HTML semantic topic cluster map showing hubs and spoke authority flows. |
| `technical-seo-audit.json` | Technical Audit | Crawl evaluation covering SSL, canonicals, robots directives, and responsiveness. |
| `jsonld-schema-templates.json` | Schema Suite | Production-ready Schema.org templates (`WebApplication`, `Organization`, `FAQPage`). |
| `schema-validation-report.md` | Compliance | Rich-result compliance report evaluating structured data against Google and AI search standards. |
| `ai-answer-passages.md` | Direct Answers | Pre-packaged high-citation Q&A passages designed for zero-click AI snippet extraction. |

---

## MCP Server Integration (Cursor, Claude Code, Windsurf)

AnswerIndex includes a built-in **Model Context Protocol (MCP)** server so you can generate AI readiness files and inspect AI crawler specifications directly inside your coding agents.

### Cursor Setup
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "answerindex": {
      "command": "node",
      "args": ["d:/AI Product/answerindex/lib/mcp-server.mjs"]
    }
  }
}
```

### Claude Code Setup
Add to `.mcp.json` in your workspace:
```json
{
  "mcpServers": {
    "answerindex": {
      "command": "node",
      "args": ["./lib/mcp-server.mjs"]
    }
  }
}
```
Available tools in MCP:
- `generate_ai_readiness_kit`: Generate all 18 readiness files for any domain.
- `list_ai_crawlers`: Review major AI bots, permissions, and indexing purposes.
- `get_llms_txt_spec`: Retrieve the official specification for `llms.txt` and `ai.txt`.

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/justmailsameer-prog/answerindex.git
cd answerindex
npm install
```

### 2. Configure Environment

Copy the example configuration and add your free or paid API keys:

```bash
cp .env.example .env
```

### 3. Usage

```bash
# Generate AI Readiness deployment files for your website
npm run ready yourbrand.com "Your Brand Name"

# Run multi-model AEO citation benchmark
npm run benchmark

# Run AEO domain assessment
npm run aeo

# Run SEO deep audit
npm run seo

# Start AnswerIndex MCP server for AI IDEs (Cursor, Claude Code, Windsurf)
npm run mcp
```

Or run via the CLI directly:

```bash
node bin/answerindex.mjs ready yourbrand.com
node bin/answerindex.mjs benchmark
node bin/answerindex.mjs aeo
node bin/answerindex.mjs mcp
```

---

## Architecture & Components

| Component | Role | Description |
|-----------|------|-------------|
| `bin/answerindex.mjs` | Unified CLI | Command-line entry point (`ready`, `benchmark`, `aeo`, `seo`, `mcp`) |
| `lib/readiness-generator.mjs` | AI Readiness Engine | Generates `llms.txt`, `ai.txt`, `robots.txt`, schemas, entity & intent graphs |
| `lib/mcp-server.mjs` | MCP Server | Standard Model Context Protocol server for Cursor & Claude Code |
| `test-aeo-models.mjs` | Citation Benchmark | Multi-model evaluation across OpenRouter models |
| `seo-toolkit/` | Technical & Schema SEO | 24+ specialized SEO & GEO skill modules |
| `run-*.sh` | Script Runners | Portable runners for cross-platform automation |

---

## License

[MIT License](LICENSE)
