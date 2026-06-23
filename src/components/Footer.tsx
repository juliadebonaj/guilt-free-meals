import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <Rodape>
      <small>GuiltFreeMeal &middot; Guilt-Free Recipes</small>
      <Links>
        <FooterLink to="/sobre">About</FooterLink>
        <Separador aria-hidden>·</Separador>
        <FooterLink to="/privacidade">Privacy Policy</FooterLink>
      </Links>
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

const Links = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.sm};
  margin-top: ${({ theme }) => theme.espacos.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.cores.texto.muted};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`;

const Separador = styled.span`
  color: ${({ theme }) => theme.cores.borda};
`;
