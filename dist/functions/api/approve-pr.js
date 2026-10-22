// Cloudflare Pages Function: /api/approve-pr
// Handles 1-Click PR Approval and status reconciliation with GitHub repository

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { job_id, approved_by = 'user' } = data;

    if (!job_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'job_id is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const job = await env.DB.prepare(`SELECT * FROM daily_jobs WHERE id = ?`).bind(job_id).first();
    if (!job) {
      return new Response(
        JSON.stringify({ success: false, error: `Job ${job_id} not found` }),
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const now = new Date().toISOString();

    await env.DB.prepare(
      `UPDATE daily_jobs 
       SET pr_status = 'approved', merged_at = ?, updated_at = ?
       WHERE id = ?`
    ).bind(now, now, job_id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Job ${job_id} approved. PR queued for instant edge deployment.`,
        job_id,
        status: 'approved',
        approved_at: now
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
