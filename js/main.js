document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Hamburger Menu Toggle
    const nav = document.querySelector('.nav');
    const headerContent = document.querySelector('.header-content');
    
    // Create Hamburger Button
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.classList.add('hamburger-btn');
    hamburgerBtn.setAttribute('aria-label', 'Menu Menu');
    hamburgerBtn.innerHTML = `
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
        <span class="bar bar-3"></span>
    `;

    // Insert before nav, after logo
    nav.parentNode.insertBefore(hamburgerBtn, nav);

    hamburgerBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a:not(.dropbtn)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        });
    });

    // Dropdown toggle on mobile
    const dropBtns = document.querySelectorAll('.dropbtn');
    dropBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                btn.parentElement.classList.toggle('active');
            }
        });
    });

    // 2. Scroll Reveal Animations (Staggered & Simple)
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade');
    const revealGroups = document.querySelectorAll('.reveal-group');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            if (entry.target.classList.contains('reveal-group')) {
                const items = entry.target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 150); // 150ms stagger
                });
            } else {
                entry.target.classList.add('active');
            }
            
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    revealGroups.forEach(group => {
        revealOnScroll.observe(group);
    });

    // 3. Accordion Logic
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            // Toggle active class on the button
            this.classList.toggle('active');
            
            // Toggle the '+' / '-' icon
            const icon = this.querySelector('span');
            if (icon) {
                icon.textContent = this.classList.contains('active') ? '-' : '+';
            }

            // Expand / Collapse content
            const content = this.nextElementSibling;
            if (this.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0px";
            }
        });
    });

    // 4. Swiper Initialization for Blog Carousel
    if (typeof Swiper !== 'undefined') {
        const blogSwiper = new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                950: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }

});
