import React, { useState } from "react";
import { apiAnalyzeUrl } from "../api/client";
import AnalysisCard from "./AnalysisCard";

export default function SearchForm({ mode = "urls" }) {
  const [value, setValue] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const canSubmit = mode === "urls" && value.trim().length > 0;

  const onChange = (e) => {
    const v = e.target.value.replace(/[\u0000-\u001F\u007F]/g, "");
    setValue(v);
  };

  const clear = () => {
    setValue("");
    setStatusMsg("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setResult(null);
    setStatusMsg("Analisando url...");
    setLoading(true);
    try {
      const data = await apiAnalyzeUrl(value.trim());
      setResult(data);
      setStatusMsg("");
    } catch (err) {
      setStatusMsg(err?.message || "Ocorreu um erro ao analisar a URL.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="search-form" onSubmit={submit} noValidate>
        <div className="search-form__capsule">
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder={mode === "urls" ? "Digite a URL que deseja verificar" : "Cole aqui o link da imagem"}
            value={value}
            onChange={onChange}
            className="search-form__input--capsule"
            aria-label="URL para análise"
          />

          {value && (
            <button
              type="button"
              className="search-form__clear--inside"
              aria-label="Limpar campo"
              onClick={clear}
              disabled={loading}
              title="Limpar"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className="search-form__submit--inside"
            disabled={!canSubmit || loading}
          >
            Verificar
          </button>
        </div>

        {statusMsg && (
          <p className={`search-form__hint ${loading ? "is-loading" : "is-error"}`}>
            {statusMsg}
          </p>
        )}
      </form>

      {result && <AnalysisCard data={result} />}
    </>
  );
}
