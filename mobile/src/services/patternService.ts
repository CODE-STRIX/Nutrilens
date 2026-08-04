// Nutri Lens - Progress Dashboard & Food Pattern Intelligence Calculator

import { PatternInsight, ProgressData, ScanHistoryEntry } from '../../../shared/types';

export class PatternIntelligenceEngine {
  public static calculateProgress(history: ScanHistoryEntry[]): ProgressData {
    if (history.length === 0) {
      return {
        weeklyAverageScore: 0,
        monthlyAverageScore: 0,
        streakDays: 0,
        totalScans: 0,
        ultraProcessedPercentage: 0,
        healthyChoicePercentage: 0,
        scoreHistory: [],
      };
    }

    const totalScans = history.length;
    const sumScore = history.reduce((acc, curr) => acc + curr.score, 0);
    const weeklyAverageScore = Math.round(sumScore / totalScans);
    const monthlyAverageScore = Math.max(0, weeklyAverageScore - 2);

    const healthyScans = history.filter((h) => h.score >= 60).length;
    const healthyChoicePercentage = Math.round((healthyScans / totalScans) * 100);

    const ultraProcessedScans = history.filter((h) => h.processingLevel === 'ultra_processed').length;
    const ultraProcessedPercentage = Math.round((ultraProcessedScans / totalScans) * 100);

    const scoreHistory = history.map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      score: entry.score,
    }));

    return {
      weeklyAverageScore,
      monthlyAverageScore,
      streakDays: 5, // Mock streak count for active user
      totalScans,
      ultraProcessedPercentage,
      healthyChoicePercentage,
      scoreHistory,
    };
  }

  public static generatePatternInsights(history: ScanHistoryEntry[]): PatternInsight[] {
    if (history.length === 0) return [];

    const total = history.length;
    const highSodiumCount = history.filter((h) => h.sodiumMg > 400).length;
    const highSodiumPct = Math.round((highSodiumCount / total) * 100);

    const highSugarCount = history.filter((h) => h.sugarsG > 10).length;
    const highSugarPct = Math.round((highSugarCount / total) * 100);

    const ultraProcessedCount = history.filter((h) => h.processingLevel === 'ultra_processed').length;
    const ultraProcessedPct = Math.round((ultraProcessedCount / total) * 100);

    const insights: PatternInsight[] = [];

    if (highSodiumPct >= 30) {
      insights.push({
        id: 'pat_sodium',
        title: 'High Sodium Scan Pattern',
        description: `High sodium (>400mg) flagged in ${highSodiumPct}% of your last ${total} scans.`,
        percentage: highSodiumPct,
        metric: 'Sodium Heavy',
        impactLevel: 'warning',
        actionableTip: 'Swap packaged salty snacks for un-salted roasted seeds or fresh fruit to protect blood pressure.',
      });
    }

    if (highSugarPct >= 20) {
      insights.push({
        id: 'pat_sugar',
        title: 'Hidden Sugar Pattern',
        description: `Elevated sugars (>10g) detected in ${highSugarPct}% of your pantry scans.`,
        percentage: highSugarPct,
        metric: 'Sugar Heavy',
        impactLevel: 'warning',
        actionableTip: 'Check beverage & cereal packaging for liquid glucose or maltodextrin near the top of ingredient lists.',
      });
    }

    if (ultraProcessedPct >= 40) {
      insights.push({
        id: 'pat_processing',
        title: 'Ultra-Processed Food Ratio',
        description: `${ultraProcessedPct}% of your scanned items are ultra-processed industrial food products.`,
        percentage: ultraProcessedPct,
        metric: 'Ultra-Processed',
        impactLevel: 'warning',
        actionableTip: 'Try increasing whole food snacks like roasted chana, nuts, and fresh coconut water.',
      });
    } else {
      insights.push({
        id: 'pat_balanced',
        title: 'Clean Food Choice Streak',
        description: `${100 - ultraProcessedPct}% of your recent scans feature minimal artificial additives.`,
        percentage: 100 - ultraProcessedPct,
        metric: 'Clean & Whole',
        impactLevel: 'positive',
        actionableTip: 'Great job maintaining clean ingredient habits! Keep prioritizing whole grains and short ingredient lists.',
      });
    }

    return insights;
  }
}
