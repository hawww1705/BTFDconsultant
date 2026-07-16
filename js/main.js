/**
 * BTFD Professional Corporate Website - Main JavaScript
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Sticky Header & Active Navigation Link
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.remove('transparent');
            header.classList.add('scrolled');
        } else {
            // Keep transparent only if on pages with transparent header setups (e.g. Home page on top)
            // But we check if the body has class 'has-transparent-hero'
            if (document.body.classList.contains('has-transparent-hero')) {
                header.classList.remove('scrolled');
                header.classList.add('transparent');
            } else {
                header.classList.remove('transparent');
                header.classList.add('scrolled');
            }
        }
    }
    
    // Initial call
    checkHeaderScroll();
    window.addEventListener('scroll', checkHeaderScroll);

    // Active link highlighting on scroll (for one-page section links if any)
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // ----------------------------------------------------
    // 2. Mobile Hamburger Menu Toggle
    // ----------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Toggle body scroll lock
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ----------------------------------------------------
    // 3. Intersection Observer for Scroll Animations
    // ----------------------------------------------------
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });

    // ----------------------------------------------------
    // 4. Animated Statistics Counters
    // ----------------------------------------------------
    const counterElements = document.querySelectorAll('.counter');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // Add custom suffixes (e.g. +, %, etc.) if present in data-suffix attribute
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.textContent = current + suffix;
        }, stepTime);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ----------------------------------------------------
    // 5. Testimonial Slider / Carousel
    // ----------------------------------------------------
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (slider && slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Clear manual HTML placeholder dots and create them dynamically
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(index) {
            currentSlide = index;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            let next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }
        
        // Auto Play
        let slideInterval = setInterval(nextSlide, 6000);
        
        function resetAutoPlay() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        }
    }

    // ----------------------------------------------------
    // 6. Accordion FAQs
    // ----------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');
            
            // Close all other accordions first
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                accordionItem.classList.add('active');
                // Calculate actual content height for smooth transition
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // ----------------------------------------------------
    // 7. Contact Form Validation and Success Dialog
    // ----------------------------------------------------
    const contactForm = document.getElementById('btfd-contact-form');
    const formMessage = document.getElementById('form-message-response');
    
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get inputs
            const nameInput = document.getElementById('name');
            const companyInput = document.getElementById('company');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fill in all required fields (Name, Email, Message).';
                return;
            }
            
            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please enter a valid email address.';
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Message...';
            
            setTimeout(() => {
                // Done simulating
                formMessage.className = 'form-message success';
                formMessage.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. We will contact you shortly.`;
                
                // Reset fields
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Hide response after 10 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 10000);
            }, 15000 / 10); // 1.5 seconds mock delay
        });
    }
});
