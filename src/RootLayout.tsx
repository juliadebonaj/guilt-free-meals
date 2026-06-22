// Layout raiz — header e footer compartilhados, conteúdo via <Outlet>.
// Aula 4: padrão de "rotas de layout".
// Adiciona transição suave entre rotas: cada navegação remonta o container
// (via `key={location.key}`), disparando a animação CSS de fade + slide.
// Também rola para o topo automaticamente em cada nova rota.

import { Suspense, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

export default function RootLayout() {
  const location = useLocation();

  // Rola pro topo a cada mudança de rota (smooth)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Spinner />}>
          <PageTransition key={location.key}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageTransition = styled.div`
  animation: ${fadeSlideIn} 0.35s ease-out;

  /* Respeita usuários com prefer-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
