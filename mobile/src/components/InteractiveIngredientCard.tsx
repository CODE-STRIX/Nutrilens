import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NutriIcon, IconName } from './NutriIcon';
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
        return { bg: '#FEE2E2', border: '#FCA5A5', text: '#991B1B', label: 'High Risk', icon: 'alert' as IconName };
      case 'Caution':
      case 'caution':
        return { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E', label: 'Caution', icon: 'alert' as IconName };
      default:
        return { bg: '#DCFCE7', border: '#86EFAC', text: '#166534', label: 'Generally Safe', icon: 'check' as IconName };
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

        <View style={[styles.hazardBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <NutriIcon name={badge.icon} size={11} color={badge.text} />
          <Text style={[styles.hazardText, { color: badge.text }]}> {badge.label}</Text>
        </View>
      </View>

      {/* Quick Purpose Summary */}
      {additiveDetails && (
        <View style={styles.quickSummaryBox}>
          <View style={styles.summaryLabelRow}>
            <NutriIcon name="bulb" size={12} color="#475569" />
            <Text style={styles.summaryLabel}> Purpose in Food Formulation:</Text>
          </View>
          <Text style={styles.summaryValue}>
            {additiveDetails.whyAdded || additiveDetails.description || 'Added for food preservation or texture.'}
          </Text>
        </View>
      )}

      {/* Flagship 6-Point Intelligence Action Button */}
      {additiveDetails && (
        <TouchableOpacity
          style={[styles.expandButton, isExpanded && styles.expandButtonActive]}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.expandButtonContent}>
            <NutriIcon name="flask" size={14} color="#FFFFFF" />
            <Text style={styles.expandButtonText}>
              {isExpanded ? ' Hide Additive Intelligence' : ' 6-Point Additive Intelligence'}
            </Text>
          </View>
          <View style={styles.badgePulse}>
            <Text style={styles.badgePulseText}>{isExpanded ? 'CLOSE' : '6 INSIGHTS'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Vibrant 6-Point Intelligence Grid Card */}
      {isExpanded && additiveDetails && (
        <View style={styles.detailsContainer}>
          {/* Point 1: What It Is */}
          <View style={[styles.questionBlock, styles.point1]}>
            <View style={styles.pointHeader}>
              <NutriIcon name="flask" size={14} color="#1E40AF" />
              <Text style={[styles.pointTitle, { color: '#1E40AF' }]}>1. What Is It?</Text>
            </View>
            <Text style={styles.answerText}>
              {additiveDetails.whatItIs || additiveDetails.description || 'Not available.'}
            </Text>
          </View>

          {/* Point 2: Why Added */}
          <View style={[styles.questionBlock, styles.point2]}>
            <View style={styles.pointHeader}>
              <NutriIcon name="factory" size={14} color="#92400E" />
              <Text style={[styles.pointTitle, { color: '#92400E' }]}>2. Why Is It Added by Manufacturers?</Text>
            </View>
            <Text style={styles.answerText}>
              {additiveDetails.whyAdded || 'Added for shelf life extension, texture, or cost optimization.'}
            </Text>
          </View>

          {/* Point 3: Body Effect */}
          <View style={[styles.questionBlock, styles.point3]}>
            <View style={styles.pointHeader}>
              <NutriIcon name="body" size={14} color="#991B1B" />
              <Text style={[styles.pointTitle, { color: '#991B1B' }]}>3. What Does It Do in Your Body?</Text>
            </View>
            <Text style={styles.answerText}>
              {additiveDetails.bodyEffect || additiveDetails.biologicalImpact || 'Digested through normal metabolic pathways.'}
            </Text>
          </View>

          {/* Point 4: Safe Frequency & Limits */}
          <View style={[styles.questionBlock, styles.point4]}>
            <View style={styles.pointHeader}>
              <NutriIcon name="clock" size={14} color="#6B21A8" />
              <Text style={[styles.pointTitle, { color: '#6B21A8' }]}>4. How Often Is It Safe to Consume?</Text>
            </View>
            <Text style={styles.answerText}>
              {additiveDetails.frequencySafety || additiveDetails.safeFrequency || 'Safe within established FSSAI daily intake limits.'}
            </Text>
          </View>

          {/* Point 5: Healthier Alternatives */}
          {additiveDetails.healthierAlternatives && additiveDetails.healthierAlternatives.length > 0 && (
            <View style={[styles.questionBlock, styles.point5]}>
              <View style={styles.pointHeader}>
                <NutriIcon name="leaf" size={14} color="#065F46" />
                <Text style={[styles.pointTitle, { color: '#065F46' }]}>5. Healthier Natural Alternatives:</Text>
              </View>
              <View style={styles.altPillsRow}>
                {additiveDetails.healthierAlternatives.map((alt, idx) => (
                  <View key={idx} style={styles.altPill}>
                    <Text style={styles.altPillText}>✓ {alt}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Point 6: Where Else Found */}
          {(additiveDetails.commonFoodsFoundIn || additiveDetails.commonFoods) && (
            <View style={[styles.questionBlock, styles.point6]}>
              <View style={styles.pointHeader}>
                <NutriIcon name="shop" size={14} color="#0891B2" />
                <Text style={[styles.pointTitle, { color: '#0891B2' }]}>6. Common Foods Sharing This Additive:</Text>
              </View>
              <View style={styles.foodTagWrap}>
                {(additiveDetails.commonFoodsFoundIn || additiveDetails.commonFoods || []).map((food, idx) => (
                  <View key={idx} style={styles.foodTag}>
                    <Text style={styles.foodTagText}>• {food}</Text>
                  </View>
                ))}
              </View>
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  additiveBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleCol: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  insCodeChip: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  insCodeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  purposeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '600',
  },
  hazardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hazardText: {
    fontSize: 10,
    fontWeight: '800',
  },
  quickSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
    lineHeight: 17,
    fontWeight: '500',
  },
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    elevation: 2,
  },
  expandButtonActive: {
    backgroundColor: '#0D9488',
  },
  expandButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  badgePulse: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePulseText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailsContainer: {
    marginTop: 12,
    gap: 8,
  },
  questionBlock: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  point1: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  point2: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  point3: { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' },
  point4: { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF' },
  point5: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  point6: { backgroundColor: '#ECFEFF', borderColor: '#A5F3FC' },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pointIcon: {
    fontSize: 16,
  },
  pointTitle: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  answerText: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 18,
    fontWeight: '500',
  },
  altPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  altPill: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  altPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  foodTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  foodTag: {
    backgroundColor: '#CFFAFE',
    borderWidth: 1,
    borderColor: '#67E8F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  foodTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0E7490',
  },
});
