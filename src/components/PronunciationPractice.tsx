import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, Text, Button } from '../components';
import { SpeechService } from '../services/SpeechService';
import { AudioService } from '../services/AudioService';
import { StorageService } from '../services/StorageService';
import { PronunciationResult } from '../types';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface PronunciationPracticeProps {
  text: string;
  correctPronunciation?: string;
  audioUrl?: string;
  hints?: string[];
  onComplete?: (score: number) => void;
}

export const PronunciationPractice = ({
  text,
  correctPronunciation,
  audioUrl,
  hints = [],
  onComplete,
}: PronunciationPracticeProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (currentRecording) {
        AudioService.stopRecording(currentRecording);
      }
    };
  }, [currentRecording]);

  const handleListen = async () => {
    try {
      if (audioUrl) {
        await AudioService.playAudio(audioUrl);
      } else {
        await SpeechService.speak(correctPronunciation || text);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      const recording = await AudioService.recordAudio();
      if (recording) {
        setCurrentRecording(recording);
        setIsRecording(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Alert.alert('Error', 'Could not start recording. Please check microphone permissions.');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      if (currentRecording) {
        setIsRecording(false);
        const uri = await AudioService.stopRecording(currentRecording);
        setRecordingUri(uri);
        setCurrentRecording(null);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        if (uri) {
          await analyzeRecording(uri);
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const analyzeRecording = async (uri: string) => {
    try {
      setIsAnalyzing(true);
      const result = await SpeechService.analyzePronunciation(
        uri,
        correctPronunciation || text
      );
      
      setPronunciationResult(result);
      await StorageService.updatePronunciationScore(text, result.score);
      
      // Haptic feedback based on score
      if (result.score >= 90) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (result.score >= 70) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      
      if (onComplete) {
        onComplete(result.score);
      }
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      Alert.alert('Error', 'Failed to analyze pronunciation');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTryAgain = () => {
    setPronunciationResult(null);
    setRecordingUri(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50'; // Green
    if (score >= 80) return '#FF9800'; // Orange
    if (score >= 70) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '😊';
    if (score >= 70) return '🙂';
    return '😔';
  };

  return (
    <Box style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.textContainer}>
        <Text variant="header" style={styles.practiceText}>
          {text}
        </Text>
        
        {correctPronunciation && correctPronunciation !== text && (
          <Text variant="body" style={styles.pronunciationGuide}>
            Pronunciation: {correctPronunciation}
          </Text>
        )}
      </Animated.View>

      <Box style={styles.buttonContainer}>
        <Button
          label="🔊 Listen"
          onPress={handleListen}
          variant="secondary"
          size="medium"
        />
        
        {hints.length > 0 && (
          <Button
            label={showHints ? "Hide Hints" : "💡 Show Hints"}
            onPress={() => setShowHints(!showHints)}
            variant="outline"
            size="medium"
          />
        )}
      </Box>

      {showHints && hints.length > 0 && (
        <Animated.View entering={SlideInUp} style={styles.hintsContainer}>
          <Text variant="body" style={styles.hintsTitle}>Pronunciation Hints:</Text>
          {hints.map((hint, index) => (
            <Text key={index} variant="body" style={styles.hint}>
              • {hint}
            </Text>
          ))}
        </Animated.View>
      )}

      <Box style={styles.recordingContainer}>
        {!isRecording ? (
          <Button
            label="🎤 Start Recording"
            onPress={handleStartRecording}
            variant="primary"
            size="large"
            disabled={isAnalyzing}
          />
        ) : (
          <Button
            label="⏹️ Stop Recording"
            onPress={handleStopRecording}
            variant="error"
            size="large"
          />
        )}
      </Box>

      {isAnalyzing && (
        <Animated.View entering={FadeIn} style={styles.analyzingContainer}>
          <Text variant="body">Analyzing your pronunciation...</Text>
        </Animated.View>
      )}

      {pronunciationResult && (
        <Animated.View entering={SlideInUp} style={styles.resultContainer}>
          <Text variant="header" style={styles.scoreTitle}>
            Your Score: {pronunciationResult.score}% {getScoreEmoji(pronunciationResult.score)}
          </Text>
          
          <Box 
            style={[
              styles.scoreBar,
              { backgroundColor: getScoreColor(pronunciationResult.score) }
            ]}
          >
            <Box 
              style={[
                styles.scoreBarFill,
                { width: `${pronunciationResult.score}%` }
              ]}
            />
          </Box>

          <Text variant="body" style={styles.feedback}>
            {pronunciationResult.feedback}
          </Text>

          <Box style={styles.detailedScores}>
            <Box style={styles.scoreItem}>
              <Text variant="caption">Accuracy</Text>
              <Text variant="body">{pronunciationResult.detailedScores.accuracy}%</Text>
            </Box>
            <Box style={styles.scoreItem}>
              <Text variant="caption">Fluency</Text>
              <Text variant="body">{pronunciationResult.detailedScores.fluency}%</Text>
            </Box>
            <Box style={styles.scoreItem}>
              <Text variant="caption">Completeness</Text>
              <Text variant="body">{pronunciationResult.detailedScores.completeness}%</Text>
            </Box>
          </Box>

          {pronunciationResult.phonemes.length > 0 && (
            <Box style={styles.phonemeContainer}>
              <Text variant="body" style={styles.phonemeTitle}>Word Analysis:</Text>
              {pronunciationResult.phonemes.map((phoneme, index) => (
                <Box key={index} style={styles.phonemeItem}>
                  <Text variant="body" style={styles.phonemeWord}>
                    {phoneme.phoneme}: {phoneme.accuracy}%
                  </Text>
                  <Text variant="caption" style={styles.phonemeFeedback}>
                    {phoneme.feedback}
                  </Text>
                </Box>
              ))}
            </Box>
          )}

          <Button
            label="Try Again"
            onPress={handleTryAgain}
            variant="outline"
            size="medium"
          />
        </Animated.View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  practiceText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pronunciationGuide: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  hintsContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  hintsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hint: {
    marginBottom: 4,
    paddingLeft: 10,
  },
  recordingContainer: {
    marginBottom: 20,
  },
  analyzingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  feedback: {
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  detailedScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  scoreItem: {
    alignItems: 'center',
  },
  phonemeContainer: {
    width: '100%',
    marginBottom: 15,
  },
  phonemeTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phonemeItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  phonemeWord: {
    fontWeight: '600',
  },
  phonemeFeedback: {
    color: '#666',
    marginTop: 2,
  },
});
