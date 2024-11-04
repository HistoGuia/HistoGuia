// script.js

// Função de inicialização para redirecionamento inicial e configuração de navegação
function init() {
  console.log("Iniciando o script...");
  const startButton = document.querySelector('.start-btn');
  if (startButton) {
    startButton.addEventListener('click', redirectToThemesPage);
  }
  setupThemeNavigation();
  loadContentBasedOnPage();
}

// Função para redirecionar para a página de temas
function redirectToThemesPage() {
  window.location.href = 'temas.html';
}

// Configuração de navegação na página de seleção de temas
function setupThemeNavigation() {
  const themeButtons = document.querySelectorAll(".themes-container .button");

  // Define os caminhos para cada tema na ordem correta
  const temaPaths = [
    "tecidos-epiteliais",
    "tecidos-conjuntivos",
    "tecidos-musculares",
    "tecidos-nervosos",
    "tecidos-adiposos",
    "cartilagens",
    "ossos",
    "tecido-sanguineo",
    "tecido-hematopoietico",
    "linfatico"
  ];

  themeButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const temaPath = temaPaths[index] || "unavailable";
      const path = temaPath === "unavailable" ? "unavailable.html" : `temas/${temaPath}/modalidade.html`;
      console.log(`Redirecionando para: ${path}`);
      window.location.href = path;
    });
  });
}

// Função para detectar o tema atual a partir da URL
function detectCurrentTheme() {
  const pathParts = window.location.pathname.split('/');
  const theme = pathParts[pathParts.indexOf('temas') + 1];
  console.log(`Tema atual detectado: ${theme}`);
  return theme;
}

// Carrega o conteúdo correto com base no título da página atual
function loadContentBasedOnPage() {
  const theme = detectCurrentTheme();
  const pageTitle = document.title;

  if (pageTitle.includes("Questões sobre")) {
    loadQuestions(`../${theme}/questoes.json`, false, 'questions-list');
  } else if (pageTitle.includes("Questões Práticas")) {
    loadQuestions(`../${theme}/questoes-praticas.json`, true, 'practical-questions-list');
  } else if (pageTitle.includes("Flash Cards")) {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'teorico';
    const jsonFile = type === 'teorico' ? `../${theme}/questoes.json` : `../${theme}/questoes-praticas.json`;
    loadFlashcards(jsonFile, type === 'pratico');
  }
}

// Função para carregar e exibir questões a partir de um JSON
async function loadQuestions(jsonFile, isPractical, listId) {
  console.log(`Carregando questões de ${jsonFile}...`);
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o arquivo JSON: ${response.status}`);
    
    const questions = await response.json();
    console.log("Questões carregadas com sucesso:", questions);
    displayQuestions(questions, isPractical, listId);
  } catch (error) {
    console.error("Erro ao carregar as questões:", error);
  }
}

// Função para exibir questões teóricas ou práticas
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
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      const image = document.createElement('img');
      image.src = `laminas/${question.imagem}`;
      image.alt = `Lâmina da Questão ${question.numero}`;
      image.classList.add('practical-image');
      image.onclick = () => toggleOptions(index, listId);
      
      const zoomButton = document.createElement('button');
      zoomButton.classList.add('zoom-button');
      zoomButton.innerText = 'Ampliar';
      zoomButton.onclick = (event) => {
        event.stopPropagation();
        openModal(image.src);
      };

      imageContainer.appendChild(image);
      imageContainer.appendChild(zoomButton);
      questionElement.appendChild(imageContainer);
    } else {
      const title = document.createElement('h3');
      title.innerText = `${question.numero}. ${question.enunciado}`;
      title.classList.add('question-title');
      title.onclick = () => toggleOptions(index, listId);
      questionElement.appendChild(title);
    }

    const optionsList = document.createElement('ul');
    optionsList.id = `options-${index}`;
    optionsList.classList.add('options');
    question.alternativas.forEach((option, optIndex) => {
      const optionElement = document.createElement('li');
      optionElement.innerText = option.texto;
      optionElement.onclick = () => checkAnswer(index, optIndex, question.respostaCorreta, option.explicacao);
      optionsList.appendChild(optionElement);
    });

    const explanationElement = document.createElement('div');
    explanationElement.id = `explanation-${index}`;
    explanationElement.classList.add('explanation');

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
  console.log("Imagem ampliada exibida:", imageSrc);
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("image-modal");
  modal.style.display = "none";
  console.log("Modal fechado");
}

// Alterna a exibição das alternativas e oculta a explicação ao retraí-las
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
  console.log(`Alternando opções de exibição para a questão ${questionIndex}`);
}

// Verifica a resposta e exibe o feedback
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
  console.log(`Resposta verificada para a questão ${questionIndex}: ${selectedOptionIndex === correctAnswerIndex ? "Correta" : "Incorreta"}`);
}

// Função de carregamento de flashcards na página flashcards.html
async function loadFlashcards(jsonFile, isPractical) {
  console.log(`Carregando flashcards de ${jsonFile}...`);
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o JSON: ${response.status}`);
    const questions = await response.json();
    console.log("Flashcards carregados com sucesso:", questions);
    displayFlashcards(questions, isPractical);
  } catch (error) {
    console.error("Erro ao carregar os flashcards:", error);
  }
}

// Exibe os flashcards na página flashcards.html
function displayFlashcards(questions, isPractical) {
  const flashcardsList = document.getElementById('flashcards-list');
  if (!flashcardsList) {
    console.error("Elemento 'flashcards-list' não encontrado no DOM.");
    return;
  }

  flashcardsList.innerHTML = '';
  console.log("Exibindo flashcards...");

  questions.forEach((question, index) => {
    console.log(`Processando questão ${index + 1}:`, question);

    const cardElement = document.createElement('div');
    cardElement.classList.add('three-d-card');

    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');

    const front = document.createElement('div');
    front.classList.add('card-face', 'front');
    const frontContent = document.createElement('div');
    frontContent.classList.add('card-content');

    if (isPractical) {
      const img = document.createElement('img');
      img.src = `laminas/${question.imagem}`;
      img.alt = `Imagem da Questão ${question.numero}`;
      img.classList.add('flashcard-image');
      frontContent.appendChild(img);
      console.log("Imagem carregada para flashcard prático:", img.src);
    } else {
      const enunciado = document.createElement('p');
      enunciado.classList.add('card-title');
      enunciado.textContent = question.enunciado;
      frontContent.appendChild(enunciado);
      console.log("Texto do enunciado carregado para flashcard teórico:", question.enunciado);
    }
    front.appendChild(frontContent);

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

    wrapper.appendChild(front);
    wrapper.appendChild(back);
    cardElement.appendChild(wrapper);
    flashcardsList.appendChild(cardElement);
  });
}

// Inicia o script ao carregar a página
document.addEventListener('DOMContentLoaded', init);
