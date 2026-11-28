/**
 * oge_marathon_engine.js
 * Движок режима «Марафон Линия» для подготовки к ОГЭ по математике.
 * Поддерживает автогенерацию очередей без повторов, Sudden Death проверку,
 * учёт времени, сохранение личных рекордов и звуковые эффекты через Web Audio API.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OgeMarathonEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'oge_marathon_line_records_v1';

  // Конфигурация заданий ОГЭ
  const TASKS_CONFIG = [
    {
      id: '1_5',
      taskNum: '1–5',
      title: 'Практические задачи (Шины, План, Печи)',
      count: 25,
      active: false,
      icon: '🏠',
      desc: 'Блок прикладных задач ОГЭ: планы квартир, участков, печи, шины, тарифы.'
    },
    {
      id: 6,
      taskNum: 6,
      title: 'Числа и вычисления',
      count: 30,
      active: true,
      icon: '➗',
      trainer: 'OgeTask6Trainer',
      category: 'mixed_all',
      desc: 'Все типы действий с обыкновенными и десятичными дробями, составные дроби и степени 10.'
    },
    {
      id: 7,
      taskNum: 7,
      title: 'Координатная прямая и неравенства',
      count: 30,
      active: true,
      icon: '📏',
      trainer: 'OgeTask7Trainer',
      category: 'mixed_all',
      desc: 'Сравнение чисел, оценка корней, числовые промежутки и взаимное расположение точек на оси.'
    },
    {
      id: 8,
      taskNum: 8,
      title: 'Числа, степени и корни',
      count: 30,
      active: true,
      icon: '📐',
      trainer: 'OgeTask8Trainer',
      category: 'mixed_all',
      desc: 'Свойства степеней, преобразование квадратных корней, формулы сокращённого умножения.'
    },
    {
      id: 9,
      taskNum: 9,
      title: 'Уравнения и системы уравнений',
      count: 25,
      active: true,
      icon: '⚖️',
      trainer: 'OgeTask9Trainer',
      category: 'mixed_all',
      desc: 'Линейные, квадратные и неполные квадратные уравнения, дробно-рациональные уравнения, системы.'
    },
    {
      id: 10,
      taskNum: 10,
      title: 'Теория вероятностей',
      count: 30,
      active: true,
      icon: '🎲',
      trainer: 'OgeTask10Trainer',
      category: 'mixed_all',
      desc: 'Классическое определение вероятности, случайные события, жеребьёвки, контроль качества.'
    },
    {
      id: 11,
      taskNum: 11,
      title: 'Графики функций',
      count: 25,
      active: true,
      icon: '📈',
      trainer: 'OgeTask11Trainer',
      category: 'mixed_all',
      desc: 'Параболы, гиперболы, прямые линии, знаки коэффициентов k, b, a, c и сопоставление формул.'
    },
    {
      id: 12,
      taskNum: 12,
      title: 'Расчёты по формулам',
      count: 25,
      active: false,
      icon: '🧪',
      desc: 'Физические и геометрические формулы, подстановка значений и выражение неизвестных.'
    },
    {
      id: 13,
      taskNum: 13,
      title: 'Неравенства и системы неравенств',
      count: 25,
      active: true,
      icon: '⚡',
      trainer: 'OgeTask13Trainer',
      category: 'mixed_all',
      desc: 'Линейные и квадратные неравенства, системы неравенств, метод интервалов и числовые оси.'
    },
    {
      id: 14,
      taskNum: 14,
      title: 'Прогрессии',
      count: 25,
      active: false,
      icon: '🪜',
      desc: 'Арифметическая и геометрическая прогрессии, формулы n-го члена и суммы членов.'
    },
    {
      id: 15,
      taskNum: 15,
      title: 'Треугольники и многоугольники',
      count: 25,
      active: false,
      icon: '🔺',
      desc: 'Свойства треугольников, параллелограммов, трапеций, углы и соотношения сторон.'
    },
    {
      id: 16,
      taskNum: 16,
      title: 'Окружность, круг и их элементы',
      count: 25,
      active: false,
      icon: '⭕',
      desc: 'Центральные и вписанные углы, касательные, хорды, описанные и вписанные окружности.'
    },
    {
      id: 17,
      taskNum: 17,
      title: 'Площади фигур',
      count: 25,
      active: true,
      icon: '🟩',
      trainer: 'OgeTask17Trainer',
      category: 'mixed_all',
      desc: 'Формулы площадей и углы треугольников, прямоугольников, трапеций, ромбов и параллелограммов.'
    },
    {
      id: 18,
      taskNum: 18,
      title: 'Фигуры на клетчатой бумаге',
      count: 30,
      active: true,
      icon: '🔷',
      trainer: 'OgeTask18Trainer',
      category: 'mixed_all',
      desc: 'Площади фигур на решётке 1×1, тангенсы углов, средние линии и расстояния между точками.'
    },
    {
      id: 19,
      taskNum: 19,
      title: 'Анализ геометрических высказываний',
      count: 25,
      active: true,
      icon: '📐',
      trainer: 'OgeTask19Trainer',
      category: 'all',
      desc: 'Определение верных и неверных утверждений по планиметрии (треугольники, четырёхугольники, окружности, площади).'
    },
    {
      id: 20,
      taskNum: 20,
      title: 'Уравнения, неравенства и системы (Часть 2)',
      count: 15,
      active: true,
      icon: '🧮',
      trainer: 'OgeTask20Trainer',
      category: 'mixed_all',
      desc: 'Задания повышенного уровня сложности на 2 балла: биквадратные уравнения, системы, метод интервалов.'
    },
    {
      id: 22,
      taskNum: 22,
      title: 'Графики функций с параметром (Часть 2)',
      count: 10,
      active: true,
      icon: '📉',
      trainer: 'OgeTask22Trainer',
      category: 'all',
      desc: 'Задания повышенного уровня на 2 балла: кусочные функции, гиперболы, выколотые точки, исследование параметров.'
    },
    {
      id: 'part2_other',
      taskNum: '21, 23–25',
      title: 'Остальные задания Части 2',
      count: 15,
      active: false,
      icon: '🔥',
      desc: 'Текстовые задачи на движение/работу и геометрические задачи на вычисление и доказательство.'
    }
  ];

  function getTasksConfig() {
    return TASKS_CONFIG;
  }

  function getTaskConfig(taskNum) {
    const num = Number(taskNum);
    return TASKS_CONFIG.find(t => t.id === num || t.taskNum === taskNum || t.taskNum === num) || null;
  }

  // Генерация уникального отпечатка задачи для предотвращения дубликатов
  function getTaskFingerprint(task) {
    if (!task) return '';
    const qHtml = (task.questionHtml || '').replace(/\s+/g, ' ').trim();
    const txt = (task.text || '').replace(/\s+/g, ' ').trim();
    const ans = String(task.answer !== undefined ? task.answer : '');
    const svgSub = task.svg ? task.svg.substring(0, 100) : '';
    return `${qHtml}__${txt}__${ans}__${svgSub}`;
  }

  // Построение очереди марафона без повторов
  function generateMarathonQueue(taskNum) {
    const config = getTaskConfig(taskNum);
    if (!config) {
      throw new Error(`Задание №${taskNum} не найдено в конфигурации.`);
    }
    if (!config.active) {
      throw new Error(`Марафон по заданию №${taskNum} временно закрыт.`);
    }

    // Доступ к объекту тренажёра (в браузере через window/root, в тестах через require/root)
    let trainer = null;
    if (typeof window !== 'undefined' && window[config.trainer]) {
      trainer = window[config.trainer];
    } else if (typeof self !== 'undefined' && self[config.trainer]) {
      trainer = self[config.trainer];
    } else if (typeof root !== 'undefined' && root[config.trainer]) {
      trainer = root[config.trainer];
    } else {
      try {
        trainer = require('./' + config.trainer.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + '.js');
      } catch (e) {
        // Пробуем прямое соответствие файлу
        try {
          trainer = require('./oge_task_' + config.id + '_trainer.js');
        } catch (e2) {}
      }
    }

    if (!trainer || typeof trainer.generateTask !== 'function') {
      throw new Error(`Генератор ${config.trainer} для задания №${taskNum} не загружен.`);
    }

    const queue = [];
    const seenFingerprints = new Set();
    let attempts = 0;
    const maxAttempts = config.count * 40; // щедрый лимит генерации

    while (queue.length < config.count && attempts < maxAttempts) {
      attempts++;
      const task = trainer.generateTask(config.category || 'mixed_all');
      const fp = getTaskFingerprint(task);

      if (!seenFingerprints.has(fp)) {
        seenFingerprints.add(fp);
        queue.push({
          ...task,
          taskNumber: config.taskNum,
          stepIndex: queue.length + 1,
          totalSteps: config.count
        });
      }
    }

    if (queue.length < config.count) {
      console.warn(`Удалось сгенерировать ${queue.length} из ${config.count} уникальных задач за ${attempts} попыток.`);
    }

    return queue;
  }

  // Проверка ответа пользователя
  function checkTaskAnswer(taskNum, userRaw, taskObj) {
    const config = getTaskConfig(taskNum);
    if (!config || !config.active) return false;

    let trainer = null;
    if (typeof window !== 'undefined' && window[config.trainer]) {
      trainer = window[config.trainer];
    } else if (typeof self !== 'undefined' && self[config.trainer]) {
      trainer = self[config.trainer];
    } else if (typeof root !== 'undefined' && root[config.trainer]) {
      trainer = root[config.trainer];
    } else {
      try {
        trainer = require('./' + config.trainer.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + '.js');
      } catch (e) {
        try {
          trainer = require('./oge_task_' + config.id + '_trainer.js');
        } catch (e2) {}
      }
    }

    if (!trainer || typeof trainer.checkAnswer !== 'function') {
      console.error('Trainer checkAnswer not found for task', taskNum);
      return false;
    }

    const strUser = String(userRaw !== undefined && userRaw !== null ? userRaw : '').trim();

    // Задания с объектом задачи в checkAnswer
    if (config.id === 19 || config.id === 20 || config.id === 22) {
      const res = trainer.checkAnswer(strUser, taskObj);
      if (typeof res === 'boolean') return res;
      if (res && typeof res === 'object') return !!res.isCorrect;
      return false;
    }

    // Особые параметры для задания №11 (передаём taskType)
    if (config.id === 11) {
      return trainer.checkAnswer(strUser, taskObj.answer, taskObj.type);
    }

    return trainer.checkAnswer(strUser, taskObj.answer);
  }

  // --- ХРАНИЛИЩЕ РЕКОРДОВ И ПРОГРЕССА (LOCALSTORAGE) ---

  function getRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }

  function getTaskRecord(taskNum) {
    const records = getRecords();
    const config = getTaskConfig(taskNum);
    const key = config ? String(config.id) : String(taskNum);
    return records[key] || {
      maxStreak: 0,
      completed: false,
      bestTimeMs: null,
      totalAttempts: 0,
      victories: 0,
      lastDate: null
    };
  }

  function recordRunResult(taskNum, isCompleted, streakReached, timeElapsedMs) {
    const config = getTaskConfig(taskNum);
    const key = config ? String(config.id) : String(taskNum);
    const records = getRecords();
    const prev = records[key] || {
      maxStreak: 0,
      completed: false,
      bestTimeMs: null,
      totalAttempts: 0,
      victories: 0,
      lastDate: null
    };

    const newAttempts = (prev.totalAttempts || 0) + 1;
    const newMaxStreak = Math.max(prev.maxStreak || 0, streakReached);
    let newCompleted = prev.completed || isCompleted;
    let newVictories = (prev.victories || 0) + (isCompleted ? 1 : 0);
    let newBestTime = prev.bestTimeMs;

    if (isCompleted) {
      if (!newBestTime || timeElapsedMs < newBestTime) {
        newBestTime = timeElapsedMs;
      }
    }

    records[key] = {
      maxStreak: newMaxStreak,
      completed: newCompleted,
      bestTimeMs: newBestTime,
      totalAttempts: newAttempts,
      victories: newVictories,
      lastDate: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save marathon records:', e);
    }

    // Если забег завершён успешно (победа) — начисляем XP
    if (isCompleted) {
      const bonusXp = (config && config.count >= 30) ? 200 : 150;
      addXp(bonusXp);
    }

    return records[key];
  }

  function addXp(amount) {
    try {
      const cur = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
      const updated = cur + amount;
      localStorage.setItem('user_xp', String(updated));
      // Оповещаем другие компоненты
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('studySiteXpChanged', { detail: { xp: updated, added: amount } }));
      }
      return updated;
    } catch (e) {
      return 0;
    }
  }

  function formatTime(ms) {
    if (!ms || ms < 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // --- ЗВУКОВОЙ СИНТЕЗАТОР (WEB AUDIO API) ---

  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function toggleAudio(enable) {
    if (enable !== undefined) {
      audioEnabled = !!enable;
    } else {
      audioEnabled = !audioEnabled;
    }
    return audioEnabled;
  }

  function isAudioEnabled() {
    return audioEnabled;
  }

  function playTone(freq, type, duration, gainVal = 0.1) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playSuccessSound() {
    if (!audioEnabled) return;
    try {
      initAudio();
      playTone(523.25, 'sine', 0.12, 0.08); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.18, 0.09), 80); // E5
      setTimeout(() => playTone(783.99, 'sine', 0.22, 0.1), 160); // G5
    } catch (e) {}
  }

  function playBreakSound() {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      // Звук разрыва струны / падения
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  function playVictoryFanfare() {
    if (!audioEnabled) return;
    try {
      initAudio();
      const notes = [
        { f: 523.25, d: 0.15, wait: 0 },
        { f: 659.25, d: 0.15, wait: 120 },
        { f: 783.99, d: 0.20, wait: 240 },
        { f: 1046.50, d: 0.45, wait: 400 }
      ];
      notes.forEach(n => {
        setTimeout(() => playTone(n.f, 'triangle', n.d, 0.12), n.wait);
      });
    } catch (e) {}
  }

  return {
    getTasksConfig,
    getTaskConfig,
    generateMarathonQueue,
    checkTaskAnswer,
    getRecords,
    getTaskRecord,
    recordRunResult,
    addXp,
    formatTime,
    initAudio,
    toggleAudio,
    isAudioEnabled,
    playSuccessSound,
    playBreakSound,
    playVictoryFanfare
  };
}));
