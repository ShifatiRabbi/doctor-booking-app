import express from 'express';
import { connectDB } from './config/db';
import userRoutes from './routes/user.route.ts';
import branchRoutes from './routes/branch.route.ts';
// Add other routes...

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
// Add others...

connectDB();

// Seed data on startup (for demo)
import { seedUsers, seedBranches } from './controllers/...'; // Import all seed functions
seedUsers();
seedBranches();
// etc.

export default app;