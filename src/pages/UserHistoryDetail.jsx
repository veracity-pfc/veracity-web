import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function UserHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`/user/history/${id}`, { auth: true });
        setData(res);
      } catch (e) {
        setErr("Não foi possível carregar a análise.");
      }
    })();
  }, [id]);

  if (err) {
    return <div className="">{err}</div>;
  }
  if (!data) {
    return <div className="">Carregando…</div>;
  }

  const labelMap = {
    safe: "Seguro",
    suspicious: "Suspeito",
    malicious: "Malicioso",
    fake: "Possivelmente falsificado ou fraudulento",
    unknown: "Desconhecido",
  };

  return (
    <div className="">
      <button
        className=""
        onClick={() => navigate(-1)}
      >
        ⟵ Voltar
      </button>

      <div className="">
        <p className="">
          <b>Data da análise:</b> {new Date(data.created_at).toLocaleDateString()}
        </p>
        {data.analysis_type === "image" ? (
          <p className=""><b>Imagem:</b> {data.source || "—"}</p>
        ) : (
          <p className=""><b>URL:</b> {data.source || "—"}</p>
        )}

        <h3 className="">Resultado da análise</h3>
        <p className=""><b>Status:</b> {labelMap[data.label] || data.label}</p>

        <h3 className="">Análise técnica</h3>
        <div className="">
          {data.ai_summary || "—"}
        </div>

        {Array.isArray(data.ai_recommendations) && data.ai_recommendations.length > 0 && (
          <>
            <h3 className="">Recomendações</h3>
            <ul className="">
              {data.ai_recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
