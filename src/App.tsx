import { Link, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequireAuth from './routes/RequireAuth';

function Home() {
  return <div style={{ padding: 24 }}>Veracity — front + Logto prontos ✅</div>;
}

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #ddd', display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
