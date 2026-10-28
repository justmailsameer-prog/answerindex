# -*- coding: utf-8 -*-
import re

files = ['v5/index.html', 'v5/about.html', 'v5/terms.html', 'v5/privacy.html']

replacements = [
    ('/feedback.html', 'feedback.html'),
    ('/dashboard.html', 'dashboard.html'),
    ('/index-oss.html', 'index-oss.html'),
    ('/llms.txt', 'llms.txt'),
    ('/llms-full.txt', 'llms-full.txt'),
    ('/ai-sitemap.xml', 'ai-sitemap.xml'),
    ('/ai-entities.json', 'ai-entities.json'),
    ('/rag-index.json', 'rag-index.json'),
    ('/terms.html', 'terms.html'),
    ('/privacy.html', 'privacy.html'),
    ('/ai-disclosure.txt', 'ai-disclosure.txt'),
    ('/training-data-policy.txt', 'training-data-policy.txt')
]

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(f'"{old}"', f'"{new}"')
        content = content.replace(f"'{old}'", f"'{new}'")
        
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated links in {fname}")

