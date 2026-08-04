import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MobileLearningLesson } from '../../../shared/types';

interface Props {
  lesson: MobileLearningLesson;
  onToggleComplete?: (lessonId: string) => void;
}

export const LearningCard: React.FC<Props> = ({ lesson, onToggleComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.container, lesson.isCompleted && styles.completedContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{lesson.category}</Text>
        </View>
        <Text style={styles.readTime}>⏱️ {lesson.readTimeMinutes} min read</Text>
      </View>

      {/* Lesson Title */}
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.summary}>{lesson.conceptSummary}</Text>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.body}>
          <Text style={styles.fullContent}>{lesson.fullContent}</Text>
          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayTitle}>📌 Key Takeaway:</Text>
            <Text style={styles.takeawayText}>{lesson.keyTakeaway}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandBtnText}>
            {isExpanded ? 'Show Less ▲' : 'Read Full Concept →'}
          </Text>
        </TouchableOpacity>

        {onToggleComplete && (
          <TouchableOpacity
            style={[styles.completeBtn, lesson.isCompleted && styles.completedBtn]}
            onPress={() => onToggleComplete(lesson.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.completeBtnText, lesson.isCompleted && styles.completedBtnText]}>
              {lesson.isCompleted ? '✓ Completed' : 'Mark Learned'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  completedContainer: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  readTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  fullContent: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  takeawayBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 10,
  },
  takeawayTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  expandBtn: {
    paddingVertical: 4,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  completeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedBtn: {
    backgroundColor: '#DCFCE7',
  },
  completeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  completedBtnText: {
    color: '#15803D',
  },
});
