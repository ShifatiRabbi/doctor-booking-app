// backend/src/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import { Appointment } from '../models/appointment.model';
import { handleError } from '../utils/error-handler';

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().populate('patientId doctorId');
    res.json(appointments);
  } catch (err) {
    handleError(res, err);
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patientId doctorId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    handleError(res, err);
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

export const seedAppointments = async () => {
  const appointments = [
    { patientId: 'p1', patientName: 'John Doe', patientPhone: '01711111111', doctorId: 'd1', doctorName: 'Dr. A. Rahman', branchId: 'b1', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'confirmed' },
    // Add more...
  ];
  await Appointment.insertMany(appointments);
};