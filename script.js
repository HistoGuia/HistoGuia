// Função de inicialização
function init() {
    const startButton = document.querySelector('.start-btn');
    if (startButton) {
      startButton.addEventListener('click', redirectToThemesPage);
    }
  }
  
  // Função de redirecionamento
  function redirectToThemesPage() {
    window.location.href = 'temas.html';
  }
  
  // Espera o carregamento do DOM
  document.addEventListener('DOMContentLoaded', init);

  // script.js

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
          console.error("Tema não encontrado");
          return;
      }
      window.location.href = `temas/${temaPath}/modalidade.html`;
    });
  });
});

  