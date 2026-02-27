/* ========================================
   Juris Ivy | 清禾 — Main JavaScript
   ======================================== */

(function () {
    'use strict';

    // --- Language Toggle ---
    let currentLang = 'en';

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langOptions = langToggle.querySelectorAll('.lang-option');

        function switchLanguage(lang) {
            currentLang = lang;

            langOptions.forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });

            document.body.classList.toggle('lang-zh', lang === 'zh');

            document.querySelectorAll('[data-en][data-zh]').forEach(el => {
                const text = lang === 'zh' ? el.dataset.zh : el.dataset.en;
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            });

            // Update page title based on current page
            const path = window.location.pathname;
            if (path.includes('stories')) {
                document.title = lang === 'zh'
                    ? '成功案例 | Juris Ivy 清禾'
                    : 'Success Stories | Juris Ivy 清禾';
            } else if (path.includes('articles')) {
                document.title = lang === 'zh'
                    ? '文章与科普 | Juris Ivy 清禾'
                    : 'Articles & Guides | Juris Ivy 清禾';
            } else if (path.includes('assessment')) {
                document.title = lang === 'zh'
                    ? '免费评估 | Juris Ivy 清禾'
                    : 'Free Assessment | Juris Ivy 清禾';
            } else {
                document.title = lang === 'zh'
                    ? 'Juris Ivy | 清禾 - 顶级法学院申请咨询'
                    : 'Juris Ivy | 清禾 - Top Law School Admissions Consulting';
            }
        }

        langToggle.addEventListener('click', function () {
            switchLanguage(currentLang === 'en' ? 'zh' : 'en');
        });

        // --- Auto-detect language by IP geolocation ---
        function detectLang(url, getCountry) {
            return fetch(url)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    var country = getCountry(data);
                    if (country === 'CN') {
                        switchLanguage('zh');
                    } else {
                        switchLanguage('en');
                    }
                });
        }

        detectLang('https://ipapi.co/json/', function (d) { return d && d.country_code; })
            .catch(function () {
                return detectLang('https://ip-api.com/json/?fields=countryCode', function (d) { return d && d.countryCode; });
            })
            .catch(function () {
                // all failed, keep English
            });
    }

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    }

    // --- Stats Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated || statNumbers.length === 0) return;

        const firstStat = statNumbers[0];
        const rect = firstStat.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        statsAnimated = true;

        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);
                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // --- Scroll Fade-in Animation with Stagger ---
    function addFadeInElements() {
        const groupSelectors = [
            '.service-card',
            '.service-card-link',
            '.result-card',
            '.team-card',
            '.testimonial-card',
            '.why-item',
            '.article-card',
            '.contact-card'
        ];

        const singleSelectors = [
            '.about-brief-content',
            '.cta-content',
            '.assessment-wrapper'
        ];

        groupSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('fade-in', 'stagger-' + Math.min(i + 1, 4));
            });
        });

        singleSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('fade-in');
            });
        });
    }

    function handleScrollAnimations() {
        document.querySelectorAll('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-height'), 10) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Article Expand/Collapse ---
    document.querySelectorAll('[data-article-toggle]').forEach(header => {
        header.addEventListener('click', function () {
            const card = this.closest('[data-article]');
            if (card) {
                card.classList.toggle('expanded');
                const btn = card.querySelector('.article-expand-btn');
                if (btn) {
                    if (card.classList.contains('expanded')) {
                        btn.textContent = currentLang === 'zh' ? '收起 ↑' : 'Collapse ↑';
                    } else {
                        btn.textContent = currentLang === 'zh' ? '展开阅读 ↓' : 'Read More ↓';
                    }
                }
            }
        });
    });

    // --- File Upload ---
    const fileUploadArea = document.getElementById('fileUploadArea');
    const resumeFile = document.getElementById('resumeFile');
    const fileNameDisplay = document.getElementById('fileName');

    if (fileUploadArea && resumeFile) {
        fileUploadArea.addEventListener('click', function () {
            resumeFile.click();
        });

        resumeFile.addEventListener('change', function () {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            }
        });

        fileUploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', function () {
            this.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                resumeFile.files = files;
                fileNameDisplay.textContent = files[0].name;
            }
        });
    }

    // --- Assessment Form ---
    const assessmentForm = document.getElementById('assessmentForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = currentLang === 'zh' ? '已提交 ✓ 我们将在12小时内回复' : 'Submitted ✓ We\'ll respond within 12 hours';
            btn.style.backgroundColor = 'var(--color-green)';
            btn.style.borderColor = 'var(--color-green)';
            btn.style.color = 'var(--color-white)';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.disabled = false;
                this.reset();
                if (fileNameDisplay) fileNameDisplay.textContent = '';
            }, 5000);
        });
    }

    // --- Contact Form (if present) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = currentLang === 'zh' ? '已提交 ✓' : 'Submitted ✓';
            btn.style.backgroundColor = 'var(--color-green)';
            btn.style.borderColor = 'var(--color-green)';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.disabled = false;
                this.reset();
            }, 3000);
        });
    }

    // --- Combined Scroll Handler ---
    function onScroll() {
        handleNavbarScroll();
        animateCounters();
        handleScrollAnimations();
        handleBackToTop();
    }

    // --- Init ---
    addFadeInElements();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Trigger once on load
    onScroll();

})();
