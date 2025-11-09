import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api/client";
import styles from "./UserHistoryDetail.module.css";

type Detail = {
  id: string;
  created_at: string;
  analysis_type: "url" | "image" | string;
  source?: string;
  label: string;
  ai_summary?: string;
  ai_recommendations?: string[];
};

export default function UserHistoryDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Detail | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = (await apiFetch(`/user/history/${id}`, { auth: true })) as Detail;
        setData(res);
      } catch {
        setErr("Não foi possível carregar a análise.");
      }
    })();
  }, [id]);

  if (err) return <div className={styles.error}>{err}</div>;
  if (!data) return <div className={styles.loading}>Carregando…</div>;

  const labelMap: Record<string, string> = {
    safe: "Seguro",
    suspicious: "Suspeito",
    malicious: "Malicioso",
    fake: "Possivelmente falsificado ou fraudulento",
    unknown: "Desconhecido",
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Histórico</h1>
      <button className={styles.back} onClick={() => navigate(-1)}>Voltar</button>

      <div className={styles.panel}>
        <p className={styles.p}>
          <b>Data da análise:</b> {new Date(data.created_at).toLocaleDateString()}
        </p>
        {data.analysis_type === "image" ? (
          <p className={styles.p}><b>Imagem:</b> {data.source || "—"}</p>
        ) : (
          <p className={styles.p}><b>URL:</b> {data.source || "—"}</p>
        )}

        <h3 className={styles.h3}>Resultado da análise</h3>
        <p className={styles.p}><b>Status:</b> {labelMap[data.label] || data.label}</p>

        <h3 className={styles.h3}>Análise técnica</h3>
        <div className={styles.p}>{data.ai_summary || "—"}</div>

        {Array.isArray(data.ai_recommendations) && data.ai_recommendations.length > 0 && (
          <>
            <h3 className={styles.h3}>Recomendações</h3>
            <ul className={styles.ul}>
              {data.ai_recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
