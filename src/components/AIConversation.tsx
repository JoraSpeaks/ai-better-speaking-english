import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Box, Text, Button } from '../components';
import { PronunciationPractice } from '../components/PronunciationPractice';
import { AIMessage, AIConversationState } from '../types';
import { SpeechService } from '../services/SpeechService';
import { StorageService } from '../services/StorageService';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

interface AIConversationProps {
  topic: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: () => void;
}

const AI_RESPONSES = {
  beginner: {
    greetings: [
      "Hello! Nice to meet you. What's your name?",
      "Hi there! How are you today?",
      "Good morning! I hope you're having a great day!",
    ],
    followUps: [
      "That's interesting! Can you tell me more?",
      "I see. What do you think about that?",
      "That sounds good. What else would you like to talk about?",
    ],
    encouragement: [
      "Great job! Your English is improving!",
      "Well done! Keep practicing!",
      "Excellent! You're doing very well!",
    ],
  },
  intermediate: {
    greetings: [
      "Hello! I'd love to have a conversation with you today. What topics interest you?",
      "Hi! Let's practice having a natural conversation. What's on your mind?",
      "Good to see you! What would you like to discuss today?",
    ],
    followUps: [
      "That's a fascinating perspective. How did you come to that conclusion?",
      "I understand your point. Could you elaborate on that?",
      "That's quite interesting. What are your thoughts on the implications of that?",
    ],
    encouragement: [
      "Your vocabulary and sentence structure are really improving!",
      "I notice you're using more complex expressions. Great progress!",
      "Your fluency is getting much better. Keep up the excellent work!",
    ],
  },
  advanced: {
    greetings: [
      "Hello! I'm delighted to engage in a sophisticated conversation with you. What complex topics would you like to explore?",
      "Greetings! Let's delve into some thought-provoking discussions. What subject matter captures your intellectual curiosity?",
      "Good day! I'm eager to discuss nuanced topics with you. What would you like to debate or analyze?",
    ],
    followUps: [
      "That's a remarkably insightful observation. How do you reconcile that with alternative viewpoints?",
      "Your analysis demonstrates sophisticated thinking. What evidence supports your hypothesis?",
      "That's a compelling argument. How might critics challenge your position?",
    ],
    encouragement: [
      "Your command of idiomatic expressions and nuanced language is impressive!",
      "I'm amazed by your sophisticated vocabulary and complex sentence structures!",
      "Your ability to articulate abstract concepts is truly advanced. Remarkable progress!",
    ],
  },
};

export const AIConversation = ({ topic, userLevel, onComplete }: AIConversationProps) => {
  const [conversationState, setConversationState] = useState<AIConversationState>({
    isActive: true,
    context: topic,
    userLevel,
    topic,
    messages: [],
  });
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    // Start conversation with AI greeting
    startConversation();

    return () => {
      // Track study time
      const studyTime = Math.floor((Date.now() - sessionStartTime) / 60000);
      if (studyTime > 0) {
        StorageService.addStudyTime(studyTime);
      }
    };
  }, []);

  const startConversation = () => {
    const greetings = AI_RESPONSES[userLevel].greetings;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'ai',
      text: greeting,
      timestamp: new Date(),
    };

    setConversationState(prev => ({
      ...prev,
      messages: [aiMessage],
    }));

    // Speak the greeting
    setTimeout(() => {
      SpeechService.speak(greeting);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userInput.trim(),
      timestamp: new Date(),
    };

    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setCurrentUserMessage(userInput.trim());
    setUserInput('');
    setShowPronunciation(true);
  };

  const handlePronunciationComplete = (score: number) => {
    setShowPronunciation(false);
    
    // Update the user message with pronunciation score
    setConversationState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.text === currentUserMessage && msg.role === 'user'
          ? { ...msg, pronunciationScore: score }
          : msg
      ),
    }));

    // Generate AI response
    generateAIResponse(currentUserMessage, score);
  };

  const generateAIResponse = async (userMessage: string, pronunciationScore: number) => {
    setIsTyping(true);
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = '';
    const responses = AI_RESPONSES[userLevel];

    // Choose response type based on conversation length and pronunciation score
    if (conversationState.messages.length < 4) {
      // Early conversation - use follow-ups
      response = responses.followUps[Math.floor(Math.random() * responses.followUps.length)];
    } else if (pronunciationScore >= 85) {
      // Good pronunciation - use encouragement
      response = responses.encouragement[Math.floor(Math.random() * responses.encouragement.length)];
    } else {
      // Continue conversation
      response = responses.followUps[Math.floor(Math.random() * responses.followUps.length)];
    }

    // Add context-aware responses based on topic
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = "Hello! It's great to practice English with you. " + response;
    } else if (userMessage.toLowerCase().includes('thank')) {
      response = "You're very welcome! " + response;
    }

    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
    }));

    // Speak the response
    setTimeout(() => {
      SpeechService.speak(response);
    }, 500);
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      'Are you sure you want to end this conversation?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            const avgScore = conversationState.messages
              .filter(msg => msg.role === 'user' && msg.pronunciationScore)
              .reduce((acc, msg, _, arr) => acc + (msg.pronunciationScore! / arr.length), 0);
            
            Alert.alert(
              'Conversation Complete! 🎉',
              `Great practice session! ${avgScore > 0 ? `Average pronunciation: ${Math.round(avgScore)}%` : ''}`,
              [{ text: 'Done', onPress: onComplete }]
            );
          },
        },
      ]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#FF9800';
    if (score >= 70) return '#FFC107';
    return '#F44336';
  };

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Text variant="header">AI Conversation</Text>
        <Text variant="caption">Topic: {topic} | Level: {userLevel}</Text>
        <Button
          label="End Conversation"
          onPress={handleEndConversation}
          variant="outline"
          size="small"
        />
      </Box>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {conversationState.messages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInUp.delay(index * 100)}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text variant="body" style={styles.messageText}>
              {message.text}
            </Text>
            {message.role === 'user' && message.pronunciationScore && (
              <Text 
                style={[
                  styles.scoreText,
                  { color: getScoreColor(message.pronunciationScore) }
                ]}
              >
                Pronunciation: {message.pronunciationScore}%
              </Text>
            )}
            <Text variant="small" style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString()}
            </Text>
          </Animated.View>
        ))}
        
        {isTyping && (
          <Animated.View
            entering={FadeInUp}
            style={[styles.messageContainer, styles.aiMessage]}
          >
            <Text variant="body" style={styles.typingText}>
              AI is typing...
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {showPronunciation ? (
        <Box style={styles.pronunciationContainer}>
          <PronunciationPractice
            text={currentUserMessage}
            onComplete={handlePronunciationComplete}
            showControls={false}
          />
        </Box>
      ) : (
        <Animated.View entering={FadeInDown} style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your response here..."
            multiline
            maxLength={200}
          />
          <Button
            label="Send & Practice"
            onPress={handleSendMessage}
            variant="primary"
            disabled={!userInput.trim() || isTyping}
          />
        </Animated.View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    color: '#fff',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: '#fff',
  },
  timestamp: {
    marginTop: 4,
    opacity: 0.7,
    color: '#fff',
  },
  typingText: {
    fontStyle: 'italic',
    color: '#666',
  },
  pronunciationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 60,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
