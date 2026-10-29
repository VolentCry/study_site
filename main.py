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
from datetime import timedelta
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

    try:
        user = db.create_user(
            username=username,
            password=password,
            display_name=display_name,
            initial_data=local_data if isinstance(local_data, dict) else None
        )
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'Внутренняя ошибка сервера при регистрации.'}), 500

    # Авторизуем пользователя в сессии
    session.permanent = True
    session['user_id'] = user['id']

    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
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

    user_data = db.get_user_data(user['id'])

    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name']
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
# СТАТИЧЕСКИЕ МАРШРУТЫ И ЧПУ
# ============================================================================

@app.route('/')
def index():
    """Главная страница сайта."""
    index_file = BASE_DIR / 'index.html'
    if index_file.is_file():
        return send_from_directory(BASE_DIR, 'index.html')
    abort(404)


@app.route('/<path:subpath>')
def serve_file(subpath: str):
    """
    Универсальная раздача статических файлов и HTML-страниц:
    1. Точное совпадение файла (например, /profile.html, /style.css, /assets/...)
    2. ЧПУ без расширения (например, /profile -> /profile.html)
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
    parser = argparse.ArgumentParser(description="Запуск платформы «Знания» на Flask")
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
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
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
