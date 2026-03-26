/*!
 * AstroVeda — dashboard.js
 * Tab switching, sidebar toggle, mobile responsiveness
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Initialise the first visible tab
    showTab('overview');

    // Close sidebar overlay when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('dash-sidebar');
      const toggler = document.querySelector('[onclick="avToggleSidebar()"]');
      if (!sidebar) return;
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== toggler &&
          !toggler?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // Keyboard accessibility: close sidebar on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('dash-sidebar');
        if (sidebar) sidebar.classList.remove('open');
      }
    });
  });

  function showTab(id) {
    // Show / hide tab panels
    document.querySelectorAll('[data-tab]').forEach(panel => {
      panel.style.display = panel.dataset.tab === id ? 'block' : 'none';
    });

    // Update nav link active state
    document.querySelectorAll('.dash-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.target === id);
    });

    // Update page title
    const titleMap = {
      overview : 'Welcome Back ✦',
      profile  : 'My Profile',
      reports  : 'My Reports',
      bookings : 'My Bookings',
      history  : 'Chart History',
      messages : 'Messages',
      payments : 'Payments',
      downloads: 'Downloads',
    };
    const titleEl = document.getElementById('dash-title');
    if (titleEl) titleEl.textContent = titleMap[id] ?? 'Dashboard';

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 992) {
      const sidebar = document.getElementById('dash-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }

    // Scroll to top of main content area
    const main = document.getElementById('dash-main');
    if (main) main.scrollTop = 0;
  }

  // Expose to global scope (used inline via onclick)
  window.avShowTab      = showTab;
  window.avToggleSidebar = function () {
    const sb = document.getElementById('dash-sidebar');
    if (sb) sb.classList.toggle('open');
  };

})();
