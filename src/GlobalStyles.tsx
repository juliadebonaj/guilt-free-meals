import { css, Global } from '@emotion/react';
import { theme } from './theme';

// Estilos globais — reset leve + base tipográfica + variáveis do tema aplicadas no body.
export const GlobalStyles = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: ${theme.fontes.corpo};
        background-color: ${theme.cores.fundo};
        color: ${theme.cores.texto.primario};
        line-height: 1.6;
        min-height: 100vh;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: ${theme.fontes.titulo};
        font-weight: ${theme.pesoFonte.medium};
        line-height: 1.2;
        letter-spacing: -0.01em;
        color: ${theme.cores.texto.primario};
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        font-family: inherit;
        cursor: pointer;
      }

      img {
        max-width: 100%;
        display: block;
      }

      /* Foco acessível — Aula bônus de acessibilidade */
      :focus-visible {
        outline: 2px solid ${theme.cores.sage[900]};
        outline-offset: 2px;
      }
    `}
  />
);
