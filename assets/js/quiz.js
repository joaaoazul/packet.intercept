let questions = [];
let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');

function updateScore() {
  scoreEl.textContent = `Pontuação: ${score}`;
}

function shuffleOptions(question) {
  // Cria um array de objetos com o texto da opção e se é correta ou não
  const optionsWithFlag = question.options.map((option, index) => ({
    text: option,
    isCorrect: index === question.correct
  }));
  // Embaralha o array (Fisher-Yates)
  for (let i = optionsWithFlag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithFlag[i], optionsWithFlag[j]] = [optionsWithFlag[j], optionsWithFlag[i]];
  }
  return optionsWithFlag;
}

function loadQuestion() {
  feedbackEl.style.display = 'none';
  nextBtn.style.display = 'none';
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  // Embaralha as opções
  const shuffledOptions = shuffleOptions(q);
  optionsEl.innerHTML = '';
  shuffledOptions.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.addEventListener('click', () => checkAnswer(option.isCorrect, btn));
    optionsEl.appendChild(btn);
  });
  updateScore();
}

function checkAnswer(isCorrect, btn) {
  feedbackEl.style.display = 'block';
  disableOptions();
  if (isCorrect) {
    feedbackEl.textContent = "Correto!";
    feedbackEl.style.color = "green";
    score++;
  } else {
    const q = questions[currentQuestion];
    feedbackEl.textContent = "Incorreto. " + q.explanation;
    feedbackEl.style.color = "red";
  }
  updateScore();
  nextBtn.style.display = 'block';
}

function disableOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => btn.disabled = true);
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    feedbackEl.textContent = `Quiz concluído! Sua pontuação final: ${score} de ${questions.length}`;
    feedbackEl.style.color = "blue";
    nextBtn.style.display = 'none';
  }
});

// Carrega as perguntas do arquivo JSON
fetch('assets/data/questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    questions = questions.slice(0, 30);
    loadQuestion();
  })
  .catch(error => console.error('Erro ao carregar as perguntas:', error));
