document.getElementById('exportBtn').addEventListener('click', function() {
    let progress = localStorage.getItem('quizProgress');
    
    if (!progress) {
      alert("Nenhum resultado do quiz encontrado!");
      return;
    }
    
    let progressData = JSON.parse(progress);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20; // posição inicial
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    
    // Título do PDF
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo do Quiz", 10, y);
    y += 10;
    doc.setFontSize(12);
    
    progressData.forEach((item, index) => {
      // Adiciona nova página se necessário
      if (y + lineHeight * 4 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      
      // Escreve a pergunta em preto
      doc.setTextColor(0, 0, 0);
      doc.text(`Q${index + 1}: ${item.question}`, 10, y);
      y += lineHeight;
      
      // Para cada opção, escreve o texto principal em preto e o marcador (se houver) na cor adequada
      item.options.forEach((option, i) => {
        let mainText = `${i + 1}. ${option}`;
        let marker = "";
        let markerColor = [0, 0, 0]; // padrão: preto
        
        if (i === item.correctIndex && i === item.chosenIndex) {
          marker = " (CORRETA, SUA RESPOSTA)";
          markerColor = [0, 128, 0]; // verde
        } else if (i === item.correctIndex) {
          marker = " (CORRETA)";
          markerColor = [0, 128, 0]; // verde
        } else if (i === item.chosenIndex) {
          marker = " (SUA RESPOSTA)";
          markerColor = [255, 0, 0]; // vermelho
        }
        
        // Se o texto for longo, quebra-o em várias linhas
        const splitMain = doc.splitTextToSize(mainText, 180);
        // Para cada linha, escreva em preto; para a última linha, adicione o marcador à direita
        splitMain.forEach((line, idx) => {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.setTextColor(0, 0, 0);
          doc.text(line, 10, y);
          // Se for a última linha da opção e houver marcador, adiciona-o à direita
          if (idx === splitMain.length - 1 && marker !== "") {
            let lineWidth = doc.getTextWidth(line);
            doc.setTextColor(markerColor[0], markerColor[1], markerColor[2]);
            doc.text(marker, 10 + lineWidth, y);
          }
          y += lineHeight;
        });
      });
      
      // Adiciona a explicação da questão
      const explanation = `Explicação: ${item.explanation}`;
      const splitExplanation = doc.splitTextToSize(explanation, 180);
      splitExplanation.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.setTextColor(0, 0, 0);
        doc.text(line, 10, y);
        y += lineHeight;
      });
      
      // Espaço extra entre as questões
      y += lineHeight;
    });
    
    doc.save("quiz_progress.pdf");
  });
  