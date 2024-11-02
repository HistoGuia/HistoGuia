// script.js

// Função de inicialização para redirecionamento inicial
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

// Configuração de redirecionamento para cada card de tema
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".container .button");

  cards.forEach((button, index) => {
    button.addEventListener("click", () => {
      const temaPaths = [
        "tecidos-epiteliais",
        "tecidos-conjuntivos",
        "tecidos-musculares",
        "tecidos-nervosos",
        "tecidos-adiposos"
      ];
      const temaPath = temaPaths[index] || "unavailable";
      window.location.href = temaPath === "unavailable" ? "unavailable.html" : `temas/${temaPath}/modalidade.html`;
    });
  });
});

// Carregamento do JSON de acordo com a página (questões teóricas ou práticas)
document.addEventListener("DOMContentLoaded", function() {
  const pageTitle = document.title;

  if (pageTitle.includes("Questões sobre Tecido Epitelial")) {
    loadQuestions('questoes.json', false, 'questions-list');
  } else if (pageTitle.includes("Questões Práticas sobre Tecido Epitelial")) {
    loadQuestions('questoes-praticas.json', true, 'practical-questions-list');
  }
});

// Função para carregar e exibir as questões a partir de um JSON
async function loadQuestions(jsonFile, isPractical, listId) {
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o arquivo JSON: ${response.status}`);
    
    const questions = await response.json();
    displayQuestions(questions, isPractical, listId);
  } catch (error) {
    console.error("Erro ao carregar as questões:", error);
  }
}

// Função para exibir as questões (teóricas ou práticas)
function displayQuestions(questions, isPractical, listId) {
  const questionsList = document.getElementById(listId);
  if (!questionsList) {
    console.error(`Elemento '${listId}' não encontrado no DOM.`);
    return;
  }

  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    if (isPractical) {
      // Exibir imagem para questões práticas
      const image = document.createElement('img');
      image.src = `laminas/${question.imagem}`;
      image.alt = `Lâmina da Questão ${question.numero}`;
      image.classList.add('practical-image');
      image.onclick = () => toggleOptions(index, listId);
      questionElement.appendChild(image);
    } else {
      // Exibir título para questões teóricas
      const title = document.createElement('h3');
      title.innerText = `${question.numero}. ${question.enunciado}`;
      title.classList.add('question-title');
      title.onclick = () => toggleOptions(index, listId);
      questionElement.appendChild(title);
    }

    // Criação das alternativas
    const optionsList = document.createElement('ul');
    optionsList.id = `options-${index}`;
    optionsList.classList.add('options');
    question.alternativas.forEach((option, optIndex) => {
      const optionElement = document.createElement('li');
      optionElement.innerText = option.texto;
      optionElement.onclick = () => checkAnswer(index, optIndex, question.respostaCorreta, option.explicacao);
      optionsList.appendChild(optionElement);
    });

    // Elemento para a explicação
    const explanationElement = document.createElement('div');
    explanationElement.id = `explanation-${index}`;
    explanationElement.classList.add('explanation');

    // Adiciona os elementos à questão
    questionElement.appendChild(optionsList);
    questionElement.appendChild(explanationElement);
    questionsList.appendChild(questionElement);
  });
}

// Função para alternar a exibição das alternativas e ocultar a explicação ao retraí-las
function toggleOptions(questionIndex, listId) {
  const options = document.getElementById(`options-${questionIndex}`);
  const explanation = document.getElementById(`explanation-${questionIndex}`);

  if (!options || !explanation) {
    console.error("Opções ou explicação não encontradas para a questão:", questionIndex);
    return;
  }

  const isVisible = options.style.display === 'block';
  options.style.display = isVisible ? 'none' : 'block';
  
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
