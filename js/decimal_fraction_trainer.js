document.addEventListener('DOMContentLoaded', () => {
    const num1El = document.getElementById('num1');
    const opEl = document.getElementById('operator');
    const num2El = document.getElementById('num2');
    const answerInput = document.getElementById('trainer-answer-input');
    const checkButton = document.getElementById('trainer-check-button');
    const feedbackElement = document.getElementById('trainer-feedback');

    let correctAnswer;

    // Генерация десятичной дроби: 1–2 знака после запятой (напр. 1.2, 3.45)
    function randomDecimal() {
        const whole = Math.floor(Math.random() * 9) + 1;
        const decimals = Math.floor(Math.random() * 100);
        return Math.round((whole + decimals / 100) * 100) / 100;
    }

    function randomInt() {
        return Math.floor(Math.random() * 9) + 1;
    }

    function generateProblem() {
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        let num1, num2;
        // Случайно: дробь×дробь, дробь×целое, дробь+дробь и т.д.
        const useInt = Math.random() < 0.3;  // 30% — второе число целое

        num1 = randomDecimal();
        num2 = useInt ? randomInt() : randomDecimal();

        if (op === '+') correctAnswer = num1 + num2;
        else if (op === '-') correctAnswer = num1 - num2;
        else correctAnswer = num1 * num2;

        correctAnswer = Math.round(correctAnswer * 100) / 100;

        num1El.textContent = formatNum(num1);
        opEl.textContent = op === '×' ? '×' : op;
        num2El.textContent = formatNum(num2);

        answerInput.value = '';
        feedbackElement.textContent = '';
        answerInput.classList.remove('correct', 'incorrect');
        checkButton.disabled = false;
        answerInput.focus();
    }

    function formatNum(n) {
        return n % 1 === 0 ? n.toString() : n.toFixed(2).replace('.', ',');
    }

    function checkAnswer() {
        const raw = answerInput.value.trim().replace(',', '.');
        const userAnswer = parseFloat(raw);
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';

        if (raw === '' || isNaN(userAnswer)) {
            feedbackElement.textContent = 'Нужно ввести число!';
            feedbackElement.style.color = '#FFcc00';
            answerInput.classList.add('incorrect');
            return;
        }

        const rounded = Math.round(userAnswer * 100) / 100;
        const isCorrect = Math.abs(rounded - correctAnswer) < 0.001;

        if (isCorrect) {
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
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            checkAnswer();
        }
    });
    answerInput.addEventListener('input', () => {
        answerInput.classList.remove('correct', 'incorrect');
        feedbackElement.textContent = '';
    });

    generateProblem();
});
