/**
 * Тренажёр ОГЭ по информатике · Задание №7
 * «Информационно-коммуникационные технологии (Сборка URL-адреса и IPv4-адреса)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask7Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function permute(arr) {
    const res = [];
    function backtrack(idx) {
      if (idx === arr.length) {
        res.push(arr.slice());
        return;
      }
      for (let i = idx; i < arr.length; i++) {
        [arr[idx], arr[i]] = [arr[i], arr[idx]];
        backtrack(idx + 1);
        [arr[idx], arr[i]] = [arr[i], arr[idx]];
      }
    }
    backtrack(0);
    return res;
  }

  const URL_TEMPLATES = [
    { proto: 'https', host: 'school', tld: '.ru', dir: '/info', file: '/oge', ext: '.pdf' },
    { proto: 'http', host: 'library', tld: '.org', dir: '/books', file: '/math', ext: '.docx' },
    { proto: 'ftp', host: 'archive', tld: '.net', dir: '/2026', file: '/data', ext: '.zip' },
    { proto: 'https', host: 'portal', tld: '.edu', dir: '/tests', file: '/demo', ext: '.htm' },
    { proto: 'http', host: 'ocean', tld: '.com', dir: '/media', file: '/photo', ext: '.png' },
    { proto: 'ftp', host: 'server', tld: '.ru', dir: '/files', file: '/table', ext: '.xlsx' }
  ];

  function genUrlBuild() {
    const tpl = pickRandom(URL_TEMPLATES);
    const hasDir = Math.random() < 0.7;
    const parts = hasDir
      ? [tpl.proto, '://', tpl.host, tpl.tld, tpl.dir, tpl.file, tpl.ext]
      : [tpl.proto, '://', tpl.host, tpl.tld, '/', tpl.file.slice(1), tpl.ext];

    const fullUrl = parts.join('');
    // Перемешиваем фрагменты и проверяем, что сборка однозначна (никакая другая перестановка не даёт валидный URL с 1 протоколом, 1 доменом и 1 файлом)
    // В нашей схеме разделители '://', '.ru', '/dir', '/file', '.ext' однозначно задают позиции!
    const items = parts.map((text, idx) => ({ origIdx: idx, text }));
    const shuffled = shuffle(items);
    const answerDigits = items
      .map((orig) => String(shuffled.findIndex((s) => s.origIdx === orig.origIdx) + 1))
      .join('');

    const questionHtml = `
      <p>Доступ к файлу <strong>${tpl.file.slice(1)}${tpl.ext}</strong>, находящемуся на сервере <strong>${tpl.host}${tpl.tld}</strong>${hasDir ? ` в каталоге <strong>${tpl.dir.slice(1)}</strong>` : ''}, осуществляется по протоколу <strong>${tpl.proto}</strong>.</p>
      <p>Фрагменты адреса файла закодированы цифрами от 1 до ${parts.length}. Запишите в ответе последовательность этих цифр, кодирующую адрес указанного файла в сети Интернет.</p>
      <div class="inf-fragment-list">
        ${shuffled.map((item, i) => `<div class="inf-fragment-chip"><span class="inf-fragment-key">${i + 1}</span><span>${item.text}</span></div>`).join('')}
      </div>
    `.trim();

    return {
      category: 'url_build',
      catName: 'Сборка URL-адреса',
      questionHtml,
      answer: answerDigits,
      displayAnswer: answerDigits,
      hint: 'Схема URL всегда одинакова: протокол + :// + сервер + /каталог + /файл.расширение.',
      solutionSteps: [
        `Составим полный адрес ресурса: <code>${fullUrl}</code>.`,
        `Разобьём адрес на заданные фрагменты: ${parts.map((p, idx) => `${p} (${answerDigits[idx]})`).join(' → ')}.`,
        `Ответ: <strong>${answerDigits}</strong>.`
      ]
    };
  }

  function isValidIpv4(str) {
    const parts = str.split('.');
    if (parts.length !== 4) return false;
    return parts.every((seg) => {
      if (!/^\d{1,3}$/.test(seg)) return false;
      if (seg.length > 1 && seg.startsWith('0')) return false;
      const num = parseInt(seg, 10);
      return num >= 0 && num <= 255;
    });
  }

  function genIpBuild() {
    const letters = ['А', 'Б', 'В', 'Г'];

    for (let attempt = 0; attempt < 150; attempt++) {
      // Генерируем 4 октета (без 0 спереди, допустимо 1..255)
      const o1 = randInt(10, 250);
      const o2 = randInt(1, 254);
      const o3 = randInt(10, 250);
      const o4 = randInt(1, 254);
      const ipStr = `${o1}.${o2}.${o3}.${o4}`;

      // Выбираем 3 точки разбиения внутри ipStr так, чтобы получились 4 осмысленных куска
      const dotIndices = [];
      for (let i = 0; i < ipStr.length; i++) {
        if (ipStr[i] === '.') dotIndices.push(i);
      }

      // Стратегии разбиения, дающие нетривиальные, но однозначные куски
      const cut1 = dotIndices[0] + pickRandom([-1, 0, 1]);
      const cut2 = dotIndices[1] + pickRandom([0, 1, 2]);
      const cut3 = dotIndices[2] + pickRandom([-1, 0, 1]);
      if (cut1 <= 1 || cut2 <= cut1 + 1 || cut3 <= cut2 + 1 || cut3 >= ipStr.length - 1) continue;

      const frags = [
        ipStr.slice(0, cut1),
        ipStr.slice(cut1, cut2),
        ipStr.slice(cut2, cut3),
        ipStr.slice(cut3)
      ];
      if (new Set(frags).size !== 4) continue;

      // Проверяем все 24 перестановки на валидность IPv4
      const perms = permute([0, 1, 2, 3]);
      const validPerms = perms.filter((p) => isValidIpv4(p.map((idx) => frags[idx]).join('')));
      if (validPerms.length !== 1) continue;

      const shuffledOrder = shuffle([0, 1, 2, 3]);
      // shuffledOrder[letterPos] = originalFragIdx
      const answerLetters = [0, 1, 2, 3]
        .map((origIdx) => letters[shuffledOrder.indexOf(origIdx)])
        .join('');

      const questionHtml = `
        <p>Пётр записал IP-адрес школьного сервера на листке бумаги и положил его в карман куртки. Мама случайно постирала куртку вместе с запиской. После стирки Пётр обнаружил в кармане четыре обрывка с фрагментами IP-адреса. Эти фрагменты обозначены буквами А, Б, В и Г:</p>
        <div class="inf-fragment-list">
          ${shuffledOrder.map((origIdx, i) => `<div class="inf-fragment-chip"><span class="inf-fragment-key">${letters[i]}</span><code>${frags[origIdx]}</code></div>`).join('')}
        </div>
        <p>Восстановите IP-адрес. В ответе укажите последовательность букв, обозначающих фрагменты, в порядке, соответствующем IP-адресу.</p>
      `.trim();

      return {
        category: 'ip_build',
        catName: 'Восстановление IP-адреса',
        questionHtml,
        answer: answerLetters,
        displayAnswer: answerLetters,
        hint: 'IP-адрес состоит из 4 чисел от 0 до 255, разделённых точками. Он не может начинаться или заканчиваться точкой, а две точки не могут стоять рядом.',
        solutionSteps: [
          `Учитываем правило IPv4: 4 октета от 0 до 255, разделённых тремя точками; точка не может стоять первой или последней, а два числа при склейке не должны превышать 255.`,
          `Единственная допустимая комбинация фрагментов: ${answerLetters.split('').map((l) => `${l} (${frags[shuffledOrder[letters.indexOf(l)]]})`).join(' + ')} = <code>${ipStr}</code>.`,
          `Ответ: <strong>${answerLetters}</strong>.`
        ]
      };
    }

    return genUrlBuild();
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'url_build':
        return genUrlBuild();
      case 'ip_build':
        return genIpBuild();
      case 'mixed_all':
      default:
        return pickRandom([genUrlBuild, genIpBuild])();
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const u = String(userRaw).trim().replace(/\s+/g, '').toUpperCase().replace(/Ё/g, 'Е');
    const c = String(correctAnswer).trim().replace(/\s+/g, '').toUpperCase().replace(/Ё/g, 'Е');
    return u.length > 0 && u === c;
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'url_build', title: 'Сборка URL-адреса' },
      { id: 'ip_build', title: 'Восстановление IP-адреса' }
    ]
  };
}));
