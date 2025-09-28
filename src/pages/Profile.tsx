import { useEffect, useState } from 'react';
import { useLogto } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import '../styles/base.css';

type Claims = Record<string, unknown> & {
  name?: string;
  email?: string;
  sub?: string;
};

export default function Profile() {
  const { isAuthenticated, getIdTokenClaims } = useLogto() as any;
  const [claims, setClaims] = useState<Claims | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (isAuthenticated && getIdTokenClaims) {
          const c = await getIdTokenClaims();
          if (mounted) setClaims(c as Claims);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [isAuthenticated, getIdTokenClaims]);

  if (!isAuthenticated) return null;

  return (
    <div className="v-bg">
      <Header current="perfil" />

      <div style={{ maxWidth: 860, margin: '28px auto 0', padding: '0 16px', color: '#fff' }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Meu perfil</h1>
        <p style={{ opacity: 0.85, marginBottom: 24 }}>Informações básicas da sua sessão</p>

        <div
          style={{
            background: '#1f1f1f',
            borderRadius: 14,
            padding: 20,
            lineHeight: 1.7,
            boxShadow: '0 10px 30px rgba(0,0,0,.25)',
          }}
        >
          <div><strong>Nome:</strong> {claims?.name ?? '—'}</div>
          <div><strong>E-mail:</strong> {claims?.email ?? '—'}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
