import express from 'express';
import { login } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';
const router = express.Router();

router.post('/login', login);

export default router;