/**
 * Тренажёр ОГЭ по математике · Задание №6
 * «Числа и вычисления: обыкновенные, десятичные и смешанные дроби»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask6Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Вспомогательные математические функции
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
    // Округляем до 6 знаков для устранения погрешностей float
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

  // --- ГЕНЕРАТОРЫ И БАНК ПРОТОТИПОВ ЗАДАНИЙ №6 ---

  // 1. Обыкновенные дроби: сложение и вычитание со знаменателями, дающими десятичный ответ
  function genCommonAddSub() {
    // Подбираем знаменатели из {2, 4, 5, 8, 10, 16, 20, 25, 40, 50}
    const denoms = [
      [4, 5], [5, 4], [4, 25], [20, 25], [8, 5], [10, 4],
      [2, 5], [25, 4], [40, 25], [50, 4], [8, 25]
    ];
    const pair = pickRandom(denoms);
    const d1 = pair[0];
    const d2 = pair[1];
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const isAdd = Math.random() > 0.45;
    const op = isAdd ? '+' : '−';

    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;
    const resNum = isAdd ? (n1 * m1 + n2 * m2) : (n1 * m1 - n2 * m2);
    const g = gcd(resNum, commonDen);
    const simpNum = resNum / g;
    const simpDen = commonDen / g;
    const answer = resNum / commonDen;

    const questionHtml = `<div class="math-expr">${fracHtml(n1, d1)} ${op} ${fracHtml(n2, d2)}</div>`;
    const solutionSteps = [
      `Находим наименьший общий знаменатель для чисел ${d1} и ${d2}: НОЗ = ${commonDen}.`,
      `Домножаем первую дробь на ${m1}, а вторую на ${m2}:<br>` +
      `${fracHtml(n1 * m1, commonDen)} ${op} ${fracHtml(n2 * m2, commonDen)} = ${fracHtml(resNum, commonDen)}.`,
      simpDen !== commonDen ? `Сокращаем дробь на ${g}: ${fracHtml(simpNum, simpDen)}.` : '',
      `Переводим обыкновенную дробь в десятичную: ${resNum} : ${commonDen} = <strong>${formatNum(answer)}</strong>.`
    ].filter(Boolean);

    return {
      category: 'common_fractions',
      catName: 'Обыкновенные дроби',
      questionHtml,
      answer,
      displayAnswer: formatNum(answer),
      solutionSteps,
      hint: 'Приведи дроби к общему знаменателю и выполни действие в числителе.'
    };
  }

  // 2. Обыкновенные дроби со скобками и умножением/делением
  function genCommonBrackets() {
    // Прототип из ОГЭ: (a/b + c/d) * k или (a/b - c/d) : m/n
    const templates = [
      () => {
        // (3/4 + 1/6) * 3 = 11/12 * 3 = 11/4 = 2.75
        const base = pickRandom([
          { n1: 3, d1: 4, n2: 1, d2: 6, isAdd: true, k: 3 },
          { n1: 5, d1: 6, n2: 1, d2: 4, isAdd: false, k: 6 },
          { n1: 7, d1: 12, n2: 1, d2: 4, isAdd: false, k: 6 },
          { n1: 2, d1: 5, n2: 3, d2: 4, isAdd: true, k: 2 },
          { n1: 9, d1: 10, n2: 2, d2: 5, isAdd: false, k: 5 },
          { n1: 1, d1: 3, n2: 1, d2: 5, isAdd: true, k: 15 }
        ]);
        const commonDen = lcm(base.d1, base.d2);
        const m1 = commonDen / base.d1;
        const m2 = commonDen / base.d2;
        const sumNum = base.isAdd ? (base.n1 * m1 + base.n2 * m2) : (base.n1 * m1 - base.n2 * m2);
        const op = base.isAdd ? '+' : '−';
        const prodNum = sumNum * base.k;
        const g = gcd(prodNum, commonDen);
        const ans = prodNum / commonDen;

        return {
          questionHtml: `<div class="math-expr">(${fracHtml(base.n1, base.d1)} ${op} ${fracHtml(base.n2, base.d2)}) · ${base.k}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Сначала считаем выражение в скобках:<br>` +
            `${fracHtml(base.n1, base.d1)} ${op} ${fracHtml(base.n2, base.d2)} = ` +
            `${fracHtml(base.n1 * m1, commonDen)} ${op} ${fracHtml(base.n2 * m2, commonDen)} = ${fracHtml(sumNum, commonDen)}.`,
            `2. Умножаем полученную дробь на ${base.k}:<br>` +
            `${fracHtml(sumNum, commonDen)} · ${base.k} = ${fracHtml(prodNum, commonDen)}` +
            (g > 1 ? ` = ${fracHtml(prodNum / g, commonDen / g)}` : '') + ` = <strong>${formatNum(ans)}</strong>.`
          ],
          hint: 'Сначала выполни сложение/вычитание в скобках, затем умножь на целое число.'
        };
      },
      () => {
        // (17/26 - 1/13) : 5/13 = 15/26 * 13/5 = 3/2 = 1.5
        const variants = [
          { n1: 17, d1: 26, n2: 1, d2: 13, n3: 5, d3: 13, ans: 1.5, sNum: 15, sDen: 26 },
          { n1: 19, d1: 24, n2: 1, d2: 6, n3: 5, d3: 8, ans: 1, sNum: 15, sDen: 24 },
          { n1: 11, d1: 15, n2: 1, d2: 5, n3: 4, d3: 5, ans: 0.666667 }, // exclude non-terminating
          { n1: 14, d1: 15, n2: 1, d2: 3, n3: 3, d3: 5, ans: 1.0, sNum: 9, sDen: 15 },
          { n1: 9, d1: 14, n2: 1, d2: 7, n3: 1, d3: 2, ans: 1.0, sNum: 7, sDen: 14 },
          { n1: 13, d1: 18, n2: 1, d2: 9, n3: 11, d3: 18, ans: 1.0, sNum: 11, sDen: 18 }
        ].filter(v => Math.round(v.ans * 100) / 100 === v.ans);
        const item = pickRandom(variants);
        return {
          questionHtml: `<div class="math-expr">(${fracHtml(item.n1, item.d1)} − ${fracHtml(item.n2, item.d2)}) : ${fracHtml(item.n3, item.d3)}</div>`,
          answer: item.ans,
          displayAnswer: formatNum(item.ans),
          solutionSteps: [
            `1. Считаем в скобках (общий знаменатель ${item.d1}):<br>` +
            `${fracHtml(item.n1, item.d1)} − ${fracHtml(item.n2 * (item.d1/item.d2), item.d1)} = ${fracHtml(item.sNum, item.sDen)}.`,
            `2. При делении на дробь переворачиваем вторую дробь (умножаем на обратную):<br>` +
            `${fracHtml(item.sNum, item.sDen)} : ${fracHtml(item.n3, item.d3)} = ${fracHtml(item.sNum, item.sDen)} · ${fracHtml(item.d3, item.n3)}.`,
            `3. Сокращаем множители и получаем ответ: <strong>${formatNum(item.ans)}</strong>.`
          ],
          hint: 'Деление на дробь заменяется умножением на обратную (перевёрнутую) дробь.'
        };
      }
    ];

    const res = pickRandom(templates)();
    res.category = 'common_fractions';
    res.catName = 'Дроби со скобками';
    return res;
  }

  // 3. Многоэтажные составные дроби
  function genMultistoryFractions() {
    const list = [
      {
        top: 1,
        d1: 18,
        d2: 12,
        op: '+',
        lcmVal: 36,
        m1: 2,
        m2: 3,
        sumNum: 5,
        ans: 7.2,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">${fracHtml(1, 18)} + ${fracHtml(1, 12)}</span></span></div>`
      },
      {
        top: 1,
        d1: 21,
        d2: 28,
        op: '−',
        lcmVal: 84,
        m1: 4,
        m2: 3,
        sumNum: 1,
        ans: 84,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">${fracHtml(1, 21)} − ${fracHtml(1, 28)}</span></span></div>`
      },
      {
        top: 1,
        d1: 36,
        d2: 45,
        op: '+',
        lcmVal: 180,
        m1: 5,
        m2: 4,
        sumNum: 9,
        ans: 20,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">${fracHtml(1, 36)} + ${fracHtml(1, 45)}</span></span></div>`
      },
      {
        top: 1,
        d1: 15,
        d2: 10,
        op: '+',
        lcmVal: 30,
        m1: 2,
        m2: 3,
        sumNum: 5,
        ans: 6,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">${fracHtml(1, 15)} + ${fracHtml(1, 10)}</span></span></div>`
      },
      {
        top: 1,
        d1: 12,
        d2: 20,
        op: '−',
        lcmVal: 60,
        m1: 5,
        m2: 3,
        sumNum: 2,
        ans: 30,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">${fracHtml(1, 12)} − ${fracHtml(1, 20)}</span></span></div>`
      },
      {
        top: 1.2,
        denExpr: '1 − ' + fracHtml(1, 3),
        denVal: '2/3',
        ans: 1.8,
        html: `<div class="math-expr"><span class="fraction"><span class="num">1,2</span><span class="den">1 − ${fracHtml(1, 3)}</span></span></div>`,
        customSteps: [
          `1. Вычисляем знаменатель: 1 − ${fracHtml(1, 3)} = ${fracHtml(3, 3)} − ${fracHtml(1, 3)} = ${fracHtml(2, 3)}.`,
          `2. Деление числа на дробь равносильно умножению на обратную дробь:<br>` +
          `1,2 : ${fracHtml(2, 3)} = 1,2 · ${fracHtml(3, 2)} = (1,2 · 3) / 2 = 3,6 / 2 = <strong>1,8</strong>.`
        ]
      },
      {
        top: 2.4,
        denExpr: '1 − ' + fracHtml(1, 5),
        denVal: '4/5',
        ans: 3,
        html: `<div class="math-expr"><span class="fraction"><span class="num">2,4</span><span class="den">1 − ${fracHtml(1, 5)}</span></span></div>`,
        customSteps: [
          `1. Вычисляем знаменатель: 1 − ${fracHtml(1, 5)} = ${fracHtml(4, 5)}.`,
          `2. 2,4 : ${fracHtml(4, 5)} = 2,4 · ${fracHtml(5, 4)} = 12 / 4 = <strong>3</strong>.`
        ]
      }
    ];

    const item = pickRandom(list);
    const steps = item.customSteps || [
      `1. Вычисляем знаменатель дроби: находим НОЗ(${item.d1}, ${item.d2}) = ${item.lcmVal}.<br>` +
      `${fracHtml(1, item.d1)} ${item.op} ${fracHtml(1, item.d2)} = ` +
      `${fracHtml(item.m1, item.lcmVal)} ${item.op} ${fracHtml(item.m2, item.lcmVal)} = ${fracHtml(item.sumNum, item.lcmVal)}.`,
      `2. Деление единицы на дробь переворачивает её:<br>` +
      `1 : ${fracHtml(item.sumNum, item.lcmVal)} = ${fracHtml(item.lcmVal, item.sumNum)} = ${item.lcmVal} / ${item.sumNum} = <strong>${formatNum(item.ans)}</strong>.`
    ];

    return {
      category: 'multistory_fractions',
      catName: 'Многоэтажные дроби',
      questionHtml: item.html,
      answer: item.ans,
      displayAnswer: formatNum(item.ans),
      solutionSteps: steps,
      hint: 'Сначала выполни действия в знаменателе, а затем раздели числитель на полученную дробь.'
    };
  }

  // 4. Десятичные дроби и порядок действий
  function genDecimalOperations() {
    const types = [
      () => {
        // a - b * c
        const b = randInt(12, 45) / 10;
        const c = pickRandom([0.5, 1.2, 1.5, 2.4, 0.8]);
        const prod = Math.round(b * c * 100) / 100;
        const a = (Math.round((prod + randInt(-30, 40) / 10) * 10) / 10) || 5.4;
        const ans = Math.round((a - prod) * 100) / 100;

        return {
          questionHtml: `<div class="math-expr">${formatNum(a)} − ${formatNum(b)} · ${formatNum(c)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. По правилу порядка действий сначала выполняем умножение:<br>` +
            `${formatNum(b)} · ${formatNum(c)} = ${formatNum(prod)}.`,
            `2. Затем выполняем вычитание:<br>` +
            `${formatNum(a)} − ${formatNum(prod)} = <strong>${formatNum(ans)}</strong>.`
          ],
          hint: 'Соблюдай приоритет арифметических операций: умножение выполняется раньше вычитания.'
        };
      },
      () => {
        // a / (b * c)
        const variants = [
          { a: 4.8, b: 0.4, c: 1.2, ans: 10 },
          { a: 2.1, b: 0.7, c: 1.5, ans: 2 },
          { a: 7.2, b: 0.8, c: 1.5, ans: 6 },
          { a: 5.4, b: 0.9, c: 1.2, ans: 5 },
          { a: 6.3, b: 0.7, c: 1.8, ans: 5 },
          { a: 3.6, b: 0.6, c: 1.5, ans: 4 },
          { a: 9.6, b: 1.6, c: 1.5, ans: 4 }
        ];
        const v = pickRandom(variants);
        const prod = Math.round(v.b * v.c * 100) / 100;
        return {
          questionHtml: `<div class="math-expr">${fracHtml(formatNum(v.a), `${formatNum(v.b)} · ${formatNum(v.c)}`)}</div>`,
          answer: v.ans,
          displayAnswer: formatNum(v.ans),
          solutionSteps: [
            `1. Считаем знаменатель: ${formatNum(v.b)} · ${formatNum(v.c)} = ${formatNum(prod)}.`,
            `2. Домножаем числитель и знаменатель на 100, избавляясь от запятых:<br>` +
            `${fracHtml(formatNum(v.a), formatNum(prod))} = ${fracHtml(v.a * 100, prod * 100)} = ${v.a * 100} / ${prod * 100} = <strong>${formatNum(v.ans)}</strong>.`
          ],
          hint: 'Умножь числитель и знаменатель на 10 или 100, чтобы избавиться от десятичных запятых.'
        };
      },
      () => {
        // (a - b) / c
        const c = pickRandom([0.4, 0.5, 0.8, 1.2, 1.5, 2.4, 2.5]);
        const k = randInt(2, 8);
        const numVal = Math.round(c * k * 10) / 10;
        const b = randInt(11, 45) / 10;
        const a = Math.round((numVal + b) * 10) / 10;
        const ans = k;

        return {
          questionHtml: `<div class="math-expr">${fracHtml(`${formatNum(a)} − ${formatNum(b)}`, formatNum(c))}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Выполняем вычитание в числителе: ${formatNum(a)} − ${formatNum(b)} = ${formatNum(numVal)}.`,
            `2. Делим числитель на знаменатель: ${formatNum(numVal)} : ${formatNum(c)} = ${numVal * 10} / ${c * 10} = <strong>${formatNum(ans)}</strong>.`
          ],
          hint: 'Сначала выполни действие в числителе дроби.'
        };
      }
    ];

    const res = pickRandom(types)();
    res.category = 'decimal_fractions';
    res.catName = 'Десятичные дроби';
    return res;
  }

  // 5. Степени 10 и смешанные действия
  function genPowersOfTenAndMixed() {
    const list = [
      () => {
        // (a * 10^p) * (b * 10^q)
        const a = pickRandom([1.6, 2.4, 3.5, 4.3, 5.2, 2.5]);
        const b = pickRandom([2, 3, 4, 5]);
        const p = pickRandom([-3, -2, -1]);
        const q = pickRandom([1, 2, 3, 4, 5]);
        const prodAB = Math.round(a * b * 10) / 10;
        const powerSum = p + q;
        const ans = Math.round(prodAB * Math.pow(10, powerSum) * 1000) / 1000;

        return {
          questionHtml: `<div class="math-expr">(${formatNum(a)} · 10<sup>${p}</sup>) · (${b} · 10<sup>${q}</sup>)</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Группируем числа и степени десяти отдельно:<br>` +
            `(${formatNum(a)} · ${b}) · (10<sup>${p}</sup> · 10<sup>${q}</sup>).`,
            `2. Перемножаем коэффициенты: ${formatNum(a)} · ${b} = ${formatNum(prodAB)}.`,
            `3. При умножении степеней с одинаковым основанием показатели складываются:<br>` +
            `10<sup>${p}</sup> · 10<sup>${q}</sup> = 10<sup>${p} + ${q}</sup> = 10<sup>${powerSum}</sup>.`,
            `4. Результат: ${formatNum(prodAB)} · 10<sup>${powerSum}</sup> = <strong>${formatNum(ans)}</strong>.`
          ],
          hint: 'Сгруппируй числовые коэффициенты отдельно, а степени десятки сложи по свойству 10ᵃ · 10ᵇ = 10ᵃ⁺ᵇ.'
        };
      },
      () => {
        // a / 10^p + b
        const a = pickRandom([4, 7, 12, 25, 48]);
        const p = pickRandom([1, 2, 3]);
        const b = pickRandom([0.3, 1.25, 0.45, 2.1, 0.05]);
        const val1 = a / Math.pow(10, p);
        const ans = Math.round((val1 + b) * 1000) / 1000;

        return {
          questionHtml: `<div class="math-expr">${fracHtml(a, `10<sup>${p}</sup>`)} + ${formatNum(b)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Записываем дробь со степенью десяти в виде десятичного числа:<br>` +
            `${fracHtml(a, `10<sup>${p}</sup>`)} = ${formatNum(val1)}.`,
            `2. Складываем десятичные числа: ${formatNum(val1)} + ${formatNum(b)} = <strong>${formatNum(ans)}</strong>.`
          ],
          hint: 'Замени деление на степень десятки переносом десятичной запятой влево.'
        };
      },
      () => {
        // Обыкновенная дробь + десятичная: 3/5 + 0.14
        const pairs = [
          { n: 3, d: 5, dec: 0.14, ans: 0.74 },
          { n: 1, d: 4, dec: 0.35, ans: 0.6 },
          { n: 7, d: 20, dec: 0.15, ans: 0.5 },
          { n: 9, d: 25, dec: 0.24, ans: 0.6 },
          { n: 3, d: 8, dec: 0.125, ans: 0.5 },
          { n: 4, d: 5, dec: 0.22, ans: 1.02 }
        ];
        const item = pickRandom(pairs);
        const decEquiv = item.n / item.d;

        return {
          questionHtml: `<div class="math-expr">${fracHtml(item.n, item.d)} + ${formatNum(item.dec)}</div>`,
          answer: item.ans,
          displayAnswer: formatNum(item.ans),
          solutionSteps: [
            `1. Переводим обыкновенную дробь в десятичную: ${fracHtml(item.n, item.d)} = ${item.n} : ${item.d} = ${formatNum(decEquiv)}.`,
            `2. Складываем десятичные дроби: ${formatNum(decEquiv)} + ${formatNum(item.dec)} = <strong>${formatNum(item.ans)}</strong>.`
          ],
          hint: 'Переведи обыкновенную дробь в десятичную, разделив числитель на знаменатель.'
        };
      }
    ];

    const res = pickRandom(list)();
    res.category = 'powers_of_ten_mixed';
    res.catName = 'Степени 10 и смешанные действия';
    return res;
  }

  // Главная функция генерации задачи по фильтру
  function generateTask(category) {
    switch (category) {
      case 'common_fractions':
        return Math.random() > 0.5 ? genCommonAddSub() : genCommonBrackets();
      case 'multistory_fractions':
        return genMultistoryFractions();
      case 'decimal_fractions':
        return genDecimalOperations();
      case 'powers_of_ten_mixed':
        return genPowersOfTenAndMixed();
      case 'mixed_all':
      default: {
        const generators = [
          genCommonAddSub,
          genCommonBrackets,
          genMultistoryFractions,
          genDecimalOperations,
          genPowersOfTenAndMixed
        ];
        return pickRandom(generators)();
      }
    }
  }

  // Проверка ответа пользователя
  function checkAnswer(userRaw, correctAnswer) {
    if (!userRaw || typeof userRaw !== 'string') return false;
    // Очищаем от пробелов, заменяем запятую на точку
    const normalized = userRaw.trim().replace(/\s+/g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return false;

    // Сравнение с допуском 1e-4 для float
    return Math.abs(parsed - correctAnswer) < 0.0001;
  }

  return {
    generateTask,
    checkAnswer,
    formatNum,
    fracHtml
  };
}));
