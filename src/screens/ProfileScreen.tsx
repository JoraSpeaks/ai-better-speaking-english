import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Box, Text, Button } from '../components';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { UserProgress, Achievement } from '../types';
import { StorageService } from '../services/StorageService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Progress from 'react-native-progress';

export default function ProfileScreen() {
  const theme = useTheme<Theme>();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await StorageService.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            await loadUserProgress();
          },
        },
      ]
    );
  };

  const getProgressToNextLevel = () => {
    if (!userProgress) return 0;
    const currentLevelScore = (userProgress.level - 1) * 500;
    const nextLevelScore = userProgress.level * 500;
    const progress = (userProgress.score - currentLevelScore) / (nextLevelScore - currentLevelScore);
    return Math.max(0, Math.min(1, progress));
  };

  const getAveragePronunciationScore = () => {
    if (!userProgress || Object.keys(userProgress.pronunciationScores).length === 0) {
      return 0;
    }
    const scores = Object.values(userProgress.pronunciationScores);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getVocabularyMasteryCount = () => {
    if (!userProgress) return 0;
    return Object.values(userProgress.vocabularyMastery).filter(mastery => mastery >= 80).length;
  };

  const renderStatCard = (title: string, value: string | number, subtitle?: string, color?: string) => (
    <Box
      style={[
        styles.statCard,
        { backgroundColor: color || theme.colors.lightGray }
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Box>
  );

  const renderAchievement = (achievement: Achievement, index: number) => (
    <Animated.View
      key={achievement.id}
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <Box
        style={[
          styles.achievementCard,
          {
            backgroundColor: achievement.unlocked ? theme.colors.lightGray : '#f0f0f0',
            opacity: achievement.unlocked ? 1 : 0.6,
          }
        ]}
      >
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <Box style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          {achievement.unlocked && achievement.unlockedDate && (
            <Text style={styles.achievementDate}>
              Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
            </Text>
          )}
        </Box>
        {achievement.unlocked && (
          <Text style={styles.unlockedBadge}>✓</Text>
        )}
      </Box>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <Box variant="container" style={styles.centerContainer}>
        <Text>Loading your progress...</Text>
      </Box>
    );
  }

  if (!userProgress) {
    return (
      <Box variant="container" style={styles.centerContainer}>
        <Text>Error loading progress data</Text>
      </Box>
    );
  }

  const unlockedAchievements = userProgress.achievements.filter(a => a.unlocked);
  const lockedAchievements = userProgress.achievements.filter(a => !a.unlocked);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Box variant="container">
        <Text variant="header" marginBottom="l" animated>
          My Progress
        </Text>

        {/* Level Progress */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Box variant="card" marginBottom="m">
            <Text style={styles.levelTitle}>Level {userProgress.level}</Text>
            <Text style={styles.scoreText}>{userProgress.score} points</Text>

            <Box style={styles.progressContainer}>
              <Progress.Bar
                progress={getProgressToNextLevel()}
                width={null}
                height={8}
                color={theme.colors.primary}
                unfilledColor={theme.colors.lightGray}
                borderWidth={0}
                borderRadius={4}
              />
              <Text style={styles.progressText}>
                {Math.round(getProgressToNextLevel() * 100)}% to Level {userProgress.level + 1}
              </Text>
            </Box>
          </Box>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Box style={styles.statsGrid}>
            {renderStatCard(
              'Scenarios Completed',
              userProgress.completedScenarios.length,
              undefined,
              theme.colors.primary + '20'
            )}
            {renderStatCard(
              'Daily Streak',
              userProgress.dailyStreak,
              'days',
              theme.colors.secondary + '20'
            )}
            {renderStatCard(
              'Study Time',
              userProgress.totalStudyTime,
              'minutes',
              theme.colors.success + '20'
            )}
            {renderStatCard(
              'Avg. Pronunciation',
              `${getAveragePronunciationScore()}%`,
              undefined,
              theme.colors.error + '20'
            )}
            {renderStatCard(
              'Vocabulary Learned',
              getVocabularyMasteryCount(),
              'words',
              '#FFA500' + '20'
            )}
            {renderStatCard(
              'Achievements',
              unlockedAchievements.length,
              `of ${userProgress.achievements.length}`,
              '#9C27B0' + '20'
            )}
          </Box>
        </Animated.View>

        {/* Achievements Section */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text variant="header" marginBottom="m" marginTop="l">
            Achievements
          </Text>

          {unlockedAchievements.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Unlocked ({unlockedAchievements.length})</Text>
              {unlockedAchievements.map((achievement, index) =>
                renderAchievement(achievement, index)
              )}
            </>
          )}

          {lockedAchievements.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Locked ({lockedAchievements.length})</Text>
              {lockedAchievements.slice(0, 5).map((achievement, index) =>
                renderAchievement(achievement, index + unlockedAchievements.length)
              )}
            </>
          )}
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Box style={styles.settingsContainer}>
            <Text variant="header" marginBottom="m">
              Settings
            </Text>

            <Button
              label="Reset All Progress"
              onPress={handleResetProgress}
              variant="outline"
              size="medium"
            />
          </Box>
        </Animated.View>
      </Box>
    </ScrollView>
  );
}
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
        </Animated.View >

  <Text
    variant="header"
    marginBottom="l"
    animated
  >
    Achievements
  </Text>

{
  userProgress.achievements.map((achievement, index) => (
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
  ))
}
      </Box >
    </ScrollView >
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  unlockedBadge: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  settingsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
}); 