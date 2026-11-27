/**
 * StudySite KaTeX Math Renderer Module
 * Универсальный модуль для красивого рендеринга математических формул с помощью KaTeX
 * Поддерживает:
 * - Автономную работу через assets/katex
 * - Преобразование существующих HTML формул (.fraction, <sup>, корни и т.д.) в KaTeX
 * - Рендеринг TeX синтаксиса $...$ и $$...$$ или \frac{}{}, \sqrt{}
 * - Бесшовную интеграцию с oge_roadmap, homework, teacher и math_moduls
 */

(function () {
    'use strict';

    // Map unicode superscripts and subscripts
    const SUP_MAP = {
        '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4',
        '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9',
        '⁺':'+', '⁻':'-', 'ⁿ':'n', 'ᵐ':'m', 'ᵏ':'k', 'ˣ':'x'
    };
    const SUB_MAP = {
        '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4',
        '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9'
    };

    /**
     * Конвертирует legacy HTML разметку формул сайта в валидный TeX для KaTeX
     */
    function htmlToTeX(html) {
        if (!html) return '';
        let s = String(html);

        // Remove wrapping math-expr tags
        s = s.replace(/<div class=["']math-expr["'][^>]*>(.*?)<\/div>/gis, '$1');

        // Repeatedly convert nested fractions
        let prev = '';
        while (prev !== s) {
            prev = s;
            s = s.replace(/<span class=["']fraction["'][^>]*>\s*<span class=["']num["'][^>]*>(.*?)<\/span>\s*<span class=["']den["'][^>]*>(.*?)<\/span>\s*<\/span>/gi, '\\frac{$1}{$2}');
        }

        // Radicals generated with rad-wrap / rad-sym / rad-body
        s = s.replace(/<span class=["']rad-wrap["'][^>]*>\s*<span class=["']rad-sym["'][^>]*>.*?<\/span>\s*<span class=["']rad-body["'][^>]*>(.*?)<\/span>\s*<\/span>/gi, '\\sqrt{$1}');

        // Radicals generated as &radic;<span style="border-top:...">...</span> or √<span>...</span>
        s = s.replace(/(?:&radic;|√)\s*<span[^>]*>(.*?)<\/span>/gi, '\\sqrt{$1}');

        // HTML superscripts & subscripts
        s = s.replace(/<sup>(.*?)<\/sup>/gi, '^{$1}');
        s = s.replace(/<sub>(.*?)<\/sub>/gi, '_{$1}');

        // Unicode superscripts
        s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵏˣ]+/g, m => '^{' + Array.from(m).map(c => SUP_MAP[c] || c).join('') + '}');
        s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, m => '_{' + Array.from(m).map(c => SUB_MAP[c] || c).join('') + '}');

        // Caret powers
        s = s.replace(/([a-zA-Z0-9_\)\]\}]+)\^\(([^)]+)\)/g, '$1^{$2}');
        s = s.replace(/([a-zA-Z0-9_\)\]\}]+)\^([+-]?\d+|[a-zA-Z])/g, '$1^{$2}');

        // Remove inline formatting tags inside math (<em>, <i>, <strong>, <b>) without adding spaces
        s = s.replace(/<\/?(?:em|i|strong|b)\b[^>]*>/gi, '');

        // Remove any remaining layout wrapper spans/divs (like expr-line, etc.)
        s = s.replace(/<\/?(?:span|div|p)\b[^>]*>/gi, ' ');

        // Decode HTML math entities before symbol replacements
        s = s.replace(/&le;/gi, ' \\le ');
        s = s.replace(/&ge;/gi, ' \\ge ');
        s = s.replace(/&ne;/gi, ' \\ne ');
        s = s.replace(/&lt;/gi, ' < ');
        s = s.replace(/&gt;/gi, ' > ');
        s = s.replace(/&minus;|&mdash;/gi, ' - ');
        s = s.replace(/&middot;/gi, ' \\cdot ');
        s = s.replace(/&times;/gi, ' \\times ');
        s = s.replace(/&divide;/gi, ' \\div ');
        s = s.replace(/&plusmn;/gi, ' \\pm ');
        s = s.replace(/&approx;/gi, ' \\approx ');
        s = s.replace(/&infin;/gi, ' \\infty ');
        s = s.replace(/&isin;/gi, ' \\in ');
        s = s.replace(/&cup;/gi, ' \\cup ');
        s = s.replace(/&rArr;/gi, ' \\implies ');
        s = s.replace(/&larr;/gi, ' \\leftarrow ');
        s = s.replace(/&radic;/gi, '√');

        // Unicode minus
        s = s.replace(/−/g, ' - ');

        // Roots
        s = s.replace(/√\((.*?)\)/g, '\\sqrt{$1}');
        s = s.replace(/√([a-zA-Z0-9]+)/g, '\\sqrt{$1}');

        // Common symbols
        s = s.replace(/,\s*при\s+/gi, ',\\;\\text{при }');
        s = s.replace(/\s+при\s+/gi, '\\;\\text{при }');
        s = s.replace(/·/g, ' \\cdot ');
        s = s.replace(/×/g, ' \\times ');
        s = s.replace(/÷/g, ' \\div ');
        s = s.replace(/±/g, ' \\pm ');
        s = s.replace(/∓/g, ' \\mp ');
        s = s.replace(/≤/g, ' \\le ');
        s = s.replace(/≥/g, ' \\ge ');
        s = s.replace(/≠/g, ' \\ne ');
        s = s.replace(/≈/g, ' \\approx ');
        s = s.replace(/⟹/g, ' \\implies ');
        s = s.replace(/⟺/g, ' \\iff ');
        s = s.replace(/&ensp;|&emsp;/g, ' \\quad ');
        s = s.replace(/&nbsp;/g, '~');

        return s;
    }

    /**
     * Рендерит TeX строку в HTML через KaTeX с фолбэком
     */
    function renderTeX(tex, displayMode = false) {
        if (!tex) return '';
        let cleanTex = String(tex)
            .replace(/−/g, '-')
            .replace(/\\?≠/g, '\\ne ')
            .replace(/\\?≤/g, '\\le ')
            .replace(/\\?≥/g, '\\ge ')
            .replace(/\\?→/g, '\\to ');
        if (typeof window.katex !== 'undefined') {
            try {
                return window.katex.renderToString(cleanTex, {
                    displayMode: displayMode,
                    output: 'html', // Отключает дублирующий слой MathML, предотвращая сдвоенный текст
                    throwOnError: false,
                    strict: false
                });
            } catch (e) {
                console.warn('KaTeX render warning:', e);
                return cleanTex;
            }
        }
        return cleanTex;
    }

    /**
     * Проверяет, является ли строка смешанным текстом (проза, <br>, <code> и т.п.),
     * который нельзя передавать в KaTeX целиком.
     */
    function isMixedProseHtml(str) {
        if (!str) return false;
        // 1. Структурные или текстовые HTML-теги (вне математических обёрток)
        if (/<(?:br|code|pre|ul|ol|li|table|tr|td|th|h[1-6]|p|blockquote|strong)\b/i.test(str)) {
            return true;
        }
        // 2. Длинный русский текст (2 и более русских слова рядом, исключая слово "при")
        const withoutTags = str.replace(/<[^>]+>/g, ' ').replace(/\bпри\b/gi, ' ');
        if (/[а-яё]{2,}\s+[а-яё]{2,}/i.test(withoutTags)) {
            return true;
        }
        return false;
    }

    const GREEK_TEX_MAP = {
        'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ',
        'ε': '\\varepsilon ', 'ζ': '\\zeta ', 'η': '\\eta ', 'θ': '\\theta ',
        'ι': '\\iota ', 'κ': '\\kappa ', 'λ': '\\lambda ', 'μ': '\\mu ',
        'ν': '\\nu ', 'ξ': '\\xi ', 'π': '\\pi ', 'ρ': '\\rho ',
        'σ': '\\sigma ', 'τ': '\\tau ', 'υ': '\\upsilon ', 'φ': '\\varphi ',
        'χ': '\\chi ', 'ψ': '\\psi ', 'ω': '\\omega ',
        'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Θ': '\\Theta ', 'Λ': '\\Lambda ',
        'Ξ': '\\Xi ', 'Π': '\\Pi ', 'Σ': '\\Sigma ', 'Φ': '\\Phi ',
        'Ψ': '\\Psi ', 'Ω': '\\Omega '
    };

    const ENGLISH_STOPWORDS_2 = new Set([
        'is', 'in', 'on', 'at', 'to', 'of', 'or', 'by', 'if', 'no',
        'an', 'as', 'it', 'we', 'he', 'be', 'do', 'go', 'so', 'up',
        'us', 'my', 'ok', 'vs', 'id'
    ]);

    function plainFormulaToTeX(expr) {
        let s = String(expr || '').trim();
        if (!s) return '';

        // 1. Защищаем кириллицу в нижних индексах и преобразуем индексы
        s = s.replace(/([A-Za-zА-Яа-яЁё0-9\)α-ωΑ-ΩΔ])_\{([^}]+)\}/g, (m, base, sub) => {
            const subTex = /[А-Яа-яЁё]/.test(sub) ? `\\text{${sub}}` : sub;
            return `${base}_{${subTex}}`;
        });
        s = s.replace(/([A-Za-zА-Яа-яЁё0-9\)α-ωΑ-ΩΔ])_([A-Za-zА-Яа-яЁё0-9]+)/g, (m, base, sub) => {
            const subTex = /[А-Яа-яЁё]/.test(sub) ? `\\text{${sub}}` : sub;
            return `${base}_{${subTex}}`;
        });

        // 2. Юникодные верхние и нижние индексы
        s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, m => '_{' + Array.from(m).map(c => SUB_MAP[c] || c).join('') + '}');
        s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵏˣ]+/g, m => '^{' + Array.from(m).map(c => SUP_MAP[c] || c).join('') + '}');

        // 3. Степени через ^
        s = s.replace(/([A-Za-z0-9_\)\]\}]+)\^\(([^)]+)\)/g, '$1^{$2}');
        s = s.replace(/([A-Za-z0-9_\)\]\}]+)\^([+-]?\d+|[a-zA-Z])/g, '$1^{$2}');

        // 4. Греческие буквы
        s = s.replace(/[α-ωΑ-ΩΓΔΘΛΞΠΣΦΨΩ]/g, ch => GREEK_TEX_MAP[ch] || ch);

        // 5. Кириллические базовые буквы (вне уже созданных \text{...})
        s = s.replace(/\\text\{[^}]*\}|([А-Яа-яЁё]+)/g, (m, cyr) => {
            return cyr ? `\\text{${cyr}}` : m;
        });

        // 6. Десятичные запятые и пробелы-разделители тысяч
        s = s.replace(/(\d),(\d)/g, '$1{,}$2');
        while (/(\d)\s(\d{3})(?!\d)/.test(s)) {
            s = s.replace(/(\d)\s(\d{3})(?!\d)/g, '$1\\,$2');
        }
        // Неявное умножение между числом и переменной/греческой буквой
        s = s.replace(/(\d)\s+([A-Za-z\\])/g, '$1\\,$2');

        // 7. Математические операторы
        s = s.replace(/==/g, '=');
        s = s.replace(/=>/g, ' \\implies ');
        s = s.replace(/→/g, ' \\to ');
        s = s.replace(/<=/g, ' \\le ');
        s = s.replace(/>=/g, ' \\ge ');
        s = s.replace(/!=/g, ' \\ne ');
        s = s.replace(/−/g, '-');
        s = s.replace(/·/g, ' \\cdot ');
        s = s.replace(/×/g, ' \\times ');
        s = s.replace(/÷/g, ' \\div ');
        s = s.replace(/±/g, ' \\pm ');
        s = s.replace(/≈/g, ' \\approx ');
        s = s.replace(/≠/g, ' \\ne ');
        s = s.replace(/≤/g, ' \\le ');
        s = s.replace(/≥/g, ' \\ge ');

        return s.trim();
    }

    function balanceSpanParens(raw) {
        let s = raw.trim();
        s = s.replace(/^[\s,+*/=≈≠≤≥·×÷]+/, '').replace(/[\s,+\-*/=]+$/, '');
        let openCount = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '(') openCount++;
            else if (s[i] === ')') openCount--;
        }
        while (openCount < 0 && s.endsWith(')')) {
            s = s.slice(0, -1).trim();
            openCount++;
        }
        while (openCount > 0 && s.startsWith('(')) {
            s = s.slice(1).trim();
            openCount--;
        }
        let outerPrefix = '';
        let outerSuffix = '';
        if (s.startsWith('(') && s.endsWith(')')) {
            let depth = 0;
            let wrapsAll = true;
            for (let i = 0; i < s.length; i++) {
                if (s[i] === '(') depth++;
                else if (s[i] === ')') depth--;
                if (depth === 0 && i < s.length - 1) {
                    wrapsAll = false;
                    break;
                }
            }
            if (wrapsAll) {
                outerPrefix = '(';
                outerSuffix = ')';
                s = s.slice(1, -1).trim();
            }
        }
        return { text: s, prefix: outerPrefix, suffix: outerSuffix };
    }

    function applyInlinePlainMathInDom(rootEl) {
        if (!rootEl || typeof window.katex === 'undefined' || typeof document === 'undefined') return;

        // Превращаем простые <sub>/<sup> (например A<sub>внеш</sub>, 10<sup>4</sup>) в текстовую запись для KaTeX
        rootEl.querySelectorAll('sub, sup').forEach(el => {
            if (el.closest('.katex, code, pre, svg, script, style, textarea')) return;
            if (el.children.length > 0) return;
            const inner = (el.textContent || '').trim();
            if (!inner || inner.length > 20) return;
            const prev = el.previousSibling;
            if (!prev || prev.nodeType !== 3) return;
            const pval = prev.nodeValue || '';
            if (!/(?:[A-Za-z0-9α-ωΑ-ΩΔ\)]|(?<![А-Яа-яЁё])[А-Яа-яЁё])$/.test(pval)) return;
            const marker = el.tagName.toLowerCase() === 'sub' ? '_' : '^';
            el.replaceWith(document.createTextNode(`${marker}{${inner}}`));
        });
        rootEl.normalize();

        const SUB_SUP = '(?:_\\{[^}]+\\}|_[A-Za-zА-Яа-яЁё0-9]+|[₀₁₂₃₄₅₆₇₈₉]+|\\^\\{[^}]+\\}|\\^\\([^)]+\\)|\\^[+-]?\\d+|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵏˣ]+)';
        const GREEK_CHARS = 'α-ωΑ-ΩΓΔΘΛΞΠΣΦΨΩ';
        const FUNC = '(?:sin|cos|tg|ctg|lg|ln|log)';
        const VAR_WITH_SCRIPT = `(?:[A-Za-z${GREEK_CHARS}А-Яа-яЁё]{1,3}${SUB_SUP}+)`;
        const NUM_OR_VAR = `(?:\\d+(?:\\s\\d{3})*(?:[.,]\\d+)?${SUB_SUP}*|${FUNC}\\b|(?:Δ[A-Za-zА-Яа-яЁё]{1,2}|[${GREEK_CHARS}])${SUB_SUP}*|[A-Za-z]{1,2}${SUB_SUP}*)`;
        const ATOM = `(?:${VAR_WITH_SCRIPT}|${NUM_OR_VAR})`;
        const OP = '(?:\\s*(?:==|=>|<=|>=|!=|[=≈≠≤≥·×÷+\\-−*/])\\s*|\\s+)';
        const MATH_SPAN_RE = new RegExp(`\\(*${ATOM}\\)*(?:${OP}\\(*${ATOM}\\)*)*`, 'g');
        const STRONG_SIGNAL_RE = new RegExp(`[_₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵏˣ^=≈≠≤≥·×÷±√⇒⟹⟺${GREEK_CHARS}]`);

        const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (parent.closest('.katex, code, pre, script, style, svg, textarea, input, select, option')) {
                    return NodeFilter.FILTER_REJECT;
                }
                const v = node.nodeValue || '';
                if (!STRONG_SIGNAL_RE.test(v)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const textNodes = [];
        let cur;
        while ((cur = walker.nextNode())) {
            textNodes.push(cur);
        }

        textNodes.forEach(node => {
            const val = node.nodeValue || '';
            MATH_SPAN_RE.lastIndex = 0;
            let lastIdx = 0;
            let match;
            const frag = document.createDocumentFragment();
            let replacedAny = false;

            while ((match = MATH_SPAN_RE.exec(val)) !== null) {
                const rawMatch = match[0];
                const leadWsLen = rawMatch.length - rawMatch.trimStart().length;
                const trailWsLen = rawMatch.length - rawMatch.trimEnd().length;
                const matchStart = match.index + leadWsLen;
                const matchEnd = match.index + rawMatch.length - trailWsLen;
                let candidate = rawMatch.trim();

                const stopTail = candidate.match(/\s+([A-Za-z]{2})$/);
                if (stopTail && ENGLISH_STOPWORDS_2.has(stopTail[1].toLowerCase())) {
                    candidate = candidate.slice(0, -stopTail[0].length);
                }

                const balanced = balanceSpanParens(candidate);
                const core = balanced.text;
                if (!core || !STRONG_SIGNAL_RE.test(core) || !/[A-Za-z0-9α-ωΑ-ΩΔ]/.test(core)) {
                    continue;
                }

                const tex = plainFormulaToTeX(core);
                if (!tex) continue;
                const renderedHtml = renderTeX(tex, false);
                if (!renderedHtml || renderedHtml === tex) continue;

                const innerIdx = rawMatch.indexOf(core);
                const exactStart = innerIdx !== -1 ? (match.index + innerIdx - balanced.prefix.length) : matchStart;
                const exactEnd = innerIdx !== -1 ? (match.index + innerIdx + core.length + balanced.suffix.length) : matchEnd;

                if (exactStart > lastIdx) {
                    frag.appendChild(document.createTextNode(val.slice(lastIdx, exactStart)));
                }
                if (balanced.prefix) {
                    frag.appendChild(document.createTextNode(balanced.prefix));
                }

                const span = document.createElement('span');
                span.innerHTML = renderedHtml;
                while (span.firstChild) {
                    frag.appendChild(span.firstChild);
                }

                if (balanced.suffix) {
                    frag.appendChild(document.createTextNode(balanced.suffix));
                }
                lastIdx = exactEnd;
                replacedAny = true;
            }

            if (replacedAny) {
                if (lastIdx < val.length) {
                    frag.appendChild(document.createTextNode(val.slice(lastIdx)));
                }
                node.parentNode.replaceChild(frag, node);
            }
        });
    }

    /**
     * Точечно рендерит только математические фрагменты внутри смешанного HTML-текста,
     * не ломая пробелы, русский текст, <br>, <code> и <strong>.
     */
    function formatMixedHtml(html) {
        if (!html) return '';
        let result = String(html);

        // Очистка устаревших битых TeX-последовательностей из старых сохранений
        result = result.replace(/\$\\→\$/g, '→').replace(/\\→/g, '→').replace(/\\≠/g, '≠');

        // Поддержка $...$ и $$...$$ внутри смешанного текста (вне <code> и уже готового .katex)
        result = result.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) => renderTeX(tex.trim(), true));
        result = result.replace(/(^|[^\\])\$([^$\n<]+?)\$/g, (m, prefix, tex) => prefix + renderTeX(tex.trim(), false));

        if (typeof document !== 'undefined' && document.createElement) {
            const tmp = document.createElement('div');
            tmp.innerHTML = result;

            // Рендерим явные блоки .math-expr / .math-tex
            tmp.querySelectorAll('.math-expr, .math-tex').forEach(el => {
                if (el.closest('.katex')) return;
                el.outerHTML = formatMath(el.outerHTML, el.tagName.toLowerCase() === 'div');
            });

            // Рендерим системы уравнений, если они вне .math-expr
            tmp.querySelectorAll('.system-bracket').forEach(el => {
                if (el.closest('.katex')) return;
                el.outerHTML = formatMath(el.outerHTML, true);
            });

            // Рендерим встроенные корни и дроби верхнего уровня
            tmp.querySelectorAll('.rad-wrap').forEach(el => {
                if (el.closest('.katex') || el.closest('.fraction')) return;
                const tex = htmlToTeX(el.outerHTML).trim();
                if (tex) el.outerHTML = renderTeX(tex, false);
            });

            tmp.querySelectorAll('.fraction').forEach(el => {
                if (el.closest('.katex') || el.parentElement.closest('.fraction')) return;
                const tex = htmlToTeX(el.outerHTML).trim();
                if (tex) el.outerHTML = renderTeX(tex, false);
            });

            // Авторендеринг инлайновых формул (индексы m_льда, Q₁, 400², λ_св = 25 000 и т.д.)
            applyInlinePlainMathInDom(tmp);

            result = tmp.innerHTML;
        } else {
            // Фолбэк для окружений без DOM (Node.js)
            result = result.replace(/<div\s+class=["']math-expr["'][^>]*>[\s\S]*?<\/div>/gi, m => formatMath(m, true));
            result = result.replace(/<span\s+class=["']fraction["'][^>]*>\s*<span\s+class=["']num["'][^>]*>(?:(?!<span\s+class=["']fraction).)*?<\/span>\s*<span\s+class=["']den["'][^>]*>(?:(?!<span\s+class=["']fraction).)*?<\/span>\s*<\/span>/gi, m => {
                const tex = htmlToTeX(m).trim();
                return tex ? renderTeX(tex, false) : m;
            });
        }

        return result;
    }

    /**
     * Преобразует и рендерит фрагмент формулы
     */
    function formatMath(raw, displayMode = false) {
        if (!raw) return '';
        let rawStr = String(raw).trim();

        // 0. Never re-render already rendered KaTeX markup
        if (rawStr.includes('class="katex') || rawStr.includes("class='katex") || rawStr.includes('data-katex-rendered')) {
            return rawStr;
        }

        // 1. Separate non-math instruction/condition blocks outside the math expression
        // e.g. <div class="task-instruction">...</div>, <span class="math-cond">...</span>, <div class="task-prompt">...</div>
        const blockRegex = /(\s*<(?:div|p|span)\s+class=["'](?:task-instruction|math-cond|task-prompt|task-subtext|task-note)["'][^>]*>[\s\S]*?<\/(?:div|p|span)>)/i;
        if (blockRegex.test(rawStr)) {
            const parts = rawStr.split(blockRegex);
            return parts.map(part => {
                if (!part || !part.trim()) return '';
                if (blockRegex.test(part)) return part; // Keep non-math blocks as pure HTML
                return formatMath(part, displayMode);
            }).join(' ').trim();
        }

        // 2. If wrapping <div class="math-expr">...</div> or <span class="math-expr">...</span> exists
        const exprWrapMatch = rawStr.match(/^<(div|span)\s+class=["'](?:math-expr|math-tex)["'][^>]*>([\s\S]*?)<\/\1>$/i);
        if (exprWrapMatch) {
            const inner = formatMath(exprWrapMatch[2].trim(), displayMode);
            return `<div class="math-expr katex-ready" data-katex-rendered="true">${inner}</div>`;
        }

        // 3. If it's a systems of equations HTML structure (<div class="system-bracket">...)
        if (rawStr.includes('system-bracket') || rawStr.includes('system-equations')) {
            const eqs = [];
            if (typeof document !== 'undefined' && document.createElement) {
                const tmp = document.createElement('div');
                tmp.innerHTML = rawStr;
                const eqContainer = tmp.querySelector('.system-equations');
                if (eqContainer) {
                    Array.from(eqContainer.children).forEach(ch => {
                        const tex = htmlToTeX(ch.innerHTML).trim();
                        if (tex) eqs.push(tex);
                    });
                }
            }
            if (eqs.length === 0) {
                const eqStart = rawStr.search(/<div\s+class=["']system-equations["'][^>]*>/i);
                const afterStart = eqStart !== -1
                    ? rawStr.slice(eqStart).replace(/^<div\s+class=["']system-equations["'][^>]*>/i, '')
                    : rawStr;
                const itemRegex = /<(div|span)>([\s\S]*?)<\/\1>/gi;
                let itemMatch;
                while ((itemMatch = itemRegex.exec(afterStart)) !== null) {
                    const text = itemMatch[2].trim();
                    if (text && !text.includes('system-brace') && !text.includes('system-equations')) {
                        eqs.push(htmlToTeX(text).trim());
                    }
                }
            }
            if (eqs.length > 0) {
                const systemTeX = `\\begin{cases} ${eqs.join(' \\\\[4pt] ')} \\end{cases}`;
                return renderTeX(systemTeX, displayMode);
            }
        }

        // 4. Protect mixed prose / HTML (Russian text, <br>, <code>, <strong>) from being fed as raw TeX
        if (isMixedProseHtml(rawStr)) {
            return formatMixedHtml(rawStr);
        }

        // 5. Remove non-semantic helper spans like <span class="expr-line">...</span>
        rawStr = rawStr.replace(/<\/?span\s+class=["']expr-line["'][^>]*>/gi, '');

        // 5. If it's already LaTeX ($...$ or $$...$$)
        if (rawStr.startsWith('$$') && rawStr.endsWith('$$')) {
            return renderTeX(rawStr.slice(2, -2), true);
        }
        if (rawStr.startsWith('$') && rawStr.endsWith('$')) {
            return renderTeX(rawStr.slice(1, -1), displayMode);
        }

        // 6. If contains LaTeX commands like \frac, \sqrt, \cdot
        if (/\\(?:frac|sqrt|cdot|pm|times|div|le|ge|ne|alpha|beta|pi|sum|int|infty|begin)/.test(rawStr)) {
            // Strip wrapping HTML tags if pure math
            let cleanTex = rawStr;
            if (!rawStr.includes('\\begin{cases}')) {
                cleanTex = rawStr.replace(/<[^>]+>/g, ' ').trim();
            }
            return renderTeX(cleanTex, displayMode);
        }

        // 7. Standalone formulas with subscripts, Greek letters, or legacy HTML math structures
        if (/[_₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹α-ωΑ-ΩΔ≈]/.test(rawStr) && !/<(?:span|div|p|sup|sub)\b/i.test(rawStr)) {
            const tex = plainFormulaToTeX(rawStr);
            if (tex) return renderTeX(tex, displayMode);
        }
        if (rawStr.includes('class="fraction"') || rawStr.includes('class="rad-wrap"') || rawStr.includes('class="rad-sym"') || rawStr.includes('<sup>') || rawStr.includes('<sub>') || rawStr.includes('√') || rawStr.includes('·') || rawStr.includes('=') || /&\s*(?:le|ge|ne|radic|middot|minus|infin|cup|isin);/i.test(rawStr)) {
            const tex = htmlToTeX(rawStr);
            return renderTeX(tex, displayMode);
        }

        return rawStr;
    }

    /**
     * Автоматически находит элементы с классом .katex-render или .math-expr
     * и рендерит их через KaTeX
     */
    function renderMathInElement(container) {
        if (!container) container = document.body;
        if (typeof window.katex === 'undefined') return;

        // 1. Process explicit .math-expr elements
        const exprs = container.querySelectorAll('.math-expr, .math-tex, [data-katex]');
        exprs.forEach(el => {
            if (el.dataset.katexRendered === 'true' || el.classList.contains('katex-ready') || el.querySelector('.katex') || el.closest('.katex')) return;
            // If element contains math-cond, extract it or render math parts inside
            const condEl = el.querySelector('.math-cond');
            let condSaved = null;
            if (condEl) {
                condSaved = condEl.outerHTML;
                condEl.remove();
            }

            const originalHtml = el.innerHTML;
            const isDisplay = el.classList.contains('math-display') || el.tagName.toLowerCase() === 'div';
            const rendered = formatMath(originalHtml, isDisplay);
            if (rendered && rendered !== originalHtml) {
                el.innerHTML = condSaved ? `${rendered} ${condSaved}` : rendered;
                el.dataset.katexRendered = 'true';
                el.classList.add('katex-ready');
            } else if (condSaved) {
                el.innerHTML = `${originalHtml} ${condSaved}`;
            }
        });

        // 2. Process auto-render extension if available
        if (typeof window.renderMathInElement === 'function') {
            try {
                window.renderMathInElement(container, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true }
                    ],
                    throwOnError: false,
                    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option']
                });
            } catch (err) {
                console.warn('KaTeX auto-render warning:', err);
            }
        }
    }

    // Export to global scope
    window.StudyMath = {
        htmlToTeX: htmlToTeX,
        renderTeX: renderTeX,
        formatMath: formatMath,
        renderMathInElement: renderMathInElement
    };

    // Auto-init on DOMContentLoaded
    if (typeof document !== 'undefined' && document.addEventListener) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => renderMathInElement());
        } else {
            renderMathInElement();
        }
    }
})();
