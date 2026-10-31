/**
 * Генератор заданий и интерактивный SVG-движок для Задания №7 ОГЭ
 * Тема: «Координатная прямая, числовые неравенства и сравнение чисел»
 * 
 * Поддерживает 4 ключевых прототипа ФИПИ / СдамГИА:
 * 1. roots_on_line - Квадратные корни на координатной прямой
 * 2. fractions_and_intervals - Дроби и числовые интервалы
 * 3. variable_inequalities - Буквенные неравенства с x, y и 0
 * 4. differences_comparison - Сравнение разностей и величин
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask7Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(arr) {
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

  // --- SVG КООРДИНАТНОЙ ПРЯМОЙ ---
  /**
   * Рендерит адаптивный SVG координатной прямой
   * @param {Object} cfg Конфигурация прямой:
   *   min: левая граница
   *   max: правая граница
   *   ticks: массив { val: число, label: строка }
   *   points: массив отмеченных точек { id: 'A', val: 5.3, color?: '#...', showVal?: false }
   *   highlightInterval?: [from, to] (подсветка отрезка)
   *   showArrow?: boolean
   */
  function renderNumberLineSVG(cfg) {
    const width = 620;
    const height = 120;
    const yAxis = 60;
    const xStart = 45;
    const xEnd = width - 40;
    const min = cfg.min;
    const max = cfg.max;
    const range = max - min;

    function scaleX(v) {
      return xStart + ((v - min) / range) * (xEnd - xStart);
    }

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="number-line-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Координатная прямая">`;

    // Градиенты и маркер стрелки
    svg += `
      <defs>
        <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--indigo, #263f61)"/>
        </marker>
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(38,63,97,0.14)"/>
        </filter>
      </defs>
    `;

    // Подсветка интервала, если есть
    if (cfg.highlightInterval) {
      const [iFrom, iTo] = cfg.highlightInterval;
      const x1 = Math.max(xStart, scaleX(iFrom));
      const x2 = Math.min(xEnd, scaleX(iTo));
      const w = Math.max(2, x2 - x1);
      svg += `
        <rect x="${x1}" y="${yAxis - 18}" width="${w}" height="36" rx="4" fill="rgba(38,63,97,0.08)"/>
        <rect x="${x1}" y="${yAxis - 18}" width="${w}" height="36" rx="4" fill="none" stroke="var(--indigo, #263f61)" stroke-dasharray="3,3" stroke-width="1.2"/>
        <!-- Квадратные скобки границ интервала -->
        <path d="M ${x1 + 4} ${yAxis - 14} L ${x1} ${yAxis - 14} L ${x1} ${yAxis + 14} L ${x1 + 4} ${yAxis + 14}" fill="none" stroke="var(--indigo, #263f61)" stroke-width="2"/>
        <path d="M ${x2 - 4} ${yAxis - 14} L ${x2} ${yAxis - 14} L ${x2} ${yAxis + 14} L ${x2 - 4} ${yAxis + 14}" fill="none" stroke="var(--indigo, #263f61)" stroke-width="2"/>
      `;
    }

    // Главная ось
    svg += `
      <line x1="${xStart - 15}" y1="${yAxis}" x2="${xEnd + 22}" y2="${yAxis}" stroke="var(--indigo, #263f61)" stroke-width="2.2" stroke-linecap="round" marker-end="url(#axisArrow)"/>
    `;

    // Засечки (ticks) и числовые подписи
    if (cfg.ticks && cfg.ticks.length > 0) {
      cfg.ticks.forEach(t => {
        const x = scaleX(t.val);
        const isZero = t.val === 0;
        const tickH = isZero ? 14 : 9;
        const strokeW = isZero ? 2.2 : 1.4;
        const strokeColor = isZero ? 'var(--vermilion, #b7464e)' : 'rgba(38,63,97,0.45)';
        const textColor = isZero ? 'var(--vermilion, #b7464e)' : 'var(--muted, #697383)';
        
        svg += `
          <line x1="${x}" y1="${yAxis - tickH}" x2="${x}" y2="${yAxis + tickH}" stroke="${strokeColor}" stroke-width="${strokeW}"/>
          <text x="${x}" y="${yAxis + 26}" text-anchor="middle" font-family="'DM Sans', -apple-system, sans-serif" font-size="${isZero ? '13' : '12'}" font-weight="${isZero ? '800' : '600'}" fill="${textColor}">${t.label}</text>
        `;
      });
    }

    // Отмеченные точки (A, B, C, D или переменные a, b, x, y)
    if (cfg.points && cfg.points.length > 0) {
      const palette = [
        { fill: '#b7464e', border: '#ffffff' }, // Vermilion
        { fill: '#263f61', border: '#ffffff' }, // Indigo
        { fill: '#2e7d32', border: '#ffffff' }, // Green
        { fill: '#c8956c', border: '#ffffff' }, // Gold
        { fill: '#6a1b9a', border: '#ffffff' }  // Plum
      ];

      cfg.points.forEach((pt, idx) => {
        const x = scaleX(pt.val);
        const col = palette[idx % palette.length];
        const labelText = pt.id;

        svg += `
          <g class="nl-point-group" transform="translate(0, 0)">
            <!-- Невидимая увеличенная область касания -->
            <circle cx="${x}" cy="${yAxis}" r="18" fill="transparent"/>
            
            <!-- Ореол точки -->
            <circle cx="${x}" cy="${yAxis}" r="8" fill="${col.fill}" fill-opacity="0.18"/>
            
            <!-- Сама точка -->
            <circle cx="${x}" cy="${yAxis}" r="5" fill="${col.fill}" stroke="${col.border}" stroke-width="1.8"/>
            
            <!-- Подпись точки (сверху от оси) -->
            <rect x="${x - 13}" y="${yAxis - 38}" width="26" height="22" rx="6" fill="#ffffff" stroke="${col.fill}" stroke-width="1.4" filter="url(#badgeShadow)"/>
            <text x="${x}" y="${yAxis - 23}" text-anchor="middle" font-family="'Zen Old Mincho', serif" font-size="13" font-weight="700" fill="${col.fill}">${labelText}</text>
          </g>
        `;
      });
    }

    svg += '</svg>';
    return svg;
  }

  // =========================================================================
  // 1. ПРОТОТИП: КВАДРАТНЫЕ КОРНИ НА КООРДИНАТНОЙ ПРЯМОЙ
  // =========================================================================
  function generateRootsTask() {
    // Выбираем режим:
    // A: Дана точка (например, A), найти какому корню она соответствует
    // B: Дан корень (например, √43), найти какая точка (A, B, C, D) ему соответствует
    const mode = Math.random() < 0.5 ? 'find_point' : 'find_root';

    // Базовое число k от 4 до 8 (корни от √17 до √80)
    const k = randomInt(4, 8);
    const kSq = k * k;
    const nextKSq = (k + 1) * (k + 1);

    if (mode === 'find_point') {
      // Дан корень, найти точку A, B, C или D
      // Выбираем неточный квадрат строго между k^2 и (k+1)^2
      const N = randomInt(kSq + 2, nextKSq - 2);
      const exactVal = Math.sqrt(N);
      const midSq = (k + 0.5) * (k + 0.5);
      const isCloserToK = N < midSq;

      // Формируем 4 точки A, B, C, D
      // Точка 1: чуть левее k (в [k-1; k])
      // Точка 2: между k и k+0.5
      // Точка 3: между k+0.5 и k+1
      // Точка 4: чуть правее k+1 (в [k+1; k+2])
      const p1 = +(k - 0.45 + Math.random() * 0.2).toFixed(2);
      const p2 = +(k + 0.18 + Math.random() * 0.15).toFixed(2);
      const p3 = +(k + 0.65 + Math.random() * 0.15).toFixed(2);
      const p4 = +(k + 1.35 + Math.random() * 0.2).toFixed(2);

      const pointsArr = [
        { id: 'A', val: p1 },
        { id: 'B', val: p2 },
        { id: 'C', val: p3 },
        { id: 'D', val: p4 }
      ];

      // Правильная точка: B (если ближе к k) или C (если ближе к k+1)
      let correctPointId = isCloserToK ? 'B' : 'C';
      // Скорректируем точное значение правильной точки под корень для реалистичности
      const targetPoint = pointsArr.find(p => p.id === correctPointId);
      targetPoint.val = +exactVal.toFixed(2);

      // Варианты ответов: 1) Точка A, 2) Точка B, 3) Точка C, 4) Точка D
      const options = ['Точка A', 'Точка B', 'Точка C', 'Точка D'];
      const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctPointId);

      const ticks = [];
      for (let t = k - 1; t <= k + 2; t++) {
        ticks.push({ val: t, label: String(t) });
      }

      const svg = renderNumberLineSVG({
        min: k - 1.5,
        max: k + 2.5,
        ticks: ticks,
        points: pointsArr
      });

      const explanation = `
        <div class="solution-step">
          <div class="step-num">Шаг 1</div>
          <div class="step-text">
            Определим, между какими соседними целыми числами заключено число <strong>&radic;${N}</strong>.<br>
            Вспомним ближайшие точные квадраты:<br>
            <strong>${k}<sup>2</sup> = ${kSq}</strong> &nbsp;и&nbsp; <strong>${k + 1}<sup>2</sup> = ${nextKSq}</strong>.<br>
            Значит, <strong>${kSq} &lt; ${N} &lt; ${nextKSq}</strong>, а значит, <strong>${k} &lt; &radic;${N} &lt; ${k + 1}</strong>.
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 2</div>
          <div class="step-text">
            Точки <strong>A</strong> и <strong>D</strong> сразу отпадают, так как они лежат вне отрезка [${k}; ${k + 1}].<br>
            На отрезке [${k}; ${k + 1}] находятся две точки: <strong>B</strong> (ближе к ${k}) и <strong>C</strong> (ближе к ${k + 1}).
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 3</div>
          <div class="step-text">
            Сравним число ${N} с серединой отрезка:<br>
            (${k} + 0,5)<sup>2</sup> = ${k},5<sup>2</sup> = <strong>${midSq.toFixed(2)}</strong>.<br>
            Поскольку <strong>${N} ${isCloserToK ? '<' : '>'} ${midSq.toFixed(2)}</strong>, корень <strong>&radic;${N}</strong> расположен 
            ${isCloserToK ? `ближе к числу ${k}` : `ближе к числу ${k + 1}`}.<br>
            Следовательно, числу &radic;${N} соответствует <strong>Точка ${correctPointId}</strong>.
          </div>
        </div>
      `;

      return {
        id: 'roots_find_pt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        category: 'roots_on_line',
        categoryTitle: 'Квадратные корни на координатной прямой',
        text: `На координатной прямой отмечены точки <strong>A, B, C, D</strong>.<br>Одна из них соответствует числу <strong>&radic;${N}</strong>. Какая это точка?`,
        svg: svg,
        options: options,
        correctOptionIndex: correctIndex,
        answer: String(correctIndex + 1),
        explanation: explanation,
        sandbox: {
          type: 'roots',
          number: N,
          k: k,
          kSq: kSq,
          nextK: k + 1,
          nextKSq: nextKSq,
          midSq: midSq
        }
      };

    } else {
      // Дана точка M на оси, выбрать какому из 4 корней она соответствует
      const targetPointName = 'A';
      const offset = randomChoice([0.25, 0.35, 0.65, 0.75]);
      const pointVal = k + offset;

      // Генерируем 4 корня-кандидата:
      // 1 верный (близок к pointVal^2)
      // 3 ложных (в других диапазонах или по другую сторону от середины)
      const correctN = Math.round(pointVal * pointVal);
      
      const wrong1 = (k - 1) * (k - 1) + randomInt(2, (k - 1) * 2 - 1); // в [k-1; k]
      const wrong2 = (k + 1) * (k + 1) + randomInt(2, (k + 1) * 2 - 1); // в [k+1; k+2]
      // Корень на том же отрезке, но по другую сторону от 0.5
      const oppositeOffset = offset < 0.5 ? 0.75 : 0.25;
      const wrong3 = Math.round(Math.pow(k + oppositeOffset, 2));

      let rootCandidates = [
        { n: correctN, correct: true },
        { n: wrong1, correct: false },
        { n: wrong2, correct: false },
        { n: wrong3, correct: false }
      ];

      // Убедимся в уникальности
      rootCandidates = shuffle(rootCandidates);
      const correctIndex = rootCandidates.findIndex(c => c.correct);
      const options = rootCandidates.map(c => `&radic;${c.n}`);

      const ticks = [];
      for (let t = k - 1; t <= k + 2; t++) {
        ticks.push({ val: t, label: String(t) });
      }

      const svg = renderNumberLineSVG({
        min: k - 1.5,
        max: k + 2.5,
        ticks: ticks,
        points: [{ id: targetPointName, val: pointVal }]
      });

      const explanation = `
        <div class="solution-step">
          <div class="step-num">Шаг 1</div>
          <div class="step-text">
            По координатной прямой видно, что точка <strong>${targetPointName}</strong> лежит строго между числами <strong>${k}</strong> и <strong>${k + 1}</strong>, причём она расположена ${offset < 0.5 ? `ближе к числу ${k}` : `ближе к числу ${k + 1}`}.
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 2</div>
          <div class="step-text">
            Возведём границы отрезка в квадрат:<br>
            <strong>${k}<sup>2</sup> = ${kSq}</strong> &nbsp;и&nbsp; <strong>${k + 1}<sup>2</sup> = ${nextKSq}</strong>.<br>
            Значит, искомое число под корнем должно лежать в диапазоне от <strong>${kSq}</strong> до <strong>${nextKSq}</strong>.
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 3</div>
          <div class="step-text">
            Середина отрезка в квадрате равна ${k},5<sup>2</sup> = <strong>${((k + 0.5) ** 2).toFixed(2)}</strong>.<br>
            Так как точка ${offset < 0.5 ? `левее середины` : `правее середины`}, число под корнем должно быть ${offset < 0.5 ? `меньше` : `больше`} ${((k + 0.5) ** 2).toFixed(2)}.<br>
            Этому условию идеально соответствует число <strong>&radic;${correctN}</strong>.
          </div>
        </div>
      `;

      return {
        id: 'roots_find_num_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        category: 'roots_on_line',
        categoryTitle: 'Квадратные корни на координатной прямой',
        text: `Одно из чисел отмечено на прямой точкой <strong>${targetPointName}</strong>.<br>Какое это число?`,
        svg: svg,
        options: options,
        correctOptionIndex: correctIndex,
        answer: String(correctIndex + 1),
        explanation: explanation,
        sandbox: {
          type: 'roots',
          number: correctN,
          k: k,
          kSq: kSq,
          nextK: k + 1,
          nextKSq: nextKSq
        }
      };
    }
  }

  // =========================================================================
  // 2. ПРОТОТИП: ДРОБИ И ЧИСЛОВЫЕ ИНТЕРВАЛЫ
  // =========================================================================
  function generateFractionsTask() {
    // Режим A: Какая из 4 дробей принадлежит отрезку [0.a; 0.b]?
    // Режим B: Точке на координатной прямой соответствует одна из 4 дробей
    const mode = Math.random() < 0.6 ? 'interval' : 'point_fraction';

    if (mode === 'interval') {
      const denom = randomChoice([7, 8, 9, 11, 13, 14, 15, 17]);
      const leftDec = randomChoice([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
      const rightDec = +(leftDec + 0.1).toFixed(1);

      // Найдём числитель, который попадает в этот интервал
      // leftDec < num / denom < rightDec <=> leftDec * denom < num < rightDec * denom
      const minNum = Math.ceil(leftDec * denom + 0.001);
      const maxNum = Math.floor(rightDec * denom - 0.001);

      let correctNum = minNum;
      if (minNum <= maxNum) {
        correctNum = randomInt(minNum, maxNum);
      } else {
        // Гарантируем попадание
        correctNum = Math.round(((leftDec + rightDec) / 2) * denom);
      }

      // Формируем 4 варианта: 1 правильный и 3 дистрактора
      const nums = new Set([correctNum]);
      let attempts = 0;
      while (nums.size < 4 && attempts < 20) {
        attempts++;
        const delta = randomChoice([-3, -2, -1, 1, 2, 3]);
        const cand = correctNum + delta;
        if (cand > 0 && cand < denom * 1.5 && cand !== correctNum) {
          nums.add(cand);
        }
      }
      while (nums.size < 4) {
        nums.add(correctNum + nums.size);
      }

      const fractionOptions = shuffle(Array.from(nums)).map(n => ({
        num: n,
        denom: denom,
        str: `${n}/${denom}`,
        val: n / denom,
        isCorrect: n / denom >= leftDec && n / denom <= rightDec
      }));

      // Убедимся, что ровно один вариант верен
      let correctIdx = fractionOptions.findIndex(f => f.isCorrect);
      if (correctIdx === -1) {
        fractionOptions[0].num = correctNum;
        fractionOptions[0].str = `${correctNum}/${denom}`;
        fractionOptions[0].val = correctNum / denom;
        fractionOptions[0].isCorrect = true;
        correctIdx = 0;
      }

      const options = fractionOptions.map(f => `&frac;${f.num};{${f.denom}}`);
      const correctF = fractionOptions[correctIdx];

      // Рисуем SVG интервала
      const svg = renderNumberLineSVG({
        min: +(leftDec - 0.2).toFixed(1),
        max: +(rightDec + 0.2).toFixed(1),
        ticks: [
          { val: +(leftDec - 0.1).toFixed(1), label: String(+(leftDec - 0.1).toFixed(1)) },
          { val: leftDec, label: String(leftDec) },
          { val: rightDec, label: String(rightDec) },
          { val: +(rightDec + 0.1).toFixed(1), label: String(+(rightDec + 0.1).toFixed(1)) }
        ],
        highlightInterval: [leftDec, rightDec]
      });

      const explanation = `
        <div class="solution-step">
          <div class="step-num">Шаг 1</div>
          <div class="step-text">
            Чтобы узнать, какая дробь принадлежит отрезку [<strong>${leftDec}</strong>; <strong>${rightDec}</strong>], переведём каждую дробь в десятичную, разделив числитель на знаменатель <strong>уголком</strong> до 2-3 знаков:
            <ul style="margin: 8px 0 0 18px; line-height: 1.6;">
              ${fractionOptions.map((f, i) => `<li>Вариант ${i + 1}) <strong>${f.num}/${f.denom}</strong> &approx; <strong>${f.val.toFixed(3)}</strong> ${f.isCorrect ? '<span style="color:var(--green, #2e7d32); font-weight:700;">&larr; попадает в отрезок!</span>' : ''}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 2</div>
          <div class="step-text">
            Сравним полученные десятичные дроби с границами отрезка:<br>
            <strong>${leftDec} &le; ${correctF.val.toFixed(3)} &le; ${rightDec}</strong>.<br>
            Следовательно, отрезку принадлежит число <strong>&frac;${correctF.num};{${correctF.denom}}</strong> (вариант <strong>${correctIdx + 1}</strong>).
          </div>
        </div>
      `;

      return {
        id: 'fractions_interval_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        category: 'fractions_and_intervals',
        categoryTitle: 'Дроби и числовые отрезки',
        text: `Одно из чисел принадлежит отрезку <strong>[${leftDec}; ${rightDec}]</strong>.<br>Какое это число?`,
        svg: svg,
        options: options,
        correctOptionIndex: correctIdx,
        answer: String(correctIdx + 1),
        explanation: explanation,
        sandbox: {
          type: 'fraction',
          fractions: fractionOptions.map(f => ({ str: `${f.num}/${f.denom}`, dec: f.val.toFixed(3) })),
          interval: [leftDec, rightDec]
        }
      };

    } else {
      // На координатной прямой отмечены 4 точки A, B, C, D. Какая соответствует дроби p/q?
      const denom = randomChoice([6, 7, 8, 9, 11]);
      const intPart = randomInt(4, 7);
      const numPart = randomInt(1, denom - 1);
      const totalNum = intPart * denom + numPart;
      const exactVal = totalNum / denom;

      // 4 точки на оси
      const p1 = +(intPart + (numPart - 1) / denom * 0.7).toFixed(2);
      const p2 = +(exactVal).toFixed(2);
      const p3 = +(intPart + (numPart + 1) / denom * 1.1).toFixed(2);
      const p4 = +(intPart + 1.25).toFixed(2);

      const pointsArr = [
        { id: 'A', val: Math.min(p1, p2 - 0.2) },
        { id: 'B', val: p2 },
        { id: 'C', val: Math.max(p3, p2 + 0.2) },
        { id: 'D', val: p4 }
      ];

      const options = ['Точка A', 'Точка B', 'Точка C', 'Точка D'];
      const correctIdx = 1; // Точка B

      const ticks = [];
      for (let t = intPart - 1; t <= intPart + 2; t++) {
        ticks.push({ val: t, label: String(t) });
      }

      const svg = renderNumberLineSVG({
        min: intPart - 1.2,
        max: intPart + 2.2,
        ticks: ticks,
        points: pointsArr
      });

      const explanation = `
        <div class="solution-step">
          <div class="step-num">Шаг 1</div>
          <div class="step-text">
            Выделим целую часть из неправильной дроби <strong>&frac;${totalNum};{${denom}}</strong>:<br>
            <strong>&frac;${totalNum};{${denom}} = ${intPart} &frac;${numPart};{${denom}}</strong>.
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 2</div>
          <div class="step-text">
            Переведём дробную часть в десятичную с точностью до десятых:<br>
            ${numPart} : ${denom} &approx; ${(numPart / denom).toFixed(2)} &rArr; <strong>${intPart} &frac;${numPart};{${denom}} &approx; ${exactVal.toFixed(2)}</strong>.
          </div>
        </div>
        <div class="solution-step">
          <div class="step-num">Шаг 3</div>
          <div class="step-text">
            Число ${exactVal.toFixed(2)} лежит между ${intPart} и ${intPart + 1}, чуть ${numPart / denom < 0.5 ? 'левее' : 'правее'} середины.<br>
            Этому положению соответствует <strong>Точка B</strong>.
          </div>
        </div>
      `;

      return {
        id: 'fractions_pt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        category: 'fractions_and_intervals',
        categoryTitle: 'Дроби и числовые отрезки',
        text: `На координатной прямой отмечены точки <strong>A, B, C, D</strong>.<br>Одна из них соответствует числу <strong>&frac;${totalNum};{${denom}}</strong>. Какая это точка?`,
        svg: svg,
        options: options,
        correctOptionIndex: correctIdx,
        answer: String(correctIdx + 1),
        explanation: explanation
      };
    }
  }

  // =========================================================================
  // 3. ПРОТОТИП: БУКВЕННЫЕ НЕРАВЕНСТВА С ПЕРЕМЕННЫМИ
  // =========================================================================
  function generateVariablesTask() {
    // x и y на координатной прямой по разные стороны от 0
    // Случай 1: x < 0 < y, причём |x| > y (например x = -3, y = 1)
    // Случай 2: x < 0 < y, причём |x| < y (например x = -1, y = 3)
    const isXFarther = Math.random() < 0.5;
    const xVal = isXFarther ? -2.8 : -1.2;
    const yVal = isXFarther ? 1.2 : 2.8;

    // Спрашиваем: какое из утверждений ВЕРНО или НЕВЕРНО
    const askTrue = Math.random() < 0.5;

    // Сформируем 4 математических утверждения с их истинностью
    // 1) x + y > 0
    // 2) x * y < 0
    // 3) x - y > 0
    // 4) x^2 * y > 0
    // 5) x * y^2 > 0
    const pool = [
      {
        expr: 'x + y &lt; 0',
        latex: 'x + y < 0',
        val: xVal + yVal < 0,
        calc: `(${xVal}) + (${yVal}) = ${(xVal + yVal).toFixed(1)} &lt; 0`
      },
      {
        expr: 'x + y &gt; 0',
        latex: 'x + y > 0',
        val: xVal + yVal > 0,
        calc: `(${xVal}) + (${yVal}) = ${(xVal + yVal).toFixed(1)} &gt; 0`
      },
      {
        expr: 'x &middot; y &lt; 0',
        latex: 'xy < 0',
        val: xVal * yVal < 0,
        calc: `(${xVal}) &middot; (${yVal}) = ${(xVal * yVal).toFixed(1)} &lt; 0 (минус на плюс даёт минус)`
      },
      {
        expr: 'x &middot; y &gt; 0',
        latex: 'xy > 0',
        val: xVal * yVal > 0,
        calc: `(${xVal}) &middot; (${yVal}) = ${(xVal * yVal).toFixed(1)} &lt; 0 (неверно)`
      },
      {
        expr: 'x &minus; y &gt; 0',
        latex: 'x - y > 0',
        val: xVal - yVal > 0,
        calc: `(${xVal}) &minus; (${yVal}) = ${(xVal - yVal).toFixed(1)} &lt; 0 (из меньшего вычитаем большее, результат отрицателен)`
      },
      {
        expr: 'x &minus; y &lt; 0',
        latex: 'x - y < 0',
        val: xVal - yVal < 0,
        calc: `(${xVal}) &minus; (${yVal}) = ${(xVal - yVal).toFixed(1)} &lt; 0 (верно)`
      },
      {
        expr: 'x<sup>2</sup>y &gt; 0',
        latex: 'x²y > 0',
        val: (xVal * xVal * yVal) > 0,
        calc: `(${xVal})² &middot; (${yVal}) = ${(xVal * xVal * yVal).toFixed(1)} &gt; 0 (квадрат положителен, плюс на плюс)`
      },
      {
        expr: 'xy<sup>2</sup> &gt; 0',
        latex: 'xy² > 0',
        val: (xVal * yVal * yVal) > 0,
        calc: `(${xVal}) &middot; (${yVal})² = ${(xVal * yVal * yVal).toFixed(1)} &lt; 0 (отрицательное число умножается на квадрат)`
      }
    ];

    // Отбираем варианты так, чтобы ровно один соответствовал условию (askTrue)
    const targetVal = askTrue; // true если ищем верное, false если неверное
    const matching = pool.filter(p => p.val === targetVal);
    const nonMatching = pool.filter(p => p.val !== targetVal);

    const chosenTarget = randomChoice(matching);
    const chosenOthers = shuffle(nonMatching).slice(0, 3);

    const finalOptions = shuffle([chosenTarget, ...chosenOthers]);
    const correctIdx = finalOptions.findIndex(o => o === chosenTarget);

    const svg = renderNumberLineSVG({
      min: -4.5,
      max: 4.5,
      ticks: [
        { val: 0, label: '0' }
      ],
      points: [
        { id: 'x', val: xVal },
        { id: 'y', val: yVal }
      ]
    });

    const questionWord = askTrue ? '<span style="color:var(--accent-emerald, #10b981); font-weight:800;">ВЕРНО</span>' : '<span style="color:var(--danger, #ef4444); font-weight:800;">НЕВЕРНО</span>';

    const explanation = `
      <div class="solution-step">
        <div class="step-num">Шаг 1</div>
        <div class="step-text">
          <strong>Анализ числовой прямой:</strong><br>
          Точка <strong>x</strong> лежит левее 0 (значит, <strong>x &lt; 0</strong>, отрицательное).<br>
          Точка <strong>y</strong> лежит правее 0 (значит, <strong>y &gt; 0</strong>, положительное).<br>
          При этом расстояние от x до 0 ${isXFarther ? 'БОЛЬШЕ' : 'МЕНЬШЕ'}, чем от y до 0 (то есть <strong>|x| ${isXFarther ? '>' : '<'} |y|</strong>).
        </div>
      </div>
      <div class="solution-step">
        <div class="step-num">Шаг 2</div>
        <div class="step-text">
          <strong>Метод конкретных чисел (самый надёжный приём ОГЭ):</strong><br>
          Возьмём удобные пробные числа, удовлетворяющие рисунку:<br>
          Пусть <strong>x = ${xVal}</strong>, а <strong>y = ${yVal}</strong>.
        </div>
      </div>
      <div class="solution-step">
        <div class="step-num">Шаг 3</div>
        <div class="step-text">
          Проверим каждое утверждение подстановкой:
          <ul style="margin: 8px 0 0 18px; line-height: 1.7;">
            ${finalOptions.map((opt, i) => `
              <li>
                Вариант ${i + 1}) <strong>${opt.expr}</strong> &rArr; ${opt.calc} &mdash; 
                ${opt.val ? '<span style="color:var(--accent-emerald, #10b981); font-weight:700;">ВЕРНО</span>' : '<span style="color:var(--danger, #ef4444); font-weight:700;">НЕВЕРНО</span>'}
                ${i === correctIdx ? ` &larr; <strong>(ИСКОМЫЙ ОТВЕТ)</strong>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    return {
      id: 'var_ineq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      category: 'variable_inequalities',
      categoryTitle: 'Буквенные неравенства с x, y и 0',
      text: `На координатной прямой отмечены числа <strong>x</strong> и <strong>y</strong>.<br>Какое из следующих утверждений ${questionWord}?`,
      svg: svg,
      options: finalOptions.map(o => o.expr),
      correctOptionIndex: correctIdx,
      answer: String(correctIdx + 1),
      explanation: explanation,
      sandbox: {
        type: 'variables',
        x: xVal,
        y: yVal,
        isXFarther: isXFarther
      }
    };
  }

  // =========================================================================
  // 4. ПРОТОТИП: СРАВНЕНИЕ РАЗНОСТЕЙ И ВЕЛИЧИН (a < b < c)
  // =========================================================================
  function generateDifferencesTask() {
    // Три точки a, b, c на прямой в порядке a < b < c
    const aVal = randomInt(-5, -2);
    const bVal = randomInt(-1, 2);
    const cVal = randomInt(4, 7);

    // Спрашиваем: какая из разностей ПОЛОЖИТЕЛЬНА или ОТРИЦАТЕЛЬНА
    const askPositive = Math.random() < 0.5;

    // Варианты разностей:
    // a - b (отрицательна, т.к. a < b)
    // b - a (положительна, т.к. b > a)
    // a - c (отрицательна, т.к. a < c)
    // c - a (положительна, т.к. c > a)
    // b - c (отрицательна, т.к. b < c)
    // c - b (положительна, т.к. c > b)

    const diffPool = [
      { expr: 'a &minus; b', isPositive: false, note: 'a &lt; b &rArr; из меньшего вычитаем большее (&lt; 0)' },
      { expr: 'c &minus; a', isPositive: true,  note: 'c &gt; a &rArr; из большего вычитаем меньшее (&gt; 0)' },
      { expr: 'b &minus; c', isPositive: false, note: 'b &lt; c &rArr; из меньшего вычитаем большее (&lt; 0)' },
      { expr: 'c &minus; b', isPositive: true,  note: 'c &gt; b &rArr; из большего вычитаем меньшее (&gt; 0)' },
      { expr: 'b &minus; a', isPositive: true,  note: 'b &gt; a &rArr; из большего вычитаем меньшее (&gt; 0)' },
      { expr: 'a &minus; c', isPositive: false, note: 'a &lt; c &rArr; из меньшего вычитаем большее (&lt; 0)' }
    ];

    const targetPositive = askPositive;
    const matching = diffPool.filter(d => d.isPositive === targetPositive);
    const nonMatching = diffPool.filter(d => d.isPositive !== targetPositive);

    const chosenTarget = randomChoice(matching);
    const chosenOthers = shuffle(nonMatching).slice(0, 2);

    // 4-м вариантом часто бывает «Ни одна из них» или еще одна разность
    const fourthOption = {
      expr: 'Ни одна из них',
      isPositive: false,
      note: 'Среди предложенных вариантов есть верный'
    };

    const finalOptions = shuffle([chosenTarget, chosenOthers[0], chosenOthers[1], fourthOption]);
    const correctIdx = finalOptions.findIndex(o => o === chosenTarget);

    const svg = renderNumberLineSVG({
      min: aVal - 1.5,
      max: cVal + 1.5,
      ticks: [],
      points: [
        { id: 'a', val: aVal },
        { id: 'b', val: bVal },
        { id: 'c', val: cVal }
      ]
    });

    const targetWord = askPositive 
      ? '<span style="color:var(--accent-emerald, #10b981); font-weight:800;">ПОЛОЖИТЕЛЬНА</span> (&gt; 0)'
      : '<span style="color:var(--danger, #ef4444); font-weight:800;">ОТРИЦАТЕЛЬНА</span> (&lt; 0)';

    const explanation = `
      <div class="solution-step">
        <div class="step-num">Шаг 1</div>
        <div class="step-text">
          <strong>Основное свойство координатной прямой:</strong><br>
          Точки расположены слева направо в порядке возрастания:<br>
          <strong>a &lt; b &lt; c</strong> (то есть <strong>a</strong> &mdash; самое маленькое, а <strong>c</strong> &mdash; самое большое).
        </div>
      </div>
      <div class="solution-step">
        <div class="step-num">Шаг 2</div>
        <div class="step-text">
          <strong>Золотое правило знака разности:</strong>
          <ul style="margin: 6px 0 0 18px; line-height: 1.6;">
            <li>Если из <strong>большего</strong> числа вычесть <strong>меньшее</strong> &mdash; разность <strong>положительна</strong> (+).</li>
            <li>Если из <strong>меньшего</strong> числа вычесть <strong>большее</strong> &mdash; разность <strong>отрицательна</strong> (&minus;).</li>
          </ul>
        </div>
      </div>
      <div class="solution-step">
        <div class="step-num">Шаг 3</div>
        <div class="step-text">
          Разберём каждый предложенный вариант:
          <ul style="margin: 8px 0 0 18px; line-height: 1.7;">
            ${finalOptions.map((opt, i) => `
              <li>
                Вариант ${i + 1}) <strong>${opt.expr}</strong>: ${opt.note} 
                ${i === correctIdx ? ` &larr; <strong style="color:var(--accent-emerald, #10b981);">(ПРАВИЛЬНЫЙ ВАРИАНТ)</strong>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    return {
      id: 'diff_comp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      category: 'differences_comparison',
      categoryTitle: 'Сравнение разностей и величин',
      text: `На координатной прямой отмечены числа <strong>a, b</strong> и <strong>c</strong>.<br>Какая из следующих разностей ${targetWord}?`,
      svg: svg,
      options: finalOptions.map(o => o.expr),
      correctOptionIndex: correctIdx,
      answer: String(correctIdx + 1),
      explanation: explanation,
      sandbox: {
        type: 'differences',
        a: aVal,
        b: bVal,
        c: cVal
      }
    };
  }

  // =========================================================================
  // ГЛАВНЫЙ ГЕНЕРАТОР ТРЕНАЖЕРА
  // =========================================================================
  const CATEGORIES = {
    roots_on_line: {
      id: 'roots_on_line',
      title: 'Квадратные корни',
      generator: generateRootsTask
    },
    fractions_and_intervals: {
      id: 'fractions_and_intervals',
      title: 'Дроби и отрезки',
      generator: generateFractionsTask
    },
    variable_inequalities: {
      id: 'variable_inequalities',
      title: 'Неравенства с переменными',
      generator: generateVariablesTask
    },
    differences_comparison: {
      id: 'differences_comparison',
      title: 'Сравнение разностей',
      generator: generateDifferencesTask
    }
  };

  function normalizeTask(t) {
    if (!t) return t;
    if (!t.catName) t.catName = t.categoryTitle || 'Координатная прямая';
    if (!t.displayAnswer) {
      const optText = (t.options && t.options[t.correctOptionIndex]) ? ` (${t.options[t.correctOptionIndex]})` : '';
      t.displayAnswer = String(t.answer) + optText;
    }
    if (!t.questionHtml) {
      const optionsHtml = (t.options || []).map((opt, i) => `
        <div style="padding: 6px 12px; background: rgba(38,63,97,0.06); border: 1px solid rgba(38,63,97,0.14); border-radius: 8px; font-size: 0.92rem; text-align: left;">
          <strong style="color: var(--vermilion, #b7464e);">${i + 1})</strong> ${opt}
        </div>
      `).join('');
      t.questionHtml = `
        <div class="task-prompt" style="font-weight: 600; margin-bottom: 10px; line-height: 1.5;">${t.text}</div>
        <div class="number-line-container" style="width: 100%; max-width: 680px; margin: 12px auto; background: var(--paper-light, #fbf9f4); border: 1px solid rgba(38,63,97,0.18); border-radius: 12px; padding: 12px; display: flex; justify-content: center; overflow-x: auto;">
          ${t.svg}
        </div>
        <div class="options-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          ${optionsHtml}
        </div>
      `;
    }
    if (!t.solutionSteps && t.explanation) {
      const stepMatches = t.explanation.match(/<div class="step-text">([\s\S]*?)<\/div>/g);
      if (stepMatches && stepMatches.length > 0) {
        t.solutionSteps = stepMatches.map(s => s.replace(/<\/?div[^>]*>/g, '').trim());
      } else {
        t.solutionSteps = [t.explanation.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()];
      }
    }
    return t;
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const u = String(userRaw).trim().replace(',', '.');
    const c = String(correctAnswer).trim().replace(',', '.');
    return u === c;
  }

  function generateTask(categoryId) {
    let t = null;
    if (!categoryId || categoryId === 'mixed_all') {
      const allKeys = Object.keys(CATEGORIES);
      const chosenKey = randomChoice(allKeys);
      t = CATEGORIES[chosenKey].generator();
    } else if (CATEGORIES[categoryId]) {
      t = CATEGORIES[categoryId].generator();
    } else {
      t = generateRootsTask();
    }
    return normalizeTask(t);
  }

  return {
    generateTask: generateTask,
    checkAnswer: checkAnswer,
    renderNumberLineSVG: renderNumberLineSVG,
    categories: CATEGORIES
  };

}));
