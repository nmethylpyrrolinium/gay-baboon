/* ═══════════════════════════════════════════════════════════
   ARCHIVE PORTFOLIO — CINEMATIC INTERACTION SYSTEM
   ═══════════════════════════════════════════════════════════ */

// ── LOADER ────────────────────────────────────────────────
const loader = document.getElementById('loader');
const skipBtn = document.getElementById('skip-loader');

function closeLoader() {
  loader.classList.add('done');
}

window.addEventListener('load', () => {
  // Small dramatic pause before dismissing
  setTimeout(closeLoader, 800);
});
skipBtn.addEventListener('click', closeLoader);

// ── CLOCK ─────────────────────────────────────────────────
const timeEl = document.getElementById('nav-time');
function tick() {
  if (!timeEl) return;
  const t = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  timeEl.textContent = 'Mumbai · ' + t;
}
tick();
setInterval(tick, 30000);

// ── MOBILE NAV ────────────────────────────────────────────
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked (mobile)
navLinks.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('nav')) {
    menuBtn.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  }
});

// ── HEADER SCROLL STATE ───────────────────────────────────
const header = document.getElementById('site-header');
let lastScroll = 0;
let headerVisible = true;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const delta = currentScroll - lastScroll;

  // Fade header at top
  if (currentScroll < 60) {
    header.style.background = '';
  } else {
    header.style.background = 'rgba(245,242,236,0.94)';
  }

  // Hide/show on scroll direction (with threshold)
  if (Math.abs(delta) < 5) { lastScroll = currentScroll; return; }
  if (delta > 0 && currentScroll > 200 && headerVisible) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform .4s cubic-bezier(0.19,1,0.22,1), background .4s';
    headerVisible = false;
  } else if (delta < 0 && !headerVisible) {
    header.style.transform = '';
    headerVisible = true;
  }
  lastScroll = currentScroll;
}, { passive: true });

// ── CINEMATIC REVEAL SYSTEM ───────────────────────────────
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('[data-cinematic]');

if (reduce) {
  revealTargets.forEach(el => el.classList.add('revealed'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children within a revealed block
        const el = entry.target;
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px'
  });

  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('revealed'));
}

// Also reveal project-pair children with stagger
const pairs = document.querySelectorAll('.project-pair');
if ('IntersectionObserver' in window && !reduce) {
  const pairObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.project-half');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'none';
          }, i * 120);
        });
        pairObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  // Init hidden state for pair children
  pairs.forEach(pair => {
    pair.querySelectorAll('.project-half').forEach(child => {
      if (!reduce) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(28px)';
        child.style.transition = 'opacity 1s cubic-bezier(0.19,1,0.22,1), transform 1.1s cubic-bezier(0.19,1,0.22,1)';
      }
    });
    pairObserver.observe(pair);
  });
}

// ── SCROLL CUE AUTO-HIDE ──────────────────────────────────
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      scrollCue.style.opacity = '0';
      scrollCue.style.transition = 'opacity .6s';
    }
  }, { passive: true, once: false });
}

// ── SMOOTH HASH NAVIGATION ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
});

// ── PROJECT FRAME PARALLAX (subtle, desktop only) ─────────
if (!reduce && window.matchMedia('(min-width: 900px)').matches) {
  const frames = document.querySelectorAll('.project-frame');
  const handleScroll = () => {
    frames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const dist = (center - viewCenter) / window.innerHeight;
      // Very subtle background-position shift for depth
      frame.style.backgroundPositionY = `calc(50% + ${dist * 18}px)`;
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}
