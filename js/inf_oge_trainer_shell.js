/**
 * inf_oge_trainer_shell.js
 * Единая клиентская оболочка для тренажёров ОГЭ по информатике (№1–10):
 * - Синхронизация светлой и тёмной темы (window.StudyTheme)
 * - Генерация, проверка, пошаговый разбор и теория
 * - Интеграция с TrainerTracker, TrainerTimedMode, user_xp и studyMetrics
 */

(function (root) {
  'use strict';

  function getSavedTheme() {
    if (root.StudyTheme && typeof root.StudyTheme.get === 'function') {
      return root.StudyTheme.get();
    }
    try {
      return localStorage.getItem('profileTheme') || localStorage.getItem('site_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.dataset.theme = resolved;
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.textContent = resolved === 'light' ? '🌙' : '☀️';
      btn.title = resolved === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему';
    }
  }

  function toggleTheme() {
    if (root.StudyTheme && typeof root.StudyTheme.toggle === 'function') {
      const next = root.StudyTheme.toggle(true);
      applyTheme(next);
      return next;
    }
    const cur = getSavedTheme();
    const next = cur === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('profileTheme', next);
      localStorage.setItem('site_theme', next);
    } catch (e) {}
    applyTheme(next);
    return next;
  }

  function recordInformaticsMetric(taskId, isCorrect, skillId) {
    try {
      const raw = localStorage.getItem('studyMetrics');
      const list = raw ? JSON.parse(raw) : [];
      const arr = Array.isArray(list) ? list : [];
      arr.push({
        timestamp: new Date().toISOString(),
        subject: 'Информатика',
        taskId: String(taskId),
        correct: Boolean(isCorrect),
        skill: skillId || 'general'
      });
      if (arr.length > 500) {
        arr.splice(0, arr.length - 500);
      }
      localStorage.setItem('studyMetrics', JSON.stringify(arr));
    } catch (e) {}
  }

  function initThemeToggleOnly() {
    applyTheme(getSavedTheme());
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
    root.addEventListener('study-theme-changed', (e) => {
      if (e && e.detail) applyTheme(e.detail);
    });
  }

  function initTrainer(config) {
    initThemeToggleOnly();

    const {
      trainerId,
      taskNum,
      title,
      engine,
      defaultCategory = 'mixed_all',
      skillId = 'general'
    } = config;

    let currentCategory = defaultCategory;
    let currentTask = null;
    let hasAnsweredCurrent = false;

    const taskContainer = document.getElementById('task-container');
    const answerInput = document.getElementById('answer-input');
    const btnCheck = document.getElementById('btn-check');
    const btnNext = document.getElementById('btn-next');
    const btnNewTask = document.getElementById('btn-new-task');
    const feedbackBanner = document.getElementById('feedback-banner');
    const taskBadge = document.getElementById('task-badge');
    const taskCatBadge = document.getElementById('task-cat-badge');

    const statStreak = document.getElementById('stat-streak');
    const statMaxStreak = document.getElementById('stat-max-streak');
    const statTotal = document.getElementById('stat-total');
    const statRank = document.getElementById('stat-rank');
    const navXpBadge = document.getElementById('nav-xp-badge');

    const solutionPanel = document.getElementById('solution-panel');
    const solutionContent = document.getElementById('solution-content');
    const theoryPanel = document.getElementById('theory-panel');
    const milestoneToast = document.getElementById('milestone-toast');

    let audioCtx = null;
    function playTone(freq, type, duration) {
      try {
        if (!audioCtx) audioCtx = new (root.AudioContext || root.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.11, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function showToast(text) {
      if (!milestoneToast) return;
      milestoneToast.textContent = text;
      milestoneToast.classList.add('active');
      setTimeout(() => milestoneToast.classList.remove('active'), 3200);
    }

    function syncStats() {
      if (root.TrainerTracker) {
        const records = root.TrainerTracker.getTrainerRecords();
        const cur = records[trainerId] || { maxStreak: 0, totalSolved: 0, maxRank: 'Не начат' };
        if (statMaxStreak) statMaxStreak.textContent = cur.maxStreak || 0;
        if (statTotal) statTotal.textContent = cur.totalSolved || 0;
        if (statRank) statRank.textContent = cur.maxRank || 'Не начат';
      }
      try {
        const xp = localStorage.getItem('user_xp') || '0';
        if (navXpBadge) navXpBadge.textContent = 'XP +' + xp;
      } catch (e) {}
    }

    function bindCodeTabs() {
      if (!taskContainer) return;
      const groups = taskContainer.querySelectorAll('.inf-code-tabs');
      groups.forEach((group) => {
        const btns = group.querySelectorAll('.inf-lang-btn');
        const panels = group.querySelectorAll('.inf-code-pre');
        btns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            btns.forEach((b) => b.classList.toggle('active', b === btn));
            panels.forEach((p) => {
              p.style.display = p.dataset.lang === lang ? 'block' : 'none';
            });
          });
        });
      });
    }

    function loadNewTask() {
      if (root.TrainerTimedMode && root.TrainerTimedMode.isActive) {
        currentCategory = 'mixed_all';
      }
      hasAnsweredCurrent = false;
      currentTask = engine.generateTask(currentCategory);
      root._currentTask = currentTask;

      if (taskContainer) {
        taskContainer.innerHTML = currentTask.questionHtml;
        bindCodeTabs();
      }
      if (taskCatBadge) taskCatBadge.textContent = currentTask.catName || 'Прототип ОГЭ';
      if (taskBadge) taskBadge.textContent = `Задание №${taskNum} · ${currentTask.catName || 'ОГЭ'}`;

      if (answerInput) {
        answerInput.value = '';
        answerInput.className = 'answer-input';
        answerInput.disabled = false;
        if (typeof answerInput.focus === 'function') {
          try {
            answerInput.focus({ preventScroll: true });
          } catch (e) {
            answerInput.focus();
          }
        }
      }
      if (feedbackBanner) {
        feedbackBanner.className = 'feedback-banner';
        feedbackBanner.textContent = '';
      }
      if (btnCheck) btnCheck.style.display = 'inline-flex';
      if (btnNext) btnNext.style.display = 'none';

      if (solutionContent && Array.isArray(currentTask.solutionSteps)) {
        solutionContent.innerHTML = currentTask.solutionSteps
          .map((step, idx) => `<div class="solution-step"><strong>Шаг ${idx + 1}:</strong> ${step}</div>`)
          .join('');
      }
      if (solutionPanel) solutionPanel.classList.remove('active');
    }

    function handleCheck() {
      if (hasAnsweredCurrent || !currentTask || !answerInput) return;
      const val = answerInput.value.trim();
      if (!val) {
        answerInput.focus();
        return;
      }

      const isCorrect = engine.checkAnswer(val, currentTask.answer);

      recordInformaticsMetric(`${trainerId}:${currentTask.category || currentCategory}`, isCorrect, skillId);

      if (isCorrect) {
        hasAnsweredCurrent = true;
        answerInput.className = 'answer-input correct';
        answerInput.disabled = true;

        playTone(587, 'sine', 0.14);
        setTimeout(() => playTone(880, 'sine', 0.24), 110);

        if (feedbackBanner) {
          feedbackBanner.className = 'feedback-banner show success';
          feedbackBanner.innerHTML = '🎉 <strong>Верно!</strong> Ответ полностью совпадает с эталоном ОГЭ (+15 XP).';
        }

        if (root.TrainerTimedMode && root.TrainerTimedMode.isActive) {
          root.TrainerTimedMode.recordAttempt(true);
        } else {
          if (btnCheck) btnCheck.style.display = 'none';
          if (btnNext) {
            btnNext.style.display = 'inline-flex';
            btnNext.focus();
          }
        }

        try {
          const curXp = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
          localStorage.setItem('user_xp', String(curXp + 15));
        } catch (e) {}

        if (root.TrainerTracker) {
          const res = root.TrainerTracker.recordAttempt(trainerId, true);
          if (statStreak) statStreak.textContent = res.currentStreak;
          syncStats();

          if (res.currentStreak === 5) showToast('🔥 Серия 5! Отличный разгон в ОГЭ по информатике!');
          if (res.currentStreak === 10) showToast('⚡ Серия 10! Уровень уверенного балла ОГЭ!');
          if (res.currentStreak === 25) showToast('💎 Серия 25! Высшее звание тренажёра получено!');
          if (res.currentStreak === 50) showToast('🎁 СЕРИЯ 50! Бонус +500 XP разблокирован в профиле!');
        } else {
          syncStats();
        }
      } else {
        answerInput.className = 'answer-input wrong';
        playTone(220, 'triangle', 0.24);

        if (feedbackBanner) {
          feedbackBanner.className = 'feedback-banner show error';
          const hintText = currentTask.hint ? ` Подсказка: ${currentTask.hint}` : '';
          feedbackBanner.innerHTML = `❌ <strong>Пока неверно.</strong> Проверьте вычисления или откройте пошаговый разбор.${hintText}`;
        }

        if (root.TrainerTimedMode && root.TrainerTimedMode.isActive) {
          root.TrainerTimedMode.recordAttempt(false);
        }

        if (root.TrainerTracker) {
          root.TrainerTracker.recordAttempt(trainerId, false);
          if (statStreak) statStreak.textContent = 0;
          syncStats();
        }
      }
    }

    document.querySelectorAll('.cat-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat || 'mixed_all';
        loadNewTask();
      });
    });

    if (btnCheck) btnCheck.addEventListener('click', handleCheck);
    if (btnNext) btnNext.addEventListener('click', loadNewTask);
    if (btnNewTask) btnNewTask.addEventListener('click', loadNewTask);

    if (answerInput) {
      answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (hasAnsweredCurrent) loadNewTask();
          else handleCheck();
        }
      });
    }

    const btnToggleSolution = document.getElementById('btn-toggle-solution');
    if (btnToggleSolution && solutionPanel) {
      btnToggleSolution.addEventListener('click', () => {
        solutionPanel.classList.toggle('active');
      });
    }

    const btnToggleTheory = document.getElementById('btn-toggle-theory');
    if (btnToggleTheory && theoryPanel) {
      btnToggleTheory.addEventListener('click', () => {
        theoryPanel.classList.toggle('active');
      });
    }

    syncStats();
    if (root.TrainerTimedMode) {
      root.TrainerTimedMode.init({
        trainerId,
        title: title || `Задание №${taskNum}`,
        onNextTask: loadNewTask
      });
    }
    loadNewTask();
  }

  root.InfOgeShell = {
    initThemeToggleOnly,
    initTrainer,
    applyTheme,
    toggleTheme
  };
})(typeof window !== 'undefined' ? window : globalThis);
