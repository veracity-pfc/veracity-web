import { JSX, useEffect, useState, CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiFetch, getRole } from "../../api/client";
import Toast, { useToast } from "../../components/Toast/Toast";
import styles from "./HistoryDetail.module.css";

type Detail = {
  id: string;
  created_at: string;
  analysis_type?: "url" | "image" | string;
  source?: string;
  label?: string;
  ai_summary?: string;
  ai_recommendations?: string[];
  email?: string;
  message?: string;
  status?: string;
  rejection_reason?: string;
  token_prefix?: string;
  user_email?: string;
  expires_at?: string;
  last_used_at?: string;
  revoked_at?: string;
  revoked_reason?: string;
};

const analysisLabelMap: Record<string, string> = {
  safe: "Seguro",
  suspicious: "Suspeito",
  malicious: "Malicioso",
  fake: "Falso",
  unknown: "Desconhecido",
};

const requestStatusMap: Record<string, string> = {
  open: "Em aberto",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

const tokenStatusMap: Record<string, string> = {
  active: "Ativo",
  revoked: "Revogado",
  expired: "Expirado",
};

const primaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "var(--accent)",
  fontWeight: 900,
  color: "var(--text-primary)",
  cursor: "pointer",
};

const dangerButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #c94343",
  background: "#c94343",
  fontWeight: 900,
  color: "#fff",
  cursor: "pointer",
};

const neutralButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.16)",
  background: "rgba(255, 255, 255, 0.18)",
  fontWeight: 900,
  color: "#f5f5f5",
  cursor: "pointer",
};

const disabledButtonStyle: CSSProperties = {
  opacity: 0.4,
  cursor: "not-allowed",
};

export default function HistoryDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<Detail | null>(null);
  const [err, setErr] = useState("");
  const [actionErr, setActionErr] = useState("");
  const [rejectionMode, setRejectionMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const role = getRole();
  const isAdmin = role === "admin";
  const isTokenManagement = location.pathname.startsWith("/tokens");
  const isRequestManagement = location.pathname.startsWith("/requests");
  const { success, error } = useToast();

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        let path = "";
        if (isTokenManagement) {
          path = `/administration/api/tokens/${id}`; 
          path = `/administration/api/tokens/${id}`; 
        } else if (isRequestManagement) {
          path = `/administration/api/token-requests/${id}`;
        } else {
          path = `/user/history/${id}`;
        }

        const res = (await apiFetch(path, { auth: true })) as Detail;
        setData(res);
        setErr("");
      } catch {
        setErr("Não foi possível carregar os detalhes.");
      }
    })();
  }, [id, isAdmin, isTokenManagement, isRequestManagement]);

  const handleApprove = async () => {
    if (!id || !data || data.status !== "open" || actionLoading || rejectionMode)
      return;
    setActionLoading(true);
    setApproveLoading(true);
    setActionErr("");
    try {
      await apiFetch(`/administration/api/token-requests/${id}/approve`, {
        auth: true,
        method: "POST",
      });
      success("Token gerado com sucesso.");
      navigate("/requests");
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.detail ||
        e?.message ||
        "Não foi possível gerar o token.";
      setActionErr(msg);
      error(msg);
    } finally {
      setActionLoading(false);
      setApproveLoading(false);
    }
  };

  const handleRejectOrRevoke = async () => {
    if (!id || !data || actionLoading) return;
    
    const reason = rejectionReason.trim();
    if (!reason) {
      const msg = "Informe o motivo.";
      setActionErr(msg);
      error(msg);
      return;
    }

    setActionLoading(true);
    setActionErr("");
    
    try {
      if (isTokenManagement) {
        const res = await apiFetch(`/administration/api/tokens/${id}/revoke`, {
          auth: true,
          method: "POST",
          body: { reason },
        });
        setData(res as Detail);
        success("Token revogado com sucesso.");
      } else {
        const res = await apiFetch(`/administration/api/token-requests/${id}/reject`, {
          auth: true,
          method: "POST",
          body: { reason },
        });
        setData(res as Detail);
        success("Solicitação rejeitada com sucesso.");
      }
      setRejectionMode(false);
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.detail ||
        e?.message ||
        "Não foi possível concluir a ação.";
      setActionErr(msg);
      error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const disablePrimaryActions = actionLoading || rejectionMode;

  if (err) return <div className={styles.error}>{err}</div>;
  if (!data) return <div className={styles.loading}>Carregando…</div>;

  if (isAdmin) {
    return (
      <div className={styles.wrap}>
        <Toast />
        <h1 className={styles.title}>
          {isTokenManagement ? "Detalhes do Token" : "Solicitação de Token"}
        </h1>
        <button className={styles.back} onClick={() => navigate(-1)}>
          Voltar
        </button>

        <div className={styles.panel}>
          <div className={styles.adminLayout}>
            <div className={styles.leftCol}>
              <p className={styles.p}>
                <b>Data:</b>{" "}
                {new Date(data.created_at).toLocaleString()}
              </p>

              <h3 className={styles.h3}>Status</h3>
              <p className={`${styles.p} ${styles.statusValue}`}>
                {isTokenManagement 
                  ? (tokenStatusMap[data.status || ""] || data.status) 
                  : (requestStatusMap[data.status || ""] || data.status)}
              </p>

              <h3 className={styles.h3}>Usuário</h3>
              <p className={styles.p}>
                <b>E-mail:</b> {data.user_email || data.email || "—"}
              </p>

              {isRequestManagement && (
                <>
                  <h3 className={styles.h3}>Mensagem do usuário</h3>
                  <div className={styles.p}>{data.message || "—"}</div>
                </>
              )}

              {isTokenManagement && (
                <>
                  <h3 className={styles.h3}>Informações do Token</h3>
                  <p className={styles.p}>
                    <b>Prefixo:</b> <span style={{fontFamily:'monospace'}}>{data.token_prefix}•••••</span>
                  </p>
                  <p className={styles.p}>
                    <b>Expira em:</b> {data.expires_at ? new Date(data.expires_at).toLocaleString() : "—"}
                  </p>
                  <p className={styles.p}>
                    <b>Último uso:</b> {data.last_used_at ? new Date(data.last_used_at).toLocaleString() : "Nunca"}
                  </p>
                </>
              )}
            </div>

            <div className={styles.rightCol}>
              {isRequestManagement && data.status === "open" && (
                <>
                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={disablePrimaryActions}
                      style={{
                        ...primaryButtonStyle,
                        ...(disablePrimaryActions ? disabledButtonStyle : {}),
                      }}
                    >
                      {approveLoading ? "Carregando" : "Gerar token"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (actionLoading) return;
                        setRejectionMode(true);
                        setActionErr("");
                      }}
                      disabled={disablePrimaryActions}
                      style={{
                        ...dangerButtonStyle,
                        ...(disablePrimaryActions ? disabledButtonStyle : {}),
                      }}
                    >
                      Rejeitar
                    </button>
                  </div>
                </>
              )}

              {isTokenManagement && data.status === "active" && (
                <>
                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      onClick={() => {
                        if (actionLoading) return;
                        setRejectionMode(true);
                        setActionErr("");
                      }}
                      disabled={disablePrimaryActions}
                      style={{
                        ...dangerButtonStyle,
                        ...(disablePrimaryActions ? disabledButtonStyle : {}),
                      }}
                    >
                      Revogar Token
                    </button>
                  </div>
                </>
              )}

              {rejectionMode && (
                <>
                  <h3 className={styles.h3Right}>
                    {isTokenManagement ? "Motivo da revogação" : "Motivo da rejeição"}
                  </h3>
                  <textarea
                    className={styles.reasonInput}
                    rows={5}
                    maxLength={2000}
                    placeholder={isTokenManagement ? "Por que este token está sendo revogado?" : "Descreva o motivo da rejeição"}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={handleRejectOrRevoke}
                      disabled={actionLoading}
                      style={{
                        ...primaryButtonStyle,
                        ...(actionLoading ? disabledButtonStyle : {}),
                      }}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (actionLoading) return;
                        setRejectionMode(false);
                        setRejectionReason("");
                        setActionErr("");
                      }}
                      disabled={actionLoading}
                      style={{
                        ...neutralButtonStyle,
                        ...(actionLoading ? disabledButtonStyle : {}),
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}

              {isRequestManagement && data.status === "rejected" && data.rejection_reason && (
                <>
                  <h3 className={styles.h3Right}>Motivo da rejeição</h3>
                  <div className={styles.reasonBox}>
                    {data.rejection_reason}
                  </div>
                </>
              )}

              {isTokenManagement && data.status === "revoked" && (
                <>
                  <h3 className={styles.h3Right}>Detalhes da revogação</h3>
                  <p className={styles.p}>
                    <b>Revogado em:</b> {data.revoked_at ? new Date(data.revoked_at).toLocaleString() : "—"}
                  </p>
                  {data.revoked_reason && (
                    <div className={styles.reasonBox}>
                      <b>Motivo:</b> {data.revoked_reason}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {actionErr && <div className={styles.error}>{actionErr}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Toast />
      <h1 className={styles.title}>Histórico</h1>
      <button className={styles.back} onClick={() => navigate(-1)}>
        Voltar
      </button>

      <div className={styles.panel}>
        <p className={styles.p}>
          <b>Data da análise:</b>{" "}
          {new Date(data.created_at).toLocaleDateString()}
        </p>
        {data.analysis_type === "image" ? (
          <p className={styles.p}>
            <b>Imagem:</b> {data.source || "—"}
          </p>
        ) : (
          <p className={styles.p}>
            <b>URL:</b> {data.source || "—"}
          </p>
        )}

        <h3 className={styles.h3}>Resultado da análise</h3>
        <p className={styles.p}>
          <b>Status:</b>{" "}
          {analysisLabelMap[data.label || ""] || data.label || "Desconhecido"}
        </p>

        <h3 className={styles.h3}>Análise técnica</h3>
        <div className={styles.p}>{data.ai_summary || "—"}</div>

        {Array.isArray(data.ai_recommendations) &&
          data.ai_recommendations.length > 0 && (
            <>
              <h3 className={styles.h3}>Recomendações</h3>
              <ul className={styles.ul}>
                {data.ai_recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
      </div>
    </div>
  );
}