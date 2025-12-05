import { JSX, useEffect } from 'react';
import '../styles/legal.css';

export default function TermsOfUse(): JSX.Element {
  useEffect(() => {
    document.body.classList.add('bare-page');
    return () => document.body.classList.remove('bare-page');
  }, []);

  return (
    <main className="container">
      <section className="page-offset" style={{ paddingBottom: 32 }}>
        <h1 className="about-title">Veracity — Termos de Uso</h1>

        <p><strong>Versão:</strong> 1.2 • <strong>Data de vigência:</strong> 24 de novembro de 2025</p>
        <p>
          Este Termo de Uso estabelece as regras aplicáveis ao uso do “Veracity”, protótipo acadêmico (PFC)
          destinado à detecção de indícios de manipulação digital em links e imagens. O uso do serviço implica
          ciência e aceitação integral destes termos.
        </p>

        <h3>1. Definições</h3>
        <p>
          <strong>Usuário:</strong> pessoa que utiliza a plataforma, autenticada ou não.<br />
          <strong>Conta:</strong> registro com nome, e-mail e senha, que pode exigir verificação por e-mail.<br />
          <strong>Conteúdo:</strong> URLs, imagens e metadados submetidos para análise.<br />
          <strong>Análise:</strong> processamento automático de um Conteúdo e seus artefatos técnicos.<br />
          <strong>Resultado de Análise:</strong> rótulo/risco, explicação e recomendações exibidas ao Usuário.<br />
          <strong>Equipe Veracity:</strong> responsáveis pelo desenvolvimento acadêmico.<br />
          <strong>Infraestrutura:</strong> serviços de hospedagem Render e proteção Cloudflare utilizados pelo protótipo.
        </p>

        <h3>2. Escopo e natureza acadêmica</h3>
        <p>
          O Veracity é um protótipo acadêmico, fornecido “no estado em que se encontra” e “conforme disponível”,
          sujeito a falhas e mudanças sem aviso. Os resultados são indicativos e não constituem verificação forense
          ou parecer profissional.
        </p>

        <h3>3. Requisitos de uso</h3>
        <p>
          O Usuário compromete-se a utilizar o serviço de modo lícito e responsável. É proibido enviar material
          ilegal, abusivo ou que viole direitos de terceiros. Também é vedado tentar burlar limites de uso,
          explorar vulnerabilidades, realizar testes de intrusão ou comprometer a segurança do sistema.
        </p>

        <h3>4. Conta, autenticação e verificação</h3>
        <p>
          Algumas funcionalidades exigem cadastro e verificação de e-mail. O Usuário é responsável pela guarda de suas
          credenciais. Tokens de acesso têm validade e podem exigir renovação. Violações destes termos podem resultar
          em suspensão ou encerramento da conta.
        </p>

        <h3>5. Aceite dos Termos</h3>
        <p>
          O aceite pode ocorrer durante o cadastro e durante o uso contínuo da aplicação. Alterações posteriores serão
          comunicadas na própria plataforma.
        </p>

        <h3>6. Submissão de Conteúdo e licença limitada</h3>
        <p>
          Ao submeter Conteúdo, o Usuário concede licença não exclusiva, revogável e limitada para que a Equipe Veracity
          processe e armazene temporariamente esse Conteúdo com o fim de operar e avaliar academicamente o protótipo.
        </p>

        <h3>7. Limites de uso (quotas)</h3>
        <p>Para garantir estabilidade, aplicam-se limites de uso:</p>
        <ul>
          <li>Usuários anônimos: até 5 análises de URL/dia e 2 análise de imagem/dia.</li>
          <li>Usuários autenticados: até 10 análises de URL/dia e 4 análises de imagem/dia.</li>
        </ul>

        <h3>8. Resultados, riscos e responsabilidades</h3>
        <p>
          A análise pode apresentar falsos positivos/negativos. O resultado é meramente indicativo. O uso e qualquer
          decisão decorrente são de responsabilidade exclusiva do Usuário.
        </p>

        <h3>9. Privacidade e registros</h3>
        <p>
          O Veracity registra eventos de autenticação, uso e estatísticas mínimas para segurança.  
          Tais registros podem incluir: hash de IP com sal, data/hora, identificador de usuário, quotas e metadados.
        </p>
        <p>
          A proteção de tráfego, firewall de aplicação, mitigação de bots e rate limiting são fornecidos pelo Cloudflare,
          que também processa informações técnicas de conexão, como IP de origem, user-agent e características de rede,
          conforme suas próprias políticas.
        </p>

        <h3>10. Integradores e provedores terceiros</h3>
        <p>
          O protótipo utiliza serviços de terceiros, incluindo:
        </p>
        <ul>
          <li><strong>Render:</strong> hospedagem, deploy e execução da aplicação.</li>
          <li><strong>Cloudflare:</strong> mitigação de DDoS, rate limiting e DNS.</li>
          <li><strong>Neon:</strong> hospedagem do banco de dados.</li>
          <li><strong>Resend:</strong> serviço de e-mail transacional.</li>
          <li>Serviços de e-mail transacional.</li>
          <li>APIs externas para análise de segurança ou processamento de imagem.</li>
        </ul>
        <p>
          O uso desses serviços está sujeito aos termos e políticas de cada fornecedor.
        </p>

        <h3>11. Conteúdos proibidos</h3>
        <p>
          É proibido enviar dados sensíveis sem necessidade, material ilegal, conteúdo ofensivo, discriminatório,
          fraudulento ou que busque explorar o sistema.
        </p>

        <h3>12. Propriedade intelectual</h3>
        <p>
          Todo o código, design e conteúdo do Veracity são protegidos. É proibido copiar, modificar, redistribuir,
          realizar engenharia reversa ou criar obras derivadas sem autorização.
        </p>

        <h3>13. Limitações de responsabilidade</h3>
        <p>
          Na máxima extensão permitida pela lei, a Equipe Veracity não se responsabiliza por danos diretos ou indiretos,
          indisponibilidade, perda de dados ou imprecisões do sistema.
        </p>

        <h3>14. Suspensão, encerramento e exclusão de conta</h3>
        <p>
          O acesso pode ser suspenso em caso de violação dos termos ou por motivos técnicos. Na exclusão de conta, dados
          pessoais serão removidos ou pseudoanonimizados, mantendo-se logs mínimos para segurança.
        </p>

        <h3>15. Transferências internacionais</h3>
        <p>
          A infraestrutura do Render e Cloudflare pode realizar processamento fora do Brasil. O uso do Veracity implica
          ciência dessa transferência internacional para fins de operação da aplicação.
        </p>

        <h3>16. Alterações</h3>
        <p>
          Os termos podem ser atualizados a qualquer momento. O uso contínuo representará aceite da versão vigente.
        </p>

        <h3>17. Contato e foro</h3>
        <p>
          O contato acadêmico estará disponível na plataforma. Aplica-se o foro da região de domicílio do Usuário,
          salvo disposição legal em contrário.
        </p>
      </section>
    </main>
  );
}
