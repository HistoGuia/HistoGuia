document.addEventListener("DOMContentLoaded", function () {
  console.log("Iniciando o carregamento do header...");

  const isGitHubPages = window.location.hostname.includes("github.io");
  const baseURL = isGitHubPages ? "/HistoGuia" : ""; // Define a URL base para GitHub Pages ou ambiente local
  const headerPath = `${baseURL}/header.html`;

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
      
      // Após carregar o header, ajusta os links de navegação e adiciona funcionalidade ao menu mobile
      adjustNavLinks(baseURL);
      setupMobileMenu();
    })
    .catch(error => console.error("Erro ao carregar o header:", error));
});

// Função para ajustar os links de navegação de acordo com o ambiente
function adjustNavLinks(baseURL) {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      link.setAttribute("href", `${baseURL}/${href}`);
    }
  });
}

// Função para configurar o menu mobile retrátil
function setupMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const menuItems = document.getElementById("menu-items");

  if (menuIcon && menuItems) {
    menuIcon.addEventListener("click", () => {
      const isMenuOpen = menuItems.style.display === "flex";
      menuItems.style.display = isMenuOpen ? "none" : "flex";
      menuIcon.classList.toggle("active", !isMenuOpen); // Alterna o estado ativo do ícone
    });
  } else {
    console.warn("Elementos de menu mobile não encontrados.");
  }
}
