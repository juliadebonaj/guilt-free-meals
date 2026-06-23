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
            GuiltFreeMeal is committed to protecting your privacy.
            This policy explains what information is collected when you use our application,
            how it is used, and what controls you have over it. By using GuiltFreeMeal, you
            agree to the practices described here.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Data We Collect</SecaoTitulo>
          <Paragrafo>
            GuiltFreeMeal does not operate a backend server and does not transmit personal
            data to our own infrastructure. The only information we handle is stored
            directly in your browser:
          </Paragrafo>
          <Lista>
            <li>
              <strong>Session data</strong> — your email address and login state, kept in
              localStorage under the key <code>guilt-free-session</code> so you remain
              signed in between visits.
            </li>
            <li>
              <strong>Recipe cache</strong> — a local copy of recipe results fetched from
              the Spoonacular API, stored under the key <code>@GuiltFree:initialPool</code>{' '}
              to avoid unnecessary repeated requests.
            </li>
            <li>
              <strong>Favorites and saved recipes</strong> — the IDs of recipes you mark
              as favorite or save for later, kept in localStorage so your selections
              persist across sessions.
            </li>
          </Lista>
          <Paragrafo>
            We do not collect names, payment information, location data, or any data beyond
            what is listed above.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>How We Use Your Data</SecaoTitulo>
          <Paragrafo>
            The data stored in your browser is used solely to make the application work as
            expected: keeping you signed in, displaying your personal recipe collections,
            and reducing load times by caching API results locally. We do not use your data
            for advertising, profiling, or analytics.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Third-Party Services</SecaoTitulo>
          <Paragrafo>
            GuiltFreeMeal retrieves recipe data from the{' '}
            <strong>Spoonacular API</strong> (spoonacular.com). When you load recipes or
            perform a search, your request is sent directly to Spoonacular's servers. This
            includes standard network metadata such as your IP address, which is handled
            according to{' '}
            <ExternalLink
              href="https://spoonacular.com/food-api/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spoonacular's own Terms and Privacy Policy
            </ExternalLink>
            . We do not share any additional personal information with Spoonacular.
          </Paragrafo>
          <Paragrafo>
            No other third-party services (analytics, advertising networks, or social
            trackers) are integrated into this application.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Data Storage &amp; Security</SecaoTitulo>
          <Paragrafo>
            All data described in this policy is stored exclusively in your own browser's
            localStorage. It never leaves your device to our servers. Because of this, the
            security of this data depends on the security of your device and browser.
            We recommend keeping your browser up to date and avoiding the use of shared or
            public computers to access your account.
          </Paragrafo>
          <Paragrafo>
            Clearing your browser's site data for GuiltFreeMeal will permanently remove all
            locally stored information, including your session, favorites, and recipe cache.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Your Rights</SecaoTitulo>
          <Paragrafo>
            Because all data is stored locally on your device, you are always in full
            control of it. You can:
          </Paragrafo>
          <Lista>
            <li>
              <strong>Access your data</strong> — inspect the contents of localStorage in
              your browser's developer tools at any time.
            </li>
            <li>
              <strong>Delete your data</strong> — clear site data for GuiltFreeMeal in your
              browser settings to remove everything instantly.
            </li>
            <li>
              <strong>Correct your data</strong> — update your email or preferences by
              signing out and signing back in with updated information.
            </li>
          </Lista>
          <Paragrafo>
            If you have questions about your data or wish to exercise any rights under
            applicable law (including GDPR or LGPD), please contact us at the address
            listed at the end of this policy.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Local Storage &amp; Cookies</SecaoTitulo>
          <Paragrafo>
            GuiltFreeMeal does not use cookies. We use the browser's localStorage API
            exclusively. The data stored there persists until you manually clear it or
            uninstall the application. No tracking pixels or fingerprinting scripts are
            used.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Changes to This Policy</SecaoTitulo>
          <Paragrafo>
            We may update this policy from time to time. When we do, we will revise the
            "Last updated" date at the top of this page. We encourage you to review this
            policy periodically. Continued use of GuiltFreeMeal after any changes
            constitutes acceptance of the updated policy.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Contact</SecaoTitulo>
          <Paragrafo>
            If you have any questions or concerns about this Privacy Policy, feel free to
            reach out via our GitHub repository. You can open a{' '}
            <ExternalLink
              href="https://github.com/juliadebonaj/guilt-free-meals/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              new issue
            </ExternalLink>
            {' '}or start a conversation in the{' '}
            <ExternalLink
              href="https://github.com/juliadebonaj/guilt-free-meals/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discussions tab
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
