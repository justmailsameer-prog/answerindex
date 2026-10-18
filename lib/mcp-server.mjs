#!/usr/bin/env node
/**
 * AnswerIndex MCP Server
 * Exposes AnswerIndex AEO benchmark, AI readiness kit generator, and SEO audit tools via standard Model Context Protocol (stdio).
 */
import readline from 'readline';
import { generateAllReadinessFiles, KNOWN_AI_CRAWLERS } from './readiness-generator.mjs';

const TOOLS = [
  {
    name: 'generate_ai_readiness_kit',
    description: 'Generate a production-ready suite of AI readiness files (robots.txt, ai.txt, llms.txt, llms-full.txt, ai-entities.json, ai-intent.json, ai-schema.json, ai-sitemap.xml) for any domain.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'The target website domain (e.g. "example.com" or "answerindex.com")'
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
          version: '1.0.0'
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
          result: {
            isError: true,
            content: [{ type: 'text', text: `Failed to generate AI readiness files: ${err.message}` }]
          }
        };
      }
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
              text: `Standard llms.txt & ai.txt specification:\n- llms.txt lives at the website root: https://example.com/llms.txt\n- Formatted in Markdown, provides concise site summaries and curated canonical links for LLMs.\n- llms-full.txt contains the complete un-truncated text knowledge corpus for context injection.\n- ai.txt communicates explicit bot policies, answer extraction consent, and canonical manifests.\n- robots.txt should explicitly declare permissions for GPTBot, ClaudeBot, PerplexityBot, and Applebot-Extended.`
            }
          ]
        }
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Tool not found: ${name}` }
    };
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', line => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const req = JSON.parse(trimmed);
    const res = handleRpcRequest(req);
    if (res) {
      process.stdout.write(JSON.stringify(res) + '\n');
    }
  } catch (err) {
    process.stderr.write(`Error parsing JSON-RPC: ${err.message}\n`);
  }
});
