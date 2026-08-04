export interface Additive {
  id?: string;
  code?: string;
  insCode?: string;
  name: string;
  category: string;
  hazardRating?: 'Safe' | 'Caution' | 'High Risk';
  description?: string;
  whatItIs?: string;
  manufacturingRationale?: string;
  whyAdded?: string;
  biologicalImpact?: string;
  bodyEffect?: string;
  safeFrequency?: string;
  frequencySafety?: string;
  healthierAlternatives: string[];
  commonFoods?: string[];
  commonFoodsFoundIn?: string[];
}

export interface Ingredient {
  id?: string;
  name: string;
  insCode?: string;
  isAdditive: boolean;
  additiveId?: string;
  purpose?: string;
  allergenType?: string;
  additiveDetails?: Additive;
  healthFlag?: 'safe' | 'caution' | 'warning';
}

export type IngredientItem = Ingredient;

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFatGrams: number;
  saturatedFatGrams: number;
  transFatGrams: number;
  sodiumMg: number;
  totalCarbsGrams: number;
  sugarGrams: number;
  addedSugarGrams: number;
  fiberGrams: number;
  proteinGrams: number;
}

export interface ManufacturingRationale {
  costEfficiency?: string;
  shelfLifeImpact?: string;
  textureAndMouthfeel?: string;
  ingredientId?: string;
  ingredientName?: string;
  primaryReason?: 'cost' | 'texture' | 'shelf_life' | 'flavor' | 'appearance';
  explanation?: string;
}

export interface InteractionNode {
  id: string;
  label: string;
  type: 'ingredient' | 'purpose' | 'food_category';
  description: string;
  connectedTo: string[];
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
  isRegionalUnbranded?: boolean;
  nutrition?: NutritionFacts;
  ingredients: Ingredient[];
  ingredientText?: string;
  additives?: Additive[];
  manufacturingTransparency?: ManufacturingRationale;
  manufacturingRationale?: ManufacturingRationale[];
  overallBaseScore?: number;
  overallScore?: number;
  interactionMap?: IngredientInteractionMap;
  isCommunitySubmitted?: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  createdAt?: string;
}

export interface OcrParseRequest {
  extractedText: string;
  productName?: string;
  brand?: string;
}
