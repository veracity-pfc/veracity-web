import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo.jsx';

const ITEMS = [
  { key: 'perfil', label: 'Perfil' },
  { key: 'admin', label: 'Administração' },
  { key: 'historico', label: 'Histórico de análises' },
  { key: 'instrucoes', label: 'Instruções' },
  { key: 'contato', label: 'Contato' },
  { key: 'sobre', label: 'Sobre' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSobreOpen, setMobileSobreOpen] = useState(false);

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const path = window.location.pathname || '';
    if (path.startsWith('/about')) setActiveKey('sobre');
    else if (path.startsWith('/instructions')) setActiveKey('instrucoes');
    else if (path.startsWith('/contact-us')) setActiveKey('contato');
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
          {ITEMS.map((item) => {
            if (item.key === 'sobre') {
              return (
                <div key="sobre" className="about-group">
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
              );
            }

            if (item.key === 'instrucoes') {
              return (
                <a
                  key={item.key}
                  className={`nav-link ${activeKey === item.key ? 'is-active' : ''}`}
                  href="/instructions"
                  onClick={() => setActiveKey('instrucoes')}
                >
                  {item.label}
                </a>
              );
            }

            if (item.key === 'contato') {
              return (
                <a
                  key={item.key}
                  className={`nav-link ${activeKey === item.key ? 'is-active' : ''}`}
                  href="/contact-us"
                  onClick={() => setActiveKey('contato')}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <a
                key={item.key}
                className={`nav-link ${activeKey === item.key ? 'is-active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveKey(item.key); }}
              >
                {item.label}
              </a>
            );
          })}
          <a href="/login" className="nav-link login-cta">Login</a>
        </nav>

        <button className="mobile-toggle" aria-label="Abrir menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="container">
          <div className="mobile-group">
            <a className={`mobile-link ${activeKey === 'perfil' ? 'is-active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveKey('perfil'); setMobileOpen(false); }}>Perfil</a>
            <a className={`mobile-link ${activeKey === 'admin' ? 'is-active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveKey('admin'); setMobileOpen(false); }}>Administração</a>
            <a className={`mobile-link ${activeKey === 'historico' ? 'is-active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveKey('historico'); setMobileOpen(false); }}>Histórico de análises</a>

            <a className={`mobile-link ${activeKey === 'instrucoes' ? 'is-active' : ''}`} href="/instructions" onClick={() => { setActiveKey('instrucoes'); setMobileOpen(false); }}>Instruções</a>
            <a className={`mobile-link ${activeKey === 'contato' ? 'is-active' : ''}`} href="/contact-us" onClick={() => { setActiveKey('contato'); setMobileOpen(false); }}>Contato</a>

            <a className={`mobile-link ${activeKey === 'sobre' ? 'is-active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveKey('sobre'); setMobileSobreOpen(v => !v); }}>Sobre ▾</a>
            {mobileSobreOpen && (
              <>
                <a className="mobile-subitem" href="/about" onClick={() => setMobileOpen(false)}>Conheça nossa história</a>
                <a className="mobile-subitem" href="/privacy-policy" onClick={() => setMobileOpen(false)}>Política de privacidade</a>
                <a className="mobile-subitem" href="/terms-of-use" onClick={() => setMobileOpen(false)}>Termos de uso</a>
              </>
            )}

            <a className="mobile-login" href="/login">Login</a>
          </div>
        </div>
      </div>
    </header>
  );
}
