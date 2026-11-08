/**
 * Тренажёр ОГЭ по математике · Задание №11
 * «Функции и их графики: параболы, прямые, гиперболы, чтение свойств и формул»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask11Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

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

  function formatNum(n) {
    const rounded = Math.round(n * 1000) / 1000;
    return String(rounded).replace('.', ',');
  }

  /* --------------------------------------------------------------------------
     ФОРМАТИРОВАНИЕ ФОРМУЛ
     -------------------------------------------------------------------------- */
  function formatLinearFormula(k, b) {
    let kStr = '';
    if (k === 1) kStr = 'x';
    else if (k === -1) kStr = '-x';
    else if (k !== 0) kStr = `${formatNum(k)}x`;

    let bStr = '';
    if (b > 0) bStr = kStr ? ` + ${formatNum(b)}` : `${formatNum(b)}`;
    else if (b < 0) bStr = kStr ? ` - ${formatNum(Math.abs(b))}` : `-${formatNum(Math.abs(b))}`;

    const expr = (kStr + bStr) || '0';
    return `y = ${expr}`;
  }

  function formatQuadFormula(a, b, c) {
    let aStr = '';
    if (a === 1) aStr = 'x²';
    else if (a === -1) aStr = '-x²';
    else if (a !== 0) aStr = `${formatNum(a)}x²`;

    let bStr = '';
    if (b === 1) bStr = aStr ? ' + x' : 'x';
    else if (b === -1) bStr = aStr ? ' - x' : '-x';
    else if (b > 0) bStr = aStr ? ` + ${formatNum(b)}x` : `${formatNum(b)}x`;
    else if (b < 0) bStr = aStr ? ` - ${formatNum(Math.abs(b))}x` : `-${formatNum(Math.abs(b))}x`;

    let cStr = '';
    if (c > 0) cStr = (aStr || bStr) ? ` + ${formatNum(c)}` : `${formatNum(c)}`;
    else if (c < 0) cStr = (aStr || bStr) ? ` - ${formatNum(Math.abs(c))}` : `-${formatNum(Math.abs(c))}`;

    const expr = (aStr + bStr + cStr) || '0';
    return `y = ${expr}`;
  }

  function formatHyperbolaFormula(k, formatType = 'standard') {
    if (formatType === 'one_over_2x') {
      return `y = 1 / (2x)`;
    }
    if (formatType === 'minus_one_over_2x') {
      return `y = -1 / (2x)`;
    }
    if (k > 0) {
      return `y = ${formatNum(k)} / x`;
    } else {
      return `y = -${formatNum(Math.abs(k))} / x`;
    }
  }

  function formulaToHtml(formulaStr) {
    // Красивое отображение дробей в HTML: y = k / x -> y = <span class="fraction">...</span>
    let html = formulaStr;
    const hypMatch = html.match(/^y\s*=\s*(-?)\s*(\d+)\s*\/\s*(\d*x)$/);
    if (hypMatch) {
      const sign = hypMatch[1] === '-' ? '- ' : '';
      const num = hypMatch[2];
      const den = hypMatch[3];
      return `y = ${sign}<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
    }
    return html.replace(/x²/g, 'x<sup>2</sup>');
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОР SVG ДЕКАРТОВОЙ ПЛОСКОСТИ
     -------------------------------------------------------------------------- */
  const SVG_SIZE = 210;
  const CX = 105;
  const CY = 105;
  const SCALE = 17; // 1 единица = 17px. Диапазон [-5, 5] -> [-85, +85] -> [20, 190]
  const MIN_UNIT = -5;
  const MAX_UNIT = 5;

  function toSvgX(x) { return CX + x * SCALE; }
  function toSvgY(y) { return CY - y * SCALE; }

  function renderGridSvg(graphContent, label = '', keyPoints = []) {
    const clipId = 'clip-' + Math.random().toString(36).substring(2, 8);
    const clipBoxX = toSvgX(MIN_UNIT);
    const clipBoxY = toSvgY(MAX_UNIT);
    const clipBoxW = (MAX_UNIT - MIN_UNIT) * SCALE;
    const clipBoxH = (MAX_UNIT - MIN_UNIT) * SCALE;

    // Сетка
    let gridLines = '';
    for (let u = MIN_UNIT; u <= MAX_UNIT; u++) {
      if (u === 0) continue;
      const gx = toSvgX(u);
      const gy = toSvgY(u);
      gridLines += `<line x1="${gx}" y1="${clipBoxY}" x2="${gx}" y2="${clipBoxY + clipBoxH}" stroke="rgba(38,63,97,0.14)" stroke-width="1" />`;
      gridLines += `<line x1="${clipBoxX}" y1="${gy}" x2="${clipBoxX + clipBoxW}" y2="${gy}" stroke="rgba(38,63,97,0.14)" stroke-width="1" />`;
    }

    // Оси
    const axisColor = '#202a3a';
    const axisX = `
      <line x1="${clipBoxX - 8}" y1="${CY}" x2="${clipBoxX + clipBoxW + 12}" y2="${CY}" stroke="${axisColor}" stroke-width="1.6" />
      <polygon points="${clipBoxX + clipBoxW + 14},${CY} ${clipBoxX + clipBoxW + 7},${CY - 3.5} ${clipBoxX + clipBoxW + 7},${CY + 3.5}" fill="${axisColor}" />
      <text x="${clipBoxX + clipBoxW + 10}" y="${CY + 14}" font-size="11" font-weight="700" font-family="'DM Sans', sans-serif" fill="${axisColor}">x</text>
    `;
    const axisY = `
      <line x1="${CX}" y1="${clipBoxY + clipBoxH + 8}" x2="${CX}" y2="${clipBoxY - 12}" stroke="${axisColor}" stroke-width="1.6" />
      <polygon points="${CX},${clipBoxY - 14} ${CX - 3.5},${clipBoxY - 7} ${CX + 3.5},${clipBoxY - 7}" fill="${axisColor}" />
      <text x="${CX - 13}" y="${clipBoxY - 5}" font-size="11" font-weight="700" font-family="'DM Sans', sans-serif" fill="${axisColor}">y</text>
    `;

    // Засечки 1 и 0
    const tick1X = toSvgX(1);
    const tick1Y = toSvgY(1);
    const ticks = `
      <line x1="${tick1X}" y1="${CY - 3}" x2="${tick1X}" y2="${CY + 3}" stroke="${axisColor}" stroke-width="1.5" />
      <text x="${tick1X - 2}" y="${CY + 13}" font-size="9" font-family="'DM Sans', sans-serif" font-weight="700" fill="var(--muted, #697383)">1</text>
      <line x1="${CX - 3}" y1="${tick1Y}" x2="${CX + 3}" y2="${tick1Y}" stroke="${axisColor}" stroke-width="1.5" />
      <text x="${CX - 11}" y="${tick1Y + 3}" font-size="9" font-family="'DM Sans', sans-serif" font-weight="700" fill="var(--muted, #697383)">1</text>
      <text x="${CX - 9}" y="${CY + 11}" font-size="9" font-family="'DM Sans', sans-serif" font-weight="600" fill="var(--muted, #697383)">0</text>
    `;

    // Контрольные точки
    let pointsSvg = '';
    keyPoints.forEach(pt => {
      const px = toSvgX(pt[0]);
      const py = toSvgY(pt[1]);
      pointsSvg += `
        <circle cx="${px}" cy="${py}" r="3.5" fill="#b7464e" stroke="#ffffff" stroke-width="1.5" />
      `;
    });

    const badgeHtml = label ? `<div class="graph-label-badge">${label}</div>` : '';

    return `
      <div class="graph-card-item">
        ${badgeHtml}
        <svg width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}" class="graph-svg" aria-label="График ${label}">
          <defs>
            <clipPath id="${clipId}">
              <rect x="${clipBoxX}" y="${clipBoxY}" width="${clipBoxW}" height="${clipBoxH}" />
            </clipPath>
          </defs>
          <!-- Фоновая рамка сетки -->
          <rect x="${clipBoxX}" y="${clipBoxY}" width="${clipBoxW}" height="${clipBoxH}" fill="#ffffff" stroke="rgba(38,63,97,0.2)" stroke-width="1" rx="4" />
          ${gridLines}
          ${axisX}
          ${axisY}
          ${ticks}
          <!-- Кривая функции с обрезкой по границам сетки -->
          <g clip-path="url(#${clipId})">
            ${graphContent}
            ${pointsSvg}
          </g>
        </svg>
      </div>
    `.trim();
  }

  // Отрисовка параболы: y = a*x^2 + b*x + c
  function renderParabolaSvgContent(a, b, c) {
    const pts = [];
    const step = 0.1;
    for (let x = MIN_UNIT - 1; x <= MAX_UNIT + 1; x += step) {
      const y = a * x * x + b * x + c;
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
    const d = 'M ' + pts.join(' L ');
    return `<path d="${d}" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`;
  }

  // Отрисовка прямой: y = k*x + b
  function renderLinearSvgContent(k, b) {
    const x1 = MIN_UNIT - 2;
    const y1 = k * x1 + b;
    const x2 = MAX_UNIT + 2;
    const y2 = k * x2 + b;
    return `
      <line x1="${toSvgX(x1).toFixed(1)}" y1="${toSvgY(y1).toFixed(1)}" x2="${toSvgX(x2).toFixed(1)}" y2="${toSvgY(y2).toFixed(1)}" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" />
    `;
  }

  // Отрисовка гиперболы: y = k / x или 1 / (2x)
  function renderHyperbolaSvgContent(k, isHalf = false) {
    function branch(xStart, xEnd) {
      const pts = [];
      const step = 0.05;
      for (let x = xStart; (xStart < xEnd ? x <= xEnd : x >= xEnd); x += (xStart < xEnd ? step : -step)) {
        if (Math.abs(x) < 0.1) continue;
        const y = isHalf ? (k / (2 * x)) : (k / x);
        if (Math.abs(y) > MAX_UNIT + 3) continue;
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
      return pts.length > 1 ? 'M ' + pts.join(' L ') : '';
    }

    const d1 = branch(0.12, MAX_UNIT + 1);
    const d2 = branch(-0.12, MIN_UNIT - 1);

    return `
      ${d1 ? `<path d="${d1}" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />` : ''}
      ${d2 ? `<path d="${d2}" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />` : ''}
    `;
  }

  // Отрисовка функции квадратного корня: y = a*sqrt(x) + b
  function renderSqrtSvgContent(a = 1, b = 0) {
    const pts = [];
    const step = 0.1;
    for (let x = 0; x <= MAX_UNIT + 1; x += step) {
      const y = a * Math.sqrt(x) + b;
      pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
    const d = 'M ' + pts.join(' L ');
    return `<path d="${d}" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`;
  }

  /* ==========================================================================
     ПРОТОТИПЫ ЗАДАНИЯ №11
     ========================================================================== */

  /**
   * 1. ПАРАБОЛЫ: Знаки коэффициентов a и c (или a и D)
   * Даны 3 графика парабол А, Б, В и 3 набора знаков. Ответ: трёхзначное число.
   */
  function genParabolasSigns() {
    // 4 возможных состояния (a, c)
    const allStates = [
      { a: 1, c: 2, label: 'a > 0, c > 0', text: 'ветви вверх (a > 0), пересекает Oy выше нуля (c > 0)' },
      { a: 1, c: -2, label: 'a > 0, c < 0', text: 'ветви вверх (a > 0), пересекает Oy ниже нуля (c < 0)' },
      { a: -1, c: 2, label: 'a < 0, c > 0', text: 'ветви вниз (a < 0), пересекает Oy выше нуля (c > 0)' },
      { a: -1, c: -2, label: 'a < 0, c < 0', text: 'ветви вниз (a < 0), пересекает Oy ниже нуля (c < 0)' }
    ];

    // Выбираем 3 различных состояния
    const chosen = shuffle(allStates).slice(0, 3);

    // Для каждого генерируем b так, чтобы вершина была наглядной
    const graphsData = chosen.map(st => {
      // Вершина x0 = -b / (2a) -> возьмем x0 = ±1 или ±2
      const x0 = pickRandom([-2, -1, 1, 2]);
      const b = -2 * st.a * x0;
      // y0 = a*x0^2 + b*x0 + c = a*x0^2 - 2a*x0^2 + c = -a*x0^2 + c
      let c = st.c;
      // Корректируем вершину, чтобы не вылетала за [-4, 4]
      let y0 = -st.a * x0 * x0 + c;
      if (Math.abs(y0) > 4) {
        c = (st.c > 0 ? 1 : -1);
        y0 = -st.a * x0 * x0 + c;
      }
      return {
        a: st.a,
        b: b,
        c: c,
        state: st,
        x0: x0,
        y0: y0
      };
    });

    // Варианты утверждений (1, 2, 3)
    const options = chosen.map((st, idx) => ({
      num: idx + 1,
      text: st.label,
      state: st
    }));
    // Перемешиваем варианты ответов
    const shuffledOptions = shuffle(options).map((opt, i) => ({
      ...opt,
      displayNum: i + 1
    }));

    // Сопоставляем графики А, Б, В с номерами утверждений
    const letters = ['А', 'Б', 'В'];
    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = graphsData.map((g, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.text === g.state.label);
      answerDigits.push(matchingOpt.displayNum);

      const svgContent = renderParabolaSvgContent(g.a, g.b, g.c);
      const keyPoints = [[0, g.c], [g.x0, g.y0]];
      const svg = renderGridSvg(svgContent, letter, keyPoints);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> ветви параболы направлены ${g.a > 0 ? 'вверх (a > 0)' : 'вниз (a < 0)'}, точка пересечения графика с осью Oy лежит ${g.c > 0 ? 'выше нуля (c > 0)' : 'ниже нуля (c < 0)'}. Значит, этому графику соответствует утверждение <strong>№${matchingOpt.displayNum}</strong> (${matchingOpt.text}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> в таблицу под буквами А, Б, В записываем цифры без пробелов и запятых: <strong>${answer}</strong>.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${opt.text}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками функций и знаками коэффициентов <em>a</em> и <em>c</em>.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Коэффициенты:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead>
            <tr><th>А</th><th>Б</th><th>В</th></tr>
          </thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">В поле ответа запишите трёхзначное число (последовательность цифр, соответствующих буквам А, Б, В).</p>
    `;

    return {
      category: 'parabolas',
      catName: 'Параболы (знаки a и c)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками парабол и знаками коэффициентов a и c.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 2. ПАРАБОЛЫ: Графики и формулы y = ax^2 + bx + c
   */
  function genParabolasFormulas() {
    // Набор красивых парабол с различимыми вершинами и пересечением с Oy
    const presets = [
      { a: 1, b: -4, c: 3, x0: 2, y0: -1 },
      { a: 1, b: 4, c: 3, x0: -2, y0: -1 },
      { a: -1, b: 4, c: -3, x0: 2, y0: 1 },
      { a: -1, b: -4, c: -3, x0: -2, y0: 1 },
      { a: 1, b: -2, c: -3, x0: 1, y0: -4 },
      { a: -1, b: 2, c: 3, x0: 1, y0: 4 }
    ];

    const chosen = shuffle(presets).slice(0, 3);
    const letters = ['А', 'Б', 'В'];

    // Создаем формулы
    const options = chosen.map((p, idx) => ({
      formula: formatQuadFormula(p.a, p.b, p.c),
      p: p
    }));

    const shuffledOptions = shuffle(options).map((opt, i) => ({
      ...opt,
      displayNum: i + 1
    }));

    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = chosen.map((p, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.p === p);
      answerDigits.push(matchingOpt.displayNum);

      const svgContent = renderParabolaSvgContent(p.a, p.b, p.c);
      const keyPoints = [[0, p.c], [p.x0, p.y0]];
      const svg = renderGridSvg(svgContent, letter, keyPoints);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> парабола с вершиной в точке (${p.x0}; ${p.y0}), ветви направлены ${p.a > 0 ? 'вверх (a = ' + p.a + ' > 0)' : 'вниз (a = ' + p.a + ' < 0)'}, пересекает ось Oy в точке (0; ${p.c}). Вершина определяется по формуле x₀ = -b / (2a) = ${p.x0}. Этому соответствует формула <strong>№${matchingOpt.displayNum}</strong> (${matchingOpt.formula}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> ${answer}.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${formulaToHtml(opt.formula)}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками функций и формулами, которые их задают.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Формулы:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead><tr><th>А</th><th>Б</th><th>В</th></tr></thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">В ответе укажите трёхзначное число без пробелов и знаков препинания.</p>
    `;

    return {
      category: 'parabolas',
      catName: 'Параболы (графики и формулы)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками парабол и их формулами.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 3. ПРЯМЫЕ: Знаки коэффициентов k и b
   */
  function genLinearSigns() {
    const allStates = [
      { k: 1.5, b: 2, label: 'k > 0, b > 0', text: 'функция возрастает (k > 0), пересекает Oy выше нуля (b > 0)' },
      { k: 1.5, b: -2, label: 'k > 0, b < 0', text: 'функция возрастает (k > 0), пересекает Oy ниже нуля (b < 0)' },
      { k: -1.5, b: 2, label: 'k < 0, b > 0', text: 'функция убывает (k < 0), пересекает Oy выше нуля (b > 0)' },
      { k: -1.5, b: -2, label: 'k < 0, b < 0', text: 'функция убывает (k < 0), пересекает Oy ниже нуля (b < 0)' }
    ];

    const chosen = shuffle(allStates).slice(0, 3);
    const letters = ['А', 'Б', 'В'];

    // 4 варианта ответов (как на реальном экзамене часто 4 варианта на 3 буквы)
    const shuffledOptions = shuffle(allStates).map((opt, i) => ({
      ...opt,
      displayNum: i + 1
    }));

    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = chosen.map((st, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.label === st.label);
      answerDigits.push(matchingOpt.displayNum);

      const k = st.k > 0 ? pickRandom([1, 1.5, 2]) : pickRandom([-1, -1.5, -2]);
      const b = st.b > 0 ? pickRandom([1, 2, 3]) : pickRandom([-1, -2, -3]);

      const svgContent = renderLinearSvgContent(k, b);
      const keyPoints = [[0, b]];
      const svg = renderGridSvg(svgContent, letter, keyPoints);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> прямая наклонена вправо, функция ${k > 0 ? 'возрастает (угол с положительным направлением Ox острый, k > 0)' : 'убывает (угол тупой, k < 0)'}; пересекает ось Oy в точке (0; ${b}), то есть ${b > 0 ? 'выше нуля (b > 0)' : 'ниже нуля (b < 0)'}. Это соответствует пункту <strong>№${matchingOpt.displayNum}</strong> (${matchingOpt.label}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> ${answer}.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${opt.label}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками функций и знаками коэффициентов <em>k</em> и <em>b</em>.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Коэффициенты:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead><tr><th>А</th><th>Б</th><th>В</th></tr></thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">Запишите в ответ трёхзначное число.</p>
    `;

    return {
      category: 'linear',
      catName: 'Прямые (знаки k и b)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками прямых и знаками коэффициентов k и b.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 4. ПРЯМЫЕ: Графики и формулы y = kx + b
   */
  function genLinearFormulas() {
    const kVal = pickRandom([2, 3]);
    const bVal = pickRandom([2, 3]);

    const presets = [
      { k: kVal, b: bVal, desc: 'возрастает, Oy пересекает в точке (0; ' + bVal + ')' },
      { k: -kVal, b: bVal, desc: 'убывает, Oy пересекает в точке (0; ' + bVal + ')' },
      { k: kVal, b: -bVal, desc: 'возрастает, Oy пересекает в точке (0; -' + bVal + ')' },
      { k: -kVal, b: -bVal, desc: 'убывает, Oy пересекает в точке (0; -' + bVal + ')' }
    ];

    const chosen = shuffle(presets).slice(0, 3);
    const letters = ['А', 'Б', 'В'];

    const shuffledOptions = shuffle(presets).map((p, i) => ({
      formula: formatLinearFormula(p.k, p.b),
      p: p,
      displayNum: i + 1
    }));

    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = chosen.map((p, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.p === p);
      answerDigits.push(matchingOpt.displayNum);

      const svgContent = renderLinearSvgContent(p.k, p.b);
      const keyPoints = [[0, p.b]];
      const svg = renderGridSvg(svgContent, letter, keyPoints);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> прямая пересекает ось ординат в точке (0; ${p.b}), следовательно, b = ${p.b}. Функция ${p.k > 0 ? 'возрастает, k > 0' : 'убывает, k < 0'} (при изменении x на 1 y изменяется на ${p.k}). Этому соответствует формула <strong>№${matchingOpt.displayNum}</strong> (${matchingOpt.formula}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> ${answer}.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${formulaToHtml(opt.formula)}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками линейных функций и формулами, которые их задают.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Формулы:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead><tr><th>А</th><th>Б</th><th>В</th></tr></thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">Запишите трёхзначное число в поле ответа.</p>
    `;

    return {
      category: 'linear',
      catName: 'Прямые (графики и формулы)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками прямых и их формулами.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 5. ГИПЕРБОЛЫ: Обратная пропорциональность y = k / x
   */
  function genHyperbolasFormulas() {
    const kVal = pickRandom([2, 4, 6]);

    // 4 классические формулы гипербол
    const presets = [
      { k: kVal, isHalf: false, formula: formatHyperbolaFormula(kVal), pt: [1, kVal], quads: 'I и III', desc: `ветви в I и III четвертях, проходит через точку (1; ${kVal})` },
      { k: -kVal, isHalf: false, formula: formatHyperbolaFormula(-kVal), pt: [1, -kVal], quads: 'II и IV', desc: `ветви во II и IV четвертях, проходит через точку (1; -${kVal})` },
      { k: 1, isHalf: true, formula: 'y = 1 / (2x)', pt: [1, 0.5], quads: 'I и III', desc: 'ветви в I и III четвертях, прижаты к осям (при x = 1, y = 0,5)' },
      { k: -1, isHalf: true, formula: 'y = -1 / (2x)', pt: [1, -0.5], quads: 'II и IV', desc: 'ветви во II и IV четвертях, прижаты к осям (при x = 1, y = -0,5)' }
    ];

    const chosen = shuffle(presets).slice(0, 3);
    const letters = ['А', 'Б', 'В'];

    const shuffledOptions = shuffle(presets).map((p, i) => ({
      formula: p.formula,
      p: p,
      displayNum: i + 1
    }));

    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = chosen.map((p, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.p === p);
      answerDigits.push(matchingOpt.displayNum);

      const svgContent = renderHyperbolaSvgContent(p.k, p.isHalf);
      const keyPoints = (Math.abs(p.pt[1]) <= 4 && p.pt[0] <= 4) ? [p.pt] : [];
      const svg = renderGridSvg(svgContent, letter, keyPoints);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> гипербола расположена в ${p.quads} координатных четвертях (${p.k > 0 ? 'значит, коэффициент положителен k > 0' : 'значит, коэффициент отрицателен k < 0'}). ${p.desc}. Этому графику соответствует формула <strong>№${matchingOpt.displayNum}</strong> (${matchingOpt.formula}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> ${answer}.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${formulaToHtml(opt.formula)}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками функций и формулами, которые их задают.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Формулы:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead><tr><th>А</th><th>Б</th><th>В</th></tr></thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">Запишите в ответе трёхзначное число.</p>
    `;

    return {
      category: 'hyperbolas',
      catName: 'Гиперболы (графики и формулы)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками гипербол и их формулами.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 6. РАЗНЫЕ ТИПЫ ФУНКЦИЙ (Линейная, квадратичная, гипербола, квадратный корень)
   * Самый популярный прототип ФИПИ!
   */
  function genMixedTypes() {
    const kLine = pickRandom([1, 2, -1, -2]);
    const bLine = pickRandom([1, 2, -1, -2]);

    const aQuad = pickRandom([1, -1]);
    const cQuad = pickRandom([1, 2, -1, -2]);

    const kHyp = pickRandom([2, -2, 3, -3]);

    const allTypes = [
      {
        type: 'linear',
        formula: formatLinearFormula(kLine, bLine),
        render: () => renderLinearSvgContent(kLine, bLine),
        points: [[0, bLine]],
        typeName: 'прямая (линейная функция вида y = kx + b)'
      },
      {
        type: 'parabola',
        formula: formatQuadFormula(aQuad, 0, cQuad),
        render: () => renderParabolaSvgContent(aQuad, 0, cQuad),
        points: [[0, cQuad]],
        typeName: 'парабола (квадратичная функция вида y = ax² + c)'
      },
      {
        type: 'hyperbola',
        formula: formatHyperbolaFormula(kHyp),
        render: () => renderHyperbolaSvgContent(kHyp, false),
        points: [[1, kHyp]],
        typeName: 'гипербола (обратная пропорциональность y = k / x)'
      },
      {
        type: 'sqrt',
        formula: 'y = √x',
        render: () => renderSqrtSvgContent(1, 0),
        points: [[1, 1], [4, 2]],
        typeName: 'ветвь параболы (функция квадратного корня y = √x)'
      }
    ];

    // Выбираем 3 типа для графиков (всегда прямая, парабола и гипербола или корень)
    const chosenTypes = shuffle(allTypes).slice(0, 3);
    const letters = ['А', 'Б', 'В'];

    // 4 варианта формул в списке (3 верных + 1 лишняя дистракторная)
    const shuffledOptions = shuffle(allTypes).map((item, idx) => ({
      formula: item.formula,
      type: item.type,
      displayNum: idx + 1
    }));

    const answerDigits = [];
    const solutionSteps = [];

    const graphsHtmlArr = chosenTypes.map((item, idx) => {
      const letter = letters[idx];
      const matchingOpt = shuffledOptions.find(o => o.type === item.type);
      answerDigits.push(matchingOpt.displayNum);

      const svgContent = item.render();
      const svg = renderGridSvg(svgContent, letter, item.points);

      solutionSteps.push(
        `<strong>График ${letter}:</strong> изображена ${item.typeName}. Следовательно, графику ${letter} соответствует формула <strong>№${matchingOpt.displayNum}</strong> (${item.formula}).`
      );

      return svg;
    });

    const answer = answerDigits.join('');
    solutionSteps.push(`<strong>Ответ:</strong> ${answer}.`);

    const optionsListHtml = `
      <div class="matching-options-grid">
        ${shuffledOptions.map(opt => `
          <div class="matching-opt-chip">
            <span class="matching-opt-num">${opt.displayNum}</span>
            <span class="matching-opt-val">${formulaToHtml(opt.formula)}</span>
          </div>
        `).join('')}
      </div>
    `;

    const questionHtml = `
      <p class="task-statement">Установите соответствие между графиками функций и формулами, которые их задают.</p>
      <div class="task-graphs-row">
        ${graphsHtmlArr.join('')}
      </div>
      <p class="task-subtext"><strong>Формулы:</strong></p>
      ${optionsListHtml}
      <div class="matching-table-wrap">
        <table class="matching-fipi-table">
          <thead><tr><th>А</th><th>Б</th><th>В</th></tr></thead>
          <tbody>
            <tr>
              <td id="slot-cell-A">?</td>
              <td id="slot-cell-B">?</td>
              <td id="slot-cell-V">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="task-subtext" style="font-size:12px; margin-top:8px;">Запишите трёхзначное число без пробелов и знаков препинания.</p>
    `;

    return {
      category: 'mixed_types',
      catName: 'Разные функции (прямая, парабола, гипербола)',
      type: 'matching',
      questionHtml,
      text: 'Установите соответствие между графиками различных функций и их формулами.',
      answer,
      displayAnswer: answer,
      solutionSteps,
      letters: ['А', 'Б', 'В'],
      optionsCount: shuffledOptions.length
    };
  }

  /**
   * 7. ПОИСК ЗНАЧЕНИЯ / КОЭФФИЦИЕНТА ПО ГРАФИКУ
   * Найти коэффициент c параболы, k прямой или значение функции в точке f(x0).
   */
  function genFindValue() {
    const subType = pickRandom(['parabola_c', 'linear_k', 'function_val']);

    if (subType === 'parabola_c') {
      const a = pickRandom([1, -1]);
      const x0 = pickRandom([-2, -1, 1, 2]);
      const b = -2 * a * x0;
      const c = pickRandom([-3, -2, -1, 1, 2, 3]);
      const y0 = a * x0 * x0 + b * x0 + c;

      const svgContent = renderParabolaSvgContent(a, b, c);
      const svg = renderGridSvg(svgContent, '', [[0, c], [x0, y0]]);

      const questionHtml = `
        <p class="task-statement">На рисунке изображён график функции вида <em>y = ax² + bx + c</em>. Найдите значение коэффициента <em>c</em>.</p>
        <div class="task-graphs-row single-graph-center">
          ${svg}
        </div>
      `;

      const solutionSteps = [
        `Коэффициент <em>c</em> в уравнении параболы <em>y = ax² + bx + c</em> равен значению функции при <em>x = 0</em>, то есть ординате точки пересечения графика с осью <em>Oy</em>:`,
        `<em>y(0) = a·0² + b·0 + c = c</em>.`,
        `По графику видно, что парабола пересекает ось ординат <em>Oy</em> в точке с координатами <strong>(0; ${c})</strong>.`,
        `Следовательно, <strong>c = ${c}</strong>.`
      ];

      return {
        category: 'find_value',
        catName: 'Поиск коэффициента c параболы',
        type: 'number',
        questionHtml,
        text: 'На рисунке изображён график функции y = ax² + bx + c. Найдите значение c.',
        answer: String(c),
        displayAnswer: String(c),
        solutionSteps
      };
    } else if (subType === 'linear_k') {
      const k = pickRandom([-3, -2, -1, 1, 2, 3]);
      const b = pickRandom([-2, -1, 0, 1, 2]);

      const svgContent = renderLinearSvgContent(k, b);
      const x2 = (k > 0 ? 1 : -1);
      const y2 = k * x2 + b;
      const svg = renderGridSvg(svgContent, '', [[0, b], [x2, y2]]);

      const questionHtml = `
        <p class="task-statement">На рисунке изображён график линейной функции <em>y = kx + b</em>. Найдите угловой коэффициент <em>k</em>.</p>
        <div class="task-graphs-row single-graph-center">
          ${svg}
        </div>
      `;

      const solutionSteps = [
        `Угловой коэффициент <em>k</em> линейной функции <em>y = kx + b</em> равен тангенсу угла наклона прямой или отношению изменения <em>y</em> к изменению <em>x</em>:`,
        `<em>k = (y₂ - y₁) / (x₂ - x₁)</em>.`,
        `Выберем две узловые точки на прямой с целыми координатами: A(0; ${b}) и B(${x2}; ${y2}).`,
        `Тогда: <em>k = (${y2} - (${b})) / (${x2} - 0) = ${y2 - b} / ${x2} = <strong>${k}</strong></em>.`,
        `Также знак коэффициента подтверждается тем, что функция ${k > 0 ? 'возрастает (k > 0)' : 'убывает (k < 0)'}.`
      ];

      return {
        category: 'find_value',
        catName: 'Угловой коэффициент прямой k',
        type: 'number',
        questionHtml,
        text: 'На рисунке изображён график линейной функции y = kx + b. Найдите угловой коэффициент k.',
        answer: String(k),
        displayAnswer: String(k),
        solutionSteps
      };
    } else {
      // function_val: f(x0)
      const a = pickRandom([1, -1]);
      const x0 = pickRandom([-1, 0, 1]);
      const b = -2 * a * x0;
      const c = pickRandom([-2, -1, 0, 1, 2]);

      const targetX = pickRandom([-2, -1, 1, 2].filter(x => x !== x0));
      const targetY = a * targetX * targetX + b * targetX + c;

      const svgContent = renderParabolaSvgContent(a, b, c);
      const svg = renderGridSvg(svgContent, '', [[x0, a * x0 * x0 + b * x0 + c], [targetX, targetY]]);

      const questionHtml = `
        <p class="task-statement">На рисунке изображён график функции <em>y = f(x)</em>. Найдите значение <em>f(${targetX})</em>.</p>
        <div class="task-graphs-row single-graph-center">
          ${svg}
        </div>
      `;

      const solutionSteps = [
        `Чтобы найти значение функции <em>f(${targetX})</em> по графику:`,
        `1. Найдём на оси абсцисс <em>Ox</em> точку с координатой <strong>x = ${targetX}</strong>.`,
        `2. Проведём от неё вертикальную прямую до пересечения с графиком функции.`,
        `3. Из полученной точки графика проведём горизонталь к оси ординат <em>Oy</em>. Она указывает на значение <strong>${targetY}</strong>.`,
        `Следовательно, <strong>f(${targetX}) = ${targetY}</strong>.`
      ];

      return {
        category: 'find_value',
        catName: 'Значение функции f(x) по графику',
        type: 'number',
        questionHtml,
        text: `На рисунке изображён график функции y = f(x). Найдите значение f(${targetX}).`,
        answer: String(targetY),
        displayAnswer: String(targetY),
        solutionSteps
      };
    }
  }

  /* --------------------------------------------------------------------------
     ОСНОВНОЙ ГЕНЕРАТОР ЗАДАНИЙ ПО КАТЕГОРИЯМ
     -------------------------------------------------------------------------- */
  function generateTask(category = 'mixed_all') {
    let task = null;
    switch (category) {
      case 'parabolas': {
        const gen = pickRandom([genParabolasSigns, genParabolasFormulas]);
        task = gen();
        break;
      }
      case 'linear': {
        const gen = pickRandom([genLinearSigns, genLinearFormulas]);
        task = gen();
        break;
      }
      case 'hyperbolas': {
        task = genHyperbolasFormulas();
        break;
      }
      case 'mixed_types': {
        task = genMixedTypes();
        break;
      }
      case 'find_value': {
        task = genFindValue();
        break;
      }
      case 'mixed_all':
      default: {
        const allGenerators = [
          genParabolasSigns,
          genParabolasFormulas,
          genLinearSigns,
          genLinearFormulas,
          genHyperbolasFormulas,
          genMixedTypes,
          genFindValue
        ];
        task = pickRandom(allGenerators)();
        break;
      }
    }

    if (task) {
      if (!task.id) task.id = 'oge11_' + Math.random().toString(36).substring(2, 9);
      if (!task.displayAnswer) task.displayAnswer = task.answer;
      if (!task.text && task.questionHtml) {
        task.text = task.questionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }
    return task;
  }

  /* --------------------------------------------------------------------------
     ПРОВЕРКА ОТВЕТА
     -------------------------------------------------------------------------- */
  function checkAnswer(userAnswer, correctAnswer, taskType = 'matching') {
    if (userAnswer == null || correctAnswer == null) return false;
    const cleanUser = String(userAnswer).trim().replace(/[\s,\-\.]/g, '');
    const cleanCorrect = String(correctAnswer).trim().replace(/[\s,\-\.]/g, '');
    return cleanUser === cleanCorrect;
  }

  return {
    generateTask,
    checkAnswer,
    genParabolasSigns,
    genParabolasFormulas,
    genLinearSigns,
    genLinearFormulas,
    genHyperbolasFormulas,
    genMixedTypes,
    genFindValue
  };
}));
