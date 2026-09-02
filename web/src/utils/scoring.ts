/**
 * NutriLens Scoring Engine — Single Source of Truth
 *
 * Pure function. No I/O. No side effects.
 * Every screen that displays a score calls this function.
 * No screen computes a score locally.
 *
 * Spec: Section 12 of the build brief.
 */

import { Product, PersonalizedAnalysisResult } from '@shared/types';
import { UserProfile } from '@shared/types/user';

// ── Types ────────────────────────────────────────────────────────────────────

export type VerdictBand = 'avoid' | 'limit' | 'okay' | 'good';
export type ConfidenceLevel = 'high' | 'partial';
export type NutrientBasis = 'per_100g' | 'per_serving';

export interface ScoreLine {
  factor: string;
  value: string;
  delta: number;
  reason: string;
}

export interface PersonalAlert {
  condition: string;
  trigger: string;
  triggerValue: string;
  threshold: string;
  consequence: string;
  severity: 'block' | 'high' | 'medium';
}

export interface ScoreResult {
  score: number;              // 0–100 integer
  baseScore: number;          // before personalisation caps
  band: VerdictBand;
  basis: NutrientBasis;
  breakdown: ScoreLine[];     // every adjustment with label, delta, reason
  alerts: PersonalAlert[];    // condition-triggered warnings
  blocked: boolean;           // true when allergen match forces hard stop
  confidence: ConfidenceLevel;
}

// ── Band Classification ──────────────────────────────────────────────────────
function scoreToBand(score: number): VerdictBand {
  if (score >= 80) return 'good';
  if (score >= 60) return 'okay';
  if (score >= 40) return 'limit';
  return 'avoid';
}

// ── Additive Concern Level lookup ────────────────────────────────────────────
// Built-in minimal lookup for common INS codes — full data comes from KB
const HIGH_CONCERN_ADDITIVES = new Set([
  '102', '104', '107', '110', '122', '123', '124', '128', '129', '133',
  '142', '155', '211', '220', '223', '250', '319', '320', '407', '621',
  '627', '631', '635', '900a', '951', '954'
]);

const MEDIUM_CONCERN_ADDITIVES = new Set([
  '150d', '160b', '171', '200', '202', '260', '262', '296', '316', '322',
  '330', '331', '338', '339', '341', '412', '414', '415', '420', '422',
  '440', '450', '451', '452', '460', '466', '471', '476', '481', '500',
  '503', '508', '509', '551', '553', '903', '955', '960'
]);

function additiveConcern(insCode: string): 'high' | 'medium' | 'low' {
  const code = insCode.replace(/^e/i, '').replace(/^ins-?/i, '').trim();
  if (HIGH_CONCERN_ADDITIVES.has(code)) return 'high';
  if (MEDIUM_CONCERN_ADDITIVES.has(code)) return 'medium';
  return 'low';
}

// ── Main Scoring Function ────────────────────────────────────────────────────

export function scoreProduct(
  product: Product,
  persona: UserProfile
): ScoreResult {
  const breakdown: ScoreLine[] = [];
  const alerts: PersonalAlert[] = [];
  let score = 100;
  let confidence: ConfidenceLevel = 'high';
  let basis: NutrientBasis = 'per_100g';

  // ── Determine nutrient values (support both OFF nutriments and local nutrition schema) ──
  const nutriments = (product as any).nutriments || {};
  const nutrition = (product as any).nutrition || {};

  const sodiumMg: number      = nutriments.sodium_100g     ?? nutriments.sodium     ?? nutrition.sodiumMg      ?? (product as any).sodiumMg      ?? 0;
  const sugarsG: number       = nutriments.sugars_100g     ?? nutriments.sugars     ?? nutrition.sugarGrams     ?? (product as any).sugarGrams     ?? 0;
  const satFatG: number       = nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? nutrition.saturatedFatGrams ?? (product as any).saturatedFatGrams ?? 0;
  const energyKcal: number    = nutriments['energy-kcal_100g']   ?? nutriments['energy-kcal']   ?? nutrition.calories        ?? (product as any).calories        ?? 0;
  const fibreG: number        = nutriments.fiber_100g      ?? nutriments.fiber      ?? nutrition.fiberGrams      ?? (product as any).fiberGrams      ?? 0;
  const proteinG: number      = nutriments.proteins_100g   ?? nutriments.proteins   ?? nutrition.proteinGrams    ?? (product as any).proteinGrams    ?? 0;

  // Drop to partial confidence only if no nutrition sources exist at all
  if (!(product as any).nutriments && !(product as any).nutrition && !(product as any).sodiumMg && !(product as any).sugarGrams) {
    confidence = 'partial';
  }

  // ── Penalties ────────────────────────────────────────────────────────────

  // Sodium: free up to 120 mg, then −1 per extra 40 mg, cap −30
  if (sodiumMg > 120) {
    const excess = sodiumMg - 120;
    const penalty = Math.min(Math.floor(excess / 40), 30);
    if (penalty > 0) {
      score -= penalty;
      breakdown.push({
        factor: 'Sodium',
        value: `${sodiumMg} mg`,
        delta: -penalty,
        reason: `${sodiumMg - 120} mg above the free allowance of 120 mg (−1 per 40 mg excess, capped at −30).`
      });
    }
  }

  // Sugars: free up to 5 g, then −1 per extra 1.5 g, cap −25
  if (sugarsG > 5) {
    const excess = sugarsG - 5;
    const penalty = Math.min(Math.floor(excess / 1.5), 25);
    if (penalty > 0) {
      score -= penalty;
      breakdown.push({
        factor: 'Total sugars',
        value: `${sugarsG} g`,
        delta: -penalty,
        reason: `${(sugarsG - 5).toFixed(1)} g above the free allowance of 5 g (−1 per 1.5 g excess, capped at −25).`
      });
    }
  }

  // Saturated fat: free up to 1.5 g, then −1.5 per extra 1 g, cap −20
  if (satFatG > 1.5) {
    const excess = satFatG - 1.5;
    const penalty = Math.min(Math.floor(excess / 1 * 1.5), 20);
    if (penalty > 0) {
      score -= penalty;
      breakdown.push({
        factor: 'Saturated fat',
        value: `${satFatG} g`,
        delta: -penalty,
        reason: `${(satFatG - 1.5).toFixed(1)} g above the free allowance of 1.5 g (−1.5 per g excess, capped at −20).`
      });
    }
  }

  // Energy: free up to 200 kcal, then −1 per extra 60 kcal, cap −10
  if (energyKcal > 200) {
    const excess = energyKcal - 200;
    const penalty = Math.min(Math.floor(excess / 60), 10);
    if (penalty > 0) {
      score -= penalty;
      breakdown.push({
        factor: 'Energy',
        value: `${energyKcal} kcal`,
        delta: -penalty,
        reason: `${energyKcal - 200} kcal above the free allowance of 200 kcal (−1 per 60 kcal excess, capped at −10).`
      });
    }
  }

  // ── Bonuses ──────────────────────────────────────────────────────────────

  // Fibre: +2 per g above 3 g, cap +12
  if (fibreG > 3) {
    const bonus = Math.min((fibreG - 3) * 2, 12);
    score += bonus;
    breakdown.push({
      factor: 'Dietary fibre',
      value: `${fibreG} g`,
      delta: +bonus,
      reason: `${(fibreG - 3).toFixed(1)} g above 3 g (+2 per g, capped at +12).`
    });
  }

  // Protein: +1 per g above 5 g, cap +8
  if (proteinG > 5) {
    const bonus = Math.min(Math.floor(proteinG - 5), 8);
    score += bonus;
    breakdown.push({
      factor: 'Protein',
      value: `${proteinG} g`,
      delta: +bonus,
      reason: `${(proteinG - 5).toFixed(1)} g above 5 g (+1 per g, capped at +8).`
    });
  }

  // ── Extract ingredients text and additive codes (supports both OFF strings and local JSON arrays) ──
  const rawIngredientsArray = Array.isArray((product as any).ingredients) ? (product as any).ingredients : [];
  const ingredientsArrayText = rawIngredientsArray.map((ing: any) => ing.name || '').join(', ');

  const productIngredientText: string = (product as any).ingredients_text || (product as any).ingredientsText || ingredientsArrayText;

  const rawAdditiveCodes: string[] = (product as any).additiveCodes || (product as any).additives_tags || [];
  const localAdditiveCodes: string[] = rawIngredientsArray
    .filter((ing: any) => ing.insCode || ing.isAdditive)
    .map((ing: any) => ing.insCode || ing.name);

  const additives: string[] = Array.from(new Set([...rawAdditiveCodes, ...localAdditiveCodes]));

  // Zero additives bonus: +4
  if (additives.length === 0) {
    score += 4;
    breakdown.push({
      factor: 'Additives',
      value: 'None detected',
      delta: +4,
      reason: 'No additives identified in the ingredient list.'
    });
  }

  // ── Processing Penalty (NOVA) ─────────────────────────────────────────────
  const novaGroup: number | undefined = (product as any).nova_group || (product as any).novaGroup;

  if (novaGroup === 4) {
    score -= 12;
    breakdown.push({
      factor: 'NOVA group',
      value: 'Group 4 — Ultra-processed',
      delta: -12,
      reason: 'Ultra-processed food. Formulated from industrial ingredients, with little or no whole food present.'
    });
  } else if (novaGroup === 3) {
    score -= 5;
    breakdown.push({
      factor: 'NOVA group',
      value: 'Group 3 — Processed',
      delta: -5,
      reason: 'Processed food made by adding salt, sugar, or fat to minimally processed foods.'
    });
  } else if (novaGroup === 1 || novaGroup === 2) {
    breakdown.push({
      factor: 'NOVA group',
      value: `Group ${novaGroup} — ${novaGroup === 1 ? 'Unprocessed' : 'Minimally processed'}`,
      delta: 0,
      reason: 'No NOVA processing penalty applied.'
    });
  } else {
    confidence = 'partial';
  }

  // ── Additive Penalties ────────────────────────────────────────────────────
  let additivePenalty = 0;
  additives.forEach((code: string) => {
    const level = additiveConcern(code);
    const pts = level === 'high' ? 6 : level === 'medium' ? 3 : 1;
    additivePenalty += pts;
  });
  additivePenalty = Math.min(additivePenalty, 24); // cap at −24

  if (additives.length > 0 && additivePenalty > 0) {
    score -= additivePenalty;
    breakdown.push({
      factor: 'Additives',
      value: `${additives.length} identified`,
      delta: -additivePenalty,
      reason: `${additives.length} additive(s) penalised by concern level (high: −6, medium: −3, low: −1). Combined penalty capped at −24.`
    });
  }

  // Clamp base score
  score = Math.max(0, Math.min(100, Math.round(score)));
  const baseScore = score;

  // ── Allergen Block ────────────────────────────────────────────────────────
  const productAllergens: string[] = (product as any).allergenCodes || [];
  const personaAllergens = persona.allergies || [];

  let blocked = false;
  for (const allergen of personaAllergens) {
    const a = allergen.toLowerCase();
    const matches = productAllergens.some(pa => pa.toLowerCase().includes(a)) ||
      productIngredientText.toLowerCase().includes(a);
    if (matches) {
      blocked = true;
      alerts.push({
        condition: 'Allergen',
        trigger: allergen,
        triggerValue: allergen,
        threshold: 'Any presence',
        consequence: `This product contains or may contain ${allergen}. It is not suitable for you.`,
        severity: 'block'
      });
      break;
    }
  }

  if (blocked) {
    return {
      score: 0,
      baseScore,
      band: 'avoid',
      basis,
      breakdown,
      alerts,
      blocked: true,
      confidence
    };
  }

  // ── Condition-Based Caps ──────────────────────────────────────────────────
  const conditions = persona.healthConditions || [];

  // Hypertension
  if (conditions.includes('Hypertension')) {
    const servingSodium = (product as any).sodiumMg || sodiumMg;
    if (servingSodium > 500) {
      if (score > 25) score = 25;
      alerts.push({
        condition: 'Hypertension',
        trigger: 'Sodium per serving',
        triggerValue: `${servingSodium} mg`,
        threshold: '140 mg recommended per serving',
        consequence: `${servingSodium} mg sodium per serving is roughly ${Math.round(servingSodium / 140)}x your recommended limit of 140 mg. Score capped at 25.`,
        severity: 'high'
      });
    } else if (servingSodium > 300) {
      if (score > 45) score = 45;
      alerts.push({
        condition: 'Hypertension',
        trigger: 'Sodium per serving',
        triggerValue: `${servingSodium} mg`,
        threshold: '140 mg recommended per serving',
        consequence: `${servingSodium} mg sodium per serving exceeds the 300 mg moderate threshold. Score capped at 45.`,
        severity: 'medium'
      });
    }
  }

  // Type 2 Diabetes
  if (conditions.includes('Type2Diabetes')) {
    const addedSugars = sugarsG;
    const hasMaltodextrin = productIngredientText.toLowerCase().includes('maltodextrin');
    const hasGlucoseSyrup = productIngredientText.toLowerCase().includes('glucose syrup');
    if (addedSugars > 10 || hasMaltodextrin || hasGlucoseSyrup) {
      if (score > 30) score = 30;
      const reason = addedSugars > 10
        ? `${addedSugars} g added sugars per 100 g exceeds the 10 g threshold.`
        : `Contains ${hasMaltodextrin ? 'maltodextrin' : 'glucose syrup'}, which raises blood glucose rapidly.`;
      alerts.push({
        condition: 'Type 2 diabetes',
        trigger: addedSugars > 10 ? 'Added sugars' : 'Rapid-glucose ingredient',
        triggerValue: addedSugars > 10 ? `${addedSugars} g` : 'Present',
        threshold: '10 g sugars per 100 g',
        consequence: `${reason} Score capped at 30.`,
        severity: 'high'
      });
    }
  }

  // High Cholesterol
  if (conditions.includes('HighCholesterol')) {
    const hasPalmOil = productIngredientText.toLowerCase().includes('palm oil');
    const hasHydrogenated = productIngredientText.toLowerCase().includes('hydrogenated');
    if (hasPalmOil || hasHydrogenated || satFatG > 6) {
      if (score > 35) score = 35;
      const reason = satFatG > 6
        ? `${satFatG} g saturated fat per 100 g exceeds 6 g threshold.`
        : hasPalmOil ? 'Contains palm oil, high in saturated fat.' : 'Contains hydrogenated fat.';
      alerts.push({
        condition: 'High cholesterol',
        trigger: satFatG > 6 ? 'Saturated fat' : 'Saturating ingredient',
        triggerValue: satFatG > 6 ? `${satFatG} g` : 'Present',
        threshold: '6 g saturated fat per 100 g',
        consequence: `${reason} Score capped at 35.`,
        severity: 'high'
      });
    }
  }

  // GERD
  if (conditions.includes('GERD')) {
    const hasCitric = productIngredientText.toLowerCase().includes('citric acid');
    const hasChilli = productIngredientText.toLowerCase().includes('chilli') || productIngredientText.toLowerCase().includes('chili');
    const acidityRegulators = additives.filter(a => ['330', '331', '296'].includes(a));
    if (hasCitric || hasChilli || acidityRegulators.length > 0) {
      if (score > 50) score = 50;
      alerts.push({
        condition: 'GERD',
        trigger: hasCitric ? 'Citric acid' : hasChilli ? 'Chilli content' : 'Acidity regulators',
        triggerValue: 'Present',
        threshold: 'Avoid acidic and spicy ingredients',
        consequence: 'This product contains ingredients that can trigger or worsen acid reflux. Score capped at 50.',
        severity: 'medium'
      });
    }
  }

  // Kidney support
  if ((conditions as string[]).includes('KidneySupport')) {
    const phosphateAdditives = additives.filter(a => ['338', '339', '341', '450', '451', '452'].includes(a));
    const potassiumMg = nutriments.potassium_100g ?? nutriments.potassium ?? 0;
    if (phosphateAdditives.length > 0 || potassiumMg > 400) {
      if (score > 40) score = 40;
      const reason = phosphateAdditives.length > 0
        ? `Contains phosphate additives (${phosphateAdditives.map(a => 'INS ' + a).join(', ')}).`
        : `Potassium content of ${potassiumMg} mg exceeds 400 mg threshold.`;
      alerts.push({
        condition: 'Kidney support',
        trigger: phosphateAdditives.length > 0 ? 'Phosphate additives' : 'Potassium',
        triggerValue: phosphateAdditives.length > 0 ? 'Present' : `${potassiumMg} mg`,
        threshold: phosphateAdditives.length > 0 ? 'Avoid phosphates' : '400 mg potassium',
        consequence: `${reason} Score capped at 40.`,
        severity: 'high'
      });
    }
  }

  // Final clamp
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    baseScore,
    band: scoreToBand(score),
    basis,
    breakdown,
    alerts,
    blocked: false,
    confidence
  };
}

// ── Convenience Helpers ───────────────────────────────────────────────────────

export function getBandLabel(band: VerdictBand): string {
  switch (band) {
    case 'good':  return 'Good choice';
    case 'okay':  return 'Acceptable';
    case 'limit': return 'Limit intake';
    case 'avoid': return 'Avoid';
  }
}

export function getBandColour(band: VerdictBand): string {
  switch (band) {
    case 'good':  return 'var(--verdict-good)';
    case 'okay':  return 'var(--verdict-ok)';
    case 'limit': return 'var(--verdict-limit)';
    case 'avoid': return 'var(--verdict-avoid)';
  }
}

export function getBandTint(band: VerdictBand): string {
  switch (band) {
    case 'good':  return 'var(--tint-good)';
    case 'okay':  return 'var(--tint-ok)';
    case 'limit': return 'var(--tint-limit)';
    case 'avoid': return 'var(--tint-avoid)';
  }
}

export function getBandCssClass(band: VerdictBand): string {
  switch (band) {
    case 'good':  return 'verdict-good';
    case 'okay':  return 'verdict-ok';
    case 'limit': return 'verdict-limit';
    case 'avoid': return 'verdict-avoid';
  }
}

/**
 * Map a numeric score (0–100) to the arc stroke-dashoffset for an SVG circle.
 * r is the circle radius; supply the same r used in the SVG.
 */
export function scoreToArcOffset(score: number, r: number = 45): number {
  const circumference = 2 * Math.PI * r;
  return circumference - (score / 100) * circumference;
}
