// Cloudflare Pages Function: /api/triage
// Handles strategy call bookings, 24-hr audit requests, and direct founder messages.

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
    const data = await request.json();
    const { type, name = '', email = '', domain = '', message = '' } = data;

    if (!email || !type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and request type are required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await env.DB.prepare(
      `INSERT INTO leads_and_triage (id, type, name, email, domain, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new')`
    ).bind(id, type, name, email, domain, message).run();

    return new Response(
      JSON.stringify({
        success: true,
        id,
        message: 'Your request has been successfully recorded in Answer Index Cloudflare D1.'
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal database error' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT * FROM leads_and_triage ORDER BY created_at DESC LIMIT 50`
    ).all();

    return new Response(
      JSON.stringify({ success: true, count: results.length, data: results }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
