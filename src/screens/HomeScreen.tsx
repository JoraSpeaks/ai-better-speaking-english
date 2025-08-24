import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, Text, Button } from '../components';
import { scenarios } from '../data/scenarios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Animated, { FadeInDown } from 'react-native-reanimated';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
          Choose a Scenario
        </Text>
        
        {scenarios.map((scenario, index) => (
          <Animated.View
            key={scenario.id}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <Box
              variant="card"
              marginBottom="m"
              animated
            >
              <Text 
                variant="header" 
                marginBottom="s"
                style={styles.scenarioTitle}
              >
                {scenario.title}
              </Text>
              <Text 
                variant="body" 
                marginBottom="m"
                style={styles.scenarioDescription}
              >
                {scenario.description}
              </Text>
              <Button
                label="Start"
                onPress={() => navigation.navigate('Scenario', { scenarioId: scenario.id })}
                variant="primary"
                size="medium"
              />
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
  scenarioTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scenarioDescription: {
    color: '#666',
    lineHeight: 22,
  },
}); 