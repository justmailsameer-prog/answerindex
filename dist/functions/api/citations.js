// Cloudflare Pages Function: /api/citations
// Returns AI Citation telemetry and benchmarks across Perplexity, ChatGPT Search, Claude, and Gemini

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('project_id');
    const engine = url.searchParams.get('engine');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let query = `SELECT * FROM citation_benchmarks`;
    const conditions = [];
    const bindings = [];

    if (projectId) {
      conditions.push(`project_id = ?`);
      bindings.push(projectId);
    }
    if (engine) {
      conditions.push(`engine = ?`);
      bindings.push(engine);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY timestamp DESC LIMIT ?`;
    bindings.push(limit);

    const { results } = await env.DB.prepare(query).bind(...bindings).all();

    // Query recent AI citation runs if table exists
    let observabilityRuns = [];
    try {
      let obsQuery = `SELECT * FROM ai_citation_runs`;
      const obsCond = [];
      const obsBind = [];
      if (projectId) { obsCond.push(`project_id = ?`); obsBind.push(projectId); }
      if (engine) { obsCond.push(`engine = ?`); obsBind.push(engine); }
      if (obsCond.length > 0) obsQuery += ` WHERE ` + obsCond.join(' AND ');
      obsQuery += ` ORDER BY created_at DESC LIMIT ?`;
      obsBind.push(limit);
      const obsRes = await env.DB.prepare(obsQuery).bind(...obsBind).all();
      observabilityRuns = obsRes.results || [];
    } catch(e) {}

    // Calculate aggregated stats
    const total = results.length;
    const citedCount = results.filter(r => r.cited === 1).length;
    const citationRate = total > 0 ? ((citedCount / total) * 100).toFixed(1) + '%' : '0.0%';

    // Calculate AEO radar metrics (SOV, sentiment breakdown, average position)
    let avgPosition = 0;
    let avgSov = 0;
    let positiveCount = 0;
    if (observabilityRuns.length > 0) {
      const rankedRuns = observabilityRuns.filter(r => r.brand_position > 0);
      if (rankedRuns.length > 0) {
        avgPosition = +(rankedRuns.reduce((acc, r) => acc + r.brand_position, 0) / rankedRuns.length).toFixed(1);
      }
      avgSov = +(observabilityRuns.reduce((acc, r) => acc + (r.share_of_voice_score || 0), 0) / observabilityRuns.length).toFixed(1);
      positiveCount = observabilityRuns.filter(r => r.sentiment === 'positive').length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_benchmarks: total,
          cited_count: citedCount,
          citation_rate: citationRate,
          ai_radar_metrics: {
            total_runs: observabilityRuns.length,
            average_position: avgPosition,
            average_share_of_voice: avgSov + '%',
            positive_sentiment_rate: observabilityRuns.length > 0 ? Math.round((positiveCount / observabilityRuns.length) * 100) + '%' : '0%'
          },
          radar_metrics: {
            total_runs: observabilityRuns.length,
            average_position: avgPosition,
            average_share_of_voice: avgSov + '%',
            positive_sentiment_rate: observabilityRuns.length > 0 ? Math.round((positiveCount / observabilityRuns.length) * 100) + '%' : '0%'
          }
        },
        benchmarks: results,
        observability_runs: observabilityRuns
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

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const {
      project_id,
      engine,
      query,
      cited = 0,
      position = null,
      answer_snippet = '',
      competitors = '[]'
    } = data;

    if (!project_id || !engine || !query) {
      return new Response(
        JSON.stringify({ success: false, error: 'project_id, engine, and query are required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const id = `cite_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await env.DB.prepare(
      `INSERT INTO citation_benchmarks (
        id, project_id, engine, query, cited, position, answer_snippet, competitors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, project_id, engine, query, cited, position, answer_snippet,
      typeof competitors === 'string' ? competitors : JSON.stringify(competitors)
    ).run();

    return new Response(
      JSON.stringify({ success: true, id, message: 'Citation benchmark recorded' }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
