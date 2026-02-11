export type Role = 'admin' | 'doctor' | 'employee' | 'patient';

export interface Branch {
  id: string;
  name: string;
  location: string;
  colorTheme: string;
  contact: string;
  headerTitle?: string;
  footerText?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId: string;
}

export interface ScheduleDay {
  enabled: boolean;
  start: string;
  end: string;
}

export interface WeeklySchedule {
  [key: string]: ScheduleDay;
}

export interface Doctor extends User {
  specialty: string;
  degree: string;
  schedule: WeeklySchedule;
  fees: number;
  availableSlots: string[];
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  history: string[]; // Appointment IDs
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  branchId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  type: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  date: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  tests: string[];
  notes: string;
  digitalSignature: string;
}