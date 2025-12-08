document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let tags = [];
    let imageUrls = [];

    // --- Element Selectors ---
    const form = document.getElementById('product-form');
    const tabNav = document.querySelector('.tab-nav');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const storeNameInput = document.getElementById('store-name');
    const productSlugInput = document.getElementById('product-slug');
    const urlPreview = document.getElementById('url-preview');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.querySelector('.modal-close');
    
    // --- NEW: Completeness Meter Elements ---
    const progressBar = document.getElementById('progress-bar');
    const completenessPercent = document.getElementById('completeness-percent');
    const completenessTip = document.getElementById('completeness-tip');
    const scoredElements = form.querySelectorAll('[data-score]');

    // --- 1. Tab Navigation Logic ---
    tabNav.addEventListener('click', (e) => {
        if (e.target.matches('.tab-btn')) {
            const targetPanelId = e.target.getAttribute('aria-controls');
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-selected', 'true');
            tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === targetPanelId));
        }
    });

    // --- 2. REFINED: Pill-based Tagging System ---
    const tagsPreviewContainer = document.getElementById('tags-preview-container');
    const tagInput = document.getElementById('tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');

    const renderTags = () => {
        tagsPreviewContainer.innerHTML = '';
        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="tag-delete-btn" data-tag="${tag}" aria-label="حذف تگ ${tag}">&times;</button>
            `;
            tagsPreviewContainer.appendChild(tagElement);
        });
        updateCompletenessScore(); // Update score on change
    };

    const addTag = () => {
        const newTag = tagInput.value.trim().replace(/,/g, '');
        if (newTag && !tags.includes(newTag)) {
            tags.push(newTag);
            renderTags();
        }
        tagInput.value = '';
        tagInput.focus();
    };

    addTagBtn.addEventListener('click', addTag);
    tagInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } });

    tagsPreviewContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-delete-btn')) {
            const tagToDelete = e.target.dataset.tag;
            tags = tags.filter(t => t !== tagToDelete);
            renderTags();
        }
    });

    // --- 3. Interactive Image Management System ---
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const newImageUrlInput = document.getElementById('new-image-url');
    const addImageBtn = document.getElementById('add-image-btn');

    const renderImages = () => {
        imagePreviewContainer.innerHTML = '';
        imageUrls.forEach(url => {
            const item = document.createElement('div');
            item.className = 'image-preview-item';
            item.innerHTML = `
                <img src="${url}" alt="پیش‌نمایش" data-url="${url}">
                <button type="button" class="delete-image-btn" data-url="${url}" aria-label="حذف تصویر">&times;</button>
            `;
            imagePreviewContainer.appendChild(item);
        });
        updateCompletenessScore(); // Update score on change
    };

    const addImage = () => {
        const newUrl = newImageUrlInput.value.trim();
        if (newUrl) {
            try {
                new URL(newUrl); // Validate URL format
                if (!imageUrls.includes(newUrl)) {
                    imageUrls.push(newUrl);
                    renderImages();
                }
                newImageUrlInput.value = '';
            } catch (_) {
                alert('لطفاً یک آدرس URL معتبر وارد کنید.');
            }
        }
        newImageUrlInput.focus();
    };

    addImageBtn.addEventListener('click', addImage);
    newImageUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } });

    imagePreviewContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete-image-btn')) {
            const urlToDelete = target.dataset.url;
            imageUrls = imageUrls.filter(url => url !== urlToDelete);
            renderImages();
        }
        if (target.tagName === 'IMG') {
            modalImage.src = target.src;
            imageModal.style.display = 'block';
        }
    });
    
    const closeModal = () => { imageModal.style.display = 'none'; };
    closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // --- 4. Dynamic URL Preview Logic ---
    const updateUrlPreview = () => {
        const storeName = storeNameInput.value.trim().replace(/\s+/g, '-').toLowerCase() || '...';
        const productSlug = productSlugInput.value.trim().replace(/\s+/g, '-').toLowerCase() || '...';
        urlPreview.innerHTML = `https://yoursite.com/store/<b>${storeName}</b>/<b>${productSlug}</b>`;
    };

    // --- 5. Price to Persian Words Logic ---
    const setupPricePreview = (inputId, previewId) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        input.addEventListener('input', () => preview.textContent = numberToPersianWords(input.value));
    };

    function numberToPersianWords(n) {
        if (n === null || n === undefined || n === '' || isNaN(n) || n == 0) return '';
        const num = parseInt(n, 10);
        if (num >= 1000000000000) return 'عدد بسیار بزرگ است';
        
        const units = ['', 'هزار', 'میلیون', 'میلیارد'];
        let result = [];
        let tempNum = num;
        let i = 0;
        while (tempNum > 0) {
            let chunk = tempNum % 1000;
            if (chunk > 0) {
                result.unshift(`${chunk.toLocaleString()} ${units[i]}`);
            }
            tempNum = Math.floor(tempNum / 1000);
            i++;
        }
        return result.join(' و ') + ' تومان';
    }

    setupPricePreview('sell-price-toman', 'sell-price-preview');
    setupPricePreview('buy-price-toman', 'buy-price-preview');

    // --- 6. Persian Datepicker Initialization ---
    if (window.jQuery) {
        $("#discount-start-date").persianDatepicker({
            format: 'YYYY/MM/DD HH:mm', timePicker: { enabled: true, meridiem: { enabled: false } }
        });
    }

    // --- 7. NEW: Completeness Score Logic ---
    const updateCompletenessScore = () => {
        let currentScore = 0;
        const maxScore = 100;

        // Calculate score from inputs and textareas
        scoredElements.forEach(el => {
            if (el.value && el.value.trim() !== '') {
                currentScore += parseInt(el.dataset.score, 10);
            }
        });

        // Special handling for tags (score if at least 3 tags exist)
        if (tags.length >= 3) {
            currentScore += parseInt(tagsPreviewContainer.dataset.score, 10);
        }
        
        // Special handling for images (score if at least 1 image exists)
        if (imageUrls.length > 0) {
            currentScore += parseInt(imagePreviewContainer.dataset.score, 10);
        }

        const percentage = Math.min(Math.round((currentScore / maxScore) * 100), 100);
        
        // Update UI
        progressBar.style.width = `${percentage}%`;
        completenessPercent.textContent = `${percentage}٪`;

        // Update progress bar color and tip text based on score
        if (percentage < 40) {
            progressBar.style.backgroundColor = 'var(--danger-color)';
            completenessTip.textContent = 'عالی میشه اگه اطلاعات کلیدی مثل نام، قیمت و تصویر رو اضافه کنی.';
        } else if (percentage < 80) {
            progressBar.style.backgroundColor = 'var(--warning-color)';
            completenessTip.textContent = 'خیلی خوبه! با اضافه کردن تگ‌ها و توضیحات SEO، محصولت رو حرفه‌ای‌تر کن.';
        } else {
            progressBar.style.backgroundColor = 'var(--success-color)';
            completenessTip.textContent = 'فوق‌العاده! اطلاعات محصول شما کامل و آماده انتشار است.';
        }
    };

    // --- 8. Form Submission ---
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        const productData = {
            name: formData.get('productName'),
            storeName: formData.get('storeName'),
            slug: formData.get('productSlug'),
            tags: tags,
            seo: { title: formData.get('seoTitle'), metaDescription: formData.get('seoMeta') },
            details: { officialDescription: formData.get('officialDescription'), technicalSpecs: formData.get('technicalSpecs'), transactionMethod: formData.get('transactionMethod') },
            media: { imageUrls: imageUrls },
            sellingProfile: {
                isActive: formData.get('isSellingActive') === 'on',
                priceToman: parseFloat(formData.get('sellPriceToman')) || 0,
                priceUSDT: parseFloat(formData.get('sellPriceUSDT')) || 0,
                stock: parseInt(formData.get('sellStock')) || 0,
                description: formData.get('sellDescription'),
                discount: {
                    percentage: parseInt(formData.get('discountPercent')) || null,
                    startDateTime: formData.get('discountStartDate') || null,
                    duration: { value: parseInt(formData.get('discountDurationValue')) || null, unit: formData.get('discountDurationUnit') }
                }
            },
            buyingProfile: {
                isActive: formData.get('isBuyingActive') === 'on',
                priceToman: parseFloat(formData.get('buyPriceToman')) || 0,
                priceUSDT: parseFloat(formData.get('buyPriceUSDT')) || 0,
                needed: parseInt(formData.get('buyNeeded')) || 0,
                description: formData.get('buyDescription'),
            },
            status: 'pending_approval'
        };

        console.log('Comprehensive Data to be sent to API:', JSON.stringify(productData, null, 2));
        alert('شبیه‌سازی موفق: داده‌های جامع محصول برای بازبینی ارسال شد. ساختار نهایی را در کنسول (F12) مشاهده کنید.');
    });
    
    // --- Initial UI Renders & Event Listeners ---
    form.addEventListener('input', updateCompletenessScore);
    storeNameInput.addEventListener('input', updateUrlPreview);
    productSlugInput.addEventListener('input', updateUrlPreview);
    
    renderTags();
    renderImages();
    updateUrlPreview();
    updateCompletenessScore(); // Initial calculation
});