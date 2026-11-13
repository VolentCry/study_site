(function() {
    // Theme setup
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    function updateHomeworkThemeUI(th) {
        const isLight = th === 'light';
        document.documentElement.setAttribute('data-theme', th);
        document.documentElement.dataset.theme = th;
        if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
    }
    const savedTheme = window.StudyTheme ? window.StudyTheme.get() : (localStorage.getItem('profileTheme') || localStorage.getItem('site_theme') || 'dark');
    updateHomeworkThemeUI(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (window.StudyTheme) {
                const next = window.StudyTheme.toggle(true);
                updateHomeworkThemeUI(next);
            } else {
                const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                const next = cur === 'dark' ? 'light' : 'dark';
                localStorage.setItem('profileTheme', next);
                localStorage.setItem('site_theme', next);
                updateHomeworkThemeUI(next);
            }
        });
    }

    window.addEventListener('study-theme-changed', (e) => {
        updateHomeworkThemeUI(e.detail);
    });

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const homeworkId = urlParams.get('id');
    const studentIdParam = urlParams.get('student_id');

    const loader = document.getElementById('hw-loader');
    const errorBox = document.getElementById('hw-error');
    const errorMsg = document.getElementById('error-message');
    const content = document.getElementById('hw-content');
    const tasksContainer = document.getElementById('tasks-container');
    const bottomBar = document.getElementById('hw-bottom-bar');
    const saveIndicator = document.getElementById('save-indicator');
    const saveIndicatorText = document.getElementById('save-indicator-text');
    const btnSaveDraft = document.getElementById('btn-save-draft');
    const btnSubmitHw = document.getElementById('btn-submit-hw');
    const submitModal = document.getElementById('submit-confirm-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnConfirmSubmit = document.getElementById('btn-confirm-submit');
    const toast = document.getElementById('toast');

    let hwData = null;
    let currentAnswers = {};
    let isSavingDraft = false;
    let draftDebounceTimer = null;

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatMathHtml(raw) {
        if (!raw) return '';
        let str = String(raw);

        // Convert caret power notation:
        // 1) Enclosed exponent in parentheses: 2^(3+2), x^(-2), (a+b)^(n+1)
        str = str.replace(/([a-zA-Z0-9_\)\]\}]+)\^\(([^)]+)\)/g, '$1<sup>$2</sup>');
        // 2) Simple exponent: 2^3, x^2, 10^-5, a^n
        str = str.replace(/([a-zA-Z0-9_\)\]\}]+)\^([+-]?\d+|[a-zA-Z])/g, '$1<sup>$2</sup>');

        // 3) Common unicode superscripts
        const supMap = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁺':'+', '⁻':'-' };
        str = str.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, match => {
            const converted = Array.from(match).map(ch => supMap[ch] || ch).join('');
            return `<sup>${converted}</sup>`;
        });

        // 4) Clean malformed &frac; entities and LaTeX fractions
        str = str.replace(/&frac;\s*([^{;\s]+)\s*;\s*\{?([^}]+)\}?/g, '<span class="fraction"><span class="num">$1</span><span class="den">$2</span></span>');
        str = str.replace(/\\?frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="num">$1</span><span class="den">$2</span></span>');

        return str;
    }

    function cleanDisplayAnswer(raw) {
        if (!raw) return '';
        let str = String(raw);
        str = str.replace(/<span class="fraction"><span class="num">([^<]+)<\/span><span class="den">([^<]+)<\/span><\/span>/g, '$1/$2');
        str = str.replace(/&frac;\s*([^{;\s]+)\s*;\s*\{?([^}]+)\}?/g, '$1/$2');
        str = str.replace(/\\?frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');
        str = str.replace(/<[^>]+>/g, '').trim();
        return str;
    }

    function formatSolutionStep(step) {
        if (!step) return '';
        let s = String(step);
        const hasTags = /<[a-z][\s\S]*>/i.test(s);
        if (!hasTags) {
            s = escapeHtml(s);
        }
        return formatMathHtml(s);
    }

    window.formatMathHtml = formatMathHtml;
    window.formatSolutionStep = formatSolutionStep;

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2800);
    }

    if (!homeworkId) {
        loader.style.display = 'none';
        errorBox.style.display = 'block';
        errorMsg.textContent = 'ID домашнего задания не указан в ссылке.';
        return;
    }

    async function loadHomework() {
        try {
            const queryStr = studentIdParam ? `?student_id=${encodeURIComponent(studentIdParam)}` : '';
            const res = await fetch(`/api/student/homeworks/${encodeURIComponent(homeworkId)}${queryStr}`);
            const data = await res.json();
            if (!data.success) {
                loader.style.display = 'none';
                errorBox.style.display = 'block';
                errorMsg.textContent = data.error || 'Ошибка загрузки задания';
                return;
            }

            hwData = data.homework;
            window.hwData = hwData;
            window.userRole = data.userRole || (hwData && hwData.viewerRole) || 'student';
            window.isTeacher = Boolean(data.isTeacher || (hwData && hwData.isTeacherView) || window.userRole === 'teacher' || window.userRole === 'admin');
            currentAnswers = {};
            if (hwData.submission && hwData.submission.answers) {
                const raw = hwData.submission.answers;
                Object.keys(raw).forEach(k => {
                    const val = raw[k];
                    currentAnswers[k] = (typeof val === 'object' && val !== null) ? String(val.answer || '') : String(val || '');
                });
            }
            renderHomework();
        } catch (err) {
            loader.style.display = 'none';
            errorBox.style.display = 'block';
            errorMsg.textContent = 'Не удалось подключиться к серверу.';
        }
    }

    function renderHomework() {
        loader.style.display = 'none';
        content.style.display = 'block';

        document.title = `${hwData.title} · Домашнее задание`;
        document.getElementById('hw-title').textContent = hwData.title;
        document.getElementById('hw-subject').textContent = hwData.subject || 'Предмет';
        document.getElementById('hw-class').textContent = hwData.class_name || hwData.className || 'Класс';
        document.getElementById('hw-tasks-count').textContent = hwData.tasks ? hwData.tasks.length : 0;
        document.getElementById('hw-teacher-name').textContent = hwData.teacher_name || hwData.teacherName || 'Учитель';

        if (hwData.description && hwData.description.trim()) {
            const descEl = document.getElementById('hw-description');
            descEl.textContent = hwData.description;
            descEl.style.display = 'block';
        }

        const rawCreated = hwData.created_at || hwData.createdAt;
        if (rawCreated) {
            const cd = new Date(rawCreated);
            document.getElementById('hw-created-at').textContent = cd.toLocaleString('ru-RU', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            });
        } else {
            document.getElementById('hw-created-at').textContent = '—';
        }

        const rawDeadline = hwData.deadline || hwData.deadlineAt || hwData.deadline_at;
        if (rawDeadline) {
            const d = new Date(rawDeadline);
            document.getElementById('hw-deadline').textContent = d.toLocaleString('ru-RU', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            });
        } else {
            document.getElementById('hw-deadline').textContent = 'Без ограничений';
        }

        // Status Badge & Scores
        const statusBadge = document.getElementById('hw-status-badge');
        const scoreWrap = document.getElementById('hw-score-wrap');
        const scoreEl = document.getElementById('hw-score');
        const feedbackBanner = document.getElementById('hw-feedback-banner');
        const feedbackText = document.getElementById('hw-feedback-text');

        const sub = hwData.submission || {};
        const status = sub.status || 'pending';
        const hasStudentSubmission = Boolean(sub.id && (sub.status === 'submitted' || sub.status === 'checked'));
        const isTeacher = Boolean(window.isTeacher || (hwData && hwData.isTeacherView));
        const isFinal = (status === 'submitted' || status === 'checked');

        if (isTeacher) {
            bottomBar.style.display = 'none';
        }

        if (status === 'checked') {
            statusBadge.className = 'badge badge-status status-checked';
            statusBadge.textContent = isTeacher ? `Проверено (ученик: ${escapeHtml(hwData.studentName || hwData.student_name || 'Ученик')})` : 'Проверено';
            scoreWrap.style.display = 'block';
            const maxScore = (sub.max_score != null) ? sub.max_score : ((sub.maxScore != null) ? sub.maxScore : hwData.tasks.length);
            scoreEl.textContent = `${sub.score || 0} / ${maxScore}`;

            const teacherFb = sub.teacher_feedback || sub.teacherFeedback;
            if (teacherFb && teacherFb.trim()) {
                feedbackBanner.style.display = 'flex';
                feedbackText.textContent = teacherFb;
            }
            bottomBar.style.display = 'none';
        } else if (status === 'submitted') {
            statusBadge.className = 'badge badge-status status-submitted';
            statusBadge.textContent = isTeacher ? `Сдано на проверку (ученик: ${escapeHtml(hwData.studentName || hwData.student_name || 'Ученик')})` : 'На проверке';
            bottomBar.style.display = 'none';
        } else if (isTeacher) {
            statusBadge.className = 'badge badge-status';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            statusBadge.style.color = 'var(--accent-emerald)';
            statusBadge.style.border = '1px solid rgba(16, 185, 129, 0.35)';
            statusBadge.innerHTML = '👀 Режим просмотра учителя · Ответы открыты';
            if (scoreWrap) scoreWrap.style.display = 'none';
            bottomBar.style.display = 'none';
        } else {
            statusBadge.className = 'badge badge-status status-pending';
            const hasAnyAns = Object.values(currentAnswers).some(v => v && String(v).trim().length > 0);
            statusBadge.textContent = hasAnyAns ? 'В процессе' : 'Не начато';
            if (!isTeacher) bottomBar.style.display = 'flex';
        }

        // Teacher Review Panel setup
        const teacherReviewBar = document.getElementById('teacher-review-bar');
        const navBackBtn = document.getElementById('hw-nav-back');
        if (isTeacher && navBackBtn) {
            navBackBtn.href = 'teacher.html';
            navBackBtn.innerHTML = '<span>← В панель учителя</span>';
        }

        if (isTeacher && sub && (sub.id || studentIdParam || hwData.studentId)) {
            if (teacherReviewBar) {
                teacherReviewBar.style.display = 'flex';
                const studentDisplayName = hwData.studentName || hwData.student_name || 'Ученик';
                document.getElementById('teacher-grade-student-name').textContent = studentDisplayName;

                const maxScore = (sub.max_score != null) ? sub.max_score : ((sub.maxScore != null) ? sub.maxScore : (hwData.tasks ? hwData.tasks.length : 0));
                document.getElementById('teacher-grade-max-score').textContent = maxScore;
                document.getElementById('teacher-max-score-label').textContent = maxScore;

                // Calculate auto-score (count of correct answers)
                let autoScore = 0;
                if (hwData.tasks) {
                    autoScore = hwData.tasks.filter(t => t.is_correct === true || t.isCorrect === true).length;
                }
                if (sub.score != null) {
                    autoScore = sub.score;
                }
                document.getElementById('teacher-grade-calc-score').textContent = autoScore;

                const scoreInput = document.getElementById('teacher-score-input');
                scoreInput.max = maxScore;
                scoreInput.value = (sub.score != null) ? sub.score : autoScore;

                const feedbackInput = document.getElementById('teacher-feedback-input');
                feedbackInput.value = sub.teacher_feedback || sub.teacherFeedback || '';

                const hintEl = document.getElementById('teacher-grade-status-hint');
                if (hintEl) {
                    hintEl.textContent = (status === 'checked')
                        ? 'Работа уже проверена. Вы можете скорректировать оценку или комментарий.'
                        : 'Работа сдана учеником. Ознакомьтесь с решениями и сохраните результат.';
                }
            }
        } else if (teacherReviewBar) {
            teacherReviewBar.style.display = 'none';
        }

        // Render task cards
        tasksContainer.innerHTML = '';
        (hwData.tasks || []).forEach((task, index) => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.id = `task-card-${index}`;

            // Extract student answer
            let studentVal = '';
            if (task.studentAnswer !== undefined && task.studentAnswer !== null && String(task.studentAnswer).trim() !== '') {
                studentVal = String(task.studentAnswer).trim();
            } else if (currentAnswers[index] !== undefined && currentAnswers[index] !== null && String(currentAnswers[index]).trim() !== '') {
                studentVal = String(currentAnswers[index]).trim();
            } else if (currentAnswers[String(index)] !== undefined && currentAnswers[String(index)] !== null && String(currentAnswers[String(index)]).trim() !== '') {
                studentVal = String(currentAnswers[String(index)]).trim();
            } else if (task.taskId && currentAnswers[task.taskId] !== undefined && String(currentAnswers[task.taskId]).trim() !== '') {
                studentVal = String(currentAnswers[task.taskId]).trim();
            } else if (currentAnswers[`task_${index + 1}`] !== undefined && String(currentAnswers[`task_${index + 1}`]).trim() !== '') {
                studentVal = String(currentAnswers[`task_${index + 1}`]).trim();
            }
            currentAnswers[index] = studentVal;

            let answerUiHtml = '';
            let solutionHtml = '';

            const rawAns = task.displayAnswer || task.answer || '';
            const correctAnsDisplay = formatMathHtml(escapeHtml(cleanDisplayAnswer(rawAns) || String(rawAns)));

            if (isTeacher && !hasStudentSubmission) {
                card.classList.add('is-teacher-view');
                answerUiHtml = `
                    <div class="answer-box teacher-answer-box" style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:12px 16px;">
                        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                            <div class="submitted-pill pill-correct" style="margin:0; background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.4);">
                                <span class="submitted-pill-label" style="font-weight:700; color:var(--accent-emerald);">Правильный ответ:</span>
                                <strong class="submitted-pill-val" style="font-size:1.1rem; color:var(--accent-emerald);">${correctAnsDisplay || '—'}</strong>
                            </div>
                            <span class="task-result-status res-correct" style="font-weight:700; font-size:0.82rem;">
                                ✓ Ответ для учителя
                            </span>
                        </div>
                    </div>
                `;

                if (task.solutionSteps && task.solutionSteps.length > 0) {
                    const stepsLi = task.solutionSteps.map(s => `<li>${formatSolutionStep(s)}</li>`).join('');
                    solutionHtml = `
                        <details class="solution-details" open style="margin-top:12px;">
                            <summary style="cursor:pointer; font-weight:700; color:var(--accent-cyan);">💡 Разбор и ход решения задачи</summary>
                            <div class="solution-steps" style="margin-top:8px;">
                                <ol>${stepsLi}</ol>
                            </div>
                        </details>
                    `;
                }
            } else if (status === 'checked') {
                const isCorrect = (task.is_correct === true || task.isCorrect === true);
                if (isCorrect) {
                    card.classList.add('is-correct');
                } else {
                    card.classList.add('is-incorrect');
                }

                answerUiHtml = `
                    <div class="answer-box">
                        <div class="submitted-pill ${isCorrect ? 'pill-correct' : 'pill-incorrect'}">
                            <span class="submitted-pill-label">${isTeacher ? 'Ответ ученика:' : 'Ваш ответ:'}</span>
                            <strong class="submitted-pill-val">${escapeHtml(studentVal || '— (не решено)')}</strong>
                        </div>
                        <span class="task-result-status ${isCorrect ? 'res-correct' : 'res-incorrect'}">
                            ${isCorrect 
                                ? '✓ Верно (+1 балл)' 
                                : `✗ Неверно (Правильный ответ: <strong>${correctAnsDisplay}</strong>)`}
                        </span>
                    </div>
                `;

                // Solution steps if available
                if (task.solutionSteps && task.solutionSteps.length > 0) {
                    const stepsLi = task.solutionSteps.map(s => `<li>${formatSolutionStep(s)}</li>`).join('');
                    solutionHtml = `
                        <details class="solution-details">
                            <summary>Разбор и ход решения задачи</summary>
                            <div class="solution-steps">
                                <ol>${stepsLi}</ol>
                            </div>
                        </details>
                    `;
                }
            } else if (status === 'submitted') {
                answerUiHtml = `
                    <div class="answer-box">
                        <div class="submitted-pill">
                            <span class="submitted-pill-label">${isTeacher ? 'Ответ ученика:' : 'Ваш отправленный ответ:'}</span>
                            <strong class="submitted-pill-val">${escapeHtml(studentVal || '— (не заполнено)')}</strong>
                        </div>
                        ${isTeacher ? `
                            <div class="submitted-pill pill-correct" style="margin-top:8px; display:inline-flex;">
                                <span class="submitted-pill-label">Правильный ответ:</span>
                                <strong class="submitted-pill-val">${correctAnsDisplay || '—'}</strong>
                            </div>
                        ` : `
                            <span class="task-result-status" style="color:var(--muted); font-size:0.85rem; font-weight:500;">
                                🔒 Ответ сохранён и зафиксирован
                            </span>
                        `}
                    </div>
                `;

                if (isTeacher && task.solutionSteps && task.solutionSteps.length > 0) {
                    const stepsLi = task.solutionSteps.map(s => `<li>${formatSolutionStep(s)}</li>`).join('');
                    solutionHtml = `
                        <details class="solution-details" style="margin-top:12px;">
                            <summary style="cursor:pointer; font-weight:700; color:var(--accent-cyan);">💡 Разбор и ход решения задачи</summary>
                            <div class="solution-steps" style="margin-top:8px;">
                                <ol>${stepsLi}</ol>
                            </div>
                        </details>
                    `;
                }
            } else {
                answerUiHtml = `
                    <div class="answer-box">
                        <div class="input-group">
                            <input type="text"
                                class="answer-input"
                                id="input-task-${index}"
                                placeholder="Ваш ответ..."
                                value="${escapeHtml(studentVal)}"
                                autocomplete="off"
                                inputmode="decimal">
                        </div>
                    </div>
                `;
            }

            const categoryName = task.catName || task.category || 'Задание';

            card.innerHTML = `
                <div class="task-header">
                    <span class="task-number">Задание №${index + 1}</span>
                    <span class="task-cat">${escapeHtml(categoryName)}</span>
                </div>
                <div class="task-body">
                    ${task.questionHtml ? formatMathHtml(task.questionHtml) : formatMathHtml(escapeHtml(task.text || ''))}
                </div>
                ${answerUiHtml}
                ${solutionHtml}
            `;

            tasksContainer.appendChild(card);

            // Input change event (only for students solving)
            if (!isFinal && !isTeacher) {
                const input = card.querySelector(`#input-task-${index}`);
                if (input) {
                    input.addEventListener('input', (e) => {
                        currentAnswers[index] = e.target.value.trim();
                        triggerAutoSaveDraft();
                    });
                }
            }
        });
    }

    function triggerAutoSaveDraft() {
        saveIndicator.className = 'save-indicator saving';
        saveIndicatorText.textContent = 'Сохранение черновика...';
        if (draftDebounceTimer) clearTimeout(draftDebounceTimer);
        draftDebounceTimer = setTimeout(saveDraft, 1200);
    }

    async function saveDraft() {
        if (isSavingDraft) return;
        isSavingDraft = true;
        try {
            const res = await fetch(`/api/student/homeworks/${encodeURIComponent(homeworkId)}/draft`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: currentAnswers })
            });
            const data = await res.json();
            if (data.success) {
                saveIndicator.className = 'save-indicator saved';
                saveIndicatorText.textContent = 'Черновик сохранён';
            }
        } catch (e) {
            saveIndicator.className = 'save-indicator';
            saveIndicatorText.textContent = 'Ошибка сохранения';
        } finally {
            isSavingDraft = false;
        }
    }

    btnSaveDraft.addEventListener('click', async () => {
        await saveDraft();
        showToast('Черновик успешно сохранён');
    });

    btnSubmitHw.addEventListener('click', () => {
        // Check if any answers filled
        const totalTasks = hwData.tasks ? hwData.tasks.length : 0;
        const filledCount = Object.values(currentAnswers).filter(v => v !== '').length;
        if (filledCount === 0) {
            alert('Пожалуйста, решите хотя бы одно задание перед отправкой.');
            return;
        }
        submitModal.style.display = 'flex';
    });

    btnCancelModal.addEventListener('click', () => {
        submitModal.style.display = 'none';
    });

    btnConfirmSubmit.addEventListener('click', async () => {
        btnConfirmSubmit.disabled = true;
        btnConfirmSubmit.textContent = 'Отправка...';

        try {
            const res = await fetch(`/api/student/homeworks/${encodeURIComponent(homeworkId)}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: currentAnswers })
            });
            const data = await res.json();
            if (data.success) {
                submitModal.style.display = 'none';
                showToast('Работа успешно сдана учителю!');
                // Reload page to display submitted status
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                alert(data.error || 'Ошибка при отправке работы');
                btnConfirmSubmit.disabled = false;
                btnConfirmSubmit.textContent = 'Да, сдать работу';
            }
        } catch (e) {
            alert('Не удалось отправить работу на сервер.');
            btnConfirmSubmit.disabled = false;
            btnConfirmSubmit.textContent = 'Да, сдать работу';
        }
    });

    // Teacher Grading form submission
    const teacherGradeForm = document.getElementById('teacher-grade-form');
    if (teacherGradeForm) {
        teacherGradeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const scoreInput = document.getElementById('teacher-score-input');
            const feedbackInput = document.getElementById('teacher-feedback-input');
            const saveBtn = document.getElementById('btn-save-grade');

            const score = parseInt(scoreInput.value, 10);
            const feedback = (feedbackInput.value || '').trim();

            const sub = (hwData && hwData.submission) || {};
            const subId = sub.id || sub.submissionId || 0;
            const studentId = hwData.studentId || hwData.student_id || studentIdParam;

            saveBtn.disabled = true;
            saveBtn.textContent = 'Сохранение...';

            try {
                const res = await fetch(`/api/teacher/submissions/${subId}/grade`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        score,
                        teacher_feedback: feedback,
                        teacherFeedback: feedback,
                        student_id: studentId,
                        homework_id: homeworkId
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast('✓ Оценка и отзыв успешно сохранены!');
                    const statusBadge = document.getElementById('hw-status-badge');
                    if (statusBadge) {
                        statusBadge.className = 'badge badge-status status-checked';
                        statusBadge.textContent = `Проверено (ученик: ${escapeHtml(hwData.studentName || 'Ученик')})`;
                    }
                    const scoreWrap = document.getElementById('hw-score-wrap');
                    const scoreEl = document.getElementById('hw-score');
                    if (scoreWrap && scoreEl) {
                        scoreWrap.style.display = 'block';
                        const maxSc = (sub.max_score != null) ? sub.max_score : (hwData.tasks ? hwData.tasks.length : score);
                        scoreEl.textContent = `${score} / ${maxSc}`;
                    }
                    const hintEl = document.getElementById('teacher-grade-status-hint');
                    if (hintEl) {
                        hintEl.textContent = 'Оценка обновлена! Вы можете изменить её при необходимости.';
                    }
                    try {
                        if (window.opener) {
                            window.opener.postMessage({ type: 'hw-graded', homeworkId, studentId }, '*');
                        }
                    } catch (postErr) {}
                } else {
                    alert(data.error || 'Ошибка при сохранении оценки');
                }
            } catch (err) {
                alert('Не удалось подключиться к серверу');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Сохранить оценку и отзыв';
            }
        });
    }

    // Start loading
    loadHomework();
})();