# AnswerIndex — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved & Initialized  
**Product Name:** AnswerIndex  
**Repository:** https://github.com/justmailsameer-prog/answerindex  
**Tagline:** Make your content indexable as authoritative answers across Search & AI Engines.

---

## 1. Executive Summary & Vision

Traditional SEO solves for indexing by web crawlers. The modern web is dominated by **Answer Engines** (Perplexity, ChatGPT Search, Gemini, Claude, Copilot, Grok) and **Generative Search** (Google AI Overviews).

**AnswerIndex** is a unified, open-source audit and optimization engine designed to evaluate, diagnose, and structure web products so they become the primary referenced source in generative AI responses and organic search.

---

## 2. Core Pillars

1. **Answer Engine Optimization (AEO):** Audit how AI models extract, comprehend, and cite brand answers.
2. **Generative Engine Optimization (GEO):** Analyze citation frequency, entity graph connectivity, and authority signals.
3. **Traditional Technical & Semantic SEO:** Structural crawling, JSON-LD Schema generation, meta validation, and cluster strategy.

---

## 3. Architecture

- **CLI Runner:** `answerindex` (`./bin/answerindex.mjs`)
- **AEO Assessment Engine:** Integrated `aeo-platform` execution.
- **Multi-Model Benchmark:** `test-aeo-models.mjs` verifying citation accuracy across open and proprietary foundation models via OpenRouter.
- **Deep SEO Skill Suite:** `seo-toolkit/` modular skills covering technical audit, schema validation, sitemaps, and GEO content briefs.
- **Universal Bash Runners:** `run-seo.sh`, `run-aeo.sh`, `run-benchmark.sh`.

---

## 4. Licensing & Attribution

- **License:** MIT License
- Portions derived from `claude-seo` by Agrici Daniel (MIT) and `aeo-platform` (MIT).
- All proprietary API credentials remain strictly untracked via `.gitignore`.
