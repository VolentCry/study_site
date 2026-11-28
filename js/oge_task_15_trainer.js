/**
 * Тренажёр ОГЭ по математике · Задание №15
 * «Треугольники, углы, элементы треугольника, тригонометрия, параллелограмм»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (Вариант № 84409968)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask15Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function cleanFloat(n) {
    return Math.round(n * 1e6) / 1e6;
  }

  function formatNum(n) {
    return String(cleanFloat(n)).replace('.', ',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function sqrtHtml(val) {
    return `√<span style="border-top:1.5px solid currentColor; padding:0 2px;">${val}</span>`;
  }

  const C = {
    ink: '#19273c',
    stroke: '#263f61',
    accent: '#b7464e',
    gold: '#b45309',
    emerald: '#0f766e',
    fillSoft: 'rgba(38,63,97,0.06)',
    fillAccent: 'rgba(183,70,78,0.12)'
  };

  function wrapSvg(inner, w = 320, h = 190) {
    return `
      <div class="grid-canvas-wrap" style="display:flex; justify-content:center; margin:14px 0;">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="background:#ffffff; border-radius:10px; border:1px solid rgba(38,63,97,0.22); box-shadow:0 4px 16px rgba(0,0,0,0.06); max-width:100%; height:auto;">
          ${inner}
        </svg>
      </div>
    `.trim();
  }

  function svgLabel(x, y, text, opts = {}) {
    const fill = opts.fill || C.ink;
    const size = opts.size || 13;
    const weight = opts.weight || 700;
    const anchor = opts.anchor || 'middle';
    const baseline = opts.baseline || 'auto';
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${fill}" font-family="DM Sans, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" dominant-baseline="${baseline}">${text}</text>`;
  }

  function svgRightAngle(vx, vy, dx, dy, s = 10) {
    return `<polyline points="${vx + dx * s},${vy} ${vx + dx * s},${vy + dy * s} ${vx},${vy + dy * s}" fill="none" stroke="${C.accent}" stroke-width="1.6"/>`;
  }

  // =========================================================================
  // 1. УГЛЫ ТРЕУГОЛЬНИКА, БИССЕКТРИСА, ВНЕШНИЙ УГОЛ
  // =========================================================================

  // Сумма углов треугольника
  function genTriangleAngleSum() {
    const a = randInt(24, 82);
    const b = randInt(28, 150 - a);
    const c = 180 - a - b;

    const svg = wrapSvg(`
      <polygon points="56,155 264,155 178,36" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      ${svgLabel(44, 162, 'A', { anchor: 'end' })}
      ${svgLabel(276, 162, 'C', { anchor: 'start' })}
      ${svgLabel(178, 24, 'B')}
    `);

    return {
      category: 'angles_triangle',
      catName: 'Сумма углов треугольника',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> два угла равны <strong>${a}°</strong> и <strong>${b}°</strong>. Найдите его третий угол. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: c,
      displayAnswer: formatNum(c),
      solutionSteps: [
        `Сумма всех трёх углов любого треугольника равна 180°.`,
        `180° − ${a}° − ${b}° = <strong>${c}°</strong>.`
      ]
    };
  }

  // Равнобедренный треугольник AB = BC: дан угол ABC, найти BCA
  function genIsoscelesBaseAngle() {
    const halfSum = randInt(18, 72);
    const topAngle = 180 - 2 * halfSum;

    const svg = wrapSvg(`
      <polygon points="62,155 258,155 160,36" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="103" y1="90" x2="115" y2="100" stroke="${C.accent}" stroke-width="2"/>
      <line x1="217" y1="90" x2="205" y2="100" stroke="${C.accent}" stroke-width="2"/>
      ${svgLabel(50, 162, 'A', { anchor: 'end' })}
      ${svgLabel(270, 162, 'C', { anchor: 'start' })}
      ${svgLabel(160, 24, 'B')}
    `);

    return {
      category: 'angles_triangle',
      catName: 'Равнобедренный треугольник',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> известно, что <i>AB</i> = <i>BC</i>, ∠<i>ABC</i> = <strong>${topAngle}°</strong>. Найдите угол <i>BCA</i>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: halfSum,
      displayAnswer: formatNum(halfSum),
      solutionSteps: [
        `Так как <i>AB</i> = <i>BC</i>, треугольник <i>ABC</i> равнобедренный, углы при основании <i>AC</i> равны: ∠<i>BAC</i> = ∠<i>BCA</i>.`,
        `∠<i>BCA</i> = (180° − ${topAngle}°) : 2 = ${180 - topAngle}° : 2 = <strong>${halfSum}°</strong>.`
      ]
    };
  }

  // Равнобедренный треугольник и внешний угол при основании
  function genIsoscelesExterior() {
    const baseAngle = randInt(25, 76);
    const extAngle = 180 - baseAngle;
    const topAngle = 180 - 2 * baseAngle;
    const askTop = Math.random() < 0.5;

    const svg = wrapSvg(`
      <line x1="56" y1="150" x2="290" y2="150" stroke="${C.stroke}" stroke-width="2"/>
      <polygon points="56,150 228,150 142,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 250 150 A 22 22 0 0 0 214 132" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <line x1="92" y1="90" x2="104" y2="99" stroke="${C.gold}" stroke-width="2"/>
      <line x1="192" y1="90" x2="180" y2="99" stroke="${C.gold}" stroke-width="2"/>
      ${svgLabel(46, 156, 'A', { anchor: 'end' })}
      ${svgLabel(228, 170, 'B')}
      ${svgLabel(142, 28, 'C')}
      ${svgLabel(268, 134, `${extAngle}°`, { fill: C.accent })}
    `);

    if (askTop) {
      return {
        category: 'angles_triangle',
        catName: 'Внешний угол равнобедренного △',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> известно, что <i>AC</i> = <i>BC</i>. Внешний угол при вершине <i>B</i> равен <strong>${extAngle}°</strong>. Найдите угол <i>C</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: topAngle,
        displayAnswer: formatNum(topAngle),
        solutionSteps: [
          `Внутренний угол ∠<i>CBA</i> смежен с внешним углом ${extAngle}°: ∠<i>CBA</i> = 180° − ${extAngle}° = ${baseAngle}°.`,
          `Так как <i>AC</i> = <i>BC</i>, ∠<i>CAB</i> = ∠<i>CBA</i> = ${baseAngle}°.`,
          `∠<i>C</i> = 180° − ${baseAngle}° − ${baseAngle}° = <strong>${topAngle}°</strong>.`
        ]
      };
    }

    return {
      category: 'angles_triangle',
      catName: 'Внешний угол равнобедренного △',
      questionHtml: `
        <div class="task-text">В равнобедренном треугольнике <i>ABC</i> с основанием <i>AB</i> внешний угол при вершине <i>B</i> равен <strong>${extAngle}°</strong>. Найдите величину угла <i>CAB</i>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: baseAngle,
      displayAnswer: formatNum(baseAngle),
      solutionSteps: [
        `Сумма смежных углов равна 180°, поэтому ∠<i>CBA</i> = 180° − ${extAngle}° = ${baseAngle}°.`,
        `В равнобедренном треугольнике углы при основании равны: ∠<i>CAB</i> = ∠<i>CBA</i> = <strong>${baseAngle}°</strong>.`
      ]
    };
  }

  // Биссектриса треугольника (прямой вопрос + задача с AK = KC)
  function genBisectorAngle() {
    if (Math.random() < 0.55) {
      const half = randInt(12, 42);
      const full = half * 2;
      const svg = wrapSvg(`
        <polygon points="56,155 268,155 186,36" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="56" y1="155" x2="227" y2="95" stroke="${C.accent}" stroke-width="2.2"/>
        <path d="M 88 155 A 32 32 0 0 0 86 144" fill="none" stroke="${C.accent}" stroke-width="1.8"/>
        <path d="M 92 142 A 38 38 0 0 0 84 126" fill="none" stroke="${C.accent}" stroke-width="1.8"/>
        ${svgLabel(44, 160, 'A', { anchor: 'end' })}
        ${svgLabel(186, 24, 'B')}
        ${svgLabel(278, 160, 'C', { anchor: 'start' })}
        ${svgLabel(238, 92, 'D', { anchor: 'start', fill: C.accent })}
      `);

      return {
        category: 'angles_triangle',
        catName: 'Биссектриса угла',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> известно, что ∠<i>BAC</i> = <strong>${full}°</strong>, <i>AD</i> — биссектриса. Найдите угол <i>BAD</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: half,
        displayAnswer: formatNum(half),
        solutionSteps: [
          `Биссектриса делит угол <i>BAC</i> пополам.`,
          `∠<i>BAD</i> = ${full}° : 2 = <strong>${half}°</strong>.`
        ]
      };
    }

    // Задача №480731: биссектриса AK, AK = KC, дан угол C
    const cAngle = randInt(18, 44);
    const bAngle = 180 - 3 * cAngle;
    const svg = wrapSvg(`
      <polygon points="50,154 274,154 148,46" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="50" y1="154" x2="205" y2="95" stroke="${C.accent}" stroke-width="2.2"/>
      ${svgLabel(38, 158, 'A', { anchor: 'end' })}
      ${svgLabel(148, 34, 'B')}
      ${svgLabel(284, 158, 'C', { anchor: 'start' })}
      ${svgLabel(215, 88, 'K', { anchor: 'start', fill: C.accent })}
    `);

    return {
      category: 'angles_triangle',
      catName: 'Биссектриса и равнобедренный △',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> проведена биссектриса <i>AK</i>. Найдите градусную меру угла <i>B</i>, если ∠<i>C</i> = <strong>${cAngle}°</strong> и <i>AK</i> = <i>KC</i>.</div>
        ${svg}
      `.trim(),
      answer: bAngle,
      displayAnswer: formatNum(bAngle),
      solutionSteps: [
        `Треугольник <i>AKC</i> равнобедренный (<i>AK</i> = <i>KC</i>), поэтому ∠<i>KAC</i> = ∠<i>C</i> = ${cAngle}°.`,
        `Так как <i>AK</i> — биссектриса, ∠<i>A</i> = 2 · ${cAngle}° = ${2 * cAngle}°.`,
        `По сумме углов треугольника <i>ABC</i>: ∠<i>B</i> = 180° − ${2 * cAngle}° − ${cAngle}° = <strong>${bAngle}°</strong>.`
      ]
    };
  }

  // Высота в остроугольном треугольнике (или острый угол прямоугольного) / медиана BM = AM = MC
  function genHeightOrMedianAngle() {
    const mode = pickRandom(['right_acute', 'height_acute', 'median_half']);
    const aAngle = randInt(22, 68);
    const ans = 90 - aAngle;

    if (mode === 'right_acute') {
      const svg = wrapSvg(`
        <polygon points="74,155 248,155 74,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        ${svgRightAngle(74, 155, 1, -1)}
        ${svgLabel(62, 160, 'C', { anchor: 'end' })}
        ${svgLabel(260, 160, 'A', { anchor: 'start' })}
        ${svgLabel(74, 28, 'B')}
      `);
      return {
        category: 'angles_triangle',
        catName: 'Прямоугольный треугольник',
        questionHtml: `
          <div class="task-text">Один из острых углов прямоугольного треугольника равен <strong>${aAngle}°</strong>. Найдите его другой острый угол. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: ans,
        displayAnswer: formatNum(ans),
        solutionSteps: [
          `Сумма острых углов прямоугольного треугольника равна 90°.`,
          `90° − ${aAngle}° = <strong>${ans}°</strong>.`
        ]
      };
    }

    if (mode === 'height_acute') {
      const svg = wrapSvg(`
        <polygon points="56,155 264,155 186,38" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="186" y1="38" x2="186" y2="155" stroke="${C.accent}" stroke-width="2.2"/>
        ${svgRightAngle(186, 155, -1, -1)}
        ${svgLabel(44, 160, 'A', { anchor: 'end' })}
        ${svgLabel(186, 26, 'B')}
        ${svgLabel(274, 160, 'C', { anchor: 'start' })}
        ${svgLabel(186, 173, 'H', { fill: C.accent })}
      `);
      return {
        category: 'angles_triangle',
        catName: 'Высота треугольника',
        questionHtml: `
          <div class="task-text">В остроугольном треугольнике <i>ABC</i> проведена высота <i>BH</i>, ∠<i>BAC</i> = <strong>${aAngle}°</strong>. Найдите угол <i>ABH</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: ans,
        displayAnswer: formatNum(ans),
        solutionSteps: [
          `Треугольник <i>ABH</i> прямоугольный (∠<i>AHB</i> = 90°).`,
          `∠<i>ABH</i> = 90° − ∠<i>BAC</i> = 90° − ${aAngle}° = <strong>${ans}°</strong>.`
        ]
      };
    }

    // median_half (№472374)
    const cAngle = randInt(52, 78);
    const aAns = 90 - cAngle;
    const svg = wrapSvg(`
      <polygon points="48,152 272,152 204,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="204" y1="40" x2="160" y2="152" stroke="${C.accent}" stroke-width="2.2"/>
      ${svgLabel(36, 158, 'A', { anchor: 'end' })}
      ${svgLabel(204, 28, 'B')}
      ${svgLabel(282, 158, 'C', { anchor: 'start' })}
      ${svgLabel(160, 170, 'M', { fill: C.accent })}
    `);
    return {
      category: 'angles_triangle',
      catName: 'Медиана и углы △',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> проведена медиана <i>BM</i>. Найдите градусную меру угла <i>A</i>, если ∠<i>C</i> = <strong>${cAngle}°</strong> и <i>BM</i> = <i>AM</i> = <i>MC</i>.</div>
        ${svg}
      `.trim(),
      answer: aAns,
      displayAnswer: formatNum(aAns),
      solutionSteps: [
        `Из равнобедренных треугольников <i>AMB</i> и <i>BMC</i>: ∠<i>MBA</i> = ∠<i>A</i> = α и ∠<i>MBC</i> = ∠<i>C</i> = ${cAngle}°.`,
        `По сумме углов △<i>ABC</i>: α + (α + ${cAngle}°) + ${cAngle}° = 180° ⇒ 2α = ${180 - 2 * cAngle}°.`,
        `∠<i>A</i> = α = <strong>${aAns}°</strong> (треугольник <i>ABC</i> прямоугольный с ∠<i>B</i> = 90°).`
      ]
    };
  }

  // =========================================================================
  // 2. СРЕДНЯЯ ЛИНИЯ, МЕДИАНА/ВЫСОТА, РАВНОСТОРОННИЙ ТРЕУГОЛЬНИК
  // =========================================================================

  function genMidlineLength() {
    const ab = randInt(12, 36);
    const bc = randInt(16, 58);
    const ac = randInt(14, 42) * 2; // чётное
    const mn = ac / 2;

    const svg = wrapSvg(`
      <polygon points="56,155 264,155 156,36" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="106" y1="95.5" x2="210" y2="95.5" stroke="${C.accent}" stroke-width="2.4"/>
      ${svgLabel(44, 160, 'A', { anchor: 'end' })}
      ${svgLabel(156, 24, 'B')}
      ${svgLabel(274, 160, 'C', { anchor: 'start' })}
      ${svgLabel(92, 96, 'M', { anchor: 'end', fill: C.accent })}
      ${svgLabel(222, 96, 'N', { anchor: 'start', fill: C.accent })}
    `);

    return {
      category: 'lines_similarity',
      catName: 'Средняя линия треугольника',
      questionHtml: `
        <div class="task-text">Точки <i>M</i> и <i>N</i> являются серединами сторон <i>AB</i> и <i>BC</i> треугольника <i>ABC</i>, сторона <i>AB</i> равна ${ab}, сторона <i>BC</i> равна ${bc}, сторона <i>AC</i> равна <strong>${ac}</strong>. Найдите <i>MN</i>.</div>
        ${svg}
      `.trim(),
      answer: mn,
      displayAnswer: formatNum(mn),
      solutionSteps: [
        `Отрезок <i>MN</i> соединяет середины двух сторон, значит <i>MN</i> — средняя линия треугольника <i>ABC</i>.`,
        `Средняя линия параллельна стороне <i>AC</i> и равна её половине: <i>MN</i> = ${ac} : 2 = <strong>${mn}</strong>.`
      ]
    };
  }

  // Площадь четырёхугольника ABMN через площадь CNM (№350659)
  function genMidlineArea() {
    const sSmall = randInt(14, 110);
    const sTrap = 3 * sSmall;

    const svg = wrapSvg(`
      <polygon points="58,155 262,155 170,34" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="114" y1="94.5" x2="216" y2="94.5" stroke="${C.accent}" stroke-width="2.4"/>
      ${svgLabel(46, 160, 'A', { anchor: 'end' })}
      ${svgLabel(272, 160, 'B', { anchor: 'start' })}
      ${svgLabel(170, 22, 'C')}
      ${svgLabel(100, 95, 'N', { anchor: 'end', fill: C.accent })}
      ${svgLabel(228, 95, 'M', { anchor: 'start', fill: C.accent })}
    `);

    return {
      category: 'lines_similarity',
      catName: 'Площадь и средняя линия',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> отмечены середины <i>M</i> и <i>N</i> сторон <i>BC</i> и <i>AC</i> соответственно. Площадь треугольника <i>CNM</i> равна <strong>${sSmall}</strong>. Найдите площадь четырёхугольника <i>ABMN</i>.</div>
        ${svg}
      `.trim(),
      answer: sTrap,
      displayAnswer: formatNum(sTrap),
      solutionSteps: [
        `<i>MN</i> — средняя линия, поэтому △<i>ABC</i> ∼ △<i>NMC</i> с коэффициентом подобия <i>k</i> = 2.`,
        `Площади подобных треугольников относятся как <i>k</i><sup>2</sup> = 4: <i>S</i><sub>ABC</sub> = 4 · ${sSmall} = ${4 * sSmall}.`,
        `<i>S</i><sub>ABMN</sub> = <i>S</i><sub>ABC</sub> − <i>S</i><sub>CNM</sub> = ${4 * sSmall} − ${sSmall} = <strong>${sTrap}</strong>.`
      ]
    };
  }

  // Медиана BM и высота BH при BC = BM (№353178 и №352713)
  function genMedianAndHeight() {
    const svg = wrapSvg(`
      <polygon points="44,152 276,152 214,42" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="214" y1="42" x2="160" y2="152" stroke="${C.gold}" stroke-width="2"/>
      <line x1="214" y1="42" x2="214" y2="152" stroke="${C.accent}" stroke-width="2"/>
      ${svgRightAngle(214, 152, 1, -1, 9)}
      ${svgLabel(34, 158, 'A', { anchor: 'end' })}
      ${svgLabel(160, 170, 'M', { fill: C.gold })}
      ${svgLabel(214, 170, 'H', { fill: C.accent })}
      ${svgLabel(286, 158, 'C', { anchor: 'start' })}
      ${svgLabel(214, 30, 'B')}
    `);

    if (Math.random() < 0.5) {
      const ac = pickRandom([28, 36, 44, 52, 53, 60, 68, 76, 84, 92]);
      const am = ac / 2;
      const mh = cleanFloat(am / 2);
      const ah = cleanFloat(am + mh);
      return {
        category: 'lines_similarity',
        catName: 'Медиана и высота △',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> проведены медиана <i>BM</i> и высота <i>BH</i>. Известно, что <i>AC</i> = <strong>${ac}</strong> и <i>BC</i> = <i>BM</i>. Найдите <i>AH</i>.</div>
          ${svg}
        `.trim(),
        answer: ah,
        displayAnswer: formatNum(ah),
        solutionSteps: [
          `Так как <i>BM</i> — медиана, <i>AM</i> = <i>MC</i> = ${ac} : 2 = ${formatNum(am)}.`,
          `В равнобедренном треугольнике <i>BMC</i> (<i>BC</i> = <i>BM</i>) высота <i>BH</i> является медианой: <i>MH</i> = ${formatNum(am)} : 2 = ${formatNum(mh)}.`,
          `<i>AH</i> = <i>AM</i> + <i>MH</i> = ${formatNum(am)} + ${formatNum(mh)} = <strong>${formatNum(ah)}</strong>.`
        ]
      };
    }

    const hc = randInt(12, 34);
    const ac = 4 * hc;
    const acb = randInt(56, 82);
    const amb = 180 - acb;
    return {
      category: 'lines_similarity',
      catName: 'Медиана и высота △',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> <i>BM</i> — медиана и <i>BH</i> — высота. Известно, что <i>AC</i> = <strong>${ac}</strong>, <i>HC</i> = <strong>${hc}</strong> и ∠<i>ACB</i> = <strong>${acb}°</strong>. Найдите угол <i>AMB</i>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: amb,
      displayAnswer: formatNum(amb),
      solutionSteps: [
        `<i>MC</i> = ${ac} : 2 = ${2 * hc}, тогда <i>MH</i> = <i>MC</i> − <i>HC</i> = ${2 * hc} − ${hc} = ${hc} = <i>HC</i>.`,
        `Высота <i>BH</i> делит <i>MC</i> пополам, значит △<i>MBC</i> равнобедренный и ∠<i>BMC</i> = ∠<i>ACB</i> = ${acb}°.`,
        `Смежный угол ∠<i>AMB</i> = 180° − ${acb}° = <strong>${amb}°</strong>.`
      ]
    };
  }

  // Равносторонний треугольник: медиана/биссектриса/сторона/радиус описанной
  function genEquilateral() {
    const mode = pickRandom(['side_to_median', 'median_to_side', 'side_to_R']);

    if (mode === 'side_to_median') {
      const k = randInt(4, 22) * 2; // чётное
      const med = (k * 3) / 2;
      const svg = wrapSvg(`
        <polygon points="75,154 245,154 160,30" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="160" y1="30" x2="160" y2="154" stroke="${C.accent}" stroke-width="2.2"/>
        ${svgRightAngle(160, 154, -1, -1, 9)}
        ${svgLabel(63, 160, 'A', { anchor: 'end' })}
        ${svgLabel(160, 18, 'B')}
        ${svgLabel(257, 160, 'C', { anchor: 'start' })}
        ${svgLabel(160, 172, 'H', { fill: C.accent })}
      `);
      return {
        category: 'lines_similarity',
        catName: 'Равносторонний треугольник',
        questionHtml: `
          <div class="task-text">Сторона равностороннего треугольника равна <strong>${k}${sqrtHtml(3)}</strong>. Найдите медиану этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: med,
        displayAnswer: formatNum(med),
        solutionSteps: [
          `Медиана равностороннего треугольника равна высоте: <i>h</i> = ${fracHtml(`<i>a</i>${sqrtHtml(3)}`, '2')}.`,
          `<i>h</i> = ${fracHtml(`${k}${sqrtHtml(3)} · ${sqrtHtml(3)}`, '2')} = ${fracHtml(`${k} · 3`, '2')} = <strong>${med}</strong>.`
        ]
      };
    }

    if (mode === 'median_to_side') {
      const k = randInt(3, 18);
      const side = 2 * k;
      const word = Math.random() < 0.5 ? 'биссектриса' : 'медиана';
      const svg = wrapSvg(`
        <polygon points="75,154 245,154 160,30" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="160" y1="30" x2="160" y2="154" stroke="${C.accent}" stroke-width="2.2"/>
        ${svgRightAngle(160, 154, -1, -1, 9)}
        ${svgLabel(63, 160, 'A', { anchor: 'end' })}
        ${svgLabel(160, 18, 'B')}
        ${svgLabel(257, 160, 'C', { anchor: 'start' })}
        ${svgLabel(160, 172, 'H', { fill: C.accent })}
      `);
      return {
        category: 'lines_similarity',
        catName: 'Равносторонний треугольник',
        questionHtml: `
          <div class="task-text">${word[0].toUpperCase() + word.slice(1)} равностороннего треугольника равна <strong>${k}${sqrtHtml(3)}</strong>. Найдите сторону этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: side,
        displayAnswer: formatNum(side),
        solutionSteps: [
          `В равностороннем треугольнике ${word} <i>BH</i> является и высотой: <i>BH</i> = ${fracHtml(`<i>a</i>${sqrtHtml(3)}`, '2')}.`,
          `Отсюда <i>a</i> = ${fracHtml(`2 · <i>BH</i>`, sqrtHtml(3))} = ${fracHtml(`2 · ${k}${sqrtHtml(3)}`, sqrtHtml(3))} = <strong>${side}</strong>.`
        ]
      };
    }

    // side_to_R (№356478, №356482)
    const R = randInt(2, 16);
    const side = R; // side = R * sqrt(3) -> R = (R*sqrt(3))*sqrt(3)/3 = R
    const svg = wrapSvg(`
      <circle cx="160" cy="100" r="66" fill="none" stroke="${C.stroke}" stroke-width="2.2"/>
      <polygon points="160,34 103,133 217,133" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="160" cy="100" r="3.5" fill="${C.accent}"/>
      ${svgLabel(160, 24, 'C')}
      ${svgLabel(94, 144, 'A', { anchor: 'end' })}
      ${svgLabel(226, 144, 'B', { anchor: 'start' })}
      ${svgLabel(172, 100, 'O', { fill: C.accent })}
    `);
    return {
      category: 'lines_similarity',
      catName: 'Равносторонний △ и окружность',
      questionHtml: `
        <div class="task-text">Сторона равностороннего треугольника равна <strong>${side}${sqrtHtml(3)}</strong>. Найдите радиус окружности, описанной около этого треугольника.</div>
        ${svg}
      `.trim(),
      answer: R,
      displayAnswer: formatNum(R),
      solutionSteps: [
        `Радиус описанной около правильного треугольника окружности: <i>R</i> = ${fracHtml(`<i>a</i>${sqrtHtml(3)}`, '3')}.`,
        `<i>R</i> = ${fracHtml(`${side}${sqrtHtml(3)} · ${sqrtHtml(3)}`, '3')} = ${fracHtml(`${side} · 3`, '3')} = <strong>${R}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 3. ПРЯМОУГОЛЬНЫЙ ТРЕУГОЛЬНИК, ПИФАГОР, ТРИГОНОМЕТРИЯ И ПЛОЩАДЬ
  // =========================================================================

  function genPythagoras() {
    const triples = [
      [3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25],
      [5, 12, 13], [10, 24, 26], [8, 15, 17], [7, 24, 25], [20, 21, 29]
    ];
    const [a, b, c] = pickRandom(triples);
    const findHyp = Math.random() < 0.55;

    const svg = wrapSvg(`
      <polygon points="74,155 256,155 74,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      ${svgRightAngle(74, 155, 1, -1)}
      ${svgLabel(62, 160, 'C', { anchor: 'end' })}
      ${svgLabel(266, 160, 'B', { anchor: 'start' })}
      ${svgLabel(74, 28, 'A')}
    `);

    if (findHyp) {
      return {
        category: 'right_trig_area',
        catName: 'Теорема Пифагора',
        questionHtml: `
          <div class="task-text">Два катета прямоугольного треугольника равны <strong>${a}</strong> и <strong>${b}</strong>. Найдите гипотенузу этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: c,
        displayAnswer: formatNum(c),
        solutionSteps: [
          `По теореме Пифагора: <i>c</i><sup>2</sup> = <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = ${a}<sup>2</sup> + ${b}<sup>2</sup> = ${a * a} + ${b * b} = ${c * c}.`,
          `<i>c</i> = √${c * c} = <strong>${c}</strong>.`
        ]
      };
    }

    return {
      category: 'right_trig_area',
      catName: 'Теорема Пифагора',
      questionHtml: `
        <div class="task-text">В прямоугольном треугольнике катет и гипотенуза равны <strong>${a}</strong> и <strong>${c}</strong> соответственно. Найдите другой катет этого треугольника.</div>
        ${svg}
      `.trim(),
      answer: b,
      displayAnswer: formatNum(b),
      solutionSteps: [
        `По теореме Пифагора: <i>b</i><sup>2</sup> = <i>c</i><sup>2</sup> − <i>a</i><sup>2</sup> = ${c}<sup>2</sup> − ${a}<sup>2</sup> = ${c * c} − ${a * a} = ${b * b}.`,
        `<i>b</i> = √${b * b} = <strong>${b}</strong>.`
      ]
    };
  }

  // Тригонометрия прямоугольного треугольника
  function genRightTrig() {
    const mode = pickRandom(['sin_find_hyp', 'cos_find_hyp', 'tg_sqrt_find_hyp', 'height_sin_b']);

    if (mode === 'sin_find_hyp' || mode === 'cos_find_hyp') {
      const decimals = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8];
      const val = pickRandom(decimals);
      const hyp = pickRandom([10, 15, 20, 25, 30, 40, 50]);
      const leg = cleanFloat(hyp * val);
      const svg = wrapSvg(`
        <polygon points="74,155 250,155 74,42" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        ${svgRightAngle(74, 155, 1, -1)}
        ${svgLabel(62, 160, 'C', { anchor: 'end' })}
        ${svgLabel(260, 160, 'A', { anchor: 'start' })}
        ${svgLabel(74, 30, 'B')}
      `);

      if (mode === 'sin_find_hyp') {
        return {
          category: 'right_trig_area',
          catName: 'Синус в прямоугольном △',
          questionHtml: `
            <div class="task-text">В треугольнике <i>ABC</i> угол <i>C</i> прямой, <i>BC</i> = <strong>${formatNum(leg)}</strong>, sin <i>A</i> = <strong>${formatNum(val)}</strong>. Найдите <i>AB</i>.</div>
            ${svg}
          `.trim(),
          answer: hyp,
          displayAnswer: formatNum(hyp),
          solutionSteps: [
            `Синус угла равен отношению противолежащего катета <i>BC</i> к гипотенузе <i>AB</i>: sin <i>A</i> = ${fracHtml('<i>BC</i>', '<i>AB</i>')}.`,
            `<i>AB</i> = ${fracHtml('<i>BC</i>', 'sin <i>A</i>')} = ${fracHtml(formatNum(leg), formatNum(val))} = <strong>${hyp}</strong>.`
          ]
        };
      }

      return {
        category: 'right_trig_area',
        catName: 'Косинус в прямоугольном △',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> угол <i>C</i> прямой, <i>AC</i> = <strong>${formatNum(leg)}</strong>, cos <i>A</i> = <strong>${formatNum(val)}</strong>. Найдите <i>AB</i>.</div>
          ${svg}
        `.trim(),
        answer: hyp,
        displayAnswer: formatNum(hyp),
        solutionSteps: [
          `Косинус угла равен отношению прилежащего катета <i>AC</i> к гипотенузе <i>AB</i>: cos <i>A</i> = ${fracHtml('<i>AC</i>', '<i>AB</i>')}.`,
          `<i>AB</i> = ${fracHtml('<i>AC</i>', 'cos <i>A</i>')} = ${fracHtml(formatNum(leg), formatNum(val))} = <strong>${hyp}</strong>.`
        ]
      };
    }

    if (mode === 'tg_sqrt_find_hyp') {
      // Как №351770 и №341406: AC = a, tg A = sqrt(rad) / den -> AB = c (целое)
      const cases = [
        { ac: 3, rad: 55, den: 3, ab: 8 },
        { ac: 20, rad: 33, den: 4, ab: 35 },
        { ac: 6, rad: 13, den: 3, ab: 10 },
        { ac: 8, rad: 15, den: 4, ab: 12 },
        { ac: 10, rad: 21, den: 5, ab: 14 },
        { ac: 12, rad: 35, den: 4, ab: 24 }
      ];
      // Проверим для каждого: BC = ac * sqrt(rad) / den; AB^2 = ac^2 + BC^2
      // 3^2 + 55 = 64 -> 8; 20^2 + 25*33 = 400 + 825 = 1225 -> 35; 6^2 + 4*13 = 36+52=88 (не кв!) -> уберём неточные!
      const exactCases = [
        { ac: 3, rad: 55, den: 3, bcCoeff: 1, ab: 8 },        // 9 + 55 = 64
        { ac: 20, rad: 33, den: 4, bcCoeff: 5, ab: 35 },      // 400 + 825 = 1225
        { ac: 5, rad: 11, den: 5, bcCoeff: 1, ab: 6 },        // 25 + 11 = 36
        { ac: 4, rad: 33, den: 4, bcCoeff: 1, ab: 7 },        // 16 + 33 = 49
        { ac: 12, rad: 55, den: 6, bcCoeff: 2, ab: 19 },      // 144 + 220 = 364? Нет! 12^2 + 4*55 = 364. Возьмём ac=6,den=3,rad=15 -> 36+60=96.
        { ac: 6, rad: 15, den: 2, bcCoeff: 3, ab: 13 },       // Wait: 36 + 9*15 = 171. Let's pick exact:
        { ac: 6, rad: 21, den: 3, bcCoeff: 2, ab: 11 },       // 36 + 4*21 = 120? Нет: 11^2-36=85 -> 5*17. 10^2-36=64 -> bcCoeff=2 => rad=16!
        { ac: 8, rad: 17, den: 4, bcCoeff: 2, ab: 11 },       // 64+68=132 нет. 12^2-64=80 -> 4*20. 15^2-64=161. 18^2-64=260 -> 4*65!
        { ac: 8, rad: 65, den: 4, bcCoeff: 2, ab: 18 },       // 64 + 4*65 = 64 + 260 = 324 = 18^2!
        { ac: 12, rad: 15, den: 3, bcCoeff: 4, ab: 20 }       // 144 + 16*15 = 144 + 240 = 384 (нет). 12^2 + 16*19 = 144+304=448. 20^2-144=256->16*16. 28^2-144=640->16*40!
      ];
      const valid = exactCases.filter(x => x.ac * x.ac + x.bcCoeff * x.bcCoeff * x.rad === x.ab * x.ab);
      const item = pickRandom(valid);
      const svg = wrapSvg(`
        <polygon points="74,155 246,155 74,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        ${svgRightAngle(74, 155, 1, -1)}
        ${svgLabel(62, 160, 'C', { anchor: 'end' })}
        ${svgLabel(256, 160, 'A', { anchor: 'start' })}
        ${svgLabel(74, 28, 'B')}
      `);

      return {
        category: 'right_trig_area',
        catName: 'Тангенс в прямоугольном △',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> угол <i>C</i> равен 90°, <i>AC</i> = <strong>${item.ac}</strong>, tg <i>A</i> = ${fracHtml(sqrtHtml(item.rad), item.den)}. Найдите <i>AB</i>.</div>
          ${svg}
        `.trim(),
        answer: item.ab,
        displayAnswer: formatNum(item.ab),
        solutionSteps: [
          `<i>BC</i> = <i>AC</i> · tg <i>A</i> = ${item.ac} · ${fracHtml(sqrtHtml(item.rad), item.den)} = ${item.bcCoeff > 1 ? item.bcCoeff : ''}${sqrtHtml(item.rad)}.`,
          `По теореме Пифагора: <i>AB</i> = √(${item.ac}<sup>2</sup> + (${item.bcCoeff > 1 ? item.bcCoeff : ''}${sqrtHtml(item.rad)})<sup>2</sup>) = √(${item.ac * item.ac} + ${item.bcCoeff * item.bcCoeff * item.rad}) = √${item.ab * item.ab} = <strong>${item.ab}</strong>.`
        ]
      };
    }

    // height_sin_b (как №333011 и №333090: катет AC, высота CH на гипотенузу, найти sin ∠ABC)
    const casesH = [
      { ac: 75, chCoeff: 9, chRad: 69, ah: 6, sinB: 0.08 },   // 75^2 - 81*69 = 5625 - 5589 = 36 -> 6/75 = 0.08
      { ac: 70, chCoeff: 7, chRad: 19, ah: 63, sinB: 0.9 },   // 70^2 - 49*19 = 4900 - 931 = 3969 -> 63/70 = 0.9
      { ac: 50, chCoeff: 10, chRad: 21, ah: 20, sinB: 0.4 },  // 2500 - 100*21 = 400 -> 20/50 = 0.4
      { ac: 40, chCoeff: 8, chRad: 21, ah: 16, sinB: 0.4 },   // 1600 - 64*21 = 256 -> 16/40 = 0.4
      { ac: 25, chCoeff: 5, chRad: 24, ah: 5, sinB: 0.2 }     // 625 - 25*24 = 25 -> 5/25 = 0.2
    ];
    const hItem = pickRandom(casesH);
    const svg = wrapSvg(`
      <polygon points="48,152 272,152 204,44" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="204" y1="44" x2="204" y2="152" stroke="${C.accent}" stroke-width="2.2"/>
      ${svgRightAngle(204, 152, -1, -1, 9)}
      ${svgLabel(36, 158, 'A', { anchor: 'end' })}
      ${svgLabel(204, 32, 'C')}
      ${svgLabel(282, 158, 'B', { anchor: 'start' })}
      ${svgLabel(204, 170, 'H', { fill: C.accent })}
    `);
    return {
      category: 'right_trig_area',
      catName: 'Высота к гипотенузе и sin',
      questionHtml: `
        <div class="task-text">В прямоугольном треугольнике <i>ABC</i> катет <i>AC</i> = <strong>${hItem.ac}</strong>, а высота <i>CH</i>, опущенная на гипотенузу, равна <strong>${hItem.chCoeff}${sqrtHtml(hItem.chRad)}</strong>. Найдите sin ∠<i>ABC</i>.</div>
        ${svg}
      `.trim(),
      answer: hItem.sinB,
      displayAnswer: formatNum(hItem.sinB),
      solutionSteps: [
        `Из прямоугольного △<i>ACH</i>: <i>AH</i> = √(<i>AC</i><sup>2</sup> − <i>CH</i><sup>2</sup>) = √(${hItem.ac * hItem.ac} − ${hItem.chCoeff * hItem.chCoeff * hItem.chRad}) = √${hItem.ah * hItem.ah} = ${hItem.ah}.`,
        `Углы <i>ABC</i> и <i>ACH</i> равны, поэтому sin ∠<i>ABC</i> = sin ∠<i>ACH</i> = ${fracHtml('<i>AH</i>', '<i>AC</i>')} = ${fracHtml(hItem.ah, hItem.ac)} = <strong>${formatNum(hItem.sinB)}</strong>.`
      ]
    };
  }

  // Площадь треугольника (катеты, основание+высота, две стороны и синус)
  function genTriangleArea15() {
    const mode = pickRandom(['legs', 'base_height', 'two_sides_sin']);

    if (mode === 'legs') {
      const a = randInt(5, 18);
      const b = randInt(4, 15) * 2;
      const s = (a * b) / 2;
      const svg = wrapSvg(`
        <polygon points="62,152 258,152 62,48" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        ${svgRightAngle(62, 152, 1, -1)}
      `);
      return {
        category: 'right_trig_area',
        catName: 'Площадь прямоугольного △',
        questionHtml: `
          <div class="task-text">Два катета прямоугольного треугольника равны <strong>${a}</strong> и <strong>${b}</strong>. Найдите площадь этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: s,
        displayAnswer: formatNum(s),
        solutionSteps: [
          `Площадь прямоугольного треугольника равна половине произведения катетов: <i>S</i> = ${fracHtml('1', '2')} · ${a} · ${b} = <strong>${s}</strong>.`
        ]
      };
    }

    if (mode === 'base_height') {
      const a = randInt(8, 28);
      const h = randInt(6, 16) * 2;
      const s = (a * h) / 2;
      const svg = wrapSvg(`
        <polygon points="56,154 264,154 186,38" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="186" y1="38" x2="186" y2="154" stroke="${C.accent}" stroke-width="2.2"/>
        ${svgRightAngle(186, 154, -1, -1, 9)}
      `);
      return {
        category: 'right_trig_area',
        catName: 'Площадь треугольника',
        questionHtml: `
          <div class="task-text">Сторона треугольника равна <strong>${a}</strong>, а высота, проведённая к этой стороне, равна <strong>${h}</strong>. Найдите площадь этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: s,
        displayAnswer: formatNum(s),
        solutionSteps: [
          `<i>S</i> = ${fracHtml('1', '2')} · <i>a</i> · <i>h</i> = ${fracHtml('1', '2')} · ${a} · ${h} = <strong>${s}</strong>.`
        ]
      };
    }

    // two_sides_sin (№356165)
    const [num, den] = pickRandom([[1, 2], [2, 3], [3, 4], [4, 9], [5, 6], [3, 5], [2, 5]]);
    const ab = den * randInt(2, 4);
    const bc = 2 * randInt(4, 9);
    const s = (ab * bc * num) / (2 * den);
    const svg = wrapSvg(`
      <polygon points="58,154 264,154 132,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      ${svgLabel(46, 160, 'A', { anchor: 'end' })}
      ${svgLabel(132, 28, 'B')}
      ${svgLabel(274, 160, 'C', { anchor: 'start' })}
    `);
    return {
      category: 'right_trig_area',
      catName: 'Площадь △ через синус',
      questionHtml: `
        <div class="task-text">В треугольнике <i>ABC</i> известно, что <i>AB</i> = <strong>${ab}</strong>, <i>BC</i> = <strong>${bc}</strong>, sin ∠<i>ABC</i> = ${fracHtml(num, den)}. Найдите площадь треугольника <i>ABC</i>.</div>
        ${svg}
      `.trim(),
      answer: s,
      displayAnswer: formatNum(s),
      solutionSteps: [
        `<i>S</i> = ${fracHtml('<i>AB</i> · <i>BC</i> · sin ∠<i>ABC</i>', '2')} = ${fracHtml(`${ab} · ${bc} · ${num}`, `2 · ${den}`)} = <strong>${s}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 4. УГЛЫ ПАРАЛЛЕЛОГРАММА (БИССЕКТРИСА И ДИАГОНАЛИ)
  // =========================================================================

  function genParallelogramBisector() {
    const beta = randInt(12, 42);
    const acute = 2 * beta;

    const svg = wrapSvg(`
      <polygon points="54,148 214,148 266,48 106,48" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="54" y1="148" x2="210" y2="48" stroke="${C.accent}" stroke-width="2.2"/>
      ${svgLabel(44, 156, 'A', { anchor: 'end' })}
      ${svgLabel(102, 36, 'B')}
      ${svgLabel(212, 36, 'E', { fill: C.accent })}
      ${svgLabel(274, 48, 'C', { anchor: 'start' })}
      ${svgLabel(222, 162, 'D')}
    `);

    return {
      category: 'parallelogram_angles',
      catName: 'Биссектриса в параллелограмме',
      questionHtml: `
        <div class="task-text">Найдите величину острого угла параллелограмма <i>ABCD</i>, если биссектриса угла <i>A</i> образует со стороной <i>BC</i> угол, равный <strong>${beta}°</strong>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: acute,
      displayAnswer: formatNum(acute),
      solutionSteps: [
        `Углы <i>BEA</i> и <i>EAD</i> равны как накрест лежащие при параллельных прямых <i>BC</i> и <i>AD</i>: ∠<i>EAD</i> = ${beta}°.`,
        `Так как <i>AE</i> — биссектриса угла <i>A</i>, острый угол параллелограмма ∠<i>BAD</i> = 2 · ${beta}° = <strong>${acute}°</strong>.`
      ]
    };
  }

  function genParallelogramDiagonals() {
    const acd = pickRandom([randInt(1, 88), randInt(92, 148)]);
    const cod = cleanFloat((180 - acd) / 2);
    const ans = Math.min(cod, cleanFloat(180 - cod));

    const svg = wrapSvg(`
      <polygon points="50,148 212,148 272,48 110,48" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="50" y1="148" x2="272" y2="48" stroke="${C.accent}" stroke-width="2"/>
      <line x1="110" y1="48" x2="212" y2="148" stroke="${C.gold}" stroke-width="2"/>
      ${svgLabel(40, 156, 'A', { anchor: 'end' })}
      ${svgLabel(106, 36, 'B')}
      ${svgLabel(282, 46, 'C', { anchor: 'start' })}
      ${svgLabel(220, 162, 'D')}
    `);

    return {
      category: 'parallelogram_angles',
      catName: 'Диагонали параллелограмма',
      questionHtml: `
        <div class="task-text">В параллелограмме <i>ABCD</i> диагональ <i>AC</i> в 2 раза больше стороны <i>AB</i> и ∠<i>ACD</i> = <strong>${acd}°</strong>. Найдите меньший угол между диагоналями параллелограмма. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps: [
        `Пусть <i>O</i> — точка пересечения диагоналей. Диагонали делятся пополам, значит <i>OC</i> = ${fracHtml('<i>AC</i>', '2')} = <i>AB</i> = <i>CD</i>.`,
        `Треугольник <i>COD</i> равнобедренный (<i>OC</i> = <i>CD</i>), поэтому ∠<i>COD</i> = ∠<i>CDO</i> = (180° − ${acd}°) : 2 = ${formatNum(cod)}°.`,
        ans < cod
          ? `Угол между прямыми — это меньший из смежных углов: 180° − ${formatNum(cod)}° = <strong>${formatNum(ans)}°</strong>.`
          : `Этот угол острый, значит искомый меньший угол между диагоналями равен <strong>${formatNum(ans)}°</strong>.`
      ]
    };
  }

  const GENERATORS = {
    angles_triangle: [genTriangleAngleSum, genIsoscelesBaseAngle, genIsoscelesExterior, genBisectorAngle, genHeightOrMedianAngle],
    lines_similarity: [genMidlineLength, genMidlineArea, genMedianAndHeight, genEquilateral],
    right_trig_area: [genPythagoras, genRightTrig, genTriangleArea15],
    parallelogram_angles: [genParallelogramBisector, genParallelogramDiagonals]
  };

  function generateTask(category = 'mixed_all') {
    const cat = String(category || 'mixed_all').trim();
    if (GENERATORS[cat]) {
      return pickRandom(GENERATORS[cat])();
    }
    const allGens = [
      ...GENERATORS.angles_triangle,
      ...GENERATORS.lines_similarity,
      ...GENERATORS.right_trig_area,
      ...GENERATORS.parallelogram_angles
    ];
    return pickRandom(allGens)();
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const normalized = String(userRaw)
      .trim()
      .replace(/\s+/g, '')
      .replace(/−|—/g, '-')
      .replace(',', '.');
    if (normalized === '') return false;
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) return false;
    return Math.abs(parsed - Number(correctAnswer)) < 1e-4;
  }

  return {
    generateTask,
    checkAnswer,
    GENERATORS,
    formatNum
  };
}));
