export interface ScanHistoryRecord {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  scannedAt: string;
  personalizedScore: number;
  sodiumMg: number;
  sugarGrams: number;
  saturatedFatGrams: number;
  fiberGrams: number;
  hasAdditives: boolean;
}

export interface ProgressDashboardData {
  userId: string;
  userName: string;
  runningAverageScore: number; // 0 - 100
  totalScans: number;
  currentStreakDays: number;
  longestStreakDays: number;
  scansThisWeek: number;
  healthTier: 'SUPER_HEALTHY' | 'BALANCED' | 'NEEDS_ATTENTION' | 'HIGH_RISK_DIET';
  recentScans: ScanHistoryRecord[];
}

export interface PatternInsight {
  metricKey: string;
  title: string;
  percentage: number; // e.g. 60 for 60%
  sampleSize: number;
  severity: 'HIGH_RISK' | 'MODERATE_WARNING' | 'HEALTHY_TREND';
  description: string;
  actionableTip: string;
}

export interface PatternIntelligenceReport {
  userId: string;
  analyzedScansCount: number;
  insights: PatternInsight[];
  overallSummary: string;
}
