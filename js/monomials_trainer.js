/**
 * Тренажёр по алгебре · 7 класс
 * «Одночлены: сложение, вычитание, умножение, деление и возведение в степень»
 *
 * Модуль генерации задач, проверки ответов и интеграции с платформой.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const exported = factory();
    module.exports = exported;
    if (root) root.MonomialsTrainer = exported;
  } else {
    root.MonomialsTrainer = factory();
  }
}(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // --- Форматирование одночленов ---

  function formatMonomialHtml(coeff, vars) {
    if (coeff === 0) return '0';

    const varKeys = Object.keys(vars || {}).sort();
    let varsHtml = '';
    for (const v of varKeys) {
      const exp = vars[v];
      if (exp === 1) {
        varsHtml += v;
      } else if (exp > 1) {
        varsHtml += `${v}<sup>${exp}</sup>`;
      }
    }

    if (!varsHtml) return String(coeff);
    if (coeff === 1) return varsHtml;
    if (coeff === -1) return '−' + varsHtml;
    const sign = coeff < 0 ? '−' : '';
    return `${sign}${Math.abs(coeff)}${varsHtml}`;
  }

  function formatMonomialText(coeff, vars) {
    if (coeff === 0) return '0';

    const varKeys = Object.keys(vars || {}).sort();
    let varsText = '';
    for (const v of varKeys) {
      const exp = vars[v];
      if (exp === 1) {
        varsText += v;
      } else if (exp > 1) {
        varsText += `${v}^${exp}`;
      }
    }

    if (!varsText) return String(coeff);
    if (coeff === 1) return varsText;
    if (coeff === -1) return '-' + varsText;
    return `${coeff}${varsText}`;
  }

  function wrapNegative(htmlStr, coeff) {
    if (coeff < 0) return `(${htmlStr})`;
    return htmlStr;
  }

  // --- Парсер и сравнение одночленов ---

  function parseMonomial(str) {
    let s = String(str || '').trim().replace(/\s+/g, '').replace(/[*·]/g, '').replace(',', '.').replace(/−/g, '-');
    if (s === '0') return { coeff: 0, vars: {} };

    // Замена надстрочных символов (⁰¹²³⁴⁵⁶⁷⁸⁹)
    const supMap = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁺':'+', '⁻':'-' };
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, match => '^' + Array.from(match).map(ch => supMap[ch] || ch).join(''));

    // Выделение числового коэффициента в начале
    const coeffMatch = s.match(/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)/);
    let coeff = 1;
    let rest = s;
    if (coeffMatch) {
      coeff = parseFloat(coeffMatch[0]);
      rest = s.slice(coeffMatch[0].length);
    } else if (s.startsWith('-')) {
      coeff = -1;
      rest = s.slice(1);
    } else if (s.startsWith('+')) {
      coeff = 1;
      rest = s.slice(1);
    }

    const vars = {};
    const varRegex = /([a-zA-Zа-яА-Я])(?:\^([+-]?\d+)|(\d))?/g;
    let m;
    const cyrToLat = { 'а':'a', 'в':'b', 'с':'c', 'х':'x', 'у':'y', 'е':'e', 'о':'o', 'р':'p', 'к':'k', 'м':'m' };

    while ((m = varRegex.exec(rest)) !== null) {
      const rawName = m[1].toLowerCase();
      const normName = cyrToLat[rawName] || rawName;
      const exp = m[2] !== undefined ? parseInt(m[2], 10) : (m[3] !== undefined ? parseInt(m[3], 10) : 1);
      if (exp !== 0) {
        vars[normName] = (vars[normName] || 0) + exp;
      }
    }

    Object.keys(vars).forEach(k => {
      if (vars[k] === 0) delete vars[k];
    });

    return { coeff, vars };
  }

  function areMonomialsEqual(m1, m2) {
    const o1 = typeof m1 === 'string' ? parseMonomial(m1) : m1;
    const o2 = typeof m2 === 'string' ? parseMonomial(m2) : m2;

    if (!o1 || !o2) return false;
    if (o1.coeff === 0 && o2.coeff === 0) return true;
    if (Math.abs(o1.coeff - o2.coeff) > 0.0001) return false;

    const keys1 = Object.keys(o1.vars).sort();
    const keys2 = Object.keys(o2.vars).sort();
    if (keys1.length !== keys2.length) return false;

    for (let i = 0; i < keys1.length; i++) {
      const k = keys1[i];
      if (k !== keys2[i]) return false;
      if (o1.vars[k] !== o2.vars[k]) return false;
    }
    return true;
  }

  // --- Генерация заданий по разделам ---

  // 1. Сложение подобных одночленов
  function genAddition() {
    const varConfig = pickRandom([
      { a: randInt(2, 5) },
      { x: randInt(2, 6) },
      { x: randInt(1, 3), y: randInt(1, 3) },
      { a: randInt(1, 3), b: randInt(1, 3) },
      { c: randInt(2, 4), d: randInt(1, 3) }
    ]);

    let c1 = randInt(-12, 14);
    let c2 = randInt(-12, 14);
    if (c1 === 0) c1 = pickRandom([-5, 3, 7]);
    if (c2 === 0) c2 = pickRandom([-4, 5, 8]);

    const targetCoeff = c1 + c2;
    const targetVars = { ...varConfig };

    const h1 = formatMonomialHtml(c1, varConfig);
    const h2 = formatMonomialHtml(c2, varConfig);
    const hAns = formatMonomialHtml(targetCoeff, targetVars);
    const tAns = formatMonomialText(targetCoeff, targetVars);

    const questionHtml = `<div class="math-expr"><span class="expr-line">${h1} + ${wrapNegative(h2, c2)} = ?</span></div>`;
    const prompt = 'Выполните сложение подобных одночленов:';

    const solutionSteps = [
      `1. Одночлены подобны, так как имеют одинаковую буквенную часть: <code>${formatMonomialHtml(1, varConfig)}</code>.`,
      `2. Складываем их числовые коэффициенты:<br><code>${c1} + (${c2}) = ${targetCoeff}</code>.`,
      `3. Буквенную часть оставляем без изменений:<br><code>${h1} + ${wrapNegative(h2, c2)} = <strong>${hAns}</strong></code>.`
    ];

    // Дистракторы
    const distractors = [
      formatMonomialHtml(c1 - c2, targetVars),
      formatMonomialHtml(-targetCoeff, targetVars),
      formatMonomialHtml(targetCoeff, doubleExponents(targetVars))
    ];

    return buildTaskResult('addition', 'Сложение одночленов', prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, distractors, 'Сложи числовые коэффициенты, а буквенную часть оставь без изменений.');
  }

  // 2. Вычитание подобных одночленов
  function genSubtraction() {
    const varConfig = pickRandom([
      { x: randInt(2, 5) },
      { a: randInt(2, 5) },
      { m: randInt(1, 3), n: randInt(1, 3) },
      { x: randInt(1, 3), y: randInt(1, 3) },
      { p: randInt(2, 4), q: randInt(1, 3) }
    ]);

    let c1 = randInt(-14, 15);
    let c2 = randInt(-14, 15);
    if (c1 === 0) c1 = pickRandom([-7, 6, 9]);
    if (c2 === 0) c2 = pickRandom([-6, 8, 4]);

    const targetCoeff = c1 - c2;
    const targetVars = { ...varConfig };

    const h1 = formatMonomialHtml(c1, varConfig);
    const h2 = formatMonomialHtml(c2, varConfig);
    const hAns = formatMonomialHtml(targetCoeff, targetVars);
    const tAns = formatMonomialText(targetCoeff, targetVars);

    const questionHtml = `<div class="math-expr"><span class="expr-line">${h1} − ${wrapNegative(h2, c2)} = ?</span></div>`;
    const prompt = 'Выполните вычитание подобных одночленов:';

    const solutionSteps = [
      `1. Одночлены подобны, так как содержат одинаковые переменные в одинаковых степенях.`,
      `2. Находим разность числовых коэффициентов:<br><code>${c1} − (${c2}) = ${c1} + (${-c2}) = ${targetCoeff}</code>.`,
      `3. Буквенную часть приписываем без изменений:<br><code>${h1} − ${wrapNegative(h2, c2)} = <strong>${hAns}</strong></code>.`
    ];

    const distractors = [
      formatMonomialHtml(c1 + c2, targetVars),
      formatMonomialHtml(-targetCoeff, targetVars),
      formatMonomialHtml(targetCoeff === 0 ? 1 : targetCoeff, { ...targetVars, [Object.keys(targetVars)[0]]: (targetVars[Object.keys(targetVars)[0]] || 1) + 1 })
    ];

    return buildTaskResult('subtraction', 'Вычитание одночленов', prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, distractors, 'Вычти числовые коэффициенты: c₁ − c₂. Буквенная часть остаётся прежней.');
  }

  // 3. Умножение одночленов
  function genMultiplication() {
    const varsList = pickRandom([['x', 'y'], ['a', 'b'], ['m', 'n'], ['c', 'd']]);
    const v1 = varsList[0];
    const v2 = varsList[1];

    const p1 = randInt(1, 3);
    const q1 = randInt(1, 3);
    const p2 = randInt(1, 3);
    const q2 = randInt(1, 3);

    const vars1 = { [v1]: p1, [v2]: q1 };
    const vars2 = { [v1]: p2, [v2]: q2 };

    let c1 = pickRandom([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    let c2 = pickRandom([-5, -4, -3, -2, 2, 3, 4, 5, 7]);

    const targetCoeff = c1 * c2;
    const targetVars = { [v1]: p1 + p2, [v2]: q1 + q2 };

    const h1 = formatMonomialHtml(c1, vars1);
    const h2 = formatMonomialHtml(c2, vars2);
    const hAns = formatMonomialHtml(targetCoeff, targetVars);
    const tAns = formatMonomialText(targetCoeff, targetVars);

    const questionHtml = `<div class="math-expr"><span class="expr-line">${wrapNegative(h1, c1)} · ${wrapNegative(h2, c2)} = ?</span></div>`;
    const prompt = 'Выполните умножение одночленов:';

    const solutionSteps = [
      `1. Перемножаем числовые коэффициенты:<br><code>${c1} × (${c2}) = ${targetCoeff}</code>.`,
      `2. При умножении одинаковых переменных показатели их степеней складываются:<br>` +
      `<code>${v1}<sup>${p1}</sup> · ${v1}<sup>${p2}</sup> = ${v1}<sup>${p1}+${p2}</sup> = ${v1}<sup>${p1+p2}</sup></code><br>` +
      `<code>${v2}<sup>${q1}</sup> · ${v2}<sup>${q2}</sup> = ${v2}<sup>${q1}+${q2}</sup> = ${v2}<sup>${q1+q2}</sup></code>.`,
      `3. Записываем произведение в стандартном виде:<br><strong>${hAns}</strong>.`
    ];

    // Дистракторы: перемножение показателей (частая ошибка!), сложение коэффициентов, ошибка знака
    const distractors = [
      formatMonomialHtml(targetCoeff, { [v1]: p1 * p2, [v2]: q1 * q2 }),
      formatMonomialHtml(-targetCoeff, targetVars),
      formatMonomialHtml(c1 + c2, targetVars)
    ];

    return buildTaskResult('multiplication', 'Умножение одночленов', prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, distractors, 'Перемножь числа, а степени одинаковых переменных сложи (aᵐ · aⁿ = aᵐ⁺ⁿ).');
  }

  // 4. Деление одночленов
  function genDivision() {
    const varsList = pickRandom([['x', 'y'], ['a', 'b'], ['m', 'n'], ['c', 'd']]);
    const v1 = varsList[0];
    const v2 = varsList[1];

    const pDiv = randInt(1, 3);
    const qDiv = randInt(1, 2);

    const pQuot = randInt(1, 3);
    const qQuot = Math.random() < 0.4 ? 0 : randInt(1, 2); // иногда переменная сокращается полностью

    const pDividend = pDiv + pQuot;
    const qDividend = qDiv + qQuot;

    let cDiv = pickRandom([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    let cQuot = pickRandom([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    let cDividend = cDiv * cQuot;

    const varsDividend = { [v1]: pDividend, [v2]: qDividend };
    const varsDiv = { [v1]: pDiv, [v2]: qDiv };
    const targetVars = { [v1]: pQuot };
    if (qQuot > 0) targetVars[v2] = qQuot;

    const targetCoeff = cQuot;

    const h1 = formatMonomialHtml(cDividend, varsDividend);
    const h2 = formatMonomialHtml(cDiv, varsDiv);
    const hAns = formatMonomialHtml(targetCoeff, targetVars);
    const tAns = formatMonomialText(targetCoeff, targetVars);

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${h1}) : (${h2}) = ?</span></div>`;
    const prompt = 'Выполните деление одночленов:';

    const solutionSteps = [
      `1. Делим числовые коэффициенты:<br><code>${cDividend} : (${cDiv}) = ${targetCoeff}</code>.`,
      `2. При делении степеней с одинаковыми основаниями показатели вычитаются:<br>` +
      `<code>${v1}<sup>${pDividend}</sup> : ${v1}<sup>${pDiv}</sup> = ${v1}<sup>${pDividend}−${pDiv}</sup> = ${v1}<sup>${pQuot}</sup></code>.` +
      (qQuot > 0
        ? `<br><code>${v2}<sup>${qDividend}</sup> : ${v2}<sup>${qDiv}</sup> = ${v2}<sup>${qDividend}−${qDiv}</sup> = ${v2}<sup>${qQuot}</sup></code>.`
        : `<br><code>${v2}<sup>${qDividend}</sup> : ${v2}<sup>${qDiv}</sup> = ${v2}<sup>0</sup> = 1</code> (переменная ${v2} сократилась).`),
      `3. Итоговое частное:<br><strong>${hAns}</strong>.`
    ];

    const distractors = [
      formatMonomialHtml(-targetCoeff, targetVars),
      formatMonomialHtml(targetCoeff, { [v1]: Math.max(1, pDividend - 1), [v2]: qDividend }),
      formatMonomialHtml(targetCoeff * 2, targetVars)
    ];

    return buildTaskResult('division', 'Деление одночленов', prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, distractors, 'Раздели числовые коэффициенты, а показатели одинаковых переменных вычти (aᵐ : aⁿ = aᵐ⁻ⁿ).');
  }

  // 5. Возведение одночлена в степень
  function genPower() {
    const varsList = pickRandom([['x', 'y'], ['a', 'b'], ['c', 'd'], ['m', 'n']]);
    const v1 = varsList[0];
    const v2 = varsList[1];

    const p = randInt(1, 3);
    const q = randInt(1, 3);
    const vars = { [v1]: p, [v2]: q };

    const exponent = randInt(2, 3); // 2 или 3 степень
    let c = (exponent === 3)
      ? pickRandom([-3, -2, 2, 3])
      : pickRandom([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);

    const targetCoeff = Math.pow(c, exponent);
    const targetVars = { [v1]: p * exponent, [v2]: q * exponent };

    const hBase = formatMonomialHtml(c, vars);
    const hAns = formatMonomialHtml(targetCoeff, targetVars);
    const tAns = formatMonomialText(targetCoeff, targetVars);

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${hBase})<sup>${exponent}</sup> = ?</span></div>`;
    const prompt = 'Возведите одночлен в степень:';

    const solutionSteps = [
      `1. Чтобы возвести произведение в степень, нужно возвести в эту степень каждый множитель: <code>(a · b)ⁿ = aⁿ · bⁿ</code>.`,
      `2. Возводим числовой коэффициент в степень ${exponent}:<br>` +
      `<code>(${c})<sup>${exponent}</sup> = ${targetCoeff}</code>.` +
      (c < 0 && exponent % 2 === 0 ? ' (Отрицательное число в чётной степени даёт плюс!)' : ''),
      `3. При возведении степени в степень показатели перемножаются: <code>(xᵐ)ⁿ = xᵐⁿ</code>:<br>` +
      `<code>(${v1}<sup>${p}</sup>)<sup>${exponent}</sup> = ${v1}<sup>${p}×${exponent}</sup> = ${v1}<sup>${p * exponent}</sup></code><br>` +
      `<code>(${v2}<sup>${q}</sup>)<sup>${exponent}</sup> = ${v2}<sup>${q}×${exponent}</sup> = ${v2}<sup>${q * exponent}</sup></code>.`,
      `4. Итоговый одночлен:<br><strong>${hAns}</strong>.`
    ];

    // Дистракторы: умножение коэффициента на показатель (частая ошибка!), сложение показателей вместо умножения, ошибка знака
    const distractors = [
      formatMonomialHtml(c * exponent, targetVars),
      formatMonomialHtml(targetCoeff, { [v1]: p + exponent, [v2]: q + exponent }),
      formatMonomialHtml(-targetCoeff, targetVars)
    ];

    return buildTaskResult('power', 'Возведение в степень', prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, distractors, 'Возведи число в степень и перемножь показатели степеней: (xᵐ)ⁿ = xᵐⁿ.');
  }

  function doubleExponents(vars) {
    const res = {};
    for (const k of Object.keys(vars)) {
      res[k] = vars[k] * 2;
    }
    return res;
  }

  function buildTaskResult(category, catName, prompt, questionHtml, targetCoeff, targetVars, hAns, tAns, solutionSteps, rawDistractors, hint) {
    // Формируем 4 уникальных варианта ответа
    const optionSet = new Set();
    optionSet.add(hAns);

    const cleanDistractors = [];
    for (const d of rawDistractors) {
      if (d && d !== hAns && !optionSet.has(d)) {
        optionSet.add(d);
        cleanDistractors.push(d);
      }
    }

    // Если не набралось 3 дистрактора, добавляем модификаторы
    let fallbackOffset = 1;
    while (cleanDistractors.length < 3) {
      const altCoeff = targetCoeff + fallbackOffset;
      const alt = formatMonomialHtml(altCoeff, targetVars);
      if (!optionSet.has(alt)) {
        optionSet.add(alt);
        cleanDistractors.push(alt);
      }
      fallbackOffset = fallbackOffset > 0 ? -fallbackOffset - 1 : -fallbackOffset + 1;
    }

    const allOptions = shuffle([
      { html: hAns, isCorrect: true, text: tAns },
      { html: cleanDistractors[0], isCorrect: false },
      { html: cleanDistractors[1], isCorrect: false },
      { html: cleanDistractors[2], isCorrect: false }
    ]);

    const correctIndex = allOptions.findIndex(o => o.isCorrect);

    return {
      category,
      catName,
      prompt,
      questionHtml,
      targetCoeff,
      targetVars,
      answerHtml: hAns,
      displayAnswer: tAns,
      answer: tAns,
      acceptedAnswers: [
        tAns,
        hAns.replace(/<[^>]+>/g, ''),
        formatMonomialText(targetCoeff, targetVars),
        String(tAns).replace(/\^/g, '')
      ],
      options: allOptions,
      correctOptionIndex: correctIndex,
      solutionSteps,
      hint
    };
  }

  // --- Единый диспетчер задач ---

  function generateTask(mode) {
    let m = mode || 'mixed';
    if (m.startsWith('monomials_')) {
      m = m.replace('monomials_', '');
    }

    switch (m) {
      case 'addition':
        return genAddition();
      case 'subtraction':
        return genSubtraction();
      case 'multiplication':
        return genMultiplication();
      case 'division':
        return genDivision();
      case 'power':
        return genPower();
      case 'mixed':
      case 'all':
      default:
        return pickRandom([genAddition, genSubtraction, genMultiplication, genDivision, genPower])();
    }
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не указан' };
    }

    // Если ответ выбран из карточек (индекс от 0 до 3)
    if (typeof rawUserAnswer === 'number' && rawUserAnswer >= 0 && rawUserAnswer <= 3) {
      const isCorrect = (rawUserAnswer === task.correctOptionIndex);
      return {
        isCorrect,
        correctIndex: task.correctOptionIndex,
        userIndex: rawUserAnswer,
        displayAnswer: task.displayAnswer
      };
    }

    // Текстовый ввод
    const cleanStr = String(rawUserAnswer).trim();
    if (!cleanStr) return { isCorrect: false, error: 'Введите одночлен' };

    const userMono = parseMonomial(cleanStr);
    const targetMono = { coeff: task.targetCoeff, vars: task.targetVars };

    const isCorrect = areMonomialsEqual(userMono, targetMono);
    return {
      isCorrect,
      userAnswer: cleanStr,
      correctAnswer: task.displayAnswer,
      displayAnswer: task.displayAnswer
    };
  }

  return {
    generateTask,
    checkAnswer,
    genAddition,
    genSubtraction,
    genMultiplication,
    genDivision,
    genPower,
    parseMonomial,
    areMonomialsEqual,
    formatMonomialHtml,
    formatMonomialText
  };
}));
