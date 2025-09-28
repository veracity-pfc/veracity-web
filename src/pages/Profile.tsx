import { useEffect, useState } from 'react';
import { useLogto } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import '../styles/base.css';
import '../styles/profile.css';

type Claims = Record<string, unknown> & {
  name?: string;
  email?: string;
  sub?: string;
};

const ACCESS_DENIED_FLAG = 'v_access_denied_once';

export default function Profile() {
  const { isAuthenticated, getIdTokenClaims } = useLogto() as any;
  const [claims, setClaims] = useState<Claims | null>(null);

  useEffect(() => {
    let t: number | undefined;
    if (isAuthenticated === false) {
      t = window.setTimeout(() => {
        sessionStorage.setItem(ACCESS_DENIED_FLAG, '1');
        window.location.replace(`${window.location.origin}/`);
      }, 50);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isAuthenticated]);

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

      <div className="profile-page">
        <h1 className="profile-title">Meu perfil</h1>
        <p className="profile-sub">Informações básicas da sua sessão</p>

        <div className="profile-card">
          <div>
            <strong>Nome:</strong> {claims?.name ?? '—'}
          </div>
          <div>
            <strong>E-mail:</strong> {claims?.email ?? '—'}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
