// Card de receita — usado nas listagens. Memoizado para listas grandes (Aula 5).
import styled from '@emotion/styled';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { ReceitaResumo } from '../types';

interface Props {
  receita: ReceitaResumo;
}

function CardReceita({ receita }: Props) {
  const ingredientesVisiveis = receita.ingredientesPreview.slice(0, 4);
  const restantes = receita.ingredientesPreview.length - ingredientesVisiveis.length;

  return (
    <Cartao to={`/receita/${receita.id}`}>
      <CapaImg>
        <img src={receita.imagemUrl} alt={receita.titulo} loading="lazy" />
      </CapaImg>

      <Conteudo>
        <Titulo>{receita.titulo}</Titulo>

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

const Conteudo = styled.div`
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.md}
    ${({ theme }) => theme.espacos.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.sm};
  flex: 1;
`;

const Titulo = styled.h3`
  font-size: ${({ theme }) => theme.tamanhosFonte.lg};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  color: ${({ theme }) => theme.cores.texto.primario};
  line-height: 1.3;
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
