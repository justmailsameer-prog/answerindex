// Cloudflare Pages Function: /api/citations/eval
// Evaluates raw AI engine text through the AEO Judge Engine and logs observability metrics to D1

import { evaluateWithJudge } from '../../_shared/ai-judge.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const {
      project_id,
      prompt_id = null,
      engine = 'perplexity',
      query,
      raw_response,
      brand_name,
      domain,
      brand_aliases = [],
      competitors = [],
      cited_urls = []
    } = data;

    if (!project_id || !query || !raw_response || !brand_name || !domain) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'project_id, query, raw_response, brand_name, and domain are required.'
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Run evaluation through Judge engine
    const evaluation = await evaluateWithJudge({
      env,
      rawResponse: raw_response,
      brandName: brand_name,
      domain,
      brandAliases: brand_aliases,
      competitors,
      citedUrls: cited_urls
    });

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 2. Persist to D1 ai_citation_runs
    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO ai_citation_runs (
            id, project_id, prompt_id, engine, query,
            brand_mentioned, brand_position, sentiment,
            passage_quote, cited_urls, competitors_cited,
            judge_model, share_of_voice_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          runId,
          project_id,
          prompt_id,
          engine,
          query,
          evaluation.brandMentioned,
          evaluation.brandPosition,
          evaluation.sentiment,
          evaluation.passageQuote,
          JSON.stringify(cited_urls),
          JSON.stringify(evaluation.detectedCompetitors),
          evaluation.judgeModel,
          evaluation.shareOfVoice
        ).run();
      } catch (dbErr) {
        console.warn('D1 ai_citation_runs insert warning:', dbErr.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        run_id: runId,
        evaluation: {
          brand_mentioned: evaluation.brandMentioned === 1,
          brand_position: evaluation.brandPosition,
          sentiment: evaluation.sentiment,
          passage_quote: evaluation.passageQuote,
          detected_competitors: evaluation.detectedCompetitors,
          share_of_voice: evaluation.shareOfVoice + '%',
          judge_model: evaluation.judgeModel
        }
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
