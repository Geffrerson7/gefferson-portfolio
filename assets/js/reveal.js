/* ========================================
   SCROLL REVEAL ("signals travel")
   Elements marked with [data-reveal] fade/rise into view once.
   - Only runs when <html> has .motion (set in <head> when motion is
     allowed and IntersectionObserver exists).
   - Children of [data-reveal-group] are staggered.
   - After the reveal, [data-reveal] is removed so each component keeps
     its own hover/focus transitions.
======================================== */

(() => {
    const root = document.documentElement;
    if (!root.classList.contains('motion')) return;

    // Tell the <head> safety timer that the script is running
    root.classList.add('motion-ready');

    const STEP = 70;        // ms between staggered siblings
    const MAX_DELAY = 280;  // keep groups snappy

    document.querySelectorAll('[data-reveal-group]').forEach(group => {
        group.querySelectorAll('[data-reveal]').forEach((el, index) => {
            el.style.setProperty('--reveal-delay', `${Math.min(index * STEP, MAX_DELAY)}ms`);
        });
    });

    function finish(el) {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            observer.unobserve(el);
            el.classList.add('is-visible');

            // Clean up after the transition (with a timeout as a fallback)
            const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
            window.setTimeout(() => finish(el), delay + 800);
        });
    }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();
