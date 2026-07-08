// ═══════════════════════════════════════════════════════
// SWISS EDITORIAL PORTFOLIO — JavaScript
// Minimal, purposeful interactions only
// ═══════════════════════════════════════════════════════


// ── 1. NAVBAR SCROLL BEHAVIOR ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Solid white on scroll
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll progress bar
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';

  // Back to top visibility
  const bt = document.getElementById('back-top');
  if (window.scrollY > 400) {
    bt.classList.add('visible');
  } else {
    bt.classList.remove('visible');
  }

  // Active nav tracking
  updateActiveNav();
});


// ── 2. ACTIVE NAV LINK ──
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 160) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}


// ── 3. SCROLL REVEAL (IntersectionObserver) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
  revealObserver.observe(el);
});


// ── 4. HAMBURGER MENU ──
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


// ── 5. TOAST NOTIFICATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg || 'Disalin!'));
}


// ── 6. DOWNLOAD CV ──
function downloadCV(e) {
  e.preventDefault();
  showToast('📄 Mengunduh CV...');
  window.open('assets/docs/CVats.pdf', '_blank');
}


// ── 7. SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 8. PROFILE PHOTO FALLBACK ──
const profilePhoto = document.getElementById('profile-photo');
if (profilePhoto) {
  profilePhoto.addEventListener('error', function () {
    this.src = 'https://ui-avatars.com/api/?name=Nicholas+Devin&size=300&background=2563EB&color=fff&bold=true';
  });
}


// ── 9. PROJECT FILTERING ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    projectItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || filterValue === category) {
        item.classList.remove('hidden');
        // Small delay to allow CSS grid to recalculate before re-triggering animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        item.classList.add('hidden');
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
      }
    });
    
    // Re-trigger scroll observer for visible items
    setTimeout(() => {
      ScrollTrigger.refresh(); // if using GSAP, else just let the intersection observer handle it
    }, 100);
  });
});