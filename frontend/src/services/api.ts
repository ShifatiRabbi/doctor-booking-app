const API_BASE = '/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  getBranches: async () => {
    const res = await fetch(`${API_BASE}/branches`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch branches');
    return res.json();
  },
  // Add similar for addBranch, updateBranch, getDoctors, etc.
  // Replicate for all endpoints based on BE routes.
};