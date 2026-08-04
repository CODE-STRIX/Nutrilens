import { Product, NutritionFacts } from '../../../../shared/types/product';
import { UserProfile } from '../../../../shared/types/user';
import { AlternativeRecommendation } from '../../../../shared/types/personalization';
import { PersonalizationEngine } from './personalizationEngine';
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

export const AlternativeEngine = {
  findAlternative: (product: Product, user: UserProfile): AlternativeRecommendation | null => {
    const products: Product[] = sampleProducts as unknown as Product[];
    
    // Find candidate products in the same category
    const candidates = products.filter(p => p.category === product.category && p.id !== product.id);
    
    if (candidates.length === 0) {
      // Fallback: search for high-scoring items in general
      const generalCandidates = products.filter(p => p.id !== product.id);
      if (generalCandidates.length === 0) return null;
      
      const best = generalCandidates.map(p => ({
        product: p,
        analysis: PersonalizationEngine.analyzeProductForUser(p, user)
      })).sort((a, b) => b.analysis.personalizedScore - a.analysis.personalizedScore)[0];

      return buildRecommendation(product, best.product, best.analysis.personalizedScore);
    }

    const evaluated = candidates.map(p => ({
      product: p,
      analysis: PersonalizationEngine.analyzeProductForUser(p, user)
    })).sort((a, b) => b.analysis.personalizedScore - a.analysis.personalizedScore);

    const best = evaluated[0];
    return buildRecommendation(product, best.product, best.analysis.personalizedScore);
  }
};

const buildRecommendation = (original: Product, candidate: Product, candidatePersonalizedScore: number): AlternativeRecommendation => {
  const keyImprovements: string[] = [];

  const origNut = original.nutrition || defaultNutrition;
  const candNut = candidate.nutrition || defaultNutrition;

  if (candNut.sodiumMg < origNut.sodiumMg && origNut.sodiumMg > 0) {
    const sodiumDrop = Math.round(((origNut.sodiumMg - candNut.sodiumMg) / origNut.sodiumMg) * 100);
    keyImprovements.push(`${sodiumDrop}% less sodium`);
  }

  if (candNut.sugarGrams < origNut.sugarGrams) {
    keyImprovements.push(`Lower sugar content (${candNut.sugarGrams}g vs ${origNut.sugarGrams}g)`);
  }

  if (candNut.fiberGrams > origNut.fiberGrams) {
    keyImprovements.push(`${candNut.fiberGrams}g fiber per serving`);
  }

  const hasOriginalAdditives = (original.ingredients || []).some(i => i.isAdditive);
  const hasCandidateAdditives = (candidate.ingredients || []).some(i => i.isAdditive);
  if (hasOriginalAdditives && !hasCandidateAdditives) {
    keyImprovements.push('No artificial additives or preservatives');
  }

  const origScore = original.overallBaseScore ?? original.overallScore ?? 50;

  return {
    originalProductId: original.id,
    originalProductName: original.name,
    recommendedProduct: candidate,
    personalizedScore: candidatePersonalizedScore,
    keyImprovements,
    verdict: `Switching to ${candidate.name} increases your personalized health score from ${origScore} to ${candidatePersonalizedScore}.`
  };
};
