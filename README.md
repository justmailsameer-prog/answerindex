<p align="center">
  <img src="assets/AnswerIndex_Logo.png" alt="AnswerIndex Logo" width="140" height="140" />
</p>

<h1 align="center">AnswerIndex</h1>

<p align="center">
  <strong>Make your content indexable as authoritative answers across Search & AI Engines.</strong>
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

## How It Works

Start by cloning the repository, installing dependencies with `npm install`, and adding your free OpenRouter API keys to `.env`. 

1. **Benchmark AI Citations:** Run `npm run benchmark` to query top foundation models simultaneously (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun) and evaluate how AI perceives your brand, detects hallucinations, and measures citation frequency.
2. **Audit AEO & Clarity:** Run `npm run aeo` to conduct a comprehensive structural and transparency audit against Answer Engine standards, verifying your machine-readable clearings (`llms.txt`, robots directives, and ethical indexing policies).
3. **Deploy Structural SEO & GEO:** Run `npm run seo` to execute deep-dive technical audits, generate validated JSON-LD schemas (`WebApplication`, `FAQPage`, `HowTo`), and optimize semantic clusters—ensuring your product is prioritized by ChatGPT Search, Perplexity, Claude, and Google AI Overviews.

---

## Features

- 🧠 **Multi-Model AI Citation Benchmark:** Query top LLMs simultaneously (Nvidia Nemotron, Google Gemma, Liquid LFM, StepFun) to measure mention rate, entity accuracy, and citation authority.
- ⚡ **AEO Engine Audit:** Analyze your domain against Answer Engine standards with automated scoring and ethical transparency benchmarks.
- 🛠️ **Deep Technical & Semantic SEO:** Comprehensive modular audit suite for JSON-LD schemas, sitemaps, semantic content clusters, and Core Web Vitals.
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
# Run multi-model AEO citation benchmark
npm run benchmark

# Run AEO domain assessment
npm run aeo

# Run SEO deep audit
npm run seo
```

Or run via the CLI directly:

```bash
node bin/answerindex.mjs benchmark
node bin/answerindex.mjs aeo
```

---

## Architecture & Components

| Component | Role | Description |
|-----------|------|-------------|
| `bin/answerindex.mjs` | Unified CLI | Command-line entry point |
| `test-aeo-models.mjs` | Citation Benchmark | Multi-model evaluation across OpenRouter models |
| `seo-toolkit/` | Technical & Schema SEO | 24+ specialized SEO & GEO skill modules |
| `run-*.sh` | Script Runners | Portable runners for cross-platform automation |

---

## License & Attribution

AnswerIndex is open-source software licensed under the [MIT License](LICENSE).

Portions of the SEO skill definitions are derived from `claude-seo` by Agrici Daniel (MIT License) and `aeo-platform`. Full notices and license texts are preserved in the respective subdirectories and `LICENSE`.
