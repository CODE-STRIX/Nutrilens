import { Product } from '../../../../shared/types/product';
import { UserProfile } from '../../../../shared/types/user';
import { AlternativeRecommendation } from '../../../../shared/types/personalization';
import { PersonalizationEngine } from './personalizationEngine';
import sampleProducts from '../../../data/indian-food-products.json';

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

  if (candidate.nutrition.sodiumMg < original.nutrition.sodiumMg) {
    const sodiumDrop = Math.round(((original.nutrition.sodiumMg - candidate.nutrition.sodiumMg) / original.nutrition.sodiumMg) * 100);
    keyImprovements.push(`${sodiumDrop}% less sodium`);
  }

  if (candidate.nutrition.sugarGrams < original.nutrition.sugarGrams) {
    keyImprovements.push(`Lower sugar content (${candidate.nutrition.sugarGrams}g vs ${original.nutrition.sugarGrams}g)`);
  }

  if (candidate.nutrition.fiberGrams > original.nutrition.fiberGrams) {
    keyImprovements.push(`${candidate.nutrition.fiberGrams}g fiber per serving`);
  }

  const hasOriginalAdditives = original.ingredients.some(i => i.isAdditive);
  const hasCandidateAdditives = candidate.ingredients.some(i => i.isAdditive);
  if (hasOriginalAdditives && !hasCandidateAdditives) {
    keyImprovements.push('No artificial additives or preservatives');
  }

  return {
    originalProductId: original.id,
    originalProductName: original.name,
    recommendedProduct: candidate,
    personalizedScore: candidatePersonalizedScore,
    keyImprovements,
    verdict: `Switching to ${candidate.name} increases your personalized health score from ${original.overallBaseScore} to ${candidatePersonalizedScore}.`
  };
};
