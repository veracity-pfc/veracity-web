import { useEffect, useState } from "react";
import { apiGetProfile } from "../api/client";

export default function Profile() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGetProfile()
      .then(setData)
      .catch(e => setErr(e.message || "Erro ao carregar perfil"));
  }, []);

  if (err) return <p role="alert">{err}</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <div style={{padding:16}}>
      <h2>Meu Perfil</h2>
      <p><b>Nome:</b> {data.name}</p>
      <p><b>E-mail:</b> {data.email}</p>
    </div>
  );
}
