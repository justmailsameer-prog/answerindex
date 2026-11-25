// Cloudflare Pages Function: /api/customer-portal
// Creates a Dodo Payments Customer Portal session for an existing subscriber in D1

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Customer email is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const user = await env.DB.prepare(
      `SELECT dodo_customer_id, plan_tier, subscription_status FROM users WHERE lower(email) = ?`
    ).bind(email).first();

    if (!user || !user.dodo_customer_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'No active Dodo Payments customer record found for this email' }),
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const isLive = (env.DODO_PAYMENTS_ENV === 'live_mode');
    const apiKey = isLive ? env.DODO_PAYMENTS_API_KEY : (env.DODO_PAYMENTS_API_KEY_TEST || env.DODO_PAYMENTS_API_KEY);
    const baseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';

    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway not configured' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const res = await fetch(`${baseUrl}/customers/${encodeURIComponent(user.dodo_customer_id)}/customer-portal/session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ send_email: false })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.link) {
      return new Response(
        JSON.stringify({ success: false, error: data.message || 'Unable to create customer portal session' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode: isLive ? 'live' : 'test',
        portal_url: data.link
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
