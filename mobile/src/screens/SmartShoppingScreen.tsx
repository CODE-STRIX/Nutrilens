import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlternativeRecommendationCard } from '../components/AlternativeRecommendationCard';
import { ComparisonView } from '../components/ComparisonView';
import { ComparisonEngine } from '../services/comparisonService';
import { MOCK_PRODUCTS } from '../services/mockData';

export const SmartShoppingScreen: React.FC = () => {
  const [productAId, setProductAId] = useState<string>('p_maggi');
  const [productBId, setProductBId] = useState<string>('p_muesli');

  const prodA = MOCK_PRODUCTS[productAId] || MOCK_PRODUCTS.p_maggi;
  const prodB = MOCK_PRODUCTS[productBId] || MOCK_PRODUCTS.p_muesli;

  const comparison = ComparisonEngine.compareProducts(prodA, prodB);
  const alternativeRec = ComparisonEngine.getAlternative(prodA, MOCK_PRODUCTS.p_muesli);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Shopping & Comparisons</Text>
        <Text style={styles.subtitle}>
          Compare products back-to-back at the shelf and find healthier alternatives
        </Text>
      </View>

      {/* Select Products to Compare */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorTitle}>SELECT PRODUCTS TO COMPARE:</Text>

        <View style={styles.selectRow}>
          <View style={styles.selectCol}>
            <Text style={styles.colLabel}>Product 1 (First Scan)</Text>
            {Object.values(MOCK_PRODUCTS).map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, productAId === p.id && styles.activeChip]}
                onPress={() => setProductAId(p.id)}
              >
                <Text style={[styles.chipText, productAId === p.id && styles.activeChipText]}>
                  {p.brand} {p.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.selectCol}>
            <Text style={styles.colLabel}>Product 2 (Second Scan)</Text>
            {Object.values(MOCK_PRODUCTS).map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, productBId === p.id && styles.activeChip]}
                onPress={() => setProductBId(p.id)}
              >
                <Text style={[styles.chipText, productBId === p.id && styles.activeChipText]}>
                  {p.brand} {p.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Feature 9: Smart Shopping Assistant Comparison View */}
      <ComparisonView comparison={comparison} />

      {/* Feature 8: Healthy Alternative Recommendation */}
      <AlternativeRecommendationCard recommendation={alternativeRec} />
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
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  selectRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectCol: {
    flex: 1,
    gap: 6,
  },
  colLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#0F172A',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});
