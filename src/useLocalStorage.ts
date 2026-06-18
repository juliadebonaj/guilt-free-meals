// Custom hook: persiste valor no localStorage. Aula 1 — exemplo clássico.
// Útil para manter as favoritas entre sessões.

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  chave: string,
  valorInicial: T
): [T, (valor: T) => void] {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo ? (JSON.parse(salvo) as T) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // localStorage cheio ou indisponível — falha silenciosa
    }
  }, [chave, valor]);

  return [valor, setValor];
}
