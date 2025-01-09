document.addEventListener("DOMContentLoaded", () => {
  const temas = [
    "Tecidos Epiteliais",
    "Tecidos Conjuntivos",
    "Tecido Cartilaginoso",
    "Tecido Ósseo",
    "Tecido Adiposo",
    "Tecido Sanguíneo",
    "Tecido Muscular",
    "Tecido Nervoso",
    "Sistema Cardiovascular",
    "Sistema Linfático",
    "Sistema Digestório I",
    "Sistema Digestório II",
    "Sistema Digestório III",
    "Sistema Respiratório",
    "Sistema Urinário"
  ];

  // Renderiza os temas como checkboxes
  const temaList = document.getElementById("tema-list");
  temas.forEach((tema, index) => {
    const temaItem = document.createElement("div");
    temaItem.className = "tema-item";
    temaItem.innerHTML = `
      <input type="checkbox" id="tema-${index}" value="${tema}">
      <label for="tema-${index}">${tema}</label>
    `;
    temaList.appendChild(temaItem);
  });

  // Lógica do botão "Iniciar Simulado"
  document.getElementById("start-simulado").addEventListener("click", () => {
    const selectedTemas = Array.from(
      document.querySelectorAll("#tema-list input:checked")
    ).map((input) => input.value);

    const numQuestoes = parseInt(document.getElementById("num-questoes").value, 10);
    const tempoQuestao = parseInt(document.getElementById("tempo-questao").value, 10);

    // Validação
    if (selectedTemas.length === 0) {
      alert("Por favor, selecione pelo menos um tema.");
      return;
    }

    if (isNaN(numQuestoes) || numQuestoes < 1 || numQuestoes > 50) {
      alert("Digite uma quantidade válida de questões (1-50).");
      return;
    }

    if (isNaN(tempoQuestao) || tempoQuestao < 10 || tempoQuestao > 300) {
      alert("Digite um tempo válido por questão (10-300 segundos).");
      return;
    }

    // Dados validados, prossiga para o simulado
    const simuladoConfig = {
      temas: selectedTemas,
      quantidade: numQuestoes,
      tempo: tempoQuestao
    };

    console.log("Configuração do Simulado:", simuladoConfig);
    alert("Simulado configurado com sucesso!");

    // Redirecionar ou iniciar simulado aqui
    // Por exemplo: window.location.href = "simulado-iniciar.html";
  });
});
