import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../../shared/types';
import { IngredientInteractionMap } from '../components/IngredientInteractionMap';
import { InteractiveIngredientCard } from '../components/InteractiveIngredientCard';
import { RecallAlertBanner } from '../components/RecallAlertBanner';
import { RecallService } from '../services/recallService';

interface Props {
  product: Product;
}

export const ProductDetailScreen: React.FC<Props> = ({ product }) => {
  const recallNotice = RecallService.checkRecallForProduct(product);

  const getScoreBadgeColor = (score?: number) => {
    const s = score ?? 50;
    if (s >= 75) return { bg: '#DCFCE7', text: '#15803D', label: 'Good Safety Profile' };
    if (s >= 50) return { bg: '#FEF3C7', text: '#B45309', label: 'Moderate Caution' };
    return { bg: '#FEE2E2', text: '#B91C1C', label: 'High Risk / Limit' };
  };

  const scoreBadge = getScoreBadgeColor(product.overallScore || product.overallBaseScore);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Product Hero Header */}
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImg} />
          ) : (
            <View style={styles.placeholderImg}>
              <Text style={styles.placeholderText}>📦 Snack</Text>
            </View>
          )}

          <View style={styles.heroMeta}>
            <Text style={styles.brandName}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.categoryTag}>{product.category}</Text>

            {product.isRegionalUnbranded && (
              <View style={styles.regionalBadge}>
                <Text style={styles.regionalText}>📍 Regional Unbranded Snack</Text>
              </View>
            )}

            {product.verificationStatus === 'verified' && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Community Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Base Safety Score */}
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { backgroundColor: scoreBadge.bg }]}>
            <Text style={[styles.scoreValue, { color: scoreBadge.text }]}>
              {product.overallScore || product.overallBaseScore || 50}
            </Text>
            <Text style={[styles.scoreDenom, { color: scoreBadge.text }]}>/100</Text>
          </View>

          <View style={styles.scoreTextCol}>
            <Text style={styles.scoreHeadline}>{scoreBadge.label}</Text>
            <Text style={styles.scoreSub}>Based on ingredient additive hazard analysis</Text>
          </View>
        </View>
      </View>

      {/* Feature 11: Retroactive Recall Warning Banner (If affected) */}
      {recallNotice && <RecallAlertBanner recallNotice={recallNotice} />}

      {/* Feature 3: Ingredient Interaction Map */}
      {product.interactionMap && (
        <IngredientInteractionMap interactionMap={product.interactionMap} />
      )}

      {/* Feature 2: Interactive Ingredient Intelligence */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🧪 Interactive Ingredient Intelligence</Text>
        <Text style={styles.sectionSub}>
          Tap any card below to answer 6 key questions: what it is, why added, body effect, frequency, alternatives, and common foods.
        </Text>
      </View>

      {product.ingredients && product.ingredients.length > 0 ? (
        product.ingredients.map((ing, idx) => {
          const additiveDetails = product.additives?.find(
            (a) => a.insCode === ing.insCode || a.id === ing.additiveId || a.name === ing.name
          );

          return (
            <InteractiveIngredientCard
              key={ing.id || idx}
              ingredient={ing}
              additiveDetails={additiveDetails}
            />
          );
        })
      ) : (
        <Text style={styles.emptyText}>No ingredients parsed yet for this product.</Text>
      )}
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
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroRow: {
    flexDirection: 'row',
    gap: 14,
  },
  productImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  placeholderImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  heroMeta: {
    flex: 1,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  categoryTag: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  regionalBadge: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  regionalText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  scoreDenom: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreTextCol: {
    flex: 1,
  },
  scoreHeadline: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreSub: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 20,
  },
});
