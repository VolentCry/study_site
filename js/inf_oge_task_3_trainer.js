/**
 * Тренажёр ОГЭ по информатике · Задание №3
 * «Значение логического выражения (И, ИЛИ, НЕ)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask3Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildTemplates() {
    const a = randInt(5, 45);
    const b = a + randInt(4, 18);
    const k = pickRandom([2, 3, 4, 5]);
    const twoDigitA = randInt(12, 40);
    const twoDigitB = randInt(55, 89);

    return [
      {
        mode: 'min_x',
        expr: `НЕ (x < ${a}) И (x чётное)`,
        truthTarget: true,
        evalFn: (x) => !(x < a) && (x % 2 === 0),
        explain: `Высказывание истинно, когда оба условия истинны: x ≥ ${a} и x — чётное число.`
      },
      {
        mode: 'min_x',
        expr: `НЕ (x <= ${a}) И НЕ (x нечётное)`,
        truthTarget: true,
        evalFn: (x) => !(x <= a) && !(Math.abs(x % 2) === 1),
        explain: `НЕ (x ≤ ${a}) означает x > ${a}; НЕ (x нечётное) означает, что x чётное.`
      },
      {
        mode: 'min_x',
        expr: `(x >= ${a}) И (x кратно ${k})`,
        truthTarget: true,
        evalFn: (x) => (x >= a) && (x % k === 0),
        explain: `Нужно наименьшее целое число, которое не меньше ${a} и делится на ${k} без остатка.`
      },
      {
        mode: 'min_x',
        expr: `(x < ${a}) ИЛИ (x нечётное)`,
        truthTarget: false,
        evalFn: (x) => (x < a) || (Math.abs(x % 2) === 1),
        explain: `Чтобы дизъюнкция (ИЛИ) была ЛОЖНОЙ, должны быть ложны обе скобки: x ≥ ${a} и x — чётное.`
      },
      {
        mode: 'max_x',
        expr: `НЕ (x >= ${b}) И (x нечётное)`,
        truthTarget: true,
        evalFn: (x) => !(x >= b) && (Math.abs(x % 2) === 1),
        explain: `НЕ (x ≥ ${b}) ⇔ x < ${b}. Ищем наибольшее нечётное число строго меньше ${b}.`
      },
      {
        mode: 'max_x',
        expr: `(x < ${b}) И НЕ (x делится на ${k})`,
        truthTarget: true,
        evalFn: (x) => (x < b) && (x % k !== 0),
        explain: `Требуется x < ${b} и при этом x не должно делиться на ${k}.`
      },
      {
        mode: 'max_x',
        expr: `(x > ${b}) ИЛИ (x кратно ${k})`,
        truthTarget: false,
        evalFn: (x) => (x > b) || (x % k === 0),
        explain: `Связка ИЛИ ложна только когда ложны обе части: x ≤ ${b} и x не кратно ${k}.`
      },
      {
        mode: 'max_x',
        expr: `НЕ (x > ${twoDigitB}) И (x — двузначное) И (x чётное)`,
        truthTarget: true,
        evalFn: (x) => !(x > twoDigitB) && (x >= 10 && x <= 99) && (x % 2 === 0),
        explain: `x ≤ ${twoDigitB}, при этом 10 ≤ x ≤ 99 и x чётное.`
      },
      {
        mode: 'count_x',
        expr: `НЕ (x <= ${a}) И НЕ (x >= ${b})`,
        truthTarget: true,
        evalFn: (x) => !(x <= a) && !(x >= b),
        explain: `Преобразуем по отрицанию: x > ${a} И x < ${b}, то есть ${a} < x < ${b}.`
      },
      {
        mode: 'count_x',
        expr: `НЕ ((x < ${twoDigitA}) ИЛИ (x > ${twoDigitB})) И (x чётное)`,
        truthTarget: true,
        evalFn: (x) => !((x < twoDigitA) || (x > twoDigitB)) && (x % 2 === 0),
        explain: `По закону де Моргана: ${twoDigitA} ≤ x ≤ ${twoDigitB} и при этом x чётное.`
      },
      {
        mode: 'count_x',
        expr: `(x >= ${a}) И (x <= ${b}) И (x кратно ${k})`,
        truthTarget: true,
        evalFn: (x) => (x >= a) && (x <= b) && (x % k === 0),
        explain: `Подсчитываем количество чисел на отрезке [${a}; ${b}], делящихся на ${k}.`
      }
    ];
  }

  function generateTask(category = 'mixed_all') {
    for (let attempt = 0; attempt < 50; attempt++) {
      const all = buildTemplates();
      const filtered = category === 'mixed_all' ? all : all.filter((t) => t.mode === category);
      const tpl = pickRandom(filtered.length ? filtered : all);

      const matches = [];
      for (let x = -200; x <= 250; x++) {
        if (tpl.evalFn(x) === tpl.truthTarget) {
          matches.push(x);
        }
      }

      if (matches.length === 0) continue;

      const truthWord = tpl.truthTarget ? 'истинно' : 'ложно';

      if (tpl.mode === 'min_x') {
        // Убеждаемся, что область ограничена снизу (на -200 не подходит)
        if (tpl.evalFn(-200) === tpl.truthTarget) continue;
        const ans = matches[0];
        return {
          category: 'min_x',
          catName: 'Наименьшее число x',
          questionHtml: `
            <p>Напишите <strong>наименьшее</strong> целое число <em>x</em>, для которого <strong>${truthWord}</strong> высказывание:</p>
            <div class="inf-quote-box"><code style="font-size:15px;">${tpl.expr}</code></div>
          `.trim(),
          answer: ans,
          displayAnswer: String(ans),
          hint: 'Сначала раскройте отрицания НЕ (меняя знаки < на ≥, > на ≤, ИЛИ на И), затем подберите наименьшее подходящее целое число.',
          solutionSteps: [
            tpl.explain,
            `Первые подходящие числа: ${matches.slice(0, 4).join(', ')}...`,
            `Наименьшее из них: <strong>${ans}</strong>.`
          ]
        };
      }

      if (tpl.mode === 'max_x') {
        // Убеждаемся, что область ограничена сверху (на +250 не подходит)
        if (tpl.evalFn(250) === tpl.truthTarget) continue;
        const ans = matches[matches.length - 1];
        return {
          category: 'max_x',
          catName: 'Наибольшее число x',
          questionHtml: `
            <p>Напишите <strong>наибольшее</strong> целое число <em>x</em>, для которого <strong>${truthWord}</strong> высказывание:</p>
            <div class="inf-quote-box"><code style="font-size:15px;">${tpl.expr}</code></div>
          `.trim(),
          answer: ans,
          displayAnswer: String(ans),
          hint: 'Избавьтесь от частицы НЕ (обратите знак неравенства на противоположный) и выберите максимальное целое число.',
          solutionSteps: [
            tpl.explain,
            `Крайние подходящие числа перед границей: ...${matches.slice(-4).join(', ')}.`,
            `Наибольшее подходящее число: <strong>${ans}</strong>.`
          ]
        };
      }

      if (tpl.mode === 'count_x') {
        if (tpl.evalFn(-200) === tpl.truthTarget || tpl.evalFn(250) === tpl.truthTarget) continue;
        if (matches.length > 60) continue;
        const ans = matches.length;
        const preview = matches.length <= 8
          ? matches.join(', ')
          : `${matches.slice(0, 3).join(', ')}, ..., ${matches.slice(-2).join(', ')}`;

        return {
          category: 'count_x',
          catName: 'Количество чисел x',
          questionHtml: `
            <p>Сколько существует <strong>целых чисел</strong> <em>x</em>, для которых <strong>${truthWord}</strong> высказывание:</p>
            <div class="inf-quote-box"><code style="font-size:15px;">${tpl.expr}</code></div>
          `.trim(),
          answer: ans,
          displayAnswer: String(ans),
          hint: 'Найдите левую и правую границы отрезка и аккуратно проверьте, включены ли концы (строгий или нестрогий знак).',
          solutionSteps: [
            tpl.explain,
            `Подходящие целые числа: ${preview}.`,
            `Всего таких чисел: <strong>${ans}</strong>.`
          ]
        };
      }
    }

    // Фолбэк
    return {
      category: 'min_x',
      catName: 'Наименьшее число x',
      questionHtml: `<p>Напишите наименьшее целое число <em>x</em>, для которого истинно высказывание:</p><div class="inf-quote-box"><code>НЕ (x &lt; 10) И (x чётное)</code></div>`,
      answer: 10,
      displayAnswer: '10',
      hint: 'НЕ (x < 10) означает x ≥ 10.',
      solutionSteps: ['x ≥ 10 и x чётное → наименьшее число <strong>10</strong>.']
    };
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const cleaned = String(userRaw).trim().replace(/\s+/g, '').replace(/−/g, '-');
    if (!/^-?\d+$/.test(cleaned)) return false;
    return parseInt(cleaned, 10) === Number(correctAnswer);
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'min_x', title: 'Наименьшее x' },
      { id: 'max_x', title: 'Наибольшее x' },
      { id: 'count_x', title: 'Количество целых x' }
    ]
  };
}));
