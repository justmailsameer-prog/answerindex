import fs from 'fs';
import path from 'path';

// Safe .env loader that does not crash if .env is missing
const env = { ...process.env };
if (fs.existsSync('.env')) {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        // Remove surrounding quotes if present
        env[key] = val.replace(/^["']|["']$/g, '');
      }
    });
  } catch (err) {
    console.warn(`[Notice] Could not read .env: ${err.message}`);
  }
} else {
  console.log(`[Notice] No .env file found. To configure API keys, copy .env.example to .env:\n  cp .env.example .env (or Copy-Item .env.example .env on Windows)\n`);
}

// Primary OpenRouter model
const apiKey = env.OPENROUTER_API_KEY || env.OR_NEMOTRON_3_KEY || '';

const modelToTest = {
  name: 'OpenRouter (Nvidia Nemotron 3.5 Lightning)',
  key: apiKey,
  model: env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free'
};

// Strip node flags or options from argv if present
const cleanArgs = process.argv.slice(2).filter(arg => !arg.startsWith('--env-file') && !arg.startsWith('-'));

const domain = cleanArgs[0] || env.AEO_TARGET_DOMAIN || '';
const brand = cleanArgs[1] || env.AEO_TARGET_BRAND || '';

if (!domain) {
  console.log('====================================================');
  console.log('  ANSWERINDEX MULTI-MODEL CITATION BENCHMARK        ');
  console.log('====================================================\n');
  console.log('Usage: Pass any target website domain and brand name to benchmark:\n');
  console.log('  npm run benchmark -- yourdomain.com "Your Brand Name"');
  console.log('  node bin/answerindex.mjs benchmark yourdomain.com "Your Brand Name"\n');
  console.log('Or set AEO_TARGET_DOMAIN and AEO_TARGET_BRAND in your .env file.\n');
  process.exit(1);
}

const targetBrand = brand || domain.replace(/^https?:\/\//, '').split('.')[0].toUpperCase();
const prompt = 'What is ' + targetBrand + ' (' + domain + ')? What does it do?';

async function runBenchmark() {
  console.log('====================================================');
  console.log('   OPENROUTER CITATION & ENTITY RECOGNITION TEST    ');
  console.log('====================================================\n');
  console.log(`Target Domain : ${domain}`);
  console.log(`Target Brand  : ${targetBrand}`);
  console.log(`Test Prompt   : "${prompt}"\n`);
  console.log('----------------------------------------------------');

  if (!modelToTest.key) {
    console.log('\n⚠️  No OpenRouter API key found. Add your OPENROUTER_API_KEY to your .env file:');
    console.log('  OPENROUTER_API_KEY=your_key_here');
    console.log('Get a key at: https://openrouter.ai/keys\n');
    return;
  }

  console.log(`Testing Model: ${modelToTest.name} (${modelToTest.model})...`);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelToTest.key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://' + domain,
        'X-Title': targetBrand + ' AEO Checker'
      },
      body: JSON.stringify({
        model: modelToTest.model,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    if (data.choices && data.choices[0]) {
      console.log(`\n[Result]:\n${data.choices[0].message.content}\n`);
    } else {
      console.log(`[Provider Response]:`, data.error ? data.error.message : data);
    }
  } catch (e) {
    console.log(`[Error]:`, e.message);
  }
  console.log('----------------------------------------------------');
}

runBenchmark();


