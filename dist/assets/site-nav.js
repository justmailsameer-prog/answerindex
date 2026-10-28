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

  function init() {
    initFaqAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
