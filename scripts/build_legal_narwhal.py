# -*- coding: utf-8 -*-
import sys
import os

with open('v5/about.html', 'r', encoding='utf-8') as f:
    about_text = f.read()

head_style_base = about_text[:about_text.find('</style>')]
body_nav_base = about_text[about_text.find('<body>'):about_text.find('<main>')]
footer_scripts_base = about_text[about_text.find('<footer'):]

legal_extra_css = """
    /* Legal Specific Styles */
    .legal-hero {
      text-align: center;
      margin-bottom: 40px;
    }
    .legal-title {
      font-size: clamp(32px, 5vw, 44px);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 16px 0 8px;
      color: var(--text-primary);
    }
    .legal-updated {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-muted);
    }
    .legal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      padding: 44px;
      box-shadow: var(--shadow-card);
      margin-bottom: 50px;
    }
    @media (max-width: 768px) {
      .legal-card {
        padding: 24px;
      }
    }
    .legal-section {
      margin-bottom: 36px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .legal-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .legal-section h2 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .legal-section p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 14px;
    }
    .legal-section p:last-child {
      margin-bottom: 0;
    }
    .legal-section ul {
      margin: 12px 0 16px 20px;
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.7;
    }
    .legal-section li {
      margin-bottom: 8px;
    }
    .legal-section code {
      background: var(--honey-light);
      border: 1px solid var(--honey-border);
      color: #92400E;
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .callout-box {
      background: var(--honey-light);
      border-left: 4px solid var(--honey-primary);
      border-radius: 8px;
      padding: 16px 20px;
      font-size: 14px;
      line-height: 1.65;
      color: var(--text-primary);
      margin: 16px 0;
    }
"""

with open('scripts/terms_body.html', 'r', encoding='utf-8') as f:
    terms_body = f.read()

with open('scripts/privacy_body.html', 'r', encoding='utf-8') as f:
    privacy_body = f.read()

# Build terms.html in Narwhal Theme
terms_head = head_style_base.replace('<title>About Answer Index — Autonomous AEO & Technical SEO Growth Engine</title>', '<title>Terms of Service & Guarantee — AnswerIndex Pro</title>')
terms_head = terms_head.replace('content="Learn about Answer Index', 'content="AnswerIndex Pro Terms of Service, Human-in-the-Loop Operational SLA, IP ownership, and 14-day Money-Back Guarantee.')
terms_head += legal_extra_css + '\n  </style>\n</head>'

terms_html = terms_head + '\n' + body_nav_base + '\n' + terms_body + '\n' + footer_scripts_base

# Build privacy.html in Narwhal Theme
privacy_head = head_style_base.replace('<title>About Answer Index — Autonomous AEO & Technical SEO Growth Engine</title>', '<title>Privacy Policy — AnswerIndex Pro</title>')
privacy_head = privacy_head.replace('content="Learn about Answer Index', 'content="AnswerIndex Pro Privacy Policy. Extreme privacy transparency, least privilege, zero permanent code storage, and GDPR/CCPA rights.')
privacy_head += legal_extra_css + '\n  </style>\n</head>'

privacy_html = privacy_head + '\n' + body_nav_base + '\n' + privacy_body + '\n' + footer_scripts_base

with open('terms.html', 'w', encoding='utf-8') as f:
    f.write(terms_html)
with open('privacy.html', 'w', encoding='utf-8') as f:
    f.write(privacy_html)
with open('v5/terms.html', 'w', encoding='utf-8') as f:
    f.write(terms_html)
with open('v5/privacy.html', 'w', encoding='utf-8') as f:
    f.write(privacy_html)

print('Generated terms.html and privacy.html successfully in both root and v5/!')

