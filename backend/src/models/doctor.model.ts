import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'doctor' },
  branchId: { type: String, required: true },
  specialty: { type: String, required: true },
  degree: { type: String, required: true },
  schedule: { type: Object, required: true },
  fees: { type: Number, required: true },
  availableSlots: [String],
}, { timestamps: true });

export const Doctor = mongoose.model('Doctor', doctorSchema);