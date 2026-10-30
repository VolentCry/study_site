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
        },
        {
            id: 'oge_task_6',
            name: 'ОГЭ №6 · Числа и дроби',
            shortName: 'ОГЭ Задание 6',
            subject: 'Математика',
            category: 'ОГЭ 9 класс',
            classNum: '9 класс',
            url: '../math_moduls/oge_task_6_trainer.html',
            profileUrl: 'math_moduls/oge_task_6_trainer.html',
            icon: '➗',
            description: 'Арифметические действия с обыкновенными, смешанными и десятичными дробями, составные дроби.',
            rankTiers: [
                { min: 25, title: 'Магистр вычислений ОГЭ 👑' },
                { min: 18, title: 'Архимаг дробей 🧙' },
                { min: 12, title: 'Мастер вычислений 💎' },
                { min: 7,  title: 'Знаток ОГЭ 🥇' },
                { min: 4,  title: 'Точный практик 🥈' },
                { min: 1,  title: 'Ученик ОГЭ 🥉' }
            ]
        },
        {
            id: 'oge_task_8',
            name: 'ОГЭ №8 · Степени и корни',
            shortName: 'ОГЭ Задание 8',
            subject: 'Математика',
            category: 'ОГЭ 9 класс',
            classNum: '9 класс',
            url: '../math_moduls/oge_task_8_trainer.html',
            profileUrl: 'math_moduls/oge_task_8_trainer.html',
            icon: '⚡',
            description: 'Свойства степеней с целыми показателями, действия с квадратными корнями, формулы сокращенного умножения.',
            rankTiers: [
                { min: 25, title: 'Повелитель степеней и корней 👑' },
                { min: 18, title: 'Гроссмейстер алгебры 🧙' },
                { min: 12, title: 'Мастер радикалов 💎' },
                { min: 7,  title: 'Знаток степеней 🥇' },
                { min: 4,  title: 'Алгебраист 🥈' },
                { min: 1,  title: 'Искатель корней 🥉' }
            ]
        },
        {
            id: 'oge_task_9',
            name: 'ОГЭ №9 · Уравнения и системы уравнений',
            shortName: 'ОГЭ Задание 9',
            subject: 'Математика',
            category: 'ОГЭ 9 класс',
            classNum: '9 класс',
            url: '../math_moduls/oge_task_9_trainer.html',
            profileUrl: 'math_moduls/oge_task_9_trainer.html',
            icon: '⚖️',
            description: 'Линейные, квадратные и дробно-рациональные уравнения, системы уравнений по банку ФИПИ и Решу ОГЭ.',
            rankTiers: [
                { min: 25, title: 'Магистр уравнений 👑' },
                { min: 18, title: 'Архимаг алгебры 🧙' },
                { min: 12, title: 'Мастер корней 💎' },
                { min: 7,  title: 'Знаток систем 🥇' },
                { min: 4,  title: 'Решатель уравнений 🥈' },
                { min: 1,  title: 'Ученик алгебры 🥉' }
            ]
        }
,
        {
            id: 'oge_task_10',
            name: 'ОГЭ №10 · Теория вероятностей',
            shortName: 'ОГЭ Задание 10',
            subject: 'Математика',
            category: 'ОГЭ 9 класс',
            classNum: '9 класс',
            url: '../math_moduls/oge_task_10_trainer.html',
            profileUrl: 'math_moduls/oge_task_10_trainer.html',
            icon: '🎲',
            description: 'Классическое определение вероятности, жеребьёвки, такси, экзаменационные билеты, контроль качества и случайные события.',
            rankTiers: [
                { min: 25, title: 'Магистр вероятностей 👑' },
                { min: 18, title: 'Повелитель шанса 🧙' },
                { min: 12, title: 'Мастер комбинаторики 💎' },
                { min: 7,  title: 'Знаток вероятности 🥇' },
                { min: 4,  title: 'Аналитик событий 🥈' },
                { min: 1,  title: 'Искатель шанса 🥉' }
            ]
        },
        {
            id: 'oge_task_18',
            name: 'ОГЭ №18 · Геометрия на клетках',
            shortName: 'ОГЭ Задание 18',
            subject: 'Математика',
            category: 'ОГЭ 9 класс',
            classNum: '9 класс',
            url: '../math_moduls/oge_task_18_trainer.html',
            profileUrl: 'math_moduls/oge_task_18_trainer.html',
            icon: '📐',
            description: 'Площади фигур (треугольник, трапеция, параллелограмм, ромб), тангенс угла, средняя линия и расстояние на клетках 1×1.',
            rankTiers: [
                { min: 25, title: 'Архимаг геометрии 👑' },
                { min: 18, title: 'Виртуоз решётки 🧙' },
                { min: 12, title: 'Мастер площадей 💎' },
                { min: 7,  title: 'Знаток фигур 🥇' },
                { min: 4,  title: 'Геометр 🥈' },
                { min: 1,  title: 'Чертёжник 🥉' }
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

        // Автоматическая запись попытки в журнал заданий и автосинхронизация
        try {
            const rawMetrics = localStorage.getItem(METRICS_STORAGE_KEY);
            let metrics = rawMetrics ? JSON.parse(rawMetrics) : [];
            if (!Array.isArray(metrics)) metrics = [];
            const config = getTrainerConfig(trainerId);
            metrics.push({
                timestamp: new Date().toISOString(),
                subject: config ? (config.subject || 'Математика') : 'Математика',
                skill: config ? (config.shortName || config.name || trainerId) : trainerId,
                taskId: config ? (config.profileUrl || config.url || window.location.pathname) : window.location.pathname,
                correct: !!isCorrect
            });
            if (metrics.length > 300) {
                metrics.splice(0, metrics.length - 300);
            }
            localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));

            if (isCorrect) {
                const total = parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0;
                localStorage.setItem('totalSolvedTasks', String(total + 1));
            }

            window.dispatchEvent(new CustomEvent('study-task-solved', {
                detail: { trainerId, isCorrect, streak }
            }));
        } catch (e) {
            // Ignore storage warnings
        }

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

    // Вспомогательная функция для всплывающего уведомления о подарке
    function showGiftToast(message, type) {
        let toast = document.getElementById('trainer-gift-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'trainer-gift-toast';
            toast.className = 'trainer-gift-toast';
            document.body.appendChild(toast);
        }

        toast.className = `trainer-gift-toast show ${type || 'info'}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '🎁' : (type === 'locked' ? '🔒' : 'ℹ️')}</span>
                <span class="toast-text">${message}</span>
            </div>
        `;

        clearTimeout(window.__giftToastTimer);
        window.__giftToastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
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

        const claimedGifts = JSON.parse(localStorage.getItem('studyClaimedTrainerGifts') || '{}');

        // Карточки тренажёров
        const trainerCardsHtml = trainers.map(t => {
            const rec = records[t.id] || { maxStreak: 0, maxRank: 'Не начат', totalSolved: 0 };
            const streak = rec.maxStreak || 0;
            const rank = rec.maxRank && rec.maxRank !== 'Не начат' ? rec.maxRank : (streak > 0 ? getRankForStreak(t.id, streak) : 'Не начат');
            const nextTier = getNextTier(t.id, streak);

            // Состояние подарка (серия >= 50)
            const isClaimed = !!claimedGifts[t.id];
            const isUnlocked = streak >= 50 && !isClaimed;
            const isLocked = streak < 50 && !isClaimed;

            let giftClass = 'locked';
            let giftTitle = `Подарок заблокирован. Достигните серии = 50 (сейчас: ${streak}/50)`;
            if (isClaimed) {
                giftClass = 'claimed';
                giftTitle = 'Подарок уже получен (+500 XP)!';
            } else if (isUnlocked) {
                giftClass = 'unlocked';
                giftTitle = 'Подарок разблокирован! Нажмите, чтобы забрать +500 XP! 🎁';
            }

            const giftBtnHtml = `
                <button type="button" class="trainer-gift-btn ${giftClass}" data-trainer-id="${t.id}" data-trainer-name="${t.name}" data-streak="${streak}" title="${giftTitle}" aria-label="Подарок за серию 50 в тренажёре ${t.name}">
                    <span class="gift-icon">🎁</span>
                </button>
            `;

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
                            <div class="trainer-title-wrap">
                                <h3 class="trainer-card-name">${t.name}</h3>
                                <span class="trainer-card-badge">${t.category} · ${t.classNum}</span>
                            </div>
                        </div>
                        ${giftBtnHtml}
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

        // Обработка кликов по кнопкам подарков
        containerEl.querySelectorAll('.trainer-gift-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const trainerId = btn.getAttribute('data-trainer-id');
                const trainerName = btn.getAttribute('data-trainer-name') || 'Тренажёр';
                const streakVal = parseInt(btn.getAttribute('data-streak') || '0', 10);
                const currentClaimed = JSON.parse(localStorage.getItem('studyClaimedTrainerGifts') || '{}');

                if (currentClaimed[trainerId]) {
                    showGiftToast(`✓ Награда (+500 XP) за серию 50 в тренажёре «${trainerName}» уже получена!`, 'info');
                    return;
                }

                if (streakVal < 50) {
                    showGiftToast(`🔒 Подарок заблокирован. Достигните серии = 50 в тренажёре «${trainerName}» (текущая серия: ${streakVal}/50 🔥).`, 'locked');
                    return;
                }

                // Серия >= 50: выдаём +500 XP!
                currentClaimed[trainerId] = true;
                localStorage.setItem('studyClaimedTrainerGifts', JSON.stringify(currentClaimed));

                if (typeof window.addProfileBonusXp === 'function') {
                    window.addProfileBonusXp(500);
                } else {
                    const curBonus = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
                    localStorage.setItem('studyBonusXp', String(curBonus + 500));
                    if (typeof window.refreshProfileExperience === 'function') {
                        window.refreshProfileExperience();
                    } else {
                        const expTotal = document.getElementById('experience-total');
                        if (expTotal) {
                            const curText = expTotal.textContent || '0';
                            const curNum = parseInt(curText.replace(/\D/g, '') || '0', 10);
                            expTotal.textContent = `${curNum + 500} XP`;
                        }
                    }
                }

                // Обновляем визуальное состояние кнопки
                btn.classList.remove('unlocked');
                btn.classList.add('claimed');
                btn.title = 'Подарок уже получен (+500 XP)!';

                showGiftToast(`🎉 Поздравляем! Вы получили +500 XP за серию 50 в тренажёре «${trainerName}»!`, 'success');
            });
        });
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
