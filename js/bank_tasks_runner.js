/**
 * bank_tasks_runner.js
 * Интерактивный раннер и модальное окно для Банка задач НЕшколы.
 * Поддерживает как стандартные задачи с вводом ответа, так и тестирования с выбором варианта (А, Б, В, Г),
 * а также экспорт задач в домашние задания учителя.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bank_solved_tasks';

  // Функция конвертации задачи из банка в формат задания для домашней работы
  function convertBankTaskToHomeworkTask(task, topic) {
    if (!task) return null;
    let questionHtml = '';

    // Если есть изображение / иллюстрация
    if (task.image) {
      const cleanPath = task.image.replace(/^(\.\.\/|\.\/)+/, '');
      questionHtml += `<div style="margin-bottom:12px; text-align:center;"><img src="${cleanPath}" alt="Иллюстрация" style="max-width:100%; max-height:220px; border-radius:6px; object-fit:contain; box-shadow:0 2px 8px rgba(0,0,0,0.15);"></div>`;
    }

    // Текст вопроса
    const bodyText = task.html ? task.html : (task.text || '');
    questionHtml += `<div class="bank-hw-task-body">${bodyText}</div>`;

    // Если тестовый вопрос с вариантами ответа
    if (task.options && Array.isArray(task.options) && task.options.length > 0) {
      const letters = ['А', 'Б', 'В', 'Г', 'Д'];
      questionHtml += `
        <div class="bank-hw-task-options" style="margin-top:12px; padding:10px 14px; background:rgba(0,0,0,0.08); border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.8rem; font-weight:700; color:var(--muted, #80918a); margin-bottom:6px;">Варианты ответа (в поле ответа укажите номер 1, 2, 3, 4 или букву):</div>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">
            ${task.options.map((opt, i) => `<div><strong>${letters[i] || (i + 1)})</strong> ${opt}</div>`).join('')}
          </div>
        </div>
      `;
    }

    // Единица измерения
    if (task.unit) {
      questionHtml += `<div style="margin-top:8px; font-size:0.8rem; color:var(--muted, #80918a);">Единица измерения: <strong>${task.unit}</strong></div>`;
    }

    // Шаги решения / пояснение
    const solutionSteps = [];
    if (task.explanation) {
      solutionSteps.push(task.explanation);
    }

    // Финальный эталонный ответ для автопроверки
    let finalAns = task.answer;
    let displayAns = String(task.answer || '');

    if (task.options && typeof task.correctIndex === 'number') {
      const letters = ['А', 'Б', 'В', 'Г', 'Д'];
      const letter = letters[task.correctIndex] || (task.correctIndex + 1);
      finalAns = task.correctIndex + 1;
      displayAns = `${finalAns} (${letter})`;
    }

    return {
      id: task.id || `bank_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      category: `bank_${topic ? topic.id : 'task'}`,
      catName: topic ? topic.title : 'Банк задач',
      questionHtml: questionHtml,
      answer: finalAns,
      displayAnswer: displayAns,
      solutionSteps: solutionSteps,
      source: 'bank_tasks',
      bankTaskId: task.id
    };
  }

  // Внедрение стилей раннера (если ещё не добавлены)
  function injectStyles() {
    if (document.getElementById('bank-tasks-runner-styles')) return;

    const style = document.createElement('style');
    style.id = 'bank-tasks-runner-styles';
    style.textContent = `
      dialog.bank-task-dialog {
        position: fixed;
        inset: 0;
        margin: auto;
        width: min(800px, calc(100vw - 32px));
        height: fit-content;
        max-height: min(90vh, 880px);
        padding: 0;
        border: 1px solid rgba(33, 74, 64, 0.22);
        border-radius: 16px;
        background: #fffaf0;
        box-shadow: 0 24px 64px rgba(18, 42, 36, 0.38), 0 4px 16px rgba(18, 42, 36, 0.12);
        overflow: hidden;
        display: none;
        flex-direction: column;
        color: #203b34;
        font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 99999;
      }

      dialog.bank-task-dialog[open] {
        display: flex;
        animation: btd-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      dialog.bank-task-dialog::backdrop {
        background: rgba(18, 42, 36, 0.68);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
      }

      @keyframes btd-fade-in {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }

      .btd-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px 16px;
        background: #f4f0df;
        border-bottom: 1px solid rgba(33, 74, 64, 0.12);
        flex-shrink: 0;
      }

      .btd-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }

      .btd-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        background: rgba(33, 74, 64, 0.1);
        color: #214a40;
      }

      .btd-badge.level-easy { background: #d7edd8; color: #1e5c2b; }
      .btd-badge.level-medium { background: #fef0c7; color: #8f5b00; }
      .btd-badge.level-hard { background: #fee4e2; color: #912018; }
      .btd-badge-test { background: #e0f2fe; color: #0369a1; border: 1px solid rgba(3, 105, 161, 0.2); }

      .btd-title {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(18px, 3.2vw, 24px);
        font-weight: 800;
        color: #183a34;
        line-height: 1.25;
      }

      .btd-close {
        width: 44px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid rgba(33, 74, 64, 0.18);
        border-radius: 50%;
        font-size: 24px;
        line-height: 1;
        color: #214a40;
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.15s ease, transform 0.15s ease, color 0.15s ease;
      }

      .btd-close:hover {
        background: #214a40;
        color: #fff;
        transform: scale(1.06);
      }

      .btd-nav-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 24px;
        background: rgba(220, 238, 229, 0.45);
        border-bottom: 1px solid rgba(33, 74, 64, 0.08);
        font-size: 13px;
        font-weight: 700;
        color: #48675d;
        flex-shrink: 0;
      }

      .btd-topic-progress-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-weight: 800;
        color: #214a40;
      }

      .btd-pills-scroll {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        overflow-x: auto;
        background: #fffdf7;
        border-bottom: 1px solid rgba(33, 74, 64, 0.08);
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        flex-shrink: 0;
      }

      .btd-pill {
        min-width: 44px;
        height: 38px;
        padding: 0 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(33, 74, 64, 0.2);
        border-radius: 6px;
        background: #fff;
        color: #214a40;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .btd-pill:hover {
        border-color: #214a40;
        background: #edf5f0;
      }

      .btd-pill.active {
        background: #214a40;
        color: #fffaf0;
        border-color: #214a40;
        box-shadow: 0 2px 8px rgba(33, 74, 64, 0.25);
      }

      .btd-pill.solved {
        border-color: #2e7d32;
        color: #1e5c2b;
        background: #eef7ee;
      }

      .btd-pill.active.solved {
        background: #2e7d32;
        color: #fff;
        border-color: #2e7d32;
      }

      .btd-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
        min-height: 180px;
      }

      .btd-q-badge {
        display: inline-block;
        padding: 3px 9px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 800;
        background: rgba(33, 74, 64, 0.09);
        color: #214a40;
        margin-bottom: 8px;
        letter-spacing: 0.03em;
      }

      .btd-illustration-wrap {
        text-align: center;
        margin-bottom: 20px;
        background: #fdfaf2;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(33, 74, 64, 0.08);
      }

      .btd-illustration {
        max-width: 100%;
        max-height: 240px;
        border-radius: 6px;
        box-shadow: 0 4px 14px rgba(33, 74, 64, 0.08);
        object-fit: contain;
      }

      .btd-text {
        font-size: 16px;
        line-height: 1.7;
        color: #203b34;
        margin-bottom: 20px;
      }

      .btd-text p {
        margin: 0 0 12px;
      }

      .btd-text p:last-child {
        margin-bottom: 0;
      }

      .btd-options-wrap {
        margin-bottom: 20px;
      }

      .btd-options-label {
        font-size: 13px;
        font-weight: 800;
        color: #58736a;
        margin-bottom: 10px;
      }

      .btd-options-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .btd-option-btn {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        border: 1.5px solid rgba(33, 74, 64, 0.18);
        border-radius: 8px;
        background: #fff;
        color: #203b34;
        font-family: inherit;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.45;
        text-align: left;
        cursor: pointer;
        transition: all 0.15s ease;
        min-height: 48px;
      }

      .btd-option-btn:hover:not(:disabled) {
        border-color: #214a40;
        background: #f4f8f5;
        transform: translateX(2px);
      }

      .btd-option-btn.selected {
        border-color: #214a40;
        background: rgba(33, 74, 64, 0.08);
        box-shadow: 0 0 0 2px rgba(33, 74, 64, 0.2);
      }

      .btd-option-btn.is-correct {
        border-color: #2e7d32 !important;
        background: #edf7ee !important;
        color: #1e5c2b !important;
      }

      .btd-option-btn.is-incorrect {
        border-color: #d32f2f !important;
        background: #fdf2f2 !important;
        color: #912018 !important;
      }

      .btd-opt-letter {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(33, 74, 64, 0.09);
        color: #214a40;
        font-weight: 800;
        font-size: 13px;
        flex-shrink: 0;
        transition: all 0.15s ease;
      }

      .btd-option-btn.selected .btd-opt-letter {
        background: #214a40;
        color: #fffaf0;
      }

      .btd-option-btn.is-correct .btd-opt-letter {
        background: #2e7d32;
        color: #fff;
      }

      .btd-option-btn.is-incorrect .btd-opt-letter {
        background: #d32f2f;
        color: #fff;
      }

      .btd-explanation-box {
        margin-top: 14px;
        padding: 14px 18px;
        border-radius: 8px;
        background: #f3f6ea;
        border-left: 4px solid #52776a;
        font-size: 14px;
        line-height: 1.6;
        color: #203b34;
      }

      .btd-answer-section {
        background: rgba(220, 238, 229, 0.35);
        border: 1px solid rgba(33, 74, 64, 0.15);
        border-radius: 10px;
        padding: 18px 20px;
      }

      .btd-answer-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .btd-input {
        flex: 1;
        min-width: 140px;
        height: 48px;
        padding: 0 16px;
        font-family: inherit;
        font-size: 16px;
        font-weight: 700;
        color: #203b34;
        background: #fff;
        border: 2px solid rgba(33, 74, 64, 0.22);
        border-radius: 6px;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }

      .btd-input:focus {
        border-color: #214a40;
        box-shadow: 0 0 0 3px rgba(33, 74, 64, 0.15);
      }

      .btd-input.is-valid {
        border-color: #2e7d32;
        background: #f4faf4;
      }

      .btd-input.is-invalid {
        border-color: #d32f2f;
        background: #fdf4f4;
      }

      .btd-unit {
        font-size: 15px;
        font-weight: 700;
        color: #48675d;
      }

      .btd-check-btn {
        min-height: 48px;
        padding: 0 24px;
        font-family: inherit;
        font-size: 15px;
        font-weight: 800;
        color: #fffaf0;
        background: #214a40;
        border: 1px solid #214a40;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease;
      }

      .btd-check-btn:hover {
        background: #326253;
        transform: translateY(-1px);
      }

      .btd-feedback {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 700;
        min-height: 20px;
      }

      .btd-feedback.correct {
        color: #2e7d32;
      }

      .btd-feedback.incorrect {
        color: #c62828;
      }

      .btd-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 24px;
        background: #f4f0df;
        border-top: 1px solid rgba(33, 74, 64, 0.12);
        flex-shrink: 0;
      }

      .btd-nav-btn {
        min-height: 44px;
        padding: 0 16px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 800;
        color: #214a40;
        background: #fff;
        border: 1px solid rgba(33, 74, 64, 0.2);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .btd-nav-btn:hover:not(:disabled) {
        background: #214a40;
        color: #fffaf0;
        border-color: #214a40;
      }

      .btd-nav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .btd-hw-add-btn {
        min-height: 44px;
        padding: 0 16px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        color: #183a34;
        background: #eef7ee;
        border: 1.5px solid rgba(46, 125, 50, 0.35);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .btd-hw-add-btn:hover {
        background: #2e7d32;
        color: #fff;
        border-color: #2e7d32;
        transform: translateY(-1px);
      }

      .btd-hw-add-btn.added {
        background: #2e7d32;
        color: #fff;
        border-color: #2e7d32;
      }

      .topic-solved-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 800;
        background: #d7edd8;
        color: #1e5c2b;
        border: 1px solid rgba(46, 125, 50, 0.25);
      }

      .test-badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 800;
        background: #e0f2fe;
        color: #0369a1;
        border: 1px solid rgba(3, 105, 161, 0.25);
      }

      @media (max-width: 600px) {
        dialog.bank-task-dialog {
          width: 100vw;
          height: 100%;
          max-height: 100vh;
          border-radius: 0;
          border: none;
          inset: 0;
          margin: 0;
        }

        .btd-header { padding: 14px 16px; }
        .btd-nav-bar, .btd-pills-scroll, .btd-body, .btd-footer { padding-left: 16px; padding-right: 16px; }
        .btd-answer-row { flex-direction: column; align-items: stretch; }
        .btd-check-btn { width: 100%; }
        .btd-footer { flex-wrap: wrap; }
        .btd-nav-btn { flex: 1; text-align: center; }
        .btd-hw-add-btn { width: 100%; order: 3; justify-content: center; }
      }
    `;
    document.head.appendChild(style);
  }

  // Хранилище решённых задач
  function getSolvedSet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  function markTaskSolved(taskId) {
    try {
      const set = getSolvedSet();
      set.add(taskId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  // Запись в studyMetrics для личного кабинета
  function recordMetric(subject, taskId, isCorrect) {
    try {
      const raw = localStorage.getItem('studyMetrics');
      const attempts = raw ? JSON.parse(raw) : [];
      attempts.push({
        timestamp: new Date().toISOString(),
        subject: subject || 'Математика',
        taskId: taskId,
        correct: isCorrect
      });
      localStorage.setItem('studyMetrics', JSON.stringify(attempts));

      window.dispatchEvent(new CustomEvent('study-task-solved', {
        detail: { subject: subject || 'Математика', taskId: taskId, correct: isCorrect }
      }));
      if (window.AuthSync && typeof window.AuthSync.scheduleSync === 'function') {
        window.AuthSync.scheduleSync(1200);
      }
    } catch (e) {}
  }

  // Нормализация и проверка ответа
  function normalizeVal(v) {
    return String(v || '')
      .trim()
      .toLowerCase()
      .replaceAll('ё', 'е')
      .replace(',', '.')
      .replace(/\s+/g, '');
  }

  function verifyAnswer(userVal, task) {
    if (!userVal) return false;
    let u = normalizeVal(userVal);
    const c = normalizeVal(task.answer);

    // Поддержка тестовых вопросов с выбором варианта
    if (task.options && typeof task.correctIndex === 'number') {
      const cIdx = task.correctIndex;
      const uNum = parseInt(u, 10);
      if (!isNaN(uNum)) {
        if (uNum === cIdx + 1 || uNum === cIdx) return true;
      }
      const lettersRu = ['а', 'б', 'в', 'г', 'д'];
      const lettersEn = ['a', 'b', 'c', 'd', 'e'];
      if (lettersRu[cIdx] && u === lettersRu[cIdx]) return true;
      if (lettersEn[cIdx] && u === lettersEn[cIdx]) return true;

      const cleanWord = v => String(v).toLowerCase().replaceAll('ё', 'е').replace(/[^a-zа-я0-9]/gi, '');
      if (cleanWord(userVal) === cleanWord(task.options[cIdx])) {
        return true;
      }
    }

    // Если в задании указана единица измерения, отсекаем её из ответа пользователя если он её ввёл
    if (task.unit) {
      const cleanUnit = normalizeVal(task.unit);
      if (cleanUnit && u.endsWith(cleanUnit)) {
        u = u.slice(0, -cleanUnit.length).trim();
      }
    }

    if (u === c) return true;

    // Список допустимых альтернативных ответов
    if (task.acceptedAnswers && Array.isArray(task.acceptedAnswers)) {
      if (task.acceptedAnswers.some(a => normalizeVal(a) === u)) return true;
    }

    // Алгебраическое сравнение одночленов (например, -14a^3b^4 == -14b^4a^3)
    if (window.MonomialsTrainer && typeof window.MonomialsTrainer.areMonomialsEqual === 'function') {
      if (task.type === 'monomials' || (task.taskId && String(task.taskId).startsWith('monomials')) || (task.id && String(task.id).startsWith('monomials'))) {
        if (window.MonomialsTrainer.areMonomialsEqual(u, c)) return true;
      }
    }

    // Числовое сравнение с плавающей точкой
    const fu = parseFloat(u);
    const fc = parseFloat(c);
    if (!isNaN(fu) && !isNaN(fc) && Math.abs(fu - fc) < 0.001) {
      return true;
    }

    // Если ответ дробь (например, 3/8)
    if (c.includes('/')) {
      const parts = c.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (den !== 0 && !isNaN(fu) && Math.abs(fu - (num / den)) < 0.001) {
          return true;
        }
      }
    }

    // Если пользователь ввёл дробь, а верный ответ десятичный (например, 1/2 vs 0.5)
    if (u.includes('/')) {
      const parts = u.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (den !== 0 && !isNaN(fc) && Math.abs((num / den) - fc) < 0.001) {
          return true;
        }
      }
    }

    // Сравнение слов без знаков препинания
    const cleanWord = v => String(v).toLowerCase().replaceAll('ё', 'е').replace(/[^a-zа-я0-9]/gi, '');
    if (cleanWord(userVal) === cleanWord(task.answer)) {
      return true;
    }

    return false;
  }

  // Состояние модального окна
  let currentTopic = null;
  let currentTaskIdx = 0;

  // Инициализация модального окна
  function initTaskModal() {
    injectStyles();

    let dialog = document.getElementById('bank-task-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'bank-task-dialog';
      dialog.id = 'bank-task-dialog';
      dialog.setAttribute('aria-labelledby', 'btd-title');
      dialog.innerHTML = `
        <div class="btd-header">
          <div>
            <div class="btd-meta">
              <span class="btd-badge" id="btd-subject">Математика</span>
              <span class="btd-badge" id="btd-class">4 класс</span>
              <span class="btd-badge" id="btd-level">Лёгкий</span>
              <span class="btd-badge btd-badge-test" id="btd-badge-test" style="display:none;">🧪 Тестирование</span>
            </div>
            <h2 class="btd-title" id="btd-title">Название темы</h2>
          </div>
          <button class="btd-close" id="btd-close" type="button" aria-label="Закрыть задачу">×</button>
        </div>

        <div class="btd-nav-bar">
          <span>Задание <strong id="btd-cur-num">1</strong> из <strong id="btd-total-num">10</strong></span>
          <span class="btd-topic-progress-badge" id="btd-topic-progress">Решено: 0</span>
        </div>

        <div class="btd-pills-scroll" id="btd-pills-scroll" role="tablist" aria-label="Список заданий"></div>

        <div class="btd-body">
          <div class="btd-illustration-wrap" id="btd-illustration-wrap" style="display:none;">
            <img src="" alt="Иллюстрация к задаче" class="btd-illustration" id="btd-illustration" onerror="this.parentElement.style.display='none'">
          </div>
          <div class="btd-text" id="btd-text">Текст задания</div>

          <!-- Блок вариантов ответов для тестов -->
          <div class="btd-options-wrap" id="btd-options-wrap" style="display:none;">
            <div class="btd-options-label">Выбери вариант ответа:</div>
            <div class="btd-options-list" id="btd-options-list" role="radiogroup" aria-label="Варианты ответа"></div>
          </div>
          
          <form class="btd-answer-section" id="btd-answer-form">
            <label for="btd-input" id="btd-input-label" style="display:block; font-size:12px; font-weight:800; color:var(--muted, #48675d); margin-bottom:6px;">Твой ответ:</label>
            <div class="btd-answer-row">
              <input type="text" class="btd-input" id="btd-input" placeholder="Введи ответ" autocomplete="off" required>
              <span class="btd-unit" id="btd-unit"></span>
              <button type="submit" class="btd-check-btn" id="btd-check-btn">Проверить</button>
            </div>
            <div class="btd-feedback" id="btd-feedback" aria-live="polite"></div>
            <div class="btd-explanation-box" id="btd-explanation-box" style="display:none;"></div>
          </form>
        </div>

        <div class="btd-footer">
          <button class="btd-nav-btn" id="btd-prev-btn" type="button">← Предыдущая</button>
          <button class="btd-hw-add-btn" id="btd-add-to-hw-btn" type="button" title="Добавить это задание в конструктор домашнего задания">
            ➕ В домашнее задание
          </button>
          <button class="btd-nav-btn" id="btd-next-btn" type="button">Следующая →</button>
        </div>
      `;
      document.body.appendChild(dialog);

      // Слушатели модального окна
      const closeBtn = document.getElementById('btd-close');
      const prevBtn = document.getElementById('btd-prev-btn');
      const nextBtn = document.getElementById('btd-next-btn');
      const answerForm = document.getElementById('btd-answer-form');
      const pillsScroll = document.getElementById('btd-pills-scroll');
      const optionsList = document.getElementById('btd-options-list');
      const addToHwBtn = document.getElementById('btd-add-to-hw-btn');

      const handleClose = () => {
        dialog.close();
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.has('topic')) {
            url.searchParams.delete('topic');
            url.searchParams.delete('task');
            window.history.replaceState(null, '', url.pathname + (url.search || '') + (url.hash || ''));
          }
        } catch (e) {}
      };

      closeBtn.onclick = handleClose;
      dialog.oncancel = handleClose;

      // Закрытие при клике по фону (backdrop)
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          handleClose();
        }
      });

      prevBtn.onclick = () => {
        if (currentTopic && currentTaskIdx > 0) {
          renderTaskInModal(currentTaskIdx - 1);
        }
      };

      nextBtn.onclick = () => {
        if (currentTopic && currentTaskIdx < currentTopic.tasks.length - 1) {
          renderTaskInModal(currentTaskIdx + 1);
        }
      };

      pillsScroll.onclick = (e) => {
        const pill = e.target.closest('.btd-pill');
        if (!pill) return;
        const idx = parseInt(pill.dataset.taskIdx, 10);
        if (!isNaN(idx)) renderTaskInModal(idx);
      };

      // Клик по варианту ответа в тесте
      optionsList.addEventListener('click', (e) => {
        const btn = e.target.closest('.btd-option-btn');
        if (!btn) return;
        const optIdx = parseInt(btn.dataset.optIdx, 10);
        if (isNaN(optIdx)) return;

        optionsList.querySelectorAll('.btd-option-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-checked', 'false');
        });

        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');

        const input = document.getElementById('btd-input');
        input.value = optIdx + 1;
        input.classList.remove('is-invalid');

        const feedback = document.getElementById('btd-feedback');
        feedback.textContent = '';
        feedback.className = 'btd-feedback';
      });

      // Кнопка добавления текущего задания в черновик Д/З
      if (addToHwBtn) {
        addToHwBtn.onclick = () => {
          if (!currentTopic || !currentTopic.tasks[currentTaskIdx]) return;
          const task = currentTopic.tasks[currentTaskIdx];
          const hwTask = convertBankTaskToHomeworkTask(task, currentTopic);

          try {
            let list = [];
            const raw = localStorage.getItem('teacher_hw_draft_tasks');
            if (raw) list = JSON.parse(raw);
            if (!Array.isArray(list)) list = [];

            const exists = list.some(t => (t.bankTaskId && t.bankTaskId === task.id) || t.id === hwTask.id);
            if (exists) {
              addToHwBtn.textContent = '✓ Уже в Д/З';
              setTimeout(() => { addToHwBtn.textContent = '➕ В домашнее задание'; }, 1600);
              return;
            }

            list.push(hwTask);
            localStorage.setItem('teacher_hw_draft_tasks', JSON.stringify(list));

            addToHwBtn.textContent = `✓ Добавлено (${list.length})`;
            addToHwBtn.classList.add('added');
            setTimeout(() => {
              addToHwBtn.textContent = '➕ В домашнее задание';
              addToHwBtn.classList.remove('added');
            }, 1800);
          } catch (e) {
            console.error('Error saving to teacher_hw_draft_tasks', e);
          }
        };
      }

      answerForm.onsubmit = (e) => {
        e.preventDefault();
        if (!currentTopic || !currentTopic.tasks[currentTaskIdx]) return;
        const task = currentTopic.tasks[currentTaskIdx];
        const input = document.getElementById('btd-input');
        const feedback = document.getElementById('btd-feedback');
        const explBox = document.getElementById('btd-explanation-box');
        const val = input.value.trim();

        const isCorrect = verifyAnswer(val, task);
        recordMetric(currentTopic.subjectLabel, task.id, isCorrect);

        if (isCorrect) {
          markTaskSolved(task.id);
          feedback.className = 'btd-feedback correct';
          feedback.innerHTML = '✓ Верно! Отличная работа!';
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');

          if (task.options && typeof task.correctIndex === 'number') {
            optionsList.querySelectorAll('.btd-option-btn').forEach((b, i) => {
              b.classList.remove('is-incorrect');
              if (i === task.correctIndex) {
                b.classList.add('is-correct');
              }
            });
          }

          if (task.explanation) {
            explBox.innerHTML = `<strong>💡 Пояснение к решению:</strong><br>${task.explanation}`;
            explBox.style.display = 'block';
          } else {
            explBox.style.display = 'none';
          }

          updatePillsStatus();
          updateTopicCardBadges();
        } else {
          feedback.className = 'btd-feedback incorrect';
          feedback.textContent = 'Пока неверно. Попробуй ещё раз!';
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');

          if (task.options) {
            const selectedBtn = optionsList.querySelector('.btd-option-btn.selected');
            if (selectedBtn) {
              selectedBtn.classList.add('is-incorrect');
            }
          }

          explBox.style.display = 'none';
          input.select();
        }
      };

      // Быстрая смена задания стрелками клавиатуры
      document.addEventListener('keydown', (e) => {
        if (!dialog.open) return;
        if (document.activeElement === document.getElementById('btd-input')) return;
        if (e.key === 'ArrowLeft' && currentTopic && currentTaskIdx > 0) {
          renderTaskInModal(currentTaskIdx - 1);
        } else if (e.key === 'ArrowRight' && currentTopic && currentTaskIdx < currentTopic.tasks.length - 1) {
          renderTaskInModal(currentTaskIdx + 1);
        }
      });
    }

    return dialog;
  }

  function openTopicModal(topicId, startTaskIdx) {
    if (typeof BankTasksData === 'undefined') return;
    const topic = BankTasksData.getTopicById(topicId);
    if (!topic || !topic.tasks || topic.tasks.length === 0) {
      alert('Задания по этой теме готовятся к публикации.');
      return;
    }

    const dialog = initTaskModal();
    currentTopic = topic;
    currentTaskIdx = typeof startTaskIdx === 'number' ? startTaskIdx : 0;

    // Заполнение метаинформации
    document.getElementById('btd-subject').textContent = topic.subjectLabel || 'Задания';
    document.getElementById('btd-class').textContent = (topic.class === '10-11' ? '10–11' : topic.class) + ' класс';
    document.getElementById('btd-level').textContent = topic.level === 'easy' ? 'Лёгкий' : (topic.level === 'hard' ? 'Сложный' : 'Средний');
    document.getElementById('btd-level').className = 'btd-badge level-' + topic.level;
    document.getElementById('btd-title').textContent = topic.title;
    document.getElementById('btd-total-num').textContent = topic.tasks.length;

    const testBadge = document.getElementById('btd-badge-test');
    if (testBadge) {
      testBadge.style.display = topic.isTest ? 'inline-flex' : 'none';
    }

    renderTaskInModal(currentTaskIdx);
    dialog.showModal();
  }

  function renderTaskInModal(idx) {
    if (!currentTopic || !currentTopic.tasks[idx]) return;
    currentTaskIdx = idx;
    const task = currentTopic.tasks[idx];
    const total = currentTopic.tasks.length;

    document.getElementById('btd-cur-num').textContent = idx + 1;

    // Обновление URL
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('topic', currentTopic.id);
      url.searchParams.set('task', idx + 1);
      window.history.replaceState(null, '', url.pathname + url.search + (url.hash || ''));
    } catch (e) {}

    // Иллюстрация
    const imgWrap = document.getElementById('btd-illustration-wrap');
    const imgEl = document.getElementById('btd-illustration');
    if (task.image) {
      const cleanPath = task.image.replace(/^(\.\.\/|\.\/)+/, '');
      imgEl.src = (task.image.startsWith('http') || task.image.startsWith('/')) ? task.image : cleanPath;
      imgWrap.style.display = 'block';
    } else {
      imgWrap.style.display = 'none';
      imgEl.src = '';
    }

    // Текст задания
    const textEl = document.getElementById('btd-text');
    textEl.innerHTML = task.html || `<p class="task-text">${task.text}</p>`;

    // Единица измерения
    const unitEl = document.getElementById('btd-unit');
    unitEl.textContent = task.unit || '';

    // Сброс формы ответа
    const input = document.getElementById('btd-input');
    const inputLabel = document.getElementById('btd-input-label');
    const feedback = document.getElementById('btd-feedback');
    const explBox = document.getElementById('btd-explanation-box');
    const optionsWrap = document.getElementById('btd-options-wrap');
    const optionsList = document.getElementById('btd-options-list');
    const addToHwBtn = document.getElementById('btd-add-to-hw-btn');

    input.value = '';
    input.className = 'btd-input';
    feedback.textContent = '';
    feedback.className = 'btd-feedback';
    explBox.style.display = 'none';
    explBox.innerHTML = '';

    // Проверка, добавлена ли задача уже в черновик Д/З
    if (addToHwBtn) {
      try {
        const raw = localStorage.getItem('teacher_hw_draft_tasks');
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list) && list.some(t => (t.bankTaskId && t.bankTaskId === task.id) || t.id === task.id)) {
          addToHwBtn.textContent = '✓ Уже в Д/З';
          addToHwBtn.classList.add('added');
        } else {
          addToHwBtn.textContent = '➕ В домашнее задание';
          addToHwBtn.classList.remove('added');
        }
      } catch (e) {}
    }

    // Проверка, решена ли задача ранее
    const solvedSet = getSolvedSet();
    const isSolved = solvedSet.has(task.id);

    // Обработка вариантов ответа (для тестов по физике и др.)
    if (task.options && Array.isArray(task.options) && task.options.length > 0) {
      optionsWrap.style.display = 'block';
      inputLabel.textContent = 'Твой вариант (выбери выше или введи цифру):';
      input.placeholder = 'Номер варианта (1, 2, 3, 4)';

      const letters = ['А', 'Б', 'В', 'Г', 'Д'];
      optionsList.innerHTML = task.options.map((opt, i) => {
        const letter = letters[i] || (i + 1);
        const isThisCorrect = isSolved && (i === task.correctIndex);
        return `
          <button type="button" class="btd-option-btn${isThisCorrect ? ' is-correct' : ''}" data-opt-idx="${i}" role="radio" aria-checked="${isThisCorrect}">
            <span class="btd-opt-letter">${letter}</span>
            <span class="btd-opt-text">${opt}</span>
          </button>
        `;
      }).join('');
    } else {
      optionsWrap.style.display = 'none';
      optionsList.innerHTML = '';
      inputLabel.textContent = 'Твой ответ:';
      input.placeholder = 'Введи ответ';
    }

    if (isSolved) {
      feedback.className = 'btd-feedback correct';
      feedback.textContent = '✓ Задание уже выполнено';
      if (task.explanation) {
        explBox.innerHTML = `<strong>💡 Пояснение к решению:</strong><br>${task.explanation}`;
        explBox.style.display = 'block';
      }
    }

    // Кнопки навигации
    const prevBtn = document.getElementById('btd-prev-btn');
    const nextBtn = document.getElementById('btd-next-btn');
    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === total - 1);

    updatePillsStatus();
    setTimeout(() => {
      if (!task.options) {
        input.focus();
      }
    }, 60);
  }

  function updatePillsStatus() {
    if (!currentTopic) return;
    const pillsScroll = document.getElementById('btd-pills-scroll');
    const solvedSet = getSolvedSet();
    let solvedCount = 0;

    const html = currentTopic.tasks.map((t, i) => {
      const isSolved = solvedSet.has(t.id);
      if (isSolved) solvedCount++;
      const isActive = (i === currentTaskIdx);
      return `
        <button type="button" class="btd-pill${isActive ? ' active' : ''}${isSolved ? ' solved' : ''}" data-task-idx="${i}" role="tab" aria-selected="${isActive}">
          ${isSolved ? '✓ ' : ''}${i + 1}
        </button>
      `;
    }).join('');

    pillsScroll.innerHTML = html;

    const activePill = pillsScroll.querySelector('.btd-pill.active');
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const progEl = document.getElementById('btd-topic-progress');
    if (progEl) {
      progEl.textContent = `Решено: ${solvedCount} из ${currentTopic.tasks.length}`;
    }
  }

  function updateTopicCardBadges() {
    if (typeof BankTasksData === 'undefined') return;
    const solvedSet = getSolvedSet();

    BankTasksData.topics.forEach(topic => {
      let solvedCount = 0;
      topic.tasks.forEach(t => {
        if (solvedSet.has(t.id)) solvedCount++;
      });

      const cards = document.querySelectorAll(`[data-card-topic-id="${topic.id}"]`);
      cards.forEach(card => {
        let badge = card.querySelector('.topic-solved-badge');
        if (!badge) {
          const meta = card.querySelector('.card-meta');
          if (meta) {
            badge = document.createElement('span');
            badge.className = 'topic-solved-badge';
            meta.appendChild(badge);
          }
        }
        if (badge) {
          if (solvedCount > 0) {
            badge.style.display = 'inline-flex';
            badge.textContent = `✓ ${solvedCount}/${topic.tasks.length}`;
          } else {
            badge.style.display = 'none';
          }
        }
      });
    });
  }

  // Экспорт раннера
  window.BankTasksRunner = {
    openTopicModal: openTopicModal,
    getSolvedSet: getSolvedSet,
    markTaskSolved: markTaskSolved,
    updateTopicCardBadges: updateTopicCardBadges,
    initTaskModal: initTaskModal,
    convertBankTaskToHomeworkTask: convertBankTaskToHomeworkTask
  };

  // Инициализация при загрузке DOM
  document.addEventListener('DOMContentLoaded', () => {
    initTaskModal();
    updateTopicCardBadges();

    const urlParams = new URLSearchParams(window.location.search);
    const topicParam = urlParams.get('topic');
    const taskParam = urlParams.get('task');
    if (topicParam) {
      const startIdx = taskParam ? parseInt(taskParam, 10) - 1 : 0;
      setTimeout(() => openTopicModal(topicParam, isNaN(startIdx) ? 0 : startIdx), 250);
    }
  });

})();
