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
    console.log(`[SEO Toolkit] Checking Python environment...`);
    const checkProc = spawn('python', ['-c', 'import bs4, requests; print("deps_ok")'], { stdio: 'pipe' });
    let stdoutData = '';
    checkProc.stdout.on('data', d => { stdoutData += d.toString(); });
    checkProc.on('exit', code => {
      if (code !== 0 || !stdoutData.includes('deps_ok')) {
        console.warn(`\n⚠️  Missing required Python dependencies (such as beautifulsoup4 or requests).`);
        console.log(`To install the required dependencies, run:\n`);
        console.log(`  python -m pip install -r seo-toolkit/requirements.txt\n`);
        console.log(`Then re-run: npm run seo (or python ./seo-toolkit/seo.py <command>)\n`);
        process.exit(1);
      } else {
        const seoArgs = args.length > 0 ? args : ['doctor'];
        console.log(`Running: python ./seo-toolkit/seo.py ${seoArgs.join(' ')}\n`);
        const proc = spawn('python', [path.join(rootDir, 'seo-toolkit', 'seo.py'), ...seoArgs], { stdio: 'inherit' });
        proc.on('exit', exitCode => process.exit(exitCode || 0));
      }
    });
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
    process.stderr.write(`\n=== AnswerIndex Model Context Protocol (MCP) Server ===\n`);
    process.stderr.write(`Status: Listening over stdio (JSON-RPC 2.0)...\n`);
    process.stderr.write(`Note: This process runs continuously in the background for AI coding clients (Cursor, Claude Code, Windsurf).\n`);
    process.stderr.write(`To configure it in your editor, add to your MCP settings:\n`);
    process.stderr.write(`{\n  "mcpServers": {\n    "answerindex": {\n      "command": "node",\n      "args": ["${path.join(rootDir, 'lib', 'mcp-server.mjs').replace(/\\/g, '/')}"]\n    }\n  }\n}\n\n`);
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
