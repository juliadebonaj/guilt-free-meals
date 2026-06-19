// Tooltip em CSS puro renderizado via Portal — escapa de qualquer overflow:hidden
// nos ancestrais. Posicionamento calculado com getBoundingClientRect.
//
// Acessível: usa role="tooltip"; o aria-label do elemento envolvido continua
// sendo a fonte para leitores de tela.

import styled from '@emotion/styled';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Posicao = 'acima' | 'abaixo';

interface Props {
  texto: string;
  posicao?: Posicao;
  children: ReactNode;
}

interface Coords {
  top: number;
  left: number;
}

export default function Tooltip({ texto, posicao = 'acima', children }: Props) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);

  // Recalcula a posição quando o tooltip aparece (usa rect do gatilho)
  useLayoutEffect(() => {
    if (!visivel || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const y = posicao === 'acima' ? rect.top - 8 : rect.bottom + 8;
    setCoords({ top: y, left: centroX });
  }, [visivel, posicao]);

  return (
    <>
      <Wrapper
        ref={wrapperRef}
        onMouseEnter={() => setVisivel(true)}
        onMouseLeave={() => setVisivel(false)}
        onFocus={() => setVisivel(true)}
        onBlur={() => setVisivel(false)}
      >
        {children}
      </Wrapper>

      {visivel && coords &&
        createPortal(
          <Bolha
            role="tooltip"
            posicao={posicao}
            style={{ top: coords.top, left: coords.left }}
          >
            {texto}
          </Bolha>,
          document.body
        )}
    </>
  );
}

const Wrapper = styled.span`
  display: inline-flex;
`;

const Bolha = styled.span<{ posicao: Posicao }>`
  position: fixed;
  /* Posicionamento ancorado ao centro horizontal do gatilho;
     transform vertical depende de estar acima ou abaixo. */
  transform: translate(-50%, ${({ posicao }) => (posicao === 'acima' ? '-100%' : '0')});
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  letter-spacing: 0.02em;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.bordas.sm};
  box-shadow: ${({ theme }) => theme.sombras.media};
  z-index: 1000;
  pointer-events: none;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Setinha apontando para o gatilho */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    ${({ posicao, theme }) =>
      posicao === 'acima'
        ? `
          top: 100%;
          border-width: 4px 4px 0;
          border-color: ${theme.cores.sage[900]} transparent transparent;
        `
        : `
          bottom: 100%;
          border-width: 0 4px 4px;
          border-color: transparent transparent ${theme.cores.sage[900]};
        `}
  }
`;
