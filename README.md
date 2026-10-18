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

- 📦 **AI Readiness Kit Generator (`ready`):** Generate a full suite of root-level files (`llms.txt`, `llms-full.txt`, `ai.txt`, modern `robots.txt` AI crawler rules, `ai-entities.json`, `ai-intent.json`, `ai-schema.json`, and `ai-sitemap.xml`) in one command.
- 🤖 **AI Crawler & Retrieval Control:** Explicit directives and permission rules for major AI search engines (ChatGPT/GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot).
- 🧠 **Multi-Model AI Citation Benchmark:** Query top LLMs simultaneously (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun) to measure mention rate, entity accuracy, and citation authority.
- ⚡ **AEO Engine Audit:** Analyze your domain against Answer Engine standards with automated scoring and ethical transparency benchmarks.
- 🛠️ **Deep Technical & Semantic SEO:** Comprehensive modular audit suite for JSON-LD schemas, sitemaps, semantic content clusters, and Core Web Vitals.
- 🔌 **Model Context Protocol (MCP) Server:** Native MCP support to connect AnswerIndex directly into Cursor, Claude Code, Windsurf, or VS Code.
- 💻 **Universal Automation:** Portable CLI and modular Bash runners for CI/CD pipelines or local terminal workflows.

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
