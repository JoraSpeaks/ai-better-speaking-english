import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme, TextProps as RestyleTextProps } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface TextProps extends RestyleTextProps<Theme> {
  variant?: keyof Theme['textVariants'];
  animated?: boolean;
  children: React.ReactNode;
}

export const Text = ({
  variant = 'body',
  animated = false,
  style,
  children,
  ...props
}: TextProps) => {
  const theme = useTheme<Theme>();
  const Component = animated ? Animated.Text : RNText;

  return (
    <Component
      entering={animated ? FadeIn.duration(300) : undefined}
      exiting={animated ? FadeOut.duration(300) : undefined}
      style={[
        theme.textVariants[variant],
        styles.text,
        style,
      ]}
      {...props}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
}); 