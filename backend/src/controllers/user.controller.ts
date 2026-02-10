import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { config } from '../config/config';
import { handleError } from '../utils/error-handler';
import { logger } from '../logs/logger';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, branchId: user.branchId } });
  } catch (err) {
    handleError(res, err);
  }
};

export const seedUsers = async () => {
  const users = [
    { name: 'Super Admin', email: 'admin@sr.com', password: bcrypt.hashSync('password', 10), role: 'admin', branchId: 'all' },
    { name: 'Dr. A. Rahman', email: 'rahman@sr.com', password: bcrypt.hashSync('password', 10), role: 'doctor', branchId: 'b1' },
    { name: 'Receptionist Sarah', email: 'sarah@sr.com', password: bcrypt.hashSync('password', 10), role: 'employee', branchId: 'b1' },
  ];
  await User.insertMany(users);
  logger.info('Users seeded');
};