// Nutri Lens - Scanner & OCR Processing Service (Person C Scope)

import { Additive, Ingredient, Product } from '../../../shared/types';
import { MOCK_PRODUCTS } from './mockData';

// Extended mock product database for Person C including regional & recalled products
export const PERSON_C_MOCK_PRODUCTS: Record<string, Product> = {
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
        whatItIs: 'A synthetic chemical salt formed by combining benzoic acid with sodium hydroxide.',
        whyAdded: 'Halts growth of mold, yeast, and bacteria in moist environments, allowing long kirana shelf life without refrigeration.',
        bodyEffect: 'Processed in liver; safe in small quantities. May trigger mild hives or histamine response in sensitive individuals or when combined with high Vitamin C.',
        frequencySafety: 'Limit consumption — avoid daily intake in multiple products.',
        healthierAlternatives: ['Ascorbic Acid (Vitamin C)', 'Citric Acid', 'Thermal Sterilization'],
        commonFoodsFoundIn: ['Soft drinks', 'Pickles', 'Tomato ketchups', 'Fruit syrups', 'Salad dressings'],
      },
      {
        id: 'add_635',
        insCode: 'INS 635',
        name: 'Disodium 5′-Ribonucleotides',
        category: 'Flavor Enhancer',
        hazardRating: 'Caution',
        whatItIs: 'Synergistic food additive blending disodium inosinate and disodium guanylate.',
        whyAdded: 'Multiplies savory umami perception by 4x compared to MSG alone, allowing lower production cost while maintaining intense taste.',
        bodyEffect: 'Metabolizes into purines; individuals with gout or hyperuricemia should limit intake.',
        frequencySafety: 'Safe in moderation, limit for gout patients.',
        healthierAlternatives: ['Yeast Extract', 'Mushroom Powder', 'Naturally Fermented Soy Sauce'],
        commonFoodsFoundIn: ['Instant noodles', 'Flavored potato chips', 'Soup mixes', 'Processed meat products'],
      },
      {
        id: 'add_508',
        insCode: 'INS 508',
        name: 'Potassium Chloride',
        category: 'Gelling Agent / Salt Substitute',
        hazardRating: 'Safe',
        whatItIs: 'Naturally occurring mineral salt composed of potassium and chlorine.',
        whyAdded: 'Provides salty bite while reducing total sodium content and improving noodle dough elasticity.',
        bodyEffect: 'Essential electrolyte for nerve and muscle function. Beneficial for hypertension when replacing sodium.',
        frequencySafety: 'Safe for general population; individuals with advanced kidney disease should monitor potassium.',
        healthierAlternatives: ['Sea Salt', 'Himalayan Pink Salt', 'Kelp Powder'],
        commonFoodsFoundIn: ['Low-sodium salt blends', 'Sports electrolyte drinks', 'Dietary supplements', 'Instant soups'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'shelf_life', explanation: 'Palm oil and INS 211 allow 9-month shelf life without refrigerated logistics across tropical retail outlets.' },
      { primaryReason: 'cost', explanation: 'INS 635 provides intense umami taste at a fraction of natural spice or dehydrated vegetable broth cost.' },
    ],
    interactionMap: {
      productId: 'p_maggi',
      nodes: [
        { id: 'n_product', label: 'Maggi Masala Noodles', type: 'food_category', description: 'Ultra-processed instant snack', connectedTo: ['n_preservative', 'n_flavor', 'n_texture'] },
        { id: 'n_preservative', label: 'INS 211 (Sodium Benzoate)', type: 'ingredient', description: 'Antimicrobial preservative', connectedTo: ['n_purpose_shelf', 'n_food_pickles', 'n_food_soda'] },
        { id: 'n_flavor', label: 'INS 635 (Disodium 5-Ribonucleotides)', type: 'ingredient', description: 'Umami flavor booster', connectedTo: ['n_purpose_taste', 'n_food_chips'] },
        { id: 'n_texture', label: 'INS 508 (Potassium Chloride)', type: 'ingredient', description: 'Texture & electrolyte salt', connectedTo: ['n_purpose_gelling', 'n_food_sports'] },
        { id: 'n_purpose_shelf', label: 'Shelf Life Extension (9 Months)', type: 'purpose', description: 'Prevents tropical mold & microbial spoilage', connectedTo: [] },
        { id: 'n_purpose_taste', label: '4x Umami Boost', type: 'purpose', description: 'Replaces expensive spice powders', connectedTo: [] },
        { id: 'n_purpose_gelling', label: 'Dough Firming & Salt Replacement', type: 'purpose', description: 'Gives noodles signature firm chewiness', connectedTo: [] },
        { id: 'n_food_pickles', label: 'Mango & Lime Pickles', type: 'food_category', description: 'Common Indian household staple sharing INS 211', connectedTo: [] },
        { id: 'n_food_soda', label: 'Carbonated Soft Drinks', type: 'food_category', description: 'Commercial beverages sharing INS 211', connectedTo: [] },
        { id: 'n_food_chips', label: 'Masala Potato Chips', type: 'food_category', description: 'Savory fried snacks sharing INS 635', connectedTo: [] },
        { id: 'n_food_sports', label: 'Electrolyte Sports Drinks', type: 'food_category', description: 'Hydration drinks sharing INS 508', connectedTo: [] },
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
    ingredientText: 'Rolled Oats (35%), Ragi Flakes (20%), Jowar Flakes (15%), Freeze Dried Fruits (Raisins, Cranberries, Almonds 15%), Raw Honey (10%), Natural Rosemary Extract (INS 392).',
    overallScore: 88,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-02-01T10:00:00Z',
    ingredients: [
      { id: 'ing_10', name: 'Rolled Oats', isAdditive: false, purpose: 'Complex Carbohydrates & Beta-Glucan Fiber', healthFlag: 'safe' },
      { id: 'ing_11', name: 'Ragi & Jowar Flakes', isAdditive: false, purpose: 'Ancient Indian Millets & Calcium', healthFlag: 'safe' },
      { id: 'ing_12', name: 'Freeze Dried Fruits & Almonds', isAdditive: false, purpose: 'Natural Sweetness & Antioxidants', healthFlag: 'safe' },
      { id: 'ing_13', name: 'Rosemary Extract (INS 392)', isAdditive: true, insCode: 'INS 392', additiveId: 'add_392', purpose: 'Natural Botanical Antioxidant', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_392',
        insCode: 'INS 392',
        name: 'Rosemary Extract',
        category: 'Natural Antioxidant',
        hazardRating: 'Safe',
        whatItIs: 'Natural antioxidant extracted from Rosmarinus officinalis leaves.',
        whyAdded: 'Prevents natural nut oils from oxidizing and going rancid without synthetic BHA/BHT.',
        bodyEffect: 'Rich in carnosic acid; neutralizes free radicals in the gut.',
        frequencySafety: 'Safe for daily consumption.',
        healthierAlternatives: ['Tocopherols (Vitamin E)', 'Ascorbic Acid'],
        commonFoodsFoundIn: ['Organic nut mixes', 'Cold-pressed oils', 'High-end granolas'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'shelf_life', explanation: 'Rosemary extract replaces synthetic BHT to preserve nut freshness naturally.' },
    ],
    interactionMap: {
      productId: 'p_muesli',
      nodes: [
        { id: 'n_product', label: 'Millet & Fruit Muesli', type: 'food_category', description: 'Whole grain breakfast cereal', connectedTo: ['n_rosemary'] },
        { id: 'n_rosemary', label: 'INS 392 (Rosemary Extract)', type: 'ingredient', description: 'Botanical antioxidant', connectedTo: ['n_purpose_ox', 'n_food_nuts'] },
        { id: 'n_purpose_ox', label: 'Nut Oil Protection', type: 'purpose', description: 'Prevents lipid oxidation naturally', connectedTo: [] },
        { id: 'n_food_nuts', label: 'Organic Roasted Almonds', type: 'food_category', description: 'Natural healthy snack sharing INS 392', connectedTo: [] },
      ],
    },
  },
  p_bhujia: {
    id: 'p_bhujia',
    barcode: '8904000112233',
    name: 'Bikaneri Bhujia Sev',
    brand: 'Haldiram',
    category: 'Traditional Indian Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    ingredientText: 'Moth Pulse Flour (Besan), Palmolein Oil, Bengal Gram Flour, Iodized Salt, Red Chilli Powder, Black Pepper, Ginger, Cardamom, Clove, Acidity Regulator (INS 330).',
    overallScore: 42,
    isRegionalUnbranded: false,
    isCommunitySubmitted: false,
    verificationStatus: 'verified',
    createdAt: '2026-02-10T10:00:00Z',
    ingredients: [
      { id: 'ing_20', name: 'Moth Pulse Flour (Dew Bean Flour)', isAdditive: false, purpose: 'Traditional Crunchy Base', healthFlag: 'safe' },
      { id: 'ing_21', name: 'Palmolein Oil', isAdditive: false, purpose: 'Deep Frying Media', healthFlag: 'warning' },
      { id: 'ing_22', name: 'Iodized Salt', isAdditive: false, purpose: 'Flavoring & Seasoning', healthFlag: 'warning' },
      { id: 'ing_23', name: 'Citric Acid (INS 330)', isAdditive: true, insCode: 'INS 330', additiveId: 'add_330', purpose: 'Tartness & Acidity Regulation', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_330',
        insCode: 'INS 330',
        name: 'Citric Acid',
        category: 'Acidity Regulator',
        hazardRating: 'Safe',
        whatItIs: 'Weak organic acid naturally present in citrus fruits, produced via carbohydrate fermentation.',
        whyAdded: 'Provides pleasant tangy bite and maintains optimal pH for oil stability.',
        bodyEffect: 'Normal intermediate in Krebs cycle; easily metabolized into energy.',
        frequencySafety: 'Safe for daily consumption.',
        healthierAlternatives: ['Lemon Juice Powder', 'Raw Mango Powder (Amchur)'],
        commonFoodsFoundIn: ['Fruit juices', 'Jams', 'Carbonated beverages', 'Namkeen snacks'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'cost', explanation: 'Palmolein oil gives high smoke point for deep frying Bhujia at commercial speed.' },
    ],
    interactionMap: {
      productId: 'p_bhujia',
      nodes: [
        { id: 'n_product', label: 'Bikaneri Bhujia', type: 'food_category', description: 'Traditional deep-fried snack', connectedTo: ['n_citric'] },
        { id: 'n_citric', label: 'INS 330 (Citric Acid)', type: 'ingredient', description: 'Natural acidulant', connectedTo: ['n_purpose_tang', 'n_food_jam'] },
        { id: 'n_purpose_tang', label: 'Tangy Flavor & Oil pH Control', type: 'purpose', description: 'Enhances spice notes', connectedTo: [] },
        { id: 'n_food_jam', label: 'Mixed Fruit Jam', type: 'food_category', description: 'Sweet spread sharing INS 330', connectedTo: [] },
      ],
    },
  },
  p_ratlami: {
    id: 'p_ratlami',
    barcode: '8908000554433',
    name: 'Ratlami Sev (Regional Speciality)',
    brand: 'Shree Malwa Namkeen',
    category: 'Regional Unbranded Snack',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    ingredientText: 'Gram Flour (Besan), Groundnut Oil, Clove (Laung), Black Pepper, Asafoetida (Hing), Salt, Tartaric Acid (INS 334).',
    overallScore: 68,
    isRegionalUnbranded: true,
    isCommunitySubmitted: true,
    verificationStatus: 'verified',
    createdAt: '2026-03-01T12:00:00Z',
    ingredients: [
      { id: 'ing_30', name: 'Gram Flour (Besan)', isAdditive: false, purpose: 'Protein Rich Base', healthFlag: 'safe' },
      { id: 'ing_31', name: 'Cold Pressed Groundnut Oil', isAdditive: false, purpose: 'Traditional Frying Oil', healthFlag: 'caution' },
      { id: 'ing_32', name: 'Spices (Laung, Hing, Kali Mirch)', isAdditive: false, purpose: 'Digestive & Aromatic Seasoning', healthFlag: 'safe' },
      { id: 'ing_33', name: 'Tartaric Acid (INS 334)', isAdditive: true, insCode: 'INS 334', additiveId: 'add_334', purpose: 'Acidulant', healthFlag: 'safe' },
    ],
    additives: [
      {
        id: 'add_334',
        insCode: 'INS 334',
        name: 'Tartaric Acid',
        category: 'Acidity Regulator',
        hazardRating: 'Safe',
        whatItIs: 'Naturally occurring organic acid found in tamarind and grapes.',
        whyAdded: 'Gives sharp sour tang characteristic of authentic Ratlami clove sev.',
        bodyEffect: 'Excreted naturally through urine; safe acidulant.',
        frequencySafety: 'Safe in normal dietary amounts.',
        healthierAlternatives: ['Tamarind Concentrate', 'Dry Mango Powder'],
        commonFoodsFoundIn: ['Tamarind chutneys', 'Confectionery', 'Wine making', 'Baking powder'],
      },
    ],
    manufacturingRationale: [
      { primaryReason: 'texture', explanation: 'Groundnut oil and laung infusion provide authentic regional texture and digestive aroma.' },
    ],
    interactionMap: {
      productId: 'p_ratlami',
      nodes: [
        { id: 'n_product', label: 'Ratlami Sev', type: 'food_category', description: 'Clove-infused regional namkeen', connectedTo: ['n_tartaric'] },
        { id: 'n_tartaric', label: 'INS 334 (Tartaric Acid)', type: 'ingredient', description: 'Tamarind-like acidulant', connectedTo: ['n_purpose_tang2', 'n_food_chutney'] },
        { id: 'n_purpose_tang2', label: 'Sharp Clove-Sour Accent', type: 'purpose', description: 'Accentuates clove oil heat', connectedTo: [] },
        { id: 'n_food_chutney', label: 'Sweet Tamarind Chutney', type: 'food_category', description: 'Traditional condiment sharing INS 334', connectedTo: [] },
      ],
    },
  },
};

export class ScannerService {
  /**
   * Scan barcode and retrieve product metadata.
   */
  public static scanBarcode(barcode: string): Product | null {
    const cleanBarcode = barcode.trim();
    for (const product of Object.values(PERSON_C_MOCK_PRODUCTS)) {
      if (product.barcode === cleanBarcode) {
        return product;
      }
    }
    return null;
  }

  /**
   * Simulate ML Kit On-Device OCR processing of printed ingredient label text.
   * Parses raw extracted OCR text into recognized additives and structured ingredients.
   */
  public static processOcrText(extractedText: string): {
    matchedProduct?: Product;
    extractedIngredients: string[];
    detectedINS: string[];
    isUnlistedRegional: boolean;
  } {
    const textLower = extractedText.toLowerCase();
    const detectedINS: string[] = [];
    
    // Regex matching INS / E codes
    const insRegex = /(?:ins|e)\s*([0-9]{3,4}[a-z]?)/gi;
    let match: RegExpExecArray | null;
    while ((match = insRegex.exec(extractedText)) !== null) {
      detectedINS.push(`INS ${match[1].toUpperCase()}`);
    }

    // Try matching existing mock product by name or barcode
    for (const product of Object.values(PERSON_C_MOCK_PRODUCTS)) {
      if (
        product.name.toLowerCase().split(' ').some((word) => word.length > 4 && textLower.includes(word)) ||
        (product.ingredientText && textLower.includes(product.ingredientText.substring(0, 30).toLowerCase()))
      ) {
        return {
          matchedProduct: product,
          extractedIngredients: product.ingredients.map((i) => i.name),
          detectedINS,
          isUnlistedRegional: false,
        };
      }
    }

    // Split raw OCR text by commas/semicolons
    const extractedIngredients = extractedText
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 2);

    return {
      extractedIngredients,
      detectedINS,
      isUnlistedRegional: true,
    };
  }

  /**
   * Search product catalog by query term or brand
   */
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

  /**
   * Get all available products in dataset
   */
  public static getAllProducts(): Product[] {
    return Object.values(PERSON_C_MOCK_PRODUCTS);
  }
}
