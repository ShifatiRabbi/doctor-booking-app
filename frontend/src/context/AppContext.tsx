import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Appointment, Branch, Doctor, Patient, Prescription, User } from '../types/index';

interface AppContextType {
  currentUser: User | null;
  currentBranch: Branch | null;
  branches: Branch[];
  doctors: Doctor[];
  appointments: Appointment[];
  patients: Patient[];
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setBranch: (branchId: string) => void;
  addBranch: (branch: Omit<Branch, 'id'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctor: (doctor: Doctor) => Promise<void>;
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  savePrescription: (pres: Omit<Prescription, 'id'>) => Promise<void>;
  registerPatient: (patient: Omit<Patient, 'id' | 'history'>) => Promise<string>;
  searchPatients: (query: string) => Patient[]; // Client-side search for now
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info or validate token if needed
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [branchesData, doctorsData, appointmentsData, patientsData, prescriptionsData] = await Promise.all([
        api.getBranches(),
        api.getDoctors(),
        api.getAppointments(),
        api.getPatients(),
        api.getPrescriptions(),
      ]);
      setBranches(branchesData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setPrescriptions(prescriptionsData);
      if (branchesData.length > 0) setCurrentBranch(branchesData[0]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      setCurrentUser(user);
      await fetchData();
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setBranches([]);
    // Clear other states
  };

  const setBranch = (branchId: string) => {
    const b = branches.find(br => br.id === branchId);
    if (b) setCurrentBranch(b);
  };

  const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    await api.addBranch(branchData);
    await fetchData();
  };

  const updateBranch = async (updatedBranch: Branch) => {
    await api.updateBranch(updatedBranch);
    await fetchData();
  };

  const addDoctor = async (doctorData: Omit<Doctor, 'id'>) => {
    await api.addDoctor(doctorData);
    await fetchData();
  };

  const updateDoctor = async (updatedDoctor: Doctor) => {
    await api.updateDoctor(updatedDoctor);
    await fetchData();
  };

  const addAppointment = async (aptData: Omit<Appointment, 'id' | 'status'>) => {
    await api.addAppointment(aptData);
    await fetchData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await api.updateAppointment({ id, status });
    await fetchData();
  };

  const savePrescription = async (presData: Omit<Prescription, 'id'>) => {
    await api.createPrescription(presData);
    await fetchData();
  };

  const registerPatient = async (patientData: Omit<Patient, 'id' | 'history'>) => {
    const existing = patients.find(p => p.phone === patientData.phone);
    if (existing) return existing.id;
    const newPatient = await api.createPatient(patientData);
    await fetchData();
    return newPatient.id;
  };

  const searchPatients = (query: string) => {
    const q = query.toLowerCase();
    return patients.filter(p => p.name.toLowerCase().includes(q) || p.phone.includes(q));
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentBranch, branches, doctors, appointments, patients, prescriptions, loading, error,
      login, logout, setBranch, addBranch, updateBranch, addDoctor, updateDoctor, addAppointment, updateAppointmentStatus, savePrescription, registerPatient, searchPatients
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};