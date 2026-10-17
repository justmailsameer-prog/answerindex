# Growth Toolkit 🚀
> The local-first, open-source CLI suite for **SEO (Search Engine Optimization)**, **AEO (Answer Engine Optimization)**, and **GEO (Generative Engine Optimization)**.

Diagnose and optimize any website for both legacy search engines (Google, Bing) and AI answer engines (**ChatGPT, Perplexity, Claude, Gemini, Groq**).

---

## 🌟 Why Growth Toolkit?

Traditional SEO tools only check meta tags and backlinks. Modern discovery happens across **Generative AI Answer Engines** where models either cite your website or hallucinate competitors.

**Growth Toolkit bridges that gap with three unified engines:**
1. **Technical SEO Engine:** Crawls, audits on-page tags, validates Schema.org JSON-LD structured data, checks canonical paths, and inspects sitemaps.
2. **AEO Brand Visibility Platform:** Runs simulated conversational benchmark queries across ChatGPT, Claude, and Gemini to score brand citation rates.
3. **Multi-Model Benchmark Suite:** Queries multiple LLM endpoints in parallel to catch model hallucinations and test real-time entity recognition.

---

## ⚡ Quick Start

### 1. Installation
Clone the repository and install the lightweight Node.js dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/growth-toolkit.git
cd growth-toolkit
npm install
```

Ensure you have Python 3.9+ installed with basic dependencies:
```bash
pip install requests beautifulsoup4 lxml
```

### 2. Configure Environment Keys
Copy the template and paste your preferred AI keys:
```bash
cp .env.example .env
```
*(Supports OpenRouter, Groq, Google Gemini, OpenAI, and Anthropic keys).*

---

## 🛠️ Usage

### 1. Run Comprehensive SEO Audit
```bash
# Full audit of any domain
./run-seo.sh audit https://yourwebsite.com

# Check environment & dependencies
./run-seo.sh doctor

# Check only structured data / Schema.org
./run-seo.sh schema https://yourwebsite.com
```

### 2. Run AEO Brand Visibility Check
Measure whether ChatGPT, Claude, or Gemini recommend your brand:
```bash
# Initialize for a domain
./run-aeo.sh init --brand="YourBrand" --domain="yourdomain.com"

# Run citations scan
./run-aeo.sh run --force

# Generate report
./run-aeo.sh report
```

### 3. Multi-Model Perception Benchmark
Query open models in parallel to test how LLMs describe your product:
```bash
./run-benchmark.sh
```

---

## 🔒 Security
- All sensitive API keys are strictly kept in `.env` (ignored by `.gitignore`).
- Zero telemetry or cloud dependencies required — runs 100% locally on your machine.

---

## 📄 License
MIT License. Free for developers, startups, and agencies.
