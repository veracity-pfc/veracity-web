import { JSX, useEffect, useRef, useState } from "react";
import {
  apiGetProfile,
  apiValidateName,
  apiValidateEmailChange,
  apiUpdateName,
  apiRequestEmailChange,
  apiDeleteAccount,
  apiInactivateAccount,
  clearToken,
  getToken,
} from "../../api/client";
import Toast, { useToast } from "../../components/Toast/Toast";
import Modal from "../../components/Modal/Modal";
import styles from "./Profile.module.css";
import modalSaveConfirmationImg from "../../assets/ilust-save-confirmation.png";
import modalExitConfirmationImg from "../../assets/ilust-exit-without-save-confirmation.png";
import modalDeleteAccountConfirmationImg from "../../assets/ilust-delete-account-confirmation.png";
import modalDeletedAccountImg from "../../assets/ilust-deleted-account.png";
import modalInactiveAccountImg from "../../assets/ilust-inactive-account.png";

type AnyObj = Record<string, any>;

function resolveRole(): string {
  const ls = (localStorage.getItem("role") || "").toLowerCase();
  if (ls) return ls;
  const t = typeof getToken === "function" ? getToken() : null;
  if (!t) return "";
  try {
    const payload = JSON.parse(atob(t.split(".")[1] || ""));
    return String(
      payload.role ||
        payload.user_role ||
        payload["role"] ||
        payload["userRole"] ||
        ""
    ).toLowerCase();
  } catch {
    return "";
  }
}

export default function Profile(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [serverErr, setServerErr] = useState("");

  const [initial, setInitial] = useState<AnyObj | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  const [modalUnsaved, setModalUnsaved] = useState(false);
  const [modalConfirmSave, setModalConfirmSave] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeactivate, setModalDeactivate] = useState(false);
  const [modalDeletedOk, setModalDeletedOk] = useState(false);
  const [modalDeactivatedOk, setModalDeactivatedOk] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirtyRef = useRef(false);
  const pendingNavRef = useRef<{ type: "url" | "back"; value: string | null } | null>(null);

  const { success, error } = useToast();

  const [role, setRole] = useState<string>(() => resolveRole());

  useEffect(() => {
    setRole(resolveRole());
  }, []);

  useEffect(() => {
    apiGetProfile()
      .then((d: AnyObj) => {
        setInitial(d);
        setName(d.name || "");
        setEmail(d.email || "");
        if (d?.role && !role) setRole(String(d.role).toLowerCase());
        if (d?.user_role && !role) setRole(String(d.user_role).toLowerCase());
        if (d?.is_admin === true && role !== "admin") setRole("admin");
      })
      .catch((e: any) => setServerErr(e.message || "Erro ao carregar perfil"))
      .finally(() => setLoading(false));
  }, []); 

  const dirty =
    !!initial &&
    (name.trim() !== (initial?.name || "").trim() ||
      email.trim().toLowerCase() !== (initial?.email || "").toLowerCase());

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    const isSameOrigin = (href: string) => {
      try {
        const u = new URL(href, window.location.href);
        return u.origin === window.location.origin;
      } catch {
        return false;
      }
    };

    const onDocumentClickCapture = (e: Event) => {
      if (!dirtyRef.current) return;
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.tagName === "A" && (el as HTMLAnchorElement).href) break;
        el = el.parentElement;
      }
      if (!el || el.tagName !== "A") return;
      const anchor = el as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank") return;
      if (!isSameOrigin(anchor.href)) return;

      e.preventDefault();
      (e as any).stopPropagation?.();

      pendingNavRef.current = { type: "url", value: anchor.href };
      setModalUnsaved(true);
    };

    const onPopState = () => {
      if (!dirtyRef.current) return;
      window.history.forward();
      pendingNavRef.current = { type: "back", value: null };
      setModalUnsaved(true);
    };

    document.addEventListener("click", onDocumentClickCapture as any, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onDocumentClickCapture as any, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const handleSave = () => {
    if (!dirty || saving) return;
    setModalConfirmSave(true);
  };

  const actuallySave = async () => {
    setModalConfirmSave(false);
    setSaving(true);
    const changedName = name.trim() !== (initial?.name || "").trim();
    const changedEmail =
      email.trim().toLowerCase() !== (initial?.email || "").toLowerCase();

    try {
      setErrors({ name: "", email: "" });

      if (changedName) {
        await apiValidateName(name.trim());
        await apiUpdateName(name.trim());
      }

      if (changedEmail) {
        const newEmail = email.trim().toLowerCase();
        await apiValidateEmailChange(newEmail);
        const { requires_verification } = (await apiRequestEmailChange(newEmail)) as AnyObj;
        if (requires_verification) {
          success("Solicitação de alteração de e-mail enviada com sucesso!");
          localStorage.setItem("veracity_email_change_target", newEmail);
          dirtyRef.current = false;
          window.location.assign("/verify-email?mode=email-change");
          return;
        }
      }

      const d = (await apiGetProfile()) as AnyObj;
      setInitial(d);
      setName(d.name || "");
      setEmail(d.email || "");
      success("Dados do perfil alterados com sucesso!");
    } catch (e: any) {
      error("Erro ao alterar dados do perfil!");
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
    if (pending.type === "url" && pending.value)
      window.location.assign(pending.value);
    else if (pending.type === "back") window.history.back();
  };

  const confirmDelete = async () => {
    setModalDelete(false);
    setDeleting(true);
    try {
      await apiDeleteAccount();
      clearToken();
      success("Conta excluída com sucesso!");
      setModalDeletedOk(true);
    } catch (e: any) {
      error("Erro ao excluir conta!");
      setServerErr(e.message || "Falha ao excluir conta.");
      setDeleting(false);
    }
  };

  const confirmDeactivate = async () => {
    setModalDeactivate(false);
    try {
      await apiInactivateAccount();
      clearToken();
      success("Conta inativada com sucesso!");
      setModalDeactivatedOk(true);
    } catch (e: any) {
      error("Erro ao inativar conta!");
      setServerErr(e.message || "Falha ao inativar conta.");
    }
  };

  const isAdmin =
    role === "admin" ||
    initial?.is_admin === true ||
    String(initial?.role || initial?.user_role || "").toLowerCase() === "admin";

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (serverErr)
    return (
      <p role="alert" className={styles.error}>
        {serverErr}
      </p>
    );

  return (
    <main className="container">
      <Toast />
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
            placeholder="Nome completo"
            disabled={isAdmin}
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
            placeholder="email@domino.com"
            disabled={isAdmin}
          />
          {errors.email && <span className={styles.err}>{errors.email}</span>}

          {!isAdmin && (
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
                disabled={deleting || saving}
              >
                Excluir conta
              </button>
            </div>
          )}
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
          <br /><br />A exclusão é permanente e não pode ser desfeita.
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
