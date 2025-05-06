import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Profile from '../models/Profile.js'; // note the .js for ESM

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required.' });
      return;
    }

    // 1) check for existing user
    const existing = await Profile.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'Email already in use.' });
      return;
    }

    // 2) hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 3) create the user
    const user = await Profile.create({
      name,
      email,
      password: hashed,
      record: [] // or your default win/loss structure
    });

    // 4) generate a token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d'
    });

    // 5) respond with token + user (omit the password)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        record: user.record
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Profile.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d'
    });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        record: user.record 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

export default router;
