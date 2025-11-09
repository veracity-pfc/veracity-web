import { JSX, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import Filter from "../../components/Filter/Filter";
import styles from "./UserHistory.module.css";

type Item = {
  id: string;
  created_at: string;
  analysis_type: "url" | "image" | string;
  source?: string;
  label: string;
};

type Paged = {
  items: Item[];
  total_pages: number;
};

export default function UserHistory(): JSX.Element {
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

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    p.set("page_size", "6");
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (atype) p.set("analysis_type", atype);
    if (dateFrom) p.set("date_from", new Date(dateFrom).toISOString());
    if (dateTo) p.set("date_to", new Date(dateTo).toISOString());
    return p.toString();
  }, [page, q, status, atype, dateFrom, dateTo]);

  async function load() {
    setLoading(true);
    try {
      const data = (await apiFetch(`/user/history?${params}`, { auth: true })) as Paged;
      setItems(data.items);
      setTotalPages(data.total_pages);
    } catch {
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [params]);

  function Card({ item }: { item: Item }) {
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
          <p className={styles.meta}><b>Imagem:</b> {item.source || "—"}</p>
        ) : (
          <p className={styles.meta}><b>URL:</b> {item.source || "—"}</p>
        )}
        <p className={styles.meta}>
          <b>Status:</b>{" "}
          {item.label === "safe" ? "Seguro" :
           item.label === "suspicious" ? "Suspeito" :
           item.label === "malicious" ? "Malicioso" :
           item.label === "fake" ? "Falso" : "Desconhecido"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Histórico</h1>

      <div className={styles.searchRow}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.search}
          placeholder="Buscar por URL, imagem ou status…"
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
        />
        <button className={styles.filterBtn} onClick={() => setFiltersOpen(true)}>Filtros</button>
      </div>

      <div className={styles.stage}>
        {loading ? (
          <div className={styles.loading}>Carregando…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>Nenhuma análise disponível para visualização.</div>
        ) : (
          <div className={`${styles.grid} ${items.length === 1 ? styles.gridSingle : ""}`}>
            {items.map((it) => <Card key={it.id} item={it} />)}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.pag}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ◄
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            ►
          </button>
        </div>
      )}

      <Filter
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        dateFrom={dateFrom}
        dateTo={dateTo}
        status={status}
        atype={atype}
        onChangeDateFrom={(v) => { setPage(1); setDateFrom(v); }}
        onChangeDateTo={(v) => { setPage(1); setDateTo(v); }}
        onChangeStatus={(v) => { setPage(1); setStatus(v); }}
        onChangeType={(v) => { setPage(1); setAtype(v); }}
        onApply={() => setFiltersOpen(false)}
        onClear={() => {
          setDateFrom("");
          setDateTo("");
          setStatus("");
          setAtype("");
        }}
      />
    </div>
  );
}
