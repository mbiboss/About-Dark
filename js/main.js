/**
 * QUANTUM PORTFOLIO CORE
 * Modern ES6 implementation with theme switching,
 * particle system initialization, and core interactions
 */

class QuantumPortfolio {
  constructor() {
    this.initElements();
    this.initTheme();
    this.initEventListeners();
    this.initComponents();
  }

  initElements() {
    // DOM elements
    this.themeToggle = document.querySelector('.theme-toggle');
    this.html = document.documentElement;
    this.navLinks = document.querySelectorAll('.nav-link');
    this.buttons = document.querySelectorAll('.btn-cyber, .btn-download');
  }

  initTheme() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('quantum-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.html.setAttribute('data-theme', initialTheme);
  }

  initEventListeners() {
    // Theme toggle
    this.themeToggle?.addEventListener('click', () => {
      const currentTheme = this.html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.html.setAttribute('data-theme', newTheme);
      localStorage.setItem('quantum-theme', newTheme);
    });

    // Navigation active state
    window.addEventListener('scroll', () => this.highlightActiveNavLink());

    // Button ripple effects
    this.buttons.forEach(button => {
      button.addEventListener('click', this.createRippleEffect);
    });
  }

  initComponents() {
    // Initialize particle system if element exists
    if (document.getElementById('quantum-particles')) {
      new QuantumParticles('quantum-particles');
    }

    // Initialize scroll effects
    this.scrollEffects = new ScrollEffects();
  }

  highlightActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        this.navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QuantumPortfolio();
});
