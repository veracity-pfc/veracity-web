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
    function onDocClick(e) {
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(e.target) || btnRef.current.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') { setOpen(false); setMobileOpen(false); } }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="site-header">
      <div className="container navbar">
        <Logo />

        <nav className="nav-links" aria-label="Principal">
          {ITEMS.map((item) => {
            if (item.key !== 'sobre') {
              return (
                <a
                  key={item.key}
                  className={`nav-link ${activeKey === item.key ? 'is-active' : ''}`}
                  href="#"
                  onClick={() => setActiveKey(item.key)}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <div key="sobre" className="about-group">
                <span
                  className={`nav-link ${activeKey === 'sobre' ? 'is-active' : ''}`}
                  onClick={() => setActiveKey('sobre')}
                >
                  Sobre
                </span>
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
                  <div
                    id="about-menu"
                    ref={menuRef}
                    role="menu"
                    className="about-menu"
                    aria-labelledby="about-toggle"
                  >
                    <a role="menuitem" tabIndex={0} href="#" className="about-item">Conheça nossa história</a>
                    <a role="menuitem" tabIndex={0} href="#" className="about-item">Política de privacidade</a>
                    <a role="menuitem" tabIndex={0} href="#" className="about-item">Termos de uso</a>
                  </div>
                )}
              </div>
            );
          })}
          <a href="#" className="nav-link login-cta">Login</a>
        </nav>

        <button
          className="mobile-toggle"
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="container">
          <div className="mobile-group">
            <a className={`mobile-link ${activeKey === 'perfil' ? 'is-active' : ''}`} href="#" onClick={() => { setActiveKey('perfil'); setMobileOpen(false); }}>Perfil</a>
            <a className={`mobile-link ${activeKey === 'admin' ? 'is-active' : ''}`} href="#" onClick={() => { setActiveKey('admin'); setMobileOpen(false); }}>Administração</a>
            <a className={`mobile-link ${activeKey === 'historico' ? 'is-active' : ''}`} href="#" onClick={() => { setActiveKey('historico'); setMobileOpen(false); }}>Histórico de análises</a>
            <a className={`mobile-link ${activeKey === 'instrucoes' ? 'is-active' : ''}`} href="#" onClick={() => { setActiveKey('instrucoes'); setMobileOpen(false); }}>Instruções</a>
            <a className={`mobile-link ${activeKey === 'contato' ? 'is-active' : ''}`} href="#" onClick={() => { setActiveKey('contato'); setMobileOpen(false); }}>Contato</a>

            <a
              className={`mobile-link ${activeKey === 'sobre' ? 'is-active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveKey('sobre'); setMobileSobreOpen(v => !v); }}
            >
              Sobre ▾
            </a>
            {mobileSobreOpen && (
              <>
                <a className="mobile-subitem" href="#" onClick={() => setMobileOpen(false)}>Conheça nossa história</a>
                <a className="mobile-subitem" href="#" onClick={() => setMobileOpen(false)}>Política de privacidade</a>
                <a className="mobile-subitem" href="#" onClick={() => setMobileOpen(false)}>Termos de uso</a>
              </>
            )}

            <a className="mobile-login" href="#" onClick={() => setMobileOpen(false)}>Login</a>
          </div>
        </div>
      </div>
    </header>
  );
}
