
import { Appointment, Branch, Doctor, Patient, Prescription, User, WeeklySchedule } from "../types";

// --- Helpers ---

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let currentH = startH;
  let currentM = startM;

  while (currentH < endH || (currentH === endH && currentM < endM)) {
    const timeString = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    currentM += 30; // 30 min intervals
    if (currentM >= 60) {
      currentH++;
      currentM = 0;
    }
  }
  return slots;
};

// --- Mock Database ---

export const MOCK_BRANCHES: Branch[] = [
  { 
    id: 'b1', 
    name: 'MediNexus Central', 
    location: 'Dhaka, Dhanmondi', 
    colorTheme: 'blue', 
    contact: '+8801700000001',
    headerTitle: 'MediNexus Central Hospital',
    footerText: '© 2024 MediNexus Central - Excellence in Care'
  },
  { 
    id: 'b2', 
    name: 'MediNexus North', 
    location: 'Dhaka, Uttara', 
    colorTheme: 'emerald', 
    contact: '+8801700000002',
    headerTitle: 'MediNexus North Care',
    footerText: '© 2024 MediNexus North - Your Health, Our Priority'
  },
  { 
    id: 'b3', 
    name: 'MediNexus South', 
    location: 'Chittagong, GEC', 
    colorTheme: 'indigo', 
    contact: '+8801700000003',
    headerTitle: 'MediNexus Chittagong',
    footerText: '© 2024 MediNexus South - Serving the Port City'
  },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Super Admin', email: 'admin@medinexus.com', role: 'admin', branchId: 'all' },
  { id: 'u2', name: 'Receptionist Sarah', email: 'sarah@medinexus.com', role: 'employee', branchId: 'b1' },
];

const defaultSchedule: WeeklySchedule = {
  Mon: { enabled: true, start: '10:00', end: '14:00' },
  Tue: { enabled: true, start: '10:00', end: '14:00' },
  Wed: { enabled: true, start: '10:00', end: '14:00' },
  Thu: { enabled: false, start: '09:00', end: '17:00' },
  Fri: { enabled: false, start: '09:00', end: '17:00' },
  Sat: { enabled: false, start: '09:00', end: '17:00' },
  Sun: { enabled: false, start: '09:00', end: '17:00' },
};

export const MOCK_DOCTORS: Doctor[] = [
  { 
    id: 'd1', 
    name: 'Dr. A. Rahman', 
    email: 'rahman@medinexus.com', 
    role: 'doctor', 
    branchId: 'b1', 
    specialty: 'Cardiology', 
    degree: 'MBBS, FCPS', 
    schedule: { ...defaultSchedule }, 
    fees: 1000, 
    availableSlots: ['10:00', '10:30', '11:00', '11:30'] 
  },
  { 
    id: 'd2', 
    name: 'Dr. S. Khan', 
    email: 'khan@medinexus.com', 
    role: 'doctor', 
    branchId: 'b2', 
    specialty: 'Neurology', 
    degree: 'MBBS, MD', 
    schedule: { ...defaultSchedule, Sun: { enabled: true, start: '16:00', end: '20:00' } }, 
    fees: 1200, 
    availableSlots: ['16:00', '16:30', '17:00'] 
  },
  { 
    id: 'd3', 
    name: 'Dr. F. Ahmed', 
    email: 'ahmed@medinexus.com', 
    role: 'doctor', 
    branchId: 'b1', 
    specialty: 'General Medicine', 
    degree: 'MBBS', 
    schedule: { ...defaultSchedule, Mon: { enabled: true, start: '09:00', end: '12:00' } }, 
    fees: 500, 
    availableSlots: ['09:00', '09:15', '09:30'] 
  },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', name: 'John Doe', phone: '01711111111', age: 34, gender: 'Male', address: '123 Street', history: [] },
  { id: 'p2', name: 'Jane Smith', phone: '01722222222', age: 28, gender: 'Female', address: '456 Avenue', history: [] },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt1', patientId: 'p1', patientName: 'John Doe', patientPhone: '01711111111', doctorId: 'd1', doctorName: 'Dr. A. Rahman', branchId: 'b1', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'confirmed' },
  { id: 'apt2', patientId: 'p2', patientName: 'Jane Smith', patientPhone: '01722222222', doctorId: 'd1', doctorName: 'Dr. A. Rahman', branchId: 'b1', date: new Date().toISOString().split('T')[0], time: '11:00', status: 'pending' },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [];
