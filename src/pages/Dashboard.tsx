import { useEffect, useState } from 'react';
import { useLogto } from '@logto/react';
import { api } from '../services/api';

type User = {
  id: string;
  logto_user_id: string;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ATIVO' | 'INATIVO';
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { getAccessToken } = useLogto();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        const { data } = await api.get<User>('/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessToken]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      {user ? (
        <ul>
          <li><b>Nome:</b> {user.full_name}</li>
          <li><b>E-mail:</b> {user.email}</li>
          <li><b>Role:</b> {user.role}</li>
          <li><b>Status:</b> {user.status}</li>
        </ul>
      ) : (
        <p>Carregando…</p>
      )}
    </div>
  );
}
