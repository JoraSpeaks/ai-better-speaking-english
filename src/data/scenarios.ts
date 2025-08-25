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
        hints: ['Remember to be polite', 'Use "would like" for orders'],
        alternativeResponses: ['Can I have a cappuccino?', 'I\'ll have a cappuccino, please.']
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
        hints: ['Say "Yes" first', 'Pronounce croissant as "kruh-SANT"'],
        alternativeResponses: ['Yes, a croissant would be great.', 'I\'ll take a croissant too.']
      },
      {
        id: '5',
        role: 'assistant',
        text: 'That will be $8.50. Cash or card?',
        audioUrl: 'cafe-payment.mp3',
      },
      {
        id: '6',
        role: 'user',
        text: 'Card, please.',
        correctPronunciation: 'Card, please.',
        hints: ['Keep it simple and polite'],
        alternativeResponses: ['I\'ll pay by card.', 'Credit card, please.']
      },
    ],
    vocabulary: [
      {
        id: 'v1',
        word: 'cappuccino',
        definition: 'An Italian coffee drink prepared with espresso and steamed milk foam',
        example: 'I would like a cappuccino, please.',
        pronunciation: '/ˌkæpʊˈtʃiːnoʊ/',
        audioUrl: 'vocab-cappuccino.mp3',
        difficulty: 'beginner',
        category: 'drinks'
      },
      {
        id: 'v2',
        word: 'croissant',
        definition: 'A buttery, flaky, viennoiserie pastry',
        example: 'I would like a croissant with my coffee.',
        pronunciation: '/krʊˈsɑːnt/',
        audioUrl: 'vocab-croissant.mp3',
        difficulty: 'beginner',
        category: 'food'
      }
    ]
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
        hints: ['Hand over documents first', 'State your destination clearly'],
        alternativeResponses: ['Here they are. I\'m flying to London.', 'Here are my documents. London flight, please.']
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
        hints: ['Express your preference clearly', 'Window = by the window, Aisle = by the walkway'],
        alternativeResponses: ['Window seat, please.', 'I\'d like a window seat if possible.']
      },
      {
        id: '5',
        role: 'assistant',
        text: 'Do you have any bags to check?',
        audioUrl: 'airport-baggage.mp3',
      },
      {
        id: '6',
        role: 'user',
        text: 'Yes, I have one suitcase to check.',
        correctPronunciation: 'Yes, I have one suitcase to check.',
        hints: ['Specify the number of bags', 'Check = put in cargo hold'],
        alternativeResponses: ['Just one bag to check.', 'Yes, one suitcase please.']
      },
    ],
    vocabulary: [
      {
        id: 'v3',
        word: 'check-in',
        definition: 'The process of registering for a flight',
        example: 'I need to check in for my flight.',
        pronunciation: '/ˈtʃɛk ɪn/',
        audioUrl: 'vocab-checkin.mp3',
        difficulty: 'intermediate',
        category: 'travel'
      },
      {
        id: 'v4',
        word: 'boarding pass',
        definition: 'A document that gives you permission to board the plane',
        example: 'Here is your boarding pass.',
        pronunciation: '/ˈbɔːrdɪŋ pæs/',
        audioUrl: 'vocab-boardingpass.mp3',
        difficulty: 'intermediate',
        category: 'travel'
      }
    ]
  },
  {
    id: 'restaurant-1',
    title: 'Dining at a Restaurant',
    description: 'Practice ordering food and interacting with restaurant staff',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    difficulty: 'intermediate',
    conversations: [
      {
        id: '1',
        role: 'assistant',
        text: 'Good evening! Do you have a reservation?',
        audioUrl: 'restaurant-greeting.mp3',
      },
      {
        id: '2',
        role: 'user',
        text: 'Yes, I have a reservation under Johnson.',
        correctPronunciation: 'Yes, I have a reservation under Johnson.',
        hints: ['State you have a reservation', 'Give the name it\'s under'],
        alternativeResponses: ['Yes, under the name Johnson.', 'I have a table booked under Johnson.']
      },
      {
        id: '3',
        role: 'assistant',
        text: 'Perfect! Right this way. Here\'s our menu. Can I start you with something to drink?',
        audioUrl: 'restaurant-menu.mp3',
      },
      {
        id: '4',
        role: 'user',
        text: 'I\'ll have a glass of water and a coffee, please.',
        correctPronunciation: 'I\'ll have a glass of water and a coffee, please.',
        hints: ['Order drinks first', 'Be specific about quantities'],
        alternativeResponses: ['Water and coffee, please.', 'Can I get water and a coffee?']
      },
    ],
    vocabulary: [
      {
        id: 'v5',
        word: 'reservation',
        definition: 'A booking for a table at a restaurant',
        example: 'I have a reservation for two people.',
        pronunciation: '/ˌrɛzərˈveɪʃən/',
        audioUrl: 'vocab-reservation.mp3',
        difficulty: 'intermediate',
        category: 'dining'
      }
    ]
  },
  {
    id: 'hotel-1',
    title: 'Hotel Check-in',
    description: 'Practice checking into a hotel and asking about amenities',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    difficulty: 'beginner',
    conversations: [
      {
        id: '1',
        role: 'assistant',
        text: 'Welcome to our hotel! Are you checking in?',
        audioUrl: 'hotel-checkin.mp3',
      },
      {
        id: '2',
        role: 'user',
        text: 'Yes, I have a reservation under Smith.',
        correctPronunciation: 'Yes, I have a reservation under Smith.',
        hints: ['Confirm you\'re checking in', 'Provide your name'],
        alternativeResponses: ['Yes, under the name Smith.', 'I\'m checking in. The name is Smith.']
      },
      {
        id: '3',
        role: 'assistant',
        text: 'Great! Here\'s your key card. Your room is on the 5th floor. The elevators are to your right.',
        audioUrl: 'hotel-room.mp3',
      },
      {
        id: '4',
        role: 'user',
        text: 'Thank you. What time is breakfast served?',
        correctPronunciation: 'Thank you. What time is breakfast served?',
        hints: ['Say thank you first', 'Ask about hotel services'],
        alternativeResponses: ['Thanks. When is breakfast?', 'Thank you. What are the breakfast hours?']
      },
    ],
    vocabulary: [
      {
        id: 'v6',
        word: 'key card',
        definition: 'A plastic card used to unlock hotel room doors',
        example: 'Here is your key card for room 305.',
        pronunciation: '/ki kɑrd/',
        audioUrl: 'vocab-keycard.mp3',
        difficulty: 'beginner',
        category: 'hotel'
      }
    ]
  },
  {
    id: 'shopping-1',
    title: 'Shopping for Clothes',
    description: 'Practice shopping for clothing and asking about sizes',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    difficulty: 'intermediate',
    conversations: [
      {
        id: '1',
        role: 'assistant',
        text: 'Hi there! Can I help you find anything today?',
        audioUrl: 'shopping-greeting.mp3',
      },
      {
        id: '2',
        role: 'user',
        text: 'Yes, I\'m looking for a blue shirt in size medium.',
        correctPronunciation: 'Yes, I\'m looking for a blue shirt in size medium.',
        hints: ['Be specific about what you want', 'Include color and size'],
        alternativeResponses: ['I need a medium blue shirt.', 'Do you have blue shirts in medium?']
      },
      {
        id: '3',
        role: 'assistant',
        text: 'We have several options. Would you like to try this one on? The fitting rooms are over there.',
        audioUrl: 'shopping-fitting.mp3',
      },
      {
        id: '4',
        role: 'user',
        text: 'Yes, I\'d like to try it on. Thank you.',
        correctPronunciation: 'Yes, I\'d like to try it on. Thank you.',
        hints: ['Accept the offer', 'Be polite'],
        alternativeResponses: ['That would be great, thanks.', 'Yes, please. Where are the fitting rooms?']
      },
    ],
    vocabulary: [
      {
        id: 'v7',
        word: 'fitting room',
        definition: 'A small room where you can try on clothes before buying',
        example: 'The fitting rooms are at the back of the store.',
        pronunciation: '/ˈfɪtɪŋ rum/',
        audioUrl: 'vocab-fittingroom.mp3',
        difficulty: 'intermediate',
        category: 'shopping'
      }
    ]
  }
]; 