// Cloudflare Pages Function: /api/project
// Returns connected project details, repo connection status, and active plan tier

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
    const projectId = url.searchParams.get('id');
    const email = url.searchParams.get('email');

    let project = null;

    if (email) {
      project = await env.DB.prepare(
        `SELECT p.*, u.email as owner_email, u.name as owner_name, u.plan_tier, u.subscription_status
         FROM projects p
         JOIN users u ON p.user_id = u.id
         WHERE lower(u.email) = lower(?)
         ORDER BY p.created_at DESC`
      ).bind(email.trim()).first();
    } else if (projectId) {
      project = await env.DB.prepare(
        `SELECT p.*, u.email as owner_email, u.name as owner_name, u.plan_tier, u.subscription_status
         FROM projects p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`
      ).bind(projectId).first();
    } else {
      project = await env.DB.prepare(
        `SELECT p.*, u.email as owner_email, u.name as owner_name, u.plan_tier, u.subscription_status
         FROM projects p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`
      ).bind('proj_answerindex_core').first();
    }

    if (!project) {
      return new Response(
        JSON.stringify({ success: false, error: 'Project not found' }),
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Get job stats
    const jobStats = await env.DB.prepare(
      `SELECT 
         count(*) as total_jobs,
         sum(CASE WHEN pr_status = 'approved' OR pr_status = 'merged' THEN 1 ELSE 0 END) as approved_jobs,
         sum(CASE WHEN pr_status = 'pending' THEN 1 ELSE 0 END) as pending_jobs,
         avg(schema_score) as avg_schema_score
       FROM daily_jobs WHERE project_id = ?`
    ).bind(project.id).first();

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          id: project.id,
          domain: project.domain,
          brand_name: project.brand_name,
          repo_owner: project.repo_owner,
          repo_name: project.repo_name,
          branch: project.branch,
          cms_type: project.cms_type || 'github',
          cms_url: project.cms_url || '',
          owner_email: project.owner_email,
          owner_name: project.owner_name,
          plan_tier: project.plan_tier,
          subscription_status: project.subscription_status,
          status: project.status
        },
        stats: {
          total_jobs: jobStats ? (jobStats.total_jobs || 0) : 0,
          approved_jobs: jobStats ? (jobStats.approved_jobs || 0) : 0,
          pending_jobs: jobStats ? (jobStats.pending_jobs || 0) : 0,
          avg_schema_score: Math.round(jobStats && jobStats.avg_schema_score ? jobStats.avg_schema_score : 100)
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
