import { Response } from 'express';
import { logger } from '../logs/logger';

export const handleError = (res: Response, err: any, status = 500) => {
  logger.error(err);
  res.status(status).json({ message: err.message || 'Server error' });
};