// TODO (Aula 3-4): consumir useParams + buscarReceitaPorId.
// Estrutura sugerida: hero com imagem, ingredientes em coluna, passos em coluna mais larga.
import { useParams } from 'react-router-dom';

export default function RecipeDetails() {
  const { id } = useParams();
  return <div style={{ padding: 32 }}>Detalhes da receita {id} — TODO</div>;
}
