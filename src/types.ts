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
  ingredientesPreview: string[];  // só nomes, pra renderizar como chips (curto, exibição)
  ingredientesParaFiltro?: string[]; // lista completa de ingredientes (lowercase), usada
                                     // apenas em filtros client-side. Não exibida na UI.
  // Campos derivados pra filtragem client-side eficiente (sem string match).
  // Opcionais pra compatibilidade com mocks antigos.
  dietas?: string[];              // valores tipo "vegan", "gluten free"
  cuisines?: string[];            // valores tipo "italian"
  mealTypes?: string[];           // valores tipo "breakfast", "main course"
  dairyFree?: boolean;            // flag pra filtro de intolerância "dairy"
  glutenFree?: boolean;           // flag pra filtro de intolerância "gluten"
}

// --- Opções dos filtros (valores aceitos pela Spoonacular) ---
// https://spoonacular.com/food-api/docs#Diets — 11 dietas
export const DIETAS = [
  { valor: 'gluten free',          rotulo: 'Gluten-Free' },
  { valor: 'ketogenic',            rotulo: 'Ketogenic' },
  { valor: 'vegetarian',           rotulo: 'Vegetarian' },
  { valor: 'lacto ovo vegetarian', rotulo: 'Lacto-Ovo Vegetarian' },
  { valor: 'vegan',                rotulo: 'Vegan' },
  { valor: 'pescetarian',          rotulo: 'Pescatarian' },
  { valor: 'paleo',                rotulo: 'Paleo' },
  { valor: 'primal',               rotulo: 'Primal' },
  { valor: 'low fodmap',           rotulo: 'Low FODMAP' },
  { valor: 'whole30',              rotulo: 'Whole30' },
] as const;

// https://spoonacular.com/food-api/docs#Intolerances — 12 intolerâncias
export const INTOLERANCIAS = [
  { valor: 'dairy',     rotulo: 'Dairy' },
  { valor: 'egg',       rotulo: 'Egg' },
  { valor: 'gluten',    rotulo: 'Gluten' },
  { valor: 'grain',     rotulo: 'Grains' },
  { valor: 'peanut',    rotulo: 'Peanut' },
  { valor: 'seafood',   rotulo: 'Seafood' },
  { valor: 'sesame',    rotulo: 'Sesame' },
  { valor: 'shellfish', rotulo: 'Shellfish' },
  { valor: 'soy',       rotulo: 'Soy' },
  { valor: 'sulfite',   rotulo: 'Sulfite' },
  { valor: 'tree nut',  rotulo: 'Tree Nuts' },
  { valor: 'wheat',     rotulo: 'Wheat' },
] as const;

// https://spoonacular.com/food-api/docs#Cuisines — 25 cozinhas
export const CUISINES = [
  { valor: 'african',         rotulo: 'African' },
  { valor: 'american',        rotulo: 'American' },
  { valor: 'asian',           rotulo: 'Asian' },
  { valor: 'british',         rotulo: 'British' },
  { valor: 'cajun',           rotulo: 'Cajun' },
  { valor: 'caribbean',       rotulo: 'Caribbean' },
  { valor: 'chinese',         rotulo: 'Chinese' },
  { valor: 'eastern european',rotulo: 'Eastern European' },
  { valor: 'european',        rotulo: 'European' },
  { valor: 'french',          rotulo: 'French' },
  { valor: 'german',          rotulo: 'German' },
  { valor: 'greek',           rotulo: 'Greek' },
  { valor: 'indian',          rotulo: 'Indian' },
  { valor: 'irish',           rotulo: 'Irish' },
  { valor: 'italian',         rotulo: 'Italian' },
  { valor: 'japanese',        rotulo: 'Japanese' },
  { valor: 'jewish',          rotulo: 'Jewish' },
  { valor: 'korean',          rotulo: 'Korean' },
  { valor: 'latin american',  rotulo: 'Latin American' },
  { valor: 'mediterranean',   rotulo: 'Mediterranean' },
  { valor: 'mexican',         rotulo: 'Mexican' },
  { valor: 'middle eastern',  rotulo: 'Middle Eastern' },
  { valor: 'nordic',          rotulo: 'Nordic' },
  { valor: 'southern',        rotulo: 'Southern' },
  { valor: 'spanish',         rotulo: 'Spanish' },
  { valor: 'thai',            rotulo: 'Thai' },
  { valor: 'vietnamese',      rotulo: 'Vietnamese' },
] as const;

// https://spoonacular.com/food-api/docs#Meal-Types — 14 tipos
export const MEAL_TYPES = [
  { valor: 'main course', rotulo: 'Main Course' },
  { valor: 'side dish',   rotulo: 'Side Dish' },
  { valor: 'dessert',     rotulo: 'Dessert' },
  { valor: 'appetizer',   rotulo: 'Appetizer' },
  { valor: 'salad',       rotulo: 'Salad' },
  { valor: 'bread',       rotulo: 'Bread' },
  { valor: 'breakfast',   rotulo: 'Breakfast' },
  { valor: 'soup',        rotulo: 'Soup' },
  { valor: 'beverage',    rotulo: 'Beverage' },
  { valor: 'sauce',       rotulo: 'Sauce' },
  { valor: 'marinade',    rotulo: 'Marinade' },
  { valor: 'fingerfood',  rotulo: 'Fingerfood' },
  { valor: 'snack',       rotulo: 'Snack' },
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
