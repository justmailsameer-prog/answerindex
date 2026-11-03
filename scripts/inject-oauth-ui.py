import re

with open('assets/client-portal.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Social OAuth buttons HTML
oauth_buttons_html = '''<!-- 1-Click Social Sign In (Google & GitHub) -->
            <div class="oauth-providers-container" style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px;">
              <a href="/api/auth/oauth/google" class="btn-oauth-provider google" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 10px 14px; background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 9px; color: #1F2937; font-size: 13.5px; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); box-sizing: border-box;">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google
              </a>

              <a href="/api/auth/oauth/github" class="btn-oauth-provider github" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 10px 14px; background: #24292F; border: 1.5px solid #24292F; border-radius: 9px; color: #FFFFFF; font-size: 13.5px; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); box-sizing: border-box;">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Continue with GitHub
              </a>
            </div>

            <!-- Divider -->
            <div style="display: flex; align-items: center; text-align: center; margin: 16px 0; color: #9CA3AF; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em;">
              <span style="flex: 1; border-bottom: 1px solid #E5E7EB;"></span>
              <span style="padding: 0 10px; font-weight: 600;">or continue with email</span>
              <span style="flex: 1; border-bottom: 1px solid #E5E7EB;"></span>
            </div>'''

# Insert in TAB 1 (Login) before Step A
tab1_pattern = r'(<!-- TAB 1: Existing Client Sign In \(Email \+ OTP\) -->\s*<div class="auth-tab-content active" id="tabContentLogin">\s*)<!-- Step A: Enter Email -->'

if re.search(tab1_pattern, text):
    text = re.sub(tab1_pattern, r'\1' + oauth_buttons_html + '\n\n            <!-- Step A: Enter Email -->', text, count=1)
    print("Injected OAuth buttons into Login Tab")
else:
    print("Could not match tab1_pattern")

# Insert in TAB 2 (Register) before the form
tab2_pattern = r'(<!-- TAB 2: Onboard New Site \(Platform Selector\) -->\s*<div class="auth-tab-content" id="tabContentRegister">\s*)<form onsubmit="handleClientRegister\(event\)">'

if re.search(tab2_pattern, text):
    text = re.sub(tab2_pattern, r'\1' + oauth_buttons_html + '\n\n            <form onsubmit="handleClientRegister(event)">', text, count=1)
    print("Injected OAuth buttons into Register Tab")
else:
    print("Could not match tab2_pattern")

with open('assets/client-portal.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done updating assets/client-portal.js")
