document.addEventListener('DOMContentLoaded', () => {
    // --- راه‌اندازی اولیه کامپوننت‌های Material Design ---
    mdc.autoInit();

    // --- راه‌اندازی اسلایدرها ---
    const initSwipers = () => {
        new Swiper('.hero-slider', { loop: true, effect: 'fade', autoplay: { delay: 5000, disableOnInteraction: false }, pagination: { el: '.hero-slider .swiper-pagination', clickable: true }, navigation: { nextEl: '.hero-slider .swiper-button-next', prevEl: '.hero-slider .swiper-button-prev' } });
        new Swiper('.ad-slider-1', { loop: true, autoplay: { delay: 3000 }, navigation: { nextEl: '.ad-slider-1 .swiper-button-next', prevEl: '.ad-slider-1 .swiper-button-prev' } });
        new Swiper('.ad-slider-2', { loop: true, autoplay: { delay: 4500 }, navigation: { nextEl: '.ad-slider-2 .swiper-button-next', prevEl: '.ad-slider-2 .swiper-button-prev' } });
        new Swiper('.welcome-slider', { loop: true, autoplay: { delay: 2500 }, pagination: { el: '.welcome-slider .swiper-pagination', clickable: true } });
    };
    initSwipers();

    // --- منطق مودال خوشامدگویی ---
    const welcomeDialogElement = document.getElementById('welcome-dialog');
    if (welcomeDialogElement) {
        const dialog = new mdc.dialog.MDCDialog(welcomeDialogElement);
        setTimeout(() => dialog.open(), 1500);
    }

    // --- منطق بستن اسلایدرهای تبلیغاتی ---
    document.querySelectorAll('.ad-slider-close-btn').forEach(button => {
        button.addEventListener('click', () => button.closest('.ad-slider-container').classList.add('is-hidden'));
    });

    // =================== منطق پنل مدیریت حرفه‌ای ===================
    const adminPanelContainer = document.getElementById('admin-panel-container');
    const adminFab = document.getElementById('admin-fab');
    const adminCloseBtn = document.getElementById('admin-close-btn');

    const toggleAdminPanel = () => adminPanelContainer.classList.toggle('closed');

    adminFab.addEventListener('click', toggleAdminPanel);
    adminCloseBtn.addEventListener('click', toggleAdminPanel);
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            toggleAdminPanel();
        }
    });

    // --- مدیریت تب‌ها ---
    const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
    const contentPanels = document.querySelectorAll('.admin-content-panel');
    const imageControls = document.getElementById('admin-image-controls');
    
    tabBar.listen('MDCTabBar:activated', (event) => {
        contentPanels.forEach(panel => panel.classList.remove('active'));
        const activePanel = contentPanels[event.detail.index];
        activePanel.classList.add('active');
        
        // مودال کنترل تصویر ندارد، پس آن را مخفی می‌کنیم
        imageControls.style.display = activePanel.dataset.panelType === 'modal' ? 'none' : 'flex';
        
        // [!!!] راهکار اصلی: حذف این خط کد [!!!]
        // resetAllForms(); // این خط باعث پاک شدن حالت فرم در هر بار تعویض تب می‌شد
    });

    // --- نمونه‌سازی کامپوننت‌های MDC ---
    const mdcInstances = {};
    document.querySelectorAll('.mdc-select, .mdc-text-field').forEach(el => {
        const id = el.id || el.dataset.id;
        if (!id) return;
        if (el.classList.contains('mdc-select')) mdcInstances[id] = new mdc.select.MDCSelect(el);
        if (el.classList.contains('mdc-text-field')) mdcInstances[id] = new mdc.textField.MDCTextField(el);
    });

    const imagePreviewImg = document.getElementById('image-preview-img');
    mdcInstances['image-url-mdc'].input.addEventListener('input', (e) => {
        imagePreviewImg.src = e.target.value;
    });
    imagePreviewImg.onerror = () => {
        imagePreviewImg.src = ''; // مخفی کردن تصویر در صورت خطا
    };

    // --- منطق هوشمند پر کردن فرم‌ها ---
    const populateAdminForm = (type, id) => {
        let element;
        if (type === 'hero') element = document.querySelector(`.hero-slider .swiper-slide[data-slide-id="${id}"]`);
        if (type === 'ad') element = document.querySelector(`.swiper-slide[data-ad-id="${id}"]`);
        if (!element) return;

        // پر کردن فیلدهای متنی
        const activePanel = document.querySelector('.admin-content-panel.active');
        activePanel.querySelectorAll('input[data-target-prop]').forEach(input => {
            const prop = input.dataset.targetProp;
            const targetEl = element.querySelector(`[data-target="${prop}"]`);
            if (targetEl) mdcInstances[input.parentElement.dataset.id].value = targetEl.textContent;
        });

        // پر کردن فیلدهای تصویر
        const imgElement = element.querySelector('img[data-target="img"]');
        if (imgElement) {
            mdcInstances['image-url-mdc'].value = imgElement.src;
            mdcInstances['image-fit-mdc'].value = imgElement.style.objectFit || 'cover';
            mdcInstances['image-pos-mdc'].value = imgElement.style.objectPosition || 'center';
            imagePreviewImg.src = imgElement.src;
        }
    };
    
    mdcInstances['hero-select-mdc'].listen('MDCSelect:change', (e) => populateAdminForm('hero', e.detail.value));
    mdcInstances['ad-select-mdc'].listen('MDCSelect:change', (e) => populateAdminForm('ad', e.detail.value));

    // --- منطق دکمه بروزرسانی ---
    document.getElementById('update-content-btn').addEventListener('click', () => {
        const activePanel = document.querySelector('.admin-content-panel.active');
        const type = activePanel.dataset.panelType;
        
        if (type === 'hero' || type === 'ad') {
            const selectId = type === 'hero' ? 'hero-select-mdc' : 'ad-select-mdc';
            const elementId = mdcInstances[selectId].value;
            if (!elementId) return;

            const selector = type === 'hero' ? `.swiper-slide[data-slide-id="${elementId}"]` : `.swiper-slide[data-ad-id="${elementId}"]`;
            const element = document.querySelector(selector);

            // بروزرسانی متن‌ها
            activePanel.querySelectorAll('input[data-target-prop]').forEach(input => {
                const prop = input.dataset.targetProp;
                const targetEl = element.querySelector(`[data-target="${prop}"]`);
                if (targetEl) targetEl.textContent = mdcInstances[input.parentElement.dataset.id].value;
            });

            // بروزرسانی تصویر
            const imgElement = element.querySelector('img[data-target="img"]');
            if (imgElement) {
                imgElement.src = mdcInstances['image-url-mdc'].value;
                imgElement.style.objectFit = mdcInstances['image-fit-mdc'].value;
                imgElement.style.objectPosition = mdcInstances['image-pos-mdc'].value;
            }
        } else if (type === 'modal') {
            // بروزرسانی مودال
            document.querySelector('[data-modal-target="title"]').textContent = mdcInstances['modal-title-mdc'].value;
            document.querySelector('[data-modal-target="desc"]').textContent = mdcInstances['modal-desc-mdc'].value;
            document.querySelector('[data-modal-target="button"]').textContent = mdcInstances['modal-btn-mdc'].value;
            document.querySelector('[data-modal-slide-id="1"] img').src = mdcInstances['modal-bg1-mdc'].value;
            document.querySelector('[data-modal-slide-id="2"] img').src = mdcInstances['modal-bg2-mdc'].value;
        }
        
        // نمایش یک فیدبک ساده
        const btn = document.getElementById('update-content-btn');
        const originalText = btn.querySelector('.mdc-button__label').textContent;
        btn.querySelector('.mdc-button__label').textContent = 'انجام شد!';
        setTimeout(() => {
            btn.querySelector('.mdc-button__label').textContent = originalText;
        }, 1500);
    });

    // --- ابزار کمکی برای ریست کردن فرم‌ها (اکنون دیگر به صورت خودکار فراخوانی نمی‌شود) ---
    const resetAllForms = () => {
        Object.values(mdcInstances).forEach(instance => {
            instance.value = '';
            if (instance instanceof mdc.select.MDCSelect) {
                if (instance.root.querySelector('.mdc-list-item')) {
                    instance.selectedIndex = -1;
                }
            }
        });
        imagePreviewImg.src = '';
    };

    console.log("Gaming Market Platform Initialized with Professional Admin Panel (v1.1 - UX Fix Applied).");
});