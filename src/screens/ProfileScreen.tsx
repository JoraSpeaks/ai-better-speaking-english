import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text } from '../components';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
          My Progress
        </Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
        >
          <Box
            variant="card"
            marginBottom="l"
          >
            <Text 
              variant="body" 
              marginBottom="s"
              style={styles.progressText}
            >
              Level: {userProgress.level}
            </Text>
            <Text 
              variant="body" 
              marginBottom="s"
              style={styles.progressText}
            >
              Score: {userProgress.score}
            </Text>
            <Text 
              variant="body"
              style={styles.progressText}
            >
              Completed Scenarios: {userProgress.completedScenarios.length}
            </Text>
          </Box>
        </Animated.View>

        <Text 
          variant="header" 
          marginBottom="l"
          animated
        >
          Achievements
        </Text>

        {userProgress.achievements.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={FadeInDown.delay(200 + index * 100).springify()}
          >
            <Box
              variant="card"
              marginBottom="m"
              style={[
                !achievement.unlocked && styles.lockedAchievement,
              ]}
            >
              <Text 
                variant="body" 
                marginBottom="s"
                style={styles.achievementTitle}
              >
                {achievement.icon} {achievement.title}
              </Text>
              <Text 
                variant="caption"
                style={styles.achievementDescription}
              >
                {achievement.description}
              </Text>
            </Box>
          </Animated.View>
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
  contentContainer: {
    paddingVertical: 24,
  },
  progressText: {
    fontSize: 16,
    lineHeight: 24,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  achievementDescription: {
    color: '#666',
    lineHeight: 20,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
}); 