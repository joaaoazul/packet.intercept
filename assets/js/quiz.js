let allQuestions = [];
let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let progress = [];

// Tempo limite (em segundos) para o quiz – 5 minutos = 300s neste exemplo
const TIME_LIMIT = 300;
let timeRemaining = TIME_LIMIT;
let timerInterval;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const groupFilterEl = document.getElementById('categoryFilter');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizArea = document.getElementById('quizArea');
const quizContent = document.getElementById('quizContent'); // Container interativo
const quizControls = document.getElementById('quizControls'); // Container para controles (botão reiniciar)
const timerEl = document.getElementById('timer');

function updateScore() {
  scoreEl.textContent = `Pontuação: ${score}`;
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  timerEl.textContent = `Tempo restante: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      finishQuiz("Tempo esgotado!");
    }
  }, 1000);
}

// Função para embaralhar as opções de uma questão
function shuffleOptions(q) {
  let options = q.options.map((option, index) => ({
    text: option,
    isCorrect: index === q.correct
  }));
  // Algoritmo Fisher-Yates para embaralhar
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

function loadQuestion() {
  feedbackEl.style.display = 'none';
  nextBtn.style.display = 'none';
  const q = filteredQuestions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  
  const shuffledOptions = shuffleOptions(q);
  // Cria os botões para cada opção e passa o objeto da opção e a posição escolhida
  shuffledOptions.forEach((optionObj, index) => {
    const btn = document.createElement('button');
    btn.textContent = optionObj.text;
    btn.addEventListener('click', () => checkAnswer(optionObj, index, shuffledOptions));
    optionsEl.appendChild(btn);
  });
  updateScore();
}

function disableOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => btn.disabled = true);
}

function checkAnswer(selectedOption, chosenIndex, shuffledOptions) {
  const q = filteredQuestions[currentQuestion];
  feedbackEl.style.display = 'block';
  disableOptions();
  
  // Determina o índice da opção correta no array embaralhado
  const correctIndex = shuffledOptions.findIndex(opt => opt.isCorrect);
  const isCorrect = selectedOption.isCorrect;
  
  if (isCorrect) {
    feedbackEl.textContent = "Correto! " + q.explanation;
    feedbackEl.style.color = "green";
    score++;
  } else {
    feedbackEl.textContent = "Incorreto. " + q.explanation;
    feedbackEl.style.color = "red";
  }
  
  // Armazena os detalhes da questão no progresso
  progress.push({
    question: q.question,
    options: shuffledOptions.map(opt => opt.text),
    chosenIndex: chosenIndex,
    correctIndex: correctIndex,
    isCorrect: isCorrect,
    explanation: q.explanation,
    group: q.group || "Geral",
    difficulty: q.difficulty
  });
  
  updateScore();
  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < filteredQuestions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    finishQuiz("Quiz concluído!");
  }
});

function finishQuiz(message) {
  // Bloqueia apenas o conteúdo interativo, mas mantém os controles ativos
  quizContent.style.pointerEvents = 'none';
  quizContent.style.opacity = '0.6';
  feedbackEl.style.display = 'block';
  feedbackEl.textContent = `${message} Sua pontuação final: ${score} de ${filteredQuestions.length}`;
  feedbackEl.style.color = "blue";
  nextBtn.style.display = 'none';
  displayProgressSummary();
  addRestartButton();
}

function displayProgressSummary() {
  let summaryDiv = document.createElement('div');
  summaryDiv.id = 'progressSummary';
  summaryDiv.innerHTML = "<h2>Resumo do Quiz</h2>";
  
  progress.forEach((item, index) => {
    let p = document.createElement('p');
    p.innerHTML = `<strong>Q${index + 1}:</strong> ${item.question}<br>`;
    item.options.forEach((option, i) => {
      let marker = "";
      if (i === item.correctIndex) marker += " (CORRETA)";
      if (i === item.chosenIndex) marker += " (Sua resposta)";
      p.innerHTML += `${i + 1}. ${option}${marker}<br>`;
    });
    p.innerHTML += `<em>Explicação:</em> ${item.explanation}<br><br>`;
    summaryDiv.appendChild(p);
  });
  quizArea.appendChild(summaryDiv);
  localStorage.setItem('quizProgress', JSON.stringify(progress));
}

function addRestartButton() {
  let restartBtn = document.createElement('button');
  restartBtn.textContent = "Reiniciar Quiz";
  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });
  quizControls.appendChild(restartBtn);
}

function populateGroupFilter() {
  // Extrai os grupos únicos; se não houver, usa "Geral"
  const groupsSet = new Set();
  allQuestions.forEach(q => {
    groupsSet.add(q.group || "Geral");
  });
  let groupsArray = Array.from(groupsSet);
  let numericGroups = groupsArray.filter(g => !isNaN(parseInt(g)));
  numericGroups.sort((a, b) => parseInt(a) - parseInt(b));
  let nonNumericGroups = groupsArray.filter(g => isNaN(parseInt(g)));
  nonNumericGroups.sort();
  const sortedGroups = numericGroups.concat(nonNumericGroups);
  
  // Adiciona a opção "Todos os Grupos"
  const allOption = document.createElement('option');
  allOption.value = "all";
  allOption.textContent = "Todos os Grupos";
  groupFilterEl.appendChild(allOption);
  
  // Mapeamento dos títulos para cada grupo
  const groupTitles = {
    "1": "Princípios de Segurança",
    "2": "Continuidade e DR",
    "3": "Controle de Acesso",
    "4": "Segurança de Redes",
    "5": "Operações de Segurança",
    "Geral": "Geral"
  };
  
  sortedGroups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    if (groupTitles[group]) {
      option.textContent = "Grupo " + group + ": " + groupTitles[group];
    } else {
      option.textContent = "Grupo " + group;
    }
    groupFilterEl.appendChild(option);
  });
}

// Garante que haja sempre 30 perguntas; se o conjunto filtrado for menor, complementa com outras (sem duplicatas)
function ensureThirtyQuestions(questionsArray) {
  if (questionsArray.length >= 30) {
    return questionsArray.slice(0, 30);
  } else {
    let extraQuestions = [];
    const alreadyIncluded = new Set(questionsArray.map(q => q.question));
    let remaining = allQuestions.filter(q => !alreadyIncluded.has(q.question));
    // Embaralha o array restante
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    extraQuestions = remaining.slice(0, 30 - questionsArray.length);
    return questionsArray.concat(extraQuestions);
  }
}

// Ao clicar em "Iniciar Quiz", filtra as questões por grupo, garante 30 questões e inicia o quiz
startQuizBtn.addEventListener('click', () => {
  const selectedGroup = groupFilterEl.value;
  if (selectedGroup === "all") {
    filteredQuestions = allQuestions;
  } else {
    filteredQuestions = allQuestions.filter(q => (q.group || "Geral") === selectedGroup);
  }
  filteredQuestions = ensureThirtyQuestions(filteredQuestions);
  if (filteredQuestions.length === 0) {
    alert("Não há perguntas para esse grupo!");
    return;
  }
  document.getElementById('categorySelection').style.display = 'none';
  quizArea.style.display = 'block';
  currentQuestion = 0;
  score = 0;
  progress = [];
  timeRemaining = TIME_LIMIT;
  updateScore();
  loadQuestion();
  startTimer();
});

// Carrega as perguntas do arquivo JSON (certifique-se de que o arquivo contém o campo "group")
fetch('assets/data/questions_grouped.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    populateGroupFilter();
  })
  .catch(error => console.error('Erro ao carregar as perguntas:', error));
