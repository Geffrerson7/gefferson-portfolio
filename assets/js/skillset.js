
const skillsTrack = document.getElementById('skills-track');
const skillsPrev = document.getElementById('skills-prev');
const skillsNext = document.getElementById('skills-next');
const skillsCounter = document.getElementById('skills-counter');
const skillsProgress = document.getElementById('skills-progress-bar');

const skillsSlides = [...skillsTrack.querySelectorAll('.skills-slide')];

function updateSkillsCarousel() {
    const maxScroll = skillsTrack.scrollWidth - skillsTrack.clientWidth;

    const currentScroll = skillsTrack.scrollLeft;

    const progress = maxScroll > 0
        ? currentScroll / maxScroll
        : 0;

    const currentIndex = skillsSlides.reduce((closest, slide, index) => {
        const currentDistance = Math.abs(
            slide.offsetLeft - skillsTrack.offsetLeft - currentScroll
        );

        const closestDistance = Math.abs(
            skillsSlides[closest].offsetLeft -
            skillsTrack.offsetLeft -
            currentScroll
        );

        return currentDistance < closestDistance ? index : closest;
    }, 0);

    skillsCounter.textContent =
        `${String(currentIndex + 1).padStart(2, '0')} / 06`;

    skillsProgress.style.width =
        `${Math.max(16.666, progress * 100)}%`;

    skillsPrev.disabled = currentScroll <= 2;
    skillsNext.disabled = currentScroll >= maxScroll - 2;
}

function moveSkills(direction) {
    const firstSlide = skillsSlides[0];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(skillsTrack).gap) || 0;

    skillsTrack.scrollBy({
        left: direction * (slideWidth + gap),
        behavior: 'smooth'
    });
}

skillsPrev.addEventListener('click', () => moveSkills(-1));
skillsNext.addEventListener('click', () => moveSkills(1));

skillsTrack.addEventListener('scroll', updateSkillsCarousel);
window.addEventListener('resize', updateSkillsCarousel);

updateSkillsCarousel();
