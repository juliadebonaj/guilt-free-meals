// Router principal — Aula 3/4: createBrowserRouter + lazy por rota.
// Cada página vira um chunk separado (code splitting).

import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        lazy: async () => ({ Component: (await import('./pages/Login')).default }),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('./pages/Home')).default }),
          },
          {
            path: 'receita/:id',
            lazy: async () => ({
              Component: (await import('./pages/RecipeDetails')).default,
            }),
          },
          {
            path: 'favoritas',
            lazy: async () => ({
              Component: (await import('./pages/Favorites')).default,
            }),
          },
          {
            path: 'salvas',
            lazy: async () => ({
              Component: (await import('./pages/Salvas')).default,
            }),
          },
          {
            path: 'busca',
            lazy: async () => ({ Component: (await import('./pages/Search')).default }),
          },
          {
            path: '*',
            lazy: async () => ({ Component: (await import('./pages/NotFound')).default }),
          },
        ],
      },
    ],
  },
]);
