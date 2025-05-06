import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY!;
if (!JWT_SECRET) {
throw new Error('JWT\_SECRET\_KEY is not defined in environment variables');
}

// Public: Sign up new user
router.post('/signup', async (req: Request, res: Response) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) {
return res.status(400).json({ error: 'Name, email and password are required.' });
}
const existing = await Profile.findOne({ email });
if (existing) {
return res.status(409).json({ error: 'Email already in use.' });
}
const hashed = await bcrypt.hash(password, 10);
const user = await Profile.create({ name, email, password: hashed, record: [] });
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
return res.json({
token,
user: {
id: user._id,
name: user.name,
email: user.email,
record: user.record
}
});
} catch (err) {
console.error('Signup error:', err);
return res.status(500).json({ error: 'Server error during signup.' });
}
});

// Public: Log in existing user
router.post('/login', async (req: Request, res: Response) => {
try {
const { email, password } = req.body;
const user = await Profile.findOne({ email });
if (!user || !(await bcrypt.compare(password, user.password))) {
return res.status(401).json({ error: 'Invalid credentials.' });
}
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
return res.json({
token,
user: {
id: user._id,
name: user.name,
email: user.email,
record: user.record
}
});
} catch (err) {
console.error('Login error:', err);
return res.status(500).json({ error: 'Server error during login.' });
}
});

// Middleware: Protect routes below
function authMiddleware(req: Request, res: Response, next: NextFunction) {
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith('Bearer ')) {
return res.status(401).json({ error: 'No token provided.' });
}
const token = authHeader.split(' ')[1];
try {
const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string };
(req as any).userId = userId;
return next();
} catch {
return res.status(401).json({ error: 'Invalid token.' });
}
}

// Protected: Get current user
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
try {
const user = await Profile.findById((req as any).userId).select('-password');
return res.json({ user });
} catch (err) {
console.error('/me error:', err);
return res.status(500).json({ error: 'Server error.' });
}
});

// Protected: Update current user
router.patch('/me', authMiddleware, async (req: Request, res: Response) => {
try {
const updates: any = {};
if (req.body.name) updates.name = req.body.name;
if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);
const user = await Profile.findByIdAndUpdate((req as any).userId, updates, { new: true }).select('-password');
return res.json({ user });
} catch (err) {
console.error('Update /me error:', err);
return res.status(500).json({ error: 'Server error.' });
}
});

// Protected: Delete current user
router.delete('/me', authMiddleware, async (req: Request, res: Response) => {
try {
await Profile.findByIdAndDelete((req as any).userId);
return res.json({ message: 'Account deleted.' });
} catch (err) {
console.error('Delete /me error:', err);
return res.status(500).json({ error: 'Server error.' });
}
});

export default router;
