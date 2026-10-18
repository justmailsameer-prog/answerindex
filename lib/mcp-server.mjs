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
  },
  {
    name: 'get_execution_engine_spec',
    description: 'Returns the official AnswerIndex 5-Phase Sequential Deliverable Pipeline specification (Phase 1 NER & Entity Modeling, Phase 2 Structural Schema, Phase 3 AEO Snippets, Phase 4 GEO & Vector Chunks, Phase 5 Verification Checklist).',
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

    if (name === 'get_execution_engine_spec') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `AnswerIndex 5-Phase Sequential Deliverable Pipeline:\n\n1. Phase 1: Content Extraction & Entity Modeling (Foundation)\n   - Corpus Ingestion & Cleansing\n   - Knowledge Graph & Named Entity Recognition (NER) mapped to Wikidata/Schema\n   - Intent Categorization (Informational, Navigational, Commercial, Direct Problem-Solving)\n\n2. Phase 2: Structural Schema & Technical SEO\n   - Rich JSON-LD Generation (TechArticle, FAQPage, SoftwareApplication, Organization with sameAs)\n   - Metadata & Crawlability Blueprint (High-CTR titles <60 chars, meta <155 chars, canonicals, robots directives)\n\n3. Phase 3: Answer Engine Optimization (AEO Architecture)\n   - Zero-Click & Direct-Answer Formatting (40–55 word direct-answer snippet placed top-of-section)\n   - Question-to-Answer Parity (Exact <h2>/<h3> matching, scrapeable markdown tables & numbered steps)\n\n4. Phase 4: Generative Engine Optimization (GEO & LLM Retrieval)\n   - Modular 250–400 Token Semantic Chunking for dense vector retrieval (RAG)\n   - Authoritative Evidence, quotable benchmarks, and elimination of marketing fluff\n\n5. Phase 5: Verification & Delivery Checklist\n   - Final clean Markdown deliverable (Zero-click snippet, Entity Graph, AEO Content, JSON-LD script, GEO Chunks).`
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
              text: `AnswerIndex AI Hallucination Correction & Knowledge Alignment Specification:\n\n1. Discrepancy Classification & Source Triage:\n   - Temporal Lag (outdated pricing, deprecated features)\n   - Semantic Drift / Conflation (mixing with competitors)\n   - Pure Fabrication (answered into data void)\n   - Third-Party Poisoning (erroneous review sites or forums)\n\n2. Direct-Answer Grounding Snippet (AEO Defense):\n   - 45–60 word declarative block contrasting misconception:\n     "[Brand] is [Definition]. Contrary to outdated reports, [Brand] does not [Incorrect claim]; rather, it [Canonical truth]."\n\n3. Machine-Readable Grounding Assets:\n   - llms.txt truth block with canonical facts and primary source\n   - High-precision JSON-LD with immutable @id, disambiguatingDescription, knowsAbout, offers, and sameAs\n\n4. Crawler & Source Remediation Plan:\n   - [ ] First-Party Cleanup (replace contradictory PDFs/posts)\n   - [ ] Crawler Verification (audit robots.txt for AI bots)\n   - [ ] Third-Party Entity Recalibration (submit corrections to primary cited URLs).`
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
