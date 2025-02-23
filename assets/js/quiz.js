// Array de perguntas com opções, índice da resposta correta e explicação
const questions = [
    {
      question: "Qual é a função principal de um firewall?",
      options: [
        "Filtrar o tráfego de rede para prevenir acessos não autorizados",
        "Armazenar dados temporariamente",
        "Aumentar a velocidade da rede",
        "Gerar energia para o servidor"
      ],
      correct: 0,
      explanation: "O firewall atua como uma barreira, monitorando e filtrando o tráfego de rede para impedir acessos não autorizados."
    },
    {
      question: "O que é MFA (Autenticação Multifator)?",
      options: [
        "Uso exclusivo de senhas complexas",
        "Autenticação que requer dois ou mais métodos de verificação",
        "Autenticação baseada em endereço IP",
        "Verificação de segurança via rede social"
      ],
      correct: 1,
      explanation: "MFA exige que o usuário apresente dois ou mais fatores de autenticação, aumentando a segurança."
    },
    // Adicione quantas perguntas desejar, baseadas no exame oficial.
  ];
  
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
      // Opcional: redirecionar para outra página ou reiniciar o quiz
    }
  });
  
  loadQuestion();
  