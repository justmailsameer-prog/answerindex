// Cloudflare Pages Function: /api/webhooks/dodo
// Verifies Standard Webhooks (HMAC-SHA256) signature, enforces idempotency,
// and syncs Dodo Payments subscription & payment lifecycle events into Cloudflare D1.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, webhook-id, webhook-signature, webhook-timestamp',
  'Content-Type': 'application/json'
};

// Exact Product ID -> Plan Tier mapping for Answer Index (Live & Test)
const PRODUCT_TIER_MAP = {
  // Live
  'pdt_0Nq8mjgfNfEsNBbQkzqiW': 'growth',
  'pdt_0Nq8mjkKnCKtceVwCGV89': 'growth',
  'pdt_0Nq8mjiTwVYBMTZtswj5O': 'pro_autonomous',
  'pdt_0Nq8mjlabKyFMgkI3zJlb': 'pro_autonomous',
  'pdt_0NsjM02bBwt0B9Gc47i7Q': 'enterprise',
  // Test
  'pdt_0Nq8T1xSM5rcoI3Pnbv7q': 'growth',
  'pdt_0Nq8WXISavEALUuPtVxAU': 'growth',
  'pdt_0Nq8T1zIQyR0pvdZbTHqU': 'pro_autonomous',
  'pdt_0Nq8WXJJURRMwGRqVanWP': 'pro_autonomous',
  'pdt_0NsjLzluxs8jjluDTCj01': 'enterprise',
  'pdt_0NsjLznOPEWudzwY1Rloz': 'enterprise'
};

function base64ToUint8Array(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function uint8ArrayToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyStandardWebhookSignature(rawBody, headers, secrets) {
  const whId = headers.get('webhook-id');
  const whTs = headers.get('webhook-timestamp');
  const whSig = headers.get('webhook-signature');

  if (!whId || !whTs || !whSig) {
    return { valid: false, reason: 'Missing Standard Webhooks headers' };
  }

  // Reject stale timestamps (> 5 minutes skew)
  const tsNum = parseInt(whTs, 10);
  const nowSec = Math.floor(Date.now() / 1000);
  if (Number.isNaN(tsNum) || Math.abs(nowSec - tsNum) > 300) {
    return { valid: false, reason: 'Stale webhook timestamp' };
  }

  const signedContent = `${whId}.${whTs}.${rawBody}`;
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(signedContent);

  const signatures = whSig
    .split(/\s+/)
    .map(part => part.split(','))
    .filter(parts => parts.length === 2 && parts[0] === 'v1')
    .map(parts => parts[1]);

  if (signatures.length === 0) {
    return { valid: false, reason: 'No v1 signature present' };
  }

  for (const rawSecret of secrets) {
    if (!rawSecret) continue;
    const cleanB64 = rawSecret.startsWith('whsec_') ? rawSecret.slice(6) : rawSecret;
    let keyBytes;
    try {
      keyBytes = base64ToUint8Array(cleanB64);
    } catch {
      keyBytes = encoder.encode(rawSecret);
    }

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', cryptoKey, dataBytes);
    const expectedSig = uint8ArrayToBase64(new Uint8Array(mac));

    for (const sig of signatures) {
      if (timingSafeEqual(expectedSig, sig)) {
        return { valid: true };
      }
    }
  }

  return { valid: false, reason: 'Signature mismatch' };
}

function resolvePlanTier(productId, metadataPlan) {
  if (productId && PRODUCT_TIER_MAP[productId]) {
    return PRODUCT_TIER_MAP[productId];
  }
  const meta = String(metadataPlan || '').toLowerCase();
  if (meta.includes('enterprise')) return 'enterprise';
  if (meta.includes('pro')) return 'pro_autonomous';
  if (meta.includes('growth')) return 'growth';
  return 'growth';
}

function resolveSubscriptionStatus(eventType, dataStatus) {
  const t = String(eventType || '').toLowerCase();
  if (t === 'subscription.cancelled' || t === 'subscription.expired') return 'cancelled';
  if (t === 'payment.refunded' || t === 'refund.succeeded') return 'cancelled';
  if (t === 'subscription.failed' || t === 'payment.failed' || t === 'subscription.on_hold') return 'past_due';
  if (t === 'subscription.active' || t === 'subscription.renewed' || t === 'payment.succeeded' || t === 'subscription.plan_changed') {
    return 'active';
  }
  if (dataStatus) {
    const s = String(dataStatus).toLowerCase();
    if (s === 'cancelled' || s === 'expired') return 'cancelled';
    if (s === 'on_hold' || s === 'failed' || s === 'past_due') return 'past_due';
    if (s === 'active') return 'active';
  }
  return 'active';
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const secrets = [env.DODO_PAYMENTS_WEBHOOK_KEY, env.DODO_PAYMENTS_WEBHOOK_KEY_TEST].filter(Boolean);
    if (secrets.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Webhook secret not configured' }), {
        status: 500,
        headers: CORS_HEADERS
      });
    }

    const rawPayload = await request.text();
    const verification = await verifyStandardWebhookSignature(rawPayload, request.headers, secrets);
    if (!verification.valid) {
      return new Response(JSON.stringify({ success: false, error: verification.reason }), {
        status: 401,
        headers: CORS_HEADERS
      });
    }

    let event;
    try {
      event = JSON.parse(rawPayload);
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    const eventId = request.headers.get('webhook-id') || event.event_id || event.id;
    const eventType = event.type || event.event_type || 'unknown';

    if (!eventId) {
      return new Response(JSON.stringify({ success: false, error: 'Missing webhook event id' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    // 1. Idempotency check in webhook_events
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

    // 2. Sync Subscription & Payment State
    const data = event.data || {};
    const customerEmail = data.customer?.email || data.email;
    const customerId = data.customer?.customer_id || data.customer_id;
    const subscriptionId = data.subscription_id || (eventType.startsWith('subscription.') ? data.id : null);
    const productId = data.product_id || (Array.isArray(data.product_cart) && data.product_cart[0]?.product_id) || null;

    if (customerEmail) {
      const planTier = resolvePlanTier(productId, data.metadata?.plan);
      const subStatus = resolveSubscriptionStatus(eventType, data.status);
      const now = new Date().toISOString();

      const userExists = await env.DB.prepare(`SELECT id FROM users WHERE lower(email) = lower(?)`).bind(customerEmail).first();
      if (userExists) {
        await env.DB.prepare(
          `UPDATE users
           SET plan_tier = ?, subscription_status = ?, dodo_customer_id = COALESCE(?, dodo_customer_id), dodo_subscription_id = COALESCE(?, dodo_subscription_id), updated_at = ?
           WHERE id = ?`
        ).bind(planTier, subStatus, customerId || null, subscriptionId || null, now, userExists.id).run();
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
