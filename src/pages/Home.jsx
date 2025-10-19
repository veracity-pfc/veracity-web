import React, { useState } from 'react';
import Tabs from '../components/Tabs.jsx';
import SearchForm from '../components/SearchForm.jsx';

export default function Home() {
  const [activeTab, setActiveTab] = useState('urls');

  return (
    <main className="container">
      <section className="hero">
        <h1>Detectando manipulações<br />com inteligência</h1>
        <p className="sub">Verifique a autenticidade de conteúdos digitais</p>

        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          labels={{ urls: 'Análise de URLs', images: 'Análise de imagens' }}
        />

        <div className="search-wrap">
          <SearchForm
            mode={activeTab}
            onSubmit={(value) => {
              console.log('Verificar:', activeTab, value);
            }}
          />
          <p className="legal">
            Ao utilizar o Veracity eu concordo com os <a href="/terms-of-use" onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de Uso</a> e com a <a href="/privacy-policy" onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de Privacidade</a> da plataforma
          </p>
        </div>
      </section>
    </main>
  );
}
