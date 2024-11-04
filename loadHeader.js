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

      // Ajusta o padding-top do main dinamicamente
      adjustMainPadding();

      // Após carregar o header, ajusta os links de navegação e adiciona funcionalidade ao menu mobile
      adjustNavLinks(baseURL);
      setupMobileMenu();

      // Adiciona o listener para ajustar o padding ao redimensionar a janela
      window.addEventListener("resize", adjustMainPadding);
    })
    .catch(error => console.error("Erro ao carregar o header:", error));
});

// Função para ajustar o padding-top de main com base na altura do header
function adjustMainPadding() {
  const header = document.querySelector(".main-nav");
  const main = document.querySelector("main");

  if (header && main) {
    const headerHeight = header.offsetHeight;
    main.style.paddingTop = `${headerHeight}px`;
    console.log(`Padding-top ajustado para ${headerHeight}px, com base na altura do header.`);
  } else {
    console.warn("Elemento .main-nav ou <main> não encontrado. Verifique a estrutura HTML.");
  }
}

// Função para ajustar os links de navegação de acordo com o ambiente
function adjustNavLinks(baseURL) {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      const newHref = `${baseURL}/${href}`;
      link.setAttribute("href", newHref);
      console.log(`Ajustando link: ${href} para ${newHref}`);
    }
  });
}

// Função para configurar o menu mobile retrátil
function setupMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const menuItems = document.getElementById("menu-items");

  if (menuIcon && menuItems) {
    console.log("Configuração do menu mobile iniciada.");
    menuIcon.addEventListener("click", () => {
      const isMenuOpen = menuItems.style.display === "flex";
      menuItems.style.display = isMenuOpen ? "none" : "flex";
      menuIcon.classList.toggle("active", !isMenuOpen); // Alterna o estado ativo do ícone
    });
  } else {
    console.warn("Elementos de menu mobile não encontrados. Verifique se '#menu-icon' e '#menu-items' existem.");
  }
}
