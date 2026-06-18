// Layout raiz — header e footer compartilhados, conteúdo via <Outlet>.
// Aula 4: padrão de "rotas de layout".

import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
