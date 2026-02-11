import React, { useEffect, useState, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import PublicBooking from './pages/PublicBooking';
import LoginPage from './pages/LoginPage';
import { ShieldCheck } from 'lucide-react';

const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const DoctorDashboard = React.lazy(() => import('./pages/DoctorDashboard'));
const EmployeeDashboard = React.lazy(() => import('./pages/EmployeeDashboard'));

const MainApp = () => {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(() => !localStorage.getItem('splashSeen'));
  const [isPublic, setIsPublic] = useState(window.location.hash !== '#staff');

  useEffect(() => {
    const handler = () => setIsPublic(window.location.hash !== '#staff');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleSplashFinish = () => {
    localStorage.setItem('splashSeen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {isPublic ? (
          <div className="relative">
            <PublicBooking />
            <a href="#staff" className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full text-xs">
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
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  );
};

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
    <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <video src="/initial.mp4" autoPlay muted playsInline className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img src="/logo.gif" className="w-32 h-32 mb-4" alt="Logo" />
        <h1 className="text-white text-xl font-semibold">SR Hospital Management System</h1>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainApp />
  </AppProvider>
);

export default App;