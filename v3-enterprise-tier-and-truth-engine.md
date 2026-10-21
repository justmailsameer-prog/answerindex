# Implementation Plan: AnswerIndex v3.0 (Truth Engine & 3-Tier Value Ladder)

## Overview
Transform AnswerIndex from v2.5.1 into v3.0.0 by implementing the **Brand Truth Engine**, expanding daily job asset types (adding **Interactive Mini-Tools / Calculators** and **Comparison Guides**), and establishing the **3-Tier Commercial Value Ladder** ($199 Growth, $499 Pro Autonomous, and $1,499 Enterprise DFY Partner).

---

## Task Breakdown

### Task 1: Database Migration (`migrations/0004_add_truth_engine_and_asset_types.sql`)
- [ ] Add `truth_document` TEXT column to the `projects` table in D1.
- [ ] Seed real-world `truth_document` data into demo projects (`proj_shopify_demo`, `proj_wp_demo`, `proj_dev_core`).
- [ ] Seed new asset types into `daily_jobs`:
  - `interactive_mini_tool`: Staged ROI / Pricing Calculator widget (HTML/JS) for Shopify/WordPress.
  - `aeo_comparison_guide`: "Brand vs Competitor" comparative table with AEO zero-click snippets.
  - `digital_pr_correction`: Inaccurate 3rd-party citation correction pitch.
- **Verification:** Execute migration script or test SQLite query syntax to confirm zero syntax errors.

---

### Task 2: Backend Edge API Updates (`functions/api/`)
- [ ] Update `functions/api/project.js`:
  - Allow GET request to return `truth_document`.
  - Add POST/PATCH handler to update `truth_document` for a project with timestamp.
- [ ] Update `functions/api/jobs.js`:
  - Support `asset_type` metadata and filter for interactive tools and comparison guides.
- [ ] Update `functions/api/create-checkout.js`:
  - Map new 3-tier pricing:
    - `growth_monthly` ($199) / `growth_annual` ($159/mo, $1,908/yr)
    - `pro_autonomous_monthly` ($499) / `pro_autonomous_annual` ($399/mo, $4,788/yr)
    - `enterprise_monthly` ($1,499) / `enterprise_annual` ($1,199/mo, $14,388/yr)
- **Verification:** Run node check on API functions to ensure clean module syntax and error handling.

---

### Task 3: Client Portal & Dashboard Updates (`dashboard.html` & `assets/`)
- [ ] Add "Brand Truth Wiki" tab / button in `dashboard.html` header navigation.
- [ ] Build the interactive Brand Truth Editor modal with editable sections:
  - Canonical Brand Description & Disallowed Claims
  - Official Pricing, Founder/Exec names, Verified Feature Specs
  - Save button syncing asynchronously to `/api/project`.
- [ ] Update job preview drawer in `dashboard.html` / `client-portal.js`:
  - Render live interactive calculator widget when `job_type === 'interactive_mini_tool'`.
  - Render "✓ Verified Against Brand Truth" green compliance badge on jobs.
- **Verification:** Load dashboard in local/mock state to verify modal interaction, styling, and preview drawer.

---

### Task 4: Landing Page Pricing & Value Ladder (`index.html`, `pro.html`, `about.html`)
- [ ] Update pricing sections in `index.html`, `pro.html`, `pro/index.html`, `about.html`:
  - Tier 1: Growth at **$199/mo** (Annual: **$159/mo**).
  - Tier 2: Pro Autonomous at **$499/mo** (Annual: **$399/mo**).
  - Tier 3: Enterprise DFY Partner at **$1,499/mo** (Annual: **$1,199/mo**) featuring Ground-Truth Ingestion, Custom Interactive Calculators, Digital PR Correction, and Dedicated Slack SLA.
- [ ] Update the annual toggle JS logic in `pro.html` and `index.html`.
- [ ] Update the deterministic PDF audit roadmap text in all landing pages to cite the new $199 / $499 / $1,499 tiers.
- [ ] Synchronize all root changes to `dist/`.
- **Verification:** Verify pricing calculations, button text updates on toggle switch, and responsive layout across desktop/mobile.

---

### Task 5: PRD Documentation Update (`ANSWERINDEX-PRD.md`) & Final Review
- [ ] Bump PRD version to **v3.0.0**.
- [ ] Document the Truth Engine specification and anti-hallucination validation invariants.
- [ ] Document the 3-Tier Value Ladder and economic rationale.
- [ ] Document the 4 expanded daily asset types (AEO Answers, Tech Schema, Interactive Calculators, Digital PR).
- [ ] Log the v3.0.0 milestone.
- **Verification:** Verify PRD consistency and commit changes to git.
