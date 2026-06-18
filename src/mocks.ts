// Mock de receitas para a vitrine da home — sem dependência da API.
// Imagens do Unsplash (free, sem necessidade de chave).
//
// Cada mock tem campos extras (cuisine, mealType, dietas, intolerancias) que
// permitem filtrar localmente — usados como fallback quando a API não responde.

import type { ReceitaResumo, FiltrosBusca } from './types';

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
    titulo: 'Bowl de Quinoa com Abacate',
    imagemUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tempoPreparoMin: 25,
    porcoes: 2,
    categorias: ['vegan', 'gluten free'],
    resumo:
      'Um bowl colorido e nutritivo, perfeito para o almoço. Combina quinoa, abacate cremoso, grão-de-bico e folhas frescas com um molho leve de limão.',
    ingredientesPreview: ['quinoa', 'abacate', 'grão-de-bico', 'rúcula', 'limão'],
    cuisine: 'mediterranean',
    mealType: 'main course',
    dietas: ['vegan', 'vegetarian', 'gluten free', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: [],
  },
  {
    id: 1002,
    titulo: 'Salmão Grelhado com Aspargos',
    imagemUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    tempoPreparoMin: 20,
    porcoes: 2,
    categorias: ['pescetarian', 'low carb'],
    resumo:
      'Salmão suculento grelhado na manteiga de ervas, acompanhado de aspargos crocantes. Receita rápida, elegante e cheia de sabor.',
    ingredientesPreview: ['salmão', 'aspargos', 'manteiga', 'alho', 'limão', 'tomilho'],
    cuisine: 'french',
    mealType: 'main course',
    dietas: ['pescetarian', 'gluten free', 'ketogenic', 'paleo', 'primal'],
    intoleranciasContem: ['dairy', 'seafood'],
  },
  {
    id: 1003,
    titulo: 'Panquecas de Banana e Aveia',
    imagemUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80',
    tempoPreparoMin: 15,
    porcoes: 3,
    categorias: ['vegetarian', 'breakfast'],
    resumo:
      'Café da manhã saudável e fofinho, sem farinha refinada. Naturalmente doce com banana e adoçado apenas com mel.',
    ingredientesPreview: ['banana', 'aveia', 'ovo', 'leite', 'canela'],
    cuisine: 'american',
    mealType: 'breakfast',
    dietas: ['vegetarian', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: ['egg', 'dairy', 'gluten', 'grain', 'wheat'],
  },
  {
    id: 1004,
    titulo: 'Salada Caprese com Pesto',
    imagemUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    tempoPreparoMin: 10,
    porcoes: 2,
    categorias: ['vegetarian', 'italian'],
    resumo:
      'Clássico italiano em sua forma mais simples e elegante: tomate maduro, mussarela de búfala, manjericão fresco e um toque de pesto caseiro.',
    ingredientesPreview: ['tomate', 'mussarela', 'manjericão', 'pesto', 'azeite'],
    cuisine: 'italian',
    mealType: 'salad',
    dietas: ['vegetarian', 'gluten free', 'lacto-vegetarian', 'primal'],
    intoleranciasContem: ['dairy', 'tree nut'],
  },
  {
    id: 1005,
    titulo: 'Curry Tailandês de Legumes',
    imagemUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    tempoPreparoMin: 35,
    porcoes: 4,
    categorias: ['vegan', 'thai'],
    resumo:
      'Curry vermelho cremoso com leite de coco, abóbora, pimentão e brócolis. Aromático, picante na medida e reconfortante.',
    ingredientesPreview: ['leite de coco', 'curry', 'abóbora', 'brócolis', 'gengibre'],
    cuisine: 'thai',
    mealType: 'main course',
    dietas: ['vegan', 'vegetarian', 'gluten free', 'lacto-vegetarian', 'ovo-vegetarian'],
    intoleranciasContem: [],
  },
  {
    id: 1006,
    titulo: 'Tigela de Açaí com Frutas',
    imagemUrl: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80',
    tempoPreparoMin: 8,
    porcoes: 1,
    categorias: ['vegan', 'breakfast'],
    resumo:
      'Açaí cremoso coberto com banana, morango, granola e um fio de mel. Lanche fresco e energético para qualquer hora do dia.',
    ingredientesPreview: ['açaí', 'banana', 'morango', 'granola', 'mel'],
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
      if (!r.titulo.toLowerCase().includes(t)) return false;
    }

    if (filtros.ingredientes.length > 0) {
      const preview = r.ingredientesPreview.map((i) => i.toLowerCase());
      const todos = filtros.ingredientes.every((ing) =>
        preview.some((p) => p.includes(ing.toLowerCase()))
      );
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
