// Página de detalhes da receita — lê dos mocks locais (sem chamada de API).
// Layout: hero com imagem + título, coluna de ingredientes (esquerda)
// e coluna de passos (direita, mais larga).

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconeColher from '../components/IconeColher';
import IconeSalvar from '../components/IconeSalvar';
import Spinner from '../components/Spinner';
import Tooltip from '../components/Tooltip';
import { buscarReceitaCompletaMock } from '../mocks';
import { useReceitas } from '../ReceitasContext';
import type { Receita, ReceitaResumo, StatusRequisicao } from '../types';

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useReceitas();
  const [receita, setReceita] = useState<Receita | null>(null);
  const [status, setStatus] = useState<StatusRequisicao>('idle');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const numId = Number(id);
    if (!id || Number.isNaN(numId)) {
      setErro('ID de receita inválido.');
      setStatus('erro');
      return;
    }

    setStatus('carregando');
    setErro(null);

    // Pequeno delay artificial pra mostrar o spinner brevemente — opcional
    const timer = setTimeout(() => {
      const encontrada = buscarReceitaCompletaMock(numId);
      if (!encontrada) {
        setErro('Receita não encontrada.');
        setStatus('erro');
        return;
      }
      setReceita(encontrada);
      setStatus('sucesso');
      dispatch({ type: 'DETALHE_CARREGADO', payload: encontrada });
    }, 150);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  if (status === 'carregando' || status === 'idle') return <Spinner />;

  if (status === 'erro' || !receita) {
    return (
      <Container>
        <MensagemErro>
          <RotuloErro>Algo deu errado</RotuloErro>
          <TextoErro>{erro ?? 'Não foi possível carregar a receita.'}</TextoErro>
          <Voltar type="button" onClick={() => navigate(-1)}>
            ← Voltar
          </Voltar>
        </MensagemErro>
      </Container>
    );
  }

  // Para os botões precisamos do ReceitaResumo (subset do Receita completo)
  const resumoParaContext: ReceitaResumo = {
    id: receita.id,
    titulo: receita.titulo,
    imagemUrl: receita.imagemUrl,
    tempoPreparoMin: receita.tempoPreparoMin,
    porcoes: receita.porcoes,
    categorias: receita.categorias,
    resumo: receita.resumo,
    ingredientesPreview: receita.ingredientes.map((i) => i.nome).slice(0, 6),
  };

  const ehFavorita = state.favoritas.some((f) => f.id === receita.id);
  const ehSalva = state.salvas.some((s) => s.id === receita.id);

  const alternarFavorita = () => {
    dispatch({
      type: ehFavorita ? 'FAVORITA_REMOVIDA' : 'FAVORITA_ADICIONADA',
      payload: ehFavorita ? receita.id : resumoParaContext,
    } as never);
  };

  const alternarSalva = () => {
    dispatch({
      type: ehSalva ? 'SALVA_REMOVIDA' : 'SALVA_ADICIONADA',
      payload: ehSalva ? receita.id : resumoParaContext,
    } as never);
  };

  return (
    <Container>
      <LinkVoltar type="button" onClick={() => navigate(-1)}>
        ← Voltar
      </LinkVoltar>

      <Hero>
        <HeroImagem>
          <img src={receita.imagemUrl} alt={receita.titulo} />
        </HeroImagem>

        <HeroConteudo>
          <Rotulo>Receita</Rotulo>
          <Titulo>{receita.titulo}</Titulo>

          <Meta>
            <MetaItem>
              <MetaValor>{receita.tempoPreparoMin}</MetaValor>
              <MetaRotulo>minutos</MetaRotulo>
            </MetaItem>
            <Divisor />
            <MetaItem>
              <MetaValor>{receita.porcoes}</MetaValor>
              <MetaRotulo>porções</MetaRotulo>
            </MetaItem>
            <Divisor />
            <MetaItem>
              <MetaValor>{receita.ingredientes.length}</MetaValor>
              <MetaRotulo>ingredientes</MetaRotulo>
            </MetaItem>
          </Meta>

          {receita.categorias.length > 0 && (
            <Categorias>
              {receita.categorias.slice(0, 6).map((c) => (
                <Categoria key={c}>{c}</Categoria>
              ))}
            </Categorias>
          )}

          <Acoes>
            <Tooltip texto={ehFavorita ? 'Remover dos favoritos' : 'Favoritar'}>
              <BotaoFavoritar
                type="button"
                onClick={alternarFavorita}
                ativo={ehFavorita}
              >
                <IconeColher preenchida={ehFavorita} />
                <span>{ehFavorita ? 'Favoritada' : 'Favoritar'}</span>
              </BotaoFavoritar>
            </Tooltip>

            <Tooltip texto={ehSalva ? 'Remover dos salvos' : 'Salvar para depois'}>
              <BotaoAcao
                type="button"
                onClick={alternarSalva}
                ativo={ehSalva}
              >
                <IconeSalvar preenchida={ehSalva} />
                <span>{ehSalva ? 'Salva' : 'Salvar'}</span>
              </BotaoAcao>
            </Tooltip>
          </Acoes>
        </HeroConteudo>
      </Hero>

      {receita.resumo && (
        <Secao>
          <SecaoRotulo>Sobre</SecaoRotulo>
          <SecaoTitulo>A <em>história</em> do prato</SecaoTitulo>
          <Resumo>{receita.resumo}</Resumo>
        </Secao>
      )}

      <Conteudo>
        <ColunaIngredientes>
          <SecaoRotulo>Lista</SecaoRotulo>
          <SecaoTitulo>Ingredientes</SecaoTitulo>
          <ListaIngredientes>
            {receita.ingredientes.map((ing) => (
              <ItemIngrediente key={ing.id}>
                {ing.imagemUrl && (
                  <IngredienteImg src={ing.imagemUrl} alt="" loading="lazy" />
                )}
                <IngredienteTexto>
                  <IngredienteNome>{ing.nome}</IngredienteNome>
                  {(ing.quantidade > 0 || ing.unidade) && (
                    <IngredienteQuant>
                      {ing.quantidade > 0 && formatarQuantidade(ing.quantidade)}{' '}
                      {ing.unidade}
                    </IngredienteQuant>
                  )}
                </IngredienteTexto>
              </ItemIngrediente>
            ))}
          </ListaIngredientes>
        </ColunaIngredientes>

        <ColunaPassos>
          <SecaoRotulo>Modo de preparo</SecaoRotulo>
          <SecaoTitulo>Passo a <em>passo</em></SecaoTitulo>
          {receita.passos.length > 0 ? (
            <ListaPassos>
              {receita.passos.map((p) => (
                <ItemPasso key={p.numero}>
                  <PassoNumero>{String(p.numero).padStart(2, '0')}</PassoNumero>
                  <PassoTexto>{p.descricao}</PassoTexto>
                </ItemPasso>
              ))}
            </ListaPassos>
          ) : (
            <SemPassos>
              Esta receita ainda não tem instruções passo a passo na nossa base.
            </SemPassos>
          )}
        </ColunaPassos>
      </Conteudo>
    </Container>
  );
}

// Converte 0.5 → "½", 1.25 → "1 ¼", 2 → "2"
function formatarQuantidade(q: number): string {
  if (Number.isInteger(q)) return String(q);
  // arredonda em 2 casas pra evitar ruído de float
  return (Math.round(q * 100) / 100).toString();
}

// --- Styled ---

const Container = styled.article`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos.xl} ${({ theme }) => theme.espacos.lg}
    ${({ theme }) => theme.espacos['3xl']};
`;

const LinkVoltar = styled.button`
  background: transparent;
  border: none;
  padding: 0 0 ${({ theme }) => theme.espacos.lg};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.secundario};
  cursor: pointer;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.cores.sage[900]};
  }
`;

const Hero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.espacos.xl};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.espacos['2xl']};
  }
`;

const HeroImagem = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.bordas.lg};
  background: ${({ theme }) => theme.cores.cream[300]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeroConteudo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.md};
`;

const Rotulo = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  color: ${({ theme }) => theme.cores.texto.primario};
  line-height: 1.15;
  letter-spacing: -0.01em;

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.md};
  padding: ${({ theme }) => theme.espacos.md} 0;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const MetaValor = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  color: ${({ theme }) => theme.cores.sage[900]};
  line-height: 1;
`;

const MetaRotulo = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.cores.texto.muted};
`;

const Divisor = styled.span`
  width: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.cores.borda};
`;

const Categorias = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espacos.xs};
`;

const Categoria = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  text-transform: lowercase;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.cores.texto.secundario};
  background: ${({ theme }) => theme.cores.cream[300]};
  padding: ${({ theme }) => theme.espacos.xs} ${({ theme }) => theme.espacos.sm};
  border-radius: ${({ theme }) => theme.bordas.pill};
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espacos.sm};
  margin-top: ${({ theme }) => theme.espacos.sm};
`;

const BotaoFavoritar = styled.button<{ ativo: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.sm};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  border-radius: ${({ theme }) => theme.bordas.pill};
  border: 1px solid
    ${({ ativo }) => (ativo ? '#C9A961' : '#E5D9B6')};
  background: ${({ theme, ativo }) =>
    ativo ? '#C9A961' : theme.cores.superficie};
  color: ${({ theme, ativo }) => (ativo ? theme.cores.branco : '#C9A961')};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: #C9A961;
    background: ${({ ativo }) => (ativo ? '#B8995A' : '#FFFBF2')};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const BotaoAcao = styled.button<{ ativo: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.sm};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  border-radius: ${({ theme }) => theme.bordas.pill};
  border: 1px solid
    ${({ theme, ativo }) =>
      ativo ? theme.cores.sage[900] : theme.cores.borda};
  background: ${({ theme, ativo }) =>
    ativo ? theme.cores.sage[900] : theme.cores.superficie};
  color: ${({ theme, ativo }) =>
    ativo ? theme.cores.branco : theme.cores.texto.secundario};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.cores.sage[900]};
    color: ${({ theme, ativo }) =>
      ativo ? theme.cores.branco : theme.cores.sage[900]};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Secao = styled.section`
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};
`;

const SecaoRotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.xs};
`;

const SecaoTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  color: ${({ theme }) => theme.cores.texto.primario};
  margin-bottom: ${({ theme }) => theme.espacos.md};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  }
`;

const Resumo = styled.p`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  line-height: 1.7;
  color: ${({ theme }) => theme.cores.texto.secundario};
  max-width: 70ch;
`;

const Conteudo = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.espacos['2xl']};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(260px, 1fr) 2fr;
    gap: ${({ theme }) => theme.espacos['3xl']};
    align-items: flex-start;
  }
`;

const ColunaIngredientes = styled.aside`
  ${({ theme }) => theme.media.tablet} {
    position: sticky;
    top: 96px; /* abaixo do header sticky */
  }
`;

const ListaIngredientes = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const ItemIngrediente = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.md};
  padding: ${({ theme }) => theme.espacos.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};

  &:last-child {
    border-bottom: none;
  }
`;

const IngredienteImg = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  background: ${({ theme }) => theme.cores.cream[100]};
  border-radius: ${({ theme }) => theme.bordas.sm};
  flex-shrink: 0;
`;

const IngredienteTexto = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IngredienteNome = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  color: ${({ theme }) => theme.cores.texto.primario};
  text-transform: capitalize;
`;

const IngredienteQuant = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.muted};
`;

const ColunaPassos = styled.section``;

const ListaPassos = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.lg};
`;

const ItemPasso = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.espacos.md};
  align-items: flex-start;
`;

const PassoNumero = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-style: italic;
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  color: ${({ theme }) => theme.cores.sage[900]};
  line-height: 1;
  min-width: 2.5ch;
`;

const PassoTexto = styled.p`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  line-height: 1.7;
  color: ${({ theme }) => theme.cores.texto.secundario};
`;

const SemPassos = styled.p`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  color: ${({ theme }) => theme.cores.texto.muted};
  font-style: italic;
`;

const MensagemErro = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.espacos['2xl']} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.md};
`;

const RotuloErro = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.estados.erro};
`;

const TextoErro = styled.p`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  color: ${({ theme }) => theme.cores.texto.primario};
`;

const Voltar = styled.button`
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  border: none;
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.xl};
  border-radius: ${({ theme }) => theme.bordas.pill};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.cores.texto.secundario};
  }
`;
