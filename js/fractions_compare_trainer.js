/**
 * Тренажёр «Сравнение дробей (<, >, =)» · Математика 5 класс
 * Согласовано с ФГОС и открытым банком задач для 5–6 классов.
 * Включает прототипы:
 *  1. Сравнение дробей с одинаковыми знаменателями
 *  2. Сравнение дробей с одинаковыми числителями
 *  3. Сравнение дробей с разными знаменателями (через НОЗ и перекрёстное умножение)
 *  4. Сравнение смешанных чисел и сравнение с единицей
 *  5. Равные дроби (сокращение и основное свойство дроби)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FractionCompareTrainer = factory();
    root.FractionsCompareTrainer = root.FractionCompareTrainer;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

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

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function fracHtml(num, den, whole) {
    const frac = `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
    return whole ? `${whole}&nbsp;${frac}` : frac;
  }

  function makeCompareHtml(leftHtml, rightHtml) {
    return `<div class="compare-display"><div class="compare-side">${leftHtml}</div><div class="compare-slot" data-slot="symbol">?</div><div class="compare-side">${rightHtml}</div></div>`;
  }

  function getSign(val1, val2, eps = 1e-9) {
    if (Math.abs(val1 - val2) < eps) return '=';
    return val1 > val2 ? '>' : '<';
  }

  // --- 1. ОДИНАКОВЫЕ ЗНАМЕНАТЕЛИ ---
  function genSameDenomTask() {
    const den = pickRandom([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15]);
    let n1 = randInt(1, den - 1);
    let n2 = randInt(1, den - 1);

    // 25% шанс равенства
    if (Math.random() < 0.25) {
      n2 = n1;
    } else if (n1 === n2) {
      n2 = n1 < den - 1 ? n1 + 1 : n1 - 1;
    }

    const val1 = n1 / den;
    const val2 = n2 / den;
    const ans = getSign(val1, val2);

    const leftHtml = fracHtml(n1, den);
    const rightHtml = fracHtml(n2, den);

    let signReason;
    if (ans === '=') {
      signReason = `Числители равны (${n1} = ${n2}), поэтому и дроби равны.`;
    } else {
      signReason = `Сравниваем числители: так как <strong>${n1} ${ans} ${n2}</strong>, то и первая дробь ${ans === '>' ? 'больше' : 'меньше'} второй.`;
    }

    const solutionSteps = [
      `1. Обратим внимание на знаменатели: обе дроби имеют одинаковый знаменатель <strong>${den}</strong>.`,
      `2. Правило: <em>из двух дробей с одинаковыми знаменателями больше та, у которой числитель больше</em>.`,
      `3. ${signReason}`,
      `4. Итоговое сравнение: <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
    ];

    return {
      category: 'fractions_compare_same_denom',
      catName: 'Сравнение дробей · Одинаковые знаменатели',
      prompt: 'Сравните дроби и введите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      answer: ans,
      displayAnswer: ans,
      questionHtml: makeCompareHtml(leftHtml, rightHtml),
      solutionSteps,
      hint: `Знаменатели одинаковые (${den}). Сравни числители: ${n1} и ${n2}.`
    };
  }

  // --- 2. ОДИНАКОВЫЕ ЧИСЛИТЕЛИ ---
  function genSameNumTask() {
    const num = pickRandom([1, 2, 3, 4, 5, 7]);
    const den1 = randInt(num + 1, 15);
    let den2 = randInt(num + 1, 15);

    // 25% шанс равенства
    if (Math.random() < 0.25) {
      den2 = den1;
    } else if (den1 === den2) {
      den2 = den1 < 15 ? den1 + 1 : den1 - 1;
    }

    const val1 = num / den1;
    const val2 = num / den2;
    const ans = getSign(val1, val2);

    const leftHtml = fracHtml(num, den1);
    const rightHtml = fracHtml(num, den2);

    let signReason;
    if (ans === '=') {
      signReason = `Знаменатели равны (${den1} = ${den2}), поэтому дроби одинаковы.`;
    } else {
      signReason = `Сравниваем знаменатели: <strong>${den1} ${den1 < den2 ? '<' : '>'} ${den2}</strong>. Чем на меньшее число долей разделено целое, тем больше каждая доля! Поэтому дробь со знаменателем ${Math.min(den1, den2)} больше.`;
    }

    const solutionSteps = [
      `1. Обратим внимание на числители: обе дроби имеют одинаковый числитель <strong>${num}</strong>.`,
      `2. Правило: <em>из двух дробей с одинаковыми числителями больше та, у которой знаменатель меньше</em>.`,
      `3. ${signReason}`,
      `4. Итоговое сравнение: <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
    ];

    return {
      category: 'fractions_compare_same_num',
      catName: 'Сравнение дробей · Одинаковые числители',
      prompt: 'Сравните дроби и введите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      answer: ans,
      displayAnswer: ans,
      questionHtml: makeCompareHtml(leftHtml, rightHtml),
      solutionSteps,
      hint: `Числители одинаковые (${num}). Сравни знаменатели: ${den1} и ${den2}. Помни: меньше знаменатель — больше доля!`
    };
  }

  // --- 3. РАЗНЫЕ ЗНАМЕНАТЕЛИ (ОБЩИЙ ЗНАМЕНАТЕЛЬ И ПЕРЕКРЁСТНОЕ УМНОЖЕНИЕ) ---
  function genDiffDenomTask() {
    // 25% шанс эквивалентных (равных) дробей через основное свойство
    if (Math.random() < 0.25) {
      const baseD = randInt(2, 6);
      const baseN = randInt(1, baseD - 1);
      const k1 = randInt(1, 3);
      const k2 = k1 === 1 ? randInt(2, 4) : 1;
      const n1 = baseN * k1;
      const d1 = baseD * k1;
      const n2 = baseN * k2;
      const d2 = baseD * k2;

      const leftHtml = fracHtml(n1, d1);
      const rightHtml = fracHtml(n2, d2);
      const commonDen = lcm(d1, d2);
      const cross1 = n1 * d2;
      const cross2 = n2 * d1;

      return {
        category: 'fractions_compare_diff_denom',
        catName: 'Сравнение дробей · Разные знаменатели',
        prompt: 'Сравните дроби и введите верный знак (<, >, =):',
        leftHtml,
        rightHtml,
        answer: '=',
        displayAnswer: '=',
        questionHtml: makeCompareHtml(leftHtml, rightHtml),
        solutionSteps: [
          `1. Приведём дроби к наименьшему общему знаменателю: НОК(${d1}, ${d2}) = <strong>${commonDen}</strong>.`,
          `2. Дополнительные множители: для первой дроби <code>${commonDen} : ${d1} = ${commonDen / d1}</code>, для второй <code>${commonDen} : ${d2} = ${commonDen / d2}</code>.`,
          `3. Получаем дроби: <code>${n1}/${d1} = ${n1 * (commonDen / d1)}/${commonDen}</code> и <code>${n2}/${d2} = ${n2 * (commonDen / d2)}/${commonDen}</code>.`,
          `4. Числители совпали, значит дроби равны (также можно проверить перекрёстным умножением: <code>${n1} · ${d2} = ${cross1}</code> и <code>${n2} · ${d1} = ${cross2}</code>).`,
          `5. Ответ: <strong>${leftHtml} = ${rightHtml}</strong>.`
        ],
        hint: `Приведи обе дроби к общему знаменателю НОК(${d1}, ${d2}) или используй перекрёстное умножение.`
      };
    }

    const denPairs = [
      [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [5, 6],
      [3, 8], [5, 8], [4, 7], [5, 7], [7, 8], [5, 9],
      [7, 10], [3, 10], [5, 12], [7, 12], [4, 9], [7, 9]
    ];
    const pair = pickRandom(denPairs);
    const d1 = pair[0];
    const d2 = pair[1];
    let n1 = randInt(1, d1 - 1);
    let n2 = randInt(1, d2 - 1);

    // Избегаем случайного равенства без сокращения
    if (n1 * d2 === n2 * d1) {
      n1 = (n1 < d1 - 1) ? n1 + 1 : n1 - 1;
    }

    // Случайно меняем местами лево/право для баланса < и >
    let [finalN1, finalD1, finalN2, finalD2] = Math.random() < 0.5 ? [n1, d1, n2, d2] : [n2, d2, n1, d1];

    const val1 = finalN1 / finalD1;
    const val2 = finalN2 / finalD2;
    const ans = getSign(val1, val2);

    const commonDen = lcm(finalD1, finalD2);
    const m1 = commonDen / finalD1;
    const m2 = commonDen / finalD2;
    const s1 = finalN1 * m1;
    const s2 = finalN2 * m2;

    const cross1 = finalN1 * finalD2;
    const cross2 = finalN2 * finalD1;

    const leftHtml = fracHtml(finalN1, finalD1);
    const rightHtml = fracHtml(finalN2, finalD2);

    const solutionSteps = [
      `<strong>Способ 1 (приведение к общему знаменателю):</strong>`,
      `1. Найдём наименьший общий знаменатель: НОК(${finalD1}, ${finalD2}) = <strong>${commonDen}</strong>.`,
      `2. Приведём дроби: <br>• Первая дробь: <code>${finalN1}/${finalD1} = (${finalN1} · ${m1})/(${finalD1} · ${m1}) = ${s1}/${commonDen}</code>.<br>• Вторая дробь: <code>${finalN2}/${finalD2} = (${finalN2} · ${m2})/(${finalD2} · ${m2}) = ${s2}/${commonDen}</code>.`,
      `3. Сравниваем числители: так как <strong>${s1} ${ans} ${s2}</strong>, то <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`,
      `<strong>Способ 2 (перекрёстное умножение):</strong>`,
      `Перемножим числитель первой на знаменатель второй (<code>${finalN1} · ${finalD2} = ${cross1}</code>) и числитель второй на знаменатель первой (<code>${finalN2} · ${finalD1} = ${cross2}</code>). Так как <strong>${cross1} ${ans} ${cross2}</strong>, то и <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
    ];

    return {
      category: 'fractions_compare_diff_denom',
      catName: 'Сравнение дробей · Разные знаменатели',
      prompt: 'Сравните дроби и введите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      answer: ans,
      displayAnswer: ans,
      questionHtml: makeCompareHtml(leftHtml, rightHtml),
      solutionSteps,
      hint: `Приведи дроби к общему знаменателю НОК(${finalD1}, ${finalD2}) или умножь перекрёстно: ${finalN1}·${finalD2} и ${finalN2}·${finalD1}.`
    };
  }

  // --- 4. СМЕШАННЫЕ ЧИСЛА И СРАВНЕНИЕ С ЕДИНИЦЕЙ ---
  function genMixedOrOneTask() {
    const subType = pickRandom(['diff_whole', 'same_whole', 'compare_one', 'improper_vs_mixed']);

    if (subType === 'diff_whole') {
      // Разные целые части: 2 1/3 и 3 1/5
      const w1 = randInt(1, 4);
      let w2 = randInt(1, 4);
      while (w2 === w1) w2 = randInt(1, 4);

      const d1 = pickRandom([2, 3, 4, 5, 6]);
      const d2 = pickRandom([2, 3, 4, 5, 6]);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);

      const val1 = w1 + n1 / d1;
      const val2 = w2 + n2 / d2;
      const ans = getSign(val1, val2);

      const leftHtml = fracHtml(n1, d1, w1);
      const rightHtml = fracHtml(n2, d2, w2);

      return {
        category: 'fractions_compare_mixed',
        catName: 'Сравнение смешанных чисел',
        prompt: 'Сравните смешанные числа и введите верный знак (<, >, =):',
        leftHtml,
        rightHtml,
        answer: ans,
        displayAnswer: ans,
        questionHtml: makeCompareHtml(leftHtml, rightHtml),
        solutionSteps: [
          `1. Сравним целые части смешанных чисел: <strong>${w1}</strong> и <strong>${w2}</strong>.`,
          `2. Так как <strong>${w1} ${ans} ${w2}</strong>, смешанное число с большей целой частью всегда больше.`,
          `3. Дробные части сравнивать не требуется, так как целые части различаются.`,
          `4. Ответ: <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
        ],
        hint: `Сначала сравни целые части: ${w1} и ${w2}. Больше то смешанное число, у которого целая часть больше.`
      };
    }

    if (subType === 'same_whole') {
      // Одинаковые целые части: 2 3/7 и 2 5/7 или разные знам.
      const w = randInt(1, 4);
      const d = pickRandom([4, 5, 6, 7, 8, 9, 10]);
      let n1 = randInt(1, d - 1);
      let n2 = randInt(1, d - 1);
      if (Math.random() < 0.25) {
        n2 = n1;
      } else if (n1 === n2) {
        n2 = n1 < d - 1 ? n1 + 1 : n1 - 1;
      }

      const val1 = w + n1 / d;
      const val2 = w + n2 / d;
      const ans = getSign(val1, val2);

      const leftHtml = fracHtml(n1, d, w);
      const rightHtml = fracHtml(n2, d, w);

      return {
        category: 'fractions_compare_mixed',
        catName: 'Сравнение смешанных чисел',
        prompt: 'Сравните смешанные числа и введите верный знак (<, >, =):',
        leftHtml,
        rightHtml,
        answer: ans,
        displayAnswer: ans,
        questionHtml: makeCompareHtml(leftHtml, rightHtml),
        solutionSteps: [
          `1. Целые части чисел одинаковы: <strong>${w} = ${w}</strong>.`,
          `2. Сравниваем дробные части: <code>${n1}/${d}</code> и <code>${n2}/${d}</code>.`,
          `3. Так как знаменатели одинаковые (${d}), сравниваем числители: <strong>${n1} ${ans} ${n2}</strong>.`,
          `4. Ответ: <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
        ],
        hint: `Целые части равны (${w}). Сравни дробные части с одинаковым знаменателем: ${n1}/${d} и ${n2}/${d}.`
      };
    }

    if (subType === 'compare_one') {
      // Сравнение правильной или неправильной дроби с единицей (1)
      const isProper = Math.random() < 0.5;
      const d = randInt(3, 12);
      let n;
      if (Math.random() < 0.25) {
        n = d; // равно 1
      } else if (isProper) {
        n = randInt(1, d - 1); // < 1
      } else {
        n = randInt(d + 1, d + 6); // > 1
      }

      const fracOnLeft = Math.random() < 0.5;
      const val1 = fracOnLeft ? n / d : 1;
      const val2 = fracOnLeft ? 1 : n / d;
      const ans = getSign(val1, val2);

      const leftHtml = fracOnLeft ? fracHtml(n, d) : '1';
      const rightHtml = fracOnLeft ? '1' : fracHtml(n, d);

      let reason;
      if (n < d) {
        reason = `Дробь <code>${n}/${d}</code> правильная (числитель меньше знаменателя: ${n} < ${d}), поэтому она <strong>строго меньше 1</strong>.`;
      } else if (n > d) {
        reason = `Дробь <code>${n}/${d}</code> неправильная (числитель больше знаменателя: ${n} > ${d}), поэтому она <strong>строго больше 1</strong>.`;
      } else {
        reason = `Числитель равен знаменателю (${n} = ${d}), поэтому дробь <code>${n}/${d}</code> равна <strong>1</strong>.`;
      }

      return {
        category: 'fractions_compare_mixed',
        catName: 'Сравнение дроби с 1',
        prompt: 'Сравните число и дробь (<, >, =):',
        leftHtml,
        rightHtml,
        answer: ans,
        displayAnswer: ans,
        questionHtml: makeCompareHtml(leftHtml, rightHtml),
        solutionSteps: [
          `1. Вспомним правила сравнения дробей с единицей:`,
          `• Правильная дробь (числитель < знаменателя) меньше 1.`,
          `• Неправильная дробь с числителем > знаменателя больше 1.`,
          `• Дробь, у которой числитель = знаменателю, равна 1.`,
          `2. ${reason}`,
          `3. Ответ: <strong>${leftHtml} ${ans} ${rightHtml}</strong>.`
        ],
        hint: `Сравни числитель со знаменателем: правильная дробь меньше 1, а неправильная больше 1.`
      };
    }

    // improper_vs_mixed: перевод в неправильную / равенство
    const w = randInt(1, 3);
    const d = randInt(2, 6);
    const rem = randInt(1, d - 1);
    const impN = w * d + rem;

    const leftHtml = fracHtml(impN, d);
    const rightHtml = fracHtml(rem, d, w);

    return {
      category: 'fractions_compare_mixed',
      catName: 'Сравнение неправильной дроби и смешанного числа',
      prompt: 'Сравните значения и введите верный знак (<, >, =):',
      leftHtml,
      rightHtml,
      answer: '=',
      displayAnswer: '=',
      questionHtml: makeCompareHtml(leftHtml, rightHtml),
      solutionSteps: [
        `1. Переведём смешанное число <strong>${rightHtml}</strong> в неправильную дробь:`,
        `<code>${w}&nbsp;${rem}/${d} = (${w} · ${d} + ${rem}) / ${d} = ${impN} / ${d}</code>.`,
        `2. Сравниваем полученные дроби: <code>${impN}/${d}</code> и <code>${impN}/${d}</code> — они полностью равны!`,
        `3. Ответ: <strong>${leftHtml} = ${rightHtml}</strong>.`
      ],
      hint: `Переведи смешанное число в неправильную дробь: целую часть умножь на знаменатель и прибавь числитель.`
    };
  }

  // --- ЕДИНЫЙ ВХОДНОЙ ГЕНЕРАТОР ---
  function generateTask(type) {
    let task;
    switch (type) {
      case 'fractions_compare_same_denom':
        task = genSameDenomTask();
        break;
      case 'fractions_compare_same_num':
        task = genSameNumTask();
        break;
      case 'fractions_compare_diff_denom':
        task = genDiffDenomTask();
        break;
      case 'fractions_compare_mixed':
        task = genMixedOrOneTask();
        break;
      case 'fractions_compare_all':
      default: {
        const gen = pickRandom([genSameDenomTask, genSameNumTask, genDiffDenomTask, genMixedOrOneTask]);
        task = gen();
        task.catName = 'Сравнение обыкновенных дробей';
        break;
      }
    }

    if (!task.taskId) {
      task.taskId = 'frac_comp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }
    return task;
  }

  return {
    generateTask,
    genSameDenomTask,
    genSameNumTask,
    genDiffDenomTask,
    genMixedOrOneTask
  };
}));
