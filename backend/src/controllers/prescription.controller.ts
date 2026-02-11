// backend/src/controllers/prescription.controller.ts
import { Request, Response } from 'express';
import { Prescription } from '../models/prescription.model';
import { handleError } from '../utils/error-handler';

export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await Prescription.find().populate('appointmentId patientId doctorId');
    res.json(prescriptions);
  } catch (err) {
    handleError(res, err);
  }
};

export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('appointmentId patientId doctorId');
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    handleError(res, err);
  }
};

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    handleError(res, err);
  }
};

export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

// export const seedPrescriptions = async () => {
//   const prescriptions = [
//     // Add sample data...
//   ];
//   await Prescription.insertMany(prescriptions);
// };