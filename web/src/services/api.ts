/**
 * Nutri Lens Web API Service Layer
 * Merged: Person A (WebApiService) + Person B (api) services
 * Handles backend calls with rich offline fallback data for both.
 */

// ── Person A imports ────────────────────────────────────────────────────────
import {
  ProgressDashboardData,
  PatternIntelligenceReport,
  PersonalizedAnalysisResult,
  Product,
  RecallAlert,
  LearningLesson,
} from '@shared/types';

// ── Person B imports ────────────────────────────────────────────────────────
import { UserProfile } from '@shared/types/user';
import { CommunitySubmission } from '@shared/types/community';
import { ComparisonResult, AlternativeRecommendation } from '@shared/types/personalization';

import sampleProducts from '../../../data/indian-food-products.json';
import sampleLessons from '../../../data/learning-lessons.json';

const API_BASE_URL = 'http://localhost:5000/api';
const BASE_URL = '/api';

// ── Person A: WebApiService (Features 2,3,5,6,7,10,11) ─────────────────────
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
        { metricKey: 'HIGH_SODIUM', title: 'High Sodium Foods', percentage: 40, sampleSize: 10, severity: 'HIGH_RISK', description: '40% of your last 10 scanned products contained high sodium (>500mg per serving).', actionableTip: 'Hypertension patients should target <140mg sodium per serving. Check for "Low Sodium" whole food alternatives.' },
        { metricKey: 'HIGH_ADDITIVES', title: 'Artificial Preservatives & Additives', percentage: 60, sampleSize: 10, severity: 'HIGH_RISK', description: '60% of your scanned products contained artificial preservatives (INS 211), colorants (INS 102), or flavor enhancers (INS 621).', actionableTip: 'Reduce ultra-processed foods. Choose products with short ingredient lists (<5 whole food ingredients).' },
        { metricKey: 'LOW_FIBER', title: 'Low Dietary Fiber Gap', percentage: 70, sampleSize: 10, severity: 'MODERATE_WARNING', description: '70% of scanned products provided less than 3g dietary fiber per serving.', actionableTip: 'Target 25-30g total fiber daily. Replace refined maida snacks with whole millet, lentil, or seed-based options.' },
        { metricKey: 'GOOD_FIBER', title: 'High Fiber Choices ✅', percentage: 20, sampleSize: 10, severity: 'HEALTHY_TREND', description: '20% of your scanned products provided high dietary fiber (≥5g per serving). Great work!', actionableTip: 'Keep choosing whole grain muesli and legumes for gut microbiome health.' }
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer demo-token` },
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
      { id: 'recall-001', title: 'FSSAI Safety Alert: Excess Lead & Unauthorized Additive Batch Recall', productName: 'Maggi 2-Minute Masala Noodles', brand: 'Nestlé', barcode: '8901058852011', affectedBatches: ['BATCH-MAG-2026-X89', 'BATCH-MAG-2026-X90'], hazardLevel: 'CRITICAL', reason: 'FSSAI laboratory testing identified heavy metal contamination exceeding permitted national safety standards (lead > 2.5ppm).', announcementDate: '2026-07-28', actionRequired: 'Immediately discontinue consumption. Return affected batch packs to seller for full refund.', fssaiNoticeUrl: 'https://www.fssai.gov.in/advisory/2026/07/heavy-metal-alert' },
      { id: 'recall-002', title: 'FSSAI Food Recall: Undeclared Sulfite Allergen Warning', productName: 'Golden Dry Raisins', brand: 'NatureFresh', barcode: '8908009876543', affectedBatches: ['BATCH-RAISIN-99'], hazardLevel: 'HIGH', reason: 'Unregistered sulfur dioxide (INS 220) preservative found during audit without mandatory package allergen declaration.', announcementDate: '2026-07-15', actionRequired: 'Asthmatic and sulfite-sensitive consumers should avoid consuming this product.', fssaiNoticeUrl: 'https://www.fssai.gov.in/advisory/2026/07/allergen-sulfite' }
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

// ── Person B: api service (Features 8,9,10,12 + Profile) ────────────────────
export const api = {
  // --- Profile & Settings ---
  async getUserProfile(userId: string = 'user_default'): Promise<UserProfile> {
    try {
      const res = await fetch(`${BASE_URL}/users/profile/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      return data.data;
    } catch {
      return {
        id: 'user_default',
        name: 'Harish Parthiban',
        email: 'harish.jparthiban@gmail.com',
        age: 28,
        healthConditions: ['Hypertension', 'Type2Diabetes'],
        allergies: ['Peanuts', 'Dairy'],
        goals: ['LowSodium', 'HighProtein', 'HeartHealth'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${BASE_URL}/users/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const data = await res.json();
    return data.data;
  },

  // --- Learning Mode Library (Feature 10) ---
  async getLearningLessons(): Promise<LearningLesson[]> {
    try {
      const res = await fetch(`${BASE_URL}/learning/lessons`);
      if (!res.ok) throw new Error('Failed to fetch learning lessons');
      const data = await res.json();
      return data.data;
    } catch {
      return [
        { id: 'LESSON-001', title: 'Why Dietary Fibre Keeps You Full & Protects Gut Health', category: 'Macro & Micro Nutrients', triggerKey: 'FIBER', conceptHeadline: 'Soluble fibre slows glucose surges and fuels gut microbiota.', quickSummary: 'Dietary fibre slows down glucose absorption and fuels beneficial gut flora.', detailedScience: 'Fibre is a plant-based carbohydrate that human digestive enzymes cannot break down. Soluble fibre forms a gel in your intestine, lowering LDL cholesterol and stabilizing glucose spikes post-meal.', keyTakeaway: 'Most Indian adults consume only ~15g of the recommended 30g daily fibre. Choose whole grains and legumes over refined flour.', readTimeMinutes: 3 },
        { id: 'LESSON-002', title: 'Decoding INS 211 & Sodium Benzoate in Packaged Snacks', category: 'Additives & Preservatives', triggerKey: 'INS_211', conceptHeadline: 'Sodium Benzoate extends shelf life but adds hidden sodium load.', quickSummary: 'Sodium Benzoate extends shelf life but adds hidden sodium load to your daily diet.', detailedScience: 'Sodium Benzoate (INS 211) is an acidic food preservative used widely in packaged bhujia, pickles, and sauces. Combined with added salt, it significantly increases daily sodium intake without tasting overwhelmingly salty.', keyTakeaway: 'Preservatives contribute to hidden daily sodium intake. Check serving sizes carefully.', readTimeMinutes: 4 },
        { id: 'LESSON-003', title: 'Why Vanaspati & Industrial Trans Fats Harm Heart Health', category: 'Cardiovascular & Metabolic Health', triggerKey: 'TRANS_FAT', conceptHeadline: 'Hydrogenated oils raise harmful LDL while aggressively lowering HDL.', quickSummary: 'Hydrogenated oils raise bad LDL cholesterol while aggressively lowering protective HDL.', detailedScience: 'Industrial trans fats are formed when hydrogen gas is bubbled through vegetable oils to make them solid at room temperature. They increase arterial plaque formation and elevate cardiovascular disease risk far more than saturated fats.', keyTakeaway: 'Look for "Partially Hydrogenated Oil" on ingredient labels and choose cold-pressed oils or ghee in moderation.', readTimeMinutes: 5 }
      ];
    }
  },

  // --- Community-Verified Regional Products (Feature 12) ---
  async getCommunitySubmissions(): Promise<CommunitySubmission[]> {
    try {
      const res = await fetch(`${BASE_URL}/community/submissions`);
      if (!res.ok) throw new Error('Failed to fetch community submissions');
      const data = await res.json();
      return data.data;
    } catch {
      return [
        { id: 'SUB-101', submitterId: 'user_rajesh', productName: 'Kerala Roasted Banana Chips', brand: 'Malabar Heritage', category: 'Regional Snacks', barcode: '8905554443331', labelImageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500', ingredientText: 'Raw Plantain, Pure Coconut Oil, Iodised Salt, Turmeric Powder.', extractedIngredients: ['Raw Plantain', 'Pure Coconut Oil', 'Iodised Salt', 'Turmeric Powder'], region: 'Kerala / South India', verificationCount: 2, requiredVerifications: 3, verificationStatus: 'pending_verification', verifiedByUsers: ['user_priya', 'user_anand'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'SUB-102', submitterId: 'user_sunita', productName: 'Special Roasted Chana Namkeen', brand: 'Jaipur Desi Sweets', category: 'Namkeen', ingredientText: 'Bengal Gram (Chana), Mustard Oil, Red Chilli Powder, Amchur Powder, Black Salt.', extractedIngredients: ['Bengal Gram', 'Mustard Oil', 'Red Chilli Powder', 'Amchur Powder', 'Black Salt'], region: 'Rajasthan / North India', verificationCount: 3, requiredVerifications: 3, verificationStatus: 'verified', verifiedByUsers: ['user_rajesh', 'user_amit', 'user_pooja'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
    }
  },

  async verifyCommunitySubmission(submissionId: string, userId: string = 'user_default', confirmMatch: boolean = true): Promise<any> {
    const res = await fetch(`${BASE_URL}/community/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, userId, confirmMatch })
    });
    if (!res.ok) throw new Error('Failed to verify submission');
    return res.json();
  },

  // --- Healthy Alternatives & Shopping History (Features 8 & 9) ---
  async getHealthyAlternative(barcodeOrId: string): Promise<AlternativeRecommendation> {
    try {
      const res = await fetch(`${BASE_URL}/personalization/alternative/${barcodeOrId}`);
      if (!res.ok) throw new Error('Failed to fetch alternative');
      const data = await res.json();
      return data.data;
    } catch {
      return {
        originalProductId: 'PROD-8901234567890',
        originalProductName: 'Crunchy Masala Noodle Snack',
        recommendedProduct: { id: 'PROD-ALT-001', barcode: '8908887776665', name: 'Organic Whole Grain Roasted Oats Muesli', brand: 'EarthBites', category: 'Instant Noodles / Breakfast', ingredientText: 'Whole Grain Rolled Oats, Roasted Seeds (Pumpkin, Sunflower), Dried Cranberries, Raw Honey.', ingredients: [{ id: 'a1', name: 'Whole Grain Rolled Oats', isAdditive: false }, { id: 'a2', name: 'Roasted Seeds', isAdditive: false }, { id: 'a3', name: 'Raw Honey', isAdditive: false }], additives: [], manufacturingRationale: [], overallScore: 88, createdAt: new Date().toISOString() },
        personalizedScore: 88,
        keyImprovements: ['80% lower sodium content', 'Zero synthetic dyes (No Tartrazine INS 102)', 'High dietary fibre (8.5g per serving)'],
        verdict: 'Organic Whole Grain Muesli is a significantly healthier choice. Saves 34g sugar & 650mg sodium per 100g while adding 8g natural dietary fibre without synthetic color dyes or MSG.'
      };
    }
  },

  async compareProducts(productId1: string, productId2: string): Promise<ComparisonResult> {
    try {
      const res = await fetch(`${BASE_URL}/personalization/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId1, productId2 })
      });
      if (!res.ok) throw new Error('Failed to compare products');
      const data = await res.json();
      return data.data;
    } catch {
      return {
        productA: { id: 'PROD-8901234567890', name: 'Crunchy Masala Noodle Snack', brand: 'TastyBites', category: 'Instant Noodles', overallScore: 42, ingredientText: 'Maida, Palm Oil, Salt, MSG (INS 621), Tartrazine (INS 102)', ingredients: [], additives: [], manufacturingRationale: [], createdAt: '' },
        productB: { id: 'PROD-8909876543210', name: 'Creamy Almond Milk Shake 200ml', brand: 'NutriFlow', category: 'Beverages', overallScore: 78, ingredientText: 'Water, Almond Paste, Sugar, Soy Lecithin (INS 322), Xanthan Gum (INS 415)', ingredients: [], additives: [], manufacturingRationale: [], createdAt: '' },
        productAPersonalizedScore: 42,
        productBPersonalizedScore: 78,
        winningProduct: 'B',
        winnerBadge: 'Significantly Healthier Pick',
        plainLanguageVerdict: 'Creamy Almond Milk Shake is significantly healthier (Score 78 vs 42). It avoids industrial palm oil, synthetic yellow dyes (Tartrazine), and MSG.',
        comparisonMetrics: [
          { metricName: 'Nutrition Score', productAValue: '42 / 100', productBValue: '78 / 100', betterProduct: 'B', explanation: 'Almond Milk Shake contains lower sodium and higher healthy fats.' },
          { metricName: 'Harmful Additives', productAValue: '2 High Risk (INS 102, INS 621)', productBValue: '0 High Risk (INS 322 Safe)', betterProduct: 'B', explanation: 'No synthetic dyes or artificial MSG.' },
          { metricName: 'Primary Fat Source', productAValue: 'Palmolein Oil', productBValue: 'Almond Paste', betterProduct: 'B', explanation: 'Almond paste provides healthy unsaturated fatty acids.' }
        ]
      };
    }
  }
};
