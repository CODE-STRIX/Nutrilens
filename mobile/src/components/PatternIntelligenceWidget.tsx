import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NutriIcon } from './NutriIcon';
import { MobilePatternInsight } from '../../../shared/types';

interface Props {
  insights: MobilePatternInsight[];
}

export const PatternIntelligenceWidget: React.FC<Props> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyTitleRow}>
          <NutriIcon name="intel" size={18} color="#0F172A" />
          <Text style={styles.title}> Food Pattern Intelligence</Text>
        </View>
        <Text style={styles.subtitle}>Scan more products to unlock dietary habit insights.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <View style={styles.headerTitleRow}>
            <NutriIcon name="intel" size={16} color="#0F172A" />
            <Text style={styles.title}> Food Pattern Intelligence</Text>
          </View>
          <Text style={styles.subtitle}>Eating habit patterns across your scan history</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Analytics</Text>
        </View>
      </View>

      {insights.map((item) => {
        const isWarning = item.impactLevel === 'warning';
        const accentColor = isWarning ? '#EF4444' : '#10B981';
        const badgeBg = isWarning ? '#FEE2E2' : '#D1FAE5';
        const badgeText = isWarning ? '#991B1B' : '#065F46';

        return (
          <View
            key={item.id}
            style={[styles.card, { borderLeftColor: accentColor }]}
          >
            {/* Card Header: title + badge */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <View style={[styles.pctBadge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.pctNum, { color: badgeText }]}>{item.percentage}%</Text>
                <Text style={[styles.pctMetric, { color: badgeText }]} numberOfLines={1}>
                  {item.metric}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={[styles.tipBox, { borderLeftColor: accentColor }]}>
              <View style={styles.tipTitleRow}>
                <NutriIcon name="bulb" size={12} color={accentColor} />
                <Text style={[styles.tipTitle, { color: accentColor }]}> Actionable Advice</Text>
              </View>
              <Text style={styles.tipText}>{item.actionableTip}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    lineHeight: 19,
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 44,
    maxWidth: 70,
    flexShrink: 0,
  },
  pctNum: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 16,
  },
  pctMetric: {
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 17,
  },
  tipBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderLeftWidth: 3,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  tipTitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tipText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontWeight: '500',
  },
});
