import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h1>404</h1>
      <p>Recipe not found.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
