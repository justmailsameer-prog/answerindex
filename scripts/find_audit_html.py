# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('v5/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('class="audit-box-wrap"')
if pos != -1:
    print(text[pos:pos+2000])
else:
    print("audit-box-wrap not found in HTML markup")
