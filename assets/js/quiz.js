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
      explanation: "MFA exige que o usuário apresente dois ou mais fatores de autenticação, como senha e código via SMS ou app autenticador, aumentando a segurança."
    },
    // Adiciona mais perguntas conforme necessário
  ];
  
  let currentQuestion = 0;
  
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const explanationEl = document.getElementById('explanation');
  const nextBtn = document.getElementById('nextBtn');
  
  function loadQuestion() {
    explanationEl.style.display = 'none';
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
  
  function checkAnswer(selected) {
    const q = questions[currentQuestion];
    if (selected === q.correct) {
      alert("Correto!");
      nextBtn.style.display = 'block';
    } else {
      explanationEl.textContent = "Incorreto. " + q.explanation;
      explanationEl.style.display = 'block';
      nextBtn.style.display = 'block';
    }
  }
  
  nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      alert("Quiz concluído!");
      // Aqui podes redirecionar o usuário ou reiniciar o quiz
      currentQuestion = 0;
      loadQuestion();
    }
  });
  
  loadQuestion();
  