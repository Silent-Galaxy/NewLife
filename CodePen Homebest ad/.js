document.addEventListener('DOMContentLoaded', () => {
    // --- راه‌اندازی اولیه کامپوننت‌های Material Design ---
    mdc.autoInit();
    
    // --- منطق مودال خوشامدگویی با اسلایدر داخلی ---
    const welcomeDialogElement = document.getElementById('welcome-dialog');
    if (welcomeDialogElement) {
        const dialog = new mdc.dialog.MDCDialog(welcomeDialogElement);
        let welcomeSwiper = null;

        // فقط بار اول که دیالوگ باز می‌شود، اسلایدر را مقداردهی کن
        dialog.listen('MDCDialog:opening', () => {
            if (!welcomeSwiper) {
                welcomeSwiper = new Swiper('.welcome-slider', {
                    loop: true,
                    autoplay: { delay: 2500 },
                    pagination: { el: '.welcome-slider .swiper-pagination', clickable: true },
                });
            }
        });

        // باز کردن خودکار مودال در اولین بازدید
        dialog.open();
    }

    // --- منطق بستن اسلایدرهای تبلیغاتی ---
    document.querySelectorAll('.ad-slider-close-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.ad-slider-container').classList.add('is-hidden');
        });
    });

    // --- راه‌اندازی اسلایدر اصلی (Hero) ---
    new Swiper('.hero-slider', {
        loop: true,
        effect: 'fade',
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.hero-slider .swiper-pagination', clickable: true },
        navigation: { nextEl: '.hero-slider .swiper-button-next', prevEl: '.hero-slider .swiper-button-prev' },
    });
    
    // --- راه‌اندازی اسلایدرهای تبلیغاتی کناری ---
    new Swiper('.ad-slider-1', {
        loop: true, autoplay: { delay: 3000 }, navigation: { nextEl: '.ad-slider-1 .swiper-button-next', prevEl: '.ad-slider-1 .swiper-button-prev' },
    });
    new Swiper('.ad-slider-2', {
        loop: true, autoplay: { delay: 4500 }, navigation: { nextEl: '.ad-slider-2 .swiper-button-next', prevEl: '.ad-slider-2 .swiper-button-prev' },
    });
    new Swiper('.ad-slider-3', {
        loop: true, autoplay: { delay: 4000 }, navigation: { nextEl: '.ad-slider-3 .swiper-button-next', prevEl: '.ad-slider-3 .swiper-button-prev' },
    });

    console.log("Gaming Market Platform Initialized Successfully.");
});