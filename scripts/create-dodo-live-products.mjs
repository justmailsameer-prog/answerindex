import fs from 'fs';

// Read .env natively
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    env[key] = val;
  }
}

const apiKey = env.DODO_PAYMENTS_API_KEY;
const baseUrl = 'https://live.dodopayments.com';

const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

async function createProduct(payload) {
  console.log(`[LIVE] Creating product: "${payload.name}"...`);
  const res = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`Error creating "${payload.name}":`, JSON.stringify(data, null, 2));
    return null;
  }
  console.log(`[LIVE] Successfully created "${payload.name}"!`);
  console.log(`Product ID: ${data.product_id || data.id}`);
  return data;
}

async function main() {
  console.log(`Connecting to LIVE Dodo Payments (${baseUrl})...\n`);

  // 1. Answer Index Growth ($149 / month)
  const growthPayload = {
    name: 'Answer Index Growth',
    description: 'Daily AEO/GEO autonomous workflow, 30 AEO articles/month, PR reviews, email support.',
    tax_category: 'digital_products',
    price: {
      type: 'recurring_price',
      price: 14900, // $149.00 in cents
      currency: 'USD',
      payment_frequency_count: 1,
      payment_frequency_interval: 'Month',
      subscription_period_count: 10,
      subscription_period_interval: 'Year'
    }
  };

  // 2. Answer Index Pro Autonomous ($249 / month)
  const proPayload = {
    name: 'Answer Index Pro Autonomous',
    description: 'Full autonomous daily growth loop (1 new AEO piece + 1 technical SEO refactor/day = 60 PRs/mo), Schema validation, direct founder consultation triage.',
    tax_category: 'digital_products',
    price: {
      type: 'recurring_price',
      price: 24900, // $249.00 in cents
      currency: 'USD',
      payment_frequency_count: 1,
      payment_frequency_interval: 'Month',
      subscription_period_count: 10,
      subscription_period_interval: 'Year'
    }
  };

  // 3. Growth Annual ($119/mo * 12 = $1,428 / yr)
  const growthAnnualPayload = {
    name: 'Answer Index Growth (Annual)',
    description: 'Daily AEO/GEO autonomous workflow, 30 AEO articles/month, PR reviews, email support. Billed annually ($119/mo).',
    tax_category: 'digital_products',
    price: {
      type: 'recurring_price',
      price: 142800, // $1,428.00 in cents
      currency: 'USD',
      payment_frequency_count: 1,
      payment_frequency_interval: 'Year',
      subscription_period_count: 10,
      subscription_period_interval: 'Year'
    }
  };

  // 4. Pro Autonomous Annual ($199/mo * 12 = $2,388 / yr)
  const proAnnualPayload = {
    name: 'Answer Index Pro Autonomous (Annual)',
    description: 'Full autonomous daily growth loop (1 new AEO piece + 1 technical SEO refactor/day = 60 PRs/mo), Schema validation, monthly 1-on-1 strategy call with founder. Billed annually ($199/mo).',
    tax_category: 'digital_products',
    price: {
      type: 'recurring_price',
      price: 238800, // $2,388.00 in cents
      currency: 'USD',
      payment_frequency_count: 1,
      payment_frequency_interval: 'Year',
      subscription_period_count: 10,
      subscription_period_interval: 'Year'
    }
  };

  const growth = await createProduct(growthPayload);
  const pro = await createProduct(proPayload);
  const growthAnnual = await createProduct(growthAnnualPayload);
  const proAnnual = await createProduct(proAnnualPayload);

  console.log('\n--- LIVE PRODUCTS SUMMARY ---');
  console.log('LIVE Growth Monthly Product ID:', growth?.product_id || growth?.id);
  console.log('LIVE Pro Autonomous Monthly Product ID:', pro?.product_id || pro?.id);
  console.log('LIVE Growth Annual Product ID:', growthAnnual?.product_id || growthAnnual?.id);
  console.log('LIVE Pro Autonomous Annual Product ID:', proAnnual?.product_id || proAnnual?.id);
}

main().catch(console.error);
