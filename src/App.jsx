import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import Instructions from './pages/Instructions/Instructions.jsx';
import Contact from './pages/Contact/Contact.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Profile from './pages/Profile/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import UserHistory from './pages/UserHistory/UserHistory.jsx';
import UserHistoryDetail from './pages/UserHistoryDetail/UserHistoryDetail.jsx';

import { getToken, initAuthWatch } from './api/client.js';

function RequireAuth({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
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
        <Route path="/user/profile" element={<RequireAuth><Profile /></RequireAuth>}/>
        <Route path="/administration" element={<RequireAuth><AdminDashboard /></RequireAuth>}/>
        <Route path="/user/history" element={<RequireAuth><UserHistory /></RequireAuth>}/>
        <Route path="/user/history/:id" element={<RequireAuth><UserHistoryDetail /></RequireAuth>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
