/**
 * Геншиноведение · Интерактивная обсерватория лора Тейвата
 * Скрипт логики:
 * - Молитва Тейвата (Wish Simulator ✦)
 * - Синтез звуковых эффектов через Web Audio API (астральный колокольчик, победный фанфар)
 * - Экзаменационный терминал (Тестирования по регионам и общему лору)
 * - Интерактивный Кодекс Тейвата
 */

(function initGenshinExperience() {
  'use strict';

  // --- 1. WEB AUDIO API SOUND SYNTHESIS ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play celestial chime (for wish & correct answer)
  function playCelestialChime(frequency = 880, duration = 0.8) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(frequency * 2, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playGoldenWishSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Multi-tone chord for 5-star wish
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    } catch (e) {}
  }

  // --- 2. WISH SIMULATOR DATA (5★ LORE QUOTES & ARTIFACTS) ---
  const WISH_LOOT = [
    {
      title: 'Властелин Камня · Чжун Ли',
      rarity: 5,
      type: 'Гео Архонт · Моракс',
      quote: '«Контракт не может быть нарушен. Тот, кто нарушит его, познает гнев камня.»',
      icon: '🔶',
      accent: '#e5b042'
    },
    {
      title: 'Анемо Архонт · Барбатос (Венти)',
      rarity: 5,
      type: 'Бог Свободы · Бард',
      quote: '«Лети к ветрам свободы. Пусть твои песни звучат выше облаков Селестии!»',
      icon: '🍃',
      accent: '#4fe3c1'
    },
    {
      title: 'Сёгун Райдэн · Эи',
      rarity: 5,
      type: 'Электро Архонт · Владычица Вечности',
      quote: '«Вечность ближе всего к Небесному Порядку. Лишь иллюзии исчезают со временем.»',
      icon: '⚡',
      accent: '#bf6ffb'
    },
    {
      title: 'Малая владычица Кусанали · Нахида',
      rarity: 5,
      type: 'Дендро Архонт · Воплощение Мудрости',
      quote: '«Знания — это свет во тьме. Даже самое высокое дерево Ирминсуль питается глубокими корнями истины.»',
      icon: '🌿',
      accent: '#58c734'
    },
    {
      title: 'Верховный судья Фонтейна · Нёвиллет',
      rarity: 5,
      type: 'Гидро Дракон · Суверен Первозданных Вод',
      quote: '«Справедливость не знает предвзятости. Пусть приговор будет чист, как глубокие воды Фонтейна.»',
      icon: '💧',
      accent: '#3898ec'
    },
    {
      title: 'Пиро Архонт · Мавуика',
      rarity: 5,
      type: 'Владычица Войны Натлана',
      quote: '«Пламя нашей веры не погаснет даже в самой темной ночи. Мы сражаемся до конца!»',
      icon: '🔥',
      accent: '#ef5a38'
    },
    {
      title: 'Хранитель Ветвей · Дайнслейф',
      rarity: 5,
      type: 'Свидетель Падения Каэнри\'ах',
      quote: '«Не доверяй богам, путник. Селестия взирает на Тейват холодными глазами, но звезды над нами — фальшивка.»',
      icon: '👁️',
      accent: '#ff5a79'
    },
    {
      title: 'Четвертый Предвестник · Арлекино («Отец»)',
      rarity: 5,
      type: 'Фатуи · Глава Дома Очага',
      quote: '«В Доме Очага семья превыше всего. Но за предательство расплата будет скорой и безжалостной.»',
      icon: '🩸',
      accent: '#f24848'
    }
  ];

  // Primogem & Wish State
  let primogems = parseInt(localStorage.getItem('genshin_primogems') || '1600', 10);
  let wishesCount = parseInt(localStorage.getItem('genshin_wishes_count') || '0', 10);

  function updateWishUI() {
    const primoDisplay = document.getElementById('primo-counter');
    const wishesDisplay = document.getElementById('wish-count-display');
    if (primoDisplay) primoDisplay.textContent = `${primogems} ✦`;
    if (wishesDisplay) wishesDisplay.textContent = String(wishesCount);
    try {
      localStorage.setItem('genshin_primogems', String(primogems));
      localStorage.setItem('genshin_wishes_count', String(wishesCount));
    } catch (e) {}
  }

  function performWish() {
    if (primogems < 160) {
      alert('Недостаточно Камней Истока! Сдавайте экзамены по лору Тейвата, чтобы заработать примогемы.');
      return;
    }
    primogems -= 160;
    wishesCount++;
    updateWishUI();
    playGoldenWishSound();

    const overlay = document.getElementById('wish-overlay');
    const star = document.getElementById('wish-meteor');
    const resultCard = document.getElementById('wish-result-card');
    
    // Pick random loot
    const loot = WISH_LOOT[Math.floor(Math.random() * WISH_LOOT.length)];

    if (overlay && star && resultCard) {
      overlay.classList.add('active');
      resultCard.classList.remove('show');
      star.classList.add('falling');

      setTimeout(() => {
        star.classList.remove('falling');
        
        document.getElementById('wish-loot-icon').textContent = loot.icon;
        document.getElementById('wish-loot-title').textContent = loot.title;
        document.getElementById('wish-loot-type').textContent = loot.type;
        document.getElementById('wish-loot-quote').textContent = loot.quote;
        resultCard.style.setProperty('--loot-accent', loot.accent);
        resultCard.classList.add('show');
      }, 1400);
    }
  }

  // --- 3. QUIZ TERMINAL ENGINE ---
  let activeQuizCategory = null;
  let currentQuestions = [];
  let currentQIndex = 0;
  let userScore = 0;
  let isAnswerSubmitted = false;

  const quizModal = document.getElementById('quiz-modal');
  const quizTitle = document.getElementById('quiz-modal-title');
  const quizBadge = document.getElementById('quiz-modal-badge');
  const quizProgress = document.getElementById('quiz-progress-text');
  const quizProgressBar = document.getElementById('quiz-progress-fill');
  const quizQuestion = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedback = document.getElementById('quiz-feedback-box');
  const quizExplanation = document.getElementById('quiz-explanation-text');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizResultsView = document.getElementById('quiz-results-view');
  const quizBodyView = document.getElementById('quiz-body-view');

  function openQuiz(categoryId) {
    if (!window.GENSHIN_QUIZ_DATA || !window.GENSHIN_QUIZ_DATA[categoryId]) {
      console.warn('Quiz category not found:', categoryId);
      return;
    }
    activeQuizCategory = window.GENSHIN_QUIZ_DATA[categoryId];
    currentQuestions = [...activeQuizCategory.questions];
    currentQIndex = 0;
    userScore = 0;
    isAnswerSubmitted = false;

    quizTitle.textContent = activeQuizCategory.title;
    quizBadge.textContent = `${activeQuizCategory.icon} ${activeQuizCategory.region}`;
    quizBadge.style.borderColor = activeQuizCategory.color;
    quizBadge.style.color = activeQuizCategory.color;

    quizResultsView.style.display = 'none';
    quizBodyView.style.display = 'flex';

    renderCurrentQuestion();
    quizModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuiz() {
    quizModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCurrentQuestion() {
    isAnswerSubmitted = false;
    const qData = currentQuestions[currentQIndex];
    if (!qData) {
      showQuizResults();
      return;
    }

    // Progress
    const total = currentQuestions.length;
    quizProgress.textContent = `Вопрос ${currentQIndex + 1} из ${total}`;
    const pct = ((currentQIndex) / total) * 100;
    quizProgressBar.style.width = `${pct}%`;

    // Question
    quizQuestion.textContent = qData.question;

    // Reset feedback
    quizFeedback.className = 'quiz-feedback-box';
    quizFeedback.style.display = 'none';
    quizNextBtn.disabled = true;

    // Render Options (shuffle 4 options)
    const options = [...qData.options];
    // shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    quizOptionsContainer.innerHTML = '';
    options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span class="opt-num">${idx + 1}</span><span class="opt-text">${optText}</span>`;
      btn.addEventListener('click', () => handleOptionSelected(optText, qData.correct, btn));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleOptionSelected(chosen, correct, btnElement) {
    if (isAnswerSubmitted) return;
    isAnswerSubmitted = true;

    const isCorrect = chosen.trim().toLowerCase() === correct.trim().toLowerCase();
    const qData = currentQuestions[currentQIndex];

    // Disable all options and mark
    const allBtns = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(btn => {
      btn.disabled = true;
      const text = btn.querySelector('.opt-text').textContent.trim();
      if (text.toLowerCase() === correct.trim().toLowerCase()) {
        btn.classList.add('correct');
      }
    });

    if (btnElement) {
      if (isCorrect) {
        btnElement.classList.add('correct');
        userScore++;
        playCelestialChime(987.77, 0.6);
      } else {
        btnElement.classList.add('wrong');
        playCelestialChime(349.23, 0.4);
      }
    }

    // Feedback banner
    quizFeedback.style.display = 'block';
    if (isCorrect) {
      quizFeedback.className = 'quiz-feedback-box correct';
      document.getElementById('quiz-feedback-status').innerHTML = '<strong>Верно! +160 Моры</strong>';
    } else {
      quizFeedback.className = 'quiz-feedback-box wrong';
      document.getElementById('quiz-feedback-status').innerHTML = `<strong>Неверно. Правильный ответ:</strong> ${correct}`;
    }

    quizExplanation.innerHTML = `<em>Лор Тейвата:</em> ${qData.explanation}`;
    quizNextBtn.disabled = false;
    quizNextBtn.focus();
  }

  function advanceQuestion() {
    currentQIndex++;
    if (currentQIndex < currentQuestions.length) {
      renderCurrentQuestion();
    } else {
      showQuizResults();
    }
  }

  function showQuizResults() {
    quizProgressBar.style.width = '100%';
    quizBodyView.style.display = 'none';
    quizResultsView.style.display = 'flex';

    const total = currentQuestions.length;
    const scorePct = Math.round((userScore / total) * 100);

    // Reward Primogems & Mora
    const earnedPrimos = userScore * 20; // up to 200 primogems!
    const earnedMora = userScore * 1000;
    primogems += earnedPrimos;
    updateWishUI();

    document.getElementById('results-score-text').textContent = `${userScore} из ${total}`;
    document.getElementById('results-percent-text').textContent = `${scorePct}% правильных ответов`;
    document.getElementById('results-primo-reward').textContent = `+${earnedPrimos} ✦`;
    document.getElementById('results-mora-reward').textContent = `+${earnedMora.toLocaleString()} Моры`;

    // Persona verdict
    let verdict = '';
    let rankBadge = '';
    if (scorePct >= 90) {
      rankBadge = 'Звание: Хранитель Ветвей (Ранг S)';
      verdict = '«Поразительно! Твои познания равны мудрости древа Ирминсуль. Даже Академия Сумеру склоняется перед тобой!» — Нахида';
    } else if (scorePct >= 70) {
      rankBadge = 'Звание: Старший научный сотрудник Академии (Ранг A)';
      verdict = '«Весьма достойно! Ты прекрасно ориентируешься в хрониках и законах Тейвата. Паймон в восторге!» — Паймон';
    } else if (scorePct >= 50) {
      rankBadge = 'Звание: Опытный Путешественник (Ранг B)';
      verdict = '«Неплохо, путник. Но в глубинах Каэнри\'ах и залах Селестии скрыто куда больше тайн. Продолжай странствия!» — Дайнслейф';
    } else {
      rankBadge = 'Звание: Новичок Тейвата (Ранг C)';
      verdict = '«Эй, похоже, кто-то перепутал Анемокул с капустой! Прочитай справочник Тейвата и попробуй снова!» — Паймон';
    }

    document.getElementById('results-rank-badge').textContent = rankBadge;
    document.getElementById('results-verdict-quote').textContent = verdict;
  }

  // --- 4. CODEX OF TEYVAT TABS ---
  function setupCodexTabs() {
    const tabs = document.querySelectorAll('.codex-tab-btn');
    const panels = document.querySelectorAll('.codex-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const panel = document.getElementById(`codex-panel-${targetId}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- 5. INITIALIZE EVENT LISTENERS ---
  document.addEventListener('DOMContentLoaded', () => {
    updateWishUI();
    setupCodexTabs();

    // Wish button
    const wishBtn = document.getElementById('btn-make-wish');
    if (wishBtn) {
      wishBtn.addEventListener('click', performWish);
    }

    // Wish overlay close
    const wishCloseBtn = document.getElementById('btn-close-wish');
    if (wishCloseBtn) {
      wishCloseBtn.addEventListener('click', () => {
        const overlay = document.getElementById('wish-overlay');
        if (overlay) overlay.classList.remove('active');
      });
    }

    // Quiz triggers
    document.querySelectorAll('[data-quiz-cat]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = card.getAttribute('data-quiz-cat');
        openQuiz(cat);
      });
    });

    // Quiz Modal controls
    if (quizNextBtn) {
      quizNextBtn.addEventListener('click', advanceQuestion);
    }
    const modalCloseBtn = document.getElementById('quiz-modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeQuiz);
    }
    const retakeBtn = document.getElementById('results-retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        if (activeQuizCategory) {
          openQuiz(activeQuizCategory.id);
        }
      });
    }
    const finishBtn = document.getElementById('results-finish-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', closeQuiz);
    }

    // Keyboard support: 1, 2, 3, 4 for quiz options, Space/Enter for next, Esc to close
    document.addEventListener('keydown', (e) => {
      if (quizModal && quizModal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeQuiz();
        } else if (!isAnswerSubmitted && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const btns = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
          if (btns[idx]) btns[idx].click();
        } else if (isAnswerSubmitted && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          advanceQuestion();
        }
      }
    });
  });

})();
