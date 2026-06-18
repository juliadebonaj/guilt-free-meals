// Drawer lateral genérico — abre da direita com overlay.
// Fecha clicando no overlay ou apertando ESC. Acessível.

import styled from '@emotion/styled';
import { useEffect, type ReactNode } from 'react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  titulo?: string;
  children: ReactNode;
}

export default function Drawer({ aberto, onFechar, titulo, children }: Props) {
  // Fecha com ESC
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', onKey);
    // Trava o scroll do body enquanto o drawer está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [aberto, onFechar]);

  return (
    <>
      <Overlay aberto={aberto} onClick={onFechar} aria-hidden={!aberto} />
      <Painel
        aberto={aberto}
        role="dialog"
        aria-modal="true"
        aria-label={titulo ?? 'Painel lateral'}
      >
        <Topo>
          {titulo && <Titulo>{titulo}</Titulo>}
          <BotaoFechar onClick={onFechar} aria-label="Fechar">
            ×
          </BotaoFechar>
        </Topo>
        <Corpo>{children}</Corpo>
      </Painel>
    </>
  );
}

const Overlay = styled.div<{ aberto: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(42, 42, 40, 0.4);
  opacity: ${({ aberto }) => (aberto ? 1 : 0)};
  pointer-events: ${({ aberto }) => (aberto ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 50;
`;

const Painel = styled.aside<{ aberto: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(420px, 92vw);
  background: ${({ theme }) => theme.cores.superficie};
  box-shadow: ${({ theme }) => theme.sombras.forte};
  transform: translateX(${({ aberto }) => (aberto ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 51;
  display: flex;
  flex-direction: column;
`;

const Topo = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.espacos.lg};
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
`;

const Titulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  font-style: italic;
  color: ${({ theme }) => theme.cores.sage[900]};
`;

const BotaoFechar = styled.button`
  background: transparent;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: ${({ theme }) => theme.cores.texto.secundario};
  padding: 0 ${({ theme }) => theme.espacos.xs};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.primario};
  }
`;

const Corpo = styled.div`
  padding: ${({ theme }) => theme.espacos.lg};
  overflow-y: auto;
  flex: 1;
`;
