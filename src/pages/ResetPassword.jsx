import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../api/client';
import ReturnIcon from '../assets/icon-return.png';
import ShowPasswordIcon from '../assets/icon-show-password.png';
import HidePasswordIcon from '../assets/icon-hide-password.png';
import Logo from '../components/Logo.jsx';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await apiResetPassword(token, pw, pw2);
      navigate('/login');
    } catch (e) {
      setErr(e?.detail || 'Não foi possível alterar a senha.');
    }
  };

  return (
    <main className="login-container">
      <div className="login-logo" aria-label="Veracity"><Logo /></div>

      <section className="login-card" aria-labelledby="reset-title">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign('/')}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 id="reset-title" className="login-title">Nova senha</h2>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <label className="form-label" htmlFor="password">Senha</label>
          <div className="password-input-wrap">
            <input
              id="password"
              className="form-control"
              type={show1 ? 'text' : 'password'}
              value={pw}
              onChange={(e)=>setPw(e.target.value)}
              placeholder="Informe sua senha"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={show1 ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShow1(v => !v)}
            >
              <img
                src={show1 ? HidePasswordIcon : ShowPasswordIcon}
                alt={show1 ? 'Ocultar senha' : 'Mostrar senha'}
                className="eye-icon"
              />
            </button>
          </div>

          <label className="form-label" htmlFor="password2">Confirme a senha</label>
          <div className="password-input-wrap">
            <input
              id="password2"
              className="form-control"
              type={show2 ? 'text' : 'password'}
              value={pw2}
              onChange={(e)=>setPw2(e.target.value)}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={show2 ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShow2(v => !v)}
            >
              <img
                src={show2 ? HidePasswordIcon : ShowPasswordIcon}
                alt={show2 ? 'Ocultar senha' : 'Mostrar senha'}
                className="eye-icon"
              />
            </button>
          </div>

          {err && <p className="error-msg" role="alert" aria-live="assertive">{err}</p>}

          <button className="btn-primary login-submit" type="submit">Trocar senha</button>
        </form>
      </section>
    </main>
  );
}
