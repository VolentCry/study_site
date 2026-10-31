/**
 * ============================================================================
 * МЕТОДИЧЕСКИЙ ПЛАН И УЧЁТ ПРОВЕДЁННЫХ ЗАНЯТИЙ
 * ============================================================================
 * Полнофункциональный конструктор и журнал методического плана:
 * - Список тем с разбивкой по часам и подсветкой 2-й части
 * - Примерное количество занятий за год с автоматическим подсчётом итога
 * - Расписание по месяцам с темами уроков, отметками повторения и таблицей учёта проведения [x]
 * - Печать и экспорт в PDF в точности по стандарту методического плана
 * - Поддержка режимов учителя (редактирование, отметка проведения) и ученика (просмотр прогресса)
 */

(function () {
    'use strict';

    // Состояние текущего модуля
    let currentPlan = null;
    let availablePlans = [];
    let isTeacherUser = false;
    let currentUser = null;
    let isEditing = false;

    // Месяцы учебного года по умолчанию
    const ACADEMIC_MONTHS = [
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'
    ];

    // Шаблон по умолчанию (ОГЭ Математика)
    let defaultTemplateCache = null;

    // Внедрение стилей
    function injectStyles() {
        if (document.getElementById('methodical-plan-styles')) return;

        const style = document.createElement('style');
        style.id = 'methodical-plan-styles';
        style.textContent = `
            /* --- METHODICAL PLAN STYLES --- */
            .plan-dialog {
                width: 96vw;
                max-width: 1040px;
                max-height: 92vh;
                background: var(--bg-card, #161a23);
                color: var(--ink, #f1f5f9);
                border: 1px solid var(--line, rgba(255,255,255,0.12));
                border-radius: 16px;
                padding: 0;
                box-shadow: 0 25px 60px rgba(0,0,0,0.6);
                overflow: hidden;
            }
            .plan-dialog::backdrop {
                background: rgba(0, 0, 0, 0.78);
                backdrop-filter: blur(8px);
            }
            .plan-modal-wrap {
                display: flex;
                flex-direction: column;
                max-height: 92vh;
            }
            .plan-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 24px;
                background: rgba(255,255,255,0.02);
                border-bottom: 1px solid var(--line, rgba(255,255,255,0.08));
                position: sticky;
                top: 0;
                z-index: 10;
            }
            .plan-modal-body {
                padding: 24px;
                overflow-y: auto;
                flex: 1;
            }
            .plan-modal-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 24px;
                background: rgba(255,255,255,0.02);
                border-top: 1px solid var(--line, rgba(255,255,255,0.08));
            }
            .plan-hero-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                border-radius: 12px;
                padding: 18px 20px;
                margin-bottom: 20px;
            }
            .plan-title-input {
                font-family: var(--f-display, inherit);
                font-size: 1.4rem;
                font-weight: 800;
                width: 100%;
                background: transparent;
                border: 1px dashed transparent;
                border-radius: 6px;
                color: var(--ink, inherit);
                padding: 4px 8px;
                margin-bottom: 6px;
                transition: border-color 0.2s, background 0.2s;
            }
            .plan-title-input:hover, .plan-title-input:focus {
                border-color: var(--accent, #6366f1);
                background: rgba(255,255,255,0.04);
                outline: none;
            }
            .plan-tags-row {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            .plan-tag-badge {
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--accent, #818cf8);
                background: rgba(99, 102, 241, 0.12);
                padding: 3px 10px;
                border-radius: 9999px;
            }
            .plan-meta-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin-top: 12px;
            }
            .plan-kpi-banner {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 12px;
                margin-bottom: 24px;
            }
            .plan-kpi-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                border-radius: 10px;
                padding: 12px 16px;
                text-align: center;
            }
            .plan-kpi-val {
                font-family: var(--f-display, inherit);
                font-size: 1.5rem;
                font-weight: 800;
            }
            .plan-kpi-lbl {
                font-size: 0.78rem;
                color: var(--muted, #94a3b8);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-top: 2px;
            }
            /* Section Boxes */
            .plan-section {
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                border-radius: 12px;
                padding: 18px 20px;
                margin-bottom: 24px;
            }
            .plan-section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;
                flex-wrap: wrap;
                gap: 8px;
            }
            .plan-section-title {
                font-family: var(--f-display, inherit);
                font-size: 1.1rem;
                font-weight: 700;
            }
            /* Topics List */
            .topic-item-row {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                border-radius: 8px;
                margin-bottom: 6px;
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(255,255,255,0.04);
                transition: background 0.15s;
            }
            .topic-item-row.part2-highlight {
                background: rgba(168, 85, 247, 0.15) !important;
                border-color: rgba(168, 85, 247, 0.35) !important;
            }
            .topic-idx {
                font-weight: 700;
                font-size: 0.85rem;
                color: var(--muted, #94a3b8);
                width: 24px;
                flex-shrink: 0;
            }
            .topic-title-input {
                flex: 1;
                background: transparent;
                border: 1px solid transparent;
                color: var(--ink, inherit);
                padding: 4px 6px;
                border-radius: 4px;
                font-size: 0.9rem;
            }
            .topic-title-input:hover, .topic-title-input:focus {
                background: rgba(255,255,255,0.05);
                border-color: var(--line, rgba(255,255,255,0.15));
                outline: none;
            }
            .topic-hours-input {
                width: 110px;
                background: transparent;
                border: 1px solid transparent;
                color: var(--muted, #94a3b8);
                font-size: 0.82rem;
                text-align: right;
                padding: 4px 6px;
                border-radius: 4px;
            }
            .topic-hours-input:hover, .topic-hours-input:focus {
                background: rgba(255,255,255,0.05);
                border-color: var(--line, rgba(255,255,255,0.15));
                outline: none;
            }
            .topic-part-toggle {
                font-size: 0.75rem;
                padding: 3px 8px;
                border-radius: 4px;
                cursor: pointer;
                user-select: none;
                border: 1px solid rgba(255,255,255,0.15);
                background: transparent;
                color: var(--muted, #94a3b8);
            }
            .topic-part-toggle.active {
                background: #8b5cf6;
                color: #ffffff;
                border-color: #8b5cf6;
                font-weight: 700;
            }
            /* Monthly Grid */
            .month-counts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                gap: 10px;
                margin-bottom: 14px;
            }
            .month-count-box {
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                border-radius: 8px;
                padding: 10px;
                text-align: center;
            }
            .month-count-name {
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--muted, #94a3b8);
                margin-bottom: 4px;
            }
            .month-count-input {
                width: 60px;
                text-align: center;
                font-family: var(--f-display, inherit);
                font-size: 1.15rem;
                font-weight: 700;
                background: rgba(255,255,255,0.04);
                border: 1px solid var(--line, rgba(255,255,255,0.15));
                border-radius: 6px;
                color: var(--ink, inherit);
                padding: 3px 0;
            }
            .month-total-banner {
                background: linear-gradient(90deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12));
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 8px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1rem;
            }
            /* Monthly Lessons Timeline & Tracking Table */
            .month-block {
                background: rgba(255,255,255,0.015);
                border: 1px solid var(--line, rgba(255,255,255,0.06));
                border-radius: 10px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .month-block-title {
                font-size: 1.05rem;
                font-weight: 700;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .lesson-input-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .lesson-idx-badge {
                font-family: var(--f-mono, monospace);
                font-size: 0.78rem;
                font-weight: 700;
                color: var(--muted, #94a3b8);
                width: 24px;
                text-align: right;
                flex-shrink: 0;
            }
            .lesson-title-input {
                flex: 1;
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                border-radius: 6px;
                color: var(--ink, inherit);
                padding: 6px 10px;
                font-size: 0.88rem;
            }
            .lesson-title-input:focus {
                border-color: var(--accent, #6366f1);
                outline: none;
            }
            .lesson-review-tag {
                background: rgba(59, 130, 246, 0.18);
                color: #60a5fa;
                border: 1px solid rgba(59, 130, 246, 0.35);
                font-size: 0.75rem;
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
            }
            /* Table of Conducted Lessons [x] */
            .conducted-tracking-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--line, rgba(255,255,255,0.12));
                border-radius: 6px;
                overflow: hidden;
            }
            .conducted-tracking-table th,
            .conducted-tracking-table td {
                border: 1px solid var(--line, rgba(255,255,255,0.08));
                text-align: center;
                padding: 8px 4px;
                font-size: 0.82rem;
            }
            .conducted-tracking-table th {
                background: rgba(255,255,255,0.04);
                font-weight: 700;
                color: var(--muted, #94a3b8);
            }
            .lesson-checkbox-btn {
                width: 28px;
                height: 28px;
                border-radius: 6px;
                border: 1.5px solid var(--line, rgba(255,255,255,0.2));
                background: rgba(255,255,255,0.04);
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 0.95rem;
                font-weight: 800;
                transition: all 0.15s;
                user-select: none;
            }
            .lesson-checkbox-btn:hover {
                border-color: #10b981;
                transform: scale(1.05);
            }
            .lesson-checkbox-btn.checked {
                background: #10b981;
                border-color: #10b981;
                color: #ffffff;
            }
            /* Print View Styles */
            @media print {
                body * {
                    visibility: hidden !important;
                }
                #modal-methodical-plan,
                #modal-methodical-plan * {
                    visibility: visible !important;
                }
                #modal-methodical-plan {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: #ffffff !important;
                    color: #000000 !important;
                    padding: 0 !important;
                }
                .plan-modal-header,
                .plan-modal-footer,
                .no-print {
                    display: none !important;
                }
                .plan-modal-body {
                    padding: 0 !important;
                    overflow: visible !important;
                }
                .topic-item-row.part2-highlight {
                    background-color: #e9d5ff !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .conducted-tracking-table,
                .conducted-tracking-table th,
                .conducted-tracking-table td {
                    border: 1px solid #000000 !important;
                    color: #000000 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Получение текущего пользователя и роли
    async function fetchUserRole() {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data.loggedIn && data.user) {
                    currentUser = data.user;
                    isTeacherUser = (data.user.role === 'teacher' || data.user.role === 'admin');
                }
            }
        } catch (e) {
            console.warn('[MethodicalPlan] Ошибка проверки роли:', e);
        }
    }

    // Получение шаблона
    async function getOgeMathTemplate() {
        if (defaultTemplateCache) return JSON.parse(JSON.stringify(defaultTemplateCache));
        try {
            const res = await fetch('/api/methodical-plans/template/oge-math');
            const data = await res.json();
            if (data.success && data.template) {
                defaultTemplateCache = data.template;
                return JSON.parse(JSON.stringify(data.template));
            }
        } catch (e) {
            console.error('[MethodicalPlan] Ошибка загрузки шаблона:', e);
        }
        return null;
    }

    // Создание модального окна в DOM
    function ensureModalExists() {
        if (document.getElementById('modal-methodical-plan')) return;

        const dialog = document.createElement('dialog');
        dialog.id = 'modal-methodical-plan';
        dialog.className = 'plan-dialog';
        dialog.innerHTML = `
            <div class="plan-modal-wrap">
                <!-- Header -->
                <div class="plan-modal-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:1.3rem;">📋</span>
                        <div>
                            <h3 style="font-size:1.15rem; font-weight:800; margin:0;" id="plan-modal-heading">Методический план занятий</h3>
                            <div style="font-size:0.8rem; color:var(--muted);" id="plan-modal-sub">Планирование учебных тем и контроль проведения уроков</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;" class="no-print">
                        <select id="plan-select-dropdown" class="form-select form-select-sm" style="max-width:220px; font-size:0.85rem; display:none;">
                            <option value="">Выберите план...</option>
                        </select>
                        <button type="button" class="btn btn-secondary btn-sm" id="btn-plan-new" style="display:none;" title="Создать новый методический план">
                            ➕ Новый
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" id="btn-plan-load-template" style="display:none;" title="Заполнить по образцу ОГЭ Математика">
                            ⚡ Шаблон ОГЭ
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" id="btn-plan-print" title="Печать или экспорт в PDF">
                            🖨️ Печать
                        </button>
                        <button type="button" class="modal-close" id="btn-plan-close" style="font-size:1.1rem; padding:4px 8px; border:none; background:transparent; color:var(--muted); cursor:pointer;">✕</button>
                    </div>
                </div>

                <!-- Body -->
                <div class="plan-modal-body" id="plan-modal-body">
                    <!-- Загрузка содержимого -->
                    <div style="text-align:center; padding:3rem; color:var(--muted);">
                        Загрузка методического плана...
                    </div>
                </div>

                <!-- Footer -->
                <div class="plan-modal-footer no-print">
                    <div id="plan-status-indicator" style="font-size:0.85rem; color:var(--muted);">
                        <!-- Статус сохранения -->
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button type="button" class="btn btn-secondary" id="btn-plan-close-footer">Закрыть</button>
                        <button type="button" class="btn btn-emerald" id="btn-plan-save" style="display:none;">
                            💾 Сохранить план
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        // Слушатели закрытия
        document.getElementById('btn-plan-close')?.addEventListener('click', () => dialog.close());
        document.getElementById('btn-plan-close-footer')?.addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
        });

        // Слушатель печати
        document.getElementById('btn-plan-print')?.addEventListener('click', () => {
            window.print();
        });

        // Слушатель кнопки "Шаблон ОГЭ"
        document.getElementById('btn-plan-load-template')?.addEventListener('click', async () => {
            if (confirm('Заполнить поля методического плана эталонным образцом ОГЭ по математике (Роман Аспидов, 59 занятий)?')) {
                const tmpl = await getOgeMathTemplate();
                if (tmpl) {
                    currentPlan = { ...tmpl, id: currentPlan?.id || null };
                    renderPlanView(true);
                    showToast('Образец ОГЭ успешно загружен!');
                }
            }
        });

        // Слушатель кнопки "Новый план"
        document.getElementById('btn-plan-new')?.addEventListener('click', () => {
            currentPlan = {
                id: null,
                title: 'Методический план по математике. 2026-2027 учебный год',
                studentName: 'Новый ученик',
                academicYear: '2026-2027',
                subject: 'Математика',
                tags: ['#Репетиторство', '#Обучение'],
                goals: 'Подготовка к экзамену',
                legend: '(Цветом выделены задания 2-ой части)',
                topics: [],
                monthlyCounts: {
                    'Сентябрь': 0, 'Октябрь': 8, 'Ноябрь': 8, 'Декабрь': 8,
                    'Январь': 8, 'Февраль': 8, 'Март': 8, 'Апрель': 8, 'Май': 8
                },
                monthlyLessons: {}
            };
            renderPlanView(true);
        });

        // Слушатель кнопки "Сохранить план"
        document.getElementById('btn-plan-save')?.addEventListener('click', () => {
            saveCurrentPlan();
        });

        // Слушатель смены плана в выпадающем списке
        document.getElementById('plan-select-dropdown')?.addEventListener('change', (e) => {
            const planId = parseInt(e.target.value, 10);
            if (planId) {
                loadPlanById(planId);
            }
        });
    }

    // Уведомление Toast
    function showToast(msg) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg);
            return;
        }
        const ind = document.getElementById('plan-status-indicator');
        if (ind) {
            ind.textContent = msg;
            ind.style.color = 'var(--accent-emerald, #10b981)';
            setTimeout(() => {
                if (ind) ind.textContent = '';
            }, 3000);
        }
    }

    // Загрузка доступных планов
    async function loadPlansList(preselectStudentId = null) {
        try {
            let url = '/api/methodical-plans';
            if (preselectStudentId) url += `?studentId=${preselectStudentId}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('Ошибка загрузки планов');
            const data = await res.json();
            availablePlans = data.plans || [];

            const dropdown = document.getElementById('plan-select-dropdown');
            if (dropdown) {
                if (availablePlans.length > 0 && isTeacherUser) {
                    dropdown.style.display = 'inline-block';
                    dropdown.innerHTML = '<option value="">-- Выбрать план --</option>' + availablePlans.map(p => `
                        <option value="${p.id}">${escapeHtml(p.studentName || p.title)} (${p.academicYear || '2026-2027'})</option>
                    `).join('');
                } else {
                    dropdown.style.display = 'none';
                }
            }

            if (availablePlans.length > 0) {
                // Если был указан конкретный студент или открываем первый
                currentPlan = availablePlans[0];
                if (dropdown) dropdown.value = currentPlan.id;
                renderPlanView(isTeacherUser);
            } else if (isTeacherUser) {
                // Если планов ещё нет, загружаем эталон ОГЭ
                const tmpl = await getOgeMathTemplate();
                currentPlan = tmpl || {
                    id: null,
                    title: 'Методический план по математике. 2026-2027 учебный год',
                    studentName: 'Аспидов Роман',
                    academicYear: '2026-2027',
                    subject: 'Математика',
                    tags: ['#Репетиторство', '#Обучение'],
                    goals: 'Подготовка ОГЭ по Математике на оценку "Отлично" (22+ баллов)',
                    legend: '(Цветом выделены задания 2-ой части)',
                    topics: [],
                    monthlyCounts: {},
                    monthlyLessons: {}
                };
                renderPlanView(true);
            } else {
                // Ученик без назначенного плана
                const body = document.getElementById('plan-modal-body');
                if (body) {
                    body.innerHTML = `
                        <div style="text-align:center; padding:3rem 1.5rem; color:var(--muted);">
                            <div style="font-size:3rem; margin-bottom:12px;">📋</div>
                            <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:8px; color:var(--ink);">Методический план пока не составлен</h3>
                            <p style="max-width:450px; margin:0 auto; font-size:0.9rem;">Ваш преподаватель ещё не прикрепил индивидуальный методический план занятий. Как только план будет готов, он появится в этом разделе.</p>
                        </div>
                    `;
                }
            }
        } catch (e) {
            console.error('[MethodicalPlan] Ошибка загрузки списка планов:', e);
            const body = document.getElementById('plan-modal-body');
            if (body) body.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--danger, #ef4444);">Ошибка загрузки планов: ${escapeHtml(e.message)}</div>`;
        }
    }

    // Загрузка плана по ID
    async function loadPlanById(planId) {
        try {
            const body = document.getElementById('plan-modal-body');
            if (body) body.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--muted);">Загрузка плана...</div>';

            const res = await fetch(`/api/methodical-plans/${planId}`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Не удалось открыть план');
            const data = await res.json();
            if (data.success && data.plan) {
                currentPlan = data.plan;
                renderPlanView(isTeacherUser);
            }
        } catch (e) {
            alert('Ошибка открытия плана: ' + e.message);
        }
    }

    // Сохранение плана на сервер
    async function saveCurrentPlan() {
        if (!currentPlan) return;
        collectFormData();

        const btnSave = document.getElementById('btn-plan-save');
        if (btnSave) {
            btnSave.disabled = true;
            btnSave.textContent = 'Сохранение...';
        }

        try {
            let res;
            if (currentPlan.id) {
                res = await fetch(`/api/methodical-plans/${currentPlan.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPlan)
                });
            } else {
                res = await fetch('/api/methodical-plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPlan)
                });
            }

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка при сохранении');

            if (data.id) currentPlan.id = data.id;
            if (data.plan) currentPlan = data.plan;

            showToast('План успешно сохранён!');
            loadPlansList();
        } catch (e) {
            alert('Не удалось сохранить план: ' + e.message);
        } finally {
            if (btnSave) {
                btnSave.disabled = false;
                btnSave.textContent = '💾 Сохранить план';
            }
        }
    }

    // Быстрое переключение статуса урока [x]
    async function toggleLessonConducted(month, lessonIndex, newStatus) {
        if (!currentPlan) return;

        // Обновляем локально
        if (!currentPlan.monthlyLessons) currentPlan.monthlyLessons = {};
        if (!Array.isArray(currentPlan.monthlyLessons[month])) currentPlan.monthlyLessons[month] = [];
        const mList = currentPlan.monthlyLessons[month];

        while (mList.length <= lessonIndex) {
            mList.push({ num: mList.length + 1, title: '', isConducted: false });
        }
        mList[lessonIndex].isConducted = newStatus;

        // Пересчитываем KPI плашки
        updateKpiDisplay();

        // Если план сохранён в БД, отправляем точечный PATCH запрос
        if (currentPlan.id) {
            try {
                await fetch(`/api/methodical-plans/${currentPlan.id}/toggle-lesson`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        month: month,
                        lessonIndex: lessonIndex,
                        isConducted: newStatus
                    })
                });
            } catch (e) {
                console.warn('[MethodicalPlan] Ошибка отправки статуса урока:', e);
            }
        }
    }

    // Сбор данных из формы перед сохранением
    function collectFormData() {
        if (!currentPlan) return;

        const titleEl = document.getElementById('plan-input-title');
        if (titleEl) currentPlan.title = titleEl.value.trim();

        const snameEl = document.getElementById('plan-input-student');
        if (snameEl) currentPlan.studentName = snameEl.value.trim();

        const yearEl = document.getElementById('plan-input-year');
        if (yearEl) currentPlan.academicYear = yearEl.value.trim();

        const goalsEl = document.getElementById('plan-input-goals');
        if (goalsEl) currentPlan.goals = goalsEl.value.trim();

        // Сбор тем
        const topics = [];
        document.querySelectorAll('.topic-item-row').forEach((row, idx) => {
            const titleInput = row.querySelector('.topic-title-input');
            const hoursInput = row.querySelector('.topic-hours-input');
            const isPart2 = row.classList.contains('part2-highlight');
            if (titleInput) {
                topics.push({
                    id: idx + 1,
                    num: idx + 1,
                    title: titleInput.value.trim(),
                    hours: hoursInput ? hoursInput.value.trim() : '1 занятие',
                    isPart2: isPart2
                });
            }
        });
        currentPlan.topics = topics;

        // Сбор месячных квот
        const monthlyCounts = {};
        document.querySelectorAll('.month-count-input').forEach(inp => {
            const m = inp.getAttribute('data-month');
            const val = parseInt(inp.value, 10);
            if (m) monthlyCounts[m] = isNaN(val) ? 0 : val;
        });
        currentPlan.monthlyCounts = monthlyCounts;

        // Сбор тем уроков по месяцам
        if (!currentPlan.monthlyLessons) currentPlan.monthlyLessons = {};
        document.querySelectorAll('.month-block').forEach(mBlock => {
            const month = mBlock.getAttribute('data-month');
            if (!month) return;
            const lessonsList = currentPlan.monthlyLessons[month] || [];
            mBlock.querySelectorAll('.lesson-input-row').forEach((lRow, idx) => {
                const inp = lRow.querySelector('.lesson-title-input');
                if (inp) {
                    while (lessonsList.length <= idx) {
                        lessonsList.push({ num: idx + 1, title: '', isConducted: false });
                    }
                    lessonsList[idx].title = inp.value.trim();
                }
            });
            currentPlan.monthlyLessons[month] = lessonsList;
        });
    }

    // Пересчёт KPI плашек
    function updateKpiDisplay() {
        if (!currentPlan) return;
        let totalPlanned = 0;
        const mCounts = currentPlan.monthlyCounts || {};
        Object.values(mCounts).forEach(v => {
            totalPlanned += parseInt(v, 10) || 0;
        });

        let totalConducted = 0;
        const mLessons = currentPlan.monthlyLessons || {};
        Object.values(mLessons).forEach(list => {
            if (Array.isArray(list)) {
                list.forEach(l => {
                    if (l && l.isConducted) totalConducted += 1;
                });
            }
        });

        const pct = totalPlanned > 0 ? Math.round((totalConducted / totalPlanned) * 1000) / 10 : 0;

        const valYear = document.getElementById('kpi-val-year-total');
        if (valYear) valYear.textContent = totalPlanned;

        const valCond = document.getElementById('kpi-val-conducted');
        if (valCond) valCond.textContent = `${totalConducted} / ${totalPlanned}`;

        const valPct = document.getElementById('kpi-val-pct');
        if (valPct) valPct.textContent = `${pct}%`;

        const bannerTotal = document.getElementById('month-banner-total-count');
        if (bannerTotal) bannerTotal.textContent = totalPlanned;

        const bannerConducted = document.getElementById('month-banner-conducted-count');
        if (bannerConducted) bannerConducted.textContent = totalConducted;
    }

    // Отрисовка всего представления плана
    function renderPlanView(canEdit) {
        isEditing = canEdit;
        const body = document.getElementById('plan-modal-body');
        if (!body || !currentPlan) return;

        // Управление видимостью кнопок управления
        const btnSave = document.getElementById('btn-plan-save');
        if (btnSave) btnSave.style.display = canEdit ? 'inline-block' : 'none';

        const btnNew = document.getElementById('btn-plan-new');
        if (btnNew) btnNew.style.display = canEdit ? 'inline-block' : 'none';

        const btnTmpl = document.getElementById('btn-plan-load-template');
        if (btnTmpl) btnTmpl.style.display = canEdit ? 'inline-block' : 'none';

        const p = currentPlan;
        const tags = Array.isArray(p.tags) ? p.tags : ['#Репетиторство', '#Обучение'];

        // Вычисляем общие часы
        let totalPlanned = 0;
        Object.values(p.monthlyCounts || {}).forEach(v => totalPlanned += (parseInt(v, 10) || 0));

        let totalConducted = 0;
        Object.values(p.monthlyLessons || {}).forEach(list => {
            if (Array.isArray(list)) list.forEach(l => { if (l && l.isConducted) totalConducted += 1; });
        });
        const pct = totalPlanned > 0 ? Math.round((totalConducted / totalPlanned) * 1000) / 10 : 0;

        body.innerHTML = `
            <!-- 1. HERO IDENTITY -->
            <div class="plan-hero-card">
                <div class="plan-tags-row">
                    ${tags.map(t => `<span class="plan-tag-badge">${escapeHtml(t)}</span>`).join('')}
                    <span class="plan-tag-badge" style="background:rgba(16, 185, 129, 0.12); color:#10b981;">Предмет: ${escapeHtml(p.subject || 'Математика')}</span>
                </div>

                ${canEdit ? `
                    <input type="text" id="plan-input-title" class="plan-title-input" value="${escapeHtml(p.title || '')}" placeholder="Название методического плана...">
                ` : `
                    <h2 style="font-family:var(--f-display); font-size:1.35rem; font-weight:800; margin-bottom:8px;">${escapeHtml(p.title || '')}</h2>
                `}

                <div class="plan-meta-grid">
                    <div>
                        <div style="font-size:0.75rem; color:var(--muted); text-transform:uppercase;">Ученик</div>
                        ${canEdit ? `
                            <input type="text" id="plan-input-student" class="form-input" style="padding:4px 8px; font-size:0.9rem;" value="${escapeHtml(p.studentName || '')}" placeholder="Имя ученика">
                        ` : `
                            <strong style="font-size:0.95rem;">${escapeHtml(p.studentName || '—')}</strong>
                        `}
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:var(--muted); text-transform:uppercase;">Учебный год</div>
                        ${canEdit ? `
                            <input type="text" id="plan-input-year" class="form-input" style="padding:4px 8px; font-size:0.9rem;" value="${escapeHtml(p.academicYear || '2026-2027')}" placeholder="2026-2027">
                        ` : `
                            <strong style="font-size:0.95rem;">${escapeHtml(p.academicYear || '2026-2027')}</strong>
                        `}
                    </div>
                </div>

                <div style="margin-top:14px;">
                    <div style="font-size:0.85rem; font-weight:700; margin-bottom:4px; text-transform:uppercase; color:var(--muted);">Цели:</div>
                    ${canEdit ? `
                        <textarea id="plan-input-goals" class="form-textarea" rows="2" style="font-size:0.9rem; padding:6px 10px;" placeholder="Цели подготовки...">${escapeHtml(p.goals || '')}</textarea>
                    ` : `
                        <p style="font-size:0.92rem; margin:0; line-height:1.5;">${escapeHtml(p.goals || 'Цели не указаны')}</p>
                    `}
                </div>
            </div>

            <!-- 2. KPI СВОДКА -->
            <div class="plan-kpi-banner">
                <div class="plan-kpi-card">
                    <div class="plan-kpi-val" id="kpi-val-year-total" style="color:var(--accent-gold);">${totalPlanned}</div>
                    <div class="plan-kpi-lbl">Занятий за год</div>
                </div>
                <div class="plan-kpi-card">
                    <div class="plan-kpi-val" id="kpi-val-conducted" style="color:var(--accent-emerald);">${totalConducted} / ${totalPlanned}</div>
                    <div class="plan-kpi-lbl">Проведено занятий</div>
                </div>
                <div class="plan-kpi-card">
                    <div class="plan-kpi-val" id="kpi-val-pct" style="color:var(--accent-cyan);">${pct}%</div>
                    <div class="plan-kpi-lbl">Прогресс плана</div>
                </div>
                <div class="plan-kpi-card">
                    <div class="plan-kpi-val" style="color:#a855f7;">${(p.topics || []).length}</div>
                    <div class="plan-kpi-lbl">Тем в программе</div>
                </div>
            </div>

            <!-- 3. СПИСОК ТЕМ -->
            <div class="plan-section">
                <div class="plan-section-header">
                    <div>
                        <h3 class="plan-section-title">Список тем</h3>
                        <div style="font-size:0.8rem; color:#c084fc; font-weight:600;">(Цветом выделены задания 2-ой части)</div>
                    </div>
                    ${canEdit ? `
                        <button type="button" class="btn btn-secondary btn-sm no-print" id="btn-add-topic">
                            ➕ Добавить тему
                        </button>
                    ` : ''}
                </div>

                <div id="topics-list-container">
                    ${(p.topics && p.topics.length) ? p.topics.map((t, idx) => `
                        <div class="topic-item-row ${t.isPart2 ? 'part2-highlight' : ''}" data-idx="${idx}">
                            <span class="topic-idx">${idx + 1}.</span>
                            ${canEdit ? `
                                <input type="text" class="topic-title-input" value="${escapeHtml(t.title || '')}" placeholder="Название темы...">
                                <input type="text" class="topic-hours-input" value="${escapeHtml(t.hours || '1 занятие')}" placeholder="Часы">
                                <button type="button" class="topic-part-toggle ${t.isPart2 ? 'active' : ''} no-print" title="Переключить: Задание 2-й части">
                                    ${t.isPart2 ? '🟣 Часть 2' : '⚪ Часть 1'}
                                </button>
                                <button type="button" class="btn-delete-topic no-print" style="background:transparent; border:none; color:var(--muted); cursor:pointer; padding:4px;" title="Удалить тему">🗑️</button>
                            ` : `
                                <span style="flex:1; font-size:0.9rem;">${escapeHtml(t.title || '')}</span>
                                <span style="font-size:0.82rem; color:var(--muted); font-weight:600;">— ${escapeHtml(t.hours || '1 занятие')}</span>
                                ${t.isPart2 ? '<span style="font-size:0.75rem; background:#8b5cf6; color:#fff; padding:2px 8px; border-radius:4px; font-weight:700;">2-я часть</span>' : ''}
                            `}
                        </div>
                    `).join('') : `
                        <div style="text-align:center; padding:1.5rem; color:var(--muted); font-size:0.88rem;">Темы ещё не добавлены. Нажмите «⚡ Шаблон ОГЭ» или «➕ Добавить тему».</div>
                    `}
                </div>
            </div>

            <!-- 4. ПРИМЕРНОЕ КОЛИЧЕСТВО ЗАНЯТИЙ ЗА ГОД -->
            <div class="plan-section">
                <div class="plan-section-header">
                    <div>
                        <h3 class="plan-section-title">Примерное количество занятий за год</h3>
                        <div style="font-size:0.8rem; color:var(--muted);">Укажите плановое число уроков для каждого месяца</div>
                    </div>
                </div>

                <div class="month-counts-grid" id="month-counts-grid">
                    ${ACADEMIC_MONTHS.map(m => {
                        const count = (p.monthlyCounts && p.monthlyCounts[m] !== undefined) ? p.monthlyCounts[m] : (m === 'Сентябрь' || m === 'Июнь' ? 0 : 8);
                        return `
                            <div class="month-count-box">
                                <div class="month-count-name">${m}</div>
                                ${canEdit ? `
                                    <input type="number" min="0" max="40" class="month-count-input" data-month="${m}" value="${count}">
                                ` : `
                                    <strong style="font-size:1.15rem; font-family:var(--f-display);">${count}</strong>
                                `}
                                <div style="font-size:0.7rem; color:var(--muted); margin-top:2px;">занятий</div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="month-total-banner">
                    <div>
                        <strong>Итого за учебный год: </strong>
                        <span id="month-banner-total-count" style="font-size:1.3rem; font-weight:800; color:var(--accent-gold); margin-left:6px;">${totalPlanned}</span> занятий
                    </div>
                    <div style="font-size:0.88rem; color:var(--muted);">
                        Проведено: <strong id="month-banner-conducted-count" style="color:var(--accent-emerald);">${totalConducted}</strong> из ${totalPlanned}
                    </div>
                </div>
            </div>

            <!-- 5. РАСПИСАНИЕ ПО МЕСЯЦАМ И УЧЁТ ПРОВЕДЁННЫХ ЗАНЯТИЙ -->
            <div class="plan-section">
                <div class="plan-section-header">
                    <div>
                        <h3 class="plan-section-title">Расписание по месяцам</h3>
                        <div style="font-size:0.8rem; color:var(--muted);">Темы каждого урока и отметки о проведении [x]</div>
                    </div>
                </div>

                <div id="monthly-schedule-container">
                    <!-- Заполняется по месяцам -->
                </div>
            </div>
        `;

        renderMonthlyScheduleBlocks(canEdit);
        attachPlanEventListeners(canEdit);
    }

    // Отрисовка блоков расписания по месяцам с таблицами [x]
    function renderMonthlyScheduleBlocks(canEdit) {
        const cont = document.getElementById('monthly-schedule-container');
        if (!cont || !currentPlan) return;

        const p = currentPlan;
        const mCounts = p.monthlyCounts || {};
        const mLessons = p.monthlyLessons || {};

        // Фильтруем месяцы, в которых запланировано > 0 занятий
        const activeMonths = ACADEMIC_MONTHS.filter(m => (mCounts[m] && parseInt(mCounts[m], 10) > 0));

        if (activeMonths.length === 0) {
            cont.innerHTML = `
                <div style="text-align:center; padding:1.5rem; color:var(--muted); font-size:0.88rem;">
                    Укажите количество занятий в блоке «Примерное количество занятий за год» выше, чтобы составить поурочное расписание.
                </div>
            `;
            return;
        }

        cont.innerHTML = activeMonths.map(month => {
            const count = parseInt(mCounts[month], 10) || 0;
            const lessonList = mLessons[month] || [];

            // Подсчёт проведённых в этом месяце
            let conductedInMonth = 0;
            for (let i = 0; i < count; i++) {
                if (lessonList[i] && lessonList[i].isConducted) conductedInMonth += 1;
            }

            // Рендер поурочного списка
            let rowsHtml = '';
            for (let i = 0; i < count; i++) {
                const item = lessonList[i] || { num: i + 1, title: '', isConducted: false };
                const isReview = item.title && (item.title.toLowerCase().includes('повторение') || item.review);

                rowsHtml += `
                    <div class="lesson-input-row" data-month="${month}" data-idx="${i}">
                        <span class="lesson-idx-badge">${i + 1}.</span>
                        ${canEdit ? `
                            <input type="text" class="lesson-title-input" value="${escapeHtml(item.title || '')}" placeholder="Тема урока ${i + 1}...">
                        ` : `
                            <span style="font-size:0.9rem; flex:1;">${escapeHtml(item.title || `Урок ${i + 1} (тема не заполнена)`)}</span>
                        `}
                        ${isReview ? `<span class="lesson-review-tag">повторение</span>` : ''}
                    </div>
                `;
            }

            // Таблица учёта проведённых занятий (в точности как в образце PDF!)
            let tableHeaderCols = '';
            let tableCheckCols = '';
            for (let i = 0; i < count; i++) {
                const item = lessonList[i] || { num: i + 1, title: '', isConducted: false };
                const isChecked = !!item.isConducted;
                tableHeaderCols += `<th>Урок ${i + 1}</th>`;
                tableCheckCols += `
                    <td>
                        <button type="button" class="lesson-checkbox-btn ${isChecked ? 'checked' : ''}" data-month="${month}" data-idx="${i}" title="${isChecked ? 'Проведено! Нажмите для отмены' : 'Отметить как проведённое'}">
                            ${isChecked ? '✓' : ''}
                        </button>
                    </td>
                `;
            }

            return `
                <div class="month-block" data-month="${month}">
                    <div class="month-block-title">
                        <span>${month} <span style="font-size:0.8rem; color:var(--muted); font-weight:normal;">(${count} занятий)</span></span>
                        <span style="font-size:0.82rem; font-weight:600; color:${conductedInMonth === count ? 'var(--accent-emerald)' : 'var(--muted)'};">
                            Проведено: <strong>${conductedInMonth}</strong> из ${count}
                        </span>
                    </div>

                    <!-- Темы уроков -->
                    <div style="margin-bottom:12px;">
                        ${rowsHtml}
                    </div>

                    <!-- Таблица учёта проведения [x] -->
                    <div style="overflow-x:auto;">
                        <table class="conducted-tracking-table">
                            <thead>
                                <tr>${tableHeaderCols}</tr>
                            </thead>
                            <tbody>
                                <tr>${tableCheckCols}</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join('');

        // Навешиваем слушатели на чекбоксы
        cont.querySelectorAll('.lesson-checkbox-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isTeacherUser) {
                    alert('Отмечать проведённые уроки может только преподаватель.');
                    return;
                }
                const month = btn.getAttribute('data-month');
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                const isChecked = btn.classList.contains('checked');
                const newStatus = !isChecked;

                btn.classList.toggle('checked', newStatus);
                btn.textContent = newStatus ? '✓' : '';

                toggleLessonConducted(month, idx, newStatus);
            });
        });
    }

    // Навешивание интерактивных слушателей
    function attachPlanEventListeners(canEdit) {
        if (!canEdit) return;

        // Добавление новой темы
        document.getElementById('btn-add-topic')?.addEventListener('click', () => {
            const cont = document.getElementById('topics-list-container');
            if (!cont) return;
            const newIdx = cont.querySelectorAll('.topic-item-row').length;
            const row = document.createElement('div');
            row.className = 'topic-item-row';
            row.setAttribute('data-idx', newIdx);
            row.innerHTML = `
                <span class="topic-idx">${newIdx + 1}.</span>
                <input type="text" class="topic-title-input" placeholder="Название новой темы...">
                <input type="text" class="topic-hours-input" value="1 занятие" placeholder="Часы">
                <button type="button" class="topic-part-toggle no-print" title="Переключить: Задание 2-й части">
                    ⚪ Часть 1
                </button>
                <button type="button" class="btn-delete-topic no-print" style="background:transparent; border:none; color:var(--muted); cursor:pointer; padding:4px;" title="Удалить тему">🗑️</button>
            `;
            cont.appendChild(row);
            attachTopicRowListeners(row);
        });

        // Слушатели тем
        document.querySelectorAll('.topic-item-row').forEach(row => attachTopicRowListeners(row));

        // Слушатели изменений в количестве уроков по месяцам
        document.querySelectorAll('.month-count-input').forEach(inp => {
            inp.addEventListener('input', () => {
                const m = inp.getAttribute('data-month');
                const val = parseInt(inp.value, 10) || 0;
                if (!currentPlan.monthlyCounts) currentPlan.monthlyCounts = {};
                currentPlan.monthlyCounts[m] = val;
                updateKpiDisplay();
                renderMonthlyScheduleBlocks(true);
            });
        });
    }

    // Слушатели строки темы
    function attachTopicRowListeners(row) {
        const toggleBtn = row.querySelector('.topic-part-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isPart2 = row.classList.toggle('part2-highlight');
                toggleBtn.classList.toggle('active', isPart2);
                toggleBtn.textContent = isPart2 ? '🟣 Часть 2' : '⚪ Часть 1';
            });
        }
        const delBtn = row.querySelector('.btn-delete-topic');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                row.remove();
                // Перенумеровываем
                document.querySelectorAll('.topic-item-row').forEach((r, idx) => {
                    const idxSpan = r.querySelector('.topic-idx');
                    if (idxSpan) idxSpan.textContent = `${idx + 1}.`;
                });
            });
        }
    }

    // Экранирование HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Открытие модального окна методического плана
    async function openMethodicalPlanModal(studentId = null) {
        injectStyles();
        ensureModalExists();
        await fetchUserRole();

        const dialog = document.getElementById('modal-methodical-plan');
        if (!dialog) return;

        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', 'true');
        }

        await loadPlansList(studentId);
    }

    // Экспорт в глобальное пространство
    window.MethodicalPlan = {
        open: openMethodicalPlanModal,
        loadTemplate: getOgeMathTemplate
    };

    // Автоинициализация кнопок на страницах
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();

        // Кнопка в шапке / календаре
        document.querySelectorAll('#btn-open-methodical-plan, #btn-open-teacher-methodical-plan, #btn-open-methodical-plan-hero').forEach(btn => {
            btn.addEventListener('click', () => openMethodicalPlanModal());
        });
    });

})();
