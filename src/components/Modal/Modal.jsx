import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const cx = (...xs) => xs.filter(Boolean).join(" ");

export default function Modal({
  open,
  title,
  imageSrc,
  imageAlt = "",
  children,
  showClose = true,
  closeOnOverlay = true,
  onClose,

  primaryText,
  onPrimary,
  primaryDisabled = false,
  primaryVariant = "danger",
  secondaryText,
  onSecondary,
  secondaryDisabled = false,
  secondaryVariant = "secondary",
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  const safeClose = () => { if (typeof onClose === "function") onClose(); };

  useEffect(() => {
    if (!open) return;
    const onKeyCapture = (e) => { if (e.key === "Escape") { e.stopPropagation(); safeClose(); } };
    window.addEventListener("keydown", onKeyCapture, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKeyCapture, true); document.body.style.overflow = prevOverflow || ""; };
  }, [open]);

  useEffect(() => { if (open) dialogRef.current?.focus(); }, [open]);

  const hasActions = useMemo(() => Boolean(primaryText) || Boolean(secondaryText), [primaryText, secondaryText]);
  if (!open) return null;

  const handleCardKeyDown = (e) => { if (e.key === "Escape") { e.stopPropagation(); safeClose(); } };
  const handleBackdropMouseDown = (e) => { if (!closeOnOverlay) return; if (e.target === overlayRef.current) { safeClose(); } };
  const stop = (e) => e.stopPropagation();

  const primaryClass = cx(
    styles["btn"],
    primaryVariant === "danger"
      ? styles["btn-danger"]
      : primaryVariant === "success"
      ? styles["btn-success"]
      : styles["btn-primary"]
  );

  return createPortal(
    <div ref={overlayRef} className={styles["modal-backdrop"]} onMouseDown={handleBackdropMouseDown} aria-hidden={!open}>
      <section
        ref={dialogRef}
        className={styles["modal"]}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onKeyDown={handleCardKeyDown}
        onMouseDown={stop}
        onClick={stop}
      >
        {showClose && (
          <button type="button" className={styles["modal-close"]} aria-label="Fechar modal" onClick={safeClose}>
            ×
          </button>
        )}

        {imageSrc && (
          <figure className={styles["modal-figure"]} aria-hidden={imageAlt ? "false" : "true"}>
            <img src={imageSrc} alt={imageAlt} />
          </figure>
        )}

        {title && <h2 id="modal-title" className={styles["modal-title"]}>{title}</h2>}

        <div className={styles["modal-body"]}>{children}</div>

        {hasActions && (
          <div className={styles["modal-actions"]}>
            {primaryText && (
              <button type="button" className={primaryClass} onClick={onPrimary} disabled={primaryDisabled}>
                {primaryText}
              </button>
            )}
            {secondaryText && (
              <button
                type="button"
                className={cx(styles["btn"], secondaryVariant === "secondary" ? styles["btn-secondary"] : styles["btn-ghost"])}
                onClick={onSecondary}
                disabled={secondaryDisabled}
              >
                {secondaryText}
              </button>
            )}
          </div>
        )}
      </section>
    </div>,
    document.body
  );
}
