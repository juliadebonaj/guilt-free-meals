// Página de busca: barra principal (debounce) + ícone funil que abre drawer com filtros.
// Cards renderizados em grid responsivo. Estados: idle, carregando, erro, sucesso, vazio.
//
// Estratégia "1 request por vida":
//   - Ao montar, tenta ler o pool de 50 receitas do localStorage.
//   - Se não tem cache, chama buscarPoolInicial UMA vez e grava.
//   - A partir daí, TODOS os filtros (termo, ingredientes, dietas, cozinhas,
//     tipo de refeição) operam em memória via filtrarPool. Nunca mais chama API.
//   - Paginação fatia o resultado filtrado em chunks de 12.

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useReceitas } from '../ReceitasContext';
import { buscarPoolInicial } from '../spoonacular';
import { filtrarPool, RECEITAS_DESTAQUE } from '../mocks';
import { lerPoolCache, gravarPoolCache } from '../poolCache';
import { useDebounce } from '../useDebounce';
import CardReceita from '../components/CardReceita';
import Drawer from '../components/Drawer';
import FiltrosPanel from '../components/FiltrosPanel';
import Spinner from '../components/Spinner';
import type { ReceitaResumo } from '../types';

const POR_PAGINA = 12;
const TAMANHO_POOL = 100;

export default function Search() {
  const { state, dispatch } = useReceitas();
  const { receitas, status, erro, filtros } = state;

  const [drawerAberto, setDrawerAberto] = useState(false);
  // True quando o pool veio dos mocks locais (sem chave/API offline na 1ª chamada)
  const [usandoMocks, setUsandoMocks] = useState(false);

  // Pool inicial — fonte de verdade. Todos os filtros operam aqui em memória.
  const [pool, setPool] = useState<ReceitaResumo[] | null>(null);
  const [pagina, setPagina] = useState(0);

  // Termo digitado, debounced — busca acontece quando o termo "estabiliza".
  const termoDebounced = useDebounce(filtros.termo, 500);

  const filtrosAtivos =
    filtros.ingredientes.length +
    filtros.dietas.length +
    filtros.intolerancias.length +
    filtros.cuisines.length +
    filtros.mealTypes.length;

  // Effect 1: popula o pool UMA vez. Sempre prioriza o cache.
  useEffect(() => {
    let cancelado = false;
    dispatch({ type: 'BUSCA_INICIADA' });

    const cache = lerPoolCache();
    if (cache && cache.length > 0) {
      setUsandoMocks(false);
      setPool(cache);
      return;
    }

    buscarPoolInicial(TAMANHO_POOL)
      .then((resultado) => {
        if (cancelado) return;
        if (resultado.length > 0) {
          gravarPoolCache(resultado);
          setUsandoMocks(false);
          setPool(resultado);
        } else {
          setUsandoMocks(true);
          setPool(RECEITAS_DESTAQUE);
        }
      })
      .catch(() => {
        if (cancelado) return;
        setUsandoMocks(true);
        setPool(RECEITAS_DESTAQUE);
      });

    return () => {
      cancelado = true;
    };
  }, [dispatch]);

  // Effect 2: aplica filtros locais sobre o pool e atualiza o contexto.
  // Sem rede. Roda a cada mudança de filtro/termo/pool.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (pool === null) return; // ainda carregando

    const filtrados = filtrarPool(pool, {
      ...filtros,
      termo: termoDebounced,
    });

    setPagina(0); // volta pra primeira página em cada nova combinação de filtros
    dispatch({ type: 'BUSCA_SUCESSO', payload: filtrados });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pool,
    termoDebounced,
    filtros.ingredientes,
    filtros.dietas,
    filtros.intolerancias,
    filtros.cuisines,
    filtros.mealTypes,
  ]);

  const total = receitas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const podeAnterior = pagina > 0;
  const podeProxima = pagina < totalPaginas - 1;

  // Slice do resultado filtrado pra renderização
  const inicioSlice = pagina * POR_PAGINA;
  const receitasNaPagina = receitas.slice(inicioSlice, inicioSlice + POR_PAGINA);

  const irPara = (n: number) => {
    setPagina(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Wrapper>
      <BarraTopo>
        <BuscaInput
          type="search"
          placeholder="Search recipes by name..."
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
          <span>Filters</span>
          {filtrosAtivos > 0 && <Badge>{filtrosAtivos}</Badge>}
        </BotaoFunil>
      </BarraTopo>

      <Conteudo>
        {status === 'idle' && (
          <Mensagem>Start by searching for a recipe by name or opening the filters.</Mensagem>
        )}

        {status === 'carregando' && <Spinner />}

        {status === 'erro' && <Mensagem erro>Search failed: {erro}</Mensagem>}

        {status === 'sucesso' && receitas.length === 0 && (
          <Mensagem>No recipes found with these filters.</Mensagem>
        )}

        {status === 'sucesso' && receitas.length > 0 && usandoMocks && (
          <AvisoMock>
            Showing local examples — set your Spoonacular API key in
            <code> .env.local </code> for real results.
          </AvisoMock>
        )}

        {status === 'sucesso' && receitas.length > 0 && (
          <>
            <Grid>
              {receitasNaPagina.map((r) => (
                <CardReceita key={r.id} receita={r} />
              ))}
            </Grid>

            {totalPaginas > 1 && (
              <Paginacao>
                <BotaoPagina
                  type="button"
                  onClick={() => irPara(pagina - 1)}
                  disabled={!podeAnterior}
                >
                  ← Previous
                </BotaoPagina>

                <InfoPagina>
                  Page <strong>{pagina + 1}</strong> of {totalPaginas}
                  <ContagemTotal>
                    {total} {total === 1 ? 'recipe' : 'recipes'}
                  </ContagemTotal>
                </InfoPagina>

                <BotaoPagina
                  type="button"
                  onClick={() => irPara(pagina + 1)}
                  disabled={!podeProxima}
                >
                  Next →
                </BotaoPagina>
              </Paginacao>
            )}
          </>
        )}
      </Conteudo>

      <Drawer
        aberto={drawerAberto}
        onFechar={() => setDrawerAberto(false)}
        titulo="Filters"
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

const Paginacao = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacos.md};
  margin-top: ${({ theme }) => theme.espacos['2xl']};
  padding-top: ${({ theme }) => theme.espacos.lg};
  border-top: 1px solid ${({ theme }) => theme.cores.borda};

  ${({ theme }) => theme.media.mobile} {
    gap: ${({ theme }) => theme.espacos.lg};
  }
`;

const BotaoPagina = styled.button`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  background: transparent;
  color: ${({ theme }) => theme.cores.texto.primario};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.pill};
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s, opacity 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.cores.sage[900]};
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const InfoPagina = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-align: center;

  strong {
    color: ${({ theme }) => theme.cores.sage[900]};
    font-weight: ${({ theme }) => theme.pesoFonte.medium};
  }
`;

const ContagemTotal = styled.span`
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  color: ${({ theme }) => theme.cores.texto.muted};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;
