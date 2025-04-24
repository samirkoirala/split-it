// Color definitions
const teal = {
  50: '#E6F6F4',
  100: '#BFEAE3',
  200: '#96DCD1',
  300: '#6ECDBE',
  400: '#45C1AD',
  500: '#00BFA5', // primary
  600: '#00AC95',
  700: '#009682',
  800: '#008170',
  900: '#006C5C',
};

const coral = {
  50: '#FFF0ED',
  100: '#FFD6CC',
  200: '#FFB9A8',
  300: '#FF9C85',
  400: '#FF8C6C',
  500: '#FF7E67', // accent
  600: '#FF6A4E',
  700: '#FF5537',
  800: '#FF411F',
  900: '#FF2D0A',
};

const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

// Status colors
const success = {
  light: '#D1FAE5',
  main: '#10B981',
  dark: '#047857',
};

const warning = {
  light: '#FEF3C7',
  main: '#F59E0B',
  dark: '#B45309',
};

const error = {
  light: '#FEE2E2',
  main: '#EF4444',
  dark: '#B91C1C',
};

// Theme definitions
export const lightTheme = {
  primary: teal[500],
  primaryLight: teal[400],
  primaryDark: teal[600],
  accent: coral[500],
  accentLight: coral[400],
  accentDark: coral[600],
  
  background: '#FFFFFF',
  card: '#FFFFFF',
  surface: gray[50],
  border: gray[200],
  
  text: gray[900],
  textSecondary: gray[600],
  textTertiary: gray[400],
  textInverse: '#FFFFFF',
  
  success: success.main,
  successLight: success.light,
  successDark: success.dark,
  
  warning: warning.main,
  warningLight: warning.light,
  warningDark: warning.dark,
  
  error: error.main,
  errorLight: error.light,
  errorDark: error.dark,
  
  // Additional UI colors
  tabBar: '#FFFFFF',
  tabBarBorder: gray[200],
  tabBarActive: teal[500],
  tabBarInactive: gray[400],
  
  // Semantics
  positive: teal[500], // you are owed
  negative: coral[500], // you owe
  neutral: gray[500], // balanced
};

export const darkTheme = {
  primary: teal[400],
  primaryLight: teal[300],
  primaryDark: teal[500],
  accent: coral[400],
  accentLight: coral[300],
  accentDark: coral[500],
  
  background: gray[900],
  card: gray[800],
  surface: gray[700],
  border: gray[700],
  
  text: '#FFFFFF',
  textSecondary: gray[300],
  textTertiary: gray[500],
  textInverse: gray[900],
  
  success: success.main,
  successLight: success.light,
  successDark: success.dark,
  
  warning: warning.main,
  warningLight: warning.light,
  warningDark: warning.dark,
  
  error: error.main,
  errorLight: error.light,
  errorDark: error.dark,
  
  // Additional UI colors
  tabBar: gray[800],
  tabBarBorder: gray[700],
  tabBarActive: teal[400],
  tabBarInactive: gray[500],
  
  // Semantics
  positive: teal[400], // you are owed
  negative: coral[400], // you owe
  neutral: gray[500], // balanced
};

export default {
  light: lightTheme,
  dark: darkTheme,
};