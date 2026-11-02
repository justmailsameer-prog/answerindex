// Cloudflare Pages Function: /api/admin/clients
// Secure Founder Admin View to inspect all registered users, connected domains, and job counts in Cloudflare D1.
// Protected by master founder passcode (88888888).

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Passcode',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const passcode = url.searchParams.get('passcode') || request.headers.get('X-Admin-Passcode');

    // Founder master passcode verification
    if (passcode !== '88888888') {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid Admin Passcode' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cloudflare D1 database binding (env.DB) not found'
        }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Query all users and their linked projects from Cloudflare D1
    const { results: users } = await env.DB.prepare(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.plan_tier,
        u.subscription_status,
        u.created_at,
        p.id as project_id,
        p.domain,
        p.brand_name,
        p.cms_type,
        p.branch,
        p.created_at as project_created_at
      FROM users u
      LEFT JOIN projects p ON p.user_id = u.id
      ORDER BY u.created_at DESC
      LIMIT 100
    `).all();

    // Query job approval summary
    const { results: jobStats } = await env.DB.prepare(`
      SELECT 
        project_id,
        COUNT(*) as total_jobs,
        SUM(CASE WHEN pr_status = 'approved' OR pr_status = 'merged' THEN 1 ELSE 0 END) as approved_jobs
      FROM daily_jobs
      GROUP BY project_id
    `).all();

    const statsMap = {};
    if (jobStats) {
      jobStats.forEach(st => {
        if (st.project_id) statsMap[st.project_id] = st;
      });
    }

    // Format registry output
    const clientList = (users || []).map(u => {
      const stats = statsMap[u.project_id] || { total_jobs: 0, approved_jobs: 0 };
      return {
        userId: u.id,
        email: u.email,
        name: u.name || u.email.split('@')[0],
        planTier: u.plan_tier || 'pro_autonomous',
        status: u.subscription_status || 'active',
        domain: u.domain || 'N/A',
        brandName: u.brand_name || u.domain || 'N/A',
        cmsType: u.cms_type || 'wordpress',
        createdAt: u.created_at || 'Recently',
        approvedJobs: stats.approved_jobs || 0,
        totalJobs: stats.total_jobs || 0
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        count: clientList.length,
        timestamp: new Date().toISOString(),
        clients: clientList
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

