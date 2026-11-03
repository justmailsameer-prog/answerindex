// Cloudflare Pages Function: /api/auth/send-otp
// Generates a 6-digit OTP code, stores it with an expiration timestamp in Cloudflare D1 or KV,
// and sends an official transactional verification email to the user.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const domain = (body.domain || '').trim().toLowerCase();
    const isRegistration = !!body.is_registration;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes validity

    // 2. Persist OTP in Cloudflare D1 (Ensure verification_codes table exists)
    if (env.DB) {
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS auth_otps (
            email TEXT PRIMARY KEY,
            otp TEXT NOT NULL,
            domain TEXT,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        await env.DB.prepare(`
          INSERT OR REPLACE INTO auth_otps (email, otp, domain, expires_at)
          VALUES (?, ?, ?, ?)
        `).bind(email, otpCode, domain, expiresAt).run();
      } catch (dbErr) {
        console.warn('D1 auth_otps error:', dbErr);
      }
    }

    // 3. Dispatch Email
    // If RESEND_API_KEY is configured in env, send real live email via Resend API
    let emailSent = false;
    let emailError = null;

    const emailSubject = isRegistration 
      ? `Welcome to Answer Index — Verify your account [${otpCode}]`
      : `Your Answer Index Sign-In Code [${otpCode}]`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; color: #1C1D21; background: #FFFFFF; border: 1px solid #ECEBE6; border-radius: 16px;">
        <div style="margin-bottom: 24px; border-bottom: 1px solid #ECEBE6; padding-bottom: 16px;">
          <h1 style="font-size: 20px; font-weight: 800; color: #1C1D21; margin: 0;">Answer Index</h1>
          <p style="font-size: 11px; color: #6E717C; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Autonomous AEO, GEO & Technical SEO Engine</p>
        </div>

        <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">${isRegistration ? 'Verify your new workspace' : 'Your Sign-In Passcode'}</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #4B5563; margin-bottom: 20px;">
          ${isRegistration 
            ? `Welcome aboard! Use the verification code below to confirm your account and activate your indexing queue${domain ? ` for <strong>${domain}</strong>` : ''}:` 
            : `Here is your single-use code to sign in to your Answer Index workspace:`}
        </p>

        <div style="background: #FFF8E7; border: 1.5px solid #F3CA68; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #B45309; display: block;">
            ${otpCode}
          </span>
          <span style="font-size: 11.5px; color: #92400E; display: block; margin-top: 6px;">Valid for 15 minutes</span>
        </div>

        <p style="font-size: 12.5px; line-height: 1.5; color: #6E717C; margin-bottom: 24px;">
          If you did not request this verification code, you can safely ignore this email.
        </p>

        <div style="border-top: 1px solid #ECEBE6; padding-top: 16px; font-size: 11px; color: #9A9DA8; display: flex; justify-content: space-between;">
          <span>© 2026 Answer Index · Crafted by Sameer Sharma</span>
          <span>sameer@answerindex.xyz</span>
        </div>
      </div>
    `;

    // Attempt delivery via Resend API if token available
    const resendKey = env.RESEND_API_KEY || (typeof RESEND_API_KEY !== 'undefined' ? RESEND_API_KEY : null);
    if (resendKey) {
      try {
        const mailResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Answer Index <auth@answerindex.xyz>',
            to: [email],
            subject: emailSubject,
            html: emailHtml
          })
        });
        if (mailResp.ok) {
          emailSent = true;
        } else {
          const errData = await mailResp.json();
          emailError = errData.message || 'Resend API returned error';
        }
      } catch (e) {
        emailError = e.message;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        email,
        emailSent,
        // For development / fallback convenience if SMTP API key is not yet bound to Cloudflare Pages
        devOtp: resendKey ? undefined : otpCode,
        message: emailSent 
          ? `Verification code sent to ${email}. Check your inbox!`
          : `Verification code generated. (Dev Mode OTP: ${otpCode})`
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

