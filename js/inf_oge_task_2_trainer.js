/**
 * Тренажёр ОГЭ по информатике · Задание №2
 * «Кодирование и декодирование информации (условие Фано, однозначная расшифровка)»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask2Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Подсчёт всех возможных расшифровок (ограничение maxCount для скорости)
  function findDecodings(encoded, entries, maxCount = 3) {
    const results = [];
    function dfs(pos, acc) {
      if (results.length >= maxCount) return;
      if (pos === encoded.length) {
        results.push(acc.slice());
        return;
      }
      for (const [letter, code] of entries) {
        if (encoded.startsWith(code, pos)) {
          acc.push(letter);
          dfs(pos + code.length, acc);
          acc.pop();
        }
      }
    }
    dfs(0, []);
    return results;
  }

  function buildCodeTableHtml(entries) {
    const ths = entries.map(([l]) => `<th>${l}</th>`).join('');
    const tds = entries.map(([, c]) => `<td>${c}</td>`).join('');
    return `
      <div class="inf-table-wrap">
        <table class="inf-table">
          <thead><tr>${ths}</tr></thead>
          <tbody><tr>${tds}</tr></tbody>
        </table>
      </div>
    `.trim();
  }

  const WORDS_POOL = [
    'ОБЛАКО', 'РАКЕТА', 'МОДЕЛЬ', 'ПОБЕДА', 'КОМПАС', 'СИГНАЛ',
    'РОТОР', 'КАСКАД', 'АЛМАЗ', 'ВЕКТОР', 'БИНОМ', 'МАРС',
    'КОМЕТА', 'ЗАДАЧА', 'ЛОГИКА', 'ПАРОЛЬ', 'СЕРВЕР', 'ГРАФ'
  ];

  // Готовые однозначные/неоднозначные шаблоны кодов (проверяются алгоритмом findDecodings)
  const BINARY_CODE_SETS = [
    ['00', '01', '100', '101', '110', '111'],
    ['0', '10', '110', '1110', '11110', '11111'],
    ['01', '10', '11', '000', '001', '101'],
    ['00', '11', '010', '011', '100', '101'],
    ['000', '001', '01', '100', '101', '11'],
    ['0', '01', '10', '110', '111', '101'] // смешанный: findDecodings отфильтрует только однозначные слова!
  ];

  const SYMBOL_CODE_SETS = [
    ['+−', '−+', '++', '−−+', '−−−', '+−−'],
    ['*', '#', '+*', '++', '−+', '*−'],
    ['@', '#@', '##', '+@', '+#', '@#'],
    ['+−', '+−+', '−+', '−−', '++', '−+−']
  ];

  function genDecodeTask(mode) {
    const isSymbol = mode === 'symbols_decode';
    const sets = isSymbol ? SYMBOL_CODE_SETS : BINARY_CODE_SETS;

    for (let attempt = 0; attempt < 80; attempt++) {
      const rawWord = pickRandom(WORDS_POOL);
      const uniqueLetters = Array.from(new Set(rawWord.split('')));
      if (uniqueLetters.length > 6 || uniqueLetters.length < 4) continue;

      const extraLetters = shuffle(['А', 'Б', 'В', 'Г', 'Д', 'Е', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т'])
        .filter((l) => !uniqueLetters.includes(l));
      while (uniqueLetters.length < 6) {
        uniqueLetters.push(extraLetters.pop());
      }

      const codeList = shuffle(pickRandom(sets)).slice(0, 6);
      const lettersShuffled = shuffle(uniqueLetters);
      const entries = lettersShuffled.map((l, i) => [l, codeList[i]]).sort((a, b) => a[0].localeCompare(b[0], 'ru'));
      const map = Object.fromEntries(entries);

      const encoded = rawWord.split('').map((ch) => map[ch]).join('');
      const decodings = findDecodings(encoded, entries, 2);
      if (decodings.length === 1 && decodings[0].join('') === rawWord) {
        const steps = [];
        let cursor = 0;
        const breakdown = [];
        for (const ch of rawWord) {
          const c = map[ch];
          breakdown.push(`${c} → ${ch}`);
          cursor += c.length;
        }
        steps.push(`Разбиваем кодовую цепочку <code>${encoded}</code> по таблице так, чтобы каждая часть однозначно соответствовала букве.`);
        steps.push(`Единственно возможная разбивка: <code>${rawWord.split('').map((ch) => map[ch]).join(' | ')}</code>.`);
        steps.push(`Сопоставляем буквы: ${breakdown.join(', ')}. Получаем слово <strong>${rawWord}</strong>.`);

        const questionHtml = `
          <p>От разведчика было получено сообщение:</p>
          <div class="inf-quote-box"><code style="font-size:18px; letter-spacing:0.12em;">${encoded}</code></div>
          <p>В этом сообщении зашифрован пароль — последовательность русских букв. В пароле использовались только буквы, имеющиеся в таблице:</p>
          ${buildCodeTableHtml(entries)}
          <p>Расшифруйте сообщение. В ответе запишите получившееся слово.</p>
        `.trim();

        return {
          category: mode,
          catName: isSymbol ? 'Символьное кодирование' : 'Двоичное кодирование',
          questionHtml,
          answer: rawWord,
          displayAnswer: rawWord,
          hint: 'Идите с начала (или с конца) строки и проверяйте, какие кодовые слова подходят без противоречия для оставшейся части.',
          solutionSteps: steps
        };
      }
    }

    // Гарантированный фолбэк (прямое условие Фано)
    const fallbackEntries = [['А', '00'], ['К', '01'], ['О', '10'], ['Т', '110'], ['Р', '111']];
    const word = 'КОРА';
    const enc = '011011100';
    return {
      category: mode,
      catName: 'Двоичное кодирование',
      questionHtml: `<p>Расшифруйте сообщение: <code>${enc}</code></p>${buildCodeTableHtml(fallbackEntries)}<p>Запишите в ответе полученное слово.</p>`,
      answer: word,
      displayAnswer: word,
      hint: 'Используйте таблицу кодов слева направо.',
      solutionSteps: [`Разбиваем 01 | 10 | 111 | 00 → <strong>${word}</strong>.`]
    };
  }

  function genUniqueDecode() {
    // Таблица, где есть префиксные конфликты, поэтому только 1 из 3 цепочек расшифровывается единственным образом
    const conflictCodes = ['0', '01', '10', '11', '001'];
    const letters = shuffle(['А', 'Б', 'В', 'Г', 'Д']);
    const entries = letters.map((l, i) => [l, conflictCodes[i]]).sort((a, b) => a[0].localeCompare(b[0], 'ru'));
    const map = Object.fromEntries(entries);

    let uniqueChain = null;
    let uniqueWord = null;
    const ambiguousChains = [];

    for (let i = 0; i < 400 && (!uniqueChain || ambiguousChains.length < 2); i++) {
      const len = 4;
      let w = '';
      for (let k = 0; k < len; k++) w += pickRandom(letters);
      const enc = w.split('').map((c) => map[c]).join('');
      const decs = findDecodings(enc, entries, 3);
      if (decs.length === 1 && !uniqueChain) {
        uniqueChain = enc;
        uniqueWord = w;
      } else if (decs.length >= 2 && ambiguousChains.length < 2 && !ambiguousChains.includes(enc)) {
        ambiguousChains.push(enc);
      }
    }

    if (!uniqueChain || ambiguousChains.length < 2) {
      return genDecodeTask('digits_decode');
    }

    const candidates = shuffle([uniqueChain, ambiguousChains[0], ambiguousChains[1]]);
    const questionHtml = `
      <p>Валя шифрует русские слова, записывая вместо каждой буквы её двоичный код из таблицы:</p>
      ${buildCodeTableHtml(entries)}
      <p>Некоторые цепочки можно расшифровать не одним способом. Даны три кодовые цепочки:</p>
      <div class="inf-fragment-list">
        ${candidates.map((c, idx) => `<div class="inf-fragment-chip"><span class="inf-fragment-key">${idx + 1}</span><code>${c}</code></div>`).join('')}
      </div>
      <p>Найдите среди них ту, которая имеет <strong>только одну</strong> расшифровку, и запишите в ответе расшифрованное слово.</p>
    `.trim();

    return {
      category: 'unique_decode',
      catName: 'Единственная расшифровка',
      questionHtml,
      answer: uniqueWord,
      displayAnswer: uniqueWord,
      hint: 'Попробуйте разбить каждую из трёх цепочек двумя способами; две цепочки «разветвятся», а одна — нет.',
      solutionSteps: [
        `Проверим каждую из предложенных кодовых цепочек.`,
        `Цепочки <code>${ambiguousChains[0]}</code> и <code>${ambiguousChains[1]}</code> допускают не менее двух разных разбиений по таблице.`,
        `Цепочка <code>${uniqueChain}</code> расшифровывается единственным способом: <strong>${uniqueWord}</strong>.`
      ]
    };
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'digits_decode':
        return genDecodeTask('digits_decode');
      case 'symbols_decode':
        return genDecodeTask('symbols_decode');
      case 'unique_decode':
        return genUniqueDecode();
      case 'mixed_all':
      default:
        return pickRandom([
          () => genDecodeTask('digits_decode'),
          () => genDecodeTask('symbols_decode'),
          genUniqueDecode
        ])();
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
      { id: 'digits_decode', title: 'Двоичный код (0 и 1)' },
      { id: 'symbols_decode', title: 'Символьные шифры' },
      { id: 'unique_decode', title: 'Единственная расшифровка' }
    ]
  };
}));
