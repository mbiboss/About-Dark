/**
 * QUANTUM PARTICLE SYSTEM
 * Interactive particle network with mouse attraction
 */

class QuantumParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 30 : 80;
    this.mouse = { x: null, y: null, radius: 120 };
    
    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        baseSize: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: `hsla(${Math.random() * 60 + 270}, 80%, 70%, ${Math.random() * 0.3 + 0.1})`,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 50 + 20,
        orbitSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
      this.drawConnections(particle);
    });
    
    requestAnimationFrame(() => this.animate());
  }

  updateParticle(particle) {
    // Orbit animation
    particle.orbitAngle += particle.orbitSpeed;
    const targetX = particle.x + Math.cos(particle.orbitAngle) * particle.orbitRadius;
    const targetY = particle.y + Math.sin(particle.orbitAngle) * particle.orbitRadius;
    
    // Mouse interaction
    if (this.mouse.x && this.mouse.y) {
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushForce = force * 5;
        
        particle.x += Math.cos(angle) * pushForce;
        particle.y += Math.sin(angle) * pushForce;
        particle.size = particle.baseSize * (1 + force * 0.5);
      } else {
        particle.size = particle.baseSize;
      }
    }
    
    // Smooth movement to target
    particle.x += (targetX - particle.x) * 0.05;
    particle.y += (targetY - particle.y) * 0.05;
    
    // Boundary check
    if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
  }

  drawParticle(particle) {
    // Particle core
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.fill();
    
    // Glow effect
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'rgba(123, 44, 191, 0)');
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  drawConnections(particle) {
    this.particles.forEach(p => {
      const dx = particle.x - p.x;
      const dy = particle.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const opacity = 1 - distance / 150;
        this.ctx.beginPath();
        this.ctx.strokeStyle = `hsla(270, 80%, 70%, ${opacity * 0.3})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
      }
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
}
