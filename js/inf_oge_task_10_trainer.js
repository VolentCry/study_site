/**
 * Тренажёр ОГЭ по информатике · Задание №10
 * «Сравнение чисел в различных системах счисления (2, 8, 10, 16)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask10Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatInBaseHtml(val, base) {
    return `<strong>${val.toString(base).toUpperCase()}</strong><sub>${base}</sub>`;
  }

  function explainToBase10(val, base) {
    const str = val.toString(base).toUpperCase();
    const digits = str.split('');
    const len = digits.length;
    const terms = digits.map((ch, idx) => {
      const d = parseInt(ch, base);
      const pow = len - 1 - idx;
      return `${d}·${base}<sup>${pow}</sup>`;
    });
    return `${str}<sub>${base}</sub> = ${terms.join(' + ')} = ${val}<sub>10</sub>`;
  }

  function genCompareMinMax() {
    const bases = [16, 8, 2];
    const center = randInt(28, 120);
    const offsets = [-7, -2, 3, 8].sort(() => Math.random() - 0.5).slice(0, 3);
    const vals = offsets.map((off) => center + off);
    const findMax = Math.random() < 0.55;
    const ans = findMax ? Math.max(...vals) : Math.min(...vals);

    const formatted = vals.map((v, idx) => ({
      val: v,
      base: bases[idx],
      html: formatInBaseHtml(v, bases[idx]),
      step: explainToBase10(v, bases[idx])
    }));

    const questionHtml = `
      <p>Среди приведённых ниже трёх чисел, записанных в различных системах счисления, найдите <strong>${findMax ? 'максимальное' : 'минимальное'}</strong> и запишите его в ответе в <strong>десятичной</strong> системе счисления.</p>
      <div class="inf-quote-box" style="font-size:18px; display:flex; gap:18px; flex-wrap:wrap;">
        ${formatted.map((f) => `<span>${f.html}</span>`).join('')}
      </div>
      <p>В ответе запишите только число, основание системы счисления указывать не нужно.</p>
    `.trim();

    return {
      category: 'compare_min_max',
      catName: 'Сравнение чисел (2, 8, 16 → 10)',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: 'Переведите каждое число в десятичную систему счисления по разрядам (справа налево, степени основания 0, 1, 2...).',
      solutionSteps: [
        `Переведём каждое число в десятичную систему:`,
        ...formatted.map((f) => f.step),
        `${findMax ? 'Максимальное' : 'Минимальное'} из чисел {${vals.join(', ')}} — это <strong>${ans}</strong>.`
      ]
    };
  }

  function genCountBits() {
    const base = pickRandom([10, 8, 16]);
    const n = randInt(35, 250);
    const bin = n.toString(2);
    const askOnes = Math.random() < 0.65;
    const targetBit = askOnes ? '1' : '0';
    const ans = bin.split('').filter((b) => b === targetBit).length;

    const numHtml = base === 10 ? `<strong>${n}</strong><sub>10</sub>` : formatInBaseHtml(n, base);

    const questionHtml = `
      <p>Переведите число ${numHtml} в <strong>двоичную</strong> систему счисления и посчитайте, сколько <strong>${askOnes ? 'единиц' : 'значащих нулей'}</strong> содержится в полученной записи.</p>
      <p>В ответе запишите только количество ${askOnes ? 'единиц' : 'нулей'}.</p>
    `.trim();

    const steps = [];
    if (base !== 10) {
      steps.push(`Сначала переведём число в десятичную систему: ${explainToBase10(n, base)}.`);
    }
    steps.push(`Переведём ${n}<sub>10</sub> в двоичную систему (делением на 2 или через сумму степеней двойки): <code>${bin}</code><sub>2</sub>.`);
    steps.push(`Подсчитываем количество цифр «${targetBit}» в записи <code>${bin}</code>: их ровно <strong>${ans}</strong>.`);

    return {
      category: 'count_bits',
      catName: 'Двоичная запись (подсчёт 0 и 1)',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: 'Удобно представлять число как сумму степеней двойки (128, 64, 32, 16, 8, 4, 2, 1) или последовательно делить на 2 с остатком.',
      solutionSteps: steps
    };
  }

  function genRangeCount() {
    const baseA = pickRandom([16, 8, 2]);
    let baseB = pickRandom([16, 8, 2]);
    if (baseB === baseA) baseB = baseA === 16 ? 8 : 16;

    const a = randInt(25, 90);
    const b = a + randInt(4, 15);
    const leftInclusive = Math.random() < 0.5;
    const rightInclusive = Math.random() < 0.5;

    const leftSign = leftInclusive ? '≤' : '&lt;';
    const rightSign = rightInclusive ? '≤' : '&lt;';
    const minInt = leftInclusive ? a : a + 1;
    const maxInt = rightInclusive ? b : b - 1;
    const ans = Math.max(0, maxInt - minInt + 1);

    const questionHtml = `
      <p>Сколько натуральных чисел <em>x</em> удовлетворяют неравенству:</p>
      <div class="inf-quote-box" style="font-size:18px;">
        ${formatInBaseHtml(a, baseA)} ${leftSign} <em>x</em> ${rightSign} ${formatInBaseHtml(b, baseB)}
      </div>
    `.trim();

    return {
      category: 'range_count',
      catName: 'Количество чисел на интервале',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: 'Переведите обе границы в десятичную систему, определите наименьшее и наибольшее подходящее целое число и примените формулу max − min + 1.',
      solutionSteps: [
        `Переведём левую границу: ${explainToBase10(a, baseA)}.`,
        `Переведём правую границу: ${explainToBase10(b, baseB)}.`,
        `Получаем неравенство ${a} ${leftSign} x ${rightSign} ${b}. Целые решения лежат на отрезке [${minInt}; ${maxInt}].`,
        `Количество натуральных чисел: ${maxInt} − ${minInt} + 1 = <strong>${ans}</strong>.`
      ]
    };
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'compare_min_max':
        return genCompareMinMax();
      case 'count_bits':
        return genCountBits();
      case 'range_count':
        return genRangeCount();
      case 'mixed_all':
      default:
        return pickRandom([genCompareMinMax, genCountBits, genRangeCount])();
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const cleaned = String(userRaw).trim().replace(/\s+/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    return parseInt(cleaned, 10) === Number(correctAnswer);
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'compare_min_max', title: 'Сравнение чисел' },
      { id: 'count_bits', title: 'Двоичная запись (0 и 1)' },
      { id: 'range_count', title: 'Количество на интервале' }
    ]
  };
}));
