import styled from '@emotion/styled';

export default function PrivacyPolicy() {
  return (
    <Pagina>
      <Cabecalho>
        <Rotulo>Legal</Rotulo>
        <Titulo>Privacy <em>Policy</em></Titulo>
        <DataAtualizacao>Last updated: June 23, 2025</DataAtualizacao>
      </Cabecalho>

      <Conteudo>
        <Secao>
          <SecaoTitulo>Introduction</SecaoTitulo>
          <Paragrafo>
            GuiltFreeMeal respects your privacy. This page explains what we store and how
            we use it. By using the app, you agree to what's described here.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Data We Collect</SecaoTitulo>
          <Paragrafo>
            We don't run a backend. Everything stays in your browser's localStorage:
          </Paragrafo>
          <Lista>
            <li>
              <strong>Session</strong> — your email and login state, so you stay signed in.
            </li>
            <li>
              <strong>Recipe cache</strong> — results from the Spoonacular API, to avoid
              repeated requests.
            </li>
            <li>
              <strong>Favorites and saved recipes</strong> — the IDs you choose to keep.
            </li>
          </Lista>
          <Paragrafo>
            No names, no payment data, no location, no tracking.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Third-Party Services</SecaoTitulo>
          <Paragrafo>
            Recipes come from the{' '}
            <strong>Spoonacular API</strong>. When you load or search recipes, your request
            goes directly to their servers (including standard metadata like your IP). See{' '}
            <ExternalLink
              href="https://spoonacular.com/food-api/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spoonacular's terms and privacy policy
            </ExternalLink>
            . No analytics, ads, or social trackers are used.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Your Data, Your Control</SecaoTitulo>
          <Paragrafo>
            Since everything is local, you're always in control. Clearing site data in
            your browser removes your session, favorites, and cache instantly. We don't
            use cookies — just localStorage.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Changes</SecaoTitulo>
          <Paragrafo>
            We may update this policy occasionally. The "Last updated" date above will
            reflect any changes.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Contact</SecaoTitulo>
          <Paragrafo>
            Questions? Open an{' '}
            <ExternalLink
              href="https://github.com/juliadebonaj/guilt-free-meals/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              issue on GitHub
            </ExternalLink>
            .
          </Paragrafo>
        </Secao>
      </Conteudo>
    </Pagina>
  );
}

const Pagina = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos['3xl']} ${({ theme }) => theme.espacos.lg};
`;

const Cabecalho = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.espacos['3xl']};
`;

const Rotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.md};
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['4xl']};
  }
`;

const DataAtualizacao = styled.p`
  margin-top: ${({ theme }) => theme.espacos.md};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.muted};
  letter-spacing: 0.05em;
`;

const Conteudo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos['2xl']};
`;

const Secao = styled.section`
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  padding-top: ${({ theme }) => theme.espacos.xl};
`;

const SecaoTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xl};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  margin-bottom: ${({ theme }) => theme.espacos.md};
  color: ${({ theme }) => theme.cores.texto.primario};
`;

const Paragrafo = styled.p`
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  color: ${({ theme }) => theme.cores.texto.secundario};
  line-height: 1.7;
`;

const Lista = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.espacos.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.sm};

  li {
    font-size: ${({ theme }) => theme.tamanhosFonte.md};
    color: ${({ theme }) => theme.cores.texto.secundario};
    padding-left: ${({ theme }) => theme.espacos.lg};
    position: relative;
    line-height: 1.7;

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.cores.sage[900]};
    }

    strong {
      color: ${({ theme }) => theme.cores.texto.primario};
      font-weight: ${({ theme }) => theme.pesoFonte.medium};
    }

    code {
      font-family: monospace;
      font-size: 0.9em;
      background: ${({ theme }) => theme.cores.cream[100]};
      padding: 0.1em 0.4em;
      border-radius: ${({ theme }) => theme.bordas.sm};
    }
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.cores.sage[900]};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.primario};
  }
`;
