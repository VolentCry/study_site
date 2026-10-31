"""
Модуль работы с базой данных SQLite для образовательной платформы «Знания».
Оптимизирован для бесплатного хостинга PythonAnywhere (лимит диска 512 МБ, минимальное потребление RAM и CPU).
Поддерживает систему аутентификации, прогресса и админ-панель учителя («Классы», «Досье учеников», «Лента активности»).
"""

import os
import re
import json
import sqlite3
import hmac
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, Tuple, List
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'study_site.db'


def load_env_file() -> None:
    """Загружает переменные из локального .env или config.env файла в os.environ (без сторонних библиотек)."""
    for fname in ('.env', 'config.env'):
        env_path = BASE_DIR / fname
        if not env_path.is_file():
            continue
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#') or '=' not in line:
                        continue
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    if key and key not in os.environ:
                        os.environ[key] = val
        except Exception:
            pass


# Загружаем переменные из .env / config.env (если файл существует)
load_env_file()

# Регулярное выражение для валидации логина (3-30 символов: буквы (рус/англ), цифры, дефис, подчёркивание)
USERNAME_REGEX = re.compile(r'^[a-zA-Zа-яА-ЯёЁ0-9_\-]{3,30}$')


def get_teacher_access_code() -> str:
    """
    Возвращает секретный код учителя из переменной окружения TEACHER_CODE.
    Если переменная не задана, возвращает пустую строку (активация по коду отключена).
    В кодовой базе дефолтный код отсутствует во избежание утечки прав.
    """
    return os.environ.get('TEACHER_CODE', '').strip()


def get_db_connection() -> sqlite3.Connection:
    """Создаёт и конфигурирует подключение к SQLite."""
    conn = sqlite3.connect(str(DB_PATH), timeout=10.0)
    conn.row_factory = sqlite3.Row
    # Базовые прагмы для надёжности и компактности на NFS / PythonAnywhere
    conn.execute('PRAGMA foreign_keys = ON;')
    conn.execute('PRAGMA page_size = 4096;')
    conn.execute('PRAGMA cache_size = -2000;')  # ~2 МБ кэша
    return conn


def init_db() -> None:
    """Инициализация таблиц базы данных и миграции схемы."""
    conn = get_db_connection()
    try:
        with conn:
            # 1. Таблица пользователей
            conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
                    display_name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    last_login TEXT,
                    role TEXT DEFAULT 'student'
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            ''')

            # Миграция: если колонка role отсутствует в старой БД, добавляем её
            cursor = conn.cursor()
            cursor.execute('PRAGMA table_info(users);')
            cols = [row['name'] for row in cursor.fetchall()]
            if 'role' not in cols:
                conn.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student';")
                conn.execute("UPDATE users SET role = 'student' WHERE role IS NULL;")

            # 2. Таблица игрового прогресса пользователя
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_data (
                    user_id INTEGER PRIMARY KEY,
                    avatar_frame TEXT DEFAULT 'orbit',
                    user_xp INTEGER DEFAULT 0,
                    bonus_xp INTEGER DEFAULT 0,
                    total_solved INTEGER DEFAULT 0,
                    theme TEXT DEFAULT 'dark',
                    metrics_json TEXT DEFAULT '[]',
                    trainer_records_json TEXT DEFAULT '{}',
                    claimed_gifts_json TEXT DEFAULT '{}',
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            ''')

            # 3. Таблица классов учителей
            conn.execute('''
                CREATE TABLE IF NOT EXISTS classes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    teacher_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
            ''')

            # 4. Таблица состава классов (ученики в классах)
            conn.execute('''
                CREATE TABLE IF NOT EXISTS class_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    class_id INTEGER NOT NULL,
                    student_id INTEGER NOT NULL,
                    joined_at TEXT NOT NULL,
                    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                    UNIQUE(class_id, student_id)
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_class_members_class ON class_members(class_id);
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_class_members_student ON class_members(student_id);
            ''')

            # 5. Таблица домашних заданий
            conn.execute('''
                CREATE TABLE IF NOT EXISTS homeworks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    teacher_id INTEGER NOT NULL,
                    class_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    subject TEXT NOT NULL,
                    tasks_json TEXT NOT NULL,
                    deadline_at TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_homeworks_class ON homeworks(class_id);
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_homeworks_teacher ON homeworks(teacher_id);
            ''')

            # 6. Таблица расписания занятий
            conn.execute('''
                CREATE TABLE IF NOT EXISTS lessons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    teacher_id INTEGER NOT NULL,
                    class_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    scheduled_at TEXT NOT NULL,
                    duration_min INTEGER DEFAULT 60,
                    homework_id INTEGER,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                    FOREIGN KEY (homework_id) REFERENCES homeworks(id) ON DELETE SET NULL
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_lessons_class_date ON lessons(class_id, scheduled_at);
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_lessons_teacher_date ON lessons(teacher_id, scheduled_at);
            ''')

            # Миграция: student_id в lessons для назначения урока конкретному ученику
            cursor.execute('PRAGMA table_info(lessons);')
            lesson_cols = [row['name'] for row in cursor.fetchall()]
            if 'student_id' not in lesson_cols:
                conn.execute("ALTER TABLE lessons ADD COLUMN student_id INTEGER REFERENCES users(id) ON DELETE SET NULL;")
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_lessons_student ON lessons(student_id);
            ''')

            # 7. Таблица сданных решений учеников
            conn.execute('''
                CREATE TABLE IF NOT EXISTS homework_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    homework_id INTEGER NOT NULL,
                    student_id INTEGER NOT NULL,
                    status TEXT DEFAULT 'draft',
                    answers_json TEXT DEFAULT '{}',
                    score INTEGER DEFAULT 0,
                    max_score INTEGER DEFAULT 0,
                    teacher_feedback TEXT DEFAULT '',
                    submitted_at TEXT,
                    checked_at TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (homework_id) REFERENCES homeworks(id) ON DELETE CASCADE,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                    UNIQUE(homework_id, student_id)
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_submissions_hw_student ON homework_submissions(homework_id, student_id);
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_submissions_student ON homework_submissions(student_id);
            ''')
    finally:
        conn.close()


def validate_username(username: str) -> Tuple[bool, str]:
    """Проверка корректности логина."""
    if not username:
        return False, "Имя пользователя не может быть пустым."
    username = username.strip()
    if len(username) < 3 or len(username) > 30:
        return False, "Длина логина должна быть от 3 до 30 символов."
    if not USERNAME_REGEX.match(username):
        return False, "Логин может содержать только буквы, цифры, дефис и знак подчёркивания."
    return True, ""


def validate_password(password: str) -> Tuple[bool, str]:
    """Проверка корректности пароля."""
    if not password:
        return False, "Пароль не может быть пустым."
    if len(password) < 6:
        return False, "Пароль должен содержать не менее 6 символов."
    if len(password) > 128:
        return False, "Пароль слишком длинный (максимум 128 символов)."
    return True, ""


def verify_teacher_code(code: str) -> bool:
    """
    Проверяет секретный код для активации роли учителя.
    Если переменная TEACHER_CODE не задана в окружении, функция всегда возвращает False.
    Для защиты от timing attacks используется hmac.compare_digest.
    """
    if not code:
        return False
    expected = get_teacher_access_code()
    if not expected:
        return False
    return hmac.compare_digest(code.strip().upper(), expected.upper())


def create_user(
    username: str,
    password: str,
    display_name: Optional[str] = None,
    initial_data: Optional[Dict[str, Any]] = None,
    role: str = 'student'
) -> Dict[str, Any]:
    """
    Регистрация нового пользователя.
    Возвращает словарь с данными пользователя или вызывает ValueError при ошибке валидации.
    """
    valid_u, msg_u = validate_username(username)
    if not valid_u:
        raise ValueError(msg_u)

    valid_p, msg_p = validate_password(password)
    if not valid_p:
        raise ValueError(msg_p)

    username_clean = username.strip()
    display_name_clean = (display_name or username_clean).strip()[:30]
    password_hash = generate_password_hash(password, method='pbkdf2:sha256')
    now_iso = datetime.now(timezone.utc).isoformat()
    clean_role = role if role in ('student', 'teacher', 'admin') else 'student'

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                '''
                INSERT INTO users (username, display_name, password_hash, created_at, last_login, role)
                VALUES (?, ?, ?, ?, ?, ?)
                ''',
                (username_clean, display_name_clean, password_hash, now_iso, now_iso, clean_role)
            )
            user_id = cursor.lastrowid

            # Подготовка начальных данных пользователя (гостевой localStorage)
            init_data = initial_data or {}
            avatar_frame = str(init_data.get('avatarFrame', 'orbit'))[:32]
            user_xp = int(init_data.get('userXP', 0) or 0)
            bonus_xp = int(init_data.get('bonusXp', 0) or 0)
            total_solved = int(init_data.get('totalSolvedTasks', 0) or 0)
            theme = str(init_data.get('theme', 'dark'))[:16]

            metrics = init_data.get('metrics', [])
            metrics_json = json.dumps(metrics if isinstance(metrics, list) else [], ensure_ascii=False)

            trainer_records = init_data.get('trainerRecords', {})
            trainer_records_json = json.dumps(trainer_records if isinstance(trainer_records, dict) else {}, ensure_ascii=False)

            claimed_gifts = init_data.get('claimedGifts', {})
            claimed_gifts_json = json.dumps(claimed_gifts if isinstance(claimed_gifts, dict) else {}, ensure_ascii=False)

            cursor.execute(
                '''
                INSERT INTO user_data (
                    user_id, avatar_frame, user_xp, bonus_xp, total_solved,
                    theme, metrics_json, trainer_records_json, claimed_gifts_json, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (
                    user_id, avatar_frame, user_xp, bonus_xp, total_solved,
                    theme, metrics_json, trainer_records_json, claimed_gifts_json, now_iso
                )
            )

        return {
            'id': user_id,
            'username': username_clean,
            'display_name': display_name_clean,
            'role': clean_role,
            'created_at': now_iso,
            'last_login': now_iso
        }
    except sqlite3.IntegrityError:
        raise ValueError("Пользователь с таким логином уже существует.")
    finally:
        conn.close()


def reset_user_password(username: str, new_password: str) -> bool:
    """Сброс пароля пользователя администратором или CLI-командой."""
    valid_p, msg_p = validate_password(new_password)
    if not valid_p:
        raise ValueError(msg_p)
    password_hash = generate_password_hash(new_password, method='pbkdf2:sha256')
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE users SET password_hash = ? WHERE username = ? COLLATE NOCASE",
                (password_hash, username.strip())
            )
            return cursor.rowcount > 0
    finally:
        conn.close()


def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Аутентификация пользователя по логину и паролю."""
    if not username or not password:
        return None

    username_clean = username.strip()
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, display_name, password_hash, created_at, last_login, role FROM users WHERE username = ? COLLATE NOCASE',
            (username_clean,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        if not check_password_hash(row['password_hash'], password):
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        with conn:
            conn.execute('UPDATE users SET last_login = ? WHERE id = ?', (now_iso, row['id']))

        return {
            'id': row['id'],
            'username': row['username'],
            'display_name': row['display_name'],
            'role': row['role'] or 'student',
            'created_at': row['created_at'],
            'last_login': now_iso
        }
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Получение базовой информации о пользователе по ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, display_name, created_at, last_login, role FROM users WHERE id = ?',
            (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None
        res = dict(row)
        if not res.get('role'):
            res['role'] = 'student'
        return res
    finally:
        conn.close()


def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Получение базовой информации о пользователе по логину (регистронезависимо)."""
    if not username:
        return None
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, display_name, created_at, last_login, role FROM users WHERE username = ? COLLATE NOCASE',
            (username.strip(),)
        )
        row = cursor.fetchone()
        if not row:
            return None
        res = dict(row)
        if not res.get('role'):
            res['role'] = 'student'
        return res
    finally:
        conn.close()


def set_user_role(user_id: int, role: str) -> bool:
    """Устанавливает роль пользователя ('student', 'teacher', 'admin')."""
    if role not in ('student', 'teacher', 'admin'):
        raise ValueError("Некорректная роль пользователя.")
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE users SET role = ? WHERE id = ?', (role, user_id))
            return cursor.rowcount > 0
    finally:
        conn.close()


def set_user_role_by_username(username: str, role: str) -> bool:
    """Устанавливает роль пользователя по его логину."""
    user = get_user_by_username(username)
    if not user:
        return False
    return set_user_role(user['id'], role)


def get_user_data(user_id: int) -> Optional[Dict[str, Any]]:
    """Получение полного игрового прогресса пользователя по ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT u.id, u.username, u.display_name, u.role,
                   d.avatar_frame, d.user_xp, d.bonus_xp, d.total_solved,
                   d.theme, d.metrics_json, d.trainer_records_json, d.claimed_gifts_json, d.updated_at
            FROM users u
            LEFT JOIN user_data d ON u.id = d.user_id
            WHERE u.id = ?
            ''',
            (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        try:
            metrics = json.loads(row['metrics_json'] or '[]')
        except Exception:
            metrics = []

        try:
            trainer_records = json.loads(row['trainer_records_json'] or '{}')
        except Exception:
            trainer_records = {}

        try:
            claimed_gifts = json.loads(row['claimed_gifts_json'] or '{}')
        except Exception:
            claimed_gifts = {}

        return {
            'userId': row['id'],
            'username': row['username'],
            'userName': row['display_name'] or row['username'],
            'role': row['role'] or 'student',
            'avatarFrame': row['avatar_frame'] or 'orbit',
            'userXP': row['user_xp'] or 0,
            'bonusXp': row['bonus_xp'] or 0,
            'totalSolvedTasks': row['total_solved'] or 0,
            'theme': row['theme'] or 'dark',
            'metrics': metrics,
            'trainerRecords': trainer_records,
            'claimedGifts': claimed_gifts,
            'updatedAt': row['updated_at']
        }
    finally:
        conn.close()


def save_user_data(user_id: int, payload: Dict[str, Any]) -> str:
    """
    Сохранение/синхронизация прогресса пользователя в БД.
    Возвращает ISO-таймштамп обновления.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    avatar_frame = str(payload.get('avatarFrame', 'orbit'))[:32]
    user_xp = int(payload.get('userXP', 0) or 0)
    bonus_xp = int(payload.get('bonusXp', 0) or 0)
    total_solved = int(payload.get('totalSolvedTasks', 0) or 0)
    theme = str(payload.get('theme', 'dark'))[:16]
    display_name = payload.get('userName')

    metrics = payload.get('metrics')
    if not isinstance(metrics, list) and isinstance(payload.get('studyMetrics'), list):
        metrics = payload.get('studyMetrics')
    if not isinstance(metrics, list):
        metrics = []
    metrics_json = json.dumps(metrics, ensure_ascii=False)

    trainer_records = payload.get('trainerRecords', {})
    trainer_records_json = json.dumps(trainer_records if isinstance(trainer_records, dict) else {}, ensure_ascii=False)

    claimed_gifts = payload.get('claimedGifts', {})
    claimed_gifts_json = json.dumps(claimed_gifts if isinstance(claimed_gifts, dict) else {}, ensure_ascii=False)

    conn = get_db_connection()
    try:
        with conn:
            # Обновляем отображаемое имя, если передано
            if display_name and isinstance(display_name, str):
                clean_name = display_name.strip()[:30]
                if clean_name:
                    conn.execute('UPDATE users SET display_name = ? WHERE id = ?', (clean_name, user_id))

            conn.execute(
                '''
                INSERT INTO user_data (
                    user_id, avatar_frame, user_xp, bonus_xp, total_solved,
                    theme, metrics_json, trainer_records_json, claimed_gifts_json, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    avatar_frame = excluded.avatar_frame,
                    user_xp = excluded.user_xp,
                    bonus_xp = excluded.bonus_xp,
                    total_solved = excluded.total_solved,
                    theme = excluded.theme,
                    metrics_json = excluded.metrics_json,
                    trainer_records_json = excluded.trainer_records_json,
                    claimed_gifts_json = excluded.claimed_gifts_json,
                    updated_at = excluded.updated_at
                ''',
                (
                    user_id, avatar_frame, user_xp, bonus_xp, total_solved,
                    theme, metrics_json, trainer_records_json, claimed_gifts_json, now_iso
                )
            )
        return now_iso
    finally:
        conn.close()


# ============================================================================
# ФУНКЦИИ УПРАВЛЕНИЯ КЛАССАМИ И АДМИН-ПАНЕЛЬЮ УЧИТЕЛЯ
# ============================================================================

def create_class(teacher_id: int, name: str, description: str = '') -> Dict[str, Any]:
    """Создаёт новый класс учителя."""
    clean_name = (name or '').strip()
    if not clean_name:
        raise ValueError("Название класса не может быть пустым.")
    if len(clean_name) > 60:
        raise ValueError("Название класса слишком длинное (максимум 60 символов).")

    clean_desc = (description or '').strip()[:200]
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                '''
                INSERT INTO classes (teacher_id, name, description, created_at)
                VALUES (?, ?, ?, ?)
                ''',
                (teacher_id, clean_name, clean_desc, now_iso)
            )
            class_id = cursor.lastrowid
            return {
                'id': class_id,
                'teacherId': teacher_id,
                'name': clean_name,
                'description': clean_desc,
                'createdAt': now_iso,
                'studentCount': 0
            }
    finally:
        conn.close()


def get_teacher_classes(teacher_id: int) -> List[Dict[str, Any]]:
    """Получает все классы учителя с количеством учеников в каждом."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT c.id, c.teacher_id, c.name, c.description, c.created_at,
                   COUNT(cm.student_id) as student_count
            FROM classes c
            LEFT JOIN class_members cm ON c.id = cm.class_id
            WHERE c.teacher_id = ?
            GROUP BY c.id
            ORDER BY c.id DESC
            ''',
            (teacher_id,)
        )
        classes = []
        for row in cursor.fetchall():
            classes.append({
                'id': row['id'],
                'teacherId': row['teacher_id'],
                'name': row['name'],
                'description': row['description'] or '',
                'createdAt': row['created_at'],
                'studentCount': row['student_count']
            })
        return classes
    finally:
        conn.close()


def delete_class(class_id: int, teacher_id: Optional[int] = None) -> bool:
    """Удаляет класс учителя."""
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            if teacher_id is not None:
                cursor.execute('DELETE FROM classes WHERE id = ? AND teacher_id = ?', (class_id, teacher_id))
            else:
                cursor.execute('DELETE FROM classes WHERE id = ?', (class_id,))
            return cursor.rowcount > 0
    finally:
        conn.close()


def get_class_details(class_id: int, teacher_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
    """Получает детальную информацию о классе и список его учеников."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if teacher_id is not None:
            cursor.execute('SELECT * FROM classes WHERE id = ? AND teacher_id = ?', (class_id, teacher_id))
        else:
            cursor.execute('SELECT * FROM classes WHERE id = ?', (class_id,))

        class_row = cursor.fetchone()
        if not class_row:
            return None

        # Выбираем учеников класса
        cursor.execute(
            '''
            SELECT u.id, u.username, u.display_name, u.role, u.last_login,
                   d.avatar_frame, d.user_xp, d.total_solved, cm.joined_at
            FROM class_members cm
            JOIN users u ON cm.student_id = u.id
            LEFT JOIN user_data d ON u.id = d.user_id
            WHERE cm.class_id = ?
            ORDER BY cm.joined_at DESC
            ''',
            (class_id,)
        )
        students = []
        for s in cursor.fetchall():
            students.append({
                'id': s['id'],
                'username': s['username'],
                'displayName': s['display_name'],
                'role': s['role'] or 'student',
                'avatarFrame': s['avatar_frame'] or 'orbit',
                'userXP': s['user_xp'] or 0,
                'totalSolved': s['total_solved'] or 0,
                'lastLogin': s['last_login'],
                'joinedAt': s['joined_at']
            })

        return {
            'id': class_row['id'],
            'teacherId': class_row['teacher_id'],
            'name': class_row['name'],
            'description': class_row['description'] or '',
            'createdAt': class_row['created_at'],
            'studentCount': len(students),
            'students': students
        }
    finally:
        conn.close()


def add_student_to_class(class_id: int, student_id: int) -> bool:
    """Добавляет ученика в класс."""
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                '''
                INSERT OR IGNORE INTO class_members (class_id, student_id, joined_at)
                VALUES (?, ?, ?)
                ''',
                (class_id, student_id, now_iso)
            )
            return cursor.rowcount > 0
    finally:
        conn.close()


def remove_student_from_class(class_id: int, student_id: int) -> bool:
    """Исключает ученика из класса."""
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                'DELETE FROM class_members WHERE class_id = ? AND student_id = ?',
                (class_id, student_id)
            )
            return cursor.rowcount > 0
    finally:
        conn.close()


def get_all_users_for_teacher(
    teacher_id: Optional[int] = None,
    search: str = '',
    role_filter: str = ''
) -> List[Dict[str, Any]]:
    """
    Получает каталог всех пользователей сайта для учителя.
    Включает информацию о XP, решенных задачах и принадлежности к классам.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = '''
            SELECT u.id, u.username, u.display_name, u.role, u.created_at, u.last_login,
                   d.avatar_frame, d.user_xp, d.total_solved, d.updated_at
            FROM users u
            LEFT JOIN user_data d ON u.id = d.user_id
            WHERE 1=1
        '''
        params: List[Any] = []

        if search:
            query += ' AND (u.username LIKE ? OR u.display_name LIKE ?)'
            term = f"%{search.strip()}%"
            params.extend([term, term])

        if role_filter:
            query += ' AND u.role = ?'
            params.append(role_filter)

        query += ' ORDER BY d.user_xp DESC, u.id DESC'
        cursor.execute(query, params)
        rows = cursor.fetchall()

        # Карта классов каждого пользователя
        cursor.execute(
            '''
            SELECT cm.student_id, c.id as class_id, c.name as class_name, c.teacher_id
            FROM class_members cm
            JOIN classes c ON cm.class_id = c.id
            '''
        )
        user_classes_map: Dict[int, List[Dict[str, Any]]] = {}
        for row in cursor.fetchall():
            uid = row['student_id']
            if uid not in user_classes_map:
                user_classes_map[uid] = []
            user_classes_map[uid].append({
                'classId': row['class_id'],
                'className': row['class_name'],
                'teacherId': row['teacher_id']
            })

        users = []
        for r in rows:
            uid = r['id']
            enrolled = user_classes_map.get(uid, [])
            in_teacher_class = False
            if teacher_id is not None:
                in_teacher_class = any(c['teacherId'] == teacher_id for c in enrolled)

            users.append({
                'id': uid,
                'username': r['username'],
                'displayName': r['display_name'],
                'role': r['role'] or 'student',
                'createdAt': r['created_at'],
                'lastLogin': r['last_login'],
                'avatarFrame': r['avatar_frame'] or 'orbit',
                'userXP': r['user_xp'] or 0,
                'totalSolved': r['total_solved'] or 0,
                'updatedAt': r['updated_at'],
                'classes': enrolled,
                'isInMyClass': in_teacher_class
            })
        return users
    finally:
        conn.close()


def get_student_dossier(student_id: int) -> Optional[Dict[str, Any]]:
    """
    Получает подробнейшее досье ученика:
    - Персональная информация и уровень
    - Статистика верных ответов и успеваемости
    - Список выполненных заданий из журнала попыток (metrics_json)
    - Рекорды и звания в тренажерах
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT u.id, u.username, u.display_name, u.role, u.created_at, u.last_login,
                   d.avatar_frame, d.user_xp, d.bonus_xp, d.total_solved,
                   d.metrics_json, d.trainer_records_json, d.updated_at
            FROM users u
            LEFT JOIN user_data d ON u.id = d.user_id
            WHERE u.id = ?
            ''',
            (student_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        # Разбор истории решений
        try:
            metrics = json.loads(row['metrics_json'] or '[]')
            if not isinstance(metrics, list):
                metrics = []
        except Exception:
            metrics = []

        try:
            trainer_records = json.loads(row['trainer_records_json'] or '{}')
            if not isinstance(trainer_records, dict):
                trainer_records = {}
        except Exception:
            trainer_records = {}

        # Сортируем историю заданий по убыванию времени
        def parse_ts(item):
            ts = item.get('timestamp') or ''
            return ts

        sorted_metrics = sorted(metrics, key=parse_ts, reverse=True)

        # Вычисляем агрегированную статистику
        total_attempts = len(metrics)
        correct_attempts = sum(1 for m in metrics if m.get('correct'))
        accuracy = round((correct_attempts / total_attempts * 100), 1) if total_attempts > 0 else 0.0

        # Статистика по предметам
        subject_stats: Dict[str, Dict[str, int]] = {}
        for m in metrics:
            subj = str(m.get('subject') or 'Общие задания')
            if subj not in subject_stats:
                subject_stats[subj] = {'total': 0, 'correct': 0}
            subject_stats[subj]['total'] += 1
            if m.get('correct'):
                subject_stats[subj]['correct'] += 1

        subject_breakdown = []
        for subj, st in subject_stats.items():
            pct = round(st['correct'] / st['total'] * 100, 1) if st['total'] > 0 else 0.0
            subject_breakdown.append({
                'subject': subj,
                'total': st['total'],
                'correct': st['correct'],
                'percent': pct
            })

        # Классы ученика
        cursor.execute(
            '''
            SELECT c.id, c.name, c.teacher_id, u.display_name as teacher_name
            FROM class_members cm
            JOIN classes c ON cm.class_id = c.id
            JOIN users u ON c.teacher_id = u.id
            WHERE cm.student_id = ?
            ''',
            (student_id,)
        )
        enrolled_classes = []
        for c_row in cursor.fetchall():
            enrolled_classes.append({
                'id': c_row['id'],
                'name': c_row['name'],
                'teacherId': c_row['teacher_id'],
                'teacherName': c_row['teacher_name']
            })

        return {
            'user': {
                'id': row['id'],
                'username': row['username'],
                'displayName': row['display_name'],
                'role': row['role'] or 'student',
                'createdAt': row['created_at'],
                'lastLogin': row['last_login'],
                'avatarFrame': row['avatar_frame'] or 'orbit',
                'userXP': row['user_xp'] or 0,
                'bonusXp': row['bonus_xp'] or 0,
                'totalSolved': row['total_solved'] or 0,
                'updatedAt': row['updated_at']
            },
            'stats': {
                'totalAttempts': total_attempts,
                'correctAttempts': correct_attempts,
                'accuracyPercent': accuracy,
                'subjectBreakdown': subject_breakdown
            },
            'classes': enrolled_classes,
            'recentTasks': sorted_metrics[:60],  # последние 60 выполненных заданий
            'trainerRecords': trainer_records
        }
    finally:
        conn.close()


def get_recent_activity_feed(
    teacher_id: Optional[int] = None,
    class_id: Optional[int] = None,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Получает общую хронологическую ленту активности (какие задания решают ученики).
    Позволяет фильтровать по классу или классам учителя.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = '''
            SELECT u.id, u.username, u.display_name, d.avatar_frame, d.metrics_json
            FROM users u
            JOIN user_data d ON u.id = d.user_id
            WHERE 1=1
        '''
        params: List[Any] = []

        if class_id is not None:
            query += ' AND u.id IN (SELECT student_id FROM class_members WHERE class_id = ?)'
            params.append(class_id)
        elif teacher_id is not None:
            # Все ученики во всех классах этого учителя
            query += '''
                AND u.id IN (
                    SELECT cm.student_id
                    FROM class_members cm
                    JOIN classes c ON cm.class_id = c.id
                    WHERE c.teacher_id = ?
                )
            '''
            params.append(teacher_id)

        cursor.execute(query, params)
        rows = cursor.fetchall()

        all_events = []
        for r in rows:
            try:
                metrics = json.loads(r['metrics_json'] or '[]')
                if not isinstance(metrics, list):
                    continue
            except Exception:
                continue

            for m in metrics:
                if not isinstance(m, dict):
                    continue
                all_events.append({
                    'studentId': r['id'],
                    'studentName': r['display_name'] or r['username'],
                    'username': r['username'],
                    'avatarFrame': r['avatar_frame'] or 'orbit',
                    'timestamp': m.get('timestamp') or '',
                    'subject': m.get('subject') or 'Математика',
                    'skill': m.get('skill') or '',
                    'taskId': m.get('taskId') or '',
                    'correct': bool(m.get('correct'))
                })

        # Сортируем по убыванию времени
        all_events.sort(key=lambda x: x['timestamp'], reverse=True)
        return all_events[:limit]
    finally:
        conn.close()


def get_teacher_dashboard_stats(teacher_id: int) -> Dict[str, Any]:
    """Получает агрегированные показатели для главного дашборда учителя."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # 1. Всего пользователей
        cursor.execute('SELECT COUNT(*) FROM users')
        total_platform_users = cursor.fetchone()[0]

        # 2. Моих классов
        cursor.execute('SELECT COUNT(*) FROM classes WHERE teacher_id = ?', (teacher_id,))
        total_teacher_classes = cursor.fetchone()[0]

        # 3. Уникальных учеников в моих классах
        cursor.execute(
            '''
            SELECT COUNT(DISTINCT cm.student_id)
            FROM class_members cm
            JOIN classes c ON cm.class_id = c.id
            WHERE c.teacher_id = ?
            ''',
            (teacher_id,)
        )
        total_students_in_classes = cursor.fetchone()[0]

        # 4. Всего решено задач всеми пользователями
        cursor.execute('SELECT SUM(total_solved) FROM user_data')
        total_tasks_solved = cursor.fetchone()[0] or 0

        return {
            'totalPlatformUsers': total_platform_users,
            'totalTeacherClasses': total_teacher_classes,
            'totalStudentsInClasses': total_students_in_classes,
            'totalTasksSolved': total_tasks_solved
        }
    finally:
        conn.close()


# ============================================================================
# ДОМАШНИЕ ЗАДАНИЯ И РАСПИСАНИЕ УРОКОВ
# ============================================================================

def create_homework(
    teacher_id: int,
    class_id: int,
    title: str,
    subject: str,
    tasks: List[Dict[str, Any]],
    description: str = '',
    deadline_at: Optional[str] = None
) -> Dict[str, Any]:
    """Создаёт новое домашнее задание для класса."""
    title_clean = str(title).strip()
    if not title_clean:
        raise ValueError("Название домашнего задания не может быть пустым.")
    if not tasks:
        raise ValueError("Домашнее задание должно содержать хотя бы одну задачу.")

    # Deduplicate tasks defensively
    unique_tasks = []
    seen_fps = set()
    for t in tasks:
        if not isinstance(t, dict):
            continue
        raw_text = str(t.get('questionHtml') or t.get('text') or '')
        clean_text = re.sub(r'<[^>]*>', ' ', raw_text)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip().lower()
        ans = str(t.get('answer') if t.get('answer') is not None else t.get('displayAnswer') or '').strip().lower()
        mult_match = re.search(r'(\d+)\s*[\u00d7*xX]\s*(\d+)', clean_text)
        if mult_match and 'multiplication' in str(t.get('category', '')).lower():
            n1, n2 = sorted([int(mult_match.group(1)), int(mult_match.group(2))])
            fp = f"mult:{n1}x{n2}"
        else:
            fp = f"{t.get('category', '')}:{clean_text}|ans:{ans}"
        if fp not in seen_fps:
            seen_fps.add(fp)
            unique_tasks.append(t)
    tasks = unique_tasks or tasks

    now_iso = datetime.now(timezone.utc).isoformat()
    tasks_json = json.dumps(tasks, ensure_ascii=False)

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO homeworks (teacher_id, class_id, title, description, subject, tasks_json, deadline_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (teacher_id, class_id, title_clean, description.strip(), subject.strip(), tasks_json, deadline_at, now_iso)
            )
            hw_id = cursor.lastrowid
            return {
                'id': hw_id,
                'teacherId': teacher_id,
                'classId': class_id,
                'title': title_clean,
                'description': description.strip(),
                'subject': subject.strip(),
                'tasksCount': len(tasks),
                'deadlineAt': deadline_at,
                'createdAt': now_iso
            }
    finally:
        conn.close()


def get_homework_by_id(homework_id: int, user_id: Optional[int] = None, role: str = 'student') -> Optional[Dict[str, Any]]:
    """
    Получает информацию о домашнем задании.
    Если запрашивает ученик, и работа ещё не проверена, эталонные ответы скрываются из выдачи.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT h.*, c.name as class_name, u.display_name as teacher_name
            FROM homeworks h
            JOIN classes c ON h.class_id = c.id
            JOIN users u ON h.teacher_id = u.id
            WHERE h.id = ?
            """,
            (homework_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        tasks = json.loads(row['tasks_json']) if row['tasks_json'] else []
        submission = None

        if user_id:
            cursor.execute(
                "SELECT * FROM homework_submissions WHERE homework_id = ? AND student_id = ?",
                (homework_id, user_id)
            )
            sub_row = cursor.fetchone()
            if sub_row:
                raw_answers = json.loads(sub_row['answers_json']) if sub_row['answers_json'] else {}
                submission = {
                    'id': sub_row['id'],
                    'status': sub_row['status'],
                    'answers': raw_answers,
                    'score': sub_row['score'],
                    'maxScore': sub_row['max_score'],
                    'max_score': sub_row['max_score'],
                    'teacherFeedback': sub_row['teacher_feedback'],
                    'teacher_feedback': sub_row['teacher_feedback'],
                    'submittedAt': sub_row['submitted_at'],
                    'submitted_at': sub_row['submitted_at'],
                    'checkedAt': sub_row['checked_at'],
                    'checked_at': sub_row['checked_at']
                }

        # Если запрашивает ученик и работа ещё не проверена учителем - скрываем правильные ответы
        is_teacher_or_admin = role in ('teacher', 'admin')
        is_checked = submission and submission.get('status') == 'checked'

        sanitized_tasks = []
        for idx, t in enumerate(tasks):
            t_copy = dict(t)
            t_id = t.get('taskId') or t.get('id') or f"task_{idx + 1}"
            t_copy['taskId'] = t_id

            # Extract student answer & correctness if submission exists
            student_answer = ""
            is_correct = None
            if submission and submission.get('answers'):
                sub_ans = submission['answers']
                raw_item = None
                for k in (str(idx), idx, t_id, f"task_{idx + 1}", t.get('taskId'), t.get('id')):
                    if k is not None and k in sub_ans:
                        raw_item = sub_ans[k]
                        break
                if raw_item is not None:
                    if isinstance(raw_item, dict):
                        student_answer = str(raw_item.get('answer', '')).strip()
                        is_correct = raw_item.get('isCorrect')
                    else:
                        student_answer = str(raw_item).strip()

            t_copy['studentAnswer'] = student_answer
            t_copy['is_correct'] = is_correct
            t_copy['isCorrect'] = is_correct

            if not is_teacher_or_admin and not is_checked:
                # Скрываем ответы и подсказки с решением
                t_copy.pop('answer', None)
                t_copy.pop('displayAnswer', None)
                t_copy.pop('solutionSteps', None)

            sanitized_tasks.append(t_copy)

        return {
            'id': row['id'],
            'teacherId': row['teacher_id'],
            'teacher_id': row['teacher_id'],
            'teacherName': row['teacher_name'],
            'teacher_name': row['teacher_name'],
            'classId': row['class_id'],
            'class_id': row['class_id'],
            'className': row['class_name'],
            'class_name': row['class_name'],
            'title': row['title'],
            'description': row['description'],
            'subject': row['subject'],
            'deadline': row['deadline_at'],
            'deadlineAt': row['deadline_at'],
            'deadline_at': row['deadline_at'],
            'createdAt': row['created_at'],
            'created_at': row['created_at'],
            'tasks': sanitized_tasks,
            'submission': submission
        }
    finally:
        conn.close()


def get_teacher_homeworks(teacher_id: int) -> List[Dict[str, Any]]:
    """Список всех созданных учителем домашних заданий со статистикой сдачи."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT h.*, c.name as class_name,
                   (SELECT COUNT(*) FROM class_members cm WHERE cm.class_id = h.class_id) as total_students,
                   (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.homework_id = h.id AND hs.status IN ('submitted', 'checked')) as submitted_count,
                   (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.homework_id = h.id AND hs.status = 'checked') as checked_count
            FROM homeworks h
            JOIN classes c ON h.class_id = c.id
            WHERE h.teacher_id = ?
            ORDER BY h.created_at DESC
            """,
            (teacher_id,)
        )
        res = []
        for r in cursor.fetchall():
            tasks = json.loads(r['tasks_json']) if r['tasks_json'] else []
            res.append({
                'id': r['id'],
                'classId': r['class_id'],
                'className': r['class_name'],
                'title': r['title'],
                'description': r['description'],
                'subject': r['subject'],
                'deadlineAt': r['deadline_at'],
                'createdAt': r['created_at'],
                'tasksCount': len(tasks),
                'totalStudents': r['total_students'],
                'submittedCount': r['submitted_count'],
                'checkedCount': r['checked_count']
            })
        return res
    finally:
        conn.close()


def get_student_homeworks(student_id: int) -> List[Dict[str, Any]]:
    """Список всех домашних заданий для классов, в которых состоит ученик."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT h.id, h.title, h.description, h.subject, h.deadline_at, h.created_at,
                   c.id as class_id, c.name as class_name, u.display_name as teacher_name,
                   hs.id as submission_id, hs.status as submission_status,
                   hs.score, hs.max_score, hs.teacher_feedback, hs.submitted_at, hs.checked_at,
                   (SELECT COUNT(*) FROM json_each(h.tasks_json)) as tasks_count
            FROM homeworks h
            JOIN classes c ON h.class_id = c.id
            JOIN class_members cm ON c.id = cm.class_id
            JOIN users u ON h.teacher_id = u.id
            LEFT JOIN homework_submissions hs ON h.id = hs.homework_id AND hs.student_id = ?
            WHERE cm.student_id = ?
            ORDER BY (h.deadline_at IS NULL), h.deadline_at ASC, h.created_at DESC
            """,
            (student_id, student_id)
        )
        res = []
        for r in cursor.fetchall():
            status = r['submission_status'] or 'not_started'
            res.append({
                'id': r['id'],
                'title': r['title'],
                'description': r['description'],
                'subject': r['subject'],
                'deadlineAt': r['deadline_at'],
                'createdAt': r['created_at'],
                'classId': r['class_id'],
                'className': r['class_name'],
                'teacherName': r['teacher_name'],
                'tasksCount': r['tasks_count'] or 0,
                'submission': {
                    'id': r['submission_id'],
                    'status': status,
                    'score': r['score'] or 0,
                    'maxScore': r['max_score'] or 0,
                    'teacherFeedback': r['teacher_feedback'] or '',
                    'submittedAt': r['submitted_at'],
                    'checkedAt': r['checked_at']
                }
            })
        return res
    finally:
        conn.close()


def delete_homework(homework_id: int, teacher_id: Optional[int] = None) -> bool:
    """Удаляет домашнее задание."""
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            if teacher_id:
                cursor.execute("DELETE FROM homeworks WHERE id = ? AND teacher_id = ?", (homework_id, teacher_id))
            else:
                cursor.execute("DELETE FROM homeworks WHERE id = ?", (homework_id,))
            return cursor.rowcount > 0
    finally:
        conn.close()


def save_homework_draft(homework_id: int, student_id: int, answers: Dict[str, Any]) -> Dict[str, Any]:
    """Сохраняет черновик ответов ученика."""
    now_iso = datetime.now(timezone.utc).isoformat()
    answers_json = json.dumps(answers, ensure_ascii=False)

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO homework_submissions (homework_id, student_id, status, answers_json, created_at)
                VALUES (?, ?, 'draft', ?, ?)
                ON CONFLICT(homework_id, student_id) DO UPDATE SET
                    answers_json = excluded.answers_json
                WHERE status = 'draft'
                """,
                (homework_id, student_id, answers_json, now_iso)
            )
            return {'success': True, 'savedAt': now_iso}
    finally:
        conn.close()


def submit_homework(homework_id: int, student_id: int, answers: Dict[str, Any]) -> Dict[str, Any]:
    """Сдача домашнего задания учеником с автоматической сверкой эталонных ответов."""
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT tasks_json FROM homeworks WHERE id = ?", (homework_id,))
        hw_row = cursor.fetchone()
        if not hw_row:
            raise ValueError("Домашнее задание не найдено.")

        tasks = json.loads(hw_row['tasks_json']) if hw_row['tasks_json'] else []
        total_points = len(tasks)
        computed_score = 0

        # Автоматическая проверка ответов
        graded_answers = {}
        for idx, t in enumerate(tasks):
            t_id = str(t.get('taskId') or t.get('id') or f"task_{idx + 1}")

            # Robust answer retrieval from client payload
            raw_val = None
            candidate_keys = [
                str(idx),
                idx,
                t_id,
                f"task_{idx + 1}",
                t.get('taskId'),
                t.get('id')
            ]
            for ck in candidate_keys:
                if ck is not None and ck in answers:
                    raw_val = answers[ck]
                    break

            if raw_val is not None:
                if isinstance(raw_val, dict):
                    user_ans = str(raw_val.get('answer', '')).strip()
                else:
                    user_ans = str(raw_val).strip()
            else:
                user_ans = ''

            # Correct answer from task
            correct_ans = str(t.get('displayAnswer') or t.get('answer') or '').strip()

            is_correct = False
            if user_ans and correct_ans:
                # Сравнение с нормализацией запятой/точки
                norm_user = user_ans.replace(' ', '').replace(',', '.')
                norm_corr = correct_ans.replace(' ', '').replace(',', '.')
                try:
                    f_user = float(norm_user)
                    f_corr = float(norm_corr)
                    is_correct = abs(f_user - f_corr) < 0.0001
                except ValueError:
                    is_correct = (norm_user.lower() == norm_corr.lower())

            if is_correct:
                computed_score += 1

            record = {
                'answer': user_ans,
                'isCorrect': is_correct
            }
            # Key by index (string) and by task ID so all lookups succeed
            graded_answers[str(idx)] = record
            graded_answers[t_id] = record
            if t.get('taskId'):
                graded_answers[str(t.get('taskId'))] = record

        answers_json = json.dumps(graded_answers, ensure_ascii=False)

        with conn:
            conn.execute(
                """
                INSERT INTO homework_submissions (
                    homework_id, student_id, status, answers_json, score, max_score, submitted_at, created_at
                )
                VALUES (?, ?, 'submitted', ?, ?, ?, ?, ?)
                ON CONFLICT(homework_id, student_id) DO UPDATE SET
                    status = 'submitted',
                    answers_json = excluded.answers_json,
                    score = excluded.score,
                    max_score = excluded.max_score,
                    submitted_at = excluded.submitted_at
                """,
                (homework_id, student_id, answers_json, computed_score, total_points, now_iso, now_iso)
            )

        return {
            'success': True,
            'submittedAt': now_iso,
            'score': computed_score,
            'maxScore': total_points
        }
    finally:
        conn.close()


def get_homework_submissions_for_teacher(homework_id: int, teacher_id: Optional[int] = None) -> Dict[str, Any]:
    """Возвращает список всех учеников класса и их решения по конкретной домашке."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT h.*, c.name as class_name
            FROM homeworks h
            JOIN classes c ON h.class_id = c.id
            WHERE h.id = ?
            """,
            (homework_id,)
        )
        hw = cursor.fetchone()
        if not hw:
            return {}

        tasks = json.loads(hw['tasks_json']) if hw['tasks_json'] else []

        cursor.execute(
            """
            SELECT u.id as student_id, u.username, u.display_name,
                   hs.id as submission_id, hs.status, hs.answers_json, hs.score, hs.max_score,
                   hs.teacher_feedback, hs.submitted_at, hs.checked_at
            FROM class_members cm
            JOIN users u ON cm.student_id = u.id
            LEFT JOIN homework_submissions hs ON hs.homework_id = ? AND hs.student_id = u.id
            WHERE cm.class_id = ?
            ORDER BY u.display_name ASC
            """,
            (homework_id, hw['class_id'])
        )

        submissions = []
        for r in cursor.fetchall():
            status = r['status'] or 'not_started'
            raw_answers = json.loads(r['answers_json']) if r['answers_json'] else {}
            submissions.append({
                'studentId': r['student_id'],
                'student_id': r['student_id'],
                'username': r['username'],
                'student_username': r['username'],
                'displayName': r['display_name'],
                'student_display_name': r['display_name'],
                'submissionId': r['submission_id'],
                'submission_id': r['submission_id'],
                'status': status,
                'score': r['score'] or 0,
                'maxScore': r['max_score'] or len(tasks),
                'max_score': r['max_score'] or len(tasks),
                'teacherFeedback': r['teacher_feedback'] or '',
                'teacher_feedback': r['teacher_feedback'] or '',
                'submittedAt': r['submitted_at'],
                'submitted_at': r['submitted_at'],
                'checkedAt': r['checked_at'],
                'checked_at': r['checked_at'],
                'answers': raw_answers
            })

        return {
            'homework': {
                'id': hw['id'],
                'title': hw['title'],
                'className': hw['class_name'],
                'class_name': hw['class_name'],
                'subject': hw['subject'],
                'deadline': hw['deadline_at'],
                'deadlineAt': hw['deadline_at'],
                'deadline_at': hw['deadline_at'],
                'tasks': tasks
            },
            'submissions': submissions
        }
    finally:
        conn.close()


def grade_submission(submission_id: int, score: int, teacher_feedback: str = '') -> bool:
    """Учитель выставляет итоговый балл и оставляет отзыв на работу ученика."""
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE homework_submissions
                SET score = ?, teacher_feedback = ?, status = 'checked', checked_at = ?
                WHERE id = ?
                """,
                (score, teacher_feedback.strip(), now_iso, submission_id)
            )
            return cursor.rowcount > 0
    finally:
        conn.close()


def create_lesson(
    teacher_id: int,
    class_id: int,
    title: str,
    scheduled_at: str,
    duration_min: int = 60,
    description: str = '',
    homework_id: Optional[int] = None,
    student_id: Optional[int] = None
) -> Dict[str, Any]:
    """Создаёт урок в расписании (для всего класса или персонально для одного ученика)."""
    now_iso = datetime.now(timezone.utc).isoformat()
    title_clean = str(title).strip()
    if not title_clean:
        raise ValueError("Тема занятия не может быть пустой.")

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO lessons (teacher_id, class_id, title, description, scheduled_at, duration_min, homework_id, student_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (teacher_id, class_id, title_clean, description.strip(), scheduled_at.strip(), duration_min, homework_id, student_id, now_iso)
            )
            lesson_id = cursor.lastrowid
            return {
                'id': lesson_id,
                'teacherId': teacher_id,
                'classId': class_id,
                'title': title_clean,
                'scheduledAt': scheduled_at.strip(),
                'durationMin': duration_min,
                'homeworkId': homework_id,
                'studentId': student_id,
                'createdAt': now_iso
            }
    finally:
        conn.close()


def delete_lesson(lesson_id: int, teacher_id: Optional[int] = None) -> bool:
    """Удаляет урок из расписания."""
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            if teacher_id:
                cursor.execute("DELETE FROM lessons WHERE id = ? AND teacher_id = ?", (lesson_id, teacher_id))
            else:
                cursor.execute("DELETE FROM lessons WHERE id = ?", (lesson_id,))
            return cursor.rowcount > 0
    finally:
        conn.close()


def get_teacher_lessons(teacher_id: int) -> List[Dict[str, Any]]:
    """
    Возвращает список всех уроков преподавателя со сведениями о классах, учениках и домашних заданиях,
    отсортированный по дате проведения в хронологическом порядке.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT l.*, c.name as class_name, h.title as homework_title, h.deadline_at as homework_deadline,
                   su.display_name as student_name, su.username as student_username
            FROM lessons l
            JOIN classes c ON l.class_id = c.id
            LEFT JOIN users su ON l.student_id = su.id
            LEFT JOIN homeworks h ON l.homework_id = h.id
            WHERE l.teacher_id = ?
            ORDER BY l.scheduled_at ASC
            """,
            (teacher_id,)
        )
        lessons = []
        for r in cursor.fetchall():
            lessons.append({
                'id': r['id'],
                'classId': r['class_id'],
                'class_id': r['class_id'],
                'className': r['class_name'],
                'class_name': r['class_name'],
                'title': r['title'],
                'description': r['description'],
                'notes': r['description'],
                'scheduledAt': r['scheduled_at'],
                'scheduled_at': r['scheduled_at'],
                'starts_at': r['scheduled_at'],
                'durationMin': r['duration_min'],
                'duration_min': r['duration_min'],
                'homeworkId': r['homework_id'],
                'homework_id': r['homework_id'],
                'homeworkTitle': r['homework_title'],
                'homework_title': r['homework_title'],
                'homeworkDeadline': r['homework_deadline'],
                'homework_deadline': r['homework_deadline'],
                'studentId': r['student_id'],
                'student_id': r['student_id'],
                'studentName': r['student_name'] or '',
                'student_name': r['student_name'] or '',
                'studentUsername': r['student_username'] or '',
                'student_username': r['student_username'] or '',
                'createdAt': r['created_at'],
                'created_at': r['created_at']
            })
        return lessons
    finally:
        conn.close()


def get_month_schedule(user_id: int, role: str, year: int, month: int) -> Dict[str, Any]:
    """
    Возвращает расписание занятий и домашних заданий за указанный месяц.
    Для ученика — по всем его классам.
    Для учителя — по всем группам, которые он ведёт.
    """
    month_prefix = f"{year:04d}-{month:02d}"
    now_local_prefix = datetime.now().strftime('%Y-%m-%dT%H:%M')

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if role in ('teacher', 'admin'):
            cursor.execute(
                """
                SELECT l.*, c.name as class_name, h.title as homework_title, h.deadline_at as homework_deadline,
                       su.display_name as student_name, su.username as student_username
                FROM lessons l
                JOIN classes c ON l.class_id = c.id
                LEFT JOIN users su ON l.student_id = su.id
                LEFT JOIN homeworks h ON l.homework_id = h.id
                WHERE l.teacher_id = ? AND l.scheduled_at LIKE ?
                ORDER BY l.scheduled_at ASC
                """,
                (user_id, f"{month_prefix}%")
            )
        else:
            cursor.execute(
                """
                SELECT l.*, c.name as class_name, u.display_name as teacher_name,
                       su.display_name as student_name,
                       h.title as homework_title, h.deadline_at as homework_deadline,
                       hs.status as submission_status, hs.score as submission_score, hs.max_score as submission_max_score
                FROM lessons l
                JOIN classes c ON l.class_id = c.id
                JOIN class_members cm ON c.id = cm.class_id
                JOIN users u ON l.teacher_id = u.id
                LEFT JOIN users su ON l.student_id = su.id
                LEFT JOIN homeworks h ON l.homework_id = h.id
                LEFT JOIN homework_submissions hs ON h.id = hs.homework_id AND hs.student_id = ?
                WHERE cm.student_id = ?
                  AND (l.student_id IS NULL OR l.student_id = ?)
                  AND l.scheduled_at LIKE ?
                ORDER BY l.scheduled_at ASC
                """,
                (user_id, user_id, user_id, f"{month_prefix}%")
            )

        lessons = []
        for r in cursor.fetchall():
            item = {
                'id': r['id'],
                'classId': r['class_id'],
                'class_id': r['class_id'],
                'className': r['class_name'],
                'class_name': r['class_name'],
                'title': r['title'],
                'description': r['description'],
                'notes': r['description'],
                'scheduledAt': r['scheduled_at'],
                'scheduled_at': r['scheduled_at'],
                'starts_at': r['scheduled_at'],
                'durationMin': r['duration_min'],
                'duration_min': r['duration_min'],
                'homeworkId': r['homework_id'],
                'homework_id': r['homework_id'],
                'homeworkTitle': r['homework_title'],
                'homework_title': r['homework_title'],
                'homeworkDeadline': r['homework_deadline'],
                'homework_deadline': r['homework_deadline']
            }
            if 'teacher_name' in r.keys():
                item['teacherName'] = r['teacher_name']
                item['teacher_name'] = r['teacher_name']
            if 'student_id' in r.keys():
                item['studentId'] = r['student_id']
                item['student_id'] = r['student_id']
            if 'student_name' in r.keys():
                item['studentName'] = r['student_name'] or ''
                item['student_name'] = r['student_name'] or ''
            if role == 'student':
                item['submissionStatus'] = r['submission_status'] or ('not_started' if r['homework_id'] else None)
                item['submissionScore'] = r['submission_score']
                item['submissionMaxScore'] = r['submission_max_score']
            lessons.append(item)

        # Homeworks with deadlines in this month for calendar dots
        hw_list = []
        if role in ('teacher', 'admin'):
            cursor.execute(
                """
                SELECT h.*, c.name as class_name
                FROM homeworks h
                JOIN classes c ON h.class_id = c.id
                WHERE h.teacher_id = ? AND h.deadline_at LIKE ?
                ORDER BY h.deadline_at ASC
                """,
                (user_id, f"{month_prefix}%")
            )
        else:
            cursor.execute(
                """
                SELECT h.*, c.name as class_name, hs.status as submission_status
                FROM homeworks h
                JOIN classes c ON h.class_id = c.id
                JOIN class_members cm ON c.id = cm.class_id
                LEFT JOIN homework_submissions hs ON h.id = hs.homework_id AND hs.student_id = ?
                WHERE cm.student_id = ? AND h.deadline_at LIKE ?
                ORDER BY h.deadline_at ASC
                """,
                (user_id, user_id, f"{month_prefix}%")
            )
        for hr in cursor.fetchall():
            hw_list.append({
                'id': hr['id'],
                'title': hr['title'],
                'subject': hr['subject'],
                'deadline': hr['deadline_at'],
                'deadline_at': hr['deadline_at'],
                'className': hr['class_name'],
                'class_name': hr['class_name']
            })

        # Fetch closest upcoming lesson across any month from now onwards
        upcoming_lesson = None
        if role in ('teacher', 'admin'):
            cursor.execute(
                """
                SELECT l.*, c.name as class_name, h.title as homework_title, h.deadline_at as homework_deadline,
                       su.display_name as student_name
                FROM lessons l
                JOIN classes c ON l.class_id = c.id
                LEFT JOIN users su ON l.student_id = su.id
                LEFT JOIN homeworks h ON l.homework_id = h.id
                WHERE l.teacher_id = ? AND l.scheduled_at >= ?
                ORDER BY l.scheduled_at ASC
                LIMIT 1
                """,
                (user_id, now_local_prefix)
            )
        else:
            cursor.execute(
                """
                SELECT l.*, c.name as class_name, u.display_name as teacher_name,
                       su.display_name as student_name,
                       h.title as homework_title, h.deadline_at as homework_deadline
                FROM lessons l
                JOIN classes c ON l.class_id = c.id
                JOIN class_members cm ON c.id = cm.class_id
                JOIN users u ON l.teacher_id = u.id
                LEFT JOIN users su ON l.student_id = su.id
                LEFT JOIN homeworks h ON l.homework_id = h.id
                WHERE cm.student_id = ?
                  AND (l.student_id IS NULL OR l.student_id = ?)
                  AND l.scheduled_at >= ?
                ORDER BY l.scheduled_at ASC
                LIMIT 1
                """,
                (user_id, user_id, now_local_prefix)
            )
        row_up = cursor.fetchone()
        if row_up:
            upcoming_lesson = {
                'id': row_up['id'],
                'classId': row_up['class_id'],
                'class_id': row_up['class_id'],
                'className': row_up['class_name'],
                'class_name': row_up['class_name'],
                'title': row_up['title'],
                'description': row_up['description'],
                'notes': row_up['description'],
                'scheduledAt': row_up['scheduled_at'],
                'scheduled_at': row_up['scheduled_at'],
                'starts_at': row_up['scheduled_at'],
                'durationMin': row_up['duration_min'],
                'duration_min': row_up['duration_min'],
                'homeworkId': row_up['homework_id'],
                'homework_id': row_up['homework_id'],
                'homeworkTitle': row_up['homework_title'],
                'homework_title': row_up['homework_title'],
                'homeworkDeadline': row_up['homework_deadline'],
                'homework_deadline': row_up['homework_deadline'],
                'teacherName': row_up['teacher_name'] if 'teacher_name' in row_up.keys() else '',
                'teacher_name': row_up['teacher_name'] if 'teacher_name' in row_up.keys() else '',
                'studentId': row_up['student_id'] if 'student_id' in row_up.keys() else None,
                'student_id': row_up['student_id'] if 'student_id' in row_up.keys() else None,
                'studentName': row_up['student_name'] if ('student_name' in row_up.keys() and row_up['student_name']) else '',
                'student_name': row_up['student_name'] if ('student_name' in row_up.keys() and row_up['student_name']) else ''
            }

        return {
            'year': year,
            'month': month,
            'lessons': lessons,
            'homeworks': hw_list,
            'upcomingLesson': upcoming_lesson
        }
    finally:
        conn.close()
