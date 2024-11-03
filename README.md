# HistoGuia

HistoGuia é uma plataforma interativa para o estudo e revisão de histologia, com ênfase em questões teóricas e práticas sobre tecidos e estrutura celular. O projeto oferece flashcards, questionários teóricos e práticos para aprimorar o conhecimento em histologia.

## Índice

- [HistoGuia](#histoguia)
  - [Índice](#índice)
  - [Visão Geral](#visão-geral)
  - [Funcionalidades](#funcionalidades)
  - [Instalação](#instalação)
  - [Estrutura de Arquivos](#estrutura-de-arquivos)
  - [Uso](#uso)
    - [Navegação](#navegação)
    - [Recursos Específicos](#recursos-específicos)
  - [Contribuição](#contribuição)
  - [Licença](#licença)

---

## Visão Geral

O HistoGuia foi projetado para estudantes e profissionais da área de saúde que buscam uma maneira prática e eficiente de revisar conteúdos de histologia. A plataforma conta com questões objetivas, diagnósticos em lâminas e flashcards para revisão rápida, divididos em tópicos teóricos e práticos.

## Funcionalidades

- **Questões Teóricas**: Questões de múltipla escolha sobre o conteúdo teórico.
- **Questões Práticas**: Diagnóstico de lâminas histológicas com perguntas associadas.
- **Flashcards**: Ferramenta de revisão rápida com flashcards teóricos e práticos.
- **Layout Responsivo**: Interface adaptada para dispositivos móveis e desktops.
- **Modalidade de Estudo**: Seleção de modalidades de estudo direto na página inicial.
- **Ambiente Local e GitHub Pages**: Redirecionamento adequado tanto para desenvolvimento local quanto para publicação em GitHub Pages.

## Instalação

Para rodar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SeuUsuario/HistoGuia.git
   ```

2. **Acesse a pasta do projeto**:
   ```bash
   cd HistoGuia
   ```

3. **Inicie o projeto em um servidor local** (ex: usando Live Server no VS Code ou um servidor HTTP local):
   - Abra o arquivo `index.html` no navegador ou use uma extensão como o Live Server do VS Code para rodar em ambiente local.
   
4. **Configuração para GitHub Pages**:
   - O projeto está configurado para ser compatível com GitHub Pages. A URL base é automaticamente ajustada para `/HistoGuia` ao detectar o ambiente do GitHub Pages.

## Estrutura de Arquivos

Abaixo está uma visão geral dos principais diretórios e arquivos do projeto:
```
HistoGuia/
├── index.html                  # Página inicial com opções de modalidade
├── header.html                 # Cabeçalho incluído em todas as páginas
├── script.js                   # Script principal com lógica de navegação e funcionalidade dos quizzes e flashcards
├── loadHeader.js               # Script para carregamento dinâmico do header
├── style.css                   # Arquivo CSS principal com os estilos
├── temas/                      # Pasta contendo as subpáginas e dados por tema
│   ├── tecidos-epiteliais/
│   │   ├── modalidade.html      # Página de modalidade para o tema tecidos epiteliais
│   │   ├── questoes.html        # Página de questões teóricas sobre o tema
│   │   ├── questoes-praticas.html # Página de questões práticas sobre o tema
│   │   ├── flashcards.html      # Página dos flashcards do tema
│   │   ├── questoes.json        # Dados das questões teóricas em formato JSON
│   │   ├── questoes-praticas.json # Dados das questões práticas em formato JSON
│   │   └── laminas/             # Imagens de lâminas para as questões práticas
│   ├── tecidos-conjuntivos/
│   ├── tecidos-musculares/
│   ├── tecidos-nervosos/
│   └── tecidos-adiposos/
└── README.md                   # Este documento
```

## Uso

### Navegação

1. **Página Inicial** (`index.html`): Oferece acesso às diferentes modalidades de estudo.
2. **Páginas de Modalidade** (`modalidade.html`): Permite escolher entre questões teóricas, práticas e flashcards.
3. **Questões Teóricas** (`questoes.html`): Contém perguntas objetivas sobre o tema selecionado.
4. **Questões Práticas** (`questoes-praticas.html`): Apresenta imagens de lâminas com perguntas associadas para diagnóstico.
5. **Flashcards** (`flashcards.html`): Contém flashcards teóricos e práticos para revisão rápida.

### Recursos Específicos

- **Redirecionamento Automático**: As URLs são ajustadas para ambiente local e GitHub Pages de forma dinâmica, utilizando o script `loadHeader.js`.
- **Header Fixo**: O cabeçalho fica fixo no topo da página, facilitando a navegação.
- **Flashcards Interativos**: Cada flashcard apresenta um conteúdo (imagem ou pergunta) na frente e, ao girar, revela a resposta.

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto.
2. Crie uma nova branch:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "feat: adiciona nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença MIT.

---
