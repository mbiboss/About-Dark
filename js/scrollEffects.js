/**
 * SCROLL EFFECTS ENGINE
 * Handles scroll-triggered animations and parallax effects
 */

class ScrollEffects {
  constructor() {
    this.scrollElements = document.querySelectorAll('[data-animate]');
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.lastScrollY = 0;
    this.ticking = false;
    
    this.init();
  }

  init() {
    // Initialize Intersection Observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Register elements for observation
    this.scrollElements.forEach(el => {
      this.observer.observe(el);
    });

    // Setup scroll event for parallax
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    this.lastScrollY = window.scrollY;
    
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateParallax() {
    const scrollPosition = this.lastScrollY;
    
    this.parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const offset = scrollPosition * speed;
      
      if (el.dataset.parallaxAxis === 'horizontal') {
        el.style.transform = `translateX(${offset}px)`;
      } else {
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  // Smooth scroll to section
  scrollTo(target, duration = 800) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    
    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}
