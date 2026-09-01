import fs from 'fs';
import https from 'https';
import http from 'http';
import { config } from '../config';
import { Additive, Product, IngredientItem, ManufacturingRationale, IngredientInteractionMap, InteractionNode } from '../../../shared/types';

import path from 'path';

// Seed data from the shared data folder — try multiple path roots (mirrors config/index.ts strategy)
function loadIndianFoodProducts(): Product[] {
  const candidates = [
    path.resolve(process.cwd(), '../data/indian-food-products.json'),
    path.resolve(process.cwd(), 'data/indian-food-products.json'),
    path.resolve(__dirname, '../../../data/indian-food-products.json'),
    path.resolve(__dirname, '../../../../data/indian-food-products.json'),
  ];
  for (const p of candidates) {
    try {
      if (require('fs').existsSync(p)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(p) as Product[];
      }
    } catch { /* ignore */ }
  }
  console.warn('[productService] Could not find indian-food-products.json — skipping seed.');
  return [];
}

// In-memory seed database of initial products
let mockProductDb: Product[] = [
  {
    id: "PROD-8901234567890",
    barcode: "8901234567890",
    name: "Crunchy Masala Noodle Snack",
    brand: "TastyBites",
    category: "Instant Noodles & Snacks",
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500",
    ingredientText: "Refined Wheat Flour (Maida), Palmolein Oil, Iodised Salt, Spices & Condiments (Onion Powder, Garlic Powder, Chilli), Monosodium Glutamate (INS 621), Tartrazine (INS 102), Sodium Benzoate (INS 211), Acidity Regulator (INS 330).",
    ingredients: [
      { id: "ing-1", name: "Refined Wheat Flour (Maida)", isAdditive: false, purpose: "Base structure and carbohydrates" },
      { id: "ing-2", name: "Palmolein Oil", isAdditive: true, additiveId: "PALM_OIL", purpose: "Frying fat and crispness", healthFlag: "caution" },
      { id: "ing-3", name: "Iodised Salt", isAdditive: false, purpose: "Flavor and essential sodium" },
      { id: "ing-4", name: "Monosodium Glutamate", isAdditive: true, additiveId: "INS_621", purpose: "Umami flavor enhancement", healthFlag: "caution" },
      { id: "ing-5", name: "Tartrazine", isAdditive: true, additiveId: "INS_102", purpose: "Synthetic yellow food coloring", healthFlag: "warning" },
      { id: "ing-6", name: "Sodium Benzoate", isAdditive: true, additiveId: "INS_211", purpose: "Preservative extending shelf life", healthFlag: "caution" },
      { id: "ing-7", name: "Citric Acid", isAdditive: true, additiveId: "INS_330", purpose: "Acidity regulator & flavor balance", healthFlag: "safe" }
    ],
    additives: [],
    manufacturingRationale: [],
    verificationStatus: "verified",
    overallScore: 42,
    createdAt: "2026-08-01T10:00:00Z"
  },
  {
    id: "PROD-8909876543210",
    barcode: "8909876543210",
    name: "Creamy Almond Milk Shake 200ml",
    brand: "NutriFlow",
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500",
    ingredientText: "Water, Almond Paste (8%), Sugar, Soy Lecithin (INS 322), Xanthan Gum (INS 415), Potassium Sorbate (INS 202), Natural Flavors.",
    ingredients: [
      { id: "ing-10", name: "Water", isAdditive: false, purpose: "Liquid base" },
      { id: "ing-11", name: "Almond Paste", isAdditive: false, purpose: "Nutrient source & flavor base" },
      { id: "ing-12", name: "Sugar", isAdditive: false, purpose: "Sweetening" },
      { id: "ing-13", name: "Soy Lecithin", isAdditive: true, additiveId: "INS_322", purpose: "Emulsifier blending oil and water", healthFlag: "safe" },
      { id: "ing-14", name: "Xanthan Gum", isAdditive: true, additiveId: "INS_415", purpose: "Thickener & stabilizer", healthFlag: "safe" },
      { id: "ing-15", name: "Potassium Sorbate", isAdditive: true, additiveId: "INS_202", purpose: "Preservative preventing mold", healthFlag: "safe" }
    ],
    additives: [],
    manufacturingRationale: [],
    verificationStatus: "verified",
    overallScore: 78,
    createdAt: "2026-08-02T12:00:00Z"
  },
  // Seed from shared data/indian-food-products.json (real barcodes: Maggi, Lays, etc.)
  ...loadIndianFoodProducts()
];

export class ProductService {
  private additivesKnowledgeBase: Additive[] = [];

  constructor() {
    this.loadAdditivesKnowledgeBase();
  }

  private loadAdditivesKnowledgeBase(): void {
    try {
      if (fs.existsSync(config.additiveKnowledgeBasePath)) {
        const raw = fs.readFileSync(config.additiveKnowledgeBasePath, 'utf-8');
        this.additivesKnowledgeBase = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load additive knowledge base:', err);
      this.additivesKnowledgeBase = [];
    }
  }

  public getAllAdditives(): Additive[] {
    if (this.additivesKnowledgeBase.length === 0) {
      this.loadAdditivesKnowledgeBase();
    }
    return this.additivesKnowledgeBase;
  }

  public getAdditiveById(idOrInsCode: string): Additive | undefined {
    const list = this.getAllAdditives();
    return list.find(a => 
      (a.id && a.id.toLowerCase() === idOrInsCode.toLowerCase()) || 
      (a.insCode && a.insCode.toLowerCase() === idOrInsCode.toLowerCase())
    );
  }

  public getProductByBarcode(barcode: string): Product | null {
    const local = mockProductDb.find(p => p.barcode === barcode);
    if (local) return this.enrichProductData(local);
    return null; // Sync path; use getProductByBarcodeWithFallback for async OFF lookup
  }

  /**
   * Async barcode lookup: checks local DB first, then falls back to Open Food Facts.
   * Called by the controller when the sync lookup returns null.
   */
  public async getProductByBarcodeWithFallback(barcode: string): Promise<Product | null> {
    // 1. Try local DB first (instant)
    const local = mockProductDb.find(p => p.barcode === barcode);
    if (local) return this.enrichProductData(local);

    // 2. Fall back to Open Food Facts API
    console.log(`[OFF] Barcode ${barcode} not in local DB — querying Open Food Facts...`);
    try {
      const offProduct = await this.fetchFromOpenFoodFacts(barcode);
      if (offProduct) {
        // Cache in local DB so subsequent lookups are instant
        mockProductDb.push(offProduct);
        console.log(`[OFF] ✅ Found "${offProduct.name}" from Open Food Facts, cached locally.`);
        return this.enrichProductData(offProduct);
      }
    } catch (err: any) {
      console.error(`[OFF] Failed to fetch barcode ${barcode} from Open Food Facts:`, err.message);
    }

    return null;
  }

  /** Fetches a product from the Open Food Facts v2 API and maps it to our Product type. */
  private fetchFromOpenFoodFacts(barcode: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,brands,categories_tags,image_url,ingredients_text,ingredients,nutriments,quantity`;
      const transport = url.startsWith('https') ? https : http;

      const req = transport.get(url, { headers: { 'User-Agent': 'NutriLens-SIH2026/1.0 (codestrix@example.com)' } }, (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            if (json.status !== 1 || !json.product) {
              resolve(null);
              return;
            }
            resolve(this.mapOffProductToInternal(barcode, json.product));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(8000, () => { req.destroy(); reject(new Error('Open Food Facts request timed out')); });
    });
  }

  /** Maps a raw Open Food Facts product JSON to our internal Product shape. */
  private mapOffProductToInternal(barcode: string, off: any): Product {
    const knownAdditives = this.getAllAdditives();

    // Parse ingredient list from OFF
    const rawIngredients: any[] = off.ingredients || [];
    const ingredients: IngredientItem[] = rawIngredients.map((ing: any, idx: number) => {
      const ingName: string = ing.text || ing.id || `Ingredient ${idx + 1}`;
      // Try to match against our additive knowledge base via INS code
      const insMatch = ingName.match(/INS\s*(\d+[a-z]?)/i) || ingName.match(/E(\d{3,4}[a-z]?)/i);
      let matchedAdditive: Additive | undefined;
      if (insMatch) {
        const code = `INS_${insMatch[1].toUpperCase()}`;
        matchedAdditive = knownAdditives.find(a => a.insCode?.toLowerCase() === code.toLowerCase() || a.id?.toLowerCase() === code.toLowerCase());
      }
      if (!matchedAdditive) {
        matchedAdditive = knownAdditives.find(a => ingName.toLowerCase().includes(a.name.toLowerCase()));
      }

      return {
        id: `off-ing-${idx}`,
        name: ingName,
        isAdditive: !!matchedAdditive || ing.vegan === 'no',
        additiveId: matchedAdditive?.id,
        purpose: matchedAdditive?.whyAdded || ing.processing || 'Food component',
        healthFlag: matchedAdditive
          ? (matchedAdditive.hazardRating === 'High Risk' ? 'warning' : matchedAdditive.hazardRating === 'Caution' ? 'caution' : 'safe')
          : 'safe'
      } as IngredientItem;
    });

    // If OFF didn't return structured ingredients, fall back to raw text parsing
    if (ingredients.length === 0 && off.ingredients_text) {
      const tempProduct = this.parseOcrText(off.ingredients_text);
      ingredients.push(...tempProduct.ingredients);
    }

    const n = off.nutriments || {};
    const productName = off.product_name || off.product_name_en || 'Unknown Product';
    const brand = off.brands || 'Unknown Brand';
    const category = (off.categories_tags?.[0] || 'packaged-foods')
      .replace('en:', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const product: Product = {
      id: `OFF-${barcode}`,
      barcode,
      name: productName,
      brand,
      category,
      imageUrl: off.image_url || off.image_front_url,
      ingredientText: off.ingredients_text || '',
      ingredients,
      additives: [],
      manufacturingRationale: [],
      nutrition: {
        servingSize: off.quantity || '100g',
        calories: n['energy-kcal_100g'] ?? n['energy-kcal'] ?? 0,
        totalFatGrams: n.fat_100g ?? 0,
        saturatedFatGrams: n['saturated-fat_100g'] ?? 0,
        transFatGrams: n['trans-fat_100g'] ?? 0,
        sodiumMg: (n.sodium_100g ?? 0) * 1000, // OFF stores sodium in grams
        totalCarbsGrams: n.carbohydrates_100g ?? 0,
        sugarGrams: n.sugars_100g ?? 0,
        addedSugarGrams: n['added-sugars_100g'] ?? 0,
        fiberGrams: n.fiber_100g ?? 0,
        proteinGrams: n.proteins_100g ?? 0
      },
      overallBaseScore: Math.max(0, Math.min(100, 100 - Math.round(
        (n.sodium_100g ?? 0) * 50 +
        (n['saturated-fat_100g'] ?? 0) * 4 +
        (n.sugars_100g ?? 0) * 2
      ))),
      isCommunitySubmitted: false,
      verificationStatus: 'verified',
      createdAt: new Date().toISOString()
    };

    return product;
  }

  public getProductById(id: string): Product | null {
    const product = mockProductDb.find(p => p.id === id);
    if (!product) return null;
    return this.enrichProductData(product);
  }

  public searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    const matches = mockProductDb.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.ingredientText && p.ingredientText.toLowerCase().includes(q))
    );
    return matches.map(p => this.enrichProductData(p));
  }

  /**
   * On-device OCR Fallback Parser
   * Parses raw OCR extracted label text for products without a barcode or unlisted items
   */
  public parseOcrText(extractedText: string, productName?: string, brand?: string): Product {
    const knownAdditives = this.getAllAdditives();
    const detectedAdditives: Additive[] = [];
    const ingredientsList: IngredientItem[] = [];

    // Simple parser detecting common keywords and INS codes in text
    const words = extractedText.split(/[,;\n\.]+/);
    let index = 1;

    for (const rawSegment of words) {
      const segment = rawSegment.trim();
      if (!segment) continue;

      let matchedAdditive: Additive | undefined;

      for (const additive of knownAdditives) {
        if (
          (additive.insCode && segment.toLowerCase().includes(additive.insCode.toLowerCase())) ||
          segment.toLowerCase().includes(additive.name.toLowerCase()) ||
          (additive.id && segment.toLowerCase().includes(additive.id.toLowerCase()))
        ) {
          matchedAdditive = additive;
          if (!detectedAdditives.some(a => a.id === additive.id)) {
            detectedAdditives.push(additive);
          }
          break;
        }
      }

      ingredientsList.push({
        id: `ocr-ing-${index++}`,
        name: segment,
        isAdditive: !!matchedAdditive,
        additiveId: matchedAdditive?.id,
        purpose: matchedAdditive?.whyAdded || "Ingredient component",
        healthFlag: matchedAdditive 
          ? (matchedAdditive.frequencySafety === 'Limit consumption' ? 'caution' : matchedAdditive.frequencySafety === 'Avoid if sensitive' ? 'warning' : 'safe')
          : 'safe'
      });
    }

    const newProduct: Product = {
      id: `OCR-PROD-${Date.now()}`,
      name: productName || "OCR Scanned Snack",
      brand: brand || "Local / Regional Brand",
      category: "Uncategorized Packaged Food",
      ingredientText: extractedText,
      ingredients: ingredientsList,
      additives: detectedAdditives,
      manufacturingRationale: this.generateManufacturingRationale(ingredientsList, detectedAdditives),
      isCommunitySubmitted: true,
      verificationStatus: "unverified",
      createdAt: new Date().toISOString()
    };

    // Add to in-memory db
    mockProductDb.push(newProduct);

    return this.enrichProductData(newProduct);
  }

  public addProductToDb(product: Product): Product {
    mockProductDb.push(product);
    return this.enrichProductData(product);
  }

  /**
   * Enriches a product with interactive additive cards, manufacturing rationale, and interaction maps
   */
  private enrichProductData(product: Product): Product {
    const additivesMap = this.getAllAdditives();
    const enrichedAdditives: Additive[] = [];

    for (const ing of product.ingredients) {
      if (ing.isAdditive && ing.additiveId) {
        const add = additivesMap.find(a => a.id === ing.additiveId);
        if (add && !enrichedAdditives.some(a => a.id === add.id)) {
          enrichedAdditives.push(add);
        }
      }
    }

    const rationale = this.generateManufacturingRationale(product.ingredients, enrichedAdditives);
    const interactionMap = this.generateInteractionMap(product, enrichedAdditives);

    return {
      ...product,
      additives: enrichedAdditives,
      manufacturingRationale: rationale,
      interactionMap
    };
  }

  /**
   * Generates Feature 4: Food Manufacturing Transparency (Why an ingredient was chosen)
   */
  private generateManufacturingRationale(ingredients: IngredientItem[], additives: Additive[]): ManufacturingRationale[] {
    const rationales: ManufacturingRationale[] = [];

    for (const ing of ingredients) {
      if (ing.additiveId) {
        const add = additives.find(a => a.id === ing.additiveId);
        if (add) {
          let primaryReason: 'cost' | 'texture' | 'shelf_life' | 'flavor' | 'appearance' = 'shelf_life';
          if (add.category === 'Preservative') primaryReason = 'shelf_life';
          else if (add.category === 'Fat/Oil') primaryReason = 'cost';
          else if (add.category === 'Flavor Enhancer') primaryReason = 'flavor';
          else if (add.category === 'Color') primaryReason = 'appearance';
          else if (add.category === 'Emulsifier' || add.category === 'Stabilizer') primaryReason = 'texture';

          rationales.push({
            ingredientId: ing.id,
            ingredientName: ing.name,
            primaryReason,
            explanation: `Manufacturer selected ${ing.name} (${add.insCode || 'Additive'}): ${add.whyAdded}`
          });
        }
      } else if (ing.name.toLowerCase().includes('palmolein') || ing.name.toLowerCase().includes('palm oil')) {
        rationales.push({
          ingredientId: ing.id,
          ingredientName: ing.name,
          primaryReason: 'cost',
          explanation: 'Palm oil provides heat stability during high-volume commercial deep frying at ~40% lower cost than liquid vegetable oils.'
        });
      }
    }

    return rationales;
  }

  /**
   * Generates Feature 3: Ingredient Interaction Map
   * Connects ingredients to their purpose and to other everyday foods that share them
   */
  private generateInteractionMap(product: Product, additives: Additive[]): IngredientInteractionMap {
    const nodes: InteractionNode[] = [];

    // Center Node: Product
    nodes.push({
      id: `node-${product.id}`,
      label: product.name,
      type: 'food_category',
      description: `Scanned Product (${product.brand})`,
      connectedTo: product.ingredients.slice(0, 6).map(i => `node-ing-${i.id}`)
    });

    // Ingredient & Purpose Nodes
    for (const ing of product.ingredients.slice(0, 6)) {
      const add = ing.additiveId ? additives.find(a => a.id === ing.additiveId) : undefined;

      const purposeNodeId = `node-purpose-${ing.id}`;
      nodes.push({
        id: `node-ing-${ing.id}`,
        label: ing.name,
        type: 'ingredient',
        description: add && add.whatItIs ? add.whatItIs : `Key component in ${product.name}`,
        connectedTo: [purposeNodeId]
      });

      // Purpose & Everyday Shared Foods Node
      const commonFoods = add && add.commonFoodsFoundIn ? add.commonFoodsFoundIn : [];
      nodes.push({
        id: purposeNodeId,
        label: add ? `${add.category}: ${(add.whyAdded || add.description || '').slice(0, 35)}...` : (ing.purpose || "Food Ingredient"),
        type: 'purpose',
        description: commonFoods.length > 0 ? `Also found in: ${commonFoods.join(', ')}` : "Common food building block",
        connectedTo: commonFoods.slice(0, 3).map((food, i) => `node-food-${ing.id}-${i}`)
      });

      if (commonFoods.length > 0) {
        commonFoods.slice(0, 3).forEach((food, i) => {
          nodes.push({
            id: `node-food-${ing.id}-${i}`,
            label: food,
            type: 'food_category',
            description: `Everyday food sharing ${add?.name || ing.name}`,
            connectedTo: []
          });
        });
      }
    }

    return {
      productId: product.id,
      nodes
    };
  }
}

export const productService = new ProductService();
