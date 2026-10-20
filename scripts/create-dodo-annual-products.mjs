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

const apiKey = env.DODO_PAYMENTS_API_KEY || process.env.DODO_PAYMENTS_API_KEY;
const baseUrl = env.DODO_PAYMENTS_BASE_URL || 'https://test.dodopayments.com';

const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

async function createProduct(payload) {
  console.log(`Creating product: "${payload.name}"...`);
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
  console.log(`Successfully created "${payload.name}"!`);
  console.log(`Product ID: ${data.product_id || data.id}`);
  return data;
}

async function main() {
  console.log(`Creating Annual Subscription Products in Dodo Payments (${baseUrl})...\n`);

  // 1. Growth Annual ($119/mo * 12 = $1,428 / yr)
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

  // 2. Pro Autonomous Annual ($199/mo * 12 = $2,388 / yr)
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

  const growthAnnual = await createProduct(growthAnnualPayload);
  const proAnnual = await createProduct(proAnnualPayload);

  console.log('\n--- Annual Products Created ---');
  console.log('Growth Annual Product ID:', growthAnnual?.product_id || growthAnnual?.id);
  console.log('Pro Autonomous Annual Product ID:', proAnnual?.product_id || proAnnual?.id);
}

main().catch(console.error);
