// Custom hook: persiste valor no localStorage. Aula 1 — exemplo clássico.
// Útil para manter as favoritas entre sessões.
//
// Sincroniza instâncias do mesmo `chave` via CustomEvent: quando qualquer
// componente atualiza o valor, dispara 'local-storage-sync' e todas as
// outras instâncias se atualizam em tempo real (sem precisar recarregar).

import { useState, useEffect } from 'react';

const EVENTO_SYNC = 'local-storage-sync';

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
      // Notifica outras instâncias deste mesmo hook (mesma aba)
      window.dispatchEvent(
        new CustomEvent(EVENTO_SYNC, { detail: { chave, valor } })
      );
    } catch {
      // localStorage cheio ou indisponível — falha silenciosa
    }
  }, [chave, valor]);

  // Escuta atualizações de outras instâncias com a mesma chave
  useEffect(() => {
    const onSync = (e: Event) => {
      const ev = e as CustomEvent<{ chave: string; valor: T }>;
      if (ev.detail?.chave === chave) {
        setValor(ev.detail.valor);
      }
    };
    window.addEventListener(EVENTO_SYNC, onSync);
    return () => window.removeEventListener(EVENTO_SYNC, onSync);
  }, [chave]);

  return [valor, setValor];
}
