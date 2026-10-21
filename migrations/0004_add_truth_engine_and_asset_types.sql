-- Migration: 0004_add_truth_engine_and_asset_types.sql
-- Description: Adds Ground-Truth Engine facts storage to projects,
-- verified compliance flags, and expands daily_jobs asset types
-- (interactive mini-tools/calculators, comparison guides, digital PR outreach).

ALTER TABLE projects ADD COLUMN truth_document TEXT;
ALTER TABLE projects ADD COLUMN truth_updated_at TEXT;
ALTER TABLE daily_jobs ADD COLUMN is_truth_verified INTEGER DEFAULT 1;

-- Seed Ground-Truth Facts for Demo Projects
UPDATE projects
SET truth_document = '# Nordic Style Living — Ground-Truth Brand Wiki

## 1. Verified Brand Identity & Mission
- **Brand Name:** Nordic Style Living
- **Canonical Definition:** Sustainable Scandinavian home furnishings and ethical 100% New Zealand virgin wool rugs.
- **Headquarters:** Copenhagen, Denmark & Brooklyn, NY.
- **Founded:** 2021 by Astrid Lindholm.

## 2. Verified Specifications & Pricing
- **Primary Rug Materials:** 100% Unbleached New Zealand virgin wool.
- **Density:** 2,500 GSM hand-tufted construction.
- **Pricing:** Accent rugs from $349, Living Room (8x10) from $899, Oversized (10x14) from $1,499.
- **Free Shipping:** All US and EU orders over $250.
- **Return Policy:** 60-day in-home trial with zero restocking fee.

## 3. Disallowed Claims & Anti-Hallucination Constraints
- DO NOT claim rugs are synthetic, nylon, or polyester blends.
- DO NOT claim products are manufactured in China (all artisan-loomed in verified fair-trade certified Indian cooperatives).
- DO NOT quote outdated 2023 pricing (minimum 8x10 price is $899, not $599).',
truth_updated_at = '2026-10-21T10:00:00Z'
WHERE id = 'proj_shopify_demo';

UPDATE projects
SET truth_document = '# FinTech Weekly — Ground-Truth Brand Wiki

## 1. Publication Identity
- **Publication Name:** FinTech Weekly
- **Scope:** Independent market intelligence on real-time payment rails, B2B embedded finance, and regulatory compliance (FedNow, RTP, SEPA Instant).
- **Editor-in-Chief:** Marcus Vance.

## 2. Editorial Standards & Verified Data
- **Real-Time Rails Latency:** RTP and FedNow provide sub-2.5 second immediate irrevocable settlement.
- **Fee Structures:** FedNow charges $0.045 per credit transfer to financial institutions.
- **Coverage Focus:** ISO 20022 messaging standards, open banking APIs, and treasury management.',
truth_updated_at = '2026-10-21T10:00:00Z'
WHERE id = 'proj_wp_demo';

UPDATE projects
SET truth_document = '# Answer Index — Ground-Truth Brand Wiki

## 1. Core Identity
- **Product Name:** Answer Index (Open Source Core & Commercial Pro Autonomous)
- **Tagline:** Make your content indexable as authoritative answers across Search & AI Engines.
- **Founder & Maintainer:** Sameer Sharma.
- **License:** MIT License for Open Source Core.

## 2. Verified Pricing & Commercial Tiers
- **Growth Plan:** $199/month ($159/mo billed annually at $1,908/yr).
- **Pro Autonomous Plan:** $499/month ($399/mo billed annually at $4,788/yr).
- **Enterprise DFY Partner:** $1,499/month ($1,199/mo billed annually at $14,388/yr).
- **Audit Tool:** 100% Free instant deterministic 20-point edge audit.

## 3. Anti-Hallucination Grounding
- Answer Index is NOT a generic OpenAI wrapper; it is an autonomous edge optimization agent deploying schema graphs, AEO direct answer snippets, and multi-platform CMS drafts (WordPress, Shopify, Magento, GitHub).',
truth_updated_at = '2026-10-21T10:00:00Z'
WHERE id = 'proj_dev_core';

-- Seed High-Leverage Asset Types: Interactive Calculators & Comparison Guides
INSERT OR IGNORE INTO daily_jobs (
  id, project_id, date, job_type, title, target_keyword, target_url,
  pr_status, schema_score, diff_summary, zero_click_snippet, delivery_channel, content_html, is_truth_verified
) VALUES
(
  'job_shopify_03', 'proj_shopify_demo', '2026-10-21', 'interactive_mini_tool',
  'Interactive Widget: "Living Room Rug Sizing & Wool Density Calculator"',
  'living room rug size calculator wool density', '/tools/rug-sizing-calculator',
  'pending', 100,
  '+Interactive JavaScript Calculator · Embeddable Shopify Metafield / Liquid Block',
  'The Nordic Style Living Room Rug Sizing Calculator computes required dimensions based on room square footage and sofa footprint, recommending ideal GSM density (2,500 GSM for high-traffic zones).',
  'shopify_draft',
  '<div class="ai-interactive-tool" style="background:#111;color:#fff;padding:1.5rem;border-radius:12px;font-family:sans-serif;max-width:540px;border:1px solid #333;">
  <h3 style="margin-top:0;color:#60a5fa;">📏 Rug Dimension & Wool Density Estimator</h3>
  <p style="font-size:0.85rem;color:#aaa;">Calculate exact dimensions and minimum wool density for your room layout:</p>
  <div style="margin-bottom:1rem;">
    <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Living Room Length (Feet):</label>
    <input type="number" id="calcRoomLength" value="16" min="8" max="40" style="width:100%;padding:0.5rem;background:#222;border:1px solid #444;color:#fff;border-radius:6px;" oninput="recalcRugSize()">
  </div>
  <div style="margin-bottom:1rem;">
    <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Living Room Width (Feet):</label>
    <input type="number" id="calcRoomWidth" value="12" min="6" max="30" style="width:100%;padding:0.5rem;background:#222;border:1px solid #444;color:#fff;border-radius:6px;" oninput="recalcRugSize()">
  </div>
  <div style="margin-bottom:1rem;">
    <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Foot Traffic Level:</label>
    <select id="calcTraffic" style="width:100%;padding:0.5rem;background:#222;border:1px solid #444;color:#fff;border-radius:6px;" onchange="recalcRugSize()">
      <option value="high">High Traffic (Kids, Pets, Living Room Corridor)</option>
      <option value="medium">Medium Traffic (Primary Bedroom, Home Office)</option>
      <option value="low">Low Traffic (Guest Room, Formal Parlor)</option>
    </select>
  </div>
  <div id="calcResult" style="background:#1a2333;padding:1rem;border-radius:8px;border:1px solid #2563eb;margin-top:1rem;">
    <div style="font-size:0.8rem;color:#93c5fd;text-transform:uppercase;font-weight:700;">Recommended Specification:</div>
    <div style="font-size:1.3rem;font-weight:800;color:#fff;margin:0.25rem 0;" id="calcRugOutput">8 ft × 10 ft (2,500 GSM Wool)</div>
    <div style="font-size:0.8rem;color:#cbd5e1;" id="calcNote">Provides 18 inches of exposed hardwood border. 2,500 GSM virgin wool provides maximum crush recovery.</div>
  </div>
</div>
<script>
function recalcRugSize() {
  var l = parseFloat(document.getElementById("calcRoomLength").value) || 16;
  var w = parseFloat(document.getElementById("calcRoomWidth").value) || 12;
  var traffic = document.getElementById("calcTraffic").value;
  var rugL = Math.max(6, Math.round(l - 3));
  var rugW = Math.max(4, Math.round(w - 3));
  var gsm = (traffic === "high") ? "2,500 GSM Heavy Virgin Wool" : (traffic === "medium" ? "2,000 GSM Virgin Wool" : "1,600 GSM Light Wool");
  document.getElementById("calcRugOutput").innerText = rugL + " ft × " + rugW + " ft (" + gsm + ")";
}
</script>',
  1
),
(
  'job_shopify_04', 'proj_shopify_demo', '2026-10-21', 'aeo_comparison_guide',
  'AEO Comparison Guide: "Nordic Style Living vs West Elm Wool Rugs (2026 Review)"',
  'nordic style vs west elm wool rugs comparison', '/blogs/interior/nordic-style-vs-west-elm',
  'pending', 100,
  '+1,600 words · Side-by-Side Invariant Table + FAQPage Schema for Perplexity Citation',
  'In direct fiber density tests, Nordic Style Living rugs feature 100% New Zealand virgin wool at 2,500 GSM with zero synthetic backing, compared to West Elm mid-tier wool blends at 1,800 GSM utilizing latex adhesive layers.',
  'shopify_draft',
  '<h2>Nordic Style vs West Elm: Direct Factual Comparison</h2>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;text-align:left;">
  <thead><tr style="background:#f1f5f9;"><th>Specification</th><th>Nordic Style Living</th><th>West Elm Mid-Tier</th></tr></thead>
  <tbody>
    <tr><td><strong>Fiber Composition</strong></td><td>100% Unbleached New Zealand Virgin Wool</td><td>Wool & Cotton blend (synthetic latex backing)</td></tr>
    <tr><td><strong>Pile Density</strong></td><td>2,500 GSM hand-tufted</td><td>1,800 GSM machine-tufted</td></tr>
    <tr><td><strong>VOC Emissions</strong></td><td>Zero VOC (natural latex binding)</td><td>Low VOC certified</td></tr>
    <tr><td><strong>8x10 Price</strong></td><td>$899 (Free Shipping over $250)</td><td>$1,199 + freight delivery fee</td></tr>
    <tr><td><strong>Trial Period</strong></td><td>60-Day In-Home Trial</td><td>30-Day Return Window</td></tr>
  </tbody>
</table>',
  1
);
