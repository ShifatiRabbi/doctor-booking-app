import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import PublicBooking from './pages/PublicBooking';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useApp();
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulating credentials based on selected role
    let email = '';
    if (role === 'admin') email = 'admin@medinexus.com';
    if (role === 'doctor') email = 'rahman@medinexus.com';
    if (role === 'employee') email = 'sarah@medinexus.com';
    
    await login(email, role);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
             <ShieldCheck size={32} />
           </div>
           <h1 className="text-2xl font-bold text-gray-800">Staff Portal Login</h1>
           <p className="text-gray-500 text-sm mt-2">Secure access for MediNexus staff</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role (Demo)</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="employee">Employee / Reception</option>
            </select>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
             Note: No password required for this prototype. Select a role and enter to explore the panel.
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access System'}
          </button>
          
          <div className="text-center mt-6">
            <a href="#booking" onClick={() => window.location.hash = ''} className="text-sm text-gray-500 hover:text-blue-600 underline">
               Go to Patient Booking Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp = () => {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState('dashboard');

  // Simple Router based on state/hash
  // Note: In a real app we would use react-router-dom, but for single file constraints/simple logical routing we use state or hash.
  const [isPublic, setIsPublic] = useState(window.location.hash !== '#login' && window.location.hash !== '#admin');

  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#staff') {
        setIsPublic(false);
      } else {
        setIsPublic(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    if (window.location.hash === '#staff') setIsPublic(false);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isPublic) {
    return (
      <div className="relative">
         <PublicBooking />
         <a href="#staff" className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full text-xs opacity-50 hover:opacity-100 shadow-lg transition-opacity">Staff Login</a>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentUser.role) {
      case 'admin':
        if (activePage === 'dashboard') return <AdminDashboard />;
        return <div className="p-8 text-center text-gray-500">Feature {activePage} coming soon in full version.</div>;
      case 'doctor':
        return <DoctorDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div>Unknown Role</div>;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderContent()}
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;