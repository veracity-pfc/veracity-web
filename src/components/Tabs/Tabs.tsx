import React, { JSX } from 'react';
import styles from './Tabs.module.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

type TabKey = 'urls' | 'images';
interface Labels { urls: React.ReactNode; images: React.ReactNode }
interface Props {
  active: TabKey;
  onChange: (k: TabKey) => void;
  labels: Labels;
}

export default function Tabs({ active, onChange, labels }: Props): JSX.Element {
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
