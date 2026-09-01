import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../../shared/types';
import { IngredientInteractionMap } from '../components/IngredientInteractionMap';
import { InteractiveIngredientCard } from '../components/InteractiveIngredientCard';
import { NutriIcon } from '../components/NutriIcon';
import { RecallAlertBanner } from '../components/RecallAlertBanner';
import { RecallService } from '../services/recallService';
import { theme } from '../theme/colors';

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Product Hero Header */}
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImg} />
          ) : (
            <View style={styles.placeholderImg}>
              <NutriIcon name="snack" size={32} color="#94A3B8" />
            </View>
          )}

          <View style={styles.heroMeta}>
            <Text style={styles.brandName}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.categoryTag}>{product.category}</Text>

            <View style={styles.badgeWrap}>
              {product.isRegionalUnbranded && (
                <View style={styles.regionalBadge}>
                  <NutriIcon name="separator" size={8} color="#B45309" />
                  <Text style={styles.regionalText}> Regional Unbranded</Text>
                </View>
              )}

              {product.verificationStatus === 'verified' && (
                <View style={styles.verifiedBadge}>
                  <NutriIcon name="verified" size={12} color="#15803D" />
                  <Text style={styles.verifiedText}> Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Base Safety Score Row */}
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
        <View style={styles.sectionTitleRow}>
          <NutriIcon name="flask" size={18} color="#0D9488" />
          <Text style={styles.sectionTitle}> Interactive Ingredient Intelligence</Text>
        </View>
        <Text style={styles.sectionSub}>
          Tap any card below to reveal 6 key insights: what it is, why added, body effect, usage limits, healthy alternatives, and common foods.
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
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No extracted ingredients recorded for this product.</Text>
        </View>
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
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImg: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  placeholderImg: {
    width: 80,
    height: 80,
    borderRadius: 14,
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
    marginLeft: 14,
  },
  brandName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  categoryTag: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  regionalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
    marginLeft: 2,
  },
  scoreTextCol: {
    marginLeft: 12,
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
    marginTop: 1,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
