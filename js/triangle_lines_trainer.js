/**
 * Тренажёр по геометрии · 7 класс
 * «Задачи на биссектрису, медиану и высоту в треугольнике»
 *
 * Основано на классических задачах курса геометрии 7 класса (Атанасян, Мерзляк, ОГЭ).
 * Содержит параметрические генераторы с точным построением евклидовых координат
 * для SVG-чертежей, пошаговые разборы, проверку ответов и интеграцию с ДЗ.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const exported = factory();
    module.exports = exported;
    if (root) root.TriangleLinesTrainer = exported;
  } else {
    root.TriangleLinesTrainer = factory();
  }
}(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  const SVG_W = 340;
  const SVG_H = 225;

  const COLORS = {
    triFill: 'rgba(38, 63, 97, 0.06)',
    triStroke: '#263f61',
    height: '#b7464e',
    median: '#15803d',
    bisector: '#b45309',
    aux: '#64748b',
    ink: '#19273c',
    muted: '#475569'
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

  function deg2rad(d) {
    return (d * Math.PI) / 180;
  }

  function dist(p, q) {
    return Math.hypot(p.x - q.x, p.y - q.y);
  }

  function midpoint(p, q) {
    return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  }

  function projectOnLine(P, Q, R) {
    const dx = R.x - Q.x;
    const dy = R.y - Q.y;
    const len2 = dx * dx + dy * dy || 1;
    const t = ((P.x - Q.x) * dx + (P.y - Q.y) * dy) / len2;
    return { x: Q.x + t * dx, y: Q.y + t * dy };
  }

  function bisectorFoot(V, P, Q) {
    const vp = dist(V, P);
    const vq = dist(V, Q);
    const s = vp + vq || 1;
    return {
      x: (vq * P.x + vp * Q.x) / s,
      y: (vq * P.y + vp * Q.y) / s
    };
  }

  function lineIntersect(p1, p2, p3, p4) {
    const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(d) < 1e-9) return null;
    const a = p1.x * p2.y - p1.y * p2.x;
    const b = p3.x * p4.y - p3.y * p4.x;
    return {
      x: (a * (p3.x - p4.x) - (p1.x - p2.x) * b) / d,
      y: (a * (p3.y - p4.y) - (p1.y - p2.y) * b) / d
    };
  }

  /**
   * Построение треугольника ABC в экранной СК (ось Y вниз)
   * по углам A и C (в градусах). Сторона AC горизонтальна внизу.
   */
  function triangleFromAngles(angA, angC, baseLen) {
    const L = baseLen || 220;
    const radA = deg2rad(angA);
    const radC = deg2rad(angC);
    const radB = deg2rad(180 - angA - angC);
    const cLen = (L * Math.sin(radC)) / Math.sin(radB);
    const A = { x: 0, y: 0 };
    const C = { x: L, y: 0 };
    const B = {
      x: cLen * Math.cos(radA),
      y: -cLen * Math.sin(radA)
    };
    return fitTriangle(A, B, C);
  }

  /**
   * Построение треугольника ABC по длинам сторон a=BC, b=AC, c=AB
   * Сторона AC горизонтальна внизу.
   */
  function triangleFromSides(a, b, c) {
    const xB = (b * b + c * c - a * a) / (2 * b);
    const y2 = Math.max(0.01, c * c - xB * xB);
    const A = { x: 0, y: 0 };
    const C = { x: b, y: 0 };
    const B = { x: xB, y: -Math.sqrt(y2) };
    return fitTriangle(A, B, C);
  }

  /**
   * Построение прямоугольного треугольника ABC с прямым углом C = 90°
   * Гипотенуза AB горизонтальна внизу, вершина C сверху (удобно для медианы CM и высоты CH).
   */
  function rightTriangleHypBottom(angA) {
    const radA = deg2rad(angA);
    const AB = 220;
    const AC = AB * Math.cos(radA);
    const A = { x: 0, y: 0 };
    const B = { x: AB, y: 0 };
    const C = {
      x: AC * Math.cos(radA),
      y: -AC * Math.sin(radA)
    };
    return fitTriangle(A, B, C);
  }

  /**
   * Масштабирование и центрирование треугольника внутри SVG_W × SVG_H
   * с безопасными отступами для подписей вершин.
   */
  function fitTriangle(A, B, C) {
    const padX = 44;
    const padTop = 36;
    const padBottom = 38;
    const minX = Math.min(A.x, B.x, C.x);
    const maxX = Math.max(A.x, B.x, C.x);
    const minY = Math.min(A.y, B.y, C.y);
    const maxY = Math.max(A.y, B.y, C.y);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    const availW = SVG_W - 2 * padX;
    const availH = SVG_H - padTop - padBottom;
    const scale = Math.min(availW / spanX, availH / spanY);
    const drawW = spanX * scale;
    const drawH = spanY * scale;
    const offX = (SVG_W - drawW) / 2 - minX * scale;
    const offY = padTop + (availH - drawH) / 2 - minY * scale;

    const tx = (p) => ({
      x: Number((p.x * scale + offX).toFixed(2)),
      y: Number((p.y * scale + offY).toFixed(2))
    });
    return { A: tx(A), B: tx(B), C: tx(C) };
  }

  // =========================================================================
  // Вспомогательные SVG-примитивы
  // =========================================================================
  function fmtPt(p) {
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }

  function svgVertexLabel(V, P, Q, text, color, offsetDist) {
    const d1 = dist(V, P) || 1;
    const d2 = dist(V, Q) || 1;
    const ix = (P.x - V.x) / d1 + (Q.x - V.x) / d2;
    const iy = (P.y - V.y) / d1 + (Q.y - V.y) / d2;
    const il = Math.hypot(ix, iy) || 1;
    const ox = -ix / il;
    const oy = -iy / il;
    const r = offsetDist || 17;
    const lx = Math.max(12, Math.min(SVG_W - 12, V.x + ox * r));
    const ly = Math.max(15, Math.min(SVG_H - 10, V.y + oy * r + 4));
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="${color || COLORS.ink}">${text}</text>`;
  }

  function svgFootLabel(F, oppVertex, text, color, offsetDist) {
    const d = dist(F, oppVertex) || 1;
    const ox = (F.x - oppVertex.x) / d;
    const oy = (F.y - oppVertex.y) / d;
    const r = offsetDist || 16;
    const lx = Math.max(12, Math.min(SVG_W - 12, F.x + ox * r));
    const ly = Math.max(15, Math.min(SVG_H - 8, F.y + oy * r + 4));
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="13" font-weight="800" fill="${color || COLORS.ink}">${text}</text>`;
  }

  function svgRightAngle(foot, fromPt, sidePt, size, color) {
    const s = size || 10;
    const d1 = dist(foot, fromPt) || 1;
    const d2 = dist(foot, sidePt) || 1;
    const ux = (fromPt.x - foot.x) / d1;
    const uy = (fromPt.y - foot.y) / d1;
    const vx = (sidePt.x - foot.x) / d2;
    const vy = (sidePt.y - foot.y) / d2;
    const p1 = `${(foot.x + ux * s).toFixed(1)},${(foot.y + uy * s).toFixed(1)}`;
    const p2 = `${(foot.x + (ux + vx) * s).toFixed(1)},${(foot.y + (uy + vy) * s).toFixed(1)}`;
    const p3 = `${(foot.x + vx * s).toFixed(1)},${(foot.y + vy * s).toFixed(1)}`;
    return `<polyline points="${p1} ${p2} ${p3}" fill="none" stroke="${color || COLORS.height}" stroke-width="1.8"/>`;
  }

  function svgAngleArc(V, P, Q, radius, color, withTick) {
    const a1 = Math.atan2(P.y - V.y, P.x - V.x);
    const a2 = Math.atan2(Q.y - V.y, Q.x - V.x);
    let diff = a2 - a1;
    while (diff <= -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    const sweep = diff >= 0 ? 1 : 0;
    const r = radius || 22;
    const x1 = V.x + r * Math.cos(a1);
    const y1 = V.y + r * Math.sin(a1);
    const x2 = V.x + r * Math.cos(a2);
    const y2 = V.y + r * Math.sin(a2);
    let svg = `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${color || COLORS.bisector}" stroke-width="1.9"/>`;
    if (withTick) {
      const amid = a1 + diff / 2;
      const tx1 = V.x + (r - 3.5) * Math.cos(amid);
      const ty1 = V.y + (r - 3.5) * Math.sin(amid);
      const tx2 = V.x + (r + 3.5) * Math.cos(amid);
      const ty2 = V.y + (r + 3.5) * Math.sin(amid);
      svg += `<line x1="${tx1.toFixed(1)}" y1="${ty1.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="${color || COLORS.bisector}" stroke-width="1.7"/>`;
    }
    return svg;
  }

  function svgSegmentTicks(P, Q, count, color) {
    const m = midpoint(P, Q);
    const dx = Q.x - P.x;
    const dy = Q.y - P.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -dy / len;
    const ny = dx / len;
    const col = color || COLORS.median;
    const offsets = count === 2 ? [-2.5, 2.5] : [0];
    return offsets.map(off => {
      const cx = m.x + tx * off;
      const cy = m.y + ty * off;
      return `<line x1="${(cx - nx * 5).toFixed(1)}" y1="${(cy - ny * 5).toFixed(1)}" x2="${(cx + nx * 5).toFixed(1)}" y2="${(cy + ny * 5).toFixed(1)}" stroke="${col}" stroke-width="2"/>`;
    }).join('');
  }

  function wrapSvg(A, B, C, innerSvg, labelOverrides) {
    const lblA = (labelOverrides && labelOverrides.A) || 'A';
    const lblB = (labelOverrides && labelOverrides.B) || 'B';
    const lblC = (labelOverrides && labelOverrides.C) || 'C';
    return `
      <div class="tri-canvas-wrap" style="display:flex; justify-content:center; margin:14px 0 6px;">
        <svg width="${SVG_W}" height="${SVG_H}" viewBox="0 0 ${SVG_W} ${SVG_H}" class="tri-svg" role="img" aria-label="Геометрический чертёж треугольника" style="background:#ffffff; border-radius:12px; border:1px solid rgba(38,63,97,0.2); box-shadow:0 4px 14px rgba(38,63,97,0.07); max-width:100%; height:auto;">
          <polygon points="${fmtPt(A)} ${fmtPt(B)} ${fmtPt(C)}" fill="${COLORS.triFill}" stroke="${COLORS.triStroke}" stroke-width="2.4" stroke-linejoin="round"/>
          ${innerSvg}
          <circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="3.5" fill="${COLORS.triStroke}"/>
          <circle cx="${B.x.toFixed(1)}" cy="${B.y.toFixed(1)}" r="3.5" fill="${COLORS.triStroke}"/>
          <circle cx="${C.x.toFixed(1)}" cy="${C.y.toFixed(1)}" r="3.5" fill="${COLORS.triStroke}"/>
          ${svgVertexLabel(A, B, C, lblA, COLORS.ink)}
          ${svgVertexLabel(B, A, C, lblB, COLORS.ink)}
          ${svgVertexLabel(C, A, B, lblC, COLORS.ink)}
        </svg>
      </div>
    `.trim();
  }

  // =========================================================================
  // Сборка итогового объекта задачи
  // =========================================================================
  function formatNumDisplay(n) {
    const rounded = Math.round(n * 10000) / 10000;
    return String(rounded).replace('.', ',');
  }

  function buildTaskResult(cfg) {
    const numVal = Math.round(cfg.answer * 10000) / 10000;
    const numStr = String(numVal);
    const commaStr = formatNumDisplay(numVal);
    const unit = cfg.unit || '';
    const dAns = unit ? (unit === '°' ? `${commaStr}°` : `${commaStr} ${unit}`) : commaStr;

    const optionSet = new Set([dAns]);
    const cleanDistractors = [];

    for (const d of (cfg.distractors || [])) {
      const val = Number(d);
      if (!Number.isFinite(val) || val <= 0) continue;
      if (unit === '°' && val >= 180) continue;
      if (Math.abs(val - numVal) < 1e-6) continue;
      const dFormatted = unit ? (unit === '°' ? `${formatNumDisplay(val)}°` : `${formatNumDisplay(val)} ${unit}`) : formatNumDisplay(val);
      if (!optionSet.has(dFormatted)) {
        optionSet.add(dFormatted);
        cleanDistractors.push({ val, display: dFormatted });
      }
      if (cleanDistractors.length === 3) break;
    }

    let step = 2;
    while (cleanDistractors.length < 3) {
      const candidates = [numVal + step, numVal - step, numVal + step * 2, numVal + step + 1];
      for (const cand of candidates) {
        if (cand <= 0) continue;
        if (unit === '°' && cand >= 180) continue;
        if (Math.abs(cand - numVal) < 1e-6) continue;
        const cFormatted = unit ? (unit === '°' ? `${formatNumDisplay(cand)}°` : `${formatNumDisplay(cand)} ${unit}`) : formatNumDisplay(cand);
        if (!optionSet.has(cFormatted)) {
          optionSet.add(cFormatted);
          cleanDistractors.push({ val: cand, display: cFormatted });
          break;
        }
      }
      step += 2;
    }

    const allOptions = shuffle([
      { html: dAns, isCorrect: true, text: numStr },
      { html: cleanDistractors[0].display, isCorrect: false, text: String(cleanDistractors[0].val) },
      { html: cleanDistractors[1].display, isCorrect: false, text: String(cleanDistractors[1].val) },
      { html: cleanDistractors[2].display, isCorrect: false, text: String(cleanDistractors[2].val) }
    ]);

    const accepted = new Set([numStr, commaStr, dAns]);
    if (unit === '°') {
      accepted.add(`${numStr}°`);
      accepted.add(`${commaStr}°`);
      accepted.add(`${numStr} град`);
    } else if (unit) {
      accepted.add(`${numStr}${unit}`);
      accepted.add(`${commaStr}${unit}`);
      accepted.add(`${numStr} ${unit}`);
      accepted.add(`${commaStr} ${unit}`);
    }

    return {
      category: cfg.category,
      catName: cfg.catName,
      prompt: cfg.prompt,
      questionHtml: cfg.questionHtml,
      answer: numStr,
      displayAnswer: dAns,
      acceptedAnswers: Array.from(accepted),
      options: allOptions,
      correctOptionIndex: allOptions.findIndex(o => o.isCorrect),
      solutionSteps: cfg.solutionSteps,
      hint: cfg.hint,
      meta: cfg.meta
    };
  }

  // =========================================================================
  // КАТЕГОРИЯ 1: БИССЕКТРИСА ТРЕУГОЛЬНИКА
  // =========================================================================

  // Прототип 1: Биссектриса BD + сумма углов (прямая и с разностью углов)
  function genBisectorAngleSum() {
    const isDiffMode = Math.random() < 0.45;
    let angA, angB, angC;
    do {
      angA = randInt(24, 76);
      angC = randInt(24, 76);
      angB = 180 - angA - angC;
    } while (angB < 24 || angB > 120 || angB % 2 !== 0 || Math.abs(angA - angC) < 6);

    const halfB = angB / 2;
    const { A, B, C } = triangleFromAngles(angA, angC);
    const D = bisectorFoot(B, A, C);

    const inner = `
      <line x1="${B.x}" y1="${B.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.bisector}" stroke-width="2.4"/>
      <circle cx="${D.x}" cy="${D.y}" r="3.4" fill="${COLORS.bisector}"/>
      ${svgAngleArc(B, A, D, 24, COLORS.bisector, true)}
      ${svgAngleArc(B, D, C, 24, COLORS.bisector, true)}
      ${svgFootLabel(D, B, 'D', COLORS.bisector)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    if (!isDiffMode) {
      const questionHtml = `
        <div>В треугольнике $ABC$ проведена биссектриса $BD$. Известно, что $\\angle ABD = ${halfB}^\\circ$, а $\\angle A = ${angA}^\\circ$. Найдите $\\angle C$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'bisector',
        catName: 'Биссектриса треугольника',
        prompt: 'Найдите угол треугольника (ответ дайте в градусах):',
        questionHtml,
        answer: angC,
        unit: '°',
        distractors: [180 - halfB - angA, angA, angB, Math.abs(90 - angA)],
        solutionSteps: [
          `1. Биссектриса $BD$ делит угол $\\angle ABC$ пополам: $\\angle ABC = 2 \\cdot \\angle ABD = 2 \\cdot ${halfB}^\\circ = ${angB}^\\circ$.`,
          `2. Сумма углов треугольника $ABC$ равна $180^\\circ$: $\\angle A + \\angle ABC + \\angle C = 180^\\circ$.`,
          `3. Находим $\\angle C = 180^\\circ - ${angA}^\\circ - ${angB}^\\circ = \\mathbf{${angC}^\\circ}$.`
        ],
        hint: 'Сначала удвойте угол ABD, чтобы получить весь угол B, затем воспользуйтесь суммой углов треугольника (180°).',
        meta: { prototype: 'bisector_angle_sum_direct', A, B, C, D, angA, angB, angC }
      });
    } else {
      const diff = Math.abs(angC - angA);
      const cmpWord = angC > angA ? 'больше' : 'меньше';
      const questionHtml = `
        <div>В треугольнике $ABC$ проведена биссектриса $BD$. Известно, что $\\angle ABD = ${halfB}^\\circ$, а угол $\\angle C$ на $${diff}^\\circ$ ${cmpWord} угла $\\angle A$. Найдите $\\angle A$ (в градусах).</div>
        ${svgHtml}
      `;
      const sumAC = 180 - angB;
      const signStr = angC > angA ? '+' : '-';
      return buildTaskResult({
        category: 'bisector',
        catName: 'Биссектриса треугольника',
        prompt: 'Найдите угол A треугольника (ответ дайте в градусах):',
        questionHtml,
        answer: angA,
        unit: '°',
        distractors: [angC, sumAC / 2, angA + diff, Math.abs(180 - halfB - diff)],
        solutionSteps: [
          `1. Так как $BD$ — биссектриса, $\\angle ABC = 2 \\cdot ${halfB}^\\circ = ${angB}^\\circ$.`,
          `2. Сумма оставшихся углов: $\\angle A + \\angle C = 180^\\circ - ${angB}^\\circ = ${sumAC}^\\circ$.`,
          `3. Пусть $\\angle A = x$, тогда $\\angle C = x ${signStr} ${diff}^\\circ$. Составим уравнение: $x + (x ${signStr} ${diff}) = ${sumAC}$.`,
          `4. Получаем $2x = ${angC > angA ? sumAC - diff : sumAC + diff} \\implies \\angle A = \\mathbf{${angA}^\\circ}$.`
        ],
        hint: 'Найдите ∠ABC = 2·∠ABD, затем выразите сумму ∠A + ∠C и составьте уравнение с x.',
        meta: { prototype: 'bisector_angle_sum_diff', A, B, C, D, angA, angB, angC }
      });
    }
  }

  // Прототип 2: Пересечение двух биссектрис (угол AOB = 90 + C/2)
  function genBisectorTwoIntersection() {
    const isReverse = Math.random() < 0.45;
    let angA, angB, angC;
    do {
      angC = randInt(16, 62) * 2; // чётный от 32 до 124
      angA = randInt(20, 180 - angC - 20);
      angB = 180 - angA - angC;
    } while (angA < 20 || angB < 20);

    const angAOB = 90 + angC / 2;
    const { A, B, C } = triangleFromAngles(angA, angC);
    const D = bisectorFoot(A, B, C);
    const E = bisectorFoot(B, A, C);
    const O = lineIntersect(A, D, B, E);

    const inner = `
      <line x1="${A.x}" y1="${A.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.bisector}" stroke-width="2.2"/>
      <line x1="${B.x}" y1="${B.y}" x2="${E.x}" y2="${E.y}" stroke="${COLORS.bisector}" stroke-width="2.2"/>
      <circle cx="${O.x}" cy="${O.y}" r="4.2" fill="${COLORS.height}" stroke="#fff" stroke-width="1.2"/>
      ${svgAngleArc(A, B, D, 20, COLORS.bisector, true)}
      ${svgAngleArc(A, D, C, 20, COLORS.bisector, true)}
      ${svgAngleArc(B, A, E, 22, '#0284c7', true)}
      ${svgAngleArc(B, E, C, 22, '#0284c7', true)}
      ${svgFootLabel(D, A, 'D', COLORS.bisector)}
      ${svgFootLabel(E, B, 'E', COLORS.bisector)}
      <text x="${(O.x + 11).toFixed(1)}" y="${(O.y - 6).toFixed(1)}" font-size="13" font-weight="800" fill="${COLORS.height}">O</text>
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    if (!isReverse) {
      const questionHtml = `
        <div>В треугольнике $ABC$ биссектрисы $AD$ и $BE$ пересекаются в точке $O$. Найдите тупой угол $\\angle AOB$, если $\\angle C = ${angC}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'bisector',
        catName: 'Биссектриса треугольника',
        prompt: 'Найдите угол между биссектрисами (в градусах):',
        questionHtml,
        answer: angAOB,
        unit: '°',
        distractors: [180 - angC, 90 + angC, 180 - angC / 2, 90 - angC / 2],
        solutionSteps: [
          `1. В $\\triangle ABC$ сумма углов $\\angle A + \\angle B = 180^\\circ - \\angle C = 180^\\circ - ${angC}^\\circ = ${180 - angC}^\\circ$.`,
          `2. Так как $AD$ и $BE$ — биссектрисы, сумма половинок этих углов в $\\triangle AOB$: $\\angle OAB + \\angle OBA = \\frac{\\angle A + \\angle B}{2} = \\frac{${180 - angC}^\\circ}{2} = ${90 - angC / 2}^\\circ$.`,
          `3. Из $\\triangle AOB$ находим: $\\angle AOB = 180^\\circ - ${90 - angC / 2}^\\circ = \\mathbf{${angAOB}^\\circ}$.`
        ],
        hint: 'Выразите сумму (∠A + ∠B) через ∠C, разделите её пополам и рассмотрите треугольник AOB.',
        meta: { prototype: 'bisector_two_direct', A, B, C, O, angA, angB, angC }
      });
    } else {
      const questionHtml = `
        <div>В треугольнике $ABC$ биссектрисы $AD$ и $BE$ пересекаются в точке $O$. Известно, что $\\angle AOB = ${angAOB}^\\circ$. Найдите угол $\\angle C$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'bisector',
        catName: 'Биссектриса треугольника',
        prompt: 'Найдите угол C треугольника (в градусах):',
        questionHtml,
        answer: angC,
        unit: '°',
        distractors: [180 - angAOB, angAOB - 90, 2 * (180 - angAOB), angC / 2],
        solutionSteps: [
          `1. В $\\triangle AOB$ сумма углов при основании $AB$: $\\angle OAB + \\angle OBA = 180^\\circ - \\angle AOB = 180^\\circ - ${angAOB}^\\circ = ${180 - angAOB}^\\circ$.`,
          `2. Так как $AD$ и $BE$ — биссектрисы, $\\angle A + \\angle B = 2(\\angle OAB + \\angle OBA) = 2 \\cdot ${180 - angAOB}^\\circ = ${180 - angC}^\\circ$.`,
          `3. Находим угол треугольника: $\\angle C = 180^\\circ - ${180 - angC}^\\circ = \\mathbf{${angC}^\\circ}$.`
        ],
        hint: 'Найдите сумму углов ∠OAB + ∠OBA в треугольнике AOB, затем удвойте её, чтобы получить ∠A + ∠B.',
        meta: { prototype: 'bisector_two_reverse', A, B, C, O, angA, angB, angC }
      });
    }
  }

  // Прототип 3: Угол, который биссектриса образует с противоположной стороной
  function genBisectorOppositeSide() {
    let angA, angB, angC;
    do {
      angA = randInt(28, 78);
      angC = randInt(28, 78);
      angB = 180 - angA - angC;
    } while (angB < 24 || angB % 2 !== 0 || Math.abs(angA - angC) < 8);

    const askBDC = Math.random() < 0.5;
    const halfB = angB / 2;
    const angBDC = 180 - angC - halfB;
    const angADB = 180 - angA - halfB;
    const ans = askBDC ? angBDC : angADB;
    const targetName = askBDC ? '\\angle BDC' : '\\angle ADB';

    const { A, B, C } = triangleFromAngles(angA, angC);
    const D = bisectorFoot(B, A, C);

    const inner = `
      <line x1="${B.x}" y1="${B.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.bisector}" stroke-width="2.4"/>
      <circle cx="${D.x}" cy="${D.y}" r="3.4" fill="${COLORS.bisector}"/>
      ${svgAngleArc(B, A, D, 23, COLORS.bisector, true)}
      ${svgAngleArc(B, D, C, 23, COLORS.bisector, true)}
      ${svgAngleArc(D, B, askBDC ? C : A, 18, COLORS.height, false)}
      ${svgFootLabel(D, B, 'D', COLORS.bisector)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const questionHtml = `
      <div>В треугольнике $ABC$ проведена биссектриса $BD$. Известно, что $\\angle A = ${angA}^\\circ$, $\\angle C = ${angC}^\\circ$. Найдите угол $${targetName}$ (в градусах).</div>
      ${svgHtml}
    `;

    return buildTaskResult({
      category: 'bisector',
      catName: 'Биссектриса треугольника',
      prompt: 'Найдите угол при основании биссектрисы (в градусах):',
      questionHtml,
      answer: ans,
      unit: '°',
      distractors: [askBDC ? angADB : angBDC, halfB, angB, 180 - (askBDC ? angC : angA) - angB],
      solutionSteps: [
        `1. Найдём угол при вершине $B$: $\\angle ABC = 180^\\circ - (${angA}^\\circ + ${angC}^\\circ) = ${angB}^\\circ$.`,
        `2. Биссектриса $BD$ делит $\\angle ABC$ пополам: $\\angle ABD = \\angle CBD = \\frac{${angB}^\\circ}{2} = ${halfB}^\\circ$.`,
        askBDC
          ? `3. В $\\triangle BDC$: $\\angle BDC = 180^\\circ - \\angle C - \\angle CBD = 180^\\circ - ${angC}^\\circ - ${halfB}^\\circ = \\mathbf{${angBDC}^\\circ}$.`
          : `3. В $\\triangle ABD$: $\\angle ADB = 180^\\circ - \\angle A - \\angle ABD = 180^\\circ - ${angA}^\\circ - ${halfB}^\\circ = \\mathbf{${angADB}^\\circ}$.`
      ],
      hint: 'Найдите весь угол B по сумме углов треугольника, разделите его на 2 и рассмотрите нужный малый треугольник.',
      meta: { prototype: 'bisector_opposite_side', A, B, C, D, angA, angB, angC, askBDC }
    });
  }

  // =========================================================================
  // КАТЕГОРИЯ 2: МЕДИАНА ТРЕУГОЛЬНИКА
  // =========================================================================

  // Прототип 4: Периметры в равнобедренном треугольнике с медианой к основанию (Пифагоровы тройки)
  function genMedianIsoscelesPerimeters() {
    // Тройки (k = AC/2, m = BD, a = AB=BC), где k^2 + m^2 = a^2
    const triples = [
      [3, 4, 5], [4, 3, 5],
      [6, 8, 10], [8, 6, 10],
      [5, 12, 13], [12, 5, 13],
      [8, 15, 17], [15, 8, 17],
      [9, 12, 15], [12, 9, 15],
      [7, 24, 25], [10, 24, 26],
      [12, 16, 20], [16, 12, 20]
    ];
    const [k0, m0, a0] = pickRandom(triples);
    const scale = (a0 <= 13 && Math.random() < 0.45) ? 2 : 1;
    const k = k0 * scale;
    const m = m0 * scale;
    const a = a0 * scale;
    const base = 2 * k;
    const pABC = 2 * a + base;
    const pABD = a + k + m;

    const { A, B, C } = triangleFromSides(a, base, a);
    const D = midpoint(A, C);

    const inner = `
      <line x1="${B.x}" y1="${B.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.median}" stroke-width="2.4"/>
      <circle cx="${D.x}" cy="${D.y}" r="3.4" fill="${COLORS.median}"/>
      ${svgSegmentTicks(A, D, 1, COLORS.median)}
      ${svgSegmentTicks(D, C, 1, COLORS.median)}
      ${svgFootLabel(D, B, 'D', COLORS.median)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const isReverse = Math.random() < 0.35;
    if (!isReverse) {
      const questionHtml = `
        <div>В равнобедренном треугольнике $ABC$ ($AB = BC$) проведена медиана $BD$ к основанию $AC$. Периметр $\\triangle ABC$ равен $${pABC}$ см, а периметр $\\triangle ABD$ равен $${pABD}$ см. Найдите длину медианы $BD$ (в см).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'median',
        catName: 'Медиана треугольника',
        prompt: 'Найдите длину медианы BD (в см):',
        questionHtml,
        answer: m,
        unit: 'см',
        distractors: [pABC - pABD, 2 * pABD - pABC, pABD - pABC / 4, m + 2],
        solutionSteps: [
          `1. Так как $AB = BC$ и $BD$ — медиана, то $AD = DC = \\frac{AC}{2}$.`,
          `2. Периметр большого треугольника: $P_{\\triangle ABC} = AB + BC + AC = 2AB + 2AD = 2(AB + AD) = ${pABC}$ см.`,
          `3. Отсюда сумма $AB + AD = \\frac{${pABC}}{2} = ${pABC / 2}$ см.`,
          `4. Так как $P_{\\triangle ABD} = (AB + AD) + BD = ${pABD}$ см, то $BD = ${pABD} - ${pABC / 2} = \\mathbf{${m}}$ см.`
        ],
        hint: 'Выразите полупериметр треугольника ABC как сумму AB + AD и вычтите её из периметра треугольника ABD.',
        meta: { prototype: 'median_iso_perim_find_m', A, B, C, D, a, base, m, pABC, pABD }
      });
    } else {
      const questionHtml = `
        <div>В равнобедренном треугольнике $ABC$ ($AB = BC$) к основанию $AC$ проведена медиана $BD = ${m}$ см. Найдите периметр $\\triangle ABD$ (в см), если периметр $\\triangle ABC$ равен $${pABC}$ см.</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'median',
        catName: 'Медиана треугольника',
        prompt: 'Найдите периметр треугольника ABD (в см):',
        questionHtml,
        answer: pABD,
        unit: 'см',
        distractors: [pABC / 2, pABC / 2 + 2 * m, pABC - m, pABD + 4],
        solutionSteps: [
          `1. В равнобедренном $\\triangle ABC$ ($AB = BC$) медиана $BD$ делит основание пополам: $AD = \\frac{AC}{2}$.`,
          `2. Значит $AB + AD = \\frac{P_{\\triangle ABC}}{2} = \\frac{${pABC}}{2} = ${pABC / 2}$ см.`,
          `3. Прибавим медиану $BD$: $P_{\\triangle ABD} = (AB + AD) + BD = ${pABC / 2} + ${m} = \\mathbf{${pABD}}$ см.`
        ],
        hint: 'Разделите периметр большого треугольника на 2, чтобы получить AB + AD, и прибавьте длину медианы.',
        meta: { prototype: 'median_iso_perim_find_p', A, B, C, D, a, base, m, pABC, pABD }
      });
    }
  }

  // Прототип 5: Разность периметров частей треугольника, разделённых медианой
  function genMedianPerimeterDiff() {
    let a, b, c;
    do {
      a = randInt(6, 16);
      c = a + randInt(3, 9);
      b = randInt(Math.max(6, c - a + 2), a + c - 2);
    } while (b % 2 !== 0 || a + b <= c || a + c <= b || b + c <= a);

    const diff = c - a;
    const { A, B, C } = triangleFromSides(a, b, c);
    const M = midpoint(A, C);

    const inner = `
      <line x1="${B.x}" y1="${B.y}" x2="${M.x}" y2="${M.y}" stroke="${COLORS.median}" stroke-width="2.4"/>
      <circle cx="${M.x}" cy="${M.y}" r="3.4" fill="${COLORS.median}"/>
      ${svgSegmentTicks(A, M, 1, COLORS.median)}
      ${svgSegmentTicks(M, C, 1, COLORS.median)}
      ${svgFootLabel(M, B, 'M', COLORS.median)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const isReverse = Math.random() < 0.45;
    if (!isReverse) {
      const questionHtml = `
        <div>В треугольнике $ABC$ проведена медиана $BM$ к стороне $AC$. Известно, что $AB = ${c}$ см, $BC = ${a}$ см, $AC = ${b}$ см. На сколько сантиметров периметр $\\triangle ABM$ больше периметра $\\triangle CBM$?</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'median',
        catName: 'Медиана треугольника',
        prompt: 'Найдите разность периметров треугольников ABM и CBM (в см):',
        questionHtml,
        answer: diff,
        unit: 'см',
        distractors: [c + a, b - a, diff * 2, Math.abs(b - c)],
        solutionSteps: [
          `1. Запишем периметры обоих треугольников: $P_{\\triangle ABM} = AB + BM + AM$ и $P_{\\triangle CBM} = BC + BM + CM$.`,
          `2. Так как $BM$ — медиана, то $AM = CM$, а сторона $BM$ — общая.`,
          `3. При вычитании равные слагаемые $BM$ и $AM = CM$ сокращаются: $P_{\\triangle ABM} - P_{\\triangle CBM} = AB - BC = ${c} - ${a} = \\mathbf{${diff}}$ см.`
        ],
        hint: 'Вычтите периметры почленно: медиана BM общая, а половины стороны AC равны.',
        meta: { prototype: 'median_perim_diff_direct', A, B, C, M, a, b, c }
      });
    } else {
      const questionHtml = `
        <div>В треугольнике $ABC$ медиана $BM$ делит его на два треугольника так, что периметр $\\triangle ABM$ на $${diff}$ см больше периметра $\\triangle CBM$. Найдите сторону $AB$ (в см), если $BC = ${a}$ см.</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'median',
        catName: 'Медиана треугольника',
        prompt: 'Найдите длину стороны AB (в см):',
        questionHtml,
        answer: c,
        unit: 'см',
        distractors: [a - diff > 0 ? a - diff : a + diff * 2, a + diff / 2, 2 * diff, c + 2],
        solutionSteps: [
          `1. $P_{\\triangle ABM} - P_{\\triangle CBM} = (AB + BM + AM) - (BC + BM + CM)$.`,
          `2. Поскольку $BM$ — медиана, $AM = CM$, поэтому разность периметров равна $AB - BC$.`,
          `3. Получаем $AB - ${a} = ${diff} \\implies AB = ${a} + ${diff} = \\mathbf{${c}}$ см.`
        ],
        hint: 'Разность периметров треугольников ABM и CBM равна разности сторон AB и BC.',
        meta: { prototype: 'median_perim_diff_reverse', A, B, C, M, a, b, c }
      });
    }
  }

  // Прототип 6: Медиана к гипотенузе прямоугольного треугольника (длина и углы)
  function genMedianRightHypotenuse() {
    const isLengthMode = Math.random() < 0.45;
    const angA = pickRandom([24, 26, 28, 32, 34, 36, 38, 40, 52, 54, 56, 58, 62, 64]);
    const angB = 90 - angA;
    const { A, B, C } = rightTriangleHypBottom(angA);
    const M = midpoint(A, B);

    const inner = `
      <line x1="${C.x}" y1="${C.y}" x2="${M.x}" y2="${M.y}" stroke="${COLORS.median}" stroke-width="2.4"/>
      <circle cx="${M.x}" cy="${M.y}" r="3.4" fill="${COLORS.median}"/>
      ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
      ${svgSegmentTicks(A, M, 1, COLORS.median)}
      ${svgSegmentTicks(M, B, 1, COLORS.median)}
      ${svgFootLabel(M, C, 'M', COLORS.median)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    if (isLengthMode) {
      const cm = randInt(5, 22);
      const ab = 2 * cm;
      const findCM = Math.random() < 0.5;
      if (findCM) {
        const questionHtml = `
          <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) проведена медиана $CM$ к гипотенузе $AB = ${ab}$ см. Найдите длину медианы $CM$ (в см).</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'median',
          catName: 'Медиана прямоугольного △',
          prompt: 'Найдите длину медианы CM (в см):',
          questionHtml,
          answer: cm,
          unit: 'см',
          distractors: [ab, ab * 2, cm + 2, cm - 1 > 0 ? cm - 1 : cm + 4],
          solutionSteps: [
            `1. По теореме о медиане прямоугольного треугольника медиана, проведённая к гипотенузе, равна её половине.`,
            `2. $CM = \\frac{AB}{2} = \\frac{${ab}}{2} = \\mathbf{${cm}}$ см.`
          ],
          hint: 'Вспомните свойство: медиана прямоугольного треугольника, проведённая к гипотенузе, равна её половине.',
          meta: { prototype: 'median_right_len_cm', A, B, C, M, ab, cm, angA }
        });
      } else {
        const questionHtml = `
          <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) медиана $CM$, проведённая к гипотенузе $AB$, равна $${cm}$ см. Найдите длину гипотенузы $AB$ (в см).</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'median',
          catName: 'Медиана прямоугольного △',
          prompt: 'Найдите длину гипотенузы AB (в см):',
          questionHtml,
          answer: ab,
          unit: 'см',
          distractors: [cm, cm * 3, cm / 2, ab + 4],
          solutionSteps: [
            `1. Медиана прямоугольного треугольника, проведённая к гипотенузе, равна половине гипотенузы ($CM = \\frac{AB}{2}$).`,
            `2. Отсюда $AB = 2 \\cdot CM = 2 \\cdot ${cm} = \\mathbf{${ab}}$ см.`
          ],
          hint: 'Гипотенуза в два раза длиннее проведённой к ней медианы.',
          meta: { prototype: 'median_right_len_ab', A, B, C, M, ab, cm, angA }
        });
      }
    } else {
      const subType = pickRandom(['ACM', 'BCM', 'BMC']);
      let targetLatex, ans, steps;
      if (subType === 'ACM') {
        targetLatex = '\\angle ACM';
        ans = angA;
        steps = [
          `1. Медиана $CM$ к гипотенузе равна её половине: $CM = AM = BM$.`,
          `2. Значит $\\triangle AMC$ — равнобедренный ($AM = CM$), а углы при основании $AC$ равны: $\\angle ACM = \\angle A = \\mathbf{${angA}^\\circ}$.`
        ];
      } else if (subType === 'BCM') {
        targetLatex = '\\angle BCM';
        ans = angB;
        steps = [
          `1. Медиана $CM$ равна половине гипотенузы: $CM = AM$, поэтому $\\triangle AMC$ — равнобедренный и $\\angle ACM = \\angle A = ${angA}^\\circ$.`,
          `2. Так как $\\angle ACB = 90^\\circ$, то $\\angle BCM = 90^\\circ - ${angA}^\\circ = \\mathbf{${angB}^\\circ}$.`
        ];
      } else {
        targetLatex = '\\angle BMC';
        ans = 2 * angA;
        steps = [
          `1. Медиана $CM$ равна половине гипотенузы: $CM = AM$, значит $\\triangle AMC$ — равнобедренный и $\\angle ACM = \\angle A = ${angA}^\\circ$.`,
          `2. Внешний угол $\\angle BMC$ треугольника $AMC$ равен сумме двух внутренних углов, не смежных с ним: $\\angle BMC = \\angle A + \\angle ACM = ${angA}^\\circ + ${angA}^\\circ = \\mathbf{${2 * angA}^\\circ}$.`
        ];
      }
      const questionHtml = `
        <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) проведена медиана $CM$ к гипотенузе $AB$. Найдите угол $${targetLatex}$, если $\\angle A = ${angA}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'median',
        catName: 'Медиана прямоугольного △',
        prompt: 'Найдите угол при медиане (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [angA, angB, 2 * angA, 45, 180 - 2 * angA],
        solutionSteps: steps,
        hint: 'Используйте равенство CM = AM = BM: треугольники AMC и BMC являются равнобедренными.',
        meta: { prototype: `median_right_ang_${subType}`, A, B, C, M, angA, angB }
      });
    }
  }

  // =========================================================================
  // КАТЕГОРИЯ 3: ВЫСОТА ТРЕУГОЛЬНИКА
  // =========================================================================

  // Прототип 7: Углы, образуемые высотой в остроугольном треугольнике
  function genHeightAcuteAngle() {
    let angA, angC, angB;
    do {
      angA = randInt(32, 74);
      angC = randInt(32, 74);
      angB = 180 - angA - angC;
    } while (angB < 32 || angB > 84 || Math.abs(angA - angC) < 6);

    const angABH = 90 - angA;
    const angCBH = 90 - angC;
    const { A, B, C } = triangleFromAngles(angA, angC);
    const H = projectOnLine(B, A, C);

    const inner = `
      <line x1="${B.x}" y1="${B.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.4"/>
      <circle cx="${H.x}" cy="${H.y}" r="3.4" fill="${COLORS.height}"/>
      ${svgRightAngle(H, B, C, 10, COLORS.height)}
      ${svgFootLabel(H, B, 'H', COLORS.height)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const mode = pickRandom(['find_ABH', 'find_ABC', 'find_A']);
    if (mode === 'find_ABH') {
      const questionHtml = `
        <div>В остроугольном треугольнике $ABC$ проведена высота $BH$ к стороне $AC$. Известно, что $\\angle A = ${angA}^\\circ$. Найдите $\\angle ABH$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота треугольника',
        prompt: 'Найдите угол ABH (в градусах):',
        questionHtml,
        answer: angABH,
        unit: '°',
        distractors: [angA, 180 - angA, angABH + 10, Math.abs(angA - 45)],
        solutionSteps: [
          `1. Так как $BH$ — высота, то $\\angle AHB = 90^\\circ$, треугольник $ABH$ — прямоугольный.`,
          `2. Сумма острых углов прямоугольного треугольника равна $90^\\circ$.`,
          `3. $\\angle ABH = 90^\\circ - \\angle A = 90^\\circ - ${angA}^\\circ = \\mathbf{${angABH}^\\circ}$.`
        ],
        hint: 'Рассмотрите прямоугольный треугольник ABH, где ∠AHB = 90°.',
        meta: { prototype: 'height_acute_find_ABH', A, B, C, H, angA, angB, angC }
      });
    } else if (mode === 'find_ABC') {
      const questionHtml = `
        <div>В остроугольном треугольнике $ABC$ проведена высота $BH$ к стороне $AC$. Известно, что $\\angle A = ${angA}^\\circ$, $\\angle C = ${angC}^\\circ$. Найдите сумму углов $\\angle ABH + \\angle CBH$ (или угол $\\angle ABC$) в градусах.</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота треугольника',
        prompt: 'Найдите угол ABC (в градусах):',
        questionHtml,
        answer: angB,
        unit: '°',
        distractors: [angABH, angCBH, 90 - angB > 0 ? 90 - angB : angB + 12, angA + angC],
        solutionSteps: [
          `1. Из прямоугольного $\\triangle ABH$: $\\angle ABH = 90^\\circ - ${angA}^\\circ = ${angABH}^\\circ$.`,
          `2. Из прямоугольного $\\triangle CBH$: $\\angle CBH = 90^\\circ - ${angC}^\\circ = ${angCBH}^\\circ$.`,
          `3. Поскольку высота лежит внутри остроугольного треугольника, $\\angle ABC = \\angle ABH + \\angle CBH = ${angABH}^\\circ + ${angCBH}^\\circ = \\mathbf{${angB}^\\circ}$.`
        ],
        hint: 'Найдите острые углы ∠ABH и ∠CBH из двух прямоугольных треугольников и сложите их (или проверьте через сумму углов △ABC).',
        meta: { prototype: 'height_acute_find_ABC', A, B, C, H, angA, angB, angC }
      });
    } else {
      const questionHtml = `
        <div>В треугольнике $ABC$ высота $BH$ образует со стороной $AB$ угол $\\angle ABH = ${angABH}^\\circ$, а точка $H$ лежит на отрезке $AC$. Найдите угол $\\angle A$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота треугольника',
        prompt: 'Найдите угол A (в градусах):',
        questionHtml,
        answer: angA,
        unit: '°',
        distractors: [angABH, 180 - angABH, 45, angA + 10],
        solutionSteps: [
          `1. Треугольник $ABH$ прямоугольный ($\\angle AHB = 90^\\circ$).`,
          `2. Сумма острых углов равна $90^\\circ$: $\\angle A = 90^\\circ - \\angle ABH = 90^\\circ - ${angABH}^\\circ = \\mathbf{${angA}^\\circ}$.`
        ],
        hint: 'В прямоугольном треугольнике ABH сумма острых углов ∠A + ∠ABH равна 90°.',
        meta: { prototype: 'height_acute_find_A', A, B, C, H, angA, angB, angC }
      });
    }
  }

  // Прототип 8: Угол между двумя высотами остроугольного треугольника
  function genHeightTwoOrthocenter() {
    let angA, angB, angC;
    do {
      angA = randInt(38, 76);
      angB = randInt(38, 76);
      angC = 180 - angA - angB;
    } while (angC < 34 || angC > 82);

    const angAHB = 180 - angC;
    const { A, B, C } = triangleFromAngles(angA, angC);
    const D = projectOnLine(A, B, C);
    const E = projectOnLine(B, A, C);
    const H = lineIntersect(A, D, B, E);

    const inner = `
      <line x1="${A.x}" y1="${A.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.height}" stroke-width="2.2"/>
      <line x1="${B.x}" y1="${B.y}" x2="${E.x}" y2="${E.y}" stroke="${COLORS.height}" stroke-width="2.2"/>
      <circle cx="${H.x}" cy="${H.y}" r="4.2" fill="${COLORS.height}" stroke="#fff" stroke-width="1.2"/>
      ${svgRightAngle(D, A, C, 9, COLORS.height)}
      ${svgRightAngle(E, B, C, 9, COLORS.height)}
      ${svgFootLabel(D, A, 'D', COLORS.height)}
      ${svgFootLabel(E, B, 'E', COLORS.height)}
      <text x="${(H.x - 13).toFixed(1)}" y="${(H.y - 6).toFixed(1)}" font-size="13" font-weight="800" fill="${COLORS.height}">H</text>
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const useTwoAngles = Math.random() < 0.45;
    if (!useTwoAngles) {
      const questionHtml = `
        <div>В остроугольном треугольнике $ABC$ проведены высоты $AD$ и $BE$, пересекающиеся в точке $H$. Найдите угол $\\angle AHB$, если $\\angle C = ${angC}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота треугольника',
        prompt: 'Найдите тупой угол между высотами ∠AHB (в градусах):',
        questionHtml,
        answer: angAHB,
        unit: '°',
        distractors: [angC, 90 + angC / 2, 90 + angC > 180 ? 90 - angC / 2 : 90 + angC, 180 - 2 * angC > 0 ? 180 - 2 * angC : angC + 20],
        solutionSteps: [
          `1. Рассмотрим четырёхугольник $CDHE$: $\\angle CDH = 90^\\circ$ и $\\angle CEH = 90^\\circ$ (так как $AD$ и $BE$ — высоты).`,
          `2. Сумма углов четырёхугольника равна $360^\\circ$, значит $\\angle DHE = 360^\\circ - 90^\\circ - 90^\\circ - \\angle C = 180^\\circ - ${angC}^\\circ = ${angAHB}^\\circ$.`,
          `3. Углы $\\angle AHB$ и $\\angle DHE$ вертикальные, поэтому $\\angle AHB = \\mathbf{${angAHB}^\\circ}$.`
        ],
        hint: 'Рассмотрите четырёхугольник CDHE (два угла по 90°) и воспользуйтесь тем, что ∠AHB и ∠DHE — вертикальные.',
        meta: { prototype: 'height_ortho_from_C', A, B, C, H, angA, angB, angC }
      });
    } else {
      const questionHtml = `
        <div>В остроугольном треугольнике $ABC$ проведены высоты $AD$ и $BE$, пересекающиеся в точке $H$. Известно, что $\\angle A = ${angA}^\\circ$, $\\angle B = ${angB}^\\circ$. Найдите угол $\\angle AHB$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота треугольника',
        prompt: 'Найдите угол AHB (в градусах):',
        questionHtml,
        answer: angAHB,
        unit: '°',
        distractors: [angC, 180 - angA, 180 - angB, 90 + angC / 2],
        solutionSteps: [
          `1. Найдём третий угол треугольника: $\\angle C = 180^\\circ - (${angA}^\\circ + ${angB}^\\circ) = ${angC}^\\circ$.`,
          `2. В четырёхугольнике $CDHE$ углы при вершинах $D$ и $E$ прямые ($90^\\circ$), значит $\\angle DHE = 180^\\circ - \\angle C = 180^\\circ - ${angC}^\\circ = ${angAHB}^\\circ$.`,
          `3. Как вертикальный ему, $\\angle AHB = \\angle DHE = \\mathbf{${angAHB}^\\circ}$.`
        ],
        hint: 'Сначала найдите ∠C из суммы углов треугольника, затем рассмотрите четырёхугольник CDHE.',
        meta: { prototype: 'height_ortho_from_AB', A, B, C, H, angA, angB, angC }
      });
    }
  }

  // Прототип 9: Высота из прямого угла (углы + катет против 30°)
  function genHeightRightTriangle() {
    const isSeg30 = Math.random() < 0.45;
    if (!isSeg30) {
      let angA;
      do {
        angA = randInt(20, 70);
      } while (Math.abs(angA - 45) < 5);
      const angB = 90 - angA;
      const { A, B, C } = rightTriangleHypBottom(angA);
      const H = projectOnLine(C, A, B);

      const inner = `
        <line x1="${C.x}" y1="${C.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.4"/>
        <circle cx="${H.x}" cy="${H.y}" r="3.4" fill="${COLORS.height}"/>
        ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
        ${svgRightAngle(H, C, A, 9, COLORS.height)}
        ${svgFootLabel(H, C, 'H', COLORS.height)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);

      const askBCH = Math.random() < 0.5;
      const ans = askBCH ? angA : angB;
      const target = askBCH ? '\\angle BCH' : '\\angle ACH';

      const questionHtml = `
        <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) проведена высота $CH$ к гипотенузе $AB$. Известно, что $\\angle A = ${angA}^\\circ$. Найдите $${target}$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'height',
        catName: 'Высота прямоугольного △',
        prompt: 'Найдите острый угол при высоте (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [askBCH ? angB : angA, 45, Math.abs(angB - angA), 90],
        solutionSteps: askBCH
          ? [
              `1. В прямоугольном $\\triangle ABC$: $\\angle B = 90^\\circ - \\angle A = 90^\\circ - ${angA}^\\circ = ${angB}^\\circ$.`,
              `2. В прямоугольном $\\triangle BCH$ ($\\angle BHC = 90^\\circ$): $\\angle BCH = 90^\\circ - \\angle B = 90^\\circ - ${angB}^\\circ = \\mathbf{${angA}^\\circ}$.`
            ]
          : [
              `1. В прямоугольном $\\triangle ACH$ ($\\angle AHC = 90^\\circ$) сумма острых углов равна $90^\\circ$.`,
              `2. Поэтому $\\angle ACH = 90^\\circ - \\angle A = 90^\\circ - ${angA}^\\circ = \\mathbf{${angB}^\\circ}$.`
            ],
        hint: 'Найдите углы прямоугольных треугольников ACH и BCH через 90° − острый угол.',
        meta: { prototype: 'height_right_angles', A, B, C, H, angA, angB, askBCH }
      });
    } else {
      const bh = randInt(3, 14);
      const bc = 2 * bh;
      const ab = 4 * bh;
      const { A, B, C } = rightTriangleHypBottom(30);
      const H = projectOnLine(C, A, B);

      const inner = `
        <line x1="${C.x}" y1="${C.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.4"/>
        <circle cx="${H.x}" cy="${H.y}" r="3.4" fill="${COLORS.height}"/>
        ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
        ${svgRightAngle(H, C, A, 9, COLORS.height)}
        ${svgFootLabel(H, C, 'H', COLORS.height)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);

      const findBH = Math.random() < 0.6;
      if (findBH) {
        const questionHtml = `
          <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$, $\\angle A = 30^\\circ$) проведена высота $CH$ к гипотенузе $AB = ${ab}$ см. Найдите длину отрезка $BH$ (в см).</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'height',
          catName: 'Высота прямоугольного △',
          prompt: 'Найдите длину отрезка BH (в см):',
          questionHtml,
          answer: bh,
          unit: 'см',
          distractors: [bc, ab / 3, bh * 3, bh + 3],
          solutionSteps: [
            `1. В $\\triangle ABC$ катет $BC$ лежит против угла $\\angle A = 30^\\circ$, значит $BC = \\frac{AB}{2} = \\frac{${ab}}{2} = ${bc}$ см.`,
            `2. Так как $\\angle B = 90^\\circ - 30^\\circ = 60^\\circ$, в прямоугольном $\\triangle BCH$ имеем $\\angle BCH = 90^\\circ - 60^\\circ = 30^\\circ$.`,
            `3. В $\\triangle BCH$ катет $BH$ лежит против угла $30^\\circ$, значит $BH = \\frac{BC}{2} = \\frac{${bc}}{2} = \\mathbf{${bh}}$ см.`
          ],
          hint: 'Дважды примените свойство катета против угла 30°: сначала в △ABC, затем в △BCH.',
          meta: { prototype: 'height_right_30_find_bh', A, B, C, H, ab, bc, bh }
        });
      } else {
        const questionHtml = `
          <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$, $\\angle A = 30^\\circ$) проведена высота $CH$ к гипотенузе $AB$. Найдите длину гипотенузы $AB$ (в см), если $BH = ${bh}$ см.</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'height',
          catName: 'Высота прямоугольного △',
          prompt: 'Найдите длину гипотенузы AB (в см):',
          questionHtml,
          answer: ab,
          unit: 'см',
          distractors: [bc, bh * 3, bh * 6, ab + 4],
          solutionSteps: [
            `1. В $\\triangle ABC$: $\\angle B = 90^\\circ - 30^\\circ = 60^\\circ$, значит в $\\triangle BCH$ угол $\\angle BCH = 30^\\circ$.`,
            `2. Против угла $30^\\circ$ в $\\triangle BCH$ лежит катет $BH = ${bh}$ см, значит гипотенуза $BC = 2 \\cdot BH = ${bc}$ см.`,
            `3. В $\\triangle ABC$ катет $BC$ лежит против $\\angle A = 30^\\circ$, поэтому $AB = 2 \\cdot BC = 2 \\cdot ${bc} = \\mathbf{${ab}}$ см.`
          ],
          hint: 'Найдите катет BC в треугольнике BCH, а затем гипотенузу AB в треугольнике ABC.',
          meta: { prototype: 'height_right_30_find_ab', A, B, C, H, ab, bc, bh }
        });
      }
    }
  }

  // =========================================================================
  // КАТЕГОРИЯ 4: РАВНОБЕДРЕННЫЙ ТРЕУГОЛЬНИК
  // =========================================================================

  // Прототип 10: Высота/медиана/биссектриса к основанию равнобедренного треугольника
  function genIsoscelesToBase() {
    const isAngleTask = Math.random() < 0.6;
    const halfTop = randInt(16, 56);
    const topAngle = 2 * halfTop;
    const baseAngle = 90 - halfTop;

    const { A, B, C } = triangleFromAngles(baseAngle, baseAngle);
    const D = midpoint(A, C);

    if (isAngleTask) {
      const inner = `
        <line x1="${B.x}" y1="${B.y}" x2="${D.x}" y2="${D.y}" stroke="${COLORS.height}" stroke-width="2.4"/>
        <circle cx="${D.x}" cy="${D.y}" r="3.4" fill="${COLORS.height}"/>
        ${svgRightAngle(D, B, C, 9, COLORS.height)}
        ${svgFootLabel(D, B, 'H', COLORS.height)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);

      const subMode = Math.random() < 0.5 ? 'find_base' : 'find_half';
      if (subMode === 'find_base') {
        const questionHtml = `
          <div>В равнобедренном треугольнике $ABC$ ($AB = BC$) к основанию $AC$ проведена высота $BH$. Известно, что $\\angle ABH = ${halfTop}^\\circ$. Найдите угол $\\angle BAC$ при основании (в градусах).</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'isosceles',
          catName: 'Равнобедренный треугольник',
          prompt: 'Найдите угол при основании равнобедренного треугольника (в градусах):',
          questionHtml,
          answer: baseAngle,
          unit: '°',
          distractors: [halfTop, topAngle, 180 - halfTop, 90 - topAngle > 0 ? 90 - topAngle : baseAngle + 10],
          solutionSteps: [
            `1. Так как $BH$ — высота, треугольник $ABH$ прямоугольный ($\\angle AHB = 90^\\circ$).`,
            `2. Сумма острых углов прямоугольного треугольника равна $90^\\circ$, значит $\\angle BAC = 90^\\circ - \\angle ABH = 90^\\circ - ${halfTop}^\\circ = \\mathbf{${baseAngle}^\\circ}$.`
          ],
          hint: 'Высота BH образует прямоугольный треугольник ABH.',
          meta: { prototype: 'iso_base_find_base_ang', A, B, C, D, topAngle, baseAngle, halfTop }
        });
      } else {
        const questionHtml = `
          <div>В равнобедренном треугольнике $ABC$ ($AB = BC$) к основанию $AC$ проведена медиана $BH$. Найдите $\\angle ABH$ (в градусах), если $\\angle ABC = ${topAngle}^\\circ$.</div>
          ${svgHtml}
        `;
        return buildTaskResult({
          category: 'isosceles',
          catName: 'Равнобедренный треугольник',
          prompt: 'Найдите угол ABH (в градусах):',
          questionHtml,
          answer: halfTop,
          unit: '°',
          distractors: [baseAngle, topAngle, 180 - topAngle, halfTop + 10],
          solutionSteps: [
            `1. В равнобедренном треугольнике медиана, проведённая к основанию, является также биссектрисой и высотой.`,
            `2. Значит $BH$ делит угол $\\angle ABC$ пополам: $\\angle ABH = \\frac{${topAngle}^\\circ}{2} = \\mathbf{${halfTop}^\\circ}$.`
          ],
          hint: 'Вспомните главное свойство медианы равнобедренного треугольника, проведённой к основанию.',
          meta: { prototype: 'iso_base_find_half_top', A, B, C, D, topAngle, baseAngle, halfTop }
        });
      }
    } else {
      // Задача на отрезок основания (через совпадение биссектрисы и высоты)
      const ad = randInt(5, 19);
      const ac = 2 * ad;
      const side = randInt(ad + 3, ad + 15);
      const perim = 2 * side + ac;
      const { A: A2, B: B2, C: C2 } = triangleFromSides(side, ac, side);
      const D2 = midpoint(A2, C2);

      const inner = `
        <line x1="${B2.x}" y1="${B2.y}" x2="${D2.x}" y2="${D2.y}" stroke="${COLORS.bisector}" stroke-width="2.4"/>
        <circle cx="${D2.x}" cy="${D2.y}" r="3.4" fill="${COLORS.bisector}"/>
        ${svgRightAngle(D2, B2, C2, 9, COLORS.height)}
        ${svgAngleArc(B2, A2, D2, 21, COLORS.bisector, true)}
        ${svgAngleArc(B2, D2, C2, 21, COLORS.bisector, true)}
        ${svgFootLabel(D2, B2, 'D', COLORS.bisector)}
      `;
      const svgHtml = wrapSvg(A2, B2, C2, inner);

      const questionHtml = `
        <div>В треугольнике $ABC$ биссектриса $BD$ является одновременно высотой. Известно, что периметр $\\triangle ABC$ равен $${perim}$ см, а боковая сторона $AB = ${side}$ см. Найдите длину отрезка $AD$ (в см).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'isosceles',
        catName: 'Равнобедренный треугольник',
        prompt: 'Найдите длину отрезка AD (в см):',
        questionHtml,
        answer: ad,
        unit: 'см',
        distractors: [ac, side, perim - 2 * side, ad + 2],
        solutionSteps: [
          `1. Так как биссектриса $BD$ совпадает с высотой, $\\triangle ABD = \\triangle CBD$ (по катету и острому углу / II признак), поэтому $\\triangle ABC$ равнобедренный ($AB = BC = ${side}$ см), а $BD$ также является медианой ($AD = DC$).`,
          `2. Найдём основание: $AC = P_{\\triangle ABC} - 2 \\cdot AB = ${perim} - 2 \\cdot ${side} = ${ac}$ см.`,
          `3. Точка $D$ — середина $AC$, поэтому $AD = \\frac{AC}{2} = \\frac{${ac}}{2} = \\mathbf{${ad}}$ см.`
        ],
        hint: 'Если биссектриса совпадает с высотой, то треугольник равнобедренный и эта линия является также медианой.',
        meta: { prototype: 'iso_base_bisector_is_height', A: A2, B: B2, C: C2, D: D2, side, ac, ad, perim }
      });
    }
  }

  // Прототип 11: Высота равнобедренного треугольника к боковой стороне
  function genIsoscelesToSide() {
    const halfB = randInt(12, 38);
    const angB = 2 * halfB; // от 24 до 76 (< 90, остроугольный!)
    const angBase = 90 - halfB; // угол A = угол C (от 52 до 78)

    const { A, B, C } = triangleFromAngles(angBase, angBase);
    const H = projectOnLine(A, B, C);

    const inner = `
      <line x1="${A.x}" y1="${A.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.4"/>
      <circle cx="${H.x}" cy="${H.y}" r="3.4" fill="${COLORS.height}"/>
      ${svgRightAngle(H, A, B, 9, COLORS.height)}
      ${svgFootLabel(H, A, 'H', COLORS.height)}
    `;
    const svgHtml = wrapSvg(A, B, C, inner);

    const giveBase = Math.random() < 0.5;
    if (giveBase) {
      const questionHtml = `
        <div>В остроугольном равнобедренном треугольнике $ABC$ ($AB = BC$) к боковой стороне $BC$ проведена высота $AH$. Найдите угол $\\angle HAC$, если угол при основании $\\angle A = ${angBase}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'isosceles',
        catName: 'Равнобедренный треугольник',
        prompt: 'Найдите угол HAC (в градусах):',
        questionHtml,
        answer: halfB,
        unit: '°',
        distractors: [angB, angBase, angBase - halfB > 0 ? angBase - halfB : halfB + 8, 90 - halfB],
        solutionSteps: [
          `1. В равнобедренном $\\triangle ABC$ углы при основании $AC$ равны: $\\angle C = \\angle A = ${angBase}^\\circ$.`,
          `2. Рассмотрим прямоугольный $\\triangle AHC$ ($\\angle AHC = 90^\\circ$, так как $AH$ — высота).`,
          `3. $\\angle HAC = 90^\\circ - \\angle C = 90^\\circ - ${angBase}^\\circ = \\mathbf{${halfB}^\\circ}$.`
        ],
        hint: 'Вспомните, что углы при основании равнобедренного треугольника равны, и рассмотрите прямоугольный △AHC.',
        meta: { prototype: 'iso_side_from_base', A, B, C, H, angB, angBase, halfB }
      });
    } else {
      const questionHtml = `
        <div>В равнобедренном треугольнике $ABC$ ($AB = BC$) угол при вершине $\\angle B = ${angB}^\\circ$. К боковой стороне $BC$ проведена высота $AH$. Найдите угол $\\angle HAC$ (в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'isosceles',
        catName: 'Равнобедренный треугольник',
        prompt: 'Найдите угол HAC (в градусах):',
        questionHtml,
        answer: halfB,
        unit: '°',
        distractors: [angB, angBase, 90 - angB, halfB + 6],
        solutionSteps: [
          `1. Найдём угол при основании равнобедренного треугольника: $\\angle C = \\frac{180^\\circ - \\angle B}{2} = \\frac{180^\\circ - ${angB}^\\circ}{2} = ${angBase}^\\circ$.`,
          `2. В прямоугольном $\\triangle AHC$ ($\\angle AHC = 90^\\circ$): $\\angle HAC = 90^\\circ - \\angle C = 90^\\circ - ${angBase}^\\circ = \\mathbf{${halfB}^\\circ}$.`
        ],
        hint: 'Найдите угол C при основании треугольника, а затем угол HAC из прямоугольного △AHC.',
        meta: { prototype: 'iso_side_from_top', A, B, C, H, angB, angBase, halfB }
      });
    }
  }

  // =========================================================================
  // КАТЕГОРИЯ 5: КОМБИНИРОВАННЫЕ ЗАДАЧИ
  // =========================================================================

  // Прототип 12: Угол между биссектрисой и высотой из одной вершины
  function genCombinedBisectorHeight() {
    const isRight = Math.random() < 0.4;
    if (!isRight) {
      let angA, angC, angB;
      do {
        angA = randInt(32, 78);
        angC = randInt(32, 78);
        angB = 180 - angA - angC;
      } while (angB < 30 || angB > 84 || Math.abs(angA - angC) < 10 || (angA - angC) % 2 !== 0);

      const ans = Math.abs(angA - angC) / 2;
      const halfB = angB / 2;
      const angABH = 90 - angA;

      const { A, B, C } = triangleFromAngles(angA, angC);
      const H = projectOnLine(B, A, C);
      const L = bisectorFoot(B, A, C);

      const inner = `
        <line x1="${B.x}" y1="${B.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.2"/>
        <line x1="${B.x}" y1="${B.y}" x2="${L.x}" y2="${L.y}" stroke="${COLORS.bisector}" stroke-width="2.2"/>
        <circle cx="${H.x}" cy="${H.y}" r="3.2" fill="${COLORS.height}"/>
        <circle cx="${L.x}" cy="${L.y}" r="3.2" fill="${COLORS.bisector}"/>
        ${svgRightAngle(H, B, H.x < L.x ? A : C, 9, COLORS.height)}
        ${svgAngleArc(B, H, L, 27, '#0284c7', false)}
        ${svgFootLabel(H, B, 'H', COLORS.height)}
        ${svgFootLabel(L, B, 'L', COLORS.bisector)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);

      const questionHtml = `
        <div>Из вершины $B$ остроугольного треугольника $ABC$ проведены биссектриса $BL$ и высота $BH$. Найдите угол $\\angle LBH$, если $\\angle A = ${angA}^\\circ$, а $\\angle C = ${angC}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'combined',
        catName: 'Комбинированные задачи',
        prompt: 'Найдите угол между биссектрисой и высотой (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [ans * 2, halfB, angABH, ans + 5],
        solutionSteps: [
          `1. Найдём весь угол при вершине $B$: $\\angle ABC = 180^\\circ - (${angA}^\\circ + ${angC}^\\circ) = ${angB}^\\circ$.`,
          `2. Биссектриса $BL$ делит его пополам: $\\angle ABL = \\frac{${angB}^\\circ}{2} = ${halfB}^\\circ$.`,
          `3. Из прямоугольного $\\triangle ABH$ ($\\angle AHB = 90^\\circ$): $\\angle ABH = 90^\\circ - ${angA}^\\circ = ${angABH}^\\circ$.`,
          `4. Искомый угол между лучами $BL$ и $BH$: $\\angle LBH = |\\angle ABL - \\angle ABH| = |${halfB}^\\circ - ${angABH}^\\circ| = \\mathbf{${ans}^\\circ}$.`
        ],
        hint: 'Найдите углы ∠ABL (половина ∠B) и ∠ABH (90° − ∠A), а затем вычислите их разность.',
        meta: { prototype: 'combined_bh_acute', A, B, C, H, L, angA, angB, angC }
      });
    } else {
      let angA;
      do {
        angA = randInt(16, 74);
      } while (Math.abs(angA - 45) < 6);
      const angB = 90 - angA;
      const ans = Math.abs(45 - angA);
      const { A, B, C } = rightTriangleHypBottom(angA);
      const H = projectOnLine(C, A, B);
      const L = bisectorFoot(C, A, B);

      const inner = `
        <line x1="${C.x}" y1="${C.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.2"/>
        <line x1="${C.x}" y1="${C.y}" x2="${L.x}" y2="${L.y}" stroke="${COLORS.bisector}" stroke-width="2.2"/>
        <circle cx="${H.x}" cy="${H.y}" r="3.2" fill="${COLORS.height}"/>
        <circle cx="${L.x}" cy="${L.y}" r="3.2" fill="${COLORS.bisector}"/>
        ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
        ${svgRightAngle(H, C, H.x < L.x ? A : B, 8, COLORS.height)}
        ${svgAngleArc(C, H, L, 26, '#0284c7', false)}
        ${svgFootLabel(H, C, 'H', COLORS.height)}
        ${svgFootLabel(L, C, 'L', COLORS.bisector)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);

      const questionHtml = `
        <div>Из вершины прямого угла $C$ треугольника $ABC$ проведены биссектриса $CL$ и высота $CH$. Найдите угол $\\angle LCH$, если $\\angle A = ${angA}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'combined',
        catName: 'Комбинированные задачи',
        prompt: 'Найдите угол между биссектрисой и высотой (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [ans * 2, 45, angA, angB],
        solutionSteps: [
          `1. Биссектриса прямого угла $CL$ делит $\\angle C = 90^\\circ$ пополам: $\\angle ACL = 45^\\circ$.`,
          `2. Из прямоугольного $\\triangle ACH$ ($\\angle AHC = 90^\\circ$): $\\angle ACH = 90^\\circ - \\angle A = 90^\\circ - ${angA}^\\circ = ${angB}^\\circ$.`,
          `3. Угол между биссектрисой и высотой: $\\angle LCH = |\\angle ACL - \\angle ACH| = |45^\\circ - ${angB}^\\circ| = \\mathbf{${ans}^\\circ}$.`
        ],
        hint: 'Биссектриса делит прямой угол на два по 45°. Найдите ∠ACH и возьмите модуль разности с 45°.',
        meta: { prototype: 'combined_bh_right', A, B, C, H, L, angA, angB }
      });
    }
  }

  // Прототип 13: Медиана и высота (или медиана и биссектриса) в прямоугольном треугольнике
  function genCombinedMedianHeightRight() {
    let angA;
    do {
      angA = randInt(18, 72);
    } while (Math.abs(angA - 45) < 7);
    const angB = 90 - angA;
    const { A, B, C } = rightTriangleHypBottom(angA);
    const M = midpoint(A, B);
    const H = projectOnLine(C, A, B);
    const L = bisectorFoot(C, A, B);

    const isMedianHeight = Math.random() < 0.6;
    if (isMedianHeight) {
      const ans = Math.abs(90 - 2 * angA);
      const inner = `
        <line x1="${C.x}" y1="${C.y}" x2="${H.x}" y2="${H.y}" stroke="${COLORS.height}" stroke-width="2.2"/>
        <line x1="${C.x}" y1="${C.y}" x2="${M.x}" y2="${M.y}" stroke="${COLORS.median}" stroke-width="2.2"/>
        <circle cx="${H.x}" cy="${H.y}" r="3.2" fill="${COLORS.height}"/>
        <circle cx="${M.x}" cy="${M.y}" r="3.2" fill="${COLORS.median}"/>
        ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
        ${svgRightAngle(H, C, H.x < M.x ? A : B, 8, COLORS.height)}
        ${svgAngleArc(C, H, M, 26, '#0284c7', false)}
        ${svgFootLabel(H, C, 'H', COLORS.height)}
        ${svgFootLabel(M, C, 'M', COLORS.median)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);
      const questionHtml = `
        <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) из вершины прямого угла проведены высота $CH$ и медиана $CM$. Найдите угол $\\angle HCM$, если $\\angle A = ${angA}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'combined',
        catName: 'Комбинированные задачи',
        prompt: 'Найдите угол между высотой и медианой (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [ans / 2, angA, angB, Math.abs(45 - angA)],
        solutionSteps: [
          `1. Медиана к гипотенузе равна её половине ($CM = AM$), поэтому $\\triangle AMC$ равнобедренный и $\\angle ACM = \\angle A = ${angA}^\\circ$.`,
          `2. Из прямоугольного $\\triangle ACH$: $\\angle ACH = 90^\\circ - \\angle A = 90^\\circ - ${angA}^\\circ = ${angB}^\\circ$.`,
          `3. Угол между высотой и медианой: $\\angle HCM = |\\angle ACH - \\angle ACM| = |${angB}^\\circ - ${angA}^\\circ| = \\mathbf{${ans}^\\circ}$.`
        ],
        hint: 'Найдите ∠ACM (из равнобедренного △AMC) и ∠ACH (из прямоугольного △ACH), затем их разность.',
        meta: { prototype: 'combined_mh_right', A, B, C, H, M, angA, angB }
      });
    } else {
      const ans = Math.abs(45 - angA);
      const inner = `
        <line x1="${C.x}" y1="${C.y}" x2="${L.x}" y2="${L.y}" stroke="${COLORS.bisector}" stroke-width="2.2"/>
        <line x1="${C.x}" y1="${C.y}" x2="${M.x}" y2="${M.y}" stroke="${COLORS.median}" stroke-width="2.2"/>
        <circle cx="${L.x}" cy="${L.y}" r="3.2" fill="${COLORS.bisector}"/>
        <circle cx="${M.x}" cy="${M.y}" r="3.2" fill="${COLORS.median}"/>
        ${svgRightAngle(C, A, B, 10, COLORS.triStroke)}
        ${svgAngleArc(C, L, M, 27, '#0284c7', false)}
        ${svgFootLabel(L, C, 'L', COLORS.bisector)}
        ${svgFootLabel(M, C, 'M', COLORS.median)}
      `;
      const svgHtml = wrapSvg(A, B, C, inner);
      const questionHtml = `
        <div>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) проведены биссектриса $CL$ и медиана $CM$ к гипотенузе $AB$. Найдите угол $\\angle LCM$, если $\\angle A = ${angA}^\\circ$ (ответ дайте в градусах).</div>
        ${svgHtml}
      `;
      return buildTaskResult({
        category: 'combined',
        catName: 'Комбинированные задачи',
        prompt: 'Найдите угол между биссектрисой и медианой (в градусах):',
        questionHtml,
        answer: ans,
        unit: '°',
        distractors: [ans * 2, angA, angB, 45],
        solutionSteps: [
          `1. Биссектриса прямого угла делит $\\angle C = 90^\\circ$ пополам: $\\angle ACL = 45^\\circ$.`,
          `2. Медиана к гипотенузе равна её половине ($CM = AM$), поэтому $\\triangle AMC$ равнобедренный и $\\angle ACM = \\angle A = ${angA}^\\circ$.`,
          `3. Угол между биссектрисой и медианой: $\\angle LCM = |\\angle ACL - \\angle ACM| = |45^\\circ - ${angA}^\\circ| = \\mathbf{${ans}^\\circ}$.`
        ],
        hint: 'Биссектриса отсекает 45°, а медиана к гипотенузе образует равнобедренный треугольник AMC.',
        meta: { prototype: 'combined_ml_right', A, B, C, L, M, angA, angB }
      });
    }
  }

  // =========================================================================
  // Проверка ответа и главный диспетчер
  // =========================================================================
  function normalizeInput(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/°|град(?:ус(?:ов|а)?)?\.?/gi, '')
      .replace(/\s*см\.?/gi, '')
      .replace(/\s+/g, '')
      .replace(/−|—/g, '-')
      .replace(/,/g, '.');
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
        displayAnswer: task.displayAnswer
      };
    }

    const cleanStr = String(rawUserAnswer).trim();
    if (!cleanStr) {
      return { isCorrect: false, error: 'Введите ответ' };
    }

    const uNorm = normalizeInput(cleanStr);
    const cNorm = normalizeInput(task.answer);

    if (uNorm && cNorm && uNorm === cNorm) {
      return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
    }

    const uNum = Number(uNorm);
    const cNum = Number(cNorm);
    if (uNorm !== '' && !Number.isNaN(uNum) && !Number.isNaN(cNum) && Math.abs(uNum - cNum) < 1e-4) {
      return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
    }

    if (Array.isArray(task.acceptedAnswers)) {
      for (const acc of task.acceptedAnswers) {
        if (normalizeInput(acc) === uNorm && uNorm !== '') {
          return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
        }
      }
    }

    return {
      isCorrect: false,
      userAnswer: cleanStr,
      correctAnswer: task.displayAnswer,
      displayAnswer: task.displayAnswer
    };
  }

  const GENERATORS = {
    bisector: [genBisectorAngleSum, genBisectorTwoIntersection, genBisectorOppositeSide],
    median: [genMedianIsoscelesPerimeters, genMedianPerimeterDiff, genMedianRightHypotenuse],
    height: [genHeightAcuteAngle, genHeightTwoOrthocenter, genHeightRightTriangle],
    isosceles: [genIsoscelesToBase, genIsoscelesToSide],
    combined: [genCombinedBisectorHeight, genCombinedMedianHeightRight]
  };

  function generateTask(mode) {
    let m = String(mode || 'all').trim();
    if (m.startsWith('triangle_lines_')) {
      m = m.replace('triangle_lines_', '');
    }

    if (GENERATORS[m]) {
      return pickRandom(GENERATORS[m])();
    }

    const allGens = [
      ...GENERATORS.bisector,
      ...GENERATORS.median,
      ...GENERATORS.height,
      ...GENERATORS.isosceles,
      ...GENERATORS.combined
    ];
    return pickRandom(allGens)();
  }

  return {
    generateTask,
    checkAnswer,
    GENERATORS,
    genBisectorAngleSum,
    genBisectorTwoIntersection,
    genBisectorOppositeSide,
    genMedianIsoscelesPerimeters,
    genMedianPerimeterDiff,
    genMedianRightHypotenuse,
    genHeightAcuteAngle,
    genHeightTwoOrthocenter,
    genHeightRightTriangle,
    genIsoscelesToBase,
    genIsoscelesToSide,
    genCombinedBisectorHeight,
    genCombinedMedianHeightRight
  };
}));
