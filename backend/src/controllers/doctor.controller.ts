// backend/src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import { Doctor } from '../models/doctor.model';
import { handleError } from '../utils/error-handler';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    handleError(res, err);
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    handleError(res, err);
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

export const seedDoctors = async () => {
  const defaultSchedule = {
    Mon: { enabled: true, start: '10:00', end: '14:00' },
    // Add full schedule...
  };
  const doctors = [
    { id: 'd1', name: 'Dr. A. Rahman', email: 'rahman@sr.com', branchId: 'b1', specialty: 'Cardiology', degree: 'MBBS, FCPS', schedule: defaultSchedule, fees: 1000, availableSlots: ['10:00', '10:30'] },
    // Add more...
  ];
  await Doctor.insertMany(doctors);
};