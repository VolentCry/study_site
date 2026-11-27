(function() {
    'use strict';

    let currentTeacher = null;
    let currentClasses = [];
    let allUsersCache = [];
    let activeClassId = null;
    let currentTab = 'classes';

    // --- Theme handling ---
    const themeBtn = document.getElementById('theme-toggle-btn');
    function applyTheme(th) {
        if (window.StudyTheme) {
            window.StudyTheme.set(th, true);
        } else {
            document.documentElement.dataset.theme = th;
            document.documentElement.setAttribute('data-theme', th);
            try {
                localStorage.setItem('profileTheme', th);
                localStorage.setItem('site_theme', th);
            } catch(e) {}
        }
        if (themeBtn) themeBtn.textContent = th === 'light' ? '🌙' : '☀️';
    }
    const savedTheme = window.StudyTheme ? window.StudyTheme.get() : (localStorage.getItem('profileTheme') || 'dark');
    applyTheme(savedTheme);
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (window.StudyTheme) {
                const next = window.StudyTheme.toggle(true);
                if (themeBtn) themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
            } else {
                const cur = document.documentElement.dataset.theme || 'dark';
                applyTheme(cur === 'dark' ? 'light' : 'dark');
            }
        });
    }
    window.addEventListener('study-theme-changed', (e) => {
        const th = e.detail;
        if (themeBtn) themeBtn.textContent = th === 'light' ? '🌙' : '☀️';
    });

    // --- Initialize Dashboard ---
    async function init() {
        try {
            const res = await fetch('/api/teacher/dashboard', { cache: 'no-store' });
            if (res.status === 401) {
                // Not logged in
                showGate('guest');
                return;
            }
            if (res.status === 403) {
                // Logged in as student
                showGate('student');
                return;
            }

            const data = await res.json();
            if (!data.success) {
                showGate('student');
                return;
            }

            currentTeacher = data.teacher;
            showDashboard(data.stats);
            loadClasses();
            refreshGradingTabBadge();
        } catch(err) {
            console.error('Error init teacher dashboard:', err);
            showGate('guest');
        }
    }

    function showGate(gate) {
        document.getElementById('gate-guest').classList.toggle('hidden', gate !== 'guest');
        document.getElementById('gate-student').classList.toggle('hidden', gate !== 'student');
        document.getElementById('teacher-dashboard').classList.add('hidden');
    }

    function showDashboard(stats) {
        document.getElementById('gate-guest').classList.add('hidden');
        document.getElementById('gate-student').classList.add('hidden');
        document.getElementById('teacher-dashboard').classList.remove('hidden');

        if (currentTeacher) {
            const greet = document.getElementById('teacher-greeting');
            if (greet) greet.textContent = `Преподаватель: ${currentTeacher.displayName || currentTeacher.username} (@${currentTeacher.username})`;
        }

        if (stats) {
            document.getElementById('hud-my-classes').textContent = stats.totalTeacherClasses || 0;
            document.getElementById('hud-students-count').textContent = stats.totalStudentsInClasses || 0;
            document.getElementById('hud-total-users').textContent = stats.totalPlatformUsers || 0;
            document.getElementById('hud-tasks-solved').textContent = stats.totalTasksSolved || 0;
        }
    }

    // --- Gate 1 Action ---
    document.getElementById('gate-login-btn')?.addEventListener('click', () => {
        if (window.AuthSync) window.AuthSync.openModal('login');
    });

    // --- Gate 2 Action (Become Teacher via Code) ---
    document.getElementById('become-teacher-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('teacher-code-input').value.trim();
        const errBox = document.getElementById('gate-code-error');
        errBox.classList.add('hidden');
        try {
            const res = await fetch('/api/teacher/become', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherCode: code })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || 'Неверный код доступа');
            window.location.reload();
        } catch(err) {
            errBox.textContent = err.message;
            errBox.classList.remove('hidden');
        }
    });

    // --- Tabs Switching ---
    const tabBtns = [
        { id: 'classes', btn: document.getElementById('tab-btn-classes'), pane: document.getElementById('pane-classes') },
        { id: 'schedule', btn: document.getElementById('tab-btn-schedule'), pane: document.getElementById('pane-schedule') },
        { id: 'constructor', btn: document.getElementById('tab-btn-constructor'), pane: document.getElementById('pane-constructor') },
        { id: 'grading', btn: document.getElementById('tab-btn-grading'), pane: document.getElementById('pane-grading') },
        { id: 'users', btn: document.getElementById('tab-btn-users'), pane: document.getElementById('pane-users') }
    ];

    function switchTab(targetId) {
        currentTab = targetId;
        tabBtns.forEach(t => {
            const isTarget = t.id === targetId;
            if (t.btn) {
                t.btn.classList.toggle('active', isTarget);
                t.btn.setAttribute('aria-selected', String(isTarget));
            }
            if (t.pane) {
                t.pane.classList.toggle('hidden', !isTarget);
            }
        });

        if (targetId === 'classes') loadClasses();
        if (targetId === 'schedule') loadSchedule();
        if (targetId === 'constructor') loadConstructor();
        if (targetId === 'grading') loadGrading();
        if (targetId === 'users') loadAllUsers();
    }

    tabBtns.forEach(t => {
        if (t.btn) t.btn.addEventListener('click', () => switchTab(t.id));
    });

    // --- Classes Logic ---
    async function loadClasses() {
        try {
            const res = await fetch('/api/teacher/classes', { cache: 'no-store' });
            const data = await res.json();
            if (!data.success) return;
            currentClasses = data.classes || [];
            updateUsersClassFilterOptions();
            renderClassesGrid(currentClasses);
        } catch(err) {
            console.error('Failed to load classes:', err);
        }
    }

    function renderClassesGrid(classes) {
        const container = document.getElementById('classes-grid-container');
        if (!container) return;

        if (!classes.length) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🏫</div>
                    <div style="font-weight:700; margin-bottom:4px;">У вас пока нет созданных классов</div>
                    <p style="font-size:0.85rem; margin-bottom:14px;">Создайте свой первый класс, чтобы добавить в него учеников и отслеживать их прогресс.</p>
                    <button type="button" class="btn btn-emerald" onclick="document.getElementById('open-create-class-modal-btn').click()">
                        ➕ Создать класс
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = classes.map(c => `
            <div class="class-card" data-class-id="${c.id}">
                <div class="class-head">
                    <h3 class="class-name">${escapeHtml(c.name)}</h3>
                    <span class="badge badge-student">${c.studentCount} уч.</span>
                </div>
                <p class="class-desc">${escapeHtml(c.description || 'Без описания')}</p>
                <div class="class-meta-row">
                    <span>Создан: ${formatDate(c.createdAt)}</span>
                </div>
                <div class="class-actions">
                    <button type="button" class="btn btn-emerald btn-sm btn-open-class" data-id="${c.id}" style="flex:1;">
                        👥 Открыть класс
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm btn-quick-add-student" data-id="${c.id}" title="Добавить ученика">
                        ➕
                    </button>
                    <button type="button" class="btn btn-danger-outline btn-sm btn-delete-class" data-id="${c.id}" title="Удалить класс">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Bind card buttons
        container.querySelectorAll('.btn-open-class').forEach(b => {
            b.addEventListener('click', () => openClassDetail(parseInt(b.getAttribute('data-id'))));
        });
        container.querySelectorAll('.btn-quick-add-student').forEach(b => {
            b.addEventListener('click', () => openAddStudentModal(parseInt(b.getAttribute('data-id'))));
        });
        container.querySelectorAll('.btn-delete-class').forEach(b => {
            b.addEventListener('click', () => deleteClass(parseInt(b.getAttribute('data-id'))));
        });
    }

    // Search classes
    document.getElementById('classes-search-input')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = currentClasses.filter(c => c.name.toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term));
        renderClassesGrid(filtered);
    });

    // Open Class Detail View
    async function openClassDetail(classId) {
        activeClassId = classId;
        try {
            const res = await fetch(`/api/teacher/classes/${classId}`, { cache: 'no-store' });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            const c = data.class;
            document.getElementById('single-class-title').textContent = c.name;
            document.getElementById('single-class-desc').textContent = c.description || 'Учебный класс';
            
            const tbody = document.getElementById('single-class-students-tbody');
            if (!c.students || !c.students.length) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center; padding:2rem; color:var(--muted);">
                            В этом классе пока нет учеников. Нажмите «➕ Добавить ученика» выше.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = c.students.map(s => `
                    <tr>
                        <td>
                            <div class="user-cell">
                                <div class="avatar-circle">${escapeHtml((s.displayName || s.username || 'У')[0].toUpperCase())}</div>
                                <div class="user-names">
                                    <span class="user-disp-name">${escapeHtml(s.displayName || s.username)}</span>
                                    <span class="user-uname">@${escapeHtml(s.username)}</span>
                                </div>
                            </div>
                        </td>
                        <td><strong style="color:var(--accent-gold);">${s.userXP || 0} XP</strong></td>
                        <td><strong style="color:var(--accent-cyan);">${s.totalSolved || 0}</strong></td>
                        <td style="font-size:0.8rem; color:var(--muted);">${formatRelativeTime(s.lastLogin)}</td>
                        <td style="font-size:0.8rem; color:var(--muted);">${formatDate(s.joinedAt)}</td>
                        <td style="text-align: right;">
                            <button type="button" class="btn btn-secondary btn-sm btn-dossier" data-user-id="${s.id}">
                                📊 Досье
                            </button>
                            <button type="button" class="btn btn-danger-outline btn-sm btn-remove-student" data-user-id="${s.id}" data-name="${escapeHtml(s.displayName || s.username)}" title="Исключить из класса">
                                ✕
                            </button>
                        </td>
                    </tr>
                `).join('');

                tbody.querySelectorAll('.btn-dossier').forEach(btn => {
                    btn.addEventListener('click', () => openStudentDossier(parseInt(btn.getAttribute('data-user-id'))));
                });
                tbody.querySelectorAll('.btn-remove-student').forEach(btn => {
                    btn.addEventListener('click', () => removeStudentFromClass(parseInt(btn.getAttribute('data-user-id')), btn.getAttribute('data-name')));
                });
            }

            document.getElementById('classes-list-view').classList.add('hidden');
            document.getElementById('single-class-view').classList.remove('hidden');
        } catch(err) {
            alert('Не удалось открыть класс: ' + err.message);
        }
    }

    document.getElementById('btn-back-to-classes')?.addEventListener('click', () => {
        document.getElementById('single-class-view').classList.add('hidden');
        document.getElementById('classes-list-view').classList.remove('hidden');
        activeClassId = null;
        loadClasses();
    });

    document.getElementById('btn-add-student-to-open-class')?.addEventListener('click', () => {
        if (activeClassId) openAddStudentModal(activeClassId);
    });

    document.getElementById('btn-delete-current-class')?.addEventListener('click', () => {
        if (activeClassId) deleteClass(activeClassId);
    });

    // Create Class Modal & Form
    const modalCreateClass = document.getElementById('modal-create-class');
    document.getElementById('open-create-class-modal-btn')?.addEventListener('click', () => {
        document.getElementById('input-class-name').value = '';
        document.getElementById('input-class-desc').value = '';
        modalCreateClass.showModal();
    });

    document.getElementById('form-create-class')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('input-class-name').value.trim();
        const description = document.getElementById('input-class-desc').value.trim();
        try {
            const res = await fetch('/api/teacher/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error);
            modalCreateClass.close();
            await loadClasses();
            // Open newly created class immediately
            if (d.class && d.class.id) {
                openClassDetail(d.class.id);
            }
        } catch(err) {
            alert('Ошибка создания класса: ' + err.message);
        }
    });

    async function deleteClass(classId) {
        if (!confirm('Вы уверены, что хотите удалить этот класс? Ученики останутся в системе.')) return;
        try {
            const res = await fetch(`/api/teacher/classes/${classId}`, { method: 'DELETE' });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error);
            if (activeClassId === classId) {
                document.getElementById('btn-back-to-classes').click();
            } else {
                loadClasses();
            }
        } catch(err) {
            alert('Ошибка при удалении: ' + err.message);
        }
    }

    // --- Add Student Modal Logic ---
    const modalAddStudent = document.getElementById('modal-add-student');
    let targetAddClassId = null;

    async function openAddStudentModal(classId) {
        targetAddClassId = classId;
        const cls = currentClasses.find(c => c.id === classId);
        const title = document.getElementById('modal-add-student-title');
        if (title && cls) title.textContent = `Добавить ученика в «${cls.name}»`;

        modalAddStudent.showModal();
        loadAddStudentCandidates('');
    }

    async function loadAddStudentCandidates(search) {
        const list = document.getElementById('add-student-candidates-list');
        list.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--muted);">Загрузка пользователей...</div>';
        try {
            const res = await fetch(`/api/teacher/users?q=${encodeURIComponent(search)}`, { cache: 'no-store' });
            const d = await res.json();
            if (!d.success) return;

            const users = d.users || [];
            if (!users.length) {
                list.innerHTML = '<div style="padding:1.5rem; text-align:center; color:var(--muted);">Пользователи не найдены.</div>';
                return;
            }

            list.innerHTML = users.map(u => {
                const isInThisClass = u.classes && u.classes.some(c => c.classId === targetAddClassId);
                return `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-bottom:1px solid var(--line);">
                        <div class="user-cell">
                            <div class="avatar-circle" style="width:32px; height:32px; font-size:0.85rem;">
                                ${escapeHtml((u.displayName || u.username)[0].toUpperCase())}
                            </div>
                            <div class="user-names">
                                <span class="user-disp-name">${escapeHtml(u.displayName || u.username)}</span>
                                <span class="user-uname">@${escapeHtml(u.username)} · XP: ${u.userXP}</span>
                            </div>
                        </div>
                        ${isInThisClass ? `
                            <span class="badge badge-success">Уже в классе</span>
                        ` : `
                            <button type="button" class="btn btn-emerald btn-sm btn-do-add" data-user-id="${u.id}">
                                ➕ Добавить
                            </button>
                        `}
                    </div>
                `;
            }).join('');

            list.querySelectorAll('.btn-do-add').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const uid = parseInt(btn.getAttribute('data-user-id'));
                    btn.disabled = true;
                    btn.textContent = 'Добавление...';
                    try {
                        const addRes = await fetch(`/api/teacher/classes/${targetAddClassId}/students`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ studentId: uid })
                        });
                        const addData = await addRes.json();
                        if (!addRes.ok) throw new Error(addData.error);
                        
                        modalAddStudent.close();
                        if (activeClassId === targetAddClassId) {
                            openClassDetail(targetAddClassId);
                        }
                        loadClasses();
                    } catch(e) {
                        alert('Ошибка добавления: ' + e.message);
                        btn.disabled = false;
                        btn.textContent = '➕ Добавить';
                    }
                });
            });
        } catch(e) {
            list.innerHTML = '<div style="color:var(--danger); padding:1rem;">Ошибка загрузки.</div>';
        }
    }

    document.getElementById('add-student-search-input')?.addEventListener('input', (e) => {
        loadAddStudentCandidates(e.target.value);
    });

    async function removeStudentFromClass(studentId, name) {
        if (!confirm(`Исключить ученика ${name} из этого класса?`)) return;
        try {
            const res = await fetch(`/api/teacher/classes/${activeClassId}/students/${studentId}`, { method: 'DELETE' });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error);
            openClassDetail(activeClassId);
        } catch(err) {
            alert('Ошибка: ' + err.message);
        }
    }

    // --- All Users Table Logic & Rich Filters ---
    let currentUsersFilter = '';

    function updateUsersClassFilterOptions() {
        const optgroup = document.getElementById('users-filter-classes-group');
        if (!optgroup) return;
        if (!currentClasses || !currentClasses.length) {
            optgroup.innerHTML = '<option value="" disabled>(Нет созданных классов)</option>';
            return;
        }
        optgroup.innerHTML = currentClasses.map(c => `<option value="class_${c.id}">${escapeHtml(c.name)}</option>`).join('');
    }

    function applyUsersFiltersAndRender() {
        const totalEl = document.getElementById('users-count-total');
        const currEl = document.getElementById('users-count-current');
        if (totalEl) totalEl.textContent = allUsersCache.length;

        let list = [...allUsersCache];

        // 1. Search filter (name, username, ID)
        const searchInput = document.getElementById('users-search-input');
        const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (q) {
            list = list.filter(u => {
                const disp = (u.displayName || '').toLowerCase();
                const uname = (u.username || '').toLowerCase();
                const uid = String(u.id);
                return disp.includes(q) || uname.includes(q) || uid === q || ('#' + uid) === q;
            });
        }

        // 2. Role filter
        if (currentUsersFilter) {
            list = list.filter(u => (u.role || 'student') === currentUsersFilter);
        }

        // 3. Class enrollment filter
        const classFilter = document.getElementById('users-filter-class')?.value || '';
        if (classFilter === 'my_students') {
            list = list.filter(u => Boolean(u.isInMyClass));
        } else if (classFilter === 'no_class') {
            list = list.filter(u => !u.classes || u.classes.length === 0);
        } else if (classFilter.startsWith('class_')) {
            const targetClassId = parseInt(classFilter.replace('class_', ''), 10);
            list = list.filter(u => u.classes && u.classes.some(c => c.classId === targetClassId));
        }

        // 4. Activity filter
        const actFilter = document.getElementById('users-filter-activity')?.value || '';
        if (actFilter) {
            const now = Date.now();
            const ms7Days = 7 * 24 * 60 * 60 * 1000;
            const ms30Days = 30 * 24 * 60 * 60 * 1000;

            list = list.filter(u => {
                if (!u.lastLogin) {
                    return actFilter === 'inactive';
                }
                const t = new Date(u.lastLogin.replace(' ', 'T')).getTime();
                if (isNaN(t)) {
                    return actFilter === 'inactive';
                }
                const diff = now - t;
                if (actFilter === 'active_7') return diff <= ms7Days;
                if (actFilter === 'active_30') return diff <= ms30Days;
                if (actFilter === 'inactive') return diff > ms30Days;
                return true;
            });
        }

        // 5. Sort order
        const sortVal = document.getElementById('users-sort-select')?.value || 'xp_desc';
        list.sort((a, b) => {
            if (sortVal === 'xp_desc') {
                return (b.userXP || 0) - (a.userXP || 0) || (b.id - a.id);
            }
            if (sortVal === 'xp_asc') {
                return (a.userXP || 0) - (b.userXP || 0) || (a.id - b.id);
            }
            if (sortVal === 'solved_desc') {
                return (b.totalSolved || 0) - (a.totalSolved || 0) || (b.id - a.id);
            }
            if (sortVal === 'name_asc') {
                const nameA = a.displayName || a.username || '';
                const nameB = b.displayName || b.username || '';
                return nameA.localeCompare(nameB, 'ru');
            }
            if (sortVal === 'name_desc') {
                const nameA = a.displayName || a.username || '';
                const nameB = b.displayName || b.username || '';
                return nameB.localeCompare(nameA, 'ru');
            }
            if (sortVal === 'last_active') {
                const timeA = a.lastLogin ? new Date(a.lastLogin.replace(' ', 'T')).getTime() : 0;
                const timeB = b.lastLogin ? new Date(b.lastLogin.replace(' ', 'T')).getTime() : 0;
                return timeB - timeA || (b.id - a.id);
            }
            if (sortVal === 'newest') {
                return b.id - a.id;
            }
            return 0;
        });

        if (currEl) currEl.textContent = list.length;
        renderUsersTable(list);
    }

    async function loadAllUsers() {
        const tbody = document.getElementById('all-users-tbody');
        if (!tbody) return;

        updateUsersClassFilterOptions();
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">Загрузка пользователей...</td></tr>';
        try {
            const res = await fetch('/api/teacher/users', { cache: 'no-store' });
            const d = await res.json();
            if (!d.success) return;

            allUsersCache = d.users || [];
            applyUsersFiltersAndRender();
        } catch(err) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--danger);">Ошибка загрузки.</td></tr>';
        }
    }

    function renderUsersTable(users) {
        const tbody = document.getElementById('all-users-tbody');
        if (!tbody) return;

        if (!users.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">Пользователи не найдены.</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(u => {
            const roleBadgeClass = u.role === 'admin' ? 'badge-admin' : (u.role === 'teacher' ? 'badge-teacher' : 'badge-student');
            const roleLabel = u.role === 'admin' ? 'Админ' : (u.role === 'teacher' ? 'Учитель' : 'Ученик');
            const classesNames = u.classes && u.classes.length ? u.classes.map(c => escapeHtml(c.className)).join(', ') : '—';
            const isSelf = currentTeacher && currentTeacher.id === u.id;

            return `
                <tr id="user-row-${u.id}">
                    <td>
                        <div class="user-cell">
                            <div class="avatar-circle">${escapeHtml((u.displayName || u.username)[0].toUpperCase())}</div>
                            <div class="user-names">
                                <span class="user-disp-name">${escapeHtml(u.displayName || u.username)}</span>
                                <span class="user-uname">@${escapeHtml(u.username)}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge ${roleBadgeClass}">${roleLabel}</span></td>
                    <td><strong style="color:var(--accent-gold);">${u.userXP || 0} XP</strong></td>
                    <td><strong style="color:var(--accent-cyan);">${u.totalSolved || 0}</strong></td>
                    <td style="font-size:0.8rem; color:var(--muted); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${classesNames}">
                        ${classesNames}
                    </td>
                    <td style="font-size:0.8rem; color:var(--muted);">${formatRelativeTime(u.lastLogin)}</td>
                    <td style="text-align: right; white-space: nowrap;">
                        <button type="button" class="btn btn-secondary btn-sm btn-dossier" data-user-id="${u.id}">
                            📊 Досье
                        </button>
                        <button type="button" class="btn btn-emerald btn-sm btn-add-user-to-class" data-user-id="${u.id}" data-name="${escapeHtml(u.displayName || u.username)}" data-uname="${escapeHtml(u.username)}">
                            ➕ В класс
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm btn-toggle-role" data-user-id="${u.id}" data-role="${u.role}" title="Сменить роль">
                            👑
                        </button>
                        ${isSelf ? '' : `
                        <button type="button" class="btn btn-danger-outline btn-sm btn-delete-user" data-user-id="${u.id}" data-name="${escapeHtml(u.displayName || u.username)}" data-uname="${escapeHtml(u.username)}" title="Удалить пользователя">
                            🗑️
                        </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.btn-dossier').forEach(b => {
            b.addEventListener('click', () => openStudentDossier(parseInt(b.getAttribute('data-user-id'))));
        });
        tbody.querySelectorAll('.btn-add-user-to-class').forEach(b => {
            b.addEventListener('click', () => {
                const uid = parseInt(b.getAttribute('data-user-id'));
                const name = b.getAttribute('data-name');
                const uname = b.getAttribute('data-uname');
                openQuickEnrollModal(uid, name, uname);
            });
        });
        tbody.querySelectorAll('.btn-toggle-role').forEach(b => {
            b.addEventListener('click', () => toggleUserRole(parseInt(b.getAttribute('data-user-id')), b.getAttribute('data-role')));
        });
        tbody.querySelectorAll('.btn-delete-user').forEach(b => {
            b.addEventListener('click', async () => {
                const uid = parseInt(b.getAttribute('data-user-id'), 10);
                const name = b.getAttribute('data-name');
                const uname = b.getAttribute('data-uname');

                if (!confirm(`Вы действительно хотите удалить пользователя "${name}" (@${uname}) и всю его историю решений?`)) {
                    return;
                }

                try {
                    const res = await fetch(`/api/teacher/users/${uid}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) {
                        showToast(`Пользователь ${name} успешно удалён`);
                        loadAllUsers();
                        loadClasses();
                    } else {
                        alert(data.error || 'Ошибка при удалении пользователя');
                    }
                } catch(e) {
                    alert('Ошибка сети при удалении пользователя');
                }
            });
        });
    }

    document.getElementById('users-search-input')?.addEventListener('input', () => applyUsersFiltersAndRender());
    document.getElementById('users-filter-class')?.addEventListener('change', () => applyUsersFiltersAndRender());
    document.getElementById('users-filter-activity')?.addEventListener('change', () => applyUsersFiltersAndRender());
    document.getElementById('users-sort-select')?.addEventListener('change', () => applyUsersFiltersAndRender());

    document.querySelectorAll('.filter-role-btn').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.filter-role-btn').forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            currentUsersFilter = b.getAttribute('data-role') || '';
            applyUsersFiltersAndRender();
        });
    });

    document.getElementById('btn-refresh-users')?.addEventListener('click', () => {
        loadAllUsers();
    });

    document.getElementById('btn-refresh-single-class')?.addEventListener('click', () => {
        if (activeClassId) loadSingleClass(activeClassId);
    });

    // Auto-refresh when tab is focused or periodically
    window.addEventListener('focus', () => {
        if (currentTab === 'users') {
            loadAllUsers();
        } else if (currentTab === 'classes' && activeClassId) {
            loadSingleClass(activeClassId);
        }
    });

    setInterval(() => {
        if (document.hidden) return;
        if (currentTab === 'users') {
            loadAllUsers();
        } else if (currentTab === 'classes' && activeClassId) {
            loadSingleClass(activeClassId);
        }
    }, 30000);

    document.getElementById('btn-reset-users-filters')?.addEventListener('click', () => {
        const sInput = document.getElementById('users-search-input');
        if (sInput) sInput.value = '';

        document.querySelectorAll('.filter-role-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-role') === '');
        });
        currentUsersFilter = '';

        const classSelect = document.getElementById('users-filter-class');
        if (classSelect) classSelect.value = '';

        const actSelect = document.getElementById('users-filter-activity');
        if (actSelect) actSelect.value = '';

        const sortSelect = document.getElementById('users-sort-select');
        if (sortSelect) sortSelect.value = 'xp_desc';

        applyUsersFiltersAndRender();
    });

    // --- Modal Quick Enroll Logic ---
    const modalQuickEnroll = document.getElementById('modal-quick-enroll');
    let quickEnrollTargetStudent = null;

    async function openQuickEnrollModal(studentId, studentName, studentUname) {
        quickEnrollTargetStudent = { id: studentId, name: studentName, uname: studentUname };

        document.getElementById('quick-enroll-name').textContent = studentName;
        document.getElementById('quick-enroll-sub').textContent = `@${studentUname} · ID: #${studentId}`;
        document.getElementById('quick-enroll-avatar').textContent = (studentName || studentUname || 'У')[0].toUpperCase();

        const feedback = document.getElementById('quick-enroll-feedback');
        feedback.className = 'hidden';
        feedback.textContent = '';
        feedback.style.display = 'none';

        const container = document.getElementById('quick-enroll-content');
        container.innerHTML = '<div style="text-align:center; padding:24px; color:var(--muted);">Загрузка доступных классов...</div>';

        if (modalQuickEnroll && typeof modalQuickEnroll.showModal === 'function') {
            modalQuickEnroll.showModal();
        }

        try {
            const res = await fetch('/api/teacher/classes', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Ошибка загрузки классов');
            currentClasses = data.classes || [];
            renderQuickEnrollClassesList();
        } catch(e) {
            container.innerHTML = `
                <div style="padding:16px; text-align:center;">
                    <div style="color:var(--accent-red); margin-bottom:8px;">Не удалось загрузить классы</div>
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-retry-classes">Повторить</button>
                </div>
            `;
            document.getElementById('btn-retry-classes')?.addEventListener('click', () => {
                openQuickEnrollModal(studentId, studentName, studentUname);
            });
        }
    }

    function renderQuickEnrollClassesList() {
        const container = document.getElementById('quick-enroll-content');
        if (!container || !quickEnrollTargetStudent) return;

        if (!currentClasses.length) {
            container.innerHTML = `
                <div style="text-align:center; padding:12px 6px;">
                    <div style="font-size:2.2rem; margin-bottom:8px;">🏫</div>
                    <div style="font-weight:700; font-size:1rem; margin-bottom:6px;">У вас пока нет созданных классов</div>
                    <p style="font-size:0.82rem; color:var(--muted); margin-bottom:14px; line-height:1.4;">
                        Введите название нового класса, и <strong>${escapeHtml(quickEnrollTargetStudent.name)}</strong> будет сразу зачислен в него:
                    </p>
                    <form id="quick-create-class-form" style="display:flex; flex-direction:column; gap:10px;">
                        <input type="text" id="quick-new-class-input" class="gate-input" style="text-align:left;" placeholder="Например: 9-А Математика" required maxlength="60">
                        <button type="submit" class="btn btn-emerald" id="quick-new-class-submit">
                            ➕ Создать класс и зачислить
                        </button>
                    </form>
                </div>
            `;
            document.getElementById('quick-create-class-form')?.addEventListener('submit', async (e) => {
                e.preventDefault();
                const inp = document.getElementById('quick-new-class-input');
                const name = (inp?.value || '').trim();
                if (!name) return;
                await createClassAndEnroll(name, quickEnrollTargetStudent.id, quickEnrollTargetStudent.name);
            });
            return;
        }

        container.innerHTML = `
            <div style="font-size:0.82rem; color:var(--muted); margin-bottom:10px;">
                Выберите класс для зачисления ученика:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto; padding-right:4px;" id="quick-classes-list">
                ${currentClasses.map(c => `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; border:1px solid var(--line); border-radius:var(--r); background:rgba(255,255,255,0.02);">
                        <div style="min-width:0; flex:1;">
                            <div style="font-weight:700; font-size:0.9rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                ${escapeHtml(c.name)}
                            </div>
                            <div style="font-size:0.75rem; color:var(--muted);">
                                Учеников: ${c.studentCount || 0} ${c.description ? '· ' + escapeHtml(c.description) : ''}
                            </div>
                        </div>
                        <button type="button" class="btn btn-emerald btn-sm btn-enroll-action" data-class-id="${c.id}" data-class-name="${escapeHtml(c.name)}">
                            Зачислить
                        </button>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-show-inline-create">+ Создать новый класс</button>
                <button type="button" class="btn btn-secondary btn-sm" data-close-modal="modal-quick-enroll">Закрыть</button>
            </div>
            <div id="box-inline-create-class" class="hidden" style="margin-top:12px; padding:12px; background:rgba(255,255,255,0.02); border:1px dashed var(--line); border-radius:var(--r);">
                <form id="form-inline-create" style="display:flex; gap:8px;">
                    <input type="text" id="input-inline-class-name" class="gate-input" style="text-align:left; flex:1;" placeholder="Название нового класса..." required maxlength="60">
                    <button type="submit" class="btn btn-emerald btn-sm" style="white-space:nowrap;">Создать</button>
                </form>
            </div>
        `;

        container.querySelectorAll('.btn-enroll-action').forEach(btn => {
            btn.addEventListener('click', async () => {
                const classId = parseInt(btn.getAttribute('data-class-id'));
                const className = btn.getAttribute('data-class-name');
                await doEnrollStudent(classId, className, quickEnrollTargetStudent.id, quickEnrollTargetStudent.name, btn);
            });
        });

        const btnToggle = document.getElementById('btn-show-inline-create');
        const boxInline = document.getElementById('box-inline-create-class');
        if (btnToggle && boxInline) {
            btnToggle.addEventListener('click', () => {
                boxInline.classList.toggle('hidden');
                if (!boxInline.classList.contains('hidden')) {
                    document.getElementById('input-inline-class-name')?.focus();
                }
            });
        }

        document.getElementById('form-inline-create')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inp = document.getElementById('input-inline-class-name');
            const name = (inp?.value || '').trim();
            if (!name) return;
            await createClassAndEnroll(name, quickEnrollTargetStudent.id, quickEnrollTargetStudent.name);
        });
    }

    async function doEnrollStudent(classId, className, studentId, studentName, triggerBtn) {
        const feedback = document.getElementById('quick-enroll-feedback');
        if (triggerBtn) {
            triggerBtn.disabled = true;
            triggerBtn.textContent = '...';
        }

        try {
            const res = await fetch(`/api/teacher/classes/${classId}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || 'Ошибка добавления');

            feedback.className = 'badge-correct';
            feedback.style.display = 'block';
            feedback.textContent = `✓ Ученик ${studentName} успешно зачислен в класс «${className}»!`;

            loadAllUsers();
            loadClasses();

            setTimeout(() => {
                modalQuickEnroll?.close();
            }, 1100);
        } catch(err) {
            feedback.className = 'badge-wrong';
            feedback.style.display = 'block';
            feedback.textContent = 'Ошибка: ' + err.message;
            if (triggerBtn) {
                triggerBtn.disabled = false;
                triggerBtn.textContent = 'Зачислить';
            }
        }
    }

    async function createClassAndEnroll(className, studentId, studentName) {
        const feedback = document.getElementById('quick-enroll-feedback');
        try {
            const createRes = await fetch('/api/teacher/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: className })
            });
            const createData = await createRes.json();
            if (!createRes.ok) throw new Error(createData.error || 'Ошибка создания класса');

            const newClassId = createData.class.id;
            await doEnrollStudent(newClassId, className, studentId, studentName, null);
        } catch(err) {
            feedback.className = 'badge-wrong';
            feedback.style.display = 'block';
            feedback.textContent = 'Ошибка: ' + err.message;
        }
    }

    async function toggleUserRole(userId, curRole) {
        const nextRole = curRole === 'teacher' ? 'student' : 'teacher';
        const msg = nextRole === 'teacher'
            ? 'Назначить этого пользователя учителем? Он получит доступ к панели учителя.'
            : 'Вернуть пользователю роль ученика?';
        if (!confirm(msg)) return;

        try {
            const res = await fetch(`/api/teacher/users/${userId}/role`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: nextRole })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error);
            loadAllUsers();
        } catch(e) {
            alert('Ошибка изменения роли: ' + e.message);
        }
    }

    // --- Student Dossier Modal Logic ---
    const dossierModal = document.getElementById('student-dossier-modal');
    window.openStudentDossier = openStudentDossier;

    let currentDossierStudentId = null;
    let currentDossierUser = null;
    let currentDossierHasParent = false;
    let currentDossierParents = [];
    let currentDossierBilling = null;
    let currentDossierRecurringSchedule = null;

    function renderDossierIdentity(u) {
        if (!u) return;
        const effectiveName = u.displayName || u.username;
        const origName = u.originalDisplayName || u.username;
        const customName = u.teacherCustomName || '';

        const nameEl = document.getElementById('dossier-name');
        const subEl = document.getElementById('dossier-sub');
        const avatarEl = document.getElementById('dossier-avatar');
        const hintEl = document.getElementById('dossier-original-name-hint');
        const displayRow = document.getElementById('dossier-name-display-row');
        const editRow = document.getElementById('dossier-name-edit-row');
        const resetBtn = document.getElementById('btn-dossier-reset-name');

        if (nameEl) nameEl.textContent = effectiveName;
        if (subEl) subEl.textContent = `@${u.username} · ID: #${u.id} · Рамка: ${u.avatarFrame || 'Орбита'}`;
        if (avatarEl) avatarEl.textContent = (effectiveName || 'У')[0].toUpperCase();

        if (hintEl) {
            if (customName && customName !== origName) {
                hintEl.textContent = `В профиле ученика: ${origName} (видно только вам)`;
                hintEl.classList.remove('hidden');
            } else {
                hintEl.textContent = '';
                hintEl.classList.add('hidden');
            }
        }
        if (resetBtn) {
            resetBtn.classList.toggle('hidden', !customName);
        }
        if (editRow) editRow.classList.add('hidden');
        if (displayRow) displayRow.classList.remove('hidden');
    }

    async function saveDossierStudentName(rawName) {
        if (!currentDossierStudentId || !currentDossierUser) return;
        const saveBtn = document.getElementById('btn-dossier-save-name');
        const resetBtn = document.getElementById('btn-dossier-reset-name');
        const inputEl = document.getElementById('dossier-name-input');
        if (saveBtn) saveBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = true;

        try {
            const res = await fetch(`/api/teacher/students/${currentDossierStudentId}/display-name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName: rawName })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Не удалось сохранить имя');
            }

            currentDossierUser.displayName = data.displayName;
            currentDossierUser.originalDisplayName = data.originalDisplayName;
            currentDossierUser.teacherCustomName = data.teacherCustomName || '';
            renderDossierIdentity(currentDossierUser);

            // Обновляем кеш пользователей и открытый класс, если нужно
            if (Array.isArray(allUsersCache) && allUsersCache.length) {
                const cached = allUsersCache.find(item => item.id === currentDossierStudentId);
                if (cached) {
                    cached.displayName = data.displayName;
                    cached.originalDisplayName = data.originalDisplayName;
                    cached.teacherCustomName = data.teacherCustomName || '';
                    applyUsersFiltersAndRender();
                }
            }
            const singleClassView = document.getElementById('single-class-view');
            if (activeClassId && singleClassView && !singleClassView.classList.contains('hidden')) {
                openClassDetail(activeClassId);
            }

            if (typeof showToast === 'function') {
                showToast(data.teacherCustomName
                    ? '✓ Отображаемое имя обновлено (только для вас)'
                    : '✓ Возвращено имя из профиля ученика');
            }
        } catch (err) {
            alert('Ошибка при сохранении имени: ' + err.message);
        } finally {
            if (saveBtn) saveBtn.disabled = false;
            if (resetBtn) resetBtn.disabled = false;
            if (inputEl) inputEl.disabled = false;
        }
    }

    function initDossierNameEditEvents() {
        const editBtn = document.getElementById('btn-dossier-edit-name');
        const saveBtn = document.getElementById('btn-dossier-save-name');
        const resetBtn = document.getElementById('btn-dossier-reset-name');
        const cancelBtn = document.getElementById('btn-dossier-cancel-name');
        const displayRow = document.getElementById('dossier-name-display-row');
        const editRow = document.getElementById('dossier-name-edit-row');
        const inputEl = document.getElementById('dossier-name-input');

        if (!editBtn || editBtn.dataset.bound === '1') return;
        editBtn.dataset.bound = '1';

        editBtn.addEventListener('click', () => {
            if (!currentDossierUser || !editRow || !displayRow || !inputEl) return;
            displayRow.classList.add('hidden');
            editRow.classList.remove('hidden');
            inputEl.value = currentDossierUser.teacherCustomName || currentDossierUser.displayName || '';
            inputEl.focus();
            inputEl.select();
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (editRow) editRow.classList.add('hidden');
                if (displayRow) displayRow.classList.remove('hidden');
            });
        }

        if (saveBtn && inputEl) {
            saveBtn.addEventListener('click', () => saveDossierStudentName(inputEl.value));
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => saveDossierStudentName(''));
        }

        if (inputEl) {
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveDossierStudentName(inputEl.value);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    if (editRow) editRow.classList.add('hidden');
                    if (displayRow) displayRow.classList.remove('hidden');
                }
            });
        }
    }
    let billingEventsInitialized = false;

    function setupDossierBilling(studentId, billing) {
        currentDossierStudentId = studentId;
        const b = billing || {};
        currentDossierBilling = b;
        currentDossierHasParent = Boolean(b.hasParent);
        currentDossierParents = Array.isArray(b.parents) ? b.parents : [];

        const priceInput = document.getElementById('dossier-billing-price-input');
        const paidInput = document.getElementById('dossier-billing-paid-input');
        const passedInput = document.getElementById('dossier-billing-passed-input');
        const payerToggle = document.getElementById('dossier-payer-toggle');
        const tumblerLabel = document.getElementById('dossier-tumbler-label');
        const optStudent = document.getElementById('dossier-payer-label-student');
        const optParent = document.getElementById('dossier-payer-label-parent');

        if (priceInput) priceInput.value = b.lessonPrice != null ? b.lessonPrice : 700;
        if (paidInput) paidInput.value = b.paidLessons != null ? b.paidLessons : 0;
        if (passedInput) passedInput.value = b.passedLessons != null ? b.passedLessons : 0;

        const currentPayer = (currentDossierHasParent && b.payer === 'parent') ? 'parent' : 'student';

        if (payerToggle) {
            payerToggle.disabled = !currentDossierHasParent;
            payerToggle.checked = (currentPayer === 'parent');
        }

        if (tumblerLabel) {
            if (currentDossierHasParent) {
                tumblerLabel.classList.remove('disabled');
                tumblerLabel.title = "Кто производит оплату: Ребёнок (слева) / Родитель (справа)";
            } else {
                tumblerLabel.classList.add('disabled');
                tumblerLabel.title = "Родитель не зарегистрирован. Оплата закреплена за ребёнком.";
            }
        }

        if (optParent) {
            optParent.classList.toggle('disabled', !currentDossierHasParent);
        }

        updateDossierPayerUI(currentPayer, currentDossierHasParent, currentDossierParents);
        recalcDossierBillingUI();
        initDossierBillingEvents();
    }

    function updateDossierPayerUI(payer, hasParent, parents) {
        const optStudent = document.getElementById('dossier-payer-label-student');
        const optParent = document.getElementById('dossier-payer-label-parent');
        const hint = document.getElementById('dossier-payer-hint');

        if (optStudent) {
            optStudent.classList.toggle('active', payer === 'student');
        }
        if (optParent) {
            optParent.classList.toggle('active', payer === 'parent');
        }

        if (hint) {
            if (!hasParent) {
                hint.innerHTML = '<span class="payer-hint-warn">🔒 Родитель не зарегистрирован (прикрепление по коду отсутствует). Оплата закреплена за ребёнком.</span>';
            } else {
                const names = Array.isArray(parents) && parents.length > 0
                    ? parents.map(p => p.displayName || p.username).join(', ')
                    : 'Зарегистрирован';
                hint.innerHTML = `<span class="payer-hint-success">✓ Прикреплён родитель: <strong>${escapeHtml(names)}</strong></span>`;
            }
        }
    }

    function recalcDossierBillingUI() {
        const priceInput = document.getElementById('dossier-billing-price-input');
        const paidInput = document.getElementById('dossier-billing-paid-input');
        const passedInput = document.getElementById('dossier-billing-passed-input');

        const passed = Math.max(0, parseInt(passedInput ? passedInput.value : 0, 10) || 0);
        const paid = Math.max(0, parseInt(paidInput ? paidInput.value : 0, 10) || 0);
        const price = Math.max(0, parseInt(priceInput ? priceInput.value : 700, 10) || 0);

        const unpaid = Math.max(0, passed - paid);
        const debt = unpaid * price;
        const prepaid = Math.max(0, paid - passed);
        const prepaidSum = prepaid * price;
        const paidSum = paid * price;

        const passedVal = document.getElementById('dossier-billing-passed-val');
        const paidVal = document.getElementById('dossier-billing-paid-val');
        const paidSub = document.getElementById('dossier-billing-paid-sub');
        const unpaidVal = document.getElementById('dossier-billing-unpaid-val');
        const unpaidSub = document.getElementById('dossier-billing-unpaid-sub');
        const badge = document.getElementById('dossier-billing-badge');
        const unpaidBox = document.getElementById('dossier-billing-unpaid-box');

        if (passedVal) passedVal.textContent = passed;
        if (paidVal) paidVal.textContent = paid;
        if (paidSub) paidSub.textContent = `${paidSum.toLocaleString('ru-RU')} ₽`;
        if (unpaidVal) unpaidVal.textContent = unpaid;

        if (badge && unpaidSub) {
            if (unpaid > 0) {
                unpaidSub.textContent = `Долг: ${debt.toLocaleString('ru-RU')} ₽`;
                unpaidSub.style.color = 'var(--danger)';
                badge.className = 'dossier-billing-badge status-debt';
                badge.innerHTML = `⚠️ Не оплачено: <strong>${unpaid} ур. (${debt.toLocaleString('ru-RU')} ₽)</strong>`;
                if (unpaidBox) unpaidBox.style.borderColor = 'rgba(239, 68, 68, 0.45)';
            } else if (prepaid > 0) {
                unpaidSub.textContent = 'Оплачено полностью';
                unpaidSub.style.color = 'var(--accent-emerald)';
                badge.className = 'dossier-billing-badge status-prepaid';
                badge.innerHTML = `✨ Аванс: <strong>+${prepaid} ур. (+${prepaidSum.toLocaleString('ru-RU')} ₽)</strong>`;
                if (unpaidBox) unpaidBox.style.borderColor = 'rgba(44, 230, 214, 0.35)';
            } else {
                unpaidSub.textContent = 'Все уроки оплачены';
                unpaidSub.style.color = 'var(--accent-emerald)';
                badge.className = 'dossier-billing-badge status-ok';
                badge.innerHTML = '✅ Все уроки оплачены';
                if (unpaidBox) unpaidBox.style.borderColor = 'rgba(16, 185, 129, 0.35)';
            }
        }
    }

    async function saveDossierBilling(showToastMsg = true) {
        if (!currentDossierStudentId) return;
        const priceInput = document.getElementById('dossier-billing-price-input');
        const paidInput = document.getElementById('dossier-billing-paid-input');
        const passedInput = document.getElementById('dossier-billing-passed-input');
        const saveBtn = document.getElementById('dossier-billing-btn-save');

        const price = Math.max(0, parseInt(priceInput ? priceInput.value : 700, 10) || 700);
        const paid = Math.max(0, parseInt(paidInput ? paidInput.value : 0, 10) || 0);
        const passed = Math.max(0, parseInt(passedInput ? passedInput.value : 0, 10) || 0);
        const payerToggle = document.getElementById('dossier-payer-toggle');
        const payer = (payerToggle && payerToggle.checked && !payerToggle.disabled) ? 'parent' : 'student';

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Сохранение...';
        }

        try {
            const res = await fetch(`/api/teacher/students/${currentDossierStudentId}/billing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonPrice: price,
                    paidLessons: paid,
                    passedLessons: passed,
                    payer: payer
                })
            });
            const d = await res.json();
            if (d.success) {
                if (showToastMsg && typeof showToast === 'function') {
                    const payerText = payer === 'parent' ? 'Родитель' : 'Ребёнок';
                    showToast(`✓ Данные об оплате сохранены! (Плательщик: ${payerText}, Оплачено: ${paid}, Цена: ${price} ₽)`);
                }
                if (saveBtn) {
                    saveBtn.textContent = '✓ Сохранено';
                    saveBtn.classList.remove('btn-emerald');
                    saveBtn.classList.add('btn-secondary');
                    setTimeout(() => {
                        saveBtn.disabled = false;
                        saveBtn.textContent = '💾 Сохранить';
                        saveBtn.classList.add('btn-emerald');
                        saveBtn.classList.remove('btn-secondary');
                    }, 1400);
                }
                // Refresh schedule timeline if visible to sync payment badges
                if (typeof loadSchedule === 'function') {
                    loadSchedule();
                }
            } else {
                alert(d.error || 'Ошибка сохранения данных об оплате');
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = '💾 Сохранить';
                }
            }
        } catch(err) {
            alert('Сетевая ошибка при сохранении: ' + err.message);
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Сохранить';
            }
        }
    }

    function initDossierBillingEvents() {
        if (billingEventsInitialized) return;
        billingEventsInitialized = true;

        const priceInput = document.getElementById('dossier-billing-price-input');
        const paidInput = document.getElementById('dossier-billing-paid-input');
        const passedInput = document.getElementById('dossier-billing-passed-input');
        const payerToggle = document.getElementById('dossier-payer-toggle');
        const optStudent = document.getElementById('dossier-payer-label-student');
        const optParent = document.getElementById('dossier-payer-label-parent');

        if (payerToggle) {
            payerToggle.addEventListener('change', () => {
                if (payerToggle.disabled) return;
                const payer = payerToggle.checked ? 'parent' : 'student';
                updateDossierPayerUI(payer, currentDossierHasParent, currentDossierParents);
                saveDossierBilling(false);
            });
        }

        if (optStudent) {
            optStudent.addEventListener('click', () => {
                if (payerToggle && !payerToggle.disabled && payerToggle.checked) {
                    payerToggle.checked = false;
                    payerToggle.dispatchEvent(new Event('change'));
                }
            });
        }

        if (optParent) {
            optParent.addEventListener('click', () => {
                if (payerToggle && !payerToggle.disabled && !payerToggle.checked) {
                    payerToggle.checked = true;
                    payerToggle.dispatchEvent(new Event('change'));
                }
            });
        }

        const paidMinus = document.getElementById('dossier-billing-paid-minus');
        const paidPlus = document.getElementById('dossier-billing-paid-plus');
        const passedMinus = document.getElementById('dossier-billing-passed-minus');
        const passedPlus = document.getElementById('dossier-billing-passed-plus');
        const syncBtn = document.getElementById('dossier-billing-btn-sync');
        const allPaidBtn = document.getElementById('dossier-billing-btn-all-paid');
        const saveBtn = document.getElementById('dossier-billing-btn-save');

        if (syncBtn) {
            syncBtn.addEventListener('click', async () => {
                if (!currentDossierStudentId) return;
                try {
                    syncBtn.disabled = true;
                    syncBtn.textContent = '⏳ Синхронизация...';

                    // Запрашиваем актуальные данные досье/биллинга с сервера
                    const res = await fetch(`/api/teacher/students/${currentDossierStudentId}/dossier`, { cache: 'no-store' });
                    const d = await res.json();
                    if (!res.ok || !d.success) throw new Error(d.error || 'Ошибка загрузки данных');

                    const billing = (d.dossier && d.dossier.billing) ? d.dossier.billing : {};
                    currentDossierBilling = billing;

                    // Берём данные именно из расписания (schedulePassedCount и schedulePaidCount)
                    const schedPassed = billing.schedulePassedCount != null ? billing.schedulePassedCount : (billing.passedLessons || 0);
                    const schedPaid = billing.schedulePaidCount != null ? billing.schedulePaidCount : (billing.paidLessons || 0);

                    if (passedInput) passedInput.value = schedPassed;
                    if (paidInput) paidInput.value = schedPaid;

                    recalcDossierBillingUI();
                    await saveDossierBilling(false);

                    if (typeof showToast === 'function') {
                        showToast(`✓ Синхронизировано с расписанием: проведено ${schedPassed}, оплачено ${schedPaid}`);
                    }
                } catch(err) {
                    alert('Не удалось синхронизировать с расписанием: ' + err.message);
                } finally {
                    syncBtn.disabled = false;
                    syncBtn.textContent = '🔄 Синхронизировать с расписанием';
                }
            });
        }

        if (priceInput) {
            priceInput.addEventListener('input', recalcDossierBillingUI);
            priceInput.addEventListener('change', () => saveDossierBilling(false));
        }
        if (paidInput) {
            paidInput.addEventListener('input', recalcDossierBillingUI);
            paidInput.addEventListener('change', () => saveDossierBilling(false));
        }
        if (passedInput) {
            passedInput.addEventListener('input', recalcDossierBillingUI);
            passedInput.addEventListener('change', () => saveDossierBilling(false));
        }

        if (paidMinus) {
            paidMinus.addEventListener('click', () => {
                if (paidInput) {
                    paidInput.value = Math.max(0, (parseInt(paidInput.value, 10) || 0) - 1);
                    recalcDossierBillingUI();
                    saveDossierBilling(false);
                }
            });
        }
        if (paidPlus) {
            paidPlus.addEventListener('click', () => {
                if (paidInput) {
                    paidInput.value = (parseInt(paidInput.value, 10) || 0) + 1;
                    recalcDossierBillingUI();
                    saveDossierBilling(false);
                }
            });
        }

        if (passedMinus) {
            passedMinus.addEventListener('click', () => {
                if (passedInput) {
                    passedInput.value = Math.max(0, (parseInt(passedInput.value, 10) || 0) - 1);
                    recalcDossierBillingUI();
                    saveDossierBilling(false);
                }
            });
        }
        if (passedPlus) {
            passedPlus.addEventListener('click', () => {
                if (passedInput) {
                    passedInput.value = (parseInt(passedInput.value, 10) || 0) + 1;
                    recalcDossierBillingUI();
                    saveDossierBilling(false);
                }
            });
        }

        if (allPaidBtn) {
            allPaidBtn.addEventListener('click', () => {
                const passed = parseInt(passedInput ? passedInput.value : 0, 10) || 0;
                if (paidInput) {
                    paidInput.value = passed;
                    recalcDossierBillingUI();
                    saveDossierBilling(true);
                }
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => saveDossierBilling(true));
        }
    }

    async function openStudentDossier(studentId) {
        try {
            const res = await fetch(`/api/teacher/students/${studentId}/dossier`, { cache: 'no-store' });
            const d = await res.json();
            if (!res.ok || !d.success) throw new Error(d.error || 'Не удалось открыть досье');

            const dossier = d.dossier;
            const u = dossier.user;
            const stats = dossier.stats;

            currentDossierStudentId = u.id;
            currentDossierUser = u;
            currentDossierRecurringSchedule = dossier.recurringSchedule || null;
            renderDossierIdentity(u);
            initDossierNameEditEvents();

            // Отображение индивидуального кода ученика
            const studentCode = u.parentCode || u.parent_code || '';
            const codeEl = document.getElementById('dossier-student-code');
            const codeRow = document.getElementById('dossier-code-row');
            const copyCodeBtn = document.getElementById('btn-copy-dossier-code');

            if (codeEl) {
                codeEl.textContent = studentCode || '—';
            }
            if (codeRow) {
                codeRow.style.display = studentCode ? 'flex' : 'none';
            }
            if (copyCodeBtn && studentCode) {
                copyCodeBtn.onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(studentCode);
                        copyCodeBtn.textContent = '✓ Скопировано';
                        copyCodeBtn.classList.remove('btn-secondary');
                        copyCodeBtn.classList.add('btn-emerald');
                        setTimeout(() => {
                            copyCodeBtn.textContent = '📋 Копировать';
                            copyCodeBtn.classList.remove('btn-emerald');
                            copyCodeBtn.classList.add('btn-secondary');
                        }, 2000);
                        if (typeof showToast === 'function') {
                            showToast(`Код ученика ${studentCode} скопирован в буфер`);
                        }
                    } catch (e) {
                        prompt('Скопируйте код ученика:', studentCode);
                    }
                };
            }

            const dossierPlanBtn = document.getElementById('btn-dossier-methodical-plan') || document.getElementById('dossier-btn-plan');
            if (dossierPlanBtn) {
                dossierPlanBtn.onclick = () => {
                    if (window.MethodicalPlanManager) {
                        window.MethodicalPlanManager.openForStudent(u.id, u.displayName || u.username);
                    } else if (window.MethodicalPlan) {
                        window.MethodicalPlan.open(u.id, u.displayName || u.username);
                    }
                };
            }

            const dossierLinkPlanBtn = document.getElementById('dossier-btn-link-plan');
            if (dossierLinkPlanBtn) {
                dossierLinkPlanBtn.onclick = () => {
                    if (window.MethodicalPlanManager && window.MethodicalPlanManager.openAttachModal) {
                        window.MethodicalPlanManager.openAttachModal(u.id, u.displayName || u.username);
                    } else if (window.MethodicalPlan && window.MethodicalPlan.openAttachModal) {
                        window.MethodicalPlan.openAttachModal(u.id, u.displayName || u.username);
                    }
                };
            }

            const dossierRecurringBtn = document.getElementById('dossier-btn-recurring-schedule');
            if (dossierRecurringBtn) {
                dossierRecurringBtn.onclick = () => {
                    openRecurringScheduleModal(u, dossier.classes || [], currentDossierRecurringSchedule);
                };
            }

            document.getElementById('dossier-xp').textContent = `${u.userXP || 0} XP`;
            document.getElementById('dossier-accuracy').textContent = `${stats.accuracyPercent || 0}%`;
            document.getElementById('dossier-correct-count').textContent = stats.correctAttempts || 0;
            document.getElementById('dossier-attempts-count').textContent = stats.totalAttempts || 0;

            // Render Subject Breakdown
            const barsCont = document.getElementById('dossier-subjects-bars');
            if (stats.subjectBreakdown && stats.subjectBreakdown.length) {
                barsCont.innerHTML = stats.subjectBreakdown.map(sb => `
                    <div class="dossier-subject-row">
                        <div class="dossier-subject-meta">
                            <span class="dossier-subject-name">${escapeHtml(sb.subject)}: <strong>${sb.correct}/${sb.total} верно</strong></span>
                            <strong class="dossier-subject-pct">${sb.percent}%</strong>
                        </div>
                        <div class="dossier-subject-track">
                            <div class="dossier-subject-fill" style="width:${sb.percent}%;"></div>
                        </div>
                    </div>
                `).join('');
            } else {
                barsCont.innerHTML = '<div style="font-size:0.82rem; color:var(--muted);">Нет данных по предметам.</div>';
            }

            // Render Tasks Log (Журнал выполненных заданий)
            const tasksTbody = document.getElementById('dossier-tasks-tbody');
            if (dossier.recentTasks && dossier.recentTasks.length) {
                tasksTbody.innerHTML = dossier.recentTasks.map(t => {
                    const isCorr = !!t.correct;
                    const badge = isCorr
                        ? '<span class="badge badge-success">✅ Верно</span>'
                        : '<span class="badge badge-wrong">❌ Ошибка</span>';
                    const isHw = t.source === 'homework';
                    const typeBadge = isHw
                        ? '<span class="dossier-task-badge-hw">📚 Домашняя работа</span>'
                        : '';
                    const linkText = isHw ? 'К Д/З ↗' : 'Открыть ↗';
                    const link = t.taskId ? `<a href="${escapeHtml(t.taskId)}" target="_blank" class="dossier-task-link">${linkText}</a>` : '—';
                    return `
                        <tr>
                            <td class="dossier-task-time">${formatDateTime(t.timestamp)}</td>
                            <td class="dossier-task-subject">${escapeHtml(t.subject || '—')}</td>
                            <td class="dossier-task-skill">${typeBadge}<strong>${escapeHtml(t.skill || t.taskId || 'Задание')}</strong></td>
                            <td class="dossier-task-result">${badge}</td>
                            <td class="dossier-task-action">${link}</td>
                        </tr>
                    `;
                }).join('');
            } else {
                tasksTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--muted);">Ученик пока не решал задания в системе.</td></tr>';
            }



            // Подготовка и отображение блока учёта занятий и оплат
            setupDossierBilling(studentId, dossier.billing);

            dossierModal.showModal();
        } catch(err) {
            alert('Ошибка при открытии досье: ' + err.message);
        }
    }

    // Close modal utility
    document.querySelectorAll('[data-close-modal]').forEach(b => {
        b.addEventListener('click', () => {
            const mid = b.getAttribute('data-close-modal');
            const m = document.getElementById(mid);
            if (m && m.open) m.close();
        });
    });

    // Close modals when clicking backdrop
    [modalCreateClass, modalAddStudent, dossierModal, modalQuickEnroll, document.getElementById('modal-create-lesson'), document.getElementById('modal-recurring-schedule'), document.getElementById('modal-apply-schedule-template'), document.getElementById('modal-submissions-list'), document.getElementById('modal-review-submission')].forEach(m => {
        if (m) {
            m.addEventListener('click', (e) => {
                if (e.target === m) m.close();
            });
        }
    });


    // =========================================================================
    // RECURRING SCHEDULE (DOSSIER) & APPLY TEMPLATE (SCHEDULE)
    // =========================================================================
    const WEEKDAY_SHORT_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const modalRecurringSchedule = document.getElementById('modal-recurring-schedule');
    const formRecurringSchedule = document.getElementById('form-recurring-schedule');
    let recurringModalEventsBound = false;
    let recurringTargetStudentId = null;

    function initRecurringScheduleModalEvents() {
        if (recurringModalEventsBound) return;
        recurringModalEventsBound = true;

        const weekList = document.getElementById('recurring-week-list');
        if (weekList) {
            weekList.querySelectorAll('.recurring-day-row').forEach(row => {
                const cb = row.querySelector('.recurring-day-checkbox');
                const timeInp = row.querySelector('.recurring-day-time');
                if (!cb || !timeInp) return;

                cb.addEventListener('change', () => {
                    timeInp.disabled = !cb.checked;
                    row.classList.toggle('active', cb.checked);
                    if (cb.checked) {
                        timeInp.focus();
                    }
                });
            });
        }

        const clearBtn = document.getElementById('btn-clear-recurring-schedule');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                if (!recurringTargetStudentId) return;
                clearBtn.disabled = true;
                try {
                    const res = await fetch(`/api/teacher/students/${recurringTargetStudentId}/recurring-schedule`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slots: [] })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error || 'Не удалось очистить шаблон');
                    if (currentDossierStudentId === recurringTargetStudentId) {
                        currentDossierRecurringSchedule = null;
                    }
                    if (modalRecurringSchedule && modalRecurringSchedule.open) modalRecurringSchedule.close();
                    if (typeof showToast === 'function') showToast('Постоянное расписание очищено');
                } catch (err) {
                    alert('Ошибка: ' + err.message);
                } finally {
                    clearBtn.disabled = false;
                }
            });
        }

        if (formRecurringSchedule) {
            formRecurringSchedule.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!recurringTargetStudentId) return;

                const slots = [];
                document.querySelectorAll('#recurring-week-list .recurring-day-row').forEach(row => {
                    const cb = row.querySelector('.recurring-day-checkbox');
                    const timeInp = row.querySelector('.recurring-day-time');
                    if (cb && cb.checked && timeInp && timeInp.value) {
                        slots.push({
                            weekday: parseInt(cb.getAttribute('data-weekday'), 10),
                            time: timeInp.value
                        });
                    }
                });

                if (!slots.length) {
                    alert('Выберите хотя бы один день недели и укажите время занятия.');
                    return;
                }

                const classSel = document.getElementById('recurring-schedule-class');
                const durInp = document.getElementById('recurring-schedule-duration');
                const saveBtn = document.getElementById('btn-save-recurring-schedule');
                if (saveBtn) saveBtn.disabled = true;

                try {
                    const res = await fetch(`/api/teacher/students/${recurringTargetStudentId}/recurring-schedule`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            slots,
                            classId: classSel && classSel.value ? parseInt(classSel.value, 10) : null,
                            durationMin: durInp ? parseInt(durInp.value || '60', 10) : 60
                        })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка сохранения расписания');

                    if (currentDossierStudentId === recurringTargetStudentId) {
                        currentDossierRecurringSchedule = data.schedule;
                    }
                    if (modalRecurringSchedule && modalRecurringSchedule.open) modalRecurringSchedule.close();
                    if (typeof showToast === 'function') showToast('✓ Постоянное расписание сохранено');
                } catch (err) {
                    alert('Ошибка при сохранении: ' + err.message);
                } finally {
                    if (saveBtn) saveBtn.disabled = false;
                }
            });
        }
    }

    async function openRecurringScheduleModal(userObj, studentClasses, existingSchedule) {
        if (!modalRecurringSchedule || !userObj) return;
        initRecurringScheduleModalEvents();
        recurringTargetStudentId = userObj.id;

        const subtitle = document.getElementById('recurring-schedule-student-subtitle');
        if (subtitle) {
            subtitle.textContent = `${userObj.displayName || userObj.username} (@${userObj.username})`;
        }

        // Load latest schedule from backend in case it changed
        let sched = existingSchedule;
        try {
            const res = await fetch(`/api/teacher/students/${userObj.id}/recurring-schedule`, { cache: 'no-store' });
            const d = await res.json();
            if (d.success) sched = d.schedule;
        } catch (e) { /* fallback to passed */ }

        const classSel = document.getElementById('recurring-schedule-class');
        if (classSel) {
            classSel.innerHTML = '<option value="">Автоматически (класс ученика)</option>';
            try {
                const resCl = await fetch('/api/teacher/classes', { cache: 'no-store' });
                const dataCl = await resCl.json();
                if (dataCl.success && Array.isArray(dataCl.classes)) {
                    classSel.innerHTML += dataCl.classes.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
                }
            } catch (e) { /* ignore */ }

            if (sched && sched.classId) {
                classSel.value = String(sched.classId);
            } else if (Array.isArray(studentClasses)) {
                const ownCls = studentClasses.find(c => !currentTeacher || c.teacherId === currentTeacher.id);
                if (ownCls) classSel.value = String(ownCls.id);
            }
        }

        const durInp = document.getElementById('recurring-schedule-duration');
        if (durInp) durInp.value = (sched && sched.durationMin) ? sched.durationMin : 60;

        // Reset week rows
        const slotsMap = {};
        if (sched && Array.isArray(sched.slots)) {
            sched.slots.forEach(s => {
                slotsMap[s.weekday] = s.time;
            });
        }

        document.querySelectorAll('#recurring-week-list .recurring-day-row').forEach(row => {
            const wd = parseInt(row.getAttribute('data-weekday'), 10);
            const cb = row.querySelector('.recurring-day-checkbox');
            const timeInp = row.querySelector('.recurring-day-time');
            const hasSlot = Object.prototype.hasOwnProperty.call(slotsMap, wd);
            if (cb) cb.checked = hasSlot;
            if (timeInp) {
                timeInp.disabled = !hasSlot;
                timeInp.value = hasSlot ? slotsMap[wd] : (wd >= 5 ? '12:00' : '16:00');
            }
            row.classList.toggle('active', hasSlot);
        });

        const clearBtn = document.getElementById('btn-clear-recurring-schedule');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !(sched && Array.isArray(sched.slots) && sched.slots.length > 0));
        }

        modalRecurringSchedule.showModal();
    }

    // Apply Template Modal (Schedule tab)
    const modalApplyTemplate = document.getElementById('modal-apply-schedule-template');
    const formApplyTemplate = document.getElementById('form-apply-schedule-template');
    const btnOpenApplyTemplate = document.getElementById('btn-open-apply-template');
    let applyTemplateSchedulesCache = [];
    let applyTemplateEventsBound = false;

    function getLocalDateIso(dt = new Date()) {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function countTemplateOccurrencesInRange(slots, startDateStr, period) {
        if (!Array.isArray(slots) || !slots.length || !startDateStr) return { count: 0, endStr: '' };
        const parts = startDateStr.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return { count: 0, endStr: '' };
        const startD = new Date(parts[0], parts[1] - 1, parts[2]);
        let endD;
        if (period === 'week') {
            endD = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + 6);
        } else {
            const nextM = new Date(startD.getFullYear(), startD.getMonth() + 1, 1);
            const maxDay = new Date(nextM.getFullYear(), nextM.getMonth() + 1, 0).getDate();
            const target = new Date(nextM.getFullYear(), nextM.getMonth(), Math.min(startD.getDate(), maxDay));
            endD = new Date(target.getFullYear(), target.getMonth(), target.getDate() - 1);
        }
        const weekdayCounts = {};
        slots.forEach(s => {
            weekdayCounts[s.weekday] = (weekdayCounts[s.weekday] || 0) + 1;
        });
        let total = 0;
        const cur = new Date(startD.getTime());
        while (cur <= endD) {
            const pyWd = (cur.getDay() + 6) % 7; // JS 0=Sun -> Python 0=Mon..6=Sun
            total += weekdayCounts[pyWd] || 0;
            cur.setDate(cur.getDate() + 1);
        }
        return { count: total, endStr: getLocalDateIso(endD) };
    }

    function updateApplyTemplatePreview() {
        const stuSel = document.getElementById('apply-template-student');
        const previewEl = document.getElementById('apply-template-preview');
        const classSel = document.getElementById('apply-template-class');
        const startInp = document.getElementById('apply-template-start-date');
        const warningBox = document.getElementById('apply-template-warning');
        if (warningBox) warningBox.classList.add('hidden');
        if (!stuSel || !previewEl) return;

        const sid = parseInt(stuSel.value, 10);
        const sched = applyTemplateSchedulesCache.find(s => s.studentId === sid);
        if (!sched) {
            previewEl.classList.add('hidden');
            previewEl.innerHTML = '';
            return;
        }

        if (classSel && sched.classId) {
            classSel.value = String(sched.classId);
        }

        const periodRadio = document.querySelector('input[name="apply-template-period"]:checked');
        const period = periodRadio ? periodRadio.value : 'week';
        const startStr = startInp ? startInp.value : getLocalDateIso();
        const calc = countTemplateOccurrencesInRange(sched.slots, startStr, period);

        const slotLabels = sched.slots.map(s => `${WEEKDAY_SHORT_LABELS[s.weekday] || '?'} ${s.time}`).join(' · ');
        const availCount = typeof sched.availableTopicsCount === 'number' ? sched.availableTopicsCount : null;
        const topicsBadge = availCount !== null
            ? `<div style="color:${availCount < calc.count ? 'var(--danger, #ef4444)' : 'var(--accent-emerald, #10b981)'}; font-weight:600;">Свободных тем в метод. плане: ${availCount} (нужно: ${calc.count})</div>`
            : '';

        previewEl.innerHTML = `
            <div><strong>Шаблон:</strong> ${escapeHtml(slotLabels)} (${sched.durationMin || 60} мин)</div>
            <div><strong>Период:</strong> ${escapeHtml(startStr)} — ${escapeHtml(calc.endStr)} · Занятий: <strong>${calc.count}</strong></div>
            ${topicsBadge}
        `;
        previewEl.classList.remove('hidden');
    }

    function initApplyTemplateEvents() {
        if (applyTemplateEventsBound) return;
        applyTemplateEventsBound = true;

        const stuSel = document.getElementById('apply-template-student');
        const startInp = document.getElementById('apply-template-start-date');
        const openPlanBtn = document.getElementById('btn-apply-template-open-plan');

        if (stuSel) stuSel.addEventListener('change', updateApplyTemplatePreview);
        if (startInp) startInp.addEventListener('change', updateApplyTemplatePreview);
        document.querySelectorAll('input[name="apply-template-period"]').forEach(r => {
            r.addEventListener('change', updateApplyTemplatePreview);
        });

        if (openPlanBtn) {
            openPlanBtn.addEventListener('click', () => {
                const sid = parseInt(stuSel ? stuSel.value : '', 10);
                const sched = applyTemplateSchedulesCache.find(s => s.studentId === sid);
                if (!sid) return;
                if (modalApplyTemplate && modalApplyTemplate.open) modalApplyTemplate.close();
                if (window.MethodicalPlanManager) {
                    window.MethodicalPlanManager.openForStudent(sid, sched ? sched.studentName : '');
                } else if (window.MethodicalPlan) {
                    window.MethodicalPlan.open(sid, sched ? sched.studentName : '');
                }
            });
        }

        if (formApplyTemplate) {
            formApplyTemplate.addEventListener('submit', async (e) => {
                e.preventDefault();
                const sid = parseInt(stuSel ? stuSel.value : '', 10);
                const periodRadio = document.querySelector('input[name="apply-template-period"]:checked');
                const period = periodRadio ? periodRadio.value : 'week';
                const startDate = startInp ? startInp.value : '';
                const classSel = document.getElementById('apply-template-class');
                const classId = classSel && classSel.value ? parseInt(classSel.value, 10) : null;
                const submitBtn = document.getElementById('btn-submit-apply-template');
                const warningBox = document.getElementById('apply-template-warning');
                const warningText = document.getElementById('apply-template-warning-text');

                if (!sid || !startDate || !classId) {
                    alert('Выберите ученика, дату начала и учебный класс.');
                    return;
                }

                if (warningBox) warningBox.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = true;

                try {
                    const res = await fetch('/api/teacher/recurring-schedules/apply', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId: sid, period, startDate, classId })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        const msg = data.error || 'Не удалось вставить шаблон.';
                        if (warningBox && warningText) {
                            warningText.textContent = msg;
                            warningBox.classList.remove('hidden');
                            if (openPlanBtn) {
                                openPlanBtn.classList.toggle('hidden', !msg.toLowerCase().includes('методический план'));
                            }
                        } else {
                            alert(msg);
                        }
                        return;
                    }

                    if (modalApplyTemplate && modalApplyTemplate.open) modalApplyTemplate.close();
                    if (typeof loadSchedule === 'function') loadSchedule();
                    if (typeof showToast === 'function') {
                        showToast(`✓ Добавлено занятий по шаблону: ${data.createdCount}`);
                    }
                } catch (err) {
                    alert('Ошибка при вставке шаблона: ' + err.message);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        }
    }

    async function openApplyTemplateModal() {
        if (!modalApplyTemplate) return;
        initApplyTemplateEvents();

        const stuSel = document.getElementById('apply-template-student');
        const classSel = document.getElementById('apply-template-class');
        const startInp = document.getElementById('apply-template-start-date');
        const emptyHint = document.getElementById('apply-template-empty-hint');
        const submitBtn = document.getElementById('btn-submit-apply-template');
        const warningBox = document.getElementById('apply-template-warning');

        if (warningBox) warningBox.classList.add('hidden');
        if (startInp) startInp.value = getLocalDateIso();
        const weekRadio = document.querySelector('input[name="apply-template-period"][value="week"]');
        if (weekRadio) weekRadio.checked = true;

        try {
            const [resSched, resCls] = await Promise.all([
                fetch('/api/teacher/recurring-schedules', { cache: 'no-store' }),
                fetch('/api/teacher/classes', { cache: 'no-store' })
            ]);
            const dataSched = await resSched.json();
            const dataCls = await resCls.json();

            applyTemplateSchedulesCache = (dataSched.success && Array.isArray(dataSched.schedules)) ? dataSched.schedules : [];
            const classesList = (dataCls.success && Array.isArray(dataCls.classes)) ? dataCls.classes : [];

            if (classSel) {
                classSel.innerHTML = '<option value="">Выберите класс...</option>' +
                    classesList.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
                if (classesList.length === 1) classSel.value = String(classesList[0].id);
            }

            if (stuSel) {
                if (applyTemplateSchedulesCache.length === 0) {
                    stuSel.innerHTML = '<option value="">Нет учеников с постоянным расписанием</option>';
                    if (emptyHint) emptyHint.classList.remove('hidden');
                    if (submitBtn) submitBtn.disabled = true;
                } else {
                    if (emptyHint) emptyHint.classList.add('hidden');
                    if (submitBtn) submitBtn.disabled = false;
                    stuSel.innerHTML = applyTemplateSchedulesCache.map(s => {
                        const slotSummary = s.slots.map(sl => `${WEEKDAY_SHORT_LABELS[sl.weekday]} ${sl.time}`).join(', ');
                        return `<option value="${s.studentId}">${escapeHtml(s.studentName)} (${escapeHtml(slotSummary)})</option>`;
                    }).join('');

                    const filteredStudentVal = document.getElementById('schedule-filter-student')?.value || '';
                    if (filteredStudentVal && filteredStudentVal.startsWith('student:')) {
                        const preSid = filteredStudentVal.replace('student:', '');
                        if (applyTemplateSchedulesCache.some(s => String(s.studentId) === preSid)) {
                            stuSel.value = preSid;
                        }
                    }
                }
            }

            updateApplyTemplatePreview();
            modalApplyTemplate.showModal();
        } catch (err) {
            alert('Не удалось загрузить шаблоны расписания: ' + err.message);
        }
    }

    if (btnOpenApplyTemplate) {
        btnOpenApplyTemplate.addEventListener('click', openApplyTemplateModal);
    }


    // =========================================================================
    // SCHEDULE & LESSONS MANAGEMENT
    // =========================================================================
    const modalCreateLesson = document.getElementById('modal-create-lesson');
    const formCreateLesson = document.getElementById('form-create-lesson');
    const btnOpenCreateLesson = document.getElementById('btn-open-create-lesson');
    const btnOpenTeacherMethodicalPlan = document.getElementById('btn-open-teacher-methodical-plan');
    if (btnOpenTeacherMethodicalPlan) {
        btnOpenTeacherMethodicalPlan.addEventListener('click', () => {
            if (window.MethodicalPlanManager) {
                window.MethodicalPlanManager.openModal();
            } else if (window.MethodicalPlan) {
                window.MethodicalPlan.open();
            }
        });
    }
    const lessonsTimelineContainer = document.getElementById('lessons-timeline-container');
    const lessonTargetClass = document.getElementById('lesson-target-class');
    const lessonTargetStudent = document.getElementById('lesson-target-student');
    const lessonAttachHw = document.getElementById('lesson-attach-hw');
    const lessonPlanTopicGroup = document.getElementById('lesson-methodical-plan-topic-group');
    const lessonPlanTopicSelect = document.getElementById('lesson-plan-topic-select');
    const lessonInputTitle = document.getElementById('lesson-input-title');

    async function updateLessonMethodicalPlanTopics() {
        if (!lessonPlanTopicGroup || !lessonPlanTopicSelect) return;
        const studentIdVal = lessonTargetStudent ? lessonTargetStudent.value : '';
        if (!studentIdVal) {
            lessonPlanTopicGroup.style.display = 'none';
            lessonPlanTopicSelect.innerHTML = '<option value="">-- Выберите тему из методического плана --</option>';
            return;
        }

        try {
            const res = await fetch(`/api/methodical-plans?student_id=${studentIdVal}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
                let optionsHtml = '<option value="">-- Выберите тему для автозаполнения --</option>';
                data.plans.forEach(plan => {
                    const planTitle = escapeHtml(plan.title || 'Метод. план');
                    // Monthly lessons
                    const monthly = plan.monthlyLessons || {};
                    let hasLessons = false;
                    let lessonsGroup = `<optgroup label="📅 ${planTitle} · Уроки по календарю">`;
                    Object.entries(monthly).forEach(([month, lessons]) => {
                        if (Array.isArray(lessons)) {
                            lessons.forEach(les => {
                                if (les && les.title && les.title.trim()) {
                                    hasLessons = true;
                                    const doneMark = les.isConducted ? '✓ ' : '';
                                    lessonsGroup += `<option value="${escapeHtml(les.title.trim())}">${escapeHtml(month)}: Урок ${les.num || ''} — ${doneMark}${escapeHtml(les.title.trim())}</option>`;
                                }
                            });
                        }
                    });
                    lessonsGroup += `</optgroup>`;
                    if (hasLessons) optionsHtml += lessonsGroup;

                    // Topics list
                    const topics = plan.topics || [];
                    if (Array.isArray(topics) && topics.length > 0) {
                        optionsHtml += `<optgroup label="📚 ${planTitle} · Разделы курса">`;
                        topics.forEach(top => {
                            if (top && top.title && top.title.trim()) {
                                optionsHtml += `<option value="${escapeHtml(top.title.trim())}">${top.num ? `№${top.num}. ` : ''}${escapeHtml(top.title.trim())}</option>`;
                            }
                        });
                        optionsHtml += `</optgroup>`;
                    }
                });

                lessonPlanTopicSelect.innerHTML = optionsHtml;
                lessonPlanTopicGroup.style.display = 'block';
            } else {
                lessonPlanTopicGroup.style.display = 'none';
                lessonPlanTopicSelect.innerHTML = '<option value="">-- У ученика нет прикреплённого плана --</option>';
            }
        } catch(e) {
            console.error('Error fetching student methodical plan topics', e);
            lessonPlanTopicGroup.style.display = 'none';
        }
    }

    if (lessonTargetStudent) {
        lessonTargetStudent.addEventListener('change', updateLessonMethodicalPlanTopics);
    }
    if (lessonPlanTopicSelect && lessonInputTitle) {
        lessonPlanTopicSelect.addEventListener('change', () => {
            const val = lessonPlanTopicSelect.value;
            if (val) {
                lessonInputTitle.value = val;
                lessonInputTitle.classList.remove('lesson-plan-topic-highlight');
                void lessonInputTitle.offsetWidth; // trigger reflow
                lessonInputTitle.classList.add('lesson-plan-topic-highlight');
                lessonInputTitle.focus();
            }
        });
    }

    if (btnOpenCreateLesson) {
        btnOpenCreateLesson.addEventListener('click', async () => {
            document.getElementById('lesson-edit-id').value = '';
            document.getElementById('modal-lesson-title').textContent = 'Запланировать занятие';
            document.getElementById('btn-submit-lesson').textContent = 'Сохранить занятие';
            if (lessonPlanTopicGroup) lessonPlanTopicGroup.style.display = 'none';
            if (lessonPlanTopicSelect) lessonPlanTopicSelect.innerHTML = '<option value="">-- Выберите тему из методического плана --</option>';
            await populateLessonModalSelects();
            formCreateLesson.reset();
            document.getElementById('lesson-edit-id').value = '';
            if (lessonTargetStudent) {
                lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (групповой урок)</option>';
            }
            // Set default date to tomorrow 16:00
            const tmrw = new Date();
            tmrw.setDate(tmrw.getDate() + 1);
            tmrw.setHours(16, 0, 0, 0);
            const isoLocal = new Date(tmrw.getTime() - tmrw.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            document.getElementById('lesson-input-date').value = isoLocal;
            modalCreateLesson.showModal();
        });
    }

    async function populateLessonModalSelects() {
        try {
            // Populate classes
            const resCl = await fetch('/api/teacher/classes', { cache: 'no-store' });
            const dataCl = await resCl.json();
            if (dataCl.success && dataCl.classes) {
                lessonTargetClass.innerHTML = '<option value="">Выберите класс...</option>' +
                    dataCl.classes.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
            }

            // Class change listener to populate students for individual lessons
            if (lessonTargetClass && !lessonTargetClass.__hasStudentListener) {
                lessonTargetClass.__hasStudentListener = true;
                lessonTargetClass.addEventListener('change', async () => {
                    const cid = lessonTargetClass.value;
                    if (!lessonTargetStudent) return;
                    lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (групповой урок)</option>';
                    if (!cid) return;

                    try {
                        const res = await fetch(`/api/teacher/classes/${cid}`, { cache: 'no-store' });
                        const data = await res.json();
                        if (data.success && data.class && Array.isArray(data.class.students)) {
                            if (data.class.students.length > 0) {
                                lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (групповой урок)</option>' +
                                    data.class.students.map(s => `<option value="${s.id}">👤 Индивидуально: ${escapeHtml(s.display_name || s.username)} (@${escapeHtml(s.username)})</option>`).join('');
                            } else {
                                lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (в классе пока нет учеников)</option>';
                            }
                        }
                    } catch(e) {
                        console.error('Error fetching students for class', e);
                    }
                });
            }

            // Populate homeworks
            const resHw = await fetch('/api/teacher/homeworks', { cache: 'no-store' });
            const dataHw = await resHw.json();
            if (dataHw.success && dataHw.homeworks) {
                lessonAttachHw.innerHTML = '<option value="">Без прикреплённого Д/З</option>' +
                    dataHw.homeworks.map(h => `<option value="${h.id}">${escapeHtml(h.title)} (${escapeHtml(h.class_name)})</option>`).join('');
            }
        } catch(e) {
            console.error('Error populating lesson modal', e);
        }
    }

    if (formCreateLesson) {
        formCreateLesson.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('lesson-edit-id').value;
            const classId = lessonTargetClass.value;
            const studentIdVal = lessonTargetStudent ? lessonTargetStudent.value : '';
            const studentId = studentIdVal ? parseInt(studentIdVal, 10) : null;
            const title = document.getElementById('lesson-input-title').value.trim();
            const startsAt = document.getElementById('lesson-input-date').value;
            const homeworkId = lessonAttachHw.value ? parseInt(lessonAttachHw.value, 10) : null;
            const notes = document.getElementById('lesson-input-notes').value.trim();

            if (!classId || !title || !startsAt) {
                alert('Пожалуйста, заполните класс, название и дату занятия.');
                return;
            }

            const submitBtn = document.getElementById('btn-submit-lesson');
            submitBtn.disabled = true;

            try {
                const url = editId ? `/api/teacher/lessons/${editId}` : '/api/teacher/lessons';
                const method = editId ? 'PUT' : 'POST';
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        class_id: parseInt(classId, 10),
                        student_id: studentId,
                        title,
                        starts_at: startsAt,
                        homework_id: homeworkId,
                        notes
                    })
                });
                const data = await res.json();
                if (data.success) {
                    modalCreateLesson.close();
                    showToast(editId ? '✓ Занятие успешно обновлено!' : '✓ Занятие успешно запланировано!');
                    loadSchedule();
                } else {
                    alert(data.error || 'Ошибка при сохранении урока');
                }
            } catch(err) {
                console.error('SERVER ERR:', err); alert('ERR: ' + err.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    let currentScheduleLessons = [];
    let scheduleFilterEventsInitialized = false;

    async function loadSchedule() {
        if (!lessonsTimelineContainer) return;
        lessonsTimelineContainer.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--muted);">Загрузка расписания...</div>';

        try {
            const res = await fetch('/api/teacher/lessons', { cache: 'no-store' });
            const data = await res.json();
            if (!data.success) {
                lessonsTimelineContainer.innerHTML = `<div style="text-align:center; color:var(--danger); padding:2rem;">${data.error || 'Ошибка загрузки расписания'}</div>`;
                return;
            }

            const lessons = Array.isArray(data.lessons) ? data.lessons : [];
            currentScheduleLessons = lessons;

            // Sort lessons chronologically
            currentScheduleLessons.sort((a, b) => {
                const da = new Date(a.starts_at || a.scheduled_at || a.scheduledAt || 0);
                const db = new Date(b.starts_at || b.scheduled_at || b.scheduledAt || 0);
                return da - db;
            });

            initScheduleFilterEvents();
            updateScheduleStudentFilterOptions();
            applyScheduleFiltersAndRender();
        } catch(err) {
            lessonsTimelineContainer.innerHTML = '<div style="text-align:center; color:var(--danger); padding:2rem;">Ошибка загрузки расписания.</div>';
        }
    }

    function initScheduleFilterEvents() {
        if (scheduleFilterEventsInitialized) return;
        scheduleFilterEventsInitialized = true;

        const searchInput = document.getElementById('schedule-search-input');
        const studentSelect = document.getElementById('schedule-filter-student');
        const statusSelect = document.getElementById('schedule-filter-status');
        const paymentSelect = document.getElementById('schedule-filter-payment');
        const resetBtn = document.getElementById('btn-reset-schedule-filters');
        const refreshBtn = document.getElementById('btn-refresh-schedule');

        if (searchInput) searchInput.addEventListener('input', applyScheduleFiltersAndRender);
        if (studentSelect) studentSelect.addEventListener('change', applyScheduleFiltersAndRender);

        if (statusSelect) {
            statusSelect.addEventListener('change', () => {
                syncSchedulePills();
                applyScheduleFiltersAndRender();
            });
        }

        if (paymentSelect) {
            paymentSelect.addEventListener('change', () => {
                syncSchedulePills();
                applyScheduleFiltersAndRender();
            });
        }

        // Quick filter pill buttons
        document.querySelectorAll('.schedule-pill-btn').forEach(pill => {
            pill.addEventListener('click', () => {
                const type = pill.getAttribute('data-pill-type');
                const val = pill.getAttribute('data-pill-value') || '';

                if (type === 'all') {
                    if (statusSelect) statusSelect.value = '';
                    if (paymentSelect) paymentSelect.value = '';
                } else if (type === 'status') {
                    if (statusSelect) statusSelect.value = val;
                    if (paymentSelect) paymentSelect.value = '';
                } else if (type === 'payment') {
                    if (paymentSelect) paymentSelect.value = val;
                    if (statusSelect) statusSelect.value = '';
                }

                syncSchedulePills();
                applyScheduleFiltersAndRender();
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resetScheduleFilters();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                loadSchedule();
            });
        }
    }

    function syncSchedulePills() {
        const statusVal = document.getElementById('schedule-filter-status')?.value || '';
        const paymentVal = document.getElementById('schedule-filter-payment')?.value || '';

        document.querySelectorAll('.schedule-pill-btn').forEach(pill => {
            const type = pill.getAttribute('data-pill-type');
            const val = pill.getAttribute('data-pill-value') || '';

            let isActive = false;
            if (type === 'all' && !statusVal && !paymentVal) {
                isActive = true;
            } else if (type === 'status' && statusVal === val && !paymentVal) {
                isActive = true;
            } else if (type === 'payment' && paymentVal === val && !statusVal) {
                isActive = true;
            }
            pill.classList.toggle('active', isActive);
        });
    }

    function resetScheduleFilters() {
        const searchInput = document.getElementById('schedule-search-input');
        const studentSelect = document.getElementById('schedule-filter-student');
        const statusSelect = document.getElementById('schedule-filter-status');
        const paymentSelect = document.getElementById('schedule-filter-payment');

        if (searchInput) searchInput.value = '';
        if (studentSelect) studentSelect.value = '';
        if (statusSelect) statusSelect.value = '';
        if (paymentSelect) paymentSelect.value = '';

        syncSchedulePills();
        applyScheduleFiltersAndRender();
    }

    function updateScheduleStudentFilterOptions() {
        const groupEl = document.getElementById('schedule-filter-students-group');
        if (!groupEl) return;
        const currentVal = document.getElementById('schedule-filter-student')?.value || '';

        const studentsMap = new Map();
        // 1. Collect from current loaded lessons
        currentScheduleLessons.forEach(l => {
            if (l.student_id) {
                const name = l.student_name || l.student_username || `Ученик #${l.student_id}`;
                const uname = l.student_username ? ` (@${l.student_username})` : '';
                studentsMap.set(String(l.student_id), `${name}${uname}`);
            }
        });

        // 2. Also collect from allUsersCache if available
        if (Array.isArray(allUsersCache)) {
            allUsersCache.forEach(u => {
                if (u.role === 'student' || u.isInMyClass) {
                    const name = u.displayName || u.username || `Ученик #${u.id}`;
                    const uname = u.username ? ` (@${u.username})` : '';
                    studentsMap.set(String(u.id), `${name}${uname}`);
                }
            });
        }

        if (studentsMap.size === 0) {
            groupEl.innerHTML = '<option value="" disabled>(Индивидуальных учеников пока нет)</option>';
        } else {
            const sorted = Array.from(studentsMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'ru'));
            groupEl.innerHTML = sorted.map(([id, name]) => `<option value="${id}">👤 ${escapeHtml(name)}</option>`).join('');
        }

        if (currentVal && document.getElementById('schedule-filter-student')) {
            document.getElementById('schedule-filter-student').value = currentVal;
        }
    }

    function applyScheduleFiltersAndRender() {
        if (!lessonsTimelineContainer) return;

        const studentFilter = document.getElementById('schedule-filter-student')?.value || '';
        const statusFilter = document.getElementById('schedule-filter-status')?.value || '';
        const paymentFilter = document.getElementById('schedule-filter-payment')?.value || '';
        const searchQuery = (document.getElementById('schedule-search-input')?.value || '').trim().toLowerCase();

        let filtered = [...currentScheduleLessons];

        // 1. Фильтр по ученикам / формату
        if (studentFilter === 'group') {
            filtered = filtered.filter(l => !l.student_id);
        } else if (studentFilter === 'individual') {
            filtered = filtered.filter(l => Boolean(l.student_id));
        } else if (studentFilter) {
            filtered = filtered.filter(l => String(l.student_id) === String(studentFilter));
        }

        // 2. Фильтр по проведению (проведённые / непроведённые)
        if (statusFilter === 'completed') {
            filtered = filtered.filter(l => Boolean(l.isCompleted || l.is_completed));
        } else if (statusFilter === 'not_completed') {
            filtered = filtered.filter(l => !Boolean(l.isCompleted || l.is_completed));
        }

        // 3. Фильтр по оплате (оплаченные / неоплаченные)
        if (paymentFilter === 'paid') {
            filtered = filtered.filter(l => Boolean(l.isPaid || l.is_paid));
        } else if (paymentFilter === 'unpaid') {
            filtered = filtered.filter(l => !Boolean(l.isPaid || l.is_paid));
        }

        // 4. Текстовый поиск
        if (searchQuery) {
            filtered = filtered.filter(l => {
                const title = (l.title || '').toLowerCase();
                const cName = (l.class_name || l.className || '').toLowerCase();
                const sName = (l.student_name || '').toLowerCase();
                const sUname = (l.student_username || '').toLowerCase();
                const notes = (l.notes || l.description || '').toLowerCase();
                const hwTitle = (l.homework_title || l.homeworkTitle || '').toLowerCase();
                return title.includes(searchQuery) ||
                       cName.includes(searchQuery) ||
                       sName.includes(searchQuery) ||
                       sUname.includes(searchQuery) ||
                       notes.includes(searchQuery) ||
                       hwTitle.includes(searchQuery);
            });
        }

        // Обновление счетчиков
        const countCurrentEl = document.getElementById('schedule-count-current');
        const countTotalEl = document.getElementById('schedule-count-total');
        if (countCurrentEl) countCurrentEl.textContent = filtered.length;
        if (countTotalEl) countTotalEl.textContent = currentScheduleLessons.length;

        renderLessonsTimeline(filtered);
    }

    function renderLessonsTimeline(lessons) {
        if (!lessonsTimelineContainer) return;

        if (currentScheduleLessons.length === 0) {
            lessonsTimelineContainer.innerHTML = `
                <div style="text-align:center; padding:3.5rem 1rem; background:var(--surface-card); border:1px solid var(--line); border-radius:var(--r); color:var(--muted);">
                    <div style="font-size:2.5rem; margin-bottom:0.75rem;">📅</div>
                    <div style="font-weight:700; font-size:1.1rem; color:var(--ink); margin-bottom:0.4rem;">У вас пока нет запланированных занятий</div>
                    <div style="font-size:0.9rem; margin-bottom:1.25rem;">Нажмите кнопку выше, чтобы назначить урок классу и прикрепить домашку.</div>
                    <button type="button" class="btn btn-emerald btn-sm" onclick="document.getElementById('btn-open-create-lesson').click()">
                        ➕ Запланировать занятие
                    </button>
                </div>
            `;
            return;
        }

        if (lessons.length === 0) {
            lessonsTimelineContainer.innerHTML = `
                <div style="text-align:center; padding:3rem 1rem; background:var(--surface-card); border:1px solid var(--line); border-radius:var(--r); color:var(--muted);">
                    <div style="font-size:2.2rem; margin-bottom:0.5rem;">🔍</div>
                    <div style="font-weight:700; color:var(--ink); font-size:1.05rem; margin-bottom:0.4rem;">По выбранным фильтрам уроки не найдены</div>
                    <div style="font-size:0.85rem; margin-bottom:1.25rem;">Попробуйте изменить параметры фильтрации или сбросить фильтры</div>
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-empty-reset-schedule">
                        ✕ Сбросить фильтры
                    </button>
                </div>
            `;
            document.getElementById('btn-empty-reset-schedule')?.addEventListener('click', resetScheduleFilters);
            return;
        }

        const now = new Date();
        lessonsTimelineContainer.innerHTML = lessons.map(les => {
            const rawDate = les.starts_at || les.scheduled_at || les.scheduledAt;
            const d = rawDate ? new Date(rawDate) : null;
            const isToday = !!(d && (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth() &&
                d.getDate() === now.getDate()
            ));
            const dateStr = d ? d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' }) : '—';
            const timeStr = d ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '—';
            const todayBadge = isToday ? '<span class="lesson-today-pill">Сегодня</span> ' : '';

            const hwId = les.homework_id || les.homeworkId;
            const hwTitle = les.homework_title || les.homeworkTitle;
            const cName = les.class_name || les.className || '';
            const notes = les.notes || les.description || '';

            let hwBadgeHtml = '';
            if (hwId && hwTitle) {
                hwBadgeHtml = `<a href="homework.html?id=${hwId}" target="_blank" class="lesson-hw-badge" title="Смотреть домашнее задание с ответами">👀 Д/З: ${escapeHtml(hwTitle)} ↗</a>`;
            }

            let studentBadgeHtml = '';
            if (les.student_id && (les.student_name || les.student_username)) {
                studentBadgeHtml = `<span class="lesson-student-badge student-individual">👤 Индивидуально: ${escapeHtml(les.student_name || les.student_username)}</span>`;
            } else {
                studentBadgeHtml = `<span class="lesson-student-badge student-all">👥 Весь класс</span>`;
            }

            const isPast = d && (d.getTime() < Date.now() - 3600000);
            const isCompleted = !!(les.isCompleted || les.is_completed);
            const isPaid = !!(les.isPaid || les.is_paid);
            const statusBadge = isCompleted
                ? '<span class="lesson-status-badge status-completed">✅ Проведено</span>'
                : (isPast ? '<span class="lesson-status-badge status-past">Прошедший</span>' : '<span class="lesson-status-badge status-planned">Запланирован</span>');

            const paymentBadgeHtml = isPaid
                ? '<span class="lesson-payment-badge pay-paid" title="Занятие оплачено">💳 Оплачено</span>'
                : '<span class="lesson-payment-badge pay-unpaid" title="Занятие ещё не оплачено">⚠️ Не оплачено</span>';

            return `
                <div class="lesson-card ${isToday ? 'lesson-card-today' : ''} ${isCompleted ? 'lesson-card-completed' : ''}" id="lesson-card-${les.id}" style="${isPast && !isCompleted ? 'opacity:0.8;' : ''}">
                    <div class="lesson-time-box">
                        <div class="lesson-time-main">${timeStr}</div>
                        <div class="lesson-time-sub">${todayBadge}${dateStr}</div>
                    </div>
                    <div class="lesson-info">
                        <div class="lesson-title">
                            <span class="lesson-title-text">${escapeHtml(les.title)}</span>
                            ${statusBadge}
                        </div>
                        <div class="lesson-badges-row">
                            <span class="lesson-class-badge">🏫 ${escapeHtml(cName)}</span>
                            ${studentBadgeHtml}
                            ${paymentBadgeHtml}
                            ${hwBadgeHtml}
                            ${notes ? `<span class="lesson-notes">${escapeHtml(notes)}</span>` : ''}
                        </div>
                    </div>
                    <div class="lesson-actions">
                        <button type="button" class="btn btn-sm ${isCompleted ? 'btn-emerald' : 'btn-secondary'} btn-toggle-lesson-complete" data-lesson-id="${les.id}" data-completed="${isCompleted ? '1' : '0'}" title="${isCompleted ? 'Снять отметку о проведении' : 'Отметить как проведённое занятие'}">
                            ${isCompleted ? '✓ Проведено' : '⏳ Провести'}
                        </button>
                        <button type="button" class="btn btn-sm ${isPaid ? 'btn-emerald' : 'btn-secondary'} btn-toggle-lesson-paid" data-lesson-id="${les.id}" data-paid="${isPaid ? '1' : '0'}" title="${isPaid ? 'Снять отметку об оплате' : 'Отметить как оплаченное занятие'}">
                            ${isPaid ? '💳 Оплачено' : '💳 Не оплачено'}
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm btn-edit-lesson" data-lesson-id="${les.id}" title="Редактировать занятие">
                            ✏️
                        </button>
                        <button type="button" class="btn btn-danger-outline btn-sm btn-delete-lesson" data-lesson-id="${les.id}" title="Отменить занятие">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        attachLessonActionListeners();
    }

    function attachLessonActionListeners() {
        if (!lessonsTimelineContainer) return;

        // Attach completion toggle listeners
        lessonsTimelineContainer.querySelectorAll('.btn-toggle-lesson-complete').forEach(b => {
            b.addEventListener('click', async () => {
                const lid = b.getAttribute('data-lesson-id');
                const wasCompleted = b.getAttribute('data-completed') === '1';
                try {
                    const res = await fetch(`/api/teacher/lessons/${lid}/toggle-conducted`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isCompleted: !wasCompleted })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast(!wasCompleted ? 'Занятие отмечено проведённым!' : 'Отметка о проведении снята');
                        loadSchedule();
                    } else {
                        alert(d.error || 'Ошибка обновления статуса занятия');
                    }
                } catch(e) {
                    alert('Ошибка сети при обновлении статуса занятия');
                }
            });
        });

        // Attach payment toggle listeners
        lessonsTimelineContainer.querySelectorAll('.btn-toggle-lesson-paid').forEach(b => {
            b.addEventListener('click', async () => {
                const lid = b.getAttribute('data-lesson-id');
                const wasPaid = b.getAttribute('data-paid') === '1';
                try {
                    const res = await fetch(`/api/teacher/lessons/${lid}/toggle-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isPaid: !wasPaid })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast(!wasPaid ? 'Занятие отмечено как оплаченное!' : 'Отметка об оплате снята');
                        loadSchedule();
                    } else {
                        alert(d.error || 'Ошибка обновления статуса оплаты');
                    }
                } catch(e) {
                    alert('Ошибка сети при обновлении статуса оплаты');
                }
            });
        });

        // Attach edit listeners
        lessonsTimelineContainer.querySelectorAll('.btn-edit-lesson').forEach(b => {
            b.addEventListener('click', async () => {
                const lid = parseInt(b.getAttribute('data-lesson-id'), 10);
                const les = currentScheduleLessons.find(l => (l.id === lid));
                if (!les) return;

                document.getElementById('lesson-edit-id').value = String(les.id);
                document.getElementById('modal-lesson-title').textContent = 'Редактировать занятие';
                document.getElementById('btn-submit-lesson').textContent = 'Сохранить изменения';

                await populateLessonModalSelects();

                const cid = String(les.class_id || les.classId || '');
                lessonTargetClass.value = cid;

                // Populate students for selected class and select the lesson student
                const targetStudentId = les.student_id || les.studentId;
                if (cid) {
                    try {
                        const res = await fetch(`/api/teacher/classes/${cid}`, { cache: 'no-store' });
                        const data = await res.json();
                        if (data.success && data.class && Array.isArray(data.class.students)) {
                            if (data.class.students.length > 0) {
                                lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (групповой урок)</option>' +
                                    data.class.students.map(s => `<option value="${s.id}">👤 Индивидуально: ${escapeHtml(s.display_name || s.username)} (@${escapeHtml(s.username)})</option>`).join('');
                            } else {
                                lessonTargetStudent.innerHTML = '<option value="">👥 Всему классу (в классе пока нет учеников)</option>';
                            }
                        }
                    } catch(e) {}
                }
                lessonTargetStudent.value = targetStudentId ? String(targetStudentId) : '';
                await updateLessonMethodicalPlanTopics();

                document.getElementById('lesson-input-title').value = les.title || '';

                // Format datetime to YYYY-MM-DDTHH:MM local
                const rawDt = les.starts_at || les.scheduled_at || les.scheduledAt;
                if (rawDt) {
                    const dt = new Date(rawDt);
                    const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    document.getElementById('lesson-input-date').value = localIso;
                } else {
                    document.getElementById('lesson-input-date').value = '';
                }

                lessonAttachHw.value = (les.homework_id || les.homeworkId) ? String(les.homework_id || les.homeworkId) : '';
                document.getElementById('lesson-input-notes').value = les.notes || les.description || '';

                modalCreateLesson.showModal();
            });
        });

        // Attach delete listeners
        lessonsTimelineContainer.querySelectorAll('.btn-delete-lesson').forEach(b => {
            b.addEventListener('click', async () => {
                const lid = b.getAttribute('data-lesson-id');
                if (!confirm('Отменить и удалить это занятие из расписания?')) return;
                try {
                    const delRes = await fetch(`/api/teacher/lessons/${lid}`, { method: 'DELETE' });
                    const delData = await delRes.json();
                    if (delData.success) {
                        showToast('Занятие отменено');
                        loadSchedule();
                    } else {
                        alert(delData.error || 'Ошибка при удалении урока');
                    }
                } catch(e) { alert('Ошибка сети'); }
            });
        });
    }


    // =========================================================================
    // HOMEWORK CONSTRUCTOR
    // =========================================================================
    const hwTargetClass = document.getElementById('hw-target-class');
    const hwTargetStudent = document.getElementById('hw-target-student');
    const hwInputTitle = document.getElementById('hw-input-title');
    const hwInputSubject = document.getElementById('hw-input-subject');
    const hwInputDeadline = document.getElementById('hw-input-deadline');
    const hwInputDesc = document.getElementById('hw-input-desc');
    const genTrainerType = document.getElementById('gen-trainer-type');
    const genFilterSubject = document.getElementById('gen-filter-subject');
    const genFilterGrade = document.getElementById('gen-filter-grade');
    const genTrainerCount = document.getElementById('gen-trainer-count');
    const mixTopicsList = document.getElementById('mix-topics-list');
    const mixTasksPerTopic = document.getElementById('mix-tasks-per-topic');
    const mixSelectedBadge = document.getElementById('mix-selected-badge');
    const mixSummaryHint = document.getElementById('mix-summary-hint');
    const btnMixSelectAll = document.getElementById('btn-mix-select-all');
    const btnMixClearAll = document.getElementById('btn-mix-clear-all');
    const btnGenerateMix = document.getElementById('btn-generate-mix');

    const selectedMixTypes = new Set();

    if (genTrainerType && genFilterSubject && genFilterGrade) {
        const allTrainerOptgroups = Array.from(genTrainerType.querySelectorAll('optgroup'))
            .map(og => og.cloneNode(true));

        const gradeLabels = {
            '5': '5 класс',
            '7': '7 класс',
            'oge': '9 класс (ОГЭ)',
            'base': 'Базовая арифметика'
        };

        const subjectDisplayNames = {
            'math': 'Математика',
            'inf': 'Информатика'
        };

        function syncSubjectFromTrainer() {
            if (!hwInputSubject) return;
            const selectedOpt = genTrainerType.options[genTrainerType.selectedIndex];
            const optgroup = selectedOpt ? selectedOpt.parentElement : null;
            const subjectCode = (optgroup && optgroup.dataset && optgroup.dataset.subject)
                || (genFilterSubject.value !== 'all' ? genFilterSubject.value : '');
            if (subjectCode && subjectDisplayNames[subjectCode]) {
                hwInputSubject.value = subjectDisplayNames[subjectCode];
            }
        }

        function updateMixSummary() {
            if (!mixTopicsList) return;
            const visibleCheckboxes = Array.from(mixTopicsList.querySelectorAll('input[type="checkbox"]'));
            const checkedCount = visibleCheckboxes.filter(cb => cb.checked).length;
            const perTopic = mixTasksPerTopic
                ? Math.max(1, Math.min(10, parseInt(mixTasksPerTopic.value, 10) || 2))
                : 2;

            if (mixSelectedBadge) {
                mixSelectedBadge.textContent = `Выбрано: ${checkedCount}`;
            }
            if (mixSummaryHint) {
                if (checkedCount === 0) {
                    mixSummaryHint.textContent = 'Выберите хотя бы одну тему выше.';
                } else {
                    mixSummaryHint.textContent = `Будет добавлено: ${checkedCount * perTopic} задач (${checkedCount} тем × ${perTopic})`;
                }
            }
        }

        function renderMixTopicsList(matchingGroups) {
            if (!mixTopicsList) return;
            const items = [];
            matchingGroups.forEach(og => {
                const subjectCode = og.dataset.subject || '';
                Array.from(og.querySelectorAll('option')).forEach(opt => {
                    if (opt.value.endsWith('_all') || opt.value.startsWith('mult_')) {
                        items.push({
                            value: opt.value,
                            label: opt.textContent.trim(),
                            subject: subjectCode
                        });
                    }
                });
            });

            if (items.length === 0) {
                mixTopicsList.innerHTML = '<div style="font-size:0.8rem; color:var(--muted); padding:6px;">Нет тем для выбранных фильтров</div>';
                updateMixSummary();
                return;
            }

            mixTopicsList.innerHTML = items.map(item => {
                const checked = selectedMixTypes.has(item.value) ? 'checked' : '';
                return `
                    <label style="display:flex; align-items:flex-start; gap:8px; padding:6px 8px; border-radius:6px; cursor:pointer; font-size:0.8rem; line-height:1.3; color:var(--ink); background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);">
                        <input type="checkbox" class="mix-topic-checkbox" value="${escapeHtml(item.value)}" data-subject="${escapeHtml(item.subject)}" ${checked} style="margin-top:2px; accent-color: var(--accent-emerald);">
                        <span>${escapeHtml(item.label)}</span>
                    </label>
                `;
            }).join('');

            mixTopicsList.querySelectorAll('.mix-topic-checkbox').forEach(cb => {
                cb.addEventListener('change', () => {
                    if (cb.checked) {
                        selectedMixTypes.add(cb.value);
                    } else {
                        selectedMixTypes.delete(cb.value);
                    }
                    updateMixSummary();
                });
            });

            updateMixSummary();
        }

        function updateGradeFilterOptions() {
            const subject = genFilterSubject.value;
            const prevGrade = genFilterGrade.value;
            const availableGrades = [];

            allTrainerOptgroups.forEach(og => {
                if (subject !== 'all' && og.dataset.subject !== subject) return;
                const g = og.dataset.grade;
                if (g && !availableGrades.includes(g)) {
                    availableGrades.push(g);
                }
            });

            const order = ['5', '7', 'oge', 'base'];
            availableGrades.sort((a, b) => order.indexOf(a) - order.indexOf(b));

            genFilterGrade.innerHTML = '<option value="all">Все классы</option>' +
                availableGrades.map(g => `<option value="${g}">${gradeLabels[g] || g}</option>`).join('');

            if (prevGrade !== 'all' && availableGrades.includes(prevGrade)) {
                genFilterGrade.value = prevGrade;
            } else {
                genFilterGrade.value = 'all';
            }
        }

        function filterTrainerOptions() {
            const subject = genFilterSubject.value;
            const grade = genFilterGrade.value;
            const prevValue = genTrainerType.value;

            const matchingGroups = allTrainerOptgroups.filter(og => {
                const matchSubject = subject === 'all' || og.dataset.subject === subject;
                const matchGrade = grade === 'all' || og.dataset.grade === grade;
                return matchSubject && matchGrade;
            });

            genTrainerType.innerHTML = '';
            let optionCount = 0;
            let hasPrevValue = false;

            matchingGroups.forEach(og => {
                const cloned = og.cloneNode(true);
                const opts = cloned.querySelectorAll('option');
                optionCount += opts.length;
                opts.forEach(opt => {
                    if (opt.value === prevValue) hasPrevValue = true;
                });
                genTrainerType.appendChild(cloned);
            });

            if (hasPrevValue) {
                genTrainerType.value = prevValue;
            } else if (genTrainerType.options.length > 0) {
                genTrainerType.selectedIndex = 0;
            }

            if (genTrainerCount) {
                genTrainerCount.textContent = `(доступно: ${optionCount})`;
            }

            renderMixTopicsList(matchingGroups);
        }

        genFilterSubject.addEventListener('change', () => {
            updateGradeFilterOptions();
            filterTrainerOptions();
            syncSubjectFromTrainer();
        });

        genFilterGrade.addEventListener('change', () => {
            filterTrainerOptions();
            syncSubjectFromTrainer();
        });

        genTrainerType.addEventListener('change', syncSubjectFromTrainer);

        if (btnMixSelectAll && mixTopicsList) {
            btnMixSelectAll.addEventListener('click', () => {
                mixTopicsList.querySelectorAll('.mix-topic-checkbox').forEach(cb => {
                    cb.checked = true;
                    selectedMixTypes.add(cb.value);
                });
                updateMixSummary();
            });
        }

        if (btnMixClearAll && mixTopicsList) {
            btnMixClearAll.addEventListener('click', () => {
                mixTopicsList.querySelectorAll('.mix-topic-checkbox').forEach(cb => {
                    cb.checked = false;
                    selectedMixTypes.delete(cb.value);
                });
                updateMixSummary();
            });
        }

        if (mixTasksPerTopic) {
            mixTasksPerTopic.addEventListener('input', updateMixSummary);
        }

        updateGradeFilterOptions();
        filterTrainerOptions();
    }
    const genTasksCount = document.getElementById('gen-tasks-count');
    const btnGenerateTasks = document.getElementById('btn-generate-tasks');
    const draftTasksList = document.getElementById('draft-tasks-list');
    const draftCountBadge = document.getElementById('draft-count-badge');
    const btnClearDraftTasks = document.getElementById('btn-clear-draft-tasks');
    const btnPublishHomework = document.getElementById('btn-publish-homework');
    const btnAddManualTask = document.getElementById('btn-add-manual-task');

    let editingHomeworkId = null;
    const hwEditModeBanner = document.getElementById('hw-edit-mode-banner');
    const hwEditModeBadge = document.getElementById('hw-edit-mode-badge');
    const hwEditModeSubtitle = document.getElementById('hw-edit-mode-subtitle');
    const btnCancelEditHw = document.getElementById('btn-cancel-edit-hw');

    async function populateClassesSelect(targetClassId = null) {
        if (!hwTargetClass) return;
        try {
            const res = await fetch('/api/teacher/classes', { cache: 'no-store' });
            const data = await res.json();
            if (data.success && Array.isArray(data.classes)) {
                const currentVal = (targetClassId != null && targetClassId !== '') ? String(targetClassId) : hwTargetClass.value;
                hwTargetClass.innerHTML = '<option value="">Выберите класс...</option>' +
                    data.classes.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
                if (currentVal) {
                    hwTargetClass.value = currentVal;
                }
            }
        } catch(e) {
            console.error('Error populating classes select', e);
        }
    }

    async function loadStudentsForHwClass(classId, selectedStudentId = null) {
        if (!hwTargetStudent) return;
        hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (все ученики)</option>';
        if (!classId) return;

        try {
            const res = await fetch(`/api/teacher/classes/${classId}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.class && Array.isArray(data.class.students)) {
                if (data.class.students.length > 0) {
                    hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (все ученики)</option>' +
                        data.class.students.map(s => `<option value="${s.id}">👤 Индивидуально: ${escapeHtml(s.display_name || s.username)} (@${escapeHtml(s.username)})</option>`).join('');
                } else {
                    hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (в классе пока нет учеников)</option>';
                }
                if (selectedStudentId != null && selectedStudentId !== '') {
                    hwTargetStudent.value = String(selectedStudentId);
                }
            }
        } catch(e) {
            console.error('Error fetching students for homework target class', e);
        }
    }

    async function startEditingHomework(hwId) {
        try {
            showToast('Загрузка задания для редактирования...');
            const res = await fetch(`/api/teacher/homeworks/${hwId}`, { cache: 'no-store' });
            const data = await res.json();
            if (!data.success || !data.homework) {
                alert(data.error || 'Не удалось загрузить данные домашнего задания');
                return;
            }
            const hw = data.homework;
            editingHomeworkId = hw.id;

            switchTab('constructor');

            const targetClassId = (hw.class_id || hw.classId) ? String(hw.class_id || hw.classId) : '';
            const targetStudentId = (hw.student_id || hw.studentId) ? String(hw.student_id || hw.studentId) : null;

            await populateClassesSelect(targetClassId);
            if (hwTargetClass && targetClassId) {
                hwTargetClass.value = targetClassId;
            }

            if (targetClassId) {
                await loadStudentsForHwClass(targetClassId, targetStudentId);
            } else if (hwTargetStudent) {
                hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (все ученики)</option>';
            }

            if (hwInputTitle) hwInputTitle.value = hw.title || '';
            if (hwInputSubject) hwInputSubject.value = hw.subject || 'Математика';
            if (hwInputDeadline) {
                const dl = hw.deadline_at || hw.deadlineAt;
                hwInputDeadline.value = dl ? dl.slice(0, 16) : '';
            }
            if (hwInputDesc) hwInputDesc.value = hw.description || '';

            constructorDraftTasks = Array.isArray(hw.tasks) ? JSON.parse(JSON.stringify(hw.tasks)) : [];
            renderConstructorDraft();

            if (hwEditModeBanner) hwEditModeBanner.style.display = 'flex';
            if (hwEditModeBadge) hwEditModeBadge.textContent = `ID: #${hw.id}`;
            if (hwEditModeSubtitle) hwEditModeSubtitle.textContent = `«${escapeHtml(hw.title)}» (${escapeHtml(hw.class_name || '')})`;
            if (btnPublishHomework) {
                btnPublishHomework.textContent = '💾 Сохранить изменения в задании';
            }

            showToast(`Редактирование Д/З #${hw.id}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch(err) {
            console.error('Error starting homework edit', err);
            alert('Ошибка сети при загрузке домашнего задания.');
        }
    }

    function cancelEditingHomework() {
        editingHomeworkId = null;
        if (hwEditModeBanner) hwEditModeBanner.style.display = 'none';
        if (btnPublishHomework) {
            btnPublishHomework.textContent = '🚀 Опубликовать домашнее задание';
        }
        if (hwInputTitle) hwInputTitle.value = '';
        if (hwInputDesc) hwInputDesc.value = '';
        if (hwTargetClass) hwTargetClass.value = '';
        if (hwTargetStudent) hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (все ученики)</option>';
        loadDraftFromStorage();
        renderConstructorDraft();
        showToast('Режим редактирования отменён');
    }

    if (btnCancelEditHw) {
        btnCancelEditHw.addEventListener('click', cancelEditingHomework);
    }

    // Bank of Tasks elements
    const bankTopicSelect = document.getElementById('bank-topic-select');
    const bankTasksCount = document.getElementById('bank-tasks-count');
    const btnAddBankRandom = document.getElementById('btn-add-bank-random');
    const btnOpenBankPicker = document.getElementById('btn-open-bank-picker');
    const bankTopicStatsText = document.getElementById('bank-topic-stats-text');

    // Modal Bank Picker elements
    const modalBankTasksPicker = document.getElementById('modal-bank-tasks-picker');
    const modalBankTopicSelect = document.getElementById('modal-bank-topic-select');
    const modalBankSearch = document.getElementById('modal-bank-search');
    const btnBankSelectAll = document.getElementById('btn-bank-select-all');
    const btnBankDeselectAll = document.getElementById('btn-bank-deselect-all');
    const modalBankTasksList = document.getElementById('modal-bank-tasks-list');
    const modalBankSelectedCount = document.getElementById('modal-bank-selected-count');
    const btnConfirmAddBankTasks = document.getElementById('btn-confirm-add-bank-tasks');

    let constructorDraftTasks = [];

    function loadDraftFromStorage() {
        try {
            const raw = localStorage.getItem('teacher_hw_draft_tasks');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    constructorDraftTasks = list;
                }
            }
        } catch(e) {
            console.error('Error loading draft tasks from storage', e);
        }
    }

    function saveDraftToStorage() {
        try {
            if (constructorDraftTasks && constructorDraftTasks.length > 0) {
                localStorage.setItem('teacher_hw_draft_tasks', JSON.stringify(constructorDraftTasks));
            } else {
                localStorage.removeItem('teacher_hw_draft_tasks');
            }
        } catch(e) {
            console.error('Error saving draft tasks to storage', e);
        }
    }

    async function loadConstructor() {
        if (!editingHomeworkId) {
            loadDraftFromStorage();
        }
        initBankTopics();
        const preserveClassId = editingHomeworkId && hwTargetClass ? hwTargetClass.value : null;
        await populateClassesSelect(preserveClassId);

        if (hwTargetClass && !hwTargetClass.__hasStudentListener) {
            hwTargetClass.__hasStudentListener = true;
            hwTargetClass.addEventListener('change', () => {
                loadStudentsForHwClass(hwTargetClass.value);
            });
        }
        if (!editingHomeworkId) {
            renderConstructorDraft();
        }
    }

    function renderConstructorDraft() {
        draftCountBadge.textContent = constructorDraftTasks.length;

        if (constructorDraftTasks.length === 0) {
            draftTasksList.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: var(--muted);" id="draft-empty-state">
                    Задачи ещё не добавлены.<br>Используйте генератор слева для быстрого наполнения.
                </div>
            `;
            saveDraftToStorage();
            return;
        }

        draftTasksList.innerHTML = constructorDraftTasks.map((t, idx) => `
            <div class="draft-task-item" id="draft-task-${idx}">
                <div class="draft-task-header">
                    <span class="draft-task-num">№${idx + 1} · ${escapeHtml(t.catName || t.category || 'Задание')}</span>
                    <button type="button" class="btn btn-secondary btn-sm btn-delete-draft-task" data-draft-idx="${idx}" style="padding:2px 8px; font-size:0.75rem;">
                        ✕ Удалить
                    </button>
                </div>
                <div class="draft-task-body">
                    ${t.questionHtml ? formatMathHtml(t.questionHtml) : formatMathHtml(escapeHtml(t.text || ''))}
                </div>
                <div class="draft-task-footer">
                    <span class="draft-task-ans">Ответ: ${escapeHtml(cleanDisplayAnswer(t.displayAnswer || t.answer))}</span>
                    ${t.unit ? `<span style="color:var(--muted); font-size:0.75rem;">Ед. изм.: ${escapeHtml(t.unit)}</span>` : ''}
                    ${t.solutionSteps && t.solutionSteps.length ? `<span style="color:var(--muted); font-size:0.75rem;">Шагов разбора: ${t.solutionSteps.length}</span>` : ''}
                </div>
            </div>
        `).join('');

        // Attach delete handlers
        draftTasksList.querySelectorAll('.btn-delete-draft-task').forEach(b => {
            b.addEventListener('click', () => {
                const idx = parseInt(b.getAttribute('data-draft-idx'), 10);
                constructorDraftTasks.splice(idx, 1);
                renderConstructorDraft();
            });
        });

        saveDraftToStorage();
    }

    if (btnClearDraftTasks) {
        btnClearDraftTasks.addEventListener('click', () => {
            if (constructorDraftTasks.length === 0) return;
            if (confirm('Очистить все добавленные задачи из текущего черновика?')) {
                constructorDraftTasks = [];
                saveDraftToStorage();
                renderConstructorDraft();
            }
        });
    }

    // Task Fingerprint helper for deduplication
    function getTaskFingerprint(task) {
        if (!task) return '';
        if (task.category && String(task.category).startsWith('multiplication')) {
            const str = (task.questionHtml || task.text || '').replace(/<[^>]*>/g, ' ');
            const match = str.match(/(\d+)\s*[×*x]\s*(\d+)/i);
            if (match) {
                const n1 = parseInt(match[1], 10);
                const n2 = parseInt(match[2], 10);
                const pair = [n1, n2].sort((a, b) => a - b).join('x');
                return `mult:${pair}`;
            }
        }
        const rawContent = (task.questionHtml || task.text || '')
            .replace(/id="[^"]*"/gi, '')
            .replace(/class="[^"]*"/gi, '');
        const cleanText = rawContent
            .replace(/<svg[\s\S]*?<\/svg>/gi, (svg) => {
                const coords = (svg.match(/[\d.]+/g) || []).slice(0, 8).join(',');
                return `[svg:${coords}]`;
            })
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        const cleanAns = String(task.answer !== undefined ? task.answer : (task.displayAnswer || '')).trim().toLowerCase();
        return `${task.category || ''}:${cleanText}|ans:${cleanAns}`;
    }

    // Task Generators
    function generateMultiplicationTask(mode) {
        if (mode === 'mult_table') {
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * 8) + 2;
            const ans = a * b;
            return {
                category: 'multiplication',
                catName: 'Таблица умножения',
                questionHtml: `<div class="math-expr">${a} × ${b} = ?</div>`,
                answer: ans,
                displayAnswer: String(ans),
                solutionSteps: [`${a} умножить на ${b} равно ${ans}`]
            };
        } else {
            const a = Math.floor(Math.random() * 90) + 10;
            const b = Math.floor(Math.random() * 8) + 2;
            const ans = a * b;
            return {
                category: 'multiplication_hard',
                catName: 'Устный счёт (двузначные)',
                questionHtml: `<div class="math-expr">${a} × ${b} = ?</div>`,
                answer: ans,
                displayAnswer: String(ans),
                solutionSteps: [
                    `Раскладываем ${a} на ${Math.floor(a/10)*10} и ${a%10}`,
                    `${Math.floor(a/10)*10} × ${b} = ${Math.floor(a/10)*10 * b}`,
                    `${a%10} × ${b} = ${(a%10) * b}`,
                    `Суммируем: ${Math.floor(a/10)*10 * b} + ${(a%10) * b} = <strong>${ans}</strong>`
                ]
            };
        }
    }

    function generateSingleTaskByType(type) {
        let t = null;
        if (type.startsWith('oge6_')) {
            if (window.OgeTask6Trainer) {
                const catMap = {
                    'oge6_all': 'mixed_all',
                    'oge6_common': 'common_fractions',
                    'oge6_decimal': 'decimal_fractions',
                    'oge6_multistory': 'multistory_fractions',
                    'oge6_powers': 'powers_of_ten_mixed'
                };
                t = window.OgeTask6Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge7_')) {
            if (window.OgeTask7Trainer) {
                const catMap = {
                    'oge7_all': 'mixed_all',
                    'oge7_roots': 'roots_on_line',
                    'oge7_fractions': 'fractions_and_intervals',
                    'oge7_variables': 'variable_inequalities',
                    'oge7_differences': 'differences_comparison'
                };
                t = window.OgeTask7Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge8_')) {
            if (window.OgeTask8Trainer) {
                const catMap = {
                    'oge8_all': 'mixed_all',
                    'oge8_roots': 'roots_numbers',
                    'oge8_powers': 'powers_properties'
                };
                t = window.OgeTask8Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge9_')) {
            if (window.OgeTask9Trainer) {
                const catMap = {
                    'oge9_all': 'mixed_all',
                    'oge9_linear': 'linear_equations',
                    'oge9_quadratic': 'quadratic_equations',
                    'oge9_rational': 'rational_equations',
                    'oge9_systems': 'equation_systems'
                };
                t = window.OgeTask9Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge10_')) {
            if (window.OgeTask10Trainer) {
                const catMap = {
                    'oge10_all': 'mixed_all',
                    'oge10_classic': 'fipi_classic',
                    'oge10_athletes': 'athletes_draw',
                    'oge10_taxis': 'taxis_colors',
                    'oge10_tickets': 'exam_tickets',
                    'oge10_quality': 'quality_defect',
                    'oge10_dice': 'dice_coins'
                };
                t = window.OgeTask10Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge11_')) {
            if (window.OgeTask11Trainer) {
                const catMap = {
                    'oge11_all': 'mixed_all',
                    'oge11_parabolas': 'parabolas',
                    'oge11_linear': 'linear',
                    'oge11_hyperbolas': 'hyperbolas',
                    'oge11_mixed_types': 'mixed_types',
                    'oge11_find_value': 'find_value'
                };
                t = window.OgeTask11Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge13_')) {
            if (window.OgeTask13Trainer) {
                const catMap = {
                    'oge13_all': 'mixed_all',
                    'oge13_linear': 'linear',
                    'oge13_systems': 'systems',
                    'oge13_quadratic': 'quadratic',
                    'oge13_special': 'no_solution_or_all'
                };
                t = window.OgeTask13Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge18_')) {
            if (window.OgeTask18Trainer) {
                const catMap = {
                    'oge18_all': 'mixed_all',
                    'oge18_triangle': 'area_triangle',
                    'oge18_trapezoid': 'area_trapezoid',
                    'oge18_parallelogram': 'area_parallelogram',
                    'oge18_tangent': 'angle_tangent',
                    'oge18_midline': 'midline',
                    'oge18_distance': 'distance'
                };
                t = window.OgeTask18Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('oge20_')) {
            if (window.OgeTask20Trainer) {
                const catMap = {
                    'oge20_all': 'mixed_all',
                    'oge20_equations': 'equations',
                    'oge20_inequalities': 'inequalities',
                    'oge20_systems': 'systems'
                };
                t = window.OgeTask20Trainer.generateTask(catMap[type] || 'mixed_all');
            }
        } else if (type.startsWith('inf_oge')) {
            const infMap = {
                'inf_oge1_all': window.InfOgeTask1Trainer,
                'inf_oge2_all': window.InfOgeTask2Trainer,
                'inf_oge3_all': window.InfOgeTask3Trainer,
                'inf_oge4_all': window.InfOgeTask4Trainer,
                'inf_oge5_all': window.InfOgeTask5Trainer,
                'inf_oge6_all': window.InfOgeTask6Trainer,
                'inf_oge7_all': window.InfOgeTask7Trainer,
                'inf_oge8_all': window.InfOgeTask8Trainer,
                'inf_oge9_all': window.InfOgeTask9Trainer,
                'inf_oge10_all': window.InfOgeTask10Trainer
            };
            const engine = infMap[type];
            if (engine) {
                t = engine.generateTask('mixed_all');
            }
        } else if (type.startsWith('mult_')) {
            t = generateMultiplicationTask(type);
        } else if (type.startsWith('powers_compare')) {
            if (window.PowersCompareTrainer) {
                t = window.PowersCompareTrainer.generateTask('compare_all');
            }
        } else if (type.startsWith('fractions_compare')) {
            if (window.FractionCompareTrainer) {
                t = window.FractionCompareTrainer.generateTask(type);
            }
        } else if (type.startsWith('powers_')) {
            if (window.PowersTrainer) {
                t = window.PowersTrainer.generateTask(type);
            }
        } else if (type.startsWith('complex_fractions_powers')) {
            if (window.ComplexFractionsPowersTrainer) {
                t = window.ComplexFractionsPowersTrainer.generateTask(type);
            }
        } else if (type.startsWith('complex_fractions')) {
            if (window.ComplexFractionsTrainer) {
                t = window.ComplexFractionsTrainer.generateTask(type);
            }
        } else if (type.startsWith('divisibility_')) {
            if (window.DivisibilityTrainer) {
                t = window.DivisibilityTrainer.generateTask(type);
            }
        } else if (type.startsWith('extract_whole_adv_')) {
            if (window.ExtractWholeAdvancedTrainer) {
                t = window.ExtractWholeAdvancedTrainer.generateTask(type);
            }
        } else if (type.startsWith('monomials_')) {
            if (window.MonomialsTrainer) {
                t = window.MonomialsTrainer.generateTask(type);
            }
        } else if (type.startsWith('polynomials_')) {
            if (window.PolynomialsTrainer) {
                t = window.PolynomialsTrainer.generateTask(type);
            }
        } else if (type.startsWith('linear_')) {
            if (window.LinearFunctionTrainer) {
                t = window.LinearFunctionTrainer.generateTask(type);
            }
        }
        return t;
    }

    function generateUniqueTasksForType(type, count, existingFPs, batchFPs) {
        const generated = [];
        let attempts = 0;
        const maxAttempts = count * 45;

        while (generated.length < count && attempts < maxAttempts) {
            attempts++;
            const t = generateSingleTaskByType(type);
            if (!t) break;

            const fp = getTaskFingerprint(t);
            if (!existingFPs.has(fp) && !batchFPs.has(fp)) {
                batchFPs.add(fp);
                existingFPs.add(fp);
                if (!t.taskId) {
                    t.taskId = (type.startsWith('oge') ? type.split('_')[0] : 'task') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
                }
                generated.push(t);
            }
        }
        return generated;
    }

    if (btnGenerateTasks) {
        btnGenerateTasks.addEventListener('click', () => {
            const type = genTrainerType.value;
            const count = Math.max(1, Math.min(20, parseInt(genTasksCount.value, 10) || 5));

            const existingFPs = new Set(constructorDraftTasks.map(getTaskFingerprint));
            const batchFPs = new Set();
            const generated = generateUniqueTasksForType(type, count, existingFPs, batchFPs);

            if (generated.length === 0) {
                alert('Все доступные уникальные задачи этого типа уже добавлены в черновик.');
                return;
            }

            if (hwInputSubject) {
                if (type.startsWith('inf_oge')) {
                    hwInputSubject.value = 'Информатика';
                } else {
                    const selectedOpt = genTrainerType.options[genTrainerType.selectedIndex];
                    const optgroup = selectedOpt ? selectedOpt.parentElement : null;
                    if (optgroup && optgroup.dataset && optgroup.dataset.subject === 'math') {
                        hwInputSubject.value = 'Математика';
                    }
                }
            }

            constructorDraftTasks = constructorDraftTasks.concat(generated);
            renderConstructorDraft();
            if (generated.length < count) {
                showToast(`Добавлено ${generated.length} уникальных задач (все возможные без повторов)`, 'info');
            } else {
                showToast(`Сгенерировано и добавлено ${generated.length} уникальных задач без повторов!`);
            }
        });
    }

    if (btnGenerateMix && mixTopicsList) {
        btnGenerateMix.addEventListener('click', () => {
            const checkedBoxes = Array.from(mixTopicsList.querySelectorAll('.mix-topic-checkbox:checked'));
            if (checkedBoxes.length === 0) {
                alert('Выберите хотя бы одну тему для генерации микса.');
                return;
            }

            const perTopic = mixTasksPerTopic
                ? Math.max(1, Math.min(10, parseInt(mixTasksPerTopic.value, 10) || 2))
                : 2;

            const existingFPs = new Set(constructorDraftTasks.map(getTaskFingerprint));
            const batchFPs = new Set();
            const generatedAll = [];
            const subjectsUsed = new Set();

            checkedBoxes.forEach(cb => {
                const type = cb.value;
                if (cb.dataset.subject) subjectsUsed.add(cb.dataset.subject);
                const batch = generateUniqueTasksForType(type, perTopic, existingFPs, batchFPs);
                generatedAll.push(...batch);
            });

            if (generatedAll.length === 0) {
                alert('Все доступные уникальные задачи по выбранным темам уже добавлены в черновик.');
                return;
            }

            if (hwInputSubject && subjectsUsed.size === 1) {
                const onlySubj = Array.from(subjectsUsed)[0];
                if (onlySubj === 'inf') hwInputSubject.value = 'Информатика';
                else if (onlySubj === 'math') hwInputSubject.value = 'Математика';
            }

            constructorDraftTasks = constructorDraftTasks.concat(generatedAll);
            renderConstructorDraft();
            showToast(`🎲 Добавлен микс: ${generatedAll.length} задач из ${checkedBoxes.length} тем!`);
        });
    }

    // Manual task adder
    if (btnAddManualTask) {
        btnAddManualTask.addEventListener('click', () => {
            const condition = document.getElementById('manual-task-condition').value.trim();
            const cat = document.getElementById('manual-task-cat').value.trim() || 'Авторская задача';
            const ans = document.getElementById('manual-task-ans').value.trim();
            const sol = document.getElementById('manual-task-solution').value.trim();

            if (!condition || !ans) {
                alert('Пожалуйста, введите условие задачи и правильный ответ.');
                return;
            }

            const parsedAns = parseFloat(ans.replace(',', '.'));
            const finalAns = isNaN(parsedAns) ? ans : parsedAns;

            constructorDraftTasks.push({
                category: 'custom',
                catName: cat,
                questionHtml: `<div>${formatMathHtml(escapeHtml(condition)).replace(/\n/g, '<br>')}</div>`,
                answer: finalAns,
                displayAnswer: ans,
                solutionSteps: sol ? [formatMathHtml(escapeHtml(sol))] : []
            });

            // Clear fields
            document.getElementById('manual-task-condition').value = '';
            document.getElementById('manual-task-ans').value = '';
            document.getElementById('manual-task-solution').value = '';

            renderConstructorDraft();
            showToast('Авторская задача добавлена в список');
        });
    }

    // Publish Homework
    if (btnPublishHomework) {
        btnPublishHomework.addEventListener('click', async () => {
            const classId = hwTargetClass.value;
            const studentIdVal = hwTargetStudent ? hwTargetStudent.value : '';
            const studentId = studentIdVal ? parseInt(studentIdVal, 10) : null;
            const title = hwInputTitle.value.trim();
            const subject = hwInputSubject.value.trim() || 'Математика';
            const deadline = hwInputDeadline.value || null;
            const desc = hwInputDesc.value.trim();

            if (!classId) {
                alert('Пожалуйста, выберите класс для назначения задания.');
                hwTargetClass.focus();
                return;
            }
            if (!title) {
                alert('Пожалуйста, укажите название домашнего задания.');
                hwInputTitle.focus();
                return;
            }
            if (constructorDraftTasks.length === 0) {
                alert('Домашнее задание должно содержать хотя бы одну задачу.');
                return;
            }

            btnPublishHomework.disabled = true;
            btnPublishHomework.textContent = editingHomeworkId ? 'Сохранение изменений...' : 'Публикация...';

            try {
                if (editingHomeworkId) {
                    const res = await fetch(`/api/teacher/homeworks/${editingHomeworkId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            class_id: parseInt(classId, 10),
                            title,
                            subject,
                            description: desc,
                            deadline,
                            student_id: studentId,
                            tasks: constructorDraftTasks
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('✓ Домашнее задание успешно обновлено!');
                        cancelEditingHomework();
                        switchTab('grading');
                        loadGrading();
                    } else {
                        alert(data.error || 'Ошибка при обновлении домашнего задания');
                    }
                } else {
                    const res = await fetch('/api/teacher/homeworks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            class_id: parseInt(classId, 10),
                            student_id: studentId,
                            title,
                            subject,
                            description: desc,
                            deadline,
                            tasks: constructorDraftTasks
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('Домашнее задание успешно опубликовано!');
                        constructorDraftTasks = [];
                        saveDraftToStorage();
                        hwInputTitle.value = '';
                        hwInputDesc.value = '';
                        if (hwTargetStudent) {
                            hwTargetStudent.innerHTML = '<option value="">👥 Всему классу (все ученики)</option>';
                        }
                        renderConstructorDraft();
                        switchTab('grading');
                        loadGrading();
                    } else {
                        alert(data.error || 'Ошибка при создании домашнего задания');
                    }
                }
            } catch(err) {
                console.error('SERVER ERR:', err); alert('ERR: ' + err.message);
            } finally {
                btnPublishHomework.disabled = false;
                btnPublishHomework.textContent = editingHomeworkId ? '💾 Сохранить изменения в задании' : '🚀 Опубликовать домашнее задание';
            }
        });
    }

    // -------------------------------------------------------------------------
    // Bank of Tasks Integration & Manual Picker
    // -------------------------------------------------------------------------
    function populateBankTopicSelect(selectEl, selectedId) {
        if (!selectEl || !window.BankTasksData || !Array.isArray(window.BankTasksData.topics)) return;
        const topics = window.BankTasksData.topics;

        const physicsTests = topics.filter(t => t.subject === 'physics' && t.isTest);
        const physicsProblems = topics.filter(t => t.subject === 'physics' && !t.isTest);
        const mathTopics = topics.filter(t => t.subject === 'math');
        const informaticsTopics = topics.filter(t => t.subject === 'informatics');
        const englishTopics = topics.filter(t => t.subject === 'english');
        const otherTopics = topics.filter(t => t.subject !== 'physics' && t.subject !== 'math' && t.subject !== 'english' && t.subject !== 'informatics');

        let html = '<option value="">-- Выберите тему из Банка задач --</option>';

        if (physicsTests.length > 0) {
            html += '<optgroup label="⚡ Физика 8 класс · Тестирования (по 15 вопросов)">';
            physicsTests.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>[Тест] ${escapeHtml(t.title)} (${t.tasks.length} вопр.)</option>`;
            });
            html += '</optgroup>';
        }

        if (physicsProblems.length > 0) {
            html += '<optgroup label="🔬 Физика 7, 9, 10 классы · Задачи">';
            physicsProblems.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>${escapeHtml(t.title)} (${t.tasks.length} зад.)</option>`;
            });
            html += '</optgroup>';
        }

        if (mathTopics.length > 0) {
            html += '<optgroup label="📐 Математика · Задачи и вычисления">';
            mathTopics.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>${escapeHtml(t.title)} (${t.tasks.length} зад.)</option>`;
            });
            html += '</optgroup>';
        }

        if (informaticsTopics.length > 0) {
            html += '<optgroup label="💻 Информатика · ОГЭ (задания 1–10)">';
            informaticsTopics.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>${escapeHtml(t.title)} (${t.tasks.length} зад.)</option>`;
            });
            html += '</optgroup>';
        }

        if (englishTopics.length > 0) {
            html += '<optgroup label="🇬🇧 Английский язык">';
            englishTopics.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>${escapeHtml(t.title)} (${t.tasks.length} зад.)</option>`;
            });
            html += '</optgroup>';
        }

        if (otherTopics.length > 0) {
            html += '<optgroup label="📚 Другие темы">';
            otherTopics.forEach(t => {
                const sel = t.id === selectedId ? 'selected' : '';
                html += `<option value="${t.id}" ${sel}>${escapeHtml(t.title)} (${t.tasks.length} зад.)</option>`;
            });
            html += '</optgroup>';
        }

        selectEl.innerHTML = html;
    }

    function updateBankTopicStats() {
        if (!bankTopicSelect || !bankTopicStatsText) return;
        const tid = bankTopicSelect.value;
        if (!tid || !window.BankTasksData) {
            bankTopicStatsText.textContent = 'Выберите тему для просмотра';
            return;
        }
        const topic = window.BankTasksData.getTopicById(tid);
        if (!topic) {
            bankTopicStatsText.textContent = '';
            return;
        }
        const typeLabel = topic.isTest ? 'тестовых вопросов' : 'заданий';
        bankTopicStatsText.innerHTML = `В теме: <strong>${topic.tasks.length}</strong> ${typeLabel} · Класс: <strong>${escapeHtml(topic.class || 'Все')}</strong>`;
    }

    let bankTopicsInitialized = false;
    function initBankTopics() {
        if (bankTopicsInitialized) return;
        if (!window.BankTasksData) return;
        bankTopicsInitialized = true;
        populateBankTopicSelect(bankTopicSelect);
        updateBankTopicStats();
    }

    if (bankTopicSelect) {
        bankTopicSelect.addEventListener('change', () => {
            updateBankTopicStats();
            const tid = bankTopicSelect.value;
            if (tid && window.BankTasksData) {
                const topic = window.BankTasksData.getTopicById(tid);
                if (topic && hwInputSubject) {
                    if (topic.subject === 'physics') {
                        hwInputSubject.value = 'Физика';
                    } else if (topic.subject === 'english') {
                        hwInputSubject.value = 'Английский язык';
                    } else if (topic.subject === 'math') {
                        hwInputSubject.value = 'Математика';
                    } else if (topic.subject === 'informatics') {
                        hwInputSubject.value = 'Информатика';
                    }
                }
            }
        });
    }

    if (btnAddBankRandom) {
        btnAddBankRandom.addEventListener('click', () => {
            const tid = bankTopicSelect ? bankTopicSelect.value : '';
            if (!tid) {
                alert('Пожалуйста, выберите тему из Банка задач.');
                if (bankTopicSelect) bankTopicSelect.focus();
                return;
            }
            if (!window.BankTasksData || !window.BankTasksRunner) {
                alert('Модуль Банка задач ещё загружается...');
                return;
            }
            const topic = window.BankTasksData.getTopicById(tid);
            if (!topic || !Array.isArray(topic.tasks) || topic.tasks.length === 0) {
                alert('В выбранной теме нет заданий.');
                return;
            }

            const count = Math.max(1, Math.min(topic.tasks.length, parseInt(bankTasksCount.value, 10) || 3));
            const existingBankIds = new Set(constructorDraftTasks.map(t => t.bankTaskId || t.id));
            const available = topic.tasks.filter(t => !existingBankIds.has(t.id));

            if (available.length === 0) {
                alert('Все задания из этой темы уже добавлены в ваше текущее домашнее задание!');
                return;
            }

            const shuffled = [...available].sort(() => 0.5 - Math.random());
            const toAdd = shuffled.slice(0, count);

            const converted = toAdd.map(t => window.BankTasksRunner.convertBankTaskToHomeworkTask(t, topic));
            constructorDraftTasks = constructorDraftTasks.concat(converted);
            renderConstructorDraft();
            showToast(`Добавлено ${converted.length} зад. из темы «${topic.title}»`);
        });
    }

    // --- Manual Task Picker Modal Logic ---
    let pickerCurrentTopic = null;
    let pickerSelectedTaskIds = new Set();

    function openBankPickerModal(topicId) {
        if (!modalBankTasksPicker || !window.BankTasksData) return;
        const defaultTid = topicId || (bankTopicSelect ? bankTopicSelect.value : '') || (window.BankTasksData.topics[0] ? window.BankTasksData.topics[0].id : '');
        populateBankTopicSelect(modalBankTopicSelect, defaultTid);
        if (modalBankTopicSelect) {
            modalBankTopicSelect.value = defaultTid;
        }
        loadPickerTopic(defaultTid);
        if (modalBankSearch) modalBankSearch.value = '';
        modalBankTasksPicker.showModal();
    }

    function loadPickerTopic(topicId) {
        pickerSelectedTaskIds.clear();
        pickerCurrentTopic = window.BankTasksData ? window.BankTasksData.getTopicById(topicId) : null;
        const subtitle = document.getElementById('bank-picker-topic-subtitle');
        if (subtitle && pickerCurrentTopic) {
            subtitle.textContent = `${pickerCurrentTopic.title} · ${pickerCurrentTopic.tasks.length} заданий (Класс: ${pickerCurrentTopic.class || 'Все'})`;
        }
        renderPickerTasks();
    }

    function renderPickerTasks() {
        if (!modalBankTasksList) return;
        if (!pickerCurrentTopic || !Array.isArray(pickerCurrentTopic.tasks) || pickerCurrentTopic.tasks.length === 0) {
            modalBankTasksList.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--muted);">В этой теме пока нет заданий</div>';
            updatePickerSelectionCount();
            return;
        }

        const searchQuery = modalBankSearch ? modalBankSearch.value.trim().toLowerCase() : '';
        const existingBankIds = new Set(constructorDraftTasks.map(t => t.bankTaskId || t.id));

        let visibleTasks = pickerCurrentTopic.tasks;
        if (searchQuery) {
            visibleTasks = visibleTasks.filter(t => {
                const raw = ((t.text || '') + ' ' + (t.html || '') + ' ' + (t.title || '') + ' ' + (t.explanation || '')).toLowerCase();
                return raw.includes(searchQuery);
            });
        }

        if (visibleTasks.length === 0) {
            modalBankTasksList.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--muted);">Ничего не найдено по вашему поисковому запросу</div>';
            updatePickerSelectionCount();
            return;
        }

        modalBankTasksList.innerHTML = visibleTasks.map((t, idx) => {
            const isAlreadyInDraft = existingBankIds.has(t.id);
            const isChecked = pickerSelectedTaskIds.has(t.id);
            const itemBg = isAlreadyInDraft ? 'rgba(255, 255, 255, 0.02)' : 'var(--surface-card)';
            const itemBorder = isChecked ? 'var(--accent-cyan)' : 'var(--line)';

            let previewText = t.html ? t.html : (t.text || '');
            if (previewText.length > 250) {
                previewText = previewText.slice(0, 250) + '...';
            }

            let optionsPreview = '';
            if (t.options && Array.isArray(t.options)) {
                const letters = ['А', 'Б', 'В', 'Г'];
                optionsPreview = `
                    <div style="margin-top:6px; font-size:0.8rem; color:var(--muted); display:flex; flex-wrap:wrap; gap:8px;">
                        ${t.options.map((opt, i) => `<span><strong style="color:var(--ink);">${letters[i] || (i+1)})</strong> ${escapeHtml(opt)}</span>`).join('')}
                    </div>
                `;
            }

            let thumbHtml = '';
            if (t.image) {
                const cleanPath = t.image.replace(/^(\.\.\/|\.\/)+/, '');
                thumbHtml = `<img src="${cleanPath}" alt="" style="width:54px; height:54px; object-fit:cover; border-radius:6px; border:1px solid var(--line); flex-shrink:0;">`;
            }

            return `
                <div class="bank-picker-task-card" data-task-id="${t.id}" style="display:flex; gap:12px; align-items:flex-start; padding:10px 14px; background:${itemBg}; border:1px solid ${itemBorder}; border-radius:var(--r-sm); opacity:${isAlreadyInDraft ? 0.6 : 1};">
                    <input type="checkbox" class="bank-picker-cb" data-task-id="${t.id}" ${isAlreadyInDraft ? 'disabled' : ''} ${isChecked ? 'checked' : ''} style="margin-top:4px; width:18px; height:18px; cursor:${isAlreadyInDraft ? 'default' : 'pointer'}; accent-color:var(--accent-cyan);">
                    ${thumbHtml}
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="font-weight:700; font-size:0.88rem; color:var(--ink);">
                                №${t.num || idx + 1}. ${escapeHtml(t.title || 'Задание')}
                            </span>
                            ${isAlreadyInDraft ? '<span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:700;">✓ Уже в Д/З</span>' : ''}
                        </div>
                        <div style="font-size:0.84rem; color:var(--ink); line-height:1.4;">${previewText}</div>
                        ${optionsPreview}
                        ${t.unit ? `<div style="font-size:0.78rem; color:var(--muted); margin-top:4px;">Ед. изм.: <strong>${escapeHtml(t.unit)}</strong></div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        modalBankTasksList.querySelectorAll('.bank-picker-cb').forEach(cb => {
            cb.addEventListener('change', () => {
                const tid = cb.getAttribute('data-task-id');
                if (cb.checked) {
                    pickerSelectedTaskIds.add(tid);
                } else {
                    pickerSelectedTaskIds.delete(tid);
                }
                const card = cb.closest('.bank-picker-task-card');
                if (card) {
                    card.style.borderColor = cb.checked ? 'var(--accent-cyan)' : 'var(--line)';
                }
                updatePickerSelectionCount();
            });
        });

        updatePickerSelectionCount();
    }

    function updatePickerSelectionCount() {
        if (modalBankSelectedCount) {
            modalBankSelectedCount.textContent = pickerSelectedTaskIds.size;
        }
    }

    if (btnOpenBankPicker) {
        btnOpenBankPicker.addEventListener('click', () => {
            const tid = bankTopicSelect ? bankTopicSelect.value : '';
            openBankPickerModal(tid);
        });
    }

    if (modalBankTopicSelect) {
        modalBankTopicSelect.addEventListener('change', () => {
            loadPickerTopic(modalBankTopicSelect.value);
        });
    }

    if (modalBankSearch) {
        modalBankSearch.addEventListener('input', () => {
            renderPickerTasks();
        });
    }

    if (btnBankSelectAll) {
        btnBankSelectAll.addEventListener('click', () => {
            if (!pickerCurrentTopic || !modalBankTasksList) return;
            modalBankTasksList.querySelectorAll('.bank-picker-cb:not(:disabled)').forEach(cb => {
                const tid = cb.getAttribute('data-task-id');
                cb.checked = true;
                pickerSelectedTaskIds.add(tid);
                const card = cb.closest('.bank-picker-task-card');
                if (card) card.style.borderColor = 'var(--accent-cyan)';
            });
            updatePickerSelectionCount();
        });
    }

    if (btnBankDeselectAll) {
        btnBankDeselectAll.addEventListener('click', () => {
            if (!modalBankTasksList) return;
            modalBankTasksList.querySelectorAll('.bank-picker-cb').forEach(cb => {
                const tid = cb.getAttribute('data-task-id');
                cb.checked = false;
                pickerSelectedTaskIds.delete(tid);
                const card = cb.closest('.bank-picker-task-card');
                if (card) card.style.borderColor = 'var(--line)';
            });
            updatePickerSelectionCount();
        });
    }

    if (btnConfirmAddBankTasks) {
        btnConfirmAddBankTasks.addEventListener('click', () => {
            if (pickerSelectedTaskIds.size === 0) {
                alert('Пожалуйста, отметьте галочками хотя бы одну задачу.');
                return;
            }
            if (!pickerCurrentTopic || !window.BankTasksRunner) return;

            const tasksToAdd = pickerCurrentTopic.tasks.filter(t => pickerSelectedTaskIds.has(t.id));
            const converted = tasksToAdd.map(t => window.BankTasksRunner.convertBankTaskToHomeworkTask(t, pickerCurrentTopic));

            constructorDraftTasks = constructorDraftTasks.concat(converted);
            renderConstructorDraft();
            modalBankTasksPicker.close();
            showToast(`Добавлено ${converted.length} задач в черновик Д/З!`);
        });
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'teacher_hw_draft_tasks') {
            loadDraftFromStorage();
            renderConstructorDraft();
        }
    });


    // =========================================================================
    // HOMEWORK GRADING & REVIEW
    // =========================================================================
    const gradingHwGrid = document.getElementById('grading-hw-grid');
    const btnRefreshGrading = document.getElementById('btn-refresh-grading');
    const modalSubmissionsList = document.getElementById('modal-submissions-list');
    const submissionsTableBody = document.getElementById('submissions-table-body');
    const modalReviewSubmission = document.getElementById('modal-review-submission');
    const formGradeSubmission = document.getElementById('form-grade-submission');

    let currentReviewHw = null;
    let currentReviewSubmission = null;

    let gradingHomeworksCache = [];
    let activeGradingFilter = 'all';
    let gradingSearchQuery = '';

    let currentHwSubmissions = [];
    let currentSubmissionsFilter = 'all';
    let gradingToolbarBound = false;
    let submissionsToolbarBound = false;

    if (btnRefreshGrading) {
        btnRefreshGrading.addEventListener('click', loadGrading);
    }

    // Автообновление списка сданных работ при оценивании в новом окне
    window.addEventListener('message', (ev) => {
        if (ev.data && ev.data.type === 'hw-graded') {
            if (currentReviewHw) {
                openSubmissionsModal(currentReviewHw);
            }
            loadGrading();
        }
    });

    function getHwGradingPriority(h) {
        const subCount = h.submittedCount !== undefined ? h.submittedCount : (h.submissions_count || 0);
        const chkCount = h.checkedCount !== undefined ? h.checkedCount : (h.checked_count || 0);
        const unreviewed = Math.max(0, subCount - chkCount);

        // 0: Непроверенные работы (есть сданные, требующие проверки) -> В САМОМ ВЕРХУ!
        if (unreviewed > 0) return 0;
        // 1: Ожидают сдачи (пока 0 сданных работ)
        if (subCount === 0) return 1;
        // 2: Уже проверенные работы (все сданные проверены) -> ВНИЗ СПИСКА!
        return 2;
    }

    function initGradingToolbar() {
        if (gradingToolbarBound) return;
        gradingToolbarBound = true;

        document.querySelectorAll('.grading-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.grading-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeGradingFilter = btn.getAttribute('data-filter') || 'all';
                renderGradingGrid();
            });
        });

        const searchInput = document.getElementById('grading-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                gradingSearchQuery = (e.target.value || '').trim().toLowerCase();
                renderGradingGrid();
            });
        }
    }

    function updateGradingTabBadge(homeworks) {
        const badge = document.getElementById('tab-grading-badge');
        if (!badge || !Array.isArray(homeworks)) return;

        let totalUnreviewedWorks = 0;
        homeworks.forEach(h => {
            const subCount = h.submittedCount !== undefined ? h.submittedCount : (h.submissions_count || 0);
            const chkCount = h.checkedCount !== undefined ? h.checkedCount : (h.checked_count || 0);
            totalUnreviewedWorks += Math.max(0, subCount - chkCount);
        });

        if (totalUnreviewedWorks > 0) {
            badge.textContent = totalUnreviewedWorks > 99 ? '99+' : String(totalUnreviewedWorks);
            badge.classList.remove('hidden');
        } else {
            badge.textContent = '0';
            badge.classList.add('hidden');
        }
    }

    async function refreshGradingTabBadge() {
        try {
            const res = await fetch('/api/teacher/homeworks', { cache: 'no-store' });
            const data = await res.json();
            if (data && data.success && Array.isArray(data.homeworks)) {
                gradingHomeworksCache = data.homeworks;
                updateGradingTabBadge(gradingHomeworksCache);
            }
        } catch (e) {
            console.error('Error refreshing grading tab badge:', e);
        }
    }

    function updateGradingCounters() {
        const total = gradingHomeworksCache.length;
        let unreviewed = 0;
        let checked = 0;
        let pending = 0;

        gradingHomeworksCache.forEach(h => {
            const p = getHwGradingPriority(h);
            if (p === 0) unreviewed++;
            else if (p === 2) checked++;
            else pending++;
        });

        const cntAll = document.getElementById('count-grading-all');
        const cntUnrev = document.getElementById('count-grading-unreviewed');
        const cntChk = document.getElementById('count-grading-checked');
        const cntPend = document.getElementById('count-grading-pending');

        if (cntAll) cntAll.textContent = total;
        if (cntUnrev) cntUnrev.textContent = unreviewed;
        if (cntChk) cntChk.textContent = checked;
        if (cntPend) cntPend.textContent = pending;

        updateGradingTabBadge(gradingHomeworksCache);
    }

    function renderGradingGrid() {
        if (!gradingHwGrid) return;

        if (gradingHomeworksCache.length === 0) {
            gradingHwGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:3.5rem 1rem; background:var(--surface-card); border:1px solid var(--line); border-radius:var(--r); color:var(--muted);">
                    <div style="font-size:2.5rem; margin-bottom:0.75rem;">📝</div>
                    <div style="font-weight:700; font-size:1.1rem; color:var(--ink); margin-bottom:0.4rem;">Вы пока не создали ни одного домашнего задания</div>
                    <div style="font-size:0.9rem; margin-bottom:1.25rem;">Используйте конструктор, чтобы быстро собрать Д/З из тренажёров ОГЭ.</div>
                    <button type="button" class="btn btn-emerald btn-sm" onclick="switchTab('constructor')">
                        🛠️ Перейти в конструктор
                    </button>
                </div>
            `;
            return;
        }

        // 1. Фильтрация по активной вкладке фильтра
        let filtered = gradingHomeworksCache.filter(h => {
            const p = getHwGradingPriority(h);
            if (activeGradingFilter === 'needs_review') return p === 0;
            if (activeGradingFilter === 'checked') return p === 2;
            if (activeGradingFilter === 'pending') return p === 1;
            return true;
        });

        // 2. Поиск по строке
        if (gradingSearchQuery) {
            filtered = filtered.filter(h => {
                const title = (h.title || '').toLowerCase();
                const cls = (h.className || h.class_name || '').toLowerCase();
                const subj = (h.subject || '').toLowerCase();
                const student = (h.studentName || '').toLowerCase();
                return title.includes(gradingSearchQuery) ||
                       cls.includes(gradingSearchQuery) ||
                       subj.includes(gradingSearchQuery) ||
                       student.includes(gradingSearchQuery);
            });
        }

        if (filtered.length === 0) {
            gradingHwGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:2.5rem 1rem; background:var(--surface-card); border:1px solid var(--line); border-radius:var(--r); color:var(--muted);">
                    <div style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
                    <div style="font-weight:700; font-size:1rem; color:var(--ink); margin-bottom:0.3rem;">В этой категории задания не найдены</div>
                    <div style="font-size:0.85rem;">Попробуйте переключить фильтр или изменить поисковый запрос</div>
                </div>
            `;
            return;
        }

        // 3. СОРТИРОВКА:
        // Priority 0 (Непроверенные работы) — вверху!
        // Priority 1 (Ожидают сдачи) — в середине
        // Priority 2 (Уже проверенные работы) — улетают вниз списка!
        filtered.sort((a, b) => {
            const pA = getHwGradingPriority(a);
            const pB = getHwGradingPriority(b);
            if (pA !== pB) return pA - pB;

            // Внутри группы "требуют проверки" сначала те, где больше непроверенных работ
            if (pA === 0) {
                const unrevA = Math.max(0, (a.submittedCount ?? a.submissions_count ?? 0) - (a.checkedCount ?? a.checked_count ?? 0));
                const unrevB = Math.max(0, (b.submittedCount ?? b.submissions_count ?? 0) - (b.checkedCount ?? b.checked_count ?? 0));
                if (unrevB !== unrevA) return unrevB - unrevA;
            }

            // Иначе сортируем по дате создания (свежие выше)
            const tA = new Date(a.created_at || a.createdAt || 0).getTime();
            const tB = new Date(b.created_at || b.createdAt || 0).getTime();
            return tB - tA;
        });

        // 4. Отрисовка карточек с визуальными разделителями групп при отображении всех
        let html = '';
        let lastPriority = null;
        const showDividers = (activeGradingFilter === 'all' && !gradingSearchQuery);

        filtered.forEach(h => {
            const p = getHwGradingPriority(h);

            if (showDividers && p !== lastPriority) {
                if (p === 0) {
                    const unrevTotal = filtered.filter(x => getHwGradingPriority(x) === 0).length;
                    html += `
                        <div class="grading-group-divider" style="color:var(--accent-gold);">
                            <span>🔔 Непроверенные работы · Требуют проверки (${unrevTotal})</span>
                            <div style="flex:1; height:1px; background:rgba(245, 158, 11, 0.3);"></div>
                        </div>
                    `;
                } else if (p === 1) {
                    const pendTotal = filtered.filter(x => getHwGradingPriority(x) === 1).length;
                    html += `
                        <div class="grading-group-divider" style="color:var(--muted);">
                            <span>⏳ Ожидают сдачи учениками (${pendTotal})</span>
                            <div style="flex:1; height:1px; background:var(--line);"></div>
                        </div>
                    `;
                } else if (p === 2) {
                    const chkTotal = filtered.filter(x => getHwGradingPriority(x) === 2).length;
                    html += `
                        <div class="grading-group-divider" style="color:var(--accent-emerald);">
                            <span>✓ Уже проверенные работы (${chkTotal})</span>
                            <div style="flex:1; height:1px; background:rgba(16, 185, 129, 0.3);"></div>
                        </div>
                    `;
                }
                lastPriority = p;
            }

            const taskCount = h.tasks ? h.tasks.length : (h.tasksCount || 0);
            const subCount = h.submittedCount !== undefined ? h.submittedCount : (h.submissions_count || 0);
            const chkCount = h.checkedCount !== undefined ? h.checkedCount : (h.checked_count || 0);
            const unreviewedCount = Math.max(0, subCount - chkCount);
            const createdStr = (h.created_at || h.createdAt) ? formatDateTime(h.created_at || h.createdAt) : '—';
            const deadlineStr = (h.deadline || h.deadlineAt) ? formatDateTime(h.deadline || h.deadlineAt) : 'Бессрочно';

            let cardExtraClass = '';
            let statusBadge = '';
            let submissionsBtnText = `👥 Сданные работы (${subCount})`;
            let submissionsBtnClass = 'btn-secondary';

            if (p === 0) {
                cardExtraClass = 'hw-card-needs-review';
                statusBadge = `<span class="badge" style="background:rgba(245,158,11,0.18); color:var(--accent-gold); font-weight:800; border:1px solid rgba(245,158,11,0.4);">🔔 Не проверено: ${unreviewedCount}</span>`;
                submissionsBtnText = `👥 Сданные работы (${subCount}) · 🔔 Проверить (${unreviewedCount})`;
                submissionsBtnClass = 'btn-emerald';
            } else if (p === 2) {
                cardExtraClass = 'hw-card-checked';
                statusBadge = `<span class="badge" style="background:rgba(16,185,129,0.15); color:var(--accent-emerald); font-weight:700; border:1px solid rgba(16,185,129,0.35);">✓ Все проверены</span>`;
                submissionsBtnText = `👥 Сданные работы (${subCount}) · ✓`;
                submissionsBtnClass = 'btn-secondary';
            } else {
                statusBadge = `<span class="badge" style="background:rgba(148,163,184,0.12); color:var(--muted); font-weight:600; border:1px solid var(--line);">⏳ Ожидает сдачи</span>`;
                submissionsBtnText = `👥 Сданные работы (0)`;
                submissionsBtnClass = 'btn-secondary';
            }

            html += `
                <div class="hw-card ${cardExtraClass}" id="hw-card-${h.id}">
                    <div class="hw-card-top">
                        <div class="hw-card-meta">
                            <span class="lesson-class-badge">🏫 ${escapeHtml(h.className || h.class_name)}</span>
                            ${h.studentName ? `<span class="lesson-class-badge" style="background:rgba(255,119,40,0.15); border-color:rgba(255,119,40,0.3); color:var(--accent);">👤 ${escapeHtml(h.studentName)}</span>` : ''}
                            ${statusBadge}
                            <span style="color:var(--accent-cyan); font-weight:700;">${escapeHtml(h.subject)}</span>
                            <span title="Дата создания задания" style="display:inline-flex; align-items:center; gap:3px;">📅 Выдано: <strong style="color:var(--ink);">${createdStr}</strong></span>
                            <span title="Срок сдачи задания" style="display:inline-flex; align-items:center; gap:3px;">⏳ Срок: <strong style="color:var(--ink);">${deadlineStr}</strong></span>
                        </div>
                        <h3 class="hw-card-title">${escapeHtml(h.title)}</h3>
                        ${h.description ? `<p style="font-size:0.85rem; color:var(--muted);">${escapeHtml(h.description)}</p>` : ''}
                    </div>

                    <div class="hw-card-stats">
                        <div>
                            <div class="hw-stat-val" style="color:var(--accent);">${taskCount}</div>
                            <div class="hw-stat-lbl">Заданий</div>
                        </div>
                        <div>
                            <div class="hw-stat-val" style="color:var(--accent-gold);">${subCount}</div>
                            <div class="hw-stat-lbl">Сдано работ</div>
                        </div>
                        <div>
                            <div class="hw-stat-val" style="color:var(--accent-emerald);">${chkCount}</div>
                            <div class="hw-stat-lbl">Проверено</div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <button type="button" class="btn ${submissionsBtnClass} btn-sm btn-view-submissions" data-hw-id="${h.id}">
                                ${submissionsBtnText}
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm btn-edit-hw" data-hw-id="${h.id}" title="Редактировать условия, состав задач и параметры задания">
                                ✏️ Редактировать
                            </button>
                            <a href="homework.html?id=${h.id}" target="_blank" class="btn btn-secondary btn-sm" title="Смотреть домашнее задание с ответами" style="text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                                👀 Смотреть
                            </a>
                        </div>
                        <button type="button" class="btn btn-danger-outline btn-sm btn-delete-hw" data-hw-id="${h.id}" title="Удалить Д/З">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        gradingHwGrid.innerHTML = html;

        // View submissions buttons
        gradingHwGrid.querySelectorAll('.btn-view-submissions').forEach(b => {
            b.addEventListener('click', () => {
                const hwId = parseInt(b.getAttribute('data-hw-id'), 10);
                const foundHw = gradingHomeworksCache.find(h => h.id === hwId);
                if (foundHw) openSubmissionsModal(foundHw);
            });
        });

        // Edit HW buttons
        gradingHwGrid.querySelectorAll('.btn-edit-hw').forEach(b => {
            b.addEventListener('click', async () => {
                const hwId = parseInt(b.getAttribute('data-hw-id'), 10);
                await startEditingHomework(hwId);
            });
        });

        // Delete HW buttons
        gradingHwGrid.querySelectorAll('.btn-delete-hw').forEach(b => {
            b.addEventListener('click', async () => {
                const hwId = b.getAttribute('data-hw-id');
                if (!confirm('Вы действительно хотите удалить это домашнее задание? (История и прогресс сданных работ сохранятся в досье учеников)')) return;
                try {
                    const delRes = await fetch(`/api/teacher/homeworks/${hwId}`, { method: 'DELETE' });
                    const delData = await delRes.json();
                    if (delData.success) {
                        showToast('Домашнее задание удалено');
                        loadGrading();
                    } else {
                        alert(delData.error || 'Ошибка при удалении');
                    }
                } catch(e) { alert('Ошибка сети'); }
            });
        });
    }

    async function loadGrading() {
        if (!gradingHwGrid) return;
        initGradingToolbar();
        gradingHwGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--muted); grid-column:1/-1;">Загрузка домашних заданий...</div>';

        try {
            const res = await fetch('/api/teacher/homeworks', { cache: 'no-store' });
            const data = await res.json();
            if (!data.success) {
                gradingHwGrid.innerHTML = `<div style="text-align:center; color:var(--danger); grid-column:1/-1;">${data.error || 'Ошибка загрузки заданий'}</div>`;
                return;
            }

            gradingHomeworksCache = data.homeworks || [];
            updateGradingCounters();
            renderGradingGrid();
        } catch(err) {
            gradingHwGrid.innerHTML = '<div style="text-align:center; color:var(--danger); grid-column:1/-1;">Ошибка загрузки домашних заданий.</div>';
        }
    }

    function initSubmissionsToolbar(hw) {
        if (submissionsToolbarBound) return;
        submissionsToolbarBound = true;

        document.querySelectorAll('.sub-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSubmissionsFilter = btn.getAttribute('data-filter') || 'all';
                renderSubmissionsTable(currentReviewHw || hw);
            });
        });
    }

    function updateSubmissionsCounters() {
        const total = currentHwSubmissions.length;
        const submitted = currentHwSubmissions.filter(s => s.status === 'submitted').length;
        const checked = currentHwSubmissions.filter(s => s.status === 'checked').length;
        const pending = currentHwSubmissions.filter(s => !s.status || s.status === 'not_started').length;

        const cntAll = document.getElementById('sub-cnt-all');
        const cntSub = document.getElementById('sub-cnt-submitted');
        const cntChk = document.getElementById('sub-cnt-checked');
        const cntPend = document.getElementById('sub-cnt-pending');

        if (cntAll) cntAll.textContent = total;
        if (cntSub) cntSub.textContent = submitted;
        if (cntChk) cntChk.textContent = checked;
        if (cntPend) cntPend.textContent = pending;
    }

    function getSubPriority(s) {
        // 0: Непроверенные работы (сдано, ожидает проверки) -> В САМОМ ВЕРХУ!
        if (s.status === 'submitted') return 0;
        // 1: Уже проверенные работы -> ВНИЗ СПИСКА СДАННЫХ РАБОТ!
        if (s.status === 'checked') return 1;
        // 2: Не начато (ещё не сдали)
        if (s.status === 'not_started' || !s.status) return 2;
        // 3: Освобождён
        return 3;
    }

    function renderSubmissionsTable(hw) {
        if (!submissionsTableBody) return;

        let filtered = currentHwSubmissions.filter(s => {
            if (currentSubmissionsFilter === 'submitted') return s.status === 'submitted';
            if (currentSubmissionsFilter === 'checked') return s.status === 'checked';
            if (currentSubmissionsFilter === 'not_started') return (!s.status || s.status === 'not_started');
            return true;
        });

        if (filtered.length === 0) {
            submissionsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--muted);">В этой категории нет работ.</td></tr>`;
            return;
        }

        // СОРТИРОВКА:
        // Непроверенные работы (status: submitted) -> ВСЕГДА ВВЕРХУ!
        // Уже проверенные работы (status: checked) -> УЛЕТАЮТ ВНИЗ!
        // Не начато -> в самом конце списка
        filtered.sort((a, b) => {
            const pA = getSubPriority(a);
            const pB = getSubPriority(b);
            if (pA !== pB) return pA - pB;

            // Внутри непроверенных — сначала те, кто сдал раньше (FIFO)
            if (pA === 0) {
                const tA = new Date(a.submittedAt || a.submitted_at || 0).getTime();
                const tB = new Date(b.submittedAt || b.submitted_at || 0).getTime();
                if (tA && tB && tA !== tB) return tA - tB;
            }

            // Внутри проверенных — сначала недавно проверенные
            if (pA === 1) {
                const tA = new Date(a.checkedAt || a.checked_at || 0).getTime();
                const tB = new Date(b.checkedAt || b.checked_at || 0).getTime();
                if (tA && tB && tA !== tB) return tB - tA;
            }

            // По алфавиту
            const nameA = (a.displayName || a.display_name || a.username || a.student_username || '').toLowerCase();
            const nameB = (b.displayName || b.display_name || b.username || b.student_username || '').toLowerCase();
            return nameA.localeCompare(nameB, 'ru');
        });

        let html = '';
        let lastPriority = null;
        const showSubDividers = (currentSubmissionsFilter === 'all');

        filtered.forEach(s => {
            const p = getSubPriority(s);

            if (showSubDividers && p !== lastPriority) {
                if (p === 0) {
                    const subCount = filtered.filter(x => getSubPriority(x) === 0).length;
                    html += `
                        <tr style="background: rgba(245, 158, 11, 0.08);">
                            <td colspan="5" style="padding: 6px 12px; font-weight: 800; font-size: 0.78rem; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.04em;">
                                🔔 Непроверенные работы (${subCount})
                            </td>
                        </tr>
                    `;
                } else if (p === 1) {
                    const chkCount = filtered.filter(x => getSubPriority(x) === 1).length;
                    html += `
                        <tr style="background: rgba(16, 185, 129, 0.08);">
                            <td colspan="5" style="padding: 6px 12px; font-weight: 800; font-size: 0.78rem; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 0.04em;">
                                ✓ Уже проверенные работы (${chkCount})
                            </td>
                        </tr>
                    `;
                } else if (p === 2) {
                    const pendCount = filtered.filter(x => getSubPriority(x) === 2).length;
                    html += `
                        <tr style="background: rgba(148, 163, 184, 0.06);">
                            <td colspan="5" style="padding: 6px 12px; font-weight: 700; font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em;">
                                ⏳ Не сдано (${pendCount})
                            </td>
                        </tr>
                    `;
                }
                lastPriority = p;
            }

            let statusBadge = '';
            let rowClass = '';
            if (s.status === 'waived') {
                statusBadge = `<span class="badge" style="background:rgba(255, 119, 40, 0.15); color:var(--accent); font-weight:700;">📜 Освобождён</span>`;
            } else if (s.status === 'checked') {
                statusBadge = `<span class="badge badge-status status-checked">✓ Проверено</span>`;
                rowClass = 'sub-row-checked';
            } else if (s.status === 'submitted') {
                statusBadge = `<span class="badge badge-status status-submitted">🔔 Ждёт проверки</span>`;
                rowClass = 'sub-row-needs-review';
            } else {
                statusBadge = `<span class="badge badge-status status-pending">Не начато</span>`;
            }

            const maxSc = s.maxScore || s.max_score || (hw.tasks ? hw.tasks.length : (hw.tasksCount || 0));
            const scoreDisplay = (s.status === 'checked' || s.status === 'waived') 
                ? `<strong style="color:var(--accent-emerald); font-size:1rem;">${s.score}</strong> / ${maxSc}` 
                : (s.status === 'submitted' ? `<span style="color:var(--accent-gold); font-weight:700;">${s.score} / ${maxSc}</span> (авто)` : '—');
            const submitTime = (s.submittedAt || s.submitted_at) ? formatDateTime(s.submittedAt || s.submitted_at) : '—';
            const sName = s.displayName || s.display_name || s.username || s.student_username;
            const sUname = s.username || s.student_username;
            const sId = s.studentId || s.student_id;

            let actionHtml = '';
            if (s.status === 'submitted') {
                actionHtml = `
                    <a href="homework.html?id=${hw.id}&student_id=${sId}" target="_blank" class="btn btn-emerald btn-sm" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px; font-weight:600;" title="Проверить работу в отдельном окне на весь экран">
                        🔍 Проверить в новом окне
                    </a>
                    <button type="button" class="btn btn-secondary btn-sm btn-review-work" data-student-id="${sId}" title="Быстрый просмотр в компактном окне" style="margin-left:4px; padding:0.25rem 0.55rem; font-size:0.8rem;">
                        🗗 В окне
                    </button>
                `;
            } else if (s.status === 'checked') {
                actionHtml = `
                    <a href="homework.html?id=${hw.id}&student_id=${sId}" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px; font-weight:600;" title="Проверить работу в отдельном окне на весь экран">
                        ✏️ Изменить в новом окне
                    </a>
                    <button type="button" class="btn btn-secondary btn-sm btn-review-work" data-student-id="${sId}" title="Быстрый просмотр в компактном окне" style="margin-left:4px; padding:0.25rem 0.55rem; font-size:0.8rem;">
                        🗗 В окне
                    </button>
                `;
            } else {
                actionHtml = `
                    <span style="color:var(--muted); font-size:0.82rem; font-style:italic;">Не сдано</span>
                    <button type="button" class="btn btn-secondary btn-sm btn-review-work" data-student-id="${sId}" title="Ручная проверка / оценивание" style="margin-left:6px; opacity:0.8; font-size:0.75rem; padding:3px 8px;">
                        🗗 Оценить
                    </button>
                `;
            }

            html += `
                <tr class="${rowClass}">
                    <td>
                        <div style="font-weight:700;">${escapeHtml(sName)}</div>
                        <div style="font-size:0.75rem; color:var(--muted);">@${escapeHtml(sUname)}</div>
                    </td>
                    <td>${statusBadge}</td>
                    <td style="font-size:0.85rem;">${submitTime}</td>
                    <td>${scoreDisplay}</td>
                    <td style="text-align:right; white-space:nowrap;">
                        ${actionHtml}
                    </td>
                </tr>
            `;
        });

        submissionsTableBody.innerHTML = html;

        // Attach review clicks
        submissionsTableBody.querySelectorAll('.btn-review-work').forEach(b => {
            b.addEventListener('click', () => {
                const sId = parseInt(b.getAttribute('data-student-id'), 10);
                const foundSub = currentHwSubmissions.find(s => (s.studentId || s.student_id) === sId);
                if (foundSub) openReviewSubmissionModal(foundSub, currentReviewHw || hw);
            });
        });
    }

    async function openSubmissionsModal(hw) {
        currentReviewHw = hw;
        initSubmissionsToolbar(hw);
        document.getElementById('submissions-modal-title').textContent = hw.title;
        const initialTaskCount = (hw.tasks && hw.tasks.length) ? hw.tasks.length : (hw.tasksCount || 0);
        const sNameInit = hw.studentName || (hw.student_name ? hw.student_name : '');
        const studentSubInit = sNameInit ? ` · 👤 Индивидуально: ${sNameInit}` : '';
        const crDateInit = (hw.created_at || hw.createdAt) ? formatDateTime(hw.created_at || hw.createdAt) : '—';
        document.getElementById('submissions-modal-subtitle').textContent = `Класс: ${hw.class_name || hw.className || ''}${studentSubInit} · 📅 Выдано: ${crDateInit} · Всего заданий: ${initialTaskCount}`;
        submissionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--muted);">Загрузка работ...</td></tr>';
        modalSubmissionsList.showModal();

        try {
            const res = await fetch(`/api/teacher/homeworks/${hw.id}/submissions`, { cache: 'no-store' });
            const data = await res.json();
            if (!data.success) {
                submissionsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--danger);">${data.error || 'Ошибка загрузки'}</td></tr>`;
                return;
            }

            if (data.homework) {
                hw = Object.assign(hw, data.homework);
                currentReviewHw = hw;
                const updatedTaskCount = (hw.tasks && hw.tasks.length) ? hw.tasks.length : (hw.tasksCount || 0);
                const sNameUpd = hw.studentName || (hw.student_name ? hw.student_name : '');
                const studentSubUpd = sNameUpd ? ` · 👤 Индивидуально: ${sNameUpd}` : '';
                const crDateUpd = (hw.created_at || hw.createdAt) ? formatDateTime(hw.created_at || hw.createdAt) : '—';
                document.getElementById('submissions-modal-subtitle').textContent = `Класс: ${hw.class_name || hw.className || ''}${studentSubUpd} · 📅 Выдано: ${crDateUpd} · Всего заданий: ${updatedTaskCount}`;
            }

            currentHwSubmissions = data.submissions || [];
            updateSubmissionsCounters();
            renderSubmissionsHeatmap(hw, currentHwSubmissions);
            renderSubmissionsTable(hw);

        } catch(e) {
            submissionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--danger);">Ошибка при запросе к серверу</td></tr>';
        }
    }

    function evaluateStudentTaskAnswer(t, i, answers) {
        const taskId = t.taskId || t.id || `task_${i + 1}`;
        const safeAnswers = answers || {};
        const rawAns = (safeAnswers[i] !== undefined)
            ? safeAnswers[i]
            : (safeAnswers[String(i)] !== undefined
                ? safeAnswers[String(i)]
                : (safeAnswers[taskId] !== undefined
                    ? safeAnswers[taskId]
                    : (safeAnswers[`task_${i + 1}`] !== undefined ? safeAnswers[`task_${i + 1}`] : '')));

        const studentAns = (typeof rawAns === 'object' && rawAns !== null)
            ? String(rawAns.answer !== undefined ? rawAns.answer : '').trim()
            : String(rawAns !== undefined ? rawAns : '').trim();

        const primaryCorrectAns = String(t.answer !== undefined && String(t.answer).trim() !== '' ? t.answer : (t.displayAnswer || '')).trim();
        const correctAns = cleanDisplayAnswer(t.displayAnswer || t.answer || '').trim();

        const normStudent = studentAns.replace(/\s+/g, '').replace(',', '.');
        const normPrimary = primaryCorrectAns.replace(/\s+/g, '').replace(',', '.');
        const normDisplay = correctAns.replace(/\s+/g, '').replace(',', '.');
        let isCorrect = false;

        if (typeof rawAns === 'object' && rawAns !== null && typeof rawAns.isCorrect === 'boolean') {
            isCorrect = rawAns.isCorrect;
        } else if (normStudent !== '' && (normPrimary !== '' || normDisplay !== '')) {
            const checkEquiv = (s, c) => {
                if (!s || !c) return false;
                const fs = parseFloat(s);
                const fc = parseFloat(c);
                if (!isNaN(fs) && !isNaN(fc)) return Math.abs(fs - fc) < 0.0001;
                if (s.toLowerCase() === c.toLowerCase()) return true;
                const getNums = (str) => (str.replace(/−/g, '-').replace(/;/g, ' ').replace(/,/g, ' ').match(/[-+]?\d+(?:\.\d+)?/g) || []);
                const ns = getNums(s);
                const nc = getNums(c);
                if (ns.length && ns.length === nc.length && (ns.length === 2 || ns.length === 4)) {
                    return ns.every((val, idx) => Math.abs(parseFloat(val) - parseFloat(nc[idx])) < 0.0001);
                }
                return false;
            };
            isCorrect = checkEquiv(normStudent, normPrimary) || checkEquiv(normStudent, normDisplay);
            if (!isCorrect && Array.isArray(t.acceptedAnswers)) {
                isCorrect = t.acceptedAnswers.some(acc => checkEquiv(normStudent, String(acc).replace(/\s+/g, '').replace(',', '.')));
            }
        }

        return { studentAns, correctAns, isCorrect };
    }

    function renderSubmissionsHeatmap(hw, submissions) {
        const container = document.getElementById('submissions-error-heatmap');
        if (!container) return;

        const tasks = (hw && Array.isArray(hw.tasks)) ? hw.tasks : [];
        const completedSubs = (submissions || []).filter(s => s.status === 'submitted' || s.status === 'checked');

        if (tasks.length === 0 || completedSubs.length === 0) {
            container.classList.add('hidden');
            container.innerHTML = '';
            return;
        }

        const stats = tasks.map((t, i) => {
            let errorCount = 0;
            completedSubs.forEach(s => {
                const { isCorrect } = evaluateStudentTaskAnswer(t, i, s.answers);
                if (!isCorrect) errorCount++;
            });
            const errorPct = Math.round((errorCount / completedSubs.length) * 100);
            return {
                index: i + 1,
                label: t.catName || t.category || `Задача №${i + 1}`,
                errorCount,
                total: completedSubs.length,
                errorPct
            };
        });

        const topHard = [...stats]
            .filter(st => st.errorPct > 0)
            .sort((a, b) => b.errorPct - a.errorPct)
            .slice(0, 2);

        const summaryLine = topHard.length === 0
            ? '<span style="color: var(--accent-emerald); font-weight: 700;">🎉 Все сдавшие решили задания без ошибок</span>'
            : `<span>Проблемные: ${topHard.map(st => `<strong style="color: ${st.errorPct >= 50 ? '#f87171' : '#fbbf24'};">№${st.index} (${st.errorPct}%)</strong>`).join(', ')}</span>`;

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 0.65rem;">
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--ink);">
                    🔥 Тепловая карта ошибок по классу <span style="color: var(--muted); font-weight: 500;">(по ${completedSubs.length} сданным работам)</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--muted);">${summaryLine}</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;">
                ${stats.map(st => {
                    const color = st.errorPct >= 50 ? '#ef4444' : (st.errorPct >= 25 ? '#f59e0b' : '#10b981');
                    const bg = st.errorPct >= 50 ? 'rgba(239, 68, 68, 0.1)' : (st.errorPct >= 25 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.08)');
                    const border = st.errorPct >= 50 ? 'rgba(239, 68, 68, 0.35)' : (st.errorPct >= 25 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.3)');
                    return `
                        <div title="${escapeHtml(st.label)}: ${st.errorCount} ошибок из ${st.total}" style="padding: 7px 9px; border-radius: 8px; background: ${bg}; border: 1px solid ${border};">
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; margin-bottom: 4px;">
                                <strong style="color: var(--ink);">Задача №${st.index}</strong>
                                <span style="font-weight: 800; color: ${color};">${st.errorPct}%</span>
                            </div>
                            <div style="height: 4px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin-bottom: 4px;">
                                <div style="width: ${st.errorPct}%; height: 100%; background: ${color}; border-radius: 999px;"></div>
                            </div>
                            <div style="font-size: 0.7rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${st.errorCount} из ${st.total} ош. · ${escapeHtml(st.label)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        container.classList.remove('hidden');
    }

    async function openReviewSubmissionModal(sub, hw) {
        currentReviewSubmission = sub;
        currentReviewHw = hw;
        document.getElementById('review-student-name').textContent = `Работа: ${sub.student_display_name || sub.student_username || sub.displayName || sub.username || ''}`;
        document.getElementById('review-hw-title').textContent = `${hw.title} (${hw.class_name || hw.className || ''})`;

        const btnOpenFull = document.getElementById('btn-review-modal-open-fullscreen');
        if (btnOpenFull) {
            const sId = sub.studentId || sub.student_id;
            btnOpenFull.href = `homework.html?id=${hw.id}&student_id=${sId}`;
        }

        const tasksContainer = document.getElementById('review-tasks-container');
        tasksContainer.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--muted);">Загрузка заданий...</div>';

        if (modalSubmissionsList && modalSubmissionsList.open) modalSubmissionsList.close();
        modalReviewSubmission.showModal();

        if (!hw.tasks || hw.tasks.length === 0) {
            try {
                const res = await fetch(`/api/teacher/homeworks/${hw.id}`);
                const data = await res.json();
                if (data.success && data.homework && data.homework.tasks) {
                    hw = Object.assign(hw, data.homework);
                    currentReviewHw = hw;
                }
            } catch(e) {
                console.error('Error fetching homework tasks:', e);
            }
        }

        const tasks = hw.tasks || [];
        const answers = sub.answers || {};

        tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--muted);">В этом домашнем задании нет сохранённых вопросов.</div>';
            return;
        }

        let autoCorrectCount = 0;

        tasks.forEach((t, i) => {
            const { studentAns, correctAns, isCorrect } = evaluateStudentTaskAnswer(t, i, answers);

            if (isCorrect) autoCorrectCount++;

            const item = document.createElement('div');
            item.className = 'draft-task-item ' + (isCorrect ? 'task-item-correct' : 'task-item-incorrect');
            item.style.borderLeft = isCorrect ? '5px solid var(--accent-emerald)' : '5px solid var(--danger)';
            if (!isCorrect) {
                item.style.borderColor = 'rgba(239, 68, 68, 0.55)';
                item.style.background = 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, var(--surface-card) 100%)';
                item.style.boxShadow = '0 0 14px rgba(239, 68, 68, 0.08)';
            } else {
                item.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                item.style.background = 'linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, var(--surface-card) 100%)';
            }

            const ansBoxBorder = isCorrect ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.45)';
            const ansBoxBg = isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)';

            item.innerHTML = `
                <div class="draft-task-header">
                    <span class="draft-task-num">Задание №${i + 1} · ${escapeHtml(t.catName || t.category || 'Задание')}</span>
                    <span style="font-weight:700; color:${isCorrect ? 'var(--accent-emerald)' : 'var(--danger)'};">
                        ${isCorrect ? '✓ Ответ совпал' : (studentAns ? '✗ Ответ не совпал' : '— Не решено')}
                    </span>
                </div>
                <div class="draft-task-body" style="font-size:0.95rem; line-height:1.5; margin:0.5rem 0;">
                    ${t.questionHtml ? formatMathHtml(t.questionHtml) : formatMathHtml(escapeHtml(t.text || t.condition || ''))}
                </div>
                <div style="background:${ansBoxBg}; border:1px solid ${ansBoxBorder}; border-radius:var(--r-sm); padding:0.6rem 0.85rem; display:flex; justify-content:space-between; font-size:0.88rem; flex-wrap:wrap; gap:0.5rem;">
                    <div>Ответ ученика: <strong style="color:${isCorrect ? 'var(--accent-emerald)' : (studentAns ? 'var(--danger)' : 'var(--muted)')}; font-family:var(--f-mono);">${escapeHtml(studentAns || '(пусто)')}</strong></div>
                    <div>Правильный ответ: <strong style="color:var(--accent-cyan); font-family:var(--f-mono);">${escapeHtml(correctAns || '—')}</strong></div>
                </div>
            `;
            tasksContainer.appendChild(item);
        });

        // Set score and feedback
        const gradeScoreInput = document.getElementById('grade-input-score');
        const gradeFeedbackInput = document.getElementById('grade-input-feedback');

        gradeScoreInput.max = tasks.length;
        gradeScoreInput.value = (sub.score !== null && sub.score !== undefined && sub.status === 'checked') 
            ? sub.score 
            : autoCorrectCount;
        gradeFeedbackInput.value = sub.teacher_feedback || sub.teacherFeedback || '';
    }

    if (formGradeSubmission) {
        formGradeSubmission.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentReviewSubmission) return;

            const score = parseInt(document.getElementById('grade-input-score').value, 10);
            const feedback = document.getElementById('grade-input-feedback').value.trim();

            try {
                const targetSubId = currentReviewSubmission.submissionId || currentReviewSubmission.id || currentReviewSubmission.submission_id || 0;
                const studentId = currentReviewSubmission.studentId || currentReviewSubmission.student_id;
                const hwId = (currentReviewHw && currentReviewHw.id) ? currentReviewHw.id : null;

                const res = await fetch(`/api/teacher/submissions/${targetSubId}/grade`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        score,
                        teacher_feedback: feedback,
                        teacherFeedback: feedback,
                        student_id: studentId,
                        homework_id: hwId
                    })
                });
                const data = await res.json();
                if (data.success) {
                    modalReviewSubmission.close();
                    showToast('Оценка и отзыв сохранены');
                    if (currentReviewHw) openSubmissionsModal(currentReviewHw);
                    loadGrading();
                } else {
                    alert(data.error || 'Ошибка при сохранении оценки');
                }
            } catch(err) {
                alert('Ошибка подключения к серверу');
            }
        });
    }


    // --- Toast Notification Helper ---
    function showToast(msg) {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:var(--surface-card); border:1px solid var(--accent-emerald); color:var(--ink); padding:10px 18px; border-radius:9999px; box-shadow:0 8px 24px rgba(0,0,0,0.3); font-size:0.9rem; z-index:9999; transition:all 0.3s; transform:translateY(20px); opacity:0; pointer-events:none; font-family:var(--f-body); font-weight:600; display:flex; align-items:center; gap:8px;';
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<span>✓</span> <span>' + escapeHtml(msg) + '</span>';
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        setTimeout(() => {
            if (toast) {
                toast.style.transform = 'translateY(20px)';
                toast.style.opacity = '0';
            }
        }, 2800);
    }

    // --- Format Helpers ---
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatMathHtml(raw) {
        if (!raw) return '';
        let str = String(raw);

        // If KaTeX module is loaded, try KaTeX formatting
        if (window.StudyMath && typeof window.StudyMath.formatMath === 'function') {
            const mathRendered = window.StudyMath.formatMath(str);
            if (mathRendered && mathRendered !== str) {
                return mathRendered;
            }
        }

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

    function formatDate(isoStr) {
        if (!isoStr) return '—';
        try {
            const d = new Date(isoStr);
            return d.toLocaleDateString('ru-RU');
        } catch(e) { return isoStr; }
    }

    function formatDateTime(isoStr) {
        if (!isoStr) return '—';
        try {
            const d = new Date(isoStr);
            return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        } catch(e) { return isoStr; }
    }

    function formatRelativeTime(isoStr) {
        if (!isoStr) return '—';
        try {
            const d = new Date(isoStr);
            const now = new Date();
            const diffSec = Math.floor((now - d) / 1000);
            if (diffSec < 60) return 'только что';
            if (diffSec < 3600) return `${Math.floor(diffSec / 60)} мин. назад`;
            if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ч. назад`;
            return d.toLocaleDateString('ru-RU');
        } catch(e) { return isoStr; }
    }

    // Delegated handler for Informatics OGE code language tabs in teacher previews
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('.inf-lang-btn');
        if (!langBtn) return;
        const group = langBtn.closest('.inf-code-tabs');
        if (!group) return;
        const lang = langBtn.dataset.lang;
        group.querySelectorAll('.inf-lang-btn').forEach(b => b.classList.toggle('active', b === langBtn));
        group.querySelectorAll('.inf-code-pre').forEach(p => {
            p.style.display = p.dataset.lang === lang ? 'block' : 'none';
        });
    });

    window.addEventListener('study-auth-changed', () => init());
    window.addEventListener('study-cloud-synced', () => init());

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();