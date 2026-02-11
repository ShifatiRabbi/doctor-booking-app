// backend/src/routes/branch.route.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getBranches, addBranch, updateBranch } from '../controllers/branch.controller'; // Note: delete and getById can be added if needed

const router = express.Router();

router.get('/', auth, getBranches);
router.post('/', auth, addBranch);
router.put('/:id', auth, updateBranch);
// Add delete if needed: router.delete('/:id', auth, deleteBranch);

export default router;