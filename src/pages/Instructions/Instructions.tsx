import React, { JSX, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Instructions.module.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

type Step = { title: string; text: string };

const urlSteps: Step[] = [
  { title: 'Insira a URL', text: 'Preencha o campo com uma URL válida e pressione o botão "Verificar". A URL deve possuir no máximo 200 caracteres.' },
  { title: 'Verificações', text: 'Checamos reputação do domínio, possíveis typosquattings e sinais de phishing.' },
  { title: 'Classificação', text: 'A URL é classificada como Segura, Suspeita ou Falsa com base nas análises realizadas.' },
  { title: 'Resultado', text: 'Após a conclusão da análise, o resumo, explicação e recomendações práticas serão exibidas na tela.' }
];

const imageSteps: Step[] = [
  { title: 'Envie a imagem', text: 'Envie o arquivo para verificação. A imagem deve estar no formato .png, .jpg ou .jpeg. e ter no máximo 1MB de tamanho.' },
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

function ImportantNotice(): JSX.Element {
  return (
    <section className={cx(styles.noticeWrap, 'container')} aria-labelledby="important-notes-title">
      <div className={styles.notice}>
        <div className={styles.noticeHeader}>
          <h3 id="important-notes-title" className={styles.noticeTitle}>Observação importante</h3>
        </div>
        <p className={styles.noticeBody}>
          Usuários anônimos só podem realizar <strong>2 análises de URL</strong> e <strong>1 análise de imagem</strong> por dia.{' '}
          <Link to="/sign-up" className={styles.noticeLink}>Crie sua conta</Link> ou{' '}
          <Link to="/login" className={styles.noticeLink}>faça login</Link> para poder realizar mais análises.
        </p>
      </div>
    </section>
  );
}

function TokenNotice(): JSX.Element {
  return (
    <section className={cx(styles.noticeWrap, 'container')} aria-labelledby="token-notes-title">
      <div className={styles.notice}>
        <div className={styles.noticeHeader}>
          <h3 id="token-notes-title" className={styles.noticeTitle}>Importante sobre tokens de API</h3>
        </div>
        <p className={styles.noticeBody}>
          Tokens de API possuem <strong>limites próprios de uso</strong> para garantir a estabilidade da plataforma.
          O uso via token segue cotas específicas por período e pode ser temporariamente bloqueado em caso de abuso
          ou uso automatizado excessivo.
        </p>
        <p className={styles.noticeBody} style={{ marginTop: 6 }}>
          As análises realizadas com tokens de API são <strong>independentes do uso pela interface web</strong>,
          mas continuam sujeitas às mesmas regras de segurança e boas práticas da plataforma Veracity.
        </p>
      </div>
    </section>
  );
}

type CodeExampleProps = {
  title: string;
  description: string;
  snippet: string;
};

function CodeExample({ title, description, snippet }: CodeExampleProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.apiCard}>
      <div className={styles.apiCardHeader}>
        <div>
          <h3 className={styles.apiCardTitle}>{title}</h3>
          <p className={styles.apiCardDesc}>{description}</p>
        </div>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label="Copiar comando cURL"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className={styles.codeBlock}>
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

function ApiTokensSection(): JSX.Element {
  const authSnippet = `curl --location 'https://api.app-veracity.com.br/v1/api/auth' \\
--header 'Content-Type: application/json' \\
--data '{
  "token": "<TOKEN DE API>"
}'`;

  const imageSnippet = `curl --location 'https://api.app-veracity.com.br/v1/api/image-analysis' \\
--header 'Authorization: Bearer <TOKEN DE API>' \\
--form 'file=@"<ARQUIVO>"'`;

  const urlSnippet = `curl --location 'https://api.app-veracity.com.br/v1/api/url-analysis' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <TOKEN DE API>' \\
--data '{
  "url": "<URL>"
}'`;

  return (
    <section className={cx(styles['instructions-block'], 'container')}>
      <h2 className={styles['instructions-title']}>Uso de tokens de API</h2>

      <p className={styles.apiIntro}>
        Tokens de API permitem integrar o Veracity em outros sistemas, automatizar verificações e executar análises
        sem utilizar diretamente a interface web. Abaixo estão exemplos de requisições.
      </p>

      <div className={styles.apiGrid}>
        <CodeExample
          title="1. Autenticação do token"
          description="Valide o token de API e obtenha as informações básicas de uso."
          snippet={authSnippet}
        />
        <CodeExample
          title="2. Análise de imagem"
          description="Envie um arquivo de imagem para análise via token de API."
          snippet={imageSnippet}
        />
        <CodeExample
          title="3. Análise de URL"
          description="Envie uma URL para análise utilizando o token de API."
          snippet={urlSnippet}
        />
      </div>
    </section>
  );
}

export default function Instructions(): JSX.Element {
  const isAnonymous = useMemo(() => {
    try {
      return !localStorage.getItem('veracity_token');
    } catch {
      return true;
    }
  }, []);

  return (
    <main>
      <section className="hero">
        <h1 className={styles['instructions-h1']}>Como utilizar a plataforma</h1>
      </section>

      {isAnonymous && <ImportantNotice />}

      <Steps title="Análise de URLs" steps={urlSteps} />
      <Steps title="Análise de imagens" steps={imageSteps} />

      <ApiTokensSection />
      <TokenNotice />
    </main>
  );
}
