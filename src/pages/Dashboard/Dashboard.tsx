import { JSX, useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import Chart,{YM} from "../../components/Chart/Chart";
import { getAdminMonthlyMetrics, getToken, AdminMonthMetrics } from "../../api/client";
import { useToast } from "../../components/Toast/Toast";

function getCurrentYM(): YM {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function Dashboard(): JSX.Element {
  const { error, success, warn } = useToast();
  
  const [ym, setYm] = useState<YM>(getCurrentYM());
  const [metrics, setMetrics] = useState<AdminMonthMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);

  const fetchMetrics = async (y: number, m: number, successMsg?: string) => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      const data = await getAdminMonthlyMetrics({ year: y, month: m, signal: ctrl.signal });
      setMetrics(data);
      if (successMsg) success(successMsg);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        error(e.message || "Erro ao carregar dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      fetchMetrics(ym.year, ym.month);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getToken()) fetchMetrics(ym.year, ym.month);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [ym]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      warn("Período inválido");
      return;
    }
    
    const [yearStr = "", monthStr = ""] = val.split("-");
    const y = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10);

    if (!y || !m || isNaN(y) || isNaN(m)) {
      warn("Período inválido");
      return;
    }

    const newYm = { year: y, month: m };
    setYm(newYm);
    const human = `${String(m).padStart(2, "0")}/${y}`;
    fetchMetrics(newYm.year, newYm.month, `Período alterado para ${human}`);
  };

  const dateValue = `${ym.year}-${String(ym.month).padStart(2, '0')}`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Visão geral da plataforma - Mensal</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            className={styles.monthControl}
            onClick={() => {
              const el = monthRef.current;
              if (!el) return;
              const anyEl = el as any;
              if (typeof anyEl.showPicker === "function") {
                anyEl.showPicker();
              } else {
                el.focus();
                el.click();
              }
            }}
          >
            <input 
              ref={monthRef}
              type="month" 
              value={dateValue} 
              onChange={handleDateChange}
              className={styles.monthInput}
              aria-label="Selecionar período"
            />
          </div>
          <button 
            onClick={() => {
              fetchMetrics(ym.year, ym.month, "Dados atualizados");
            }}
            disabled={loading}
            style={{
              background: '#0fb57f',
              border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </header>

      <section className={styles.chartsSection}>
        <div className={styles.gridContainer}>
          <Chart mode="analysis" metrics={metrics} loading={loading} ym={ym} />
          <Chart mode="users" metrics={metrics} loading={loading} ym={ym} />
          <Chart mode="tokens" metrics={metrics} loading={loading} ym={ym} />
          <Chart mode="requests" metrics={metrics} loading={loading} ym={ym} />
        </div>
      </section>
    </div>
  );
}
