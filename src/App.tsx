import { useEffect, PropsWithChildren, JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Instructions from './pages/Instructions/Instructions';
import Contact from './pages/Contact/Contact';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import History from './pages/History/History';
import HistoryDetail from './pages/HistoryDetail/HistoryDetail';
import { getToken, getRole, initAuthWatch } from './api/client';
import Dashboard from './pages/Dashboard/Dashboard';
import Toast from './components/Toast/Toast';
import Requests from './pages/Requests/Requests';
import ReactivateAccount from './pages/ReactivateAccount/ReactivateAccount';


function RequireAuth({ children }: PropsWithChildren): JSX.Element {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RequireAdmin({ children }: PropsWithChildren): JSX.Element {
  const token = getToken();
  const role = getRole();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App(): JSX.Element {
  useEffect(() => {
    initAuthWatch();
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/reactivate-account" element={<ReactivateAccount />}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/user/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/user/history" element={<RequireAuth><History /></RequireAuth>} />
        <Route path="/user/history/:id" element={<RequireAuth><HistoryDetail /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
        <Route path="/request" element={<RequireAdmin><Requests /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Toast />
    </>
  );
}
