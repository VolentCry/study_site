document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-button');
    const answerInput = document.getElementById('answer-input');
    const numeratorInput = document.getElementById('numerator-input');
    const denominatorInput = document.getElementById('denominator-input');
    const feedbackMessage = document.getElementById('feedback-message'); // Используем отдельный элемент для сообщения
    const taskBody = document.body;
    const prevButton = document.getElementById('prev-task-button');
    const nextButton = document.getElementById('next-task-button');

    // Получаем номер задачи и правильный ответ из data-атрибутов body
    const taskId = parseInt(taskBody.dataset.taskId, 10);
    // Теперь получаем correctAnswer как строку, так как ожидаем текстовый ответ
    const correctAnswer = taskBody.dataset.correctAnswer; 

    // --- Логика проверки ответа ---
    if (checkButton) {
        checkButton.addEventListener('click', () => {
            // Сбрасываем предыдущие классы и сообщение
            feedbackMessage.textContent = '';
            feedbackMessage.style.color = '';

            const highlightIncorrect = () => {
                if (answerInput) answerInput.classList.add('incorrect');
                if (numeratorInput) numeratorInput.classList.add('incorrect');
                if (denominatorInput) denominatorInput.classList.add('incorrect');
            };
            const clearHighlights = () => {
                if (answerInput) answerInput.classList.remove('correct', 'incorrect');
                if (numeratorInput) numeratorInput.classList.remove('correct', 'incorrect');
                if (denominatorInput) denominatorInput.classList.remove('correct', 'incorrect');
            };

            clearHighlights();

            // Если есть поля дроби, используем их
            const hasFractionInputs = !!(numeratorInput && denominatorInput);
            if (hasFractionInputs) {
                const numStr = (numeratorInput.value || '').trim();
                const denStr = (denominatorInput.value || '').trim();

                if (numStr === '' || denStr === '') {
                    feedbackMessage.textContent = 'Пожалуйста, заполни числитель и знаменатель!';
                    highlightIncorrect();
                    return;
                }

                const num = Number(numStr);
                const den = Number(denStr);
                if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
                    feedbackMessage.textContent = 'Проверь корректность дроби (знаменатель не ноль).';
                    highlightIncorrect();
                    return;
                }

                const parseFraction = (s) => {
                    const parts = (s || '').trim().split('/');
                    if (parts.length !== 2) return null;
                    const a = Number(parts[0]);
                    const b = Number(parts[1]);
                    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
                    return { a, b };
                };

                const gcd = (a, b) => {
                    a = Math.abs(a); b = Math.abs(b);
                    while (b !== 0) { const t = b; b = a % b; a = t; }
                    return a || 1;
                };

                const correctFrac = parseFraction(correctAnswer);
                if (!correctFrac) {
                    // Если правильный ответ не дробь, сравним по значению
                    const correctNumeric = Number((correctAnswer || '').replace(',', '.'));
                    const userValue = num / den;
                    const isOk = Number.isFinite(correctNumeric)
                        ? Math.abs(userValue - correctNumeric) < 1e-9
                        : `${num}/${den}`.toLowerCase() === (correctAnswer || '').toLowerCase();
                    if (isOk) {
                        if (numeratorInput) numeratorInput.classList.add('correct');
                        if (denominatorInput) denominatorInput.classList.add('correct');
                        feedbackMessage.textContent = 'Всё правильно! Ты молодец!';
                        feedbackMessage.style.color = 'green';
                    } else {
                        highlightIncorrect();
                        feedbackMessage.textContent = 'Ответ неправильный :( Попробуй ещё раз!';
                        feedbackMessage.style.color = 'red';
                    }
                    return;
                }

                // Сравниваем дроби по приведению к несократимому виду
                const g1 = gcd(num, den);
                const rn = num / g1;
                const rd = den / g1;
                const g2 = gcd(correctFrac.a, correctFrac.b);
                const cn = correctFrac.a / g2;
                const cd = correctFrac.b / g2;

                if (rn === cn && rd === cd) {
                    if (numeratorInput) numeratorInput.classList.add('correct');
                    if (denominatorInput) denominatorInput.classList.add('correct');
                    feedbackMessage.textContent = 'Всё правильно! Ты молодец!';
                    feedbackMessage.style.color = 'green';
                } else {
                    highlightIncorrect();
                    feedbackMessage.textContent = 'Ответ неправильный :( Попробуй ещё раз!';
                    feedbackMessage.style.color = 'red';
                }
                return;
            }

            // Иначе используем одиночное поле ответа (текст/число)
            if (answerInput) {
                const userAnswer = answerInput.value.trim();

                answerInput.classList.remove('correct', 'incorrect');
                answerInput.placeholder = "Введи ответ текстом";

                if (userAnswer === '') {
                    feedbackMessage.textContent = "Пожалуйста, введи ответ!";
                    answerInput.classList.add('incorrect');
                    return;
                }

                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    answerInput.classList.add('correct');
                    feedbackMessage.textContent = 'Всё правильно! Ты молодец!';
                    feedbackMessage.style.color = 'green';
                } else {
                    answerInput.classList.add('incorrect');
                    feedbackMessage.textContent = 'Ответ неправильный :( Попробуй ещё раз!';
                    feedbackMessage.style.color = 'red';
                }
            }
        });

        // Очищать стиль при вводе нового значения
        if (answerInput) {
            answerInput.addEventListener('input', () => {
                answerInput.classList.remove('correct', 'incorrect');
                feedbackMessage.textContent = '';
            });
        }
        if (numeratorInput) {
            numeratorInput.addEventListener('input', () => {
                numeratorInput.classList.remove('correct', 'incorrect');
                if (denominatorInput) denominatorInput.classList.remove('correct', 'incorrect');
                feedbackMessage.textContent = '';
            });
        }
        if (denominatorInput) {
            denominatorInput.addEventListener('input', () => {
                denominatorInput.classList.remove('correct', 'incorrect');
                if (numeratorInput) numeratorInput.classList.remove('correct', 'incorrect');
                feedbackMessage.textContent = '';
            });
        }
    }
    // --- Логика доступности кнопок навигации ---
    if (prevButton) {
        if (taskId === 1) {
            prevButton.classList.add('disabled');
            prevButton.removeAttribute('href'); // Убираем ссылку
        } else {
            prevButton.href = `task${taskId - 1}.html`;
        }
    }

    if (nextButton) {
        if (taskId === 37) { // Предполагается, что 37 - это последняя задача
            nextButton.classList.add('disabled');
            nextButton.removeAttribute('href'); // Убираем ссылку
        } else {
            nextButton.href = `task${taskId + 1}.html`;
        }
    }

    // --- Логика анимаций (загрузка нужной анимации) ---
    // Это может быть реализовано по-разному.
    // Простейший вариант: иметь готовые GIF-файлы и в HTML каждой страницы задачи
    // вставлять соответствующий img src, как показано в примере task1.html.

    // Более сложный вариант (если анимации управляются JS):
    // const animationContainer = document.getElementById('animation-container');
    // switch (taskId) {
    //     case 1:
    //         // Код для запуска анимации задачи 1
    //         // Например, добавление класса CSS анимации или создание объекта Canvas
    //         loadTask1Animation(animationContainer);
    //         break;
    //     case 2:
    //         // Код для запуска анимации задачи 2
    //         loadTask2Animation(animationContainer);
    //         break;
    //     // ... и так далее для всех 10 задач
    // }
    });

    // Пример функции для загрузки анимации (если используется JS)
    // function loadTask1Animation(container) {
    //     // Логика создания и отображения анимации 1
    //     container.innerHTML = '<img src="assets/animations/task1_alex_placing_block.gif" alt="Алекс строит забор">';
    // }
    // function loadTask2Animation(container) {
    //    // Логика создания и отображения анимации 2
    //     container.innerHTML = '<img src="assets/animations/task2_steve_placing_cobble.gif" alt="Стив кладет булыжник">';
    // }