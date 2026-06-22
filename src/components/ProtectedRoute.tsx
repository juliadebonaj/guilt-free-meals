import { Navigate, Outlet } from 'react-router-dom';
import { useLocalStorage } from '../useLocalStorage';

interface Sessao {
  logado: boolean;
  email: string;
}

export default function ProtectedRoute() {
  const [sessao] = useLocalStorage<Sessao | null>('guilt-free-session', null);
  if (!sessao?.logado) return <Navigate to="/login" replace />;
  return <Outlet />;
}
