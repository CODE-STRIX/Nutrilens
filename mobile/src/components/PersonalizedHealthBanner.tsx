import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PersonalizedAnalysis, UserProfile } from '../../../shared/types';

interface Props {
  analysis: PersonalizedAnalysis;
  userProfile: UserProfile;
}

export const PersonalizedHealthBanner: React.FC<Props> = ({ analysis, userProfile }) => {
  const getSuitabilityColor = (): { bg: string; border: string; text: string; badge: string } => {
    switch (analysis.overallSuitability) {
      case 'recommended':
        return { bg: '#ECFDF5', border: '#10B981', text: '#047857', badge: 'FIT FOR YOUR PROFILE' };
      case 'moderate':
        return { bg: '#FFFBEB', border: '#F59E0B', text: '#B45309', badge: 'CONSUME IN MODERATION' };
      case 'avoid':
      default:
        return { bg: '#FEF2F2', border: '#EF4444', text: '#B91C1C', badge: 'HEALTH RISK DETECTED' };
    }
  };

  const theme = getSuitabilityColor();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userNameText}>Personalized for {userProfile.name}</Text>
          <View style={styles.badgeRow}>
            <Text style={[styles.suitabilityBadge, { color: theme.text, borderColor: theme.border }]}>
              {theme.badge}
            </Text>
          </View>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: theme.text }]}>{analysis.suitabilityScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
      </View>

      {/* Summary Tip */}
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>💡 {analysis.personalizedTip}</Text>
      </View>

      {/* Allergy Warnings */}
      {analysis.allergyWarnings.length > 0 && (
        <View style={styles.allergyBox}>
          <Text style={styles.allergyTitle}>🚨 ALLERGY ALERT DETECTED</Text>
          {analysis.allergyWarnings.map((warn: any, i: number) => (
            <Text key={i} style={styles.allergyText}>
              • Contains <Text style={{ fontWeight: '700' }}>{warn.ingredientName}</Text> ({warn.allergy.toUpperCase()})
            </Text>
          ))}
        </View>
      )}

      {/* Condition Flags */}
      {analysis.conditionFlags.length > 0 && (
        <View style={styles.flagsBox}>
          <Text style={styles.flagsTitle}>⚠️ Health Condition Flags</Text>
          {analysis.conditionFlags.map((flag: any, idx: number) => (
            <View key={idx} style={styles.flagCard}>
              <View style={styles.flagHeader}>
                <Text style={styles.flagTitle}>{flag.title}</Text>
                <Text style={[styles.severityBadge, flag.severity === 'high' ? styles.sevHigh : styles.sevMed]}>
                  {flag.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.flagMessage}>{flag.message}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Goal Alignments */}
      {analysis.goalAlignment.length > 0 && (
        <View style={styles.goalsBox}>
          <Text style={styles.goalsTitle}>🎯 Your Goal Alignment</Text>
          <View style={styles.goalsGrid}>
            {analysis.goalAlignment.map((g: any, idx: number) => (
              <View key={idx} style={[styles.goalChip, g.isAligned ? styles.goalPass : styles.goalFail]}>
                <Text style={styles.goalIcon}>{g.isAligned ? '✓' : '✕'}</Text>
                <Text style={styles.goalText}>
                  {g.goal.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  suitabilityBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: -4,
  },
  tipBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    lineHeight: 18,
  },
  allergyBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  allergyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 4,
  },
  allergyText: {
    fontSize: 12,
    color: '#7F1D1D',
  },
  flagsBox: {
    marginTop: 4,
    marginBottom: 8,
  },
  flagsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  flagCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  flagTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  severityBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sevHigh: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  sevMed: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  flagMessage: {
    fontSize: 12,
    color: '#4B5563',
  },
  goalsBox: {
    marginTop: 6,
  },
  goalsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  goalPass: {
    backgroundColor: '#D1FAE5',
  },
  goalFail: {
    backgroundColor: '#F3F4F6',
  },
  goalIcon: {
    fontSize: 11,
    fontWeight: '800',
  },
  goalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
});
