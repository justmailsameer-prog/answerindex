import os
import shutil

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_dir = os.path.join(root_dir, 'dist')

print(f"Syncing from {root_dir} to {dist_dir}...")

# 1. HTML files
html_files = [
    'index.html', 'pro.html', 'about.html', 'how-it-works.html',
    'pricing.html', 'audit.html', 'dashboard.html', 'privacy.html',
    'terms.html', 'feedback.html', 'index-oss.html', 'v1.html'
]
for h in html_files:
    src = os.path.join(root_dir, h)
    dst = os.path.join(dist_dir, h)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"  [OK] Copied {h} -> dist/{h}")

# 2. Manifests & Root files
manifest_files = [
    'favicon.ico',
    'ANSWERINDEX-PRD.md',
    'README.md',
    'robots.txt', 'sitemap.xml', 'ai-sitemap.xml', 'sitemap.md',
    'llms.txt', 'llms-full.txt', 'ai.txt', 'ai-disclosure.txt',
    'training-data-policy.txt', 'ai-schema.json', 'ai-entities.json',
    'ai-intent.json', 'rag-index.json', 'rag-index.jsonl'
]
for m in manifest_files:
    src = os.path.join(root_dir, m)
    dst = os.path.join(dist_dir, m)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"  [OK] Copied {m} -> dist/{m}")

# 3. Subdirectories: pro, assets, functions, .well-known, v1, v2, v3, v4, v5
subdirs = ['pro', 'assets', 'functions', '.well-known', 'v1', 'v2', 'v3', 'v4', 'v5']
for sd in subdirs:
    src = os.path.join(root_dir, sd)
    dst = os.path.join(dist_dir, sd)
    if os.path.exists(src):
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print(f"  [OK] Synced directory {sd} -> dist/{sd}")

print("\nSync completed successfully!")
