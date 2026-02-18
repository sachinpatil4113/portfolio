/* ============================================================
   SACHIN PATIL — Portfolio Scripts
   Particles, typing, counters, scroll reveal, custom cursor,
   tilt effects, ripple buttons, scroll progress
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. PARTICLE NETWORK CANVAS
       ---------------------------------------------------------- */
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        let animId;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction — particles gently repel
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        this.x += (dx / dist) * force * 1.5;
                        this.y += (dy / dist) * force * 1.5;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(224, 78, 22, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.strokeStyle = `rgba(224, 78, 22, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            animId = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.parentElement.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
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

    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------
       5. HEADER SCROLL EFFECT
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

    /* ----------------------------------------------------------
       9. SCROLL PROGRESS BAR
       ---------------------------------------------------------- */
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    /* ----------------------------------------------------------
       10. CUSTOM CURSOR
       ---------------------------------------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
        let cx = 0, cy = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            cx = e.clientX;
            cy = e.clientY;
            cursorDot.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
        });

        function animateRing() {
            ringX += (cx - ringX) * 0.15;
            ringY += (cy - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover expansion on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .innovation-card, .stat-card, .contact-card, .skill-tags span');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    } else {
        // Hide cursor elements on touch devices
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    /* ----------------------------------------------------------
       11. BUTTON RIPPLE EFFECT
       ---------------------------------------------------------- */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    /* ----------------------------------------------------------
       12. TILT EFFECT ON CARDS
       ---------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.innovation-card, .contact-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ----------------------------------------------------------
       13. MOUSE GLOW ON STAT CARDS
       ---------------------------------------------------------- */
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    /* ----------------------------------------------------------
       14. PARALLAX SCROLL ON SECTIONS
       ---------------------------------------------------------- */
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                // Subtle parallax on hero image
                const heroImg = document.querySelector('.hero-img-wrap');
                if (heroImg) {
                    const offset = scrollY * 0.12;
                    heroImg.style.transform = `translateY(${offset}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ----------------------------------------------------------
       15. VIDEO MODAL
       ---------------------------------------------------------- */
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoModalBackdrop = document.getElementById('videoModalBackdrop');

    // Replace this URL with an actual YouTube/Vimeo embed link
    const videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

    if (videoPlayBtn && videoModal) {
        function openVideoModal() {
            videoModal.classList.add('active');
            videoIframe.src = videoSrc;
            document.body.style.overflow = 'hidden';
        }
        function closeVideoModal() {
            videoModal.classList.remove('active');
            videoIframe.src = '';
            document.body.style.overflow = '';
        }

        videoPlayBtn.addEventListener('click', openVideoModal);
        videoModalClose.addEventListener('click', closeVideoModal);
        videoModalBackdrop.addEventListener('click', closeVideoModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    /* ----------------------------------------------------------
       16. WORD-BY-WORD TEXT REVEAL
       ---------------------------------------------------------- */
    document.querySelectorAll('.word-reveal').forEach(el => {
        const text = el.textContent;
        el.innerHTML = text.split(/\s+/).filter(w => w).map(word =>
            `<span class="word-span">${word}</span>`
        ).join(' ');
    });

    const wordRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('words-visible');
                const words = el.querySelectorAll('.word-span');
                words.forEach((w, i) => {
                    w.style.transitionDelay = `${i * 0.04}s`;
                });
                wordRevealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.word-reveal').forEach(el => wordRevealObserver.observe(el));

    /* ----------------------------------------------------------
       17. TIMELINE DRAW EFFECT
       ---------------------------------------------------------- */
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const dots = timeline.querySelectorAll('.timeline-dot');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('timeline-drawn');
                    dots.forEach((dot, i) => {
                        dot.style.transitionDelay = `${0.3 + i * 0.15}s`;
                    });
                    timelineObserver.unobserve(timeline);
                }
            });
        }, { threshold: 0.1 });
        timelineObserver.observe(timeline);
    }

    /* ----------------------------------------------------------
       18. SKILL TAGS SCATTER ENTRY
       ---------------------------------------------------------- */
    document.querySelectorAll('.skill-group').forEach(group => {
        const tags = group.querySelectorAll('.skill-tags span');
        tags.forEach(tag => {
            const rx = (Math.random() - 0.5) * 120;
            const ry = (Math.random() - 0.5) * 80;
            const rr = (Math.random() - 0.5) * 20;
            tag.style.transform = `translate(${rx}px, ${ry}px) rotate(${rr}deg)`;
        });
    });

    /* ----------------------------------------------------------
       19. INTERACTIVE TERMINAL
       ---------------------------------------------------------- */
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalBody = document.getElementById('terminalBody');

    if (terminalInput && terminalOutput) {
        let cmdHistory = [];
        let historyIndex = -1;

        const commands = {
            help: () => ({
                type: 'success',
                text: `Available commands:
  help         — Show this help message
  about        — Learn about Sachin
  skills       — View technical skills
  experience   — Career timeline
  contact      — Get in touch
  play         — Play a mini-game
  clear        — Clear terminal
  whoami       — Who are you?
  ls           — List files
  cat resume.pdf — Download resume
  date         — Show current date
  echo [text]  — Echo your text
  sudo hire sachin — ???
  exit         — Try to leave`
            }),

            about: () => {
                setTimeout(() => {
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 600);
                return {
                    type: 'highlight',
                    text: `
  ╔═══════════════════════════════════════╗
  ║     SACHIN PATIL                      ║
  ║     Partner & Head of Technology      ║
  ╚═══════════════════════════════════════╝

  10+ years in tech leadership across
  AI, Fintech, EdTech, Healthcare &
  Marketplace domains.

  Scrolling to About section...`
                };
            },

            skills: () => ({
                type: 'success',
                text: `  ── AI & ML ──────────────
  LLMs  |  Multi-Agent  |  NLP  |  RAG  |  LangChain

  ── Languages & Frameworks ──
  Node.js  |  TypeScript  |  Python  |  React  |  Angular

  ── Cloud & Infra ─────────
  AWS  |  GCP  |  Docker  |  K8s  |  Kafka  |  Serverless

  ── Leadership ────────────
  25+ Engineers  |  Agile  |  System Design  |  Strategy`
            }),

            experience: () => ({
                type: 'success',
                text: `  Career Timeline:

  2025-Present  Partner & Head of Technology @ WiZR | EFPL
  2024-2025     Vice President @ WiZR | EFPL
  2022-2023     Sr. Engineering Manager @ Eduvanz
  2020-2022     Engineering Manager @ Eduvanz
  2018-2020     Technical Team Lead @ Eduvanz
  2017-2018     Senior Fullstack Developer @ Gromor
  2016-2017     Software Developer @ Crelio Health
  2015-2016     Software Developer @ Tudip Technologies`
            }),

            contact: () => ({
                type: 'success',
                text: `  Get in touch:

  Email   → <a href="mailto:sp.sachin106@gmail.com">sp.sachin106@gmail.com</a>
  Phone   → <a href="tel:+919766919241">+91 9766919241</a>
  LinkedIn→ <a href="https://linkedin.com/in/sachinpatil106" target="_blank">sachinpatil106</a>
  GitHub  → <a href="https://github.com/sachinpatil4113" target="_blank">sachinpatil4113</a>`
            }),

            play: () => {
                setTimeout(() => {
                    document.querySelector('#games')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 600);
                return {
                    type: 'highlight',
                    text: `  Available games:
  1. Tech Memory Match — Match tech icon pairs
  2. Code Typer — Test your typing speed

  Scrolling to Fun Zone...`
                };
            },

            clear: () => {
                terminalOutput.innerHTML = '';
                return null;
            },

            whoami: () => ({
                type: 'success',
                text: '  A curious visitor exploring Sachin\'s portfolio'
            }),

            ls: () => ({
                type: 'success',
                text: `  about.txt    skills.json    experience.log
  resume.pdf   projects/      contact.cfg
  .secret      games/         README.md`
            }),

            'cat resume.pdf': () => ({
                type: 'highlight',
                text: '  Opening resume... <a href="Sachin-Patil-Resume.pdf" target="_blank">Click here to download</a>'
            }),

            date: () => ({
                type: 'success',
                text: '  ' + new Date().toString()
            }),

            'sudo hire sachin': () => ({
                type: 'success',
                text: `
  ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
  ✦                                     ✦
  ✦   EXCELLENT DECISION!               ✦
  ✦   Hiring process initiated...       ✦
  ✦   Sending offer letter...           ✦
  ✦   Welcome aboard! 🎉               ✦
  ✦                                     ✦
  ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦`
            }),

            exit: () => ({
                type: 'highlight',
                text: '  "You can check out any time you like, but you can never leave..." 🎸'
            })
        };

        const allCommands = Object.keys(commands);

        function executeCommand(input) {
            const trimmed = input.trim();
            if (!trimmed) return;

            cmdHistory.push(trimmed);
            historyIndex = cmdHistory.length;

            // Add command line to output
            const cmdLine = document.createElement('div');
            cmdLine.classList.add('cmd-line');
            cmdLine.innerHTML = `<span class="prompt">visitor@sachin ~ $</span> <span class="cmd">${escapeHtml(trimmed)}</span>`;
            terminalOutput.appendChild(cmdLine);

            // Handle echo
            let result;
            if (trimmed.toLowerCase().startsWith('echo ')) {
                const text = trimmed.substring(5);
                result = { type: '', text: '  ' + text };
            } else {
                const handler = commands[trimmed.toLowerCase()];
                if (handler) {
                    result = handler();
                } else {
                    result = { type: 'error', text: `  Command not found: ${trimmed}. Type 'help' for available commands.` };
                }
            }

            if (result) {
                const response = document.createElement('div');
                response.classList.add('cmd-response');
                if (result.type) response.classList.add(result.type);
                response.innerHTML = result.text;
                terminalOutput.appendChild(response);
            }

            terminalBody.scrollTop = terminalBody.scrollHeight;
            terminalInput.value = '';
        }

        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(terminalInput.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = cmdHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = cmdHistory[historyIndex];
                } else {
                    historyIndex = cmdHistory.length;
                    terminalInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const current = terminalInput.value.toLowerCase().trim();
                if (current) {
                    const match = allCommands.find(c => c.startsWith(current));
                    if (match) {
                        terminalInput.value = match;
                    }
                }
            }
        });

        // Suggestion chip click handlers
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const cmd = chip.getAttribute('data-cmd');
                terminalInput.value = cmd;
                executeCommand(cmd);
                terminalInput.focus();
            });
        });

        // Focus terminal input when clicking terminal body
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    /* ----------------------------------------------------------
       20. MEMORY MATCH GAME
       ---------------------------------------------------------- */
    const memoryBoard = document.getElementById('memoryBoard');
    const memoryReset = document.getElementById('memoryReset');
    const memoryMovesEl = document.getElementById('memoryMoves');
    const memoryTimerEl = document.getElementById('memoryTimer');

    if (memoryBoard) {
        const icons = [
            'fab fa-react', 'fab fa-node-js', 'fab fa-python', 'fab fa-aws',
            'fab fa-docker', 'fab fa-angular', 'fab fa-js', 'fab fa-git-alt'
        ];
        let cards = [];
        let flippedCards = [];
        let matchedCount = 0;
        let moves = 0;
        let timerInterval = null;
        let seconds = 0;
        let boardLocked = false;

        function shuffle(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function initMemoryGame() {
            memoryBoard.innerHTML = '';
            cards = [];
            flippedCards = [];
            matchedCount = 0;
            moves = 0;
            seconds = 0;
            boardLocked = false;
            clearInterval(timerInterval);
            timerInterval = null;
            memoryMovesEl.textContent = 'Moves: 0';
            memoryTimerEl.textContent = 'Time: 0s';

            const pairs = shuffle([...icons, ...icons]);
            pairs.forEach((icon, idx) => {
                const card = document.createElement('div');
                card.classList.add('memory-card');
                card.dataset.icon = icon;
                card.dataset.index = idx;
                card.innerHTML = `
                    <div class="memory-card-inner">
                        <div class="memory-card-front">?</div>
                        <div class="memory-card-back"><i class="${icon}"></i></div>
                    </div>`;
                card.addEventListener('click', () => flipCard(card));
                memoryBoard.appendChild(card);
                cards.push(card);
            });
        }

        function startTimer() {
            if (!timerInterval) {
                timerInterval = setInterval(() => {
                    seconds++;
                    memoryTimerEl.textContent = `Time: ${seconds}s`;
                }, 1000);
            }
        }

        function flipCard(card) {
            if (boardLocked) return;
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

            startTimer();
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves++;
                memoryMovesEl.textContent = `Moves: ${moves}`;
                boardLocked = true;

                const [c1, c2] = flippedCards;
                if (c1.dataset.icon === c2.dataset.icon) {
                    c1.classList.add('matched');
                    c2.classList.add('matched');
                    matchedCount += 2;
                    flippedCards = [];
                    boardLocked = false;

                    if (matchedCount === cards.length) {
                        clearInterval(timerInterval);
                        const msg = document.createElement('div');
                        msg.classList.add('memory-win-msg');
                        msg.textContent = `Completed in ${moves} moves and ${seconds}s!`;
                        memoryBoard.parentElement.insertBefore(msg, memoryBoard.nextSibling);
                    }
                } else {
                    setTimeout(() => {
                        c1.classList.add('shake');
                        c2.classList.add('shake');
                        setTimeout(() => {
                            c1.classList.remove('flipped', 'shake');
                            c2.classList.remove('flipped', 'shake');
                            flippedCards = [];
                            boardLocked = false;
                        }, 400);
                    }, 600);
                }
            }
        }

        memoryReset.addEventListener('click', () => {
            const existingMsg = memoryBoard.parentElement.querySelector('.memory-win-msg');
            if (existingMsg) existingMsg.remove();
            initMemoryGame();
        });

        initMemoryGame();
    }

    /* ----------------------------------------------------------
       21. CODE TYPER GAME
       ---------------------------------------------------------- */
    const typingDisplay = document.getElementById('typingDisplay');
    const typingInput = document.getElementById('typingInput');
    const typingReset = document.getElementById('typingReset');
    const typingWpmEl = document.getElementById('typingWpm');
    const typingAccuracyEl = document.getElementById('typingAccuracy');

    if (typingDisplay && typingInput) {
        const phrases = [
            "const server = express().listen(3000)",
            "docker build -t myapp:latest .",
            "git commit -m 'feat: add new feature'",
            "SELECT * FROM users WHERE active = true",
            "kubectl apply -f deployment.yaml",
            "npm install --save-dev typescript",
            "const result = await model.generate(prompt)",
            "export default function App() { return <div /> }",
            "pip install langchain openai chromadb",
            "aws s3 cp ./build s3://my-bucket --recursive",
            "const agent = new MultiAgentOrchestrator()",
            "terraform init && terraform apply -auto-approve",
            "redis-cli SET session:user123 '{\"role\":\"admin\"}'",
        ];

        let currentPhrase = '';
        let startTime = null;
        let typingDone = false;
        let correctChars = 0;
        let totalTyped = 0;

        function initTypingGame() {
            currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            startTime = null;
            typingDone = false;
            correctChars = 0;
            totalTyped = 0;
            typingInput.value = '';
            typingInput.disabled = false;
            typingWpmEl.textContent = 'WPM: --';
            typingAccuracyEl.textContent = 'Accuracy: --';
            const existingResult = typingDisplay.parentElement.querySelector('.typing-result');
            if (existingResult) existingResult.remove();

            renderPhrase('');
        }

        function renderPhrase(typed) {
            let html = '';
            for (let i = 0; i < currentPhrase.length; i++) {
                const char = currentPhrase[i] === ' ' ? '&nbsp;' : escapeHtmlChar(currentPhrase[i]);
                if (i < typed.length) {
                    if (typed[i] === currentPhrase[i]) {
                        html += `<span class="char correct">${char}</span>`;
                    } else {
                        html += `<span class="char incorrect">${char}</span>`;
                    }
                } else if (i === typed.length) {
                    html += `<span class="char current">${char}</span>`;
                } else {
                    html += `<span class="char pending">${char}</span>`;
                }
            }
            typingDisplay.innerHTML = html;
        }

        function escapeHtmlChar(c) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return map[c] || c;
        }

        typingInput.addEventListener('input', () => {
            if (typingDone) return;
            const typed = typingInput.value;

            if (!startTime && typed.length > 0) {
                startTime = Date.now();
            }

            totalTyped = typed.length;
            correctChars = 0;
            for (let i = 0; i < typed.length && i < currentPhrase.length; i++) {
                if (typed[i] === currentPhrase[i]) correctChars++;
            }

            renderPhrase(typed);

            // Live WPM and accuracy
            if (startTime) {
                const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
                if (elapsed > 0) {
                    const wpm = Math.round((typed.length / 5) / elapsed);
                    typingWpmEl.textContent = `WPM: ${wpm}`;
                }
                const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
                typingAccuracyEl.textContent = `Accuracy: ${accuracy}%`;
            }

            // Check completion
            if (typed.length >= currentPhrase.length) {
                typingDone = true;
                typingInput.disabled = true;
                const elapsed = (Date.now() - startTime) / 1000 / 60;
                const finalWpm = Math.round((currentPhrase.length / 5) / elapsed);
                const finalAccuracy = Math.round((correctChars / currentPhrase.length) * 100);

                let rating = 'Beginner';
                if (finalWpm >= 80 && finalAccuracy >= 95) rating = 'Hacker';
                else if (finalWpm >= 60 && finalAccuracy >= 90) rating = 'Expert';
                else if (finalWpm >= 40 && finalAccuracy >= 80) rating = 'Intermediate';

                typingWpmEl.textContent = `WPM: ${finalWpm}`;
                typingAccuracyEl.textContent = `Accuracy: ${finalAccuracy}%`;

                const result = document.createElement('div');
                result.classList.add('typing-result');
                result.textContent = `${rating}! ${finalWpm} WPM at ${finalAccuracy}% accuracy`;
                typingDisplay.parentElement.insertBefore(result, typingInput.nextSibling);
            }
        });

        // Prevent paste
        typingInput.addEventListener('paste', (e) => e.preventDefault());

        typingReset.addEventListener('click', initTypingGame);

        initTypingGame();
    }

})();
