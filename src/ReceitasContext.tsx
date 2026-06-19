// Estado global da aplicação — Aula 2: Context + useReducer.
// Mantém: lista de receitas em exibição, favoritas, salvas, filtros e status da requisição.

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  Receita,
  ReceitaResumo,
  FiltrosBusca,
  StatusRequisicao,
} from './types';
import { FILTROS_INICIAIS } from './types';

// 1. Tipos
interface Estado {
  receitas: ReceitaResumo[];
  receitaAtual: Receita | null;
  favoritas: ReceitaResumo[];   // receitas que o usuário ama
  salvas: ReceitaResumo[];      // receitas que o usuário quer ler depois
  filtros: FiltrosBusca;
  status: StatusRequisicao;
  erro: string | null;
}

type Action =
  | { type: 'BUSCA_INICIADA' }
  | { type: 'BUSCA_SUCESSO'; payload: ReceitaResumo[] }
  | { type: 'BUSCA_ERRO'; payload: string }
  | { type: 'DETALHE_CARREGADO'; payload: Receita }
  | { type: 'FAVORITA_ADICIONADA'; payload: ReceitaResumo }
  | { type: 'FAVORITA_REMOVIDA'; payload: number } // id
  | { type: 'SALVA_ADICIONADA'; payload: ReceitaResumo }
  | { type: 'SALVA_REMOVIDA'; payload: number } // id
  | { type: 'FILTRO_TERMO_ALTERADO'; payload: string }
  | { type: 'INGREDIENTE_ADICIONADO'; payload: string }
  | { type: 'INGREDIENTE_REMOVIDO'; payload: string }
  | { type: 'DIETA_ALTERNADA'; payload: string }       // toggle on/off
  | { type: 'INTOLERANCIA_ALTERNADA'; payload: string } // toggle on/off
  | { type: 'CUISINE_ALTERNADA'; payload: string }
  | { type: 'MEAL_TYPE_ALTERNADO'; payload: string }
  | { type: 'FILTROS_LIMPOS' };

// 2. Estado inicial
const estadoInicial: Estado = {
  receitas: [],
  receitaAtual: null,
  favoritas: [],
  salvas: [],
  filtros: FILTROS_INICIAIS,
  status: 'idle',
  erro: null,
};

// helper genérico pra alternar item em array
function alternar(lista: string[], item: string): string[] {
  return lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item];
}

// 3. Reducer — função pura
function receitasReducer(state: Estado, action: Action): Estado {
  switch (action.type) {
    case 'BUSCA_INICIADA':
      return { ...state, status: 'carregando', erro: null };

    case 'BUSCA_SUCESSO':
      return { ...state, status: 'sucesso', receitas: action.payload };

    case 'BUSCA_ERRO':
      return { ...state, status: 'erro', erro: action.payload };

    case 'DETALHE_CARREGADO':
      return { ...state, receitaAtual: action.payload };

    case 'FAVORITA_ADICIONADA':
      if (state.favoritas.some((f) => f.id === action.payload.id)) return state;
      return { ...state, favoritas: [...state.favoritas, action.payload] };

    case 'FAVORITA_REMOVIDA':
      return {
        ...state,
        favoritas: state.favoritas.filter((f) => f.id !== action.payload),
      };

    case 'SALVA_ADICIONADA':
      if (state.salvas.some((s) => s.id === action.payload.id)) return state;
      return { ...state, salvas: [...state.salvas, action.payload] };

    case 'SALVA_REMOVIDA':
      return {
        ...state,
        salvas: state.salvas.filter((s) => s.id !== action.payload),
      };

    case 'FILTRO_TERMO_ALTERADO':
      return {
        ...state,
        filtros: { ...state.filtros, termo: action.payload },
      };

    case 'INGREDIENTE_ADICIONADO': {
      const novo = action.payload.trim().toLowerCase();
      if (!novo || state.filtros.ingredientes.includes(novo)) return state;
      return {
        ...state,
        filtros: {
          ...state.filtros,
          ingredientes: [...state.filtros.ingredientes, novo],
        },
      };
    }

    case 'INGREDIENTE_REMOVIDO':
      return {
        ...state,
        filtros: {
          ...state.filtros,
          ingredientes: state.filtros.ingredientes.filter(
            (i) => i !== action.payload
          ),
        },
      };

    case 'DIETA_ALTERNADA':
      return {
        ...state,
        filtros: {
          ...state.filtros,
          dietas: alternar(state.filtros.dietas, action.payload),
        },
      };

    case 'INTOLERANCIA_ALTERNADA':
      return {
        ...state,
        filtros: {
          ...state.filtros,
          intolerancias: alternar(state.filtros.intolerancias, action.payload),
        },
      };

    case 'CUISINE_ALTERNADA': {
      // Comportamento radio: clicar no mesmo desativa, clicar em outro substitui.
      const atual = state.filtros.cuisines[0];
      const novo = atual === action.payload ? [] : [action.payload];
      return {
        ...state,
        filtros: { ...state.filtros, cuisines: novo },
      };
    }

    case 'MEAL_TYPE_ALTERNADO': {
      // API só aceita 1 meal type — comportamento radio:
      // clicar no mesmo desativa, clicar em outro substitui.
      const atual = state.filtros.mealTypes[0];
      const novo = atual === action.payload ? [] : [action.payload];
      return {
        ...state,
        filtros: { ...state.filtros, mealTypes: novo },
      };
    }

    case 'FILTROS_LIMPOS':
      return { ...state, filtros: FILTROS_INICIAIS };

    default:
      return state;
  }
}

// 4. Contexto + Provider customizado
interface ContextoValor {
  state: Estado;
  dispatch: React.Dispatch<Action>;
}

const ReceitasContext = createContext<ContextoValor | null>(null);

export function ReceitasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(receitasReducer, estadoInicial);

  return (
    <ReceitasContext.Provider value={{ state, dispatch }}>
      {children}
    </ReceitasContext.Provider>
  );
}

// 5. Hook customizado com validação — Aula 2 (boa prática)
export function useReceitas() {
  const context = useContext(ReceitasContext);
  if (!context) {
    throw new Error('useReceitas deve ser usado dentro de um ReceitasProvider');
  }
  return context;
}
