import styled from '@emotion/styled';

export default function Footer() {
  return (
    <Rodape>
      <small>GuiltFreeMeal &middot; Guilt-Free Recipes</small>
    </Rodape>
  );
}

const Rodape = styled.footer`
  text-align: center;
  padding: ${({ theme }) => theme.espacos.xl};
  margin-top: ${({ theme }) => theme.espacos['3xl']};
  color: ${({ theme }) => theme.cores.texto.muted};
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.05em;
`;
