/**
 * Answer Index Pro — Mobile Navigation & Sticky Bar Controller
 * Manages mobile slide-over drawer, scroll-aware sticky bar, and active link state.
 */

(function () {
  function initMobileNav() {
    // Inject Mobile Drawer HTML if missing
    if (!document.getElementById('mobileNavDrawer')) {
      const drawerHtml = `
        <div id="mobileNavDrawer" class="mobile-drawer-overlay" onclick="handleDrawerBackdrop(event)">
          <div class="mobile-drawer-card" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div class="mobile-drawer-header">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <img src="assets/AnswerIndex_Logo.png" alt="Answer Index" style="width:28px; height:28px; border-radius:6px;" />
                <span style="font-weight:800; color:#fff; font-size:1.05rem;">Answer Index</span>
                <span class="site-badge-pro" id="drawerProBadge" onclick="handleProBadgeEasterEggClick(event)" title="Pro Agent (Click 5 times for VIP)">PRO</span>
              </div>
              <button class="mobile-drawer-close" onclick="closeMobileDrawer()" aria-label="Close menu">&times;</button>
            </div>

            <nav class="mobile-drawer-nav-list">
              <a href="pro.html" class="mobile-drawer-link" id="navLinkHome">
                <span class="icon">🏠</span> <span>Overview</span>
              </a>
              <a href="how-it-works.html" class="mobile-drawer-link" id="navLinkHow">
                <span class="icon">⚙️</span> <span>How It Works</span>
              </a>
              <a href="audit.html" class="mobile-drawer-link" id="navLinkAudit">
                <span class="icon">🔍</span> <span>Free AI Audit (PDF)</span>
              </a>
              <a href="pricing.html" class="mobile-drawer-link" id="navLinkPricing">
                <span class="icon">💳</span> <span>Pricing &amp; Plans</span>
              </a>
              <a href="about.html" class="mobile-drawer-link" id="navLinkAbout">
                <span class="icon">💡</span> <span>About &amp; Founder</span>
              </a>
              <a href="dashboard.html" class="mobile-drawer-link" id="navLinkDash" style="color: #60a5fa;">
                <span class="icon">⚡</span> <span>Live Web Dashboard</span>
              </a>
            </nav>

            <div class="mobile-drawer-footer">
              <button onclick="closeMobileDrawer(); openClientAuthModal('login');" class="site-nav-btn site-nav-btn-secondary" style="width:100%;">
                🔑 Client Sign In
              </button>
              <a href="audit.html" class="site-nav-btn site-nav-btn-cobalt" style="width:100%;">
                ⚡ Run Free AI Audit →
              </a>
              <div style="text-align:center; font-size:0.75rem; color:#64748b; margin-top:0.5rem;">
                Answer Index Pro · Autonomous AEO / GEO Engine
              </div>
            </div>
          </div>
        </div>
      `;

      // Inject Sticky Bottom Bar if missing
      const stickyBarHtml = `
        <div id="mobileStickyBar" class="mobile-sticky-bar">
          <div class="sticky-bar-inner">
            <a href="audit.html" class="btn-sticky-primary">
              <span>🔍 Free AI Audit</span>
            </a>
            <a href="pricing.html" class="btn-sticky-secondary">
              <span>Pricing &amp; Plans →</span>
            </a>
          </div>
        </div>
      `;

      const div = document.createElement('div');
      div.id = 'mobileNavWrapper';
      div.innerHTML = drawerHtml + stickyBarHtml;
      document.body.appendChild(div);
    }

    // Highlight current page
    const currentPath = window.location.pathname.toLowerCase();
    const highlight = (id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('active');
    };

    if (currentPath.includes('how-it-works')) highlight('navLinkHow');
    else if (currentPath.includes('audit')) highlight('navLinkAudit');
    else if (currentPath.includes('pricing')) highlight('navLinkPricing');
    else if (currentPath.includes('about')) highlight('navLinkAbout');
    else if (currentPath.includes('dashboard')) highlight('navLinkDash');
    else highlight('navLinkHome');

    // Scroll Aware Sticky Bottom Bar (Auto hide on rapid scroll down, reveal on pause/up)
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const stickyBar = document.getElementById('mobileStickyBar');
          if (stickyBar) {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
              // Scrolling down
              stickyBar.classList.add('hidden');
            } else {
              // Scrolling up or paused
              stickyBar.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Drawer Open / Close Functions
  window.openMobileDrawer = function () {
    const drawer = document.getElementById('mobileNavDrawer');
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMobileDrawer = function () {
    const drawer = document.getElementById('mobileNavDrawer');
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.handleDrawerBackdrop = function (e) {
    if (e.target && e.target.id === 'mobileNavDrawer') {
      closeMobileDrawer();
    }
  };

  // Keyboard shortcut: Escape closes drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileDrawer();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
