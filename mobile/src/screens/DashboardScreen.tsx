import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PatternIntelligenceWidget } from '../components/PatternIntelligenceWidget';
import { ProgressDashboardCard } from '../components/ProgressDashboardCard';
import { PatternIntelligenceEngine } from '../services/patternService';
import { MOCK_SCAN_HISTORY } from '../services/mockData';

export const DashboardScreen: React.FC = () => {
  const progressData = PatternIntelligenceEngine.calculateProgress(MOCK_SCAN_HISTORY);
  const patternInsights = PatternIntelligenceEngine.generatePatternInsights(MOCK_SCAN_HISTORY);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Health & Scan Intelligence</Text>
        <Text style={styles.subtitle}>
          Track nutrition trends, healthy eating streaks & habit alerts
        </Text>
      </View>

      {/* Feature 6: Progress Dashboard Card */}
      <ProgressDashboardCard progress={progressData} />

      {/* Feature 7: Food Pattern Intelligence Widget */}
      <PatternIntelligenceWidget insights={patternInsights} />

      {/* Recent Scan History List */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>📋 Recent Scan History</Text>
          <Text style={styles.historyCount}>{MOCK_SCAN_HISTORY.length} Items Scanned</Text>
        </View>

        {MOCK_SCAN_HISTORY.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemDate}>
                {new Date(item.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View
              style={[
                styles.itemScoreBadge,
                { backgroundColor: item.score >= 60 ? '#10B981' : '#EF4444' },
              ]}
            >
              <Text style={styles.itemScoreText}>{item.score}</Text>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 1,
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemScoreBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  itemScoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
