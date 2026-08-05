import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Person E Routes
import productRoutes from './routes/product.routes';
import recallRoutes from './routes/recall.routes';
import communityRoutes from './routes/community.routes';

// Person F Routes
import userRoutes from './routes/userRoutes';
import personalizationRoutes from './routes/personalizationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import learningRoutes from './routes/learningRoutes';
import mlRoutes from './routes/mlRoutes';

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
    service: 'NutriLens API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── Person E Routes (Data & Safety) ──────────────────────────────────────────
if (productRoutes) app.use('/api/products', productRoutes);
if (recallRoutes) app.use('/api/recalls', recallRoutes);
if (communityRoutes) app.use('/api/community', communityRoutes);

// ── Person F Routes (Intelligence & User) ───────────────────────────────────
app.use('/api/auth', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/personalize', personalizationRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api/learning', learningRoutes);

// ── ML Intelligence Models Routes ───────────────────────────────────────────
app.use('/api/ml', mlRoutes);

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('=================================================');
  console.log(` 🥗 Nutri Lens API Server running on port ${PORT}`);
  console.log(` Team: CODESTRIX | Person E & Person F Services Active`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log('=================================================');
});

export default app;
