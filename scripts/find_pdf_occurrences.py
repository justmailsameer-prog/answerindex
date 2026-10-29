import glob

for f in ['index.html', 'audit.html', 'pro.html', 'v1.html', 'index-oss.html']:
    with open(f, 'r', encoding='utf-8') as fl:
        t = fl.read()
    if 'function generateAuditPdf' in t:
        print(f"generateAuditPdf found in {f}")
    if 'ANSWER INDEX' in t:
        # count occurrences in JS
        js_count = t.count("doc.text('ANSWER INDEX'")
        print(f"  doc.text('ANSWER INDEX') count in {f}: {js_count}")
