// backend/src/routes/doctor.route.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctor.controller';

const router = express.Router();

router.get('/', auth, getDoctors);
router.get('/:id', auth, getDoctorById);
router.post('/', auth, createDoctor);
router.put('/:id', auth, updateDoctor);
router.delete('/:id', auth, deleteDoctor);

export default router;