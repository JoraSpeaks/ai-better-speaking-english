import * as Speech from 'expo-speech';
import { PronunciationResult } from '../types';

export class SpeechService {
  static async speak(text: string, options?: Speech.SpeechOptions): Promise<void> {
    try {
      const defaultOptions: Speech.SpeechOptions = {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        ...options,
      };

      await Speech.speak(text, defaultOptions);
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  }

  static async speakWithCallback(
    text: string, 
    onStart?: () => void,
    onDone?: () => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      if (onStart) onStart();
      
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        onStart: onStart,
        onDone: onDone,
        onError: onError,
      });
    } catch (error) {
      console.error('Error in text-to-speech with callback:', error);
      if (onError) onError(error);
    }
  }

  static stop(): void {
    Speech.stop();
  }

  static isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }

  // Mock pronunciation analysis - in a real app, this would use a speech recognition service
  static async analyzePronunciation(
    audioUri: string,
    expectedText: string
  ): Promise<PronunciationResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock scoring based on audio length and expected text length
      // In reality, this would use services like Google Speech-to-Text, 
      // Azure Speech Services, or similar
      const baseScore = Math.random() * 40 + 60; // Random score between 60-100
      
      const result: PronunciationResult = {
        score: Math.round(baseScore),
        feedback: this.generateFeedback(baseScore),
        detailedScores: {
          accuracy: Math.round(baseScore + (Math.random() * 10 - 5)),
          fluency: Math.round(baseScore + (Math.random() * 10 - 5)),
          completeness: Math.round(baseScore + (Math.random() * 10 - 5)),
        },
        phonemes: this.generatePhonemeScores(expectedText, baseScore),
      };

      return result;
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      return {
        score: 0,
        feedback: 'Unable to analyze pronunciation. Please try again.',
        detailedScores: {
          accuracy: 0,
          fluency: 0,
          completeness: 0,
        },
        phonemes: [],
      };
    }
  }

  private static generateFeedback(score: number): string {
    if (score >= 90) {
      return 'Excellent pronunciation! You sound very clear and natural.';
    } else if (score >= 80) {
      return 'Good pronunciation! A few minor improvements could help.';
    } else if (score >= 70) {
      return 'Fair pronunciation. Focus on clarity and rhythm.';
    } else if (score >= 60) {
      return 'Keep practicing! Pay attention to vowel sounds and stress patterns.';
    } else {
      return 'Try speaking slower and focus on each word clearly.';
    }
  }

  private static generatePhonemeScores(text: string, baseScore: number): any[] {
    // Mock phoneme analysis
    const words = text.split(' ');
    return words.slice(0, 3).map((word, index) => ({
      phoneme: word.toLowerCase(),
      accuracy: Math.round(baseScore + (Math.random() * 20 - 10)),
      feedback: index === 0 ? 'Good stress pattern' : 'Clear pronunciation',
    }));
  }

  // Get available voices
  static async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }

  // Speak with specific voice
  static async speakWithVoice(text: string, voice: Speech.Voice): Promise<void> {
    try {
      await Speech.speak(text, {
        voice: voice.identifier,
        language: voice.language,
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Error speaking with specific voice:', error);
    }
  }
}
