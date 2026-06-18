// App: providers globais (Theme + Estado) + Router.
import { ThemeProvider } from '@emotion/react';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { ReceitasProvider } from './ReceitasContext';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ReceitasProvider>
        <RouterProvider router={router} />
      </ReceitasProvider>
    </ThemeProvider>
  );
}
