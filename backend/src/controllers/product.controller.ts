import { Request, Response } from 'express';
import { productService } from '../services/productService';

export class ProductController {
  public getProductByBarcode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { barcode } = req.params;
      const product = productService.getProductByBarcode(barcode);
      if (!product) {
        res.status(404).json({ success: false, message: `No product found matching barcode ${barcode}` });
        return;
      }
      res.json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = productService.getProductById(id);
      if (!product) {
        res.status(404).json({ success: false, message: `Product ${id} not found` });
        return;
      }
      res.json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const q = (req.query.q as string) || '';
      const results = productService.searchProducts(q);
      res.json({ success: true, count: results.length, data: results });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public parseOcrLabel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { extractedText, productName, brand } = req.body;
      if (!extractedText) {
        res.status(400).json({ success: false, message: 'extractedText is required' });
        return;
      }
      const product = productService.parseOcrText(extractedText, productName, brand);
      res.status(201).json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getAllAdditives = async (_req: Request, res: Response): Promise<void> => {
    try {
      const additives = productService.getAllAdditives();
      res.json({ success: true, count: additives.length, data: additives });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getAdditiveById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const additive = productService.getAdditiveById(id);
      if (!additive) {
        res.status(404).json({ success: false, message: `Additive ${id} not found` });
        return;
      }
      res.json({ success: true, data: additive });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}

export const productController = new ProductController();
