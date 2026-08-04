import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HealthyAlternative } from '../../../shared/types';

interface Props {
  recommendation: HealthyAlternative;
  onSelectAlternative?: () => void;
}

export const AlternativeRecommendationCard: React.FC<Props> = ({
  recommendation,
  onSelectAlternative,
}) => {
  const alt = recommendation.alternativeProduct;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💡 Healthy Shelf Alternative</Text>
        <View style={styles.improvementBadge}>
          <Text style={styles.improvementText}>+{recommendation.scoreImprovement} pts Score</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        A genuinely better option in the same category available on store shelves:
      </Text>

      {/* Alternative Card */}
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{alt.brand}</Text>
          <Text style={styles.productName}>{alt.name}</Text>
          <Text style={styles.categoryText}>{alt.category}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreVal}>{alt.overallScore}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>
      </View>

      {/* Key Improvements */}
      <View style={styles.improvementsBox}>
        <Text style={styles.impTitle}>Key Improvements Over Scanned Item:</Text>
        {recommendation.keyImprovements.map((imp, idx) => (
          <View key={idx} style={styles.impRow}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.impText}>{imp}</Text>
          </View>
        ))}
      </View>

      {/* Reason */}
      <Text style={styles.reasonText}>{recommendation.reason}</Text>

      {onSelectAlternative && (
        <TouchableOpacity style={styles.button} onPress={onSelectAlternative} activeOpacity={0.8}>
          <Text style={styles.buttonText}>View Alternative Details & Ingredients →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 16,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#065F46',
  },
  improvementBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  improvementText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  productInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  categoryText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  scoreBox: {
    backgroundColor: '#059669',
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#D1FAE5',
    fontWeight: '700',
  },
  improvementsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  impTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 6,
  },
  impRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  checkIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  impText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  reasonText: {
    fontSize: 12,
    color: '#047857',
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
