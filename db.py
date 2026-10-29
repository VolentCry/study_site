"""
Модуль работы с базой данных SQLite для образовательной платформы «Знания».
Оптимизирован для бесплатного хостинга PythonAnywhere (лимит диска 512 МБ, минимальное потребление RAM и CPU).
"""

import os
import re
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'study_site.db'

# Регулярное выражение для валидации логина (3-30 символов: буквы (рус/англ), цифры, дефис, подчёркивание)
USERNAME_REGEX = re.compile(r'^[a-zA-Zа-яА-ЯёЁ0-9_\-]{3,30}$')


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
    """Инициализация таблиц базы данных."""
    conn = get_db_connection()
    try:
        with conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
                    display_name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    last_login TEXT
                );
            ''')
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            ''')

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


def create_user(
    username: str,
    password: str,
    display_name: Optional[str] = None,
    initial_data: Optional[Dict[str, Any]] = None
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

    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                '''
                INSERT INTO users (username, display_name, password_hash, created_at, last_login)
                VALUES (?, ?, ?, ?, ?)
                ''',
                (username_clean, display_name_clean, password_hash, now_iso, now_iso)
            )
            user_id = cursor.lastrowid

            # Подготовка начальных данных пользователя (можно перенести с гостевого localStorage)
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
            'created_at': now_iso,
            'last_login': now_iso
        }
    except sqlite3.IntegrityError:
        raise ValueError("Пользователь с таким логином уже существует.")
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
            'SELECT id, username, display_name, password_hash, created_at, last_login FROM users WHERE username = ? COLLATE NOCASE',
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
            'SELECT id, username, display_name, created_at, last_login FROM users WHERE id = ?',
            (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None
        return dict(row)
    finally:
        conn.close()


def get_user_data(user_id: int) -> Optional[Dict[str, Any]]:
    """Получение полного игрового прогресса пользователя по ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT u.id, u.username, u.display_name,
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

    metrics = payload.get('metrics', [])
    metrics_json = json.dumps(metrics if isinstance(metrics, list) else [], ensure_ascii=False)

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
