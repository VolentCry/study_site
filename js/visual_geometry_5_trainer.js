/**
 * Тренажёр по математике · 5 класс
 * «Наглядная геометрия: углы и транспортир, отрезки и ломаная, окружность,
 * периметр и площадь составных фигур, куб и прямоугольный параллелепипед»
 *
 * Соответствует программе ФГОС 5 класса.
 * Содержит параметрические SVG-чертежи, пошаговые разборы и поддержку ДЗ.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VisualGeometry5Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const C = {
    ink: '#19273c',
    stroke: '#263f61',
    accent: '#b7464e',
    emerald: '#0f766e',
    gold: '#b45309',
    muted: '#64748b',
    fillSoft: 'rgba(38, 63, 97, 0.08)',
    fillAccent: 'rgba(183, 70, 78, 0.14)',
    fillGold: 'rgba(200, 149, 108, 0.20)'
  };

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
    return Math.round(n * 1e5) / 1e5;
  }

  function formatDisplayNum(n) {
    const v = cleanFloat(n);
    const parts = String(v).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }

  function wrapSvg(inner, w = 360, h = 220) {
    return `
      <div class="geo5-svg-wrap" style="display:flex; justify-content:center; margin:14px 0 4px;">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="background:#ffffff; border-radius:12px; border:1px solid rgba(38,63,97,0.2); box-shadow:0 4px 16px rgba(0,0,0,0.06); max-width:100%; height:auto;">
          ${inner}
        </svg>
      </div>
    `.trim();
  }

  function svgText(x, y, text, opts = {}) {
    const fill = opts.fill || C.ink;
    const size = opts.size || 13;
    const weight = opts.weight || 700;
    const anchor = opts.anchor || 'middle';
    const baseline = opts.baseline || 'auto';
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${fill}" font-family="DM Sans, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" dominant-baseline="${baseline}">${text}</text>`;
  }

  function buildNumericOptions(correctVal, unitSuffix) {
    const c = cleanFloat(correctVal);
    const pool = new Set();
    const candidates = [
      c + 2, c - 2, c + 5, c - 5, c + 10, c - 10,
      c * 2, cleanFloat(c / 2), c + 4, c - 4,
      c + 15, c - 15, c + 20, c - 20, c + 1, c - 1
    ];
    for (const cand of shuffle(candidates)) {
      if (pool.size >= 3) break;
      if (cand > 0 && Math.abs(cand - c) > 1e-5 && (Number.isInteger(c) ? Number.isInteger(cand) : true)) {
        pool.add(cand);
      }
    }
    let guard = 0;
    while (pool.size < 3 && guard < 30) {
      guard++;
      const cand = cleanFloat(c + randInt(1, 18));
      if (cand > 0 && Math.abs(cand - c) > 1e-5) pool.add(cand);
    }

    const raw = shuffle([c, ...Array.from(pool).slice(0, 3)]);
    const correctIndex = raw.findIndex(v => Math.abs(v - c) < 1e-5);
    const suffix = unitSuffix ? ` ${unitSuffix}` : '';
    const options = raw.map(v => ({
      value: String(v),
      text: `${formatDisplayNum(v)}${suffix}`,
      html: `${formatDisplayNum(v)}${suffix}`
    }));

    return { options, correctIndex };
  }

  function makeNumericTask({ category, catName, prompt, questionText, svgHtml, answerNum, unitSuffix, hint, solutionSteps }) {
    const ansCanonical = String(cleanFloat(answerNum));
    const ansDisplay = formatDisplayNum(answerNum);
    const { options, correctIndex } = buildNumericOptions(answerNum, unitSuffix);

    return {
      category,
      catName,
      prompt: prompt || 'Решите геометрическую задачу по чертежу:',
      questionHtml: `<div class="geo5-q-text">${questionText}</div>${svgHtml}`,
      answer: ansCanonical,
      displayAnswer: ansDisplay,
      unitSuffix: unitSuffix || '',
      unit: unitSuffix || '',
      acceptedAnswers: [
        ansCanonical,
        ansDisplay,
        ansDisplay.replace(/\s+/g, ''),
        unitSuffix ? `${ansDisplay}${unitSuffix}` : ansDisplay,
        unitSuffix ? `${ansDisplay} ${unitSuffix}` : ansDisplay
      ],
      options,
      correctOptionIndex: correctIndex,
      forceChoice: false,
      hint,
      solutionSteps
    };
  }

  // =========================================================================
  // 1. УГЛЫ И ТРАНСПОРТИР
  // =========================================================================
  function genAngleType() {
    const kind = pickRandom(['acute', 'right', 'obtuse', 'straight']);
    let deg;
    if (kind === 'acute') deg = randInt(25, 75);
    else if (kind === 'right') deg = 90;
    else if (kind === 'obtuse') deg = randInt(105, 155);
    else deg = 180;

    const cx = kind === 'straight' ? 180 : 120;
    const cy = 155;
    const len = 115;
    const baseTilt = kind === 'straight' ? 0 : randInt(-12, 12);
    const a1Rad = (baseTilt * Math.PI) / 180;
    const a2Rad = ((baseTilt + deg) * Math.PI) / 180;

    const x1 = cx + len * Math.cos(a1Rad);
    const y1 = cy - len * Math.sin(a1Rad);
    const x2 = cx + len * Math.cos(a2Rad);
    const y2 = cy - len * Math.sin(a2Rad);

    let mark = '';
    if (kind === 'right') {
      const s = 18;
      const px1 = cx + s * Math.cos(a1Rad);
      const py1 = cy - s * Math.sin(a1Rad);
      const px2 = cx + s * Math.cos(a2Rad);
      const py2 = cy - s * Math.sin(a2Rad);
      const pCornerX = px1 + (px2 - cx);
      const pCornerY = py1 + (py2 - cy);
      mark = `<polyline points="${px1.toFixed(1)},${py1.toFixed(1)} ${pCornerX.toFixed(1)},${pCornerY.toFixed(1)} ${px2.toFixed(1)},${py2.toFixed(1)}" fill="none" stroke="${C.accent}" stroke-width="2"/>`;
    } else {
      const r = 34;
      const ax1 = cx + r * Math.cos(a1Rad);
      const ay1 = cy - r * Math.sin(a1Rad);
      const ax2 = cx + r * Math.cos(a2Rad);
      const ay2 = cy - r * Math.sin(a2Rad);
      const largeArc = deg > 180 ? 1 : 0;
      mark = `<path d="M ${cx} ${cy} L ${ax1.toFixed(1)} ${ay1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${ax2.toFixed(1)} ${ay2.toFixed(1)} Z" fill="${C.fillAccent}" stroke="${C.accent}" stroke-width="2"/>`;
    }

    const svg = wrapSvg(`
      ${mark}
      <line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.accent}"/>
      ${svgText(cx - 12, cy + 18, 'O', { fill: C.stroke })}
      ${svgText(x1 + (x1 >= cx ? 12 : -12), y1 + 4, 'A', { fill: C.stroke })}
      ${svgText(x2 + (x2 >= cx ? 12 : -12), y2 - 8, 'B', { fill: C.stroke })}
    `, 360, 200);

    const names = {
      acute: 'Острый',
      right: 'Прямой',
      obtuse: 'Тупой',
      straight: 'Развёрнутый'
    };

    const labels = ['Острый', 'Прямой', 'Тупой', 'Развёрнутый'];
    const correctLabel = names[kind];
    const correctIndex = labels.indexOf(correctLabel);

    const explain = {
      acute: `Угол меньше 90° (${deg}°) — это <strong>острый угол</strong>.`,
      right: `Угол равен 90° (отмечен квадратиком) — это <strong>прямой угол</strong>.`,
      obtuse: `Угол больше 90°, но меньше 180° (${deg}°) — это <strong>тупой угол</strong>.`,
      straight: `Стороны угла образуют прямую линию, угол равен 180° — это <strong>развёрнутый угол</strong>.`
    };

    return {
      category: 'angles',
      catName: 'Виды углов',
      prompt: 'Определите вид угла, изображённого на чертеже:',
      questionHtml: `<div class="geo5-q-text">Каким является угол <strong>∠AOB</strong>?</div>${svg}`,
      answer: correctLabel,
      displayAnswer: correctLabel,
      acceptedAnswers: [correctLabel, correctLabel.toLowerCase()],
      options: labels.map(l => ({ value: l, text: l, html: l })),
      correctOptionIndex: correctIndex,
      forceChoice: true,
      hint: 'Сравните угол с прямым углом (90°, как угол листа тетради) и развёрнутым (180°, прямая линия).',
      solutionSteps: [explain[kind]]
    };
  }

  function genProtractorMeasure() {
    const startZero = Math.random() < 0.7;
    const a1 = startZero ? 0 : pickRandom([10, 20, 30, 40]);
    const stepDeg = pickRandom([25, 35, 45, 55, 65, 75, 80, 105, 115, 125, 135]);
    const a2 = Math.min(170, a1 + stepDeg);
    const actualAngle = a2 - a1;

    const cx = 180;
    const cy = 185;
    const R = 140;
    const rInner = 108;

    let ticks = '';
    for (let d = 0; d <= 180; d += 5) {
      const rad = (d * Math.PI) / 180;
      const isMajor = d % 10 === 0;
      const isBig = d % 30 === 0;
      const r0 = isBig ? R - 18 : isMajor ? R - 13 : R - 7;
      const xStart = cx + r0 * Math.cos(rad);
      const yStart = cy - r0 * Math.sin(rad);
      const xEnd = cx + R * Math.cos(rad);
      const yEnd = cy - R * Math.sin(rad);
      ticks += `<line x1="${xStart.toFixed(1)}" y1="${yStart.toFixed(1)}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="${isBig ? C.ink : C.muted}" stroke-width="${isBig ? 1.6 : 1}"/>`;
      if (d % 20 === 0) {
        const rx = cx + (R - 29) * Math.cos(rad);
        const ry = cy - (R - 29) * Math.sin(rad) - (d === 0 || d === 180 ? 10 : 0);
        ticks += svgText(rx, ry, String(d), { size: 10.5, weight: 700, fill: C.stroke, baseline: 'middle' });
      }
    }

    const rad1 = (a1 * Math.PI) / 180;
    const rad2 = (a2 * Math.PI) / 180;
    const rayLen = R + 12;
    const x1 = cx + rayLen * Math.cos(rad1);
    const y1 = cy - rayLen * Math.sin(rad1);
    const x2 = cx + rayLen * Math.cos(rad2);
    const y2 = cy - rayLen * Math.sin(rad2);

    const sectorR = 54;
    const sx1 = cx + sectorR * Math.cos(rad1);
    const sy1 = cy - sectorR * Math.sin(rad1);
    const sx2 = cx + sectorR * Math.cos(rad2);
    const sy2 = cy - sectorR * Math.sin(rad2);

    const svg = wrapSvg(`
      <path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z" fill="rgba(38,63,97,0.04)" stroke="${C.stroke}" stroke-width="1.8"/>
      <path d="M ${cx - rInner} ${cy} A ${rInner} ${rInner} 0 0 1 ${cx + rInner} ${cy}" fill="none" stroke="rgba(38,63,97,0.16)" stroke-width="1"/>
      ${ticks}
      <path d="M ${cx} ${cy} L ${sx1.toFixed(1)} ${sy1.toFixed(1)} A ${sectorR} ${sectorR} 0 0 0 ${sx2.toFixed(1)} ${sy2.toFixed(1)} Z" fill="${C.fillAccent}"/>
      <line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${C.accent}" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.accent}" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.accent}"/>
    `, 360, 215);

    const steps = startZero
      ? [
          `Один луч проходит через отметку <strong>0°</strong>.`,
          `Второй луч указывает на деление <strong>${a2}°</strong> по шкале транспортира.`,
          `Градусная мера угла равна <strong>${actualAngle}°</strong>.`
        ]
      : [
          `Лучи пересекают шкалу транспортира на отметках <strong>${a1}°</strong> и <strong>${a2}°</strong>.`,
          `Вычитаем меньшее значение из большего: ${a2}° − ${a1}° = <strong>${actualAngle}°</strong>.`
        ];

    return makeNumericTask({
      category: 'angles',
      catName: 'Измерение транспортиром',
      prompt: 'Определите градусную меру угла по транспортиру:',
      questionText: 'Чему равен угол (в градусах), отмеченный на транспортире?',
      svgHtml: svg,
      answerNum: actualAngle,
      unitSuffix: '°',
      hint: startZero ? 'Посмотрите, на какое деление указывает второй луч.' : 'Найдите разность между делениями, через которые проходят оба луча.',
      solutionSteps: steps
    });
  }

  function genAngleSplit() {
    const isStraight = Math.random() < 0.6;
    const total = isStraight ? 180 : 90;
    const part1 = isStraight ? randInt(25, 145) : randInt(20, 68);
    const ans = total - part1;

    const cx = 180;
    const cy = 155;
    const len = 115;

    let svgBody = '';
    if (isStraight) {
      const r1 = 36;
      const r2 = 44;
      const rad = (part1 * Math.PI) / 180;
      const mx = cx + len * Math.cos(rad);
      const my = cy - len * Math.sin(rad);
      const ax = cx + r1 * Math.cos(rad);
      const ay = cy - r1 * Math.sin(rad);
      const ax2 = cx + r2 * Math.cos(rad);
      const ay2 = cy - r2 * Math.sin(rad);
      const mid1 = (part1 / 2) * Math.PI / 180;
      const mid2 = ((180 + part1) / 2) * Math.PI / 180;

      svgBody = `
        <path d="M ${cx} ${cy} L ${cx + r1} ${cy} A ${r1} ${r1} 0 0 0 ${ax.toFixed(1)} ${ay.toFixed(1)} Z" fill="${C.fillGold}" stroke="${C.gold}" stroke-width="1.8"/>
        <path d="M ${cx} ${cy} L ${ax2.toFixed(1)} ${ay2.toFixed(1)} A ${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z" fill="${C.fillAccent}" stroke="${C.accent}" stroke-width="1.8"/>
        <line x1="${cx - len}" y1="${cy}" x2="${cx + len}" y2="${cy}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="${C.stroke}"/>
        ${svgText(cx + 62 * Math.cos(mid1), cy - 62 * Math.sin(mid1), `${part1}°`, { fill: C.gold })}
        ${svgText(cx + 66 * Math.cos(mid2), cy - 66 * Math.sin(mid2), `?`, { fill: C.accent, size: 16 })}
        ${svgText(cx, cy + 18, 'O')}
        ${svgText(cx - len - 10, cy + 5, 'A')}
        ${svgText(cx + len + 10, cy + 5, 'B')}
        ${svgText(mx + 10, my - 10, 'C')}
      `;
    } else {
      const cx90 = 115;
      const cy90 = 165;
      const rad = (part1 * Math.PI) / 180;
      const mx = cx90 + len * Math.cos(rad);
      const my = cy90 - len * Math.sin(rad);
      const r1 = 38;
      const r2 = 46;
      const ax1 = cx90 + r1 * Math.cos(rad);
      const ay1 = cy90 - r1 * Math.sin(rad);
      const ax2 = cx90 + r2 * Math.cos(rad);
      const ay2 = cy90 - r2 * Math.sin(rad);
      const mid1 = (part1 / 2) * Math.PI / 180;
      const mid2 = ((90 + part1) / 2) * Math.PI / 180;

      svgBody = `
        <rect x="${cx90}" y="${cy90 - 16}" width="16" height="16" fill="none" stroke="${C.stroke}" stroke-width="1.6"/>
        <path d="M ${cx90} ${cy90} L ${cx90 + r1} ${cy90} A ${r1} ${r1} 0 0 0 ${ax1.toFixed(1)} ${ay1.toFixed(1)} Z" fill="${C.fillGold}" stroke="${C.gold}" stroke-width="1.8"/>
        <path d="M ${cx90} ${cy90} L ${ax2.toFixed(1)} ${ay2.toFixed(1)} A ${r2} ${r2} 0 0 0 ${cx90} ${cy90 - r2} Z" fill="${C.fillAccent}" stroke="${C.accent}" stroke-width="1.8"/>
        <line x1="${cx90}" y1="${cy90}" x2="${cx90 + len}" y2="${cy90}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="${cx90}" y1="${cy90}" x2="${cx90}" y2="${cy90 - len}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="${cx90}" y1="${cy90}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${cx90}" cy="${cy90}" r="4" fill="${C.stroke}"/>
        ${svgText(cx90 + 68 * Math.cos(mid1), cy90 - 68 * Math.sin(mid1), `${part1}°`, { fill: C.gold })}
        ${svgText(cx90 + 72 * Math.cos(mid2), cy90 - 72 * Math.sin(mid2), `?`, { fill: C.accent, size: 16 })}
        ${svgText(cx90 - 12, cy90 + 16, 'O')}
      `;
    }

    const svg = wrapSvg(svgBody, 360, 200);
    const labelType = isStraight ? 'Развёрнутый угол AOB = 180°' : 'Прямой угол (90°)';

    return makeNumericTask({
      category: 'angles',
      catName: 'Части угла',
      prompt: 'Найдите градусную меру неизвестного угла:',
      questionText: `${labelType} разделён лучом на два угла. Один из них равен <strong>${part1}°</strong>. Найдите второй угол.`,
      svgHtml: svg,
      answerNum: ans,
      unitSuffix: '°',
      hint: isStraight ? 'Развёрнутый угол равен 180°.' : 'Прямой угол равен 90°.',
      solutionSteps: [
        `${labelType}.`,
        `Вычитаем известный угол: ${total}° − ${part1}° = <strong>${ans}°</strong>.`
      ]
    });
  }

  // =========================================================================
  // 2. ОТРЕЗКИ, ЛОМАНАЯ И ОКРУЖНОСТЬ
  // =========================================================================
  function genPolylineLength() {
    const a = randInt(4, 15);
    const b = randInt(5, 18);
    const c = randInt(4, 16);
    const d = randInt(5, 14);
    const total = a + b + c + d;

    const findMissing = Math.random() < 0.45;
    const pts = [
      { x: 42, y: 148, name: 'A' },
      { x: 112, y: 52, name: 'B' },
      { x: 196, y: 142, name: 'C' },
      { x: 266, y: 58, name: 'D' },
      { x: 325, y: 138, name: 'E' }
    ];

    const labels = [a, b, c, findMissing ? '?' : d];
    const segColors = [C.stroke, C.stroke, C.stroke, findMissing ? C.accent : C.stroke];
    const labelSpecs = [
      { dx: -10, dy: -4, anchor: 'end' },
      { dx: -10, dy: 10, anchor: 'end' },
      { dx: 10, dy: 10, anchor: 'start' },
      { dx: 10, dy: -4, anchor: 'start' }
    ];

    let lines = '';
    for (let i = 0; i < 4; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      lines += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${segColors[i]}" stroke-width="3" stroke-linecap="round"/>`;
      const mx = (p1.x + p2.x) / 2 + labelSpecs[i].dx;
      const my = (p1.y + p2.y) / 2 + labelSpecs[i].dy;
      const lbl = labels[i] === '?' ? '?' : `${labels[i]} см`;
      lines += svgText(mx, my, lbl, {
        fill: labels[i] === '?' ? C.accent : C.ink,
        size: labels[i] === '?' ? 16 : 13,
        anchor: labelSpecs[i].anchor
      });
    }

    let dots = '';
    pts.forEach((p, idx) => {
      dots += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${C.accent}"/>`;
      const dy = idx % 2 === 0 ? 18 : -12;
      dots += svgText(p.x, p.y + dy, p.name, { fill: C.stroke });
    });

    const svg = wrapSvg(lines + dots, 360, 195);

    if (findMissing) {
      return makeNumericTask({
        category: 'segments_circle',
        catName: 'Ломаная линия',
        prompt: 'Найдите длину неизвестного звена ломаной:',
        questionText: `Длина всей ломаной <strong>ABCDE</strong> равна <strong>${total} см</strong>. Найдите длину звена <strong>DE</strong> (в см).`,
        svgHtml: svg,
        answerNum: d,
        unitSuffix: 'см',
        hint: 'Длина ломаной равна сумме длин всех её звеньев.',
        solutionSteps: [
          `Сложим известные звенья: ${a} + ${b} + ${c} = ${a + b + c} см.`,
          `Вычтем из общей длины: ${total} − ${a + b + c} = <strong>${d} см</strong>.`
        ]
      });
    }

    return makeNumericTask({
      category: 'segments_circle',
      catName: 'Ломаная линия',
      prompt: 'Найдите общую длину ломаной линии:',
      questionText: 'Вычислите длину ломаной <strong>ABCDE</strong> (в см).',
      svgHtml: svg,
      answerNum: total,
      unitSuffix: 'см',
      hint: 'Сложите длины всех четырёх звеньев ломаной.',
      solutionSteps: [
        `Длина ломаной равна сумме длин всех её звеньев:`,
        `${a} + ${b} + ${c} + ${d} = <strong>${total} см</strong>.`
      ]
    });
  }

  function genSegmentDivision() {
    const ab = randInt(28, 65);
    const ac = randInt(8, Math.floor(ab / 2) - 2);
    const db = randInt(7, Math.floor(ab / 2) - 2);
    const cd = ab - ac - db;

    const svg = wrapSvg(`
      <line x1="36" y1="95" x2="324" y2="95" stroke="${C.stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="36" cy="95" r="5" fill="${C.accent}"/>
      <circle cx="122" cy="95" r="5" fill="${C.stroke}"/>
      <circle cx="228" cy="95" r="5" fill="${C.stroke}"/>
      <circle cx="324" cy="95" r="5" fill="${C.accent}"/>
      ${svgText(36, 76, 'A')}
      ${svgText(122, 76, 'C')}
      ${svgText(228, 76, 'D')}
      ${svgText(324, 76, 'B')}
      <path d="M 36 112 Q 79 130 122 112" fill="none" stroke="${C.gold}" stroke-width="2"/>
      ${svgText(79, 138, `${ac} см`, { fill: C.gold })}
      <path d="M 228 112 Q 276 130 324 112" fill="none" stroke="${C.emerald}" stroke-width="2"/>
      ${svgText(276, 138, `${db} см`, { fill: C.emerald })}
      <path d="M 122 112 Q 175 130 228 112" fill="none" stroke="${C.accent}" stroke-width="2" stroke-dasharray="4 3"/>
      ${svgText(175, 138, `?`, { fill: C.accent, size: 15 })}
      <path d="M 36 52 L 36 44 L 324 44 L 324 52" fill="none" stroke="${C.muted}" stroke-width="1.5"/>
      ${svgText(180, 36, `AB = ${ab} см`, { fill: C.stroke })}
    `, 360, 175);

    return makeNumericTask({
      category: 'segments_circle',
      catName: 'Отрезки',
      prompt: 'Найдите длину части отрезка:',
      questionText: `Длина отрезка <strong>AB</strong> равна <strong>${ab} см</strong>, AC = ${ac} см, DB = ${db} см. Найдите длину отрезка <strong>CD</strong> (в см).`,
      svgHtml: svg,
      answerNum: cd,
      unitSuffix: 'см',
      hint: 'Из общей длины AB вычтите длины крайних частей AC и DB.',
      solutionSteps: [
        `Сумма крайних частей: AC + DB = ${ac} + ${db} = ${ac + db} см.`,
        `CD = ${ab} − ${ac + db} = <strong>${cd} см</strong>.`
      ]
    });
  }

  function genCircleDiameterRadius() {
    const mode = pickRandom(['find_d', 'find_r', 'two_circles', 'square_circle']);

    if (mode === 'find_d') {
      const r = randInt(4, 28);
      const d = 2 * r;
      const svg = wrapSvg(`
        <circle cx="180" cy="105" r="74" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.5"/>
        <line x1="180" y1="105" x2="254" y2="105" stroke="${C.accent}" stroke-width="2.8"/>
        <circle cx="180" cy="105" r="4.5" fill="${C.ink}"/>
        ${svgText(170, 105, 'O', { anchor: 'end', baseline: 'middle' })}
        ${svgText(217, 92, `r = ${r} см`, { fill: C.accent })}
      `, 360, 210);

      return makeNumericTask({
        category: 'segments_circle',
        catName: 'Окружность и круг',
        prompt: 'Найдите диаметр окружности:',
        questionText: `Радиус окружности равен <strong>${r} см</strong>. Чему равен её диаметр (в см)?`,
        svgHtml: svg,
        answerNum: d,
        unitSuffix: 'см',
        hint: 'Диаметр окружности в 2 раза больше радиуса: d = 2 · r.',
        solutionSteps: [
          `Диаметр в 2 раза больше радиуса: d = 2 · r.`,
          `d = 2 · ${r} = <strong>${d} см</strong>.`
        ]
      });
    }

    if (mode === 'find_r') {
      const r = randInt(5, 34);
      const d = 2 * r;
      const svg = wrapSvg(`
        <circle cx="180" cy="105" r="74" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.5"/>
        <line x1="106" y1="105" x2="254" y2="105" stroke="${C.accent}" stroke-width="2.8"/>
        <circle cx="180" cy="105" r="4.5" fill="${C.ink}"/>
        ${svgText(180, 93, 'O')}
        ${svgText(180, 126, `d = ${d} см`, { fill: C.accent })}
      `, 360, 210);

      return makeNumericTask({
        category: 'segments_circle',
        catName: 'Окружность и круг',
        prompt: 'Найдите радиус окружности:',
        questionText: `Диаметр круга равен <strong>${d} см</strong>. Чему равен его радиус (в см)?`,
        svgHtml: svg,
        answerNum: r,
        unitSuffix: 'см',
        hint: 'Радиус равен половине диаметра: r = d : 2.',
        solutionSteps: [
          `Радиус равен половине диаметра: r = d : 2.`,
          `r = ${d} : 2 = <strong>${r} см</strong>.`
        ]
      });
    }

    if (mode === 'two_circles') {
      const r1 = randInt(5, 16);
      const r2 = randInt(4, 14);
      const dist = r1 + r2;
      const svg = wrapSvg(`
        <circle cx="132" cy="105" r="64" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4"/>
        <circle cx="244" cy="105" r="48" fill="${C.fillGold}" stroke="${C.gold}" stroke-width="2.4"/>
        <line x1="132" y1="105" x2="244" y2="105" stroke="${C.accent}" stroke-width="2.5" stroke-dasharray="5 3"/>
        <circle cx="132" cy="105" r="4" fill="${C.ink}"/>
        <circle cx="244" cy="105" r="4" fill="${C.ink}"/>
        ${svgText(132, 92, 'O₁')}
        ${svgText(244, 92, 'O₂')}
        ${svgText(164, 124, `${r1} см`, { fill: C.stroke })}
        ${svgText(224, 124, `${r2} см`, { fill: C.gold })}
      `, 360, 205);

      return makeNumericTask({
        category: 'segments_circle',
        catName: 'Касающиеся окружности',
        prompt: 'Найдите расстояние между центрами окружностей:',
        questionText: `Две окружности с радиусами <strong>${r1} см</strong> и <strong>${r2} см</strong> касаются снаружи. Найдите расстояние <strong>O₁O₂</strong> между их центрами (в см).`,
        svgHtml: svg,
        answerNum: dist,
        unitSuffix: 'см',
        hint: 'Отрезок O₁O₂ состоит из двух радиусов, проведённых к точке касания.',
        solutionSteps: [
          `Расстояние между центрами равно сумме радиусов:`,
          `O₁O₂ = ${r1} + ${r2} = <strong>${dist} см</strong>.`
        ]
      });
    }

    // square_circle
    const r = randInt(4, 15);
    const side = 2 * r;
    const svg = wrapSvg(`
      <rect x="115" y="36" width="130" height="130" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.5"/>
      <circle cx="180" cy="101" r="65" fill="${C.fillAccent}" stroke="${C.accent}" stroke-width="2.2"/>
      <circle cx="180" cy="101" r="4" fill="${C.ink}"/>
      ${svgText(180, 185, `Сторона квадрата = ${side} см`, { fill: C.stroke })}
    `, 360, 205);

    return makeNumericTask({
      category: 'segments_circle',
      catName: 'Окружность в квадрате',
      prompt: 'Найдите радиус круга внутри квадрата:',
      questionText: `Окружность касается всех сторон квадрата со стороной <strong>${side} см</strong>. Чему равен радиус окружности (в см)?`,
      svgHtml: svg,
      answerNum: r,
      unitSuffix: 'см',
      hint: 'Диаметр такой окружности равен стороне квадрата.',
      solutionSteps: [
        `Диаметр окружности равен стороне квадрата: d = ${side} см.`,
        `Радиус равен половине диаметра: r = ${side} : 2 = <strong>${r} см</strong>.`
      ]
    });
  }

  // =========================================================================
  // 3. ПЕРИМЕТР И ПЛОЩАДЬ (ПРЯМОУГОЛЬНИК, КВАДРАТ, СОСТАВНЫЕ ФИГУРЫ)
  // =========================================================================
  function genRectPerimArea() {
    const mode = pickRandom(['rect_perim', 'rect_area', 'rect_find_side', 'square_from_perim']);

    if (mode === 'rect_perim') {
      const a = randInt(6, 24);
      const b = randInt(3, a - 1);
      const p = 2 * (a + b);
      const svg = wrapSvg(`
        <rect x="75" y="45" width="210" height="110" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.8"/>
        ${svgText(180, 35, `${a} см`, { fill: C.stroke })}
        ${svgText(308, 102, `${b} см`, { fill: C.stroke })}
      `, 360, 190);

      return makeNumericTask({
        category: 'perimeter_area',
        catName: 'Периметр прямоугольника',
        prompt: 'Вычислите периметр прямоугольника:',
        questionText: `Найдите периметр прямоугольника со сторонами <strong>${a} см</strong> и <strong>${b} см</strong> (в см).`,
        svgHtml: svg,
        answerNum: p,
        unitSuffix: 'см',
        hint: 'Периметр прямоугольника равен P = 2 · (a + b).',
        solutionSteps: [
          `P = 2 · (${a} + ${b}) = 2 · ${a + b} = <strong>${p} см</strong>.`
        ]
      });
    }

    if (mode === 'rect_area') {
      const a = randInt(5, 19);
      const b = randInt(3, 14);
      const s = a * b;
      const svg = wrapSvg(`
        <rect x="80" y="45" width="200" height="110" fill="${C.fillAccent}" stroke="${C.accent}" stroke-width="2.8"/>
        ${svgText(180, 175, `${a} см`, { fill: C.stroke })}
        ${svgText(54, 102, `${b} см`, { fill: C.stroke })}
      `, 360, 195);

      return makeNumericTask({
        category: 'perimeter_area',
        catName: 'Площадь прямоугольника',
        prompt: 'Вычислите площадь прямоугольника:',
        questionText: `Найдите площадь прямоугольника со сторонами <strong>${a} см</strong> и <strong>${b} см</strong> (в см²).`,
        svgHtml: svg,
        answerNum: s,
        unitSuffix: 'см²',
        hint: 'Площадь прямоугольника равна произведению длины и ширины: S = a · b.',
        solutionSteps: [
          `S = ${a} · ${b} = <strong>${s} см²</strong>.`
        ]
      });
    }

    if (mode === 'rect_find_side') {
      const a = randInt(6, 18);
      const b = randInt(3, 12);
      const s = a * b;
      const svg = wrapSvg(`
        <rect x="80" y="45" width="200" height="110" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.8"/>
        ${svgText(180, 102, `S = ${s} см²`, { fill: C.accent, size: 15 })}
        ${svgText(180, 175, `${a} см`, { fill: C.stroke })}
        ${svgText(56, 102, `? см`, { fill: C.accent })}
      `, 360, 195);

      return makeNumericTask({
        category: 'perimeter_area',
        catName: 'Сторона по площади',
        prompt: 'Найдите неизвестную сторону прямоугольника:',
        questionText: `Площадь прямоугольника равна <strong>${s} см²</strong>, одна из сторон равна <strong>${a} см</strong>. Найдите другую сторону (в см).`,
        svgHtml: svg,
        answerNum: b,
        unitSuffix: 'см',
        hint: 'Разделите площадь прямоугольника на известную сторону.',
        solutionSteps: [
          `b = S : a = ${s} : ${a} = <strong>${b} см</strong>.`
        ]
      });
    }

    // square_from_perim
    const a = randInt(4, 15);
    const p = 4 * a;
    const area = a * a;
    const svg = wrapSvg(`
      <rect x="120" y="34" width="120" height="120" fill="${C.fillGold}" stroke="${C.gold}" stroke-width="2.8"/>
      ${svgText(180, 96, `P = ${p} см`, { fill: C.ink, size: 15 })}
      ${svgText(180, 173, 'S = ?', { fill: C.accent, size: 15 })}
    `, 360, 195);

    return makeNumericTask({
      category: 'perimeter_area',
      catName: 'Квадрат: периметр и площадь',
      prompt: 'Найдите площадь квадрата по его периметру:',
      questionText: `Периметр квадрата равен <strong>${p} см</strong>. Найдите площадь этого квадрата (в см²).`,
      svgHtml: svg,
      answerNum: area,
      unitSuffix: 'см²',
      hint: 'Сначала найдите сторону квадрата (P : 4), а затем возведите её в квадрат.',
      solutionSteps: [
        `Сторона квадрата: a = ${p} : 4 = ${a} см.`,
        `Площадь квадрата: S = ${a} · ${a} = <strong>${area} см²</strong>.`
      ]
    });
  }

  function genCompositeFigure() {
    // L-образная фигура: внешний W x H, вырез в правом верхнем углу (w2 x h1)
    const w1 = randInt(4, 9);
    const w2 = randInt(4, 9);
    const h1 = randInt(3, 7);
    const h2 = randInt(4, 8);
    const W = w1 + w2;
    const H = h1 + h2;

    const askArea = Math.random() < 0.65;

    // SVG координаты: пропорционально, но с гарантированным местом для подписей у ступеньки
    const totalW = 196;
    const totalH = 128;
    const rawW1 = (w1 / W) * totalW;
    const rawH1 = (h1 / H) * totalH;
    const pxW = totalW;
    const pxH = totalH;
    const pxW1 = Math.max(60, Math.min(totalW - 64, rawW1));
    const pxW2 = pxW - pxW1;
    const pxH1 = Math.max(38, Math.min(totalH - 42, rawH1));
    const x0 = 82;
    const y0 = 38;

    // Вершины по часовой стрелке от левого верхнего угла:
    const pts = [
      [x0, y0],
      [x0 + pxW1, y0],
      [x0 + pxW1, y0 + pxH1],
      [x0 + pxW, y0 + pxH1],
      [x0 + pxW, y0 + pxH],
      [x0, y0 + pxH]
    ];
    const ptsStr = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

    const svg = wrapSvg(`
      <polygon points="${ptsStr}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.8" stroke-linejoin="round"/>
      ${svgText(x0 + pxW1 / 2, y0 - 10, `${w1} см`, { fill: C.stroke })}
      ${svgText(x0 + pxW1 - 8, y0 + pxH1 / 2, `${h1} см`, { fill: C.accent, anchor: 'end', baseline: 'middle' })}
      ${svgText(x0 + pxW1 + pxW2 / 2, y0 + pxH1 - 9, `${w2} см`, { fill: C.accent })}
      ${svgText(x0 + pxW + 10, y0 + pxH1 + (pxH - pxH1) / 2, `${h2} см`, { fill: C.stroke, anchor: 'start', baseline: 'middle' })}
      ${svgText(x0 + pxW / 2, y0 + pxH + 18, `${W} см`, { fill: C.stroke })}
      ${svgText(x0 - 10, y0 + pxH / 2, `${H} см`, { fill: C.stroke, anchor: 'end', baseline: 'middle' })}
    `, 360, 210);

    if (askArea) {
      const area = w1 * H + w2 * h2;
      return makeNumericTask({
        category: 'perimeter_area',
        catName: 'Площадь составной фигуры',
        prompt: 'Найдите площадь составной фигуры (все углы прямые):',
        questionText: 'Вычислите площадь фигуры на рисунке (в см²).',
        svgHtml: svg,
        answerNum: area,
        unitSuffix: 'см²',
        hint: 'Разбейте фигуру на два прямоугольника (вертикальной или горизонтальной линией) и сложите их площади.',
        solutionSteps: [
          `Разделим фигуру вертикально на левый и правый прямоугольники:`,
          `Левый: ${w1} × ${H} = ${w1 * H} см².`,
          `Правый: ${w2} × ${h2} = ${w2 * h2} см².`,
          `Общая площадь: ${w1 * H} + ${w2 * h2} = <strong>${area} см²</strong>.`
        ]
      });
    }

    const perim = 2 * (W + H);
    return makeNumericTask({
      category: 'perimeter_area',
      catName: 'Периметр составной фигуры',
      prompt: 'Найдите периметр составной фигуры:',
      questionText: 'Вычислите периметр фигуры на рисунке (в см).',
      svgHtml: svg,
      answerNum: perim,
      unitSuffix: 'см',
      hint: 'Сложите длины всех шести сторон фигуры.',
      solutionSteps: [
        `Складываем длины всех сторон по контуру:`,
        `${w1} + ${h1} + ${w2} + ${h2} + ${W} + ${H} = <strong>${perim} см</strong>.`
      ]
    });
  }

  // =========================================================================
  // 4. КУБ И ПРЯМОУГОЛЬНЫЙ ПАРАЛЛЕЛЕПИПЕД
  // =========================================================================
  function renderBoxSvg(labelA, labelB, labelC, isCube = false) {
    // Изометрический параллелепипед
    const w = isCube ? 104 : 138;
    const h = isCube ? 104 : 84;
    const dx = isCube ? 46 : 52;
    const dy = isCube ? -34 : -34;

    const x = 94;
    const y = 78;

    // Передняя грань: (x,y), (x+w,y), (x+w,y+h), (x,y+h)
    // Задняя грань сдвинута на (dx, dy)
    const fTL = [x, y];
    const fTR = [x + w, y];
    const fBR = [x + w, y + h];
    const fBL = [x, y + h];

    const bTL = [x + dx, y + dy];
    const bTR = [x + w + dx, y + dy];
    const bBR = [x + w + dx, y + h + dy];
    const bBL = [x + dx, y + h + dy];

    return wrapSvg(`
      <!-- Задние невидимые рёбра -->
      <line x1="${bTL[0]}" y1="${bTL[1]}" x2="${bBL[0]}" y2="${bBL[1]}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="${bBL[0]}" y1="${bBL[1]}" x2="${bBR[0]}" y2="${bBR[1]}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="${fBL[0]}" y1="${fBL[1]}" x2="${bBL[0]}" y2="${bBL[1]}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="4 4"/>

      <!-- Грани -->
      <polygon points="${fTL[0]},${fTL[1]} ${bTL[0]},${bTL[1]} ${bTR[0]},${bTR[1]} ${fTR[0]},${fTR[1]}" fill="rgba(38,63,97,0.06)" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="${fTR[0]},${fTR[1]} ${bTR[0]},${bTR[1]} ${bBR[0]},${bBR[1]} ${fBR[0]},${fBR[1]}" fill="rgba(38,63,97,0.12)" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="rgba(255,255,255,0.45)" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>

      ${svgText(x + w / 2, y + h + 18, labelA, { fill: C.ink })}
      ${labelB ? svgText(x + w + dx / 2 + 10, y + h + dy / 2 + 12, labelB, { fill: C.accent, anchor: 'start' }) : ''}
      ${labelC ? svgText(x - 10, y + h / 2, labelC, { fill: C.stroke, anchor: 'end', baseline: 'middle' }) : ''}
    `, 360, 210);
  }

  function genBoxVolume() {
    const isCube = Math.random() < 0.3;
    if (isCube) {
      const a = randInt(2, 9);
      const vol = a * a * a;
      const svg = renderBoxSvg(`${a} см`, `${a} см`, `${a} см`, true);
      return makeNumericTask({
        category: 'solids_3d',
        catName: 'Объём куба',
        prompt: 'Найдите объём куба:',
        questionText: `Длина ребра куба равна <strong>${a} см</strong>. Чему равен объём куба (в см³)?`,
        svgHtml: svg,
        answerNum: vol,
        unitSuffix: 'см³',
        hint: 'Объём куба равен V = a³ = a · a · a.',
        solutionSteps: [
          `V = ${a} · ${a} · ${a} = <strong>${vol} см³</strong>.`
        ]
      });
    }

    const a = randInt(3, 12);
    const b = randInt(2, 8);
    const c = randInt(2, 9);
    const vol = a * b * c;

    if (Math.random() < 0.35) {
      const svg = renderBoxSvg(`${a} см`, `${b} см`, `? см`, false);
      return makeNumericTask({
        category: 'solids_3d',
        catName: 'Высота по объёму',
        prompt: 'Найдите неизвестное измерение параллелепипеда:',
        questionText: `Объём прямоугольного параллелепипеда равен <strong>${vol} см³</strong>, длина — ${a} см, ширина — ${b} см. Найдите его высоту (в см).`,
        svgHtml: svg,
        answerNum: c,
        unitSuffix: 'см',
        hint: 'Разделите объём на произведение длины и ширины.',
        solutionSteps: [
          `Площадь основания: S = ${a} · ${b} = ${a * b} см².`,
          `Высота: c = ${vol} : ${a * b} = <strong>${c} см</strong>.`
        ]
      });
    }

    const svg = renderBoxSvg(`${a} см`, `${b} см`, `${c} см`, false);
    return makeNumericTask({
      category: 'solids_3d',
      catName: 'Объём параллелепипеда',
      prompt: 'Найдите объём прямоугольного параллелепипеда:',
      questionText: `Найдите объём прямоугольного параллелепипеда с измерениями <strong>${a} см, ${b} см и ${c} см</strong> (в см³).`,
      svgHtml: svg,
      answerNum: vol,
      unitSuffix: 'см³',
      hint: 'Объём равен произведению трёх измерений: V = a · b · c.',
      solutionSteps: [
        `V = ${a} · ${b} · ${c} = <strong>${vol} см³</strong>.`
      ]
    });
  }

  function genBoxSurfaceArea() {
    const mode = pickRandom(['cube_surf', 'box_surf', 'open_box']);
    if (mode === 'cube_surf') {
      const a = randInt(2, 9);
      const s = 6 * a * a;
      const svg = renderBoxSvg(`${a} см`, `${a} см`, `${a} см`, true);
      return makeNumericTask({
        category: 'solids_3d',
        catName: 'Площадь поверхности куба',
        prompt: 'Найдите площадь поверхности куба:',
        questionText: `Ребро куба равно <strong>${a} см</strong>. Найдите площадь полной поверхности куба (в см²).`,
        svgHtml: svg,
        answerNum: s,
        unitSuffix: 'см²',
        hint: 'У куба 6 одинаковых квадратных граней: S = 6 · a².',
        solutionSteps: [
          `Площадь одной грани: ${a} · ${a} = ${a * a} см².`,
          `Всего 6 граней: 6 · ${a * a} = <strong>${s} см²</strong>.`
        ]
      });
    }

    const a = randInt(4, 10);
    const b = randInt(2, 7);
    const c = randInt(2, 6);
    const svg = renderBoxSvg(`${a} см`, `${b} см`, `${c} см`, false);

    const svgDm = renderBoxSvg(`${a} дм`, `${b} дм`, `${c} дм`, false);

    if (mode === 'open_box') {
      const s = a * b + 2 * (a * c + b * c);
      return makeNumericTask({
        category: 'solids_3d',
        catName: 'Открытый аквариум',
        prompt: 'Найдите площадь стекла открытого сверху аквариума:',
        questionText: `Аквариум без крышки имеет длину <strong>${a} дм</strong>, ширину <strong>${b} дм</strong> и высоту <strong>${c} дм</strong>. Сколько квадратных дециметров стекла пошло на его изготовление?`,
        svgHtml: svgDm,
        answerNum: s,
        unitSuffix: 'дм²',
        hint: 'У аквариума 1 дно и 4 боковые стенки (верхней крышки нет!).',
        solutionSteps: [
          `Дно: ${a} · ${b} = ${a * b} дм².`,
          `Передняя и задняя стенки: 2 · (${a} · ${c}) = ${2 * a * c} дм².`,
          `Левая и правая стенки: 2 · (${b} · ${c}) = ${2 * b * c} дм².`,
          `Всего: ${a * b} + ${2 * a * c} + ${2 * b * c} = <strong>${s} дм²</strong>.`
        ]
      });
    }

    const s = 2 * (a * b + b * c + a * c);
    return makeNumericTask({
      category: 'solids_3d',
      catName: 'Площадь поверхности',
      prompt: 'Найдите площадь поверхности прямоугольного параллелепипеда:',
      questionText: `Измерения параллелепипеда: <strong>${a} см, ${b} см и ${c} см</strong>. Найдите площадь его полной поверхности (в см²).`,
      svgHtml: svg,
      answerNum: s,
      unitSuffix: 'см²',
      hint: 'S = 2 · (a·b + b·c + a·c).',
      solutionSteps: [
        `Найдём площади трёх разных граней: ${a}·${b} = ${a * b}, ${b}·${c} = ${b * c}, ${a}·${c} = ${a * c}.`,
        `Каждая грань встречается дважды: 2 · (${a * b} + ${b * c} + ${a * c}) = 2 · ${a * b + b * c + a * c} = <strong>${s} см²</strong>.`
      ]
    });
  }

  function genBoxEdgesSum() {
    const isCube = Math.random() < 0.35;
    if (isCube) {
      const a = randInt(3, 15);
      const ans = 12 * a;
      const svg = renderBoxSvg(`${a} см`, `${a} см`, `${a} см`, true);
      return makeNumericTask({
        category: 'solids_3d',
        catName: 'Рёбра куба',
        prompt: 'Найдите сумму длин всех рёбер куба:',
        questionText: `Ребро куба равно <strong>${a} см</strong>. Сколько проволоки понадобится на каркас куба (в см)?`,
        svgHtml: svg,
        answerNum: ans,
        unitSuffix: 'см',
        hint: 'У куба ровно 12 равных рёбер.',
        solutionSteps: [
          `У куба 12 рёбер одинаковой длины.`,
          `12 · ${a} = <strong>${ans} см</strong>.`
        ]
      });
    }

    const a = randInt(4, 14);
    const b = randInt(3, 10);
    const c = randInt(2, 9);
    const ans = 4 * (a + b + c);
    const svg = renderBoxSvg(`${a} см`, `${b} см`, `${c} см`, false);
    return makeNumericTask({
      category: 'solids_3d',
      catName: 'Сумма длин рёбер',
      prompt: 'Найдите сумму длин всех рёбер параллелепипеда:',
      questionText: `Измерения прямоугольного параллелепипеда равны <strong>${a} см, ${b} см и ${c} см</strong>. Найдите сумму длин всех его рёбер (в см).`,
      svgHtml: svg,
      answerNum: ans,
      unitSuffix: 'см',
      hint: 'В параллелепипеде каждого ребра (длины, ширины, высоты) по 4 штуки: L = 4 · (a + b + c).',
      solutionSteps: [
        `У параллелепипеда 4 длины, 4 ширины и 4 высоты.`,
        `L = 4 · (${a} + ${b} + ${c}) = 4 · ${a + b + c} = <strong>${ans} см</strong>.`
      ]
    });
  }

  function genCubeNetCheck() {
    const validNets = [
      { cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], name: 'крест (1-4-1)' },
      { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], name: 'развёртка 1-4-1' },
      { cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], name: 'лесенка (2-2-2)' },
      { cells: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]], name: 'развёртка 3-3' },
      { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2]], name: 'развёртка 1-3-2' }
    ];
    const invalidNets = [
      { cells: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]], reason: 'содержит уголок из 4 квадратов 2×2 — при сгибании две грани наложатся друг на друга' },
      { cells: [[0, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]], reason: 'оба «хвостика» находятся с одной стороны от ряда из 4 граней — противоположная сторона останется открытой' },
      { cells: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], reason: 'это прямоугольник 3×2 — квадраты не образуют замкнутую поверхность куба' },
      { cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], reason: 'пять квадратов идут в один ряд — пятый закроет уже занятую грань' }
    ];

    const isValid = Math.random() < 0.5;
    const net = isValid ? pickRandom(validNets) : pickRandom(invalidNets);

    const maxX = Math.max(...net.cells.map(c => c[0])) + 1;
    const maxY = Math.max(...net.cells.map(c => c[1])) + 1;
    const size = 40;
    const startX = (360 - maxX * size) / 2;
    const startY = (200 - maxY * size) / 2;

    let squares = '';
    net.cells.forEach(([cx, cy], idx) => {
      const rx = startX + cx * size;
      const ry = startY + cy * size;
      const fill = idx === 2 ? C.fillAccent : C.fillSoft;
      squares += `<rect x="${rx}" y="${ry}" width="${size}" height="${size}" fill="${fill}" stroke="${C.stroke}" stroke-width="2.2"/>`;
    });

    const svg = wrapSvg(squares, 360, 200);
    const ans = isValid ? 'Да' : 'Нет';

    return {
      category: 'solids_3d',
      catName: 'Развёртка куба',
      prompt: 'Определите, сложится ли развёртка в куб:',
      questionHtml: `<div class="geo5-q-text">Можно ли из этой развёртки сложить замкнутый <strong>куб</strong> (без наложений)?</div>${svg}`,
      answer: ans,
      displayAnswer: ans,
      acceptedAnswers: [ans, ans.toLowerCase()],
      options: [
        { value: 'Да', text: '✓ Да, сложится', html: '✓ Да, сложится' },
        { value: 'Нет', text: '✕ Нет, не сложится', html: '✕ Нет, не сложится' }
      ],
      correctOptionIndex: isValid ? 0 : 1,
      forceChoice: true,
      hint: 'У куба 6 граней; в правильной развёртке не бывает блоков 2×2, 5 квадратов в ряд и обоих «крыльев» с одной стороны от полосы из 4.',
      solutionSteps: [
        isValid
          ? `<strong>Да</strong>, это классическая ${net.name}: при сгибании по рёбрам все 6 граней занимают свои места без наложений.`
          : `<strong>Нет</strong>: эта фигура ${net.reason}.`
      ]
    };
  }

  const GENERATORS = {
    angles: [genAngleType, genProtractorMeasure, genAngleSplit],
    segments_circle: [genPolylineLength, genSegmentDivision, genCircleDiameterRadius],
    perimeter_area: [genRectPerimArea, genCompositeFigure],
    solids_3d: [genBoxVolume, genBoxSurfaceArea, genBoxEdgesSum, genCubeNetCheck]
  };

  const NUMERIC_GENERATORS = {
    angles: [genProtractorMeasure, genAngleSplit],
    segments_circle: [genPolylineLength, genSegmentDivision, genCircleDiameterRadius],
    perimeter_area: [genRectPerimArea, genCompositeFigure],
    solids_3d: [genBoxVolume, genBoxSurfaceArea, genBoxEdgesSum]
  };

  function generateTask(category, opts = {}) {
    let cat = String(category || 'all').trim();
    if (cat.startsWith('geo5_')) {
      cat = cat.replace('geo5_', '');
    }

    const poolMap = opts && opts.numericOnly ? NUMERIC_GENERATORS : GENERATORS;

    if (poolMap[cat]) {
      return pickRandom(poolMap[cat])();
    }

    const allGens = [
      ...poolMap.angles,
      ...poolMap.segments_circle,
      ...poolMap.perimeter_area,
      ...poolMap.solids_3d
    ];
    return pickRandom(allGens)();
  }

  function normalizeStr(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/−|—/g, '-')
      .replace(/,/g, '.')
      .replace(/[°а-яёa-z²³]+$/i, '');
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не указан' };
    }

    if (typeof rawUserAnswer === 'number' && rawUserAnswer >= 0 && rawUserAnswer < (task.options ? task.options.length : 4)) {
      const isCorrect = rawUserAnswer === task.correctOptionIndex;
      return {
        isCorrect,
        correctIndex: task.correctOptionIndex,
        displayAnswer: `${task.displayAnswer}${task.unitSuffix ? ' ' + task.unitSuffix : ''}`.trim()
      };
    }

    const rawStr = String(rawUserAnswer).trim();
    if (!rawStr) {
      return { isCorrect: false, error: 'Введите ответ' };
    }

    if (task.forceChoice) {
      const isCorrect = rawStr.toLowerCase() === String(task.answer).toLowerCase();
      return { isCorrect, displayAnswer: task.displayAnswer };
    }

    const uNorm = normalizeStr(rawStr);
    const cNorm = normalizeStr(task.answer);
    const uNum = Number(uNorm);
    const cNum = Number(cNorm);

    if (uNorm !== '' && !Number.isNaN(uNum) && !Number.isNaN(cNum) && Math.abs(uNum - cNum) < 1e-4) {
      return {
        isCorrect: true,
        displayAnswer: `${task.displayAnswer}${task.unitSuffix ? ' ' + task.unitSuffix : ''}`.trim()
      };
    }

    if (Array.isArray(task.acceptedAnswers)) {
      const rawLower = rawStr.toLowerCase().replace(/\s+/g, '');
      for (const acc of task.acceptedAnswers) {
        if (String(acc).toLowerCase().replace(/\s+/g, '') === rawLower) {
          return {
            isCorrect: true,
            displayAnswer: `${task.displayAnswer}${task.unitSuffix ? ' ' + task.unitSuffix : ''}`.trim()
          };
        }
      }
    }

    return {
      isCorrect: false,
      displayAnswer: `${task.displayAnswer}${task.unitSuffix ? ' ' + task.unitSuffix : ''}`.trim()
    };
  }

  return {
    generateTask,
    checkAnswer,
    GENERATORS,
    NUMERIC_GENERATORS
  };
}));
