document.addEventListener('DOMContentLoaded', () => {
    const num1Element = document.getElementById('num1');
    const num2Element = document.getElementById('num2');
    const answerInput = document.getElementById('trainer-answer-input');
    const checkButton = document.getElementById('trainer-check-button');
    const feedbackElement = document.getElementById('trainer-feedback');

    let correctAnswer;

    function generateProblem() {
        // 50% — однозначное × однозначное, 50% — однозначное × двузначное
        const useTwoDigit = Math.random() < 0.5;
        let num1, num2;

        if (useTwoDigit) {
            num1 = Math.floor(Math.random() * 9) + 1;           // 1–9
            num2 = Math.floor(Math.random() * 90) + 10;         // 10–99
        } else {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
        }

        correctAnswer = num1 * num2;

        num1Element.textContent = num1;
        num2Element.textContent = num2;

        answerInput.value = '';
        feedbackElement.textContent = '';
        answerInput.classList.remove('correct', 'incorrect');
        checkButton.disabled = false;
        answerInput.focus();
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value, 10);
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';

        if (isNaN(userAnswer)) {
            feedbackElement.textContent = 'Нужно ввести число!';
            feedbackElement.style.color = '#FFcc00';
            answerInput.classList.add('incorrect');
            return;
        }

        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'Правильно! Молодец!';
            feedbackElement.style.color = '#7FFF7F';
            answerInput.classList.add('correct');
            checkButton.disabled = true;
            setTimeout(() => generateProblem(), 1500);
        } else {
            feedbackElement.textContent = 'Неправильно, попробуй еще раз!';
            feedbackElement.style.color = '#FF7F7F';
            answerInput.classList.add('incorrect');
            answerInput.focus();
            answerInput.select();
        }
    }

    checkButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            checkAnswer();
        }
    });
    answerInput.addEventListener('input', () => {
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';
    });

    generateProblem();
});
