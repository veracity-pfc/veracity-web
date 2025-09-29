import { PropsWithChildren, CSSProperties } from 'react';

type ModalBaseProps = {
  onClose: () => void;
  boxStyle?: CSSProperties;
};

export default function ModalBase({ children, onClose, boxStyle }: PropsWithChildren<ModalBaseProps>) {
  return (
    <div className="v-modal__overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="v-modal__box"
        onClick={(e) => e.stopPropagation()}
        style={boxStyle} 
      >
        <button className="v-modal__close" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
