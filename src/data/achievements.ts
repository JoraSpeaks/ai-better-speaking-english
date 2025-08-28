import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_scenario',
    title: 'First Steps',
    description: 'Complete your first conversation scenario',
    icon: '🎯',
    unlocked: false,
    requirement: {
      type: 'scenarios',
      target: 1,
    },
  },
  {
    id: 'scenario_master',
    title: 'Conversation Master',
    description: 'Complete 5 conversation scenarios',
    icon: '🏆',
    unlocked: false,
    requirement: {
      type: 'scenarios',
      target: 5,
    },
  },
  {
    id: 'scenario_expert',
    title: 'Expert Speaker',
    description: 'Complete 10 conversation scenarios',
    icon: '⭐',
    unlocked: false,
    requirement: {
      type: 'scenarios',
      target: 10,
    },
  },
  {
    id: 'streak_3',
    title: 'Consistency',
    description: 'Practice for 3 days in a row',
    icon: '🔥',
    unlocked: false,
    requirement: {
      type: 'streak',
      target: 3,
    },
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Practice for 7 days in a row',
    icon: '🚀',
    unlocked: false,
    requirement: {
      type: 'streak',
      target: 7,
    },
  },
  {
    id: 'streak_30',
    title: 'Dedication Champion',
    description: 'Practice for 30 days in a row',
    icon: '💎',
    unlocked: false,
    requirement: {
      type: 'streak',
      target: 30,
    },
  },
  {
    id: 'vocab_25',
    title: 'Word Collector',
    description: 'Learn 25 vocabulary words',
    icon: '📚',
    unlocked: false,
    requirement: {
      type: 'vocabulary',
      target: 25,
    },
  },
  {
    id: 'vocab_50',
    title: 'Vocabulary Master',
    description: 'Learn 50 vocabulary words',
    icon: '🎓',
    unlocked: false,
    requirement: {
      type: 'vocabulary',
      target: 50,
    },
  },
  {
    id: 'vocab_100',
    title: 'Word Wizard',
    description: 'Learn 100 vocabulary words',
    icon: '🧙‍♂️',
    unlocked: false,
    requirement: {
      type: 'vocabulary',
      target: 100,
    },
  },
  {
    id: 'pronunciation_80',
    title: 'Clear Speaker',
    description: 'Achieve 80% average pronunciation score',
    icon: '🎤',
    unlocked: false,
    requirement: {
      type: 'pronunciation',
      target: 80,
    },
  },
  {
    id: 'pronunciation_90',
    title: 'Perfect Pronunciation',
    description: 'Achieve 90% average pronunciation score',
    icon: '🎵',
    unlocked: false,
    requirement: {
      type: 'pronunciation',
      target: 90,
    },
  },
  {
    id: 'time_30',
    title: 'Dedicated Learner',
    description: 'Study for 30 minutes total',
    icon: '⏰',
    unlocked: false,
    requirement: {
      type: 'time',
      target: 30,
    },
  },
  {
    id: 'time_60',
    title: 'Study Hero',
    description: 'Study for 1 hour total',
    icon: '🦸‍♂️',
    unlocked: false,
    requirement: {
      type: 'time',
      target: 60,
    },
  },
  {
    id: 'time_300',
    title: 'Learning Machine',
    description: 'Study for 5 hours total',
    icon: '🤖',
    unlocked: false,
    requirement: {
      type: 'time',
      target: 300,
    },
  },
];
