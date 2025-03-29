import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '@/constants/colors';

// This is a placeholder screen that won't actually be navigated to
// The SOS functionality is handled by the SOSButton component
export default function SOSScreen() {
  const colors = getColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>SOS Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});