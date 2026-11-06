/* ========================================
   THEME (dark / light)
   - The initial theme is applied by a tiny inline script in <head>
     (before CSS paints) to avoid a flash of the wrong theme.
   - This file wires the toggle button, saves the choice in
     localStorage and follows the OS setting while no choice is saved.
   - localStorage is per origin, so "/" and "/en/" share the choice.
======================================== */

(() => {
    const STORAGE_KEY = 'theme';
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const systemLight = window.matchMedia('(prefers-color-scheme: light)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const THEME_COLORS = { dark: '#101820', light: '#F1F3F5' };

    function getSaved() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value === 'light' || value === 'dark' ? value : null;
        } catch {
            return null; // storage blocked (privacy mode): fall back to the OS
        }
    }

    function save(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* ignore: the theme still applies for this page view */
        }
    }

    function apply(theme, { animate = false } = {}) {
        if (animate && !reducedMotion.matches) {
            root.classList.add('theme-transition');
            window.setTimeout(() => root.classList.remove('theme-transition'), 400);
        }

        root.setAttribute('data-theme', theme);
        if (themeColorMeta) themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
        if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'light'));
    }

    // Sync the button/meta with whatever the inline script decided
    apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    toggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        save(next);

        // Progressive enhancement: a soft cross-fade via the View Transitions
        // API where available; otherwise the CSS colour transition above.
        if (document.startViewTransition && !reducedMotion.matches) {
            document.startViewTransition(() => apply(next));
        } else {
            apply(next, { animate: true });
        }
    });

    // Follow OS changes only while the visitor has not chosen a theme
    systemLight.addEventListener('change', event => {
        if (!getSaved()) apply(event.matches ? 'light' : 'dark', { animate: true });
    });

    // Another tab (e.g. the other language) changed the theme
    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
            apply(event.newValue, { animate: true });
        }
    });
})();
