import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "safe", label: "Seguro" },
  { value: "suspicious", label: "Suspeito" },
  { value: "malicious", label: "Malicioso" },
  { value: "fake", label: "Falso" },
];
const TYPE_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "url", label: "URL" },
  { value: "image", label: "Imagem" },
];

export default function UserHistory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [atype, setAtype] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
      const data = await apiFetch(`/user/history?${params}`, { auth: true });
      setItems(data.items);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [params]);

  function Card({ item }) {
    return (
      <div
        className=""
        onClick={() => navigate(`/user/history/${item.id}`)}
      >
        <p className="">
          <b>Data da análise:</b>{" "}
          {new Date(item.created_at).toLocaleDateString()}
        </p>
        {item.analysis_type === "image" ? (
          <p className="mt-1"><b>Imagem:</b> {item.source || "—"}</p>
        ) : (
          <p className="mt-1"><b>URL:</b> {item.source || "—"}</p>
        )}
        <p className="mt-1">
          <b>Status:</b>{" "}
          {item.label === "safe" ? "Seguro" :
           item.label === "suspicious" ? "Suspeito" :
           item.label === "malicious" ? "Malicioso" :
           item.label === "fake" ? "Falso" : "Desconhecido"}
        </p>
      </div>
    );
  }

  const EmptyState = (
    <div className="">
      Nenhuma análise disponível para visualização.
    </div>
  );

  return (
    <div className="">
      <h1 className="">Histórico</h1>

      <div className="">
        <div className="">
          <label className="">Pesquisar</label>
          <input
            className=""
            placeholder="Digite URL, nome da imagem ou status…"
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
          />
        </div>
        <div>
          <label className="">Data inicial</label>
          <input type="date" className=""
            value={dateFrom} onChange={(e) => { setPage(1); setDateFrom(e.target.value); }} />
        </div>
        <div>
          <label className="">Data final</label>
          <input type="date" className=""
            value={dateTo} onChange={(e) => { setPage(1); setDateTo(e.target.value); }} />
        </div>
        <div>
          <label className="">Status</label>
          <select
            className=""
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="">Tipo</label>
          <select
            className=""
            value={atype}
            onChange={(e) => { setPage(1); setAtype(e.target.value); }}
          >
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="">Carregando…</div>
      ) : items.length === 0 ? (
        EmptyState
      ) : (
        <div className="">
          {items.map((it) => <Card key={it.id} item={it} />)}
        </div>
      )}

      {items.length > 0 && (
        <div className="">
          <button
            className=""
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ◄
          </button>
          <span className="">Página {page} de {totalPages}</span>
          <button
            className=""
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            ►
          </button>
        </div>
      )}
    </div>
  );
}
