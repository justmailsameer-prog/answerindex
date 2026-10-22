import re

with open('pro.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make links and assets root-relative so /pro/ works properly
content = content.replace('href="assets/', 'href="/assets/')
content = content.replace('src="assets/', 'src="/assets/')
content = content.replace('href="pro.html"', 'href="/pro.html"')
content = content.replace('href="how-it-works.html"', 'href="/how-it-works.html"')
content = content.replace('href="audit.html"', 'href="/audit.html"')
content = content.replace('href="pricing.html"', 'href="/pricing.html"')
content = content.replace('href="about.html"', 'href="/about.html"')
content = content.replace('href="privacy.html"', 'href="/privacy.html"')
content = content.replace('href="terms.html"', 'href="/terms.html"')
content = content.replace('href="feedback.html"', 'href="/feedback.html"')
content = content.replace('href="dashboard.html"', 'href="/dashboard.html"')

with open('pro/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Synchronized pro/index.html with root-relative paths and full JSON-LD')
