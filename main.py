"""
Образовательная платформа «Знания»
Сервер приложения на Flask для локальной разработки и запуска проекта.

Использование:
    python main.py
    python main.py --port 8080
    python main.py --host 0.0.0.0 --port 5000 --debug
"""

import os
import sys
import argparse
import mimetypes
from pathlib import Path
from flask import Flask, send_from_directory, abort, render_template_string

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
