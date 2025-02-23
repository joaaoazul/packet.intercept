let allQuestions = [];
let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
// Usamos o mesmo dropdown para filtrar por grupo
const groupFilterEl = document.getElementById('categoryFilter');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizArea = document.getElementById('quizArea');

function updateScore() {
  scoreEl.textContent = `Pontuação: ${score}`;
}

function loadQuestion() {
  feedbackEl.style.display = 'none';
  nextBtn.style.display = 'none';
  const q = filteredQuestions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  
  // Se desejar, pode-se implementar o embaralhamento das opções aqui.
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => checkAnswer(index, btn));
    optionsEl.appendChild(btn);
  });
  updateScore();
}

function disableOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => btn.disabled = true);
}

function checkAnswer(selected, btn) {
  const q = filteredQuestions[currentQuestion];
  feedbackEl.style.display = 'block';
  disableOptions();
  if (selected === q.correct) {
    feedbackEl.textContent = "Correto! " + q.explanation;
    feedbackEl.style.color = "green";
    score++;
  } else {
    feedbackEl.textContent = "Incorreto. " + q.explanation;
    feedbackEl.style.color = "red";
  }
  updateScore();
  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < filteredQuestions.length) {
    loadQuestion();
  } else {
    feedbackEl.textContent = `Quiz concluído! Sua pontuação final: ${score} de ${filteredQuestions.length}`;
    feedbackEl.style.color = "blue";
    nextBtn.style.display = 'none';
  }
});

function populateGroupFilter() {
  // Extrai os grupos únicos; se não houver "group", usa "Geral"
  const groupsSet = new Set();
  allQuestions.forEach(q => {
    groupsSet.add(q.group || "Geral");
  });
  let groupsArray = Array.from(groupsSet);
  // Se os grupos forem numéricos, ordena numericamente; caso contrário, alfabeticamente
  let numericGroups = groupsArray.filter(g => !isNaN(parseInt(g)));
  numericGroups.sort((a, b) => parseInt(a) - parseInt(b));
  let nonNumericGroups = groupsArray.filter(g => isNaN(parseInt(g)));
  nonNumericGroups.sort();
  const sortedGroups = numericGroups.concat(nonNumericGroups);
  
  // Mapeamento dos títulos para cada grupo
  const groupTitles = {
    "1": "Princípios de Segurança",
    "2": "Continuidade e DR",
    "3": "Controle de Acesso",
    "4": "Segurança de Redes",
    "5": "Operações de Segurança",
    "Geral": "Geral"
  };
  
  // Adiciona a opção "Todos os Grupos"
  const allOption = document.createElement('option');
  allOption.value = "all";
  allOption.textContent = "Todos os Grupos";
  groupFilterEl.appendChild(allOption);
  
  // Popula o dropdown com os grupos ordenados e seus títulos
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

// Ao clicar em "Iniciar Quiz", filtra as perguntas com base no grupo selecionado
startQuizBtn.addEventListener('click', () => {
  const selectedGroup = groupFilterEl.value;
  if (selectedGroup === "all") {
    filteredQuestions = allQuestions;
  } else {
    filteredQuestions = allQuestions.filter(q => (q.group || "Geral") === selectedGroup);
  }
  if (filteredQuestions.length === 0) {
    alert("Não há perguntas para esse grupo!");
    return;
  }
  // Esconde a área de seleção de grupo e mostra o quiz
  document.getElementById('categorySelection').style.display = 'none';
  quizArea.style.display = 'block';
  // Reinicia o quiz
  currentQuestion = 0;
  score = 0;
  updateScore();
  loadQuestion();
});

// Carrega as perguntas do arquivo JSON (certifique-se de que o arquivo contém o campo "group")
fetch('assets/data/questions_grouped.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    populateGroupFilter();
  })
  .catch(error => console.error('Erro ao carregar as perguntas:', error));
