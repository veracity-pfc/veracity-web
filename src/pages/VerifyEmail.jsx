import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import ReturnIcon from "../assets/icon-return.png";
import { apiVerifyEmail, apiResendCode } from "../api/client";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = (params.get("email") || "").trim();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState(30);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.body.classList.add("auth-only-footer");
    return () => document.body.classList.remove("auth-only-footer");
  }, []);

  useEffect(() => { inputsRef.current[0]?.focus(); }, []);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const onPaste = (e) => {
    const txt = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!txt) return;
    const arr = txt.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
    setCode(arr);
    inputsRef.current[Math.min(txt.length, 5)]?.focus();
    e.preventDefault();
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const joined = code.join("");
    if (joined.length !== 6) return;
    try {
      await apiVerifyEmail(email, joined);
      navigate("/");
    } catch (error) {
      setErr(error.message || "O código inserido está inválido. Tente novamente");
    }
  };

  const resend = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || sending) return;
    setSending(true);
    try {
      await apiResendCode(email);
      setCooldown(30);
    } catch (error) {
      setErr(error.message || "Falha ao reenviar código");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="login-container" onPaste={onPaste}>
      <div className="login-logo"><Logo /></div>

      <section className="login-card verify-card">
        <button
          type="button"
          className="login-back"
          onClick={() => window.location.assign("/")}
          aria-label="Voltar"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 className="login-title">Confirme seu e-mail</h2>
        <p className="signup-hint" style={{ marginTop: -8 }}>
          Preencha os campos abaixo com o código enviado para o e-mail cadastrado
        </p>

        <form onSubmit={submit} className="verify-form">
          <div className="code-row">
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                className="code-box"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={c}
                onChange={(e) => onChange(i, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => onKeyDown(i, e)}
              />
            ))}
          </div>

          {err && <p className="error-msg" role="alert">{err}</p>}

          <p className="signup-hint" style={{ marginTop: 12 }}>
            Não recebeu o código?{" "}
            <a href="#" onClick={resend} aria-disabled={cooldown > 0}>
              Reenviar {cooldown > 0 ? `(${cooldown}s)` : ""}
            </a>
          </p>

          <button className="btn-primary verify-submit" type="submit" disabled={code.join("").length !== 6}>
            Confirmar
          </button>
        </form>
      </section>
    </main>
  );
}
