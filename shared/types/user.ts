// Nutri Lens - Person D User & Personalization Types
// These extend the shared product types from Person E (product.ts)

export type HealthCondition =
  | 'hypertension'
  | 'diabetes_type_2'
  | 'high_cholesterol'
  | 'kidney_disease'
  | 'acid_reflux'
  | 'cardiovascular';

export type Allergy =
  | 'peanuts'
  | 'tree_nuts'
  | 'gluten'
  | 'dairy'
  | 'soy'
  | 'eggs'
  | 'shellfish'
  | 'sulfites';

export type HealthGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'low_sodium'
  | 'low_sugar'
  | 'heart_healthy'
  | 'clean_eating';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  conditions: HealthCondition[];
  allergies: Allergy[];
  goals: HealthGoal[];
  dailyScanLimit?: number;
}

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  carbohydrates: number;
  sugars: number;
  addedSugars: number;
  protein: number;
  sodium: number; // mg
  fiber: number;
}

// Extends the shared Product from product.ts with nutrition facts for Person D
export interface ProductWithNutrition {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  overallScore: number;
  nutritionFacts: NutritionFacts;
  ingredients: PersonDIngredient[];
  processingLevel: 'unprocessed' | 'processed' | 'ultra_processed';
  isCommunitySubmitted?: boolean;
  isVerified?: boolean;
}

export interface PersonDIngredient {
  id: string;
  name: string;
  code?: string;
  category: 'additive' | 'preservative' | 'sweetener' | 'emulsifier' | 'whole_food' | 'flavor_enhancer';
  description: string;
  healthEffect: string;
  safetyLevel: 'safe' | 'caution' | 'avoid';
  manufacturingRationale?: PersonDManufacturingRationale;
  commonIn: string[];
}

export interface PersonDManufacturingRationale {
  ingredientName: string;
  code?: string;
  primaryPurpose: 'cost' | 'texture' | 'shelf_life' | 'flavour' | 'color' | 'emulsifier';
  explanation: string;
  industryContext: string;
  alternativesConsidered?: string[];
}

export interface ConditionFlag {
  condition: HealthCondition;
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  triggerIngredientOrNutrient: string;
}

export interface AllergyWarning {
  allergy: Allergy;
  ingredientName: string;
  isDirectMatch: boolean;
}

export interface PersonalizedAnalysis {
  productId: string;
  overallSuitability: 'recommended' | 'moderate' | 'avoid';
  suitabilityScore: number;
  conditionFlags: ConditionFlag[];
  allergyWarnings: AllergyWarning[];
  goalAlignment: {
    goal: HealthGoal;
    isAligned: boolean;
    reason: string;
  }[];
  manufacturingSummaries: PersonDManufacturingRationale[];
  personalizedTip: string;
}

export interface ScanHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  timestamp: string;
  score: number;
  sodiumMg: number;
  sugarsG: number;
  processingLevel: 'unprocessed' | 'processed' | 'ultra_processed';
}

export interface ProgressData {
  weeklyAverageScore: number;
  monthlyAverageScore: number;
  streakDays: number;
  totalScans: number;
  ultraProcessedPercentage: number;
  healthyChoicePercentage: number;
  scoreHistory: { date: string; score: number }[];
}

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  percentage: number;
  metric: string;
  impactLevel: 'warning' | 'positive' | 'neutral';
  actionableTip: string;
}

export interface HealthyAlternative {
  scannedProductId: string;
  alternativeProduct: ProductWithNutrition;
  keyImprovements: string[];
  sugarDifferencePercentage: number;
  sodiumDifferencePercentage: number;
  scoreImprovement: number;
  reason: string;
}

export interface ProductComparison {
  productA: ProductWithNutrition;
  productB: ProductWithNutrition;
  winnerProductId: string;
  summaryVerdict: string;
  comparisonPoints: {
    category: 'Nutrition' | 'Additives' | 'Processing' | 'Health Match';
    productAValue: string;
    productBValue: string;
    advantageProduct: 'A' | 'B' | 'tie';
  }[];
}

export interface LearningLesson {
  id: string;
  title: string;
  category: 'Additives' | 'Sugar & Sodium' | 'Reading Labels' | 'Manufacturing secrets';
  readTimeMinutes: number;
  conceptSummary: string;
  fullContent: string;
  keyTakeaway: string;
  isCompleted: boolean;
  relatedIngredientCodes?: string[];
}
