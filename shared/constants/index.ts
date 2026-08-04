// Nutri Lens - Shared Constants

import { Allergy, HealthCondition, HealthGoal } from '../types';

export const HEALTH_CONDITIONS_META: Record<
  HealthCondition,
  { label: string; description: string; icon: string; highRiskThresholds: { sodiumMg?: number; sugarG?: number; saturatedFatG?: number } }
> = {
  hypertension: {
    label: 'Hypertension (High BP)',
    description: 'Sensitivity to sodium & preservatives that elevate blood pressure.',
    icon: 'heart-pulse',
    highRiskThresholds: { sodiumMg: 400 },
  },
  diabetes_type_2: {
    label: 'Diabetes Type 2',
    description: 'Requires monitoring of added sugars, refined carbs & glycemic load.',
    icon: 'activity',
    highRiskThresholds: { sugarG: 10 },
  },
  high_cholesterol: {
    label: 'High Cholesterol',
    description: 'Focus on lowering saturated fats, trans fats & palm oil additives.',
    icon: 'shield-alert',
    highRiskThresholds: { saturatedFatG: 4 },
  },
  kidney_disease: {
    label: 'Kidney Health Support',
    description: 'Requires strict limitation of sodium, artificial phosphates & preservatives.',
    icon: 'filter',
    highRiskThresholds: { sodiumMg: 300 },
  },
  acid_reflux: {
    label: 'Acid Reflux / GERD',
    description: 'Triggers include excessive citric acid, artificial flavors & spicy preservatives.',
    icon: 'flame',
    highRiskThresholds: {},
  },
  cardiovascular: {
    label: 'Cardiovascular Health',
    description: 'Avoid high sodium, trans fats, and hydrogenated oils.',
    icon: 'heart',
    highRiskThresholds: { sodiumMg: 350, saturatedFatG: 3 },
  },
};

export const ALLERGIES_META: Record<Allergy, { label: string; keywords: string[] }> = {
  peanuts: { label: 'Peanuts', keywords: ['peanut', 'groundnut', 'arachis'] },
  tree_nuts: { label: 'Tree Nuts', keywords: ['almond', 'cashew', 'walnut', 'pistachio', 'hazelnut'] },
  gluten: { label: 'Gluten / Wheat', keywords: ['wheat', 'maida', 'barley', 'rye', 'gluten', 'semolina', 'atta'] },
  dairy: { label: 'Dairy / Milk', keywords: ['milk', 'whey', 'casein', 'lactose', 'butter', 'milk solids', 'cream'] },
  soy: { label: 'Soy', keywords: ['soy', 'soya', 'lecithin', 'soybean'] },
  eggs: { label: 'Eggs', keywords: ['egg', 'albumin', 'ovalbumin', 'egg powder'] },
  shellfish: { label: 'Shellfish', keywords: ['shrimp', 'prawn', 'crab', 'lobster'] },
  sulfites: { label: 'Sulfites (INS 220-228)', keywords: ['sulfite', 'sulphite', 'INS 220', 'INS 221', 'INS 223', 'metabisulfite'] },
};

export const HEALTH_GOALS_META: Record<HealthGoal, { label: string; tag: string; description: string }> = {
  weight_loss: {
    label: 'Weight Loss',
    tag: 'Calorie & Sugar Aware',
    description: 'Favors low added sugar and fiber-dense foods.',
  },
  muscle_gain: {
    label: 'Muscle Gain',
    tag: 'Protein Focused',
    description: 'Highlights protein content and muscle building nutrition.',
  },
  low_sodium: {
    label: 'Low Sodium Intake',
    tag: 'Sodium Shield',
    description: 'Filters out high-salt snacks and salt-based preservatives.',
  },
  low_sugar: {
    label: 'Zero / Low Sugar',
    tag: 'Sugar Guard',
    description: 'Flags hidden sugars, high fructose syrup, and maltodextrin.',
  },
  heart_healthy: {
    label: 'Heart Healthy',
    tag: 'Cardio Boost',
    description: 'Prioritizes whole grains, omega-3s, and zero trans-fats.',
  },
  clean_eating: {
    label: 'Clean & Minimal Processing',
    tag: 'Additive Free',
    description: 'Penalizes artificial additives, synthetic colors, and emulsifiers.',
  },
};
