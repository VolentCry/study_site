/**
 * Тренажёр ОГЭ по информатике · Задание №8
 * «Запросы для поисковых систем с логическими выражениями (Круги Эйлера)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask8Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const PAIRS_TOPICS = [
    ['Рыбак', 'Рыбка'],
    ['Шпага', 'Шляпа'],
    ['Мороз', 'Солнце'],
    ['Лицей', 'Пушкин'],
    ['Волга', 'Кама'],
    ['Фрегат', 'Эсминец'],
    ['Комета', 'Астероид'],
    ['Клён', 'Берёза']
  ];

  const TRIPLES_TOPICS = [
    ['Пушкин', 'Лермонтов', 'Толстой'],
    ['Москва', 'Питер', 'Казань'],
    ['Угол', 'Прямая', 'Треугольник'],
    ['Байкал', 'Ангара', 'Енисей'],
    ['Питон', 'Паскаль', 'Си'],
    ['Сириус', 'Вега', 'Альтаир']
  ];

  function buildVenn2Svg(aName, bName) {
    return `
      <div class="inf-svg-wrap">
        <svg class="inf-svg-graph" viewBox="0 0 380 185" role="img" aria-label="Диаграмма Эйлера для двух множеств">
          <circle cx="145" cy="95" r="64" fill="rgba(44,230,214,0.14)" stroke="var(--accent)" stroke-width="2" />
          <circle cx="235" cy="95" r="64" fill="rgba(255,119,40,0.14)" stroke="var(--warm)" stroke-width="2" />
          <text x="108" y="98" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="var(--svg-node-text)">N1</text>
          <text x="190" y="98" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="var(--svg-node-text)">N2</text>
          <text x="272" y="98" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="var(--svg-node-text)">N3</text>
          <text x="115" y="22" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="700" fill="var(--accent)">${aName}</text>
          <text x="265" y="22" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="700" fill="var(--warm)">${bName}</text>
        </svg>
      </div>
    `.trim();
  }

  function buildVenn3Svg(aName, bName, cName) {
    return `
      <div class="inf-svg-wrap">
        <svg class="inf-svg-graph" viewBox="0 0 440 185" role="img" aria-label="Диаграмма Эйлера для трёх множеств (A и C не пересекаются)">
          <circle cx="130" cy="98" r="58" fill="rgba(44,230,214,0.13)" stroke="var(--accent)" stroke-width="2" />
          <circle cx="220" cy="98" r="58" fill="rgba(255,119,40,0.13)" stroke="var(--warm)" stroke-width="2" />
          <circle cx="310" cy="98" r="58" fill="rgba(46,213,115,0.13)" stroke="var(--success)" stroke-width="2" />
          <text x="98" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--svg-node-text)">1</text>
          <text x="175" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--svg-node-text)">2</text>
          <text x="220" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--svg-node-text)">3</text>
          <text x="265" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--svg-node-text)">4</text>
          <text x="342" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--svg-node-text)">5</text>
          <text x="115" y="26" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="700" fill="var(--accent)">${aName}</text>
          <text x="220" y="26" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="700" fill="var(--warm)">${bName}</text>
          <text x="325" y="26" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="700" fill="var(--success)">${cName}</text>
        </svg>
      </div>
    `.trim();
  }

  function buildQueryTableHtml(rows) {
    return `
      <div class="inf-table-wrap">
        <table class="inf-table">
          <thead><tr><th>Запрос</th><th>Найдено страниц (в тыс.)</th></tr></thead>
          <tbody>
            ${rows.map(([q, val]) => `<tr><td style="text-align:left;">${q}</td><td>${val}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `.trim();
  }

  function genTwoSets() {
    const [A, B] = pickRandom(PAIRS_TOPICS);
    const n1 = randInt(80, 450);
    const n2 = randInt(40, 220);
    const n3 = randInt(80, 450);

    const valA = n1 + n2;
    const valB = n2 + n3;
    const valAnd = n2;
    const valOr = n1 + n2 + n3;

    const askType = pickRandom(['or', 'and', 'one']);
    let rows, targetQuery, ans, formulaStep;

    if (askType === 'or') {
      rows = [[A, valA], [B, valB], [`${A} &amp; ${B}`, valAnd]];
      targetQuery = `${A} | ${B}`;
      ans = valOr;
      formulaStep = `N(${A} | ${B}) = N(${A}) + N(${B}) − N(${A} &amp; ${B}) = ${valA} + ${valB} − ${valAnd} = <strong>${ans}</strong>.`;
    } else if (askType === 'and') {
      rows = [[A, valA], [B, valB], [`${A} | ${B}`, valOr]];
      targetQuery = `${A} &amp; ${B}`;
      ans = valAnd;
      formulaStep = `N(${A} &amp; ${B}) = N(${A}) + N(${B}) − N(${A} | ${B}) = ${valA} + ${valB} − ${valOr} = <strong>${ans}</strong>.`;
    } else {
      rows = [[A, valA], [`${A} &amp; ${B}`, valAnd], [`${A} | ${B}`, valOr]];
      targetQuery = B;
      ans = valB;
      formulaStep = `N(${B}) = N(${A} | ${B}) − N(${A}) + N(${A} &amp; ${B}) = ${valOr} − ${valA} + ${valAnd} = <strong>${ans}</strong>.`;
    }

    const questionHtml = `
      <p>В языке запросов поискового сервера для обозначения логической операции «ИЛИ» используется символ <code>|</code>, а для обозначения логической операции «И» — символ <code>&amp;</code>.</p>
      <p>В таблице приведены запросы и количество найденных по ним страниц некоторого сегмента сети Интернет:</p>
      ${buildQueryTableHtml(rows)}
      <p>Какое количество страниц (в тысячах) будет найдено по запросу <strong>${targetQuery}</strong>?</p>
    `.trim();

    return {
      category: 'two_sets',
      catName: 'Два множества (И / ИЛИ)',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: 'Используйте формулу включений-исключений: N(A | B) = N(A) + N(B) − N(A & B).',
      solutionSteps: [
        `Изобразим круги Эйлера: ${buildVenn2Svg(A, B)}`,
        `Здесь N(${A}) = N1 + N2, N(${B}) = N2 + N3, N(${A} &amp; ${B}) = N2, N(${A} | ${B}) = N1 + N2 + N3.`,
        formulaStep
      ]
    };
  }

  function genThreeSets() {
    const [A, B, C] = pickRandom(TRIPLES_TOPICS);
    // Модель с непересекающимися A и C (N(A & C) = 0), классика ОГЭ
    const r1 = randInt(60, 220);
    const r2 = randInt(30, 120);
    const r3 = randInt(50, 200);
    const r4 = randInt(30, 120);
    const r5 = randInt(60, 220);

    const nA = r1 + r2;
    const nB = r2 + r3 + r4;
    const nC = r4 + r5;
    const nAB = r2;
    const nBC = r4;
    const nAC = 0;
    const nAllOr = r1 + r2 + r3 + r4 + r5;
    const nBandAorC = r2 + r4; // B & (A | C)

    const variant = pickRandom(['find_all_or', 'find_b_and_ac', 'find_ab']);
    let rows, targetQuery, ans, explanation;

    if (variant === 'find_all_or') {
      rows = [
        [A, nA],
        [B, nB],
        [C, nC],
        [`${A} &amp; ${B}`, nAB],
        [`${B} &amp; ${C}`, nBC],
        [`${A} &amp; ${C}`, nAC]
      ];
      targetQuery = `${A} | ${B} | ${C}`;
      ans = nAllOr;
      explanation = `Так как ${A} &amp; ${C} = 0, множества ${A} и ${C} не пересекаются. Тогда N(${A}|${B}|${C}) = N(${A}) + N(${B}) + N(${C}) − N(${A}&amp;${B}) − N(${B}&amp;${C}) = ${nA} + ${nB} + ${nC} − ${nAB} − ${nBC} = <strong>${ans}</strong>.`;
    } else if (variant === 'find_b_and_ac') {
      rows = [
        [`${A} &amp; ${B}`, nAB],
        [`${B} &amp; ${C}`, nBC],
        [`${A} &amp; ${B} &amp; ${C}`, 0]
      ];
      targetQuery = `${B} &amp; (${A} | ${C})`;
      ans = nBandAorC;
      explanation = `По закону дистрибутивности ${B} &amp; (${A} | ${C}) = (${A} &amp; ${B}) | (${B} &amp; ${C}). Так как тройное пересечение равно 0, сумма равна ${nAB} + ${nBC} = <strong>${ans}</strong>.`;
    } else {
      rows = [
        [A, nA],
        [B, nB],
        [C, nC],
        [`${A} | ${B} | ${C}`, nAllOr],
        [`${B} &amp; ${C}`, nBC],
        [`${A} &amp; ${C}`, 0]
      ];
      targetQuery = `${A} &amp; ${B}`;
      ans = nAB;
      explanation = `Так как ${A} &amp; ${C} = 0, из формулы для трёх кругов: N(${A}&amp;${B}) = N(${A}) + N(${B}) + N(${C}) − N(${B}&amp;${C}) − N(${A}|${B}|${C}) = ${nA} + ${nB} + ${nC} − ${nBC} − ${nAllOr} = <strong>${ans}</strong>.`;
    }

    const questionHtml = `
      <p>В языке запросов поискового сервера для обозначения логической операции «ИЛИ» используется символ <code>|</code>, а для обозначения логической операции «И» — символ <code>&amp;</code>.</p>
      <p>В таблице приведены запросы и количество найденных по ним страниц:</p>
      ${buildQueryTableHtml(rows)}
      <p>Какое количество страниц (в тысячах) будет найдено по запросу <strong>${targetQuery}</strong>?</p>
    `.trim();

    return {
      category: 'three_sets',
      catName: 'Три множества',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: 'Обратите внимание на нулевое пересечение — оно означает, что крайние круги Эйлера не пересекаются и схема выстраивается в цепочку из 5 областей.',
      solutionSteps: [
        `Построим диаграмму Эйлера-Венна для трёх множеств (с учётом нулевого пересечения): ${buildVenn3Svg(A, B, C)}`,
        explanation
      ]
    };
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'two_sets':
        return genTwoSets();
      case 'three_sets':
        return genThreeSets();
      case 'mixed_all':
      default:
        return pickRandom([genTwoSets, genThreeSets])();
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
      { id: 'two_sets', title: 'Два множества' },
      { id: 'three_sets', title: 'Три множества' }
    ]
  };
}));
