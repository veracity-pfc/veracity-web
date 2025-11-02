import React, { useEffect, useState } from 'react';
import ShowPasswordIcon from '../assets/icon-show-password.png';
import HidePasswordIcon from '../assets/icon-hide-password.png';
import ReturnIcon from '../assets/icon-return.png';
import Logo from '../components/Logo.jsx';
import { apiLogin, saveToken } from '../api/client';
import '../styles/auth.css';
import '../styles/forms.css';

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = (form.get('email') || '').toString().trim();
    const password = (form.get('password') || '').toString();

    if (!email || !password) {
      setErrMsg('Preencha e-mail e senha.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiLogin(email, password);
      if (data?.access_token) saveToken(data.access_token, data.role);
      window.location.assign('/');
    } catch (err) {
      const code = err?.code || err?.detail?.code;
      if (code === 'ACCOUNT_INACTIVE') {
        setErrMsg(
          <>
            A conta está desativada. Entre em <a id="contact-link" href="/contact-us">contato</a> para recuperar o acesso.
          </>
        );
      } else {
        setErrMsg('E-mail ou senha inválidos');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <div className="login-logo" aria-label="Veracity"><Logo /></div>

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

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" className="form-control" placeholder="Informe seu e-mail" autoComplete="email" required />

          <div className="password-row">
            <label className="form-label" htmlFor="password">Senha</label>
            <a href="/forgot-password" className="forgot-link">Esqueceu sua senha?</a>
          </div>

          <div className="password-input-wrap">
            <input id="password" name="password" type={showPwd ? 'text' : 'password'} className="form-control" placeholder="Informe sua senha" autoComplete="current-password" required />
            <button type="button" className="toggle-eye" aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPwd(v => !v)}>
              <img src={showPwd ? HidePasswordIcon : ShowPasswordIcon} alt={showPwd ? 'Ocultar senha' : 'Mostrar senha'} className="eye-icon" />
            </button>
          </div>

          {errMsg && <p className="error-msg" role="alert" aria-live="assertive">{errMsg}</p>}

          <p className="signup-hint">Não possui uma conta? <a href="/sign-up">Cadastre-se agora!</a></p>

          <button type="submit" className="btn-primary login-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}
