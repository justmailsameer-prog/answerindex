import glob
import re

html_files = [p for p in glob.glob('**/*.html', recursive=True) if not p.startswith('dist')]

print(f"Found {len(html_files)} HTML files.")

# We want:
# <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20261030">
# <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon.png?v=20261030">
# <link rel="apple-touch-icon" sizes="180x180" href="/assets/AnswerIndex_Logo_Icon.png?v=20261030">

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.splitlines()
    new_lines = []
    has_icon_block = False
    
    for line in lines:
        if ('rel="icon"' in line or 'rel="shortcut icon"' in line or 'rel="apple-touch-icon"' in line or 'favicon.png' in line) and '<link' in line:
            # We will replace with standard bundle
            if not has_icon_block:
                new_lines.append('  <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20261030">')
                new_lines.append('  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon.png?v=20261030">')
                new_lines.append('  <link rel="apple-touch-icon" sizes="180x180" href="/assets/AnswerIndex_Logo_Icon.png?v=20261030">')
                has_icon_block = True
        else:
            new_lines.append(line)
            
    new_content = '\n'.join(new_lines)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {path}")

print("Done updating HTML favicon tags.")
