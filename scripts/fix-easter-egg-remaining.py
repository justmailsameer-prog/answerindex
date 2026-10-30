"""
Fix Easter Egg PRO badge on the 4 remaining pages that have unique header structures.
"""
import os

BASE = r"D:\AI Product\answerindex"

PRO_BADGE = (' <span id="easterEggProBadge" onclick="handleProBadgeEasterEggClick(event)" '
             'title="" aria-hidden="true" style="display:inline-block;cursor:default;'
             'font-size:9px;font-weight:700;letter-spacing:0.06em;color:rgba(255,255,255,0.18);'
             'background:rgba(255,255,255,0.06);border-radius:4px;padding:1px 5px;margin-left:4px;'
             'user-select:none;vertical-align:middle;line-height:1.4;">PRO</span>')

# ---------------------------------------------------------------------------
# 1. dashboard.html  &  v5/dashboard.html
#    Badge goes after the logo img closing tag, before the inline tagline <span>
# ---------------------------------------------------------------------------
DASHBOARD_OLD = (
    """onerror="this.onerror=null; this.src='/assets/AnswerIndex_Logo.png';" />\n"""
    """        <span style=\"font-family: 'JetBrains Mono'"""
)
DASHBOARD_NEW = (
    """onerror="this.onerror=null; this.src='/assets/AnswerIndex_Logo.png';" />"""
    + PRO_BADGE +
    """\n        <span style=\"font-family: 'JetBrains Mono'"""
)

# ---------------------------------------------------------------------------
# 2. index-oss.html  &  v5/index-oss.html
#    Badge goes after <span class="brand-name">Answer Index</span>
# ---------------------------------------------------------------------------
OSS_OLD  = '<span class="brand-name">Answer Index</span>'
OSS_NEW  = '<span class="brand-name">Answer Index</span>' + PRO_BADGE

# ---------------------------------------------------------------------------
pages = [
    (os.path.join(BASE, "dashboard.html"),       DASHBOARD_OLD, DASHBOARD_NEW),
    (os.path.join(BASE, "v5", "dashboard.html"), DASHBOARD_OLD, DASHBOARD_NEW),
    (os.path.join(BASE, "index-oss.html"),       OSS_OLD,       OSS_NEW),
    (os.path.join(BASE, "v5", "index-oss.html"), OSS_OLD,       OSS_NEW),
]

for path, old, new in pages:
    rel = os.path.relpath(path, BASE)
    if not os.path.exists(path):
        print(f"[SKIP] {rel} - file not found")
        continue
    content = open(path, "r", encoding="utf-8").read()
    if "easterEggProBadge" in content:
        print(f"[SKIP] {rel} - badge already present")
        continue
    if old not in content:
        print(f"[FAIL] {rel} - insertion point not found")
        continue
    updated = content.replace(old, new, 1)
    open(path, "w", encoding="utf-8").write(updated)
    print(f"[OK]   {rel} - badge injected")

print("\nDone.")
