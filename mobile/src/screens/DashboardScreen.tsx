import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NutriIcon } from '../components/NutriIcon';
import { PatternIntelligenceWidget } from '../components/PatternIntelligenceWidget';
import { ProgressDashboardCard } from '../components/ProgressDashboardCard';
import { PatternIntelligenceEngine } from '../services/patternService';
import { MlService, MlPatternResult } from '../services/mlService';
import { MOCK_SCAN_HISTORY } from '../services/mockData';

export const DashboardScreen: React.FC = () => {
  const progressData = PatternIntelligenceEngine.calculateProgress(MOCK_SCAN_HISTORY);
  const patternInsights = PatternIntelligenceEngine.analyzePatterns(MOCK_SCAN_HISTORY);

  // Model 5: ML-powered pattern anomaly analysis
  const [mlPatterns, setMlPatterns] = useState<MlPatternResult | null>(null);

  useEffect(() => {
    const scanRecords = MOCK_SCAN_HISTORY.map(h => ({
      id: h.id,
      userId: 'user_local',
      productName: h.productName,
      scannedAt: h.timestamp,
      sodiumMg: h.sodiumMg,
      sugarGrams: h.sugarsG ?? 5,
      saturatedFatGrams: 2,
      fiberGrams: 2,
      hasAdditives: h.processingLevel === 'ultra_processed',
    }));

    MlService.analyzeEatingPatterns('user_local', scanRecords)
      .then(result => setMlPatterns(result))
      .catch(() => { /* use local insights */ });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Health & Scan Intelligence</Text>
        <Text style={styles.subtitle}>
          Track nutrition trends, healthy eating streaks & habit alerts over time
        </Text>
      </View>

      {/* Feature 6: Progress Dashboard Card */}
      <ProgressDashboardCard progress={progressData} />

      {/* Feature 7: Food Pattern Intelligence Widget */}
      <PatternIntelligenceWidget insights={patternInsights} />

      {/* Recent Scan History List */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <View style={styles.historyTitleRow}>
            <NutriIcon name="trends" size={16} color="#0F172A" />
            <Text style={styles.historyTitle}> Recent Scan History</Text>
          </View>
          <View style={styles.historyCountBadge}>
            <Text style={styles.historyCount}>{MOCK_SCAN_HISTORY.length} Scanned</Text>
          </View>
        </View>

        {MOCK_SCAN_HISTORY.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.historyCard,
              idx === MOCK_SCAN_HISTORY.length - 1 && styles.historyCardLast,
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand} numberOfLines={1}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.itemDate}>
                {new Date(item.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.itemScoreWrapper}>
              <View
                style={[
                  styles.itemScoreBadge,
                  { backgroundColor: item.score >= 60 ? '#10B981' : '#EF4444' },
                ]}
              >
                <Text style={styles.itemScoreText}>{item.score}</Text>
              </View>
              <Text style={styles.itemScoreSub}>/ 100</Text>
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
    marginBottom: 14,
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
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyCountBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyCount: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  historyCardLast: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemScoreWrapper: {
    alignItems: 'center',
    flexShrink: 0,
  },
  itemScoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemScoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  itemScoreSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
});
