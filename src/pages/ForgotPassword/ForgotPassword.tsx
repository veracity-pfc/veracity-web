import { useState, useEffect, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import ReturnIcon from '../../assets/icon-return.png';
import Logo from '../../components/Logo';
import { apiForgotPassword } from '../../api/client';
import Toast, { useToast } from '../../components/Toast/Toast';
import styles from './ForgotPassword.module.css';
import '../../styles/forms.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { success, error: showErrorToast } = useToast();

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  const normalizedEmail = email.trim().toLowerCase();
  const isValidEmail =
    normalizedEmail.length > 0 &&
    normalizedEmail.length <= 60 &&
    emailRegex.test(normalizedEmail);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErr('');

    if (!isValidEmail) {
      setErr('O e-mail digitado não é válido. Tente novamente.');
      return;
    }

    setLoading(true);

    try {
      await apiForgotPassword(normalizedEmail);
      setSent(true);
      success('E-mail de recuperação enviado com sucesso!');
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.data?.detail ||
        error?.data?.message ||
        error?.detail ||
        error?.message;

      if (backendMessage) {
        setErr(backendMessage);
      } else {
        setErr('Ocorreu um erro ao tentar recuperar a senha.');
      }

      showErrorToast('Não foi possível enviar o e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <Toast />

      <div className="login-logo" aria-label="Veracity">
        <Logo />
      </div>

      <section className="login-card auth-card" aria-labelledby="forgot-title">
        <button
          type="button"
          className="login-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar para a página anterior"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        {!sent ? (
          <>
            <h2 id="forgot-title" className="login-title">
              Recuperar minha conta
            </h2>
            <p className={styles['auth-sub']}>
              Digite o endereço de e-mail da sua conta e lhe enviaremos um link
              de redefinição de senha.
            </p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                className="form-control"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErr('');
                }}
                placeholder="Informe seu e-mail"
                autoComplete="email"
                required
                disabled={loading}
                maxLength={60}
              />

              {err && (
                <p className="error-msg" role="alert" aria-live="assertive">
                  {err}
                </p>
              )}

              <button
                className="btn-primary login-submit"
                type="submit"
                disabled={loading || !isValidEmail}
                aria-disabled={loading || !isValidEmail ? true : undefined}
              >
                {loading ? 'Carregando' : 'Enviar e-mail'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="login-title">Recuperar minha conta</h2>
            <p className={styles['auth-sub']}>
              Verifique seu e-mail para obter um link para redefinir sua senha.
              Se não aparecer em alguns minutos, verifique sua pasta de spam.
            </p>
            <div className={styles['auth-actions']}>
              <a href="/login" className={styles['forgot-link']}>
                Retornar para o login
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
