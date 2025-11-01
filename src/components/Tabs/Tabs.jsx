import React from 'react';
import styles from './Tabs.module.css';

const cx = (...xs) => xs.filter(Boolean).join(' ');

export default function Tabs({ active, onChange, labels }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Tipo de análise">
      <button
        type="button"
        className={cx(styles['tab-btn'], active === 'urls' && styles.active)}
        role="tab"
        aria-selected={active === 'urls'}
        onClick={() => onChange('urls')}
      >
        {labels.urls}
      </button>

      <button
        type="button"
        className={cx(styles['tab-btn'], active === 'images' && styles.active)}
        role="tab"
        aria-selected={active === 'images'}
        onClick={() => onChange('images')}
      >
        {labels.images}
      </button>
    </div>
  );
}
