// ✅ Splash overlays app (background loads during video)
// ✅ Splash shown only once (localStorage)
// ✅ Smooth fade-out
// ✅ Logo overlay
// ✅ Bundle splitting with React.lazy + Suspense
// ✅ Safe routing + fallback loaders
// ✅ Cleaned logic (no duplicated timers, no dead code)
// Load order (real-world behavior)
// JS bundle loads
// React mounts immediately
// Heavy pages lazy-load in parallel
// APIs fire
// Splash video plays on top
// Splash fades out
// User sees ready UI (or skeleton fallback)

import React, { useEffect, useState, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import PublicBooking from './pages/PublicBooking';
import { ShieldCheck } from 'lucide-react';

/* =======================
   Lazy-loaded dashboards
   ======================= */
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const DoctorDashboard = React.lazy(() => import('./pages/DoctorDashboard'));
const EmployeeDashboard = React.lazy(() => import('./pages/EmployeeDashboard'));

/* =======================
   Login Page
   ======================= */
const LoginPage = () => {
  const { login } = useApp();
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    let email = '';
    if (role === 'admin') email = 'admin@sr.com';
    if (role === 'doctor') email = 'rahman@sr.com';
    if (role === 'employee') email = 'sarah@sr.com';
    await login(email, role);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Portal Login</h1>
          <p className="text-gray-500 text-sm mt-2">Secure access for SR staff</p>
        </div>

        <div className="space-y-4">
          <select
            className="w-full border border-gray-300 rounded-lg p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="employee">Employee / Reception</option>
          </select>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Access System'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =======================
   Splash Screen
   ======================= */
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 9000);
    const endTimer = setTimeout(onFinish, 10000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-1000 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        src="/initial.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img src="/logo.gif" className="w-32 h-32 mb-4" />
        <h1 className="text-white text-xl font-semibold">
          SR Hospital Management System
        </h1>
      </div>
    </div>
  );
};

/* =======================
   Main App
   ======================= */
const MainApp = () => {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState('dashboard');

  const [showSplash, setShowSplash] = useState(
    () => !localStorage.getItem('splashSeen')
  );

  const [isPublic, setIsPublic] = useState(
    window.location.hash !== '#staff'
  );

  useEffect(() => {
    const handler = () =>
      setIsPublic(window.location.hash !== '#staff');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleSplashFinish = () => {
    localStorage.setItem('splashSeen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {/* ================= App Loads Immediately ================= */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            Loading application…
          </div>
        }
      >
        {isPublic ? (
          <div className="relative">
            <PublicBooking />
            <a
              href="#staff"
              className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full text-xs"
            >
              Staff Login
            </a>
          </div>
        ) : !currentUser ? (
          <LoginPage />
        ) : (
          <Layout activePage={activePage} onNavigate={setActivePage}>
            {currentUser.role === 'admin' && <AdminDashboard />}
            {currentUser.role === 'doctor' && <DoctorDashboard />}
            {currentUser.role === 'employee' && <EmployeeDashboard />}
          </Layout>
        )}
      </Suspense>

      {/* ================= Splash Overlay ================= */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  );
};

/* =======================
   App Provider Wrapper
   ======================= */
const App = () => (
  <AppProvider>
    <MainApp />
  </AppProvider>
);

export default App;