import { useEffect, useMemo, useState } from 'react';
import { useLogto } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import '../styles/base.css';
import '../styles/admin.css';

type ClaimsLike = Record<string, unknown>;

const ACCESS_DENIED_FLAG = 'v_access_denied_once';
const ADMIN_DENIED_FLAG = 'v_admin_denied_once';

const ALLOWED_ACCOUNT_NAME = 'admin';
const ALLOWED_EMAILS = ['admin@veracity.com.br'];

function normalize(str: unknown): string {
  return typeof str === 'string' ? str.trim().toLowerCase() : '';
}

async function resolveAccountNameAndEmail(
  getIdTokenClaims: () => Promise<unknown>,
  fetchUserInfo?: () => Promise<unknown>
): Promise<{ name: string | null; email: string | null }> {
  try {
    const claims = (await getIdTokenClaims()) as ClaimsLike;

    const nameClaim =
      (claims['name'] as string) ??
      (claims['preferred_username'] as string) ??
      (claims['username'] as string);

    const emailClaim =
      (claims['email'] as string) ??
      (claims['primaryEmail'] as string);

    if (nameClaim || emailClaim) {
      return { name: nameClaim ?? null, email: emailClaim ?? null };
    }

    if (fetchUserInfo) {
      const ui = (await fetchUserInfo()) as ClaimsLike;
      const nameUi =
        (ui['name'] as string) ??
        (ui['preferred_username'] as string) ??
        (ui['username'] as string) ??
        ((ui['profile'] as any)?.nickname as string) ??
        ((ui['profile'] as any)?.givenName as string);

      const emailUi =
        (ui['email'] as string) ??
        (ui['primaryEmail'] as string);

      return { name: nameUi ?? null, email: emailUi ?? null };
    }
  } catch {
  }
  return { name: null, email: null };
}

export default function Admin() {
  const { isAuthenticated, isLoading, getIdTokenClaims, fetchUserInfo } = useLogto();

  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const redirectUri = useMemo(() => `${window.location.origin}/`, []);

  useEffect(() => {
    if (isLoading) return;

    (async () => {
      if (!isAuthenticated) {
        sessionStorage.setItem(ACCESS_DENIED_FLAG, '1');
        window.location.replace(redirectUri);
        return;
      }

      const { name, email } = await resolveAccountNameAndEmail(getIdTokenClaims, fetchUserInfo);
      const isNameAllowed = normalize(name) === normalize(ALLOWED_ACCOUNT_NAME);
      const isEmailAllowed = ALLOWED_EMAILS.map(normalize).includes(normalize(email));

      if (!isNameAllowed && !isEmailAllowed) {
        sessionStorage.setItem(ADMIN_DENIED_FLAG, '1');
        window.location.replace(redirectUri);
        return;
      }

      setAllowed(true);
      setChecked(true);
    })();
  }, [isLoading, isAuthenticated, getIdTokenClaims, fetchUserInfo, redirectUri]);

  return (
    <div className="v-bg">
      <Header current="admin" disableAdminLink />

      {checked && allowed && (
        <section className="admin-page">
          <h1 className="admin-title">Painel administrativo</h1>
          <p className="admin-sub">Tela em construção...</p>
        </section>
      )}

      <Footer />
    </div>
  );
}
