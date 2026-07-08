// ═══════════════════════════════════════════════════════
// PLAYFUL STORYTELLING PORTFOLIO — JavaScript
// Dark Mode, GSAP Animations
// ═══════════════════════════════════════════════════════

// ── 1. DARK MODE TOGGLE ──
const themeBtn = document.getElementById('theme-btn');
const htmlEl = document.documentElement;

// Check local storage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
} else {
  // Default to dark as requested in HTML
  htmlEl.setAttribute('data-theme', 'dark');
}

themeBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Icon switch
  const icon = themeBtn.querySelector('i');
  if (newTheme === 'dark') {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
});

// Set initial icon state
if (htmlEl.getAttribute('data-theme') === 'light') {
  themeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}


// ── 3. NAVBAR SCROLL & MOBILE MENU ──
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
let isMenuOpen = false;

window.addEventListener('scroll', () => {
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
    
    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (isMenuOpen) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
  });
}

// ── 4. GSAP ANIMATIONS ──
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const tlHero = gsap.timeline();
tlHero.from('.hero-tagline', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
      .from('.text-hero', { y: 40, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
      .from('.hero .text-body-lg', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');

// About Section
gsap.from('.gsap-about-text > *', {
  scrollTrigger: {
    trigger: '#about',
    start: 'top 80%',
  },
  y: 30,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  ease: 'power3.out'
});

gsap.from('.gsap-about-img', {
  scrollTrigger: {
    trigger: '#about',
    start: 'top 80%',
  },
  x: 50,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out'
});

// Projects (The Chapters) - Parallax Images & Fade Ups
const projects = document.querySelectorAll('.gsap-project');
projects.forEach((proj) => {
  // Card Fade in
  gsap.from(proj, {
    scrollTrigger: {
      trigger: proj,
      start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
  
  // Subtle Parallax on Image inside Card
  const img = proj.querySelector('.gsap-parallax-img');
  if (img) {
    gsap.to(img, {
      yPercent: 15, // Moves down slightly as you scroll down
      ease: "none",
      scrollTrigger: {
        trigger: proj,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
});

// Experience Timeline
gsap.from('.gsap-timeline', {
  scrollTrigger: {
    trigger: '#experience',
    start: 'top 75%',
  },
  x: -30,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power2.out'
});

// Skills
gsap.from('.gsap-skill', {
  scrollTrigger: {
    trigger: '#skills',
    start: 'top 80%',
  },
  y: 30,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: 'back.out(1.2)' // playful pop
});

// Certificates
gsap.from('.gsap-cert', {
  scrollTrigger: {
    trigger: '#certifications',
    start: 'top 80%',
  },
  y: 30,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: 'power2.out'
});

// Footer Text Parallax
gsap.to('.gsap-footer-text', {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: '#contact',
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// ── 5. TOAST NOTIFICATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  if(toast) {
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

window.copyToClipboard = function(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg || 'Disalin!'));
}

window.downloadCV = function(e) {
  e.preventDefault();
  showToast('📄 Mengunduh CV...');
  window.open('assets/docs/CVats.pdf', '_blank');
}

// ── 6. SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});