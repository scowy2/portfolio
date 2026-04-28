document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initWorksTabs();
    initVideoPlayers();
    initScrollAnimations();
    initSmoothScroll();
});

function initWorksTabs() {
    const tabs = document.querySelectorAll('.works__tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            // Hide all grids
            document.querySelectorAll('.works__grid').forEach(grid => {
                grid.style.display = 'none';
                grid.classList.remove('active');
            });

            // Pause all videos when switching tabs
            document.querySelectorAll('.works__video-wrap video').forEach(v => {
                v.pause();
                v.muted = true;
                const overlay = v.closest('.works__video-wrap').querySelector('.works__play-overlay');
                if (overlay) overlay.classList.remove('hidden');
            });

            // Show target grid
            const targetId = tab.getAttribute('data-target');
            const targetGrid = document.getElementById(`${targetId}-works`);
            if (targetGrid) {
                targetGrid.style.display = 'grid';
                // Trigger reflow for animation if needed
                void targetGrid.offsetWidth;
                targetGrid.classList.add('active');
            }
        });
    });
}

function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    }, { passive: true });
}

function initMobileMenu() {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('mobile-menu');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initVideoPlayers() {
    document.querySelectorAll('.works__video-wrap').forEach(wrap => {
        const video = wrap.querySelector('video');
        const overlay = wrap.querySelector('.works__play-overlay');
        if (!video || !overlay) return;

        // Click to play/unmute, click again to pause/mute
        wrap.addEventListener('click', () => {
            if (video.paused) {
                // Pause all other videos first
                document.querySelectorAll('.works__video-wrap video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        v.muted = true;
                        v.closest('.works__video-wrap').querySelector('.works__play-overlay').classList.remove('hidden');
                    }
                });
                video.muted = false;
                video.play();
                overlay.classList.add('hidden');
            } else {
                video.pause();
                video.muted = true;
                overlay.classList.remove('hidden');
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = document.getElementById('nav').offsetHeight + 20;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
            }
        });
    });
}
