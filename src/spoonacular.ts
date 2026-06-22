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
  summary?: string;
  extendedIngredients?: Array<{ name: string }>;
}

interface SpoonComplexSearchResponse {
  results: SpoonSearchResultItem[];
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
function mapearResumo(item: SpoonSearchResultItem): ReceitaResumo {
  // Extrai os ingredientes primeiro de forma segura garantindo que seja um array válido
  const ingredientes = Array.isArray(item.extendedIngredients)
    ? item.extendedIngredients.map((ing) => ing.name)
    : [];

  return {
    id: item.id,
    titulo: item.title || "",
    imagemUrl: item.image || "",
    tempoPreparoMin: item.readyInMinutes ?? 30, // Fallback se vier zerado/null
    porcoes: item.servings ?? 2,
    categorias: item.dishTypes ?? [],
    resumo: encurtar(limparHtml(item.summary)) || "",
    ingredientesPreview: ingredientes.slice(0, 4), // Corta com segurança sem quebrar o .slice()
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
}

export async function buscarReceitas(
  params: ParametrosBusca
): Promise<ReceitaResumo[]> {
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

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Falha na busca: ${res.status}`);

  const data: SpoonComplexSearchResponse = await res.json();
  return data.results.map(mapearResumo);
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