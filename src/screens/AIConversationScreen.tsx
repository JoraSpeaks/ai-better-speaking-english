import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text, Button } from '../components';
import { AIConversation } from '../components/AIConversation';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CONVERSATION_TOPICS = [
  { id: 'daily-life', title: 'Daily Life', description: 'Talk about your day, hobbies, and routines' },
  { id: 'travel', title: 'Travel & Adventures', description: 'Discuss places you\'ve been or want to visit' },
  { id: 'food', title: 'Food & Cooking', description: 'Chat about favorite foods and recipes' },
  { id: 'work', title: 'Work & Career', description: 'Discuss your job and professional goals' },
  { id: 'culture', title: 'Culture & Traditions', description: 'Share about your culture and learn about others' },
  { id: 'technology', title: 'Technology', description: 'Talk about gadgets, apps, and digital trends' },
  { id: 'environment', title: 'Environment', description: 'Discuss nature, climate, and sustainability' },
  { id: 'entertainment', title: 'Movies & Entertainment', description: 'Chat about films, music, and shows' },
];

export default function AIConversationScreen() {
  const navigation = useNavigation();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
  };

  const startConversation = () => {
    if (selectedTopic && selectedLevel) {
      setShowConversation(true);
    }
  };

  const handleConversationComplete = () => {
    setShowConversation(false);
    setSelectedTopic(null);
    setSelectedLevel(null);
  };

  if (showConversation && selectedTopic && selectedLevel) {
    const topic = CONVERSATION_TOPICS.find(t => t.id === selectedTopic);
    return (
      <AIConversation
        topic={topic?.title || 'General'}
        userLevel={selectedLevel}
        onComplete={handleConversationComplete}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Box variant="container">
        <Text variant="header" marginBottom="l" animated>
          AI Conversation Practice
        </Text>
        
        <Text variant="body" marginBottom="l" style={styles.description}>
          Practice natural conversations with our AI assistant. Choose a topic and your level to get started!
        </Text>

        {/* Topic Selection */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text variant="subheader" marginBottom="m">
            Choose a Topic
          </Text>
          
          <Box style={styles.topicsGrid}>
            {CONVERSATION_TOPICS.map((topic, index) => (
              <Animated.View
                key={topic.id}
                entering={FadeInDown.delay(index * 50)}
              >
                <Button
                  label={topic.title}
                  onPress={() => handleTopicSelect(topic.id)}
                  variant={selectedTopic === topic.id ? 'primary' : 'outline'}
                  size="medium"
                />
                <Text variant="caption" style={styles.topicDescription}>
                  {topic.description}
                </Text>
              </Animated.View>
            ))}
          </Box>
        </Animated.View>

        {/* Level Selection */}
        {selectedTopic && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.levelSection}>
            <Text variant="subheader" marginBottom="m">
              Choose Your Level
            </Text>
            
            <Box style={styles.levelContainer}>
              <Box style={styles.levelCard}>
                <Button
                  label="Beginner"
                  onPress={() => handleLevelSelect('beginner')}
                  variant={selectedLevel === 'beginner' ? 'primary' : 'outline'}
                  size="medium"
                />
                <Text variant="caption" style={styles.levelDescription}>
                  Simple vocabulary and short sentences
                </Text>
              </Box>
              
              <Box style={styles.levelCard}>
                <Button
                  label="Intermediate"
                  onPress={() => handleLevelSelect('intermediate')}
                  variant={selectedLevel === 'intermediate' ? 'primary' : 'outline'}
                  size="medium"
                />
                <Text variant="caption" style={styles.levelDescription}>
                  More complex conversations and grammar
                </Text>
              </Box>
              
              <Box style={styles.levelCard}>
                <Button
                  label="Advanced"
                  onPress={() => handleLevelSelect('advanced')}
                  variant={selectedLevel === 'advanced' ? 'primary' : 'outline'}
                  size="medium"
                />
                <Text variant="caption" style={styles.levelDescription}>
                  Sophisticated vocabulary and nuanced discussions
                </Text>
              </Box>
            </Box>
          </Animated.View>
        )}

        {/* Start Button */}
        {selectedTopic && selectedLevel && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.startSection}>
            <Button
              label="Start Conversation 🚀"
              onPress={startConversation}
              variant="primary"
              size="large"
            />
          </Animated.View>
        )}

        {/* Tips Section */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.tipsSection}>
          <Text variant="subheader" marginBottom="m">
            Conversation Tips
          </Text>
          
          <Box style={styles.tipCard}>
            <Text variant="body" style={styles.tipTitle}>💡 Be Natural</Text>
            <Text variant="caption">Don't worry about perfect grammar. Focus on communicating your ideas.</Text>
          </Box>
          
          <Box style={styles.tipCard}>
            <Text variant="body" style={styles.tipTitle}>🎯 Stay Engaged</Text>
            <Text variant="caption">Ask questions and share your opinions to keep the conversation flowing.</Text>
          </Box>
          
          <Box style={styles.tipCard}>
            <Text variant="body" style={styles.tipTitle}>🔄 Practice Regularly</Text>
            <Text variant="caption">Regular conversation practice is the best way to improve fluency.</Text>
          </Box>
        </Animated.View>
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
  description: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  topicDescription: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  levelSection: {
    marginTop: 24,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  levelCard: {
    alignItems: 'center',
    marginBottom: 16,
    minWidth: '30%',
  },
  levelDescription: {
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  startSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  tipsSection: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tipCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
});
