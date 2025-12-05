import React, { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../api/client';
import Logo from '../Logo';
import styles from './Footer.module.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

function resolveRole(): string {
  const ls = (localStorage.getItem('role') || '').toLowerCase();
  if (ls) return ls;
  const t = typeof getToken === 'function' ? getToken() : null;
  if (!t) return '';
  try {
    const payload = JSON.parse(atob(t.split('.')[1] || ''));
    return String(payload.role).toLowerCase();
  } catch {
    return '';
  }
}

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = resolveRole();
    setIsAdmin(role === 'admin');
    setIsLoggedIn(!!role);
  }, []);

  const goHomeWithTab = (tab: 'urls' | 'images') => (e: React.MouseEvent<HTMLAnchorElement>) => {
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
            <div className={styles['footer-title']}>{isAdmin ? 'Administração' : 'Serviços'}</div>
            <div className={styles['footer-links']}>
              {isAdmin ? (
                <>
                  <a href="/administration">Dashboard</a>
                  <a href="/requests">Solicitações</a>
                  <a href="/tokens">Tokens de API</a>
                </>
              ) : (
                <>
                  <a href="/?tab=urls" onClick={goHomeWithTab('urls')}>
                    Análise de URLs
                  </a>
                  <a href="/?tab=images" onClick={goHomeWithTab('images')}>
                    Análise de imagens
                  </a>
                  <a href="/user/history">Histórico de análises</a>
                  {!isLoggedIn && <a href="/reactivate-account">Reativar conta</a>}
                </>
              )}
            </div>
          </div>

          <div>
            <div className={styles['footer-title']}>Informação</div>
            <div className={styles['footer-links']}>
              <a href="/about">Conheça nossa história</a>
              {!isAdmin && (
                <>
                  <a href="/contact-us">Entre em contato conosco</a>
                  <a href="/instructions">Como utilizar a plataforma</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={cx('container', styles.copy)}>
        Veracity - {year} © Todos os direitos reservados. | Desenvolvido por Manuela Rios
      </div>
    </footer>
  );
}
