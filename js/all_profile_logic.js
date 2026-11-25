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
        const countInf = trainers.filter(t => t.subject === 'Информатика').length;
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
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Информатика' ? 'active' : ''}" data-subject="Информатика" role="radio" aria-checked="${trainerFilterState.subject === 'Информатика'}">
                        <span>💻 Информатика</span>
                        <span class="trainer-pill-count">(${countInf})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Физика' ? 'active' : ''}" data-subject="Физика" role="radio" aria-checked="${trainerFilterState.subject === 'Физика'}">
                        <span>⚡ Физика</span>
                        <span class="trainer-pill-count">(${countPhys})</span>
                    </button>
                    ${'' /* [СКРЫТО: Русский язык и Английский]
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Русский язык' ? 'active' : ''}" data-subject="Русский язык" role="radio" aria-checked="${trainerFilterState.subject === 'Русский язык'}">
                        <span>📖 Русский язык</span>
                        <span class="trainer-pill-count">(${countRus})</span>
                    </button>
                    <button type="button" class="trainer-pill-btn ${trainerFilterState.subject === 'Английский' ? 'active' : ''}" data-subject="Английский" role="radio" aria-checked="${trainerFilterState.subject === 'Английский'}">
                        <span>🇬🇧 Английский</span>
                        <span class="trainer-pill-count">(${countEng})</span>
                    </button>
                    */}
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
        if (tabName !== 'upgrade' && typeof window.stopTowerBattle === 'function') {
            window.stopTowerBattle();
        }
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
            if (typeof window.initUpgradeHub === 'function') {
                window.initUpgradeHub();
            }
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
        const fbCard = document.getElementById('latest-teacher-feedback-card');
        const billingCard = document.getElementById('student-billing-card');
        if (isTeacher) {
            if (fbCard) fbCard.style.display = 'none';
            if (billingCard) billingCard.style.display = 'none';
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
            if (studentHomeworksData) {
                renderLatestTeacherFeedback(studentHomeworksData);
            }
            await Promise.all([fetchMonthSchedule(), fetchStudentHomeworks(), fetchStudentBilling()]);
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
                if (data.schedule.billing) {
                    renderStudentBilling(data.schedule.billing);
                }
            }
        } catch(e) {
            console.error('Error fetching month schedule', e);
        }
    }

    async function fetchStudentBilling() {
        if (isTeacherUser()) {
            const card = document.getElementById('student-billing-card');
            if (card) card.style.display = 'none';
            return;
        }
        try {
            const res = await fetch('/api/student/billing', { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.billing) {
                renderStudentBilling(data.billing);
            }
        } catch(e) {
            console.error('Error fetching student billing', e);
        }
    }

    function renderStudentBilling(billing) {
        const card = document.getElementById('student-billing-card');
        if (!card) return;

        // Карточка учёта занятий и оплаты предназначена только для учеников (если плательщик — сам ученик).
        // Для учителей и администраторов, а также при оплате родителем или отсутствии данных карточка скрывается.
        if (isTeacherUser() || !billing || billing.payer !== 'student') {
            card.style.display = 'none';
            return;
        }

        card.style.display = 'block';

        const passedVal = document.getElementById('student-billing-passed-val');
        const paidVal = document.getElementById('student-billing-paid-val');
        const paidSub = document.getElementById('student-billing-paid-sub');
        const priceVal = document.getElementById('student-billing-price-val');
        const debtVal = document.getElementById('student-billing-debt-val');
        const debtSub = document.getElementById('student-billing-debt-sub');
        const debtLbl = document.getElementById('student-billing-debt-lbl');
        const badge = document.getElementById('student-billing-status-badge');
        const debtKpi = document.getElementById('student-billing-debt-kpi');

        const passed = Math.max(0, parseInt(billing.passedLessons, 10) || 0);
        const paid = Math.max(0, parseInt(billing.paidLessons, 10) || 0);
        const price = Math.max(0, parseInt(billing.lessonPrice, 10) || 700);
        const debt = Math.max(0, parseInt(billing.debtAmount, 10) || 0);
        const unpaid = Math.max(0, parseInt(billing.unpaidLessons, 10) || 0);
        const prepaid = Math.max(0, parseInt(billing.prepaidLessons, 10) || 0);
        const prepaidSum = Math.max(0, parseInt(billing.prepaidAmount, 10) || 0);

        if (passedVal) passedVal.textContent = passed;
        if (paidVal) paidVal.textContent = paid;
        if (paidSub) paidSub.textContent = `${(paid * price).toLocaleString('ru-RU')} ₽`;
        if (priceVal) priceVal.textContent = `${price.toLocaleString('ru-RU')} ₽`;
        if (debtVal) debtVal.textContent = `${debt.toLocaleString('ru-RU')} ₽`;

        if (badge && debtSub) {
            if (debt > 0) {
                debtVal.style.color = 'var(--danger, #ef4444)';
                debtSub.textContent = `Долг: ${debt.toLocaleString('ru-RU')} ₽ (${unpaid} ур.)`;
                debtSub.style.color = 'var(--danger, #ef4444)';
                if (debtLbl) debtLbl.textContent = 'Общая задолженность';
                badge.className = 'student-billing-badge status-debt';
                badge.innerHTML = `⚠️ Задолженность: <strong>${debt.toLocaleString('ru-RU')} ₽</strong>`;
                if (debtKpi) debtKpi.style.borderColor = 'rgba(239, 68, 68, 0.45)';
            } else if (prepaid > 0) {
                debtVal.style.color = 'var(--accent-emerald, #10b981)';
                debtSub.textContent = `Аванс: +${prepaidSum.toLocaleString('ru-RU')} ₽ (+${prepaid} ур.)`;
                debtSub.style.color = 'var(--accent-emerald, #10b981)';
                if (debtLbl) debtLbl.textContent = 'Оплачено наперёд';
                badge.className = 'student-billing-badge status-prepaid';
                badge.innerHTML = `✨ Оплачено наперёд (+${prepaid} ур.)`;
                if (debtKpi) debtKpi.style.borderColor = 'rgba(6, 182, 212, 0.35)';
            } else {
                debtVal.style.color = 'var(--accent-emerald, #10b981)';
                debtSub.textContent = 'Оплачено полностью';
                debtSub.style.color = 'var(--accent-emerald, #10b981)';
                if (debtLbl) debtLbl.textContent = 'Задолженность отсутствует';
                badge.className = 'student-billing-badge status-ok';
                badge.innerHTML = '✅ Все уроки оплачены';
                if (debtKpi) debtKpi.style.borderColor = 'rgba(16, 185, 129, 0.35)';
            }
        }
    }

    async function fetchStudentHomeworks() {
        try {
            const res = await fetch('/api/student/homeworks', { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.homeworks) {
                studentHomeworksData = data.homeworks;
                renderStudentHomeworks();
                renderLatestTeacherFeedback(studentHomeworksData);
            }
        } catch(e) {
            console.error('Error fetching student homeworks', e);
        }
    }

    function renderLatestTeacherFeedback(homeworks) {
        const card = document.getElementById('latest-teacher-feedback-card');
        if (!card) return;

        if (isTeacherUser() || isParentUser()) {
            card.style.display = 'none';
            return;
        }

        const hws = Array.isArray(homeworks) ? homeworks : [];
        const commentedHws = hws.filter(h => {
            const sub = h.submission || {};
            const fb = (sub.teacherFeedback || sub.teacher_feedback || '').trim();
            if (!fb) return false;
            if (sub.status === 'waived' && fb.includes('Официально освобождён')) return false;
            return true;
        });

        if (commentedHws.length === 0) {
            card.style.display = 'block';
            card.innerHTML = `
                <div class="feedback-hero-accent-strip"></div>
                <div class="feedback-hero-inner feedback-hero-empty">
                    <div class="feedback-hero-top-row">
                        <div class="feedback-hero-tag">
                            <span class="feedback-hero-icon">💬</span>
                            <span>Последний комментарий преподавателя</span>
                        </div>
                    </div>
                    <div class="feedback-hero-content-row">
                        <div class="feedback-hero-text-wrap">
                            <p class="feedback-hero-quote empty-quote">
                                Преподаватель ещё не оставил комментариев к проверенным домашним заданиям. Выполняйте задания, чтобы получать разборы и отзывы учителя!
                            </p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Сортируем по дате проверки / отправки / создания в порядке убывания (самый свежий первый)
        commentedHws.sort((a, b) => {
            const timeA = new Date(a.submission?.checkedAt || a.submission?.submittedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.submission?.checkedAt || b.submission?.submittedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
        });

        const latestHw = commentedHws[0];
        const sub = latestHw.submission || {};
        const feedback = (sub.teacherFeedback || sub.teacher_feedback || '').trim();
        const dateStr = sub.checkedAt ? formatDateTimeStr(sub.checkedAt) : (sub.submittedAt ? formatDateTimeStr(sub.submittedAt) : '');
        const scoreStr = (sub.maxScore > 0) ? `${sub.score} / ${sub.maxScore} баллов` : '';

        card.style.display = 'block';
        card.innerHTML = `
            <div class="feedback-hero-accent-strip"></div>
            <div class="feedback-hero-inner">
                <div class="feedback-hero-top-row">
                    <div class="feedback-hero-tag">
                        <span class="feedback-hero-icon">💬</span>
                        <span>Последний комментарий преподавателя</span>
                    </div>
                    <a href="homework.html?id=${latestHw.id}" class="feedback-hero-hw-badge" title="Перейти к домашнему заданию">
                        📝 Д/З: ${escapeHtml(latestHw.title || 'Домашнее задание')} ↗
                    </a>
                </div>

                <div class="feedback-hero-content-row">
                    <div class="feedback-hero-text-wrap">
                        <div class="feedback-quote-mark" aria-hidden="true">“</div>
                        <p class="feedback-hero-quote">
                            ${escapeHtml(feedback)}
                        </p>
                    </div>
                    <div class="feedback-hero-action-box">
                        <a href="homework.html?id=${latestHw.id}" class="hw-action-btn hw-btn-primary feedback-open-btn">
                            Разбор и оценка ↗
                        </a>
                    </div>
                </div>

                <div class="feedback-hero-footer-row">
                    <span class="feedback-hero-meta-item">
                        <strong>Преподаватель:</strong> ${escapeHtml(latestHw.teacherName || 'Учитель')}
                    </span>
                    ${scoreStr ? `
                        <span class="feedback-hero-sep">·</span>
                        <span class="feedback-hero-meta-item feedback-hero-score-badge">
                            ✓ Результат: <strong>${scoreStr}</strong>
                        </span>
                    ` : ''}
                    ${dateStr ? `
                        <span class="feedback-hero-sep">·</span>
                        <span class="feedback-hero-meta-item feedback-hero-date">
                            🕒 Проверено: ${dateStr}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
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
            const isPaid = Boolean(les.isPaid || les.is_paid);
            const paidBadge = isPaid
                ? '<span style="font-size:0.72rem; padding:2px 7px; border-radius:9999px; background:rgba(16, 185, 129, 0.15); color:var(--accent-emerald); font-weight:700; margin-left:6px; border:1px solid rgba(16, 185, 129, 0.35);">💳 Оплачен</span>'
                : '<span style="font-size:0.72rem; padding:2px 7px; border-radius:9999px; background:rgba(239, 68, 68, 0.12); color:var(--danger, #ef4444); font-weight:700; margin-left:6px; border:1px solid rgba(239, 68, 68, 0.3);">⏳ Не оплачен</span>';

            htmlItems += `
                <div class="day-event-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="day-event-time">⏰ ${t}</span>
                        <div>
                            <span class="lesson-class-badge" style="font-size:0.75rem;">${escapeHtml(cName)}${indBadge}</span>
                            ${completedBadge}
                            ${paidBadge}
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

    function getHwPassMonthlyUsageCount() {
        let count = 0;
        const now = new Date();
        const curYear = now.getFullYear();
        const curMonth = now.getMonth();
        const checkedHwIds = new Set();

        // 1. Считаем из актуальных данных сервера (studentHomeworksData)
        if (Array.isArray(studentHomeworksData)) {
            studentHomeworksData.forEach(h => {
                const sub = h && h.submission;
                if (sub && sub.status === 'waived') {
                    const dateStr = sub.submittedAt || sub.submitted_at || h.created_at || h.createdAt;
                    if (dateStr) {
                        const d = new Date(dateStr);
                        if (!isNaN(d.getTime()) && d.getFullYear() === curYear && d.getMonth() === curMonth) {
                            count++;
                            checkedHwIds.add(h.id);
                        }
                    } else {
                        count++;
                        checkedHwIds.add(h.id);
                    }
                }
            });
        }

        // 2. Сверяем с локальной историей применений (на случай оффлайна или несохраненных данных)
        try {
            const raw = localStorage.getItem('study_hw_pass_usage_history');
            const list = raw ? JSON.parse(raw) : [];
            if (Array.isArray(list)) {
                list.forEach(item => {
                    const ts = (typeof item === 'object' && item !== null) ? item.timestamp : item;
                    const hwId = (typeof item === 'object' && item !== null) ? item.homeworkId : null;
                    if (hwId && checkedHwIds.has(hwId)) return;
                    const d = new Date(ts);
                    if (!isNaN(d.getTime()) && d.getFullYear() === curYear && d.getMonth() === curMonth) {
                        count++;
                    }
                });
            }
        } catch(e) {}

        return count;
    }

    function recordHwPassUsage(hwId) {
        try {
            const raw = localStorage.getItem('study_hw_pass_usage_history');
            const list = raw ? JSON.parse(raw) : [];
            const validList = Array.isArray(list) ? list : [];
            validList.push({
                homeworkId: hwId || null,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('study_hw_pass_usage_history', JSON.stringify(validList));
        } catch(e) {}
    }

    window.getHwPassMonthlyUsageCount = getHwPassMonthlyUsageCount;
    window.recordHwPassUsage = recordHwPassUsage;

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

        const monthlyUsed = getHwPassMonthlyUsageCount();

        studentHomeworksList.innerHTML = studentHomeworksData.map(h => {
            const sub = h.submission || {};
            const status = sub.status || 'not_started';
            let statusBadge = '';
            let actionBtn = '';
            let passBtn = '';

            if (status !== 'checked' && status !== 'submitted' && status !== 'waived') {
                try {
                    const rawInv = localStorage.getItem('study_boosts_inventory');
                    const inv = rawInv ? JSON.parse(rawInv) : {};
                    if (inv && inv.hw_pass > 0) {
                        if (monthlyUsed >= 2) {
                            passBtn = `<button type="button" class="btn btn-secondary btn-sm" disabled style="margin-right:8px; font-size:0.8rem; padding:0.4rem 0.8rem; opacity:0.55; cursor:not-allowed;" title="Лимит списаний в текущем месяце исчерпан (максимум 2 раза в месяц)">📜 Отказ от Д/З (лимит 2/2)</button>`;
                        } else {
                            passBtn = `<button type="button" class="btn btn-secondary btn-sm btn-use-hw-pass" data-hw-id="${h.id}" style="margin-right:8px; font-size:0.8rem; padding:0.4rem 0.8rem; background:rgba(255, 119, 40, 0.1); border-color:rgba(255,119,40,0.3); color:var(--accent); font-weight:700;" title="Применено в этом месяце: ${monthlyUsed} из 2 (максимум 2 в месяц)">📜 Отказ от Д/З (${monthlyUsed}/2)</button>`;
                        }
                    }
                } catch(e) {}
            }

            if (status === 'waived') {
                statusBadge = `<span class="badge" style="background:rgba(255, 119, 40, 0.15); color:var(--accent); font-weight:700; border:1px solid rgba(255,119,40,0.3);">📜 Освобождён бустом (100%)</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-secondary">Смотреть задание</a>`;
            } else if (status === 'checked') {
                statusBadge = `<span class="badge badge-status status-checked">Оценка: ${sub.score}/${sub.maxScore || sub.max_score || h.tasksCount || 0}</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-secondary">Результаты и разбор</a>`;
            } else if (status === 'submitted') {
                const curScore = (sub.score != null) ? sub.score : 0;
                const maxScore = sub.maxScore || sub.max_score || h.tasksCount || 0;
                statusBadge = `<span class="badge badge-status status-submitted" title="Ожидает проверки учителем">На проверке: ${curScore}/${maxScore} б.</span>`;
                actionBtn = `<a href="homework.html?id=${h.id}" class="hw-action-btn hw-btn-secondary">Смотреть работу</a>`;
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
                    <div style="display:flex; justify-content:flex-end; align-items:center;">
                        ${passBtn}
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');

        studentHomeworksList.querySelectorAll('.btn-use-hw-pass').forEach(b => {
            b.addEventListener('click', async () => {
                const hwId = parseInt(b.getAttribute('data-hw-id'), 10);
                const currentMonthUsage = getHwPassMonthlyUsageCount();
                if (currentMonthUsage >= 2) {
                    alert('Превышен лимит применения: «Академический зачёт» разрешено использовать не более 2 раз за один календарный месяц (использовано: 2 из 2).');
                    return;
                }

                if (!confirm(`Использовать 1 билет «Отказ от Д/З» для автоматического 100% зачёта этого домашнего задания?\n\n(Применено в этом месяце: ${currentMonthUsage} из 2)`)) return;
                try {
                    const res = await fetch(`/api/homework/${hwId}/waive`, { method: 'POST' });
                    const d = await res.json();
                    if (d.success) {
                        try {
                            const rawInv = localStorage.getItem('study_boosts_inventory');
                            const inv = rawInv ? JSON.parse(rawInv) : {};
                            inv.hw_pass = Math.max(0, (inv.hw_pass || 0) - 1);
                            localStorage.setItem('study_boosts_inventory', JSON.stringify(inv));
                            recordHwPassUsage(hwId);
                            window.dispatchEvent(new CustomEvent('study-boost-consumed', { detail: { boostId: 'hw_pass', homeworkId: hwId } }));
                        } catch(e) {}
                        alert('📜 Домашнее задание успешно зачтено бустом «Отказ от Д/З»!');
                        await fetchStudentHomeworks();
                    } else {
                        alert(d.error || 'Ошибка при применении буста');
                    }
                } catch(e) {
                    alert('Ошибка сети');
                }
            });
        });
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
    const kpiLessonPrice = document.getElementById('kpi-lesson-price');
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
                    kpiUnpaidCard.classList.remove('has-unpaid', 'unpaid-yellow', 'unpaid-orange', 'unpaid-red');
                    if (unpaid >= 5) {
                        kpiUnpaidCard.classList.add('unpaid-red');
                    } else if (unpaid >= 2) {
                        kpiUnpaidCard.classList.add('unpaid-orange');
                    } else {
                        kpiUnpaidCard.classList.add('unpaid-yellow');
                    }
                }
                const kpiHint = document.getElementById('kpi-unpaid-hint');
                if (kpiHint) {
                    kpiHint.textContent = unpaid > 0 ? 'К оплате' : 'Задолженность отсутствует';
                }
            }
            if (kpiLessonPrice) {
                if (dash.linked && dash.kpi.lessonPrice != null) {
                    const price = Math.max(0, parseInt(dash.kpi.lessonPrice, 10) || 0);
                    kpiLessonPrice.textContent = `${price.toLocaleString('ru-RU')} ₽`;
                } else {
                    kpiLessonPrice.textContent = '—';
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
                                    ` : (st === 'submitted') ? `
                                        <div style="font-size:0.82rem; padding:8px 10px; background:rgba(251,191,36,0.08); border-radius:8px; border:1px solid rgba(251,191,36,0.25);">
                                            Первоначальный балл: <strong class="parent-hw-score" style="color:var(--accent-gold);">${sub.score || 0} / ${sub.maxScore || 0}</strong>
                                            <div style="margin-top:4px; color:var(--muted); font-size:0.78rem;">⏳ Ожидает проверки учителем</div>
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

                // Канонический академический порядок месяцев (начиная со сентября)
                const ACADEMIC_MONTH_ORDER = [
                    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
                    'Январь', 'Февраль', 'Март', 'Апрель', 'Май',
                    'Июнь', 'Июль', 'Август'
                ];

                // Базовые месяцы учебного года
                const standardMonths = [
                    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
                    'Январь', 'Февраль', 'Март', 'Апрель', 'Май'
                ];

                const allMonths = new Set([
                    ...standardMonths,
                    ...Object.keys(monthlyLessons),
                    ...Object.keys(monthlyCounts)
                ]);

                // Месяцы всегда идут по порядку с сентября: Сентябрь, Октябрь, Ноябрь, Декабрь, Январь и т.д.
                const months = Array.from(allMonths).sort((a, b) => {
                    const idxA = ACADEMIC_MONTH_ORDER.indexOf(a);
                    const idxB = ACADEMIC_MONTH_ORDER.indexOf(b);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.localeCompare(b, 'ru');
                });

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
                                const rawList = Array.isArray(monthlyLessons[m]) ? monthlyLessons[m] : [];
                                let plannedCount;
                                if (monthlyCounts && monthlyCounts[m] !== undefined && monthlyCounts[m] !== null) {
                                    const parsed = parseInt(monthlyCounts[m], 10);
                                    plannedCount = (!isNaN(parsed) && parsed >= 0) ? parsed : rawList.length;
                                } else {
                                    plannedCount = rawList.length;
                                }

                                // Количество строк строго соответствует числу запланированных уроков в этом месяце
                                const displayLessons = [];
                                let condCount = 0;
                                for (let i = 0; i < plannedCount; i++) {
                                    const item = rawList[i] || { num: i + 1, title: '', isConducted: false };
                                    if (item.isConducted) {
                                        condCount++;
                                    }
                                    displayLessons.push(item);
                                }

                                return `
                                    <div class="parent-month-card">
                                        <div class="parent-month-head">
                                            <span>${escapeHtml(m)}</span>
                                            <span class="parent-month-badge">Пройдено: ${condCount} / ${plannedCount}</span>
                                        </div>
                                        <div class="parent-month-lessons">
                                            ${displayLessons.length === 0 ? `<div style="font-size:0.8rem; color:var(--muted); padding:4px 0;">Уроки не запланированы</div>` : ''}
                                            ${displayLessons.map((item, idx) => `
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

        let peakXp = parseInt(localStorage.getItem('study_peak_xp') || '0', 10) || 0;
        peakXp = Math.max(peakXp, earnedXp);
        localStorage.setItem('study_peak_xp', String(peakXp));

        const xpPerLevel = 100;
        const level = Math.floor(peakXp / xpPerLevel) + 1;

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

        let peakXp = parseInt(localStorage.getItem('study_peak_xp') || '0', 10) || 0;
        peakXp = Math.max(peakXp, earnedXp);
        localStorage.setItem('study_peak_xp', String(peakXp));

        const xpPerLevel = 100;
        const level = Math.floor(peakXp / xpPerLevel) + 1;
        const currentLevelXp = peakXp % xpPerLevel;
        const remainingXp = xpPerLevel - currentLevelXp;
        const currentRank = RANKS[Math.min(Math.max(level - 1, 0), RANKS.length - 1)];

        return {
            earnedXp,
            peakXp,
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
        if (totalXp) totalXp.textContent = `${data.peakXp} XP (Баланс: ${data.earnedXp} XP)`;
        if (barLabel) {
            if (data.level >= 10) {
                barLabel.textContent = `Максимальный ранг достигнут · Рекорд: ${data.peakXp} XP`;
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

// =========================================================================
// 8. HUB «ПРОКАЧКА»: РУЛЕТКА ОПЫТА, МАГАЗИН БУСТОВ И БАШНЯ ЗНАНИЙ (RPG)
// =========================================================================
(function initUpgradeHubModule() {
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTickSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(640, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.09, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
    }

    function playWinSound(isJackpot) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const notes = isJackpot ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.38);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.09);
                osc.stop(ctx.currentTime + idx * 0.09 + 0.38);
            });
        } catch (e) {}
    }

    function playHitSound(isCrit) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = isCrit ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(isCrit ? 360 : 220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {}
    }

    function playShieldSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.22);
            gain.gain.setValueAtTime(0.16, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.22);
        } catch (e) {}
    }

    // --- Data Storage Helpers ---
    function getUserTotalXp() {
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
        } catch (e) {
            earnedXp = 0;
        }
        try {
            const directXp = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
            if (directXp > earnedXp) earnedXp = directXp;
        } catch (e) {}
        const totalEl = document.getElementById('experience-total');
        if (totalEl && totalEl.textContent) {
            const match = totalEl.textContent.match(/(\d+)/);
            if (match) {
                const domXp = parseInt(match[1], 10);
                if (!isNaN(domXp) && domXp > earnedXp) earnedXp = domXp;
            }
        }
        return earnedXp;
    }

    function modifyUserXp(delta) {
        const curXp = getUserTotalXp();
        const newXp = Math.max(0, curXp + delta);
        localStorage.setItem('user_xp', String(newXp));
        const curBonus = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
        localStorage.setItem('studyBonusXp', String(curBonus + delta));

        let peakXp = parseInt(localStorage.getItem('study_peak_xp') || '0', 10) || 0;
        if (newXp > peakXp) {
            peakXp = newXp;
            localStorage.setItem('study_peak_xp', String(peakXp));
        }

        const elements = ['experience-total', 'profile-exp-badge', 'hero-xp-val', 'upgrade-user-xp', 'roulette-balance-display'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `${newXp} XP`;
        });

        const xpPerLevel = 100;
        const level = Math.floor(peakXp / xpPerLevel) + 1;
        const currentLevelXp = peakXp % xpPerLevel;
        const levelNames = ['Новичок', 'Ученик', 'Исследователь', 'Знаток', 'Мастер', 'Эксперт', 'Архитектор', 'Профессор', 'Квантовый разум', 'Легенда космоса'];
        const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];

        const expHeading = document.getElementById('experience-heading');
        if (expHeading) expHeading.textContent = `Уровень ${level} · ${levelName}`;
        const expProgress = document.getElementById('experience-progress');
        if (expProgress) expProgress.style.width = `${currentLevelXp}%`;
        const expBar = document.getElementById('experience-progressbar');
        if (expBar) expBar.setAttribute('aria-valuenow', String(currentLevelXp));
        const expDetail = document.getElementById('experience-detail');
        if (expDetail) {
            expDetail.textContent =
                `${currentLevelXp} из ${xpPerLevel} XP до Уровня ${level + 1} (рекорд: ${peakXp} XP) · осталось ${xpPerLevel - currentLevelXp} XP. За задачу: 2 XP за ошибочный ответ или 10 XP за верный.`;
        }

        syncHubDataToServer();
        return newXp;
    }

    function getBoostsInventory() {
        try {
            const raw = localStorage.getItem('study_boosts_inventory');
            const inv = raw ? JSON.parse(raw) : {};
            let changed = false;
            // Лимит на максимальное количество в наличии (не более 1 шт.)
            if (inv && typeof inv === 'object' && typeof inv.hw_pass === 'number' && inv.hw_pass > 1) {
                inv.hw_pass = 1;
                changed = true;
            }
            if (changed) {
                localStorage.setItem('study_boosts_inventory', JSON.stringify(inv));
            }
            return inv || {};
        } catch (e) {
            return {};
        }
    }

    function saveBoostsInventory(inv) {
        localStorage.setItem('study_boosts_inventory', JSON.stringify(inv));
        syncHubDataToServer();
    }

    function getTowerState() {
        try {
            const raw = localStorage.getItem('study_tower_state');
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    floor: parsed.floor || 1,
                    heroHp: parsed.heroHp !== undefined ? parsed.heroHp : 100,
                    heroMaxHp: parsed.heroMaxHp || 100,
                    heroAtk: parsed.heroAtk || 25,
                    heroCrit: parsed.heroCrit || 15,
                    heroShield: parsed.heroShield || 1,
                    currentShield: parsed.currentShield !== undefined ? parsed.currentShield : (parsed.heroShield || 1),
                    shards: parsed.shards || 0,
                    bestFloor: parsed.bestFloor || 1
                };
            }
        } catch (e) {}
        return {
            floor: 1,
            heroHp: 100,
            heroMaxHp: 100,
            heroAtk: 25,
            heroCrit: 15,
            heroShield: 1,
            currentShield: 1,
            shards: 0,
            bestFloor: 1
        };
    }

    function saveTowerState(state) {
        localStorage.setItem('study_tower_state', JSON.stringify(state));
        syncHubDataToServer();
    }

    async function syncHubDataToServer() {
        try {
            const boosts = getBoostsInventory();
            const tower = getTowerState();
            const xp = getUserTotalXp();
            const peak = parseInt(localStorage.getItem('study_peak_xp') || '0', 10) || xp;
            const bonus = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
            await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userXP: xp,
                    peakXp: peak,
                    bonusXp: bonus,
                    boostsInventory: boosts,
                    towerStats: tower
                })
            });
        } catch (e) {}
    }

    // --- Sub-navigation (Нейро-Лаборатория) ---
    function initSubnav() {
        const subnavBtns = document.querySelectorAll('.upgrade-subnav-btn');
        const sections = {
            collider: document.getElementById('upgrade-tab-collider'),
            techtree: document.getElementById('upgrade-tab-techtree'),
            holocabinet: document.getElementById('upgrade-tab-holocabinet'),
            inventory: document.getElementById('upgrade-tab-inventory'),
            tower: document.getElementById('upgrade-tab-tower')
        };

        subnavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetKey = btn.getAttribute('data-upgrade-tab');
                if (targetKey !== 'tower') {
                    stopTowerBattle();
                }
                subnavBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                Object.keys(sections).forEach(key => {
                    const sec = sections[key];
                    if (sec) {
                        sec.style.display = (key === targetKey) ? 'block' : 'none';
                    }
                });

                if (targetKey === 'collider') {
                    drawColliderWheel();
                    updateColliderStatusUI();
                } else if (targetKey === 'techtree') {
                    updateTechTreeUI();
                } else if (targetKey === 'holocabinet') {
                    renderHolocabinet();
                } else if (targetKey === 'inventory') {
                    renderInventoryView();
                } else if (targetKey === 'tower') {
                    renderTowerArena();
                }
            });
        });
    }

    // ==========================================================================
    // SECTION 1: QUANTUM COLLIDER (РУЛЕТКА 2.0 - КВАНТОВЫЙ КОЛЛАЙДЕР)
    // ==========================================================================
    const COLLIDER_SECTORS = [
        { id: 'xp_15', label: '+15 XP', type: 'xp', value: 15, bg1: '#0a192f', bg2: '#1d4ed8', border: '#3b82f6', icon: '⚡ +15 XP', title: 'Импульс энергии (+15 XP)' },
        { id: 'shield', label: 'Щит', type: 'boost', boostId: 'streak_shield', bg1: '#2a1106', bg2: '#c2410c', border: '#ff7728', icon: '🛡️ ЩИТ', title: 'Квантовый щит серии' },
        { id: 'xp_45', label: '+45 XP', type: 'xp', value: 45, bg1: '#042729', bg2: '#0891b2', border: '#06b6d4', icon: '⚡ +45 XP', title: 'Резонансный импульс (+45 XP)' },
        { id: 'time_freeze', label: 'Стазис', type: 'boost', boostId: 'time_freeze', bg1: '#261a04', bg2: '#b45309', border: '#f59e0b', icon: '⏱️ СТАЗИС', title: 'Хроно-стазис (+60с таймер)' },
        { id: 'xp_100', label: '+100 XP', type: 'xp', value: 100, bg1: '#043427', bg2: '#059669', border: '#10b981', icon: '⚡ +100 XP', title: 'Сгусток плазмы (+100 XP)' },
        { id: 'hint', label: 'Сканер', type: 'boost', boostId: 'hint', bg1: '#08212e', bg2: '#0284c7', border: '#38bdf8', icon: '🔍 СКАНЕР', title: 'Нейро-сканер шага' },
        { id: 'crystal', label: 'Кристалл', type: 'crystal', value: 50, bg1: '#1e0b42', bg2: '#7c3aed', border: '#8b5cf6', icon: '💎 +50 XP', title: 'Квантовый кристалл (+50 XP)' },
        { id: 'supernova', label: 'Сверхновая', type: 'supernova', value: 250, bg1: '#380419', bg2: '#be185d', border: '#ec4899', icon: '👑 250 XP', title: '👑 Вспышка Сверхновой (+250 XP & 2x XP)' }
    ];

    let colliderWheelAngle = 0;
    let isColliderSpinning = false;
    let lastColliderTickSector = -1;

    function isDailySpinReady() {
        const lastTs = parseInt(localStorage.getItem('study_last_free_spin_ts') || '0', 10);
        if (!lastTs) return true;
        return (Date.now() - lastTs) >= 24 * 60 * 60 * 1000;
    }

    function updateColliderStatusUI() {
        const balanceEl = document.getElementById('roulette-balance-display');
        const userXpEl = document.getElementById('upgrade-user-xp');
        const curXp = getUserTotalXp();
        if (balanceEl) balanceEl.textContent = `${curXp} XP`;
        if (userXpEl) userXpEl.textContent = `${curXp} XP`;

        const freeSpinCard = document.getElementById('roulette-free-spin-card');
        const freeSpinIndicator = document.getElementById('roulette-free-spin-indicator');
        const coreStatusText = document.getElementById('collider-core-status-text');

        const isFreeReady = isDailySpinReady();

        if (freeSpinCard) freeSpinCard.style.display = isFreeReady ? 'flex' : 'none';
        if (freeSpinIndicator) freeSpinIndicator.style.display = isFreeReady ? 'inline-flex' : 'none';

        if (coreStatusText) {
            if (isFreeReady) {
                coreStatusText.textContent = 'Готово к синтезу';
                coreStatusText.style.color = 'var(--accent-emerald)';
            } else {
                const lastTs = parseInt(localStorage.getItem('study_last_free_spin_ts') || '0', 10);
                const remainingMs = Math.max(0, (lastTs + 24 * 60 * 60 * 1000) - Date.now());
                const hoursLeft = Math.ceil(remainingMs / (1000 * 60 * 60));
                coreStatusText.textContent = `Зарядка (~${hoursLeft}ч)`;
                coreStatusText.style.color = 'var(--accent-gold)';
            }
        }
    }

    function drawColliderWheel() {
        const canvas = document.getElementById('roulette-wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = width / 2 - 14;
        const totalSectors = COLLIDER_SECTORS.length;
        const arc = (2 * Math.PI) / totalSectors;

        ctx.clearRect(0, 0, width, height);

        // Rotating wheel body
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(colliderWheelAngle);

        for (let i = 0; i < totalSectors; i++) {
            const s = COLLIDER_SECTORS[i];
            const startAngle = i * arc;
            const endAngle = startAngle + arc;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();

            // Sci-Fi radial gradient
            const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, radius);
            grad.addColorStop(0, s.bg1);
            grad.addColorStop(1, s.bg2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Fine divider line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Inner glowing sector border
            ctx.beginPath();
            ctx.arc(0, 0, radius - 4, startAngle + 0.05, endAngle - 0.05);
            ctx.strokeStyle = s.border;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label text & icon
            ctx.save();
            ctx.rotate(startAngle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13.5px "JetBrains Mono", system-ui, sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 6;
            ctx.fillText(s.icon, radius - 24, 5);
            ctx.restore();
        }

        // Outer Dark Titanium Precision Ring
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#1e293b';
        ctx.stroke();

        // Outer Neon Accent Glow Ring
        ctx.beginPath();
        ctx.arc(0, 0, radius + 2, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(44, 230, 214, 0.65)';
        ctx.shadowColor = 'rgba(44, 230, 214, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Telemetry Rivets / Division Ticks
        for (let r = 0; r < 32; r++) {
            const dotAngle = (r * 2 * Math.PI) / 32;
            const isMajor = (r % 4 === 0);
            const rOffset = isMajor ? 5 : 3;
            const dx1 = (radius - 1) * Math.cos(dotAngle);
            const dy1 = (radius - 1) * Math.sin(dotAngle);
            const dx2 = (radius - 1 - rOffset) * Math.cos(dotAngle);
            const dy2 = (radius - 1 - rOffset) * Math.sin(dotAngle);

            ctx.beginPath();
            ctx.moveTo(dx1, dy1);
            ctx.lineTo(dx2, dy2);
            ctx.lineWidth = isMajor ? 2 : 1;
            ctx.strokeStyle = isMajor ? '#2ce6d6' : 'rgba(255,255,255,0.4)';
            ctx.stroke();
        }

        ctx.restore();

        // Center Plasma Core Socket
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, 2 * Math.PI);
        const socketGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
        socketGrad.addColorStop(0, '#1e293b');
        socketGrad.addColorStop(1, '#090c13');
        ctx.fillStyle = socketGrad;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(44, 230, 214, 0.7)';
        ctx.stroke();
        ctx.restore();
    }

    function initCollider() {
        const freeSpinBtn = document.getElementById('btn-use-free-spin');
        const spinBtn = document.getElementById('btn-spin-roulette');

        if (freeSpinBtn) {
            freeSpinBtn.addEventListener('click', () => {
                startColliderSpin(true);
            });
        }

        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                startColliderSpin(false);
            });
        }

        updateColliderStatusUI();
        drawColliderWheel();
    }

    function startColliderSpin(isFree) {
        if (isColliderSpinning) return;

        const currentXp = getUserTotalXp();
        const cost = 30;

        if (!isFree) {
            if (currentXp < cost) {
                alert(`Недостаточно энергии XP! Стоимость калибровки — ${cost} XP, у вас ${currentXp} XP.`);
                return;
            }
            modifyUserXp(-cost);
        }

        isColliderSpinning = true;
        const spinBtn = document.getElementById('btn-spin-roulette');
        const freeSpinBtn = document.getElementById('btn-use-free-spin');
        const reticle = document.getElementById('roulette-pointer');

        if (spinBtn) spinBtn.disabled = true;
        if (freeSpinBtn) freeSpinBtn.disabled = true;

        // Balanced weights: no 0x loss!
        // [xp_15(26%), shield(14%), xp_45(20%), time_freeze(12%), xp_100(12%), hint(10%), crystal(4%), supernova(2%)]
        const weights = [26, 14, 20, 12, 12, 10, 4, 2];
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * totalWeight;
        let winIndex = 0;
        for (let i = 0; i < weights.length; i++) {
            if (rand < weights[i]) {
                winIndex = i;
                break;
            }
            rand -= weights[i];
        }

        const arc = (2 * Math.PI) / COLLIDER_SECTORS.length;
        const winCenter = winIndex * arc + arc / 2;
        const neededFinalAngle = (3 * Math.PI / 2 - winCenter);

        let delta = (neededFinalAngle - (colliderWheelAngle % (2 * Math.PI)));
        while (delta < 0) delta += 2 * Math.PI;
        const totalRotation = (8 + Math.floor(Math.random() * 2)) * (2 * Math.PI) + delta;

        const startAngle = colliderWheelAngle;
        const targetAngle = startAngle + totalRotation;
        const duration = 4300;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOutQuart(progress);

            colliderWheelAngle = startAngle + totalRotation * eased;

            // Reticle tick reaction & audio
            const currentSector = Math.floor(((3 * Math.PI / 2 - (colliderWheelAngle % (2 * Math.PI)) + 4 * Math.PI) % (2 * Math.PI)) / arc);
            if (currentSector !== lastColliderTickSector) {
                playTickSound();
                if (reticle) {
                    reticle.classList.add('tick');
                    setTimeout(() => reticle.classList.remove('tick'), 45);
                }
                lastColliderTickSector = currentSector;
            }

            drawColliderWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                colliderWheelAngle = targetAngle;
                drawColliderWheel();
                finishColliderSpin(winIndex, isFree);
            }
        }

        requestAnimationFrame(animate);
    }

    function finishColliderSpin(winIndex, isFree) {
        isColliderSpinning = false;
        const spinBtn = document.getElementById('btn-spin-roulette');
        const freeSpinBtn = document.getElementById('btn-use-free-spin');
        if (spinBtn) spinBtn.disabled = false;
        if (freeSpinBtn) freeSpinBtn.disabled = false;

        if (isFree) {
            localStorage.setItem('study_last_free_spin_ts', String(Date.now()));
            updateColliderStatusUI();
        }

        const sector = COLLIDER_SECTORS[winIndex];
        let historyLabel = '';

        if (sector.type === 'xp') {
            modifyUserXp(sector.value);
            playWinSound(sector.value >= 45);
            showHubToast(`⚡ Синтез успешен: получено +${sector.value} XP!`, 'success');
            historyLabel = `<span class="badge" style="background:rgba(44,230,214,0.18); color:var(--accent-cyan);">⚡ +${sector.value} XP</span>`;
        } else if (sector.type === 'boost') {
            const inv = getBoostsInventory();
            inv[sector.boostId] = (inv[sector.boostId] || 0) + 1;
            saveBoostsInventory(inv);
            playWinSound(true);
            showHubToast(`🎒 Получен модуль: ${sector.title}!`, 'success');
            historyLabel = `<span class="badge" style="background:rgba(255,119,40,0.18); color:var(--accent);">${sector.icon}</span>`;
        } else if (sector.type === 'crystal') {
            modifyUserXp(sector.value);
            const tower = getTowerState();
            tower.shards += 15;
            saveTowerState(tower);
            playWinSound(true);
            showHubToast(`💎 Квантовый кристалл: +${sector.value} XP и 15 осколков полигона!`, 'success');
            historyLabel = `<span class="badge" style="background:rgba(139,92,246,0.22); color:#8b5cf6;">💎 Кристалл</span>`;
        } else if (sector.type === 'supernova') {
            modifyUserXp(sector.value);
            const until = Math.max(Date.now(), parseInt(localStorage.getItem('study_buff_double_xp_until') || '0', 10)) + 30 * 60 * 1000;
            localStorage.setItem('study_buff_double_xp_until', String(until));
            playWinSound(true);
            showHubToast(`👑 СВЕРХНОВАЯ! +${sector.value} XP и 30 минут 2x XP!`, 'success');
            historyLabel = `<span class="badge" style="background:rgba(236,72,153,0.25); color:#ec4899;">👑 Сверхновая</span>`;
        }

        // Record history log
        const histContainer = document.getElementById('roulette-history-list');
        if (histContainer) {
            if (histContainer.textContent.includes('Пока нет')) {
                histContainer.innerHTML = '';
            }
            const item = document.createElement('div');
            item.innerHTML = historyLabel;
            histContainer.insertBefore(item.firstElementChild, histContainer.firstChild);
            while (histContainer.children.length > 8) {
                histContainer.removeChild(histContainer.lastChild);
            }
        }

        updateColliderStatusUI();
        renderInventoryView();
    }

    // ==========================================================================
    // SECTION 2: TECH TREE (ДРЕВО МОДУЛЕЙ И АУГМЕНТАЦИЙ)
    // ==========================================================================
    const BOOST_CATALOG = {
        streak_shield: { id: 'streak_shield', title: 'Квантовый щит', icon: '🛡️', price: 60, desc: 'Спасает комбо верных ответов в любом тренажёре.' },
        hw_pass: { 
            id: 'hw_pass', 
            title: 'Академический зачёт', 
            icon: '📜', 
            price: 400, 
            desc: '100% зачёт одного домашнего задания.',
            maxInventory: 1,
            maxMonthlyUsage: 2
        },
        double_xp: { id: 'double_xp', title: 'Катализатор Сверхновой', icon: '⚡', price: 100, desc: 'Удваивает XP в тренажёрах на 30 мин.' },
        hint: { id: 'hint', title: 'Нейро-сканер', icon: '🔍', price: 50, desc: 'Открывает разбор задачи без штрафа.' },
        time_freeze: { id: 'time_freeze', title: 'Хроно-стазис', icon: '⏱️', price: 50, desc: 'Останавливает таймер на 60 сек.' }
    };

    let zenAudioCtx = null;
    let zenOsc1 = null;
    let zenOsc2 = null;
    let zenGain = null;
    let isZenActive = false;

    function toggleZenAmbient() {
        const btn = document.getElementById('btn-toggle-zen');
        if (!isZenActive) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                zenAudioCtx = new AudioCtx();

                zenOsc1 = zenAudioCtx.createOscillator();
                zenOsc2 = zenAudioCtx.createOscillator();
                zenGain = zenAudioCtx.createGain();

                zenOsc1.type = 'sine';
                zenOsc1.frequency.setValueAtTime(108, zenAudioCtx.currentTime); // Deep warm cosmic root (A2)
                zenOsc2.type = 'triangle';
                zenOsc2.frequency.setValueAtTime(216, zenAudioCtx.currentTime); // Octave overtone

                zenGain.gain.setValueAtTime(0.001, zenAudioCtx.currentTime);
                zenGain.gain.exponentialRampToValueAtTime(0.08, zenAudioCtx.currentTime + 1.5);

                zenOsc1.connect(zenGain);
                zenOsc2.connect(zenGain);
                zenGain.connect(zenAudioCtx.destination);

                zenOsc1.start();
                zenOsc2.start();
                isZenActive = true;

                if (btn) {
                    btn.classList.add('active');
                    btn.textContent = '⏸️ Пауза эмбиента';
                }
                showHubToast('🎧 Дзен-режим активен: космический звуковой генератор запущен', 'info');
            } catch (e) {}
        } else {
            try {
                if (zenGain && zenAudioCtx) {
                    zenGain.gain.exponentialRampToValueAtTime(0.001, zenAudioCtx.currentTime + 0.6);
                    setTimeout(() => {
                        try {
                            if (zenOsc1) zenOsc1.stop();
                            if (zenOsc2) zenOsc2.stop();
                            if (zenAudioCtx) zenAudioCtx.close();
                        } catch(err) {}
                    }, 650);
                }
                isZenActive = false;
                if (btn) {
                    btn.classList.remove('active');
                    btn.textContent = '🔊 Слушать эмбиент';
                }
                showHubToast('Дзен-эмбиент приостановлен', 'info');
            } catch (e) {}
        }
    }

    function updateTechTreeUI() {
        const xpEl = document.getElementById('techtree-user-xp');
        if (xpEl) xpEl.textContent = `${getUserTotalXp()} XP`;

        const inv = getBoostsInventory();
        const hwPassQty = Math.max(0, inv.hw_pass || 0);
        const monthlyUsed = window.getHwPassMonthlyUsageCount ? window.getHwPassMonthlyUsageCount() : 0;

        const stockEl = document.getElementById('hw-pass-current-stock');
        if (stockEl) stockEl.textContent = `${hwPassQty}/1`;
        const stockPill = document.getElementById('hw-pass-stock-limit');
        if (stockPill) {
            stockPill.classList.toggle('limit-reached', hwPassQty >= 1);
        }

        const monthEl = document.getElementById('hw-pass-month-usage');
        if (monthEl) monthEl.textContent = `${monthlyUsed}/2`;
        const monthPill = document.getElementById('hw-pass-monthly-limit');
        if (monthPill) {
            monthPill.classList.toggle('limit-reached', monthlyUsed >= 2);
        }

        const hwBuyBtn = document.querySelector('.btn-buy-boost[data-boost-id="hw_pass"]');
        if (hwBuyBtn) {
            if (hwPassQty >= 1) {
                hwBuyBtn.disabled = true;
                hwBuyBtn.style.opacity = '0.6';
                hwBuyBtn.style.cursor = 'not-allowed';
                hwBuyBtn.textContent = 'В наличии (макс. 1)';
                hwBuyBtn.title = 'У вас уже есть 1 шт. в наличии (лимит: не более 1 шт.). Сначала используйте её для Д/З.';
            } else {
                hwBuyBtn.disabled = false;
                hwBuyBtn.style.opacity = '';
                hwBuyBtn.style.cursor = '';
                hwBuyBtn.textContent = 'Синтезировать';
                hwBuyBtn.title = 'Синтезировать модуль «Академический зачёт» (макс. 1 шт. в наличии)';
            }
        }
    }

    function initTechTree() {
        const buyBtns = document.querySelectorAll('.btn-buy-boost');
        buyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const boostId = btn.getAttribute('data-boost-id');
                const price = parseInt(btn.getAttribute('data-boost-price'), 10);
                const curXp = getUserTotalXp();

                if (boostId === 'hw_pass') {
                    const inv = getBoostsInventory();
                    const currentQty = inv.hw_pass || 0;
                    if (currentQty >= 1) {
                        alert('Ограничение предмета «Академический зачёт»:\nВ наличии уже есть 1 шт. Нельзя иметь более 1 шт. одновременно.\nСначала используйте текущий свиток для списания домашнего задания.');
                        return;
                    }
                }

                if (curXp < price) {
                    alert(`Недостаточно энергии XP! Стоимость модуля: ${price} XP, у вас ${curXp} XP.`);
                    return;
                }

                modifyUserXp(-price);

                if (boostId === 'double_xp') {
                    const until = Math.max(Date.now(), parseInt(localStorage.getItem('study_buff_double_xp_until') || '0', 10)) + 30 * 60 * 1000;
                    localStorage.setItem('study_buff_double_xp_until', String(until));
                    showHubToast('⚡ Катализатор активирован! 30 минут 2x XP!', 'success');
                } else {
                    const inv = getBoostsInventory();
                    if (boostId === 'hw_pass') {
                        inv.hw_pass = Math.min(1, (inv.hw_pass || 0) + 1);
                    } else {
                        inv[boostId] = (inv[boostId] || 0) + 1;
                    }
                    saveBoostsInventory(inv);
                    const b = BOOST_CATALOG[boostId];
                    showHubToast(`🧬 Модуль интегрирован: ${b ? b.title : boostId}!`, 'success');
                }

                updateTechTreeUI();
                renderInventoryView();
            });
        });

        const zenBtn = document.getElementById('btn-toggle-zen');
        if (zenBtn) {
            zenBtn.addEventListener('click', toggleZenAmbient);
        }

        updateTechTreeUI();
    }

    // ==========================================================================
    // SECTION 3: HOLOCABINET (АУГМЕНТАЦИИ И КАСТОМИЗАЦИЯ АВАТАРА)
    // ==========================================================================
    const HOLO_FRAMES = [
        {
            id: 'orbit',
            name: 'Классическая орбита',
            desc: 'Базовый гироскопический стабилизатор исследователя НЕШколы. Открыт по умолчанию.',
            price: 0,
            reqLabel: 'Доступна сразу',
            checkUnlocked: () => true
        },
        {
            id: 'neon',
            name: 'Квантовый неон',
            desc: 'Светящийся бирюзово-фиолетовый ореол, полученный за точность и регулярность вычислений.',
            price: 150,
            reqLabel: '10 верных ответов или 150 XP',
            checkUnlocked: (stats) => stats.correctCount >= 10 || (localStorage.getItem('study_unlocked_frame_neon') === 'true')
        },
        {
            id: 'emerald',
            name: 'Изумрудный кристалл',
            desc: 'Кристаллизованная матрица устойчивости, выдаваемая за длинные серии побед в тренажерах.',
            price: 250,
            reqLabel: 'Серия 15 или 250 XP',
            checkUnlocked: (stats) => stats.maxTrainerStreak >= 15 || (localStorage.getItem('study_unlocked_frame_emerald') === 'true')
        },
        {
            id: 'solar',
            name: 'Золотая сингулярность',
            desc: 'Янтарный плазменный диск, подтверждающий исключительную математическую концентрацию.',
            price: 400,
            reqLabel: 'Серия 25 или 400 XP',
            checkUnlocked: (stats) => stats.maxTrainerStreak >= 25 || (localStorage.getItem('study_unlocked_frame_solar') === 'true')
        },
        {
            id: 'cosmic',
            name: 'Гравитационный разлом',
            desc: 'Глубокий пурпурно-космический вихрь искажения пространства для опытных исследователей.',
            price: 600,
            reqLabel: '5 уровень или 600 XP',
            checkUnlocked: (stats) => stats.level >= 5 || (localStorage.getItem('study_unlocked_frame_cosmic') === 'true')
        },
        {
            id: 'gargantua',
            name: 'Чёрная дыра Гаргантюа',
            desc: 'Легендарное релятивистское кольцо с фотонной сферой. Абсолютный статус высшего разума.',
            price: 1000,
            reqLabel: '9 уровень или 1000 XP',
            checkUnlocked: (stats) => stats.level >= 9 || (localStorage.getItem('study_unlocked_frame_gargantua') === 'true')
        }
    ];

    let selectedHoloFrameId = localStorage.getItem('profileAvatarFrame') || 'orbit';

    function getLocalUnlockStats() {
        let correctCount = 0;
        let maxTrainerStreak = 0;
        try {
            const raw = localStorage.getItem('studyMetrics');
            const attempts = raw ? JSON.parse(raw) : [];
            if (Array.isArray(attempts)) {
                attempts.forEach(a => { if (a && a.correct) correctCount++; });
            }
        } catch (e) {}
        try {
            const rawTrackers = localStorage.getItem('study_trainer_trackers');
            if (rawTrackers) {
                const trackers = JSON.parse(rawTrackers);
                Object.values(trackers).forEach(t => {
                    if (t && typeof t.streak === 'number' && t.streak > maxTrainerStreak) {
                        maxTrainerStreak = t.streak;
                    }
                });
            }
        } catch (e) {}
        const xp = getUserTotalXp();
        const level = Math.floor(xp / 100) + 1;
        return { correctCount, maxTrainerStreak, level, xp };
    }

    function renderHolocabinet() {
        const grid = document.getElementById('holo-frames-list');
        const activeFrame = localStorage.getItem('profileAvatarFrame') || 'orbit';
        const activeBadgeName = document.getElementById('holo-active-frame-name');
        const curConfig = HOLO_FRAMES.find(f => f.id === activeFrame) || HOLO_FRAMES[0];
        if (activeBadgeName) activeBadgeName.textContent = curConfig.name;

        updateHolocabinetStage(selectedHoloFrameId);

        if (!grid) return;
        const stats = getLocalUnlockStats();

        grid.innerHTML = HOLO_FRAMES.map(f => {
            const isUnlocked = f.checkUnlocked(stats);
            const isEquipped = (f.id === activeFrame);
            const isSelected = (f.id === selectedHoloFrameId);

            return `
                <div class="holo-frame-item ${isEquipped ? 'active' : ''} ${!isUnlocked ? 'is-locked' : ''} ${isSelected ? 'selected' : ''}" data-frame-choice="${f.id}">
                    <div class="avatar-wrap" data-frame="${f.id}" style="width: 58px; height: 58px; pointer-events: none;">
                        <div class="avatar-ring" aria-hidden="true"></div>
                        <div class="avatar-placeholder" style="width: 48px; height: 48px; font-size: 1.25rem;">У</div>
                    </div>
                    <div style="flex:1;">
                        <h5 class="holo-frame-name">${f.name}</h5>
                        <div class="holo-frame-req">${f.reqLabel}</div>
                    </div>
                    <span class="holo-frame-status ${isUnlocked ? 'status-unlocked' : 'status-locked'}">
                        ${isEquipped ? '✓ Надето' : (isUnlocked ? 'Открыто' : `🔒 ${f.price} XP`)}
                    </span>
                </div>
            `;
        }).join('');

        const items = grid.querySelectorAll('.holo-frame-item');
        items.forEach(el => {
            el.addEventListener('click', () => {
                const fId = el.getAttribute('data-frame-choice');
                if (fId) {
                    selectedHoloFrameId = fId;
                    renderHolocabinet();
                }
            });
        });

        const equipBtn = document.getElementById('btn-holo-equip-frame');
        if (equipBtn) {
            equipBtn.onclick = () => {
                const chosen = HOLO_FRAMES.find(f => f.id === selectedHoloFrameId);
                if (!chosen) return;
                const currentStats = getLocalUnlockStats();
                const isAlreadyUnlocked = chosen.checkUnlocked(currentStats);

                if (!isAlreadyUnlocked) {
                    // Try to unlock with XP
                    if (currentStats.xp < chosen.price) {
                        alert(`Рамка «${chosen.name}» заблокирована!\nТребование: ${chosen.reqLabel}.\nЛибо накопите ${chosen.price} XP (сейчас у вас ${currentStats.xp} XP).`);
                        return;
                    }
                    if (confirm(`Разблокировать рамку «${chosen.name}» за ${chosen.price} XP?`)) {
                        modifyUserXp(-chosen.price);
                        localStorage.setItem(`study_unlocked_frame_${chosen.id}`, 'true');
                        applyAvatarFrameEverywhere(chosen.id);
                        showHubToast(`✨ Рамка «${chosen.name}» разблокирована и надета!`, 'success');
                        renderHolocabinet();
                    }
                } else {
                    applyAvatarFrameEverywhere(chosen.id);
                    showHubToast(`🛰️ Орбита «${chosen.name}» активирована!`, 'success');
                    renderHolocabinet();
                }
            };
        }
    }

    function updateHolocabinetStage(frameId) {
        const stageAvatar = document.getElementById('holo-preview-avatar');
        const titleEl = document.getElementById('holo-selected-frame-title');
        const descEl = document.getElementById('holo-selected-frame-desc');
        const equipBtn = document.getElementById('btn-holo-equip-frame');
        const config = HOLO_FRAMES.find(f => f.id === frameId) || HOLO_FRAMES[0];

        if (stageAvatar) stageAvatar.setAttribute('data-frame', config.id);
        if (titleEl) titleEl.textContent = config.name;
        if (descEl) descEl.textContent = config.desc;

        if (equipBtn) {
            const currentActive = localStorage.getItem('profileAvatarFrame') || 'orbit';
            const stats = getLocalUnlockStats();
            const isUnlocked = config.checkUnlocked(stats);

            if (config.id === currentActive) {
                equipBtn.textContent = '✓ Уже надето';
                equipBtn.disabled = true;
                equipBtn.className = 'btn btn-secondary';
            } else if (isUnlocked) {
                equipBtn.textContent = '✓ Надеть на профиль';
                equipBtn.disabled = false;
                equipBtn.className = 'btn btn-emerald';
            } else {
                equipBtn.textContent = `⚡ Разблокировать за ${config.price} XP`;
                equipBtn.disabled = false;
                equipBtn.className = 'btn btn-emerald';
            }
        }
    }

    function applyAvatarFrameEverywhere(frameId) {
        localStorage.setItem('profileAvatarFrame', frameId);
        const heroWrap = document.getElementById('avatar-container');
        if (heroWrap) heroWrap.setAttribute('data-frame', frameId);
        const previewWrap = document.getElementById('custom-preview-avatar-wrap');
        if (previewWrap) previewWrap.setAttribute('data-frame', frameId);
        const badge = document.getElementById('frame-active-badge');
        const config = HOLO_FRAMES.find(f => f.id === frameId);
        if (badge && config) badge.textContent = config.name;
    }

    // ==========================================================================
    // SECTION 4: INVENTORY & ACTIVE BUFFS
    // ==========================================================================
    function initInventory() {
        renderInventoryView();
        startBuffTimer();
    }

    function renderInventoryView() {
        const wrap = document.getElementById('boost-inventory-items-wrap');
        const badgeCount = document.getElementById('upgrade-boosts-count');
        const inv = getBoostsInventory();

        let totalItems = 0;
        Object.keys(inv).forEach(k => { totalItems += (inv[k] || 0); });
        if (badgeCount) badgeCount.textContent = `${totalItems} шт.`;

        if (!wrap) return;

        const monthlyUsed = window.getHwPassMonthlyUsageCount ? window.getHwPassMonthlyUsageCount() : 0;
        const boostKeys = Object.keys(BOOST_CATALOG);
        wrap.innerHTML = boostKeys.map(k => {
            const b = BOOST_CATALOG[k];
            const qty = inv[k] || 0;
            const isZero = (qty === 0);

            let actionHtml = '';
            let limitHtml = '';
            if (k === 'hw_pass') {
                const isMonthLimitReached = (monthlyUsed >= 2);
                limitHtml = `
                    <div class="techtree-limits-badge-wrap" style="margin-top:6px;">
                        <span class="techtree-limit-pill stock-limit ${qty >= 1 ? 'limit-reached' : ''}" title="Ограничение склада: не более 1 шт. в наличии">
                            📦 В наличии: <strong>${qty}/1</strong>
                        </span>
                        <span class="techtree-limit-pill month-limit ${isMonthLimitReached ? 'limit-reached' : ''}" title="Ограничение применения: не более 2 раз за месяц">
                            📅 В этом месяце: <strong>${monthlyUsed}/2</strong>
                        </span>
                    </div>
                `;

                if (qty > 0) {
                    if (isMonthLimitReached) {
                        actionHtml = `
                            <div style="margin-top:6px;">
                                <span class="badge" style="background:rgba(239,68,68,0.14); color:#ef4444; font-size:0.74rem; border:1px solid rgba(239,68,68,0.3); padding:3px 8px; border-radius:6px; display:inline-block;">
                                    ⚠️ Лимит на текущий месяц (2/2) исчерпан
                                </span>
                            </div>
                        `;
                    } else {
                        const remaining = 2 - monthlyUsed;
                        actionHtml = `<button type="button" class="btn btn-secondary btn-sm" style="margin-top:6px; font-size:0.75rem;" onclick="if(window.switchProfileTab){window.switchProfileTab('study');}">Использовать в Д/З (осталось ${remaining})</button>`;
                    }
                }
            }

            return `
                <div class="boost-inventory-item" style="opacity: ${isZero ? 0.45 : 1};">
                    <div class="boost-inv-icon">${b.icon}</div>
                    <div style="flex:1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                            <span>${b.title}</span>
                            <span class="badge" style="background: rgba(44,230,214,0.15); color: var(--accent-cyan); flex-shrink: 0; white-space: nowrap;">${qty} шт.</span>
                        </div>
                        <div style="font-size: 0.76rem; color: var(--muted-bright); margin-top: 2px;">${b.desc}</div>
                        ${limitHtml}
                        ${actionHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    let buffInterval = null;
    function startBuffTimer() {
        if (buffInterval) clearInterval(buffInterval);
        buffInterval = setInterval(() => {
            const until = parseInt(localStorage.getItem('study_buff_double_xp_until') || '0', 10);
            const indicator = document.getElementById('active-buff-indicator');
            const timerText = document.getElementById('buff-timer-text');

            if (until > Date.now()) {
                const diffSec = Math.floor((until - Date.now()) / 1000);
                const m = Math.floor(diffSec / 60);
                const s = diffSec % 60;
                if (indicator) indicator.style.display = 'inline-flex';
                if (timerText) timerText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
            } else {
                if (indicator) indicator.style.display = 'none';
            }
        }, 1000);
    }

    // --- SECTION 3: TOWER OF KNOWLEDGE (RPG ROGUELIKE) ---
    let currentTowerMonster = null;
    let currentTowerQuestion = null;
    let towerQuestionStartTime = Date.now();
    let towerTimerInterval = null;
    let towerTimeLeft = 15;
    let isTowerBattleActive = false;

    const MONSTER_ROSTER = [
        { title: 'Гоблин-счетовод', icon: '👾' },
        { title: 'Мышь-процентщик', icon: '🦇' },
        { title: 'Волк-алгебраист', icon: '🐺' },
        { title: 'Каменный Монолит', icon: '🗿' },
        { title: 'Змей-логарифм', icon: '🐍' },
        { title: 'Тёмный Пифагор', icon: '🧙‍♂️' },
        { title: 'Вампир Уравнений', icon: '🧛' }
    ];

    const BOSS_ROSTER = [
        { title: 'Дракон Простых Чисел', icon: '🐉' },
        { title: 'Архимаг Факториалов', icon: '👑' },
        { title: 'Повелитель Бесконечности', icon: '🌌' },
        { title: 'Сфинкс Стереометрии', icon: '🦁' },
        { title: 'Титан Математического Анализа', icon: '⚡' }
    ];

    function spawnTowerMonster(floor) {
        const isBoss = (floor % 5 === 0);
        let mInfo;
        if (isBoss) {
            const idx = Math.floor((floor / 5 - 1)) % BOSS_ROSTER.length;
            mInfo = BOSS_ROSTER[idx];
        } else {
            const idx = (floor - 1) % MONSTER_ROSTER.length;
            mInfo = MONSTER_ROSTER[idx];
        }

        const maxHp = isBoss 
            ? Math.round((70 + floor * 26) * 1.8) 
            : (45 + floor * 16);
        const atk = isBoss
            ? (16 + Math.floor(floor * 3.5))
            : (10 + Math.floor(floor * 2));

        return {
            title: isBoss ? `👑 [БОСС] ${mInfo.title}` : mInfo.title,
            icon: mInfo.icon,
            isBoss: isBoss,
            maxHp: maxHp,
            currentHp: maxHp,
            atk: atk
        };
    }

    function generateTowerQuestion(floor) {
        const types = [];
        if (floor <= 3) {
            types.push('add_sub', 'mult_div');
        } else if (floor <= 7) {
            types.push('add_sub', 'mult_div', 'power', 'linear', 'percent');
        } else {
            types.push('mult_div', 'power', 'linear', 'percent', 'fraction_mult', 'two_step');
        }
        const type = types[Math.floor(Math.random() * types.length)];
        let prompt = '';
        let answer = 0;

        if (type === 'add_sub') {
            const isAdd = Math.random() > 0.4;
            const a = Math.floor(Math.random() * (35 + floor * 4)) + 12;
            const b = Math.floor(Math.random() * (35 + floor * 4)) + 8;
            if (isAdd) {
                prompt = `${a} + ${b} = ?`;
                answer = a + b;
            } else {
                const big = Math.max(a, b);
                const small = Math.min(a, b);
                prompt = `${big} - ${small} = ?`;
                answer = big - small;
            }
        } else if (type === 'mult_div') {
            const isMult = Math.random() > 0.4;
            const a = Math.floor(Math.random() * 9) + 3;
            const b = Math.floor(Math.random() * 9) + 3;
            if (isMult) {
                prompt = `${a} × ${b} = ?`;
                answer = a * b;
            } else {
                const prod = a * b;
                prompt = `${prod} : ${a} = ?`;
                answer = b;
            }
        } else if (type === 'power') {
            const isSquare = Math.random() > 0.5;
            if (isSquare) {
                const base = Math.floor(Math.random() * 8) + 4;
                prompt = `${base}² = ?`;
                answer = base * base;
            } else {
                const base = Math.floor(Math.random() * 10) + 4;
                const sq = base * base;
                prompt = `√${sq} = ?`;
                answer = base;
            }
        } else if (type === 'linear') {
            const x = Math.floor(Math.random() * 10) + 2;
            const a = Math.floor(Math.random() * 4) + 2;
            const b = Math.floor(Math.random() * 15) + 3;
            const c = a * x + b;
            prompt = `${a}x + ${b} = ${c} (x = ?)`;
            answer = x;
        } else if (type === 'percent') {
            const pcts = [10, 20, 25, 50];
            const pct = pcts[Math.floor(Math.random() * pcts.length)];
            const mult = Math.floor(Math.random() * 8) + 2;
            const val = mult * (100 / (pct === 25 ? 25 : (pct === 50 ? 50 : 10)));
            prompt = `${pct}% от ${val} = ?`;
            answer = Math.round((pct / 100) * val);
        } else if (type === 'fraction_mult') {
            const den = [3, 4, 5][Math.floor(Math.random() * 3)];
            const num = Math.floor(Math.random() * (den - 1)) + 1;
            const k = Math.floor(Math.random() * 6) + 2;
            const total = den * k;
            prompt = `(${num}/${den}) × ${total} = ?`;
            answer = num * k;
        } else {
            const a = Math.floor(Math.random() * 8) + 3;
            const b = Math.floor(Math.random() * 8) + 2;
            const c = Math.floor(Math.random() * 4) + 2;
            prompt = `(${a} + ${b}) × ${c} = ?`;
            answer = (a + b) * c;
        }

        return { prompt, answer: String(answer) };
    }

    function renderTowerArena() {
        const state = getTowerState();

        const currentFloorEl = document.getElementById('tower-current-floor');
        const shardsEl = document.getElementById('tower-shards-count');
        const recordEl = document.getElementById('upgrade-tower-record');
        if (currentFloorEl) currentFloorEl.textContent = state.floor;
        if (shardsEl) shardsEl.textContent = state.shards;
        if (recordEl) recordEl.textContent = `${state.bestFloor} этаж`;

        // Hero stats
        const heroHpText = document.getElementById('tower-hero-hp-text');
        const heroHpBar = document.getElementById('tower-hero-hp-bar');
        const heroAtkEl = document.getElementById('tower-hero-atk');
        const heroCritEl = document.getElementById('tower-hero-crit');
        const heroDefEl = document.getElementById('tower-hero-def');

        if (heroHpText) heroHpText.textContent = `${state.heroHp} / ${state.heroMaxHp} HP`;
        if (heroHpBar) {
            const pct = Math.max(0, Math.min(100, Math.round((state.heroHp / state.heroMaxHp) * 100)));
            heroHpBar.style.width = `${pct}%`;
        }
        if (heroAtkEl) heroAtkEl.textContent = state.heroAtk;
        if (heroCritEl) heroCritEl.textContent = `${state.heroCrit}%`;
        if (heroDefEl) heroDefEl.textContent = `${state.currentShield} (базовый ${state.heroShield})`;

        // Spawn monster if missing
        if (!currentTowerMonster) {
            currentTowerMonster = spawnTowerMonster(state.floor);
        }

        const mTitle = document.getElementById('tower-monster-title');
        const mIcon = document.getElementById('tower-monster-icon');
        const mHpText = document.getElementById('tower-monster-hp-text');
        const mHpBar = document.getElementById('tower-monster-hp-bar');

        if (mTitle) mTitle.textContent = currentTowerMonster.title;
        if (mIcon) mIcon.textContent = currentTowerMonster.icon;
        if (mHpText) mHpText.textContent = `${currentTowerMonster.currentHp} / ${currentTowerMonster.maxHp} HP`;
        if (mHpBar) {
            const mPct = Math.max(0, Math.min(100, Math.round((currentTowerMonster.currentHp / currentTowerMonster.maxHp) * 100)));
            mHpBar.style.width = `${mPct}%`;
        }

        const startBtn = document.getElementById('btn-tower-start');
        const activeControls = document.getElementById('tower-active-controls');
        const kicker = document.getElementById('tower-stage-kicker');
        const probText = document.getElementById('tower-problem-text');

        if (!isTowerBattleActive) {
            if (startBtn) {
                startBtn.style.display = 'inline-flex';
                if (!startBtn.textContent || startBtn.textContent.trim() === '' || startBtn.textContent.includes('Атаковать')) {
                    startBtn.textContent = `▶️ Начать бой (${state.floor} этаж)`;
                }
            }
            if (activeControls) activeControls.style.display = 'none';

            if (kicker) {
                kicker.textContent = currentTowerQuestion
                    ? 'Битва приостановлена · Страж ждёт продолжения'
                    : 'Страж этажа ждёт вашего вызова!';
            }
            if (probText) {
                probText.textContent = currentTowerQuestion
                    ? `Нажмите «Начать», чтобы продолжить бой на ${state.floor} этаже!`
                    : `Нажмите «Начать», чтобы бросить вызов стражу ${state.floor} этажа!`;
            }

            towerTimeLeft = 15;
            updateTowerTimerUI();
        } else {
            if (startBtn) startBtn.style.display = 'none';
            if (activeControls) activeControls.style.display = 'flex';

            if (!currentTowerQuestion) {
                currentTowerQuestion = generateTowerQuestion(state.floor);
                towerQuestionStartTime = Date.now();
                startTowerTimer();
            }

            if (kicker) kicker.textContent = 'Реши задачу быстрее 3 сек для критического удара 200%!';
            if (probText) probText.textContent = currentTowerQuestion.prompt;
        }
    }

    function startTowerBattle() {
        isTowerBattleActive = true;
        const state = getTowerState();

        if (!currentTowerMonster) {
            currentTowerMonster = spawnTowerMonster(state.floor);
        }
        if (!currentTowerQuestion) {
            currentTowerQuestion = generateTowerQuestion(state.floor);
        }

        towerQuestionStartTime = Date.now();
        startTowerTimer();

        const startBtn = document.getElementById('btn-tower-start');
        const activeControls = document.getElementById('tower-active-controls');
        const kicker = document.getElementById('tower-stage-kicker');
        const probText = document.getElementById('tower-problem-text');
        const answerInput = document.getElementById('tower-user-answer');

        if (startBtn) startBtn.style.display = 'none';
        if (activeControls) activeControls.style.display = 'flex';
        if (kicker) kicker.textContent = 'Реши задачу быстрее 3 сек для критического удара 200%!';
        if (probText) probText.textContent = currentTowerQuestion.prompt;

        renderTowerArena();
        if (answerInput) {
            answerInput.focus();
        }
    }

    function stopTowerBattle() {
        if (towerTimerInterval) {
            clearInterval(towerTimerInterval);
            towerTimerInterval = null;
        }
        isTowerBattleActive = false;

        const startBtn = document.getElementById('btn-tower-start');
        const activeControls = document.getElementById('tower-active-controls');
        const kicker = document.getElementById('tower-stage-kicker');
        const probText = document.getElementById('tower-problem-text');
        const state = getTowerState();

        if (startBtn) {
            startBtn.style.display = 'inline-flex';
            startBtn.textContent = `▶️ Начать бой (${state.floor} этаж)`;
        }
        if (activeControls) {
            activeControls.style.display = 'none';
        }
        if (kicker) kicker.textContent = 'Битва приостановлена';
        if (probText) probText.textContent = 'Нажмите «Начать», чтобы продолжить бой!';

        towerTimeLeft = 15;
        updateTowerTimerUI();
    }
    window.stopTowerBattle = stopTowerBattle;

    function startTowerTimer() {
        if (towerTimerInterval) clearInterval(towerTimerInterval);
        towerTimeLeft = 15;
        updateTowerTimerUI();

        towerTimerInterval = setInterval(() => {
            if (!isTowerBattleActive) {
                clearInterval(towerTimerInterval);
                towerTimerInterval = null;
                return;
            }
            towerTimeLeft--;
            updateTowerTimerUI();
            if (towerTimeLeft <= 0) {
                clearInterval(towerTimerInterval);
                towerTimerInterval = null;
                handleTowerTimeout();
            }
        }, 1000);
    }

    function updateTowerTimerUI() {
        const secEl = document.getElementById('tower-timer-sec');
        const barEl = document.getElementById('tower-timer-bar');
        if (secEl) secEl.textContent = `${towerTimeLeft}с`;
        if (barEl) {
            const pct = Math.max(0, Math.min(100, Math.round((towerTimeLeft / 15) * 100)));
            barEl.style.width = `${pct}%`;
        }
    }

    function handleTowerSubmit() {
        if (!isTowerBattleActive) return;
        const input = document.getElementById('tower-user-answer');
        if (!input || !currentTowerQuestion || !currentTowerMonster) return;

        const raw = input.value.trim().replace(',', '.');
        if (!raw) return;

        input.value = '';
        const state = getTowerState();
        const timeSpent = (Date.now() - towerQuestionStartTime) / 1000;

        if (raw === currentTowerQuestion.answer) {
            // Correct answer!
            const isCrit = (timeSpent <= 3.0) || (Math.random() * 100 < state.heroCrit);
            const dmg = isCrit ? (state.heroAtk * 2) : state.heroAtk;
            currentTowerMonster.currentHp -= dmg;
            playHitSound(isCrit);

            const arenaBox = document.getElementById('tower-arena-box');
            if (arenaBox) {
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.top = '10px';
                flash.style.right = '20px';
                flash.style.fontWeight = '900';
                flash.style.fontSize = '1.3rem';
                flash.style.color = isCrit ? '#f59e0b' : '#10b981';
                flash.textContent = isCrit ? `💥 КРИТ! -${dmg}` : `⚔️ -${dmg}`;
                flash.style.transition = 'all 0.8s ease-out';
                arenaBox.style.position = 'relative';
                arenaBox.appendChild(flash);
                setTimeout(() => {
                    flash.style.opacity = '0';
                    flash.style.transform = 'translateY(-20px)';
                    setTimeout(() => flash.remove(), 800);
                }, 50);
            }

            if (currentTowerMonster.currentHp <= 0) {
                // Monster Defeated!
                clearInterval(towerTimerInterval);
                towerTimerInterval = null;
                isTowerBattleActive = false; // Next floor requires clicking Start!

                const shardsWon = currentTowerMonster.isBoss ? (25 + state.floor * 5) : (6 + Math.floor(state.floor * 1.5));
                const xpWon = currentTowerMonster.isBoss ? (60 + state.floor * 12) : (15 + state.floor * 3);

                state.shards += shardsWon;
                state.floor += 1;
                state.bestFloor = Math.max(state.bestFloor, state.floor);
                state.currentShield = state.heroShield; // refresh shield on new floor

                saveTowerState(state);
                modifyUserXp(xpWon);
                playWinSound(true);

                showHubToast(`🏆 Победа над ${currentTowerMonster.title}! +${shardsWon} 💎, +${xpWon} XP!`, 'success');
                currentTowerMonster = null;
                currentTowerQuestion = null;

                towerTimeLeft = 15;
                updateTowerTimerUI();

                const startBtn = document.getElementById('btn-tower-start');
                if (startBtn) {
                    startBtn.textContent = `▶️ Начать бой (${state.floor} этаж)`;
                }

                setTimeout(() => {
                    renderTowerArena();
                }, 800);
            } else {
                // Next question for same monster
                currentTowerQuestion = generateTowerQuestion(state.floor);
                towerQuestionStartTime = Date.now();
                startTowerTimer();
                renderTowerArena();
            }
        } else {
            // Wrong answer!
            handleMonsterAttack();
        }
    }

    function handleTowerTimeout() {
        if (!isTowerBattleActive) return;
        showHubToast('⏱️ Время вышло! Страж атакует!', 'info');
        handleMonsterAttack();
    }

    function handleMonsterAttack() {
        if (!isTowerBattleActive) return;
        const state = getTowerState();
        if (!currentTowerMonster) return;

        if (state.currentShield > 0) {
            state.currentShield -= 1;
            saveTowerState(state);
            playShieldSound();
            showHubToast(`🛡️ Щит заблокировал удар монстра! Осталось щитов: ${state.currentShield}`, 'info');
        } else {
            state.heroHp -= currentTowerMonster.atk;
            playHitSound(false);

            if (state.heroHp <= 0) {
                // Hero fallen!
                clearInterval(towerTimerInterval);
                towerTimerInterval = null;
                isTowerBattleActive = false;

                alert(`💀 Вы пали на ${state.floor} этаже! Забег завершён.\nРекорд башни: ${state.bestFloor} этаж.\nВсе накопленные 💎 осколки и прокачанные характеристики сохранены!`);

                state.floor = 1;
                state.heroHp = state.heroMaxHp;
                state.currentShield = state.heroShield;
                saveTowerState(state);

                currentTowerMonster = null;
                currentTowerQuestion = null;

                const startBtn = document.getElementById('btn-tower-start');
                if (startBtn) {
                    startBtn.textContent = '▶️ Начать забег (1 этаж)';
                }
                towerTimeLeft = 15;
                updateTowerTimerUI();

                renderTowerArena();
                return;
            } else {
                saveTowerState(state);
                showHubToast(`💥 Монстр нанёс вам ${currentTowerMonster.atk} урона!`, 'info');
            }
        }

        currentTowerQuestion = generateTowerQuestion(state.floor);
        towerQuestionStartTime = Date.now();
        startTowerTimer();
        renderTowerArena();
    }

    function initTowerUpgrades() {
        const startBtn = document.getElementById('btn-tower-start');
        if (startBtn) {
            startBtn.addEventListener('click', startTowerBattle);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopTowerBattle();
            }
        });

        const upgradeBtns = [
            { id: 'btn-upgrade-atk', cost: 20, apply: s => { s.heroAtk += 5; } },
            { id: 'btn-upgrade-hp', cost: 20, apply: s => { s.heroMaxHp += 25; s.heroHp = Math.min(s.heroMaxHp, s.heroHp + 25); } },
            { id: 'btn-upgrade-crit', cost: 30, apply: s => { s.heroCrit += 5; } },
            { id: 'btn-upgrade-shield', cost: 25, apply: s => { s.heroShield += 1; s.currentShield += 1; } }
        ];

        upgradeBtns.forEach(u => {
            const btn = document.getElementById(u.id);
            if (!btn) return;
            btn.addEventListener('click', () => {
                const state = getTowerState();
                if (state.shards < u.cost) {
                    alert(`Недостаточно осколков 💎! Нужно ${u.cost} 💎, у вас ${state.shards} 💎.`);
                    return;
                }
                state.shards -= u.cost;
                u.apply(state);
                saveTowerState(state);
                playWinSound(false);
                showHubToast('⚡ Характеристика улучшена!', 'success');
                renderTowerArena();
            });
        });

        const restartBtn = document.getElementById('btn-tower-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (confirm('Начать забег с 1 этажа? Все заработанные 💎 осколки и прокачанные навыки останутся с вами!')) {
                    stopTowerBattle();
                    const state = getTowerState();
                    state.floor = 1;
                    state.heroHp = state.heroMaxHp;
                    state.currentShield = state.heroShield;
                    saveTowerState(state);
                    currentTowerMonster = null;
                    currentTowerQuestion = null;
                    renderTowerArena();
                }
            });
        }

        const submitBtn = document.getElementById('btn-tower-submit-answer');
        const answerInput = document.getElementById('tower-user-answer');
        if (submitBtn) submitBtn.addEventListener('click', handleTowerSubmit);
        if (answerInput) {
            answerInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTowerSubmit();
                }
            });
        }
    }

    // --- Toast Helper for Upgrade Hub ---
    function showHubToast(message, type) {
        let toast = document.getElementById('upgrade-hub-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'upgrade-hub-toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.right = '24px';
            toast.style.zIndex = '9999';
            toast.style.padding = '12px 18px';
            toast.style.borderRadius = '12px';
            toast.style.fontWeight = '700';
            toast.style.fontSize = '0.92rem';
            toast.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            toast.style.transition = 'all 0.3s ease';
            document.body.appendChild(toast);
        }

        toast.style.background = (type === 'success') ? '#065f46' : '#1e293b';
        toast.style.color = (type === 'success') ? '#6ee7b7' : '#f1f5f9';
        toast.style.border = (type === 'success') ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)';
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        clearTimeout(window.__hubToastTimer);
        window.__hubToastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(12px)';
        }, 3600);
    }

    // --- Master Initializer ---
    function initUpgradeHub() {
        const hubWrap = document.getElementById('tab-content-upgrade');
        if (!hubWrap) return;

        const xpEl = document.getElementById('upgrade-user-xp');
        if (xpEl) xpEl.textContent = `${getUserTotalXp()} XP`;

        const state = getTowerState();
        const recordEl = document.getElementById('upgrade-tower-record');
        if (recordEl) recordEl.textContent = `${state.bestFloor} этаж`;

        initSubnav();
        initCollider();
        initTechTree();
        renderHolocabinet();
        initInventory();
        initTowerUpgrades();
        renderTowerArena();
    }

    window.initUpgradeHub = initUpgradeHub;

    window.addEventListener('study-boost-consumed', () => {
        updateTechTreeUI();
        renderInventoryView();
    });

    document.addEventListener('DOMContentLoaded', () => {
        const storedTab = sessionStorage.getItem('profileActiveTab');
        const hash = (window.location.hash || '').toLowerCase();
        if (hash === '#upgrade' || hash.includes('prokachka') || storedTab === 'upgrade') {
            initUpgradeHub();
        }
    });
})();
