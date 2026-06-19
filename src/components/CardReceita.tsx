// Card de receita — usado nas listagens. Memoizado para listas grandes (Aula 5).
import styled from '@emotion/styled';
import { memo, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ReceitaResumo } from '../types';
import { useReceitas } from '../ReceitasContext';
import IconeColher from './IconeColher';
import IconeSalvar from './IconeSalvar';
import Tooltip from './Tooltip';

interface Props {
  receita: ReceitaResumo;
}

function CardReceita({ receita }: Props) {
  const { state, dispatch } = useReceitas();
  const ehFavorita = state.favoritas.some((f) => f.id === receita.id);
  const ehSalva = state.salvas.some((s) => s.id === receita.id);

  const ingredientesVisiveis = receita.ingredientesPreview.slice(0, 4);
  const restantes = receita.ingredientesPreview.length - ingredientesVisiveis.length;

  const alternarFavorita = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: ehFavorita ? 'FAVORITA_REMOVIDA' : 'FAVORITA_ADICIONADA',
      payload: ehFavorita ? receita.id : receita,
    } as never);
  };

  const alternarSalva = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: ehSalva ? 'SALVA_REMOVIDA' : 'SALVA_ADICIONADA',
      payload: ehSalva ? receita.id : receita,
    } as never);
  };

  return (
    <Cartao to={`/receita/${receita.id}`}>
      <CapaImg>
        <img src={receita.imagemUrl} alt={receita.titulo} loading="lazy" />

        <FavoritarSlot>
          <Tooltip texto={ehFavorita ? 'Remover dos favoritos' : 'Favoritar'}>
            <BotaoFavoritar
              type="button"
              onClick={alternarFavorita}
              ativo={ehFavorita}
              aria-label={ehFavorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={ehFavorita}
            >
              <IconeColher preenchida={ehFavorita} />
            </BotaoFavoritar>
          </Tooltip>
        </FavoritarSlot>
      </CapaImg>

      <Conteudo>
        <LinhaTitulo>
          <Titulo>{receita.titulo}</Titulo>
          <Tooltip texto={ehSalva ? 'Remover dos salvos' : 'Salvar para depois'}>
            <BotaoSalvar
              type="button"
              onClick={alternarSalva}
              ativo={ehSalva}
              aria-label={ehSalva ? 'Remover dos salvos' : 'Salvar para depois'}
              aria-pressed={ehSalva}
            >
              <IconeSalvar preenchida={ehSalva} />
            </BotaoSalvar>
          </Tooltip>
        </LinhaTitulo>

        <Meta>
          <span>{receita.tempoPreparoMin} min</span>
          <Bullet>·</Bullet>
          <span>{receita.porcoes} porções</span>
        </Meta>

        {receita.resumo && <Resumo>{receita.resumo}</Resumo>}

        {ingredientesVisiveis.length > 0 && (
          <Chips>
            {ingredientesVisiveis.map((nome) => (
              <Chip key={nome}>{nome}</Chip>
            ))}
            {restantes > 0 && <ChipExtra>+{restantes}</ChipExtra>}
          </Chips>
        )}
      </Conteudo>
    </Cartao>
  );
}

// React.memo evita re-render quando o pai renderiza mas a prop "receita" não muda.
export default memo(CardReceita);

const Cartao = styled(Link)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.cores.superficie};
  border-radius: ${({ theme }) => theme.bordas.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  height: 100%;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.sombras.media};
    border-color: ${({ theme }) => theme.cores.sage[500]};
  }
`;

const CapaImg = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: ${({ theme }) => theme.cores.cream[300]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${Cartao}:hover & img {
    transform: scale(1.04);
  }
`;

const FavoritarSlot = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.espacos.sm};
  right: ${({ theme }) => theme.espacos.sm};
`;

const BotaoFavoritar = styled.button<{ ativo: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: ${({ ativo }) =>
    ativo ? '#C9A961' : 'rgba(255, 255, 255, 0.92)'};
  color: ${({ theme, ativo }) =>
    ativo ? theme.cores.branco : '#C9A961'};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.sombras.sutil};
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.08);
    background: ${({ ativo }) => (ativo ? '#B8995A' : '#FFFFFF')};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BotaoSalvar = styled.button<{ ativo: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme, ativo }) =>
    ativo ? theme.cores.sage[900] : theme.cores.texto.muted};
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.cores.sage[900]};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Conteudo = styled.div`
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.md}
    ${({ theme }) => theme.espacos.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.sm};
  flex: 1;
`;

const LinhaTitulo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacos.sm};
`;

const Titulo = styled.h3`
  font-size: ${({ theme }) => theme.tamanhosFonte.lg};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  color: ${({ theme }) => theme.cores.texto.primario};
  line-height: 1.3;
  flex: 1;
`;

const Meta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espacos.xs};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.muted};
  letter-spacing: 0.02em;
`;

const Bullet = styled.span`
  color: ${({ theme }) => theme.cores.sage[500]};
`;

const Resumo = styled.p`
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.secundario};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espacos.xs};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.espacos.sm};
`;

const Chip = styled.span`
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  color: ${({ theme }) => theme.cores.texto.secundario};
  background: ${({ theme }) => theme.cores.cream[300]};
  padding: ${({ theme }) => theme.espacos.xs} ${({ theme }) => theme.espacos.sm};
  border-radius: ${({ theme }) => theme.bordas.pill};
  text-transform: lowercase;
  letter-spacing: 0.02em;
`;

const ChipExtra = styled(Chip)`
  background: transparent;
  color: ${({ theme }) => theme.cores.texto.muted};
  border: 1px solid ${({ theme }) => theme.cores.borda};
`;
