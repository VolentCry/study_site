/**
 * Тренажёр по алгебре · 7 класс
 * «Многочлены: приведение подобных, сложение, вычитание, умножение
 * и вынесение общего множителя за скобки»
 *
 * Модуль генерации задач, проверки ответов и интеграции с платформой.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const exported = factory();
    module.exports = exported;
    if (root) root.PolynomialsTrainer = exported;
  } else {
    root.PolynomialsTrainer = factory();
  }
}(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randNonZero(min, max) {
    let val = 0;
    while (val === 0) {
      val = randInt(min, max);
    }
    return val;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // --- Форматирование одночленов ---

  function formatMonomialHtml(coeff, vars) {
    if (coeff === 0) return '0';

    const varKeys = Object.keys(vars || {}).filter(k => vars[k] > 0).sort();
    let varsHtml = '';
    for (const v of varKeys) {
      const exp = vars[v];
      if (exp === 1) {
        varsHtml += v;
      } else if (exp > 1) {
        varsHtml += `${v}<sup>${exp}</sup>`;
      }
    }

    if (!varsHtml) return String(coeff);
    if (coeff === 1) return varsHtml;
    if (coeff === -1) return '−' + varsHtml;
    const sign = coeff < 0 ? '−' : '';
    return `${sign}${Math.abs(coeff)}${varsHtml}`;
  }

  function formatMonomialText(coeff, vars) {
    if (coeff === 0) return '0';

    const varKeys = Object.keys(vars || {}).filter(k => vars[k] > 0).sort();
    let varsText = '';
    for (const v of varKeys) {
      const exp = vars[v];
      if (exp === 1) {
        varsText += v;
      } else if (exp > 1) {
        varsText += `${v}^${exp}`;
      }
    }

    if (!varsText) return String(coeff);
    if (coeff === 1) return varsText;
    if (coeff === -1) return '-' + varsText;
    return `${coeff}${varsText}`;
  }

  function wrapNegativeMonomial(htmlStr, coeff) {
    if (coeff < 0) return `(${htmlStr})`;
    return htmlStr;
  }

  // --- Парсер одночлена ---

  function parseMonomial(str) {
    let s = String(str || '').trim().replace(/\s+/g, '').replace(/[*·]/g, '').replace(',', '.').replace(/−/g, '-');
    if (s === '0' || !s) return { coeff: 0, vars: {} };

    const supMap = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁺':'+', '⁻':'-' };
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, match => '^' + Array.from(match).map(ch => supMap[ch] || ch).join(''));

    const coeffMatch = s.match(/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)/);
    let coeff = 1;
    let rest = s;
    if (coeffMatch) {
      coeff = parseFloat(coeffMatch[0]);
      rest = s.slice(coeffMatch[0].length);
    } else if (s.startsWith('-')) {
      coeff = -1;
      rest = s.slice(1);
    } else if (s.startsWith('+')) {
      coeff = 1;
      rest = s.slice(1);
    }

    const vars = {};
    const varRegex = /([a-zA-Zа-яА-Я])(?:\^([+-]?\d+)|(\d))?/g;
    let m;
    const cyrToLat = { 'а':'a', 'в':'b', 'с':'c', 'х':'x', 'у':'y', 'е':'e', 'о':'o', 'р':'p', 'к':'k', 'м':'m' };

    while ((m = varRegex.exec(rest)) !== null) {
      const rawName = m[1].toLowerCase();
      const normName = cyrToLat[rawName] || rawName;
      const exp = m[2] !== undefined ? parseInt(m[2], 10) : (m[3] !== undefined ? parseInt(m[3], 10) : 1);
      if (exp !== 0) {
        vars[normName] = (vars[normName] || 0) + exp;
      }
    }

    Object.keys(vars).forEach(k => {
      if (vars[k] === 0) delete vars[k];
    });

    return { coeff, vars };
  }

  function areMonomialsEqual(m1, m2) {
    const o1 = typeof m1 === 'string' ? parseMonomial(m1) : m1;
    const o2 = typeof m2 === 'string' ? parseMonomial(m2) : m2;

    if (!o1 || !o2) return false;
    if (o1.coeff === 0 && o2.coeff === 0) return true;
    if (Math.abs(o1.coeff - o2.coeff) > 0.0001) return false;

    const keys1 = Object.keys(o1.vars).filter(k => o1.vars[k] > 0).sort();
    const keys2 = Object.keys(o2.vars).filter(k => o2.vars[k] > 0).sort();
    if (keys1.length !== keys2.length) return false;

    for (let i = 0; i < keys1.length; i++) {
      const k = keys1[i];
      if (k !== keys2[i]) return false;
      if (o1.vars[k] !== o2.vars[k]) return false;
    }
    return true;
  }

  // --- Многочлены (Полиномы) ---

  function getVarsKey(vars) {
    const keys = Object.keys(vars || {}).filter(k => vars[k] > 0).sort();
    if (keys.length === 0) return '';
    return keys.map(k => `${k}^${vars[k]}`).join('*');
  }

  function getDegree(vars) {
    return Object.values(vars || {}).reduce((sum, exp) => sum + exp, 0);
  }

  function simplifyPolynomial(terms) {
    const map = new Map();
    for (const t of terms) {
      const k = getVarsKey(t.vars);
      if (!map.has(k)) {
        map.set(k, { coeff: t.coeff, vars: { ...t.vars } });
      } else {
        map.get(k).coeff += t.coeff;
      }
    }
    const res = [];
    for (const [, obj] of map.entries()) {
      if (Math.abs(obj.coeff) > 0.0001) {
        res.push(obj);
      }
    }
    if (res.length === 0) return [{ coeff: 0, vars: {} }];

    // Сортировка: сначала по старшей суммарной степени, затем лексикографически
    res.sort((a, b) => {
      const degDiff = getDegree(b.vars) - getDegree(a.vars);
      if (degDiff !== 0) return degDiff;
      return getVarsKey(a.vars).localeCompare(getVarsKey(b.vars));
    });
    return res;
  }

  function formatPolynomialHtml(terms) {
    const cleanTerms = simplifyPolynomial(terms);
    if (cleanTerms.length === 1 && cleanTerms[0].coeff === 0) return '0';

    let res = '';
    for (let i = 0; i < cleanTerms.length; i++) {
      const t = cleanTerms[i];
      const c = t.coeff;
      const absC = Math.abs(c);
      const varKeys = Object.keys(t.vars || {}).filter(k => t.vars[k] > 0).sort();

      let varsHtml = '';
      for (const v of varKeys) {
        const exp = t.vars[v];
        if (exp === 1) varsHtml += v;
        else if (exp > 1) varsHtml += `${v}<sup>${exp}</sup>`;
      }

      let coeffPart = '';
      if (varsHtml === '') {
        coeffPart = String(absC);
      } else if (absC === 1) {
        coeffPart = '';
      } else {
        coeffPart = String(absC);
      }

      if (i === 0) {
        const sign = c < 0 ? '−' : '';
        res += `${sign}${coeffPart}${varsHtml}`;
      } else {
        const sign = c < 0 ? ' − ' : ' + ';
        res += `${sign}${coeffPart}${varsHtml}`;
      }
    }
    return res || '0';
  }

  function formatPolynomialText(terms) {
    const cleanTerms = simplifyPolynomial(terms);
    if (cleanTerms.length === 1 && cleanTerms[0].coeff === 0) return '0';

    let res = '';
    for (let i = 0; i < cleanTerms.length; i++) {
      const t = cleanTerms[i];
      const c = t.coeff;
      const absC = Math.abs(c);
      const varKeys = Object.keys(t.vars || {}).filter(k => t.vars[k] > 0).sort();

      let varsText = '';
      for (const v of varKeys) {
        const exp = t.vars[v];
        if (exp === 1) varsText += v;
        else if (exp > 1) varsText += `${v}^${exp}`;
      }

      let coeffPart = '';
      if (varsText === '') {
        coeffPart = String(absC);
      } else if (absC === 1) {
        coeffPart = '';
      } else {
        coeffPart = String(absC);
      }

      if (i === 0) {
        const sign = c < 0 ? '-' : '';
        res += `${sign}${coeffPart}${varsText}`;
      } else {
        const sign = c < 0 ? ' - ' : ' + ';
        res += `${sign}${coeffPart}${varsText}`;
      }
    }
    return res || '0';
  }

  function parsePolynomial(str) {
    let s = String(str || '').trim().replace(/\s+/g, '').replace(/−/g, '-').replace(',', '.');
    if (!s || s === '0') return [{ coeff: 0, vars: {} }];
    const supMap = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9' };
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + Array.from(m).map(ch => supMap[ch] || ch).join(''));
    const parts = s.match(/[+-]?[^+-]+/g) || [];
    const terms = parts.map(p => parseMonomial(p));
    return simplifyPolynomial(terms);
  }

  function arePolynomialsEqual(p1, p2) {
    const s1 = Array.isArray(p1) ? simplifyPolynomial(p1) : parsePolynomial(p1);
    const s2 = Array.isArray(p2) ? simplifyPolynomial(p2) : parsePolynomial(p2);
    if (s1.length !== s2.length) return false;
    for (let i = 0; i < s1.length; i++) {
      if (Math.abs(s1[i].coeff - s2[i].coeff) > 0.0001) return false;
      if (getVarsKey(s1[i].vars) !== getVarsKey(s2[i].vars)) return false;
    }
    return true;
  }

  // --- Сборка объекта задачи ---

  function buildTaskResult(category, catName, prompt, questionHtml, targetPoly, targetFactoring, hAns, tAns, solutionSteps, rawDistractors, hint) {
    const optionSet = new Set();
    optionSet.add(hAns);

    const cleanDistractors = [];
    for (const d of rawDistractors) {
      if (d && d !== hAns && !optionSet.has(d)) {
        optionSet.add(d);
        cleanDistractors.push(d);
      }
    }

    // Если дистракторов меньше 3, добавляем модификаторы
    let offset = 1;
    while (cleanDistractors.length < 3) {
      let alt = '';
      if (targetFactoring) {
        const altM = { ...targetFactoring.factorMonomial, coeff: targetFactoring.factorMonomial.coeff + offset };
        alt = `${formatMonomialHtml(altM.coeff, altM.vars)}(${formatPolynomialHtml(targetFactoring.innerPolynomial)})`;
      } else if (targetPoly && targetPoly.length) {
        const altTerms = targetPoly.map((t, idx) => idx === targetPoly.length - 1 ? { ...t, coeff: t.coeff + offset } : t);
        alt = formatPolynomialHtml(altTerms);
      } else {
        alt = `${hAns} + ${offset}`;
      }
      if (alt && !optionSet.has(alt)) {
        optionSet.add(alt);
        cleanDistractors.push(alt);
      }
      offset = offset > 0 ? -offset - 1 : -offset + 1;
    }

    const allOptions = shuffle([
      { html: hAns, isCorrect: true, text: tAns },
      { html: cleanDistractors[0], isCorrect: false, text: cleanDistractors[0].replace(/<[^>]+>/g, '') },
      { html: cleanDistractors[1], isCorrect: false, text: cleanDistractors[1].replace(/<[^>]+>/g, '') },
      { html: cleanDistractors[2], isCorrect: false, text: cleanDistractors[2].replace(/<[^>]+>/g, '') }
    ]);

    const correctIndex = allOptions.findIndex(o => o.isCorrect);

    const accepted = new Set();
    accepted.add(tAns);
    accepted.add(hAns.replace(/<[^>]+>/g, ''));
    accepted.add(tAns.replace(/\s+/g, ''));
    accepted.add(tAns.replace(/\^/g, ''));
    if (tAns.includes('*')) accepted.add(tAns.replace(/\*/g, ''));

    return {
      category,
      catName,
      prompt,
      questionHtml,
      targetPolynomial: targetPoly,
      targetFactoring: targetFactoring,
      answerHtml: hAns,
      displayAnswer: tAns,
      answer: tAns,
      acceptedAnswers: Array.from(accepted),
      options: allOptions,
      correctOptionIndex: correctIndex,
      solutionSteps,
      hint
    };
  }

  // =========================================================================
  // 1. Приведение подобных слагаемых в многочлене (стандартный вид)
  // =========================================================================
  function genSimilar() {
    const v = pickRandom(['x', 'a', 'm', 'y']);
    // Создаём 2-3 группы подобных слагаемых
    const c1_1 = randNonZero(-9, 10);
    const c1_2 = randNonZero(-9, 10);
    const c2_1 = randNonZero(-9, 10);
    const c2_2 = randNonZero(-9, 10);
    const c3_1 = randNonZero(-9, 10);
    const c3_2 = randNonZero(-9, 10);

    const terms1 = [
      { coeff: c1_1, vars: { [v]: 2 } },
      { coeff: c2_1, vars: { [v]: 1 } },
      { coeff: c3_1, vars: {} },
      { coeff: c1_2, vars: { [v]: 2 } },
      { coeff: c2_2, vars: { [v]: 1 } },
      { coeff: c3_2, vars: {} }
    ];

    // Перемешиваем слагаемые для условия
    const shuffledTerms = shuffle(terms1);

    // Формируем строковое условие
    let exprHtml = '';
    for (let i = 0; i < shuffledTerms.length; i++) {
      const t = shuffledTerms[i];
      const mHtml = formatMonomialHtml(t.coeff, t.vars);
      if (i === 0) {
        exprHtml += mHtml;
      } else {
        exprHtml += t.coeff < 0 ? ` − ${formatMonomialHtml(Math.abs(t.coeff), t.vars)}` : ` + ${mHtml}`;
      }
    }

    const targetPoly = simplifyPolynomial(terms1);
    const hAns = formatPolynomialHtml(targetPoly);
    const tAns = formatPolynomialText(targetPoly);

    const questionHtml = `<div class="math-expr"><span class="expr-line">${exprHtml}</span></div>`;
    const prompt = 'Приведите подобные слагаемые и запишите многочлен в стандартном виде:';

    const sum1 = c1_1 + c1_2;
    const sum2 = c2_1 + c2_2;
    const sum3 = c3_1 + c3_2;

    const solutionSteps = [
      `1. Находим и группируем подобные слагаемые (с одинаковой степенью переменной <code>${v}</code>):<br>` +
      `• Слагаемые с <code>${v}²</code>: <code>(${c1_1} + (${c1_2}))${v}² = ${formatMonomialHtml(sum1, { [v]: 2 })}</code>.<br>` +
      `• Слагаемые с <code>${v}</code>: <code>(${c2_1} + (${c2_2}))${v} = ${formatMonomialHtml(sum2, { [v]: 1 })}</code>.<br>` +
      `• Свободные числа: <code>${c3_1} + (${c3_2}) = ${sum3}</code>.`,
      `2. Записываем многочлен в стандартном виде (по убыванию степеней):<br><strong>${hAns}</strong>.`
    ];

    // Дистракторы
    const distractors = [
      formatPolynomialHtml([{ coeff: sum1, vars: { [v]: 2 } }, { coeff: -sum2, vars: { [v]: 1 } }, { coeff: sum3, vars: {} }]),
      formatPolynomialHtml([{ coeff: sum1, vars: { [v]: 2 } }, { coeff: sum2, vars: { [v]: 1 } }, { coeff: -sum3, vars: {} }]),
      formatPolynomialHtml([{ coeff: c1_1 - c1_2, vars: { [v]: 2 } }, { coeff: sum2, vars: { [v]: 1 } }, { coeff: sum3, vars: {} }])
    ];

    return buildTaskResult('similar', 'Приведение подобных слагаемых', prompt, questionHtml, targetPoly, null, hAns, tAns, solutionSteps, distractors, 'Сложи числовые коэффициенты у слагаемых с одинаковыми степенями.');
  }

  // =========================================================================
  // 2. Сложение многочленов
  // =========================================================================
  function genAddition() {
    const v = pickRandom(['x', 'a', 'y']);
    const a1 = randNonZero(-7, 8);
    const b1 = randNonZero(-8, 9);
    const c1 = randNonZero(-9, 10);

    const a2 = randNonZero(-7, 8);
    const b2 = randNonZero(-8, 9);
    const c2 = randNonZero(-9, 10);

    const poly1 = [{ coeff: a1, vars: { [v]: 2 } }, { coeff: b1, vars: { [v]: 1 } }, { coeff: c1, vars: {} }];
    const poly2 = [{ coeff: a2, vars: { [v]: 2 } }, { coeff: b2, vars: { [v]: 1 } }, { coeff: c2, vars: {} }];

    const h1 = formatPolynomialHtml(poly1);
    const h2 = formatPolynomialHtml(poly2);

    const targetPoly = simplifyPolynomial([...poly1, ...poly2]);
    const hAns = formatPolynomialHtml(targetPoly);
    const tAns = formatPolynomialText(targetPoly);

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${h1}) + (${h2}) = ?</span></div>`;
    const prompt = 'Раскройте скобки и выполните сложение многочленов:';

    const sumA = a1 + a2;
    const sumB = b1 + b2;
    const sumC = c1 + c2;

    const solutionSteps = [
      `1. Так как перед второй скобкой стоит знак «+», раскрываем скобки с сохранением всех знаков:<br>` +
      `<code>${h1} + ${h2.startsWith('−') ? `(${h2})` : h2}</code>.`,
      `2. Приводим подобные слагаемые:<br>` +
      `• <code>(${a1} + (${a2}))${v}² = ${formatMonomialHtml(sumA, { [v]: 2 })}</code><br>` +
      `• <code>(${b1} + (${b2}))${v} = ${formatMonomialHtml(sumB, { [v]: 1 })}</code><br>` +
      `• <code>${c1} + (${c2}) = ${sumC}</code>.`,
      `3. Записываем результат: <strong>${hAns}</strong>.`
    ];

    const distractors = [
      formatPolynomialHtml([{ coeff: a1 - a2, vars: { [v]: 2 } }, { coeff: b1 - b2, vars: { [v]: 1 } }, { coeff: c1 - c2, vars: {} }]),
      formatPolynomialHtml([{ coeff: sumA, vars: { [v]: 2 } }, { coeff: -sumB, vars: { [v]: 1 } }, { coeff: sumC, vars: {} }]),
      formatPolynomialHtml([{ coeff: sumA, vars: { [v]: 2 } }, { coeff: sumB, vars: { [v]: 1 } }, { coeff: -sumC, vars: {} }])
    ];

    return buildTaskResult('addition', 'Сложение многочленов', prompt, questionHtml, targetPoly, null, hAns, tAns, solutionSteps, distractors, 'Раскрой скобки без изменения знаков и приведи подобные слагаемые.');
  }

  // =========================================================================
  // 3. Вычитание многочленов
  // =========================================================================
  function genSubtraction() {
    const v = pickRandom(['x', 'a', 'y']);
    const a1 = randNonZero(-8, 9);
    const b1 = randNonZero(-8, 9);
    const c1 = randNonZero(-9, 10);

    const a2 = randNonZero(-8, 9);
    const b2 = randNonZero(-8, 9);
    const c2 = randNonZero(-9, 10);

    const poly1 = [{ coeff: a1, vars: { [v]: 2 } }, { coeff: b1, vars: { [v]: 1 } }, { coeff: c1, vars: {} }];
    const poly2 = [{ coeff: a2, vars: { [v]: 2 } }, { coeff: b2, vars: { [v]: 1 } }, { coeff: c2, vars: {} }];
    const poly2Neg = poly2.map(t => ({ ...t, coeff: -t.coeff }));

    const h1 = formatPolynomialHtml(poly1);
    const h2 = formatPolynomialHtml(poly2);

    const targetPoly = simplifyPolynomial([...poly1, ...poly2Neg]);
    const hAns = formatPolynomialHtml(targetPoly);
    const tAns = formatPolynomialText(targetPoly);

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${h1}) − (${h2}) = ?</span></div>`;
    const prompt = 'Раскройте скобки и выполните вычитание многочленов:';

    const diffA = a1 - a2;
    const diffB = b1 - b2;
    const diffC = c1 - c2;

    const solutionSteps = [
      `1. Перед второй скобкой стоит знак «−», поэтому при раскрытии меняем знаки всех слагаемых внутри второй скобки на противоположные:<br>` +
      `<code>${h1} − (${h2}) = ${h1} ${formatPolynomialHtml(poly2Neg).startsWith('−') ? '' : '+ '}${formatPolynomialHtml(poly2Neg)}</code>.`,
      `2. Приводим подобные слагаемые:<br>` +
      `• <code>(${a1} − (${a2}))${v}² = ${formatMonomialHtml(diffA, { [v]: 2 })}</code><br>` +
      `• <code>(${b1} − (${b2}))${v} = ${formatMonomialHtml(diffB, { [v]: 1 })}</code><br>` +
      `• <code>${c1} − (${c2}) = ${diffC}</code>.`,
      `3. Записываем результат: <strong>${hAns}</strong>.`
    ];

    // Дистракторы: забыли поменять знаки во второй скобке (частая ошибка!), сложили вместо вычитания
    const wrongNoFlip = simplifyPolynomial([...poly1, ...poly2]);
    const distractors = [
      formatPolynomialHtml(wrongNoFlip),
      formatPolynomialHtml([{ coeff: diffA, vars: { [v]: 2 } }, { coeff: -diffB, vars: { [v]: 1 } }, { coeff: diffC, vars: {} }]),
      formatPolynomialHtml([{ coeff: -diffA, vars: { [v]: 2 } }, { coeff: diffB, vars: { [v]: 1 } }, { coeff: -diffC, vars: {} }])
    ];

    return buildTaskResult('subtraction', 'Вычитание многочленов', prompt, questionHtml, targetPoly, null, hAns, tAns, solutionSteps, distractors, 'Знак «минус» перед скобкой меняет знаки всех слагаемых внутри на противоположные.');
  }

  // =========================================================================
  // 4. Умножение одночлена на многочлен
  // =========================================================================
  function genMultMonomial() {
    const v = pickRandom(['x', 'a', 'y']);
    const mCoeff = pickRandom([-5, -4, -3, -2, 2, 3, 4, 5]);
    const mExp = randInt(1, 2);
    const mono = { coeff: mCoeff, vars: { [v]: mExp } };

    const c2 = randNonZero(-5, 6);
    const c1 = randNonZero(-6, 7);
    const c0 = randNonZero(-8, 8);

    const poly = [
      { coeff: c2, vars: { [v]: 2 } },
      { coeff: c1, vars: { [v]: 1 } },
      { coeff: c0, vars: {} }
    ];

    const hMono = formatMonomialHtml(mono.coeff, mono.vars);
    const hPoly = formatPolynomialHtml(poly);

    // Умножаем одночлен на каждый член многочлена
    const productTerms = poly.map(t => ({
      coeff: mono.coeff * t.coeff,
      vars: { [v]: (t.vars[v] || 0) + mExp }
    }));

    const targetPoly = simplifyPolynomial(productTerms);
    const hAns = formatPolynomialHtml(targetPoly);
    const tAns = formatPolynomialText(targetPoly);

    const wrapMono = mCoeff < 0 ? `(${hMono})` : hMono;
    const questionHtml = `<div class="math-expr"><span class="expr-line">${wrapMono} · (${hPoly}) = ?</span></div>`;
    const prompt = 'Выполните умножение одночлена на многочлен:';

    const solutionSteps = [
      `1. Применяем распределительное свойство умножения: умножаем одночлен <code>${hMono}</code> на каждое слагаемое в скобках:<br>` +
      `• <code>${hMono} · (${formatMonomialHtml(c2, { [v]: 2 })}) = ${formatMonomialHtml(mono.coeff * c2, { [v]: 2 + mExp })}</code><br>` +
      `• <code>${hMono} · (${formatMonomialHtml(c1, { [v]: 1 })}) = ${formatMonomialHtml(mono.coeff * c1, { [v]: 1 + mExp })}</code><br>` +
      `• <code>${hMono} · (${c0}) = ${formatMonomialHtml(mono.coeff * c0, { [v]: mExp })}</code>.`,
      `2. При умножении одинаковых переменных показатели степеней складываются (<code>${v}ᵐ · ${v}ⁿ = ${v}ᵐ⁺ⁿ</code>).`,
      `3. Записываем полученный многочлен: <strong>${hAns}</strong>.`
    ];

    // Дистракторы: перемножение показателей, ошибка знака
    const distractors = [
      formatPolynomialHtml(poly.map(t => ({ coeff: mono.coeff * t.coeff, vars: { [v]: (t.vars[v] || 0) * mExp || mExp } }))),
      formatPolynomialHtml(targetPoly.map((t, idx) => idx === 1 ? { ...t, coeff: -t.coeff } : t)),
      formatPolynomialHtml(targetPoly.map(t => ({ ...t, coeff: -t.coeff })))
    ];

    return buildTaskResult('mult_monomial', 'Умножение одночлена на многочлен', prompt, questionHtml, targetPoly, null, hAns, tAns, solutionSteps, distractors, 'Умножь одночлен на каждое слагаемое внутри скобок. Показатели степеней складываются.');
  }

  // =========================================================================
  // 5. Умножение многочлена на многочлен
  // =========================================================================
  function genMultPolynomial() {
    const v = pickRandom(['x', 'a', 'y']);

    // (k1*x + b1)(k2*x + b2)
    const k1 = pickRandom([1, 1, 2, 3]);
    const b1 = randNonZero(-6, 7);
    const k2 = pickRandom([1, 1, 2, 3]);
    const b2 = randNonZero(-6, 7);

    const poly1 = [{ coeff: k1, vars: { [v]: 1 } }, { coeff: b1, vars: {} }];
    const poly2 = [{ coeff: k2, vars: { [v]: 1 } }, { coeff: b2, vars: {} }];

    const h1 = formatPolynomialHtml(poly1);
    const h2 = formatPolynomialHtml(poly2);

    // (k1*x + b1)(k2*x + b2) = k1*k2*x^2 + (k1*b2 + b1*k2)*x + b1*b2
    const termA = { coeff: k1 * k2, vars: { [v]: 2 } };
    const termB = { coeff: k1 * b2 + b1 * k2, vars: { [v]: 1 } };
    const termC = { coeff: b1 * b2, vars: {} };

    const targetPoly = simplifyPolynomial([termA, termB, termC]);
    const hAns = formatPolynomialHtml(targetPoly);
    const tAns = formatPolynomialText(targetPoly);

    const questionHtml = `<div class="math-expr"><span class="expr-line">(${h1})(${h2}) = ?</span></div>`;
    const prompt = 'Выполните умножение многочленов и приведите подобные слагаемые:';

    const solutionSteps = [
      `1. Чтобы умножить многочлен на многочлен, умножаем каждый член первого многочлена на каждый член второго многочлена:<br>` +
      `<code>${h1} · (${h2}) = (${formatMonomialHtml(k1, { [v]: 1 })}) · (${formatMonomialHtml(k2, { [v]: 1 })}) + (${formatMonomialHtml(k1, { [v]: 1 })}) · (${b2}) + (${b1}) · (${formatMonomialHtml(k2, { [v]: 1 })}) + (${b1}) · (${b2})</code>.`,
      `2. Выполняем промежуточные умножения:<br>` +
      `<code>= ${formatMonomialHtml(k1 * k2, { [v]: 2 })} + (${formatMonomialHtml(k1 * b2, { [v]: 1 })}) + (${formatMonomialHtml(b1 * k2, { [v]: 1 })}) + (${b1 * b2})</code>.`,
      `3. Приводим подобные слагаемые с <code>${v}</code>:<br>` +
      `<code>${k1 * b2} + (${b1 * k2}) = ${k1 * b2 + b1 * k2}</code>.`,
      `4. Итоговый результат: <strong>${hAns}</strong>.`
    ];

    // Дистракторы: пропуск перекрёстных слагаемых (ac*x^2 + bd), ошибка знака в среднем слагаемом
    const distractors = [
      formatPolynomialHtml([termA, termC]),
      formatPolynomialHtml([termA, { ...termB, coeff: -termB.coeff }, termC]),
      formatPolynomialHtml([termA, { coeff: k1 * b2 - b1 * k2, vars: { [v]: 1 } }, termC])
    ];

    return buildTaskResult('mult_polynomial', 'Умножение многочленов', prompt, questionHtml, targetPoly, null, hAns, tAns, solutionSteps, distractors, 'Каждое слагаемое первой скобки умножь на каждое слагаемое второй скобки, затем приведи подобные.');
  }

  // =========================================================================
  // 6. Вынесение общего множителя за скобки
  // =========================================================================
  function genFactoring() {
    const v = pickRandom(['x', 'a', 'b', 'y']);

    // Общий множитель
    const factorCoeff = pickRandom([2, 3, 4, 5, 6, 7]);
    const factorExp = randInt(1, 3);
    const factorMonomial = { coeff: factorCoeff, vars: { [v]: factorExp } };

    // Скобка: c1*x + c0 или c2*x^2 + c1*x + c0
    let c1 = randNonZero(-6, 7);
    let c0 = randNonZero(-7, 8);
    // Делаем коэффициенты взаимно простыми
    while (gcd(c1, c0) > 1) {
      c0 = randNonZero(-7, 8);
    }

    const innerPoly = [
      { coeff: c1, vars: { [v]: randInt(1, 2) } },
      { coeff: c0, vars: {} }
    ];

    // Исходный раскрытый многочлен
    const expandedTerms = innerPoly.map(t => ({
      coeff: factorCoeff * t.coeff,
      vars: { [v]: (t.vars[v] || 0) + factorExp }
    }));

    const hExpanded = formatPolynomialHtml(expandedTerms);
    const hFactorM = formatMonomialHtml(factorCoeff, { [v]: factorExp });
    const tFactorM = formatMonomialText(factorCoeff, { [v]: factorExp });
    const hInner = formatPolynomialHtml(innerPoly);
    const tInner = formatPolynomialText(innerPoly);

    const hAns = `${hFactorM}(${hInner})`;
    const tAns = `${tFactorM}(${tInner})`;

    const questionHtml = `<div class="math-expr"><span class="expr-line">${hExpanded} = ?</span></div>`;
    const prompt = 'Разложите многочлен на множители, вынеся общий множитель за скобки:';

    const solutionSteps = [
      `1. Находим наибольший общий делитель числовых коэффициентов: НОД(|${expandedTerms[0].coeff}|, |${expandedTerms[1].coeff}|) = <code>${factorCoeff}</code>.`,
      `2. Находим переменную с наименьшим показателем степени: <code>${v}<sup>${factorExp}</sup></code>. Общий множитель: <code>${hFactorM}</code>.`,
      `3. Делим каждое слагаемое исходного многочлена на общий множитель:<br>` +
      `• <code>(${formatMonomialHtml(expandedTerms[0].coeff, expandedTerms[0].vars)}) : (${hFactorM}) = ${formatMonomialHtml(c1, innerPoly[0].vars)}</code><br>` +
      `• <code>(${formatMonomialHtml(expandedTerms[1].coeff, expandedTerms[1].vars)}) : (${hFactorM}) = ${formatMonomialHtml(c0, innerPoly[1].vars)}</code>.`,
      `4. Получаем разложение: <strong>${hAns}</strong>.`
    ];

    // Дистракторы: неполное вынесение (без степени или без НОД), ошибка знака
    const dist1 = `${formatMonomialHtml(factorCoeff, { [v]: 1 })}(${formatPolynomialHtml(innerPoly.map(t => ({ ...t, vars: { [v]: (t.vars[v] || 0) + factorExp - 1 } })))})`;
    const dist2 = `${hFactorM}(${formatPolynomialHtml(innerPoly.map((t, idx) => idx === 1 ? { ...t, coeff: -t.coeff } : t))})`;
    const dist3 = `${formatMonomialHtml(factorCoeff > 2 ? Math.floor(factorCoeff / 2) : factorCoeff + 2, { [v]: factorExp })}(${hInner})`;

    return buildTaskResult('factoring', 'Вынесение общего множителя', prompt, questionHtml, null, { factorMonomial, innerPolynomial: innerPoly }, hAns, tAns, solutionSteps, [dist1, dist2, dist3], 'Найди наибольший общий делитель чисел и вынеси переменную в наименьшей степени.');
  }

  // =========================================================================
  // Проверка ответов
  // =========================================================================

  function checkAnswer(task, rawUserAnswer) {
    if (!task || rawUserAnswer === undefined || rawUserAnswer === null) {
      return { isCorrect: false, error: 'Ответ не указан' };
    }

    // Если выбор из карточек вариантов (0..3)
    if (typeof rawUserAnswer === 'number' && rawUserAnswer >= 0 && rawUserAnswer <= 3) {
      const isCorrect = (rawUserAnswer === task.correctOptionIndex);
      return {
        isCorrect,
        correctIndex: task.correctOptionIndex,
        userIndex: rawUserAnswer,
        displayAnswer: task.displayAnswer
      };
    }

    const cleanStr = String(rawUserAnswer).trim();
    if (!cleanStr) return { isCorrect: false, error: 'Введите многочлен' };

    const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '').replace(/−/g, '-').replace('*', '');
    const uNorm = norm(cleanStr);

    // 1. Прямая сверка со списком acceptedAnswers
    if (Array.isArray(task.acceptedAnswers)) {
      for (const acc of task.acceptedAnswers) {
        if (norm(acc) === uNorm) {
          return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
        }
      }
    }

    // 2. Для задач на вынесение за скобки: формат M(Q)
    if (task.category === 'factoring' && task.targetFactoring) {
      const match = uNorm.match(/^([^(]+)\(([^)]+)\)$/);
      if (match) {
        const uFactor = parseMonomial(match[1]);
        const uInner = parsePolynomial(match[2]);
        const tFactor = task.targetFactoring.factorMonomial;
        const tInner = task.targetFactoring.innerPolynomial;

        // Прямое совпадение
        if (areMonomialsEqual(uFactor, tFactor) && arePolynomialsEqual(uInner, tInner)) {
          return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
        }
        // С вынесением противоположного знака: -M * (-Q)
        const negTFactor = { ...tFactor, coeff: -tFactor.coeff };
        const negTInner = tInner.map(t => ({ ...t, coeff: -t.coeff }));
        if (areMonomialsEqual(uFactor, negTFactor) && arePolynomialsEqual(uInner, negTInner)) {
          return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
        }
      }
    }

    // 3. Для остальных задач: сравнение как алгебраических многочленов
    if (task.targetPolynomial) {
      const userPoly = parsePolynomial(cleanStr);
      if (arePolynomialsEqual(userPoly, task.targetPolynomial)) {
        return { isCorrect: true, displayAnswer: task.displayAnswer, userAnswer: cleanStr };
      }
    }

    return {
      isCorrect: false,
      userAnswer: cleanStr,
      correctAnswer: task.displayAnswer,
      displayAnswer: task.displayAnswer
    };
  }

  // =========================================================================
  // Диспетчер генератора
  // =========================================================================

  function generateTask(mode) {
    let m = mode || 'all';
    if (m.startsWith('polynomials_')) {
      m = m.replace('polynomials_', '');
    }

    switch (m) {
      case 'similar':
        return genSimilar();
      case 'addition':
        return genAddition();
      case 'subtraction':
        return genSubtraction();
      case 'mult_monomial':
        return genMultMonomial();
      case 'mult_polynomial':
        return genMultPolynomial();
      case 'factoring':
        return genFactoring();
      case 'all':
      case 'mixed':
      default:
        return pickRandom([
          genSimilar,
          genAddition,
          genSubtraction,
          genMultMonomial,
          genMultPolynomial,
          genFactoring
        ])();
    }
  }

  return {
    generateTask,
    checkAnswer,
    genSimilar,
    genAddition,
    genSubtraction,
    genMultMonomial,
    genMultPolynomial,
    genFactoring,
    parseMonomial,
    parsePolynomial,
    areMonomialsEqual,
    arePolynomialsEqual,
    simplifyPolynomial,
    formatMonomialHtml,
    formatMonomialText,
    formatPolynomialHtml,
    formatPolynomialText
  };
}));
