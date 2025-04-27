import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text } from '../components';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';

export default function ProfileScreen() {
  const theme = useTheme<Theme>();

  // Mock user progress data
  const userProgress = {
    completedScenarios: ['cafe-1'],
    score: 250,
    level: 2,
    achievements: [
      {
        id: 'first-scenario',
        title: 'First Steps',
        description: 'Complete your first scenario',
        icon: '🏆',
        unlocked: true,
      },
      {
        id: 'coffee-master',
        title: 'Coffee Master',
        description: 'Order coffee like a pro',
        icon: '☕',
        unlocked: false,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Box padding="m">
        <Text variant="header" marginBottom="m">
          My Progress
        </Text>

        <Box
          backgroundColor="lightGray"
          padding="m"
          borderRadius={8}
          marginBottom="m"
        >
          <Text variant="body" marginBottom="s">
            Level: {userProgress.level}
          </Text>
          <Text variant="body" marginBottom="s">
            Score: {userProgress.score}
          </Text>
          <Text variant="body">
            Completed Scenarios: {userProgress.completedScenarios.length}
          </Text>
        </Box>

        <Text variant="header" marginBottom="m">
          Achievements
        </Text>

        {userProgress.achievements.map((achievement) => (
          <Box
            key={achievement.id}
            backgroundColor="lightGray"
            padding="m"
            borderRadius={8}
            marginBottom="m"
            opacity={achievement.unlocked ? 1 : 0.5}
          >
            <Text variant="body" marginBottom="s">
              {achievement.icon} {achievement.title}
            </Text>
            <Text variant="caption">
              {achievement.description}
            </Text>
          </Box>
        ))}
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