// Página "About" — placeholder para ser preenchido pelo time de conteúdo.

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
            [Placeholder — share the origin of GuiltFreeMeal here: who started it, when, and why.
            What inspired the project? What problem does it solve for people who want to eat well
            without obsessing over restrictions?]
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Our Mission</SecaoTitulo>
          <Paragrafo>
            [Placeholder — describe the mission in one or two sentences. Example: "We believe
            healthy eating should feel effortless and enjoyable, not like a punishment."]
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>What We Believe</SecaoTitulo>
          <Lista>
            <li>[Placeholder — belief or value #1]</li>
            <li>[Placeholder — belief or value #2]</li>
            <li>[Placeholder — belief or value #3]</li>
          </Lista>
        </Secao>

        <Secao>
          <SecaoTitulo>The Team</SecaoTitulo>
          <Paragrafo>
            [Placeholder — introduce the people behind GuiltFreeMeal. Names, roles, a short bio
            for each member.]
          </Paragrafo>
        </Secao>

        <Secao>
          <SecaoTitulo>Contact</SecaoTitulo>
          <Paragrafo>
            [Placeholder — add contact information or a link to a contact form here.]
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
