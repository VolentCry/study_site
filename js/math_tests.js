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
                'Площадь квадрата равна стороне, умноженной на саму себя.',
                'Площадь прямоугольника: длина × ширина.',
                'Возведи длину стороны квадрата в квадрат.',
                'Умножь длину прямоугольника на его ширину.',
                'Для площади прямоугольника перемножь две стороны.',
                'Площадь квадрата — это 11 × 11.',
                'Перемножь длину и ширину прямоугольника.',
                'Объём куба равен ребро × ребро × ребро.',
                'Объём параллелепипеда: длина × ширина × высота.',
                'Последовательно перемножь три измерения.',
                'Умножь ребро куба само на себя три раза.',
                'Перемножь 7, 8 и 9.',
                'Найди куб числа 9.',
                'Перемножь длину, ширину и высоту.',
                'Умножь три измерения параллелепипеда.'
            ],
            questions: [
                ['Площадь квадрата со стороной 2 см. Ответ в см².', 4],
                ['Площадь прямоугольника со сторонами 3 см и 4 см. Ответ в см².', 12],
                ['Площадь квадрата со стороной 5 см. Ответ в см².', 25],
                ['Площадь прямоугольника со сторонами 8 см и 6 см. Ответ в см².', 48],
                ['Площадь прямоугольника со сторонами 12 см и 9 см. Ответ в см².', 108],
                ['Площадь квадрата со стороной 11 см. Ответ в см².', 121],
                ['Площадь прямоугольника со сторонами 25 см и 16 см. Ответ в см².', 400],
                ['Объём куба с ребром 3 см. Ответ в см³.', 27],
                ['Объём параллелепипеда 3 × 4 × 5 см. Ответ в см³.', 60],
                ['Объём параллелепипеда 4 × 5 × 6 см. Ответ в см³.', 120],
                ['Объём куба с ребром 6 см. Ответ в см³.', 216],
                ['Объём параллелепипеда 7 × 8 × 9 см. Ответ в см³.', 504],
                ['Объём куба с ребром 9 см. Ответ в см³.', 729],
                ['Объём параллелепипеда 12 × 10 × 9 см. Ответ в см³.', 1080],
                ['Объём параллелепипеда 16 × 12 × 9 см. Ответ в см³.', 1728]
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
        const isCorrect = parsed === correctAnswer;
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
            skill: selectedTestKey,
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
    pickerButton.addEventListener('click', () => {
        resultDialog.close();
        activeTest.classList.add('hidden');
        picker.classList.remove('hidden');
    });
});
