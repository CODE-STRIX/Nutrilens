import fs from 'fs';
import { config } from '../config';
import { Additive, IngredientItem } from '../../../shared/types';

export interface ParsedOcrResult {
  rawText: string;
  extractedIngredients: IngredientItem[];
  detectedINSAdditives: Additive[];
  detectedAllergens: string[];
  confidenceScore: number;
}

export class OcrIngredientParser {
  private additivesKB: Additive[] = [];

  constructor() {
    this.loadAdditivesKnowledgeBase();
  }

  private loadAdditivesKnowledgeBase(): void {
    try {
      if (fs.existsSync(config.additiveKnowledgeBasePath)) {
        const raw = fs.readFileSync(config.additiveKnowledgeBasePath, 'utf-8');
        this.additivesKB = JSON.parse(raw);
      }
    } catch (err) {
      console.error('[OCR/NLP ML Model] Failed to load additives KB:', err);
      this.additivesKB = [];
    }
  }

  /**
   * Model 1 & 2: Text Normalization + NER & Additive Normalization Engine
   */
  public parseLabelText(rawOcrText: string): ParsedOcrResult {
    if (!rawOcrText || rawOcrText.trim().length === 0) {
      return {
        rawText: '',
        extractedIngredients: [],
        detectedINSAdditives: [],
        detectedAllergens: [],
        confidenceScore: 0
      };
    }

    // 1. Text Normalization
    const normalizedText = rawOcrText
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 2. Tokenize ingredient list segments (split by comma, semicolon, or period)
    const rawTokens = normalizedText
      .split(/[,;\.]/)
      .map(t => t.trim())
      .filter(t => t.length > 1);

    const extractedIngredients: IngredientItem[] = [];
    const detectedINSAdditives: Additive[] = [];
    const detectedAllergensSet = new Set<string>();

    const knownAllergenKeywords = [
      { key: 'peanut', name: 'Peanuts' },
      { key: 'groundnut', name: 'Peanuts' },
      { key: 'wheat', name: 'Gluten' },
      { key: 'maida', name: 'Gluten' },
      { key: 'soy', name: 'Soy' },
      { key: 'soya', name: 'Soy' },
      { key: 'milk', name: 'Dairy' },
      { key: 'whey', name: 'Dairy' },
      { key: 'cheese', name: 'Dairy' },
      { key: 'cashew', name: 'Tree Nuts' },
      { key: 'almond', name: 'Tree Nuts' },
      { key: 'sulfite', name: 'Sulfites' },
      { key: 'sulphite', name: 'Sulfites' }
    ];

    // 3. NER Entity Resolution
    rawTokens.forEach((token, index) => {
      const lowerToken = token.toLowerCase();

      // Check INS / E code pattern (e.g. INS 211, E211, INS-621, 621)
      const insMatch = token.match(/(?:INS|E)\s*[-:]?\s*(\d{3,4}[a-z]?)/i);
      let matchedAdditive: Additive | undefined;

      if (insMatch) {
        const codeNum = insMatch[1];
        matchedAdditive = this.additivesKB.find(a => 
          (a.insCode && a.insCode.includes(codeNum)) ||
          (a.code && a.code.includes(codeNum))
        );
      } else {
        // Fuzzy / Substring matching against additive names
        matchedAdditive = this.additivesKB.find(a => 
          lowerToken.includes(a.name.toLowerCase())
        );
      }

      // Check Allergen Keywords
      knownAllergenKeywords.forEach(ak => {
        if (lowerToken.includes(ak.key)) {
          detectedAllergensSet.add(ak.name);
        }
      });

      const isAdditive = !!matchedAdditive;
      if (matchedAdditive && !detectedINSAdditives.some(a => a.name === matchedAdditive!.name)) {
        detectedINSAdditives.push(matchedAdditive);
      }

      let healthFlag: 'safe' | 'caution' | 'warning' = 'safe';
      if (matchedAdditive) {
        if (matchedAdditive.hazardRating === 'High Risk') healthFlag = 'warning';
        else if (matchedAdditive.hazardRating === 'Caution') healthFlag = 'caution';
      }

      extractedIngredients.push({
        id: `ocr-ing-${index + 1}`,
        name: token,
        isAdditive,
        insCode: insMatch ? `INS ${insMatch[1]}` : undefined,
        additiveId: matchedAdditive ? (matchedAdditive.insCode || matchedAdditive.id) : undefined,
        purpose: matchedAdditive ? matchedAdditive.category : 'Food Ingredient',
        additiveDetails: matchedAdditive,
        healthFlag
      });
    });

    const confidenceScore = Math.min(
      0.95,
      0.5 + (extractedIngredients.length * 0.05) + (detectedINSAdditives.length * 0.08)
    );

    return {
      rawText: rawOcrText,
      extractedIngredients,
      detectedINSAdditives,
      detectedAllergens: Array.from(detectedAllergensSet),
      confidenceScore: Math.round(confidenceScore * 100) / 100
    };
  }
}

export const ocrIngredientParser = new OcrIngredientParser();
