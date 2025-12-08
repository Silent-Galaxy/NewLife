document.addEventListener('DOMContentLoaded', function() {
    // --- بخش تاریخ و ساعت ---
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    function updateDateTime() {
        const lang = document.body.classList.contains('lang-fa') ? 'fa' : 'en';
        const now = new Date();
        if (lang === 'fa') {
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'persian', timeZone: 'Asia/Tehran' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Tehran' };
            const weekday = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { weekday: 'long', calendar: 'persian', timeZone: 'Asia/Tehran' }).format(now);
            dateEl.textContent = `${weekday}, ${new Intl.DateTimeFormat('fa-IR-u-nu-latn', dateOptions).format(now)}`;
            timeEl.textContent = new Intl.DateTimeFormat('fa-IR-u-nu-latn', timeOptions).format(now);
        } else {
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            dateEl.textContent = new Intl.DateTimeFormat(navigator.language, dateOptions).format(now);
            timeEl.textContent = new Intl.DateTimeFormat(navigator.language, timeOptions).format(now);
        }
    }

    // --- بخش ترجمه‌ها (کامل شده) ---
    const translations = {
        en: { store_brand: "NEON STORE", search_placeholder: "Search products...", store_title: "Our Products", category_gadgets: "Gadgets", category_fashion: "Fashion", category_audio: "Audio", category_other: "Other", product1_name: "Cyber Watch X", product2_name: "Neon Runners", product3_name: "Aura Headphones", product4_name: "Smart Ring", product5_name: "VR Headset", product6_name: "Retro Camera", product7_name: "Smartphone Pro", product8_name: "Leather Jacket", product9_name: "Classic Boots", product10_name: "Adventure Backpack", product11_name: "Designer Sunglasses", product12_name: "Portable Speaker", product13_name: "Mystery Box", status_instock: "In Stock", status_outofstock: "Out of Stock", quantity: "Quantity", stock_status_overlay: "Out of Stock", load_more: "Load More Products", filters_title: "Filters", price_range: "Price Range", min_price: "Min", max_price: "Max", categories: "Categories", status: "Status", offers: "Offers", on_sale: "On Sale", sale_badge: "SALE", sort_by_label: "Sort by:", sort_popularity: "Most Popular", sort_price_asc: "Price: Low to High", sort_price_desc: "Price: High to Low", sort_discount: "Biggest Discount", sort_reviews: "Most Reviewed", no_image_placeholder: "No Image", reset_filters: "Reset Filters", ad_title: "Advertisements", ad_placeholder: "Your Ad Here", footer_about_title: "Neon Store", footer_about_text: "Your one-stop shop for the coolest neon-themed gadgets and fashion. Lighting up your style since 2025.", footer_links_title: "Quick Links", link_about: "About Us", link_contact: "Contact", link_faq: "FAQ", link_terms: "Terms of Service", footer_social_title: "Follow Us", footer_trust_title: "Trust Seals", footer_copyright: "© {year} Neon Store. All Rights Reserved.", coming_soon: "Coming Soon", ad1_title: "Retro Week", ad1_text: "All retro gadgets 25% off!", ad2_title: "Audio Blast", ad2_text: "Flash sale on all audio devices.", countdown_ends_in: "Offer ends in:", countdown_expired: "Expired" },
        fa: { store_brand: "فروشگاه نئون", search_placeholder: "جستجوی محصولات...", store_title: "محصولات ما", category_gadgets: "گجت‌ها", category_fashion: "مد و پوشاک", category_audio: "صوتی", category_other: "متفرقه", product1_name: "ساعت سایبری", product2_name: "کتانی نئونی", product3_name: "هدفون آئورا", product4_name: "انگشتر هوشمند", product5_name: "هدست واقعیت مجازی", product6_name: "دوربین کلاسیک", product7_name: "گوشی هوشمند پرو", product8_name: "کاپشن چرم", product9_name: "بوت کلاسیک", product10_name: "کوله پشتی سفری", product11_name: "عینک آفتابی", product12_name: "اسپیکر قابل حمل", product13_name: "جعبه شانسی", status_instock: "موجود", status_outofstock: "ناموجود", quantity: "تعداد", stock_status_overlay: "ناموجود", load_more: "نمایش محصولات بیشتر", filters_title: "فیلترها", price_range: "محدوده قیمت", min_price: "حداقل", max_price: "حداکثر", categories: "دسته‌بندی‌ها", status: "وضعیت", offers: "پیشنهادها", on_sale: "تخفیف‌خورده", sale_badge: "تخفیف", sort_by_label: "ترتیب بر اساس:", sort_popularity: "پربازدیدترین", sort_price_asc: "قیمت:‌ کم به زیاد", sort_price_desc: "قیمت: زیاد به کم", sort_discount: "بیشترین تخفیف", sort_reviews: "بیشترین نظر", no_image_placeholder: "بدون تصویر", reset_filters: "پاک‌سازی فیلترها", ad_title: "تبلیغات", ad_placeholder: "مکان تبلیغ شما", footer_about_title: "فروشگاه نئون", footer_about_text: "فروشگاه تخصصی شما برای جدیدترین گجت‌ها و پوشاک با تم نئون. استایل خود را از سال ۲۰۲۵ درخشان کنید.", footer_links_title: "لینک‌های سریع", link_about: "درباره ما", link_contact: "تماس با ما", link_faq: "سوالات متداول", link_terms: "شرایط خدمات", footer_social_title: "ما را دنبال کنید", footer_trust_title: "نمادهای اعتماد", footer_copyright: ".تمام حقوق محفوظ است © {year} فروشگاه نئون", coming_soon: "بزودی", ad1_title: "هفته نوستالژی", ad1_text: "٪۲۵ تخفیف برای تمام گجت‌های کلاسیک!", ad2_title: "جشنواره صدا", ad2_text: "فروش ویژه تمام تجهیزات صوتی.", countdown_ends_in: "زمان باقی‌مانده:", countdown_expired: "منقضی شد" }
    };

    // --- بخش تغییر زبان ---
    const langButtons = document.querySelectorAll('.lang-switcher button');
    function changeLanguage(lang) {
        document.body.classList.remove('lang-fa', 'lang-en');
        document.body.classList.add(`lang-${lang}`);
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang][key]) {
                let text = translations[lang][key];
                if (key === 'footer_copyright') {
                    text = text.replace('{year}', new Date().getFullYear());
                }
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) el.placeholder = text;
                else el.textContent = text;
            }
        });
        document.querySelectorAll('.out-of-stock').forEach(card => card.setAttribute('data-stock-status', translations[lang]['stock_status_overlay']));
        langButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
        updateDateTime();
    }
    langButtons.forEach(button => button.addEventListener('click', () => changeLanguage(button.getAttribute('data-lang'))));
    
    // --- بخش تغییر تم ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggleBtn.querySelector('i').classList.toggle('fa-sun', !document.body.classList.contains('light-mode'));
        themeToggleBtn.querySelector('i').classList.toggle('fa-moon', document.body.classList.contains('light-mode'));
    });

    // --- منطق تایمر شمارش معکوس ---
    const activeTimers = [];
    function startCountdown(element, endDateString) {
        const endDate = new Date(endDateString).getTime();
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate - now;
            if (distance < 0) {
                clearInterval(timerInterval);
                const lang = document.body.classList.contains('lang-fa') ? 'fa' : 'en';
                element.textContent = translations[lang].countdown_expired;
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            element.textContent = `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
        }, 1000);
        activeTimers.push(timerInterval);
    }

    function initializeTimers() {
        activeTimers.forEach(clearInterval);
        activeTimers.length = 0;
        document.querySelectorAll('[data-countdown-end]').forEach(container => {
            const timerElement = container.querySelector('.countdown-timer');
            const endDate = container.dataset.countdownEnd;
            if (timerElement && endDate) {
                startCountdown(timerElement, endDate);
            }
        });
    }

    // --- منطق فیلتر، ترتیب‌بندی و نمایش محصولات ---
    const productDataContainer = document.getElementById('product-data');
    const allProducts = Array.from(productDataContainer.querySelectorAll('.product-card'));
    const showcase = document.querySelector('.store-showcase');
    const searchInput = document.getElementById('search-input');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const priceInputs = document.querySelectorAll(".price-input input");
    const rangeInputs = document.querySelectorAll(".range-input input");
    const rangeProgress = document.querySelector(".slider .progress");
    const categoryContainer = document.getElementById('category-filter');
    const sortBySelect = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    let processedProducts = [];
    let visibleProductsCount = 0;
    const productsPerPage = 9;

    function calculateDiscountPercentages() {
        allProducts.forEach(card => {
            if (card.dataset.discount === 'true') {
                const originalPrice = parseFloat(card.dataset.originalPrice);
                const salePrice = parseFloat(card.dataset.price);
                if (originalPrice > 0) {
                    const percentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
                    const percentageEl = card.querySelector('.discount-percentage');
                    if (percentageEl) percentageEl.textContent = `-${percentage}%`;
                }
            }
            const heartBtn = card.querySelector('.heart-btn');
            if(heartBtn) {
                heartBtn.addEventListener('click', (e) => { e.stopPropagation(); heartBtn.classList.toggle('active'); });
            }
        });
    }

    function initializeFilters() {
        const categories = [...new Set(allProducts.map(p => p.dataset.category).filter(Boolean))];
        categoryContainer.innerHTML = `<h4 data-lang-key="categories">Categories</h4>`;
        categories.forEach(cat => {
            const catKey = `category_${cat.toLowerCase().replace(' ', '_')}`;
            if (!translations.en[catKey]) translations.en[catKey] = cat;
            if (!translations.fa[catKey]) translations.fa[catKey] = cat;
            const label = document.createElement('label');
            label.className = 'custom-checkbox';
            label.innerHTML = `<input type="checkbox" value="${cat}"> <span data-lang-key="${catKey}">${cat}</span>`;
            categoryContainer.appendChild(label);
        });
        categoryContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', applyFiltersAndSort); });

        const prices = allProducts.map(p => parseFloat(p.dataset.price)).filter(p => !isNaN(p));
        const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
        const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;
        rangeInputs[0].min = minPrice; rangeInputs[0].max = maxPrice; rangeInputs[0].value = minPrice;
        rangeInputs[1].min = minPrice; rangeInputs[1].max = maxPrice; rangeInputs[1].value = maxPrice;
        priceInputs[0].value = minPrice; priceInputs[1].value = maxPrice;
        updatePriceSlider();
    }

    function updatePriceSlider() {
        let minVal = parseInt(rangeInputs[0].value), maxVal = parseInt(rangeInputs[1].value);
        if (maxVal < minVal) { [minVal, maxVal] = [maxVal, minVal]; priceInputs[0].value = minVal; priceInputs[1].value = maxVal; }
        const minPercent = ((minVal - rangeInputs[0].min) / (rangeInputs[0].max - rangeInputs[0].min)) * 100;
        const maxPercent = ((maxVal - rangeInputs[0].min) / (rangeInputs[0].max - rangeInputs[0].min)) * 100;
        rangeProgress.style.left = minPercent + "%";
        rangeProgress.style.right = 100 - maxPercent + "%";
    }

    function applyFiltersAndSort() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const minPrice = parseFloat(priceInputs[0].value);
        const maxPrice = parseFloat(priceInputs[1].value);
        const selectedCategories = [...categoryContainer.querySelectorAll('input:checked')].map(cb => cb.value);
        const selectedStatuses = [...document.querySelectorAll('.filter-group input[value*="-stock"]:checked')].map(cb => cb.value);
        const discountOnly = document.getElementById('discount-filter').checked;

        let filtered = allProducts.filter(p => {
            const productStatus = p.classList.contains('out-of-stock') ? 'out-of-stock' : 'in-stock';
            return (
                p.querySelector('.product-name').textContent.toLowerCase().includes(searchTerm) &&
                (parseFloat(p.dataset.price) >= minPrice && parseFloat(p.dataset.price) <= maxPrice) &&
                (selectedCategories.length === 0 || selectedCategories.includes(p.dataset.category)) &&
                selectedStatuses.includes(productStatus) &&
                (!discountOnly || p.dataset.discount === 'true')
            );
        });

        const sortBy = sortBySelect.value;
        const get = (el, data) => parseFloat(el.dataset[data] || 0);
        switch (sortBy) {
            case 'price-asc': filtered.sort((a, b) => get(a, 'price') - get(b, 'price')); break;
            case 'price-desc': filtered.sort((a, b) => get(b, 'price') - get(a, 'price')); break;
            case 'discount': filtered.sort((a, b) => get(b, 'discountAmount') - get(a, 'discountAmount')); break;
            case 'reviews': filtered.sort((a, b) => get(b, 'reviews') - get(a, 'reviews')); break;
            case 'popularity': default: filtered.sort((a, b) => get(b, 'views') - get(a, 'views')); break;
        }
        
        processedProducts = [...filtered.filter(p => !p.classList.contains('out-of-stock')), ...filtered.filter(p => p.classList.contains('out-of-stock'))];
        
        displayProducts(true);
    }

    function displayProducts(reset = false) {
        if (reset) { visibleProductsCount = 0; showcase.innerHTML = ''; }
        const nextLimit = Math.min(visibleProductsCount + productsPerPage, processedProducts.length);
        for (let i = visibleProductsCount; i < nextLimit; i++) { showcase.appendChild(processedProducts[i]); }
        visibleProductsCount = nextLimit;
        loadMoreBtn.style.display = visibleProductsCount >= processedProducts.length ? 'none' : 'inline-block';
        initializeTimers();
    }

    function resetAllFilters() {
        searchInput.value = '';
        sortBySelect.value = 'popularity';
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'in-stock';
        });
        initializeFilters();
        applyFiltersAndSort();
        const currentLang = document.body.classList.contains('lang-fa') ? 'fa' : 'en';
        changeLanguage(currentLang);
    }

    // --- Event Listeners ---
    priceInputs.forEach(input => { input.addEventListener("change", () => { updatePriceSlider(); applyFiltersAndSort(); }); });
    rangeInputs.forEach(input => { input.addEventListener("input", updatePriceSlider); input.addEventListener("change", applyFiltersAndSort); });
    searchInput.addEventListener('keyup', applyFiltersAndSort);
    sortBySelect.addEventListener('change', applyFiltersAndSort);
    loadMoreBtn.addEventListener('click', () => displayProducts(false));
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', applyFiltersAndSort); });
    resetFiltersBtn.addEventListener('click', resetAllFilters);
    
    // --- Initial Execution ---
    calculateDiscountPercentages();
    initializeFilters();
    applyFiltersAndSort();
    changeLanguage('fa');
    setInterval(updateDateTime, 1000);
});