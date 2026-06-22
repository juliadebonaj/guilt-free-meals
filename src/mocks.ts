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

// ---------------------------------------------------------------------------
// Receitas completas (com ingredientes + passos) — usadas na página de detalhes
// quando não estamos consumindo a API. Mantemos um map por id pra busca O(1).
// ---------------------------------------------------------------------------

export const RECEITAS_COMPLETAS: Record<number, Receita> = {
  1001: {
    id: 1001,
    titulo: 'Bowl de Quinoa com Abacate',
    imagemUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tempoPreparoMin: 25,
    porcoes: 2,
    resumo:
      'Um bowl colorido e nutritivo, perfeito para o almoço. Combina quinoa, abacate cremoso, grão-de-bico e folhas frescas com um molho leve de limão e azeite. Cheio de proteína vegetal, fibras e gorduras boas.',
    categorias: ['vegan', 'gluten free', 'mediterranean'],
    ingredientes: [
      { id: 1, nome: 'quinoa', quantidade: 1, unidade: 'xícara' },
      { id: 2, nome: 'abacate', quantidade: 1, unidade: 'unidade' },
      { id: 3, nome: 'grão-de-bico cozido', quantidade: 1, unidade: 'xícara' },
      { id: 4, nome: 'rúcula', quantidade: 2, unidade: 'punhados' },
      { id: 5, nome: 'tomate-cereja', quantidade: 10, unidade: 'unidades' },
      { id: 6, nome: 'limão', quantidade: 1, unidade: 'unidade' },
      { id: 7, nome: 'azeite extra virgem', quantidade: 2, unidade: 'colheres de sopa' },
      { id: 8, nome: 'sal e pimenta', quantidade: 0, unidade: 'a gosto' },
    ],
    passos: [
      { numero: 1, descricao: 'Lave a quinoa em água corrente. Cozinhe em 2 xícaras de água com uma pitada de sal por 15 minutos, até a água secar. Reserve e deixe esfriar.' },
      { numero: 2, descricao: 'Corte o abacate em cubos médios e os tomates-cereja ao meio.' },
      { numero: 3, descricao: 'Em uma tigela pequena, misture o suco do limão, o azeite, sal e pimenta para fazer o molho.' },
      { numero: 4, descricao: 'Monte o bowl: comece pela quinoa, adicione a rúcula, o grão-de-bico, o abacate e os tomates por cima.' },
      { numero: 5, descricao: 'Regue com o molho de limão e sirva imediatamente.' },
    ],
  },
  1002: {
    id: 1002,
    titulo: 'Salmão Grelhado com Aspargos',
    imagemUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    tempoPreparoMin: 20,
    porcoes: 2,
    resumo:
      'Salmão suculento grelhado na manteiga de ervas, acompanhado de aspargos crocantes. Receita rápida, elegante e cheia de sabor — perfeita para um jantar especial em qualquer dia da semana.',
    categorias: ['pescetarian', 'low carb', 'french', 'gluten free'],
    ingredientes: [
      { id: 10, nome: 'filé de salmão', quantidade: 2, unidade: 'unidades (180g cada)' },
      { id: 11, nome: 'aspargos frescos', quantidade: 1, unidade: 'maço' },
      { id: 12, nome: 'manteiga', quantidade: 2, unidade: 'colheres de sopa' },
      { id: 13, nome: 'alho', quantidade: 2, unidade: 'dentes' },
      { id: 14, nome: 'limão', quantidade: 1, unidade: 'unidade' },
      { id: 15, nome: 'tomilho fresco', quantidade: 4, unidade: 'ramos' },
      { id: 16, nome: 'sal e pimenta', quantidade: 0, unidade: 'a gosto' },
    ],
    passos: [
      { numero: 1, descricao: 'Tempere os filés de salmão com sal e pimenta dos dois lados. Deixe descansar 5 minutos.' },
      { numero: 2, descricao: 'Apare a parte mais dura dos aspargos. Lave e seque bem.' },
      { numero: 3, descricao: 'Em uma frigideira grande, derreta a manteiga em fogo médio-alto. Adicione o alho picado e o tomilho.' },
      { numero: 4, descricao: 'Coloque o salmão com a pele para baixo. Grelhe por 4 minutos sem mexer, vire e cozinhe por mais 3 minutos.' },
      { numero: 5, descricao: 'Retire o salmão e, na mesma frigideira, salteie os aspargos por 3-4 minutos até ficarem al dente.' },
      { numero: 6, descricao: 'Sirva o salmão sobre os aspargos com rodelas de limão.' },
    ],
  },
  1003: {
    id: 1003,
    titulo: 'Panquecas de Banana e Aveia',
    imagemUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80',
    tempoPreparoMin: 15,
    porcoes: 3,
    resumo:
      'Café da manhã saudável e fofinho, sem farinha refinada. Naturalmente doce com banana e adoçado apenas com mel. Ideal para começar o dia com energia.',
    categorias: ['vegetarian', 'breakfast', 'american'],
    ingredientes: [
      { id: 20, nome: 'banana madura', quantidade: 2, unidade: 'unidades' },
      { id: 21, nome: 'aveia em flocos', quantidade: 1, unidade: 'xícara' },
      { id: 22, nome: 'ovo', quantidade: 2, unidade: 'unidades' },
      { id: 23, nome: 'leite', quantidade: 0.5, unidade: 'xícara' },
      { id: 24, nome: 'canela em pó', quantidade: 1, unidade: 'colher de chá' },
      { id: 25, nome: 'mel', quantidade: 1, unidade: 'colher de sopa' },
      { id: 26, nome: 'fermento em pó', quantidade: 1, unidade: 'colher de chá' },
    ],
    passos: [
      { numero: 1, descricao: 'No liquidificador, bata as bananas, os ovos, o leite, a aveia e a canela até obter uma massa homogênea.' },
      { numero: 2, descricao: 'Adicione o fermento e mexa delicadamente com uma colher.' },
      { numero: 3, descricao: 'Aqueça uma frigideira antiaderente em fogo médio-baixo. Coloque uma concha de massa.' },
      { numero: 4, descricao: 'Quando aparecerem bolhas na superfície (cerca de 2 minutos), vire a panqueca e cozinhe por mais 1 minuto.' },
      { numero: 5, descricao: 'Sirva quente com mel, frutas frescas ou iogurte natural por cima.' },
    ],
  },
  1004: {
    id: 1004,
    titulo: 'Salada Caprese com Pesto',
    imagemUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    tempoPreparoMin: 10,
    porcoes: 2,
    resumo:
      'Clássico italiano em sua forma mais simples e elegante: tomate maduro, mussarela de búfala, manjericão fresco e um toque de pesto caseiro. Quando os ingredientes são bons, menos é mais.',
    categorias: ['vegetarian', 'italian', 'gluten free'],
    ingredientes: [
      { id: 30, nome: 'tomate maduro', quantidade: 2, unidade: 'unidades grandes' },
      { id: 31, nome: 'mussarela de búfala', quantidade: 200, unidade: 'g' },
      { id: 32, nome: 'manjericão fresco', quantidade: 1, unidade: 'maço pequeno' },
      { id: 33, nome: 'pesto', quantidade: 2, unidade: 'colheres de sopa' },
      { id: 34, nome: 'azeite extra virgem', quantidade: 2, unidade: 'colheres de sopa' },
      { id: 35, nome: 'flor de sal', quantidade: 0, unidade: 'a gosto' },
      { id: 36, nome: 'pimenta-do-reino', quantidade: 0, unidade: 'a gosto' },
    ],
    passos: [
      { numero: 1, descricao: 'Corte os tomates em rodelas grossas (cerca de 1 cm) e a mussarela em fatias do mesmo tamanho.' },
      { numero: 2, descricao: 'Em um prato grande, alterne as fatias de tomate e mussarela em camadas, intercalando folhas de manjericão.' },
      { numero: 3, descricao: 'Distribua o pesto por cima em pequenas porções.' },
      { numero: 4, descricao: 'Regue com o azeite, finalize com flor de sal e pimenta-do-reino moída na hora.' },
      { numero: 5, descricao: 'Sirva imediatamente, em temperatura ambiente.' },
    ],
  },
  1005: {
    id: 1005,
    titulo: 'Curry Tailandês de Legumes',
    imagemUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    tempoPreparoMin: 35,
    porcoes: 4,
    resumo:
      'Curry vermelho cremoso com leite de coco, abóbora, pimentão e brócolis. Aromático, picante na medida e reconfortante. Sirva com arroz jasmim ou basmati.',
    categorias: ['vegan', 'thai', 'gluten free'],
    ingredientes: [
      { id: 40, nome: 'leite de coco', quantidade: 400, unidade: 'ml' },
      { id: 41, nome: 'pasta de curry vermelho', quantidade: 3, unidade: 'colheres de sopa' },
      { id: 42, nome: 'abóbora cabotiá', quantidade: 300, unidade: 'g' },
      { id: 43, nome: 'brócolis', quantidade: 1, unidade: 'cabeça pequena' },
      { id: 44, nome: 'pimentão vermelho', quantidade: 1, unidade: 'unidade' },
      { id: 45, nome: 'gengibre fresco', quantidade: 1, unidade: 'colher de sopa ralado' },
      { id: 46, nome: 'molho de soja (tamari)', quantidade: 2, unidade: 'colheres de sopa' },
      { id: 47, nome: 'óleo de coco', quantidade: 1, unidade: 'colher de sopa' },
      { id: 48, nome: 'coentro fresco', quantidade: 1, unidade: 'punhado' },
    ],
    passos: [
      { numero: 1, descricao: 'Descasque e corte a abóbora em cubos. Pique o brócolis em buquês e o pimentão em tiras.' },
      { numero: 2, descricao: 'Em uma panela grande, aqueça o óleo de coco e refogue o gengibre por 30 segundos.' },
      { numero: 3, descricao: 'Adicione a pasta de curry e mexa por 1 minuto até soltar o aroma.' },
      { numero: 4, descricao: 'Despeje o leite de coco e mexa até obter um molho liso. Acrescente a abóbora e cozinhe por 10 minutos.' },
      { numero: 5, descricao: 'Adicione o brócolis e o pimentão. Cozinhe por mais 8 minutos, até a abóbora ficar macia.' },
      { numero: 6, descricao: 'Tempere com o molho de soja. Finalize com coentro picado e sirva com arroz.' },
    ],
  },
  1006: {
    id: 1006,
    titulo: 'Tigela de Açaí com Frutas',
    imagemUrl: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80',
    tempoPreparoMin: 8,
    porcoes: 1,
    resumo:
      'Açaí cremoso coberto com banana, morango, granola e um fio de mel. Lanche fresco e energético para qualquer hora do dia, especialmente depois do treino.',
    categorias: ['vegan', 'breakfast', 'latin american'],
    ingredientes: [
      { id: 50, nome: 'polpa de açaí congelada', quantidade: 200, unidade: 'g' },
      { id: 51, nome: 'banana congelada', quantidade: 1, unidade: 'unidade' },
      { id: 52, nome: 'morango', quantidade: 5, unidade: 'unidades' },
      { id: 53, nome: 'granola', quantidade: 3, unidade: 'colheres de sopa' },
      { id: 54, nome: 'mel', quantidade: 1, unidade: 'colher de sopa' },
      { id: 55, nome: 'leite vegetal', quantidade: 50, unidade: 'ml' },
    ],
    passos: [
      { numero: 1, descricao: 'No liquidificador, bata a polpa de açaí com a banana congelada e o leite vegetal até obter uma textura cremosa de sorvete.' },
      { numero: 2, descricao: 'Transfira para uma tigela funda.' },
      { numero: 3, descricao: 'Corte os morangos em fatias e disponha por cima junto com a granola.' },
      { numero: 4, descricao: 'Finalize com um fio de mel e sirva imediatamente.' },
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
