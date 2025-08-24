import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface BoxProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'card' | 'container' | 'button';
  animated?: boolean;
}

export const Box = ({ 
  children, 
  variant = 'container', 
  animated = false,
  style,
  ...props 
}: BoxProps) => {
  const theme = useTheme<Theme>();
  
  const baseStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.s,
    padding: theme.spacing.m,
  };

  const variantStyles = {
    card: {
      backgroundColor: theme.colors.lightGray,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.l,
      shadowColor: theme.colors.gray,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.spacing.s,
      padding: theme.spacing.m,
    },
  };

  const Component = animated ? Animated.View : View;

  return (
    <Component
      entering={animated ? FadeIn.duration(300) : undefined}
      exiting={animated ? FadeOut.duration(300) : undefined}
      style={[baseStyle, variantStyles[variant], style]}
      {...props}
    >
      {children}
    </Component>
  );
}; 