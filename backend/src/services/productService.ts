import fs from 'fs';
import { config } from '../config';
import { Additive, Product, IngredientItem, ManufacturingRationale, IngredientInteractionMap, InteractionNode } from '../../../shared/types';

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
  }
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
      a.id.toLowerCase() === idOrInsCode.toLowerCase() || 
      (a.insCode && a.insCode.toLowerCase() === idOrInsCode.toLowerCase())
    );
  }

  public getProductByBarcode(barcode: string): Product | null {
    const product = mockProductDb.find(p => p.barcode === barcode);
    if (!product) return null;
    return this.enrichProductData(product);
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
      p.ingredientText.toLowerCase().includes(q)
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
        description: add ? add.whatItIs : `Key component in ${product.name}`,
        connectedTo: [purposeNodeId]
      });

      // Purpose & Everyday Shared Foods Node
      nodes.push({
        id: purposeNodeId,
        label: add ? `${add.category}: ${add.whyAdded.slice(0, 35)}...` : (ing.purpose || "Food Ingredient"),
        type: 'purpose',
        description: add ? `Also found in: ${add.commonFoodsFoundIn.join(', ')}` : "Common food building block",
        connectedTo: add ? add.commonFoodsFoundIn.slice(0, 3).map((food, i) => `node-food-${ing.id}-${i}`) : []
      });

      if (add) {
        add.commonFoodsFoundIn.slice(0, 3).forEach((food, i) => {
          nodes.push({
            id: `node-food-${ing.id}-${i}`,
            label: food,
            type: 'food_category',
            description: `Everyday food sharing ${add.name}`,
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
