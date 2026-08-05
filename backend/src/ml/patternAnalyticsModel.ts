import { PatternInsight, PatternIntelligenceReport } from '../../../shared/types/analytics';

export interface UserScanRecord {
  id: string;
  userId: string;
  productName: string;
  scannedAt: string;
  sodiumMg: number;
  sugarGrams: number;
  saturatedFatGrams: number;
  fiberGrams: number;
  hasAdditives: boolean;
}

export class PatternAnalyticsModel {
  /**
   * Model 5: Time-Series Window Aggregator & Anomaly Detector
   */
  public analyzePatternAnomalies(userId: string, scanHistory: UserScanRecord[]): PatternIntelligenceReport {
    if (!scanHistory || scanHistory.length === 0) {
      return {
        userId,
        analyzedScansCount: 0,
        insights: [],
        overallSummary: 'No recent scan history available to generate dietary pattern intelligence.'
      };
    }

    const totalScans = scanHistory.length;
    let highSodiumCount = 0;
    let highSugarCount = 0;
    let lowFiberCount = 0;
    let highAdditiveCount = 0;

    scanHistory.forEach(scan => {
      if (scan.sodiumMg > 400) highSodiumCount++;
      if (scan.sugarGrams > 10) highSugarCount++;
      if (scan.fiberGrams < 3) lowFiberCount++;
      if (scan.hasAdditives) highAdditiveCount++;
    });

    const sodiumPct = Math.round((highSodiumCount / totalScans) * 100);
    const sugarPct = Math.round((highSugarCount / totalScans) * 100);
    const fiberPct = Math.round((lowFiberCount / totalScans) * 100);
    const additivePct = Math.round((highAdditiveCount / totalScans) * 100);

    const insights: PatternInsight[] = [];

    // Sodium Anomaly
    if (sodiumPct >= 30) {
      insights.push({
        metricKey: 'HIGH_SODIUM',
        title: 'High Sodium Intake Pattern',
        percentage: sodiumPct,
        sampleSize: totalScans,
        severity: sodiumPct >= 50 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${sodiumPct}% of your last ${totalScans} scanned foods contain elevated sodium levels (>400mg per serving).`,
        actionableTip: 'Hypertension and cardiac health management require maintaining sodium <140mg per serving.'
      });
    }

    // Sugar Anomaly
    if (sugarPct >= 30) {
      insights.push({
        metricKey: 'HIGH_SUGAR',
        title: 'Elevated Added Sugar Frequency',
        percentage: sugarPct,
        sampleSize: totalScans,
        severity: sugarPct >= 50 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${sugarPct}% of scanned items contain high sugar content (>10g per serving).`,
        actionableTip: 'Swap sugary drinks and processed sweets with whole fruits and roasted nut snacks.'
      });
    }

    // Additive Frequency Anomaly
    if (additivePct >= 40) {
      insights.push({
        metricKey: 'HIGH_ADDITIVES',
        title: 'High Ultra-Processed Additive Load',
        percentage: additivePct,
        sampleSize: totalScans,
        severity: 'HIGH_RISK',
        description: `${additivePct}% of your scanned snacks contain synthetic preservatives, food dyes, or flavor enhancers.`,
        actionableTip: 'Prioritize whole-food regional snacks with short, natural ingredient lists.'
      });
    }

    // Fiber Gap Anomaly
    if (fiberPct >= 50) {
      insights.push({
        metricKey: 'LOW_FIBER',
        title: 'Dietary Fiber Deficiency Gap',
        percentage: fiberPct,
        sampleSize: totalScans,
        severity: 'MODERATE_WARNING',
        description: `${fiberPct}% of scanned items fall short of basic fiber benchmarks (<3g per serving).`,
        actionableTip: 'Incorporate whole millet muesli, lentils, and fresh leafy greens into your daily diet.'
      });
    }

    const overallSummary = insights.length > 0
      ? `Analysis across your last ${totalScans} scans identified ${insights.length} dietary risk patterns. Focus on reducing sodium and artificial additives.`
      : `Great work! Your last ${totalScans} scans show a well-balanced, low-additive food selection profile.`;

    return {
      userId,
      analyzedScansCount: totalScans,
      insights,
      overallSummary
    };
  }
}

export const patternAnalyticsModel = new PatternAnalyticsModel();
