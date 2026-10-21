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

  /* =========================================================================
     OPTION A: 5-CLICK SECRET EASTER EGG ON "PRO" BADGE + PASSCODE 88888888
     Founder: Sameer Sharma (Answer Index)
     Secret Code: 88888888 (Eight times 8)
     Bypasses payment gateways and provisions free Enterprise workspaces.
     ========================================================================= */
  const VIP_SECRET_CODE = '88888888';
  let proBadgeClickCount = 0;
  let proBadgeClickTimer = null;

  window.isVipUnlocked = function () {
    try {
      return localStorage.getItem('answerindex_vip_unlocked') === VIP_SECRET_CODE;
    } catch (e) {
      return false;
    }
  };

  function initVipModals() {
    if (document.getElementById('vipPasscodeModal')) return;

    // 1. Passcode Verification Modal
    const passcodeModalHtml = `
      <div id="vipPasscodeModal" class="auth-modal-overlay" onclick="handleVipBackdropClick(event)">
        <div class="auth-modal-card" style="max-width: 480px; text-align: center; border: 1.5px solid #f59e0b; box-shadow: 0 0 35px rgba(245, 158, 11, 0.35);">
          <button class="auth-modal-close" onclick="closeVipPasscodeModal()" aria-label="Close modal">✕</button>
          
          <div style="font-size: 2.75rem; margin-bottom: 0.5rem; line-height: 1;">👑</div>
          <div style="display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 999px; text-transform: uppercase; font-family: monospace; margin-bottom: 0.75rem;">
            Founder &amp; Family Access
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Enter Secret Passcode</h3>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem;">
            You discovered the secret founder gateway. Enter the 8-digit authorization code to remove all paywalls and unlock complimentary Enterprise access.
          </p>

          <form onsubmit="handleVipPasscodeSubmit(event)">
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <input
                type="password"
                id="vipPasscodeInput"
                class="form-input"
                placeholder="••••••••"
                maxlength="16"
                style="text-align: center; font-size: 1.6rem; letter-spacing: 0.4em; font-family: monospace; border-color: rgba(245, 158, 11, 0.5); background: rgba(0,0,0,0.5); color: #fbbf24;"
                required
                autocomplete="off"
              />
            </div>
            <button type="submit" id="btnVerifyVip" class="btn-auth-submit" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 800; border: none; font-size: 0.95rem;">
              ⚡ Unlock VIP Access →
            </button>
            <div id="vipPasscodeMsg" class="auth-msg" style="display: none; margin-top: 1rem;"></div>
          </form>
          <div style="margin-top: 1.25rem; font-size: 0.75rem; color: #64748b;">
            Reserved for Sameer Sharma's internal sites, friends &amp; family.
          </div>
        </div>
      </div>
    `;

    // 2. VIP Complimentary Project Provisioning Modal
    const provisionModalHtml = `
      <div id="vipProvisionModal" class="auth-modal-overlay" onclick="handleVipProvisionBackdrop(event)">
        <div class="auth-modal-card" style="max-width: 580px; border: 1.5px solid #f59e0b; box-shadow: 0 0 35px rgba(245, 158, 11, 0.35);">
          <button class="auth-modal-close" onclick="closeVipProvisionModal()" aria-label="Close modal">✕</button>

          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="font-size: 2rem;">👑</div>
            <div>
              <div style="display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.6rem; border-radius: 999px; text-transform: uppercase; font-family: monospace;">
                VIP Complimentary Mode ($0)
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.2rem;">Provision VIP Workspace</h3>
            </div>
          </div>

          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.25rem;">
            Deploy an active <strong>Enterprise DFY Workspace</strong> with zero payment gateway fees. Seeds daily AEO answer assets and Brand Truth Wiki directly into Cloudflare D1.
          </p>

          <form onsubmit="handleVipProvisionSubmit(event)">
            <div class="form-group">
              <label class="form-label" for="vipEmail">Account Email Address <span class="req">*</span></label>
              <input
                type="email"
                id="vipEmail"
                class="form-input"
                placeholder="sameer-vip@answerindex.com"
                value="sameer-vip@answerindex.com"
                required
              />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label" for="vipDomain">Target Website Domain <span class="req">*</span></label>
                <input
                  type="text"
                  id="vipDomain"
                  class="form-input"
                  placeholder="mysite.com"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label" for="vipBrand">Brand / Portfolio Name</label>
                <input
                  type="text"
                  id="vipBrand"
                  class="form-input"
                  placeholder="My Portfolio"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Delivery Channel</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">
                <label style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem; font-size: 0.82rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="vipPlatform" value="portal" checked style="margin-right: 0.3rem;" /> ⚡ Portal
                </label>
                <label style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem; font-size: 0.82rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="vipPlatform" value="wordpress" style="margin-right: 0.3rem;" /> 🌐 WP
                </label>
                <label style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem; font-size: 0.82rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="vipPlatform" value="shopify" style="margin-right: 0.3rem;" /> 🛍️ Shopify
                </label>
                <label style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem; font-size: 0.82rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="vipPlatform" value="github" style="margin-right: 0.3rem;" /> 🐙 GitHub
                </label>
              </div>
            </div>

            <div style="background: rgba(245, 158, 11, 0.1); border: 1px dashed rgba(245, 158, 11, 0.4); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #fde68a;">
              ✨ <strong>VIP Complimentary Entitlement:</strong> Enterprise Tier ($1,499/mo value) billed at <strong>$0 / Free Forever</strong>. Includes anti-hallucination Brand Truth Wiki and daily dual-cadence staging.
            </div>

            <button type="submit" id="btnVipProvisionSubmit" class="btn-auth-submit" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 800; border: none; font-size: 0.95rem;">
              🚀 Provision Free VIP Project &amp; Open Dashboard →
            </button>
            <div id="vipProvisionMsg" class="auth-msg" style="display: none; margin-top: 1rem;"></div>
          </form>
        </div>
      </div>
    `;

    // 3. Top Banner
    const bannerHtml = `
      <div id="vipActiveBanner" class="vip-active-banner" style="display: none;">
        <div class="vip-banner-inner">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span>👑</span>
            <span><strong>VIP Founder Mode Active:</strong> All tiers 100% Free ($0) · Secret Passcode 88888888</span>
          </div>
          <div class="vip-banner-actions">
            <button class="btn-vip-banner-action" onclick="openVipProvisionModal()">
              ⚡ Launch VIP Site ($0)
            </button>
            <button class="btn-vip-exit" onclick="exitVipMode()" title="Restore normal public pricing">
              Exit VIP Mode ✕
            </button>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'vipEasterEggContainer';
    container.innerHTML = passcodeModalHtml + provisionModalHtml + bannerHtml;
    document.body.appendChild(container);
  }

  // 5-Click Handler on "PRO" badge or logo
  window.handleProBadgeEasterEggClick = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    proBadgeClickCount++;
    clearTimeout(proBadgeClickTimer);

    if (proBadgeClickCount >= 5) {
      proBadgeClickCount = 0;
      openVipPasscodeModal();
      return false;
    }

    if (proBadgeClickCount >= 2) {
      const remaining = 5 - proBadgeClickCount;
      console.log(`[Answer Index Easter Egg] ${proBadgeClickCount}/5 clicks detected (${remaining} more to unlock VIP mode)`);
    }

    proBadgeClickTimer = setTimeout(() => {
      proBadgeClickCount = 0;
    }, 2500); // 2.5-second reset window
    return false;
  };


  window.openVipPasscodeModal = function () {
    initVipModals();
    const modal = document.getElementById('vipPasscodeModal');
    const input = document.getElementById('vipPasscodeInput');
    const msg = document.getElementById('vipPasscodeMsg');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (msg) {
        msg.style.display = 'none';
        msg.className = 'auth-msg';
      }
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
      }
    }
  };

  window.closeVipPasscodeModal = function () {
    const modal = document.getElementById('vipPasscodeModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.handleVipBackdropClick = function (e) {
    if (e.target && e.target.id === 'vipPasscodeModal') {
      closeVipPasscodeModal();
    }
  };

  window.handleVipProvisionBackdrop = function (e) {
    if (e.target && e.target.id === 'vipProvisionModal') {
      closeVipProvisionModal();
    }
  };

  window.openVipProvisionModal = function (preferredTier = 'enterprise') {
    initVipModals();
    const modal = document.getElementById('vipProvisionModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('vipDomain')?.focus(), 150);
    }
  };

  window.closeVipProvisionModal = function () {
    const modal = document.getElementById('vipProvisionModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Verify Passcode: 88888888
  window.handleVipPasscodeSubmit = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('vipPasscodeInput');
    const msg = document.getElementById('vipPasscodeMsg');
    const btn = document.getElementById('btnVerifyVip');
    const card = input?.closest('.auth-modal-card');

    const enteredCode = (input?.value || '').trim();
    if (!enteredCode) return;

    btn.disabled = true;
    btn.textContent = 'Verifying Passcode...';

    // Verify locally first, and back up with edge API check
    if (enteredCode === VIP_SECRET_CODE) {
      try {
        localStorage.setItem('answerindex_vip_unlocked', VIP_SECRET_CODE);
      } catch (err) {}

      msg.className = 'auth-msg success';
      msg.textContent = '✓ Passcode Accepted! 88888888 verified. Unlocking VIP Founder Mode...';
      msg.style.display = 'block';

      setTimeout(() => {
        closeVipPasscodeModal();
        applyVipMode(true);
        if (typeof showToast === 'function') {
          showToast('👑 VIP Founder Mode Unlocked! All paywalls removed ($0 Free).');
        }
        btn.disabled = false;
        btn.textContent = '⚡ Unlock VIP Access →';
      }, 700);
    } else {
      card?.classList.add('vip-shake');
      setTimeout(() => card?.classList.remove('vip-shake'), 450);

      msg.className = 'auth-msg error';
      msg.textContent = '⚠️ Incorrect passcode. Access denied.';
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = '⚡ Unlock VIP Access →';
      input.select();
    }
  };

  // Submit Free Provisioning
  window.handleVipProvisionSubmit = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById('vipEmail')?.value.trim();
    const domain = document.getElementById('vipDomain')?.value.trim();
    const brand = document.getElementById('vipBrand')?.value.trim();
    const platformInput = document.querySelector('input[name="vipPlatform"]:checked');
    const platform = platformInput ? platformInput.value : 'portal';
    const msg = document.getElementById('vipProvisionMsg');
    const btn = document.getElementById('btnVipProvisionSubmit');

    if (!email || !domain) return;

    btn.disabled = true;
    btn.textContent = '⚡ Provisioning Free Enterprise Workspace in D1...';
    msg.className = 'auth-msg';
    msg.style.display = 'none';

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          vip_code: VIP_SECRET_CODE,
          email,
          domain,
          brand_name: brand || domain,
          cms_type: platform,
          plan_tier: 'enterprise'
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        msg.className = 'auth-msg success';
        msg.textContent = '✓ VIP Workspace provisioned! Redirecting to your live dashboard...';
        msg.style.display = 'block';

        localStorage.setItem('answerindex_user', JSON.stringify(data.user));
        if (data.project) {
          localStorage.setItem('answerindex_project', JSON.stringify(data.project));
        }

        setTimeout(() => {
          const projId = data.project ? data.project.id : '';
          window.location.href = `dashboard.html?email=${encodeURIComponent(data.user.email)}&project_id=${encodeURIComponent(projId)}&vip=true`;
        }, 800);
      } else {
        msg.className = 'auth-msg error';
        msg.textContent = `⚠️ ${data.error || 'Provisioning failed.'}`;
        msg.style.display = 'block';
        btn.disabled = false;
        btn.textContent = '🚀 Provision Free VIP Project & Open Dashboard →';
      }
    } catch (err) {
      msg.className = 'auth-msg error';
      msg.textContent = '⚠️ Network error communicating with Cloudflare Edge API.';
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = '🚀 Provision Free VIP Project & Open Dashboard →';
    }
  };

  // Exit VIP Mode
  window.exitVipMode = function () {
    try {
      localStorage.removeItem('answerindex_vip_unlocked');
    } catch (e) {}
    applyVipMode(false);
    if (typeof showToast === 'function') {
      showToast('VIP Founder Mode Deactivated. Restored standard pricing.');
    }
  };

  // Apply or Remove VIP UI State across page
  function applyVipMode(active) {
    initVipModals();
    const banner = document.getElementById('vipActiveBanner');
    if (banner) {
      banner.style.display = active ? 'block' : 'none';
      if (active) {
        document.body.style.paddingTop = '38px';
      } else {
        document.body.style.paddingTop = '';
      }
    }

    // Update Pro badges to show glowing Crown
    const badges = document.querySelectorAll('.badge-pro, .pro-badge, #easterEggProBadge');
    badges.forEach(b => {
      if (active) {
        b.classList.add('vip-active');
        b.setAttribute('title', '👑 VIP Founder Mode Active (Click to Launch Free Site)');
        b.innerHTML = '👑 PRO · VIP';
      } else {
        b.classList.remove('vip-active');
        b.removeAttribute('title');
        b.innerHTML = 'Pro Agent';
      }
    });

    // Update Pricing Display & Buttons if on pricing page
    const growthVal = document.getElementById('growthPriceVal');
    const proVal = document.getElementById('proPriceVal');
    const enterpriseVal = document.getElementById('enterprisePriceVal');

    const growthBtn = document.getElementById('growthBtnText');
    const proBtn = document.getElementById('proBtnText');
    const enterpriseBtn = document.getElementById('enterpriseBtnText');

    if (active) {
      if (growthVal) growthVal.innerHTML = '<span style="text-decoration:line-through; font-size:1.1rem; color:#888;">$199</span> $0';
      if (proVal) proVal.innerHTML = '<span style="text-decoration:line-through; font-size:1.1rem; color:#888;">$499</span> $0';
      if (enterpriseVal) enterpriseVal.innerHTML = '<span style="text-decoration:line-through; font-size:1.1rem; color:#888;">$1,499</span> $0';

      if (growthBtn) growthBtn.textContent = '⚡ Launch Free VIP Site ($0) →';
      if (proBtn) proBtn.textContent = '⚡ Launch Free VIP Site ($0) →';
      if (enterpriseBtn) enterpriseBtn.textContent = '⚡ Launch Free VIP Site ($0) →';
    } else {
      if (typeof setBillingCycle === 'function' && typeof currentBillingCycle !== 'undefined') {
        setBillingCycle(currentBillingCycle);
      }
    }
  }

  // Intercept standard checkout if in VIP Mode
  const originalStartCheckout = window.startCheckout;
  window.startCheckout = function (plan = 'enterprise') {
    if (window.isVipUnlocked()) {
      openVipProvisionModal(plan);
      return;
    }
    if (typeof originalStartCheckout === 'function') {
      return originalStartCheckout(plan);
    }
  };

  // Wire Click Listeners to badges
  function setupBadgeListeners() {
    const selectors = ['.badge-pro', '.pro-badge', '#easterEggProBadge'];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.cursor = 'pointer';
        el.removeEventListener('click', handleBadgeRouting);
        el.addEventListener('click', handleBadgeRouting);
      });
    });
  }

  function handleBadgeRouting(e) {
    if (window.isVipUnlocked()) {
      // If already unlocked, clicking opens the VIP modal directly
      if (e.target.classList.contains('badge-pro') || e.target.classList.contains('pro-badge') || e.target.id === 'easterEggProBadge') {
        if (e && e.preventDefault) e.preventDefault();
        openVipProvisionModal();
        return;
      }
    }
    handleProBadgeEasterEggClick(e);
  }

  // Keyboard shortcut: ESC closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeClientAuthModal();
      closeVipPasscodeModal();
      closeVipProvisionModal();
    }
  });

  // Ready on load
  function init() {
    initPortalModal();
    initVipModals();
    setupBadgeListeners();

    if (window.isVipUnlocked()) {
      applyVipMode(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

