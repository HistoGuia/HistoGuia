document.addEventListener("DOMContentLoaded", function() {
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
      adjustNavLinks(baseURL); // Ajusta os links de navegação após carregar o header
    })
    .catch(error => console.error("Erro ao carregar o header:", error));
});

// Função para ajustar os links de navegação de acordo com o ambiente
function adjustNavLinks(baseURL) {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href.startsWith("./")) {
      link.setAttribute("href", `${baseURL}${href.substring(1)}`); // Concatena baseURL sem o ponto inicial
    }
  });
}


// loadHeader.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("Iniciando o carregamento do header...");

  // Carrega o header
  fetch("/header.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      console.log("Header encontrado, carregando...");
      return response.text();
    })
    .then((data) => {
      const placeholder = document.getElementById("header-placeholder");
      if (!placeholder) {
        throw new Error("Elemento #header-placeholder não encontrado no DOM.");
      }
      placeholder.innerHTML = data;
      console.log("Header carregado com sucesso.");

      // Menu retrátil para mobile
      const menuIcon = document.getElementById("menu-icon");
      const menuItems = document.getElementById("menu-items");

      if (menuIcon && menuItems) {
        menuIcon.addEventListener("click", () => {
          menuIcon.classList.toggle("active");
          menuItems.style.display = menuItems.style.display === "flex" ? "none" : "flex";
        });
      }
    })
    .catch((error) => console.error("Erro ao carregar o header:", error));
});
