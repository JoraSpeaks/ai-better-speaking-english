import { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'cafe-1',
    title: 'Ordering Coffee',
    description: 'Practice ordering coffee and pastries in a cafe',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
    difficulty: 'beginner',
    conversations: [
      {
        id: '1',
        role: 'assistant',
        text: 'Welcome to our cafe! What would you like to order?',
        audioUrl: 'cafe-welcome.mp3',
      },
      {
        id: '2',
        role: 'user',
        text: 'I would like a cappuccino, please.',
        correctPronunciation: 'I would like a cappuccino, please.',
      },
      {
        id: '3',
        role: 'assistant',
        text: 'Would you like any pastries with that?',
        audioUrl: 'cafe-pastries.mp3',
      },
      {
        id: '4',
        role: 'user',
        text: 'Yes, I would like a croissant, please.',
        correctPronunciation: 'Yes, I would like a croissant, please.',
      },
    ],
  },
  {
    id: 'airport-1',
    title: 'Airport Check-in',
    description: 'Practice checking in at the airport',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
    difficulty: 'intermediate',
    conversations: [
      {
        id: '1',
        role: 'assistant',
        text: 'Good morning! May I see your passport and ticket, please?',
        audioUrl: 'airport-checkin.mp3',
      },
      {
        id: '2',
        role: 'user',
        text: 'Here you go. I would like to check in for my flight to London.',
        correctPronunciation: 'Here you go. I would like to check in for my flight to London.',
      },
      {
        id: '3',
        role: 'assistant',
        text: 'Would you like a window or aisle seat?',
        audioUrl: 'airport-seat.mp3',
      },
      {
        id: '4',
        role: 'user',
        text: 'I prefer a window seat, please.',
        correctPronunciation: 'I prefer a window seat, please.',
      },
    ],
  },
]; 