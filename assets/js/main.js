/*!
 * AstroVeda – main.js
 * Theme | RTL | Scroll Effects | Cosmic Field | Animations
 */

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initScrollEffects();
    initRevealObserver();
    initCosmicField();
    initNavShrink();
    initSlotPicker();
    initCountUp();
  });

  /* ─── 1. THEME ──────────────────────────── */
  function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const saved  = localStorage.getItem('av_theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme  = saved || system;

    applyTheme(theme);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('av_theme', next);
    });

    // listen for OS changes if no saved pref
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('av_theme')) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // update all theme toggle icons on the page
    document.querySelectorAll('#theme-toggle i').forEach(icon => {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    });
  }

  /* ─── 2. RTL ────────────────────────────── */
  function initRTL() {
    const btn = document.getElementById('rtl-toggle');
    if (!btn) return;

    const saved = localStorage.getItem('av_dir') || 'ltr';
    applyDir(saved);

    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
      applyDir(next);
      localStorage.setItem('av_dir', next);
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('#rtl-toggle').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'English' : 'عربي';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to English' : 'Switch to Arabic RTL');
    });
  }

  /* ─── 3. SCROLL EFFECTS ─────────────────── */
  function initScrollEffects() {
    // Parallax on hero zodiac wheel
    const zodiac = document.querySelector('.zodiac-wrap');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (zodiac) zodiac.style.transform = `translateY(${y * 0.12}px)`;
    }, { passive: true });
  }

  /* ─── 4. REVEAL OBSERVER ────────────────── */
  function initRevealObserver() {
    const els = document.querySelectorAll('.reveal-up, .reveal-rotate, .reveal-zoom-in, .reveal-slide-side');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ─── 5. COSMIC CANVAS ──────────────────── */
  function initCosmicField() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cosmic-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx    = canvas.getContext('2d');
    const count  = 140;
    const stars  = [];
    const trail  = [];
    const MAX_TRAIL = 28;
    let mouse     = { x: -999, y: -999 };
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    /* Star class */
    class Star {
      constructor() { this.reset(); }
      reset() {
        this.bx   = Math.random() * canvas.width;
        this.by   = Math.random() * canvas.height;
        this.x    = this.bx;
        this.y    = this.by;
        this.r    = Math.random() * 1.8 + .3;
        this.vx   = 0;
        this.vy   = 0;
        this.ease = 0.04 + Math.random() * 0.04;
        this.friction = 0.88;
      }
      update() {
        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const f = (120 - dist) / 120;
          this.vx -= dx * f * 0.08;
          this.vy -= dy * f * 0.08;
        }
        this.vx += (this.bx - this.x) * this.ease;
        this.vy += (this.by - this.y) * this.ease;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x  += this.vx;
        this.y  += this.vy;
      }
      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(201,169,110,.55)' : 'rgba(201,169,110,.35)';
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) stars.push(new Star());

    /* draw constellation lines between close stars */
    function drawConstellations() {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (d < 90) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(201,169,110,${0.06 * (1 - d / 90)})`
              : `rgba(201,169,110,${0.04 * (1 - d / 90)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    }

    /* cursor light trail */
    function drawTrail() {
      for (let i = 0; i < trail.length; i++) {
        const p   = trail[i];
        const age = i / trail.length;
        ctx.beginPath();
        ctx.arc(p.x, p.y, age * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${age * 0.25})`;
        ctx.fill();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConstellations();
      drawTrail();
      stars.forEach(s => { s.update(); s.draw(); });
      raf = requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      trail.push({ x: e.clientX, y: e.clientY });
      if (trail.length > MAX_TRAIL) trail.shift();
    }, { passive: true });

    // Pause animation when tab hidden (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    });
  }

  /* ─── 6. NAV SHRINK ─────────────────────── */
  function initNavShrink() {
    const nav = document.querySelector('.nav-astro');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── 7. SLOT PICKER ────────────────────── */
  function initSlotPicker() {
    document.querySelectorAll('.slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  /* ─── 8. COUNT UP ANIMATION ─────────────── */
  function initCountUp() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el      = e.target;
        const target  = +el.getAttribute('data-count');
        const suffix  = el.getAttribute('data-suffix') || '';
        let start     = 0;
        const dur     = 1800;
        const step    = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.floor(p * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: .5 });
    nums.forEach(n => io.observe(n));
  }

  /* ─── DASHBOARD UTILS (global) ──────────── */
  window.avShowTab = function (id) {
    document.querySelectorAll('[data-tab]').forEach(t => {
      t.style.display = t.dataset.tab === id ? 'block' : 'none';
    });
    document.querySelectorAll('.dash-nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.target === id);
    });
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
    if (titleEl) titleEl.textContent = titleMap[id] || 'Dashboard';
    if (window.innerWidth <= 992) window.avToggleSidebar();
  };

  window.avToggleSidebar = function () {
    const sb = document.getElementById('dash-sidebar');
    if (sb) sb.classList.toggle('open');
  };

})();
