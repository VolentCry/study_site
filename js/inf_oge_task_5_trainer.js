/**
 * Тренажёр ОГЭ по информатике · Задание №5
 * «Простой линейный алгоритм для формального исполнителя»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask5Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function genFindParam() {
    const executors = [
      {
        name: 'Альфа',
        op1Label: 'прибавь 1',
        op1: (x) => x + 1,
        op2Label: 'умножь на b',
        op2: (x, b) => x * b,
        paramDesc: 'неизвестное натуральное число b (b ≥ 2)'
      },
      {
        name: 'Омега',
        op1Label: 'прибавь b',
        op1: (x, b) => x + b,
        op2Label: 'умножь на 2',
        op2: (x) => x * 2,
        paramDesc: 'неизвестное натуральное число b (b ≥ 2)'
      },
      {
        name: 'Сигма',
        op1Label: 'прибавь 2',
        op1: (x) => x + 2,
        op2Label: 'раздели на b',
        op2: (x, b) => (x % b === 0 ? x / b : null),
        paramDesc: 'неизвестное натуральное число b (b ≥ 2)'
      },
      {
        name: 'Бета',
        op1Label: 'прибавь 1',
        op1: (x) => x + 1,
        op2Label: 'возведи в квадрат',
        op2: (x) => x * x,
        useBOnOp1: true,
        op1LabelB: 'прибавь b',
        op1B: (x, b) => x + b,
        paramDesc: 'неизвестное натуральное число b (b ≥ 2)'
      }
    ];

    for (let attempt = 0; attempt < 120; attempt++) {
      const ex = pickRandom(executors);
      const op1Fn = ex.useBOnOp1 ? ex.op1B : ex.op1;
      const op1Text = ex.useBOnOp1 ? ex.op1LabelB : ex.op1Label;
      const op2Fn = ex.op2;
      const op2Text = ex.op2Label;

      const bTrue = randInt(2, 12);
      const start = randInt(2, 10);
      // 5 команд, обязательно содержащих и 1, и 2
      const progDigits = [];
      for (let i = 0; i < 5; i++) progDigits.push(Math.random() < 0.55 ? '1' : '2');
      if (!progDigits.includes('1') || !progDigits.includes('2')) continue;
      const prog = progDigits.join('');

      const runProg = (bVal) => {
        let cur = start;
        for (const ch of prog) {
          cur = ch === '1' ? op1Fn(cur, bVal) : op2Fn(cur, bVal);
          if (cur === null || !Number.isFinite(cur) || cur > 5000) return null;
        }
        return cur;
      };

      const endVal = runProg(bTrue);
      if (endVal === null || endVal <= start || endVal > 600) continue;

      // Проверка единственности натурального b >= 2
      const matchingBs = [];
      for (let bCand = 2; bCand <= 60; bCand++) {
        if (runProg(bCand) === endVal) matchingBs.push(bCand);
      }
      if (matchingBs.length !== 1 || matchingBs[0] !== bTrue) continue;

      const traceSteps = [];
      let cur = start;
      for (let i = 0; i < prog.length; i++) {
        const ch = prog[i];
        const prev = cur;
        cur = ch === '1' ? op1Fn(cur, bTrue) : op2Fn(cur, bTrue);
        traceSteps.push(`Команда ${ch} (${ch === '1' ? op1Text : op2Text}): ${prev} → ${cur}`);
      }

      const questionHtml = `
        <p>У исполнителя <strong>${ex.name}</strong> две команды, которым присвоены номера:</p>
        <div class="inf-quote-box">
          <strong>1.</strong> ${op1Text}<br>
          <strong>2.</strong> ${op2Text}
        </div>
        <p>где <em>b</em> — ${ex.paramDesc}.</p>
        <p>Выполняя первую из них, ${ex.name} выполняет первое действие, а выполняя вторую — второе. Программа для исполнителя — это последовательность номеров команд.</p>
        <p>Известно, что программа <span class="inf-program-seq">${prog}</span> переводит число <strong>${start}</strong> в число <strong>${endVal}</strong>. Определите значение <strong>b</strong>.</p>
      `.trim();

      return {
        category: 'find_param',
        catName: 'Поиск неизвестного числа b',
        questionHtml,
        answer: bTrue,
        displayAnswer: String(bTrue),
        hint: 'Составьте уравнение, последовательно применяя команды слева направо к начальному числу.',
        solutionSteps: [
          `Применим команды программы <code>${prog}</code> к числу ${start} с параметром b и приравняем итог к ${endVal}.`,
          `Подставляя и решая уравнение для натурального b ≥ 2, получаем <strong>b = ${bTrue}</strong>.`,
          `Проверка: ${traceSteps.join('; ')}.`
        ]
      };
    }

    return {
      category: 'find_param',
      catName: 'Поиск неизвестного числа b',
      questionHtml: `<p>У исполнителя Альфа две команды: <strong>1. прибавь b</strong>; <strong>2. умножь на 2</strong>. Программа <code>11212</code> переводит число 3 в 42. Найдите b (b ≥ 2).</p>`,
      answer: 3,
      displayAnswer: '3',
      hint: 'Составьте выражение (((3 + b + b) · 2) + b) · 2 = 42.',
      solutionSteps: ['(6 + 4b + 2b) = 42 → 6b + 12 = 42 → b = 5? Проверим: 3+3=6, +3=9, *2=18, +3=21, *2=42! Ответ: <strong>3</strong>.']
    };
  }

  function genBuildProgram() {
    const configs = [
      {
        name: 'Вычислитель',
        op1Label: 'прибавь 1',
        op1: (x) => x + 1,
        op2Label: 'умножь на 2',
        op2: (x) => x * 2
      },
      {
        name: 'Калькулятор',
        op1Label: 'вычти 1',
        op1: (x) => x - 1,
        op2Label: 'умножь на 2',
        op2: (x) => x * 2
      },
      {
        name: 'Квадратор',
        op1Label: 'возведи в квадрат',
        op1: (x) => (x <= 30 ? x * x : 9999),
        op2Label: 'прибавь 2',
        op2: (x) => x + 2
      }
    ];

    for (let attempt = 0; attempt < 120; attempt++) {
      const cfg = pickRandom(configs);
      const start = randInt(2, 7);

      // BFS по всем программам длиной от 3 до 5
      const queue = [{ val: start, path: '' }];
      const bestLenByVal = new Map();
      const pathsByVal = new Map();
      bestLenByVal.set(start, 0);

      while (queue.length > 0) {
        const { val, path } = queue.shift();
        if (path.length === 5) continue;
        for (const cmd of ['1', '2']) {
          const nxt = cmd === '1' ? cfg.op1(val) : cfg.op2(val);
          if (nxt < 1 || nxt > 180) continue;
          const npath = path + cmd;
          if (!bestLenByVal.has(nxt)) {
            bestLenByVal.set(nxt, npath.length);
            pathsByVal.set(nxt, [npath]);
            queue.push({ val: nxt, path: npath });
          } else if (bestLenByVal.get(nxt) === npath.length) {
            pathsByVal.get(nxt).push(npath);
          }
        }
      }

      // Выбираем цель, достижимую ровно 1 кратчайшей программой длины 4 или 5
      const candidates = [];
      for (const [val, paths] of pathsByVal.entries()) {
        if (val !== start && val >= 10 && val <= 140 && paths.length === 1 && paths[0].length >= 4 && paths[0].includes('1') && paths[0].includes('2')) {
          candidates.push({ val, prog: paths[0] });
        }
      }
      if (!candidates.length) continue;

      const chosen = pickRandom(candidates);
      let cur = start;
      const trace = [];
      for (const ch of chosen.prog) {
        const prev = cur;
        cur = ch === '1' ? cfg.op1(cur) : cfg.op2(cur);
        trace.push(`${ch}: ${prev} → ${cur}`);
      }

      const questionHtml = `
        <p>У исполнителя <strong>${cfg.name}</strong> две команды, которым присвоены номера:</p>
        <div class="inf-quote-box">
          <strong>1.</strong> ${cfg.op1Label}<br>
          <strong>2.</strong> ${cfg.op2Label}
        </div>
        <p>Составьте алгоритм получения из числа <strong>${start}</strong> числа <strong>${chosen.val}</strong>, содержащий <strong>не более 5 команд</strong>. В ответе запишите только номера команд (например: <code>21211</code>).</p>
      `.trim();

      return {
        category: 'build_program',
        catName: 'Составление программы',
        questionHtml,
        answer: chosen.prog,
        displayAnswer: chosen.prog,
        hint: 'Двигайтесь с конца — от конечного числа к начальному, обращая команды (например, деление на 2 вместо умножения на 2).',
        solutionSteps: [
          `Пойдём обратным ходом от числа <strong>${chosen.val}</strong> к числу <strong>${start}</strong>, подбирая обратные операции на каждом шаге.`,
          `Прямая последовательность команд: ${trace.join('; ')}.`,
          `Ответ (последовательность номеров команд): <strong>${chosen.prog}</strong>.`
        ]
      };
    }

    return genFindParam();
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'find_param':
        return genFindParam();
      case 'build_program':
        return genBuildProgram();
      case 'mixed_all':
      default:
        return pickRandom([genFindParam, genBuildProgram])();
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const u = String(userRaw).trim().replace(/\s+/g, '');
    const c = String(correctAnswer).trim().replace(/\s+/g, '');
    return u.length > 0 && u === c;
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'find_param', title: 'Найти параметр b' },
      { id: 'build_program', title: 'Составить алгоритм' }
    ]
  };
}));
