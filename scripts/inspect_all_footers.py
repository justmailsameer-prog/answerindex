import glob, sys
sys.stdout.reconfigure(encoding='utf-8')

pages = ['index.html', 'about.html', 'privacy.html', 'terms.html', 'pricing.html', 'audit.html', 'how-it-works.html', 'feedback.html', 'pro.html']
for p in pages:
    t = open(p, encoding='utf-8').read()
    print(f"=== {p} ===")
    p_footer = t.find('<footer')
    if p_footer != -1:
        # find Copyright or bottom bar
        c_pos = t.find('Copyright', p_footer)
        if c_pos != -1:
            print(t[c_pos-30:c_pos+180].strip())
        else:
            print("No 'Copyright' found in footer")
    else:
        print("No footer found")
