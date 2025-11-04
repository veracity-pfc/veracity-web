import { useEffect, useRef } from "react";
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
  return (
    <div className={styles.overlay}>
      <div className={styles.card} ref={ref}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
        <h2 className={styles.title}>Filtros</h2>

        <label className={styles.label}>Data inicial</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChangeDateFrom(e.target.value)}
          className={styles.input}
          placeholder="dd/mm/aaaa"
        />

        <label className={styles.label}>Data final</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChangeDateTo(e.target.value)}
          className={styles.input}
          placeholder="dd/mm/aaaa"
        />

        <label className={styles.label}>Status da análise</label>
        <select
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
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
          value={atype}
          onChange={(e) => onChangeType(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecione uma opção</option>
          <option value="url">URL</option>
          <option value="image">Imagem</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.btnApply} onClick={onApply}>Aplicar filtros</button>
          <button className={styles.btnClear} onClick={onClear}>Limpar filtros</button>
        </div>
      </div>
    </div>
  );
}
