/**
 * Subject filter ("Все", "Алгебра", "Геометрия") for math grade trainer grids.
 */
(function () {
    'use strict';

    const VALID_FILTERS = new Set(['all', 'algebra', 'geometry']);

    function getStorageKey() {
        return 'trainer_subject_filter:' + window.location.pathname;
    }

    function readInitialFilter() {
        try {
            const params = new URLSearchParams(window.location.search);
            const fromUrl = params.get('subject');
            if (fromUrl && VALID_FILTERS.has(fromUrl)) {
                return fromUrl;
            }
            const fromStorage = sessionStorage.getItem(getStorageKey());
            if (fromStorage && VALID_FILTERS.has(fromStorage)) {
                return fromStorage;
            }
        } catch (err) {
            // Ignore storage/URL errors in restricted contexts
        }
        return 'all';
    }

    function saveFilter(value) {
        try {
            sessionStorage.setItem(getStorageKey(), value);
        } catch (err) {
            // Ignore storage errors in restricted contexts
        }
    }

    function initTrainerSection(section) {
        const filterBar = section.querySelector('[data-trainer-filter-bar]');
        const grid = section.querySelector('.trainer-grid');
        if (!filterBar || !grid) return;

        const buttons = Array.from(filterBar.querySelectorAll('.trainer-filter-btn[data-filter]'));
        const cards = Array.from(grid.querySelectorAll('.trainer-link[data-subject]'));
        const emptyState = section.querySelector('[data-trainer-empty]');
        const resetButton = section.querySelector('[data-reset-trainer-filter]');

        const counts = { all: cards.length, algebra: 0, geometry: 0 };
        cards.forEach((card) => {
            const subject = card.dataset.subject;
            if (subject === 'algebra' || subject === 'geometry') {
                counts[subject] += 1;
            }
        });

        filterBar.querySelectorAll('[data-count-for]').forEach((badge) => {
            const key = badge.getAttribute('data-count-for');
            if (key && Object.prototype.hasOwnProperty.call(counts, key)) {
                badge.textContent = String(counts[key]);
            }
        });

        function applyFilter(rawFilter, persist) {
            const activeFilter = VALID_FILTERS.has(rawFilter) ? rawFilter : 'all';
            let visibleCount = 0;

            cards.forEach((card) => {
                const matches = activeFilter === 'all' || card.dataset.subject === activeFilter;
                card.hidden = !matches;
                card.classList.toggle('is-hidden', !matches);
                if (matches) {
                    visibleCount += 1;
                }
            });

            buttons.forEach((btn) => {
                const isActive = btn.dataset.filter === activeFilter;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            if (emptyState) {
                emptyState.hidden = visibleCount > 0;
            }

            if (persist) {
                saveFilter(activeFilter);
            }
        }

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                applyFilter(btn.dataset.filter, true);
            });
        });

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                applyFilter('all', true);
            });
        }

        applyFilter(readInitialFilter(), false);
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.trainers').forEach(initTrainerSection);
    });
})();
