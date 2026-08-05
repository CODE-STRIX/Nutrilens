// Nutri Lens - Community Verification Service (Person C Scope)

import { CommunitySubmission } from '../../../shared/types';

export const INITIAL_COMMUNITY_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: 'sub_101',
    submitterId: 'user_002',
    productName: 'Rajkot Sweet & Spicy Chutney Sev',
    brand: 'Gokul Namkeen',
    category: 'Regional Unbranded Snack',
    barcode: '8909000123456',
    labelImageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    ingredientText: 'Gram Flour (Besan), Edible Vegetable Oil (Cottonseed Oil), Sugar, Spices (Chilli, Black Salt, Cumin), Acidity Regulator (INS 330).',
    extractedIngredients: ['Gram Flour', 'Cottonseed Oil', 'Sugar', 'Spices', 'INS 330 (Citric Acid)'],
    region: 'Gujarat / Saurashtra',
    verificationCount: 2,
    requiredVerifications: 3,
    verificationStatus: 'pending_verification',
    verifiedByUsers: ['user_003', 'user_004'],
    createdAt: '2026-02-18T11:00:00Z',
    updatedAt: '2026-02-19T14:20:00Z',
  },
  {
    id: 'sub_102',
    submitterId: 'user_005',
    productName: 'Braj Desi Ghee Mathura Peda',
    brand: 'Radhey Shyam Sweets',
    category: 'Traditional Mithai',
    ingredientText: 'Whole Milk Mawa (Khoya), Sugar, Pure Desi Ghee, Green Cardamom Powder.',
    extractedIngredients: ['Milk Mawa', 'Sugar', 'Desi Ghee', 'Cardamom'],
    region: 'Uttar Pradesh (Mathura)',
    verificationCount: 3,
    requiredVerifications: 3,
    verificationStatus: 'verified',
    verifiedByUsers: ['user_001', 'user_006', 'user_007'],
    createdAt: '2026-01-20T09:15:00Z',
    updatedAt: '2026-01-22T16:00:00Z',
  },
  {
    id: 'sub_103',
    submitterId: 'user_008',
    productName: 'Kolhapuri Spicy Chivda',
    brand: 'Mahalaxmi Food Products',
    category: 'Regional Snack',
    ingredientText: 'Flattened Rice (Poha), Peanut Oil, Peanuts, Mustard Seeds, Curry Leaves, Turmeric, Salt, Preservative (INS 211).',
    extractedIngredients: ['Flattened Rice', 'Peanut Oil', 'Peanuts', 'Mustard', 'Curry Leaves', 'Turmeric', 'Salt', 'INS 211'],
    region: 'Maharashtra (Kolhapur)',
    verificationCount: 1,
    requiredVerifications: 3,
    verificationStatus: 'pending_verification',
    verifiedByUsers: ['user_009'],
    createdAt: '2026-02-22T16:45:00Z',
    updatedAt: '2026-02-22T16:45:00Z',
  },
];

export class CommunityService {
  private static submissions: CommunitySubmission[] = [...INITIAL_COMMUNITY_SUBMISSIONS];

  /**
   * Get all active submissions
   */
  public static getSubmissions(): CommunitySubmission[] {
    return this.submissions;
  }

  /**
   * Submit a new local unlisted product label for community verification
   */
  public static submitProduct(
    data: Omit<
      CommunitySubmission,
      'id' | 'createdAt' | 'updatedAt' | 'verificationCount' | 'requiredVerifications' | 'verificationStatus' | 'verifiedByUsers'
    >
  ): CommunitySubmission {
    const newSubmission: CommunitySubmission = {
      ...data,
      id: `sub_${Date.now()}`,
      verificationCount: 1, // Submitter counts as 1st verification
      requiredVerifications: 3,
      verificationStatus: 'pending_verification',
      verifiedByUsers: [data.submitterId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.submissions.unshift(newSubmission);
    return newSubmission;
  }

  /**
   * Verify an existing submission by another user
   */
  public static verifySubmission(submissionId: string, userId: string, confirmMatch: boolean): CommunitySubmission | null {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    if (sub.verifiedByUsers.includes(userId)) {
      return sub; // User already verified this item
    }

    if (confirmMatch) {
      sub.verifiedByUsers.push(userId);
      sub.verificationCount += 1;
      sub.updatedAt = new Date().toISOString();

      if (sub.verificationCount >= sub.requiredVerifications) {
        sub.verificationStatus = 'verified';
      }
    }

    return sub;
  }
}
