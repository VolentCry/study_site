/**
 * Тренажёр обыкновенных дробей
 * Включает сложение, вычитание, умножение, деление, сокращение и сравнение дробей.
 * Содержит пошаговые подсказки, визуальные модели дробей и звуковую обратную связь.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы интерфейса ---
    const problemPromptEl = document.getElementById('problem-prompt');
    const problemContainerEl = document.getElementById('problem-container');
    const visualContainerEl = document.getElementById('fraction-visual-container');
    const toggleVisualBtn = document.getElementById('toggle-visual-btn');
    const hintButton = document.getElementById('trainer-hint-button');
    const checkButton = document.getElementById('trainer-check-button');
    const nextButton = document.getElementById('trainer-next-button');
    const feedbackEl = document.getElementById('trainer-feedback');
    const solutionCardEl = document.getElementById('solution-card');
    const solutionContentEl = document.getElementById('solution-content');

    // Статистика
    const scoreCorrectEl = document.getElementById('stat-correct');
    const scoreTotalEl = document.getElementById('stat-total');
    const streakEl = document.getElementById('stat-streak');
    const rankTitleEl = document.getElementById('rank-title');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');

    // Кнопки режимов
    const modeButtons = document.querySelectorAll('.mode-tab');

    // Состояние тренажёра
    let currentMode = 'same_denom'; // 'same_denom' | 'diff_denom' | 'reduce' | 'mul_div' | 'compare' | 'mixed'
    let currentProblem = null;
    let isChecked = false;
    let visualVisible = true;
    let isSoundMuted = localStorage.getItem('fractionTrainerMuted') === 'true';

    let stats = {
        correct: 0,
        total: 0,
        streak: 0,
        maxStreak: 0
    };

    // --- Звуки через Web Audio API ---
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSound(type) {
        if (isSoundMuted) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const now = ctx.currentTime;

            if (type === 'correct') {
                // Мажорное восходящее трезвучие
                const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
                freqs.forEach((f, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + idx * 0.07);
                    gain.gain.setValueAtTime(0.14, now + idx * 0.07);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.07);
                    osc.stop(now + idx * 0.07 + 0.3);
                });
            } else if (type === 'streak') {
                // Праздничный аккорд
                const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                freqs.forEach((f, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + idx * 0.06);
                    gain.gain.setValueAtTime(0.18, now + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.06);
                    osc.stop(now + idx * 0.06 + 0.45);
                });
            } else if (type === 'incorrect') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(230, now);
                osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.22);
            }
        } catch (e) {
            // Аудио не поддерживается или заблокировано
        }
    }

    function updateSoundButton() {
        if (!soundToggleBtn) return;
        soundToggleBtn.textContent = isSoundMuted ? '🔇' : '🔊';
        soundToggleBtn.title = isSoundMuted ? 'Включить звук' : 'Выключить звук';
    }

    if (soundToggleBtn) {
        updateSoundButton();
        soundToggleBtn.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            localStorage.setItem('fractionTrainerMuted', isSoundMuted ? 'true' : 'false');
            updateSoundButton();
        });
    }

    // --- Математические функции ---
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a || 1;
    }

    function lcm(a, b) {
        return (Math.abs(a * b)) / gcd(a, b);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- Звания и ранг ---
    function updateRank() {
        const s = stats.streak;
        let title = 'Ученик';
        if (s >= 20) title = 'Магистр дробей 👑';
        else if (s >= 15) title = 'Архимаг математики 🧙';
        else if (s >= 10) title = 'Мастер дробей 💎';
        else if (s >= 7) title = 'Знаток дробей 🥇';
        else if (s >= 4) title = 'Подмастерье 🥈';
        else if (s >= 2) title = 'Начинающий 🥉';

        if (rankTitleEl) rankTitleEl.textContent = title;
        if (scoreCorrectEl) scoreCorrectEl.textContent = stats.correct;
        if (scoreTotalEl) scoreTotalEl.textContent = stats.total;
        if (streakEl) streakEl.textContent = stats.streak;
    }

    // --- Генераторы задач для каждого режима ---

    // 1. Одинаковые знаменатели (сложение и вычитание)
    function generateSameDenomProblem() {
        const op = pickRandom(['+', '-']);
        const den = getRandomInt(3, 12);
        let n1, n2, resN;

        if (op === '+') {
            n1 = getRandomInt(1, den - 1);
            n2 = getRandomInt(1, den - 1);
            resN = n1 + n2;
        } else {
            n1 = getRandomInt(2, den);
            n2 = getRandomInt(1, n1 - 1);
            resN = n1 - n2;
        }

        const g = gcd(resN, den);
        const reducedN = resN / g;
        const reducedD = den / g;

        let stepsHtml = `
            <p><strong>Шаг 1:</strong> Знаменатели у дробей одинаковые (<code>${den}</code>), поэтому знаменатель остаётся тем же.</p>
            <p><strong>Шаг 2:</strong> Выполняем действие только в числителях: <code>${n1} ${op} ${n2} = ${resN}</code>.</p>
            <p><strong>Шаг 3:</strong> Получаем дробь: <code>${resN}/${den}</code>.</p>
        `;

        if (g > 1) {
            stepsHtml += `
                <p><strong>Шаг 4:</strong> Сокращаем дробь на наибольший общий делитель НОД(${resN}, ${den}) = ${g}:<br>
                <code>${resN} : ${g} = ${reducedN}</code><br>
                <code>${den} : ${g} = ${reducedD}</code><br>
                Ответ в несократимом виде: <strong>${reducedN}/${reducedD}</strong>${reducedD === 1 ? ` (или просто целое число <strong>${reducedN}</strong>)` : ''}.</p>
            `;
        } else {
            stepsHtml += `<p><strong>Результат:</strong> Дробь <strong>${resN}/${den}</strong> уже несократима.</p>`;
        }

        return {
            type: 'calc',
            category: 'same_denom',
            promptText: 'Вычисли значение выражения:',
            frac1: { n: n1, d: den },
            op: op,
            frac2: { n: n2, d: den },
            rawTarget: { n: resN, d: den },
            reducedTarget: { n: reducedN, d: reducedD },
            solution: stepsHtml,
            visualData: {
                type: 'bar_same_denom',
                den: den,
                n1: n1,
                n2: n2,
                op: op
            }
        };
    }

    // 2. Разные знаменатели (сложение и вычитание)
    function generateDiffDenomProblem() {
        const op = pickRandom(['+', '-']);
        // Подбираем удобные пары знаменателей с НОК <= 36
        const denPairs = [
            [2, 3], [2, 4], [2, 5], [3, 4], [3, 6],
            [4, 6], [2, 7], [3, 5], [4, 5], [5, 6],
            [6, 8], [6, 9], [4, 8], [5, 10], [3, 9]
        ];
        const [d1, d2] = pickRandom(denPairs);
        let n1 = getRandomInt(1, d1 - 1);
        let n2 = getRandomInt(1, d2 - 1);

        // Для вычитания убедимся, что n1/d1 > n2/d2
        if (op === '-') {
            if (n1 * d2 <= n2 * d1) {
                // Если первая дробь меньше или равна, меняем их местами или корректируем числители
                n1 = d1 - 1;
                n2 = 1;
                if (n1 * d2 <= n2 * d1) {
                    n1 = d1;
                }
            }
        }

        const commonDen = lcm(d1, d2);
        const m1 = commonDen / d1;
        const m2 = commonDen / d2;
        const scaledN1 = n1 * m1;
        const scaledN2 = n2 * m2;
        const resN = op === '+' ? scaledN1 + scaledN2 : scaledN1 - scaledN2;
        const g = gcd(resN, commonDen);
        const reducedN = resN / g;
        const reducedD = commonDen / g;

        let stepsHtml = `
            <p><strong>Шаг 1:</strong> Найдём наименьший общий знаменатель для <code>${d1}</code> и <code>${d2}</code>:<br>
            НОК(${d1}, ${d2}) = <strong>${commonDen}</strong>.</p>
            <p><strong>Шаг 2:</strong> Найдём дополнительные множители:<br>
            Для первой дроби: <code>${commonDen} : ${d1} = ${m1}</code><br>
            Для второй дроби: <code>${commonDen} : ${d2} = ${m2}</code>.</p>
            <p><strong>Шаг 3:</strong> Приведём дроби к общему знаменателю:<br>
            <code>(${n1} × ${m1}) / ${commonDen} ${op} (${n2} × ${m2}) / ${commonDen} = ${scaledN1}/${commonDen} ${op} ${scaledN2}/${commonDen}</code>.</p>
            <p><strong>Шаг 4:</strong> Выполним действие в числителях:<br>
            <code>${scaledN1} ${op} ${scaledN2} = ${resN}</code> → получаем <code>${resN}/${commonDen}</code>.</p>
        `;

        if (g > 1) {
            stepsHtml += `
                <p><strong>Шаг 5:</strong> Сокращаем дробь на НОД(${resN}, ${commonDen}) = ${g}:<br>
                Ответ в несократимом виде: <strong>${reducedN}/${reducedD}</strong>${reducedD === 1 ? ` (или <strong>${reducedN}</strong>)` : ''}.</p>
            `;
        } else {
            stepsHtml += `<p><strong>Результат:</strong> Дробь <strong>${resN}/${commonDen}</strong> несократима.</p>`;
        }

        return {
            type: 'calc',
            category: 'diff_denom',
            promptText: 'Приведи к общему знаменателю и реши:',
            frac1: { n: n1, d: d1 },
            op: op,
            frac2: { n: n2, d: d2 },
            rawTarget: { n: resN, d: commonDen },
            reducedTarget: { n: reducedN, d: reducedD },
            solution: stepsHtml,
            visualData: {
                type: 'bar_diff_denom',
                d1: d1, n1: n1,
                d2: d2, n2: n2,
                commonDen: commonDen,
                op: op
            }
        };
    }

    // 3. Сокращение дробей
    function generateReduceProblem() {
        // Базовая несократимая дробь
        let baseD = getRandomInt(2, 9);
        let baseN = getRandomInt(1, baseD - 1);
        while (gcd(baseN, baseD) !== 1) {
            baseD = getRandomInt(2, 9);
            baseN = getRandomInt(1, baseD - 1);
        }

        // Множитель сокращения
        const factor = getRandomInt(2, 6);
        const origN = baseN * factor;
        const origD = baseD * factor;

        const stepsHtml = `
            <p><strong>Шаг 1:</strong> Найдём наибольший общий делитель числителя (<code>${origN}</code>) и знаменателя (<code>${origD}</code>):<br>
            НОД(${origN}, ${origD}) = <strong>${factor}</strong>.</p>
            <p><strong>Шаг 2:</strong> Разделим числитель и знаменатель на <code>${factor}</code>:<br>
            <code>${origN} : ${factor} = ${baseN}</code><br>
            <code>${origD} : ${factor} = ${baseD}</code>.</p>
            <p><strong>Ответ:</strong> Несократимая дробь — <strong>${baseN}/${baseD}</strong>.</p>
        `;

        return {
            type: 'reduce',
            category: 'reduce',
            promptText: 'Сократи дробь до несократимой:',
            frac1: { n: origN, d: origD },
            reducedTarget: { n: baseN, d: baseD },
            solution: stepsHtml,
            visualData: {
                type: 'bar_reduce',
                origN: origN,
                origD: origD,
                baseN: baseN,
                baseD: baseD
            }
        };
    }

    // 4. Умножение и деление дробей
    function generateMulDivProblem() {
        const op = pickRandom(['×', '÷']);
        const d1 = getRandomInt(2, 7);
        const n1 = getRandomInt(1, d1);
        const d2 = getRandomInt(2, 7);
        const n2 = getRandomInt(1, d2 - 1);

        let resN, resD;
        let stepsHtml = '';

        if (op === '×') {
            resN = n1 * n2;
            resD = d1 * d2;
            stepsHtml = `
                <p><strong>Шаг 1:</strong> Чтобы умножить обыкновенные дроби, перемножаем числители и перемножаем знаменатели:<br>
                Числитель: <code>${n1} × ${n2} = ${resN}</code><br>
                Знаменатель: <code>${d1} × ${d2} = ${resD}</code>.</p>
                <p><strong>Шаг 2:</strong> Получаем дробь: <code>${resN}/${resD}</code>.</p>
            `;
        } else {
            // Деление: переворачиваем вторую дробь
            resN = n1 * d2;
            resD = d1 * n2;
            stepsHtml = `
                <p><strong>Шаг 1:</strong> Чтобы разделить на дробь, умножаем на обратную (перевёрнутую) дробь:<br>
                <code>${n1}/${d1} ÷ ${n2}/${d2} = ${n1}/${d1} × ${d2}/${n2}</code>.</p>
                <p><strong>Шаг 2:</strong> Перемножаем числители и знаменатели:<br>
                Числитель: <code>${n1} × ${d2} = ${resN}</code><br>
                Знаменатель: <code>${d1} × ${n2} = ${resD}</code>.</p>
                <p><strong>Шаг 3:</strong> Получаем дробь: <code>${resN}/${resD}</code>.</p>
            `;
        }

        const g = gcd(resN, resD);
        const reducedN = resN / g;
        const reducedD = resD / g;

        if (g > 1) {
            stepsHtml += `
                <p><strong>Шаг ${op === '×' ? '3' : '4'}:</strong> Сокращаем дробь на ${g}:<br>
                Ответ в несократимом виде: <strong>${reducedN}/${reducedD}</strong>${reducedD === 1 ? ` (или <strong>${reducedN}</strong>)` : ''}.</p>
            `;
        } else {
            stepsHtml += `<p><strong>Результат:</strong> Дробь <strong>${resN}/${resD}</strong> несократима.</p>`;
        }

        return {
            type: 'calc',
            category: 'mul_div',
            promptText: op === '×' ? 'Выполни умножение дробей:' : 'Выполни деление дробей:',
            frac1: { n: n1, d: d1 },
            op: op,
            frac2: { n: n2, d: d2 },
            rawTarget: { n: resN, d: resD },
            reducedTarget: { n: reducedN, d: reducedD },
            solution: stepsHtml,
            visualData: {
                type: 'bar_mul_div',
                n1: n1, d1: d1,
                n2: n2, d2: d2,
                op: op
            }
        };
    }

    // 5. Сравнение дробей
    function generateCompareProblem() {
        const d1 = getRandomInt(2, 9);
        const d2 = getRandomInt(2, 9);
        let n1 = getRandomInt(1, d1 - 1);
        let n2 = getRandomInt(1, d2 - 1);

        // Иногда генерируем эквивалентные дроби для знака "="
        if (Math.random() < 0.25) {
            const baseD = getRandomInt(2, 4);
            const baseN = getRandomInt(1, baseD - 1);
            const m1 = getRandomInt(1, 3);
            const m2 = m1 === 1 ? 2 : 1;
            n1 = baseN * m1;
            const chosenD1 = baseD * m1;
            n2 = baseN * m2;
            const chosenD2 = baseD * m2;
            return createCompareResult(n1, chosenD1, n2, chosenD2);
        }

        return createCompareResult(n1, d1, n2, d2);
    }

    function createCompareResult(n1, d1, n2, d2) {
        const cross1 = n1 * d2;
        const cross2 = n2 * d1;
        let correctOp = '=';
        if (cross1 > cross2) correctOp = '>';
        else if (cross1 < cross2) correctOp = '<';

        const commonDen = lcm(d1, d2);
        const m1 = commonDen / d1;
        const m2 = commonDen / d2;
        const s1 = n1 * m1;
        const s2 = n2 * m2;

        const stepsHtml = `
            <p><strong>Способ 1 (через общий знаменатель):</strong><br>
            НОК(${d1}, ${d2}) = ${commonDen}.<br>
            Приводим дроби: <code>${n1}/${d1} = ${s1}/${commonDen}</code> и <code>${n2}/${d2} = ${s2}/${commonDen}</code>.<br>
            Сравниваем числители: так как <code>${s1} ${correctOp} ${s2}</code>, то <strong>${n1}/${d1} ${correctOp} ${n2}/${d2}</strong>.</p>
            <p><strong>Способ 2 (перекрёстное умножение):</strong><br>
            Умножаем числитель первой на знаменатель второй: <code>${n1} × ${d2} = ${cross1}</code>.<br>
            Умножаем числитель второй на знаменатель первой: <code>${n2} × ${d1} = ${cross2}</code>.<br>
            Так как <code>${cross1} ${correctOp} ${cross2}</code>, то и <strong>${n1}/${d1} ${correctOp} ${n2}/${d2}</strong>.</p>
        `;

        return {
            type: 'compare',
            category: 'compare',
            promptText: 'Сравни дроби, выбрав знак (>, <, =):',
            frac1: { n: n1, d: d1 },
            frac2: { n: n2, d: d2 },
            correctOp: correctOp,
            solution: stepsHtml,
            visualData: {
                type: 'bar_compare',
                n1: n1, d1: d1,
                n2: n2, d2: d2
            }
        };
    }

    // Центральная функция выбора следующего примера
    function generateProblem() {
        isChecked = false;
        solutionCardEl.classList.add('hidden');
        solutionContentEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'trainer-feedback';

        let mode = currentMode;
        if (mode === 'mixed') {
            const pool = ['same_denom', 'diff_denom', 'reduce', 'mul_div', 'compare'];
            mode = pickRandom(pool);
        }

        switch (mode) {
            case 'same_denom':
                currentProblem = generateSameDenomProblem();
                break;
            case 'diff_denom':
                currentProblem = generateDiffDenomProblem();
                break;
            case 'reduce':
                currentProblem = generateReduceProblem();
                break;
            case 'mul_div':
                currentProblem = generateMulDivProblem();
                break;
            case 'compare':
                currentProblem = generateCompareProblem();
                break;
            default:
                currentProblem = generateSameDenomProblem();
        }

        renderProblemUI(currentProblem);
        renderVisualModel(currentProblem.visualData);
    }

    // --- Отрисовка интерфейса задачи ---
    function renderProblemUI(prob) {
        problemPromptEl.textContent = prob.promptText;
        problemContainerEl.innerHTML = '';

        if (prob.type === 'calc') {
            // Дробь 1
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            // Знак операции
            const opSpan = document.createElement('span');
            opSpan.className = 'operator-sign';
            opSpan.textContent = prob.op === '×' ? '×' : (prob.op === '÷' ? '÷' : prob.op);
            problemContainerEl.appendChild(opSpan);

            // Дробь 2
            problemContainerEl.appendChild(createFractionNode(prob.frac2.n, prob.frac2.d));

            // Знак равно
            const eqSpan = document.createElement('span');
            eqSpan.className = 'operator-sign';
            eqSpan.textContent = '=';
            problemContainerEl.appendChild(eqSpan);

            // Блок ввода ответа
            problemContainerEl.appendChild(createFractionInputBlock());

            setupFractionInputListeners();
        } else if (prob.type === 'reduce') {
            // Исходная дробь
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            // Знак стрелки или равно
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'operator-sign';
            arrowSpan.textContent = '=';
            problemContainerEl.appendChild(arrowSpan);

            // Блок ввода ответа
            problemContainerEl.appendChild(createFractionInputBlock());

            setupFractionInputListeners();
        } else if (prob.type === 'compare') {
            // Дробь 1
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            // Кнопки выбора знака
            const compareBox = document.createElement('div');
            compareBox.className = 'compare-selector-box';
            compareBox.innerHTML = `
                <button type="button" class="compare-choice-btn" data-sign="<">&lt;</button>
                <button type="button" class="compare-choice-btn" data-sign="=">=</button>
                <button type="button" class="compare-choice-btn" data-sign=">">&gt;</button>
            `;
            problemContainerEl.appendChild(compareBox);

            // Дробь 2
            problemContainerEl.appendChild(createFractionNode(prob.frac2.n, prob.frac2.d));

            setupCompareListeners();
        }
    }

    function createFractionNode(n, d) {
        const wrap = document.createElement('div');
        wrap.className = 'math-fraction-view';
        wrap.innerHTML = `
            <span class="math-num">${n}</span>
            <span class="math-bar"></span>
            <span class="math-den">${d}</span>
        `;
        return wrap;
    }

    function createFractionInputBlock() {
        const wrap = document.createElement('div');
        wrap.className = 'fraction-answer-inputs';
        wrap.innerHTML = `
            <input type="number" id="input-numerator" class="fraction-input-num" placeholder="число" autocomplete="off" step="1">
            <span class="fraction-input-divider"></span>
            <input type="number" id="input-denominator" class="fraction-input-den" placeholder="знаменатель" autocomplete="off" step="1">
        `;
        return wrap;
    }

    function setupFractionInputListeners() {
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');

        if (numInput && denInput) {
            numInput.focus();

            numInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === '/' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    denInput.focus();
                    denInput.select();
                }
            });

            denInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || (e.key === 'Backspace' && denInput.value === '')) {
                    numInput.focus();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    checkAnswer();
                }
            });

            numInput.addEventListener('input', clearHighlight);
            denInput.addEventListener('input', clearHighlight);
        }
    }

    function setupCompareListeners() {
        const btns = document.querySelectorAll('.compare-choice-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                checkCompareAnswer(btn.dataset.sign);
            });
        });
    }

    function clearHighlight() {
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        if (numInput) numInput.classList.remove('correct-val', 'incorrect-val');
        if (denInput) denInput.classList.remove('correct-val', 'incorrect-val');
        feedbackEl.textContent = '';
        feedbackEl.className = 'trainer-feedback';
    }

    // --- Отрисовка визуальной модели (SVG полоски дробей) ---
    function renderVisualModel(vData) {
        if (!visualContainerEl) return;
        if (!visualVisible) {
            visualContainerEl.style.display = 'none';
            return;
        }
        visualContainerEl.style.display = 'block';

        if (!vData) {
            visualContainerEl.innerHTML = '';
            return;
        }

        let html = '';

        if (vData.type === 'bar_same_denom') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Схема (знаменатель: ${vData.den}):</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">1-я дробь (${vData.n1}/${vData.den}):</span>
                        ${createSvgFractionStrip(vData.den, vData.n1, '#3b82f6')}
                    </div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">2-я дробь (${vData.n2}/${vData.den}):</span>
                        ${createSvgFractionStrip(vData.den, vData.n2, '#f59e0b')}
                    </div>
                </div>
            `;
        } else if (vData.type === 'bar_diff_denom') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Сравнение долей (общий знаменатель ${vData.commonDen}):</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">1-я дробь (${vData.n1}/${vData.d1}):</span>
                        ${createSvgFractionStrip(vData.d1, vData.n1, '#3b82f6')}
                    </div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">2-я дробь (${vData.n2}/${vData.d2}):</span>
                        ${createSvgFractionStrip(vData.d2, vData.n2, '#10b981')}
                    </div>
                </div>
            `;
        } else if (vData.type === 'bar_reduce') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Дробь до и после сокращения:</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Исходная (${vData.origN}/${vData.origD}):</span>
                        ${createSvgFractionStrip(vData.origD, vData.origN, '#ef4444')}
                    </div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Сокращённая (${vData.baseN}/${vData.baseD}):</span>
                        ${createSvgFractionStrip(vData.baseD, vData.baseN, '#10b981')}
                    </div>
                </div>
            `;
        } else if (vData.type === 'bar_compare') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Наглядное сравнение частей целого:</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Дробь A (${vData.n1}/${vData.d1}):</span>
                        ${createSvgFractionStrip(vData.d1, vData.n1, '#3b82f6')}
                    </div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Дробь B (${vData.n2}/${vData.d2}):</span>
                        ${createSvgFractionStrip(vData.d2, vData.n2, '#8b5cf6')}
                    </div>
                </div>
            `;
        } else if (vData.type === 'bar_mul_div') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Умножение долей целого:</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Дробь 1 (${vData.n1}/${vData.d1}):</span>
                        ${createSvgFractionStrip(vData.d1, vData.n1, '#3b82f6')}
                    </div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Дробь 2 (${vData.n2}/${vData.d2}):</span>
                        ${createSvgFractionStrip(vData.d2, vData.n2, '#10b981')}
                    </div>
                </div>
            `;
        }

        visualContainerEl.innerHTML = html;
    }

    function createSvgFractionStrip(total, filled, color) {
        const svgW = 260;
        const svgH = 26;
        const partW = svgW / total;

        let rects = '';
        for (let i = 0; i < total; i++) {
            const x = i * partW;
            const isFilled = i < filled;
            const fillCol = isFilled ? color : '#e2e8f0';
            rects += `<rect x="${x + 0.5}" y="1" width="${partW - 1}" height="${svgH - 2}" rx="3" fill="${fillCol}" stroke="#475569" stroke-width="1.2" />`;
        }

        return `
            <svg class="fraction-strip-svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">
                ${rects}
            </svg>
        `;
    }

    // Переключатель показа визуальной схемы
    if (toggleVisualBtn) {
        toggleVisualBtn.addEventListener('click', () => {
            visualVisible = !visualVisible;
            toggleVisualBtn.textContent = visualVisible ? '📊 Скрыть схему' : '📊 Показать схему';
            renderVisualModel(currentProblem ? currentProblem.visualData : null);
        });
    }

    // --- Проверка ответа ---
    function checkAnswer() {
        if (!currentProblem || isChecked) return;

        if (currentProblem.type === 'compare') {
            // Проверка для режима сравнения происходит по клику на кнопку знака
            feedbackEl.textContent = 'Выбери один из знаков: <, = или > выше!';
            feedbackEl.className = 'trainer-feedback warning';
            return;
        }

        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');

        if (!numInput || !denInput) return;

        const numVal = parseInt(numInput.value.trim(), 10);
        const denRaw = denInput.value.trim();
        let denVal = parseInt(denRaw, 10);

        // Если знаменатель пустой, но числитель введен, и правильный ответ - целое число
        if (isNaN(denVal) && !isNaN(numVal)) {
            if (currentProblem.reducedTarget.d === 1) {
                denVal = 1;
            }
        }

        if (isNaN(numVal) || isNaN(denVal)) {
            feedbackEl.textContent = 'Пожалуйста, заполни числитель и знаменатель!';
            feedbackEl.className = 'trainer-feedback warning';
            numInput.classList.add('incorrect-val');
            denInput.classList.add('incorrect-val');
            playSound('incorrect');
            return;
        }

        if (denVal === 0) {
            feedbackEl.textContent = 'Знаменатель не может быть равен нулю!';
            feedbackEl.className = 'trainer-feedback warning';
            denInput.classList.add('incorrect-val');
            playSound('incorrect');
            return;
        }

        // Проверяем математическое равенство
        const userG = gcd(numVal, denVal);
        const userRedN = numVal / userG;
        const userRedD = denVal / userG;

        const targetRedN = currentProblem.reducedTarget.n;
        const targetRedD = currentProblem.reducedTarget.d;

        const isMathEqual = (userRedN === targetRedN) && (userRedD === targetRedD);

        if (isMathEqual) {
            // Проверяем, сокращена ли дробь до конца
            const isFullyReduced = (numVal === targetRedN) && (denVal === targetRedD);

            if (currentProblem.type === 'reduce' && !isFullyReduced) {
                // В режиме сокращения требуется полностью несократимый вид
                feedbackEl.textContent = `Дробь ${numVal}/${denVal} верна по значению, но её можно сократить ещё! Раздели дальше.`;
                feedbackEl.className = 'trainer-feedback warning';
                numInput.classList.add('warning-val');
                denInput.classList.add('warning-val');
                playSound('incorrect');
                return;
            }

            // Успех!
            handleSuccess(isFullyReduced, numVal, denVal, targetRedN, targetRedD);
        } else {
            handleFailure();
        }
    }

    function checkCompareAnswer(chosenSign) {
        if (!currentProblem || isChecked || currentProblem.type !== 'compare') return;

        const isCorrect = chosenSign === currentProblem.correctOp;
        if (isCorrect) {
            handleSuccess(true);
        } else {
            handleFailure();
        }
    }

    function handleSuccess(isFullyReduced, numVal, denVal, targetRedN, targetRedD) {
        isChecked = true;
        stats.correct++;
        stats.total++;
        stats.streak++;
        if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;

        updateRank();
        recordStudyAttempt(true);

        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        if (numInput) numInput.classList.add('correct-val');
        if (denInput) denInput.classList.add('correct-val');

        if (stats.streak > 0 && stats.streak % 5 === 0) {
            playSound('streak');
            feedbackEl.innerHTML = `🔥 Превосходно! Серия из <strong>${stats.streak}</strong> правильных ответов!`;
        } else {
            playSound('correct');
            if (currentProblem.type === 'calc' && !isFullyReduced) {
                feedbackEl.innerHTML = `Правильно! Молодец! 👏 <span style="font-size:0.9em; opacity:0.95;">(Совет: её можно сократить до <strong>${targetRedN}/${targetRedD}</strong>)</span>`;
            } else {
                const compliments = [
                    'Отлично! Всё верно! ⭐',
                    'Идеально решено! Молодец! 🎯',
                    'Верно! Отличная работа с дробями! ✨',
                    'В точку! Ты прекрасно разбираешься в дробях! 🌟',
                    'Супер! Точный ответ! 🚀'
                ];
                feedbackEl.textContent = pickRandom(compliments);
            }
        }
        feedbackEl.className = 'trainer-feedback success';

        // Автопереход через 1.4 секунды
        setTimeout(() => {
            if (isChecked) {
                generateProblem();
            }
        }, 1400);
    }

    function handleFailure() {
        stats.total++;
        stats.streak = 0;
        updateRank();
        recordStudyAttempt(false);

        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        if (numInput) {
            numInput.classList.add('incorrect-val');
            numInput.focus();
            numInput.select();
        }
        if (denInput) {
            denInput.classList.add('incorrect-val');
        }

        playSound('incorrect');
        feedbackEl.textContent = 'Пока неверно! Попробуй ещё раз или нажми «💡 Подсказка».';
        feedbackEl.className = 'trainer-feedback error';
    }

    // Подсказка / пошаговое решение
    function showHint() {
        if (!currentProblem) return;
        solutionContentEl.innerHTML = currentProblem.solution;
        solutionCardEl.classList.remove('hidden');
        solutionCardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Сохранение попытки в общий прогресс сайта
    function recordStudyAttempt(isCorrect) {
        const storageKey = 'studyMetrics';
        let attempts = [];
        try {
            const raw = localStorage.getItem(storageKey);
            attempts = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(attempts)) attempts = [];
        } catch (e) {
            attempts = [];
        }

        attempts.push({
            timestamp: new Date().toISOString(),
            subject: 'Математика',
            taskId: 'math_moduls/common_fraction_trainer.html',
            skill: 'fractionsPercentages',
            correct: isCorrect
        });

        try {
            localStorage.setItem(storageKey, JSON.stringify(attempts));
        } catch (e) {
            // LocalStorage переполнен или заблокирован
        }
    }

    // --- Обработчики режимов ---
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            generateProblem();
        });
    });

    if (checkButton) checkButton.addEventListener('click', checkAnswer);
    if (nextButton) nextButton.addEventListener('click', generateProblem);
    if (hintButton) hintButton.addEventListener('click', showHint);

    // Клавиатурные горячие клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            solutionCardEl.classList.add('hidden');
        }
        // Для сравнения можно нажимать прямо клавиши <, >, =
        if (currentProblem && currentProblem.type === 'compare' && !isChecked) {
            if (e.key === '<' || e.key === ',' || e.key === 'б' || e.key === 'Б') {
                checkCompareAnswer('<');
            } else if (e.key === '>' || e.key === '.' || e.key === 'ю' || e.key === 'Ю') {
                checkCompareAnswer('>');
            } else if (e.key === '=' || e.key === '+') {
                checkCompareAnswer('=');
            }
        }
    });

    // Старт
    updateRank();
    generateProblem();
});
