/**
 * Тренажёр обыкновенных дробей
 * Включает:
 *  - Сложение и вычитание с одинаковыми знаменателями
 *  - Сложение и вычитание с разными знаменателями
 *  - Сокращение дробей
 *  - Выделение целой части из неправильной дроби
 *  - Перевод обыкновенной дроби в десятичную
 *  - Умножение и деление дробей
 *  - Сравнение дробей
 *  - Случайный микс
 * Содержит пошаговые подсказки, наглядные графические схемы и звуковую обратную связь.
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
    const skipButton = document.getElementById('trainer-skip-button');
    const skipDialog = document.getElementById('confirm-skip-dialog');
    const skipCancelBtn = document.getElementById('skip-dialog-cancel');
    const skipConfirmBtn = document.getElementById('skip-dialog-confirm');
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
    let currentMode = 'same_denom';
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
            // Аудио заблокировано браузером
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

    // --- Математические утилиты ---
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
        if (s >= 25) title = 'Магистр дробей 👑';
        else if (s >= 18) title = 'Архимаг математики 🧙';
        else if (s >= 12) title = 'Мастер дробей 💎';
        else if (s >= 8) title = 'Знаток дробей 🥇';
        else if (s >= 5) title = 'Подмастерье 🥈';
        else if (s >= 2) title = 'Начинающий 🥉';

        if (rankTitleEl) rankTitleEl.textContent = title;
        if (scoreCorrectEl) scoreCorrectEl.textContent = stats.correct;
        if (scoreTotalEl) scoreTotalEl.textContent = stats.total;
        if (streakEl) streakEl.textContent = stats.streak;

        if (window.TrainerTracker) {
            window.TrainerTracker.setSessionStreak('common_fractions', stats.streak);
        }
    }

    // --- Генераторы задач для каждого режима ---

    // 1. Одинаковые знаменатели
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
            <p><strong>Шаг 1:</strong> Знаменатели у дробей одинаковые (<code>${den}</code>), поэтому знаменатель результата остаётся <code>${den}</code>.</p>
            <p><strong>Шаг 2:</strong> Выполняем действие только в числителях: <code>${n1} ${op} ${n2} = ${resN}</code>.</p>
            <p><strong>Шаг 3:</strong> Получаем дробь: <code>${resN}/${den}</code>.</p>
        `;

        if (g > 1) {
            stepsHtml += `
                <p><strong>Шаг 4:</strong> Сокращаем дробь на НОД(${resN}, ${den}) = ${g}:<br>
                <code>${resN} : ${g} = ${reducedN}</code><br>
                <code>${den} : ${g} = ${reducedD}</code><br>
                Ответ в несократимом виде: <strong>${reducedN}/${reducedD}</strong>${reducedD === 1 ? ` (или целое число <strong>${reducedN}</strong>)` : ''}.</p>
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

    // 2. Разные знаменатели
    function generateDiffDenomProblem() {
        const op = pickRandom(['+', '-']);
        const denPairs = [
            [2, 3], [2, 4], [2, 5], [3, 4], [3, 6],
            [4, 6], [2, 7], [3, 5], [4, 5], [5, 6],
            [6, 8], [6, 9], [4, 8], [5, 10], [3, 9]
        ];
        const [d1, d2] = pickRandom(denPairs);
        let n1 = getRandomInt(1, d1 - 1);
        let n2 = getRandomInt(1, d2 - 1);

        if (op === '-') {
            if (n1 * d2 <= n2 * d1) {
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
        let baseD = getRandomInt(2, 9);
        let baseN = getRandomInt(1, baseD - 1);
        while (gcd(baseN, baseD) !== 1) {
            baseD = getRandomInt(2, 9);
            baseN = getRandomInt(1, baseD - 1);
        }

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

    // 4. Выделение целой части
    function generateExtractWholeProblem() {
        const den = getRandomInt(2, 9);
        const whole = getRandomInt(1, 4);
        // 20% шанс деления нацело, 80% с остатком
        const hasRemainder = Math.random() > 0.2;
        const rem = hasRemainder ? getRandomInt(1, den - 1) : 0;
        const num = whole * den + rem;

        let stepsHtml = `
            <p><strong>Шаг 1:</strong> Разделим числитель на знаменатель с остатком:<br>
            <code>${num} : ${den} = ${whole}</code> (остаток <code>${rem}</code>).</p>
            <p><strong>Шаг 2:</strong> Неполное частное <strong>${whole}</strong> становится целой частью смешанного числа.</p>
        `;

        if (rem > 0) {
            stepsHtml += `
                <p><strong>Шаг 3:</strong> Остаток <strong>${rem}</strong> записываем в числитель дробной части, а знаменатель <strong>${den}</strong> оставляем без изменений.</p>
                <p><strong>Ответ:</strong> <strong>${whole} ${rem}/${den}</strong>.</p>
            `;
        } else {
            stepsHtml += `
                <p><strong>Шаг 3:</strong> Так как остаток равен <code>0</code>, дробь делится нацело.</p>
                <p><strong>Ответ:</strong> целое число <strong>${whole}</strong>.</p>
            `;
        }

        return {
            type: 'extract_whole',
            category: 'extract_whole',
            promptText: rem === 0 
                ? 'Раздели числитель на знаменатель (дробь делится нацело):' 
                : 'Выдели целую часть из неправильной дроби:',
            frac1: { n: num, d: den },
            targetWhole: whole,
            targetRem: rem,
            targetDen: den,
            solution: stepsHtml,
            visualData: {
                type: 'bar_extract_whole',
                den: den,
                whole: whole,
                rem: rem,
                num: num
            }
        };
    }

    // 5. Перевод в десятичную дробь
    function generateToDecimalProblem() {
        const decimalConfigs = [
            { d: 2, nums: [1] },
            { d: 4, nums: [1, 3] },
            { d: 5, nums: [1, 2, 3, 4] },
            { d: 8, nums: [1, 3, 5, 7] },
            { d: 10, nums: [1, 3, 7, 9] },
            { d: 20, nums: [1, 3, 7, 9, 11, 13, 17, 19] },
            { d: 25, nums: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19] },
            { d: 50, nums: [1, 3, 7, 9, 11, 13, 17, 21, 23, 27, 31, 33, 37, 41, 43, 47] }
        ];

        const cfg = pickRandom(decimalConfigs);
        const n = pickRandom(cfg.nums);
        const d = cfg.d;
        
        // В 25% случаев даём смешанное число (например, 1 1/2 = 1.5, 2 3/4 = 2.75)
        const isMixed = Math.random() < 0.25 && d <= 10;
        const whole = isMixed ? getRandomInt(1, 3) : 0;

        const decimalValue = Math.round((whole + n / d) * 10000) / 10000;

        let roundTarget = 10;
        if (d === 4 || d === 20 || d === 25 || d === 50) roundTarget = 100;
        else if (d === 8) roundTarget = 1000;
        const multiplier = roundTarget / d;
        const expandedN = n * multiplier;

        let stepsHtml = '';
        if (isMixed) {
            stepsHtml = `
                <p><strong>Шаг 1:</strong> Целая часть <strong>${whole}</strong> остаётся целой: <code>${whole},...</code></p>
                <p><strong>Шаг 2:</strong> Переводим дробную часть <code>${n}/${d}</code> в десятичную дробь.<br>
                Домножим числитель и знаменатель на <code>${multiplier}</code>, чтобы знаменатель стал равен <code>${roundTarget}</code>:<br>
                <code>(${n} × ${multiplier}) / (${d} × ${multiplier}) = ${expandedN}/${roundTarget} = ${(n/d).toString().replace('.', ',')}</code>.</p>
                <p><strong>Шаг 3:</strong> Складываем целую часть и дробную:<br>
                <code>${whole} + ${(n/d).toString().replace('.', ',')} = ${decimalValue.toString().replace('.', ',')}</code>.</p>
                <p><strong>Ответ:</strong> <strong>${decimalValue.toString().replace('.', ',')}</strong>.</p>
            `;
        } else {
            stepsHtml = `
                <p><strong>Способ 1 (приведение к знаменателю ${roundTarget}):</strong><br>
                Домножим числитель и знаменатель на <code>${multiplier}</code>:<br>
                <code>(${n} × ${multiplier}) / (${d} × ${multiplier}) = ${expandedN}/${roundTarget} = ${decimalValue.toString().replace('.', ',')}</code>.</p>
                <p><strong>Способ 2 (деление в столбик):</strong><br>
                Разделим числитель на знаменатель: <code>${n} : ${d} = ${decimalValue.toString().replace('.', ',')}</code>.</p>
                <p><strong>Ответ:</strong> <strong>${decimalValue.toString().replace('.', ',')}</strong>.</p>
            `;
        }

        return {
            type: 'to_decimal',
            category: 'to_decimal',
            promptText: isMixed ? 'Переведи смешанное число в десятичную дробь:' : 'Переведи обыкновенную дробь в десятичную:',
            frac1: { n: n, d: d },
            whole: whole,
            isMixed: isMixed,
            targetDecimal: decimalValue,
            solution: stepsHtml,
            visualData: {
                type: 'bar_to_decimal',
                d: d,
                n: n,
                whole: whole,
                decVal: decimalValue
            }
        };
    }

    // 6. Умножение и деление дробей
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
                <p><strong>Шаг 1:</strong> Чтобы умножить обыкновенные дроби, перемножаем числители и знаменатели:<br>
                Числитель: <code>${n1} × ${n2} = ${resN}</code><br>
                Знаменатель: <code>${d1} × ${d2} = ${resD}</code>.</p>
                <p><strong>Шаг 2:</strong> Получаем дробь: <code>${resN}/${resD}</code>.</p>
            `;
        } else {
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

    // 7. Сравнение дробей
    function generateCompareProblem() {
        const d1 = getRandomInt(2, 9);
        const d2 = getRandomInt(2, 9);
        let n1 = getRandomInt(1, d1 - 1);
        let n2 = getRandomInt(1, d2 - 1);

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
            const pool = [
                'same_denom',
                'diff_denom',
                'reduce',
                'extract_whole',
                'to_decimal',
                'mul_div',
                'compare'
            ];
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
            case 'extract_whole':
                currentProblem = generateExtractWholeProblem();
                break;
            case 'to_decimal':
                currentProblem = generateToDecimalProblem();
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
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            const opSpan = document.createElement('span');
            opSpan.className = 'operator-sign';
            opSpan.textContent = prob.op === '×' ? '×' : (prob.op === '÷' ? '÷' : prob.op);
            problemContainerEl.appendChild(opSpan);

            problemContainerEl.appendChild(createFractionNode(prob.frac2.n, prob.frac2.d));

            const eqSpan = document.createElement('span');
            eqSpan.className = 'operator-sign';
            eqSpan.textContent = '=';
            problemContainerEl.appendChild(eqSpan);

            problemContainerEl.appendChild(createFractionInputBlock());
            setupFractionInputListeners();
        } else if (prob.type === 'reduce') {
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'operator-sign';
            arrowSpan.textContent = '=';
            problemContainerEl.appendChild(arrowSpan);

            problemContainerEl.appendChild(createFractionInputBlock());
            setupFractionInputListeners();
        } else if (prob.type === 'extract_whole') {
            // Отображаем неправильную дробь
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            const eqSpan = document.createElement('span');
            eqSpan.className = 'operator-sign';
            eqSpan.textContent = '=';
            problemContainerEl.appendChild(eqSpan);

            // Блок ввода целой части и дроби
            problemContainerEl.appendChild(createMixedInputBlock());
            setupMixedInputListeners();
        } else if (prob.type === 'to_decimal') {
            // Отображаем исходную дробь или смешанное число
            if (prob.isMixed) {
                problemContainerEl.appendChild(createMixedNode(prob.whole, prob.frac1.n, prob.frac1.d));
            } else {
                problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));
            }

            const eqSpan = document.createElement('span');
            eqSpan.className = 'operator-sign';
            eqSpan.textContent = '=';
            problemContainerEl.appendChild(eqSpan);

            // Поле для ввода десятичной дроби
            problemContainerEl.appendChild(createDecimalInputBlock());
            setupDecimalInputListeners();
        } else if (prob.type === 'compare') {
            problemContainerEl.appendChild(createFractionNode(prob.frac1.n, prob.frac1.d));

            const compareBox = document.createElement('div');
            compareBox.className = 'compare-selector-box';
            compareBox.innerHTML = `
                <button type="button" class="compare-choice-btn" data-sign="<">&lt;</button>
                <button type="button" class="compare-choice-btn" data-sign="=">=</button>
                <button type="button" class="compare-choice-btn" data-sign=">">&gt;</button>
            `;
            problemContainerEl.appendChild(compareBox);

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

    function createMixedNode(whole, n, d) {
        const wrap = document.createElement('div');
        wrap.className = 'math-mixed-view';
        wrap.innerHTML = `
            <span class="math-whole">${whole}</span>
            <div class="math-fraction-view">
                <span class="math-num">${n}</span>
                <span class="math-bar"></span>
                <span class="math-den">${d}</span>
            </div>
        `;
        return wrap;
    }

    function createFractionInputBlock() {
        const wrap = document.createElement('div');
        wrap.className = 'fraction-answer-inputs';
        wrap.innerHTML = `
            <input type="number" id="input-numerator" class="fraction-input-num" placeholder="Ч" autocomplete="off" step="1">
            <span class="fraction-input-divider"></span>
            <input type="number" id="input-denominator" class="fraction-input-den" placeholder="З" autocomplete="off" step="1">
        `;
        return wrap;
    }

    function createMixedInputBlock() {
        const wrap = document.createElement('div');
        wrap.className = 'mixed-answer-inputs';
        wrap.innerHTML = `
            <input type="number" id="input-whole" class="fraction-input-whole" placeholder="Целая" autocomplete="off" step="1" title="Целая часть">
            <div class="fraction-answer-inputs">
                <input type="number" id="input-numerator" class="fraction-input-num" placeholder="Ч" autocomplete="off" step="1" title="Остаток (числитель)">
                <span class="fraction-input-divider"></span>
                <input type="number" id="input-denominator" class="fraction-input-den" placeholder="З" autocomplete="off" step="1" title="Знаменатель">
            </div>
        `;
        return wrap;
    }

    function createDecimalInputBlock() {
        const wrap = document.createElement('div');
        wrap.className = 'decimal-answer-inputs';
        wrap.innerHTML = `
            <input type="text" inputmode="decimal" id="input-decimal" class="decimal-input-box" placeholder="Напр. 0,75" autocomplete="off">
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

    function setupMixedInputListeners() {
        const wholeInput = document.getElementById('input-whole');
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');

        if (wholeInput) {
            wholeInput.focus();

            wholeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Если делится нацело, сразу проверяем
                    if (currentProblem && currentProblem.targetRem === 0) {
                        checkAnswer();
                    } else if (numInput) {
                        numInput.focus();
                        numInput.select();
                    }
                } else if (e.key === '/' || e.key === 'ArrowRight') {
                    if (numInput) {
                        e.preventDefault();
                        numInput.focus();
                        numInput.select();
                    }
                }
            });

            wholeInput.addEventListener('input', clearHighlight);
        }

        if (numInput && denInput) {
            numInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === '/' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    denInput.focus();
                    denInput.select();
                } else if (e.key === 'ArrowLeft' || (e.key === 'Backspace' && numInput.value === '')) {
                    if (wholeInput) wholeInput.focus();
                }
            });

            denInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
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

    function setupDecimalInputListeners() {
        const decInput = document.getElementById('input-decimal');
        if (decInput) {
            decInput.focus();
            decInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    checkAnswer();
                }
            });
            decInput.addEventListener('input', clearHighlight);
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
        const wholeInput = document.getElementById('input-whole');
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        const decInput = document.getElementById('input-decimal');

        if (wholeInput) wholeInput.classList.remove('correct-val', 'incorrect-val', 'warning-val');
        if (numInput) numInput.classList.remove('correct-val', 'incorrect-val', 'warning-val');
        if (denInput) denInput.classList.remove('correct-val', 'incorrect-val', 'warning-val');
        if (decInput) decInput.classList.remove('correct-val', 'incorrect-val', 'warning-val');

        feedbackEl.textContent = '';
        feedbackEl.className = 'trainer-feedback';
    }

    // --- Отрисовка визуальной модели (SVG) ---
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
        } else if (vData.type === 'bar_extract_whole') {
            let wholeStrips = '';
            for (let i = 0; i < vData.whole; i++) {
                wholeStrips += `
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Целая ${i + 1} (${vData.den}/${vData.den}):</span>
                        ${createSvgFractionStrip(vData.den, vData.den, '#10b981')}
                    </div>
                `;
            }
            if (vData.rem > 0) {
                wholeStrips += `
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Остаток (${vData.rem}/${vData.den}):</span>
                        ${createSvgFractionStrip(vData.den, vData.rem, '#f59e0b')}
                    </div>
                `;
            }
            html = `
                <div class="visual-card">
                    <div class="visual-label">Состав неправильной дроби ${vData.num}/${vData.den}:</div>
                    ${wholeStrips}
                    <div style="font-size: 0.9rem; color: #93c5fd; margin-top: 4px;">
                        Итого: <strong>${vData.whole}</strong> цел. ${vData.rem > 0 ? `+ <strong>${vData.rem}/${vData.den}</strong>` : ''}
                    </div>
                </div>
            `;
        } else if (vData.type === 'bar_to_decimal') {
            html = `
                <div class="visual-card">
                    <div class="visual-label">Наглядный перевод в десятичную дробь:</div>
                    <div class="visual-strip-row">
                        <span class="visual-strip-tag">Доля (${vData.n}/${vData.d}):</span>
                        ${createSvgFractionStrip(vData.d, vData.n, '#06b6d4')}
                    </div>
                    <div class="visual-strip-row" style="margin-top: 4px;">
                        <span class="visual-strip-tag">На шкале 0..1:</span>
                        ${createSvgDecimalRuler(vData.n / vData.d)}
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
            const fillCol = isFilled ? color : '#1e293b';
            rects += `<rect x="${x + 0.5}" y="1" width="${partW - 1}" height="${svgH - 2}" rx="3" fill="${fillCol}" stroke="#475569" stroke-width="1.2" />`;
        }

        return `
            <svg class="fraction-strip-svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">
                ${rects}
            </svg>
        `;
    }

    function createSvgDecimalRuler(ratio) {
        const svgW = 260;
        const svgH = 28;
        const clamped = Math.max(0, Math.min(1, ratio));
        const px = clamped * svgW;

        return `
            <svg class="fraction-strip-svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">
                <rect x="0" y="8" width="${svgW}" height="10" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1" />
                <rect x="0" y="8" width="${px}" height="10" rx="3" fill="#06b6d4" />
                <circle cx="${px}" cy="13" r="5" fill="#fde047" stroke="#1e293b" stroke-width="1.5" />
                <text x="4" y="26" font-size="9" fill="#94a3b8" font-family="sans-serif">0</text>
                <text x="${svgW / 2 - 8}" y="26" font-size="9" fill="#94a3b8" font-family="sans-serif">0.5</text>
                <text x="${svgW - 10}" y="26" font-size="9" fill="#94a3b8" font-family="sans-serif">1</text>
            </svg>
        `;
    }

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
            feedbackEl.textContent = 'Выбери один из знаков: <, = или > выше!';
            feedbackEl.className = 'trainer-feedback warning';
            return;
        }

        if (currentProblem.type === 'to_decimal') {
            checkDecimalAnswer();
            return;
        }

        if (currentProblem.type === 'extract_whole') {
            checkExtractWholeAnswer();
            return;
        }

        checkFractionCalculationAnswer();
    }

    // 1. Проверка обычной дроби (+, -, *, /, reduce)
    function checkFractionCalculationAnswer() {
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        if (!numInput || !denInput) return;

        const numVal = parseInt(numInput.value.trim(), 10);
        const denRaw = denInput.value.trim();
        let denVal = parseInt(denRaw, 10);

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

        const userG = gcd(numVal, denVal);
        const userRedN = numVal / userG;
        const userRedD = denVal / userG;

        const targetRedN = currentProblem.reducedTarget.n;
        const targetRedD = currentProblem.reducedTarget.d;

        const isMathEqual = (userRedN === targetRedN) && (userRedD === targetRedD);

        if (isMathEqual) {
            const isFullyReduced = (numVal === targetRedN) && (denVal === targetRedD);

            if (currentProblem.type === 'reduce' && !isFullyReduced) {
                feedbackEl.textContent = `Дробь ${numVal}/${denVal} верна по значению, но её можно сократить ещё! Раздели дальше.`;
                feedbackEl.className = 'trainer-feedback warning';
                numInput.classList.add('warning-val');
                denInput.classList.add('warning-val');
                playSound('incorrect');
                return;
            }

            handleSuccess(isFullyReduced, numVal, denVal, targetRedN, targetRedD);
        } else {
            handleFailure();
        }
    }

    // 2. Проверка выделения целой части
    function checkExtractWholeAnswer() {
        const wholeInput = document.getElementById('input-whole');
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        if (!wholeInput) return;

        const wholeRaw = wholeInput.value.trim();
        const numRaw = numInput ? numInput.value.trim() : '';
        const denRaw = denInput ? denInput.value.trim() : '';

        const targetWhole = currentProblem.targetWhole;
        const targetRem = currentProblem.targetRem;
        const targetDen = currentProblem.targetDen;

        const wholeVal = parseInt(wholeRaw, 10);
        const numVal = numRaw === '' ? 0 : parseInt(numRaw, 10);
        let denVal = denRaw === '' ? targetDen : parseInt(denRaw, 10);

        // Если делится нацело (остаток 0)
        if (targetRem === 0) {
            if (isNaN(wholeVal)) {
                feedbackEl.textContent = 'Введи целое число!';
                feedbackEl.className = 'trainer-feedback warning';
                wholeInput.classList.add('incorrect-val');
                playSound('incorrect');
                return;
            }
            if (wholeVal === targetWhole && numVal === 0) {
                wholeInput.classList.add('correct-val');
                handleSuccess(true);
            } else {
                wholeInput.classList.add('incorrect-val');
                handleFailure();
            }
            return;
        }

        // Если есть остаток
        if (isNaN(wholeVal)) {
            feedbackEl.textContent = 'Пожалуйста, укажи целую часть!';
            feedbackEl.className = 'trainer-feedback warning';
            wholeInput.classList.add('incorrect-val');
            playSound('incorrect');
            return;
        }

        if (isNaN(numVal) || isNaN(denVal) || numRaw === '' || denRaw === '') {
            feedbackEl.textContent = 'Укажи дробную часть (числитель и знаменатель)!';
            feedbackEl.className = 'trainer-feedback warning';
            if (numInput) numInput.classList.add('incorrect-val');
            if (denInput) denInput.classList.add('incorrect-val');
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

        // Проверяем, не осталась ли неправильная дробь в остатке
        if (numVal >= denVal) {
            feedbackEl.textContent = `В дробной части ${numVal}/${denVal} всё ещё осталась целая часть! Выдели её до конца.`;
            feedbackEl.className = 'trainer-feedback warning';
            numInput.classList.add('warning-val');
            wholeInput.classList.add('warning-val');
            playSound('incorrect');
            return;
        }

        // Проверяем точное совпадение
        const isExactMatch = (wholeVal === targetWhole && numVal === targetRem && denVal === targetDen);
        // Или эквивалентная дробь (например сокращённый остаток)
        const isEquiv = (wholeVal === targetWhole) && (numVal * targetDen === targetRem * denVal);

        if (isExactMatch || isEquiv) {
            wholeInput.classList.add('correct-val');
            if (numInput) numInput.classList.add('correct-val');
            if (denInput) denInput.classList.add('correct-val');
            handleSuccess(true);
        } else {
            wholeInput.classList.add('incorrect-val');
            if (numInput) numInput.classList.add('incorrect-val');
            if (denInput) denInput.classList.add('incorrect-val');
            handleFailure();
        }
    }

    // 3. Проверка перевода в десятичную дробь
    function checkDecimalAnswer() {
        const decInput = document.getElementById('input-decimal');
        if (!decInput) return;

        const raw = decInput.value.trim().replace(',', '.');
        const userVal = parseFloat(raw);

        if (raw === '' || isNaN(userVal)) {
            feedbackEl.textContent = 'Введи десятичную дробь (например, 0,75 или 1,5)!';
            feedbackEl.className = 'trainer-feedback warning';
            decInput.classList.add('incorrect-val');
            playSound('incorrect');
            return;
        }

        const isCorrect = Math.abs(userVal - currentProblem.targetDecimal) < 0.0001;

        if (isCorrect) {
            decInput.classList.add('correct-val');
            handleSuccess(true);
        } else {
            decInput.classList.add('incorrect-val');
            handleFailure();
        }
    }

    // 4. Проверка сравнения
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
        if (window.TrainerTracker) {
            window.TrainerTracker.recordAttempt('common_fractions', true);
        }
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
        if (window.TrainerTracker) {
            window.TrainerTracker.recordAttempt('common_fractions', false);
        }
        recordStudyAttempt(false);

        const wholeInput = document.getElementById('input-whole');
        const numInput = document.getElementById('input-numerator');
        const denInput = document.getElementById('input-denominator');
        const decInput = document.getElementById('input-decimal');

        if (decInput) {
            decInput.classList.add('incorrect-val');
            decInput.focus();
            decInput.select();
        } else if (wholeInput) {
            wholeInput.classList.add('incorrect-val');
            wholeInput.focus();
            wholeInput.select();
        } else if (numInput) {
            numInput.classList.add('incorrect-val');
            numInput.focus();
            numInput.select();
        }
        if (denInput) denInput.classList.add('incorrect-val');

        playSound('incorrect');
        feedbackEl.textContent = 'Пока неверно! Попробуй ещё раз или нажми «💡 Подсказка».';
        feedbackEl.className = 'trainer-feedback error';
    }

    function showHint() {
        if (!currentProblem) return;
        solutionContentEl.innerHTML = currentProblem.solution;
        solutionCardEl.classList.remove('hidden');
        solutionCardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

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
            // LocalStorage полон или отключен
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

    // --- Логика перехода и пропуска ---
    function handleNext() {
        if (!isChecked) {
            feedbackEl.textContent = 'Решите сначала этот пример!';
            feedbackEl.className = 'trainer-feedback warning';
            playSound('incorrect');

            if (problemContainerEl) {
                problemContainerEl.classList.remove('shake-anim');
                void problemContainerEl.offsetWidth;
                problemContainerEl.classList.add('shake-anim');
            }

            const decInput = document.getElementById('input-decimal');
            const wholeInput = document.getElementById('input-whole');
            const numInput = document.getElementById('input-numerator');
            if (decInput) { decInput.focus(); }
            else if (wholeInput) { wholeInput.focus(); }
            else if (numInput) { numInput.focus(); }
            return;
        }
        generateProblem();
    }

    function handleSkip() {
        if (isChecked) {
            generateProblem();
            return;
        }
        if (skipDialog) {
            skipDialog.showModal();
        } else if (confirm('Вы уверены, что хотите пропустить задание? В таком случае ваша серия и звание сбросятся.')) {
            executeSkip();
        }
    }

    function executeSkip() {
        if (skipDialog && skipDialog.open) {
            skipDialog.close();
        }
        stats.total++;
        stats.streak = 0;
        updateRank();
        if (window.TrainerTracker) {
            window.TrainerTracker.recordAttempt('common_fractions', false);
        }
        recordStudyAttempt(false);
        playSound('incorrect');

        generateProblem();
        feedbackEl.textContent = 'Задание пропущено. Серия сброшена.';
        feedbackEl.className = 'trainer-feedback error';
    }

    if (checkButton) checkButton.addEventListener('click', checkAnswer);
    if (nextButton) nextButton.addEventListener('click', handleNext);
    if (skipButton) skipButton.addEventListener('click', handleSkip);
    if (skipCancelBtn) {
        skipCancelBtn.addEventListener('click', () => {
            if (skipDialog) skipDialog.close();
        });
    }
    if (skipConfirmBtn) {
        skipConfirmBtn.addEventListener('click', executeSkip);
    }
    if (hintButton) hintButton.addEventListener('click', showHint);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            solutionCardEl.classList.add('hidden');
        }
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

    updateRank();
    generateProblem();
});
