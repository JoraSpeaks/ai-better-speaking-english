import { createTheme } from '@shopify/restyle';

const palette = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  background: '#FFFFFF',
  text: '#333333',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  white: '#FFFFFF',
  black: '#000000',
};

export const theme = createTheme({
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    text: palette.text,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    gray: palette.gray,
    lightGray: palette.lightGray,
    white: palette.white,
    black: palette.black,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    xxl: 80,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'text',
    },
    subheader: {
      fontSize: 20,
      fontWeight: '600',
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
    small: {
      fontSize: 12,
      color: 'gray',
    },
  },
  boxVariants: {
    container: {
      padding: 'l',
    },
    card: {
      backgroundColor: 'background',
      borderRadius: 12,
      padding: 'l',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
});

export type Theme = typeof theme; 