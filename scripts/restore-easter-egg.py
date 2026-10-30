import os

# PRO badge HTML - subtle, semi-transparent, tiny
PRO_BADGE = ' <span id="easterEggProBadge" onclick="handleProBadgeEasterEggClick(event)" title="" aria-hidden="true" style="display:inline-block;cursor:default;font-size:9px;font-weight:700;letter-spacing:0.06em;color:rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);border-radius:4px;padding:1px 5px;margin-left:4px;user-select:none;vertical-align:middle;line-height:1.4;">PRO</span>'

# Different logo patterns across pages - insert badge right after logo closing >
LOGO_PATTERNS = [
    # Pattern A: audit.html, pro.html, feedback.html etc - closing > after width/height
    ('alt="Answer Index Logo" class="brand-logo" width="215" height="42">',
     'alt="Answer Index Logo" class="brand-logo" width="215" height="42">' + PRO_BADGE),
    # Pattern B: some pages use logo-img class
    ('class="logo-img"',
     'class="logo-img"' + PRO_BADGE),
    # Pattern C: other pages
    ('alt="Answer Index Logo\" class=\"brand-logo\" width=\"220\" height=\"44\">',
     'alt="Answer Index Logo\" class=\"brand-logo\" width=\"220\" height=\"44\">' + PRO_BADGE),
    # Pattern D - how-it-works, pricing, dashboard etc
    ('alt="Answer Index Logo"',
     'alt="Answer Index Logo"'),  # placeholder, will use brand-tagline approach below
]

# Pages that still need the badge
MISSING_PAGES = [
    'pro.html', 'audit.html', 'how-it-works.html', 'pricing.html',
    'feedback.html', 'dashboard.html', 'index-oss.html',
    'v5/index.html', 'v5/about.html', 'v5/dashboard.html',
    'v5/feedback.html', 'v5/index-oss.html',
    'pro/index.html',
]

def inject_badge(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'easterEggProBadge' in content:
        return f'SKIP (already has badge)'

    # Strategy: find brand-tagline or brand-tagline-nav span and insert badge BEFORE it
    # This works universally regardless of logo image class
    tagline_patterns = [
        '<span class="brand-tagline">',
        '<span class="brand-tagline-nav">',
    ]
    
    for pat in tagline_patterns:
        if pat in content:
            content = content.replace(pat, PRO_BADGE + '\n          ' + pat, 1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return f'OK (inserted before tagline span)'
    
    return f'FAIL (no insertion point found)'

results = {}
for fpath in MISSING_PAGES:
    if os.path.exists(fpath):
        results[fpath] = inject_badge(fpath)
    else:
        results[fpath] = 'NOT FOUND'

for f, r in results.items():
    print(f'{f}: {r}')
