import React, { useState } from 'react';
import cover from '../assets/contact-cover.png';

export default function Contact() {
  const [subject, setSubject] = useState('Dúvida');

  return (
    <main>
      <section className="hero">
        <h1>Detectando manipulações<br />com inteligência</h1>
        <p className="sub">Verifique a autenticidade de conteúdos digitais</p>
      </section>

      <section className="contact-section container">
        <div className="contact-grid">
          <div className="contact-image-wrap">
            <img className="contact-image" src={cover} alt="Arte ilustrativa de contato" />
          </div>

          <div className="contact-content">
            <h2 className="contact-title">Entre em contato conosco</h2>
            <p className="contact-subtitle">
              Tem dúvidas, sugestões ou quer saber mais sobre como a Veracity
              funciona? Nossa equipe está pronta para atender você!
            </p>

            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault(); 
              }}
            >
              <label className="form-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                className="form-control"
                type="email"
                placeholder="Informe seu e-mail"
                required
              />

              <label className="form-label" htmlFor="subject">Assunto</label>
              <select
                id="subject"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Dúvida">Dúvida</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Reclamação">Reclamação</option>
              </select>

              <label className="form-label" htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                className="form-control textarea"
                placeholder="Descreva sua solicitação"
                rows={6}
                required
              />

              <button type="submit" className="btn-primary">Enviar</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
