import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LearningCard } from '../components/LearningCard';
import { MobileLearningLesson } from '../../../shared/types';
import { MOCK_LEARNING_LESSONS } from '../services/mockData';

export const LearningScreen: React.FC = () => {
  const [lessons, setLessons] = useState<MobileLearningLesson[]>(MOCK_LEARNING_LESSONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const categories = ['All', 'Additives', 'Sugar & Sodium', 'Manufacturing secrets'];

  const filteredLessons =
    selectedCategory === 'All'
      ? lessons
      : lessons.filter((l) => l.category === selectedCategory);

  const toggleComplete = (id: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isCompleted: !l.isCompleted } : l))
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Mode</Text>
        <Text style={styles.subtitle}>
          Build real food literacy — one scan, one simple concept at a time
        </Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>🎓 Food Literacy Mastery</Text>
          <Text style={styles.progressRatio}>
            {completedCount} / {lessons.length} Learned
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.round((completedCount / lessons.length) * 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressTip}>
          Every barcode scan unlocks an actionable bite-sized lesson on food additives, manufacturing secrets, and label tricks.
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.activeCatChip]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.activeCatText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lesson Cards */}
      {filteredLessons.map((lesson) => (
        <LearningCard key={lesson.id} lesson={lesson} onToggleComplete={toggleComplete} />
      ))}
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
  progressCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressRatio: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DBEAFE',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#1E40AF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 4,
  },
  progressTip: {
    fontSize: 12,
    color: '#EFF6FF',
    lineHeight: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  catChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCatChip: {
    backgroundColor: '#0F172A',
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  activeCatText: {
    color: '#FFFFFF',
  },
});
