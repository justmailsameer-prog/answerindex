# -*- coding: utf-8 -*-
import re

files = [
    'index.html',
    'about.html',
    'terms.html',
    'privacy.html',
    'v5/index.html',
    'v5/about.html',
    'v5/terms.html',
    'v5/privacy.html'
]

# Patterns for the V5 OS badge
pattern_top = r'\s*<span class="badge-pill-featured"[^>]*>V5 OS</span>'
pattern_bottom = r'\s*<span class="badge-pill-featured"[^>]*>V5 OS</span>'

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Remove all instances of <span class="badge-pill-featured"...>V5 OS</span>
    new_text = re.sub(r'\s*<span class="badge-pill-featured"[^>]*>V5 OS</span>', '', text)
    
    if new_text != text:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Removed V5 OS badge from {fname}")
    else:
        print(f"No V5 OS badge found in {fname}")
