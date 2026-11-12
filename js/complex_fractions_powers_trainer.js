/**
 * Тренажёр «Сложные вычисления (Дроби, степени)» · Математика 5 класс
 * Согласовано с ФГОС и открытым банком задач для 5–6 классов.
 * Гарантия: строго положительные целые числа или конечные десятичные дроби (> 0).
 * Строгое правило: только положительные натуральные показатели степеней (без отрицательных степеней!).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComplexFractionsPowersTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // --- МАТЕМАТИЧЕСКИЕ УТИЛИТЫ ---
  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isTerminatingDecimal(num, den) {
    if (den === 0) return false;
    let d = Math.abs(den) / gcd(num, den);
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    return d === 1;
  }

  function formatNum(n) {
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function fracHtml(num, den, whole) {
    const frac = `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
    return whole ? `${whole}&nbsp;${frac}` : frac;
  }

  function multistoryHtml(numContent, denContent) {
    return `<span class="fraction multistory"><span class="num">${numContent}</span><span class="den">${denContent}</span></span>`;
  }

  // --- ПРОТОТИП 1: Степени дробей со скобками и вычитанием/сложением ---
  // Пример: (1 1/2)^2 - 3/4 * (0,6)^2
  function genPowersBracketsTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // 1-я часть: (w1 n1/d1)^p1
      const p1 = 2; // Квадрат
      const d1 = pickRandom([2, 4, 5]);
      const w1 = randInt(1, 2);
      const n1 = randInt(1, d1 - 1);
      const fracVal1 = w1 + n1 / d1;
      const part1Val = Math.round(Math.pow(fracVal1, p1) * 10000) / 10000;

      // 2-я часть: frac2 * (dec2)^p2
      const d2 = pickRandom([2, 4, 5, 8]);
      const n2 = randInt(1, d2 - 1);
      const fracVal2 = n2 / d2;

      const dec2 = pickRandom([0.2, 0.4, 0.5, 0.6, 0.8, 1.2]);
      const p2 = 2;
      const dec2Squared = Math.round(Math.pow(dec2, p2) * 10000) / 10000;
      const part2Val = Math.round((fracVal2 * dec2Squared) * 10000) / 10000;

      const isSub = part1Val > part2Val;
      const answerVal = isSub ? Math.round((part1Val - part2Val) * 10000) / 10000 : Math.round((part1Val + part2Val) * 10000) / 10000;
      const op = isSub ? '−' : '+';

      if (answerVal <= 0 || answerVal > 100) continue;

      const questionHtml = `<div class="math-expr"><span class="math-bracket">(</span>${fracHtml(n1, d1, w1)}<span class="math-bracket">)</span><sup>${p1}</sup> ${op} ${fracHtml(n2, d2)} · <span class="math-bracket">(</span>${formatNum(dec2)}<span class="math-bracket">)</span><sup>${p2}</sup></div>`;

      const solutionSteps = [
        `1) Переводим смешанную дробь в неправильную и возводим в квадрат:<br>` +
        `<span class="math-bracket">(</span>${fracHtml(n1, d1, w1)}<span class="math-bracket">)</span><sup>2</sup> = ` +
        `<span class="math-bracket">(</span>${fracHtml(w1 * d1 + n1, d1)}<span class="math-bracket">)</span><sup>2</sup> = ` +
        `${fracHtml(Math.pow(w1 * d1 + n1, 2), Math.pow(d1, 2))} = <strong>${formatNum(part1Val)}</strong>.`,
        `2) Возводим десятичную дробь во 2-ю степень:<br>` +
        `<span class="math-bracket">(</span>${formatNum(dec2)}<span class="math-bracket">)</span><sup>2</sup> = ${formatNum(dec2)} · ${formatNum(dec2)} = <strong>${formatNum(dec2Squared)}</strong>.`,
        `3) Умножаем обыкновенную дробь на результат степени:<br>` +
        `${fracHtml(n2, d2)} · ${formatNum(dec2Squared)} = ${formatNum(fracVal2)} · ${formatNum(dec2Squared)} = <strong>${formatNum(part2Val)}</strong>.`,
        `4) Находим окончательный результат:<br>` +
        `${formatNum(part1Val)} ${op} ${formatNum(part2Val)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_powers_brackets',
        catName: 'Сложные вычисления (Дроби, степени)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Сначала возведи числа в степень, затем выполни умножение и в конце сложение/вычитание.'
      };
    }

    // Запасной канонический вариант
    return {
      category: 'complex_fractions_powers_brackets',
      catName: 'Сложные вычисления (Дроби, степени)',
      questionHtml: `<div class="math-expr"><span class="math-bracket">(</span>1&nbsp;<span class="fraction"><span class="num">1</span><span class="den">2</span></span><span class="math-bracket">)</span><sup>2</sup> − <span class="fraction"><span class="num">3</span><span class="den">4</span></span> · <span class="math-bracket">(</span>0,6<span class="math-bracket">)</span><sup>2</sup></div>`,
      answer: 1.98,
      displayAnswer: '1,98',
      solutionSteps: [
        '1) (1 1/2)^2 = (3/2)^2 = 9/4 = 2,25.',
        '2) (0,6)^2 = 0,36.',
        '3) 3/4 · 0,36 = 0,75 · 0,36 = 0,27.',
        '4) 2,25 − 0,27 = 1,98.'
      ],
      hint: 'Сначала возведи в квадрат каждую дробь.'
    };
  }

  // --- ПРОТОТИП 2: Многоэтажная дробь со степенями ---
  // Пример: ((2/5)^2 + 0,04) / ((0,8)^2 - 0,24)
  function genPowersMultistoryTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // Числитель: (n1/d1)^2 + decTop2
      const d1 = pickRandom([2, 4, 5]);
      const n1 = randInt(1, d1 - 1);
      const fracVal1 = n1 / d1;
      const fracSquared1 = Math.round(Math.pow(fracVal1, 2) * 10000) / 10000;

      const decTop2 = pickRandom([0.04, 0.05, 0.1, 0.15, 0.25, 0.35, 0.09]);
      const isTopAdd = Math.random() > 0.3;
      const topVal = isTopAdd ? Math.round((fracSquared1 + decTop2) * 10000) / 10000 : Math.round((fracSquared1 - decTop2) * 10000) / 10000;
      if (topVal <= 0) continue;

      // Знаменатель: (decB)^2 - decBot2
      const decB = pickRandom([0.4, 0.5, 0.6, 0.8, 1.2, 1.5]);
      const decBSquared = Math.round(Math.pow(decB, 2) * 10000) / 10000;
      const decBot2 = pickRandom([0.04, 0.09, 0.14, 0.15, 0.24, 0.25, 0.39, 0.44]);
      if (decBSquared <= decBot2) continue;

      const botVal = Math.round((decBSquared - decBot2) * 10000) / 10000;
      if (botVal <= 0) continue;

      if (!isTerminatingDecimal(Math.round(topVal * 10000), Math.round(botVal * 10000))) continue;

      const answerVal = Math.round((topVal / botVal) * 10000) / 10000;
      if (answerVal <= 0 || answerVal > 100) continue;

      const topOp = isTopAdd ? '+' : '−';
      const numHtml = `<span class="math-bracket">(</span>${fracHtml(n1, d1)}<span class="math-bracket">)</span><sup>2</sup> ${topOp} ${formatNum(decTop2)}`;
      const denHtml = `<span class="math-bracket">(</span>${formatNum(decB)}<span class="math-bracket">)</span><sup>2</sup> − ${formatNum(decBot2)}`;
      const questionHtml = `<div class="math-expr">${multistoryHtml(numHtml, denHtml)}</div>`;

      const solutionSteps = [
        `1) Возводим дробь в числителе в квадрат:<br>` +
        `<span class="math-bracket">(</span>${fracHtml(n1, d1)}<span class="math-bracket">)</span><sup>2</sup> = ${fracHtml(n1 * n1, d1 * d1)} = <strong>${formatNum(fracSquared1)}</strong>.`,
        `2) Вычисляем числитель: ${formatNum(fracSquared1)} ${topOp} ${formatNum(decTop2)} = <strong>${formatNum(topVal)}</strong>.`,
        `3) Возводим число в знаменателе в квадрат:<br>` +
        `<span class="math-bracket">(</span>${formatNum(decB)}<span class="math-bracket">)</span><sup>2</sup> = <strong>${formatNum(decBSquared)}</strong>.`,
        `4) Вычисляем знаменатель: ${formatNum(decBSquared)} − ${formatNum(decBot2)} = <strong>${formatNum(botVal)}</strong>.`,
        `5) Делим числитель на знаменатель: ${formatNum(topVal)} : ${formatNum(botVal)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_powers_multistory',
        catName: 'Сложные вычисления (Дроби, степени)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Вычисли отдельно значение числителя и знаменателя, возведя числа в квадрат, а затем раздели числитель на знаменатель.'
      };
    }

    // Запасной канонический вариант
    return {
      category: 'complex_fractions_powers_multistory',
      catName: 'Сложные вычисления (Дроби, степени)',
      questionHtml: `<div class="math-expr">${multistoryHtml(`<span class="math-bracket">(</span><span class="fraction"><span class="num">2</span><span class="den">5</span></span><span class="math-bracket">)</span><sup>2</sup> + 0,04`, `<span class="math-bracket">(</span>0,8<span class="math-bracket">)</span><sup>2</sup> − 0,24`)}</div>`,
      answer: 0.5,
      displayAnswer: '0,5',
      solutionSteps: [
        '1) (2/5)^2 = 4/25 = 0,16.',
        '2) Числитель: 0,16 + 0,04 = 0,2.',
        '3) (0,8)^2 = 0,64.',
        '4) Знаменатель: 0,64 − 0,24 = 0,4.',
        '5) Дробь: 0,2 : 0,4 = 2 : 4 = 0,5.'
      ],
      hint: 'Возведи числа в степени в числителе и знаменателе.'
    };
  }

  // --- ПРОТОТИП 3: Степени 10 и вынесение множителя ---
  // Пример: (2,4 * 10^2 - 140) / ((0,5)^2 + 0,75)
  function genPowersBase10Task() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const p10 = pickRandom([2, 3]); // 10^2 = 100 или 10^3 = 1000
      const pow10Val = Math.pow(10, p10);
      const dec1 = pickRandom([0.35, 0.45, 1.2, 1.5, 2.4, 3.2, 4.5, 5.2]);
      const prod1 = Math.round(dec1 * pow10Val);

      const sub1 = randInt(10, Math.round(prod1 * 0.7));
      const topVal = prod1 - sub1;
      if (topVal <= 0) continue;

      // Знаменатель: (decBot)^2 + addBot
      const decBot = pickRandom([0.4, 0.5, 0.6, 0.8]);
      const decBotSq = Math.round(Math.pow(decBot, 2) * 100) / 100;

      // Подбираем addBot так, чтобы сумма знаменателя была красивой: 0.5, 1, 2, 4
      const targetBot = pickRandom([0.5, 1, 2, 2.5, 4]);
      if (targetBot <= decBotSq) continue;
      const addBot = Math.round((targetBot - decBotSq) * 100) / 100;

      const botVal = targetBot;
      const answerVal = Math.round((topVal / botVal) * 100) / 100;
      if (answerVal <= 0 || answerVal > 500) continue;

      const numHtml = `${formatNum(dec1)} · 10<sup>${p10}</sup> − ${sub1}`;
      const denHtml = `<span class="math-bracket">(</span>${formatNum(decBot)}<span class="math-bracket">)</span><sup>2</sup> + ${formatNum(addBot)}`;
      const questionHtml = `<div class="math-expr">${multistoryHtml(numHtml, denHtml)}</div>`;

      const solutionSteps = [
        `1) Возводим 10 в ${p10}-ю степень: 10<sup>${p10}</sup> = ${pow10Val}.`,
        `2) Умножаем: ${formatNum(dec1)} · ${pow10Val} = ${prod1}.`,
        `3) Вычисляем числитель: ${prod1} − ${sub1} = <strong>${topVal}</strong>.`,
        `4) Возводим число в знаменателе в квадрат: <span class="math-bracket">(</span>${formatNum(decBot)}<span class="math-bracket">)</span><sup>2</sup> = ${formatNum(decBotSq)}.`,
        `5) Вычисляем знаменатель: ${formatNum(decBotSq)} + ${formatNum(addBot)} = <strong>${formatNum(botVal)}</strong>.`,
        `6) Находим результат дроби: ${topVal} : ${formatNum(botVal)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_powers_distributive',
        catName: 'Сложные вычисления (Дроби, степени)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Вспомни, что 10 во 2-й степени — это 100, а в 3-й — 1000.'
      };
    }

    return {
      category: 'complex_fractions_powers_distributive',
      catName: 'Сложные вычисления (Дроби, степени)',
      questionHtml: `<div class="math-expr">${multistoryHtml(`2,4 · 10<sup>2</sup> − 140`, `<span class="math-bracket">(</span>0,5<span class="math-bracket">)</span><sup>2</sup> + 0,75`)}</div>`,
      answer: 100,
      displayAnswer: '100',
      solutionSteps: [
        '1) 10^2 = 100.',
        '2) 2,4 · 100 = 240.',
        '3) Числитель: 240 − 140 = 100.',
        '4) (0,5)^2 = 0,25.',
        '5) Знаменатель: 0,25 + 0,75 = 1.',
        '6) Дробь: 100 / 1 = 100.'
      ],
      hint: '10^2 = 100.'
    };
  }

  // --- ПРОТОТИП 4: Группировка со степенями ---
  // Пример: (1,8 * 3^2 + 1,8 * 1^2) / (0,6 * 2^3 - 0,6 * 3)
  function genPowersDistributiveTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const k1 = pickRandom([1.2, 1.4, 1.5, 1.6, 1.8, 2.4, 2.5, 3.5]);
      const k2 = pickRandom([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.2]);

      const baseA = randInt(2, 4); // 2, 3, 4
      const powA = 2; // baseA^2
      const valA = Math.pow(baseA, powA);

      const baseB = randInt(1, 2);
      const valB = Math.pow(baseB, 2);

      const topSum = valA + valB;
      const topTotal = Math.round(k1 * topSum * 100) / 100;

      // Знаменатель: k2 * baseC^pC - k2 * subC
      const baseC = 2;
      const pC = 3; // 2^3 = 8
      const valC = 8;
      const subC = randInt(2, 5);
      const botDiff = valC - subC;
      const botTotal = Math.round(k2 * botDiff * 100) / 100;

      if (botTotal <= 0) continue;
      if (!isTerminatingDecimal(Math.round(topTotal * 100), Math.round(botTotal * 100))) continue;

      const answerVal = Math.round((topTotal / botTotal) * 1000) / 1000;
      if (answerVal <= 0 || answerVal > 200) continue;

      const numHtml = `${formatNum(k1)} · ${baseA}<sup>${powA}</sup> + ${formatNum(k1)} · ${baseB}<sup>2</sup>`;
      const denHtml = `${formatNum(k2)} · ${baseC}<sup>${pC}</sup> − ${formatNum(k2)} · ${subC}`;
      const questionHtml = `<div class="math-expr">${multistoryHtml(numHtml, denHtml)}</div>`;

      const solutionSteps = [
        `1) В числителе выносим общий множитель <strong>${formatNum(k1)}</strong> за скобки:<br>` +
        `${formatNum(k1)} · <span class="math-bracket">(</span>${baseA}<sup>${powA}</sup> + ${baseB}<sup>2</sup><span class="math-bracket">)</span> = ` +
        `${formatNum(k1)} · (${valA} + ${valB}) = ${formatNum(k1)} · ${topSum} = <strong>${formatNum(topTotal)}</strong>.`,
        `2) В знаменателе выносим общий множитель <strong>${formatNum(k2)}</strong> за скобки:<br>` +
        `${formatNum(k2)} · <span class="math-bracket">(</span>${baseC}<sup>${pC}</sup> − ${subC}<span class="math-bracket">)</span> = ` +
        `${formatNum(k2)} · (${valC} − ${subC}) = ${formatNum(k2)} · ${botDiff} = <strong>${formatNum(botTotal)}</strong>.`,
        `3) Делим числитель на знаменатель: ${formatNum(topTotal)} : ${formatNum(botTotal)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_powers_distributive',
        catName: 'Сложные вычисления (Дроби, степени)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Вынеси одинаковый множитель за скобки в числителе и знаменателе.'
      };
    }

    return genPowersBracketsTask();
  }

  // Главная точка входа
  function generateTask(type) {
    switch (type) {
      case 'complex_fractions_powers_brackets':
        return genPowersBracketsTask();
      case 'complex_fractions_powers_multistory':
        return genPowersMultistoryTask();
      case 'complex_fractions_powers_distributive':
        return genPowersDistributiveTask();
      case 'complex_fractions_powers_base10':
        return genPowersBase10Task();
      case 'complex_fractions_powers_all':
      default: {
        const pool = [genPowersBracketsTask, genPowersMultistoryTask, genPowersBase10Task, genPowersDistributiveTask];
        return pickRandom(pool)();
      }
    }
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не введён' };
    }

    const clean = String(rawUserAnswer).trim().replace(/\s+/g, '').replace(',', '.');
    if (clean === '') {
      return { isCorrect: false, error: 'Введите число' };
    }

    const userNum = Number(clean);
    if (isNaN(userNum)) {
      return { isCorrect: false, error: 'Ответ должен быть числом (целым или десятичной дробью)' };
    }

    const correctNum = Number(task.answer);
    const isCorrect = Math.abs(userNum - correctNum) < 0.0001;

    return {
      isCorrect,
      userAnswer: userNum,
      correctAnswer: correctNum,
      displayAnswer: task.displayAnswer || formatNum(correctNum)
    };
  }

  return {
    generateTask,
    checkAnswer,
    genPowersBracketsTask,
    genPowersMultistoryTask,
    genPowersBase10Task,
    genPowersDistributiveTask,
    formatNum,
    fracHtml,
    multistoryHtml
  };
}));
