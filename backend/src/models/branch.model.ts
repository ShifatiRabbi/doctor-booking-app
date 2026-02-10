import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  colorTheme: { type: String, required: true },
  contact: { type: String, required: true },
  headerTitle: String,
  footerText: String,
}, { timestamps: true });

export const Branch = mongoose.model('Branch', branchSchema);