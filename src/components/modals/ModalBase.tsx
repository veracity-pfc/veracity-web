import { PropsWithChildren } from 'react';

export default function ModalBase({ children, onClose }: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <div className="v-modal__overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="v-modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="v-modal__close" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
