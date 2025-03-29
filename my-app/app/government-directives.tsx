import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { getColors } from '@/constants/colors';
import { useDisasterStore } from '@/store/disaster-store';
import GovernmentDirectivesList from '@/components/GovernmenDirectivesList';

export default function GovernmentDirectivesScreen() {
  const { governmentDirectives } = useDisasterStore();
  const colors = getColors();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <GovernmentDirectivesList directives={governmentDirectives} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});