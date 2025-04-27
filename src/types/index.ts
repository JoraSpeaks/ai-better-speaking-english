export interface Scenario {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  correctPronunciation?: string;
}

export interface UserProgress {
  completedScenarios: string[];
  score: number;
  level: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
} 