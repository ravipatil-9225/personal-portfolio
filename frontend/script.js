document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Navbar Transition on Scroll
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');

    window.addEventListener('scroll', () => {
        if (mainContent && window.scrollY > mainContent.offsetTop - 100) {
            navbar.classList.add('dark-nav');
        } else {
            navbar.classList.remove('dark-nav');
        }
    });

    /* ==========================================================================
       2. Mobile Navigation Drawer Toggle
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenuWrapper = document.getElementById('navMenuWrapper');
    const navOverlay = document.getElementById('navOverlay');
    const navLinksList = document.querySelectorAll('.nav-links a');

    function toggleMobileNav() {
        const isOpen = navMenuWrapper.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('nav-open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closeMobileNav() {
        if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
            navMenuWrapper.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileNav);
    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

    navLinksList.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            closeMobileNav();
        }
    });

    /* ==========================================================================
       3. Intersection Observer for Scroll Animations (fade-up)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-up');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => observer.observe(element));

    /* ==========================================================================
       4. Cross-Platform OS Detection (Mac / Win / iOS / Android)
       ========================================================================== */
    const isAppleDevice = /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || navigator.platform);
    const kbdShortcutText = isAppleDevice ? '⌘K' : 'Ctrl K';

    const cmdKbdShortcut = document.getElementById('cmdKbdShortcut');
    const mobileCmdBadge = document.querySelector('.mobile-cmd-badge');
    const floatingFab = document.getElementById('floatingCmdFab');
    const platformHint = document.getElementById('cmdPlatformLabel');

    if (cmdKbdShortcut) cmdKbdShortcut.textContent = kbdShortcutText;
    if (mobileCmdBadge) mobileCmdBadge.textContent = kbdShortcutText;
    if (floatingFab) {
        const fabSpan = floatingFab.querySelector('span');
        if (fabSpan) fabSpan.textContent = kbdShortcutText;
    }
    if (platformHint) {
        platformHint.textContent = isAppleDevice ? 'macOS / iOS Ready (⌘K)' : 'Windows / Android Ready (Ctrl+K)';
    }

    /* ==========================================================================
       5. Interactive Command Palette (Cmd+K / Ctrl+K)
       ========================================================================== */
    const cmdPalette = document.getElementById('cmdPalette');
    const cmdPaletteInput = document.getElementById('cmdPaletteInput');
    const cmdPaletteBody = document.getElementById('cmdPaletteBody');
    const cmdPaletteCloseBtn = document.getElementById('cmdPaletteCloseBtn');
    const paletteTriggerBtn = document.getElementById('paletteTriggerBtn');
    const mobilePaletteBtn = document.getElementById('mobilePaletteBtn');

    // Command Registry
    const commandList = [
        // Navigation
        { id: 'nav-about', category: 'Navigation', icon: 'fa-user', title: 'Go to About', desc: 'Personal background & introduction', badge: '#about', action: () => scrollToSection('#about') },
        { id: 'nav-skills', category: 'Navigation', icon: 'fa-brain', title: 'Go to Skills', desc: 'AI, Full-Stack, and Tooling stack', badge: '#skills', action: () => scrollToSection('#skills') },
        { id: 'nav-projects', category: 'Navigation', icon: 'fa-layer-group', title: 'Go to Selected Works', desc: 'Bento Grid of full-stack AI systems', badge: '#projects', action: () => scrollToSection('#projects') },
        { id: 'nav-exp', category: 'Navigation', icon: 'fa-briefcase', title: 'Go to Experience', desc: 'Internships and engineering history', badge: '#internships', action: () => scrollToSection('#internships') },
        { id: 'nav-contact', category: 'Navigation', icon: 'fa-paper-plane', title: 'Go to Contact', desc: 'Send a direct message or inquiry', badge: '#contact', action: () => scrollToSection('#contact') },

        // Quick Actions
        { id: 'act-resume', category: 'Quick Actions', icon: 'fa-file-pdf', title: 'Download Resume (PDF)', desc: 'Get latest software engineering resume', badge: 'PDF', action: () => { window.open('RESUME%20latest.pdf', '_blank'); showToast('Opening Resume PDF...', 'fa-file-pdf'); } },
        { id: 'act-email-copy', category: 'Quick Actions', icon: 'fa-copy', title: 'Copy Email Address', desc: 'ravipatil7512@gmail.com', badge: 'Clipboard', action: () => copyEmailToClipboard() },
        { id: 'act-gmail', category: 'Quick Actions', icon: 'fa-envelope-open-text', title: 'Send Email via Gmail', desc: 'Compose message directly in browser', badge: 'Compose', action: () => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=ravipatil7512@gmail.com', '_blank') },
        { id: 'act-github', category: 'Quick Actions', icon: 'fa-brands fa-github', title: 'View GitHub Profile', desc: 'Explore source code & repositories', badge: 'github.com', action: () => window.open('https://github.com/ravipatil-9225', '_blank') },
        { id: 'act-linkedin', category: 'Quick Actions', icon: 'fa-brands fa-linkedin', title: 'Connect on LinkedIn', desc: 'Professional network & updates', badge: 'linkedin.com', action: () => window.open('https://www.linkedin.com/in/ravi-patil-9734242b0/', '_blank') },

        // Interactive / Easter Eggs
        { id: 'act-confetti', category: 'Interactive', icon: 'fa-wand-magic-sparkles', title: 'Launch Confetti Celebration 🎉', desc: 'Trigger physics-based particle burst', badge: 'Fun', action: () => { triggerConfettiBurst(); showToast('Celebration activated! 🎉', 'fa-sparkles'); } },
        { id: 'act-scroll-top', category: 'Interactive', icon: 'fa-arrow-up', title: 'Scroll to Top of Page', desc: 'Smooth return to portfolio header', badge: 'Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commandList];

    function openCommandPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.add('active');
        cmdPalette.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        cmdPaletteInput.value = '';
        renderCommands(commandList);
        setTimeout(() => cmdPaletteInput.focus(), 60);
    }

    function closeCommandPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.remove('active');
        cmdPalette.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function scrollToSection(selector) {
        const target = document.querySelector(selector);
        if (target) {
            closeCommandPalette();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function copyEmailToClipboard() {
        const email = 'ravipatil7512@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email)
                .then(() => showToast('Email copied to clipboard! (ravipatil7512@gmail.com)', 'fa-check-circle'))
                .catch(() => fallbackCopy(email));
        } else {
            fallbackCopy(email);
        }
    }

    function fallbackCopy(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email copied to clipboard! (ravipatil7512@gmail.com)', 'fa-check-circle');
    }

    function renderCommands(commands) {
        filteredCommands = commands;
        selectedIndex = 0;
        cmdPaletteBody.innerHTML = '';

        if (commands.length === 0) {
            cmdPaletteBody.innerHTML = `
                <div class="cmd-empty-state">
                    <i class="fas fa-search" style="font-size: 1.8rem; margin-bottom: 8px; color: var(--text-muted);"></i>
                    <p>No matching commands found</p>
                </div>
            `;
            return;
        }

        const groups = {};
        commands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });

        let flatIndex = 0;
        Object.keys(groups).forEach(category => {
            const groupTitle = document.createElement('div');
            groupTitle.className = 'cmd-palette-group-title';
            groupTitle.textContent = category;
            cmdPaletteBody.appendChild(groupTitle);

            groups[category].forEach(cmd => {
                const item = document.createElement('div');
                item.className = 'cmd-item' + (flatIndex === 0 ? ' selected' : '');
                item.dataset.index = flatIndex;
                item.innerHTML = `
                    <div class="cmd-item-left">
                        <div class="cmd-item-icon"><i class="fas ${cmd.icon}"></i></div>
                        <div class="cmd-item-text">
                            <span class="cmd-item-title">${cmd.title}</span>
                            <span class="cmd-item-desc">${cmd.desc}</span>
                        </div>
                    </div>
                    <span class="cmd-item-badge">${cmd.badge}</span>
                `;

                item.addEventListener('click', () => {
                    cmd.action();
                    closeCommandPalette();
                });

                item.addEventListener('mouseenter', () => {
                    updateSelectedIndex(parseInt(item.dataset.index, 10));
                });

                cmdPaletteBody.appendChild(item);
                flatIndex++;
            });
        });
    }

    function updateSelectedIndex(index) {
        const items = cmdPaletteBody.querySelectorAll('.cmd-item');
        if (items.length === 0) return;

        items.forEach(el => el.classList.remove('selected'));
        selectedIndex = (index + items.length) % items.length;

        const activeItem = items[selectedIndex];
        if (activeItem) {
            activeItem.classList.add('selected');
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    // Filter commands on search input
    if (cmdPaletteInput) {
        cmdPaletteInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderCommands(commandList);
                return;
            }

            const matches = commandList.filter(cmd => {
                return cmd.title.toLowerCase().includes(query) ||
                       cmd.desc.toLowerCase().includes(query) ||
                       cmd.category.toLowerCase().includes(query) ||
                       cmd.badge.toLowerCase().includes(query);
            });

            renderCommands(matches);
        });
    }

    // Keyboard Navigation for Command Palette
    document.addEventListener('keydown', (e) => {
        // Toggle shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdPalette && cmdPalette.classList.contains('active')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
            return;
        }

        // Close on ESC
        if (e.key === 'Escape' && cmdPalette && cmdPalette.classList.contains('active')) {
            e.preventDefault();
            closeCommandPalette();
            return;
        }

        // Arrow keys and Enter inside open palette
        if (cmdPalette && cmdPalette.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                updateSelectedIndex(selectedIndex + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                updateSelectedIndex(selectedIndex - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    closeCommandPalette();
                }
            }
        }
    });

    // Button triggers
    if (paletteTriggerBtn) paletteTriggerBtn.addEventListener('click', openCommandPalette);
    if (mobilePaletteBtn) mobilePaletteBtn.addEventListener('click', openCommandPalette);
    if (floatingFab) floatingFab.addEventListener('click', openCommandPalette);
    if (cmdPaletteCloseBtn) cmdPaletteCloseBtn.addEventListener('click', closeCommandPalette);

    // Backdrop click close
    if (cmdPalette) {
        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) {
                closeCommandPalette();
            }
        });
    }

    /* ==========================================================================
       6. Pure Vanilla Toast Notifications System
       ========================================================================== */
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, iconClass = 'fa-info-circle') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fadeout');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3200);
    }

    /* ==========================================================================
       7. High-Performance 3D Perspective Tilt with Spotlight (Desktop Mouse)
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -7; // Max tilt 7deg
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ==========================================================================
       8. Interactive Project Mockup Handlers (YatraAI Simulator)
       ========================================================================== */
    const promptChips = document.querySelectorAll('.mockup-chip');
    const yatraBotBubble = document.getElementById('yatraBotBubble');
    const yatraToolBanner = document.querySelector('.chat-tool-banner');

    if (promptChips && yatraBotBubble && yatraToolBanner) {
        promptChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                const scenario = chip.dataset.scenario;

                if (scenario === 'pnr') {
                    yatraToolBanner.innerHTML = `<i class="fas fa-bolt"></i><span>[INVOKING TOOL]: <code>check_pnr_live(pnr="821-4921")</code></span>`;
                    yatraBotBubble.innerHTML = `
                        <span class="bubble-sender"><i class="fas fa-brain"></i> YatraAI Agent</span>
                        <p>PNR <strong>821-4921</strong>: <span style="color: #4ade80; font-weight: 700;">CNF (Confirmed)</span> &bull; Coach B2, Berth 34 (Side Lower). Current status: Train running ON TIME.</p>
                    `;
                    showToast('YatraAI simulated PNR verification complete!', 'fa-bolt');
                } else if (scenario === 'tatkal') {
                    yatraToolBanner.innerHTML = `<i class="fas fa-bolt"></i><span>[INVOKING TOOL]: <code>query_tatkal_quota(train_no=12951, quota="TQ")</code></span>`;
                    yatraBotBubble.innerHTML = `
                        <span class="bubble-sender"><i class="fas fa-brain"></i> YatraAI Agent</span>
                        <p>Tatkal Quota: <strong>14 berths available</strong> for 3AC. Premium Tatkal fare: ₹2,150. Booking window opens tomorrow at 10:00 AM IST.</p>
                    `;
                    showToast('YatraAI simulated Tatkal lookup complete!', 'fa-bolt');
                } else if (scenario === 'reset') {
                    yatraToolBanner.innerHTML = `<i class="fas fa-bolt"></i><span>[INVOKING TOOL]: <code>query_irctc(from="BCT", to="NDLS", class="2AC")</code></span>`;
                    yatraBotBubble.innerHTML = `
                        <span class="bubble-sender"><i class="fas fa-brain"></i> YatraAI Agent</span>
                        <p>Found <strong>18 available berths</strong> on <em>Rajdhani Express (12951)</em> &bull; Departs 17:00 &bull; Fare: ₹2,485. Would you like to check PNR status or book?</p>
                    `;
                }
            });
        });
    }

    /* ==========================================================================
       9. Pure Physics Confetti Celebration Easter Egg (Zero Dependencies)
       ========================================================================== */
    function triggerConfettiBurst() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#22d3ee', '#c084fc', '#fdc500', '#4ade80', '#f43f5e', '#ffffff'];
        const particles = [];
        const count = 90;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.45,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() - 0.7) * 20,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.45,
                alpha: 1
            });
        }

        let frameId;
        const startTime = Date.now();

        function renderConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.rotation += p.rotSpeed;
                p.alpha -= 0.009;

                if (p.alpha > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            if (alive && Date.now() - startTime < 3500) {
                frameId = requestAnimationFrame(renderConfetti);
            } else {
                cancelAnimationFrame(frameId);
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }
        }

        renderConfetti();
    }

    /* ==========================================================================
       10. Contact Form Submission (Web3Forms Real-time API)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && submitBtn && formStatus) {
        const btnText = submitBtn.querySelector('span');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalText = btnText ? btnText.innerText : 'Send Message';
            if (btnText) btnText.innerText = 'Sending...';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.innerText = '';

            const formData = new FormData(contactForm);

            try {
                formData.append("access_key", "bf33dd02-178b-4dae-ae00-3bc83d87ed0f");
                formData.set("from_name", "Raviraj's Portfolio");
                formData.set("subject", "New Message from Portfolio: " + (formData.get("subject") || "General Inquiry"));

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200) {
                    formStatus.classList.add('success');
                    formStatus.innerText = 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                    showToast('Message sent successfully! 🚀', 'fa-paper-plane');
                    triggerConfettiBurst();
                } else {
                    throw new Error(result.message || 'Something went wrong.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.classList.add('error');
                formStatus.innerText = error.message || 'Failed to send message. Please try again.';
                showToast('Failed to send message. Please try again.', 'fa-exclamation-triangle');
            } finally {
                if (btnText) btnText.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

});
