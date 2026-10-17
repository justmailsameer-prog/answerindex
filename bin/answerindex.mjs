#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const command = process.argv[2] || 'help';
const args = process.argv.slice(3);

console.log(`\n=== AnswerIndex CLI (v1.0.0) ===`);
console.log(`Making content indexable as authoritative answers across Search & AI Engines.\n`);

switch (command) {
  case 'benchmark': {
    const proc = spawn('node', [path.join(rootDir, 'test-aeo-models.mjs'), ...args], { stdio: 'inherit' });
    proc.on('exit', code => process.exit(code || 0));
    break;
  }
  case 'aeo': {
    const proc = spawn('npx', ['aeo-platform', ...args], { stdio: 'inherit', cwd: rootDir, shell: true });
    proc.on('exit', code => process.exit(code || 0));
    break;
  }
  case 'seo': {
    console.log(`Launching SEO Skill Toolkit at: ${path.join(rootDir, 'seo-toolkit')}`);
    console.log(`Follow instructions in seo-toolkit/README.md or run specific sub-skills.`);
    break;
  }
  case 'help':
  default:
    console.log(`Usage: answerindex <command> [options]`);
    console.log(`\nCommands:`);
    console.log(`  benchmark          Run multi-model LLM citation & entity recognition benchmark`);
    console.log(`  aeo <domain>       Run AEO assessment using aeo-platform`);
    console.log(`  seo                Information & launcher for SEO deep-dive skills`);
    console.log(`  help               Show this help message\n`);
    break;
}
