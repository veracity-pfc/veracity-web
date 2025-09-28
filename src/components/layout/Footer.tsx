import eye from '../../assets/veracity-eye.png';
import wordmark from '../../assets/veracity-wordmark.png';

export default function Footer() {
  return (
    <>
      <footer className="v-footer">
        <div className="v-footer__grid">
          <div className="v-foot-col">
            <div className="v-foot-logo">
              <img src={eye} alt="Veracity" className="v-brand__logo" />
              <img src={wordmark} alt="Veracity" className="v-brand__word" />
            </div>
            <a href="#politica-privacidade">Política de privacidade</a>
            <a href="#termos-uso">Termos de uso</a>
          </div>

          <div className="v-foot-col">
            <h4>Serviços</h4>
            <a href="#s-analise-links">Análise de links</a>
            <a href="#s-analise-imagens">Análise de imagens</a>
            <a href="#s-historico">Histórico de análises</a>
          </div>

          <div className="v-foot-col">
            <h4>Informação</h4>
            <a href="#historia">Conheça nossa história</a>
            <a href="#contato">Entre em contato conosco</a>
            <a href="#como-usar">Como utilizar a plataforma</a>
          </div>
        </div>
      </footer>

      <div className="v-copyright">Veracity — 2025 © Todos os direitos reservados.</div>
    </>
  );
}
