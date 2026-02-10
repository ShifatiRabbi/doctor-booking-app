
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User, Branch, Doctor, Appointment, Patient, Prescription } from '../types';
// import { 
//   MOCK_BRANCHES, MOCK_USERS, MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_PATIENTS, 
//   simulateDelay, generateId, generateSlots
// } from '../services/mockData';

// interface AppContextType {
//   currentUser: User | null;
//   currentBranch: Branch | null;
//   branches: Branch[];
//   doctors: Doctor[];
//   appointments: Appointment[];
//   patients: Patient[];
//   prescriptions: Prescription[];
//   login: (email: string, role: string) => Promise<boolean>;
//   logout: () => void;
//   setBranch: (branchId: string) => void;
//   // Actions
//   addBranch: (branch: Omit<Branch, 'id'>) => Promise<void>;
//   updateBranch: (branch: Branch) => Promise<void>;
//   addDoctor: (doctor: Omit<Doctor, 'id' | 'availableSlots'>) => Promise<void>;
//   updateDoctor: (doctor: Doctor) => Promise<void>;
//   addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
//   updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
//   savePrescription: (pres: Omit<Prescription, 'id'>) => Promise<void>;
//   registerPatient: (patient: Omit<Patient, 'id' | 'history'>) => Promise<string>;
//   searchPatients: (query: string) => Patient[];
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [currentBranch, setCurrentBranch] = useState<Branch | null>(MOCK_BRANCHES[0]);
//   const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  
//   // "Database" States
//   const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
//   const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
//   const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

//   // Simulate Login
//   const login = async (email: string, role: string) => {
//     await simulateDelay(800);
//     // For demo purposes, we create a session based on role
//     // In a real app, this would validate credentials
//     let user: User | undefined;
    
//     if (role === 'doctor') {
//       user = doctors.find(d => d.email === email);
//       if (!user) user = { ...MOCK_DOCTORS[0], role: 'doctor' }; // Fallback for demo
//     } else if (role === 'admin') {
//       user = MOCK_USERS.find(u => u.role === 'admin');
//     } else {
//       user = MOCK_USERS.find(u => u.role === 'employee');
//     }

//     if (user) {
//       setCurrentUser(user);
//       // specific branch logic
//       if (user.branchId !== 'all') {
//         const userBranch = branches.find(b => b.id === user?.branchId);
//         if (userBranch) setCurrentBranch(userBranch);
//       }
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setCurrentUser(null);
//   };

//   const setBranch = (branchId: string) => {
//     const b = branches.find(br => br.id === branchId);
//     if (b) setCurrentBranch(b);
//   };

//   // Branch Management
//   const addBranch = async (branchData: Omit<Branch, 'id'>) => {
//     await simulateDelay();
//     const newBranch: Branch = { ...branchData, id: generateId() };
//     setBranches(prev => [...prev, newBranch]);
//   };

//   const updateBranch = async (updatedBranch: Branch) => {
//     await simulateDelay();
//     setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
//     if (currentBranch?.id === updatedBranch.id) {
//         setCurrentBranch(updatedBranch);
//     }
//   };

//   // Doctor Management
//   const addDoctor = async (docData: Omit<Doctor, 'id' | 'availableSlots'>) => {
//     await simulateDelay();
//     // Generate initial slots from schedule for today (simplified)
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
//     const todaySchedule = docData.schedule[today];
//     let slots: string[] = [];
//     if (todaySchedule?.enabled) {
//         slots = generateSlots(todaySchedule.start, todaySchedule.end);
//     }

//     const newDoc: Doctor = {
//         ...docData,
//         id: generateId(),
//         availableSlots: slots
//     };
//     setDoctors(prev => [...prev, newDoc]);
//   };

//   const updateDoctor = async (updatedDoc: Doctor) => {
//     await simulateDelay();
//     // Recalculate slots based on new schedule
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
//     const todaySchedule = updatedDoc.schedule[today];
//     let slots: string[] = [];
//     if (todaySchedule?.enabled) {
//         slots = generateSlots(todaySchedule.start, todaySchedule.end);
//     }
    
//     const finalDoc = { ...updatedDoc, availableSlots: slots };
//     setDoctors(prev => prev.map(d => d.id === finalDoc.id ? finalDoc : d));
//   };

//   const addAppointment = async (aptData: Omit<Appointment, 'id' | 'status'>) => {
//     await simulateDelay();
//     const newApt: Appointment = {
//       ...aptData,
//       id: generateId(),
//       status: 'pending'
//     };
//     setAppointments(prev => [...prev, newApt]);
//     console.log(`[SMS Service]: Booking Confirmed for ${newApt.patientName}. ID: ${newApt.id}`);
//   };

//   const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
//     await simulateDelay(300);
//     setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
//   };

//   const savePrescription = async (presData: Omit<Prescription, 'id'>) => {
//     await simulateDelay();
//     const newPres: Prescription = {
//       ...presData,
//       id: generateId()
//     };
//     setPrescriptions(prev => [...prev, newPres]);
//     // Also mark appointment as completed
//     updateAppointmentStatus(newPres.appointmentId, 'completed');
//   };

//   const registerPatient = async (patientData: Omit<Patient, 'id' | 'history'>) => {
//     const existing = patients.find(p => p.phone === patientData.phone);
//     if (existing) return existing.id;

//     const newPatient: Patient = {
//       ...patientData,
//       id: generateId(),
//       history: []
//     };
//     setPatients(prev => [...prev, newPatient]);
//     return newPatient.id;
//   };

//   const searchPatients = (query: string) => {
//     const q = query.toLowerCase();
//     return patients.filter(p => p.name.toLowerCase().includes(q) || p.phone.includes(q));
//   };

//   return (
//     <AppContext.Provider value={{
//       currentUser,
//       currentBranch,
//       branches,
//       doctors,
//       appointments,
//       patients,
//       prescriptions,
//       login,
//       logout,
//       setBranch,
//       addBranch,
//       updateBranch,
//       addDoctor,
//       updateDoctor,
//       addAppointment,
//       updateAppointmentStatus,
//       savePrescription,
//       registerPatient,
//       searchPatients
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error("useApp must be used within AppProvider");
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Branch, Doctor, User /* etc. */ } from '../types/index';

interface AppContextType {
  // Same as before, but now fetch from API
  currentUser: User | null;
  branches: Branch[];
  // etc.
  login: (email: string, password: string) => Promise<void>;
  // other actions call API
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  // other states

  useEffect(() => {
    if (currentUser) {
      api.getBranches().then(setBranches);
      // Fetch other data
    }
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  // Other actions like addBranch: async (data) => { await api.addBranch(data); fetch updated branches }

  return (
    <AppContext.Provider value={{ currentUser, branches, login /* etc. */ }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};