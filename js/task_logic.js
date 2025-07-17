document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-button');
    const answerInput = document.getElementById('answer-input');
    const feedbackMessage = document.getElementById('feedback-message'); // Используем отдельный элемент для сообщения
    const taskBody = document.body;
    const prevButton = document.getElementById('prev-task-button');
    const nextButton = document.getElementById('next-task-button');

    // Получаем номер задачи и правильный ответ из data-атрибутов body
    const taskId = parseInt(taskBody.dataset.taskId, 10);
    // Теперь получаем correctAnswer как строку, так как ожидаем текстовый ответ
    const correctAnswer = taskBody.dataset.correctAnswer; 

    // --- Логика проверки ответа ---
    if (checkButton && answerInput) {
        checkButton.addEventListener('click', () => {
            // Получаем ответ пользователя как строку
            const userAnswer = answerInput.value.trim(); // Удаляем пробелы по краям

            // Сбрасываем предыдущие классы и сообщение
            answerInput.classList.remove('correct', 'incorrect');
            feedbackMessage.textContent = '';
            answerInput.placeholder = "Введи ответ текстом"; // Восстанавливаем плейсхолдер

            if (userAnswer === '') { // Проверяем, если поле пустое
                 feedbackMessage.textContent = "Пожалуйста, введи ответ!";
                 answerInput.classList.add('incorrect'); // Подсвечиваем как ошибку
                 // Можно добавить звук ошибки
                 return;
            }

            // Сравниваем текстовые ответы
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) { // Сравниваем без учета регистра
                answerInput.classList.add('correct');
                feedbackMessage.textContent = 'Всё правильно! Ты молодец!';
                feedbackMessage.style.color = 'green';
                 // Можно добавить звук успеха
            } else {
                answerInput.classList.add('incorrect');
                feedbackMessage.textContent = 'Ответ неправильный :( Попробуй ещё раз!';
                 feedbackMessage.style.color = 'red';
                // Можно добавить звук ошибки
            }
        });

        // Очищать стиль при вводе нового значения
         answerInput.addEventListener('input', () => {
             answerInput.classList.remove('correct', 'incorrect');
             feedbackMessage.textContent = '';
         });
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