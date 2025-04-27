import React from 'react';
import { View, Text as RNText, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';

// Box component
export const Box = ({ children, ...props }: any) => {
  return <View {...props}>{children}</View>;
};

// Text component
export const Text = ({ variant = 'body', style, ...props }) => {
  const theme = useTheme<Theme>();
  return (
    <RNText
      style={[
        theme.textVariants[variant],
        style,
      ]}
      {...props}
    />
  );
};

// Button component
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onPress, variant = 'primary' }: ButtonProps) => {
  const theme = useTheme<Theme>();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant === 'primary' ? theme.colors.primary : theme.colors.secondary,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 