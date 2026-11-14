/**
 * Тренажёр по математике · 5 класс
 * «Выделение целой части в дробях (слож.)»
 *
 * Отработка выделения целой части из крупных неправильных дробей (3- и 4-значные числители)
 * и перевод их в десятичные дроби.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ExtractWholeAdvancedTrainer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Знаменатели, дающие конечные десятичные дроби
  const DENOMINATORS = [
    { d: 2, mult: 5, target: 10 },
    { d: 4, mult: 25, target: 100 },
    { d: 5, mult: 2, target: 10 },
    { d: 8, mult: 125, target: 1000 },
    { d: 10, mult: 1, target: 10 },
    { d: 16, mult: 625, target: 10000 },
    { d: 20, mult: 5, target: 100 },
    { d: 25, mult: 4, target: 100 },
    { d: 40, mult: 25, target: 1000 },
    { d: 50, mult: 2, target: 100 },
    { d: 125, mult: 8, target: 1000 },
    { d: 200, mult: 5, target: 1000 },
    { d: 250, mult: 4, target: 1000 },
    { d: 500, mult: 2, target: 1000 }
  ];

  /**
   * Генерация сложной неправильной дроби с 3- или 4-значным числителем
   */
  function generateFractionProblem(mode) {
    const denObj = pickRandom(DENOMINATORS);
    const d = denObj.d;

    // Решаем, делать ли 3-значный (60%) или 4-значный (40%) числитель
    const isFourDigit = Math.random() < 0.45;
    const minN = isFourDigit ? 1000 : 100;
    const maxN = isFourDigit ? 9850 : 999;

    const minW = Math.max(2, Math.floor(minN / d));
    const maxW = Math.max(minW + 2, Math.floor(maxN / d));
    const whole = randInt(minW, maxW);

    // 20% шанс деления нацело, 80% с остатком
    const hasRemainder = Math.random() > 0.18;
    const rem = hasRemainder ? randInt(1, d - 1) : 0;
    const num = whole * d + rem;

    // Десятичное значение
    const decimalValue = Math.round((num / d) * 100000) / 100000;
    const displayDecimal = String(decimalValue).replace('.', ',');

    // Пошаговый разбор
    const steps = [];
    steps.push(
      `Делим числитель <strong>${num}</strong> на знаменатель <strong>${d}</strong> с остатком (в столбик):<br>` +
      `<code>${num} : ${d} = ${whole}</code> (остаток <code>${rem}</code>), так как <code>${whole} × ${d} + ${rem} = ${whole * d} + ${rem} = ${num}</code>.`
    );

    if (rem > 0) {
      steps.push(
        `Записываем смешанное число: неполное частное <strong>${whole}</strong> становится целой частью, а остаток <strong>${rem}</strong> — числителем дробной части:<br>` +
        `<strong>${whole} <sup>${rem}</sup>/<sub>${d}</sub></strong>.`
      );

      let decConversionDesc = '';
      if (denObj.mult > 1) {
        const expandedRem = rem * denObj.mult;
        decConversionDesc =
          `Домножаем дробную часть <code>${rem}/${d}</code> на <strong>${denObj.mult}</strong>, чтобы в знаменателе получилось <strong>${denObj.target}</strong>:<br>` +
          `<code>(${rem} × ${denObj.mult}) / (${d} × ${denObj.mult}) = ${expandedRem} / ${denObj.target} = ${expandedRem / denObj.target}</code>.`;
      } else {
        decConversionDesc = `Делим остаток на знаменатель: <code>${rem} : ${d} = ${rem / d}</code>.`;
      }
      steps.push(decConversionDesc);

      steps.push(
        `Складываем целую часть и полученную десятичную дробь:<br>` +
        `<code>${whole} + ${rem / d} = <strong>${displayDecimal}</strong></code>.`
      );
    } else {
      steps.push(
        `Так как остаток равен <strong>0</strong>, дробь делится нацело:<br>` +
        `<code>${num} : ${d} = <strong>${whole}</strong></code> (в десятичном виде: <strong>${whole}</strong>).`
      );
    }

    let effectiveMode = mode;
    if (mode === 'mixed' || !mode) {
      effectiveMode = pickRandom(['full', 'to_decimal', 'extract_only']);
    }

    let promptText = '';
    if (effectiveMode === 'full') {
      promptText = rem > 0
        ? 'Выделите целую часть из неправильной дроби и запишите её в виде десятичной дроби:'
        : 'Разделите числитель на знаменатель (дробь делится нацело):';
    } else if (effectiveMode === 'to_decimal') {
      promptText = 'Переведите крупную неправильную дробь в десятичную (выделив целую часть):';
    } else {
      promptText = 'Выделите целую часть из неправильной дроби (запишите смешанное число):';
    }

    return {
      mode: effectiveMode,
      num,
      den: d,
      whole,
      rem,
      hasRemainder: rem > 0,
      decimalValue,
      displayDecimal,
      promptText,
      solutionSteps: steps,
      hint: rem > 0
        ? `Раздели ${num} на ${d} с остатком. Целая часть: ${num} : ${d} = ${whole} (остаток ${rem}). Затем переведи ${rem}/${d} в десятичную дробь.`
        : `Раздели ${num} на ${d} в столбик: ${num} : ${d} = ${whole}.`
    };
  }

  /**
   * Проверка введённых ответов
   */
  function checkAnswer(task, userInputs) {
    if (!task) return { isCorrect: false, error: 'Задача не найдена' };

    const mode = task.mode;
    const whole = task.whole;
    const rem = task.rem;
    const decVal = task.decimalValue;

    // Извлечение введённых значений
    const rawWhole = (userInputs.whole !== undefined && userInputs.whole !== null) ? String(userInputs.whole).trim() : '';
    const rawRem = (userInputs.rem !== undefined && userInputs.rem !== null) ? String(userInputs.rem).trim() : '';
    const rawDecimal = (userInputs.decimal !== undefined && userInputs.decimal !== null) ? String(userInputs.decimal).trim().replace(',', '.') : '';

    if (mode === 'to_decimal') {
      if (!rawDecimal) return { isCorrect: false, error: 'Введите десятичную дробь' };
      const userDec = parseFloat(rawDecimal);
      if (isNaN(userDec)) return { isCorrect: false, error: 'Ответ должен быть числом' };
      const isCorrect = Math.abs(userDec - decVal) < 0.00001;
      return {
        isCorrect,
        correctDecimal: task.displayDecimal,
        userDecimal: rawDecimal
      };
    }

    if (mode === 'extract_only') {
      if (task.rem === 0) {
        if (!rawWhole) return { isCorrect: false, error: 'Укажите результат деления' };
        const userW = parseInt(rawWhole, 10);
        const isCorrect = userW === whole;
        return { isCorrect, correctWhole: whole, userWhole: userW };
      }
      if (!rawWhole || !rawRem) return { isCorrect: false, error: 'Укажите целую часть и остаток (числитель)' };
      const userW = parseInt(rawWhole, 10);
      const userR = parseInt(rawRem, 10);
      const isCorrect = (userW === whole && userR === rem);
      return {
        isCorrect,
        correctWhole: whole,
        correctRem: rem,
        userWhole: userW,
        userRem: userR
      };
    }

    // Режим 'full': пользователь вводит целую часть, остаток и десятичную дробь
    if (task.rem === 0) {
      // Если делится нацело, достаточно проверить целое или десятичное
      const userW = parseInt(rawWhole || rawDecimal, 10);
      const isCorrect = userW === whole;
      return {
        isCorrect,
        correctWhole: whole,
        correctDecimal: task.displayDecimal
      };
    }

    const hasAnyDec = rawDecimal !== '';
    const hasAnyMixed = (rawWhole !== '' && rawRem !== '');

    if (!hasAnyDec && !hasAnyMixed) {
      return { isCorrect: false, error: 'Заполните поля ответа' };
    }

    const userW = parseInt(rawWhole, 10);
    const userR = parseInt(rawRem, 10);
    const userDec = parseFloat(rawDecimal);

    const isMixedCorrect = (userW === whole && userR === rem);
    const isDecCorrect = !isNaN(userDec) && Math.abs(userDec - decVal) < 0.00001;

    // Если заполнены все три поля — все три должны быть верны
    if (hasAnyMixed && hasAnyDec) {
      return {
        isCorrect: isMixedCorrect && isDecCorrect,
        isMixedCorrect,
        isDecCorrect,
        correctWhole: whole,
        correctRem: rem,
        correctDecimal: task.displayDecimal
      };
    }

    // Если заполнено только смешанное или только десятичное — даём частичный зачёт/подсказку
    if (hasAnyDec && !hasAnyMixed) {
      return {
        isCorrect: isDecCorrect,
        isPartial: true,
        isDecCorrect,
        correctWhole: whole,
        correctRem: rem,
        correctDecimal: task.displayDecimal,
        note: 'Десятичная дробь указана верно! Для максимального балла заполните также целую часть и остаток.'
      };
    }

    if (hasAnyMixed && !hasAnyDec) {
      return {
        isCorrect: isMixedCorrect,
        isPartial: true,
        isMixedCorrect,
        correctWhole: whole,
        correctRem: rem,
        correctDecimal: task.displayDecimal,
        note: 'Смешанное число выделено верно! Не забудьте перевести дробь в десятичную.'
      };
    }

    return { isCorrect: false };
  }

  function generateTask(type) {
    let mode = 'full';
    if (type === 'extract_whole_adv_decimal') mode = 'to_decimal';
    else if (type === 'extract_whole_adv_only') mode = 'extract_only';
    else if (type === 'extract_whole_adv_full') mode = 'full';
    else if (type === 'extract_whole_adv_all' || type === 'mixed') mode = 'mixed';

    const p = generateFractionProblem(mode);
    const num = p.num;
    const den = p.den;
    const whole = p.whole;
    const rem = p.rem;
    const decStr = p.displayDecimal;

    let questionHtml = '';
    let primaryAns = '';
    let displayAns = '';
    let accepted = [];

    if (p.mode === 'to_decimal') {
      questionHtml = `<div class="math-expr">Переведите неправильную дробь в десятичную:<br><span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span> = ?</div>`;
      primaryAns = decStr;
      displayAns = decStr;
      accepted = [decStr, String(p.decimalValue), `${whole} ${rem}/${den}`];
    } else if (p.mode === 'extract_only') {
      questionHtml = `<div class="math-expr">Выделите целую часть из неправильной дроби (запишите смешанное число):<br><span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span> = ?</div>`;
      primaryAns = rem > 0 ? `${whole} ${rem}/${den}` : String(whole);
      displayAns = primaryAns;
      accepted = rem > 0 ? [`${whole} ${rem}/${den}`, `${whole} ${rem}/${den}`, `${whole}+${rem}/${den}`] : [String(whole)];
    } else {
      questionHtml = `<div class="math-expr">Выделите целую часть и запишите десятичную дробь:<br><span class="fraction"><span class="num">${num}</span><span class="den">${den}</span></span> = ?</div>`;
      primaryAns = decStr;
      displayAns = rem > 0 ? `${whole} ${rem}/${den} = ${decStr}` : `${whole} = ${decStr}`;
      accepted = [decStr, String(p.decimalValue), `${whole} ${rem}/${den}`];
    }

    return {
      ...p,
      category: 'extract_whole_advanced',
      catName: 'Выделение целой части (слож.)',
      questionHtml,
      answer: primaryAns,
      displayAnswer: displayAns,
      acceptedAnswers: accepted,
      solutionSteps: p.solutionSteps
    };
  }

  return {
    generateFractionProblem,
    generateTask,
    checkAnswer,
    DENOMINATORS
  };
}));
