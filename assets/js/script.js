/**
 * Dharani A - Personal Portfolio Interactive JavaScript
 * Preloader, Animations, ScrollSpy & Form Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Handling with Fail-safe Timeout
  const preloader = document.getElementById('preloader');

  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }
  };

  // Hide when page fully loads
  window.addEventListener('load', hidePreloader);

  // Fallback safety: guarantee preloader hides after max 1.8 seconds even if external assets take longer
  setTimeout(hidePreloader, 1800);

  // 2. Typing Animation Effect for Hero Section
  const typedElement = document.querySelector('.typed-text');
  if (typedElement) {
    const words = [
      "Full Stack Developer",
      "Mobile Application Developer",
      "Flutter & Dart Specialist",
      "Laravel & REST API Architect",
      "Database Optimization Engineer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeEffect() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2200; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // 3. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Animate skill bar inside if present
          const skillFill = entry.target.querySelector('.skill-bar-fill');
          if (skillFill) {
            const level = skillFill.getAttribute('data-level') || '90%';
            skillFill.style.width = level;
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 4. Sticky Navbar & Active Link ScrollSpy
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Sticky navbar backdrop
    if (scrollPos > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollPos > 300) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // ScrollSpy active link toggle
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Skills Category Filter Functionality
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-item-col');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5.1 Project Category Filter Functionality
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectItemCols = document.querySelectorAll('.project-item-col');

  function applyProjectFilter(filterValue) {
    projectItemCols.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(' ');
      if (filterValue === 'all' || categories.includes(filterValue)) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 200);
      }
    });
  }

  // Ensure all projects load and display automatically on page load/refresh
  applyProjectFilter('all');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      applyProjectFilter(filterValue);
    });
  });

  // 6. Contact Form Submission Handler
  const contactForm = document.getElementById('portfolioContactForm');
  const toastNotification = document.getElementById('customToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon me-2"></i> Sending...`;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Message Sent!`;
        
        showToast("Message sent successfully! Dharani will reach out to you shortly.");

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3500);
      }, 1200);
    });
  }

  function showToast(message) {
    if (!toastNotification) return;
    const toastText = toastNotification.querySelector('.toast-msg');
    if (toastText) toastText.textContent = message;

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  }

  // 7. Smooth Scroll for Navbar & Footer Links
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        
        // Collapse mobile nav if expanded
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          } else {
            navbarCollapse.classList.remove('show');
          }
        }

        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
