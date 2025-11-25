import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import skillRoutes from './routes/skillRoutes';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app: Application = express();

// Connect to DB
connectDB();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());   // Ensure express.json() middleware is added to parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Rate limiter to prevent DoS attacks
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Static folder for file upload
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes for auth and skills
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);

// Add a basic test route to check server status
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 5000;

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

export default app;
