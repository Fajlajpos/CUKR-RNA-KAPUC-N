// ----- Jazykový přepínač -----
const translatableElements = document.querySelectorAll('[data-cs][data-de]');
const langBtns = document.querySelectorAll('.lang-btn');

function setLanguage(lang) {
    const allLangBtns = document.querySelectorAll('.lang-btn');
    allLangBtns.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (!text) return;

        if (el.tagName.toLowerCase() === 'span' && el.classList.contains('contact-tooltip')) {
            el.innerText = text;
        } else if (['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'div'].includes(el.tagName.toLowerCase())) {
            el.innerHTML = text;
        } else {
            el.innerText = text;
        }
    });
}

// Initial language check
document.addEventListener('DOMContentLoaded', () => {
    // Default to 'cs' if not set, or adjust as needed
    setLanguage('cs');
});

// ----- Mobilní menu (Fullscreen Overlay) -----
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const fsLinks = document.querySelectorAll('.fs-link');

function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Robustní obnovení scrollu
function enableScroll() {
    document.body.style.overflow = '';
}

// Event listener pro odkazy v mobilním menu - zavřít menu a pustit scroll
document.querySelectorAll('.fs-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        enableScroll();
    });
});

// Zavření menu při kliknutí na pozadí (pokud existuje overlay element)
mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
        mobileNav.classList.remove('active');
        enableScroll();
    }
});

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
    // Clear any existing timeout to prevent overlapping clears
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000); // Shortened to 2s
}

// ----- Sticky Navigace & Aktivní linky při skrolování -----
const navbar = document.getElementById('navbar');
const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-link');

let isScrolling = false;

// IntersectionObserver for better mobile performance
const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Once seen, we can stop observing this element
            appearanceObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => appearanceObserver.observe(el));

function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;

            // Navigace Shadow & Plynulost přechodu
            if (scrollPos > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Zvýraznění aktivní sekce (Plynulejší detekce středu obrazovky)
            let current = '';
            const scrollOffset = window.innerHeight / 3;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= (sectionTop - scrollOffset) && scrollPos < (sectionTop + sectionHeight - scrollOffset)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
}

// ----- Kopírování E-mailu v Kontakt bloku -----
const copyEmailEcBtn = document.getElementById('copy-email-ec');
if (copyEmailEcBtn) {
    copyEmailEcBtn.addEventListener('click', () => {
        const email = copyEmailEcBtn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
            showToast();
        });
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('load', () => {
    // Okamžitý check pozice bez animace na startu
    handleScroll();
    // Malá pojistka pro "usazení" layoutu
    setTimeout(handleScroll, 100);
});

// ----- Lightbox pro galerii -----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');
const lightboxCounter = document.getElementById('lightbox-counter');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

const galleryImages = document.querySelectorAll('.bento-img');
let currentImageIndex = 0;

function updateLightboxImage(index) {
    // Plynulý přechod mizející fotky
    lightboxImg.classList.add('fade-out');

    setTimeout(() => {
        lightboxImg.src = galleryImages[index].src;
        lightboxCounter.innerText = `${index + 1} / ${galleryImages.length}`;
        currentImageIndex = index;

        lightboxImg.onload = () => {
            lightboxImg.classList.remove('fade-out');
        };
    }, 150);
}

galleryImages.forEach((img, index) => {
    img.closest('.bento-item').addEventListener('click', () => {
        lightboxImg.classList.remove('fade-out');
        lightboxImg.src = img.src;
        currentImageIndex = index;

        lightboxCounter.innerText = `${index + 1} / ${galleryImages.length}`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightboxHandler() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

closeLightbox.addEventListener('click', closeLightboxHandler);

// Zavření lightboxu při kliknutí kamkoliv mimo fotku
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-frame')) {
        closeLightboxHandler();
    }
});

// Navigace šipkami v HTML
lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    let newIndex = currentImageIndex - 1;
    if (newIndex < 0) newIndex = galleryImages.length - 1;
    updateLightboxImage(newIndex);
});

lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    let newIndex = currentImageIndex + 1;
    if (newIndex >= galleryImages.length) newIndex = 0;
    updateLightboxImage(newIndex);
});

// Navigace klávesnicí
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightboxHandler();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
});

// ----- Podpora gest (Swipe) pro mobilní galerii -----
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // minimální délka swajpu v px

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance < 0) {
            // Swajp doleva -> další obrázek
            lbNext.click();
        } else {
            // Swajp doprava -> předchozí obrázek
            lbPrev.click();
        }
    }
}

// ----- Privacy Policy Modal -----
const privacyTrigger = document.getElementById('privacy-trigger');
const privacyModal = document.getElementById('privacy-modal');
const pmClose = document.getElementById('pm-close');
const pmOverlay = privacyModal ? privacyModal.querySelector('.pm-overlay') : null;

if (privacyTrigger && privacyModal) {
    privacyTrigger.addEventListener('click', () => {
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function closePrivacyModal() {
    privacyModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (pmClose) pmClose.addEventListener('click', closePrivacyModal);
if (pmOverlay) pmOverlay.addEventListener('click', closePrivacyModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('active')) {
        closePrivacyModal();
    }
});
