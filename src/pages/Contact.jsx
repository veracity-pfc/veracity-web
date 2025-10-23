import React, { useState } from 'react';
import cover from '../assets/contact-cover.png';
import { apiSendContact } from '../api/client';

export default function Contact() {
  const [subject, setSubject] = useState('Dúvida');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  return (
    <main>
      <section className="contact-section container page-offset">
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

            {!ok ? (
              <form
                className="contact-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErr('');
                  try {
                    await apiSendContact(email.trim(), subject, message.trim());
                    setOk(true);
                  } catch (e) {
                    setErr(e?.data?.detail || e.message || 'Não foi possível enviar sua mensagem.');
                  }
                }}
              >
                <label className="form-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  className="form-control"
                  type="email"
                  placeholder="Informe seu e-mail"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
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
                  <option value="Solicitação">Solicitação</option>
                  <option value="Reclamação">Reclamação</option>
                </select>

                <label className="form-label" htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  className="form-control textarea"
                  placeholder="Descreva sua solicitação"
                  rows={6}
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)}
                  required
                />

                {err && <p className="error-msg" role="alert">{err}</p>}
                <button type="submit" className="btn-primary">Enviar</button>
              </form>
            ) : (
              <div className="steps-wrap" style={{marginTop:12}}>
                <p style={{margin:0, fontWeight:800}}>Mensagem enviada</p>
                <p style={{margin:'6px 0 0'}}>Obrigado pelo contato! Em breve retornaremos pelo seu e-mail.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
