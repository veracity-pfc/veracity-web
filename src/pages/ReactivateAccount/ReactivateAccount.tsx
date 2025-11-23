import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReturnIcon from "../../assets/icon-return.png";
import Logo from "../../components/Logo";
import Toast, { useToast } from "../../components/Toast/Toast";
import { apiFetch } from "../../api/client";
import styles from "./ReactivateAccount.module.css";
import "../../styles/forms.css";

export default function ReactivateAccount(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [validating, setValidating] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-only-footer");
    return () => document.body.classList.remove("auth-only-footer");
  }, []);

  useEffect(() => {
    setErr("");
    setValidated(false);
  }, [email]);

  const handleBlur = async () => {
    const value = email.trim();
    setErr("");
    setValidated(false);
    if (!value) return;
    setValidating(true);
    try {
      await apiFetch("/v1/user/reactivate-account/validate", {
        method: "POST",
        body: { email: value },
      });
      setValidated(true);
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.detail ||
        e?.message ||
        "Não foi possível validar o e-mail.";
      setErr(msg);
      error(msg);
    } finally {
      setValidating(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !validated || validating || submitting) return;
    const value = email.trim();
    setSubmitting(true);
    setErr("");
    try {
      await apiFetch("/v1/user/reactivate-account/send-code", {
        method: "POST",
        body: { email: value },
      });
      success(
        "Enviamos um código para o seu e-mail. Confirme para reativar sua conta."
      );
      navigate(`/verify-email?email=${encodeURIComponent(value)}&mode=reactivate`);
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.detail ||
        e?.message ||
        "Não foi possível enviar o código de verificação.";
      setErr(msg);
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-container">
      <Toast />
      <div className="login-logo" aria-label="Veracity">
        <Logo />
      </div>

      <section className="login-card auth-card" aria-labelledby="reactivate-title">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign("/")}
          aria-label="Voltar para a página inicial"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 id="reactivate-title" className="login-title">
          Reativar conta
        </h2>
        <p className={styles.sub}>
          Informe o e-mail cadastrado na plataforma para reativar sua conta e recuperar o acesso
          ao seu histórico de análises.
        </p>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <label className="form-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            className="form-control"
            type="email"
            placeholder="email@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            autoComplete="email"
            required
            disabled={validating || submitting}
          />

          {err && (
            <p className="error-msg" role="alert" aria-live="assertive">
              {err}
            </p>
          )}

          <button
            className="btn-primary login-submit"
            type="submit"
            disabled={!email.trim() || !validated || validating || submitting}
            aria-disabled={
              !email.trim() || !validated || validating || submitting ? true : undefined
            }
          >
            {submitting ? "Carregando..." : "Reativar conta"}
          </button>
        </form>
      </section>
    </main>
  );
}
