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

// Função para exibir as questões (teóricas ou práticas) com botão "Ampliar" nas práticas
function displayQuestions(questions, isPractical, listId) {
  const questionsList = document.getElementById(listId);
  if (!questionsList) {
    console.error(`Elemento '${listId}' não encontrado no DOM.`);
    return;
  }

  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add(isPractical ? 'question-practical' : 'question');

    if (isPractical) {
      // Exibir imagem para questões práticas com botão "Ampliar"
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      const image = document.createElement('img');
      image.src = `laminas/${question.imagem}`;
      image.alt = `Lâmina da Questão ${question.numero}`;
      image.classList.add('practical-image');
      
      // Clique na imagem para exibir opções
      image.onclick = () => toggleOptions(index, listId);
      
      const zoomButton = document.createElement('button');
      zoomButton.classList.add('zoom-button');
      zoomButton.innerText = 'Ampliar';
      
      // Clique no botão "Ampliar" para abrir o modal
      zoomButton.onclick = (event) => {
        event.stopPropagation(); // Impede o clique na imagem de acionar toggleOptions
        openModal(image.src);
      };

      imageContainer.appendChild(image);
      imageContainer.appendChild(zoomButton);
      questionElement.appendChild(imageContainer);
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

// Função para abrir o modal com a imagem ampliada
function openModal(imageSrc) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  modal.style.display = "block";
  modalImage.src = imageSrc;
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("image-modal");
  modal.style.display = "none";
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


// Função de carregamento de flashcards na página flashcards.html
document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  const titleElement = document.getElementById('flashcard-title');

  // Teste para verificar o tipo de flashcard carregado
  console.log("Tipo de flashcard selecionado:", type);
  if (!titleElement) {
    console.error("Elemento de título de flashcard não encontrado.");
    return;
  }

  titleElement.textContent = type === 'teorico' ? "Flash Cards Teóricos" : "Flash Cards Práticos";

  // Determina o JSON correto para carregar
  const jsonFile = type === 'teorico' ? 'questoes.json' : 'questoes-praticas.json';
  console.log("Carregando JSON:", jsonFile);
  loadFlashcards(jsonFile, type === 'pratico');
});

async function loadFlashcards(jsonFile, isPractical) {
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o JSON: ${response.status}`);
    const questions = await response.json();
    console.log("Dados carregados do JSON:", questions); // Confirma o conteúdo carregado
    displayFlashcards(questions, isPractical);
  } catch (error) {
    console.error("Erro ao carregar os flashcards:", error);
  }
}

function displayFlashcards(questions, isPractical) {
  const flashcardsList = document.getElementById('flashcards-list');
  if (!flashcardsList) {
    console.error("Elemento 'flashcards-list' não encontrado no DOM.");
    return;
  }

  flashcardsList.innerHTML = ''; // Limpa qualquer conteúdo existente
  console.log("Exibindo flashcards...");

  questions.forEach((question, index) => {
    console.log(`Processando questão ${index + 1}:`, question);

    // Cria o contêiner principal do card 3D
    const cardElement = document.createElement('div');
    cardElement.classList.add('three-d-card');

    // Wrapper para o efeito de rotação 3D
    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');

    // Frente do card (Enunciado ou Imagem)
    const front = document.createElement('div');
    front.classList.add('card-face', 'front');
    const frontContent = document.createElement('div');
    frontContent.classList.add('card-content');

    if (isPractical) {
      // Exibe a imagem para flashcards práticos
      const img = document.createElement('img');
      img.src = `laminas/${question.imagem}`;
      img.alt = `Imagem da Questão ${question.numero}`;
      img.classList.add('flashcard-image');
      frontContent.appendChild(img);
      console.log("Imagem carregada para flashcard prático:", img.src);
    } else {
      // Exibe o enunciado para flashcards teóricos
      const enunciado = document.createElement('p');
      enunciado.classList.add('card-title');
      enunciado.textContent = question.enunciado;
      frontContent.appendChild(enunciado);
      console.log("Texto do enunciado carregado para flashcard teórico:", question.enunciado);
    }
    front.appendChild(frontContent);

    // Verso do card (Resposta)
    const back = document.createElement('div');
    back.classList.add('card-face', 'back');
    const backContent = document.createElement('div');
    backContent.classList.add('card-content');
    
    if (question.alternativas && question.alternativas[question.respostaCorreta]) {
      const respostaCorreta = document.createElement('p');
      respostaCorreta.classList.add('card-description');
      respostaCorreta.textContent = `Resposta Correta: ${question.alternativas[question.respostaCorreta].texto}`;
      backContent.appendChild(respostaCorreta);
      console.log("Resposta correta carregada:", question.alternativas[question.respostaCorreta].texto);
    } else {
      console.warn("Resposta correta não encontrada para a questão:", question.numero);
    }
    back.appendChild(backContent);

    // Montagem do card com as faces frontal e traseira
    wrapper.appendChild(front);
    wrapper.appendChild(back);
    cardElement.appendChild(wrapper);
    flashcardsList.appendChild(cardElement);
  });
}
