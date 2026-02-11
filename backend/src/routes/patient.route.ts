// backend/src/routes/patient.route.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

const router = express.Router();

router.get('/', auth, getPatients);
router.get('/:id', auth, getPatientById);
router.post('/', auth, createPatient);
router.put('/:id', auth, updatePatient);
router.delete('/:id', auth, deletePatient);

export default router;