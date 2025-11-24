import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  message?: string;
  status?: string;
  token_prefix?: string;
  user_email?: string;
  expires_at?: string;
  category?: string;
  subject?: string;
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
  answered: "Respondida",
  finished: "Encerrada",
};

const tokenStatusMap: Record<string, string> = {
  active: "Ativo",
  revoked: "Revogado",
  expired: "Expirado",
};

const categoryMap: Record<string, string> = {
  doubt: "Dúvida",
  suggestion: "Sugestão",
  complaint: "Reclamação",
  token_request: "Solicitação de Token",
};

export default function History(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isTokenManagement = location.pathname.startsWith("/tokens");
  const isRequestManagement = location.pathname.startsWith("/requests");

  const { error } = useToast();

  useEffect(() => {
    setPage(1);
    setQ("");
    setStatus("");
    setAtype("");
    setDateFrom("");
    setDateTo("");
  }, [location.pathname]);

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

    if (isRequestManagement && atype) {
      p.set("category", atype);
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
  }, [page, q, status, atype, dateFrom, dateTo, isAdmin, isRequestManagement]);

  async function load(currentParams: string) {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      let path = "";
      if (isTokenManagement) {
        path = `/v1/administration/api/tokens?${currentParams}`;
      } else if (isRequestManagement) {
        path = `/v1/administration/contact-requests?${currentParams}`;
      } else {
        path = `/v1/user/history?${currentParams}`;
      }

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
    load(params);
  }, [params, location.pathname]);

  function getTitle() {
    if (isTokenManagement) return "Gestão de Tokens";
    if (isRequestManagement) return "Solicitações recebidas";
    return "Histórico de análises";
  }

  function getPlaceholder() {
    if (isTokenManagement) return "Buscar por e-mail";
    if (isRequestManagement) return "Buscar por e-mail";
    return "Buscar por URL ou nome da imagem";
  }

  function getStatusOptions() {
    if (isTokenManagement) {
      return [
        { value: "", label: "Todos" },
        { value: "active", label: "Ativo" },
        { value: "revoked", label: "Revogado" },
        { value: "expired", label: "Expirado" },
      ];
    }
    if (isRequestManagement) {
      return [
        { value: "", label: "Todos" },
        { value: "open", label: "Em aberto" },
        { value: "answered", label: "Respondida" },
        { value: "approved", label: "Aprovada" },
        { value: "rejected", label: "Rejeitada" },
      ];
    }
    return undefined;
  }

  function getTypeOptions() {
    if (isRequestManagement) {
      return [
        { value: "", label: "Todos" },
        { value: "doubt", label: "Dúvida" },
        { value: "suggestion", label: "Sugestão" },
        { value: "complaint", label: "Reclamação" },
        { value: "token_request", label: "Solicitação de Token API" },
      ];
    }
    return [
      { value: "", label: "Todos" },
      { value: "url", label: "URL" },
      { value: "image", label: "Imagem" },
    ];
  }

  function Card({ item }: { item: Item }) {
    if (isTokenManagement) {
      return (
        <div
          className={styles.card}
          style={{ minHeight: "160px", maxHeight: "160px", overflow: "hidden" }}
          onClick={() => navigate(`/tokens/${item.id}`)}
        >
          <p className={styles.meta}>
            <b>Criado em:</b>{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>
          <p className={styles.meta} style={{ whiteSpace: "nowrap" }}>
            <b>Usuário:</b>{" "}
            <span className={styles.ellipsis}>{item.user_email || "—"}</span>
          </p>
          <p className={styles.meta}>
            <b>Token:</b>{" "}
            <span style={{ fontFamily: "monospace" }}>
              {item.token_prefix}•••••
            </span>
          </p>
          <p className={styles.meta}>
            <b>Status:</b>{" "}
            {tokenStatusMap[item.status || ""] || item.status || "Desconhecido"}
          </p>
        </div>
      );
    }

    if (isRequestManagement) {
      const categoryLabel =
        categoryMap[item.category || ""] || item.category || "Geral";

      const isDeletedUser =
        !!item.user_email && item.user_email.endsWith("@deleted.local.com");

      const displayEmail = isDeletedUser
        ? item.user_email
        : item.user_email || item.email || "—";

      return (
        <div
          className={styles.card}
          style={{ minHeight: "160px", maxHeight: "160px", overflow: "hidden" }}
          onClick={() => navigate(`/requests/${item.id}`)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <span className={styles.tag}>
              <b>{categoryLabel}</b>
            </span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className={styles.meta} style={{ marginTop: 8 }}>
            <b>De:</b>{" "}
            <span className={styles.ellipsis}>{displayEmail}</span>
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
      <h1 className={styles.title}>{getTitle()}</h1>

      <div className={styles.searchRow}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.search}
            placeholder={getPlaceholder()}
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

        {(isTokenManagement || isRequestManagement) && (
          <button
            className={styles.updateBtn}
            onClick={() => load(params)}
            disabled={loading}
            title="Atualizar lista"
          >
            Atualizar
          </button>
        )}
      </div>

      <div className={styles.stage}>
        {loading ? (
          <div className={styles.loading}>Carregando…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>Nenhum registro encontrado.</div>
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
        showType={!isAdmin || isRequestManagement}
        statusOptions={getStatusOptions()}
        typeOptions={getTypeOptions()}
      />
    </div>
  );
}
