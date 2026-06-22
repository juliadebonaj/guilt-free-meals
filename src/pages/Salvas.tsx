import { useReceitas } from '../ReceitasContext';
import CardReceita from '../components/CardReceita';
import styled from '@emotion/styled';

export default function Salvas() {
  const { state } = useReceitas();

  if (state.salvas.length === 0) {
    return <Vazio>You haven't saved any recipes for later yet.</Vazio>;
  }

  return (
    <Wrapper>
      <Cabecalho>
        <Rotulo>Saved</Rotulo>
        <Titulo><em>for</em> later</Titulo>
      </Cabecalho>

      <Grid>
        {state.salvas.map((r) => (
          <CardReceita key={r.id} receita={r} />
        ))}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos.xl} ${({ theme }) => theme.espacos.lg};
`;

const Cabecalho = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};
`;

const Rotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.sm};
`;

const Titulo = styled.h1`
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const Vazio = styled.p`
  text-align: center;
  padding: ${({ theme }) => theme.espacos['3xl']};
  color: ${({ theme }) => theme.cores.texto.muted};
  font-style: italic;
`;
