// script.js

// --- UTILITIES ---
function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    let jy = -1595 + (33 * Math.floor(days / 12053));
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

function jalaliToGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    while (gm < 13 && gd > sal_a[gm]) {
        gd -= sal_a[gm];
        gm++;
    }
    return [gy, gm, gd];
}

function isJalaliLeapYear(year) {
    const a = [1, 5, 9, 13, 17, 22, 26, 30];
    return a.includes(year % 33);
}

// NEW: تابع تعیین فصل
function getSeason(month) {
    if (month >= 1 && month <= 3) return 'spring';
    if (month >= 4 && month <= 6) return 'summer';
    if (month >= 7 && month <= 9) return 'autumn';
    return 'winter'; // for months 10, 11, 12
}

// --- CONSTANTS & STATE ---
const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const officialHolidays = [
    { month: 1, day: 1, title: 'آغاز نوروز' }, { month: 1, day: 2, title: 'عید نوروز' },
    { month: 1, day: 3, title: 'عید نوروز' }, { month: 1, day: 4, title: 'عید نوروز' },
    { month: 1, day: 12, title: 'روز جمهوری اسلامی' }, { month: 1, day: 13, title: 'روز طبیعت' },
    { month: 3, day: 14, title: 'رحلت امام خمینی' }, { month: 3, day: 15, title: 'قیام خونین ۱۵ خرداد' },
    { month: 11, day: 22, title: 'پیروزی انقلاب اسلامی' }, { month: 12, day: 29, title: 'روز ملی شدن صنعت نفت' }
];

let userEvents = [];
const today = new Date();
const [currentYear, currentMonth, currentDay] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
let displayYear = currentYear;
let displayMonth = currentMonth;
let selectedDate = null;

// --- DOM ELEMENTS ---
const calendarContainer = document.getElementById('calendar-container');
const monthYearEl = document.getElementById('month-year');
const daysContainer = document.getElementById('days-container');
const eventsSidebar = document.getElementById('events-sidebar');
const eventsList = document.getElementById('events-list');
const sidebarTitle = document.getElementById('sidebar-title');
const modal = document.getElementById('event-modal');
const modalDate = document.getElementById('modal-date');
const eventTitleInput = document.getElementById('event-title');

// --- EVENT MANAGEMENT ---
function loadUserEvents() {
    const eventsJson = localStorage.getItem('userEvents');
    userEvents = eventsJson ? JSON.parse(eventsJson) : [];
}

function saveUserEvents() {
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
}

function addEvent(year, month, day, title) {
    const newEvent = { id: Date.now(), year, month, day, title };
    userEvents.push(newEvent);
    saveUserEvents();
}

function deleteEvent(eventId) {
    userEvents = userEvents.filter(event => event.id !== eventId);
    saveUserEvents();
    renderCalendar();
    if (selectedDate) {
        showEventsForDay(selectedDate.year, selectedDate.month, selectedDate.day);
    } else {
        closeEventsSidebar();
    }
}

// --- UI RENDERING ---
function createDayElement(dayData) {
    const { day, month, year, isCurrentMonth, isToday, isHoliday, isFriday, hasEvent, isSelected, animationDelay } = dayData;
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.style.setProperty('--i', animationDelay);
    dayElement.tabIndex = -1;

    if (!isCurrentMonth) {
        dayElement.classList.add('other-month');
        return dayElement;
    }

    dayElement.dataset.year = year;
    dayElement.dataset.month = month;
    dayElement.dataset.day = day;
    dayElement.tabIndex = 0;
    dayElement.setAttribute('role', 'button');
    dayElement.setAttribute('aria-label', `${day} ${persianMonths[month - 1]}`);

    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = day;
    dayElement.appendChild(dayNumberElement);

    const eventMarker = document.createElement('div');
    eventMarker.className = 'event-marker';
    dayElement.appendChild(eventMarker);

    if (isToday) dayElement.classList.add('today');
    if (isHoliday) dayElement.classList.add('holiday');
    if (isFriday) dayElement.classList.add('friday');
    if (hasEvent) dayElement.classList.add('has-event');
    if (isSelected) dayElement.classList.add('selected');

    dayElement.addEventListener('click', handleDayClick);
    dayElement.addEventListener('dblclick', handleDayDblClick);

    return dayElement;
}

function renderCalendar() {
    // UPDATE: اعمال تم فصلی
    const season = getSeason(displayMonth);
    calendarContainer.className = 'calendar-container'; // Reset classes
    calendarContainer.classList.add(`theme-${season}`);

    monthYearEl.textContent = `${persianMonths[displayMonth - 1]} ${displayYear}`;
    daysContainer.innerHTML = '';
    
    const [gy, gm, gd] = jalaliToGregorian(displayMonth, displayMonth, 1);
    const firstDayOfMonth = new Date(Date.UTC(gy, gm - 1, gd));
    const dayOfWeek = (firstDayOfMonth.getUTCDay() + 1) % 7;
    
    const daysInMonth = (displayMonth <= 6) ? 31 : (displayMonth <= 11) ? 30 : isJalaliLeapYear(displayYear) ? 30 : 29;
    
    const fragment = document.createDocumentFragment();
    const gridCells = 42;

    for (let i = 0; i < gridCells; i++) {
        const day = i - dayOfWeek + 1;
        const isCurrentMonth = i >= dayOfWeek && i < dayOfWeek + daysInMonth;
        
        const dayData = {
            day, month: displayMonth, year: displayYear, isCurrentMonth,
            isToday: isCurrentMonth && displayYear === currentYear && displayMonth === currentMonth && day === currentDay,
            isHoliday: false, isFriday: false,
            hasEvent: isCurrentMonth && userEvents.some(e => e.year === displayYear && e.month === displayMonth && e.day === day),
            isSelected: isCurrentMonth && selectedDate && selectedDate.year === displayYear && selectedDate.month === displayMonth && selectedDate.day === day,
            animationDelay: i
        };

        if (isCurrentMonth) {
            const holiday = officialHolidays.find(h => h.month === displayMonth && h.day === day);
            const currentDayOfWeek = (dayOfWeek + day - 1) % 7;
            dayData.isFriday = currentDayOfWeek === 6;
            dayData.isHoliday = !!holiday;
        }
        
        const dayElement = createDayElement(dayData);
        fragment.appendChild(dayElement);
    }
    daysContainer.appendChild(fragment);
}

function showEventsForDay(year, month, day) {
    const dayEvents = [
        ...officialHolidays.filter(h => h.month === month && h.day === day).map(h => ({ ...h, isHoliday: true })),
        ...userEvents.filter(e => e.year === year && e.month === month && e.day === day)
    ];
    
    eventsList.innerHTML = '';
    
    if (dayEvents.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: #888;">هیچ مناسبتی ثبت نشده است.</p>';
    } else {
        dayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            if (event.isHoliday) eventItem.classList.add('holiday-item');
            
            const eventTitle = document.createElement('span');
            eventTitle.textContent = event.title;
            eventItem.appendChild(eventTitle);

            if (!event.isHoliday) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-event-btn';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.ariaLabel = `حذف رویداد ${event.title}`;
                deleteBtn.onclick = () => deleteEvent(event.id);
                eventItem.appendChild(deleteBtn);
            }
            eventsList.appendChild(eventItem);
        });
    }
    
    const [gYear, gMonth, gDay] = jalaliToGregorian(year, month, day);
    const dateObj = new Date(Date.UTC(gYear, gMonth - 1, gDay));
    const dayName = weekDays[(dateObj.getUTCDay() + 1) % 7];
    sidebarTitle.textContent = `${dayName}، ${day} ${persianMonths[month - 1]} ${year}`;
    
    eventsSidebar.classList.add('show');
}

function closeEventsSidebar() { eventsSidebar.classList.remove('show'); }
function openAddEventModal(year, month, day) {
    modalDate.textContent = `${day} ${persianMonths[month - 1]} ${year}`;
    eventTitleInput.value = '';
    modal.style.display = 'flex';
    modal.dataset.year = year;
    modal.dataset.month = month;
    modal.dataset.day = day;
    eventTitleInput.focus();
}
function closeModal() { modal.style.display = 'none'; }

// --- EVENT HANDLERS ---
function handleDayClick(e) {
    const dayElement = e.currentTarget;
    const { year, month, day } = dayElement.dataset;
    
    selectedDate = { year: +year, month: +month, day: +day };
    renderCalendar();
    showEventsForDay(+year, +month, +day);
}

function handleDayDblClick(e) {
    const { year, month, day } = e.currentTarget.dataset;
    openAddEventModal(+year, +month, +day);
}

function handleSaveEvent() {
    const title = eventTitleInput.value.trim();
    if (title) {
        const { year, month, day } = modal.dataset;
        addEvent(+year, +month, +day, title);
        closeModal();
        renderCalendar();
        showEventsForDay(+year, +month, +day);
    }
}

function navigate(deltaMonth, deltaYear) {
    displayMonth += deltaMonth;
    displayYear += deltaYear;

    if (displayMonth > 12) { displayMonth = 1; displayYear++; }
    if (displayMonth < 1) { displayMonth = 12; displayYear--; }
    
    selectedDate = null;
    renderCalendar();
    closeEventsSidebar();
}

// --- INITIALIZATION & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    loadUserEvents();
    renderCalendar();

    document.getElementById('prev-year').addEventListener('click', () => navigate(0, -1));
    document.getElementById('prev-month').addEventListener('click', () => navigate(-1, 0));
    document.getElementById('next-month').addEventListener('click', () => navigate(1, 0));
    document.getElementById('next-year').addEventListener('click', () => navigate(0, 1));
    
    document.getElementById('today-btn').addEventListener('click', () => {
        displayYear = currentYear;
        displayMonth = currentMonth;
        navigate(0, 0);
    });

    document.getElementById('save-event').addEventListener('click', handleSaveEvent);
    document.getElementById('cancel-event').addEventListener('click', closeModal);
    document.getElementById('close-sidebar-btn').addEventListener('click', closeEventsSidebar);

    document.addEventListener('click', (e) => {
        if (!eventsSidebar.contains(e.target) && !e.target.closest('.day')) {
            closeEventsSidebar();
        }
    });
    
    eventTitleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSaveEvent();
    });
});