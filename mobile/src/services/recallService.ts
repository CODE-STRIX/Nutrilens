// Nutri Lens - FSSAI Recall & Safety Alert Service (Person C Scope)

import { FssaiRecallNotice, Product, UserRecallAlert } from '../../../shared/types';

export const SEEDED_RECALL_NOTICES: FssaiRecallNotice[] = [
  {
    id: 'notice_fssai_2026_01',
    noticeNumber: 'FSSAI/ALERT/2026/014',
    productName: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé',
    batchNumbers: ['MG-2026-0881', 'MG-2026-0882', 'MG-2026-0883'],
    barcode: '8901058000053',
    reason: 'Trace lead concentration exceeding permissible limit (2.5 ppm) & undeclared MSG labeling mismatch in regional batch.',
    hazardLevel: 'CRITICAL',
    dateIssued: '2026-02-15',
    affectedRegions: ['Maharashtra', 'Gujarat', 'Delhi NCR', 'Karnataka'],
    actionRequired: 'Do not consume. Return pack to point of purchase for immediate store refund or discard safely.',
    officialNoticeUrl: 'https://fssai.gov.in/alerts/2026/014',
  },
  {
    id: 'notice_fssai_2026_02',
    noticeNumber: 'FSSAI/ALERT/2026/009',
    productName: 'Chilli Namkeen Bhujia',
    brand: 'Haldiram',
    batchNumbers: ['BH-9910', 'BH-9911'],
    barcode: '8904000112233',
    reason: 'Unlabelled peanut allergen cross-contamination detected during production line audit.',
    hazardLevel: 'HIGH',
    dateIssued: '2026-01-28',
    affectedRegions: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh'],
    actionRequired: 'Avoid consumption if you have a peanut allergy or asthma. Contact consumer support for exchange.',
    officialNoticeUrl: 'https://fssai.gov.in/alerts/2026/009',
  },
  {
    id: 'notice_fssai_2026_03',
    noticeNumber: 'FSSAI/ALERT/2026/003',
    productName: 'Spiced Potato Chips (Classic Red)',
    brand: 'Lay\'s',
    batchNumbers: ['LAY-2025-442'],
    barcode: '8901491100012',
    reason: 'Higher than allowed peroxide value in palmolein frying oil batch.',
    hazardLevel: 'MEDIUM',
    dateIssued: '2026-01-10',
    affectedRegions: ['Punjab', 'Haryana'],
    actionRequired: 'Discard if product has rancid smell or bitter taste.',
    officialNoticeUrl: 'https://fssai.gov.in/alerts/2026/003',
  },
];

export const INITIAL_USER_ALERTS: UserRecallAlert[] = [
  {
    id: 'alert_001',
    userId: 'user_001',
    recallNoticeId: 'notice_fssai_2026_01',
    productName: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé',
    barcode: '8901058000053',
    hazardLevel: 'CRITICAL',
    reason: 'Trace lead concentration exceeding permissible limit (2.5 ppm) & undeclared MSG labeling mismatch.',
    scannedAt: '2026-02-10T14:30:00Z',
    alertTriggeredAt: '2026-02-15T09:00:00Z',
    actionRequired: 'Do not consume. Return pack to point of purchase for immediate store refund.',
    isRead: false,
  },
];

export class RecallService {
  private static userAlerts: UserRecallAlert[] = [...INITIAL_USER_ALERTS];

  /**
   * Check if a product has an active FSSAI recall notice
   */
  public static checkRecallForProduct(product: Product): FssaiRecallNotice | null {
    if (!product) return null;
    return (
      SEEDED_RECALL_NOTICES.find(
        (notice) =>
          (product.barcode && notice.barcode === product.barcode) ||
          product.name.toLowerCase().includes(notice.productName.toLowerCase()) ||
          notice.productName.toLowerCase().includes(product.name.toLowerCase())
      ) || null
    );
  }

  /**
   * Get all active alerts for user
   */
  public static getUserRecallAlerts(userId: string): UserRecallAlert[] {
    return this.userAlerts.filter((alert) => alert.userId === userId);
  }

  /**
   * Mark alert as read
   */
  public static markAlertRead(alertId: string): void {
    const alert = this.userAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  /**
   * Get unread alert count
   */
  public static getUnreadCount(userId: string): number {
    return this.userAlerts.filter((a) => a.userId === userId && !a.isRead).length;
  }

  /**
   * Get all official recall notices in system
   */
  public static getAllRecallNotices(): FssaiRecallNotice[] {
    return SEEDED_RECALL_NOTICES;
  }
}
