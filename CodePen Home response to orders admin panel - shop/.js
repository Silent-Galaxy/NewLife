// This function must be in the global scope to be accessible by the inline 'onerror' attribute
function handleImageError(imgElement) {
    const container = imgElement.closest('.image-container');
    if (container) {
        container.classList.add('error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. شبیه‌سازی منبع داده (Data Source Simulation) ---
    // **تغییرات اصلی در این بخش اعمال شده است**
    const productData = {
        id: 'prod_cs2_prime',
        name: 'ارتقاء وضعیت پرایم کانتر استرایک 2 (Prime Status)',
        storeName: 'GameZone Store',
        sellerProfile: {
            name: 'GameZone Store',
            avatarUrl: 'https://i.imgur.com/s22Z3xG.png', // لوگوی فرضی برای فروشگاه
            rating: 4.9,
            totalSales: 2840,
            memberSince: '2021'
        },
        slug: 'counter-strike-2-prime-status-upgrade',
        status: 'pending_approval', // 'pending_approval', 'approved', 'rejected'
        tags: ['اکشن', 'بازی آنلاین', 'استیم', 'Prime', 'شوتر اول شخص', 'CS2'],
        media: {
            imageUrls: [
                'https://i.imgur.com/6p5g6hN.jpeg', // تصویر اصلی و جذاب از بازی
                'https://i.imgur.com/gL4s9d1.jpeg', // تصویر نشان‌دهنده مزایای پرایم
                'https://i.imgur.com/W1y5z0o.jpeg', // صحنه‌ای از گیم‌پلی
                'https://i.imgur.com/R7aG1pP.jpeg'  // لوگو یا آرت‌ورک رسمی
            ]
        },
        details: {
            officialDescription: 'با ارتقاء به وضعیت Prime در Counter-Strike 2، به جمع بازیکنان جدی بپیوندید. این آپگرید به شما امکان دسترسی به صف بازی انحصاری Prime، دریافت آیتم‌های ویژه، جعبه‌های سلاح و بسته‌های هفتگی را می‌دهد و تجربه بازی شما را از طریق مقابله با بازیکنان متعهد دیگر، بهبود می‌بخشد.',
            technicalSpecs: 'پلتفرم: Steam\nنوع محصول: ارتقاء اکانت (فعال‌سازی دیجیتال)\nمنطقه: جهانی (Global)\nپیش‌نیاز: داشتن بازی Counter-Strike 2 (رایگان)',
            transactionMethod: 'پس از خرید، ارتقاء Prime به صورت مستقیم روی اکانت استیم شما توسط فروشنده فعال خواهد شد. نیاز به ارسال اطلاعات اکانت (Login-Pass) با رعایت نکات امنیتی می‌باشد.'
        },
        sellingProfile: {
            isActive: true, 
            priceToman: 1450000, 
            priceUSDT: 24.5, // قیمت تتر اضافه شد
            stock: 18,
            description: 'فعال‌سازی فوری و تضمینی در کمتر از ۱۵ دقیقه. پشتیبانی ۲۴ ساعته در صورت بروز هرگونه سوال یا مشکل. ما امنیت اکانت شما را تضمین می‌کنیم.',
            discount: null // بدون تخفیف فعلی
        },
        buyingProfile: {
            isActive: true,
            priceRangeToman: { min: 1200000, max: 1350000 },
            priceRangeUSDT: { min: 20, max: 22.5 }, // محدوده قیمت تتر اضافه شد
            needed: 10,
            paymentMethods: ['درگاه بانکی', 'ارز دیجیتال (USDT)'],
            description: 'به دنبال تامین‌کننده برای ارتقاء Prime هستیم. تسویه به صورت تومانی یا تتر به انتخاب شما و به صورت آنی انجام خواهد شد.'
        },
        history: [
            { timestamp: '2024-09-20T14:30:00Z', user: 'سیستم', action: 'محصول برای بازبینی ارسال شد.' },
            { timestamp: '2024-09-18T10:00:00Z', user: 'GameZone', action: 'محصول ایجاد شد.' }
        ],
        seo: {
            title: 'خرید ارتقاء پرایم (Prime) کانتر استرایک 2 | GameZone',
            metaDescription: 'ارتقاء وضعیت اکانت استیم خود به Prime برای بازی Counter-Strike 2 با بهترین قیمت و فعال‌سازی فوری. از مزایای انحصاری پرایم بهره‌مند شوید.'
        }
    };

    // --- 2. توابع کمکی (Helper Functions) ---
    const formatPrice = (price) => price ? `${price.toLocaleString('fa-IR')} تومان` : '-';
    const createStarRating = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    // --- 3. توابع رندر (Render Functions) ---
    const renderSellerProfile = (profile) => {
        document.getElementById('seller-avatar').src = profile.avatarUrl;
        document.getElementById('seller-name').textContent = profile.name;
        document.getElementById('seller-rating').innerHTML = createStarRating(profile.rating);
        document.getElementById('seller-sales').textContent = profile.totalSales.toLocaleString('fa-IR');
        document.getElementById('seller-member-since').textContent = profile.memberSince;
    };

    const renderHeader = (data) => {
        document.getElementById('product-name').textContent = data.name;
        document.getElementById('store-name').innerHTML = `فروشنده: <strong>${data.storeName}</strong>`;
        const statusElement = document.getElementById('product-status');
        const statusMap = {
            pending_approval: { text: 'در انتظار بازبینی', class: 'status-pending' },
            approved: { text: 'تایید شده', class: 'status-approved' },
            rejected: { text: 'رد شده', class: 'status-rejected' }
        };
        statusElement.textContent = statusMap[data.status]?.text || 'نامشخص';
        statusElement.className = `status ${statusMap[data.status]?.class || ''}`;
    };

    const renderGeneralInfo = (data) => {
        document.getElementById('product-slug').textContent = data.slug;
        const tagsContainer = document.getElementById('tags-container');
        tagsContainer.innerHTML = data.tags.map(tag => `<span class="tag-item">${tag}</span>`).join('');
    };

    const renderGallery = (media) => {
        const mainImageWrapper = document.getElementById('main-image-wrapper');
        const thumbnailsContainer = document.getElementById('thumbnails-container');
        
        if (!media.imageUrls || media.imageUrls.length === 0) {
            mainImageWrapper.innerHTML = '<div class="image-container main-image error"><div class="image-fallback">هیچ تصویری یافت نشد</div></div>';
            thumbnailsContainer.innerHTML = '';
            return;
        }

        const firstImageUrl = media.imageUrls[0];
        mainImageWrapper.innerHTML = `
            <div class="image-container main-image">
                <img src="${firstImageUrl}" alt="تصویر اصلی محصول" onerror="handleImageError(this)">
                <div class="image-fallback">تصویر نامعتبر</div>
                <span class="image-source-url">${firstImageUrl}</span>
            </div>`;

        thumbnailsContainer.innerHTML = media.imageUrls.map((url, index) =>
            `<div class="image-container thumbnail-image ${index === 0 ? 'active' : ''}" data-url="${url}">
                <img src="${url}" alt="تصویر کوچک ${index + 1}" onerror="handleImageError(this)">
                <div class="image-fallback">!</div>
            </div>`
        ).join('');
    };

    const renderDetails = (details) => {
        const container = document.getElementById('details-container');
        container.innerHTML = `
            <div class="data-pair full-width"><span class="label">توضیحات رسمی:</span><p class="value">${details.officialDescription || '-'}</p></div>
            <div class="data-pair full-width"><span class="label">مشخصات فنی:</span><p class="value">${details.technicalSpecs || '-'}</p></div>
            <div class="data-pair full-width"><span class="label">روش معامله:</span><p class="value">${details.transactionMethod || '-'}</p></div>`;
    };

    const renderSellingProfile = (profile) => {
        const container = document.getElementById('sell-info');
        let discountHTML = '';
        if (profile.discount?.percentage) {
            discountHTML = `<div class="data-pair wide discount-info"><span class="label">تخفیف:</span><span class="value"><strong>${profile.discount.percentage}%</strong> به مدت ${profile.discount.duration.value} ${profile.discount.duration.unit}</span></div>`;
        }
        container.innerHTML = `
            <div class="data-grid">
                <div class="data-pair"><span class="label">وضعیت فروش:</span><span class="value status ${profile.isActive ? 'status-active' : 'status-inactive'}">${profile.isActive ? 'فعال' : 'غیرفعال'}</span></div>
                <div class="data-pair"><span class="label">قیمت (تومان):</span><span class="value price">${formatPrice(profile.priceToman)}</span></div>
                <div class="data-pair"><span class="label">قیمت (تتر):</span><span class="value">${profile.priceUSDT ? `${profile.priceUSDT} USDT` : '-'}</span></div>
                <div class="data-pair"><span class="label">موجودی:</span><span class="value">${profile.stock ?? '-'} عدد</span></div>
                ${discountHTML}
                <div class="data-pair full-width"><span class="label">توضیحات فروشنده:</span><p class="value">${profile.description || '-'}</p></div>
            </div>`;
    };

    const renderBuyingProfile = (profile) => {
        const container = document.getElementById('buy-info');
        if (!profile.isActive) {
            container.innerHTML = `<p>در حال حاضر پروفایل خرید برای این محصول فعال نیست.</p>`;
            return;
        }
        container.innerHTML = `
            <div class="data-grid">
                <div class="data-pair"><span class="label">وضعیت خرید:</span><span class="value status ${profile.isActive ? 'status-active' : 'status-inactive'}">فعال</span></div>
                <div class="data-pair"><span class="label">تعداد مورد نیاز:</span><span class="value">${profile.needed ?? '-'} عدد</span></div>
                <div class="data-pair wide"><span class="label">محدوده قیمت (تومان):</span><div class="value price-range"><span class="price">${formatPrice(profile.priceRangeToman.min)}</span> - <span class="price">${formatPrice(profile.priceRangeToman.max)}</span></div></div>
                <div class="data-pair wide"><span class="label">محدوده قیمت (تتر):</span><div class="value price-range"><span>${profile.priceRangeUSDT.min} USDT</span> - <span>${profile.priceRangeUSDT.max} USDT</span></div></div>
                <div class="data-pair wide"><span class="label">روش‌های پرداخت:</span><div class="tags-display-container">${profile.paymentMethods.map(method => `<span class="tag-item">${method}</span>`).join('')}</div></div>
                <div class="data-pair full-width"><span class="label">توضیحات خرید:</span><p class="value">${profile.description || '-'}</p></div>
            </div>`;
    };

    const renderSeoPreview = (data) => {
        document.getElementById('seo-title-preview').textContent = data.seo.title || data.name;
        document.getElementById('seo-url-preview').textContent = `https://yoursite.com/store/${data.storeName.toLowerCase().replace(' ', '-')}/${data.slug}`;
        document.getElementById('seo-meta-preview').textContent = data.seo.metaDescription;
    };
    
    const renderHistory = (history) => {
        const list = document.getElementById('history-list');
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        list.innerHTML = history.map(item => `<li><strong>${new Date(item.timestamp).toLocaleDateString('fa-IR', options)} (${item.user}):</strong> ${item.action}</li>`).join('');
    };

    // --- 4. توابع تعامل (Interaction Handlers) ---
    const setupTabInteraction = () => {
        document.querySelector('.tabs nav').addEventListener('click', (event) => {
            const clickedTab = event.target.closest('.tab-link');
            if (!clickedTab) return;
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            clickedTab.classList.add('active');
            document.getElementById(clickedTab.dataset.tab).classList.add('active');
        });
    };

    const setupGalleryInteraction = () => {
        const thumbnailsContainer = document.getElementById('thumbnails-container');
        thumbnailsContainer.addEventListener('click', (event) => {
            const clickedThumbContainer = event.target.closest('.thumbnail-image');
            if (!clickedThumbContainer) return;

            const newImageUrl = clickedThumbContainer.dataset.url;
            const mainImageWrapper = document.getElementById('main-image-wrapper');
            const mainImageContainer = mainImageWrapper.querySelector('.image-container');
            
            mainImageContainer.querySelector('img').src = newImageUrl;
            mainImageContainer.querySelector('.image-source-url').textContent = newImageUrl;
            mainImageContainer.classList.remove('error');

            thumbnailsContainer.querySelectorAll('.thumbnail-image').forEach(container => container.classList.remove('active'));
            clickedThumbContainer.classList.add('active');
        });
    };

    const setupActionButtons = () => {
        const actionPanel = document.querySelector('.action-panel');
        actionPanel.addEventListener('click', (event) => {
            const button = event.target.closest('.btn');
            if (!button) return;

            const feedback = document.getElementById('feedback-textarea').value.trim();
            let actionText = '';
            let newStatus = '';
            let toastMessage = '';
            let toastType = 'success';

            if (button.id === 'btn-approve') {
                newStatus = 'approved';
                actionText = 'محصول تایید و منتشر شد.';
                toastMessage = 'محصول با موفقیت تایید شد.';
            } else if (button.id === 'btn-revise') {
                newStatus = 'pending_approval';
                actionText = 'محصول برای اصلاح بازگردانده شد.';
                toastMessage = 'محصول برای اصلاح ارسال شد.';
                toastType = 'warning';
            } else if (button.id === 'btn-reject') {
                newStatus = 'rejected';
                actionText = 'محصول رد شد.';
                toastMessage = 'محصول رد شد.';
                toastType = 'error';
            }

            if (feedback) {
                actionText += ` بازخورد: "${feedback}"`;
            }

            productData.status = newStatus;
            productData.history.unshift({
                timestamp: new Date().toISOString(),
                user: 'مدیر',
                action: actionText
            });

            renderHeader(productData);
            renderHistory(productData.history);
            showToast(toastMessage, toastType);

            actionPanel.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
        });
    };

    // --- 5. تابع اصلی اجرا (Main Execution Function) ---
    const initializeDashboard = (data) => {
        const loader = document.getElementById('loader');
        const dashboard = document.getElementById('dashboard-main');
        
        setTimeout(() => {
            renderSellerProfile(data.sellerProfile);
            renderHeader(data);
            renderGeneralInfo(data);
            renderGallery(data.media);
            renderDetails(data.details);
            renderSellingProfile(data.sellingProfile);
            renderBuyingProfile(data.buyingProfile);
            renderSeoPreview(data);
            renderHistory(data.history);

            setupTabInteraction();
            setupGalleryInteraction();
            setupActionButtons();
            
            loader.style.display = 'none';
            dashboard.style.display = 'grid';
        }, 1500);
    };

    // --- 6. شروع برنامه ---
    initializeDashboard(productData);
});