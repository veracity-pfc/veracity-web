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

        <p><strong>Versão:</strong> 1.1 &nbsp;•&nbsp; <strong>Data de vigência:</strong> 03 de novembro de 2025</p>
        <p>
          Este Termo de Uso estabelece as regras aplicáveis ao uso do “Veracity”, protótipo acadêmico (PFC)
          destinado à detecção de indícios de manipulação digital em links e imagens. O uso do serviço implica
          ciência e aceitação integral destes termos.
        </p>

        <h3>1. Definições</h3>
        <p>
          <strong>Usuário:</strong> pessoa que utiliza a plataforma, autenticada ou não. <br />
          <strong>Conta:</strong> registro com nome, e-mail e senha, que pode exigir verificação por e-mail. <br />
          <strong>Conteúdo:</strong> URLs, imagens e metadados submetidos para análise. <br />
          <strong>Análise:</strong> processamento automático de um Conteúdo (link ou imagem) e respectivos artefatos
          técnicos (ex.: retorno de serviços terceiros e resposta de IA). <br />
          <strong>Resultado de Análise:</strong> rótulo/risco, explicação/resumo e recomendações exibidos ao Usuário. <br />
          <strong>Equipe Veracity:</strong> responsáveis pelo desenvolvimento acadêmico do protótipo.
        </p>

        <h3>2. Escopo e natureza acadêmica</h3>
        <p>
          O Veracity é um protótipo acadêmico, fornecido “no estado em que se encontra” e “conforme disponível”,
          sujeito a falhas e mudanças sem aviso. Os resultados são <em>indicativos</em> e não constituem verificação
          forense definitiva. A plataforma integra serviços de terceiros para e-mail, segurança e análise automática.
        </p>

        <h3>3. Requisitos de uso</h3>
        <p>
          O Usuário compromete-se a utilizar o serviço de modo lícito e responsável, abstendo-se de enviar material
          ilegal ou que viole direitos de terceiros. Evite fornecer dados pessoais sensíveis desnecessários. É vedado
          tentar burlar limites de uso, realizar testes de intrusão sem autorização ou qualquer ato que comprometa a
          segurança operacional.
        </p>

        <h3>4. Conta, autenticação e verificação</h3>
        <p>
          Algumas funcionalidades exigem cadastro, login e verificação de e-mail. O Usuário deve manter suas
          credenciais em sigilo e é responsável pelas atividades realizadas na conta. O token de acesso possui prazo
          de expiração e poderá exigir nova autenticação. O não cumprimento destes termos pode resultar em suspensão
          ou encerramento da conta.
        </p>

        <h3>5. Aceite dos Termos</h3>
        <p>
          O aceite dos Termos de Uso pode ser registrado durante o fluxo de cadastro/verificação de e-mail.
          A continuidade de uso após alterações também representa aceite da versão vigente.
        </p>

        <h3>6. Submissão de Conteúdo e licença limitada</h3>
        <p>
          Ao submeter Conteúdo, o Usuário concede licença <em>não exclusiva</em>, <em>revogável</em> e
          <em> limitada</em> à Equipe Veracity para processar, armazenar temporariamente e utilizar tal Conteúdo com a
          finalidade de operar, melhorar e avaliar academicamente o protótipo. O Usuário declara possuir autorização
          para uso do Conteúdo enviado.
        </p>

        <h3>7. Limites de uso (quotas)</h3>
        <p>
          Para garantir estabilidade, aplicam-se limites de uso por perfil:
        </p>
        <ul>
          <li>Usuários anônimos: até 2 análises de links/dia e 1 análise de imagem/dia.</li>
          <li>Usuários autenticados: até 5 análises de links/dia e 3 análises de imagem/dia.</li>
        </ul>
        <p>
          Os limites podem ser ajustados a qualquer tempo por motivos técnicos e/ou acadêmicos.
        </p>

        <h3>8. Resultados, riscos e responsabilidades</h3>
        <p>
          Podem ocorrer falsos positivos/negativos. O Resultado de Análise serve como apoio e não substitui avaliação
          humana, políticas internas ou perícia. A decisão de uso e as consequências decorrentes cabem exclusivamente
          ao Usuário.
        </p>

        <h3>9. Privacidade e registros</h3>
        <p>
          O Veracity pode registrar eventos de uso para segurança e auditoria (por exemplo, ações de autenticação e
          análises realizadas), incluindo hash de IP com sal, identificador de usuário autenticado, horário do evento
          e metadados mínimos necessários. Esses registros ajudam a prevenir abuso, investigar incidentes e medir
          capacidade do sistema. Quando possível, os dados são minimizados e/ou pseudoanonimizados.
        </p>

        <h3>10. Integradores e provedores terceiros</h3>
        <p>
          O protótipo utiliza serviços de terceiros, incluindo, por exemplo: envio de e-mails transacionais;
          verificação de segurança de URLs; provedores de infraestrutura e bibliotecas de autenticação/criptografia.
          O uso está sujeito também aos termos e políticas desses provedores.
        </p>

        <h3>11. Conteúdos proibidos</h3>
        <p>
          É proibido enviar: material ilegal; dados pessoais sensíveis sem necessidade; conteúdo que viole direitos
          de terceiros; imagens ou links com finalidade de assédio, exploração, incitação à violência, discriminação
          ou atividades fraudulentas; bem como qualquer tentativa de exploração do protótipo.
        </p>

        <h3>12. Propriedade intelectual</h3>
        <p>
          O código, identidade visual e demais ativos do Veracity são protegidos. É vedado copiar, modificar,
          distribuir, disponibilizar publicamente, realizar engenharia reversa ou criar obras derivadas sem autorização
          expressa da Equipe Veracity.
        </p>

        <h3>13. Limitações de responsabilidade</h3>
        <p>
          Na máxima extensão permitida pela legislação aplicável, a Equipe Veracity não se responsabiliza por danos
          diretos ou indiretos decorrentes do uso ou impossibilidade de uso do protótipo, incluindo perda de dados,
          lucros cessantes, interrupções ou imprecisões de resultados.
        </p>

        <h3>14. Suspensão, encerramento e exclusão de conta</h3>
        <p>
          O acesso poderá ser suspenso ou encerrado em caso de violação destes termos ou por motivos técnicos. Em caso
          de exclusão de conta, esforços razoáveis serão feitos para desvincular dados pessoais dos registros de uso,
          mantendo-se logs mínimos necessários à segurança e integridade do sistema, conforme base legal aplicável.
        </p>

        <h3>15. Alterações</h3>
        <p>
          Os termos podem ser atualizados a qualquer momento. A versão vigente é a última publicada na aplicação. O
          uso contínuo após alterações representa aceite.
        </p>

        <h3>16. Contato e foro</h3>
        <p>
          Canal de contato acadêmico será disponibilizado na própria aplicação. Fica eleito o foro da
          região de domicílio do Usuário, salvo disposição legal em contrário.
        </p>
      </section>
    </main>
  );
}
