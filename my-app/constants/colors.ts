import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/theme-store';

export const getColors = () => {
  const { mode } = useThemeStore();
  const systemColorScheme = useColorScheme();
  
  const isDarkMode = 
    mode === 'dark' || 
    (mode === 'system' && systemColorScheme === 'dark');

  return isDarkMode ? darkColors : lightColors;
};

export const lightColors = {
  background: '#F5F7FA',
  card: '#FFFFFF',
  cardAlt: '#F0F2F5',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  primary: '#3498db',
  secondary: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  success: '#2ecc71',
  border: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  statusSafe: '#2ecc71',
  statusWarning: '#f39c12',
  statusDanger: '#e74c3c',
  statusUnknown: '#95a5a6',
  statusActive: '#3498db',
  statusInactive: '#95a5a6',
  statusExpired: '#7f8c8d',
  statusVerified: '#2ecc71',
  statusUnverified: '#f39c12',
  sosButton: '#e74c3c',
  sosPulse: 'rgba(231, 76, 60, 0.3)',
};

export const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  cardAlt: '#252525',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  primary: '#3498db',
  secondary: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  success: '#2ecc71',
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.7)',
  statusSafe: '#2ecc71',
  statusWarning: '#f39c12',
  statusDanger: '#e74c3c',
  statusUnknown: '#95a5a6',
  statusActive: '#3498db',
  statusInactive: '#95a5a6',
  statusExpired: '#7f8c8d',
  statusVerified: '#2ecc71',
  statusUnverified: '#f39c12',
  sosButton: '#e74c3c',
  sosPulse: 'rgba(231, 76, 60, 0.3)',
};