import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const girar = keyframes`
  to { transform: rotate(360deg); }
`;

export default function Spinner() {
  return (
    <Container role="status" aria-label="Carregando">
      <Circulo />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.espacos['2xl']};
`;

const Circulo = styled.span`
  width: 32px;
  height: 32px;
  border: 2px solid ${({ theme }) => theme.cores.borda};
  border-top-color: ${({ theme }) => theme.cores.sage[900]};
  border-radius: 50%;
  animation: ${girar} 0.8s linear infinite;
`;
