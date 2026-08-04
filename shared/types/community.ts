export interface CommunitySubmission {
  id: string;
  submitterId: string;
  productName: string;
  brand: string;
  category: string;
  barcode?: string;
  labelImageUrl?: string;
  ingredientText: string;
  extractedIngredients: string[];
  region?: string;
  verificationCount: number;
  requiredVerifications: number; // e.g. 3 independent users
  verificationStatus: 'unverified' | 'pending_verification' | 'verified' | 'rejected';
  verifiedByUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VerifySubmissionRequest {
  submissionId: string;
  userId: string;
  confirmMatch: boolean;
  corrections?: {
    productName?: string;
    brand?: string;
    ingredientText?: string;
  };
}
