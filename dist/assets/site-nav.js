/**
 * Answer Index Pro — Navigation & Drawer Controller
 * Handles v2 slide-out drawer, keyboard escape shortcuts, and FAQ accordion interactions.
 */

(function () {
  // --- V2 DRAWER MENU TOGGLE ---
  window.toggleDrawer = function (open) {
    const drawer = document.getElementById('drawerMenu');
    if (!drawer) return;
    if (open) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.handleOverlayClick = function (event) {
    if (event.target && event.target.id === 'drawerMenu') {
      window.toggleDrawer(false);
    }
  };

  // Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.toggleDrawer(false);
      if (typeof window.closeMobileDrawer === 'function') {
        window.closeMobileDrawer();
      }
    }
  });

  // Legacy drawer triggers for compatibility
  window.openMobileDrawer = function () {
    window.toggleDrawer(true);
  };

  window.closeMobileDrawer = function () {
    window.toggleDrawer(false);
  };

  // Universal FAQ Accordion Handler
  function initFaqAccordion() {
    document.querySelectorAll('.faq-question-orange, .faq-q').forEach(q => {
      q.style.cursor = 'pointer';
      q.removeEventListener('click', handleFaqClick);
      q.addEventListener('click', handleFaqClick);
    });
  }

  function handleFaqClick(e) {
    const item = this.closest('.faq-item-orange') || this.closest('.faq-card') || this.closest('.faq-item');
    if (item) {
      item.classList.toggle('open');
      item.classList.toggle('active');
    }
  }

  // --- PERSISTENT CLIENT AUTH STATE IN NAVBAR ---
  function updateNavAuthState() {
    try {
      const storedUser = localStorage.getItem('answerindex_user');
      const storedProj = localStorage.getItem('answerindex_project');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      let domain = 'Workspace';
      if (storedProj) {
        try {
          const proj = JSON.parse(storedProj);
          if (proj && proj.domain) domain = proj.domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
        } catch (e) {}
      }

      // Update Desktop Sign In button
      document.querySelectorAll('.btn-header-signin, .btn-portal-signin, a[onclick*="openClientAuthModal"]').forEach(el => {
        if (el.tagName === 'BUTTON' || el.tagName === 'A') {
          el.innerHTML = `🟢 <strong>${domain}</strong> →`;
          el.title = `Signed in as ${user.email} · Click to enter workspace`;
          el.onclick = function (e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
          };
          if (el.tagName === 'A') el.href = 'dashboard.html';
        }
      });

      // Update Drawer / Mobile Sign In button
      document.querySelectorAll('.btn-drawer-signin').forEach(el => {
        el.innerHTML = `🟢 Workspace (${domain}) →`;
        el.title = `Signed in as ${user.email}`;
        el.onclick = function (e) {
          e.preventDefault();
          window.location.href = 'dashboard.html';
        };
      });

      // Append subtle sign-out link if not already present
      const headerCtas = document.querySelector('.header-ctas');
      if (headerCtas && !document.getElementById('siteNavLogoutBtn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'siteNavLogoutBtn';
        logoutBtn.type = 'button';
        logoutBtn.title = 'Sign out of current workspace';
        logoutBtn.innerText = 'Log out';
        logoutBtn.style.cssText = 'background:none; border:none; color:var(--text-muted, #9A9DA8); font-size:11.5px; font-weight:600; cursor:pointer; padding:4px 8px; text-decoration:underline; font-family:inherit;';
        logoutBtn.onclick = function () {
          localStorage.removeItem('answerindex_user');
          localStorage.removeItem('answerindex_project');
          window.location.reload();
        };
        headerCtas.appendChild(logoutBtn);
      }
    } catch (e) {
      console.warn('[SiteNav] Auth state error:', e);
    }
  }

  function init() {
    initFaqAccordion();
    updateNavAuthState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
