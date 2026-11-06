/* ========================================
   SKILLSET CAROUSEL
   Native horizontal scroll + scroll-snap; this script only adds
   arrow navigation, a progress indicator and a visible-range counter.
======================================== */

(() => {
    const track = document.getElementById('skills-track');
    const prev = document.getElementById('skills-prev');
    const next = document.getElementById('skills-next');
    const counter = document.getElementById('skills-counter');
    const progress = document.getElementById('skills-progress-bar');

    if (!track || !prev || !next) return;

    const slides = [...track.querySelectorAll('.skills-slide')];
    const total = slides.length;
    const pad = n => String(n).padStart(2, '0');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function update() {
        const viewStart = track.scrollLeft;
        const viewEnd = viewStart + track.clientWidth;
        const maxScroll = track.scrollWidth - track.clientWidth;

        // Slides at least 60% visible count as "in view"
        const visible = slides
            .map((slide, index) => {
                const start = slide.offsetLeft;
                const end = start + slide.offsetWidth;
                const shown = Math.min(end, viewEnd) - Math.max(start, viewStart);
                return shown / slide.offsetWidth >= 0.6 ? index : -1;
            })
            .filter(index => index >= 0);

        const first = (visible[0] ?? 0) + 1;
        const last = (visible[visible.length - 1] ?? 0) + 1;

        if (counter) {
            counter.textContent = first === last
                ? `${pad(first)} / ${pad(total)}`
                : `${pad(first)}–${pad(last)} / ${pad(total)}`;
        }

        if (progress) {
            // Thumb width = visible fraction, position = scroll progress
            const fraction = Math.min(1, track.clientWidth / track.scrollWidth);
            const ratio = maxScroll > 0 ? viewStart / maxScroll : 0;
            progress.style.width = `${fraction * 100}%`;
            progress.style.transform =
                `translateX(${ratio * (1 / fraction - 1) * 100}%)`;
        }

        prev.disabled = viewStart <= 2;
        next.disabled = viewStart >= maxScroll - 2;
    }

    function move(direction) {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = slides[0].getBoundingClientRect().width + gap;

        track.scrollBy({
            left: direction * step,
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
    }

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));

    let ticking = false;
    function scheduleUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    }

    track.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    update();
})();
