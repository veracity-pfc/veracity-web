import React, { useEffect } from 'react';
import '../styles/legal.css';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.body.classList.add('bare-page');
    return () => document.body.classList.remove('bare-page');
  }, []);

  return (
    <main className="container">
      <section className="page-offset" style={{ paddingBottom: 32 }}>
        <h1 className="about-title">Veracity — Política de Privacidade</h1>

        <p><strong>Versão:</strong> 1.1 &nbsp;•&nbsp; <strong>Data de vigência:</strong> 03 de novembro de 2025</p>
        <p>
          Esta Política descreve como o Veracity trata dados pessoais e dados técnicos durante o uso do serviço,
          em conformidade com a Lei nº 13.709/2018 (LGPD). Ao utilizar o protótipo, você concorda com as práticas
          aqui descritas.
        </p>

        <h3>1. Controlador e Encarregado (DPO)</h3>
        <p>
          <strong>Controlador:</strong> Equipe Veracity (projeto acadêmico).<br/>
          <strong>Encarregado (DPO):</strong> será divulgado na aplicação quando da disponibilização pública do canal.
        </p>

        <h3>2. Quais dados coletamos</h3>
        <ul>
          <li><strong>Dados de conta</strong> (quando você cria cadastro): nome, e-mail, hash de senha, status de verificação, aceites e carimbos de data/hora.</li>
          <li><strong>Dados técnicos e de auditoria</strong>: registros de uso para segurança e prevenção a abuso, incluindo hash de IP com sal, identificadores técnicos, horários de eventos, contadores/quotas por tipo de análise e metadados mínimos necessários.</li>
          <li><strong>Conteúdo submetido</strong>: URLs e imagens enviadas para análise, bem como artefatos gerados (resultados, rótulos/risco, explicações e recomendações).</li>
          <li><strong>Cookies e armazenamento local</strong>: cookies estritamente necessários e/ou tokens de sessão; quando aplicável, preferências de interface.</li>
        </ul>

        <h3>3. Para que usamos os dados (finalidades) e bases legais</h3>
        <ul>
          <li><strong>Prestar o serviço do protótipo</strong> (analisar links/imagens, exibir resultados, gerenciar conta e quotas) — <em>execução de contrato</em>/<em>procedimentos preliminares</em>.</li>
          <li><strong>Segurança e integridade</strong> (auditoria, prevenção a abuso, investigação de incidentes) — <em>legítimo interesse</em> e <em>cumprimento de obrigação legal/regulatória</em>, quando aplicável.</li>
          <li><strong>Melhoria acadêmica</strong> do protótipo (métricas agregadas e anonimizadas) — <em>legítimo interesse</em>.</li>
          <li><strong>Comunicações transacionais</strong> (verificação de e-mail, avisos de segurança) — <em>execução de contrato</em>/<em>legítimo interesse</em>.</li>
          <li><strong>Cookies não essenciais/analíticos</strong> (quando utilizados) — <em>consentimento</em>, que pode ser revogado a qualquer momento.</li>
        </ul>

        <h3>4. Com quem compartilhamos</h3>
        <p>
          Compartilhamos dados com <strong>operadores</strong> estritamente necessários à operação do protótipo
          (por exemplo: hospedagem e banco de dados, envio de e-mails transacionais, verificação de segurança de URLs,
          provedores de análise automatizada de imagens/IA). Esses terceiros tratam dados segundo nossas instruções
          contratuais e medidas de segurança compatíveis com a LGPD.
        </p>

        <h3>5. Transferências internacionais</h3>
        <p>
          Podem ocorrer transferências para provedores no exterior. Nesses casos, adotamos salvaguardas adequadas,
          como cláusulas contratuais, criptografia em trânsito/repouso e controles de acesso.
        </p>

        <h3>6. Retenção e eliminação</h3>
        <ul>
          <li><strong>Conta</strong>: mantida enquanto ativa e pelo período necessário para obrigações acadêmicas/legais.</li>
          <li><strong>Logs de auditoria</strong>: mantidos pelo prazo mínimo necessário para segurança e prevenção a abuso.</li>
          <li><strong>Conteúdo submetido</strong>: retido pelo tempo necessário à análise, exibição no histórico do usuário e validação acadêmica; pode ser removido antecipadamente conforme limitações técnicas.</li>
        </ul>
        <p>
          Em caso de <strong>exclusão de conta</strong>, realizamos desvinculação e/ou pseudoanonimização quando tecnicamente viável,
          preservando apenas registros mínimos necessários à segurança e integridade do sistema.
        </p>

        <h3>7. Direitos do titular</h3>
        <p>
          Você pode exercer os direitos previstos na LGPD (confirmação de tratamento, acesso, correção, anonimização,
          portabilidade, eliminação, informação sobre compartilhamento, revogação de consentimento e revisão de decisões
          automatizadas) pelo canal que será disponibilizado na aplicação. Responderemos em prazos compatíveis com a lei.
        </p>

        <h3>8. Cookies e tecnologias similares</h3>
        <p>
          Utilizamos cookies <strong>estritamente necessários</strong> para autenticação e funcionamento básico. Quando aplicável,
          poderemos utilizar cookies <strong>analíticos</strong> ou de <strong>preferências</strong> mediante consentimento.
          Você pode gerenciar cookies nas configurações do navegador; a remoção de cookies essenciais pode afetar o uso.
        </p>

        <h3>9. Segurança da informação</h3>
        <p>
          Adotamos medidas técnicas e organizacionais compatíveis com o porte acadêmico do projeto, tais como criptografia
          em trânsito, hash de credenciais, controle de acesso e registros de auditoria com minimização e pseudoanonimização
          (por exemplo, hash de IP com sal). Nenhuma medida é infalível; trabalhamos para melhorar continuamente.
        </p>

        <h3>10. Decisões automatizadas e perfis</h3>
        <p>
          As classificações de risco/rotulagem são resultantes de processamento automatizado e servem como apoio
          à decisão do usuário, não produzindo efeitos jurídicos por si sós. Sempre que possível, exibimos explicações
          resumidas do resultado.
        </p>

        <h3>11. Crianças e adolescentes</h3>
        <p>
          O serviço não é direcionado a crianças. Caso identifiquemos dados de crianças coletados inadvertidamente,
          adotaremos medidas para remoção adequada.
        </p>

        <h3>12. Incidentes e notificações</h3>
        <p>
          Em caso de incidente de segurança que possa acarretar risco ou dano relevante, avaliaremos o ocorrido e,
          quando exigido, notificaremos autoridades e titulares afetados pelos meios disponíveis (por exemplo, e-mail).
        </p>

        <h3>13. Alterações desta Política</h3>
        <p>
          Podemos atualizar esta Política a qualquer tempo. A versão vigente é a última publicada na aplicação.
          O uso contínuo após alterações indica ciência e concordância.
        </p>

        <h3>14. Contatos</h3>
        <p>
          Publicaremos na aplicação o canal para requisições de titulares (LGPD) e o contato do Encarregado (DPO).
        </p>
      </section>
    </main>
  );
}
