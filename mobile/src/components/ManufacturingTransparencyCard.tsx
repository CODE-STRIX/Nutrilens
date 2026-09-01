import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NutriIcon } from './NutriIcon';
import { PersonDManufacturingRationale } from '../../../shared/types';

interface Props {
  summaries: PersonDManufacturingRationale[];
}

const PURPOSE_CONFIG: Record<string, {
  bg: string; border: string; label: string; icon: string;
  accentDark: string; accentLight: string;
}> = {
  cost: {
    bg: '#FFFBEB', border: '#FDE68A', label: 'Cost Efficiency',
    icon: '💰', accentDark: '#92400E', accentLight: '#FEF3C7',
  },
  shelf_life: {
    bg: '#EFF6FF', border: '#BFDBFE', label: 'Shelf Life Extension',
    icon: '📦', accentDark: '#1E40AF', accentLight: '#DBEAFE',
  },
  texture: {
    bg: '#F3E8FF', border: '#E9D5FF', label: 'Texture & Mouthfeel',
    icon: '🫙', accentDark: '#6B21A8', accentLight: '#EDE9FE',
  },
  flavour: {
    bg: '#FFF1F2', border: '#FECDD3', label: 'Flavor Enhancement',
    icon: '✨', accentDark: '#9D174D', accentLight: '#FCE7F3',
  },
  default: {
    bg: '#F8FAFC', border: '#E2E8F0', label: 'Processing Aid',
    icon: '⚙️', accentDark: '#334155', accentLight: '#F1F5F9',
  },
};

const getPurposeConfig = (purpose?: string) =>
  PURPOSE_CONFIG[purpose || 'default'] ?? PURPOSE_CONFIG.default;

export const ManufacturingTransparencyCard: React.FC<Props> = ({ summaries }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!summaries || summaries.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🏭</Text>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Manufacturing Transparency</Text>
            <Text style={styles.headerSub}>Industrial ingredient rationale</Text>
          </View>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyText}>No industrial additive rationale detected for this product.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium Dark Header */}
      <View style={styles.header}>
        <NutriIcon name="factory" size={26} color="#FFFFFF" />
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Manufacturing Transparency</Text>
          <Text style={styles.headerSub}>Why these ingredients are really in your food</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeNum}>{summaries.length}</Text>
          <Text style={styles.countBadgeLbl}>ITEMS</Text>
        </View>
      </View>

      <View style={styles.body}>
        {summaries.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const cfg = getPurposeConfig(item.primaryPurpose);

          return (
            <View key={index} style={[styles.card, { borderLeftColor: cfg.accentDark }]}>
              {/* Accordion Header */}
              <TouchableOpacity
                style={[styles.cardHeader, isExpanded && { backgroundColor: cfg.accentLight }]}
                onPress={() => setExpandedIndex(isExpanded ? null : index)}
                activeOpacity={0.75}
              >
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.purposeIconBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Text style={styles.purposeIconText}>{cfg.icon}</Text>
                  </View>
                  <View style={styles.cardTitleCol}>
                    <Text style={styles.ingredientName} numberOfLines={1}>{item.ingredientName}</Text>
                    <View style={[styles.purposePill, { backgroundColor: cfg.accentLight }]}>
                      <Text style={[styles.purposePillText, { color: cfg.accentDark }]}>{cfg.label}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.chevron, isExpanded && { transform: [{ rotate: '180deg' }] }]}>
                  <Text style={[styles.chevronText, { color: cfg.accentDark }]}>▼</Text>
                </View>
              </TouchableOpacity>

              {/* Expanded Details */}
              {isExpanded && (
                <View style={[styles.detailsBody, { backgroundColor: cfg.bg + 'CC' }]}>
                  {/* Manufacturer Choice */}
                  <View style={styles.detailSection}>
                    <View style={styles.detailSectionHeader}>
                      <NutriIcon name="factory" size={14} color={cfg.accentDark} />
                      <Text style={[styles.detailSectionTitle, { color: cfg.accentDark }]}>Manufacturer's Choice</Text>
                    </View>
                    <Text style={styles.detailSectionText}>{item.explanation}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Industry Context */}
                  <View style={styles.detailSection}>
                    <View style={styles.detailSectionHeader}>
                      <NutriIcon name="chart" size={14} color={cfg.accentDark} />
                      <Text style={[styles.detailSectionTitle, { color: cfg.accentDark }]}>Industry Context</Text>
                    </View>
                    <Text style={styles.detailSectionText}>{item.industryContext}</Text>
                  </View>

                  {/* Better Alternatives */}
                  {item.alternativesConsidered && item.alternativesConsidered.length > 0 && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.detailSection}>
                        <View style={styles.detailSectionHeader}>
                          <NutriIcon name="leaf" size={14} color="#065F46" />
                          <Text style={styles.altTitle}>Healthier Alternatives Exist</Text>
                        </View>
                        <View style={styles.tagsRow}>
                          {item.alternativesConsidered.map((alt, idx) => (
                            <View key={idx} style={styles.altTag}>
                              <Text style={styles.altTagText}>✓ {alt}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Footer note */}
      <View style={styles.footerNote}>
        <NutriIcon name="bulb" size={14} color="#92400E" />
        <Text style={styles.footerNoteText}>
          Manufacturers optimize for cost, shelf life, and palatability — not always consumer health.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  headerIcon: {
    fontSize: 26,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  countBadgeNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
    lineHeight: 20,
  },
  countBadgeLbl: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  purposeIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeIconText: {
    fontSize: 18,
  },
  cardTitleCol: {
    flex: 1,
    gap: 4,
  },
  ingredientName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  purposePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  purposePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chevron: {
    width: 24,
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 11,
    fontWeight: '900',
  },
  detailsBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 0,
  },
  detailSection: {
    paddingVertical: 6,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailSectionIcon: {
    fontSize: 14,
  },
  detailSectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailSectionText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
    fontWeight: '500',
  },
  altTitle: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#065F46',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  altTag: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  altTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
  },
  footerNoteIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
