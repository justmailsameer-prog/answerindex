import fs from 'fs';

// Simple .env loader
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2 && !line.trim().startsWith('#')) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const modelsToTest = [
  { name: 'Nvidia Nemotron 3.5 Lightning (Free)', key: env.OR_NEMOTRON_3_KEY, model: 'nvidia/nemotron-3.5-lightning:free' },
  { name: 'Google Gemma 4 (Free)', key: env.OR_GEMMA_3_27B_KEY, model: 'google/gemma-4-31b-it:free' },
  { name: 'Liquid LFM 2.5 (Free)', key: env.OR_LLAMA_3_2_KEY, model: 'liquid/lfm-2.5-2.6b:free' },
  { name: 'Xingchen AGI (Free)', key: env.OR_STEP_3_5_KEY, model: 'xingchen-agi/xing4.0-29b-a4b:free' }
];

const domain = process.argv[2] || process.env.AEO_TARGET_DOMAIN || 'example.com';
const brand = process.argv[3] || process.env.AEO_TARGET_BRAND || 'ExampleBrand';
const prompt = 'What is ' + brand + ' (' + domain + ')? What does it do?';

async function runBenchmark() {
  console.log('====================================================');
  console.log('  MULTI-MODEL CITATION & ENTITY RECOGNITION TEST   ');
  console.log('====================================================\n');

  for (const m of modelsToTest) {
    if (!m.key) continue;
    console.log(`Testing Model: ${m.name} (${m.model})...`);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${m.key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://' + domain,
          'X-Title': brand + ' AEO Checker'
        },
        body: JSON.stringify({
          model: m.model,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      if (data.choices && data.choices[0]) {
        console.log(`[Result]: ${data.choices[0].message.content.slice(0, 200).replace(/\n/g, ' ')}...`);
      } else {
        console.log(`[Provider Response]:`, data.error ? data.error.message : data);
      }
    } catch (e) {
      console.log(`[Error]:`, e.message);
    }
    console.log('----------------------------------------------------');
  }
}

runBenchmark();


