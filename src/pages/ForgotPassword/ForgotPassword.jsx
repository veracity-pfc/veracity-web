import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReturnIcon from '../../assets/icon-return.png';
import Logo from '../../components/Logo.jsx';
import { apiForgotPassword } from '../../api/client';
import styles from './ForgotPassword.module.css';
import '../../styles/forms.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await apiForgotPassword(email.trim());
      setSent(true);
    } catch (e) {
      setErr(e?.data?.detail || e.message || 'E-mail não encontrado. Tente novamente.');
    }
  };

  return (
    <main className="login-container">
      <div className="login-logo" aria-label="Veracity"><Logo /></div>

      <section className="login-card auth-card" aria-labelledby="forgot-title">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign('/')}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        {!sent ? (
          <>
            <h2 id="forgot-title" className="login-title">Recuperar minha conta</h2>
            <p className={styles["auth-sub"]}>
              Digite o endereço de e-mail da sua conta e lhe enviaremos um link de redefinição de senha.
            </p>

            <form className="login-form" onSubmit={onSubmit} noValidate>
              <label className="form-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                className="form-control"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Informe seu e-mail"
                autoComplete="email"
                required
              />

              {err && <p className="error-msg" role="alert" aria-live="assertive">{err}</p>}

              <button className="btn-primary login-submit" type="submit">Enviar e-mail</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="login-title">Recuperar minha conta</h2>
            <p className={styles["auth-sub"]}>
              Verifique seu e-mail para obter um link para redefinir sua senha. Se não aparecer em alguns minutos, verifique sua pasta de spam.
            </p>
            <div className={styles["auth-actions"]}>
              <a href="/login" className={styles["forgot-link"]}>Retornar para o login</a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
