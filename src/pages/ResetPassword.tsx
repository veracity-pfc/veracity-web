import { useState, useEffect, JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../api/client';
import ReturnIcon from '../assets/icon-return.png';
import ShowPasswordIcon from '../assets/icon-show-password.png';
import HidePasswordIcon from '../assets/icon-hide-password.png';
import Logo from '../components/Logo';
import Toast, { useToast } from '../components/Toast/Toast';
import '../styles/auth.css';
import '../styles/forms.css';

export default function ResetPassword(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [pw, setPw] = useState<string>('');
  const [pw2, setPw2] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [show1, setShow1] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { success, error } = useToast();

  useEffect(() => {
    document.body.classList.add('auth-only-footer');
    return () => document.body.classList.remove('auth-only-footer');
  }, []);

  const validatePasswords = (): string | null => {
    const password = pw || '';
    const confirm = pw2 || '';

    if (password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres.';
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!(hasUpper && hasDigit && hasSymbol)) {
      return 'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 símbolo.';
    }

    if (password !== confirm) {
      return 'As senhas não conferem.';
    }

    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');

    const validationError = validatePasswords();
    if (validationError) {
      setErr(validationError);
      error(validationError);
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(token as string, pw, pw2);
      success('Senha alterada com sucesso!');
      navigate('/login');
    } catch (e: any) {
      const msg =
        e?.detail ||
        e?.data?.detail ||
        e?.message ||
        'Não foi possível alterar a senha.';
      setErr(msg);
      error(msg);
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
              onChange={(e) => setPw(e.target.value)}
              placeholder="Informe sua senha"
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={show1 ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShow1(v => !v)}
              disabled={loading}
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
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={show2 ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShow2(v => !v)}
              disabled={loading}
            >
              <img
                src={show2 ? HidePasswordIcon : ShowPasswordIcon}
                alt={show2 ? 'Ocultar senha' : 'Mostrar senha'}
                className="eye-icon"
              />
            </button>
          </div>

          {err && (
            <p className="error-msg" role="alert" aria-live="assertive">
              {err}
            </p>
          )}

          <button
            className="btn-primary login-submit"
            type="submit"
            disabled={loading}
            aria-disabled={loading ? true : undefined}
          >
            {loading ? 'Carregando' : 'Trocar senha'}
          </button>
        </form>
      </section>
    </main>
  );
}
