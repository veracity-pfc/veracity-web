import React, { JSX, useEffect, useRef, useState } from "react";
import styles from "./Filter.module.css";

type Change = (v: string) => void;

interface Props {
  open: boolean;
  onClose: () => void;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  atype?: string;
  onChangeDateFrom: Change;
  onChangeDateTo: Change;
  onChangeStatus: Change;
  onChangeType: Change;
  onApply?: () => void;
  onClear?: () => void;
}

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
}: Props): JSX.Element | null {
  const ref = useRef<HTMLDivElement | null>(null);

  const [localFrom, setLocalFrom] = useState<string>(dateFrom || "");
  const [localTo, setLocalTo] = useState<string>(dateTo || "");
  const [localStatus, setLocalStatus] = useState<string>(status || "");
  const [localType, setLocalType] = useState<string>(atype || "");

  useEffect(() => {
    if (open) {
      setLocalFrom(dateFrom || "");
      setLocalTo(dateTo || "");
      setLocalStatus(status || "");
      setLocalType(atype || "");
    }
  }, [open, dateFrom, dateTo, status, atype]);

  useEffect(() => {
    const h = (e: KeyboardEvent | MouseEvent) => {
      if (!open) return;
      if (e instanceof KeyboardEvent && e.key === "Escape") onClose();
      if (e instanceof MouseEvent && ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", h as EventListener);
    document.addEventListener("mousedown", h as EventListener);
    return () => {
      document.removeEventListener("keydown", h as EventListener);
      document.removeEventListener("mousedown", h as EventListener);
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
