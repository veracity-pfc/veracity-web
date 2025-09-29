import { useEffect, useMemo, useState } from 'react';
import { useLogto } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import '../styles/base.css';

type ClaimsLike = { roleNames?: string[]; roles?: string[] };

const ACCESS_DENIED_FLAG = 'v_access_denied_once';
const ADMIN_DENIED_FLAG = 'v_admin_denied_once';

export default function Admin() {
  const { isAuthenticated, getIdTokenClaims } = useLogto();

  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const redirectUri = useMemo(() => `${window.location.origin}/`, []);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        sessionStorage.setItem(ACCESS_DENIED_FLAG, '1');
        window.location.replace(redirectUri);
        return;
      }

      try {
        const claims = (await getIdTokenClaims()) as unknown as ClaimsLike;
        const roles = claims?.roleNames ?? claims?.roles ?? [];
        const _isAdmin = Array.isArray(roles) && roles.includes('admin');

        if (!_isAdmin) {
          sessionStorage.setItem(ADMIN_DENIED_FLAG, '1');
          window.location.replace(redirectUri);
          return;
        }

        setIsAdmin(true);
        setChecked(true);
      } catch {
        sessionStorage.setItem(ADMIN_DENIED_FLAG, '1');
        window.location.replace(redirectUri);
      }
    })();
  }, [isAuthenticated, getIdTokenClaims, redirectUri]);

  return (
    <div className="v-bg">
      <Header current="admin" disableAdminLink />
      {checked && isAdmin && (
        <div style={{ maxWidth: 980, margin: '28px auto 0', padding: '0 16px', color: '#fff' }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Administração</h1>
          <p style={{ opacity: 0.85, marginBottom: 24 }}>
            Bem-vinda(o) à área administrativa.
          </p>
          <div
            style={{
              background: '#1f1f1f',
              borderRadius: 14,
              padding: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,.25)',
              minHeight: 160,
            }}
          >
            Tela em construção...
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
