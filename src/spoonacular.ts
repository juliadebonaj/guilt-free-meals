// Serviço de integração com a Spoonacular API.
// Documentação: https://spoonacular.com/food-api/docs
// IMPORTANTE: criar .env.local na raiz com VITE_SPOONACULAR_API_KEY=sua_chave_aqui

import type { Receita, ReceitaResumo } from './types';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

if (!API_KEY) {
  console.warn(
    '[Spoonacular] VITE_SPOONACULAR_API_KEY não definida. Crie um arquivo .env.local na raiz.'
  );
}

// --- Tipos crus da resposta da API ---
interface SpoonSearchResultItem {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  dishTypes?: string[];
  diets?: string[];
  cuisines?: string[];
  summary?: string;
  extendedIngredients?: Array<{ name: string }>;
  // Flags booleanas — fonte mais confiável de classificação dietética
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  lowFodmap?: boolean;
  veryHealthy?: boolean;
  ketogenic?: boolean;
}

interface SpoonComplexSearchResponse {
  results: SpoonSearchResultItem[];
  offset: number;
  number: number;
  totalResults: number;
}

interface SpoonRecipeInfoResponse {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary?: string;
  dishTypes?: string[];
  diets?: string[];
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    image?: string;
  }>;
  analyzedInstructions: Array<{
    steps: Array<{ number: number; step: string }>;
  }>;
}

// --- Helpers ---

// O summary da Spoonacular vem com tags HTML — limpa pra texto puro.
function limparHtml(texto: string | undefined): string | undefined {
  if (!texto) return undefined;
  return texto
    .replace(/<[^>]*>/g, '')           // remove tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Encurta a descrição pra caber no card (corta na palavra).
function encurtar(texto: string | undefined, max = 140): string | undefined {
  if (!texto) return undefined;
  if (texto.length <= max) return texto;
  const cortado = texto.slice(0, max);
  const ultimoEspaco = cortado.lastIndexOf(' ');
  return cortado.slice(0, ultimoEspaco > 0 ? ultimoEspaco : max) + '…';
}

// --- Mapeadores: resposta da API → tipos internos ---

// A Spoonacular devolve alguns rótulos de dieta em formato diferente dos valores
// que usamos no app (constantes em types.ts). Mapeia sinônimos pra normalizar.
const DIET_ALIASES: Record<string, string> = {
  'paleolithic': 'paleo',
  'whole 30': 'whole30',
  'pescatarian': 'pescetarian', // API usa 'pescatarian', app usa 'pescetarian'
  // 'lacto ovo vegetarian' fica como está — a API agrupa lacto/ovo nessa única tag,
  // e adicionamos esse valor à constante DIETAS de types.ts.
};

function normalizarDieta(d: string): string {
  const key = d.trim().toLowerCase();
  return DIET_ALIASES[key] ?? key;
}

function mapearResumo(item: SpoonSearchResultItem): ReceitaResumo {
  // Extrai os ingredientes primeiro de forma segura garantindo que seja um array válido
  const ingredientes = Array.isArray(item.extendedIngredients)
    ? item.extendedIngredients.map((ing) => ing.name)
    : [];

  // Dietas: combinamos o que vier em `diets` (string[]) COM as flags booleanas.
  // Algumas dietas só aparecem como flag; outras só em `diets`. Set deduplica.
  const dietasDerivadas = new Set<string>(
    (item.diets ?? []).map(normalizarDieta)
  );
  if (item.vegetarian)   dietasDerivadas.add('vegetarian');
  if (item.vegan)        dietasDerivadas.add('vegan');
  if (item.glutenFree)   dietasDerivadas.add('gluten free');
  if (item.lowFodmap)    dietasDerivadas.add('low fodmap');
  if (item.ketogenic)    dietasDerivadas.add('ketogenic');

  // Cuisines da API vêm capitalizadas (`Cajun`, `Italian`); normalizamos pra lowercase
  // pra casar com os valores das constantes em types.ts.
  const cuisines = (item.cuisines ?? []).map((c) => c.trim().toLowerCase());

  // dishTypes já vêm em lowercase, mas garantimos.
  const mealTypes = (item.dishTypes ?? []).map((m) => m.trim().toLowerCase());

  // Categorias para o card: tipos de prato + cozinhas + dietas (já normalizados)
  const categorias = [
    ...mealTypes,
    ...cuisines,
    ...Array.from(dietasDerivadas),
  ];

  return {
    id: item.id,
    titulo: item.title || "",
    imagemUrl: item.image || "",
    tempoPreparoMin: item.readyInMinutes ?? 30,
    porcoes: item.servings ?? 2,
    categorias,
    dietas: Array.from(dietasDerivadas),
    cuisines,
    mealTypes,
    dairyFree: item.dairyFree ?? false,
    glutenFree: item.glutenFree ?? false,
    resumo: encurtar(limparHtml(item.summary)) || "",
    ingredientesPreview: ingredientes.slice(0, 4),
  };
}

function mapearReceitaCompleta(data: SpoonRecipeInfoResponse): Receita {
  return {
    id: data.id,
    titulo: data.title,
    imagemUrl: data.image,
    tempoPreparoMin: data.readyInMinutes,
    porcoes: data.servings,
    resumo: limparHtml(data.summary),
    categorias: [...(data.dishTypes ?? []), ...(data.diets ?? [])],
    ingredientes: data.extendedIngredients.map((ing) => ({
      id: ing.id,
      nome: ing.name,
      quantidade: ing.amount,
      unidade: ing.unit,
      imagemUrl: ing.image
        ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
        : undefined,
    })),
    passos: data.analyzedInstructions[0]?.steps.map((s) => ({
      numero: s.number,
      descricao: s.step,
    })) ?? [],
  };
}

// --- Funções públicas do serviço ---

export interface ParametrosBusca {
  termo?: string;
  ingredientes?: string[];     // múltiplos — vão como CSV pra API
  dietas?: string[];           // múltiplas
  intolerancias?: string[];    // múltiplas
  cuisines?: string[];         // múltiplas
  mealTypes?: string[];        // múltiplos
  numero?: number;
  offset?: number;             // pula os N primeiros resultados (paginação)
}

export interface ResultadoBusca {
  receitas: ReceitaResumo[];
  total: number;               // total de receitas disponíveis pros mesmos filtros
  offset: number;
  numero: number;
}

export async function buscarReceitas(
  params: ParametrosBusca
): Promise<ResultadoBusca> {
  // Instancia a URL limpa apontando para a rota de busca complexa
  const url = new URL(`${BASE_URL}/complexSearch`);
  url.searchParams.set('apiKey', API_KEY ?? '');

  if (params.termo) url.searchParams.set('query', params.termo);

  if (params.ingredientes && params.ingredientes.length > 0) {
    url.searchParams.set('includeIngredients', params.ingredientes.join(','));
  }

  if (params.dietas && params.dietas.length > 0) {
    // Spoonacular aceita várias dietas separadas por "|" (OR) ou "," (AND)
    url.searchParams.set('diet', params.dietas.join(','));
  }

  if (params.intolerancias && params.intolerancias.length > 0) {
    url.searchParams.set('intolerances', params.intolerancias.join(','));
  }

  if (params.cuisines && params.cuisines.length > 0) {
    url.searchParams.set('cuisine', params.cuisines.join(','));
  }

  if (params.mealTypes && params.mealTypes.length > 0) {
    url.searchParams.set('type', params.mealTypes[0]);
  }

  // Parâmetros cruciais para que a resposta venha com resumo e ingredientes para os cards
  url.searchParams.set('addRecipeInformation', 'true');
  url.searchParams.set('fillIngredients', 'true');
  url.searchParams.set('number', String(params.numero ?? 12));
  url.searchParams.set('offset', String(params.offset ?? 0));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Falha na busca: ${res.status}`);

  const data: SpoonComplexSearchResponse = await res.json();
  return {
    receitas: data.results.map(mapearResumo),
    total: data.totalResults ?? data.results.length,
    offset: data.offset ?? 0,
    numero: data.number ?? data.results.length,
  };
}

export async function buscarReceitaPorId(id: number): Promise<Receita> {
  // Instancia a URL limpa apontando para os detalhes da receita
  const url = new URL(`${BASE_URL}/${id}/information`);
  url.searchParams.set('apiKey', API_KEY ?? '');
  url.searchParams.set('includeNutrition', 'false');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Falha ao carregar receita: ${res.status}`);

  const data: SpoonRecipeInfoResponse = await res.json();
  return mapearReceitaCompleta(data);
}

// Pool inicial — chamada feita UMA vez por usuário (cacheada em localStorage).
// Garante que toda receita do pool tenha pelo menos UMA dieta atribuída,
// passando as 11 dietas em OR via separador "|" (semântica do Spoonacular).
const TODAS_AS_DIETAS = [
  'gluten free',
  'ketogenic',
  'vegetarian',
  'lacto ovo vegetarian',
  'vegan',
  'pescetarian',
  'paleo',
  'primal',
  'low fodmap',
  'whole30',
];

export async function buscarPoolInicial(numero = 50): Promise<ReceitaResumo[]> {
  const url = new URL(`${BASE_URL}/complexSearch`);
  url.searchParams.set('apiKey', API_KEY ?? '');
  url.searchParams.set('diet', TODAS_AS_DIETAS.join('|')); // OR
  url.searchParams.set('addRecipeInformation', 'true');
  url.searchParams.set('fillIngredients', 'true');
  url.searchParams.set('number', String(numero));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Falha no pool inicial: ${res.status}`);

  const data: SpoonComplexSearchResponse = await res.json();
  return data.results.map(mapearResumo);
}