import { JSX, useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import Chart, {
  AdminMonthMetrics,
  YM,
} from "../../components/Chart/Chart.tsx";
import { getAdminMonthlyMetrics, getToken } from "../../api/client.ts";
import { useToast } from "../../components/Toast/Toast.tsx";

function getCurrentYM(): YM {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function Dashboard(): JSX.Element {
  const { warn, error, success } = useToast();

  const [analysisYm, setAnalysisYm] = useState<YM>(getCurrentYM());
  const [usersYm, setUsersYm] = useState<YM>(getCurrentYM());

  const [analysisMetrics, setAnalysisMetrics] =
    useState<AdminMonthMetrics | null>(null);
  const [usersMetrics, setUsersMetrics] =
    useState<AdminMonthMetrics | null>(null);

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const [analysisFollowCurrent, setAnalysisFollowCurrent] = useState(true);
  const [usersFollowCurrent, setUsersFollowCurrent] = useState(true);

  const analysisAbortRef = useRef<AbortController | null>(null);
  const usersAbortRef = useRef<AbortController | null>(null);

  const analysisPeriodHuman = `${String(analysisYm.month).padStart(
    2,
    "0",
  )}/${analysisYm.year}`;
  const usersPeriodHuman = `${String(usersYm.month).padStart(
    2,
    "0",
  )}/${usersYm.year}`;

  const fetchAnalysisMetrics = async (
    y?: number,
    m?: number,
    successMsg?: string,
  ) => {
    try {
      const ySafe = Number(y ?? new Date().getFullYear());
      const mSafe = Number(m ?? new Date().getMonth() + 1);
      analysisAbortRef.current?.abort();
      const ctrl = new AbortController();
      analysisAbortRef.current = ctrl;
      setAnalysisLoading(true);
      const resp = (await getAdminMonthlyMetrics({
        year: ySafe,
        month: mSafe,
        signal: ctrl.signal,
      })) as AdminMonthMetrics;
      setAnalysisMetrics(resp);
      if (successMsg) success(successMsg);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      error(e?.message || "Erro ao carregar métricas de análises");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const fetchUsersMetrics = async (
    y?: number,
    m?: number,
    successMsg?: string,
  ) => {
    try {
      const ySafe = Number(y ?? new Date().getFullYear());
      const mSafe = Number(m ?? new Date().getMonth() + 1);
      usersAbortRef.current?.abort();
      const ctrl = new AbortController();
      usersAbortRef.current = ctrl;
      setUsersLoading(true);
      const resp = (await getAdminMonthlyMetrics({
        year: ySafe,
        month: mSafe,
        signal: ctrl.signal,
      })) as AdminMonthMetrics;
      setUsersMetrics(resp);
      if (successMsg) success(successMsg);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      error(e?.message || "Erro ao carregar métricas de usuários");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) return;
    fetchAnalysisMetrics(analysisYm.year, analysisYm.month);
    fetchUsersMetrics(usersYm.year, usersYm.month);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!getToken()) return;
      const current = getCurrentYM();

      if (analysisFollowCurrent) {
        if (
          analysisYm.year !== current.year ||
          analysisYm.month !== current.month
        ) {
          setAnalysisYm(current);
          fetchAnalysisMetrics(current.year, current.month);
        } else {
          fetchAnalysisMetrics(analysisYm.year, analysisYm.month);
        }
      } else {
        fetchAnalysisMetrics(analysisYm.year, analysisYm.month);
      }

      if (usersFollowCurrent) {
        if (usersYm.year !== current.year || usersYm.month !== current.month) {
          setUsersYm(current);
          fetchUsersMetrics(current.year, current.month);
        } else {
          fetchUsersMetrics(usersYm.year, usersYm.month);
        }
      } else {
        fetchUsersMetrics(usersYm.year, usersYm.month);
      }
    }, 300000);

    return () => window.clearInterval(id);
  }, [
    analysisYm.year,
    analysisYm.month,
    usersYm.year,
    usersYm.month,
    analysisFollowCurrent,
    usersFollowCurrent,
  ]);

  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "veracity_token" && getToken()) {
        fetchAnalysisMetrics(analysisYm.year, analysisYm.month);
        fetchUsersMetrics(usersYm.year, usersYm.month);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [analysisYm.year, analysisYm.month, usersYm.year, usersYm.month]);

  const handleAnalysisMonthChange = (value: string) => {
    if (!/^\d{4}-\d{2}$/.test(value)) {
      warn("Período inválido");
      return;
    }
    const [yyStr, mmStr] = value.split("-") as [string, string];
    const nextYm: YM = { year: Number(yyStr), month: Number(mmStr) };
    setAnalysisYm(nextYm);
    const current = getCurrentYM();
    const follow =
      nextYm.year === current.year && nextYm.month === current.month;
    setAnalysisFollowCurrent(follow);
    const human = `${mmStr}/${yyStr}`;
    fetchAnalysisMetrics(
      nextYm.year,
      nextYm.month,
      `Período do gráfico de análises alterado para ${human}`,
    );
  };

  const handleUsersMonthChange = (value: string) => {
    if (!/^\d{4}-\d{2}$/.test(value)) {
      warn("Período inválido");
      return;
    }
    const [yyStr, mmStr] = value.split("-") as [string, string];
    const nextYm: YM = { year: Number(yyStr), month: Number(mmStr) };
    setUsersYm(nextYm);
    const current = getCurrentYM();
    const follow =
      nextYm.year === current.year && nextYm.month === current.month;
    setUsersFollowCurrent(follow);
    const human = `${mmStr}/${yyStr}`;
    fetchUsersMetrics(
      nextYm.year,
      nextYm.month,
      `Período do gráfico de usuários alterado para ${human}`,
    );
  };

  const handleAnalysisRefresh = () => {
    fetchAnalysisMetrics(
      analysisYm.year,
      analysisYm.month,
      "Gráfico de análises atualizado",
    );
  };

  const handleUsersRefresh = () => {
    fetchUsersMetrics(
      usersYm.year,
      usersYm.month,
      "Gráfico de usuários atualizado",
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Visão geral das análises e usuários · Análises:{" "}
            {analysisPeriodHuman} · Usuários: {usersPeriodHuman}
          </p>
        </div>
      </header>

      <section className={styles.chartsSection}>
        <Chart
          mode="analysis"
          metrics={analysisMetrics}
          ym={analysisYm}
          loading={analysisLoading}
          onChangeMonth={handleAnalysisMonthChange}
          onRefresh={handleAnalysisRefresh}
        />

        <Chart
          mode="users"
          metrics={usersMetrics}
          ym={usersYm}
          loading={usersLoading}
          onChangeMonth={handleUsersMonthChange}
          onRefresh={handleUsersRefresh}
        />
      </section>
    </div>
  );
}
