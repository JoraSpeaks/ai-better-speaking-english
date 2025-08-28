import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Achievement, Flashcard } from '../types';
import { achievements } from '../data/achievements';
import { initialFlashcards } from '../data/flashcards';

const STORAGE_KEYS = {
  USER_PROGRESS: 'userProgress',
  FLASHCARDS: 'flashcards',
  SETTINGS: 'settings',
} as const;

const defaultUserProgress: UserProgress = {
  completedScenarios: [],
  score: 0,
  level: 1,
  achievements: achievements.map(a => ({ ...a, unlocked: false })),
  vocabularyMastery: {},
  dailyStreak: 0,
  totalStudyTime: 0,
  pronunciationScores: {},
};

export class StorageService {
  static async getUserProgress(): Promise<UserProgress> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultUserProgress;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return defaultUserProgress;
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  static async getFlashcards(): Promise<Flashcard[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (stored) {
        return JSON.parse(stored);
      }
      // First time - save initial flashcards
      await this.saveFlashcards(initialFlashcards);
      return initialFlashcards;
    } catch (error) {
      console.error('Error loading flashcards:', error);
      return initialFlashcards;
    }
  }

  static async saveFlashcards(flashcards: Flashcard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
    } catch (error) {
      console.error('Error saving flashcards:', error);
    }
  }

  static async updateFlashcard(flashcard: Flashcard): Promise<void> {
    try {
      const flashcards = await this.getFlashcards();
      const index = flashcards.findIndex(f => f.id === flashcard.id);
      if (index !== -1) {
        flashcards[index] = flashcard;
        await this.saveFlashcards(flashcards);
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  }

  static async completeScenario(scenarioId: string): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress();
      
      if (!progress.completedScenarios.includes(scenarioId)) {
        progress.completedScenarios.push(scenarioId);
        progress.score += 100;
        
        // Check for level up
        const newLevel = Math.floor(progress.score / 500) + 1;
        progress.level = newLevel;
        
        // Update daily streak
        const today = new Date().toDateString();
        const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate).toDateString() : '';
        
        if (today !== lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastActive === yesterday.toDateString()) {
            progress.dailyStreak += 1;
          } else {
            progress.dailyStreak = 1;
          }
          progress.lastActiveDate = new Date();
        }
        
        // Check achievements
        progress.achievements = this.checkAchievements(progress);
        
        await this.saveUserProgress(progress);
      }
      
      return progress;
    } catch (error) {
      console.error('Error completing scenario:', error);
      return await this.getUserProgress();
    }
  }

  static async addStudyTime(minutes: number): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      progress.totalStudyTime += minutes;
      progress.achievements = this.checkAchievements(progress);
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error adding study time:', error);
    }
  }

  static async updatePronunciationScore(phrase: string, score: number): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      progress.pronunciationScores[phrase] = score;
      progress.achievements = this.checkAchievements(progress);
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error updating pronunciation score:', error);
    }
  }

  static async updateVocabularyMastery(wordId: string, mastery: number): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      progress.vocabularyMastery[wordId] = mastery;
      progress.achievements = this.checkAchievements(progress);
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error updating vocabulary mastery:', error);
    }
  }

  private static checkAchievements(progress: UserProgress): Achievement[] {
    return progress.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case 'scenarios':
          shouldUnlock = progress.completedScenarios.length >= achievement.requirement.target;
          break;
        case 'streak':
          shouldUnlock = progress.dailyStreak >= achievement.requirement.target;
          break;
        case 'vocabulary':
          const learnedWords = Object.values(progress.vocabularyMastery).filter(m => m >= 80).length;
          shouldUnlock = learnedWords >= achievement.requirement.target;
          break;
        case 'pronunciation':
          const scores = Object.values(progress.pronunciationScores);
          const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          shouldUnlock = avgScore >= achievement.requirement.target;
          break;
        case 'time':
          shouldUnlock = progress.totalStudyTime >= achievement.requirement.target;
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedDate: new Date(),
        };
      }

      return achievement;
    });
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
