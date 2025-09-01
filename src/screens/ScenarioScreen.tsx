import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, Text as RNText } from 'react-native';
import { Box, Text, Button } from '../components';
import { PronunciationPractice } from '../components/PronunciationPractice';
import { scenarios } from '../data/scenarios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AudioService } from '../services/AudioService';
import { SpeechService } from '../services/SpeechService';
import { StorageService } from '../services/StorageService';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type ScenarioScreenRouteProp = RouteProp<RootStackParamList, 'Scenario'>;

interface Props {
  route: ScenarioScreenRouteProp;
}

export default function ScenarioScreen({ route }: Props) {
  const { scenarioId } = route.params;
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPronunciationPractice, setShowPronunciationPractice] = useState(false);
  const [pronunciationScores, setPronunciationScores] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    // Preload audio files for better performance
    if (scenario) {
      const audioUrls = scenario.conversations
        .map(c => c.audioUrl)
        .filter(Boolean) as string[];
      AudioService.preloadAudio(audioUrls);
    }

    return () => {
      // Cleanup when leaving screen
      AudioService.stopAllAudio();
    };
  }, [scenario]);

  useEffect(() => {
    // Track study time when component unmounts
    return () => {
      const studyTime = Math.floor((Date.now() - sessionStartTime) / 60000); // Convert to minutes
      if (studyTime > 0) {
        StorageService.addStudyTime(studyTime);
      }
    };
  }, [sessionStartTime]);

  if (!scenario) {
    return (
      <Box variant="container">
        <Text>Scenario not found</Text>
      </Box>
    );
  }

  const currentConversation = scenario.conversations[currentConversationIndex];
  const isUserTurn = currentConversation.role === 'user';
  const isCompleted = currentConversationIndex >= scenario.conversations.length - 1;

  const handleNext = () => {
    if (currentConversationIndex < scenario.conversations.length - 1) {
      setCurrentConversationIndex(currentConversationIndex + 1);
      setShowPronunciationPractice(false);
    }
  };

  const handleSpeak = async () => {
    if (currentConversation.audioUrl) {
      try {
        await AudioService.playAudio(currentConversation.audioUrl);
      } catch (error) {
        console.error('Error playing audio:', error);
        // Fallback to text-to-speech
        fallbackToTTS();
      }
    } else {
      fallbackToTTS();
    }
  };

  const fallbackToTTS = async () => {
    setIsSpeaking(true);
    await SpeechService.speakWithCallback(
      currentConversation.text,
      undefined,
      () => setIsSpeaking(false),
      (error) => {
        console.error('TTS Error:', error);
        setIsSpeaking(false);
      }
    );
  };

  const handlePractice = () => {
    setShowPronunciationPractice(true);
  };

  const handlePronunciationComplete = (score: number) => {
    setPronunciationScores({
      ...pronunciationScores,
      [currentConversation.id]: score
    });
    setShowPronunciationPractice(false);
    
    // Auto-advance if score is good
    if (score >= 80) {
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleCompleteScenario = async () => {
    try {
      await StorageService.completeScenario(scenarioId);
      
      const avgScore = Object.values(pronunciationScores).length > 0
        ? Math.round(Object.values(pronunciationScores).reduce((a, b) => a + b, 0) / Object.values(pronunciationScores).length)
        : 0;

      Alert.alert(
        'Scenario Complete! 🎉',
        `Great job! ${avgScore > 0 ? `Your average pronunciation score: ${avgScore}%` : ''}`,
        [
          { text: 'Continue Learning', onPress: () => {} }
        ]
      );
    } catch (error) {
      console.error('Error completing scenario:', error);
    }
  };

  const getScoreForConversation = (conversationId: string) => {
    return pronunciationScores[conversationId];
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Box variant="container">
        <Text variant="header" marginBottom="l" animated>
          {scenario.title}
        </Text>

        <Box style={styles.progressContainer}>
          <Text variant="body" style={styles.progressText}>
            {currentConversationIndex + 1} of {scenario.conversations.length}
          </Text>
          <Box style={styles.progressBar}>
            <Box 
              style={[
                styles.progressFill,
                { width: `${((currentConversationIndex + 1) / scenario.conversations.length) * 100}%` }
              ]} 
            />
          </Box>
        </Box>

        <Animated.View
          key={currentConversation.id}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Box variant="card" marginBottom="m">
            <Box style={styles.roleIndicator}>
              <Text style={[
                styles.roleText,
                { color: isUserTurn ? '#4A90E2' : '#50E3C2' }
              ]}>
                {isUserTurn ? '👤 You say:' : '🤖 They say:'}
              </Text>
            </Box>

            <Text variant="body" marginBottom="m" style={styles.conversationText}>
              {currentConversation.text}
            </Text>

            {/* Show pronunciation score if available */}
            {isUserTurn && getScoreForConversation(currentConversation.id) && (
              <Box style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  Your score: {getScoreForConversation(currentConversation.id)}% 
                  {getScoreForConversation(currentConversation.id)! >= 90 ? ' 🎉' : 
                   getScoreForConversation(currentConversation.id)! >= 80 ? ' 😊' : 
                   getScoreForConversation(currentConversation.id)! >= 70 ? ' 🙂' : ' 😔'}
                </Text>
              </Box>
            )}

            <Box style={styles.actionContainer}>
              {!isUserTurn && (
                <Button
                  label={isSpeaking ? "Speaking..." : "🔊 Listen"}
                  onPress={handleSpeak}
                  variant="secondary"
                  disabled={isSpeaking}
                  loading={isSpeaking}
                />
              )}

              {isUserTurn && !showPronunciationPractice && (
                <Button
                  label="🎤 Practice Speaking"
                  onPress={handlePractice}
                  variant="primary"
                />
              )}

              {!isUserTurn && (
                <Button
                  label="Next"
                  onPress={handleNext}
                  variant="primary"
                />
              )}
            </Box>
          </Box>

          {/* Pronunciation Practice */}
          {isUserTurn && showPronunciationPractice && (
            <Animated.View entering={FadeIn}>
              <PronunciationPractice
                text={currentConversation.text}
                correctPronunciation={currentConversation.correctPronunciation}
                audioUrl={currentConversation.audioUrl}
                hints={currentConversation.hints}
                onComplete={handlePronunciationComplete}
              />
            </Animated.View>
          )}

          {/* Alternative responses for user turns */}
          {isUserTurn && currentConversation.alternativeResponses && (
            <Box style={styles.alternativesContainer}>
              <Text variant="body" style={styles.alternativesTitle}>
                Other ways to say this:
              </Text>
              {currentConversation.alternativeResponses.map((response, index) => (
                <Text key={index} variant="caption" style={styles.alternativeText}>
                  • {response}
                </Text>
              ))}
            </Box>
          )}
        </Animated.View>

        {/* Vocabulary section */}
        {scenario.vocabulary && scenario.vocabulary.length > 0 && (
          <Box style={styles.vocabularyContainer}>
            <Text variant="header" marginBottom="m">Key Vocabulary</Text>
            {scenario.vocabulary.map((vocab) => (
              <Box key={vocab.id} style={styles.vocabItem}>
                <Text style={styles.vocabWord}>{vocab.word}</Text>
                <Text style={styles.vocabDefinition}>{vocab.definition}</Text>
                <Text style={styles.vocabExample}>"{vocab.example}"</Text>
              </Box>
            ))}
          </Box>
        )}

        {/* Complete scenario button */}
        {isCompleted && (
          <Button
            label="Complete Scenario 🎉"
            onPress={handleCompleteScenario}
            variant="primary"
            size="large"
          />
        )}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  roleIndicator: {
    marginBottom: 12,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  conversationText: {
    fontSize: 18,
    lineHeight: 26,
  },
  scoreContainer: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  alternativesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  alternativeText: {
    fontSize: 13,
    marginBottom: 4,
    color: '#777',
    paddingLeft: 8,
  },
  vocabularyContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
  vocabItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  vocabWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vocabDefinition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  vocabExample: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
  },
}); 
