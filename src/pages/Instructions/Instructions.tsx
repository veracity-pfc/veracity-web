import React, { JSX, useState } from 'react';
import styles from './Instructions.module.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

type Step = { title: string; text: string };

const urlSteps: Step[] = [
  { title: 'Insira a URL', text: 'Preencha o campo com uma URL válida e pressione o botão "Verificar". A URL deve possuir no máximo 60 caracteres.' },
  { title: 'Verificações', text: 'Checamos reputação do domínio, possíveis typosquattings e sinais de phishing.' },
  { title: 'Classificação', text: 'A URL é classificada como Segura, Suspeita ou Falsa com base nas análises realizadas.' },
  { title: 'Resultado', text: 'Após a conclusão da análise, o resumo, explicação e recomendações práticas serão exibidas na tela.' }
];

const imageSteps: Step[] = [
  { title: 'Envie a imagem', text: 'Envie o arquivo para verificação. A imagem deve estar no formato .png ou .jpeg. e ter no máximo 50MB de tamanho.' },
  { title: 'Processamento', text: 'Aplicamos verificações visuais e heurísticas para indícios de manipulação.' },
  { title: 'Interpretação', text: 'Consolidamos os achados e avaliamos a probabilidade de falsificação.' },
  { title: 'Resultado', text: 'Exibimos o parecer e recomendações de como proceder com a imagem.' }
];

function Steps({ title, steps }: { title: string; steps: Step[] }): JSX.Element {
  const [active, setActive] = useState<number>(0);

  const index = Math.min(Math.max(active, 0), Math.max(steps.length - 1, 0));
  const currentStep = steps[index] ?? { title: '', text: '' };

  return (
    <section className={cx(styles['instructions-block'], 'container')}>
      <h2 className={styles['instructions-title']}>{title}</h2>

      <div className={styles['steps-wrap']}>
        <div className={styles['steps-bar']}>
          {steps.map((step, i) => (
            <button
              key={i}
              type="button"
              className={cx(styles['step-btn'], active === i && styles['is-active'])}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              aria-label={`Etapa ${i + 1}: ${step.title}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className={styles['step-text']}>
          <p className={styles['step-heading']}>
            <strong>{currentStep.title}</strong>
          </p>
          <p className={styles['step-body']}>{currentStep.text}</p>
        </div>
      </div>
    </section>
  );
}

export default function Instructions(): JSX.Element {
  return (
    <main>
      <section className="hero">
        <h1 className={styles['instructions-h1']}>Como utilizar a plataforma</h1>
      </section>
      <Steps title="Análise de URLs" steps={urlSteps} />
      <Steps title="Análise de imagens" steps={imageSteps} />
    </main>
  );
}
