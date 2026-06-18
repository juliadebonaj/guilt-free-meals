import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h1>404</h1>
      <p>Receita não encontrada.</p>
      <Link to="/">Voltar ao início</Link>
    </div>
  );
}
