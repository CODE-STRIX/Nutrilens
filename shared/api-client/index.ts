import { Product, Additive, FssaiRecallNotice, UserRecallAlert, CommunitySubmission } from '../types';

export class NutriLensApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  // --- Product & Ingredient Intelligence ---
  public async getProductByBarcode(barcode: string): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/products/barcode/${barcode}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Product lookup failed');
    return data.data;
  }

  public async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/products/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Product lookup failed');
    return data.data;
  }

  public async searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(`${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Product search failed');
    return data.data;
  }

  public async parseOcrLabel(extractedText: string, productName?: string, brand?: string): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/products/ocr-parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractedText, productName, brand })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'OCR parsing failed');
    return data.data;
  }

  public async getAllAdditives(): Promise<Additive[]> {
    const res = await fetch(`${this.baseUrl}/products/additives`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch additives');
    return data.data;
  }

  // --- Recall & Ban Alert Engine ---
  public async getRecallNotices(): Promise<FssaiRecallNotice[]> {
    const res = await fetch(`${this.baseUrl}/recalls/notices`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch recall notices');
    return data.data;
  }

  public async getUserRecallAlerts(userId: string = 'user_default'): Promise<UserRecallAlert[]> {
    const res = await fetch(`${this.baseUrl}/recalls/alerts?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch user recall alerts');
    return data.data;
  }

  public async triggerRecallCheck(userId: string = 'user_default'): Promise<UserRecallAlert[]> {
    const res = await fetch(`${this.baseUrl}/recalls/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Recall check failed');
    return data.data;
  }

  // --- Community Verification ---
  public async getCommunitySubmissions(): Promise<CommunitySubmission[]> {
    const res = await fetch(`${this.baseUrl}/community/submissions`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch community submissions');
    return data.data;
  }

  public async submitCommunityProduct(payload: {
    submitterId: string;
    productName: string;
    brand: string;
    category?: string;
    ingredientText: string;
    barcode?: string;
    labelImageUrl?: string;
    region?: string;
  }): Promise<CommunitySubmission> {
    const res = await fetch(`${this.baseUrl}/community/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Community submission failed');
    return data.data;
  }

  public async verifyCommunitySubmission(payload: {
    submissionId: string;
    userId: string;
    confirmMatch: boolean;
    corrections?: any;
  }): Promise<{ submission: CommunitySubmission; promotedProduct?: Product }> {
    const res = await fetch(`${this.baseUrl}/community/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Community verification failed');
    return { submission: data.data, promotedProduct: data.promotedProduct };
  }
}
