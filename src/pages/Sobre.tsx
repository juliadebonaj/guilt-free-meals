import styled from '@emotion/styled';

export default function Sobre() {
  return (
    <Pagina>
      <Cabecalho>
        <Rotulo>About</Rotulo>
        <Titulo>
          More than recipes,<br /><em>a way of eating.</em>
        </Titulo>
      </Cabecalho>

      <Conteudo>
        <Secao>
          <SecaoTitulo>Our Story</SecaoTitulo>
          <Paragrafo>
            GuiltFreeMeal was built during the React module of Start Coding — a program by SAP and Ada Tech.
            Four students set out to build something useful: a place to find recipes that are
            good for you without making food feel like a chore.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Our Mission</SecaoTitulo>
          <Paragrafo>
            Make healthy eating approachable. No guilt, no obsession — just good food.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>What We Believe</SecaoTitulo>
          <Lista>
            <li>Food should nourish, not stress you out.</li>
            <li>Eating well doesn't require perfection.</li>
            <li>Simple recipes are often the best ones.</li>
          </Lista>
        </Secao>

        <Secao>
          <SecaoTitulo>The Team</SecaoTitulo>
          <Paragrafo>
            Built by Bruno Inácio, Jéssica Gaspar, Júlia de Bona, and Victória Branco —
            student interns from the Start Coding program.
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Contact</SecaoTitulo>
          <Paragrafo>
            Have a suggestion or found a bug? Reach us on our{' '}
            <ExternalLink
              href="https://github.com/juliadebonaj/guilt-free-meals"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
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
  line-height: 1.2;

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['4xl']};
  }
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.sm};

  li {
    font-size: ${({ theme }) => theme.tamanhosFonte.md};
    color: ${({ theme }) => theme.cores.texto.secundario};
    padding-left: ${({ theme }) => theme.espacos.lg};
    position: relative;

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.cores.sage[900]};
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
