import { useEffect, useState } from 'react';
import { useLogto, useHandleSignInCallback } from '@logto/react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ModalBase from '../components/ui/ModalBase';

import '../styles/base.css';
import '../styles/home.css';

import accessDeniedImg from '../assets/access-denied.png';

const ACCESS_DENIED_FLAG = 'v_access_denied_once';

export default function Home() {
  const { isAuthenticated, signIn } = useLogto();

  const [active, setActive] = useState<'link' | 'image'>('link');
  const [url, setUrl] = useState('');
  const [showDenied, setShowDenied] = useState(false);

  useHandleSignInCallback(() => {
    window.history.replaceState({}, '', `${window.location.origin}/`);
  });

  const redirectUri = `${window.location.origin}/`;

  useEffect(() => {
    const flag = sessionStorage.getItem(ACCESS_DENIED_FLAG);
    if (flag === '1') {
      sessionStorage.removeItem(ACCESS_DENIED_FLAG);
      setShowDenied(true);
    }
  }, []);

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

  const onPerfilClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowDenied(true);
    }
  };

  return (
    <div className="v-bg">
      <Header
        current="home"
        onPerfilClick={onPerfilClick}
        onRequireLogin={() => setShowDenied(true)} 
      />

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

      <Footer />

      {showDenied && (
        <ModalBase onClose={() => setShowDenied(false)}>
          <img
            src={accessDeniedImg}
            alt="Acesso negado"
            style={{ width: 'min(64vw, 260px)', height: 'auto', display: 'block', userSelect: 'none' }}
            draggable={false}
          />
          <h3 className="v-modal__title">Acesso negado</h3>
          <p className="v-modal__text">Para acessar essa página é necessário realizar login na plataforma</p>
          <button
            className="v-btn v-btn--primary"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'min(60vw,220px)' }}
            onClick={() => {
              setShowDenied(false);
              signIn(redirectUri);
            }}
          >
            Login
          </button>
        </ModalBase>
      )}
    </div>
  );
}
