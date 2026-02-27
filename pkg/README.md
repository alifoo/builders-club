# Clube de Builders - builders-club

Um playground interativo para experimentação com **React**, **Rust/WebAssembly** e manipulação de imagens em tempo real, com benchmarking lado a lado entre WASM e JavaScript puro.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-WASM-DEA584?logo=rust&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

## Funcionalidades

- **Elementos arrastáveis** — todos os elementos da página (textos, imagens, componentes) podem ser arrastados livremente
- **Filtros de imagem** — Grayscale, Sepia, Invert e Blur, com implementações em:
  - **Rust/WASM** — manipulação direta na memória linear do WASM para máxima performance
  - **JavaScript** — implementação equivalente em JS puro para comparação
- **Benchmarking em tempo real** — popup exibindo o tempo de execução do filtro e o tempo total (incluindo I/O com canvas)
- **Upload de imagens** — substitua a imagem padrão por qualquer imagem do seu dispositivo via menu de contexto (clique direito)
- **Cursor customizado** — cursor animado com GSAP que segue o ponteiro com suavização
- **Animação de texto** — efeito typewriter na mensagem de boas-vindas
- **Toolbar contextual** — ao clicar em um elemento, uma toolbar aparece com ações específicas para o tipo do elemento (filtros para imagens, deletar para todos)
- **Design responsivo** — layout adaptável para mobile, tablet e desktop

## Tech Stack

| Camada        | Tecnologia                                          |
| ------------- | --------------------------------------------------- |
| **Frontend**  | React 19, TypeScript                                |
| **Build**     | Vite 7 com SWC                                      |
| **Styling**   | Tailwind CSS 4                                      |
| **WASM**      | Rust + `wasm-bindgen` + `wasm-pack`                 |
| **Animações** | Framer Motion (`motion`), GSAP, `typewriter-effect` |
| **Ícones**    | `react-icons`                                       |

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

### Setup

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/builders-club.git
   cd builders-club
   ```

2. **Compile o WASM**

   ```bash
   wasm-pack build --target web
   ```

3. **Instale as dependências**

   ```bash
   npm install
   ```

4. **Rode o dev server**

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:5173](http://localhost:5173)

## Como Funciona o Benchmarking

Ao clicar em uma imagem e selecionar um filtro, o sistema:

1. Carrega os pixels da imagem via `Canvas API`
2. Executa o filtro na implementação escolhida (WASM ou JS)
3. Renderiza o resultado de volta no canvas
4. Exibe um popup com:
   - **Filter time** — tempo gasto exclusivamente no processamento do filtro
   - **Total time** — tempo total incluindo I/O (decodificação, canvas, blob)

A versão WASM utiliza **alocação direta na memória linear** (`alloc_buffer` / `free_buffer`) para evitar cópias desnecessárias entre JS e WASM, maximizando a performance.

## Filtros Disponíveis

| Filtro        | Descrição                                                         |
| ------------- | ----------------------------------------------------------------- |
| **Grayscale** | Conversão para tons de cinza usando a fórmula ITU-R BT.601        |
| **Sepia**     | Efeito sépia clássico com matriz de transformação de cor          |
| **Invert**    | Inversão dos canais RGB (negativo)                                |
| **Blur**      | Desfoque por média de vizinhança (box blur) com raio configurável |

## Licenças

Dual-licensed sob [MIT](./LICENSE_MIT) e [Apache 2.0](./LICENSE_APACHE).
