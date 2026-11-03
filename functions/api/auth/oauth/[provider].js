// Cloudflare Pages Function: /api/auth/oauth/[provider]
// Initiates OAuth 2.0 authorization redirect for Google or GitHub

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet({ params, request, env }) {
  const provider = (params.provider || '').toLowerCase();
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/oauth/callback`;

  // Generate a random state string for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + '_' + Date.now();

  let targetUrl = '';

  if (provider === 'google') {
    const clientId = env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return new Response(
        JSON.stringify({ 
          error: 'Google OAuth not configured yet. Please configure GOOGLE_CLIENT_ID in Cloudflare environment secrets.' 
        }),
        { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      state: `google:${state}`,
      prompt: 'select_account'
    });
    targetUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  } else if (provider === 'github') {
    const clientId = env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return new Response(
        JSON.stringify({ 
          error: 'GitHub OAuth not configured yet. Please configure GITHUB_CLIENT_ID in Cloudflare environment secrets.' 
        }),
        { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state: `github:${state}`
    });
    targetUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  } else {
    return new Response(
      JSON.stringify({ error: `Unsupported provider: ${provider}` }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  return Response.redirect(targetUrl, 302);
}
