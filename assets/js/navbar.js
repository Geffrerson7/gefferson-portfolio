/* ========================================
   NAVBAR
   - Mobile menu (toggle, Escape, outside click, resize)
   - Scrolled state
   - Active link synced with the visible section
   - Language switch keeps the current section (#hash)
   Translatable labels come from data-* attributes in the HTML.
======================================== */

(() => {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-menu');

    if (!navbar || !toggle || !menu) return;

    const navLinks = [...document.querySelectorAll('.nav-link')];
    const contactLink = menu.querySelector('.navbar-contact');
    const mobileQuery = window.matchMedia('(max-width: 850px)');
    const labelOpen = toggle.dataset.labelOpen || 'Open menu';
    const labelClose = toggle.dataset.labelClose || 'Close menu';

    /* ---------- Mobile menu ---------- */

    function setMenu(open, { restoreFocus = false } = {}) {
        menu.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? labelClose : labelOpen);
        document.body.classList.toggle('menu-open', open);

        if (!open && restoreFocus) toggle.focus();
    }

    const isOpen = () => menu.classList.contains('open');

    toggle.addEventListener('click', () => setMenu(!isOpen()));

    // Any link inside the menu (nav links + "Let's talk") closes it
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) setMenu(false);
    });

    // Brand link also closes the menu
    navbar.querySelector('.navbar-brand')?.addEventListener('click', () => setMenu(false));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isOpen()) setMenu(false, { restoreFocus: true });
    });

    document.addEventListener('click', event => {
        if (isOpen() && !navbar.contains(event.target)) setMenu(false);
    });

    // Leaving the mobile layout with the menu open must not leave the page locked
    mobileQuery.addEventListener('change', event => {
        if (!event.matches) setMenu(false);
    });

    /* ---------- Scroll state + active section ---------- */

    const sectionIds = ['home', 'skillset', 'experience', 'portfolio', 'contact'];
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function setActive(id) {
        navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });

        if (contactLink) contactLink.classList.toggle('active', id === 'contact');
    }

    function getCurrentSection() {
        const doc = document.documentElement;

        // At the very bottom, the last section is the current one even if short
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
            return sections[sections.length - 1].id;
        }

        // Reference line: just below the navbar, a third into the viewport
        const line = navbar.offsetHeight + window.innerHeight * 0.3;
        let current = sections[0].id;

        for (const section of sections) {
            if (section.getBoundingClientRect().top <= line) current = section.id;
        }

        return current;
    }

    let ticking = false;
    let lastActive = '';

    function onScroll() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 10);

            const current = getCurrentSection();
            if (current !== lastActive) {
                setActive(current);
                lastActive = current;
            }

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* ---------- Language switch ---------- */

    // Both versions share the same section ids, so carry the current one over.
    // Without JS the links still work and land on the top of the other version.
    document.querySelectorAll('.lang-link:not(.active)').forEach(link => {
        link.addEventListener('click', () => {
            const target = new URL(link.getAttribute('href'), window.location.href);
            target.hash = lastActive && lastActive !== 'home' ? lastActive : '';
            link.href = target.href;
        });
    });
})();
