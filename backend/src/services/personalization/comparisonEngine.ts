import { Product } from '../../../../shared/types/product';
import { UserProfile } from '../../../../shared/types/user';
import { ComparisonResult, ComparisonMetric } from '../../../../shared/types/personalization';
import { PersonalizationEngine } from './personalizationEngine';

export const ComparisonEngine = {
  compareProducts: (productA: Product, productB: Product, user: UserProfile): ComparisonResult => {
    const analysisA = PersonalizationEngine.analyzeProductForUser(productA, user);
    const analysisB = PersonalizationEngine.analyzeProductForUser(productB, user);

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
      productAValue: `${productA.nutrition.sodiumMg}mg`,
      productBValue: `${productB.nutrition.sodiumMg}mg`,
      betterProduct: productA.nutrition.sodiumMg < productB.nutrition.sodiumMg ? 'A' : (productB.nutrition.sodiumMg < productA.nutrition.sodiumMg ? 'B' : 'EQUAL'),
      explanation: productA.nutrition.sodiumMg < productB.nutrition.sodiumMg 
        ? `${productA.name} contains ${productB.nutrition.sodiumMg - productA.nutrition.sodiumMg}mg less sodium.`
        : `${productB.name} contains ${productA.nutrition.sodiumMg - productB.nutrition.sodiumMg}mg less sodium.`
    });

    // 3. Sugar Metric
    metrics.push({
      metricName: 'Total Sugar (g)',
      productAValue: `${productA.nutrition.sugarGrams}g`,
      productBValue: `${productB.nutrition.sugarGrams}g`,
      betterProduct: productA.nutrition.sugarGrams < productB.nutrition.sugarGrams ? 'A' : (productB.nutrition.sugarGrams < productA.nutrition.sugarGrams ? 'B' : 'EQUAL'),
      explanation: productA.nutrition.sugarGrams < productB.nutrition.sugarGrams
        ? `${productA.name} has lower sugar content.`
        : `${productB.name} has lower sugar content.`
    });

    // 4. Fiber Metric
    metrics.push({
      metricName: 'Dietary Fiber (g)',
      productAValue: `${productA.nutrition.fiberGrams}g`,
      productBValue: `${productB.nutrition.fiberGrams}g`,
      betterProduct: productA.nutrition.fiberGrams > productB.nutrition.fiberGrams ? 'A' : (productB.nutrition.fiberGrams > productA.nutrition.fiberGrams ? 'B' : 'EQUAL'),
      explanation: productA.nutrition.fiberGrams > productB.nutrition.fiberGrams
        ? `${productA.name} provides ${productA.nutrition.fiberGrams - productB.nutrition.fiberGrams}g more fiber.`
        : `${productB.name} provides ${productB.nutrition.fiberGrams - productA.nutrition.fiberGrams}g more fiber.`
    });

    // 5. Additives Count
    const additivesCountA = productA.ingredients.filter(i => i.isAdditive).length;
    const additivesCountB = productB.ingredients.filter(i => i.isAdditive).length;

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
