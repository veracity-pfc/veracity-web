import React from 'react';
import wordmark from '../assets/veracity-wordmark.png';

export default function Logo() {
  return (
    <a href="#" className="logo-link" aria-label="Veracity – Página inicial">
      <img
        src={wordmark}
        alt="Veracity"
        className="logo-wordmark"
        height="24"
      />
    </a>
  );
}
