import { JSX, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../components/Logo";
import ReturnIcon from "../../assets/icon-return.png";
import { apiVerifyEmail, apiResendCode, apiFetch, getToken, clearToken } from "../../api/client";
import Toast, { useToast } from "../../components/Toast/Toast";
import "../../styles/forms.css";
import styles from "./VerifyEmail.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "";

export default function VerifyEmail(): JSX.Element {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const mode = (params.get("mode") || "signup").trim();
  const isReactivation = mode === "reactivate";
  const isEmailChange = mode === "email-change";

  const urlEmail = (params.get("email") || "").trim();
  const storedEmail =
    typeof window !== "undefined"
      ? (localStorage.getItem("veracity_email_change_target") || "").trim()
      : "";
  const email = (isEmailChange ? storedEmail || urlEmail : urlEmail).trim();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState<number>(30);
  const [sending, setSending] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.add("auth-only-footer");
    return () => document.body.classList.remove("auth-only-footer");
  }, []);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLElement>) => {
    const txt = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!txt) return;
    const arr = txt.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
    setCode(arr);
    inputsRef.current[Math.min(txt.length, 5)]?.focus();
    e.preventDefault();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    const joined = code.join("");
    if (!email || joined.length !== 6 || verifying || sending) return;
    try {
      setVerifying(true);
      if (isReactivation) {
        await apiFetch("/v1/users/reactivate-account/confirm-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { email, code: joined },
        });
        success("Conta reativada com sucesso! Você já pode fazer login novamente.");
        navigate("/login");
      } else if (isEmailChange) {
        const hasSession = !!getToken();
        if (!hasSession) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }

        const res = await fetch(`${API_BASE_URL}/v1/users/profile/email-change/confirm`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({ email, code: joined }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Erro ao confirmar alteração de e-mail.");
        }

        localStorage.removeItem("veracity_email_change_target");
        clearToken(); 
        success("E-mail alterado com sucesso! Faça login novamente com o novo endereço.");
        navigate("/login");
      } else {
        await apiVerifyEmail(email, joined);
        success("Conta criada com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        toastError("Erro ao confirmar código!");
        setErr(
          error?.message || "O código inserido está inválido. Tente novamente"
        );
        if (error?.message?.includes("Sessão expirada")) {
             navigate("/login");
        }
      }
    } finally {
      setVerifying(false);
    }
  };

  const resend = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!email || cooldown > 0 || sending || verifying) return;
    setSending(true);
    setErr("");
    try {
      if (isReactivation) {
        await apiFetch("/v1/users/reactivate-account/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { email },
        });
      } else if (isEmailChange) {
        const hasSession = !!getToken();
        if (!hasSession) {
          toastError("Sessão expirada. Faça login para solicitar novamente.");
          setErr("Sua sessão expirou. Faça login novamente para alterar o e-mail.");
          setSending(false);
          return;
        }
        const res = await fetch(
          `${API_BASE_URL}/v1/users/profile/email-change/request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email }),
          }
        );
        if (!res.ok) {
          if (res.status === 401) {
            toastError("Sessão expirada. Faça login para solicitar novamente.");
            setErr("Sua sessão expirou. Faça login novamente para alterar o e-mail.");
            setSending(false);
            return;
          }
          const data = await res.json().catch(() => null);
          throw new Error(data?.detail || "Falha ao reenviar código");
        }
      } else {
        await apiResendCode(email);
      }
      setCooldown(30);
      success("Código reenviado com sucesso!");
    } catch (error: any) {
      if (!(isEmailChange && (error?.status === 401 || error?.statusCode === 401))) {
        toastError("Falha ao reenviar código.");
      }
      setErr(error?.message || "Falha ao reenviar código");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="login-container" onPaste={onPaste}>
      <Toast />
      <div className="login-logo">
        <Logo />
      </div>

      <section className="login-card verify-card">
        <button
          type="button"
          className="login-back"
          onClick={() =>
            window.location.assign(
              isReactivation ? "/reactivate-account" : "/"
            )
          }
          aria-label="Voltar"
          title="Voltar"
        >
          <img src={ReturnIcon} alt="" />
        </button>

        <h2 className="login-title">
          Confirme seu e-mail
        </h2>
        <p className="signup-hint" style={{ marginTop: -8 }}>
          Preencha os campos abaixo com o código enviado para o e-mail cadastrado
        </p>

        <form onSubmit={submit} className="verify-form">
          <div className={styles["code-row"]}>
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                className={styles["code-box"]}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={c}
                onChange={(event) =>
                  onChange(i, event.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(event) => onKeyDown(i, event)}
              />
            ))}
          </div>

          {err && (
            <p className="error-msg" role="alert">
              {err}
            </p>
          )}

          <p className="signup-hint" style={{ marginTop: 12 }}>
            Não recebeu o código?{" "}
            <a
              href="#"
              onClick={resend}
              aria-disabled={cooldown > 0 || sending || verifying}
            >
              Reenviar {cooldown > 0 ? `(${cooldown}s)` : ""}
            </a>
          </p>

          <button
            className="btn-primary verify-submit"
            type="submit"
            disabled={code.join("").length !== 6 || verifying || sending}
          >
            {verifying || sending ? "Carregando" : "Confirmar"}
          </button>
        </form>
      </section>
    </main>
  );
}