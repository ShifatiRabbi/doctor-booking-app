// backend/src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { Patient } from '../models/patient.model';
import { handleError } from '../utils/error-handler';

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    handleError(res, err);
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    handleError(res, err);
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    handleError(res, err);
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

export const seedPatients = async () => {
  const patients = [
    { id: 'p1', name: 'John Doe', phone: '01711111111', age: 34, gender: 'Male', address: '123 Street', history: [] },
    // Add more...
  ];
  await Patient.insertMany(patients);
};