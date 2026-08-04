import { Request, Response } from 'express';
import { communityService } from '../services/community/communityService';

export class CommunityController {
  public getAllSubmissions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const submissions = communityService.getAllSubmissions();
      res.json({ success: true, count: submissions.length, data: submissions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getSubmissionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const submission = communityService.getSubmissionById(id);
      if (!submission) {
        res.status(404).json({ success: false, message: `Submission ${id} not found` });
        return;
      }
      res.json({ success: true, data: submission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public submitProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { submitterId, productName, brand, category, ingredientText, barcode, labelImageUrl, region } = req.body;
      if (!productName || !brand || !ingredientText) {
        res.status(400).json({ success: false, message: 'productName, brand, and ingredientText are required' });
        return;
      }
      const submission = communityService.submitProduct(
        submitterId || 'user_anonymous',
        productName,
        brand,
        category || 'Unbranded Snack',
        ingredientText,
        barcode,
        labelImageUrl,
        region
      );
      res.status(201).json({ success: true, data: submission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public verifySubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { submissionId, userId, confirmMatch, corrections } = req.body;
      if (!submissionId || !userId) {
        res.status(400).json({ success: false, message: 'submissionId and userId are required' });
        return;
      }

      const result = communityService.verifySubmission({
        submissionId,
        userId,
        confirmMatch: confirmMatch !== false,
        corrections
      });

      res.json({
        success: true,
        message: result.promotedToProduct 
          ? "Verification accepted! Submission has reached threshold and is now a VERIFIED product." 
          : "Verification recorded successfully.",
        data: result.submission,
        promotedProduct: result.promotedToProduct
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}

export const communityController = new CommunityController();
