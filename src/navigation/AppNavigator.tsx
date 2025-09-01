import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ScenarioScreen from '../screens/ScenarioScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import AIConversationScreen from '../screens/AIConversationScreen';

export type RootStackParamList = {
  Home: undefined;
  Scenario: { scenarioId: string };
  Profile: undefined;
  Flashcards: undefined;
  AIConversation: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  FlashcardsTab: undefined;
  AITab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    // @ts-ignore - Temporary fix for id prop type issue
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.lightGray,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Scenarios',
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color }) => <TabIcon name="🎯" color={color} />,
        }}
      />
      <Tab.Screen
        name="FlashcardsTab"
        component={FlashcardScreen}
        options={{
          title: 'Flashcards',
          tabBarLabel: 'Review',
          tabBarIcon: ({ color }) => <TabIcon name="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="AITab"
        component={AIConversationScreen}
        options={{
          title: 'AI Chat',
          tabBarLabel: 'AI Chat',
          tabBarIcon: ({ color }) => <TabIcon name="🤖" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'My Progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => <TabIcon name="📊" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple icon component using emojis
const TabIcon = ({ name, color }: { name: string; color: string }) => (
  <Text style={{ fontSize: 24, color, opacity: color === theme.colors.primary ? 1 : 0.6 }}>
    {name}
  </Text>
);

export default function AppNavigator() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {/* @ts-ignore - Temporary fix for id prop type issue */}
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
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Scenario"
            component={ScenarioScreen}
            options={({ route }) => ({ 
              title: route.params.scenarioId,
              presentation: 'modal'
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 
