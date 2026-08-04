import { ScanHistoryRecord } from '../../../shared/types/analytics';

/**
 * In-memory scan history store, keyed by userId.
 * In production this would be backed by a relational DB (PostgreSQL / MySQL)
 * seeded from the Open Food Facts India dataset and enriched by live user scans.
 */
const scanHistory: Map<string, ScanHistoryRecord[]> = new Map();

// Seed realistic scan history for demo user 'usr-demo-rahul'
// (Hypertension + HighCholesterol | 42 yo male)
const seedRahulHistory = (): ScanHistoryRecord[] => [
  { id: 'scan-001', userId: 'usr-demo-rahul', productId: 'prod-maggi-2min', productName: "Maggi 2-Minute Masala Noodles", brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 1 * 86400000).toISOString(), personalizedScore: 17, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
  { id: 'scan-002', userId: 'usr-demo-rahul', productId: 'prod-lays-magic-masala', productName: "Lay's Magic Masala Chips", brand: 'PepsiCo', category: 'Potato Chips', scannedAt: new Date(Date.now() - 2 * 86400000).toISOString(), personalizedScore: 28, sodiumMg: 240, sugarGrams: 1.2, saturatedFatGrams: 4.1, fiberGrams: 1.0, hasAdditives: true },
  { id: 'scan-003', userId: 'usr-demo-rahul', productId: 'prod-bikaner-local-sev', productName: "Bikaneri Besan Sev", brand: 'Shree Ram Namkeen', category: 'Potato Chips', scannedAt: new Date(Date.now() - 3 * 86400000).toISOString(), personalizedScore: 45, sodiumMg: 310, sugarGrams: 0.5, saturatedFatGrams: 2.5, fiberGrams: 2.5, hasAdditives: false },
  { id: 'scan-004', userId: 'usr-demo-rahul', productId: 'prod-maggi-2min', productName: "Maggi 2-Minute Masala Noodles", brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 4 * 86400000).toISOString(), personalizedScore: 17, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
  { id: 'scan-005', userId: 'usr-demo-rahul', productId: 'prod-muesli-whole-grain', productName: "Whole Grain Millet & Fruit Muesli", brand: 'TrueElements', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 5 * 86400000).toISOString(), personalizedScore: 88, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
  { id: 'scan-006', userId: 'usr-demo-rahul', productId: 'prod-lays-magic-masala', productName: "Lay's Magic Masala Chips", brand: 'PepsiCo', category: 'Potato Chips', scannedAt: new Date(Date.now() - 6 * 86400000).toISOString(), personalizedScore: 28, sodiumMg: 240, sugarGrams: 1.2, saturatedFatGrams: 4.1, fiberGrams: 1.0, hasAdditives: true },
  { id: 'scan-007', userId: 'usr-demo-rahul', productId: 'prod-maggi-2min', productName: "Maggi 2-Minute Masala Noodles", brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 7 * 86400000).toISOString(), personalizedScore: 17, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
  { id: 'scan-008', userId: 'usr-demo-rahul', productId: 'prod-muesli-whole-grain', productName: "Whole Grain Millet & Fruit Muesli", brand: 'TrueElements', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 8 * 86400000).toISOString(), personalizedScore: 88, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
  { id: 'scan-009', userId: 'usr-demo-rahul', productId: 'prod-bikaner-local-sev', productName: "Bikaneri Besan Sev", brand: 'Shree Ram Namkeen', category: 'Potato Chips', scannedAt: new Date(Date.now() - 9 * 86400000).toISOString(), personalizedScore: 45, sodiumMg: 310, sugarGrams: 0.5, saturatedFatGrams: 2.5, fiberGrams: 2.5, hasAdditives: false },
  { id: 'scan-010', userId: 'usr-demo-rahul', productId: 'prod-lays-magic-masala', productName: "Lay's Magic Masala Chips", brand: 'PepsiCo', category: 'Potato Chips', scannedAt: new Date(Date.now() - 10 * 86400000).toISOString(), personalizedScore: 28, sodiumMg: 240, sugarGrams: 1.2, saturatedFatGrams: 4.1, fiberGrams: 1.0, hasAdditives: true }
];

// Seed demo user 2: Priya Patel (Type2Diabetes + Celiac | 34 yo female)
const seedPriyaHistory = (): ScanHistoryRecord[] => [
  { id: 'scan-p01', userId: 'usr-demo-priya', productId: 'prod-muesli-whole-grain', productName: "Whole Grain Millet & Fruit Muesli", brand: 'TrueElements', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 1 * 86400000).toISOString(), personalizedScore: 78, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
  { id: 'scan-p02', userId: 'usr-demo-priya', productId: 'prod-maggi-2min', productName: "Maggi 2-Minute Masala Noodles", brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 2 * 86400000).toISOString(), personalizedScore: 5, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
  { id: 'scan-p03', userId: 'usr-demo-priya', productId: 'prod-muesli-whole-grain', productName: "Whole Grain Millet & Fruit Muesli", brand: 'TrueElements', category: 'Instant Noodles', scannedAt: new Date(Date.now() - 3 * 86400000).toISOString(), personalizedScore: 78, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
];

scanHistory.set('usr-demo-rahul', seedRahulHistory());
scanHistory.set('usr-demo-priya', seedPriyaHistory());

export const ScanHistoryStore = {
  getHistory: (userId: string): ScanHistoryRecord[] => {
    return scanHistory.get(userId) || [];
  },

  addScan: (record: ScanHistoryRecord): void => {
    const history = scanHistory.get(record.userId) || [];
    history.unshift(record);
    scanHistory.set(record.userId, history);
  }
};
