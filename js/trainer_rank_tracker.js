/**
 * Система учёта серий и званий в тренажёрах (Study Site Trainer Records)
 * Отслеживает непрерывные серии правильных ответов (streak),
 * присваивает и сохраняет максимальные звания по каждому тренажёру.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TrainerTracker = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    const STORAGE_KEY = 'studyTrainerRecords';
    const METRICS_STORAGE_KEY = 'studyMetrics';

    // Конфигурация всех тренажёров платформы
    const TRAINERS = [
        {
            id: 'common_fractions',
            name: 'Обыкновенные дроби',
            shortName: 'Обыкновенные дроби',
            subject: 'Математика',
            category: 'Дроби',
            classNum: '4 класс',
            url: '../math_moduls/common_fraction_trainer.html',
            profileUrl: 'math_moduls/common_fraction_trainer.html',
            icon: '🍰',
            description: 'Все действия с дробями, сокращение, выделение целой части и перевод в десятичные.',
            rankTiers: [
                { min: 25, title: 'Магистр дробей 👑' },
                { min: 18, title: 'Архимаг математики 🧙' },
                { min: 12, title: 'Мастер дробей 💎' },
                { min: 7,  title: 'Знаток дробей 🥇' },
                { min: 4,  title: 'Подмастерье 🥈' },
                { min: 1,  title: 'Начинающий 🥉' }
            ]
        },
        {
            id: 'decimal_fractions',
            name: 'Десятичные дроби',
            shortName: 'Десятичные дроби',
            subject: 'Математика',
            category: 'Дроби',
            classNum: '4 класс',
            url: '../math_moduls/decimal_fraction_trainer.html',
            profileUrl: 'math_moduls/decimal_fraction_trainer.html',
            icon: '🔢',
            description: 'Сложение, вычитание и умножение десятичных дробей.',
            rankTiers: [
                { min: 25, title: 'Магистр десятичных 👑' },
                { min: 18, title: 'Повелитель запятых 🧙' },
                { min: 12, title: 'Мастер дробей 💎' },
                { min: 7,  title: 'Знаток десятичных 🥇' },
                { min: 4,  title: 'Точный практик 🥈' },
                { min: 1,  title: 'Ученик долей 🥉' }
            ]
        },
        {
            id: 'multiplication_easy',
            name: 'Умножение (Лёгкий)',
            shortName: 'Таблица умножения',
            subject: 'Математика',
            category: 'Умножение',
            classNum: '4 класс',
            url: '../math_moduls/multiplication_trainer.html',
            profileUrl: 'math_moduls/multiplication_trainer.html',
            icon: '✖️',
            description: 'Таблица умножения однозначных чисел от 1 до 9.',
            rankTiers: [
                { min: 25, title: 'Легенда умножения 👑' },
                { min: 18, title: 'Гроссмейстер счёта 🧙' },
                { min: 12, title: 'Мастер умножения 💎' },
                { min: 7,  title: 'Знаток таблицы 🥇' },
                { min: 4,  title: 'Быстрый калькулятор 🥈' },
                { min: 1,  title: 'Счетовод 🥉' }
            ]
        },
        {
            id: 'multiplication_medium',
            name: 'Умножение (Средний)',
            shortName: 'Двузначные числа',
            subject: 'Математика',
            category: 'Умножение',
            classNum: '4 класс',
            url: '../math_moduls/multiplication_trainer_medium_level.html',
            profileUrl: 'math_moduls/multiplication_trainer_medium_level.html',
            icon: '⚡',
            description: 'Умножение однозначных чисел на двузначные (1–9 × 10–99).',
            rankTiers: [
                { min: 25, title: 'Титан вычислений 👑' },
                { min: 18, title: 'Математический виртуоз 🧙' },
                { min: 12, title: 'Мастер двузначных чисел 💎' },
                { min: 7,  title: 'Знаток алгоритмов 🥇' },
                { min: 4,  title: 'Вычислитель 🥈' },
                { min: 1,  title: 'Практик 🥉' }
            ]
        },
        {
            id: 'multiplication_hard',
            name: 'Умножение (Сложный)',
            shortName: 'Большие числа',
            subject: 'Математика',
            category: 'Умножение',
            classNum: '4 класс',
            url: '../math_moduls/multiplication_trainer_hard_level.html',
            profileUrl: 'math_moduls/multiplication_trainer_hard_level.html',
            icon: '🔥',
            description: 'Умножение двузначных чисел на двузначные (10–99 × 10–99).',
            rankTiers: [
                { min: 25, title: 'Властелин умножения 👑' },
                { min: 18, title: 'Архитектор чисел 🧙' },
                { min: 12, title: 'Мастер сложного счёта 💎' },
                { min: 7,  title: 'Знаток больших чисел 🥇' },
                { min: 4,  title: 'Аналитик 🥈' },
                { min: 1,  title: 'Смельчак 🥉' }
            ]
        },
        {
            id: 'equations_easy',
            name: 'Уравнения (Лёгкий)',
            shortName: 'Простые уравнения',
            subject: 'Математика',
            category: 'Уравнения',
            classNum: '4 класс',
            url: '../math_moduls/equations_trainer_easy.html',
            profileUrl: 'math_moduls/equations_trainer_easy.html',
            icon: '🎯',
            description: 'Поиск неизвестного x в уравнениях на сложение, вычитание и умножение.',
            rankTiers: [
                { min: 25, title: 'Покоритель уравнений 👑' },
                { min: 18, title: 'Алгебраический стратег 🧙' },
                { min: 12, title: 'Мастер неизвестных 💎' },
                { min: 7,  title: 'Знаток уравнений 🥇' },
                { min: 4,  title: 'Детектив формул 🥈' },
                { min: 1,  title: 'Искатель X 🥉' }
            ]
        },
        {
            id: 'equations_medium',
            name: 'Уравнения (Средний)',
            shortName: 'Уравнения со скобками',
            subject: 'Математика',
            category: 'Уравнения',
            classNum: '4 класс',
            url: '../math_moduls/equations_trainer_medium.html',
            profileUrl: 'math_moduls/equations_trainer_medium.html',
            icon: '🧩',
            description: 'Уравнения со скобками и несколькими арифметическими действиями.',
            rankTiers: [
                { min: 25, title: 'Абсолютный математик 👑' },
                { min: 18, title: 'Гроссмейстер алгебры 🧙' },
                { min: 12, title: 'Мастер систем 💎' },
                { min: 7,  title: 'Знаток преобразований 🥇' },
                { min: 4,  title: 'Логик 🥈' },
                { min: 1,  title: 'Исследователь 🥉' }
            ]
        }
    ];

    const sessionStreaks = {};

    function getTrainerConfig(id) {
        return TRAINERS.find(t => t.id === id) || null;
    }

    function getAllTrainers() {
        return TRAINERS;
    }

    function getRankForStreak(trainerId, streak) {
        if (!streak || streak <= 0) return 'Не начат';
        const config = getTrainerConfig(trainerId);
        if (!config || !config.rankTiers) return 'Новичок 🥉';

        for (const tier of config.rankTiers) {
            if (streak >= tier.min) {
                return tier.title;
            }
        }
        return 'Новичок 🥉';
    }

    function getNextTier(trainerId, streak) {
        const config = getTrainerConfig(trainerId);
        if (!config || !config.rankTiers) return null;

        const sorted = [...config.rankTiers].sort((a, b) => a.min - b.min);
        for (const tier of sorted) {
            if (tier.min > streak) {
                return tier;
            }
        }
        return null;
    }

    // Подсчёт исторических серий из общего журнала попыток studyMetrics
    function scanHistoricalStreaksFromMetrics() {
        const result = {};
        try {
            const raw = localStorage.getItem(METRICS_STORAGE_KEY);
            const attempts = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(attempts) || attempts.length === 0) return result;

            const curStreaks = {};

            attempts.forEach(att => {
                if (!att || !att.taskId) return;
                const path = att.taskId.toLowerCase();

                let trainerId = null;
                if (path.includes('common_fraction')) trainerId = 'common_fractions';
                else if (path.includes('decimal_fraction')) trainerId = 'decimal_fractions';
                else if (path.includes('multiplication_trainer_hard')) trainerId = 'multiplication_hard';
                else if (path.includes('multiplication_trainer_medium')) trainerId = 'multiplication_medium';
                else if (path.includes('multiplication_trainer')) trainerId = 'multiplication_easy';
                else if (path.includes('equations_trainer_medium')) trainerId = 'equations_medium';
                else if (path.includes('equations_trainer_easy')) trainerId = 'equations_easy';

                if (!trainerId) return;

                if (!curStreaks[trainerId]) curStreaks[trainerId] = 0;
                if (!result[trainerId]) result[trainerId] = { maxStreak: 0, totalSolved: 0 };

                if (att.correct) {
                    curStreaks[trainerId]++;
                    result[trainerId].totalSolved++;
                    if (curStreaks[trainerId] > result[trainerId].maxStreak) {
                        result[trainerId].maxStreak = curStreaks[trainerId];
                    }
                } else {
                    curStreaks[trainerId] = 0;
                }
            });
        } catch (e) {
            // Ошибка чтения метрик
        }
        return result;
    }

    function getTrainerRecords() {
        let records = {};
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                records = JSON.parse(raw) || {};
            }
        } catch (e) {
            records = {};
        }

        // Подгружаем историю из studyMetrics, если там есть данные выше
        const historical = scanHistoricalStreaksFromMetrics();

        TRAINERS.forEach(t => {
            if (!records[t.id]) {
                const hist = historical[t.id];
                const histStreak = hist ? hist.maxStreak : 0;
                records[t.id] = {
                    maxStreak: histStreak,
                    maxRank: histStreak > 0 ? getRankForStreak(t.id, histStreak) : 'Не начат',
                    totalSolved: hist ? hist.totalSolved : 0,
                    updatedAt: null
                };
            } else {
                const hist = historical[t.id];
                if (hist && hist.maxStreak > (records[t.id].maxStreak || 0)) {
                    records[t.id].maxStreak = hist.maxStreak;
                    records[t.id].maxRank = getRankForStreak(t.id, hist.maxStreak);
                }
                if (hist && hist.totalSolved > (records[t.id].totalSolved || 0)) {
                    records[t.id].totalSolved = hist.totalSolved;
                }
            }
        });

        return records;
    }

    function saveTrainerRecord(trainerId, streak, isCorrect) {
        const records = getTrainerRecords();
        const current = records[trainerId] || {
            maxStreak: 0,
            maxRank: 'Не начат',
            totalSolved: 0,
            updatedAt: null
        };

        if (isCorrect) {
            current.totalSolved = (current.totalSolved || 0) + 1;
        }

        if (streak > (current.maxStreak || 0)) {
            current.maxStreak = streak;
            current.maxRank = getRankForStreak(trainerId, streak);
            current.updatedAt = new Date().toISOString();
        }

        records[trainerId] = current;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (e) {
            // Storage full or unavailable
        }

        return current;
    }

    function recordAttempt(trainerId, isCorrect) {
        if (sessionStreaks[trainerId] === undefined) {
            sessionStreaks[trainerId] = 0;
        }

        if (isCorrect) {
            sessionStreaks[trainerId]++;
        } else {
            sessionStreaks[trainerId] = 0;
        }

        const streak = sessionStreaks[trainerId];
        const record = saveTrainerRecord(trainerId, streak, isCorrect);

        return {
            currentStreak: streak,
            maxStreak: record.maxStreak,
            maxRank: record.maxRank
        };
    }

    function setSessionStreak(trainerId, streak) {
        sessionStreaks[trainerId] = streak;
        saveTrainerRecord(trainerId, streak, false);
    }

    // Рендер вкладки «Серии и звания» в профиле
    function renderRanksSection(containerEl) {
        if (!containerEl) return;

        const records = getTrainerRecords();
        const trainers = getAllTrainers();

        let topStreak = 0;
        let topRank = 'Не начат';
        let activeCount = 0;
        let totalSolvedAll = 0;

        trainers.forEach(t => {
            const rec = records[t.id] || { maxStreak: 0, maxRank: 'Не начат', totalSolved: 0 };
            if (rec.maxStreak > topStreak) {
                topStreak = rec.maxStreak;
                topRank = rec.maxRank;
            }
            if (rec.maxStreak > 0 || rec.totalSolved > 0) {
                activeCount++;
            }
            totalSolvedAll += (rec.totalSolved || 0);
        });

        // Карточки тренажёров
        const trainerCardsHtml = trainers.map(t => {
            const rec = records[t.id] || { maxStreak: 0, maxRank: 'Не начат', totalSolved: 0 };
            const streak = rec.maxStreak || 0;
            const rank = rec.maxRank && rec.maxRank !== 'Не начат' ? rec.maxRank : (streak > 0 ? getRankForStreak(t.id, streak) : 'Не начат');
            const nextTier = getNextTier(t.id, streak);

            let progressHtml = '';
            if (nextTier) {
                const diff = nextTier.min - streak;
                const prevMin = streak >= 1 ? (t.rankTiers.slice().reverse().find(tier => streak >= tier.min)?.min || 0) : 0;
                const range = nextTier.min - prevMin;
                const currentInRange = Math.max(0, streak - prevMin);
                const percent = Math.min(100, Math.round((currentInRange / range) * 100));

                progressHtml = `
                    <div class="trainer-progress-bar" title="Прогресс до звания: ${nextTier.title}">
                        <div class="trainer-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    <div class="trainer-next-target">
                        До «${nextTier.title}»: ещё <strong>${diff}</strong> подряд
                    </div>
                `;
            } else if (streak >= 25) {
                progressHtml = `
                    <div class="trainer-progress-bar">
                        <div class="trainer-progress-fill" style="width: 100%; background: linear-gradient(90deg, #f59e0b, #eab308);"></div>
                    </div>
                    <div class="trainer-next-target" style="color: #eab308; font-weight: bold;">
                        👑 Высшее звание достигнуто!
                    </div>
                `;
            } else {
                progressHtml = `
                    <div class="trainer-progress-bar">
                        <div class="trainer-progress-fill" style="width: 0%;"></div>
                    </div>
                    <div class="trainer-next-target">
                        Решай примеры без ошибок, чтобы открыть звания!
                    </div>
                `;
            }

            const streakBadgeClass = streak > 0 ? 'streak-highlight' : 'streak-muted';
            const totalSolved = rec.totalSolved || 0;
            const solvedBadgeClass = totalSolved > 0 ? 'solved-highlight' : 'streak-muted';

            return `
                <article class="trainer-item-card">
                    <div class="trainer-card-header">
                        <div class="trainer-card-title-group">
                            <span class="trainer-card-icon" aria-hidden="true">${t.icon}</span>
                            <div>
                                <h3 class="trainer-card-name">${t.name}</h3>
                                <span class="trainer-card-badge">${t.category} · ${t.classNum}</span>
                            </div>
                        </div>
                    </div>

                    <p class="trainer-card-desc">${t.description}</p>

                    <div class="trainer-stats-row">
                        <div class="trainer-stat-col">
                            <span class="trainer-stat-title">Макс. серия:</span>
                            <div class="trainer-stat-value ${streakBadgeClass}">
                                <span>🔥</span>
                                <span>${streak}</span>
                            </div>
                        </div>
                        <div class="trainer-stat-col">
                            <span class="trainer-stat-title">Всего решено:</span>
                            <div class="trainer-stat-value ${solvedBadgeClass}">
                                <span>✅</span>
                                <span>${totalSolved}</span>
                            </div>
                        </div>
                        <div class="trainer-stat-col full-width">
                            <span class="trainer-stat-title">Макс. звание:</span>
                            <div class="trainer-stat-value" style="font-size: 13px; font-weight: 700;">
                                ${rank !== 'Не начат' ? rank : '<span style="color: var(--profile-muted);">—</span>'}
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        ${progressHtml}
                    </div>

                    <a href="${t.profileUrl}" class="trainer-card-action">
                        <span>Тренироваться</span>
                        <span aria-hidden="true">➔</span>
                    </a>
                </article>
            `;
        }).join('');

        containerEl.innerHTML = `
            <div class="trainer-ranks-card">
                <div class="trainer-ranks-header">
                    <h2 class="profile-heading" style="margin-bottom: 6px;">Серии и звания в тренажёрах</h2>
                    <p class="profile-subtitle" style="margin-bottom: 0;">
                        Твои рекорды непрерывных правильных ответов и звания во всех тренажёрах платформы.
                    </p>
                </div>

                <div class="trainer-ranks-summary">
                    <div class="trainer-summary-item">
                        <div class="trainer-summary-label">Лучшая серия на платформе</div>
                        <div class="trainer-summary-val" style="color: #ea580c;">
                            <span>🔥</span>
                            <span>${topStreak}</span>
                        </div>
                    </div>
                    <div class="trainer-summary-item">
                        <div class="trainer-summary-label">Высшее звание</div>
                        <div class="trainer-summary-val" style="font-size: 17px;">
                            ${topRank !== 'Не начат' ? topRank : '<span style="color: var(--profile-muted);">Пока не получено</span>'}
                        </div>
                    </div>
                    <div class="trainer-summary-item">
                        <div class="trainer-summary-label">Решено задач за всё время</div>
                        <div class="trainer-summary-val" style="color: #10b981;">
                            <span>✅</span>
                            <span>${totalSolvedAll}</span>
                        </div>
                    </div>
                    <div class="trainer-summary-item">
                        <div class="trainer-summary-label">Активных тренажёров</div>
                        <div class="trainer-summary-val">
                            <span>🎯</span>
                            <span>${activeCount} / ${trainers.length}</span>
                        </div>
                    </div>
                </div>

                <div class="trainer-grid-list">
                    ${trainerCardsHtml}
                </div>
            </div>
        `;
    }

    return {
        TRAINERS,
        getTrainerConfig,
        getAllTrainers,
        getRankForStreak,
        getNextTier,
        getTrainerRecords,
        saveTrainerRecord,
        recordAttempt,
        setSessionStreak,
        renderRanksSection
    };
}));
