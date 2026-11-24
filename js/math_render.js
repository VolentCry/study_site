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
        if (typeof window.katex !== 'undefined') {
            try {
                return window.katex.renderToString(tex, {
                    displayMode: displayMode,
                    output: 'html', // Отключает дублирующий слой MathML, предотвращая сдвоенный текст
                    throwOnError: false,
                    strict: false
                });
            } catch (e) {
                console.warn('KaTeX render warning:', e);
                return tex;
            }
        }
        return tex;
    }

    /**
     * Преобразует и рендерит фрагмент формулы
     */
    function formatMath(raw, displayMode = false) {
        if (!raw) return '';
        let rawStr = String(raw).trim();

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
            return `<div class="math-expr">${inner}</div>`;
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

        // 4. Remove non-semantic helper spans like <span class="expr-line">...</span>
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

        // 7. If it contains legacy HTML math structures
        if (rawStr.includes('class="fraction"') || rawStr.includes('class="rad-wrap"') || rawStr.includes('class="rad-sym"') || rawStr.includes('<sup>') || rawStr.includes('√') || rawStr.includes('·') || rawStr.includes('=') || /&\s*(?:le|ge|ne|radic|middot|minus|infin|cup|isin);/i.test(rawStr)) {
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
            if (el.dataset.katexRendered === 'true') return;
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
