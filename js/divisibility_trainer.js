/**
 * Тренажёр по математике · 5 класс
 * «Проверка на делимость (2, 3, 4, 5, 7, 9, 10)»
 *
 * Модуль генерации задач и проверки ответов для интерактивного тренажёра
 * и конструктора домашних заданий.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DivisibilityTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ALLOWED_DIVISORS = [2, 3, 4, 5, 7, 9, 10];

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function getDigitsSum(n) {
    return String(n)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  function generateRawTask(category) {
    let divisor;
    if (!category || category === 'all' || category === 'divisibility_all') {
      divisor = ALLOWED_DIVISORS[Math.floor(Math.random() * ALLOWED_DIVISORS.length)];
    } else {
      const parsed = parseInt(String(category).replace('divisibility_', ''), 10);
      if (ALLOWED_DIVISORS.includes(parsed)) {
        divisor = parsed;
      } else {
        divisor = ALLOWED_DIVISORS[Math.floor(Math.random() * ALLOWED_DIVISORS.length)];
      }
    }

    // Цель: ~50% Да, ~50% Нет
    const isDivisible = Math.random() < 0.5;
    let number = 0;

    if (divisor === 2) {
      const base = Math.floor(Math.random() * 900) + 10; // 10..909
      const evenDigits = [0, 2, 4, 6, 8];
      const oddDigits = [1, 3, 5, 7, 9];
      const last = isDivisible 
        ? evenDigits[Math.floor(Math.random() * evenDigits.length)]
        : oddDigits[Math.floor(Math.random() * oddDigits.length)];
      number = base * 10 + last;
    } else if (divisor === 3) {
      const mult = Math.floor(Math.random() * 1200) + 15;
      if (isDivisible) {
        number = mult * 3;
      } else {
        const remainder = Math.random() < 0.5 ? 1 : 2;
        number = mult * 3 + remainder;
      }
    } else if (divisor === 4) {
      const mult = Math.floor(Math.random() * 800) + 15;
      if (isDivisible) {
        number = mult * 4;
      } else {
        const rems = [1, 2, 2, 3];
        const rem = rems[Math.floor(Math.random() * rems.length)];
        number = mult * 4 + rem;
      }
    } else if (divisor === 5) {
      const base = Math.floor(Math.random() * 900) + 10;
      if (isDivisible) {
        const last = Math.random() < 0.5 ? 0 : 5;
        number = base * 10 + last;
      } else {
        const non5Digits = [1, 2, 3, 4, 6, 7, 8, 9];
        const last = non5Digits[Math.floor(Math.random() * non5Digits.length)];
        number = base * 10 + last;
      }
    } else if (divisor === 7) {
      const mult = Math.floor(Math.random() * 400) + 7;
      if (isDivisible) {
        number = mult * 7;
      } else {
        const rem = Math.floor(Math.random() * 6) + 1;
        number = mult * 7 + rem;
      }
    } else if (divisor === 9) {
      const mult = Math.floor(Math.random() * 600) + 8;
      if (isDivisible) {
        number = mult * 9;
      } else {
        const rems = [1, 2, 3, 4, 5, 6, 7, 8];
        const rem = rems[Math.floor(Math.random() * rems.length)];
        number = mult * 9 + rem;
      }
    } else if (divisor === 10) {
      const base = Math.floor(Math.random() * 900) + 10;
      if (isDivisible) {
        number = base * 10;
      } else {
        const non0Digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const last = non0Digits[Math.floor(Math.random() * non0Digits.length)];
        number = base * 10 + last;
      }
    }

    const answer = (number % divisor === 0) ? 'yes' : 'no';

    const digits = String(number).split('');
    const lastDigit = parseInt(digits[digits.length - 1], 10);
    const last2 = number % 100;
    const last2Str = last2 < 10 ? ('0' + last2) : String(last2);
    const sumDigits = getDigitsSum(number);

    let ruleText = '';
    let mathText = '';

    if (divisor === 2) {
      ruleText = `Число делится на 2, если его последняя цифра чётная (0, 2, 4, 6, 8). Последняя цифра числа ${formatNumber(number)} — ${lastDigit}.`;
      mathText = (answer === 'yes') 
        ? `${lastDigit} — чётная цифра → ${formatNumber(number)} делится на 2` 
        : `${lastDigit} — нечётная цифра → ${formatNumber(number)} НЕ делится на 2`;
    } else if (divisor === 3) {
      ruleText = `Число делится на 3, если сумма его цифр делится на 3. Сумма цифр: ${digits.join(' + ')} = ${sumDigits}.`;
      mathText = (answer === 'yes')
        ? `${sumDigits} : 3 = ${sumDigits / 3} → делится на 3`
        : `${sumDigits} : 3 = ${Math.floor(sumDigits / 3)} (остаток ${sumDigits % 3}) → НЕ делится на 3`;
    } else if (divisor === 4) {
      ruleText = `Число делится на 4, если две его последние цифры образуют число, делящееся на 4 (или 00). Две последние цифры: ${last2Str}.`;
      mathText = (answer === 'yes')
        ? `${last2} : 4 = ${last2 / 4} → делится на 4`
        : `${last2} : 4 = ${Math.floor(last2 / 4)} (остаток ${last2 % 4}) → НЕ делится на 4`;
    } else if (divisor === 5) {
      ruleText = `Число делится на 5, если его последняя цифра 0 или 5. Последняя цифра: ${lastDigit}.`;
      mathText = (answer === 'yes')
        ? `Оканчивается на ${lastDigit} → делится на 5`
        : `Оканчивается на ${lastDigit} (не 0 и не 5) → НЕ делится на 5`;
    } else if (divisor === 7) {
      ruleText = `Проверка делимости на 7: ${formatNumber(number)} : 7 = ${Math.floor(number / 7)}${number % 7 === 0 ? ' (нацело)' : ' (остаток ' + (number % 7) + ')'}.`;
      mathText = (answer === 'yes')
        ? `${formatNumber(number)} = 7 × ${number / 7} → делится на 7`
        : `${formatNumber(number)} = 7 × ${Math.floor(number / 7)} + ${number % 7} → НЕ делится на 7`;
    } else if (divisor === 9) {
      ruleText = `Число делится на 9, если сумма его цифр делится на 9. Сумма цифр: ${digits.join(' + ')} = ${sumDigits}.`;
      mathText = (answer === 'yes')
        ? `${sumDigits} : 9 = ${sumDigits / 9} → делится на 9`
        : `${sumDigits} : 9 = ${Math.floor(sumDigits / 9)} (остаток ${sumDigits % 9}) → НЕ делится на 9`;
    } else if (divisor === 10) {
      ruleText = `Число делится на 10, если его последняя цифра равна 0. Последняя цифра: ${lastDigit}.`;
      mathText = (answer === 'yes')
        ? `Оканчивается на 0 → делится на 10`
        : `Оканчивается на ${lastDigit} → НЕ делится на 10`;
    }

    return {
      divisor,
      number,
      answer,
      ruleText,
      mathText
    };
  }

  function generateSelectTask(category) {
    let divisor;
    const stripped = String(category || '').replace('divisibility_select_', '').replace('divisibility_select', '');
    if (!stripped || stripped === 'all') {
      divisor = ALLOWED_DIVISORS[Math.floor(Math.random() * ALLOWED_DIVISORS.length)];
    } else {
      const parsed = parseInt(stripped, 10);
      divisor = ALLOWED_DIVISORS.includes(parsed)
        ? parsed
        : ALLOWED_DIVISORS[Math.floor(Math.random() * ALLOWED_DIVISORS.length)];
    }

    const countChoices = [1, 2, 2, 3, 3, 4];
    const divisibleCount = countChoices[Math.floor(Math.random() * countChoices.length)];
    const used = new Set();
    const items = [];

    for (let i = 0; i < 5; i++) {
      const wantDivisible = i < divisibleCount;
      let num = 0;
      let guard = 0;
      do {
        const raw = generateRawTask(String(divisor));
        if ((raw.number % divisor === 0) === wantDivisible) {
          num = raw.number;
        } else {
          const base = Math.floor(Math.random() * 400) + 12;
          num = wantDivisible ? base * divisor : base * divisor + (divisor === 2 ? 1 : (Math.floor(Math.random() * (divisor - 1)) + 1));
        }
        guard++;
      } while ((used.has(num) || (num % divisor === 0) !== wantDivisible) && guard < 40);

      used.add(num);
      items.push({
        value: num,
        isDivisible: num % divisor === 0
      });
    }

    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }

    const selectNumbers = items.map(it => it.value);
    const correctInOrder = items.filter(it => it.isDivisible).map(it => it.value);
    const correctSorted = correctInOrder.slice().sort((a, b) => a - b);

    const canonical = correctSorted.join(', ');
    const acceptedSet = new Set([
      canonical,
      correctSorted.join(','),
      correctSorted.join(' '),
      correctInOrder.join(', '),
      correctInOrder.join(','),
      correctInOrder.join(' ')
    ]);

    const breakdownSteps = items.map(it => {
      const mark = it.isDivisible ? '✅' : '❌';
      return `${mark} <strong>${formatNumber(it.value)}</strong> — ${it.isDivisible ? 'делится' : 'не делится'} на ${divisor}`;
    });

    return {
      type: 'divisibility_select',
      divisor,
      selectNumbers,
      category: 'divisibility',
      catName: `Выбор делящихся чисел (на ${divisor})`,
      prompt: `Какие из данных чисел делятся на ${divisor}? Выберите их:`,
      questionHtml: `<div class="math-expr">Какие из данных чисел делятся на <strong>${divisor}</strong>? Выберите их:<br><div style="margin-top:10px; font-size:1.05em; letter-spacing:0.02em;">${selectNumbers.map(n => `<span style="display:inline-block; padding:4px 10px; margin:3px 4px; border:1px solid rgba(38,63,97,0.22); border-radius:8px; background:rgba(38,63,97,0.05); font-weight:700;">${formatNumber(n)}</span>`).join('')}</div></div>`,
      answer: canonical,
      displayAnswer: canonical,
      acceptedAnswers: Array.from(acceptedSet),
      solutionSteps: [
        ...breakdownSteps,
        `<strong>Ответ:</strong> ${canonical}`
      ]
    };
  }

  function generateTask(category) {
    if (String(category || '').startsWith('divisibility_select')) {
      return generateSelectTask(category);
    }
    const raw = generateRawTask(category);
    const isYes = raw.answer === 'yes';
    const ansRu = isYes ? 'да' : 'нет';

    return {
      ...raw,
      category: 'divisibility',
      catName: `Признак делимости на ${raw.divisor}`,
      prompt: `Проверьте делимость числа на ${raw.divisor}:`,
      questionHtml: `<div class="math-expr">Делится ли число <strong>${formatNumber(raw.number)}</strong> на <strong>${raw.divisor}</strong>?<br><span style="font-size:0.85em; color:var(--muted); font-weight:500;">(Ответ запишите словом: <strong>да</strong> или <strong>нет</strong>)</span></div>`,
      answer: ansRu,
      displayAnswer: ansRu,
      acceptedAnswers: [ansRu, isYes ? 'yes' : 'no', isYes ? '+' : '-'],
      solutionSteps: [
        raw.ruleText,
        raw.mathText,
        `<strong>Ответ:</strong> ${ansRu.toUpperCase()}`
      ]
    };
  }

  function checkAnswer(task, userAns) {
    if (!task || userAns === undefined || userAns === null) return { isCorrect: false };
    const clean = String(userAns).trim().toLowerCase();
    const isYes = task.answer === 'yes' || task.answer === 'да';
    const correctRu = isYes ? 'да' : 'нет';

    let userBool = null;
    if (clean === 'yes' || clean === 'да' || clean === '+') userBool = true;
    else if (clean === 'no' || clean === 'нет' || clean === '-') userBool = false;

    if (userBool === null) return { isCorrect: false };
    return {
      isCorrect: userBool === isYes,
      correctAnswer: correctRu,
      userAnswer: clean
    };
  }

  return {
    generateRawTask,
    generateSelectTask,
    generateTask,
    checkAnswer,
    formatNumber,
    ALLOWED_DIVISORS
  };
}));
