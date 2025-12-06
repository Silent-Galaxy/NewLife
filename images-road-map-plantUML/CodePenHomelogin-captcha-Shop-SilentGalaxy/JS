document.addEventListener('DOMContentLoaded', function() {
    // --- Section 1: DOM Selectors and Main Variables ---
    const wrapper = document.querySelector('.secure-login-wrapper');
    if (!wrapper) {
        console.error('Secure login wrapper not found!');
        return;
    }

    const forms = {
        login: wrapper.querySelector('.login'),
        signup: wrapper.querySelector('.signup'),
        forgotPassword: wrapper.querySelector('.forgot-password')
    };
    const links = {
        signup: wrapper.querySelector('#signup-link'),
        forgotPassword: wrapper.querySelector('#forgot-password-link'),
        phoneLogin: wrapper.querySelector('#phone-login-link'),
        login: wrapper.querySelectorAll('.login-link')
    };
    const signupPasswordInput = wrapper.querySelector('#signup-password');
    const confirmPasswordInput = wrapper.querySelector('#signup-confirm-password');
    const criteriaChecklistContainer = wrapper.querySelector('#password-criteria-checklist');
    const captchaModalOverlay = wrapper.querySelector('#captcha-modal-overlay');
    const captchaCloseBtn = wrapper.querySelector('#captcha-close-btn');

    let currentLanguage = 'en';
    let formToSubmit = null; 

    // --- Section 2: Form Switching Logic ---
    function resetAllButtonStates() {
        wrapper.querySelectorAll('.submit-btn').forEach(button => {
            button.classList.remove('loading', 'success', 'error');
            const loader = button.querySelector('.loader');
            if (loader) loader.remove();
        });
    }

    function setActiveForm(activeForm) {
        resetAllButtonStates();
        Object.values(forms).forEach(form => form.classList.remove('active'));
        activeForm.classList.add('active');
    }

    links.signup.addEventListener('click', (e) => { e.preventDefault(); setActiveForm(forms.signup); });
    links.forgotPassword.addEventListener('click', (e) => { e.preventDefault(); setActiveForm(forms.forgotPassword); });
    links.login.forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); setActiveForm(forms.login); });
    });

    // --- Section 3: Translation System ---
    const translations = {
        en: {
            login_title: "Login", username_placeholder: "Username", password_placeholder: "Password",
            confirm_password_placeholder: "Confirm Password", signin_button: "Sign in", forgot_link: "Forget Password",
            signup_link: "Signup", signup_title: "Signup", email_placeholder: "Email", signup_button: "Sign up",
            already_account: "Already have an account?", forgot_title: "Forget Password", enter_email_placeholder: "Enter your email",
            reset_button: "Reset Password", back_to_login: "Back to Login", or_divider: "OR",
            google_signin: "Sign in with Google", phone_login_link: "Login with Phone Number",
            coming_soon: "This feature is coming soon! :)", signup_success: "Account created successfully!",
            login_success: "Login successful! Welcome back.", reset_success: "Password reset link sent to your email.",
            error_all_fields: "Please fill in all fields.", error_invalid_email: "Please enter a valid email.",
            error_email_exists: "This email is already registered.", error_wrong_credentials: "Incorrect username or password.",
            error_password_mismatch: "Passwords do not match.", error_password_incomplete: "Please meet all password criteria.",
            criteria_length: "8+ Characters", criteria_uppercase: "1 Uppercase", criteria_lowercase: "1 Lowercase",
            criteria_number: "1 Number", criteria_symbol: "1 Symbol",
            captcha_title: 'Identity Verification', slider_instruction: 'To continue, drag the handle to align with the target.',
            slider_instruction_success: 'Great! Now enter the code below.', slider_handle_label: 'Verification handle',
            code_placeholder: 'Enter the code above...', check_btn: 'Check', success_message: 'Verified!',
            error_wrong_position: 'Wrong position, try again.', error_unnatural_move: 'Unnatural movement detected.',
            error_too_fast: 'Movement was too fast.', error_wrong_code: 'The code is incorrect.',
        },
        fa: {
            login_title: "ورود", username_placeholder: "نام کاربری", password_placeholder: "رمز عبور",
            confirm_password_placeholder: "تکرار رمز عبور", signin_button: "ورود", forgot_link: "فراموشی رمز",
            signup_link: "ثبت‌نام", signup_title: "ثبت‌نام", email_placeholder: "ایمیل", signup_button: "ایجاد حساب",
            already_account: "حساب کاربری دارید؟", forgot_title: "فراموشی رمز", enter_email_placeholder: "ایمیل خود را وارد کنید",
            reset_button: "بازیابی رمز", back_to_login: "بازگشت به صفحه ورود", or_divider: "یا",
            google_signin: "ورود با حساب گوگل", phone_login_link: "ورود با شماره همراه",
            coming_soon: "این قابلیت به زودی اضافه می‌شود! :)", signup_success: "حساب کاربری با موفقیت ایجاد شد!",
            login_success: "ورود موفق! خوش آمدید.", reset_success: "لینک بازیابی رمز به ایمیل شما ارسال شد.",
            error_all_fields: "لطفاً تمام فیلدها را پر کنید.", error_invalid_email: "لطفاً یک ایمیل معتبر وارد کنید.",
            error_email_exists: "این ایمیل قبلاً ثبت‌نام کرده است.", error_wrong_credentials: "نام کاربری یا رمز عبور اشتباه است.",
            error_password_mismatch: "رمزهای عبور یکسان نیستند.", error_password_incomplete: "لطفاً تمام معیارهای رمز عبور را رعایت کنید.",
            criteria_length: "+۸ کاراکتر", criteria_uppercase: "۱ حرف بزرگ", criteria_lowercase: "۱ حرف کوچک",
            criteria_number: "۱ عدد", criteria_symbol: "۱ نماد",
            captcha_title: 'تایید هویت', slider_instruction: 'برای ادامه، دستگیره را بکشید تا با هدف هم‌تراز شود.',
            slider_instruction_success: 'عالی! حالا کد زیر را وارد کنید.', slider_handle_label: 'دستگیره تایید',
            code_placeholder: 'کد بالا را وارد کنید...', check_btn: 'بررسی', success_message: 'تایید شد!',
            error_wrong_position: 'موقعیت اشتباه است، دوباره تلاش کنید.', error_unnatural_move: 'حرکت غیرطبیعی تشخیص داده شد.',
            error_too_fast: 'حرکت بیش از حد سریع بود.', error_wrong_code: 'کد وارد شده اشتباه است.',
        }
    };
    const langButtons = wrapper.querySelectorAll('.lang-switcher button');
    function changeLanguage(lang) {
        currentLanguage = lang;
        wrapper.classList.toggle('lang-fa', lang === 'fa');
        // Setting the direction on the wrapper is better for component-based logic
        // But also setting on body can be useful if other page elements need it
        document.body.dir = lang === 'fa' ? 'rtl' : 'ltr'; 

        document.documentElement.lang = lang;
        wrapper.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang]?.[key]) {
                const translation = translations[lang][key];
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translation;
                else el.textContent = translation;
            }
        });
        wrapper.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (translations[lang]?.[key]) el.placeholder = translations[lang][key];
        });
        wrapper.querySelectorAll('[data-lang-aria-label]').forEach(el => {
            const key = el.getAttribute('data-lang-aria-label');
            if (translations[lang]?.[key]) el.setAttribute('aria-label', translations[lang][key]);
        });
        langButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
        renderPasswordCriteria();
        evaluatePassword(signupPasswordInput.value);
        SmartCaptcha.setLanguage(lang);
    }
    langButtons.forEach(button => {
        button.addEventListener('click', () => changeLanguage(button.getAttribute('data-lang')));
    });

    // --- Section 4: Toast Notification System ---
    const toastContainer = wrapper.querySelector('#toast-container');
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    // --- Section 5: Password Validation & Checklist ---
    const passwordCriteria = [
        { id: 'length', regex: /.{8,}/, key: 'criteria_length' },
        { id: 'uppercase', regex: /[A-Z]/, key: 'criteria_uppercase' },
        { id: 'lowercase', regex: /[a-z]/, key: 'criteria_lowercase' },
        { id: 'number', regex: /[0-9]/, key: 'criteria_number' },
        { id: 'symbol', regex: /[^A-Za-z0-9]/, key: 'criteria_symbol' }
    ];
    function renderPasswordCriteria() {
        criteriaChecklistContainer.innerHTML = '';
        passwordCriteria.forEach(criterion => {
            const li = document.createElement('div');
            li.className = 'criteria-item';
            li.id = `criteria-${criterion.id}`;
            li.innerHTML = `<span class="icon"></span><span>${translations[currentLanguage][criterion.key]}</span>`;
            criteriaChecklistContainer.appendChild(li);
        });
    }
    function evaluatePassword(password) {
        passwordCriteria.forEach(criterion => {
            const element = wrapper.querySelector(`#criteria-${criterion.id}`);
            if (element) element.classList.toggle('valid', criterion.regex.test(password));
        });
    }
    function validatePasswordMatch() {
        const mismatchError = translations[currentLanguage]['error_password_mismatch'];
        if (signupPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity(mismatchError);
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }
    if (signupPasswordInput) signupPasswordInput.addEventListener('input', () => {
        evaluatePassword(signupPasswordInput.value);
        validatePasswordMatch();
    });
    if (confirmPasswordInput) confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // --- Section 6: Form Submission Logic ---
    function simulateValidation(form) {
        const inputs = Array.from(form.querySelectorAll('input[required]'));
        if (inputs.some(input => !input.value)) return { success: false, messageKey: 'error_all_fields' };
        
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) return { success: false, messageKey: 'error_invalid_email' };
        
        if (form.classList.contains('signup')) {
            if (signupPasswordInput.value !== confirmPasswordInput.value) return { success: false, messageKey: 'error_password_mismatch' };
            if (!passwordCriteria.every(c => c.regex.test(signupPasswordInput.value))) return { success: false, messageKey: 'error_password_incomplete' };
            if (emailInput.value === 'test@test.com') return { success: false, messageKey: 'error_email_exists' };
        }
        
        if (form.classList.contains('login')) {
            const loginPass = form.querySelector('input[autocomplete="current-password"]').value;
            if (loginPass !== '123456') return { success: false, messageKey: 'error_wrong_credentials' };
        }
        
        if (form.classList.contains('signup')) return { success: true, messageKey: 'signup_success' };
        if (form.classList.contains('login')) return { success: true, messageKey: 'login_success' };
        if (form.classList.contains('forgot-password')) return { success: true, messageKey: 'reset_success' };
        return { success: true, messageKey: 'signup_success' };
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        if (form.querySelector('.submit-btn').classList.contains('loading')) return;

        const validationResult = simulateValidation(form);
        if (!validationResult.success) {
            showToast(translations[currentLanguage][validationResult.messageKey], 'error');
            return;
        }
        
        formToSubmit = form;
        captchaModalOverlay.classList.remove('hidden');
        SmartCaptcha.reset();
    }

    function proceedWithSubmission() {
        if (!formToSubmit) return;
        const button = formToSubmit.querySelector('.submit-btn');
        const validationResult = simulateValidation(formToSubmit);

        button.classList.add('loading');
        if (!button.querySelector('.loader')) {
            const loader = document.createElement('div');
            loader.className = 'loader';
            button.appendChild(loader);
        }

        setTimeout(() => {
            button.classList.remove('loading');
            button.querySelector('.loader')?.remove();
            
            button.classList.add('success');
            showToast(translations[currentLanguage][validationResult.messageKey], 'success');
            
            setTimeout(() => {
                button.classList.remove('success', 'error');
            }, 2000);
            formToSubmit = null;
        }, 1500);
    }
    Object.values(forms).forEach(form => form.addEventListener('submit', handleFormSubmit));

    // --- Section 7: SmartCaptcha Module ---
    const SmartCaptcha = {
         elements: {
            container: wrapper.querySelector('#captcha-container'),
            challengeWrapper: wrapper.querySelector('#captcha-challenge-wrapper'),
            successState: wrapper.querySelector('#captcha-success-state'),
            handle: wrapper.querySelector('#slider-handle'),
            target: wrapper.querySelector('#slider-target'),
            track: wrapper.querySelector('#slider-track'),
            instruction: wrapper.querySelector('#captcha-instruction'),
            codeContainer: wrapper.querySelector('#code-challenge-container'),
            canvas: wrapper.querySelector('#captcha-canvas'),
            input: wrapper.querySelector('#captcha-input'),
            checkBtn: wrapper.querySelector('#check-code-btn'),
            status: wrapper.querySelector('#captcha-status'),
            progressBar: wrapper.querySelector('#progress-bar'),
        },
        state: {
            isDragging: false, isSliderVerified: false, dragStartTime: 0,
            trackWidth: 0, handleWidth: 0, statusTimeout: null, captchaCode: '',
        },
        init() {
            this.elements.ctx = this.elements.canvas.getContext('2d');
            this.addEventListeners();
            window.addEventListener('resize', () => {
                if (!this.state.isSliderVerified) {
                    this.reset();
                }
            });
        },
        setLanguage(lang) {
            const dir = lang === 'fa' ? 'rtl' : 'ltr';
            this.elements.container.dir = dir;
            this.reset();
        },
        reset() {
            this.state.isSliderVerified = false; this.state.isDragging = false;
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
            this.elements.instruction.textContent = translations[currentLanguage].slider_instruction;
            this.ui.updateProgress(0);
            setTimeout(() => {
                if(!this.elements.track) return;
                this.state.trackWidth = this.elements.track.offsetWidth;
                this.state.handleWidth = this.elements.handle.offsetWidth;
                const randomTargetX = Math.floor(Math.random() * (this.state.trackWidth - this.state.handleWidth * 2)) + this.state.handleWidth;
                this.elements.target.style.left = `${randomTargetX}px`;
            }, 100);
        },
        addEventListeners() {
            ['mousedown', 'touchstart'].forEach(evt => this.elements.handle.addEventListener(evt, this.onDragStart.bind(this), { passive: false }));
            document.addEventListener('mousemove', this.onDrag.bind(this), { passive: false });
            document.addEventListener('touchmove', this.onDrag.bind(this), { passive: false });
            document.addEventListener('mouseup', this.onDragEnd.bind(this));
            document.addEventListener('touchend', this.onDragEnd.bind(this));
            this.elements.handle.addEventListener('keydown', this.onKeydown.bind(this));
            this.elements.checkBtn.addEventListener('click', this.checkCode.bind(this));
            this.elements.input.addEventListener('keyup', (e) => e.key === 'Enter' && this.checkCode());
        },
        onDragStart(e) {
            if (this.state.isSliderVerified) return;
            this.state.isDragging = true; this.state.dragStartTime = Date.now();
            this.ui.clearStatus(); e.preventDefault();
        },
        onDrag(e) {
            if (!this.state.isDragging || this.state.isSliderVerified) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const trackRect = this.elements.track.getBoundingClientRect();
            let newX = clientX - trackRect.left - (this.state.handleWidth / 2);
            newX = Math.max(0, Math.min(newX, this.state.trackWidth - this.state.handleWidth));
            this.elements.handle.style.transition = 'none';
            this.elements.handle.style.left = `${newX}px`;
            this.elements.handle.setAttribute('aria-valuenow', Math.round((newX / (this.state.trackWidth - this.state.handleWidth)) * 100));
        },
        onDragEnd() {
            if (!this.state.isDragging || this.state.isSliderVerified) return;
            this.state.isDragging = false; this.elements.handle.style.transition = '';
            if (Date.now() - this.state.dragStartTime < 200) { this.onSliderFailure(translations[currentLanguage].error_too_fast); return; }
            const handleRect = this.elements.handle.getBoundingClientRect();
            const targetRect = this.elements.target.getBoundingClientRect();
            if (Math.abs(handleRect.left - targetRect.left) <= 5) this.onSliderSuccess();
            else this.onSliderFailure();
        },
        onKeydown(e) {
            if (this.state.isSliderVerified || !['ArrowRight', 'ArrowLeft', 'Enter', ' '].includes(e.key)) return;
            e.preventDefault(); this.ui.clearStatus();
            if (e.key === 'Enter' || e.key === ' ') { this.onDragEnd(); return; }
            const currentLeft = parseFloat(this.elements.handle.style.left) || 0;
            const step = (this.state.trackWidth - this.state.handleWidth) / 20;
            let newX = e.key === 'ArrowRight' ? currentLeft + step : currentLeft - step;
            this.elements.handle.style.left = `${Math.max(0, Math.min(newX, this.state.trackWidth - this.state.handleWidth))}px`;
        },
        onSliderSuccess() {
            this.state.isSliderVerified = true; this.ui.updateProgress(50);
            this.elements.handle.style.backgroundColor = 'var(--success-color)';
            this.elements.instruction.textContent = translations[currentLanguage].slider_instruction_success;
            this.generateAndDrawCode();
            this.elements.codeContainer.classList.remove('hidden');
            setTimeout(() => this.elements.input.focus(), 100);
        },
        onSliderFailure(message) {
            this.ui.showError(message || translations[currentLanguage].error_wrong_position);
            this.elements.handle.style.left = '0px';
            this.elements.handle.setAttribute('aria-valuenow', '0');
        },
        checkCode() {
            if (this.elements.input.value.toUpperCase() === this.state.captchaCode) this.onFinalSuccess();
            else {
                this.ui.showError(translations[currentLanguage].error_wrong_code, true);
                this.generateAndDrawCode(); this.elements.input.value = ''; this.elements.input.focus();
            }
        },
        onFinalSuccess() {
            this.ui.updateProgress(100); this.ui.clearStatus();
            setTimeout(() => {
                const containerHeight = this.elements.container.offsetHeight;
                this.elements.container.style.height = `${containerHeight}px`;
                this.elements.container.classList.add('success-mode');
                this.elements.challengeWrapper.classList.add('hidden');
                this.elements.successState.classList.remove('hidden');
                
                setTimeout(() => {
                    captchaModalOverlay.classList.add('hidden');
                    proceedWithSubmission();
                }, 1200);

            }, 500);
        },
        generateAndDrawCode() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            this.state.captchaCode = Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
            this.drawCodeOnCanvas(this.state.captchaCode);
        },
        drawCodeOnCanvas(code) {
            const { ctx, canvas } = this.elements;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 30; i++) {
                ctx.fillStyle = `rgba(${150+Math.random()*105}, ${150+Math.random()*105}, ${150+Math.random()*105}, 0.2)`;
                ctx.beginPath(); ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*3, 0, Math.PI*2); ctx.fill();
            }
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
        ui: {
            updateProgress(p) { SmartCaptcha.elements.progressBar.style.width = `${p}%`; SmartCaptcha.elements.progressBar.style.backgroundColor = p === 100 ? 'var(--success-color)' : 'var(--primary-color)'; },
            showError(msg, isCodeError = false) {
                this.clearStatus();
                const { status, container, input } = SmartCaptcha.elements;
                status.textContent = msg; status.className = 'captcha-error'; container.classList.add('error');
                if (isCodeError) input.classList.add('error');
                SmartCaptcha.state.statusTimeout = setTimeout(() => this.clearStatus(), 2500);
            },
            clearStatus() {
                clearTimeout(SmartCaptcha.state.statusTimeout);
                const { status, container, input } = SmartCaptcha.elements;
                status.textContent = ''; status.className = ''; container.classList.remove('error'); input.classList.remove('error');
            }
        }
    };

    // --- Section 8: Password Visibility Toggle ---
    function setupPasswordToggles() {
        wrapper.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const passwordInput = toggle.previousElementSibling;
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggle.classList.add('visible');
                    toggle.setAttribute('aria-label', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    toggle.classList.remove('visible');
                    toggle.setAttribute('aria-label', 'Show password');
                }
            });
        });
    }

    // --- Section 9: Miscellaneous Logic & Initializers ---
    wrapper.querySelectorAll('.glare-btn').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            button.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            button.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    links.phoneLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(translations[currentLanguage]['coming_soon'], 'info');
    });

    captchaCloseBtn.addEventListener('click', () => {
        captchaModalOverlay.classList.add('hidden');
        formToSubmit = null;
    });
    captchaModalOverlay.addEventListener('click', (e) => {
        if (e.target === captchaModalOverlay) captchaCloseBtn.click();
    });

    // --- Initializations ---
    changeLanguage('en');
    SmartCaptcha.init();
    setupPasswordToggles();
});