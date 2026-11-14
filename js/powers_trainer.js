/**
 * Тренажёр по математике · 4–5 класс
 * «Степени чисел: возведение в степень, уравнения и примеры»
 *
 * Категории заданий:
 * 1. powers_calculate: Возведение числа в степень (квадраты 1–20, кубы 1–10, степени 2, 3, 5, 10)
 * 2. powers_equations: Решение уравнений со степенью (нахождение основания, показателя, уравнения в 2 действия)
 * 3. powers_expressions: Примеры со степенями (порядок действий: скобки, степени, умножение/деление, сложение/вычитание)
 * 4. mixed_all: Все типы вперемешку
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PowersTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- 1. ВОЗВЕДЕНИЕ В СТЕПЕНЬ (POWERS CALCULATE) ---

  function genCalculatePower() {
    const sub = pickRandom(['squares_base', 'squares_round', 'cubes', 'powers_of_two', 'powers_of_three', 'powers_of_ten', 'powers_of_five', 'special_zero_one']);

    if (sub === 'squares_base') {
      // Квадраты чисел от 2 до 20
      const a = randInt(2, 20);
      const ans = a * a;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${a}<sup>2</sup> = ?</span></div>`;
      const prompt = `Вычислите квадрат числа ${a}:`;
      const solutionSteps = [
        `Вторая степень числа (квадрат) означает умножение числа самого на себя 2 раза:`,
        `<strong>${a}<sup>2</sup> = ${a} × ${a} = ${ans}</strong>`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Умножь число ${a} само на себя: ${a} × ${a}.`
      };
    }

    if (sub === 'squares_round') {
      // Квадраты круглых десятков: 30, 40, 50, ..., 100
      const d = pickRandom([30, 40, 50, 60, 70, 80, 90, 100]);
      const ans = d * d;
      const dUnit = d / 10;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${d}<sup>2</sup> = ?</span></div>`;
      const prompt = `Возведите круглый десяток в квадрат:`;
      const solutionSteps = [
        `Круглое число ${d} можно представить как ${dUnit} × 10:`,
        `(${dUnit} × 10)<sup>2</sup> = ${dUnit}<sup>2</sup> × 10<sup>2</sup> = ${dUnit * dUnit} × 100 = <strong>${ans}</strong>`,
        `Удобное правило: возводим первую цифру в квадрат (${dUnit}<sup>2</sup> = ${dUnit * dUnit}) и приписываем два нуля: <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Возведи в квадрат ${dUnit} (${dUnit} × ${dUnit} = ${dUnit * dUnit}) и допиши два нуля.`
      };
    }

    if (sub === 'cubes') {
      // Кубы чисел от 2 до 10
      const a = randInt(2, 10);
      const ans = a * a * a;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${a}<sup>3</sup> = ?</span></div>`;
      const prompt = `Вычислите куб числа (${a}<sup>3</sup>):`;
      const solutionSteps = [
        `Третья степень числа (куб) означает умножение числа самого на себя 3 раза:`,
        `${a}<sup>3</sup> = ${a} × ${a} × ${a}`,
        `Сначала находим ${a} × ${a} = ${a * a}, затем ${a * a} × ${a} = <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Куб числа — это ${a} × ${a} × ${a}. Сначала умножь ${a} на ${a}, а затем результат ещё раз на ${a}.`
      };
    }

    if (sub === 'powers_of_two') {
      // Степени двойки: 2^2 ... 2^10
      const n = randInt(2, 10);
      const ans = Math.pow(2, n);
      const questionHtml = `<div class="math-expr"><span class="expr-line">2<sup>${n}</sup> = ?</span></div>`;
      const prompt = `Возведите 2 в степень ${n}:`;
      const multChain = Array(n).fill(2).join(' × ');
      const solutionSteps = [
        `Степень показывает, сколько раз число 2 умножается само на себя:`,
        `2<sup>${n}</sup> = ${multChain}`,
        `Последовательно удваиваем: 2 → 4 → 8 → 16 → 32 → 64 ... и получаем <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Умножь 2 саму на себя ${n} раз подряд.`
      };
    }

    if (sub === 'powers_of_three') {
      // Степени тройки: 3^2, 3^3, 3^4, 3^5
      const n = randInt(2, 5);
      const ans = Math.pow(3, n);
      const questionHtml = `<div class="math-expr"><span class="expr-line">3<sup>${n}</sup> = ?</span></div>`;
      const prompt = `Вычислите значение степени:`;
      const multChain = Array(n).fill(3).join(' × ');
      const solutionSteps = [
        `Записываем степень в виде произведения ${n} одинаковых множителей:`,
        `3<sup>${n}</sup> = ${multChain}`,
        `Выполняем умножение: <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Тройка перемножается сама на себя ${n} раз.`
      };
    }

    if (sub === 'powers_of_five') {
      // Степени пятёрки: 5^2=25, 5^3=125, 5^4=625
      const n = randInt(2, 4);
      const ans = Math.pow(5, n);
      const questionHtml = `<div class="math-expr"><span class="expr-line">5<sup>${n}</sup> = ?</span></div>`;
      const prompt = `Вычислите значение степени:`;
      const solutionSteps = [
        `Степень 5<sup>${n}</sup> равна произведению ${n} пятёрок:`,
        `5<sup>${n}</sup> = ${Array(n).fill(5).join(' × ')} = <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Перемножь ${n} пятёрок.`
      };
    }

    if (sub === 'powers_of_ten') {
      // Степени десятки: 10^1 ... 10^6
      const n = randInt(1, 6);
      const ans = Math.pow(10, n);
      const questionHtml = `<div class="math-expr"><span class="expr-line">10<sup>${n}</sup> = ?</span></div>`;
      const prompt = `Запишите число 10<sup>${n}</sup> обычным числом:`;
      const solutionSteps = [
        `Степень десятки 10<sup>${n}</sup> очень легко вычисляется по количеству нулей:`,
        `Показатель степени равен ${n}, значит после единицы нужно записать ровно ${n} нул${n === 1 ? 'ь' : n >= 2 && n <= 4 ? 'я' : 'ей'}:`,
        `10<sup>${n}</sup> = <strong>${ans.toLocaleString('ru-RU')}</strong>.`
      ];
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Запиши 1 и припиши к ней ровно ${n} нулей.`
      };
    }

    // special_zero_one
    const isOne = Math.random() < 0.6;
    if (isOne) {
      const n = randInt(5, 50);
      const questionHtml = `<div class="math-expr"><span class="expr-line">1<sup>${n}</sup> = ?</span></div>`;
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt: `Вычислите степень единицы:`,
        questionHtml,
        answer: 1,
        displayAnswer: '1',
        solutionSteps: [
          `Единица в любой натуральной степени равна 1, так как сколько раз ни умножай 1 на 1, всегда получится 1:`,
          `1<sup>${n}</sup> = <strong>1</strong>.`
        ],
        hint: `Сколько будет 1 × 1 × 1 ...?`
      };
    } else {
      const n = randInt(2, 25);
      const questionHtml = `<div class="math-expr"><span class="expr-line">0<sup>${n}</sup> = ?</span></div>`;
      return {
        category: 'powers_calculate',
        catName: 'Возведение в степень',
        prompt: `Вычислите степень нуля:`,
        questionHtml,
        answer: 0,
        displayAnswer: '0',
        solutionSteps: [
          `Ноль в любой натуральной степени равен 0, так как при умножении нуля самого на себя получается 0:`,
          `0<sup>${n}</sup> = <strong>0</strong>.`
        ],
        hint: `Ноль при умножении на ноль даёт ноль.`
      };
    }
  }

  // --- 2. УРАВНЕНИЯ СО СТЕПЕНЬЮ (POWERS EQUATIONS) ---

  function genPowerEquation() {
    const sub = pickRandom([
      'find_base_sq', 'find_base_cube', 'find_exp', 'eq_add_sub',
      'eq_mult', 'eq_cube_add', 'eq_brackets', 'eq_exp_add'
    ]);

    if (sub === 'find_base_sq') {
      // x^2 = a
      const x = randInt(2, 16);
      const a = x * x;
      const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>2</sup> = ${a}</span></div>`;
      const prompt = `Найдите корень уравнения (натуральное число x):`;
      const solutionSteps = [
        `В уравнении неизвестным является основание степени <em>x</em>.`,
        `Вспомним, какое натуральное число при умножении само на себя даёт ${a}:`,
        `Так как ${x} × ${x} = ${a}, то <strong>x = ${x}</strong>.`
      ];
      return {
        category: 'powers_equations',
        catName: 'Уравнение со степенью',
        prompt,
        questionHtml,
        answer: x,
        displayAnswer: String(x),
        solutionSteps,
        hint: `Вспомни таблицу квадратов: какое число при умножении само на себя даёт ${a}?`
      };
    }

    if (sub === 'find_base_cube') {
      // x^3 = b
      const x = randInt(2, 10);
      const b = x * x * x;
      const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>3</sup> = ${b}</span></div>`;
      const prompt = `Решите уравнение с кубом числа:`;
      const solutionSteps = [
        `Ищем число, куб которого равен ${b}:`,
        `x × x × x = ${b}`,
        `Проверяем: ${x} × ${x} × ${x} = ${x * x} × ${x} = ${b}.`,
        `Значит, <strong>x = ${x}</strong>.`
      ];
      return {
        category: 'powers_equations',
        catName: 'Уравнение со степенью',
        prompt,
        questionHtml,
        answer: x,
        displayAnswer: String(x),
        solutionSteps,
        hint: `Какое число, умноженное само на себя 3 раза, равно ${b}?`
      };
    }

    if (sub === 'find_exp') {
      // b^x = a (нахождение показателя степени)
      const base = pickRandom([2, 3, 5, 10]);
      let x;
      if (base === 2) x = randInt(2, 7); // 4..128
      else if (base === 3) x = randInt(2, 4); // 9..81
      else if (base === 5) x = randInt(2, 4); // 25..625
      else x = randInt(2, 5); // 100..100000

      const a = Math.pow(base, x);
      const questionHtml = `<div class="math-expr"><span class="expr-line">${base}<sup>x</sup> = ${a}</span></div>`;
      const prompt = `Найдите показатель степени x:`;
      const solutionSteps = [
        `Показатель <em>x</em> показывает, сколько раз число ${base} перемножили само на себя, чтобы получить ${a}:`,
        `Вычисляем по шагам:`,
        ...Array.from({ length: x }, (_, i) => `${base}<sup>${i + 1}</sup> = ${Math.pow(base, i + 1)}`),
        `Получили ${base}<sup>${x}</sup> = ${a}, значит <strong>x = ${x}</strong>.`
      ];
      return {
        category: 'powers_equations',
        catName: 'Уравнение со степенью',
        prompt,
        questionHtml,
        answer: x,
        displayAnswer: String(x),
        solutionSteps,
        hint: `Сколько раз нужно перемножить число ${base}, чтобы получить ${a}?`
      };
    }

    if (sub === 'eq_add_sub') {
      // x^2 + c = d или x^2 - c = d или c - x^2 = d
      const mode = pickRandom(['plus', 'minus', 'const_minus']);
      const x = randInt(3, 12);
      const xSq = x * x;

      if (mode === 'plus') {
        const c = randInt(5, 35);
        const d = xSq + c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>2</sup> + ${c} = ${d}</span></div>`;
        const solutionSteps = [
          `Сначала выразим неизвестное слагаемое <em>x<sup>2</sup></em>:`,
          `x<sup>2</sup> = ${d} − ${c}`,
          `x<sup>2</sup> = ${xSq}`,
          `Теперь находим само число <em>x</em>: так как ${x}<sup>2</sup> = ${xSq}, то <strong>x = ${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Сначала найди x², вычтя ${c} из ${d}.`
        };
      } else if (mode === 'minus') {
        const c = randInt(5, 30);
        const d = xSq - c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>2</sup> − ${c} = ${d}</span></div>`;
        const solutionSteps = [
          `Найдём неизвестное уменьшаемое <em>x<sup>2</sup></em>:`,
          `x<sup>2</sup> = ${d} + ${c}`,
          `x<sup>2</sup> = ${xSq}`,
          `Число, квадрат которого равен ${xSq}: <strong>x = ${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Прибавь ${c} к ${d}, чтобы найти x².`
        };
      } else {
        const c = xSq + randInt(5, 40);
        const d = c - xSq;
        const questionHtml = `<div class="math-expr"><span class="expr-line">${c} − x<sup>2</sup> = ${d}</span></div>`;
        const solutionSteps = [
          `Найдём неизвестное вычитаемое <em>x<sup>2</sup></em>:`,
          `x<sup>2</sup> = ${c} − ${d}`,
          `x<sup>2</sup> = ${xSq}`,
          `Так как ${x} × ${x} = ${xSq}, получаем <strong>x = ${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Вычти ${d} из ${c}, чтобы узнать x².`
        };
      }
    }

    if (sub === 'eq_mult') {
      // k * x^2 = m
      const k = pickRandom([2, 3, 4, 5]);
      const x = randInt(2, 9);
      const m = k * x * x;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${k} · x<sup>2</sup> = ${m}</span></div>`;
      const solutionSteps = [
        `Найдём неизвестный множитель <em>x<sup>2</sup></em>:`,
        `x<sup>2</sup> = ${m} : ${k}`,
        `x<sup>2</sup> = ${x * x}`,
        `Так как ${x}<sup>2</sup> = ${x * x}, то <strong>x = ${x}</strong>.`
      ];
      return {
        category: 'powers_equations',
        catName: 'Уравнение со степенью',
        prompt: `Решите уравнение:`,
        questionHtml,
        answer: x,
        displayAnswer: String(x),
        solutionSteps,
        hint: `Раздели ${m} на ${k}, чтобы найти x².`
      };
    }

    if (sub === 'eq_cube_add') {
      // x^3 + c = d или x^3 - c = d
      const x = randInt(2, 6);
      const xCube = x * x * x;
      const isPlus = Math.random() < 0.5;
      const c = randInt(5, 35);

      if (isPlus) {
        const d = xCube + c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>3</sup> + ${c} = ${d}</span></div>`;
        const solutionSteps = [
          `Находим значение куба <em>x<sup>3</sup></em>:`,
          `x<sup>3</sup> = ${d} − ${c}`,
          `x<sup>3</sup> = ${xCube}`,
          `Так как ${x} × ${x} × ${x} = ${xCube}, корень уравнения: <strong>x = ${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение с кубом числа:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Вычти ${c} из ${d}, чтобы получить x³.`
        };
      } else {
        const d = xCube - c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">x<sup>3</sup> − ${c} = ${d}</span></div>`;
        const solutionSteps = [
          `Находим значение <em>x<sup>3</sup></em>:`,
          `x<sup>3</sup> = ${d} + ${c}`,
          `x<sup>3</sup> = ${xCube}`,
          `Число, куб которого равен ${xCube}: <strong>x = ${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Прибавь ${c} к ${d}, чтобы найти x³.`
        };
      }
    }

    if (sub === 'eq_brackets') {
      // (x + c)^2 = d или (x - c)^2 = d
      const isPlus = Math.random() < 0.5;
      const baseVal = randInt(4, 12);
      const d = baseVal * baseVal;

      if (isPlus) {
        const c = randInt(1, baseVal - 1);
        const x = baseVal - c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">(x + ${c})<sup>2</sup> = ${d}</span></div>`;
        const solutionSteps = [
          `Выражение в скобках в квадрате даёт ${d}. Значит, само выражение равно числу, квадрат которого равен ${d}:`,
          `x + ${c} = ${baseVal}`,
          `Находим <em>x</em>:`,
          `x = ${baseVal} − ${c} = <strong>${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение со скобками:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Квадрат чего равен ${d}? Числа ${baseVal}. Значит, x + ${c} = ${baseVal}.`
        };
      } else {
        const c = randInt(1, 8);
        const x = baseVal + c;
        const questionHtml = `<div class="math-expr"><span class="expr-line">(x − ${c})<sup>2</sup> = ${d}</span></div>`;
        const solutionSteps = [
          `Квадрат выражения (x − ${c}) равен ${d}. Так как ${baseVal}<sup>2</sup> = ${d}, то:`,
          `x − ${c} = ${baseVal}`,
          `x = ${baseVal} + ${c} = <strong>${x}</strong>.`
        ];
        return {
          category: 'powers_equations',
          catName: 'Уравнение со степенью',
          prompt: `Решите уравнение:`,
          questionHtml,
          answer: x,
          displayAnswer: String(x),
          solutionSteps,
          hint: `Сначала найди значение скобки: x − ${c} = ${baseVal}.`
        };
      }
    }

    // eq_exp_add: 2^x + c = d
    const base = pickRandom([2, 3]);
    let x = base === 2 ? randInt(2, 6) : randInt(2, 4);
    const powerVal = Math.pow(base, x);
    const c = randInt(4, 25);
    const d = powerVal + c;

    const questionHtml = `<div class="math-expr"><span class="expr-line">${base}<sup>x</sup> + ${c} = ${d}</span></div>`;
    const solutionSteps = [
      `Сначала найдём значение степени <em>${base}<sup>x</sup></em>:`,
      `${base}<sup>x</sup> = ${d} − ${c}`,
      `${base}<sup>x</sup> = ${powerVal}`,
      `Теперь определяем показатель <em>x</em>: сколько раз надо умножить ${base} на себя, чтобы получить ${powerVal}?`,
      `Так как ${base}<sup>${x}</sup> = ${powerVal}, то <strong>x = ${x}</strong>.`
    ];
    return {
      category: 'powers_equations',
      catName: 'Уравнение со степенью',
      prompt: `Найдите корень уравнения x:`,
      questionHtml,
      answer: x,
      displayAnswer: String(x),
      solutionSteps,
      hint: `Вычти ${c} из ${d}, чтобы получить ${base}ˣ, а затем подбери степень.`
    };
  }

  // --- 3. ПРИМЕРЫ СО СТЕПЕНЯМИ (POWERS EXPRESSIONS) ---

  function genPowerExpression() {
    const sub = pickRandom(['add_sub_powers', 'mult_power', 'div_power', 'brackets_power', 'brackets_diff_squares', 'three_operations']);

    if (sub === 'add_sub_powers') {
      // a^n + b^m или a^n - b^m
      const isPlus = Math.random() < 0.6;
      const pair = pickRandom([
        { a: 3, n: 3, b: 2, m: 4 }, // 27 + 16 = 43 / 27 - 16 = 11
        { a: 5, n: 2, b: 4, m: 2 }, // 25 + 16 = 41 / 25 - 16 = 9
        { a: 10, n: 2, b: 6, m: 2 }, // 100 + 36 = 136 / 100 - 36 = 64
        { a: 10, n: 2, b: 8, m: 2 }, // 100 + 64 = 164 / 100 - 64 = 36
        { a: 2, n: 5, b: 3, m: 2 }, // 32 + 9 = 41 / 32 - 9 = 23
        { a: 4, n: 3, b: 2, m: 5 }, // 64 + 32 = 96 / 64 - 32 = 32
        { a: 6, n: 2, b: 3, m: 3 }, // 36 + 27 = 63 / 36 - 27 = 9
        { a: 7, n: 2, b: 5, m: 2 }, // 49 + 25 = 74 / 49 - 25 = 24
        { a: 2, n: 6, b: 5, m: 2 }, // 64 + 25 = 89 / 64 - 25 = 39
        { a: 4, n: 3, b: 3, m: 3 }, // 64 + 27 = 91 / 64 - 27 = 37
      ]);

      const valA = Math.pow(pair.a, pair.n);
      const valB = Math.pow(pair.b, pair.m);
      const op = isPlus ? '+' : '−';
      const ans = isPlus ? valA + valB : valA - valB;

      const questionHtml = `<div class="math-expr"><span class="expr-line">${pair.a}<sup>${pair.n}</sup> ${op} ${pair.b}<sup>${pair.m}</sup> = ?</span></div>`;
      const solutionSteps = [
        `По правилу порядка действий сначала возводим числа в степени, затем выполняем ${isPlus ? 'сложение' : 'вычитание'}:`,
        `1) ${pair.a}<sup>${pair.n}</sup> = ${valA}`,
        `2) ${pair.b}<sup>${pair.m}</sup> = ${valB}`,
        `3) ${valA} ${op} ${valB} = <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_expressions',
        catName: 'Пример со степенями',
        prompt: `Вычислите значение выражения:`,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Сначала возведи каждое число в степень, а затем выполни ${isPlus ? 'сложение' : 'вычитание'}.`
      };
    }

    if (sub === 'mult_power') {
      // k * a^n + b или k * a^n - b или b + k * a^n
      const k = pickRandom([2, 3, 4, 5]);
      const base = pickRandom([2, 3, 4, 5]);
      const exp = base === 2 ? randInt(2, 5) : (base === 3 ? randInt(2, 3) : 2);
      const powVal = Math.pow(base, exp);
      const isPlus = Math.random() < 0.6;
      const b = randInt(5, 30);
      const ans = isPlus ? (k * powVal + b) : (k * powVal - b);

      const op = isPlus ? '+' : '−';
      const questionHtml = `<div class="math-expr"><span class="expr-line">${k} · ${base}<sup>${exp}</sup> ${op} ${b} = ?</span></div>`;
      const solutionSteps = [
        `Порядок действий: 1) степень, 2) умножение, 3) ${isPlus ? 'сложение' : 'вычитание'}:`,
        `1) Возводим в степень: ${base}<sup>${exp}</sup> = ${powVal}`,
        `2) Умножаем: ${k} × ${powVal} = ${k * powVal}`,
        `3) ${isPlus ? 'Складываем' : 'Вычитаем'}: ${k * powVal} ${op} ${b} = <strong>${ans}</strong>.`
      ];
      return {
        category: 'powers_expressions',
        catName: 'Пример со степенями',
        prompt: `Найдите значение числового выражения:`,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint: `Сначала возведи ${base} в степень ${exp}, затем умножь на ${k}, и в конце сделай ${op === '+' ? 'сложение' : 'вычитание'}.`
      };
    }

    if (sub === 'div_power') {
      // m : a^n + b^k или a^n : k + b
      const type = Math.random() < 0.5 ? 1 : 2;

      if (type === 1) {
        // m : a^n + b^k
        const a = pickRandom([2, 3, 4]);
        const n = 2;
        const aSq = a * a;
        const q = randInt(2, 10);
        const m = q * aSq;
        const b = pickRandom([2, 3, 5]);
        const k = b === 2 ? 3 : 2;
        const bPow = Math.pow(b, k);
        const ans = q + bPow;

        const questionHtml = `<div class="math-expr"><span class="expr-line">${m} : ${a}<sup>${n}</sup> + ${b}<sup>${k}</sup> = ?</span></div>`;
        const solutionSteps = [
          `Порядок действий: сначала возведение в степени, затем деление, затем сложение:`,
          `1) ${a}<sup>${n}</sup> = ${aSq} и ${b}<sup>${k}</sup> = ${bPow}`,
          `2) Выполняем деление: ${m} : ${aSq} = ${q}`,
          `3) Складываем: ${q} + ${bPow} = <strong>${ans}</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Вычислите пример с делением и степенями:`,
          questionHtml,
          answer: ans,
          displayAnswer: String(ans),
          solutionSteps,
          hint: `Сначала вычисли степени, потом раздели, потом сложи.`
        };
      } else {
        // 10^3 : 20 - 4^2
        const ans = 1000 / 25 - 16; // 40 - 16 = 24
        const questionHtml = `<div class="math-expr"><span class="expr-line">10<sup>3</sup> : 25 − 4<sup>2</sup> = ?</span></div>`;
        const solutionSteps = [
          `1) Возводим в степени: 10<sup>3</sup> = 1000 и 4<sup>2</sup> = 16`,
          `2) Делим: 1000 : 25 = 40`,
          `3) Вычитаем: 40 − 16 = <strong>24</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Вычислите пример:`,
          questionHtml,
          answer: 24,
          displayAnswer: '24',
          solutionSteps,
          hint: `10³ = 1000, 4² = 16. Сначала раздели 1000 на 25, потом вычти 16.`
        };
      }
    }

    if (sub === 'brackets_power') {
      // (a + b)^2 - c или (a - b)^3 + c
      const isCube = Math.random() < 0.4;
      if (isCube) {
        const diff = randInt(2, 5);
        const b = randInt(2, 10);
        const a = b + diff;
        const cubeVal = diff * diff * diff;
        const c = randInt(5, 30);
        const ans = cubeVal + c;

        const questionHtml = `<div class="math-expr"><span class="expr-line">(${a} − ${b})<sup>3</sup> + ${c} = ?</span></div>`;
        const solutionSteps = [
          `Сначала выполняем действие в скобках, затем возведение в степень, затем сложение:`,
          `1) В скобках: ${a} − ${b} = ${diff}`,
          `2) Возводим в куб: ${diff}<sup>3</sup> = ${diff} × ${diff} × ${diff} = ${cubeVal}`,
          `3) Прибавляем ${c}: ${cubeVal} + ${c} = <strong>${ans}</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Вычислите пример со скобками:`,
          questionHtml,
          answer: ans,
          displayAnswer: String(ans),
          solutionSteps,
          hint: `Сначала вычти числа в скобках, затем возведи результат в куб.`
        };
      } else {
        const sum = randInt(4, 9);
        const a = randInt(2, sum - 1);
        const b = sum - a;
        const sqVal = sum * sum;
        const c = randInt(5, 25);
        const isPlus = Math.random() < 0.5;
        const ans = isPlus ? sqVal + c : sqVal - c;
        const op = isPlus ? '+' : '−';

        const questionHtml = `<div class="math-expr"><span class="expr-line">(${a} + ${b})<sup>2</sup> ${op} ${c} = ?</span></div>`;
        const solutionSteps = [
          `1) Сначала действие в скобках: ${a} + ${b} = ${sum}`,
          `2) Возводим в квадрат: ${sum}<sup>2</sup> = ${sqVal}`,
          `3) ${isPlus ? 'Прибавляем' : 'Вычитаем'}: ${sqVal} ${op} ${c} = <strong>${ans}</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Вычислите значение выражения:`,
          questionHtml,
          answer: ans,
          displayAnswer: String(ans),
          solutionSteps,
          hint: `Сложи числа в скобках, возведи сумму в квадрат, а затем ${isPlus ? 'прибавь' : 'вычти'} ${c}.`
        };
      }
    }

    if (sub === 'brackets_diff_squares') {
      // (10^2 - 8^2) : c или 100 - (3^2 + 4^2)
      const mode = Math.random() < 0.5 ? 1 : 2;
      if (mode === 1) {
        // (10^2 - 8^2) : 6 = (100 - 64) : 6 = 36 : 6 = 6
        const ans = (100 - 64) / 6;
        const questionHtml = `<div class="math-expr"><span class="expr-line">(10<sup>2</sup> − 8<sup>2</sup>) : 6 = ?</span></div>`;
        const solutionSteps = [
          `Сначала вычисляем значение внутри скобок:`,
          `1) 10<sup>2</sup> = 100 и 8<sup>2</sup> = 64`,
          `2) В скобках: 100 − 64 = 36`,
          `3) Делим на 6: 36 : 6 = <strong>${ans}</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Вычислите выражение со скобками и делением:`,
          questionHtml,
          answer: ans,
          displayAnswer: String(ans),
          solutionSteps,
          hint: `Сначала найди 10² и 8², вычти их в скобках, а затем раздели на 6.`
        };
      } else {
        // 100 - (3^2 + 4^2) = 100 - (9 + 16) = 75
        const ans = 100 - (9 + 16);
        const questionHtml = `<div class="math-expr"><span class="expr-line">100 − (3<sup>2</sup> + 4<sup>2</sup>) = ?</span></div>`;
        const solutionSteps = [
          `1) Возводим в степени внутри скобок: 3<sup>2</sup> = 9 и 4<sup>2</sup> = 16`,
          `2) Складываем в скобках: 9 + 16 = 25`,
          `3) Вычитаем из 100: 100 − 25 = <strong>${ans}</strong>.`
        ];
        return {
          category: 'powers_expressions',
          catName: 'Пример со степенями',
          prompt: `Найдите значение выражения:`,
          questionHtml,
          answer: ans,
          displayAnswer: String(ans),
          solutionSteps,
          hint: `Посчитай степени в скобках: 3² = 9 и 4² = 16, сложи их и вычти из 100.`
        };
      }
    }

    // three_operations
    // (2 + 3)^2 * 2 - 15 = 5^2 * 2 - 15 = 25 * 2 - 15 = 35
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const sum = a + b;
    const sq = sum * sum;
    const mul = randInt(2, 3);
    const subVal = randInt(5, 20);
    const ans = sq * mul - subVal;

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${a} + ${b})<sup>2</sup> · ${mul} − ${subVal} = ?</span></div>`;
    const solutionSteps = [
      `Строгий порядок действий: скобки → степень → умножение → вычитание:`,
      `1) В скобках: ${a} + ${b} = ${sum}`,
      `2) В степень: ${sum}<sup>2</sup> = ${sq}`,
      `3) Умножение: ${sq} × ${mul} = ${sq * mul}`,
      `4) Вычитание: ${sq * mul} − ${subVal} = <strong>${ans}</strong>.`
    ];
    return {
      category: 'powers_expressions',
      catName: 'Пример со степенями',
      prompt: `Вычислите комбинированный пример:`,
      questionHtml,
      answer: ans,
      displayAnswer: String(ans),
      solutionSteps,
      hint: `Сначала скобки (${a}+${b}), затем степень, потом умножение на ${mul}, в конце вычитание.`
    };
  }

  // --- 4. СТЕПЕНИ 10 (POWERS OF TEN) ---

  function genPowersOfTen() {
    const isDecimal = Math.random() < 0.6; // 60% десятичные, 40% целые
    const k = randInt(2, 5); // 10^2 .. 10^5
    const tenPower = Math.pow(10, k);

    let coeff, displayCoeff, ans, solutionSteps, hint;

    if (isDecimal) {
      const decimalType = pickRandom(['one_digit', 'two_digits', 'lead_zero']);
      if (decimalType === 'one_digit') {
        const intPart = pickRandom([randInt(1, 9), randInt(11, 45)]);
        const fracPart = randInt(1, 9);
        coeff = Number(`${intPart}.${fracPart}`);
        displayCoeff = `${intPart},${fracPart}`;
      } else if (decimalType === 'two_digits') {
        const intPart = randInt(0, 9);
        const fracPart = randInt(11, 99);
        coeff = Number(`${intPart}.${fracPart}`);
        displayCoeff = `${intPart},${fracPart}`;
      } else {
        const zeros = k >= 4 ? '00' : '0';
        const num = randInt(2, 9);
        coeff = Number(`0.${zeros}${num}`);
        displayCoeff = `0,${zeros}${num}`;
      }

      ans = Math.round(coeff * tenPower);
      const prompt = `Вычислите значение выражения со степенью 10:`;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${displayCoeff} × 10<sup>${k}</sup> = ?</span></div>`;

      solutionSteps = [
        `Степень 10<sup>${k}</sup> равна единице с ${k} нулями: <strong>10<sup>${k}</sup> = ${tenPower}</strong>.`,
        `При умножении десятичной дроби на 10, 100, 1000... запятая переносится вправо на столько знаков, сколько нулей (на ${k} знака):`,
        `<code>${displayCoeff} × ${tenPower} = <strong>${ans}</strong></code>.`
      ];
      hint = `Степень 10<sup>${k}</sup> — это ${tenPower}. При умножении перенеси запятую вправо на ${k} знака (дописывая нули при необходимости).`;

      return {
        category: 'powers_ten',
        catName: 'Степени 10',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint
      };
    } else {
      coeff = pickRandom([randInt(11, 99), randInt(105, 450), randInt(2, 9)]);
      displayCoeff = String(coeff);
      ans = coeff * tenPower;

      const prompt = `Вычислите произведение целого числа и степени 10:`;
      const questionHtml = `<div class="math-expr"><span class="expr-line">${displayCoeff} × 10<sup>${k}</sup> = ?</span></div>`;

      solutionSteps = [
        `Степень 10<sup>${k}</sup> — это единица с ${k} нулями: <strong>10<sup>${k}</sup> = ${tenPower}</strong>.`,
        `Чтобы умножить целое число на 10<sup>${k}</sup>, достаточно приписать к числу ${displayCoeff} ровно ${k} нуля:`,
        `<code>${displayCoeff} × ${tenPower} = <strong>${ans}</strong></code>.`
      ];
      hint = `10<sup>${k}</sup> = ${tenPower}. Просто припиши к числу ${displayCoeff} ровно ${k} нуля.`;

      return {
        category: 'powers_ten',
        catName: 'Степени 10',
        prompt,
        questionHtml,
        answer: ans,
        displayAnswer: String(ans),
        solutionSteps,
        hint
      };
    }
  }

  // --- ЕДИНЫЙ ГЕНЕРАТОР ПО РЕЖИМАМ ---

  function generateTask(mode) {
    switch (mode) {
      case 'powers_calculate':
      case 'calculate':
        return genCalculatePower();

      case 'powers_equations':
      case 'equations':
        return genPowerEquation();

      case 'powers_expressions':
      case 'expressions':
        return genPowerExpression();

      case 'powers_ten':
      case 'ten':
        return genPowersOfTen();

      case 'powers_all':
      case 'mixed_all':
      case 'mixed':
      default:
        return pickRandom([genCalculatePower, genPowerEquation, genPowerExpression, genPowersOfTen])();
    }
  }

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не введён' };
    }

    const clean = String(rawUserAnswer).trim().replace(/\s+/g, '').replace(',', '.');
    if (clean === '') {
      return { isCorrect: false, error: 'Введите число' };
    }

    const userNum = Number(clean);
    if (isNaN(userNum)) {
      return { isCorrect: false, error: 'Ответ должен быть числом' };
    }

    const correctNum = Number(task.answer);
    const isCorrect = Math.abs(userNum - correctNum) < 0.0001;

    return {
      isCorrect,
      userAnswer: userNum,
      correctAnswer: correctNum,
      displayAnswer: task.displayAnswer || String(correctNum)
    };
  }

  return {
    generateTask,
    checkAnswer,
    genCalculatePower,
    genPowerEquation,
    genPowerExpression,
    genPowersOfTen
  };
}));
