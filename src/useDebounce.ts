// Custom hook: debounce — atrasa a atualização de um valor.
// Útil no campo de busca para não disparar uma requisição a cada tecla.

import { useState, useEffect } from 'react';

export function useDebounce<T>(valor: T, atrasoMs = 400): T {
  const [debouncedValor, setDebouncedValor] = useState(valor);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValor(valor), atrasoMs);
    return () => clearTimeout(id);
  }, [valor, atrasoMs]);

  return debouncedValor;
}
