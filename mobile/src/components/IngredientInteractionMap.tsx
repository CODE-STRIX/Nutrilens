import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IngredientInteractionMap as MapType, InteractionNode } from '../../../shared/types';

interface Props {
  interactionMap?: MapType;
}

export const IngredientInteractionMap: React.FC<Props> = ({ interactionMap }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (!interactionMap || !interactionMap.nodes || interactionMap.nodes.length === 0) {
    return null;
  }

  const selectedNode = interactionMap.nodes.find((n) => n.id === selectedNodeId);

  const getNodeColor = (type: InteractionNode['type'], isSelected: boolean) => {
    if (isSelected) {
      return { bg: '#2563EB', text: '#FFFFFF', border: '#1D4ED8' };
    }
    switch (type) {
      case 'food_category':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
      case 'ingredient':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      case 'purpose':
        return { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' };
      default:
        return { bg: '#F1F5F9', text: '#334155', border: '#E2E8F0' };
    }
  };

  const getNodeIcon = (type: InteractionNode['type']) => {
    switch (type) {
      case 'food_category':
        return '📦';
      case 'ingredient':
        return '🧪';
      case 'purpose':
        return '🎯';
      default:
        return '🔗';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Ingredient Interaction Map</Text>
        <Text style={styles.subtitle}>
          Tap any node to explore connections between additives, manufacturing purpose, and shared everyday foods.
        </Text>
      </View>

      {/* Visual Graph Layout */}
      <View style={styles.graphContainer}>
        {interactionMap.nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const colors = getNodeColor(node.type, isSelected);
          const icon = getNodeIcon(node.type);

          return (
            <TouchableOpacity
              key={node.id}
              style={[
                styles.nodeChip,
                { backgroundColor: colors.bg, borderColor: colors.border },
                isSelected && styles.selectedNodeChip,
              ]}
              onPress={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.nodeIcon}>{icon}</Text>
              <Text style={[styles.nodeLabel, { color: colors.text }]}>{node.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Interactive Detail Inspector Drawer */}
      {selectedNode && (
        <View style={styles.inspectorCard}>
          <View style={styles.inspectorHeader}>
            <Text style={styles.inspectorIcon}>{getNodeIcon(selectedNode.type)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.inspectorTitle}>{selectedNode.label}</Text>
              <Text style={styles.inspectorType}>
                Type: {selectedNode.type.toUpperCase().replace('_', ' ')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedNodeId(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inspectorDescription}>{selectedNode.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  graphContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  nodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  selectedNodeChip: {
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  nodeIcon: {
    fontSize: 14,
  },
  nodeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  inspectorCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  inspectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  inspectorIcon: {
    fontSize: 18,
  },
  inspectorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inspectorType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94A3B8',
    padding: 4,
  },
  inspectorDescription: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
});
