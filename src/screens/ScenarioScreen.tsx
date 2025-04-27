import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text, Button } from '../components';
import { scenarios } from '../data/scenarios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Speech from 'expo-speech';

type ScenarioScreenRouteProp = RouteProp<RootStackParamList, 'Scenario'>;

interface Props {
  route: ScenarioScreenRouteProp;
}

export default function ScenarioScreen({ route }: Props) {
  const { scenarioId } = route.params;
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  if (!scenario) {
    return (
      <Box padding="m">
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

  const handleSpeak = () => {
    if (currentConversation.audioUrl) {
      // Play audio file
      // Implementation needed
    } else {
      Speech.speak(currentConversation.text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Box padding="m">
        <Text variant="header" marginBottom="m">
          {scenario.title}
        </Text>
        
        <Box
          backgroundColor="lightGray"
          padding="m"
          borderRadius={8}
          marginBottom="m"
        >
          <Text variant="body" marginBottom="s">
            {currentConversation.text}
          </Text>
          
          {currentConversation.role === 'assistant' && (
            <Button
              label="Listen"
              onPress={handleSpeak}
              variant="secondary"
            />
          )}
        </Box>

        {currentConversationIndex < scenario.conversations.length - 1 && (
          <Button
            label="Next"
            onPress={handleNext}
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
}); 