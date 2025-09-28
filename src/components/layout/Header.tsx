import { useMemo } from 'react';
import { useLogto } from '@logto/react';
import wordmark from '../../assets/veracity-wordmark.png';

type HeaderProps = {
  current?: 'home' | 'perfil' | 'admin';
  onPerfilClick?: React.MouseEventHandler<HTMLAnchorElement>;
  onRequireLogin?: () => void;
  disableAdminLink?: boolean;
};

export default function Header({ current, onPerfilClick, onRequireLogin, disableAdminLink }: HeaderProps) {
  const { isAuthenticated, signIn, signOut } = useLogto();
  const redirectUri = useMemo(() => `${window.location.origin}/`, []);
  const postLogoutRedirectUri = redirectUri;

  const perfilProps =
    onPerfilClick && !isAuthenticated
      ? { onClick: onPerfilClick }
      : { href: '/perfil' };

  const handleAdminClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      onRequireLogin?.();
    }
  };

  return (
    <header className="v-nav">
      <div className="v-brand">
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src={wordmark} alt="Veracity" className="v-brand__word" />
        </a>
      </div>

      <nav className="v-nav__menu">
        {current === 'perfil' ? (
          <a
            href="/perfil"
            onClick={(e) => e.preventDefault()}
            aria-disabled
            style={{ opacity: 0.5, pointerEvents: 'none' }}
            title="Você já está no Perfil"
          >
            Perfil
          </a>
        ) : (
          <a {...perfilProps}>Perfil</a>
        )}

        {disableAdminLink || current === 'admin' ? (
          <a
            href="/admin"
            onClick={(e) => e.preventDefault()}
            aria-disabled
            style={{ opacity: 0.5, pointerEvents: 'none' }}
            title={current === 'admin' ? 'Você já está em Administração' : 'Link desabilitado nesta página'}
          >
            Administração
          </a>
        ) : (
          <a href="/admin" onClick={handleAdminClick}>Administração</a>
        )}

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
          className="v-btn v-btn--primary"
          style={{ marginLeft: 'auto' }}     
          onClick={() => signIn(redirectUri)}
        >
          Login
        </button>
      ) : (
        <button
          className="v-btn v-btn--primary"
          style={{ marginLeft: 'auto' }}    
          onClick={() => signOut(postLogoutRedirectUri)}
        >
          Sair
        </button>
      )}
    </header>
  );
}
