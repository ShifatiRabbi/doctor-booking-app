
export type Role = 'admin' | 'doctor' | 'employee' | 'patient';

export interface Branch {
  id: string;
  name: string;
  location: string;
  colorTheme: string; // e.g., 'blue', 'emerald', 'indigo', 'rose', 'orange'
  logoUrl?: string;
  contact: string;
  headerTitle?: string; // Customizable header text
  footerText?: string;  // Customizable footer text
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId: string; // User belongs to a specific branch (or 'all' for super admin)
  phone?: string;
}

export interface ScheduleDay {
  enabled: boolean;
  start: string; // "09:00"
  end: string;   // "17:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface WeeklySchedule {
  [key: string]: ScheduleDay; // Mon, Tue, Wed, etc.
}

export interface Doctor extends User {
  specialty: string;
  degree: string;
  schedule: WeeklySchedule; // Detailed schedule object
  fees: number;
  availableSlots: string[]; // Generated based on schedule
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  history: Appointment[]; // For simulation
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for simpler display
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
  type: string; // Tablet, Syrup, etc.
  dosage: string; // 1-0-1
  duration: string; // 5 days
}

export interface Prescription {
  id: string;
  appointmentId: string;
  date: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  tests: string[]; // List of test names
  notes: string;
  digitalSignature: string; // Simulated signature text
}

export interface DashboardStats {
  totalPatients: number;
  todaysAppointments: number;
  revenue: number;
  pendingReports: number;
}
