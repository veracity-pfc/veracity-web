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
import UserHistory from './pages/UserHistory/UserHistory';
import UserHistoryDetail from './pages/UserHistoryDetail/UserHistoryDetail';
import { getToken, initAuthWatch } from './api/client';
import Administration from './pages/Admin/Administration';
import Toast from './components/Toast/Toast';

function RequireAuth({ children }: PropsWithChildren): JSX.Element {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/user/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/administration" element={<RequireAuth><Administration /></RequireAuth>} />
        <Route path="/user/history" element={<RequireAuth><UserHistory /></RequireAuth>} />
        <Route path="/user/history/:id" element={<RequireAuth><UserHistoryDetail /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Toast />
    </>
  );
}
