import { Router } from 'express';
import { productController } from '../controllers/product.controller';

const router = Router();

// Additives & Intelligence Cards
router.get('/additives', productController.getAllAdditives);
router.get('/additives/:id', productController.getAdditiveById);

// Product Lookup & Search
router.get('/search', productController.searchProducts);
router.get('/barcode/:barcode', productController.getProductByBarcode);
router.get('/:id', productController.getProductById);

// OCR Label Fallback Parser
router.post('/ocr-parse', productController.parseOcrLabel);

export default router;
