import React, { JSX, useEffect, useRef, useState } from "react";
import styles from "./Toast.module.css";

const bus: EventTarget = new EventTarget();
let seq = 1;

type ToastType = "success" | "error" | "warn";

export function useToast() {
  const emit = (type: ToastType, message: string, duration = 5000) => {
    bus.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message, duration } }));
  };
  return {
    success: (m: string, d?: number) => emit("success", m, d),
    error:   (m: string, d?: number) => emit("error", m, d),
    warn:    (m: string, d?: number) => emit("warn", m, d),
  };
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

export default function Toast(): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, number | ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const onAdd = (e: Event) => {
      const ce = e as CustomEvent<{ type: ToastType; message: string; duration: number }>;
      const { type, message, duration } = ce.detail || ({} as any);
      const id = seq++;
      setItems((prev) => [...prev, { id, type, message }]);
      if (duration > 0) {
        const tm = setTimeout(() => close(id), duration);
        timersRef.current.set(id, tm);
      }
    };
    bus.addEventListener("toast:add", onAdd as EventListener);
    return () => bus.removeEventListener("toast:add", onAdd as EventListener);
  }, []);

  const close = (id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const tm = timersRef.current.get(id);
    if (tm) clearTimeout(tm as any);
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
