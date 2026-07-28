/**
 * LVJIAN Personal Brand Website — JavaScript
 * Scroll animations, nav highlighting, number counting, mobile menu, back-to-top
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // --- Mobile Menu Toggle ---
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Navbar Scroll Effect ---
  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // --- Active Nav Link on Scroll ---
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  // --- Back to Top ---
  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  function initReveal() {
    const revealElements = document.querySelectorAll(
      '.ability-card, .star-item, .ip-card, .timeline-item, .contact-item, .case-highlights, .education-block'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered delay based on index within parent
            const siblings = Array.from(entry.target.parentElement.children);
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 0.1, 0.5);

            entry.target.style.transitionDelay = delay + 's';
            entry.target.classList.add('reveal', 'visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // --- Number Counting Animation ---
  function animateNumbers() {
    const statNums = document.querySelectorAll('.stat-num[data-target]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1500;
            const startTime = performance.now();
            const startVal = 0;

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(startVal + (target - startVal) * eased);

              el.textContent = current.toLocaleString();

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = target.toLocaleString();
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(el => observer.observe(el));
  }

  // --- Combined Scroll Handler (throttled) ---
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        updateActiveNav();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  // --- Init ---
  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load
  updateNavbar();
  updateActiveNav();
  updateBackToTop();
  initReveal();
  animateNumbers();

  // Re-run reveal for elements that might need recalculation after fonts load
  window.addEventListener('load', () => {
    updateActiveNav();
  });

  // Handle resize for mobile menu cleanup
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
