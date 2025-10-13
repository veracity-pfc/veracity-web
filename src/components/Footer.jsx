import React from 'react';
import Logo from './Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-box">
        <div className="footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Logo />
            </div>
            <div className="footer-links">
              <a href="#">Política de privacidade</a>
              <a href="#">Termos de uso</a>
            </div>
          </div>

          <div>
            <div className="footer-title">Serviços</div>
            <div className="footer-links">
              <a href="#">Análise de links</a>
              <a href="#">Análise de imagens</a>
              <a href="#">Histórico de análises</a>
            </div>
          </div>

          <div>
            <div className="footer-title">Informação</div>
            <div className="footer-links">
              <a href="/about">Conheça nossa história</a>
              <a href="/contact-us">Entre em contato conosco</a>
              <a href="/instructions">Como utilizar a plataforma</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container copy">
        Veracity - {year} © Todos os direitos reservados. | Desenvolvido por Manuela Rios - manuela.rios@veracity.com
      </div>
    </footer>
  );
}
