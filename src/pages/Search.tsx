// Página de busca: barra principal (debounce) + ícone funil que abre drawer com filtros.
// Cards renderizados em grid responsivo. Estados: idle, carregando, erro, sucesso, vazio.

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useReceitas } from '../ReceitasContext';
import { buscarReceitas } from '../spoonacular';
import { filtrarMocks } from '../mocks';
import { useDebounce } from '../useDebounce';
import CardReceita from '../components/CardReceita';
import Drawer from '../components/Drawer';
import FiltrosPanel from '../components/FiltrosPanel';
import Spinner from '../components/Spinner';

export default function Search() {
  const { state, dispatch } = useReceitas();
  const { receitas, status, erro, filtros } = state;

  const [drawerAberto, setDrawerAberto] = useState(false);
  // Indica se o último resultado veio dos mocks (sem chave/API offline)
  const [usandoMocks, setUsandoMocks] = useState(false);

  // Termo digitado, debounced — busca acontece quando o termo "estabiliza".
  const termoDebounced = useDebounce(filtros.termo, 500);

  // Quantos filtros ativos? Usado pra mostrar badge no funil.
  const filtrosAtivos =
    filtros.ingredientes.length +
    filtros.dietas.length +
    filtros.intolerancias.length +
    filtros.cuisines.length +
    filtros.mealTypes.length;

  useEffect(() => {
    let cancelado = false;
    dispatch({ type: 'BUSCA_INICIADA' });

    const filtrosAtuais = {
      termo: termoDebounced,
      ingredientes: filtros.ingredientes,
      dietas: filtros.dietas,
      intolerancias: filtros.intolerancias,
      cuisines: filtros.cuisines,
      mealTypes: filtros.mealTypes,
    };

    buscarReceitas(filtrosAtuais)
      .then((resultados) => {
        if (cancelado) return;
        setUsandoMocks(false);
        dispatch({ type: 'BUSCA_SUCESSO', payload: resultados });
      })
      .catch(() => {
        // Fallback: API indisponível (sem chave, quota excedida etc.)
        // Aplicamos os mesmos filtros nos mocks locais.
        if (cancelado) return;
        const mockados = filtrarMocks({ ...filtros, termo: termoDebounced });
        setUsandoMocks(true);
        dispatch({ type: 'BUSCA_SUCESSO', payload: mockados });
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    termoDebounced,
    filtros.ingredientes,
    filtros.dietas,
    filtros.intolerancias,
    filtros.cuisines,
    filtros.mealTypes,
  ]);

  return (
    <Wrapper>
      <BarraTopo>
        <BuscaInput
          type="search"
          placeholder="Buscar receita por nome..."
          value={filtros.termo}
          onChange={(e) =>
            dispatch({ type: 'FILTRO_TERMO_ALTERADO', payload: e.target.value })
          }
        />
        <BotaoFunil
          type="button"
          onClick={() => setDrawerAberto(true)}
        >
          <IconeFunil />
          <span>Filtros</span>
          {filtrosAtivos > 0 && <Badge>{filtrosAtivos}</Badge>}
        </BotaoFunil>
      </BarraTopo>

      <Conteudo>
        {status === 'idle' && (
          <Mensagem>Comece buscando uma receita por nome ou abra os filtros.</Mensagem>
        )}

        {status === 'carregando' && <Spinner />}

        {status === 'erro' && <Mensagem erro>Erro ao buscar: {erro}</Mensagem>}

        {status === 'sucesso' && receitas.length === 0 && (
          <Mensagem>Nenhuma receita encontrada com esses filtros.</Mensagem>
        )}

        {status === 'sucesso' && receitas.length > 0 && usandoMocks && (
          <AvisoMock>
            Mostrando exemplos locais — configure a chave da Spoonacular no
            <code> .env.local </code> para resultados reais.
          </AvisoMock>
        )}

        {status === 'sucesso' && receitas.length > 0 && (
          <Grid>
            {receitas.map((r) => (
              <CardReceita key={r.id} receita={r} />
            ))}
          </Grid>
        )}
      </Conteudo>

      <Drawer
        aberto={drawerAberto}
        onFechar={() => setDrawerAberto(false)}
        titulo="Filtros"
      >
        <FiltrosPanel />
      </Drawer>
    </Wrapper>
  );
}

// Ícone de funil em SVG inline (sem dependência externa)
function IconeFunil() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

const Wrapper = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos.xl} ${({ theme }) => theme.espacos.lg};
`;

const BarraTopo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espacos.sm};
  margin-bottom: ${({ theme }) => theme.espacos.xl};
`;

const BuscaInput = styled.input`
  flex: 1;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.lg};
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.pill};
  color: ${({ theme }) => theme.cores.texto.primario};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.cores.sage[900]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.cores.sage[300]}66;
  }

  &::placeholder {
    color: ${({ theme }) => theme.cores.texto.muted};
  }
`;

const BotaoFunil = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.sm};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.05em;
  padding: 0 ${({ theme }) => theme.espacos.lg};
  background: ${({ theme }) => theme.cores.superficie};
  color: ${({ theme }) => theme.cores.texto.primario};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.pill};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.cores.sage[900]};
    color: ${({ theme }) => theme.cores.sage[900]};
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  font-weight: ${({ theme }) => theme.pesoFonte.semibold};
  border-radius: ${({ theme }) => theme.bordas.pill};
`;

const Conteudo = styled.div`
  min-height: 400px;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.espacos.lg};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const Mensagem = styled.p<{ erro?: boolean }>`
  text-align: center;
  padding: ${({ theme }) => theme.espacos['3xl']};
  color: ${({ theme, erro }) =>
    erro ? theme.cores.estados.erro : theme.cores.texto.muted};
  font-style: italic;
`;

const AvisoMock = styled.div`
  background: ${({ theme }) => theme.cores.cream[300]};
  color: ${({ theme }) => theme.cores.texto.secundario};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.md};
  border-radius: ${({ theme }) => theme.bordas.md};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  margin-bottom: ${({ theme }) => theme.espacos.lg};
  text-align: center;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: ${({ theme }) => theme.cores.superficie};
    padding: 1px 6px;
    border-radius: ${({ theme }) => theme.bordas.sm};
    font-size: 0.9em;
  }
`;
