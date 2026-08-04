import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProductComparison } from '../../../shared/types';

interface Props {
  comparison: ProductComparison;
}

export const ComparisonView: React.FC<Props> = ({ comparison }) => {
  const { productA, productB, winnerProductId, summaryVerdict, comparisonPoints } = comparison;
  const isWinnerA = winnerProductId === productA.id;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Smart Shopping Assistant</Text>
        <Text style={styles.subtitle}>Side-by-side comparison & plain-language verdict</Text>
      </View>

      {/* Side by side product headers */}
      <View style={styles.productsHeaderRow}>
        <View style={[styles.productHeaderCard, isWinnerA && styles.winnerBorder]}>
          {isWinnerA && <Text style={styles.winnerText}>🏆 RECOMMENDED</Text>}
          <Text style={styles.brandText}>{productA.brand}</Text>
          <Text style={styles.nameText} numberOfLines={2}>{productA.name}</Text>
          <Text style={[styles.scoreBadge, { backgroundColor: isWinnerA ? '#10B981' : '#6B7280' }]}>
            {productA.overallScore}/100
          </Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        <View style={[styles.productHeaderCard, !isWinnerA && styles.winnerBorder]}>
          {!isWinnerA && <Text style={styles.winnerText}>🏆 RECOMMENDED</Text>}
          <Text style={styles.brandText}>{productB.brand}</Text>
          <Text style={styles.nameText} numberOfLines={2}>{productB.name}</Text>
          <Text style={[styles.scoreBadge, { backgroundColor: !isWinnerA ? '#10B981' : '#6B7280' }]}>
            {productB.overallScore}/100
          </Text>
        </View>
      </View>

      {/* Plain Language Verdict */}
      <View style={styles.verdictBox}>
        <Text style={styles.verdictTitle}>📢 Plain-Language Verdict:</Text>
        <Text style={styles.verdictText}>{summaryVerdict}</Text>
      </View>

      {/* Comparison Points Matrix */}
      <View style={styles.matrixContainer}>
        <Text style={styles.matrixTitle}>Detailed Comparison Matrix:</Text>
        {comparisonPoints.map((point, idx) => (
          <View key={idx} style={styles.matrixRow}>
            <Text style={styles.categoryLabel}>{point.category}</Text>
            <View style={styles.valuesRow}>
              <View
                style={[
                  styles.valCard,
                  point.advantageProduct === 'A' && styles.advantageCard,
                ]}
              >
                <Text style={styles.valText}>{point.productAValue}</Text>
              </View>
              <View
                style={[
                  styles.valCard,
                  point.advantageProduct === 'B' && styles.advantageCard,
                ]}
              >
                <Text style={styles.valText}>{point.productBValue}</Text>
              </View>
            </View>
          </View>
        ))}
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
    marginBottom: 12,
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
  productsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  productHeaderCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  winnerBorder: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#ECFDF5',
  },
  winnerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 4,
    height: 36,
  },
  scoreBadge: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  verdictBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  verdictTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  verdictText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  matrixContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  matrixTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  matrixRow: {
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  valuesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  valCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  advantageCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  valText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
});
