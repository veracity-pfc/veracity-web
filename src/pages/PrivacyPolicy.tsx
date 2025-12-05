import { JSX, useEffect } from 'react';
import '../styles/legal.css';

export default function PrivacyPolicy(): JSX.Element {
  useEffect(() => {
    document.body.classList.add('bare-page');
    return () => document.body.classList.remove('bare-page');
  }, []);

  return (
    <main className="container">
      <section className="page-offset" style={{ paddingBottom: 32 }}>
        <h1 className="about-title">Veracity — Política de Privacidade</h1>

        <p><strong>Versão:</strong> 1.3 • <strong>Data de vigência:</strong> 24 de novembro de 2025</p>
        <p>
          Esta Política descreve como o Veracity trata dados pessoais e dados técnicos durante o uso do serviço,
          em conformidade com a LGPD. Ao utilizar o protótipo, você concorda com as práticas aqui descritas.
        </p>

        <h3>1. Controlador e Encarregado (DPO)</h3>
        <p>
          <strong>Controlador:</strong> Equipe Veracity (projeto acadêmico).<br />
          <strong>Encarregado (DPO):</strong> Manuela Alves Rios da Silva - manuela.rios.silva@gmail.com
        </p>

        <h3>2. Quais dados coletamos</h3>
        <ul>
          <li><strong>Dados de conta:</strong> nome, e-mail, hash de senha, status e carimbos de data/hora.</li>
          <li><strong>Dados de auditoria:</strong> hash de IP com sal, user-agent, eventos de login, quotas e métricas.</li>
          <li><strong>Conteúdo submetido:</strong> URLs, imagens e resultados derivados.</li>
          <li><strong>Armazenamento local:</strong> token JWT de autenticação e preferências essenciais.</li>
          <li><strong>Dados processados pelo Cloudflare:</strong> IP, cabeçalhos, assinaturas de tráfego, informações de dispositivo e verificações de segurança para mitigação de ataques.</li>
        </ul>

        <h3>3. Finalidades e bases legais</h3>
        <ul>
          <li><strong>Operação do serviço</strong> — execução de contrato.</li>
          <li><strong>Segurança</strong> — legítimo interesse e obrigação legal/regulatória.</li>
          <li><strong>Proteção via Cloudflare</strong> — legítimo interesse.</li>
          <li><strong>Métricas acadêmicas</strong> — legítimo interesse, com dados anonimizados.</li>
          <li><strong>Comunicações transacionais</strong> — execução de contrato.</li>
        </ul>

        <h3>4. Compartilhamento com terceiros</h3>
        <p>
          Compartilhamos dados com operadores essenciais:
        </p>
        <ul>
          <li><strong>Render:</strong> hospedagem, deploy e execução da aplicação.</li>
          <li><strong>Cloudflare:</strong>mitigação de DDoS, cache e roteamento seguro.</li>
          <li><strong>Neon:</strong> hospedagem do banco de dados.</li>
          <li><strong>Resend:</strong> serviço de e-mail transacional.</li>
          <li>APIs externas de análise de segurança e imagens.</li>
        </ul>

        <h3>5. Transferências internacionais</h3>
        <p>
          Render e Cloudflare podem processar dados em datacenters localizados fora do Brasil.
          Aplicamos salvaguardas adequadas, incluindo criptografia, controle de acesso e minimização dos dados enviados.
        </p>

        <h3>6. Retenção e eliminação</h3>
        <ul>
          <li><strong>Conta:</strong> mantida enquanto ativa e pelo tempo necessário para fins acadêmicos/legais.</li>
          <li><strong>Logs:</strong> retidos pelo prazo mínimo necessário para segurança.</li>
          <li><strong>Conteúdo submetido:</strong> armazenado temporariamente e mantido no histórico do usuário.</li>
        </ul>
        <p>
          Usuários que excluírem suas contas terão seus dados pessoais removidos ou pseudoanonimizados, mantendo-se apenas registros indispensáveis.
        </p>

        <h3>7. Direitos do titular</h3>
        <p>
          O Usuário pode solicitar confirmação de tratamento, acesso, correção, anonimização, informação sobre terceiros,
          eliminação (quando aplicável) e revogação de consentimento.
        </p>

        <h3>8. Cookies e tecnologias similares</h3>
        <p>
          O Veracity não utiliza cookies próprios para autenticação, rastreamento ou preferências. A autenticação é
          realizada exclusivamente por meio de tokens JWT armazenados no localStorage e enviados pelo cabeçalho
          Authorization.
        </p>
        <p>
          O Cloudflare pode definir cookies técnicos essenciais, como <code>__cf_bm</code> e <code>cf_clearance</code>,
          destinados à proteção contra bots, verificação de tráfego e mitigação de ataques. Esses cookies não contêm dados
          pessoais identificáveis e não são acessados ou utilizados pelo Veracity.
        </p>

        <h3>9. Segurança da informação</h3>
        <p>
          Adotamos criptografia em trânsito (HTTPS), hash de credenciais, controle de acesso e registros de auditoria.
          A proteção adicional é garantida pelo Cloudflare (mitigação de bots, rate limiting e caches seguros).
        </p>

        <h3>10. Decisões automatizadas</h3>
        <p>
          A classificação de URLs e imagens é automática e não produz efeitos jurídicos, servindo como ferramenta de apoio.
        </p>

        <h3>11. Crianças e adolescentes</h3>
        <p>
          O serviço não é destinado a crianças. Caso dados sejam inseridos indevidamente, serão removidos.
        </p>

        <h3>12. Incidentes e notificações</h3>
        <p>
          Em caso de incidente com risco ou dano relevante, notificaremos autoridades e usuários conforme exigido pela LGPD.
        </p>

        <h3>13. Alterações desta Política</h3>
        <p>
          Podemos atualizar esta Política a qualquer momento. A versão vigente será sempre a mais recente publicada.
        </p>

        <h3>14. Contatos</h3>
        <p>
          O canal oficial para exercer direitos será disponibilizado na própria aplicação.
        </p>
      </section>
    </main>
  );
}
