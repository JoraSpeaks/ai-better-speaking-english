import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Text as RNText, Image } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Box } from './Box';
import { Text } from './Text';
import { Button } from './Button';

const getImageSource = (imageUrl: string) => {
    const images: Record<string, any> = {
        'good-morning.svg': require('../../assets/images/flashcards/good-morning.svg'),
        'how-are-you.svg': require('../../assets/images/flashcards/how-are-you.svg'),
        'nice-to-meet-you.svg': require('../../assets/images/flashcards/nice-to-meet-you.svg'),
        'boarding-pass.svg': require('../../assets/images/flashcards/boarding-pass.svg'),
        'departure-gate.svg': require('../../assets/images/flashcards/departure-gate.svg'),
        'taxi.svg': require('../../assets/images/flashcards/taxi.svg'),
        'menu.svg': require('../../assets/images/flashcards/menu.svg'),
        'bill-check.svg': require('../../assets/images/flashcards/bill-check.svg'),
        'appetizer.svg': require('../../assets/images/flashcards/appetizer.svg'),
        'receipt.svg': require('../../assets/images/flashcards/receipt.svg'),
    };
    return images[imageUrl];
};
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { Flashcard as FlashcardType } from '../types';
import { AudioService } from '../services/AudioService';

interface FlashcardProps {
    flashcard: FlashcardType;
    onDifficultySelected: (difficulty: 'easy' | 'medium' | 'hard') => void;
    showControls?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export const Flashcard = ({
    flashcard,
    onDifficultySelected,
    showControls = true
}: FlashcardProps) => {
    const theme = useTheme<Theme>();
    const [isFlipped, setIsFlipped] = useState(false);
    const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);

    const rotateY = useSharedValue(0);

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(rotateY.value, [0, 1], [0, 180]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(rotateY.value, [0, 1], [180, 360]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const handleFlip = () => {
        const newValue = isFlipped ? 0 : 1;
        rotateY.value = withTiming(newValue, { duration: 600 }, (finished) => {
            if (finished) {
                runOnJS(setIsFlipped)(!isFlipped);
                if (!isFlipped && showControls) {
                    runOnJS(setShowDifficultyButtons)(true);
                }
            }
        });
    };

    const handleAudioPlay = async () => {
        if (flashcard.audioUrl) {
            await AudioService.playAudio(flashcard.audioUrl);
        }
    };

    const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
        setShowDifficultyButtons(false);
        onDifficultySelected(difficulty);
    };

    const getDifficultyColor = () => {
        switch (flashcard.difficulty) {
            case 'beginner':
                return theme.colors.success;
            case 'intermediate':
                return theme.colors.primary;
            case 'advanced':
                return theme.colors.error;
            default:
                return theme.colors.gray;
        }
    };

    return (
        <Box style={styles.container}>
            <TouchableOpacity onPress={handleFlip} activeOpacity={0.8}>
                <Box style={styles.cardContainer}>
                    {/* Front of card */}
                    <Animated.View style={[styles.card, frontAnimatedStyle]}>
                        <Box
                            style={[
                                styles.cardContent,
                                { backgroundColor: theme.colors.background }
                            ]}
                        >
                            <Box
                                style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor() }
                                ]}
                            >
                                <RNText style={styles.difficultyText}>
                                    {flashcard.difficulty.toUpperCase()}
                                </RNText>
                            </Box>

                            <Box style={styles.categoryBadge}>
                                <RNText style={styles.categoryText}>
                                    {flashcard.category.toUpperCase()}
                                </RNText>
                            </Box>

                            <Box style={styles.cardBody}>
                                {flashcard.imageUrl && (
                                    <Image
                                        source={getImageSource(flashcard.imageUrl)}
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                    />
                                )}

                                <RNText style={styles.cardText}>
                                    {flashcard.front}
                                </RNText>

                                {flashcard.audioUrl && (
                                    <TouchableOpacity
                                        onPress={handleAudioPlay}
                                        style={styles.audioButton}
                                    >
                                        <RNText style={styles.audioButtonText}>🔊</RNText>
                                    </TouchableOpacity>
                                )}

                                <RNText style={styles.flipHint}>Tap to see answer</RNText>
                            </Box>
                        </Box>
                    </Animated.View>

                    {/* Back of card */}
                    <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
                        <Box
                            style={[
                                styles.cardContent,
                                { backgroundColor: theme.colors.lightGray }
                            ]}
                        >
                            <Box style={styles.cardBody}>
                                <RNText style={styles.cardText}>
                                    {flashcard.back}
                                </RNText>

                                {flashcard.example && (
                                    <Box style={styles.exampleContainer}>
                                        <RNText style={styles.exampleLabel}>Example:</RNText>
                                        <RNText style={styles.exampleText}>
                                            "{flashcard.example}"
                                        </RNText>
                                    </Box>
                                )}

                                <RNText style={styles.flipHint}>Tap to flip back</RNText>
                            </Box>
                        </Box>
                    </Animated.View>
                </Box>
            </TouchableOpacity>

            {showDifficultyButtons && showControls && (
                <Animated.View style={styles.difficultyContainer}>
                    <RNText style={styles.difficultyPrompt}>
                        How well did you know this?
                    </RNText>
                    <Box style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.difficultyButton}
                            onPress={() => handleDifficultySelect('hard')}
                        >
                            <RNText style={styles.difficultyButtonText}>Hard 😰</RNText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.difficultyButton}
                            onPress={() => handleDifficultySelect('medium')}
                        >
                            <RNText style={styles.difficultyButtonText}>Medium 🤔</RNText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.difficultyButton}
                            onPress={() => handleDifficultySelect('easy')}
                        >
                            <RNText style={styles.difficultyButtonText}>Easy 😊</RNText>
                        </TouchableOpacity>
                    </Box>
                </Animated.View>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 300,
        position: 'relative',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backCard: {
        zIndex: -1,
    },
    cardContent: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
    },
    difficultyBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    categoryBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#666',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    cardImage: {
        width: 120,
        height: 90,
        marginBottom: 15,
        borderRadius: 8,
    },
    cardText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    audioButton: {
        marginTop: 10,
        padding: 10,
    },
    audioButtonText: {
        fontSize: 24,
    },
    flipHint: {
        position: 'absolute',
        bottom: 20,
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    exampleContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        width: '100%',
    },
    exampleLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    exampleText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    difficultyContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    difficultyPrompt: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    difficultyButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    difficultyButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
