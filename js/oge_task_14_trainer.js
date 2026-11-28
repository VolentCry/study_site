/**
 * Тренажёр ОГЭ по математике · Задание №14
 * «Арифметическая и геометрическая прогрессии»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask14Trainer = factory();
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

  function formatSpaceNum(n) {
    const val = cleanFloat(n);
    const parts = String(val).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  function pluralRu(n, one, few, many) {
    const abs = Math.abs(Math.trunc(n));
    const mod100 = abs % 100;
    const mod10 = abs % 10;
    if (mod100 >= 11 && mod100 <= 14) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
  }

  // Мини-схема шагов прогрессии (SVG) для наглядности
  function renderStepDiagramSvg(items, opLabel, accentColor) {
    const w = 340;
    const h = 72;
    const stepW = 86;
    const startX = 28;
    const color = accentColor || '#263f61';
    let inner = '';

    items.forEach((lbl, idx) => {
      const cx = startX + idx * stepW;
      const isLast = idx === items.length - 1;
      const boxFill = isLast ? 'rgba(183,70,78,0.12)' : 'rgba(38,63,97,0.06)';
      const boxStroke = isLast ? '#b7464e' : color;
      inner += `<rect x="${cx - 24}" y="22" width="48" height="30" rx="8" fill="${boxFill}" stroke="${boxStroke}" stroke-width="1.8"/>`;
      inner += `<text x="${cx}" y="41" fill="${isLast ? '#b7464e' : '#19273c'}" font-family="DM Sans, sans-serif" font-size="13" font-weight="700" text-anchor="middle">${lbl}</text>`;

      if (!isLast) {
        const ax1 = cx + 26;
        const ax2 = cx + stepW - 26;
        inner += `<line x1="${ax1}" y1="37" x2="${ax2 - 4}" y2="37" stroke="#c8956c" stroke-width="1.8"/>`;
        inner += `<polygon points="${ax2 - 6},33 ${ax2},37 ${ax2 - 6},41" fill="#c8956c"/>`;
        inner += `<text x="${(ax1 + ax2) / 2}" y="16" fill="#b45309" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${opLabel}</text>`;
      }
    });

    return `
      <div style="display:flex; justify-content:center; margin:12px 0 4px;">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="background:#ffffff; border-radius:10px; border:1px solid rgba(38,63,97,0.16); max-width:100%; height:auto;">
          ${inner}
        </svg>
      </div>
    `.trim();
  }

  // =========================================================================
  // 1. АРИФМЕТИЧЕСКАЯ ПРОГРЕССИЯ: n-Й ЧЛЕН (a_n)
  // =========================================================================

  // Амфитеатр / зал: найти число мест в n-м ряду
  function genAmphitheaterTerm() {
    const a1 = randInt(12, 26);
    const d = randInt(2, 5);
    const n = randInt(8, 16);
    const an = a1 + d * (n - 1);

    const totalRows = n + randInt(2, 5);
    const svg = renderStepDiagramSvg([a1, a1 + d, a1 + 2 * d, '?'], `+${d}`);

    return {
      category: 'arith_term',
      catName: 'Арифметическая прогрессия · Амфитеатр',
      questionHtml: `
        <div class="task-text">
          В амфитеатре <strong>${totalRows} ${pluralRu(totalRows, 'ряд', 'ряда', 'рядов')}</strong>. В первом ряду <strong>${a1} ${pluralRu(a1, 'место', 'места', 'мест')}</strong>, а в каждом следующем на <strong>${d} ${pluralRu(d, 'место', 'места', 'мест')}</strong> больше, чем в предыдущем.
          Сколько мест в <strong>${n}-м ряду</strong> амфитеатра?
        </div>
        ${svg}
      `.trim(),
      answer: an,
      displayAnswer: formatNum(an),
      solutionSteps: [
        `Число мест в рядах образует арифметическую прогрессию с первым членом <i>a</i><sub>1</sub> = ${a1} и разностью <i>d</i> = ${d}.`,
        `Формула <i>n</i>-го члена: <i>a</i><sub>n</sub> = <i>a</i><sub>1</sub> + <i>d</i>(<i>n</i> − 1).`,
        `<i>a</i><sub>${n}</sub> = ${a1} + ${d} · (${n} − 1) = ${a1} + ${d} · ${n - 1} = ${a1} + ${d * (n - 1)} = <strong>${an}</strong>.`
      ]
    };
  }

  // Охлаждение / нагревание вещества
  function genTemperatureStep() {
    const isCooling = Math.random() < 0.7;
    const stepMin = pickRandom([3, 4, 5, 6, 10]);
    const stepsCount = randInt(4, 9);
    const totalMin = stepMin * stepsCount;
    const delta = randInt(2, 7);

    if (isCooling) {
      const t0 = randInt(-10, 18);
      const tEnd = t0 - delta * stepsCount;
      return {
        category: 'arith_term',
        catName: 'Охлаждение вещества',
        questionHtml: `
          <div class="task-text">
            В ходе химического опыта температура вещества вначале составляла <strong>${t0}°C</strong>.
            ${stepMin === 1 ? 'Каждую' : 'Каждые'} <strong>${stepMin} ${pluralRu(stepMin, 'минуту', 'минуты', 'минут')}</strong> температура равномерно понижалась на <strong>${delta}°C</strong>.
            Какой стала температура вещества через <strong>${totalMin} ${pluralRu(totalMin, 'минуту', 'минуты', 'минут')}</strong> после начала опыта? Ответ дайте в градусах Цельсия.
          </div>
        `.trim(),
        answer: tEnd,
        displayAnswer: formatNum(tEnd),
        solutionSteps: [
          `Определим число полных шагов охлаждения: ${totalMin} : ${stepMin} = ${stepsCount}.`,
          `Всего температура понизилась на ${stepsCount} · ${delta} = ${stepsCount * delta}°C.`,
          `Итоговая температура: ${t0} − ${stepsCount * delta} = <strong>${tEnd}°C</strong>.`
        ]
      };
    }

    const t0 = randInt(-18, 12);
    const tEnd = t0 + delta * stepsCount;
    return {
      category: 'arith_term',
      catName: 'Нагревание вещества',
      questionHtml: `
        <div class="task-text">
          При нагревании температура прибора сначала была равна <strong>${t0}°C</strong>, а затем каждые <strong>${stepMin} ${pluralRu(stepMin, 'минуту', 'минуты', 'минут')}</strong>
          равномерно повышалась на <strong>${delta}°C</strong>. Какой стала температура через <strong>${totalMin} ${pluralRu(totalMin, 'минуту', 'минуты', 'минут')}</strong>? Ответ дайте в °C.
        </div>
      `.trim(),
      answer: tEnd,
      displayAnswer: formatNum(tEnd),
      solutionSteps: [
        `Число шагов нагревания: ${totalMin} : ${stepMin} = ${stepsCount}.`,
        `Температура выросла на ${stepsCount} · ${delta} = ${stepsCount * delta}°C.`,
        `Итоговая температура: ${t0} + ${stepsCount * delta} = <strong>${tEnd}°C</strong>.`
      ]
    };
  }

  // Явная / рекуррентная арифметическая прогрессия или свойство среднего
  function genArithSequenceExplicit() {
    const mode = pickRandom(['three_terms', 'recurrent', 'middle_prop']);

    if (mode === 'three_terms') {
      const a1 = randInt(-14, 18);
      const d = pickRandom([-6, -5, -4, -3, 3, 4, 5, 6, 7]);
      const n = randInt(9, 18);
      const an = a1 + d * (n - 1);
      const a2 = a1 + d;
      const a3 = a1 + 2 * d;

      return {
        category: 'arith_term',
        catName: 'Формула n-го члена',
        questionHtml: `
          <div class="task-text">
            Дана арифметическая прогрессия (<i>a</i><sub>n</sub>): <strong>${a1}; ${a2}; ${a3}; …</strong>.
            Найдите <strong>${n}-й член</strong> этой прогрессии.
          </div>
        `.trim(),
        answer: an,
        displayAnswer: formatNum(an),
        solutionSteps: [
          `Найдём разность прогрессии: <i>d</i> = <i>a</i><sub>2</sub> − <i>a</i><sub>1</sub> = ${a2} − (${a1}) = ${d}.`,
          `По формуле <i>n</i>-го члена: <i>a</i><sub>${n}</sub> = ${a1} + (${d}) · (${n} − 1) = ${a1} + (${d * (n - 1)}) = <strong>${an}</strong>.`
        ]
      };
    }

    if (mode === 'recurrent') {
      const a1 = randInt(-9, 15);
      const d = pickRandom([-7, -5, -4, -3, 3, 4, 5, 6, 8]);
      const n = randInt(7, 15);
      const an = a1 + d * (n - 1);
      const dSign = d >= 0 ? `+ ${d}` : `− ${Math.abs(d)}`;

      return {
        category: 'arith_term',
        catName: 'Рекуррентная запись',
        questionHtml: `
          <div class="task-text">
            Последовательность (<i>a</i><sub>n</sub>) задана условиями: <i>a</i><sub>1</sub> = <strong>${a1}</strong>,
            <i>a</i><sub>n+1</sub> = <i>a</i><sub>n</sub> ${dSign}. Найдите <strong><i>a</i><sub>${n}</sub></strong>.
          </div>
        `.trim(),
        answer: an,
        displayAnswer: formatNum(an),
        solutionSteps: [
          `Запись <i>a</i><sub>n+1</sub> = <i>a</i><sub>n</sub> ${dSign} означает арифметическую прогрессию с разностью <i>d</i> = ${d}.`,
          `<i>a</i><sub>${n}</sub> = <i>a</i><sub>1</sub> + <i>d</i>(${n} − 1) = ${a1} + (${d}) · ${n - 1} = <strong>${an}</strong>.`
        ]
      };
    }

    // middle_prop: два члена a_k и a_{k+2} -> найти средний (или x в последовательности)
    const aPrev = randInt(-12, 24);
    const d = pickRandom([3, 4, 5, 6, 7, -4, -5, -6]);
    const x = aPrev + d;
    const aNext = aPrev + 2 * d;

    return {
      category: 'arith_term',
      catName: 'Характеристическое свойство',
      questionHtml: `
        <div class="task-text">
          Последовательность чисел <strong>${aPrev}; <i>x</i>; ${aNext}</strong> является арифметической прогрессией.
          Найдите значение <strong><i>x</i></strong>.
        </div>
      `.trim(),
      answer: x,
      displayAnswer: formatNum(x),
      solutionSteps: [
        `Каждый член арифметической прогрессии (начиная со второго) равен среднему арифметическому своих соседей:`,
        `<i>x</i> = ${fracHtml(`${aPrev} + (${aNext})`, '2')} = ${fracHtml(aPrev + aNext, '2')} = <strong>${x}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 2. АРИФМЕТИЧЕСКАЯ ПРОГРЕССИЯ: СУММА (S_n) И ПРИКЛАДНЫЕ ЗАДАЧИ
  // =========================================================================

  // Всего мест в амфитеатре
  function genAmphitheaterSum() {
    const a1 = randInt(12, 24);
    const d = randInt(2, 4);
    const n = randInt(8, 15);
    const an = a1 + d * (n - 1);
    const sn = ((a1 + an) * n) / 2;

    return {
      category: 'arith_sum',
      catName: 'Сумма мест в амфитеатре',
      questionHtml: `
        <div class="task-text">
          В амфитеатре <strong>${n} ${pluralRu(n, 'ряд', 'ряда', 'рядов')}</strong>. В первом ряду <strong>${a1} ${pluralRu(a1, 'место', 'места', 'мест')}</strong>, а в каждом следующем на <strong>${d} ${pluralRu(d, 'место', 'места', 'мест')}</strong> больше, чем в предыдущем.
          Сколько всего мест в амфитеатре?
        </div>
      `.trim(),
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `Найдём число мест в последнем (${n}-м) ряду: <i>a</i><sub>${n}</sub> = ${a1} + ${d} · (${n} − 1) = ${an}.`,
        `Сумма всех мест: <i>S</i><sub>${n}</sub> = ${fracHtml('<i>a</i><sub>1</sub> + <i>a</i><sub>n</sub>', '2')} · <i>n</i> = ${fracHtml(`${a1} + ${an}`, '2')} · ${n} = <strong>${formatSpaceNum(sn)}</strong>.`
      ]
    };
  }

  // Рабочий / прокладка тоннеля / чтение книги / приседание (найти последний день или сумму)
  function genWorkerDailyNorm() {
    const n = pickRandom([8, 10, 12, 14, 15, 16]);
    const a1 = randInt(4, 15);
    const d = randInt(2, 6);
    const an = a1 + d * (n - 1);
    const sn = ((a1 + an) * n) / 2;
    const mode = pickRandom(['find_last', 'find_sum']);

    if (mode === 'find_last') {
      return {
        category: 'arith_sum',
        catName: 'Прокладка тоннеля (поиск aₙ)',
        questionHtml: `
          <div class="task-text">
            Бригада прокладывает тоннель длиной <strong>${formatSpaceNum(sn)} метров</strong>, ежедневно увеличивая норму прокладки на одно и то же число метров.
            Известно, что за первый день бригада проложила <strong>${a1} метров</strong> тоннеля.
            Определите, сколько метров тоннеля проложила бригада в последний день, если вся работа была выполнена за <strong>${n} дней</strong>.
          </div>
        `.trim(),
        answer: an,
        displayAnswer: formatNum(an),
        solutionSteps: [
          `Воспользуемся формулой суммы арифметической прогрессии: <i>S</i><sub>n</sub> = ${fracHtml('<i>a</i><sub>1</sub> + <i>a</i><sub>n</sub>', '2')} · <i>n</i>.`,
          `${sn} = ${fracHtml(`${a1} + <i>a</i><sub>n</sub>`, '2')} · ${n} ⇒ ${a1} + <i>a</i><sub>n</sub> = ${fracHtml(2 * sn, n)} = ${(2 * sn) / n}.`,
          `<i>a</i><sub>${n}</sub> = ${(2 * sn) / n} − ${a1} = <strong>${an} м</strong>.`
        ]
      };
    }

    return {
      category: 'arith_sum',
      catName: 'Тренировки и сумма прогрессии',
      questionHtml: `
        <div class="task-text">
          Спортсмен начал с <strong>${a1} ${pluralRu(a1, 'отжимания', 'отжиманий', 'отжиманий')}</strong> в первый день и каждый следующий день делал на <strong>${d} ${pluralRu(d, 'отжимание', 'отжимания', 'отжиманий')}</strong> больше.
          Сколько всего отжиманий сделал спортсмен за <strong>${n} ${pluralRu(n, 'день', 'дня', 'дней')}</strong> тренировок?
        </div>
      `.trim(),
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `В последний (${n}-й) день: <i>a</i><sub>${n}</sub> = ${a1} + ${d} · (${n} − 1) = ${an}.`,
        `Всего за ${n} ${pluralRu(n, 'день', 'дня', 'дней')}: <i>S</i><sub>${n}</sub> = ${fracHtml(`${a1} + ${an}`, '2')} · ${n} = <strong>${formatSpaceNum(sn)}</strong>.`
      ]
    };
  }

  // Падение камня / глубина ущелья (№339652)
  function genFallingStone() {
    const n = randInt(4, 9);
    const a1 = 5;
    const d = 10;
    const an = a1 + d * (n - 1);
    const sn = ((a1 + an) * n) / 2;

    return {
      category: 'arith_sum',
      catName: 'Свободное падение · Глубина',
      questionHtml: `
        <div class="task-text">
          Камень бросают в глубокое ущелье. При этом в первую секунду он пролетает <strong>5 метров</strong>,
          а в каждую следующую секунду — на <strong>10 метров больше</strong>, чем в предыдущую, до тех пор, пока не достигнет дна ущелья.
          Сколько метров пролетит камень за первые <strong>${n} ${pluralRu(n, 'секунду', 'секунды', 'секунд')}</strong>?
        </div>
      `.trim(),
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `Пройденные за каждую секунду расстояния образуют арифметическую прогрессию: <i>a</i><sub>1</sub> = 5, <i>d</i> = 10.`,
        `За ${n}-ю секунду камень пролетит: <i>a</i><sub>${n}</sub> = 5 + 10 · (${n} − 1) = ${an} м.`,
        `Общий путь за ${n} ${pluralRu(n, 'секунду', 'секунды', 'секунд')}: <i>S</i><sub>${n}</sub> = ${fracHtml(`5 + ${an}`, '2')} · ${n} = <strong>${sn} м</strong>.`
      ]
    };
  }

  // Курс приёма лекарства / капли (лесенка вверх и вниз, подсчёт пузырьков)
  function genMedicineDrops() {
    const d = 5;
    const a1 = 5;
    const upDays = randInt(5, 8); // например 5..8 дней рост до aMax = 5 * upDays
    const maxDose = a1 + d * (upDays - 1); // = 5 * upDays
    const flatDays = randInt(2, 4);
    // Симметричная схема: рост (upDays) + пик (flatDays - 1, если maxDose уже включён в upDays) + спад (upDays - 1)
    // Или чёткий шаблон ФИПИ: "первый день 5 капель, каждый день +5 до 40 капель, 3 дня по 40, затем -5 до 5 капель"
    const upSum = ((a1 + maxDose) * upDays) / 2;
    const flatSum = maxDose * flatDays;
    const downSum = upSum - maxDose; // от (maxDose - 5) до 5
    const totalDrops = upSum + flatSum + downSum;

    // Подбираем объём пузырька (в каплях) так, чтобы ответ был целым числом пузырьков (с остатком -> округление вверх)
    const perBottle = pickRandom([100, 150, 200, 250]);
    const bottles = Math.ceil(totalDrops / perBottle);

    return {
      category: 'arith_sum',
      catName: 'Курс приёма лекарства',
      questionHtml: `
        <div class="task-text">
          Врач прописал пациенту курс лекарства: в первый день нужно принять <strong>${a1} капель</strong>, а в каждый следующий день увеличивать дозу на <strong>${d} капель</strong>,
          пока дневной приём не достигнет <strong>${maxDose} капель</strong>. Далее нужно принимать по <strong>${maxDose} капель</strong> ещё <strong>${flatDays} ${pluralRu(flatDays, 'день', 'дня', 'дней')}</strong>,
          а затем ежедневно уменьшать дозу на <strong>${d} капель</strong> до <strong>${a1} капель</strong> включительно.
          Сколько пузырьков лекарства нужно купить на весь курс, если в каждом пузырьке <strong>${perBottle} капель</strong>?
        </div>
      `.trim(),
      answer: bottles,
      displayAnswer: formatNum(bottles),
      solutionSteps: [
        `Подъём от ${a1} до ${maxDose} капель (${upDays} дн.): <i>S</i><sub>подъёма</sub> = ${fracHtml(`${a1} + ${maxDose}`, '2')} · ${upDays} = ${upSum} капель.`,
        `Постоянный приём (${flatDays} дн. по ${maxDose}): ${flatDays} · ${maxDose} = ${flatSum} капель.`,
        `Снижение от ${maxDose - d} до ${a1} капель (${upDays - 1} дн.): ${upSum - maxDose} капель.`,
        `Всего капель: ${upSum} + ${flatSum} + ${downSum} = ${totalDrops}. Делим на ${perBottle}: ${formatNum(cleanFloat(totalDrops / perBottle))} ⇒ нужно купить <strong>${bottles}</strong> ${pluralRu(bottles, 'пузырёк', 'пузырька', 'пузырьков')}.`
      ]
    };
  }

  // =========================================================================
  // 3. ГЕОМЕТРИЧЕСКАЯ ПРОГРЕССИЯ: n-Й ЧЛЕН (b_n)
  // =========================================================================

  // Деление бактерий / микроорганизмов
  function genBacteriaGrowth() {
    const start = pickRandom([1, 2, 3, 4, 5, 6]);
    const q = pickRandom([2, 3]);
    const stepMin = pickRandom([10, 15, 20, 30]);
    const steps = q === 2 ? randInt(4, 7) : randInt(3, 5);
    const totalMin = stepMin * steps;
    const ans = start * Math.pow(q, steps);

    const svg = renderStepDiagramSvg(
      [start, start * q, start * q * q, '?'],
      `×${q}`,
      '#0f766e'
    );

    return {
      category: 'geom_term',
      catName: 'Рост колонии бактерий',
      questionHtml: `
        <div class="task-text">
          В начале опыта в чашке Петри было <strong>${start}</strong> бактери${start === 1 ? 'я' : start <= 4 ? 'и' : 'й'}.
          Каждые <strong>${stepMin} минут</strong> количество бактерий увеличивается в <strong>${q} раза</strong>.
          Сколько бактерий станет в чашке через <strong>${totalMin} минут</strong> после начала опыта?
        </div>
        ${svg}
      `.trim(),
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps: [
        `Определим, сколько делений (шагов) произойдёт за ${totalMin} минут: ${totalMin} : ${stepMin} = ${steps}.`,
        `После каждого деления количество умножается на ${q}: <i>N</i> = ${start} · ${q}<sup>${steps}</sup> = ${start} · ${Math.pow(q, steps)} = <strong>${formatSpaceNum(ans)}</strong>.`
      ]
    };
  }

  // Радиоактивный распад изотопа (деление на 2 каждые T минут)
  function genRadioactiveDecay() {
    const halfLife = pickRandom([4, 5, 6, 8, 10]);
    const steps = randInt(3, 6);
    const totalMin = halfLife * steps;
    const mult = pickRandom([1, 2, 3, 5, 10]);
    const m0 = mult * Math.pow(2, steps); // всегда даёт целое или .5 если steps+1, здесь строго целое, или сделаем половинки!
    const allowHalf = Math.random() < 0.4;
    const actualM0 = allowHalf ? m0 / 2 : m0;
    const ans = cleanFloat(actualM0 / Math.pow(2, steps));

    return {
      category: 'geom_term',
      catName: 'Распад радиоактивного изотопа',
      questionHtml: `
        <div class="task-text">
          В ходе распада радиоактивного изотопа его масса уменьшается вдвое каждые <strong>${halfLife} минут</strong>.
          В начальный момент масса изотопа составляла <strong>${formatNum(actualM0)} мг</strong>.
          Найдите массу изотопа через <strong>${totalMin} минут</strong>. Ответ дайте в миллиграммах.
        </div>
      `.trim(),
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps: [
        `Число периодов полураспада: ${totalMin} : ${halfLife} = ${steps}.`,
        `За каждый период масса делится на 2: <i>m</i> = ${formatNum(actualM0)} : 2<sup>${steps}</sup> = ${formatNum(actualM0)} : ${Math.pow(2, steps)} = <strong>${formatNum(ans)} мг</strong>.`
      ]
    };
  }

  // Отскоки мячика (на какой отскок высота станет меньше порога ИЛИ высота k-го отскока)
  function genBouncingBall() {
    if (Math.random() < 0.65) {
      // Какой по счёту отскок станет меньше порога (классика ОГЭ!)
      const q = pickRandom([2, 3]);
      const h0 = q === 2 ? pickRandom([320, 360, 400, 480, 500]) : pickRandom([270, 360, 450, 540]);
      const limit = pickRandom([15, 20, 25, 30]);
      let h = h0;
      let bounce = 0;
      const trace = [];
      while (h >= limit && bounce < 10) {
        bounce++;
        h = cleanFloat(h / q);
        trace.push(`${bounce}-й: ${formatNum(h)} см`);
      }

      return {
        category: 'geom_term',
        catName: 'Отскоки мячика',
        questionHtml: `
          <div class="task-text">
            Каучуковый мячик уронили с высоты <strong>${h0} см</strong>. После каждого удара о пол он отскакивает на высоту в <strong>${q} раза</strong> меньше предыдущей.
            После какого по счёту отскока высота, на которую подлетит мячик, станет меньше <strong>${limit} см</strong>?
          </div>
        `.trim(),
        answer: bounce,
        displayAnswer: formatNum(bounce),
        solutionSteps: [
          `Вычислим высоту каждого отскока (каждый раз делим на ${q}):`,
          trace.join(' → ') + '.',
          `Впервые высота стала меньше ${limit} см после <strong>${bounce}-го</strong> отскока.`
        ]
      };
    }

    // Высота k-го отскока (см)
    const k = randInt(3, 5);
    const hEnd = randInt(4, 15);
    const h0 = hEnd * Math.pow(2, k);
    return {
      category: 'geom_term',
      catName: 'Отскоки мячика',
      questionHtml: `
        <div class="task-text">
          Мячик сбросили с высоты <strong>${h0} см</strong>. После каждого отскока от пола его максимальная высота уменьшается вдвое.
          На какую высоту (в см) подлетит мячик после <strong>${k}-го отскока</strong>?
        </div>
      `.trim(),
      answer: hEnd,
      displayAnswer: formatNum(hEnd),
      solutionSteps: [
        `Высота отскоков образует геометрическую прогрессию со знаменателем <i>q</i> = 0,5.`,
        `После ${k}-го отскока: <i>h</i> = ${h0} : 2<sup>${k}</sup> = ${h0} : ${Math.pow(2, k)} = <strong>${hEnd} см</strong>.`
      ]
    };
  }

  // Явная геометрическая прогрессия (b1, b2, b3 -> b_n или свойство b_n^2)
  function genGeomSequenceExplicit() {
    if (Math.random() < 0.65) {
      const b1 = pickRandom([-4, -3, -2, 2, 3, 4, 5]);
      const q = pickRandom([-3, -2, 2, 3]);
      const n = Math.abs(q) === 3 ? randInt(4, 5) : randInt(5, 7);
      const b2 = b1 * q;
      const b3 = b1 * q * q;
      const bn = b1 * Math.pow(q, n - 1);

      return {
        category: 'geom_term',
        catName: 'n-й член геометрической прогрессии',
        questionHtml: `
          <div class="task-text">
            Дана геометрическая прогрессия (<i>b</i><sub>n</sub>): <strong>${b1}; ${b2}; ${b3}; …</strong>.
            Найдите <strong>${n}-й член</strong> этой прогрессии.
          </div>
        `.trim(),
        answer: bn,
        displayAnswer: formatNum(bn),
        solutionSteps: [
          `Знаменатель прогрессии: <i>q</i> = ${b2} : (${b1}) = ${q}.`,
          `<i>b</i><sub>${n}</sub> = <i>b</i><sub>1</sub> · <i>q</i><sup>${n - 1}</sup> = ${b1} · (${q})<sup>${n - 1}</sup> = ${b1} · (${Math.pow(q, n - 1)}) = <strong>${bn}</strong>.`
        ]
      };
    }

    // Положительная прогрессия: известны b_{k-1} и b_{k+1}, найти b_k
    const b1 = randInt(2, 6);
    const q = randInt(2, 5);
    const bk = b1 * q;
    const bNext = bk * q;
    return {
      category: 'geom_term',
      catName: 'Свойство геометрической прогрессии',
      questionHtml: `
        <div class="task-text">
          Последовательность положительных чисел <strong>${b1}; <i>x</i>; ${bNext}</strong> является геометрической прогрессией.
          Найдите <strong><i>x</i></strong>.
        </div>
      `.trim(),
      answer: bk,
      displayAnswer: formatNum(bk),
      solutionSteps: [
        `По характеристическому свойству: <i>x</i><sup>2</sup> = ${b1} · ${bNext} = ${b1 * bNext}.`,
        `Так как все члены положительны: <i>x</i> = √${b1 * bNext} = <strong>${bk}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 4. ГЕОМЕТРИЧЕСКАЯ ПРОГРЕССИЯ: СУММА (S_n) И ПРИКЛАДНЫЕ СЮЖЕТЫ
  // =========================================================================

  function genGeomSumFormula() {
    const b1 = pickRandom([1, 2, 3, 4, 5, -2, -3]);
    const q = pickRandom([-2, 2, 3]);
    const n = Math.abs(q) === 3 ? randInt(4, 5) : randInt(4, 6);
    const qPow = Math.pow(q, n);
    const sn = (b1 * (qPow - 1)) / (q - 1);

    const b2 = b1 * q;
    const b3 = b2 * q;

    return {
      category: 'geom_sum',
      catName: 'Сумма геометрической прогрессии',
      questionHtml: `
        <div class="task-text">
          Дана геометрическая прогрессия (<i>b</i><sub>n</sub>): <strong>${b1}; ${b2}; ${b3}; …</strong>.
          Найдите сумму первых <strong>${n} её членов</strong>.
        </div>
      `.trim(),
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `Найдём знаменатель: <i>q</i> = ${b2} : (${b1}) = ${q}.`,
        `Формула суммы: <i>S</i><sub>n</sub> = ${fracHtml('<i>b</i><sub>1</sub>(<i>q</i><sup>n</sup> − 1)', '<i>q</i> − 1')}.`,
        `<i>S</i><sub>${n}</sub> = ${fracHtml(`${b1} · ((${q})<sup>${n}</sup> − 1)`, `${q} − 1`)} = ${fracHtml(`${b1} · (${qPow - 1})`, q - 1)} = <strong>${sn}</strong>.`
      ]
    };
  }

  function genGeomAppliedSum() {
    const b1 = randInt(2, 5);
    const q = pickRandom([2, 3]);
    const days = q === 2 ? randInt(4, 6) : randInt(3, 5);
    const sn = (b1 * (Math.pow(q, days) - 1)) / (q - 1);

    const plot = Math.random() < 0.5
      ? `Волонтёр в первый день раздал <strong>${b1}</strong> ${pluralRu(b1, 'памятку', 'памятки', 'памяток')}, а в каждый следующий день — в <strong>${q} раза больше</strong>, чем в предыдущий. Сколько всего памяток он раздал за <strong>${days} ${pluralRu(days, 'день', 'дня', 'дней')}</strong>?`
      : `В первый день блогер получил <strong>${b1}</strong> ${pluralRu(b1, 'нового подписчика', 'новых подписчиков', 'новых подписчиков')}, а в каждый следующий день прирост увеличивался в <strong>${q} раза</strong>. Сколько всего новых подписчиков пришло за <strong>${days} ${pluralRu(days, 'день', 'дня', 'дней')}</strong>?`;

    return {
      category: 'geom_sum',
      catName: 'Прикладная сумма прогрессии',
      questionHtml: `<div class="task-text">${plot}</div>`,
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `Числа по дням образуют геометрическую прогрессию: <i>b</i><sub>1</sub> = ${b1}, <i>q</i> = ${q}, <i>n</i> = ${days}.`,
        `<i>S</i><sub>${days}</sub> = ${fracHtml(`${b1}(${q}<sup>${days}</sup> − 1)`, `${q} − 1`)} = <strong>${formatSpaceNum(sn)}</strong>.`
      ]
    };
  }

  function genGeomRecurrentSum() {
    const b1 = randInt(2, 6);
    const q = pickRandom([2, 3, -2]);
    const n = Math.abs(q) === 3 ? 4 : randInt(4, 6);
    const sn = (b1 * (Math.pow(q, n) - 1)) / (q - 1);

    return {
      category: 'geom_sum',
      catName: 'Рекуррентная геометрическая прогрессия',
      questionHtml: `
        <div class="task-text">
          Геометрическая прогрессия (<i>b</i><sub>n</sub>) задана условиями: <i>b</i><sub>1</sub> = <strong>${b1}</strong>,
          <i>b</i><sub>n+1</sub> = <strong>${q < 0 ? `(${q})` : q} · <i>b</i><sub>n</sub></strong>.
          Найдите сумму первых <strong>${n}</strong> её членов.
        </div>
      `.trim(),
      answer: sn,
      displayAnswer: formatNum(sn),
      solutionSteps: [
        `Из условия <i>b</i><sub>n+1</sub> = ${q} · <i>b</i><sub>n</sub> следует, что знаменатель <i>q</i> = ${q}.`,
        `<i>S</i><sub>${n}</sub> = ${fracHtml(`${b1} · ((${q})<sup>${n}</sup> − 1)`, `${q} − 1`)} = <strong>${sn}</strong>.`
      ]
    };
  }

  const GENERATORS = {
    arith_term: [genAmphitheaterTerm, genTemperatureStep, genArithSequenceExplicit],
    arith_sum: [genAmphitheaterSum, genWorkerDailyNorm, genFallingStone, genMedicineDrops],
    geom_term: [genBacteriaGrowth, genRadioactiveDecay, genBouncingBall, genGeomSequenceExplicit],
    geom_sum: [genGeomSumFormula, genGeomAppliedSum, genGeomRecurrentSum]
  };

  function generateTask(category = 'mixed_all') {
    const cat = String(category || 'mixed_all').trim();
    if (GENERATORS[cat]) {
      return pickRandom(GENERATORS[cat])();
    }
    const allGens = [
      ...GENERATORS.arith_term,
      ...GENERATORS.arith_sum,
      ...GENERATORS.geom_term,
      ...GENERATORS.geom_sum
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
