import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.body.classList.add('bare-page');
    return () => document.body.classList.remove('bare-page');
  }, []);

  return (
    <main className="container">
      <section className="page-offset" style={{ paddingBottom: 32 }}>
        <h1 className="about-title">Veracity — Política de Privacidade</h1>
        <p><strong>Versão:</strong> 1.0 &nbsp;•&nbsp; <strong>Data de vigência:</strong> 11 de outubro de 2025</p>
        <p>
          Esta Política descreve como o Veracity trata dados pessoais e dados técnicos durante o uso do Serviço,
          em conformidade com a LGPD.
        </p>

        <h3>1. Controlador e Encarregado (DPO)</h3>
        <p>Controlador: Equipe Veracity (projeto acadêmico). Contato do DPO: a definir.</p>

        <h3>2. Dados coletados</h3>
        <p>Dados de conta (quando aplicável), logs e dados técnicos, e conteúdo submetido para análise.</p>

        <h3>3. Bases legais e finalidades</h3>
        <p>Prestação do serviço, segurança, melhoria do protótipo e cumprimento de obrigações legais.</p>

        <h3>4. Compartilhamento de dados</h3>
        <p>Com operadores/terceiros estritamente necessários (autenticação, hospedagem, anti-fraude, etc.).</p>

        <h3>5. Transferências internacionais</h3>
        <p>Podem ocorrer; adotadas garantias adequadas (cláusulas, criptografia, controles de acesso).</p>

        <h3>6. Retenção e eliminação</h3>
        <p>Logs e registros pelo prazo mínimo; conteúdos por tempo necessário e para validação acadêmica.</p>

        <h3>7. Direitos do titular</h3>
        <p>Direitos previstos na LGPD, com canal de contato indicado.</p>

        <h3>8. Cookies</h3>
        <p>Uso de cookies essenciais e, quando aplicável, analíticos/de preferência.</p>

        <h3>9. Segurança da informação</h3>
        <p>Medidas técnicas e organizacionais compatíveis com o porte acadêmico do projeto.</p>

        <h3>10. Decisões automatizadas</h3>
        <p>Classificações automáticas com explicações resumidas quando aplicável.</p>

        <h3>11. Crianças e adolescentes</h3>
        <p>O serviço não é direcionado a crianças; removemos dados indevidos quando detectado.</p>

        <h3>12. Incidentes e alterações</h3>
        <p>Notificações quando exigidas; a versão vigente é a última publicada.</p>

        <h3>13. Contatos</h3>
        <p>Encarregado (DPO) e canal de requisições de titulares a definir na implementação final.</p>
      </section>
    </main>
  );
}
