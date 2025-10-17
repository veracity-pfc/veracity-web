import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo.jsx';
import { apiLogout, clearToken, getRole, getToken } from '../api/client';

const ITEMS = [
  { key: 'perfil', label: 'Perfil', href: '/user/profile' },
  { key: 'admin', label: 'Administração', href: '/administration' },
  { key: 'historico', label: 'Histórico de análises', href: '/user/history' },
  { key: 'instrucoes', label: 'Instruções', href: '/instructions' },
  { key: 'contato', label: 'Contato', href: '/contact-us' },
  { key: 'sobre', label: 'Sobre', href: '/about' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSobreOpen, setMobileSobreOpen] = useState(false);

  const [isAuthed, setIsAuthed] = useState(!!getToken());
  const [role, setRole] = useState(getRole());

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const path = window.location.pathname || '';
    if (path.startsWith('/about')) setActiveKey('sobre');
    else if (path.startsWith('/instructions')) setActiveKey('instrucoes');
    else if (path.startsWith('/contact-us')) setActiveKey('contato');
    else if (path.startsWith('/user/profile')) setActiveKey('perfil');
    else if (path.startsWith('/user/history')) setActiveKey('historico');
    else if (path.startsWith('/administration')) setActiveKey('admin');

    const onStorage = (e) => {
      if (e.key === 'veracity_token' || e.key === 'veracity_role') {
        setIsAuthed(!!getToken());
        setRole(getRole());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(e.target) || btnRef.current.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); setMobileOpen(false); }
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (_) {}
    clearToken();
    setIsAuthed(false);
    setRole(null);
    window.location.assign('/'); 
  };

  const isAdmin = role === 'admin';

  return (
    <header className="site-header">
      <div className="container navbar">
        <div
          className="logo-link"
          role="link"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onClick={(e) => { e.preventDefault(); window.location.assign('/'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.assign('/'); } }}
          aria-label="Ir para a página inicial"
        >
          <Logo />
        </div>

        <nav className="nav-links" aria-label="Principal">
          <a
            className={`nav-link ${activeKey === 'perfil' ? 'is-active' : ''}`}
            href="/user/profile"
            onClick={() => setActiveKey('perfil')}
          >
            Perfil
          </a>

          {isAdmin && (
            <a
              className={`nav-link ${activeKey === 'admin' ? 'is-active' : ''}`}
              href="/administration"
              onClick={() => setActiveKey('admin')}
            >
              Administração
            </a>
          )}

          <a
            className={`nav-link ${activeKey === 'historico' ? 'is-active' : ''}`}
            href="/user/history"
            onClick={() => setActiveKey('historico')}
          >
            Histórico de análises
          </a>

          <a
            className={`nav-link ${activeKey === 'instrucoes' ? 'is-active' : ''}`}
            href="/instructions"
            onClick={() => setActiveKey('instrucoes')}
          >
            Instruções
          </a>

          <a
            className={`nav-link ${activeKey === 'contato' ? 'is-active' : ''}`}
            href="/contact-us"
            onClick={() => setActiveKey('contato')}
          >
            Contato
          </a>

          <div className="about-group">
            <a
              href="/about"
              className={`nav-link ${activeKey === 'sobre' ? 'is-active' : ''}`}
              onClick={() => setActiveKey('sobre')}
            >
              Sobre
            </a>
            <button
              ref={btnRef}
              type="button"
              className={`about-toggle ${open ? 'open' : ''}`}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="about-menu"
              onClick={() => setOpen(v => !v)}
              title="Abrir menu Sobre"
            />
            {open && (
              <div id="about-menu" ref={menuRef} role="menu" className="about-menu">
                <a role="menuitem" tabIndex={0} href="/about" className="about-item">Conheça nossa história</a>
                <a role="menuitem" tabIndex={0} href="/privacy-policy" className="about-item" onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de privacidade</a>
                <a role="menuitem" tabIndex={0} href="/terms-of-use" className="about-item" onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de uso</a>
              </div>
            )}
          </div>

          {!isAuthed ? (
            <a href="/login" className="nav-link login-cta">Login</a>
          ) : (
            <button type="button" className="nav-link login-cta" onClick={handleLogout}>
              Sair
            </button>
          )}
        </nav>

        <button className="mobile-toggle" aria-label="Abrir menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="container">
          <div className="mobile-group">
            <a className={`mobile-link ${activeKey === 'perfil' ? 'is-active' : ''}`} href="/user/profile" onClick={() => setMobileOpen(false)}>Perfil</a>
            {isAdmin && <a className={`mobile-link ${activeKey === 'admin' ? 'is-active' : ''}`} href="/administration" onClick={() => setMobileOpen(false)}>Administração</a>}
            <a className={`mobile-link ${activeKey === 'historico' ? 'is-active' : ''}`} href="/user/history" onClick={() => setMobileOpen(false)}>Histórico de análises</a>
            <a className={`mobile-link ${activeKey === 'instrucoes' ? 'is-active' : ''}`} href="/instructions" onClick={() => setMobileOpen(false)}>Instruções</a>
            <a className={`mobile-link ${activeKey === 'contato' ? 'is-active' : ''}`} href="/contact-us" onClick={() => setMobileOpen(false)}>Contato</a>

            <a className={`mobile-link ${activeKey === 'sobre' ? 'is-active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveKey('sobre'); setMobileSobreOpen(v => !v); }}>Sobre ▾</a>
            {mobileSobreOpen && (
              <>
                <a className="mobile-subitem" href="/about" onClick={() => setMobileOpen(false)}>Conheça nossa história</a>
                <a className="mobile-subitem" href="/privacy-policy" onClick={() => setMobileOpen(false)}>Política de privacidade</a>
                <a className="mobile-subitem" href="/terms-of-use" onClick={() => setMobileOpen(false)}>Termos de uso</a>
              </>
            )}

            {!isAuthed ? (
              <a className="mobile-login" href="/login" onClick={() => setMobileOpen(false)}>Login</a>
            ) : (
              <button className="mobile-login" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
