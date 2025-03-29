import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { getColors } from '@/constants/colors';
import ResourcesList from '@/components/ResourceList';
import { resourcesData } from '@/constants/mock-data';

export default function ResourcesScreen() {
  const colors = getColors();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ResourcesList resources={resourcesData} />
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