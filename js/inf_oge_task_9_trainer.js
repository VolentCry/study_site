/**
 * Тренажёр ОГЭ по информатике · Задание №9
 * «Анализирование информации в виде схем (Подсчёт путей в ориентированном графе)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask9Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Послойная схема (9 вершин А..И или 10 вершин А..К)
  // Координаты размещены так, чтобы граф был чистым, без наложения подписей и рёбер
  const NODES = [
    { id: 0, name: 'А', x: 52,  y: 125 },
    { id: 1, name: 'Б', x: 155, y: 48 },
    { id: 2, name: 'В', x: 155, y: 125 },
    { id: 3, name: 'Г', x: 155, y: 202 },
    { id: 4, name: 'Д', x: 280, y: 48 },
    { id: 5, name: 'Е', x: 280, y: 125 },
    { id: 6, name: 'Ж', x: 280, y: 202 },
    { id: 7, name: 'З', x: 395, y: 82 },
    { id: 8, name: 'И', x: 395, y: 168 },
    { id: 9, name: 'К', x: 495, y: 125 }
  ];

  // Набор допустимых направленных рёбер (строго слева направо)
  const POSSIBLE_EDGES = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [3, 2],
    [1, 4], [1, 5],
    [2, 4], [2, 5], [2, 6],
    [3, 5], [3, 6],
    [4, 5], [6, 5],
    [4, 7], [5, 7], [5, 8], [6, 8],
    [7, 8],
    [7, 9], [5, 9], [8, 9]
  ];

  function buildRandomDag() {
    // Гарантированный костяк связности + случайные дополнительные рёбра
    const mandatory = new Set([
      '0-1', '0-2', '0-3',
      '1-4', '2-5', '3-6',
      '4-7', '5-7', '5-8', '6-8',
      '7-9', '8-9'
    ]);
    const edges = [];
    for (const [u, v] of POSSIBLE_EDGES) {
      const key = `${u}-${v}`;
      if (mandatory.has(key) || Math.random() < 0.55) {
        edges.push([u, v]);
      }
    }
    return edges;
  }

  // Топологический порядок вершин: так как разрешены вертикальные рёбра (1->2, 3->2, 4->5, 6->5, 7->8),
  // задаём фиксированный корректный порядок: 0, 1, 3, 2, 4, 6, 5, 7, 8, 9
  const TOPO_ORDER = [0, 1, 3, 2, 4, 6, 5, 7, 8, 9];

  function countDagPaths(edges, blockedIdx = -1, requiredIdx = -1) {
    const incoming = Array.from({ length: NODES.length }, () => []);
    edges.forEach(([u, v]) => incoming[v].push(u));

    if (requiredIdx === -1) {
      const dp = new Array(NODES.length).fill(0);
      dp[0] = blockedIdx === 0 ? 0 : 1;
      for (const v of TOPO_ORDER) {
        if (v === 0 || v === blockedIdx) continue;
        let sum = 0;
        for (const u of incoming[v]) sum += dp[u];
        dp[v] = sum;
      }
      return { total: dp[9], dp, incoming };
    }

    // Пути через requiredIdx = пути(0 -> requiredIdx) * пути(requiredIdx -> 9),
    // либо обнуление веток, минующих requiredIdx, через разбиение на 2 прохода
    const dp1 = new Array(NODES.length).fill(0);
    dp1[0] = 1;
    for (const v of TOPO_ORDER) {
      if (v === 0) continue;
      for (const u of incoming[v]) dp1[v] += dp1[u];
    }
    const dp2 = new Array(NODES.length).fill(0);
    dp2[requiredIdx] = dp1[requiredIdx];
    const reqPos = TOPO_ORDER.indexOf(requiredIdx);
    for (let i = reqPos + 1; i < TOPO_ORDER.length; i++) {
      const v = TOPO_ORDER[i];
      for (const u of incoming[v]) dp2[v] += dp2[u];
    }
    return { total: dp2[9], dp1, dp2, incoming };
  }

  function renderDagSvg(edges, labelsMap, highlightId = -1, blockedId = -1) {
    const markerId = 'arr_' + Math.random().toString(36).slice(2, 8);
    const lines = edges.map(([u, v]) => {
      const p1 = NODES[u], p2 = NODES[v];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const r = 17;
      const x1 = (p1.x + (dx / dist) * r).toFixed(1);
      const y1 = (p1.y + (dy / dist) * r).toFixed(1);
      const x2 = (p2.x - (dx / dist) * (r + 4)).toFixed(1);
      const y2 = (p2.y - (dy / dist) * (r + 4)).toFixed(1);
      const faded = u === blockedId || v === blockedId;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${faded ? 'var(--error)' : 'var(--svg-edge)'}" stroke-width="1.9" stroke-dasharray="${faded ? '4 4' : 'none'}" stroke-opacity="${faded ? 0.35 : 0.85}" marker-end="url(#${markerId})" />`;
    }).join('\n');

    const circles = NODES.map((n) => {
      let stroke = 'var(--svg-node-stroke)';
      if (n.id === highlightId) stroke = 'var(--warm)';
      if (n.id === blockedId) stroke = 'var(--error)';
      const valBadge = labelsMap && labelsMap[n.id] !== undefined
        ? `<text x="${n.x}" y="${n.y - 21}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--warm)">${labelsMap[n.id]}</text>`
        : '';
      return `
        <circle cx="${n.x}" cy="${n.y}" r="16" fill="var(--svg-node-fill)" stroke="${stroke}" stroke-width="${(n.id === highlightId || n.id === blockedId) ? 2.8 : 2}" />
        <text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800" fill="var(--svg-node-text)">${n.name}</text>
        ${valBadge}
      `.trim();
    }).join('\n');

    return `
      <div class="inf-svg-wrap">
        <svg class="inf-svg-graph" viewBox="0 0 550 250" role="img" aria-label="Схема дорог к заданию 9">
          <defs>
            <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="var(--svg-edge)" />
            </marker>
          </defs>
          ${lines}
          ${circles}
        </svg>
      </div>
    `.trim();
  }

  function generateTask(category = 'mixed_all') {
    const mode = category === 'mixed_all' ? pickRandom(['all_paths', 'pass_through', 'avoid_city']) : category;

    for (let attempt = 0; attempt < 80; attempt++) {
      const edges = buildRandomDag();
      const baseRes = countDagPaths(edges);
      if (baseRes.total < 6 || baseRes.total > 80) continue;

      if (mode === 'all_paths') {
        const dpSteps = TOPO_ORDER.map((v) => {
          if (v === 0) return 'А = 1';
          const inc = baseRes.incoming[v].map((u) => NODES[u].name).join(' + ');
          return `${NODES[v].name} = ${inc} = ${baseRes.dp[v]}`;
        });
        const labels = Object.fromEntries(NODES.map((n) => [n.id, baseRes.dp[n.id]]));

        return {
          category: 'all_paths',
          catName: 'Все пути А → К',
          questionHtml: `
            <p>На рисунке — схема дорог, связывающих города А, Б, В, Г, Д, Е, Ж, З, И, К. По каждой дороге можно двигаться только в одном направлении, указанном стрелкой.</p>
            ${renderDagSvg(edges)}
            <p>Сколько существует различных путей из города <strong>А</strong> в город <strong>К</strong>?</p>
          `.trim(),
          answer: baseRes.total,
          displayAnswer: String(baseRes.total),
          hint: 'Подписывайте около каждого города число путей, ведущих в него из А: для А это 1, а для каждого следующего — сумма значений всех входящих стрелок.',
          solutionSteps: [
            `Применим метод динамического программирования слева направо (для каждой вершины складываем значения предков):`,
            dpSteps.join('; ') + '.',
            `Разметка значений над вершинами:${renderDagSvg(edges, labels)}`,
            `Итоговое количество путей в город К: <strong>${baseRes.total}</strong>.`
          ]
        };
      }

      if (mode === 'pass_through') {
        const reqIdx = pickRandom([2, 5]); // В или Е
        const res = countDagPaths(edges, -1, reqIdx);
        if (res.total < 2 || res.total >= baseRes.total) continue;
        const reqName = NODES[reqIdx].name;
        const labels = Object.fromEntries(NODES.map((n) => [n.id, res.dp2[n.id]]));

        return {
          category: 'pass_through',
          catName: 'Пути через указанный город',
          questionHtml: `
            <p>На рисунке — схема дорог, связывающих города А, Б, В, Г, Д, Е, Ж, З, И, К. По каждой дороге можно двигаться только в направлении стрелки.</p>
            ${renderDagSvg(edges, null, reqIdx, -1)}
            <p>Сколько существует различных путей из города <strong>А</strong> в город <strong>К</strong>, <strong>проходящих через город ${reqName}</strong>?</p>
          `.trim(),
          answer: res.total,
          displayAnswer: String(res.total),
          hint: `Сначала найдите количество путей из А в ${reqName}, а затем считайте пути дальше от ${reqName} в К, игнорируя дороги, которые не выходят из ${reqName} (или не связаны с ним).`,
          solutionSteps: [
            `Сначала посчитаем количество способов добраться из А в обязательный город <strong>${reqName}</strong>: их ровно <strong>${res.dp1[reqIdx]}</strong>.`,
            `Далее стартуем из ${reqName} с весом ${res.dp1[reqIdx]} и отбрасываем пути, идущие в обход ${reqName}:${renderDagSvg(edges, labels, reqIdx, -1)}`,
            `Количество путей из А в К через город ${reqName}: <strong>${res.total}</strong>.`
          ]
        };
      }

      // avoid_city
      const blkIdx = pickRandom([1, 2, 3, 4, 5, 6]);
      const res = countDagPaths(edges, blkIdx, -1);
      if (res.total < 2 || res.total >= baseRes.total) continue;
      const blkName = NODES[blkIdx].name;
      const labels = Object.fromEntries(NODES.map((n) => [n.id, res.dp[n.id]]));

      return {
        category: 'avoid_city',
        catName: 'Пути, не проходящие через город',
        questionHtml: `
          <p>На рисунке — схема дорог, связывающих города А, Б, В, Г, Д, Е, Ж, З, И, К. По каждой дороге можно двигаться только в направлении стрелки.</p>
          ${renderDagSvg(edges)}
          <p>Сколько существует различных путей из города <strong>А</strong> в город <strong>К</strong>, <strong>НЕ проходящих через город ${blkName}</strong>?</p>
        `.trim(),
        answer: res.total,
        displayAnswer: String(res.total),
        hint: `Мысленно вычеркните город ${blkName} и все входящие/исходящие из него стрелки, а затем посчитайте пути для оставшихся городов.`,
        solutionSteps: [
          `Приравняем количество путей через запрещённый город <strong>${blkName}</strong> к нулю (пунктирные дороги исключаются).`,
          `Подсчитаем пути для оставшегося графа:${renderDagSvg(edges, labels, -1, blkIdx)}`,
          `Количество путей в К в обход города ${blkName}: <strong>${res.total}</strong>.`
        ]
      };
    }

    // Фолбэк
    const fbEdges = [[0,1],[0,2],[1,4],[2,4],[2,5],[4,7],[5,8],[7,9],[8,9]];
    return {
      category: 'all_paths',
      catName: 'Все пути А → К',
      questionHtml: `<p>Сколько существует путей из А в К?</p>${renderDagSvg(fbEdges)}`,
      answer: 3,
      displayAnswer: '3',
      hint: 'Сложите значения входящих стрелок для каждой вершины.',
      solutionSteps: ['А=1, Б=1, В=1, Д=2, Е=1, З=2, И=1, К=2+1=<strong>3</strong>.']
    };
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const cleaned = String(userRaw).trim().replace(/\s+/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    return parseInt(cleaned, 10) === Number(correctAnswer);
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'all_paths', title: 'Все пути А → К' },
      { id: 'pass_through', title: 'Через заданный город' },
      { id: 'avoid_city', title: 'В обход города' }
    ]
  };
}));
