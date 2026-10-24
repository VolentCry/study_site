document.addEventListener('DOMContentLoaded', () => {
    const metricsStorageKey = 'studyMetrics';
    const chartColors = {
        'Математика': '#b7464e',
        'Английский': '#456f9f',
        'Физика': '#168c82'
    };
    const chartSubjects = Object.keys(chartColors);
    const subjectSkills = {
        'Математика': [
            { id: 'multiplication', label: 'Умножение и деление' },
            { id: 'arithmetic', label: 'Арифметика' },
            { id: 'equations', label: 'Уравнения' },
            { id: 'geometry', label: 'Площади и объёмы' },
            { id: 'rounding', label: 'Округление дробей' },
            { id: 'primes', label: 'Простые числа' },
            { id: 'expressions', label: 'Выражения' },
            { id: 'inequalities', label: 'Неравенства' },
            { id: 'logic', label: 'Логика' },
            { id: 'fractionsPercentages', label: 'Дроби и проценты' },
            { id: 'practicalMath', label: 'Практические задачи' },
            { id: 'multistep', label: 'Сложные условия' },
            { id: 'wordProblems', label: 'Текстовые задачи' },
            { id: 'general', label: 'Другие задачи' }
        ],
        'Английский': [
            { id: 'prepositions', label: 'Предлоги места' },
            { id: 'emotions', label: 'Эмоции' },
            { id: 'food', label: 'Еда и напитки' },
            { id: 'tenses', label: 'Времена глаголов' },
            { id: 'weather', label: 'Погода' },
            { id: 'pronouns', label: 'Местоимения' },
            { id: 'generalVocabulary', label: 'Другие слова' }
        ],
        'Физика': [
            { id: 'mechanics', label: 'Механика' },
            { id: 'thermal', label: 'Тепловые явления' },
            { id: 'electricity', label: 'Электричество' },
            { id: 'magnetism', label: 'Магнетизм' },
            { id: 'waves', label: 'Колебания и волны' },
            { id: 'optics', label: 'Оптика' },
            { id: 'modernPhysics', label: 'Атомная и квантовая физика' },
            { id: 'measurement', label: 'Измерения' },
            { id: 'generalPhysics', label: 'Другие темы физики' }
        ]
    };
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const skillsSelect = document.getElementById('skills-subject');

    function getMathSkillFromTask(taskId) {
        const path = taskId.toLowerCase();
        if (path.includes('/multiplication_tasks/')) return 'multiplication';
        if (path.includes('/equations_tasks/')) return 'equations';
        if (path.includes('/expressions_tasks/')) return 'expressions';
        if (path.includes('/inequalities_tasks/')) return 'inequalities';
        if (path.includes('/logics_tasks/')) return 'logic';
        if (path.includes('/shares_and_percentages/') || path.includes('/reduction_of_fractions/') || path.includes('fraction')) return 'fractionsPercentages';
        if (path.includes('/cost_tasks/') || path.includes('/sales_tasks/')) return 'practicalMath';
        if (path.includes('/complex_conditions_tasks/')) return 'multistep';
        if (path.includes('/way_tasks/')) return 'wordProblems';
        return 'general';
    }

    function getAttemptSkill(attempt) {
        if (attempt.skill) return attempt.skill;
        if (attempt.subject === 'Математика') return getMathSkillFromTask(attempt.taskId);
        if (attempt.subject === 'Физика') return 'generalPhysics';
        if (attempt.taskId.startsWith('english-weather-')) return 'weather';
        const taskPrefix = attempt.taskId.split('-').slice(0, 3).join('-');
        return ({
            'english-task-1': 'prepositions',
            'english-task-2': 'emotions',
            'english-task-3': 'food',
            'english-task-4': 'tenses',
            'english-task-6': 'pronouns'
        }[taskPrefix] || 'generalVocabulary');
    }

    function createSvgElement(name, attributes = {}) {
        const element = document.createElementNS(svgNamespace, name);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
        return element;
    }

    function readAttempts() {
        const storedAttempts = localStorage.getItem(metricsStorageKey);
        if (!storedAttempts) return [];
        try {
            const attempts = JSON.parse(storedAttempts);
            if (!Array.isArray(attempts)) throw new TypeError('Ожидался список попыток.');
            return attempts.filter(attempt =>
                attempt &&
                typeof attempt.timestamp === 'string' &&
                Number.isFinite(Date.parse(attempt.timestamp)) &&
                chartSubjects.includes(attempt.subject) &&
                typeof attempt.taskId === 'string' &&
                typeof attempt.correct === 'boolean' &&
                (attempt.skill === undefined || typeof attempt.skill === 'string')
            );
        } catch (error) {
            console.error('Не удалось прочитать статистику учебных задач.', error);
            document.querySelector('.metrics-note').textContent = 'Не удалось прочитать сохранённую статистику. Проверьте консоль браузера.';
            return [];
        }
    }

    function startOfWeek(date) {
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        return start;
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(date);
    }

    function formatRange(start) {
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${formatDate(start)} – ${formatDate(end)}`;
    }

    function recordsInRange(attempts, start, end) {
        return attempts.filter(attempt => {
            const timestamp = Date.parse(attempt.timestamp);
            return timestamp >= start.getTime() && timestamp < end.getTime();
        });
    }

    function countSolvedTasks(attempts) {
        return new Set(
            attempts.filter(attempt => attempt.correct)
                .map(attempt => `${attempt.subject}:${attempt.taskId}`)
        ).size;
    }

    function updateExperience(attempts) {
        const xpPerLevel = 100;
        const xpByTask = new Map();
        attempts.forEach(attempt => {
            const taskKey = `${attempt.subject}:${attempt.taskId}`;
            const taskXp = attempt.correct ? 10 : 2;
            xpByTask.set(taskKey, Math.max(xpByTask.get(taskKey) || 0, taskXp));
        });
        const bonusXp = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
        const earnedXp = [...xpByTask.values()].reduce((total, taskXp) => total + taskXp, 0) + bonusXp;
        const level = Math.floor(earnedXp / xpPerLevel) + 1;
        const currentLevelXp = earnedXp % xpPerLevel;
        const levelNames = ['Новичок', 'Ученик', 'Исследователь', 'Знаток', 'Мастер', 'Эксперт'];
        const levelName = levelNames[level - 1] || 'Легенда';

        document.getElementById('experience-heading').textContent = `Уровень ${level} · ${levelName}`;
        document.getElementById('experience-total').textContent = `${earnedXp} XP`;
        document.getElementById('experience-progress').style.width = `${currentLevelXp}%`;
        document.getElementById('experience-progressbar').setAttribute('aria-valuenow', String(currentLevelXp));
        document.getElementById('experience-detail').textContent =
            `${currentLevelXp} из ${xpPerLevel} XP до следующего уровня · осталось ${xpPerLevel - currentLevelXp} XP. За задачу: 2 XP за ошибочный ответ или 10 XP за верный; повторные проверки не суммируются.`;
    }

    function getAchievements(attempts) {
        const solvedCount = countSolvedTasks(attempts);
        const correctAnswers = attempts.filter(attempt => attempt.correct).length;
        const accuracy = attempts.length ? correctAnswers / attempts.length : 0;
        const testKeys = [
            { key: 'arithmetic', name: 'Мастер арифметики', icon: '🪓' },
            { key: 'equations', name: 'Укротитель уравнений', icon: '📜' },
            { key: 'geometry', name: 'Геометр', icon: '🧱' },
            { key: 'rounding', name: 'Точность до десятых', icon: '🔢' },
            { key: 'primes', name: 'Искатель простых чисел', icon: '💎' }
        ];
        const completedTests = new Set();
        testKeys.forEach(({ key }) => {
            const completedQuestions = new Set(
                attempts
                    .filter(attempt => attempt.subject === 'Математика')
                    .map(attempt => {
                        const match = attempt.taskId.match(new RegExp(`^math-test-${key}-question-(\\d+)$`));
                        return match ? Number(match[1]) : null;
                    })
                    .filter(question => question !== null && question >= 1 && question <= 15)
            );
            if (completedQuestions.size === 15) completedTests.add(key);
        });

        return [
            { name: 'Первый шаг', description: 'Реши свою первую задачу правильно.', icon: '🥉', earned: solvedCount >= 1 },
            { name: 'Ученик', description: 'Реши правильно 10 разных задач.', icon: '🔟', earned: solvedCount >= 10 },
            { name: 'Знаток', description: 'Реши правильно 50 разных задач.', icon: '🏆', earned: solvedCount >= 50 },
            { name: 'Верные ответы', description: 'Дай 10 правильных ответов.', icon: '✨', earned: correctAnswers >= 10 },
            { name: 'Меткость', description: 'Ответь правильно минимум на 80% из 10 проверенных вопросов.', icon: '🎯', earned: attempts.length >= 10 && accuracy >= 0.8 },
            ...testKeys.map(test => ({
                name: test.name,
                description: 'Пройди все 15 вопросов этого тестирования.',
                icon: test.icon,
                earned: completedTests.has(test.key)
            }))
        ];
    }

    function renderAchievements() {
        const list = document.getElementById('achievements-list');
        list.replaceChildren();
        getAchievements(readAttempts()).forEach(achievement => {
            const item = document.createElement('li');
            item.className = `achievement${achievement.earned ? ' is-earned' : ''}`;
            const medal = document.createElement('span');
            medal.className = 'achievement-medal';
            medal.setAttribute('aria-hidden', 'true');
            medal.textContent = achievement.icon;
            const details = document.createElement('div');
            const name = document.createElement('h3');
            name.className = 'achievement-name';
            name.textContent = achievement.name;
            const description = document.createElement('p');
            description.className = 'achievement-description';
            description.textContent = achievement.description;
            const state = document.createElement('p');
            state.className = 'achievement-description';
            state.textContent = achievement.earned ? 'Получено' : 'Пока не получено';
            details.append(name, description, state);
            item.append(medal, details);
            list.appendChild(item);
        });
    }

    function errorRate(attempts) {
        if (attempts.length === 0) return null;
        return attempts.filter(attempt => !attempt.correct).length / attempts.length * 100;
    }

    function formatCount(count, forms) {
        const remainder100 = count % 100;
        const remainder10 = count % 10;
        if (remainder100 >= 11 && remainder100 <= 14) return `${count} ${forms[2]}`;
        if (remainder10 === 1) return `${count} ${forms[0]}`;
        if (remainder10 >= 2 && remainder10 <= 4) return `${count} ${forms[1]}`;
        return `${count} ${forms[2]}`;
    }

    function showErrorRate(elementId, detailId, attempts, range) {
        const rateElement = document.getElementById(elementId);
        const detailElement = document.getElementById(detailId);
        const rate = errorRate(attempts);
        if (rate === null) {
            rateElement.textContent = 'Недостаточно данных';
            detailElement.textContent = `Нет проверенных ответов за ${range}.`;
            return null;
        }
        rateElement.textContent = `${Math.round(rate)}%`;
        const errors = attempts.filter(attempt => !attempt.correct).length;
        detailElement.textContent = `${formatCount(errors, ['ошибка', 'ошибки', 'ошибок'])} из ${formatCount(attempts.length, ['проверенного ответа', 'проверенных ответов', 'проверенных ответов'])} · ${range}`;
        return rate;
    }

    function updateSubjectChart(attempts, weekStart) {
        const totals = new Map(chartSubjects.map(subject => [subject, 0]));
        const solvedKeysBySubject = new Map(chartSubjects.map(subject => [subject, new Set()]));
        attempts.filter(attempt => attempt.correct).forEach(attempt => {
            solvedKeysBySubject.get(attempt.subject).add(attempt.taskId);
        });
        solvedKeysBySubject.forEach((taskIds, subject) => totals.set(subject, taskIds.size));

        const chart = document.getElementById('subject-chart');
        const legend = document.getElementById('chart-legend');
        const emptyMessage = document.getElementById('chart-empty');
        const total = [...totals.values()].reduce((sum, count) => sum + count, 0);
        let currentPercentage = 0;
        const segments = [];

        chartSubjects.forEach(subject => {
            const count = totals.get(subject);
            if (count === 0 || total === 0) return;
            const nextPercentage = currentPercentage + count / total * 100;
            segments.push(`${chartColors[subject]} ${currentPercentage}% ${nextPercentage}%`);
            currentPercentage = nextPercentage;
        });
        chart.style.background = total
            ? `conic-gradient(${segments.join(', ')})`
            : 'conic-gradient(#d5dce5 0% 100%)';
        chart.setAttribute('aria-label', total
            ? `Решено за неделю: ${chartSubjects.map(subject => `${subject}: ${totals.get(subject)}`).join(', ')}`
            : 'За эту неделю пока нет решённых задач.');

        legend.replaceChildren();
        chartSubjects.filter(subject => totals.get(subject) > 0).forEach(subject => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            const swatch = document.createElement('span');
            swatch.className = 'legend-swatch';
            swatch.style.backgroundColor = chartColors[subject];
            const label = document.createElement('span');
            label.textContent = subject;
            const count = document.createElement('span');
            count.className = 'legend-count';
            count.textContent = String(totals.get(subject));
            item.append(swatch, label, count);
            legend.appendChild(item);
        });
        emptyMessage.classList.toggle('hidden', total > 0);
        document.getElementById('chart-period').textContent = `Текущая неделя · ${formatRange(weekStart)}`;
    }

    function updateSkillsChart(attempts, subject) {
        const skills = subjectSkills[subject];
        const svg = document.getElementById('skills-radar');
        const summary = document.getElementById('skills-summary');
        const width = 460;
        const height = 420;
        const centerX = width / 2;
        const centerY = 190;
        const radius = 126;
        const angleFor = index => -Math.PI / 2 + index * Math.PI * 2 / skills.length;
        const pointFor = (index, scale) => ({
            x: centerX + Math.cos(angleFor(index)) * radius * scale,
            y: centerY + Math.sin(angleFor(index)) * radius * scale
        });
        const skillValues = skills.map(skill => {
            const skillAttempts = attempts.filter(attempt =>
                attempt.subject === subject && getAttemptSkill(attempt) === skill.id
            );
            const correctCount = skillAttempts.filter(attempt => attempt.correct).length;
            return {
                ...skill,
                attempts: skillAttempts.length,
                percentage: skillAttempts.length ? Math.round(correctCount / skillAttempts.length * 100) : 0
            };
        });
        const hasData = skillValues.some(skill => skill.attempts > 0);

        svg.replaceChildren();
        svg.setAttribute('aria-label', `Карта навыков по предмету «${subject}»`);
        [0.2, 0.4, 0.6, 0.8, 1].forEach(scale => {
            const points = skills.map((skill, index) => {
                const point = pointFor(index, scale);
                return `${point.x},${point.y}`;
            }).join(' ');
            svg.appendChild(createSvgElement('polygon', {
                points,
                class: 'skills-grid-line'
            }));
        });

        skills.forEach((skill, index) => {
            const point = pointFor(index, 1);
            svg.appendChild(createSvgElement('line', {
                x1: centerX,
                y1: centerY,
                x2: point.x,
                y2: point.y,
                class: 'skills-axis'
            }));
        });

        const areaPoints = skillValues.map((skill, index) => {
            const point = pointFor(index, skill.percentage / 100);
            return `${point.x},${point.y}`;
        }).join(' ');
        svg.appendChild(createSvgElement('polygon', {
            points: areaPoints,
            class: hasData ? 'skills-area' : 'skills-area no-data'
        }));

        skillValues.forEach((skill, index) => {
            const point = pointFor(index, skill.percentage / 100);
            if (skill.attempts > 0) {
                svg.appendChild(createSvgElement('circle', {
                    cx: point.x,
                    cy: point.y,
                    r: 4,
                    class: 'skills-point'
                }));
            }

            const labelPoint = pointFor(index, 1.28);
            const anchor = Math.cos(angleFor(index)) > 0.35
                ? 'start'
                : Math.cos(angleFor(index)) < -0.35 ? 'end' : 'middle';
            const label = createSvgElement('text', {
                x: labelPoint.x,
                y: labelPoint.y,
                'text-anchor': anchor,
                class: 'skills-label'
            });
            label.textContent = skill.label;
            svg.appendChild(label);

            const valuePoint = pointFor(index, 1.1);
            const value = createSvgElement('text', {
                x: valuePoint.x,
                y: valuePoint.y,
                'text-anchor': anchor,
                class: 'skills-value'
            });
            value.textContent = skill.attempts > 0 ? `${skill.percentage}%` : '—';
            svg.appendChild(value);
        });

        const skillsWithData = skillValues.filter(skill => skill.attempts > 0);
        if (!hasData) {
            summary.textContent = `Пока нет проверенных ответов по предмету «${subject}». Решай задачи, чтобы карта навыков начала заполняться.`;
            return;
        }
        summary.textContent = `Данные есть по ${skillsWithData.length} из ${skills.length} навыков. Процент показывает долю правильных ответов; «—» означает, что навык ещё не проверялся.`;
    }

    const attempts = readAttempts();
    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const earlierWeekStart = new Date(currentWeekStart);
    earlierWeekStart.setDate(earlierWeekStart.getDate() - 14);

    const currentWeekAttempts = recordsInRange(attempts, currentWeekStart, nextWeekStart);
    const lastWeekAttempts = recordsInRange(attempts, lastWeekStart, currentWeekStart);
    const earlierWeekAttempts = recordsInRange(attempts, earlierWeekStart, lastWeekStart);

    document.getElementById('tasks-count').textContent = String(
        attempts.length
            ? countSolvedTasks(attempts)
            : Number.parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0
    );
    updateExperience(attempts);
    document.getElementById('weekly-solved').textContent = String(countSolvedTasks(currentWeekAttempts));
    document.getElementById('weekly-range').textContent = formatRange(currentWeekStart);

    showErrorRate(
        'current-error-rate',
        'current-error-detail',
        currentWeekAttempts,
        formatRange(currentWeekStart)
    );
    const lastWeekRate = showErrorRate(
        'error-week-rate',
        'error-week-detail',
        lastWeekAttempts,
        formatRange(lastWeekStart)
    );
    const earlierWeekRate = errorRate(earlierWeekAttempts);
    const changeElement = document.getElementById('error-week-change');
    const changeDetail = document.getElementById('error-week-change-detail');
    if (lastWeekRate === null || earlierWeekRate === null) {
        changeElement.textContent = 'Недостаточно данных';
        changeDetail.textContent = `Для сравнения нужны ответы за ${formatRange(earlierWeekStart)} и ${formatRange(lastWeekStart)}.`;
    } else {
        const difference = lastWeekRate - earlierWeekRate;
        changeElement.textContent = `${difference > 0 ? '+' : ''}${Math.round(difference)} п.п.`;
        changeDetail.textContent = difference > 0
            ? `Ошибок стало больше: ${Math.round(earlierWeekRate)}% → ${Math.round(lastWeekRate)}%.`
            : difference < 0
                ? `Ошибок стало меньше: ${Math.round(earlierWeekRate)}% → ${Math.round(lastWeekRate)}%.`
                : `Доля ошибок не изменилась: ${Math.round(lastWeekRate)}%.`;
    }

    updateSubjectChart(currentWeekAttempts, currentWeekStart);
    updateSkillsChart(attempts, skillsSelect.value);
    skillsSelect.addEventListener('change', () => updateSkillsChart(attempts, skillsSelect.value));

    const achievementsDialog = document.getElementById('achievements-dialog');
    document.getElementById('achievements-open').addEventListener('click', () => {
        renderAchievements();
        achievementsDialog.showModal();
    });
    document.getElementById('achievements-close').addEventListener('click', () => achievementsDialog.close());

    // Глобальное обновление опыта при получении подарков или наград
    window.refreshProfileExperience = function() {
        const currentAttempts = loadAttempts();
        updateExperience(currentAttempts);
    };

    window.addProfileBonusXp = function(amount) {
        const cur = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
        const updated = cur + amount;
        localStorage.setItem('studyBonusXp', String(updated));
        window.refreshProfileExperience();
        return updated;
    };
});
