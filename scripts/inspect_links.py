# -*- coding: utf-8 -*-
import re

for fname in ['v5/index.html', 'v5/about.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    footer = re.search(r'<footer.*?</footer>', content, re.DOTALL)
    if footer:
        links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', footer.group(0))
        print(f"=== {fname} footer links ===")
        for l in links:
            if not l.startswith('#') and not l.startswith('javascript'):
                print('  ', l)

