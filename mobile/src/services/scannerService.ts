// Nutri Lens - Scanner & OCR Processing Service (Person C Scope)

import { Additive, Ingredient, Product } from '../../../shared/types';
import { MOCK_PRODUCTS } from './mockData';

// Extended mock product database for Person C including Lay's & regional products
export const PERSON_C_MOCK_PRODUCTS: Record<string, Product> = {
  p_lays_masala: {
    id: 'p_lays_masala',
    barcode: '8901491101837',
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: 'Potato Chips & Crisps',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    ingredientText: 'Potato, Edible Vegetable Oil (Palmolein Oil, Sunflower Oil), Seasoning (Spices & Condiments, Sugar, Salt, Black Salt, Mango Powder, Flavor Enhancers (INS 621, INS 635), Acidity Regulators (INS 330, INS 296), Anticaking Agent (INS 551)).',
    overallScore: 32,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-01-10T10:00:00Z',
    ingredients: [
      { id: 'ing_l1', name: 'Fresh Potatoes', isAdditive: false, purpose: 'Sliced Potato Base & Carbohydrate', healthFlag: 'safe' },
      { id: 'ing_l2', name: 'Palmolein & Sunflower Oil', isAdditive: false, purpose: 'Deep Frying Media', healthFlag: 'warning' },
      { id: 'ing_l3', name: 'Monosodium Glutamate (INS 621 / MSG)', isAdditive: true, insCode: 'INS 621', additiveId: 'add_621', purpose: 'Savory Umami Flavor Enhancer', healthFlag: 'warning' },
      { id: 'ing_l4', name: 'Disodium 5′-Ribonucleotides (INS 635)', isAdditive: true, insCode: 'INS 635', additiveId: 'add_635', purpose: 'Synergistic Umami Booster', healthFlag: 'caution' },
      { id: 'ing_l5', name: 'Silicon Dioxide (INS 551)', isAdditive: true, insCode: 'INS 551', additiveId: 'add_551', purpose: 'Anticaking & Seasoning Free-Flow', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_621',
        insCode: 'INS 621',
        name: 'Monosodium Glutamate (MSG)',
        category: 'Flavor Enhancer',
        hazardRating: 'Caution',
        whatItIs: 'Sodium salt of glutamic acid, an amino acid naturally present in tomatoes and cheese.',
        whyAdded: 'Triggers taste receptors on tongue to create intense savory umami snack profile.',
        bodyEffect: 'Safe for general public; sensitive individuals may experience mild temporary flushing or headache if consumed in large quantities.',
        frequencySafety: 'Enjoy in moderation; avoid excessive daily intake.',
        healthierAlternatives: ['Nutritional Yeast', 'Mushroom Extract Powder', 'Tomato Powder'],
        commonFoodsFoundIn: ['Flavored potato chips', 'Instant ramen noodles', 'Processed meats', 'Canned soups'],
      },
      {
        id: 'add_635',
        insCode: 'INS 635',
        name: 'Disodium 5′-Ribonucleotides',
        category: 'Flavor Enhancer',
        hazardRating: 'Caution',
        whatItIs: 'Synergistic blend of disodium inosinate and disodium guanylate.',
        whyAdded: 'Multiplies savory umami perception by 4x when combined with MSG (INS 621).',
        bodyEffect: 'Metabolizes into purines; individuals with gout or hyperuricemia should limit intake.',
        frequencySafety: 'Safe in moderation.',
        healthierAlternatives: ['Yeast Extract', 'Natural Spices'],
        commonFoodsFoundIn: ['Potato chips', 'Savory snack mixes', 'Noodle seasonings'],
      },
      {
        id: 'add_551',
        insCode: 'INS 551',
        name: 'Silicon Dioxide',
        category: 'Anticaking Agent',
        hazardRating: 'Safe',
        whatItIs: 'Amorphous silica compound naturally abundant in quartz and plant cell walls.',
        whyAdded: 'Prevents masala seasoning powder from clumping together during high-speed factory packaging.',
        bodyEffect: 'Inert; passes through digestive tract without systemic absorption.',
        frequencySafety: 'Safe for daily consumption.',
        healthierAlternatives: ['Rice Starch', 'Tapioca Flour'],
        commonFoodsFoundIn: ['Spice mixes', 'Powdered drinks', 'Salt seasonings'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'cost', explanation: 'Palmolein oil gives high smoke point for continuous deep frying at commercial speed.' },
      { primaryReason: 'flavor', explanation: 'INS 621 + INS 635 blend creates signature craveable India Magic Masala flavor.' },
    ],
    interactionMap: {
      productId: 'p_lays_masala',
      nodes: [
        { id: 'n_product', label: "Lay's Magic Masala", type: 'food_category', description: 'Ultra-processed savory potato crisps', connectedTo: ['n_msg', 'n_ribo', 'n_silicon'] },
        { id: 'n_msg', label: 'INS 621 (MSG)', type: 'ingredient', description: 'Umami flavor booster', connectedTo: ['n_purpose_umami'] },
        { id: 'n_ribo', label: 'INS 635 (Disodium Ribonucleotides)', type: 'ingredient', description: 'Synergistic flavor multiplier', connectedTo: ['n_purpose_umami'] },
        { id: 'n_silicon', label: 'INS 551 (Silicon Dioxide)', type: 'ingredient', description: 'Anticaking agent', connectedTo: ['n_purpose_flow'] },
        { id: 'n_purpose_umami', label: '4x Umami Flavor Intensity', type: 'purpose', description: 'Creates intense snack craving', connectedTo: [] },
        { id: 'n_purpose_flow', label: 'Free-Flowing Masala Seasoning', type: 'purpose', description: 'Prevents spice clumping', connectedTo: [] },
      ],
    },
  },
  p_maggi: {
    id: 'p_maggi',
    barcode: '8901058000053',
    name: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé',
    category: 'Instant Noodles',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400',
    ingredientText: 'Refined Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Potassium Chloride, Gelling Agent (INS 508), Thickener (INS 412), Acidity Regulator (INS 501i, INS 500i), Humectant (INS 451i). Masala Flavor Maker: Dehydrated Vegetables (Onion, Garlic), Hydrolyzed Groundnut Protein, Mixed Spices, Sugar, Edible Starch, Flavor Enhancer (INS 635), Preservative (INS 211).',
    overallScore: 35,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-01-15T10:00:00Z',
    ingredients: [
      { id: 'ing_1', name: 'Refined Wheat Flour (Maida)', isAdditive: false, purpose: 'Base Structure & Carbohydrate', healthFlag: 'caution' },
      { id: 'ing_2', name: 'Palm Oil', isAdditive: false, purpose: 'Deep Frying & Shelf Stability', healthFlag: 'warning' },
      { id: 'ing_3', name: 'Salt (Sodium Chloride)', isAdditive: false, purpose: 'Flavor & Preservation', healthFlag: 'warning' },
      { id: 'ing_4', name: 'Gelling Agent (INS 508 / Potassium Chloride)', isAdditive: true, insCode: 'INS 508', additiveId: 'add_508', purpose: 'Noodle Texture & Gelling', healthFlag: 'safe' },
      { id: 'ing_5', name: 'Flavor Enhancer (INS 635 / Disodium 5-Ribonucleotides)', isAdditive: true, insCode: 'INS 635', additiveId: 'add_635', purpose: 'Savory Umami Enhancement', healthFlag: 'caution' },
      { id: 'ing_6', name: 'Preservative (INS 211 / Sodium Benzoate)', isAdditive: true, insCode: 'INS 211', additiveId: 'add_211', purpose: 'Prevents Microbial Spoilage', healthFlag: 'warning' },
    ],
    additives: [
      {
        id: 'add_211',
        insCode: 'INS 211',
        name: 'Sodium Benzoate',
        category: 'Preservative',
        hazardRating: 'Caution',
        whatItIs: 'Synthetic chemical salt preventing microbial spoilage.',
        whyAdded: 'Halts growth of mold and yeast.',
        bodyEffect: 'Safe in small quantities.',
        frequencySafety: 'Limit daily intake.',
        healthierAlternatives: ['Ascorbic Acid'],
        commonFoodsFoundIn: ['Soft drinks', 'Pickles'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'shelf_life', explanation: 'Palm oil and INS 211 allow 9-month shelf life.' },
    ],
    interactionMap: {
      productId: 'p_maggi',
      nodes: [
        { id: 'n_product', label: 'Maggi Masala Noodles', type: 'food_category', description: 'Instant snack', connectedTo: [] },
      ],
    },
  },
  p_muesli: {
    id: 'p_muesli',
    barcode: '8906070001122',
    name: 'Whole Grain Millet & Fruit Muesli',
    brand: 'True Elements',
    category: 'Breakfast Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400',
    ingredientText: 'Rolled Oats (35%), Ragi Flakes (20%), Jowar Flakes (15%), Freeze Dried Fruits, Raw Honey, Rosemary Extract (INS 392).',
    overallScore: 88,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-02-01T10:00:00Z',
    ingredients: [
      { id: 'ing_10', name: 'Rolled Oats', isAdditive: false, purpose: 'Complex Fiber', healthFlag: 'safe' },
      { id: 'ing_13', name: 'Rosemary Extract (INS 392)', isAdditive: true, insCode: 'INS 392', additiveId: 'add_392', purpose: 'Antioxidant', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_392',
        insCode: 'INS 392',
        name: 'Rosemary Extract',
        category: 'Antioxidant',
        hazardRating: 'Safe',
        whatItIs: 'Natural botanical antioxidant.',
        whyAdded: 'Prevents nut oils from going rancid.',
        bodyEffect: 'Neutralizes free radicals.',
        frequencySafety: 'Safe for daily use.',
        healthierAlternatives: ['Vitamin E'],
        commonFoodsFoundIn: ['Nut mixes'],
      },
    ],
    manufacturingRationale: [],
    interactionMap: { productId: 'p_muesli', nodes: [] },
  },
  p_bhujia: {
    id: 'p_bhujia',
    barcode: '8904000112233',
    name: 'Bikaneri Bhujia Sev',
    brand: 'Haldiram',
    category: 'Traditional Indian Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    ingredientText: 'Besan, Palmolein Oil, Iodized Salt, Spices, Citric Acid (INS 330).',
    overallScore: 42,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-02-10T10:00:00Z',
    ingredients: [
      { id: 'ing_20', name: 'Gram Flour', isAdditive: false, purpose: 'Crunchy Base', healthFlag: 'safe' },
      { id: 'ing_23', name: 'Citric Acid (INS 330)', isAdditive: true, insCode: 'INS 330', additiveId: 'add_330', purpose: 'Tartness', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_330',
        insCode: 'INS 330',
        name: 'Citric Acid',
        category: 'Acidity Regulator',
        hazardRating: 'Safe',
        whatItIs: 'Natural acidulant.',
        whyAdded: 'Tangy bite.',
        bodyEffect: 'Easily metabolized.',
        frequencySafety: 'Safe daily.',
        healthierAlternatives: ['Lemon juice'],
        commonFoodsFoundIn: ['Snacks'],
      },
    ],
    manufacturingRationale: [],
    interactionMap: { productId: 'p_bhujia', nodes: [] },
  },
};

export class ScannerService {
  /**
   * Scan barcode or barcode number string (e.g. Lay's 8901491101837)
   */
  public static scanBarcode(barcode: string): Product | null {
    const cleanBarcode = barcode.trim().toLowerCase();
    
    // Check exact barcode
    for (const product of Object.values(PERSON_C_MOCK_PRODUCTS)) {
      if (product.barcode === cleanBarcode) {
        return product;
      }
    }

    // Check fuzzy match on barcode or name ("lays", "890", etc.)
    for (const product of Object.values(PERSON_C_MOCK_PRODUCTS)) {
      if (
        (cleanBarcode.length >= 3 && product.barcode.includes(cleanBarcode)) ||
        product.name.toLowerCase().includes(cleanBarcode) ||
        product.brand.toLowerCase().includes(cleanBarcode)
      ) {
        return product;
      }
    }

    // Fallback: Default to Lay's Magic Masala if any code scanned
    return PERSON_C_MOCK_PRODUCTS.p_lays_masala;
  }

  /**
   * Process photo or OCR text and return matched product
   */
  public static processOcrText(extractedText: string): {
    matchedProduct?: Product;
    extractedIngredients: string[];
    detectedINS: string[];
    isUnlistedRegional: boolean;
  } {
    const textLower = extractedText.toLowerCase();
    const detectedINS: string[] = ['INS 621', 'INS 635', 'INS 551'];
    
    // Check if Lay's or any product matches text
    for (const product of Object.values(PERSON_C_MOCK_PRODUCTS)) {
      if (
        textLower.includes('lay') ||
        textLower.includes('potato') ||
        textLower.includes('chip') ||
        textLower.includes('flour') ||
        textLower.includes('oil') ||
        product.name.toLowerCase().split(' ').some((word) => word.length > 4 && textLower.includes(word))
      ) {
        return {
          matchedProduct: product,
          extractedIngredients: product.ingredients.map((i) => i.name),
          detectedINS,
          isUnlistedRegional: false,
        };
      }
    }

    // Default to Lay's Magic Masala so user always gets redirect to Intel screen!
    const defaultProduct = PERSON_C_MOCK_PRODUCTS.p_lays_masala;
    return {
      matchedProduct: defaultProduct,
      extractedIngredients: defaultProduct.ingredients.map((i) => i.name),
      detectedINS,
      isUnlistedRegional: false,
    };
  }

  public static searchProducts(query: string): Product[] {
    const q = query.toLowerCase().trim();
    if (!q) return Object.values(PERSON_C_MOCK_PRODUCTS);
    return Object.values(PERSON_C_MOCK_PRODUCTS).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q))
    );
  }

  public static getAllProducts(): Product[] {
    return Object.values(PERSON_C_MOCK_PRODUCTS);
  }
}
