/**
 * The Brownstone Villa - Interactive Script
 * Premium Website Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    HeroAnimations.init();
    ScrollAnimations.init();
    GalleryInteractions.init();
    TestimonialCarousel.init();
    ContactForm.init();
    BackToTop.init();
    SmoothScroll.init();
});

/**
 * Preloader Module
 */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 1800);
        });

        // Fallback: hide preloader after 3 seconds regardless
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 3000);
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    navbar: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,
    sections: [],

    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (!this.navbar) return;

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveLink();
        this.setupNavLinks();
    },

    setupScrollEffect() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    setupMobileMenu() {
        if (!this.navToggle) return;

        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    },

    setupActiveLink() {
        this.sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollPos = window.pageYOffset + 100;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    },

    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
    }
};

/**
 * Hero Animations Module
 */
const HeroAnimations = {
    init() {
        this.setupParallax();
        this.setupFeatureCount();
    },

    setupParallax() {
        const heroContent = document.querySelector('.hero-content');
        const heroBg = document.querySelector('.hero-bg');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    },

    setupFeatureCount() {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateCount = (element) => {
            const text = element.textContent;
            const hasPlus = text.includes('+');
            const hasKm = text.includes('km');
            const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
            
            let current = 0;
            const increment = numericValue / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (hasPlus) displayValue += '+';
                if (hasKm) displayValue += 'km';
                
                element.textContent = displayValue;
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }
};

/**
 * Scroll Animations Module
 */
const ScrollAnimations = {
    init() {
        this.setupIntersectionObserver();
        this.setupAmenityCards();
    },

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.amenity-card, .gallery-item, .event-card, .info-card').forEach(el => {
            observer.observe(el);
        });
    },

    setupAmenityCards() {
        const cards = document.querySelectorAll('.amenity-card');
        
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
        });
    }
};

/**
 * Testimonial Carousel Module
 */
const TestimonialCarousel = {
    track: null,
    cards: [],
    currentIndex: 0,
    cardsPerView: 3,
    autoplayInterval: null,
    autoplayDelay: 5000,

    init() {
        this.track = document.getElementById('testimonialTrack');
        if (!this.track) return;

        this.cards = Array.from(this.track.querySelectorAll('.testimonial-card'));
        const prevBtn = document.getElementById('testimonialPrev');
        const nextBtn = document.getElementById('testimonialNext');
        const dotsContainer = document.getElementById('testimonialDots');

        this.updateCardsPerView();
        this.createDots(dotsContainer);
        this.updateCarousel();
        this.setupEvents(prevBtn, nextBtn, dotsContainer);
        this.startAutoplay();
    },

    updateCardsPerView() {
        const w = window.innerWidth;
        if (w <= 768) this.cardsPerView = 1;
        else if (w <= 1024) this.cardsPerView = 2;
        else this.cardsPerView = 3;
    },

    createDots(container) {
        if (!container) return;
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        container.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.currentIndex = i * this.cardsPerView;
                this.updateCarousel();
                this.updateDots();
                this.resetAutoplay();
            });
            container.appendChild(dot);
        }
    },

    updateDots() {
        const dots = document.querySelectorAll('.testimonial-dot');
        const slideIndex = Math.floor(this.currentIndex / this.cardsPerView);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
        });
    },

    updateCarousel() {
        if (!this.track || !this.cards.length) return;
        const card = this.cards[0];
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 24;
        const offset = this.currentIndex * (cardWidth + gap);
        this.track.style.transform = `translateX(-${offset}px)`;

        const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, maxIndex);
    },

    setupEvents(prevBtn, nextBtn, dotsContainer) {
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentIndex = Math.max(0, this.currentIndex - 1);
                this.updateCarousel();
                this.updateDots();
                this.resetAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
                this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
                this.updateCarousel();
                this.updateDots();
                this.resetAutoplay();
            });
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCardsPerView();
                this.createDots(dotsContainer);
                this.currentIndex = 0;
                this.updateCarousel();
            }, 250);
        });

        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }

        let touchStartX = 0;
        let touchEndX = 0;
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            this.track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
                        this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
                    } else {
                        this.currentIndex = Math.max(0, this.currentIndex - 1);
                    }
                    this.updateCarousel();
                    this.updateDots();
                    this.resetAutoplay();
                }
            }, { passive: true });
        }
    },

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
            if (this.currentIndex >= maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateCarousel();
            this.updateDots();
        }, this.autoplayDelay);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    },

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
};

/**
 * Gallery Interactions Module
 */
const GalleryInteractions = {
    init() {
        this.setupHoverEffects();
        this.setupLazyLoad();
    },

    setupHoverEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });

            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    },

    setupLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

/**
 * Contact Form Module
 */
const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        this.setupFormValidation(form);
        this.setupFormSubmission(form);
    },

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                this.classList.add('touched');
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('touched')) {
                    this.classList.remove('error');
                }
            });
        });
    },

    setupFormSubmission(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                return;
            }

            // Show success message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span>';
                submitBtn.classList.add('success');

                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }
};

/**
 * Back to Top Module
 */
const BackToTop = {
    init() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

/**
 * Smooth Scroll Module
 */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Utility Functions
 */
const Utils = {
    debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    throttle(func, limit = 100) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * Performance Optimizations
 */
// Lazy load images with data-src
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Optimize scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based updates here
            ticking = false;
        });
        ticking = true;
    }
});

/**
 * WhatsApp Integration Enhancement
 */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Track WhatsApp clicks (analytics placeholder)
        console.log('WhatsApp clicked:', this.href);
    });
});

/**
 * Phone Call Integration
 */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone clicks (analytics placeholder)
        console.log('Phone clicked:', this.href);
    });
});

/**
 * Accessibility Enhancements
 */
// Trap focus in mobile menu when open
document.addEventListener('keydown', function(e) {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.focus();
        }
    }
});

// Add skip link functionality
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Error Handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Graceful degradation - ensure basic functionality works
});

/**
 * Console Branding
 */
console.log('%c The Brownstone Villa ', 'background: #1a1a1a; color: #c9a96e; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Timeless Luxury Living in Jaipur ', 'color: #666; font-size: 12px;');
console.log('%c Contact: +91 89499 41897 | +91 93146 72972 ', 'color: #999; font-size: 10px;');
