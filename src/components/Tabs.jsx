import React from 'react';

export default function Tabs({ active, onChange, labels }) {
  return (
    <div className="tabs" role="tablist" aria-label="Tipo de análise">
      <button
        type="button"
        className={`tab-btn ${active === 'links' ? 'active' : ''}`}
        role="tab"
        aria-selected={active === 'links'}
        onClick={() => onChange('links')}
      >
        {labels.links}
      </button>

      <button
        type="button"
        className={`tab-btn ${active === 'images' ? 'active' : ''}`}
        role="tab"
        aria-selected={active === 'images'}
        onClick={() => onChange('images')}
      >
        {labels.images}
      </button>
    </div>
  );
}
