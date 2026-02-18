/* ============================================================
   SACHIN PATIL — Portfolio Scripts
   Typing effect, counters, scroll reveal
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. TYPING EFFECT
       ---------------------------------------------------------- */
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = [
            'AI Enthusiastic',
            'Scalable System Architect',
            'Multi-Agent System Designer',
            'Head of Technology',
        ];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function type() {
            const current = words[wordIdx % words.length];

            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }

            typingEl.textContent = current.substring(0, charIdx);

            let speed = isDeleting ? 40 : 70;

            if (!isDeleting && charIdx === current.length) {
                speed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx++;
                speed = 500;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, 1200);
    }

    /* ----------------------------------------------------------
       2. COUNTER ANIMATION
       ---------------------------------------------------------- */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    /* ----------------------------------------------------------
       3. SCROLL REVEAL (Intersection Observer)
       ---------------------------------------------------------- */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Trigger counters
                    entry.target.querySelectorAll('.counter').forEach(c => {
                        if (!c.dataset.counted) {
                            c.dataset.counted = '1';
                            animateCounter(c);
                        }
                    });

                    // Also check if the element itself is a counter parent
                    if (entry.target.classList.contains('stat-card')) {
                        const c = entry.target.querySelector('.counter');
                        if (c && !c.dataset.counted) {
                            c.dataset.counted = '1';
                            animateCounter(c);
                        }
                    }
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------
       4. HEADER SCROLL EFFECT
       ---------------------------------------------------------- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    /* ----------------------------------------------------------
       5. ACTIVE NAV LINK
       ---------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.style.color = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = 'var(--accent)';
                        }
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(s => navObserver.observe(s));

    /* ----------------------------------------------------------
       6. HAMBURGER MENU
       ---------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ----------------------------------------------------------
       7. SMOOTH SCROLL FOR ANCHOR LINKS
       ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();
