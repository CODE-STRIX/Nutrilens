/**
 * Nutri Lens Mobile — ML Intelligence Service Layer
 * Connects mobile screens to the backend ML API endpoints.
 * Provides rich local fallback logic when backend is offline (offline-first).
 * 
 * Models wired:
 *   Model 1+2 : OCR & NLP Entity Parser        → parseOcrLabelText()
 *   Model 3   : Personalized Health Ranker      → rankProductForUser()
 *   Model 4   : Vector Alternative Recommender  → getSmartAlternative()
 *   Model 5   : Pattern Anomaly Detector        → analyzeEatingPatterns()
 */

import { Product } from '../../../shared/types/product';
import { UserProfile } from '../../../shared/types/user';
import { MOCK_PRODUCTS } from './mockData';

// ── API Base URL ──────────────────────────────────────────────────────────────
// For Android emulator:  http://10.0.2.2:5000/api
// For physical device:   http://<YOUR_LOCAL_IP>:5000/api
const ML_API_BASE = 'http://10.0.2.2:5000/api/ml';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MlOcrResult {
  rawText: string;
  extractedIngredients: Array<{
    id: string;
    name: string;
    isAdditive: boolean;
    insCode?: string;
    purpose?: string;
    healthFlag?: 'safe' | 'caution' | 'warning';
  }>;
  detectedINSAdditives: Array<{
    id: string;
    name: string;
    insCode?: string;
    category: string;
    hazardRating?: string;
  }>;
  detectedAllergens: string[];
  confidenceScore: number;
}

export interface MlHealthRankResult {
  productId: string;
  productName: string;
  personalizedScore: number;
  safetyTier: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL_RISK';
  plainLanguageVerdict: string;
  conditionFlags: Array<{ condition: string; severity: string; title: string; reasoning: string }>;
  allergenAlerts: Array<{ allergy: string; foundInIngredient: string; warningMessage: string }>;
  goalCompliance: Array<{ goal: string; status: string; explanation: string }>;
  keyRiskIngredients: string[];
}

export interface MlAlternativeResult {
  originalProductId: string;
  originalProductName: string;
  recommendedProduct: Product;
  personalizedScore: number;
  keyImprovements: string[];
  verdict: string;
}

export interface MlPatternResult {
  userId: string;
  analyzedScansCount: number;
  insights: Array<{
    metricKey: string;
    title: string;
    percentage: number;
    sampleSize: number;
    severity: 'HIGH_RISK' | 'MODERATE_WARNING' | 'HEALTHY_TREND';
    description: string;
    actionableTip: string;
  }>;
  overallSummary: string;
}

export interface ScanRecord {
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

// ── ML Service ────────────────────────────────────────────────────────────────
export const MlService = {
  /**
   * Model 1 & 2: Parse OCR label text into structured ingredient & additive entities.
   * Used by ScannerScreen when barcode match fails for unlisted/regional products.
   */
  async parseOcrLabelText(ocrText: string): Promise<MlOcrResult> {
    try {
      const res = await fetch(`${ML_API_BASE}/parse-ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocrText }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data as MlOcrResult;
      }
    } catch {
      // Backend offline — fall back to local regex parse
    }

    // ── Local Offline Fallback (Model 1 & 2 simplified) ──────────────────────
    const tokens = ocrText
      .replace(/\r?\n/g, ' ')
      .split(/[,;.]/)
      .map(t => t.trim())
      .filter(t => t.length > 1);

    const detectedAllergens: string[] = [];
    const allergenMap: Record<string, string> = {
      maida: 'Gluten', wheat: 'Gluten', peanut: 'Peanuts',
      groundnut: 'Peanuts', milk: 'Dairy', whey: 'Dairy',
      soy: 'Soy', soya: 'Soy', sulphite: 'Sulfites', sulfite: 'Sulfites',
    };

    tokens.forEach(t => {
      const lower = t.toLowerCase();
      Object.entries(allergenMap).forEach(([key, label]) => {
        if (lower.includes(key) && !detectedAllergens.includes(label)) {
          detectedAllergens.push(label);
        }
      });
    });

    return {
      rawText: ocrText,
      extractedIngredients: tokens.map((t, i) => ({
        id: `local-ing-${i}`,
        name: t,
        isAdditive: /INS\s*\d{3}/i.test(t),
        healthFlag: 'safe' as const,
      })),
      detectedINSAdditives: [],
      detectedAllergens,
      confidenceScore: 0.70,
    };
  },

  /**
   * Model 3: Personalized Health Ranking Engine.
   * Used by ProductDetailScreen to score a product against the user's profile.
   */
  async rankProductForUser(product: Product, user: UserProfile): Promise<MlHealthRankResult> {
    try {
      const res = await fetch(`${ML_API_BASE}/rank-health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, user }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data as MlHealthRankResult;
      }
    } catch {
      // Backend offline — compute locally
    }

    // ── Local Offline Fallback (Rule-based deterministic scoring) ─────────────
    let score = product.overallScore ?? 60;
    const conditionFlags: MlHealthRankResult['conditionFlags'] = [];
    const allergenAlerts: MlHealthRankResult['allergenAlerts'] = [];
    const keyRiskIngredients: string[] = [];

    // Allergen check
    const userAllergies = (user.allergies || []).map((a: string) => a.toLowerCase());
    (product.ingredients || []).forEach(ing => {
      const ingLower = ing.name.toLowerCase();
      userAllergies.forEach(allergy => {
        if (ingLower.includes(allergy) ||
          (allergy.includes('gluten') && (ingLower.includes('maida') || ingLower.includes('wheat'))) ||
          (allergy.includes('peanut') && ingLower.includes('groundnut'))) {
          score -= 40;
          allergenAlerts.push({
            allergy,
            foundInIngredient: ing.name,
            warningMessage: `⚠️ ALLERGEN: Contains ${ing.name}!`,
          });
          keyRiskIngredients.push(ing.name);
        }
      });
    });

    const nutrition = (product as any).nutrition;
    if (nutrition) {
      if (nutrition.sodiumMg > 500) {
        score -= 20;
        conditionFlags.push({ condition: 'Hypertension', severity: 'WARNING', title: 'High Sodium', reasoning: `${nutrition.sodiumMg}mg sodium detected.` });
        keyRiskIngredients.push('Sodium');
      }
      if (nutrition.sugarGrams > 10) {
        score -= 15;
        conditionFlags.push({ condition: 'Type2Diabetes', severity: 'WARNING', title: 'High Sugar', reasoning: `${nutrition.sugarGrams}g sugar per serving.` });
      }
    }

    const finalScore = Math.max(0, Math.min(100, score));
    let safetyTier: MlHealthRankResult['safetyTier'] = 'EXCELLENT';
    if (allergenAlerts.length > 0 || finalScore < 30) safetyTier = 'CRITICAL_RISK';
    else if (finalScore < 50) safetyTier = 'POOR';
    else if (finalScore < 70) safetyTier = 'MODERATE';
    else if (finalScore < 85) safetyTier = 'GOOD';

    return {
      productId: product.id,
      productName: product.name,
      personalizedScore: finalScore,
      safetyTier,
      plainLanguageVerdict: safetyTier === 'CRITICAL_RISK'
        ? '⚠️ NOT RECOMMENDED for your profile.'
        : safetyTier === 'EXCELLENT' || safetyTier === 'GOOD'
          ? '✅ Good choice for your health goals.'
          : '⚡ Consume with awareness.',
      conditionFlags,
      allergenAlerts,
      goalCompliance: [],
      keyRiskIngredients: Array.from(new Set(keyRiskIngredients)),
    };
  },

  /**
   * Model 4: Vector Space Alternative Recommendation Engine.
   * Used by ProductDetailScreen & SmartShoppingScreen to suggest healthier picks.
   */
  async getSmartAlternative(product: Product, user: UserProfile): Promise<MlAlternativeResult | null> {
    try {
      const res = await fetch(`${ML_API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, user }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data as MlAlternativeResult;
      }
    } catch {
      // Backend offline — pick best scored local mock
    }

    // ── Local Offline Fallback ─────────────────────────────────────────────────
    const candidates = (Object.values(MOCK_PRODUCTS) as unknown as Product[]).filter(
      (p: any) => p.id !== product.id && p.category === product.category
    );

    if (candidates.length === 0) return null;

    const best = candidates.sort((a: any, b: any) =>
      (b.overallScore ?? 0) - (a.overallScore ?? 0)
    )[0];

    return {
      originalProductId: product.id,
      originalProductName: product.name,
      recommendedProduct: best,
      personalizedScore: best.overallScore ?? 70,
      keyImprovements: ['Better overall nutrition profile', 'Fewer synthetic additives'],
      verdict: `${best.name} is a healthier choice in the ${product.category} category.`,
    };
  },

  /**
   * Model 5: Food Pattern Intelligence & Anomaly Detection.
   * Used by DashboardScreen and PatternIntelligenceWidget.
   */
  async analyzeEatingPatterns(userId: string, scanHistory: ScanRecord[]): Promise<MlPatternResult> {
    try {
      const res = await fetch(`${ML_API_BASE}/pattern-anomalies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, scanHistory }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data as MlPatternResult;
      }
    } catch {
      // Backend offline — compute locally
    }

    // ── Local Offline Fallback ─────────────────────────────────────────────────
    const total = scanHistory.length;
    if (total === 0) {
      return { userId, analyzedScansCount: 0, insights: [], overallSummary: 'No scan history yet.' };
    }

    const insights: MlPatternResult['insights'] = [];
    const highSodiumPct = Math.round((scanHistory.filter(s => s.sodiumMg > 400).length / total) * 100);
    const additivePct = Math.round((scanHistory.filter(s => s.hasAdditives).length / total) * 100);
    const lowFiberPct = Math.round((scanHistory.filter(s => s.fiberGrams < 3).length / total) * 100);

    if (highSodiumPct >= 30) {
      insights.push({
        metricKey: 'HIGH_SODIUM',
        title: 'High Sodium Pattern Detected',
        percentage: highSodiumPct,
        sampleSize: total,
        severity: highSodiumPct >= 50 ? 'HIGH_RISK' : 'MODERATE_WARNING',
        description: `${highSodiumPct}% of your scans show high sodium content (>400mg/serving).`,
        actionableTip: 'Opt for products with <140mg sodium per serving for heart health.',
      });
    }
    if (additivePct >= 40) {
      insights.push({
        metricKey: 'HIGH_ADDITIVES',
        title: 'Ultra-Processed Food Load',
        percentage: additivePct,
        sampleSize: total,
        severity: 'HIGH_RISK',
        description: `${additivePct}% of scanned items contain synthetic additives.`,
        actionableTip: 'Choose regional whole-food snacks with short ingredient lists.',
      });
    }
    if (lowFiberPct >= 50) {
      insights.push({
        metricKey: 'LOW_FIBER',
        title: 'Dietary Fiber Gap',
        percentage: lowFiberPct,
        sampleSize: total,
        severity: 'MODERATE_WARNING',
        description: `${lowFiberPct}% of scanned products are low in dietary fiber (<3g/serving).`,
        actionableTip: 'Add millet muesli, lentils, and whole fruits to boost fiber intake.',
      });
    }

    return {
      userId,
      analyzedScansCount: total,
      insights,
      overallSummary: insights.length > 0
        ? `Found ${insights.length} dietary risk pattern(s) across your last ${total} scans.`
        : `Your recent scans look balanced — keep making smart choices!`,
    };
  },
};
