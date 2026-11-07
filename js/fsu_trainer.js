/**
 * Тренажёр «Формулы сокращённого умножения» (ФСУ) — 7 класс
 * Поддерживает 5 режимов:
 * - square_sum: (a + b)²
 * - square_diff: (a - b)²
 * - diff_squares: a² - b² = (a - b)(a + b)
 * - fast_calc: Быстрый устный счёт с помощью ФСУ
 * - all: Микс всех категорий
 */

(function initFSUTrainer() {
  const TRAINER_ID = 'fsu_trainer';

  // State
  let currentCategory = 'all';
  let currentProblem = null;
  let isAnswered = false;
  let stats = {
    streak: 0,
    solved: 0,
    correct: 0
  };

  // DOM Elements
  const statStreak = document.getElementById('stat-streak');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statSolved = document.getElementById('stat-solved');
  const statRank = document.getElementById('stat-rank');

  const taskTopicBadge = document.getElementById('task-topic-badge');
  const taskPrompt = document.getElementById('task-prompt');
  const formulaExpression = document.getElementById('formula-expression');
  const optionsGrid = document.getElementById('options-grid');
  const inputModeBox = document.getElementById('input-mode-box');
  const answerInput = document.getElementById('answer-input');
  const submitAnswerBtn = document.getElementById('submit-answer-btn');

  const feedbackBanner = document.getElementById('feedback-banner');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');

  const solutionCard = document.getElementById('solution-card');
  const solutionSteps = document.getElementById('solution-steps');
  const nextBtn = document.getElementById('next-btn');

  const cheatCard = document.getElementById('cheat-card');
  const cheatHeader = document.getElementById('cheat-header');
  const cheatToggleText = document.getElementById('cheat-toggle-text');

  // Random helpers
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  // Generators for categories
  function generateSquareSum() {
    const letters = ['x', 'a', 'y', 'm', 'p', 'b'];
    const letter = pickOne(letters);
    const hasCoeff = Math.random() < 0.45;
    const aCoeff = hasCoeff ? pickOne([2, 3, 4, 5]) : 1;
    const b = randInt(2, 9);

    const termA = aCoeff === 1 ? letter : `${aCoeff}${letter}`;
    const exprStr = `(${termA} + ${b})²`;

    const aSqCoeff = aCoeff * aCoeff;
    const aSqStr = aSqCoeff === 1 ? `${letter}²` : `${aSqCoeff}${letter}²`;
    const midCoeff = 2 * aCoeff * b;
    const midStr = `${midCoeff}${letter}`;
    const bSq = b * b;

    const correct = `${aSqStr} + ${midStr} + ${bSq}`;

    // Plausible distractors
    const wrong1 = `${aSqStr} + ${aCoeff * b}${letter} + ${bSq}`; // forgot to double
    const wrong2 = `${aSqStr} + ${bSq}`; // classic mistake (a+b)² = a² + b²
    const wrong3 = `${aSqStr} - ${midStr} + ${bSq}`; // wrong sign

    const options = shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      categoryName: 'Квадрат суммы',
      prompt: 'Раскройте скобки по формуле квадрата суммы:',
      expressionHtml: exprStr,
      correctAnswer: correct,
      options: options,
      isInputMode: false,
      solutionSteps: [
        `Используем формулу: <strong>(u + v)² = u² + 2uv + v²</strong>`,
        `Здесь первое слагаемое u = <strong>${termA}</strong>, второе v = <strong>${b}</strong>`,
        `1) Квадрат первого: (${termA})² = <strong>${aSqStr}</strong>`,
        `2) Удвоенное произведение: 2 · (${termA}) · ${b} = <strong>${midStr}</strong>`,
        `3) Квадрат второго: ${b}² = <strong>${bSq}</strong>`,
        `Итог: <strong>${correct}</strong>`
      ]
    };
  }

  function generateSquareDiff() {
    const letters = ['x', 'a', 'y', 'c', 'k'];
    const letter = pickOne(letters);
    const hasCoeff = Math.random() < 0.45;
    const aCoeff = hasCoeff ? pickOne([2, 3, 4, 5]) : 1;
    const b = randInt(2, 9);

    const termA = aCoeff === 1 ? letter : `${aCoeff}${letter}`;
    const exprStr = `(${termA} - ${b})²`;

    const aSqCoeff = aCoeff * aCoeff;
    const aSqStr = aSqCoeff === 1 ? `${letter}²` : `${aSqCoeff}${letter}²`;
    const midCoeff = 2 * aCoeff * b;
    const midStr = `${midCoeff}${letter}`;
    const bSq = b * b;

    const correct = `${aSqStr} - ${midStr} + ${bSq}`;

    const wrong1 = `${aSqStr} + ${midStr} + ${bSq}`; // forgot minus
    const wrong2 = `${aSqStr} - ${midStr} - ${bSq}`; // negative square
    const wrong3 = `${aSqStr} - ${bSq}`; // forgot middle term

    const options = shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      categoryName: 'Квадрат разности',
      prompt: 'Раскройте скобки по формуле квадрата разности:',
      expressionHtml: exprStr,
      correctAnswer: correct,
      options: options,
      isInputMode: false,
      solutionSteps: [
        `Используем формулу: <strong>(u - v)² = u² - 2uv + v²</strong>`,
        `Здесь u = <strong>${termA}</strong>, v = <strong>${b}</strong>`,
        `1) Квадрат первого: (${termA})² = <strong>${aSqStr}</strong>`,
        `2) Минус удвоенное произведение: -2 · (${termA}) · ${b} = <strong>-${midStr}</strong>`,
        `3) Квадрат второго (всегда со знаком «плюс»!): (-${b})² = <strong>+${bSq}</strong>`,
        `Итог: <strong>${correct}</strong>`
      ]
    };
  }

  function generateDiffSquares() {
    const letters = ['x', 'a', 'y', 'n', 'b'];
    const letter = pickOne(letters);
    const isFactoring = Math.random() < 0.45;
    const hasCoeff = Math.random() < 0.4;
    const aCoeff = hasCoeff ? pickOne([2, 3, 4, 5]) : 1;
    const b = randInt(2, 9);

    const termA = aCoeff === 1 ? letter : `${aCoeff}${letter}`;
    const aSqCoeff = aCoeff * aCoeff;
    const aSqStr = aSqCoeff === 1 ? `${letter}²` : `${aSqCoeff}${letter}²`;
    const bSq = b * b;

    if (!isFactoring) {
      // (a - b)(a + b) = a² - b²
      const exprStr = `(${termA} - ${b})(${termA} + ${b})`;
      const correct = `${aSqStr} - ${bSq}`;
      const wrong1 = `${aSqStr} + ${bSq}`;
      const wrong2 = `${aSqStr} - ${2 * aCoeff * b}${letter} + ${bSq}`;
      const wrong3 = `${aSqStr} - ${2 * b}`;

      const options = shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        categoryName: 'Разность квадратов',
        prompt: 'Преобразуйте произведение в многочлен:',
        expressionHtml: exprStr,
        correctAnswer: correct,
        options: options,
        isInputMode: false,
        solutionSteps: [
          `Используем формулу: <strong>(u - v)(u + v) = u² - v²</strong>`,
          `Здесь u = <strong>${termA}</strong>, v = <strong>${b}</strong>`,
          `Квадрат первого: (${termA})² = <strong>${aSqStr}</strong>`,
          `Квадрат второго: ${b}² = <strong>${bSq}</strong>`,
          `Итог: <strong>${correct}</strong>`
        ]
      };
    } else {
      // Factoring: a² - b² = (a - b)(a + b)
      const exprStr = `${aSqStr} - ${bSq}`;
      const correct = `(${termA} - ${b})(${termA} + ${b})`;
      const wrong1 = `(${termA} - ${b})²`;
      const wrong2 = `(${termA} + ${b})²`;
      const wrong3 = `(${termA} - ${bSq})(${termA} + 1)`;

      const options = shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        categoryName: 'Разность квадратов',
        prompt: 'Разложите многочлен на множители:',
        expressionHtml: exprStr,
        correctAnswer: correct,
        options: options,
        isInputMode: false,
        solutionSteps: [
          `Представим двучлен в виде разности квадратов: <strong>u² - v² = (u - v)(u + v)</strong>`,
          `${aSqStr} = (${termA})², а ${bSq} = ${b}²`,
          `Получаем: <strong>(${termA} - ${b})(${termA} + ${b})</strong>`
        ]
      };
    }
  }

  function generateFastCalc() {
    const subType = pickOne(['diff_sq_numbers', 'near_tens_mult', 'near_tens_square']);

    if (subType === 'diff_sq_numbers') {
      // a² - b² = (a - b)(a + b), where a + b or a - b is 100 or 10
      const sumTarget = pickOne([100, 200, 50]);
      const diff = pickOne([2, 4, 6, 8, 10, 12, 14, 16, 20]);
      const a = (sumTarget + diff) / 2;
      const b = sumTarget - a;
      const ans = (a - b) * (a + b);

      const exprStr = `${a}² - ${b}²`;
      const correct = String(ans);

      const wrong1 = String(ans + 100);
      const wrong2 = String(ans - 200);
      const wrong3 = String(ans + 20);
      const options = shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        categoryName: 'Быстрый счёт ФСУ',
        prompt: 'Вычислите значение выражения быстрым способом:',
        expressionHtml: exprStr,
        correctAnswer: correct,
        options: options,
        isInputMode: true,
        solutionSteps: [
          `Применяем формулу разности квадратов: <strong>a² - b² = (a - b)(a + b)</strong>`,
          `1) Сумма чисел: ${a} + ${b} = <strong>${a + b}</strong>`,
          `2) Разность чисел: ${a} - ${b} = <strong>${a - b}</strong>`,
          `3) Умножение: ${a - b} · ${a + b} = <strong>${ans}</strong>`
        ]
      };
    } else if (subType === 'near_tens_mult') {
      // (c - d)(c + d) = c² - d²
      const tens = pickOne([20, 30, 40, 50, 60, 70, 80, 90]);
      const d = pickOne([1, 2, 3]);
      const n1 = tens - d;
      const n2 = tens + d;
      const ans = tens * tens - d * d;

      const exprStr = `${n1} · ${n2}`;
      const correct = String(ans);

      const wrong1 = String(tens * tens);
      const wrong2 = String(ans - 10);
      const wrong3 = String(ans + 2);
      const options = shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        categoryName: 'Быстрый счёт ФСУ',
        prompt: 'Вычислите устно с помощью формулы разности квадратов:',
        expressionHtml: exprStr,
        correctAnswer: correct,
        options: options,
        isInputMode: true,
        solutionSteps: [
          `Представим числа относительно круглого десятка ${tens}:`,
          `${n1} · ${n2} = <strong>(${tens} - ${d})(${tens} + ${d})</strong>`,
          `По формуле разности квадратов: ${tens}² - ${d}² = ${tens * tens} - ${d * d} = <strong>${ans}</strong>`
        ]
      };
    } else {
      // near tens square: (tens ± d)²
      const tens = pickOne([20, 30, 40, 50, 60]);
      const isPlus = Math.random() < 0.5;
      const d = 1;
      const n = isPlus ? tens + d : tens - d;
      const ans = n * n;

      const exprStr = `${n}²`;
      const correct = String(ans);

      const wrong1 = String(tens * tens + (isPlus ? 1 : -1));
      const wrong2 = String(ans + 10);
      const wrong3 = String(ans - 20);
      const options = shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        categoryName: 'Быстрый счёт ФСУ',
        prompt: 'Возведите в квадрат быстрым способом через ФСУ:',
        expressionHtml: exprStr,
        correctAnswer: correct,
        options: options,
        isInputMode: true,
        solutionSteps: [
          `Представим число: ${n} = <strong>(${tens} ${isPlus ? '+' : '-'} ${d})</strong>`,
          `Формула: (${tens} ${isPlus ? '+' : '-'} ${d})² = ${tens}² ${isPlus ? '+' : '-'} 2·${tens}·${d} + ${d}²`,
          `= ${tens * tens} ${isPlus ? '+' : '-'} ${2 * tens * d} + ${d * d} = <strong>${ans}</strong>`
        ]
      };
    }
  }

  function getProblem(cat) {
    if (cat === 'square_sum') return generateSquareSum();
    if (cat === 'square_diff') return generateSquareDiff();
    if (cat === 'diff_squares') return generateDiffSquares();
    if (cat === 'fast_calc') return generateFastCalc();
    // 'all': equal distribution
    const roll = Math.random();
    if (roll < 0.28) return generateSquareSum();
    if (roll < 0.56) return generateSquareDiff();
    if (roll < 0.82) return generateDiffSquares();
    return generateFastCalc();
  }

  // Render problem
  function renderProblem() {
    isAnswered = false;
    currentProblem = getProblem(currentCategory);

    // Header badge & expression
    taskTopicBadge.textContent = currentProblem.categoryName;
    taskPrompt.textContent = currentProblem.prompt;
    formulaExpression.innerHTML = currentProblem.expressionHtml;

    // Reset feedback and solution
    feedbackBanner.className = 'feedback-banner';
    solutionCard.className = 'solution-card';
    solutionSteps.innerHTML = '';

    // Render options or input
    if (currentProblem.isInputMode) {
      inputModeBox.style.display = 'flex';
      optionsGrid.style.display = 'grid';
      answerInput.value = '';
      answerInput.disabled = false;
      submitAnswerBtn.disabled = false;
      answerInput.focus();
    } else {
      inputModeBox.style.display = 'none';
      optionsGrid.style.display = 'grid';
    }

    optionsGrid.innerHTML = '';
    currentProblem.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-key">${idx + 1}</span><span>${optText}</span>`;
      btn.addEventListener('click', () => handleOptionChosen(optText, btn));
      optionsGrid.appendChild(btn);
    });
  }

  // Answer handler
  function handleOptionChosen(chosenText, chosenBtn) {
    if (isAnswered) return;
    isAnswered = true;

    const isCorrect = chosenText.trim() === currentProblem.correctAnswer.trim();

    // Disable buttons & mark correct/wrong
    const allBtns = optionsGrid.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      const textSpan = b.querySelector('span:last-child');
      if (textSpan && textSpan.textContent.trim() === currentProblem.correctAnswer.trim()) {
        b.classList.add('correct');
      }
    });

    if (chosenBtn) {
      if (isCorrect) {
        chosenBtn.classList.add('correct');
      } else {
        chosenBtn.classList.add('wrong');
      }
    }

    if (currentProblem.isInputMode) {
      answerInput.disabled = true;
      submitAnswerBtn.disabled = true;
    }

    applyAnswerOutcome(isCorrect);
  }

  function handleInputSubmit() {
    if (isAnswered) return;
    const userVal = answerInput.value.trim();
    if (!userVal) return;

    handleOptionChosen(userVal, null);
  }

  function applyAnswerOutcome(isCorrect) {
    stats.solved++;
    if (isCorrect) {
      stats.streak++;
      stats.correct++;
      feedbackBanner.className = 'feedback-banner show correct';
      feedbackIcon.textContent = '✓';
      feedbackText.innerHTML = `<strong>Великолепно!</strong> Ответ правильный. Серия ответов увеличена (+10 XP).`;
    } else {
      stats.streak = 0;
      feedbackBanner.className = 'feedback-banner show wrong';
      feedbackIcon.textContent = '✕';
      feedbackText.innerHTML = `<strong>Не совсем так.</strong> Правильный ответ: <code>${currentProblem.correctAnswer}</code>`;
    }

    // Update UI Stats
    statStreak.innerHTML = `${stats.streak} <span aria-hidden="true">🔥</span>`;
    const acc = Math.round((stats.correct / stats.solved) * 100);
    statAccuracy.textContent = `${acc}%`;
    statSolved.textContent = String(stats.solved);

    // Fill solution
    solutionSteps.innerHTML = currentProblem.solutionSteps.map(st => `<li>${st}</li>`).join('');
    solutionCard.className = 'solution-card show';

    // Record in TrainerRankTracker if present
    if (window.TrainerTracker && typeof window.TrainerTracker.recordAttempt === 'function') {
      window.TrainerTracker.recordAttempt(TRAINER_ID, isCorrect);
      updateRankDisplay();
    }
  }

  function updateRankDisplay() {
    if (window.TrainerTracker && typeof window.TrainerTracker.getTrainerData === 'function') {
      const data = window.TrainerTracker.getTrainerData(TRAINER_ID);
      if (data && data.currentRankTitle) {
        statRank.textContent = data.currentRankTitle;
      }
    }
  }

  // Event Listeners
  cheatHeader.addEventListener('click', () => {
    const isOpen = cheatCard.classList.toggle('open');
    cheatHeader.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    cheatToggleText.textContent = isOpen ? 'Скрыть формулы ▴' : 'Показать формулы ▾';
  });

  cheatHeader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cheatHeader.click();
    }
  });

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      currentCategory = pill.getAttribute('data-cat') || 'all';
      renderProblem();
    });
  });

  submitAnswerBtn.addEventListener('click', handleInputSubmit);
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleInputSubmit();
  });

  nextBtn.addEventListener('click', () => {
    renderProblem();
  });

  // Keyboard navigation: 1, 2, 3, 4 for options, Space for next
  document.addEventListener('keydown', (e) => {
    if (document.activeElement === answerInput) return;

    if (!isAnswered) {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const allBtns = optionsGrid.querySelectorAll('.option-btn');
        if (allBtns[idx]) allBtns[idx].click();
      }
    } else {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        renderProblem();
      }
    }
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    updateRankDisplay();
    renderProblem();
  });
})();
