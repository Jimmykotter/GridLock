import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Router } from 'express';

const router = Router();
// Middleware to extract user from JWT
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
const header = (req.headers as any).authorization?.split(' ')[1];
if (!header) return res.status(401).json({ error: 'No token provided.' });

try {
  const { userId } = jwt.verify(header, process.env.JWT_SECRET_KEY!) as { userId: string };
  const user = await Profile.findById(userId).select('-password');
  if (!user) throw new Error();
  (req as any).user = user;
  next();
  return;
} catch {
  return res.status(401).json({ error: 'Invalid token.' });
}
}

// GET /api/auth/me
router.get('/me', authMiddleware, (req: Request, res: Response) => {
res.json({ user: (req as any).user });
});

// PATCH /api/auth/me
router.patch('/me', authMiddleware, async (req: Request, res: Response) => {
try {
  const updates = req.body; // e.g. { name, password }
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  const user = await Profile.findByIdAndUpdate(
    (req as any).user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');
  res.json({ user });
} catch (err) {
  console.error('Update /me error:', err);
  res.status(500).json({ error: 'Could not update profile.' });
}
});

// DELETE /api/auth/me
router.delete('/me', authMiddleware, async (req: Request, res: Response) => {
try {
  await Profile.findByIdAndDelete((req as any).user._id);
  res.json({ message: 'Account deleted.' });
} catch (err) {
  console.error('Delete /me error:', err);
  res.status(500).json({ error: 'Could not delete account.' });
}
});
