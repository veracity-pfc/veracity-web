import { useEffect, useState } from 'react';
import { useLogto } from '@logto/react';
import './home.css';

import wordmark from '../assets/veracity-wordmark.png';
import eye from '../assets/veracity-eye.png';

type Claims = Record<string, unknown> & {
  name?: string;
  email?: string;
  sub?: string;
};

export default function Profile() {
  const { isAuthenticated, signOut, getIdTokenClaims } = useLogto() as any;
  const [claims, setClaims] = useState<Claims | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (isAuthenticated && getIdTokenClaims) {
          const c = await getIdTokenClaims();
          if (mounted) setClaims(c as Claims);
        }
      } catch {
      }
    })();
    return () => { mounted = false; };
  }, [isAuthenticated, getIdTokenClaims]);

  if (!isAuthenticated) return null;

  const postLogoutRedirectUri = `${window.location.origin}/`;
  const logtoEndpoint = (import.meta.env.VITE_LOGTO_ENDPOINT as string).replace(/\/+$/, '');

  return (
    <div className="v-bg">
      <header className="v-nav">
        <div className="v-brand">
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src={wordmark} alt="Veracity" className="v-brand__word" />
          </a>
        </div>

        <nav className="v-nav__menu">
          <a
            href="/perfil"
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
            style={{ opacity: .5, pointerEvents: 'none' }}
            title="Você já está no Perfil"
          >
            Perfil
          </a>
          <a href="#admin">Administração</a>
          <a href="#historico">Histórico de análises</a>
          <a href="#instrucoes">Instruções</a>
          <a href="#contato">Contato</a>

          <div className="v-dropdown">
            <button className="v-dropdown__btn" type="button">
              Sobre <span aria-hidden="true">▾</span>
            </button>
            <div className="v-dropdown__menu" role="menu">
              <a href="#sobre-plataforma" role="menuitem">Sobre a plataforma</a>
              <a href="#politica-privacidade" role="menuitem">Política de privacidade</a>
              <a href="#termos-uso" role="menuitem">Termos de uso</a>
            </div>
          </div>
        </nav>

        <button
          className="v-btn v-btn--login"
          onClick={() => signOut(postLogoutRedirectUri)}
        >
          Sair
        </button>
      </header>

      <div style={{ maxWidth: 860, margin: '28px auto 0', padding: '0 16px', color: '#fff' }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Meu perfil</h1>
        <p style={{ opacity: 0.85, marginBottom: 24 }}>
          Informações básicas da sua sessão
        </p>

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

      <footer className="v-footer">
        <div className="v-footer__grid">
          <div className="v-foot-col">
            <div className="v-foot-logo">
              <img src={eye} alt="Veracity" className="v-brand__logo" />
              <img src={wordmark} alt="Veracity" className="v-brand__word" />
            </div>
            <a href="#politica-privacidade">Política de privacidade</a>
            <a href="#termos-uso">Termos de uso</a>
          </div>

          <div className="v-foot-col">
            <h4>Serviços</h4>
            <a href="#s-analise-links">Análise de links</a>
            <a href="#s-analise-imagens">Análise de imagens</a>
            <a href="#s-historico">Histórico de análises</a>
          </div>

          <div className="v-foot-col">
            <h4>Informação</h4>
            <a href="#historia">Conheça nossa história</a>
            <a href="#contato">Entre em contato conosco</a>
            <a href="#como-usar">Como utilizar a plataforma</a>
          </div>
        </div>
      </footer>

      <div className="v-copyright">Veracity — 2025 © Todos os direitos reservados.</div>
    </div>
  );
}
