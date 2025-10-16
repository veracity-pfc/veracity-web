import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ShowPasswordIcon from "../assets/icon-show-password.png";
import HidePasswordIcon from "../assets/icon-hide-password.png";
import ReturnIcon from '../assets/icon-return.png';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-only-footer");
    return () => document.body.classList.remove("auth-only-footer");
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [accept, setAccept]     = useState(false);

  const canSubmit = useMemo(() => {
    const allFilled = fullName.trim() && email.trim() && password && confirm;
    const match = password === confirm;
    return Boolean(allFilled && match && accept);
  }, [fullName, email, password, confirm, accept]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    navigate("/login");
  };

  return (
    <main className="register-container">
      <div className="login-logo">
        <Logo />
      </div>

      <section className="login-card register-card">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign('/')}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>
        <h1 className="login-title register-title">Cria sua conta</h1>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <label className="form-label" htmlFor="name">Nome completo</label>
          <input
            id="name"
            className="form-control"
            type="text"
            placeholder="Informe seu nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />

          <label className="form-label" htmlFor="email">E-mail</label>
          <input
            id="email"
            className="form-control"
            type="email"
            placeholder="Informe seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label className="form-label" htmlFor="password">Senha</label>
          <div className="password-input-wrap">
            <input
              id="password"
              className="form-control"
              type={showPass ? "text" : "password"}
              placeholder="Informe sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPass(v => !v)}
            >
              <img
                src={showPass ? HidePasswordIcon : ShowPasswordIcon}
                alt=""
                className="eye-icon"
              />
            </button>
          </div>

          <label className="form-label" htmlFor="confirm">Confirme a senha</label>
          <div className="password-input-wrap">
            <input
              id="confirm"
              className="form-control"
              type={showConf ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              aria-label={showConf ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowConf(v => !v)}
            >
              <img
                src={showConf ? HidePasswordIcon : ShowPasswordIcon}
                alt=""
                className="eye-icon"
              />
            </button>
          </div>

          <label className="terms-row">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              aria-label="Aceito os Termos de Uso e a Política de Privacidade"
              required
            />
            <p className="signup-hint">
            Ao criar minha conta declaro que li e aceito os <a href="/terms-of-use" onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de Uso</a> e com a <a href="/privacy-policy" onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de Privacidade</a> da plataforma
            </p>
          </label>

          <p className="signup-hint" style={{ marginTop: 4 }}>
            Já possui uma conta? <Link to="/login">Acesse agora!</Link>
          </p>

          <button
            className="btn-primary register-submit"
            type="submit"
            disabled={!canSubmit}
          >
            Cadastre-se
          </button>

          {confirm && password !== confirm && (
            <small className="field-hint field-error">
              As senhas não são iguais.
            </small>
          )}
        </form>
      </section>
    </main>
  );
}
