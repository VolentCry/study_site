/**
 * Тренажёр ОГЭ по математике · Задание №17
 * «Четырёхугольники и площади плоских фигур»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask17Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatNum(n) {
    const rounded = Math.round(n * 10000) / 10000;
    return String(rounded).replace('.', ',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  // Базовая обёртка SVG 320x190
  function wrapSvg(inner) {
    return `
      <div class="grid-canvas-wrap" style="display:flex; justify-content:center; margin:14px 0;">
        <svg width="320" height="190" viewBox="0 0 320 190" style="background:#ffffff; border-radius:10px; border:1px solid rgba(38,63,97,0.22); box-shadow:0 4px 16px rgba(0,0,0,0.06); max-width:100%; height:auto;">
          ${inner}
        </svg>
      </div>
    `.trim();
  }

  function svgLabel(x, y, text, opts = {}) {
    const fill = opts.fill || '#19273c';
    const size = opts.size || 13;
    const weight = opts.weight || 700;
    const anchor = opts.anchor || 'middle';
    return `<text x="${x}" y="${y}" fill="${fill}" font-family="DM Sans, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${text}</text>`;
  }

  function svgRightAngle(x, y, dx, dy) {
    // Маленький квадрат прямого угла от вершины (x,y) в направлении (dx, dy)
    const s = 9;
    const x1 = x + dx * s;
    const y1 = y;
    const x2 = x + dx * s;
    const y2 = y + dy * s;
    const x3 = x;
    const y3 = y + dy * s;
    return `<polyline points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" stroke="#b7464e" stroke-width="1.5"/>`;
  }

  // ==========================================================
  // 1. ТРЕУГОЛЬНИКИ (triangle)
  // ==========================================================
  function genTriangleBaseHeight() {
    const a = randInt(6, 22);
    const h = randInt(4, 16);
    const finalA = (a % 2 !== 0 && h % 2 !== 0) ? a + 1 : a;
    const area = 0.5 * finalA * h;

    const svg = wrapSvg(`
      <polygon points="55,152 265,152 190,38" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="190" y1="38" x2="190" y2="152" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(190, 152, -1, -1)}
      ${svgLabel(44, 160, 'A')}
      ${svgLabel(190, 27, 'B')}
      ${svgLabel(276, 160, 'C')}
      ${svgLabel(190, 169, 'H', { fill: '#b7464e', size: 12 })}
      ${svgLabel(130, 171, String(finalA), { fill: '#0284c7' })}
      ${svgLabel(204, 100, String(h), { fill: '#b7464e', anchor: 'start' })}
    `);

    return {
      category: 'triangle',
      catName: 'Треугольник',
      questionHtml: `В треугольнике <i>ABC</i> сторона <i>AC</i> равна <strong>${finalA}</strong>, а высота <i>BH</i>, проведённая к этой стороне, равна <strong>${h}</strong>. Найдите площадь треугольника <i>ABC</i>.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь треугольника равна половине произведения основания на высоту: <i>S</i> = ${fracHtml('1', '2')} · <i>AC</i> · <i>BH</i>.`,
        `Подставим известные значения: <i>S</i> = ${fracHtml('1', '2')} · ${finalA} · ${h} = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genTriangleSin30() {
    const a = pickRandom([6, 8, 10, 12, 14, 16]);
    const b = pickRandom([4, 6, 8, 10, 12]);
    const angle = pickRandom([30, 150]);
    const area = (a * b) / 4;

    const topX = angle === 30 ? 225 : 70;
    const svg = wrapSvg(`
      <polygon points="95,148 255,148 ${topX},42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 122,148 A 27,27 0 0,0 ${angle === 30 ? '117,130' : '89,122'}" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(84, 158, 'B')}
      ${svgLabel(266, 158, 'C')}
      ${svgLabel(topX, 31, 'A')}
      ${svgLabel(angle === 30 ? 142 : 122, 134, angle + '°', { fill: '#b7464e', size: 12 })}
      ${svgLabel(175, 168, String(b), { fill: '#0284c7' })}
      ${svgLabel(angle === 30 ? 148 : 72, 90, String(a), { fill: '#0284c7', anchor: 'end' })}
    `);

    return {
      category: 'triangle',
      catName: 'Треугольник',
      questionHtml: `В треугольнике <i>ABC</i> стороны <i>AB</i> = <strong>${a}</strong> и <i>BC</i> = <strong>${b}</strong>, а угол <i>B</i> равен <strong>${angle}°</strong>. Найдите площадь треугольника <i>ABC</i>.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Воспользуемся формулой площади через две стороны и синус угла между ними: <i>S</i> = ${fracHtml('1', '2')} · <i>AB</i> · <i>BC</i> · sin <i>B</i>.`,
        `Помним, что sin ${angle}° = ${fracHtml('1', '2')} = 0,5.`,
        `Вычисляем: <i>S</i> = ${fracHtml('1', '2')} · ${a} · ${b} · ${fracHtml('1', '2')} = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genTriangleMidline() {
    const sSmall = randInt(4, 18);
    const sBig = 4 * sSmall;
    const askBig = Math.random() < 0.5;

    const svg = wrapSvg(`
      <polygon points="55,155 265,155 170,32" fill="rgba(2,132,199,0.08)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="112.5,93.5 217.5,93.5 170,32" fill="rgba(183,70,78,0.14)" stroke="#b7464e" stroke-width="2" stroke-linejoin="round"/>
      ${svgLabel(44, 162, 'A')}
      ${svgLabel(276, 162, 'B')}
      ${svgLabel(170, 22, 'C')}
      ${svgLabel(100, 94, 'M', { fill: '#b7464e' })}
      ${svgLabel(230, 94, 'N', { fill: '#b7464e' })}
    `);

    if (askBig) {
      return {
        category: 'triangle',
        catName: 'Треугольник',
        questionHtml: `В треугольнике <i>ABC</i> точки <i>M</i> и <i>N</i> — середины сторон <i>AC</i> и <i>BC</i> соответственно. Площадь треугольника <i>CMN</i> равна <strong>${sSmall}</strong>. Найдите площадь треугольника <i>ABC</i>.${svg}`,
        answer: sBig,
        displayAnswer: formatNum(sBig),
        solutionSteps: [
          `Отрезок <i>MN</i> — средняя линия треугольника <i>ABC</i>, поэтому <i>MN</i> ∥ <i>AB</i> и <i>MN</i> = ${fracHtml('1', '2')}<i>AB</i>.`,
          `Треугольник <i>CMN</i> подобен треугольнику <i>ABC</i> с коэффициентом подобия <i>k</i> = 2 (линейные размеры <i>ABC</i> в 2 раза больше).`,
          `Площади подобных треугольников относятся как квадрат коэффициента подобия: <i>S</i><sub>ABC</sub> = <i>k</i><sup>2</sup> · <i>S</i><sub>CMN</sub> = 4 · ${sSmall} = <strong>${sBig}</strong>.`
        ]
      };
    }

    return {
      category: 'triangle',
      catName: 'Треугольник',
      questionHtml: `Площадь треугольника <i>ABC</i> равна <strong>${sBig}</strong>. Точки <i>M</i> и <i>N</i> — середины сторон <i>AC</i> и <i>BC</i> соответственно. Найдите площадь треугольника <i>CMN</i>.${svg}`,
      answer: sSmall,
      displayAnswer: formatNum(sSmall),
      solutionSteps: [
        `Средняя линия <i>MN</i> отсекает треугольник <i>CMN</i>, подобный треугольнику <i>ABC</i> с коэффициентом подобия <i>k</i> = ${fracHtml('1', '2')}.`,
        `Отношение площадей равно квадрату коэффициента подобия: <i>S</i><sub>CMN</sub> = (${fracHtml('1', '2')})<sup>2</sup> · <i>S</i><sub>ABC</sub> = ${fracHtml('1', '4')} · ${sBig} = <strong>${sSmall}</strong>.`
      ]
    };
  }

  function genRightTriangle() {
    const triples = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15],
      [12, 16, 20]
    ];
    const [a, b, c] = pickRandom(triples);
    const area = (a * b) / 2;
    const giveHyp = Math.random() < 0.5;

    const svg = wrapSvg(`
      <polygon points="75,152 245,152 75,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      ${svgRightAngle(75, 152, 1, -1)}
      ${svgLabel(62, 160, 'C')}
      ${svgLabel(256, 160, 'B')}
      ${svgLabel(62, 38, 'A')}
      ${svgLabel(58, 100, String(a), { fill: '#0284c7', anchor: 'end' })}
      ${giveHyp ? svgLabel(172, 88, String(c), { fill: '#b7464e' }) : svgLabel(160, 170, String(b), { fill: '#0284c7' })}
    `);

    if (giveHyp) {
      return {
        category: 'triangle',
        catName: 'Треугольник',
        questionHtml: `В прямоугольном треугольнике <i>ABC</i> (∠<i>C</i> = 90°) катет <i>AC</i> = <strong>${a}</strong>, а гипотенуза <i>AB</i> = <strong>${c}</strong>. Найдите площадь треугольника <i>ABC</i>.${svg}`,
        answer: area,
        displayAnswer: formatNum(area),
        solutionSteps: [
          `По теореме Пифагора найдём второй катет <i>BC</i>: <i>BC</i> = √(<i>AB</i><sup>2</sup> − <i>AC</i><sup>2</sup>) = √(${c}<sup>2</sup> − ${a}<sup>2</sup>) = √(${c * c - a * a}) = ${b}.`,
          `Площадь прямоугольного треугольника равна половине произведения катетов: <i>S</i> = ${fracHtml('1', '2')} · ${a} · ${b} = <strong>${area}</strong>.`
        ]
      };
    }

    return {
      category: 'triangle',
      catName: 'Треугольник',
      questionHtml: `Два катета прямоугольного треугольника равны <strong>${a}</strong> и <strong>${b}</strong>. Найдите площадь этого треугольника.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь прямоугольного треугольника равна половине произведения его катетов: <i>S</i> = ${fracHtml('1', '2')} · <i>a</i> · <i>b</i>.`,
        `Вычисляем: <i>S</i> = ${fracHtml('1', '2')} · ${a} · ${b} = <strong>${area}</strong>.`
      ]
    };
  }

  // ==========================================================
  // 2. ПАРАЛЛЕЛОГРАММ (parallelogram)
  // ==========================================================
  function genParallelogramSegments() {
    const x = randInt(2, 8);
    const y = randInt(4, 12);
    const h = randInt(4, 14);
    const base = x + y;
    const area = base * h;

    const svg = wrapSvg(`
      <polygon points="55,150 225,150 270,42 100,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="100" y1="42" x2="100" y2="150" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(100, 150, 1, -1)}
      ${svgLabel(43, 158, 'A')}
      ${svgLabel(100, 32, 'B')}
      ${svgLabel(280, 36, 'C')}
      ${svgLabel(236, 158, 'D')}
      ${svgLabel(100, 168, 'H', { fill: '#b7464e', size: 12 })}
      ${svgLabel(77, 168, String(x), { fill: '#0284c7', size: 12 })}
      ${svgLabel(162, 168, String(y), { fill: '#0284c7', size: 12 })}
      ${svgLabel(114, 98, String(h), { fill: '#b7464e', anchor: 'start' })}
    `);

    return {
      category: 'parallelogram',
      catName: 'Параллелограмм',
      questionHtml: `Высота <i>BH</i> параллелограмма <i>ABCD</i> делит сторону <i>AD</i> на отрезки <i>AH</i> = <strong>${x}</strong> и <i>HD</i> = <strong>${y}</strong>. Найдите площадь параллелограмма, если <i>BH</i> = <strong>${h}</strong>.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Найдём длину основания <i>AD</i>: <i>AD</i> = <i>AH</i> + <i>HD</i> = ${x} + ${y} = ${base}.`,
        `Площадь параллелограмма равна произведению основания на высоту: <i>S</i> = <i>AD</i> · <i>BH</i> = ${base} · ${h} = <strong>${area}</strong>.`
      ]
    };
  }

  function genParallelogramSin30() {
    const a = pickRandom([6, 8, 10, 12, 14, 16]);
    const b = randInt(5, 15);
    const angle = pickRandom([30, 150]);
    const area = 0.5 * a * b;

    const svg = wrapSvg(`
      <polygon points="55,148 220,148 270,46 105,46" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 85,148 A 30,30 0 0,0 69,121" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(43, 156, 'A')}
      ${svgLabel(100, 35, 'B')}
      ${svgLabel(280, 40, 'C')}
      ${svgLabel(230, 156, 'D')}
      ${svgLabel(138, 167, String(b), { fill: '#0284c7' })}
      ${svgLabel(70, 92, String(a), { fill: '#0284c7', anchor: 'end' })}
      ${svgLabel(98, 134, (angle === 30 ? '30°' : ''), { fill: '#b7464e', size: 12 })}
    `);

    return {
      category: 'parallelogram',
      catName: 'Параллелограмм',
      questionHtml: `Стороны параллелограмма равны <strong>${a}</strong> и <strong>${b}</strong>, а один из углов равен <strong>${angle}°</strong>. Найдите площадь этого параллелограмма.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь параллелограмма равна произведению двух соседних сторон на синус угла между ними: <i>S</i> = <i>a</i> · <i>b</i> · sin ${angle}°.`,
        `Так как sin ${angle}° = 0,5, получаем: <i>S</i> = ${a} · ${b} · 0,5 = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genParallelogramHeights() {
    const k = randInt(2, 5);
    const m = randInt(2, 4);
    const n = randInt(2, 4);
    const p = randInt(2, 5);
    const a = k * m;
    const hA = p * n;
    let b = m * n;
    let hB = k * p;
    if (a === b) {
      b += m;
      // Пересчёт для целочисленности
      return genParallelogramSegments();
    }
    const area = a * hA;
    const askLarger = Math.random() < 0.5;
    const targetH = askLarger ? Math.max(hA, hB) : Math.min(hA, hB);
    const givenH = askLarger ? Math.min(hA, hB) : Math.max(hA, hB);

    const svg = wrapSvg(`
      <polygon points="55,150 225,150 270,42 100,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="100" y1="42" x2="100" y2="150" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      <line x1="100" y1="42" x2="245" y2="102" stroke="#2e7d32" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(100, 150, 1, -1)}
      ${svgLabel(43, 158, 'A')}
      ${svgLabel(98, 32, 'B')}
      ${svgLabel(280, 36, 'C')}
      ${svgLabel(236, 158, 'D')}
      ${svgLabel(162, 168, String(a), { fill: '#0284c7' })}
      ${svgLabel(264, 102, String(b), { fill: '#0284c7', anchor: 'start' })}
    `);

    return {
      category: 'parallelogram',
      catName: 'Параллелограмм',
      questionHtml: `Стороны параллелограмма равны <strong>${a}</strong> и <strong>${b}</strong>. Высота, опущенная на ${givenH === hA ? `первую (${a})` : `вторую (${b})`} сторону, равна <strong>${givenH}</strong>. Найдите <strong>${askLarger ? 'большую' : 'меньшую'}</strong> высоту параллелограмма.${svg}`,
      answer: targetH,
      displayAnswer: formatNum(targetH),
      solutionSteps: [
        `Найдём площадь параллелограмма через известную сторону и проведённую к ней высоту: <i>S</i> = ${givenH === hA ? a : b} · ${givenH} = ${area}.`,
        `Вторая высота равна частному площади и второй стороны: <i>h</i><sub>2</sub> = ${area} : ${givenH === hA ? b : a} = ${targetH}.`,
        `Сравнивая высоты ${givenH} и ${targetH}, выбираем ${askLarger ? 'большую' : 'меньшую'}: <strong>${targetH}</strong>.`
      ]
    };
  }

  function genParallelogramAngles() {
    const acute = randInt(32, 78);
    const obtuse = 180 - acute;
    const sum = acute * 2;

    const svg = wrapSvg(`
      <polygon points="55,148 220,148 270,46 105,46" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 85,148 A 30,30 0 0,0 69,121" fill="none" stroke="#b7464e" stroke-width="2"/>
      <path d="M 240,46 A 30,30 0 0,0 256,73" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(43, 156, 'A')}
      ${svgLabel(98, 35, 'B')}
      ${svgLabel(280, 40, 'C')}
      ${svgLabel(230, 156, 'D')}
    `);

    return {
      category: 'parallelogram',
      catName: 'Параллелограмм',
      questionHtml: `Сумма двух углов параллелограмма равна <strong>${sum}°</strong>. Найдите больший угол этого параллелограмма. Ответ дайте в градусах.${svg}`,
      answer: obtuse,
      displayAnswer: formatNum(obtuse),
      solutionSteps: [
        `Соседние углы параллелограмма в сумме всегда дают 180°. Так как ${sum}° ≠ 180°, дана сумма двух <em>противоположных</em> (и притом равных) острых углов.`,
        `Найдём острый угол: ${sum}° : 2 = ${acute}°.`,
        `Больший (тупой) угол параллелограмма равен: 180° − ${acute}° = <strong>${obtuse}</strong>°.`
      ]
    };
  }

  // ==========================================================
  // 3. РОМБ (rhombus)
  // ==========================================================
  function genRhombusDiagonals() {
    let d1 = randInt(6, 22);
    let d2 = randInt(6, 22);
    if (d1 % 2 !== 0 && d2 % 2 !== 0) d1 += 1;
    const area = 0.5 * d1 * d2;

    const svg = wrapSvg(`
      <polygon points="160,26 260,95 160,164 60,95" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="60" y1="95" x2="260" y2="95" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      <line x1="160" y1="26" x2="160" y2="164" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(160, 95, 1, -1)}
      ${svgLabel(160, 18, 'B')}
      ${svgLabel(272, 99, 'C')}
      ${svgLabel(160, 181, 'D')}
      ${svgLabel(47, 99, 'A')}
      ${svgLabel(215, 86, 'd₁=' + d1, { fill: '#b7464e', size: 12 })}
      ${svgLabel(145, 58, 'd₂=' + d2, { fill: '#b7464e', size: 12, anchor: 'end' })}
    `);

    return {
      category: 'rhombus',
      catName: 'Ромб',
      questionHtml: `Диагонали ромба равны <strong>${d1}</strong> и <strong>${d2}</strong>. Найдите площадь ромба.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь ромба равна половине произведения его диагоналей: <i>S</i> = ${fracHtml('1', '2')} · <i>d</i><sub>1</sub> · <i>d</i><sub>2</sub>.`,
        `Подставляем значения: <i>S</i> = ${fracHtml('1', '2')} · ${d1} · ${d2} = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genRhombusPerimeterHeight() {
    const a = randInt(5, 18);
    const p = 4 * a;
    const h = randInt(3, a - 1);
    const area = a * h;

    const svg = wrapSvg(`
      <polygon points="75,150 205,150 250,42 120,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="120" y1="42" x2="120" y2="150" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(120, 150, 1, -1)}
      ${svgLabel(64, 158, 'A')}
      ${svgLabel(116, 32, 'B')}
      ${svgLabel(260, 36, 'C')}
      ${svgLabel(216, 158, 'D')}
      ${svgLabel(134, 100, 'h=' + h, { fill: '#b7464e', anchor: 'start' })}
    `);

    return {
      category: 'rhombus',
      catName: 'Ромб',
      questionHtml: `Периметр ромба равен <strong>${p}</strong>, а его высота равна <strong>${h}</strong>. Найдите площадь ромба.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `У ромба все 4 стороны равны, поэтому сторона ромба <i>a</i> = ${p} : 4 = ${a}.`,
        `Площадь ромба равна произведению стороны на высоту: <i>S</i> = <i>a</i> · <i>h</i> = ${a} · ${h} = <strong>${area}</strong>.`
      ]
    };
  }

  function genRhombusSin30() {
    const a = pickRandom([4, 6, 8, 10, 12, 14, 16]);
    const angle = pickRandom([30, 150]);
    const area = 0.5 * a * a;

    const svg = wrapSvg(`
      <polygon points="75,148 205,148 250,44 120,44" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 103,148 A 28,28 0 0,0 87,122" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(64, 156, 'A')}
      ${svgLabel(116, 34, 'B')}
      ${svgLabel(260, 38, 'C')}
      ${svgLabel(216, 156, 'D')}
      ${svgLabel(142, 168, String(a), { fill: '#0284c7' })}
      ${svgLabel(112, 134, (angle === 30 ? '30°' : ''), { fill: '#b7464e', size: 12 })}
    `);

    return {
      category: 'rhombus',
      catName: 'Ромб',
      questionHtml: `Сторона ромба равна <strong>${a}</strong>, а один из углов равен <strong>${angle}°</strong>. Найдите площадь этого ромба.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь ромба можно найти по формуле <i>S</i> = <i>a</i><sup>2</sup> · sin α.`,
        `Так как sin ${angle}° = 0,5, получаем: <i>S</i> = ${a}<sup>2</sup> · 0,5 = ${a * a} · 0,5 = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genRhombusAngle() {
    const alpha = randInt(18, 39);
    const acute = 2 * alpha;
    const obtuse = 180 - acute;
    const askObtuse = Math.random() < 0.7;
    const ans = askObtuse ? obtuse : acute;

    const svg = wrapSvg(`
      <polygon points="160,26 260,95 160,164 60,95" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="60" y1="95" x2="260" y2="95" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(47, 99, 'A')}
      ${svgLabel(160, 18, 'B')}
      ${svgLabel(272, 99, 'C')}
      ${svgLabel(160, 181, 'D')}
      ${svgLabel(110, 84, alpha + '°', { fill: '#b7464e', size: 12 })}
    `);

    return {
      category: 'rhombus',
      catName: 'Ромб',
      questionHtml: `Диагональ <i>AC</i> ромба <i>ABCD</i> образует со стороной <i>AB</i> угол <strong>${alpha}°</strong>. Найдите <strong>${askObtuse ? 'тупой' : 'острый'}</strong> угол этого ромба. Ответ дайте в градусах.${svg}`,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps: [
        `Диагонали ромба являются биссектрисами его углов, поэтому острый угол ∠<i>DAB</i> = 2 · ${alpha}° = ${acute}°.`,
        askObtuse
          ? `Сумма соседних углов ромба равна 180°, значит тупой угол равен 180° − ${acute}° = <strong>${obtuse}</strong>°.`
          : `Острый угол ромба равен <strong>${acute}</strong>°.`
      ]
    };
  }

  // ==========================================================
  // 4. ТРАПЕЦИЯ (trapezoid)
  // ==========================================================
  function genTrapezoidBasesHeight() {
    const a = randInt(4, 14);
    const b = a + randInt(4, 14);
    let h = randInt(4, 14);
    if ((a + b) % 2 !== 0 && h % 2 !== 0) h += 1;
    const area = ((a + b) / 2) * h;

    const svg = wrapSvg(`
      <polygon points="50,152 270,152 225,42 95,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="95" y1="42" x2="95" y2="152" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(95, 152, 1, -1)}
      ${svgLabel(39, 160, 'A')}
      ${svgLabel(90, 32, 'B')}
      ${svgLabel(232, 32, 'C')}
      ${svgLabel(280, 160, 'D')}
      ${svgLabel(160, 32, String(a), { fill: '#0284c7' })}
      ${svgLabel(160, 171, String(b), { fill: '#0284c7' })}
      ${svgLabel(108, 102, String(h), { fill: '#b7464e', anchor: 'start' })}
    `);

    return {
      category: 'trapezoid',
      catName: 'Трапеция',
      questionHtml: `Основания трапеции равны <strong>${a}</strong> и <strong>${b}</strong>, а высота равна <strong>${h}</strong>. Найдите площадь этой трапеции.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь трапеции равна произведению полусуммы оснований на высоту: <i>S</i> = ${fracHtml('<i>a</i> + <i>b</i>', '2')} · <i>h</i>.`,
        `Подставляем значения: <i>S</i> = ${fracHtml(`${a} + ${b}`, '2')} · ${h} = ${formatNum((a + b) / 2)} · ${h} = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genTrapezoidMidline() {
    const m = randInt(6, 22);
    const h = randInt(4, 14);
    const area = m * h;
    const askMidline = Math.random() < 0.45;

    const svg = wrapSvg(`
      <polygon points="50,152 270,152 225,42 95,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="72.5" y1="97" x2="247.5" y2="97" stroke="#2e7d32" stroke-width="2.2"/>
      <line x1="160" y1="42" x2="160" y2="152" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(160, 152, 1, -1)}
      ${svgLabel(122, 89, 'm', { fill: '#2e7d32' })}
      ${svgLabel(172, 124, 'h=' + h, { fill: '#b7464e', anchor: 'start', size: 12 })}
    `);

    if (askMidline) {
      return {
        category: 'trapezoid',
        catName: 'Трапеция',
        questionHtml: `Площадь трапеции равна <strong>${area}</strong>, а её высота равна <strong>${h}</strong>. Найдите среднюю линию этой трапеции.${svg}`,
        answer: m,
        displayAnswer: formatNum(m),
        solutionSteps: [
          `Площадь трапеции равна произведению средней линии <i>m</i> на высоту <i>h</i>: <i>S</i> = <i>m</i> · <i>h</i>.`,
          `Отсюда <i>m</i> = <i>S</i> : <i>h</i> = ${area} : ${h} = <strong>${m}</strong>.`
        ]
      };
    }

    return {
      category: 'trapezoid',
      catName: 'Трапеция',
      questionHtml: `Средняя линия трапеции равна <strong>${m}</strong>, а высота равна <strong>${h}</strong>. Найдите площадь этой трапеции.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь трапеции равна произведению средней линии на высоту: <i>S</i> = <i>m</i> · <i>h</i>.`,
        `Вычисляем: <i>S</i> = ${m} · ${h} = <strong>${area}</strong>.`
      ]
    };
  }

  function genTrapezoid30Deg() {
    const c = pickRandom([6, 8, 10, 12, 14, 16]);
    const h = c / 2;
    const a = randInt(4, 12);
    const b = a + randInt(4, 14);
    const finalB = ((a + b) % 2 !== 0 && h % 2 !== 0) ? b + 1 : b;
    const area = ((a + finalB) / 2) * h;

    const svg = wrapSvg(`
      <polygon points="50,152 270,152 225,42 110,42" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="110" y1="42" x2="110" y2="152" stroke="#b7464e" stroke-width="2" stroke-dasharray="5,4"/>
      ${svgRightAngle(110, 152, 1, -1)}
      <path d="M 80,152 A 30,30 0 0,0 64,126" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(167, 32, String(a), { fill: '#0284c7' })}
      ${svgLabel(160, 171, String(finalB), { fill: '#0284c7' })}
      ${svgLabel(68, 92, String(c), { fill: '#0284c7', anchor: 'end' })}
      ${svgLabel(95, 138, '30°', { fill: '#b7464e', size: 12 })}
    `);

    return {
      category: 'trapezoid',
      catName: 'Трапеция',
      questionHtml: `Основания трапеции равны <strong>${a}</strong> и <strong>${finalB}</strong>, одна из боковых сторон равна <strong>${c}</strong>, а угол между ней и большим основанием равен <strong>30°</strong>. Найдите площадь трапеции.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Проведём высоту трапеции. В прямоугольном треугольнике катет, лежащий против угла 30°, равен половине гипотенузы: <i>h</i> = ${c} : 2 = ${h}.`,
        `Теперь найдём площадь трапеции: <i>S</i> = ${fracHtml(`${a} + ${finalB}`, '2')} · ${h} = <strong>${formatNum(area)}</strong>.`
      ]
    };
  }

  function genTrapezoidIsoAngle() {
    const acute = randInt(36, 76);
    const obtuse = 180 - acute;
    const sum = 2 * acute;

    const svg = wrapSvg(`
      <polygon points="55,150 265,150 220,44 100,44" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 83,150 A 28,28 0 0,0 67,124" fill="none" stroke="#b7464e" stroke-width="2"/>
      <path d="M 237,150 A 28,28 0 0,1 253,124" fill="none" stroke="#b7464e" stroke-width="2"/>
      ${svgLabel(43, 158, 'A')}
      ${svgLabel(94, 34, 'B')}
      ${svgLabel(226, 34, 'C')}
      ${svgLabel(276, 158, 'D')}
    `);

    return {
      category: 'trapezoid',
      catName: 'Трапеция',
      questionHtml: `Сумма двух углов равнобедренной трапеции равна <strong>${sum}°</strong>. Найдите больший угол этой трапеции. Ответ дайте в градусах.${svg}`,
      answer: obtuse,
      displayAnswer: formatNum(obtuse),
      solutionSteps: [
        `В равнобедренной трапеции углы при каждом основании равны, а сумма углов при боковой стороне равна 180°.`,
        `Так как ${sum}° ≠ 180°, дана сумма двух равных острых углов при большем основании. Один острый угол равен ${sum}° : 2 = ${acute}°.`,
        `Больший угол трапеции равен 180° − ${acute}° = <strong>${obtuse}</strong>°.`
      ]
    };
  }

  // ==========================================================
  // 5. ПРЯМОУГОЛЬНИК И КВАДРАТ (rect_square)
  // ==========================================================
  function genSquareDiagonal() {
    const useRoot = Math.random() < 0.5;
    if (useRoot) {
      const a = randInt(3, 14);
      const area = a * a;
      const svg = wrapSvg(`
        <rect x="95" y="30" width="130" height="130" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4"/>
        <line x1="95" y1="160" x2="225" y2="30" stroke="#b7464e" stroke-width="2.2"/>
        ${svgLabel(168, 86, `${a}√2`, { fill: '#b7464e' })}
      `);
      return {
        category: 'rect_square',
        catName: 'Прямоугольник и квадрат',
        questionHtml: `Диагональ квадрата равна <strong>${a}√2</strong>. Найдите площадь этого квадрата.${svg}`,
        answer: area,
        displayAnswer: formatNum(area),
        solutionSteps: [
          `Площадь квадрата через его диагональ <i>d</i>: <i>S</i> = ${fracHtml('<i>d</i><sup>2</sup>', '2')} (или из соотношения <i>d</i> = <i>a</i>√2 получаем сторону <i>a</i> = ${a}).`,
          `Вычисляем площадь: <i>S</i> = ${a}<sup>2</sup> = <strong>${area}</strong>.`
        ]
      };
    }

    const d = pickRandom([4, 6, 8, 10, 12, 14, 16]);
    const area = (d * d) / 2;
    const svg = wrapSvg(`
      <rect x="95" y="30" width="130" height="130" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4"/>
      <line x1="95" y1="160" x2="225" y2="30" stroke="#b7464e" stroke-width="2.2"/>
      ${svgLabel(168, 86, String(d), { fill: '#b7464e' })}
    `);
    return {
      category: 'rect_square',
      catName: 'Прямоугольник и квадрат',
      questionHtml: `Найдите площадь квадрата, диагональ которого равна <strong>${d}</strong>.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Площадь квадрата (как частного случая ромба с равными диагоналями) вычисляется по формуле <i>S</i> = ${fracHtml('1', '2')} · <i>d</i><sup>2</sup>.`,
        `Подставляем <i>d</i> = ${d}: <i>S</i> = ${fracHtml(`${d}<sup>2</sup>`, '2')} = ${fracHtml(String(d * d), '2')} = <strong>${area}</strong>.`
      ]
    };
  }

  function genSquarePerimeter() {
    const a = randInt(4, 24);
    const p = 4 * a;
    const area = a * a;

    const svg = wrapSvg(`
      <rect x="95" y="30" width="130" height="130" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4"/>
      ${svgRightAngle(95, 160, 1, -1)}
      ${svgLabel(160, 100, `P = ${p}`, { fill: '#0284c7', size: 15 })}
    `);

    return {
      category: 'rect_square',
      catName: 'Прямоугольник и квадрат',
      questionHtml: `Периметр квадрата равен <strong>${p}</strong>. Найдите площадь этого квадрата.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Найдём сторону квадрата: <i>a</i> = <i>P</i> : 4 = ${p} : 4 = ${a}.`,
        `Площадь квадрата равна квадрату его стороны: <i>S</i> = ${a}<sup>2</sup> = <strong>${area}</strong>.`
      ]
    };
  }

  function genRectangleDiagSide() {
    const triples = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15]
    ];
    const [a, b, c] = pickRandom(triples);
    const area = a * b;

    const svg = wrapSvg(`
      <rect x="65" y="40" width="190" height="110" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4"/>
      <line x1="65" y1="150" x2="255" y2="40" stroke="#b7464e" stroke-width="2.2"/>
      ${svgRightAngle(255, 150, -1, -1)}
      ${svgLabel(52, 98, String(a), { fill: '#0284c7', anchor: 'end' })}
      ${svgLabel(152, 86, String(c), { fill: '#b7464e' })}
    `);

    return {
      category: 'rect_square',
      catName: 'Прямоугольник и квадрат',
      questionHtml: `В прямоугольнике одна сторона равна <strong>${a}</strong>, а диагональ равна <strong>${c}</strong>. Найдите площадь прямоугольника.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Из прямоугольного треугольника по теореме Пифагора найдём вторую сторону <i>b</i>: <i>b</i> = √(${c}<sup>2</sup> − ${a}<sup>2</sup>) = √(${c * c - a * a}) = ${b}.`,
        `Площадь прямоугольника равна произведению его смежных сторон: <i>S</i> = ${a} · ${b} = <strong>${area}</strong>.`
      ]
    };
  }

  function genRectanglePerimeterDiff() {
    const a = randInt(4, 14);
    const diff = randInt(2, 9);
    const b = a + diff;
    const p = 2 * (a + b);
    const area = a * b;

    const svg = wrapSvg(`
      <rect x="65" y="42" width="190" height="106" fill="rgba(2,132,199,0.10)" stroke="#1e3a5f" stroke-width="2.4"/>
      ${svgLabel(160, 99, `P = ${p}`, { fill: '#0284c7', size: 15 })}
      ${svgLabel(52, 98, 'a', { fill: '#19273c', anchor: 'end' })}
      ${svgLabel(160, 168, `a + ${diff}`, { fill: '#19273c' })}
    `);

    return {
      category: 'rect_square',
      catName: 'Прямоугольник и квадрат',
      questionHtml: `Периметр прямоугольника равен <strong>${p}</strong>, а одна из его сторон на <strong>${diff}</strong> больше другой. Найдите площадь этого прямоугольника.${svg}`,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Полупериметр прямоугольника равен сумме двух смежных сторон: <i>a</i> + <i>b</i> = ${p} : 2 = ${a + b}.`,
        `Пусть меньшая сторона равна <i>x</i>, тогда большая равна <i>x</i> + ${diff}: <i>x</i> + (<i>x</i> + ${diff}) = ${a + b} ⇒ 2<i>x</i> = ${2 * a} ⇒ <i>x</i> = ${a}.`,
        `Значит, стороны равны ${a} и ${b}, а площадь <i>S</i> = ${a} · ${b} = <strong>${area}</strong>.`
      ]
    };
  }

  // Главный роутер генерации
  function generateTask(category = 'mixed_all') {
    const groups = {
      triangle: [genTriangleBaseHeight, genTriangleSin30, genTriangleMidline, genRightTriangle],
      parallelogram: [genParallelogramSegments, genParallelogramSin30, genParallelogramHeights, genParallelogramAngles],
      rhombus: [genRhombusDiagonals, genRhombusPerimeterHeight, genRhombusSin30, genRhombusAngle],
      trapezoid: [genTrapezoidBasesHeight, genTrapezoidMidline, genTrapezoid30Deg, genTrapezoidIsoAngle],
      rect_square: [genSquareDiagonal, genSquarePerimeter, genRectangleDiagSide, genRectanglePerimeterDiff]
    };

    if (category && groups[category]) {
      return pickRandom(groups[category])();
    }

    const allGens = [
      ...groups.triangle,
      ...groups.parallelogram,
      ...groups.rhombus,
      ...groups.trapezoid,
      ...groups.rect_square
    ];
    return pickRandom(allGens)();
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const normalized = String(userRaw).trim()
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(',', '.');
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - correctAnswer) < 0.0001;
  }

  return {
    generateTask,
    checkAnswer,
    formatNum,
    categories: [
      { id: 'mixed_all', title: 'Все фигуры' },
      { id: 'triangle', title: 'Треугольник' },
      { id: 'parallelogram', title: 'Параллелограмм' },
      { id: 'rhombus', title: 'Ромб' },
      { id: 'trapezoid', title: 'Трапеция' },
      { id: 'rect_square', title: 'Прямоугольник и квадрат' }
    ]
  };
}));
