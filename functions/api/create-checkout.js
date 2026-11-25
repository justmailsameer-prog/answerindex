// Cloudflare Pages Function: /api/create-checkout
// Creates a Dodo Payments hosted checkout session for Answer Index subscriptions
// Brand: Answer Index (bus_0Nq8QvYnUZRAeSOVj7dSt)
// Tiers:
// 1. Growth Plan ($199/mo / $159/mo annual = $1,908/yr)
// 2. Pro Autonomous ($499/mo / $399/mo annual = $4,788/yr; Note: Live Annual currently capped at $2,388/yr until Dodo raises business cart limit)
// 3. Enterprise DFY Partner ($1,499/mo / $1,199/mo annual = $14,388/yr; Note: Live Annual pending Dodo cart limit increase)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const ANSWERINDEX_BRAND_ID = 'bus_0Nq8QvYnUZRAeSOVj7dSt';

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
  pro_autonomous_annual: 'pdt_0Nq8mjlabKyFMgkI3zJlb',
  enterprise: 'pdt_0NsjM02bBwt0B9Gc47i7Q',
  enterprise_monthly: 'pdt_0NsjM02bBwt0B9Gc47i7Q',
  enterprise_annual: 'pdt_0NsjM02bBwt0B9Gc47i7Q' // Fallback to Enterprise Monthly until Dodo raises business cart limit above $2,500
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
  pro_autonomous_annual: 'pdt_0Nq8WXJJURRMwGRqVanWP',
  enterprise: 'pdt_0NsjLzluxs8jjluDTCj01',
  enterprise_monthly: 'pdt_0NsjLzluxs8jjluDTCj01',
  enterprise_annual: 'pdt_0NsjLznOPEWudzwY1Rloz'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json().catch(() => ({}));
    const { plan = 'pro_autonomous', billing = 'monthly', email = null, name = null } = data;

    // Resolve plan key: e.g. 'growth_annual', 'pro_autonomous_monthly', 'enterprise_monthly'
    let planKey = String(plan).trim().toLowerCase();
    if (billing === 'annual' && !planKey.includes('annual')) {
      planKey = `${planKey}_annual`;
    } else if (billing === 'monthly' && !planKey.includes('monthly') && !planKey.includes('annual')) {
      planKey = `${planKey}_monthly`;
    }

    const origin = new URL(request.url).origin;
    const returnUrl = `${origin}/dashboard?checkout=success&plan=${encodeURIComponent(planKey)}`;

    const isLiveRequested = (env.DODO_PAYMENTS_ENV === 'live_mode');
    const liveKey = env.DODO_PAYMENTS_API_KEY || '';
    const testKey = env.DODO_PAYMENTS_API_KEY_TEST || (!isLiveRequested ? env.DODO_PAYMENTS_API_KEY : '');

    // Attempt Live Mode if requested and key is configured
    if (isLiveRequested && liveKey) {
      const liveProductId = LIVE_PRODUCT_MAP[planKey] || LIVE_PRODUCT_MAP.pro_autonomous;

      const payload = {
        product_cart: [{ product_id: liveProductId, quantity: 1 }],
        return_url: returnUrl,
        metadata: {
          brand: 'answerindex',
          brand_id: ANSWERINDEX_BRAND_ID,
          plan: planKey,
          billing
        }
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

      const resData = await res.json().catch(() => ({}));
      if (res.ok && resData.checkout_url) {
        return new Response(
          JSON.stringify({
            success: true,
            mode: 'live',
            brand_id: ANSWERINDEX_BRAND_ID,
            product_id: liveProductId,
            session_id: resData.session_id,
            checkout_url: resData.checkout_url
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      }

      // If no test key is available, return the live error directly
      if (!testKey) {
        return new Response(
          JSON.stringify({ success: false, error: resData.message || 'Live checkout failed', details: resData }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
      console.warn('Live checkout returned error, falling back to test mode:', resData);
    }

    // Test Mode Execution
    if (!testKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway not configured (missing API key binding)' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const testProductId = TEST_PRODUCT_MAP[planKey] || TEST_PRODUCT_MAP.pro_autonomous;
    const testPayload = {
      product_cart: [{ product_id: testProductId, quantity: 1 }],
      return_url: returnUrl,
      metadata: {
        brand: 'answerindex',
        brand_id: ANSWERINDEX_BRAND_ID,
        plan: planKey,
        billing
      }
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

    const testData = await testRes.json().catch(() => ({}));
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
        brand_id: ANSWERINDEX_BRAND_ID,
        product_id: testProductId,
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
