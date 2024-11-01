// loadHeader.js
document.addEventListener("DOMContentLoaded", function() {
    console.log("Iniciando o carregamento do header...");
  
    fetch("header.html")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        console.log("Header encontrado, carregando...");
        return response.text();
      })
      .then(data => {
        const placeholder = document.getElementById("header-placeholder");
        if (!placeholder) {
          throw new Error("Elemento #header-placeholder não encontrado no DOM.");
        }
        placeholder.innerHTML = data;
        console.log("Header carregado com sucesso.");
      })
      .catch(error => console.error("Erro ao carregar o header:", error));
  });
  