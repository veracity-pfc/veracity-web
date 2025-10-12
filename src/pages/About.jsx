import React from 'react';
import cover from '../assets/about-cover.png';

export default function About() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Detectando manipulações<br />com inteligência</h1>
        <p className="sub">Verifique a autenticidade de conteúdos digitais</p>
      </section>

      <section className="about-section">
        <div className="about-grid">
          <div className="about-image-wrap">
            <img className="about-image" src={cover} alt="Arte do projeto Veracity" />
          </div>

          <div className="about-content">
            <h2 className="about-title">Conheça nossa história</h2>

            <p>
              O <strong>Veracity</strong> nasceu como um <strong>projeto acadêmico</strong> de
              conclusão de curso (PFC) em Engenharia de Software, com o objetivo de
              ajudar pessoas a verificarem a <strong>autenticidade de conteúdos digitais</strong>.
              A proposta surgiu ao observarmos o crescimento de golpes, desinformação e
              manipulações geradas por IA em links e imagens.
            </p>

            <p>
              Desde o início, o foco foi unir <strong>boas práticas de desenvolvimento de software</strong> com
              <strong> responsabilidade</strong>: respeito à <strong>LGPD</strong>, transparência sobre as fontes e
              explicabilidade dos resultados. O sistema oferece análise de links e de imagens,
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
