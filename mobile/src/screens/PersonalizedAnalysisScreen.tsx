import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ManufacturingTransparencyCard } from '../components/ManufacturingTransparencyCard';
import { PersonalizedHealthBanner } from '../components/PersonalizedHealthBanner';
import { PersonalizationEngine } from '../services/personalizationService';
import { UserProfile } from '../../../shared/types';
import { MOCK_PRODUCTS } from '../services/mockData';

interface Props {
  userProfile: UserProfile;
}

export const PersonalizedAnalysisScreen: React.FC<Props> = ({ userProfile }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('p_maggi');
  const currentProduct = MOCK_PRODUCTS[selectedProductId] || MOCK_PRODUCTS.p_maggi;

  const analysis = PersonalizationEngine.analyzeProduct(currentProduct, userProfile);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Personalized Food Safety Intelligence</Text>
        <Text style={styles.subtitle}>
          Condition-aware health analysis & manufacturing transparency
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
          <Text style={styles.prodCategory}>{currentProduct.category} • {currentProduct.processingLevel.replace('_', ' ')}</Text>
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

      {/* Nutrition Quick Facts */}
      <View style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>Nutrition Breakdown (per {currentProduct.nutritionFacts.servingSize})</Text>
        <View style={styles.nutrGrid}>
          <View style={styles.nutrTile}>
            <Text style={styles.nutrVal}>{currentProduct.nutritionFacts.calories} kcal</Text>
            <Text style={styles.nutrLabel}>Calories</Text>
          </View>
          <View style={styles.nutrTile}>
            <Text style={[styles.nutrVal, currentProduct.nutritionFacts.sodium > 400 && styles.warnText]}>
              {currentProduct.nutritionFacts.sodium} mg
            </Text>
            <Text style={styles.nutrLabel}>Sodium</Text>
          </View>
          <View style={styles.nutrTile}>
            <Text style={[styles.nutrVal, currentProduct.nutritionFacts.sugars > 10 && styles.warnText]}>
              {currentProduct.nutritionFacts.sugars} g
            </Text>
            <Text style={styles.nutrLabel}>Sugars</Text>
          </View>
          <View style={styles.nutrTile}>
            <Text style={styles.nutrVal}>{currentProduct.nutritionFacts.protein} g</Text>
            <Text style={styles.nutrLabel}>Protein</Text>
          </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  selectorChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  productOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prodInfo: {
    flex: 1,
  },
  prodBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  prodName: {
    fontSize: 16,
    fontWeight: '700',
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
    borderRadius: 12,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreSub: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  nutrGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrTile: {
    alignItems: 'center',
  },
  nutrVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  warnText: {
    color: '#DC2626',
  },
  nutrLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
