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
    if (str === null || str === undefined) return NaN;
    const clean = String(str).replace(/−/g, '-').replace(',', '.').trim();
    if (clean === '-inf' || clean === '-∞' || clean.includes('беск') && clean.startsWith('-')) return -Infinity;
    if (clean === 'inf' || clean === '+inf' || clean === '+∞' || clean === '∞') return Infinity;
    return parseFloat(clean);
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
      promptText: 'Решите биквадратное уравнение. Введите каждый найденный корень в своё окошко (порядок корней не важен):',
      inputPlaceholder: 'Пример: -3; 3',
      quickSymbols: ['−', ';', 'нет корней'],
      answerData: { type: 'equation', roots, expectedCount: roots.length },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): замену t = x² с указанием t ≥ 0 обязательно прописывать. Отбрасывание отрицательного t должно быть обосновано.',
      hint: 'Сделай замену t = x² (где t ≥ 0), реши квадратное уравнение относительно t, затем выполни обратную замену.'
    };
  }

  // 1.2 Биквадратное уравнение вида x^4 = (ax + b)^2 (разность квадратов, классика ФИПИ)
  function genBiquadDiffSquares() {
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
      promptText: 'Решите уравнение методом разности квадратов. Введите найденные корни в окошки:',
      inputPlaceholder: 'Пример: -5; 4',
      quickSymbols: ['−', ';', 'нет корней'],
      answerData: { type: 'equation', roots: item.roots, expectedCount: item.roots.length },
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
      promptText: 'Решите уравнение 3-й степени. Введите корни в поля ввода:',
      inputPlaceholder: 'Пример: -4; -3; 3',
      quickSymbols: ['−', ';'],
      answerData: { type: 'equation', roots: uniqueRoots, expectedCount: uniqueRoots.length },
      displayAnswer: uniqueRoots.join('; '),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Четко показать вынесение общего множителя (x + a) за скобки.',
      hint: 'Сгруппируй первые два слагаемых и вторые два, вынеси x² и число, затем вынеси общую скобку.'
    };
  }

  // 1.4 Уравнение с корнями и проверкой ОДЗ: x^2 - px + q + √(k - x) = √(k - x) + c
  function genSquareRootOdz() {
    const x1 = randInt(2, 6);
    const x2 = randInt(-6, -1);
    const p = x1 + x2;
    const prod = -(x1 * x2);

    const dropLargerRoot = Math.random() > 0.45;
    let k;
    let roots = [];

    if (dropLargerRoot) {
      k = x1 - randInt(1, 2);
      roots = [x2];
    } else {
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
      promptText: 'Решите уравнение. Не забудьте проверить ОДЗ! Введите корень или корни в поля ввода:',
      inputPlaceholder: 'Пример: -2; 5 или -2',
      quickSymbols: ['−', ';'],
      answerData: { type: 'equation', roots, expectedCount: roots.length },
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
      promptText: 'Решите уравнение. Запишите единственный общий корень в поле ввода:',
      inputPlaceholder: 'Пример: -5',
      quickSymbols: ['−'],
      answerData: { type: 'equation', roots, expectedCount: roots.length },
      displayAnswer: String(sharedRoot),
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Объясните, что сумма квадратов равна нулю только при одновременном равенстве нулю каждого слагаемого.',
      hint: 'Квадраты не могут быть отрицательными. Их сумма равна нулю тогда и только тогда, когда обе скобки равны нулю одновременно.'
    };
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ: РЕЖИМ «НЕРАВЕНСТВА» (4 СТРУКТУРНЫХ ТИПА ОТВЕТА)
     -------------------------------------------------------------------------- */

  // 2.1 Дробно-рациональное с отрицательным числителем: (Тип 1: числовой промежуток)
  function genIneqFractionNegativeNum() {
    const a = randInt(1, 5);
    const b = randInt(1, 4);
    const c = randInt(6, 24);
    const bSq = b * b;

    const left = a - b;
    const right = a + b;

    const expr = fracHtml(`−${c}`, `(x − ${a})<sup>2</sup> − ${bSq}`) + ` &ge; 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const correctParts = [{
      type: 'interval',
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
      promptText: 'Решите неравенство. Задайте числовой промежуток с помощью конструктора:',
      inputPlaceholder: 'Пример: (1; 5)',
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '−∞', '+∞'],
      answerData: { type: 'inequality', structure: 'single_interval', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Скобки строго круглые! Равенство нулю невозможно, так как числитель никогда не равен нулю.',
      hint: 'Числитель отрицателен. Чтобы дробь была ≥ 0, знаменатель должен быть строго отрицательным (< 0).'
    };
  }

  // 2.2 Неравенство со скобками: (Тип 1: промежуток или Тип 3: два промежутка)
  function genIneqQuadraticBrackets() {
    const a = randInt(1, 5);
    const k = randInt(2, 6);
    const isStrictLess = Math.random() > 0.5;

    let signHtml, opWord, correctParts, displayAnswer, signSteps, structure;
    const right = a + k;

    if (isStrictLess) {
      signHtml = '&lt;';
      opWord = 'меньше нуля';
      structure = 'single_interval';
      correctParts = [{ type: 'interval', leftBracket: '(', leftVal: a, rightVal: right, rightBracket: ')' }];
      displayAnswer = `(${a}; ${right})`;
      signSteps = `Выбираем интервал со знаком «минус»: <strong>x &isin; (${a}; ${right})</strong>.`;
    } else {
      signHtml = '&ge;';
      opWord = 'больше либо равно нулю';
      structure = 'two_intervals';
      correctParts = [
        { type: 'interval', leftBracket: '(', leftVal: -Infinity, rightVal: a, rightBracket: ']' },
        { type: 'interval', leftBracket: '[', leftVal: right, rightVal: Infinity, rightBracket: ')' }
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
      promptText: 'Решите неравенство. Задайте ответ в конструкторе промежутков:',
      inputPlaceholder: isStrictLess ? 'Пример: (2; 7)' : 'Пример: (-∞; 2] U [7; +∞)',
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '−∞', '+∞'],
      answerData: { type: 'inequality', structure, parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Деление на (x − a) сразу снижает оценку до 0 баллов! Только перенос и вынесение за скобки.',
      hint: 'Ни в коем случае не дели на скобку! Перенеси всё влево и вынеси (x − a) за скобки.'
    };
  }

  // 2.3 Дробно-рациональное методом интервалов: (Тип 1: числовой промежуток)
  function genIneqIntervalFraction() {
    let a = randInt(-5, 5);
    let b = randInt(-5, 5);
    while (a === b) b = randInt(-5, 5);

    const minVal = Math.min(a, b);
    const maxVal = Math.max(a, b);

    const aIsMin = a < b;
    const leftBracket = aIsMin ? '[' : '(';
    const rightBracket = aIsMin ? ')' : ']';

    const numStr = a === 0 ? 'x' : (a > 0 ? `x − ${a}` : `x + ${Math.abs(a)}`);
    const denStr = b === 0 ? 'x' : (b > 0 ? `x − ${b}` : `x + ${Math.abs(b)}`);

    const expr = fracHtml(numStr, denStr) + ` &le; 0`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const correctParts = [{
      type: 'interval',
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
      answerData: { type: 'inequality', structure: 'single_interval', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): Обязательно круглая скобка у точки знаменателя и квадратная у точки числителя!',
      hint: 'Нуль числителя входит в решение (квадратная скобка), а нуль знаменателя выколот (круглая скобка).'
    };
  }

  // 2.4 Неравенство: (Тип 2: числовой промежуток + точка)
  function genIneqIntervalWithPoint() {
    const subtype = pickRandom(['ray_point', 'interval_point']);
    if (subtype === 'ray_point') {
      const a = randInt(-4, 4);
      const c = a + randInt(2, 6);
      const aTerm = a === 0 ? 'x' : (a > 0 ? `x − ${a}` : `x + ${Math.abs(a)}`);
      const expr = fracHtml(`(x − ${c})<sup>2</sup>`, aTerm) + ` &le; 0`;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

      const correctParts = [
        { type: 'interval', leftBracket: '(', leftVal: -Infinity, rightVal: a, rightBracket: ')' },
        { type: 'point', val: c }
      ];
      const displayAnswer = `(−∞; ${a}) ∪ {${c}}`;

      const solutionSteps = [
        `<strong>Шаг 1: ОДЗ и свойства квадрата.</strong><br>` +
        `Знаменатель дроби не равен нулю: <strong>x &ne; ${a}</strong>.<br>` +
        `Числитель <strong>(x − ${c})<sup>2</sup> &ge; 0</strong> при любых <em>x</em>.`,
        `<strong>Шаг 2: Равенство нулю.</strong><br>` +
        `Дробь равна нулю, когда числитель равен нулю: <strong>(x − ${c})<sup>2</sup> = 0 ⟹ x = ${c}</strong>.<br>` +
        `При x = ${c} знаменатель ${c} − (${a}) &ne; 0, поэтому <strong>x = ${c}</strong> является изолированным решением неравенства.`,
        `<strong>Шаг 3: Знак дроби при остальных x.</strong><br>` +
        `При x &ne; ${c} числитель строго положителен. Дробь &le; 0 тогда и только тогда, когда знаменатель строго меньше нуля:<br>` +
        `<strong>${aTerm} &lt; 0 ⟹ x &lt; ${a} ⟹ x &isin; (−∞; ${a})</strong>.`,
        `<strong>Шаг 4: Объединение решений.</strong><br>` +
        `Объединяем луч и изолированную точку: <strong>x &isin; (−∞; ${a}) &cup; {${c}}</strong>.`
      ];

      return {
        id: 'ineq_pt_ray_' + Date.now() + '_' + Math.random(),
        type: 'inequality',
        category: 'inequalities',
        catName: 'Дробное неравенство (промежуток + точка)',
        questionHtml,
        promptText: 'Решите неравенство. Не забудьте изолированную точку, обращающую числитель в 0:',
        inputPlaceholder: `Пример: (-∞; ${a}) U {${c}}`,
        quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '{', '}', '−∞', '+∞'],
        answerData: { type: 'inequality', structure: 'interval_point', parts: correctParts },
        displayAnswer,
        solutionSteps,
        criteriaInfo: 'Критерии ФИПИ (2 балла): Не потеряйте изолированную точку {c}! Без неё оценка снижается до 0-1 балла.',
        hint: 'Квадрат в числителе неотрицателен. Точка c обращает дробь в ноль. При x != c знаменатель должен быть строго меньше нуля.'
      };
    } else {
      const b = randInt(2, 4);
      const bSq = b * b;
      const c = b + randInt(2, 5);
      const expr = `(x − ${c})<sup>2</sup>(x<sup>2</sup> − ${bSq}) &le; 0`;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

      const correctParts = [
        { type: 'interval', leftBracket: '[', leftVal: -b, rightVal: b, rightBracket: ']' },
        { type: 'point', val: c }
      ];
      const displayAnswer = `[−${b}; ${b}] ∪ {${c}}`;

      const solutionSteps = [
        `<strong>Шаг 1: Анализ множителей.</strong><br>` +
        `Множитель <strong>(x − ${c})<sup>2</sup> &ge; 0</strong> при всех <em>x</em>.`,
        `<strong>Шаг 2: Равенство нулю.</strong><br>` +
        `Произведение равно нулю при <strong>x = ${c}</strong>, <strong>x = −${b}</strong>, <strong>x = ${b}</strong>. Все три точки входят в ответ.`,
        `<strong>Шаг 3: Знак для остальных x.</strong><br>` +
        `При x &ne; ${c} первая скобка строго положительна, поэтому: <strong>x<sup>2</sup> − ${bSq} &le; 0 ⟹ x &isin; [−${b}; ${b}]</strong>.`,
        `<strong>Шаг 4: Итоговое объединение.</strong><br>` +
        `Поскольку <strong>${c} &gt; ${b}</strong>, точка ${c} лежит вне отрезка: <strong>x &isin; [−${b}; ${b}] &cup; {${c}}</strong>.`
      ];

      return {
        id: 'ineq_pt_seg_' + Date.now() + '_' + Math.random(),
        type: 'inequality',
        category: 'inequalities',
        catName: 'Неравенство со скобками (отрезок + точка)',
        questionHtml,
        promptText: 'Решите неравенство методом интервалов:',
        inputPlaceholder: `Пример: [-${b}; ${b}] U {${c}}`,
        quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '{', '}', '−∞', '+∞'],
        answerData: { type: 'inequality', structure: 'interval_point', parts: correctParts },
        displayAnswer,
        solutionSteps,
        criteriaInfo: 'Критерии ФИПИ (2 балла): Отрезок [-b; b] плюс изолированная точка {c}. Обратите внимание на квадратные скобки отрезка и фигурные скобки точки.',
        hint: 'Произведение равно нулю при x = c и x = +-b. Не забудь объединить отрезок [-b; b] с точкой {c}.'
      };
    }
  }

  // 2.5 Неравенство: (Тип 4: числовой промежуток + точка + числовой промежуток)
  function genIneqTwoIntervalsWithPoint() {
    const a = randInt(-5, -1);
    const b = randInt(2, 6);
    const c = randInt(a + 1, b - 1);

    const aTerm = a === 0 ? 'x' : (a > 0 ? `x − ${a}` : `x + ${Math.abs(a)}`);
    const bTerm = b === 0 ? 'x' : (b > 0 ? `x − ${b}` : `x + ${Math.abs(b)}`);
    const cTerm = c === 0 ? 'x' : (c > 0 ? `x − ${c}` : `x + ${Math.abs(c)}`);

    const isFraction = Math.random() > 0.5;
    let expr, leftBracketA, rightBracketB, displayAnswer, correctParts;

    if (isFraction) {
      expr = fracHtml(`(${cTerm})<sup>2</sup>`, `(${aTerm})(${bTerm})`) + ` &ge; 0`;
      leftBracketA = ')';
      rightBracketB = '(';
      correctParts = [
        { type: 'interval', leftBracket: '(', leftVal: -Infinity, rightVal: a, rightBracket: ')' },
        { type: 'point', val: c },
        { type: 'interval', leftBracket: '(', leftVal: b, rightVal: Infinity, rightBracket: ')' }
      ];
      displayAnswer = `(−∞; ${a}) ∪ {${c}} ∪ (${b}; +∞)`;
    } else {
      expr = `(${cTerm})<sup>2</sup>(${aTerm})(${bTerm}) &ge; 0`;
      leftBracketA = ']';
      rightBracketB = '[';
      correctParts = [
        { type: 'interval', leftBracket: '(', leftVal: -Infinity, rightVal: a, rightBracket: ']' },
        { type: 'point', val: c },
        { type: 'interval', leftBracket: '[', leftVal: b, rightVal: Infinity, rightBracket: ')' }
      ];
      displayAnswer = `(−∞; ${a}] ∪ {${c}} ∪ [${b}; +∞)`;
    }

    const questionHtml = `<div class="math-expr"><span class="expr-line">${expr}</span></div>`;

    const solutionSteps = [
      `<strong>Шаг 1: Нули числителя/множителей.</strong><br>` +
      `Выражение обращается в 0 при <strong>x = ${c}</strong>` + (isFraction ? ` (нули знаменателя x = ${a} и x = ${b} выколоты).` : `, а также при x = ${a} и x = ${b}.`),
      `Точка <strong>x = ${c}</strong> удовлетворяет нестрогому неравенству <strong>≥ 0</strong> и входит в решение.`,
      `<strong>Шаг 2: Метод интервалов.</strong><br>` +
      `Множитель <em>(${cTerm})<sup>2</sup> &ge; 0</em> при переходе через точку <em>x = ${c}</em> <strong>знак не меняет</strong> (корень чётной кратности!).<br>` +
      `Знаки: на <em>(−∞; ${a})</em> знак «+», на <em>(${a}; ${b})</em> знак «−» (с нулём в точке ${c}), на <em>(${b}; +∞)</em> знак «+».`,
      `<strong>Шаг 3: Запись ответа.</strong><br>` +
      `Неравенству удовлетворяют два луча и изолированная точка строго между ними:<br>` +
      `<strong>x &isin; ${displayAnswer}</strong>.`
    ];

    return {
      id: 'ineq_2int_pt_' + Date.now() + '_' + Math.random(),
      type: 'inequality',
      category: 'inequalities',
      catName: 'Неравенство (два промежутка + точка)',
      questionHtml,
      promptText: 'Решите неравенство. Обратите внимание на корень чётной кратности между лучами:',
      inputPlaceholder: `Пример: (-∞; ${a}${leftBracketA} U {${c}} U ${rightBracketB}${b}; +∞)`,
      quickSymbols: ['(', ')', '[', ']', ';', '−', '∪', '{', '}', '−∞', '+∞'],
      answerData: { type: 'inequality', structure: 'interval_point_interval', parts: correctParts },
      displayAnswer,
      solutionSteps,
      criteriaInfo: 'Критерии ФИПИ (2 балла): При корне чётной кратности знак не меняется, но сама точка входит в решение при знаке ≥ 0.',
      hint: 'При переходе через корень чётной кратности знак не меняется. Точка c лежит между лучами и входит в решение.'
    };
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ: РЕЖИМ «СИСТЕМЫ УРАВНЕНИЙ» (Нелинейные, симметричные)
     -------------------------------------------------------------------------- */

  // 3.1 Система методом сложения: 3x^2 + y = A, x^2 - y = B
  function genSystemAdditionSquares() {
    const xVal = randInt(1, 4);
    const yVal = randInt(-6, 6);

    const xSq = xVal * xVal;
    const aVal = 3 * xSq + yVal;
    const bVal = xSq - yVal;

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
      promptText: 'Решите систему уравнений. Заполните пары решений (x; y) в полях ввода (порядок пар не важен):',
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
    const k = randInt(1, 2);
    const r1 = randInt(2, 5);
    const r2 = r1 - k;

    const root1 = r1;
    const root2 = -r2;
    const sumC = r1 * r2;

    const bConst = randInt(1, 4);
    const aConst = sumC - bConst;

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
      promptText: 'Решите систему уравнений. Заполните пары решений (x; y):',
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
      promptText: 'Решите систему уравнений. Заполните пары (x; y):',
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
      promptText: 'Решите систему уравнений. Заполните пары (x; y):',
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
          genIneqIntervalFraction,
          genIneqIntervalWithPoint,
          genIneqTwoIntervalsWithPoint
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
          genIneqIntervalWithPoint,
          genIneqTwoIntervalsWithPoint,
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
    if (!task || !task.answerData) {
      return false;
    }

    const taskType = task.answerData.type || task.type;

    // 1. Проверка режима «УРАВНЕНИЕ»
    if (taskType === 'equation') {
      const correctRoots = (task.answerData.roots || []).map(r => normalizeNum(r)).sort((a, b) => a - b);

      // Если передана структура
      if (typeof userRaw === 'object' && userRaw !== null && Array.isArray(userRaw.roots)) {
        if (correctRoots.length === 0) {
          return userRaw.noRoots === true || userRaw.roots.length === 0;
        }
        const userNums = userRaw.roots.map(normalizeNum).filter(n => !isNaN(n)).sort((a, b) => a - b);
        if (userNums.length !== correctRoots.length) return false;
        return userNums.every((val, i) => Math.abs(val - correctRoots[i]) < 0.0001);
      }

      // Если передана строка
      const cleanInput = String(userRaw || '').trim();
      const lower = cleanInput.toLowerCase();

      if (correctRoots.length === 0) {
        return ['нет', 'нет корней', 'нет решений', 'пусто', '0', '∅'].includes(lower);
      }

      const matches = cleanInput.match(/[-−]?\d+(?:[.,]\d+)?/g);
      if (!matches) return false;

      const userNums = matches.map(normalizeNum).sort((a, b) => a - b);
      if (userNums.length !== correctRoots.length) return false;
      return userNums.every((val, i) => Math.abs(val - correctRoots[i]) < 0.0001);
    }

    // 2. Проверка режима «НЕРАВЕНСТВО»
    if (taskType === 'inequality') {
      const correctParts = (task.answerData.parts || []).map(p => {
        if (p.type === 'point' || p.val !== undefined) {
          return { type: 'point', val: normalizeNum(p.val) };
        }
        return {
          type: 'interval',
          leftBracket: p.leftBracket || '(',
          leftVal: p.leftVal === -Infinity ? -Infinity : normalizeNum(p.leftVal),
          rightVal: p.rightVal === Infinity ? Infinity : normalizeNum(p.rightVal),
          rightBracket: p.rightBracket || ')'
        };
      });

      let userParts = [];

      if (typeof userRaw === 'object' && userRaw !== null && Array.isArray(userRaw.parts)) {
        userParts = userRaw.parts.map(p => {
          if (p.type === 'point' || p.val !== undefined) {
            return { type: 'point', val: normalizeNum(p.val) };
          }
          return {
            type: 'interval',
            leftBracket: p.leftBracket || '(',
            leftVal: p.leftVal === -Infinity ? -Infinity : normalizeNum(p.leftVal),
            rightVal: p.rightVal === Infinity ? Infinity : normalizeNum(p.rightVal),
            rightBracket: p.rightBracket || ')'
          };
        }).filter(p => p.type === 'point' ? !isNaN(p.val) : (!isNaN(p.leftVal) && !isNaN(p.rightVal)));
      } else {
        const cleanInput = String(userRaw || '').trim();
        const lower = cleanInput.toLowerCase();

        if (correctParts.length === 0) {
          return ['нет', 'нет решений', 'пусто', '∅'].includes(lower);
        }

        // Извлекаем интервалы вида [a; b], (a; b), (-inf; a], [b; +inf)
        const intervalRegex = /([(\[])\s*([^;,]+)\s*[;,]\s*([^;,]+)\s*([)\]])/g;
        let m;
        let cleanWithoutIntervals = cleanInput;

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
            userParts.push({ type: 'interval', leftBracket, leftVal, rightVal, rightBracket });
          }
        }

        // Удаляем совпавшие интервалы из строки для поиска изолированных точек {c} или x = c
        cleanWithoutIntervals = cleanInput.replace(intervalRegex, ' ');

        // Изолированные точки в фигурных скобках {c}
        const pointBraceRegex = /\{\s*([-−]?\d+(?:[.,]\d+)?)\s*\}/g;
        let pm;
        while ((pm = pointBraceRegex.exec(cleanInput)) !== null) {
          const val = normalizeNum(pm[1]);
          if (!isNaN(val)) {
            userParts.push({ type: 'point', val });
          }
        }

        // Если фигурных скобок не было, но остались числа (например "и 5", "; 5")
        if (!userParts.some(p => p.type === 'point')) {
          const remainingPointRegex = /(?:^|[\s;∪Uи{]|точка\s*)\s*([-−]?\d+(?:[.,]\d+)?)(?:\s*\}|\s*$|\s*[;∪U])/gi;
          let rm;
          while ((rm = remainingPointRegex.exec(cleanWithoutIntervals)) !== null) {
            const val = normalizeNum(rm[1]);
            if (!isNaN(val)) {
              userParts.push({ type: 'point', val });
            }
          }
        }
      }

      if (userParts.length !== correctParts.length) return false;

      // Независимое сопоставление элементов объединения (порядок в объединении не важен)
      const matched = new Set();
      for (const up of userParts) {
        let found = false;
        for (let i = 0; i < correctParts.length; i++) {
          if (!matched.has(i)) {
            const cp = correctParts[i];
            if (up.type === cp.type) {
              if (up.type === 'point') {
                if (Math.abs(up.val - cp.val) < 0.0001) {
                  matched.add(i);
                  found = true;
                  break;
                }
              } else {
                const leftOk = (up.leftVal === -Infinity && cp.leftVal === -Infinity) || Math.abs(up.leftVal - cp.leftVal) < 0.0001;
                const rightOk = (up.rightVal === Infinity && cp.rightVal === Infinity) || Math.abs(up.rightVal - cp.rightVal) < 0.0001;
                if (up.leftBracket === cp.leftBracket && up.rightBracket === cp.rightBracket && leftOk && rightOk) {
                  matched.add(i);
                  found = true;
                  break;
                }
              }
            }
          }
        }
        if (!found) return false;
      }
      return matched.size === correctParts.length;
    }

    // 3. Проверка режима «СИСТЕМА УРАВНЕНИЙ»
    if (taskType === 'system') {
      const correctPairs = (task.answerData.pairs || []).map(p => [normalizeNum(p[0]), normalizeNum(p[1])]);
      let userPairs = [];

      if (typeof userRaw === 'object' && userRaw !== null && Array.isArray(userRaw.pairs)) {
        userPairs = userRaw.pairs
          .map(p => [normalizeNum(p[0]), normalizeNum(p[1])])
          .filter(p => !isNaN(p[0]) && !isNaN(p[1]));
      } else {
        const cleanInput = String(userRaw || '').trim();

        // Пары в скобках (x; y) или (x, y)
        const pairRegex = /\(\s*([-−]?\d+(?:[.,]\d+)?)\s*[;,]\s*([-−]?\d+(?:[.,]\d+)?)\s*\)/g;
        let m;
        while ((m = pairRegex.exec(cleanInput)) !== null) {
          userPairs.push([normalizeNum(m[1]), normalizeNum(m[2])]);
        }

        // Если введены числа подряд без скобок
        if (userPairs.length === 0) {
          const rawNums = cleanInput.match(/[-−]?\d+(?:[.,]\d+)?/g);
          if (rawNums && rawNums.length === correctPairs.length * 2) {
            for (let i = 0; i < rawNums.length; i += 2) {
              userPairs.push([normalizeNum(rawNums[i]), normalizeNum(rawNums[i + 1])]);
            }
          }
        }
      }

      if (userPairs.length !== correctPairs.length) return false;

      // Проверка совпадения пар в любом порядке
      const matched = new Set();
      for (const up of userPairs) {
        let found = false;
        for (let i = 0; i < correctPairs.length; i++) {
          if (!matched.has(i)) {
            const cp = correctPairs[i];
            if (Math.abs(up[0] - cp[0]) < 0.0001 && Math.abs(up[1] - cp[1]) < 0.0001) {
              matched.add(i);
              found = true;
              break;
            }
          }
        }
        if (!found) return false;
      }
      return matched.size === correctPairs.length;
    }

    return false;
  }

  /* --------------------------------------------------------------------------
     ВСТРАИВАЕМЫЕ CSS-СТИЛИ ДЛЯ ВИДЖЕТОВ ВВОДА ЗАДАНИЯ №20
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     ВСТРАИВАЕМЫЕ CSS-СТИЛИ ДЛЯ ВИДЖЕТОВ ВВОДА ЗАДАНИЯ №20
     Дизайн строго следует эстетике японской бумаги (Japanese Paper / Wabi-Sabi):
     --paper: #f5f2eb, --ink: #202a3a, --indigo: #263f61, --vermilion: #b7464e.
     Для тёмной темы в домашних заданиях стили изолированы под .task20-hw-answer-box.
     -------------------------------------------------------------------------- */
  function ensureWidgetStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('task20-widget-styles')) return;

    const style = document.createElement('style');
    style.id = 'task20-widget-styles';
    style.textContent = `
      .task20-widget-root {
        display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 680px; margin: 0 auto;
        font-family: 'DM Sans', -apple-system, sans-serif;
        color: var(--task20-ink, #202a3a);
      }
      .task20-template-pills {
        display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 2px;
      }
      .task20-tpl-btn {
        background: var(--task20-btn-bg, #fbf9f4);
        border: 1px solid var(--task20-border, rgba(38,63,97,.18));
        border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 700;
        color: var(--task20-ink, #202a3a); cursor: pointer; transition: all .15s ease;
        user-select: none;
      }
      .task20-tpl-btn:hover {
        background: rgba(38,63,97,.1); color: var(--task20-indigo, #263f61);
        border-color: var(--task20-indigo, #263f61); transform: translateY(-1px);
      }
      .task20-tpl-btn.active {
        background: var(--task20-indigo, #263f61); color: #ffffff !important;
        border-color: var(--task20-indigo, #263f61); box-shadow: 0 2px 8px rgba(38,63,97,.25);
      }

      /* Сетка корней уравнений */
      .task20-roots-grid {
        display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; width: 100%;
      }
      .task20-root-item {
        display: inline-flex; align-items: center; gap: 8px;
        background: var(--task20-card-bg, #ffffff);
        border: 1.5px solid var(--task20-border, rgba(38,63,97,.18)); border-radius: 12px;
        padding: 6px 14px; box-shadow: 0 2px 6px rgba(38,63,97,.04); transition: border-color .2s;
      }
      .task20-root-item:focus-within {
        border-color: var(--task20-indigo, #263f61); box-shadow: 0 0 0 3px rgba(38,63,97,.12);
      }
      .task20-root-label {
        font-weight: 700; font-size: 15px; color: var(--task20-indigo, #263f61); user-select: none;
      }
      .task20-root-input {
        width: 100px; height: 38px; border: 1px solid var(--task20-border, rgba(38,63,97,.18));
        border-radius: 8px; background: var(--task20-input-bg, #ffffff);
        font-family: 'DM Sans', monospace; font-size: 18px; font-weight: 700;
        text-align: center; color: var(--task20-ink, #202a3a); outline: none;
        transition: border-color .15s ease;
      }
      .task20-root-input:focus {
        border-color: var(--task20-indigo, #263f61);
      }

      /* Конструктор неравенств */
      .task20-ineq-blocks {
        display: flex; flex-direction: column; gap: 10px; align-items: center; width: 100%;
      }
      .task20-ineq-row {
        display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; width: 100%;
      }
      .task20-union-sign {
        font-size: 22px; font-weight: 900; color: var(--task20-vermilion, #b7464e);
        user-select: none; line-height: 1; padding: 0 4px;
      }
      .task20-interval-card {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--task20-card-bg, #ffffff);
        border: 1.5px solid var(--task20-border, rgba(38,63,97,.18)); border-radius: 12px;
        padding: 6px 10px; box-shadow: 0 2px 8px rgba(38,63,97,.04); transition: border-color .2s;
      }
      .task20-interval-card:focus-within {
        border-color: var(--task20-indigo, #263f61); box-shadow: 0 0 0 3px rgba(38,63,97,.1);
      }
      .task20-bracket-btn {
        background: var(--task20-btn-bg, #fbf9f4);
        border: 1px solid var(--task20-border, rgba(38,63,97,.2));
        color: var(--task20-indigo, #263f61); font-weight: 800; font-size: 17px; width: 34px; height: 38px;
        border-radius: 8px; cursor: pointer; transition: all .15s ease; display: grid; place-items: center;
        user-select: none;
      }
      .task20-bracket-btn:hover {
        background: var(--task20-indigo, #263f61); color: #ffffff;
        border-color: var(--task20-indigo, #263f61);
      }
      .task20-bound-box {
        display: inline-flex; align-items: center; position: relative;
      }
      .task20-bound-input {
        width: 82px; height: 38px; border: 1px solid var(--task20-border, rgba(38,63,97,.18));
        border-radius: 8px; background: var(--task20-input-bg, #ffffff); text-align: center;
        font-family: 'DM Sans', monospace; font-size: 16px; font-weight: 700;
        color: var(--task20-ink, #202a3a); outline: none; transition: border-color .15s ease;
      }
      .task20-bound-input:focus {
        border-color: var(--task20-indigo, #263f61);
      }
      .task20-inf-quick-btn {
        position: absolute; right: 3px; top: 3px; bottom: 3px;
        background: rgba(38,63,97,.08); border: none; border-radius: 6px;
        font-size: 11px; font-weight: 800; padding: 0 5px; color: var(--task20-indigo, #263f61);
        cursor: pointer; opacity: 0.88; transition: all .15s; user-select: none;
      }
      .task20-inf-quick-btn:hover {
        opacity: 1; background: var(--task20-indigo, #263f61); color: #ffffff;
      }

      .task20-sep { font-weight: 800; font-size: 16px; color: var(--task20-muted, #697383); padding: 0 2px; }

      /* Точка в фигурных скобках {c} */
      .task20-point-card {
        display: inline-flex; align-items: center; gap: 4px;
        background: var(--task20-card-bg, #ffffff);
        border: 1.5px solid var(--task20-border, rgba(38,63,97,.18)); border-radius: 12px;
        padding: 6px 12px; box-shadow: 0 2px 8px rgba(38,63,97,.04); transition: border-color .2s;
      }
      .task20-point-card:focus-within {
        border-color: var(--task20-indigo, #263f61); box-shadow: 0 0 0 3px rgba(38,63,97,.1);
      }
      .task20-brace-sign { font-size: 20px; font-weight: 700; color: var(--task20-indigo, #263f61); user-select: none; }
      .task20-point-input {
        width: 75px; height: 38px; border: 1px solid var(--task20-border, rgba(38,63,97,.18));
        border-radius: 8px; background: var(--task20-input-bg, #ffffff); text-align: center;
        font-family: 'DM Sans', monospace; font-size: 16px; font-weight: 700;
        color: var(--task20-ink, #202a3a); outline: none; transition: border-color .15s ease;
      }
      .task20-point-input:focus { border-color: var(--task20-indigo, #263f61); }

      .task20-del-btn {
        width: 26px; height: 26px; border-radius: 999px; border: 1px solid rgba(183,70,78,.3);
        background: rgba(183,70,78,.08); color: var(--task20-vermilion, #b7464e); font-size: 12px; font-weight: 800;
        cursor: pointer; display: grid; place-items: center; margin-left: 4px; transition: all .15s;
      }
      .task20-del-btn:hover { background: var(--task20-vermilion, #b7464e); color: #ffffff; }

      /* Системы уравнений: пары решений */
      .task20-system-grid {
        display: flex; flex-direction: column; gap: 10px; width: 100%; align-items: center;
      }
      .task20-pair-card {
        display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
        background: var(--task20-card-bg, #ffffff);
        border: 1.5px solid var(--task20-border, rgba(38,63,97,.18)); border-radius: 12px;
        padding: 8px 16px; box-shadow: 0 2px 8px rgba(38,63,97,.04); transition: border-color .2s;
      }
      .task20-pair-card:focus-within {
        border-color: var(--task20-indigo, #263f61); box-shadow: 0 0 0 3px rgba(38,63,97,.1);
      }
      .task20-pair-num { font-size: 13px; font-weight: 700; color: var(--task20-muted, #697383); user-select: none; }
      .task20-pair-field { display: inline-flex; align-items: center; gap: 4px; }
      .task20-pair-coord-lbl { font-weight: 700; color: var(--task20-indigo, #263f61); font-size: 15px; user-select: none; }
      .task20-coord-input {
        width: 80px; height: 38px; border: 1px solid var(--task20-border, rgba(38,63,97,.18));
        border-radius: 8px; text-align: center; font-family: 'DM Sans', monospace;
        font-size: 17px; font-weight: 700; color: var(--task20-ink, #202a3a);
        background: var(--task20-input-bg, #ffffff); outline: none; transition: border-color .15s ease;
      }
      .task20-coord-input:focus { border-color: var(--task20-indigo, #263f61); }

      /* Панель кнопок быстрых действий */
      .task20-actions-bar {
        display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; align-items: center; margin-top: 2px;
      }
      .task20-act-btn {
        background: var(--task20-btn-bg, #fbf9f4);
        border: 1px solid var(--task20-border, rgba(38,63,97,.2));
        border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700;
        color: var(--task20-indigo, #263f61); cursor: pointer; transition: all .15s ease;
        display: inline-flex; align-items: center; gap: 6px; user-select: none;
      }
      .task20-act-btn:hover {
        background: #ffffff; border-color: var(--task20-indigo, #263f61);
        color: #19273c; transform: translateY(-1px); box-shadow: 0 2px 6px rgba(38,63,97,.1);
      }
      .task20-act-btn.active {
        background: var(--task20-vermilion, #b7464e); color: #ffffff !important;
        border-color: var(--task20-vermilion, #b7464e); box-shadow: 0 2px 6px rgba(183,70,78,.3);
      }

      /* Живой предпросмотр ответа */
      .task20-preview-box {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: var(--task20-preview-bg, #fbf9f4);
        border: 1px dashed var(--task20-border, rgba(38,63,97,.25));
        border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 600;
        color: var(--task20-muted, #697383);
      }
      .task20-preview-val {
        font-family: 'DM Sans', monospace; font-size: 15px; font-weight: 700;
        color: var(--task20-ink, #202a3a);
      }

      /* =========================================================================
         СПЕЦИФИЧЕСКИЕ ПЕРЕОПРЕДЕЛЕНИЯ ДЛЯ ТЁМНОЙ ТЕМЫ В ДОМАШНИХ РАБОТАХ
         Изолированы под .task20-hw-answer-box, чтобы не затрагивать тренажёр
         ========================================================================= */
      [data-theme="dark"] .task20-hw-answer-box {
        --task20-card-bg: #151b2b;
        --task20-btn-bg: rgba(255, 255, 255, 0.06);
        --task20-input-bg: #101522;
        --task20-border: rgba(255, 255, 255, 0.14);
        --task20-ink: #f8fafc;
        --task20-muted: #b0bfd4;
        --task20-indigo: #2ce6d6;
        --task20-vermilion: #ff7728;
        --task20-preview-bg: rgba(255, 255, 255, 0.03);
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-tpl-btn:hover {
        background: rgba(255, 255, 255, 0.12); color: #fff;
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-tpl-btn.active {
        background: #ff7728; border-color: #ff7728; color: #fff !important;
        box-shadow: 0 2px 8px rgba(255, 119, 40, 0.3);
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-bracket-btn:hover {
        background: #ff7728; color: #fff; border-color: #ff7728;
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-bound-input:focus,
      [data-theme="dark"] .task20-hw-answer-box .task20-point-input:focus,
      [data-theme="dark"] .task20-hw-answer-box .task20-coord-input:focus,
      [data-theme="dark"] .task20-hw-answer-box .task20-root-input:focus {
        border-color: #ff7728;
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-interval-card:focus-within,
      [data-theme="dark"] .task20-hw-answer-box .task20-point-card:focus-within,
      [data-theme="dark"] .task20-hw-answer-box .task20-pair-card:focus-within,
      [data-theme="dark"] .task20-hw-answer-box .task20-root-item:focus-within {
        border-color: #ff7728; box-shadow: 0 0 0 3px rgba(255, 119, 40, 0.2);
      }
      [data-theme="dark"] .task20-hw-answer-box .task20-act-btn:hover {
        background: #1c2230; border-color: #ff7728; color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  /* --------------------------------------------------------------------------
     УНИВЕРСАЛЬНЫЙ КОНСТРУКТОР ВИДЖЕТА ВВОДА ОТВЕТА (ДЛЯ ТРЕНАЖЁРА И ДОМАШНИХ РАБОТ)
     -------------------------------------------------------------------------- */
  function createInputWidget(options) {
    ensureWidgetStyles();
    const { container, task, initialValue, onChange, onEnter, readonly } = options;
    if (!container || !task) return null;

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'task20-widget-root';
    container.appendChild(wrapper);

    const taskType = task.type || (task.category === 'equations' ? 'equation' : (task.category === 'inequalities' ? 'inequality' : (task.category === 'systems' ? 'system' : 'equation')));

    // =========================================================================
    // 1. ВИДЖЕТ УРАВНЕНИЙ
    // =========================================================================
    if (taskType === 'equation') {
      let isNoRoots = false;
      let rootsList = [];

      // Парсинг начального значения
      if (initialValue && typeof initialValue === 'string') {
        const clean = initialValue.trim().toLowerCase();
        if (clean.includes('нет') || clean === '∅') {
          isNoRoots = true;
        } else {
          const nums = initialValue.match(/[-−]?\d+(?:[.,]\d+)?/g);
          if (nums && nums.length > 0) {
            rootsList = nums.map(n => n.replace('.', ','));
          }
        }
      }

      // Если начальное значение не задано, берём количество из метаданных задачи (обычно 1 или 2-3)
      if (!isNoRoots && rootsList.length === 0) {
        const expectedCount = (task.answerData && Array.isArray(task.answerData.roots)) 
          ? Math.max(1, task.answerData.roots.length) 
          : 1;
        for (let i = 0; i < expectedCount; i++) rootsList.push('');
      }

      const grid = document.createElement('div');
      grid.className = 'task20-roots-grid';

      const actionsBar = document.createElement('div');
      actionsBar.className = 'task20-actions-bar';

      const previewBox = document.createElement('div');
      previewBox.className = 'task20-preview-box';
      const previewLabel = document.createElement('span');
      previewLabel.textContent = 'Ваш ответ:';
      const previewValEl = document.createElement('strong');
      previewValEl.className = 'task20-preview-val';
      previewValEl.textContent = '—';
      previewBox.appendChild(previewLabel);
      previewBox.appendChild(previewValEl);

      function renderRoots() {
        grid.innerHTML = '';
        if (isNoRoots) {
          const emptyNotice = document.createElement('div');
          emptyNotice.style.padding = '8px 16px';
          emptyNotice.style.fontWeight = '700';
          emptyNotice.style.color = '#b7464e';
          emptyNotice.textContent = 'Выбран ответ: Действительных корней нет (∅)';
          grid.appendChild(emptyNotice);
          btnNoRoots.classList.add('active');
        } else {
          btnNoRoots.classList.remove('active');
          rootsList.forEach((val, idx) => {
            const item = document.createElement('div');
            item.className = 'task20-root-item';

            const lbl = document.createElement('span');
            lbl.className = 'task20-root-label';
            lbl.textContent = `x${idx + 1} =`;

            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = 'task20-root-input';
            inp.setAttribute('data-idx', String(idx));
            inp.placeholder = `корень ${idx + 1}`;
            inp.value = val || '';
            if (readonly) inp.disabled = true;
            inp.autocomplete = 'off';

            inp.addEventListener('input', (e) => {
              rootsList[idx] = e.target.value.trim();
              notifyChange();
            });
            inp.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && onEnter) onEnter();
            });

            item.appendChild(lbl);
            item.appendChild(inp);
            grid.appendChild(item);
          });
        }
        notifyChange();
      }

      // Кнопки действий
      const btnAddRoot = document.createElement('button');
      btnAddRoot.type = 'button';
      btnAddRoot.className = 'task20-act-btn';
      btnAddRoot.textContent = '➕ Добавить корень';
      btnAddRoot.addEventListener('click', () => {
        isNoRoots = false;
        rootsList.push('');
        renderRoots();
      });

      const btnRemoveRoot = document.createElement('button');
      btnRemoveRoot.type = 'button';
      btnRemoveRoot.className = 'task20-act-btn';
      btnRemoveRoot.textContent = '➖ Убрать корень';
      btnRemoveRoot.addEventListener('click', () => {
        if (rootsList.length > 1) {
          rootsList.pop();
          renderRoots();
        }
      });

      const btnNoRoots = document.createElement('button');
      btnNoRoots.type = 'button';
      btnNoRoots.className = 'task20-act-btn';
      btnNoRoots.textContent = '∅ Нет корней';
      btnNoRoots.addEventListener('click', () => {
        isNoRoots = !isNoRoots;
        renderRoots();
      });

      const btnMinus = document.createElement('button');
      btnMinus.type = 'button';
      btnMinus.className = 'task20-act-btn';
      btnMinus.textContent = '− (Минус)';
      btnMinus.addEventListener('click', () => {
        const active = document.activeElement;
        if (active && active.classList.contains('task20-root-input')) {
          const val = active.value;
          if (!val.startsWith('−') && !val.startsWith('-')) {
            active.value = '−' + val;
          } else {
            active.value = val.replace(/^[-−]/, '');
          }
          const idx = parseInt(active.getAttribute('data-idx'), 10);
          rootsList[idx] = active.value;
          notifyChange();
        } else {
          // Вставить в первое пустое
          const emptyIdx = rootsList.findIndex(r => !r);
          if (emptyIdx !== -1) {
            rootsList[emptyIdx] = '−';
            renderRoots();
          }
        }
      });

      if (!readonly) {
        actionsBar.appendChild(btnAddRoot);
        actionsBar.appendChild(btnRemoveRoot);
        actionsBar.appendChild(btnNoRoots);
        actionsBar.appendChild(btnMinus);
      }

      wrapper.appendChild(grid);
      if (!readonly) wrapper.appendChild(actionsBar);
      wrapper.appendChild(previewBox);

      function notifyChange() {
        let canonical = '';
        const nonEmpties = rootsList.filter(r => r && String(r).trim() !== '');

        if (isNoRoots) {
          canonical = 'нет корней';
          previewValEl.textContent = 'Действительных корней нет (∅)';
        } else if (nonEmpties.length > 0) {
          canonical = nonEmpties.join('; ');
          previewValEl.textContent = `x ∈ { ${canonical} }`;
        } else {
          canonical = '';
          previewValEl.textContent = '— (не заполнено)';
        }

        if (onChange) {
          onChange(canonical, {
            type: 'equation',
            noRoots: isNoRoots,
            roots: nonEmpties.map(normalizeNum).filter(n => !isNaN(n))
          });
        }
      }

      renderRoots();

      return {
        getValue: () => isNoRoots ? 'нет корней' : rootsList.filter(r => r).join('; '),
        focus: () => {
          const first = grid.querySelector('.task20-root-input');
          if (first) first.focus();
        }
      };
    }

    // =========================================================================
    // 2. ВИДЖЕТ НЕРАВЕНСТВ (КОНСТРУКТОР ПРОМЕЖУТКОВ И ТОЧЕК)
    // =========================================================================
    if (taskType === 'inequality') {
      let isNoSolutions = false;
      let blocks = []; // массив элементов { type: 'interval' | 'point', ... }

      // Парсинг начального значения
      if (initialValue && typeof initialValue === 'string') {
        const clean = initialValue.trim().toLowerCase();
        if (clean.includes('нет') || clean === '∅') {
          isNoSolutions = true;
        } else {
          // Парсим интервалы и точки
          const intervalRegex = /([(\[])\s*([^;,]+)\s*[;,]\s*([^;,]+)\s*([)\]])/g;
          let m;
          while ((m = intervalRegex.exec(initialValue)) !== null) {
            blocks.push({
              type: 'interval',
              leftBracket: m[1],
              leftVal: m[2].trim(),
              rightVal: m[3].trim(),
              rightBracket: m[4]
            });
          }
          const ptRegex = /\{\s*([-−]?\d+(?:[.,]\d+)?)\s*\}/g;
          let pm;
          while ((pm = ptRegex.exec(initialValue)) !== null) {
            blocks.push({
              type: 'point',
              val: pm[1].trim()
            });
          }
        }
      }

      // Панель шаблонов
      const tplBar = document.createElement('div');
      tplBar.className = 'task20-template-pills';

      const tpls = [
        { id: 'single_interval', label: '(a; b) Промежуток' },
        { id: 'interval_point', label: '(a; b) ∪ {c} Промежуток + точка' },
        { id: 'two_intervals', label: '(a; b) ∪ (c; d) Два промежутка' },
        { id: 'interval_point_interval', label: '(a; b) ∪ {c} ∪ (d; e) Два промежутка + точка' }
      ];

      tpls.forEach(t => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'task20-tpl-btn';
        b.textContent = t.label;
        b.setAttribute('data-tpl', t.id);
        b.addEventListener('click', () => {
          tplBar.querySelectorAll('.task20-tpl-btn').forEach(btn => btn.classList.remove('active'));
          b.classList.add('active');
          applyTemplate(t.id);
        });
        tplBar.appendChild(b);
      });

      const blocksContainer = document.createElement('div');
      blocksContainer.className = 'task20-ineq-blocks';

      const actionsBar = document.createElement('div');
      actionsBar.className = 'task20-actions-bar';

      const previewBox = document.createElement('div');
      previewBox.className = 'task20-preview-box';
      const previewLabel = document.createElement('span');
      previewLabel.textContent = 'Ваш ответ:';
      const previewValEl = document.createElement('strong');
      previewValEl.className = 'task20-preview-val';
      previewValEl.textContent = '—';
      previewBox.appendChild(previewLabel);
      previewBox.appendChild(previewValEl);

      function applyTemplate(tpl) {
        isNoSolutions = false;
        blocks = [];
        if (tpl === 'single_interval') {
          blocks = [
            { type: 'interval', leftBracket: '(', leftVal: '', rightVal: '', rightBracket: ')' }
          ];
        } else if (tpl === 'interval_point') {
          blocks = [
            { type: 'interval', leftBracket: '(', leftVal: '−∞', rightVal: '', rightBracket: ')' },
            { type: 'point', val: '' }
          ];
        } else if (tpl === 'two_intervals') {
          blocks = [
            { type: 'interval', leftBracket: '(', leftVal: '−∞', rightVal: '', rightBracket: ']' },
            { type: 'interval', leftBracket: '[', leftVal: '', rightVal: '+∞', rightBracket: ')' }
          ];
        } else if (tpl === 'interval_point_interval') {
          blocks = [
            { type: 'interval', leftBracket: '(', leftVal: '−∞', rightVal: '', rightBracket: ']' },
            { type: 'point', val: '' },
            { type: 'interval', leftBracket: '[', leftVal: '', rightVal: '+∞', rightBracket: ')' }
          ];
        }
        renderBlocks();
      }

      // Если начального значения не было, выбираем шаблон по метаданным задачи
      if (!isNoSolutions && blocks.length === 0) {
        const structure = (task.answerData && task.answerData.structure) || 'single_interval';
        applyTemplate(structure);
      }

      function renderBlocks() {
        blocksContainer.innerHTML = '';

        if (isNoSolutions) {
          const emptyNotice = document.createElement('div');
          emptyNotice.style.padding = '8px 16px';
          emptyNotice.style.fontWeight = '700';
          emptyNotice.style.color = '#b7464e';
          emptyNotice.textContent = 'Выбран ответ: Решений нет (∅)';
          blocksContainer.appendChild(emptyNotice);
          notifyChange();
          return;
        }

        const row = document.createElement('div');
        row.className = 'task20-ineq-row';

        blocks.forEach((blk, idx) => {
          if (idx > 0) {
            const unionSign = document.createElement('span');
            unionSign.className = 'task20-union-sign';
            unionSign.textContent = '∪';
            row.appendChild(unionSign);
          }

          if (blk.type === 'interval') {
            const card = document.createElement('div');
            card.className = 'task20-interval-card';

            // Левая скобка
            const btnLeftBr = document.createElement('button');
            btnLeftBr.type = 'button';
            btnLeftBr.className = 'task20-bracket-btn';
            btnLeftBr.textContent = blk.leftBracket || '(';
            btnLeftBr.title = 'Переключить круглая / квадратная';
            btnLeftBr.addEventListener('click', () => {
              blk.leftBracket = (blk.leftBracket === '(' ? '[' : '(');
              btnLeftBr.textContent = blk.leftBracket;
              notifyChange();
            });

            // Левая граница
            const boundBoxLeft = document.createElement('div');
            boundBoxLeft.className = 'task20-bound-box';

            const inpLeft = document.createElement('input');
            inpLeft.type = 'text';
            inpLeft.className = 'task20-bound-input';
            inpLeft.placeholder = 'от';
            inpLeft.value = blk.leftVal || '';
            if (readonly) inpLeft.disabled = true;

            const btnInfLeft = document.createElement('button');
            btnInfLeft.type = 'button';
            btnInfLeft.className = 'task20-inf-quick-btn';
            btnInfLeft.title = 'Поставить −∞';
            btnInfLeft.textContent = '−∞';

            boundBoxLeft.appendChild(inpLeft);
            boundBoxLeft.appendChild(btnInfLeft);

            inpLeft.addEventListener('input', (e) => {
              blk.leftVal = e.target.value.trim();
              notifyChange();
            });
            inpLeft.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && onEnter) onEnter();
            });
            btnInfLeft.addEventListener('click', () => {
              blk.leftVal = '−∞';
              inpLeft.value = '−∞';
              blk.leftBracket = '(';
              btnLeftBr.textContent = '(';
              notifyChange();
            });

            // Разделитель
            const sep = document.createElement('span');
            sep.className = 'task20-sep';
            sep.textContent = ';';

            // Правая граница
            const boundBoxRight = document.createElement('div');
            boundBoxRight.className = 'task20-bound-box';

            const inpRight = document.createElement('input');
            inpRight.type = 'text';
            inpRight.className = 'task20-bound-input';
            inpRight.placeholder = 'до';
            inpRight.value = blk.rightVal || '';
            if (readonly) inpRight.disabled = true;

            const btnInfRight = document.createElement('button');
            btnInfRight.type = 'button';
            btnInfRight.className = 'task20-inf-quick-btn';
            btnInfRight.title = 'Поставить +∞';
            btnInfRight.textContent = '+∞';

            boundBoxRight.appendChild(inpRight);
            boundBoxRight.appendChild(btnInfRight);

            inpRight.addEventListener('input', (e) => {
              blk.rightVal = e.target.value.trim();
              notifyChange();
            });
            inpRight.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && onEnter) onEnter();
            });
            btnInfRight.addEventListener('click', () => {
              blk.rightVal = '+∞';
              inpRight.value = '+∞';
              blk.rightBracket = ')';
              btnRightBr.textContent = ')';
              notifyChange();
            });

            // Правая скобка
            const btnRightBr = document.createElement('button');
            btnRightBr.type = 'button';
            btnRightBr.className = 'task20-bracket-btn';
            btnRightBr.textContent = blk.rightBracket || ')';
            btnRightBr.title = 'Переключить круглая / квадратная';
            btnRightBr.addEventListener('click', () => {
              blk.rightBracket = (blk.rightBracket === ')' ? ']' : ')');
              btnRightBr.textContent = blk.rightBracket;
              notifyChange();
            });

            card.appendChild(btnLeftBr);
            card.appendChild(boundBoxLeft);
            card.appendChild(sep);
            card.appendChild(boundBoxRight);
            card.appendChild(btnRightBr);

            if (!readonly && blocks.length > 1) {
              const btnDel = document.createElement('button');
              btnDel.type = 'button';
              btnDel.className = 'task20-del-btn';
              btnDel.textContent = '✕';
              btnDel.title = 'Удалить этот промежуток';
              btnDel.addEventListener('click', () => {
                blocks.splice(idx, 1);
                renderBlocks();
              });
              card.appendChild(btnDel);
            }

            row.appendChild(card);
          } else if (blk.type === 'point') {
            const card = document.createElement('div');
            card.className = 'task20-point-card';

            const braceL = document.createElement('span');
            braceL.className = 'task20-brace-sign';
            braceL.textContent = '{';

            const inpPt = document.createElement('input');
            inpPt.type = 'text';
            inpPt.className = 'task20-point-input';
            inpPt.placeholder = 'точка';
            inpPt.value = blk.val || '';
            if (readonly) inpPt.disabled = true;

            const braceR = document.createElement('span');
            braceR.className = 'task20-brace-sign';
            braceR.textContent = '}';

            card.appendChild(braceL);
            card.appendChild(inpPt);
            card.appendChild(braceR);

            inpPt.addEventListener('input', (e) => {
              blk.val = e.target.value.trim();
              notifyChange();
            });
            inpPt.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && onEnter) onEnter();
            });

            if (!readonly && blocks.length > 1) {
              const btnDel = document.createElement('button');
              btnDel.type = 'button';
              btnDel.className = 'task20-del-btn';
              btnDel.textContent = '✕';
              btnDel.title = 'Удалить эту точку';
              btnDel.addEventListener('click', () => {
                blocks.splice(idx, 1);
                renderBlocks();
              });
              card.appendChild(btnDel);
            }

            row.appendChild(card);
          }
        });

        blocksContainer.appendChild(row);
        notifyChange();
      }

      // Кнопки управления
      const btnAddInterval = document.createElement('button');
      btnAddInterval.type = 'button';
      btnAddInterval.className = 'task20-act-btn';
      btnAddInterval.textContent = '➕ Добавить промежуток';
      btnAddInterval.addEventListener('click', () => {
        isNoSolutions = false;
        blocks.push({ type: 'interval', leftBracket: '(', leftVal: '', rightVal: '', rightBracket: ')' });
        renderBlocks();
      });

      const btnAddPoint = document.createElement('button');
      btnAddPoint.type = 'button';
      btnAddPoint.className = 'task20-act-btn';
      btnAddPoint.textContent = '➕ Добавить точку {c}';
      btnAddPoint.addEventListener('click', () => {
        isNoSolutions = false;
        blocks.push({ type: 'point', val: '' });
        renderBlocks();
      });

      const btnEmpty = document.createElement('button');
      btnEmpty.type = 'button';
      btnEmpty.className = 'task20-act-btn';
      btnEmpty.textContent = '∅ Решений нет';
      btnEmpty.addEventListener('click', () => {
        isNoSolutions = !isNoSolutions;
        renderBlocks();
      });

      if (!readonly) {
        actionsBar.appendChild(btnAddInterval);
        actionsBar.appendChild(btnAddPoint);
        actionsBar.appendChild(btnEmpty);
      }

      wrapper.appendChild(tplBar);
      wrapper.appendChild(blocksContainer);
      if (!readonly) wrapper.appendChild(actionsBar);
      wrapper.appendChild(previewBox);

      function notifyChange() {
        if (isNoSolutions) {
          previewValEl.textContent = 'Решений нет (∅)';
          if (onChange) onChange('нет решений', { type: 'inequality', noSolutions: true, parts: [] });
          return;
        }

        const validParts = [];
        const partStrings = [];

        blocks.forEach(b => {
          if (b.type === 'interval') {
            if (b.leftVal || b.rightVal) {
              const lBr = b.leftBracket || '(';
              const rBr = b.rightBracket || ')';
              const lV = b.leftVal || '−∞';
              const rV = b.rightVal || '+∞';
              validParts.push({
                type: 'interval',
                leftBracket: lBr,
                leftVal: normalizeNum(lV),
                rightVal: normalizeNum(rV),
                rightBracket: rBr
              });
              partStrings.push(`${lBr}${lV}; ${rV}${rBr}`);
            }
          } else if (b.type === 'point') {
            if (b.val) {
              validParts.push({
                type: 'point',
                val: normalizeNum(b.val)
              });
              partStrings.push(`{${b.val}}`);
            }
          }
        });

        if (partStrings.length > 0) {
          const canonical = partStrings.join(' ∪ ');
          previewValEl.textContent = `x ∈ ${canonical}`;
          if (onChange) onChange(canonical, { type: 'inequality', parts: validParts });
        } else {
          previewValEl.textContent = '— (не заполнено)';
          if (onChange) onChange('', { type: 'inequality', parts: [] });
        }
      }

      renderBlocks();

      return {
        getValue: () => previewValEl.textContent.replace('x ∈ ', '').replace('— (не заполнено)', ''),
        focus: () => {
          const firstInp = blocksContainer.querySelector('input');
          if (firstInp) firstInp.focus();
        }
      };
    }

    // =========================================================================
    // 3. ВИДЖЕТ СИСТЕМ УРАВНЕНИЙ (ПАРИ РЕШЕНИЙ)
    // =========================================================================
    if (taskType === 'system') {
      let pairs = [];

      // Парсинг начального значения
      if (initialValue && typeof initialValue === 'string') {
        const pairRegex = /\(\s*([-−]?\d+(?:[.,]\d+)?)\s*[;,]\s*([-−]?\d+(?:[.,]\d+)?)\s*\)/g;
        let m;
        while ((m = pairRegex.exec(initialValue)) !== null) {
          pairs.push([m[1].replace('.', ','), m[2].replace('.', ',')]);
        }
      }

      if (pairs.length === 0) {
        const expectedCount = (task.answerData && Array.isArray(task.answerData.pairs)) ? task.answerData.pairs.length : 2;
        for (let i = 0; i < expectedCount; i++) {
          pairs.push(['', '']);
        }
      }

      const grid = document.createElement('div');
      grid.className = 'task20-system-grid';

      const actionsBar = document.createElement('div');
      actionsBar.className = 'task20-actions-bar';

      const previewBox = document.createElement('div');
      previewBox.className = 'task20-preview-box';
      const previewLabel = document.createElement('span');
      previewLabel.textContent = 'Ваш ответ:';
      const previewValEl = document.createElement('strong');
      previewValEl.className = 'task20-preview-val';
      previewValEl.textContent = '—';
      previewBox.appendChild(previewLabel);
      previewBox.appendChild(previewValEl);

      function renderPairs() {
        grid.innerHTML = '';
        pairs.forEach((p, idx) => {
          const card = document.createElement('div');
          card.className = 'task20-pair-card';

          const pairNum = document.createElement('span');
          pairNum.className = 'task20-pair-num';
          pairNum.textContent = `Пара ${idx + 1}:`;

          const parenL = document.createElement('span');
          parenL.style.fontWeight = '700';
          parenL.style.fontSize = '18px';
          parenL.textContent = '(';

          const fieldX = document.createElement('div');
          fieldX.className = 'task20-pair-field';
          const lblX = document.createElement('span');
          lblX.className = 'task20-pair-coord-lbl';
          lblX.textContent = `x${idx + 1} =`;
          const inpX = document.createElement('input');
          inpX.type = 'text';
          inpX.className = 'task20-coord-input';
          inpX.setAttribute('data-pair-idx', String(idx));
          inpX.setAttribute('data-coord', '0');
          inpX.placeholder = 'x';
          inpX.value = p[0] || '';
          if (readonly) inpX.disabled = true;
          fieldX.appendChild(lblX);
          fieldX.appendChild(inpX);

          const sep = document.createElement('span');
          sep.className = 'task20-sep';
          sep.textContent = ';';

          const fieldY = document.createElement('div');
          fieldY.className = 'task20-pair-field';
          const lblY = document.createElement('span');
          lblY.className = 'task20-pair-coord-lbl';
          lblY.textContent = `y${idx + 1} =`;
          const inpY = document.createElement('input');
          inpY.type = 'text';
          inpY.className = 'task20-coord-input';
          inpY.setAttribute('data-pair-idx', String(idx));
          inpY.setAttribute('data-coord', '1');
          inpY.placeholder = 'y';
          inpY.value = p[1] || '';
          if (readonly) inpY.disabled = true;
          fieldY.appendChild(lblY);
          fieldY.appendChild(inpY);

          const parenR = document.createElement('span');
          parenR.style.fontWeight = '700';
          parenR.style.fontSize = '18px';
          parenR.textContent = ')';

          card.appendChild(pairNum);
          card.appendChild(parenL);
          card.appendChild(fieldX);
          card.appendChild(sep);
          card.appendChild(fieldY);
          card.appendChild(parenR);

          inpX.addEventListener('input', (e) => {
            p[0] = e.target.value.trim();
            notifyChange();
          });
          inpY.addEventListener('input', (e) => {
            p[1] = e.target.value.trim();
            notifyChange();
          });

          inpX.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && onEnter) onEnter();
          });
          inpY.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && onEnter) onEnter();
          });

          if (!readonly && pairs.length > 1) {
            const btnDel = document.createElement('button');
            btnDel.type = 'button';
            btnDel.className = 'task20-del-btn';
            btnDel.textContent = '✕';
            btnDel.title = 'Удалить эту пару';
            btnDel.addEventListener('click', () => {
              pairs.splice(idx, 1);
              renderPairs();
            });
            card.appendChild(btnDel);
          }

          grid.appendChild(card);
        });

        notifyChange();
      }

      const btnAddPair = document.createElement('button');
      btnAddPair.type = 'button';
      btnAddPair.className = 'task20-act-btn';
      btnAddPair.textContent = '➕ Добавить пару решений';
      btnAddPair.addEventListener('click', () => {
        pairs.push(['', '']);
        renderPairs();
      });

      const btnMinus = document.createElement('button');
      btnMinus.type = 'button';
      btnMinus.className = 'task20-act-btn';
      btnMinus.textContent = '− (Минус)';
      btnMinus.addEventListener('click', () => {
        const active = document.activeElement;
        if (active && active.classList.contains('task20-coord-input')) {
          const val = active.value;
          if (!val.startsWith('−') && !val.startsWith('-')) {
            active.value = '−' + val;
          } else {
            active.value = val.replace(/^[-−]/, '');
          }
          const pIdx = parseInt(active.getAttribute('data-pair-idx'), 10);
          const cIdx = parseInt(active.getAttribute('data-coord'), 10);
          pairs[pIdx][cIdx] = active.value;
          notifyChange();
        }
      });

      if (!readonly) {
        actionsBar.appendChild(btnAddPair);
        actionsBar.appendChild(btnMinus);
      }

      wrapper.appendChild(grid);
      if (!readonly) wrapper.appendChild(actionsBar);
      wrapper.appendChild(previewBox);

      function notifyChange() {
        const validPairs = pairs.filter(p => p[0] && p[1]);
        if (validPairs.length > 0) {
          const canonical = validPairs.map(p => `(${p[0]}; ${p[1]})`).join('; ');
          previewValEl.textContent = canonical;
          if (onChange) {
            onChange(canonical, {
              type: 'system',
              pairs: validPairs.map(p => [normalizeNum(p[0]), normalizeNum(p[1])])
            });
          }
        } else {
          previewValEl.textContent = '— (не заполнено)';
          if (onChange) onChange('', { type: 'system', pairs: [] });
        }
      }

      renderPairs();

      return {
        getValue: () => previewValEl.textContent.replace('— (не заполнено)', ''),
        focus: () => {
          const firstInp = grid.querySelector('.task20-coord-input');
          if (firstInp) firstInp.focus();
        }
      };
    }

    return null;
  }

  return {
    generateTask,
    checkAnswer,
    createInputWidget,
    formatNum,
    fracHtml
  };
}));
