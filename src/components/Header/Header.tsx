import React, { JSX, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import styles from './Header.module.css';
import { apiLogout, clearToken, getRole, getToken } from '../../api/client';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

export default function Header(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSobreOpen, setMobileSobreOpen] = useState(false);

  const [isAuthed, setIsAuthed] = useState<boolean>(!!getToken());
  const [role, setRole] = useState<string | null>(getRole());

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'veracity_token' || e.key === 'veracity_role') {
        setIsAuthed(!!getToken());
        setRole(getRole());
      }
    };
    const onAuthChanged = () => {
      setIsAuthed(!!getToken());
      setRole(getRole());
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('veracity-auth-changed', onAuthChanged as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('veracity-auth-changed', onAuthChanged as EventListener);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current || !btnRef.current) return;
      const target = e.target as Node;
      if (menuRef.current.contains(target) || btnRef.current.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setMobileOpen(false); }
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try { await apiLogout(); } catch {}
    clearToken();
    setIsAuthed(false);
    setRole(null);
    navigate('/login', { replace: true });
  };

  const isAdmin = role === 'admin';

  return (
    <header className={styles['site-header']}>
      <div className={cx('container', styles['navbar'])}>
        <div
          className={styles['logo-link']}
          role="link"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
          aria-label="Ir para a página inicial"
        >
          <Logo />
        </div>

        <nav className={styles['nav-links']} aria-label="Principal">
          <NavLink to="/user/profile" className={styles['nav-link']}>Perfil</NavLink>

          {isAdmin && (
            <NavLink to="/administration" className={styles['nav-link']}>Administração</NavLink>
          )}

          <NavLink to="/user/history" className={styles['nav-link']}>Histórico de análises</NavLink>
          <NavLink to="/instructions" className={styles['nav-link']}>Instruções</NavLink>
          <NavLink to="/contact-us" className={styles['nav-link']} end>Contato</NavLink>

          <div className={styles['about-group']}>
            <NavLink to="/about" className={styles['nav-link']} end>Sobre</NavLink>
            <button
              ref={btnRef}
              type="button"
              className={`${styles['about-toggle']} ${open ? styles['open'] : ''}`}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="about-menu"
              onClick={() => setOpen(v => !v)}
              title="Abrir menu Sobre"
            />
            {open && (
              <div id="about-menu" ref={menuRef} role="menu" className={styles['about-menu']}>
                <NavLink role="menuitem" tabIndex={0} to="/about" className={styles['about-item']}>Conheça nossa história</NavLink>
                <a role="menuitem" tabIndex={0} href="/privacy-policy" className={styles['about-item']} onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de privacidade</a>
                <a role="menuitem" tabIndex={0} href="/terms-of-use" className={styles['about-item']} onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de uso</a>
              </div>
            )}
          </div>

          {!isAuthed ? (
            <NavLink to="/login" className={`${styles['nav-link']} ${styles['login-cta']}`}>Login</NavLink>
          ) : (
            <a href="/logout" className={`${styles['nav-link']} ${styles['login-cta']}`} onClick={handleLogout}>Sair</a>
          )}
        </nav>

        <button
          className={styles['mobile-toggle']}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`${styles['mobile-menu']} ${mobileOpen ? styles['open'] : ''}`} role="dialog" aria-modal="true">
        <div className={styles['container']}>
          <div className={styles['mobile-group']}>
            <NavLink className={styles['mobile-link']} to="/user/profile" onClick={() => setMobileOpen(false)}>Perfil</NavLink>
            {isAdmin && <NavLink className={styles['mobile-link']} to="/administration" onClick={() => setMobileOpen(false)}>Administração</NavLink>}
            <NavLink className={styles['mobile-link']} to="/user/history" onClick={() => setMobileOpen(false)}>Histórico de análises</NavLink>
            <NavLink className={styles['mobile-link']} to="/instructions" onClick={() => setMobileOpen(false)}>Instruções</NavLink>
            <NavLink className={styles['mobile-link']} to="/contact-us" onClick={() => setMobileOpen(false)} end>Contato</NavLink>

            <a
              className={styles['mobile-link']}
              href="#"
              onClick={(e) => { e.preventDefault(); setMobileSobreOpen(v => !v); }}
            >
              Sobre ▾
            </a>
            {mobileSobreOpen && (
              <>
                <NavLink className={styles['mobile-subitem']} to="/about" onClick={() => setMobileOpen(false)}>Conheça nossa história</NavLink>
                <a className={styles['mobile-subitem']} href="/privacy-policy" onClick={() => setMobileOpen(false)}>Política de privacidade</a>
                <a className={styles['mobile-subitem']} href="/terms-of-use" onClick={() => setMobileOpen(false)}>Termos de uso</a>
              </>
            )}

            {!isAuthed ? (
              <NavLink className={styles['mobile-login']} to="/login" onClick={() => setMobileOpen(false)}>Login</NavLink>
            ) : (
              <a className={styles['mobile-login']} href="/logout" onClick={(e) => { e.preventDefault(); setMobileOpen(false); handleLogout(e); }}>Sair</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
