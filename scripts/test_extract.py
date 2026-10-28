
import re

with open('v5/about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

# Extract header, nav-drawer, footer, client-auth-modal, and head style
head_match = re.search(r'<head>(.*?)</head>', about_html, re.DOTALL)
header_match = re.search(r'(<!-- TOP STICKY NAVBAR -->.*?<!-- BREADCRUMBS BAR -->.*?</div>\s*</div>)', about_html, re.DOTALL)
drawer_match = re.search(r'(<!-- FULLSCREEN / SLIDE-IN NAV DRAWER -->.*?</div>\s*</div>)', about_html, re.DOTALL)
modal_match = re.search(r'(<!-- CLIENT PORTAL AUTH MODAL -->.*?</div>\s*</div>)', about_html, re.DOTALL)
footer_match = re.search(r'<footer.*?</footer>', about_html, re.DOTALL)
scripts_match = re.search(r'(<!-- SCRIPTS -->.*)', about_html, re.DOTALL)

print('Matches:', bool(head_match), bool(header_match), bool(drawer_match), bool(modal_match), bool(footer_match), bool(scripts_match))
