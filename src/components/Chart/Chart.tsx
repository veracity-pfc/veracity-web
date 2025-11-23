import { JSX } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./Chart.module.css";

export type AdminMonthMetrics = {
  year: number;
  month: number;
  reference: string;
  analyses: {
    bars: {
      url_suspicious: number;
      url_safe: number;
      image_fake: number;
      image_safe: number;
    };
    totals: {
      total_month: number;
      urls_month: number;
      images_month: number;
    };
  };
  users: {
    bars: {
      active_users: number;
      inactive_users: number;
    };
    totals: {
      total_users: number;
      active_users: number;
      inactive_users: number;
    };
  };
  tokens: {
    bars: {
      active: number;
      expired: number;
      revoked: number;
    };
    totals: {
      total_tokens: number;
      active: number;
      revoked: number;
    };
  };
  requests: {
    bars: {
      doubt: number;
      suggestion: number;
      complaint: number;
      token_request: number;
    };
    totals: {
      total_requests: number;
      doubt: number;
      suggestion: number;
      complaint: number;
      token_request: number;
    };
  };
};

export type YM = {
  year: number;
  month: number;
};

type ChartMode = "analysis" | "users" | "tokens" | "requests";

interface Props {
  mode: ChartMode;
  metrics: AdminMonthMetrics | null;
  ym?: YM;
  loading: boolean;
  onChangeMonth?: (val: string) => void;
  onRefresh?: () => void;
}

const defaultAnalysisBars = { url_suspicious: 0, url_safe: 0, image_fake: 0, image_safe: 0 };
const defaultAnalysisTotals = { total_month: 0, urls_month: 0, images_month: 0 };

const defaultUsersBars = { active_users: 0, inactive_users: 0 };
const defaultUsersTotals = { total_users: 0, active_users: 0, inactive_users: 0 };

const defaultTokensBars = { active: 0, expired: 0, revoked: 0 };
const defaultTokensTotals = { total_tokens: 0, active: 0, revoked: 0 };

const defaultRequestsBars = { doubt: 0, suggestion: 0, complaint: 0, token_request: 0 };
const defaultRequestsTotals = { total_requests: 0, doubt: 0, suggestion: 0, complaint: 0, token_request: 0 };

export default function DashboardChart({ mode, metrics, loading }: Props): JSX.Element {
  let title = "";
  let data: any[] = [];
  let kpis: { label: string; value: number }[] = [];
  let colors: Record<string, string> = {};
  let labels: Record<string, string> = {};

  if (mode === "analysis") {
    title = "Análises Realizadas";
    const bars = metrics?.analyses?.bars || defaultAnalysisBars;
    const totals = metrics?.analyses?.totals || defaultAnalysisTotals;

    data = [
      { name: "URLs", susp: bars.url_suspicious, safe: bars.url_safe },
      { name: "Imagens", fake: bars.image_fake, safe: bars.image_safe },
    ];
    colors = { susp: "#f59e0b", fake: "#ef4444", safe: "#10b981" };
    labels = { susp: "Suspeitas", fake: "Falsas", safe: "Seguras" };
    
    kpis = [
      { label: "Total Mês", value: totals.total_month },
      { label: "URLs", value: totals.urls_month },
      { label: "Imagens", value: totals.images_month },
    ];

  } else if (mode === "users") {
    title = "Base de Usuários";
    const bars = metrics?.users?.bars || defaultUsersBars;
    const totals = metrics?.users?.totals || defaultUsersTotals;

    data = [
      { name: "Total", active: bars.active_users, inactive: bars.inactive_users },
    ];
    colors = { active: "#10b981", inactive: "#6b7280" };
    labels = { active: "Ativos", inactive: "Inativos" };

    kpis = [
      { label: "Total Usuários", value: totals.total_users },
      { label: "Ativos", value: totals.active_users },
      { label: "Inativos", value: totals.inactive_users },
    ];

  } else if (mode === "tokens") {
    title = "Tokens de API";
    const bars = metrics?.tokens?.bars || defaultTokensBars;
    const totals = metrics?.tokens?.totals || defaultTokensTotals;

    data = [
      { name: "Estado", active: bars.active, expired: bars.expired, revoked: bars.revoked },
    ];
    colors = { active: "#10b981", expired: "#f59e0b", revoked: "#ef4444" };
    labels = { active: "Ativos", expired: "Expirados", revoked: "Revogados" };

    kpis = [
      { label: "Total Tokens", value: totals.total_tokens },
      { label: "Ativos", value: totals.active },
      { label: "Revogados", value: totals.revoked },
    ];

  } else if (mode === "requests") {
    title = "Solicitações de Contato";
    const bars = metrics?.requests?.bars || defaultRequestsBars;
    const totals = metrics?.requests?.totals || defaultRequestsTotals;

    data = [
      { 
        name: "Tipos", 
        doubt: bars.doubt, 
        sugg: bars.suggestion, 
        complaint: bars.complaint, 
        token: bars.token_request 
      },
    ];
    colors = { doubt: "#3b82f6", sugg: "#f59e0b", complaint: "#ef4444", token: "#8b5cf6" };
    labels = { doubt: "Dúvidas", sugg: "Sugestões", complaint: "Reclamações", token: "Tokens" };

    kpis = [
      { label: "Total", value: totals.total_requests },
      { label: "Tokens", value: totals.token_request },
      { label: "Outros", value: (totals.doubt) + (totals.suggestion) + (totals.complaint) },
    ];
  }

  const dataKeys = Object.keys(colors);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>

      <div className={styles.kpiRow}>
        {kpis.map((k, i) => (
          <div key={i} className={styles.kpiItem}>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiValue}>{k.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.chartWrap}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#9ca3af" 
              fontSize={12} 
              width={60}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1b19",
                borderColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "8px"
              }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            
            {dataKeys.map((key) => (
              <Bar 
                key={key} 
                dataKey={key} 
                name={labels[key]} 
                stackId="a" 
                fill={colors[key]} 
                radius={[0, 4, 4, 0]} 
                barSize={32}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <div className={styles.legendRow}>
          {dataKeys.map((key) => (
            <div key={key} className={styles.legendItem}>
              <span 
                className={styles.legendColor} 
                style={{ backgroundColor: colors[key] }}
              />
              <span>{labels[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}