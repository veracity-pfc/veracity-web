import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "../../components/Tabs/Tabs.jsx";
import SearchForm from "../../components/UrlForm/UrlForm.jsx";
import ImageForm from "../../components/ImageForm/ImageForm.jsx";
import modalImage from "../../assets/ilust-welcome.png";
import Modal from "../../components/Modal/Modal.jsx";
import modalStyles from "../../components/Modal/Modal.module.css";
import { getToken } from "../../api/client.js";
import Toast from "../../components/Toast/Toast.jsx";
import "../../styles/legal.css";
import styles from "./Home.module.css";

function getTabFromSearch(search) {
  const sp = new URLSearchParams(search || window.location.search);
  const t = (sp.get("tab") || "").toLowerCase();
  return t === "images" ? "images" : "urls";
}

export default function Home() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => getTabFromSearch(location.search));
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const next = getTabFromSearch(location.search);
    setActiveTab(next);
  }, [location.search]);

  useEffect(() => {
    const hasToken = !!getToken?.();
    const pending = localStorage.getItem("veracity_welcome_pending") === "1";
    if (hasToken && pending) {
      setShowWelcome(true);
      localStorage.removeItem("veracity_welcome_pending");
    }
  }, []);

  const handleChange = useCallback((t) => {
    setActiveTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState({}, "", url);
  }, []);

  return (
    <main className="container">
      <Toast />
      <section className={styles.hero}>
        <h1>
          Detectando manipulações
          <br />
          com inteligência
        </h1>
        <p className={styles.sub}>Verifique a autenticidade de conteúdos digitais</p>

        <div className={styles.tabs}>
          <Tabs
            active={activeTab}
            onChange={handleChange}
            labels={{ urls: "Análise de URL", images: "Análise de imagem" }}
          />
        </div>

        <div className={styles["search-wrap"]}>
          {activeTab === "images" ? <ImageForm /> : <SearchForm mode="urls" />}

          <p className="legal">
            Ao utilizar o Veracity eu concordo com os{" "}
            <a
              href="/terms-of-use"
              onClick={(e) => {
                e.preventDefault();
                window.open("/terms-of-use", "_blank", "noopener");
              }}
            >
              Termos de Uso
            </a>{" "}
            e com a{" "}
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                window.open("/privacy-policy", "_blank", "noopener");
              }}
            >
              Política de Privacidade
            </a>{" "}
            da plataforma
          </p>
        </div>
      </section>

      <Modal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        title="Bem vindo(a) ao Veracity!"
        imageSrc={modalImage}
        secondaryText={null}
        primaryText={null}
      >
        <p>
          Visite nossa página de{" "}
          <a
            href="/instructions"
            className={modalStyles["modal-link"]}
            onClick={(e) => {
              e.preventDefault();
              window.location.assign("/instructions");
            }}
          >
            instruções
          </a>{" "}
          para mais detalhes de como realizar as análises.
        </p>
      </Modal>
    </main>
  );
}
