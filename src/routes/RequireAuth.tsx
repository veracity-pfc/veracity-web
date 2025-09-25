import { useLogto } from '@logto/react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useLogto();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
