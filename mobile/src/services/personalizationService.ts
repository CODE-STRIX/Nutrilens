// Nutri Lens - Personalized Health Analysis & Manufacturing Transparency Engine

import { ALLERGIES_META, HEALTH_CONDITIONS_META } from '../../../shared/constants';
import { AllergyWarning, ConditionFlag, PersonalizedAnalysis, Product, UserProfile } from '../../../shared/types';

export class PersonalizationEngine {
  public static analyzeProduct(product: Product, userProfile: UserProfile): PersonalizedAnalysis {
    const conditionFlags: ConditionFlag[] = [];
    const allergyWarnings: AllergyWarning[] = [];
    let suitabilityDeductions = 0;

    // 1. Evaluate Health Conditions (Feature 5)
    userProfile.conditions.forEach((condition) => {
      const meta = HEALTH_CONDITIONS_META[condition];
      if (!meta) return;

      if (condition === 'hypertension' && product.nutritionFacts.sodium >= (meta.highRiskThresholds.sodiumMg || 400)) {
        conditionFlags.push({
          condition: 'hypertension',
          severity: product.nutritionFacts.sodium > 700 ? 'high' : 'medium',
          title: 'High Sodium Risk for Blood Pressure',
          message: `This item contains ${product.nutritionFacts.sodium} mg sodium per serving (${Math.round((product.nutritionFacts.sodium / 2000) * 100)}% of daily allowance).`,
          triggerIngredientOrNutrient: 'Sodium',
        });
        suitabilityDeductions += product.nutritionFacts.sodium > 700 ? 30 : 15;
      }

      if (condition === 'diabetes_type_2' && product.nutritionFacts.sugars >= (meta.highRiskThresholds.sugarG || 10)) {
        conditionFlags.push({
          condition: 'diabetes_type_2',
          severity: product.nutritionFacts.sugars > 15 ? 'high' : 'medium',
          title: 'Elevated Glycemic / Sugar Warning',
          message: `Contains ${product.nutritionFacts.sugars}g sugar per serving. May trigger rapid glucose spikes.`,
          triggerIngredientOrNutrient: 'Sugars / Added Sugars',
        });
        suitabilityDeductions += product.nutritionFacts.sugars > 15 ? 25 : 15;
      }

      if (condition === 'high_cholesterol' && product.nutritionFacts.saturatedFat >= (meta.highRiskThresholds.saturatedFatG || 4)) {
        conditionFlags.push({
          condition: 'high_cholesterol',
          severity: 'medium',
          title: 'Saturated Fat Alert',
          message: `Contains ${product.nutritionFacts.saturatedFat}g saturated fat. Monitor overall lipid intake.`,
          triggerIngredientOrNutrient: 'Saturated Fat / Palm Oil',
        });
        suitabilityDeductions += 15;
      }

      if (condition === 'kidney_disease' && product.nutritionFacts.sodium >= (meta.highRiskThresholds.sodiumMg || 300)) {
        conditionFlags.push({
          condition: 'kidney_disease',
          severity: 'high',
          title: 'Renal Sodium Filter Alert',
          message: `High sodium load (${product.nutritionFacts.sodium} mg) exerts additional filtration stress on kidneys.`,
          triggerIngredientOrNutrient: 'Sodium & Salt Additives',
        });
        suitabilityDeductions += 35;
      }
    });

    // 2. Evaluate Allergies (Feature 5)
    userProfile.allergies.forEach((allergy) => {
      const allergyMeta = ALLERGIES_META[allergy];
      if (!allergyMeta) return;

      product.ingredients.forEach((ing) => {
        const lowerName = ing.name.toLowerCase();
        const matches = allergyMeta.keywords.some((kw) => lowerName.includes(kw));

        if (matches) {
          allergyWarnings.push({
            allergy,
            ingredientName: ing.name,
            isDirectMatch: true,
          });
          suitabilityDeductions += 50; // Severe penalty for allergen presence
        }
      });
    });

    // 3. Evaluate User Goals (Feature 5)
    const goalAlignment = userProfile.goals.map((goal) => {
      if (goal === 'low_sodium') {
        const isAligned = product.nutritionFacts.sodium < 300;
        return {
          goal,
          isAligned,
          reason: isAligned ? 'Low sodium content aligns with your salt-reduction goal.' : 'High sodium content exceeds your salt-reduction target.',
        };
      }
      if (goal === 'low_sugar') {
        const isAligned = product.nutritionFacts.sugars < 5;
        return {
          goal,
          isAligned,
          reason: isAligned ? 'Low sugar content fits your zero/low-sugar diet.' : `Contains ${product.nutritionFacts.sugars}g sugar, exceeding low-sugar goals.`,
        };
      }
      if (goal === 'clean_eating') {
        const isAligned = product.processingLevel !== 'ultra_processed';
        return {
          goal,
          isAligned,
          reason: isAligned ? 'Minimal artificial additives.' : 'Ultra-processed food with multiple synthetic additives.',
        };
      }
      return {
        goal,
        isAligned: true,
        reason: 'Fits standard daily nutritional balance.',
      };
    });

    // 4. Extract Manufacturing Rationale (Feature 4)
    const manufacturingSummaries = product.ingredients
      .filter((ing) => ing.manufacturingRationale !== undefined)
      .map((ing) => ing.manufacturingRationale!);

    // 5. Calculate Final Suitability
    const suitabilityScore = Math.max(0, Math.min(100, product.overallScore - suitabilityDeductions));
    let overallSuitability: 'recommended' | 'moderate' | 'avoid' = 'recommended';
    if (suitabilityScore < 50 || allergyWarnings.length > 0) {
      overallSuitability = 'avoid';
    } else if (suitabilityScore < 75 || conditionFlags.length > 0) {
      overallSuitability = 'moderate';
    }

    // 6. Generate Personalized Recommendation Tip
    let personalizedTip = 'This product fits comfortably into a balanced diet for your profile.';
    if (allergyWarnings.length > 0) {
      personalizedTip = `ALLERGY WARNING: Contains ${allergyWarnings.map((a) => a.ingredientName).join(', ')}. Avoid consumption.`;
    } else if (conditionFlags.length > 0) {
      personalizedTip = `Caution for ${userProfile.name}: High ${conditionFlags.map((c) => c.triggerIngredientOrNutrient).join(' & ')} detected based on your ${conditionFlags.map((c) => HEALTH_CONDITIONS_META[c.condition]?.label).join(', ')} profile.`;
    }

    return {
      productId: product.id,
      overallSuitability,
      suitabilityScore,
      conditionFlags,
      allergyWarnings,
      goalAlignment,
      manufacturingSummaries,
      personalizedTip,
    };
  }
}
