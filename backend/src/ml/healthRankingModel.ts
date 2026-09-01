import { Product, NutritionFacts } from '../../../shared/types/product';
import { UserProfile, HealthCondition, Allergy, DietaryGoal } from '../../../shared/types/user';
import { 
  PersonalizedAnalysisResult, 
  ConditionFlag, 
  AllergenAlert, 
  GoalCompliance 
} from '../../../shared/types/personalization';

const defaultNutrition: NutritionFacts = {
  servingSize: '100g',
  calories: 0,
  totalFatGrams: 0,
  saturatedFatGrams: 0,
  transFatGrams: 0,
  sodiumMg: 0,
  totalCarbsGrams: 0,
  sugarGrams: 0,
  addedSugarGrams: 0,
  fiberGrams: 0,
  proteinGrams: 0
};

export class HealthRankingModel {
  /**
   * Model 3: Personalized Health Ranking Engine
   * Combines deterministic allergen barriers with multi-criteria health risk feature vectors.
   */
  public evaluateProductForUser(product: Product, user: UserProfile): PersonalizedAnalysisResult {
    let score = product.overallBaseScore ?? product.overallScore ?? 60;
    const conditionFlags: ConditionFlag[] = [];
    const allergenAlerts: AllergenAlert[] = [];
    const goalCompliance: GoalCompliance[] = [];
    const keyRiskIngredients: string[] = [];

    const nutrition = product.nutrition || defaultNutrition;
    const ingredients = product.ingredients || [];

    // 1. DETERMINISTIC ALLERGEN BARRIER (Hard Stop)
    user.allergies.forEach((allergy: Allergy) => {
      const targetStr = allergy.toLowerCase();

      ingredients.forEach(ing => {
        const ingName = ing.name.toLowerCase();
        const matchesAllergy = ingName.includes(targetStr) || 
          (targetStr.includes('gluten') && (ingName.includes('wheat') || ingName.includes('maida'))) ||
          (targetStr.includes('dairy') && (ingName.includes('milk') || ingName.includes('whey') || ingName.includes('butter'))) ||
          (targetStr.includes('peanut') && (ingName.includes('peanut') || ingName.includes('groundnut')));

        if (matchesAllergy) {
          allergenAlerts.push({
            allergy,
            foundInIngredient: ing.name,
            isDirect: true,
            warningMessage: `CRITICAL ALLERGY RISK: Contains ${ing.name} triggering ${allergy} allergy!`
          });
          score -= 45;
          keyRiskIngredients.push(ing.name);
        }
      });
    });

    // 2. CONDITION-AWARE WEIGHTED RISK VECTOR EVALUATION
    user.healthConditions.forEach((condition: HealthCondition) => {
      switch (condition) {
        case 'Hypertension':
        case 'hypertension':
          if (nutrition.sodiumMg > 500) {
            score -= 25;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'High Sodium Warning',
              reasoning: `Contains ${nutrition.sodiumMg}mg sodium per serving (recommended limit is <140mg for hypertension management).`
            });
            keyRiskIngredients.push('Sodium / Salt');
          } else if (nutrition.sodiumMg > 250) {
            score -= 10;
            conditionFlags.push({
              condition,
              severity: 'CAUTION',
              title: 'Moderate Sodium Level',
              reasoning: `Contains ${nutrition.sodiumMg}mg sodium per serving. Consume in moderation.`
            });
          }
          break;

        case 'Type2Diabetes':
        case 'diabetes_type_2':
          if (nutrition.sugarGrams > 10 || nutrition.addedSugarGrams > 5) {
            score -= 25;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'High Sugar Impact',
              reasoning: `Contains ${nutrition.sugarGrams}g sugar per serving, which can trigger rapid blood glucose surges.`
            });
            keyRiskIngredients.push('Sugar / Added Sugars');
          }
          break;

        case 'HighCholesterol':
        case 'high_cholesterol':
          if (nutrition.saturatedFatGrams > 4 || nutrition.transFatGrams > 0) {
            score -= 20;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'Saturated & Trans Fat Warning',
              reasoning: `Contains ${nutrition.saturatedFatGrams}g saturated fat and ${nutrition.transFatGrams}g trans fat.`
            });
            keyRiskIngredients.push('Saturated / Trans Fats');
          }
          break;

        case 'GERD':
        case 'acid_reflux':
          if (nutrition.saturatedFatGrams > 5) {
            score -= 15;
            conditionFlags.push({
              condition,
              severity: 'CAUTION',
              title: 'High Caloric & Fat Density',
              reasoning: `Provides ${nutrition.saturatedFatGrams}g saturated fat which can trigger acid reflux.`
            });
          }
          break;
      }
    });

    // 3. DIETARY GOALS COMPLIANCE VECTOR
    user.goals.forEach((goal: DietaryGoal) => {
      switch (goal) {
        case 'LowSodium':
        case 'low_sodium':
          if (nutrition.sodiumMg < 140) {
            score += 10;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: 'Low sodium content aligns with your low-sodium goal.' });
          } else {
            goalCompliance.push({ goal, status: 'CONFLICT', explanation: `Exceeds low-sodium target (${nutrition.sodiumMg}mg per serving).` });
          }
          break;

        case 'HighProtein':
        case 'muscle_gain':
          if (nutrition.proteinGrams >= 8) {
            score += 10;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: `Provides ${nutrition.proteinGrams}g protein per serving.` });
          } else {
            goalCompliance.push({ goal, status: 'NEUTRAL', explanation: `Contains ${nutrition.proteinGrams}g protein.` });
          }
          break;

        case 'HeartHealth':
        case 'cardiovascular' as any:
          if (nutrition.fiberGrams >= 5 && nutrition.saturatedFatGrams < 2) {
            score += 10;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: 'High dietary fiber and low saturated fat support cardiovascular wellness.' });
          }
          break;
      }
    });

    // 4. ADDITIVE HAZARD PENALTY
    ingredients.forEach(ing => {
      if (ing.healthFlag === 'warning') score -= 15;
      else if (ing.healthFlag === 'caution') score -= 5;
    });

    // Clamp score to 0..100
    const finalScore = Math.max(0, Math.min(100, score));

    // Determine Safety Tier
    let safetyTier: PersonalizedAnalysisResult['safetyTier'] = 'EXCELLENT';
    if (allergenAlerts.length > 0 || finalScore < 30) {
      safetyTier = 'CRITICAL_RISK';
    } else if (finalScore < 50) {
      safetyTier = 'POOR';
    } else if (finalScore < 70) {
      safetyTier = 'MODERATE';
    } else if (finalScore < 85) {
      safetyTier = 'GOOD';
    }

    const summaryHeadline = `${product.name} receives a personalized score of ${finalScore}/100 for ${user.name || 'you'}.`;
    let plainLanguageVerdict = `Rated ${finalScore}/100 based on your profile.`;

    if (safetyTier === 'CRITICAL_RISK') {
      plainLanguageVerdict = `⚠️ NOT RECOMMENDED: High safety risk due to ${allergenAlerts.length > 0 ? 'allergen conflict' : 'unfavorable nutrient/additive profile'}.`;
    } else if (safetyTier === 'EXCELLENT' || safetyTier === 'GOOD') {
      plainLanguageVerdict = `✅ HEALTHY CHOICE: Aligns well with your health profile and dietary goals.`;
    }

    return {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      baseScore: product.overallBaseScore ?? product.overallScore ?? 60,
      personalizedScore: finalScore,
      safetyTier,
      summaryHeadline,
      plainLanguageVerdict,
      conditionFlags,
      allergenAlerts,
      goalCompliance,
      keyRiskIngredients: Array.from(new Set(keyRiskIngredients))
    };
  }
}

export const healthRankingModel = new HealthRankingModel();
