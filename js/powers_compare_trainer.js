/**
 * Тренажёр по математике · 4–5 класс
 * «Сравнение степеней: знаки <, >, =»
 *
 * Категории заданий:
 * 1. compare_same_base: Одинаковые основания (a^n vs a^m)
 * 2. compare_same_exp: Одинаковые показатели (a^n vs b^n)
 * 3. compare_calc: Вычисление и свойства степеней (разные основания и показатели, степени 2, 3, 5, 10, квадраты, кубы, равенства)
 * 4. compare_all: Все виды заданий (сбалансированный микс <, >, =)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PowersCompareTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- 1. ОДИНАКОВЫЕ ОСНОВАНИЯ (COMPARE SAME BASE) ---
  function genSameBaseTask() {
    // Выбираем знак намеренно для баланса: 40% <, 40% >, 20% =
    const signTarget = pickRandom(['<', '<', '>', '>', '=']);
    const a = randInt(2, 12);
    let n, m;

    if (signTarget === '=') {
      n = randInt(1, 9);
      m = n;
    } else if (signTarget === '<') {
      n = randInt(1, 8);
      m = n + randInt(1, 4);
    } else {
      m = randInt(1, 8);
      n = m + randInt(1, 4);
    }

    const leftVal = Math.pow(a, n);
    const rightVal = Math.pow(a, m);
    const ans = (n < m) ? '<' : (n > m ? '>' : '=');

    const leftHtml = `<span class="base">${a}</span><sup>${n}</sup>`;
    const rightHtml = `<span class="base">${a}</span><sup>${m}</sup>`;
    const leftText = `${a}^${n}`;
    const rightText = `${a}^${m}`;

    let signRuleText = '';
    if (ans === '=') {
      signRuleText = `Основания (${a}) и показатели (${n}) одинаковы, значит значения равны.`;
    } else if (ans === '<') {
      signRuleText = `Так как основание ${a} > 1, а показатель первой степени меньше (${n} < ${m}), то первое число меньше второго.`;
    } else {
      signRuleText = `Так как основание ${a} > 1, а показатель первой степени больше (${n} > ${m}), то первое число больше второго.`;
    }

    const solutionSteps = [
      `1. Обратим внимание на основания: оба числа имеют одинаковое основание <strong>${a}</strong>.`,
      `2. Сравним показатели степеней: <strong>${n}</strong> и <strong>${m}</strong>.`,
      `3. ${signRuleText}`,
      `4. Итоговое сравнение: <strong>${a}<sup>${n}</sup> ${ans} ${a}<sup>${m}</sup></strong>.`
    ];

    return {
      category: 'compare_same_base',
      catName: 'Одинаковые основания',
      prompt: 'Сравните значения со степенями и выберите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      leftText,
      rightText,
      leftVal,
      rightVal,
      answer: ans,
      displayAnswer: ans,
      questionHtml: `<div class="compare-display"><div class="compare-side">${leftHtml}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${rightHtml}</div></div>`,
      solutionSteps,
      hint: `Основание у чисел одно и то же (${a}). Сравни показатели: ${n} и ${m}.`
    };
  }

  // --- 2. ОДИНАКОВЫЕ ПОКАЗАТЕЛИ (COMPARE SAME EXPONENT) ---
  function genSameExpTask() {
    const signTarget = pickRandom(['<', '<', '>', '>', '=']);
    const n = randInt(2, 6);
    let a, b;

    if (signTarget === '=') {
      a = randInt(2, 15);
      b = a;
    } else if (signTarget === '<') {
      a = randInt(2, 14);
      b = a + randInt(1, 5);
    } else {
      b = randInt(2, 14);
      a = b + randInt(1, 5);
    }

    const leftVal = Math.pow(a, n);
    const rightVal = Math.pow(b, n);
    const ans = (a < b) ? '<' : (a > b ? '>' : '=');

    const leftHtml = `<span class="base">${a}</span><sup>${n}</sup>`;
    const rightHtml = `<span class="base">${b}</span><sup>${n}</sup>`;
    const leftText = `${a}^${n}`;
    const rightText = `${b}^${n}`;

    let signRuleText = '';
    if (ans === '=') {
      signRuleText = `Основания (${a}) и показатели (${n}) одинаковы, значит значения равны.`;
    } else if (ans === '<') {
      signRuleText = `Так как показатели степеней одинаковы (${n}), а основание первого числа меньше (${a} < ${b}), то и первое значение меньше.`;
    } else {
      signRuleText = `Так как показатели степеней одинаковы (${n}), а основание первого числа больше (${a} > ${b}), то и первое значение больше.`;
    }

    const solutionSteps = [
      `1. Обратим внимание на показатели: у обоих чисел показатель степени равен <strong>${n}</strong>.`,
      `2. Сравним основания: <strong>${a}</strong> и <strong>${b}</strong>.`,
      `3. ${signRuleText}`,
      `4. Итоговое сравнение: <strong>${a}<sup>${n}</sup> ${ans} ${b}<sup>${n}</sup></strong>.`
    ];

    return {
      category: 'compare_same_exp',
      catName: 'Одинаковые показатели',
      prompt: 'Сравните значения со степенями и выберите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      leftText,
      rightText,
      leftVal,
      rightVal,
      answer: ans,
      displayAnswer: ans,
      questionHtml: `<div class="compare-display"><div class="compare-side">${leftHtml}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${rightHtml}</div></div>`,
      solutionSteps,
      hint: `Показатель степени один и тот же (${n}). Сравни основания: ${a} и ${b}.`
    };
  }

  // --- 3. ВЫЧИСЛЕНИЕ И СВОЙСТВА (COMPARE CALC & PROPERTIES) ---
  function genCalcPropertiesTask() {
    const sub = pickRandom([
      'powers_of_two_four_eight',
      'powers_of_three_nine',
      'squares_vs_cubes',
      'power_vs_number',
      'power_arithmetic_expr',
      'pythagorean_squares',
      'zero_and_one_rules'
    ]);

    // A. Степени двоек, четвёрок и восьмёрок (2^4 = 4^2, 2^6 = 4^3 = 8^2, 2^5 vs 5^2, etc.)
    if (sub === 'powers_of_two_four_eight') {
      const presets = [
        { leftH: '2<sup>4</sup>', rightH: '4<sup>2</sup>', lVal: 16, rVal: 16, expl: '2<sup>4</sup> = 16 и 4<sup>2</sup> = 16 (также 4<sup>2</sup> = (2<sup>2</sup>)<sup>2</sup> = 2<sup>4</sup>).' },
        { leftH: '2<sup>6</sup>', rightH: '4<sup>3</sup>', lVal: 64, rVal: 64, expl: '2<sup>6</sup> = 64 и 4<sup>3</sup> = 64 (также 4<sup>3</sup> = (2<sup>2</sup>)<sup>3</sup> = 2<sup>6</sup>).' },
        { leftH: '2<sup>6</sup>', rightH: '8<sup>2</sup>', lVal: 64, rVal: 64, expl: '2<sup>6</sup> = 64 и 8<sup>2</sup> = 64 (также 8<sup>2</sup> = (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup>).' },
        { leftH: '4<sup>3</sup>', rightH: '8<sup>2</sup>', lVal: 64, rVal: 64, expl: '4<sup>3</sup> = 64 и 8<sup>2</sup> = 64.' },
        { leftH: '2<sup>8</sup>', rightH: '4<sup>4</sup>', lVal: 256, rVal: 256, expl: '2<sup>8</sup> = 256 и 4<sup>4</sup> = 256.' },
        { leftH: '2<sup>8</sup>', rightH: '16<sup>2</sup>', lVal: 256, rVal: 256, expl: '2<sup>8</sup> = 256 и 16<sup>2</sup> = 256.' },
        { leftH: '2<sup>5</sup>', rightH: '5<sup>2</sup>', lVal: 32, rVal: 25, expl: '2<sup>5</sup> = 32, а 5<sup>2</sup> = 25. 32 > 25.' },
        { leftH: '5<sup>2</sup>', rightH: '2<sup>5</sup>', lVal: 25, rVal: 32, expl: '5<sup>2</sup> = 25, а 2<sup>5</sup> = 32. 25 < 32.' },
        { leftH: '2<sup>3</sup>', rightH: '3<sup>2</sup>', lVal: 8, rVal: 9, expl: '2<sup>3</sup> = 8, а 3<sup>2</sup> = 9. 8 < 9.' },
        { leftH: '3<sup>2</sup>', rightH: '2<sup>3</sup>', lVal: 9, rVal: 8, expl: '3<sup>2</sup> = 9, а 2<sup>3</sup> = 8. 9 > 8.' },
        { leftH: '2<sup>7</sup>', rightH: '4<sup>3</sup>', lVal: 128, rVal: 64, expl: '2<sup>7</sup> = 128, а 4<sup>3</sup> = 64. 128 > 64.' },
        { leftH: '2<sup>4</sup>', rightH: '3<sup>3</sup>', lVal: 16, rVal: 27, expl: '2<sup>4</sup> = 16, а 3<sup>3</sup> = 27. 16 < 27.' },
        { leftH: '4<sup>3</sup>', rightH: '5<sup>2</sup>', lVal: 64, rVal: 25, expl: '4<sup>3</sup> = 64, а 5<sup>2</sup> = 25. 64 > 25.' }
      ];
      const p = pickRandom(presets);
      const ans = p.lVal < p.rVal ? '<' : (p.lVal > p.rVal ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните значения и выберите верный знак (<, >, =):',
        leftHtml: p.leftH,
        rightHtml: p.rightH,
        leftText: p.leftH.replace(/<[^>]+>/g, ''),
        rightText: p.rightH.replace(/<[^>]+>/g, ''),
        leftVal: p.lVal,
        rightVal: p.rVal,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${p.leftH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${p.rightH}</div></div>`,
        solutionSteps: [
          `1. Вычислим значение левой части: <strong>${p.leftH} = ${p.lVal}</strong>.`,
          `2. Вычислим значение правой части: <strong>${p.rightH} = ${p.rVal}</strong>.`,
          `3. Сравним полученные числа: ${p.lVal} ${ans} ${p.rVal}. (${p.expl})`,
          `4. Ответ: <strong>${p.leftH} ${ans} ${p.rightH}</strong>.`
        ],
        hint: `Посчитай каждое значение отдельно: сколько будет левая часть и сколько правая.`
      };
    }

    // B. Степени троек и девяток (3^4 = 9^2, 3^3 vs 5^2, etc.)
    if (sub === 'powers_of_three_nine') {
      const presets = [
        { leftH: '3<sup>4</sup>', rightH: '9<sup>2</sup>', lVal: 81, rVal: 81, expl: '3<sup>4</sup> = 81 и 9<sup>2</sup> = 81 (9<sup>2</sup> = (3<sup>2</sup>)<sup>2</sup> = 3<sup>4</sup>).' },
        { leftH: '9<sup>2</sup>', rightH: '3<sup>4</sup>', lVal: 81, rVal: 81, expl: '9<sup>2</sup> = 81 и 3<sup>4</sup> = 81.' },
        { leftH: '3<sup>3</sup>', rightH: '5<sup>2</sup>', lVal: 27, rVal: 25, expl: '3<sup>3</sup> = 27, а 5<sup>2</sup> = 25. 27 > 25.' },
        { leftH: '5<sup>2</sup>', rightH: '3<sup>3</sup>', lVal: 25, rVal: 27, expl: '5<sup>2</sup> = 25, а 3<sup>3</sup> = 27. 25 < 27.' },
        { leftH: '3<sup>3</sup>', rightH: '2<sup>5</sup>', lVal: 27, rVal: 32, expl: '3<sup>3</sup> = 27, а 2<sup>5</sup> = 32. 27 < 32.' },
        { leftH: '3<sup>4</sup>', rightH: '10<sup>2</sup>', lVal: 81, rVal: 100, expl: '3<sup>4</sup> = 81, а 10<sup>2</sup> = 100. 81 < 100.' },
        { leftH: '9<sup>2</sup>', rightH: '10<sup>2</sup>', lVal: 81, rVal: 100, expl: '9<sup>2</sup> = 81, а 10<sup>2</sup> = 100. 81 < 100.' },
        { leftH: '3<sup>5</sup>', rightH: '200', lVal: 243, rVal: 200, expl: '3<sup>5</sup> = 243 > 200.' }
      ];
      const p = pickRandom(presets);
      const ans = p.lVal < p.rVal ? '<' : (p.lVal > p.rVal ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните значения и выберите верный знак (<, >, =):',
        leftHtml: p.leftH,
        rightHtml: p.rightH,
        leftText: p.leftH.replace(/<[^>]+>/g, ''),
        rightText: p.rightH.replace(/<[^>]+>/g, ''),
        leftVal: p.lVal,
        rightVal: p.rVal,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${p.leftH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${p.rightH}</div></div>`,
        solutionSteps: [
          `1. Вычислим значение левой части: <strong>${p.leftH} = ${p.lVal}</strong>.`,
          `2. Вычислим значение правой части: <strong>${p.rightH} = ${p.rVal}</strong>.`,
          `3. Сравним: ${p.lVal} ${ans} ${p.rVal}. (${p.expl})`,
          `4. Ответ: <strong>${p.leftH} ${ans} ${p.rightH}</strong>.`
        ],
        hint: `Вычисли обе части выражения: 3 в степени или 9 в квадрате.`
      };
    }

    // C. Квадраты и кубы
    if (sub === 'squares_vs_cubes') {
      const presets = [
        { leftH: '6<sup>2</sup>', rightH: '2<sup>5</sup>', lVal: 36, rVal: 32, expl: '6<sup>2</sup> = 36, 2<sup>5</sup> = 32. 36 > 32.' },
        { leftH: '7<sup>2</sup>', rightH: '2<sup>6</sup>', lVal: 49, rVal: 64, expl: '7<sup>2</sup> = 49, 2<sup>6</sup> = 64. 49 < 64.' },
        { leftH: '10<sup>2</sup>', rightH: '5<sup>3</sup>', lVal: 100, rVal: 125, expl: '10<sup>2</sup> = 100, 5<sup>3</sup> = 125. 100 < 125.' },
        { leftH: '11<sup>2</sup>', rightH: '5<sup>3</sup>', lVal: 121, rVal: 125, expl: '11<sup>2</sup> = 121, 5<sup>3</sup> = 125. 121 < 125.' },
        { leftH: '12<sup>2</sup>', rightH: '2<sup>7</sup>', lVal: 144, rVal: 128, expl: '12<sup>2</sup> = 144, 2<sup>7</sup> = 128. 144 > 128.' },
        { leftH: '15<sup>2</sup>', rightH: '6<sup>3</sup>', lVal: 225, rVal: 216, expl: '15<sup>2</sup> = 225, 6<sup>3</sup> = 216. 225 > 216.' },
        { leftH: '20<sup>2</sup>', rightH: '7<sup>3</sup>', lVal: 400, rVal: 343, expl: '20<sup>2</sup> = 400, 7<sup>3</sup> = 343. 400 > 343.' },
        { leftH: '10<sup>3</sup>', rightH: '30<sup>2</sup>', lVal: 1000, rVal: 900, expl: '10<sup>3</sup> = 1000, 30<sup>2</sup> = 900. 1000 > 900.' }
      ];
      const p = pickRandom(presets);
      const ans = p.lVal < p.rVal ? '<' : (p.lVal > p.rVal ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните квадрат и куб / степень:',
        leftHtml: p.leftH,
        rightHtml: p.rightH,
        leftText: p.leftH.replace(/<[^>]+>/g, ''),
        rightText: p.rightH.replace(/<[^>]+>/g, ''),
        leftVal: p.lVal,
        rightVal: p.rVal,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${p.leftH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${p.rightH}</div></div>`,
        solutionSteps: [
          `1. Считаем левую часть: <strong>${p.leftH} = ${p.lVal}</strong>.`,
          `2. Считаем правую часть: <strong>${p.rightH} = ${p.rVal}</strong>.`,
          `3. Сравниваем: ${p.lVal} ${ans} ${p.rVal}. (${p.expl})`,
          `4. Ответ: <strong>${p.leftH} ${ans} ${p.rightH}</strong>.`
        ],
        hint: `Найди значение квадрата и куба, а затем сравни их.`
      };
    }

    // D. Степень и число (power vs number)
    if (sub === 'power_vs_number') {
      const presets = [
        { leftH: '2<sup>7</sup>', rightH: '120', lVal: 128, rVal: 120, expl: '2<sup>7</sup> = 128, 128 > 120.' },
        { leftH: '2<sup>7</sup>', rightH: '130', lVal: 128, rVal: 130, expl: '2<sup>7</sup> = 128, 128 < 130.' },
        { leftH: '3<sup>4</sup>', rightH: '81', lVal: 81, rVal: 81, expl: '3<sup>4</sup> = 81, 81 = 81.' },
        { leftH: '3<sup>4</sup>', rightH: '85', lVal: 81, rVal: 85, expl: '3<sup>4</sup> = 81, 81 < 85.' },
        { leftH: '5<sup>3</sup>', rightH: '125', lVal: 125, rVal: 125, expl: '5<sup>3</sup> = 125, 125 = 125.' },
        { leftH: '5<sup>3</sup>', rightH: '120', lVal: 125, rVal: 120, expl: '5<sup>3</sup> = 125, 125 > 120.' },
        { leftH: '10<sup>3</sup>', rightH: '999', lVal: 1000, rVal: 999, expl: '10<sup>3</sup> = 1000, 1000 > 999.' },
        { leftH: '10<sup>3</sup>', rightH: '1001', lVal: 1000, rVal: 1001, expl: '10<sup>3</sup> = 1000, 1000 < 1001.' },
        { leftH: '2<sup>10</sup>', rightH: '1000', lVal: 1024, rVal: 1000, expl: '2<sup>10</sup> = 1024, 1024 > 1000.' },
        { leftH: '4<sup>3</sup>', rightH: '64', lVal: 64, rVal: 64, expl: '4<sup>3</sup> = 64, 64 = 64.' },
        { leftH: '6<sup>3</sup>', rightH: '200', lVal: 216, rVal: 200, expl: '6<sup>3</sup> = 216, 216 > 200.' },
        { leftH: '7<sup>3</sup>', rightH: '350', lVal: 343, rVal: 350, expl: '7<sup>3</sup> = 343, 343 < 350.' },
        { leftH: '8<sup>2</sup>', rightH: '64', lVal: 64, rVal: 64, expl: '8<sup>2</sup> = 64, 64 = 64.' },
        { leftH: '14<sup>2</sup>', rightH: '196', lVal: 196, rVal: 196, expl: '14<sup>2</sup> = 196, 196 = 196.' },
        { leftH: '25<sup>2</sup>', rightH: '625', lVal: 625, rVal: 625, expl: '25<sup>2</sup> = 625, 625 = 625.' }
      ];
      const p = pickRandom(presets);
      // Иногда меняем местами лево и право
      const swap = Math.random() < 0.5;
      const lH = swap ? p.rightH : p.leftH;
      const rH = swap ? p.leftH : p.rightH;
      const lV = swap ? p.rVal : p.lVal;
      const rV = swap ? p.lVal : p.rVal;
      const ans = lV < rV ? '<' : (lV > rV ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните значение со степенью и число:',
        leftHtml: lH,
        rightHtml: rH,
        leftText: lH.replace(/<[^>]+>/g, ''),
        rightText: rH.replace(/<[^>]+>/g, ''),
        leftVal: lV,
        rightVal: rV,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${lH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${rH}</div></div>`,
        solutionSteps: [
          `1. Вычислим значение со степенью: ${p.leftH} = ${p.lVal}.`,
          `2. Сравним полученное число ${lV} и число ${rV}.`,
          `3. Получаем: <strong>${lV} ${ans} ${rV}</strong>.`,
          `4. Ответ: <strong>${lH} ${ans} ${rH}</strong>.`
        ],
        hint: `Возведи число в степень и сравни результат со вторым числом.`
      };
    }

    // E. Арифметические выражения со степенями
    if (sub === 'power_arithmetic_expr') {
      const presets = [
        { leftH: '2<sup>3</sup> × 2', rightH: '2<sup>4</sup>', lVal: 16, rVal: 16, expl: '2<sup>3</sup> × 2 = 8 × 2 = 16 и 2<sup>4</sup> = 16 (свойство: 2<sup>3</sup> × 2<sup>1</sup> = 2<sup>3+1</sup> = 2<sup>4</sup>).' },
        { leftH: '3<sup>2</sup> × 3', rightH: '3<sup>3</sup>', lVal: 27, rVal: 27, expl: '3<sup>2</sup> × 3 = 9 × 3 = 27 и 3<sup>3</sup> = 27 (3<sup>2+1</sup> = 3<sup>3</sup>).' },
        { leftH: '5<sup>2</sup> × 2', rightH: '3<sup>3</sup>', lVal: 50, rVal: 27, expl: '5<sup>2</sup> × 2 = 25 × 2 = 50, а 3<sup>3</sup> = 27. 50 > 27.' },
        { leftH: '2<sup>2</sup> × 3<sup>2</sup>', rightH: '6<sup>2</sup>', lVal: 36, rVal: 36, expl: '4 × 9 = 36 и 6<sup>2</sup> = 36 (свойство: (2 × 3)<sup>2</sup> = 6<sup>2</sup>).' },
        { leftH: '2<sup>3</sup> × 5<sup>3</sup>', rightH: '10<sup>3</sup>', lVal: 1000, rVal: 1000, expl: '(2 × 5)<sup>3</sup> = 10<sup>3</sup> = 1000.' },
        { leftH: '2<sup>5</sup> − 2<sup>4</sup>', rightH: '2<sup>4</sup>', lVal: 16, rVal: 16, expl: '32 − 16 = 16 и 2<sup>4</sup> = 16.' },
        { leftH: '10<sup>2</sup> − 6<sup>2</sup>', rightH: '8<sup>2</sup>', lVal: 64, rVal: 64, expl: '100 − 36 = 64 и 8<sup>2</sup> = 64.' },
        { leftH: '4<sup>2</sup> + 3<sup>2</sup>', rightH: '5<sup>2</sup>', lVal: 25, rVal: 25, expl: '16 + 9 = 25 и 5<sup>2</sup> = 25.' }
      ];
      const p = pickRandom(presets);
      const swap = Math.random() < 0.3;
      const lH = swap ? p.rightH : p.leftH;
      const rH = swap ? p.leftH : p.rightH;
      const lV = swap ? p.rVal : p.lVal;
      const rV = swap ? p.lVal : p.rVal;
      const ans = lV < rV ? '<' : (lV > rV ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните значения выражений:',
        leftHtml: lH,
        rightHtml: rH,
        leftText: lH.replace(/<[^>]+>/g, ''),
        rightText: rH.replace(/<[^>]+>/g, ''),
        leftVal: lV,
        rightVal: rV,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${lH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${rH}</div></div>`,
        solutionSteps: [
          `1. Посчитаем левую часть: <strong>${lH} = ${lV}</strong>.`,
          `2. Посчитаем правую часть: <strong>${rH} = ${rV}</strong>.`,
          `3. Сравним: ${lV} ${ans} ${rV}. (${p.expl})`,
          `4. Ответ: <strong>${lH} ${ans} ${rH}</strong>.`
        ],
        hint: `Выполни действия по порядку: сначала возведение в степень, затем умножение или сложение.`
      };
    }

    // F. Пифагоровы квадраты и суммы квадратов
    if (sub === 'pythagorean_squares') {
      const presets = [
        { leftH: '3<sup>2</sup> + 4<sup>2</sup>', rightH: '5<sup>2</sup>', lVal: 25, rVal: 25, expl: '9 + 16 = 25 и 5<sup>2</sup> = 25.' },
        { leftH: '6<sup>2</sup> + 8<sup>2</sup>', rightH: '10<sup>2</sup>', lVal: 100, rVal: 100, expl: '36 + 64 = 100 и 10<sup>2</sup> = 100.' },
        { leftH: '2<sup>2</sup> + 3<sup>2</sup>', rightH: '4<sup>2</sup>', lVal: 13, rVal: 16, expl: '4 + 9 = 13, а 4<sup>2</sup> = 16. 13 < 16.' },
        { leftH: '5<sup>2</sup> + 5<sup>2</sup>', rightH: '7<sup>2</sup>', lVal: 50, rVal: 49, expl: '25 + 25 = 50, а 7<sup>2</sup> = 49. 50 > 49.' },
        { leftH: '1<sup>2</sup> + 2<sup>2</sup> + 3<sup>2</sup>', rightH: '4<sup>2</sup>', lVal: 14, rVal: 16, expl: '1 + 4 + 9 = 14, а 4<sup>2</sup> = 16. 14 < 16.' }
      ];
      const p = pickRandom(presets);
      const ans = p.lVal < p.rVal ? '<' : (p.lVal > p.rVal ? '>' : '=');

      return {
        category: 'compare_calc',
        catName: 'Вычисление и свойства',
        prompt: 'Сравните сумму квадратов со степенью:',
        leftHtml: p.leftH,
        rightHtml: p.rightH,
        leftText: p.leftH.replace(/<[^>]+>/g, ''),
        rightText: p.rightH.replace(/<[^>]+>/g, ''),
        leftVal: p.lVal,
        rightVal: p.rVal,
        answer: ans,
        displayAnswer: ans,
        questionHtml: `<div class="compare-display"><div class="compare-side">${p.leftH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${p.rightH}</div></div>`,
        solutionSteps: [
          `1. Посчитаем сумму квадратов слева: <strong>${p.leftH} = ${p.lVal}</strong>.`,
          `2. Посчитаем степень справа: <strong>${p.rightH} = ${p.rVal}</strong>.`,
          `3. Сравним: ${p.lVal} ${ans} ${p.rVal}. (${p.expl})`,
          `4. Ответ: <strong>${p.leftH} ${ans} ${p.rightH}</strong>.`
        ],
        hint: `Возведи каждое слагаемое в квадрат, сложи их и сравни с правой частью.`
      };
    }

    // G. Особые правила со степенью 0 и 1
    const zeroPresets = [
      { leftH: '7<sup>0</sup>', rightH: '1<sup>9</sup>', lVal: 1, rVal: 1, expl: 'Любое ненулевое число в степени 0 равно 1 (7<sup>0</sup> = 1), и 1 в любой степени равна 1 (1<sup>9</sup> = 1).' },
      { leftH: '10<sup>0</sup>', rightH: '0<sup>5</sup>', lVal: 1, rVal: 0, expl: '10<sup>0</sup> = 1, а 0<sup>5</sup> = 0. 1 > 0.' },
      { leftH: '0<sup>7</sup>', rightH: '0<sup>2</sup>', lVal: 0, rVal: 0, expl: '0 в любой натуральной степени равен 0.' },
      { leftH: '5<sup>1</sup>', rightH: '1<sup>5</sup>', lVal: 5, rVal: 1, expl: '5<sup>1</sup> = 5, а 1<sup>5</sup> = 1. 5 > 1.' },
      { leftH: '1<sup>100</sup>', rightH: '1<sup>2</sup>', lVal: 1, rVal: 1, expl: 'Единица в любой степени равна 1.' },
      { leftH: '12<sup>0</sup>', rightH: '1', lVal: 1, rVal: 1, expl: '12<sup>0</sup> = 1, значит 1 = 1.' },
      { leftH: '9<sup>0</sup>', rightH: '0', lVal: 1, rVal: 0, expl: '9<sup>0</sup> = 1, а 1 > 0.' },
      { leftH: '2<sup>0</sup>', rightH: '2<sup>1</sup>', lVal: 1, rVal: 2, expl: '2<sup>0</sup> = 1, а 2<sup>1</sup> = 2. 1 < 2.' }
    ];
    const zp = pickRandom(zeroPresets);
    const ans = zp.lVal < zp.rVal ? '<' : (zp.lVal > zp.rVal ? '>' : '=');

    return {
      category: 'compare_calc',
      catName: 'Вычисление и свойства',
      prompt: 'Сравните значения с особыми показателями (0 и 1):',
      leftHtml: zp.leftH,
      rightHtml: zp.rightH,
      leftText: zp.leftH.replace(/<[^>]+>/g, ''),
      rightText: zp.rightH.replace(/<[^>]+>/g, ''),
      leftVal: zp.lVal,
      rightVal: zp.rVal,
      answer: ans,
      displayAnswer: ans,
      questionHtml: `<div class="compare-display"><div class="compare-side">${zp.leftH}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${zp.rightH}</div></div>`,
      solutionSteps: [
        `1. Вспомним правила: любое ненулевое число в степени 0 равно 1 (a<sup>0</sup> = 1), а число 1 в любой степени равно 1 (1<sup>n</sup> = 1).`,
        `2. Левая часть: <strong>${zp.leftH} = ${zp.lVal}</strong>.`,
        `3. Правая часть: <strong>${zp.rightH} = ${zp.rVal}</strong>.`,
        `4. Сравниваем: ${zp.lVal} ${ans} ${zp.rVal}. (${zp.expl})`,
        `5. Ответ: <strong>${zp.leftH} ${ans} ${zp.rightH}</strong>.`
      ],
      hint: `Помни: число в степени 0 равно 1, а 1 в любой степени — это 1!`
    };
  }

  // --- 4. МИКС ВСЕХ ВИДОВ (COMPARE ALL) ---
  function genMixedTask() {
    const fn = pickRandom([genSameBaseTask, genSameExpTask, genCalcPropertiesTask]);
    const task = fn();
    task.category = 'compare_all';
    return task;
  }

  // Основная точка входа
  function generateTask(category) {
    switch (category) {
      case 'compare_same_base':
        return genSameBaseTask();
      case 'compare_same_exp':
        return genSameExpTask();
      case 'compare_calc':
        return genCalcPropertiesTask();
      case 'compare_all':
      default:
        return genMixedTask();
    }
  }

  // Проверка ответа пользователя
  function checkAnswer(userAnswer, task) {
    if (!userAnswer || !task) return false;
    const cleanUser = String(userAnswer).trim();
    const cleanExpected = String(task.answer || task.displayAnswer).trim();
    return cleanUser === cleanExpected;
  }

  return {
    generateTask,
    checkAnswer,
    genSameBaseTask,
    genSameExpTask,
    genCalcPropertiesTask,
    genMixedTask
  };
}));
