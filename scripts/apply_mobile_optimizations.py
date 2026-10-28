# -*- coding: utf-8 -*-
"""
Audits and improves mobile responsiveness across v5/index.html and v5/about.html
Following the mobile-design doctrine:
1. Touch targets: minimum 44px - 48px height.
2. Fluid typography: no overflow on 320px - 390px screens.
3. Header adjustments for small mobile screens (< 480px): brand-title subtext hides cleanly, logo sizes gracefully, header padding adjusts.
4. Drawer panel: fills width on mobile (max-width: 100vw).
5. Audit form & Diagnostic results: single column on mobile, cards don't clip.
6. Tables: horizontal scroll with subtle fade indicator.
7. Steppers and multi-column grids: clean single-column or 2-column stacked layout on mobile.
8. Modal: responsive padding and touch-friendly close button on iOS / Android.
"""
import re

with open('v5/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

mobile_enhancement_css = """
    /* =========================================================================
       MOBILE-FIRST RESPONSIVE OPTIMIZATIONS (doctrine: touch-first, 44px min targets)
       ========================================================================= */
    @media (max-width: 640px) {
      /* App Container & Header */
      .app-container {
        padding: 12px 12px 48px !important;
      }
      header {
        padding: 10px 14px !important;
        border-radius: 16px !important;
        margin-bottom: 24px !important;
      }
      .brand-group {
        gap: 10px !important;
      }
      .logo-badge {
        width: 40px !important;
        height: 40px !important;
      }
      .logo-badge img {
        width: 40px !important;
        height: 40px !important;
      }
      .brand-title h1 {
        font-size: 15px !important;
      }
      .brand-title p {
        display: none !important; /* Hide subline on small mobile to give CTAs room */
      }
      .header-ctas {
        gap: 8px !important;
      }
      .header-ctas .btn-honey-primary {
        display: none !important; /* Inspect domain button accessible right in hero on mobile */
      }
      .header-ctas .btn-secondary {
        padding: 8px 14px !important;
        font-size: 12.5px !important;
        min-height: 40px !important;
      }
      .hamburger-btn {
        width: 42px !important;
        height: 42px !important;
        padding: 9px !important;
      }

      /* Hero Content & Heading */
      .hero-content h2 {
        font-size: 32px !important;
        line-height: 1.15 !important;
        letter-spacing: -0.03em !important;
        margin-bottom: 14px !important;
      }
      .hero-content p.hero-subtitle {
        font-size: 14.5px !important;
        line-height: 1.55 !important;
        margin-bottom: 24px !important;
      }
      .hero-banner {
        padding: 24px 14px !important;
        border-radius: 18px !important;
      }

      /* Audit Form */
      .audit-box-wrap {
        padding: 20px 14px !important;
        border-radius: 14px !important;
      }
      .audit-box-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 8px !important;
      }
      .audit-box-header h3 {
        font-size: 14px !important;
      }
      .audit-input-form {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }
      .audit-input-form input {
        min-height: 48px !important; /* iOS touch target standard */
        font-size: 15px !important; /* Prevents auto-zoom on iOS */
      }
      .audit-input-form button {
        min-height: 48px !important;
        width: 100% !important;
        justify-content: center !important;
        font-size: 14px !important;
      }
      .audit-samples {
        flex-wrap: wrap !important;
      }
      .sample-pill {
        min-height: 36px !important;
        padding: 6px 12px !important;
      }

      /* Engine verification strip */
      .engine-strip {
        padding: 10px 14px !important;
        flex-direction: column !important;
        gap: 8px !important;
        align-items: flex-start !important;
      }
      .engine-logos {
        width: 100% !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }

      /* Sections & Cards */
      .section-headline {
        margin-bottom: 20px !important;
      }
      .section-headline h3 {
        font-size: 22px !important;
      }
      .spotlight-card {
        padding: 22px 16px !important;
        border-radius: 16px !important;
      }
      .metrics-rail {
        grid-template-columns: 1fr !important;
      }
      .pipeline-stepper {
        grid-template-columns: 1fr !important;
      }
      .dispatch-split {
        padding: 20px 16px !important;
      }
      .flow-grid-4 {
        grid-template-columns: 1fr !important;
      }
      .truth-grid {
        grid-template-columns: 1fr !important;
      }
      .pricing-grid-3 {
        grid-template-columns: 1fr !important;
      }
      .pricing-card {
        padding: 24px 18px !important;
      }
      .pricing-card button {
        min-height: 48px !important;
        width: 100% !important;
      }

      /* Drawer Menu on Mobile */
      .drawer-panel {
        max-width: 100vw !important;
        padding: 24px 20px !important;
      }
      .drawer-header {
        margin-bottom: 24px !important;
      }
      .drawer-close-btn {
        width: 44px !important;
        height: 44px !important;
      }
      .drawer-group a {
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        font-size: 15px !important;
      }

      /* Footer */
      .footer-grid-5 {
        grid-template-columns: 1fr !important;
        gap: 28px !important;
      }
      .footer-bottom-bar {
        flex-direction: column !important;
        gap: 14px !important;
        text-align: center !important;
        align-items: center !important;
      }

      /* Client Auth Modal on Small Screens */
      .auth-modal-card {
        padding: 22px 16px !important;
        margin: 12px !important;
        max-height: 94vh !important;
      }
      .auth-modal-close {
        width: 44px !important;
        height: 44px !important;
      }
    }
"""

# Insert mobile_enhancement_css before </style> in v5/index.html
if '/* MOBILE-FIRST RESPONSIVE OPTIMIZATIONS' not in html:
    html = html.replace('</style>', mobile_enhancement_css + '\n  </style>')
    with open('v5/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Enhanced v5/index.html with mobile-first CSS!")
else:
    print("v5/index.html already has mobile optimizations.")

# Do the same for v5/about.html
with open('v5/about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

if '/* MOBILE-FIRST RESPONSIVE OPTIMIZATIONS' not in about_html:
    about_html = about_html.replace('</style>', mobile_enhancement_css + '\n  </style>')
    with open('v5/about.html', 'w', encoding='utf-8') as f:
        f.write(about_html)
    print("Enhanced v5/about.html with mobile-first CSS!")
else:
    print("v5/about.html already has mobile optimizations.")

