import fs from 'fs';
import { config } from '../../config';
import { FssaiRecallNotice, UserRecallAlert } from '../../../../shared/types';

// Mock user scan history store (maps userId -> array of scanned product barcodes & scan timestamps)
interface ScanRecord {
  productId: string;
  barcode?: string;
  productName: string;
  brand: string;
  scannedAt: string;
}

const mockUserScanHistory: Record<string, ScanRecord[]> = {
  "user_default": [
    {
      productId: "PROD-8901234567890",
      barcode: "8901234567890",
      productName: "Crunchy Masala Noodle Snack",
      brand: "TastyBites",
      scannedAt: "2026-07-20T14:30:00Z"
    },
    {
      productId: "PROD-8909876543210",
      barcode: "8909876543210",
      productName: "Creamy Almond Milk Shake 200ml",
      brand: "NutriFlow",
      scannedAt: "2026-07-10T09:15:00Z"
    }
  ]
};

// In-memory triggered alerts store
let mockTriggeredAlerts: UserRecallAlert[] = [];

export class RecallService {
  private recallNotices: FssaiRecallNotice[] = [];

  constructor() {
    this.loadRecallNotices();
  }

  public loadRecallNotices(): FssaiRecallNotice[] {
    try {
      if (fs.existsSync(config.fssaiRecallSeedPath)) {
        const raw = fs.readFileSync(config.fssaiRecallSeedPath, 'utf-8');
        this.recallNotices = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load FSSAI recall seed notices:', err);
      this.recallNotices = [];
    }
    return this.recallNotices;
  }

  public getAllRecallNotices(): FssaiRecallNotice[] {
    if (this.recallNotices.length === 0) {
      this.loadRecallNotices();
    }
    return this.recallNotices;
  }

  /**
   * Adds a scan to user history and runs retroactive recall check
   */
  public logUserScan(userId: string, scan: ScanRecord): UserRecallAlert[] {
    if (!mockUserScanHistory[userId]) {
      mockUserScanHistory[userId] = [];
    }
    mockUserScanHistory[userId].push(scan);
    return this.checkRetroactiveRecallsForUser(userId);
  }

  /**
   * Flagship Feature 11: Recall & Ban Alert Engine
   * Retroactively checks user scan history against all active FSSAI recall notices
   */
  public checkRetroactiveRecallsForUser(userId: string): UserRecallAlert[] {
    const scans = mockUserScanHistory[userId] || mockUserScanHistory["user_default"] || [];
    const notices = this.getAllRecallNotices();
    const newAlerts: UserRecallAlert[] = [];

    for (const scan of scans) {
      for (const notice of notices) {
        const barcodeMatch = scan.barcode && notice.barcode && scan.barcode === notice.barcode;
        const nameMatch = scan.productName.toLowerCase() === notice.productName.toLowerCase() && scan.brand.toLowerCase() === notice.brand.toLowerCase();

        if (barcodeMatch || nameMatch) {
          // Check if alert already created
          const exists = mockTriggeredAlerts.some(
            a => a.userId === userId && a.recallNoticeId === notice.id
          );

          if (!exists) {
            const alert: UserRecallAlert = {
              id: `ALERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId,
              recallNoticeId: notice.id,
              productName: scan.productName,
              brand: scan.brand,
              barcode: scan.barcode,
              hazardLevel: notice.hazardLevel,
              reason: notice.reason,
              scannedAt: scan.scannedAt,
              alertTriggeredAt: new Date().toISOString(),
              actionRequired: notice.actionRequired,
              isRead: false
            };
            mockTriggeredAlerts.push(alert);
            newAlerts.push(alert);
          }
        }
      }
    }

    return this.getUserAlerts(userId);
  }

  public getUserAlerts(userId: string): UserRecallAlert[] {
    // Run retroactive check first to ensure fresh data
    const notices = this.getAllRecallNotices();
    const scans = mockUserScanHistory[userId] || mockUserScanHistory["user_default"] || [];

    for (const scan of scans) {
      for (const notice of notices) {
        if ((scan.barcode && notice.barcode && scan.barcode === notice.barcode) ||
            (scan.productName.toLowerCase() === notice.productName.toLowerCase())) {
          if (!mockTriggeredAlerts.some(a => a.userId === userId && a.recallNoticeId === notice.id)) {
            mockTriggeredAlerts.push({
              id: `ALERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId,
              recallNoticeId: notice.id,
              productName: scan.productName,
              brand: scan.brand,
              barcode: scan.barcode,
              hazardLevel: notice.hazardLevel,
              reason: notice.reason,
              scannedAt: scan.scannedAt,
              alertTriggeredAt: new Date().toISOString(),
              actionRequired: notice.actionRequired,
              isRead: false
            });
          }
        }
      }
    }

    return mockTriggeredAlerts.filter(a => a.userId === userId || userId === 'user_default');
  }

  public markAlertAsRead(alertId: string): boolean {
    const alert = mockTriggeredAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return true;
    }
    return false;
  }
}

export const recallService = new RecallService();
