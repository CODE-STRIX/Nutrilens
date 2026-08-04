import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📊 Nutrition Progress Dashboard</Text>
          <Text style={styles.subtitle}>Your running health score & habit trends</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{progress.streakDays} Day Streak</Text>
        </View>
      </View>

      {/* Main Score Meter */}
      <View style={styles.scoreRow}>
        <View style={styles.gaugeBox}>
          <Text style={[styles.mainScore, { color: getScoreColor(progress.weeklyAverageScore) }]}>
            {progress.weeklyAverageScore}
          </Text>
          <Text style={styles.mainScoreLabel}>NUTRITION SCORE</Text>
        </View>

        <View style={styles.statsColumn}>
          <View style={styles.statTile}>
            <Text style={styles.statNumber}>{progress.healthyChoicePercentage}%</Text>
            <Text style={styles.statLabel}>Healthy Choice Ratio</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {progress.ultraProcessedPercentage}%
            </Text>
            <Text style={styles.statLabel}>Ultra-Processed Scans</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress.weeklyAverageScore}%`,
              backgroundColor: getScoreColor(progress.weeklyAverageScore),
            },
          ]}
        />
      </View>

      {/* Metric Footer */}
      <View style={styles.footerRow}>
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.totalScans}</Text>
          <Text style={styles.footerLabel}>Total Scans</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.weeklyAverageScore} / 100</Text>
          <Text style={styles.footerLabel}>Weekly Average</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerTile}>
          <Text style={styles.footerValue}>{progress.monthlyAverageScore} / 100</Text>
          <Text style={styles.footerLabel}>Monthly Average</Text>
        </View>
      </View>
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
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  gaugeBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mainScore: {
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 48,
  },
  mainScoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statsColumn: {
    flex: 1,
    gap: 10,
  },
  statTile: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerTile: {
    alignItems: 'center',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
});
