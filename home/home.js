function getNavbarHeight() {
    const nav = document.querySelector('.navbar');
    return nav ? nav.offsetHeight : 0;
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = getNavbarHeight();
    const targetY = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
}

function scrollToTop() {
    const navbarHeight = getNavbarHeight();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enableHeroBackgroundStacking() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.style.backgroundImage =
        'linear-gradient(rgba(245,240,230,0.6), rgba(245,240,230,0.6)), url("../images/home%20bg.jpg")';
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
    hero.style.backgroundRepeat = 'no-repeat';
    hero.style.backgroundAttachment = 'fixed';

    hero.style.position = 'fixed';
    hero.style.top = '0';
    hero.style.left = '0';
    hero.style.width = '100%';
    hero.style.height = '100vh';
    hero.style.zIndex = '0';

    const firstContent = document.querySelector('.content-section');
    if (firstContent) {
        firstContent.style.position = 'relative';
        firstContent.style.zIndex = '1';
        firstContent.style.marginTop = `${hero.offsetHeight}px`;
    }

    const nav = document.querySelector('.navbar');
    if (nav) nav.style.zIndex = '1000';
}

function resetHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.style.position = '';
    hero.style.top = '';
    hero.style.left = '';
    hero.style.width = '';
    hero.style.height = '';
    hero.style.zIndex = '';

    const firstContent = document.querySelector('.content-section');
    if (firstContent) {
        firstContent.style.marginTop = '';
        firstContent.style.position = '';
        firstContent.style.zIndex = '';
    }
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-item').forEach(link => {
    const linkPage = link.getAttribute('href').split('#')[0];
    if (linkPage === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ⭐ FIXED: hero stacking moet draaien op index.html, niet home.html
if (currentPage === 'index.html' || currentPage === '') {

    document.addEventListener('DOMContentLoaded', () => {
        enableHeroBackgroundStacking();

        window.addEventListener('resize', () => {
            const hero = document.getElementById('hero');
            const firstContent = document.querySelector('.content-section');
            if (hero && firstContent) {
                firstContent.style.marginTop = `${hero.offsetHeight}px`;
            }
        });
    });

    window.addEventListener('scroll', () => {
        const hero = document.getElementById('hero');
        if (!hero) return;
        const scrolled = window.scrollY;
        hero.style.backgroundPosition = `center ${Math.max(0, 50 - scrolled * 0.0)}%`;
    });

} else {
    resetHero();
}
