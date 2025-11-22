import type React from "react";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./Chart.module.css";

export type YM = { year: number; month: number };

type ChartRow = {
  name: string;
  url_suspicious: number;
  url_safe: number;
  image_fake: number;
  image_safe: number;
};

type UsersChartRow = {
  name: string;
  active_users: number;
  inactive_users: number;
};

type TokensChartRow = {
  name: string;
  active: number;
  expired: number;
  revoked: number;
};

type RequestsChartRow = {
  name: string;
  doubt: number;
  suggestion: number;
  token_request: number;
  complaint: number;
};

export type AdminUserMetrics = {
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

export type AdminTokenMetrics = {
  bars: {
    active: number;
    expired: number;
    revoked: number;
  };
  totals: {
    total: number;
    active: number;
    expired: number;
    revoked: number;
  };
};

export type AdminRequestMetrics = {
  bars: {
    doubt: number;
    suggestion: number;
    token_request: number;
    complaint: number;
  };
  totals: {
    total: number;
  };
};

export type AdminMonthMetrics = {
  year: number;
  month: number;
  reference: string;
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
  users?: AdminUserMetrics;
  tokens?: AdminTokenMetrics;
  requests?: AdminRequestMetrics; 
};

type DashboardChartProps = {
  mode: "analysis" | "users" | "tokens" | "requests";
  metrics: AdminMonthMetrics | null;
  ym: YM;
  loading: boolean;
  onChangeMonth: (value: string) => void;
  onRefresh: () => void;
};

export default function DashboardChart({
  mode,
  metrics,
  ym,
  loading,
  onChangeMonth,
  onRefresh,
}: DashboardChartProps): JSX.Element {
  const monthRef = useRef<HTMLInputElement>(null);
  const focusSinkRef = useRef<HTMLSpanElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const year = ym.year;
  const month = ym.month;

  const monthInputValue = `${year}-${String(month).padStart(2, "0")}`;
  const periodHuman = `${String(month).padStart(2, "0")}/${year}`;

  const chartData: Array<ChartRow | UsersChartRow | TokensChartRow | RequestsChartRow> = useMemo(() => {
    if (mode === "analysis") {
      const bars = metrics?.bars;
      return [
        {
          name: "Mês",
          url_suspicious: Number(bars?.url_suspicious ?? 0),
          url_safe: Number(bars?.url_safe ?? 0),
          image_fake: Number(bars?.image_fake ?? 0),
          image_safe: Number(bars?.image_safe ?? 0),
        },
      ];
    }
    if (mode === "users") {
      const bars = metrics?.users?.bars;
      return [
        {
          name: "Mês",
          active_users: Number(bars?.active_users ?? 0),
          inactive_users: Number(bars?.inactive_users ?? 0),
        },
      ];
    }
    if (mode === "tokens") {
      const bars = metrics?.tokens?.bars;
      return [
        {
          name: "Mês",
          active: Number(bars?.active ?? 0),
          expired: Number(bars?.expired ?? 0),
          revoked: Number(bars?.revoked ?? 0),
        },
      ];
    }
    const bars = metrics?.requests?.bars;
    return [
        {
            name: "Mês",
            doubt: Number(bars?.doubt ?? 0),
            suggestion: Number(bars?.suggestion ?? 0),
            token_request: Number(bars?.token_request ?? 0),
            complaint: Number(bars?.complaint ?? 0),
        }
    ];
  }, [metrics, mode]);

  const analysisTotals = {
    totalMonth: Number(metrics?.totals.total_month ?? 0),
    urlsMonth: Number(metrics?.totals.urls_month ?? 0),
    imagesMonth: Number(metrics?.totals.images_month ?? 0),
  };

  const userTotals = {
    totalUsers: Number(metrics?.users?.totals.total_users ?? 0),
    activeUsers: Number(metrics?.users?.totals.active_users ?? 0),
    inactiveUsers: Number(metrics?.users?.totals.inactive_users ?? 0),
  };

  const tokenTotals = {
    total: Number(metrics?.tokens?.totals.total ?? 0),
    active: Number(metrics?.tokens?.totals.active ?? 0),
    expired: Number(metrics?.tokens?.totals.expired ?? 0),
    revoked: Number(metrics?.tokens?.totals.revoked ?? 0),
  };

  const requestBars = metrics?.requests?.bars;
  const requestTotals = {
      total: Number(metrics?.requests?.totals.total ?? 0),
      doubt: Number(requestBars?.doubt ?? 0),
      suggestion: Number(requestBars?.suggestion ?? 0),
      token_request: Number(requestBars?.token_request ?? 0),
      complaint: Number(requestBars?.complaint ?? 0),
  };

  const closeMonthPicker = () => {
    const el = monthRef.current;
    if (!el) return;
    try {
      const esc = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      el.dispatchEvent(esc);
    } catch {}
    el.blur();
    setPickerOpen(false);
    focusSinkRef.current?.focus();
    setTimeout(() => focusSinkRef.current?.blur(), 0);
  };

  const openMonthPicker = () => {
    const el = monthRef.current;
    if (!el) return;
    (el as any).showPicker?.();
    if (document.activeElement !== el) el.focus();
    el.click();
    setPickerOpen(true);
  };

  const toggleMonthPicker = () => {
    if (pickerOpen) {
      closeMonthPicker();
    } else {
      openMonthPicker();
    }
  };

  useEffect(() => {
    const el = monthRef.current;
    if (!el) return;
    const onBlur = () => setPickerOpen(false);
    const onFocus = () => setPickerOpen(true);
    el.addEventListener("blur", onBlur);
    el.addEventListener("focus", onFocus);
    return () => {
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("focus", onFocus);
    };
  }, []);

  const onMonthKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMonthPicker();
    }
  };

  const handleMonthChange = (value: string) => {
    onChangeMonth(value);
    closeMonthPicker();
  };

  const selectedPeriod =
    metrics && metrics.month && metrics.year
      ? `${String(metrics.month).padStart(2, "0")}/${metrics.year}`
      : periodHuman;

  let title = "";
  let buttonAria = "";

  if (mode === "analysis") {
    title = "Total de análises (mês atual/ano atual)";
    buttonAria = "Atualizar gráfico de análises";
  } else if (mode === "users") {
    title = "Usuários na plataforma (mês atual/ano atual)";
    buttonAria = "Atualizar gráfico de usuários";
  } else if (mode === "tokens") {
    title = "Tokens de API criados (mês atual/ano atual)";
    buttonAria = "Atualizar gráfico de tokens";
  } else {
    title = "Solicitações recebidas (mês atual/ano atual)";
    buttonAria = "Atualizar gráfico de solicitações";
  }

  const renderKpis = () => {
    if (mode === "analysis") {
      return (
        <div className={styles.kpiRow}>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Análises no mês</span>
            <span className={styles.kpiValue}>{analysisTotals.totalMonth}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>URLs analisadas</span>
            <span className={styles.kpiValue}>{analysisTotals.urlsMonth}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Imagens analisadas</span>
            <span className={styles.kpiValue}>{analysisTotals.imagesMonth}</span>
          </div>
        </div>
      );
    }
    if (mode === "users") {
      return (
        <div className={styles.kpiRow}>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Total de usuários</span>
            <span className={styles.kpiValue}>{userTotals.totalUsers}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Usuários ativos</span>
            <span className={styles.kpiValue}>{userTotals.activeUsers}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Usuários inativos</span>
            <span className={styles.kpiValue}>{userTotals.inactiveUsers}</span>
          </div>
        </div>
      );
    }
    if (mode === "tokens") {
      return (
        <div className={styles.kpiRow}>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Total de tokens</span>
            <span className={styles.kpiValue}>{tokenTotals.total}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Ativos</span>
            <span className={styles.kpiValue}>{tokenTotals.active}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Revogados</span>
            <span className={styles.kpiValue}>{tokenTotals.revoked}</span>
          </div>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Expirados</span>
            <span className={styles.kpiValue}>{tokenTotals.expired}</span>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.kpiRow}>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Total de solicitações</span>
          <span className={styles.kpiValue}>{requestTotals.total}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Dúvidas</span>
          <span className={styles.kpiValue}>{requestTotals.doubt}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Sugestões</span>
          <span className={styles.kpiValue}>{requestTotals.suggestion}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Tokens</span>
          <span className={styles.kpiValue}>{requestTotals.token_request}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Reclamações</span>
          <span className={styles.kpiValue}>{requestTotals.complaint}</span>
        </div>
      </div>
    );
  };

  const renderBars = () => {
    if (mode === "analysis") {
      return (
        <>
          <Bar dataKey="url_suspicious" name="URL suspeita" fill="#008b54ff" />
          <Bar dataKey="url_safe" name="URL segura" fill="#6ab997ff" />
          <Bar dataKey="image_fake" name="Imagem falsa" fill="#029777ff" />
          <Bar dataKey="image_safe" name="Imagem segura" fill="#b7ecd6ff" />
        </>
      );
    }
    if (mode === "users") {
      return (
        <>
          <Bar dataKey="active_users" name="Usuários ativos" fill="#6ab997ff" />
          <Bar
            dataKey="inactive_users"
            name="Usuários inativos"
            fill="#008b54ff"
          />
        </>
      );
    }
    if (mode === "tokens") {
      return (
        <>
          <Bar dataKey="active" name="Ativos" fill="#6ab997ff" />
          <Bar dataKey="revoked" name="Revogados" fill="#008b54ff" />
          <Bar dataKey="expired" name="Expirados" fill="#029777ff" />
        </>
      );
    }
    return (
      <>
        <Bar dataKey="doubt" name="Dúvidas" fill="#008b54ff" />
        <Bar dataKey="suggestion" name="Sugestões" fill="#6ab997ff" />
        <Bar dataKey="token_request" name="Solic. Token" fill="#029777ff" />
        <Bar dataKey="complaint" name="Reclamações" fill="#b7ecd6ff" />
      </>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardTitle}>{title}</p>
          <p className={styles.subtle}>
            Período selecionado: <b>{selectedPeriod}</b>
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.monthControl} aria-label="Alterar período">
            <div
              className={styles.monthButton}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              onClick={toggleMonthPicker}
              onKeyDown={onMonthKey}
            >
              {periodHuman}
              <span className={styles.monthIcon} aria-hidden="true" />
            </div>
            <input
              ref={monthRef}
              className={styles.monthNative}
              type="month"
              value={monthInputValue}
              onChange={(e) => handleMonthChange(e.target.value)}
              aria-label="Selecione o mês"
            />
            <span
              ref={focusSinkRef}
              tabIndex={-1}
              className={styles.focusSink}
            />
          </div>

          <button
            className={styles.btn}
            onClick={onRefresh}
            disabled={loading}
            aria-label={buttonAria}
            type="button"
          >
            {loading ? "Atualizando..." : "Atualizar gráfico"}
          </button>
        </div>
      </div>

      {renderKpis()}

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.25)"
            />
            <XAxis dataKey="name" tick={{ fill: "#dff7f0" }} />
            <YAxis allowDecimals={false} tick={{ fill: "#dff7f0" }} />
            <Tooltip
              contentStyle={{
                background: "#0f1b19",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#dff7f0",
              }}
              labelStyle={{ color: "#dff7f0", fontWeight: 700 }}
              formatter={(value: number, name: string) => [value, name]}
              labelFormatter={() => "Mês"}
            />
            <Legend wrapperStyle={{ color: "#fff" }} />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}