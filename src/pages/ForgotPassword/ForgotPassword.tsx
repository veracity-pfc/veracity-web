import { useState, useEffect, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import ReturnIcon from '../../assets/icon-return.png';
import Logo from '../../components/Logo';
import { apiForgotPassword } from '../../api/client';
import Toast, { useToast } from '../../components/Toast/Toast';
import styles from './ForgotPassword.module.css';
import '../../styles/forms.css';

export default function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    setLoading(true); 
    try {
      await apiForgotPassword(email.trim());
      setSent(true);
      success("E-mail de recuperação enviado com sucesso!");
    } catch (e: any) {
      error("Erro ao enviar e-mail de recuperação!");
      setErr(e?.data?.detail || e.message || 'E-mail não encontrado. Tente novamente.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <main className="login-container">
      <Toast />
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
                disabled={loading} 
              />

              {err && <p className="error-msg" role="alert" aria-live="assertive">{err}</p>}

              <button
                className="btn-primary login-submit"
                type="submit"
                disabled={loading}            
                aria-disabled={loading ? true : undefined}
              >
                {loading ? 'Carregando' : 'Enviar e-mail'} 
              </button>
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
