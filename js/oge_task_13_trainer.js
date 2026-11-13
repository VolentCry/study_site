/**
 * Тренажёр ОГЭ по математике · Задание №13
 * «Неравенства и системы неравенств»
 * Согласовано со спецификацией ФИПИ и Открытым банком заданий ОГЭ (sdamgia.ru / fipi.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask13Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  /* --------------------------------------------------------------------------
     ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     -------------------------------------------------------------------------- */
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

  /* --------------------------------------------------------------------------
     SVG РЕНДЕРЕР ЧИСЛОВЫХ ПРЯМЫХ
     -------------------------------------------------------------------------- */
  /**
   * Рисует числовую прямую со штриховкой и точками.
   * options: {
   *   points: [ { val: number, label?: string, solid: boolean } ],
   *   intervals: [ { from: number|null, to: number|null, layer?: 'single'|'top'|'bottom' } ],
   *   width: number (default 260),
   *   height: number (default 65)
   * }
   */
  function renderNumberLineSvg(opts) {
    const width = opts.width || 260;
    const height = opts.height || 65;
    const axisY = 36;
    const padX = 22;
    const points = opts.points || [];
    const intervals = opts.intervals || [];

    // Определяем координаты точек на оси
    let pointCoords = {};
    if (points.length === 0) {
      // Прямая без выраженных корней
    } else if (points.length === 1) {
      pointCoords[points[0].val] = width / 2;
    } else {
      const sortedVals = [...points].map(p => p.val).sort((a, b) => a - b);
      const step = (width - 2 * padX) / (sortedVals.length + 1);
      sortedVals.forEach((val, idx) => {
        pointCoords[val] = padX + step * (idx + 1);
      });
    }

    // Генерация штриховки
    let hatchesSvg = '';
    const hatchH = 14;
    const hatchSpacing = 7;

    intervals.forEach(inv => {
      const xStart = inv.from === null ? padX - 8 : (pointCoords[inv.from] !== undefined ? pointCoords[inv.from] : padX);
      const xEnd = inv.to === null ? width - padX + 8 : (pointCoords[inv.to] !== undefined ? pointCoords[inv.to] : width - padX);

      const isTop = inv.layer === 'top';
      const isBottom = inv.layer === 'bottom';
      const dir = isBottom ? -1 : 1;
      const yBase = axisY;
      const yTip = isBottom ? axisY + hatchH : axisY - hatchH;

      for (let x = xStart; x <= xEnd; x += hatchSpacing) {
        const x1 = Math.max(xStart, Math.min(xEnd, x));
        const x2 = Math.max(xStart, Math.min(xEnd, x + dir * 6));
        hatchesSvg += `<line x1="${x1.toFixed(1)}" y1="${yBase}" x2="${x2.toFixed(1)}" y2="${yTip}" stroke="#b7464e" stroke-width="1.6" stroke-linecap="round"/>`;
      }
    });

    // Отрисовка точек
    let pointsSvg = '';
    points.forEach(p => {
      const px = pointCoords[p.val];
      const r = 4.2;
      const labelText = p.label !== undefined ? p.label : String(p.val);
      if (p.solid) {
        pointsSvg += `
          <circle cx="${px.toFixed(1)}" cy="${axisY}" r="${r}" fill="#202a3a" stroke="#202a3a" stroke-width="1.8"/>
          <text x="${px.toFixed(1)}" y="${axisY + 18}" font-size="12" font-family="'DM Sans', sans-serif" font-weight="700" fill="#202a3a" text-anchor="middle">${labelText}</text>
        `;
      } else {
        pointsSvg += `
          <circle cx="${px.toFixed(1)}" cy="${axisY}" r="${r}" fill="#ffffff" stroke="#202a3a" stroke-width="2"/>
          <text x="${px.toFixed(1)}" y="${axisY + 18}" font-size="12" font-family="'DM Sans', sans-serif" font-weight="700" fill="#202a3a" text-anchor="middle">${labelText}</text>
        `;
      }
    });

    return `
      <svg class="number-line-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Стрелка оси -->
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#202a3a" />
          </marker>
        </defs>
        <line x1="${padX - 10}" y1="${axisY}" x2="${width - padX + 12}" y2="${axisY}" stroke="#202a3a" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="${width - padX + 12}" y="${axisY - 8}" font-size="12" font-family="'DM Sans', sans-serif" font-style="italic" font-weight="600" fill="#202a3a">x</text>
        <!-- Штриховка -->
        ${hatchesSvg}
        <!-- Точки -->
        ${pointsSvg}
      </svg>
    `;
  }

  /* --------------------------------------------------------------------------
     1. ЛИНЕЙНЫЕ НЕРАВЕНСТВА (числовая прямая или скобочные интервалы)
     -------------------------------------------------------------------------- */
  function genLinearInequality() {
    const isParens = Math.random() < 0.5;
    let a, b, c, d, rootVal, isSolid, signSym, invSignSym;

    const strict = Math.random() < 0.5;
    isSolid = !strict;

    // Генерируем смену знака (когда коэффициент при x отрицательный)
    const flipSign = Math.random() < 0.65;

    let statementHtml = '';
    let steps = [];

    if (!isParens) {
      // Вид: a - bx >= c (или ax + b <= cx + d)
      const xCoeff = flipSign ? -randInt(2, 6) : randInt(2, 6);
      rootVal = randInt(-9, 9);
      const constTerm = randInt(-12, 12);
      const rightVal = xCoeff * rootVal + constTerm;

      const compSign = strict ? (flipSign ? '>' : '<') : (flipSign ? '≥' : '≤');
      // исходное неравенство: constTerm + xCoeff*x compSign rightVal
      let xPart = xCoeff === 1 ? 'x' : (xCoeff === -1 ? '-x' : `${xCoeff}x`);
      if (constTerm !== 0) {
        if (xPart.startsWith('-')) {
          statementHtml = `${constTerm} ${xPart} ${compSign} ${rightVal}`;
        } else {
          statementHtml = `${constTerm} + ${xPart} ${compSign} ${rightVal}`;
        }
      } else {
        statementHtml = `${xPart} ${compSign} ${rightVal}`;
      }

      steps.push(`Перенесём свободные члены в правую часть: <code>${xPart} ${compSign} ${rightVal - constTerm}</code>.`);
      if (flipSign) {
        const resSign = strict ? '<' : '≤';
        steps.push(`Разделим обе части на отрицательное число <strong>${xCoeff}</strong>. <em>Внимание: при делении на отрицательное число знак неравенства меняется на противоположный!</em>`);
        steps.push(`Получаем: <code>x ${resSign} ${rootVal}</code>.`);
        signSym = resSign;
      } else {
        const resSign = strict ? '>' : '≥';
        steps.push(`Разделим обе части на <strong>${xCoeff}</strong>:`);
        steps.push(`Получаем: <code>x ${resSign} ${rootVal}</code>.`);
        signSym = resSign;
      }
    } else {
      // Вид со скобками: p(x - k) - m <= n
      const p = pickRandom([2, 3, 4, -2, -3, -4]);
      rootVal = randInt(-8, 8);
      const k = randInt(-5, 5);
      const m = randInt(-10, 10);
      const targetVal = p * (rootVal - k) - m;
      const compSign = strict ? '<' : '≤';

      const signOp = k >= 0 ? `- ${k}` : `+ ${Math.abs(k)}`;
      const mOp = m >= 0 ? `- ${m}` : `+ ${Math.abs(m)}`;
      statementHtml = `${p}(x ${signOp}) ${mOp} ${compSign} ${targetVal}`;

      steps.push(`Раскроем скобки: <code>${p}x ${p * (-k) >= 0 ? '+' : '-'} ${Math.abs(p * (-k))} ${mOp} ${compSign} ${targetVal}</code>.`);
      const totalConst = p * (-k) - m;
      steps.push(`Приведём подобные: <code>${p}x ${totalConst >= 0 ? '+' : '-'} ${Math.abs(totalConst)} ${compSign} ${targetVal}</code>.`);
      const rhs = targetVal - totalConst;
      steps.push(`Перенесём числа вправо: <code>${p}x ${compSign} ${rhs}</code>.`);

      if (p < 0) {
        const resSign = strict ? '>' : '≥';
        steps.push(`Разделим обе части на <strong>${p}</strong>, меняя знак неравенства: <code>x ${resSign} ${rootVal}</code>.`);
        signSym = resSign;
      } else {
        const resSign = strict ? '<' : '≤';
        steps.push(`Разделим обе части на <strong>${p}</strong>: <code>x ${resSign} ${rootVal}</code>.`);
        signSym = resSign;
      }
    }

    const isGreater = signSym.includes('>') || signSym.includes('≥');

    // 4 варианта ответов в виде SVG числовых прямых
    // 1. Правильный
    // 2. Противоположное направление (забыли сменить знак)
    // 3. Правильное направление, но противоположная строгость точки
    // 4. Противоположное направление и противоположная строгость точки
    const correctOpt = {
      isCorrect: true,
      svg: renderNumberLineSvg({
        points: [{ val: rootVal, solid: isSolid }],
        intervals: [{ from: isGreater ? rootVal : null, to: isGreater ? null : rootVal }]
      }),
      desc: isGreater
        ? `${isSolid ? '[' : '('}${rootVal}; +∞)`
        : `(-∞; ${rootVal}${isSolid ? ']' : ')'}`
    };

    const distractor1 = {
      isCorrect: false,
      svg: renderNumberLineSvg({
        points: [{ val: rootVal, solid: isSolid }],
        intervals: [{ from: !isGreater ? rootVal : null, to: !isGreater ? null : rootVal }]
      }),
      desc: !isGreater
        ? `${isSolid ? '[' : '('}${rootVal}; +∞)`
        : `(-∞; ${rootVal}${isSolid ? ']' : ')'}`
    };

    const distractor2 = {
      isCorrect: false,
      svg: renderNumberLineSvg({
        points: [{ val: rootVal, solid: !isSolid }],
        intervals: [{ from: isGreater ? rootVal : null, to: isGreater ? null : rootVal }]
      }),
      desc: isGreater
        ? `${!isSolid ? '[' : '('}${rootVal}; +∞)`
        : `(-∞; ${rootVal}${!isSolid ? ']' : ')'}`
    };

    const distractor3 = {
      isCorrect: false,
      svg: renderNumberLineSvg({
        points: [{ val: rootVal, solid: !isSolid }],
        intervals: [{ from: !isGreater ? rootVal : null, to: !isGreater ? null : rootVal }]
      }),
      desc: !isGreater
        ? `${!isSolid ? '[' : '('}${rootVal}; +∞)`
        : `(-∞; ${rootVal}${!isSolid ? ']' : ')'}`
    };

    const optionsRaw = shuffle([correctOpt, distractor1, distractor2, distractor3]);
    const correctIdx = optionsRaw.findIndex(o => o.isCorrect);
    const answer = String(correctIdx + 1);

    steps.push(`Решению <code>x ${signSym} ${rootVal}</code> соответствует промежуток <strong>${correctOpt.desc}</strong> (${isSolid ? 'закрашенная' : 'выколотая'} точка ${rootVal}, штриховка ${isGreater ? 'вправо' : 'влево'}).`);
    steps.push(`<strong>Ответ:</strong> ${answer}.`);

    const questionHtml = `
      <p class="task-statement">Укажите решение неравенства</p>
      <div class="task-math-highlight">${statementHtml}</div>
    `;

    return {
      category: 'linear',
      catName: 'Линейные неравенства',
      questionHtml,
      text: `Укажите решение неравенства: ${statementHtml.replace(/<[^>]*>/g, '')}`,
      options: optionsRaw.map(o => o.svg),
      optionsType: 'svg',
      answer,
      displayAnswer: answer,
      correctOptionIndex: correctIdx,
      solutionSteps: steps
    };
  }

  /* --------------------------------------------------------------------------
     2. СИСТЕМЫ ЛИНЕЙНЫХ НЕРАВЕНСТВ
     -------------------------------------------------------------------------- */
  function genSystemInequalities() {
    const isStrict1 = Math.random() < 0.5;
    const isStrict2 = Math.random() < 0.5;

    let r1 = randInt(-6, 4);
    let r2 = r1 + randInt(2, 7);

    // Случай 1: Пересечение интервал [r1, r2] (x >= r1, x <= r2)
    // Случай 2: Луч x >= r2 (x >= r1, x >= r2)
    // Случай 3: Луч x <= r1 (x <= r1, x <= r2)
    // Случай 4: Пустое множество (x <= r1, x >= r2)
    const sysType = pickRandom(['interval', 'ray_right', 'ray_left', 'empty']);

    let ineq1Str, ineq2Str;
    let s1, s2;
    let correctDesc = '';
    let correctIntervals = [];

    const sign1 = isStrict1 ? '>' : '≥';
    const sign2 = isStrict2 ? '<' : '≤';

    let steps = [];

    if (sysType === 'interval') {
      s1 = isStrict1 ? '>' : '≥';
      s2 = isStrict2 ? '<' : '≤';
      correctDesc = `${!isStrict1 ? '[' : '('}${r1}; ${r2}${!isStrict2 ? ']' : ')'}`;
      correctIntervals = [{ from: r1, to: r2 }];
    } else if (sysType === 'ray_right') {
      s1 = isStrict1 ? '>' : '≥';
      s2 = isStrict2 ? '>' : '≥';
      correctDesc = `${!isStrict2 ? '[' : '('}${r2}; +∞)`;
      correctIntervals = [{ from: r2, to: null }];
    } else if (sysType === 'ray_left') {
      s1 = isStrict1 ? '<' : '≤';
      s2 = isStrict2 ? '<' : '≤';
      correctDesc = `(-∞; ${r1}${!isStrict1 ? ']' : ')'}`;
      correctIntervals = [{ from: null, to: r1 }];
    } else {
      // empty
      s1 = isStrict1 ? '<' : '≤';
      s2 = isStrict2 ? '>' : '≥';
      correctDesc = `нет решений`;
      correctIntervals = [];
    }

    // Составляем вид системы ax + b <> c
    const b1 = randInt(-8, 8);
    const b2 = randInt(-8, 8);
    ineq1Str = `x ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)} ${s1} ${r1 + b1}`;
    ineq2Str = `x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)} ${s2} ${r2 + b2}`;

    steps.push(`Решим каждое неравенство системы:`);
    steps.push(`1) <code>${ineq1Str} &ensp;⟹&ensp; x ${s1} ${r1}</code>`);
    steps.push(`2) <code>${ineq2Str} &ensp;⟹&ensp; x ${s2} ${r2}</code>`);
    steps.push(`Нанесём оба решения на координатную прямую и найдём их пересечение (где штриховки совпадают):`);

    if (sysType === 'empty') {
      steps.push(`Штриховки направлены в противоположные стороны и не пересекаются ⟹ <strong>система не имеет решений</strong>.`);
    } else {
      steps.push(`Пересечением решений является промежуток <strong>${correctDesc}</strong>.`);
    }

    const pointsAll = [
      { val: r1, solid: !isStrict1 },
      { val: r2, solid: !isStrict2 }
    ];

    // Генерируем 4 варианта прямых
    const correctOpt = {
      isCorrect: true,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: correctIntervals })
    };

    // Дистрактор 1: интервал между r1 и r2 (если не он) или луч
    const d1Intervals = sysType === 'interval' ? [{ from: r2, to: null }] : [{ from: r1, to: r2 }];
    const distractor1 = {
      isCorrect: false,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: d1Intervals })
    };

    // Дистрактор 2: луч влево до r1 или оба луча в разные стороны
    const d2Intervals = [{ from: null, to: r1 }];
    const distractor2 = {
      isCorrect: false,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: d2Intervals })
    };

    // Дистрактор 3: объединение лучей или пустая прямая
    const d3Intervals = sysType === 'empty' ? [{ from: r1, to: r2 }] : [{ from: null, to: r1 }, { from: r2, to: null }];
    const distractor3 = {
      isCorrect: false,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: d3Intervals })
    };

    const optionsRaw = shuffle([correctOpt, distractor1, distractor2, distractor3]);
    const correctIdx = optionsRaw.findIndex(o => o.isCorrect);
    const answer = String(correctIdx + 1);

    steps.push(`<strong>Ответ:</strong> ${answer}.`);

    const questionHtml = `
      <p class="task-statement">Укажите решение системы неравенств</p>
      <div class="task-math-highlight" style="display:inline-block; text-align:left;">
        <span style="font-size:2.2rem; font-weight:300; vertical-align:middle; line-height:1;">{</span>
        <span style="display:inline-flex; flex-direction:column; vertical-align:middle; line-height:1.4;">
          <span>${ineq1Str}</span>
          <span>${ineq2Str}</span>
        </span>
      </div>
    `;

    return {
      category: 'systems',
      catName: 'Системы неравенств',
      questionHtml,
      text: `Укажите решение системы неравенств: { ${ineq1Str}; ${ineq2Str} }`,
      options: optionsRaw.map(o => o.svg),
      optionsType: 'svg',
      answer,
      displayAnswer: answer,
      correctOptionIndex: correctIdx,
      solutionSteps: steps
    };
  }

  /* --------------------------------------------------------------------------
     3. КВАДРАТНЫЕ НЕРАВЕНСТВА (x^2 - a^2, ax^2 + bx, полные)
     -------------------------------------------------------------------------- */
  function genQuadraticInequality() {
    const quadType = pickRandom(['difference_squares', 'no_free_term', 'full']);
    const isStrict = Math.random() < 0.5;
    const isGreater = Math.random() < 0.5;
    const solid = !isStrict;

    let statementHtml = '';
    let x1, x2;
    let steps = [];

    const compSign = isStrict ? (isGreater ? '>' : '<') : (isGreater ? '≥' : '≤');

    if (quadType === 'difference_squares') {
      // x^2 - a^2 < 0 или x^2 > a^2
      const a = pickRandom([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const a2 = a * a;
      x1 = -a;
      x2 = a;

      if (Math.random() < 0.5) {
        statementHtml = `x² - ${a2} ${compSign} 0`;
        steps.push(`Разложим на множители по формуле разности квадратов: <code>(x - ${a})(x + ${a}) ${compSign} 0</code>.`);
      } else {
        statementHtml = `x² ${compSign} ${a2}`;
        steps.push(`Перенесём всё в левую часть: <code>x² - ${a2} ${compSign} 0</code>.`);
        steps.push(`Корни соответствующего уравнения <code>x² - ${a2} = 0</code>: <code>x₁ = -${a}</code>, <code>x₂ = ${a}</code>.`);
      }
    } else if (quadType === 'no_free_term') {
      // x^2 - bx > 0
      const b = pickRandom([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
      const root1 = 0;
      const root2 = b;
      x1 = Math.min(root1, root2);
      x2 = Math.max(root1, root2);

      const signOp = b > 0 ? `- ${b}x` : `+ ${Math.abs(b)}x`;
      statementHtml = `x² ${signOp} ${compSign} 0`;

      steps.push(`Вынесем общий множитель <em>x</em> за скобки: <code>x(x ${b > 0 ? '-' : '+'} ${Math.abs(b)}) ${compSign} 0</code>.`);
      steps.push(`Корни уравнения: <code>x₁ = ${x1}</code>, <code>x₂ = ${x2}</code>.`);
    } else {
      // Полное ax^2 + bx + c
      x1 = randInt(-6, 2);
      x2 = x1 + randInt(2, 6);
      const bCoeff = -(x1 + x2);
      const cCoeff = x1 * x2;

      let bStr = bCoeff === 0 ? '' : (bCoeff > 0 ? `+ ${bCoeff === 1 ? '' : bCoeff}x` : `- ${Math.abs(bCoeff) === 1 ? '' : Math.abs(bCoeff)}x`);
      let cStr = cCoeff === 0 ? '' : (cCoeff > 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`);

      statementHtml = `x² ${bStr} ${cStr} ${compSign} 0`;
      steps.push(`Решим квадратное уравнение <code>x² ${bStr} ${cStr} = 0</code> по теореме Виета или через дискриминант:`);
      steps.push(`Корни уравнения: <code>x₁ = ${x1}</code>, <code>x₂ = ${x2}</code>.`);
    }

    steps.push(`Ветви параболы <code>y = ax² + ...</code> направлены <strong>вверх</strong> (коэффициент при x² равен +1 > 0).`);
    steps.push(`Нанесём корни ${x1} и ${x2} на числовую прямую (${solid ? 'закрашенные' : 'выколотые'} точки).`);

    let correctIntervals = [];
    let correctDesc = '';

    if (isGreater) {
      steps.push(`Так как знак неравенства <code>${compSign}</code> (больше нуля), решением являются внешние промежутки («усы» параболы выше оси):`);
      correctDesc = `(-∞; ${x1}${solid ? ']' : ')'} ∪ ${solid ? '[' : '('}${x2}; +∞)`;
      steps.push(`<strong>${correctDesc}</strong>.`);
      correctIntervals = [{ from: null, to: x1 }, { from: x2, to: null }];
    } else {
      steps.push(`Так как знак неравенства <code>${compSign}</code> (меньше нуля), решением является внутренний отрезок/интервал между корнями:`);
      correctDesc = `${solid ? '[' : '('}${x1}; ${x2}${solid ? ']' : ')'}`;
      steps.push(`<strong>${correctDesc}</strong>.`);
      correctIntervals = [{ from: x1, to: x2 }];
    }

    const pointsAll = [
      { val: x1, solid: solid },
      { val: x2, solid: solid }
    ];

    // 4 варианта:
    // 1. Правильный
    // 2. Противоположные интервалы (внутри вместо снаружи)
    // 3. Другая строгость точек
    // 4. Сдвинутый луч / противоположные точки
    const correctOpt = {
      isCorrect: true,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: correctIntervals })
    };

    const d1Intervals = isGreater ? [{ from: x1, to: x2 }] : [{ from: null, to: x1 }, { from: x2, to: null }];
    const distractor1 = {
      isCorrect: false,
      svg: renderNumberLineSvg({ points: pointsAll, intervals: d1Intervals })
    };

    const distractor2 = {
      isCorrect: false,
      svg: renderNumberLineSvg({
        points: [{ val: x1, solid: !solid }, { val: x2, solid: !solid }],
        intervals: correctIntervals
      })
    };

    const distractor3 = {
      isCorrect: false,
      svg: renderNumberLineSvg({
        points: pointsAll,
        intervals: [{ from: x1, to: null }]
      })
    };

    const optionsRaw = shuffle([correctOpt, distractor1, distractor2, distractor3]);
    const correctIdx = optionsRaw.findIndex(o => o.isCorrect);
    const answer = String(correctIdx + 1);

    steps.push(`<strong>Ответ:</strong> ${answer}.`);

    const questionHtml = `
      <p class="task-statement">Укажите решение неравенства</p>
      <div class="task-math-highlight">${statementHtml}</div>
    `;

    return {
      category: 'quadratic',
      catName: 'Квадратные неравенства',
      questionHtml,
      text: `Укажите решение неравенства: ${statementHtml}`,
      options: optionsRaw.map(o => o.svg),
      optionsType: 'svg',
      answer,
      displayAnswer: answer,
      correctOptionIndex: correctIdx,
      solutionSteps: steps
    };
  }

  /* --------------------------------------------------------------------------
     4. НЕРАВЕНСТВА БЕЗ РЕШЕНИЙ ИЛИ ВЕРНЫЕ ПРИ ВСЕХ X (текстовые варианты)
     -------------------------------------------------------------------------- */
  function genNoSolutionOrAll() {
    const askType = pickRandom(['no_solution', 'all_reals']);
    const a = pickRandom([9, 16, 25, 36, 49, 64]);

    // Варианты неравенств:
    // 1) x^2 - a > 0  (решения есть: (-∞, -√a) ∪ (√a, +∞))
    // 2) x^2 - a < 0  (решения есть: (-√a, √a))
    // 3) x^2 + a > 0  (решение: любое x, так как x^2 + a >= a > 0)
    // 4) x^2 + a < 0  (НЕТ РЕШЕНИЙ, так как x^2 >= 0, а положительное не может быть < 0)

    let correctFormula = '';
    let steps = [];

    const ineqList = [
      { text: `x² - ${a} > 0`, hasNoSol: false, isAll: false, desc: `раскладывается на (x - √${a})(x + √${a}) > 0, решения есть.` },
      { text: `x² - ${a} < 0`, hasNoSol: false, isAll: false, desc: `раскладывается на (x - √${a})(x + √${a}) < 0, решение: интервал (-√${a}; √${a}).` },
      { text: `x² + ${a} > 0`, hasNoSol: false, isAll: true, desc: `квадрат числа всегда неотрицателен (x² ≥ 0), значит x² + ${a} ≥ ${a} > 0 при ЛЮБОМ x (решение: вся числовая прямая).` },
      { text: `x² + ${a} < 0`, hasNoSol: true, isAll: false, desc: `так как x² ≥ 0, сумма (x² + ${a}) ВСЕГДА строго больше нуля и никогда не может быть меньше нуля. Неравенство НЕ ИМЕЕТ РЕШЕНИЙ.` }
    ];

    const shuffledIneqs = shuffle(ineqList);

    let questionTitle = '';
    let targetIdx = -1;

    if (askType === 'no_solution') {
      questionTitle = 'Укажите неравенство, которое <strong>не имеет решений</strong>.';
      targetIdx = shuffledIneqs.findIndex(item => item.hasNoSol);
    } else {
      questionTitle = 'Укажите неравенство, решением которого является <strong>любое число</strong>.';
      targetIdx = shuffledIneqs.findIndex(item => item.isAll);
    }

    steps.push(`Проанализируем каждое из предложенных неравенств:`);
    shuffledIneqs.forEach((item, idx) => {
      steps.push(`<strong>${idx + 1}) ${item.text}</strong> — ${item.desc}`);
    });

    const answer = String(targetIdx + 1);
    steps.push(`Следовательно, искомым является вариант <strong>№${answer}</strong>.`);

    const questionHtml = `
      <p class="task-statement">${questionTitle}</p>
    `;

    return {
      category: 'no_solution_or_all',
      catName: 'Без решений / Любое число',
      questionHtml,
      text: questionTitle.replace(/<[^>]*>/g, ''),
      options: shuffledIneqs.map(i => `<span class="math-expr" style="font-size:1.15rem;">${i.text}</span>`),
      optionsType: 'text',
      answer,
      displayAnswer: answer,
      correctOptionIndex: targetIdx,
      solutionSteps: steps
    };
  }

  /* --------------------------------------------------------------------------
     ГЛАВНЫЙ ГЕНЕРАТОР ЗАДАНИЙ
     -------------------------------------------------------------------------- */
  function generateTask(category = 'mixed_all') {
    let task = null;
    switch (category) {
      case 'linear':
        task = genLinearInequality();
        break;
      case 'systems':
        task = genSystemInequalities();
        break;
      case 'quadratic':
        task = genQuadraticInequality();
        break;
      case 'no_solution_or_all':
        task = genNoSolutionOrAll();
        break;
      case 'mixed_all':
      default: {
        const pick = pickRandom(['linear', 'systems', 'quadratic', 'no_solution_or_all']);
        if (pick === 'linear') task = genLinearInequality();
        else if (pick === 'systems') task = genSystemInequalities();
        else if (pick === 'quadratic') task = genQuadraticInequality();
        else task = genNoSolutionOrAll();
        break;
      }
    }

    if (task) {
      if (!task.id) task.id = 'oge13_' + Math.random().toString(36).substring(2, 9);
      if (!task.displayAnswer) task.displayAnswer = task.answer;
      if (!task.text && task.questionHtml) {
        task.text = task.questionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Встраиваем 4 варианта ответа в questionHtml, чтобы в ДЗ, личном кабинете ученика
      // и на панели учителя варианты ответов (числовые прямые или текст) отображались всегда!
      if (task.options && task.options.length) {
        const isSvg = task.optionsType === 'svg';
        const optionsCardsHtml = task.options.map((opt, idx) => `
          <div class="oge13-opt-card" style="display:flex; align-items:center; gap:10px; padding:8px 12px; background:rgba(38,63,97,0.04); border:1px solid rgba(38,63,97,0.14); border-radius:10px;">
            <span style="display:inline-grid; place-items:center; width:26px; height:26px; border-radius:8px; background:rgba(38,63,97,0.1); color:var(--indigo, #263f61); font-weight:800; font-size:13px; flex-shrink:0;">${idx + 1}</span>
            <div style="flex:1; display:flex; align-items:center; justify-content:center; overflow-x:auto;">${opt}</div>
          </div>
        `).join('');

        const gridCols = isSvg ? 'repeat(auto-fit, minmax(240px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))';
        const optionsBlockHtml = `
          <div class="oge13-embedded-options" style="margin-top:14px; width:100%;">
            <div style="font-weight:700; font-size:0.88rem; color:var(--muted, #697383); margin-bottom:8px; text-align:left;">Варианты ответа:</div>
            <div style="display:grid; grid-template-columns:${gridCols}; gap:10px;">
              ${optionsCardsHtml}
            </div>
          </div>
        `;

        task.questionHtml = `
          <div class="oge13-task-wrap">
            ${task.questionHtml}
            ${optionsBlockHtml}
          </div>
        `;
      }
    }
    return task;
  }

  /* --------------------------------------------------------------------------
     ПРОВЕРКА ОТВЕТА
     -------------------------------------------------------------------------- */
  function checkAnswer(userAnswer, correctAnswer) {
    if (userAnswer == null || correctAnswer == null) return false;
    const cleanUser = String(userAnswer).trim().replace(/[\s,\-\.]/g, '');
    const cleanCorrect = String(correctAnswer).trim().replace(/[\s,\-\.]/g, '');
    return cleanUser === cleanCorrect;
  }

  return {
    generateTask,
    checkAnswer,
    genLinearInequality,
    genSystemInequalities,
    genQuadraticInequality,
    genNoSolutionOrAll,
    renderNumberLineSvg
  };
}));
