document.addEventListener("DOMContentLoaded", function() {
  console.log("Iniciando o carregamento do header...");

  // Array de possíveis caminhos relativos para `header.html`
  const paths = ["/HistoGuia/header.html", "../header.html", "../../header.html"];
  
  let headerLoaded = false;

  // Função para tentar carregar o header
  async function loadHeader(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.text();
      const placeholder = document.getElementById("header-placeholder");
      if (!placeholder) throw new Error("Elemento #header-placeholder não encontrado no DOM.");
      
      placeholder.innerHTML = data;
      console.log("Header carregado com sucesso a partir de:", path);
      headerLoaded = true; // Marca como carregado
    } catch (error) {
      console.error("Erro ao tentar carregar o header:", error);
    }
  }

  // Itera sobre os caminhos possíveis até carregar com sucesso
  (async function() {
    for (const path of paths) {
      if (headerLoaded) break; // Se já carregou, interrompe o loop
      await loadHeader(path);
    }
    if (!headerLoaded) console.error("Falha ao carregar o header de todos os caminhos.");
  })();
});
