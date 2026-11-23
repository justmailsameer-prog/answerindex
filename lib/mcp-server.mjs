#!/usr/bin/env node
/**
 * AnswerIndex MCP Server (v3.3.0)
 * Exposes AnswerIndex AEO benchmark, AI readiness kit generator, 1-line edge tag, query fanout, and SEO audit tools via standard Model Context Protocol (stdio).
 */
import readline from 'readline';
import { generateAllReadinessFiles, KNOWN_AI_CRAWLERS } from './readiness-generator.mjs';

const TOOLS = [
  {
    name: 'generate_ai_readiness_kit',
    description: 'Generate a production-ready suite of 26 AI readiness files (robots.txt, ai.txt, llms.txt, llms-full.txt, ai-entities.json, ai-intent.json, ai-schema.json, ai-sitemap.xml) for any domain.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'The target website domain (e.g. "example.com" or "answerindex.xyz")'
        },
        siteName: {
          type: 'string',
          description: 'Official site or brand name (optional)'
        },
        description: {
          type: 'string',
          description: 'Brief description of the brand/product for LLM summarization (optional)'
        },
        industry: {
          type: 'string',
          description: 'Industry category, e.g. "SaaS", "E-commerce", "InsurTech" (optional)'
        },
        outputDirectory: {
          type: 'string',
          description: 'Custom output folder path (defaults to ./ai-readiness-dist/<domain>)'
        }
      },
      required: ['domain']
    }
  },
  {
    name: 'get_universal_edge_tag',
    description: 'Returns the 1-line self-hostable AnswerIndex Universal Edge Tag snippet and installation guides for WordPress, Shopify, Webflow, and React/Next.js.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Target website domain (e.g. "example.com")'
        }
      },
      required: ['domain']
    }
  },
  {
    name: 'predict_query_fanout',
    description: 'Predicts how search-augmented LLMs (ChatGPT Search, Perplexity Pro) fan out and rewrite user buyer queries into background sub-queries.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Primary commercial or buyer search query'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'list_ai_crawlers',
    description: 'List known major AI search bots, crawlers, and retrieval agents (GPTBot, ClaudeBot, PerplexityBot, etc.) with their permissions and purposes.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_llms_txt_spec',
    description: 'Returns the standard llms.txt and ai.txt specification for AI readiness and Answer Engine Optimization (AEO).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_anti_hallucination_spec',
    description: 'Returns the official AnswerIndex AI Hallucination Correction & Knowledge Alignment specification (Discrepancy Triage, 45-60w Direct-Answer contrast block, llms.txt truth block, high-precision JSON-LD, and crawler remediation plan).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

function handleRpcRequest(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'answerindex-mcp-server',
          version: '3.3.0'
        }
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params;

    if (name === 'generate_ai_readiness_kit') {
      try {
        const result = generateAllReadinessFiles({
          domain: args.domain,
          siteName: args.siteName,
          description: args.description,
          industry: args.industry,
          outDir: args.outputDirectory
        });

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `Successfully generated AI Readiness Kit for "${args.domain}"!\nFiles written to: ${result.targetDir}\n\nGenerated files:\n${result.files.map(f => `- ${f.filename}`).join('\n')}`
              }
            ]
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32603, message: err.message }
        };
      }
    }

    if (name === 'get_universal_edge_tag') {
      const clean = (args.domain || 'yourwebsite.com').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
      const brand = clean.split('.')[0];
      const snippet = `<!-- Answer Index AEO Tag -->\n<script async src="https://answerindex.xyz/client/${brand}.js"></script>\n<!-- End Answer Index Tag -->`;
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `AnswerIndex Universal Edge Tag for "${clean}":\n\n${snippet}\n\nPaste immediately after opening <head> on WordPress, Shopify (theme.liquid), Webflow, or Next.js.`
            }
          ]
        }
      };
    }

    if (name === 'predict_query_fanout') {
      const q = args.query || '';
      const words = q.toLowerCase().split(/\s+/).filter(w => !['the', 'a', 'is', 'for', 'in', 'and', 'of'].includes(w));
      const core = words.slice(0, 3).join(' ');
      const text = `Predicted AI Search Query Fan-Out for: "${q}":\n\n` +
        `1. [Perplexity Pro]     ↳ "${core} pricing breakdown and plans"\n` +
        `2. [ChatGPT Search]     ↳ "${core} customer reviews vs alternatives"\n` +
        `3. [Google AI Overview] ↳ "${core} feature comparison matrix 2026"\n` +
        `4. [Claude 3.7 Ground]  ↳ "is ${core} trustworthy architecture review"\n\n` +
        `Recommended Keywords to inject into Direct Answer passages:\n` +
        `+ Added: [pricing, alternatives, comparison, review, vs]\n` +
        `- Dropped: [best, cheap, quick, simple]`;

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text
            }
          ]
        }
      };
    }

    if (name === 'list_ai_crawlers') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(KNOWN_AI_CRAWLERS, null, 2)
            }
          ]
        }
      };
    }

    if (name === 'get_llms_txt_spec') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Standard llms.txt & ai.txt specification for AI Readiness:\n\n- /llms.txt: Curated, human-and-machine-readable Markdown file exposing core brand facts, architecture, and official URLs.\n- /llms-full.txt: Complete unabbreviated corpus for LLM deep grounding.\n- /ai-sitemap.xml: Sitemap prioritized with entity metadata and change frequencies for AI crawlers (GPTBot, ClaudeBot, PerplexityBot).\n\nGenerate automatically with: npx answerindex ready <yourdomain.com>`
            }
          ]
        }
      };
    }

    if (name === 'get_anti_hallucination_spec') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `AnswerIndex Anti-Hallucination & AI Knowledge Alignment Protocol:\n\n1. Discrepancy Triage: Audit prompt outputs from ChatGPT, Claude, and Perplexity for factual errors.\n2. Direct-Answer Contrast Block: Add 45-60 word explicit Q&A entity definitions under H2/H3 tags.\n3. Brand Truth Wiki: Maintain high-authority /llms.txt truth document.\n4. Edge Ingestion: Inject validated JSON-LD schema dynamically.`
            }
          ]
        }
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Tool "${name}" not found.` }
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32600, message: `Unsupported method "${method}".` }
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const request = JSON.parse(trimmed);
    const response = handleRpcRequest(request);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: ' + err.message }
    }) + '\n');
  }
});
