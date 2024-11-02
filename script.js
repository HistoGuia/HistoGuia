// script.js

// Função de inicialização
function init() {
  const startButton = document.querySelector('.start-btn');
  if (startButton) {
    startButton.addEventListener('click', redirectToThemesPage);
  }
}

// Função de redirecionamento para a página de temas
function redirectToThemesPage() {
  window.location.href = 'temas.html';
}

// Espera o carregamento do DOM
document.addEventListener('DOMContentLoaded', init);

// Adiciona eventos de clique aos botões dos cards na página de temas
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".container .button");

  cards.forEach((button, index) => {
    button.addEventListener("click", () => {
      let temaPath;
      switch (index) {
        case 0:
          temaPath = "tecidos-epiteliais";
          break;
        case 1:
          temaPath = "tecidos-conjuntivos";
          break;
        case 2:
          temaPath = "tecidos-musculares";
          break;
        case 3:
          temaPath = "tecidos-nervosos";
          break;
        case 4:
          temaPath = "tecidos-adiposos";
          break;
        default:
          // Redireciona para a página de tema indisponível
          window.location.href = "unavailable.html";
          return;
      }
      // Redireciona para a página do tema selecionado
      window.location.href = `temas/${temaPath}/modalidade.html`;
    });
  });
});


// Função para carregar o JSON e exibir as questões
async function loadQuestions() {
  try {
    console.log("Carregando JSON...");
    const response = await fetch('questoes.json'); // Caminho relativo para JSON na mesma pasta
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo JSON: ${response.status}`);
    }
    const questions = await response.json();
    console.log("JSON carregado com sucesso:", questions); // Confirma o conteúdo do JSON
    displayQuestions(questions);
  } catch (error) {
    console.error("Erro ao carregar as questões:", error);
  }
}

// Função para exibir as questões na página
function displayQuestions(questions) {
  const questionsList = document.getElementById('questions-list');
  if (!questionsList) {
    console.error("Elemento 'questions-list' não encontrado no DOM.");
    return;
  }

  questions.forEach((question, index) => {
    console.log("Exibindo questão:", question);

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    // Título da questão
    const title = document.createElement('h3');
    title.innerText = `${question.numero}. ${question.enunciado}`;
    title.classList.add('question-title');
    title.onclick = () => toggleOptions(index);

    // Alternativas
    const optionsList = document.createElement('ul');
    optionsList.id = `options-${index}`;
    optionsList.classList.add('options');
    question.alternativas.forEach((option, optIndex) => {
      const optionElement = document.createElement('li');
      optionElement.innerText = option.texto;
      optionElement.onclick = () => checkAnswer(index, optIndex, question.respostaCorreta, option.explicacao);
      optionsList.appendChild(optionElement);
    });

    // Elemento para exibição da explicação
    const explanationElement = document.createElement('div');
    explanationElement.id = `explanation-${index}`;
    explanationElement.classList.add('explanation');

    // Adiciona os elementos à questão
    questionElement.appendChild(title);
    questionElement.appendChild(optionsList);
    questionElement.appendChild(explanationElement);
    questionsList.appendChild(questionElement);
  });
}

// Função para alternar a exibição das alternativas e ocultar a explicação ao retraí-las
function toggleOptions(questionIndex) {
  const options = document.getElementById(`options-${questionIndex}`);
  const explanation = document.getElementById(`explanation-${questionIndex}`);

  if (!options || !explanation) {
    console.error("Opções ou explicação não encontradas para a questão:", questionIndex);
    return;
  }

  // Alterna a exibição das alternativas
  const isVisible = options.style.display === 'block';
  options.style.display = isVisible ? 'none' : 'block';
  
  // Oculta a explicação se as alternativas forem retraídas
  if (isVisible) {
    explanation.style.display = 'none';
  }
}

// Função para verificar a resposta e exibir o feedback
function checkAnswer(questionIndex, selectedOptionIndex, correctAnswerIndex, explanationText) {
  const options = document.querySelectorAll(`#options-${questionIndex} li`);
  
  options.forEach((option, index) => {
    option.classList.remove('correct', 'incorrect');
    if (index === selectedOptionIndex) {
      option.classList.add(index === correctAnswerIndex ? 'correct' : 'incorrect');
    }
  });

  const explanationElement = document.getElementById(`explanation-${questionIndex}`);
  explanationElement.style.display = 'block';
  explanationElement.innerText = explanationText;
}

// Carrega as questões ao iniciar a página
document.addEventListener("DOMContentLoaded", loadQuestions);
