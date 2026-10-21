// Cloudflare Pages Function: /api/project
// Returns connected project details, repo connection status, active plan tier,
// and the Brand Ground-Truth Document for anti-hallucination compliance.

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
      ).bind('proj_shopify_demo').first();
      
      // Fallback to proj_dev_core or first available if demo not found
      if (!project) {
        project = await env.DB.prepare(
          `SELECT p.*, u.email as owner_email, u.name as owner_name, u.plan_tier, u.subscription_status
           FROM projects p
           JOIN users u ON p.user_id = u.id
           LIMIT 1`
        ).first();
      }
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
          truth_document: project.truth_document || '',
          truth_updated_at: project.truth_updated_at || null,
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

// POST: Update project metadata or Ground-Truth Brand Wiki
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json().catch(() => ({}));
    const { projectId, truth_document, cms_type, cms_url, brand_name } = data;

    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, error: 'projectId is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const updates = [];
    const bindings = [];

    if (truth_document !== undefined) {
      updates.push('truth_document = ?');
      bindings.push(truth_document);
      updates.push('truth_updated_at = ?');
      bindings.push(new Date().toISOString());
    }

    if (cms_type !== undefined) {
      updates.push('cms_type = ?');
      bindings.push(cms_type);
    }

    if (cms_url !== undefined) {
      updates.push('cms_url = ?');
      bindings.push(cms_url);
    }

    if (brand_name !== undefined) {
      updates.push('brand_name = ?');
      bindings.push(brand_name);
    }

    if (updates.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No fields provided for update' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    bindings.push(projectId);
    const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;

    await env.DB.prepare(sql).bind(...bindings).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Project updated successfully',
        updated_at: new Date().toISOString()
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
