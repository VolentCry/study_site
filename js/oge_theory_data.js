/**
 * Справочник теории по математике ОГЭ (Задания № 6 – № 25)
 * Источник: ФИПИ / Справочник подготовки к ОГЭ по математике
 */
const OGE_THEORY_DATA = {
  6: {
    id: 6,
    num: "6",
    title: "Задание №6",
    name: "Числа, вычисления и действия с дробями",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Арифметические действия с обыкновенными, смешанными и десятичными дробями, работа со степенями чисел 10ⁿ.",
    spoilers: [
      {
        title: "Перевод смешанного числа в неправильную дробь",
        badge: "Формула",
        formula: `<div class="math-expr">a <span class="fraction"><span class="num">b</span><span class="den">c</span></span> = <span class="fraction"><span class="num">a · c + b</span><span class="den">c</span></span></div>`,
        desc: "Умножаем целую часть на знаменатель и прибавляем числитель — результат идёт в числитель новой дроби, а знаменатель остаётся прежним."
      },
      {
        title: "Основное свойство дроби",
        badge: "Правило",
        formula: `<div class="math-expr"><span class="fraction"><span class="num">a</span><span class="den">b</span></span> = <span class="fraction"><span class="num">a · k</span><span class="den">b · k</span></span> <span class="math-cond">(при b ≠ 0, k ≠ 0)</span></div>`,
        desc: "Числитель и знаменатель дроби можно умножать или делить на одно и то же ненулевое число (сокращение дроби)."
      },
      {
        title: "Сложение и вычитание обыкновенных дробей",
        badge: "Формула",
        formula: `<div class="math-expr"><span class="fraction"><span class="num">a</span><span class="den">b</span></span> ± <span class="fraction"><span class="num">c</span><span class="den">d</span></span> = <span class="fraction"><span class="num">a · d ± c · b</span><span class="den">b · d</span></span></div>`,
        desc: "Обязательно приводим дроби к наименьшему общему знаменателю (НОЗ), домножая числители на дополнительные множители."
      },
      {
        title: "Умножение и деление дробей",
        badge: "Формулы",
        formula: `<div class="math-expr"><span class="fraction"><span class="num">a</span><span class="den">b</span></span> · <span class="fraction"><span class="num">c</span><span class="den">d</span></span> = <span class="fraction"><span class="num">a · c</span><span class="den">b · d</span></span> &emsp;|&emsp; <span class="fraction"><span class="num">a</span><span class="den">b</span></span> : <span class="fraction"><span class="num">c</span><span class="den">d</span></span> = <span class="fraction"><span class="num">a</span><span class="den">b</span></span> · <span class="fraction"><span class="num">d</span><span class="den">c</span></span> = <span class="fraction"><span class="num">a · d</span><span class="den">b · c</span></span></div>`,
        desc: "При делении вторая дробь переворачивается (умножаем на обратную). Перед перемножением чисел всегда сначала сокращайте!"
      },
      {
        title: "Перевод обыкновенной дроби в десятичную",
        badge: "Ключевые дроби",
        formula: `<div class="math-expr"><span class="fraction"><span class="num">1</span><span class="den">2</span></span> = 0,5;&emsp;<span class="fraction"><span class="num">1</span><span class="den">4</span></span> = 0,25;&emsp;<span class="fraction"><span class="num">1</span><span class="den">8</span></span> = 0,125;&emsp;<span class="fraction"><span class="num">1</span><span class="den">5</span></span> = 0,2;&emsp;<span class="fraction"><span class="num">1</span><span class="den">25</span></span> = 0,04</div>`,
        desc: "Домножаем числитель и знаменатель так, чтобы в знаменателе получилось 10, 100 или 1000, либо делим числитель на знаменатель уголком."
      },
      {
        title: "Правила знаков при вычислениях",
        badge: "Законы знаков",
        formula: `<div class="math-expr">(−) · (−) = (+);&emsp;(+) · (−) = (−);&emsp;−a − b = −(a + b)</div>`,
        desc: "Минус на минус даёт плюс при умножении и делении. При сложении двух отрицательных чисел складываем их модули и ставим знак минус."
      }
    ]
  },

  7: {
    id: 7,
    num: "7",
    title: "Задание №7",
    name: "Числовые неравенства и координатная прямая",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Сравнение рациональных и иррациональных чисел, оценка знаков выражений по положению точек на числовой оси.",
    spoilers: [
      {
        title: "Сравнение квадратных корней и оценка иррациональных чисел",
        badge: "Правило оценки",
        formula: `<div class="math-expr">0 ≤ a < b &ensp;⟹&ensp; √a < √b<br><span class="math-note">Пример: √49 < √53 < √64 &ensp;⟹&ensp; 7 < √53 < 8 (число ближе к 7, так как 53 ближе к 49)</span></div>`,
        desc: "Чтобы оценить √x, зажмите подкоренное число между двумя ближайшими точными квадратами целых чисел."
      },
      {
        title: "Внесение множителя под знак корня",
        badge: "Формула",
        formula: `<div class="math-expr">a√b = √(a² · b) &ensp;<span class="math-cond">(при a ≥ 0)</span></div>`,
        desc: "Положительный множитель возводится в квадрат и вносится под корень. Это позволяет сравнивать числа вида 3√5 и 5√2 (√45 < √50)."
      },
      {
        title: "Свойства числовых неравенств",
        badge: "Базовые свойства",
        formula: `<div class="math-expr">1) a > b &ensp;⟹&ensp; a − b > 0, &ensp; b − a < 0<br>2) a > b, c > 0 &ensp;⟹&ensp; ac > bc<br>3) a > b, c < 0 &ensp;⟹&ensp; ac < bc &ensp;<strong>(знак меняется!)</strong><br>4) a > b > 0 &ensp;⟹&ensp; <span class="fraction"><span class="num">1</span><span class="den">a</span></span> < <span class="fraction"><span class="num">1</span><span class="den">b</span></span></div>`,
        desc: "При умножении или делении неравенства на отрицательное число знак неравенства обязательно переворачивается!"
      },
      {
        title: "Лайфхак для координатной прямой",
        badge: "Метод решения",
        formula: `<div class="math-expr">Подставьте конкретные удобные числа: например, a = −2,3; &ensp; b = 0,7 в соответствии с чертежом.</div>`,
        desc: "Вместо абстрактных рассуждений подставьте численные значения точек с рисунка и быстро вычислите предложенные в задании варианты."
      }
    ]
  },

  8: {
    id: 8,
    num: "8",
    title: "Задание №8",
    name: "Степени, корни и алгебраические выражения",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Преобразование буквенных и числовых выражений со степенями, корнями и формулами сокращенного умножения (ФСУ).",
    spoilers: [
      {
        title: "Свойства степеней",
        badge: "Все свойства",
        formula: `<div class="math-expr">
a⁰ = 1;&emsp; a¹ = a;&emsp; a⁻ⁿ = <span class="fraction"><span class="num">1</span><span class="den">aⁿ</span></span>;&emsp; (<span class="fraction"><span class="num">a</span><span class="den">b</span></span>)⁻ⁿ = (<span class="fraction"><span class="num">b</span><span class="den">a</span></span>)ⁿ<br>
aⁿ · aᵐ = aⁿ⁺ᵐ;&emsp; <span class="fraction"><span class="num">aⁿ</span><span class="den">aᵐ</span></span> = aⁿ⁻ᵐ;&emsp; (aⁿ)ᵐ = aⁿᵐ<br>
(a · b)ⁿ = aⁿ · bⁿ;&emsp; (<span class="fraction"><span class="num">a</span><span class="den">b</span></span>)ⁿ = <span class="fraction"><span class="num">aⁿ</span><span class="den">bⁿ</span></span>
</div>`,
        desc: "При умножении степеней с одинаковым основанием показатели складываются, при делении вычитаются, при возведении степени в степень перемножаются."
      },
      {
        title: "Свойства корней",
        badge: "Все свойства",
        formula: `<div class="math-expr">
(√a)² = a;&emsp; √a² = |a| = <span class="math-cases">{ a, если a ≥ 0; −a, если a < 0 }</span><br>
√(a · b) = √a · √b;&emsp; √(<span class="fraction"><span class="num">a</span><span class="den">b</span></span>) = <span class="fraction"><span class="num">√a</span><span class="den">√b</span></span> (b > 0)<br>
√(a²ᵏ) = |a|ᵏ;&emsp; <span class="fraction"><span class="num">1</span><span class="den">√a ± √b</span></span> = <span class="fraction"><span class="num">√a ∓ √b</span><span class="den">a − b</span></span>
</div>`,
        desc: "Корень из четной степени всегда даёт модуль: √(x²) = |x|. Не забывайте избавляться от иррациональности в знаменателе домножением на сопряженное."
      },
      {
        title: "Формулы сокращенного умножения (ФСУ)",
        badge: "Таблица ФСУ",
        formula: `<div class="math-expr">
(a + b)² = a² + 2ab + b²<br>
(a − b)² = a² − 2ab + b²<br>
a² − b² = (a − b)(a + b)<br>
a³ + b³ = (a + b)(a² − ab + b²)<br>
a³ − b³ = (a − b)(a² + ab + b²)<br>
ax² + bx + c = a(x − x₁)(x − x₂) &ensp;<span class="math-note">(разложение квадратного трехчлена)</span>
</div>`,
        desc: "Особенно популярны в ОГЭ: разность квадратов a² - b² и разложение квадратного трехчлена через корни уравнения."
      }
    ]
  },

  9: {
    id: 9,
    num: "9",
    title: "Задание №9",
    name: "Уравнения (линейные, квадратные, рациональные)",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Решение линейных, неполных и полных квадратных, а также простейших дробно-рациональных уравнений.",
    spoilers: [
      {
        title: "Линейное и распадающееся уравнения",
        badge: "Формулы",
        formula: `<div class="math-expr">
Линейное: ax + b = 0 &ensp;⟹&ensp; x = −<span class="fraction"><span class="num">b</span><span class="den">a</span></span> (a ≠ 0)<br>
Распадающееся: (ax + b)(cx + d) = 0 &ensp;⟺&ensp; ax + b = 0 &ensp;или&ensp; cx + d = 0
</div>`,
        desc: "Произведение равно нулю тогда и только тогда, когда хотя бы один из множителей равен нулю, а другие при этом имеют смысл."
      },
      {
        title: "Неполные квадратные уравнения",
        badge: "2 типа",
        formula: `<div class="math-expr">
1) ax² + bx = 0 &ensp;⟹&ensp; x(ax + b) = 0 &ensp;⟹&ensp; x₁ = 0, &ensp; x₂ = −<span class="fraction"><span class="num">b</span><span class="den">a</span></span> &ensp;<strong>(нельзя делить на x!)</strong><br>
2) ax² + c = 0 &ensp;⟹&ensp; x² = −<span class="fraction"><span class="num">c</span><span class="den">a</span></span>. Если −<span class="fraction"><span class="num">c</span><span class="den">a</span></span> > 0, то x₁,₂ = ±√<span class="fraction"><span class="num">−c</span><span class="den">a</span></span>
</div>`,
        desc: "Никогда не сокращайте на x — вы потеряете корень x = 0!"
      },
      {
        title: "Полное квадратное уравнение: дискриминант",
        badge: "Формула корней",
        formula: `<div class="math-expr">
ax² + bx + c = 0 (a ≠ 0)<br>
D = b² − 4ac<br>
D > 0 &ensp;⟹&ensp; 2 корня: x₁,₂ = <span class="fraction"><span class="num">−b ± √D</span><span class="den">2a</span></span><br>
D = 0 &ensp;⟹&ensp; 1 корень: x = −<span class="fraction"><span class="num">b</span><span class="den">2a</span></span><br>
D < 0 &ensp;⟹&ensp; действительных корней нет
</div>`,
        desc: "Внимательно следите за знаками коэффициентов b и c при расчете 4ac: если c < 0, то -4ac превращается в плюс!"
      },
      {
        title: "Теорема Виета и быстрые корни по сумме коэффициентов",
        badge: "Лайфхаки Виета",
        formula: `<div class="math-expr">
Теорема Виета: x₁ + x₂ = −<span class="fraction"><span class="num">b</span><span class="den">a</span></span>;&emsp; x₁ · x₂ = <span class="fraction"><span class="num">c</span><span class="den">a</span></span><br>
Быстрые корни:<br>
• Если a + b + c = 0 &ensp;⟹&ensp; x₁ = 1, &ensp; x₂ = <span class="fraction"><span class="num">c</span><span class="den">a</span></span><br>
• Если a − b + c = 0 &ensp;⟹&ensp; x₁ = −1, &ensp; x₂ = −<span class="fraction"><span class="num">c</span><span class="den">a</span></span>
</div>`,
        desc: "Сумма коэффициентов позволяет найти корни за 2 секунды без подсчета дискриминанта!"
      },
      {
        title: "Дробно-рациональные уравнения и пропорции",
        badge: "ОДЗ и пропорция",
        formula: `<div class="math-expr">
<span class="fraction"><span class="num">P(x)</span><span class="den">Q(x)</span></span> = 0 &ensp;⟺&ensp; <span class="math-cases">{ P(x) = 0<br>Q(x) ≠ 0 }</span><br>
Пропорция: <span class="fraction"><span class="num">A</span><span class="den">B</span></span> = <span class="fraction"><span class="num">C</span><span class="den">D</span></span> &ensp;⟹&ensp; A · D = B · C &ensp;(при B ≠ 0, D ≠ 0)
</div>`,
        desc: "Обязательно проверяйте, чтобы найденные корни не обращали знаменатель в ноль."
      }
    ]
  },

  10: {
    id: 10,
    num: "10",
    title: "Задание №10",
    name: "Теория вероятностей",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Классическое определение вероятности, противоположные, совместные и независимые события.",
    spoilers: [
      {
        title: "Классическое определение вероятности",
        badge: "Главная формула",
        formula: `<div class="math-expr">P(A) = <span class="fraction"><span class="num">m</span><span class="den">n</span></span> &ensp;<span class="math-cond">(0 ≤ P(A) ≤ 1)</span></div>`,
        desc: "m — число благоприятных исходов (то, что спрашивается в вопросе), n — общее число всех равновозможных исходов (всего предметов/участников)."
      },
      {
        title: "Противоположное событие",
        badge: "Формула",
        formula: `<div class="math-expr">P(A) + P(Ā) = 1 &ensp;⟹&ensp; P(Ā) = 1 − P(A)</div>`,
        desc: "Если вероятность бракованной детали 0,08, то вероятность качественной: 1 − 0,08 = 0,92."
      },
      {
        title: "Сумма несовместных событий (союз «ИЛИ»)",
        badge: "Сложение вероятностей",
        formula: `<div class="math-expr">P(A ∪ B) = P(A) + P(B)</div>`,
        desc: "Если события не могут произойти одновременно, их вероятности складываются (например: выпадет красный ИЛИ синий шар)."
      },
      {
        title: "Произведение независимых событий (союз «И»)",
        badge: "Умножение вероятностей",
        formula: `<div class="math-expr">P(A ∩ B) = P(A) · P(B)</div>`,
        desc: "Если события происходят независимо друг от друга, их вероятности перемножаются."
      },
      {
        title: "Типовые наборы исходов для монет и костей",
        badge: "Справочник исходов",
        formula: `<div class="math-expr">
1 монета = 2 исхода<br>
2 монеты = 2² = 4 исхода (ОО, ОР, РО, РР)<br>
3 монеты = 2³ = 8 исходов<br>
1 игральный кубик = 6 исходов<br>
2 игральных кубика = 6² = 36 исходов
</div>`,
        desc: "Для двух кубиков удобно нарисовать таблицу 6×6 и посчитать нужные суммы."
      }
    ]
  },

  11: {
    id: 11,
    num: "11",
    title: "Задание №11",
    name: "Графики функций и их коэффициенты",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Установление соответствия между графиками функций и формулами/знаками коэффициентов.",
    spoilers: [
      {
        title: "Линейная функция: y = kx + b (прямая)",
        badge: "Прямая",
        formula: `<div class="math-expr">
• k > 0: прямая возрастает (идёт снизу вверх вправо)<br>
• k < 0: прямая убывает (идёт сверху вниз вправо)<br>
• k = 0: горизонтальная прямая y = b<br>
• b: точка пересечения с осью Oy — координаты (0; b)
</div>`,
        desc: "Знак k отвечает за наклон прямой, число b — это высота пересечения оси ординат."
      },
      {
        title: "Квадратичная функция: y = ax² + bx + c (парабола)",
        badge: "Парабола",
        formula: `<div class="math-expr">
• a > 0: ветви направлены вверх &ensp;∪<br>
• a < 0: ветви направлены вниз &ensp;∩<br>
• c: точка пересечения параболы с осью Oy (0; c)<br>
• Вершина параболы: x₀ = −<span class="fraction"><span class="num">b</span><span class="den">2a</span></span>; &ensp; y₀ = −<span class="fraction"><span class="num">D</span><span class="den">4a</span></span><br>
• Знак b: определяется по формуле b = −2a · x₀
</div>`,
        desc: "Если ветви вверх (a>0) и вершина правее нуля (x₀>0), то b имеет знак минус (b < 0)!"
      },
      {
        title: "Обратная пропорциональность: y = k/x (гипербола)",
        badge: "Гипербола",
        formula: `<div class="math-expr">
• k > 0: ветви лежат в I и III четвертях<br>
• k < 0: ветви лежат во II и IV четвертях<br>
• Ширина: чем больше |k|, тем дальше ветви от осей координат. При |k| < 1 ветви сильно прижаты к осям.
</div>`,
        desc: "Если перед x в знаменателе стоит минус или в числителе отрицательное число — график во 2 и 4 четвертях."
      },
      {
        title: "Квадратный корень: y = √x (ветвь параболы)",
        badge: "Корень",
        formula: `<div class="math-expr">
Область определения x ≥ 0.<br>
График начинается в точке (0; 0), лежит в I четверти, плавно возрастает.<br>
Контрольные точки: (1; 1), (4; 2), (9; 3).
</div>`,
        desc: "Ветвь лежачей параболы только в верхней правой полуплоскости."
      }
    ]
  },

  12: {
    id: 12,
    num: "12",
    title: "Задание №12",
    name: "Расчеты по формулам",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Выражение неизвестной переменной из формулы и вычисление её числового значения.",
    spoilers: [
      {
        title: "Алгоритм решения задания №12",
        badge: "План решения",
        formula: `<div class="math-expr">
1. Выписать формулу из условия и переписать все известные величины.<br>
2. Проверить единицы измерения (перевести минуты в секунды/часы, если требуется).<br>
3. Подставить числа в формулу ЛИБО сначала выразить искомую переменную в буквенном виде.
</div>`,
        desc: "Главная ошибка — невнимательное чтение единиц измерения и арифметические ошибки в умножении столбиком."
      },
      {
        title: "Правила выражения неизвестной переменной",
        badge: "Алгебра выражения",
        formula: `<div class="math-expr">
• Из A = B · C &ensp;⟹&ensp; B = <span class="fraction"><span class="num">A</span><span class="den">C</span></span><br>
• Из A = <span class="fraction"><span class="num">B</span><span class="den">C</span></span> &ensp;⟹&ensp; B = A · C, &ensp; C = <span class="fraction"><span class="num">B</span><span class="den">A</span></span><br>
• Из A = B · C² &ensp;⟹&ensp; C² = <span class="fraction"><span class="num">A</span><span class="den">B</span></span> &ensp;⟹&ensp; C = √<span class="fraction"><span class="num">A</span><span class="den">B</span></span>
</div>`,
        desc: "Так как физические величины положительны, при извлечении корня знак минус отбрасывается."
      },
      {
        title: "Золотое правило вычислений",
        badge: "Секрет скорости",
        formula: `<div class="math-expr">Всегда сокращайте дроби ДО умножения чисел столбиком! Записывайте вычисления в виде одной общей дроби.</div>`,
        desc: "Сокращение защищает от ошибок в 95% случаев и экономит драгоценное время на экзамене."
      }
    ]
  },

  13: {
    id: 13,
    num: "13",
    title: "Задание №13",
    name: "Неравенства и системы неравенств",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Решение линейных и квадратных неравенств, а также их систем, графическое изображение решений.",
    spoilers: [
      {
        title: "Главное правило знака при делении неравенства",
        badge: "Критическое правило",
        formula: `<div class="math-expr">При умножении или делении обеих частей неравенства на ОТРИЦАТЕЛЬНОЕ число знак неравенства МЕНЯЕТСЯ на противоположный: <br>< &ensp;меняется на&ensp; >,&emsp; ≤ &ensp;меняется на&ensp; ≥</div>`,
        desc: "Например: −2x ≤ 6 &ensp;⟹&ensp; x ≥ −3. Самая частая ловушка в задании 13!"
      },
      {
        title: "Соответствие знаков, точек и скобок",
        badge: "Таблица",
        formula: `<div class="math-expr">
Строгий знак (<, >) &ensp;⟺&ensp; выколотая (пустая) точка ○ &ensp;⟺&ensp; круглая скобка ( )<br>
Нестрогий знак (≤, ≥) &ensp;⟺&ensp; закрашенная точка ● &ensp;⟺&ensp; квадратная скобка [ ]
</div>`,
        desc: "У бесконечности (±∞) скобка ВСЕГДА только круглая."
      },
      {
        title: "Алгоритм решения квадратного неравенства: ax² + bx + c ≷ 0",
        badge: "Метод интервалов",
        formula: `<div class="math-expr">
1. Найти корни уравнения ax² + bx + c = 0 (x₁ и x₂).<br>
2. Нанести корни на числовую ось с учётом строгости знака.<br>
3. Для a > 0 знаки интервалов слева направо: + &ensp; − &ensp; +<br>
4. Выбрать нужные интервалы: + (если > 0) или − (если < 0).
</div>`,
        desc: "Частный случай: x² < a (a > 0) даёт интервал (−√a; √a), а x² > a даёт объединение (−∞; −√a) ∪ (√a; +∞)."
      },
      {
        title: "Решение систем неравенств",
        badge: "Пересечение",
        formula: `<div class="math-expr">Решить каждое неравенство отдельно ⟹ нанести оба решения на одну ось ⟹ найти ПЕРЕСЕЧЕНИЕ штриховок («где обе крыши совпадают»).</div>`,
        desc: "В ответ системы входит только тот промежуток, где присутствуют штриховки от обоих неравенств одновременно."
      }
    ]
  },

  14: {
    id: 14,
    num: "14",
    title: "Задание №14",
    name: "Арифметическая и геометрическая прогрессии",
    part: "Часть 1 · Алгебра",
    score: "1 балл",
    category: "algebra-1",
    tested: "Применение формул n-го члена и суммы первых n членов арифметической и геометрической прогрессий в практических задачах.",
    spoilers: [
      {
        title: "Арифметическая прогрессия (aₙ)",
        badge: "Формулы (aₙ)",
        formula: `<div class="math-expr">
Разность (шаг): d = aₙ₊₁ − aₙ<br>
Формула n-го члена: aₙ = a₁ + d(n − 1)<br>
Связь любых двух членов: aₙ = aₖ + d(n − k)<br>
Сумма n членов: Sₙ = <span class="fraction"><span class="num">a₁ + aₙ</span><span class="den">2</span></span> · n = <span class="fraction"><span class="num">2a₁ + d(n − 1)</span><span class="den">2</span></span> · n<br>
Свойство: aₙ = <span class="fraction"><span class="num">aₙ₋₁ + aₙ₊₁</span><span class="den">2</span></span> (среднее арифметическое соседей)
</div>`,
        desc: "Каждое следующее число получается прибавлением одного и того же числа d."
      },
      {
        title: "Геометрическая прогрессия (bₙ)",
        badge: "Формулы (bₙ)",
        formula: `<div class="math-expr">
Знаменатель: q = <span class="fraction"><span class="num">bₙ₊₁</span><span class="den">bₙ</span></span> (q ≠ 0)<br>
Формула n-го члена: bₙ = b₁ · qⁿ⁻¹<br>
Связь любых двух членов: bₙ = bₖ · qⁿ⁻ᵏ<br>
Сумма n членов: Sₙ = <span class="fraction"><span class="num">b₁(qⁿ − 1)</span><span class="den">q − 1</span></span> (при q ≠ 1)<br>
Свойство: bₙ² = bₙ₋₁ · bₙ₊₁ (квадрат равен произведению соседей)
</div>`,
        desc: "Каждое следующее число получается умножением на знаменатель q."
      },
      {
        title: "Таблица значений тригонометрических функций (для геометрии ОГЭ)",
        badge: "Тригонометрия",
        formula: `<div class="math-expr">
• sin 30° = <span class="fraction"><span class="num">1</span><span class="den">2</span></span> (0,5); &ensp; sin 45° = <span class="fraction"><span class="num">√2</span><span class="den">2</span></span>; &ensp; sin 60° = <span class="fraction"><span class="num">√3</span><span class="den">2</span></span>; &ensp; sin 90° = 1<br>
• cos 30° = <span class="fraction"><span class="num">√3</span><span class="den">2</span></span>; &ensp; cos 45° = <span class="fraction"><span class="num">√2</span><span class="den">2</span></span>; &ensp; cos 60° = <span class="fraction"><span class="num">1</span><span class="den">2</span></span> (0,5); &ensp; cos 90° = 0<br>
• tg 30° = <span class="fraction"><span class="num">√3</span><span class="den">3</span></span>; &ensp; tg 45° = 1; &ensp; tg 60° = √3<br>
• Тупой угол: sin(180° − α) = sin α; &ensp; cos(180° − α) = −cos α; &ensp; tg(180° − α) = −tg α
</div>`,
        desc: "Обратите внимание: синус тупого угла положительный, а косинус и тангенс тупого угла — отрицательные!"
      }
    ]
  },

  15: {
    id: 15,
    num: "15",
    title: "Задание №15",
    name: "Треугольники, многоугольники и их элементы",
    part: "Часть 1 · Геометрия",
    score: "1 балл",
    category: "geometry-1",
    tested: "Свойства углов, медиан, биссектрис, высот, средних линий, теоремы синусов и косинусов, тригонометрия прямоугольного треугольника.",
    spoilers: [
      {
        title: "Углы и параллельные прямые",
        badge: "Аксиомы углов",
        formula: `<div class="math-expr">
• Смежные углы: α + β = 180°<br>
• Вертикальные углы равны между собой<br>
• При пересечении секущей: накрест лежащие углы равны; соответственные углы равны; сумма односторонних = 180°<br>
• Сумма углов треугольника: ∠A + ∠B + ∠C = 180°<br>
• Внешний угол треугольника равен сумме двух внутренних, не смежных с ним<br>
• Сумма углов выпуклого n-угольника: 180° · (n − 2)
</div>`,
        desc: "Базовые соотношения для нахождения углов во всех геометрических задачах."
      },
      {
        title: "Свойства медиан, биссектрис и средней линии",
        badge: "Элементы треугольника",
        formula: `<div class="math-expr">
• Средняя линия: MN = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>AC (параллельна AC и отсекает S = <span class="fraction"><span class="num">1</span><span class="den">4</span></span> от площади исходного)<br>
• Медианы: точка пересечения делит медианы в отношении 2 : 1 от вершины. Медиана делит треугольник на 2 равновеликих (равных по площади)<br>
• Свойство биссектрисы: <span class="fraction"><span class="num">a₁</span><span class="den">b₁</span></span> = <span class="fraction"><span class="num">a</span><span class="den">b</span></span> (делит сторону пропорционально прилежащим сторонам)
</div>`,
        desc: "Три медианы треугольника делят его на 6 равновеликих треугольников!"
      },
      {
        title: "Равносторонний треугольник",
        badge: "Готовые формулы",
        formula: `<div class="math-expr">
Все углы по 60°.<br>
Высота / медиана / биссектриса: h = <span class="fraction"><span class="num">a√3</span><span class="den">2</span></span><br>
Площадь: S = <span class="fraction"><span class="num">a²√3</span><span class="den">4</span></span><br>
Радиус вписанной: r = <span class="fraction"><span class="num">a√3</span><span class="den">6</span></span> = <span class="fraction"><span class="num">1</span><span class="den">3</span></span>h<br>
Радиус описанной: R = <span class="fraction"><span class="num">a√3</span><span class="den">3</span></span> = <span class="fraction"><span class="num">2</span><span class="den">3</span></span>h &ensp;(причём R = 2r)
</div>`,
        desc: "Для правильного треугольника эти формулы запоминаются как таблица умножения."
      },
      {
        title: "Теоремы синусов и косинусов",
        badge: "Универсальные теоремы",
        formula: `<div class="math-expr">
Теорема синусов: <span class="fraction"><span class="num">a</span><span class="den">sin A</span></span> = <span class="fraction"><span class="num">b</span><span class="den">sin B</span></span> = <span class="fraction"><span class="num">c</span><span class="den">sin C</span></span> = 2R &ensp;(R — радиус описанной окружности)<br>
Теорема косинусов: c² = a² + b² − 2ab · cos C
</div>`,
        desc: "Теорема синусов связывает сторону, противолежащий угол и радиус описанной окружности R."
      },
      {
        title: "Прямоугольный треугольник и тригонометрия острого угла",
        badge: "Прямоугольный △",
        formula: `<div class="math-expr">
• Теорема Пифагора: c² = a² + b² (тройки: 3-4-5; 5-12-13; 8-15-17; 7-24-25)<br>
• Катет против 30° равен половине гипотенузы: a = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>c<br>
• Медиана к гипотенузе: m_c = R = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>c<br>
• Высота: h_c = <span class="fraction"><span class="num">a · b</span><span class="den">c</span></span>;&emsp; h_c² = c_a · c_b;&emsp; a² = c · c_a<br>
• Отношения: sin α = <span class="fraction"><span class="num">противолеж.</span><span class="den">гипотенуза</span></span>;&ensp; cos α = <span class="fraction"><span class="num">прилеж.</span><span class="den">гипотенуза</span></span>;&ensp; tg α = <span class="fraction"><span class="num">противолеж.</span><span class="den">прилеж.</span></span><br>
• Тождество: sin²α + cos²α = 1
</div>`,
        desc: "Медиана, проведённая из вершины прямого угла к гипотенузе, равна половине гипотенузы!"
      }
    ]
  },

  16: {
    id: 16,
    num: "16",
    title: "Задание №16",
    name: "Окружность, круг и их элементы",
    part: "Часть 1 · Геометрия",
    score: "1 балл",
    category: "geometry-1",
    tested: "Центральные и вписанные углы, касательные, секущие, хорды, вписанные и описанные окружности.",
    spoilers: [
      {
        title: "Длина окружности и площадь круга",
        badge: "Формулы круга",
        formula: `<div class="math-expr">C = 2πR;&emsp; S = πR²</div>`,
        desc: "Длина дуги пропорциональна градусной мере центрального угла."
      },
      {
        title: "Центральный и вписанный углы",
        badge: "Главные теоремы",
        formula: `<div class="math-expr">
• Центральный угол равен градусной мере дуги: ∠AOB = ∪AB<br>
• Вписанный угол равен половине дуги: ∠ACB = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>∪AB = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>∠AOB<br>
• Вписанные углы, опирающиеся на одну и ту же дугу, равны<br>
• Вписанный угол, опирающийся на диаметр, всегда прямой (90°)
</div>`,
        desc: "Если треугольник вписан в окружность и одна из его сторон — диаметр, то этот треугольник прямоугольный!"
      },
      {
        title: "Свойства касательной к окружности",
        badge: "Касательная",
        formula: `<div class="math-expr">
• Касательная перпендикулярна радиусу в точке касания: OA ⊥ l<br>
• Отрезки касательных из одной точки равны: AB = AC<br>
• Луч AO является биссектрисой угла между касательными ∠BAC
</div>`,
        desc: "Отрезки касательных от общей внешней точки до точек касания всегда равны."
      },
      {
        title: "Метрические соотношения хорд и секущих",
        badge: "Произведения отрезков",
        formula: `<div class="math-expr">
• Пересекающиеся хорды: AM · MB = CM · MD<br>
• Касательная MK и секущая MB: MK² = MA · MB (квадрат касательной равен произведению всей секущей на её внешнюю часть)<br>
• Две секущие из одной точки: MA · MB = MC · MD
</div>`,
        desc: "Очень полезные соотношения для быстрого нахождения неизвестных отрезков."
      },
      {
        title: "Вписанный и описанный четырехугольник",
        badge: "Критерии 180° и сумм",
        formula: `<div class="math-expr">
• Четырехугольник можно ВПИСАТЬ в окружность &ensp;⟺&ensp; сумма противоположных углов = 180°: ∠A + ∠C = ∠B + ∠D = 180°<br>
• В четырехугольник можно ОПИСАТЬ окружность &ensp;⟺&ensp; суммы противоположных сторон равны: a + c = b + d
</div>`,
        desc: "В любой трапеции, вписанной в окружность, боковые стороны равны (она равнобедренная)!"
      }
    ]
  },

  17: {
    id: 17,
    num: "17",
    title: "Задание №17",
    name: "Четырехугольники и площади плоских фигур",
    part: "Часть 1 · Геометрия",
    score: "1 балл",
    category: "geometry-1",
    tested: "Свойства и формулы площади параллелограмма, ромба, прямоугольника, квадрата, трапеции и произвольного треугольника.",
    spoilers: [
      {
        title: "Формулы площади произвольного треугольника",
        badge: "5 формул S",
        formula: `<div class="math-expr">
1) S = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>a · h_a<br>
2) S = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>a · b · sin γ<br>
3) Формула Герона: S = √(p(p−a)(p−b)(p−c)), где p = <span class="fraction"><span class="num">a+b+c</span><span class="den">2</span></span><br>
4) Через радиус вписанной: S = p · r<br>
5) Через радиус описанной: S = <span class="fraction"><span class="num">abc</span><span class="den">4R</span></span><br>
Отношение площадей подобных треугольников: <span class="fraction"><span class="num">S₁</span><span class="den">S₂</span></span> = k²
</div>`,
        desc: "Помните: отношение площадей подобных фигур равно квадрату коэффициента подобия k²."
      },
      {
        title: "Параллелограмм: свойства и площади",
        badge: "Параллелограмм",
        formula: `<div class="math-expr">
• Противоположные стороны и углы равны; сумма соседних углов = 180°<br>
• Диагонали точкой пересечения делятся пополам<br>
• Биссектриса отсекает равнобедренный треугольник<br>
• S = a · h_a = b · h_b<br>
• S = a · b · sin α<br>
• S = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>d₁d₂ · sin φ (через диагонали)
</div>`,
        desc: "Диагональ делит параллелограмм на два равных треугольника."
      },
      {
        title: "Ромб: свойства и формулы площади",
        badge: "Ромб",
        formula: `<div class="math-expr">
• Все стороны равны a<br>
• Диагонали взаимно перпендикулярны (d₁ ⊥ d₂) и являются биссектрисами его углов<br>
• S = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>d₁ · d₂<br>
• S = a · h;&emsp; S = a² · sin α<br>
• Высота ромба равна удвоенному радиусу вписанной окружности: h = 2r
</div>`,
        desc: "Площадь ромба через диагонали — самая частая формула в задании 17."
      },
      {
        title: "Прямоугольник и Квадрат",
        badge: "Формулы",
        formula: `<div class="math-expr">
Прямоугольник: S = a · b;&emsp; диагональ d = √(a² + b²)<br>
Квадрат: S = a² = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>d²;&emsp; диагональ d = a√2
</div>`,
        desc: "Диагонали прямоугольника равны и точкой пересечения делятся пополам."
      },
      {
        title: "Трапеция: средняя линия и площадь",
        badge: "Трапеция",
        formula: `<div class="math-expr">
• Основания параллельны: a ∥ b<br>
• Средняя линия: m = <span class="fraction"><span class="num">a + b</span><span class="den">2</span></span><br>
• Площадь: S = <span class="fraction"><span class="num">a + b</span><span class="den">2</span></span> · h = m · h<br>
• Равнобедренная трапеция: углы при основании равны, диагонали равны; проекция боковой стороны на большее основание равна <span class="fraction"><span class="num">b − a</span><span class="den">2</span></span>, а проекция диагонали равна <span class="fraction"><span class="num">a + b</span><span class="den">2</span></span> = m
</div>`,
        desc: "Площадь трапеции равна произведению средней линии на высоту!"
      }
    ]
  },

  18: {
    id: 18,
    num: "18",
    title: "Задание №18",
    name: "Фигуры на квадратной решетке",
    part: "Часть 1 · Геометрия",
    score: "1 балл",
    category: "geometry-1",
    tested: "Нахождение длин отрезков, расстояний, тригонометрических функций углов и площадей фигур на клетчатой бумаге 1×1.",
    spoilers: [
      {
        title: "Длина наклонного отрезка по узлам сетки",
        badge: "Теорема Пифагора",
        formula: `<div class="math-expr">c = √(a² + b²)</div>`,
        desc: "Достройте наклонный отрезок до прямоугольного треугольника по линиям сетки, посчитайте катеты a и b по клеточкам и найдите гипотенузу."
      },
      {
        title: "Тангенс, синус, косинус угла на клетках",
        badge: "Тригонометрия на сетке",
        formula: `<div class="math-expr">tg α = <span class="fraction"><span class="num">a (противолежащий катет)</span><span class="den">b (прилежащий катет)</span></span></div>`,
        desc: "Опустите перпендикуляр из точки на одной стороне угла на другую сторону так, чтобы вершина прямого угла попала ТОЧНО в узел сетки."
      },
      {
        title: "Метод «коробки» для сложной площади",
        badge: "Универсальный метод",
        formula: `<div class="math-expr">S_фигуры = S_прямоугольника − ∑(S_лишних прямоугольных треугольников по краям)</div>`,
        desc: "Опишите вокруг многоугольника прямоугольник по линиям сетки, посчитайте его площадь и вычтите лишние краевые треугольники."
      }
    ]
  },

  19: {
    id: 19,
    num: "19",
    title: "Задание №19",
    name: "Анализ геометрических высказываний",
    part: "Часть 1 · Геометрия",
    score: "1 балл",
    category: "geometry-1",
    tested: "Оценка истинности геометрических утверждений о свойствах фигур, аксиом и теорем.",
    spoilers: [
      {
        title: "Правила чтения вопроса и записи ответа",
        badge: "Инструкция",
        formula: `<div class="math-expr">
«Какое из следующих утверждений верно?» ⟹ в ответе ровно 1 цифра.<br>
«Какие из следующих утверждений верны?» ⟹ в ответе 2 цифры (очень редко 3), записываются подряд без пробелов и запятых (например, 13).
</div>`,
        desc: "Внимательно смотрите на вопрос: просят верные или НЕВЕРНЫЕ утверждения!"
      },
      {
        title: "Слова-маркеры ложных высказываний",
        badge: "Сигналы лжи",
        formula: `<div class="math-expr">Слова: «любой», «каждый», «всегда» в большинстве случаев сигнализируют о ложности утверждения!</div>`,
        desc: "Пример: «Диагонали любого прямоугольника взаимно перпендикулярны» — ЛОЖЬ (это верно только для квадрата). «В любой четырехугольник можно вписать окружность» — ЛОЖЬ."
      },
      {
        title: "ТОП частых ловушек ФИПИ",
        badge: "Банк фактов",
        formula: `<div class="math-expr">
• «Центр описанной около треугольника окружности всегда лежит внутри» ⟹ <strong>ЛОЖЬ</strong> (в тупоугольном снаружи, в прямоугольном на середине гипотенузы). Центр вписанной — ВСЕГДА внутри (ИСТИНА).<br>
• «Через точку, не лежащую на данной прямой, можно провести прямую, параллельную этой прямой» ⟹ <strong>ИСТИНА</strong>.<br>
• «Все диаметры окружности равны между собой» ⟹ <strong>ИСТИНА</strong>.<br>
• «Площадь трапеции равна произведению основания на высоту» ⟹ <strong>ЛОЖЬ</strong> (полусуммы оснований на высоту!).
</div>`,
        desc: "Выучите эти 4 формулировки — они встречаются в каждом втором варианте ОГЭ."
      }
    ]
  },

  20: {
    id: 20,
    num: "20",
    title: "Задание №20",
    name: "Алгебраические выражения, уравнения, системы и неравенства",
    part: "Часть 2 · Повышенный уровень",
    score: "2 балла",
    category: "algebra-2",
    tested: "Разложение на множители, биквадратные уравнения, уравнения высоких степеней, системы с двумя переменными, нелинейные неравенства с обязательным обоснованием.",
    spoilers: [
      {
        title: "Уравнения 3-й и 4-й степеней: группировка и замена",
        badge: "Методы решения",
        formula: `<div class="math-expr">
• Метод группировки: x³ + ax² + bx + c = 0 ⟹ x²(x + a) + b(x + a) = 0 ⟹ (x + a)(x² + b) = 0<br>
• Биквадратные: ax⁴ + bx² + c = 0 ⟹ замена t = x² (обязательно указать условие t ≥ 0), обратная замена x = ±√t<br>
• Замена сложного блока: (x² + kx)² ⟹ ввести t = x² + kx<br>
• Равенство квадратов: A² = B² ⟺ (A − B)(A + B) = 0 (не потеряйте корень A = −B!)
</div>`,
        desc: "Всегда проверяйте условие t ≥ 0: отрицательные корни t отбрасываются при замене t = x²."
      },
      {
        title: "Строгий учет ОДЗ (Области допустимых значений)",
        badge: "ОДЗ",
        formula: `<div class="math-expr">
• Знаменатель дроби: <span class="fraction"><span class="num">A</span><span class="den">B</span></span> ⟹ B ≠ 0<br>
• Квадратный корень: √A ⟹ A ≥ 0. Если +√x−a и −√x−a сокращаются, то ТОЛЬКО при условии ОДЗ: x − a ≥ 0 ⟹ x ≥ a!<br>
• Сумма двух квадратов: A² + B² = 0 ⟺ <span class="math-cases">{ A = 0<br>B = 0 }</span> (решается система, в ответ идёт общее решение)
</div>`,
        desc: "Корни, не входящие в ОДЗ, являются посторонними. Если не написать ОДЗ, снимут баллы!"
      },
      {
        title: "Системы нелинейных уравнений",
        badge: "Оформление",
        formula: `<div class="math-expr">Решаются методом подстановки или алгебраического сложения/вычитания. В ответе ОБЯЗАТЕЛЬНО записываются пары чисел в круглых скобках: (x₁; y₁), (x₂; y₂).</div>`,
        desc: "Порядок чисел в паре имеет строгое значение: первая координата x, вторая y."
      },
      {
        title: "Дробные неравенства со знакопостоянным числителем",
        badge: "Неравенства",
        formula: `<div class="math-expr">
Пример: <span class="fraction"><span class="num">−14</span><span class="den">x² − 2x − 15</span></span> ≤ 0<br>
Числитель строго отрицателен (−14 < 0), значит дробь неположительна тогда и только тогда, когда знаменатель строго положителен:<br>
x² − 2x − 15 > 0 (строгий знак, так как знаменатель не равен нулю!).
</div>`,
        desc: "Ни в коем случае не умножайте неравенство на знаменатель с переменной без учета его знака!"
      }
    ]
  },

  21: {
    id: 21,
    num: "21",
    title: "Задание №21",
    name: "Текстовые задачи на составление уравнения",
    part: "Часть 2 · Повышенный уровень",
    score: "2 балла",
    category: "algebra-2",
    tested: "Задачи на движение по прямой, воде, замкнутой трассе, протяженные тела, совместную работу, сплавы, смеси и концентрацию.",
    spoilers: [
      {
        title: "Требования к оформлению на 2 балла",
        badge: "Критерии ФИПИ",
        formula: `<div class="math-expr">1. Ввести переменную: «Пусть x км/ч — скорость лодки, x > 0...»<br>2. Заполнить таблицу величин (скорость, время, расстояние/работа).<br>3. Составить математическую модель (уравнение).<br>4. Указать ОДЗ, решить уравнение, отбросить отрицательные корни и записать ответ с единицами измерения.</div>`,
        desc: "Без пояснения введенной переменной и логики уравнения максимальный балл не выставят."
      },
      {
        title: "Движение по прямой и перевод времени",
        badge: "Движение",
        formula: `<div class="math-expr">
S = v · t;&emsp; t = <span class="fraction"><span class="num">S</span><span class="den">v</span></span><br>
Перевод минут в часы: 15 мин = <span class="fraction"><span class="num">15</span><span class="den">60</span></span> = <span class="fraction"><span class="num">1</span><span class="den">4</span></span> ч;&ensp; 20 мин = <span class="fraction"><span class="num">1</span><span class="den">3</span></span> ч<br>
Разница во времени: t_медленного − t_быстрого = Δt ⟹ <span class="fraction"><span class="num">S</span><span class="den">v₁</span></span> − <span class="fraction"><span class="num">S</span><span class="den">v₂</span></span> = Δt
</div>`,
        desc: "Всегда из времени того, кто ехал дольше (медленнее), вычитают время быстрого."
      },
      {
        title: "Движение по воде (реки, плоты, озера)",
        badge: "По воде",
        formula: `<div class="math-expr">
v_по течению = v_собственная + v_течения<br>
v_против течения = v_собственная − v_течения<br>
Скорость плота равна скорости течения реки: v_плота = v_теч<br>
В стоячей воде (по озеру): v = v_собств
</div>`,
        desc: "У плота нет мотора, он движется исключительно со скоростью течения реки."
      },
      {
        title: "Протяженные тела (поезда) и замкнутая трасса",
        badge: "Поезда и круги",
        formula: `<div class="math-expr">
• Мимо столба / пешехода поезд проходит расстояние, равное своей длине L.<br>
• Навстречу: v_сближения = v_поезда + v_пешехода<br>
• Попутно: v_обгона = v_поезда − v_пешехода<br>
• Перевод км/ч в м/с: разделить на 3,6 (или умножить на <span class="fraction"><span class="num">5</span><span class="den">18</span></span>)<br>
• Движение по кругу в одну сторону: быстрый обгоняет на 1 круг длины S: (v₁ − v₂) · t = S
</div>`,
        desc: "Обратите внимание на соответствие единиц: длина поезда в метрах, а скорость в км/ч требует перевода в м/с!"
      },
      {
        title: "Средняя скорость",
        badge: "Запрет среднего арифм.",
        formula: `<div class="math-expr">
Средняя скорость НЕ равна среднему арифметическому!<br>
v_ср = <span class="fraction"><span class="num">S_весь путь</span><span class="den">t_всё время</span></span> = <span class="fraction"><span class="num">S₁ + S₂ + S₃</span><span class="den">t₁ + t₂ + t₃</span></span><br>
Если две половины пути пройдены со скоростями v₁ и v₂: v_ср = <span class="fraction"><span class="num">2v₁v₂</span><span class="den">v₁ + v₂</span></span>
</div>`,
        desc: "Никогда не складывайте скорости и не делите на 2 — это грубейшая ошибка!"
      },
      {
        title: "Совместная работа, сплавы, смеси и сушка фруктов",
        badge: "Работа и смеси",
        formula: `<div class="math-expr">
• Работа: A = P · t. Если объём не задан: A = 1 ⟹ P₁ = <span class="fraction"><span class="num">1</span><span class="den">t₁</span></span>, P₂ = <span class="fraction"><span class="num">1</span><span class="den">t₂</span></span>; &ensp; <span class="fraction"><span class="num">1</span><span class="den">t₁</span></span> + <span class="fraction"><span class="num">1</span><span class="den">t₂</span></span> = <span class="fraction"><span class="num">1</span><span class="den">t_общ</span></span><br>
• Сплавы и смеси: масса чистого вещества сохраняется: c₁m₁ + c₂m₂ = c₃(m₁ + m₂)<br>
• Сушка фруктов: масса сухого вещества (мякоти) неизменна: m_свежих · (100% − w_свеж) = m_сухих · (100% − w_сух)
</div>`,
        desc: "При сушке испаряется только вода, мякоть остаётся неизменной по весу."
      }
    ]
  },

  22: {
    id: 22,
    num: "22",
    title: "Задание №22",
    name: "Функции и их графики с параметром",
    part: "Часть 2 · Повышенный уровень",
    score: "2 балла",
    category: "algebra-2",
    tested: "Построение графиков кусочно-заданных, дробно-рациональных функций и функций с модулем, исследование количества точек пересечения с прямой y = m или y = kx.",
    spoilers: [
      {
        title: "Дробно-рациональные функции с сокращением",
        badge: "3 шага построения",
        formula: `<div class="math-expr">
Пример: y = <span class="fraction"><span class="num">(x² − 4)(x + 1)</span><span class="den">x − 2</span></span><br>
Шаг 1. Записать ОДЗ: x − 2 ≠ 0 ⟹ x ≠ 2.<br>
Шаг 2. Разложить и сократить: y = (x + 2)(x + 1) = x² + 3x + 2.<br>
Шаг 3. Построить параболу и ОБЯЗАТЕЛЬНО выколоть точку: x = 2 ⟹ y(2) = (2+2)(2+1) = 12 ⟹ выколотая точка (2; 12).
</div>`,
        desc: "Если на графике не выколота точка, ставится 0 баллов за всё задание."
      },
      {
        title: "Кусочно-заданные функции и функции с модулем",
        badge: "Кусочные и модуль",
        formula: `<div class="math-expr">
• Кусочно-заданные: строятся на каждом промежутке отдельно по таблице точек. Особое внимание точкам стыка (проверять закрашена или выколота граничная точка).<br>
• Раскрытие модуля: |A| = A (при A ≥ 0) и −A (при A < 0). Разбивает задачу на два кусочных промежутка.
</div>`,
        desc: "В бланке должны присутствовать таблицы точек для каждой ветви графика!"
      },
      {
        title: "Исследование параметра с прямой y = m",
        badge: "Горизонтальная прямая",
        formula: `<div class="math-expr">Прямая y = m — горизонтальная линия, параллельная оси Ox. Мысленно двигаем её снизу вверх (−∞ до +∞) и фиксируем m в особых точках: вершина параболы, выколотые точки, горизонтальные асимптоты, точки излома.</div>`,
        desc: "В ответе выписываются конкретные изолированные значения m или числовые интервалы."
      },
      {
        title: "Исследование параметра с пучком прямых y = kx",
        badge: "Пучок прямых",
        formula: `<div class="math-expr">
Прямая y = kx проходит через начало координат (0; 0).<br>
• Прохождение через выколотую точку (x_вык; y_вык): k = <span class="fraction"><span class="num">y_вык</span><span class="den">x_вык</span></span><br>
• Касание параболы (ax² + bx + c = kx): составляем квадратное уравнение ax² + (b − k)x + c = 0 и приравниваем дискриминант к нулю: D = 0.
</div>`,
        desc: "Касание параболы прямой y = kx всегда соответствует единственному корню уравнения (D = 0)."
      }
    ]
  },

  23: {
    id: 23,
    num: "23",
    title: "Задание №23",
    name: "Геометрические задачи на вычисление",
    part: "Часть 2 · Повышенный уровень",
    score: "2 балла",
    category: "geometry-2",
    tested: "Вычисление длин отрезков, углов, площадей многоугольников и элементов комбинаций геометрических фигур с подробным обоснованием.",
    spoilers: [
      {
        title: "Критерии ФИПИ для получения полных 2 баллов",
        badge: "Критерий 2 баллов",
        formula: `<div class="math-expr">Каждый логический шаг обязан опираться на известную теорему или свойство.<br>Пример обоснования: «△ABC ∼ △MBN по двум углам, так как ∠B — общий, а ∠BAC = ∠BMN как соответственные при MN ∥ AC и секущей AB».</div>`,
        desc: "Запись формулы без доказательства подобия или равенства треугольников влечёт снижение балла."
      },
      {
        title: "Признаки подобия треугольников на ОГЭ",
        badge: "3 признака подобия",
        formula: `<div class="math-expr">
1. По двум углам (самый частый на ОГЭ: если два угла одного треугольника равны двум углам другого).<br>
2. По двум пропорциональным сторонам и углу между ними (<span class="fraction"><span class="num">a₁</span><span class="den">a₂</span></span> = <span class="fraction"><span class="num">b₁</span><span class="den">b₂</span></span>, ∠C₁ = ∠C₂).<br>
3. По трём пропорциональным сторонам.
</div>`,
        desc: "При подобии треугольников сходственные стороны лежат против равных углов!"
      },
      {
        title: "Конструкция: треугольники при основаниях и боковых сторонах трапеции",
        badge: "Трапеция и диагонали",
        formula: `<div class="math-expr">
Диагонали трапеции AC и BD пересекаются в точке O.<br>
• Треугольники при основаниях △AOD ∼ △COB всегда ПОДОБНЫ по двум углам с k = <span class="fraction"><span class="num">BC</span><span class="den">AD</span></span>.<br>
• Треугольники при боковых сторонах △AOB и △COD РАВНОВЕЛИКИ (их площади равны: S_AOB = S_COD).
</div>`,
        desc: "Ключевая конструкция второй части, встречающаяся практически в каждом варианте ОГЭ."
      },
      {
        title: "Конструкция: биссектрисы углов параллелограмма и трапеции",
        badge: "Биссектрисы",
        formula: `<div class="math-expr">
• Биссектриса любого угла отсекает равнобедренный треугольник (через равенство накрест лежащих углов при параллельных прямых).<br>
• Биссектрисы соседних углов пересекаются под прямым углом (90°), так как сумма углов 180°, а сумма их половин 90°.
</div>`,
        desc: "Если проведены биссектрисы углов, прилежащих к боковой стороне, ищите прямоугольный треугольник!"
      },
      {
        title: "Угол между касательной и хордой",
        badge: "Теорема об угле",
        formula: `<div class="math-expr">Угол между касательной и хордой, проведенной в точку касания, равен половине дуги, заключенной внутри него, и равен любому вписанному углу, опирающемуся на эту дугу.</div>`,
        desc: "Позволяет моментально доказывать подобие треугольников при окружности."
      }
    ]
  },

  24: {
    id: 24,
    num: "24",
    title: "Задание №24",
    name: "Геометрические задачи на доказательство",
    part: "Часть 2 · Повышенный уровень",
    score: "2 балла",
    category: "geometry-2",
    tested: "Доказательство равенства или подобия фигур, параллельности или перпендикулярности прямых, принадлежности точек одной окружности.",
    spoilers: [
      {
        title: "Доказательство подобия треугольников",
        badge: "Алгоритм",
        formula: `<div class="math-expr">
1. Найти общий угол.<br>
2. Доказать равенство второй пары углов через: накрест лежащие углы при параллельных прямых, вертикальные углы или углы, опирающиеся на одну дугу окружности.<br>
3. Сделать вывод: «△... ∼ △... по I признаку (по двум углам)».
</div>`,
        desc: "Четкая структура доказательства гарантирует получение полных 2 баллов."
      },
      {
        title: "Признаки принадлежности 4 точек одной окружности (метод вспомогательной окружности)",
        badge: "4 точки на окр.",
        formula: `<div class="math-expr">
• Если сумма противоположных углов четырехугольника равна 180° (∠A + ∠C = 180°), то около него можно описать окружность.<br>
• Если отрезок виден из двух точек под одним и тем же углом (∠ABD = ∠ACD), то точки A, B, C, D лежат на одной окружности.
</div>`,
        desc: "Частый случай: две высоты треугольника опускаются на стороны — четырехугольник с вершинами в основаниях высот всегда вписанный!"
      },
      {
        title: "Свойство равенства касательных и вписанных углов",
        badge: "Доказательство равенства",
        formula: `<div class="math-expr">Отрезки касательных равны, а радиусы в точки касания перпендикулярны касательным. Доказывается через равенство прямоугольных треугольников по гипотенузе и катету.</div>`,
        desc: "Классический прием для доказательства равенства отрезков во второй части."
      }
    ]
  },

  25: {
    id: 25,
    num: "25",
    title: "Задание №25",
    name: "Геометрическая задача повышенной сложности",
    part: "Часть 2 · Высокий уровень",
    score: "2 балла",
    category: "geometry-2",
    tested: "Сложные планиметрические задачи олимпиадного уровня, требующие неочевидных дополнительных построений и продвинутых теорем.",
    spoilers: [
      {
        title: "Метод площадей и отношение площадей треугольников",
        badge: "Метод площадей",
        formula: `<div class="math-expr">
• Приравнивание площади одной фигуры: S = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>a · h_a = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>b · h_b ⟹ <span class="fraction"><span class="num">h_a</span><span class="den">h_b</span></span> = <span class="fraction"><span class="num">b</span><span class="den">a</span></span><br>
• Треугольники с общей высотой: их площади относятся как основания: <span class="fraction"><span class="num">S₁</span><span class="den">S₂</span></span> = <span class="fraction"><span class="num">a₁</span><span class="den">a₂</span></span><br>
• Треугольники с общим (или равным) углом: <span class="fraction"><span class="num">S_ABC</span><span class="den">S_MBN</span></span> = <span class="fraction"><span class="num">AB · BC</span><span class="den">MB · BN</span></span>
</div>`,
        desc: "Метод площадей позволяет находить высоты и отрезки без тригонометрии."
      },
      {
        title: "Метод удвоения медианы треугольника",
        badge: "Удвоение медианы",
        formula: `<div class="math-expr">
Медиану BM треугольника ABC продлевают за точку M на отрезок MD = BM.<br>
Тогда четырехугольник ABCD является ПАРАЛЛЕЛОГРАММОМ (диагонали точкой пересечения делятся пополам).<br>
Длина медианы через стороны: m_a = <span class="fraction"><span class="num">1</span><span class="den">2</span></span>√(2b² + 2c² − a²)
</div>`,
        desc: "Удвоение медианы переносит все стороны треугольника в параллелограмм, позволяя применить теорему косинусов."
      },
      {
        title: "Дополнительные построения в трапеции",
        badge: "Построения в трапеции",
        formula: `<div class="math-expr">
1. Опустить две высоты из вершин меньшего основания на большее.<br>
2. Провести через вершину прямую, параллельную боковой стороне (трапеция разбивается на параллелограмм и треугольник со сторонами c, d и b − a).<br>
3. Провести прямую, параллельную диагонали: образуется треугольник со сторонами d₁, d₂ и основанием a + b, площадь которого в точности равна площади трапеции!
</div>`,
        desc: "Построение прямой, параллельной диагонали, сводит задачу о трапеции к обычному треугольнику."
      },
      {
        title: "Скрытые окружности и подобие треугольников через косинус",
        badge: "Скрытая окружность",
        formula: `<div class="math-expr">
Высоты AA₁ и CC₁ пересекаются в точке H.<br>
Точки A, C₁, A₁, C лежат на окружности с диаметром AC.<br>
Отсюда △BA₁C₁ ∼ △BAC с коэффициентом подобия k = |cos B|!
</div>`,
        desc: "Коэффициент подобия треугольника, образованного основаниями высот, равен косинусу противолежащего угла."
      },
      {
        title: "Теорема Менелая и формула длины биссектрисы",
        badge: "Теорема Менелая",
        formula: `<div class="math-expr">
Теорема Менелая: прямая пересекает стороны AB, BC и продолжение AC треугольника в точках C₁, A₁, B₁:<br>
<span class="fraction"><span class="num">AC₁</span><span class="den">C₁B</span></span> · <span class="fraction"><span class="num">BA₁</span><span class="den">A₁C</span></span> · <span class="fraction"><span class="num">CB₁</span><span class="den">B₁A</span></span> = 1<br><br>
Квадрат длины биссектрисы: l_c² = a · b − a₁ · b₁ (где a, b — боковые стороны, a₁, b₁ — отрезки третьей стороны).
</div>`,
        desc: "Мощнейшие формулы для решения самых неприступных задач №25."
      }
    ]
  }
};
