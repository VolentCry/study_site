/**
 * Тренажёр ОГЭ по математике · Задание №16
 * «Окружность, круг и их элементы»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (Вариант № 84410008)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask16Trainer = factory();
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
    fillSoft: 'rgba(38,63,97,0.06)'
  };

  function wrapSvg(inner, w = 320, h = 200) {
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

  // =========================================================================
  // 1. ЦЕНТРАЛЬНЫЕ И ВПИСАННЫЕ УГЛЫ, ДИАМЕТРЫ
  // =========================================================================

  // Центральный угол AOB и вписанный угол ACB
  function genCentralInscribed() {
    const aob = randInt(15, 148);
    const acb = cleanFloat(aob / 2);

    // Точки на окружности (cx=160, cy=100, r=68): A (225 deg), B (315 deg), C (90 deg сверху)
    const cx = 160, cy = 104, r = 68;
    const ax = cx + r * Math.cos((225 * Math.PI) / 180);
    const ay = cy - r * Math.sin((225 * Math.PI) / 180);
    const bx = cx + r * Math.cos((315 * Math.PI) / 180);
    const by = cy - r * Math.sin((315 * Math.PI) / 180);
    const tx = cx;
    const ty = cy - r;

    const svg = wrapSvg(`
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <polygon points="${tx},${ty} ${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}" fill="none" stroke="${C.stroke}" stroke-width="2"/>
      <polyline points="${ax.toFixed(1)},${ay.toFixed(1)} ${cx},${cy} ${bx.toFixed(1)},${by.toFixed(1)}" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="3.8" fill="${C.accent}"/>
      ${svgLabel(tx, ty - 10, 'C')}
      ${svgLabel(ax - 12, ay + 12, 'A', { anchor: 'end' })}
      ${svgLabel(bx + 12, by + 12, 'B', { anchor: 'start' })}
      ${svgLabel(cx + 12, cy - 6, 'O', { fill: C.accent })}
    `);

    if (Math.random() < 0.75) {
      return {
        category: 'central_inscribed',
        catName: 'Центральный и вписанный углы',
        questionHtml: `
          <div class="task-text">Треугольник <i>ABC</i> вписан в окружность с центром в точке <i>O</i>. Найдите градусную меру угла <i>C</i> треугольника <i>ABC</i>, если угол <i>AOB</i> равен <strong>${aob}°</strong>.</div>
          ${svg}
        `.trim(),
        answer: acb,
        displayAnswer: formatNum(acb),
        solutionSteps: [
          `Угол <i>AOB</i> — центральный, а ∠<i>ACB</i> — вписанный; оба опираются на одну и ту же дугу <i>AB</i>.`,
          `Вписанный угол равен половине центрального: ∠<i>ACB</i> = ${aob}° : 2 = <strong>${formatNum(acb)}°</strong>.`
        ]
      };
    }

    const evenAcb = randInt(14, 72);
    const ansAob = 2 * evenAcb;
    return {
      category: 'central_inscribed',
      catName: 'Центральный и вписанный углы',
      questionHtml: `
        <div class="task-text">Точка <i>O</i> — центр окружности, ∠<i>ACB</i> = <strong>${evenAcb}°</strong>. Найдите величину центрального угла <i>AOB</i> (в градусах).</div>
        ${svg}
      `.trim(),
      answer: ansAob,
      displayAnswer: formatNum(ansAob),
      solutionSteps: [
        `Центральный угол <i>AOB</i> в два раза больше вписанного угла <i>ACB</i>, опирающегося на ту же дугу.`,
        `∠<i>AOB</i> = 2 · ${evenAcb}° = <strong>${ansAob}°</strong>.`
      ]
    };
  }

  // Треугольник опирается на диаметр (углы и стороны)
  function genDiameterTriangle() {
    const cx = 160, cy = 102, r = 68;
    const bx = cx + r * Math.cos((118 * Math.PI) / 180);
    const by = cy - r * Math.sin((118 * Math.PI) / 180);

    const svg = wrapSvg(`
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <polygon points="${cx - r},${cy} ${cx + r},${cy} ${bx.toFixed(1)},${by.toFixed(1)}" fill="none" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="${cx}" cy="${cy}" r="3.8" fill="${C.accent}"/>
      ${svgLabel(cx - r - 10, cy + 4, 'A', { anchor: 'end' })}
      ${svgLabel(cx + r + 10, cy + 4, 'C', { anchor: 'start' })}
      ${svgLabel(bx - 6, by - 10, 'B')}
      ${svgLabel(cx, cy + 16, 'O', { fill: C.accent })}
    `);

    if (Math.random() < 0.6) {
      const angA = randInt(9, 79);
      const angC = 90 - angA;
      return {
        category: 'central_inscribed',
        catName: 'Угол, опирающийся на диаметр',
        questionHtml: `
          <div class="task-text">Сторона <i>AC</i> треугольника <i>ABC</i> проходит через центр описанной около него окружности. Найдите ∠<i>C</i>, если ∠<i>A</i> = <strong>${angA}°</strong>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: angC,
        displayAnswer: formatNum(angC),
        solutionSteps: [
          `Вписанный угол <i>B</i> опирается на диаметр <i>AC</i>, поэтому ∠<i>B</i> = 90°.`,
          `Сумма углов треугольника 180°: ∠<i>C</i> = 180° − 90° − ${angA}° = <strong>${angC}°</strong>.`
        ]
      };
    }

    // Пифагор на диаметре (№348961, №352734)
    const triples = [
      [5, 12, 13], [8, 15, 17], [7, 24, 25], [12, 16, 20],
      [9, 12, 15], [18, 24, 30], [10, 24, 26], [6, 8, 10]
    ];
    const [a, b, diam] = pickRandom(triples);
    const R = cleanFloat(diam / 2);

    return {
      category: 'central_inscribed',
      catName: 'Диаметр и теорема Пифагора',
      questionHtml: `
        <div class="task-text">Центр окружности, описанной около треугольника <i>ABC</i>, лежит на стороне <i>AC</i>. Радиус окружности равен <strong>${formatNum(R)}</strong>. Найдите <i>AB</i>, если <i>BC</i> = <strong>${b}</strong>.</div>
        ${svg}
      `.trim(),
      answer: a,
      displayAnswer: formatNum(a),
      solutionSteps: [
        `Так как центр описанной окружности лежит на стороне <i>AC</i>, то <i>AC</i> — диаметр (<i>AC</i> = 2<i>R</i> = ${diam}), а угол <i>B</i> прямой (90°).`,
        `По теореме Пифагора: <i>AB</i> = √(${diam}<sup>2</sup> − ${b}<sup>2</sup>) = √(${diam * diam} − ${b * b}) = √${a * a} = <strong>${a}</strong>.`
      ]
    };
  }

  // Два диаметра AC и BD (№349843, №311517, №116) и точки по разные стороны от диаметра (№351406)
  function genTwoDiameters() {
    const mode = pickRandom(['acb_to_aod', 'aod_to_acb', 'oab_to_ocd', 'opposite_sides']);

    if (mode === 'opposite_sides') {
      const nba = randInt(16, 74);
      const nmb = 90 - nba;
      const cx = 160, cy = 100, r = 68;
      const nx = cx + r * Math.cos((72 * Math.PI) / 180);
      const ny = cy - r * Math.sin((72 * Math.PI) / 180);
      const mx = cx + r * Math.cos((-108 * Math.PI) / 180);
      const my = cy - r * Math.sin((-108 * Math.PI) / 180);

      const svg = wrapSvg(`
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${C.stroke}" stroke-width="2"/>
        <polygon points="${cx - r},${cy} ${nx.toFixed(1)},${ny.toFixed(1)} ${cx + r},${cy} ${mx.toFixed(1)},${my.toFixed(1)}" fill="none" stroke="${C.stroke}" stroke-width="2"/>
        ${svgLabel(cx - r - 10, cy + 4, 'A', { anchor: 'end' })}
        ${svgLabel(cx + r + 10, cy + 4, 'B', { anchor: 'start' })}
        ${svgLabel(nx, ny - 10, 'N')}
        ${svgLabel(mx, my + 16, 'M')}
      `);

      return {
        category: 'central_inscribed',
        catName: 'Вписанные углы по разные стороны диаметра',
        questionHtml: `
          <div class="task-text">На окружности по разные стороны от диаметра <i>AB</i> взяты точки <i>M</i> и <i>N</i>. Известно, что ∠<i>NBA</i> = <strong>${nba}°</strong>. Найдите угол <i>NMB</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: nmb,
        displayAnswer: formatNum(nmb),
        solutionSteps: [
          `Вписанный угол <i>NBA</i> = ${nba}°, значит дуга <i>AN</i> = 2 · ${nba}° = ${2 * nba}°.`,
          `Диаметр <i>AB</i> отсекает полуокружность (180°), поэтому дуга <i>NB</i> = 180° − ${2 * nba}° = ${180 - 2 * nba}°.`,
          `Вписанный угол <i>NMB</i> опирается на дугу <i>NB</i>: ∠<i>NMB</i> = ${180 - 2 * nba}° : 2 = <strong>${nmb}°</strong>.`
        ]
      };
    }

    const cx = 160, cy = 100, r = 68;
    const ax = cx - 52, ay = cy + 44;
    const cpx = cx + 52, cpy = cy - 44;
    const bx = cx - 52, by = cy - 44;
    const dx = cx + 52, dy = cy + 44;

    const svg = wrapSvg(`
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="${ax}" y1="${ay}" x2="${cpx}" y2="${cpy}" stroke="${C.stroke}" stroke-width="2"/>
      <line x1="${bx}" y1="${by}" x2="${dx}" y2="${dy}" stroke="${C.stroke}" stroke-width="2"/>
      <line x1="${bx}" y1="${by}" x2="${cpx}" y2="${cpy}" stroke="${C.accent}" stroke-width="1.8"/>
      <line x1="${ax}" y1="${ay}" x2="${dx}" y2="${dy}" stroke="${C.accent}" stroke-width="1.8"/>
      <circle cx="${cx}" cy="${cy}" r="3.8" fill="${C.accent}"/>
      ${svgLabel(bx - 10, by - 6, 'B', { anchor: 'end' })}
      ${svgLabel(cpx + 10, cpy - 6, 'C', { anchor: 'start' })}
      ${svgLabel(ax - 10, ay + 10, 'A', { anchor: 'end' })}
      ${svgLabel(dx + 10, dy + 10, 'D', { anchor: 'start' })}
      ${svgLabel(cx, cy + 16, 'O', { fill: C.accent })}
    `);

    if (mode === 'acb_to_aod') {
      const acb = randInt(14, 72);
      const aod = 180 - 2 * acb;
      return {
        category: 'central_inscribed',
        catName: 'Диаметры в окружности',
        questionHtml: `
          <div class="task-text"><i>AC</i> и <i>BD</i> — диаметры окружности с центром <i>O</i>. Угол <i>ACB</i> равен <strong>${acb}°</strong>. Найдите угол <i>AOD</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: aod,
        displayAnswer: formatNum(aod),
        solutionSteps: [
          `Вписанный угол <i>ACB</i> опирается на дугу <i>AB</i>, значит дуга <i>AB</i> = 2 · ${acb}° = ${2 * acb}°.`,
          `Так как <i>BD</i> — диаметр, дуга <i>AD</i> = 180° − ${2 * acb}° = ${aod}°.`,
          `Центральный угол <i>AOD</i> равен дуге <i>AD</i>: ∠<i>AOD</i> = <strong>${aod}°</strong>.`
        ]
      };
    }

    if (mode === 'aod_to_acb') {
      const aod = randInt(24, 150);
      const acb = cleanFloat((180 - aod) / 2);
      return {
        category: 'central_inscribed',
        catName: 'Диаметры в окружности',
        questionHtml: `
          <div class="task-text">В окружности с центром <i>O</i> отрезки <i>AC</i> и <i>BD</i> — диаметры. Величина центрального угла <i>AOD</i> равна <strong>${aod}°</strong>. Найдите величину вписанного угла <i>ACB</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: acb,
        displayAnswer: formatNum(acb),
        solutionSteps: [
          `Угол <i>AOB</i> смежен с углом <i>AOD</i>: ∠<i>AOB</i> = 180° − ${aod}° = ${180 - aod}°.`,
          `Вписанный угол <i>ACB</i> равен половине центрального угла <i>AOB</i>: ${180 - aod}° : 2 = <strong>${formatNum(acb)}°</strong>.`
        ]
      };
    }

    // oab_to_ocd (№116): диаметры AD и BC, хорды AB и CD
    const oab = randInt(25, 78);
    const svgOab = wrapSvg(`
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="${bx}" y1="${by}" x2="${dx}" y2="${dy}" stroke="${C.stroke}" stroke-width="2"/>
      <line x1="${cpx}" y1="${cpy}" x2="${ax}" y2="${ay}" stroke="${C.stroke}" stroke-width="2"/>
      <line x1="${bx}" y1="${by}" x2="${cpx}" y2="${cpy}" stroke="${C.accent}" stroke-width="1.8"/>
      <line x1="${ax}" y1="${ay}" x2="${dx}" y2="${dy}" stroke="${C.accent}" stroke-width="1.8"/>
      <circle cx="${cx}" cy="${cy}" r="3.8" fill="${C.accent}"/>
      ${svgLabel(bx - 10, by - 6, 'A', { anchor: 'end' })}
      ${svgLabel(cpx + 10, cpy - 6, 'B', { anchor: 'start' })}
      ${svgLabel(ax - 10, ay + 10, 'C', { anchor: 'end' })}
      ${svgLabel(dx + 10, dy + 10, 'D', { anchor: 'start' })}
      ${svgLabel(cx, cy + 16, 'O', { fill: C.accent })}
    `);
    return {
      category: 'central_inscribed',
      catName: 'Равные вписанные углы',
      questionHtml: `
        <div class="task-text">В окружности с центром в точке <i>O</i> проведены диаметры <i>AD</i> и <i>BC</i>, угол <i>OAB</i> равен <strong>${oab}°</strong>. Найдите величину угла <i>OCD</i>. Ответ дайте в градусах.</div>
        ${svgOab}
      `.trim(),
      answer: oab,
      displayAnswer: formatNum(oab),
      solutionSteps: [
        `Углы <i>DAB</i> (∠<i>OAB</i>) и <i>DCB</i> (∠<i>OCD</i>) — вписанные и опираются на одну и ту же дугу <i>BD</i>.`,
        `Следовательно, они равны: ∠<i>OCD</i> = <strong>${oab}°</strong>.`
      ]
    };
  }

  // =========================================================================
  // 2. КАСАТЕЛЬНЫЕ, СЕКУЩИЕ И ХОРДЫ
  // =========================================================================

  // №349963, №353023: Отрезок AB, точка C на нём, окружность с центром A и радиусом AC
  function genTangentFromPoint() {
    const triples = [
      [12, 13, 5], [15, 17, 8], [24, 25, 7],
      [60, 61, 11], [60, 65, 25], [40, 41, 9], [20, 29, 21]
    ];
    const [r, ab, bh] = pickRandom(triples);
    const bc = ab - r;

    const svg = wrapSvg(`
      <circle cx="122" cy="94" r="64" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="122" y1="94" x2="254" y2="94" stroke="${C.stroke}" stroke-width="2"/>
      <line x1="122" y1="94" x2="150" y2="152" stroke="${C.gold}" stroke-width="2"/>
      <line x1="254" y1="94" x2="150" y2="152" stroke="${C.accent}" stroke-width="2.4"/>
      <circle cx="122" cy="94" r="3.8" fill="${C.ink}"/>
      <circle cx="186" cy="94" r="3.8" fill="${C.stroke}"/>
      <circle cx="254" cy="94" r="3.8" fill="${C.accent}"/>
      ${svgLabel(112, 86, 'A', { anchor: 'end' })}
      ${svgLabel(194, 84, 'C')}
      ${svgLabel(264, 96, 'B', { anchor: 'start', fill: C.accent })}
      ${svgLabel(146, 172, 'H', { fill: C.gold })}
    `);

    return {
      category: 'tangents_secants_chords',
      catName: 'Отрезок касательной',
      questionHtml: `
        <div class="task-text">На отрезке <i>AB</i> выбрана точка <i>C</i> так, что <i>AC</i> = <strong>${r}</strong> и <i>BC</i> = <strong>${bc}</strong>. Построена окружность с центром <i>A</i>, проходящая через <i>C</i>. Найдите длину отрезка касательной, проведённой из точки <i>B</i> к этой окружности.</div>
        ${svg}
      `.trim(),
      answer: bh,
      displayAnswer: formatNum(bh),
      solutionSteps: [
        `Проведём радиус <i>AH</i> в точку касания: <i>AH</i> = <i>AC</i> = ${r} и <i>AH</i> ⊥ <i>BH</i>.`,
        `Гипотенуза треугольника <i>ABH</i>: <i>AB</i> = <i>AC</i> + <i>BC</i> = ${r} + ${bc} = ${ab}.`,
        `По теореме Пифагора: <i>BH</i> = √(${ab}<sup>2</sup> − ${r}<sup>2</sup>) = √(${ab * ab} − ${r * r}) = √${bh * bh} = <strong>${bh}</strong>.`
      ]
    };
  }

  // Две касательные (№353392, №350957 -> угол ABO; №333091 -> угол AOB)
  function genTwoTangents() {
    const svg = wrapSvg(`
      <circle cx="126" cy="100" r="62" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="258" y1="100" x2="152" y2="44" stroke="${C.accent}" stroke-width="2.2"/>
      <line x1="258" y1="100" x2="152" y2="156" stroke="${C.accent}" stroke-width="2.2"/>
      <line x1="126" y1="100" x2="152" y2="44" stroke="${C.stroke}" stroke-width="1.8"/>
      <line x1="126" y1="100" x2="152" y2="156" stroke="${C.stroke}" stroke-width="1.8"/>
      <line x1="152" y1="44" x2="152" y2="156" stroke="${C.gold}" stroke-width="1.8"/>
      <circle cx="126" cy="100" r="3.8" fill="${C.ink}"/>
      ${svgLabel(114, 104, 'O', { anchor: 'end' })}
      ${svgLabel(152, 30, 'A')}
      ${svgLabel(152, 176, 'B')}
      ${svgLabel(270, 104, 'C', { anchor: 'start', fill: C.accent })}
    `);

    if (Math.random() < 0.6) {
      const cAngle = randInt(5, 44) * 2;
      const abo = cAngle / 2;
      return {
        category: 'tangents_secants_chords',
        catName: 'Две касательные к окружности',
        questionHtml: `
          <div class="task-text">Касательные в точках <i>A</i> и <i>B</i> к окружности с центром <i>O</i> пересекаются под углом <strong>${cAngle}°</strong>. Найдите угол <i>ABO</i>. Ответ дайте в градусах.</div>
          ${svg}
        `.trim(),
        answer: abo,
        displayAnswer: formatNum(abo),
        solutionSteps: [
          `Отрезки касательных из одной точки равны (<i>CA</i> = <i>CB</i>), поэтому ∠<i>CAB</i> = ∠<i>CBA</i> = (180° − ${cAngle}°) : 2 = ${90 - abo}°.`,
          `Радиус <i>OB</i> перпендикулярен касательной <i>BC</i> (∠<i>OBC</i> = 90°).`,
          `∠<i>ABO</i> = 90° − ${90 - abo}° = <strong>${abo}°</strong>.`
        ]
      };
    }

    const cAngle = randInt(24, 132);
    const aob = 180 - cAngle;
    return {
      category: 'tangents_secants_chords',
      catName: 'Угол между касательными',
      questionHtml: `
        <div class="task-text">В угол <i>C</i> величиной <strong>${cAngle}°</strong> вписана окружность, которая касается сторон угла в точках <i>A</i> и <i>B</i>. Найдите угол <i>AOB</i>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: aob,
      displayAnswer: formatNum(aob),
      solutionSteps: [
        `Радиусы <i>OA</i> и <i>OB</i> перпендикулярны касательным, поэтому ∠<i>OAC</i> = ∠<i>OBC</i> = 90°.`,
        `Сумма углов четырёхугольника <i>OACB</i> равна 360°: ∠<i>AOB</i> = 360° − 90° − 90° − ${cAngle}° = <strong>${aob}°</strong>.`
      ]
    };
  }

  // Угол между касательной и хордой (№369712, №369504, №369682)
  function genTangentChordAngle() {
    const arc = randInt(18, 82) * 2;
    const ans = arc / 2;

    const svg = wrapSvg(`
      <circle cx="155" cy="96" r="66" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="76" y1="162" x2="270" y2="162" stroke="${C.accent}" stroke-width="2.4"/>
      <line x1="155" y1="162" x2="215" y2="68" stroke="${C.stroke}" stroke-width="2.2"/>
      <circle cx="155" cy="162" r="3.8" fill="${C.accent}"/>
      <circle cx="215" cy="68" r="3.8" fill="${C.stroke}"/>
      ${svgLabel(155, 180, 'B', { fill: C.accent })}
      ${svgLabel(226, 62, 'A', { anchor: 'start' })}
      ${svgLabel(272, 180, 'C', { fill: C.accent })}
    `);

    return {
      category: 'tangents_secants_chords',
      catName: 'Касательная и хорда',
      questionHtml: `
        <div class="task-text">На окружности отмечены точки <i>A</i> и <i>B</i> так, что меньшая дуга <i>AB</i> равна <strong>${arc}°</strong>. Прямая <i>BC</i> касается окружности в точке <i>B</i> так, что угол <i>ABC</i> острый. Найдите угол <i>ABC</i>. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps: [
        `Угол между касательной и хордой равен половине дуги, заключённой между ними:`,
        `∠<i>ABC</i> = ${arc}° : 2 = <strong>${ans}°</strong>.`
      ]
    };
  }

  // Касательная и секущая (№356543): AK^2 = AB * AC
  function genTangentSecant() {
    const pairs = [
      [2, 8, 4], [2, 18, 6], [3, 12, 6], [4, 9, 6], [4, 16, 8],
      [3, 27, 9], [5, 20, 10], [8, 18, 12], [9, 16, 12], [4, 25, 10]
    ];
    const [ab, ac, ak] = pickRandom(pairs);

    const svg = wrapSvg(`
      <circle cx="188" cy="96" r="64" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="54" y1="160" x2="262" y2="160" stroke="${C.accent}" stroke-width="2.4"/>
      <line x1="54" y1="160" x2="222" y2="41" stroke="${C.stroke}" stroke-width="2.2"/>
      <circle cx="54" cy="160" r="3.8" fill="${C.accent}"/>
      <circle cx="131" cy="105" r="3.8" fill="${C.stroke}"/>
      <circle cx="222" cy="41" r="3.8" fill="${C.stroke}"/>
      <circle cx="188" cy="160" r="3.8" fill="${C.accent}"/>
      ${svgLabel(44, 166, 'A', { anchor: 'end', fill: C.accent })}
      ${svgLabel(120, 98, 'B', { anchor: 'end' })}
      ${svgLabel(232, 35, 'C', { anchor: 'start' })}
      ${svgLabel(188, 178, 'K', { fill: C.accent })}
    `);

    return {
      category: 'tangents_secants_chords',
      catName: 'Касательная и секущая',
      questionHtml: `
        <div class="task-text">Через точку <i>A</i>, лежащую вне окружности, проведены две прямые. Одна прямая касается окружности в точке <i>K</i>. Другая пересекает окружность в точках <i>B</i> и <i>C</i>, причём <i>AB</i> = <strong>${ab}</strong>, <i>AC</i> = <strong>${ac}</strong>. Найдите <i>AK</i>.</div>
        ${svg}
      `.trim(),
      answer: ak,
      displayAnswer: formatNum(ak),
      solutionSteps: [
        `По теореме о касательной и секущей: <i>AK</i><sup>2</sup> = <i>AB</i> · <i>AC</i>.`,
        `<i>AK</i> = √(${ab} · ${ac}) = √${ab * ac} = <strong>${ak}</strong>.`
      ]
    };
  }

  // Длина хорды по радиусу и расстоянию до центра (№340587)
  function genChordLength() {
    const triples = [
      [5, 12, 13], [8, 15, 17], [3, 4, 5], [6, 8, 10],
      [9, 12, 15], [7, 24, 25], [10, 24, 26]
    ];
    const [d, halfChord, r] = pickRandom(triples);
    const chord = 2 * halfChord;

    const svg = wrapSvg(`
      <circle cx="160" cy="96" r="68" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <line x1="104" y1="134" x2="216" y2="134" stroke="${C.stroke}" stroke-width="2.4"/>
      <line x1="160" y1="96" x2="160" y2="134" stroke="${C.accent}" stroke-width="2"/>
      <line x1="160" y1="96" x2="104" y2="134" stroke="${C.gold}" stroke-width="1.8" stroke-dasharray="4 3"/>
      <circle cx="160" cy="96" r="3.8" fill="${C.ink}"/>
      ${svgLabel(160, 84, 'O')}
      ${svgLabel(160, 152, 'H', { fill: C.accent })}
      ${svgLabel(92, 140, 'A', { anchor: 'end' })}
      ${svgLabel(228, 140, 'B', { anchor: 'start' })}
    `);

    return {
      category: 'tangents_secants_chords',
      catName: 'Длина хорды',
      questionHtml: `
        <div class="task-text">Найдите длину хорды окружности радиусом <strong>${r} см</strong>, если расстояние от центра окружности до хорды равно <strong>${d} см</strong>. Ответ запишите в сантиметрах.</div>
        ${svg}
      `.trim(),
      answer: chord,
      displayAnswer: formatNum(chord),
      solutionSteps: [
        `Перпендикуляр <i>OH</i> из центра к хорде <i>AB</i> делит её пополам.`,
        `По теореме Пифагора: <i>AH</i> = √(${r}<sup>2</sup> − ${d}<sup>2</sup>) = √(${r * r} − ${d * d}) = √${halfChord * halfChord} = ${halfChord} см.`,
        `Длина всей хорды: <i>AB</i> = 2 · ${halfChord} = <strong>${chord} см</strong>.`
      ]
    };
  }

  // =========================================================================
  // 3. ВПИСАННЫЕ И ОПИСАННЫЕ ЧЕТЫРЁХУГОЛЬНИКИ И КВАДРАТЫ
  // =========================================================================

  function genInscribedQuad() {
    const a = randInt(48, 134);
    const c = 180 - a;

    const svg = wrapSvg(`
      <circle cx="160" cy="100" r="66" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <polygon points="104,135 124,45 224,84 198,154" fill="none" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      ${svgLabel(92, 142, 'A', { anchor: 'end' })}
      ${svgLabel(120, 34, 'B')}
      ${svgLabel(236, 84, 'C', { anchor: 'start' })}
      ${svgLabel(208, 168, 'D', { anchor: 'start' })}
    `);

    return {
      category: 'inscribed_quad',
      catName: 'Вписанный четырёхугольник',
      questionHtml: `
        <div class="task-text">Угол <i>A</i> четырёхугольника <i>ABCD</i>, вписанного в окружность, равен <strong>${a}°</strong>. Найдите угол <i>C</i> этого четырёхугольника. Ответ дайте в градусах.</div>
        ${svg}
      `.trim(),
      answer: c,
      displayAnswer: formatNum(c),
      solutionSteps: [
        `Сумма противоположных углов вписанного в окружность четырёхугольника равна 180°.`,
        `∠<i>C</i> = 180° − ${a}° = <strong>${c}°</strong>.`
      ]
    };
  }

  function genTrapezoidInscribedCircle() {
    const r = randInt(8, 36);
    const h = 2 * r;

    const svg = wrapSvg(`
      <polygon points="74,154 246,154 218,46 112,46" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="164" cy="100" r="54" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
    `);

    return {
      category: 'inscribed_quad',
      catName: 'Окружность в трапеции',
      questionHtml: `
        <div class="task-text">Радиус окружности, вписанной в трапецию, равен <strong>${r}</strong>. Найдите высоту этой трапеции.</div>
        ${svg}
      `.trim(),
      answer: h,
      displayAnswer: formatNum(h),
      solutionSteps: [
        `Окружность касается верхнего и нижнего оснований трапеции, значит её диаметр равен высоте трапеции.`,
        `<i>h</i> = 2 · <i>r</i> = 2 · ${r} = <strong>${h}</strong>.`
      ]
    };
  }

  function genSquareAndCircle() {
    const mode = pickRandom(['circumscribed_area', 'inscribed_r', 'inscribed_square_side', 'midside_circle']);

    if (mode === 'circumscribed_area') {
      const r = randInt(3, 14);
      const s = (2 * r) * (2 * r);
      const svg = wrapSvg(`
        <rect x="98" y="38" width="124" height="124" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <circle cx="160" cy="100" r="62" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
      `);
      return {
        category: 'inscribed_quad',
        catName: 'Квадрат вокруг окружности',
        questionHtml: `
          <div class="task-text">Найдите площадь квадрата, описанного вокруг окружности радиуса <strong>${r}</strong>.</div>
          ${svg}
        `.trim(),
        answer: s,
        displayAnswer: formatNum(s),
        solutionSteps: [
          `Сторона квадрата равна диаметру вписанной окружности: <i>a</i> = 2 · ${r} = ${2 * r}.`,
          `Площадь квадрата: <i>S</i> = ${2 * r}<sup>2</sup> = <strong>${s}</strong>.`
        ]
      };
    }

    if (mode === 'inscribed_r') {
      const a = randInt(4, 34);
      const r = cleanFloat(a / 2);
      const svg = wrapSvg(`
        <rect x="98" y="38" width="124" height="124" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <circle cx="160" cy="100" r="62" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
      `);
      return {
        category: 'inscribed_quad',
        catName: 'Окружность в квадрате',
        questionHtml: `
          <div class="task-text">Сторона квадрата равна <strong>${a}</strong>. Найдите радиус окружности, вписанной в этот квадрат.</div>
          ${svg}
        `.trim(),
        answer: r,
        displayAnswer: formatNum(r),
        solutionSteps: [
          `Радиус вписанной в квадрат окружности вдвое меньше его стороны: <i>r</i> = ${a} : 2 = <strong>${formatNum(r)}</strong>.`
        ]
      };
    }

    if (mode === 'inscribed_square_side') {
      const k = randInt(2, 12);
      const side = 2 * k;
      const svg = wrapSvg(`
        <circle cx="160" cy="100" r="66" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <rect x="113.3" y="53.3" width="93.4" height="93.4" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
      `);
      return {
        category: 'inscribed_quad',
        catName: 'Квадрат в окружности',
        questionHtml: `
          <div class="task-text">Радиус окружности, описанной около квадрата, равен <strong>${k}${sqrtHtml(2)}</strong>. Найдите длину стороны этого квадрата.</div>
          ${svg}
        `.trim(),
        answer: side,
        displayAnswer: formatNum(side),
        solutionSteps: [
          `Диагональ квадрата равна диаметру окружности (2<i>R</i>) и связана со стороной формулой <i>d</i> = <i>a</i>${sqrtHtml(2)}, откуда <i>a</i> = <i>R</i>${sqrtHtml(2)}.`,
          `<i>a</i> = ${k}${sqrtHtml(2)} · ${sqrtHtml(2)} = <strong>${side}</strong>.`
        ]
      };
    }

    // midside_circle (№462107): O - середина CD квадрата ABCD, окружность через A радиуса sqrt(5*k^2)
    const k = randInt(1, 5);
    const halfX = k;
    const x = 2 * k; // wait: x^2 + (x/2)^2 = 5/4 * x^2 -> чтобы было целым, возьмём x чётным? Или как в 462107:
    // В 462107: S = 8, x^2 = 8, 5/4 * x^2 = 10 -> R = sqrt(10)! То есть при R = sqrt(5 * m), S = 4 * m!
    const m = pickRandom([2, 4, 5, 8, 9, 10]);
    const rSq = 5 * m;
    const area = 4 * m;
    const svg = wrapSvg(`
      <circle cx="160" cy="116" r="58" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <rect x="134" y="64" width="52" height="52" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
      <circle cx="160" cy="116" r="3.5" fill="${C.accent}"/>
      ${svgLabel(126, 60, 'A', { anchor: 'end' })}
      ${svgLabel(194, 60, 'B', { anchor: 'start' })}
      ${svgLabel(194, 124, 'C', { anchor: 'start' })}
      ${svgLabel(126, 124, 'D', { anchor: 'end' })}
      ${svgLabel(160, 106, 'O', { fill: C.accent })}
    `);
    return {
      category: 'inscribed_quad',
      catName: 'Квадрат и окружность',
      questionHtml: `
        <div class="task-text">Точка <i>O</i> является серединой стороны <i>CD</i> квадрата <i>ABCD</i>. Радиус окружности с центром в точке <i>O</i>, проходящей через вершину <i>A</i>, равен <strong>${sqrtHtml(rSq)}</strong>. Найдите площадь квадрата <i>ABCD</i>.</div>
        ${svg}
      `.trim(),
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps: [
        `Пусть сторона квадрата равна <i>x</i>. Тогда в прямоугольном △<i>ADO</i> катеты равны <i>x</i> и ${fracHtml('<i>x</i>', '2')}, а гипотенуза <i>AO</i> = ${sqrtHtml(rSq)}.`,
        `По теореме Пифагора: <i>x</i><sup>2</sup> + ${fracHtml('<i>x</i><sup>2</sup>', '4')} = ${rSq} ⇒ ${fracHtml('5', '4')}<i>x</i><sup>2</sup> = ${rSq}.`,
        `Площадь квадрата: <i>S</i> = <i>x</i><sup>2</sup> = ${fracHtml(`4 · ${rSq}`, '5')} = <strong>${area}</strong>.`
      ]
    };
  }

  // Прямоугольник в окружности (№472383) и ромб с вписанной окружностью (№472386)
  function genRectOrRhombusInCircle() {
    if (Math.random() < 0.5) {
      // Прямоугольник: диагональ = диаметр D, пифагорова тройка
      const triples = [
        [7, 24, 25], [14, 48, 50], [5, 12, 13], [10, 24, 26], [8, 15, 17], [9, 12, 15]
      ];
      const [a, b, D] = pickRandom(triples);
      const sinA = cleanFloat(b / D);
      // Если b/D не конечная десятичная? 24/25=0.96, 48/50=0.96, 24/26 (нет!), 12/15=0.8. Фильтруем только те, где D кратно 5 или 2^n*5^m:
      const cleanTriples = [
        [7, 24, 25], [14, 48, 50], [9, 12, 15], [6, 8, 10], [12, 16, 20], [15, 20, 25]
      ];
      const [ca, cb, cD] = pickRandom(cleanTriples);
      const cSin = cleanFloat(cb / cD);
      const area = ca * cb;

      const svg = wrapSvg(`
        <circle cx="160" cy="100" r="66" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <rect x="104" y="65" width="112" height="70" fill="none" stroke="${C.stroke}" stroke-width="2.2"/>
        <line x1="104" y1="135" x2="216" y2="65" stroke="${C.accent}" stroke-width="2"/>
      `);
      return {
        category: 'inscribed_quad',
        catName: 'Прямоугольник в окружности',
        questionHtml: `
          <div class="task-text">Синус угла между стороной и диагональю прямоугольника равен <strong>${formatNum(cSin)}</strong>. Диаметр описанной около него окружности равен <strong>${cD}</strong>. Найдите площадь прямоугольника.</div>
          ${svg}
        `.trim(),
        answer: area,
        displayAnswer: formatNum(area),
        solutionSteps: [
          `Диагональ прямоугольника равна диаметру описанной окружности: <i>d</i> = ${cD}.`,
          `Один катет: <i>a</i> = ${cD} · ${formatNum(cSin)} = ${cb}. Второй катет: <i>b</i> = √(${cD}<sup>2</sup> − ${cb}<sup>2</sup>) = ${ca}.`,
          `Площадь: <i>S</i> = ${ca} · ${cb} = <strong>${area}</strong>.`
        ]
      };
    }

    // Ромб с вписанной окружностью (№472386): AC = 2 * oc, tg = 3/4 или 4/3
    const k = randInt(2, 6);
    const oc = 3 * k;
    const ac = 2 * oc;
    const ob = 4 * k;
    const bc = 5 * k;
    const r = cleanFloat((oc * ob) / bc); // (3k*4k)/(5k) = 2.4k -> всегда конечная десятичная!
    const svg = wrapSvg(`
      <polygon points="72,100 160,44 248,100 160,156" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="160" cy="100" r="47.3" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <line x1="72" y1="100" x2="248" y2="100" stroke="${C.stroke}" stroke-width="1.6"/>
      ${svgLabel(60, 104, 'A', { anchor: 'end' })}
      ${svgLabel(160, 32, 'B')}
      ${svgLabel(260, 104, 'C', { anchor: 'start' })}
      ${svgLabel(160, 174, 'D')}
    `);
    return {
      category: 'inscribed_quad',
      catName: 'Окружность, вписанная в ромб',
      questionHtml: `
        <div class="task-text">Диагональ <i>AC</i> ромба <i>ABCD</i> равна <strong>${ac}</strong>, а tg ∠<i>BCA</i> = ${fracHtml('4', '3')}. Найдите радиус окружности, вписанной в ромб.</div>
        ${svg}
      `.trim(),
      answer: r,
      displayAnswer: formatNum(r),
      solutionSteps: [
        `Диагонали ромба пересекаются в точке <i>O</i> под прямым углом и делятся пополам: <i>OC</i> = ${ac} : 2 = ${oc}.`,
        `В прямоугольном △<i>BOC</i>: <i>OB</i> = <i>OC</i> · tg ∠<i>BCA</i> = ${oc} · ${fracHtml('4', '3')} = ${ob}. По теореме Пифагора: <i>BC</i> = √(${oc}<sup>2</sup> + ${ob}<sup>2</sup>) = ${bc}.`,
        `Радиус вписанной окружности равен высоте <i>OH</i> из прямого угла: <i>r</i> = ${fracHtml('<i>OB</i> · <i>OC</i>', '<i>BC</i>')} = ${fracHtml(`${ob} · ${oc}`, bc)} = <strong>${formatNum(r)}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 4. ОКРУЖНОСТЬ И ТРЕУГОЛЬНИК
  // =========================================================================

  function genEquilateralCircle() {
    const mode = pickRandom(['r_to_side', 'R_to_side', 'r_to_height']);

    if (mode === 'r_to_side') {
      const k = randInt(1, 7);
      const side = 6 * k;
      const svg = wrapSvg(`
        <circle cx="160" cy="108" r="36" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
        <polygon points="160,36 97.6,144 222.4,144" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
        <line x1="160" y1="108" x2="160" y2="144" stroke="${C.accent}" stroke-width="2"/>
        <circle cx="160" cy="108" r="3.5" fill="${C.ink}"/>
        ${svgLabel(172, 106, 'O')}
      `);
      return {
        category: 'circle_triangle',
        catName: 'Окружность в равностороннем △',
        questionHtml: `
          <div class="task-text">В равносторонний треугольник вписана окружность радиуса <strong>${k > 1 ? k : ''}${sqrtHtml(3)}</strong>. Найдите сторону треугольника.</div>
          ${svg}
        `.trim(),
        answer: side,
        displayAnswer: formatNum(side),
        solutionSteps: [
          `Радиус вписанной в равносторонний треугольник окружности: <i>r</i> = ${fracHtml(`<i>a</i>${sqrtHtml(3)}`, '6')}.`,
          `Отсюда <i>a</i> = <i>r</i> · ${fracHtml('6', sqrtHtml(3))} = ${k > 1 ? k : ''}${sqrtHtml(3)} · ${fracHtml('6', sqrtHtml(3))} = <strong>${side}</strong>.`
        ]
      };
    }

    if (mode === 'R_to_side') {
      const k = randInt(2, 11);
      const side = 3 * k;
      const svg = wrapSvg(`
        <circle cx="160" cy="100" r="66" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
        <polygon points="160,34 102.8,133 217.2,133" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="160" cy="100" r="3.5" fill="${C.ink}"/>
        ${svgLabel(160, 22, 'C')}
        ${svgLabel(92, 144, 'A', { anchor: 'end' })}
        ${svgLabel(228, 144, 'B', { anchor: 'start' })}
        ${svgLabel(172, 100, 'O')}
      `);
      return {
        category: 'circle_triangle',
        catName: 'Описанная окружность около правильного △',
        questionHtml: `
          <div class="task-text">Радиус окружности, описанной около равностороннего треугольника, равен <strong>${k}${sqrtHtml(3)}</strong>. Найдите длину стороны этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: side,
        displayAnswer: formatNum(side),
        solutionSteps: [
          `По теореме синусов для угла 60°: ${fracHtml('<i>a</i>', 'sin 60°')} = 2<i>R</i> ⇒ <i>a</i> = 2<i>R</i> · ${fracHtml(sqrtHtml(3), '2')} = <i>R</i>${sqrtHtml(3)}.`,
          `<i>a</i> = ${k}${sqrtHtml(3)} · ${sqrtHtml(3)} = <strong>${side}</strong>.`
        ]
      };
    }

    // r_to_height (№356498)
    const r = randInt(3, 18);
    const h = 3 * r;
    const svg = wrapSvg(`
      <circle cx="160" cy="112" r="34" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
      <polygon points="160,44 101.1,146 218.9,146" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="160" cy="112" r="3.5" fill="${C.ink}"/>
      ${svgLabel(160, 32, 'C')}
      ${svgLabel(90, 152, 'A', { anchor: 'end' })}
      ${svgLabel(230, 152, 'B', { anchor: 'start' })}
      ${svgLabel(172, 112, 'O')}
    `);
    return {
      category: 'circle_triangle',
      catName: 'Высота правильного △ и радиус',
      questionHtml: `
        <div class="task-text">Радиус окружности, вписанной в равносторонний треугольник, равен <strong>${r}</strong>. Найдите высоту этого треугольника.</div>
        ${svg}
      `.trim(),
      answer: h,
      displayAnswer: formatNum(h),
      solutionSteps: [
        `Высота равностороннего треугольника равна 3 радиусам вписанной окружности (<i>h</i> = 3<i>r</i>).`,
        `<i>h</i> = 3 · ${r} = <strong>${h}</strong>.`
      ]
    };
  }

  // Теорема синусов для вписанного треугольника (№450514) и S = p*r (№356329)
  function genSineTheoremOrPr() {
    if (Math.random() < 0.5) {
      const variants = [
        { angle: 30, rad: null, mult: 1, R: randInt(4, 15) },
        { angle: 45, rad: 2, mult: 1, R: randInt(3, 12) },
        { angle: 60, rad: 3, mult: 1, R: randInt(3, 12) }
      ];
      const v = pickRandom(variants);
      const sideText = v.rad ? `${v.R}${sqrtHtml(v.rad)}` : `${v.R}`;
      const sinText = v.angle === 30 ? fracHtml('1', '2') : v.angle === 45 ? fracHtml(sqrtHtml(2), '2') : fracHtml(sqrtHtml(3), '2');

      const svg = wrapSvg(`
        <circle cx="160" cy="100" r="66" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2"/>
        <polygon points="104,135 128,42 224,118" fill="none" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
        ${svgLabel(92, 144, 'A', { anchor: 'end' })}
        ${svgLabel(126, 30, 'B')}
        ${svgLabel(236, 122, 'C', { anchor: 'start' })}
      `);

      return {
        category: 'circle_triangle',
        catName: 'Теорема синусов',
        questionHtml: `
          <div class="task-text">В треугольнике <i>ABC</i> угол <i>C</i> равен <strong>${v.angle}°</strong>, <i>AB</i> = <strong>${sideText}</strong>. Найдите радиус окружности, описанной около этого треугольника.</div>
          ${svg}
        `.trim(),
        answer: v.R,
        displayAnswer: formatNum(v.R),
        solutionSteps: [
          `По теореме синусов: <i>R</i> = ${fracHtml('<i>AB</i>', '2 sin ∠<i>C</i>')}.`,
          `<i>R</i> = ${fracHtml(sideText, `2 · (${sinText})`)} = <strong>${v.R}</strong>.`
        ]
      };
    }

    // S = p * r (№356329)
    const P = randInt(12, 35) * 2;
    const extraSide = randInt(6, Math.floor(P / 2) - 2);
    const r = randInt(2, 8);
    const p = P / 2;
    const S = p * r;

    const svg = wrapSvg(`
      <polygon points="74,154 246,154 178,40" fill="${C.fillSoft}" stroke="${C.stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="165" cy="116" r="38" fill="none" stroke="${C.accent}" stroke-width="2.2"/>
    `);

    return {
      category: 'circle_triangle',
      catName: 'Площадь △ и вписанная окружность',
      questionHtml: `
        <div class="task-text">Периметр треугольника равен <strong>${P}</strong>, одна из сторон равна ${extraSide}, а радиус вписанной в него окружности равен <strong>${r}</strong>. Найдите площадь этого треугольника.</div>
        ${svg}
      `.trim(),
      answer: S,
      displayAnswer: formatNum(S),
      solutionSteps: [
        `Площадь треугольника равна произведению его полупериметра на радиус вписанной окружности: <i>S</i> = <i>p</i> · <i>r</i>.`,
        `Полупериметр: <i>p</i> = ${P} : 2 = ${p} (длина отдельной стороны ${extraSide} здесь лишнее данное).`,
        `<i>S</i> = ${p} · ${r} = <strong>${S}</strong>.`
      ]
    };
  }

  const GENERATORS = {
    central_inscribed: [genCentralInscribed, genDiameterTriangle, genTwoDiameters],
    tangents_secants_chords: [genTangentFromPoint, genTwoTangents, genTangentChordAngle, genTangentSecant, genChordLength],
    inscribed_quad: [genInscribedQuad, genTrapezoidInscribedCircle, genSquareAndCircle, genRectOrRhombusInCircle],
    circle_triangle: [genEquilateralCircle, genSineTheoremOrPr]
  };

  function generateTask(category = 'mixed_all') {
    const cat = String(category || 'mixed_all').trim();
    if (GENERATORS[cat]) {
      return pickRandom(GENERATORS[cat])();
    }
    const allGens = [
      ...GENERATORS.central_inscribed,
      ...GENERATORS.tangents_secants_chords,
      ...GENERATORS.inscribed_quad,
      ...GENERATORS.circle_triangle
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
