// backend/src/routes/prescription.route.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getPrescriptions, getPrescriptionById, createPrescription, updatePrescription, deletePrescription } from '../controllers/prescription.controller';

const router = express.Router();

router.get('/', auth, getPrescriptions);
router.get('/:id', auth, getPrescriptionById);
router.post('/', auth, createPrescription);
router.put('/:id', auth, updatePrescription);
router.delete('/:id', auth, deletePrescription);

export default router;