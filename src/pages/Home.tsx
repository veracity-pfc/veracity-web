import { useState } from 'react';
import { useLogto } from '@logto/react';
import './home.css';

import wordmark from '../assets/veracity-wordmark.png';
import eye from '../assets/veracity-eye.png';

export default function Home() {
  const { isAuthenticated, signIn, signOut } = useLogto();
  const [active, setActive] = useState<'link' | 'image'>('link');
  const [url, setUrl] = useState('');

  return (
    <div className="v-bg">
      <header className="v-nav">
        <div className="v-brand">
          <img src={wordmark} alt="Veracity" className="v-brand__word" />
        </div>

        <nav className="v-nav__menu">
          <a href="#perfil">Perfil</a>
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
          <button className="v-btn v-btn--login" onClick={() => signIn(window.location.origin)}>
            Login
          </button>
        ) : (
          <button className="v-btn v-btn--login" onClick={() => signOut(window.location.origin)}>
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
    </div>
  );
}
