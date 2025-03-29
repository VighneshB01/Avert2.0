import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { getColors } from '@/constants/colors';
import { Sun, Moon, Smartphone } from 'lucide-react-native';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();
  const colors = getColors();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun size={20} color={colors.text} />;
      case 'dark':
        return <Moon size={20} color={colors.text} />;
      case 'system':
        return <Smartphone size={20} color={colors.text} />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {getIcon()}
      <Text style={[styles.text, { color: colors.text }]}>{getLabel()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});