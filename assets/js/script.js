const toggleBtn = document.querySelector('.toggle-mode');
const container = document.querySelector('.container');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (container) {
    container.classList.toggle('dark-mode');
  }
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞 Stealth Off' : '🌚 Stealth Mode';
});

// Navegação suave
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Busca Dinâmica: filtra artigos conforme o texto digitado
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  document.querySelectorAll('article').forEach(article => {
    const text = article.textContent.toLowerCase();
    article.style.display = text.includes(filter) ? '' : 'none';
  });
});

// Sistema de Favoritos: salvar em localStorage
const favoriteButtons = document.querySelectorAll('.favorite-btn');
favoriteButtons.forEach(btn => {
  const articleId = btn.parentElement.id;
  if (localStorage.getItem('favorite-' + articleId) === 'true') {
    btn.classList.add('favorite');
    btn.innerHTML = '&#9733;';
  }
  btn.addEventListener('click', function() {
    this.classList.toggle('favorite');
    const isFavorited = this.classList.contains('favorite');
    this.innerHTML = isFavorited ? '&#9733;' : '&#9734;';
    localStorage.setItem('favorite-' + articleId, isFavorited);
  });
});

// Sistema de Progresso: marcar artigo como concluído e salvar em localStorage
const progressButtons = document.querySelectorAll('.progress-btn');
progressButtons.forEach(btn => {
  const articleId = btn.parentElement.id;
  if (localStorage.getItem('progress-' + articleId) === 'true') {
    btn.classList.add('completed');
    btn.closest('article').classList.add('completed-article');
  }
  btn.addEventListener('click', function() {
    this.classList.toggle('completed');
    const article = this.closest('article');
    article.classList.toggle('completed-article');
    const isCompleted = this.classList.contains('completed');
    localStorage.setItem('progress-' + articleId, isCompleted);
  });
});

// Dashboard de Tarefas: gerenciamento simples com localStorage
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

function loadTasks() {
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task;
    li.title = "Clique para remover esta tarefa";
    li.addEventListener('click', () => removeTask(index));
    taskList.appendChild(li);
  });
}

function addTask() {
  const task = taskInput.value.trim();
  if (task !== '') {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    loadTasks();
  }
}

function removeTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

addTaskBtn.addEventListener('click', addTask);
loadTasks();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker registado!"));
}
