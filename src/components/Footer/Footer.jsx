import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo.jsx';
import styles from './Footer.module.css';

const cx = (...xs) => xs.filter(Boolean).join(' ');

export default function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const goHomeWithTab = (tab) => (e) => {
    e.preventDefault();
    navigate({ pathname: '/', search: `?tab=${tab}` });
  };

  return (
    <footer className={styles['site-footer']}>
      <div className={cx('container', styles['footer-box'])}>
        <div className={styles['footer-inner']}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Logo />
            </div>
            <div className={styles['footer-links']}>
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/privacy-policy', '_blank', 'noopener');
                }}
              >
                Política de privacidade
              </a>
              <a
                href="/terms-of-use"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/terms-of-use', '_blank', 'noopener');
                }}
              >
                Termos de uso
              </a>
            </div>
          </div>

          <div>
            <div className={styles['footer-title']}>Serviços</div>
            <div className={styles['footer-links']}>
              <a href="/?tab=urls" onClick={goHomeWithTab('urls')}>Análise de URLs</a>
              <a href="/?tab=images" onClick={goHomeWithTab('images')}>Análise de imagens</a>
              <a href="/user/history">Histórico de análises</a>
            </div>
          </div>

          <div>
            <div className={styles['footer-title']}>Informação</div>
            <div className={styles['footer-links']}>
              <a href="/about">Conheça nossa história</a>
              <a href="/contact-us">Entre em contato conosco</a>
              <a href="/instructions">Como utilizar a plataforma</a>
            </div>
          </div>
        </div>
      </div>

      <div className={cx('container', styles.copy)}>
        Veracity - {year} © Todos os direitos reservados. | Desenvolvido por Manuela Rios - manuela.rios@veracity.com
      </div>
    </footer>
  );
}
