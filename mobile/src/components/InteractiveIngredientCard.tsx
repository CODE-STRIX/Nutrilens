import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Additive, Ingredient } from '../../../shared/types';

interface Props {
  ingredient: Ingredient;
  additiveDetails?: Additive;
}

export const InteractiveIngredientCard: React.FC<Props> = ({ ingredient, additiveDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getHazardBadge = (rating?: string, flag?: string) => {
    const val = rating || (flag === 'warning' ? 'High Risk' : flag === 'caution' ? 'Caution' : 'Safe');
    switch (val) {
      case 'High Risk':
      case 'warning':
        return { bg: '#FEE2E2', text: '#991B1B', label: '⚠️ Avoid / High Risk' };
      case 'Caution':
      case 'caution':
        return { bg: '#FEF3C7', text: '#92400E', label: '⚡ Caution' };
      default:
        return { bg: '#DCFCE7', text: '#166534', label: '✓ Generally Safe' };
    }
  };

  const badge = getHazardBadge(additiveDetails?.hazardRating, ingredient.healthFlag);

  return (
    <View style={[styles.cardContainer, ingredient.isAdditive && styles.additiveBorder]}>
      {/* Ingredient Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.nameBadgeRow}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            {ingredient.insCode && (
              <View style={styles.insCodeChip}>
                <Text style={styles.insCodeText}>{ingredient.insCode}</Text>
              </View>
            )}
          </View>
          {ingredient.purpose && (
            <Text style={styles.purposeText}>Role: {ingredient.purpose}</Text>
          )}
        </View>

        <View style={[styles.hazardBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.hazardText, { color: badge.text }]}>{badge.label}</Text>
        </View>
      </View>

      {/* Flagship 6-Question Intelligence Summary */}
      {additiveDetails && (
        <View style={styles.quickSummaryBox}>
          <Text style={styles.summaryLabel}>💡 Purpose in Food:</Text>
          <Text style={styles.summaryValue}>{additiveDetails.whyAdded || additiveDetails.description || 'Added for food formulation.'}</Text>
        </View>
      )}

      {/* Expand/Collapse Button */}
      {additiveDetails && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandButtonText}>
            {isExpanded ? 'Hide Detailed Intelligence ▲' : 'Read 6-Point Intelligence Card 👇'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Detailed 6-Question Intelligence Card */}
      {isExpanded && additiveDetails && (
        <View style={styles.detailsContainer}>
          {/* Question 1: What it is */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionTitle}>1. What Is It?</Text>
            <Text style={styles.answerText}>{additiveDetails.whatItIs || additiveDetails.description || 'Not available.'}</Text>
          </View>

          {/* Question 2: Why it's added */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionTitle}>2. Why Is It Added by Manufacturers?</Text>
            <Text style={styles.answerText}>{additiveDetails.whyAdded || 'Added for shelf life, texture, or cost control.'}</Text>
          </View>

          {/* Question 3: Body Effect */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionTitle}>3. What Does It Do in Your Body?</Text>
            <Text style={styles.answerText}>{additiveDetails.bodyEffect || additiveDetails.biologicalImpact || 'Digested through normal metabolic pathways.'}</Text>
          </View>

          {/* Question 4: Frequency & Safety Guidance */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionTitle}>4. How Often Is It Safe to Consume?</Text>
            <Text style={styles.answerText}>{additiveDetails.frequencySafety || additiveDetails.safeFrequency || 'Safe within established daily intake limits.'}</Text>
          </View>

          {/* Question 5: Healthier Alternatives */}
          {additiveDetails.healthierAlternatives && additiveDetails.healthierAlternatives.length > 0 && (
            <View style={styles.questionBlock}>
              <Text style={styles.questionTitle}>5. Healthier Alternatives:</Text>
              <View style={styles.altPillsRow}>
                {additiveDetails.healthierAlternatives.map((alt, idx) => (
                  <View key={idx} style={styles.altPill}>
                    <Text style={styles.altPillText}>🌱 {alt}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Question 6: Where Else Found */}
          {(additiveDetails.commonFoodsFoundIn || additiveDetails.commonFoods) && (
            <View style={styles.questionBlock}>
              <Text style={styles.questionTitle}>6. Where Else Is It Found?</Text>
              <Text style={styles.answerText}>
                {(additiveDetails.commonFoodsFoundIn || additiveDetails.commonFoods || []).join(' • ')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  additiveBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  insCodeChip: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  insCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  purposeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  hazardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hazardText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  summaryValue: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
    lineHeight: 16,
  },
  expandButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 6,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  questionBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
  },
  questionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  altPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  altPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  altPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
});
