import { Product, NutritionFacts } from '../../../../shared/types/product';
import { UserProfile, HealthCondition, Allergy, DietaryGoal } from '../../../../shared/types/user';
import { 
  PersonalizedAnalysisResult, 
  ConditionFlag, 
  AllergenAlert, 
  GoalCompliance 
} from '../../../../shared/types/personalization';

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

export const PersonalizationEngine = {
  analyzeProductForUser: (product: Product, user: UserProfile): PersonalizedAnalysisResult => {
    let score = product.overallBaseScore ?? product.overallScore ?? 50;
    const conditionFlags: ConditionFlag[] = [];
    const allergenAlerts: AllergenAlert[] = [];
    const goalCompliance: GoalCompliance[] = [];
    const keyRiskIngredients: string[] = [];

    const nutrition = product.nutrition || defaultNutrition;
    const ingredients = product.ingredients || [];

    // 1. ALLERGY CHECK (Highest priority - safety critical)
    user.allergies.forEach((allergy: Allergy) => {
      const targetStr = allergy.toLowerCase();
      
      ingredients.forEach(ing => {
        const ingName = ing.name.toLowerCase();
        if (ingName.includes(targetStr) || (allergy === 'Gluten' && ingName.includes('wheat'))) {
          allergenAlerts.push({
            allergy,
            foundInIngredient: ing.name,
            isDirect: true,
            warningMessage: `⚠️ ALLERGY CONFLICT: Contains ${ing.name} which triggers ${allergy} allergy!`
          });
          score -= 40;
          keyRiskIngredients.push(ing.name);
        }
      });
    });

    // 2. CONDITION-AWARE RULES ENGINE
    user.healthConditions.forEach((condition: HealthCondition) => {
      switch (condition) {
        case 'Hypertension':
          if (nutrition.sodiumMg > 500) {
            score -= 25;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'Critical Sodium Warning',
              reasoning: `Contains ${nutrition.sodiumMg}mg sodium per serving (recommended limit is <140mg for hypertension management).`,
              nutrientInvolved: 'Sodium',
              valueRecorded: `${nutrition.sodiumMg}mg`
            });
            keyRiskIngredients.push('Sodium / Salt');
          } else if (nutrition.sodiumMg > 200) {
            score -= 10;
            conditionFlags.push({
              condition,
              severity: 'CAUTION',
              title: 'Moderate Sodium Level',
              reasoning: `Contains ${nutrition.sodiumMg}mg sodium per serving. Consume with caution.`,
              nutrientInvolved: 'Sodium',
              valueRecorded: `${nutrition.sodiumMg}mg`
            });
          }
          break;

        case 'Type2Diabetes':
          if (nutrition.sugarGrams > 15 || nutrition.addedSugarGrams > 5) {
            score -= 25;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'High Sugar & Glycemic Impact',
              reasoning: `High sugar content (${nutrition.sugarGrams}g total, ${nutrition.addedSugarGrams}g added) can cause severe glucose spikes.`,
              nutrientInvolved: 'Sugar',
              valueRecorded: `${nutrition.sugarGrams}g sugar`
            });
            keyRiskIngredients.push('Added Sugar');
          }
          if (nutrition.fiberGrams >= 5) {
            score += 10;
            conditionFlags.push({
              condition,
              severity: 'FAVORABLE',
              title: 'High Fiber Glucose Buffer',
              reasoning: `Contains ${nutrition.fiberGrams}g fiber, helping blunt glycemic response.`,
              nutrientInvolved: 'Fiber',
              valueRecorded: `${nutrition.fiberGrams}g fiber`
            });
          }
          break;

        case 'HighCholesterol':
          if (nutrition.saturatedFatGrams > 3.5 || nutrition.transFatGrams > 0) {
            score -= 20;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'Elevated Saturated / Trans Fat',
              reasoning: `Contains ${nutrition.saturatedFatGrams}g saturated fat per serving which raises serum LDL cholesterol.`,
              nutrientInvolved: 'Saturated Fat',
              valueRecorded: `${nutrition.saturatedFatGrams}g saturated fat`
            });
            
            // Check for Palm Oil
            const hasPalmOil = ingredients.some(i => i.insCode === 'PALM_OIL' || i.name.toLowerCase().includes('palm'));
            if (hasPalmOil) {
              keyRiskIngredients.push('Palm Oil (Palmitic Acid)');
            }
          }
          break;

        case 'GERD':
          // Check for citric acid, sodium benzoate, acidic preservatives
          const acidicAdditives = ingredients.filter(i => i.insCode === 'INS_211' || i.insCode === 'INS_330' || i.name.toLowerCase().includes('chilli'));
          if (acidicAdditives.length > 0) {
            score -= 15;
            conditionFlags.push({
              condition,
              severity: 'CAUTION',
              title: 'Acidic Preservative / Spice Trigger',
              reasoning: `Contains ${acidicAdditives.map(a => a.name).join(', ')} which may irritate gastric mucosa and trigger acid reflux.`,
              nutrientInvolved: 'Acidic Preservative'
            });
          }
          break;

        case 'Celiac':
          const glutenIng = ingredients.find(i => i.name.toLowerCase().includes('wheat') || i.name.toLowerCase().includes('maida'));
          if (glutenIng) {
            score -= 35;
            conditionFlags.push({
              condition,
              severity: 'WARNING',
              title: 'Gluten Containing Grain',
              reasoning: `Contains ${glutenIng.name} which triggers autoimmune villous atrophy in Celiac patients.`,
              nutrientInvolved: 'Gluten'
            });
          }
          break;
      }
    });

    // 3. DIETARY GOALS EVALUATION
    user.goals.forEach((goal: DietaryGoal) => {
      switch (goal) {
        case 'LowSodium':
          if (nutrition.sodiumMg <= 140) {
            score += 8;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: 'Sodium content is well within low-sodium targets.' });
          } else {
            goalCompliance.push({ goal, status: 'CONFLICT', explanation: 'Exceeds low-sodium target.' });
          }
          break;

        case 'HighProtein':
          if (nutrition.proteinGrams >= 8) {
            score += 8;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: 'High protein content supports muscle recovery.' });
          } else {
            goalCompliance.push({ goal, status: 'NEUTRAL', explanation: 'Low to moderate protein.' });
          }
          break;

        case 'GutHealth':
          if (nutrition.fiberGrams >= 4 && !ingredients.some(i => i.isAdditive)) {
            score += 10;
            goalCompliance.push({ goal, status: 'ALIGNED', explanation: 'Whole food fiber with no synthetic emulsifiers.' });
          }
          break;
      }
    });

    // Clamp score between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Determine safety tier
    let safetyTier: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL_RISK' = 'GOOD';
    if (finalScore >= 85) safetyTier = 'EXCELLENT';
    else if (finalScore >= 70) safetyTier = 'GOOD';
    else if (finalScore >= 50) safetyTier = 'MODERATE';
    else if (finalScore >= 30) safetyTier = 'POOR';
    else safetyTier = 'CRITICAL_RISK';

    // Build plain language verdict
    let summaryHeadline = `${product.name} gets a personalized rating of ${finalScore}/100 for ${user.name}.`;
    let plainLanguageVerdict = '';

    if (allergenAlerts.length > 0) {
      plainLanguageVerdict = `❌ HIGH RISK: DO NOT CONSUME. Contains ${allergenAlerts.map(a => a.foundInIngredient).join(', ')} matching your allergen profile!`;
    } else if (conditionFlags.some(f => f.severity === 'WARNING')) {
      const topWarning = conditionFlags.find(f => f.severity === 'WARNING');
      plainLanguageVerdict = `⚠️ NOT RECOMMENDED: ${topWarning?.reasoning} Consider switching to a lower-risk alternative.`;
    } else if (finalScore >= 75) {
      plainLanguageVerdict = `✅ GREAT CHOICE: Aligns well with your health profile (${user.healthConditions.join(', ') || 'General Wellness'}).`;
    } else {
      plainLanguageVerdict = `💡 CONSUME IN MODERATION: High in sodium or additives. Pair with high-fiber whole foods.`;
    }

    const baseScore = product.overallBaseScore ?? product.overallScore ?? 50;

    return {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      baseScore,
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
};
