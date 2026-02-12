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

        // 1. Stop the observer from interfering during replay
        scrollTriggerObserver.unobserve(trigger);

        // 2. Remove the triggered class
        trigger.classList.remove('scroll-triggered');

        // 3. Force ALL children to snap to their "before" state instantly
        const allEls = [trigger, ...trigger.querySelectorAll('*')];
        allEls.forEach(el => {
            el.style.transition = 'none';
            el.style.animation = 'none';
        });

        // 4. Force a synchronous reflow so the browser renders the reset state
        void trigger.offsetHeight;

        // 5. Remove inline overrides so CSS takes back over
        allEls.forEach(el => {
            el.style.transition = '';
            el.style.animation = '';
        });

        // 6. Let the reset state paint for a moment, then re-trigger
        setTimeout(() => {
            trigger.classList.add('scroll-triggered');

            // 7. Re-observe after the longest animation finishes
            setTimeout(() => {
                scrollTriggerObserver.observe(trigger);
            }, 2000);
        }, 80);
    });
});

// ==============================================
// NAV SCROLL EFFECT
// ==============================================
const nav = document.querySelector('.nav-glass');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

// ==============================================
// MOBILE NAV TOGGLE
// ==============================================
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
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
