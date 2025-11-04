import { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.css";

export default function Filter({
  open,
  onClose,
  dateFrom,
  dateTo,
  status,
  atype,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeStatus,
  onChangeType,
  onApply,
  onClear,
}) {
  const ref = useRef(null);

  const [localFrom, setLocalFrom] = useState(dateFrom || "");
  const [localTo, setLocalTo] = useState(dateTo || "");
  const [localStatus, setLocalStatus] = useState(status || "");
  const [localType, setLocalType] = useState(atype || "");

  useEffect(() => {
    if (open) {
      setLocalFrom(dateFrom || "");
      setLocalTo(dateTo || "");
      setLocalStatus(status || "");
      setLocalType(atype || "");
    }
  }, [open, dateFrom, dateTo, status, atype]);

  useEffect(() => {
    const h = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", h);
    document.addEventListener("mousedown", h);
    return () => {
      document.removeEventListener("keydown", h);
      document.removeEventListener("mousedown", h);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleApply = () => {
    onChangeDateFrom(localFrom || "");
    onChangeDateTo(localTo || "");
    onChangeStatus(localStatus || "");
    onChangeType(localType || "");
    if (onApply) onApply();
  };

  const handleClearLocal = () => {
    setLocalFrom("");
    setLocalTo("");
    setLocalStatus("");
    setLocalType("");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card} ref={ref}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
        <h2 className={styles.title}>Filtros</h2>

        <label className={styles.label}>Data inicial</label>
        <input
          type="date"
          value={localFrom}
          onChange={(e) => setLocalFrom(e.target.value)}
          className={styles.input}
          placeholder="dd/mm/aaaa"
        />

        <label className={styles.label}>Data final</label>
        <input
          type="date"
          value={localTo}
          onChange={(e) => setLocalTo(e.target.value)}
          className={styles.input}
          placeholder="dd/mm/aaaa"
        />

        <label className={styles.label}>Status da análise</label>
        <select
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecione uma opção</option>
          <option value="safe">Seguro</option>
          <option value="suspicious">Suspeito</option>
          <option value="malicious">Malicioso</option>
          <option value="fake">Falso</option>
        </select>

        <label className={styles.label}>Tipo de análise</label>
        <select
          value={localType}
          onChange={(e) => setLocalType(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecione uma opção</option>
          <option value="url">URL</option>
          <option value="image">Imagem</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.btnApply} onClick={handleApply}>Aplicar filtros</button>
          <button className={styles.btnClear} onClick={handleClearLocal}>Limpar filtros</button>
        </div>
      </div>
    </div>
  );
}
