// Cloudflare Pages Function: /api/auth/oauth/callback
// Handles the authorization code return from Google or GitHub,
// exchanges it for user profile information, provisions/loads the user in D1,
// and redirects into the dashboard.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const error = url.searchParams.get('error');

  const redirectBase = url.origin;

  if (error || !code) {
    return Response.redirect(`${redirectBase}/?auth_error=${encodeURIComponent(error || 'Authorization was cancelled')}`, 302);
  }

  const provider = state.startsWith('github:') ? 'github' : 'google';
  const callbackUri = `${url.origin}/api/auth/oauth/callback`;

  try {
    let email = '';
    let name = '';
    let avatarUrl = '';

    if (provider === 'google') {
      const clientId = env.GOOGLE_CLIENT_ID;
      const clientSecret = env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Google OAuth credentials not configured in Cloudflare environment.');
      }

      // Exchange code for token
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUri,
          grant_type: 'authorization_code'
        })
      });

      const tokenData = await tokenResp.json();
      if (!tokenResp.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || 'Failed to exchange token with Google');
      }

      // Fetch user profile from Google UserInfo
      const userResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userResp.json();
      email = (userData.email || '').toLowerCase().trim();
      name = userData.name || userData.given_name || email.split('@')[0];
      avatarUrl = userData.picture || '';

    } else if (provider === 'github') {
      const clientId = env.GITHUB_CLIENT_ID;
      const clientSecret = env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth credentials not configured in Cloudflare environment.');
      }

      // Exchange code for token
      const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUri
        })
      });

      const tokenData = await tokenResp.json();
      if (!tokenResp.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || 'Failed to exchange token with GitHub');
      }

      // Fetch GitHub User Profile
      const userResp = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'AnswerIndex-OAuth-App'
        }
      });
      const userData = await userResp.json();
      name = userData.name || userData.login || '';
      avatarUrl = userData.avatar_url || '';

      // If public email is empty, fetch primary verified email
      email = (userData.email || '').toLowerCase().trim();
      if (!email) {
        const emailsResp = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'User-Agent': 'AnswerIndex-OAuth-App'
          }
        });
        const emails = await emailsResp.json();
        if (Array.isArray(emails)) {
          const primary = emails.find(e => e.primary && e.verified) || emails.find(e => e.verified) || emails[0];
          if (primary) email = primary.email.toLowerCase().trim();
        }
      }
    }

    if (!email) {
      throw new Error(`Could not retrieve verified email address from ${provider}.`);
    }

    // Provision or update user in Cloudflare D1
    let user = null;
    let project = null;

    if (env.DB) {
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            plan_tier TEXT DEFAULT 'starter',
            subscription_status TEXT DEFAULT 'active',
            oauth_provider TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        user = await env.DB.prepare(`SELECT * FROM users WHERE lower(email) = ?`).bind(email).first();

        if (!user) {
          const newUserId = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
          await env.DB.prepare(`
            INSERT INTO users (id, email, name, plan_tier, subscription_status, oauth_provider, avatar_url)
            VALUES (?, ?, ?, 'pro_autonomous', 'active', ?, ?)
          `).bind(newUserId, email, name, provider, avatarUrl).run();

          user = {
            id: newUserId,
            email,
            name,
            plan_tier: 'pro_autonomous',
            subscription_status: 'active',
            oauth_provider: provider,
            avatar_url: avatarUrl
          };
        } else {
          // Update provider & avatar
          await env.DB.prepare(`
            UPDATE users SET oauth_provider = ?, avatar_url = ? WHERE id = ?
          `).bind(provider, avatarUrl || user.avatar_url, user.id).run();
        }

        project = await env.DB.prepare(`
          SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC
        `).bind(user.id).first();

      } catch (dbErr) {
        console.warn('D1 error in OAuth callback:', dbErr);
      }
    }

    const fallbackUser = user || {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name,
      plan_tier: 'pro_autonomous',
      oauth_provider: provider,
      avatar_url: avatarUrl
    };

    const targetUrl = new URL(`${redirectBase}/dashboard.html`);
    targetUrl.searchParams.set('email', fallbackUser.email);
    targetUrl.searchParams.set('oauth_login', '1');
    if (project && project.id) {
      targetUrl.searchParams.set('project_id', project.id);
    }

    // Set a lightweight auth redirect page that writes to localStorage and forwards to dashboard
    const htmlResponse = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with Answer Index...</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0C1222; color: #FFFFFF; margin: 0; }
    .loader-box { text-align: center; background: rgba(255,255,255,0.05); padding: 32px 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
    .spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #3B82F6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader-box">
    <div class="spinner"></div>
    <h3 style="margin: 0 0 8px; font-size: 18px;">Signed in via ${provider === 'github' ? 'GitHub' : 'Google'}</h3>
    <p style="margin: 0; font-size: 13px; color: #94A3B8;">Loading your workspace...</p>
  </div>
  <script>
    try {
      localStorage.setItem('answerindex_user', JSON.stringify(${JSON.stringify(fallbackUser)}));
      ${project ? `localStorage.setItem('answerindex_project', JSON.stringify(${JSON.stringify(project)}));` : ''}
    } catch(e) {}
    window.location.replace('${targetUrl.toString()}');
  </script>
</body>
</html>`;

    return new Response(htmlResponse, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (err) {
    return Response.redirect(`${redirectBase}/?auth_error=${encodeURIComponent(err.message)}`, 302);
  }
}

