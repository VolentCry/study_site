// --- 1. TABS SWITCHER ---
document.addEventListener('DOMContentLoaded', () => {
    const tabBtnStudy = document.getElementById('tab-btn-study');
    const tabBtnOverview = document.getElementById('tab-btn-overview');
    const tabBtnRanks = document.getElementById('tab-btn-ranks');
    const tabBtnAchievements = document.getElementById('tab-btn-achievements') || document.getElementById('achievements-open');
    const tabBtnUpgrade = document.getElementById('tab-btn-upgrade');
    const tabBtnDropdownTrigger = document.getElementById('tab-btn-dropdown-trigger');
    const tabDropdown = document.getElementById('profile-tab-dropdown');
    const dropdownLabel = document.getElementById('profile-dropdown-label');
    const dropdownIcon = document.getElementById('profile-dropdown-icon');
    const dropdownMenu = document.getElementById('profile-tab-dropdown-menu');
    const tabContentStudy = document.getElementById('tab-content-study');
    const tabContentOverview = document.getElementById('tab-content-overview');
    const tabContentRanks = document.getElementById('tab-content-ranks');
    const tabContentAchievements = document.getElementById('tab-content-achievements');
    const tabContentUpgrade = document.getElementById('tab-content-upgrade');
    const trainerRanksContainer = document.getElementById('trainer-ranks-container');
    const ranksOpenBtn = document.getElementById('ranks-open-btn');
    const heroMedalsBtn = document.getElementById('hero-medals-btn');

    document.getElementById('btn-open-methodical-plan')?.addEventListener('click', () => {
        if (window.MethodicalPlanManager) {
            window.MethodicalPlanManager.openModal();
        }
    });

    // --- TRAINER RANKS FILTER & SEARCH SYSTEM ---
    const trainerFilterState = {
        subject: 'all',
        classNum: 'all',
        search: ''
    };

    function initTrainerRanksFilter(container) {
        if (!container) return;
        const gridEl = container.querySelector('.trainer-grid-list');
        const summaryEl = container.querySelector('.trainer-ranks-summary');
        if (!gridEl) return;

        // Clean up any previous instances
        const existingFilter = container.querySelector('.trainer-filter-bar');
        if (existingFilter) existingFilter.remove();
        const existingEmpty = container.querySelector('.trainer-filter-empty');
        if (existingEmpty) existingEmpty.remove();

        const trainers = (window.TrainerTracker && typeof window.TrainerTracker.getAllTrainers === 'function')
            ? window.TrainerTracker.getAllTrainers()
            : [];

        const cards = Array.from(gridEl.querySelectorAll('.trainer-item-card'));
        cards.forEach(card => {
            const giftBtn = card.querySelector('.trainer-gift-btn');
            const trainerId = giftBtn ? giftBtn.getAttribute('data-trainer-id') : null;
            const trainer = trainers.find(t => t.id === trainerId);

            const subject = (trainer && trainer.subject) ? trainer.subject : 'Математика';
            const classNum = (trainer && trainer.classNum) ? trainer.classNum : '';
            const titleText = (card.querySelector('.trainer-card-name')?.textContent || '').trim();
            const descText = (card.querySelector('.trainer-card-desc')?.textContent || '').trim();
            const badgeText = (card.querySelector('.trainer-card-badge')?.textContent || '').trim();

            card.dataset.trainerId = trainerId || '';
            card.dataset.subject = subject;
            card.dataset.classNum = classNum;
            card.dataset.search = [
                trainerId || '',
                subject,
                classNum,
                titleText,
                descText,
                badgeText,
                trainer ? trainer.shortName : '',
                trainer ? trainer.category : ''
            ].join(' ').toLowerCase();
        });

        // Compute counts
        const countTotal = trainers.length || cards.length;
        const countMath = trainers.filter(t => t.subject === 'Математика').length || cards.length;
        const countPhys = trainers.filter(t => t.subject === 'Физика').length;
        const countRus = trainers.filter(t => t.subject === 'Русский язык').length;
        const countEng = trainers.filter(t => t.subject === 'Английский').length;

        const countClass4 = trainers.filter(t => t.classNum === '4 класс' || t.classNum === '4-5 класс').length;
        const countClass45 = trainers.filter(t => t.classNum === '4-5 класс').length;
        const countClass9 = trainers.filter(t => t.classNum === '9 класс').length;

        // Filter bar element
        const filterBar = document.createElement('div');
        filterBar.className = 'trainer-filter-bar';
        filterBar.setAttribute('role', 'search');
        filterBar.setAttribute('aria-label', 'Фильтры тренажёров по предмету и классу');

        filterBar.innerHTML = `
            <div class="trainer-filter-top">
                <div class="trainer-search-wrap">
                    <span class="trainer-search-icon" aria-hidden="true">🔍</span>
                    <input type="text" 
                        class="trainer-search-input" 
                        placeholder="Поиск тренажёра по названию, теме или описанию..." 
                        aria-label="Поиск тренажёра"
                        value="${trainerFilterState.search.replace(/"/g, '&quot;')}"
                        autocomplete="off"
                        spellcheck="false">
                    <button type="button" class="trainer-search-clear" title="Очистить поиск" aria-label="Очистить поиск" style="${trainerFilterState.search ? '' : 'display: none;'}">✕</button>
                </div>
                <div class="trainer-filter-info">
                    <span class="trainer-filter-counter" id="trainer-filter-counter">Найдено: ${cards.length} из ${cards.length}</span>
                    <button type="button" class="trainer-filter-reset" id="trainer-filter-reset" style="display: none;" title="Сбросить фильтры и поиск">
                        <span aria-hidden="true">🔄</span>
                        <span>Сбросить</span>
                    </button>
                </div>
            </div>

            <div class="trainer-filter-group" data-filter-type="subject">
                <span class="trainer-filter-label">Предмет:</span>
                <div class="trainer-filter-pills" role="radiogroup" aria-label="Выбор предмета">
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'all' ? 'active' : ''}" data-subject="all" role="radio" aria-checked="${trainerFilterState.subject === 'all'}">
                        <span>Все предметы</span>
                        <span class="trainer-pill-count">(${countTotal})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Математика' ? 'active' : ''}" data-subject="Математика" role="radio" aria-checked="${trainerFilterState.subject === 'Математика'}">
                        <span>📐 Математика</span>
                        <span class="trainer-pill-count">(${countMath})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Физика' ? 'active' : ''}" data-subject="Физика" role="radio" aria-checked="${trainerFilterState.subject === 'Физика'}">
                        <span>⚡ Физика</span>
                        <span class="trainer-pill-count">(${countPhys})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Русский язык' ? 'active' : ''}" data-subject="Русский язык" role="radio" aria-checked="${trainerFilterState.subject === 'Русский язык'}">
                        <span>📖 Русский язык</span>
                        <span class="trainer-pill-count">(${countRus})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Английский' ? 'active' : ''}" data-subject="Английский" role="radio" aria-checked="${trainerFilterState.subject === 'Английский'}">
                        <span>🇬🇧 Английский</span>
                        <span class="trainer-pill-count">(${countEng})</span>
                    </button>
                </div>
            </div>

            <div class="trainer-filter-group" data-filter-type="class">
                <span class="trainer-filter-label">Класс:</span>
                <div class="trainer-filter-pills" role="radiogroup" aria-label="Выбор класса">
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.classNum === 'all' ? 'active' : ''}" data-class="all" role="radio" aria-checked="${trainerFilterState.classNum === 'all'}">
                        <span>Все классы</span>
                        <span class="trainer-pill-count">(${countTotal})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.classNum === '4' ? 'active' : ''}" data-class="4" role="radio" aria-checked="${trainerFilterState.classNum === '4'}">
                        <span>🎒 4 класс</span>
                        <span class="trainer-pill-count">(${countClass4})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.classNum === '4-5' ? 'active' : ''}" data-class="4-5" role="radio" aria-checked="${trainerFilterState.classNum === '4-5'}">
                        <span>⚡ 4–5 класс</span>
                        <span class="trainer-pill-count">(${countClass45})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.classNum === '9' ? 'active' : ''}" data-class="9" role="radio" aria-checked="${trainerFilterState.classNum === '9'}">
                        <span>🎓 9 класс (ОГЭ)</span>
                        <span class="trainer-pill-count">(${countClass9})</span>
                    </button>
                </div>
            </div>
        `;

        // Empty state element
        const emptyCard = document.createElement('div');
        emptyCard.className = 'trainer-filter-empty';
        emptyCard.id = 'trainer-filter-empty';
        emptyCard.style.display = 'none';
        emptyCard.innerHTML = `
            <div class="trainer-empty-icon" aria-hidden="true">🔍</div>
            <h4 class="trainer-empty-title">Тренажёры не найдены</h4>
            <p class="trainer-empty-desc">
                По выбранным предмету, классу или запросу ничего не нашлось. Попробуйте сбросить фильтры или выбрать другой класс.
            </p>
            <button type="button" class="trainer-empty-reset-btn">
                <span aria-hidden="true">🔄</span>
                <span>Сбросить фильтры</span>
            </button>
        `;

        // Insert into DOM
        if (summaryEl && summaryEl.parentNode) {
            summaryEl.parentNode.insertBefore(filterBar, gridEl);
        } else {
            gridEl.parentNode.insertBefore(filterBar, gridEl);
        }
        gridEl.parentNode.insertBefore(emptyCard, gridEl.nextSibling);

        const searchInput = filterBar.querySelector('.trainer-search-input');
        const searchClear = filterBar.querySelector('.trainer-search-clear');
        const counterEl = filterBar.querySelector('#trainer-filter-counter');
        const resetBtn = filterBar.querySelector('#trainer-filter-reset');
        const emptyResetBtn = emptyCard.querySelector('.trainer-empty-reset-btn');
        const subjectPills = filterBar.querySelectorAll('[data-subject]');
        const classPills = filterBar.querySelectorAll('[data-class]');

        function applyFilters() {
            const query = trainerFilterState.search.trim().toLowerCase();
            const activeSubject = trainerFilterState.subject;
            const activeClass = trainerFilterState.classNum;

            let visibleCount = 0;

            cards.forEach(card => {
                const cardSubject = card.dataset.subject || '';
                const cardClass = card.dataset.classNum || '';
                const searchBlob = card.dataset.search || '';

                // Subject check
                let matchSubject = true;
                if (activeSubject !== 'all') {
                    matchSubject = (cardSubject.toLowerCase() === activeSubject.toLowerCase());
                }

                // Class check
                let matchClass = true;
                if (activeClass === '4') {
                    matchClass = (cardClass === '4 класс' || cardClass === '4-5 класс');
                } else if (activeClass === '4-5') {
                    matchClass = (cardClass === '4-5 класс');
                } else if (activeClass === '9') {
                    matchClass = (cardClass === '9 класс');
                }

                // Search check
                let matchSearch = true;
                if (query) {
                    matchSearch = searchBlob.includes(query);
                }

                const isMatch = matchSubject && matchClass && matchSearch;
                if (isMatch) {
                    card.classList.remove('is-filtered-out');
                    visibleCount++;
                } else {
                    card.classList.add('is-filtered-out');
                }
            });

            // Update counter
            if (counterEl) {
                counterEl.textContent = `Найдено: ${visibleCount} из ${cards.length}`;
            }

            // Toggle empty state and grid visibility
            if (visibleCount === 0) {
                emptyCard.style.display = 'flex';
                gridEl.style.display = 'none';
            } else {
                emptyCard.style.display = 'none';
                gridEl.style.display = 'grid';
            }

            // Toggle reset button
            const hasActiveFilter = (activeSubject !== 'all' || activeClass !== 'all' || query.length > 0);
            if (resetBtn) {
                resetBtn.style.display = hasActiveFilter ? 'inline-flex' : 'none';
            }

            // Toggle search clear icon
            if (searchClear) {
                searchClear.style.display = query.length > 0 ? 'grid' : 'none';
            }
        }

        function resetAllFilters() {
            trainerFilterState.subject = 'all';
            trainerFilterState.classNum = 'all';
            trainerFilterState.search = '';

            if (searchInput) {
                searchInput.value = '';
            }

            subjectPills.forEach(pill => {
                const isAll = pill.getAttribute('data-subject') === 'all';
                pill.classList.toggle('active', isAll);
                pill.setAttribute('aria-checked', isAll ? 'true' : 'false');
            });

            classPills.forEach(pill => {
                const isAll = pill.getAttribute('data-class') === 'all';
                pill.classList.toggle('active', isAll);
                pill.setAttribute('aria-checked', isAll ? 'true' : 'false');
            });

            applyFilters();
        }

        // Event listeners for pills
        subjectPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const subj = pill.getAttribute('data-subject');
                trainerFilterState.subject = subj;
                subjectPills.forEach(p => {
                    const isCur = p === pill;
                    p.classList.toggle('active', isCur);
                    p.setAttribute('aria-checked', isCur ? 'true' : 'false');
                });
                applyFilters();
            });
        });

        classPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const cls = pill.getAttribute('data-class');
                trainerFilterState.classNum = cls;
                classPills.forEach(p => {
                    const isCur = p === pill;
                    p.classList.toggle('active', isCur);
                    p.setAttribute('aria-checked', isCur ? 'true' : 'false');
                });
                applyFilters();
            });
        });

        // Event listeners for search
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                trainerFilterState.search = e.target.value;
                applyFilters();
            });
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    resetAllFilters();
                }
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                trainerFilterState.search = '';
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                applyFilters();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetAllFilters);
        }
        if (emptyResetBtn) {
            emptyResetBtn.addEventListener('click', resetAllFilters);
        }

        // Initial filter evaluation
        applyFilters();
    }

    function toggleDropdown(forceState) {
        if (!tabDropdown || !tabBtnDropdownTrigger) return;
        const willOpen = (typeof forceState === 'boolean') ? forceState : !tabDropdown.classList.contains('open');
        tabDropdown.classList.toggle('open', willOpen);
        tabBtnDropdownTrigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }

    function closeDropdown() {
        toggleDropdown(false);
    }

    function switchTab(tabName) {
        if (isParentUser()) return;
        const buttons = [tabBtnStudy, tabBtnOverview, tabBtnRanks, tabBtnAchievements, tabBtnUpgrade];
        const contents = [tabContentStudy, tabContentOverview, tabContentRanks, tabContentAchievements, tabContentUpgrade];

        const profileHero = document.querySelector('.profile-hero');
        const isHeroHidden = (tabName === 'ranks' || tabName === 'achievements' || tabName === 'upgrade');
        document.documentElement.classList.toggle('hide-profile-hero', isHeroHidden);
        if (profileHero) {
            profileHero.classList.toggle('hidden', isHeroHidden);
        }

        buttons.forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
        contents.forEach(content => {
            if (content) content.classList.add('hidden');
        });

        closeDropdown();

        const isSecondary = (tabName === 'ranks' || tabName === 'achievements' || tabName === 'upgrade');
        if (tabBtnDropdownTrigger) {
            tabBtnDropdownTrigger.classList.toggle('active', isSecondary);
            tabBtnDropdownTrigger.setAttribute('aria-selected', isSecondary ? 'true' : 'false');
        }

        if (tabName === 'overview') {
            if (tabBtnOverview) {
                tabBtnOverview.classList.add('active');
                tabBtnOverview.setAttribute('aria-selected', 'true');
            }
            if (dropdownLabel) dropdownLabel.textContent = 'Ещё';
            if (dropdownIcon) dropdownIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>';
            if (tabContentOverview) tabContentOverview.classList.remove('hidden');
            try {
                sessionStorage.setItem('profileActiveTab', 'overview');
                history.replaceState(null, '', '#overview');
            } catch (e) {}
        } else if (tabName === 'ranks') {
            if (tabBtnRanks) {
                tabBtnRanks.classList.add('active');
                tabBtnRanks.setAttribute('aria-selected', 'true');
            }
            if (dropdownLabel) dropdownLabel.innerHTML = '<span class="d-none-mobile">Серии и звания</span><span class="d-only-mobile">Звания</span>';
            if (dropdownIcon) dropdownIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>';
            if (tabContentRanks) tabContentRanks.classList.remove('hidden');

            if (window.TrainerTracker && trainerRanksContainer) {
                window.TrainerTracker.renderRanksSection(trainerRanksContainer);
                initTrainerRanksFilter(trainerRanksContainer);
            }
            try {
                sessionStorage.setItem('profileActiveTab', 'ranks');
                history.replaceState(null, '', '#ranks');
            } catch (e) {}
        } else if (tabName === 'achievements') {
            if (tabBtnAchievements) {
                tabBtnAchievements.classList.add('active');
                tabBtnAchievements.setAttribute('aria-selected', 'true');
            }
            if (dropdownLabel) dropdownLabel.textContent = 'Медали';
            if (dropdownIcon) dropdownIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>';
            if (tabContentAchievements) tabContentAchievements.classList.remove('hidden');

            if (typeof window.renderProfileAchievementsPage === 'function') {
                window.renderProfileAchievementsPage();
            }
            try {
                sessionStorage.setItem('profileActiveTab', 'achievements');
                history.replaceState(null, '', '#achievements');
            } catch (e) {}
        } else if (tabName === 'upgrade') {
            if (tabBtnUpgrade) {
                tabBtnUpgrade.classList.add('active');
                tabBtnUpgrade.setAttribute('aria-selected', 'true');
            }
            if (dropdownLabel) dropdownLabel.textContent = 'Прокачка';
            if (dropdownIcon) dropdownIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
            if (tabContentUpgrade) tabContentUpgrade.classList.remove('hidden');
            try {
                sessionStorage.setItem('profileActiveTab', 'upgrade');
                history.replaceState(null, '', '#upgrade');
            } catch (e) {}
        } else {
            // Default tab: study
            if (tabBtnStudy) {
                tabBtnStudy.classList.add('active');
                tabBtnStudy.setAttribute('aria-selected', 'true');
            }
            if (dropdownLabel) dropdownLabel.textContent = 'Ещё';
            if (dropdownIcon) dropdownIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>';
            if (tabContentStudy) tabContentStudy.classList.remove('hidden');
            loadStudyData();
            try {
                sessionStorage.setItem('profileActiveTab', 'study');
                history.replaceState(null, '', '#study');
            } catch (e) {}
        }
    }

    window.switchProfileTab = switchTab;

    if (tabBtnStudy) tabBtnStudy.addEventListener('click', () => switchTab('study'));
    if (tabBtnOverview) tabBtnOverview.addEventListener('click', () => switchTab('overview'));
    if (tabBtnRanks) tabBtnRanks.addEventListener('click', () => switchTab('ranks'));
    if (tabBtnAchievements) tabBtnAchievements.addEventListener('click', () => switchTab('achievements'));
    if (tabBtnUpgrade) tabBtnUpgrade.addEventListener('click', () => switchTab('upgrade'));
    if (ranksOpenBtn) ranksOpenBtn.addEventListener('click', () => switchTab('ranks'));
    if (heroMedalsBtn) heroMedalsBtn.addEventListener('click', () => {
        switchTab('achievements');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (tabBtnDropdownTrigger) {
        tabBtnDropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
        tabBtnDropdownTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(true);
                const firstItem = dropdownMenu?.querySelector('.profile-tab-dropdown-item');
                if (firstItem) firstItem.focus();
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });
    }

    if (dropdownMenu) {
        dropdownMenu.addEventListener('keydown', (e) => {
            const items = Array.from(dropdownMenu.querySelectorAll('.profile-tab-dropdown-item'));
            const curIndex = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[(curIndex + 1) % items.length];
                if (next) next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[(curIndex - 1 + items.length) % items.length];
                if (prev) prev.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                if (tabBtnDropdownTrigger) tabBtnDropdownTrigger.focus();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (tabDropdown && !tabDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    window.addEventListener('hashchange', () => {
        const hash = (window.location.hash || '').toLowerCase();
        if (hash === '#ranks') switchTab('ranks');
        else if (hash.includes('achieve') || hash.includes('medal')) switchTab('achievements');
        else if (hash === '#upgrade' || hash.includes('prokachka')) switchTab('upgrade');
        else if (hash === '#overview') switchTab('overview');
        else if (hash === '#study') switchTab('study');
    });

    
    // =========================================================================
    // STUDY & CALENDAR MODULE FOR STUDENT
    // =========================================================================
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    let currentCalDate = new Date();
    let monthScheduleData = null;
    let studentHomeworksData = [];
    let selectedDateStr = null;

    const calMonthTitle = document.getElementById('cal-month-title');
    const calDaysGrid = document.getElementById('calendar-days-grid');
    const calPrevBtn = document.getElementById('cal-prev-btn');
    const calNextBtn = document.getElementById('cal-next-btn');
    const calTodayBtn = document.getElementById('cal-today-btn');
    const nextLessonCard = document.getElementById('next-lesson-card');
    const nextLessonTitle = document.getElementById('next-lesson-title');
    const nextLessonTime = document.getElementById('next-lesson-time');
    const nextLessonClass = document.getElementById('next-lesson-class');
    const nextLessonTeacher = document.getElementById('next-lesson-teacher');
    const nextLessonActionWrap = document.getElementById('next-lesson-action-wrap');
    const dayDetailsDate = document.getElementById('day-details-date');
    const dayDetailsBadge = document.getElementById('day-details-badge');
    const dayDetailsContent = document.getElementById('day-details-content');
    const studentHomeworksList = document.getElementById('student-homeworks-list');
    const activeHwCount = document.getElementById('active-hw-count');

    if (calPrevBtn) {
        calPrevBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            fetchMonthSchedule();
        });
    }
    if (calNextBtn) {
        calNextBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            fetchMonthSchedule();
        });
    }
    if (calTodayBtn) {
        calTodayBtn.addEventListener('click', () => {
            currentCalDate = new Date();
            selectedDateStr = toDateKey(currentCalDate);
            fetchMonthSchedule();
        });
    }

    function toDateKey(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isTeacherUser() {
        if (window.AuthSync && typeof window.AuthSync.getUser === 'function') {
            const u = window.AuthSync.getUser();
            if (u && (u.role === 'teacher' || u.role === 'admin')) return true;
        }
        if (monthScheduleData && (monthScheduleData.role === 'teacher' || monthScheduleData.role === 'admin')) {
            return true;
        }
        return false;
    }

    async function loadStudyData() {
        if (!selectedDateStr) {
            selectedDateStr = toDateKey(new Date());
        }
        const isTeacher = isTeacherUser();
        if (isTeacher) {
            await fetchMonthSchedule();
            if (studentHomeworksList) {
                const hwCard = studentHomeworksList.closest('.study-card');
                if (hwCard) {
                    const titleSpan = hwCard.querySelector('.card-section-title span');
                    if (titleSpan) titleSpan.textContent = 'Панель преподавателя';
                    const counter = document.getElementById('active-hw-count');
                    if (counter) counter.style.display = 'none';
                    studentHomeworksList.innerHTML = `
                        <div style="text-align:center; padding:1.5rem 1rem;">
                            <div style="font-size:0.9rem; color:var(--muted); margin-bottom:1rem;">
                                Вы авторизованы как учитель. Управление домашними заданиями и проверка работ доступны в панели преподавателя.
                            </div>
                            <a href="teacher.html#grading" class="hw-action-btn hw-btn-primary" style="display:inline-flex; width:auto; padding:0.6rem 1.2rem; text-decoration:none;">
                                👩‍🏫 Перейти к проверке домашних заданий
                            </a>
                        </div>
                    `;
                }
            }
        } else {
            await Promise.all([fetchMonthSchedule(), fetchStudentHomeworks()]);
        }
    }

    async function fetchMonthSchedule() {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth() + 1;

        if (calMonthTitle) {
            const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
            calMonthTitle.textContent = `${monthNames[month - 1]} ${year}`;
        }

        try {
            const res = await fetch(`/api/schedule/month?year=${year}&month=${month}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.schedule) {
                monthScheduleData = data.schedule;
                renderCalendar();
                renderUpcomingHero();
                renderDayDetails(selectedDateStr || toDateKey(new Date()));
            }
        } catch(e) {
            console.error('Error fetching month schedule', e);
        }
    }

    async function fetchStudentHomeworks() {
        try {
            const res = await fetch('/api/student/homeworks', { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.homeworks) {
                studentHomeworksData = data.homeworks;
                renderStudentHomeworks();
            }
        } catch(e) {
            console.error('Error fetching student homeworks', e);
        }
    }

    function renderCalendar() {
        if (!calDaysGrid) return;
        calDaysGrid.innerHTML = '';

        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        let startWeekday = (firstDayOfMonth.getDay() + 6) % 7;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const todayKey = toDateKey(new Date());

        const lessonsByDate = {};
        const hwByDate = {};

        if (monthScheduleData && monthScheduleData.lessons) {
            monthScheduleData.lessons.forEach(l => {
                const raw = l.starts_at || l.scheduled_at || l.scheduledAt;
                if (!raw) return;
                const k = raw.slice(0, 10);
                if (!lessonsByDate[k]) lessonsByDate[k] = [];
                lessonsByDate[k].push(l);
            });
        }
        if (monthScheduleData && monthScheduleData.homeworks) {
            monthScheduleData.homeworks.forEach(h => {
                const raw = h.deadline || h.deadline_at;
                if (!raw) return;
                const k = raw.slice(0, 10);
                if (!hwByDate[k]) hwByDate[k] = [];
                hwByDate[k].push(h);
            });
        }

        for (let i = startWeekday - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const prevDate = new Date(year, month - 1, dayNum);
            const cellKey = toDateKey(prevDate);
            createDayCell(dayNum, cellKey, true, lessonsByDate[cellKey], hwByDate[cellKey]);
        }

        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
            const curDate = new Date(year, month, dayNum);
            const cellKey = toDateKey(curDate);
            createDayCell(dayNum, cellKey, false, lessonsByDate[cellKey], hwByDate[cellKey]);
        }

        const totalCells = startWeekday + daysInMonth;
        const nextMonthCells = totalCells <= 35 ? (35 - totalCells) : (42 - totalCells);
        for (let dayNum = 1; dayNum <= nextMonthCells; dayNum++) {
            const nextDate = new Date(year, month + 1, dayNum);
            const cellKey = toDateKey(nextDate);
            createDayCell(dayNum, cellKey, true, lessonsByDate[cellKey], hwByDate[cellKey]);
        }
    }

    function createDayCell(dayNum, dateKey, isOtherMonth, lessons, hws) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        if (isOtherMonth) cell.classList.add('other-month');

        const todayKey = toDateKey(new Date());
        if (dateKey === todayKey) cell.classList.add('is-today');
        if (dateKey === selectedDateStr) cell.classList.add('is-selected');

        let dotsHtml = '';
        if ((lessons && lessons.length > 0) || (hws && hws.length > 0)) {
            dotsHtml = '<div class="cal-dots-row">';
            if (lessons && lessons.length > 0) dotsHtml += '<span class="event-dot dot-lesson" title="Урок"></span>';
            if (hws && hws.length > 0) dotsHtml += '<span class="event-dot dot-hw" title="Д/З"></span>';
            dotsHtml += '</div>';
        }

        cell.innerHTML = `<span>${dayNum}</span>${dotsHtml}`;

        cell.addEventListener('click', () => {
            selectedDateStr = dateKey;
            document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('is-selected'));
            cell.classList.add('is-selected');
            renderDayDetails(dateKey);
        });

        calDaysGrid.appendChild(cell);
    }

    function renderUpcomingHero() {
        if (!nextLessonCard) return;

        // Priority: Use the server's global upcoming lesson, or find upcoming in month's lessons
        let next = monthScheduleData && monthScheduleData.upcomingLesson;
        if (!next) {
            const allLessons = (monthScheduleData && monthScheduleData.lessons) ? [...monthScheduleData.lessons] : [];
            const now = new Date();
            const futureLessons = allLessons
                .filter(l => {
                    const raw = l.starts_at || l.scheduled_at || l.scheduledAt;
                    return raw && (new Date(raw) >= new Date(now.getTime() - 2 * 3600000));
                })
                .sort((a, b) => {
                    const da = new Date(a.starts_at || a.scheduled_at || a.scheduledAt || 0);
                    const db = new Date(b.starts_at || b.scheduled_at || b.scheduledAt || 0);
                    return da - db;
                });
            if (futureLessons.length > 0) next = futureLessons[0];
        }

        if (!next) {
            nextLessonTitle.textContent = 'Нет запланированных уроков';
            nextLessonTime.textContent = 'Свободное время';
            nextLessonClass.textContent = 'Отличный повод потренироваться!';
            nextLessonTeacher.textContent = '';
            nextLessonActionWrap.innerHTML = `
                <a href="index.html#trainers" class="hw-action-btn hw-btn-secondary">
                    🎯 Перейти к тренажёрам
                </a>
            `;
            return;
        }

        const rawDate = next.starts_at || next.scheduled_at || next.scheduledAt;
        const d = rawDate ? new Date(rawDate) : new Date();
        const now = new Date();
        const isToday = toDateKey(d) === toDateKey(now);
        const tmrw = new Date(now.getTime() + 86400000);
        const isTmrw = toDateKey(d) === toDateKey(tmrw);

        let whenText = '';
        if (isToday) whenText = `Сегодня в ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
        else if (isTmrw) whenText = `Завтра в ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
        else whenText = d.toLocaleString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short', hour: '2-digit', minute: '2-digit' });

        const hwId = next.homework_id || next.homeworkId;
        const cName = next.class_name || next.className || '';
        const tName = next.teacher_name || next.teacherName || '';

        const isIndividual = Boolean(next.student_id);
        const indBadge = isIndividual ? '<span class="day-badge" style="background:rgba(251, 191, 36, 0.15); color:var(--accent-gold); border-color:rgba(251, 191, 36, 0.4); margin-left:8px; font-weight:700;">👤 Индивидуально (1-на-1)</span>' : '';

        nextLessonTitle.textContent = next.title;
        nextLessonTime.textContent = whenText;
        nextLessonClass.innerHTML = `🏫 ${escapeHtml(cName)}${indBadge}`;
        nextLessonTeacher.textContent = tName ? `Учитель: ${tName}` : '';

        if (hwId) {
            const isTeacher = isTeacherUser();
            const actionLabel = isTeacher ? '👀 Смотреть домашнее задание' : '📝 Решать домашнее задание';
            const noticeText = isTeacher ? 'К уроку прикреплено домашнее задание:' : 'К уроку прикреплено задание:';
            nextLessonActionWrap.innerHTML = `
                <div style="font-size:0.8rem; color:var(--muted); text-align:right;">${noticeText}</div>
                <a href="homework.html?id=${hwId}" class="hw-action-btn hw-btn-primary" style="text-decoration:none;">
                    ${actionLabel}
                </a>
            `;
        } else {
            nextLessonActionWrap.innerHTML = `
                <span class="day-badge" style="background:rgba(44, 230, 214, 0.1); color:var(--accent-cyan); border-color:rgba(44, 230, 214, 0.3);">
                    Урок запланирован
                </span>
            `;
        }
    }

    function renderDayDetails(dateKey) {
        if (!dayDetailsContent) return;

        const [y, m, d] = dateKey.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        dayDetailsDate.textContent = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });

        const dayLessons = (monthScheduleData && monthScheduleData.lessons)
            ? monthScheduleData.lessons.filter(l => {
                const raw = l.starts_at || l.scheduled_at || l.scheduledAt;
                return raw && raw.slice(0, 10) === dateKey;
            })
            : [];

        const dayHws = (monthScheduleData && monthScheduleData.homeworks)
            ? monthScheduleData.homeworks.filter(h => {
                const raw = h.deadline || h.deadline_at;
                return raw && raw.slice(0, 10) === dateKey;
            })
            : [];

        const totalEvents = dayLessons.length + dayHws.length;
        dayDetailsBadge.textContent = `${totalEvents} ${totalEvents === 1 ? 'событие' : (totalEvents >= 2 && totalEvents <= 4 ? 'события' : 'событий')}`;

        if (totalEvents === 0) {
            dayDetailsContent.innerHTML = `
                <div style="color:var(--muted); font-size:0.88rem; text-align:center; padding:1.25rem 0;">
                    На этот день занятий и сроков сдачи нет.
                </div>
            `;
            return;
        }

        let htmlItems = '';

        dayLessons.forEach(les => {
            const rawDate = les.starts_at || les.scheduled_at || les.scheduledAt;
            const t = rawDate ? new Date(rawDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '—';
            const hwId = les.homework_id || les.homeworkId;
            const cName = les.class_name || les.className || '';
            const desc = les.notes || les.description || '';
            let hwLine = '';
            if (hwId) {
                const isTeacher = isTeacherUser();
                const linkText = isTeacher ? '👀 Смотреть домашнее задание →' : '📝 Прикреплена домашка →';
                hwLine = `
                    <div style="margin-top:0.35rem;">
                        <a href="homework.html?id=${hwId}" style="color:var(--accent); font-weight:700; font-size:0.82rem; text-decoration:none;">
                            ${linkText}
                        </a>
                    </div>
                `;
            }
            const isInd = Boolean(les.student_id);
            const indBadge = isInd ? '<span style="font-size:0.72rem; padding:2px 7px; border-radius:9999px; background:rgba(251, 191, 36, 0.15); color:var(--accent-gold); font-weight:700; margin-left:6px; border:1px solid rgba(251, 191, 36, 0.35);">👤 1-на-1</span>' : '';
            const isCompleted = Boolean(les.isCompleted || les.is_completed);
            const completedBadge = isCompleted ? '<span style="font-size:0.72rem; padding:2px 7px; border-radius:9999px; background:rgba(16, 185, 129, 0.15); color:var(--accent-emerald); font-weight:700; margin-left:6px; border:1px solid rgba(16, 185, 129, 0.35);">✅ Проведено</span>' : '';

            htmlItems += `
                <div class="day-event-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="day-event-time">⏰ ${t}</span>
                        <div>
                            <span class="lesson-class-badge" style="font-size:0.75rem;">${escapeHtml(cName)}${indBadge}</span>
                            ${completedBadge}
                        </div>
                    </div>
                    <div class="day-event-title">${escapeHtml(les.title)}</div>
                    ${desc ? `<div style="font-size:0.8rem; color:var(--muted);">${escapeHtml(desc)}</div>` : ''}
                    ${hwLine}
                </div>
            `;
        });

        dayHws.forEach(h => {
            const rawDate = h.deadline || h.deadline_at;
            const t = rawDate ? new Date(rawDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '—';
            htmlItems += `
                <div class="day-event-card" style="border-left: 3px solid var(--accent);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.8rem; font-weight:700; color:var(--accent);">Дедлайн до ${t}</span>
                        <span style="font-size:0.75rem; color:var(--muted);">${escapeHtml(h.subject || '')}</span>
                    </div>
                    <div class="day-event-title">${escapeHtml(h.title)}</div>
                    <div style="margin-top:0.35rem;">
                        <a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-primary" style="height:28px; font-size:0.75rem; text-decoration:none;">
                            ${isTeacherUser() ? '👀 Смотреть домашнее задание' : 'Решать задание'}
                        </a>
                    </div>
                </div>
            `;
        });

        dayDetailsContent.innerHTML = htmlItems;
    }

    function renderStudentHomeworks() {
        if (!studentHomeworksList) return;
        activeHwCount.textContent = studentHomeworksData.length;

        if (studentHomeworksData.length === 0) {
            studentHomeworksList.innerHTML = `
                <div style="text-align:center; padding:1.75rem 1rem; color:var(--muted); font-size:0.88rem;">
                    Вам пока не назначено домашних заданий.<br>Загляните позже или решайте задания в тренажёрах!
                </div>
            `;
            return;
        }

        studentHomeworksList.innerHTML = studentHomeworksData.map(h => {
            const sub = h.submission || {};
            const status = sub.status || 'not_started';
            let statusBadge = '';
            let actionBtn = '';

            if (status === 'checked') {
                statusBadge = `<span class="badge badge-status status-checked">Оценка: ${sub.score}/${sub.maxScore || sub.max_score || h.tasksCount || 0}</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-secondary">Результаты и разбор</a>`;
            } else if (status === 'submitted') {
                statusBadge = `<span class="badge badge-status status-submitted">На проверке</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-secondary">Смотреть ответы</a>`;
            } else {
                const hasDraft = (sub.answers && Object.keys(sub.answers).length > 0);
                statusBadge = hasDraft
                    ? `<span class="badge badge-status" style="background:rgba(44,230,214,0.15); color:var(--accent-cyan); border:1px solid rgba(44,230,214,0.3);">В процессе</span>`
                    : `<span class="badge badge-status status-pending">Не начато</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-primary">${hasDraft ? 'Продолжить' : 'Приступить'}</a>`;
            }

            const createdStr = (h.created_at || h.createdAt)
                ? new Date(h.created_at || h.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : '—';
            const deadlineStr = (h.deadline || h.deadlineAt)
                ? new Date(h.deadline || h.deadlineAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : 'Бессрочно';

            return `
                <div class="student-hw-card" id="student-hw-${h.id}">
                    <div class="student-hw-card-top">
                        <div>
                            <div class="student-hw-title">${escapeHtml(h.title)}</div>
                            <div class="student-hw-meta">
                                <span style="color:var(--accent-cyan); font-weight:700;">${escapeHtml(h.subject)}</span>
                                <span title="Дата выдачи задания">📅 Выдано: ${createdStr}</span>
                                <span title="Срок сдачи задания">⏳ Срок: ${deadlineStr}</span>
                                <span>${h.tasksCount || (h.tasks ? h.tasks.length : 0)} зад.</span>
                            </div>
                        </div>
                        ${statusBadge}
                    </div>
                    <div style="display:flex; justify-content:flex-end;">
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    const storedTab = sessionStorage.getItem('profileActiveTab');
    const hash = (window.location.hash || '').toLowerCase();
    const initialTab = (hash === '#ranks' || storedTab === 'ranks') 
        ? 'ranks' 
        : (hash.includes('achieve') || hash.includes('medal') || storedTab === 'achievements')
            ? 'achievements'
            : (hash === '#upgrade' || hash.includes('prokachka') || storedTab === 'upgrade')
                ? 'upgrade'
                : (hash === '#overview' || storedTab === 'overview')
                    ? 'overview'
                    : 'study';

    checkAndApplyRoleView().then(() => {
        if (!isParentUser()) {
            switchTab(initialTab);
        }
    });
});

// =========================================================================
// PARENT DASHBOARD & CHILD INTEGRATION
// =========================================================================
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDateTimeStr(isoStr) {
    if (!isoStr) return '—';
    try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const day = d.getDate();
        const m = months[d.getMonth()];
        const y = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${day} ${m} ${y}, ${hh}:${mm}`;
    } catch(e) {
        return isoStr;
    }
}

function isParentUser() {
    if (window.AuthSync && typeof window.AuthSync.getUser === 'function') {
        const u = window.AuthSync.getUser();
        if (u && u.role === 'parent') return true;
    }
    return false;
}

function updateStudentParentCodeSettings(user) {
    const section = document.getElementById('student-parent-code-section');
    const divider = document.getElementById('student-parent-code-divider');
    const codeEl = document.getElementById('settings-student-parent-code');
    const copyBtn = document.getElementById('settings-copy-parent-code-btn');

    // Show parent code section ONLY for students (hide for teachers, admins, parents, or logged-out users)
    if (!user || user.role !== 'student') {
        if (section) section.style.display = 'none';
        if (divider) divider.style.display = 'none';
        return;
    }

    if (section) section.style.display = '';
    if (divider) divider.style.display = '';

    const pCode = user.parentCode || user.parent_code;
    if (codeEl) {
        codeEl.textContent = pCode || 'STU-—————';
    }

    if (copyBtn && pCode && !copyBtn.dataset.bound) {
        copyBtn.dataset.bound = 'true';
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(pCode);
                const span = copyBtn.querySelector('span');
                if (span) span.textContent = 'Скопировано! ✓';
                copyBtn.style.color = '#10b981';
                setTimeout(() => {
                    if (span) span.textContent = 'Скопировать код';
                    copyBtn.style.color = '';
                }, 2000);
                if (window.AuthSync && typeof window.AuthSync.showToast === 'function') {
                    window.AuthSync.showToast('Код для родителей скопирован', 'success');
                }
            } catch(e) {
                prompt('Скопируйте код для родителей:', pCode);
            }
        });
    }
}

async function checkAndApplyRoleView() {
    let u = window.AuthSync && typeof window.AuthSync.getUser === 'function' ? window.AuthSync.getUser() : null;
    if (!u) {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            const data = await res.json();
            if (data.loggedIn && data.user) {
                u = data.user;
            }
        } catch(e) {}
    }

    const tabsNav = document.querySelector('.profile-tabs-nav');
    const heroSection = document.querySelector('.profile-hero');
    const parentDashboard = document.getElementById('parent-dashboard-view');
    const studentContents = [
        document.getElementById('tab-content-study'),
        document.getElementById('tab-content-overview'),
        document.getElementById('tab-content-ranks'),
        document.getElementById('tab-content-achievements'),
        document.getElementById('tab-content-upgrade')
    ];

    if (u && u.role === 'parent') {
        if (tabsNav) tabsNav.style.display = 'none';
        if (heroSection) heroSection.style.display = 'none';
        document.documentElement.classList.add('hide-profile-hero');
        studentContents.forEach(c => { if (c) c.classList.add('hidden'); });

        if (parentDashboard) {
            parentDashboard.classList.remove('hidden');
        }
        initParentDashboard(u);
    } else {
        if (tabsNav) tabsNav.style.display = '';
        if (heroSection) heroSection.style.display = '';
        if (parentDashboard) parentDashboard.classList.add('hidden');
        updateStudentParentCodeSettings(u);
    }
}

async function initParentDashboard(user) {
    const greetingTitle = document.getElementById('parent-greeting-title');
    const childBox = document.getElementById('parent-child-box');
    const kpiCompleted = document.getElementById('kpi-completed-count');
    const kpiPaid = document.getElementById('kpi-paid-count');
    const kpiUnpaid = document.getElementById('kpi-unpaid-count');
    const kpiUnpaidCard = document.getElementById('kpi-unpaid-card');
    const lessonsCounter = document.getElementById('parent-lessons-counter');
    const scheduleContent = document.getElementById('parent-schedule-content');
    const hwCounter = document.getElementById('parent-hw-counter');
    const hwContent = document.getElementById('parent-homeworks-content');
    const planContent = document.getElementById('parent-plan-content');

    if (greetingTitle && user) {
        greetingTitle.textContent = `Кабинет родителя · ${user.displayName || user.username}`;
    }

    try {
        const res = await fetch('/api/parent/dashboard', { cache: 'no-store' });
        const data = await res.json();

        if (!data.success || !data.dashboard) {
            if (scheduleContent) scheduleContent.innerHTML = `<div class="parent-empty-state">Ошибка загрузки данных кабинета.</div>`;
            return;
        }

        const dash = data.dashboard;

        // 1. KPI CARDS
        if (dash.kpi) {
            if (kpiCompleted) kpiCompleted.textContent = dash.kpi.completedLessons || 0;
            if (kpiPaid) kpiPaid.textContent = dash.kpi.paidLessons || 0;
            if (kpiUnpaid) {
                const unpaid = dash.kpi.unpaidLessons || 0;
                kpiUnpaid.textContent = unpaid;
                if (kpiUnpaidCard) {
                    kpiUnpaidCard.classList.toggle('has-unpaid', unpaid > 0);
                }
            }
        }

        // 2. CHILD BOX
        if (childBox) {
            if (dash.linked && dash.student) {
                const s = dash.student;
                const initial = (s.displayName || s.username || 'У').charAt(0).toUpperCase();
                childBox.innerHTML = `
                    <div class="parent-child-status">
                        <div class="parent-child-meta">
                            <div class="parent-child-avatar">${escapeHtml(initial)}</div>
                            <div>
                                <div class="parent-child-name">${escapeHtml(s.displayName || s.username)}</div>
                                <div class="parent-child-sub">@${escapeHtml(s.username)} · Код: <span class="parent-child-code-badge">${escapeHtml(s.parentCode || '')}</span></div>
                            </div>
                        </div>
                        <button type="button" id="btn-change-child" class="settings-btn settings-btn-secondary" style="padding:6px 12px; font-size:0.8rem; min-height:auto;">
                            Привязать ещё код
                        </button>
                    </div>
                    <div id="parent-inline-link-form" class="hidden" style="margin-top:12px; padding-top:12px; border-top:1px solid var(--line);">
                        <div style="font-size:0.82rem; color:var(--muted); margin-bottom:6px;">Введите код ребёнка STU-XXXXX:</div>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="parent-inline-code-input" class="settings-name-input" placeholder="STU-XXXXX" style="text-transform:uppercase; font-family:monospace; font-weight:700;">
                            <button type="button" id="parent-inline-link-btn" class="settings-btn settings-btn-primary">Привязать</button>
                        </div>
                        <div id="parent-inline-link-msg" style="font-size:0.78rem; margin-top:4px;"></div>
                    </div>
                `;

                const changeBtn = childBox.querySelector('#btn-change-child');
                const inlineForm = childBox.querySelector('#parent-inline-link-form');
                if (changeBtn && inlineForm) {
                    changeBtn.addEventListener('click', () => {
                        inlineForm.classList.toggle('hidden');
                    });
                }
                bindParentInlineLinkForm(childBox);
            } else {
                childBox.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="font-weight:700; font-size:0.92rem; color:var(--ink);">Привяжите аккаунт ребёнка</div>
                        <div style="font-size:0.8rem; color:var(--muted);">Введите индивидуальный код STU-XXXXX из профиля ребёнка:</div>
                        <div style="display:flex; gap:8px; margin-top:4px;">
                            <input type="text" id="parent-inline-code-input" class="settings-name-input" placeholder="Например: STU-83H75" style="text-transform:uppercase; font-family:monospace; font-weight:700;">
                            <button type="button" id="parent-inline-link-btn" class="settings-btn settings-btn-primary">Привязать</button>
                        </div>
                        <div id="parent-inline-link-msg" style="font-size:0.78rem; margin-top:4px;"></div>
                    </div>
                `;
                bindParentInlineLinkForm(childBox);
            }
        }

        // 3. SCHEDULE
        if (lessonsCounter) {
            lessonsCounter.textContent = `${(dash.lessons || []).length} занятий`;
        }
        if (scheduleContent) {
            const lessons = dash.lessons || [];
            if (lessons.length === 0) {
                scheduleContent.innerHTML = `<div class="parent-empty-state">У ребёнка пока нет добавленных занятий в расписании.</div>`;
            } else {
                scheduleContent.innerHTML = `
                    <div class="parent-schedule-list">
                        ${lessons.map(les => {
                            const dateStr = formatDateTimeStr(les.scheduledAt);
                            const isComp = les.isCompleted;
                            const isPaid = les.isPaid;
                            return `
                                <div class="parent-lesson-item">
                                    <div class="parent-lesson-main">
                                        <div class="parent-lesson-title">${escapeHtml(les.title || 'Занятие')}</div>
                                        <div class="parent-lesson-meta">
                                            <span class="parent-lesson-time">🕒 ${dateStr} (${les.durationMin || 60} мин)</span>
                                            ${les.className ? `<span>Группа: ${escapeHtml(les.className)}</span>` : ''}
                                            ${les.teacherName ? `<span>Преподаватель: ${escapeHtml(les.teacherName)}</span>` : ''}
                                        </div>
                                    </div>
                                    <div class="parent-lesson-badges">
                                        <span class="parent-status-pill ${isComp ? 'status-conducted' : 'status-planned'}">
                                            ${isComp ? '✅ Проведено' : '⏳ Запланировано'}
                                        </span>
                                        <span class="parent-status-pill ${isPaid ? 'status-paid' : 'status-unpaid'}">
                                            ${isPaid ? '💳 Оплачено' : '⏳ Не оплачено'}
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        }

        // 4. HOMEWORKS
        if (hwCounter) {
            hwCounter.textContent = `${(dash.homeworks || []).length} заданий`;
        }
        if (hwContent) {
            const homeworks = dash.homeworks || [];
            if (homeworks.length === 0) {
                hwContent.innerHTML = `<div class="parent-empty-state">Домашних заданий для ребёнка пока не назначено.</div>`;
            } else {
                const statusLabels = {
                    submitted: 'Сдано',
                    checked: 'Проверено',
                    draft: 'Черновик',
                    not_started: 'Не начато'
                };
                hwContent.innerHTML = `
                    <div class="parent-hw-grid">
                        ${homeworks.map(hw => {
                            const sub = hw.submission || {};
                            const st = sub.status || 'not_started';
                            const stLabel = statusLabels[st] || st;
                            const dStr = hw.deadlineAt ? formatDateTimeStr(hw.deadlineAt) : 'Без дедлайна';
                            return `
                                <div class="parent-hw-card">
                                    <div class="parent-hw-head">
                                        <div class="parent-hw-title">${escapeHtml(hw.title)}</div>
                                        <span class="parent-hw-subject">${escapeHtml(hw.subject || 'Предмет')}</span>
                                    </div>
                                    <div class="parent-hw-meta">
                                        <span>Срок: ${dStr}</span>
                                        <span class="parent-status-pill ${st === 'checked' ? 'status-conducted' : (st === 'submitted' ? 'status-paid' : 'status-planned')}">${stLabel}</span>
                                    </div>
                                    ${st === 'checked' ? `
                                        <div style="font-size:0.82rem; padding:8px 10px; background:rgba(16,185,129,0.08); border-radius:8px; border:1px solid rgba(16,185,129,0.2);">
                                            Балл: <strong class="parent-hw-score">${sub.score || 0} / ${sub.maxScore || 0}</strong>
                                            ${sub.teacherFeedback ? `<div style="margin-top:4px; color:var(--muted); font-size:0.78rem;">Отзыв: «${escapeHtml(sub.teacherFeedback)}»</div>` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        }

        // 5. READ-ONLY METHODICAL PLAN
        if (planContent) {
            const plans = dash.methodicalPlans || [];
            if (plans.length === 0) {
                planContent.innerHTML = `<div class="parent-empty-state">Преподаватель ещё не составил методический план для ребёнка.</div>`;
            } else {
                const plan = plans[0];
                const pct = plan.conductedPercent || 0;
                const monthlyLessons = plan.monthlyLessons || {};
                const monthlyCounts = plan.monthlyCounts || {};
                const months = Object.keys(monthlyLessons);

                planContent.innerHTML = `
                    <div class="parent-plan-container">
                        <div class="parent-plan-summary">
                            <h3 class="parent-plan-title">${escapeHtml(plan.title)}</h3>
                            <div class="parent-plan-details-row">
                                <span>Предмет: <strong style="color:var(--ink);">${escapeHtml(plan.subject)}</strong></span>
                                <span>Учебный год: <strong style="color:var(--ink);">${escapeHtml(plan.academicYear)}</strong></span>
                                ${plan.teacherName ? `<span>Преподаватель: <strong style="color:var(--ink);">${escapeHtml(plan.teacherName)}</strong></span>` : ''}
                            </div>
                            <div class="parent-plan-progress-wrap">
                                <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                                    <span>Пройдено уроков: <strong>${plan.totalConducted || 0} из ${plan.totalPlanned || 0}</strong></span>
                                    <strong style="color:#10b981;">${pct}%</strong>
                                </div>
                                <div class="parent-plan-progress-bar">
                                    <div class="parent-plan-progress-fill" style="width: ${Math.min(100, Math.max(0, pct))}%;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="parent-months-accordion">
                            ${months.map(m => {
                                const list = monthlyLessons[m] || [];
                                const plannedCount = monthlyCounts[m] || list.length || 0;
                                const condCount = list.filter(l => l.isConducted).length;
                                return `
                                    <div class="parent-month-card">
                                        <div class="parent-month-head">
                                            <span>${escapeHtml(m)}</span>
                                            <span class="parent-month-badge">Пройдено: ${condCount} / ${plannedCount}</span>
                                        </div>
                                        <div class="parent-month-lessons">
                                            ${list.length === 0 ? `<div style="font-size:0.8rem; color:var(--muted); padding:4px 0;">Уроки не запланированы</div>` : ''}
                                            ${list.map((item, idx) => `
                                                <div class="parent-plan-lesson-row">
                                                    <span class="parent-plan-lesson-name">
                                                        <strong style="color:var(--muted); margin-right:6px;">${idx + 1}.</strong>
                                                        ${escapeHtml(item.title || 'Урок')}
                                                    </span>
                                                    <span class="parent-status-pill ${item.isConducted ? 'status-conducted' : 'status-planned'}" style="font-size:0.75rem; padding:2px 8px;">
                                                        ${item.isConducted ? '✅ Проведено' : '🕒 Запланировано'}
                                                    </span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        }
    } catch (e) {
        console.error('Error loading parent dashboard', e);
        if (scheduleContent) scheduleContent.innerHTML = `<div class="parent-empty-state">Ошибка загрузки данных кабинета. Попробуйте обновить страницу.</div>`;
    }
}

function bindParentInlineLinkForm(container) {
    const input = container.querySelector('#parent-inline-code-input');
    const btn = container.querySelector('#parent-inline-link-btn');
    const msg = container.querySelector('#parent-inline-link-msg');
    if (!btn || !input) return;

    btn.addEventListener('click', async () => {
        const code = input.value.trim().toUpperCase();
        if (!code) {
            if (msg) {
                msg.textContent = 'Введите код ребёнка вида STU-XXXXX';
                msg.style.color = 'var(--danger, #ef4444)';
            }
            return;
        }
        btn.disabled = true;
        btn.textContent = 'Привязка...';
        if (msg) msg.textContent = '';
        try {
            const res = await fetch('/api/parent/link-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parentCode: code })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AuthSync && typeof window.AuthSync.showToast === 'function') {
                    window.AuthSync.showToast('Ребёнок успешно привязан!', 'success');
                }
                const curUser = window.AuthSync ? window.AuthSync.getUser() : null;
                initParentDashboard(curUser);
            } else {
                if (msg) {
                    msg.textContent = data.error || 'Ошибка привязки';
                    msg.style.color = 'var(--danger, #ef4444)';
                }
            }
        } catch(e) {
            if (msg) {
                msg.textContent = 'Ошибка сети при привязке';
                msg.style.color = 'var(--danger, #ef4444)';
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Привязать';
        }
    });
}

// --- 2. USERNAME INLINE EDITOR ---
const USERNAME_KEY = 'studyUserName';
const LEGACY_STORAGE_KEY = 'loggedInUser';

function getStoredUserName() {
    try {
        return localStorage.getItem(USERNAME_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || 'Ученик';
    } catch (e) {
        return 'Ученик';
    }
}

function updateProfileIdentity(name) {
    const nicknameEl = document.getElementById('profile-nickname');
    const avatarEl = document.getElementById('profile-avatar');
    const previewAvatarPlaceholder = document.getElementById('custom-preview-avatar-placeholder');
    const previewName = document.getElementById('custom-preview-name');
    const trimmed = (name || '').trim() || 'Ученик';
    const initial = trimmed.charAt(0).toLocaleUpperCase('ru-RU');

    if (nicknameEl) nicknameEl.textContent = trimmed;
    if (avatarEl) avatarEl.textContent = initial;
    if (previewAvatarPlaceholder) previewAvatarPlaceholder.textContent = initial;
    if (previewName) previewName.textContent = trimmed;
    document.querySelectorAll('.mini-avatar-dot').forEach(dot => {
        dot.textContent = initial;
    });
}

// Initialize identity on load
updateProfileIdentity(getStoredUserName());

// Update identity when user logs in or auth state syncs
window.addEventListener('study-auth-changed', (e) => {
    const u = e.detail;
    if (u) {
        const name = u.displayName || u.username;
        updateProfileIdentity(name);
        const sInput = document.getElementById('settings-name-input');
        if (sInput) sInput.value = name;
    }
    const cloudCard = document.getElementById('cloud-account-card');
    if (cloudCard) {
        cloudCard.querySelectorAll('.cloud-parent-code-block').forEach(el => el.remove());
    }
    checkAndApplyRoleView();
});

// --- 3. EXPORT / IMPORT SYNC SYSTEM ---
function generateProfileExportCode() {
    const userName = localStorage.getItem('studyUserName') || localStorage.getItem('loggedInUser') || 'Ученик';
    
    let metrics = [];
    try {
        const raw = localStorage.getItem('studyMetrics');
        metrics = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(metrics)) metrics = [];
    } catch (e) {
        metrics = [];
    }

    let trainerRecords = {};
    try {
        if (typeof window !== 'undefined' && window.TrainerTracker && typeof window.TrainerTracker.getTrainerRecords === 'function') {
            trainerRecords = window.TrainerTracker.getTrainerRecords();
        } else {
            const raw = localStorage.getItem('studyTrainerRecords');
            trainerRecords = raw ? JSON.parse(raw) : {};
        }
    } catch (e) {
        trainerRecords = {};
    }

    let totalSolvedTasks = 0;
    try {
        totalSolvedTasks = parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0;
    } catch (e) {}

    let userXP = 0;
    try {
        userXP = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
    } catch (e) {}

    let avatarFrame = 'orbit';
    try {
        avatarFrame = localStorage.getItem('profileAvatarFrame') || 'orbit';
    } catch (e) {}

    const payload = {
        v: 2,
        app: 'study_site',
        type: 'profile_export',
        exportedAt: new Date().toISOString(),
        userName: userName,
        avatarFrame: avatarFrame,
        metrics: metrics,
        trainerRecords: trainerRecords,
        totalSolvedTasks: totalSolvedTasks,
        userXP: userXP
    };

    const jsonStr = JSON.stringify(payload);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.byteLength; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
    }
    return 'STUDY-' + btoa(binary);
}

function restoreProfileFromCode(codeStr) {
    if (!codeStr || typeof codeStr !== 'string') {
        throw new Error('Код пуст. Вставьте строку с кодом.');
    }
    let clean = codeStr.trim();
    if (clean.startsWith('STUDY-')) {
        clean = clean.slice(6);
    }
    
    let binary;
    try {
        binary = atob(clean);
    } catch (e) {
        throw new Error('Неверный формат кода (ошибка Base64).');
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    const jsonStr = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonStr);

    if (!data || typeof data !== 'object') {
        throw new Error('Некорректная структура данных.');
    }

    if (data.userName) {
        localStorage.setItem('studyUserName', data.userName.trim());
        localStorage.setItem('loggedInUser', data.userName.trim());
    }
    if (Array.isArray(data.metrics)) {
        localStorage.setItem('studyMetrics', JSON.stringify(data.metrics));
    }
    if (data.trainerRecords) {
        localStorage.setItem('studyTrainerRecords', JSON.stringify(data.trainerRecords));
    }
    if (data.totalSolvedTasks !== undefined) {
        localStorage.setItem('totalSolvedTasks', String(data.totalSolvedTasks));
    }
    if (data.userXP !== undefined) {
        localStorage.setItem('user_xp', String(data.userXP));
    }
    if (data.avatarFrame && typeof data.avatarFrame === 'string') {
        localStorage.setItem('profileAvatarFrame', data.avatarFrame);
    }

    return data;
}

function initSettingsModal() {
    const settingsDialog = document.getElementById('settings-dialog');
    const settingsOpenBtn = document.getElementById('settings-open-btn');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const profileCodeOutput = document.getElementById('profile-code-output');
    const profileCodeInput = document.getElementById('profile-code-input');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const copyStatus = document.getElementById('copy-status');
    const applyCodeBtn = document.getElementById('apply-code-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const importStatusMsg = document.getElementById('import-status-msg');
    const resetDataBtn = document.getElementById('reset-data-btn');

    // Settings internal tabs navigation
    const tabBtnCustom = document.getElementById('settings-tab-btn-custom');
    const tabBtnGeneral = document.getElementById('settings-tab-btn-general');
    const paneCustom = document.getElementById('settings-pane-custom');
    const paneGeneral = document.getElementById('settings-pane-general');

    function switchSettingsTab(tab) {
        const tabs = [
            { id: 'custom', btn: tabBtnCustom, pane: paneCustom },
            { id: 'general', btn: tabBtnGeneral, pane: paneGeneral }
        ];
        tabs.forEach(t => {
            const isActive = t.id === tab;
            if (t.btn) {
                t.btn.classList.toggle('active', isActive);
                t.btn.setAttribute('aria-selected', String(isActive));
            }
            if (t.pane) {
                t.pane.classList.toggle('hidden', !isActive);
            }
        });
    }

    if (tabBtnCustom) tabBtnCustom.addEventListener('click', () => switchSettingsTab('custom'));
    if (tabBtnGeneral) tabBtnGeneral.addEventListener('click', () => switchSettingsTab('general'));

    // Theme toggle elements
    const settingsThemeToggle = document.getElementById('settings-theme-toggle');
    const themeModeBadge = document.getElementById('theme-mode-badge');
    const themeToggleDesc = document.getElementById('theme-toggle-desc');

    // Name editor elements
    const settingsNameInput = document.getElementById('settings-name-input');
    const settingsNameSaveBtn = document.getElementById('settings-name-save-btn');
    const settingsNameStatus = document.getElementById('settings-name-status');

    // Theme switcher
    function applyProfileTheme(theme) {
        if (window.StudyTheme) {
            window.StudyTheme.set(theme, true);
        } else {
            document.documentElement.dataset.theme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            try {
                localStorage.setItem('profileTheme', theme);
                localStorage.setItem('site_theme', theme);
            } catch(e) {}
        }

        const isLight = theme === 'light';
        if (settingsThemeToggle) {
            settingsThemeToggle.checked = isLight;
            settingsThemeToggle.setAttribute('aria-checked', String(isLight));
        }
        if (themeModeBadge) {
            themeModeBadge.textContent = isLight ? 'Светлая тема' : 'Тёмная тема';
        }
        if (themeToggleDesc) {
            themeToggleDesc.textContent = isLight ? 'Светлый контрастный интерфейс' : 'Тёмный космический интерфейс';
        }

        const legacyToggle = document.getElementById('theme-toggle');
        if (legacyToggle) {
            legacyToggle.setAttribute('aria-pressed', String(isLight));
            legacyToggle.textContent = isLight ? 'Светлая тема' : 'Тёмная тема';
        }
    }

    const initialTheme = window.StudyTheme ? window.StudyTheme.get() : (localStorage.getItem('profileTheme') || 'light');
    applyProfileTheme(initialTheme);

    if (settingsThemeToggle) {
        settingsThemeToggle.addEventListener('change', () => {
            const nextTheme = settingsThemeToggle.checked ? 'light' : 'dark';
            applyProfileTheme(nextTheme);
        });
    }

    window.addEventListener('study-theme-changed', (e) => {
        const th = e.detail;
        const isLight = th === 'light';
        if (settingsThemeToggle && settingsThemeToggle.checked !== isLight) {
            settingsThemeToggle.checked = isLight;
            settingsThemeToggle.setAttribute('aria-checked', String(isLight));
        }
        if (themeModeBadge) {
            themeModeBadge.textContent = isLight ? 'Светлая тема' : 'Тёмная тема';
        }
        if (themeToggleDesc) {
            themeToggleDesc.textContent = isLight ? 'Светлый контрастный интерфейс' : 'Тёмный космический интерфейс';
        }
    });

    // Name editor in settings
    function saveNameFromSettings() {
        if (!settingsNameInput) return;
        const newName = (settingsNameInput.value || '').trim();
        if (!newName) {
            if (settingsNameStatus) {
                settingsNameStatus.textContent = 'Имя не может быть пустым';
                settingsNameStatus.className = 'copy-status-msg error';
            }
            return;
        }
        try {
            localStorage.setItem(USERNAME_KEY, newName);
            localStorage.setItem(LEGACY_STORAGE_KEY, newName);
        } catch(e) {}
        updateProfileIdentity(newName);
        const customPreviewName = document.getElementById('custom-preview-name');
        if (customPreviewName) customPreviewName.textContent = newName;
        if (profileCodeOutput) {
            profileCodeOutput.value = generateProfileExportCode();
        }
        if (window.AuthSync && typeof window.AuthSync.setDisplayName === 'function') {
            window.AuthSync.setDisplayName(newName);
        }
        if (settingsNameStatus) {
            settingsNameStatus.textContent = '✔ Имя сохранено!';
            settingsNameStatus.className = 'copy-status-msg success';
            setTimeout(() => {
                if (settingsNameStatus) settingsNameStatus.textContent = '';
            }, 3000);
        }
    }

    if (settingsNameSaveBtn) {
        settingsNameSaveBtn.addEventListener('click', saveNameFromSettings);
    }
    if (settingsNameInput) {
        settingsNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveNameFromSettings();
            }
        });
        settingsNameInput.addEventListener('input', () => {
            const previewName = document.getElementById('custom-preview-name');
            const previewAvatar = document.getElementById('custom-preview-avatar-placeholder');
            const val = (settingsNameInput.value || '').trim() || 'Ученик';
            if (previewName) previewName.textContent = val;
            if (previewAvatar) previewAvatar.textContent = val.charAt(0).toLocaleUpperCase('ru-RU');
        });
    }

    // --- AVATAR FRAME SELECTOR & UNLOCK SYSTEM ---
    const frameCards = document.querySelectorAll('.frame-option-card');
    const frameActiveBadge = document.getElementById('frame-active-badge');
    const heroAvatarContainer = document.getElementById('avatar-container');
    const customPreviewAvatarWrap = document.getElementById('custom-preview-avatar-wrap');
    const customPreviewFrameLabel = document.getElementById('custom-preview-frame-label');
    const frameLockNotice = document.getElementById('frame-lock-notice');

    function getProfileUnlockStats() {
        let earnedXp = 0;
        let correctCount = 0;
        try {
            const rawAttempts = localStorage.getItem('studyMetrics');
            const attempts = rawAttempts ? JSON.parse(rawAttempts) : [];
            const xpByTask = new Map();
            if (Array.isArray(attempts)) {
                attempts.forEach(attempt => {
                    if (!attempt) return;
                    const taskKey = `${attempt.subject}:${attempt.taskId}`;
                    const taskXp = attempt.correct ? 10 : 2;
                    xpByTask.set(taskKey, Math.max(xpByTask.get(taskKey) || 0, taskXp));
                    if (attempt.correct) correctCount++;
                });
            }
            const bonusXp = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
            earnedXp = [...xpByTask.values()].reduce((total, taskXp) => total + taskXp, 0) + bonusXp;
        } catch(e) {}

        try {
            const directXp = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
            if (directXp > earnedXp) earnedXp = directXp;
        } catch(e) {}

        const totalEl = document.getElementById('experience-total');
        if (totalEl && totalEl.textContent) {
            const match = totalEl.textContent.match(/(\d+)/);
            if (match) {
                const domXp = parseInt(match[1], 10);
                if (!isNaN(domXp) && domXp > earnedXp) earnedXp = domXp;
            }
        }

        try {
            localStorage.setItem('user_xp', String(earnedXp));
            if (correctCount > 0) {
                const curSolved = parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0;
                localStorage.setItem('totalSolvedTasks', String(Math.max(curSolved, correctCount)));
            }
        } catch(e) {}

        const xpPerLevel = 100;
        const level = Math.floor(earnedXp / xpPerLevel) + 1;

        // Max streak in any trainer
        let maxTrainerStreak = 0;
        try {
            if (window.TrainerTracker && typeof window.TrainerTracker.getTrainerRecords === 'function') {
                const records = window.TrainerTracker.getTrainerRecords();
                Object.values(records || {}).forEach(r => {
                    if (r && typeof r.maxStreak === 'number' && r.maxStreak > maxTrainerStreak) {
                        maxTrainerStreak = r.maxStreak;
                    }
                });
            }
        } catch(e) {}
        try {
            const rawRecords = localStorage.getItem('studyTrainerRecords');
            if (rawRecords) {
                const parsed = JSON.parse(rawRecords);
                Object.values(parsed || {}).forEach(r => {
                    if (r && typeof r.maxStreak === 'number' && r.maxStreak > maxTrainerStreak) {
                        maxTrainerStreak = r.maxStreak;
                    }
                });
            }
        } catch(e) {}

        return {
            earnedXp,
            level,
            correctCount,
            maxTrainerStreak
        };
    }

    const FRAME_CONFIG = {
        orbit: {
            id: 'orbit',
            name: 'Орбита',
            fullName: 'Классическая орбита',
            checkUnlock: () => ({
                unlocked: true,
                reqLabel: 'Доступна сразу',
                badgeText: '✓ Открыто',
                lockReason: ''
            })
        },
        neon: {
            id: 'neon',
            name: 'Неон',
            fullName: 'Квантовый неон',
            checkUnlock: (stats) => {
                const unlocked = stats.correctCount >= 10;
                return {
                    unlocked,
                    reqLabel: 'Медаль «Верные ответы»',
                    badgeText: unlocked ? '✓ Открыто' : `🔒 Медаль (${stats.correctCount}/10)`,
                    lockReason: `Для рамки «Неон» получите медаль «Верные ответы» (требуется 10 верных ответов, сейчас: ${stats.correctCount}/10).`
                };
            }
        },
        emerald: {
            id: 'emerald',
            name: 'Изумруд',
            fullName: 'Изумрудный кристалл',
            checkUnlock: (stats) => {
                const unlocked = stats.maxTrainerStreak >= 15;
                return {
                    unlocked,
                    reqLabel: 'Серия 15 в тренажёре',
                    badgeText: unlocked ? '✓ Открыто' : `🔒 Серия 15 (${stats.maxTrainerStreak}/15 🔥)`,
                    lockReason: `Для рамки «Изумруд» требуется серия из 15 верных ответов подряд в любом тренажёре (текущий рекорд: ${stats.maxTrainerStreak}/15 🔥).`
                };
            }
        },
        solar: {
            id: 'solar',
            name: 'Сингулярность',
            fullName: 'Золотая сингулярность',
            checkUnlock: (stats) => {
                const unlocked = stats.maxTrainerStreak >= 25;
                return {
                    unlocked,
                    reqLabel: 'Серия 25 в тренажёре',
                    badgeText: unlocked ? '✓ Открыто' : `🔒 Серия 25 (${stats.maxTrainerStreak}/25 🔥)`,
                    lockReason: `Для рамки «Золотая сингулярность» требуется серия из 25 верных ответов подряд в любом тренажёре (текущий рекорд: ${stats.maxTrainerStreak}/25 🔥).`
                };
            }
        },
        cosmic: {
            id: 'cosmic',
            name: 'Разлом',
            fullName: 'Гравитационный разлом',
            checkUnlock: (stats) => {
                const unlocked = stats.level >= 5;
                return {
                    unlocked,
                    reqLabel: '5-й уровень',
                    badgeText: unlocked ? '✓ Открыто' : `🔒 5 уровень (${stats.level}/5 ур.)`,
                    lockReason: `Для рамки «Разлом» требуется достичь 5-го уровня исследователя (ваш текущий уровень: ${stats.level}/5).`
                };
            }
        },
        gargantua: {
            id: 'gargantua',
            name: 'Гаргантюа',
            fullName: 'Чёрная дыра Гаргантюа',
            checkUnlock: (stats) => {
                const unlocked = stats.level >= 9;
                return {
                    unlocked,
                    reqLabel: '9-й уровень',
                    badgeText: unlocked ? '✓ Открыто' : `🔒 9 уровень (${stats.level}/9 ур.)`,
                    lockReason: `Рамка «Гаргантюа» откроется только на 9-ом уровне исследователя (ваш текущий уровень: ${stats.level}/9).`
                };
            }
        }
    };

    function updateFrameCardsState() {
        const stats = getProfileUnlockStats();
        frameCards.forEach(card => {
            const frameId = card.getAttribute('data-frame-id');
            const config = FRAME_CONFIG[frameId];
            if (!config) return;
            const status = config.checkUnlock(stats);

            card.classList.toggle('is-locked', !status.unlocked);
            card.classList.toggle('is-unlocked', status.unlocked);
            card.setAttribute('data-locked', String(!status.unlocked));

            const reqPill = card.querySelector('.frame-req-pill');
            if (reqPill) {
                reqPill.textContent = status.badgeText;
                reqPill.title = status.reqLabel;
            }

            if (!status.unlocked) {
                card.setAttribute('title', `🔒 Заблокировано: ${status.lockReason}`);
                card.setAttribute('aria-label', `${config.fullName} (🔒 Заблокировано: ${status.reqLabel})`);
            } else {
                card.setAttribute('title', `${config.fullName} (${status.reqLabel})`);
                card.setAttribute('aria-label', `${config.fullName} (✓ ${status.reqLabel})`);
            }
        });
    }

    function applyAvatarFrame(frameId) {
        const stats = getProfileUnlockStats();
        let targetFrame = FRAME_CONFIG[frameId] ? frameId : 'orbit';
        const status = FRAME_CONFIG[targetFrame].checkUnlock(stats);

        // If chosen frame is locked, fallback safely to orbit
        if (!status.unlocked) {
            targetFrame = 'orbit';
        }

        try {
            localStorage.setItem('profileAvatarFrame', targetFrame);
        } catch(e) {}

        if (heroAvatarContainer) {
            heroAvatarContainer.setAttribute('data-frame', targetFrame);
        }
        if (customPreviewAvatarWrap) {
            customPreviewAvatarWrap.setAttribute('data-frame', targetFrame);
        }

        if (frameActiveBadge) {
            frameActiveBadge.textContent = FRAME_CONFIG[targetFrame].fullName;
        }
        if (customPreviewFrameLabel) {
            customPreviewFrameLabel.textContent = 'Рамка: ' + FRAME_CONFIG[targetFrame].fullName;
        }

        frameCards.forEach(card => {
            const isSelected = card.getAttribute('data-frame-id') === targetFrame;
            card.classList.toggle('active', isSelected);
            card.setAttribute('aria-checked', String(isSelected));
        });

        if (profileCodeOutput && settingsDialog && settingsDialog.open) {
            profileCodeOutput.value = generateProfileExportCode();
        }
    }

    updateFrameCardsState();
    const initialFrame = localStorage.getItem('profileAvatarFrame') || 'orbit';
    applyAvatarFrame(initialFrame);

    frameCards.forEach(card => {
        function handleCardSelect() {
            const frameId = card.getAttribute('data-frame-id');
            if (!frameId) return;

            const stats = getProfileUnlockStats();
            const config = FRAME_CONFIG[frameId];
            const status = config ? config.checkUnlock(stats) : { unlocked: false };

            if (!status.unlocked) {
                card.classList.remove('shake');
                void card.offsetWidth;
                card.classList.add('shake');

                if (frameLockNotice) {
                    frameLockNotice.textContent = `🔒 ${status.lockReason}`;
                    frameLockNotice.classList.remove('hidden');
                    clearTimeout(frameLockNotice._timer);
                    frameLockNotice._timer = setTimeout(() => {
                        frameLockNotice.classList.add('hidden');
                    }, 5000);
                }
                return;
            }

            if (frameLockNotice) frameLockNotice.classList.add('hidden');
            applyAvatarFrame(frameId);
        }

        card.addEventListener('click', handleCardSelect);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardSelect();
            }
        });
    });

    function openSettings() {
        if (!settingsDialog) return;
        updateFrameCardsState();
        if (frameLockNotice) frameLockNotice.classList.add('hidden');
        if (profileCodeOutput) {
            profileCodeOutput.value = generateProfileExportCode();
        }
        const curName = getStoredUserName();
        if (settingsNameInput) {
            settingsNameInput.value = curName;
        }
        const previewName = document.getElementById('custom-preview-name');
        const previewAvatar = document.getElementById('custom-preview-avatar-placeholder');
        if (previewName) previewName.textContent = curName;
        if (previewAvatar) previewAvatar.textContent = curName.charAt(0).toLocaleUpperCase('ru-RU');

        if (settingsNameStatus) {
            settingsNameStatus.textContent = '';
        }
        const curTheme = window.StudyTheme ? window.StudyTheme.get() : (document.documentElement.dataset.theme || 'light');
        applyProfileTheme(curTheme);

        const currentFrame = localStorage.getItem('profileAvatarFrame') || 'orbit';
        applyAvatarFrame(currentFrame);

        if (window.AuthSync && typeof window.AuthSync.updateCloudSettingsCard === 'function') {
            window.AuthSync.updateCloudSettingsCard();
            const cloudCard = document.getElementById('cloud-account-card');
            if (cloudCard) {
                cloudCard.querySelectorAll('.cloud-parent-code-block').forEach(el => el.remove());
            }
        }

        updateStudentParentCodeSettings(window.AuthSync ? window.AuthSync.getUser() : null);

        if (importStatusMsg) {
            importStatusMsg.textContent = '';
            importStatusMsg.className = 'import-status-msg hidden';
        }
        if (copyStatus) copyStatus.textContent = '';
        if (copyBtnText) copyBtnText.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Скопировать код';
        settingsDialog.showModal();
    }

    function closeSettings() {
        if (settingsDialog && settingsDialog.open) {
            settingsDialog.close();
        }
    }

    if (settingsOpenBtn) settingsOpenBtn.addEventListener('click', openSettings);
    if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettings);

    if (copyCodeBtn && profileCodeOutput) {
        copyCodeBtn.addEventListener('click', async () => {
            const code = profileCodeOutput.value;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(code);
                } else {
                    profileCodeOutput.select();
                    document.execCommand('copy');
                }
                if (copyStatus) {
                    copyStatus.textContent = 'Скопировано в буфер!';
                    copyStatus.className = 'copy-status-msg success';
                }
                if (copyBtnText) copyBtnText.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><polyline points="20 6 9 17 4 12"/></svg> Скопировано!';
                setTimeout(() => {
                    if (copyStatus) copyStatus.textContent = '';
                    if (copyBtnText) copyBtnText.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Скопировать код';
                }, 2500);
            } catch (err) {
                profileCodeOutput.select();
            }
        });
    }

    if (clearInputBtn && profileCodeInput) {
        clearInputBtn.addEventListener('click', () => {
            profileCodeInput.value = '';
            if (importStatusMsg) importStatusMsg.className = 'import-status-msg hidden';
            profileCodeInput.focus();
        });
    }

    if (applyCodeBtn && profileCodeInput) {
        applyCodeBtn.addEventListener('click', () => {
            const code = profileCodeInput.value.trim();
            if (!code) {
                if (importStatusMsg) {
                    importStatusMsg.textContent = 'Вставьте код сохранения в поле выше.';
                    importStatusMsg.className = 'import-status-msg error';
                    importStatusMsg.classList.remove('hidden');
                }
                return;
            }
            try {
                const restored = restoreProfileFromCode(code);
                if (importStatusMsg) {
                    importStatusMsg.textContent = '✔ Профиль «' + (restored.userName || 'Ученик') + '» успешно восстановлен! Обновляем...';
                    importStatusMsg.className = 'import-status-msg success';
                    importStatusMsg.classList.remove('hidden');
                }
                setTimeout(() => window.location.reload(), 1000);
            } catch (err) {
                if (importStatusMsg) {
                    importStatusMsg.textContent = 'Ошибка: ' + (err.message || 'Не удалось применить код.');
                    importStatusMsg.className = 'import-status-msg error';
                    importStatusMsg.classList.remove('hidden');
                }
            }
        });
    }

    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            const ok = confirm('Сбросить ВСЕ данные профиля (имя, решенные задачи, серии и звания) на этом устройстве?');
            if (!ok) return;
            try {
                localStorage.removeItem('studyUserName');
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('studyMetrics');
                localStorage.removeItem('studyTrainerRecords');
                localStorage.removeItem('totalSolvedTasks');
                localStorage.removeItem('user_xp');
                localStorage.removeItem('studyClaimedTrainerGifts');
                localStorage.removeItem('profileAvatarFrame');
            } catch (e) {}
            window.location.reload();
        });
    }
}
initSettingsModal();

// --- 4. LEVEL PROGRESSION MODAL SYSTEM ---
function initLevelProgressModal() {
    const heroLevelCard = document.getElementById('hero-level-card');
    const levelDialog = document.getElementById('level-progress-dialog');
    const levelCloseBtn = document.getElementById('level-modal-close-btn');

    const orbNum = document.getElementById('level-modal-badge-num');
    const currentTitle = document.getElementById('level-modal-current-title');
    const totalXp = document.getElementById('level-modal-total-xp');
    const barLabel = document.getElementById('level-modal-bar-label');
    const pctLabel = document.getElementById('level-modal-pct-label');
    const barFill = document.getElementById('level-modal-bar-fill');
    const countBadge = document.getElementById('level-roadmap-count-badge');
    const roadmapList = document.getElementById('level-roadmap-list');

    const RANKS = [
        { level: 1, title: 'Новичок', minXp: 0, maxXp: 99, icon: '🌱', desc: 'Первые шаги: знакомство с базовыми формулами и тестами платформы' },
        { level: 2, title: 'Ученик', minXp: 100, maxXp: 199, icon: '📘', desc: 'Освоение понятий: системный разбор решений и тренировка точности' },
        { level: 3, title: 'Исследователь', minXp: 200, maxXp: 299, icon: '🔭', desc: 'Уверенная практика: открытие интерактивных игр и симуляций' },
        { level: 4, title: 'Знаток', minXp: 300, maxXp: 399, icon: '⚡', desc: 'Аналитический склад ума: безошибочные серии и высокая скорость' },
        { level: 5, title: 'Мастер', minXp: 400, maxXp: 499, icon: '🔮', desc: 'Мастерство решений: решение сложных комплексных заданий ОГЭ' },
        { level: 6, title: 'Эксперт', minXp: 500, maxXp: 599, icon: '🧭', desc: 'Академический статус: безупречная теория и олимпиадный кругозор' },
        { level: 7, title: 'Архитектор знаний', minXp: 600, maxXp: 699, icon: '🏛️', desc: 'Интеграция наук: глубокие связи между физикой и математикой' },
        { level: 8, title: 'Профессор', minXp: 700, maxXp: 799, icon: '🎓', desc: 'Высший пилотаж: решение нестандартных исследовательских задач' },
        { level: 9, title: 'Квантовый разум', minXp: 800, maxXp: 899, icon: '⚛️', desc: 'Квантовый уровень: симуляция космических сингулярностей' },
        { level: 10, title: 'Легенда космоса', minXp: 900, maxXp: Infinity, icon: '👑', desc: 'Абсолютная вершина: почётное имя в зале славы НЕШколы' }
    ];

    function getLevelData() {
        let earnedXp = 0;
        try {
            const rawAttempts = localStorage.getItem('studyMetrics');
            const attempts = rawAttempts ? JSON.parse(rawAttempts) : [];
            const xpByTask = new Map();
            if (Array.isArray(attempts)) {
                attempts.forEach(attempt => {
                    const taskKey = `${attempt.subject}:${attempt.taskId}`;
                    const taskXp = attempt.correct ? 10 : 2;
                    xpByTask.set(taskKey, Math.max(xpByTask.get(taskKey) || 0, taskXp));
                });
            }
            const bonusXp = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
            earnedXp = [...xpByTask.values()].reduce((total, taskXp) => total + taskXp, 0) + bonusXp;
        } catch(e) {
            earnedXp = 0;
        }

        try {
            const directXp = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
            if (directXp > earnedXp) earnedXp = directXp;
        } catch(e) {}

        const totalEl = document.getElementById('experience-total');
        if (totalEl && totalEl.textContent) {
            const match = totalEl.textContent.match(/(\d+)/);
            if (match) {
                const domXp = parseInt(match[1], 10);
                if (!isNaN(domXp) && domXp > earnedXp) earnedXp = domXp;
            }
        }

        const xpPerLevel = 100;
        const level = Math.floor(earnedXp / xpPerLevel) + 1;
        const currentLevelXp = earnedXp % xpPerLevel;
        const remainingXp = xpPerLevel - currentLevelXp;
        const currentRank = RANKS[Math.min(Math.max(level - 1, 0), RANKS.length - 1)];

        return {
            earnedXp,
            level,
            currentLevelXp,
            xpPerLevel,
            remainingXp,
            currentRank
        };
    }

    function renderLevelModal() {
        const data = getLevelData();
        const pct = Math.min(100, Math.round((data.currentLevelXp / data.xpPerLevel) * 100));

        if (orbNum) orbNum.textContent = data.level;
        if (currentTitle) currentTitle.textContent = `Уровень ${data.level} · ${data.currentRank.title}`;
        if (totalXp) totalXp.textContent = `${data.earnedXp} XP`;
        if (barLabel) {
            if (data.level >= 10) {
                barLabel.textContent = `Максимальный ранг достигнут · ${data.earnedXp} XP`;
            } else {
                barLabel.textContent = `${data.currentLevelXp} / ${data.xpPerLevel} XP до Уровня ${data.level + 1} (осталось ${data.remainingXp} XP)`;
            }
        }
        if (pctLabel) pctLabel.textContent = `${pct}%`;
        if (barFill) barFill.style.width = `${pct}%`;
        if (countBadge) countBadge.textContent = `Достигнут ${Math.min(data.level, 10)} из 10`;

        if (roadmapList) {
            roadmapList.innerHTML = RANKS.map(item => {
                let statusClass = 'is-locked';
                let statusTag = '<span class="level-item-status-pill status-locked">🔒 Закрыт</span>';

                if (item.level < data.level) {
                    statusClass = 'is-completed';
                    statusTag = '<span class="level-item-status-pill status-completed">✔ Достигнут</span>';
                } else if (item.level === data.level) {
                    statusClass = 'is-current';
                    statusTag = '<span class="level-item-status-pill status-current">⚡ Текущий</span>';
                }

                const xpRangeText = item.maxXp === Infinity ? `${item.minXp}+ XP` : `${item.minXp} – ${item.maxXp} XP`;

                return `
                    <div class="level-item-card ${statusClass}" role="listitem">
                        <div class="level-item-left">
                            <div class="level-item-icon-box" aria-hidden="true">${item.icon}</div>
                            <div class="level-item-meta">
                                <div class="level-item-head">
                                    <span class="level-item-title">Уровень ${item.level} · ${item.title}</span>
                                    <span class="level-item-xp-badge">${xpRangeText}</span>
                                </div>
                                <span class="level-item-desc">${item.desc}</span>
                            </div>
                        </div>
                        <div class="level-item-right">
                            ${statusTag}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function openLevelModal() {
        if (!levelDialog) return;
        renderLevelModal();
        levelDialog.showModal();
        if (heroLevelCard) heroLevelCard.setAttribute('aria-expanded', 'true');
    }

    function closeLevelModal() {
        if (levelDialog && levelDialog.open) {
            levelDialog.close();
            if (heroLevelCard) heroLevelCard.setAttribute('aria-expanded', 'false');
        }
    }

    if (heroLevelCard) {
        heroLevelCard.addEventListener('click', openLevelModal);
        heroLevelCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLevelModal();
            }
        });
    }

    if (levelCloseBtn) {
        levelCloseBtn.addEventListener('click', closeLevelModal);
    }

    if (levelDialog) {
        levelDialog.addEventListener('click', (e) => {
            const rect = levelDialog.getBoundingClientRect();
            const isInDialog = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            if (!isInDialog) {
                closeLevelModal();
            }
        });
    }
}
initLevelProgressModal();