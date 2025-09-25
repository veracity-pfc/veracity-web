import { useLogto } from '@logto/react';

export default function Login() {
  const { isAuthenticated, signIn, signOut } = useLogto();

  return (
    <div style={{ padding: 24 }}>
      <h1>Entrar / Cadastrar</h1>
      {!isAuthenticated ? (
        <button onClick={() => signIn(window.location.origin)}>Continuar com Logto</button>
      ) : (
        <button onClick={() => signOut(window.location.origin)}>Sair</button>
      )}
    </div>
  );
}
