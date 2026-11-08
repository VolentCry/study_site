/**
 * ==============================================================================
 * ТРЕНАЖЁР ОГЭ ПО МАТЕМАТИКЕ · ЗАДАНИЕ №20 (ЧАСТЬ 2 · 2 БАЛЛА)
 * «Алгебраические выражения, уравнения, неравенства и системы»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru, Задание 20)
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask20Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Вспомогательные утилиты для форматирования математических выражений
     -------------------------------------------------------------------------- */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatNum(n) {
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function formatSigned(n, showPlus = true) {
    if (n > 0) return (showPlus ? '+ ' : '') + formatNum(n);
    if (n < 0) return '− ' + formatNum(Math.abs(n));
    return '0';
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function formatTerm(coef, varName, isFirst = false) {
    if (coef === 0) return '';
    const absCoef = Math.abs(coef);
    const sign = coef > 0 ? (isFirst ? '' : '+ ') : (isFirst ? '−' : '− ');
    const coefStr = (absCoef === 1 && varName) ? '' : formatNum(absCoef);
    return `${sign}${coefStr}${varName}`;
  }

  function normalizeNum(str) {
    return parseFloat(str.replace(/−/g, '-').replace(',', '.').trim());
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ: РЕЖИМ «УРАВНЕНИЯ» (3-4 степени, биквадратные, ОДЗ)
     -------------------------------------------------------------------------- */

  // 1.1 Биквадратное уравнение через замену t = x^2 (t >= 0)
  function genBiquadraticSimple() {
    const a = pickRandom([1, 2, 3]);
    let b = pickRandom([1, 2, 3, 4, 5]);
    while (b === a) b = pickRandom([1, 2, 3, 4, 5]);

    const hasFourRoots = Math.random() > 0.4;
    let t1, t2;
    let roots = [];

    if (hasFourRoots) {
      t1 = a * a;
      t2 = b * b;
      roots = [-b, -a, a, b].sort((x, y) => x - y);
    } else {
      t1 = a * a;
      t2 = -(b * b);
      roots = [-a, a].sort((x, y) => x - y);
    }

    const p = -(t1 + t2);
    const q = t1 * t2;

    const pStr = p === 0 ? '' : (p > 0 ? `+ ${p}x<sup>2</sup>` : `− ${Math.abs(p)}x<sup>2</sup>`);
    const qStr = q > 0 ? `+ ${q}` : `− ${Math.abs(q)}`;
    const expr = `x<sup>4</sup> ${pStr} ${qStr} = 0`;

    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const solutionSteps = [
      `Введём новую переменную: пусть <strong>t = x<sup>2</sup></strong>, причём обязательно <strong>t ≥ 0</strong>.`,
      `Уравнение принимает квадратный вид относительно <em>t</em>:<br><strong>t<sup>2</sup> ${pStr.replace(/x<sup>2<\/sup>/g, 't')} ${qStr} = 0</strong>.`,
      `По теореме Виета или через дискриминант находим корни для <em>t</em>:<br><strong>t₁ = ${t1}</strong>, <strong>t₂ = ${t2}</strong>.`,
      t2 < 0 
        ? `Поскольку <strong>t₂ = ${t2} &lt; 0</strong>, оно не удовлетворяет условию <strong>t ≥ 0</strong> (квадрат действительного числа не может быть отрицательным). Корней нет.`
        : `Оба значения <em>t</em> удовлетворяют условию <strong>t ≥ 0</strong>.`,
      `Выполняем обратную замену:<br>` + 
        (hasFourRoots 
          ? `• x<sup>2</sup> = ${t1} ⟹ <strong>x = ±${a}</strong><br>• x<sup>2</sup> = ${t2} ⟹ <strong>x = ±${b}</strong>`
          : `• x<sup>2</sup> = ${t1} ⟹ <strong>x = ±${a}</strong>`)
    ];

    const displayAnswer = roots.join('; ');

    return {
      id: 'eq_biquad_' + Date.now() + '_' + Math.random(),
      type: 'equation',
      category: 'equations',
      catName: 'Биквадратное уравнение (замена t = x²)',
      questionHtml,
      promptText: 'Решите биквадратное уравнение. Корни запишите через точку с запятой в любом порядке:',
      inputPlaceholder: 'Пример: -3; -2; 2; 3',
      quickSymbols: ['−', ';', 'нет корней'],
      answerData: { type: 'equation', roots },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): замену t = x² с указанием t ≥ 0 обязательно прописывать. Отбрасывание отрицательного t должно быть обосновано.',
      hint: 'Сделай замену t = x² (где t ≥ 0), реши квадратное уравнение относительно t, затем выполни обратную замену.'
    };
  }

  // 1.2 Биквадратное уравнение вида x^4 = (ax + b)^2 (разность квадратов, классика ФИПИ)
  function genBiquadDiffSquares() {
    // x^4 = (ax + b)^2  <=>  (x^2 - (ax + b))(x^2 + (ax + b)) = 0
    // Популярные каноничные пары из ФИПИ:
    const presets = [
      {
        bStr: 'x − 20', aCoef: 1, bConst: -20,
        factor1: 'x<sup>2</sup> − x + 20', d1: 1 - 80, // D < 0
        factor2: 'x<sup>2</sup> + x − 20', roots: [-5, 4],
        expl2: 'x₁ = −5, x₂ = 4 (по теореме Виета)'
      },
      {
        bStr: '3x − 10', aCoef: 3, bConst: -10,
        factor1: 'x<sup>2</sup> − 3x + 10', d1: 9 - 40, // D < 0
        factor2: 'x<sup>2</sup> + 3x − 10', roots: [-5, 2],
        expl2: 'x₁ = −5, x₂ = 2'
      },
      {
        bStr: '2x − 15', aCoef: 2, bConst: -15,
        factor1: 'x<sup>2</sup> − 2x + 15', d1: 4 - 60, // D < 0
        factor2: 'x<sup>2</sup> + 2x − 15', roots: [-5, 3],
        expl2: 'x₁ = −5, x₂ = 3'
      },
      {
        bStr: '4x − 5', aCoef: 4, bConst: -5,
        factor1: 'x<sup>2</sup> − 4x + 5', d1: 16 - 20, // D < 0
        factor2: 'x<sup>2</sup> + 4x − 5', roots: [-5, 1],
        expl2: 'x₁ = −5, x₂ = 1'
      },
      {
        bStr: '2x − 8', aCoef: 2, bConst: -8,
        factor1: 'x<sup>2</sup> − 2x + 8', d1: 4 - 32, // D < 0
        factor2: 'x<sup>2</sup> + 2x − 8', roots: [-4, 2],
        expl2: 'x₁ = −4, x₂ = 2'
      }
    ];

    const item = pickRandom(presets);
    const expr = `x<sup>4</sup> = (${item.bStr})<sup>2</sup>`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const solutionSteps = [
      `Перенесём всё в левую часть и применим формулу разности квадратов <strong>A<sup>2</sup> − B<sup>2</sup> = (A − B)(A + B)</strong>:<br>` +
      `<strong>(x<sup>2</sup>)<sup>2</sup> − (${item.bStr})<sup>2</sup> = 0</strong> ⟹ <strong>(x<sup>2</sup> − (${item.bStr}))(x<sup>2</sup> + (${item.bStr})) = 0</strong>.`,
      `Раскрываем внутренние скобки:<br><strong>(${item.factor1})(${item.factor2}) = 0</strong>.`,
      `Произведение равно нулю, когда хотя бы один из множителей равен нулю:<br>` +
      `1) <strong>${item.factor1} = 0</strong>: Дискриминант <strong>D = ${item.d1} &lt; 0</strong> ⟹ действительных корней нет.<br>` +
      `2) <strong>${item.factor2} = 0</strong>: ${item.expl2}.`
    ];

    return {
      id: 'eq_diffsq_' + Date.now() + '_' + Math.random(),
      type: 'equation',
      category: 'equations',
      catName: 'Уравнение x⁴ = (ax + b)²',
      questionHtml,
      promptText: 'Решите уравнение методом разности квадратов. Корни запишите через точку с запятой:',
      inputPlaceholder: 'Пример: -5; 4',
      quickSymbols: ['−', ';', 'нет корней'],
      answerData: { type: 'equation', roots: item.roots },
      displayAnswer: item.roots.join('; '),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Не раскрывайте бином 4-й степени! Перенесите в одну часть и разложите на разность квадратов.',
      hint: 'Представь x⁴ как (x²)² и перенеси правую часть влево, применив A² − B² = (A − B)(A + B).'
    };
  }

  // 1.3 Уравнение 3-й степени методом группировки: x^3 + ax^2 - b^2*x - a*b^2 = 0
  function genCubicGrouping() {
    const a = randInt(2, 6);
    const b = randInt(1, 5);
    const bSq = b * b;
    const c = a * bSq;

    const expr = `x<sup>3</sup> + ${a}x<sup>2</sup> − ${bSq}x − ${c} = 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const roots = [-a, -b, b].sort((x, y) => x - y);
    // Удаляем дубликаты, если a === b
    const uniqueRoots = [...new Set(roots)];

    const solutionSteps = [
      `Сгруппируем слагаемые попарно:<br><strong>(x<sup>3</sup> + ${a}x<sup>2</sup>) − (${bSq}x + ${c}) = 0</strong>.`,
      `Вынесем общие множители из каждой группы:<br><strong>x<sup>2</sup>(x + ${a}) − ${bSq}(x + ${a}) = 0</strong>.`,
      `Вынесем общий двучлен <strong>(x + ${a})</strong> за скобки:<br><strong>(x + ${a})(x<sup>2</sup> − ${bSq}) = 0</strong>.`,
      `Разложим разность квадратов:<br><strong>(x + ${a})(x − ${b})(x + ${b}) = 0</strong>.`,
      `Приравниваем каждый множитель к нулю:<br>` +
      `• x + ${a} = 0 ⟹ <strong>x = −${a}</strong><br>` +
      `• x − ${b} = 0 ⟹ <strong>x = ${b}</strong><br>` +
      `• x + ${b} = 0 ⟹ <strong>x = −${b}</strong>`
    ];

    return {
      id: 'eq_cubic_' + Date.now() + '_' + Math.random(),
      type: 'equation',
      category: 'equations',
      catName: 'Уравнение 3-й степени (метод группировки)',
      questionHtml,
      promptText: 'Решите уравнение 3-й степени. Корни запишите через точку с запятой:',
      inputPlaceholder: 'Пример: -4; -3; 3',
      quickSymbols: ['−', ';'],
      answerData: { type: 'equation', roots: uniqueRoots },
      displayAnswer: uniqueRoots.join('; '),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Четко показать вынесение общего множителя (x + a) за скобки.',
      hint: 'Сгруппируй первые два слагаемых и вторые два, вынеси x² и число, затем вынеси общую скобку.'
    };
  }

  // 1.4 Уравнение с корнями и проверкой ОДЗ: x^2 - px + q + √(k - x) = √(k - x) + c
  function genSquareRootOdz() {
    // x^2 - px = c => x^2 - px - c = 0
    // Корни: x1, x2
    // ОДЗ: k - x >= 0 => x <= k
    const x1 = randInt(2, 6);
    const x2 = randInt(-6, -1);
    const p = x1 + x2;
    const prod = -(x1 * x2); // c

    // Выбираем k так, чтобы либо оба подходили, либо x1 отсекался ОДЗ!
    const dropLargerRoot = Math.random() > 0.45;
    let k;
    let roots = [];

    if (dropLargerRoot) {
      // k меньше x1, но >= x2 (например, k = x1 - 1 или randInt(x2, x1 - 1))
      k = x1 - randInt(1, 2);
      roots = [x2]; // x1 посторонний
    } else {
      // k >= x1 (оба корня подходят)
      k = x1 + randInt(0, 3);
      roots = [x2, x1].sort((a, b) => a - b);
    }

    const pTerm = p === 0 ? '' : (p > 0 ? `− ${p}x` : `+ ${Math.abs(p)}x`);
    const expr = `x<sup>2</sup> ${pTerm} + &radic;<span style="border-top:1px solid currentColor;">${k} − x</span> = &radic;<span style="border-top:1px solid currentColor;">${k} − x</span> + ${prod}`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const solutionSteps = [
      `<strong>Шаг 1: Область допустимых значений (ОДЗ).</strong><br>` +
      `Подкоренное выражение должно быть неотрицательным:<br><strong>${k} − x ≥ 0 ⟹ x ≤ ${k}</strong>.`,
      `<strong>Шаг 2: Упрощение уравнения.</strong><br>` +
      `При условии <strong>x ≤ ${k}</strong> слагаемые с квадратным корнем взаимно уничтожаются:<br>` +
      `<strong>x<sup>2</sup> ${pTerm} = ${prod} ⟹ x<sup>2</sup> ${pTerm} − ${prod} = 0</strong>.`,
      `<strong>Шаг 3: Нахождение корней квадратного уравнения.</strong><br>` +
      `По теореме Виета или через дискриминант:<br><strong>x₁ = ${x1}</strong>, <strong>x₂ = ${x2}</strong>.`,
      `<strong>Шаг 4: Проверка по ОДЗ (x ≤ ${k}).</strong><br>` +
      (dropLargerRoot 
        ? `• x = ${x1}: ${x1} &gt; ${k} — <strong>посторонний корень</strong>, не входит в ОДЗ!<br>• x = ${x2}: ${x2} ≤ ${k} — корень подходит.`
        : `• x = ${x1}: ${x1} ≤ ${k} — корень подходит.<br>• x = ${x2}: ${x2} ≤ ${k} — корень подходит.`)
    ];

    return {
      id: 'eq_odz_' + Date.now() + '_' + Math.random(),
      type: 'equation',
      category: 'equations',
      catName: 'Уравнение с ОДЗ (взаимное уничтожение корней)',
      questionHtml,
      promptText: 'Решите уравнение. Не забудьте проверить ОДЗ! Запишите корень или корни через точку с запятой:',
      inputPlaceholder: 'Пример: -2; 5 или -2',
      quickSymbols: ['−', ';'],
      answerData: { type: 'equation', roots },
      displayAnswer: roots.join('; '),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): ОДЗ ОБЯЗАТЕЛЬНО! Если взаимно уничтожить корни без условия x ≤ k, решение оценивается в 0 баллов.',
      hint: 'Сначала найди ОДЗ: подкоренное выражение ≥ 0. Затем взаимно уничтожь корни и проверь найденные значения x.'
    };
  }

  // 1.5 Уравнение: сумма квадратов равна нулю: (x^2 - a^2)^2 + (x^2 + px + q)^2 = 0
  function genSumOfSquaresZero() {
    const a = randInt(2, 5);
    const aSq = a * a;
    // Общий корень будет -a или +a
    const sharedRoot = Math.random() > 0.5 ? -a : a;
    let otherRoot = randInt(-5, 5);
    while (otherRoot === sharedRoot || otherRoot === -sharedRoot) {
      otherRoot = randInt(-5, 5);
    }

    const p = -(sharedRoot + otherRoot);
    const q = sharedRoot * otherRoot;

    const pStr = p === 0 ? '' : (p > 0 ? `+ ${p}x` : `− ${Math.abs(p)}x`);
    const qStr = q > 0 ? `+ ${q}` : `− ${Math.abs(q)}`;

    const expr = `(x<sup>2</sup> − ${aSq})<sup>2</sup> + (x<sup>2</sup> ${pStr} ${qStr})<sup>2</sup> = 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const roots = [sharedRoot];

    const solutionSteps = [
      `Квадрат любого действительного числа неотрицателен: <strong>A<sup>2</sup> ≥ 0</strong> и <strong>B<sup>2</sup> ≥ 0</strong>.`,
      `Сумма двух неотрицательных чисел равна нулю тогда и только тогда, когда каждое из них одновременно равно нулю:<br>` +
      `<div class="system-bracket"><span class="system-brace">{</span><div class="system-equations">` +
      `<span>x<sup>2</sup> − ${aSq} = 0</span>` +
      `<span>x<sup>2</sup> ${pStr} ${qStr} = 0</span>` +
      `</div></div>`,
      `Из первого уравнения: <strong>x<sup>2</sup> = ${aSq} ⟹ x = ${a}</strong> или <strong>x = −${a}</strong>.`,
      `Корни второго уравнения: <strong>x = ${sharedRoot}</strong> и <strong>x = ${otherRoot}</strong>.`,
      `Обоим уравнениям одновременно удовлетворяет только общий корень: <strong>x = ${sharedRoot}</strong>.`
    ];

    return {
      id: 'eq_sumsq_' + Date.now() + '_' + Math.random(),
      type: 'equation',
      category: 'equations',
      catName: 'Сумма квадратов равна нулю',
      questionHtml,
      promptText: 'Решите уравнение. Запишите единственный общий корень:',
      inputPlaceholder: 'Пример: -5',
      quickSymbols: ['−'],
      answerData: { type: 'equation', roots },
      displayAnswer: String(sharedRoot),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Объясните, что сумма квадратов равна нулю только при одновременном равенстве нулю каждого слагаемого.',
      hint: 'Квадраты не могут быть отрицательными. Их сумма равна нулю тогда и только тогда, когда обе скобки равны нулю одновременно.'
    };
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ: РЕЖИМ «НЕРАВЕНСТВА» (Дробно-рациональные, метод интервалов)
     -------------------------------------------------------------------------- */

  // 2.1 Дробно-рациональное с отрицательным числом в числителе: -C / ((x - a)^2 - b^2) >= 0
  function genIneqFractionNegativeNum() {
    const a = randInt(1, 5);
    const b = randInt(1, 4);
    const c = randInt(6, 24);
    const bSq = b * b;

    // -c / ((x - a)^2 - b^2) >= 0
    // Так как числитель -c < 0, то дробь >= 0 <=> знаменатель < 0 (строго <, так как делить на 0 нельзя!)
    // (x - a)^2 - b^2 < 0 <=> (x - a - b)(x - a + b) < 0
    const left = a - b;
    const right = a + b;

    const expr = fracHtml(`−${c}`, `(x − ${a})<sup>2</sup> − ${bSq}`) + ` &ge; 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const correctParts = [{
      leftBracket: '(',
      leftVal: left,
      rightVal: right,
      rightBracket: ')'
    }];

    const displayAnswer = `(${left}; ${right})`;

    const solutionSteps = [
      `<strong>Шаг 1: Анализ знаков.</strong><br>` +
      `Числитель дроби равен <strong>−${c} &lt; 0</strong> (строго отрицательное число).`,
      `Дробь неотрицательна (<strong>≥ 0</strong>) тогда и только тогда, когда её знаменатель <em>строго отрицателен</em> (знаменатель не может равняться нулю):<br>` +
      `<strong>(x − ${a})<sup>2</sup> − ${bSq} &lt; 0</strong>.`,
      `<strong>Шаг 2: Разложение на множители.</strong><br>` +
      `Применим формулу разности квадратов:<br>` +
      `<strong>(x − ${a} − ${b})(x − ${a} + ${b}) &lt; 0 ⟹ (x − ${right})(x − ${left}) &lt; 0</strong>.`,
      `<strong>Шаг 3: Метод интервалов.</strong><br>` +
      `Нули знаменателя: <strong>x = ${left}</strong> и <strong>x = ${right}</strong> (выколотые точки).<br>` +
      `На числовой прямой расставляем знаки: «+», «−», «+». Нам нужен интервал со знаком «−»:<br>` +
      `<strong>x &isin; (${left}; ${right})</strong>.`
    ];

    return {
      id: 'ineq_fracneg_' + Date.now() + '_' + Math.random(),
      type: 'inequality',
      category: 'inequalities',
      catName: 'Дробное неравенство с отрицательным числителем',
      questionHtml,
      promptText: 'Решите неравенство. Запишите интервал в круглых или квадратных скобках:',
      inputPlaceholder: 'Пример: (1; 5)',
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '−∞', '+∞'],
      answerData: { type: 'inequality', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Скобки строго круглые! Равенство нулю невозможно, так как числитель никогда не равен нулю.',
      hint: 'Числитель отрицателен. Чтобы дробь была ≥ 0, знаменатель должен быть строго отрицательным (< 0).'
    };
  }

  // 2.2 Неравенство вида (x - a)^2 < k(x - a) или (x - a)^2 >= k(x - a)
  function genIneqQuadraticBrackets() {
    const a = randInt(1, 5);
    const k = randInt(2, 6);
    const isStrictLess = Math.random() > 0.5;

    let signHtml, opWord, correctParts, displayAnswer, signSteps;
    const right = a + k;

    if (isStrictLess) {
      signHtml = '&lt;';
      opWord = 'меньше нуля';
      correctParts = [{ leftBracket: '(', leftVal: a, rightVal: right, rightBracket: ')' }];
      displayAnswer = `(${a}; ${right})`;
      signSteps = `Выбираем интервал со знаком «минус»: <strong>x &isin; (${a}; ${right})</strong>.`;
    } else {
      signHtml = '&ge;';
      opWord = 'больше либо равно нулю';
      correctParts = [
        { leftBracket: '(', leftVal: -Infinity, rightVal: a, rightBracket: ']' },
        { leftBracket: '[', leftVal: right, rightVal: Infinity, rightBracket: ')' }
      ];
      displayAnswer = `(-∞; ${a}] ∪ [${right}; +∞)`;
      signSteps = `Выбираем интервалы со знаком «плюс» (включая концы): <strong>x &isin; (−&infin;; ${a}] &cup; [${right}; +&infin;)</strong>.`;
    }

    const expr = `(x − ${a})<sup>2</sup> ${signHtml} ${k}(x − ${a})`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const solutionSteps = [
      `<strong>Внимание: Нельзя делить на (x − ${a})!</strong> Мы не знаем его знак и можем потерять решения или изменить знак неравенства.`,
      `Перенесём все слагаемые в левую часть:<br>` +
      `<strong>(x − ${a})<sup>2</sup> − ${k}(x − ${a}) ${signHtml} 0</strong>.`,
      `Вынесем общий множитель <strong>(x − ${a})</strong> за скобки:<br>` +
      `<strong>(x − ${a})((x − ${a}) − ${k}) ${signHtml} 0 ⟹ (x − ${a})(x − ${right}) ${signHtml} 0</strong>.`,
      `Методом интервалов наносим корни <strong>x = ${a}</strong> и <strong>x = ${right}</strong> на числовую прямую.<br>` + signSteps
    ];

    return {
      id: 'ineq_quadbrk_' + Date.now() + '_' + Math.random(),
      type: 'inequality',
      category: 'inequalities',
      catName: 'Неравенство со скобками (вынесение множителя)',
      questionHtml,
      promptText: 'Решите неравенство. Запишите ответ в виде интервала или объединения интервалов:',
      inputPlaceholder: isStrictLess ? 'Пример: (2; 7)' : 'Пример: (-∞; 2] U [7; +∞)',
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '−∞', '+∞'],
      answerData: { type: 'inequality', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Деление на (x − a) сразу снижает оценку до 0 баллов! Только перенос и вынесение за скобки.',
      hint: 'Ни в коем случае не дели на скобку! Перенеси всё влево и вынеси (x − a) за скобки.'
    };
  }

  // 2.3 Дробно-рациональное методом интервалов: (x - a) / (x - b) <= 0
  function genIneqIntervalFraction() {
    let a = randInt(-5, 5);
    let b = randInt(-5, 5);
    while (a === b) b = randInt(-5, 5);

    // Пусть дробь <= 0
    // Нуль числителя: a (закрашенная точка, квадратная скобка)
    // Нуль знаменателя: b (выколотая точка, круглая скобка!)
    const minVal = Math.min(a, b);
    const maxVal = Math.max(a, b);

    const aIsMin = a < b;
    // Если a < b: [a; b)
    // Если a > b: (b; a]
    const leftBracket = aIsMin ? '[' : '(';
    const rightBracket = aIsMin ? ')' : ']';

    const numStr = a === 0 ? 'x' : (a > 0 ? `x − ${a}` : `x + ${Math.abs(a)}`);
    const denStr = b === 0 ? 'x' : (b > 0 ? `x − ${b}` : `x + ${Math.abs(b)}`);

    const expr = fracHtml(numStr, denStr) + ` &le; 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const correctParts = [{
      leftBracket,
      leftVal: minVal,
      rightVal: maxVal,
      rightBracket
    }];

    const displayAnswer = `${leftBracket}${minVal}; ${maxVal}${rightBracket}`;

    const solutionSteps = [
      `<strong>Шаг 1: Нули числителя и знаменателя.</strong><br>` +
      `• Числитель равен нулю: <strong>${numStr} = 0 ⟹ x = ${a}</strong> (точка входит в ответ, так как неравенство нестрогое <strong>≤ 0</strong>).<br>` +
      `• Знаменатель равен нулю: <strong>${denStr} = 0 ⟹ x = ${b}</strong> (точка <em>выколотая</em>, так как деление на 0 невозможно).`,
      `<strong>Шаг 2: Числовая прямая.</strong><br>` +
      `Отмечаем на прямой точки <strong>${minVal}</strong> и <strong>${maxVal}</strong>. Расставляем знаки методом интервалов: «+», «−», «+».`,
      `<strong>Шаг 3: Ответ.</strong><br>` +
      `Интервал со знаком «минус»: <strong>x &isin; ${displayAnswer}</strong>.`
    ];

    return {
      id: 'ineq_fraclin_' + Date.now() + '_' + Math.random(),
      type: 'inequality',
      category: 'inequalities',
      catName: 'Дробное неравенство методом интервалов',
      questionHtml,
      promptText: 'Решите неравенство. Обратите внимание на выколотую точку знаменателя:',
      inputPlaceholder: 'Пример: [-2; 4) или (-5; 3]',
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '−∞', '+∞'],
      answerData: { type: 'inequality', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Обязательно круглая скобка у точки знаменателя и квадратная у точки числителя!',
      hint: 'Нуль числителя входит в решение (квадратная скобка), а нуль знаменателя выколот (круглая скобка).'
    };
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ: РЕЖИМ «СИСТЕМЫ УРАВНЕНИЙ» (Нелинейные, симметричные)
     -------------------------------------------------------------------------- */

  // 3.1 Система методом сложения: 3x^2 + y = A, x^2 - y = B
  function genSystemAdditionSquares() {
    // 3x^2 + y = A
    // x^2 - y = B
    // Складываем: 4x^2 = A + B => x^2 = (A + B)/4
    const xVal = randInt(1, 4); // x = +- xVal
    const yVal = randInt(-6, 6);

    const xSq = xVal * xVal;
    const aVal = 3 * xSq + yVal;
    const bVal = xSq - yVal;

    const ySignA = formatSigned(yVal, false);

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <span>3x<sup>2</sup> + y = ${aVal}</span>
            <span>x<sup>2</sup> − y = ${bVal}</span>
          </div>
        </div>
      </div>
    `;

    const pairs = [
      [xVal, yVal],
      [-xVal, yVal]
    ];

    const displayAnswer = `(${xVal}; ${yVal}); (−${xVal}; ${yVal})`;

    const solutionSteps = [
      `Сложим оба уравнения системы почленно, чтобы исключить переменную <em>y</em>:<br>` +
      `<strong>(3x<sup>2</sup> + y) + (x<sup>2</sup> − y) = ${aVal} + ${bVal}</strong>.`,
      `Приводим подобные слагаемые:<br>` +
      `<strong>4x<sup>2</sup> = ${aVal + bVal} ⟹ x<sup>2</sup> = ${xSq} ⟹ x = ±${xVal}</strong>.`,
      `Подставим найденные значения <em>x<sup>2</sup> = ${xSq}</em> во второе уравнение системы:<br>` +
      `<strong>${xSq} − y = ${bVal} ⟹ y = ${xSq} − ${bVal} = ${yVal}</strong>.`,
      `Получаем две пары решений: <strong>(${xVal}; ${yVal})</strong> и <strong>(−${xVal}; ${yVal})</strong>.`
    ];

    return {
      id: 'sys_addsq_' + Date.now() + '_' + Math.random(),
      type: 'system',
      category: 'systems',
      catName: 'Система уравнений (метод сложения с x²)',
      questionHtml,
      promptText: 'Решите систему уравнений. Ответ запишите парами (x; y) через точку с запятой:',
      inputPlaceholder: 'Пример: (2; -2); (-2; -2)',
      quickSymbols: ['(', ')', ';', '−'],
      answerData: { type: 'system', pairs },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Решения записываются строго упорядоченными парами чисел (x; y).',
      hint: 'Сложи уравнения системы: +y и −y взаимно уничтожатся, останется простое уравнение для x².'
    };
  }

  // 3.2 Система «квадратное + линейное»: x^2 + y = A, x - y = B
  function genSystemQuadLinear() {
    // x^2 + y = A
    // x - y = B  => y = x - B
    // x^2 + x - B = A => x^2 + x - (A + B) = 0
    const x1 = randInt(1, 4);
    let x2 = randInt(-5, -1);
    // x^2 - (x1 + x2)x + x1*x2 = 0
    // Сделаем коэффициент при x равным 1 или -1
    // Пусть x1 - x2... Проще задать корни x1, x2:
    const sum = x1 + x2;
    const prod = x1 * x2;

    // x^2 - sum*x + prod = 0
    // Хотим: x^2 + k*x = A + B
    const k = randInt(1, 2);
    // x^2 + k*x - (A + B) = 0
    const r1 = randInt(2, 5);
    const r2 = r1 - k; // r1 - r2 = k => корни r1 и -r2: (x - r1)(x + r2) = x^2 + (r2 - r1)x - r1*r2
    // Корни: x = r1 и x = -r2
    const root1 = r1;
    const root2 = -r2;
    const sumC = r1 * r2; // A + B = sumC

    const bConst = randInt(1, 4);
    const aConst = sumC - bConst;

    // x - y = bConst => y = x - bConst
    // x^2 + y = aConst => x^2 + x - bConst = aConst => x^2 + x = aConst + bConst = sumC
    const y1 = root1 - bConst;
    const y2 = root2 - bConst;

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <span>x<sup>2</sup> + y = ${aConst}</span>
            <span>x − y = ${bConst}</span>
          </div>
        </div>
      </div>
    `;

    const pairs = [
      [root1, y1],
      [root2, y2]
    ];

    const displayAnswer = `(${root1}; ${y1}); (${root2}; ${y2})`;

    const solutionSteps = [
      `Сложим почленно оба уравнения системы, чтобы исключить переменную <em>y</em>:<br>` +
      `<strong>(x<sup>2</sup> + y) + (x − y) = ${aConst} + ${bConst}</strong>.`,
      `Получаем приведённое квадратное уравнение:<br>` +
      `<strong>x<sup>2</sup> + x = ${sumC} ⟹ x<sup>2</sup> + x − ${sumC} = 0</strong>.`,
      `По теореме Виета или через дискриминант находим значения <em>x</em>:<br>` +
      `<strong>x₁ = ${root1}</strong>, <strong>x₂ = ${root2}</strong>.`,
      `Из второго уравнения выражаем <em>y = x − ${bConst}</em> и находим соответствующие значения <em>y</em>:<br>` +
      `• При x₁ = ${root1}: <strong>y₁ = ${root1} − ${bConst} = ${y1}</strong> ⟹ пара <strong>(${root1}; ${y1})</strong><br>` +
      `• При x₂ = ${root2}: <strong>y₂ = ${root2} − ${bConst} = ${y2}</strong> ⟹ пара <strong>(${root2}; ${y2})</strong>.`
    ];

    return {
      id: 'sys_quadlin_' + Date.now() + '_' + Math.random(),
      type: 'system',
      category: 'systems',
      catName: 'Система «квадратное + линейное»',
      questionHtml,
      promptText: 'Решите систему уравнений. Запишите все пары (x; y) через точку с запятой:',
      inputPlaceholder: 'Пример: (3; 1); (-2; -4)',
      quickSymbols: ['(', ')', ';', '−'],
      answerData: { type: 'system', pairs },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Не перепутайте соответствие x и y в парах решений!',
      hint: 'Сложи уравнения, найди оба корня x, а затем для каждого x вычисли соответствующий y.'
    };
  }

  // 3.3 Симметричная система x^2 + y^2 = r^2, x + y = s
  function genSystemCircleLine() {
    // x, y из пифагоровых или красивых троек:
    const presets = [
      { rSq: 25, s: 7, pairs: [[3, 4], [4, 3]] },
      { rSq: 10, s: 4, pairs: [[1, 3], [3, 1]] },
      { rSq: 20, s: 6, pairs: [[2, 4], [4, 2]] },
      { rSq: 13, s: 5, pairs: [[2, 3], [3, 2]] },
      { rSq: 26, s: 6, pairs: [[1, 5], [5, 1]] }
    ];

    const item = pickRandom(presets);

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <span>x<sup>2</sup> + y<sup>2</sup> = ${item.rSq}</span>
            <span>x + y = ${item.s}</span>
          </div>
        </div>
      </div>
    `;

    const p1 = item.pairs[0];
    const p2 = item.pairs[1];
    const displayAnswer = `(${p1[0]}; ${p1[1]}); (${p2[0]}; ${p2[1]})`;

    const solutionSteps = [
      `Из второго уравнения выразим <em>y</em> через <em>x</em>:<br><strong>y = ${item.s} − x</strong>.`,
      `Подставим выражение в первое уравнение:<br>` +
      `<strong>x<sup>2</sup> + (${item.s} − x)<sup>2</sup> = ${item.rSq}</strong>.`,
      `Раскрываем скобки по формуле квадрата разности:<br>` +
      `<strong>x<sup>2</sup> + ${item.s * item.s} − ${2 * item.s}x + x<sup>2</sup> = ${item.rSq}</strong> ⟹ ` +
      `<strong>2x<sup>2</sup> − ${2 * item.s}x + ${item.s * item.s - item.rSq} = 0</strong>.`,
      `Разделим всё уравнение на 2:<br>` +
      `<strong>x<sup>2</sup> − ${item.s}x + ${(item.s * item.s - item.rSq) / 2} = 0</strong>.`,
      `Находим корни: <strong>x₁ = ${p1[0]}</strong>, <strong>x₂ = ${p2[0]}</strong>.`,
      `Вычисляем соответствующие значения <em>y</em>:<br>` +
      `• x₁ = ${p1[0]} ⟹ y₁ = ${item.s} − ${p1[0]} = ${p1[1]} ⟹ <strong>(${p1[0]}; ${p1[1]})</strong><br>` +
      `• x₂ = ${p2[0]} ⟹ y₂ = ${item.s} − ${p2[0]} = ${p2[1]} ⟹ <strong>(${p2[0]}; ${p2[1]})</strong>`
    ];

    return {
      id: 'sys_circle_' + Date.now() + '_' + Math.random(),
      type: 'system',
      category: 'systems',
      catName: 'Симметричная система уравнений',
      questionHtml,
      promptText: 'Решите систему уравнений. Запишите все пары (x; y) через точку с запятой:',
      inputPlaceholder: 'Пример: (3; 4); (4; 3)',
      quickSymbols: ['(', ')', ';', '−'],
      answerData: { type: 'system', pairs: item.pairs },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): При подстановке возводите двучлен в квадрат строго по формуле с удвоенным произведением.',
      hint: 'Вырази y = s − x из второго уравнения и подставь в первое, раскрыв квадрат двучлена.'
    };
  }

  // 3.4 Система с одинаковыми квадратами: (x + y)^2 = 2x, (x + y)^2 = 2y
  function genSystemEqualSquares() {
    const k = pickRandom([2, 3, 4, 5]);

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <span>(x + y)<sup>2</sup> = ${k}x</span>
            <span>(x + y)<sup>2</sup> = ${k}y</span>
          </div>
        </div>
      </div>
    `;

    // (x + y)^2 = k*x и (x + y)^2 = k*y => k*x = k*y => x = y
    // (2x)^2 = k*x => 4x^2 - k*x = 0 => x(4x - k) = 0 => x1 = 0, x2 = k/4
    const x2 = k / 4;
    const pairs = [
      [0, 0],
      [x2, x2]
    ];

    const displayAnswer = `(0; 0); (${formatNum(x2)}; ${formatNum(x2)})`;

    const solutionSteps = [
      `Левые части обоих уравнений равны, следовательно, равны и их правые части:<br>` +
      `<strong>${k}x = ${k}y ⟹ x = y</strong>.`,
      `Подставим <em>y = x</em> в первое уравнение системы:<br>` +
      `<strong>(x + x)<sup>2</sup> = ${k}x ⟹ (2x)<sup>2</sup> = ${k}x ⟹ 4x<sup>2</sup> = ${k}x</strong>.`,
      `Перенесём всё в левую часть и вынесем общий множитель:<br>` +
      `<strong>4x<sup>2</sup> − ${k}x = 0 ⟹ x(4x − ${k}) = 0</strong>.`,
      `Отсюда:<br>` +
      `1) <strong>x₁ = 0</strong> ⟹ <strong>y₁ = 0</strong> ⟹ пара <strong>(0; 0)</strong><br>` +
      `2) <strong>4x − ${k} = 0 ⟹ x₂ = ${formatNum(x2)}</strong> ⟹ <strong>y₂ = ${formatNum(x2)}</strong> ⟹ пара <strong>(${formatNum(x2)}; ${formatNum(x2)})</strong>.`
    ];

    return {
      id: 'sys_eqsq_' + Date.now() + '_' + Math.random(),
      type: 'system',
      category: 'systems',
      catName: 'Система с квадратом двучлена',
      questionHtml,
      promptText: 'Решите систему уравнений. Запишите пары (x; y) через точку с запятой:',
      inputPlaceholder: `Пример: (0; 0); (${formatNum(x2)}; ${formatNum(x2)})`,
      quickSymbols: ['(', ')', ';', '−'],
      answerData: { type: 'system', pairs },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Ни в коем случае не сокращайте на x! Выносите x за скобки, иначе потеряете корень (0; 0).',
      hint: 'Приравняй правые части: kx = ky, отсюда x = y. Затем подставь y = x в любое уравнение.'
    };
  }

  /* --------------------------------------------------------------------------
     ОСНОВНОЙ ГЕНЕРАТОР ЗАДАНИЙ (ПО РЕЖИМАМ / КАТЕГОРИЯМ)
     -------------------------------------------------------------------------- */
  function generateTask(category = 'mixed_all') {
    let task = null;
    switch (category) {
      case 'equations': {
        const gen = pickRandom([
          genBiquadraticSimple,
          genBiquadDiffSquares,
          genCubicGrouping,
          genSquareRootOdz,
          genSumOfSquaresZero
        ]);
        task = gen();
        break;
      }

      case 'inequalities': {
        const gen = pickRandom([
          genIneqFractionNegativeNum,
          genIneqQuadraticBrackets,
          genIneqIntervalFraction
        ]);
        task = gen();
        break;
      }

      case 'systems': {
        const gen = pickRandom([
          genSystemAdditionSquares,
          genSystemQuadLinear,
          genSystemCircleLine,
          genSystemEqualSquares
        ]);
        task = gen();
        break;
      }

      case 'mixed_all':
      default: {
        const all = [
          genBiquadraticSimple,
          genBiquadDiffSquares,
          genCubicGrouping,
          genSquareRootOdz,
          genSumOfSquaresZero,
          genIneqFractionNegativeNum,
          genIneqQuadraticBrackets,
          genIneqIntervalFraction,
          genSystemAdditionSquares,
          genSystemQuadLinear,
          genSystemCircleLine,
          genSystemEqualSquares
        ];
        task = pickRandom(all)();
        break;
      }
    }

    if (task) {
      if (!task.answer) task.answer = task.displayAnswer;
      if (!task.text) {
        task.text = task.questionHtml ? task.questionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
      }
    }
    return task;
  }

  /* --------------------------------------------------------------------------
     ПРОВЕРКА ОТВЕТОВ ПОЛЬЗОВАТЕЛЯ (УРАВНЕНИЯ, НЕРАВЕНСТВА, СИСТЕМЫ)
     -------------------------------------------------------------------------- */
  function checkAnswer(userRaw, task) {
    if (!userRaw || typeof userRaw !== 'string' || !task || !task.answerData) {
      return false;
    }

    const cleanInput = userRaw.trim();

    // 1. Проверка режима «УРАВНЕНИЕ»
    if (task.answerData.type === 'equation') {
      const roots = task.answerData.roots || [];
      const lower = cleanInput.toLowerCase();

      // Если корней нет
      if (roots.length === 0) {
        return ['нет', 'нет корней', 'нет решений', 'пусто', '0'].includes(lower);
      }

      // Извлекаем все числа (поддерживая знаки минус и запятые/точки)
      const matches = cleanInput.match(/[-−]?\d+(?:[.,]\d+)?/g);
      if (!matches) return false;

      const userNums = matches.map(normalizeNum).sort((a, b) => a - b);
      const correct = [...roots].sort((a, b) => a - b);

      if (userNums.length !== correct.length) return false;
      return userNums.every((val, i) => Math.abs(val - correct[i]) < 0.0001);
    }

    // 2. Проверка режима «НЕРАВЕНСТВО»
    if (task.answerData.type === 'inequality') {
      const correctParts = task.answerData.parts || [];

      // Извлекаем интервалы вида [a; b], (a; b), (-inf; a], [b; +inf)
      const intervalRegex = /([(\[])\s*([^;,]+)\s*[;,]\s*([^;,]+)\s*([)\]])/g;
      const userParts = [];
      let m;

      while ((m = intervalRegex.exec(cleanInput)) !== null) {
        const leftBracket = m[1];
        const rightBracket = m[4];
        const leftRaw = m[2].trim().toLowerCase().replace(/−/g, '-');
        const rightRaw = m[3].trim().toLowerCase().replace(/−/g, '-');

        const isLeftInf = leftRaw.includes('inf') || leftRaw.includes('беск') || leftRaw.includes('∞');
        const isRightInf = rightRaw.includes('inf') || rightRaw.includes('беск') || rightRaw.includes('∞');

        const leftVal = isLeftInf ? -Infinity : normalizeNum(leftRaw);
        const rightVal = isRightInf ? Infinity : normalizeNum(rightRaw);

        if (!isNaN(leftVal) && !isNaN(rightVal)) {
          userParts.push({ leftBracket, leftVal, rightVal, rightBracket });
        }
      }

      if (userParts.length !== correctParts.length) return false;

      // Сопоставляем каждый интервал
      const matched = new Set();
      for (const up of userParts) {
        let found = false;
        for (let i = 0; i < correctParts.length; i++) {
          if (!matched.has(i)) {
            const cp = correctParts[i];
            const leftOk = (up.leftVal === -Infinity && cp.leftVal === -Infinity) || Math.abs(up.leftVal - cp.leftVal) < 0.0001;
            const rightOk = (up.rightVal === Infinity && cp.rightVal === Infinity) || Math.abs(up.rightVal - cp.rightVal) < 0.0001;

            if (up.leftBracket === cp.leftBracket && up.rightBracket === cp.rightBracket && leftOk && rightOk) {
              matched.add(i);
              found = true;
              break;
            }
          }
        }
        if (!found) return false;
      }
      return matched.size === correctParts.length;
    }

    // 3. Проверка режима «СИСТЕМА УРАВНЕНИЙ»
    if (task.answerData.type === 'system') {
      const pairs = task.answerData.pairs || [];

      // Извлекаем пары (x; y) или (x, y)
      const pairRegex = /\(\s*([-−]?\d+(?:[.,]\d+)?)\s*[;,]\s*([-−]?\d+(?:[.,]\d+)?)\s*\)/g;
      const userPairs = [];
      let m;

      while ((m = pairRegex.exec(cleanInput)) !== null) {
        userPairs.push([normalizeNum(m[1]), normalizeNum(m[2])]);
      }

      // Запасной вариант: если пользователь ввёл числа без скобок, например "1; 2; -1; 2"
      if (userPairs.length === 0) {
        const rawNums = cleanInput.match(/[-−]?\d+(?:[.,]\d+)?/g);
        if (rawNums && rawNums.length === pairs.length * 2) {
          for (let i = 0; i < rawNums.length; i += 2) {
            userPairs.push([normalizeNum(rawNums[i]), normalizeNum(rawNums[i + 1])]);
          }
        }
      }

      if (userPairs.length !== pairs.length) return false;

      const matched = new Set();
      for (const up of userPairs) {
        let found = false;
        for (let i = 0; i < pairs.length; i++) {
          if (!matched.has(i)) {
            const cp = pairs[i];
            if (Math.abs(up[0] - cp[0]) < 0.0001 && Math.abs(up[1] - cp[1]) < 0.0001) {
              matched.add(i);
              found = true;
              break;
            }
          }
        }
        if (!found) return false;
      }
      return matched.size === pairs.length;
    }

    return false;
  }

  return {
    generateTask,
    checkAnswer,
    formatNum,
    fracHtml
  };
}));
