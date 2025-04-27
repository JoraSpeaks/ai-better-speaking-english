import { createTheme } from '@shopify/restyle';

const palette = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  background: '#FFFFFF',
  text: '#333333',
  error: '#FF3B30',
  success: '#34C759',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
};

export const theme = createTheme({
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    text: palette.text,
    error: palette.error,
    success: palette.success,
    gray: palette.gray,
    lightGray: palette.lightGray,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'text',
    },
    body: {
      fontSize: 16,
      color: 'text',
    },
    caption: {
      fontSize: 14,
      color: 'gray',
    },
  },
});

export type Theme = typeof theme; 