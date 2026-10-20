// Cloudflare Pages Function: /api/create-checkout
// Creates a Dodo Payments hosted checkout session for Answer Index subscriptions
// Supports seamless transition between Live Mode and Test Mode with automatic fallback

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// 1. Live Mode Products (Answer Index Brand)
const LIVE_PRODUCT_MAP = {
  growth: 'pdt_0Nq8mjgfNfEsNBbQkzqiW',
  growth_monthly: 'pdt_0Nq8mjgfNfEsNBbQkzqiW',
  growth_annual: 'pdt_0Nq8mjkKnCKtceVwCGV89',
  pro: 'pdt_0Nq8mjiTwVYBMTZtswj5O',
  pro_monthly: 'pdt_0Nq8mjiTwVYBMTZtswj5O',
  pro_autonomous: 'pdt_0Nq8mjiTwVYBMTZtswj5O',
  pro_autonomous_monthly: 'pdt_0Nq8mjiTwVYBMTZtswj5O',
  pro_annual: 'pdt_0Nq8mjlabKyFMgkI3zJlb',
  pro_autonomous_annual: 'pdt_0Nq8mjlabKyFMgkI3zJlb'
};

// 2. Test Mode Products (Answer Index Brand)
const TEST_PRODUCT_MAP = {
  growth: 'pdt_0Nq8T1xSM5rcoI3Pnbv7q',
  growth_monthly: 'pdt_0Nq8T1xSM5rcoI3Pnbv7q',
  growth_annual: 'pdt_0Nq8WXISavEALUuPtVxAU',
  pro: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_monthly: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_autonomous: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_autonomous_monthly: 'pdt_0Nq8T1zIQyR0pvdZbTHqU',
  pro_annual: 'pdt_0Nq8WXJJURRMwGRqVanWP',
  pro_autonomous_annual: 'pdt_0Nq8WXJJURRMwGRqVanWP'
};

const LIVE_API_KEY = 'pAHcoUqy7QVK5Jow.aBlm68kYcm5YKKzaccXSjYl_6niDoqifjMLp7efNufoIwO6M';
const TEST_API_KEY = 'B_BsqgW9u0jhjArl.oBa_JeDJ9OgT_tPXpu9P_LWYoDv52Pk0KBYtRR3aJxhMbdGP';

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json().catch(() => ({}));
    const { plan = 'pro_autonomous', billing = 'monthly', email = null, name = null } = data;

    // Resolve plan key: e.g. 'growth_annual' or 'growth_monthly'
    let planKey = plan;
    if (billing === 'annual' && !plan.includes('annual')) {
      planKey = `${plan}_annual`;
    } else if (billing === 'monthly' && !plan.includes('monthly') && !plan.includes('annual')) {
      planKey = `${plan}_monthly`;
    }

    const origin = new URL(request.url).origin;
    const returnUrl = `${origin}/dashboard?checkout=success`;

    const isLiveRequested = (env.DODO_PAYMENTS_ENV === 'live_mode');

    // Attempt Live Mode if requested
    if (isLiveRequested) {
      const liveProductId = LIVE_PRODUCT_MAP[planKey] || LIVE_PRODUCT_MAP.pro_autonomous;
      const liveKey = env.DODO_PAYMENTS_API_KEY || LIVE_API_KEY;

      const payload = {
        product_cart: [{ product_id: liveProductId, quantity: 1 }],
        return_url: returnUrl
      };
      if (email) payload.customer = { email, name: name || email.split('@')[0] };

      const res = await fetch('https://live.dodopayments.com/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${liveKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok && resData.checkout_url) {
        return new Response(
          JSON.stringify({
            success: true,
            mode: 'live',
            session_id: resData.session_id,
            checkout_url: resData.checkout_url
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      }

      // If merchant is not live yet, log and gracefully fall back to test mode
      console.warn('Live checkout returned error, falling back to test mode:', resData);
    }

    // Test Mode Execution (Fallback or Default)
    const testProductId = TEST_PRODUCT_MAP[planKey] || TEST_PRODUCT_MAP.pro_autonomous;
    const testKey = TEST_API_KEY;

    const testPayload = {
      product_cart: [{ product_id: testProductId, quantity: 1 }],
      return_url: returnUrl
    };
    if (email) testPayload.customer = { email, name: name || email.split('@')[0] };

    const testRes = await fetch('https://test.dodopayments.com/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const testData = await testRes.json();
    if (!testRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: testData.message || 'Checkout failed', details: testData }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode: 'test',
        session_id: testData.session_id,
        checkout_url: testData.checkout_url
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
