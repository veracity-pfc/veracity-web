import { useEffect, useMemo, useState } from "react";
import styles from "./Filter.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  dateFrom: string;
  dateTo: string;
  status: string;
  atype: string;
  onChangeDateFrom: (v: string) => void;
  onChangeDateTo: (v: string) => void;
  onChangeStatus: (v: string) => void;
  onChangeType: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
};

function onlyDate(v: string) {
  return v ? v.slice(0, 10) : "";
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
  onClear,
}: Props) {
  const [localFrom, setLocalFrom] = useState(onlyDate(dateFrom));
  const [localTo, setLocalTo] = useState(onlyDate(dateTo));
  const [localStatus, setLocalStatus] = useState(status);
  const [localType, setLocalType] = useState(atype);

  useEffect(() => setLocalFrom(onlyDate(dateFrom)), [dateFrom]);
  useEffect(() => setLocalTo(onlyDate(dateTo)), [dateTo]);
  useEffect(() => setLocalStatus(status), [status]);
  useEffect(() => setLocalType(atype), [atype]);

  const hasDateError = useMemo(() => {
    if (!localFrom || !localTo) return false;
    const f = new Date(localFrom + "T00:00:00Z").getTime();
    const t = new Date(localTo + "T00:00:00Z").getTime();
    return t < f;
  }, [localFrom, localTo]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar filtros"
          title="Fechar"
        >
          ×
        </button>
        <h3 className={styles.title}>Filtros</h3>

        <div className={`${styles.row} ${styles.rowGrid}`}>
          <div className={styles.field}>
            <label className={styles.label}>Data inicial</label>
            <input
              type="date"
              value={localFrom}
              onChange={(e) => setLocalFrom(onlyDate(e.target.value))}
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Data final</label>
            <input
              type="date"
              value={localTo}
              onChange={(e) => setLocalTo(onlyDate(e.target.value))}
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
              className={styles.dateInput}
            />
          </div>
          {hasDateError && (
            <p className={`${styles.fieldError} ${styles.colSpan}`}>
              Data final não pode ser anterior à data inicial.
            </p>
          )}
        </div>

        <div className={`${styles.row} ${styles.rowGrid}`}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="safe">Seguro</option>
              <option value="suspicious">Suspeito</option>
              <option value="malicious">Malicioso</option>
              <option value="fake">Falso</option>
            </select>
          </div>

        <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <select
              className={styles.select}
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="url">URL</option>
              <option value="image">Imagem</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setLocalFrom("");
              setLocalTo("");
              setLocalStatus("");
              setLocalType("");
              onClear();
            }}
          >
            Limpar
          </button>

          <button
            className={styles.applyBtn}
            disabled={hasDateError}
            onClick={() => {
              onChangeDateFrom(localFrom);
              onChangeDateTo(localTo);
              onChangeStatus(localStatus);
              onChangeType(localType);
              if (!hasDateError) onApply();
            }}
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
