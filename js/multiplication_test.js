javascript
document.addEventListener('DOMContentLoaded', () => {
    const problemsContainer = document.getElementById('test-problems-container');
    const checkButton = document.getElementById('check-test-button');
    const resultsContainer = document.getElementById('test-results-container');
    const resultsSummary = document.getElementById('results-summary');
    const backToMenuButton = document.getElementById('back-to-menu-button');

    const numberOfProblems = 20;
    const generatedProblems = []; // Массив для хранения данных о примерах

    // Функция генерации примеров и их отображения
    function generateTestProblems() {
        problemsContainer.innerHTML = ''; // Очищаем контейнер перед генерацией
        generatedProblems.length = 0; // Очищаем массив данных

        for (let i = 0; i < numberOfProblems; i++) {
            const num1 = Math.floor(Math.random() * 9) + 1; // Число от 1 до 9
            const num2 = Math.floor(Math.random() * 9) + 1; // Число от 1 до 9
            const correctAnswer = num1 * num2;
            const inputId = `test-answer-${i}`;
            const iconId = `result-icon-${i}`;

            // Сохраняем данные о примере
            generatedProblems.push({ num1, num2, correctAnswer, inputId, iconId });

            // Создаем HTML для одного примера
            const problemElement = document.createElement('div');
            problemElement.classList.add('problem-item');
            problemElement.innerHTML = `
                <span>${num1}</span>
                <span>&times;</span> <span>${num2}</span>
                <span>=</span>
                <input type="number" id="${inputId}" data-index="${i}">
                <span class="result-icon" id="${iconId}"></span>
            `;
            problemsContainer.appendChild(problemElement);
        }
    }

    // Функция проверки всех ответов
    function checkTestResults() {
        let correctCount = 0;
        let incorrectCount = 0;

        generatedProblems.forEach((problem, index) => {
            const inputElement = document.getElementById(problem.inputId);
            const iconElement = document.getElementById(problem.iconId);
            let userAnswer = null;
// Пытаемся получить и преобразовать ответ пользователя
            if (inputElement.value !== '') {
                 userAnswer = parseInt(inputElement.value, 10);
            }

            // Делаем поле только для чтения после проверки
            inputElement.readOnly = true;

            // Сравниваем ответ
            if (userAnswer === problem.correctAnswer) {
                correctCount++;
                inputElement.classList.add('correct');
                iconElement.textContent = '✔️'; // Галочка
                iconElement.classList.add('correct');
                iconElement.classList.remove('incorrect');
            } else {
                incorrectCount++;
                inputElement.classList.add('incorrect');
                iconElement.textContent = '❌'; // Крестик
                iconElement.classList.add('incorrect');
                 iconElement.classList.remove('correct');
                // Можно показать правильный ответ в title или рядом
                inputElement.title = `Правильный ответ: ${problem.correctAnswer}`;
            }
        });

        // Показываем статистику
        resultsSummary.textContent = `Правильно: ${correctCount}, Неправильно: ${incorrectCount}`;
        resultsContainer.style.display = 'block'; // Показываем блок результатов

        // Скрываем кнопку "Проверить" и показываем кнопку "Выход"
        checkButton.style.display = 'none';
        backToMenuButton.style.display = 'inline-block'; // Показываем кнопку выхода
    }

    // --- Инициализация страницы ---

    // Генерируем примеры при загрузке
    generateTestProblems();

    // Назначаем обработчик на кнопку "Проверить ответы"
    checkButton.addEventListener('click', checkTestResults);

    // Кнопка "Выход на главное меню" уже является ссылкой <a>,
    // поэтому ей не нужен JS обработчик для перехода.

});