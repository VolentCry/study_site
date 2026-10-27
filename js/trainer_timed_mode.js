/**
 * trainer_timed_mode.js
 * Универсальный модуль режима «Спринт на 10 минут» для тренажёров ОГЭ
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'studyTimedRecords';

  function getStoredRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch(e) {
      return {};
    }
  }

  function saveRecord(trainerId, solvedCount) {
    try {
      const records = getStoredRecords();
      const prev = records[trainerId] || { bestSolved: 0 };
      if (solvedCount > prev.bestSolved) {
        records[trainerId] = {
          bestSolved: solvedCount,
          date: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return true; // новый рекорд!
      }
    } catch(e) {}
    return false;
  }

  // Звуковые микроэффекты через Web Audio API
  let audioCtx = null;
  function playBeep(freq, duration, type) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
  }

  function playFinishFanfare() {
    playBeep(523.25, 0.2); // C5
    setTimeout(() => playBeep(659.25, 0.2), 150); // E5
    setTimeout(() => playBeep(783.99, 0.2), 300); // G5
    setTimeout(() => playBeep(1046.50, 0.45), 450); // C6
  }

  const TrainerTimedMode = {
    isActive: false,
    trainerId: null,
    title: 'Задание ОГЭ',
    totalSeconds: 600, // 10 минут = 600 сек
    remainingSeconds: 600,
    timerInterval: null,
    solvedCount: 0,
    attemptCount: 0,
    onNextTask: null,

    isTimedRequested() {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'timed' || window.location.hash === '#timed';
    },

    init(options) {
      options = options || {};
      this.trainerId = options.trainerId || 'oge_trainer';
      this.title = options.title || 'Задание ОГЭ';
      this.onNextTask = options.onNextTask || function() {};

      if (!this.isTimedRequested()) {
        return false;
      }

      this.isActive = true;
      this.injectStyles();
      this.setupDOM();
      this.startTimer();
      return true;
    },

    injectStyles() {
      if (document.getElementById('timed-mode-styles')) return;
      const style = document.createElement('style');
      style.id = 'timed-mode-styles';
      style.textContent = `
        /* Скрытие стандартных инструментов и фильтров в режиме на время */
        body.is-timed-mode .category-filter,
        body.is-timed-mode .card-tools,
        body.is-timed-mode #solution-panel,
        body.is-timed-mode #theory-panel,
        body.is-timed-mode .stats-bar,
        body.is-timed-mode .stats-dashboard,
        body.is-timed-mode #btn-next {
          display: none !important;
        }

        body.is-timed-mode .problem-card {
          margin-top: 10px;
          border-color: rgba(255, 119, 40, 0.35);
          box-shadow: 0 8px 32px rgba(255, 119, 40, 0.08);
        }

        /* TIMED MODE HUD */
        .timed-mode-hud {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: linear-gradient(135deg, #182638 0%, #20354f 100%);
          color: #fff;
          padding: 16px 22px;
          border-radius: 14px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 119, 40, 0.4);
          box-shadow: 0 8px 24px rgba(20, 32, 49, 0.35), 0 0 20px rgba(255, 119, 40, 0.1);
          flex-wrap: wrap;
          animation: timedSlideIn 0.35s ease;
        }
        @keyframes timedSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .timed-hud-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .timed-hud-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 119, 40, 0.2);
          color: #ff9955;
          border: 1px solid rgba(255, 119, 40, 0.4);
        }
        .timed-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff7728;
          box-shadow: 0 0 8px #ff7728;
          animation: timedPulse 1.2s infinite ease-in-out;
        }
        @keyframes timedPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        .timed-hud-title {
          font: 700 16px 'Zen Old Mincho', serif;
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .timed-hud-proto {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* TIMER BOX */
        .timed-timer-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 16, 26, 0.45);
          padding: 6px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }
        .timed-timer-icon {
          font-size: 18px;
          line-height: 1;
        }
        .timed-timer-digits {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: .06em;
          color: #fff;
          transition: color 0.3s ease;
        }
        .timed-timer-digits.warning {
          color: #ffb703;
        }
        .timed-timer-digits.danger {
          color: #ff4d4d;
          animation: timedPulse 0.8s infinite;
        }

        /* COUNTER BOX */
        .timed-counter-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .timed-counter-lbl {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 600;
        }
        .timed-counter-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px;
          font-weight: 800;
          color: #2ed573;
          background: rgba(46, 213, 115, 0.16);
          border: 1px solid rgba(46, 213, 115, 0.35);
          padding: 2px 12px;
          border-radius: 8px;
          min-width: 42px;
          text-align: center;
        }

        .timed-exit-btn {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .timed-exit-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* MODAL */
        .timed-finish-modal {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(10, 16, 26, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: none;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .timed-finish-modal.active {
          display: flex;
        }
        .timed-finish-card {
          background: #fff;
          color: #19273c;
          border-radius: 20px;
          padding: 38px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(38, 63, 97, 0.18);
          animation: modalPop .35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .timed-finish-icon {
          font-size: 56px;
          margin-bottom: 8px;
          display: inline-block;
          animation: finishTrophy 0.6s ease;
        }
        @keyframes finishTrophy {
          0% { transform: scale(0.6) rotate(-15deg); }
          60% { transform: scale(1.15) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .timed-finish-card h2 {
          font: 700 26px 'Zen Old Mincho', serif;
          color: #19273c;
          margin: 0 0 8px;
        }
        .timed-finish-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.55;
          margin: 0 0 24px;
        }
        .timed-finish-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .timed-stat-cell {
          background: #f8fafc;
          padding: 12px 6px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .timed-stat-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 800;
          color: #19273c;
          display: block;
        }
        .timed-stat-lbl {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
          display: block;
        }
        .timed-new-record-badge {
          background: #fef08a;
          color: #854d0e;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 18px;
          border: 1px solid #eab308;
        }
        .timed-finish-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .timed-btn-primary {
          background: linear-gradient(135deg, #b7464e 0%, #d3525b 100%);
          color: #fff !important;
          font-size: 14px;
          font-weight: 800;
          padding: 14px 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: all .2s;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 14px rgba(183, 70, 78, 0.35);
        }
        .timed-btn-primary:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(183, 70, 78, 0.45);
        }
        .timed-btn-secondary {
          background: #f1f5f9;
          color: #19273c;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 18px;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid #cbd5e1;
          transition: all .2s;
          display: inline-block;
        }
        .timed-btn-secondary:hover {
          background: #e2e8f0;
        }

        @media (max-width: 640px) {
          .timed-mode-hud {
            padding: 14px 16px;
            gap: 12px;
          }
          .timed-timer-digits {
            font-size: 20px;
          }
          .timed-finish-card {
            padding: 28px 20px;
          }
          .timed-finish-stats {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    },

    setupDOM() {
      document.body.classList.add('is-timed-mode');

      // Находим контейнер перед problem-card
      const problemCard = document.querySelector('.problem-card');
      if (!problemCard) return;

      const hud = document.createElement('div');
      hud.className = 'timed-mode-hud';
      hud.id = 'timed-mode-hud';
      hud.innerHTML = `
        <div class="timed-hud-left">
          <div class="timed-hud-badge">
            <span class="timed-pulse-dot"></span>
            <span>Спринт 10 мин</span>
          </div>
          <span class="timed-hud-title">
            <span>⚡ Режим на время</span>
            <span class="timed-hud-proto">${this.title} · Все прототипы</span>
          </span>
        </div>

        <div class="timed-timer-wrap">
          <span class="timed-timer-icon">⏱️</span>
          <span class="timed-timer-digits" id="timed-timer-digits">10:00</span>
        </div>

        <div class="timed-counter-wrap">
          <span class="timed-counter-lbl">Решено верно:</span>
          <span class="timed-counter-val" id="timed-solved-count">0</span>
        </div>

        <a href="${window.location.pathname}" class="timed-exit-btn" title="Выйти в обычный режим">
          <span>✕</span> <span>Выйти</span>
        </a>
      `;

      problemCard.parentNode.insertBefore(hud, problemCard);

      // Вставляем модальное окно завершения
      const modal = document.createElement('div');
      modal.className = 'timed-finish-modal';
      modal.id = 'timed-finish-modal';
      modal.innerHTML = `
        <div class="timed-finish-card">
          <div class="timed-finish-icon">🏆</div>
          <h2>Время вышло!</h2>
          <p>10-минутный спринт завершён. Вот твои итоговые результаты:</p>

          <div id="timed-record-banner"></div>

          <div class="timed-finish-stats">
            <div class="timed-stat-cell">
              <span class="timed-stat-val" id="modal-solved-val">0</span>
              <span class="timed-stat-lbl">Решено задач</span>
            </div>
            <div class="timed-stat-cell">
              <span class="timed-stat-val" id="modal-accuracy-val">100%</span>
              <span class="timed-stat-lbl">Точность</span>
            </div>
            <div class="timed-stat-cell">
              <span class="timed-stat-val" id="modal-xp-val">+0</span>
              <span class="timed-stat-lbl">Бонус XP</span>
            </div>
          </div>

          <div class="timed-finish-actions">
            <button type="button" class="timed-btn-primary" id="btn-timed-restart">
              ⏱️ Сыграть ещё раз (10 минут)
            </button>
            <a href="${window.location.pathname}" class="timed-btn-secondary">
              📖 Перейти в обычный режим
            </a>
            <a href="../pages/math_9.html#trainers" class="timed-btn-secondary">
              ← Назад в раздел ОГЭ 9 класс
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('btn-timed-restart').addEventListener('click', () => {
        this.restartTimer();
      });
    },

    startTimer() {
      clearInterval(this.timerInterval);
      this.remainingSeconds = this.totalSeconds;
      this.updateTimerDisplay();

      this.timerInterval = setInterval(() => {
        this.remainingSeconds--;
        this.updateTimerDisplay();

        // Предупреждающие звуки на последних 5 секундах
        if (this.remainingSeconds > 0 && this.remainingSeconds <= 5) {
          playBeep(440, 0.08, 'sine');
        }

        if (this.remainingSeconds <= 0) {
          this.finish();
        }
      }, 1000);
    },

    updateTimerDisplay() {
      const timerDigits = document.getElementById('timed-timer-digits');
      if (!timerDigits) return;

      const mins = Math.floor(Math.max(0, this.remainingSeconds) / 60);
      const secs = Math.max(0, this.remainingSeconds) % 60;
      const fmt = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      timerDigits.textContent = fmt;

      if (this.remainingSeconds <= 30) {
        timerDigits.className = 'timed-timer-digits danger';
      } else if (this.remainingSeconds <= 120) {
        timerDigits.className = 'timed-timer-digits warning';
      } else {
        timerDigits.className = 'timed-timer-digits';
      }
    },

    recordAttempt(isCorrect) {
      if (!this.isActive) return;
      this.attemptCount++;
      const btnCheck = document.getElementById('btn-check');

      if (isCorrect) {
        this.solvedCount++;
        const counter = document.getElementById('timed-solved-count');
        if (counter) counter.textContent = String(this.solvedCount);

        if (btnCheck) {
          btnCheck.textContent = '✓ Верно!';
          btnCheck.disabled = true;
        }

        // В режиме на время автоматически переходим к следующему примеру через 550мс
        setTimeout(() => {
          if (this.isActive && this.remainingSeconds > 0) {
            this.onNextTask();
            if (btnCheck) {
              btnCheck.textContent = 'Проверить ↵';
              btnCheck.disabled = false;
            }
          }
        }, 550);
      } else {
        if (btnCheck) {
          btnCheck.disabled = false;
          btnCheck.textContent = 'Проверить ↵';
        }
      }
    },

    finish() {
      clearInterval(this.timerInterval);
      this.remainingSeconds = 0;
      this.updateTimerDisplay();
      playFinishFanfare();

      // Блокируем ввод
      const answerInput = document.getElementById('answer-input');
      if (answerInput) answerInput.disabled = true;
      const btnCheck = document.getElementById('btn-check');
      if (btnCheck) btnCheck.disabled = true;

      // Считаем бонусы и рекорд
      const isNewRecord = saveRecord(this.trainerId, this.solvedCount);
      const accuracy = this.attemptCount > 0 
        ? Math.round((this.solvedCount / this.attemptCount) * 100) 
        : 0;
      const earnedBonusXp = (this.solvedCount * 15) + (this.solvedCount > 0 ? 50 : 0);

      try {
        const curXp = parseInt(localStorage.getItem('user_xp') || '0', 10);
        localStorage.setItem('user_xp', String(curXp + (this.solvedCount > 0 ? 50 : 0)));
      } catch(e) {}

      // Заполняем модалку
      const modal = document.getElementById('timed-finish-modal');
      const solvedVal = document.getElementById('modal-solved-val');
      const accVal = document.getElementById('modal-accuracy-val');
      const xpVal = document.getElementById('modal-xp-val');
      const recBanner = document.getElementById('timed-record-banner');

      if (solvedVal) solvedVal.textContent = String(this.solvedCount);
      if (accVal) accVal.textContent = `${accuracy}%`;
      if (xpVal) xpVal.textContent = `+${earnedBonusXp} XP`;

      if (recBanner) {
        recBanner.innerHTML = isNewRecord && this.solvedCount > 0
          ? '<span class="timed-new-record-badge">🎉 Новый личный рекорд спринта!</span>'
          : '';
      }

      if (modal) modal.classList.add('active');
    },

    restartTimer() {
      const modal = document.getElementById('timed-finish-modal');
      if (modal) modal.classList.remove('active');

      this.solvedCount = 0;
      this.attemptCount = 0;
      const counter = document.getElementById('timed-solved-count');
      if (counter) counter.textContent = '0';

      const answerInput = document.getElementById('answer-input');
      if (answerInput) {
        answerInput.disabled = false;
        answerInput.value = '';
      }
      const btnCheck = document.getElementById('btn-check');
      if (btnCheck) {
        btnCheck.disabled = false;
        btnCheck.textContent = 'Проверить ↵';
        btnCheck.style.display = 'inline-flex';
      }

      this.startTimer();
      this.onNextTask();
    }
  };

  window.TrainerTimedMode = TrainerTimedMode;
})();
