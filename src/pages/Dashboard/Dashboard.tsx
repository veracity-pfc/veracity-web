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
import {
  getAdminMonthlyMetrics,
  AdminMonthMetrics,
  getToken,
} from "../../api/client";
import { useToast } from "../../components/Toast/Toast";
import styles from "./Dashboard.module.css";

type YM = { year: number; month: number };
type ChartRow = {
  name: string;
  url_suspicious: number;
  url_safe: number;
  image_fake: number;
  image_safe: number;
};

function getCurrentYM(): YM {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function Administration(): JSX.Element {
  const { warn, error, success } = useToast();

  const [ym, setYm] = useState<YM>(getCurrentYM());
  const [data, setData] = useState<AdminMonthMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const focusSinkRef = useRef<HTMLSpanElement>(null);

  const [pickerOpen, setPickerOpen] = useState(false);

  const safeYear = useMemo(
    () => Number(ym?.year ?? new Date().getFullYear()),
    [ym]
  );
  const safeMonth = useMemo(
    () => Number(ym?.month ?? new Date().getMonth() + 1),
    [ym]
  );

  const monthInputValue = useMemo(
    () => `${safeYear}-${String(safeMonth).padStart(2, "0")}`,
    [safeYear, safeMonth]
  );
  const periodHuman = useMemo(
    () => `${String(safeMonth).padStart(2, "0")}/${safeYear}`,
    [safeMonth, safeYear]
  );

  const chartData: ChartRow[] = useMemo(() => {
    const b = data?.bars;
    return [
      {
        name: "Mês",
        url_suspicious: Number(b?.url_suspicious ?? 0),
        url_safe: Number(b?.url_safe ?? 0),
        image_fake: Number(b?.image_fake ?? 0),
        image_safe: Number(b?.image_safe ?? 0),
      },
    ];
  }, [data]);

  const fetchMetrics = async (
    y?: number,
    m?: number,
    successMsg?: string
  ) => {
    try {
      const ySafe = Number(y ?? new Date().getFullYear());
      const mSafe = Number(m ?? new Date().getMonth() + 1);
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      const resp = await getAdminMonthlyMetrics({
        year: ySafe,
        month: mSafe,
        signal: ctrl.signal,
      });
      setData(resp);
      if (successMsg) success(successMsg);
    } catch (e: any) {
      error(e?.message || "Erro ao carregar métricas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) fetchMetrics(safeYear, safeMonth);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (getToken()) fetchMetrics(safeYear, safeMonth);
    }, 300000);
    return () => window.clearInterval(id);
  }, [safeYear, safeMonth]);

  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key) return;
      if (ev.key === "veracity_token" && getToken()) {
        fetchMetrics(safeYear, safeMonth);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [safeYear, safeMonth]);

  const onChangeMonth = (v: string) => {
    if (!/^\d{4}-\d{2}$/.test(v)) {
      warn("Período inválido");
      return;
    }
    const [yyStr, mmStr] = v.split("-") as [string, string];
    const newYM = { year: Number(yyStr), month: Number(mmStr) };
    setYm(newYM);
    const human = `${mmStr}/${yyStr}`;
    fetchMetrics(newYM.year, newYM.month, `Período alterado para ${human}`);
    closeMonthPicker();
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

  const onRefresh = () => fetchMetrics(safeYear, safeMonth, "Gráfico atualizado");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Administração</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardTitle}>
              Total de análises (mês atual/ano atual)
            </p>
            <p className={styles.subtle}>
              Período selecionado:{" "}
              <b>
                {data
                  ? `${String(data.month).padStart(2, "0")}/${data.year}`
                  : periodHuman}
              </b>
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
                onChange={(e) => onChangeMonth(e.target.value)}
                aria-label="Selecione o mês"
              />
              <span ref={focusSinkRef} tabIndex={-1} className={styles.focusSink} />
            </div>

            <button
              className={styles.btn}
              onClick={onRefresh}
              disabled={loading}
              aria-label="Atualizar gráfico"
              type="button"
            >
              {loading ? "Atualizando..." : "Atualizar gráfico"}
            </button>
          </div>
        </div>

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
              <Bar dataKey="url_suspicious" name="URL suspeita" fill="#008b54ff" />
              <Bar dataKey="url_safe" name="URL segura" fill="#6ab997ff" />
              <Bar dataKey="image_fake" name="Imagem falsa" fill="#029777ff" />
              <Bar dataKey="image_safe" name="Imagem segura" fill="#b7ecd6ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.totals}>
          <span>
            Total do mês: <b>{Number(data?.totals.total_month ?? 0)}</b>
          </span>
          <span>
            URLs: <b>{Number(data?.totals.urls_month ?? 0)}</b>
          </span>
          <span>
            Imagens: <b>{Number(data?.totals.images_month ?? 0)}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
