/**
 * Тренажёр ОГЭ по информатике · Задание №4
 * «Формальные описания реальных объектов и процессов (Весовые матрицы и кратчайшие пути)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask4Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const NODES_5 = ['А', 'Б', 'В', 'Г', 'Д'];
  const NODES_6 = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];

  // Поиск кратчайшего простого пути (и опционально с обязательным прохождением через viaIdx)
  function findShortestSimplePath(matrix, startIdx, endIdx, viaIdx = -1) {
    const n = matrix.length;
    let bestDist = Infinity;
    let bestPath = null;
    const visited = new Array(n).fill(false);

    function dfs(curr, dist, path, passedVia) {
      if (dist >= bestDist) return;
      if (curr === endIdx) {
        if (viaIdx === -1 || passedVia) {
          bestDist = dist;
          bestPath = path.slice();
        }
        return;
      }
      for (let nxt = 0; nxt < n; nxt++) {
        const w = matrix[curr][nxt];
        if (w > 0 && !visited[nxt]) {
          visited[nxt] = true;
          path.push(nxt);
          dfs(nxt, dist + w, path, passedVia || nxt === viaIdx);
          path.pop();
          visited[nxt] = false;
        }
      }
    }

    visited[startIdx] = true;
    dfs(startIdx, 0, [startIdx], startIdx === viaIdx);
    return { dist: bestDist, path: bestPath };
  }

  function buildMatrixHtml(nodes, matrix) {
    const header = `<th></th>` + nodes.map((n) => `<th>${n}</th>`).join('');
    const rows = nodes.map((rowName, i) => {
      const cells = nodes.map((_, j) => {
        if (i === j) return `<td class="diag-cell">×</td>`;
        const w = matrix[i][j];
        return `<td>${w > 0 ? w : ''}</td>`;
      }).join('');
      return `<tr><th>${rowName}</th>${cells}</tr>`;
    }).join('');

    return `
      <div class="inf-table-wrap">
        <table class="inf-table">
          <thead><tr>${header}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `.trim();
  }

  function buildGraphSvg(nodes, matrix, highlightPath) {
    const n = nodes.length;
    const cx = 230, cy = 125, rx = 155, ry = 88;
    const coords = nodes.map((_, i) => {
      const angle = (-Math.PI / 2) + (2 * Math.PI * i) / n;
      return {
        x: Math.round(cx + rx * Math.cos(angle)),
        y: Math.round(cy + ry * Math.sin(angle))
      };
    });

    const hiEdges = new Set();
    if (Array.isArray(highlightPath)) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        const a = highlightPath[i], b = highlightPath[i + 1];
        hiEdges.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
      }
    }

    const edgesSvg = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const w = matrix[i][j];
        if (!w) continue;
        const p1 = coords[i], p2 = coords[j];
        const isHi = hiEdges.has(`${i}-${j}`);
        const mx = Math.round((p1.x + p2.x) / 2);
        const my = Math.round((p1.y + p2.y) / 2);
        const stroke = isHi ? 'var(--svg-edge-hi)' : 'var(--svg-edge)';
        const sw = isHi ? 3.2 : 1.7;
        edgesSvg.push(`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${stroke}" stroke-width="${sw}" stroke-opacity="${isHi ? 1 : 0.65}" />`);
        edgesSvg.push(`<rect x="${mx - 10}" y="${my - 10}" width="20" height="20" rx="5" fill="var(--svg-node-fill)" stroke="${stroke}" stroke-width="1.2" />`);
        edgesSvg.push(`<text x="${mx}" y="${my + 4}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--svg-node-text)">${w}</text>`);
      }
    }

    const nodesSvg = coords.map((p, idx) => {
      const isHi = Array.isArray(highlightPath) && highlightPath.includes(idx);
      const stroke = isHi ? 'var(--svg-edge-hi)' : 'var(--svg-node-stroke)';
      return `
        <circle cx="${p.x}" cy="${p.y}" r="18" fill="var(--svg-node-fill)" stroke="${stroke}" stroke-width="${isHi ? 3 : 2}" />
        <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800" fill="var(--svg-node-text)">${nodes[idx]}</text>
      `.trim();
    }).join('');

    return `
      <div class="inf-svg-wrap">
        <svg class="inf-svg-graph" viewBox="0 0 460 250" role="img" aria-label="Схема дорог к заданию 4">
          ${edgesSvg.join('\n')}
          ${nodesSvg}
        </svg>
      </div>
    `.trim();
  }

  function createRandomGraph(nodesCount) {
    const m = Array.from({ length: nodesCount }, () => new Array(nodesCount).fill(0));
    const addEdge = (u, v, w) => {
      m[u][v] = w;
      m[v][u] = w;
    };
    // Базовый остов + дополнительные рёбра, избегая тривиального короткого прямого ребра 0 -> last
    for (let i = 0; i < nodesCount - 1; i++) {
      addEdge(i, i + 1, randInt(1, 6));
    }
    const candidatePairs = [];
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 2; j < nodesCount; j++) {
        if (i === 0 && j === nodesCount - 1) continue; // не ставим прямое ребро старт-финиш или ставим очень длинным
        candidatePairs.push([i, j]);
      }
    }
    const extraCount = randInt(3, Math.min(5, candidatePairs.length));
    const shuffled = candidatePairs.sort(() => Math.random() - 0.5).slice(0, extraCount);
    shuffled.forEach(([u, v]) => addEdge(u, v, randInt(2, 9)));
    if (Math.random() < 0.35) {
      addEdge(0, nodesCount - 1, randInt(13, 22));
    }
    return m;
  }

  function generateTask(category = 'mixed_all') {
    const mode = category === 'mixed_all' ? pickRandom(['shortest_path', 'via_point']) : category;

    for (let attempt = 0; attempt < 60; attempt++) {
      const nodes = mode === 'via_point' ? NODES_6 : pickRandom([NODES_5, NODES_6]);
      const n = nodes.length;
      const matrix = createRandomGraph(n);
      const startIdx = 0;
      const endIdx = n - 1;

      if (mode === 'via_point') {
        const viaIdx = randInt(1, n - 2);
        const res = findShortestSimplePath(matrix, startIdx, endIdx, viaIdx);
        if (!res.path || res.dist === Infinity || res.path.length < 3) continue;

        const pathLabels = res.path.map((i) => nodes[i]).join(' → ');
        const edgeBreakdown = [];
        for (let i = 0; i < res.path.length - 1; i++) {
          const u = res.path[i], v = res.path[i + 1];
          edgeBreakdown.push(`${nodes[u]}–${nodes[v]} (${matrix[u][v]})`);
        }

        const questionHtml = `
          <p>Между населёнными пунктами ${nodes.join(', ')} построены дороги, протяжённость которых (в километрах) приведена в таблице:</p>
          ${buildMatrixHtml(nodes, matrix)}
          <p>Определите длину кратчайшего пути между пунктами <strong>${nodes[startIdx]}</strong> и <strong>${nodes[endIdx]}</strong>, <strong>проходящего через пункт ${nodes[viaIdx]}</strong>. Передвигаться можно только по дорогам, указанным в таблице. Каждый пункт можно посетить только один раз.</p>
        `.trim();

        return {
          category: 'via_point',
          catName: 'Путь через указанный пункт',
          questionHtml,
          answer: res.dist,
          displayAnswer: String(res.dist),
          hint: `Разбейте задачу на два участка: дойдите от ${nodes[startIdx]} до ${nodes[viaIdx]}, а затем от ${nodes[viaIdx]} до ${nodes[endIdx]}, не повторяя вершины.`,
          solutionSteps: [
            `Построим схему дорог по таблице и отметим оптимальный маршрут с посещением пункта <strong>${nodes[viaIdx]}</strong>:${buildGraphSvg(nodes, matrix, res.path)}`,
            `Кратчайший простой маршрут через ${nodes[viaIdx]}: <strong>${pathLabels}</strong>.`,
            `Сложим длины участков: ${edgeBreakdown.join(' + ')} = <strong>${res.dist}</strong> км.`
          ]
        };
      }

      // shortest_path
      const res = findShortestSimplePath(matrix, startIdx, endIdx, -1);
      if (!res.path || res.dist === Infinity || res.path.length < 3) continue;

      const pathLabels = res.path.map((i) => nodes[i]).join(' → ');
      const edgeBreakdown = [];
      for (let i = 0; i < res.path.length - 1; i++) {
        const u = res.path[i], v = res.path[i + 1];
        edgeBreakdown.push(`${nodes[u]}–${nodes[v]} (${matrix[u][v]})`);
      }

      const questionHtml = `
        <p>Между населёнными пунктами ${nodes.join(', ')} построены дороги, протяжённость которых (в километрах) приведена в таблице:</p>
        ${buildMatrixHtml(nodes, matrix)}
        <p>Определите длину кратчайшего пути между пунктами <strong>${nodes[startIdx]}</strong> и <strong>${nodes[endIdx]}</strong>. Передвигаться можно только по дорогам, протяжённость которых указана в таблице.</p>
      `.trim();

      return {
        category: 'shortest_path',
        catName: 'Кратчайший путь по таблице',
        questionHtml,
        answer: res.dist,
        displayAnswer: String(res.dist),
        hint: 'Выпишите соседние пункты из А и постепенно находите минимальные расстояния до каждой следующей вершины (как в алгоритме Дейкстры).',
        solutionSteps: [
          `Визуализируем таблицу в виде взвешенного графа:${buildGraphSvg(nodes, matrix, res.path)}`,
          `Оптимальный маршрут из ${nodes[startIdx]} в ${nodes[endIdx]}: <strong>${pathLabels}</strong>.`,
          `Суммарная длина пути: ${edgeBreakdown.join(' + ')} = <strong>${res.dist}</strong>.`
        ]
      };
    }

    // Фолбэк
    const fbMatrix = [
      [0, 2, 5, 0, 12],
      [2, 0, 2, 6, 0],
      [5, 2, 0, 3, 7],
      [0, 6, 3, 0, 2],
      [12, 0, 7, 2, 0]
    ];
    return {
      category: 'shortest_path',
      catName: 'Кратчайший путь по таблице',
      questionHtml: `<p>Найдите кратчайший путь между А и Д по таблице:</p>${buildMatrixHtml(NODES_5, fbMatrix)}`,
      answer: 9,
      displayAnswer: '9',
      hint: 'Проверьте составные пути через Б, В, Г.',
      solutionSteps: [`Путь А → Б → В → Г → Д: 2 + 2 + 3 + 2 = <strong>9</strong>.`]
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
      { id: 'shortest_path', title: 'Кратчайший путь (А → Е)' },
      { id: 'via_point', title: 'Обязательный пункт' }
    ]
  };
}));
