/**
 * Answer Index — Client Portal & Multi-Platform Delivery Controller
 * Handles client login, platform selection (GitHub, WordPress, Shopify, Magento, Web Portal),
 * and D1 database synchronization.
 */

(function () {
  let selectedPlatform = 'wordpress'; // Default friendly platform for CMS users

  function initPortalModal() {
    if (document.getElementById('answerIndexAuthModal')) return;

    const modalHtml = `
      <div id="answerIndexAuthModal" class="auth-modal-overlay" onclick="handleBackdropClick(event)">
        <div class="auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
          <button class="auth-modal-close" onclick="closeClientAuthModal()" aria-label="Close modal">✕</button>

          <div class="auth-header">
            <div class="auth-badge">⚡ Client Portal &amp; Daily Dispatch</div>
            <h2 id="authModalTitle" class="auth-title">Access Your Answer Engine</h2>
            <p class="auth-subtitle">
              Review daily AEO answers, approve schema refactors, and sync directly to WordPress, Shopify, Magento, or GitHub.
            </p>
          </div>

          <div class="auth-tabs">
            <button type="button" class="auth-tab-btn active" id="tabBtnLogin" onclick="switchAuthTab('login')">
              🔑 Client Sign In
            </button>
            <button type="button" class="auth-tab-btn" id="tabBtnRegister" onclick="switchAuthTab('register')">
              🚀 Onboard New Site
            </button>
          </div>

          <!-- TAB 1: Existing Client Sign In -->
          <div class="auth-tab-content active" id="tabContentLogin">
            <form onsubmit="handleClientLogin(event)">
              <div class="form-group">
                <label class="form-label" for="loginEmail">Work Email Address <span class="req">*</span></label>
                <input
                  type="email"
                  id="loginEmail"
                  class="form-input"
                  placeholder="you@company.com"
                  required
                  autocomplete="email"
                />
              </div>

              <button type="submit" class="btn-auth-submit" id="btnLoginSubmit">
                Open Client Dashboard →
              </button>

              <div id="loginMsg" class="auth-msg"></div>
            </form>

            <div class="demo-logins-box">
              <div class="demo-title">
                <span>Or explore live platform demos:</span>
                <span style="color: #38bdf8;">1-Click Access</span>
              </div>
              <div class="demo-pills">
                <button type="button" class="demo-pill-btn" onclick="quickDemoLogin('client@shopify-store.com')">
                  <span class="demo-pill-platform">🛍️ Shopify Merchant · Nordic Style</span>
                  <span class="demo-pill-email">client@shopify-store.com</span>
                </button>
                <button type="button" class="demo-pill-btn" onclick="quickDemoLogin('editor@wordpress-brand.com')">
                  <span class="demo-pill-platform">🌐 WordPress Publisher · FinTech Weekly</span>
                  <span class="demo-pill-email">editor@wordpress-brand.com</span>
                </button>
                <button type="button" class="demo-pill-btn" onclick="quickDemoLogin('sameer@answerindex.com')">
                  <span class="demo-pill-platform">🐙 GitHub Developer · Answer Index Core</span>
                  <span class="demo-pill-email">sameer@answerindex.com</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 2: Onboard New Site (Platform Selector) -->
          <div class="auth-tab-content" id="tabContentRegister">
            <form onsubmit="handleClientRegister(event)">
              <div class="form-group">
                <label class="form-label" for="regEmail">Work Email Address <span class="req">*</span></label>
                <input
                  type="email"
                  id="regEmail"
                  class="form-input"
                  placeholder="founder@yourcompany.com"
                  required
                />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group">
                  <label class="form-label" for="regDomain">Website Domain <span class="req">*</span></label>
                  <input
                    type="text"
                    id="regDomain"
                    class="form-input"
                    placeholder="yourdomain.com"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label" for="regBrand">Brand / Company Name</label>
                  <input
                    type="text"
                    id="regBrand"
                    class="form-input"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <!-- Item 2: Platform Selector -->
              <div class="form-group">
                <label class="form-label">
                  Choose Content Delivery Channel <span class="req">*</span>
                </label>
                <div class="platform-grid">
                  
                  <!-- WordPress -->
                  <div class="platform-card selected" id="card-wordpress" onclick="selectPlatform('wordpress')">
                    <div class="platform-card-header">
                      <div class="platform-icon-title">
                        <span>🌐</span>
                        <span>WordPress</span>
                      </div>
                      <div class="platform-radio"></div>
                    </div>
                    <div class="platform-desc">
                      Staged as Draft Posts &amp; FAQ blocks in WP Admin via REST API. Zero coding needed.
                    </div>
                  </div>

                  <!-- Shopify -->
                  <div class="platform-card" id="card-shopify" onclick="selectPlatform('shopify')">
                    <div class="platform-card-header">
                      <div class="platform-icon-title">
                        <span>🛍️</span>
                        <span>Shopify</span>
                      </div>
                      <div class="platform-radio"></div>
                    </div>
                    <div class="platform-desc">
                      Draft Blog articles &amp; Product Q&amp;A Metafields via Shopify Admin API.
                    </div>
                  </div>

                  <!-- GitHub -->
                  <div class="platform-card" id="card-github" onclick="selectPlatform('github')">
                    <div class="platform-card-header">
                      <div class="platform-icon-title">
                        <span>🐙</span>
                        <span>GitHub PRs</span>
                      </div>
                      <div class="platform-radio"></div>
                    </div>
                    <div class="platform-desc">
                      Daily automated Pull Requests with markdown &amp; Schema.org to your branch.
                    </div>
                  </div>

                  <!-- Magento -->
                  <div class="platform-card" id="card-magento" onclick="selectPlatform('magento')">
                    <div class="platform-card-header">
                      <div class="platform-icon-title">
                        <span>📦</span>
                        <span>Magento</span>
                      </div>
                      <div class="platform-radio"></div>
                    </div>
                    <div class="platform-desc">
                      Staged PageBuilder CMS blocks &amp; XML via Magento 2 REST API.
                    </div>
                  </div>

                  <!-- Web Portal / Email -->
                  <div class="platform-card" id="card-portal" onclick="selectPlatform('portal')" style="grid-column: 1 / -1;">
                    <div class="platform-card-header">
                      <div class="platform-icon-title">
                        <span>💻</span>
                        <span>Web Portal &amp; 1-Click Copy</span>
                      </div>
                      <div class="platform-radio"></div>
                    </div>
                    <div class="platform-desc">
                      Review directly inside the Answer Index Dashboard. Copy HTML with 1-click or receive daily email digests.
                    </div>
                  </div>

                </div>
              </div>

              <div class="form-group" id="groupCmsUrl">
                <label class="form-label" for="regCmsUrl" id="labelCmsUrl">Admin or Store URL (Optional)</label>
                <input
                  type="text"
                  id="regCmsUrl"
                  class="form-input"
                  placeholder="https://yourdomain.com/wp-admin"
                />
              </div>

              <button type="submit" class="btn-auth-submit" id="btnRegSubmit">
                Create Client Workspace &amp; Dispatch Cadence 🚀
              </button>

              <div id="regMsg" class="auth-msg"></div>

              <p class="auth-safeguard-note">
                🔒 <strong>100% Human-in-the-Loop Safeguard:</strong> All content is staged as drafts. Nothing goes live on your website until you click Approve or publish.
              </p>
            </form>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // Open modal
  window.openClientAuthModal = function (tab = 'login') {
    initPortalModal();
    const modal = document.getElementById('answerIndexAuthModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      switchAuthTab(tab);
    }
  };

  // Close modal
  window.closeClientAuthModal = function () {
    const modal = document.getElementById('answerIndexAuthModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.handleBackdropClick = function (e) {
    if (e.target && e.target.id === 'answerIndexAuthModal') {
      closeClientAuthModal();
    }
  };

  // Switch tabs
  window.switchAuthTab = function (tab) {
    const btnLogin = document.getElementById('tabBtnLogin');
    const btnReg = document.getElementById('tabBtnRegister');
    const contentLogin = document.getElementById('tabContentLogin');
    const contentReg = document.getElementById('tabContentRegister');

    if (!btnLogin || !btnReg) return;

    if (tab === 'register') {
      btnLogin.classList.remove('active');
      btnReg.classList.add('active');
      contentLogin.classList.remove('active');
      contentReg.classList.add('active');
      setTimeout(() => document.getElementById('regEmail')?.focus(), 50);
    } else {
      btnReg.classList.remove('active');
      btnLogin.classList.add('active');
      contentReg.classList.remove('active');
      contentLogin.classList.add('active');
      setTimeout(() => document.getElementById('loginEmail')?.focus(), 50);
    }
  };

  // Select platform
  window.selectPlatform = function (platform) {
    selectedPlatform = platform;
    const cards = ['wordpress', 'shopify', 'github', 'magento', 'portal'];
    cards.forEach(p => {
      const card = document.getElementById(`card-${p}`);
      if (card) {
        if (p === platform) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      }
    });

    const labelCmsUrl = document.getElementById('labelCmsUrl');
    const inputCmsUrl = document.getElementById('regCmsUrl');
    if (labelCmsUrl && inputCmsUrl) {
      if (platform === 'wordpress') {
        labelCmsUrl.textContent = 'WordPress Admin URL (Optional)';
        inputCmsUrl.placeholder = 'https://yourdomain.com/wp-admin';
      } else if (platform === 'shopify') {
        labelCmsUrl.textContent = 'Shopify Store Admin URL (Optional)';
        inputCmsUrl.placeholder = 'https://yourbrand.myshopify.com/admin';
      } else if (platform === 'github') {
        labelCmsUrl.textContent = 'GitHub Repository URL (Optional)';
        inputCmsUrl.placeholder = 'https://github.com/org/repo';
      } else if (platform === 'magento') {
        labelCmsUrl.textContent = 'Magento Admin URL (Optional)';
        inputCmsUrl.placeholder = 'https://yourdomain.com/admin';
      } else {
        labelCmsUrl.textContent = 'Reference Website URL (Optional)';
        inputCmsUrl.placeholder = 'https://yourdomain.com';
      }
    }
  };

  // Quick Demo Login
  window.quickDemoLogin = function (email) {
    const input = document.getElementById('loginEmail');
    if (input) {
      input.value = email;
      handleClientLogin(new Event('submit'));
    }
  };

  // Login handler
  window.handleClientLogin = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const msg = document.getElementById('loginMsg');
    const btn = document.getElementById('btnLoginSubmit');

    const email = emailInput?.value.trim();
    if (!email) return;

    btn.disabled = true;
    btn.textContent = 'Connecting to Cloudflare D1...';
    msg.className = 'auth-msg';
    msg.style.display = 'none';

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email })
      });

      const data = await res.json();
      if (data.success && data.user) {
        msg.className = 'auth-msg success';
        msg.textContent = '✓ Verified! Loading your client dashboard...';
        msg.style.display = 'block';

        localStorage.setItem('answerindex_user', JSON.stringify(data.user));
        if (data.activeProject) {
          localStorage.setItem('answerindex_project', JSON.stringify(data.activeProject));
        }

        const projectId = data.activeProject ? data.activeProject.id : '';
        setTimeout(() => {
          window.location.href = `dashboard.html?email=${encodeURIComponent(data.user.email)}&project_id=${encodeURIComponent(projectId)}`;
        }, 600);
      } else {
        msg.className = 'auth-msg error';
        msg.innerHTML = `⚠️ ${data.error || 'Account not found.'} <a href="javascript:void(0)" onclick="switchAuthTab('register')" style="color:#60a5fa; text-decoration:underline; font-weight:700;">Onboard your site now →</a>`;
        msg.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Open Client Dashboard →';
      }
    } catch (err) {
      msg.className = 'auth-msg error';
      msg.textContent = '⚠️ Network error connecting to Cloudflare Edge API.';
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Open Client Dashboard →';
    }
  };

  // Register handler
  window.handleClientRegister = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById('regEmail')?.value.trim();
    const domain = document.getElementById('regDomain')?.value.trim();
    const brand = document.getElementById('regBrand')?.value.trim();
    const cmsUrl = document.getElementById('regCmsUrl')?.value.trim();
    const msg = document.getElementById('regMsg');
    const btn = document.getElementById('btnRegSubmit');

    if (!email || !domain) return;

    btn.disabled = true;
    btn.textContent = 'Provisioning Autonomous Queue in D1...';
    msg.className = 'auth-msg';
    msg.style.display = 'none';

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          domain,
          brand_name: brand || domain,
          cms_type: selectedPlatform,
          cms_url: cmsUrl,
          plan_tier: 'pro_autonomous'
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        msg.className = 'auth-msg success';
        msg.textContent = `✓ Workspace created! Staging your first daily AEO jobs for ${selectedPlatform.toUpperCase()}...`;
        msg.style.display = 'block';

        localStorage.setItem('answerindex_user', JSON.stringify(data.user));
        if (data.project) {
          localStorage.setItem('answerindex_project', JSON.stringify(data.project));
        }

        setTimeout(() => {
          const projId = data.project ? data.project.id : '';
          window.location.href = `dashboard.html?email=${encodeURIComponent(data.user.email)}&project_id=${encodeURIComponent(projId)}`;
        }, 800);
      } else {
        msg.className = 'auth-msg error';
        msg.textContent = `⚠️ ${data.error || 'Failed to create workspace.'}`;
        msg.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Create Client Workspace & Dispatch Cadence 🚀';
      }
    } catch (err) {
      msg.className = 'auth-msg error';
      msg.textContent = '⚠️ Network error connecting to Cloudflare Edge API.';
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Create Client Workspace & Dispatch Cadence 🚀';
    }
  };

  // Keyboard shortcut: ESC closes modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeClientAuthModal();
    }
  });

  // Ready on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalModal);
  } else {
    initPortalModal();
  }
})();
