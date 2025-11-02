import { useEffect, useRef, useState } from "react";
import styles from "./Toast.module.css";

const bus = new EventTarget();
let seq = 1;

export function useToast() {
  const emit = (type, message, duration = 5000) => {
    bus.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message, duration } }));
  };
  return {
    success: (m, d) => emit("success", m, d),
    error:   (m, d) => emit("error", m, d),
    warn:    (m, d) => emit("warn", m, d),
  };
}

export default function Toast() {
  const [items, setItems] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const onAdd = (e) => {
      const { type, message, duration } = e.detail || {};
      const id = seq++;
      setItems((prev) => [...prev, { id, type, message }]);
      if (duration > 0) {
        const tm = setTimeout(() => close(id), duration);
        timersRef.current.set(id, tm);
      }
    };
    bus.addEventListener("toast:add", onAdd);
    return () => bus.removeEventListener("toast:add", onAdd);
  }, []);

  const close = (id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const tm = timersRef.current.get(id);
    if (tm) clearTimeout(tm);
    timersRef.current.delete(id);
  };

  return (
    <div className={styles.wrap} role="region" aria-label="Notificações">
      {items.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="status" aria-live="polite">
          <span className={styles.msg}>{t.message}</span>
          <button className={styles.x} onClick={() => close(t.id)} aria-label="Fechar">×</button>
        </div>
      ))}
    </div>
  );
}
