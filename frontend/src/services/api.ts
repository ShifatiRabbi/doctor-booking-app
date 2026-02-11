const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  getBranches: async () => {
    const res = await fetch('/api/branches', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch branches');
    return res.json();
  },
  addBranch: async (data: any) => {
    const res = await fetch('/api/branches', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to add branch');
    return res.json();
  },
  updateBranch: async (data: any) => {
    const res = await fetch(`/api/branches/${data.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update branch');
    return res.json();
  },
  getDoctors: async () => {
    const res = await fetch('/api/doctors', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },
  addDoctor: async (data: any) => {
    const res = await fetch('/api/doctors', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to add doctor');
    return res.json();
  },
  updateDoctor: async (data: any) => {
    const res = await fetch(`/api/doctors/${data.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update doctor');
    return res.json();
  },
  getAppointments: async () => {
    const res = await fetch('/api/appointments', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },
  addAppointment: async (data: any) => {
    const res = await fetch('/api/appointments', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to add appointment');
    return res.json();
  },
  updateAppointment: async (data: any) => {
    const res = await fetch(`/api/appointments/${data.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },
  getPatients: async () => {
    const res = await fetch('/api/patients', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  },
  createPatient: async (data: any) => {
    const res = await fetch('/api/patients', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to create patient');
    return res.json();
  },
  getPrescriptions: async () => {
    const res = await fetch('/api/prescriptions', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch prescriptions');
    return res.json();
  },
  createPrescription: async (data: any) => {
    const res = await fetch('/api/prescriptions', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to create prescription');
    return res.json();
  },
  // Add more as needed (e.g., delete, getById)
};