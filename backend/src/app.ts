import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/user.route';
import branchRoutes from './routes/branch.route';
import doctorRoutes from './routes/doctor.route';
import patientRoutes from './routes/patient.route';
import appointmentRoutes from './routes/appointment.route';
import prescriptionRoutes from './routes/prescription.route';
import { seedUsers } from './controllers/user.controller';
import { seedBranches } from './controllers/branch.controller';
import { seedDoctors } from './controllers/doctor.controller';
import { seedPatients } from './controllers/patient.controller';
import { seedAppointments } from './controllers/appointment.controller';
// import { seedPrescriptions } from './controllers/prescription.controller';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

connectDB();

// Seed data on startup (for demo; in production, use migrations)
const seedAll = async () => {
  // await seedUsers();
  // await seedBranches();
  // await seedDoctors();
  // await seedPatients();
  await seedAppointments();
  // await seedPrescriptions();
};
seedAll();

export default app;