import React, { JSX, useCallback, useRef, useState } from "react";
import imageIcon from "../../assets/icon-image.png";
import AnalysisCard from "../AnalysisCard/AnalysisCard";
import { apiAnalyzeImage } from "../../api/client";
import { useToast } from "../Toast/Toast";
import styles from "./ImageForm.module.css";

const MAX_BYTES = 1 * 1024 * 1024;

export default function ImageForm(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { warn, error } = useToast();

  const onPick = () => inputRef.current?.click();

  const clearFile = () => {
    setFile(null);
    setStatusMsg("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const validateFile = (f: File | null | undefined): string | null => {
    if (!f) return "Nenhum arquivo selecionado.";
    if (!f.type?.startsWith("image/")) return "Apenas imagens são permitidas.";
    if (f.size > MAX_BYTES) return "A imagem deve ter no máximo 1MB.";
    return null;
  };

  const setSelectedFile = (f: File | null | undefined) => {
    const err = validateFile(f);
    if (err) {
      setStatusMsg(err);
      setFile(null);
      setResult(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setStatusMsg("");
    setFile(f as File);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSelectedFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    setSelectedFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || loading) return;

    setResult(null);
    setStatusMsg("Analisando imagem...");
    setLoading(true);
    try {
      const data = await apiAnalyzeImage(file);
      setResult(data);
      setStatusMsg("");
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      const isLimit = err?.status === 429 || /limite|quota|atingid/.test(msg);
      if (isLimit) {
        warn("Limite diário de análises de imagens atingido!");
        setStatusMsg("Limite diário de análises de imagens atingido.");
      } else {
        error("Erro ao analisar imagem!");
        setStatusMsg(err?.message || "Erro ao analisar a imagem.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const hasFile = !!file;

  return (
    <>
      <form className={styles["image-form"]} onSubmit={submit} noValidate>
        {!hasFile && (
          <div
            className={styles["image-dropzone"]}
            onDragOver={onDragOver}
            onDrop={onDrop}
            role="button"
            onClick={onPick}
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
            aria-label="Arraste e solte uma imagem ou clique para fazer upload"
          >
            <div className={styles["image-dropzone__icon"]} aria-hidden />
            <img src={imageIcon} alt="" />
            <p className={styles["image-dropzone__text"]}>
              Arraste e solte a imagem aqui ou clique no botão abaixo para fazer o upload
            </p>
            <button type="button" className={styles["image-dropzone__cta"]}>
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
          <div className={styles["image-capsule"]}>
            <img
              src={imageIcon}
              alt=""
              className={styles["image-capsule__icon-img"]}
              aria-hidden
            />

            <div className={styles["image-capsule__name"]} title={file?.name}>
              {file?.name}
            </div>

            <button
              type="button"
              className={styles["image-capsule__clear"]}
              aria-label="Remover arquivo"
              onClick={clearFile}
              disabled={loading}
              title="Remover"
            >
              ×
            </button>

            <button
              type="submit"
              className={styles["image-capsule__submit"]}
              disabled={!hasFile || loading}
            >
              Verificar
            </button>
          </div>
        )}

        {statusMsg && (
          <p
            className={`${styles["image-form__hint"]} ${
              loading ? "is-loading" : "is-error"
            }`}
          >
            {statusMsg}
          </p>
        )}
      </form>

      {result && <AnalysisCard data={result} />}
    </>
  );
}
