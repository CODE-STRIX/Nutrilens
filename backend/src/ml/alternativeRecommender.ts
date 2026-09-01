import { Product, NutritionFacts } from '../../../shared/types/product';
import { UserProfile } from '../../../shared/types/user';
import { AlternativeRecommendation } from '../../../shared/types/personalization';
import { healthRankingModel } from './healthRankingModel';
import sampleProducts from '../../../data/indian-food-products.json';

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

export class AlternativeRecommender {
  /**
   * Model 4: Vector Space Embedding & Cosine Similarity Matching Engine
   */
  public recommendAlternative(scannedProduct: Product, user: UserProfile): AlternativeRecommendation | null {
    const products: Product[] = sampleProducts as unknown as Product[];

    // Filter candidates in same or similar category
    let candidates = products.filter(p => p.id !== scannedProduct.id && p.category === scannedProduct.category);
    if (candidates.length === 0) {
      candidates = products.filter(p => p.id !== scannedProduct.id);
    }

    if (candidates.length === 0) return null;

    // Vectorize scanned product: V = [sodium, sugar, satFat, fiber, hazardCount]
    const vScanned = this.vectorizeProduct(scannedProduct);
    const scannedScoreResult = healthRankingModel.evaluateProductForUser(scannedProduct, user);

    // Evaluate candidates and calculate Vector Cosine Similarity
    const scoredCandidates = candidates.map(candidate => {
      const vCand = this.vectorizeProduct(candidate);
      const similarity = this.cosineSimilarity(vScanned, vCand);
      const evalResult = healthRankingModel.evaluateProductForUser(candidate, user);
      
      return {
        candidate,
        personalizedScore: evalResult.personalizedScore,
        similarity
      };
    });

    // Filter candidates with higher health score and sort by score & similarity
    const eligible = scoredCandidates
      .filter(item => item.personalizedScore > scannedScoreResult.personalizedScore)
      .sort((a, b) => b.personalizedScore - a.personalizedScore || b.similarity - a.similarity);

    const bestPick = eligible.length > 0 ? eligible[0] : scoredCandidates.sort((a, b) => b.personalizedScore - a.personalizedScore)[0];
    if (!bestPick) return null;

    return this.buildRecommendationPayload(scannedProduct, bestPick.candidate, bestPick.personalizedScore);
  }

  private vectorizeProduct(p: Product): number[] {
    const nut = p.nutrition || defaultNutrition;
    const hazardCount = (p.ingredients || []).filter(i => i.healthFlag === 'warning' || i.healthFlag === 'caution').length;
    
    return [
      nut.sodiumMg / 1000,      // Normalized sodium
      nut.sugarGrams / 50,       // Normalized sugar
      nut.saturatedFatGrams / 20,// Normalized saturated fat
      nut.fiberGrams / 25,       // Normalized fiber
      hazardCount / 5            // Normalized hazard count
    ];
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private buildRecommendationPayload(original: Product, candidate: Product, candidatePersonalizedScore: number): AlternativeRecommendation {
    const keyImprovements: string[] = [];
    const origNut = original.nutrition || defaultNutrition;
    const candNut = candidate.nutrition || defaultNutrition;

    if (candNut.sodiumMg < origNut.sodiumMg && origNut.sodiumMg > 0) {
      const drop = Math.round(((origNut.sodiumMg - candNut.sodiumMg) / origNut.sodiumMg) * 100);
      keyImprovements.push(`${drop}% lower sodium content`);
    }

    if (candNut.sugarGrams < origNut.sugarGrams && origNut.sugarGrams > 0) {
      const drop = Math.round(((origNut.sugarGrams - candNut.sugarGrams) / origNut.sugarGrams) * 100);
      keyImprovements.push(`${drop}% lower sugar density`);
    }

    if (candNut.fiberGrams > origNut.fiberGrams) {
      keyImprovements.push(`Higher dietary fiber (${candNut.fiberGrams}g vs ${origNut.fiberGrams}g per serving)`);
    }

    if (keyImprovements.length === 0) {
      keyImprovements.push('Clean whole food ingredient composition');
    }

    return {
      originalProductId: original.id,
      originalProductName: original.name,
      recommendedProduct: candidate,
      personalizedScore: candidatePersonalizedScore,
      keyImprovements,
      verdict: `${candidate.name} is a significantly healthier choice (Score: ${candidatePersonalizedScore}/100) compared to ${original.name}.`
    };
  }
}

export const alternativeRecommender = new AlternativeRecommender();
