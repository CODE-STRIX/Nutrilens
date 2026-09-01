import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NutriIcon } from '../components/NutriIcon';
import { FssaiRecallNotice, UserRecallAlert } from '../../../shared/types';
import { RecallService } from '../services/recallService';

export const RecallAlertScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my_alerts' | 'all_notices'>('my_alerts');
  const [userAlerts, setUserAlerts] = useState<UserRecallAlert[]>(
    RecallService.getUserRecallAlerts('user_001')
  );
  const allNotices = RecallService.getAllRecallNotices();

  const handleMarkRead = (id: string) => {
    RecallService.markAlertRead(id);
    setUserAlerts(RecallService.getUserRecallAlerts('user_001'));
  };

  const getHazardBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'HIGH':
        return { bg: '#FFEDD5', text: '#9A3412' };
      default:
        return { bg: '#FEF3C7', text: '#713F12' };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <NutriIcon name="recall" size={24} color="#EF4444" />
          <Text style={styles.title}> FSSAI Recall & Safety Center</Text>
        </View>
        <Text style={styles.subtitle}>
          Retroactive safety warnings for previously scanned packaged foods in India
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'my_alerts' && styles.activeTabBtn]}
          onPress={() => setActiveTab('my_alerts')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'my_alerts' && styles.activeTabText]}>
            My Retroactive Alerts ({userAlerts.filter((a) => !a.isRead).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'all_notices' && styles.activeTabBtn]}
          onPress={() => setActiveTab('all_notices')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'all_notices' && styles.activeTabText]}>
            Official FSSAI Notices ({allNotices.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: User Alerts */}
      {activeTab === 'my_alerts' && (
        <View style={styles.section}>
          {userAlerts.length > 0 ? (
            userAlerts.map((alert) => {
              const style = getHazardBadgeStyle(alert.hazardLevel);

              return (
                <View
                  key={alert.id}
                  style={[styles.alertCard, !alert.isRead && styles.unreadCard]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: style.bg }]}>
                      <Text style={[styles.badgeText, { color: style.text }]}>
                        {alert.hazardLevel} RECALL
                      </Text>
                    </View>
                    {!alert.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.productTitle}>{alert.productName}</Text>
                  <Text style={styles.brandText}>Brand: {alert.brand}</Text>
                  <Text style={styles.reasonText}>Reason: {alert.reason}</Text>

                  <View style={styles.actionBox}>
                    <Text style={styles.actionTitle}>🛑 Action Required:</Text>
                    <Text style={styles.actionText}>{alert.actionRequired}</Text>
                  </View>

                  {!alert.isRead && (
                    <TouchableOpacity
                      style={styles.markReadBtn}
                      onPress={() => handleMarkRead(alert.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.markReadText}>✓ Acknowledge & Mark Read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active recall warnings for your scanned items.</Text>
            </View>
          )}
        </View>
      )}

      {/* Tab 2: All FSSAI Notices */}
      {activeTab === 'all_notices' && (
        <View style={styles.section}>
          {allNotices.map((notice) => {
            const style = getHazardBadgeStyle(notice.hazardLevel);
            const noticeDate = (notice as any).noticeDate || notice.dateIssued;
            const batches = notice.batchNumbers || (notice as any).affectedBatches || [];

            return (
              <View key={notice.id} style={styles.noticeCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.badgeText, { color: style.text }]}>
                      FSSAI NOTICE • {notice.hazardLevel}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{noticeDate}</Text>
                </View>

                <Text style={styles.productTitle}>{notice.productName}</Text>
                <Text style={styles.brandText}>Manufacturer: {notice.brand || 'National Brands'}</Text>
                <Text style={styles.reasonText}>Hazard: {notice.reason}</Text>

                <View style={styles.lotBox}>
                  <Text style={styles.lotText}>Affected Lots: {batches.join(', ')}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabBtn: {
    backgroundColor: '#0D9488',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 2,
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
    marginTop: 6,
    lineHeight: 18,
  },
  actionBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  actionText: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 2,
  },
  markReadBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  markReadText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  lotBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  lotText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
