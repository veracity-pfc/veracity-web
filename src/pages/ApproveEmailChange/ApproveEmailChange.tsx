import { useEffect, useState, JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiApproveEmailChange } from "../../api/client";
import { useToast } from "../../components/Toast/Toast";
import Logo from "../../components/Logo";
import "../../styles/auth.css"; 

export default function ApproveEmailChange(): JSX.Element {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { error, success } = useToast();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    
    if (!token) {
      setStatus("error");
      error("Link inválido.");
      return;
    }

    apiApproveEmailChange(token)
      .then((data: any) => {
        if (data.email) {
          localStorage.setItem("veracity_email_change_target", data.email);
        }
        
        success("Aprovação confirmada! O código foi enviado para o seu novo e-mail.");
        
        navigate("/verify-email?mode=email-change", { replace: true });
      })
      .catch((err: any) => {
        setStatus("error");
        error(err.message || "Falha ao aprovar troca de e-mail. O link pode ter expirado.");
      });
  }, []);

  return (
    <main className="login-container">
      <div className="login-logo">
        <Logo />
      </div>
      <section className="login-card" style={{ textAlign: "center", padding: "40px 20px" }}>
        {status === "loading" && (
          <>
            <h2 className="login-title">Processando...</h2>
            <p>Validando sua autorização e enviando o código para o novo e-mail.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="login-title" style={{ color: "#e05d5d" }}>Link inválido ou expirado</h2>
            <p>Não foi possível processar sua solicitação. Por favor, tente iniciar o processo novamente pelo seu perfil.</p>
            <button 
              className="btn-primary" 
              style={{ marginTop: 20 }}
              onClick={() => navigate("/user/profile")}
            >
              Voltar ao Perfil
            </button>
          </>
        )}
      </section>
    </main>
  );
}