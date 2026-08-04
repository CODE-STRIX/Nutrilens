import lessonsData from '../../data/learning-lessons.json';
import { LearningLesson } from '../../../shared/types/learning';

const lessons: LearningLesson[] = lessonsData as LearningLesson[];

export const LearningService = {
  /**
   * Get a lesson relevant to the last scanned product context.
   * Looks for a lesson whose triggerKey matches any of the provided keys
   * (e.g. ingredient INS codes or nutrient flags). Falls back to a
   * random lesson if no match is found so every scan teaches something.
   */
  getLessonForScan: (triggerKeys: string[] = []): LearningLesson => {
    if (triggerKeys.length > 0) {
      for (const key of triggerKeys) {
        const match = lessons.find(l => l.triggerKey === key);
        if (match) return match;
      }
    }
    // Fallback: return a pseudo-random lesson based on time of day
    const index = new Date().getMinutes() % lessons.length;
    return lessons[index];
  },

  /**
   * Get all available learning lessons (for the Learning Library browser view).
   */
  getAllLessons: (): LearningLesson[] => {
    return lessons;
  },

  /**
   * Get a specific lesson by ID.
   */
  getLessonById: (id: string): LearningLesson | undefined => {
    return lessons.find(l => l.id === id);
  }
};
