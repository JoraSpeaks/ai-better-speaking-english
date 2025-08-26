# AI Better Speaking English App 🗣️✨

An AI-first React Native app designed to help users improve their English speaking skills through interactive conversations, pronunciation practice, and vocabulary building.

## Features 🚀

### 🎯 Interactive Scenarios
- **Real-world conversations**: Practice ordering coffee, checking into hotels, shopping, and more
- **Progressive difficulty**: Beginner, intermediate, and advanced levels
- **Audio playback**: Native speaker pronunciations for each conversation
- **Alternative responses**: Learn multiple ways to express the same idea
- **Hints and tips**: Contextual guidance for better pronunciation

### 🤖 AI Conversation Practice
- **Natural conversations**: Chat with an AI assistant on various topics
- **Adaptive responses**: AI adjusts complexity based on your skill level
- **Real-time feedback**: Pronunciation scoring and improvement suggestions
- **Multiple topics**: Daily life, travel, work, culture, technology, and more

### 📚 Smart Flashcards
- **Spaced repetition**: Scientifically-proven learning algorithm
- **Interactive cards**: Flip cards with audio pronunciation
- **Category filtering**: Focus on specific vocabulary areas
- **Progress tracking**: Monitor your vocabulary mastery
- **Audio support**: Hear correct pronunciations for every word

### 🎤 Pronunciation Practice
- **Speech recognition**: Advanced pronunciation analysis
- **Detailed feedback**: Get scores for accuracy, fluency, and completeness
- **Phoneme analysis**: Word-by-word pronunciation breakdown
- **Haptic feedback**: Physical feedback for pronunciation quality
- **Progress tracking**: Monitor improvement over time

### 📊 Progress Tracking
- **Achievement system**: Unlock badges and celebrate milestones
- **Daily streaks**: Build consistent learning habits
- **Study time tracking**: Monitor your dedication and effort
- **Pronunciation analytics**: See your speaking improvement over time
- **Vocabulary mastery**: Track words learned and retention rates

## Technology Stack 🛠️

### Core Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript for better development

### Navigation & UI
- **React Navigation**: Bottom tabs and stack navigation
- **Restyle**: Type-safe styling system
- **React Native Reanimated**: Smooth animations and transitions
- **React Native Gesture Handler**: Touch interactions

### Audio & Speech
- **Expo AV**: Audio playback and recording
- **Expo Speech**: Text-to-speech functionality
- **Speech recognition**: Pronunciation analysis (mockup with real API integration ready)

### Data & Storage
- **AsyncStorage**: Local data persistence
- **Custom storage service**: User progress and preferences
- **Spaced repetition algorithm**: Optimized flashcard scheduling

### Additional Features
- **Expo Haptics**: Physical feedback for interactions
- **React Native Progress**: Visual progress indicators
- **Custom vector icons**: Emoji-based navigation icons

## App Structure 📁

```
src/
├── components/          # Reusable UI components
│   ├── Box.tsx         # Styled container component
│   ├── Text.tsx        # Styled text component
│   ├── Button.tsx      # Interactive button component
│   ├── Flashcard.tsx   # Flip card for vocabulary
│   ├── PronunciationPractice.tsx  # Speech recording & analysis
│   └── AIConversation.tsx         # AI chat interface
├── screens/            # Main app screens
│   ├── HomeScreen.tsx            # Scenario selection
│   ├── ScenarioScreen.tsx        # Conversation practice
│   ├── FlashcardScreen.tsx       # Vocabulary review
│   ├── AIConversationScreen.tsx  # AI chat setup
│   └── ProfileScreen.tsx         # Progress tracking
├── navigation/         # App navigation setup
│   └── AppNavigator.tsx          # Tab and stack navigation
├── services/           # Business logic and APIs
│   ├── StorageService.ts         # Data persistence
│   ├── AudioService.ts           # Audio playback/recording
│   └── SpeechService.ts          # TTS and speech analysis
├── data/              # Static data and content
│   ├── scenarios.ts              # Conversation scenarios
│   ├── flashcards.ts             # Vocabulary cards
│   └── achievements.ts           # Gamification system
├── theme/             # Design system
│   └── theme.ts                  # Colors, spacing, typography
└── types/             # TypeScript interfaces
    └── index.ts                  # App-wide type definitions
```

## Key Features Breakdown 🔍

### Scenario-Based Learning
The app provides realistic conversation scenarios that users might encounter in English-speaking environments:

- **Cafe ordering**: Practice food and drink vocabulary
- **Airport check-in**: Learn travel-related phrases
- **Hotel booking**: Master hospitality conversations
- **Shopping**: Navigate retail interactions
- **Restaurant dining**: Handle food service situations

Each scenario includes:
- Audio examples from native speakers
- User pronunciation practice
- Alternative response suggestions
- Contextual hints and tips
- Progressive difficulty levels

### AI-Powered Conversations
The AI conversation feature simulates natural dialogue:

- **Topic selection**: Choose from 8+ conversation topics
- **Skill-level adaptation**: Beginner, intermediate, and advanced responses
- **Natural flow**: AI responds contextually to user input
- **Pronunciation integration**: Practice speaking within conversations
- **Progress tracking**: Monitor conversation frequency and quality

### Smart Flashcard System
Vocabulary learning through spaced repetition:

- **20+ initial flashcards** across multiple categories
- **Adaptive scheduling**: Cards appear based on difficulty and retention
- **Audio pronunciation**: Hear correct word pronunciations
- **Visual design**: Attractive flip-card animations
- **Progress tracking**: Monitor vocabulary mastery levels

### Comprehensive Progress System
Track learning across multiple dimensions:

- **XP and levels**: Gamified progression system
- **Achievement badges**: 14 different accomplishments to unlock
- **Daily streaks**: Encourage consistent practice
- **Pronunciation analytics**: Track speaking improvement
- **Vocabulary metrics**: Monitor word learning and retention
- **Study time tracking**: See total learning investment

## Installation & Setup 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-better-speaking-english.git
   cd ai-better-speaking-english
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - iOS: Press `i` in terminal or scan QR code with Camera app
   - Android: Press `a` in terminal or scan QR code with Expo Go app

## Audio Assets 🎵

The app is designed to work with MP3 audio files for realistic pronunciation practice. Audio files should be placed in `assets/audio/` directory:

- `cafe-welcome.mp3`
- `cafe-pastries.mp3`
- `airport-checkin.mp3`
- `hotel-greeting.mp3`
- And more...

*Note: Current implementation includes placeholders. Replace with actual recorded audio files from native English speakers.*

## Speech Recognition Integration 🎤

The app includes a mock speech recognition system. For production use, integrate with:

- **Google Cloud Speech-to-Text**
- **Azure Cognitive Services Speech**
- **AWS Transcribe**
- **Apple Speech Framework** (iOS)
- **Android SpeechRecognizer** (Android)

## Customization Options ⚙️

### Adding New Scenarios
1. Update `src/data/scenarios.ts`
2. Add conversation flows with audio references
3. Include vocabulary and grammar points
4. Set appropriate difficulty levels

### Adding Vocabulary
1. Extend `src/data/flashcards.ts`
2. Include definitions, examples, and audio references
3. Set categories and difficulty levels
4. Update spaced repetition parameters

### Adding Achievements
1. Modify `src/data/achievements.ts`
2. Define unlock conditions and rewards
3. Add icons and descriptions
4. Update progress checking logic

## Future Enhancements 🔮

- **Video conversations**: Practice with video scenarios
- **Group conversations**: Multi-person dialogue practice
- **Voice recognition**: Real-time speech-to-text integration
- **Custom scenarios**: User-generated conversation practice
- **Social features**: Share progress with friends
- **Offline mode**: Practice without internet connection
- **Accent training**: Region-specific pronunciation practice
- **Grammar exercises**: Dedicated grammar practice modules

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Who Designed This App?

**Pierre-Henry Soria**. A **super passionate engineer** who loves automating content creation efficiently!

Enthusiast of YouTube, AI, learning, and—of course—writing! Find me at [pH7.me](https://ph7.me)

Enjoying this project? **[Buy me a coffee](https://ko-fi.com/phenry)** (spoiler: I love almond extra-hot flat white coffees).

[![Pierre-Henry Soria](https://s.gravatar.com/avatar/a210fe61253c43c869d71eaed0e90149?s=200)](https://ph7.me "Pierre-Henry Soria’s personal website")

[![@phenrysay][x-icon]](https://x.com/phenrysay "Follow Me on X")  [![YouTube Tech Videos][youtube-icon]](https://www.youtube.com/@pH7Programming "My YouTube Tech Channel")  [![pH-7][github-icon]](https://github.com/pH-7 "Follow Me on GitHub")  [![BlueSky][bsky-icon]](https://bsky.app/profile/ph7s.bsky.social "Follow Me on BlueSky")


## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Happy Learning! 🎉 Improve your English speaking skills with AI-powered practice!**


<!-- GitHub's Markdown reference links -->
[x-icon]: https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x
[bsky-icon]: https://img.shields.io/badge/BlueSky-00A8E8?style=for-the-badge&logo=bluesky&logoColor=white
[github-icon]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[youtube-icon]: https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white
