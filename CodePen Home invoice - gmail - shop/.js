document.addEventListener('DOMContentLoaded', function() {
    
    // شبیه‌سازی بارگذاری داده‌ها از سرور
    const skeletonLoader = document.getElementById('skeleton-loader');
    const mainContent = document.getElementById('main-content');
    setTimeout(() => {
        skeletonLoader.style.display = 'none';
        mainContent.style.display = 'block';
        initializeTransactionTimers(); // تابع جدید برای تایمرها
    }, 500);

    // شمارش فروشندگان و تنظیم تیتر پویا
    const sellerCount = document.querySelectorAll('.seller-order-group').length;
    document.getElementById('page-subtitle').textContent = `سفارش شما از ${sellerCount} فروشنده در زیر آماده تحویل است.`;

    // -------------------------------------------------------------------
    // 1. عملکرد کپی کردن کد
    // -------------------------------------------------------------------
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const inputField = document.getElementById(targetId);
            navigator.clipboard.writeText(inputField.value).then(() => {
                const productName = button.closest('.product-delivery-box').querySelector('.product-info h3').textContent;
                showNotification(`کد محصول "${productName}" با موفقیت کپی شد!`);
                button.querySelector('span').textContent = 'کپی شد';
                button.querySelector('i').className = 'fas fa-check';
                button.classList.add('copied');
                setTimeout(() => {
                    button.querySelector('span').textContent = 'کپی';
                    button.querySelector('i').className = 'far fa-copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Clipboard copy failed: ', err);
                showNotification('خطا در کپی کردن. لطفاً دستی اقدام کنید.', 'error');
            });
        });
    });

    // -------------------------------------------------------------------
    // 2. منطق ثبت نظر و مودال مربوطه
    // -------------------------------------------------------------------
    const feedbackModal = document.getElementById('feedback-modal');
    let activeFeedbackSection = null;

    document.querySelectorAll('.feedback-section').forEach(section => {
        const starsContainer = section.querySelector('.feedback-stars');
        if (!starsContainer) return;
        const stars = starsContainer.querySelectorAll('i');
        const submitBtn = section.querySelector('.submit-feedback-btn');

        stars.forEach(star => {
            star.addEventListener('mouseover', () => !starsContainer.classList.contains('rated') && highlightStars(stars, star.dataset.value));
            star.addEventListener('mouseout', () => !starsContainer.classList.contains('rated') && highlightStars(stars, 0));
            star.addEventListener('click', () => {
                starsContainer.dataset.rating = star.dataset.value;
                starsContainer.classList.add('rated');
                highlightStars(stars, star.dataset.value);
            });
        });

        submitBtn.addEventListener('click', () => {
            if (starsContainer.dataset.rating === "0") {
                showNotification('لطفاً ابتدا با انتخاب ستاره‌ها، امتیاز خود را ثبت کنید.', 'error');
                return;
            }
            activeFeedbackSection = section;
            feedbackModal.style.display = 'flex';
        });
    });

    if (feedbackModal) {
        feedbackModal.querySelector('#modal-confirm-btn').addEventListener('click', () => {
            if (!activeFeedbackSection) return;
            const formElements = activeFeedbackSection.querySelectorAll('.feedback-stars, .feedback-textarea, .submit-feedback-btn, .feedback-subtitle');
            formElements.forEach(el => el && (el.style.display = 'none'));
            activeFeedbackSection.querySelector('.feedback-submitted-message').style.display = 'flex';
            closeModal(feedbackModal);
            showNotification('نظر شما با موفقیت ثبت شد. از مشارکت شما سپاسگزاریم!');
            activeFeedbackSection = null;
        });
        
        feedbackModal.querySelector('#modal-cancel-btn').addEventListener('click', () => closeModal(feedbackModal));
        feedbackModal.addEventListener('click', e => e.target === feedbackModal && closeModal(feedbackModal));
    }

    // -------------------------------------------------------------------
    // 3. منطق تاییدیه عمومی (برای تایید دریافت و شکایت)
    // -------------------------------------------------------------------
    const confirmModal = document.getElementById('confirmation-modal');
    if (confirmModal) {
        const confirmModalTitle = document.getElementById('confirmation-modal-title');
        const confirmModalText = document.getElementById('confirmation-modal-text');
        const confirmModalBtn = document.getElementById('confirmation-confirm-btn');
        const cancelConfirmBtn = document.getElementById('confirmation-cancel-btn');
        let actionToExecute = null;

        document.querySelectorAll('.confirm-receipt-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                confirmModalTitle.textContent = 'تایید دریافت محصول';
                confirmModalText.textContent = 'آیا اطمینان دارید که این محصول را به درستی دریافت کرده‌اید؟ این عملیات غیرقابل بازگشت است.';
                confirmModalBtn.className = 'action-button primary';
                confirmModalBtn.textContent = 'بله، تایید می‌کنم';
                actionToExecute = () => {
                    const transactionBox = button.closest('.transaction-box');
                    transactionBox.querySelector('.transaction-actions').style.display = 'none';
                    transactionBox.querySelector('.auto-complete-warning').style.display = 'none';
                    transactionBox.querySelector('.confirmation-message').style.display = 'flex';
                    // اضافه کردن کلاس برای جلوگیری از بررسی تایمر
                    transactionBox.classList.add('is-confirmed');
                    showNotification('دریافت محصول با موفقیت تایید شد.');
                };
                confirmModal.style.display = 'flex';
            });
        });

        document.querySelectorAll('.report-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                confirmModalTitle.textContent = 'پیگیری / شکایت';
                confirmModalText.textContent = 'آیا می‌خواهید برای این سفارش یک تیکت پشتیبانی ایجاد کنید؟ شما به صفحه پشتیبانی منتقل خواهید شد.';
                confirmModalBtn.className = 'action-button confirm-danger';
                confirmModalBtn.textContent = 'بله، ادامه بده';
                actionToExecute = () => {
                    showNotification('در حال انتقال به صفحه پشتیبانی...', 'info');
                };
                confirmModal.style.display = 'flex';
            });
        });

        confirmModalBtn.addEventListener('click', () => {
            if (typeof actionToExecute === 'function') actionToExecute();
            closeModal(confirmModal);
            actionToExecute = null;
        });

        cancelConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
        confirmModal.addEventListener('click', e => e.target === confirmModal && closeModal(confirmModal));
    }
    
    // -------------------------------------------------------------------
    // 4. عملکرد چاپ فاکتور
    // -------------------------------------------------------------------
    const printBtn = document.getElementById('print-invoice-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // -------------------------------------------------------------------
    // 5. منطق جدید: تکمیل خودکار معامله
    // -------------------------------------------------------------------
    const AUTO_COMPLETE_HOURS = 24;
    const AUTO_COMPLETE_MS = AUTO_COMPLETE_HOURS * 60 * 60 * 1000;

    function initializeTransactionTimers() {
        // برای شبیه‌سازی، به محصولاتی که زمان تحویل ندارند، زمان فعلی را می‌دهیم
        document.querySelectorAll('.transaction-box').forEach(box => {
            if (!box.dataset.deliveryTimestamp) {
                box.dataset.deliveryTimestamp = new Date().toISOString();
            }
        });

        // بررسی وضعیت تمام معاملات در لحظه بارگذاری
        document.querySelectorAll('.transaction-box').forEach(checkTransactionStatus);
        
        // به‌روزرسانی تایمرها هر دقیقه
        setInterval(() => {
            document.querySelectorAll('.transaction-box:not(.is-confirmed)').forEach(checkTransactionStatus);
        }, 60000); 
    }

    function checkTransactionStatus(transactionBox) {
        if (transactionBox.classList.contains('is-confirmed')) return;
        
        const deliveryTime = new Date(transactionBox.dataset.deliveryTimestamp);
        const elapsedTime = Date.now() - deliveryTime.getTime();

        if (elapsedTime >= AUTO_COMPLETE_MS) {
            autoCompleteTransaction(transactionBox);
        } else {
            updateWarningTimer(transactionBox, elapsedTime);
        }
    }

    function autoCompleteTransaction(transactionBox) {
        transactionBox.querySelector('.transaction-actions').style.display = 'none';
        transactionBox.querySelector('.auto-complete-warning').style.display = 'none';
        transactionBox.querySelector('.auto-completed-message').style.display = 'flex';
    }

    function updateWarningTimer(transactionBox, elapsedTime) {
        const remainingTime = AUTO_COMPLETE_MS - elapsedTime;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

        const warningElement = transactionBox.querySelector('.auto-complete-warning');
        const spanElement = warningElement.querySelector('span');
        spanElement.innerHTML = `برای تایید یا ثبت شکایت از این معامله <strong>${hours} ساعت و ${minutes} دقیقه</strong> فرصت دارید.`;
        warningElement.style.display = 'flex';
    }

    // -------------------------------------------------------------------
    // 6. توابع کمکی
    // -------------------------------------------------------------------
    function highlightStars(stars, rating) {
        stars.forEach(star => {
            star.className = star.dataset.value <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star';
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('copy-notification');
        notification.textContent = message;
        let bgColor = type === 'error' ? 'var(--color-danger)' : (type === 'info' ? 'var(--color-primary)' : 'var(--color-success)');
        notification.style.backgroundColor = bgColor;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
    
    function closeModal(modalElement) {
        if(modalElement) modalElement.style.display = 'none';
    }
});