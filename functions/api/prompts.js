// Cloudflare Pages Function: /api/prompts
// Manages tracked commercial queries for AEO/GEO observability (Elmo-style tracking)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
    const status = url.searchParams.get('status') || 'active';

    if (!env || !env.DB) {
      return new Response(
        JSON.stringify({ success: true, prompts: [] }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    let query = `SELECT * FROM tracked_prompts`;
    const conditions = [];
    const bindings = [];

    if (projectId) {
      conditions.push(`project_id = ?`);
      bindings.push(projectId);
    }
    if (status !== 'all') {
      conditions.push(`status = ?`);
      bindings.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const { results } = await env.DB.prepare(query).bind(...bindings).all();

    return new Response(
      JSON.stringify({
        success: true,
        count: results.length,
        prompts: results
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
    if (!env || !env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database binding not available' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const data = await request.json();
    const {
      project_id,
      query,
      category = 'commercial',
      frequency = 'daily',
      target_intent = 'evaluation'
    } = data;

    if (!project_id || !query) {
      return new Response(
        JSON.stringify({ success: false, error: 'project_id and query are required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const promptId = `prompt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await env.DB.prepare(
      `INSERT INTO tracked_prompts (id, project_id, query, category, frequency, target_intent, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`
    ).bind(promptId, project_id, query.trim(), category, frequency, target_intent).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prompt registered for automated AEO tracking',
        prompt: {
          id: promptId,
          project_id,
          query: query.trim(),
          category,
          frequency,
          target_intent,
          status: 'active'
        }
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const url = new URL(request.url);
    const promptId = url.searchParams.get('id');

    if (!promptId) {
      return new Response(
        JSON.stringify({ success: false, error: 'id query parameter is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await env.DB.prepare(
      `UPDATE tracked_prompts SET status = 'archived' WHERE id = ?`
    ).bind(promptId).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Prompt archived from tracking' }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
