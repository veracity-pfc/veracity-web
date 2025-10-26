import React, { useCallback, useRef, useState } from "react";
import imageIcon from "../assets/icon-image.png";
import AnalysisCard from "./AnalysisCard";
import { apiAnalyzeImage } from "../api/client";

const MAX_BYTES = 1 * 1024 * 1024; 

export default function ImageForm() {
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const onPick = () => inputRef.current?.click();

  const clearFile = () => {
    setFile(null);
    setStatusMsg("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const validateFile = (f) => {
    if (!f) return "Nenhum arquivo selecionado.";
    if (!f.type?.startsWith("image/")) return "Apenas imagens são permitidas.";
    if (f.size > MAX_BYTES) return "A imagem deve ter no máximo 1MB.";
    return null;
  };

  const setSelectedFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setStatusMsg(err);
      setFile(null);
      setResult(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setStatusMsg("");
    setFile(f);
  };

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    setSelectedFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    setSelectedFile(f);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    setResult(null);
    setStatusMsg("Analisando imagem...");
    setLoading(true);
    try {
      const data = await apiAnalyzeImage(file);
      setResult(data);
      setStatusMsg("");
    } catch (err) {
      setStatusMsg(err?.message || "Erro ao analisar a imagem.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const hasFile = !!file;

  return (
    <>
      <form className="image-form" onSubmit={submit} noValidate>
        {!hasFile && (
          <div
            className="image-dropzone"
            onDragOver={onDragOver}
            onDrop={onDrop}
            role="button"
            onClick={onPick}
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
            aria-label="Arraste e solte uma imagem ou clique para fazer upload"
          >
            <div className="image-dropzone__icon" aria-hidden />
            <img src={imageIcon} alt="" />
            <p className="image-dropzone__text">
              Arraste e solte a imagem aqui ou clique no botão abaixo para fazer o upload
            </p>
            <button type="button" className="image-dropzone__cta">
              Escolha um arquivo para fazer upload
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              hidden
            />
          </div>
        )}

        {hasFile && (
          <div className="image-capsule">
            <img
              src={imageIcon}
              alt=""
              className="image-capsule__icon-img"
              aria-hidden
            />

            <div className="image-capsule__name" title={file.name}>
              {file.name}
            </div>

            <button
              type="button"
              className="image-capsule__clear"
              aria-label="Remover arquivo"
              onClick={clearFile}
              disabled={loading}
              title="Remover"
            >
              ×
            </button>

            <button
              type="submit"
              className="image-capsule__submit"
              disabled={!hasFile || loading}
            >
              Verificar
            </button>
          </div>
        )}

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
