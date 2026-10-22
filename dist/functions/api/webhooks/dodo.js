// Cloudflare Pages Function: /api/webhooks/dodo
// Ingests, logs, and processes Dodo Payments subscription webhook events into Cloudflare D1

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Dodo-Signature',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const rawPayload = await request.text();
    let event;

    try {
      event = JSON.parse(rawPayload);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    const eventId = event.event_id || event.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const eventType = event.type || event.event_type || 'unknown';

    // 1. Audit Log into webhook_events (Idempotency)
    const existing = await env.DB.prepare(`SELECT id FROM webhook_events WHERE event_id = ?`).bind(eventId).first();
    if (existing) {
      return new Response(JSON.stringify({ success: true, message: 'Event already processed' }), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    const logId = `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await env.DB.prepare(
      `INSERT INTO webhook_events (id, event_id, event_type, payload, processed)
       VALUES (?, ?, ?, ?, 1)`
    ).bind(logId, eventId, eventType, rawPayload).run();

    // 2. Business Logic Execution for Subscriptions
    const data = event.data || {};
    const customerEmail = data.customer?.email || data.email;
    const customerId = data.customer?.customer_id || data.customer_id;
    const subscriptionId = data.subscription_id || data.id;
    const productId = data.product_id;

    if (customerEmail) {
      let planTier = 'growth'; // default
      // Map product or amount to tier
      if (productId && (productId.includes('pro') || productId.includes('autonomous'))) {
        planTier = 'pro_autonomous';
      }

      let subStatus = 'active';
      if (eventType.includes('cancelled') || eventType.includes('canceled')) {
        subStatus = 'cancelled';
      } else if (eventType.includes('failed') || eventType.includes('past_due')) {
        subStatus = 'past_due';
      }

      // Upsert User
      const userExists = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(customerEmail).first();
      const now = new Date().toISOString();

      if (userExists) {
        await env.DB.prepare(
          `UPDATE users 
           SET plan_tier = ?, subscription_status = ?, dodo_customer_id = ?, dodo_subscription_id = ?, updated_at = ?
           WHERE email = ?`
        ).bind(planTier, subStatus, customerId || null, subscriptionId || null, now, customerEmail).run();
      } else {
        const newUserId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await env.DB.prepare(
          `INSERT INTO users (id, email, name, dodo_customer_id, plan_tier, subscription_status, dodo_subscription_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          newUserId,
          customerEmail,
          data.customer?.name || customerEmail.split('@')[0],
          customerId || null,
          planTier,
          subStatus,
          subscriptionId || null
        ).run();
      }
    }

    return new Response(
      JSON.stringify({ success: true, event_id: eventId, event_type: eventType, processed: true }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
