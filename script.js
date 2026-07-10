// ==========================================================================
// Sheena Ponsica — Portfolio interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Dark mode toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark'
        ? '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'
        : '<path d="M12 3v1M12 20v1M4.2 4.2l.7.7M18.4 18.4l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M18.4 5.6l.7-.7"/><circle cx="12" cy="12" r="4.5"/>';
    }
  };

  const stored = localStorage.getItem('sp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('sp-theme', next);
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--i', i % 6);
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 500);
  });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = 'Thanks! This demo form isn\u2019t wired to a backend yet — connect it to an email service to start receiving messages.';
    status.classList.add('show');
    form.reset();
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      lightboxImage.src = trigger.src;
      lightbox.classList.add('active');
    });
  });

  lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  /* ---------- Work Carousel — company tabs ---------- */
  const workTabs   = document.querySelectorAll('.work-tab');
  const workPanels = document.querySelectorAll('.work-panel');

  workTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      if (tab.classList.contains('active')) return;

      workTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      workPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${target}`);
      });

      // Re-observe any reveal elements inside the newly shown panel
      document.querySelectorAll(`#panel-${target} .reveal:not(.is-visible)`).forEach(el => {
        revealObserver.observe(el);
      });
    });
  });

  /* ---------- Work card video players ---------- */
  document.querySelectorAll('.work-video-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.work-video-wrap');
      const video = wrap.querySelector('video');
      wrap.classList.add('is-playing');
      video.play();
    });
  });

  /* ---------- Services interactive tabs ---------- */
  const srvItems  = document.querySelectorAll('.srv-item');
  const srvPanels = document.querySelectorAll('.srv-panel');

  function activateSrv(index) {
    srvItems.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    srvPanels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.remove('exiting');
        panel.classList.add('active');
      } else if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        panel.classList.add('exiting');
        panel.addEventListener('animationend', () => {
          panel.classList.remove('exiting');
        }, { once: true });
      }
    });
  }

  srvItems.forEach((item, i) => {
    item.addEventListener('click', () => activateSrv(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateSrv(i);
      }
      // Arrow key navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        activateSrv((i + 1) % srvItems.length);
        srvItems[(i + 1) % srvItems.length].focus();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activateSrv((i - 1 + srvItems.length) % srvItems.length);
        srvItems[(i - 1 + srvItems.length) % srvItems.length].focus();
      }
    });
  });

  /* ---------- Work Card Sliders ---------- */
  document.querySelectorAll('.slider-wrap').forEach(wrap => {
    const grid     = wrap.querySelector('.js-slider');
    const dotsCont = wrap.querySelector('.js-dots');
    const prevBtn  = wrap.querySelector('.slider-prev');
    const nextBtn  = wrap.querySelector('.slider-next');
    const cards    = Array.from(grid.querySelectorAll('.work-card'));
    const total    = cards.length;
    let currentPage = 0;
    let dots        = [];

    const getVis = () => {
      const w = window.innerWidth;
      return w < 720 ? 1 : w < 980 ? 2 : 3;
    };

    const pageCount = () => Math.ceil(total / getVis());

    const buildDots = () => {
      const n = pageCount();
      dotsCont.innerHTML = '';
      dots = Array.from({ length: n }, (_, i) => {
        const d = document.createElement('button');
        d.className = 'slider-dot' + (i === currentPage ? ' active' : '');
        d.setAttribute('aria-label', `Go to page ${i + 1} of ${n}`);
        d.addEventListener('click', () => goToPage(i));
        dotsCont.appendChild(d);
        return d;
      });
    };

    const syncState = () => {
      const n = pageCount();
      currentPage = Math.max(0, Math.min(currentPage, n - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === currentPage));
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage >= n - 1;
    };

    const goToPage = (page) => {
      const vis = getVis();
      currentPage = Math.max(0, Math.min(page, pageCount() - 1));
      const target = cards[currentPage * vis];
      if (target) grid.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      syncState();
    };

    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Sync dots on manual drag/swipe
    grid.addEventListener('scroll', () => {
      const cardW = (cards[0] ? cards[0].offsetWidth : 0) + 24;
      if (!cardW) return;
      const approxCard  = Math.round(grid.scrollLeft / cardW);
      const approxPage  = Math.floor(approxCard / getVis());
      if (approxPage !== currentPage) {
        currentPage = approxPage;
        syncState();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      currentPage = 0;
      buildDots();
      goToPage(0);
    });

    buildDots();
    syncState();
  });

});
