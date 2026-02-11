import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  dosage: String,
  duration: String,
});

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  date: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [medicineSchema],
  tests: [String],
  notes: String,
  digitalSignature: String,
}, { timestamps: true });

export const Prescription = mongoose.model('Prescription', prescriptionSchema);