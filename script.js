// ----- Jazykový přepínač -----
const translatableElements = document.querySelectorAll('[data-cs][data-de]');
const langBtns = document.querySelectorAll('.lang-btn');

function setLanguage(lang) {
    langBtns.forEach(btn => {
        if (btn.innerText.toLowerCase() === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    translatableElements.forEach(el => {
        // Zabráníme záměně tooltipů uvnitř html
        if (el.tagName.toLowerCase() === 'span' && el.classList.contains('contact-tooltip')) {
            el.innerText = el.getAttribute(`data-${lang}`);
        }
        else if (el.tagName.toLowerCase() === 'span' || el.tagName.toLowerCase() === 'h1' || el.tagName.toLowerCase() === 'h2' || el.tagName.toLowerCase() === 'h3' || el.tagName.toLowerCase() === 'h4' || el.tagName.toLowerCase() === 'h5' || el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'div') {
            el.innerHTML = el.getAttribute(`data-${lang}`);
        } else {
            el.innerText = el.getAttribute(`data-${lang}`);
        }
    });
}

// ----- Mobilní menu (Fullscreen Overlay) -----
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const fsLinks = document.querySelectorAll('.fs-link');

function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
closeMenuBtn.addEventListener('click', toggleMobileMenu);

fsLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ----- Kopírování E-mailu & Volání -----
const copyEmailBtn = document.getElementById('copy-email-btn');
const toast = document.getElementById('toast');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = copyEmailBtn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
            showToast();
        });
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ----- Sticky Navigace & Aktivní linky při skrolování -----
const navbar = document.getElementById('navbar');
const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-link');

function handleScroll() {
    // Navigace Shadow
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Prvky do Viewportu (Animace)
    animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInView = (rect.top <= window.innerHeight * 0.85);
        if (isInView) {
            el.classList.add('in-view');
        }
    });

    // Zvýraznění aktivní sekce v navigaci
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll); // Inicialní check po načtení

// ----- Lightbox pro galerii -----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');
const galleryItems = document.querySelectorAll('.g-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        // Načteme zdroj fotky bez limitu šířky Unsplash parametru (nebo jen zobrazíme plnou)
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

// Zavření lightboxu při kliknutí kamkoliv mimo fotku
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-frame')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});
