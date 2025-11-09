import React, { useState } from 'react';
import cover from '../../assets/contact-cover.png';
import { apiSendContact } from '../../api/client';
import Toast, { useToast } from '../../components/Toast/Toast.jsx';
import styles from './Contact.module.css';       
import '../../styles/forms.css';               

const cx = (...xs) => xs.filter(Boolean).join(' ');

export default function Contact() {
  const [subject, setSubject] = useState('Dúvida');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const { success, error } = useToast();

  return (
    <main>
      <Toast />
      <section className={cx(styles['contact-section'], 'container', 'page-offset')}>
        <div className={styles['contact-grid']}>
          <div className={styles['contact-image-wrap']}>
            <img className={styles['contact-image']} src={cover} alt="Arte ilustrativa de contato" />
          </div>

          <div className={styles['contact-content']}>
            <h2 className={styles['contact-title']}>Entre em contato conosco</h2>
            <p className={styles['contact-subtitle']}>
              Tem dúvidas, sugestões ou quer saber mais sobre como a Veracity
              funciona? Nossa equipe está pronta para atender você!
            </p>

            {!ok ? (
              <form
                className={styles['contact-form']}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErr('');
                  try {
                    await apiSendContact(email.trim(), subject, message.trim());
                    setOk(true);
                    success("Mensagem enviada com sucesso!");
                  } catch (e) {
                    error("Erro ao enviar mensagem!");
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
                  <option value="Solicitação">Solicitação de token de API</option>
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
