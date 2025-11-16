import { JSX, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "../../components/Tabs/Tabs";
import SearchForm from "../../components/UrlForm/UrlForm";
import ImageForm from "../../components/ImageForm/ImageForm";
import modalImage from "../../assets/ilust-welcome.png";
import Modal from "../../components/Modal/Modal";
import modalStyles from "../../components/Modal/Modal.module.css";
import { getToken, getRole } from "../../api/client";
import Toast from "../../components/Toast/Toast";
import "../../styles/legal.css";
import styles from "./Home.module.css";

type TabKey = "urls" | "images";

function getTabFromSearch(search: string): TabKey {
  const sp = new URLSearchParams(search || window.location.search);
  const t = (sp.get("tab") || "").toLowerCase();
  return t === "images" ? "images" : "urls";
}

export default function Home(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>(() => getTabFromSearch(location.search));
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  useEffect(() => {
    const next = getTabFromSearch(location.search);
    setActiveTab(next);
  }, [location.search]);

  useEffect(() => {
    const hasToken = !!getToken?.();
    const role = typeof getRole === "function" ? getRole() : null;

    if (hasToken && role === "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    const pending = localStorage.getItem("veracity_welcome_pending") === "1";
    if (hasToken && pending) {
      setShowWelcome(true);
      localStorage.removeItem("veracity_welcome_pending");
    }
  }, [navigate]);

  const handleChange = useCallback((t: TabKey) => {
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
        secondaryText={undefined}
        primaryText={undefined}
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
