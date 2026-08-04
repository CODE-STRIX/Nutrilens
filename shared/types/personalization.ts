import { Allergy, HealthCondition, DietaryGoal } from './user';
import { Product } from './product';

export interface ConditionFlag {
  condition: HealthCondition;
  severity: 'WARNING' | 'CAUTION' | 'NEUTRAL' | 'FAVORABLE';
  title: string;
  reasoning: string;
  nutrientInvolved?: string;
  valueRecorded?: string;
}

export interface AllergenAlert {
  allergy: Allergy;
  foundInIngredient: string;
  isDirect: boolean; // true if ingredient matches, false if trace
  warningMessage: string;
}

export interface GoalCompliance {
  goal: DietaryGoal;
  status: 'ALIGNED' | 'CONFLICT' | 'NEUTRAL';
  explanation: string;
}

export interface PersonalizedAnalysisResult {
  productId: string;
  productName: string;
  brand: string;
  baseScore: number; // raw 0-100 score
  personalizedScore: number; // 0-100 score adjusted to user conditions
  safetyTier: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL_RISK';
  summaryHeadline: string;
  plainLanguageVerdict: string;
  conditionFlags: ConditionFlag[];
  allergenAlerts: AllergenAlert[];
  goalCompliance: GoalCompliance[];
  keyRiskIngredients: string[];
}

export interface AlternativeRecommendation {
  originalProductId: string;
  originalProductName: string;
  recommendedProduct: Product;
  personalizedScore: number;
  keyImprovements: string[]; // e.g. ["75% less sodium", "No added sugar", "Gluten-free"]
  verdict: string;
}

export interface ComparisonMetric {
  metricName: string;
  productAValue: string | number;
  productBValue: string | number;
  betterProduct: 'A' | 'B' | 'EQUAL';
  explanation: string;
}

export interface ComparisonResult {
  productA: Product;
  productB: Product;
  productAPersonalizedScore: number;
  productBPersonalizedScore: number;
  winningProduct: 'A' | 'B' | 'TIE';
  winnerBadge: string;
  plainLanguageVerdict: string;
  comparisonMetrics: ComparisonMetric[];
}
