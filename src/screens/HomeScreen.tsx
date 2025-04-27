import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, Text, Button } from '../components';
import { scenarios } from '../data/scenarios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <Box padding="m">
        <Text variant="header" marginBottom="m">
          Choose a Scenario
        </Text>
        {scenarios.map((scenario) => (
          <Box
            key={scenario.id}
            marginBottom="m"
            padding="m"
            backgroundColor="lightGray"
            borderRadius={8}
          >
            <Text variant="header" marginBottom="s">
              {scenario.title}
            </Text>
            <Text variant="body" marginBottom="m">
              {scenario.description}
            </Text>
            <Button
              label="Start"
              onPress={() => navigation.navigate('Scenario', { scenarioId: scenario.id })}
            />
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