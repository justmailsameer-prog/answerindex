# -*- coding: utf-8 -*-
import re

files = [
    'v5/index.html',
    'v5/about.html',
    'v5/terms.html',
    'v5/privacy.html',
    'terms.html',
    'privacy.html'
]

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove <div class="bg-grid"></div> element
    content = re.sub(r'<div class=["\']bg-grid["\']></div>\s*', '', content)
    
    # 2. Disable .bg-grid CSS rule
    content = re.sub(r'\.bg-grid\s*\{[^}]+\}', '.bg-grid { display: none !important; }', content)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Cleaned bg-grid from:', fname)

