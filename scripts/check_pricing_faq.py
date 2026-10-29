# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="pricing"')
print("Pricing section:")
print(text[pos:pos+1500])

pos_faq = text.find('id="faq"')
print("FAQ section:")
print(text[pos_faq:pos_faq+1500])
