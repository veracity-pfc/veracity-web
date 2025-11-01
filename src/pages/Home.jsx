import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "../components/Tabs.jsx";
import SearchForm from "../components/SearchForm.jsx";
import ImageForm from "../components/ImageForm.jsx";

// Lê o valor de tab a partir de uma query string
function getTabFromSearch(search) {
  const sp = new URLSearchParams(search || window.location.search);
  const t = (sp.get("tab") || "").toLowerCase();
  return t === "images" ? "images" : "urls";
}

export default function Home() {
  const location = useLocation();

  // estado inicial baseado na URL atual
  const [activeTab, setActiveTab] = useState(() => getTabFromSearch(location.search));

  // sempre que a query mudar (ex.: /?tab=images), atualiza o estado
  useEffect(() => {
    const next = getTabFromSearch(location.search);
    setActiveTab(next);
  }, [location.search]);

  // troca de aba e persiste no ?tab= (sem recarregar)
  const handleChange = useCallback((t) => {
    setActiveTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState({}, "", url);
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Detectando manipulações<br />com inteligência</h1>
        <p className="sub">Verifique a autenticidade de conteúdos digitais</p>

        <Tabs
          active={activeTab}
          onChange={handleChange}
          labels={{ urls: 'Análise de URL', images: 'Análise de imagem' }}
        />

        <div className="search-wrap">
          {activeTab === "images" ? <ImageForm /> : <SearchForm mode="urls" />}

          <p className="legal">
            Ao utilizar o Veracity eu concordo com os <a href="/terms-of-use" onClick={(e)=>{e.preventDefault();window.open('/terms-of-use','_blank','noopener');}}>Termos de Uso</a> e com a <a href="/privacy-policy" onClick={(e)=>{e.preventDefault();window.open('/privacy-policy','_blank','noopener');}}>Política de Privacidade</a> da plataforma
          </p>
        </div>
      </section>
    </main>
  );
}
