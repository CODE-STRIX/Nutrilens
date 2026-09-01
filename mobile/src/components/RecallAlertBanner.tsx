import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NutriIcon } from './NutriIcon';
import { FssaiRecallNotice } from '../../../shared/types';

interface Props {
  recallNotice: FssaiRecallNotice;
}

export const RecallAlertBanner: React.FC<Props> = ({ recallNotice }) => {
  const getHazardStyle = (level: FssaiRecallNotice['hazardLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', badge: '#DC2626' };
      case 'HIGH':
        return { bg: '#FFF7ED', border: '#F97316', text: '#9A3412', badge: '#EA580C' };
      default:
        return { bg: '#FEFCE8', border: '#EAB308', text: '#713F12', badge: '#CA8A04' };
    }
  };

  const style = getHazardStyle(recallNotice.hazardLevel);

  return (
    <View style={[styles.bannerContainer, { backgroundColor: style.bg, borderColor: style.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.hazardBadge, { backgroundColor: style.badge }]}>
          <NutriIcon name="recall" size={12} color="#FFFFFF" />
          <Text style={styles.hazardBadgeText}> FSSAI RECALL: {recallNotice.hazardLevel}</Text>
        </View>
        <Text style={styles.noticeNumber}>{recallNotice.noticeNumber}</Text>
      </View>

      <Text style={[styles.reasonTitle, { color: style.text }]}>
        Official Recall Reason:
      </Text>
      <Text style={styles.reasonBody}>{recallNotice.reason}</Text>

      {recallNotice.batchNumbers && recallNotice.batchNumbers.length > 0 && (
        <Text style={styles.batchInfo}>
          Affected Batches: {recallNotice.batchNumbers.join(', ')}
        </Text>
      )}

      <View style={styles.actionBox}>
        <View style={styles.actionTitleRow}>
          <NutriIcon name="alert" size={12} color="#991B1B" />
          <Text style={styles.actionTitle}> Required Consumer Action:</Text>
        </View>
        <Text style={styles.actionBody}>{recallNotice.actionRequired}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hazardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hazardBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  noticeNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  reasonBody: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
    lineHeight: 16,
  },
  batchInfo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  actionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
  },
  actionBody: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
});
