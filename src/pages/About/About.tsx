import { JSX } from 'react';
import cover from '../../assets/about-cover.png';
import styles from './About.module.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

export default function About(): JSX.Element {
  return (
    <main className="container">
      <section className={cx(styles['about-section'], 'page-offset')}>
        <div className={styles['about-grid']}>
          <div className={styles['about-image-wrap']}>
            <img
              className={styles['about-image']}
              src={cover}
              alt="Arte do projeto Veracity"
            />
          </div>

          <div className={styles['about-content']}>
            <h2 className={styles['about-title']}>Conheça nossa história</h2>

            <p>
              O <strong>Veracity</strong> nasceu como um <strong>projeto acadêmico</strong> de
              conclusão de curso (PFC) em Engenharia de Software, com o objetivo de
              ajudar pessoas a verificarem a <strong>autenticidade de conteúdos digitais</strong>.
              A proposta surgiu ao observarmos o crescimento de golpes, desinformação e
              manipulações geradas por IA em URLs e imagens.
            </p>

            <p>
              Desde o início, o foco foi unir <strong>boas práticas de desenvolvimento de software</strong> com
              <strong> responsabilidade</strong>: respeito à <strong>LGPD</strong>, transparência sobre as fontes e
              explicabilidade dos resultados. O sistema oferece análise de URls e de imagens,
              registrando o histórico de consultas de forma segura.
            </p>

            <p>
              O projeto é construído com <strong>React</strong> no frontend e <strong>FastAPI</strong> no backend,
              banco <strong>PostgreSQL</strong> e integrações gratuitas sempre que possível. À medida que evolui,
              o Veracity busca se manter <strong>acessível</strong>, <strong>escalável</strong> e <strong>ético</strong>,
              contribuindo para um ecossistema digital mais confiável.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
