/* =============================================
   LOVE WEBSITE — script.js
   Romantic interactions & animations
   ============================================= */

// ── Custom Cursor ──────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail follow
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor grow on hover
document.querySelectorAll('a, button, .reason-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.2)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});


// ── Ambient Canvas Background ──────────────────
const canvas = document.getElementById('ambient');
const ctx    = canvas.getContext('2d');
let W, H, orbs = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Soft glowing orbs
function createOrbs() {
  orbs = [];
  const colors = ['rgba(248,187,208,', 'rgba(244,143,177,', 'rgba(233,30,140,', 'rgba(240,200,220,'];
  for (let i = 0; i < 6; i++) {
    orbs.push({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   120 + Math.random() * 200,
      dx:  (Math.random() - 0.5) * 0.4,
      dy:  (Math.random() - 0.5) * 0.4,
      col: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.12 + Math.random() * 0.12,
    });
  }
}
createOrbs();
window.addEventListener('resize', createOrbs);

function drawAmbient() {
  ctx.clearRect(0, 0, W, H);
  orbs.forEach(o => {
    o.x += o.dx;
    o.y += o.dy;
    if (o.x < -o.r || o.x > W + o.r) o.dx *= -1;
    if (o.y < -o.r || o.y > H + o.r) o.dy *= -1;

    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0,   o.col + o.alpha + ')');
    g.addColorStop(1,   o.col + '0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawAmbient);
}
drawAmbient();


// ── Falling Petals ─────────────────────────────
const petalsLayer = document.getElementById('petals-layer');
const petalEmoji  = ['🌸','🌺','🌷','💮','✿','❀','🌹'];

function spawnPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
  p.style.left     = Math.random() * 100 + 'vw';
  p.style.fontSize = (10 + Math.random() * 16) + 'px';
  const dur = 7 + Math.random() * 9;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay    = (Math.random() * 4) + 's';
  petalsLayer.appendChild(p);
  setTimeout(() => p.remove(), (dur + 4) * 1000);
}

// Spawn petals periodically
setInterval(spawnPetal, 600);
for (let i = 0; i < 12; i++) spawnPetal();


// ── Scroll Reveal — Cards ─────────────────────
const cards = document.querySelectorAll('.reason-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card  = entry.target;
      const index = parseInt(card.dataset.index) || 1;
      setTimeout(() => card.classList.add('visible'), index * 90);
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.15 });

cards.forEach(c => cardObserver.observe(c));


// ── Scroll Reveal — Quote ─────────────────────
const quoteInner = document.getElementById('quote-inner');

const quoteObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      quoteInner.classList.add('visible');
      quoteObserver.unobserve(quoteInner);
    }
  });
}, { threshold: 0.3 });

if (quoteInner) quoteObserver.observe(quoteInner);


// ── Floating Hearts in Closing ─────────────────
const closingHearts = document.getElementById('closing-hearts');
const heartEmoji    = ['💕','💖','💗','💓','💞','🩷','❤️','💝'];

function spawnFloatHeart() {
  const h = document.createElement('div');
  h.className = 'float-heart';
  h.textContent = heartEmoji[Math.floor(Math.random() * heartEmoji.length)];
  h.style.left             = (10 + Math.random() * 80) + '%';
  h.style.bottom           = (Math.random() * 20) + '%';
  h.style.fontSize         = (14 + Math.random() * 20) + 'px';
  const dur = 3 + Math.random() * 4;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay    = (Math.random() * 2) + 's';
  closingHearts.appendChild(h);
  setTimeout(() => h.remove(), (dur + 2) * 1000);
}

const closingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setInterval(spawnFloatHeart, 500);
      closingObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (closingHearts) closingObserver.observe(closingHearts);


// ── Kiss Button Burst ──────────────────────────
const loveBtn   = document.getElementById('love-btn');
const kissBurst = document.getElementById('kiss-burst');
const kissEmoji = ['💋','💕','💖','🌸','✨','💗','💞','🩷'];

loveBtn.addEventListener('click', () => {
  const rect = loveBtn.getBoundingClientRect();
  const cx   = rect.left + rect.width / 2;
  const cy   = rect.top  + rect.height / 2;

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('div');
    particle.className = 'kiss-particle';
    particle.textContent = kissEmoji[Math.floor(Math.random() * kissEmoji.length)];

    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
    const dist  = 80 + Math.random() * 140;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const tr    = (Math.random() - 0.5) * 360 + 'deg';

    particle.style.left = cx + 'px';
    particle.style.top  = cy + 'px';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.setProperty('--tr', tr);
    particle.style.fontSize = (18 + Math.random() * 18) + 'px';

    kissBurst.appendChild(particle);
    setTimeout(() => particle.remove(), 1300);
  }

  // Shake button briefly
  loveBtn.style.animation = 'none';
  loveBtn.style.transform = 'scale(0.92)';
  setTimeout(() => { loveBtn.style.transform = ''; }, 120);
});


// ── Card tilt on mouse move ────────────────────
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) scale(1.02) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
  });
});


// ── Sparkle trail on mouse (subtle) ───────────
let sparkleTimeout;
document.addEventListener('mousemove', (e) => {
  clearTimeout(sparkleTimeout);
  sparkleTimeout = setTimeout(() => {
    const s = document.createElement('div');
    s.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px; height: 4px;
      background: var(--petal, #f48fb1);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9995;
      transform: translate(-50%,-50%);
      animation: sparkle 0.7s ease forwards;
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }, 30);
});

// Inject sparkle keyframe
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkle {
    0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
    100% { transform: translate(-50%,-50%) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(sparkleStyle);


// ── Page load stagger ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '1';
  });
});
