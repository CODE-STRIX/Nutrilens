import { 
  ProgressDashboardData, 
  PatternIntelligenceReport, 
  PersonalizedAnalysisResult,
  Product,
  RecallAlert,
  LearningLesson,
  UserProfile
} from '@shared/types';

import sampleProducts from '../../../data/indian-food-products.json';
import sampleLessons from '../../../data/learning-lessons.json';

const API_BASE_URL = 'http://localhost:5000/api';

export const WebApiService = {
  // --- Progress Dashboard (Feature 6) ---
  getDashboard: async (userId: string = 'usr-demo-rahul'): Promise<ProgressDashboardData> => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: { 'Authorization': `Bearer demo-token` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback if backend is offline
    }

    return {
      userId,
      userName: 'Rahul Sharma',
      runningAverageScore: 40,
      totalScans: 10,
      currentStreakDays: 3,
      longestStreakDays: 7,
      scansThisWeek: 4,
      healthTier: 'NEEDS_ATTENTION',
      recentScans: [
        { id: 's1', userId, productId: 'prod-maggi-2min', productName: 'Maggi 2-Minute Noodles', brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date().toISOString(), personalizedScore: 17, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
        { id: 's2', userId, productId: 'prod-muesli-whole-grain', productName: 'Whole Grain Millet Muesli', brand: 'TrueElements', category: 'Breakfast Cereals', scannedAt: new Date(Date.now() - 86400000).toISOString(), personalizedScore: 88, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
        { id: 's3', userId, productId: 'prod-lays-magic-masala', productName: "Lay's Magic Masala Chips", brand: 'PepsiCo', category: 'Potato Chips', scannedAt: new Date(Date.now() - 2 * 86400000).toISOString(), personalizedScore: 28, sodiumMg: 240, sugarGrams: 1.2, saturatedFatGrams: 4.1, fiberGrams: 1.0, hasAdditives: true },
        { id: 's4', userId, productId: 'prod-bikaner-local-sev', productName: 'Local Bikaneri Besan Sev', brand: 'Shree Ram Namkeen', category: 'Regional Snacks', scannedAt: new Date(Date.now() - 3 * 86400000).toISOString(), personalizedScore: 45, sodiumMg: 310, sugarGrams: 0.5, saturatedFatGrams: 2.5, fiberGrams: 2.5, hasAdditives: false }
      ]
    };
  },

  // --- Pattern Intelligence (Feature 7) ---
  getPatternIntelligence: async (userId: string = 'usr-demo-rahul', lastN: number = 10): Promise<PatternIntelligenceReport> => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/patterns?lastN=${lastN}`, {
        headers: { 'Authorization': `Bearer demo-token` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      userId,
      analyzedScansCount: 10,
      insights: [
        {
          metricKey: 'HIGH_SODIUM',
          title: 'High Sodium Foods',
          percentage: 40,
          sampleSize: 10,
          severity: 'HIGH_RISK',
          description: '40% of your last 10 scanned products contained high sodium (>500mg per serving).',
          actionableTip: 'Hypertension patients should target <140mg sodium per serving. Check for "Low Sodium" whole food alternatives.'
        },
        {
          metricKey: 'HIGH_ADDITIVES',
          title: 'Artificial Preservatives & Additives',
          percentage: 60,
          sampleSize: 10,
          severity: 'HIGH_RISK',
          description: '60% of your scanned products contained artificial preservatives (INS 211), colorants (INS 102), or flavor enhancers (INS 621).',
          actionableTip: 'Reduce ultra-processed foods. Choose products with short ingredient lists (<5 whole food ingredients).'
        },
        {
          metricKey: 'LOW_FIBER',
          title: 'Low Dietary Fiber Gap',
          percentage: 70,
          sampleSize: 10,
          severity: 'MODERATE_WARNING',
          description: '70% of scanned products provided less than 3g dietary fiber per serving.',
          actionableTip: 'Target 25-30g total fiber daily. Replace refined maida snacks with whole millet, lentil, or seed-based options.'
        },
        {
          metricKey: 'GOOD_FIBER',
          title: 'High Fiber Choices ✅',
          percentage: 20,
          sampleSize: 10,
          severity: 'HEALTHY_TREND',
          description: '20% of your scanned products provided high dietary fiber (≥5g per serving). Great work!',
          actionableTip: 'Keep choosing whole grain muesli and legumes for gut microbiome health.'
        }
      ],
      overallSummary: 'Your scanned diet (avg 40/100) is high risk for Hypertension. Focus on reducing sodium and artificial additives.'
    };
  },

  // --- Product Catalog (Features 2 & 3) ---
  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    return sampleProducts as unknown as Product[];
  },

  // --- Personalized Analysis (Feature 5) ---
  analyzeProduct: async (productId: string, userId: string = 'usr-demo-rahul'): Promise<PersonalizedAnalysisResult> => {
    try {
      const res = await fetch(`${API_BASE_URL}/personalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer demo-token`
        },
        body: JSON.stringify({ productId, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const products = sampleProducts as unknown as Product[];
    const prod = products.find(p => p.id === productId) || products[0];

    return {
      productId: prod.id,
      productName: prod.name,
      brand: prod.brand,
      baseScore: prod.overallBaseScore ?? 42,
      personalizedScore: 17,
      safetyTier: 'CRITICAL_RISK',
      summaryHeadline: `${prod.name} gets a rating of 17/100 for Rahul Sharma.`,
      plainLanguageVerdict: '⚠️ NOT RECOMMENDED: High sodium content (850mg) poses high risk for Hypertension. Contains INS 211 preservative.',
      conditionFlags: [
        { condition: 'Hypertension', severity: 'WARNING', title: 'Critical Sodium Warning', reasoning: 'Contains 850mg sodium per serving (recommended limit is <140mg for hypertension management).' },
        { condition: 'HighCholesterol', severity: 'WARNING', title: 'Saturated Fat & Palm Oil', reasoning: 'Contains 5.2g saturated fat from Refined Palm Oil.' }
      ],
      allergenAlerts: [],
      goalCompliance: [
        { goal: 'LowSodium', status: 'CONFLICT', explanation: 'Exceeds low-sodium target by 710mg.' }
      ],
      keyRiskIngredients: ['Sodium / Salt', 'Refined Palm Oil', 'INS 211 Sodium Benzoate']
    };
  },

  // --- FSSAI Recall Notices (Feature 11) ---
  getRecallAlerts: async (): Promise<RecallAlert[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/recalls`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    return [
      {
        id: 'recall-001',
        title: 'FSSAI Safety Alert: Excess Lead & Unauthorized Additive Batch Recall',
        productName: 'Maggi 2-Minute Masala Noodles',
        brand: 'Nestlé',
        barcode: '8901058852011',
        affectedBatches: ['BATCH-MAG-2026-X89', 'BATCH-MAG-2026-X90'],
        hazardLevel: 'CRITICAL',
        reason: 'FSSAI laboratory testing identified heavy metal contamination exceeding permitted national safety standards (lead > 2.5ppm).',
        announcementDate: '2026-07-28',
        actionRequired: 'Immediately discontinue consumption. Return affected batch packs to seller for full refund.',
        fssaiNoticeUrl: 'https://www.fssai.gov.in/advisory/2026/07/heavy-metal-alert'
      },
      {
        id: 'recall-002',
        title: 'FSSAI Food Recall: Undeclared Sulfite Allergen Warning',
        productName: 'Golden Dry Raisins',
        brand: 'NatureFresh',
        barcode: '8908009876543',
        affectedBatches: ['BATCH-RAISIN-99'],
        hazardLevel: 'HIGH',
        reason: 'Unregistered sulfur dioxide (INS 220) preservative found during audit without mandatory package allergen declaration.',
        announcementDate: '2026-07-15',
        actionRequired: 'Asthmatic and sulfite-sensitive consumers should avoid consuming this product.',
        fssaiNoticeUrl: 'https://www.fssai.gov.in/advisory/2026/07/allergen-sulfite'
      }
    ] as any[];
  },

  // --- Learning Lessons (Feature 10) ---
  getLessons: async (): Promise<LearningLesson[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/learning/all`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    return sampleLessons as LearningLesson[];
  }
};
