document.addEventListener('DOMContentLoaded', () => {
    const num1Element = document.getElementById('num1');
    const num2Element = document.getElementById('num2');
    const answerInput = document.getElementById('trainer-answer-input');
    const checkButton = document.getElementById('trainer-check-button');
    const feedbackElement = document.getElementById('trainer-feedback');

    let correctAnswer; // Переменная для хранения правильного ответа

    // Функция генерации нового примера
    function generateProblem() {
        const num1 = Math.floor(Math.random() * 9) + 1; // Число от 1 до 9
        const num2 = Math.floor(Math.random() * 9) + 1; // Число от 1 до 9

        correctAnswer = num1 * num2; // Вычисляем правильный ответ

        num1Element.textContent = num1; // Отображаем первое число
        num2Element.textContent = num2; // Отображаем второе число

        // Очищаем поле ввода и обратную связь
        answerInput.value = '';
        feedbackElement.textContent = '';
        answerInput.classList.remove('correct', 'incorrect');
        checkButton.disabled = false; // Активируем кнопку, если была деактивирована

        answerInput.focus(); // Ставим фокус на поле ввода для удобства
    }

    // Функция проверки ответа
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value, 10);

        // Убираем предыдущие стили и сообщение
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';

        // Проверка, введено ли число
        if (isNaN(userAnswer)) {
            feedbackElement.textContent = "Нужно ввести число!";
            feedbackElement.style.color = '#FFcc00'; // Желтый для предупреждения
            answerInput.classList.add('incorrect'); // Подсветим красным
            return; // Выходим из функции
        }

        // Сравнение ответа
        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = "Правильно! Молодец!";
            feedbackElement.style.color = '#7FFF7F'; // Зеленый цвет
            answerInput.classList.add('correct');
            checkButton.disabled = true; // Блокируем кнопку на время

            // Ждем пару секунд и генерируем новый пример
            setTimeout(() => {
                generateProblem(); // Генерируем новый пример
            }, 1500); // Задержка 1.5 секунды (1500 миллисекунд)

            // Можно добавить звук успеха
            // playSound('correct');

        } else {
            feedbackElement.textContent = "Неправильно, попробуй еще раз!";
            feedbackElement.style.color = '#FF7F7F'; // Красный цвет
            answerInput.classList.add('incorrect');
            answerInput.focus(); // Возвращаем фокус на поле ввода
            answerInput.select(); // Выделяем неправильный ответ для удобства исправления

             // Можно добавить звук ошибки
             // playSound('incorrect');
        }
    }

    // --- Обработчики событий ---

    // Нажатие на кнопку "Проверить"
    checkButton.addEventListener('click', checkAnswer);
    // Нажатие Enter в поле ввода
    answerInput.addEventListener('keypress', (event) => {
        // Код клавиши Enter = 13
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault(); // Предотвращаем стандартное поведение (если есть, например, отправка формы)
            checkAnswer(); // Вызываем нашу функцию проверки
        }
    });

     // Очистка стиля при начале ввода нового значения
     answerInput.addEventListener('input', () => {
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';
     });


    // --- Начальная загрузка ---
    generateProblem(); // Генерируем первый пример при загрузке страницы

});

/* // Опционально: функция для проигрывания звуков
function playSound(type) {
    // Нужен элемент <audio id="correct-sound" src="..."></audio> и <audio id="incorrect-sound" src="..."></audio> в HTML
    try {
        const sound = document.getElementById(type + '-sound');
        if (sound) {
            sound.currentTime = 0; // Сбросить на начало, если звук еще играет
            sound.play();
        }
    } catch (e) {
        console.error("Не удалось воспроизвести звук:", e);
    }
}
*/