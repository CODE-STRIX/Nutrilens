import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ManufacturingTransparencyCard } from '../components/ManufacturingTransparencyCard';
import { NutriIcon } from '../components/NutriIcon';
import { PersonalizedHealthBanner } from '../components/PersonalizedHealthBanner';
import { PersonalizationEngine } from '../services/personalizationService';
import { MlService, MlHealthRankResult, MlAlternativeResult } from '../services/mlService';
import { UserProfile } from '../../../shared/types';
import { MOCK_PRODUCTS } from '../services/mockData';

interface Props {
  userProfile: UserProfile;
}

export const PersonalizedAnalysisScreen: React.FC<Props> = ({ userProfile }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('p_maggi');
  const currentProduct = MOCK_PRODUCTS[selectedProductId] || MOCK_PRODUCTS.p_maggi;

  // Local rule-based analysis (always available)
  const analysis = PersonalizationEngine.analyzeProduct(currentProduct as any, userProfile);

  // Model 3 & 4: ML-powered health ranking + alternative recommendation
  const [mlRank, setMlRank] = useState<MlHealthRankResult | null>(null);
  const [mlAlt, setMlAlt] = useState<MlAlternativeResult | null>(null);
  const [mlLoading, setMlLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const runMlAnalysis = async () => {
      setMlLoading(true);
      setMlRank(null);
      setMlAlt(null);
      try {
        const product = currentProduct as any;
        const user = userProfile as any;
        const [rankResult, altResult] = await Promise.all([
          MlService.rankProductForUser(product, user),
          MlService.getSmartAlternative(product, user),
        ]);
        if (!cancelled) {
          setMlRank(rankResult);
          setMlAlt(altResult);
        }
      } catch {
        // Silently continue with local analysis
      } finally {
        if (!cancelled) setMlLoading(false);
      }
    };
    runMlAnalysis();
    return () => { cancelled = true; };
  }, [selectedProductId]);

  const nutritionData = (currentProduct as any).nutritionFacts || (currentProduct as any).nutrition;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Personalized Food Safety Intelligence</Text>
        <Text style={styles.subtitle}>
          Condition-aware health analysis & manufacturing transparency tailored to your health profile
        </Text>
      </View>

      {/* Product Selector */}
      <Text style={styles.sectionLabel}>SELECT SCANNED SAMPLE PRODUCT:</Text>
      <View style={styles.selectorRow}>
        {Object.values(MOCK_PRODUCTS).map((prod) => (
          <TouchableOpacity
            key={prod.id}
            style={[styles.selectorChip, selectedProductId === prod.id && styles.activeChip]}
            onPress={() => setSelectedProductId(prod.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selectedProductId === prod.id && styles.activeChipText]}>
              {prod.brand} {prod.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scanned Product Overview Card */}
      <View style={styles.productOverview}>
        <View style={styles.prodInfo}>
          <Text style={styles.prodBrand}>{currentProduct.brand}</Text>
          <Text style={styles.prodName}>{currentProduct.name}</Text>
          <Text style={styles.prodCategory}>
            {currentProduct.category} • {currentProduct.processingLevel.replace('_', ' ')}
          </Text>
        </View>
        <View style={styles.scoreBadgeBox}>
          <Text style={styles.scoreNum}>{currentProduct.overallScore}</Text>
          <Text style={styles.scoreSub}>BASE SCORE</Text>
        </View>
      </View>

      {/* Feature 5: Personalized Health Analysis Banner */}
      <PersonalizedHealthBanner analysis={analysis} userProfile={userProfile} />

      {/* Feature 4: Food Manufacturing Transparency Card */}
      <ManufacturingTransparencyCard summaries={analysis.manufacturingSummaries} />

      {/* Nutrition Quick Facts - Premium Panel */}
      <View style={styles.nutritionCard}>
        {/* Panel Header */}
        <View style={styles.nutritionHeader}>
          <View style={styles.nutritionHeaderLeft}>
            <NutriIcon name="chart" size={24} color="#FFFFFF" />
            <View>
              <Text style={styles.nutritionTitle}>Nutrition Quick Facts</Text>
              <Text style={styles.nutritionServingSub}>
                Per serving: {nutritionData?.servingSize ?? '—'}
              </Text>
            </View>
          </View>
          <View style={styles.calorieBadge}>
            <Text style={styles.calorieNum}>{nutritionData?.calories ?? '—'}</Text>
            <Text style={styles.calorieLbl}>KCAL</Text>
          </View>
        </View>

        {/* Macro Row */}
        <View style={styles.macroRow}>
          {[
            { label: 'Protein', value: nutritionData?.protein, unit: 'g', color: '#3B82F6', icon: 'protein' as const },
            { label: 'Carbs', value: nutritionData?.carbohydrates, unit: 'g', color: '#F59E0B', icon: 'grain' as const },
            { label: 'Total Fat', value: nutritionData?.totalFat, unit: 'g', color: '#EF4444', icon: 'fat' as const },
            { label: 'Fiber', value: nutritionData?.fiber, unit: 'g', color: '#10B981', icon: 'leaf' as const },
          ].map((m, i) => (
            <View key={i} style={styles.macroItem}>
              <NutriIcon name={m.icon} size={18} color={m.color} />
              <Text style={[styles.macroValue, { color: m.color }]}>{m.value != null ? m.value : '—'}{m.value != null ? m.unit : ''}</Text>
              <Text style={styles.macroLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.nutrDivider} />

        {/* Detailed Rows */}
        {[
          {
            label: 'Sodium', value: nutritionData?.sodium, unit: 'mg',
            max: 2300, icon: 'salt' as const,
            getColor: (v: number) => v > 600 ? '#EF4444' : v > 300 ? '#F59E0B' : '#10B981',
            getLabel: (v: number) => v > 600 ? 'HIGH' : v > 300 ? 'MOD' : 'LOW',
          },
          {
            label: 'Sugars', value: nutritionData?.sugars, unit: 'g',
            max: 50, icon: 'sugar' as const,
            getColor: (v: number) => v > 15 ? '#EF4444' : v > 6 ? '#F59E0B' : '#10B981',
            getLabel: (v: number) => v > 15 ? 'HIGH' : v > 6 ? 'MOD' : 'LOW',
          },
          {
            label: 'Saturated Fat', value: nutritionData?.saturatedFat, unit: 'g',
            max: 20, icon: 'body' as const,
            getColor: (v: number) => v > 8 ? '#EF4444' : v > 3 ? '#F59E0B' : '#10B981',
            getLabel: (v: number) => v > 8 ? 'HIGH' : v > 3 ? 'MOD' : 'LOW',
          },
          {
            label: 'Trans Fat', value: nutritionData?.transFat, unit: 'g',
            max: 2, icon: 'alert' as const,
            getColor: (v: number) => v > 0.5 ? '#EF4444' : v > 0 ? '#F59E0B' : '#10B981',
            getLabel: (v: number) => v > 0.5 ? 'HIGH' : v > 0 ? 'TRACE' : 'NIL',
          },
          {
            label: 'Added Sugars', value: nutritionData?.addedSugars, unit: 'g',
            max: 25, icon: 'sugar' as const,
            getColor: (v: number) => v > 8 ? '#EF4444' : v > 3 ? '#F59E0B' : '#10B981',
            getLabel: (v: number) => v > 8 ? 'HIGH' : v > 3 ? 'MOD' : 'LOW',
          },
        ].map((row, i) => {
          const val = row.value ?? 0;
          const barColor = row.getColor(val);
          const barLabel = row.getLabel(val);
          const barWidth = Math.min(100, (val / row.max) * 100);
          return (
            <View key={i} style={styles.nutrRow}>
              <NutriIcon name={row.icon} size={16} color="#64748B" />
              <View style={styles.nutrRowMiddle}>
                <View style={styles.nutrRowLabelRow}>
                  <Text style={styles.nutrRowLabel}>{row.label}</Text>
                  <Text style={styles.nutrRowValue}>
                    {row.value != null ? `${row.value}${row.unit}` : '—'}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${barWidth}%` as any, backgroundColor: barColor }]} />
                </View>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: barColor + '22', borderColor: barColor }]}>
                <Text style={[styles.levelBadgeText, { color: barColor }]}>{barLabel}</Text>
              </View>
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.nutrFooter}>
          <NutriIcon name="health" size={12} color="#166534" />
          <Text style={styles.nutrFooterText}>
            Based on FSSAI / ICMR 2024 recommended daily values for adults
          </Text>
        </View>
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectorChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    elevation: 1,
  },
  activeChip: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  productOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  prodInfo: {
    flex: 1,
  },
  prodBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  prodName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  prodCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scoreBadgeBox: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  scoreSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 1,
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  nutritionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  nutritionHeaderIcon: {
    fontSize: 24,
  },
  nutritionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  nutritionServingSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  calorieBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  calorieNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
    lineHeight: 22,
  },
  calorieLbl: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6EE7B7',
    letterSpacing: 0.6,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
  },
  macroItem: {
    alignItems: 'center',
    gap: 2,
  },
  macroIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  macroLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  nutrDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 0,
  },
  nutrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  nutrRowIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  nutrRowMiddle: {
    flex: 1,
  },
  nutrRowLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrRowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  nutrRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  levelBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  nutrFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  nutrFooterText: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '600',
    lineHeight: 14,
  },
});
