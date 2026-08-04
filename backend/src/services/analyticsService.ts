import { ScanHistoryStore } from '../models/scanHistoryStore';
import { UserStore } from '../models/userStore';
import {
  ProgressDashboardData,
  PatternIntelligenceReport,
  PatternInsight,
  ScanHistoryRecord
} from '../../../shared/types/analytics';

export const AnalyticsService = {
  /**
   * Computes the Progress Dashboard for a given user:
   * - Running average personalized nutrition score (0-100)
   * - Healthy eating streak (consecutive days with avg score ≥ 60)
   * - Total scans count
   * - Health tier classification
   * - Recent 5 scan records
   */
  getDashboard: (userId: string): ProgressDashboardData => {
    const user = UserStore.findById(userId);
    if (!user) throw new Error('User not found');

    const history = ScanHistoryStore.getHistory(userId);
    const totalScans = history.length;

    // Calculate running average personalized score
    const avgScore = totalScans > 0
      ? Math.round(history.reduce((sum, s) => sum + s.personalizedScore, 0) / totalScans)
      : 0;

    // Calculate streak: count consecutive days (from today backwards) with at least one scan scoring ≥ 60
    const streakData = computeStreak(history);

    // Health tier classification based on running average
    let healthTier: ProgressDashboardData['healthTier'] = 'HIGH_RISK_DIET';
    if (avgScore >= 80) healthTier = 'SUPER_HEALTHY';
    else if (avgScore >= 65) healthTier = 'BALANCED';
    else if (avgScore >= 45) healthTier = 'NEEDS_ATTENTION';

    // Scans this week (last 7 days)
    const oneWeekAgo = Date.now() - 7 * 86400000;
    const scansThisWeek = history.filter(s => new Date(s.scannedAt).getTime() >= oneWeekAgo).length;

    return {
      userId,
      userName: user.name,
      runningAverageScore: avgScore,
      totalScans,
      currentStreakDays: streakData.current,
      longestStreakDays: streakData.longest,
      scansThisWeek,
      healthTier,
      recentScans: history.slice(0, 5)
    };
  },

  /**
   * Pattern Intelligence Report — aggregates eating patterns over the last N scans.
   * Surfaces insights like "High sodium in 40% of your last 10 scans".
   */
  getPatterns: (userId: string, lastNScans: number = 10): PatternIntelligenceReport => {
    const history = ScanHistoryStore.getHistory(userId);
    const sample = history.slice(0, lastNScans);
    const sampleSize = sample.length;

    if (sampleSize === 0) {
      return {
        userId,
        analyzedScansCount: 0,
        insights: [],
        overallSummary: 'No scan history found. Start scanning products to receive pattern insights!'
      };
    }

    const insights: PatternInsight[] = [];

    // --- Pattern 1: High Sodium (>500mg) ---
    const highSodiumCount = sample.filter(s => s.sodiumMg > 500).length;
    const highSodiumPct = Math.round((highSodiumCount / sampleSize) * 100);
    if (highSodiumPct > 0) {
      insights.push({
        metricKey: 'HIGH_SODIUM',
        title: 'High Sodium Foods',
        percentage: highSodiumPct,
        sampleSize,
        severity: highSodiumPct >= 50 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${highSodiumPct}% of your last ${sampleSize} scanned products contained high sodium (>500mg per serving).`,
        actionableTip: 'Hypertension patients should target <140mg sodium per serving. Look for "Low Sodium" labels or choose fresh whole foods.'
      });
    }

    // --- Pattern 2: High Additives ---
    const highAdditivesCount = sample.filter(s => s.hasAdditives).length;
    const highAdditivesPct = Math.round((highAdditivesCount / sampleSize) * 100);
    if (highAdditivesPct > 0) {
      insights.push({
        metricKey: 'HIGH_ADDITIVES',
        title: 'Artificial Additives Present',
        percentage: highAdditivesPct,
        sampleSize,
        severity: highAdditivesPct >= 60 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${highAdditivesPct}% of your scanned products contained artificial preservatives, colorants, or flavor enhancers.`,
        actionableTip: 'Reduce ultra-processed food intake. Choose products with <5 ingredients, all of which are recognizable whole foods.'
      });
    }

    // --- Pattern 3: Low Fiber (<3g) ---
    const lowFiberCount = sample.filter(s => s.fiberGrams < 3).length;
    const lowFiberPct = Math.round((lowFiberCount / sampleSize) * 100);
    if (lowFiberPct > 0) {
      insights.push({
        metricKey: 'LOW_FIBER',
        title: 'Low Dietary Fiber',
        percentage: lowFiberPct,
        sampleSize,
        severity: lowFiberPct >= 60 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${lowFiberPct}% of scanned products provided less than 3g dietary fiber per serving.`,
        actionableTip: 'Target 25-30g total fiber daily. Replace refined grain snacks with whole grain, lentil, or seed-based alternatives.'
      });
    }

    // --- Pattern 4: High Saturated Fat (>3.5g) ---
    const highSatFatCount = sample.filter(s => s.saturatedFatGrams > 3.5).length;
    const highSatFatPct = Math.round((highSatFatCount / sampleSize) * 100);
    if (highSatFatPct > 0) {
      insights.push({
        metricKey: 'HIGH_SAT_FAT',
        title: 'High Saturated Fat',
        percentage: highSatFatPct,
        sampleSize,
        severity: highSatFatPct >= 40 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${highSatFatPct}% of your scanned products were high in saturated fat (>3.5g per serving).`,
        actionableTip: 'High saturated fat raises LDL cholesterol. Limit biscuits, chips, instant noodles, and palm oil-heavy products.'
      });
    }

    // --- Positive Pattern: Good fiber scans ---
    const goodFiberCount = sample.filter(s => s.fiberGrams >= 5).length;
    const goodFiberPct = Math.round((goodFiberCount / sampleSize) * 100);
    if (goodFiberPct > 0) {
      insights.push({
        metricKey: 'GOOD_FIBER',
        title: 'High Fiber Choices ✅',
        percentage: goodFiberPct,
        sampleSize,
        severity: 'HEALTHY_TREND',
        description: `${goodFiberPct}% of your scanned products were high in dietary fiber (≥5g per serving). Great work!`,
        actionableTip: 'Keep choosing whole grain and legume-based snacks for gut microbiome health.'
      });
    }

    // Sort: most severe patterns first
    const severityOrder = { HIGH_RISK: 0, MODERATE_WARNING: 1, HEALTHY_TREND: 2 };
    insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Overall summary
    const avgScore = sample.length > 0
      ? Math.round(sample.reduce((sum, s) => sum + s.personalizedScore, 0) / sample.length)
      : 0;

    let overallSummary = '';
    if (avgScore >= 75) {
      overallSummary = `Your last ${sampleSize} scans show a healthy eating profile (avg ${avgScore}/100). Keep it up!`;
    } else if (avgScore >= 50) {
      overallSummary = `Your eating pattern (avg ${avgScore}/100) needs some attention. Focus on reducing sodium and artificial additives.`;
    } else {
      overallSummary = `Your scanned diet (avg ${avgScore}/100) is high risk for your conditions. Switch to low-sodium whole food alternatives.`;
    }

    return {
      userId,
      analyzedScansCount: sampleSize,
      insights,
      overallSummary
    };
  }
};

/** Compute current and longest eating streaks from scan history */
const computeStreak = (history: ScanHistoryRecord[]): { current: number; longest: number } => {
  if (history.length === 0) return { current: 0, longest: 0 };

  // Group scans by date (YYYY-MM-DD), collect max score per day
  const dayScores: Map<string, number> = new Map();
  for (const scan of history) {
    const day = scan.scannedAt.slice(0, 10);
    const prev = dayScores.get(day) || 0;
    if (scan.personalizedScore > prev) dayScores.set(day, scan.personalizedScore);
  }

  // Sort days descending
  const days = Array.from(dayScores.keys()).sort((a, b) => b.localeCompare(a));

  let currentStreak = 0;
  let longestStreak = 0;
  let streakCount = 0;

  // Today's date in UTC
  const today = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const score = dayScores.get(day) || 0;
    const isHealthy = score >= 60;

    if (i === 0) {
      // Only start current streak if today or yesterday had a scan
      const dayDiff = daysBetween(day, today);
      if (dayDiff <= 1 && isHealthy) {
        streakCount = 1;
      } else if (dayDiff <= 1 && !isHealthy) {
        streakCount = 0;
      }
    } else {
      const prevDay = days[i - 1];
      const dayDiff = daysBetween(day, prevDay);
      if (dayDiff === 1 && isHealthy) {
        streakCount += 1;
      } else {
        if (streakCount > longestStreak) longestStreak = streakCount;
        streakCount = isHealthy ? 1 : 0;
      }
    }

    if (i === 0) currentStreak = streakCount;
  }

  longestStreak = Math.max(longestStreak, streakCount);
  return { current: currentStreak, longest: longestStreak };
};

const daysBetween = (dateA: string, dateB: string): number => {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round(Math.abs(b - a) / 86400000);
};
