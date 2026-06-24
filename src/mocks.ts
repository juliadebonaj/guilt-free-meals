// Mock de receitas para a vitrine da home — sem dependência da API.
// Imagens do Unsplash (free, sem necessidade de chave).
//
// Cada mock tem campos extras (cuisine, mealType, dietas, intolerancias) que
// permitem filtrar localmente — usados como fallback quando a API não responde.

import type { Receita, ReceitaResumo, FiltrosBusca } from './types';

// Estendemos ReceitaResumo com metadados pra filtragem local
export interface ReceitaMock extends ReceitaResumo {
  cuisine?: string;            // valor da CUISINES (ex: 'italian')
  mealType?: string;           // valor de MEAL_TYPES (ex: 'breakfast')
  dietas: string[];            // valores de DIETAS aplicáveis
  intoleranciasContem: string[]; // ingredientes/categorias que CONTÊM (filtra OUT)
}

export const RECEITAS_DESTAQUE: ReceitaMock[] = [
  {
    id: 1001,
    titulo: 'Quinoa Bowl with Avocado',
    imagemUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tempoPreparoMin: 25,
    porcoes: 2,
    categorias: ['vegan', 'gluten free'],
    resumo:
      'A colorful and nutritious bowl, perfect for lunch. Combines quinoa, creamy avocado, chickpeas and fresh greens with a light lemon dressing.',
    ingredientesPreview: ['quinoa', 'avocado', 'chickpeas', 'arugula', 'lemon'],
    cuisine: 'mediterranean',
    mealType: 'main course',
    dietas: ['vegan', 'vegetarian', 'gluten free', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: [],
  },
  {
    id: 1002,
    titulo: 'Grilled Salmon with Asparagus',
    imagemUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    tempoPreparoMin: 20,
    porcoes: 2,
    categorias: ['pescetarian', 'low carb'],
    resumo:
      'Succulent salmon grilled in herbed butter, accompanied by crispy asparagus. A quick, elegant, flavorful recipe.',
    ingredientesPreview: ['salmon', 'asparagus', 'butter', 'garlic', 'lemon', 'thyme'],
    cuisine: 'french',
    mealType: 'main course',
    dietas: ['pescetarian', 'gluten free', 'ketogenic', 'paleo', 'primal'],
    intoleranciasContem: ['dairy', 'seafood'],
  },
  {
    id: 1003,
    titulo: 'Banana and Oat Pancakes',
    imagemUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80',
    tempoPreparoMin: 15,
    porcoes: 3,
    categorias: ['vegetarian', 'breakfast'],
    resumo:
      'Healthy and fluffy breakfast, no refined flour. Naturally sweet with banana and sweetened only with honey.',
    ingredientesPreview: ['banana', 'oats', 'egg', 'milk', 'cinnamon'],
    cuisine: 'american',
    mealType: 'breakfast',
    dietas: ['vegetarian', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: ['egg', 'dairy', 'gluten', 'grain', 'wheat'],
  },
  {
    id: 1004,
    titulo: 'Caprese Salad with Pesto',
    imagemUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    tempoPreparoMin: 10,
    porcoes: 2,
    categorias: ['vegetarian', 'italian'],
    resumo:
      'Italian classic in its simplest, most elegant form: ripe tomato, buffalo mozzarella, fresh basil and a touch of homemade pesto.',
    ingredientesPreview: ['tomato', 'mozzarella', 'basil', 'pesto', 'olive oil'],
    cuisine: 'italian',
    mealType: 'salad',
    dietas: ['vegetarian', 'gluten free', 'lacto-vegetarian', 'primal'],
    intoleranciasContem: ['dairy', 'tree nut'],
  },
  {
    id: 1005,
    titulo: 'Thai Vegetable Curry',
    imagemUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    tempoPreparoMin: 35,
    porcoes: 4,
    categorias: ['vegan', 'thai'],
    resumo:
      'Creamy red curry with coconut milk, squash, bell pepper and broccoli. Aromatic, perfectly spiced and comforting.',
    ingredientesPreview: ['coconut milk', 'curry', 'squash', 'broccoli', 'ginger'],
    cuisine: 'thai',
    mealType: 'main course',
    dietas: ['vegan', 'vegetarian', 'gluten free', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: [],
  },
  {
    id: 1006,
    titulo: 'Acai Bowl with Fruits',
    imagemUrl: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80',
    tempoPreparoMin: 8,
    porcoes: 1,
    categorias: ['vegan', 'breakfast'],
    resumo:
      'Creamy acai topped with banana, strawberry, granola and a drizzle of honey. A fresh and energetic snack for any time of day.',
    ingredientesPreview: ['acai', 'banana', 'strawberry', 'granola', 'honey'],
    cuisine: 'latin american',
    mealType: 'breakfast',
    dietas: ['vegetarian', 'lacto-vegetarian', 'ovo-vegetarian', 'vegan'],
    intoleranciasContem: ['gluten', 'grain', 'wheat'],
  },
];

/**
 * Filtra os mocks aplicando os mesmos filtros que iríamos mandar pra API.
 * Lógica de cada filtro:
 *   - termo: busca case-insensitive no título
 *   - ingredientes: receita precisa conter TODOS os ingredientes pedidos (na preview)
 *   - dietas: receita precisa atender a TODAS as dietas selecionadas
 *   - intolerâncias: receita NÃO pode conter NENHUMA das intolerâncias
 *   - cuisine/mealType: precisa bater exatamente (radio)
 */
export function filtrarMocks(filtros: FiltrosBusca): ReceitaMock[] {
  return RECEITAS_DESTAQUE.filter((r) => {
    if (filtros.termo) {
      const t = filtros.termo.toLowerCase();
      // Match apenas no início de alguma palavra do título
      const palavras = r.titulo.toLowerCase().split(/\s+/);
      if (!palavras.some((p) => p.startsWith(t))) return false;
    }

    if (filtros.ingredientes.length > 0) {
      const preview = r.ingredientesPreview.map((i) => i.toLowerCase());
      const todos = filtros.ingredientes.every((ing) => {
        const alvo = ing.toLowerCase();
        // Match no início de alguma palavra do ingrediente
        return preview.some((p) =>
          p.split(/\s+/).some((parte) => parte.startsWith(alvo))
        );
      });
      if (!todos) return false;
    }

    if (filtros.dietas.length > 0) {
      const todasDietas = filtros.dietas.every((d) => r.dietas.includes(d));
      if (!todasDietas) return false;
    }

    if (filtros.intolerancias.length > 0) {
      const conflito = filtros.intolerancias.some((i) =>
        r.intoleranciasContem.includes(i)
      );
      if (conflito) return false;
    }

    if (filtros.cuisines.length > 0 && filtros.cuisines[0] !== r.cuisine) {
      return false;
    }

    if (filtros.mealTypes.length > 0 && filtros.mealTypes[0] !== r.mealType) {
      return false;
    }

    return true;
  });
}

/**
 * Filtro genérico para qualquer ReceitaResumo[] — usado no pool da API.
 * Lê os campos diretos (`dietas`, `cuisines`, `mealTypes`, `dairyFree`)
 * que o mapeador da Spoonacular preenche a partir das flags booleanas.
 *
 * Estratégia:
 *   - termo, ingredientes: match no início das palavras
 *   - dietas: AND nas dietas selecionadas (receita precisa ter todas)
 *   - cuisines: bate exato (radio) com r.cuisines, OU com r.categorias como fallback
 *   - mealTypes: bate exato (radio) com r.mealTypes
 *   - intolerâncias: exclui se o pool indica presença (ex: dairy via flag,
 *     ou via palavras-chave nos ingredientesPreview)
 */
// Mapeamento de intolerância → palavras-chave em inglês.
const INTOLERANCIA_KEYWORDS: Record<string, string[]> = {
  dairy:     ['milk', 'butter', 'cheese', 'cream', 'yogurt', 'ghee', 'mozzarella', 'parmesan', 'ricotta'],
  egg:       ['egg', 'mayonnaise'],
  gluten:    ['wheat', 'flour', 'bread', 'pasta', 'noodle', 'barley', 'rye'],
  grain:     ['oat', 'wheat', 'rice', 'barley', 'rye', 'corn', 'quinoa', 'flour'],
  peanut:    ['peanut'],
  seafood:   ['fish', 'salmon', 'tuna', 'shrimp', 'shellfish', 'crab', 'lobster', 'cod', 'tilapia', 'anchovy'],
  sesame:    ['sesame', 'tahini'],
  shellfish: ['shrimp', 'crab', 'lobster', 'clam', 'oyster', 'mussel', 'scallop'],
  soy:       ['soy', 'tofu', 'tempeh', 'edamame', 'tamari'],
  sulfite:   ['wine', 'vinegar'],
  'tree nut':['almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'hazelnut', 'macadamia', 'brazil nut'],
  wheat:     ['wheat', 'flour', 'bread', 'pasta', 'noodle'],
};

export function filtrarPool(
  pool: ReceitaResumo[],
  filtros: FiltrosBusca
): ReceitaResumo[] {
  return pool.filter((r) => {
    if (filtros.termo) {
      const t = filtros.termo.toLowerCase();
      const palavras = r.titulo.toLowerCase().split(/\s+/);
      if (!palavras.some((p) => p.startsWith(t))) return false;
    }

    const previewLower = r.ingredientesPreview.map((i) => i.toLowerCase());

    if (filtros.ingredientes.length > 0) {
      const todos = filtros.ingredientes.every((ing) => {
        const alvo = ing.toLowerCase();
        return previewLower.some((p) =>
          p.split(/\s+/).some((parte) => parte.startsWith(alvo))
        );
      });
      if (!todos) return false;
    }

    // Dietas: AND — receita precisa ter TODAS as dietas selecionadas
    if (filtros.dietas.length > 0) {
      const dietasReceita = (r.dietas ?? []).map((d) => d.toLowerCase());
      const ok = filtros.dietas.every((d) =>
        dietasReceita.includes(d.toLowerCase())
      );
      if (!ok) return false;
    }

    // Cuisine: bate em r.cuisines (campo direto) ou em categorias (fallback p/ mocks)
    if (filtros.cuisines.length > 0) {
      const alvo = filtros.cuisines[0].toLowerCase();
      const cuisinesReceita = (r.cuisines ?? []).map((c) => c.toLowerCase());
      const categoriasReceita = r.categorias.map((c) => c.toLowerCase());
      if (!cuisinesReceita.includes(alvo) && !categoriasReceita.includes(alvo)) {
        return false;
      }
    }

    // Meal type: bate em r.mealTypes (campo direto) ou em categorias (fallback)
    if (filtros.mealTypes.length > 0) {
      const alvo = filtros.mealTypes[0].toLowerCase();
      const mealsReceita = (r.mealTypes ?? []).map((m) => m.toLowerCase());
      const categoriasReceita = r.categorias.map((c) => c.toLowerCase());
      if (!mealsReceita.includes(alvo) && !categoriasReceita.includes(alvo)) {
        return false;
      }
    }

    // Intolerâncias: exclui se receita contém qualquer um dos proibidos.
    // Para "dairy" e "gluten" usamos as flags booleanas da API quando disponíveis
    // (mais confiáveis que keywords). Para as demais, heurística via palavras-chave
    // sobre a lista completa de ingredientes + título da receita.
    if (filtros.intolerancias.length > 0) {
      // Fonte para keyword matching: lista completa de ingredientes (quando disponível)
      // + título. Cai no preview se não houver lista completa (mocks antigos).
      const fontesParaBusca = [
        ...(r.ingredientesParaFiltro ?? previewLower),
        r.titulo.toLowerCase(),
      ];

      const temProibido = filtros.intolerancias.some((int) => {
        const intLower = int.toLowerCase();
        // Flags diretas da API têm precedência
        if (intLower === 'dairy' && r.dairyFree === true) return false;
        if (intLower === 'gluten' && r.glutenFree === true) return false;
        // Heurística: detectar palavra-chave nos ingredientes completos / título
        const keywords = INTOLERANCIA_KEYWORDS[intLower] ?? [];
        return fontesParaBusca.some((texto) =>
          keywords.some((kw) => texto.includes(kw))
        );
      });
      if (temProibido) return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------
// Receitas completas (com ingredientes + passos) — usadas na página de detalhes
// quando não estamos consumindo a API. Mantemos um map por id pra busca O(1).
// ---------------------------------------------------------------------------

export const RECEITAS_COMPLETAS: Record<number, Receita> = {
  1001: {
    id: 1001,
    titulo: 'Quinoa Bowl with Avocado',
    imagemUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tempoPreparoMin: 25,
    porcoes: 2,
    resumo:
      'A colorful and nutritious bowl, perfect for lunch. Combines quinoa, creamy avocado, chickpeas and fresh greens with a light lemon and olive oil dressing. Full of plant protein, fiber and healthy fats.',
    categorias: ['vegan', 'gluten free', 'mediterranean'],
    ingredientes: [
      { id: 1, nome: 'quinoa', quantidade: 1, unidade: 'cup' },
      { id: 2, nome: 'avocado', quantidade: 1, unidade: 'unit' },
      { id: 3, nome: 'cooked chickpeas', quantidade: 1, unidade: 'cup' },
      { id: 4, nome: 'arugula', quantidade: 2, unidade: 'handfuls' },
      { id: 5, nome: 'cherry tomato', quantidade: 10, unidade: 'units' },
      { id: 6, nome: 'lemon', quantidade: 1, unidade: 'unit' },
      { id: 7, nome: 'extra virgin olive oil', quantidade: 2, unidade: 'tablespoons' },
      { id: 8, nome: 'salt and pepper', quantidade: 0, unidade: 'to taste' },
    ],
    passos: [
      { numero: 1, descricao: 'Rinse the quinoa under running water. Cook in 2 cups of water with a pinch of salt for 15 minutes, until the water has been absorbed. Set aside and let cool.' },
      { numero: 2, descricao: 'Cut the avocado into medium cubes and halve the cherry tomatoes.' },
      { numero: 3, descricao: 'In a small bowl, whisk the lemon juice, olive oil, salt and pepper to make the dressing.' },
      { numero: 4, descricao: 'Build the bowl: start with the quinoa, then add arugula, chickpeas, avocado and tomatoes on top.' },
      { numero: 5, descricao: 'Drizzle with the lemon dressing and serve immediately.' },
    ],
  },
  1002: {
    id: 1002,
    titulo: 'Grilled Salmon with Asparagus',
    imagemUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    tempoPreparoMin: 20,
    porcoes: 2,
    resumo:
      'Succulent salmon grilled in herbed butter, accompanied by crispy asparagus. A quick, elegant, flavorful recipe — perfect for a special dinner any day of the week.',
    categorias: ['pescetarian', 'low carb', 'french', 'gluten free'],
    ingredientes: [
      { id: 10, nome: 'salmon fillet', quantidade: 2, unidade: 'units (180g each)' },
      { id: 11, nome: 'fresh asparagus', quantidade: 1, unidade: 'bunch' },
      { id: 12, nome: 'butter', quantidade: 2, unidade: 'tablespoons' },
      { id: 13, nome: 'garlic', quantidade: 2, unidade: 'cloves' },
      { id: 14, nome: 'lemon', quantidade: 1, unidade: 'unit' },
      { id: 15, nome: 'fresh thyme', quantidade: 4, unidade: 'sprigs' },
      { id: 16, nome: 'salt and pepper', quantidade: 0, unidade: 'to taste' },
    ],
    passos: [
      { numero: 1, descricao: 'Season the salmon fillets with salt and pepper on both sides. Let rest for 5 minutes.' },
      { numero: 2, descricao: 'Trim the tough ends of the asparagus. Rinse and pat dry.' },
      { numero: 3, descricao: 'In a large skillet, melt the butter over medium-high heat. Add the chopped garlic and thyme.' },
      { numero: 4, descricao: 'Place the salmon skin-side down. Sear for 4 minutes without moving, then flip and cook for 3 more minutes.' },
      { numero: 5, descricao: 'Remove the salmon and, in the same skillet, sauté the asparagus for 3-4 minutes until al dente.' },
      { numero: 6, descricao: 'Serve the salmon over the asparagus with lemon wedges.' },
    ],
  },
  1003: {
    id: 1003,
    titulo: 'Banana and Oat Pancakes',
    imagemUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80',
    tempoPreparoMin: 15,
    porcoes: 3,
    resumo:
      'Healthy and fluffy breakfast, no refined flour. Naturally sweet with banana and sweetened only with honey. The perfect way to start the day with energy.',
    categorias: ['vegetarian', 'breakfast', 'american'],
    ingredientes: [
      { id: 20, nome: 'ripe banana', quantidade: 2, unidade: 'units' },
      { id: 21, nome: 'rolled oats', quantidade: 1, unidade: 'cup' },
      { id: 22, nome: 'egg', quantidade: 2, unidade: 'units' },
      { id: 23, nome: 'milk', quantidade: 0.5, unidade: 'cup' },
      { id: 24, nome: 'ground cinnamon', quantidade: 1, unidade: 'teaspoon' },
      { id: 25, nome: 'honey', quantidade: 1, unidade: 'tablespoon' },
      { id: 26, nome: 'baking powder', quantidade: 1, unidade: 'teaspoon' },
    ],
    passos: [
      { numero: 1, descricao: 'In a blender, blend the bananas, eggs, milk, oats and cinnamon until you get a smooth batter.' },
      { numero: 2, descricao: 'Add the baking powder and gently fold it in with a spoon.' },
      { numero: 3, descricao: 'Heat a non-stick skillet over medium-low heat. Pour in one ladleful of batter.' },
      { numero: 4, descricao: 'When bubbles appear on the surface (about 2 minutes), flip the pancake and cook for 1 more minute.' },
      { numero: 5, descricao: 'Serve warm with honey, fresh fruit or plain yogurt on top.' },
    ],
  },
  1004: {
    id: 1004,
    titulo: 'Caprese Salad with Pesto',
    imagemUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    tempoPreparoMin: 10,
    porcoes: 2,
    resumo:
      'Italian classic in its simplest and most elegant form: ripe tomato, buffalo mozzarella, fresh basil and a touch of homemade pesto. When the ingredients are good, less is more.',
    categorias: ['vegetarian', 'italian', 'gluten free'],
    ingredientes: [
      { id: 30, nome: 'ripe tomato', quantidade: 2, unidade: 'large units' },
      { id: 31, nome: 'buffalo mozzarella', quantidade: 200, unidade: 'g' },
      { id: 32, nome: 'fresh basil', quantidade: 1, unidade: 'small bunch' },
      { id: 33, nome: 'pesto', quantidade: 2, unidade: 'tablespoons' },
      { id: 34, nome: 'extra virgin olive oil', quantidade: 2, unidade: 'tablespoons' },
      { id: 35, nome: 'flaky sea salt', quantidade: 0, unidade: 'to taste' },
      { id: 36, nome: 'black pepper', quantidade: 0, unidade: 'to taste' },
    ],
    passos: [
      { numero: 1, descricao: 'Cut the tomatoes into thick slices (about 1 cm) and the mozzarella into slices the same size.' },
      { numero: 2, descricao: 'On a large plate, alternate slices of tomato and mozzarella in layers, tucking in fresh basil leaves between them.' },
      { numero: 3, descricao: 'Spoon small dollops of pesto on top.' },
      { numero: 4, descricao: 'Drizzle with olive oil and finish with flaky salt and freshly cracked black pepper.' },
      { numero: 5, descricao: 'Serve immediately, at room temperature.' },
    ],
  },
  1005: {
    id: 1005,
    titulo: 'Thai Vegetable Curry',
    imagemUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    tempoPreparoMin: 35,
    porcoes: 4,
    resumo:
      'Creamy red curry with coconut milk, squash, bell pepper and broccoli. Aromatic, perfectly spiced and comforting. Serve with jasmine or basmati rice.',
    categorias: ['vegan', 'thai', 'gluten free'],
    ingredientes: [
      { id: 40, nome: 'coconut milk', quantidade: 400, unidade: 'ml' },
      { id: 41, nome: 'red curry paste', quantidade: 3, unidade: 'tablespoons' },
      { id: 42, nome: 'kabocha squash', quantidade: 300, unidade: 'g' },
      { id: 43, nome: 'broccoli', quantidade: 1, unidade: 'small head' },
      { id: 44, nome: 'red bell pepper', quantidade: 1, unidade: 'unit' },
      { id: 45, nome: 'fresh ginger', quantidade: 1, unidade: 'tablespoon, grated' },
      { id: 46, nome: 'soy sauce (tamari)', quantidade: 2, unidade: 'tablespoons' },
      { id: 47, nome: 'coconut oil', quantidade: 1, unidade: 'tablespoon' },
      { id: 48, nome: 'fresh cilantro', quantidade: 1, unidade: 'handful' },
    ],
    passos: [
      { numero: 1, descricao: 'Peel and cube the squash. Cut the broccoli into florets and slice the bell pepper into strips.' },
      { numero: 2, descricao: 'In a large pot, heat the coconut oil and sauté the ginger for 30 seconds.' },
      { numero: 3, descricao: 'Add the curry paste and stir for 1 minute until fragrant.' },
      { numero: 4, descricao: 'Pour in the coconut milk and whisk until smooth. Add the squash and cook for 10 minutes.' },
      { numero: 5, descricao: 'Add the broccoli and bell pepper. Cook for another 8 minutes, until the squash is tender.' },
      { numero: 6, descricao: 'Season with soy sauce. Finish with chopped cilantro and serve over rice.' },
    ],
  },
  1006: {
    id: 1006,
    titulo: 'Acai Bowl with Fruits',
    imagemUrl: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80',
    tempoPreparoMin: 8,
    porcoes: 1,
    resumo:
      'Creamy acai topped with banana, strawberry, granola and a drizzle of honey. A fresh, energizing snack for any time of day — especially after a workout.',
    categorias: ['vegan', 'breakfast', 'latin american'],
    ingredientes: [
      { id: 50, nome: 'frozen acai puree', quantidade: 200, unidade: 'g' },
      { id: 51, nome: 'frozen banana', quantidade: 1, unidade: 'unit' },
      { id: 52, nome: 'strawberry', quantidade: 5, unidade: 'units' },
      { id: 53, nome: 'granola', quantidade: 3, unidade: 'tablespoons' },
      { id: 54, nome: 'honey', quantidade: 1, unidade: 'tablespoon' },
      { id: 55, nome: 'plant-based milk', quantidade: 50, unidade: 'ml' },
    ],
    passos: [
      { numero: 1, descricao: 'In a blender, blend the acai puree with the frozen banana and the plant-based milk until you reach a creamy, ice-cream-like texture.' },
      { numero: 2, descricao: 'Transfer to a deep bowl.' },
      { numero: 3, descricao: 'Slice the strawberries and arrange them on top along with the granola.' },
      { numero: 4, descricao: 'Finish with a drizzle of honey and serve immediately.' },
    ],
  },
};

/**
 * Busca uma receita completa no mock por id.
 * Retorna `null` se não encontrar — a página de detalhes mostra erro nesse caso.
 */
export function buscarReceitaCompletaMock(id: number): Receita | null {
  return RECEITAS_COMPLETAS[id] ?? null;
}
