import { useEffect, useState } from "react";
import { apiAdminMetrics } from "../api/client";

export default function AdminDashboard() {
  const [m, setM] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiAdminMetrics()
      .then(setM)
      .catch(e => setErr(e.message || "Erro ao carregar métricas"));
  }, []);

  if (err) return <p role="alert">{err}</p>;
  if (!m) return <p>Carregando...</p>;

  return (
    <div style={{padding:16}}>
      <h2>Admin • Métricas ({m.reference_month})</h2>
      <ul>
        <li>Total no mês: <b>{m.total_month}</b></li>
        <li>URLs no mês: <b>{m.urls_month}</b></li>
        <li>Imagens no mês: <b>{m.images_month}</b></li>
      </ul>
    </div>
  );
}
