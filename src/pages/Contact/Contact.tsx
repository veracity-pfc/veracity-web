import React, { JSX, useEffect, useState } from 'react';
import cover from '../../assets/contact-cover.png';
import { apiFetch, getToken, apiGetProfile } from '../../api/client';
import Toast, { useToast } from '../../components/Toast/Toast';
import styles from './Contact.module.css';
import '../../styles/forms.css';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

const subjectToCategory: Record<string, string> = {
  "Dúvida": "doubt",
  "Sugestão": "suggestion",
  "Reclamação": "complaint",
  "Solicitação de token de API": "token_request"
};

export default function Contact(): JSX.Element {
  const [subject, setSubject] = useState<string>('Dúvida');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [ok, setOk] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { success, error } = useToast();

  const isUserLoggedIn = !!getToken();

  useEffect(() => {
    if (isUserLoggedIn) {
      apiGetProfile()
        .then((data) => {
          if (data?.email) {
            setEmail(data.email);
          }
        })
        .catch(() => {});
    }
  }, [isUserLoggedIn]);

  const isInvalid = !email.trim() || message.trim().length < 10;

  const handleResetForm = () => {
    setOk(false);
    setMessage('');
    setSubject('Dúvida');
    setErr('');
  };

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
                  if (loading) return;
                  
                  if (message.trim().length < 10) {
                    setErr("A mensagem deve ter no mínimo 10 caracteres.");
                    return;
                  }

                  setErr('');
                  setLoading(true);
                  try {
                    const category = subjectToCategory[subject] || 'doubt';
                    
                    await apiFetch('/v1/contact', {
                      method: 'POST',
                      body: {
                        email: email.trim(),
                        subject: subject,
                        message: message.trim(),
                        category: category
                      },
                      auth: isUserLoggedIn 
                    });

                    setOk(true);
                    success('Mensagem enviada com sucesso!');
                  } catch (e: any) {
                    error('Erro ao enviar mensagem!');
                    setErr(e?.data?.detail || e.message || 'Não foi possível enviar sua mensagem.');
                  } finally {
                    setLoading(false);
                  }
                }}
                noValidate
              >
                <label className="form-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  className="form-control"
                  type="email"
                  placeholder="Informe seu e-mail"
                  value={email}
                  maxLength={60}
                  onChange={(e) => setEmail(e.target.value.slice(0, 60))}
                  disabled={isUserLoggedIn}
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
                  {isUserLoggedIn && <option value="Solicitação de token de API">Solicitação de token de API</option>}
                  <option value="Reclamação">Reclamação</option>
                </select>

                <label className="form-label" htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  className="form-control textarea"
                  placeholder="Descreva sua solicitação (mínimo 10 caracteres)"
                  rows={6}
                  value={message}
                  maxLength={4000}
                  onChange={(e) => setMessage(e.target.value.slice(0, 4000))}
                />
                {message.length > 0 && message.length < 10 && (
                   <span style={{fontSize: 12, color: '#fca5a5'}}>
                     Faltam {10 - message.length} caracteres
                   </span>
                )}

                {err && <p className="error-msg" role="alert">{err}</p>}

                <button type="submit" className="btn-primary" disabled={loading || isInvalid}>
                  {loading ? 'Carregando...' : 'Enviar'}
                </button>
              </form>
            ) : (
              <div className="steps-wrap" style={{ marginTop: 12 }}>
                <p style={{ margin: 0, fontWeight: 800 }}>Mensagem enviada</p>
                <p style={{ margin: '6px 0 24px' }}>Obrigado pelo contato! Em breve retornaremos pelo seu e-mail.</p>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleResetForm}
                  style={{ width: 'auto', paddingLeft: 24, paddingRight: 24 }}
                >
                  Enviar nova mensagem
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}