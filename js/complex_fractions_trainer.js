/**
 * Тренажёр «Сложные вычисления (Дроби)» · Математика 5 класс
 * Согласовано с ФГОС и открытым банком задач для 5–6 классов.
 * Гарантия: положительные целые числа или конечные десятичные дроби (> 0).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComplexFractionsTrainer = factory();
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

  function lcm(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a * b) / gcd(a, b);
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

  // --- ПРОТОТИП 1: Скобки со смешанными дробями и деление/умножение ---
  // Пример: (1 1/4 - 5/6) : (1/3 + 1/2) или (2 1/3 + 1 1/2) : 4,6
  function genBracketsFractionTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // Подбираем первую скобку: w1 n1/d1 - n2/d2 или сложение
      const d1 = pickRandom([2, 3, 4, 6]);
      const d2 = pickRandom([3, 4, 6, 8, 12]);
      const w1 = randInt(1, 2);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);

      // Значение первой скобки
      const imp1 = w1 * d1 + n1;
      const cDen1 = lcm(d1, d2);
      const sub1 = imp1 * (cDen1 / d1) - n2 * (cDen1 / d2);
      if (sub1 <= 0) continue;

      // Вторая скобка: w2 n3/d3 + n4/d4
      const d3 = pickRandom([2, 3, 4, 6, 8]);
      const d4 = pickRandom([3, 4, 6, 12]);
      const w2 = randInt(0, 1);
      const n3 = randInt(1, d3 - 1);
      const n4 = randInt(1, d4 - 1);

      const imp2 = w2 * d3 + n3;
      const cDen2 = lcm(d3, d4);
      const sum2 = imp2 * (cDen2 / d3) + n4 * (cDen2 / d4);
      if (sum2 <= 0) continue;

      // Деление: (sub1 / cDen1) : (sum2 / cDen2) = (sub1 * cDen2) / (cDen1 * sum2)
      const resNum = sub1 * cDen2;
      const resDen = cDen1 * sum2;

      if (!isTerminatingDecimal(resNum, resDen)) continue;

      const answerVal = resNum / resDen;
      if (answerVal <= 0 || answerVal > 50) continue;

      const g1 = gcd(sub1, cDen1);
      const g2 = gcd(sum2, cDen2);
      const gFinal = gcd(resNum, resDen);

      const expr1Html = `${fracHtml(n1, d1, w1)} − ${fracHtml(n2, d2)}`;
      const expr2Html = w2 ? `${fracHtml(n3, d3, w2)} + ${fracHtml(n4, d4)}` : `${fracHtml(n3, d3)} + ${fracHtml(n4, d4)}`;
      const questionHtml = `<div class="math-expr"><span class="math-bracket">(</span>${expr1Html}<span class="math-bracket">)</span> ÷ <span class="math-bracket">(</span>${expr2Html}<span class="math-bracket">)</span></div>`;

      const solutionSteps = [
        `1) Вычисляем выражение в первой скобке: ${fracHtml(n1, d1, w1)} − ${fracHtml(n2, d2)} = ` +
        `${fracHtml(imp1 * (cDen1 / d1), cDen1)} − ${fracHtml(n2 * (cDen1 / d2), cDen1)} = ` +
        `${fracHtml(sub1, cDen1)}${g1 > 1 ? ` = ${fracHtml(sub1 / g1, cDen1 / g1)}` : ''}.`,
        `2) Вычисляем выражение во второй скобке: ${expr2Html} = ` +
        `${fracHtml(imp2 * (cDen2 / d3), cDen2)} + ${fracHtml(n4 * (cDen2 / d4), cDen2)} = ` +
        `${fracHtml(sum2, cDen2)}${g2 > 1 ? ` = ${fracHtml(sum2 / g2, cDen2 / g2)}` : ''}.`,
        `3) Выполняем деление полученных дробей: ` +
        `${fracHtml(sub1, cDen1)} ÷ ${fracHtml(sum2, cDen2)} = ` +
        `${fracHtml(sub1, cDen1)} · ${fracHtml(cDen2, sum2)} = ` +
        `${fracHtml(resNum, resDen)}${gFinal > 1 && resDen / gFinal !== 1 ? ` = ${fracHtml(resNum / gFinal, resDen / gFinal)}` : ''} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_brackets',
        catName: 'Сложные вычисления (Дроби)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Переведи смешанные дроби в неправильные, приведи к общему знаменателю в каждой скобке, затем замени деление умножением на обратную дробь.'
      };
    }

    // Запасной гарантированный вариант
    return {
      category: 'complex_fractions_brackets',
      catName: 'Сложные вычисления (Дроби)',
      questionHtml: `<div class="math-expr"><span class="math-bracket">(</span>1&nbsp;<span class="fraction"><span class="num">1</span><span class="den">4</span></span> − <span class="fraction"><span class="num">5</span><span class="den">6</span></span><span class="math-bracket">)</span> ÷ <span class="math-bracket">(</span><span class="fraction"><span class="num">1</span><span class="den">3</span></span> + <span class="fraction"><span class="num">1</span><span class="den">2</span></span><span class="math-bracket">)</span></div>`,
      answer: 0.5,
      displayAnswer: '0,5',
      solutionSteps: [
        '1) 1 1/4 − 5/6 = 5/4 − 5/6 = 15/12 − 10/12 = 5/12.',
        '2) 1/3 + 1/2 = 2/6 + 3/6 = 5/6 = 10/12.',
        '3) (5/12) ÷ (5/6) = (5/12) · (6/5) = 6/12 = 1/2 = 0,5.'
      ],
      hint: 'Приведи дроби в скобках к общим знаменателям.'
    };
  }

  // --- ПРОТОТИП 2: Многоэтажная дробь со смешанными и десятичными ---
  // Пример из запроса пользователя: (0,65 - 7/20) / (0,4 * 1,5 + 3/20)
  function genMultistoryDecimalTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // Знаменатели обыкновенных дробей, легко переводящихся в десятичные: 2, 4, 5, 20, 25, 50
      const den1 = pickRandom([4, 5, 20, 25, 50]);
      const num1 = randInt(1, den1 - 1);
      const dec1Val = num1 / den1;

      // Десятичное число сверху
      const decTop = Math.round((dec1Val + pickRandom([0.1, 0.2, 0.3, 0.4, 0.5, 0.15, 0.25, 0.35])) * 100) / 100;
      const topDiff = Math.round((decTop - dec1Val) * 1000) / 1000;
      if (topDiff <= 0) continue;

      // Знаменатель: decA * decB + num2/den2
      const decA = pickRandom([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.2, 1.5]);
      const decB = pickRandom([0.5, 1.5, 2.0, 2.5, 3.5, 4.0, 0.25]);
      const prodBottom = Math.round((decA * decB) * 100) / 100;

      const den2 = pickRandom([4, 5, 20, 25]);
      const num2 = randInt(1, den2 - 1);
      const dec2Val = num2 / den2;

      const botSum = Math.round((prodBottom + dec2Val) * 1000) / 1000;
      if (botSum <= 0) continue;

      const answerVal = Math.round((topDiff / botSum) * 100000) / 100000;
      if (!isTerminatingDecimal(Math.round(topDiff * 1000), Math.round(botSum * 1000))) continue;
      if (answerVal <= 0 || answerVal > 100) continue;

      const numHtml = `${formatNum(decTop)} − ${fracHtml(num1, den1)}`;
      const denHtml = `${formatNum(decA)} · ${formatNum(decB)} + ${fracHtml(num2, den2)}`;
      const questionHtml = `<div class="math-expr">${multistoryHtml(numHtml, denHtml)}</div>`;

      const solutionSteps = [
        `1) Переводим обыкновенную дробь в числителе в десятичную: ${fracHtml(num1, den1)} = ${num1} : ${den1} = ${formatNum(dec1Val)}.`,
        `2) Вычисляем числитель: ${formatNum(decTop)} − ${formatNum(dec1Val)} = ${formatNum(topDiff)}.`,
        `3) Вычисляем умножение в знаменателе: ${formatNum(decA)} · ${formatNum(decB)} = ${formatNum(prodBottom)}.`,
        `4) Переводим обыкновенную дробь в знаменателе: ${fracHtml(num2, den2)} = ${formatNum(dec2Val)}.`,
        `5) Вычисляем знаменатель: ${formatNum(prodBottom)} + ${formatNum(dec2Val)} = ${formatNum(botSum)}.`,
        `6) Находим значение всей дроби: ${formatNum(topDiff)} : ${formatNum(botSum)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_multistory',
        catName: 'Сложные вычисления (Дроби)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Переведи обыкновенные дроби в десятичные, вычисли отдельно числитель и знаменатель, а затем раздели числитель на знаменатель.'
      };
    }

    // Запасной канонический вариант
    return {
      category: 'complex_fractions_multistory',
      catName: 'Сложные вычисления (Дроби)',
      questionHtml: `<div class="math-expr">${multistoryHtml(`0,65 − <span class="fraction"><span class="num">7</span><span class="den">20</span></span>`, `0,4 · 1,5 + <span class="fraction"><span class="num">3</span><span class="den">20</span></span>`)}</div>`,
      answer: 0.4,
      displayAnswer: '0,4',
      solutionSteps: [
        '1) 7/20 = 35/100 = 0,35.',
        '2) Числитель: 0,65 − 0,35 = 0,3.',
        '3) Умножение в знаменателе: 0,4 · 1,5 = 0,6.',
        '4) 3/20 = 15/100 = 0,15.',
        '5) Знаменатель: 0,6 + 0,15 = 0,75.',
        '6) Дробь: 0,3 : 0,75 = 30 : 75 = 2/5 = 0,4.'
      ],
      hint: 'Переведи обыкновенные дроби в десятичные.'
    };
  }

  // --- ПРОТОТИП 3: Вынесение общего множителя (распределительное свойство) ---
  // Пример из запроса: (3,5 * 4 2/3 + 3,5 * 1 1/3) / (1,4 * 8,5 - 1,4 * 3,5)
  function genDistributiveTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // Общий множитель числителя k1
      const k1 = pickRandom([1.5, 2.4, 2.5, 3.2, 3.5, 4.2, 4.5, 5.5, 6.4]);
      // Общий множитель знаменателя k2
      const k2 = pickRandom([0.7, 1.2, 1.4, 1.6, 1.8, 2.1, 2.4, 2.8]);

      // Две смешанные дроби в числителе, дающие целое число
      const d1 = pickRandom([3, 4, 5, 6, 7]);
      const w1 = randInt(1, 4);
      const n1 = randInt(1, d1 - 1);
      const w2 = randInt(1, 3);
      const n2 = d1 - n1; // Чтобы сумма долей дала ровно 1!
      const topBracketSum = w1 + w2 + 1; // Целое число!

      // Два десятичных числа в знаменателе, разность которых даёт красивое число
      const botDiff = pickRandom([2, 3, 4, 5, 6, 8, 10]);
      const decSub = pickRandom([1.5, 2.5, 3.5, 4.2, 5.3, 7.5]);
      const decMain = Math.round((decSub + botDiff) * 10) / 10;

      const topVal = Math.round((k1 * topBracketSum) * 100) / 100;
      const botVal = Math.round((k2 * botDiff) * 100) / 100;

      if (!isTerminatingDecimal(Math.round(topVal * 100), Math.round(botVal * 100))) continue;

      const answerVal = Math.round((topVal / botVal) * 10000) / 10000;
      if (answerVal <= 0 || answerVal > 100) continue;

      const numHtml = `${formatNum(k1)} · ${fracHtml(n1, d1, w1)} + ${formatNum(k1)} · ${fracHtml(n2, d1, w2)}`;
      const denHtml = `${formatNum(k2)} · ${formatNum(decMain)} − ${formatNum(k2)} · ${formatNum(decSub)}`;
      const questionHtml = `<div class="math-expr">${multistoryHtml(numHtml, denHtml)}</div>`;

      const solutionSteps = [
        `1) В числителе выносим общий множитель <strong>${formatNum(k1)}</strong> за скобки:<br>` +
        `${formatNum(k1)} · <span class="math-bracket">(</span>${fracHtml(n1, d1, w1)} + ${fracHtml(n2, d1, w2)}<span class="math-bracket">)</span> = ` +
        `${formatNum(k1)} · ${topBracketSum} = <strong>${formatNum(topVal)}</strong>.`,
        `2) В знаменателе выносим общий множитель <strong>${formatNum(k2)}</strong> за скобки:<br>` +
        `${formatNum(k2)} · <span class="math-bracket">(</span>${formatNum(decMain)} − ${formatNum(decSub)}<span class="math-bracket">)</span> = ` +
        `${formatNum(k2)} · ${botDiff} = <strong>${formatNum(botVal)}</strong>.`,
        `3) Делим числитель на знаменатель: ${formatNum(topVal)} : ${formatNum(botVal)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_distributive',
        catName: 'Сложные вычисления (Дроби)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Примени распределительное свойство умножения: вынеси общий множитель в числителе и знаменателе за скобки!'
      };
    }

    // Запасной канонический вариант
    return {
      category: 'complex_fractions_distributive',
      catName: 'Сложные вычисления (Дроби)',
      questionHtml: `<div class="math-expr">${multistoryHtml(`3,5 · 4&nbsp;<span class="fraction"><span class="num">2</span><span class="den">3</span></span> + 3,5 · 1&nbsp;<span class="fraction"><span class="num">1</span><span class="den">3</span></span>`, `1,4 · 8,5 − 1,4 · 3,5`)}</div>`,
      answer: 3,
      displayAnswer: '3',
      solutionSteps: [
        '1) В числителе выносим 3,5: 3,5 · (4 2/3 + 1 1/3) = 3,5 · 6 = 21.',
        '2) В знаменателе выносим 1,4: 1,4 · (8,5 − 3,5) = 1,4 · 5 = 7.',
        '3) Результат дроби: 21 / 7 = 3.'
      ],
      hint: 'Вынеси общий множитель 3,5 в числителе и 1,4 в знаменателе.'
    };
  }

  // --- ПРОТОТИП 4: Смешанные арифметические цепочки ---
  // Пример: 4,8 : 1 1/5 + (3 3/4 - 1,25) * 0,8
  function genMixedChainTask() {
    for (let attempt = 0; attempt < 100; attempt++) {
      // 1-я часть: dec1 : (w1 n1/d1)
      const d1 = pickRandom([2, 4, 5, 10]);
      const w1 = randInt(1, 2);
      const n1 = randInt(1, d1 - 1);
      const div1Val = w1 + n1 / d1;

      // Подбираем dec1 так, чтобы dec1 : div1Val было хорошим числом
      const q1 = pickRandom([2, 3, 4, 5, 2.5, 1.5, 0.5]);
      const dec1 = Math.round((q1 * div1Val) * 10) / 10;

      // 2-я часть: (w2 n2/d2 - decSub) * mult2
      const d2 = pickRandom([2, 4, 5, 20]);
      const w2 = randInt(2, 4);
      const n2 = randInt(1, d2 - 1);
      const bracketVal = w2 + n2 / d2;
      const decSub = Math.round((bracketVal - pickRandom([0.5, 1.25, 1.5, 2.5, 0.75])) * 100) / 100;
      if (decSub <= 0) continue;

      const diffVal = Math.round((bracketVal - decSub) * 100) / 100;
      const mult2 = pickRandom([0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2.5]);
      const prod2 = Math.round((diffVal * mult2) * 100) / 100;

      const isAdd = Math.random() > 0.4;
      const answerVal = isAdd ? Math.round((q1 + prod2) * 100) / 100 : Math.round((q1 - prod2) * 100) / 100;
      if (answerVal <= 0 || answerVal > 100) continue;

      const op = isAdd ? '+' : '−';
      const questionHtml = `<div class="math-expr">${formatNum(dec1)} ÷ ${fracHtml(n1, d1, w1)} ${op} <span class="math-bracket">(</span>${fracHtml(n2, d2, w2)} − ${formatNum(decSub)}<span class="math-bracket">)</span> · ${formatNum(mult2)}</div>`;

      const solutionSteps = [
        `1) Переводим смешанную дробь первого действия в десятичную: ${fracHtml(n1, d1, w1)} = ${formatNum(div1Val)}.`,
        `2) Выполняем деление: ${formatNum(dec1)} ÷ ${formatNum(div1Val)} = ${formatNum(q1)}.`,
        `3) Переводим дробь в скобках: ${fracHtml(n2, d2, w2)} = ${formatNum(bracketVal)}.`,
        `4) Вычитаем в скобках: ${formatNum(bracketVal)} − ${formatNum(decSub)} = ${formatNum(diffVal)}.`,
        `5) Умножаем результат скобки: ${formatNum(diffVal)} · ${formatNum(mult2)} = ${formatNum(prod2)}.`,
        `6) Конечное действие: ${formatNum(q1)} ${op} ${formatNum(prod2)} = <strong>${formatNum(answerVal)}</strong>.`
      ];

      return {
        category: 'complex_fractions_mixed',
        catName: 'Сложные вычисления (Дроби)',
        questionHtml,
        answer: answerVal,
        displayAnswer: formatNum(answerVal),
        solutionSteps,
        hint: 'Соблюдай порядок действий: сначала скобки, затем деление и умножение, в конце сложение/вычитание.'
      };
    }

    return genBracketsFractionTask();
  }

  // Главная точка входа генерации
  function generateTask(type) {
    switch (type) {
      case 'complex_fractions_brackets':
        return genBracketsFractionTask();
      case 'complex_fractions_multistory':
        return genMultistoryDecimalTask();
      case 'complex_fractions_distributive':
        return genDistributiveTask();
      case 'complex_fractions_mixed':
        return genMixedChainTask();
      case 'complex_fractions_all':
      default: {
        const pool = [genBracketsFractionTask, genMultistoryDecimalTask, genDistributiveTask, genMixedChainTask];
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
    genBracketsFractionTask,
    genMultistoryDecimalTask,
    genDistributiveTask,
    genMixedChainTask,
    formatNum,
    fracHtml,
    multistoryHtml
  };
}));
