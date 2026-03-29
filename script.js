/* ===== SPLASH SCREEN ===== */
// Dismiss splash after 3s and reveal main site
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hide');
    document.getElementById('site').classList.add('show');
  }, 3000);
});

/* ===== HERO SLIDESHOW ===== */
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 4500);

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== NAVBAR ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

function closeNav() {
  navLinks.classList.remove('open');
}

// Shrink nav on scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 60) {
    navbar.style.padding = '0.7rem 3rem';
  } else {
    navbar.style.padding = '';
  }
});

/* ===== AUTH MODAL ===== */
const authModal = document.getElementById('authModal');

function openModal() {
  authModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  authModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('openAuth').addEventListener('click', (e) => {
  e.preventDefault();
  switchTab('login');
  openModal();
});

document.getElementById('openAuth2').addEventListener('click', (e) => {
  e.preventDefault();
  switchTab('signup');
  openModal();
});

document.getElementById('openAuth3').addEventListener('click', (e) => {
  e.preventDefault();
  switchTab('signup');
  openModal();
});

document.getElementById('closeModal').addEventListener('click', closeAuthModal);

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});

function switchTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('tabLogin').className  = 'tab-btn' + (tab === 'login'  ? ' active' : '');
  document.getElementById('tabSignup').className = 'tab-btn' + (tab === 'signup' ? ' active' : '');
}

document.getElementById('tabLogin').addEventListener('click',  () => switchTab('login'));
document.getElementById('tabSignup').addEventListener('click', () => switchTab('signup'));

/* ===== PASSWORD UTILS ===== */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}

function updateStrength() {
  const val = document.getElementById('signupPass').value;
  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  fill.className = 'strength-fill strength-' + score;

  const labels = [
    'Enter a password',
    'Weak — try longer',
    'Fair — add numbers',
    'Good — add symbols',
    'Strong password! ✓'
  ];
  const colors = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];

  label.textContent   = labels[score];
  label.style.color   = colors[score] || 'rgba(240,237,230,0.6)';

  checkMatch();
}

function checkMatch() {
  const p1   = document.getElementById('signupPass').value;
  const p2   = document.getElementById('signupPass2').value;
  const hint = document.getElementById('matchHint');

  if (!p2) {
    hint.textContent  = 'Passwords must match';
    hint.className    = 'form-hint';
    hint.style.color  = '';
    return;
  }

  if (p1 === p2) {
    hint.textContent = '✓ Passwords match';
    hint.className   = 'form-hint valid';
    hint.style.color = '';
  } else {
    hint.textContent = '✗ Passwords do not match';
    hint.className   = 'form-hint';
    hint.style.color = '#e74c3c';
  }
}

/* ===== FORM HANDLERS ===== */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  if (!email || !pass)         { showToast('Please fill in all fields.'); return; }
  if (!email.includes('@'))    { showToast('Please enter a valid email.'); return; }

  closeAuthModal();
  showToast('Welcome back to Lawis Beach! 🌊');
}

function handleSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const p1    = document.getElementById('signupPass').value;
  const p2    = document.getElementById('signupPass2').value;

  if (!name || !email || !p1 || !p2) { showToast('Please fill in all fields.'); return; }
  if (!email.includes('@'))           { showToast('Please enter a valid email.'); return; }
  if (p1.length < 6)                  { showToast('Password must be at least 6 characters.'); return; }
  if (p1 !== p2)                      { showToast('Passwords do not match.'); return; }

  closeAuthModal();
  showToast('Welcome to Lawis Beach, ' + name.split(' ')[0] + '! 🎉');
}

/* ===== GALLERY LIGHTBOX ===== */
const galleryImgs = [];

document.querySelectorAll('.gallery-item img').forEach((img, i) => {
  galleryImgs.push(img.src);
  img.parentElement.addEventListener('click', () => openLightbox(i));
});

let lbIdx = 0;

function openLightbox(i) {
  lbIdx = i;
  document.getElementById('lightboxImg').src = galleryImgs[lbIdx];
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lbIdx = (lbIdx + dir + galleryImgs.length) % galleryImgs.length;
  document.getElementById('lightboxImg').src = galleryImgs[lbIdx];
}

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape')     closeLightbox();
});

/* ===== PHOTO UPLOAD ===== */
const uploadZone    = document.getElementById('uploadZone');
const uploadInput   = document.getElementById('uploadInput');
const communityGrid = document.getElementById('community-gallery');

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  handleFiles(e.dataTransfer.files);
});

uploadInput.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      addCommunityPhoto(e.target.result);
      showToast('📸 Your photo has been shared!');
    };
    reader.readAsDataURL(file);
  });
}

function addCommunityPhoto(src) {
  // Clear empty state
  const empty = communityGrid.querySelector('.community-empty');
  if (empty) empty.remove();

  galleryImgs.push(src);
  const idx = galleryImgs.length - 1;

  const div = document.createElement('div');
  div.className = 'community-photo';
  div.innerHTML = `<img src="${src}" alt="Community photo"><span class="photo-badge">New ✨</span>`;
  div.addEventListener('click', () => openLightbox(idx));
  communityGrid.appendChild(div);

  // Remove badge after 5s
  setTimeout(() => {
    const badge = div.querySelector('.photo-badge');
    if (badge) badge.style.display = 'none';
  }, 5000);
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
