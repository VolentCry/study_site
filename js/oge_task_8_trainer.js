/**
 * Тренажёр ОГЭ по математике · Задание №8
 * «Вычисления и преобразования выражений: степени и квадратные корни»
 * Согласовано с банком заданий ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask8Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatNum(n) {
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function sqrtHtml(content) {
    return `<span class="rad-wrap"><span class="rad-sym">√</span><span class="rad-body">${content}</span></span>`;
  }

  // 1. Свойства степеней: числовые выражения
  function genPowersNumerical() {
    const templates = [
      () => {
        // (b^p * b^q) / b^r = b^(p+q-r)
        const base = pickRandom([2, 3, 5]);
        const targetExp = randInt(1, 4);
        const r = randInt(5, 12);
        const sumPQ = r + targetExp;
        const p = randInt(3, sumPQ - 2);
        const q = sumPQ - p;
        const ans = Math.pow(base, targetExp);

        return {
          questionHtml: `<div class="math-expr">${fracHtml(`${base}<sup>${p}</sup> · ${base}<sup>${q}</sup>`, `${base}<sup>${r}</sup>`)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. При умножении степеней с одинаковым основанием показатели складываются:<br>` +
            `${base}<sup>${p}</sup> · ${base}<sup>${q}</sup> = ${base}<sup>${p} + ${q}</sup> = ${base}<sup>${sumPQ}</sup>.`,
            `2. При делении степеней с одинаковым основанием показатель знаменателя вычитается:<br>` +
            `${fracHtml(`${base}<sup>${sumPQ}</sup>`, `${base}<sup>${r}</sup>`)} = ${base}<sup>${sumPQ} − ${r}</sup> = ${base}<sup>${targetExp}</sup>.`,
            `3. Возводим число в степень: ${base}<sup>${targetExp}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Используй свойства aᵐ · aⁿ = aᵐ⁺ⁿ и aᵐ / aⁿ = aᵐ⁻ⁿ.'
        };
      },
      () => {
        // (base^m)^n * base^k = base^(m*n + k)
        const base = pickRandom([2, 3, 4]);
        const targetExp = randInt(1, 3);
        const m = pickRandom([-4, -3, -2, 2, 3]);
        const n = randInt(2, 4);
        const mn = m * n;
        const k = targetExp - mn;
        const ans = Math.pow(base, targetExp);

        return {
          questionHtml: `<div class="math-expr">(${base}<sup>${m}</sup>)<sup>${n}</sup> · ${base}<sup>${k}</sup></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. При возведении степени в степень показатели перемножаются:<br>` +
            `(${base}<sup>${m}</sup>)<sup>${n}</sup> = ${base}<sup>${m} · ${n}</sup> = ${base}<sup>${mn}</sup>.`,
            `2. При умножении степеней показатели складываются:<br>` +
            `${base}<sup>${mn}</sup> · ${base}<sup>${k}</sup> = ${base}<sup>${mn} + (${k})</sup> = ${base}<sup>${targetExp}</sup>.`,
            `3. Вычисляем: ${base}<sup>${targetExp}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Сначала раскрой скобки: (aᵐ)ⁿ = aᵐ·ⁿ, затем сложи показатели степеней.'
        };
      },
      () => {
        // (base^p)^q / base^r с отрицательными степенями
        const base = pickRandom([2, 3, 5]);
        const targetExp = randInt(1, 3);
        const p = randInt(2, 4);
        const q = pickRandom([-3, -2, 2, 3]);
        const pq = p * q;
        const r = pq - targetExp;
        const ans = Math.pow(base, targetExp);

        return {
          questionHtml: `<div class="math-expr">${fracHtml(`(${base}<sup>${p}</sup>)<sup>${q}</sup>`, `${base}<sup>${r}</sup>`)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Раскрываем скобки в числителе: (${base}<sup>${p}</sup>)<sup>${q}</sup> = ${base}<sup>${p} · (${q})</sup> = ${base}<sup>${pq}</sup>.`,
            `2. Делим степени: ${base}<sup>${pq}</sup> / ${base}<sup>${r}</sup> = ${base}<sup>${pq} − (${r})</sup> = ${base}<sup>${targetExp}</sup>.`,
            `3. Результат: ${base}<sup>${targetExp}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Внимательно следи за знаками при вычитании отрицательного показателя: a − (-b) = a + b.'
        };
      }
    ];

    const res = pickRandom(templates)();
    res.category = 'powers_numerical';
    res.catName = 'Свойства степеней (числовые)';
    return res;
  }

  // 2. Алгебраические выражения со степенями при a = k
  function genPowersAlgebraic() {
    const variants = [
      () => {
        // (a^m * a^n) / a^k при a = val
        const val = pickRandom([2, 3, 4, 5]);
        const targetExp = randInt(2, 3);
        const k = randInt(4, 9);
        const sumMN = k + targetExp;
        const m = randInt(5, sumMN + 3);
        const n = sumMN - m; // может быть отрицательным
        const ans = Math.pow(val, targetExp);

        const numExpr = n < 0 ? `a<sup>${m}</sup> · a<sup>${n}</sup>` : `a<sup>${m}</sup> · a<sup>${n}</sup>`;

        return {
          questionHtml: `<div class="math-expr">${fracHtml(numExpr, `a<sup>${k}</sup>`)} <span class="math-cond">при a = ${val}</span></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Сначала упрощаем алгебраическое выражение со степенями (не подставляя сразу число):<br>` +
            `В числителе: a<sup>${m}</sup> · a<sup>${n}</sup> = a<sup>${m} + (${n})</sup> = a<sup>${sumMN}</sup>.`,
            `2. Делим на знаменатель: a<sup>${sumMN}</sup> / a<sup>${k}</sup> = a<sup>${sumMN} − ${k}</sup> = a<sup>${targetExp}</sup>.`,
            `3. Теперь подставляем значение a = ${val}:<br>` +
            `${val}<sup>${targetExp}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Сначала упрости выражение буквенно по свойствам степеней, и только в конце подставь число!'
        };
      },
      () => {
        // (a^m)^n / a^k при a = val
        const val = pickRandom([2, 3, 4, 5]);
        const targetExp = randInt(2, 3);
        const m = randInt(2, 4);
        const n = randInt(3, 5);
        const mn = m * n;
        const k = mn - targetExp;
        const ans = Math.pow(val, targetExp);

        return {
          questionHtml: `<div class="math-expr">${fracHtml(`(a<sup>${m}</sup>)<sup>${n}</sup>`, `a<sup>${k}</sup>`)} <span class="math-cond">при a = ${val}</span></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Упрощаем числитель: (a<sup>${m}</sup>)<sup>${n}</sup> = a<sup>${m} · ${n}</sup> = a<sup>${mn}</sup>.`,
            `2. Делим степени: a<sup>${mn}</sup> / a<sup>${k}</sup> = a<sup>${mn} − ${k}</sup> = a<sup>${targetExp}</sup>.`,
            `3. Подставляем a = ${val}: ${val}<sup>${targetExp}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Упрости показатели степеней до одного aⁿ, а затем подставь значение переменной.'
        };
      },
      () => {
        // (a^7 * b^5) / (a * b)^5 = a^2
        const aVal = randInt(3, 8);
        const bVal = randInt(2, 9);
        const p = randInt(6, 9);
        const q = randInt(3, 5);
        const diff = p - q;
        const ans = Math.pow(aVal, diff);

        return {
          questionHtml: `<div class="math-expr">${fracHtml(`a<sup>${p}</sup> · b<sup>${q}</sup>`, `(a · b)<sup>${q}</sup>`)} <span class="math-cond">при a = ${aVal}, b = ${bVal}</span></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Раскрываем степень произведения в знаменателе: (a · b)<sup>${q}</sup> = a<sup>${q}</sup> · b<sup>${q}</sup>.`,
            `2. Получаем дробь: ${fracHtml(`a<sup>${p}</sup> · b<sup>${q}</sup>`, `a<sup>${q}</sup> · b<sup>${q}</sup>`)}.`,
            `3. Сокращаем на b<sup>${q}</sup>: остаётся a<sup>${p} − ${q}</sup> = a<sup>${diff}</sup> (переменная b полностью сократилась!).`,
            `4. Подставляем a = ${aVal}: ${aVal}<sup>${diff}</sup> = <strong>${ans}</strong>.`
          ],
          hint: 'Заметь, что (ab)ⁿ = aⁿbⁿ, и переменная b полностью сокращается.'
        };
      }
    ];

    const res = pickRandom(variants)();
    res.category = 'powers_algebraic';
    res.catName = 'Буквенные степени';
    return res;
  }

  // 3. Вычисления с квадратными корнями
  function genRootsNumerical() {
    const list = [
      () => {
        // sqrt(a) * sqrt(b)
        const pairs = [
          { a: 18, b: 2, prod: 36, ans: 6 },
          { a: 12, b: 75, prod: 900, ans: 30 },
          { a: 8, b: 50, prod: 400, ans: 20 },
          { a: 27, b: 3, prod: 81, ans: 9 },
          { a: 32, b: 2, prod: 64, ans: 8 },
          { a: 20, b: 5, prod: 100, ans: 10 },
          { a: 45, b: 5, prod: 225, ans: 15 },
          { a: 72, b: 2, prod: 144, ans: 12 }
        ];
        const item = pickRandom(pairs);

        return {
          questionHtml: `<div class="math-expr">${sqrtHtml(item.a)} · ${sqrtHtml(item.b)}</div>`,
          answer: item.ans,
          displayAnswer: formatNum(item.ans),
          solutionSteps: [
            `1. По свойству квадратного корня произведение корней равно корню из произведения:<br>` +
            `${sqrtHtml(item.a)} · ${sqrtHtml(item.b)} = ${sqrtHtml(`${item.a} · ${item.b}`)}.`,
            `2. Перемножаем подкоренные выражения: ${item.a} · ${item.b} = ${item.prod}.`,
            `3. Извлекаем корень: ${sqrtHtml(item.prod)} = <strong>${item.ans}</strong>.`
          ],
          hint: 'Объедини под один общий корень: √a · √b = √(a · b).'
        };
      },
      () => {
        // sqrt(a) / sqrt(b)
        const pairs = [
          { a: 48, b: 3, quot: 16, ans: 4 },
          { a: 75, b: 3, quot: 25, ans: 5 },
          { a: 180, b: 5, quot: 36, ans: 6 },
          { a: 98, b: 2, quot: 49, ans: 7 },
          { a: 128, b: 2, quot: 64, ans: 8 },
          { a: 243, b: 3, quot: 81, ans: 9 }
        ];
        const item = pickRandom(pairs);

        return {
          questionHtml: `<div class="math-expr">${fracHtml(sqrtHtml(item.a), sqrtHtml(item.b))}</div>`,
          answer: item.ans,
          displayAnswer: formatNum(item.ans),
          solutionSteps: [
            `1. По свойству корня частное корней равно корню из частного:<br>` +
            `${fracHtml(sqrtHtml(item.a), sqrtHtml(item.b))} = ${sqrtHtml(fracHtml(item.a, item.b))}.`,
            `2. Выполняем деление под корнем: ${item.a} / ${item.b} = ${item.quot}.`,
            `3. Извлекаем корень: ${sqrtHtml(item.quot)} = <strong>${item.ans}</strong>.`
          ],
          hint: 'Занеси числитель и знаменатель под один общий знак корня: √a / √b = √(a/b).'
        };
      },
      () => {
        // sqrt(a * b) * sqrt(c * d) со степенями
        const p = pickRandom([2, 3]);
        const m = randInt(1, 2) * 2; // четная степень: 2 или 4
        const q = pickRandom([2, 5]);
        const n = randInt(1, 2) * 2; // четная степень
        const aVal = Math.pow(p, m);
        const bVal = Math.pow(q, n);
        const baseK = pickRandom([3, 7, 5]);

        const expr1 = `${baseK} · ${p}<sup>${m}</sup>`;
        const expr2 = `${baseK} · ${q}<sup>${n}</sup>`;
        const ans = baseK * Math.pow(p, m / 2) * Math.pow(q, n / 2);

        return {
          questionHtml: `<div class="math-expr">${sqrtHtml(expr1)} · ${sqrtHtml(expr2)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Записываем произведение под одним знаком корня:<br>` +
            `${sqrtHtml(`(${baseK} · ${p}<sup>${m}</sup>) · (${baseK} · ${q}<sup>${n}</sup>)`)} = ` +
            `${sqrtHtml(`${baseK}² · ${p}<sup>${m}</sup> · ${q}<sup>${n}</sup>`)}.`,
            `2. Извлекаем корень из каждого множителя (деля показатели степеней на 2):<br>` +
            `√(${baseK}²) = ${baseK}, &emsp; √(${p}<sup>${m}</sup>) = ${p}<sup>${m/2}</sup> = ${Math.pow(p, m/2)}, &emsp; √(${q}<sup>${n}</sup>) = ${q}<sup>${n/2}</sup> = ${Math.pow(q, n/2)}.`,
            `3. Перемножаем полученные числа: ${baseK} · ${Math.pow(p, m/2)} · ${Math.pow(q, n/2)} = <strong>${ans}</strong>.`
          ],
          hint: 'Объедини под один корень, сгруппируй одинаковые множители в квадраты и извлеки корень.'
        };
      }
    ];

    const res = pickRandom(list)();
    res.category = 'roots_numerical';
    res.catName = 'Вычисления с корнями';
    return res;
  }

  // 4. Формулы сокращенного умножения (ФСУ) с корнями
  function genRootsFSU() {
    const list = [
      () => {
        // (sqrt(a) - b)(sqrt(a) + b) = a - b^2
        const b = randInt(2, 6);
        const bSq = b * b;
        const a = bSq + randInt(3, 15);
        const ans = a - bSq;

        return {
          questionHtml: `<div class="math-expr">(${sqrtHtml(a)} − ${b})(${sqrtHtml(a)} + ${b})</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Узнаём формулу разности квадратов: (x − y)(x + y) = x² − y².`,
            `2. Подставляем x = ${sqrtHtml(a)} и y = ${b}:<br>` +
            `(${sqrtHtml(a)})² − ${b}² = ${a} − ${bSq}.`,
            `3. Вычисляем результат: ${a} − ${bSq} = <strong>${ans}</strong>.`
          ],
          hint: 'Примени формулу разности квадратов: (√a − b)(√a + b) = a − b².'
        };
      },
      () => {
        // (sqrt(a) - sqrt(b))(sqrt(a) + sqrt(b)) = a - b
        const b = randInt(2, 9);
        const a = b + randInt(5, 20);
        const ans = a - b;

        return {
          questionHtml: `<div class="math-expr">(${sqrtHtml(a)} − ${sqrtHtml(b)})(${sqrtHtml(a)} + ${sqrtHtml(b)})</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Применяем формулу разности квадратов (√x − √y)(√x + √y) = (√x)² − (√y)²:`,
            `2. (${sqrtHtml(a)})² − (${sqrtHtml(b)})² = ${a} − ${b}.`,
            `3. Получаем: <strong>${ans}</strong>.`
          ],
          hint: 'Разность квадратов двух корней даёт просто разность чисел: (√a − √b)(√a + √b) = a − b.'
        };
      },
      () => {
        // (sqrt(a) + b)^2 - 2*b*sqrt(a) = a + b^2
        const b = randInt(2, 5);
        const a = randInt(5, 19);
        const doubleProd = 2 * b;
        const ans = a + b * b;

        return {
          questionHtml: `<div class="math-expr">(${sqrtHtml(a)} + ${b})² − ${doubleProd}${sqrtHtml(a)}</div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Раскрываем квадрат суммы по формуле (x + y)² = x² + 2xy + y²:<br>` +
            `(${sqrtHtml(a)} + ${b})² = (${sqrtHtml(a)})² + 2 · ${b} · ${sqrtHtml(a)} + ${b}² = ${a} + ${doubleProd}${sqrtHtml(a)} + ${b * b}.`,
            `2. Записываем всё выражение целиком:<br>` +
            `${a} + ${doubleProd}${sqrtHtml(a)} + ${b * b} − ${doubleProd}${sqrtHtml(a)}.`,
            `3. Взаимно уничтожаем иррациональные слагаемые (+${doubleProd}${sqrtHtml(a)} и −${doubleProd}${sqrtHtml(a)}):<br>` +
            `${a} + ${b * b} = <strong>${ans}</strong>.`
          ],
          hint: 'Раскрой скобки по формуле квадрата суммы, иррациональные слагаемые с корнем взаимно уничтожатся!'
        };
      }
    ];

    const res = pickRandom(list)();
    res.category = 'roots_fsu';
    res.catName = 'ФСУ с корнями';
    return res;
  }

  // 5. Алгебраические выражения с корнями и переменными
  function genRootsAlgebraic() {
    const list = [
      () => {
        // sqrt(a^6 * b^4) = a^3 * b^2
        const a = randInt(2, 4);
        const b = randInt(2, 5);
        const p = 6;
        const q = 4;
        const ans = Math.pow(a, p / 2) * Math.pow(b, q / 2);

        return {
          questionHtml: `<div class="math-expr">${sqrtHtml(`a<sup>${p}</sup> · b<sup>${q}</sup>`)} <span class="math-cond">при a = ${a}, b = ${b}</span></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Извлекаем корень из каждого множителя (делим показатели чётных степеней на 2):<br>` +
            `√(a<sup>${p}</sup>) = a<sup>${p/2}</sup>, &emsp; √(b<sup>${q}</sup>) = b<sup>${q/2}</sup>.`,
            `2. Получаем упрощённое выражение: a<sup>${p/2}</sup> · b<sup>${q/2}</sup>.`,
            `3. Подставляем значения переменных a = ${a}, b = ${b}:<br>` +
            `${a}<sup>${p/2}</sup> · ${b}<sup>${q/2}</sup> = ${Math.pow(a, p/2)} · ${Math.pow(b, q/2)} = <strong>${ans}</strong>.`
          ],
          hint: 'Корень из чётной степени извлекается делением показателя на 2: √(x²ⁿ) = xⁿ.'
        };
      },
      () => {
        // sqrt(1/d^2 * a^4 * b^6)
        const d = pickRandom([2, 4, 5]);
        const a = d;
        const b = randInt(2, 3);
        const p = 4;
        const q = 6;
        const dSq = d * d;
        const ans = (1 / d) * Math.pow(a, 2) * Math.pow(b, 3);

        return {
          questionHtml: `<div class="math-expr">${sqrtHtml(`${fracHtml(1, dSq)} · a<sup>${p}</sup> · b<sup>${q}</sup>`)} <span class="math-cond">при a = ${a}, b = ${b}</span></div>`,
          answer: ans,
          displayAnswer: formatNum(ans),
          solutionSteps: [
            `1. Извлекаем корень из числового коэффициента: √(${fracHtml(1, dSq)}) = ${fracHtml(1, d)}.`,
            `2. Извлекаем корень из степеней: √(a<sup>${p}</sup>) = a<sup>2</sup>, &emsp; √(b<sup>${q}</sup>) = b<sup>3</sup>.`,
            `3. Получаем: ${fracHtml(1, d)} · a² · b³.`,
            `4. Подставляем a = ${a}, b = ${b}:<br>` +
            `${fracHtml(1, d)} · ${a * a} · ${Math.pow(b, 3)} = ${a} · ${Math.pow(b, 3)} = <strong>${ans}</strong>.`
          ],
          hint: 'Извлеки корень из дроби и буквенных множителей по отдельности.'
        };
      }
    ];

    const res = pickRandom(list)();
    res.category = 'roots_algebraic';
    res.catName = 'Выражения с корнями';
    return res;
  }

  // Главная функция генерации задачи
  function generateTask(category) {
    switch (category) {
      case 'powers_numerical':
        return genPowersNumerical();
      case 'powers_algebraic':
        return genPowersAlgebraic();
      case 'roots_numerical':
        return genRootsNumerical();
      case 'roots_fsu':
        return genRootsFSU();
      case 'roots_algebraic':
        return genRootsAlgebraic();
      case 'mixed_all':
      default: {
        const generators = [
          genPowersNumerical,
          genPowersAlgebraic,
          genRootsNumerical,
          genRootsFSU,
          genRootsAlgebraic
        ];
        return pickRandom(generators)();
      }
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (!userRaw || typeof userRaw !== 'string') return false;
    const normalized = userRaw.trim().replace(/\s+/g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - correctAnswer) < 0.0001;
  }

  return {
    generateTask,
    checkAnswer,
    formatNum,
    fracHtml,
    sqrtHtml
  };
}));
