import { JSX, useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import Chart, { AdminMonthMetrics, YM } from "../../components/Chart/Chart";
import { getAdminMonthlyMetrics, getToken } from "../../api/client";
import { useToast } from "../../components/Toast/Toast";

function getCurrentYM(): YM {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function Dashboard(): JSX.Element {
  const { error, success } = useToast();
  
  const [ym, setYm] = useState<YM>(getCurrentYM());
  const [metrics, setMetrics] = useState<AdminMonthMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchMetrics = async (y: number, m: number) => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      const data = await getAdminMonthlyMetrics({ year: y, month: m, signal: ctrl.signal });
      setMetrics(data);
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
  }, [ym]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getToken()) fetchMetrics(ym.year, ym.month);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [ym]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    
    const [yearStr = "", monthStr = ""] = val.split("-");
    const y = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10);

    if (!isNaN(y) && !isNaN(m)) {
      setYm({ year: y, month: m });
    }
  };

  const dateValue = `${ym.year}-${String(ym.month).padStart(2, '0')}`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Visão geral da plataforma</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', background: '#10352f', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="month" 
              value={dateValue} 
              onChange={handleDateChange}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#fff', 
                padding: '10px 16px', 
                fontWeight: 'bold',
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none'
              }} 
            />
          </div>
          <button 
            onClick={() => {
              fetchMetrics(ym.year, ym.month);
              success("Dados atualizados");
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