import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text, Button } from '../components';
import { scenarios } from '../data/scenarios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Speech from 'expo-speech';
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

  if (!scenario) {
    return (
      <Box variant="container">
        <Text>Scenario not found</Text>
      </Box>
    );
  }

  const currentConversation = scenario.conversations[currentConversationIndex];

  const handleNext = () => {
    if (currentConversationIndex < scenario.conversations.length - 1) {
      setCurrentConversationIndex(currentConversationIndex + 1);
    }
  };

  const handleSpeak = async () => {
    if (currentConversation.audioUrl) {
      // Play audio file
      // Implementation needed
    } else {
      setIsSpeaking(true);
      await Speech.speak(currentConversation.text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Box variant="container">
        <Text
          variant="header"
          marginBottom="l"
          animated
        >
          {scenario.title}
        </Text>

        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Box
            variant="card"
            marginBottom="m"
          >
            <Text
              variant="body"
              marginBottom="m"
              style={styles.conversationText}
            >
              {currentConversation.text}
            </Text>

            {currentConversation.role === 'assistant' && (
              <Button
                label={isSpeaking ? "Speaking..." : "Listen"}
                onPress={handleSpeak}
                variant="secondary"
                disabled={isSpeaking}
                loading={isSpeaking}
              />
            )}
          </Box>

          {currentConversationIndex < scenario.conversations.length - 1 && (
            <Button
              label="Next"
              onPress={handleNext}
              variant="primary"
            />
          )}
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
  conversationText: {
    fontSize: 18,
    lineHeight: 26,
  },
}); 