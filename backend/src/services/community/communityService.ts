import { config } from '../../config';
import { CommunitySubmission, VerifySubmissionRequest, Product } from '../../../../shared/types';
import { productService } from '../productService';

// In-memory store for community submissions
let mockCommunitySubmissions: CommunitySubmission[] = [
  {
    id: "SUB-101",
    submitterId: "user_rajesh",
    productName: "Local Banana Chips Salted",
    brand: "Kerala Snack House",
    category: "Regional Snacks",
    barcode: "8905554443331",
    labelImageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500",
    ingredientText: "Raw Plantain, Coconut Oil, Iodised Salt, Turmeric Powder.",
    extractedIngredients: ["Raw Plantain", "Coconut Oil", "Iodised Salt", "Turmeric Powder"],
    region: "Kerala / South India",
    verificationCount: 2,
    requiredVerifications: config.verificationThreshold,
    verificationStatus: "pending_verification",
    verifiedByUsers: ["user_priya", "user_anand"],
    createdAt: "2026-08-02T15:00:00Z",
    updatedAt: "2026-08-03T11:00:00Z"
  },
  {
    id: "SUB-102",
    submitterId: "user_sunita",
    productName: "Special Roasted Chana Namkeen",
    brand: "Jaipur Desi Sweets",
    category: "Namkeen",
    ingredientText: "Bengal Gram (Chana), Mustard Oil, Red Chilli Powder, Amchur Powder, Black Salt.",
    extractedIngredients: ["Bengal Gram", "Mustard Oil", "Red Chilli Powder", "Amchur Powder", "Black Salt"],
    region: "Rajasthan / North India",
    verificationCount: 3,
    requiredVerifications: config.verificationThreshold,
    verificationStatus: "verified",
    verifiedByUsers: ["user_rajesh", "user_amit", "user_pooja"],
    createdAt: "2026-07-25T10:00:00Z",
    updatedAt: "2026-07-27T16:00:00Z"
  }
];

export class CommunityService {
  public getAllSubmissions(): CommunitySubmission[] {
    return mockCommunitySubmissions;
  }

  public getSubmissionById(id: string): CommunitySubmission | undefined {
    return mockCommunitySubmissions.find(s => s.id === id);
  }

  public getVerifiedSubmissions(): CommunitySubmission[] {
    return mockCommunitySubmissions.filter(s => s.verificationStatus === 'verified');
  }

  /**
   * Flagship Feature 12: Submit a regional/unbranded snack label
   */
  public submitProduct(
    submitterId: string,
    productName: string,
    brand: string,
    category: string,
    ingredientText: string,
    barcode?: string,
    labelImageUrl?: string,
    region?: string
  ): CommunitySubmission {
    const extractedIngredients = ingredientText
      .split(/[,;\n\.]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const submission: CommunitySubmission = {
      id: `SUB-${Date.now()}`,
      submitterId,
      productName,
      brand,
      category,
      barcode,
      labelImageUrl,
      ingredientText,
      extractedIngredients,
      region: region || "General India",
      verificationCount: 1, // Submitter counts as 1st verification
      requiredVerifications: config.verificationThreshold,
      verificationStatus: "pending_verification",
      verifiedByUsers: [submitterId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockCommunitySubmissions.push(submission);
    return submission;
  }

  /**
   * Flagship Feature 12: Verify a community-submitted product
   * Multi-user consensus logic: when verificationCount >= requiredVerifications (3),
   * the product is promoted to 'verified' and added to the official product database.
   */
  public verifySubmission(req: VerifySubmissionRequest): { submission: CommunitySubmission; promotedToProduct?: Product } {
    const sub = mockCommunitySubmissions.find(s => s.id === req.submissionId);
    if (!sub) {
      throw new Error(`Submission ${req.submissionId} not found`);
    }

    if (sub.verifiedByUsers.includes(req.userId)) {
      throw new Error(`User ${req.userId} has already verified this submission`);
    }

    if (req.confirmMatch) {
      sub.verifiedByUsers.push(req.userId);
      sub.verificationCount += 1;

      if (req.corrections) {
        if (req.corrections.productName) sub.productName = req.corrections.productName;
        if (req.corrections.brand) sub.brand = req.corrections.brand;
        if (req.corrections.ingredientText) {
          sub.ingredientText = req.corrections.ingredientText;
          sub.extractedIngredients = req.corrections.ingredientText.split(/[,;\n\.]+/).map(s => s.trim()).filter(Boolean);
        }
      }

      // Check if threshold reached for promotion to 'verified' product database
      let promotedProduct: Product | undefined;
      if (sub.verificationCount >= sub.requiredVerifications) {
        sub.verificationStatus = 'verified';

        // Convert community submission into verified product in Product DB
        const newVerifiedProduct: Product = {
          id: `PROD-COMM-${sub.id}`,
          barcode: sub.barcode,
          name: sub.productName,
          brand: sub.brand,
          category: sub.category,
          imageUrl: sub.labelImageUrl,
          ingredientText: sub.ingredientText,
          ingredients: sub.extractedIngredients.map((name, i) => ({
            id: `comm-ing-${i}`,
            name,
            isAdditive: false,
            purpose: "Community reported ingredient"
          })),
          additives: [],
          manufacturingRationale: [],
          isCommunitySubmitted: true,
          verificationStatus: 'verified',
          overallScore: 70,
          createdAt: new Date().toISOString()
        };

        promotedProduct = productService.addProductToDb(newVerifiedProduct);
      }

      sub.updatedAt = new Date().toISOString();
      return { submission: sub, promotedToProduct: promotedProduct };
    } else {
      // Rejection logic if user reports label mismatch
      sub.verificationStatus = 'rejected';
      sub.updatedAt = new Date().toISOString();
      return { submission: sub };
    }
  }
}

export const communityService = new CommunityService();
