import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Box, Text } from '../components';
import { Flashcard } from '../components/Flashcard';
import { Button } from '../components/Button';
import { Flashcard as FlashcardType } from '../types';
import { StorageService } from '../services/StorageService';
import { flashcardCategories } from '../data/flashcards';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FlashcardScreen() {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState<'all' | 'due' | 'learned'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, [selectedCategory, reviewMode]);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      let allFlashcards = await StorageService.getFlashcards();
      
      // Filter by category
      if (selectedCategory) {
        allFlashcards = allFlashcards.filter(fc => fc.category === selectedCategory);
      }
      
      // Filter by review mode
      switch (reviewMode) {
        case 'due':
          allFlashcards = allFlashcards.filter(fc => {
            if (!fc.lastReviewed) return true;
            const daysSinceReview = Math.floor(
              (Date.now() - new Date(fc.lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysSinceReview >= fc.interval;
          });
          break;
        case 'learned':
          allFlashcards = allFlashcards.filter(fc => fc.isLearned);
          break;
        default:
          // Show all
          break;
      }
      
      // Shuffle for better learning
      const shuffled = [...allFlashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      Alert.alert('Error', 'Failed to load flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultySelected = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentFlashcard = flashcards[currentIndex];
    if (!currentFlashcard) return;

    // Calculate new ease factor and interval using spaced repetition algorithm
    let newEaseFactor = currentFlashcard.easeFactor;
    let newInterval = currentFlashcard.interval;
    
    switch (difficulty) {
      case 'easy':
        newEaseFactor = Math.max(1.3, newEaseFactor + 0.1);
        newInterval = Math.ceil(newInterval * newEaseFactor);
        break;
      case 'medium':
        newInterval = Math.ceil(newInterval * newEaseFactor);
        break;
      case 'hard':
        newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
        newInterval = 1; // Reset to review tomorrow
        break;
    }

    const updatedFlashcard: FlashcardType = {
      ...currentFlashcard,
      easeFactor: newEaseFactor,
      interval: newInterval,
      lastReviewed: new Date(),
      reviewCount: currentFlashcard.reviewCount + 1,
      isLearned: difficulty === 'easy' && currentFlashcard.reviewCount >= 2,
    };

    await StorageService.updateFlashcard(updatedFlashcard);
    
    // Update vocabulary mastery
    const mastery = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 70 : 40;
    await StorageService.updateVocabularyMastery(currentFlashcard.id, mastery);

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of deck
      Alert.alert(
        'Session Complete!',
        `You've reviewed ${flashcards.length} cards. Great job!`,
        [
          { text: 'Review Again', onPress: () => setCurrentIndex(0) },
          { text: 'Done', onPress: () => {} },
        ]
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderCategorySelector = () => (
    <Box style={styles.categoryContainer}>
      <Text variant="header" marginBottom="m">Choose Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Button
          label="All"
          onPress={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'primary' : 'outline'}
          size="small"
        />
        {flashcardCategories.map(category => (
          <Box key={category} marginLeft="s">
            <Button
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              onPress={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="small"
            />
          </Box>
        ))}
      </ScrollView>
    </Box>
  );

  const renderModeSelector = () => (
    <Box style={styles.modeContainer}>
      <Text variant="body" marginBottom="s">Study Mode:</Text>
      <Box style={styles.modeButtons}>
        <Button
          label="All Cards"
          onPress={() => setReviewMode('all')}
          variant={reviewMode === 'all' ? 'primary' : 'outline'}
          size="small"
        />
        <Button
          label="Due Today"
          onPress={() => setReviewMode('due')}
          variant={reviewMode === 'due' ? 'primary' : 'outline'}
          size="small"
        />
        <Button
          label="Learned"
          onPress={() => setReviewMode('learned')}
          variant={reviewMode === 'learned' ? 'primary' : 'outline'}
          size="small"
        />
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Box variant="container" style={styles.centerContainer}>
        <Text>Loading flashcards...</Text>
      </Box>
    );
  }

  if (flashcards.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <Box variant="container">
          {renderCategorySelector()}
          {renderModeSelector()}
          
          <Box style={styles.centerContainer}>
            <Text variant="header" marginBottom="m">
              No cards to review!
            </Text>
            <Text variant="body" style={styles.centerText}>
              {reviewMode === 'due' 
                ? "You're all caught up! Check back tomorrow for more cards to review."
                : "Try selecting a different category or mode."
              }
            </Text>
            <Button
              label="Show All Cards"
              onPress={() => {
                setReviewMode('all');
                setSelectedCategory(null);
              }}
              variant="primary"
            />
          </Box>
        </Box>
      </ScrollView>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <ScrollView style={styles.container}>
      <Box variant="container">
        {renderCategorySelector()}
        {renderModeSelector()}
        
        <Box style={styles.progressContainer}>
          <Text variant="body">
            Card {currentIndex + 1} of {flashcards.length}
          </Text>
          <Box style={styles.progressBar}>
            <Box 
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / flashcards.length) * 100}%` }
              ]} 
            />
          </Box>
        </Box>

        <Animated.View
          key={currentFlashcard.id}
          entering={FadeInDown.delay(100)}
        >
          <Flashcard
            flashcard={currentFlashcard}
            onDifficultySelected={handleDifficultySelected}
          />
        </Animated.View>

        <Box style={styles.navigationContainer}>
          <Button
            label="Previous"
            onPress={handlePrevious}
            variant="outline"
            disabled={currentIndex === 0}
          />
          <Button
            label="Skip"
            onPress={handleNext}
            variant="secondary"
            disabled={currentIndex === flashcards.length - 1}
          />
        </Box>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  centerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  modeContainer: {
    marginBottom: 20,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
