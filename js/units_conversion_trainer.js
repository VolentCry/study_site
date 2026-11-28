/**
 * Тренажёр по математике · 5 класс
 * «Перевод единиц измерения: длина, масса, время, площадь и объём»
 *
 * Соответствует программе ФГОС 5 класса.
 * Модуль генерации задач и проверки ответов для интерактивного тренажёра
 * и конструктора домашних заданий.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UnitsConversionTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  function cleanFloat(n) {
    return Math.round(n * 1e6) / 1e6;
  }

  function formatDisplayNum(n) {
    const val = cleanFloat(n);
    const parts = String(val).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }

  function formatCanonical(n) {
    return String(cleanFloat(n));
  }

  function normalizeUserInput(raw) {
    if (raw === undefined || raw === null) return '';
    return String(raw)
      .trim()
      .replace(/\s+/g, '')
      .replace(/−|—/g, '-')
      .replace(',', '.');
  }

  /**
   * Генерация 4 уникальных вариантов ответа (включая типичные ошибки на 10x / 60x)
   */
  function buildOptions(correctVal, targetUnit, multipliersPool) {
    const c = cleanFloat(correctVal);
    const distractors = new Set();
    const factors = multipliersPool || [10, 0.1, 100, 0.01, 1000, 0.001];

    // Пытаемся сгенерировать правдоподобные ошибки (сдвиг на порядок, путаница 60/100 и т.п.)
    for (const f of shuffle(factors)) {
      if (distractors.size >= 3) break;
      const cand = cleanFloat(c * f);
      if (cand > 0 && Math.abs(cand - c) > 1e-6 && cand <= 1e8 && String(cand).length <= 10) {
        distractors.add(cand);
      }
    }

    // Если не хватило, добавляем небольшие смещения
    let guard = 0;
    while (distractors.size < 3 && guard < 40) {
      guard++;
      let cand;
      if (c >= 100) {
        cand = cleanFloat(c + pickRandom([-100, -10, 10, 100, -50, 50]));
      } else if (c >= 10) {
        cand = cleanFloat(c + pickRandom([-5, -2, -1, 1, 2, 5, 10]));
      } else if (c >= 1) {
        cand = cleanFloat(c + pickRandom([0.5, 1, 2, -0.5, 1.5]));
      } else {
        cand = cleanFloat(c * pickRandom([2, 5, 10, 0.5]));
      }
      if (cand > 0 && Math.abs(cand - c) > 1e-6) {
        distractors.add(cand);
      }
    }

    const rawOpts = shuffle([c, ...Array.from(distractors).slice(0, 3)]);
    const correctIndex = rawOpts.findIndex(v => Math.abs(v - c) < 1e-6);

    const options = rawOpts.map(v => ({
      value: v,
      text: `${formatDisplayNum(v)} ${targetUnit}`,
      html: `<span class="opt-num">${formatDisplayNum(v)}</span> <span class="opt-unit">${targetUnit}</span>`
    }));

    return { options, correctIndex };
  }

  function makeTask({ category, catName, prompt, exprHtml, answerNum, targetUnit, hint, solutionSteps, distractorsPool }) {
    const ansCanonical = formatCanonical(answerNum);
    const ansDisplay = formatDisplayNum(answerNum);
    const { options, correctIndex } = buildOptions(answerNum, targetUnit, distractorsPool);

    return {
      category,
      catName,
      prompt: prompt || 'Переведите величину в указанные единицы измерения:',
      questionHtml: `<div class="convert-expr">${exprHtml}</div>`,
      answer: ansCanonical,
      displayAnswer: ansDisplay,
      targetUnit,
      unit: targetUnit,
      acceptedAnswers: [
        ansCanonical,
        ansDisplay,
        ansDisplay.replace(/\s+/g, ''),
        `${ansDisplay} ${targetUnit}`,
        `${ansCanonical} ${targetUnit}`
      ],
      options,
      correctOptionIndex: correctIndex,
      hint,
      solutionSteps
    };
  }

  // =========================================================================
  // 1. ДЛИНА (мм, см, дм, м, км)
  // =========================================================================
  function genLengthTask() {
    const mode = pickRandom([
      'compound_m_cm',
      'compound_km_m',
      'compound_dm_mm',
      'simple_down',
      'decimal_down',
      'to_larger_decimal',
      'to_larger_int'
    ]);

    if (mode === 'compound_m_cm') {
      const m = randInt(2, 18);
      const cm = randInt(3, 95);
      const ans = m * 100 + cm;
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${m} м ${cm} см = <span class="q-blank">?</span> см`,
        answerNum: ans,
        targetUnit: 'см',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: 'Вспомните: 1 м = 100 см.',
        solutionSteps: [
          `1 м = 100 см.`,
          `Переводим метры в сантиметры: ${m} м = ${m} × 100 = ${formatDisplayNum(m * 100)} см.`,
          `Прибавляем оставшиеся сантиметры: ${formatDisplayNum(m * 100)} + ${cm} = <strong>${formatDisplayNum(ans)} см</strong>.`
        ]
      });
    }

    if (mode === 'compound_km_m') {
      const km = randInt(1, 14);
      const m = pickRandom([randInt(5, 95), randInt(120, 950)]);
      const ans = km * 1000 + m;
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${km} км ${m} м = <span class="q-blank">?</span> м`,
        answerNum: ans,
        targetUnit: 'м',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: 'В одном километре ровно 1 000 метров.',
        solutionSteps: [
          `1 км = 1 000 м.`,
          `${km} км = ${km} × 1 000 = ${formatDisplayNum(km * 1000)} м.`,
          `${formatDisplayNum(km * 1000)} + ${m} = <strong>${formatDisplayNum(ans)} м</strong>.`
        ]
      });
    }

    if (mode === 'compound_dm_mm') {
      const dm = randInt(2, 15);
      const cm = randInt(1, 9);
      const mm = randInt(2, 9);
      if (Math.random() < 0.5) {
        const ans = dm * 100 + mm;
        return makeTask({
          category: 'length',
          catName: 'Единицы длины',
          exprHtml: `${dm} дм ${mm} мм = <span class="q-blank">?</span> мм`,
          answerNum: ans,
          targetUnit: 'мм',
          distractorsPool: [10, 0.1, 100],
          hint: '1 дм = 10 см = 100 мм.',
          solutionSteps: [
            `1 дм = 100 мм.`,
            `${dm} дм = ${dm} × 100 = ${dm * 100} мм.`,
            `${dm * 100} + ${mm} = <strong>${ans} мм</strong>.`
          ]
        });
      }
      const ans = dm * 10 + cm;
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${dm} дм ${cm} см = <span class="q-blank">?</span> см`,
        answerNum: ans,
        targetUnit: 'см',
        distractorsPool: [10, 0.1, 100],
        hint: '1 дм = 10 см.',
        solutionSteps: [
          `1 дм = 10 см.`,
          `${dm} дм = ${dm * 10} см.`,
          `${dm * 10} + ${cm} = <strong>${ans} см</strong>.`
        ]
      });
    }

    if (mode === 'simple_down') {
      const pairs = [
        { from: 'м', to: 'мм', mult: 1000, val: randInt(2, 16), step: '1 м = 100 см = 1 000 мм' },
        { from: 'см', to: 'мм', mult: 10, val: randInt(12, 85), step: '1 см = 10 мм' },
        { from: 'км', to: 'дм', mult: 10000, val: randInt(2, 9), step: '1 км = 1 000 м, а 1 м = 10 дм ⇒ 1 км = 10 000 дм' },
        { from: 'м', to: 'дм', mult: 10, val: randInt(14, 92), step: '1 м = 10 дм' }
      ];
      const p = pickRandom(pairs);
      const ans = p.val * p.mult;
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${p.val} ${p.from} = <span class="q-blank">?</span> ${p.to}`,
        answerNum: ans,
        targetUnit: p.to,
        distractorsPool: [10, 0.1, 100, 0.01, 1000],
        hint: p.step,
        solutionSteps: [
          p.step + '.',
          `${p.val} × ${formatDisplayNum(p.mult)} = <strong>${formatDisplayNum(ans)} ${p.to}</strong>.`
        ]
      });
    }

    if (mode === 'decimal_down') {
      const templates = [
        { from: 'м', to: 'см', mult: 100, val: cleanFloat(randInt(12, 89) / 10), step: '1 м = 100 см' },
        { from: 'км', to: 'м', mult: 1000, val: cleanFloat(randInt(11, 75) / 10), step: '1 км = 1 000 м' },
        { from: 'см', to: 'мм', mult: 10, val: cleanFloat(randInt(15, 95) / 10), step: '1 см = 10 мм' },
        { from: 'м', to: 'см', mult: 100, val: cleanFloat(randInt(105, 495) / 100), step: '1 м = 100 см' }
      ];
      const t = pickRandom(templates);
      const ans = cleanFloat(t.val * t.mult);
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: ans,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: `${t.step}. Перенесите запятую вправо.`,
        solutionSteps: [
          `${t.step}.`,
          `Умножаем ${formatDisplayNum(t.val)} на ${formatDisplayNum(t.mult)}: запятая сдвигается вправо.`,
          `${formatDisplayNum(t.val)} × ${formatDisplayNum(t.mult)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
        ]
      });
    }

    if (mode === 'to_larger_decimal') {
      const templates = [
        { from: 'см', to: 'м', div: 100, val: randInt(12, 95) * 10 + pickRandom([0, 5]), step: '1 м = 100 см' },
        { from: 'м', to: 'км', div: 1000, val: randInt(12, 85) * 100, step: '1 км = 1 000 м' },
        { from: 'мм', to: 'см', div: 10, val: randInt(14, 98), step: '1 см = 10 мм' },
        { from: 'дм', to: 'м', div: 10, val: randInt(15, 95), step: '1 м = 10 дм' }
      ];
      const t = pickRandom(templates);
      const ans = cleanFloat(t.val / t.div);
      return makeTask({
        category: 'length',
        catName: 'Единицы длины',
        exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: ans,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: `${t.step}. При переходе к более крупным единицам делим на ${formatDisplayNum(t.div)}.`,
        solutionSteps: [
          `${t.step}.`,
          `Делим ${formatDisplayNum(t.val)} на ${formatDisplayNum(t.div)} (переносим запятую влево).`,
          `${formatDisplayNum(t.val)} : ${formatDisplayNum(t.div)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
        ]
      });
    }

    // to_larger_int
    const pairs = [
      { from: 'мм', to: 'см', div: 10, k: randInt(15, 95), step: '1 см = 10 мм' },
      { from: 'см', to: 'м', div: 100, k: randInt(4, 35), step: '1 м = 100 см' },
      { from: 'м', to: 'км', div: 1000, k: randInt(3, 25), step: '1 км = 1 000 м' },
      { from: 'мм', to: 'м', div: 1000, k: randInt(2, 18), step: '1 м = 1 000 мм' }
    ];
    const p = pickRandom(pairs);
    const given = p.k * p.div;
    return makeTask({
      category: 'length',
      catName: 'Единицы длины',
      exprHtml: `${formatDisplayNum(given)} ${p.from} = <span class="q-blank">?</span> ${p.to}`,
      answerNum: p.k,
      targetUnit: p.to,
      distractorsPool: [10, 0.1, 100, 0.01],
      hint: `${p.step}. Разделите на ${formatDisplayNum(p.div)}.`,
      solutionSteps: [
        `${p.step}.`,
        `${formatDisplayNum(given)} : ${formatDisplayNum(p.div)} = <strong>${formatDisplayNum(p.k)} ${p.to}</strong>.`
      ]
    });
  }

  // =========================================================================
  // 2. МАССА (г, кг, ц, т)
  // =========================================================================
  function genMassTask() {
    const mode = pickRandom([
      'compound_kg_g',
      'compound_t_c',
      'compound_c_kg',
      'compound_t_kg',
      'decimal_down',
      'to_larger_decimal',
      'to_larger_int'
    ]);

    if (mode === 'compound_kg_g') {
      const kg = randInt(2, 15);
      const g = pickRandom([randInt(15, 95), randInt(120, 950)]);
      const ans = kg * 1000 + g;
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${kg} кг ${g} г = <span class="q-blank">?</span> г`,
        answerNum: ans,
        targetUnit: 'г',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 кг = 1 000 г.',
        solutionSteps: [
          `1 кг = 1 000 г.`,
          `${kg} кг = ${formatDisplayNum(kg * 1000)} г.`,
          `${formatDisplayNum(kg * 1000)} + ${g} = <strong>${formatDisplayNum(ans)} г</strong>.`
        ]
      });
    }

    if (mode === 'compound_t_c') {
      const t = randInt(2, 14);
      const c = randInt(1, 9);
      const ans = t * 10 + c;
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${t} т ${c} ц = <span class="q-blank">?</span> ц`,
        answerNum: ans,
        targetUnit: 'ц',
        distractorsPool: [10, 0.1, 100],
        hint: 'В 1 тонне ровно 10 центнеров.',
        solutionSteps: [
          `1 т = 10 ц.`,
          `${t} т = ${t * 10} ц.`,
          `${t * 10} + ${c} = <strong>${ans} ц</strong>.`
        ]
      });
    }

    if (mode === 'compound_c_kg') {
      const c = randInt(2, 16);
      const kg = randInt(5, 95);
      const ans = c * 100 + kg;
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${c} ц ${kg} кг = <span class="q-blank">?</span> кг`,
        answerNum: ans,
        targetUnit: 'кг',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: 'В 1 центнере 100 килограммов.',
        solutionSteps: [
          `1 ц = 100 кг.`,
          `${c} ц = ${formatDisplayNum(c * 100)} кг.`,
          `${formatDisplayNum(c * 100)} + ${kg} = <strong>${formatDisplayNum(ans)} кг</strong>.`
        ]
      });
    }

    if (mode === 'compound_t_kg') {
      const t = randInt(1, 9);
      const kg = randInt(15, 850);
      const ans = t * 1000 + kg;
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${t} т ${kg} кг = <span class="q-blank">?</span> кг`,
        answerNum: ans,
        targetUnit: 'кг',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 т = 1 000 кг.',
        solutionSteps: [
          `1 т = 1 000 кг.`,
          `${t} т = ${formatDisplayNum(t * 1000)} кг.`,
          `${formatDisplayNum(t * 1000)} + ${kg} = <strong>${formatDisplayNum(ans)} кг</strong>.`
        ]
      });
    }

    if (mode === 'decimal_down') {
      const templates = [
        { from: 'т', to: 'кг', mult: 1000, val: cleanFloat(randInt(12, 65) / 10), step: '1 т = 1 000 кг' },
        { from: 'ц', to: 'кг', mult: 100, val: cleanFloat(randInt(15, 95) / 10), step: '1 ц = 100 кг' },
        { from: 'кг', to: 'г', mult: 1000, val: cleanFloat(randInt(12, 45) / 10), step: '1 кг = 1 000 г' },
        { from: 'т', to: 'ц', mult: 10, val: cleanFloat(randInt(15, 85) / 10), step: '1 т = 10 ц' }
      ];
      const t = pickRandom(templates);
      const ans = cleanFloat(t.val * t.mult);
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: ans,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: t.step,
        solutionSteps: [
          `${t.step}.`,
          `${formatDisplayNum(t.val)} × ${formatDisplayNum(t.mult)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
        ]
      });
    }

    if (mode === 'to_larger_decimal') {
      const templates = [
        { from: 'г', to: 'кг', div: 1000, val: randInt(12, 95) * 100, step: '1 кг = 1 000 г' },
        { from: 'кг', to: 'ц', div: 100, val: randInt(12, 95) * 10, step: '1 ц = 100 кг' },
        { from: 'кг', to: 'т', div: 1000, val: randInt(5, 45) * 50, step: '1 т = 1 000 кг' },
        { from: 'ц', to: 'т', div: 10, val: randInt(12, 98), step: '1 т = 10 ц' }
      ];
      const t = pickRandom(templates);
      const ans = cleanFloat(t.val / t.div);
      return makeTask({
        category: 'mass',
        catName: 'Единицы массы',
        exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: ans,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: `${t.step}. Разделите на ${formatDisplayNum(t.div)}.`,
        solutionSteps: [
          `${t.step}.`,
          `${formatDisplayNum(t.val)} : ${formatDisplayNum(t.div)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
        ]
      });
    }

    const pairs = [
      { from: 'г', to: 'кг', div: 1000, k: randInt(2, 24), step: '1 кг = 1 000 г' },
      { from: 'кг', to: 'ц', div: 100, k: randInt(3, 35), step: '1 ц = 100 кг' },
      { from: 'кг', to: 'т', div: 1000, k: randInt(2, 18), step: '1 т = 1 000 кг' },
      { from: 'ц', to: 'т', div: 10, k: randInt(3, 25), step: '1 т = 10 ц' }
    ];
    const p = pickRandom(pairs);
    const given = p.k * p.div;
    return makeTask({
      category: 'mass',
      catName: 'Единицы массы',
      exprHtml: `${formatDisplayNum(given)} ${p.from} = <span class="q-blank">?</span> ${p.to}`,
      answerNum: p.k,
      targetUnit: p.to,
      distractorsPool: [10, 0.1, 100, 0.01],
      hint: p.step,
      solutionSteps: [
        `${p.step}.`,
        `${formatDisplayNum(given)} : ${formatDisplayNum(p.div)} = <strong>${formatDisplayNum(p.k)} ${p.to}</strong>.`
      ]
    });
  }

  // =========================================================================
  // 3. ВРЕМЯ (с, мин, ч, сут)
  // =========================================================================
  function genTimeTask() {
    const mode = pickRandom([
      'h_min',
      'min_s',
      'days_h',
      's_to_min',
      'min_to_h',
      'h_to_s',
      'decimal_time'
    ]);

    if (mode === 'h_min') {
      const h = randInt(2, 9);
      const min = randInt(5, 55);
      const ans = h * 60 + min;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${h} ч ${min} мин = <span class="q-blank">?</span> мин`,
        answerNum: ans,
        targetUnit: 'мин',
        distractorsPool: [100 / 60, 0.6, 2, 0.5, 10],
        hint: 'В 1 часе 60 минут (не 100!).',
        solutionSteps: [
          `1 ч = 60 мин.`,
          `${h} ч = ${h} × 60 = ${h * 60} мин.`,
          `${h * 60} + ${min} = <strong>${ans} мин</strong>.`
        ]
      });
    }

    if (mode === 'min_s') {
      const min = randInt(2, 12);
      const s = randInt(5, 55);
      const ans = min * 60 + s;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${min} мин ${s} с = <span class="q-blank">?</span> с`,
        answerNum: ans,
        targetUnit: 'с',
        distractorsPool: [0.6, 10, 0.1, 2],
        hint: '1 мин = 60 с.',
        solutionSteps: [
          `1 мин = 60 с.`,
          `${min} мин = ${min} × 60 = ${min * 60} с.`,
          `${min * 60} + ${s} = <strong>${ans} с</strong>.`
        ]
      });
    }

    if (mode === 'days_h') {
      const d = randInt(2, 6);
      const h = randInt(2, 20);
      const ans = d * 24 + h;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${d} сут ${h} ч = <span class="q-blank">?</span> ч`,
        answerNum: ans,
        targetUnit: 'ч',
        distractorsPool: [2, 0.5, 10],
        hint: 'В одних сутках 24 часа.',
        solutionSteps: [
          `1 сут = 24 ч.`,
          `${d} сут = ${d} × 24 = ${d * 24} ч.`,
          `${d * 24} + ${h} = <strong>${ans} ч</strong>.`
        ]
      });
    }

    if (mode === 's_to_min') {
      const k = randInt(3, 15);
      const s = k * 60;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${s} с = <span class="q-blank">?</span> мин`,
        answerNum: k,
        targetUnit: 'мин',
        distractorsPool: [10, 2, 0.5, 6],
        hint: 'Разделите количество секунд на 60.',
        solutionSteps: [
          `1 мин = 60 с.`,
          `${s} : 60 = <strong>${k} мин</strong>.`
        ]
      });
    }

    if (mode === 'min_to_h') {
      const k = randInt(2, 12);
      const min = k * 60;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${min} мин = <span class="q-blank">?</span> ч`,
        answerNum: k,
        targetUnit: 'ч',
        distractorsPool: [10, 2, 0.5, 6],
        hint: 'Разделите количество минут на 60.',
        solutionSteps: [
          `1 ч = 60 мин.`,
          `${min} : 60 = <strong>${k} ч</strong>.`
        ]
      });
    }

    if (mode === 'h_to_s') {
      const h = randInt(2, 5);
      const ans = h * 3600;
      return makeTask({
        category: 'time',
        catName: 'Единицы времени',
        exprHtml: `${h} ч = <span class="q-blank">?</span> с`,
        answerNum: ans,
        targetUnit: 'с',
        distractorsPool: [0.1, 10, 0.0166667],
        hint: 'В 1 часе 60 минут, а в каждой минуте 60 секунд: 1 ч = 60 × 60 = 3 600 с.',
        solutionSteps: [
          `1 ч = 60 мин = 60 × 60 с = 3 600 с.`,
          `${h} ч = ${h} × 3 600 = <strong>${formatDisplayNum(ans)} с</strong>.`
        ]
      });
    }

    // decimal_time (хорошие десятичные части: 0,25 / 0,5 / 0,75 / 1,5 / 2,5)
    const templates = [
      { expr: '1,5 ч', target: 'мин', ans: 90, step: '1,5 × 60 = 60 + 30 = 90 мин' },
      { expr: '2,5 ч', target: 'мин', ans: 150, step: '2,5 × 60 = 120 + 30 = 150 мин' },
      { expr: '0,5 ч', target: 'мин', ans: 30, step: '0,5 × 60 = 30 мин (полчаса)' },
      { expr: '0,25 ч', target: 'мин', ans: 15, step: '0,25 × 60 = 60 : 4 = 15 мин (четверть часа)' },
      { expr: '1,5 мин', target: 'с', ans: 90, step: '1,5 × 60 = 90 с' },
      { expr: '45 мин', target: 'ч', ans: 0.75, step: '45 : 60 = 3/4 = 0,75 ч' },
      { expr: '15 мин', target: 'ч', ans: 0.25, step: '15 : 60 = 1/4 = 0,25 ч' },
      { expr: '90 мин', target: 'ч', ans: 1.5, step: '90 : 60 = 1,5 ч' },
      { expr: '36 ч', target: 'сут', ans: 1.5, step: '36 : 24 = 1,5 сут' }
    ];
    const t = pickRandom(templates);
    return makeTask({
      category: 'time',
      catName: 'Единицы времени',
      exprHtml: `${t.expr} = <span class="q-blank">?</span> ${t.target}`,
      answerNum: t.ans,
      targetUnit: t.target,
      distractorsPool: [2, 0.5, 10, 0.1],
      hint: 'Переводите через 60 (для часов/минут/секунд) или 24 (для суток).',
      solutionSteps: [t.step + '.']
    });
  }

  // =========================================================================
  // 4. ПЛОЩАДЬ (мм², см², дм², м², а, га, км²)
  // =========================================================================
  function genAreaTask() {
    const mode = pickRandom([
      'ha_to_m2',
      'a_to_m2',
      'km2_to_ha',
      'm2_dm2_cm2',
      'compound_ha_a',
      'to_larger_area',
      'decimal_area'
    ]);

    if (mode === 'ha_to_m2') {
      const ha = randInt(2, 18);
      const ans = ha * 10000;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${ha} га = <span class="q-blank">?</span> м²`,
        answerNum: ans,
        targetUnit: 'м²',
        distractorsPool: [0.1, 0.01, 10, 100],
        hint: '1 га (гектар) — это квадрат 100 м × 100 м = 10 000 м².',
        solutionSteps: [
          `1 га = 10 000 м².`,
          `${ha} × 10 000 = <strong>${formatDisplayNum(ans)} м²</strong>.`
        ]
      });
    }

    if (mode === 'a_to_m2') {
      const a = randInt(3, 25);
      const m2 = randInt(5, 95);
      if (Math.random() < 0.5) {
        const ans = a * 100 + m2;
        return makeTask({
          category: 'area',
          catName: 'Единицы площади',
          exprHtml: `${a} а ${m2} м² = <span class="q-blank">?</span> м²`,
          answerNum: ans,
          targetUnit: 'м²',
          distractorsPool: [10, 0.1, 100],
          hint: '1 а (ар, или «сотка») = 10 м × 10 м = 100 м².',
          solutionSteps: [
            `1 а = 100 м².`,
            `${a} а = ${formatDisplayNum(a * 100)} м².`,
            `${formatDisplayNum(a * 100)} + ${m2} = <strong>${formatDisplayNum(ans)} м²</strong>.`
          ]
        });
      }
      const ans = a * 100;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${a} а = <span class="q-blank">?</span> м²`,
        answerNum: ans,
        targetUnit: 'м²',
        distractorsPool: [10, 0.1, 100],
        hint: '1 а (сотка) = 100 м².',
        solutionSteps: [
          `1 а = 100 м².`,
          `${a} × 100 = <strong>${formatDisplayNum(ans)} м²</strong>.`
        ]
      });
    }

    if (mode === 'km2_to_ha') {
      const km2 = randInt(2, 15);
      const ans = km2 * 100;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${km2} км² = <span class="q-blank">?</span> га`,
        answerNum: ans,
        targetUnit: 'га',
        distractorsPool: [10, 0.1, 100],
        hint: '1 км² = 1 000 000 м², а 1 га = 10 000 м², значит 1 км² = 100 га.',
        solutionSteps: [
          `1 км² = 100 га.`,
          `${km2} × 100 = <strong>${formatDisplayNum(ans)} га</strong>.`
        ]
      });
    }

    if (mode === 'm2_dm2_cm2') {
      const templates = [
        { from: 'м²', to: 'дм²', mult: 100, val: randInt(3, 28), step: '1 м = 10 дм ⇒ 1 м² = 10 × 10 = 100 дм²' },
        { from: 'дм²', to: 'см²', mult: 100, val: randInt(4, 35), step: '1 дм = 10 см ⇒ 1 дм² = 10 × 10 = 100 см²' },
        { from: 'см²', to: 'мм²', mult: 100, val: randInt(5, 42), step: '1 см = 10 мм ⇒ 1 см² = 10 × 10 = 100 мм²' },
        { from: 'м²', to: 'см²', mult: 10000, val: randInt(2, 12), step: '1 м = 100 см ⇒ 1 м² = 100 × 100 = 10 000 см²' }
      ];
      const t = pickRandom(templates);
      const ans = t.val * t.mult;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${t.val} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: ans,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 0.01, 100],
        hint: 'У линейного шага коэффициент возводится в квадрат.',
        solutionSteps: [
          `${t.step}.`,
          `${t.val} × ${formatDisplayNum(t.mult)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
        ]
      });
    }

    if (mode === 'compound_ha_a') {
      const ha = randInt(2, 12);
      const a = randInt(5, 95);
      const ans = ha * 100 + a;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${ha} га ${a} а = <span class="q-blank">?</span> а`,
        answerNum: ans,
        targetUnit: 'а',
        distractorsPool: [10, 0.1, 100],
        hint: 'В 1 гектаре ровно 100 ар (соток).',
        solutionSteps: [
          `1 га = 100 а.`,
          `${ha} га = ${formatDisplayNum(ha * 100)} а.`,
          `${formatDisplayNum(ha * 100)} + ${a} = <strong>${formatDisplayNum(ans)} а</strong>.`
        ]
      });
    }

    if (mode === 'to_larger_area') {
      const templates = [
        { from: 'м²', to: 'га', div: 10000, k: randInt(2, 15), step: '1 га = 10 000 м²' },
        { from: 'м²', to: 'а', div: 100, k: randInt(3, 45), step: '1 а = 100 м²' },
        { from: 'см²', to: 'дм²', div: 100, k: randInt(4, 38), step: '1 дм² = 100 см²' },
        { from: 'дм²', to: 'м²', div: 100, k: randInt(2, 29), step: '1 м² = 100 дм²' },
        { from: 'мм²', to: 'см²', div: 100, k: randInt(5, 64), step: '1 см² = 100 мм²' }
      ];
      const t = pickRandom(templates);
      const given = t.k * t.div;
      return makeTask({
        category: 'area',
        catName: 'Единицы площади',
        exprHtml: `${formatDisplayNum(given)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: t.k,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: t.step,
        solutionSteps: [
          `${t.step}.`,
          `${formatDisplayNum(given)} : ${formatDisplayNum(t.div)} = <strong>${formatDisplayNum(t.k)} ${t.to}</strong>.`
        ]
      });
    }

    // decimal_area
    const templates = [
      { from: 'га', to: 'м²', mult: 10000, val: cleanFloat(randInt(12, 65) / 10), step: '1 га = 10 000 м²' },
      { from: 'м²', to: 'га', mult: 0.0001, val: randInt(12, 85) * 1000, step: '1 га = 10 000 м²' },
      { from: 'а', to: 'м²', mult: 100, val: cleanFloat(randInt(15, 75) / 10), step: '1 а = 100 м²' },
      { from: 'м²', to: 'дм²', mult: 100, val: cleanFloat(randInt(14, 85) / 10), step: '1 м² = 100 дм²' }
    ];
    const t = pickRandom(templates);
    const ans = cleanFloat(t.val * t.mult);
    return makeTask({
      category: 'area',
      catName: 'Единицы площади',
      exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
      answerNum: ans,
      targetUnit: t.to,
      distractorsPool: [10, 0.1, 100, 0.01],
      hint: t.step,
      solutionSteps: [
        `${t.step}.`,
        t.mult >= 1
          ? `${formatDisplayNum(t.val)} × ${formatDisplayNum(t.mult)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
          : `${formatDisplayNum(t.val)} : ${formatDisplayNum(Math.round(1 / t.mult))} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
      ]
    });
  }

  // =========================================================================
  // 5. ОБЪЁМ (мм³, см³, дм³, л, м³)
  // =========================================================================
  function genVolumeTask() {
    const mode = pickRandom([
      'm3_to_l',
      'l_to_cm3',
      'dm3_cm3',
      'cm3_mm3',
      'compound_l_cm3',
      'to_larger_vol',
      'decimal_vol'
    ]);

    if (mode === 'm3_to_l') {
      const m3 = randInt(2, 18);
      const ans = m3 * 1000;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${m3} м³ = <span class="q-blank">?</span> л`,
        answerNum: ans,
        targetUnit: 'л',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 л = 1 дм³, а в 1 м³ содержится 1 000 дм³.',
        solutionSteps: [
          `1 м³ = 1 000 дм³, и 1 л = 1 дм³ ⇒ 1 м³ = 1 000 л.`,
          `${m3} × 1 000 = <strong>${formatDisplayNum(ans)} л</strong>.`
        ]
      });
    }

    if (mode === 'l_to_cm3') {
      const l = randInt(2, 16);
      const ans = l * 1000;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${l} л = <span class="q-blank">?</span> см³`,
        answerNum: ans,
        targetUnit: 'см³',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 л = 1 дм³ = 1 000 см³.',
        solutionSteps: [
          `1 л = 1 дм³ = 10 × 10 × 10 см³ = 1 000 см³.`,
          `${l} × 1 000 = <strong>${formatDisplayNum(ans)} см³</strong>.`
        ]
      });
    }

    if (mode === 'dm3_cm3') {
      const dm3 = randInt(2, 14);
      const cm3 = randInt(20, 950);
      if (Math.random() < 0.5) {
        const ans = dm3 * 1000 + cm3;
        return makeTask({
          category: 'volume',
          catName: 'Единицы объёма',
          exprHtml: `${dm3} дм³ ${cm3} см³ = <span class="q-blank">?</span> см³`,
          answerNum: ans,
          targetUnit: 'см³',
          distractorsPool: [10, 0.1, 100, 0.01],
          hint: '1 дм³ = 1 000 см³.',
          solutionSteps: [
            `1 дм³ = 1 000 см³.`,
            `${dm3} дм³ = ${formatDisplayNum(dm3 * 1000)} см³.`,
            `${formatDisplayNum(dm3 * 1000)} + ${cm3} = <strong>${formatDisplayNum(ans)} см³</strong>.`
          ]
        });
      }
      const ans = dm3 * 1000;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${dm3} дм³ = <span class="q-blank">?</span> см³`,
        answerNum: ans,
        targetUnit: 'см³',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 дм = 10 см ⇒ 1 дм³ = 10³ = 1 000 см³.',
        solutionSteps: [
          `1 дм³ = 1 000 см³.`,
          `${dm3} × 1 000 = <strong>${formatDisplayNum(ans)} см³</strong>.`
        ]
      });
    }

    if (mode === 'cm3_mm3') {
      const cm3 = randInt(2, 24);
      const ans = cm3 * 1000;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${cm3} см³ = <span class="q-blank">?</span> мм³`,
        answerNum: ans,
        targetUnit: 'мм³',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 см = 10 мм ⇒ 1 см³ = 10 × 10 × 10 = 1 000 мм³.',
        solutionSteps: [
          `1 см³ = 1 000 мм³.`,
          `${cm3} × 1 000 = <strong>${formatDisplayNum(ans)} мм³</strong>.`
        ]
      });
    }

    if (mode === 'compound_l_cm3') {
      const m3 = randInt(2, 9);
      const l = randInt(15, 850);
      const ans = m3 * 1000 + l;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${m3} м³ ${l} л = <span class="q-blank">?</span> л`,
        answerNum: ans,
        targetUnit: 'л',
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: '1 м³ = 1 000 дм³ = 1 000 л.',
        solutionSteps: [
          `1 м³ = 1 000 л.`,
          `${m3} м³ = ${formatDisplayNum(m3 * 1000)} л.`,
          `${formatDisplayNum(m3 * 1000)} + ${l} = <strong>${formatDisplayNum(ans)} л</strong>.`
        ]
      });
    }

    if (mode === 'to_larger_vol') {
      const templates = [
        { from: 'л', to: 'м³', div: 1000, k: randInt(2, 25), step: '1 м³ = 1 000 л' },
        { from: 'дм³', to: 'м³', div: 1000, k: randInt(3, 19), step: '1 м³ = 1 000 дм³' },
        { from: 'см³', to: 'дм³', div: 1000, k: randInt(4, 32), step: '1 дм³ = 1 000 см³' },
        { from: 'см³', to: 'л', div: 1000, k: randInt(2, 18), step: '1 л = 1 000 см³' },
        { from: 'мм³', to: 'см³', div: 1000, k: randInt(5, 40), step: '1 см³ = 1 000 мм³' }
      ];
      const t = pickRandom(templates);
      const given = t.k * t.div;
      return makeTask({
        category: 'volume',
        catName: 'Единицы объёма',
        exprHtml: `${formatDisplayNum(given)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
        answerNum: t.k,
        targetUnit: t.to,
        distractorsPool: [10, 0.1, 100, 0.01],
        hint: t.step,
        solutionSteps: [
          `${t.step}.`,
          `${formatDisplayNum(given)} : ${formatDisplayNum(t.div)} = <strong>${formatDisplayNum(t.k)} ${t.to}</strong>.`
        ]
      });
    }

    // decimal_vol
    const templates = [
      { from: 'м³', to: 'л', mult: 1000, val: cleanFloat(randInt(12, 65) / 10), step: '1 м³ = 1 000 л' },
      { from: 'м³', to: 'дм³', mult: 1000, val: cleanFloat(randInt(15, 85) / 10), step: '1 м³ = 1 000 дм³' },
      { from: 'см³', to: 'л', mult: 0.001, val: randInt(15, 95) * 100, step: '1 л = 1 000 см³' },
      { from: 'л', to: 'м³', mult: 0.001, val: randInt(12, 85) * 100, step: '1 м³ = 1 000 л' }
    ];
    const t = pickRandom(templates);
    const ans = cleanFloat(t.val * t.mult);
    return makeTask({
      category: 'volume',
      catName: 'Единицы объёма',
      exprHtml: `${formatDisplayNum(t.val)} ${t.from} = <span class="q-blank">?</span> ${t.to}`,
      answerNum: ans,
      targetUnit: t.to,
      distractorsPool: [10, 0.1, 100, 0.01],
      hint: t.step,
      solutionSteps: [
        `${t.step}.`,
        t.mult >= 1
          ? `${formatDisplayNum(t.val)} × ${formatDisplayNum(t.mult)} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
          : `${formatDisplayNum(t.val)} : ${formatDisplayNum(Math.round(1 / t.mult))} = <strong>${formatDisplayNum(ans)} ${t.to}</strong>.`
      ]
    });
  }

  const GENERATORS = {
    length: genLengthTask,
    mass: genMassTask,
    time: genTimeTask,
    area: genAreaTask,
    volume: genVolumeTask
  };

  function generateTask(category) {
    let cat = String(category || 'all').trim();
    if (cat.startsWith('units_')) {
      cat = cat.replace('units_', '');
    }

    if (GENERATORS[cat]) {
      return GENERATORS[cat]();
    }

    const keys = Object.keys(GENERATORS);
    return GENERATORS[pickRandom(keys)]();
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не указан' };
    }

    if (typeof rawUserAnswer === 'number' && rawUserAnswer >= 0 && rawUserAnswer <= 3) {
      const isCorrect = rawUserAnswer === task.correctOptionIndex;
      return {
        isCorrect,
        correctIndex: task.correctOptionIndex,
        userIndex: rawUserAnswer,
        displayAnswer: `${task.displayAnswer} ${task.targetUnit || ''}`.trim()
      };
    }

    const rawStr = String(rawUserAnswer).trim();
    if (!rawStr) {
      return { isCorrect: false, error: 'Введите ответ' };
    }

    // Убираем возможные единицы измерения в конце ввода (напр. "407 см" -> "407")
    const stripped = normalizeUserInput(rawStr).replace(/[а-яёa-z²³]+$/i, '');
    const uNum = Number(stripped);
    const cNum = Number(normalizeUserInput(task.answer));

    if (stripped !== '' && !Number.isNaN(uNum) && !Number.isNaN(cNum)) {
      if (Math.abs(uNum - cNum) < 1e-5) {
        return { isCorrect: true, displayAnswer: `${task.displayAnswer} ${task.targetUnit || ''}`.trim() };
      }
    }

    if (Array.isArray(task.acceptedAnswers)) {
      const uNorm = normalizeUserInput(rawStr).toLowerCase();
      for (const acc of task.acceptedAnswers) {
        if (normalizeUserInput(acc).toLowerCase() === uNorm) {
          return { isCorrect: true, displayAnswer: `${task.displayAnswer} ${task.targetUnit || ''}`.trim() };
        }
      }
    }

    return {
      isCorrect: false,
      displayAnswer: `${task.displayAnswer} ${task.targetUnit || ''}`.trim()
    };
  }

  return {
    generateTask,
    checkAnswer,
    GENERATORS,
    formatDisplayNum
  };
}));
