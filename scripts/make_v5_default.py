# -*- coding: utf-8 -*-
import os
import shutil

# 1. Copy v5 assets to root assets
if os.path.exists('v5/assets'):
    for item in os.listdir('v5/assets'):
        s = os.path.join('v5/assets', item)
        d = os.path.join('assets', item)
        if os.path.isfile(s):
            shutil.copy2(s, d)
            print(f"Copied asset {item} to assets/")

# 2. Copy v5/about.html to root about.html
with open('v5/about.html', 'r', encoding='utf-8') as f:
    about_text = f.read()

about_text = about_text.replace('https://answerindex.xyz/v5/about', 'https://answerindex.xyz/about')
about_text = about_text.replace('href="/v5/"', 'href="/"')
about_text = about_text.replace('href="index.html"', 'href="/"')

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about_text)
print("Updated root about.html with v5 content!")

# 3. Read v5/index.html and adapt for root deployment
with open('v5/index.html', 'r', encoding='utf-8') as f:
    index_text = f.read()

index_text = index_text.replace('https://answerindex.xyz/v5/', 'https://answerindex.xyz/')
index_text = index_text.replace('href="/v5/"', 'href="/"')
index_text = index_text.replace('href="about.html"', 'href="/about.html"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_text)
print("Updated root index.html with v5 content!")
