document.addEventListener('DOMContentLoaded', function() {

    // ==================== 1. DATA SIMULATION ====================
    const qnaData = [
        {
            id: 1, user: "NewbieGamer", role: "user", question: { en: "Is delivery really instant?", fa: "آیا تحویل واقعا فوری هست؟" },
            answers: [
                { user: "ProGamer1", role: "seller", text: { en: "Yes, our bot sends the trade offer within 1 minute of purchase.", fa: "بله، ربات ما در کمتر از ۱ دقیقه بعد از خرید، Trade Offer را ارسال می‌کند." } },
                { user: "Admin", role: "manager", text: { en: "We guarantee instant delivery for this item.", fa: "ما تحویل فوری این آیتم را تضمین می‌کنیم." } }
            ]
        },
        {
            id: 2, user: "Collector", role: "user", question: { en: "Is there a discount for bulk purchases?", fa: "برای خرید تعداد بالا تخفیف هم دارید؟" },
            answers: [
                { user: "ProGamer1", role: "seller", text: { en: "Contact me directly for bulk orders.", fa: "برای سفارشات عمده با من در ارتباط باشید." } }
            ]
        }
    ];

    const reviewsData = [
        { user: "HappyBuyer", role: "buyer", rating: 5, text: { en: "Fastest delivery ever! Got my key in 30 seconds. Highly recommended.", fa: "سریع‌ترین تحویلی که داشتم! در ۳۰ ثانیه کلید رو گرفتم. شدیدا پیشنهاد میشه." } },
        { user: "AnotherGamer", role: "buyer", rating: 4, text: { en: "Good service, everything was smooth.", fa: "سرویس خوب بود، همه چیز روان پیش رفت." } }
    ];

    // ==================== 2. TRANSLATIONS OBJECT ====================
    const translations = {
        en: {
            store_brand: "NEON STORE", product_title: "Mann Co. Supply Crate Key (TF2 Key)",
            meta_type_label: "Type:", meta_type_value: "Steam Item", meta_delivery_label: "Delivery:", meta_delivery_value: "Instant (Trade Offer)",
            seller_response: "Response:", seller_response_time: "Under 5 minutes", seller_sales: "Successful Sales:", badge_verified: "Verified Seller",
            currency: "$", quantity: "Quantity:", add_to_cart: "<i class='fas fa-shopping-cart'></i> Add to Cart", add_to_wishlist: "<i class='far fa-heart'></i> Add to Wishlist",
            tab_description: "Description", tab_qna: "Q&A", tab_reviews: "Buyer Reviews", tab_requirements: "Requirements",
            description_title: "Product Description", description_text: "Mann Co. keys are used to open supply crates in Team Fortress 2. These keys will be sent instantly to your Steam account via a Trade Offer.",
            qna_title: "Questions & Answers", reviews_title: "Buyer Reviews", requirements_title: "Delivery Requirements",
            requirements_list: `<li>Your Steam account must be able to trade.</li><li>Steam Guard Mobile Authenticator must be active on your account for at least 15 days.</li><li>Your profile and inventory must be set to Public.</li>`,
            role_user: "User", role_seller: "Seller", role_manager: "Support", role_buyer: "Buyer",
            footer_about_title: "Neon Store", footer_about_text: "Your one-stop shop for the coolest neon-themed gadgets and fashion. Lighting up your style since 2025.", footer_links_title: "Quick Links", link_about: "About Us", link_contact: "Contact", link_faq: "FAQ", link_terms: "Terms of Service", footer_social_title: "Follow Us", footer_copyright: "© 2025 Neon Store. All Rights Reserved."
        },
        fa: {
            store_brand: "فروشگاه نئون", product_title: "کلید صندوق Mann Co. (TF2 Key)",
            meta_type_label: "نوع:", meta_type_value: "آیتم استیم", meta_delivery_label: "تحویل:", meta_delivery_value: "آنی (Trade Offer)",
            seller_response: "پاسخ‌گویی:", seller_response_time: "کمتر از ۵ دقیقه", seller_sales: "فروش موفق:", badge_verified: "فروشنده معتبر",
            currency: "تومان", quantity: "تعداد:", add_to_cart: "<i class='fas fa-shopping-cart'></i> افزودن به سبد خرید", add_to_wishlist: "<i class='far fa-heart'></i> افزودن به علاقه‌مندی",
            tab_description: "توضیحات", tab_qna: "پرسش و پاسخ", tab_reviews: "نظرات خریداران", tab_requirements: "پیش‌نیازها",
            description_title: "توضیحات محصول", description_text: "کلیدهای Mann Co. برای باز کردن صندوق‌های آیتم در بازی Team Fortress 2 استفاده می‌شوند. این کلیدها به صورت آنی و از طریق Trade Offer به اکانت استیم شما ارسال خواهند شد.",
            qna_title: "پرسش و پاسخ", reviews_title: "نظرات خریداران", requirements_title: "پیش‌نیازهای تحویل",
            requirements_list: `<li>اکانت استیم شما باید قابلیت Trade داشته باشد.</li><li>برنامه Steam Guard Mobile Authenticator باید حداقل ۱۵ روز روی اکانت شما فعال بوده باشد.</li><li>پروفایل و اینونتوری شما باید روی حالت Public تنظیم شده باشد.</li>`,
            role_user: "کاربر", role_seller: "فروشنده", role_manager: "پشتیبانی", role_buyer: "خریدار",
            footer_about_title: "فروشگاه نئون", footer_about_text: "فروشگاه تخصصی شما برای جدیدترین گجت‌ها و پوشاک با تم نئون. استایل خود را از سال ۲۰۲۵ درخشان کنید.", footer_links_title: "لینک‌های سریع", link_about: "درباره ما", link_contact: "تماس با ما", link_faq: "سوالات متداول", link_terms: "شرایط خدمات", footer_social_title: "ما را دنبال کنید", footer_copyright: ".تمام حقوق محفوظ است © ۲۰۲۵ فروشگاه نئون"
        }
    };

    // ==================== 3. DOM ELEMENTS ====================
    const qnaListEl = document.getElementById('qnaList');
    const reviewsListEl = document.getElementById('reviewsList');
    const langButtons = document.querySelectorAll('.lang-switcher button');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');

    // ==================== 4. RENDERING FUNCTIONS ====================
    function getRoleBadge(role, lang) {
        const roleKey = `role_${role}`;
        const roleName = translations[lang][roleKey];
        if (['seller', 'manager', 'buyer'].includes(role)) {
            return `<span class="badge badge-${role}">${roleName}</span>`;
        }
        return '';
    }

    function renderQNA(lang) {
        qnaListEl.innerHTML = '';
        qnaData.forEach(item => {
            const answersHTML = item.answers.map(ans => `
                <div class="answer">
                    <div class="item-header">
                        <span class="item-author">${ans.user}</span>
                        ${getRoleBadge(ans.role, lang)}
                    </div>
                    <p class="item-content">${ans.text[lang]}</p>
                </div>`).join('');
            qnaListEl.innerHTML += `
                <div class="qna-item">
                    <div class="item-header"><span class="item-author">${item.user}</span></div>
                    <p class="item-content"><strong>${item.question[lang]}</strong></p>
                    ${answersHTML}
                </div>`;
        });
    }

    function renderReviews(lang) {
        reviewsListEl.innerHTML = '';
        reviewsData.forEach(item => {
            const stars = Array(5).fill(0).map((_, i) => `<i class="${i < item.rating ? 'fas' : 'far'} fa-star"></i>`).join('');
            reviewsListEl.innerHTML += `
                <div class="review-item">
                    <div class="item-header">
                        <span class="item-author">${item.user}</span>
                        ${getRoleBadge(item.role, lang)}
                    </div>
                    <div class="review-rating">${stars}</div>
                    <p class="item-content">${item.text[lang]}</p>
                </div>`;
        });
    }

    // ==================== 5. CORE LOGIC ====================
    function changeLanguage(lang) {
        document.body.className = `lang-${lang} ${document.body.classList.contains('light-mode') ? 'light-mode' : ''}`;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
        langButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
        
        updateDateTime();
        renderQNA(lang);
        renderReviews(lang);
    }

    function updateDateTime() {
        const lang = document.documentElement.lang;
        const now = new Date();
        const locale = lang === 'fa' ? 'fa-IR-u-nu-latn' : 'en-US';
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        if (lang === 'fa') dateOptions.calendar = 'persian';
        
        dateEl.textContent = new Intl.DateTimeFormat(locale, dateOptions).format(now);
        timeEl.textContent = new Intl.DateTimeFormat(locale, timeOptions).format(now);
    }

    // ==================== 6. EVENT LISTENERS ====================
    langButtons.forEach(button => button.addEventListener('click', () => changeLanguage(button.getAttribute('data-lang'))));
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggleBtn.querySelector('i').classList.toggle('fa-sun', !document.body.classList.contains('light-mode'));
        themeToggleBtn.querySelector('i').classList.toggle('fa-moon', document.body.classList.contains('light-mode'));
    });

    // Product Page Interactions
    document.getElementById('wishlistBtn').addEventListener('click', (e) => e.currentTarget.classList.toggle('active'));
    document.getElementById('decrease-qty').addEventListener('click', () => {
        const input = document.getElementById('quantity');
        if (parseInt(input.value) > 1) input.value--;
    });
    document.getElementById('increase-qty').addEventListener('click', () => {
        const input = document.getElementById('quantity');
        input.value++;
    });
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.tab-link.active').classList.remove('active');
            document.querySelector('.tab-content.active').classList.remove('active');
            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // ==================== 7. INITIAL EXECUTION ====================
    changeLanguage('fa'); // Set default language
    setInterval(updateDateTime, 1000);
});