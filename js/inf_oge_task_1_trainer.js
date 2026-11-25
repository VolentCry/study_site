/**
 * Тренажёр ОГЭ по информатике · Задание №1
 * «Количественные параметры информационных объектов»
 * Согласовано с кодификатором ФИПИ и каталогом inf-oge.sdamgia.ru
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfOgeTask1Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const ENCODINGS = [
    { name: 'КОИ-8', bits: 8, label: 'каждый символ кодируется 8 битами' },
    { name: 'Windows-1251', bits: 8, label: 'каждый символ кодируется 8 битами' },
    { name: 'Unicode (UTF-16)', bits: 16, label: 'каждый символ кодируется 16 битами' },
    { name: 'UTF-32', bits: 32, label: 'каждый символ кодируется 32 битами' }
  ];

  // Наборы слов со строго уникальными длинами внутри каждого набора
  const WORD_SETS = [
    {
      topic: 'животных',
      prefix: 'В зоопарке живут',
      suffix: '— все они привыкли к посетителям',
      words: ['ёж', 'волк', 'песец', 'альпака', 'черепаха', 'дикобраз', 'гиппопотам'] // длины: 2,4,5,7,8... wait ал/па/ка=7, черепаха=8, дикобраз=8! Проверим ниже фильтром уникальных длин!
    },
    {
      topic: 'рек России',
      prefix: 'По территории страны протекают',
      suffix: '— крупные водные артерии',
      words: ['Обь', 'Лена', 'Волга', 'Иртыш', 'Енисей', 'Колыма', 'Ангара', 'Печора', 'Индигирка']
    },
    {
      topic: 'деревьев',
      prefix: 'В лесопарке высажены',
      suffix: '— эти породы хорошо переносят зиму',
      words: ['ель', 'клён', 'осина', 'берёза', 'рябина', 'каштан', 'лиственница']
    },
    {
      topic: 'городов',
      prefix: 'На карте маршрута отмечены',
      suffix: '— ключевые станции пути',
      words: ['Уфа', 'Орёл', 'Томск', 'Самара', 'Вологда', 'Владимир', 'Астрахань', 'Екатеринбург']
    },
    {
      topic: 'музыкальных инструментов',
      prefix: 'В оркестре звучат',
      suffix: '— это создаёт богатое звучание',
      words: ['арфа', 'альт', 'гобой', 'флейта', 'кларнет', 'виолончель', 'аккордеон']
    },
    {
      topic: 'камней и минералов',
      prefix: 'В коллекции музея хранятся',
      suffix: '— редкие образцы породы',
      words: ['опал', 'агат', 'топаз', 'янтарь', 'изумруд', 'малахит', 'аметист', 'хризопраз']
    }
  ];

  function getUniqueLengthWords(words) {
    const byLen = new Map();
    words.forEach((w) => {
      if (!byLen.has(w.length)) byLen.set(w.length, w);
    });
    return Array.from(byLen.values()).sort((a, b) => a.length - b.length);
  }

  function genWordDelete() {
    const enc = pickRandom(ENCODINGS);
    const bytesPerChar = enc.bits / 8;
    const set = pickRandom(WORD_SETS);
    const uniqueWords = getUniqueLengthWords(set.words);
    const chosen = uniqueWords.slice(0, Math.min(7, uniqueWords.length));
    const target = pickRandom(chosen);
    const sentence = `${set.prefix}: ${chosen.join(', ')} ${set.suffix}.`;

    const removedChars = target.length + 2; // слово + запятая + пробел
    const deltaBytes = removedChars * bytesPerChar;

    const questionHtml = `
      <p>В одной из кодировок <strong>${enc.name}</strong> ${enc.label}.</p>
      <p>Ученик написал текст (в нём нет лишних пробелов):</p>
      <div class="inf-quote-box">«${sentence}»</div>
      <p>Ученик вычеркнул из списка одно из названий ${set.topic}. Заодно он вычеркнул ставшие лишними запятую и пробел — два пробела не должны идти подряд.</p>
      <p>При этом размер нового предложения в данной кодировке оказался на <strong>${deltaBytes} байт</strong> меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое слово.</p>
    `.trim();

    return {
      category: 'word_delete',
      catName: 'Удаление слова',
      questionHtml,
      answer: target,
      displayAnswer: target,
      hint: 'Разделите разницу в байтах на вес одного символа в байтах, затем вычтите 2 (запятую и пробел).',
      solutionSteps: [
        `Определим информационный вес одного символа: ${enc.bits} бит : 8 = ${bytesPerChar} байт.`,
        `Найдём, сколько всего символов было удалено из текста: ${deltaBytes} : ${bytesPerChar} = ${removedChars} символов.`,
        `Вместе со словом были удалены 1 запятая и 1 пробел (итого 2 лишних символа). Значит, длина самого слова: ${removedChars} − 2 = ${target.length} букв.`,
        `В приведённом списке слово ровно из ${target.length} букв — это <strong>${target}</strong>.`
      ]
    };
  }

  function genWordAdd() {
    const enc = pickRandom(ENCODINGS);
    const bytesPerChar = enc.bits / 8;
    const set = pickRandom(WORD_SETS);
    const uniqueWords = getUniqueLengthWords(set.words);
    // Убираем 1 слово из предложения — его ученик «дописал»
    const pool = uniqueWords.slice(0, Math.min(7, uniqueWords.length));
    const targetIdx = randInt(1, pool.length - 2);
    const target = pool[targetIdx];
    const baseWords = pool.filter((_, idx) => idx !== targetIdx);
    const fullWords = pool;

    const addedChars = target.length + 2;
    const deltaBytes = addedChars * bytesPerChar;

    const questionHtml = `
      <p>В кодировке <strong>${enc.name}</strong> ${enc.label}.</p>
      <p>Вова написал исходный список ${set.topic}: <em>«${baseWords.join(', ')}»</em>, а затем дописал в него ещё одно слово, поставив перед ним запятую и пробел (или после него — с запятой и пробелом):</p>
      <div class="inf-quote-box">«${set.prefix}: ${fullWords.join(', ')} ${set.suffix}.»</div>
      <p>На самом деле Вова сначала сохранил только короткую версию без одного слова, а потом расширил её — размер текста вырос ровно на <strong>${deltaBytes} байт</strong>. Напишите слово, которое было добавлено.</p>
    `.trim();

    return {
      category: 'word_add',
      catName: 'Добавление слова',
      questionHtml,
      answer: target,
      displayAnswer: target,
      hint: 'Переведите биты в байты (разделите на 8) и найдите длину добавленного слова с учётом запятой и пробела.',
      solutionSteps: [
        `Вес одного символа в кодировке ${enc.name}: ${enc.bits} : 8 = ${bytesPerChar} байт.`,
        `Количество добавленных символов: ${deltaBytes} : ${bytesPerChar} = ${addedChars} символов.`,
        `Вычтем запятую и пробел (2 символа): ${addedChars} − 2 = ${target.length} букв в добавленном слове.`,
        `Сравнивая короткий и полный списки, находим слово длиной ${target.length} символов — <strong>${target}</strong>.`
      ]
    };
  }

  function genTextVolume() {
    const enc = pickRandom([
      { name: 'КОИ-8', bits: 8 },
      { name: 'Windows-1251', bits: 8 },
      { name: 'Unicode (UTF-16)', bits: 16 }
    ]);
    const bytesPerChar = enc.bits / 8;
    const charsPerLine = pickRandom([32, 40, 48, 64]);
    const linesPerPage = pickRandom([32, 40, 48, 64]);
    // Подбираем pages так, чтобы объём в Кбайтах был целым
    const bytesPerPage = charsPerLine * linesPerPage * bytesPerChar;
    const targetKbOptions = [10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 60];
    let pages = null;
    let totalKb = null;
    for (const kb of targetKbOptions.sort(() => Math.random() - 0.5)) {
      const totalBytes = kb * 1024;
      if (totalBytes % bytesPerPage === 0) {
        const p = totalBytes / bytesPerPage;
        if (p >= 2 && p <= 30) {
          pages = p;
          totalKb = kb;
          break;
        }
      }
    }
    if (!pages) {
      pages = 8;
      totalKb = (pages * bytesPerPage) / 1024;
      if (!Number.isInteger(totalKb)) {
        // Фолбэк гарантированно целый
        const c = 64, l = 32, p = 8;
        const bpc = 2;
        const kb = (c * l * p * bpc) / 1024;
        return {
          category: 'text_volume',
          catName: 'Объём текста',
          questionHtml: `<p>Реферат, набранный на компьютере, содержит <strong>${p} страниц</strong>, на каждой странице <strong>${l} строки</strong>, в каждой строке <strong>${c} символов</strong>.</p><p>Определите информационный объём реферата в <strong>Кбайтах</strong> в кодировке Unicode, где каждый символ кодируется 16 битами. В ответе запишите только число.</p>`,
          answer: kb,
          displayAnswer: String(kb),
          hint: 'Перемножьте страницы, строки, символы и вес 1 символа в байтах, затем разделите на 1024.',
          solutionSteps: [
            `Всего символов в тексте: ${p} · ${l} · ${c} = ${p * l * c}.`,
            `Каждый символ весит 16 бит = 2 байта. Объём в байтах: ${p * l * c} · 2 = ${p * l * c * 2} байт.`,
            `Переведём в Кбайты (1 Кбайт = 1024 байта): ${p * l * c * 2} : 1024 = <strong>${kb}</strong> Кбайт.`
          ]
        };
      }
    }

    const totalChars = pages * linesPerPage * charsPerLine;
    const totalBytes = totalChars * bytesPerChar;

    const questionHtml = `
      <p>Статья, набранная на компьютере, содержит <strong>${pages} страниц</strong>, на каждой странице <strong>${linesPerPage} строк</strong>, в каждой строке <strong>${charsPerLine} символов</strong>.</p>
      <p>Определите информационный объём статьи в <strong>Кбайтах</strong> в кодировке ${enc.name}, в которой каждый символ кодируется <strong>${enc.bits} битами</strong>. В ответе запишите только число.</p>
    `.trim();

    return {
      category: 'text_volume',
      catName: 'Объём текста',
      questionHtml,
      answer: totalKb,
      displayAnswer: String(totalKb),
      hint: 'I = K · i. Переведите биты в байты (÷ 8), а байты в Кбайты (÷ 1024).',
      solutionSteps: [
        `Найдём общее количество символов: K = ${pages} · ${linesPerPage} · ${charsPerLine} = ${totalChars}.`,
        `Вес одного символа: i = ${enc.bits} бит = ${bytesPerChar} байт.`,
        `Объём в байтах: ${totalChars} · ${bytesPerChar} = ${totalBytes} байт.`,
        `Переводим в Кбайты: ${totalBytes} : 1024 = <strong>${totalKb}</strong> Кбайт.`
      ]
    };
  }

  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'word_delete':
        return genWordDelete();
      case 'word_add':
        return genWordAdd();
      case 'text_volume':
        return genTextVolume();
      case 'mixed_all':
      default:
        return pickRandom([genWordDelete, genWordAdd, genTextVolume])();
    }
  }

  function checkAnswer(userRaw, correctAnswer) {
    if (userRaw === undefined || userRaw === null) return false;
    const u = String(userRaw).trim().replace(/\s+/g, '').toLowerCase().replace(/ё/g, 'е');
    const c = String(correctAnswer).trim().replace(/\s+/g, '').toLowerCase().replace(/ё/g, 'е');
    if (!u) return false;
    if (typeof correctAnswer === 'number') {
      const num = parseFloat(u.replace(',', '.'));
      return !isNaN(num) && Math.abs(num - correctAnswer) < 0.0001;
    }
    return u === c;
  }

  return {
    generateTask,
    checkAnswer,
    categories: [
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'word_delete', title: 'Вычёркивание слова' },
      { id: 'word_add', title: 'Добавление слова' },
      { id: 'text_volume', title: 'Объём текста (Кбайт)' }
    ]
  };
}));
