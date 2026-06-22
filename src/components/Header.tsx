// Header com tipografia serifada elegante (Fraunces).
// Minimalista: linha fina, navegação discreta, logo em destaque.
// "Favoritas" e "Salvas" agora vivem em um dropdown sob o ícone de perfil.

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../useLocalStorage';

interface Sessao {
  logado: boolean;
  email: string;
}

export default function Header() {
  const [sessao, setSessao] = useLocalStorage<Sessao | null>('guilt-free-sessao', null);
  const [menuAberto, setMenuAberto] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha o dropdown ao clicar fora ou apertar ESC
  useEffect(() => {
    if (!menuAberto) return;

    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false);
    };

    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuAberto]);

  const irPara = (rota: string) => {
    setMenuAberto(false);
    navigate(rota);
  };

  const sair = () => {
    setSessao(null);
    setMenuAberto(false);
    navigate('/login');
  };

  return (
    <Topo>
      <Logo to="/">Guilt Free</Logo>

      <Direita>
        <Nav>
          <ItemNav to="/" end>Início</ItemNav>
          <ItemNav to="/busca">Buscar</ItemNav>
        </Nav>

        <PerfilWrapper ref={wrapperRef}>
          <BotaoPerfil
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
          >
            <IconePerfil />
          </BotaoPerfil>

          {menuAberto && (
            <Dropdown role="menu">
              {sessao?.email && (
                <>
                  <EmailUsuario>{sessao.email}</EmailUsuario>
                  <Divisor />
                </>
              )}
              <ItemDropdown role="menuitem" onClick={() => irPara('/favoritas')}>
                Favoritas
              </ItemDropdown>
              <ItemDropdown role="menuitem" onClick={() => irPara('/salvas')}>
                Salvas
              </ItemDropdown>
              <Divisor />
              <ItemDropdown role="menuitem" onClick={sair}>
                Sair
              </ItemDropdown>
            </Dropdown>
          )}
        </PerfilWrapper>
      </Direita>
    </Topo>
  );
}

// Ícone de perfil — círculo com avatar genérico
function IconePerfil() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16.5, 7.5 14, 12 14 C16.5 14, 20 16.5, 20 21" />
    </svg>
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

const Direita = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.xl};
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

const PerfilWrapper = styled.div`
  position: relative;
`;

const BotaoPerfil = styled.button`
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};
  color: ${({ theme }) => theme.cores.texto.secundario};
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.cores.sage[900]};
    color: ${({ theme }) => theme.cores.sage[900]};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.espacos.sm});
  right: 0;
  min-width: 180px;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.md};
  box-shadow: ${({ theme }) => theme.sombras.media};
  padding: ${({ theme }) => theme.espacos.xs} 0;
  z-index: 20;

  /* Pequena animação ao abrir */
  animation: dropIn 0.15s ease-out;
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const ItemDropdown = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  color: ${({ theme }) => theme.cores.texto.primario};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.cores.cream[100]};
    color: ${({ theme }) => theme.cores.sage[900]};
  }
`;

const EmailUsuario = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  font-style: italic;
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  color: ${({ theme }) => theme.cores.sage[900]};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.lg};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
`;

const Divisor = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  margin: ${({ theme }) => theme.espacos.xs} 0;
`;
