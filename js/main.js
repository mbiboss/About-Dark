// ========================
// QUANTUM INTERACTION ENGINE
// ========================

class QuantumPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupParticles();
    this.setupAnimations();
    this.setupSmoothScrolling();
    this.setupMagneticButtons();
    this.setupFormValidation();
  }

  setupTheme() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.html = document.documentElement;
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('quantum-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.html.setAttribute('data-theme', savedTheme);
    } else {
      this.html.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
    
    this.themeToggle.addEventListener('click', () => {
      const currentTheme = this.html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.html.setAttribute('data-theme', newTheme);
      localStorage.setItem('quantum-theme', newTheme);
      
      // Dispatch event for other components
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    });
  }

  setupParticles() {
    // Initialize quantum particles canvas
    this.particlesCanvas = document.getElementById('quantum-particles');
    if (!this.particlesCanvas) return;
    
    this.ctx = this.particlesCanvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 30 : 80;
    
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    
    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.particlesCanvas.width,
        y: Math.random() * this.particlesCanvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `hsla(${Math.random() * 60 + 270}, 80%, 70%, ${Math.random() * 0.5 + 0.1})`
      });
    }
    
    // Start animation
    this.animateParticles();
  }

  animateParticles() {
    this.ctx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.particlesCanvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.particlesCanvas.height) particle.speedY *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      // Draw connections
      this.drawConnections(particle);
    });
    
    requestAnimationFrame(this.animateParticles.bind(this));
  }

  drawConnections(particle) {
    this.particles.forEach(p => {
      const distance = Math.sqrt(
        Math.pow(particle.x - p.x, 2) + 
        Math.pow(particle.y - p.y, 2)
      );
      
      if (distance < 150) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `hsla(270, 80%, 70%, ${1 - distance / 150})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
      }
    });
  }

  resizeCanvas() {
    this.particlesCanvas.width = window.innerWidth;
    this.particlesCanvas.height = window.innerHeight;
  }

  setupAnimations() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-animate]').forEach(el => {
      this.observer.observe(el);
    });
  }

  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 100;
      
      document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const id = section.getAttribute('id');
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    });
  }

  setupMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        
        gsap.to(button, {
          x: (x - centerX) * 0.3,
          y: (y - centerY) * 0.3,
          rotate: angle * 0.05,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        submitBtn.textContent = '✓ Sent!';
        form.reset();
        
        // Create confetti effect
        this.createConfetti();
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } catch (error) {
        submitBtn.textContent = 'Error!';
        console.error('Form submission error:', error);
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }

  createConfetti() {
    const confettiCount = 100;
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.borderRadius = '50%';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-10px';
      confetti.style.opacity = '0.8';
      confettiContainer.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
        delay: Math.random() * 1000
      });
      
      animation.onfinish = () => {
        confetti.remove();
        if (confettiContainer.children.length === 0) {
          confettiContainer.remove();
        }
      };
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QuantumPortfolio();
});
