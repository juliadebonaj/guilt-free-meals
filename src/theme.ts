// Tema central da aplicação — referência única para cores, espaçamentos e tipografia.
// Aula 6: nenhum componente deve usar valores "mágicos"; tudo vem daqui.

export const theme = {
  cores: {
    // Paleta Oatmeal (sage/verde-acinzentado)
    sage: {
      900: '#92957E', // mais escuro — usado em CTAs, headers
      700: '#AAAC9A',
      500: '#C1C3B6',
      300: '#D9DAD2',
      100: '#F1F1EE', // quase branco, ótimo para fundos
    },
    // Paleta neutros bege/cream — secundária, para cards e seções
    cream: {
      900: '#CFC8B9',
      700: '#D9D2C5',
      500: '#E2DCD2',
      300: '#EAE6DD',
      100: '#F2EFE9',
    },
    branco: '#FFFFFF',
    // Tons de texto — derivados sobre fundo claro
    texto: {
      primario: '#2A2A28',   // quase preto com leve calor
      secundario: '#5C5E54', // sage muito escuro
      muted: '#8A8C7E',
    },
    // Estados (usar com parcimônia para manter o minimalismo)
    estados: {
      sucesso: '#7A8B6B',
      erro: '#A86A6A',
      aviso: '#C9A961',
    },
    // Atalhos semânticos — preferir estes nos componentes
    primaria: '#92957E',
    fundo: '#F2EFE9',
    superficie: '#FFFFFF',
    borda: '#D9DAD2',
  },

  fontes: {
    // Header / títulos — serifada elegante (carregar via Google Fonts no index.html)
    titulo: "'Fraunces', 'Playfair Display', Georgia, serif",
    // Corpo — sans-serif limpa
    corpo: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  tamanhosFonte: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.75rem',
    '4xl': '3.5rem', // hero do header
  },

  pesoFonte: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  espacos: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  bordas: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '999px',
  },

  sombras: {
    sutil: '0 1px 2px rgba(42, 42, 40, 0.04)',
    media: '0 4px 12px rgba(42, 42, 40, 0.08)',
    forte: '0 8px 24px rgba(42, 42, 40, 0.12)',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Helpers de media query — usar como ${({ theme }) => theme.media.tablet}
  media: {
    mobile: '@media (min-width: 480px)',
    tablet: '@media (min-width: 768px)',
    desktop: '@media (min-width: 1024px)',
    wide: '@media (min-width: 1280px)',
  },
} as const;

export type Theme = typeof theme;

// Necessário para o Emotion enxergar o tipo do tema dentro do styled
declare module '@emotion/react' {
  export interface Theme extends Record<string, unknown> {
    cores: typeof theme.cores;
    fontes: typeof theme.fontes;
    tamanhosFonte: typeof theme.tamanhosFonte;
    pesoFonte: typeof theme.pesoFonte;
    espacos: typeof theme.espacos;
    bordas: typeof theme.bordas;
    sombras: typeof theme.sombras;
    breakpoints: typeof theme.breakpoints;
    media: typeof theme.media;
  }
}
