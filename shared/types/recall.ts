export interface FssaiRecallNotice {
  id: string;
  noticeNumber: string;
  productName: string;
  brand: string;
  batchNumbers: string[];
  barcode?: string;
  reason: string;
  hazardLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dateIssued: string;
  affectedRegions: string[];
  actionRequired: string;
  officialNoticeUrl?: string;
}

export interface RecallCheckRequest {
  userId: string;
  scannedBarcodes?: string[];
  scannedProductIds?: string[];
}

export interface UserRecallAlert {
  id: string;
  userId: string;
  recallNoticeId: string;
  productName: string;
  brand: string;
  barcode?: string;
  hazardLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  scannedAt: string;
  alertTriggeredAt: string;
  actionRequired: string;
  isRead: boolean;
}
