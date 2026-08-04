import { Product, NutritionFacts } from '../../../../shared/types/product';
import { UserProfile } from '../../../../shared/types/user';
import { ComparisonResult, ComparisonMetric } from '../../../../shared/types/personalization';
import { PersonalizationEngine } from './personalizationEngine';

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

export const ComparisonEngine = {
  compareProducts: (productA: Product, productB: Product, user: UserProfile): ComparisonResult => {
    const analysisA = PersonalizationEngine.analyzeProductForUser(productA, user);
    const analysisB = PersonalizationEngine.analyzeProductForUser(productB, user);

    const nutA = productA.nutrition || defaultNutrition;
    const nutB = productB.nutrition || defaultNutrition;

    const ingA = productA.ingredients || [];
    const ingB = productB.ingredients || [];

    const metrics: ComparisonMetric[] = [];

    // 1. Personalized Score Metric
    metrics.push({
      metricName: 'Personalized Health Score',
      productAValue: `${analysisA.personalizedScore}/100`,
      productBValue: `${analysisB.personalizedScore}/100`,
      betterProduct: analysisA.personalizedScore > analysisB.personalizedScore ? 'A' : (analysisB.personalizedScore > analysisA.personalizedScore ? 'B' : 'EQUAL'),
      explanation: `${analysisA.personalizedScore > analysisB.personalizedScore ? productA.name : productB.name} scores higher for your profile.`
    });

    // 2. Sodium Metric
    metrics.push({
      metricName: 'Sodium (mg)',
      productAValue: `${nutA.sodiumMg}mg`,
      productBValue: `${nutB.sodiumMg}mg`,
      betterProduct: nutA.sodiumMg < nutB.sodiumMg ? 'A' : (nutB.sodiumMg < nutA.sodiumMg ? 'B' : 'EQUAL'),
      explanation: nutA.sodiumMg < nutB.sodiumMg 
        ? `${productA.name} contains ${nutB.sodiumMg - nutA.sodiumMg}mg less sodium.`
        : `${productB.name} contains ${nutA.sodiumMg - nutB.sodiumMg}mg less sodium.`
    });

    // 3. Sugar Metric
    metrics.push({
      metricName: 'Total Sugar (g)',
      productAValue: `${nutA.sugarGrams}g`,
      productBValue: `${nutB.sugarGrams}g`,
      betterProduct: nutA.sugarGrams < nutB.sugarGrams ? 'A' : (nutB.sugarGrams < nutA.sugarGrams ? 'B' : 'EQUAL'),
      explanation: nutA.sugarGrams < nutB.sugarGrams
        ? `${productA.name} has lower sugar content.`
        : `${productB.name} has lower sugar content.`
    });

    // 4. Fiber Metric
    metrics.push({
      metricName: 'Dietary Fiber (g)',
      productAValue: `${nutA.fiberGrams}g`,
      productBValue: `${nutB.fiberGrams}g`,
      betterProduct: nutA.fiberGrams > nutB.fiberGrams ? 'A' : (nutB.fiberGrams > nutA.fiberGrams ? 'B' : 'EQUAL'),
      explanation: nutA.fiberGrams > nutB.fiberGrams
        ? `${productA.name} provides ${nutA.fiberGrams - nutB.fiberGrams}g more fiber.`
        : `${productB.name} provides ${nutB.fiberGrams - nutA.fiberGrams}g more fiber.`
    });

    // 5. Additives Count
    const additivesCountA = ingA.filter(i => i.isAdditive).length;
    const additivesCountB = ingB.filter(i => i.isAdditive).length;

    metrics.push({
      metricName: 'Artificial Additives',
      productAValue: `${additivesCountA} additives`,
      productBValue: `${additivesCountB} additives`,
      betterProduct: additivesCountA < additivesCountB ? 'A' : (additivesCountB < additivesCountA ? 'B' : 'EQUAL'),
      explanation: additivesCountA < additivesCountB 
        ? `${productA.name} uses fewer artificial additives.`
        : `${productB.name} uses fewer artificial additives.`
    });

    // Winner decision
    let winningProduct: 'A' | 'B' | 'TIE' = 'TIE';
    if (analysisA.personalizedScore > analysisB.personalizedScore) winningProduct = 'A';
    else if (analysisB.personalizedScore > analysisA.personalizedScore) winningProduct = 'B';

    const winnerName = winningProduct === 'A' ? productA.name : (winningProduct === 'B' ? productB.name : 'Tie');
    const winnerScore = winningProduct === 'A' ? analysisA.personalizedScore : analysisB.personalizedScore;

    const winnerBadge = winningProduct === 'TIE' 
      ? 'Equal Health Standing' 
      : `🏆 CLEAR WINNER: ${winnerName} (${winnerScore}/100)`;

    const plainLanguageVerdict = winningProduct === 'TIE'
      ? `Both products offer similar nutrient and safety profiles for your health conditions.`
      : `We recommend ${winnerName}. It scores ${Math.abs(analysisA.personalizedScore - analysisB.personalizedScore)} points higher on your health profile with better nutrient alignment.`;

    return {
      productA,
      productB,
      productAPersonalizedScore: analysisA.personalizedScore,
      productBPersonalizedScore: analysisB.personalizedScore,
      winningProduct,
      winnerBadge,
      plainLanguageVerdict,
      comparisonMetrics: metrics
    };
  }
};
