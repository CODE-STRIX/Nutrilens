import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { UserStore } from '../models/userStore';
import { PersonalizationEngine } from '../services/personalization/personalizationEngine';
import { AlternativeEngine } from '../services/personalization/alternativeEngine';
import { ComparisonEngine } from '../services/personalization/comparisonEngine';
import sampleProducts from '../../data/indian-food-products.json';
import { Product } from '../../../shared/types/product';

const productsDatabase: Product[] = sampleProducts as unknown as Product[];

export const PersonalizationController = {
  analyzeProduct: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const user = UserStore.findById(userId);
      if (!user) return res.status(404).json({ error: 'User profile not found' });

      const { productId, productBarcode, customProduct } = req.body;
      let targetProduct: Product | undefined = undefined;

      if (customProduct) {
        targetProduct = customProduct;
      } else if (productId) {
        targetProduct = productsDatabase.find(p => p.id === productId);
      } else if (productBarcode) {
        targetProduct = productsDatabase.find(p => p.barcode === productBarcode);
      }

      if (!targetProduct) {
        // Fallback to Maggi 2min
        targetProduct = productsDatabase[0];
      }

      const result = PersonalizationEngine.analyzeProductForUser(targetProduct, user);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Personalization analysis failed' });
    }
  },

  recommendAlternative: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const user = UserStore.findById(userId);
      if (!user) return res.status(404).json({ error: 'User profile not found' });

      const { productId } = req.body;
      const targetProduct = productsDatabase.find(p => p.id === productId) || productsDatabase[0];

      const alternative = AlternativeEngine.findAlternative(targetProduct, user);
      if (!alternative) {
        return res.status(404).json({ message: 'No suitable alternative found in database' });
      }

      return res.json(alternative);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Alternative recommendation failed' });
    }
  },

  compareProducts: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const user = UserStore.findById(userId);
      if (!user) return res.status(404).json({ error: 'User profile not found' });

      const { productAId, productBId } = req.body;
      const productA = productsDatabase.find(p => p.id === productAId) || productsDatabase[0];
      const productB = productsDatabase.find(p => p.id === productBId) || productsDatabase[1];

      const comparison = ComparisonEngine.compareProducts(productA, productB, user);
      return res.json(comparison);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Product comparison failed' });
    }
  }
};
