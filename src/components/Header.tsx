// Header com tipografia serifada elegante (Fraunces) — Aula 6.
// Minimalista: linha fina, navegação discreta, logo em destaque.

import styled from '@emotion/styled';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <Topo>
      <Logo to="/">Guilt Free</Logo>
      <Nav>
        <ItemNav to="/" end>Início</ItemNav>
        <ItemNav to="/busca">Buscar</ItemNav>
        <ItemNav to="/favoritas">Favoritas</ItemNav>
      </Nav>
    </Topo>
  );
}

const Topo = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.espacos.lg} ${({ theme }) => theme.espacos.xl};
  background: ${({ theme }) => theme.cores.superficie};
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.cores.sage[900]};
  font-style: italic;

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.espacos.lg};
`;

const ItemNav = styled(NavLink)`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: ${({ theme }) => theme.espacos.xs} 0;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.primario};
  }

  &.active {
    color: ${({ theme }) => theme.cores.sage[900]};
    border-bottom-color: ${({ theme }) => theme.cores.sage[900]};
  }
`;
