
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navbarToggle.addEventListener('click', () => {
    const isOpen = navbarMenu.classList.toggle('open');

    navbarToggle.classList.toggle('open', isOpen);
    navbarToggle.setAttribute('aria-expanded', isOpen);
    navbarToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú' : 'Abrir menú'
    );
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('open');
        navbarToggle.classList.remove('open');
        navbarToggle.setAttribute('aria-expanded', 'false');
        navbarToggle.setAttribute('aria-label', 'Abrir menú');
    });
});

// Highlight active section
const sections = document.querySelectorAll(
    '#home, #skillset, #experience, #portfolio, #contact'
);

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${entry.target.id}`
                );
            });
        }
    });
}, {
    rootMargin: '-25% 0px -60% 0px'
});

sections.forEach(section => observer.observe(section));
