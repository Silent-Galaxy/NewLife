document.addEventListener('DOMContentLoaded', () => {

    const translations = {
        'fa': {
            page_title: 'کپچای هوشمند نسخه 8.0',
            captcha_title: 'تایید هویت',
            slider_instruction: 'برای ادامه، دستگیره را بکشید تا با هدف هم‌تراز شود.',
            slider_instruction_success: 'عالی! حالا کد زیر را وارد کنید.',
            slider_handle_label: 'دستگیره تایید',
            code_placeholder: 'کد بالا را وارد کنید...',
            check_btn: 'بررسی',
            success_message: 'تایید شد!',
            lang_switcher: (flag) => `<span>English</span> ${flag}`,
            error_wrong_position: 'موقعیت اشتباه است، دوباره تلاش کنید.',
            error_unnatural_move: 'حرکت غیرطبیعی تشخیص داده شد.',
            error_too_fast: 'حرکت بیش از حد سریع بود.',
            error_wrong_code: 'کد وارد شده اشتباه است.',
            font_family: "'Vazirmatn', sans-serif"
        },
        'en': {
            page_title: 'Smart Captcha v8.0',
            captcha_title: 'Identity Verification',
            slider_instruction: 'To continue, drag the handle to align with the target.',
            slider_instruction_success: 'Great! Now enter the code below.',
            slider_handle_label: 'Verification handle',
            code_placeholder: 'Enter the code above...',
            check_btn: 'Check',
            success_message: 'Verified!',
            lang_switcher: (flag) => `<span>فارسی</span> ${flag}`,
            error_wrong_position: 'Wrong position, try again.',
            error_unnatural_move: 'Unnatural movement detected.',
            error_too_fast: 'Movement was too fast.',
            error_wrong_code: 'The code is incorrect.',
            font_family: "'Roboto', sans-serif"
        }
    };

    const SmartCaptcha = {
        elements: {
            container: document.getElementById('captcha-container'),
            challengeWrapper: document.getElementById('captcha-challenge-wrapper'),
            successState: document.getElementById('captcha-success-state'),
            handle: document.getElementById('slider-handle'),
            target: document.getElementById('slider-target'),
            track: document.getElementById('slider-track'),
            instruction: document.getElementById('captcha-instruction'),
            codeContainer: document.getElementById('code-challenge-container'),
            canvas: document.getElementById('captcha-canvas'),
            input: document.getElementById('captcha-input'),
            checkBtn: document.getElementById('check-code-btn'),
            status: document.getElementById('captcha-status'),
            progressBar: document.getElementById('progress-bar'),
            langSwitcherBtn: document.getElementById('lang-switcher-btn'),
            flags: {
                ir: document.getElementById('flag-ir').outerHTML,
                gb: document.getElementById('flag-gb').outerHTML
            }
        },

        state: {
            isDragging: false,
            isSliderVerified: false,
            dragStartTime: 0,
            trackWidth: 0,
            handleWidth: 0,
            currentLanguage: 'fa',
            statusTimeout: null,
            captchaCode: '', // This will be managed securely
        },

        init() {
            this.elements.ctx = this.elements.canvas.getContext('2d');
            const savedLang = localStorage.getItem('captchaLang') || 'fa';
            this.setLanguage(savedLang);
            this.addEventListeners();
            window.addEventListener('resize', () => this.reset());
        },

        setLanguage(lang) {
            this.state.currentLanguage = lang;
            const dir = lang === 'fa' ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
            document.documentElement.dir = dir;
            document.body.style.fontFamily = translations[lang].font_family;

            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.getAttribute('data-lang-key');
                if (translations[lang][key]) el.textContent = translations[lang][key];
            });
            document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
                const key = el.getAttribute('data-lang-placeholder');
                if (translations[lang][key]) el.placeholder = translations[lang][key];
            });
            document.querySelectorAll('[data-lang-aria-label]').forEach(el => {
                const key = el.getAttribute('data-lang-aria-label');
                if (translations[lang][key]) el.setAttribute('aria-label', translations[lang][key]);
            });

            const flagIcon = lang === 'fa' ? this.elements.flags.gb : this.elements.flags.ir;
            this.elements.langSwitcherBtn.innerHTML = translations[lang].lang_switcher(flagIcon);
            this.reset();
        },

        reset() {
            this.state.isSliderVerified = false;
            this.state.isDragging = false;
            
            this.elements.container.classList.remove('success-mode', 'error');
            this.elements.container.style.height = '';
            
            this.elements.challengeWrapper.classList.remove('hidden');
            this.elements.successState.classList.add('hidden');
            
            this.ui.clearStatus();
            this.elements.input.value = '';
            
            this.elements.handle.style.left = '0px';
            this.elements.handle.style.backgroundColor = 'var(--primary-color)';
            this.elements.handle.setAttribute('aria-valuenow', '0');
            
            this.elements.codeContainer.classList.add('hidden');
            this.elements.instruction.textContent = translations[this.state.currentLanguage].slider_instruction;
            this.ui.updateProgress(0);

            setTimeout(() => {
                this.state.trackWidth = this.elements.track.offsetWidth;
                this.state.handleWidth = this.elements.handle.offsetWidth;
                const randomTargetX = Math.floor(Math.random() * (this.state.trackWidth - this.state.handleWidth * 2)) + this.state.handleWidth;
                this.elements.target.style.left = `${randomTargetX}px`;
            }, 100);
        },

        addEventListeners() {
            this.elements.langSwitcherBtn.addEventListener('click', () => {
                const newLang = this.state.currentLanguage === 'fa' ? 'en' : 'fa';
                this.setLanguage(newLang);
                localStorage.setItem('captchaLang', newLang);
            });
            
            const startEvents = ['mousedown', 'touchstart'];
            const moveEvents = ['mousemove', 'touchmove'];
            const endEvents = ['mouseup', 'touchend'];

            startEvents.forEach(evt => this.elements.handle.addEventListener(evt, this.onDragStart.bind(this), { passive: false }));
            moveEvents.forEach(evt => document.addEventListener(evt, this.onDrag.bind(this), { passive: false }));
            endEvents.forEach(evt => document.addEventListener(evt, this.onDragEnd.bind(this)));

            this.elements.handle.addEventListener('keydown', this.onKeydown.bind(this));
            this.elements.checkBtn.addEventListener('click', this.checkCode.bind(this));
            this.elements.input.addEventListener('keyup', (e) => e.key === 'Enter' && this.checkCode());
        },
        
        onDragStart(e) {
            if (this.state.isSliderVerified) return;
            this.state.isDragging = true;
            this.state.dragStartTime = Date.now();
            this.ui.clearStatus();
            e.preventDefault();
        },

        onDrag(e) {
            if (!this.state.isDragging || this.state.isSliderVerified) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const trackRect = this.elements.track.getBoundingClientRect();
            
            let newX = clientX - trackRect.left - (this.state.handleWidth / 2);
            newX = Math.max(0, Math.min(newX, this.state.trackWidth - this.state.handleWidth));
            
            this.elements.handle.style.transition = 'none'; // Disable transition during drag for responsiveness
            this.elements.handle.style.left = `${newX}px`;
            const percent = Math.round((newX / (this.state.trackWidth - this.state.handleWidth)) * 100);
            this.elements.handle.setAttribute('aria-valuenow', percent);
        },

        onDragEnd() {
            if (!this.state.isDragging || this.state.isSliderVerified) return;
            this.state.isDragging = false;
            this.elements.handle.style.transition = ''; // Re-enable transition

            const dragDuration = Date.now() - this.state.dragStartTime;
            if (dragDuration < 200) { // Anti-bot: check for unnaturally fast movement
                this.onSliderFailure(translations[this.state.currentLanguage].error_too_fast);
                return;
            }

            const handleRect = this.elements.handle.getBoundingClientRect();
            const targetRect = this.elements.target.getBoundingClientRect();
            const tolerance = 5;

            if (Math.abs(handleRect.left - targetRect.left) <= tolerance) {
                this.onSliderSuccess();
            } else {
                this.onSliderFailure();
            }
        },

        onKeydown(e) {
            if (this.state.isSliderVerified || !['ArrowRight', 'ArrowLeft', 'Enter', ' '].includes(e.key)) return;
            
            e.preventDefault();
            this.ui.clearStatus();

            if (e.key === 'Enter' || e.key === ' ') {
                this.onDragEnd();
                return;
            }

            const currentLeft = parseFloat(this.elements.handle.style.left) || 0;
            const step = (this.state.trackWidth - this.state.handleWidth) / 20; // 5% step
            let newX = e.key === 'ArrowRight' ? currentLeft + step : currentLeft - step;
            newX = Math.max(0, Math.min(newX, this.state.trackWidth - this.state.handleWidth));
            
            this.elements.handle.style.left = `${newX}px`;
        },

        onSliderSuccess() {
            this.state.isSliderVerified = true;
            this.ui.updateProgress(50);
            this.elements.handle.style.backgroundColor = 'var(--success-color)';
            this.elements.instruction.textContent = translations[this.state.currentLanguage].slider_instruction_success;
            
            this.generateAndDrawCode();
            
            this.elements.codeContainer.classList.remove('hidden');
            setTimeout(() => this.elements.input.focus(), 100);
        },

        onSliderFailure(message) {
            const defaultMessage = translations[this.state.currentLanguage].error_wrong_position;
            this.ui.showError(message || defaultMessage);
            this.elements.handle.style.left = '0px';
            this.elements.handle.setAttribute('aria-valuenow', '0');
        },

        checkCode() {
            const userInput = this.elements.input.value.toUpperCase();

            // --- SECURE VALIDATION (SIMULATION) ---
            // In a real application, you would send `userInput` to your server.
            // The server would compare it with the code stored in the user's session.
            // It would then return { success: true } or { success: false }.
            
            const isCorrect = userInput === this.state.captchaCode; // This line simulates the server check.

            if (isCorrect) {
                this.onFinalSuccess();
            } else {
                this.ui.showError(translations[this.state.currentLanguage].error_wrong_code, true);
                this.generateAndDrawCode(); // Regenerate code on failure
                this.elements.input.value = '';
                this.elements.input.focus();
            }
        },

        onFinalSuccess() {
            this.ui.updateProgress(100);
            this.ui.clearStatus();
            setTimeout(() => {
                const containerHeight = this.elements.container.offsetHeight;
                this.elements.container.style.height = `${containerHeight}px`;
                this.elements.container.classList.add('success-mode');
                
                this.elements.challengeWrapper.classList.add('hidden');
                this.elements.successState.classList.remove('hidden');
            }, 500);
        },

        generateAndDrawCode() {
            // This function simulates the server generating a code and sending it to the client for drawing.
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 5; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            this.state.captchaCode = result; // In a real app, this would be stored on the server session.
            this.drawCodeOnCanvas(this.state.captchaCode);
        },

        drawCodeOnCanvas(code) {
            const { ctx, canvas } = this.elements;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background noise
            for (let i = 0; i < 30; i++) {
                ctx.fillStyle = `rgba(${150+Math.random()*105}, ${150+Math.random()*105}, ${150+Math.random()*105}, 0.2)`;
                ctx.beginPath();
                ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*3, 0, Math.PI*2);
                ctx.fill();
            }

            // Distorted text
            for (let i = 0; i < code.length; i++) {
                ctx.save();
                ctx.font = `bold ${30 + Math.random() * 6}px 'Source Code Pro', monospace`;
                ctx.fillStyle = `rgb(${Math.random()*80}, ${Math.random()*80}, ${Math.random()*80})`;
                ctx.translate(25 + i * 35, canvas.height / 2 + 12);
                ctx.rotate((Math.random() - 0.5) * 0.4);
                ctx.fillText(code[i], 0, 0);
                ctx.restore();
            }
        },
        
        // --- UI Helper Functions ---
        ui: {
            updateProgress(percentage) {
                SmartCaptcha.elements.progressBar.style.width = `${percentage}%`;
                SmartCaptcha.elements.progressBar.style.backgroundColor = percentage === 100 ? 'var(--success-color)' : 'var(--primary-color)';
            },
            
            showError(message, isCodeError = false) {
                this.clearStatus();
                const { status, container, input } = SmartCaptcha.elements;
                status.textContent = message;
                status.className = 'captcha-error';
                container.classList.add('error');
                if (isCodeError) input.classList.add('error');

                SmartCaptcha.state.statusTimeout = setTimeout(() => this.clearStatus(), 2500);
            },

            clearStatus() {
                clearTimeout(SmartCaptcha.state.statusTimeout);
                const { status, container, input } = SmartCaptcha.elements;
                status.textContent = '';
                status.className = '';
                container.classList.remove('error');
                input.classList.remove('error');
            }
        }
    };

    SmartCaptcha.init();
});