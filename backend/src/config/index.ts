import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Root path for datasets in the monorepo
const rootDataDir = path.resolve(__dirname, '../../../../data');
const fallbackDataDir = path.resolve(process.cwd(), '../data');
const altDataDir = path.resolve(process.cwd(), 'data');

function findExistingPath(filename: string): string {
  const p1 = path.join(rootDataDir, filename);
  if (require('fs').existsSync(p1)) return p1;
  const p2 = path.join(fallbackDataDir, filename);
  if (require('fs').existsSync(p2)) return p2;
  return path.join(altDataDir, filename);
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  additiveKnowledgeBasePath: findExistingPath('additive-knowledge-base.json'),
  fssaiRecallSeedPath: findExistingPath('fssai-recall-seed.json'),
  verificationThreshold: 3 // Minimum independent user verifications required
};
