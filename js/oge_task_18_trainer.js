/**
 * Тренажёр ОГЭ по математике · Задание №18
 * «Фигуры на квадратной решётке (клетчатой бумаге 1×1): площади, тангенсы углов, расстояния и средние линии»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask18Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const CELL_SIZE = 32;

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

  // Генератор SVG сетки
  function renderGridSvg(cols, rows, innerSvgContent) {
    const w = cols * CELL_SIZE;
    const h = rows * CELL_SIZE;
    const patternId = 'grid-' + Math.random().toString(36).substring(2, 8);

    return `
      <div class="grid-canvas-wrap" style="display:flex; justify-content:center; margin:16px 0;">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="grid-svg" style="background:#ffffff; border-radius:10px; border:1px solid rgba(38,63,97,0.22); box-shadow:0 4px 16px rgba(0,0,0,0.06); max-width:100%; height:auto;">
          <defs>
            <pattern id="${patternId}" width="${CELL_SIZE}" height="${CELL_SIZE}" patternUnits="userSpaceOnUse">
              <path d="M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}" fill="none" stroke="rgba(38,63,97,0.18)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="${w}" height="${h}" fill="url(#${patternId})"/>
          <!-- Рамка сетки -->
          <rect width="${w}" height="${h}" fill="none" stroke="rgba(38,63,97,0.3)" stroke-width="1.5"/>
          ${innerSvgContent}
        </svg>
      </div>
    `.trim();
  }

  function pt(gx, gy) {
    return `${gx * CELL_SIZE},${gy * CELL_SIZE}`;
  }

  // 1. Площадь треугольника: S = 1/2 * a * h
  function genTriangleArea() {
    const cols = 9;
    const rows = 7;

    // Горизонтальное основание
    const a = randInt(4, 7); // основание от 4 до 7 клеток
    const h = randInt(3, 5); // высота от 3 до 5 клеток

    const startX = randInt(1, cols - a - 1);
    const startY = rows - randInt(1, 2);

    const xA = startX;
    const yA = startY;
    const xB = startX + a;
    const yB = startY;

    // Вершина C
    // Может быть остроугольным, прямоугольным или тупоугольным
    const xC = randInt(1, cols - 1);
    const yC = startY - h;

    const area = 0.5 * a * h;

    const pts = `${pt(xA, yA)} ${pt(xB, yB)} ${pt(xC, yC)}`;

    // Высота пунктиром (для разбора)
    const svgContent = `
      <polygon points="${pts}" fill="rgba(44, 230, 214, 0.22)" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${xA * CELL_SIZE}" cy="${yA * CELL_SIZE}" r="4" fill="#ff7728"/>
      <circle cx="${xB * CELL_SIZE}" cy="${yB * CELL_SIZE}" r="4" fill="#ff7728"/>
      <circle cx="${xC * CELL_SIZE}" cy="${yC * CELL_SIZE}" r="4" fill="#ff7728"/>
    `;

    const questionHtml = `
      На клетчатой бумаге с размером клетки <strong>1×1</strong> изображён треугольник. Найдите его <strong>площадь</strong>.
      ${renderGridSvg(cols, rows, svgContent)}
    `;

    const solutionSteps = [
      `Площадь треугольника вычисляется по формуле: $S = \\frac{1}{2} \\cdot a \\cdot h$, где $a$ — длина стороны (основания), а $h$ — длина высоты, проведённой к этой стороне.`,
      `Выберем горизонтальную сторону: считаем количество клеток между вершинами основания: $a = ${a}$ клеток.`,
      `Опустим перпендикуляр (высоту) из противоположной вершины на прямую, содержащую основание: $h = ${h}$ клеток.`,
      `Подставляем в формулу площади: $S = \\frac{1}{2} \\cdot ${a} \\cdot ${h} = \\mathbf{${formatNum(area)}}$.`
    ];

    return {
      category: 'area_triangle',
      catName: 'Площадь треугольника',
      questionHtml,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps,
      hint: 'Посчитайте длину горизонтальной стороны по клеткам и опустите на неё вертикальную высоту из верхней вершины.'
    };
  }

  // 2. Площадь трапеции: S = (a + b) / 2 * h
  function genTrapezoidArea() {
    const cols = 9;
    const rows = 7;

    const a = randInt(2, 4); // верхнее основание
    const b = randInt(a + 2, 7); // нижнее основание
    const h = randInt(3, 5); // высота

    const startX = randInt(1, cols - b - 1);
    const startY = rows - randInt(1, 2);

    const xA = startX;
    const yA = startY;
    const xB = startX + b;
    const yB = startY;

    // Смещение верхнего основания
    const offset = randInt(0, b - a);
    const xD = startX + offset;
    const yD = startY - h;
    const xC = xD + a;
    const yC = startY - h;

    const area = ((a + b) / 2) * h;
    const pts = `${pt(xA, yA)} ${pt(xB, yB)} ${pt(xC, yC)} ${pt(xD, yD)}`;

    const svgContent = `
      <polygon points="${pts}" fill="rgba(16, 185, 129, 0.22)" stroke="#059669" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${xA * CELL_SIZE}" cy="${yA * CELL_SIZE}" r="3.5" fill="#ff7728"/>
      <circle cx="${xB * CELL_SIZE}" cy="${yB * CELL_SIZE}" r="3.5" fill="#ff7728"/>
      <circle cx="${xC * CELL_SIZE}" cy="${yC * CELL_SIZE}" r="3.5" fill="#ff7728"/>
      <circle cx="${xD * CELL_SIZE}" cy="${yD * CELL_SIZE}" r="3.5" fill="#ff7728"/>
    `;

    const questionHtml = `
      На клетчатой бумаге с размером клетки <strong>1×1</strong> изображена трапеция. Найдите её <strong>площадь</strong>.
      ${renderGridSvg(cols, rows, svgContent)}
    `;

    const solutionSteps = [
      `Площадь трапеции равна произведению полусуммы оснований на высоту: $S = \\frac{a + b}{2} \\cdot h$.`,
      `Считаем по клеткам длины параллельных оснований: верхнее $a = ${a}$ клеток, нижнее $b = ${b}$ клеток.`,
      `Высота трапеции (расстояние между основаниями по вертикали): $h = ${h}$ клеток.`,
      `Находим площадь: $S = \\frac{${a} + ${b}}{2} \\cdot ${h} = \\frac{${a + b}}{2} \\cdot ${h} = \\mathbf{${formatNum(area)}}$.`
    ];

    return {
      category: 'area_trapezoid',
      catName: 'Площадь трапеции',
      questionHtml,
      answer: area,
      displayAnswer: formatNum(area),
      solutionSteps,
      hint: 'Посчитайте верхнее и нижнее основания по клеткам, сложите их, разделите на 2 и умножьте на высоту.'
    };
  }

  // 3. Площадь параллелограмма и ромба
  function genParallelogramOrRhombus() {
    const isRhombus = Math.random() > 0.5;
    const cols = 9;
    const rows = 7;

    if (isRhombus) {
      // Ромб: диагонали вдоль сетки, S = (d1 * d2) / 2
      const d1 = pickRandom([4, 6, 8]); // горизонтальная диагональ (чётная)
      const d2 = pickRandom([4, 6]);    // вертикальная диагональ (чётная)

      const cx = randInt(1 + d1 / 2, cols - 1 - d1 / 2);
      const cy = randInt(1 + d2 / 2, rows - 1 - d2 / 2);

      const pLeft = pt(cx - d1 / 2, cy);
      const pTop = pt(cx, cy - d2 / 2);
      const pRight = pt(cx + d1 / 2, cy);
      const pBottom = pt(cx, cy + d2 / 2);

      const area = 0.5 * d1 * d2;
      const pts = `${pLeft} ${pTop} ${pRight} ${pBottom}`;

      const svgContent = `
        <polygon points="${pts}" fill="rgba(251, 191, 36, 0.22)" stroke="#d97706" stroke-width="2.5" stroke-linejoin="round"/>
        <line x1="${(cx - d1 / 2) * CELL_SIZE}" y1="${cy * CELL_SIZE}" x2="${(cx + d1 / 2) * CELL_SIZE}" y2="${cy * CELL_SIZE}" stroke="rgba(217, 119, 6, 0.5)" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="${cx * CELL_SIZE}" y1="${(cy - d2 / 2) * CELL_SIZE}" x2="${cx * CELL_SIZE}" y2="${(cy + d2 / 2) * CELL_SIZE}" stroke="rgba(217, 119, 6, 0.5)" stroke-width="1.5" stroke-dasharray="4,4"/>
      `;

      const questionHtml = `
        На клетчатой бумаге с размером клетки <strong>1×1</strong> изображён ромб. Найдите его <strong>площадь</strong>.
        ${renderGridSvg(cols, rows, svgContent)}
      `;

      const solutionSteps = [
        `Площадь ромба равна половине произведения его диагоналей: $S = \\frac{1}{2} \\cdot d_1 \\cdot d_2$.`,
        `Считаем длину горизонтальной диагонали: $d_1 = ${d1}$ клеток.`,
        `Считаем длину вертикальной диагонали: $d_2 = ${d2}$ клеток.`,
        `Вычисляем площадь: $S = \\frac{1}{2} \\cdot ${d1} \\cdot ${d2} = \\mathbf{${formatNum(area)}}$.`
      ];

      return {
        category: 'area_parallelogram',
        catName: 'Площадь ромба',
        questionHtml,
        answer: area,
        displayAnswer: formatNum(area),
        solutionSteps,
        hint: 'Диагонали ромба лежат на линиях сетки. Посчитайте их длины и примените формулу S = (d₁ × d₂) / 2.'
      };
    } else {
      // Параллелограмм: S = a * h
      const a = randInt(4, 6);
      const h = randInt(3, 4);
      const shift = randInt(1, 3);

      const startX = randInt(1, cols - a - shift - 1);
      const startY = rows - randInt(1, 2);

      const p1 = pt(startX, startY);
      const p2 = pt(startX + a, startY);
      const p3 = pt(startX + a + shift, startY - h);
      const p4 = pt(startX + shift, startY - h);

      const area = a * h;
      const pts = `${p1} ${p2} ${p3} ${p4}`;

      const svgContent = `
        <polygon points="${pts}" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="${startX * CELL_SIZE}" cy="${startY * CELL_SIZE}" r="3.5" fill="#0f172a"/>
        <circle cx="${(startX + a) * CELL_SIZE}" cy="${startY * CELL_SIZE}" r="3.5" fill="#0f172a"/>
        <circle cx="${(startX + a + shift) * CELL_SIZE}" cy="${(startY - h) * CELL_SIZE}" r="3.5" fill="#0f172a"/>
        <circle cx="${(startX + shift) * CELL_SIZE}" cy="${(startY - h) * CELL_SIZE}" r="3.5" fill="#0f172a"/>
      `;

      const questionHtml = `
        На клетчатой бумаге с размером клетки <strong>1×1</strong> изображён параллелограмм. Найдите его <strong>площадь</strong>.
        ${renderGridSvg(cols, rows, svgContent)}
      `;

      const solutionSteps = [
        `Площадь параллелограмма вычисляется по формуле: $S = a \\cdot h$, где $a$ — длина стороны, $h$ — проведённая к ней высота.`,
        `Горизонтальная сторона параллелограмма: $a = ${a}$ клеток.`,
        `Высота между горизонтальными сторонами: $h = ${h}$ клеток.`,
        `Находим площадь: $S = ${a} \\cdot ${h} = \\mathbf{${formatNum(area)}}$.`
      ];

      return {
        category: 'area_parallelogram',
        catName: 'Площадь параллелограмма',
        questionHtml,
        answer: area,
        displayAnswer: formatNum(area),
        solutionSteps,
        hint: 'Определите длину горизонтальной стороны и вертикальное расстояние (высоту) между параллельными сторонами.'
      };
    }
  }

  // 4. Тангенс угла на клетках: tg(alpha) = противолежащий / прилежащий
  function genAngleTangent() {
    const cols = 8;
    const rows = 7;

    // Подбираем катеты так, чтобы отношение делилось нацело в десятичную дробь
    const goodPairs = [
      [3, 4], // 0.75
      [1, 2], // 0.5
      [3, 2], // 1.5
      [5, 2], // 2.5
      [1, 4], // 0.25
      [7, 4], // 1.75
      [2, 1], // 2
      [3, 1], // 3
      [4, 1], // 4
      [1, 1], // 1
      [5, 4], // 1.25
      [3, 5]  // 0.6
    ];
    const pair = pickRandom(goodPairs);
    const opp = pair[0]; // противолежащий (вертикальный)
    const adj = pair[1]; // прилежащий (горизонтальный)

    const ox = 1;
    const oy = rows - 1; // вершина угла внизу слева

    const xAx = ox + adj + randInt(1, 2);
    const yAx = oy; // горизонтальный луч

    const xBx = ox + adj;
    const yBx = oy - opp; // точка на наклонном луче

    // Продолжаем наклонный луч дальше точки
    const rayEndX = ox + adj + 1;
    const rayEndY = oy - opp - (opp / adj);

    const tgVal = opp / adj;

    const svgContent = `
      <!-- Лучи угла -->
      <line x1="${ox * CELL_SIZE}" y1="${oy * CELL_SIZE}" x2="${xAx * CELL_SIZE}" y2="${yAx * CELL_SIZE}" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
      <line x1="${ox * CELL_SIZE}" y1="${oy * CELL_SIZE}" x2="${rayEndX * CELL_SIZE}" y2="${rayEndY * CELL_SIZE}" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Пунктирный прямоугольный треугольник для подсказки -->
      <circle cx="${ox * CELL_SIZE}" cy="${oy * CELL_SIZE}" r="4.5" fill="#ea580c"/>
      <circle cx="${xBx * CELL_SIZE}" cy="${yBx * CELL_SIZE}" r="4" fill="#0284c7"/>
      <text x="${(ox + 0.6) * CELL_SIZE}" y="${(oy - 0.3) * CELL_SIZE}" font-size="14" font-weight="800" fill="#ea580c">∠A</text>
    `;

    const questionHtml = `
      На клетчатой бумаге с размером клетки <strong>1×1</strong> изображён угол. Найдите <strong>тангенс этого угла</strong>.
      ${renderGridSvg(cols, rows, svgContent)}
    `;

    const solutionSteps = [
      `Тангенс острого угла в прямоугольном треугольнике равен отношению противолежащего катета к прилежащему катету: $\\text{tg}\\,\\alpha = \\frac{\\text{противолежащий}}{\\text{прилежащий}}$.`,
      `Выберем на наклонном луче точку с целыми координатами (узел сетки): точка с координатами $(${xBx}, ${rows - yBx})$.`,
      `Опустим из неё перпендикуляр на горизонтальный луч. Получился прямоугольный треугольник с катетами:`,
      `• Противолежащий катет (вертикальный) = ${opp} клеток;`,
      `• Прилежащий катет (горизонтальный) = ${adj} клеток.`,
      `Находим тангенс: $\\text{tg}\\,\\alpha = \\frac{${opp}}{${adj}} = ${opp} : ${adj} = \\mathbf{${formatNum(tgVal)}}$.`
    ];

    return {
      category: 'angle_tangent',
      catName: 'Тангенс угла',
      questionHtml,
      answer: tgVal,
      displayAnswer: formatNum(tgVal),
      solutionSteps,
      hint: 'Найдите узел сетки на наклонном луче и достройте прямоугольный треугольник. Разделите вертикальный катет на горизонтальный.'
    };
  }

  // 5. Средняя линия трапеции или треугольника
  function genMidline() {
    const isTrapezoid = Math.random() > 0.4;
    const cols = 9;
    const rows = 7;

    if (isTrapezoid) {
      // Средняя линия трапеции M = (a + b) / 2
      const a = randInt(2, 4);
      const b = randInt(a + 2, 8);
      const h = randInt(3, 4);

      const startX = randInt(1, cols - b - 1);
      const startY = rows - randInt(1, 2);

      const offset = randInt(0, b - a);
      const pts = `${pt(startX, startY)} ${pt(startX + b, startY)} ${pt(startX + offset + a, startY - h)} ${pt(startX + offset, startY - h)}`;

      const midline = (a + b) / 2;

      const svgContent = `
        <polygon points="${pts}" fill="rgba(2, 132, 199, 0.15)" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round"/>
      `;

      const questionHtml = `
        На клетчатой бумаге с размером клетки <strong>1×1</strong> изображена трапеция. Найдите длину её <strong>средней линии</strong>.
        ${renderGridSvg(cols, rows, svgContent)}
      `;

      const solutionSteps = [
        `Средняя линия трапеции параллельна её основаниям, а её длина равна полусумме оснований: $M = \\frac{a + b}{2}$.`,
        `Считаем по клеткам длины оснований:`,
        `• Верхнее основание $a = ${a}$ клеток;`,
        `• Нижнее основание $b = ${b}$ клеток.`,
        `Находим длину средней линии: $M = \\frac{${a} + ${b}}{2} = \\frac{${a + b}}{2} = \\mathbf{${formatNum(midline)}}$.`
      ];

      return {
        category: 'midline',
        catName: 'Средняя линия трапеции',
        questionHtml,
        answer: midline,
        displayAnswer: formatNum(midline),
        solutionSteps,
        hint: 'Длина средней линии трапеции равна полусумме оснований: (a + b) / 2.'
      };
    } else {
      // Средняя линия треугольника M = a / 2
      const a = randInt(4, 8);
      const h = randInt(3, 5);
      const startX = randInt(1, cols - a - 1);
      const startY = rows - randInt(1, 2);

      const topX = randInt(1, cols - 1);
      const pts = `${pt(startX, startY)} ${pt(startX + a, startY)} ${pt(topX, startY - h)}`;
      const midline = a / 2;

      const svgContent = `
        <polygon points="${pts}" fill="rgba(16, 185, 129, 0.18)" stroke="#059669" stroke-width="2.5" stroke-linejoin="round"/>
      `;

      const questionHtml = `
        На клетчатой бумаге с размером клетки <strong>1×1</strong> изображён треугольник. Найдите длину его <strong>средней линии</strong>, параллельной большей горизонтальной стороне.
        ${renderGridSvg(cols, rows, svgContent)}
      `;

      const solutionSteps = [
        `Средняя линия треугольника параллельна стороне и равна её половине: $M = \\frac{a}{2}$.`,
        `Считаем по клеткам горизонтальную сторону: $a = ${a}$ клеток.`,
        `Находим длину средней линии: $M = \\frac{${a}}{2} = \\mathbf{${formatNum(midline)}}$.`
      ];

      return {
        category: 'midline',
        catName: 'Средняя линия треугольника',
        questionHtml,
        answer: midline,
        displayAnswer: formatNum(midline),
        solutionSteps,
        hint: 'Средняя линия треугольника равна половине стороны, которой она параллельна.'
      };
    }
  }

  // 6. Расстояние от точки до прямой
  function genDistance() {
    const cols = 9;
    const rows = 7;

    const d = randInt(2, 5); // расстояние в клетках

    // Горизонтальная прямая
    const lineY = randInt(1, rows - d - 1);
    const pX = randInt(2, cols - 2);
    const pY = lineY + d;

    const svgContent = `
      <line x1="0" y1="${lineY * CELL_SIZE}" x2="${cols * CELL_SIZE}" y2="${lineY * CELL_SIZE}" stroke="#1e293c" stroke-width="3"/>
      <circle cx="${pX * CELL_SIZE}" cy="${pY * CELL_SIZE}" r="5" fill="#ea580c"/>
      <text x="${(pX + 0.3) * CELL_SIZE}" y="${(pY - 0.3) * CELL_SIZE}" font-size="14" font-weight="800" fill="#ea580c">A</text>
    `;

    const questionHtml = `
      На клетчатой бумаге с размером клетки <strong>1×1</strong> отмечена точка $A$ и прямая. Найдите <strong>расстояние от точки $A$ до этой прямой</strong>.
      ${renderGridSvg(cols, rows, svgContent)}
    `;

    const solutionSteps = [
      `Расстояние от точки до прямой — это длина перпендикуляра, опущенного из данной точки на эту прямую.`,
      `Прямая идёт строго по горизонтальной линии сетки. Опускаем перпендикуляр из точки $A$ на прямую по вертикальной линии сетки.`,
      `Считаем количество клеток между точкой $A$ и прямой: $d = \\mathbf{${d}}$.`
    ];

    return {
      category: 'distance',
      catName: 'Расстояние до прямой',
      questionHtml,
      answer: d,
      displayAnswer: formatNum(d),
      solutionSteps,
      hint: 'Расстояние — это длина перпендикуляра. Посчитайте количество клеток по перпендикуляру от точки до прямой.'
    };
  }

  // Главный роутер генерации
  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'area_triangle':
        return genTriangleArea();
      case 'area_trapezoid':
        return genTrapezoidArea();
      case 'area_parallelogram':
        return genParallelogramOrRhombus();
      case 'angle_tangent':
        return genAngleTangent();
      case 'midline':
        return genMidline();
      case 'distance':
        return genDistance();
      case 'mixed_all':
      default: {
        const gens = [genTriangleArea, genTrapezoidArea, genParallelogramOrRhombus, genAngleTangent, genMidline, genDistance];
        return pickRandom(gens)();
      }
    }
  }

  // Проверка ответа пользователя
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
      { id: 'area_triangle', title: 'Площадь треугольника' },
      { id: 'area_trapezoid', title: 'Площадь трапеции' },
      { id: 'area_parallelogram', title: 'Параллелограмм и ромб' },
      { id: 'angle_tangent', title: 'Тангенс угла' },
      { id: 'midline', title: 'Средняя линия' },
      { id: 'distance', title: 'Расстояние' }
    ]
  };
}));
