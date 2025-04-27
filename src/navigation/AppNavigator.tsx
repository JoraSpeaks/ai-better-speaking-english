import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ScenarioScreen from '../screens/ScenarioScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Scenario: { scenarioId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'English Immersion' }}
          />
          <Stack.Screen
            name="Scenario"
            component={ScenarioScreen}
            options={({ route }) => ({ title: route.params.scenarioId })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'My Progress' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 