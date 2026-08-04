import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import userRoutes from './routes/userRoutes';
import personalizationRoutes from './routes/personalizationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import learningRoutes from './routes/learningRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Nutri Lens Backend API — Person F (Intelligence & User Services)',
    version: '1.0.0',
    team: 'CODESTRIX',
    event: 'Smart India Hackathon 2026',
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/user/profile',
      'PUT  /api/user/profile',
      'POST /api/personalize',
      'POST /api/personalize/recommend-alternative',
      'POST /api/personalize/compare',
      'GET  /api/dashboard',
      'GET  /api/dashboard/patterns?lastN=10',
      'GET  /api/learning/lesson?triggers=INS_211,HIGH_SODIUM',
      'GET  /api/learning/all',
      'GET  /api/learning/:id'
    ]
  });
});

// ── Person F Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/personalize', personalizationRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api/learning', learningRoutes);

// ── Global error handler ────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🥗  Nutri Lens Backend API — Person F Services');
  console.log(`  🚀  Server running at http://localhost:${PORT}`);
  console.log(`  📋  Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Person F Routes (Intelligence & User):');
  console.log(`  • Auth & Profile:     http://localhost:${PORT}/api/auth`);
  console.log(`  • Personalization:    http://localhost:${PORT}/api/personalize`);
  console.log(`  • Dashboard:          http://localhost:${PORT}/api/dashboard`);
  console.log(`  • Pattern Analytics:  http://localhost:${PORT}/api/dashboard/patterns`);
  console.log(`  • Learning Mode:      http://localhost:${PORT}/api/learning`);
  console.log('');
  console.log('  Demo user:  rahul.sharma@example.com  /  Password123!');
  console.log('  Profile:    Hypertension + HighCholesterol + Peanut Allergy');
  console.log('');
});

export default app;
