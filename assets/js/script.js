// ── 1. PARTICLE CANVAS ──
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,212,255' : '124,58,237';
  }

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    // Mouse interaction
    if (mouse.x) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx * 0.02;
        this.y += dy * 0.02;
      }
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  };

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  init();
  animate();
})();

// ── 2. TYPING ANIMATION ──
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

// ── 3. SCROLL PROGRESS ──
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
  // Navbar blur
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = document.body.classList.contains('light')
      ? 'rgba(240,244,248,0.9)' : 'rgba(10,14,26,0.85)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
  } else {
    nav.style.background = 'rgba(10,14,26,0)';
    nav.style.backdropFilter = '';
    nav.style.borderBottom = 'none';
  }
  // Back to top
  const bt = document.getElementById('back-top');
  window.scrollY > 400 ? bt.classList.add('visible') : bt.classList.remove('visible');
  // Active nav
  updateActiveNav();
});

// ── 4. ACTIVE NAV ──
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

// ── 5. REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
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

// Skill bars inside skill section
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1 });
const skillSection = document.getElementById('skill');
if (skillSection) skillObserver.observe(skillSection);

// ── 6. COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current) + '+';
  }, 40);
}

// Trigger counters on hero load
setTimeout(() => {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => animateCounter(el));
}, 600);

// ── 7. THEME TOGGLE ──
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeIcon.className = isLight ? 'fas fa-sun text-sm text-yellow-400' : 'fas fa-moon text-sm text-cyan-electric';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeIcon.className = 'fas fa-sun text-sm text-yellow-400';
}

// ── 8. HAMBURGER MENU ──
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

// ── 9. PROJECT FILTER ──
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
      card.style.opacity = match ? '1' : '0.2';
      card.style.transform = match ? 'scale(1)' : 'scale(0.95)';
      card.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

// ── 10. 3D CARD TILT ──
document.querySelectorAll('.card-tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 8;
    const rotY = (x / rect.width) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
})();

// ── 11. TOAST NOTIFICATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg || 'Disalin!'));
}

// ── 12. DOWNLOAD CV ──
function downloadCV(e) {
  e.preventDefault();
  showToast('📄 Mengunduh CV...');
  // Sesuaikan nama file pdf-nya dengan nama asli di folder docs milikmu
  window.open('assets/docs/CVats.pdf', '_blank'); 
}

// ── 13. SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── 14. LAZY LOAD SKILL BARS (trigger on section enter) ──
const skillSectionObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }
}, { threshold: 0.1 });
if (document.getElementById('skill')) skillSectionObs.observe(document.getElementById('skill'));

// ── 15. PROFILE PHOTO ERROR FALLBACK ──
document.getElementById('profile-photo').addEventListener('error', function () {
  this.src = 'https://ui-avatars.com/api/?name=Nama+Anda&size=300&background=0F1628&color=00D4FF&bold=true';
});