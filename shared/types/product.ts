export interface Additive {
  code: string;
  name: string;
  category: 'Preservative' | 'Flavor Enhancer' | 'Colorant' | 'Emulsifier' | 'Anti-caking' | 'Sweetener' | 'Stabilizer';
  hazardRating: 'Safe' | 'Caution' | 'High Risk';
  description: string;
  manufacturingRationale: string;
  biologicalImpact: string;
  safeFrequency: string;
  healthierAlternatives: string[];
  commonFoods: string[];
}

export interface Ingredient {
  name: string;
  insCode?: string;
  isAdditive: boolean;
  purpose?: string;
  allergenType?: string;
  additiveDetails?: Additive;
}

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
  costEfficiency: string;
  shelfLifeImpact: string;
  textureAndMouthfeel: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  isRegionalUnbranded: boolean;
  nutrition: NutritionFacts;
  ingredients: Ingredient[];
  manufacturingTransparency: ManufacturingRationale;
  overallBaseScore: number; // 0 - 100 unpersonalized score
}
