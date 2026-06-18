// Tipos do domínio — receita, ingrediente, instrução, filtros.
// Modelados com base na Spoonacular API (mas mantidos simples/agnósticos).

export interface Ingrediente {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  imagemUrl?: string;
}

export interface PassoPreparo {
  numero: number;
  descricao: string;
}

export interface Receita {
  id: number;
  titulo: string;
  imagemUrl: string;
  tempoPreparoMin: number;
  porcoes: number;
  resumo?: string;
  categorias: string[];      // ex: ["vegan", "low-carb"]
  ingredientes: Ingrediente[];
  passos: PassoPreparo[];
}

// Versão "leve" da receita — usada em listas/cards.
// Inclui resumo curto e prévia de ingredientes (nomes) pra mostrar no card.
export interface ReceitaResumo {
  id: number;
  titulo: string;
  imagemUrl: string;
  tempoPreparoMin: number;
  porcoes: number;
  categorias: string[];
  resumo?: string;                // descrição curta (texto puro, já sem HTML)
  ingredientesPreview: string[];  // só nomes, pra renderizar como chips
}

// --- Opções dos filtros (valores aceitos pela Spoonacular) ---
// https://spoonacular.com/food-api/docs#Diets — 11 dietas
export const DIETAS = [
  { valor: 'gluten free',     rotulo: 'Sem glúten' },
  { valor: 'ketogenic',       rotulo: 'Cetogênica' },
  { valor: 'vegetarian',      rotulo: 'Vegetariana' },
  { valor: 'lacto-vegetarian',rotulo: 'Lacto-vegetariana' },
  { valor: 'ovo-vegetarian',  rotulo: 'Ovo-vegetariana' },
  { valor: 'vegan',           rotulo: 'Vegana' },
  { valor: 'pescetarian',     rotulo: 'Pescetariana' },
  { valor: 'paleo',           rotulo: 'Paleo' },
  { valor: 'primal',          rotulo: 'Primal' },
  { valor: 'low fodmap',      rotulo: 'Low FODMAP' },
  { valor: 'whole30',         rotulo: 'Whole30' },
] as const;

// https://spoonacular.com/food-api/docs#Intolerances — 12 intolerâncias
export const INTOLERANCIAS = [
  { valor: 'dairy',     rotulo: 'Lactose' },
  { valor: 'egg',       rotulo: 'Ovo' },
  { valor: 'gluten',    rotulo: 'Glúten' },
  { valor: 'grain',     rotulo: 'Grãos' },
  { valor: 'peanut',    rotulo: 'Amendoim' },
  { valor: 'seafood',   rotulo: 'Frutos do mar' },
  { valor: 'sesame',    rotulo: 'Gergelim' },
  { valor: 'shellfish', rotulo: 'Crustáceos' },
  { valor: 'soy',       rotulo: 'Soja' },
  { valor: 'sulfite',   rotulo: 'Sulfito' },
  { valor: 'tree nut',  rotulo: 'Castanhas' },
  { valor: 'wheat',     rotulo: 'Trigo' },
] as const;

// https://spoonacular.com/food-api/docs#Cuisines — 25 cozinhas
export const CUISINES = [
  { valor: 'african',         rotulo: 'Africana' },
  { valor: 'american',        rotulo: 'Americana' },
  { valor: 'asian',           rotulo: 'Asiática' },
  { valor: 'british',         rotulo: 'Britânica' },
  { valor: 'cajun',           rotulo: 'Cajun' },
  { valor: 'caribbean',       rotulo: 'Caribenha' },
  { valor: 'chinese',         rotulo: 'Chinesa' },
  { valor: 'eastern european',rotulo: 'Leste Europeu' },
  { valor: 'european',        rotulo: 'Europeia' },
  { valor: 'french',          rotulo: 'Francesa' },
  { valor: 'german',          rotulo: 'Alemã' },
  { valor: 'greek',           rotulo: 'Grega' },
  { valor: 'indian',          rotulo: 'Indiana' },
  { valor: 'irish',           rotulo: 'Irlandesa' },
  { valor: 'italian',         rotulo: 'Italiana' },
  { valor: 'japanese',        rotulo: 'Japonesa' },
  { valor: 'jewish',          rotulo: 'Judaica' },
  { valor: 'korean',          rotulo: 'Coreana' },
  { valor: 'latin american',  rotulo: 'Latina' },
  { valor: 'mediterranean',   rotulo: 'Mediterrânea' },
  { valor: 'mexican',         rotulo: 'Mexicana' },
  { valor: 'middle eastern',  rotulo: 'Oriente Médio' },
  { valor: 'nordic',          rotulo: 'Nórdica' },
  { valor: 'southern',        rotulo: 'Sulista' },
  { valor: 'spanish',         rotulo: 'Espanhola' },
  { valor: 'thai',            rotulo: 'Tailandesa' },
  { valor: 'vietnamese',      rotulo: 'Vietnamita' },
] as const;

// https://spoonacular.com/food-api/docs#Meal-Types — 14 tipos
export const MEAL_TYPES = [
  { valor: 'main course', rotulo: 'Prato principal' },
  { valor: 'side dish',   rotulo: 'Acompanhamento' },
  { valor: 'dessert',     rotulo: 'Sobremesa' },
  { valor: 'appetizer',   rotulo: 'Aperitivo' },
  { valor: 'salad',       rotulo: 'Salada' },
  { valor: 'bread',       rotulo: 'Pão' },
  { valor: 'breakfast',   rotulo: 'Café da manhã' },
  { valor: 'soup',        rotulo: 'Sopa' },
  { valor: 'beverage',    rotulo: 'Bebida' },
  { valor: 'sauce',       rotulo: 'Molho' },
  { valor: 'marinade',    rotulo: 'Marinada' },
  { valor: 'fingerfood',  rotulo: 'Petisco' },
  { valor: 'snack',       rotulo: 'Lanche' },
  { valor: 'drink',       rotulo: 'Drink' },
] as const;

// Filtros aplicados na busca
export interface FiltrosBusca {
  termo: string;              // busca por nome de receita
  ingredientes: string[];     // múltiplos ingredientes
  dietas: string[];           // múltiplas dietas
  intolerancias: string[];    // múltiplas intolerâncias
  cuisines: string[];         // múltiplas cozinhas
  mealTypes: string[];        // múltiplos tipos de refeição
}

export const FILTROS_INICIAIS: FiltrosBusca = {
  termo: '',
  ingredientes: [],
  dietas: [],
  intolerancias: [],
  cuisines: [],
  mealTypes: [],
};

// Estado das requisições
export type StatusRequisicao = 'idle' | 'carregando' | 'sucesso' | 'erro';
