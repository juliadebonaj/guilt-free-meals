// Página inicial — hero com tipografia serifada de destaque + vitrine de receitas.
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import CardReceita from '../components/CardReceita';
import { RECEITAS_DESTAQUE } from '../mocks';

export default function Home() {
  return (
    <>
      <Hero>
        <Subtitulo>Receitas sem culpa</Subtitulo>
        <Titulo>Comer bem é<br/><em>um ato simples.</em></Titulo>
        <Descricao>
          Um catálogo curado de pratos saudáveis e elegantes para o seu dia a dia.
        </Descricao>
        <CTA to="/busca">Explorar receitas</CTA>
      </Hero>

      <Vitrine>
        <VitrineCabecalho>
          <VitrineRotulo>Em destaque</VitrineRotulo>
          <VitrineTitulo>Inspirações <em>para hoje</em></VitrineTitulo>
        </VitrineCabecalho>

        <Grid>
          {RECEITAS_DESTAQUE.map((r) => (
            <CardReceita key={r.id} receita={r} />
          ))}
        </Grid>
      </Vitrine>
    </>
  );
}

const Hero = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos['3xl']} ${({ theme }) => theme.espacos.lg};
  text-align: center;
`;

const Subtitulo = styled.span`
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
  margin-bottom: ${({ theme }) => theme.espacos.lg};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['4xl']};
  }
`;

const Descricao = styled.p`
  font-size: ${({ theme }) => theme.tamanhosFonte.lg};
  color: ${({ theme }) => theme.cores.texto.secundario};
  margin-bottom: ${({ theme }) => theme.espacos.xl};
`;

const CTA = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.xl};
  border-radius: ${({ theme }) => theme.bordas.pill};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.cores.texto.secundario};
  }
`;

const Vitrine = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos.xl} ${({ theme }) => theme.espacos.lg}
    ${({ theme }) => theme.espacos['3xl']};
`;

const VitrineCabecalho = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};
`;

const VitrineRotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.sm};
`;

const VitrineTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  color: ${({ theme }) => theme.cores.texto.primario};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.espacos.lg};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;
