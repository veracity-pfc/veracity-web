import { JSX, useEffect, useState } from "react";
import { apiAdminMetrics } from "../api/client";

interface Metrics {
  reference_month?: string;
  total_month?: number;
  urls_month?: number;
  images_month?: number;
  [k: string]: unknown;
}

export default function AdminDashboard(): JSX.Element {
  const [m, setM] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    apiAdminMetrics()
      .then(setM)
      .catch((e: any) => setErr(e?.message || "Erro ao carregar métricas"));
  }, []);

  if (err) return <p role="alert">{err}</p>;
  if (!m) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin • Métricas ({m.reference_month})</h2>
      <ul>
        <li>Total no mês: <b>{m.total_month}</b></li>
        <li>URLs no mês: <b>{m.urls_month}</b></li>
        <li>Imagens no mês: <b>{m.images_month}</b></li>
      </ul>
    </div>
  );
}
