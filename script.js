/* ============================================================
   SACHIN PATIL — Portfolio Scripts
   Neural network canvas, typing effect, counters, scroll reveal
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. NEURAL NETWORK CANVAS
       ---------------------------------------------------------- */
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: undefined, y: undefined, radius: 160 };
        const colors = ['#00d4ff', '#8b5cf6', '#10b981'];
        const CONNECTION_DIST = 130;
        let particleCount = window.innerWidth < 768 ? 40 : 80;
        let animId;

        function resize() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.8 + 0.8,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.45 + 0.25,
                });
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const opacity = (1 - dist / CONNECTION_DIST) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // Mouse connections
            if (mouse.x != null) {
                particles.forEach(p => {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const opacity = (1 - dist / mouse.radius) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                });
            }
        }

        function drawParticles() {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                let glow = 1;
                if (mouse.x != null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        glow = 1 + (1 - dist / mouse.radius) * 1.8;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.min(p.alpha * glow, 0.9);
                ctx.fill();
                ctx.globalAlpha = 1;
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            drawParticles();
            animId = requestAnimationFrame(animate);
        }

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            particleCount = window.innerWidth < 768 ? 40 : 80;
            createParticles();
        });

        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    /* ----------------------------------------------------------
       2. TYPING EFFECT
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
       3. COUNTER ANIMATION
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
       4. SCROLL REVEAL (Intersection Observer)
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
       5. HEADER SCROLL EFFECT
       ---------------------------------------------------------- */
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = window.scrollY;
    }, { passive: true });

    /* ----------------------------------------------------------
       6. ACTIVE NAV LINK
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
                            link.style.color = 'var(--accent-cyan)';
                        }
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(s => navObserver.observe(s));

    /* ----------------------------------------------------------
       7. HAMBURGER MENU
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
       8. SMOOTH SCROLL FOR ANCHOR LINKS
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
