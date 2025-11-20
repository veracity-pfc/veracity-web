import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getRole } from "../../api/client";
import Filter from "../../components/Filter/Filter";
import Toast, { useToast } from "../../components/Toast/Toast";
import styles from "./History.module.css";

type Item = {
  id: string;
  created_at: string;
  analysis_type?: "url" | "image" | string;
  source?: string;
  label?: string;
  email?: string;
  message_preview?: string;
  status?: string;
};

type Paged = {
  items: Item[];
  total_pages: number;
};

function onlyDate(value: string): string {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return value.slice(0, 10);
  }
}

const analysisLabelMap: Record<string, string> = {
  safe: "Seguro",
  suspicious: "Suspeito",
  malicious: "Malicioso",
  fake: "Falso",
  unknown: "Desconhecido",
};

const requestStatusMap: Record<string, string> = {
  open: "Em aberto",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

export default function History(): JSX.Element {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [atype, setAtype] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const requestSeq = useRef(0);
  const role = getRole();
  const isAdmin = role === "admin";
  const { error } = useToast();

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    p.set("page_size", "6");

    if (isAdmin) {
      if (q) p.set("email", q);
    } else {
      if (q) p.set("q", q);
      if (atype) p.set("analysis_type", atype);
    }

    if (status) p.set("status", status);

    const from = onlyDate(dateFrom);
    const to = onlyDate(dateTo);

    if (from && !to) {
      p.set("date_from", from);
    } else if (to && !from) {
      p.set("date_to", to);
    } else if (from && to) {
      const f = new Date(from + "T00:00:00Z").getTime();
      const t = new Date(to + "T00:00:00Z").getTime();
      if (t < f) {
        p.set("date_from", to);
        p.set("date_to", to);
      } else {
        p.set("date_from", from);
        p.set("date_to", to);
      }
    }
    return p.toString();
  }, [page, q, status, atype, dateFrom, dateTo, isAdmin]);

  async function load() {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const path = isAdmin
        ? `/administration/api/token-requests?${params}`
        : `/user/history?${params}`;
      const data = (await apiFetch(path, { auth: true })) as Paged;
      if (seq !== requestSeq.current) return;
      setItems(data.items);
      setTotalPages(data.total_pages);
    } catch (e: any) {
      if (seq !== requestSeq.current) return;
      setItems([]);
      setTotalPages(1);
      error(e?.message || "Erro ao carregar dados.");
    } finally {
      if (seq !== requestSeq.current) return;
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [params]);

  function Card({ item }: { item: Item }) {
    if (isAdmin) {
      return (
        <div
          className={styles.card}
          style={{ minHeight: "160px", maxHeight: "160px", overflow: "hidden" }}
          onClick={() => navigate(`/request/${item.id}`)}
        >
          <p className={styles.meta}>
            <b>Data da solicitação:</b>{" "}
            {new Date(item.created_at).toLocaleString()}
          </p>
          <p className={styles.meta}>
            <b>E-mail:</b>{" "}
            <span className={styles.ellipsis}>{item.email || "—"}</span>
          </p>
          <p
            className={styles.meta}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <b style={{ flexShrink: 0 }}>Mensagem:</b>
            <span
              className={styles.ellipsis}
              style={{
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.message_preview || "—"}
            </span>
          </p>
          <p className={styles.meta}>
            <b>Status:</b>{" "}
            {requestStatusMap[item.status || ""] ||
              item.status ||
              "Desconhecido"}
          </p>
        </div>
      );
    }

    return (
      <div
        className={styles.card}
        onClick={() => navigate(`/user/history/${item.id}`)}
      >
        <p className={styles.meta}>
          <b>Data da análise:</b>{" "}
          {new Date(item.created_at).toLocaleDateString()}
        </p>

        {item.analysis_type === "image" ? (
          <p className={styles.meta}>
            <b>Imagem:</b>{" "}
            <span className={styles.ellipsis}>{item.source || "—"}</span>
          </p>
        ) : (
          <p className={styles.meta}>
            <b>URL:</b>{" "}
            <span className={styles.ellipsis}>{item.source || "—"}</span>
          </p>
        )}

        <p className={styles.meta}>
          <b>Status:</b>{" "}
          {analysisLabelMap[item.label || ""] ||
            item.label ||
            "Desconhecido"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Toast />
      <h1 className={styles.title}>
        {isAdmin ? "Solicitações de token de API" : "Histórico de análises"}
      </h1>

      <div className={styles.searchRow}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.search}
          placeholder={
            isAdmin
              ? "Buscar por e-mail do usuário"
              : "Buscar por URL ou nome da imagem"
          }
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <button
          type="button"
          className={styles.clearBtn}
          aria-label="Limpar busca"
          onClick={() => {
            setQ("");
            setPage(1);
          }}
          title="Limpar"
          disabled={!q || loading}
        >
          ×
        </button>
        <button
          className={styles.filterBtn}
          onClick={() => setFiltersOpen(true)}
        >
          Filtros
        </button>
      </div>

      <div className={styles.stage}>
        {loading ? (
          <div className={styles.loading}>Carregando…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            {isAdmin
              ? "Nenhuma solicitação disponível para visualização."
              : "Nenhuma análise disponível para visualização."}
          </div>
        ) : (
          <div
            className={`${styles.grid} ${
              items.length === 1 ? styles.gridSingle : ""
            }`}
          >
            {items.map((it) => (
              <Card key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.pag}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          />
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          />
        </div>
      )}

      <Filter
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        dateFrom={dateFrom}
        dateTo={dateTo}
        status={status}
        atype={atype}
        onChangeDateFrom={(v) => {
          setPage(1);
          const from = onlyDate(v);
          const to = onlyDate(dateTo);
          if (to && from && new Date(from).getTime() > new Date(to).getTime()) {
            setDateTo(from);
          }
          setDateFrom(from);
        }}
        onChangeDateTo={(v) => {
          setPage(1);
          const to = onlyDate(v);
          const from = onlyDate(dateFrom);
          if (from && to && new Date(to).getTime() < new Date(from).getTime()) {
            setDateFrom(to);
          }
          setDateTo(to);
        }}
        onChangeStatus={(v) => {
          setPage(1);
          setStatus(v);
        }}
        onChangeType={(v) => {
          setPage(1);
          setAtype(v);
        }}
        onApply={() => setFiltersOpen(false)}
        onClear={() => {
          setDateFrom("");
          setDateTo("");
          setStatus("");
          setAtype("");
        }}
        showStatus
        showType={!isAdmin}
        statusOptions={
          isAdmin
            ? [
                { value: "", label: "Todos" },
                { value: "open", label: "Em aberto" },
                { value: "approved", label: "Aprovada" },
                { value: "rejected", label: "Rejeitada" },
              ]
            : undefined
        }
      />
    </div>
  );
}
