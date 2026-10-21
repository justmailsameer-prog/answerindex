// Cloudflare Pages Function: /api/jobs
// Manages the Autonomous Dispatch Queue:
// - Job 1: New AEO Answer Asset
// - Job 2: Technical Schema / Latency Refactor
// - Interactive Mini-Tools (Calculators / Utility Widgets)
// - AEO Comparison Guides ("Brand vs Competitor")
// - Digital PR Citation Corrections

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
    const status = url.searchParams.get('status');
    const jobType = url.searchParams.get('job_type');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let query = `SELECT * FROM daily_jobs`;
    const conditions = [];
    const bindings = [];

    if (projectId) {
      conditions.push(`project_id = ?`);
      bindings.push(projectId);
    }
    if (status) {
      conditions.push(`pr_status = ?`);
      bindings.push(status);
    }
    if (jobType) {
      conditions.push(`job_type = ?`);
      bindings.push(jobType);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY date DESC, created_at DESC LIMIT ?`;
    bindings.push(limit);

    const stmt = env.DB.prepare(query);
    const { results } = await stmt.bind(...bindings).all();

    return new Response(
      JSON.stringify({ success: true, count: results.length, jobs: results }),
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
      date = new Date().toISOString().split('T')[0],
      job_type,
      title,
      description = '',
      target_keyword = '',
      target_url = '',
      pr_url = '',
      pr_number = null,
      pr_status = 'pending',
      schema_score = 100,
      diff_summary = '',
      diff_details = '',
      zero_click_snippet = '',
      delivery_channel = 'github_pr',
      content_html = '',
      is_truth_verified = 1,
      scheduled_at = null,
      dispatched_at = new Date().toISOString()
    } = data;

    if (!project_id || !job_type || !title) {
      return new Response(
        JSON.stringify({ success: false, error: 'project_id, job_type, and title are required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await env.DB.prepare(
      `INSERT INTO daily_jobs (
        id, project_id, date, job_type, title, description, target_keyword, target_url,
        pr_url, pr_number, pr_status, schema_score, diff_summary, diff_details,
        zero_click_snippet, delivery_channel, content_html, is_truth_verified, scheduled_at, dispatched_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, project_id, date, job_type, title, description, target_keyword, target_url,
      pr_url, pr_number, pr_status, schema_score, diff_summary, diff_details,
      zero_click_snippet, delivery_channel, content_html, is_truth_verified, scheduled_at, dispatched_at
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        job_id: id,
        message: 'Daily job queued successfully'
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
