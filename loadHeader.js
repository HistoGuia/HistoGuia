document.addEventListener("DOMContentLoaded", function() {
  console.log("Iniciando o carregamento do header...");

  // Verifica se está em produção (GitHub Pages) ou ambiente local
  const isGitHubPages = window.location.hostname.includes("github.io");
  const basePath = isGitHubPages ? "/HistoGuia" : ""; // Ajusta o caminho base dependendo do ambiente

  const headerPath = `${basePath}/header.html`; // Define o caminho para o header

  fetch(headerPath)
    .then(response => {
      if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
      console.log("Header encontrado, carregando...");
      return response.text();
    })
    .then(data => {
      const placeholder = document.getElementById("header-placeholder");
      if (!placeholder) throw new Error("Elemento #header-placeholder não encontrado no DOM.");
      placeholder.innerHTML = data;
      console.log("Header carregado com sucesso.");
      adjustNavLinks(basePath); // Ajusta os links de navegação após carregar o header
    })
    .catch(error => console.error("Erro ao carregar o header:", error));
});

// Função para ajustar os links de navegação de acordo com o ambiente
function adjustNavLinks(basePath) {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href.startsWith("/")) { // Apenas ajusta links absolutos
      link.setAttribute("href", `${basePath}${href}`);
    }
  });
}
