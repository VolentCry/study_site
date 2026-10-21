document.addEventListener('DOMContentLoaded', () => {
    const tests = {
        arithmetic: {
            title: 'Арифметические операции с натуральными числами',
            hints: [
                'Прибавь к 2 ещё 3 единицы.',
                'Отними 4 от 9.',
                'Умножь 6 на 4.',
                'Подумай, какое число при умножении на 6 даёт 36.',
                'Сложи десятки и единицы отдельно.',
                'Вычти сначала десятки, затем единицы.',
                'Разложи 12 на 10 и 2 и умножь обе части на 8.',
                'Найди число, которое при умножении на 12 даёт 144.',
                'Сложи сотни, десятки и единицы по разрядам.',
                'Вычти 200, а затем оставшиеся 86.',
                'Представь 15 как 10 + 5 и умножь обе части на 24.',
                'Проверь деление умножением: частное × 18 = 936.',
                'Сначала вычисли выражение в скобках.',
                'Сначала выполни умножение, затем вычитание.',
                'Соблюдай порядок действий: сначала деление, потом сложение в скобках, затем умножение.'
            ],
            questions: [
                ['2 + 3 = ?', 5],
                ['9 - 4 = ?', 5],
                ['6 × 4 = ?', 24],
                ['36 ÷ 6 = ?', 6],
                ['27 + 35 = ?', 62],
                ['80 - 37 = ?', 43],
                ['12 × 8 = ?', 96],
                ['144 ÷ 12 = ?', 12],
                ['125 + 278 = ?', 403],
                ['500 - 286 = ?', 214],
                ['24 × 15 = ?', 360],
                ['936 ÷ 18 = ?', 52],
                ['(36 + 24) × 7 = ?', 420],
                ['1000 - 24 × 18 = ?', 568],
                ['(864 ÷ 24 + 17) × 13 = ?', 689]
            ]
        },
        equations: {
            title: 'Уравнения с натуральными числами',
            hints: [
                'Чтобы найти x, вычти 3 из 8.',
                'К обеим частям равенства прибавь 7.',
                'Раздели 28 на коэффициент перед x.',
                'Умножь обе части равенства на 5.',
                'Сначала вычти 4 из 25, потом раздели на 3.',
                'Прибавь 8 к 32, затем раздели результат на 5.',
                'Раздели 42 на 3, затем вычти 6.',
                'Раздели 36 на 4, затем прибавь 2.',
                'Вычти 17 и раздели остаток на 2.',
                'Прибавь 19 к 44, затем раздели на 7.',
                'Прибавь 5, раздели на 3, затем вычти 8.',
                'Умножь обе части на 3, вычти 15 и раздели на 5.',
                'Вычти 18, раздели на 6, затем прибавь 4.',
                'Вычти 15, прибавь 12 и раздели на 4.',
                'Вычти 14, умножь на 6, вычти 21 и раздели на 3.'
            ],
            questions: [
                ['x + 3 = 8. Найди x.', 5],
                ['x - 7 = 12. Найди x.', 19],
                ['4 × x = 28. Найди x.', 7],
                ['x ÷ 5 = 9. Найди x.', 45],
                ['3 × x + 4 = 25. Найди x.', 7],
                ['5 × x - 8 = 32. Найди x.', 8],
                ['(x + 6) × 3 = 42. Найди x.', 8],
                ['4 × (x - 2) = 36. Найди x.', 11],
                ['2 × x + 17 = 53. Найди x.', 18],
                ['7 × x - 19 = 44. Найди x.', 9],
                ['3 × (x + 8) - 5 = 52. Найди x.', 11],
                ['(5 × x + 15) ÷ 3 = 20. Найди x.', 9],
                ['6 × (x - 4) + 18 = 72. Найди x.', 13],
                ['(4 × x - 12) ÷ 2 + 15 = 39. Найди x.', 15],
                ['(3 × x + 21) ÷ 6 + 14 = 30. Найди x.', 25]
            ]
        },
        geometry: {
            title: 'Расчёты площадей и объёмов',
            hints: [
                'Площадь квадрата равна квадрату его стороны: 4 × 4 = 16.',
                'Чтобы найти площадь прямоугольника, умножь длину на ширину: 7 × 5 = 35.',
                'Умножь сторону на саму себя: 7 × 7 = 49.',
                'Произведение сторон даёт площадь: 14 × 5 = 70.',
                'Площадь квадрата: 12 × 12 = 144.',
                'Перемножь стороны: 15 × 8 = 120.',
                'Площадь квадрата — это 15 × 15 = 225.',
                'Найди произведение сторон: 30 × 15 = 450.',
                'Возведи 20 во вторую степень: 20 × 20 = 400.',
                'Перемножь стороны прямоугольника: 50 × 12 = 600.',
                'Объём куба вычисляется как a³: 2 × 2 × 2 = 8.',
                'Найди куб числа 4: 4 × 4 × 4 = 64.',
                'Перемножь длину, ширину и высоту: 2 × 8 × 15 = 240.',
                'Объём куба равен 5³ = 5 × 5 × 5 = 125.',
                'Умножь 8 на 5, а затем результат на 4: 40 × 4 = 160.',
                'Вычисли объём: 6 × 6 × 10 = 360.',
                'Возведи 8 в куб: 8 × 8 × 8 = 512.',
                'Вычисли произведение: 10 × 10 × 10 = 1000.',
                'Перемножь измерения фигуры: 15 × 10 × 8 = 1200.',
                'Перемножь измерения фигуры: 20 × 15 × 10 = 3000.'
            ],

            questions: [
            // Площади квадратов и прямоугольников
            ['Площадь квадрата со стороной 4 см. Ответ в см².', 16],
            ['Площадь прямоугольника со сторонами 7 см и 5 см. Ответ в см².', 35],
            ['Площадь квадрата со стороной 7 см. Ответ в см².', 49],
            ['Площадь прямоугольника со сторонами 14 см и 5 см. Ответ в см².', 70],
            ['Площадь квадрата со стороной 12 см. Ответ в см².', 144],
            ['Площадь прямоугольника со сторонами 15 см и 8 см. Ответ в см².', 120],
            ['Площадь квадрата со стороной 15 см. Ответ в см².', 225],
            ['Площадь прямоугольника со сторонами 30 см и 15 см. Ответ в см².', 450],
            ['Площадь квадрата со стороной 20 см. Ответ в см².', 400],
            ['Площадь прямоугольника со сторонами 50 см и 12 см. Ответ в см².', 600],

            // Объёмы кубов и параллелепипедов
            ['Объём куба с ребром 2 см. Ответ в см³.', 8],
            ['Объём куба с ребром 4 см. Ответ в см³.', 64],
            ['Объём параллелепипеда 2 × 8 × 15 см. Ответ в см³.', 240],
            ['Объём куба с ребром 5 см. Ответ в см³.', 125],
            ['Объём параллелепипеда 8 × 5 × 4 см. Ответ в см³.', 160],
            ['Объём параллелепипеда 6 × 6 × 10 см. Ответ в см³.', 360],
            ['Объём куба с ребром 8 см. Ответ в см³.', 512],
            ['Объём куба с ребром 10 см. Ответ в см³.', 1000],
            ['Объём параллелепипеда 15 × 10 × 8 см. Ответ в см³.', 1200],
            ['Объём параллелепипеда 20 × 15 × 10 см. Ответ в см³.', 3000]
            ]
        },
        rounding: {
            title: 'Округление десятичных дробей',
            hints: [
                'Посмотри на цифру после запятой: если она меньше 5, целая часть не меняется.',
                'Если первая цифра после запятой 5 или больше, увеличь целую часть на 1.',
                'Цифра десятых меньше 5 — оставь целую часть без изменений.',
                'При цифре десятых 5 или больше округли вверх.',
                'Чтобы округлить до десятых, оставь одну цифру после запятой и посмотри на следующую.',
                'Цифра сотых определяет округление до десятых.',
                'Для округления до десятых смотри на цифру сотых.',
                'Оставь десятые, затем проверь цифру сотых.',
                'Оставь две цифры после запятой; третья цифра меньше 5.',
                'Оставь сотые и посмотри на тысячные.',
                'При округлении 9,995 до сотых увеличивается разряд сотых; переноси единицу влево.',
                'Оставь две цифры после запятой, третья цифра меньше 5.',
                'Для округления до десятых смотри на цифру сотых: она меньше 5.',
                'Оставь сотые; тысячная цифра 6, поэтому округляй вверх.',
                'При округлении 508,995 до сотых учти перенос через разряд сотых и целую часть.'
            ],
            questions: [
                ['Округли 3,2 до целых.', 3],
                ['Округли 5,8 до целых.', 6],
                ['Округли 12,4 до целых.', 12],
                ['Округли 27,6 до целых.', 28],
                ['Округли 4,24 до десятых.', 4.2],
                ['Округли 6,27 до десятых.', 6.3],
                ['Округли 8,85 до десятых.', 8.9],
                ['Округли 13,46 до десятых.', 13.5],
                ['Округли 2,344 до сотых.', 2.34],
                ['Округли 5,678 до сотых.', 5.68],
                ['Округли 9,995 до сотых.', 10],
                ['Округли 17,284 до сотых.', 17.28],
                ['Округли 36,749 до десятых.', 36.7],
                ['Округли 124,956 до сотых.', 124.96],
                ['Округли 508,995 до сотых.', 509]
            ]
        },
        primes: {
            title: 'Найди простое число',
            hints: [
                'Простое число больше 1 и делится только на 1 и само на себя.',
                'Проверь делимость чисел на 2.',
                'Число, которое делится только на 1 и само на себя, простое.',
                'Проверь, какие из вариантов делятся на 2 или на 3.',
                'Чётные числа, кроме 2, не являются простыми.',
                'Проверь делимость вариантов на 2 и 3.',
                'Простое число не имеет делителей, кроме 1 и самого себя.',
                'Проверь делимость на 2, 3 и 5.',
                'У числа 21 есть делители 3 и 7; проверь соседние варианты.',
                'Проверь, делится ли число на 3 (сумма цифр) или на 5.',
                'Чётные числа больше 2 составные.',
                'Проверь нечётные варианты на делимость на 3, 5 и 7.',
                'Проверь, делятся ли варианты на 2, 3, 5 или 7.',
                'Сумма цифр составного варианта 51 делится на 3; проверь остальные.',
                'Проверь 97 на делимость простыми числами до его квадратного корня.'
            ],
            questions: [
                ['Какое число простое?', 2, [1, 2, 4, 6]],
                ['Какое число простое?', 3, [3, 4, 6, 8]],
                ['Какое число простое?', 5, [4, 5, 8, 9]],
                ['Какое число простое?', 7, [6, 7, 9, 10]],
                ['Какое число простое?', 11, [10, 11, 12, 14]],
                ['Какое число простое?', 13, [12, 13, 15, 16]],
                ['Какое число простое?', 17, [15, 16, 17, 18]],
                ['Какое число простое?', 19, [18, 19, 20, 21]],
                ['Какое число простое?', 23, [21, 22, 23, 24]],
                ['Какое число простое?', 29, [27, 28, 29, 30]],
                ['Какое число простое?', 31, [30, 31, 32, 33]],
                ['Какое число простое?', 37, [35, 36, 37, 38]],
                ['Какое число простое?', 43, [40, 42, 43, 45]],
                ['Какое число простое?', 53, [51, 52, 53, 55]],
                ['Какое число простое?', 97, [91, 93, 95, 97]]
            ]
        },
        fractions: {
            title: 'Обыкновенные и неправильные дроби',
            hints: [
                'Число над чертой дроби показывает количество взятых долей.',
                'Знаменатель — на сколько частей разделили (8), числитель — сколько взяли (3).',
                'Правильная дробь меньше 1: её числитель меньше знаменателя.',
                'Неправильная дробь больше или равна 1: её числитель больше или равен знаменателю.',
                'При одинаковых знаменателях сравниваем числители: 7 больше 4.',
                'При одинаковых числителях больше дробь с меньшим знаменателем (доли крупнее).',
                'Сложи числители: 2 + 5 = 7, знаменатель 9 остаётся без изменений.',
                'Вычти числители: 7 - 4 = 3, знаменатель 11 не меняется.',
                'Дробь равна единице, если числитель равен знаменателю.',
                'Представь 1 как 7/7 и вычти 3/7: (7 - 3)/7.',
                'Знаменатель 20 в 4 раза больше 5. Умножь числитель 3 на 4.',
                'Раздели числитель 18 и знаменатель 24 на 6.',
                'Раздели 17 на 5 с остатком: 17 : 5 = 3 (остаток 2).',
                'Умножь целую часть на знаменатель и прибавь числитель: 4 × 3 + 2 = 14.',
                'Приведи 1/2 к знаменателю 4 (это 2/4) и сложи: 2/4 + 1/4.',
                'Приведи 1/3 к знаменателю 6 (это 2/6): 5/6 - 2/6 = 3/6 = 1/2.',
                'Домножь числитель и знаменатель на 25: 75/100 = 0,75.',
                'Домножь числитель и знаменатель на 2: 4/10 = 0,4.',
                '0,6 = 6/10. Сократи числитель и знаменатель на 2.',
                'Раздели 40 на 5 и умножь на 3: (40 : 5) × 3 = 24.',
                'Раздели 18 на 2 и умножь на 3: (18 : 2) × 3 = 27.',
                'Умножь число 5 на числитель 2: 10/15. Затем сократи на 5.',
                'Перемножь числители (3 × 2 = 6) и знаменатели (4 × 5 = 20), сократи: 6/20 = 3/10.',
                'Деление замени умножением на перевёрнутую дробь: 3/7 × 5/2 = 15/14.',
                '1-й день: 120 : 3 = 40. 2-й день: 120 : 4 = 30. Осталось: 120 - (40 + 30) = 50.'
            ],
            questions: [
                ['В обыкновенной дроби число над чертой называется...', 'Числитель', ['Числитель', 'Знаменатель', 'Частное', 'Делитель']],
                ['Пирог разрезали на 8 равных кусков и съели 3. Какую часть пирога съели?', '3/8', ['3/8', '5/8', '3/5', '8/3']],
                ['Какая из этих дробей является правильной?', '5/7', ['5/7', '7/5', '9/9', '8/3']],
                ['Какая из этих дробей является неправильной?', '9/4', ['9/4', '3/8', '2/5', '1/6']],
                ['Какая дробь больше: 4/9 или 7/9?', '7/9', ['7/9', '4/9', 'Они равны', 'Нельзя сравнить']],
                ['Какая дробь больше: 3/5 или 3/8?', '3/5', ['3/5', '3/8', 'Они равны', 'Нельзя сравнить']],
                ['Вычисли: 2/9 + 5/9 = ?', '7/9', ['7/9', '7/18', '10/9', '3/9']],
                ['Вычисли: 7/11 - 4/11 = ?', '3/11', ['3/11', '3/0', '11/11', '4/11']],
                ['Какая из этих дробей равна числу 1?', '12/12', ['12/12', '1/12', '12/1', '13/12']],
                ['Вычисли: 1 - 3/7 = ?', '4/7', ['4/7', '2/7', '3/7', '7/4']],
                ['Найди пропущенное число: 3/5 = ?/20', '12', ['12', '15', '9', '16']],
                ['Сократи дробь 18/24 до несократимой:', '3/4', ['3/4', '9/12', '6/8', '2/3']],
                ['Выдели целую часть из неправильной дроби 17/5:', '3 целых 2/5', ['3 целых 2/5', '2 целых 7/5', '3 целых 1/5', '4 целых 2/5']],
                ['Запиши смешанное число 4 целых 2/3 в виде неправильной дроби:', '14/3', ['14/3', '10/3', '8/3', '12/3']],
                ['Вычисли сумму: 1/2 + 1/4 = ?', '3/4', ['3/4', '2/6', '2/4', '1/4']],
                ['Вычисли разность: 5/6 - 1/3 = ?', '1/2', ['1/2', '4/3', '4/6', '3/6']],
                ['Переведи обыкновенную дробь 3/4 в десятичную:', '0,75', ['0,75', '0,34', '0,43', '0,7']],
                ['Переведи обыкновенную дробь 2/5 в десятичную:', '0,4', ['0,4', '0,25', '0,2', '0,5']],
                ['Запиши десятичную дробь 0,6 в виде несократимой обыкновенной дроби:', '3/5', ['3/5', '6/10', '2/3', '1/6']],
                ['Найди 3/5 от числа 40:', '24', ['24', '15', '20', '30']],
                ['Найди число, если 2/3 его равны 18:', '27', ['27', '12', '36', '24']],
                ['Вычисли произведение: 5 × 2/15 = ?', '2/3', ['2/3', '10/75', '1/3', '5/3']],
                ['Вычисли произведение дробей: 3/4 × 2/5 = ?', '3/10', ['3/10', '6/20', '5/9', '6/9']],
                ['Вычисли частное: 3/7 ÷ 2/5 = ?', '15/14', ['15/14', '6/35', '14/15', '5/14']],
                ['В книге 120 стр. В 1-й день прочитано 1/3 книги, во 2-й день — 1/4. Сколько стр. осталось?', '50 страниц', ['50 страниц', '40 страниц', '60 страниц', '70 страниц']]
            ]
        }
    };

    const picker = document.getElementById('test-picker');
    const activeTest = document.getElementById('active-test');
    const testName = document.getElementById('test-name');
    const questionCount = document.getElementById('question-count');
    const questionLabel = document.getElementById('question-label');
    const questionTitle = document.getElementById('test-title');
    const progress = document.querySelector('.progress-track');
    const progressBar = document.getElementById('progress-bar');
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('exam-answer');
    const answerButton = document.getElementById('answer-button');
    const skipButton = document.getElementById('skip-button');
    const nextButton = document.getElementById('next-button');
    const choiceGrid = document.getElementById('choice-grid');
    const hintButton = document.getElementById('hint-button');
    const hintText = document.getElementById('hint-text');
    const feedback = document.getElementById('exam-feedback');
    const resultDialog = document.getElementById('result-dialog');
    const resultScore = document.getElementById('result-score');
    const resultRows = document.getElementById('result-rows');
    const retryButton = document.getElementById('retry-button');
    const pickerButton = document.getElementById('picker-button');

    let selectedTest;
    let selectedTestKey;
    let currentIndex = 0;
    let answers = [];
    let questionChecked = false;
    let questionStartedAt = 0;
    let hintTimeout;

    function renderQuestion() {
        const [prompt, , choices] = selectedTest.questions[currentIndex];
        clearTimeout(hintTimeout);
        questionStartedAt = performance.now();
        questionLabel.textContent = `ВОПРОС ${currentIndex + 1} ИЗ ${selectedTest.questions.length}`;
        questionCount.textContent = `${currentIndex + 1} / ${selectedTest.questions.length}`;
        questionTitle.textContent = prompt;
        progress.setAttribute('aria-valuenow', String(currentIndex));
        progressBar.style.width = `${(currentIndex / selectedTest.questions.length) * 100}%`;
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.classList.toggle('hidden', Boolean(choices));
        choiceGrid.classList.toggle('hidden', !choices);
        choiceGrid.replaceChildren();
        if (choices) {
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'choice-button';
                button.textContent = String(choice);
                button.addEventListener('click', () => saveAnswer(String(choice), choice));
                choiceGrid.appendChild(button);
            });
        }
        answerButton.classList.toggle('hidden', Boolean(choices));
        skipButton.classList.remove('hidden');
        nextButton.classList.add('hidden');
        feedback.textContent = '';
        hintText.textContent = '';
        hintText.classList.add('hidden');
        hintButton.disabled = true;
        hintButton.textContent = 'Подсказка доступна через 45 секунд';
        hintTimeout = setTimeout(() => {
            if (!questionChecked) {
                hintButton.disabled = false;
                hintButton.textContent = 'Показать подсказку';
            }
        }, 45000);
        questionChecked = false;
        answerInput.focus();
    }

    function startTest(testKey) {
        selectedTestKey = testKey;
        selectedTest = tests[testKey];
        currentIndex = 0;
        answers = [];
        testName.textContent = selectedTest.title;
        picker.classList.add('hidden');
        activeTest.classList.remove('hidden');
        renderQuestion();
    }

    function parseAnswer(value) {
        const normalized = value.trim().replace(',', '.');
        if (!normalized || !/^\d+(?:\.\d+)?$/.test(normalized)) return null;
        const number = Number(normalized);
        return Number.isFinite(number) ? number : null;
    }

    function checkAnswer(value) {
        if (questionChecked) return;
        const parsed = parseAnswer(value);
        if (parsed === null) {
            feedback.textContent = 'Введи число, чтобы проверить ответ, или пропусти вопрос.';
            answerInput.focus();
            return;
        }
        saveAnswer(value.trim(), parsed);
    }

    function saveAnswer(value, parsed) {
        const [, correctAnswer] = selectedTest.questions[currentIndex];
        const isCorrect = (parsed === correctAnswer) || (String(parsed).trim().replace(",", ".") === String(correctAnswer).trim().replace(",", "."));
        recordStudyAttempt(isCorrect);
        answers[currentIndex] = {
            value,
            correctAnswer,
            isCorrect,
            elapsedMs: performance.now() - questionStartedAt
        };
        questionChecked = true;
        clearTimeout(hintTimeout);
        hintButton.disabled = true;
        answerInput.disabled = true;
        choiceGrid.querySelectorAll('button').forEach(button => { button.disabled = true; });
        answerButton.classList.add('hidden');
        skipButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
        feedback.textContent = isCorrect
            ? 'Верно! Отличная работа. Нажми «Следующий вопрос».'
            : `Пока неверно. Правильный ответ: ${correctAnswer}. Нажми «Следующий вопрос».`;
        progress.setAttribute('aria-valuenow', String(currentIndex + 1));
        progressBar.style.width = `${((currentIndex + 1) / selectedTest.questions.length) * 100}%`;
    }

    function skipQuestion() {
        if (questionChecked) return;
        const [, correctAnswer] = selectedTest.questions[currentIndex];
        recordStudyAttempt(false);
        answers[currentIndex] = {
            value: '',
            correctAnswer,
            isCorrect: false,
            elapsedMs: performance.now() - questionStartedAt
        };
        questionChecked = true;
        clearTimeout(hintTimeout);
        hintButton.disabled = true;
        answerInput.disabled = true;
        choiceGrid.querySelectorAll('button').forEach(button => { button.disabled = true; });
        answerButton.classList.add('hidden');
        skipButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
        feedback.textContent = `Вопрос пропущен. Правильный ответ: ${correctAnswer}.`;
        progress.setAttribute('aria-valuenow', String(currentIndex + 1));
        progressBar.style.width = `${((currentIndex + 1) / selectedTest.questions.length) * 100}%`;
    }

    function showResults() {
        const correctCount = answers.filter(answer => answer.isCorrect).length;
        const score = Math.round((correctCount / selectedTest.questions.length) * 10);
        resultScore.textContent = `Правильно: ${correctCount} из ${selectedTest.questions.length} · Оценка: ${score} из 10`;
        resultRows.replaceChildren();

        selectedTest.questions.forEach(([prompt], index) => {
            const answer = answers[index];
            const row = document.createElement('tr');
            row.className = answer.isCorrect ? 'is-correct' : 'is-incorrect';
            const values = [
                String(index + 1),
                prompt,
                answer.value || 'Не отвечено',
                String(answer.correctAnswer),
                formatElapsedTime(answer.elapsedMs),
                answer.isCorrect ? 'Правильно' : 'Неправильно'
            ];
            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            resultRows.appendChild(row);
        });
        resultDialog.showModal();
    }

    function advanceQuestion() {
        if (currentIndex === selectedTest.questions.length - 1) {
            showResults();
            return;
        }
        currentIndex += 1;
        renderQuestion();
    }

    function formatElapsedTime(elapsedMs) {
        const totalTenths = Math.round(elapsedMs / 100);
        const minutes = Math.floor(totalTenths / 600);
        const seconds = ((totalTenths % 600) / 10).toFixed(1);
        return minutes > 0
            ? `${minutes} мин ${seconds} сек`
            : `${seconds} сек`;
    }

    function recordStudyAttempt(isCorrect) {
        const storageKey = 'studyMetrics';
        let attempts;
        try {
            const storedAttempts = localStorage.getItem(storageKey);
            attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
            if (!Array.isArray(attempts)) throw new TypeError('Ожидался список попыток.');
        } catch (error) {
            console.error('Не удалось прочитать статистику учебных задач.', error);
            return;
        }
        attempts.push({
            timestamp: new Date().toISOString(),
            subject: 'Математика',
            taskId: `math-test-${selectedTestKey}-question-${currentIndex + 1}`,
            skill: selectedTestKey === "fractions" ? "fractionsPercentages" : selectedTestKey,
            correct: isCorrect
        });
        try {
            localStorage.setItem(storageKey, JSON.stringify(attempts));
        } catch (error) {
            console.error('Не удалось сохранить статистику учебных задач.', error);
        }
    }

    document.querySelectorAll('[data-test]').forEach(button => {
        button.addEventListener('click', () => startTest(button.dataset.test));
    });
    answerForm.addEventListener('submit', event => {
        event.preventDefault();
        checkAnswer(answerInput.value);
    });
    skipButton.addEventListener('click', skipQuestion);
    hintButton.addEventListener('click', () => {
        if (questionChecked || hintButton.disabled) return;
        hintText.textContent = selectedTest.hints[currentIndex];
        hintText.classList.remove('hidden');
        hintButton.disabled = true;
        hintButton.textContent = 'Подсказка открыта';
    });
    nextButton.addEventListener('click', advanceQuestion);
    retryButton.addEventListener('click', () => {
        resultDialog.close();
        startTest(Object.keys(tests).find(key => tests[key] === selectedTest));
    });
    
    const exitTestButton = document.getElementById('exit-test-button');
    const confirmExitDialog = document.getElementById('confirm-exit-dialog');
    const confirmStayButton = document.getElementById('confirm-stay-button');
    const confirmExitButton = document.getElementById('confirm-exit-button');
    const headerBackLink = document.querySelector('.exam-back');
    let pendingExitUrl = null;

    function requestExitTest(redirectUrl) {
        pendingExitUrl = redirectUrl || null;
        if (confirmExitDialog) {
            confirmExitDialog.showModal();
        } else {
            if (confirm('Вы уверены, что хотите выйти? При выходе прогресс сбросится.')) {
                exitTestConfirmed();
            }
        }
    }

    function exitTestConfirmed() {
        if (confirmExitDialog && confirmExitDialog.open) {
            confirmExitDialog.close();
        }
        clearTimeout(hintTimeout);
        questionChecked = false;
        currentIndex = 0;
        answers = [];

        if (pendingExitUrl) {
            window.location.href = pendingExitUrl;
        } else {
            activeTest.classList.add('hidden');
            picker.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        pendingExitUrl = null;
    }

    if (exitTestButton) {
        exitTestButton.addEventListener('click', () => requestExitTest(null));
    }
    if (confirmStayButton) {
        confirmStayButton.addEventListener('click', () => {
            if (confirmExitDialog) confirmExitDialog.close();
            pendingExitUrl = null;
        });
    }
    if (confirmExitButton) {
        confirmExitButton.addEventListener('click', exitTestConfirmed);
    }
    if (headerBackLink) {
        headerBackLink.addEventListener('click', (e) => {
            if (activeTest && !activeTest.classList.contains('hidden')) {
                e.preventDefault();
                requestExitTest(headerBackLink.href);
            }
        });
    }

    const headerBrandLink = document.querySelector('.exam-brand');
    if (headerBrandLink) {
        headerBrandLink.addEventListener('click', (e) => {
            if (activeTest && !activeTest.classList.contains('hidden')) {
                e.preventDefault();
                requestExitTest(headerBrandLink.href);
            }
        });
    }

    if (confirmExitDialog) {
        confirmExitDialog.addEventListener('cancel', () => {
            pendingExitUrl = null;
        });
    }

    pickerButton.addEventListener('click', () => {
        resultDialog.close();
        activeTest.classList.add('hidden');
        picker.classList.remove('hidden');
    });
});
