export interface Scenario {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  conversations: Conversation[];
  vocabulary?: VocabularyItem[];
  grammar?: GrammarPoint[];
}

export interface Conversation {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  correctPronunciation?: string;
  hints?: string[];
  alternativeResponses?: string[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  example: string;
  pronunciation: string;
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  type: 'fill-blank' | 'multiple-choice' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  imageUrl?: string;
  example?: string;
  isLearned: boolean;
  lastReviewed?: Date;
  reviewCount: number;
  easeFactor: number;
  interval: number;
}

export interface UserProgress {
  completedScenarios: string[];
  score: number;
  level: number;
  achievements: Achievement[];
  vocabularyMastery: Record<string, number>; // word -> mastery level (0-100)
  dailyStreak: number;
  lastActiveDate?: Date;
  totalStudyTime: number; // in minutes
  pronunciationScores: Record<string, number>; // phrase -> score (0-100)
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  requirement: {
    type: 'scenarios' | 'streak' | 'vocabulary' | 'pronunciation' | 'time';
    target: number;
  };
}

export interface PronunciationResult {
  score: number; // 0-100
  feedback: string;
  detailedScores: {
    accuracy: number;
    fluency: number;
    completeness: number;
  };
  phonemes: PhonemeScore[];
}

export interface PhonemeScore {
  phoneme: string;
  accuracy: number;
  feedback: string;
}

export interface AIConversationState {
  isActive: boolean;
  context: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  audioUrl?: string;
  pronunciationScore?: number;
} 