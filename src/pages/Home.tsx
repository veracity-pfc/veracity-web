import { useEffect, useState } from 'react';
import { useLogto, useHandleSignInCallback } from '@logto/react';
import './home.css';

import wordmark from '../assets/veracity-wordmark.png';
import eye from '../assets/veracity-eye.png';
import accessDeniedImg from '../assets/access-denied.png'; 

export default function Home() {
  const { isAuthenticated, signIn, signOut } = useLogto();

  const [active, setActive] = useState<'link' | 'image'>('link');
  const [url, setUrl] = useState('');
  const [showDenied, setShowDenied] = useState(false); 

  useHandleSignInCallback(() => {
    window.history.replaceState({}, '', `${window.location.origin}/`);
  });

  const redirectUri = `${window.location.origin}/`;
  const postLogoutRedirectUri = `${window.location.origin}/`;

  const onPerfilClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowDenied(true);
    }
  };

  useEffect(() => {
    if (!showDenied) return;
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
  }, [showDenied]);

  return (
    <div className="v-bg">
      <header className="v-nav">
        <div className="v-brand">
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src={wordmark} alt="Veracity" className="v-brand__word" />
          </a>
        </div>

        <nav className="v-nav__menu">
          <a href="/perfil" onClick={onPerfilClick}>Perfil</a>
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

        {!isAuthenticated ? (
          <button
            className="v-btn v-btn--login"
            onClick={() => signIn(redirectUri)}
          >
            Login
          </button>
        ) : (
          <button
            className="v-btn v-btn--login"
            onClick={() => signOut(postLogoutRedirectUri)}
          >
            Sair
          </button>
        )}
      </header>

      <section className="v-hero">
        <h1 className="v-hero__title">
          Detectando manipulações
          <br />
          com inteligência
        </h1>
        <p className="v-hero__sub">Verifique a autenticidade de conteúdos digitais</p>

        <div className="v-switch">
          <button
            className={`v-chip ${active === 'link' ? 'is-active' : ''}`}
            onClick={() => setActive('link')}
          >
            Análise de links
          </button>

          <button
            className={`v-chip ${active === 'image' ? 'is-active' : ''}`}
            onClick={() => setActive('image')}
          >
            Análise de imagens
          </button>
        </div>

        <div className="v-input-row">
          <div className="v-input-wrap">
            <input
              type="text"
              placeholder="Adicione o link que deseja verificar"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={active === 'image'}
            />
            <button className="v-inline-btn" disabled={active === 'image'}>
              Verificar
            </button>
          </div>
        </div>

        <p className="v-terms">
          Ao utilizar o Veracity eu concordo com os <a href="#termos">Termos de Uso</a> e com a{' '}
          <a href="#privacidade">Política de Privacidade</a> da plataforma
        </p>
      </section>

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

      {showDenied && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDenied(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 50,
            overflowY: 'auto',
            padding: 'clamp(16px, 6vw, 32px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'clamp(280px, 86vw, 520px)',
              background: '#1f1f1f',
              borderRadius: 22,
              padding: 'clamp(24px, 4vh, 36px) clamp(18px, 5vw, 32px)',
              color: '#fff',
              boxShadow: '0 16px 44px rgba(0,0,0,.38)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(8px, 2vh, 16px)',
              boxSizing: 'border-box',
              maxHeight: 'calc(100dvh - 2*clamp(16px, 6vw, 32px))',
              overflowY: 'auto',
            }}
          >
            <button
              aria-label="Fechar"
              onClick={() => setShowDenied(false)}
              style={{
                background: 'transparent',
                border: 0,
                color: '#bbb',
                fontSize: 'clamp(16px, 2.8vw, 20px)',
                position: 'absolute',
                right: 'clamp(8px, 2vw, 16px)',
                top: 'clamp(6px, 1.5vh, 12px)',
                cursor: 'pointer',
                lineHeight: 1,
                padding: 8,
              }}
            >
              ×
            </button>

            <img
              src={accessDeniedImg}
              alt="Acesso negado"
              style={{
                width: 'min(64vw, 260px)',
                height: 'auto',
                display: 'block',
                userSelect: 'none',
              }}
              draggable={false}
            />

            <h3
              style={{
                fontSize: 'clamp(22px, 5vw, 30px)',
                fontWeight: 800,
                margin: 0,
                textAlign: 'center',
              }}
            >
              Acesso negado
            </h3>

            <p
              style={{
                lineHeight: 1.6,
                fontSize: 'clamp(14px, 2.8vw, 18px)',
                color: '#eaeaea',
                textAlign: 'center',
                margin: 0,
                maxWidth: 520,
              }}
            >
              Para acessar essa página é necessário realizar login na plataforma
            </p>

            <button
              className="v-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(10px, 2.2vh, 14px) clamp(18px, 4vw, 24px)',
                borderRadius: 12,
                border: 0,
                cursor: 'pointer',
                background: '#235D4B',
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(16px, 3.6vw, 18px)',
                lineHeight: 1.2,
                width: 'min(60vw, 220px)',
                marginTop: 'clamp(10px, 2vh, 18px)',
              }}
              onClick={() => {
                setShowDenied(false);
                signIn(redirectUri);
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
