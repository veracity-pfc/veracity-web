import { useEffect, useRef, useState } from "react";
import {
  apiGetProfile,
  apiValidateName,
  apiValidateEmailChange,
  apiUpdateName,
  apiRequestEmailChange,
  apiDeleteAccount,
  apiInactivateAccount,
  clearToken,
} from "../../api/client";
import Modal from "../../components/Modal/Modal.jsx";
import styles from "./Profile.module.css";
import modalSaveConfirmationImg from "../../assets/ilust-save-confirmation.png";
import modalExitConfirmationImg from "../../assets/ilust-exit-without-save-confirmation.png";
import modalDeleteAccountConfirmationImg from "../../assets/ilust-delete-account-confirmation.png";
import modalDeletedAccountImg from "../../assets/ilust-deleted-account.png";
import modalInactiveAccountImg from "../../assets/ilust-inactive-account.png";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [serverErr, setServerErr] = useState("");

  const [initial, setInitial] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({ name: "", email: "" });

  const [modalUnsaved, setModalUnsaved] = useState(false);
  const [modalConfirmSave, setModalConfirmSave] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeactivate, setModalDeactivate] = useState(false);
  const [modalDeletedOk, setModalDeletedOk] = useState(false);
  const [modalDeactivatedOk, setModalDeactivatedOk] = useState(false);

  const [saving, setSaving] = useState(false);

  const dirtyRef = useRef(false);
  const pendingNavRef = useRef(null);

  const modalUnsavedRef = useRef(false);
  const modalConfirmSaveRef = useRef(false);

  useEffect(() => {
    apiGetProfile()
      .then((d) => {
        setInitial(d);
        setName(d.name || "");
        setEmail(d.email || "");
      })
      .catch((e) => setServerErr(e.message || "Erro ao carregar perfil"))
      .finally(() => setLoading(false));
  }, []);

  const dirty =
    !!initial &&
    (name.trim() !== (initial.name || "").trim() ||
      email.trim().toLowerCase() !== (initial.email || "").toLowerCase());

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  useEffect(() => {
    modalUnsavedRef.current = modalUnsaved;
  }, [modalUnsaved]);
  useEffect(() => {
    modalConfirmSaveRef.current = modalConfirmSave;
  }, [modalConfirmSave]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!dirtyRef.current) return;
      if (modalUnsavedRef.current || modalConfirmSaveRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    const isSameOrigin = (href) => {
      try {
        const u = new URL(href, window.location.href);
        return u.origin === window.location.origin;
      } catch {
        return false;
      }
    };

    const onDocumentClickCapture = (e) => {
      if (!dirtyRef.current) return;
      let el = e.target;
      while (el && el !== document.body) {
        if (el.tagName === "A" && el.href) break;
        el = el.parentElement;
      }
      if (!el || el.tagName !== "A") return;
      const href = el.getAttribute("href");
      if (!href || el.target === "_blank") return;
      if (!isSameOrigin(el.href)) return;

      e.preventDefault();
      e.stopPropagation();

      if (modalConfirmSave) setModalConfirmSave(false);
      pendingNavRef.current = { type: "url", value: el.href };
      setModalUnsaved(true);
    };

    const onPopState = () => {
      if (!dirtyRef.current) return;
      window.history.forward();
      if (modalConfirmSave) setModalConfirmSave(false);
      pendingNavRef.current = { type: "back", value: null };
      setModalUnsaved(true);
    };

    document.addEventListener("click", onDocumentClickCapture, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onDocumentClickCapture, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [modalConfirmSave]);

  const validateNameServer = async () => {
    setErrors((p) => ({ ...p, name: "" }));
    if (!initial) return;
    try {
      await apiValidateName(name.trim());
    } catch (e) {
      setErrors((p) => ({ ...p, name: e.message || "Nome inválido." }));
    }
  };

  const validateEmailServer = async () => {
    setErrors((p) => ({ ...p, email: "" }));
    if (!initial) return;
    const newEmail = email.trim().toLowerCase();
    try {
      await apiValidateEmailChange(newEmail);
    } catch (e) {
      setErrors((p) => ({ ...p, email: e.message || "E-mail inválido." }));
    }
  };

  const handleSave = () => {
    if (!dirty || saving) return;
    setModalConfirmSave(true);
  };

  const actuallySave = async () => {
    setModalConfirmSave(false);
    setSaving(true);
    const changedName = name.trim() !== (initial.name || "").trim();
    const changedEmail =
      email.trim().toLowerCase() !== (initial.email || "").toLowerCase();

    try {
      setErrors({ name: "", email: "" });

      if (changedName) {
        await apiValidateName(name.trim());
        await apiUpdateName(name.trim());
      }

      if (changedEmail) {
        const newEmail = email.trim().toLowerCase();
        await apiValidateEmailChange(newEmail);
        const { requires_verification } = await apiRequestEmailChange(newEmail);
        if (requires_verification) {
          localStorage.setItem("veracity_email_change_target", newEmail);
          setInitial((p) => ({ ...(p || {}), email: newEmail }));
          setEmail(newEmail);
          dirtyRef.current = false;
          window.location.assign("/verify-email?mode=email-change");
          return;
        }
      }

      const d = await apiGetProfile();
      setInitial(d);
      setName(d.name || "");
      setEmail(d.email || "");
    } catch (e) {
      const msg = e.message || "Falha ao salvar mudanças.";
      if (changedEmail) setErrors((p) => ({ ...p, email: msg }));
      else if (changedName) setErrors((p) => ({ ...p, name: msg }));
      else setServerErr(msg);
    } finally {
      setSaving(false);
    }
  };

  const abandonChanges = () => {
    setModalUnsaved(false);
    if (initial) {
      setName(initial.name || "");
      setEmail(initial.email || "");
      setErrors({ name: "", email: "" });
    }
    const pending = pendingNavRef.current;
    pendingNavRef.current = null;
    if (!pending) return;
    if (pending.type === "url" && pending.value) window.location.assign(pending.value);
    else if (pending.type === "back") window.history.back();
  };

  const confirmDelete = async () => {
    setModalDelete(false);
    try {
      await apiDeleteAccount();
      clearToken();
      setModalDeletedOk(true);
    } catch (e) {
      setServerErr(e.message || "Falha ao excluir conta.");
    }
  };

  const confirmDeactivate = async () => {
    setModalDeactivate(false);
    try {
      await apiInactivateAccount();
      clearToken();
      setModalDeactivatedOk(true);
    } catch (e) {
      setServerErr(e.message || "Falha ao inativar conta.");
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (serverErr)
    return (
      <p role="alert" className={styles.error}>
        {serverErr}
      </p>
    );

  return (
    <main className="container">
      <h1 className={styles.title}>Meu perfil</h1>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h3>Nome completo</h3>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            onBlur={validateNameServer}
            placeholder="Nome completo"
          />
        {errors.name && <span className={styles.err}>{errors.name}</span>}

          <h3 style={{ marginTop: 18 }}>E-mail</h3>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: "" }));
            }}
            onBlur={validateEmailServer}
            placeholder="email@domino.com"
          />
          {errors.email && <span className={styles.err}>{errors.email}</span>}

          <div className={styles.actions}>
            <button
              className={styles.btnSave}
              disabled={!dirty || saving}
              onClick={handleSave}
            >
              {saving ? "Carregando..." : "Salvar"}
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => setModalDelete(true)}
            >
              Excluir conta
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Análises diárias restantes</h3>
          <p>
            URLs: <b>{initial?.stats?.remaining?.urls ?? 0}</b>
          </p>
          <p>
            Imagens: <b>{initial?.stats?.remaining?.images ?? 0}</b>
          </p>
        </div>

        <div className={styles.card}>
          <h3>Análises realizadas</h3>
          <p>
            URLs: <b>{initial?.stats?.performed?.urls ?? 0}</b>
          </p>
          <p>
            Imagens: <b>{initial?.stats?.performed?.images ?? 0}</b>
          </p>
        </div>
      </section>

      <Modal
        open={modalUnsaved}
        onClose={() => setModalUnsaved(false)}
        title="Sair sem salvar?"
        imageSrc={modalExitConfirmationImg}
        primaryText="Sair"
        onPrimary={abandonChanges}
        secondaryText="Cancelar"
        onSecondary={() => setModalUnsaved(false)}
        secondaryVariant="secondary"
      >
        <p>
          As alterações realizadas no seu perfil serão perdidas caso você não
          salve as informações antes de sair desta página.
        </p>
      </Modal>

      <Modal
        open={modalConfirmSave}
        imageSrc={modalSaveConfirmationImg}
        onClose={() => setModalConfirmSave(false)}
        title="Salvar mudanças?"
        primaryText="Confirmar"
        primaryVariant="success"
        onPrimary={actuallySave}
        secondaryText="Cancelar"
        onSecondary={() => setModalConfirmSave(false)}
        secondaryVariant="secondary"
      >
        <p>Após confirmar, as informações do seu perfil serão atualizadas</p>
      </Modal>

      <Modal
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        title="Excluir conta?"
        imageSrc={modalDeleteAccountConfirmationImg}
        primaryText="Excluir"
        onPrimary={confirmDelete}
        secondaryText="Inativar"
        onSecondary={() => {
          setModalDelete(false);
          setModalDeactivate(true);
        }}
        primaryVariant="danger"
        secondaryVariant="secondary"
      >
        <p>
          Sugerimos inativar em vez de excluir. Ao inativar, você perde o acesso, mas pode reativar depois e manter seu histórico.
          <br/><br/>A exclusão é permanente e não pode ser desfeita.
        </p>
      </Modal>

      <Modal
        open={modalDeletedOk}
        onClose={() => {
          setModalDeletedOk(false);
          window.location.assign("/");
        }}
        imageSrc={modalDeletedAccountImg}
        title="Conta excluída"
      >
        <p>As informações da sua conta foram excluídas da plataforma.</p>
      </Modal>

      <Modal
        open={modalDeactivatedOk}
        onClose={() => {
          setModalDeactivatedOk(false);
          window.location.assign("/");
        }}
        imageSrc={modalInactiveAccountImg}
        title="Conta inativada"
      >
        <p>Sua conta foi inativada com sucesso.</p>
      </Modal>
    </main>
  );
}
