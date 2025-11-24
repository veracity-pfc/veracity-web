import { useEffect, useMemo, useState } from "react";
import styles from "./Filter.module.css";

type Option = {
  value: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  dateFrom: string;
  dateTo: string;
  status: string;
  atype: string;
  origin: string;
  onChangeDateFrom: (v: string) => void;
  onChangeDateTo: (v: string) => void;
  onChangeStatus: (v: string) => void;
  onChangeType: (v: string) => void;
  onChangeOrigin: (v: string) => void; 
  onApply: () => void;
  onClear: () => void;
  showStatus?: boolean;
  showType?: boolean;
  showOrigin?: boolean; 
  statusOptions?: Option[];
  typeOptions?: Option[];
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
  origin,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeStatus,
  onChangeType,
  onChangeOrigin,
  onApply,
  onClear,
  showStatus = true,
  showType = true,
  showOrigin = true,
  statusOptions,
  typeOptions,
}: Props) {
  const [localFrom, setLocalFrom] = useState(onlyDate(dateFrom));
  const [localTo, setLocalTo] = useState(onlyDate(dateTo));
  const [localStatus, setLocalStatus] = useState(status);
  const [localType, setLocalType] = useState(atype);
  const [localOrigin, setLocalOrigin] = useState(origin);

  useEffect(() => setLocalFrom(onlyDate(dateFrom)), [dateFrom]);
  useEffect(() => setLocalTo(onlyDate(dateTo)), [dateTo]);
  useEffect(() => setLocalStatus(status), [status]);
  useEffect(() => setLocalType(atype), [atype]);
  useEffect(() => setLocalOrigin(origin), [origin]);

  const hasDateError = useMemo(() => {
    if (!localFrom || !localTo) return false;
    const f = new Date(localFrom + "T00:00:00Z").getTime();
    const t = new Date(localTo + "T00:00:00Z").getTime();
    return t < f;
  }, [localFrom, localTo]);

  const effectiveStatusOptions: Option[] =
    statusOptions ||
    [
      { value: "", label: "Todos" },
      { value: "safe", label: "Seguro" },
      { value: "suspicious", label: "Suspeito" },
      { value: "malicious", label: "Malicioso" },
      { value: "fake", label: "Falso" },
    ];

  const effectiveTypeOptions: Option[] =
    typeOptions ||
    [
      { value: "", label: "Todos" },
      { value: "url", label: "URL" },
      { value: "image", label: "Imagem" },
    ];

  const originOptions: Option[] = [
    { value: "", label: "Todos" },
    { value: "user", label: "Conta de usuário" },
    { value: "token", label: "Via Token API" },
  ];

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
              onClick={(e) =>
                (e.currentTarget as HTMLInputElement).showPicker?.()
              }
              className={styles.dateInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Data final</label>
            <input
              type="date"
              value={localTo}
              onChange={(e) => setLocalTo(onlyDate(e.target.value))}
              onClick={(e) =>
                (e.currentTarget as HTMLInputElement).showPicker?.()
              }
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
          {showStatus && (
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
              >
                {effectiveStatusOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showType && (
            <div className={styles.field}>
              <label className={styles.label}>Categoria</label>
              <select
                className={styles.select}
                value={localType}
                onChange={(e) => setLocalType(e.target.value)}
              >
                {effectiveTypeOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showOrigin && (
            <div className={styles.field}>
              <label className={styles.label}>Origem</label>
              <select
                className={styles.select}
                value={localOrigin}
                onChange={(e) => setLocalOrigin(e.target.value)}
              >
                {originOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setLocalFrom("");
              setLocalTo("");
              setLocalStatus("");
              setLocalType("");
              setLocalOrigin("");
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
              onChangeOrigin(localOrigin);
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