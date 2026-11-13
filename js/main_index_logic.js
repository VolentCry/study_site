(function() {
// --- 1. USER XP SYNCHRONIZATION ---
function updateHeaderXP() {
    try {
    const storedXP = localStorage.getItem('user_xp') || '0';
    const headerBadge = document.getElementById('header-xp-badge');
    if (headerBadge) {
        headerBadge.textContent = 'XP +' + storedXP;
    }
    } catch (e) {
    console.warn('Storage access:', e);
    }
}
updateHeaderXP();
window.addEventListener('study-cloud-synced', updateHeaderXP);
window.addEventListener('storage', updateHeaderXP);

// --- 2. BACK TO TOP SMOOTH ACTION ---
const bttBtn = document.getElementById('btn-back-to-top');
if (bttBtn) {
    bttBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- 3. MOUSE SPOTLIGHT ON CARDS ---
const cards = document.querySelectorAll('.subject-card');
cards.forEach(card => {
    card.addEventListener('pointermove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
    });
});

// --- 4. HIGH-PERFORMANCE 3D DEPTH ORBITAL CANVAS STAGE ---
const canvas = document.getElementById('cosmic-stage');
if (!canvas) return;
const ctx = canvas.getContext('2d');
if (!ctx) return;

let width = 0;
let height = 0;
let animationId = null;
let isVisible = true;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize, { passive: true });
resize();

// 3D Particles & Orbital Resonance Field
const fov = 420;
const particles = [];
const particleCount = Math.min(Math.floor((width * height) / 16000), 65);

class CelestialBody {
    constructor() {
    this.orbitRadius = Math.random() * (width * 0.38) + 70;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = (Math.random() * 0.0008 + 0.0004) * (Math.random() > 0.5 ? 1 : -1);
    this.yOffset = (Math.random() - 0.5) * 120;
    this.baseSize = Math.random() * 1.8 + 0.8;
    this.color = Math.random() > 0.65 ? '#ff7728' : '#2ce6d6';
    this.alpha = Math.random() * 0.6 + 0.25;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    }
    update(tiltX, tiltY, pointerX, pointerY, pointerActive) {
    if (reducedMotion) return;
    this.angle += this.speed;

    // 3D Orbital transformation with perspective projection
    const rawX = Math.cos(this.angle) * this.orbitRadius;
    const rawZ = Math.sin(this.angle) * this.orbitRadius;
    const rawY = this.yOffset + Math.sin(this.angle * 2) * 25;

    // Apply interactive tilt matrix
    const cosT = Math.cos(tiltX);
    const sinT = Math.sin(tiltX);
    const projZ = rawZ * cosT - rawY * sinT + 400;
    const projY = rawZ * sinT + rawY * cosT;

    this.scale = Math.max(0.2, fov / (fov + projZ * 0.6));
    
    const centerX = width * 0.62 + tiltY * 40;
    const centerY = height * 0.46;

    let targetX = centerX + rawX * this.scale;
    let targetY = centerY + projY * this.scale;

    // Gravitational Pointer Field
    if (pointerActive) {
        const dx = pointerX - targetX;
        const dy = pointerY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
        const pull = (200 - dist) / 200 * 2.2;
        targetX += (dx / dist) * pull;
        targetY += (dy / dist) * pull;
        }
    }

    this.x += (targetX - this.x) * 0.08;
    this.y += (targetY - this.y) * 0.08;
    }
    draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseSize * this.scale, 0, Math.PI * 2);
    ctx.fillStyle = this.color === '#ff7728'
        ? `rgba(255, 119, 40, ${this.alpha * this.scale})`
        : `rgba(44, 230, 214, ${this.alpha * this.scale})`;
    ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new CelestialBody());
}

let pointer = { x: -1000, y: -1000, active: false };
let tilt = { x: 0.35, y: 0 };
let targetTilt = { x: 0.35, y: 0 };

window.addEventListener('pointermove', function(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;

    const normX = (pointer.x / width) - 0.5;
    const normY = (pointer.y / height) - 0.5;
    targetTilt.x = 0.35 + normY * 0.2;
    targetTilt.y = normX * 0.3;
}, { passive: true });

window.addEventListener('pointerleave', function() {
    pointer.active = false;
    targetTilt.x = 0.35;
    targetTilt.y = 0;
});

let ringRotation = 0;
function renderScene() {
    ctx.clearRect(0, 0, width, height);

    // Eased tilt interpolation
    tilt.x += (targetTilt.x - tilt.x) * 0.04;
    tilt.y += (targetTilt.y - tilt.y) * 0.04;

    const centerX = width * 0.62 + tilt.y * 40;
    const centerY = height * 0.46;

    // Central Radiant Core (Solar Well)
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 90);
    coreGrad.addColorStop(0, 'rgba(255, 119, 40, 0.2)');
    coreGrad.addColorStop(0.5, 'rgba(44, 230, 214, 0.06)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
    ctx.fill();

    // Draw 3D-angled orbital paths
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(tilt.y * 0.4);

    const orbits = [
    { r: 120, color: 'rgba(255, 255, 255, 0.04)', node: '#2ce6d6', speed: 0.8 },
    { r: 230, color: 'rgba(255, 119, 40, 0.18)', node: '#ff7728', speed: 0.5 },
    { r: 360, color: 'rgba(44, 230, 214, 0.08)', node: '#2ce6d6', speed: 0.35 },
    { r: 500, color: 'rgba(255, 255, 255, 0.03)', node: '#ffaa75', speed: 0.2 }
    ];

    orbits.forEach((orb, i) => {
    ctx.beginPath();
    ctx.ellipse(0, 0, orb.r, orb.r * Math.sin(tilt.x), 0, 0, Math.PI * 2);
    ctx.strokeStyle = orb.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Orbiting Planet / Atomic Node
    if (!reducedMotion) {
        const nodeAngle = ringRotation * orb.speed + i * 1.5;
        const nx = Math.cos(nodeAngle) * orb.r;
        const ny = Math.sin(nodeAngle) * (orb.r * Math.sin(tilt.x));
        
        ctx.beginPath();
        ctx.arc(nx, ny, i === 1 ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = orb.node;
        ctx.shadowColor = orb.node;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    });
    ctx.restore();

    // Connect neighbouring particles with subtle energy vectors
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 75) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 119, 40, ${0.1 * (1 - dist / 75)})`;
        ctx.stroke();
        }
    }
    }

    // Update & Draw Particles with 3D projection
    for (let p of particles) {
    p.update(tilt.x, tilt.y, pointer.x, pointer.y, pointer.active);
    p.draw();
    }

    ringRotation += 0.007;

    if (isVisible && !reducedMotion) {
    animationId = requestAnimationFrame(renderScene);
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    isVisible = entry.isIntersecting;
    if (isVisible && !reducedMotion && !animationId) {
        animationId = requestAnimationFrame(renderScene);
    } else if (!isVisible && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    });
}, { threshold: 0.05 });

observer.observe(canvas);
renderScene();
})();