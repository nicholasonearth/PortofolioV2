// ═══════════════════════════════════════════════════════
// AWWWARDS-LEVEL NEO-MINIMALIST BENTO
// Lenis Smooth Scroll, GSAP, Custom Cursor
// ═══════════════════════════════════════════════════════

// ── 1. DEPENDENCIES & PRELOADER ──
const gsapReady = typeof window.gsap !== 'undefined';
const scrollTriggerReady = typeof window.ScrollTrigger !== 'undefined';
let lenis = null;

function hidePreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  if (gsapReady) {
    gsap.timeline()
      .to('.preloader-text', { yPercent: -100, opacity: 0, duration: 0.8, ease: 'power3.in', delay: 0.3 })
      .to(preloader, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' }, '-=0.3')
      .set(preloader, { display: 'none' });
  } else {
    preloader.style.display = 'none';
  }
}

window.addEventListener('load', hidePreloader);

// ── 2. LENIS SMOOTH SCROLL ──
if (typeof window.Lenis === 'function') {
  lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (gsapReady && scrollTriggerReady) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);
  }
}


// ── 3. NAVBAR SCROLL & MOBILE MENU ──
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
let isMenuOpen = false;

window.addEventListener('scroll', () => {
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Toggle mobile menu
if (mobileMenuBtn && mobileDrawer) {
  mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileDrawer.classList.toggle('open', isMenuOpen);
    
    const icon = mobileMenuBtn.querySelector('i');
    if (isMenuOpen) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
  });
}


// ── 5. GSAP SCROLL REVEALS ──
// Generic fade up
const fadeUps = document.querySelectorAll('.gsap-fade-up');
if (gsapReady) {
  fadeUps.forEach(el => {
    gsap.from(el, {
      ...(scrollTriggerReady ? {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      } : {}),
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });
}

// Parallax Section Numbers
const sectionNumbers = document.querySelectorAll('.section-number');
if (gsapReady && scrollTriggerReady) {
  sectionNumbers.forEach(num => {
    gsap.to(num, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: num.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}


// ── 6. SCROLLSPY (ACTIVE NAV LINKS) ──
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (current && link.getAttribute('href')?.includes(current)) {
      link.classList.add('active');
    }
  });
});


// ── 7. SMOOTH SCROLL (A TAGS) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      if (typeof lenis !== 'undefined') {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});


// ── 8. TOAST NOTIFICATION & FORM SIMULATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  if(toast) {
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

window.copyToClipboard = async function(text, msg) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    showToast(msg || 'Disalin!');
  } catch (error) {
    showToast('Gagal menyalin email.');
  }
}

const copyEmailButton = document.getElementById('copy-email-btn');
if (copyEmailButton) {
  copyEmailButton.addEventListener('click', () => {
    window.copyToClipboard('nicholasdevin9@gmail.com', 'Email copied!');
  });
}

window.downloadCV = function(e) {
  showToast('📄 Mengunduh CV...');
}

const downloadCVButton = document.getElementById('download-cv-btn');
if (downloadCVButton) {
  downloadCVButton.addEventListener('click', window.downloadCV);
}
