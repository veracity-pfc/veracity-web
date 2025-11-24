import { JSX, useEffect, useState, CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiApproveTokenRequest, apiFetch, apiRejectTokenRequest, getRole } from "../../api/client";
import Toast, { useToast } from "../../components/Toast/Toast";
import styles from "./HistoryDetail.module.css";

type Detail = {
  id: string;
  created_at: string;
  seq_id?: number;
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
  category?: string;
  subject?: string;
  admin_reply?: string;
  replied_at?: string;
  via_token?: boolean;
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
  answered: "Respondida",
  finished: "Encerrada",
};

const tokenStatusMap: Record<string, string> = {
  active: "Ativo",
  revoked: "Revogado",
  expired: "Expirado",
};

const categoryMap: Record<string, string> = {
  doubt: "Dúvida",
  suggestion: "Sugestão",
  complaint: "Reclamação",
  token_request: "Solicitação de Token",
};

const primaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "var(--accent)",
  fontWeight: 900,
  color: "var(--text-primary)",
  cursor: "pointer",
  textAlign: "center",
};

const dangerButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #c94343",
  background: "#c94343",
  fontWeight: 900,
  color: "#fff",
  cursor: "pointer",
  textAlign: "center",
};

const neutralButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.16)",
  background: "rgba(255, 255, 255, 0.18)",
  fontWeight: 900,
  color: "#f5f5f5",
  cursor: "pointer",
  textAlign: "center",
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
  
  const [replyMode, setReplyMode] = useState(false); 
  const [replyMessage, setReplyMessage] = useState("");

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
          path = `/v1/administration/api/tokens/${id}`; 
        } else if (isRequestManagement) {
          path = `/v1/administration/contact-requests/${id}`; 
        } else {
          path = `/v1/user/history/${id}`;
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
      await apiApproveTokenRequest(id)
      success("Token gerado com sucesso.");
      navigate("/requests");
    } catch (e: any) {
      const msg = e?.data?.detail || e?.message || "Não foi possível gerar o token.";
      setActionErr(msg);
      error(msg);
    } finally {
      setActionLoading(false);
      setApproveLoading(false);
    }
  };

  const handleReplyContact = async () => {
    if (!id || !data || actionLoading) return;
    
    if (!replyMessage.trim() || replyMessage.length < 5) {
      setActionErr("A resposta deve ter pelo menos 5 caracteres.");
      return;
    }

    setActionLoading(true);
    setActionErr("");
    try {
      await apiFetch(`/v1/administration/contact-requests/${id}/reply`, {
        auth: true,
        method: "POST",
        body: { reply_message: replyMessage }
      });
      success("Resposta enviada com sucesso!");
      setReplyMode(false); 
      navigate("/requests");
    } catch (e: any) {
      const msg = e?.data?.detail || e?.message || "Falha ao enviar resposta.";
      setActionErr(msg);
      error(msg);
    } finally {
      setActionLoading(false);
    }
  }

  const handleRejectOrRevoke = async () => {
    if (!id || !data || actionLoading) return;
    
    const reason = rejectionReason.trim();
    if (!reason) {
      setActionErr("Informe o motivo.");
      return;
    }

    setActionLoading(true);
    setActionErr("");
    
    try {
      if (isTokenManagement) {
        const res = await apiFetch(`/v1/administration/api/tokens/${id}/revoke`, {
          auth: true,
          method: "POST",
          body: { reason },
        });
        setData(res as Detail);
        success("Token revogado com sucesso.");
      } else {
        const res = await apiRejectTokenRequest(id, reason)
        setData(res as Detail);
        success("Solicitação rejeitada com sucesso.");
      }
      setRejectionMode(false);
    } catch (e: any) {
      const msg = e?.data?.detail || e?.message || "Não foi possível concluir a ação.";
      setActionErr(msg);
      error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const disablePrimaryActions = actionLoading || rejectionMode || replyMode;

  const isTokenRequest = 
    data?.category === 'token_request' || 
    (data?.subject && data.subject.toLowerCase().includes('token')) ||
    (!data?.category && data?.status === 'approved');

  const isContact = data?.category && ['doubt', 'suggestion', 'complaint'].includes(data.category);
  
  const canReply = !isTokenRequest && data?.status === 'open';

  if (err) return <div className={styles.error}>{err}</div>;
  if (!data) return <div className={styles.loading}>Carregando…</div>;

  const isDeletedUser =
    !!data.user_email && data.user_email.includes("deleted.local");

  const displayUserEmail = isDeletedUser
    ? data.user_email
    : data.user_email || data.email || "—";

  if (isAdmin) {
    return (
      <div className={styles.wrap}>
        <Toast />
        <h1 className={styles.title}>
          {isTokenManagement 
            ? "Detalhes do Token" 
            : data?.seq_id 
              ? `Solicitação #${data.seq_id}` 
              : "Solicitação"}
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
                <b>E-mail:</b> {displayUserEmail}
              </p>

              {isRequestManagement && (
                <>
                  <h3 className={styles.h3}>
                    {isContact ? categoryMap[data.category || ''] || "Mensagem" : "Mensagem do usuário"}
                  </h3>
                  <div className={styles.reasonBox} style={{marginTop: 8}}>{data.message || "—"}</div>
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
              {data.admin_reply && (
                <>
                   <h3 className={styles.h3Right}>Resposta enviada</h3>
                   <p className={styles.p} style={{fontSize:12, opacity:0.7}}>
                     Em: {data.replied_at ? new Date(data.replied_at).toLocaleString() : '-'}
                   </p>
                   <div className={styles.reasonBox} style={{borderColor:'var(--accent)'}}>
                     {data.admin_reply}
                   </div>
                   <div style={{marginBottom: 24}}></div>
                </>
              )}

              {isRequestManagement && isTokenRequest && data.status === "open" && (
                <>
                  {!rejectionMode && (
                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={disablePrimaryActions}
                        style={{...primaryButtonStyle, ...(disablePrimaryActions ? disabledButtonStyle : {})}}
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
                        style={{...dangerButtonStyle, ...(disablePrimaryActions ? disabledButtonStyle : {})}}
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {isRequestManagement && canReply && (
                <div style={{width: '100%'}}>
                  {!replyMode && (
                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyMode(true);
                          setActionErr("");
                        }}
                        disabled={disablePrimaryActions}
                        style={{...primaryButtonStyle, ...(disablePrimaryActions ? disabledButtonStyle : {})}}
                      >
                        Responder
                      </button>
                    </div>
                  )}

                  {replyMode && (
                    <>
                      <h3 className={styles.h3Right}>Enviar resposta</h3>
                      <textarea 
                        className={styles.reasonInput}
                        rows={6}
                        maxLength={4000}
                        placeholder="Escreva a resposta que será enviada por e-mail ao usuário..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                      <div className={styles.actionButtons}>
                        <button
                          type="button"
                          onClick={handleReplyContact}
                          disabled={actionLoading || !replyMessage.trim()}
                          style={{...primaryButtonStyle, ...(actionLoading ? disabledButtonStyle : {})}}
                        >
                          {actionLoading ? "Enviando..." : "Confirmar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (actionLoading) return;
                            setReplyMode(false);
                            setReplyMessage("");
                            setActionErr("");
                          }}
                          disabled={actionLoading}
                          style={{...neutralButtonStyle, ...(actionLoading ? disabledButtonStyle : {})}}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {isTokenManagement && data.status === "active" && (
                <>
                  {!rejectionMode && (
                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={() => {
                          if (actionLoading) return;
                          setRejectionMode(true);
                          setActionErr("");
                        }}
                        disabled={disablePrimaryActions}
                        style={{...dangerButtonStyle, ...(disablePrimaryActions ? disabledButtonStyle : {})}}
                      >
                        Revogar Token
                      </button>
                    </div>
                  )}
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
                      style={{...primaryButtonStyle, ...(actionLoading ? disabledButtonStyle : {})}}
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
                      style={{...neutralButtonStyle, ...(actionLoading ? disabledButtonStyle : {})}}
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

        <p className={styles.p}>
          <b>Origem da requisição:</b>{" "}
          {data.via_token ? "Token de API" : "Conta do usuário"}
        </p>

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
