import { JSX } from "react";
import styles from "./AnalysisCard.module.css";

const LABEL_MAP = {
  safe: "Seguro",
  suspicious: "Possivelmente falsificado ou fraudulento",
  malicious: "Malicioso",
  fake: "Falsa",
  unknown: "Desconhecido",
} as const;

type KnownLabel = keyof typeof LABEL_MAP;

export interface AnalysisData {
  label: string; 
  explanation?: string;
  recommendations?: string[];

  url?: string;
  imageUrl?: string;
  flags?: string[];
  score?: number;
  [key: string]: unknown; 
}

interface Props {
  data?: AnalysisData | null;
}

export default function AnalysisCard({ data }: Props): JSX.Element | null {
  if (!data) return null;

  const rawLabel = String(data.label || "").toLowerCase();
  const title =
    (LABEL_MAP[rawLabel as KnownLabel] as string | undefined) || data.label;

  return (
    <div
      className={styles["analysis-card"]}
      role="region"
      aria-label="Resultado da análise"
    >
      <div className={styles["analysis-card__section"]}>
        <h3 style={{ marginTop: 0 }}>Status: {title}</h3>
      </div>

      {data.explanation && (
        <div className={styles["analysis-card__section"]}>
          <h4>Explicação</h4>
          <p>{data.explanation}</p>
        </div>
      )}

      {(data.url || data.imageUrl) && (
        <div className={styles["analysis-card__section"]}>
          <h4>Alvo analisado</h4>
          {data.url && (
            <p>
              URL:{" "}
              <a href={data.url} target="_blank" rel="noopener noreferrer">
                {data.url}
              </a>
            </p>
          )}
          {data.imageUrl && (
            <p>
              Imagem:{" "}
              <a
                href={data.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.imageUrl}
              </a>
            </p>
          )}
        </div>
      )}

      {Array.isArray(data.flags) && data.flags.length > 0 && (
        <div className={styles["analysis-card__section"]}>
          <h4>Indicadores</h4>
          <ul>
            {data.flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {typeof data.score === "number" && (
        <div className={styles["analysis-card__section"]}>
          <h4>Score</h4>
          <p>{data.score}</p>
        </div>
      )}

      {Array.isArray(data.recommendations) &&
        data.recommendations.length > 0 && (
          <div className={styles["analysis-card__section"]}>
            <h4>Recomendações</h4>
            <ul>
              {data.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
