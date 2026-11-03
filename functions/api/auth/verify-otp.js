// Cloudflare Pages Function: /api/auth/verify-otp
// Verifies user's submitted 6-digit OTP code against Cloudflare D1.
// If valid, establishes/returns the verified user session and project.

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
    const otp = (body.otp || '').trim();
    const domain = (body.domain || '').trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    const brandName = (body.brand_name || domain.split('.')[0] || 'My Brand').trim();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and verification code are required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Check master founder bypass passcode
    const isMasterBypass = (otp === '88888888');

    let isValid = isMasterBypass;

    // 2. Query OTP in Cloudflare D1
    if (!isMasterBypass && env.DB) {
      try {
        const record = await env.DB.prepare(`
          SELECT otp, expires_at FROM auth_otps WHERE email = ?
        `).bind(email).first();

        if (record && record.otp === otp) {
          const isExpired = new Date(record.expires_at).getTime() < Date.now();
          if (!isExpired) {
            isValid = true;
            // Clean up used OTP
            await env.DB.prepare(`DELETE FROM auth_otps WHERE email = ?`).bind(email).run();
          } else {
            return new Response(
              JSON.stringify({ success: false, error: 'Verification code has expired. Please request a new code.' }),
              { status: 400, headers: CORS_HEADERS }
            );
          }
        }
      } catch (dbErr) {
        console.warn('D1 OTP verification check error:', dbErr);
      }
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid verification code. Please check your email and try again.' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 3. User authenticated! Retrieve or provision user record in D1
    let user = null;
    let project = null;

    if (env.DB) {
      user = await env.DB.prepare(`
        SELECT id, email, name, plan_tier, subscription_status, created_at FROM users WHERE lower(email) = ?
      `).bind(email).first();

      if (!user) {
        const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const userName = email.split('@')[0];
        await env.DB.prepare(`
          INSERT INTO users (id, email, name, plan_tier, subscription_status)
          VALUES (?, ?, ?, 'pro_autonomous', 'active')
        `).bind(userId, email, userName).run();

        user = {
          id: userId,
          email,
          name: userName,
          plan_tier: 'pro_autonomous',
          subscription_status: 'active'
        };
      }

      // Find or create linked project
      if (domain) {
        project = await env.DB.prepare(`
          SELECT * FROM projects WHERE user_id = ? AND domain = ?
        `).bind(user.id, domain).first();

        if (!project) {
          const projId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          await env.DB.prepare(`
            INSERT INTO projects (id, user_id, domain, brand_name, cms_type)
            VALUES (?, ?, ?, ?, 'portal')
          `).bind(projId, user.id, domain, brandName).run();

          project = {
            id: projId,
            user_id: user.id,
            domain,
            brand_name: brandName,
            cms_type: 'portal'
          };
        }
      } else {
        project = await env.DB.prepare(`
          SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC
        `).bind(user.id).first();
      }
    } else {
      // Fallback object if D1 is unreachable
      user = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0],
        plan_tier: 'pro_autonomous',
        subscription_status: 'active'
      };
      if (domain) {
        project = {
          id: `proj_${Date.now()}`,
          domain,
          brand_name: brandName,
          cms_type: 'portal'
        };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user,
        project,
        activeProject: project,
        message: 'Authentication verified successfully!'
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

