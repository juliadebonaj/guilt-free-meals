# GuiltFreeMeal

Aplicação de receitas saudáveis construída em React, com busca, favoritos e receitas salvas. Projeto desenvolvido no módulo de React do programa **Start Coding** (parceria SAP + Ada Tech).

## Sobre o projeto

GuiltFreeMeal ajuda você a encontrar receitas que fazem bem sem transformar comida em obrigação. Sem culpa, sem obsessão — só comida boa.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router v7
- Emotion (styled components)
- Spoonacular API

## Como rodar

```bash
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev

# build de produção
npm run build

# preview do build
npm run preview
```

A aplicação estará disponível em `http://localhost:5173`.

## Configuração

Crie um arquivo `.env` na raiz do projeto com a sua chave da Spoonacular:

```
VITE_SPOONACULAR_API_KEY=sua_chave_aqui
```

## Funcionalidades

- Busca de receitas por nome e filtros
- Visualização detalhada com ingredientes e modo de preparo
- Favoritar receitas
- Salvar receitas para depois
- Login simples com persistência local
- Cache de receitas no `localStorage`
- Página About e Política de Privacidade

## Screenshots

<!-- Adicione as imagens em /public ou /docs e atualize os caminhos abaixo -->

### Home
![Home](./docs/screenshots/home.png)

### Busca
![Busca](./docs/screenshots/busca.png)

### Detalhes da receita
![Detalhes da receita](./docs/screenshots/detalhes.png)

### Favoritos
![Favoritos](./docs/screenshots/favoritos.png)

### Sobre
![Sobre](./docs/screenshots/sobre.png)

## Time

Projeto desenvolvido por:

- Bruno Inácio
- Jéssica Gaspar
- Júlia de Bona
- Victória Branco

Student interns do programa **Start Coding** (SAP + Ada Tech).

## Licença

Projeto acadêmico, sem fins comerciais.
