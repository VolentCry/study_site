"""
Образовательная платформа «Знания»
Сервер приложения на Flask для локальной разработки и запуска проекта (включая хостинг PythonAnywhere).

Использование:
    python main.py
    python main.py --port 8080
    python main.py --host 0.0.0.0 --port 5000 --debug
"""

import os
import sys
import argparse
import mimetypes
from datetime import datetime, timedelta
from pathlib import Path
from flask import Flask, send_from_directory, abort, render_template_string, request, jsonify, session

import db

# Гарантируем корректные MIME-типы для Windows
mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/woff', '.woff')
mimetypes.add_type('font/ttf', '.ttf')

BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    static_folder=None  # Отключаем дефолтный /static, чтобы раздавать файлы из корня проекта
)

# Секретный ключ для подписанных cookies сессии (минимальное использование RAM/диска)
app.secret_key = os.environ.get('SECRET_KEY', 'study-platform-pa-secret-key-salt-2026')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)

# Инициализируем SQLite таблицы при старте
db.init_db()


def is_safe_path(target_path: Path) -> bool:
    """Проверяет, что путь находится внутри BASE_DIR и не обращается к скрытым файлам."""
    try:
        resolved = target_path.resolve()
        # Проверка выхода за пределы рабочей директории
        resolved.relative_to(BASE_DIR)
        # Блокировка доступа к скрытым файлам и системным папкам (.git, .vscode, .env и т.д.)
        for part in resolved.relative_to(BASE_DIR).parts:
            if part.startswith('.') and part not in ('.', '..'):
                return False
        return True
    except (ValueError, RuntimeError):
        return False


def check_teacher_auth():
    """Проверяет авторизацию учителя. Возвращает (teacher_user, None) или (None, (json_response, status_code))."""
    user_id = session.get('user_id')
    if not user_id:
        return None, (jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401)
    user = db.get_user_by_id(user_id)
    if not user or user.get('role') not in ('teacher', 'admin'):
        return None, (jsonify({'success': False, 'error': 'Доступ разрешён только учителям.'}), 403)
    return user, None


def get_authenticated_teacher():
    """Возвращает данные учителя, если текущая сессия авторизована и имеет роль учителя или администратора."""
    user_id = session.get('user_id')
    if not user_id:
        return None
    user = db.get_user_by_id(user_id)
    if not user or user.get('role') not in ('teacher', 'admin'):
        return None
    return user


# ============================================================================
# API МАРШРУТЫ: АУТЕНТИФИКАЦИЯ И СИНХРОНИЗАЦИЯ С БД
# ============================================================================

@app.route('/api/auth/me', methods=['GET'])
def api_auth_me():
    """Проверка текущего статуса авторизации."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'loggedIn': False})

    user = db.get_user_by_id(user_id)
    if not user:
        session.clear()
        return jsonify({'loggedIn': False})

    return jsonify({
        'loggedIn': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
            'role': user.get('role', 'student'),
            'createdAt': user['created_at'],
            'lastLogin': user['last_login']
        }
    })


@app.route('/api/auth/register', methods=['POST'])
def api_auth_register():
    """Регистрация нового пользователя."""
    payload = request.get_json(silent=True) or {}
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))
    display_name = str(payload.get('displayName', '')).strip() or None
    local_data = payload.get('localData')

    if not username or not password:
        return jsonify({'success': False, 'error': 'Заполните логин и пароль.'}), 400

    # Регистрация всегда создаёт аккаунты с ролью ученика (student).
    # Регистрация с кодом учителя отключена.
    role = 'student'

    try:
        user = db.create_user(
            username=username,
            password=password,
            display_name=display_name,
            initial_data=local_data if isinstance(local_data, dict) else None,
            role=role
        )
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'Внутренняя ошибка сервера при регистрации.'}), 500

    # Авторизуем пользователя в сессии
    session.permanent = True
    session['user_id'] = user['id']
    session['role'] = user.get('role', 'student')

    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
            'role': user.get('role', 'student'),
            'createdAt': user['created_at']
        }
    })


@app.route('/api/auth/login', methods=['POST'])
def api_auth_login():
    """Вход пользователя в систему."""
    payload = request.get_json(silent=True) or {}
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))

    if not username or not password:
        return jsonify({'success': False, 'error': 'Введите имя пользователя и пароль.'}), 400

    user = db.authenticate_user(username, password)
    if not user:
        return jsonify({'success': False, 'error': 'Неверный логин или пароль.'}), 401

    session.permanent = True
    session['user_id'] = user['id']
    session['role'] = user.get('role', 'student')

    user_data = db.get_user_data(user['id'])

    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
            'role': user.get('role', 'student')
        },
        'data': user_data
    })


@app.route('/api/auth/logout', methods=['POST'])
def api_auth_logout():
    """Выход из аккаунта (очистка сессионной куки)."""
    session.clear()
    return jsonify({'success': True})


@app.route('/api/user/data', methods=['GET'])
def api_get_user_data():
    """Получение прогресса авторизованного пользователя из БД."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    data = db.get_user_data(user_id)
    if not data:
        return jsonify({'success': False, 'error': 'Данные пользователя не найдены.'}), 404

    return jsonify({'success': True, 'data': data})


@app.route('/api/user/sync', methods=['POST'])
def api_sync_user_data():
    """Сохранение/синхронизация прогресса пользователя в SQLite."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    payload = request.get_json(silent=True) or {}
    try:
        updated_at = db.save_user_data(user_id, payload)
        return jsonify({'success': True, 'updatedAt': updated_at})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Ошибка сохранения данных в БД.'}), 500


# ============================================================================
# API МАРШРУТЫ: АДМИН-ПАНЕЛЬ УЧИТЕЛЯ (КЛАССЫ, ДОСЬЕ, ЛЕНТА ЗАДАНИЙ)
# ============================================================================

@app.route('/api/teacher/become', methods=['POST'])
def api_teacher_become():
    """Активация статуса учителя по секретному коду."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    payload = request.get_json(silent=True) or {}
    code = str(payload.get('teacherCode', '')).strip()
    if not db.verify_teacher_code(code):
        return jsonify({'success': False, 'error': 'Неверный код доступа учителя.'}), 400

    db.set_user_role(user_id, 'teacher')
    user = db.get_user_by_id(user_id)
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
            'role': 'teacher'
        }
    })


@app.route('/api/teacher/dashboard', methods=['GET'])
def api_teacher_dashboard():
    """Сводные показатели аналитики для кабинета учителя."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    stats = db.get_teacher_dashboard_stats(teacher['id'])
    return jsonify({
        'success': True,
        'stats': stats,
        'teacher': {
            'id': teacher['id'],
            'username': teacher['username'],
            'displayName': teacher['display_name'],
            'role': teacher.get('role', 'teacher')
        }
    })


@app.route('/api/teacher/classes', methods=['GET'])
def api_teacher_classes():
    """Список классов учителя."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    classes = db.get_teacher_classes(teacher['id'])
    return jsonify({'success': True, 'classes': classes})


@app.route('/api/teacher/classes', methods=['POST'])
def api_teacher_create_class():
    """Создание нового класса."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    name = str(payload.get('name', '')).strip()
    description = str(payload.get('description', '')).strip()

    try:
        new_class = db.create_class(teacher['id'], name, description)
        return jsonify({'success': True, 'class': new_class})
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/teacher/classes/<int:class_id>', methods=['GET'])
def api_teacher_get_class(class_id: int):
    """Детальная информация о классе и список его учеников."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    tid = None if teacher.get('role') == 'admin' else teacher['id']
    data = db.get_class_details(class_id, tid)
    if not data:
        return jsonify({'success': False, 'error': 'Класс не найден.'}), 404
    return jsonify({'success': True, 'class': data})


@app.route('/api/teacher/classes/<int:class_id>', methods=['DELETE'])
def api_teacher_delete_class(class_id: int):
    """Удаление класса учителя."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    tid = None if teacher.get('role') == 'admin' else teacher['id']
    ok = db.delete_class(class_id, tid)
    if not ok:
        return jsonify({'success': False, 'error': 'Класс не найден или нет прав.'}), 404
    return jsonify({'success': True})


@app.route('/api/teacher/classes/<int:class_id>/students', methods=['POST'])
def api_teacher_add_student(class_id: int):
    """Добавление ученика в класс по ID или логину."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    tid = None if teacher.get('role') == 'admin' else teacher['id']
    class_info = db.get_class_details(class_id, tid)
    if not class_info:
        return jsonify({'success': False, 'error': 'Класс не найден.'}), 404

    payload = request.get_json(silent=True) or {}
    student_id = payload.get('studentId')
    username = payload.get('username')

    if student_id is None and username:
        conn = db.get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute('SELECT id FROM users WHERE username = ? COLLATE NOCASE', (str(username).strip(),))
            row = cur.fetchone()
            if row:
                student_id = row['id']
        finally:
            conn.close()

    if not student_id:
        return jsonify({'success': False, 'error': 'Укажите корректный ID или логин ученика.'}), 400

    student = db.get_user_by_id(int(student_id))
    if not student:
        return jsonify({'success': False, 'error': 'Ученик не найден в базе данных.'}), 404

    ok = db.add_student_to_class(class_id, int(student_id))
    return jsonify({'success': True, 'added': ok, 'student': student})


@app.route('/api/teacher/classes/<int:class_id>/students/<int:student_id>', methods=['DELETE'])
def api_teacher_remove_student(class_id: int, student_id: int):
    """Исключение ученика из класса."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    tid = None if teacher.get('role') == 'admin' else teacher['id']
    class_info = db.get_class_details(class_id, tid)
    if not class_info:
        return jsonify({'success': False, 'error': 'Класс не найден.'}), 404

    ok = db.remove_student_from_class(class_id, student_id)
    return jsonify({'success': True, 'removed': ok})


@app.route('/api/teacher/users', methods=['GET'])
def api_teacher_get_users():
    """Каталог всех пользователей платформы для учителя с поиском и фильтром."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    search = request.args.get('q', '').strip()
    role_filter = request.args.get('role', '').strip()
    users = db.get_all_users_for_teacher(teacher['id'], search=search, role_filter=role_filter)
    return jsonify({'success': True, 'users': users})


@app.route('/api/teacher/users/<int:user_id>/role', methods=['POST'])
def api_teacher_set_user_role(user_id: int):
    """Смена роли пользователя (например, назначить учителем)."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    new_role = payload.get('role')
    try:
        ok = db.set_user_role(user_id, new_role)
        if not ok:
            return jsonify({'success': False, 'error': 'Пользователь не найден.'}), 404
        return jsonify({'success': True, 'userId': user_id, 'newRole': new_role})
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/teacher/users/<int:user_id>', methods=['DELETE'])
def api_teacher_delete_user(user_id: int):
    """Удаление пользователя учителем/администратором."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    # Защита от удаления своего собственного аккаунта
    if teacher['id'] == user_id:
        return jsonify({'success': False, 'error': 'Вы не можете удалить свой собственный аккаунт.'}), 400

    target_user = db.get_user_by_id(user_id)
    if not target_user:
        return jsonify({'success': False, 'error': 'Пользователь не найден.'}), 404

    # Учитель может удалять только учеников. Администратор может удалять любых пользователей.
    if teacher.get('role') != 'admin' and target_user.get('role') in ('teacher', 'admin'):
        return jsonify({'success': False, 'error': 'Учитель может удалять только профили учеников.'}), 403

    ok = db.delete_user(user_id)
    if not ok:
        return jsonify({'success': False, 'error': 'Ошибка при удалении пользователя.'}), 500

    return jsonify({'success': True, 'deletedUserId': user_id})


@app.route('/api/teacher/students/<int:student_id>/dossier', methods=['GET'])
def api_teacher_student_dossier(student_id: int):
    """Подробнейшее досье ученика с историей выполненных заданий и званиями."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    dossier = db.get_student_dossier(student_id)
    if not dossier:
        return jsonify({'success': False, 'error': 'Ученик не найден.'}), 404
    return jsonify({'success': True, 'dossier': dossier})


@app.route('/api/teacher/feed', methods=['GET'])
def api_teacher_activity_feed():
    """Хронологическая лента выполненных заданий учеников."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    class_id_str = request.args.get('classId')
    class_id = int(class_id_str) if class_id_str and class_id_str.isdigit() else None
    limit = min(int(request.args.get('limit', 50)), 100)
    scope = request.args.get('scope', 'all')

    tid = teacher['id'] if (scope == 'my' and class_id is None) else None
    feed = db.get_recent_activity_feed(teacher_id=tid, class_id=class_id, limit=limit)
    return jsonify({'success': True, 'feed': feed})


# ============================================================================
# API МАРШРУТЫ: РАСПИСАНИЕ И КАЛЕНДАРЬ ЗАНЯТИЙ
# ============================================================================

@app.route('/api/schedule/month', methods=['GET'])
def api_get_month_schedule():
    """Получение расписания уроков и дедлайнов Д/З за выбранный месяц."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    user = db.get_user_by_id(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'Пользователь не найден.'}), 404

    now = datetime.now()
    try:
        year = int(request.args.get('year', now.year))
        month = int(request.args.get('month', now.month))
        if month < 1 or month > 12:
            raise ValueError()
    except (ValueError, TypeError):
        year = now.year
        month = now.month

    schedule_data = db.get_month_schedule(user['id'], user['role'], year, month)
    return jsonify({'success': True, 'schedule': schedule_data})


@app.route('/api/teacher/lessons', methods=['GET'])
def api_teacher_lessons():
    """Получение всех уроков преподавателя со сведениями о классах и заданиях."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    lessons = db.get_teacher_lessons(teacher['id'])
    return jsonify({'success': True, 'lessons': lessons})


@app.route('/api/teacher/lessons', methods=['POST'])
def api_teacher_create_lesson():
    """Создание занятия в расписании учителем."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    class_id = payload.get('classId') or payload.get('class_id')
    title = payload.get('title')
    scheduled_at = payload.get('scheduledAt') or payload.get('starts_at') or payload.get('scheduled_at')
    duration_min = payload.get('durationMin', payload.get('duration_min', 60))
    description = payload.get('description') or payload.get('notes') or ''
    homework_id = payload.get('homeworkId') or payload.get('homework_id')
    student_id = payload.get('studentId') or payload.get('student_id')
    student_id = int(student_id) if (student_id and str(student_id).isdigit()) else None

    if not class_id or not title or not scheduled_at:
        return jsonify({'success': False, 'error': 'Заполните класс, тему и время занятия.'}), 400

    try:
        lesson = db.create_lesson(
            teacher_id=teacher['id'],
            class_id=int(class_id),
            title=str(title),
            scheduled_at=str(scheduled_at),
            duration_min=int(duration_min or 60),
            description=str(description or ''),
            homework_id=int(homework_id) if homework_id else None,
            student_id=student_id
        )
        return jsonify({'success': True, 'lesson': lesson})
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'Ошибка сервера при создании урока.'}), 500


@app.route('/api/teacher/lessons/<int:lesson_id>', methods=['DELETE'])
def api_teacher_delete_lesson(lesson_id: int):
    """Удаление занятия из расписания."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    tid = None if teacher.get('role') == 'admin' else teacher['id']
    ok = db.delete_lesson(lesson_id, tid)
    return jsonify({'success': ok})


# ============================================================================
# API МАРШРУТЫ: КОНСТРУКТОР И ДОМАШНИЕ ЗАДАНИЯ
# ============================================================================

@app.route('/api/teacher/homeworks', methods=['GET', 'POST'])
def api_teacher_homeworks():
    """Список всех Д/З учителя или создание нового Д/З через конструктор."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    if request.method == 'GET':
        hw_list = db.get_teacher_homeworks(teacher['id'])
        return jsonify({'success': True, 'homeworks': hw_list})

    payload = request.get_json(silent=True) or {}
    class_id = payload.get('classId') or payload.get('class_id')
    title = payload.get('title')
    subject = payload.get('subject', 'math')
    tasks = payload.get('tasks', [])
    description = payload.get('description', '')
    deadline_at = payload.get('deadlineAt') or payload.get('deadline') or payload.get('deadline_at')

    if not class_id or not title:
        return jsonify({'success': False, 'error': 'Укажите класс и название домашней работы.'}), 400
    if not isinstance(tasks, list) or len(tasks) == 0:
        return jsonify({'success': False, 'error': 'Добавьте хотя бы одно задание в домашнюю работу.'}), 400

    try:
        hw = db.create_homework(
            teacher_id=teacher['id'],
            class_id=int(class_id),
            title=str(title),
            subject=str(subject),
            tasks=tasks,
            description=str(description or ''),
            deadline_at=str(deadline_at) if deadline_at else None
        )
        return jsonify({'success': True, 'homework': hw})
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'Ошибка при создании домашнего задания.'}), 500


@app.route('/api/teacher/homeworks/<int:homework_id>', methods=['GET', 'DELETE'])
def api_teacher_homework_detail(homework_id: int):
    """Получение подробностей или удаление домашнего задания."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    if request.method == 'DELETE':
        tid = None if teacher.get('role') == 'admin' else teacher['id']
        ok = db.delete_homework(homework_id, tid)
        return jsonify({'success': ok})

    hw = db.get_homework_by_id(homework_id, role=teacher.get('role', 'teacher'))
    if not hw:
        return jsonify({'success': False, 'error': 'Домашнее задание не найдено.'}), 404
    return jsonify({'success': True, 'homework': hw})


@app.route('/api/teacher/homeworks/<int:homework_id>/submissions', methods=['GET'])
def api_teacher_homework_submissions(homework_id: int):
    """Список сданных работ учеников по конкретной домашке для проверки."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    data = db.get_homework_submissions_for_teacher(homework_id, teacher['id'])
    return jsonify({'success': True, **data})


@app.route('/api/teacher/submissions/<int:submission_id>/grade', methods=['POST'])
def api_teacher_grade_submission(submission_id: int):
    """Учитель выставляет итоговый балл и комментарий к сданной работе ученика."""
    teacher, err = check_teacher_auth()
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    score = payload.get('score')
    teacher_feedback = payload.get('teacherFeedback') or payload.get('teacher_feedback') or ''
    student_id = payload.get('student_id') or payload.get('studentId')
    homework_id = payload.get('homework_id') or payload.get('homeworkId')

    if score is None:
        return jsonify({'success': False, 'error': 'Укажите итоговый балл.'}), 400

    try:
        ok = db.grade_submission(
            submission_id=submission_id if submission_id > 0 else None,
            score=int(score),
            teacher_feedback=str(teacher_feedback or ''),
            homework_id=int(homework_id) if homework_id else None,
            student_id=int(student_id) if student_id else None
        )
        return jsonify({'success': ok})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Ошибка сохранения оценки.'}), 500


# ============================================================================
# API МАРШРУТЫ: УЧЕНИК (РЕШЕНИЕ И СДАЧА ДОМАШКИ)
# ============================================================================

@app.route('/api/student/homeworks', methods=['GET'])
def api_student_homeworks():
    """Список всех домашних заданий для текущего ученика."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    hw_list = db.get_student_homeworks(user_id)
    return jsonify({'success': True, 'homeworks': hw_list})


@app.route('/api/student/homeworks/<int:homework_id>', methods=['GET'])
def api_student_homework_detail(homework_id: int):
    """Получение задания домашки для прорешивания учеником или проверки учителем."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    user = db.get_user_by_id(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'Пользователь не найден.'}), 401

    role = user.get('role', 'student')
    student_id = request.args.get('student_id', type=int)
    target_user_id = student_id if (student_id and role in ('teacher', 'admin')) else user_id

    hw = db.get_homework_by_id(homework_id, user_id=target_user_id, role=role)
    if not hw:
        return jsonify({'success': False, 'error': 'Домашнее задание не найдено или недоступно.'}), 404
    return jsonify({'success': True, 'homework': hw})


@app.route('/api/student/homeworks/<int:homework_id>/draft', methods=['POST'])
def api_student_save_draft(homework_id: int):
    """Автосохранение черновика ответов ученика."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    payload = request.get_json(silent=True) or {}
    answers = payload.get('answers', {})

    res = db.save_homework_draft(homework_id, user_id, answers)
    return jsonify(res)


@app.route('/api/student/homeworks/<int:homework_id>/submit', methods=['POST'])
def api_student_submit_homework(homework_id: int):
    """Финальная сдача работы учеником на проверку учителю."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Требуется авторизация.'}), 401

    payload = request.get_json(silent=True) or {}
    answers = payload.get('answers', {})

    try:
        res = db.submit_homework(homework_id, user_id, answers)
        return jsonify(res)
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'Ошибка сервера при отправке домашней работы.'}), 500


# ============================================================================
# СТАТИЧЕСКИЕ МАРШРУТЫ И ЧПУ
# ============================================================================

@app.route('/')
def index():
    """Главная страница сайта."""
    index_file = BASE_DIR / 'index.html'
    if index_file.is_file():
        return send_from_directory(BASE_DIR, 'index.html')
    abort(404)


@app.route('/admin')
def admin_page():
    """Алиас для админ-панели учителя."""
    teacher_file = BASE_DIR / 'teacher.html'
    if teacher_file.is_file():
        return send_from_directory(BASE_DIR, 'teacher.html')
    abort(404)


@app.route('/<path:subpath>')
def serve_file(subpath: str):
    """
    Универсальная раздача статических файлов и HTML-страниц:
    1. Точное совпадение файла (например, /profile.html, /teacher.html, /style.css, /assets/...)
    2. ЧПУ без расширения (например, /teacher -> /teacher.html, /profile -> /profile.html)
    3. Директории с index.html внутри
    """
    if subpath.startswith('api/'):
        abort(404)

    target = BASE_DIR / subpath

    if not is_safe_path(target):
        abort(404)

    # 1. Прямой файл
    if target.is_file():
        return send_from_directory(BASE_DIR, subpath)

    # 2. Поиск с добавлением .html (ЧПУ /clean-urls)
    html_target = target.with_suffix('.html')
    if is_safe_path(html_target) and html_target.is_file():
        rel_path = str(html_target.relative_to(BASE_DIR)).replace('\\', '/')
        return send_from_directory(BASE_DIR, rel_path)

    # 3. Директория с index.html
    if target.is_dir():
        dir_index = target / 'index.html'
        if dir_index.is_file():
            rel_path = str(dir_index.relative_to(BASE_DIR)).replace('\\', '/')
            return send_from_directory(BASE_DIR, rel_path)

    abort(404)


@app.errorhandler(404)
def page_not_found(e):
    """Красивая страница 404, если существует 404.html."""
    custom_404 = BASE_DIR / '404.html'
    if custom_404.is_file():
        return send_from_directory(BASE_DIR, '404.html'), 404
    return render_template_string(
        "<h1>404: Страница не найдена</h1><p><a href='/'>На главную</a></p>"
    ), 404


def parse_args():
    parser = argparse.ArgumentParser(description="Запуск платформы «Знания» на Flask и управление пользователями")
    parser.add_argument(
        '--host',
        default=os.environ.get('HOST', '127.0.0.1'),
        help="Хост для привязки сервера (по умолчанию: 127.0.0.1)"
    )
    parser.add_argument(
        '--port', '-p',
        type=int,
        default=int(os.environ.get('PORT', 5000)),
        help="Порт сервера (по умолчанию: 5000)"
    )
    parser.add_argument(
        '--debug',
        action='store_true',
        default=os.environ.get('FLASK_DEBUG', '').lower() in ('1', 'true', 'yes'),
        help="Включить режим отладки Flask"
    )
    parser.add_argument(
        '--set-role',
        nargs=2,
        metavar=('USERNAME', 'ROLE'),
        help="Назначить роль пользователю: python main.py --set-role USERNAME ROLE"
    )
    parser.add_argument(
        '--make-teacher',
        metavar='USERNAME',
        help="Быстро назначить пользователю роль учителя: python main.py --make-teacher USERNAME"
    )
    parser.add_argument(
        '--list-users',
        action='store_true',
        help="Показать список всех зарегистрированных пользователей и их роли"
    )
    parser.add_argument(
        '--reset-password',
        nargs=2,
        metavar=('USERNAME', 'NEW_PASSWORD'),
        help="Сбросить пароль пользователя: python main.py --reset-password USERNAME NEW_PASSWORD"
    )
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()

    # CLI-команда: просмотр списка пользователей
    if args.list_users:
        users = db.get_all_users_for_teacher()
        print(f"\nВсего зарегистрированных пользователей: {len(users)}")
        if not users:
            print("База данных пользователей пуста.")
        else:
            print(f"{'ID':<6} {'Логин':<20} {'Имя':<22} {'Роль':<10} {'Последний вход'}")
            print("-" * 75)
            for u in users:
                last_login = u.get('lastLogin') or 'Никогда'
                if len(last_login) > 19:
                    last_login = last_login[:19].replace('T', ' ')
                print(f"{u['id']:<6} {u['username']:<20} {u['displayName']:<22} {u['role']:<10} {last_login}")
        sys.exit(0)

    # CLI-команда: сброс пароля пользователя
    if args.reset_password:
        username, new_pass = args.reset_password
        try:
            success = db.reset_user_password(username, new_pass)
            if success:
                print(f"[OK] Пароль пользователя '{username}' успешно обновлён!")
                sys.exit(0)
            else:
                print(f"[ОШИБКА] Пользователь с логином '{username}' не найден в базе данных.")
                sys.exit(1)
        except ValueError as e:
            print(f"[ОШИБКА] Недопустимый пароль: {e}")
            sys.exit(1)

    # CLI-команда: назначить учителем
    if args.make_teacher:
        success = db.set_user_role_by_username(args.make_teacher, 'teacher')
        if success:
            print(f"[OK] Пользователю '{args.make_teacher}' успешно присвоена роль 'teacher'!")
            sys.exit(0)
        else:
            print(f"[ОШИБКА] Пользователь с логином '{args.make_teacher}' не найден в базе данных.")
            sys.exit(1)

    # CLI-команда: назначить произвольную роль
    if args.set_role:
        username, role = args.set_role
        role = role.lower().strip()
        if role not in ('student', 'teacher', 'admin'):
            print(f"[ОШИБКА] Недопустимая роль '{role}'. Разрешённые роли: student, teacher, admin")
            sys.exit(1)
        success = db.set_user_role_by_username(username, role)
        if success:
            print(f"[OK] Пользователю '{username}' успешно присвоена роль '{role}'!")
            sys.exit(0)
        else:
            print(f"[ОШИБКА] Пользователь с логином '{username}' не найден в базе данных.")
            sys.exit(1)

    print("=" * 65)
    print("  [+] Образовательная платформа «Знания» запущена!")
    print(f"  --> Локальный адрес: http://{args.host}:{args.port}")
    print(f"  --> Корневой каталог: {BASE_DIR}")
    print(f"  --> Режим отладки: {'ВКЛЮЧЕН' if args.debug else 'ВЫКЛЮЧЕН'}")
    print("  Для остановки сервера нажмите Ctrl+C")
    print("=" * 65)

    app.run(
        host=args.host,
        port=args.port,
        debug=args.debug
    )
