(function () {
  'use strict';

  const app = {
    initialized: false,
    aosInitialized: false,
    burgerInitialized: false,
    anchorsInitialized: false,
    activeMenuInitialized: false,
    imagesInitialized: false,
    formsInitialized: false,
    animationsInitialized: false,
    scrollSpyInitialized: false,
    rippleInitialized: false,
    scrollTopInitialized: false,
    countUpInitialized: false,
    observerInitialized: false,
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const isMobile = () => window.innerWidth < 1024;

  app.initBurgerMenu = () => {
    if (app.burgerInitialized) return;
    app.burgerInitialized = true;

    const nav = document.querySelector('.c-nav#main-nav');
    const toggle = document.querySelector('.c-nav__toggle');

    if (!nav || !toggle) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('u-no-scroll');
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('u-no-scroll');
    };

    const toggleMenu = () => {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    const navLinks = nav.querySelectorAll('.c-nav__link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', debounce(() => {
      if (!isMobile()) {
        closeMenu();
      }
    }, 200));
  };

  app.initAnchors = () => {
    if (app.anchorsInitialized) return;
    app.anchorsInitialized = true;

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;

        const targetId = href.replace('#', '');
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const header = document.querySelector('.l-header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  };

  app.initScrollSpy = () => {
    if (app.scrollSpyInitialized) return;
    app.scrollSpyInitialized = true;

    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.c-nav__link[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -70% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  app.initActiveMenu = () => {
    if (app.activeMenuInitialized) return;
    app.activeMenuInitialized = true;

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.c-nav__link');

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute('href');
      if (!linkPath) return;

      let normalizedLinkPath = linkPath.replace(/^/+/, '');
      let normalizedCurrentPath = currentPath.replace(/^/+/, '');

      if (normalizedCurrentPath === '' || normalizedCurrentPath === 'index.html') {
        normalizedCurrentPath = '/';
      }
      if (normalizedLinkPath === '' || normalizedLinkPath === 'index.html') {
        normalizedLinkPath = '/';
      }

      if (
        normalizedLinkPath === normalizedCurrentPath ||
        (normalizedLinkPath === '/' && (normalizedCurrentPath === '/' || normalizedCurrentPath === 'index.html')) ||
        (linkPath !== '/' && normalizedCurrentPath.indexOf(normalizedLinkPath) === 0)
      ) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
    });
  };

  app.initImages = () => {
    if (app.imagesInitialized) return;
    app.imagesInitialized = true;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('loading')) {
        const isCritical = img.classList.contains('c-logo__img') || img.hasAttribute('data-critical');
        if (!isCritical) {
          img.setAttribute('loading', 'lazy');
        }
      }

      img.style.opacity = '0';
      img.style.transform = 'translateY(20px)';
      img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

      img.addEventListener('load', function () {
        this.style.opacity = '1';
        this.style.transform = 'translateY(0)';
      });

      img.addEventListener('error', function () {
        const svgPlaceholder =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
        this.src = svgPlaceholder;
        this.style.objectFit = 'contain';
      });

      if (img.complete) {
        img.style.opacity = '1';
        img.style.transform = 'translateY(0)';
      }
    });
  };

  app.initForms = () => {
    if (app.formsInitialized) return;
    app.formsInitialized = true;

    const forms = document.querySelectorAll('.c-form');
    forms.forEach((form) => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        let isValid = true;
        const errors = [];

        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const messageInput = form.querySelector('textarea[name="message"]');
        const privacyCheckbox = form.querySelector('input[name="privacy"]');

        const showError = (input, message) => {
          isValid = false;
          errors.push(message);
          input.classList.add('error');
          const errorDiv = input.parentElement.querySelector('.c-form__error') || document.createElement('div');
          errorDiv.className = 'c-form__error visible';
          errorDiv.textContent = message;
          if (!input.parentElement.querySelector('.c-form__error')) {
            input.parentElement.appendChild(errorDiv);
          }
        };

        const clearError = (input) => {
          input.classList.remove('error');
          const errorDiv = input.parentElement.querySelector('.c-form__error');
          if (errorDiv) {
            errorDiv.classList.remove('visible');
          }
        };

        [nameInput, emailInput, phoneInput, messageInput, privacyCheckbox].forEach((input) => {
          if (input) clearError(input);
        });

        if (nameInput) {
          const nameValue = nameInput.value.trim();
          const nameRegex = /^[a-zA-ZÀ-ÿs-']{2,50}$/;
          if (!nameValue) {
            showError(nameInput, 'Name field: Please enter your name.');
          } else if (!nameRegex.test(nameValue)) {
            showError(nameInput, 'Name field: Please enter a valid name (2-50 characters, letters only).');
          }
        }

        if (emailInput) {
          const emailValue = emailInput.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailValue) {
            showError(emailInput, 'Email field: Please enter your email address.');
          } else if (!emailRegex.test(emailValue)) {
            showError(emailInput, 'Email field: Please enter a valid email address.');
          }
        }

        if (phoneInput && phoneInput.value.trim()) {
          const phoneValue = phoneInput.value.trim();
          const phoneRegex = /^[\d\s\+\(\)\-]{10,20}$/;
          if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput, 'Phone field: Please enter a valid phone number (10-20 digits).');
          }
        }

        if (messageInput) {
          const messageValue = messageInput.value.trim();
          if (!messageValue) {
            showError(messageInput, 'Message field: Please enter your message.');
          } else if (messageValue.length < 10) {
            showError(messageInput, 'Message field: Message must be at least 10 characters long.');
          }
        }

        if (privacyCheckbox && !privacyCheckbox.checked) {
          showError(privacyCheckbox, 'Privacy policy: You must accept the privacy policy.');
        }

        if (!isValid) {
          const firstError = form.querySelector('.error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;"></span>Sending...';

          const style = document.createElement('style');
          style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
          document.head.appendChild(style);

          setTimeout(() => {
            window.location.href = 'thank_you.html';
          }, 1500);
        }
      });
    });
  };

  app.initRippleEffect = () => {
    if (app.rippleInitialized) return;
    app.rippleInitialized = true;

    const rippleElements = document.querySelectorAll('.c-button, .c-nav__link, .c-card__link, .btn');

    rippleElements.forEach((element) => {
      element.style.position = 'relative';
      element.style.overflow = 'hidden';

      element.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  app.initScrollAnimations = () => {
    if (app.observerInitialized) return;
    app.observerInitialized = true;

    const animatedElements = document.querySelectorAll('.c-card, .c-product-card, .c-testimonial, .c-icon-wrapper, .l-section__header');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
      observer.observe(element);
    });
  };

  app.initScrollToTop = () => {
    if (app.scrollTopInitialized) return;
    app.scrollTopInitialized = true;

    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--color-secondary);
      color: var(--color-text);
      border: none;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
      z-index: 999;
      box-shadow: var(--shadow-lg);
    `;

    document.body.appendChild(scrollBtn);

    const toggleButton = throttle(() => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
      } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
      }
    }, 200);

    window.addEventListener('scroll', toggleButton);

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    scrollBtn.addEventListener('mouseenter', () => {
      scrollBtn.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
      scrollBtn.style.transform = 'scale(1)';
    });
  };

  app.initCountUp = () => {
    if (app.countUpInitialized) return;
    app.countUpInitialized = true;

    const statElements = document.querySelectorAll('[data-count]');
    if (!statElements.length) return;

    const animateCount = (element) => {
      const target = parseInt(element.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          element.textContent = target;
        }
      };

      update();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statElements.forEach((el) => observer.observe(el));
  };

  app.initCardHoverEffects = () => {
    const cards = document.querySelectorAll('.c-card, .c-product-card, .card');

    cards.forEach((card) => {
      card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s ease-out';
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  };

  app.init = () => {
    if (app.initialized) return;
    app.initialized = true;

    app.initBurgerMenu();
    app.initAnchors();
    app.initScrollSpy();
    app.initActiveMenu();
    app.initImages();
    app.initForms();
    app.initRippleEffect();
    app.initScrollAnimations();
    app.initScrollToTop();
    app.initCountUp();
    app.initCardHoverEffects();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.init);
  } else {
    app.init();
  }
})();
# CSS Additions (add to style.css)

.u-no-scroll {
  overflow: hidden;
  height: 100vh;
}

@media (max-width: 1023px) {
  .c-nav.is-open {
    height: calc(100vh - var(--header-h));
  }
}

.c-button::after,
.c-nav__link::after,
.c-card__link::after,
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.c-button:hover::after,
.c-nav__link:hover::after,
.c-card__link:hover::after,
.btn:hover::after {
  opacity: 1;
  box-shadow: 0 0 20px rgba(255, 184, 0, 0.4);
}

.c-form__input.error,
.c-form__textarea.error,
.c-form__checkbox.error {
  border-color: var(--color-error);
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.c-card:hover .c-card__icon,
.c-product-card:hover .c-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  transition: transform 0.4s ease-out;
}

.c-testimonial:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.l-hero__title,
.l-hero__text {
  animation: fadeInUp 0.8s ease-out;
}

.l-hero__actions {
  animation: fadeInUp 1s ease-out 0.3s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.c-nav.is-open .c-nav__list {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.c-button--primary:active,
.btn-primary:active {
  transform: scale(0.95);
}

.c-card__link:hover,
.c-nav-footer__link:hover,
.l-location__link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
