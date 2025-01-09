// script.js

// Função de inicialização para redirecionamento inicial e configuração de navegação
function init() {
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
    "tecido-cartilaginoso",
    "tecido-oseo",
    "tecido-adiposo",
    "tecido-sanguineo",
    "tecido-muscular",
    "tecido-nervoso",
    "sistema-cardiovascular",
    "sistema-linfatico",
    "sistema-digestorio-1",
    "sistema-digestorio-2",
    "sistema-digestorio-3",
    "sistema-respiratorio",
    "sistema-urinario",
  ];

  themeButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const temaPath = temaPaths[index];
      const modalidadePath = `temas/${temaPath}/modalidade.html`;

      // Verifica se o arquivo de modalidade existe
      fetch(modalidadePath, { method: 'HEAD' })
        .then((response) => {
          if (response.ok) {
            window.location.href = modalidadePath;
          } else {
            window.location.href = "unavailable.html";
          }
        })
        .catch(() => {
          window.location.href = "unavailable.html";
        });
    });
  });
}

// Função para detectar o tema atual a partir da URL
function detectCurrentTheme() {
  const pathParts = window.location.pathname.split('/');
  const theme = pathParts[pathParts.indexOf('temas') + 1];
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
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o arquivo JSON: ${response.status}`);
    
    const questions = await response.json();
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
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("image-modal");
  modal.style.display = "none";
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
}

// Função de carregamento de flashcards na página flashcards.html
async function loadFlashcards(jsonFile, isPractical) {
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Erro ao carregar o JSON: ${response.status}`);
    const questions = await response.json();
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

  questions.forEach((question, index) => {
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
    } else {
      const enunciado = document.createElement('p');
      enunciado.classList.add('card-title');
      enunciado.textContent = question.enunciado;
      frontContent.appendChild(enunciado);
    }
    front.appendChild(frontContent);

    const back = document.createElement('div');
    back.classList.add('card-face', 'back');
    const backContent = document.createElement('div');
    backContent.classList.add('card-content');
    
    if (question.alternativas && question.alternativas[question.respostaCorreta]) {
      const respostaCorreta = document.createElement('p');
      respostaCorreta.classList.add('card-description');
      respostaCorreta.textContent = `${question.alternativas[question.respostaCorreta].texto}`;
      backContent.appendChild(respostaCorreta);
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
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.main-nav');
  const mainContent = document.querySelector('main');

  if (header && mainContent) {
    const headerHeight = header.offsetHeight;
    mainContent.style.paddingTop = `${headerHeight}px`;
  }
});

// Inicia o script ao carregar a página
document.addEventListener('DOMContentLoaded', init);
