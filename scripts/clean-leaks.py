import re

with open('assets/client-portal.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean HTML in Step B: Never show verification code, master passcode, or autofill on screen
step_b_regex = r'<div id="loginOtpInstantCodeBox"[\s\S]*?<\/div>\s*<\/div>'
step_b_replacement = '''<p style="font-size: 12px; color: #6E717C; margin-top: 8px; margin-bottom: 0; line-height: 1.4;">
                  A 6-digit confirmation code has been dispatched. Enter the code from your inbox below.
                </p>
              </div>'''

if re.search(step_b_regex, text):
    text = re.sub(step_b_regex, step_b_replacement, text, count=1)
    print("Cleaned Step B HTML")
else:
    print("Regex for Step B did not match")

# 2. Clean JS handler: Never leak or autofill OTP on the client
clean_handler = '''window.handleRequestLoginOtp = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const msg = document.getElementById('loginMsg');
    const btn = document.getElementById('btnLoginSubmit');

    const email = emailInput?.value.trim().toLowerCase();
    if (!email) return;
    pendingAuthEmail = email;

    btn.disabled = true;
    btn.textContent = 'Sending Verification Code...';
    msg.className = 'auth-msg';
    msg.style.display = 'none';

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      btn.disabled = false;
      btn.textContent = 'Send Sign-In Code ✉️ →';

      if (data.success) {
        document.getElementById('loginEmailForm').style.display = 'none';
        document.getElementById('loginOtpForm').style.display = 'block';
        document.getElementById('loginOtpTargetEmail').textContent = email;

        const otpMsg = document.getElementById('loginOtpMsg');
        if (otpMsg) {
          if (data.emailSent) {
            otpMsg.className = 'auth-msg success';
            otpMsg.innerHTML = `✓ Verification code sent to <strong>${email}</strong>. Check your inbox and spam folder.`;
            otpMsg.style.display = 'block';
          } else {
            otpMsg.className = 'auth-msg error';
            otpMsg.innerHTML = `⚠️ Email service is being connected. Contact support or use configured credentials.`;
            otpMsg.style.display = 'block';
          }
        }
        
        const codeInput = document.getElementById('loginOtpCode');
        if (codeInput) {
          codeInput.value = '';
          setTimeout(() => codeInput.focus(), 100);
        }
      } else {
        msg.className = 'auth-msg error';
        msg.textContent = data.error || 'Could not send verification code.';
        msg.style.display = 'block';
      }
    } catch (err) {
      console.warn('Network issue in send-otp:', err);
      btn.disabled = false;
      btn.textContent = 'Send Sign-In Code ✉️ →';
      msg.className = 'auth-msg error';
      msg.textContent = 'Unable to connect to authentication server. Please retry in a moment.';
      msg.style.display = 'block';
    }
  };'''

old_handler_regex = r'window\.currentGeneratedOtp[\s\S]*?window\.handleVerifyLoginOtp'
text = re.sub(old_handler_regex, clean_handler + '\n\n  window.handleVerifyLoginOtp', text, count=1)

with open('assets/client-portal.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Client portal cleaned of all leaks.")

