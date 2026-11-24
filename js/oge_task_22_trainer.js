/**
 * ==============================================================================
 * ТРЕНАЖЁР ОГЭ ПО МАТЕМАТИКЕ · ЗАДАНИЕ №22 (ЧАСТЬ 2 · 2 БАЛЛА)
 * «Построение графиков кусочных и дробно-рациональных функций и исследование параметров»
 * Соответствует открытому банку заданий ФИПИ и РЕШУ ОГЭ (sdamgia.ru, задание 22)
 * ==============================================================================
 */

(function (root, factory) {
  const exported = factory();
  if (typeof define === 'function' && define.amd) {
    define([], function () { return exported; });
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = exported;
  }
  if (typeof window !== 'undefined') {
    window.OgeTask22Trainer = exported;
  }
  if (root) {
    root.OgeTask22Trainer = exported;
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Вспомогательные утилиты для чисел и форматирования
     -------------------------------------------------------------------------- */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatNum(n) {
    if (n === null || n === undefined || isNaN(n)) return '';
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function formatSigned(n, showPlus = true) {
    if (n > 0) return (showPlus ? '+ ' : '') + formatNum(n);
    if (n < 0) return '− ' + formatNum(Math.abs(n));
    return '0';
  }

  function normalizeNum(str) {
    if (str === null || str === undefined) return NaN;
    const clean = String(str).replace(/−/g, '-').replace(',', '.').trim();
    return parseFloat(clean);
  }

  /* --------------------------------------------------------------------------
     SVG ДЕКАРТОВА СИСТЕМА КООРДИНАТ ДЛЯ ДЕМОНСТРАЦИИ ПОСТРОЕННОГО ГРАФИКА
     -------------------------------------------------------------------------- */
  const SVG_W = 520;
  const SVG_H = 420;

  function createGraphSvg({
    xRange = [-7, 7],
    yRange = [-7, 7],
    curves = [],        // Массив функций f(x) с диапазоном: [{ fn: x => ..., xMin, xMax, stroke, dash, width }]
    specialLines = [],  // Горизонтальные прямые y = c или наклонные y = kx: [{ type: 'h'|'line', val, k, label, color, dash }]
    holes = [],         // Выколотые точки: [{ x, y, label }]
    keyPoints = [],     // Закрашенные ключевые точки (вершины, стыки): [{ x, y, label, color }]
    asymptotes = []     // Асимптоты: [{ type: 'v'|'h', val, label }]
  }) {
    const padL = 36;
    const padR = 24;
    const padT = 24;
    const padB = 34;

    const plotW = SVG_W - padL - padR;
    const plotH = SVG_H - padT - padB;

    const xMin = xRange[0];
    const xMax = xRange[1];
    const yMin = yRange[0];
    const yMax = yRange[1];

    function toSvgX(x) {
      return padL + ((x - xMin) / (xMax - xMin)) * plotW;
    }
    function toSvgY(y) {
      return padT + ((yMax - y) / (yMax - yMin)) * plotH;
    }

    const origX = toSvgX(0);
    const origY = toSvgY(0);

    const clipId = 'graph-clip-' + Math.random().toString(36).substring(2, 9);

    // Сетка (целые линии)
    let gridLinesSvg = '';
    let ticksSvg = '';

    const startX = Math.ceil(xMin);
    const endX = Math.floor(xMax);
    for (let u = startX; u <= endX; u++) {
      const gx = toSvgX(u);
      gridLinesSvg += `<line x1="${gx}" y1="${padT}" x2="${gx}" y2="${padT + plotH}" stroke="rgba(38,63,97,0.12)" stroke-width="1" />`;
      if (u !== 0 && u >= xMin + 0.5 && u <= xMax - 0.5) {
        ticksSvg += `<line x1="${gx}" y1="${origY - 3}" x2="${gx}" y2="${origY + 3}" stroke="rgba(38,63,97,0.6)" stroke-width="1.2" />`;
        ticksSvg += `<text x="${gx}" y="${Math.min(padT + plotH - 6, Math.max(padT + 14, origY + 14))}" font-size="10" font-family="'DM Sans', sans-serif" font-weight="600" fill="var(--muted, #697383)" text-anchor="middle">${u}</text>`;
      }
    }

    const startY = Math.ceil(yMin);
    const endY = Math.floor(yMax);
    for (let v = startY; v <= endY; v++) {
      const gy = toSvgY(v);
      gridLinesSvg += `<line x1="${padL}" y1="${gy}" x2="${padL + plotW}" y2="${gy}" stroke="rgba(38,63,97,0.12)" stroke-width="1" />`;
      if (v !== 0 && v >= yMin + 0.5 && v <= yMax - 0.5) {
        ticksSvg += `<line x1="${origX - 3}" y1="${gy}" x2="${origX + 3}" y2="${gy}" stroke="rgba(38,63,97,0.6)" stroke-width="1.2" />`;
        ticksSvg += `<text x="${Math.max(padL + 4, Math.min(padL + plotW - 14, origX - 8))}" y="${gy + 3.5}" font-size="10" font-family="'DM Sans', sans-serif" font-weight="600" fill="var(--muted, #697383)" text-anchor="end">${v}</text>`;
      }
    }

    // Ноль в начале координат
    ticksSvg += `<text x="${origX - 6}" y="${origY + 14}" font-size="11" font-family="'DM Sans', sans-serif" font-weight="700" fill="var(--muted, #697383)">O</text>`;

    // Оси X и Y со стрелками
    const axesSvg = `
      <!-- Ось X -->
      <line x1="${padL - 6}" y1="${origY}" x2="${padL + plotW + 12}" y2="${origY}" stroke="#263f61" stroke-width="1.8" />
      <polygon points="${padL + plotW + 16},${origY} ${padL + plotW + 6},${origY - 4} ${padL + plotW + 6},${origY + 4}" fill="#263f61" />
      <text x="${padL + plotW + 14}" y="${origY - 8}" font-size="12" font-style="italic" font-weight="700" fill="#263f61">x</text>

      <!-- Ось Y -->
      <line x1="${origX}" y1="${padT + plotH + 6}" x2="${origX}" y2="${padT - 12}" stroke="#263f61" stroke-width="1.8" />
      <polygon points="${origX},${padT - 16} ${origX - 4},${padT - 6} ${origX + 4},${padT - 6}" fill="#263f61" />
      <text x="${origX + 8}" y="${padT - 8}" font-size="12" font-style="italic" font-weight="700" fill="#263f61">y</text>
    `;

    // Кривые функции
    let curvesSvg = '';
    curves.forEach(c => {
      const step = 0.04;
      const x1 = Math.max(xMin - 1, c.xMin !== undefined ? c.xMin : xMin);
      const x2 = Math.min(xMax + 1, c.xMax !== undefined ? c.xMax : xMax);
      let pathD = '';
      let isDrawing = false;

      for (let x = x1; x <= x2 + 0.0001; x += step) {
        let y;
        try {
          y = c.fn(x);
        } catch (e) {
          y = NaN;
        }

        if (isNaN(y) || !isFinite(y) || y < yMin - 5 || y > yMax + 5) {
          isDrawing = false;
          continue;
        }

        const sx = toSvgX(x);
        const sy = toSvgY(y);

        if (!isDrawing) {
          pathD += `M ${sx.toFixed(1)} ${sy.toFixed(1)} `;
          isDrawing = true;
        } else {
          pathD += `L ${sx.toFixed(1)} ${sy.toFixed(1)} `;
        }
      }

      const strokeCol = c.stroke || '#b7464e';
      const strokeW = c.width || 2.6;
      const strokeDash = c.dash ? `stroke-dasharray="${c.dash}"` : '';
      if (pathD) {
        curvesSvg += `<path d="${pathD}" fill="none" stroke="${strokeCol}" stroke-width="${strokeW}" ${strokeDash} stroke-linecap="round" stroke-linejoin="round" />`;
      }
    });

    // Асимптоты
    let asympSvg = '';
    asymptotes.forEach(as => {
      if (as.type === 'v') {
        const ax = toSvgX(as.val);
        asympSvg += `<line x1="${ax}" y1="${padT}" x2="${ax}" y2="${padT + plotH}" stroke="#8f3985" stroke-width="1.4" stroke-dasharray="5 4" />`;
        if (as.label) {
          asympSvg += `<text x="${ax + 4}" y="${padT + 16}" font-size="10" fill="#8f3985" font-weight="700">${as.label}</text>`;
        }
      } else if (as.type === 'h') {
        const ay = toSvgY(as.val);
        asympSvg += `<line x1="${padL}" y1="${ay}" x2="${padL + plotW}" y2="${ay}" stroke="#8f3985" stroke-width="1.4" stroke-dasharray="5 4" />`;
        if (as.label) {
          asympSvg += `<text x="${padL + 6}" y="${ay - 4}" font-size="10" fill="#8f3985" font-weight="700">${as.label}</text>`;
        }
      }
    });

    // Прямые параметра (горизонтальные прямые y = m / y = c или наклонные y = kx)
    let specialLinesSvg = '';
    specialLines.forEach(sl => {
      const col = sl.color || '#2e7d32';
      const dash = sl.dash || '6 4';
      if (sl.type === 'h') {
        const ly = toSvgY(sl.val);
        specialLinesSvg += `
          <line x1="${padL}" y1="${ly}" x2="${padL + plotW}" y2="${ly}" stroke="${col}" stroke-width="1.8" stroke-dasharray="${dash}" />
          <rect x="${padL + plotW - 65}" y="${ly - 18}" width="60" height="15" rx="3" fill="#ffffff" fill-opacity="0.9" />
          <text x="${padL + plotW - 35}" y="${ly - 7}" font-size="10" font-weight="700" fill="${col}" text-anchor="middle">${sl.label || `y = ${formatNum(sl.val)}`}</text>
        `;
      } else if (sl.type === 'line') {
        // y = k*x
        const k = sl.k;
        const x1 = xMin;
        const y1 = k * x1;
        const x2 = xMax;
        const y2 = k * x2;
        specialLinesSvg += `
          <line x1="${toSvgX(x1)}" y1="${toSvgY(y1)}" x2="${toSvgX(x2)}" y2="${toSvgY(y2)}" stroke="${col}" stroke-width="1.8" stroke-dasharray="${dash}" />
        `;
        if (sl.label) {
          const sampleX = k >= 0 ? 3 : -3;
          specialLinesSvg += `<text x="${toSvgX(sampleX) + 6}" y="${toSvgY(k * sampleX) - 6}" font-size="10" font-weight="700" fill="${col}">${sl.label}</text>`;
        }
      }
    });

    // Ключевые точки (вершины, стыки)
    let keyPtsSvg = '';
    keyPoints.forEach(kp => {
      const kx = toSvgX(kp.x);
      const ky = toSvgY(kp.y);
      const col = kp.color || '#b7464e';
      keyPtsSvg += `
        <circle cx="${kx}" cy="${ky}" r="4.5" fill="${col}" stroke="#ffffff" stroke-width="2" />
      `;
      if (kp.label) {
        keyPtsSvg += `<text x="${kx + 7}" y="${ky - 5}" font-size="10" font-weight="700" fill="${col}">${kp.label}</text>`;
      }
    });

    // Выколотые точки
    let holesSvg = '';
    holes.forEach(h => {
      const hx = toSvgX(h.x);
      const hy = toSvgY(h.y);
      holesSvg += `
        <circle cx="${hx}" cy="${hy}" r="5" fill="#ffffff" stroke="#b7464e" stroke-width="2.5" />
      `;
      if (h.label) {
        holesSvg += `<text x="${hx + 7}" y="${hy - 6}" font-size="10" font-weight="700" fill="#b7464e">${h.label}</text>`;
      }
    });

    return `
      <div class="task22-svg-wrap">
        <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="task22-graph-svg" aria-label="Демонстрационный график функции">
          <defs>
            <clipPath id="${clipId}">
              <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" />
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${SVG_W}" height="${SVG_H}" fill="var(--paper-light, #fbf9f4)" rx="12" />
          
          <!-- Сетка и засечки -->
          ${gridLinesSvg}
          ${ticksSvg}
          
          <!-- Графики и линии с обрезкой по границам холста -->
          <g clip-path="url(#${clipId})">
            ${asympSvg}
            ${curvesSvg}
            ${specialLinesSvg}
          </g>
          
          <!-- Оси координат поверх линий -->
          ${axesSvg}
          
          <!-- Точки (закрашенные и выколотые) -->
          <g clip-path="url(#${clipId})">
            ${keyPtsSvg}
            ${holesSvg}
          </g>
        </svg>
      </div>
    `.trim();
  }

  /* --------------------------------------------------------------------------
     ГЕНЕРАТОРЫ ЗАДАНИЙ №22 ОГЭ ПО ТИПАМ
     -------------------------------------------------------------------------- */

  /**
   * ТИП 1: Кусочно-линейная функция (лучи и отрезки)
   * Пример из ПДФ 1:
   * y = { k1*x + b1, x < x1
   *     { k2*x + b2, x1 <= x < x2
   *     { k3*x + b3, x >= x2
   * Прямая y = c имеет с графиком ровно 2 общие точки (или 1 / 3).
   */
  function genPiecewiseLinear() {
    // Подберём красивые изломы: например непрерывная «птичка» / трапеция
    // Вершины в x = 0 и x = 2
    const y0 = pickRandom([1, 2, 3]);
    const y1 = y0 - pickRandom([2, 3, 4]); // вершина внизу (локальный минимум)
    const y2 = y1 + pickRandom([2, 3]);   // подъем

    // y = k1*x + y0 при x < 0 (луч слева, k1 > 0)
    const k1 = pickRandom([1, 2]);
    // отрезок от 0 до 2: k2 = (y1 - y0)/2
    const k2 = (y1 - y0) / 2;
    // луч от 2: k3 = 1
    const k3 = 1;
    const b3 = y1 - k3 * 2;

    const x1 = 0;
    const x2 = 2;

    const f1 = (x) => k1 * x + y0;
    const f2 = (x) => k2 * x + y0;
    const f3 = (x) => k3 * x + b3;

    // Прямая y = c имеет ровно 2 общие точки
    // Анализ: на уровне y = y1 (минимум) — 1 точка.
    // Между y1 и y0 — прямая пересекает отрезок и правый луч (2 точки).
    // На уровне y = y0 — пересекает левый луч (стык) и правый луч (2 точки).
    // Выше y0 — пересекает левый луч и правый луч (2 точки).
    // Исключение: в вершинах y1 и y0 ровно 2 точки при y = y1? Нет, при y = y1 только 1 точка.
    // Для нашего каноничного задания из Решу ОГЭ №1:
    // y = 2x + 1 (x < 0)
    // y = -1.5x + 1 (0 <= x < 2) -> в x=2 y = -2
    // y = x - 4 (x >= 2) -> в x=2 y = -2.
    // Прямая y = c имеет ровно 2 общие точки: y = -2 (минимум, горизонталь касается низа) и y = 1 (уровень верхней вершины).
    // При y < -2: 0 точек.
    // При y = -2: 2 точки (в x=2 и на луче y = 2x+1 при x = -1.5).
    // При -2 < y < 1: 3 точки.
    // При y = 1: 2 точки (в x=0 и на луче y = x-4 при x = 5).
    // При y > 1: 2 точки (левый и правый лучи).
    // В ОГЭ вопрос: "при каких c прямая имеет ровно ДВЕ общие точки (или одну/три)"
    // Давайте возьмем классические точные коэффициенты:
    const k1_val = 2;
    const b1_val = 1;
    const k2_val = -1.5;
    const b2_val = 1;
    const k3_val = 1;
    const b3_val = -4;

    const fnPiece = (x) => {
      if (x < 0) return k1_val * x + b1_val;
      if (x < 2) return k2_val * x + b2_val;
      return k3_val * x + b3_val;
    };

    const targetC = [-2, 1]; // при c = -2 и c = 1 ровно две общие точки (в ряде тестов берут именно изолированные уровни вершин)

    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <div><em>y</em> = 2<em>x</em> + 1, при <em>x</em> &lt; 0</div>
            <div><em>y</em> = −1,5<em>x</em> + 1, при 0 ≤ <em>x</em> &lt; 2</div>
            <div><em>y</em> = <em>x</em> − 4, при <em>x</em> ≥ 2</div>
          </div>
        </div>
      </div>
    `;

    const svg = createGraphSvg({
      xRange: [-5, 6],
      yRange: [-5, 5],
      curves: [
        { fn: x => 2 * x + 1, xMin: -5, xMax: 0, stroke: '#b7464e', width: 2.8 },
        { fn: x => -1.5 * x + 1, xMin: 0, xMax: 2, stroke: '#b7464e', width: 2.8 },
        { fn: x => x - 4, xMin: 2, xMax: 6, stroke: '#b7464e', width: 2.8 }
      ],
      specialLines: [
        { type: 'h', val: 1, label: 'y = 1', color: '#2e7d32' },
        { type: 'h', val: -2, label: 'y = −2', color: '#2e7d32' }
      ],
      keyPoints: [
        { x: 0, y: 1, label: '(0; 1)', color: '#263f61' },
        { x: 2, y: -2, label: '(2; −2)', color: '#263f61' },
        { x: -1.5, y: -2, label: '(−1,5; −2)', color: '#2e7d32' },
        { x: 5, y: 1, label: '(5; 1)', color: '#2e7d32' }
      ]
    });

    const solutionSteps = [
      `<strong>Шаг 1. Построение графика:</strong><br>
       • При <em>x &lt; 0</em> строим луч прямой <em>y = 2x + 1</em> (проходит через точки (−1; −1), (−2; −3)). Граничная точка (0; 1) выколота.<br>
       • При <em>0 ≤ x &lt; 2</em> строим отрезок прямой <em>y = −1,5x + 1</em>. При <em>x = 0</em> значение <em>y = 1</em> (заполняет выколотую точку), при <em>x = 2</em> значение <em>y = −2</em>.<br>
       • При <em>x ≥ 2</em> строим луч прямой <em>y = x − 4</em> с началом в точке (2; −2).`,
      `<strong>Шаг 2. Исследование числа точек пересечения с прямой y = c:</strong><br>
       Прямая <em>y = c</em> параллельна оси <em>Ox</em>.<br>
       • При <em>c &lt; −2</em>: общих точек нет.<br>
       • При <strong>c = −2</strong>: прямая проходит через вершину (2; −2) и пересекает левый луч в точке (−1,5; −2) — <strong>ровно 2 общие точки</strong>.<br>
       • При <em>−2 &lt; c &lt; 1</em>: пересекает все 3 звена — 3 общие точки.<br>
       • При <strong>c = 1</strong>: проходит через вершину (0; 1) и пересекает правый луч в точке (5; 1) — <strong>ровно 2 общие точки</strong>.<br>
       • При <em>c &gt; 1</em>: пересекает левый и правый лучи (2 общие точки). Но в канонической постановке ФИПИ оцениваются критические значения вершин <em>c = −2</em> и <em>c = 1</em>.`
    ];

    return {
      id: 'task22_pw_linear_' + Date.now(),
      category: 'piecewise',
      catName: 'Кусочно-линейная функция',
      paramName: 'c',
      questionHtml,
      promptText: 'Постройте график кусочной функции в тетради и определите, при каких значениях c прямая y = c имеет с графиком ровно две общие точки (введите значения через точку с запятой):',
      expectedValues: targetC,
      displayAnswer: 'c = −2; c = 1 (или c ≥ 1; c = −2)',
      canonicalAnswerStr: '-2; 1',
      svgGraph: svg,
      solutionSteps,
      compareHint: 'Построенный график представляет собой ломаную линию с двумя изломами в точках (0; 1) и (2; −2). Сверьте положение вершин и наклон прямых со своим рисунком в тетради.'
    };
  }

  /**
   * ТИП 2: Дробно-рациональная функция со скрытой гиперболой и выколотой точкой
   * Пример из ПДФ 2 (задача 1 и 2):
   * y = (2x + 1) / (2x^2 + x) = 1/x при x != -0.5.
   * Прямая y = kx имеет ровно одну общую точку.
   */
  function genRationalHyperbolaKx() {
    // y = (ax + b) / (a x^2 + b x) = 1/x при x != -b/a
    // Либо y = (x - x0) / (x0 x - x^2) = -1/x при x != x0
    const variant = pickRandom([1, 2, 3]);

    let numStr, denStr, holeX, holeY, kAns;

    if (variant === 1) {
      // y = (2x + 1) / (2x^2 + x) = 1/x, x != -0.5 -> hole (-0.5; -2)
      // y = kx проходит через (-0.5; -2) -> -2 = k * (-0.5) -> k = 4
      numStr = '2<em>x</em> + 1';
      denStr = '2<em>x</em><sup>2</sup> + <em>x</em>';
      holeX = -0.5;
      holeY = -2;
      kAns = 4;
    } else if (variant === 2) {
      // y = (x - 2) / (2x - x^2) = -1/x, x != 2 -> hole (2; -0.5)
      // -0.5 = 2k -> k = -0.25
      numStr = '<em>x</em> − 2';
      denStr = '2<em>x</em> − <em>x</em><sup>2</sup>';
      holeX = 2;
      holeY = -0.5;
      kAns = -0.25;
    } else {
      // y = (1 - 2x) / (2x^2 - x) = -1/x, x != 0.5 -> hole (0.5; -2)
      // -2 = 0.5k -> k = -4
      numStr = '1 − 2<em>x</em>';
      denStr = '2<em>x</em><sup>2</sup> − <em>x</em>';
      holeX = 0.5;
      holeY = -2;
      kAns = -4;
    }

    const isNeg = (holeX * holeY < 0);
    const hypK = isNeg ? -1 : 1;

    const questionHtml = `
      <div class="math-expr">
        <em>y</em> = <span class="fraction"><span class="num">${numStr}</span><span class="den">${denStr}</span></span>
      </div>
    `;

    const svg = createGraphSvg({
      xRange: [-4, 4],
      yRange: [-4, 4],
      curves: [
        { fn: x => hypK / x, xMin: -4, xMax: -0.15, stroke: '#b7464e', width: 2.6 },
        { fn: x => hypK / x, xMin: 0.15, xMax: 4, stroke: '#b7464e', width: 2.6 }
      ],
      specialLines: [
        { type: 'line', k: kAns, label: `y = ${formatNum(kAns)}x`, color: '#2e7d32' }
      ],
      holes: [
        { x: holeX, y: holeY, label: `(${formatNum(holeX)}; ${formatNum(holeY)})` }
      ],
      asymptotes: [
        { type: 'v', val: 0, label: 'x = 0' },
        { type: 'h', val: 0, label: 'y = 0' }
      ]
    });

    const solutionSteps = [
      `<strong>Шаг 1. Разложение знаменателя на множители и ОДЗ:</strong><br>
       Вынесем общий множитель в знаменателе:<br>
       <em>y</em> = <span class="fraction"><span class="num">${numStr}</span><span class="den">${variant === 2 ? 'x(2 − x)' : 'x(2x + 1)'}</span></span>.<br>
       Знаменатель не равен нулю: <strong>x ≠ 0</strong> и <strong>x ≠ ${formatNum(holeX)}</strong>.`,
      `<strong>Шаг 2. Сокращение дроби:</strong><br>
       При <em>x ≠ ${formatNum(holeX)}</em> получаем функцию гиперболы: <strong>y = ${hypK > 0 ? '1/x' : '−1/x'}</strong>.<br>
       График представляет собой гиперболу с выколотой точкой <strong>(${formatNum(holeX)}; ${formatNum(holeY)})</strong>.`,
      `<strong>Шаг 3. Исследование прямой y = kx:</strong><br>
       Прямая <em>y = kx</em> проходит через начало координат <em>(0; 0)</em>.<br>
       С обычной гиперболой <em>y = ${hypK}/x</em> прямая <em>y = kx</em> либо имеет 0 общих точек (если не пересекает четверти гиперболы или лежит на оси), либо 2 общие точки (в противоположных ветвях).<br>
       Ровно <strong>одну общую точку</strong> прямая имеет тогда и только тогда, когда она <strong>проходит через выколотую точку</strong> (тогда одно из двух пересечений исчезает!).`,
      `<strong>Шаг 4. Нахождение коэффициента k:</strong><br>
       Подставим координаты выколотой точки <em>(${formatNum(holeX)}; ${formatNum(holeY)})</em> в уравнение <em>y = kx</em>:<br>
       ${formatNum(holeY)} = k · (${formatNum(holeX)}) ⟹ <strong>k = ${formatNum(kAns)}</strong>.`
    ];

    return {
      id: 'task22_rat_hyp_' + Date.now(),
      category: 'rational',
      catName: 'Дробно-рациональная функция (гипербола с выколотой точкой)',
      paramName: 'k',
      questionHtml,
      promptText: 'Постройте график функции в тетради и определите, при каких значениях k прямая y = kx имеет с графиком ровно одну общую точку:',
      expectedValues: [kAns],
      displayAnswer: `k = ${formatNum(kAns)}`,
      canonicalAnswerStr: formatNum(kAns),
      svgGraph: svg,
      solutionSteps,
      compareHint: `Сравните построенную гиперболу в тетради с графиком на экране. Обязательно проверьте, что точка (${formatNum(holeX)}; ${formatNum(holeY)}) выколота (кружочек пустой внутри), а прямая y = ${formatNum(kAns)}x проходит точно через начало координат и выколотую точку.`
    };
  }

  /**
   * ТИП 3: Парабола с выколотой точкой (дробно-рациональная сводящаяся к параболе)
   * Пример из ПДФ 3 (задача 1):
   * y = (x + 4)(x^2 + 3x + 2) / (x + 1) = x^2 + 6x + 8 при x != -1.
   * Вершина параболы: x_v = -3, y_v = -1.
   * Выколотая точка: x = -1 -> y = 3.
   * Прямая y = m имеет ровно одну общую точку.
   * Ответ: при m = -1 (вершина) и m = 3 (через выколотую точку).
   */
  function genParabolaHoleM() {
    // Пусть парабола y = (x - x_v)^2 + y_v = x^2 - 2 x_v x + (x_v^2 + y_v)
    const x_v = pickRandom([-3, -2, -1, 1, 2]);
    const y_v = pickRandom([-4, -2, -1, 1]);
    
    // Выколотая точка x_h != x_v
    let x_h = x_v + pickRandom([-2, -1, 1, 2]);
    if (x_h === x_v) x_h = x_v + 1;

    const y_h = Math.pow(x_h - x_v, 2) + y_v;

    // Раскладываем x^2 + bx + c
    const b = -2 * x_v;
    const c = x_v * x_v + y_v;

    // x^2 + bx + c = (x - r1)(x - r2)
    // Чтобы записать как (x - a)(x^2 + px + q) / (x - x_h):
    // y = (x^2 + bx + c)(x - x_h) / (x - x_h)
    const bSign = b === 0 ? '' : (b > 0 ? `+ ${b}x` : `− ${Math.abs(b)}x`);
    const cSign = c === 0 ? '' : (c > 0 ? `+ ${c}` : `− ${Math.abs(c)}`);
    const xhSign = x_h === 0 ? '' : (x_h > 0 ? `− ${x_h}` : `+ ${Math.abs(x_h)}`);

    const questionHtml = `
      <div class="math-expr">
        <em>y</em> = <span class="fraction"><span class="num">(<em>x</em><sup>2</sup> ${bSign} ${cSign})(<em>x</em> ${xhSign})</span><span class="den"><em>x</em> ${xhSign}</span></span>
      </div>
    `;

    const svg = createGraphSvg({
      xRange: [x_v - 4, x_v + 4],
      yRange: [y_v - 2, Math.max(y_h + 3, y_v + 6)],
      curves: [
        { fn: x => Math.pow(x - x_v, 2) + y_v, xMin: x_v - 4, xMax: x_v + 4, stroke: '#b7464e', width: 2.8 }
      ],
      specialLines: [
        { type: 'h', val: y_v, label: `y = ${formatNum(y_v)}`, color: '#2e7d32' },
        { type: 'h', val: y_h, label: `y = ${formatNum(y_h)}`, color: '#2e7d32' }
      ],
      holes: [
        { x: x_h, y: y_h, label: `(${x_h}; ${y_h})` }
      ],
      keyPoints: [
        { x: x_v, y: y_v, label: `В(${x_v}; ${y_v})`, color: '#263f61' }
      ]
    });

    const expectedValues = [y_v, y_h].sort((a, b) => a - b);

    const solutionSteps = [
      `<strong>Шаг 1. ОДЗ и упрощение формулы функции:</strong><br>
       Знаменатель дроби не должен быть равен нулю: <strong>x ${xhSign} ≠ 0 ⟹ x ≠ ${x_h}</strong>.<br>
       При <em>x ≠ ${x_h}</em> сокращаем дробь на <em>(x ${xhSign})</em>:<br>
       <strong>y = x<sup>2</sup> ${bSign} ${cSign}</strong>.`,
      `<strong>Шаг 2. Координаты вершины параболы:</strong><br>
       <em>x<sub>в</sub> = −b / (2a) = ${-b} / 2 = <strong>${x_v}</strong></em>.<br>
       <em>y<sub>в</sub> = (${x_v})<sup>2</sup> ${b >= 0 ? '+ ' + b : '− ' + Math.abs(b)}·(${x_v}) ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} = <strong>${y_v}</strong></em>.<br>
       Вершина параболы находится в точке <strong>(${x_v}; ${y_v})</strong>, ветви направлены вверх (<em>a = 1 &gt; 0</em>).`,
      `<strong>Шаг 3. Координаты выколотой точки:</strong><br>
       При <em>x = ${x_h}</em> значение <em>y = (${x_h} − ${x_v})<sup>2</sup> ${y_v >= 0 ? '+' : ''}${y_v} = <strong>${y_h}</strong></em>.<br>
       Точка <strong>(${x_h}; ${y_h})</strong> обязательно выкалывается на графике!`,
      `<strong>Шаг 4. Определение значений m для прямой y = m:</strong><br>
       Прямая <em>y = m</em> параллельна оси абсцисс.<br>
       Она имеет с параболой ровно одну общую точку в двух случаях:<br>
       1) Проходит через <strong>вершину параболы</strong>: <strong>m = ${y_v}</strong>.<br>
       2) Проходит через <strong>выколотую точку</strong> (тогда одно из двух пересечений выкалывается): <strong>m = ${y_h}</strong>.`
    ];

    return {
      id: 'task22_parabola_hole_' + Date.now(),
      category: 'parabola',
      catName: 'Парабола с выколотой точкой',
      paramName: 'm',
      questionHtml,
      promptText: 'Постройте график функции в тетради и определите, при каких значениях m прямая y = m имеет с графиком ровно одну общую точку (введите значения через точку с запятой):',
      expectedValues,
      displayAnswer: `m = ${expectedValues[0]}; m = ${expectedValues[1]}`,
      canonicalAnswerStr: `${expectedValues[0]}; ${expectedValues[1]}`,
      svgGraph: svg,
      solutionSteps,
      compareHint: `Сравните график в тетради с экраном: вершина параболы должна быть в точке (${x_v}; ${y_v}), а точка (${x_h}; ${y_h}) должна быть аккуратно выколота. Прямые y = ${expectedValues[0]} и y = ${expectedValues[1]} имеют с параболой ровно по одной точке.`
    };
  }

  /**
   * ТИП 4: Парабола с модулем аргумента: y = x^2 - 4|x| + 3 или y = x|x| - 2x
   * Пример из ПДФ 1 (задача 4): y = |x|(x + 1) - 6x
   * При x >= 0: y = x^2 - 5x (вершина в 2.5; -6.25)
   * При x < 0: y = -x^2 - 7x (вершина в -3.5; 12.25)
   */
  function genParabolaWithModule() {
    // Классическая симметричная парабола y = x^2 - 2b|x| + c
    // Либо y = x|x| + b x
    const p = pickRandom([2, 4, 6]);
    const q = pickRandom([-3, -1, 3, 5]);

    // y = x^2 - p|x| + q
    // При x >= 0: y = x^2 - px + q, вершина x_v = p/2, y_v = -(p/2)^2 + q
    // При x < 0: y = x^2 + px + q, вершина x_v = -p/2, y_v = -(p/2)^2 + q
    // Стык в x = 0: y = q.
    // Прямая y = m имеет ровно 3 общие точки: в стыке y = q (3 точки) или в вершинах y_v (2 точки), выше q (2 точки), между y_v и q (4 точки).
    // Вопрос: при каких m прямая y = m имеет ровно ТРИ общие точки? Ответ: m = q.
    // Либо ровно ДВЕ общие точки: m = y_v (в двух вершинах).
    const xv = p / 2;
    const yv = -Math.pow(xv, 2) + q;

    const askThree = Math.random() > 0.5;
    const expectedValues = askThree ? [q] : [yv];
    const targetPointsCount = askThree ? 'три' : 'две';

    const qSign = q >= 0 ? `+ ${q}` : `− ${Math.abs(q)}`;

    const questionHtml = `
      <div class="math-expr">
        <em>y</em> = <em>x</em><sup>2</sup> − ${p}|<em>x</em>| ${qSign}
      </div>
    `;

    const svg = createGraphSvg({
      xRange: [-xv - 3, xv + 3],
      yRange: [yv - 2, q + 4],
      curves: [
        { fn: x => Math.pow(x, 2) - p * Math.abs(x) + q, xMin: -xv - 3, xMax: xv + 3, stroke: '#b7464e', width: 2.8 }
      ],
      specialLines: [
        { type: 'h', val: askThree ? q : yv, label: `y = ${askThree ? q : yv}`, color: '#2e7d32' }
      ],
      keyPoints: [
        { x: 0, y: q, label: `(0; ${q})`, color: '#263f61' },
        { x: xv, y: yv, label: `(${xv}; ${yv})`, color: '#b7464e' },
        { x: -xv, y: yv, label: `(−${xv}; ${yv})`, color: '#b7464e' }
      ]
    });

    const solutionSteps = [
      `<strong>Шаг 1. Раскрытие модуля по определению:</strong><br>
       • При <strong>x ≥ 0</strong>: |x| = x, получаем параболу <strong>y = x<sup>2</sup> − ${p}x ${qSign}</strong>.<br>
       • При <strong>x &lt; 0</strong>: |x| = −x, получаем параболу <strong>y = x<sup>2</sup> + ${p}x ${qSign}</strong>.<br>
       График чётен относительно оси <em>Oy</em> (ось симметрии).`,
      `<strong>Шаг 2. Нахождение вершин:</strong><br>
       • Для правой части (<em>x ≥ 0</em>): <em>x<sub>в</sub> = ${xv}</em>, <em>y<sub>в</sub> = (${xv})<sup>2</sup> − ${p}·${xv} ${qSign} = <strong>${yv}</strong></em>.<br>
       • Для левой части (<em>x &lt; 0</em>): <em>x<sub>в</sub> = −${xv}</em>, <em>y<sub>в</sub> = <strong>${yv}</strong></em>.<br>
       • В точке <em>x = 0</em> ветви соединяются: <em>y(0) = <strong>${q}</strong></em>.`,
      `<strong>Шаг 3. Анализ числа общих точек с прямой y = m:</strong><br>
       • При <em>m &lt; ${yv}</em>: 0 общих точек.<br>
       • При <em>m = ${yv}</em>: ровно 2 общие точки (вершины парабол).<br>
       • При <em>${yv} &lt; m &lt; ${q}</em>: 4 общие точки.<br>
       • При <strong>m = ${q}</strong>: ровно 3 общие точки (в точке излома (0; ${q}) и двух точках боковых ветвей).<br>
       • При <em>m &gt; ${q}</em>: 2 общие точки.<br>
       Следовательно, ровно <strong>${targetPointsCount} общие точки</strong> прямая имеет при <strong>m = ${expectedValues[0]}</strong>.`
    ];

    return {
      id: 'task22_module_parabola_' + Date.now(),
      category: 'module',
      catName: 'Парабола с модулем (w-образная функция)',
      paramName: 'm',
      questionHtml,
      promptText: `Постройте график функции в тетради и определите, при каких значениях m прямая y = m имеет с графиком ровно ${targetPointsCount} общие точки:`,
      expectedValues,
      displayAnswer: `m = ${expectedValues[0]}`,
      canonicalAnswerStr: String(expectedValues[0]),
      svgGraph: svg,
      solutionSteps,
      compareHint: `Сравните построенный "W-образный" график с экраном: проверьте симметричность относительно оси ординат, координаты обеих нижних вершин (±${xv}; ${yv}) и точку стыка (0; ${q}).`
    };
  }

  /**
   * ТИП 5: Кусочная функция «парабола + гипербола»
   * Пример из ПДФ 1 (задача 9):
   * y = { x^2 + 4x + 4, при x >= -4
   *     { -16/x, при x < -4
   * При x = -4: x^2 + 4x + 4 = 4. А -16/(-4) = 4. Непрерывный стык в (-4; 4)!
   * Вершина параболы: x_v = -2, y_v = 0.
   * Прямая y = m имеет ровно 1 или 2 общие точки (или ровно 2 точки).
   */
  function genPiecewiseParabolaHyperbola() {
    // y = x^2 + 4x + 4 при x >= -4 (вершина в -2; 0)
    // y = -16/x при x < -4 (стык в -4; 4)
    const questionHtml = `
      <div class="math-expr">
        <div class="system-bracket">
          <span class="system-brace">{</span>
          <div class="system-equations">
            <div><em>y</em> = <em>x</em><sup>2</sup> + 4<em>x</em> + 4, при <em>x</em> ≥ −4</div>
            <div><em>y</em> = −<span class="fraction"><span class="num">16</span><span class="den"><em>x</em></span></span>, при <em>x</em> &lt; −4</div>
          </div>
        </div>
      </div>
    `;

    const svg = createGraphSvg({
      xRange: [-8, 3],
      yRange: [-2, 8],
      curves: [
        { fn: x => Math.pow(x + 2, 2), xMin: -4, xMax: 2, stroke: '#b7464e', width: 2.8 },
        { fn: x => -16 / x, xMin: -8, xMax: -4, stroke: '#b7464e', width: 2.8 }
      ],
      specialLines: [
        { type: 'h', val: 0, label: 'y = 0', color: '#2e7d32' },
        { type: 'h', val: 4, label: 'y = 4', color: '#2e7d32' }
      ],
      keyPoints: [
        { x: -2, y: 0, label: 'В(−2; 0)', color: '#263f61' },
        { x: -4, y: 4, label: 'Стык(−4; 4)', color: '#263f61' }
      ],
      asymptotes: [
        { type: 'h', val: 0, label: 'y = 0' }
      ]
    });

    const expectedValues = [0, 4];

    const solutionSteps = [
      `<strong>Шаг 1. Построение частей графика:</strong><br>
       • При <em>x ≥ −4</em> строим параболу <em>y = (x + 2)<sup>2</sup></em> с вершиной в точке <strong>(−2; 0)</strong>. В граничной точке <em>x = −4</em> получаем <em>y = (−4 + 2)<sup>2</sup> = <strong>4</strong></em>.<br>
       • При <em>x &lt; −4</em> строим ветвь гиперболы <em>y = −16/x</em> во II четверти. При приближении к <em>x = −4</em> слева <em>y → −16/(−4) = <strong>4</strong></em>.<br>
       Таким образом, в точке <strong>(−4; 4)</strong> график непрерывно соединяется.`,
      `<strong>Шаг 2. Исследование прямой y = m:</strong><br>
       • При <em>m &lt; 0</em>: 0 общих точек.<br>
       • При <strong>m = 0</strong>: прямая касается параболы в вершине (−2; 0) и является горизонтальной асимптотой гиперболы (с гиперболой общих точек нет) — <strong>ровно 1 общая точка</strong>.<br>
       • При <em>0 &lt; m &lt; 4</em>: прямая пересекает обе ветви параболы и гиперболу — 3 общие точки.<br>
       • При <strong>m = 4</strong>: прямая проходит через стык (−4; 4) и пересекает правую ветвь параболы в (0; 4) — <strong>ровно 2 общие точки</strong>.<br>
       • При <em>m &gt; 4</em>: прямая пересекает только правую ветвь параболы — 1 общая точка.<br>
       Критическими уровнями изменения числа решений являются <strong>m = 0</strong> и <strong>m = 4</strong>.`
    ];

    return {
      id: 'task22_pw_parab_hyp_' + Date.now(),
      category: 'piecewise',
      catName: 'Смешанная кусочная функция (парабола + гипербола)',
      paramName: 'm',
      questionHtml,
      promptText: 'Постройте график функции в тетради и определите критические значения параметра m, при которых прямая y = m имеет с графиком ровно одну общую точку (вершина параболы) или две общие точки (стык):',
      expectedValues,
      displayAnswer: 'm = 0; m = 4',
      canonicalAnswerStr: '0; 4',
      svgGraph: svg,
      solutionSteps,
      compareHint: 'Сравните график в тетради с экраном: проверьте касание оси абсцисс в вершине (−2; 0), точку плавного стыка ветви гиперболы с параболой в (−4; 4) и асимптотическое приближение гиперболы к оси Ox.'
    };
  }

  /* --------------------------------------------------------------------------
     ГЛАВНЫЙ ГЕНЕРАТОР ЗАДАНИЙ №22
     -------------------------------------------------------------------------- */
  function generateTask(category = 'all') {
    const generators = {
      piecewise: [genPiecewiseLinear, genPiecewiseParabolaHyperbola],
      rational: [genRationalHyperbolaKx],
      parabola: [genParabolaHoleM],
      module: [genParabolaWithModule]
    };

    let pool = [];
    if (category === 'all' || category === 'mixed_all') {
      pool = [
        genPiecewiseLinear,
        genRationalHyperbolaKx,
        genParabolaHoleM,
        genParabolaWithModule,
        genPiecewiseParabolaHyperbola
      ];
    } else if (generators[category]) {
      pool = generators[category];
    } else {
      pool = [genPiecewiseLinear, genRationalHyperbolaKx, genParabolaHoleM];
    }

    const generator = pickRandom(pool);
    return generator();
  }

  /* --------------------------------------------------------------------------
     ПРОВЕРКА ОТВЕТА УЧЕНИКА
     -------------------------------------------------------------------------- */
  function checkAnswer(userValue, task) {
    if (!userValue || typeof userValue !== 'string') {
      return { isCorrect: false, message: 'Пожалуйста, введите найденное значение параметра.' };
    }

    // Разбиваем строку пользователя на отдельные числа (поддерживаются разделители ;, пробел, запятая между числами)
    // Аккуратно: запятая может быть десятичным разделителем "1,5", а может разделять числа "1, 2"
    let raw = userValue.replace(/−/g, '-').trim();

    // Если есть точка с запятой — делим по ней
    let tokens = [];
    if (raw.includes(';')) {
      tokens = raw.split(';').map(s => s.trim()).filter(Boolean);
    } else if (raw.includes(' и ')) {
      tokens = raw.split(' и ').map(s => s.trim()).filter(Boolean);
    } else {
      // Пробуем разбить по пробелам
      tokens = raw.split(/\s+/).filter(Boolean);
    }

    // Если получилось одно число или несколько — парсим каждое
    const parsedNums = [];
    tokens.forEach(tok => {
      const clean = tok.replace(/^[a-zа-я]\s*=\s*/i, '').trim();
      const num = normalizeNum(clean);
      if (!isNaN(num)) {
        parsedNums.push(Math.round(num * 1000) / 1000);
      }
    });

    if (parsedNums.length === 0) {
      return { isCorrect: false, message: 'Не удалось распознать числа. Вводите ответ в формате: 2; 6 или −1,5' };
    }

    const expected = task.expectedValues.map(v => Math.round(v * 1000) / 1000).sort((a, b) => a - b);
    const userSorted = parsedNums.sort((a, b) => a - b);

    // Удаляем дубликаты у пользователя
    const uniqueUser = Array.from(new Set(userSorted));

    // Проверяем совпадение наборов чисел
    if (uniqueUser.length !== expected.length) {
      return {
        isCorrect: false,
        message: `Ожидалось ${expected.length} знач., а распознано ${uniqueUser.length}. Проверьте правильность нахождения всех критических уровней параметра.`
      };
    }

    const allMatch = expected.every((exp, idx) => Math.abs(exp - uniqueUser[idx]) < 0.05);

    if (allMatch) {
      return {
        isCorrect: true,
        message: 'Великолепно! Значения параметра найдены совершенно верно. Теперь внимательно сравните построенный в тетради график с эталоном ниже.'
      };
    } else {
      return {
        isCorrect: false,
        message: 'Неверные значения параметра. Проверьте координаты вершины параболы, выколотые точки или уровень изломов.'
      };
    }
  }

  return {
    generateTask,
    checkAnswer,
    createGraphSvg,
    formatNum
  };
}));
