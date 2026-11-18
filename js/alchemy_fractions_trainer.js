/**
 * ALCHEMY FRACTIONS TRAINER LOGIC (5 КЛАСС)
 * Интерактивный режим: «Алхимическая лаборатория дробей · Синтез эликсиров»
 * НЕШкола · Образовательная платформа
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. MATHEMATICAL FRACTION CLASS
  // =========================================================================

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    if (!a || !b) return 1;
    return Math.abs(a * b) / gcd(a, b);
  }

  class Fraction {
    constructor(whole = 0, num = 0, den = 1) {
      this.whole = Math.max(0, parseInt(whole, 10) || 0);
      this.num = Math.max(0, parseInt(num, 10) || 0);
      this.den = Math.max(1, parseInt(den, 10) || 1);
    }

    toImproper() {
      return {
        num: this.whole * this.den + this.num,
        den: this.den
      };
    }

    static fromImproper(num, den) {
      if (den === 0) den = 1;
      const whole = Math.floor(num / den);
      const rem = num % den;
      return new Fraction(whole, rem, den);
    }

    toFloat() {
      return this.whole + (this.num / this.den);
    }

    reduce() {
      if (this.num === 0) {
        return new Fraction(this.whole, 0, 1);
      }
      const g = gcd(this.num, this.den);
      return new Fraction(this.whole, this.num / g, this.den / g);
    }

    isIrreducible() {
      if (this.num === 0) return true;
      if (this.num >= this.den) return false; // Не выделена целая часть
      return gcd(this.num, this.den) === 1;
    }

    getReductionDivisor() {
      if (this.num === 0) return 1;
      return gcd(this.num, this.den);
    }

    add(other) {
      const a = this.toImproper();
      const b = other.toImproper();
      const commonDen = lcm(a.den, b.den);
      const resNum = (a.num * (commonDen / a.den)) + (b.num * (commonDen / b.den));
      return Fraction.fromImproper(resNum, commonDen);
    }

    subtract(other) {
      const a = this.toImproper();
      const b = other.toImproper();
      const commonDen = lcm(a.den, b.den);
      const resNum = (a.num * (commonDen / a.den)) - (b.num * (commonDen / b.den));
      return Fraction.fromImproper(Math.max(0, resNum), commonDen);
    }

    multiply(other) {
      const a = this.toImproper();
      const b = other.toImproper();
      return Fraction.fromImproper(a.num * b.num, a.den * b.den);
    }

    divide(other) {
      const a = this.toImproper();
      const b = other.toImproper();
      if (b.num === 0) return this;
      return Fraction.fromImproper(a.num * b.den, a.den * b.num);
    }

    equals(other) {
      const a = this.toImproper();
      const b = other.toImproper();
      return (a.num * b.den) === (b.num * a.den);
    }

    toFormatString() {
      if (this.whole === 0 && this.num === 0) return '0';
      if (this.whole > 0 && this.num === 0) return `${this.whole}`;
      if (this.whole === 0) return `${this.num}/${this.den}`;
      return `${this.whole} ${this.num}/${this.den}`;
    }

    toMathHtml() {
      if (this.whole === 0 && this.num === 0) return '0';
      const fracHtml = (this.num > 0)
        ? `<span class="fraction"><span class="num">${this.num}</span><span class="den">${this.den}</span></span>`
        : '';
      if (this.whole > 0 && this.num > 0) {
        return `<span class="whole">${this.whole}</span>${fracHtml}`;
      }
      if (this.whole > 0) return `<span class="whole">${this.whole}</span>`;
      return fracHtml;
    }
  }

  window.AlchemyFraction = Fraction;

  // =========================================================================
  // 2. RECIPE PRESETS (5-6 КЛАСС)
  // =========================================================================

  const STORY_RECIPES = [
    {
      id: 'speed_elixir',
      title: 'Синтез Эликсира Скорости',
      potionIcon: '⚡',
      liquidColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
      unit: 'л',
      maxVolume: 3.0,
      portions: 3,
      story: 'В алхимический котёл объёмом 3 литра залили 3/4 л жидкого кварца и добавили 1 2/5 л экстракта мяты. Полученную смесь упарили (испарилось 7/10 л), а остаток разлили поровну в 3 пробирки. Убедись, что котёл не переполнится на промежуточных этапах!',
      mathExpression: '(3/4 + 1 2/5 - 7/10) : 3',
      steps: [
        {
          action: 'Заливка компонентов в котёл',
          desc: 'Смешай 3/4 л жидкого кварца и 1 2/5 л экстракта мяты:',
          operation: 'add',
          operandA: new Fraction(0, 3, 4),
          operandB: new Fraction(1, 2, 5),
          expected: new Fraction(2, 3, 20),
          stepHint: 'Приведи дроби к общему знаменателю 20: 15/20 + 1 8/20 = 2 3/20 л'
        },
        {
          action: 'Упаривание лишней влаги',
          desc: 'Из смеси объёмом 2 3/20 л выпарили 7/10 л жидкости:',
          operation: 'subtract',
          operandA: new Fraction(2, 3, 20),
          operandB: new Fraction(0, 7, 10),
          expected: new Fraction(1, 9, 20),
          stepHint: '2 3/20 - 14/20 = 1 23/20 - 14/20 = 1 9/20 л'
        },
        {
          action: 'Розлив концентрата по порциям',
          desc: 'Разлей оставшийся концентрат 1 9/20 л поровну в 3 пробирки:',
          operation: 'divide',
          operandA: new Fraction(1, 9, 20),
          operandB: new Fraction(3, 0, 1),
          expected: new Fraction(0, 29, 60),
          stepHint: 'Переведи в неправильную дробь 29/20 и раздели на 3: 29/20 : 3 = 29/60 л'
        }
      ]
    },
    {
      id: 'night_vision',
      title: 'Эссенция Ночного Видения',
      potionIcon: '🔮',
      liquidColor: 'linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)',
      unit: 'л',
      maxVolume: 4.0,
      portions: 2,
      story: 'В реторту объёмом 4 литра мастер налил 1 5/6 л лунной росы и добавил 1 1/4 л сока люминесцентного мха. После фильтрации осадок уменьшил объём на 7/12 л. Оставшийся раствор разделили на 2 равные порции.',
      mathExpression: '(1 5/6 + 1 1/4 - 7/12) : 2',
      steps: [
        {
          action: 'Смешивание базовых растворов',
          desc: 'Сложи 1 5/6 л лунной росы и 1 1/4 л сока мха:',
          operation: 'add',
          operandA: new Fraction(1, 5, 6),
          operandB: new Fraction(1, 1, 4),
          expected: new Fraction(3, 1, 12),
          stepHint: 'Общий знаменатель 12: 1 10/12 + 1 3/12 = 2 13/12 = 3 1/12 л'
        },
        {
          action: 'Очистка от осадка',
          desc: 'Удали 7/12 л осадка из полученных 3 1/12 л:',
          operation: 'subtract',
          operandA: new Fraction(3, 1, 12),
          operandB: new Fraction(0, 7, 12),
          expected: new Fraction(2, 1, 2), // 2 6/12 = 2 1/2
          stepHint: '3 1/12 - 7/12 = 2 13/12 - 7/12 = 2 6/12. Сократи дробь на 6 до 2 1/2!'
        },
        {
          action: 'Розлив очищенного зелья',
          desc: 'Раздели 2 1/2 л зелья на 2 флакона:',
          operation: 'divide',
          operandA: new Fraction(2, 1, 2),
          operandB: new Fraction(2, 0, 1),
          expected: new Fraction(1, 1, 4),
          stepHint: '5/2 : 2 = 5/4 = 1 1/4 л во флаконе'
        }
      ]
    },
    {
      id: 'frost_crystal',
      title: 'Кристальный Раствор Мороза',
      potionIcon: '❄️',
      liquidColor: 'linear-gradient(180deg, #67e8f9 0%, #0e7490 100%)',
      unit: 'л',
      maxVolume: 5.0,
      portions: 4,
      story: 'Для крио-реактора на 5 литров требуется приготовить охлаждающую смесь: соединить 2 3/8 л ледяной эссенции и 1 5/12 л талой ледниковой воды, испарить 11/24 л и разлить по 4 капсулам.',
      mathExpression: '(2 3/8 + 1 5/12 - 11/24) : 4',
      steps: [
        {
          action: 'Соединение крио-компонентов',
          desc: 'Смешай 2 3/8 л эссенции и 1 5/12 л ледниковой воды:',
          operation: 'add',
          operandA: new Fraction(2, 3, 8),
          operandB: new Fraction(1, 5, 12),
          expected: new Fraction(3, 19, 24),
          stepHint: 'Общий знаменатель 24: 2 9/24 + 1 10/24 = 3 19/24 л'
        },
        {
          action: 'Выпаривание термо-стабилизатора',
          desc: 'Упари 11/24 л из полученной смеси 3 19/24 л:',
          operation: 'subtract',
          operandA: new Fraction(3, 19, 24),
          operandB: new Fraction(0, 11, 24),
          expected: new Fraction(3, 1, 3), // 3 8/24 = 3 1/3
          stepHint: '3 19/24 - 11/24 = 3 8/24. Обязательно сократи на 8: 3 1/3 л!'
        },
        {
          action: 'Заполнение крио-капсул',
          desc: 'Раздели 3 1/3 л эликсира на 4 капсулы:',
          operation: 'divide',
          operandA: new Fraction(3, 1, 3),
          operandB: new Fraction(4, 0, 1),
          expected: new Fraction(0, 5, 6), // 10/12 = 5/6
          stepHint: '10/3 : 4 = 10/12. Сократи на 2 до 5/6 л!'
        }
      ]
    },
    {
      id: 'fire_strength',
      title: 'Огненный Эликсир Силы',
      potionIcon: '🔥',
      liquidColor: 'linear-gradient(180deg, #fb923c 0%, #c2410c 100%)',
      unit: 'л',
      maxVolume: 3.0,
      portions: 2,
      story: 'В жаропрочный тигель на 3 литра налили 1 1/6 л вулканической смолы и 5/8 л огненной пыльцы. Затем упарили 5/24 л и разлили по 2 колбам.',
      mathExpression: '(1 1/6 + 5/8 - 5/24) : 2',
      steps: [
        {
          action: 'Смешивание вулканических элементов',
          desc: 'Сложи 1 1/6 л смолы и 5/8 л огненной пыльцы:',
          operation: 'add',
          operandA: new Fraction(1, 1, 6),
          operandB: new Fraction(0, 5, 8),
          expected: new Fraction(1, 19, 24),
          stepHint: 'Общий знаменатель 24: 1 4/24 + 15/24 = 1 19/24 л'
        },
        {
          action: 'Снятие жара',
          desc: 'Выпари 5/24 л из полученных 1 19/24 л:',
          operation: 'subtract',
          operandA: new Fraction(1, 19, 24),
          operandB: new Fraction(0, 5, 24),
          expected: new Fraction(1, 7, 12), // 1 14/24 = 1 7/12
          stepHint: '1 19/24 - 5/24 = 1 14/24. Сократи дробь на 2: 1 7/12 л!'
        },
        {
          action: 'Розлив концентрированной лавы',
          desc: 'Раздели 1 7/12 л смеси на 2 порции:',
          operation: 'divide',
          operandA: new Fraction(1, 7, 12),
          operandB: new Fraction(2, 0, 1),
          expected: new Fraction(0, 19, 24),
          stepHint: '19/12 : 2 = 19/24 л'
        }
      ]
    }
  ];

  // Procedural Generator for Infinite Practice
  function generateRandomRecipe(level = 2) {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    const d1 = dens[Math.floor(Math.random() * dens.length)];
    const d2 = dens[Math.floor(Math.random() * dens.length)];
    const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    const w1 = Math.floor(Math.random() * 2);
    const w2 = 1;

    const opA = new Fraction(w1, n1, d1).reduce();
    const opB = new Fraction(w2, n2, d2).reduce();
    const sum = opA.add(opB).reduce();

    const maxVol = Math.ceil(sum.toFloat() + 1.5);

    // Pick a subtract fraction less than sum
    const subDen = lcm(opA.den, opB.den);
    const sumImp = sum.toImproper();
    const maxSubNum = Math.floor(sumImp.num * 0.4) || 1;
    const opC = new Fraction(0, maxSubNum, sumImp.den).reduce();
    const remainder = sum.subtract(opC).reduce();

    const portion = 2;
    const finalVal = remainder.divide(new Fraction(portion, 0, 1)).reduce();

    return {
      id: `random_${Date.now()}`,
      title: 'Случайный алхимический рецепт',
      potionIcon: '🧪',
      liquidColor: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
      unit: 'л',
      maxVolume: maxVol,
      portions: portion,
      story: `Лабораторная проба: смешать ${opA.toFormatString()} л и ${opB.toFormatString()} л реагентов в котле на ${maxVol} л, затем слить ${opC.toFormatString()} л и разделить смесь на ${portion} пробирки.`,
      mathExpression: `(${opA.toFormatString()} + ${opB.toFormatString()} - ${opC.toFormatString()}) : ${portion}`,
      steps: [
        {
          action: 'Смешивание базовых реагентов',
          desc: `Сложи ${opA.toFormatString()} л и ${opB.toFormatString()} л:`,
          operation: 'add',
          operandA: opA,
          operandB: opB,
          expected: sum,
          stepHint: `Приведи к общему знаменателю ${lcm(opA.den, opB.den)}`
        },
        {
          action: 'Отбор фракции',
          desc: `Вычти ${opC.toFormatString()} л из текущего раствора:`,
          operation: 'subtract',
          operandA: sum,
          operandB: opC,
          expected: remainder,
          stepHint: 'Выполни вычитание и обязательно сократи результат, если он сократим!'
        },
        {
          action: 'Розлив по склянкам',
          desc: `Раздели остаток ${remainder.toFormatString()} л на ${portion} части:`,
          operation: 'divide',
          operandA: remainder,
          operandB: new Fraction(portion, 0, 1),
          expected: finalVal,
          stepHint: `Умножь на 1/${portion} и выдели несократимую дробь!`
        }
      ]
    };
  }

  // =========================================================================
  // 3. TRAINER CONTROLLER
  // =========================================================================

  let currentRecipe = STORY_RECIPES[0];
  let currentStepIndex = 0;
  let currentReactorVolume = new Fraction(0, 0, 1);
  let stepHistory = [];
  let isLevelCompleted = false;

  // DOM Elements
  const elRecipeTitle = document.getElementById('recipe-title');
  const elRecipeStory = document.getElementById('recipe-story');
  const elRecipeCapacity = document.getElementById('recipe-capacity');
  const elRecipePortions = document.getElementById('recipe-portions');
  const elRecipeExpr = document.getElementById('recipe-math-expr');
  
  const elLiquidLayer = document.getElementById('flask-liquid-layer');
  const elAlembicFlask = document.getElementById('alembic-flask');
  const elRulerContainer = document.getElementById('flask-ruler');
  const elStatusChip = document.getElementById('chip-stability');
  const elVolumeReadout = document.getElementById('readout-cur-volume');
  const elLimitReadout = document.getElementById('readout-max-volume');

  const elStepNum = document.getElementById('step-current-num');
  const elStepActionName = document.getElementById('step-action-name');
  const elStepDesc = document.getElementById('step-desc');
  const elInputWhole = document.getElementById('input-whole');
  const elInputNum = document.getElementById('input-num');
  const elInputDen = document.getElementById('input-den');
  const elStabilityAlert = document.getElementById('stability-alert');
  const elBtnSynthesize = document.getElementById('btn-synthesize');
  const elStepsChain = document.getElementById('steps-chain');

  const elVictoryModal = document.getElementById('victory-modal');
  const elVictoryPotionIcon = document.getElementById('victory-potion-icon');
  const elVictoryTitle = document.getElementById('victory-title');
  const elVictoryText = document.getElementById('victory-text');
  const elBtnNextRecipe = document.getElementById('btn-next-recipe');
  const elBtnCloseVictory = document.getElementById('btn-close-victory');

  // Spawn bubbles inside flask
  function initBubbles() {
    const container = document.getElementById('flask-bubbles-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = Math.floor(Math.random() * 8) + 6;
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${Math.floor(Math.random() * 80) + 10}%`;
      b.style.animationDelay = `${(Math.random() * 2.5).toFixed(1)}s`;
      b.style.animationDuration = `${(Math.random() * 2 + 2).toFixed(1)}s`;
      container.appendChild(b);
    }
  }

  // Build graduation ticks on flask ruler
  function renderRuler(maxVol) {
    if (!elRulerContainer) return;
    elRulerContainer.innerHTML = '';
    const step = 0.5;
    const ticksCount = Math.floor(maxVol / step);
    for (let i = 1; i <= ticksCount; i++) {
      const val = (i * step);
      const tick = document.createElement('div');
      tick.className = 'ruler-tick' + (val === maxVol ? ' limit' : '');
      tick.textContent = `${val} л`;
      elRulerContainer.appendChild(tick);
    }
  }

  // Update Visual Flask Level & Colors
  function updateFlaskVisual(volFraction, maxVol, isOverheated = false) {
    if (!elLiquidLayer || !elAlembicFlask) return;
    const curFloat = volFraction.toFloat();
    const pct = Math.min(100, Math.max(5, (curFloat / maxVol) * 92));

    elLiquidLayer.style.height = `${pct}%`;
    elLiquidLayer.style.background = currentRecipe.liquidColor;

    if (curFloat > maxVol || isOverheated) {
      elAlembicFlask.classList.add('overheated');
      if (elStatusChip) {
        elStatusChip.className = 'hud-chip chip-stability danger';
        elStatusChip.innerHTML = curFloat > maxVol 
          ? '🔴 Переполнение котла!' 
          : '🔴 Перегрев! Несократимая дробь';
      }
    } else {
      elAlembicFlask.classList.remove('overheated');
      if (elStatusChip) {
        elStatusChip.className = 'hud-chip chip-stability stable';
        elStatusChip.innerHTML = '🟢 Смесь стабильна';
      }
    }

    if (elVolumeReadout) {
      elVolumeReadout.textContent = `${volFraction.toFormatString()} ${currentRecipe.unit}`;
    }
    if (elLimitReadout) {
      elLimitReadout.textContent = `${maxVol} ${currentRecipe.unit}`;
    }
  }

  // Load a recipe
  function loadRecipe(recipe) {
    currentRecipe = recipe;
    currentStepIndex = 0;
    currentReactorVolume = new Fraction(0, 0, 1);
    stepHistory = [];
    isLevelCompleted = false;

    if (elRecipeTitle) elRecipeTitle.textContent = recipe.title;
    if (elRecipeStory) elRecipeStory.textContent = recipe.story;
    if (elRecipeCapacity) elRecipeCapacity.textContent = `${recipe.maxVolume} ${recipe.unit}`;
    if (elRecipePortions) elRecipePortions.textContent = `${recipe.portions} пробирки`;
    if (elRecipeExpr) elRecipeExpr.textContent = recipe.mathExpression;

    renderRuler(recipe.maxVolume);
    initBubbles();
    updateFlaskVisual(currentReactorVolume, recipe.maxVolume);
    renderCurrentStep();
    renderHistoryChain();
  }

  // Render current step in journal
  function renderCurrentStep() {
    if (currentStepIndex >= currentRecipe.steps.length) {
      showVictory();
      return;
    }

    const step = currentRecipe.steps[currentStepIndex];
    if (elStepNum) elStepNum.textContent = `Шаг ${currentStepIndex + 1} из ${currentRecipe.steps.length}`;
    if (elStepActionName) elStepActionName.textContent = step.action;
    if (elStepDesc) elStepDesc.textContent = step.desc;

    // Reset input fields
    if (elInputWhole) elInputWhole.value = '';
    if (elInputNum) elInputNum.value = '';
    if (elInputDen) elInputDen.value = '';

    hideAlert();
    if (elInputWhole) elInputWhole.focus();
  }

  function showAlert(msg, type = 'unstable') {
    if (!elStabilityAlert) return;
    elStabilityAlert.className = `stability-alert-box alert-${type}`;
    elStabilityAlert.innerHTML = msg;
  }

  function hideAlert() {
    if (!elStabilityAlert) return;
    elStabilityAlert.className = 'stability-alert-box';
    elStabilityAlert.innerHTML = '';
  }

  function renderHistoryChain() {
    if (!elStepsChain) return;
    elStepsChain.innerHTML = '';
    stepHistory.forEach((h, idx) => {
      const item = document.createElement('div');
      item.className = 'chain-item completed';
      item.innerHTML = `
        <div><strong>Шаг ${idx + 1}:</strong> ${h.action}</div>
        <div style="font-weight:700; color:var(--lab-emerald); font-family:var(--f-serif);">${h.result.toFormatString()} ${currentRecipe.unit}</div>
      `;
      elStepsChain.appendChild(item);
    });
  }

  // Main Synthesize Action Trigger
  function handleSynthesize() {
    if (isLevelCompleted) return;

    const step = currentRecipe.steps[currentStepIndex];
    const whole = parseInt(elInputWhole.value, 10) || 0;
    const num = parseInt(elInputNum.value, 10) || 0;
    const den = parseInt(elInputDen.value, 10) || 1;

    if (num > 0 && den <= 0) {
      showAlert('Знаменатель не может быть равен нулю!', 'unstable');
      return;
    }

    if (num === 0 && whole === 0) {
      showAlert('Введите значение промежуточного объёма смеси!', 'unstable');
      return;
    }

    const enteredFraction = new Fraction(whole, num, den);

    // 1. Check if numerical value matches expected step value
    if (!enteredFraction.equals(step.expected)) {
      showAlert(`❌ Ошибка в расчётах! Подсказка: ${step.stepHint}`, 'overflow');
      // Visual feedback: brief red pulse
      updateFlaskVisual(currentReactorVolume, currentRecipe.maxVolume, true);
      setTimeout(() => updateFlaskVisual(currentReactorVolume, currentRecipe.maxVolume, false), 1500);
      return;
    }

    // 2. Check rule: «Стабильность результата» (Защита от несокращённых дробей)
    const divisor = enteredFraction.getReductionDivisor();
    if (divisor > 1) {
      updateFlaskVisual(currentReactorVolume, currentRecipe.maxVolume, true);
      showAlert(`⚠️ <strong>Нестабильная смесь! Колба перегревается!</strong><br>Числитель и знаменатель можно сократить на <strong>${divisor}</strong>. Доведи реактив до несократимой дроби, чтобы стабилизировать формулу!`, 'unstable');
      return;
    }

    // 3. Check rule: «Правильное смешанное число» (Защита от неправильной дроби без выделения целой)
    if (enteredFraction.num >= enteredFraction.den && enteredFraction.den > 1) {
      showAlert(`⚠️ <strong>Нестабильная концентрация!</strong><br>Выдели целую часть из неправильной дроби: числитель (${enteredFraction.num}) больше знаменателя (${enteredFraction.den}).`, 'unstable');
      return;
    }

    // 4. Check rule: «Критическая масса» (Защита от переполнения котла)
    if (enteredFraction.toFloat() > currentRecipe.maxVolume) {
      showAlert(`💥 <strong>Критическая масса: котёл переполнен!</strong><br>Объём смеси (${enteredFraction.toFormatString()} ${currentRecipe.unit}) превысил вместимость котла (${currentRecipe.maxVolume} ${currentRecipe.unit}). Проверь порядок действий!`, 'overflow');
      updateFlaskVisual(enteredFraction, currentRecipe.maxVolume, true);
      return;
    }

    // Success on this step!
    currentReactorVolume = enteredFraction;
    stepHistory.push({
      action: step.action,
      result: enteredFraction
    });

    renderHistoryChain();
    updateFlaskVisual(currentReactorVolume, currentRecipe.maxVolume, false);

    // Flash success
    showAlert('✓ Реакция прошла успешно! Смесь стабилизирована.', 'success');

    setTimeout(() => {
      currentStepIndex++;
      renderCurrentStep();
    }, 900);
  }

  // Show Victory Modal when all steps completed
  function showVictory() {
    isLevelCompleted = true;
    if (elVictoryPotionIcon) elVictoryPotionIcon.textContent = currentRecipe.potionIcon;
    if (elVictoryTitle) elVictoryTitle.textContent = `Эликсир успешно синтезирован!`;
    if (elVictoryText) {
      const finalRes = currentRecipe.steps[currentRecipe.steps.length - 1].expected;
      elVictoryText.innerHTML = `Рецепт <strong>«${currentRecipe.title}»</strong> завершён в точном соответствии с формулой.<br>В одной пробирке: <strong>${finalRes.toFormatString()} ${currentRecipe.unit}</strong> стабильного эликсира!`;
    }

    // Save metric to studyMetrics and award XP
    try {
      const metricKey = 'studyMetrics';
      const raw = localStorage.getItem(metricKey);
      const metrics = raw ? JSON.parse(raw) : [];
      metrics.push({
        timestamp: new Date().toISOString(),
        subject: 'Математика',
        taskId: `alchemy_${currentRecipe.id}`,
        skill: 'fractionsPercentages',
        correct: true
      });
      localStorage.setItem(metricKey, JSON.stringify(metrics));

      // Trigger custom event for global header XP update
      window.dispatchEvent(new CustomEvent('study-xp-gained', {
        detail: { xp: 30, reason: `Синтез: ${currentRecipe.title}` }
      }));
    } catch (e) {
      console.warn('Metrics sync error', e);
    }

    if (elVictoryModal) elVictoryModal.style.display = 'flex';
  }

  // Setup Event Listeners
  if (elBtnSynthesize) {
    elBtnSynthesize.addEventListener('click', handleSynthesize);
  }

  // Enter key in input fields
  [elInputWhole, elInputNum, elInputDen].forEach(inp => {
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSynthesize();
        }
      });
    }
  });

  // Level selector buttons
  const modeButtons = document.querySelectorAll('.lab-mode-btn');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const modeId = btn.getAttribute('data-recipe');
      if (modeId === 'random') {
        const randomRec = generateRandomRecipe(2);
        loadRecipe(randomRec);
      } else {
        const found = STORY_RECIPES.find(r => r.id === modeId) || STORY_RECIPES[0];
        loadRecipe(found);
      }
    });
  });

  if (elBtnNextRecipe) {
    elBtnNextRecipe.addEventListener('click', () => {
      if (elVictoryModal) elVictoryModal.style.display = 'none';
      // Find next recipe
      const curIdx = STORY_RECIPES.findIndex(r => r.id === currentRecipe.id);
      const nextIdx = (curIdx + 1) % STORY_RECIPES.length;
      const nextBtn = document.querySelector(`.lab-mode-btn[data-recipe="${STORY_RECIPES[nextIdx].id}"]`);
      if (nextBtn) {
        nextBtn.click();
      } else {
        loadRecipe(STORY_RECIPES[nextIdx]);
      }
    });
  }

  if (elBtnCloseVictory) {
    elBtnCloseVictory.addEventListener('click', () => {
      if (elVictoryModal) elVictoryModal.style.display = 'none';
    });
  }

  // Theme Sync Support
  function syncTheme() {
    const t = localStorage.getItem('profileTheme') || localStorage.getItem('site_theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.dataset.theme = t;
  }
  syncTheme();
  window.addEventListener('study-theme-changed', (e) => {
    document.documentElement.setAttribute('data-theme', e.detail);
    document.documentElement.dataset.theme = e.detail;
  });

  // Initial load
  loadRecipe(STORY_RECIPES[0]);

})();
