import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { apiLogout, clearToken, getRole, getToken } from '../api/client';

export default function Header() {
  const [open, setOpen] = useState(false);           
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSobreOpen, setMobileSobreOpen] = useState(false);

  const [isAuthed, setIsAuthed] = useState(!!getToken());
  const [role, setRole] = useState(getRole());

  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (e) => {
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
    window.addEventListener('veracity-auth-changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('veracity-auth-changed', onAuthChanged);
    };
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
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try { await apiLogout(); } catch {}
    clearToken();
    setIsAuthed(false);
    setRole(null);
    navigate('/login', { replace: true });
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
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
          aria-label="Ir para a página inicial"
        >
          <Logo />
        </div>

        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/user/profile" className="nav-link">Perfil</NavLink>

          {isAdmin && (
            <NavLink to="/administration" className="nav-link">Administração</NavLink>
          )}

          <NavLink to="/user/history" className="nav-link">Histórico de análises</NavLink>
          <NavLink to="/instructions" className="nav-link">Instruções</NavLink>
          <NavLink to="/contact-us" className="nav-link" end>Contato</NavLink>

          <div className="about-group">
            <NavLink to="/about" className="nav-link" end>Sobre</NavLink>
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
                <NavLink role="menuitem" tabIndex={0} to="/about" className="about-item">Conheça nossa história</NavLink>
                <a role="menuitem" tabIndex={0} href="/privacy-policy" className="about-item" onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de privacidade</a>
                <a role="menuitem" tabIndex={0} href="/terms-of-use" className="about-item" onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de uso</a>
              </div>
            )}
          </div>

          {!isAuthed ? (
            <NavLink to="/login" className="nav-link login-cta">Login</NavLink>
          ) : (
            <a href="/logout" className="nav-link login-cta" onClick={handleLogout}>Sair</a>
          )}
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
            <NavLink className="mobile-link" to="/user/profile" onClick={() => setMobileOpen(false)}>Perfil</NavLink>
            {isAdmin && <NavLink className="mobile-link" to="/administration" onClick={() => setMobileOpen(false)}>Administração</NavLink>}
            <NavLink className="mobile-link" to="/user/history" onClick={() => setMobileOpen(false)}>Histórico de análises</NavLink>
            <NavLink className="mobile-link" to="/instructions" onClick={() => setMobileOpen(false)}>Instruções</NavLink>
            <NavLink className="mobile-link" to="/contact-us" onClick={() => setMobileOpen(false)} end>Contato</NavLink>

            <a
              className="mobile-link"
              href="#"
              onClick={(e) => { e.preventDefault(); setMobileSobreOpen(v => !v); }}
            >
              Sobre ▾
            </a>
            {mobileSobreOpen && (
              <>
                <NavLink className="mobile-subitem" to="/about" onClick={() => setMobileOpen(false)}>Conheça nossa história</NavLink>
                <a className="mobile-subitem" href="/privacy-policy" onClick={() => setMobileOpen(false)}>Política de privacidade</a>
                <a className="mobile-subitem" href="/terms-of-use" onClick={() => setMobileOpen(false)}>Termos de uso</a>
              </>
            )}

            {!isAuthed ? (
              <NavLink className="mobile-login" to="/login" onClick={() => setMobileOpen(false)}>Login</NavLink>
            ) : (
              <a className="mobile-login" href="/logout" onClick={(e) => { e.preventDefault(); setMobileOpen(false); handleLogout(e); }}>Sair</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
