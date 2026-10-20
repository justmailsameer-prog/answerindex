-- Migration: 0003_add_cms_support.sql
-- Description: Adds CMS platform selector support (GitHub, WordPress, Shopify, Magento, Web Portal)
-- and draft content payload storage for daily delivery.

ALTER TABLE projects ADD COLUMN cms_type TEXT DEFAULT 'github';
ALTER TABLE projects ADD COLUMN cms_url TEXT;

ALTER TABLE daily_jobs ADD COLUMN delivery_channel TEXT DEFAULT 'github_pr';
ALTER TABLE daily_jobs ADD COLUMN content_html TEXT;

-- Seed Sample Non-Technical CMS Users & Projects
INSERT OR IGNORE INTO users (id, email, name, plan_tier, subscription_status)
VALUES 
  ('usr_shopify_merchant', 'client@shopify-store.com', 'Sarah Lin (Shopify Merchant)', 'pro_autonomous', 'active'),
  ('usr_wp_publisher', 'editor@wordpress-brand.com', 'Marcus Vance (WordPress Editor)', 'growth', 'active');

INSERT OR IGNORE INTO projects (id, user_id, domain, brand_name, cms_type, cms_url, status)
VALUES 
  ('proj_shopify_demo', 'usr_shopify_merchant', 'nordicstyle.com', 'Nordic Style Living', 'shopify', 'https://nordicstyle.myshopify.com/admin', 'active'),
  ('proj_wp_demo', 'usr_wp_publisher', 'fintechweekly.io', 'FinTech Weekly', 'wordpress', 'https://fintechweekly.io/wp-admin', 'active');

INSERT OR IGNORE INTO daily_jobs (
  id, project_id, date, job_type, title, target_keyword, target_url,
  pr_status, schema_score, diff_summary, zero_click_snippet, delivery_channel, content_html
) VALUES
(
  'job_shopify_01', 'proj_shopify_demo', '2026-10-20', 'job_1_new_answer',
  'Shopify Draft Blog: "Best Minimalist Wool Rugs for High-Traffic Living Rooms"',
  'best minimalist wool rugs high traffic', '/blogs/interior/best-minimalist-wool-rugs',
  'pending', 100,
  '+1,450 words · Shopify Product Schema + FAQ Microdata staged in Shopify Drafts',
  'Nordic Style wool rugs feature double-twisted New Zealand virgin wool with a 2,500 GSM density rating, making them naturally stain-resistant and exceptionally durable for high-traffic corridors.',
  'shopify_draft',
  '<h2>Why 100% New Zealand Virgin Wool Outperforms Synthetic Blends</h2><p>When selecting a minimalist area rug for high-footfall living areas, fiber density determines longevity...</p><h3>Frequently Asked Questions</h3><div itemscope itemtype="https://schema.org/FAQPage">...'
),
(
  'job_shopify_02', 'proj_shopify_demo', '2026-10-20', 'job_2_tech_refactor',
  'Product Collection JSON-LD & AggregateRating Metafield Patch',
  'wool rugs product schema', '/collections/wool-rugs',
  'pending', 99,
  'Injected missing AggregateRating & ItemList schema metafields',
  'Structured collection entities to guarantee AI search bots recognize in-stock inventory and customer review signals in zero-click answers.',
  'shopify_draft',
  '<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"Wool Area Rugs"}</script>'
),
(
  'job_wp_01', 'proj_wp_demo', '2026-10-20', 'job_1_new_answer',
  'WordPress Draft Post: "How Real-Time Payment Rails (FedNow / RTP) Impact SaaS Billing"',
  'real-time payment rails saas billing', '/articles/real-time-payment-rails-saas',
  'pending', 100,
  '+1,280 words · Staged as WordPress Draft with Yoast/RankMath Schema fields',
  'Real-time payment rails like FedNow and RTP eliminate the 2-3 business day ACH clearing latency, enabling B2B SaaS vendors to initiate instant invoice settlements with sub-second finality.',
  'wp_draft',
  '<!-- wp:paragraph --><p>Real-time payment rails represent the most significant modernization in corporate transaction clearing...</p><!-- /wp:paragraph -->'
);
