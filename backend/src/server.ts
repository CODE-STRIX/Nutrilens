import express from 'express';
import cors from 'cors';
import { config } from './config';
import productRoutes from './routes/product.routes';
import recallRoutes from './routes/recall.routes';
import communityRoutes from './routes/community.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Nutri Lens API Backend',
    team: 'CODESTRIX',
    person: 'Person E (Data & Safety Services)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/recalls', recallRoutes);
app.use('/api/community', communityRoutes);

// Error Handling Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(config.port, () => {
  console.log(`=================================================`);
  console.log(` Nutri Lens API Server running on port ${config.port}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(` Data & Safety Services (Person E) Active`);
  console.log(`=================================================`);
});

export default app;
