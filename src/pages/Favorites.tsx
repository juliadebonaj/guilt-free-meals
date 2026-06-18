// TODO: ler state.favoritas do contexto, renderizar grid de CardReceita.
import { useReceitas } from '../ReceitasContext';
import CardReceita from '../components/CardReceita';
import styled from '@emotion/styled';

export default function Favorites() {
  const { state } = useReceitas();

  if (state.favoritas.length === 0) {
    return <Vazio>Você ainda não salvou nenhuma receita.</Vazio>;
  }

  return (
    <Grid>
      {state.favoritas.map((r) => (
        <CardReceita key={r.id} receita={r} />
      ))}
    </Grid>
  );
}

const Grid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.espacos.lg};
  padding: ${({ theme }) => theme.espacos.xl};
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const Vazio = styled.p`
  text-align: center;
  padding: ${({ theme }) => theme.espacos['3xl']};
  color: ${({ theme }) => theme.cores.texto.muted};
  font-style: italic;
`;
