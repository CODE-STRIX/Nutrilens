export type HealthCondition = 
  | 'Hypertension'
  | 'Type2Diabetes'
  | 'HighCholesterol'
  | 'GERD'
  | 'KidneyDisease'
  | 'Celiac'
  | 'hypertension'
  | 'diabetes_type_2'
  | 'high_cholesterol'
  | 'kidney_disease'
  | 'acid_reflux'
  | 'cardiovascular';

export type Allergy = 
  | 'Peanuts'
  | 'Gluten'
  | 'Dairy'
  | 'Soy'
  | 'TreeNuts'
  | 'Sulfites'
  | 'peanuts'
  | 'tree_nuts'
  | 'gluten'
  | 'dairy'
  | 'soy'
  | 'eggs'
  | 'shellfish'
  | 'sulfites';

export type DietaryGoal = 
  | 'WeightLoss'
  | 'LowSodium'
  | 'LowSugar'
  | 'HighProtein'
  | 'HeartHealth'
  | 'GutHealth'
  | 'weight_loss'
  | 'muscle_gain'
  | 'low_sodium'
  | 'low_sugar'
  | 'heart_healthy'
  | 'clean_eating';

export type HealthGoal = DietaryGoal;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  healthConditions: HealthCondition[];
  conditions?: HealthCondition[];
  allergies: Allergy[];
  goals: DietaryGoal[];
  createdAt?: string;
  updatedAt?: string;
  dailyScanLimit?: number;
}

export interface UserRegistrationDto {
  email: string;
  password: string;
  name: string;
  age?: number;
  healthConditions?: HealthCondition[];
  allergies?: Allergy[];
  goals?: DietaryGoal[];
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

// Person D Mobile & Analysis Extension Types
export interface MobileNutritionFacts {
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

export interface ProductWithNutrition {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  overallScore: number;
  nutritionFacts: MobileNutritionFacts;
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

export interface MobileConditionFlag {
  condition: HealthCondition;
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  triggerIngredientOrNutrient: string;
}

export interface MobileAllergyWarning {
  allergy: Allergy;
  ingredientName: string;
  isDirectMatch: boolean;
}

export interface PersonalizedAnalysis {
  productId: string;
  overallSuitability: 'recommended' | 'moderate' | 'avoid';
  suitabilityScore: number;
  conditionFlags: MobileConditionFlag[];
  allergyWarnings: MobileAllergyWarning[];
  goalAlignment: {
    goal: DietaryGoal;
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

export interface MobilePatternInsight {
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

export interface MobileLearningLesson {
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
