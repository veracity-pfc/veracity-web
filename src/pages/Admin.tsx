import { useEffect, useMemo, useState } from 'react';
import { useLogto } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ModalBase from '../components/ui/ModalBase';

import '../styles/base.css';

import accessDeniedImg from '../assets/access-denied.png';
import accessDeniedAdminImg from '../assets/access-denied-admin.png';

type ClaimsLike = { roleNames?: string[]; roles?: string[] };

export default function Admin() {
  const { isAuthenticated, signIn, getIdTokenClaims } = useLogto();

  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDenied, setShowLoginDenied] = useState(false);
  const [showAdminDenied, setShowAdminDenied] = useState(false);

  const redirectUri = useMemo(() => `${window.location.origin}/`, []);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        setChecked(true);
        setShowLoginDenied(true);
        return;
      }
      try {
        const claims = (await getIdTokenClaims()) as unknown as ClaimsLike;
        const roles = claims?.roleNames ?? claims?.roles ?? [];
        const _isAdmin = Array.isArray(roles) && roles.includes('admin');
        setIsAdmin(_isAdmin);
        setChecked(true);
        if (!_isAdmin) setShowAdminDenied(true);
      } catch {
        setChecked(true);
        setShowAdminDenied(true);
      }
    })();
  }, [isAuthenticated, getIdTokenClaims]);

  useEffect(() => {
    const open = showLoginDenied || showAdminDenied;
    if (!open) return;
    const body = document.body;
    const docEl = document.documentElement;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - docEl.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [showLoginDenied, showAdminDenied]);

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

      {showLoginDenied && (
        <ModalBase onClose={() => setShowLoginDenied(false)}>
          <img src={accessDeniedImg} alt="" style={{ width: 'min(64vw, 260px)' }} />
          <h3 className="v-modal__title">Acesso negado</h3>
          <p className="v-modal__text">Para acessar essa página é necessário realizar login na plataforma</p>
          <button
            className="v-btn"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'min(60vw,220px)' }}
            onClick={() => {
              setShowLoginDenied(false);
              signIn(redirectUri);
            }}
          >
            Login
          </button>
        </ModalBase>
      )}

      {showAdminDenied && (
        <ModalBase onClose={() => setShowAdminDenied(false)}>
          <img src={accessDeniedAdminImg} alt="" style={{ width: 'min(64vw, 260px)' }} />
          <h3 className="v-modal__title">Acesso negado</h3>
          <p className="v-modal__text">Somente administradores podem ter acesso a essa página</p>
        </ModalBase>
      )}
    </div>
  );
}
