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
  