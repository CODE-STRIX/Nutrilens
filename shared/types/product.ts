export interface Additive {
  id: string; // e.g. "INS_211" or "PALM_OIL"
  insCode?: string; // e.g. "INS 211" or "E211"
  name: string;
  category: 'Preservative' | 'Flavor Enhancer' | 'Color' | 'Emulsifier' | 'Sweetener' | 'Fat/Oil' | 'Acidity Regulator' | 'Stabilizer' | 'Other';
  whatItIs: string;
  whyAdded: string; // Manufacturing rationale (cost, texture, shelf life)
  bodyEffect: string;
  frequencySafety: 'Safe' | 'Safe in moderation' | 'Limit consumption' | 'Avoid if sensitive';
  healthierAlternatives: string[];
  commonFoodsFoundIn: string[];
}

export interface IngredientItem {
  id: string;
  name: string;
  isAdditive: boolean;
  additiveId?: string;
  purpose?: string;
  healthFlag?: 'safe' | 'caution' | 'warning';
}

export interface ManufacturingRationale {
  ingredientId: string;
  ingredientName: string;
  primaryReason: 'cost' | 'texture' | 'shelf_life' | 'flavor' | 'appearance';
  explanation: string;
}

export interface InteractionNode {
  id: string;
  label: string;
  type: 'ingredient' | 'purpose' | 'food_category';
  description: string;
  connectedTo: string[]; // Node IDs
}

export interface IngredientInteractionMap {
  productId: string;
  nodes: InteractionNode[];
}

export interface Product {
  id: string;
  barcode?: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  ingredients: IngredientItem[];
  ingredientText: string;
  additives: Additive[];
  manufacturingRationale: ManufacturingRationale[];
  interactionMap?: IngredientInteractionMap;
  isCommunitySubmitted?: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  overallScore?: number; // 0-100
  createdAt: string;
}

export interface OcrParseRequest {
  extractedText: string;
  productName?: string;
  brand?: string;
}
