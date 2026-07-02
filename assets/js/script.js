// ═══════════════════════════════════════════════════════
// PORTFOLIO V2 — Apple Design System JavaScript
// ═══════════════════════════════════════════════════════

// ── 1. TYPING ANIMATION ──
const roles = ['Data Scientist', 'Machine Learning Engineer', 'Network Engineer', 'Python Developer', 'Data Analyst'];
let rIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const role = roles[rIdx];
  typingEl.textContent = deleting ? role.substring(0, cIdx--) : role.substring(0, cIdx++);
  let speed = deleting ? 60 : 110;
  if (!deleting && cIdx > role.length) { speed = 1800; deleting = true; }
  else if (deleting && cIdx < 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; speed = 300; }
  setTimeout(type, speed);
}
type();

// ── 2. SCROLL PROGRESS ──
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';

  // Navbar background on scroll
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(29, 29, 31, 0.8)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.webkitBackdropFilter = 'blur(20px)';
    nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
  } else {
    nav.style.background = 'rgba(29, 29, 31, 0)';
    nav.style.backdropFilter = '';
    nav.style.webkitBackdropFilter = '';
    nav.style.borderBottom = 'none';
  }

  // Back to top button
  const bt = document.getElementById('back-top');
  window.scrollY > 400 ? bt.classList.add('visible') : bt.classList.remove('visible');

  // Active nav tracking
  updateActiveNav();
});

// ── 3. ACTIVE NAV ──
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// ── 4. REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars inside revealed elements
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      // Animate counters
      e.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
        animateCounter(el);
      });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// Skill bars trigger on section enter
const skillSection = document.getElementById('skill');
if (skillSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.1 });
  skillObserver.observe(skillSection);
}

// ── 5. COUNTER ANIMATION ──
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current) + '+';
  }, 40);
}

// Trigger counters on initial load
setTimeout(() => {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => animateCounter(el));
}, 600);

// ── 6. THEME TOGGLE ──
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Default: light mode. Dark mode toggled via body.dark class.
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeIcon.className = 'fas fa-sun';
}

// ── 7. HAMBURGER MENU ──
const hamBtn = document.getElementById('ham-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamBtn.classList.toggle('ham-open', menuOpen);
  mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    hamBtn.classList.remove('ham-open');
    mobileMenu.style.maxHeight = '0';
  });
});

// ── 8. PROJECT FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      const match = filter === 'all' || cats.includes(filter);
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = match ? '1' : '0.15';
      card.style.transform = match ? 'scale(1)' : 'scale(0.97)';
      card.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

// ── 9. SUBTLE CARD HOVER (replaces aggressive 3D tilt) ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 3;
    const rotY = (x / rect.width) * 3;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ── 10. TOAST NOTIFICATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg || 'Disalin!'));
}

// ── 11. DOWNLOAD CV ──
function downloadCV(e) {
  e.preventDefault();
  showToast('📄 Mengunduh CV...');
  window.open('assets/docs/CVats.pdf', '_blank');
}

// ── 12. SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── 13. PROFILE PHOTO FALLBACK ──
const profilePhoto = document.getElementById('profile-photo');
if (profilePhoto) {
  profilePhoto.addEventListener('error', function () {
    this.src = 'https://ui-avatars.com/api/?name=Nicholas+Devin&size=300&background=0071E3&color=fff&bold=true';
  });
}