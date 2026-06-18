// Botão base reutilizável — Aula 6: estilo dinâmico via prop "variante".
import styled from '@emotion/styled';
import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'fantasma';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export default function Button({ variante = 'primario', ...props }: BotaoProps) {
  return <BotaoEstilizado variante={variante} {...props} />;
}

const BotaoEstilizado = styled.button<{ variante: Variante }>`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  letter-spacing: 0.05em;
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  border-radius: ${({ theme }) => theme.bordas.pill};
  border: 1px solid transparent;
  transition: all 0.2s ease;

  ${({ variante, theme }) => {
    switch (variante) {
      case 'primario':
        return `
          background: ${theme.cores.sage[900]};
          color: ${theme.cores.branco};
          &:hover { background: ${theme.cores.texto.secundario}; }
        `;
      case 'secundario':
        return `
          background: ${theme.cores.cream[300]};
          color: ${theme.cores.texto.primario};
          &:hover { background: ${theme.cores.cream[500]}; }
        `;
      case 'fantasma':
        return `
          background: transparent;
          color: ${theme.cores.texto.primario};
          border-color: ${theme.cores.borda};
          &:hover { border-color: ${theme.cores.sage[900]}; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
