// Cache permanente do pool inicial de receitas (50 itens vindos da Spoonacular).
// Compartilhado entre Home e Search — uma vez populado, todas as buscas e filtros
// operam sobre esse pool em memória, sem voltar à API.

import type { ReceitaResumo } from './types';

const CACHE_KEY = '@GuiltFree:initialPool';
const CACHE_VERSAO = 6; // bumpa quando o shape de ReceitaResumo muda — invalida caches antigos

interface CacheEntry {
  versao: number;
  receitas: ReceitaResumo[];
}

export function lerPoolCache(): ReceitaResumo[] | null {
  try {
    const bruto = localStorage.getItem(CACHE_KEY);
    if (!bruto) return null;
    const entry: CacheEntry = JSON.parse(bruto);
    if (entry.versao !== CACHE_VERSAO) return null;
    if (!Array.isArray(entry.receitas) || entry.receitas.length === 0) return null;
    return entry.receitas;
  } catch {
    return null;
  }
}

export function gravarPoolCache(receitas: ReceitaResumo[]) {
  try {
    const entry: CacheEntry = { versao: CACHE_VERSAO, receitas };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage cheio — falha silenciosa
  }
}
