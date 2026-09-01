import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NutriIcon } from './NutriIcon';
import { ProgressData } from '../../../shared/types';

interface Props {
  progress: ProgressData;
}

export const ProgressDashboardCard: React.FC<Props> = ({ progress }) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(progress.weeklyAverageScore);
  const barPercent = Math.min(100, Math.max(0, progress.weeklyAverageScore));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <View style={styles.headerTitleRow}>
            <NutriIcon name="chart" size={16} color="#0F172A" />
            <Text style={styles.title}> Nutrition Progress</Text>
          </View>
          <Text style={styles.subtitle}>Running health score & habit trends</Text>
        </View>
        <View style={styles.streakBadge}>
          <NutriIcon name="flame" size={14} color="#C2410C" />
          <Text style={styles.streakText}>{progress.streakDays}d Streak</Text>
        </View>
      </View>

      {/* Main Score + Stats Row */}
      <View style={styles.scoreRow}>
        <View style={styles.gaugeBox}>
          <Text style={[styles.mainScore, { color: scoreColor }]}>
            {progress.weeklyAverageScore}
          </Text>
          <Text style={styles.mainScoreLabel}>SCORE</Text>
        </View>

        <View style={styles.statsColumn}>
          <View style={[styles.statTile, { borderLeftColor: '#10B981' }]}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {progress.healthyChoicePercentage}%
            </Text>
            <Text style={styles.statLabel}>Healthy Choices</Text>
          </View>
          <View style={[styles.statTile, { borderLeftColor: '#EF4444' }]}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {progress.ultraProcessedPercentage}%
            </Text>
            <Text style={styles.statLabel}>Ultra-Processed</Text>
          </View>
        </View>
      </View>

      {/* Score Progress Bar */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabelLeft}>0</Text>
          <Text style={[styles.progressLabelCenter, { color: scoreColor }]}>
            {progress.weeklyAverageScore} / 100
          </Text>
          <Text style={styles.progressLabelRight}>100</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${barPercent}%` as any, backgroundColor: scoreColor },
            ]}
          />
        </View>
      </View>

      {/* Metric Footer */}
      <View style={styles.footerRow}>
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.totalScans}</Text>
          <Text style={styles.footerLabel}>Total Scans</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.weeklyAverageScore}</Text>
          <Text style={styles.footerLabel}>Weekly Avg</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.monthlyAverageScore}</Text>
          <Text style={styles.footerLabel}>Monthly Avg</Text>
        </View>
      </View>
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
    marginBottom: 14,
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
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    alignSelf: 'flex-start',
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 14,
  },
  gaugeBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mainScore: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
  },
  mainScoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statsColumn: {
    flex: 1,
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  progressWrapper: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabelLeft: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressLabelCenter: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressLabelRight: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  footerTile: {
    alignItems: 'center',
    flex: 1,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  footerLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
});
