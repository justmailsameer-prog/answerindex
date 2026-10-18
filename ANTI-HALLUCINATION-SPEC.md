# Module: AnswerIndex AI Hallucination Correction & Knowledge Alignment

## Context & Objective
Generative AI engines (Perplexity, ChatGPT, Gemini, Copilot) frequently hallucinate or cite outdated third-party sources regarding brand entities, pricing, features, and executive leadership. 
Your objective is to ingest detected inaccuracies, isolate the factual discrepancies, and generate a deterministic grounding payload that forces retrieval-augmented generation (RAG) pipelines to replace the hallucination with the verified canonical truth.

---

## Input Structure
The user will provide:
- **Brand URL / Name:** `[Target Entity]`
- **Platform Where Error Appeared:** `[ChatGPT / Gemini / Perplexity / Copilot / Other]`
- **Incorrect AI Statement:** `[The false or outdated answer]`
- **Canonical Verified Truth:** `[The exact fact, figure, or policy that must be represented]`

---

## Execution Pipeline

### 1. Discrepancy Classification & Source Triage
Classify the issue into one of four categories:
- **Temporal Lag:** AI is referencing outdated pricing, deprecated features, or old leadership.
- **Semantic Drift / Competitor Conflation:** AI is mixing the brand with an adjacent competitor.
- **Pure Fabrication:** AI answered into a data void due to lack of structured documentation.
- **Third-Party Poisoning:** AI cited an erroneous review site, scraper, or forum.

---

### 2. Direct-Answer Grounding Snippet (AEO Defense)
- Produce a **45–60 word declarative factual block** written in literal, unambiguous terms (zero marketing fluff).
- Explicitly contrast the misconception:
  - *Format:* `"[Brand] is [Exact definition]. Contrary to outdated reports, [Brand] does not [Incorrect claim]; rather, it [Canonical truth]."`
- Position this snippet for placement at the top of the brand's About, FAQ, or relevant product landing page.

---

### 3. Machine-Readable Grounding Assets
Generate the following remediation code:

#### A. `llms.txt` Semantic Truth Block
Provide a clean Markdown entry to append to `/llms.txt`:
```markdown
# [Brand Name] - Canonical Brand Facts
- Official Website: [URL]
- Verified Core Offering: [Truth]
- Correct Status / Clarification: [Direct resolution of the hallucination]
- Primary Knowledge Source: [Official URL containing the verified fact]
```

#### B. High-Precision JSON-LD Entity Schema
Generate an updated `<script type="application/ld+json">` utilizing:
- `Organization` / `Product` with an immutable `@id` URL.
- `disambiguatingDescription`: One sentence explicitly defining the brand and preventing category confusion.
- `knowsAbout` / `offers`: Explicit declarations overriding the hallucinated service/feature.
- `sameAs`: Authoritative links (Wikidata, Crunchbase, official social handles) to anchor the knowledge graph.

---

### 4. Crawler & Source Remediation Plan
Deliver an actionable 3-point checklist:
- [ ] **First-Party Cleanup:** Specific pages requiring copy updates or deletion of legacy contradictory PDFs/posts.
- [ ] **Crawler Verification:** Audit `robots.txt` ensuring AI user-agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) are explicitly permitted to index the corrected pages.
- [ ] **Third-Party Entity Recalibration:** Actionable steps to submit corrections or issue override signals to the primary citation URLs that the AI referenced in its incorrect response.
