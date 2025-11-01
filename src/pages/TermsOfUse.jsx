import React, { useEffect } from 'react';
import '../styles/legal.css';

export default function TermsOfUse() {
  useEffect(() => {
    document.body.classList.add('bare-page');
    return () => document.body.classList.remove('bare-page');
  }, []);

  return (
    <main className="container">
      <section className="page-offset" style={{ paddingBottom: 32 }}>
        <h1 className="about-title">Veracity — Termo de Uso</h1>
        <p><strong>Versão:</strong> 1.0 &nbsp;•&nbsp; <strong>Data de vigência:</strong> 11 de outubro de 2025</p>
        <p>
          Este Termo de Uso estabelece as regras aplicáveis ao uso do serviço “Veracity”, protótipo acadêmico
          de conclusão de curso (PFC) para detecção de indícios de manipulação digital.
        </p>

        <h3>1. Definições</h3>
        <p>Usuário, Conta, Conteúdo, Resultado de Análise e Equipe Veracity.</p>

        <h3>2. Escopo e natureza acadêmica</h3>
        <p>
          O Veracity é um protótipo; resultados são indicativos e podem mudar sem aviso. Integra serviços de terceiros.
        </p>

        <h3>3. Requisitos de uso</h3>
        <p>Uso lícito; vedado envio de conteúdo ilegal, sem autorização ou com dados pessoais sensíveis desnecessários.</p>

        <h3>4. Conta e autenticação (quando aplicável)</h3>
        <p>Cadastro e login podem ser necessários. O Usuário deve manter suas credenciais em sigilo.</p>

        <h3>5. Submissão de Conteúdo</h3>
        <p>Licença não exclusiva e limitada para processar e armazenar o conteúdo para operação/avaliação acadêmica.</p>

        <h3>6. Resultados e responsabilidades</h3>
        <p>Podem ocorrer falsos positivos/negativos; a decisão de uso é do Usuário.</p>

        <h3>7. Conteúdos proibidos</h3>
        <p>Proibido material ilegal, dados sensíveis sem necessidade, entre outros.</p>

        <h3>8. Propriedade intelectual</h3>
        <p>É vedado copiar, modificar, distribuir ou realizar engenharia reversa sem autorização.</p>

        <h3>9. Limitações de responsabilidade</h3>
        <p>Serviço fornecido “no estado em que se encontra” e “conforme disponível”.</p>

        <h3>10. Suspensão e encerramento</h3>
        <p>Acesso pode ser suspenso em caso de violação; o projeto pode ser descontinuado.</p>

        <h3>11. Alterações</h3>
        <p>A versão vigente é a última publicada na aplicação.</p>

        <h3>12. Contato e foro</h3>
        <p>Contato do DPO e foro competente a serem definidos conforme implementação final.</p>
      </section>
    </main>
  );
}
