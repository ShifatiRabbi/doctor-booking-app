// backend/src/routes/appointment.route.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointment.controller';

const router = express.Router();

router.get('/', auth, getAppointments);
router.get('/:id', auth, getAppointmentById);
router.post('/', auth, createAppointment);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, deleteAppointment);

export default router;