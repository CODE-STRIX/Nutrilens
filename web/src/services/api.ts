import { UserProfile, HealthCondition, Allergy, DietaryGoal } from '@shared/types/user';
import { LearningLesson } from '@shared/types/learning';
import { CommunitySubmission } from '@shared/types/community';
import { Product, Additive } from '@shared/types/product';
import { ComparisonResult, AlternativeRecommendation } from '@shared/types/personalization';

const BASE_URL = '/api';

export const api = {
  // --- Person B: Profile & Settings Service ---
  async getUserProfile(userId: string = 'user_default'): Promise<UserProfile> {
    try {
      const res = await fetch(`${BASE_URL}/users/profile/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Backend offline, using fallback profile data', e);
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

  // --- Person B: Learning Mode Library ---
  async getLearningLessons(): Promise<LearningLesson[]> {
    try {
      const res = await fetch(`${BASE_URL}/learning/lessons`);
      if (!res.ok) throw new Error('Failed to fetch learning lessons');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Backend offline, using fallback learning lessons', e);
      return [
        {
          id: 'LESSON-001',
          title: 'Why Dietary Fibre Keeps You Full & Protects Gut Health',
          category: 'Macro & Micro Nutrients',
          triggerKey: 'FIBER',
          conceptHeadline: 'Soluble fibre slows glucose surges and fuels gut microbiota.',
          quickSummary: 'Dietary fibre slows down glucose absorption and fuels beneficial gut flora.',
          detailedScience: 'Fibre is a plant-based carbohydrate that human digestive enzymes cannot break down. Soluble fibre forms a gel in your intestine, lowering LDL cholesterol and stabilizing glucose spikes post-meal.',
          keyTakeaway: 'Most Indian adults consume only ~15g of the recommended 30g daily fibre. Choose whole grains and legumes over refined flour.',
          readTimeMinutes: 3
        },
        {
          id: 'LESSON-002',
          title: 'Decoding INS 211 & Sodium Benzoate in Packaged Snacks',
          category: 'Additives & Preservatives',
          triggerKey: 'INS_211',
          conceptHeadline: 'Sodium Benzoate extends shelf life but adds hidden sodium load.',
          quickSummary: 'Sodium Benzoate extends shelf life but adds hidden sodium load to your daily diet.',
          detailedScience: 'Sodium Benzoate (INS 211) is an acidic food preservative used widely in packaged bhujia, pickles, and sauces. Combined with added salt, it significantly increases daily sodium intake without tasting overwhelmingly salty.',
          keyTakeaway: 'Preservatives contribute to hidden daily sodium intake. Check serving sizes carefully.',
          readTimeMinutes: 4
        },
        {
          id: 'LESSON-003',
          title: 'Why Vanaspati & Industrial Trans Fats Harm Heart Health',
          category: 'Cardiovascular & Metabolic Health',
          triggerKey: 'TRANS_FAT',
          conceptHeadline: 'Hydrogenated oils raise harmful LDL while aggressively lowering HDL.',
          quickSummary: 'Hydrogenated oils raise bad LDL cholesterol while aggressively lowering protective HDL.',
          detailedScience: 'Industrial trans fats are formed when hydrogen gas is bubbled through vegetable oils to make them solid at room temperature. They increase arterial plaque formation and elevate cardiovascular disease risk far more than saturated fats.',
          keyTakeaway: 'Look for "Partially Hydrogenated Oil" on ingredient labels and choose cold-pressed oils or ghee in moderation.',
          readTimeMinutes: 5
        }
      ];
    }
  },

  // --- Person B: Community-Verified Local Products ---
  async getCommunitySubmissions(): Promise<CommunitySubmission[]> {
    try {
      const res = await fetch(`${BASE_URL}/community/submissions`);
      if (!res.ok) throw new Error('Failed to fetch community submissions');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Backend offline, using fallback community submissions', e);
      return [
        {
          id: 'SUB-101',
          submitterId: 'user_rajesh',
          productName: 'Kerala Roasted Banana Chips',
          brand: 'Malabar Heritage',
          category: 'Regional Snacks',
          barcode: '8905554443331',
          labelImageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
          ingredientText: 'Raw Plantain, Pure Coconut Oil, Iodised Salt, Turmeric Powder.',
          extractedIngredients: ['Raw Plantain', 'Pure Coconut Oil', 'Iodised Salt', 'Turmeric Powder'],
          region: 'Kerala / South India',
          verificationCount: 2,
          requiredVerifications: 3,
          verificationStatus: 'pending_verification',
          verifiedByUsers: ['user_priya', 'user_anand'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'SUB-102',
          submitterId: 'user_sunita',
          productName: 'Special Roasted Chana Namkeen',
          brand: 'Jaipur Desi Sweets',
          category: 'Namkeen',
          ingredientText: 'Bengal Gram (Chana), Mustard Oil, Red Chilli Powder, Amchur Powder, Black Salt.',
          extractedIngredients: ['Bengal Gram', 'Mustard Oil', 'Red Chilli Powder', 'Amchur Powder', 'Black Salt'],
          region: 'Rajasthan / North India',
          verificationCount: 3,
          requiredVerifications: 3,
          verificationStatus: 'verified',
          verifiedByUsers: ['user_rajesh', 'user_amit', 'user_pooja'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
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

  // --- Person B: Alternatives & Shopping Assistant History ---
  async getHealthyAlternative(barcodeOrId: string): Promise<AlternativeRecommendation> {
    try {
      const res = await fetch(`${BASE_URL}/personalization/alternative/${barcodeOrId}`);
      if (!res.ok) throw new Error('Failed to fetch alternative');
      const data = await res.json();
      return data.data;
    } catch (e) {
      return {
        originalProductId: 'PROD-8901234567890',
        originalProductName: 'Crunchy Masala Noodle Snack',
        recommendedProduct: {
          id: 'PROD-ALT-001',
          barcode: '8908887776665',
          name: 'Organic Whole Grain Roasted Oats Muesli',
          brand: 'EarthBites',
          category: 'Instant Noodles / Breakfast',
          ingredientText: 'Whole Grain Rolled Oats, Roasted Seeds (Pumpkin, Sunflower), Dried Cranberries, Raw Honey.',
          ingredients: [
            { id: 'a1', name: 'Whole Grain Rolled Oats', isAdditive: false },
            { id: 'a2', name: 'Roasted Seeds', isAdditive: false },
            { id: 'a3', name: 'Raw Honey', isAdditive: false }
          ],
          additives: [],
          manufacturingRationale: [],
          overallScore: 88,
          createdAt: new Date().toISOString()
        },
        personalizedScore: 88,
        keyImprovements: [
          '80% lower sodium content',
          'Zero synthetic dyes (No Tartrazine INS 102)',
          'High dietary fibre (8.5g per serving)'
        ],
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
    } catch (e) {
      return {
        productA: {
          id: 'PROD-8901234567890',
          name: 'Crunchy Masala Noodle Snack',
          brand: 'TastyBites',
          category: 'Instant Noodles',
          overallScore: 42,
          ingredientText: 'Maida, Palm Oil, Salt, MSG (INS 621), Tartrazine (INS 102)',
          ingredients: [], additives: [], manufacturingRationale: [], createdAt: ''
        },
        productB: {
          id: 'PROD-8909876543210',
          name: 'Creamy Almond Milk Shake 200ml',
          brand: 'NutriFlow',
          category: 'Beverages',
          overallScore: 78,
          ingredientText: 'Water, Almond Paste, Sugar, Soy Lecithin (INS 322), Xanthan Gum (INS 415)',
          ingredients: [], additives: [], manufacturingRationale: [], createdAt: ''
        },
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
