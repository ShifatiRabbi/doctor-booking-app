import { Request, Response } from 'express';
import { Branch } from '../models/branch.model';
import { handleError } from '../utils/error-handler';

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    handleError(res, err);
  }
};

export const addBranch = async (req: Request, res: Response) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (err) {
    handleError(res, err);
  }
};

export const seedBranches = async () => {
  const branches = [
    { id: 'b1', name: 'SR Central', location: 'Dhaka, Dhanmondi', colorTheme: 'blue', contact: '+8801700000001', headerTitle: 'SR Central Hospital', footerText: '© 2024 SR Central - Excellence in Care' },
    // Add others...
  ];
  await Branch.insertMany(branches);
};