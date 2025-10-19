import React, { useState } from 'react';

export default function SearchForm({ mode, onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
  }

  const placeholder =
    mode === 'urls'
      ? 'Adicione A URL que deseja verificar'
      : 'Adicione a imagem que deseja verificar';

  return (
    <form className="search-card" onSubmit={handleSubmit} role="search">
      <input
        className="search-input"
        type="text"
        inputMode={mode === 'urls' ? 'url' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={placeholder}
      />
      <button className="verify-btn" type="submit">Verificar</button>
    </form>
  );
}
