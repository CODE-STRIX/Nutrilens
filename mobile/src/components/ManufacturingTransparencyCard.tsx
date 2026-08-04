import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PersonDManufacturingRationale } from '../../../shared/types';

interface Props {
  summaries: PersonDManufacturingRationale[];
}

export const ManufacturingTransparencyCard: React.FC<Props> = ({ summaries }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!summaries || summaries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Food Manufacturing Transparency</Text>
        <Text style={styles.subtitle}>No specific industrial additive rationale for this item.</Text>
      </View>
    );
  }

  const getBadgeStyle = (purpose: PersonDManufacturingRationale['primaryPurpose']) => {
    switch (purpose) {
      case 'cost':
        return { backgroundColor: '#FEF3C7', color: '#92400E', label: 'Cost Efficiency' };
      case 'shelf_life':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', label: 'Shelf Life' };
      case 'texture':
        return { backgroundColor: '#E0E7FF', color: '#3730A3', label: 'Texture & Mouthfeel' };
      case 'flavour':
        return { backgroundColor: '#FCE7F3', color: '#9D174D', label: 'Flavor Enhancement' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', label: 'Processing' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🏭 Manufacturing Transparency</Text>
        <Text style={styles.badgeLabel}>Why it's in your food</Text>
      </View>
      <Text style={styles.subtitle}>
        Explaining why food manufacturers selected these specific ingredients:
      </Text>

      {summaries.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const badge = getBadgeStyle(item.primaryPurpose);

        return (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpandedIndex(isExpanded ? null : index)}
              activeOpacity={0.7}
            >
              <View style={styles.nameRow}>
                <Text style={styles.ingredientName}>{item.ingredientName}</Text>
                <View style={[styles.purposeBadge, { backgroundColor: badge.backgroundColor }]}>
                  <Text style={[styles.purposeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              </View>
              <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.detailsBody}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Manufacturer Choice:</Text>
                  <Text style={styles.sectionText}>{item.explanation}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Industry Context:</Text>
                  <Text style={styles.sectionText}>{item.industryContext}</Text>
                </View>

                {item.alternativesConsidered && item.alternativesConsidered.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Better Alternatives:</Text>
                    <View style={styles.tagsRow}>
                      {item.alternativesConsidered.map((alt, idx) => (
                        <View key={idx} style={styles.tag}>
                          <Text style={styles.tagText}>{alt}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  badgeLabel: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: 8,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  purposeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  detailsBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  section: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
});
