/**
 * Тренажёр ОГЭ по математике · Задание №10
 * «Теория вероятностей: классическая вероятность, жеребьёвка, контроль качества и прикладные задачи»
 * Согласовано с открытым банком ФИПИ и Решу ОГЭ (sdamgia.ru)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeTask10Trainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Вспомогательные функции
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatNum(n) {
    const rounded = Math.round(n * 1000000) / 1000000;
    return String(rounded).replace('.', ',');
  }

  function fracHtml(num, den) {
    return `<span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  // Набор знаменателей, дающих конечную десятичную дробь
  const GOOD_TOTALS = [10, 20, 25, 40, 50, 80, 100, 200, 250, 400, 500];

  // 1. Классическая вероятность: Пирожки / Тарелки / Конфеты
  function genClassicPies() {
    const total = pickRandom([10, 20, 25, 50]);
    // 3 типа начинок
    const items = [
      ['с мясом', 'пирожок с мясом'],
      ['с капустой', 'пирожок с капустой'],
      ['с вишней', 'пирожок с вишней'],
      ['с яблоками', 'пирожок с яблоками'],
      ['с рисом', 'пирожок с рисом']
    ];
    // Перемешиваем
    items.sort(() => Math.random() - 0.5);
    const chosenTypes = items.slice(0, 3);

    // Распределяем случайные количества
    const c1 = randInt(2, total - 6);
    const c2 = randInt(2, total - c1 - 2);
    const c3 = total - c1 - c2;
    const counts = [c1, c2, c3];

    // Выбираем целевую начинку
    const targetIdx = randInt(0, 2);
    const targetType = chosenTypes[targetIdx];
    const favCount = counts[targetIdx];
    const ans = favCount / total;

    const questionHtml = `
      В тарелке лежат одинаковые на вид пирожки: ${counts[0]} ${chosenTypes[0][0]}, ${counts[1]} ${chosenTypes[1][0]} и ${counts[2]} ${chosenTypes[2][0]}.
      Бабушка наугад берёт один пирожок. Найдите вероятность того, что этот пирожок окажется ${targetType[0]}.
    `.trim();

    const solutionSteps = [
      `Вспомним классическое определение вероятности: $P(A) = \\frac{m}{n}$, где $n$ — общее число всех возможных исходов, а $m$ — число исходов, благоприятствующих событию $A$.`,
      `Найдём общее число пирожков: $n = ${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}$.`,
      `Благоприятных исходов (пирожков ${targetType[0]}): $m = ${favCount}$.`,
      `Находим вероятность: $P = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
    ];

    return {
      category: 'fipi_classic',
      catName: 'Пирожки и тарелки',
      questionHtml,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps,
      hint: 'Раздели количество нужных пирожков на общее количество всех пирожков на тарелке.'
    };
  }

  // 2. Жеребьёвка спортсменов и порядок выступлений
  function genAthletesDraw() {
    const total = pickRandom([10, 20, 25, 40, 50]);
    const countries = [
      ['из России', 'спортсмен из России'],
      ['из Беларуси', 'спортсмен из Беларуси'],
      ['из Китая', 'спортсмен из Китая'],
      ['из Казахстана', 'спортсмен из Казахстана'],
      ['из Сербии', 'спортсмен из Сербии']
    ];
    countries.sort(() => Math.random() - 0.5);

    const c1 = randInt(3, total - 6);
    const c2 = randInt(2, total - c1 - 2);
    const c3 = total - c1 - c2;

    const targetCountry = countries[0];
    const favCount = c1;
    const ans = favCount / total;

    const orders = [
      'первым',
      'вторым',
      'третьим',
      'пятым',
      'последним',
      'седьмым'
    ];
    const orderWord = pickRandom(orders);

    const questionHtml = `
      В чемпионате по гимнастике участвуют ${total} спортсменок: ${c1} ${countries[0][0]}, ${c2} ${countries[1][0]}, остальные — ${countries[2][0]}.
      Порядок выступлений определяется жребием. Найдите вероятность того, что спортсменка ${targetCountry[0]} будет выступать <strong>${orderWord}</strong>.
    `.trim();

    const solutionSteps = [
      `Порядок выступлений определяется случайным жребием. По формуле классической вероятности вероятность оказаться на <em>любом</em> конкретном месте (хоть первым, хоть седьмым, хоть последним) одинакова и равна отношению числа интересующих спортсменок к общему числу участниц: $P = \\frac{m}{n}$.`,
      `Общее число спортсменок: $n = ${total}$.`,
      `Число спортсменок ${targetCountry[0]}: $m = ${favCount}$.`,
      `Вычисляем вероятность: $P = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
    ];

    return {
      category: 'athletes_draw',
      catName: 'Жеребьёвка спортсменов',
      questionHtml,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps,
      hint: 'Номер места выступления не влияет на вероятность: она всегда равна числу участников из нужной страны, делённому на общее число участников.'
    };
  }

  // 3. Такси и автомобили
  function genTaxiCars() {
    const total = pickRandom([10, 20, 25, 40, 50]);
    const colors = ['чёрных', 'жёлтых', 'белых', 'синих', 'серебристых'];
    colors.sort(() => Math.random() - 0.5);

    const c1 = randInt(2, total - 6);
    const c2 = randInt(2, total - c1 - 2);
    const c3 = total - c1 - c2;

    const targetColor = colors[0];
    const targetAdjective = targetColor === 'чёрных' ? 'чёрное' : (targetColor === 'жёлтых' ? 'жёлтое' : (targetColor === 'белых' ? 'белое' : (targetColor === 'синих' ? 'синее' : 'серебристое')));
    const favCount = c1;
    const ans = favCount / total;

    const questionHtml = `
      В фирме такси в данный момент свободно ${total} машин: ${c1} ${colors[0]}, ${c2} ${colors[1]} и ${c3} ${colors[2]}.
      По вызову выехала одна из машин, случайно оказавшаяся ближе всего к заказчице.
      Найдите вероятность того, что к ней приедет ${targetAdjective} такси.
    `.trim();

    const solutionSteps = [
      `По классической формуле вероятности: $P(A) = \\frac{m}{n}$, где $n$ — общее число свободных машин, $m$ — число машин нужного цвета.`,
      `Всего свободных машин: $n = ${total}$.`,
      `Число машин интересующего цвета (${colors[0]}): $m = ${favCount}$.`,
      `Искомая вероятность: $P = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
    ];

    return {
      category: 'taxis_colors',
      catName: 'Такси и машины',
      questionHtml,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps,
      hint: 'Поделите количество машин нужного цвета на общее число свободных автомобилей.'
    };
  }

  // 4. Экзаменационные билеты (прямое и противоположное событие)
  function genExamTickets() {
    const total = pickRandom([20, 25, 40, 50]);
    const topics = [
      ['грибы', 'по теме «Грибы»'],
      ['птицы', 'по теме «Птицы»'],
      ['ботаника', 'по ботанике'],
      ['зоология', 'по зоологии'],
      ['генетика', 'по генетике']
    ];
    const topic = pickRandom(topics);
    const countWithTopic = randInt(2, total - 4);
    const isNegative = Math.random() > 0.45; // "НЕ достанется" вопрос

    let favCount = isNegative ? (total - countWithTopic) : countWithTopic;
    let ans = favCount / total;

    const negativeWord = isNegative ? '<strong>НЕ достанется</strong>' : 'достанется';

    const questionHtml = `
      В сборнике билетов по биологии всего ${total} билетов. В ${countWithTopic} из них встречается вопрос ${topic[1]}.
      Найдите вероятность того, что в случайно выбранном на экзамене билете школьнику ${negativeWord} вопрос ${topic[1]}.
    `.trim();

    let solutionSteps = [];
    if (isNegative) {
      solutionSteps = [
        `Всего билетов в сборнике: $n = ${total}$.`,
        `В ${countWithTopic} билетах вопрос ${topic[1]} есть, значит в остальных билетах его нет: $m = ${total} - ${countWithTopic} = ${favCount}$.`,
        `Вероятность того, что школьнику НЕ достанется такой вопрос: $P = \\frac{m}{n} = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`,
        `<em>Альтернативный способ:</em> через противоположное событие: $P = 1 - \\frac{${countWithTopic}}{${total}} = 1 - ${formatNum(countWithTopic / total)} = \\mathbf{${formatNum(ans)}}$.`
      ];
    } else {
      solutionSteps = [
        `По формуле вероятности: $P(A) = \\frac{m}{n}$.`,
        `Общее число билетов: $n = ${total}$.`,
        `Число билетов с вопросом ${topic[1]}: $m = ${favCount}$.`,
        `Вероятность: $P = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
      ];
    }

    return {
      category: 'exam_tickets',
      catName: 'Экзаменационные билеты',
      questionHtml,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps,
      hint: isNegative ? 'Внимательно прочитайте условие: требуется найти вероятность того, что вопрос НЕ достанется!' : 'Разделите количество билетов с темой на общее количество билетов.'
    };
  }

  // 5. Контроль качества и бракованные изделия
  function genQualityDefects() {
    const total = pickRandom([50, 100, 200, 250, 400, 500]);
    const items = ['фонариков', 'насосов', 'лампочек', 'электрочайников', 'батареек'];
    const item = pickRandom(items);

    // Брак обычно небольшой процент
    const defectCount = randInt(2, Math.max(3, Math.floor(total * 0.1)));
    const askGood = Math.random() > 0.4; // спросить про исправный или бракованный

    let favCount = askGood ? (total - defectCount) : defectCount;
    let ans = favCount / total;

    const askWord = askGood ? '<strong>исправным</strong> (качественным)' : '<strong>неисправным</strong> (с дефектом)';

    const questionHtml = `
      В среднем из каждых ${total} поступивших в продажу ${item} ${defectCount} имеют скрытый дефект (неисправны).
      Найдите вероятность того, что случайно выбранный в магазине экземпляр окажется ${askWord}.
    `.trim();

    let solutionSteps = [];
    if (askGood) {
      solutionSteps = [
        `Всего проверяется изделий: $n = ${total}$.`,
        `По условию ${defectCount} из них неисправны, следовательно, исправных: $m = ${total} - ${defectCount} = ${favCount}$.`,
        `Вероятность купить исправное изделие: $P = \\frac{m}{n} = ${fracHtml(favCount, total)} = ${favCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
      ];
    } else {
      solutionSteps = [
        `Всего изделий: $n = ${total}$.`,
        `Количество неисправных (благоприятствующих событий): $m = ${defectCount}$.`,
        `Вероятность выбрать неисправное изделие: $P = \\frac{m}{n} = ${fracHtml(defectCount, total)} = ${defectCount} : ${total} = \\mathbf{${formatNum(ans)}}$.`
      ];
    }

    return {
      category: 'quality_defect',
      catName: 'Контроль качества и брак',
      questionHtml,
      answer: ans,
      displayAnswer: formatNum(ans),
      solutionSteps,
      hint: askGood ? 'Не забудьте сначала вычесть бракованные изделия из общего числа, чтобы получить исправные!' : 'Разделите количество дефектных изделий на общий объём партии.'
    };
  }

  // 6. Игральный кубик и монеты
  function genDiceCoins() {
    // Варианты кубика
    const diceTypes = [
      {
        question: 'В случайном эксперименте бросают одну стандартную игральную кость (с гранями от 1 до 6). Найдите вероятность того, что выпадет <strong>чётное</strong> число очков.',
        fav: [2, 4, 6],
        total: 6,
        desc: 'чётные числа: 2, 4, 6 (всего 3 исхода)'
      },
      {
        question: 'В случайном эксперименте бросают одну стандартную игральную кость. Найдите вероятность того, что выпадет число очков, <strong>большее 3</strong>.',
        fav: [4, 5, 6],
        total: 6,
        desc: 'числа больше трёх: 4, 5, 6 (всего 3 исхода)'
      },
      {
        question: 'В случайном эксперименте бросают одну стандартную игральную кость. Найдите вероятность того, что выпадет число очков, <strong>кратное 3</strong>.',
        fav: [3, 6],
        total: 6,
        desc: 'числа, кратные трём: 3 и 6 (всего 2 исхода)'
      },
      {
        question: 'В случайном эксперименте бросают одну правильную игральную кость. Найдите вероятность того, что выпадет число очков, <strong>меньшее 4</strong>.',
        fav: [1, 2, 3],
        total: 6,
        desc: 'числа меньше четырёх: 1, 2, 3 (всего 3 исхода)'
      }
    ];

    // Иногда монеты (2 броска: 4 исхода)
    const coinTypes = [
      {
        question: 'В случайном эксперименте симметричную монету бросают <strong>дважды</strong>. Найдите вероятность того, что орёл выпадет <strong>ровно один раз</strong>.',
        favDesc: 'Благоприятные исходы (где ровно один орёл): ОР и РО (всего 2 исхода).',
        totalDesc: 'Все возможные исходы при двух бросках монеты: ОО, ОР, РО, РР (всего 4 исхода).',
        fav: 2,
        total: 4
      },
      {
        question: 'В случайном эксперименте симметричную монету бросают <strong>дважды</strong>. Найдите вероятность того, что орёл выпадет <strong>оба раза</strong>.',
        favDesc: 'Благоприятный исход: только ОО (1 исход).',
        totalDesc: 'Все возможные исходы: ОО, ОР, РО, РР (всего 4 исхода).',
        fav: 1,
        total: 4
      },
      {
        question: 'В случайном эксперименте симметричную монету бросают <strong>дважды</strong>. Найдите вероятность того, что решка не выпадет <strong>ни разу</strong>.',
        favDesc: 'Благоприятный исход: только ОО (1 исход).',
        totalDesc: 'Все возможные исходы: ОО, ОР, РО, РР (всего 4 исхода).',
        fav: 1,
        total: 4
      }
    ];

    if (Math.random() > 0.5) {
      // Coin
      const c = pickRandom(coinTypes);
      const ans = c.fav / c.total;
      return {
        category: 'dice_coins',
        catName: 'Кости и монеты',
        questionHtml: c.question,
        answer: ans,
        displayAnswer: formatNum(ans),
        solutionSteps: [
          c.totalDesc,
          c.favDesc,
          `Находим вероятность по формуле $P = \\frac{m}{n} = ${fracHtml(c.fav, c.total)} = ${c.fav} : ${c.total} = \\mathbf{${formatNum(ans)}}$.`
        ],
        hint: 'Выпишите все комбинации (орёл-решка) и сосчитайте подходящие.'
      };
    } else {
      // Dice
      const d = pickRandom(diceTypes);
      const ans = d.fav.length / d.total;
      return {
        category: 'dice_coins',
        catName: 'Кости и монеты',
        questionHtml: d.question,
        answer: ans,
        displayAnswer: formatNum(ans),
        solutionSteps: [
          `У игрального кубика всего 6 граней: 1, 2, 3, 4, 5, 6. Значит, общее число исходов: $n = 6$.`,
          `Благоприятные исходы (${d.desc}): $m = ${d.fav.length}$.`,
          `Находим вероятность: $P = \\frac{m}{n} = ${fracHtml(d.fav.length, d.total)} = ${fracHtml(d.fav.length / gcd(d.fav.length, d.total), d.total / gcd(d.fav.length, d.total))} = \\mathbf{${formatNum(ans)}}$.`
        ],
        hint: 'Посчитайте количество граней кубика, удовлетворяющих условию, и разделите на 6.'
      };
    }
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }

  // Главный роутер генерации
  function generateTask(category = 'mixed_all') {
    switch (category) {
      case 'fipi_classic':
        return genClassicPies();
      case 'athletes_draw':
        return genAthletesDraw();
      case 'taxis_colors':
        return genTaxiCars();
      case 'exam_tickets':
        return genExamTickets();
      case 'quality_defect':
        return genQualityDefects();
      case 'dice_coins':
        return genDiceCoins();
      case 'mixed_all':
      default: {
        const gens = [genClassicPies, genAthletesDraw, genTaxiCars, genExamTickets, genQualityDefects, genDiceCoins];
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
      { id: 'mixed_all', title: 'Все прототипы' },
      { id: 'fipi_classic', title: 'Пирожки и тарелки' },
      { id: 'athletes_draw', title: 'Жеребьёвка участников' },
      { id: 'taxis_colors', title: 'Такси и машины' },
      { id: 'exam_tickets', title: 'Билеты на экзамене' },
      { id: 'quality_defect', title: 'Контроль качества' },
      { id: 'dice_coins', title: 'Кости и монеты' }
    ]
  };
}));
