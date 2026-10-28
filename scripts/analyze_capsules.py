import re

with open('v5/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

classes = set(re.findall(r'class=["\']([^"\']*(?:pill|badge|tag|capsule)[^"\']*)["\']', content))
print("Found classes:")
for c in sorted(classes):
    print(" -", c)

