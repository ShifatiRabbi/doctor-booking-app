import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login, loading, error } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* ... original content */}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 mb-2" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 mb-4" />
        <button onClick={handleLogin} disabled={loading}>Login</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;