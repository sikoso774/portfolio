// Interactions du portfolio — compatibles avec les View Transitions d'Astro.
//
// Avec le ClientRouter, le document persiste mais le contenu du <body> est
// remplacé à chaque navigation. On attache donc les écouteurs globaux
// (window/document) UNE SEULE FOIS via délégation, et on rejoue les effets
// liés au contenu de la page à chaque évènement `astro:page-load`.

// Met à jour le header, la barre de progression et le bouton "back to top"
// en fonction de la position de scroll. Les éléments sont relus à chaud
// car certains sont recréés à chaque navigation.
function refreshChrome() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const y = window.scrollY;

    if (header) header.classList.toggle('scrolled', y > 20);

    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + '%';
    }

    if (backToTop) backToTop.classList.toggle('visible', y > 400);
}

// Reconstruit l'adresse e-mail côté client (anti-scraping basique).
function setFooterEmail() {
    const link = document.getElementById('footer-cta-email');
    if (link && !link.href.startsWith('mailto:')) {
        const u = 'zolenikokolozassi';
        const d = 'outlook.com';
        link.href = 'mailto:' + u + '@' + d;
    }
}

// Animation d'entrée des sections/cartes au scroll. Rejouée à chaque page.
function animateIn() {
    const targets = document.querySelectorAll('.card, .section-header, .skills-category');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    targets.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Écouteurs globaux attachés une seule fois (le document survit aux navigations).
let globalsBound = false;
function bindGlobals() {
    if (globalsBound) return;
    globalsBound = true;

    window.addEventListener('scroll', refreshChrome, { passive: true });

    document.addEventListener('click', (e) => {
        const header = document.getElementById('header');
        const btn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mobileMenu');

        // Back to top
        if (e.target.closest('#back-to-top')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Toggle du menu mobile
        if (e.target.closest('#mobileMenuBtn')) {
            btn?.classList.toggle('active');
            menu?.classList.toggle('active');
            header?.classList.toggle('menu-open');
            return;
        }

        // Clic sur un lien du menu mobile : on le ferme (section, blog…).
        // (le scroll fluide est géré nativement par `scroll-behavior: smooth`)
        if (e.target.closest('#mobileMenu a')) {
            btn?.classList.remove('active');
            menu?.classList.remove('active');
            header?.classList.remove('menu-open');
        }
    });
}

function init() {
    bindGlobals();
    setFooterEmail();
    animateIn();
    refreshChrome();
}

// `astro:page-load` se déclenche au chargement initial ET après chaque
// navigation client. C'est le point d'entrée recommandé avec le ClientRouter.
document.addEventListener('astro:page-load', init);
