// ==============================================
// SCROLL REVEAL (Intersection Observer)
// ==============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==============================================
// SCROLL EFFECTS (with reset on leave)
// ==============================================
const scrollTriggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-triggered');
        } else {
            entry.target.classList.remove('scroll-triggered');
            // Reset animations so they replay on re-enter
            entry.target.querySelectorAll('[style*="animation"]').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // trigger reflow
                el.style.animation = '';
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.scroll-trigger').forEach(el => scrollTriggerObserver.observe(el));

// ==============================================
// SCROLL EFFECT PLAY BUTTONS
// ==============================================
document.querySelectorAll('.scroll-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.preview-panel');
        const trigger = panel.querySelector('.scroll-trigger');
        if (!trigger) return;

        // 1. Stop the observer so it can't re-add the class mid-reset
        scrollTriggerObserver.unobserve(trigger);

        // 2. Collect every element involved
        const allEls = [trigger, ...trigger.querySelectorAll('*')];

        // 3. Kill all transitions + animations so elements snap instantly
        allEls.forEach(el => {
            el.style.setProperty('transition', 'none', 'important');
            el.style.setProperty('animation', 'none', 'important');
        });

        // 4. Remove the triggered class — elements now hold their "before" CSS
        trigger.classList.remove('scroll-triggered');

        // 5. Force synchronous reflow — browser commits the hidden/reset state
        void trigger.offsetHeight;

        // 6. Remove inline overrides so real CSS rules take over again
        allEls.forEach(el => {
            el.style.removeProperty('transition');
            el.style.removeProperty('animation');
        });

        // 7. Double-rAF guarantees the reset frame actually paints to screen
        //    before we trigger the entrance animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                trigger.classList.add('scroll-triggered');

                // 8. Hand control back to the observer after animations settle
                setTimeout(() => {
                    scrollTriggerObserver.observe(trigger);
                }, 2500);
            });
        });
    });
});

// ==============================================
// NAV SCROLL EFFECT
// ==============================================
// (Removed — top nav replaced by sidebar)

// ==============================================
// SIDEBAR TOGGLE
// ==============================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarNav = document.getElementById('sidebarNav');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebarToggle.classList.add('active');
    sidebarNav.classList.add('open');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    sidebarToggle.classList.remove('active');
    sidebarNav.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

if (sidebarToggle && sidebarNav && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
        if (sidebarNav.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close on link click
    sidebarNav.querySelectorAll('.sidebar-links a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarNav.classList.contains('open')) {
            closeSidebar();
        }
    });
}

// ==============================================
// COPY TO CLIPBOARD
// ==============================================
function copyCode(button) {
    const codePanel = button.closest('.code-panel');
    const codeBlock = codePanel.querySelector('code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        button.classList.add('copied');
        const textEl = button.querySelector('.copy-text');
        const original = textEl.textContent;
        textEl.textContent = 'Copied!';

        setTimeout(() => {
            button.classList.remove('copied');
            textEl.textContent = original;
        }, 2000);
    });
}

// ==============================================
// MORPH LOADER ANIMATED DOTS
// ==============================================
const morphText = document.querySelector('.morph-loader-text');
if (morphText) {
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        morphText.textContent = 'Loading' + '.'.repeat(dots);
    }, 400);
}

// ==============================================
// CATEGORY CARD SPOTLIGHT FOLLOW
// ==============================================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ==============================================
// 3D TILT EFFECT
// ==============================================
document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ==============================================
// SPOTLIGHT CARD FOLLOW
// ==============================================
document.querySelectorAll('.card-spotlight').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    });
});

// ==============================================
// EVERVAULT CARD
// ==============================================
const evervaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateRandomString(len) {
    let result = '';
    for (let i = 0; i < len; i++) {
        result += evervaultChars.charAt(Math.floor(Math.random() * evervaultChars.length));
    }
    return result;
}
document.querySelectorAll('[data-evervault]').forEach(card => {
    const charsEl = card.querySelector('.card-evervault-chars');
    const overlayEl = card.querySelector('.card-evervault-chars-overlay');
    // Initial fill
    if (charsEl) charsEl.textContent = generateRandomString(1500);
    if (overlayEl) overlayEl.textContent = generateRandomString(1500);

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        // Regenerate characters on each move for the "encryption" effect
        const str = generateRandomString(1500);
        if (charsEl) charsEl.textContent = str;
        if (overlayEl) overlayEl.textContent = str;
    });
});

// ==============================================
// RIPPLE BUTTON EFFECT
// ==============================================
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// ==============================================
// MAGNETIC BUTTON EFFECT
// ==============================================
document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==============================================
// RE-INIT ON PAGE NAVIGATION (for Prism.js)
// ==============================================
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}

// ==============================================
// JQUERY ENHANCEMENTS
// ==============================================
if (typeof jQuery !== 'undefined') {
    (function ($) {
        // --- Mouse Trail Effect (global) ---
        const $trail = [];
        const TRAIL_COUNT = 12;
        for (let i = 0; i < TRAIL_COUNT; i++) {
            const $dot = $('<div class="mouse-trail-dot"></div>').appendTo('body');
            $dot.css({
                position: 'fixed',
                pointerEvents: 'none',
                width: (TRAIL_COUNT - i) * 1.5 + 'px',
                height: (TRAIL_COUNT - i) * 1.5 + 'px',
                borderRadius: '50%',
                background: `hsla(${185 + i * 8}, 80%, 65%, ${0.4 - i * 0.03})`,
                zIndex: 9999,
                transition: `transform ${0.08 + i * 0.03}s ease, opacity 0.3s ease`,
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                boxShadow: `0 0 ${6 - i * 0.4}px hsla(${185 + i * 8}, 80%, 65%, 0.3)`
            });
            $trail.push($dot);
        }

        $(document).on('mousemove', function (e) {
            $trail.forEach(($dot, i) => {
                setTimeout(() => {
                    $dot.css({
                        left: e.clientX + 'px',
                        top: e.clientY + 'px',
                        opacity: 1
                    });
                }, i * 25);
            });
        });

        $(document).on('mouseleave', function () {
            $trail.forEach($dot => $dot.css('opacity', 0));
        });

        // --- jQuery Smooth Parallax for showcase items ---
        $(window).on('scroll', function () {
            const scrollTop = $(this).scrollTop();
            $('.showcase-item').each(function () {
                const offset = $(this).offset().top;
                const parallax = (scrollTop - offset) * 0.02;
                $(this).find('.preview-panel').css('transform', `translateY(${parallax}px)`);
            });
        });

        // --- Click Particle Explosion ---
        $(document).on('click', '.preview-panel', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            for (let i = 0; i < 16; i++) {
                const $p = $('<div class="click-particle"></div>').appendTo('body');
                const angle = (i / 16) * Math.PI * 2;
                const velocity = 40 + Math.random() * 60;
                const hue = 180 + Math.random() * 100;
                const size = 3 + Math.random() * 4;
                $p.css({
                    position: 'fixed',
                    left: x + 'px',
                    top: y + 'px',
                    width: size + 'px',
                    height: size + 'px',
                    borderRadius: '50%',
                    background: `hsla(${hue}, 80%, 65%, 0.9)`,
                    boxShadow: `0 0 8px hsla(${hue}, 80%, 65%, 0.5)`,
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)'
                });
                $p.animate({
                    left: x + Math.cos(angle) * velocity,
                    top: y + Math.sin(angle) * velocity,
                    opacity: 0,
                    width: 0,
                    height: 0
                }, 600 + Math.random() * 300, 'swing', function () {
                    $(this).remove();
                });
            }
        });

        // --- Hover glow ring on showcase items ---
        $('.showcase-item').on('mouseenter', function () {
            $(this).css({
                boxShadow: '0 0 40px rgba(0,229,255,0.08), 0 20px 80px rgba(0,0,0,0.25)'
            });
        }).on('mouseleave', function () {
            $(this).css({
                boxShadow: ''
            });
        });

    })(jQuery);
}
