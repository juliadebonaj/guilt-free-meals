# GuiltFreeMeal — Scratch / Plano de Arquitetura

> Catálogo de receitas saudáveis, minimalista e elegante.

---

## Identidade visual

**Estilo:** minimalista, sereno, foco no conteúdo (a receita).

**Paleta — Oatmeal monocromática (sage):**

| Token | Hex | Uso |
|---|---|---|
| `sage.900` | `#92957E` | CTAs, links ativos, header em destaque |
| `sage.700` | `#AAAC9A` | Texto secundário sobre fundo claro |
| `sage.500` | `#C1C3B6` | Bordas, divisores |
| `sage.300` | `#D9DAD2` | Borda padrão |
| `sage.100` | `#F1F1EE` | Fundo de seções |

**Paleta secundária — neutros bege/cream:**

| Token | Hex | Uso |
|---|---|---|
| `cream.900` | `#CFC8B9` | Acento quente |
| `cream.700` | `#D9D2C5` | Hover de cards |
| `cream.500` | `#E2DCD2` | Botão secundário |
| `cream.300` | `#EAE6DD` | Backgrounds alternados |
| `cream.100` | `#F2EFE9` | **Fundo principal da app** |

**Tipografia:**
- **Header / títulos:** `Fraunces` — serifada moderna, com itálicos lindos. Carregada via Google Fonts.
- **Corpo:** `Inter` — sans-serif neutra e altamente legível.

> O logo do header usa Fraunces em itálico, peso 500 — assinatura visual do app.

---

## Mapa de requisitos → aulas → arquivos

| Requisito | Aula | Onde no código |
|---|---|---|
| UI responsiva com CSS-in-JS | Aula 6 | `src/styles/theme.ts`, todos os `*.tsx` com `styled` |
| Estado global Context + useReducer | Aula 2 | `src/contexts/ReceitasContext.tsx` |
| API externa (loading/erro/sucesso) | Aula 1 + 2 | `src/services/spoonacular.ts` + actions `BUSCA_*` |
| Roteamento | Aula 3-4 | `src/routes/router.tsx`, `RootLayout.tsx` |
| Busca por nome/ingrediente/categoria | Aula 1 | `src/pages/Search/`, `src/hooks/useDebounce.ts` |
| Favoritas (com persistência) | Aula 1 + 2 | `src/pages/Favorites/`, `useLocalStorage.ts` |
| Página de detalhes | Aula 3 | `src/pages/RecipeDetails/`, `useParams` |
| **Extras (pontos):** | | |
| Lazy loading / code splitting | Aula 4 + 5 | `lazy: async () => …` em `routes/router.tsx` |
| `React.memo` em itens de lista | Aula 5 | `CardReceita` está memoizado |
| Acessibilidade | Bônus | `:focus-visible` global, `role`, `aria-label`, tags semânticas |

---

## Estrutura de pastas

```
src/
├── assets/                  imagens estáticas
├── components/
│   ├── layout/              Header, Footer
│   └── ui/                  Button, Card, Spinner, Input, Badge — base reutilizável
├── contexts/                ReceitasContext (Provider + hook customizado)
├── features/                lógica por domínio (recipes, favorites, search, filters)
├── hooks/                   useLocalStorage, useDebounce, useFetch (futuro)
├── pages/                   1 pasta por rota — cada uma é um chunk lazy
├── routes/                  router.tsx + RootLayout.tsx
├── services/                spoonacular.ts (camada de API)
├── styles/                  theme.ts, GlobalStyles.tsx
├── types/                   contratos do domínio (Receita, Ingrediente, etc.)
├── utils/                   helpers genéricos
├── App.tsx                  providers (Theme + Estado) + Router
└── main.tsx                 entry point
```

> **Regra:** componentes `ui/` são "burros" (só recebem props). Componentes em `pages/` e `features/` consomem o contexto, despacham ações e compõem os `ui/`.

---

## Roteiro de implementação (ordem sugerida)

### Sprint 1 — Setup & fundação (1-2 dias)
1. `npm create vite@latest` na raiz, depois copiar o conteúdo de `src/` para dentro.
2. Instalar deps: `npm i @emotion/react @emotion/styled react-router-dom`
3. Criar conta na Spoonacular, copiar `.env.example` → `.env.local` com a chave.
4. Rodar `npm run dev` e ver o Hero da home.

### Sprint 2 — Busca + listagem (2-3 dias)
1. Implementar `pages/Search/Search.tsx`:
   - input controlado + `useDebounce`
   - `useEffect` chama `buscarReceitas` quando o debounce muda
   - dispatch `BUSCA_INICIADA` → `BUSCA_SUCESSO` / `BUSCA_ERRO`
2. Renderizar grid de `CardReceita` com `state.receitas`.
3. Estados: spinner durante carregamento, mensagem de erro, "nenhum resultado".

### Sprint 3 — Detalhes + favoritas (2 dias)
1. `pages/RecipeDetails/`: usar `useParams`, chamar `buscarReceitaPorId`.
2. Botão "salvar favorita" → `dispatch FAVORITA_ADICIONADA / REMOVIDA`.
3. Persistir favoritas com `useLocalStorage` (sincronizar com o reducer).

### Sprint 4 — Filtros + polimento (1-2 dias)
1. Filtros por categoria/ingrediente (combobox, chips).
2. Acessibilidade: revisar `aria-label`, contraste, navegação por teclado.
3. Responsividade: testar em mobile / tablet / desktop.

### Sprint 5 — Diferenciais (opcional)
- Confirmar que o lazy loading está dividindo chunks (DevTools → Network).
- Memoizar listas pesadas com `useMemo` se o Profiler apontar gargalo.
- Deploy no Vercel/Netlify.

---

## Divisão sugerida de tarefas (3 pessoas no grupo)

| Pessoa | Domínios |
|---|---|
| **Dev A** | `services/spoonacular.ts`, `hooks/`, contexto + reducer |
| **Dev B** | `routes/`, `pages/Home`, `pages/Search`, `pages/Favorites` |
| **Dev C** | `styles/`, `components/ui/`, `components/layout/`, responsividade |

> Trabalhem em **branches separadas** por feature (`feat/busca`, `feat/favoritas`, `feat/tema`) e abram PRs entre vocês para revisão — o próprio enunciado pede.

---

## Checklist de entrega

- [ ] README.md explicando como rodar (clone + `.env.local` + `npm install` + `npm run dev`)
- [ ] App rodando localmente
- [ ] Os 5 requisitos obrigatórios funcionais
- [ ] Pelo menos 1 diferencial (lazy loading já está pronto no scratch)
- [ ] Repositório no GitHub do grupo
- [ ] (Opcional) Deploy publicado

---

## Próximos passos

1. Rodar o setup (Sprint 1) e ver o Hero ao vivo.
2. Implementar a busca (Sprint 2) — é o coração do app.
3. Os outros arquivos `TODO` em `pages/` já têm comentários com a estrutura a seguir.
