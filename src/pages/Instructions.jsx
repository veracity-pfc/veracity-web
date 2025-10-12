import React, { useState } from 'react';

const linkSteps = [
  {
    title: 'Insira a URL',
    text: 'Preencha o campo com uma URL válida e pressione o botão "Verificar". A URL deve possuir no máximo 60 caracteres.'
  },
  {
    title: 'Verificações',
    text: 'Checamos reputação do domínio, possíveis typosquattings e sinais de phishing.'
  },
  {
    title: 'Classificação',
    text: 'A URL é classificada como Segura, Suspeita ou Falsa com base nas análises realizadas.'
  },
  {
    title: 'Resultado',
    text: 'Após a conclusão da análise, o resumo, explicação e recomendações práticas serão exibidas na tela.'
  }
];

const imageSteps = [
  {
    title: 'Envie a imagem',
    text: 'Envie o arquivo para verificação. A imagem deve estar no formato .png ou .jpeg. e ter no máximo 50MB de tamanho.'
  },
  {
    title: 'Processamento',
    text: 'Aplicamos verificações visuais e heurísticas para indícios de manipulação.'
  },
  {
    title: 'Interpretação',
    text: 'Consolidamos os achados e avaliamos a probabilidade de falsificação.'
  },
  {
    title: 'Resultado',
    text: 'Exibimos o parecer e recomendações de como proceder com a imagem.'
  }
];

function Steps({ title, steps }) {
  const [active, setActive] = useState(0);

  return (
    <section className="instructions-block container">
      <h2 className="instructions-title">{title}</h2>

      <div className="steps-wrap">
        <div className="steps-bar">
          {[0,1,2,3].map(i => (
            <button
              key={i}
              type="button"
              className={`step-btn ${active === i ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              aria-label={`Etapa ${i+1}: ${steps[i].title}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="step-text">
          <p className="step-heading">
            <strong>{steps[active].title}</strong>
          </p>
          <p className="step-body">{steps[active].text}</p>
        </div>
      </div>
    </section>
  );
}

export default function Instructions() {
  return (
    <main>
      <section className="hero">
        <h1>Detectando manipulações<br/>com inteligência</h1>
        <p className="sub">Verifique a autenticidade de conteúdos digitais</p>
      </section>

      <Steps title="Análise de links" steps={linkSteps} />
      <Steps title="Análise de imagens" steps={imageSteps} />
    </main>
  );
}
