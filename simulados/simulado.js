document.addEventListener('DOMContentLoaded', async function () {
  const temaList = document.getElementById("tema-list");
  const startButton = document.getElementById("start-simulado");

  if (!temaList) {
    console.error("Elemento '#tema-list' não encontrado no DOM.");
    return;
  }

  temaList.innerHTML = '<p class="loading-temas">Carregando temas...</p>';

  const temasConfig = [
    { nome: "Tecidos Epiteliais", jsonPath: "../temas/tecidos-epiteliais/questoes-praticas.json", basePath: "../temas/tecidos-epiteliais/laminas/" },
    { nome: "Tecidos Conjuntivos", jsonPath: "../temas/tecidos-conjuntivos/questoes-praticas.json", basePath: "../temas/tecidos-conjuntivos/laminas/" },
    { nome: "Tecido Cartilaginoso", jsonPath: "../temas/tecido-cartilaginoso/questoes-praticas.json", basePath: "../temas/tecido-cartilaginoso/laminas/" },
    { nome: "Tecido Ósseo", jsonPath: "../temas/tecido-oseo/questoes-praticas.json", basePath: "../temas/tecido-oseo/laminas/" },
    { nome: "Tecido Adiposo", jsonPath: "../temas/tecido-adiposo/questoes-praticas.json", basePath: "../temas/tecido-adiposo/laminas/" },
  ];

  try {
    const temasDisponiveis = [];

    await Promise.all(
      temasConfig.map(async (tema) => {
        try {
          const response = await fetch(tema.jsonPath, { method: "HEAD" });
          if (response.ok) {
            temasDisponiveis.push(tema);
          }
        } catch (error) {
          console.error(`Erro ao verificar o tema '${tema.nome}':`, error);
        }
      })
    );

    temaList.innerHTML = "";

    if (temasDisponiveis.length === 0) {
      temaList.innerHTML = "<p>Nenhum tema disponível no momento.</p>";
      return;
    }

    temasDisponiveis.forEach((tema, index) => {
      const temaItem = document.createElement("div");
      temaItem.className = "tema-item";
      temaItem.innerHTML = `
        <input type="checkbox" id="tema-${index}" data-basepath="${tema.basePath}" value="${tema.jsonPath}">
        <label for="tema-${index}">${tema.nome}</label>
      `;
      temaList.appendChild(temaItem);
    });

    console.log("Temas disponíveis renderizados no DOM.");
  } catch (error) {
    console.error("Erro ao carregar os temas:", error);
    temaList.innerHTML = "<p>Erro ao carregar os temas. Tente novamente mais tarde.</p>";
  }

  startButton.addEventListener("click", async function () {
    const selectedTemas = Array.from(
      document.querySelectorAll("#tema-list input:checked")
    ).map((input) => ({
      jsonPath: input.value,
      basePath: input.dataset.basepath,
    }));

    const numQuestoes = parseInt(document.getElementById("num-questoes").value, 10);
    const tempoPorQuestao = parseInt(document.getElementById("tempo-questao").value, 10);

    if (selectedTemas.length === 0 || isNaN(numQuestoes) || isNaN(tempoPorQuestao)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const questoesSelecionadas = await carregarQuestoes(selectedTemas, numQuestoes);

      // Salva a configuração no localStorage
      localStorage.setItem("simuladoConfig", JSON.stringify({
        questoesSelecionadas,
        tempoPorQuestao
      }));

      // Redireciona para a página do simulado
      window.location.href = "simulado.html";
    } catch (error) {
      console.error("Erro ao iniciar o simulado:", error);
    }
  });

  async function carregarQuestoes(selectedTemas, numQuestoes) {
    let todasQuestoes = [];

    for (const { jsonPath, basePath } of selectedTemas) {
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`Erro ao carregar ${jsonPath}`);
        const questoes = await response.json();

        // Adiciona o caminho base às imagens
        const questoesComCaminho = questoes.map((questao) => ({
          ...questao,
          imagem: `${basePath}${questao.imagem}`,
        }));

        todasQuestoes = todasQuestoes.concat(questoesComCaminho);
      } catch (error) {
        console.error(`Erro ao carregar questões do tema: ${jsonPath}`, error);
      }
    }

    return todasQuestoes.slice(0, numQuestoes);
  }
});
