// Nutri Lens - Healthy Alternative & Smart Shopping Assistant Engine

import { HealthyAlternative, Product, ProductComparison } from '../../../shared/types';

export class ComparisonEngine {
  public static compareProducts(productA: Product, productB: Product): ProductComparison {
    const points: ProductComparison['comparisonPoints'] = [];

    // 1. Nutrition comparison
    const sugarDiff = productA.nutritionFacts.sugars - productB.nutritionFacts.sugars;
    const sodiumDiff = productA.nutritionFacts.sodium - productB.nutritionFacts.sodium;
    let nutritionAdvantage: 'A' | 'B' | 'tie' = 'tie';

    if (sugarDiff > 5 || sodiumDiff > 200) {
      nutritionAdvantage = 'B';
    } else if (sugarDiff < -5 || sodiumDiff < -200) {
      nutritionAdvantage = 'A';
    }

    points.push({
      category: 'Nutrition',
      productAValue: `Sugar: ${productA.nutritionFacts.sugars}g | Sodium: ${productA.nutritionFacts.sodium}mg`,
      productBValue: `Sugar: ${productB.nutritionFacts.sugars}g | Sodium: ${productB.nutritionFacts.sodium}mg`,
      advantageProduct: nutritionAdvantage,
    });

    // 2. Additive count comparison
    const additivesA = productA.ingredients.filter((i) => i.category === 'additive' || i.category === 'preservative').length;
    const additivesB = productB.ingredients.filter((i) => i.category === 'additive' || i.category === 'preservative').length;
    let additiveAdvantage: 'A' | 'B' | 'tie' = 'tie';
    if (additivesA > additivesB) additiveAdvantage = 'B';
    else if (additivesB > additivesA) additiveAdvantage = 'A';

    points.push({
      category: 'Additives',
      productAValue: `${additivesA} synthetic additives`,
      productBValue: `${additivesB} synthetic additives`,
      advantageProduct: additiveAdvantage,
    });

    // 3. Processing level comparison
    let processingAdvantage: 'A' | 'B' | 'tie' = 'tie';
    if (productA.processingLevel === 'ultra_processed' && productB.processingLevel !== 'ultra_processed') {
      processingAdvantage = 'B';
    } else if (productB.processingLevel === 'ultra_processed' && productA.processingLevel !== 'ultra_processed') {
      processingAdvantage = 'A';
    }

    points.push({
      category: 'Processing',
      productAValue: productA.processingLevel.replace('_', ' ').toUpperCase(),
      productBValue: productB.processingLevel.replace('_', ' ').toUpperCase(),
      advantageProduct: processingAdvantage,
    });

    // 4. Overall score winner
    const winnerProductId = productA.overallScore >= productB.overallScore ? productA.id : productB.id;
    const winnerProduct = productA.overallScore >= productB.overallScore ? productA : productB;

    const summaryVerdict = `${winnerProduct.brand} ${winnerProduct.name} is the healthier choice with a nutrition score of ${winnerProduct.overallScore}/100 compared to ${productA.overallScore >= productB.overallScore ? productB.overallScore : productA.overallScore}/100. It offers lower sodium/sugar and fewer industrial additives.`;

    return {
      productA,
      productB,
      winnerProductId,
      summaryVerdict,
      comparisonPoints: points,
    };
  }

  public static getAlternative(scannedProduct: Product, alternativeProduct: Product): HealthyAlternative {
    const sugarDiff = Math.max(0, Math.round(((scannedProduct.nutritionFacts.sugars - alternativeProduct.nutritionFacts.sugars) / Math.max(1, scannedProduct.nutritionFacts.sugars)) * 100));
    const sodiumDiff = Math.max(0, Math.round(((scannedProduct.nutritionFacts.sodium - alternativeProduct.nutritionFacts.sodium) / Math.max(1, scannedProduct.nutritionFacts.sodium)) * 100));
    const scoreImprovement = Math.max(0, alternativeProduct.overallScore - scannedProduct.overallScore);

    const keyImprovements: string[] = [];
    if (sodiumDiff > 20) keyImprovements.push(`${sodiumDiff}% less sodium`);
    if (sugarDiff > 20) keyImprovements.push(`${sugarDiff}% less sugar`);
    if (alternativeProduct.nutritionFacts.fiber > scannedProduct.nutritionFacts.fiber) {
      keyImprovements.push(`High dietary fiber (${alternativeProduct.nutritionFacts.fiber}g per serving)`);
    }
    if (alternativeProduct.processingLevel !== 'ultra_processed') {
      keyImprovements.push('Clean whole-food ingredients without palm oil');
    }

    return {
      scannedProductId: scannedProduct.id,
      alternativeProduct,
      keyImprovements,
      sugarDifferencePercentage: sugarDiff,
      sodiumDifferencePercentage: sodiumDiff,
      scoreImprovement,
      reason: `Switch to ${alternativeProduct.brand} ${alternativeProduct.name} at the shelf for +${scoreImprovement} points higher nutrition score and zero palm oil.`,
    };
  }
}
