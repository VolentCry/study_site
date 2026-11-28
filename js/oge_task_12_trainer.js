/**
 * Тренажёр ОГЭ по математике · Задание №12
 * «Расчёты по формулам (физика, геометрия, прикладные формулы)»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (Вариант № 84410035)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask12Trainer = factory();
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
    const val = cleanFloat(n);
    return String(val).replace('.', ',');
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

  // =========================================================================
  // 1. ЭНЕРГИЯ, СИЛЫ И ДВИЖЕНИЕ
  // =========================================================================

  // Кинетическая энергия E = m * v^2 / 2
  function genKineticEnergy() {
    const v = randInt(8, 28);
    // Подбираем m так, чтобы E = m * v^2 / 2 делилось на 1000 без остатка (тыс. Дж)
    // m = 200 * k -> E_kJ = (200 * k * v^2) / 2000 = k * v^2 / 10
    // Чтобы k * v^2 делилось на 10: возьмём k кратным 10 или если v кратно 5/2...
    const kPool = v % 10 === 0 ? [4, 5, 6, 7, 8, 9, 10, 12]
      : v % 5 === 0 ? [4, 6, 8, 10, 12, 14]
      : v % 2 === 0 ? [5, 10, 15]
      : [10, 20];
    const k = pickRandom(kPool);
    const m = 200 * k; // в кг (800..4000)
    const eTotal = (m * v * v) / 2;
    const eThousands = eTotal / 1000;

    return {
      category: 'physics_energy',
      catName: 'Кинетическая энергия',
      questionHtml: `
        <div class="task-text">
          Кинетическая энергия тела массой <i>m</i> (в кг), движущегося со скоростью <i>v</i> (в м/с), вычисляется по формуле
          <span class="formula-inline"><i>E</i> = ${fracHtml('<i>mv</i><sup>2</sup>', '2')}</span> и измеряется в джоулях.
          Известно, что автомобиль массой <strong>${formatSpaceNum(m)} кг</strong> обладает кинетической энергией
          <strong>${formatSpaceNum(eThousands)} тысяч джоулей</strong>. Найдите скорость этого автомобиля (в м/с).
        </div>
      `.trim(),
      answer: v,
      displayAnswer: formatNum(v),
      solutionSteps: [
        `Переведём энергию в джоули: <i>E</i> = ${formatSpaceNum(eThousands)} · 1000 = ${formatSpaceNum(eTotal)} Дж.`,
        `Выразим скорость из формулы: <i>v</i><sup>2</sup> = ${fracHtml('2<i>E</i>', '<i>m</i>')} ⇒ <i>v</i> = √(${fracHtml('2<i>E</i>', '<i>m</i>')}).`,
        `Подставим значения: <i>v</i> = √(${fracHtml(`2 · ${formatSpaceNum(eTotal)}`, formatSpaceNum(m))}) = √${v * v} = <strong>${v} м/с</strong>.`
      ]
    };
  }

  // Потенциальная энергия P = mgh (g = 9,8)
  function genPotentialEnergy() {
    const m = randInt(3, 18);
    const h = pickRandom([5, 10, 15, 20, 25]);
    const p = cleanFloat(m * 9.8 * h);

    if (Math.random() < 0.65) {
      return {
        category: 'physics_energy',
        catName: 'Потенциальная энергия',
        questionHtml: `
          <div class="task-text">
            Если тело массой <i>m</i> кг подвешено на высоте <i>h</i> м над горизонтальной поверхностью земли, то его потенциальная энергия в джоулях вычисляется по формуле
            <span class="formula-inline"><i>P</i> = <i>mgh</i></span>, где <i>g</i> = 9,8 м/с<sup>2</sup> — ускорение свободного падения.
            Найдите массу тела, подвешенного на высоте <strong>${h} м</strong> над поверхностью земли, если его потенциальная энергия равна <strong>${formatNum(p)} Дж</strong>. Ответ дайте в килограммах.
          </div>
        `.trim(),
        answer: m,
        displayAnswer: formatNum(m),
        solutionSteps: [
          `Выразим массу из формулы: <i>m</i> = ${fracHtml('<i>P</i>', '<i>gh</i>')}.`,
          `Вычислим знаменатель: <i>g</i> · <i>h</i> = 9,8 · ${h} = ${formatNum(cleanFloat(9.8 * h))}.`,
          `Найдём массу: <i>m</i> = ${fracHtml(formatNum(p), formatNum(cleanFloat(9.8 * h)))} = <strong>${m} кг</strong>.`
        ]
      };
    }

    return {
      category: 'physics_energy',
      catName: 'Потенциальная энергия',
      questionHtml: `
        <div class="task-text">
          Потенциальная энергия тела массой <i>m</i> кг на высоте <i>h</i> м вычисляется по формуле
          <span class="formula-inline"><i>P</i> = <i>mgh</i></span>, где <i>g</i> = 9,8 м/с<sup>2</sup>.
          Найдите высоту <i>h</i> (в метрах), на которой подвешено тело массой <strong>${m} кг</strong>, если его потенциальная энергия равна <strong>${formatNum(p)} Дж</strong>.
        </div>
      `.trim(),
      answer: h,
      displayAnswer: formatNum(h),
      solutionSteps: [
        `Выразим высоту: <i>h</i> = ${fracHtml('<i>P</i>', '<i>mg</i>')}.`,
        `<i>m</i> · <i>g</i> = ${m} · 9,8 = ${formatNum(cleanFloat(m * 9.8))}.`,
        `<i>h</i> = ${fracHtml(formatNum(p), formatNum(cleanFloat(m * 9.8)))} = <strong>${h} м</strong>.`
      ]
    };
  }

  // Сила Архимеда F = rho * g * V (rho = 1000, g = 9.8)
  function genArchimedesForce() {
    const vSteps = [0.01, 0.02, 0.03, 0.04, 0.05, 0.08, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.2, 1.5];
    const V = pickRandom(vSteps);
    const F = cleanFloat(1000 * 9.8 * V);

    if (Math.random() < 0.7) {
      return {
        category: 'physics_energy',
        catName: 'Сила Архимеда',
        questionHtml: `
          <div class="task-text">
            Сила Архимеда, выталкивающая на поверхность погружённое в воду тело, вычисляется по формуле
            <span class="formula-inline"><i>F</i> = <i>ρgV</i></span>, где <i>ρ</i> = 1000 кг/м<sup>3</sup> — плотность воды,
            <i>g</i> = 9,8 м/с<sup>2</sup> — ускорение свободного падения, а <i>V</i> — объём тела в кубических метрах.
            Найдите силу Архимеда (в ньютонах), действующую на погружённое в воду тело объёмом <strong>${formatNum(V)} куб. м</strong>.
          </div>
        `.trim(),
        answer: F,
        displayAnswer: formatNum(F),
        solutionSteps: [
          `Подставим все значения в формулу: <i>F</i> = 1000 · 9,8 · ${formatNum(V)}.`,
          `1000 · 9,8 = 9800.`,
          `<i>F</i> = 9800 · ${formatNum(V)} = <strong>${formatNum(F)} Н</strong>.`
        ]
      };
    }

    return {
      category: 'physics_energy',
      catName: 'Сила Архимеда',
      questionHtml: `
        <div class="task-text">
          Сила Архимеда вычисляется по формуле <span class="formula-inline"><i>F</i> = <i>ρgV</i></span>, где <i>ρ</i> = 1000 кг/м<sup>3</sup>, <i>g</i> = 9,8 м/с<sup>2</sup>.
          Найдите объём погружённого в воду тела (в куб. м), если на него действует выталкивающая сила <strong>${formatSpaceNum(F)} Н</strong>.
        </div>
      `.trim(),
      answer: V,
      displayAnswer: formatNum(V),
      solutionSteps: [
        `Выразим объём: <i>V</i> = ${fracHtml('<i>F</i>', '<i>ρg</i>')}.`,
        `<i>ρ</i> · <i>g</i> = 1000 · 9,8 = 9800.`,
        `<i>V</i> = ${fracHtml(formatSpaceNum(F), '9800')} = <strong>${formatNum(V)} м<sup>3</sup></strong>.`
      ]
    };
  }

  // Центростремительное ускорение a = omega^2 * R
  function genCentripetal() {
    const omega = randInt(2, 12);
    const R = randInt(2, 15);
    const a = omega * omega * R;

    if (Math.random() < 0.7) {
      return {
        category: 'physics_energy',
        catName: 'Центростремительное ускорение',
        questionHtml: `
          <div class="task-text">
            Центростремительное ускорение при движении по окружности (в м/с<sup>2</sup>) вычисляется по формуле
            <span class="formula-inline"><i>a</i> = <i>ω</i><sup>2</sup><i>R</i></span>, где <i>ω</i> — угловая скорость (в с<sup>−1</sup>),
            а <i>R</i> — радиус окружности (в метрах). Пользуясь этой формулой, найдите радиус <i>R</i> (в метрах),
            если угловая скорость равна <strong>${omega} с<sup>−1</sup></strong>, а центростремительное ускорение равно <strong>${a} м/с<sup>2</sup></strong>.
          </div>
        `.trim(),
        answer: R,
        displayAnswer: formatNum(R),
        solutionSteps: [
          `Важно: запись «с<sup>−1</sup>» — это единица измерения, а не отрицательная степень числа!`,
          `Выразим радиус: <i>R</i> = ${fracHtml('<i>a</i>', '<i>ω</i><sup>2</sup>')}.`,
          `<i>R</i> = ${fracHtml(a, `${omega}<sup>2</sup>`)} = ${fracHtml(a, omega * omega)} = <strong>${R} м</strong>.`
        ]
      };
    }

    return {
      category: 'physics_energy',
      catName: 'Центростремительное ускорение',
      questionHtml: `
        <div class="task-text">
          Из формулы центростремительного ускорения <span class="formula-inline"><i>a</i> = <i>ω</i><sup>2</sup><i>R</i></span>
          найдите угловую скорость <i>ω</i> (в с<sup>−1</sup>), если <i>R</i> = <strong>${R} м</strong>, а <i>a</i> = <strong>${a} м/с<sup>2</sup></strong>.
        </div>
      `.trim(),
      answer: omega,
      displayAnswer: formatNum(omega),
      solutionSteps: [
        `Выразим квадрат угловой скорости: <i>ω</i><sup>2</sup> = ${fracHtml('<i>a</i>', '<i>R</i>')} = ${fracHtml(a, R)} = ${omega * omega}.`,
        `Так как скорость положительна: <i>ω</i> = √${omega * omega} = <strong>${omega} с<sup>−1</sup></strong>.`
      ]
    };
  }

  // =========================================================================
  // 2. ЭЛЕКТРИЧЕСТВО (МОЩНОСТЬ ТОКА И ЗАКОН ДЖОУЛЯ–ЛЕНЦА)
  // =========================================================================

  // Мощность тока P = I^2 * R
  function genElectricPower() {
    const I = randInt(2, 12);
    const R = randInt(3, 18);
    const P = I * I * R;

    if (Math.random() < 0.75) {
      return {
        category: 'electricity',
        catName: 'Мощность постоянного тока',
        questionHtml: `
          <div class="task-text">
            Мощность постоянного тока (в ваттах) вычисляется по формуле
            <span class="formula-inline"><i>P</i> = <i>I</i><sup>2</sup><i>R</i></span>, где <i>I</i> — сила тока (в амперах),
            <i>R</i> — сопротивление (в омах). Пользуясь этой формулой, найдите сопротивление <i>R</i> (в омах),
            если мощность составляет <strong>${formatSpaceNum(P)} Вт</strong>, а сила тока равна <strong>${I} А</strong>.
          </div>
        `.trim(),
        answer: R,
        displayAnswer: formatNum(R),
        solutionSteps: [
          `Выразим сопротивление: <i>R</i> = ${fracHtml('<i>P</i>', '<i>I</i><sup>2</sup>')}.`,
          `Подставим значения: <i>R</i> = ${fracHtml(formatSpaceNum(P), `${I}<sup>2</sup>`)} = ${fracHtml(formatSpaceNum(P), I * I)} = <strong>${R} Ом</strong>.`
        ]
      };
    }

    return {
      category: 'electricity',
      catName: 'Мощность постоянного тока',
      questionHtml: `
        <div class="task-text">
          Мощность постоянного тока (в ваттах) вычисляется по формуле
          <span class="formula-inline"><i>P</i> = <i>I</i><sup>2</sup><i>R</i></span>. Найдите силу тока <i>I</i> (в амперах),
          если мощность равна <strong>${formatSpaceNum(P)} Вт</strong>, а сопротивление <i>R</i> = <strong>${R} Ом</strong>.
        </div>
      `.trim(),
      answer: I,
      displayAnswer: formatNum(I),
      solutionSteps: [
        `Выразим <i>I</i><sup>2</sup>: <i>I</i><sup>2</sup> = ${fracHtml('<i>P</i>', '<i>R</i>')} = ${fracHtml(formatSpaceNum(P), R)} = ${I * I}.`,
        `<i>I</i> = √${I * I} = <strong>${I} А</strong>.`
      ]
    };
  }

  // Закон Джоуля–Ленца Q = I^2 * R * t
  function genJouleLenz() {
    const I = randInt(2, 10);
    const R = randInt(3, 15);
    const t = randInt(2, 12);
    const Q = I * I * R * t;

    const askT = Math.random() < 0.35;
    if (askT) {
      return {
        category: 'electricity',
        catName: 'Закон Джоуля–Ленца',
        questionHtml: `
          <div class="task-text">
            Закон Джоуля–Ленца можно записать в виде <span class="formula-inline"><i>Q</i> = <i>I</i><sup>2</sup><i>Rt</i></span>,
            где <i>Q</i> — количество теплоты (в джоулях), <i>I</i> — сила тока (в амперах),
            <i>R</i> — сопротивление цепи (в омах), а <i>t</i> — время (в секундах). Пользуясь этой формулой,
            найдите время <i>t</i> (в секундах), если <i>Q</i> = <strong>${formatSpaceNum(Q)} Дж</strong>, <i>I</i> = <strong>${I} А</strong>, <i>R</i> = <strong>${R} Ом</strong>.
          </div>
        `.trim(),
        answer: t,
        displayAnswer: formatNum(t),
        solutionSteps: [
          `Выразим время: <i>t</i> = ${fracHtml('<i>Q</i>', '<i>I</i><sup>2</sup><i>R</i>')}.`,
          `Знаменатель: ${I}<sup>2</sup> · ${R} = ${I * I} · ${R} = ${I * I * R}.`,
          `<i>t</i> = ${fracHtml(formatSpaceNum(Q), formatSpaceNum(I * I * R))} = <strong>${t} с</strong>.`
        ]
      };
    }

    return {
      category: 'electricity',
      catName: 'Закон Джоуля–Ленца',
      questionHtml: `
        <div class="task-text">
          Закон Джоуля–Ленца можно записать в виде <span class="formula-inline"><i>Q</i> = <i>I</i><sup>2</sup><i>Rt</i></span>,
          где <i>Q</i> — количество теплоты (в джоулях), <i>I</i> — сила тока (в амперах),
          <i>R</i> — сопротивление цепи (в омах), а <i>t</i> — время (в секундах). Пользуясь этой формулой,
          найдите сопротивление цепи <i>R</i> (в омах), если <i>Q</i> = <strong>${formatSpaceNum(Q)} Дж</strong>, <i>I</i> = <strong>${I} А</strong>, <i>t</i> = <strong>${t} с</strong>.
        </div>
      `.trim(),
      answer: R,
      displayAnswer: formatNum(R),
      solutionSteps: [
        `Выразим сопротивление: <i>R</i> = ${fracHtml('<i>Q</i>', '<i>I</i><sup>2</sup><i>t</i>')}.`,
        `Знаменатель: ${I}<sup>2</sup> · ${t} = ${I * I} · ${t} = ${I * I * t}.`,
        `<i>R</i> = ${fracHtml(formatSpaceNum(Q), formatSpaceNum(I * I * t))} = <strong>${R} Ом</strong>.`
      ]
    };
  }

  // =========================================================================
  // 3. ГЕОМЕТРИЧЕСКИЕ ФОРМУЛЫ
  // =========================================================================

  // Площадь четырёхугольника S = (d1 * d2 * sin(alpha)) / 2
  function genQuadAreaFormula() {
    const mode = pickRandom(['find_d2', 'find_sin', 'find_s']);

    if (mode === 'find_d2') {
      const sinPairs = [
        [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
        [1, 8], [3, 8], [5, 8], [7, 8], [3, 10], [7, 10], [9, 10]
      ];
      const [num, den] = pickRandom(sinPairs);
      const d1 = randInt(4, 15);
      // Подбираем d2 кратным 2 * den или den, чтобы S было красивой десятичной дробью (не более 2 знаков)
      const k = randInt(2, 6);
      const d2 = den * k;
      const S = cleanFloat((d1 * d2 * num) / (2 * den));

      return {
        category: 'geometry_formulas',
        catName: 'Площадь четырёхугольника',
        questionHtml: `
          <div class="task-text">
            Площадь четырёхугольника можно вычислить по формуле
            <span class="formula-inline"><i>S</i> = ${fracHtml('<i>d</i><sub>1</sub><i>d</i><sub>2</sub> sin <i>α</i>', '2')}</span>,
            где <i>d</i><sub>1</sub> и <i>d</i><sub>2</sub> — длины диагоналей четырёхугольника, <i>α</i> — угол между диагоналями.
            Пользуясь этой формулой, найдите длину диагонали <i>d</i><sub>2</sub>, если <i>d</i><sub>1</sub> = <strong>${d1}</strong>,
            sin <i>α</i> = ${fracHtml(num, den)}, а <i>S</i> = <strong>${formatNum(S)}</strong>.
          </div>
        `.trim(),
        answer: d2,
        displayAnswer: formatNum(d2),
        solutionSteps: [
          `Выразим <i>d</i><sub>2</sub> из формулы: <i>d</i><sub>2</sub> = ${fracHtml('2<i>S</i>', '<i>d</i><sub>1</sub> sin <i>α</i>')}.`,
          `Числитель: 2 · ${formatNum(S)} = ${formatNum(cleanFloat(2 * S))}.`,
          `Знаменатель: ${d1} · ${fracHtml(num, den)} = ${formatNum(cleanFloat((d1 * num) / den))}.`,
          `<i>d</i><sub>2</sub> = ${fracHtml(formatNum(cleanFloat(2 * S)), formatNum(cleanFloat((d1 * num) / den)))} = <strong>${d2}</strong>.`
        ]
      };
    }

    if (mode === 'find_sin') {
      const sinVals = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8];
      const sinA = pickRandom(sinVals);
      // d1 * d2 должно делиться так, чтобы S было целым или с 1 знаком
      const d1 = pickRandom([4, 5, 6, 7, 8, 10, 12, 14, 15]);
      const d2 = pickRandom([10, 12, 15, 16, 20]);
      const S = cleanFloat((d1 * d2 * sinA) / 2);

      return {
        category: 'geometry_formulas',
        catName: 'Площадь четырёхугольника',
        questionHtml: `
          <div class="task-text">
            Площадь любого выпуклого четырёхугольника можно вычислять по формуле
            <span class="formula-inline"><i>S</i> = ${fracHtml('1', '2')} <i>d</i><sub>1</sub><i>d</i><sub>2</sub> sin <i>α</i></span>,
            где <i>d</i><sub>1</sub>, <i>d</i><sub>2</sub> — длины его диагоналей, а <i>α</i> — угол между ними.
            Вычислите sin <i>α</i>, если <i>S</i> = <strong>${formatNum(S)}</strong>, <i>d</i><sub>1</sub> = <strong>${d1}</strong>, <i>d</i><sub>2</sub> = <strong>${d2}</strong>.
          </div>
        `.trim(),
        answer: sinA,
        displayAnswer: formatNum(sinA),
        solutionSteps: [
          `Выразим sin <i>α</i>: sin <i>α</i> = ${fracHtml('2<i>S</i>', '<i>d</i><sub>1</sub> · <i>d</i><sub>2</sub>')}.`,
          `Подставим значения: sin <i>α</i> = ${fracHtml(`2 · ${formatNum(S)}`, `${d1} · ${d2}`)} = ${fracHtml(formatNum(cleanFloat(2 * S)), d1 * d2)} = <strong>${formatNum(sinA)}</strong>.`
        ]
      };
    }

    // find_s
    const d1 = randInt(5, 16);
    const d2 = randInt(4, 14);
    const [num, den] = pickRandom([[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5]]);
    // Гарантируем конечную десятичную дробь
    const S = cleanFloat((d1 * d2 * num) / (2 * den));

    return {
      category: 'geometry_formulas',
      catName: 'Площадь четырёхугольника',
      questionHtml: `
        <div class="task-text">
          Площадь четырёхугольника вычисляется по формуле
          <span class="formula-inline"><i>S</i> = ${fracHtml('<i>d</i><sub>1</sub><i>d</i><sub>2</sub> sin <i>α</i>', '2')}</span>.
          Найдите площадь <i>S</i>, если <i>d</i><sub>1</sub> = <strong>${d1}</strong>, <i>d</i><sub>2</sub> = <strong>${d2}</strong>, а sin <i>α</i> = ${fracHtml(num, den)}.
        </div>
      `.trim(),
      answer: S,
      displayAnswer: formatNum(S),
      solutionSteps: [
        `Подставим известные величины в формулу:`,
        `<i>S</i> = ${fracHtml(`${d1} · ${d2} · ${num}`, `2 · ${den}`)} = ${fracHtml(d1 * d2 * num, 2 * den)} = <strong>${formatNum(S)}</strong>.`
      ]
    };
  }

  // =========================================================================
  // 4. ПРИКЛАДНЫЕ И БЫТОВЫЕ ФОРМУЛЫ
  // =========================================================================

  // Перевод температур: F = 1,8 * C + 32
  function genTemperature() {
    if (Math.random() < 0.55) {
      // Найти C по F (C кратно 5, чтобы F было целым, либо произвольное целое C и точное F)
      const C = randInt(-15, 95);
      // Чтобы F было целым, C кратно 5
      const cNice = Math.round(C / 5) * 5;
      const F = cleanFloat(1.8 * cNice + 32);

      return {
        category: 'everyday',
        catName: 'Шкала Цельсия и Фаренгейта',
        questionHtml: `
          <div class="task-text">
            Чтобы перевести значение температуры по шкале Цельсия (<i>t</i> °C) в шкалу Фаренгейта (<i>t</i> °F), пользуются формулой
            <span class="formula-inline"><i>F</i> = 1,8<i>C</i> + 32</span>, где <i>C</i> — градусы Цельсия, <i>F</i> — градусы Фаренгейта.
            Какая температура по шкале Цельсия соответствует <strong>${formatNum(F)}°</strong> по шкале Фаренгейта?
          </div>
        `.trim(),
        answer: cNice,
        displayAnswer: formatNum(cNice),
        solutionSteps: [
          `Подставим <i>F</i> = ${formatNum(F)} в формулу: ${formatNum(F)} = 1,8<i>C</i> + 32.`,
          `Перенесём 32 в левую часть: 1,8<i>C</i> = ${formatNum(F)} − 32 = ${formatNum(cleanFloat(F - 32))}.`,
          `Разделим на 1,8: <i>C</i> = ${fracHtml(formatNum(cleanFloat(F - 32)), '1,8')} = <strong>${formatNum(cNice)} °C</strong>.`
        ]
      };
    }

    // Найти F по C (включая отрицательные температуры)
    const C = pickRandom([randInt(-25, -1), randInt(5, 45)]);
    const F = cleanFloat(1.8 * C + 32);
    return {
      category: 'everyday',
      catName: 'Шкала Цельсия и Фаренгейта',
      questionHtml: `
        <div class="task-text">
          Чтобы перевести температуру по шкале Цельсия в шкалу Фаренгейта, пользуются формулой
          <span class="formula-inline"><i>F</i> = 1,8<i>C</i> + 32</span>, где <i>C</i> — градусы Цельсия, <i>F</i> — градусы Фаренгейта.
          Какая температура по шкале Фаренгейта соответствует <strong>${C}°</strong> по шкале Цельсия?
        </div>
      `.trim(),
      answer: F,
      displayAnswer: formatNum(F),
      solutionSteps: [
        `Подставим <i>C</i> = ${C} в формулу: <i>F</i> = 1,8 · (${C}) + 32.`,
        `1,8 · (${C}) = ${formatNum(cleanFloat(1.8 * C))}.`,
        `<i>F</i> = ${formatNum(cleanFloat(1.8 * C))} + 32 = <strong>${formatNum(F)} °F</strong>.`
      ]
    };
  }

  // Стоимость колодца из железобетонных колец C = C0 + k * n
  function genWellCost() {
    const firm = pickRandom(['«Родник»', '«Чистая вода»', '«Источник»', '«Колодец-Сервис»']);
    const c0 = pickRandom([5500, 6000, 6500, 7000, 7500, 8500]);
    const k = pickRandom([3800, 4000, 4100, 4200, 4400, 4500]);
    const n = randInt(5, 16);
    const total = c0 + k * n;

    if (Math.random() < 0.7) {
      return {
        category: 'everyday',
        catName: 'Расчёт стоимости колодца',
        questionHtml: `
          <div class="task-text">
            В фирме ${firm} стоимость (в рублях) колодца из железобетонных колец рассчитывается по формуле
            <span class="formula-inline"><i>C</i> = ${c0} + ${k}<i>n</i></span>, где <i>n</i> — число колец, установленных при рытье колодца.
            Пользуясь этой формулой, рассчитайте стоимость колодца из <strong>${n} колец</strong>. Ответ дайте в рублях.
          </div>
        `.trim(),
        answer: total,
        displayAnswer: formatNum(total),
        solutionSteps: [
          `Подставим <i>n</i> = ${n} в формулу: <i>C</i> = ${c0} + ${k} · ${n}.`,
          `${k} · ${n} = ${formatSpaceNum(k * n)}.`,
          `<i>C</i> = ${c0} + ${formatSpaceNum(k * n)} = <strong>${formatSpaceNum(total)} руб.</strong>`
        ]
      };
    }

    return {
      category: 'everyday',
      catName: 'Расчёт стоимости колодца',
      questionHtml: `
        <div class="task-text">
          В фирме ${firm} стоимость колодца (в рублях) рассчитывается по формуле
          <span class="formula-inline"><i>C</i> = ${c0} + ${k}<i>n</i></span>, где <i>n</i> — число колец.
          Сколько колец было установлено, если итоговая стоимость колодца составила <strong>${formatSpaceNum(total)} рублей</strong>?
        </div>
      `.trim(),
      answer: n,
      displayAnswer: formatNum(n),
      solutionSteps: [
        `Подставим <i>C</i> = ${formatSpaceNum(total)}: ${formatSpaceNum(total)} = ${c0} + ${k}<i>n</i>.`,
        `${k}<i>n</i> = ${formatSpaceNum(total)} − ${c0} = ${formatSpaceNum(total - c0)}.`,
        `<i>n</i> = ${formatSpaceNum(total - c0)} : ${k} = <strong>${n} колец</strong>.`
      ]
    };
  }

  const GENERATORS = {
    physics_energy: [genKineticEnergy, genPotentialEnergy, genArchimedesForce, genCentripetal],
    electricity: [genElectricPower, genJouleLenz],
    geometry_formulas: [genQuadAreaFormula],
    everyday: [genTemperature, genWellCost]
  };

  function generateTask(category = 'mixed_all') {
    const cat = String(category || 'mixed_all').trim();
    if (GENERATORS[cat]) {
      return pickRandom(GENERATORS[cat])();
    }

    const allGens = [
      ...GENERATORS.physics_energy,
      ...GENERATORS.electricity,
      ...GENERATORS.geometry_formulas,
      ...GENERATORS.everyday
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
    return Math.abs(parsed - Number(correctAnswer)) < 1e-5;
  }

  return {
    generateTask,
    checkAnswer,
    GENERATORS,
    formatNum
  };
}));
