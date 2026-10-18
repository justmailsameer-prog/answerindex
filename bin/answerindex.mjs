#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

import { generateAllReadinessFiles } from '../lib/readiness-generator.mjs';

const command = process.argv[2] || 'help';
const args = process.argv.slice(3);

console.log(`\n=== AnswerIndex CLI (v1.1.0) ===`);
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
  case 'ready': {
    const domain = args[0];
    if (!domain) {
      console.error(`Error: Please specify a domain. Example: answerindex ready mybrand.com`);
      process.exit(1);
    }
    const siteName = args[1] || undefined;
    console.log(`Generating AI Readiness deployment kit for: ${domain}...`);
    try {
      const result = generateAllReadinessFiles({ domain, siteName });
      console.log(`\n✅ AI Readiness Kit successfully generated!`);
      console.log(`📂 Output directory: ${result.targetDir}`);
      console.log(`\nFiles created:`);
      result.files.forEach(f => console.log(`  - ${f.filename}`));
      console.log(`\nDeploy these files to your web root so ChatGPT, Claude, Perplexity, and Gemini can crawl and cite your authoritative answers.`);
    } catch (err) {
      console.error(`Failed to generate AI readiness files: ${err.message}`);
      process.exit(1);
    }
    break;
  }
  case 'mcp': {
    console.log(`Starting AnswerIndex MCP Server (stdio)...`);
    const proc = spawn('node', [path.join(rootDir, 'lib', 'mcp-server.mjs')], { stdio: 'inherit' });
    proc.on('exit', code => process.exit(code || 0));
    break;
  }
  case 'help':
  default:
    console.log(`Usage: answerindex <command> [options]`);
    console.log(`\nCommands:`);
    console.log(`  ready <domain> [name]  Generate AI Readiness root files (robots.txt, llms.txt, ai.txt, schemas)`);
    console.log(`  benchmark              Run multi-model LLM citation & entity recognition benchmark`);
    console.log(`  aeo <domain>           Run AEO assessment using aeo-platform`);
    console.log(`  seo                    Information & launcher for SEO deep-dive skills`);
    console.log(`  mcp                    Launch AnswerIndex as an MCP server for Cursor, Claude Code, Windsurf`);
    console.log(`  help                   Show this help message\n`);
    break;
}
