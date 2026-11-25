/**
 * Тренажёр ОГЭ по информатике · Задание №6
 * «Программа с условным оператором (ветвление, параметр A)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask6Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function renderCodeTabs(pyCode, algCode, pasCode) {
    const uid = 'code_' + Math.random().toString(36).slice(2, 8);
    return `
      <div class="inf-code-tabs" data-code-group="${uid}">
        <div class="inf-code-tab-bar">
          <button type="button" class="inf-lang-btn active" data-lang="py">Python</button>
          <button type="button" class="inf-lang-btn" data-lang="alg">Алгоритмический язык</button>
          <button type="button" class="inf-lang-btn" data-lang="pas">Pascal</button>
        </div>
        <pre class="inf-code-pre" data-lang="py" style="display:block;">${pyCode}</pre>
        <pre class="inf-code-pre" data-lang="alg" style="display:none;">${algCode}</pre>
        <pre class="inf-code-pre" data-lang="pas" style="display:none;">${pasCode}</pre>
      </div>
    `.trim();
  }

  function generatePairs(count = 9) {
    const pairs = [];
    for (let i = 0; i < count; i++) {
      pairs.push([randInt(-6, 15), randInt(-6, 15)]);
    }
    return pairs;
  }

  function genCountYesNo() {
    const a = randInt(2, 11);
    const b = randInt(2, 11);
    const askNo = Math.random() < 0.35;
    const targetWord = askNo ? 'NO' : 'YES';

    const variants = [
      {
        pyCond: `s > ${a} or t > ${b}`,
        algCond: `s > ${a} или t > ${b}`,
        pasCond: `(s > ${a}) or (t > ${b})`,
        fn: (s, t) => s > a || t > b,
        desc: `s > ${a} ИЛИ t > ${b}`
      },
      {
        pyCond: `s > ${a} and t > ${b}`,
        algCond: `s > ${a} и t > ${b}`,
        pasCond: `(s > ${a}) and (t > ${b})`,
        fn: (s, t) => s > a && t > b,
        desc: `s > ${a} И t > ${b}`
      },
      {
        pyCond: `s >= ${a} or t < ${b}`,
        algCond: `s >= ${a} или t < ${b}`,
        pasCond: `(s >= ${a}) or (t < ${b})`,
        fn: (s, t) => s >= a || t < b,
        desc: `s ≥ ${a} ИЛИ t < ${b}`
      },
      {
        pyCond: `not (s <= ${a}) and t <= ${b}`,
        algCond: `не (s <= ${a}) и t <= ${b}`,
        pasCond: `not (s <= ${a}) and (t <= ${b})`,
        fn: (s, t) => !(s <= a) && t <= b,
        desc: `s > ${a} И t ≤ ${b}`
      }
    ];

    const v = pickRandom(variants);
    const pairs = generatePairs(9);
    let yesCount = 0;
    const trace = pairs.map(([s, t]) => {
      const res = v.fn(s, t);
      if (res) yesCount++;
      return `(${s}; ${t}) → ${res ? 'YES' : 'NO'}`;
    });
    const ans = askNo ? (9 - yesCount) : yesCount;

    const pyCode = `s = int(input())\nt = int(input())\nif ${v.pyCond}:\n    print("YES")\nelse:\n    print("NO")`;
    const algCode = `алг\nнач\nцел s, t\nввод s, t\nесли ${v.algCond}\n  то вывод "YES"\n  иначе вывод "NO"\nвсе\nкон`;
    const pasCode = `var s, t: integer;\nbegin\n  readln(s); readln(t);\n  if ${v.pasCond} then\n    writeln('YES')\n  else\n    writeln('NO');\nend.`;

    const pairsText = pairs.map(([s, t]) => `(${s}, ${t})`).join('; ');
    const questionHtml = `
      <p>Ниже приведена программа, записанная на трёх языках программирования:</p>
      ${renderCodeTabs(pyCode, algCode, pasCode)}
      <p style="margin-top:12px;">Было проведено 9 запусков программы, при которых в качестве значений переменных <code>s</code> и <code>t</code> вводились следующие пары чисел:</p>
      <div class="inf-quote-box"><code>${pairsText}</code></div>
      <p>Сколько было запусков, при которых программа напечатала <strong>«${targetWord}»</strong>?</p>
    `.trim();

    return {
      category: 'count_yes_no',
      catName: 'Подсчёт YES / NO',
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      hint: `Подставьте каждую из 9 пар (s, t) в условие (${v.desc}) и посчитайте, сколько раз оно ${askNo ? 'ложно' : 'истинно'}.`,
      solutionSteps: [
        `Условие вывода «YES»: <code>${v.desc}</code>.`,
        `Проверим все 9 пар: ${trace.join(', ')}.`,
        `Количество ответов «${targetWord}»: <strong>${ans}</strong>.`
      ]
    };
  }

  function genParamA() {
    for (let attempt = 0; attempt < 80; attempt++) {
      const b = randInt(3, 10);
      const useOr = Math.random() < 0.55;
      const pairs = generatePairs(9);

      const evalWithA = (s, t, A) => (useOr ? (s > A || t > b) : (s > A && t > b));
      const countForA = (A) => pairs.reduce((acc, [s, t]) => acc + (evalWithA(s, t, A) ? 1 : 0), 0);

      // Ищем целевое k так, чтобы множество целых A in [-25..35] было непустым и строго ограниченным (не захватывало края -25 и 35)
      const possibleKs = [2, 3, 4, 5, 6, 7];
      const k = pickRandom(possibleKs);
      const validAs = [];
      for (let A = -25; A <= 35; A++) {
        if (countForA(A) === k) validAs.push(A);
      }
      if (validAs.length === 0) continue;
      if (validAs.includes(-25) || validAs.includes(35)) continue;

      const askMode = pickRandom(['count', 'min', 'max']);
      let ans, askText, explainAns;
      if (askMode === 'count') {
        ans = validAs.length;
        askText = `Укажите <strong>количество целых значений</strong> параметра <code>A</code>, при которых для указанных входных данных программа напечатает «YES» ровно <strong>${k} раза</strong>.`;
        explainAns = `Подходят целые значения A ∈ [${validAs[0]}; ${validAs[validAs.length - 1]}], всего их <strong>${ans}</strong>.`;
      } else if (askMode === 'min') {
        ans = validAs[0];
        askText = `Укажите <strong>наименьшее целое значение</strong> параметра <code>A</code>, при котором для указанных входных данных программа напечатает «YES» ровно <strong>${k} раза</strong>.`;
        explainAns = `Наименьшее подходящее значение: <strong>${ans}</strong>.`;
      } else {
        ans = validAs[validAs.length - 1];
        askText = `Укажите <strong>наибольшее целое значение</strong> параметра <code>A</code>, при которых для указанных входных данных программа напечатает «YES» ровно <strong>${k} раза</strong>.`;
        explainAns = `Наибольшее подходящее значение: <strong>${ans}</strong>.`;
      }

      const pyCond = useOr ? `s > A or t > ${b}` : `s > A and t > ${b}`;
      const algCond = useOr ? `s > A или t > ${b}` : `s > A и t > ${b}`;
      const pasCond = useOr ? `(s > A) or (t > ${b})` : `(s > A) and (t > ${b})`;

      const pyCode = `s = int(input())\nt = int(input())\nA = int(input())\nif ${pyCond}:\n    print("YES")\nelse:\n    print("NO")`;
      const algCode = `алг\nнач\nцел s, t, A\nввод s, t, A\nесли ${algCond}\n  то вывод "YES"\n  иначе вывод "NO"\nвсе\nкон`;
      const pasCode = `var s, t, A: integer;\nbegin\n  readln(s); readln(t); readln(A);\n  if ${pasCond} then\n    writeln('YES')\n  else\n    writeln('NO');\nend.`;

      const pairsText = pairs.map(([s, t]) => `(${s}, ${t})`).join('; ');
      const tMatches = pairs.filter(([s, t]) => t > b).map(([s, t]) => `(${s}, ${t})`);
      const sSorted = pairs.map(([s, t]) => `${s} (t=${t})`).join(', ');

      return {
        category: 'param_a',
        catName: 'Поиск параметра A',
        questionHtml: `
          <p>Ниже приведена программа с параметром <code>A</code>:</p>
          ${renderCodeTabs(pyCode, algCode, pasCode)}
          <p style="margin-top:12px;">Было проведено 9 запусков программы, при которых в качестве значений переменных <code>s</code> и <code>t</code> вводились пары:</p>
          <div class="inf-quote-box"><code>${pairsText}</code></div>
          <p>${askText}</p>
        `.trim(),
        answer: ans,
        displayAnswer: String(ans),
        hint: `Сначала отделите пары, где условие с t (t > ${b}) уже однозначно даёт ${useOr ? 'YES' : 'NO'}, а затем отсортируйте значения s в оставшихся парах.`,
        solutionSteps: [
          `Проверим второе условие <code>t > ${b}</code>: ему удовлетворяет ${tMatches.length} пар(ы) (${tMatches.join(', ') || 'нет'}).`,
          `Значения пар: ${sSorted}. Чтобы итоговое число «YES» равнялось ${k}, подбираем границу для <code>s > A</code>.`,
          explainAns
        ]
      };
    }

    return genCountYesNo();
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'count_yes_no':
        return genCountYesNo();
      case 'param_a':
        return genParamA();
      case 'mixed_all':
      default:
        return pickRandom([genCountYesNo, genParamA])();
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const cleaned = String(userRaw).trim().replace(/\s+/g, '').replace(/−/g, '-');
    if (!/^-?\d+$/.test(cleaned)) return false;
    return parseInt(cleaned, 10) === Number(correctAnswer);
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'count_yes_no', title: 'Подсчёт YES / NO' },
      { id: 'param_a', title: 'Задачи с параметром A' }
    ]
  };
}));
