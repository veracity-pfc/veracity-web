import React from "react";

const LABEL_MAP = {
  safe: "Seguro",
  suspicious: "Possivelmente falsificado ou fraudulento",
  malicious: "Malicioso",
  fake: "Falsa",
  unknown: "Desconhecido"
};

export default function AnalysisCard({ data }) {
  if (!data) return null;
  const title = LABEL_MAP[data.label] || data.label;

  return (
    <div className="analysis-card" role="region" aria-label="Resultado da análise">
      <h2 className="analysis-card__title">Resultado da análise</h2>
      <p className="analysis-card__status"><strong>Status:</strong> {title}</p>

      <div className="analysis-card__section">
        <h4>Explicação</h4>
        <p>{data.explanation}</p>
      </div>

      {Array.isArray(data.recommendations) && data.recommendations.length > 0 && (
        <div className="analysis-card__section">
          <h4>Recomendações</h4>
          <ul>
            {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
