/**
 * Тренажёр по алгебре · 7 класс
 * «Линейная функция: значение функции и аргумента, область определения,
 * пересечение с осями координат Ox и Oy, пересечение двух графиков»
 *
 * Модуль генерации задач, проверки ответов и интеграции с конструктором ДЗ.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const exported = factory();
    module.exports = exported;
    if (root) root.LinearFunctionTrainer = exported;
  } else {
    root.LinearFunctionTrainer = factory();
  }
}(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randNonZero(min, max) {
    let val = 0;
    while (val === 0) {
      val = randInt(min, max);
    }
    return val;
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

  function wrapNeg(n) {
    return n < 0 ? `(${n})` : String(n);
  }

  /**
   * Форматирование правой части формулы y = kx + b
   * k=1, b=3 -> "x + 3"
   * k=-1, b=-5 -> "−x − 5"
   * k=2, b=0 -> "2x"
   * k=-3, b=7 -> "−3x + 7"
   */
  function formatLinearFormula(k, b, forText) {
    const minus = forText ? '-' : '−';
    let termX = '';
    if (k === 1) {
      termX = 'x';
    } else if (k === -1) {
      termX = `${minus}x`;
    } else if (k !== 0) {
      const signK = k < 0 ? minus : '';
      termX = `${signK}${Math.abs(k)}x`;
    }

    let termB = '';
    if (b > 0) {
      termB = (termX !== '') ? ` + ${b}` : `${b}`;
    } else if (b < 0) {
      termB = (termX !== '') ? ` ${minus} ${Math.abs(b)}` : `${minus}${Math.abs(b)}`;
    } else if (b === 0) {
      if (termX === '') termB = '0';
    }

    return `${termX}${termB}`;
  }

  /**
   * Сборка итогового объекта задачи с дистракторами и acceptedAnswers
   */
  function buildTaskResult(category, catName, prompt, questionHtml, displayAnswer, canonicalAnswer, acceptedAnswers, rawDistractors, solutionSteps, hint) {
    const dAns = String(displayAnswer).trim();
    const cAns = String(canonicalAnswer).trim();

    const optionSet = new Set();
    optionSet.add(dAns);

    const cleanDistractors = [];
    for (const d of rawDistractors) {
      const strD = String(d || '').trim();
      if (strD && strD !== dAns && !optionSet.has(strD)) {
        optionSet.add(strD);
        cleanDistractors.push(strD);
      }
    }

    // Если дистракторов меньше 3, добавляем варианты с небольшим смещением
    let fallbackOffset = 1;
    while (cleanDistractors.length < 3) {
      let alt = '';
      if (/^-?\d+$/.test(cAns)) {
        const num = parseInt(cAns, 10) + fallbackOffset;
        alt = String(num);
      } else if (cAns.includes(';')) {
        alt = cAns.replace(/[-+]?\d+/g, m => String(parseInt(m, 10) + fallbackOffset));
      } else {
        alt = `${dAns} + ${fallbackOffset}`;
      }
      if (alt && !optionSet.has(alt)) {
        optionSet.add(alt);
        cleanDistractors.push(alt);
      }
      fallbackOffset = fallbackOffset > 0 ? -fallbackOffset - 1 : -fallbackOffset + 1;
    }

    const allOptions = shuffle([
      { html: dAns, isCorrect: true, text: cAns },
      { html: cleanDistractors[0], isCorrect: false, text: cleanDistractors[0] },
      { html: cleanDistractors[1], isCorrect: false, text: cleanDistractors[1] },
      { html: cleanDistractors[2], isCorrect: false, text: cleanDistractors[2] }
    ]);

    const correctIndex = allOptions.findIndex(o => o.isCorrect);

    // Расширяем acceptedAnswers всеми нормальными вариантами написания
    const finalAccepted = new Set();
    finalAccepted.add(cAns);
    finalAccepted.add(dAns);
    (acceptedAnswers || []).forEach(a => {
      if (a !== undefined && a !== null && String(a).trim() !== '') {
        finalAccepted.add(String(a).trim());
      }
    });

    return {
      category,
      catName,
      prompt,
      questionHtml,
      answer: cAns,
      displayAnswer: dAns,
      acceptedAnswers: Array.from(finalAccepted),
      options: allOptions,
      correctOptionIndex: correctIndex,
      solutionSteps,
      hint
    };
  }

  // =========================================================================
  // ТИП 1: Значение функции по аргументу и аргумента по значению функции
  // =========================================================================
  function genValueTask() {
    const isFindY = Math.random() < 0.5;
    const k = randNonZero(-6, 6);
    const b = randInt(-14, 14);
    const eqHtml = formatLinearFormula(k, b, false);
    const eqText = formatLinearFormula(k, b, true);

    if (isFindY) {
      // Найти y по заданному x
      const x0 = randInt(-8, 8);
      const y0 = k * x0 + b;

      const questionHtml = `
        <div>Дана линейная функция:</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
        <div style="margin-top:0.4rem;">Найдите значение функции при <strong>x = ${x0}</strong>.</div>
      `;
      const prompt = `Найдите значение функции при аргументе x = ${x0}:`;

      const bSign = b >= 0 ? '+' : '−';
      const solutionSteps = [
        `1. Формула линейной функции: <code>y = ${eqHtml}</code>.`,
        `2. Подставим значение аргумента <code>x = ${x0}</code> в формулу:<br>` +
        `<code>y = ${k} · (${x0}) ${bSign} ${Math.abs(b)} = ${k * x0} ${bSign} ${Math.abs(b)} = ${y0}</code>.`,
        `3. <strong>Ответ:</strong> значение функции равно <strong>${y0}</strong>.`
      ];

      const distractors = [
        String(y0 + k),
        String(-y0),
        String(k * x0 - b),
        String(y0 + 2),
        String(y0 - 2)
      ];

      return buildTaskResult(
        'linear_value',
        'Значение функции и аргумента',
        prompt,
        questionHtml,
        String(y0),
        String(y0),
        [String(y0), `y = ${y0}`, `y=${y0}`],
        distractors,
        solutionSteps,
        'Подставь число вместо переменной x и выполни арифметические действия.'
      );
    } else {
      // Найти x по заданному y
      const x0 = randInt(-9, 9);
      const y0 = k * x0 + b;

      const questionHtml = `
        <div>Дана линейная функция:</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
        <div style="margin-top:0.4rem;">Найдите значение аргумента <strong>x</strong>, при котором значение функции равно <strong>${y0}</strong>.</div>
      `;
      const prompt = `Найдите аргумент x, при котором y = ${y0}:`;

      const negBSign = b >= 0 ? '−' : '+';
      const solutionSteps = [
        `1. По условию значение функции <code>y = ${y0}</code>.`,
        `2. Подставим <code>${y0}</code> вместо <code>y</code> в формулу:<br>` +
        `<code>${eqHtml} = ${y0}</code>.`,
        `3. Решаем линейное уравнение относительно <code>x</code>:<br>` +
        `<code>${k}x = ${y0} ${negBSign} ${Math.abs(b)}</code><br>` +
        `<code>${k}x = ${y0 - b}</code><br>` +
        `<code>x = ${y0 - b} : (${k}) = ${x0}</code>.`,
        `4. <strong>Ответ:</strong> значение аргумента равно <strong>${x0}</strong>.`
      ];

      const distractors = [
        String(-x0),
        String(x0 + 1),
        String(x0 - 1),
        String(k * y0 + b),
        String(-x0 + 2)
      ];

      return buildTaskResult(
        'linear_value',
        'Значение функции и аргумента',
        prompt,
        questionHtml,
        String(x0),
        String(x0),
        [String(x0), `x = ${x0}`, `x=${x0}`],
        distractors,
        solutionSteps,
        'Приравняй правую часть формулы к данному значению y и найди корень уравнения.'
      );
    }
  }

  // =========================================================================
  // ТИП 2: Область определения функции
  // =========================================================================
  function genDomainTask() {
    const isBounded = Math.random() < 0.45;
    const k = randNonZero(-7, 7);
    const b = randInt(-15, 15);
    const eqHtml = formatLinearFormula(k, b, false);

    if (!isBounded) {
      // Стандартная линейная функция: область определения — вся числовая прямая
      const questionHtml = `
        <div>Укажите область определения линейной функции:</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
      `;
      const prompt = 'Найдите область определения функции:';
      const dAns = 'Любое число (−∞; +∞)';
      const cAns = '(-∞; +∞)';

      const solutionSteps = [
        `1. Функция <code>y = ${eqHtml}</code> является линейной.`,
        `2. В формуле нет деления на ноль, извлечения корней или других ограничений.`,
        `3. Умножение на число <code>${k}</code> и сложение выполнимо для любого действительного числа.`,
        `4. <strong>Ответ:</strong> аргумент <code>x</code> может принимать любые значения: <strong>(−∞; +∞)</strong> (любое число).`
      ];

      const distractors = [
        'x ≠ 0',
        'x > 0',
        `x ≥ ${-b}`,
        `x ≠ ${b}`,
        `[0; +∞)`
      ];

      const accepted = [
        '(-∞; +∞)',
        '(-∞;+∞)',
        '(-бесконечность; +бесконечность)',
        '(-бесконечность;+бесконечность)',
        '(-inf; +inf)',
        '(-inf;+inf)',
        'любое число',
        'любое',
        'все числа',
        'x - любое число',
        'x любое',
        'любое x',
        'R',
        'r'
      ];

      return buildTaskResult(
        'linear_domain',
        'Область определения функции',
        prompt,
        questionHtml,
        dAns,
        cAns,
        accepted,
        distractors,
        solutionSteps,
        'Линейная функция y = kx + b определена для всех действительных чисел: (−∞; +∞).'
      );
    } else {
      // Функция с ограниченным промежутком
      const a = randInt(-8, 2);
      const span = randInt(3, 8);
      const c = a + span;

      const bracketType = pickRandom(['closed', 'open', 'left_closed', 'right_closed']);
      let ineqStr = '';
      let intervalStr = '';
      let intervalAlt = '';

      if (bracketType === 'closed') {
        ineqStr = `${a} ≤ x ≤ ${c}`;
        intervalStr = `[${a}; ${c}]`;
        intervalAlt = `[${a}, ${c}]`;
      } else if (bracketType === 'open') {
        ineqStr = `${a} < x < ${c}`;
        intervalStr = `(${a}; ${c})`;
        intervalAlt = `(${a}, ${c})`;
      } else if (bracketType === 'left_closed') {
        ineqStr = `${a} ≤ x < ${c}`;
        intervalStr = `[${a}; ${c})`;
        intervalAlt = `[${a}, ${c})`;
      } else {
        ineqStr = `${a} < x ≤ ${c}`;
        intervalStr = `(${a}; ${c}]`;
        intervalAlt = `(${a}, ${c}]`;
      }

      const questionHtml = `
        <div>Функция задана формулой:</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span>, где <span class="expr-line">${ineqStr}</span></div>
        <div style="margin-top:0.4rem;">Укажите область определения этой функции.</div>
      `;
      const prompt = 'Найдите область определения функции на промежутке:';

      const solutionSteps = [
        `1. Область определения функции — это множество всех допустимых значений аргумента <code>x</code>.`,
        `2. По условию значения аргумента ограничены двойным неравенством: <code>${ineqStr}</code>.`,
        `3. Нестрогим знакам (≤, ≥) соответствуют квадратные скобки [ ], строгим (<, >) — круглые ( ).`,
        `4. <strong>Ответ:</strong> область определения: <strong>${intervalStr}</strong>.`
      ];

      const distractors = [
        `[${a}; ${c}]`,
        `(${a}; ${c})`,
        `[${a}; ${c})`,
        `(${a}; ${c}]`,
        `[${-c}; ${-a}]`
      ].filter(d => d !== intervalStr);

      const accepted = [
        intervalStr,
        intervalStr.replace('; ', ';'),
        intervalAlt,
        intervalAlt.replace(', ', ',')
      ];

      return buildTaskResult(
        'linear_domain',
        'Область определения функции',
        prompt,
        questionHtml,
        intervalStr,
        intervalStr,
        accepted,
        distractors,
        solutionSteps,
        'Обрати внимание на знаки неравенства: строгие (<) дают круглые скобки, нестрогие (≤) — квадратные.'
      );
    }
  }

  // =========================================================================
  // ТИП 3: Координаты точек пересечения графика с осями Ox и Oy
  // =========================================================================
  function genAxesTask() {
    const sub = pickRandom(['ox', 'oy', 'both']);
    const k = randNonZero(-6, 6);
    // Для красивого целого корня по Ox: x0 целое
    const x0 = randNonZero(-8, 8);
    const b = -k * x0; // k*x0 + b = 0 => x0 = -b/k

    const eqHtml = formatLinearFormula(k, b, false);

    if (sub === 'ox') {
      // Пересечение только с осью Ox
      const questionHtml = `
        <div>Найдите координаты точки пересечения графика функции с осью абсцисс (Ox):</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
        <div style="font-size:0.85em; color:var(--muted); margin-top:0.4rem;">
          (Ответ запишите в виде координат <strong>(x; y)</strong>, например: <code>(3; 0)</code>)
        </div>
      `;
      const prompt = 'Найдите координаты точки пересечения графика с осью Ox:';
      const ptDisplay = `(${x0}; 0)`;
      const ptText = `(${x0}; 0)`;

      const solutionSteps = [
        `1. В точках пересечения с осью абсцисс (Ox) значение ординаты равно нулю: <code>y = 0</code>.`,
        `2. Подставим <code>y = 0</code> в уравнение функции:<br>` +
        `<code>${eqHtml} = 0</code><br>` +
        `<code>${k}x = ${-b}</code><br>` +
        `<code>x = ${-b} : (${k}) = ${x0}</code>.`,
        `3. Точка пересечения с осью Ox имеет координаты: <strong>(${x0}; 0)</strong>.`
      ];

      const distractors = [
        `(0; ${b})`,
        `(0; ${x0})`,
        `(${-x0}; 0)`,
        `(${b}; 0)`,
        `(${x0}; 1)`
      ];

      const accepted = [
        `(${x0}; 0)`,
        `(${x0};0)`,
        `(${x0}, 0)`,
        `(${x0},0)`,
        `${x0}; 0`,
        `${x0};0`,
        `${x0}, 0`,
        `${x0},0`,
        `x=${x0}, y=0`,
        `x=${x0}; y=0`,
        String(x0)
      ];

      return buildTaskResult(
        'linear_axes',
        'Пересечение с осями Ox и Oy',
        prompt,
        questionHtml,
        ptDisplay,
        ptText,
        accepted,
        distractors,
        solutionSteps,
        'Для нахождения точки пересечения с осью Ox подставь y = 0 и реши уравнение относительно x.'
      );
    } else if (sub === 'oy') {
      // Пересечение только с осью Oy
      const questionHtml = `
        <div>Найдите координаты точки пересечения графика функции с осью ординат (Oy):</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
        <div style="font-size:0.85em; color:var(--muted); margin-top:0.4rem;">
          (Ответ запишите в виде координат <strong>(x; y)</strong>, например: <code>(0; -4)</code>)
        </div>
      `;
      const prompt = 'Найдите координаты точки пересечения графика с осью Oy:';
      const ptDisplay = `(0; ${b})`;
      const ptText = `(0; ${b})`;

      const bSign = b >= 0 ? '+' : '−';
      const solutionSteps = [
        `1. В точках пересечения с осью ординат (Oy) значение абсциссы равно нулю: <code>x = 0</code>.`,
        `2. Подставим <code>x = 0</code> в формулу функции:<br>` +
        `<code>y = ${k} · 0 ${bSign} ${Math.abs(b)} = ${b}</code>.`,
        `3. Точка пересечения с осью Oy имеет координаты: <strong>(0; ${b})</strong>.`
      ];

      const distractors = [
        `(${x0}; 0)`,
        `(${b}; 0)`,
        `(0; ${-b})`,
        `(0; ${x0})`,
        `(1; ${b})`
      ];

      const accepted = [
        `(0; ${b})`,
        `(0;${b})`,
        `(0, ${b})`,
        `(0,${b})`,
        `0; ${b}`,
        `0;${b}`,
        `0, ${b}`,
        `0,${b}`,
        `x=0, y=${b}`,
        `x=0; y=${b}`,
        String(b)
      ];

      return buildTaskResult(
        'linear_axes',
        'Пересечение с осями Ox и Oy',
        prompt,
        questionHtml,
        ptDisplay,
        ptText,
        accepted,
        distractors,
        solutionSteps,
        'Для нахождения точки пересечения с осью Oy подставь x = 0 (значение равно свободному коэффициенту b).'
      );
    } else {
      // Обе оси
      const questionHtml = `
        <div>Найдите координаты точек пересечения графика функции с осями Ox и Oy:</div>
        <div class="math-expr"><span class="expr-line">y = ${eqHtml}</span></div>
        <div style="font-size:0.85em; color:var(--muted); margin-top:0.4rem;">
          (Запишите обе точки, например: <code>(3; 0); (0; -4)</code>)
        </div>
      `;
      const prompt = 'Найдите точки пересечения графика с осями координат:';
      const dAns = `Ox: (${x0}; 0); Oy: (0; ${b})`;
      const cAns = `(${x0}; 0); (0; ${b})`;

      const solutionSteps = [
        `1. <strong>Пересечение с Ox (y = 0):</strong><br>` +
        `<code>${eqHtml} = 0 ⟹ ${k}x = ${-b} ⟹ x = ${x0}</code>.<br>` +
        `Точка с осью Ox: <strong>(${x0}; 0)</strong>.`,
        `2. <strong>Пересечение с Oy (x = 0):</strong><br>` +
        `<code>y = ${k} · 0 + (${b}) = ${b}</code>.<br>` +
        `Точка с осью Oy: <strong>(0; ${b})</strong>.`,
        `3. <strong>Ответ:</strong> Ox: (${x0}; 0); Oy: (0; ${b}).`
      ];

      const distractors = [
        `Ox: (0; ${b}); Oy: (${x0}; 0)`,
        `Ox: (${-x0}; 0); Oy: (0; ${-b})`,
        `Ox: (0; ${x0}); Oy: (${b}; 0)`,
        `Ox: (${b}; 0); Oy: (0; ${x0})`
      ];

      const accepted = [
        `(${x0}; 0); (0; ${b})`,
        `(${x0}; 0), (0; ${b})`,
        `(${x0};0); (0;${b})`,
        `(${x0};0),(0;${b})`,
        `(${x0}; 0) и (0; ${b})`,
        `Ox: (${x0}; 0); Oy: (0; ${b})`,
        `Ox: (${x0}; 0), Oy: (0; ${b})`,
        `Ox:(${x0};0); Oy:(0;${b})`
      ];

      return buildTaskResult(
        'linear_axes',
        'Пересечение с осями Ox и Oy',
        prompt,
        questionHtml,
        dAns,
        cAns,
        accepted,
        distractors,
        solutionSteps,
        'С осью Ox: положи y = 0. С осью Oy: положи x = 0.'
      );
    }
  }

  // =========================================================================
  // ТИП 4: Координаты точки пересечения графиков двух функций
  // =========================================================================
  function genIntersectionTask() {
    // Выбираем целочисленную точку пересечения (x0, y0)
    const x0 = randNonZero(-6, 6);
    const y0 = randInt(-8, 8);

    // Выбираем два несовпадающих ненулевых угловых коэффициента
    let k1 = randNonZero(-5, 5);
    let k2 = randNonZero(-5, 5);
    while (k2 === k1) {
      k2 = randNonZero(-5, 5);
    }

    // Вычисляем свободные члены
    const b1 = y0 - k1 * x0;
    const b2 = y0 - k2 * x0;

    const eq1Html = formatLinearFormula(k1, b1, false);
    const eq2Html = formatLinearFormula(k2, b2, false);

    const questionHtml = `
      <div>Найдите координаты точки пересечения графиков двух линейных функций:</div>
      <div class="math-expr" style="margin: 0.5rem 0;">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <div>y = ${eq1Html}</div>
            <div>y = ${eq2Html}</div>
          </div>
        </div>
      </div>
      <div style="font-size:0.85em; color:var(--muted); margin-top:0.4rem;">
        (Ответ запишите в виде координат <strong>(x; y)</strong>, например: <code>(2; -3)</code>)
      </div>
    `;
    const prompt = 'Найдите координаты точки пересечения графиков:';
    const ptDisplay = `(${x0}; ${y0})`;
    const ptText = `(${x0}; ${y0})`;

    const b1Sign = b1 >= 0 ? '+' : '−';
    const solutionSteps = [
      `1. В точке пересечения значения функций равны. Приравняем правые части уравнений:<br>` +
      `<code>${eq1Html} = ${eq2Html}</code>.`,
      `2. Переносим слагаемые с <code>x</code> влево, а числа вправо:<br>` +
      `<code>${k1}x − (${wrapNeg(k2)}x) = ${b2} − (${wrapNeg(b1)})</code><br>` +
      `<code>${k1 - k2}x = ${b2 - b1}</code><br>` +
      `<code>x = ${b2 - b1} : (${k1 - k2}) = ${x0}</code>.`,
      `3. Подставим найденное значение <code>x = ${x0}</code> в первую функцию:<br>` +
      `<code>y = ${k1} · (${x0}) ${b1Sign} ${Math.abs(b1)} = ${y0}</code>.`,
      `4. <strong>Ответ:</strong> точка пересечения имеет координаты <strong>(${x0}; ${y0})</strong>.`
    ];

    const distractors = [
      `(${y0}; ${x0})`,
      `(${-x0}; ${y0})`,
      `(${x0}; ${-y0})`,
      `(${x0 + 1}; ${y0 - 1})`,
      `(${x0 - 1}; ${y0 + 1})`
    ];

    const accepted = [
      `(${x0}; ${y0})`,
      `(${x0};${y0})`,
      `(${x0}, ${y0})`,
      `(${x0},${y0})`,
      `${x0}; ${y0}`,
      `${x0};${y0}`,
      `${x0}, ${y0}`,
      `${x0},${y0}`,
      `x=${x0}, y=${y0}`,
      `x=${x0}; y=${y0}`,
      `x=${x0},y=${y0}`
    ];

    return buildTaskResult(
      'linear_intersection',
      'Пересечение графиков функций',
      prompt,
      questionHtml,
      ptDisplay,
      ptText,
      accepted,
      distractors,
      solutionSteps,
      'Приравняй выражения функций друг к другу (k₁x + b₁ = k₂x + b₂), найди x, а затем подставь его и вычисли y.'
    );
  }

  // =========================================================================
  // Парсер и сверка ответов
  // =========================================================================
  function parseCoordinates(str) {
    if (!str) return null;
    const clean = String(str).trim().replace(/\s+/g, '').replace(/−/g, '-');
    // Ищем пару чисел: (x; y) или (x, y) или x=1,y=2 или 1;2
    const m = clean.match(/[-+]?\d+(?:[.,]\d+)?/g);
    if (m && m.length >= 2) {
      return {
        x: parseFloat(m[0].replace(',', '.')),
        y: parseFloat(m[1].replace(',', '.'))
      };
    }
    return null;
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не указан' };
    }

    // Если ответ выбран из вариантов (индекс карточки 0..3)
    if (typeof rawUserAnswer === 'number' && rawUserAnswer >= 0 && rawUserAnswer <= 3) {
      const isCorrect = (rawUserAnswer === task.correctOptionIndex);
      return {
        isCorrect,
        correctIndex: task.correctOptionIndex,
        userIndex: rawUserAnswer,
        displayAnswer: task.displayAnswer
      };
    }

    const cleanStr = String(rawUserAnswer).trim();
    if (!cleanStr) {
      return { isCorrect: false, error: 'Введите ответ' };
    }

    const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '').replace(/−/g, '-').replace(',', '.');
    const uNorm = norm(cleanStr);

    // 1. Прямая сверка с acceptedAnswers
    if (Array.isArray(task.acceptedAnswers)) {
      for (const acc of task.acceptedAnswers) {
        if (norm(acc) === uNorm) {
          return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
        }
      }
    }

    // 2. Сверка как число (для linear_value)
    const uNum = parseFloat(uNorm);
    const cNum = parseFloat(norm(task.answer));
    if (!isNaN(uNum) && !isNaN(cNum) && Math.abs(uNum - cNum) < 0.0001) {
      return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
    }

    // 3. Сверка как координаты (x; y)
    const uCoord = parseCoordinates(cleanStr);
    const cCoord = parseCoordinates(task.answer || task.displayAnswer);
    if (uCoord && cCoord) {
      if (Math.abs(uCoord.x - cCoord.x) < 0.0001 && Math.abs(uCoord.y - cCoord.y) < 0.0001) {
        return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
      }
    }

    return {
      isCorrect: false,
      userAnswer: cleanStr,
      correctAnswer: task.displayAnswer,
      displayAnswer: task.displayAnswer
    };
  }

  // =========================================================================
  // Главный диспетчер задач
  // =========================================================================
  function generateTask(mode) {
    let m = mode || 'all';
    if (m.startsWith('linear_')) {
      m = m.replace('linear_', '');
    }

    switch (m) {
      case 'value':
        return genValueTask();
      case 'domain':
        return genDomainTask();
      case 'axes':
        return genAxesTask();
      case 'intersection':
        return genIntersectionTask();
      case 'all':
      case 'mixed':
      default:
        return pickRandom([genValueTask, genDomainTask, genAxesTask, genIntersectionTask])();
    }
  }

  return {
    generateTask,
    checkAnswer,
    genValueTask,
    genDomainTask,
    genAxesTask,
    genIntersectionTask,
    formatLinearFormula,
    parseCoordinates
  };
}));
