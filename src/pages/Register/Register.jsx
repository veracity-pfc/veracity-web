import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import ShowPasswordIcon from "../../assets/icon-show-password.png";
import HidePasswordIcon from "../../assets/icon-hide-password.png";
import ReturnIcon from "../../assets/icon-return.png";
import { apiRegister } from "../../api/client";
import '../../styles/forms.css';
import styles from './Register.module.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwPolicy = (v) => ({
  length: v.length >= 8 && v.length <= 30,
  upper: /[A-Z]/.test(v),
  lower: /[a-z]/.test(v),
  digit: /\d/.test(v),
  symbol: /[^A-Za-z0-9]/.test(v),
});

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-only-footer");
    return () => document.body.classList.remove("auth-only-footer");
  }, []);

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);

  const [errName, setErrName]       = useState("");
  const [errEmail, setErrEmail]     = useState("");
  const [errConfirm, setErrConfirm] = useState("");
  const [errTerms, setErrTerms]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accept, setAccept]         = useState(false);

  useEffect(() => {
    setErrName(fullName && fullName.trim().length > 30 ? "Máximo de 30 caracteres." : "");
  }, [fullName]);

  useEffect(() => {
    if (!email) return setErrEmail("");
    if (email.length > 60) return setErrEmail("Máximo de 60 caracteres.");
    setErrEmail(emailRegex.test(email.toLowerCase()) ? "" : "O e-mail digitado não é válido. Tente novamente.");
  }, [email]);

  useEffect(() => {
    if (!confirm) return setErrConfirm("");
    setErrConfirm(confirm === password ? "" : "A senha deve ser igual nos dois campos");
  }, [password, confirm]);

  const policy = useMemo(() => pwPolicy(password), [password]);

  const ready =
    fullName.trim().length > 0 &&
    fullName.trim().length <= 30 &&
    email && !errEmail &&
    policy.length && policy.upper && policy.lower && policy.digit && policy.symbol &&
    confirm === password &&
    accept &&
    !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!accept) {
      setErrTerms("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    if (!ready) return;

    setSubmitting(true);
    setErrTerms("");
    setErrEmail("");
    try {
      await apiRegister(fullName.trim(), email.trim(), password, confirm, true);
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      if (err?.status === 409) {
        setErrEmail("E-mail já cadastrado.");
      } else {
        console.error(err);
        setErrEmail(err.message || "Falha ao cadastrar.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-container register-container">
      <div className="login-logo"><Logo /></div>

      <section className="login-card register-card">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign("/")}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 className="login-title">Crie sua conta</h2>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <label className="form-label" htmlFor="name">Nome completo</label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Informe seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={30}
            required
          />
          {errName && <small className="field-hint field-error">{errName}</small>}

          <div className={styles["label-row"]}>
            <label className="form-label" htmlFor="email">E-mail</label>
            <span className={styles["have-account"]}>
              Já possui uma conta? <Link to="/login">Acesse agora!</Link>
            </span>
          </div>

          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Informe seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={60}
            required
          />
          {errEmail && <small className="field-hint field-error">{errEmail}</small>}

          <label className="form-label" htmlFor="password">Senha</label>
          <div className="password-input-wrap">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              className="form-control"
              placeholder="Informe sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={30}
              autoComplete="new-password"
              required
            />
            <button type="button" className="toggle-eye" onClick={() => setShowPass(v => !v)}>
              <img src={showPass ? HidePasswordIcon : ShowPasswordIcon} alt="" className="eye-icon" />
            </button>
          </div>

          <ul className={styles["pw-policy"]}>
            <li className={policy.length ? "ok" : "err"}>8 a 30 caracteres</li>
            <li className={policy.upper ? "ok" : "err"}>1 letra maiúscula</li>
            <li className={policy.lower ? "ok" : "err"}>1 letra minúscula</li>
            <li className={policy.digit ? "ok" : "err"}>1 número</li>
            <li className={policy.symbol ? "ok" : "err"}>1 símbolo</li>
          </ul>

          <label className="form-label" htmlFor="confirm">Confirme a senha</label>
          <div className="password-input-wrap">
            <input
              id="confirm"
              type={showConf ? "text" : "password"}
              className="form-control"
              placeholder="Confirme sua senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              maxLength={30}
              autoComplete="new-password"
              required
            />
            <button type="button" className="toggle-eye" onClick={() => setShowConf(v => !v)}>
              <img src={showConf ? HidePasswordIcon : ShowPasswordIcon} alt="" className="eye-icon" />
            </button>
          </div>
          {errConfirm && <small className="field-hint field-error">{errConfirm}</small>}

          <label className="terms-row">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => {
                setAccept(e.target.checked);
                if (e.target.checked) setErrTerms("");
              }}
              aria-label="Aceito os Termos de Uso e a Política de Privacidade"
              required
            />
            <p className="signup-hint">
              Ao criar minha conta declaro que li e aceito os{" "}
              <a
                href="/terms-of-use"
                onClick={(e) => { e.preventDefault(); window.open("/terms-of-use", "_blank", "noopener"); }}
              >
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a
                href="/privacy-policy"
                onClick={(e) => { e.preventDefault(); window.open("/privacy-policy", "_blank", "noopener"); }}
              >
                Política de Privacidade
              </a>{" "}
              da plataforma
            </p>
          </label>
          {errTerms && <small className="field-hint field-error">{errTerms}</small>}

          <button className="btn-primary register-submit" type="submit" disabled={!ready}>
            Cadastre-se
          </button>
        </form>
      </section>
    </main>
  );
}
