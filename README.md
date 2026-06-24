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

### Login
![Login](./screenshots/1%20-%20Login.png)

### Home
![Home](./screenshots/2.1%20-%20Home%20.png)
![Home](./screenshots/2.2%20-%20Home.png)

### Busca
![Busca sem filtros](./screenshots/3.1%20-%20SearchNotFiltered.png)
![Busca sem filtros](./screenshots/3.2%20-%20SearchNotFiltered.png)
![Busca sem filtros](./screenshots/3.3%20-%20SearchNotFiltered.png)
![Filtrada por ingrediente](./screenshots/3.4%20-%20FilteredByIngredient.png)
![Filtrada por dieta](./screenshots/3.5%20-%20FilteredByDiet.png)
![Filtrada por dieta e intolerância](./screenshots/3.6%20-%20FilteredByDietAndIntolerance.png)
![Filtrada por cozinha e tipo](./screenshots/3.7%20-%20FilteredByCuisineAndType.png)
![Busca por nome](./screenshots/3.8%20-%20SearchByName.png)

### Detalhes de Receita
![Detalhes da receita](./screenshots/4.1%20-%20RecipeDetails.png)
![Detalhes da receita](./screenshots/4.2%20-%20RecipeDetails.png)

### Favoritos (Colher de Ouro)
![Favoritos](./screenshots/5.1%20-%20GoldenSpoon.png)

### Salvos para Depois
![Salvos para depois](./screenshots/5.2%20-%20SaveForLater.png)

### Sobre
![Sobre](./screenshots/6.1%20-%20About.png)
![Sobre](./screenshots/6.2%20-%20About.png)

### Política de Privacidade
![Política de Privacidade](./screenshots/7.1%20-%20PrivacyPolicy.png)
![Política de Privacidade](./screenshots/7.2%20-%20PrivacyPolicy.png)

### Favoritar e salvar
![Marcar como favorito](./screenshots/Y.1%20-%20ToBeFave.png)
![Marcar para salvar](./screenshots/Y.2%20-%20ToBeSaved.png)
![Favoritos e salvos](./screenshots/Y.3%20-%20SavedFave.png)

### Perfil
![Ícone de perfil](./screenshots/X%20-%20Profile%20Icon.png)

## Time

Projeto desenvolvido por:

- Bruno Inácio
- Jéssica Gaspar
- Júlia de Bona
- Victória Branco

Student interns do programa **Start Coding** (SAP + Ada Tech).

## Licença

Projeto acadêmico, sem fins comerciais.
