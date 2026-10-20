// Cloudflare Pages Function: /api/create-checkout
// Creates a Dodo Payments hosted checkout session for Answer Index subscriptions (Monthly and Annual)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const PLAN_PRODUCT_MAP = {
  // Monthly
  growth: 'pdt_0Nq8T1xSM5rcoI3Pnbv7q',
  growth_monthly: 'pdt_0Nq8T1xSM5rcoI3Pnbv7q',
  pro: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_monthly: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_autonomous: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_autonomous_monthly: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',

  // Annual
  growth_annual: 'pdt_0Nq8WXISavEALUuPtVxAU',
  pro_annual: 'pdt_0Nq8WXJJURRMwGRqVanWP',
  pro_autonomous_annual: 'pdt_0Nq8WXJJURRMwGRqVanWP'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json().catch(() => ({}));
    const { plan = 'pro_autonomous', billing = 'monthly', email = null, name = null } = data;

    // Resolve key: e.g. 'growth_annual' or 'growth_monthly'
    let planKey = plan;
    if (billing === 'annual' && !plan.includes('annual')) {
      planKey = `${plan}_annual`;
    } else if (billing === 'monthly' && !plan.includes('monthly') && !plan.includes('annual')) {
      planKey = `${plan}_monthly`;
    }

    const productId = PLAN_PRODUCT_MAP[planKey] || PLAN_PRODUCT_MAP[plan] || PLAN_PRODUCT_MAP.pro_autonomous;
    const apiKey = env.DODO_PAYMENTS_API_KEY || 'B_BsqgW9u0jhjArl.oBa_JeDJ9OgT_tPXpu9P_LWYoDv52Pk0KBYtRR3aJxhMbdGP';
    const baseUrl = env.DODO_PAYMENTS_BASE_URL || 'https://test.dodopayments.com';

    const origin = new URL(request.url).origin;
    const returnUrl = `${origin}/dashboard?checkout=success`;

    const payload = {
      product_cart: [
        {
          product_id: productId,
          quantity: 1
        }
      ],
      return_url: returnUrl
    };

    if (email) {
      payload.customer = { email, name: name || email.split('@')[0] };
    }

    const dodoRes = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const dodoData = await dodoRes.json();
    if (!dodoRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: dodoData.message || 'Dodo checkout error', details: dodoData }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        session_id: dodoData.session_id,
        checkout_url: dodoData.checkout_url
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
