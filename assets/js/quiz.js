let questions = [];
let currentQuestion = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

function loadQuestion() {
  feedbackEl.style.display = 'none';
  nextBtn.style.display = 'none';
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => checkAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function disableOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => btn.disabled = true);
}

function checkAnswer(selected) {
  const q = questions[currentQuestion];
  feedbackEl.style.display = 'block';
  disableOptions();
  if (selected === q.correct) {
    feedbackEl.textContent = "Correto!";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = "Incorreto. " + q.explanation;
    feedbackEl.style.color = "red";
  }
  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    feedbackEl.textContent = "Quiz concluído!";
    feedbackEl.style.color = "blue";
    nextBtn.style.display = 'none';
  }
});

// Carrega as perguntas do arquivo JSON
fetch('assets/data/questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadQuestion();
  })
  .catch(error => console.error('Erro ao carregar as perguntas:', error));
