/**
 * ==============================================================================
 * ГЕНШИНОВЕДЕНИЕ · КАФЕДРА ЛОРА ТЕЙВАТА
 * Образовательный проект «НЕШКОЛА»
 * 
 * ПОЛНЫЙ ФРОНТЕНД-ДВИЖОК СТРАНИЦЫ (Site of the Day Quality Bar):
 * 1. Интерактивная физика SVG-Астролябии (#astrolabe-figure) с дешифровкой текста (Scramble)
 * 2. Синтез гармонических звуковых волн через Web Audio API (без внешних аудиофайлов)
 * 3. Симулятор молитв с честной системой гаранта (10 круток), 50/50 и скам-дропом Чичи С7
 * 4. Академический экзаменационный терминал с горячими клавишами 1-4, цитированием канона и анимацией начисления примогемов
 * 5. Кодекс Тейвата с плавным переключением и WAI-ARIA доступностью
 * ==============================================================================
 */

(function initGenshinAwwwardsEngine() {
  'use strict';

  // --- 1. ASTRONOMICAL FREQUENCY & PROJECTION CONSTANTS ---
  const P = {
    origin: [420, 287.7823],
    scale: 1.133908,
    sinA: Math.sin(44 * Math.PI / 180),
    cosA: Math.cos(44 * Math.PI / 180),
    sinE: Math.sin(30 * Math.PI / 180),
    cosE: Math.cos(30 * Math.PI / 180)
  };

  function project(x, y, z) {
    const k = P.scale;
    const sx = P.origin[0] + (x * P.sinA - y * P.cosA) * k;
    const sy = P.origin[1] + ((x * P.cosA + y * P.sinA) * P.sinE - z * P.cosE) * k;
    return [sx, sy];
  }

  // 7 Elemental Resonance Calibration Points
  const ELEMENTS_SPECTRUM = [
    {
      idx: 0,
      regionId: 'mondstadt',
      name: 'Мондштадт',
      element: 'Анемо',
      symbol: '🍃',
      archon: 'Барбатос (Венти)',
      wavelength: '510.4 nm',
      frequency: '587.4 THz',
      color: '#4fe3c1',
      audioFreq: 440.0, // A4
      angle: 0.0
    },
    {
      idx: 1,
      regionId: 'liyue',
      name: 'Ли Юэ',
      element: 'Гео',
      symbol: '🔶',
      archon: 'Моракс (Чжун Ли)',
      wavelength: '589.2 nm',
      frequency: '508.8 THz',
      color: '#e5b042',
      audioFreq: 261.63, // C4
      angle: (1 / 7) * Math.PI * 2
    },
    {
      idx: 2,
      regionId: 'inazuma',
      name: 'Инадзума',
      element: 'Электро',
      symbol: '⚡',
      archon: 'Райдэн Эи',
      wavelength: '425.0 nm',
      frequency: '705.4 THz',
      color: '#bf6ffb',
      audioFreq: 329.63, // E4
      angle: (2 / 7) * Math.PI * 2
    },
    {
      idx: 3,
      regionId: 'sumeru',
      name: 'Сумеру',
      element: 'Дендро',
      symbol: '🌿',
      archon: 'Нахида (Кусанали)',
      wavelength: '542.1 nm',
      frequency: '553.0 THz',
      color: '#58c734',
      audioFreq: 392.00, // G4
      angle: (3 / 7) * Math.PI * 2
    },
    {
      idx: 4,
      regionId: 'fontaine',
      name: 'Фонтейн',
      element: 'Гидро',
      symbol: '💧',
      archon: 'Фокалорс & Нёвиллет',
      wavelength: '468.5 nm',
      frequency: '640.0 THz',
      color: '#3898ec',
      audioFreq: 293.66, // D4
      angle: (4 / 7) * Math.PI * 2
    },
    {
      idx: 5,
      regionId: 'natlan',
      name: 'Натлан',
      element: 'Пиро',
      symbol: '🔥',
      archon: 'Мавуика',
      wavelength: '650.0 nm',
      frequency: '461.2 THz',
      color: '#ef5a38',
      audioFreq: 349.23, // F4
      angle: (5 / 7) * Math.PI * 2
    },
    {
      idx: 6,
      regionId: 'snezhnaya',
      name: 'Снежная',
      element: 'Крио',
      symbol: '❄️',
      archon: 'Царица & Предвестники',
      wavelength: '488.0 nm',
      frequency: '614.3 THz',
      color: '#7ce8ff',
      audioFreq: 493.88, // B4
      angle: (6 / 7) * Math.PI * 2
    }
  ];

  // --- 2. WEB AUDIO API SYNTHESIZER ---
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

  // Harmonic chime on element calibration
  function playElementChime(frequency = 440) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(frequency * 2, now + 0.4);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  // Rarity audio cues for Wish Simulator
  function playWishDropSound(rarity = 3, isQiqi = false) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (isQiqi) {
        // Melancholy comical minor second slide for Qiqi 50/50 loss
        const freqs = [392.00, 369.99, 349.23, 311.13];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          gain.gain.setValueAtTime(0.06, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.5);
        });
        return;
      }

      if (rarity === 5) {
        // Blinding 6-tone celestial major chord with shimmer
        [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.08, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 1.6);
        });
      } else if (rarity === 4) {
        // Vibrant 3-tone amethyst chime
        [440.00, 554.37, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.09, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.0);
        });
      } else {
        // Crisp 3★ wooden club tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  }

  // Answer feedback audio cues
  function playAnswerFeedbackSound(isCorrect) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(146.83, now + 0.25);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (isCorrect ? 0.45 : 0.35));
    } catch (e) {}
  }

  // --- 3. SCRAMBLE TEXT ENGINE (AKASHA CYPHER) ---
  const GLYPHS = ['✦', '◈', '◊', '⟡', '✧', '⬡', '⬢', '0', '1', 'λ', 'Ω', 'Ψ', 'Σ', 'X', 'Z'];
  let scrambleFrameId = null;

  function scrambleText(element, finalText, duration = 400) {
    if (!element) return;
    if (scrambleFrameId) cancelAnimationFrame(scrambleFrameId);

    const startTime = performance.now();
    const length = finalText.length;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolvedCount = Math.floor(progress * length);

      let result = '';
      for (let i = 0; i < length; i++) {
        if (i < resolvedCount) {
          result += finalText[i];
        } else if (finalText[i] === ' ' || finalText[i] === '[' || finalText[i] === ']' || finalText[i] === '/') {
          result += finalText[i];
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      element.textContent = result;

      if (progress < 1) {
        scrambleFrameId = requestAnimationFrame(frame);
      } else {
        element.textContent = finalText;
      }
    }
    scrambleFrameId = requestAnimationFrame(frame);
  }

  // --- 4. ASTROLABE LIVE CONTROLLER & PHYSICS (#astrolabe-figure) ---
  let activeElementIdx = 0;
  let currentAngle = 0;
  let targetAngle = 0;
  let currentCarriageOffset = 0;
  let targetCarriageOffset = 0;
  let isVernierDragging = false;

  const DIAL_CENTER = [45, 10];
  const DIAL_R = 38;
  const DIAL_TOP = 87;

  function computeNeedleD(angleRad) {
    const [x, y] = DIAL_CENTER;
    const tipLen = DIAL_R - 5;
    const tailLen = 9;
    const nx = x + Math.cos(angleRad) * tipLen;
    const ny = y + Math.sin(angleRad) * tipLen;
    const tx = x - Math.cos(angleRad) * tailLen;
    const ty = y - Math.sin(angleRad) * tailLen;

    const p1 = project(tx, ty, DIAL_TOP + 4.2);
    const p2 = project(nx, ny, DIAL_TOP + 4.2);
    return `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  function setAstrolabeElement(idx, playSound = true) {
    const elem = ELEMENTS_SPECTRUM[idx];
    if (!elem) return;
    activeElementIdx = idx;
    targetAngle = elem.angle;

    // Carriage moves along rails from left to right: idx 0..6 mapped to normalized offset -1..+1
    const t = (idx - 3) / 3; // -1 to +1
    targetCarriageOffset = t * 24; // world coordinate shift

    // Update active pill UI
    document.querySelectorAll('#astrolabe-pills-row .element-pill-btn').forEach(btn => {
      const bIdx = parseInt(btn.getAttribute('data-element-idx'), 10);
      btn.classList.toggle('active', bIdx === idx);
    });

    // Update Vernier range input if not currently user-dragging
    const slider = document.getElementById('astrolabe-vernier');
    if (slider && !isVernierDragging) {
      slider.value = String(idx);
    }

    // Dynamic Gnosis Core Glow CSS properties
    document.documentElement.style.setProperty('--gnosis-color', elem.color);
    document.documentElement.style.setProperty('--gnosis-glow', elem.color);

    // Live Readout with Scramble Text Effect (Requirement 2)
    const readout = document.getElementById('astrolabe-readout');
    if (readout) {
      const newReadoutText = `λ = ${elem.wavelength} [${elem.element.toUpperCase()} · ${elem.name.toUpperCase()}] // ${primogems} ✦ READY`;
      scrambleText(readout, newReadoutText, 350);
    }

    if (playSound) {
      playElementChime(elem.audioFreq);
    }
  }

  // Animation Loop for Smooth Astrolabe Needle & Carriage Easing
  function runAstrolabeLoop() {
    // Shortest angular path
    let diff = targetAngle - currentAngle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    if (Math.abs(diff) > 0.001) {
      currentAngle += diff * 0.15;
      const needle = document.getElementById('astrolabe-needle');
      if (needle) {
        needle.setAttribute('d', computeNeedleD(currentAngle));
      }
    }

    // Carriage translation along isometric rails
    const carriageDiff = targetCarriageOffset - currentCarriageOffset;
    if (Math.abs(carriageDiff) > 0.05) {
      currentCarriageOffset += carriageDiff * 0.14;
      const carriage = document.getElementById('astrolabe-carriage');
      if (carriage) {
        // Project world offset along isometric X rail
        const railDx = (currentCarriageOffset * P.sinA) * P.scale;
        const railDy = (currentCarriageOffset * P.cosA * P.sinE) * P.scale;
        carriage.style.transform = `translate3d(${railDx.toFixed(1)}px, ${railDy.toFixed(1)}px, 0)`;
      }
    }

    requestAnimationFrame(runAstrolabeLoop);
  }

  // --- 5. GACHA SIMULATOR WITH 50/50 & SCAM MECHANIC (#wish-overlay) ---
  const WISH_POOL_3STAR = [
    {
      title: 'Дубина переговоров (Р5 / С6)',
      rarity: 3,
      type: 'Оружие защиты диплома',
      quote: '«Главный аргумент на защите курсовой работы перед деканатом Академии Сумеру.»',
      icon: '🏏',
      color: '#70d6ff'
    },
    {
      title: 'Сгоревшая яичница Беннета',
      rarity: 3,
      type: 'Академический завтрак',
      quote: '«Воскрешает с 50 HP и накладывает несмываемый дебафф "Невезение до конца сессии".»',
      icon: '🍳',
      color: '#70d6ff'
    },
    {
      title: 'Справка об освобождении от физры',
      rarity: 3,
      type: 'Документ из Снежной',
      quote: '«Подписана лично Вторым Предвестником Дотторе. Действительна во всех шести даршанах.»',
      icon: '📜',
      color: '#70d6ff'
    },
    {
      title: 'Черноплодник (х1)',
      rarity: 3,
      type: 'Ресурс выживания',
      quote: '«Паймон пыталась это съесть. Академическая ценность стремится к абсолютному нулю.»',
      icon: '🫐',
      color: '#70d6ff'
    }
  ];

  const WISH_POOL_4STAR = [
    {
      title: 'Шпаргалка Аль-Хайтама',
      rarity: 4,
      type: 'Запретный артефакт',
      quote: '«Написана микротекстом на древнем руническом языке. Гарантирует зачет без посещения лекций.»',
      icon: '📑',
      color: '#c77dff'
    },
    {
      title: 'Долг Моны за аренду квартиры',
      rarity: 4,
      type: 'Астрологический чек',
      quote: '«Счет на 40,000 Моры. Гидромантия подтверждает: в кошельке абсолютный вакуум.»',
      icon: '💸',
      color: '#c77dff'
    },
    {
      title: 'С1 Эмбер (Скауты не сдаются)',
      rarity: 4,
      type: 'Кадр Ордо Фавониус',
      quote: '«Выпала вместо баннерной леги. Скаут готова осветить тернистый путь на пересдачу!»',
      icon: '🏹',
      color: '#c77dff'
    },
    {
      title: 'Трактат Сайно о каламбурах',
      rarity: 4,
      type: 'Оружие массового кринжа',
      quote: '«Убойная сила юмора генерала махаматра наносит 10,000 эмоционального урона комиссии.»',
      icon: '🃏',
      color: '#c77dff'
    }
  ];

  const WISH_POOL_5STAR_ARCHONS = [
    {
      title: 'Властелин Камня · Чжун Ли',
      rarity: 5,
      type: 'Гео Архонт · Контракт с деканатом',
      quote: '«Контракт на красный диплом заверен печатью Моракса. Не познает гнев камня тот, кто учил билеты.»',
      icon: '🔶',
      color: '#e5b042'
    },
    {
      title: 'Анемо Архонт · Барбатос (Венти)',
      rarity: 5,
      type: 'Бог Свободы · Зачёт автоматом',
      quote: '«Лети к ветрам свободы! Сессия закрыта автоматом под аккорды лиры Святого Ветрокрыла!»',
      icon: '🍃',
      color: '#4fe3c1'
    },
    {
      title: 'Сёгун Райдэн · Эи',
      rarity: 5,
      type: 'Электро Архонт · Владычица Сессии',
      quote: '«Вечность — это очередь на пересдачу. Но сегодня клинок Мусо но Хитотати рассек все твои академические долги!»',
      icon: '⚡',
      color: '#bf6ffb'
    },
    {
      title: 'Малая владычица Кусанали · Нахида',
      rarity: 5,
      type: 'Дендро Архонт · Слив КИМов Акаши',
      quote: '«Древо Ирминсуль синхронизировано. Все билеты известны заранее благодаря мудрости Акаши!»',
      icon: '🌿',
      color: '#58c734'
    },
    {
      title: 'Верховный судья Фонтейна · Нёвиллет',
      rarity: 5,
      type: 'Суверен Вод · Оправдательный приговор',
      quote: '«Именем Оратрис Меканик д’Анализ Кардиналь студент оправдан по всем статьям академической неуспеваемости!»',
      icon: '💧',
      color: '#3898ec'
    },
    {
      title: 'Пиро Архонт · Мавуика',
      rarity: 5,
      type: 'Владычица Войны · Штурм ГОСов',
      quote: '«Пламя нашей веры не погаснет даже в ночь перед экзаменом! Экзамен взят штурмом на высший балл!»',
      icon: '🔥',
      color: '#ef5a38'
    }
  ];

  const WISH_POOL_5STAR_SCAM = {
    title: 'Чича С7 (Билет на пересдачу в августе)',
    rarity: 5,
    isQiqi: true,
    type: 'Великий Скам 50/50 · Зомби из хижины Бубу',
    quote: '«"Чича здесь... Забыла формулы... Забыла конспект... Увидимся в конце лета на комиссии..." — Qiqi»',
    icon: '🧟‍♀️',
    color: '#98c1d9'
  };

  // State Management
  let primogems = parseInt(localStorage.getItem('genshin_primogems') || '1600', 10);
  let pityCount = parseInt(localStorage.getItem('genshin_pity_count') || '0', 10);
  let guaranteedWon = localStorage.getItem('genshin_guaranteed_won') === 'true';

  function updateWishUI() {
    const primoDisplay = document.getElementById('primo-counter');
    if (primoDisplay) primoDisplay.textContent = `${primogems} ✦`;
    try {
      localStorage.setItem('genshin_primogems', String(primogems));
      localStorage.setItem('genshin_pity_count', String(pityCount));
      localStorage.setItem('genshin_guaranteed_won', String(guaranteedWon));
    } catch (e) {}
  }

  // Post-ironic Academic Alert Banner (Zero window.alert)
  function showAcademicAlert(message) {
    let toast = document.getElementById('academic-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'academic-toast-notification';
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(-30px);
        background: linear-gradient(135deg, #1f1315 0%, #120a0d 100%);
        border: 1px solid #ef5a38;
        color: #ffd8d0;
        padding: 14px 28px;
        border-radius: 12px;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        z-index: 2000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(239,90,56,0.3);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        max-width: 90vw;
        text-align: center;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `⚠️ <strong>АКАДЕМИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ:</strong> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-30px)';
    }, 4500);
  }

  // Roll Gacha Loot Item
  function rollWishLoot() {
    pityCount++;

    // 5★ Chance: 5% base, 100% at 15+ wishes (soft/hard pity)
    const is5Star = pityCount >= 15 || Math.random() < 0.07;
    // 4★ Chance: guaranteed every 8 wishes, or 20%
    const is4Star = !is5Star && (pityCount % 8 === 0 || Math.random() < 0.22);

    if (is5Star) {
      pityCount = 0;
      // 50/50 System
      if (guaranteedWon || Math.random() >= 0.5) {
        guaranteedWon = false;
        const archon = WISH_POOL_5STAR_ARCHONS[Math.floor(Math.random() * WISH_POOL_5STAR_ARCHONS.length)];
        return archon;
      } else {
        // Lost 50/50 to Qiqi scam
        guaranteedWon = true; // Next 5★ guaranteed
        return WISH_POOL_5STAR_SCAM;
      }
    } else if (is4Star) {
      return WISH_POOL_4STAR[Math.floor(Math.random() * WISH_POOL_4STAR.length)];
    } else {
      return WISH_POOL_3STAR[Math.floor(Math.random() * WISH_POOL_3STAR.length)];
    }
  }

  // Execute Wish Action
  function performWish() {
    if (primogems < 160) {
      showAcademicAlert('Стипендия исчерпана! В кассе ноль Камней Истока. Сдайте зачёт по лору Тейвата для срочного фарма примогемов!');
      playAnswerFeedbackSound(false);
      return;
    }

    primogems -= 160;
    updateWishUI();

    // 1. Plunger spring compression physics animation
    const plunger = document.getElementById('astrolabe-plunger');
    if (plunger) {
      plunger.style.transition = 'transform 0.12s cubic-bezier(0.2, 0, 0.4, 1)';
      plunger.style.transform = 'translate3d(0, 16px, 0)';
      setTimeout(() => {
        plunger.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        plunger.style.transform = 'translate3d(0, -3px, 0)';
        setTimeout(() => {
          plunger.style.transform = 'translate3d(0, 0, 0)';
        }, 120);
      }, 150);
    }

    // 2. Roll loot
    const loot = rollWishLoot();
    const isQiqi = !!loot.isQiqi;

    // 3. Sound synthesis based on rarity
    playWishDropSound(loot.rarity, isQiqi);

    // 4. Meteor color trail adaptation
    const overlay = document.getElementById('wish-overlay');
    const meteor = document.getElementById('wish-meteor');
    const resultCard = document.getElementById('wish-result-card');

    if (overlay && meteor && resultCard) {
      // Clear previous meteor styling
      meteor.className = 'wish-meteor-star';
      if (loot.rarity === 5) {
        meteor.style.boxShadow = isQiqi 
          ? '0 0 35px #98c1d9, 0 0 70px #3d5a80, 0 0 100px #293241'
          : '0 0 35px #ffe599, 0 0 70px #ffb300, 0 0 120px #ff9100';
      } else if (loot.rarity === 4) {
        meteor.style.boxShadow = '0 0 30px #e0aaff, 0 0 65px #9d4edd, 0 0 90px #5a189a';
      } else {
        meteor.style.boxShadow = '0 0 25px #70d6ff, 0 0 50px #00a6fb, 0 0 80px #0582ca';
      }

      overlay.classList.add('active');
      resultCard.classList.remove('show');
      meteor.classList.add('falling');

      setTimeout(() => {
        meteor.classList.remove('falling');

        // Star rarity display
        const starsContainer = document.querySelector('.wish-loot-stars');
        if (starsContainer) {
          starsContainer.textContent = '★'.repeat(loot.rarity);
          starsContainer.style.color = loot.rarity === 5 ? (isQiqi ? '#98c1d9' : '#ffc107') : (loot.rarity === 4 ? '#c77dff' : '#70d6ff');
          starsContainer.style.textShadow = `0 0 14px ${loot.color}`;
        }

        document.getElementById('wish-loot-icon').textContent = loot.icon;
        document.getElementById('wish-loot-title').textContent = loot.title;
        document.getElementById('wish-loot-type').textContent = loot.type;
        document.getElementById('wish-loot-quote').textContent = loot.quote;
        resultCard.style.setProperty('--loot-accent', loot.color);
        resultCard.classList.add('show');
      }, 1350);
    }
  }

  // --- 6. EXAM TERMINAL ENGINE (#quiz-modal) ---
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

    if (quizTitle) quizTitle.textContent = activeQuizCategory.title;
    if (quizBadge) {
      quizBadge.textContent = `${activeQuizCategory.icon} ${activeQuizCategory.region}`;
      quizBadge.style.borderColor = activeQuizCategory.color;
      quizBadge.style.color = activeQuizCategory.color;
    }

    if (quizResultsView) quizResultsView.style.display = 'none';
    if (quizBodyView) quizBodyView.style.display = 'flex';

    renderCurrentQuestion();
    if (quizModal) {
      quizModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeQuiz() {
    if (quizModal) quizModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCurrentQuestion() {
    isAnswerSubmitted = false;
    const qData = currentQuestions[currentQIndex];
    if (!qData) {
      showQuizResults();
      return;
    }

    const total = currentQuestions.length;
    if (quizProgress) quizProgress.textContent = `Вопрос ${currentQIndex + 1} из ${total}`;
    const pct = (currentQIndex / total) * 100;
    if (quizProgressBar) quizProgressBar.style.width = `${pct}%`;

    if (quizQuestion) quizQuestion.textContent = qData.question;
    if (quizFeedback) {
      quizFeedback.className = 'quiz-feedback-box';
      quizFeedback.style.display = 'none';
    }
    if (quizNextBtn) quizNextBtn.disabled = true;

    // Shuffle options
    const options = [...qData.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    if (quizOptionsContainer) {
      quizOptionsContainer.innerHTML = '';
      options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.setAttribute('type', 'button');
        btn.innerHTML = `<span class="opt-num">${idx + 1}</span><span class="opt-text">${optText}</span>`;
        btn.addEventListener('click', () => handleOptionSelected(optText, qData.correct, btn));
        quizOptionsContainer.appendChild(btn);
      });
    }
  }

  function handleOptionSelected(chosen, correct, btnElement) {
    if (isAnswerSubmitted) return;
    isAnswerSubmitted = true;

    const isCorrect = chosen.trim().toLowerCase() === correct.trim().toLowerCase();
    const qData = currentQuestions[currentQIndex];

    const allBtns = quizOptionsContainer ? quizOptionsContainer.querySelectorAll('.quiz-option-btn') : [];
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
        playAnswerFeedbackSound(true);
      } else {
        btnElement.classList.add('wrong');
        playAnswerFeedbackSound(false);
      }
    }

    if (quizFeedback) {
      quizFeedback.style.display = 'block';
      const statusBox = document.getElementById('quiz-feedback-status');
      if (isCorrect) {
        quizFeedback.className = 'quiz-feedback-box correct';
        if (statusBox) statusBox.innerHTML = '<strong>Верно! +20 ✦ Камней Истока и +1,000 Моры</strong>';
      } else {
        quizFeedback.className = 'quiz-feedback-box wrong';
        if (statusBox) statusBox.innerHTML = `<strong>Неверно. Правильный ответ:</strong> ${correct}`;
      }
    }

    if (quizExplanation) {
      quizExplanation.innerHTML = `<em>Цитата из Ирминсуля:</em> ${qData.explanation}`;
    }

    if (quizNextBtn) {
      quizNextBtn.disabled = false;
      quizNextBtn.focus();
    }
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
    if (quizProgressBar) quizProgressBar.style.width = '100%';
    if (quizBodyView) quizBodyView.style.display = 'none';
    if (quizResultsView) quizResultsView.style.display = 'flex';

    const total = currentQuestions.length;
    const scorePct = Math.round((userScore / total) * 100);

    const earnedPrimos = userScore * 20;
    const earnedMora = userScore * 1000;
    const oldPrimos = primogems;
    primogems += earnedPrimos;
    updateWishUI();

    // Dynamic ticking count animation for rewards
    const scoreElem = document.getElementById('results-score-text');
    const percentElem = document.getElementById('results-percent-text');
    const primoRewardElem = document.getElementById('results-primo-reward');
    const moraRewardElem = document.getElementById('results-mora-reward');

    if (scoreElem) scoreElem.textContent = `${userScore} из ${total}`;
    if (percentElem) percentElem.textContent = `${scorePct}% правильных ответов`;

    if (primoRewardElem) {
      let count = 0;
      const step = Math.max(1, Math.floor(earnedPrimos / 20));
      const timer = setInterval(() => {
        count = Math.min(earnedPrimos, count + step);
        primoRewardElem.textContent = `+${count} ✦`;
        if (count >= earnedPrimos) clearInterval(timer);
      }, 30);
    }
    if (moraRewardElem) {
      moraRewardElem.textContent = `+${earnedMora.toLocaleString()} Моры`;
    }

    // Post-ironic Academic Ranks
    let verdict = '';
    let rankBadge = '';
    if (scorePct >= 90) {
      rankBadge = 'Звание: Секретарь Небесного Порядка (Ранг S / Красный диплом)';
      verdict = '«Поразительно! Твои познания равны мудрости древа Ирминсуль. Даже Академия Сумеру единогласно ставит зачёт автоматом!» — Нахида';
    } else if (scorePct >= 70) {
      rankBadge = 'Звание: Старший научный сотрудник Академии Сумеру (Ранг A)';
      verdict = '«Весьма достойно! Ты прекрасно ориентируешься в хрониках и законах Тейвата. Паймон в восторге и требует угощений!» — Паймон';
    } else if (scorePct >= 50) {
      rankBadge = 'Звание: Опытный странник с хвостами по матану (Ранг B)';
      verdict = '«Неплохо, путник. Но в глубинах Каэнри\'ах и залах Селестии скрыто куда больше тайн. Жду на факультативе!» — Дайнслейф';
    } else if (scorePct >= 30) {
      rankBadge = 'Звание: Ассистент стажёра Ордо Фавониус (Ранг C)';
      verdict = '«Эй, похоже, кто-то перепутал Анемокул с капустой! Прочитай справочник Тейвата перед экзаменом!» — Эмбер';
    } else {
      rankBadge = 'Звание: Хиличурл на пересдаче (Ранг F / Отчисление в Разлом)';
      verdict = '«Олух! Даже слаймы в лесу знают лор лучше. Марш на подготовительные курсы до конца лета!» — Скарамучча (Странник)';
    }

    const badgeElem = document.getElementById('results-rank-badge');
    const verdictElem = document.getElementById('results-verdict-quote');
    if (badgeElem) badgeElem.textContent = rankBadge;
    if (verdictElem) verdictElem.textContent = verdict;
  }

  // --- 7. CODEX OF TEYVAT ACCESSIBLE TABS (.codex-section) ---
  function setupCodexTabs() {
    const tabs = document.querySelectorAll('.codex-tab-btn');
    const panels = document.querySelectorAll('.codex-panel');

    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', `codex-tab-${tab.getAttribute('data-tab')}`);
      tab.setAttribute('aria-controls', `codex-panel-${tab.getAttribute('data-tab')}`);
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');

      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-hidden', 'true');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const targetId = tab.getAttribute('data-tab');
        const panel = document.getElementById(`codex-panel-${targetId}`);
        if (panel) {
          panel.classList.add('active');
          panel.setAttribute('aria-hidden', 'false');
          playElementChime(520);
        }
      });

      // Keyboard arrow navigation for tabs
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const dir = e.key === 'ArrowRight' ? 1 : -1;
          const nextIdx = (index + dir + tabs.length) % tabs.length;
          tabs[nextIdx].click();
          tabs[nextIdx].focus();
        }
      });
    });

    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', panel.classList.contains('active') ? 'false' : 'true');
    });
  }

  // --- 8. INITIALIZATION & EVENT BINDINGS ---
  document.addEventListener('DOMContentLoaded', () => {
    updateWishUI();
    setupCodexTabs();
    runAstrolabeLoop();

    // Default Astrolabe on Anemo Mondstadt
    setAstrolabeElement(0, false);

    // 1. Astrolabe Element Pill Buttons
    document.querySelectorAll('#astrolabe-pills-row .element-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-element-idx'), 10);
        setAstrolabeElement(idx);
      });
    });

    // 2. Astrolabe Vernier Range Slider (#astrolabe-vernier)
    const vernier = document.getElementById('astrolabe-vernier');
    if (vernier) {
      vernier.addEventListener('input', (e) => {
        isVernierDragging = true;
        const val = parseFloat(e.target.value);
        targetAngle = (val / 7) * Math.PI * 2;
        targetCarriageOffset = ((val - 3) / 3) * 24;
        const roundedIdx = Math.round(val) % 7;
        if (roundedIdx !== activeElementIdx) {
          setAstrolabeElement(roundedIdx, false);
        }
      });
      vernier.addEventListener('change', () => {
        isVernierDragging = false;
        setAstrolabeElement(activeElementIdx, true);
      });
    }

    // 3. Plunger Click & Wish Triggers
    const plungerGroup = document.getElementById('astrolabe-plunger');
    if (plungerGroup) {
      plungerGroup.addEventListener('click', performWish);
    }
    const wishBtn = document.getElementById('btn-make-wish');
    if (wishBtn) {
      wishBtn.addEventListener('click', performWish);
    }

    // Close Wish Overlay
    const wishCloseBtn = document.getElementById('btn-close-wish');
    if (wishCloseBtn) {
      wishCloseBtn.addEventListener('click', () => {
        const overlay = document.getElementById('wish-overlay');
        if (overlay) overlay.classList.remove('active');
      });
    }

    // 4. Region Cards: Synchronize with Astrolabe & Open Quiz
    document.querySelectorAll('[data-quiz-cat]').forEach(card => {
      const elemIdx = card.getAttribute('data-elem-idx');
      if (elemIdx !== null) {
        card.addEventListener('mouseenter', () => {
          const idx = parseInt(elemIdx, 10);
          setAstrolabeElement(idx, false);
        });
      }

      card.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = card.getAttribute('data-quiz-cat');
        if (elemIdx !== null) {
          const idx = parseInt(elemIdx, 10);
          setAstrolabeElement(idx, false);
        }
        openQuiz(cat);
      });
    });

    // 5. Quiz Modal Navigation & Hotkeys
    if (quizNextBtn) quizNextBtn.addEventListener('click', advanceQuestion);
    const modalCloseBtn = document.getElementById('quiz-modal-close');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeQuiz);

    const retakeBtn = document.getElementById('results-retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        if (activeQuizCategory) openQuiz(activeQuizCategory.id);
      });
    }
    const finishBtn = document.getElementById('results-finish-btn');
    if (finishBtn) finishBtn.addEventListener('click', closeQuiz);

    // Keyboard support: 1, 2, 3, 4 for options, Enter/Space for advance, Escape to close
    document.addEventListener('keydown', (e) => {
      if (quizModal && quizModal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeQuiz();
        } else if (!isAnswerSubmitted && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const btns = quizOptionsContainer ? quizOptionsContainer.querySelectorAll('.quiz-option-btn') : [];
          if (btns[idx]) btns[idx].click();
        } else if (isAnswerSubmitted && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          advanceQuestion();
        }
      }
    });
  });

})();
