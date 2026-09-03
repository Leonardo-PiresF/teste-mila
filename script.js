/* =========================================================
   Kamila Pontes | Psicologia Clínica
   Interações: menu mobile, FAQ accordion, header no scroll,
   link ativo na navegação e revelação suave dos blocos.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Menu mobile ---------- */
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        const iconUse = menuBtn.querySelector('use');
        const setIcon = (name) => {
            if (iconUse) iconUse.setAttribute('href', '#i-' + name);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Abrir menu');
            setIcon('menu');
        };

        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
            setIcon(isOpen ? 'close' : 'menu');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 960) closeMenu();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ---------- Header com sombra ao rolar ---------- */
    const header = document.querySelector('.site-header');
    const onScroll = () => {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- FAQ accordion ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        if (!question) return;

        question.addEventListener('click', () => {
            const willOpen = !item.classList.contains('is-open');

            // fecha os demais para manter a leitura limpa
            faqItems.forEach(other => {
                other.classList.remove('is-open');
                const q = other.querySelector('.faq-q');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (willOpen) {
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- Revelação suave ao entrar na tela ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    /* ---------- Link ativo conforme a seção visível ---------- */
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'is-active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(section => spy.observe(section));
    }
});
