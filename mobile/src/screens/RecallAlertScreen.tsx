import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        return { bg: '#FEF2F2', text: '#991B1B' };
      case 'HIGH':
        return { bg: '#FFF7ED', text: '#9A3412' };
      default:
        return { bg: '#FEFCE8', text: '#713F12' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚨 FSSAI Recall & Safety Center</Text>
        <Text style={styles.subtitle}>
          Retroactive safety warnings for previously scanned packaged foods in India
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'my_alerts' && styles.activeTabBtn]}
          onPress={() => setActiveTab('my_alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'my_alerts' && styles.activeTabText]}>
            ⚠️ My Retroactive Alerts ({userAlerts.filter((a) => !a.isRead).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'all_notices' && styles.activeTabBtn]}
          onPress={() => setActiveTab('all_notices')}
        >
          <Text style={[styles.tabText, activeTab === 'all_notices' && styles.activeTabText]}>
            📜 Official FSSAI Notices ({allNotices.length})
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
                    >
                      <Text style={styles.markReadText}>✓ Acknowledge & Mark Read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No active recall alerts for your scanned items.</Text>
          )}
        </View>
      )}

      {/* Tab 2: All Notices */}
      {activeTab === 'all_notices' && (
        <View style={styles.section}>
          {allNotices.map((notice) => {
            const style = getHazardBadgeStyle(notice.hazardLevel);

            return (
              <View key={notice.id} style={styles.noticeCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.badgeText, { color: style.text }]}>
                      {notice.hazardLevel}
                    </Text>
                  </View>
                  <Text style={styles.noticeNum}>{notice.noticeNumber}</Text>
                </View>

                <Text style={styles.productTitle}>{notice.productName}</Text>
                <Text style={styles.brandText}>Manufacturer: {notice.brand}</Text>
                <Text style={styles.reasonText}>Hazard Description: {notice.reason}</Text>
                <Text style={styles.batchText}>
                  Affected Batches: {notice.batchNumbers.join(', ')}
                </Text>
                <Text style={styles.regionText}>
                  Affected States: {notice.affectedRegions.join(', ')}
                </Text>
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
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabBtn: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
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
    color: '#64748B',
    marginTop: 2,
  },
  reasonText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 6,
    lineHeight: 16,
  },
  actionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
  },
  actionText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
  },
  markReadBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  markReadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticeNum: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  batchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  regionText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 20,
  },
});
