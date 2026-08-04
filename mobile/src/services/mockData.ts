// Nutri Lens - Mock Data for Mobile Application (Person D Scope & Testing)

import { LearningLesson, Product, ScanHistoryEntry, UserProfile } from '../../../shared/types';

export const SAMPLE_USER_PROFILE: UserProfile = {
  id: 'user_001',
  name: 'Rajesh Kumar',
  age: 38,
  gender: 'male',
  conditions: ['hypertension', 'diabetes_type_2'],
  allergies: ['peanuts', 'gluten'],
  goals: ['low_sodium', 'low_sugar', 'clean_eating'],
  dailyScanLimit: 10,
};

export const MOCK_PRODUCTS: Record<string, Product> = {
  p_maggi: {
    id: 'p_maggi',
    barcode: '8901058000053',
    name: '2-Minute Masala Instant Noodles',
    brand: 'Maggi',
    category: 'Instant Noodles / Snacks',
    overallScore: 34,
    processingLevel: 'ultra_processed',
    nutritionFacts: {
      servingSize: '70g',
      calories: 310,
      totalFat: 12.5,
      saturatedFat: 5.8,
      transFat: 0.1,
      carbohydrates: 43.0,
      sugars: 1.8,
      addedSugars: 1.2,
      protein: 6.2,
      sodium: 860, // Very High Sodium
      fiber: 2.1,
    },
    ingredients: [
      {
        id: 'ing_maida',
        name: 'Refined Wheat Flour (Maida)',
        category: 'whole_food',
        description: 'Stripped grain flour high in glycemic load.',
        healthEffect: 'Rapid spike in blood sugar, low dietary fiber.',
        safetyLevel: 'caution',
        commonIn: ['Biscuits', 'White Bread', 'Instant Noodles'],
        manufacturingRationale: {
          ingredientName: 'Refined Wheat Flour (Maida)',
          primaryPurpose: 'cost',
          explanation: 'Extremely cost-efficient carbohydrate matrix that cooks in 2 minutes and provides a soft, elastic noodle structure.',
          industryContext: 'Whole wheat flour creates a denser noodle requiring longer boiling time; maida gelatinizes rapidly during industrial pre-frying.',
          alternativesConsidered: ['Whole Wheat Flour (Atta)', 'Millet Flour', 'Oat Flour'],
        },
      },
      {
        id: 'ing_palm_oil',
        name: 'Palm Oil (Fractionated)',
        category: 'additive',
        description: 'Highly saturated plant oil used for deep frying noodle cakes during processing.',
        healthEffect: 'High saturated fat ratio linked to elevated LDL cholesterol.',
        safetyLevel: 'caution',
        commonIn: ['Chips', 'Packaged Biscuits', 'Pre-fried Noodles'],
        manufacturingRationale: {
          ingredientName: 'Palm Oil',
          primaryPurpose: 'shelf_life',
          explanation: 'Provides high thermal stability during deep frying without going rancid on store shelves in tropical humidity.',
          industryContext: 'Sunflower or olive oil oxidizes much faster, reducing shelf life from 9 months down to 2 months in Indian storage conditions.',
          alternativesConsidered: ['Rice Bran Oil', 'High Oleic Sunflower Oil', 'Mustard Oil'],
        },
      },
      {
        id: 'ing_e621',
        name: 'Monosodium Glutamate (INS 621)',
        code: 'INS 621',
        category: 'flavor_enhancer',
        description: 'Umami flavor enhancer used in spice mixes.',
        healthEffect: 'Generally recognized as safe by FSSAI; can trigger mild sensitivity or headache in susceptible individuals.',
        safetyLevel: 'safe',
        commonIn: ['Soups', 'Soy Sauce', 'Salty Snacks'],
        manufacturingRationale: {
          ingredientName: 'Monosodium Glutamate (INS 621)',
          primaryPurpose: 'flavour',
          explanation: 'Intensifies savory umami notes, allowing reduced usage of expensive real spices like garlic and onion powder.',
          industryContext: 'Achieves a rich, mouth-watering flavor profile at ~1/10th the ingredient cost of natural vegetable extracts.',
          alternativesConsidered: ['Yeast Extract', 'Hydrolyzed Vegetable Protein', 'Mushroom Powder'],
        },
      },
      {
        id: 'ing_ins508',
        name: 'Potassium Chloride (INS 508)',
        code: 'INS 508',
        category: 'additive',
        description: 'Mineral salt added to noodles for firming texture.',
        healthEffect: 'Safe in standard dietary amounts.',
        safetyLevel: 'safe',
        commonIn: ['Low Sodium Salt', 'Processed Meats', 'Canned Soups'],
        manufacturingRationale: {
          ingredientName: 'Potassium Chloride (INS 508)',
          primaryPurpose: 'texture',
          explanation: 'Maintains noodle firmness during boiling so noodles do not turn mushy in water.',
          industryContext: 'Protects starch structure under boiling conditions.',
          alternativesConsidered: ['Calcium Chloride', 'Sodium Polyphosphate'],
        },
      },
    ],
  },
  p_muesli: {
    id: 'p_muesli',
    barcode: '8906001000100',
    name: 'Whole Grain Nut & Seed Muesli',
    brand: 'True Elements',
    category: 'Breakfast Cereals',
    overallScore: 88,
    processingLevel: 'processed',
    nutritionFacts: {
      servingSize: '50g',
      calories: 210,
      totalFat: 6.0,
      saturatedFat: 0.9,
      transFat: 0.0,
      carbohydrates: 32.0,
      sugars: 3.5,
      addedSugars: 0.0,
      protein: 8.5,
      sodium: 45, // Low Sodium
      fiber: 6.8, // High Fiber
    },
    ingredients: [
      {
        id: 'ing_oats',
        name: 'Rolled Oats (45%)',
        category: 'whole_food',
        description: 'Whole grain oats rich in beta-glucan soluble fiber.',
        healthEffect: 'Lowers LDL cholesterol, promotes gut health, slows glucose absorption.',
        safetyLevel: 'safe',
        commonIn: ['Porridge', 'Granola Bars', 'Baking'],
        manufacturingRationale: {
          ingredientName: 'Rolled Oats',
          primaryPurpose: 'texture',
          explanation: 'Provides wholesome chewiness and high dietary fiber structure.',
          industryContext: 'Rolled oats preserve whole-endosperm nutrient integrity without requiring artificial bulking agents.',
          alternativesConsidered: ['Corn Flakes', 'Wheat Flakes'],
        },
      },
      {
        id: 'ing_pumpkin_seeds',
        name: 'Pumpkin & Chia Seeds (15%)',
        category: 'whole_food',
        description: 'Nutrient-dense seeds loaded with magnesium and omega-3 fatty acids.',
        healthEffect: 'Supports heart health and blood sugar stability.',
        safetyLevel: 'safe',
        commonIn: ['Trail Mixes', 'Health Bars'],
        manufacturingRationale: {
          ingredientName: 'Pumpkin & Chia Seeds',
          primaryPurpose: 'flavour',
          explanation: 'Delivers natural crunch, plant protein, and premium visual appeal without synthetic additives.',
          industryContext: 'Whole seeds serve as natural nutrient boosters eliminating the need for synthetic vitamin premixes.',
          alternativesConsidered: ['Sunflower Seeds', 'Flaxseeds'],
        },
      },
      {
        id: 'ing_raw_honey',
        name: 'Raw Honey (5%)',
        category: 'whole_food',
        description: 'Natural unrefined sweetener containing antioxidants.',
        healthEffect: 'Gentler on blood sugar than refined white sugar, rich in polyphenols.',
        safetyLevel: 'safe',
        commonIn: ['Health Drinks', 'Artisanal Bakery'],
        manufacturingRationale: {
          ingredientName: 'Raw Honey',
          primaryPurpose: 'flavour',
          explanation: 'Provides natural sweetness and helps bind oat flakes into clusters without high-fructose corn syrup.',
          industryContext: 'Avoids cheap invert sugar syrup while maintaining clean-label appeal.',
          alternativesConsidered: ['Jaggery', 'Maple Syrup'],
        },
      },
    ],
  },
  p_digestive: {
    id: 'p_digestive',
    barcode: '8901063001234',
    name: 'NutriChoice Hi-Fiber Digestive Biscuits',
    brand: 'Britannia',
    category: 'Biscuits & Cookies',
    overallScore: 62,
    processingLevel: 'processed',
    nutritionFacts: {
      servingSize: '100g',
      calories: 465,
      totalFat: 18.0,
      saturatedFat: 8.5,
      transFat: 0.0,
      carbohydrates: 68.0,
      sugars: 14.5,
      addedSugars: 12.0,
      protein: 7.8,
      sodium: 520,
      fiber: 6.0,
    },
    ingredients: [
      {
        id: 'ing_atta',
        name: 'Whole Wheat Flour (Atta) 55%',
        category: 'whole_food',
        description: 'Whole grain flour retaining wheat bran.',
        healthEffect: 'Provides complex carbohydrates and dietary fiber.',
        safetyLevel: 'safe',
        commonIn: ['Roti', 'Digestive Biscuits', 'Whole Wheat Bread'],
        manufacturingRationale: {
          ingredientName: 'Whole Wheat Flour (Atta)',
          primaryPurpose: 'texture',
          explanation: 'Forms the fibrous matrix of the biscuit while supporting "Hi-Fiber" marketing claims.',
          industryContext: 'Blended with palm oil to prevent excessive hardness during baking.',
          alternativesConsidered: ['Refined Wheat Flour'],
        },
      },
      {
        id: 'ing_sugar',
        name: 'Sugar & Liquid Glucose',
        category: 'sweetener',
        description: 'Refined sugar and corn-derived syrup.',
        healthEffect: 'Contributes to caloric intake and elevated blood sugar levels.',
        safetyLevel: 'caution',
        commonIn: ['Confectionery', 'Packaged Beverages', 'Biscuits'],
        manufacturingRationale: {
          ingredientName: 'Sugar & Liquid Glucose',
          primaryPurpose: 'cost',
          explanation: 'Imparts caramelization color during baking and provides bulk sweetness at minimal cost.',
          industryContext: 'Liquid glucose controls sugar crystallization to maintain uniform crispness over 6 months.',
          alternativesConsidered: ['Stevia', 'Maltitol', 'Jaggery'],
        },
      },
      {
        id: 'ing_ins500ii',
        name: 'Sodium Bicarbonate (INS 500ii)',
        code: 'INS 500ii',
        category: 'additive',
        description: 'Baking soda used as a raising agent.',
        healthEffect: 'Adds to total dietary sodium content.',
        safetyLevel: 'safe',
        commonIn: ['Baked Goods', 'Effervescent Tablets'],
        manufacturingRationale: {
          ingredientName: 'Sodium Bicarbonate (INS 500ii)',
          primaryPurpose: 'texture',
          explanation: 'Releases carbon dioxide gas during baking to create airy crumb texture and lightness.',
          industryContext: 'Standard low-cost leavening agent used globally in cookie manufacturing.',
          alternativesConsidered: ['Ammonium Bicarbonate (INS 503ii)'],
        },
      },
    ],
  },
};

export const MOCK_HEALTHY_ALTERNATIVES: Record<string, Product> = {
  p_maggi: MOCK_PRODUCTS.p_muesli,
};

export const MOCK_SCAN_HISTORY: ScanHistoryEntry[] = [
  { id: 'sh_1', productId: 'p_maggi', productName: '2-Minute Masala Noodles', brand: 'Maggi', timestamp: '2026-08-04T10:30:00Z', score: 34, sodiumMg: 860, sugarsG: 1.8, processingLevel: 'ultra_processed' },
  { id: 'sh_2', productId: 'p_digestive', productName: 'Hi-Fiber Digestive Biscuits', brand: 'Britannia', timestamp: '2026-08-03T16:15:00Z', score: 62, sodiumMg: 520, sugarsG: 14.5, processingLevel: 'processed' },
  { id: 'sh_3', productId: 'p_chips', productName: 'Classic Salted Chips', brand: 'Lay\'s', timestamp: '2026-08-02T19:00:00Z', score: 40, sodiumMg: 690, sugarsG: 0.5, processingLevel: 'ultra_processed' },
  { id: 'sh_4', productId: 'p_juice', productName: 'Mixed Fruit Beverage', brand: 'Tropicana', timestamp: '2026-08-01T12:00:00Z', score: 48, sodiumMg: 80, sugarsG: 18.0, processingLevel: 'processed' },
  { id: 'sh_5', productId: 'p_muesli', productName: 'Nut & Seed Muesli', brand: 'True Elements', timestamp: '2026-07-31T08:30:00Z', score: 88, sodiumMg: 45, sugarsG: 3.5, processingLevel: 'processed' },
];

export const MOCK_LEARNING_LESSONS: LearningLesson[] = [
  {
    id: 'lesson_1',
    title: 'Decoding INS 211: Sodium Benzoate',
    category: 'Additives',
    readTimeMinutes: 2,
    conceptSummary: 'Why preservatives are added, when they are safe, and how to spot them on Indian snack packs.',
    fullContent: `Sodium Benzoate (INS 211) is one of the most widely used chemical preservatives in packaged acidic foods like soft drinks, pickles, and tomato sauces. 

**Why Manufacturers Use It:**
It halts the growth of mold, yeast, and bacteria in moist foods. In high-temperature storage across Indian retail shops, INS 211 prevents product spoilage without expensive refrigerated supply chains.

**Health Impact:**
FSSAI restricts INS 211 to strict low ppm thresholds. However, when combined with Vitamin C (Ascorbic Acid) in beverages, trace benzene can form under high heat. If you suffer from asthma or hives, high sulfite/benzoate intake can occasionally trigger mild histamine reactions.`,
    keyTakeaway: 'INS 211 extends shelf life against tropical mold. Look out for its combination with Vitamin C in fruit drinks.',
    isCompleted: true,
    relatedIngredientCodes: ['INS 211', 'INS 330'],
  },
  {
    id: 'lesson_2',
    title: 'The Sodium Trap in "Healthy" Indian Snacks',
    category: 'Sugar & Sodium',
    readTimeMinutes: 3,
    conceptSummary: 'How roasted makhana, bhujia, and diet chana sneak in 60%+ of your daily salt allotment.',
    fullContent: `Many Indian packaged snacks are labeled "Diet", "Baked Not Fried", or "Zero Trans Fat". While they cut down on fat, manufacturers often double the sodium content to preserve flavor intensity.

**The Math:**
The ICMR recommended daily sodium limit is 2,000 mg (about 1 teaspoon of table salt). A single 80g pack of roasted seasoned makhana or spiced peanuts can contain up to 900 mg of sodium—nearly 45% of your total daily allowance in five minutes of snacking!

**What to Look For:**
Check the nutrition panel per 100g. If sodium exceeds 400 mg per 100g, it qualifies as a High-Sodium product according to Indian FSSAI front-of-pack guidelines.`,
    keyTakeaway: 'Always check sodium per serving, not just calories or fat claims.',
    isCompleted: false,
    relatedIngredientCodes: ['INS 508', 'INS 621'],
  },
  {
    id: 'lesson_3',
    title: 'Why Palm Oil is in 70% of Store Snacks',
    category: 'Manufacturing secrets',
    readTimeMinutes: 2,
    conceptSummary: 'Understanding the economic and culinary reasons behind palm oil usage in Indian biscuits and chips.',
    fullContent: `Flip over almost any Indian biscuit or instant noodle pack and you will see "Palm Oil" or "Palmolein".

**The Manufacturing Rationale:**
1. **Cost:** Palm oil is significantly cheaper per metric ton than sunflower, mustard, or olive oil.
2. **Shelf Stability:** Highly saturated fats resist oxidative rancidity, allowing snacks to sit on unconditioned kirana store shelves for 9–12 months without spoiling.
3. **Texture:** Gives biscuits crispness ("snap") and pre-fried noodles rapid cooking capability.

**Health Perspective:**
Palm oil is ~50% saturated fat. Consuming ultra-processed palm oil daily can raise LDL (bad) cholesterol levels over time.`,
    keyTakeaway: 'Palm oil is chosen for shelf stability and low cost, not nutrition. Choose snacks fried in cold-pressed oils when possible.',
    isCompleted: false,
  },
];
