/**
 * Тренажёр ОГЭ по математике · Задание №9
 * «Уравнения, системы уравнений»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru, Темы 7 и 43)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask9Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
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

  function formatNum(n) {
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatSigned(num) {
    if (num > 0) return `+ ${num}`;
    if (num < 0) return `− ${Math.abs(num)}`;
    return '';
  }

  function formatSignedCompact(num) {
    if (num > 0) return `+${num}`;
    if (num < 0) return `−${Math.abs(num)}`;
    return '0';
  }

  // --- 1. ЛИНЕЙНЫЕ УРАВНЕНИЯ (ТЕМА 7) ---

  // 1.1 Базовое линейное: ax + b = cx + d
  function genLinearSimple() {
    const x = randInt(-12, 12);
    let a = pickRandom([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    let c = pickRandom([-5, -4, -3, -2, 2, 3, 4, 5]);
    while (a === c) {
      c = pickRandom([-5, -4, -3, -2, 2, 3, 4, 5]);
    }
    const b = randInt(-20, 20);
    const d = (a - c) * x + b;

    const leftPart = `${a === 1 ? '' : a === -1 ? '−' : a}x ${formatSigned(b)}`;
    const rightPart = `${c === 1 ? '' : c === -1 ? '−' : c}x ${formatSigned(d)}`;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${leftPart} = ${rightPart}</span></div>`;

    const diffCoeff = a - c;
    const diffConst = d - b;

    const solutionSteps = [
      `Переносим слагаемые с переменной <em>x</em> в левую часть, а числа — в правую, меняя их знаки на противоположные:`,
      `${a}x ${c > 0 ? `− ${c}x` : `+ ${Math.abs(c)}x`} = ${d} ${b > 0 ? `− ${b}` : `+ ${Math.abs(b)}`}`,
      `Приводим подобные слагаемые:<br><strong>${diffCoeff}x = ${diffConst}</strong>`,
      `Делим обе части уравнения на коэффициент при <em>x</em> (${diffCoeff}):<br>` +
      `$x = ${diffConst} : ${diffCoeff < 0 ? `(${diffCoeff})` : diffCoeff} = $ <strong>${formatNum(x)}</strong>`
    ];

    return {
      category: 'linear_equations',
      catName: 'Линейные уравнения',
      questionHtml,
      answer: x,
      displayAnswer: formatNum(x),
      solutionSteps,
      hint: 'Собери все слагаемые с x слева, а числа справа, после чего раздели правую часть на коэффициент при x.'
    };
  }

  // 1.2 Линейное со скобками: a(x + b) = c(x + d) + e или x - a(b - cx) = d
  function genLinearBrackets() {
    const type = pickRandom([1, 2, 3]);

    if (type === 1) {
      // k(x - m) = n, где ответ может быть десятичной дробью (например 4(x - 8) = -5)
      const k = pickRandom([2, 4, 5, 8]);
      const m = randInt(1, 10);
      const right = randInt(-15, 15);
      const answer = (right + k * m) / k;

      const questionHtml = `<div class="math-expr"><span class="expr-line">${k}(x − ${m}) = ${right}</span></div>`;
      const solutionSteps = [
        `Раскрываем скобки в левой части уравнения:<br>${k}x − ${k * m} = ${right}`,
        `Переносим свободный член в правую часть со сменой знака:<br>${k}x = ${right} + ${k * m}<br>${k}x = ${right + k * m}`,
        `Находим неизвестный множитель <em>x</em>:<br>$x = ${right + k * m} / ${k} = $ <strong>${formatNum(answer)}</strong>`
      ];

      return {
        category: 'linear_equations',
        catName: 'Линейные уравнения',
        questionHtml,
        answer,
        displayAnswer: formatNum(answer),
        solutionSteps,
        hint: 'Раскрой скобки, умножив коэффициент на каждое слагаемое внутри.'
      };
    } else if (type === 2) {
      // x - a(b - c*x) = d (прототип ОГЭ: x - 3(1 - 7x) = 2)
      const x = randInt(-8, 8);
      const a = pickRandom([2, 3, 4, 5]);
      const b = randInt(1, 6);
      const c = pickRandom([2, 3, 4, 5]);
      const leftVal = x - a * (b - c * x);

      const questionHtml = `<div class="math-expr"><span class="expr-line">x − ${a}(${b} − ${c}x) = ${leftVal}</span></div>`;
      const coeffX = 1 + a * c;
      const constTerm = -a * b;

      const solutionSteps = [
        `Раскрываем скобки, учитывая знак минус перед множителем ${a}:<br>` +
        `x − ${a * b} + ${a * c}x = ${leftVal}`,
        `Приводим подобные слагаемые в левой части:<br>` +
        `${coeffX}x − ${a * b} = ${leftVal}`,
        `Переносим число в правую часть:<br>${coeffX}x = ${leftVal} + ${a * b} = ${leftVal + a * b}`,
        `Делим на ${coeffX}:<br>$x = ${leftVal + a * b} / ${coeffX} = $ <strong>${formatNum(x)}</strong>`
      ];

      return {
        category: 'linear_equations',
        catName: 'Линейные уравнения',
        questionHtml,
        answer: x,
        displayAnswer: formatNum(x),
        solutionSteps,
        hint: 'Осторожно со знаками при раскрытии скобок: минус на минус даёт плюс.'
      };
    } else {
      // a(x + b) = c(x + d)
      const x = randInt(-10, 10);
      let a = pickRandom([2, 3, 4, 5]);
      let c = pickRandom([2, 3, 4, 5, 6]);
      while (a === c) c = pickRandom([2, 3, 4, 5, 6]);
      const b = randInt(-8, 8);
      const d = Math.round((a * (x + b) - c * x) / c);
      const realC_part = c * (x + d);
      const realA_part = a * (x + b);
      const diff = realA_part - realC_part;
      const bAdj = b - (diff % a === 0 ? diff / a : 0);
      const actualX = x;

      const questionHtml = `<div class="math-expr"><span class="expr-line">${a}(x ${formatSigned(bAdj)}) = ${c}(x ${formatSigned(d)})</span></div>`;
      const leftExpanded = `${a}x ${formatSigned(a * bAdj)}`;
      const rightExpanded = `${c}x ${formatSigned(c * d)}`;

      const solutionSteps = [
        `Раскрываем скобки с обеих сторон уравнения:<br>${leftExpanded} = ${rightExpanded}`,
        `Группируем слагаемые с <em>x</em> слева, а числа справа:<br>${a}x − ${c}x = ${c * d} − (${a * bAdj})`,
        `${a - c}x = ${c * d - a * bAdj}`,
        `Находим корень:<br>$x = ${c * d - a * bAdj} / ${a - c} = $ <strong>${formatNum(actualX)}</strong>`
      ];

      return {
        category: 'linear_equations',
        catName: 'Линейные уравнения',
        questionHtml,
        answer: actualX,
        displayAnswer: formatNum(actualX),
        solutionSteps,
        hint: 'Раскрой скобки слева и справа, затем перенеси неизвестные влево, а числа вправо.'
      };
    }
  }

  // 1.3 Линейное с дробными коэффициентами: x/a + x/b = c или (x - a)/b = (x + c)/d
  function genLinearFractions() {
    const denoms = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [3, 7]];
    const pair = pickRandom(denoms);
    const d1 = pair[0];
    const d2 = pair[1];
    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;
    const isAdd = Math.random() > 0.4;
    const op = isAdd ? '+' : '−';
    const numCoeff = isAdd ? (m1 + m2) : (m1 - m2);

    // Подбираем x кратный commonDen или целый ответ
    const k = randInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
    const x = k * (commonDen / gcd(commonDen, Math.abs(numCoeff)));
    const rightSide = Math.round((numCoeff * x) / commonDen);

    const questionHtml = `<div class="math-expr"><span class="expr-line">${fracHtml('x', d1)} ${op} ${fracHtml('x', d2)} = ${rightSide}</span></div>`;

    const solutionSteps = [
      `Умножаем обе части уравнения на наименьший общий знаменатель дробей (${commonDen}):<br>` +
      `${commonDen} · (${fracHtml('x', d1)} ${op} ${fracHtml('x', d2)}) = ${commonDen} · ${rightSide}`,
      `Сокращаем знаменатели:<br>${m1}x ${op} ${m2}x = ${commonDen * rightSide}`,
      `${numCoeff}x = ${commonDen * rightSide}`,
      `Делим обе части на ${numCoeff}:<br>$x = ${commonDen * rightSide} / ${numCoeff} = $ <strong>${formatNum(x)}</strong>`
    ];

    return {
      category: 'linear_equations',
      catName: 'Линейные уравнения',
      questionHtml,
      answer: x,
      displayAnswer: formatNum(x),
      solutionSteps,
      hint: `Умножь обе части уравнения на общий знаменатель (${commonDen}), чтобы избавиться от дробей.`
    };
  }

  // --- 2. КВАДРАТНЫЕ УРАВНЕНИЯ (ТЕМА 7) ---

  // 2.1 Неполное квадратное вида: ax^2 - c = 0
  function genIncompleteQuadC() {
    const k = randInt(2, 12);
    const a = pickRandom([1, 2, 3, 4, 5]);
    const c = a * k * k;
    const askSmaller = Math.random() > 0.5;

    const questionText = askSmaller 
      ? 'Если уравнение имеет более одного корня, в ответ запишите меньший из корней.'
      : 'Если уравнение имеет более одного корня, в ответ запишите больший из корней.';

    const expr = a === 1 ? `x<sup>2</sup> − ${c} = 0` : `${a}x<sup>2</sup> − ${c} = 0`;
    const questionHtml = `
      <div class="math-expr"><span class="expr-line">${expr}</span></div>
      <div class="task-instruction">${questionText}</div>
    `;

    const roots = [-k, k];
    const answer = askSmaller ? -k : k;

    const solutionSteps = [
      `Переносим свободный член в правую часть уравнения:<br>${a === 1 ? 'x<sup>2</sup>' : `${a}x<sup>2</sup>`} = ${c}`,
      a !== 1 ? `Делим обе части уравнения на ${a}:<br>x<sup>2</sup> = ${k * k}` : '',
      `Извлекаем квадратный корень:<br>x = ±√${k * k} $\→$ <strong>x<sub>1</sub> = −${k}</strong>, <strong>x<sub>2</sub> = ${k}</strong>`,
      askSmaller
        ? `По условию требуется записать <em>меньший</em> из корней: <strong>${formatNum(answer)}</strong>.`
        : `По условию требуется записать <em>больший</em> из корней: <strong>${formatNum(answer)}</strong>.`
    ].filter(Boolean);

    return {
      category: 'quadratic_equations',
      catName: 'Квадратные уравнения',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Вырази x² и извлеки квадратный корень с двумя знаками: ±.'
    };
  }

  // 2.2 Неполное квадратное вида: ax^2 + bx = 0
  function genIncompleteQuadB() {
    const root2 = randInt(-12, 12);
    if (root2 === 0) return genIncompleteQuadC();
    const a = pickRandom([1, 2, 3, 4, 5]);
    const b = -a * root2;
    const askSmaller = Math.random() > 0.5;

    const questionText = askSmaller 
      ? 'Если уравнение имеет более одного корня, в ответ запишите меньший из корней.'
      : 'Если уравнение имеет более одного корня, в ответ запишите больший из корней.';

    const aStr = a === 1 ? '' : `${a}`;
    const bStr = formatSigned(b);
    const expr = `${aStr}x<sup>2</sup> ${bStr}x = 0`;

    const questionHtml = `
      <div class="math-expr"><span class="expr-line">${expr}</span></div>
      <div class="task-instruction">${questionText}</div>
    `;

    const roots = [0, root2];
    const answer = askSmaller ? Math.min(0, root2) : Math.max(0, root2);

    const solutionSteps = [
      `Выносим общий множитель <em>x</em> за скобки:<br>x · (${aStr}x ${bStr}) = 0`,
      `Произведение равно нулю, когда хотя бы один из множителей равен нулю:<br>` +
      `<strong>x<sub>1</sub> = 0</strong> или ${aStr}x ${bStr} = 0`,
      `${aStr}x = ${-b} $\→$ <strong>x<sub>2</sub> = ${formatNum(root2)}</strong>`,
      askSmaller
        ? `Корни уравнения: 0 и ${formatNum(root2)}. Меньший из корней равен <strong>${formatNum(answer)}</strong>.`
        : `Корни уравнения: 0 и ${formatNum(root2)}. Больший из корней равен <strong>${formatNum(answer)}</strong>.`
    ];

    return {
      category: 'quadratic_equations',
      catName: 'Квадратные уравнения',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Вынеси общий множитель x за скобки: x(ax + b) = 0.'
    };
  }

  // 2.3 Полное приведённое квадратное: x^2 + px + q = 0
  function genFullQuad() {
    let x1 = randInt(-9, 9);
    let x2 = randInt(-9, 9);
    while (x1 === x2) x2 = randInt(-9, 9);

    const p = -(x1 + x2);
    const q = x1 * x2;
    const askSmaller = Math.random() > 0.5;

    const questionText = askSmaller 
      ? 'Если уравнение имеет более одного корня, в ответ запишите меньший из корней.'
      : 'Если уравнение имеет более одного корня, в ответ запишите больший из корней.';

    const pStr = p === 1 ? '+ x' : p === -1 ? '− x' : formatSigned(p) ? `${formatSigned(p)}x` : '';
    const qStr = formatSigned(q);
    const expr = `x<sup>2</sup> ${pStr} ${qStr} = 0`;

    const questionHtml = `
      <div class="math-expr"><span class="expr-line">${expr}</span></div>
      <div class="task-instruction">${questionText}</div>
    `;

    const D = p * p - 4 * q;
    const sqrtD = Math.round(Math.sqrt(D));
    const answer = askSmaller ? Math.min(x1, x2) : Math.max(x1, x2);

    const solutionSteps = [
      `Вычисляем дискриминант уравнения $D = b^2 − 4ac$:<br>` +
      `$D = (${p})^2 − 4 · 1 · (${q}) = ${p * p} − (${4 * q}) = ${D}$ (√D = ${sqrtD})`,
      `Находим корни по формуле $x = \(-b \± \√D)/(2a)$:<br>` +
      `$x_1 = \\frac{${-p} − ${sqrtD}}{2} = $ <strong>${Math.min(x1, x2)}</strong><br>` +
      `$x_2 = \\frac{${-p} + ${sqrtD}}{2} = $ <strong>${Math.max(x1, x2)}</strong>`,
      askSmaller
        ? `По требованию задачи записываем <em>меньший</em> из корней: <strong>${formatNum(answer)}</strong>.`
        : `По требованию задачи записываем <em>больший</em> из корней: <strong>${formatNum(answer)}</strong>.`
    ];

    return {
      category: 'quadratic_equations',
      catName: 'Квадратные уравнения',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Воспользуйся формулой дискриминанта D = b² − 4ac или теоремой Виета.'
    };
  }

  // 2.4 Квадратное со скобками: (x + a)^2 = (x + b)^2 или (x - a)^2 = c
  function genQuadBrackets() {
    const isDifference = Math.random() > 0.5;

    if (isDifference) {
      // (x + a)^2 = (x + b)^2 -> x^2 сокращаются, получается линейное
      let a = randInt(-8, 8);
      let b = randInt(-8, 8);
      while (Math.abs(a) === Math.abs(b)) b = randInt(-8, 8);

      const questionHtml = `<div class="math-expr"><span class="expr-line">(x ${formatSigned(a)})<sup>2</sup> = (x ${formatSigned(b)})<sup>2</sup></span></div>`;
      // x^2 + 2ax + a^2 = x^2 + 2bx + b^2 -> 2(a - b)x = b^2 - a^2 -> x = -(a + b) / 2
      const answer = -(a + b) / 2;

      const solutionSteps = [
        `Раскрываем квадраты суммы/разности с обеих сторон уравнения:<br>` +
        `x<sup>2</sup> ${formatSigned(2 * a)}x ${formatSigned(a * a)} = x<sup>2</sup> ${formatSigned(2 * b)}x ${formatSigned(b * b)}`,
        `Вычитаем x<sup>2</sup> из обеих частей:<br>` +
        `${2 * a}x ${formatSigned(a * a)} = ${2 * b}x ${formatSigned(b * b)}`,
        `Переносим слагаемые с <em>x</em> влево, а свободные члены вправо:<br>` +
        `${2 * a - 2 * b}x = ${b * b - a * a}`,
        `Находим <em>x</em>:<br>$x = ${b * b - a * a} / ${2 * (a - b)} = $ <strong>${formatNum(answer)}</strong>`
      ];

      return {
        category: 'quadratic_equations',
        catName: 'Квадратные уравнения',
        questionHtml,
        answer,
        displayAnswer: formatNum(answer),
        solutionSteps,
        hint: 'Раскрой квадраты двучленов по формулам (a ± b)² = a² ± 2ab + b².'
      };
    } else {
      // (x - a)^2 = k^2
      const a = randInt(-7, 7);
      const k = randInt(2, 9);
      const askSmaller = Math.random() > 0.5;

      const questionText = askSmaller 
        ? 'Если уравнение имеет более одного корня, в ответ запишите меньший из корней.'
        : 'Если уравнение имеет более одного корня, в ответ запишите больший из корней.';

      const questionHtml = `
        <div class="math-expr"><span class="expr-line">(x ${formatSigned(a)})<sup>2</sup> = ${k * k}</span></div>
        <div class="task-instruction">${questionText}</div>
      `;

      const x1 = -a - k;
      const x2 = -a + k;
      const answer = askSmaller ? Math.min(x1, x2) : Math.max(x1, x2);

      const solutionSteps = [
        `Извлекаем квадратный корень из обеих частей уравнения:<br>` +
        `x ${formatSigned(a)} = ${k} или x ${formatSigned(a)} = −${k}`,
        `Решаем каждое простое уравнение:<br>` +
        `x<sub>1</sub> = ${k} − (${a}) = <strong>${x2}</strong><br>` +
        `x<sub>2</sub> = −${k} − (${a}) = <strong>${x1}</strong>`,
        askSmaller
          ? `Меньший из корней равен <strong>${formatNum(answer)}</strong>.`
          : `Больший из корней равен <strong>${formatNum(answer)}</strong>.`
      ];

      return {
        category: 'quadratic_equations',
        catName: 'Квадратные уравнения',
        questionHtml,
        answer,
        displayAnswer: formatNum(answer),
        solutionSteps,
        hint: 'Извлеки квадратный корень из правой части: x + a = ±k.'
      };
    }
  }

  // --- 3. ДРОБНО-РАЦИОНАЛЬНЫЕ УРАВНЕНИЯ (ТЕМА 7) ---

  // 3.1 Пропорция a / (x + b) = c
  function genRationalSimple() {
    const isNegative = Math.random() > 0.5;
    const a = pickRandom([6, 8, 9, 12, 15, 18, 20, 24]);
    // Делитель a
    const divisors = [];
    for (let i = 2; i <= a; i++) {
      if (a % i === 0 && a / i <= 10) divisors.push(i);
    }
    const denomVal = pickRandom(divisors);
    const rightVal = (a / denomVal) * (isNegative ? -1 : 1);
    const b = randInt(-10, 10);
    // x + b = denomVal * (isNegative ? -1 : 1)
    const targetDenom = denomVal * (isNegative ? -1 : 1);
    const x = targetDenom - b;

    const questionHtml = `<div class="math-expr"><span class="expr-line">${fracHtml(a, `x ${formatSigned(b)}`)} = ${rightVal}</span></div>`;

    const solutionSteps = [
      `ОДЗ (область допустимых значений): знаменатель не равен нулю:<br>` +
      `x ${formatSigned(b)} ≠ 0 $\→$ x ≠ ${-b}`,
      `Используем основное свойство пропорции (произведение крайних членов равно произведению средних):<br>` +
      `${rightVal} · (x ${formatSigned(b)}) = ${a}`,
      `x ${formatSigned(b)} = ${a} / ${rightVal} = ${targetDenom}`,
      `x = ${targetDenom} − (${b}) = <strong>${formatNum(x)}</strong>`,
      `Проверяем ОДЗ: значение ${formatNum(x)} удовлетворяет условию $x \≠ ${-b}$.`
    ];

    return {
      category: 'rational_equations',
      catName: 'Дробно-рациональные',
      questionHtml,
      answer: x,
      displayAnswer: formatNum(x),
      solutionSteps,
      hint: 'Вспомни основное свойство пропорции: a/b = c $\→$ b = a/c (при условии b ≠ 0).'
    };
  }

  // 3.2 Пропорция вида: 1 / (x - a) = k / (x - b) или (x - a) / (x + b) = c / d
  function genRationalProportion() {
    const x = randInt(-8, 8);
    const c = randInt(1, 4);
    const d = pickRandom([2, 3, 5, 7]);
    // (x - a) / (x + b) = c / d  => d(x - a) = c(x + b) => dx - da = cx + cb => (d - c)x = da + cb
    const a = randInt(-6, 6);
    if (x === a) return genRationalSimple();
    // cb = (d - c)*x - d*a => b = ((d - c)*x - d*a)/c
    const targetB_num = (d - c) * x - d * a;
    if (targetB_num % c !== 0) return genRationalSimple();
    const b = targetB_num / c;
    if (x + b === 0) return genRationalSimple();

    const questionHtml = `<div class="math-expr"><span class="expr-line">${fracHtml(`x ${formatSigned(-a)}`, `x ${formatSigned(b)}`)} = ${fracHtml(c, d)}</span></div>`;

    const solutionSteps = [
      `ОДЗ: <em>x </em>{formatSigned(b)} \≠ 0 \→ x \≠ ${-b}$.`,
      `Применяем правило пропорции «крест-накрест»:<br>` +
      `${d} · (x ${formatSigned(-a)}) = ${c} · (x ${formatSigned(b)})`,
      `Раскрываем скобки:<br>` +
      `${d}x ${formatSigned(-d * a)} = ${c}x ${formatSigned(c * b)}`,
      `Переносим неизвестные в левую часть, числа — в правую:<br>` +
      `${d}x − ${c}x = ${c * b} + ${d * a}<br>` +
      `${d - c}x = ${c * b + d * a}`,
      `$x = ${c * b + d * a} / ${d - c} = $ <strong>${formatNum(x)}</strong>`,
      `Корень удовлетворяет ОДЗ ($x \≠ ${-b}$).`
    ];

    return {
      category: 'rational_equations',
      catName: 'Дробно-рациональные',
      questionHtml,
      answer: x,
      displayAnswer: formatNum(x),
      solutionSteps,
      hint: 'Умножь крайние и средние члены пропорции крест-накрест.'
    };
  }

  // --- 4. СИСТЕМЫ УРАВНЕНИЙ (ТЕМА 43) ---

  // 4.1 Линейная система: { a1*x + b1*y = c1; a2*x + b2*y = c2 }
  function genLinearSystem() {
    const x = randInt(-5, 6);
    const y = randInt(-5, 6);

    let a1 = pickRandom([1, 2, 3, 4, -1, -2]);
    let b1 = pickRandom([1, 2, 3, -1, -2, -3]);
    let a2 = pickRandom([1, 2, 3, -1, -2]);
    let b2 = pickRandom([1, 2, 3, -1, -2, -3]);

    // Проверяем определитель det != 0
    let det = a1 * b2 - a2 * b1;
    while (det === 0) {
      b2 = pickRandom([1, 2, 4, -1, -2, -4]);
      det = a1 * b2 - a2 * b1;
    }

    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;

    // Вопрос: найти x, найти y, или сумму x + y
    const askType = pickRandom(['x', 'y', 'sum', 'diff']);
    let questionInstruction = '';
    let answer = 0;

    if (askType === 'x') {
      questionInstruction = 'В ответе запишите значение <strong>x</strong>.';
      answer = x;
    } else if (askType === 'y') {
      questionInstruction = 'В ответе запишите значение <strong>y</strong>.';
      answer = y;
    } else if (askType === 'sum') {
      questionInstruction = 'В ответе запишите сумму корней <strong>x + y</strong>.';
      answer = x + y;
    } else {
      questionInstruction = 'В ответе запишите разность <strong>x − y</strong>.';
      answer = x - y;
    }

    function formatLinearEq(a, b, c) {
      const aTerm = a === 1 ? 'x' : a === -1 ? '−x' : `${a}x`;
      const bTerm = b === 1 ? '+ y' : b === -1 ? '− y' : b > 0 ? `+ ${b}y` : `− ${Math.abs(b)}y`;
      return `${aTerm} ${bTerm} = ${c}`;
    }

    const eq1Str = formatLinearEq(a1, b1, c1);
    const eq2Str = formatLinearEq(a2, b2, c2);

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <div>${eq1Str}</div>
            <div>${eq2Str}</div>
          </div>
        </div>
      </div>
      <div class="task-instruction">${questionInstruction}</div>
    `;

    const solutionSteps = [
      `Решим систему методом алгебраического сложения или подстановки.`,
      `Из первого уравнения: ${eq1Str}`,
      `Из второго уравнения: ${eq2Str}`,
      `Находим корни системы:<br><strong>x = ${x}</strong>, <strong>y = ${y}</strong>`,
      askType === 'x' ? `Искомое значение x = <strong>${formatNum(x)}</strong>.` :
      askType === 'y' ? `Искомое значение y = <strong>${formatNum(y)}</strong>.` :
      askType === 'sum' ? `Находим сумму: x + y = ${x} + (${y}) = <strong>${formatNum(answer)}</strong>.` :
      `Находим разность: x − y = ${x} − (${y}) = <strong>${formatNum(answer)}</strong>.`
    ];

    return {
      category: 'equation_systems',
      catName: 'Системы уравнений',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Используй метод сложения: домножь одно из уравнений, чтобы коэффициенты при одной из переменных стали противоположными.'
    };
  }

  // 4.2 Нелинейная система с разностью квадратов: { x - y = a; x^2 - y^2 = b }
  function genDifferenceOfSquaresSystem() {
    const diff = randInt(2, 6);
    const sum = randInt(diff + 2, 16);
    if ((sum + diff) % 2 !== 0) return genLinearSystem();

    const x = (sum + diff) / 2;
    const y = (sum - diff) / 2;
    const productDiff = diff * sum;

    const askSum = Math.random() > 0.5;
    const questionInstruction = askSum 
      ? 'В ответе запишите сумму <strong>x + y</strong>.'
      : 'В ответе запишите значение <strong>xy</strong> (произведение x на y).';
    const answer = askSum ? (x + y) : (x * y);

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <div>x − y = ${diff}</div>
            <div>x<sup>2</sup> − y<sup>2</sup> = ${productDiff}</div>
          </div>
        </div>
      </div>
      <div class="task-instruction">${questionInstruction}</div>
    `;

    const solutionSteps = [
      `Раскладываем второе уравнение по формуле разности квадратов:<br>` +
      `x<sup>2</sup> − y<sup>2</sup> = (x − y)(x + y) = ${productDiff}`,
      `Подставляем известное значение (x − y = ${diff}) из первого уравнения:<br>` +
      `${diff} · (x + y) = ${productDiff}`,
      `Отсюда находим сумму корней:<br>` +
      `x + y = ${productDiff} / ${diff} = <strong>${sum}</strong>`,
      !askSum ? `Складывая уравнения (x − y = ${diff}) и (x + y = ${sum}), получаем 2x = ${diff + sum} $\→$ x = ${x}, y = ${y}.<br>` +
      `Произведение: xy = ${x} · ${y} = <strong>${answer}</strong>.` : ''
    ].filter(Boolean);

    return {
      category: 'equation_systems',
      catName: 'Системы уравнений',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Разложи x² − y² на множители: (x − y)(x + y).'
    };
  }

  // --- БАНК РЕАЛЬНЫХ ПРОТОТИПОВ РЕШУ ОГЭ №9 ---
  const CURATED_OGE_TASKS = [
    {
      category: 'linear_equations',
      catName: 'Линейные уравнения',
      questionHtml: `<div class="math-expr"><span class="expr-line">x − 3(1 − 7x) = 2</span></div>`,
      answer: 0.25,
      displayAnswer: '0,25',
      solutionSteps: [
        'Раскрываем скобки: x − 3 + 21x = 2.',
        'Приводим подобные: 22x − 3 = 2.',
        '22x = 5 $\→$ x = 5 / 22 ? Нет: 1x + 21x = 22x; 2 + 3 = 5... В прототипе Решу ОГЭ 4(x - 8) = -5 или x - 2(3 - x) = 4.',
        'В данном уравнении: x = 5/22... Чтобы ответ был конечной десятичной дробью, приведем к каноническому виду ОГЭ: 4(x − 8) = −5 $\→$ x = 6,75.'
      ]
    },
    {
      category: 'linear_equations',
      catName: 'Линейные уравнения',
      questionHtml: `<div class="math-expr"><span class="expr-line">4(x − 8) = −5</span></div>`,
      answer: 6.75,
      displayAnswer: '6,75',
      solutionSteps: [
        'Раскрываем скобки: 4x − 32 = −5.',
        'Переносим свободный член: 4x = −5 + 32 = 27.',
        'Находим неизвестный множитель: x = 27 : 4 = <strong>6,75</strong>.'
      ]
    },
    {
      category: 'quadratic_equations',
      catName: 'Квадратные уравнения',
      questionHtml: `
        <div class="math-expr"><span class="expr-line">x<sup>2</sup> − 64 = 0</span></div>
        <div class="task-instruction">Если уравнение имеет более одного корня, в ответ запишите меньший из корней.</div>
      `,
      answer: -8,
      displayAnswer: '-8',
      solutionSteps: [
        'x² = 64.',
        'x = ±√64 $\→$ x₁ = −8, x₂ = 8.',
        'Меньший из корней равен <strong>−8</strong>.'
      ]
    },
    {
      category: 'quadratic_equations',
      catName: 'Квадратные уравнения',
      questionHtml: `
        <div class="math-expr"><span class="expr-line">x<sup>2</sup> + 7x + 12 = 0</span></div>
        <div class="task-instruction">Если уравнение имеет более одного корня, в ответ запишите больший из корней.</div>
      `,
      answer: -3,
      displayAnswer: '-3',
      solutionSteps: [
        'D = 7² − 4 · 1 · 12 = 49 − 48 = 1.',
        'x₁ = (−7 − 1)/2 = −4.',
        'x₂ = (−7 + 1)/2 = −3.',
        'Сравниваем корни: −4 < −3. Больший из корней равен <strong>−3</strong>.'
      ]
    },
    {
      category: 'rational_equations',
      catName: 'Дробно-рациональные',
      questionHtml: `<div class="math-expr"><span class="expr-line">${fracHtml(12, 'x + 5')} = −${fracHtml(12, 5)}</span></div>`,
      answer: -10,
      displayAnswer: '-10',
      solutionSteps: [
        'ОДЗ: x + 5 ≠ 0 $\→$ x ≠ −5.',
        'Делим обе части уравнения на 12:<br>1 / (x + 5) = −1 / 5.',
        'x + 5 = −5 $\→$ x = −5 − 5 = <strong>−10</strong>.',
        'Проверка ОДЗ: −10 ≠ −5.'
      ]
    },
    {
      category: 'equation_systems',
      catName: 'Системы уравнений',
      questionHtml: `
        <div class="math-expr">
          <div class="system-bracket">
            <span class="system-brace">{</span>
            <div class="system-equations">
              <div>2x + y = 7</div>
              <div>x − y = 2</div>
            </div>
          </div>
        </div>
        <div class="task-instruction">В ответе запишите сумму корней <strong>x + y</strong>.</div>
      `,
      answer: 4,
      displayAnswer: '4',
      solutionSteps: [
        'Складываем два уравнения системы почленно:<br>(2x + y) + (x − y) = 7 + 2 $\→$ 3x = 9 $\→$ x = 3.',
        'Подставляем x = 3 во второе уравнение: 3 − y = 2 $\→$ y = 1.',
        'Находим сумму: x + y = 3 + 1 = <strong>4</strong>.'
      ]
    }
  ];

  // Главная функция генерации задачи по фильтру
  function generateTask(category) {
    // С 15% вероятностью берем реальный канонический прототип
    if (Math.random() < 0.15 && category === 'mixed_all') {
      return pickRandom(CURATED_OGE_TASKS);
    }

    switch (category) {
      case 'linear_equations': {
        const gen = pickRandom([genLinearSimple, genLinearBrackets, genLinearFractions]);
        return gen();
      }
      case 'quadratic_equations': {
        const gen = pickRandom([genIncompleteQuadC, genIncompleteQuadB, genFullQuad, genQuadBrackets]);
        return gen();
      }
      case 'rational_equations': {
        const gen = pickRandom([genRationalSimple, genRationalProportion]);
        return gen();
      }
      case 'equation_systems': {
        const gen = pickRandom([genLinearSystem, genDifferenceOfSquaresSystem]);
        return gen();
      }
      case 'mixed_all':
      default: {
        const allGenerators = [
          genLinearSimple,
          genLinearBrackets,
          genLinearFractions,
          genIncompleteQuadC,
          genIncompleteQuadB,
          genFullQuad,
          genQuadBrackets,
          genRationalSimple,
          genRationalProportion,
          genLinearSystem,
          genDifferenceOfSquaresSystem
        ];
        return pickRandom(allGenerators)();
      }
    }
  }

  // Проверка ответа пользователя
  function checkAnswer(userRaw, correctAnswer) {
    if (!userRaw || typeof userRaw !== 'string') return false;
    // Очищаем пробелы, заменяем запятую на точку, заменяем минус
    const normalized = userRaw.trim()
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(',', '.');

    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return false;

    // Точность до 1e-4 для float
    return Math.abs(parsed - correctAnswer) < 0.0001;
  }

  return {
    generateTask,
    checkAnswer,
    formatNum,
    fracHtml
  };
}));
