import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { getLockInfo, recordFailedAttempt, clearAttempts } from '../utils/failedLogin';

const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = generateToken(user._id.toString());
    res.status(201).json({ success: true, message: 'Registered', data: { user: { id: user._id, username, email }, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

    const lock = getLockInfo(email);
    if (lock.locked) return res.status(423).json({ success: false, message: 'Account locked. Try again later.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordFailedAttempt(email);
      const lockNow = getLockInfo(email);
      if (lockNow.locked) return res.status(423).json({ success: false, message: 'Account locked due to repeated failed attempts. Try again later.' });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    clearAttempts(email);
    res.status(200).json({ success: true, message: 'Login successful', data: { user: { id: user._id, username: user.username, email }, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
