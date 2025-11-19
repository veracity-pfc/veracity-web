import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, getRole } from "../../api/client";
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

export default function HistoryDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Detail | null>(null);
  const [err, setErr] = useState("");

  const role = getRole();
  const isAdmin = role === "admin";

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const path = isAdmin
          ? `/administration/api/token-requests/${id}`
          : `/administration/history/${id}`;
        const res = (await apiFetch(path, {
          auth: true,
        })) as Detail;
        setData(res);
      } catch {
        setErr(
          isAdmin
            ? "Não foi possível carregar a solicitação."
            : "Não foi possível carregar a análise."
        );
      }
    })();
  }, [id, isAdmin]);

  if (err) return <div className={styles.error}>{err}</div>;
  if (!data) return <div className={styles.loading}>Carregando…</div>;

  if (isAdmin) {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Solicitações de token de API</h1>
        <button className={styles.back} onClick={() => navigate(-1)}>
          Voltar
        </button>

        <div className={styles.panel}>
          <p className={styles.p}>
            <b>Data da solicitação:</b>{" "}
            {new Date(data.created_at).toLocaleString()}
          </p>
          <h3 className={styles.h3}>Usuário solicitante</h3>
          <p className={styles.p}>
            <b>E-mail:</b> {data.email || "—"}
          </p>
          <h3 className={styles.h3}>Mensagem do usuário</h3>
          <div className={styles.p}>{data.message || "—"}</div>

          <h3 className={styles.h3}>Status da solicitação</h3>
          <p className={styles.p}>
            {requestStatusMap[data.status || ""] || data.status || "Desconhecido"}
          </p>

          {data.status === "rejected" && data.rejection_reason && (
            <>
              <h3 className={styles.h3}>Motivo da rejeição</h3>
              <div className={styles.p}>{data.rejection_reason}</div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
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
