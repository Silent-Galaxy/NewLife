// feedback_script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- شبیه‌سازی داده‌های دریافتی از API برای سه وضعیت مختلف ---

    // سناریو ۱: محصول رد شده و نیازمند اصلاح است
    const mockDataRejected = {
        currentStatus: "rejected",
        product: { id: 123, name: "Counter-Strike 2 Prime Status", submissionCount: 3, rejectedCount: 2, editUrl: "/path/to/edit_form.html?product_id=123" },
        reviewHistory: [
            { reviewId: 102, reviewer: { name: "Admin_Master", avatar: "https://i.pravatar.cc/40?u=admin_master" }, status: "rejected", timestamp: "2025-10-12T14:30:00Z", mainReason: "کیفیت تصاویر ارسالی پایین است و توضیحات متا برای موتورهای جستجو بهینه نشده.", reviewDetails: { "seo": { status: "rejected", reason: "توضیحات متا (Meta Description) بیش از حد کوتاه است.", tip: "سعی کنید توضیحات متا را بین ۱۵۰ تا ۱۶۰ کاراکتر بنویسید." }, "media": { status: "rejected", reason: "حداقل یکی از تصاویر دارای واترمارک است.", tip: "لطفاً از تصاویر با کیفیت بالا و بدون واترمارک استفاده کنید." }, "sellProfile": { status: "approved" } } },
            { reviewId: 101, reviewer: { name: "Support_Team", avatar: "https://i.pravatar.cc/40?u=support_team" }, status: "rejected", timestamp: "2025-10-10T09:15:00Z", mainReason: "قیمت فروش نامشخص است.", reviewDetails: {} }
        ]
    };

    // سناریو ۲: محصول با موفقیت تایید شده است
    const mockDataApproved = {
        currentStatus: "approved",
        product: { id: 124, name: "لایسنس ۱ ساله JetBrains", viewUrl: "/products/jetbrains-license-1y" },
        reviewHistory: [
            { reviewId: 105, reviewer: { name: "Admin_Master", avatar: "https://i.pravatar.cc/40?u=admin_master" }, status: "approved", timestamp: "2025-10-15T11:00:00Z", mainReason: "محصول با موفقیت تایید و در سایت منتشر شد." }
        ]
    };

    // سناریو ۳: محصول ارسال شده و در انتظار بازبینی است
    const mockDataPending = {
        currentStatus: "pending",
        product: { id: 125, name: "گیفت کارت ۱۰ دلاری استیم" },
        reviewHistory: []
    };

    const container = document.getElementById('feedback-container');

    /**
     * تابع اصلی برای رندر کردن کل صفحه بر اساس وضعیت محصول
     */
    function renderPage(data) {
        let pageHtml = '';
        switch (data.currentStatus) {
            case 'rejected':
                pageHtml = renderRejectedState(data);
                break;
            case 'approved':
                pageHtml = renderApprovedState(data);
                break;
            case 'pending':
                pageHtml = renderPendingState(data);
                break;
            default:
                pageHtml = '<p>وضعیت محصول نامشخص است.</p>';
        }
        container.innerHTML = pageHtml;
        addEventListeners(data.currentStatus);
    }

    // --- توابع رندر برای هر وضعیت ---

    function renderRejectedState(data) {
        const { product, reviewHistory } = data;
        const latestReview = reviewHistory[0];
        const checklistHtml = generateChecklistHtml(latestReview.reviewDetails);
        const historyHtml = generateHistoryHtml(reviewHistory);
        const submissionText = `تلاش ${['اول', 'دوم', 'سوم', 'چهارم', 'پنجم'][product.submissionCount - 1] || product.submissionCount}`;
        const rejectionText = `${['اولین', 'دومین', 'سومین', 'چهارمین'][product.rejectedCount - 1] || product.rejectedCount + 'مین'} بار`;

        return `
            <article class="feedback-card">
                <header class="status-banner status-banner--rejected">
                    <div class="status-icon">❌</div>
                    <div class="status-text">
                        <h1>نیازمند اصلاح</h1>
                        <p>محصول شما، <strong>"${product.name}"</strong>، برای تایید نهایی به چند اصلاح نیاز دارد.</p>
                    </div>
                </header>

                <section class="feedback-card__header">
                    <div class="header-meta">
                        <div class="meta-item">
                            <i class="fa-solid fa-arrow-up-from-bracket"></i>
                            <span>ارسال:</span>
                            <strong>${submissionText}</strong>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-circle-xmark"></i>
                            <span>وضعیت:</span>
                            <strong>${rejectionText} رد شده</strong>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-calendar-check"></i>
                            <span>تاریخ بازبینی:</span>
                            <strong>${formatDate(latestReview.timestamp)}</strong>
                        </div>
                    </div>
                </section>

                <section class="feedback-card__body">
                    <div class="review-breakdown">
                        <h2 class="section-title">آخرین بازخورد از ${latestReview.reviewer.name}:</h2>
                        <ul class="review-checklist">${checklistHtml}</ul>
                    </div>
                    ${historyHtml ? `<div class="history-section">
                        <h2 class="section-title">تاریخچه کامل بازبینی‌ها:</h2>
                        <div class="history-timeline">${historyHtml}</div>
                    </div>` : ''}
                </section>
                <footer class="feedback-card__footer">
                    <a href="${product.editUrl}" class="btn btn-primary">اصلاح و ارسال مجدد برای بازبینی</a>
                </footer>
            </article>
        `;
    }

    function renderApprovedState(data) {
        const { product } = data;
        return `
            <article class="feedback-card">
                <header class="status-banner status-banner--approved">
                    <div class="status-icon">✅</div>
                    <div class="status-text">
                        <h1>محصول شما تایید شد!</h1>
                        <p>تبریک! محصول <strong>"${product.name}"</strong> با موفقیت در وب‌سایت منتشر شد.</p>
                    </div>
                </header>
                <section class="feedback-card__body">
                    <h2 class="section-title">قدم بعدی چیست؟</h2>
                    <p>شما می‌توانید محصول خود را در صفحه فروشگاه مشاهده کنید، آن را با دیگران به اشتراک بگذارید و فروش خود را آغاز کنید.</p>
                </section>
                <footer class="feedback-card__footer">
                    <a href="${product.viewUrl}" class="btn btn-success">مشاهده صفحه محصول</a>
                </footer>
            </article>
        `;
    }

    function renderPendingState(data) {
        const { product } = data;
        return `
            <article class="feedback-card">
                <header class="status-banner status-banner--pending">
                    <div class="status-icon">⏳</div>
                    <div class="status-text">
                        <h1>در صف بازبینی</h1>
                        <p>محصول شما، <strong>"${product.name}"</strong>، دریافت شد و به زودی توسط تیم ما بررسی خواهد شد.</p>
                    </div>
                </header>
                <section class="feedback-card__body">
                    <h2 class="section-title">فرآیند بازبینی</h2>
                    <p>ما تمام تلاش خود را می‌کنیم تا محصولات را در کمتر از ۲۴ ساعت کاری بررسی کنیم. پس از اتمام بررسی، نتیجه از طریق همین صفحه به اطلاع شما خواهد رسید. از شکیبایی شما سپاسگزاریم.</p>
                </section>
            </article>
        `;
    }

    // --- توابع کمکی ---

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function generateChecklistHtml(details = {}) {
        const sections = {
            generalInfo: "۱. اطلاعات عمومی", seo: "۲. جزئیات SEO", media: "۳. تصاویر و رسانه", sellProfile: "۴. پروفایل فروش"
        };
        return Object.entries(sections).map(([key, title]) => {
            const detail = details[key] || { status: 'approved' };
            const isRejected = detail.status === 'rejected';
            return `
                <li class="breakdown-item" data-status="${detail.status}">
                    <div class="breakdown-item__header">
                        <span class="check-icon">${isRejected ? '✗' : '✓'}</span>
                        <span class="check-label">${title}</span>
                        ${isRejected ? '<span class="expand-indicator">▼</span>' : ''}
                    </div>
                    ${isRejected ? `
                        <div class="breakdown-item__details">
                            <p class="detail-reason"><strong>دلیل:</strong> ${detail.reason}</p>
                            <div class="smart-tip"><strong>💡 نکته:</strong> ${detail.tip}</div>
                        </div>
                    ` : ''}
                </li>
            `;
        }).join('');
    }

    function generateHistoryHtml(history = []) {
        if (history.length === 0) return '';
        return history.map(review => `
            <div class="history-item">
                <div class="history-item__marker">
                    <img src="${review.reviewer.avatar}" alt="${review.reviewer.name}" class="reviewer-avatar">
                    <div class="marker-line"></div>
                </div>
                <div class="history-item__content">
                    <div class="history-header">
                        <div>
                            <span class="reviewer-name">${review.reviewer.name}</span>
                            <span class="history-status history-status--${review.status}">${review.status === 'rejected' ? 'رد شده' : 'تایید شده'}</span>
                        </div>
                        <span class="review-date">${formatDate(review.timestamp)}</span>
                    </div>
                    <p class="history-reason">${review.mainReason}</p>
                </div>
            </div>
        `).join('');
    }

    function addEventListeners(status) {
        if (status === 'rejected') {
            const checklistItems = container.querySelectorAll('.breakdown-item[data-status="rejected"]');
            checklistItems.forEach(item => {
                item.addEventListener('click', () => {
                    item.classList.toggle('is-expanded');
                });
            });
        }
    }

    // --- اجرای برنامه ---
    setTimeout(() => {
        // برای تست، می‌توانید mockDataRejected را با mockDataApproved یا mockDataPending جایگزین کنید
        renderPage(mockDataRejected);
    }, 500);

});