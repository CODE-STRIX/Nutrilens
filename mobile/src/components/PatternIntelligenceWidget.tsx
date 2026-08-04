import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MobilePatternInsight } from '../../../shared/types';

interface Props {
  insights: MobilePatternInsight[];
}

export const PatternIntelligenceWidget: React.FC<Props> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🧠 Food Pattern Intelligence</Text>
        <Text style={styles.subtitle}>Scan more products to unlock dietary habit insights.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Food Pattern Intelligence</Text>
        <Text style={styles.badge}>Multi-Scan Analytics</Text>
      </View>
      <Text style={styles.subtitle}>Surfacing eating habit patterns across your scan history:</Text>

      {insights.map((item) => {
        const isWarning = item.impactLevel === 'warning';
        return (
          <View
            key={item.id}
            style={[
              styles.card,
              { borderLeftColor: isWarning ? '#EF4444' : '#10B981' },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={[styles.pctBadge, { backgroundColor: isWarning ? '#FEE2E2' : '#D1FAE5' }]}>
                <Text style={[styles.pctText, { color: isWarning ? '#991B1B' : '#065F46' }]}>
                  {item.percentage}% {item.metric}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Actionable Advice:</Text>
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
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  tipBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    color: '#1F2937',
    lineHeight: 16,
  },
});
