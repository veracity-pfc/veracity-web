import React, { useEffect, useState } from 'react';
import ShowPasswordIcon from '../assets/icon-show-password.png';
import HidePasswordIcon from '../assets/icon-hide-password.png';
import ReturnIcon from '../assets/icon-return.png';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  return (
    <main className="login-container">
      <div className="login-logo" aria-label="Veracity">
        <Logo />
      </div>

      <section className="login-card" aria-labelledby="login-title">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign('/')}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 id="login-title" className="login-title">Acesse sua conta</h2>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label className="form-label" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Informe seu e-mail"
            required
          />

          <div className="password-row">
            <label className="form-label" htmlFor="password">Senha</label>
            <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
              Esqueceu sua senha?
            </a>
          </div>

          <div className="password-input-wrap">
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              className="form-control"
              placeholder="Informe sua senha"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShowPwd(v => !v)}
            >
              <img
                src={showPwd ? HidePasswordIcon : ShowPasswordIcon}
                alt={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                className="eye-icon"
              />
            </button>
          </div>

          <p className="signup-hint">
            Não possui uma conta? <a href="/sign-up">Cadastre-se agora!</a>
          </p>

          <button type="submit" className="btn-primary login-submit">Login</button>
        </form>
      </section>
    </main>
  );
}
