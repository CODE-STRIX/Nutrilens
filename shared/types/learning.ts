export type LessonCategory = 
  | 'Additives & Preservatives'
  | 'Macro & Micro Nutrients'
  | 'Label Reading & Decoding'
  | 'Cardiovascular & Metabolic Health'
  | 'Gut Microbiome';

export interface LearningLesson {
  id: string;
  title: string;
  category: LessonCategory;
  triggerKey?: string; // e.g. "INS_211", "HIGH_SODIUM", "FIBER"
  conceptHeadline: string;
  quickSummary: string;
  detailedScience: string;
  keyTakeaway: string;
  readTimeMinutes: number;
}
